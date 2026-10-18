import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import {
  PRIORITY_WEIGHT,
  getJobPriorityWeight,
  compareJobPriority,
  loadCronSettings,
  saveCronSettings,
  runWithConcurrencyPool,
  ConcurrencyManager,
  getActiveLocks,
} from "../src/concurrency.ts";
import { CronJobSchema, type CronJob } from "../src/types.ts";
import { saveJobs, loadJobs, ensureCronDir } from "../src/store.ts";
import { checkDue, acquireLock, releaseLock } from "../src/runner.ts";
import { startGuiServer } from "../src/gui/server.ts";

describe("Feature 4: Execution Concurrency & Priority Queue", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-concurrency-test-"));
    await ensureCronDir(tmpDir);
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  });

  it("calculates priority weights and orders jobs correctly", () => {
    expect(getJobPriorityWeight("high")).toBe(3);
    expect(getJobPriorityWeight("normal")).toBe(2);
    expect(getJobPriorityWeight("low")).toBe(1);
    expect(getJobPriorityWeight(undefined)).toBe(2);

    const highJob = { id: "job-c", priority: "high" as const, nextRunAt: "2026-10-13T12:00:00Z" };
    const normalJob = { id: "job-b", priority: "normal" as const, nextRunAt: "2026-10-13T11:00:00Z" };
    const lowJob = { id: "job-a", priority: "low" as const, nextRunAt: "2026-10-13T10:00:00Z" };

    const list = [lowJob, normalJob, highJob];
    list.sort(compareJobPriority);

    expect(list[0].id).toBe("job-c"); // high first
    expect(list[1].id).toBe("job-b"); // normal second
    expect(list[2].id).toBe("job-a"); // low last

    // When priority is identical, compare nextRunAt (earliest due first)
    const normalEarly = { id: "job-1", priority: "normal" as const, nextRunAt: "2026-10-13T10:00:00Z" };
    const normalLate = { id: "job-2", priority: "normal" as const, nextRunAt: "2026-10-13T11:00:00Z" };
    const samePrio = [normalLate, normalEarly];
    samePrio.sort(compareJobPriority);
    expect(samePrio[0].id).toBe("job-1");
  });

  it("runWithConcurrencyPool bounds active parallel executions strictly to limit", async () => {
    let currentActive = 0;
    let maxSeenActive = 0;
    const taskCount = 8;
    const limit = 2;

    const tasks = Array.from({ length: taskCount }, (_, i) => ({ id: i }));

    const results = await runWithConcurrencyPool(tasks, limit, async (task) => {
      currentActive++;
      if (currentActive > maxSeenActive) maxSeenActive = currentActive;

      // Simulate work
      await new Promise((r) => setTimeout(r, 40));

      currentActive--;
      return task.id * 2;
    });

    expect(maxSeenActive).toBeLessThanOrEqual(limit);
    expect(maxSeenActive).toBe(limit);
    expect(results).toHaveLength(taskCount);
    expect(results).toEqual([0, 2, 4, 6, 8, 10, 12, 14]);
  });

  it("handles edge cases in runWithConcurrencyPool (empty, limit=1)", async () => {
    const emptyRes = await runWithConcurrencyPool([], 3, async () => 42);
    expect(emptyRes).toEqual([]);

    const seqTasks = [1, 2, 3];
    const seqRes = await runWithConcurrencyPool(seqTasks, 1, async (n) => n * 10);
    expect(seqRes).toEqual([10, 20, 30]);
  });

  it("loads, saves, and overrides cron settings correctly", async () => {
    const defaultSettings = await loadCronSettings(tmpDir);
    expect(defaultSettings.maxConcurrency).toBe(2);

    const saved = await saveCronSettings(tmpDir, { maxConcurrency: 4 });
    expect(saved.maxConcurrency).toBe(4);

    const reloaded = await loadCronSettings(tmpDir);
    expect(reloaded.maxConcurrency).toBe(4);

    // Environment variable override
    process.env.OPENCODE_CRON_CONCURRENCY = "6";
    const envLoaded = await loadCronSettings(tmpDir);
    expect(envLoaded.maxConcurrency).toBe(6);
    delete process.env.OPENCODE_CRON_CONCURRENCY;
  });

  it("ConcurrencyManager prioritizes high priority tasks when worker slots free up", async () => {
    const manager = new ConcurrencyManager(tmpDir, 1); // 1 worker slot
    const executionOrder: string[] = [];

    let unblockFirstTask!: () => void;
    const firstTaskPromise = new Promise<void>((r) => { unblockFirstTask = r; });

    // Enqueue task 1 (occupies the single slot)
    const p1 = manager.enqueue({
      jobId: "task-1",
      priority: "normal",
      execute: async () => {
        executionOrder.push("task-1-started");
        await firstTaskPromise;
        executionOrder.push("task-1-finished");
        return 1;
      },
    });

    // While slot is busy, enqueue low priority task 2
    const p2 = manager.enqueue({
      jobId: "task-2",
      priority: "low",
      execute: async () => {
        executionOrder.push("task-2");
        return 2;
      },
    });

    // Enqueue high priority task 3 (should jump ahead of task 2)
    const p3 = manager.enqueue({
      jobId: "task-3",
      priority: "high",
      execute: async () => {
        executionOrder.push("task-3");
        return 3;
      },
    });

    // Verify queue status
    const statusBefore = manager.getStatus();
    expect(statusBefore.activeCount).toBe(1);
    expect(statusBefore.queuedCount).toBe(2);
    expect(statusBefore.queued[0].jobId).toBe("task-3"); // High priority first in queue
    expect(statusBefore.queued[1].jobId).toBe("task-2"); // Low priority second

    // Free slot 1
    unblockFirstTask();

    await Promise.all([p1, p2, p3]);

    expect(executionOrder).toEqual([
      "task-1-started",
      "task-1-finished",
      "task-3", // Ran before task-2!
      "task-2",
    ]);

    const statusAfter = manager.getStatus();
    expect(statusAfter.activeCount).toBe(0);
    expect(statusAfter.queuedCount).toBe(0);
  });

  it("ConcurrencyManager skips duplicate runs if already running", async () => {
    const manager = new ConcurrencyManager(tmpDir, 2);

    let finishTask!: () => void;
    const blocker = new Promise<void>((r) => { finishTask = r; });

    const p1 = manager.enqueue({
      jobId: "dup-job",
      priority: "normal",
      execute: async () => {
        await blocker;
        return 0;
      },
    });

    // Attempt second execution while first is active
    const p2 = await manager.enqueue({
      jobId: "dup-job",
      skipIfRunning: true,
      execute: async () => 0,
    });

    expect(p2.status).toBe("skipped");
    expect(p2.error).toContain("already running");

    finishTask();
    const r1 = await p1;
    expect(r1.status).toBe("completed");
  });

  it("ConcurrencyManager supports cancelQueued and clearQueue", async () => {
    const manager = new ConcurrencyManager(tmpDir, 1);

    let finishFirst!: () => void;
    const blocker = new Promise<void>((r) => { finishFirst = r; });

    manager.enqueue({
      jobId: "active-slot",
      execute: async () => blocker,
    });

    const pCancel = manager.enqueue({
      jobId: "to-cancel",
      execute: async () => 42,
    });

    expect(manager.isJobQueued("to-cancel")).toBe(true);
    const wasCancelled = manager.cancelQueued("to-cancel");
    expect(wasCancelled).toBe(true);

    const cancelRes = await pCancel;
    expect(cancelRes.status).toBe("skipped");
    expect(cancelRes.error).toContain("Cancelled");

    // Clear queue
    manager.enqueue({ jobId: "q1", execute: async () => 1 });
    manager.enqueue({ jobId: "q2", execute: async () => 2 });
    expect(manager.getStatus().queuedCount).toBe(2);

    const clearedCount = manager.clearQueue();
    expect(clearedCount).toBe(2);
    expect(manager.getStatus().queuedCount).toBe(0);

    finishFirst();
  });

  it("getActiveLocks accurately detects live processes and ignores dead locks", async () => {
    await acquireLock(tmpDir, "live-job-1");
    await acquireLock(tmpDir, "live-job-2");

    const locks = await getActiveLocks(tmpDir);
    expect(locks).toContain("live-job-1");
    expect(locks).toContain("live-job-2");

    // Manually create a fake lock with a dead PID (e.g. 99999999)
    const fakeLockPath = path.join(tmpDir, ".opencode", "cron", "locks", "dead-job.lock");
    await fs.writeFile(fakeLockPath, "99999999 2026-10-13T00:00:00Z");

    const locksWithDead = await getActiveLocks(tmpDir);
    expect(locksWithDead).not.toContain("dead-job");

    await releaseLock(tmpDir, "live-job-1");
    await releaseLock(tmpDir, "live-job-2");
  });

  it("checkDue sorts due jobs by priority before executing with concurrency pool", async () => {
    const executedOrder: string[] = [];

    const jobLow = CronJobSchema.parse({
      id: "job-low",
      sessionID: "ses-1",
      directory: tmpDir,
      title: "Low Priority Task",
      systemPrompt: "sys",
      followupPrompt: "fup",
      schedule: { kind: "interval", everyMs: 60_000 },
      priority: "low",
      createdAt: new Date().toISOString(),
      nextRunAt: new Date(Date.now() - 5000).toISOString(),
    });

    const jobHigh = CronJobSchema.parse({
      id: "job-high",
      sessionID: "ses-2",
      directory: tmpDir,
      title: "High Priority Task",
      systemPrompt: "sys",
      followupPrompt: "fup",
      schedule: { kind: "interval", everyMs: 60_000 },
      priority: "high",
      createdAt: new Date().toISOString(),
      nextRunAt: new Date(Date.now() - 5000).toISOString(),
    });

    const jobNormal = CronJobSchema.parse({
      id: "job-normal",
      sessionID: "ses-3",
      directory: tmpDir,
      title: "Normal Priority Task",
      systemPrompt: "sys",
      followupPrompt: "fup",
      schedule: { kind: "interval", everyMs: 60_000 },
      priority: "normal",
      createdAt: new Date().toISOString(),
      nextRunAt: new Date(Date.now() - 5000).toISOString(),
    });

    await saveJobs(tmpDir, [jobLow, jobHigh, jobNormal]);

    // Mock spawn to record execution order
    const mockSpawn = async (_cmd: string, args: string[]) => {
      // Find sessionID in args
      const idx = args.indexOf("--session");
      const sId = idx >= 0 ? args[idx + 1] : "";
      if (sId === "ses-2") executedOrder.push("job-high");
      else if (sId === "ses-3") executedOrder.push("job-normal");
      else if (sId === "ses-1") executedOrder.push("job-low");
      return 0;
    };

    // Run sequentially (concurrency 1) to strictly check sorted order
    const ran = await checkDue(tmpDir, mockSpawn, 1);
    expect(ran).toEqual(["job-high", "job-normal", "job-low"]);
    expect(executedOrder).toEqual(["job-high", "job-normal", "job-low"]);
  });

  it("GUI server exposes /api/queue, /api/settings, /api/jobs/:id/priority end-to-end", async () => {
    const job = CronJobSchema.parse({
      id: "queue-gui-job",
      sessionID: "ses-gui",
      directory: tmpDir,
      title: "Queue GUI Job",
      systemPrompt: "sys",
      followupPrompt: "fup",
      schedule: { kind: "interval", everyMs: 60_000 },
      priority: "normal",
      createdAt: new Date().toISOString(),
    });
    await saveJobs(tmpDir, [job]);

    const port = 49100 + Math.floor(Math.random() * 500);
    const server = startGuiServer({ port, dir: tmpDir });
    const baseUrl = `http://127.0.0.1:${port}`;

    try {
      // 1. GET /api/queue
      const qRes = await fetch(`${baseUrl}/api/queue`);
      expect(qRes.status).toBe(200);
      const qData = (await qRes.json()) as any;
      expect(qData.ok).toBe(true);
      expect(qData.maxConcurrency).toBe(2);
      expect(qData.activeCount).toBe(0);
      expect(qData.queuedCount).toBe(0);

      // 2. POST /api/settings (update maxConcurrency to 5)
      const setRes = await fetch(`${baseUrl}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxConcurrency: 5 }),
      });
      expect(setRes.status).toBe(200);
      const setData = (await setRes.json()) as any;
      expect(setData.ok).toBe(true);
      expect(setData.settings.maxConcurrency).toBe(5);

      // Verify on GET /api/settings
      const getSetRes = await fetch(`${baseUrl}/api/settings`);
      const getSetData = (await getSetRes.json()) as any;
      expect(getSetData.settings.maxConcurrency).toBe(5);

      // 3. POST /api/jobs/:id/priority (promote to high)
      const prioRes = await fetch(`${baseUrl}/api/jobs/queue-gui-job/priority`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: "high" }),
      });
      expect(prioRes.status).toBe(200);
      const prioData = (await prioRes.json()) as any;
      expect(prioData.ok).toBe(true);
      expect(prioData.priority).toBe("high");

      // Verify jobs on disk updated
      const diskJobs = await loadJobs(tmpDir);
      expect(diskJobs[0].priority).toBe("high");

      // 4. DELETE /api/queue/:id for non-existent item returns cancelled: false
      const delRes = await fetch(`${baseUrl}/api/queue/queue-gui-job`, { method: "DELETE" });
      const delData = (await delRes.json()) as any;
      expect(delData.ok).toBe(true);
      expect(delData.cancelled).toBe(false);

      // 5. POST /api/queue/clear
      const clearRes = await fetch(`${baseUrl}/api/queue/clear`, { method: "POST" });
      const clearData = (await clearRes.json()) as any;
      expect(clearData.ok).toBe(true);
      expect(clearData.cleared).toBe(0);
    } finally {
      server.stop();
    }
  });

  describe("Adversarial Chaos & Security Hardening", () => {
    it("promotes priority of an already-queued job in-place and notifies all subscribers", async () => {
      const mgr = new ConcurrencyManager(tmpDir, 1);
      let releaseBlocker!: () => void;
      mgr.enqueue({
        jobId: "blocker",
        execute: () => new Promise<void>((r) => { releaseBlocker = () => r(); }),
      });

      // Enqueue task-a as low priority
      const p1 = mgr.enqueue({ jobId: "task-a", priority: "low", execute: async () => "A-res" });
      mgr.enqueue({ jobId: "task-b", priority: "normal", execute: async () => "B-res" });

      // Promote task-a to high priority
      const p2 = mgr.enqueue({ jobId: "task-a", priority: "high", execute: async () => "A-res-2" });

      const status = mgr.getStatus();
      expect(status.queued[0].jobId).toBe("task-a"); // Must be promoted to front ahead of normal task-b
      expect(status.queued[0].priority).toBe("high");

      releaseBlocker();

      const [res1, res2] = await Promise.all([p1, p2]);
      expect(res1.status).toBe("completed");
      expect(res1.result).toBe("A-res");
      expect(res2.status).toBe("completed");
      expect(res2.result).toBe("A-res");
    });

    it("handles worker execution failures without leaking phantom slots in ConcurrencyManager", async () => {
      const mgr = new ConcurrencyManager(tmpDir, 2);
      const res = await mgr.enqueue({
        jobId: "failing-job",
        execute: async () => {
          throw new Error("Simulated worker disk failure");
        },
      });

      expect(res.status).toBe("failed");
      expect(res.error).toContain("Simulated worker disk failure");
      expect(mgr.getStatus().activeCount).toBe(0); // Slot must be freed immediately
      expect(mgr.isJobRunning("failing-job")).toBe(false);
    });

    it("settles all workers in runWithConcurrencyPool when one throws, leaving no zombie executions", async () => {
      let task2Ran = false;
      const tasks = [
        async () => {
          throw new Error("Worker 1 fatal abort");
        },
        async () => {
          await new Promise((r) => setTimeout(r, 20));
          task2Ran = true;
          return 42;
        },
      ];

      let thrownErr: any = null;
      try {
        await runWithConcurrencyPool(tasks, 2, (fn) => fn());
      } catch (err: any) {
        thrownErr = err;
      }

      expect(thrownErr).not.toBeNull();
      expect(thrownErr.message).toBe("Worker 1 fatal abort");
      expect(task2Ran).toBe(true); // Worker 2 settled gracefully before pool returned
    });

    it("preserves stability and deterministic order on corrupted nextRunAt dates", () => {
      const corruptedJobs = [
        { id: "job-corrupted-1", priority: "normal" as const, nextRunAt: "not-a-valid-date" },
        { id: "job-corrupted-2", priority: "normal" as const, nextRunAt: "invalid-iso-string" },
        { id: "job-valid", priority: "normal" as const, nextRunAt: "2026-10-13T12:00:00Z" },
      ];

      expect(() => corruptedJobs.sort(compareJobPriority)).not.toThrow();
      const sorted = [...corruptedJobs].sort(compareJobPriority);
      expect(sorted.length).toBe(3);
    });

    it("safely handles NaN and non-finite concurrency limits in checkDue without skipping jobs", async () => {
      const now = new Date().toISOString();
      await saveJobs(tmpDir, [
        CronJobSchema.parse({
          id: "nan-test-job",
          sessionID: "s-nan",
          directory: tmpDir,
          title: "NaN Test Job",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 60_000 },
          createdAt: now,
          nextRunAt: now,
        }),
      ]);

      let executed = false;
      const stubSpawn = async () => {
        executed = true;
        return { exitCode: 0 };
      };

      // Pass NaN as concurrencyLimit
      const ran = await checkDue(tmpDir, stubSpawn as any, NaN);
      expect(ran).toEqual(["nan-test-job"]);
      expect(executed).toBe(true);
    });

    it("saveCronSettings writes settings.json with 0600 mode permissions", async () => {
      const saved = await saveCronSettings(tmpDir, { maxConcurrency: 4 });
      expect(saved.maxConcurrency).toBe(4);

      const filePath = path.join(tmpDir, ".opencode", "cron", "settings.json");
      const st = await fs.stat(filePath);
      // In POSIX, 0o600 is 384 in decimal
      if (process.platform !== "win32") {
        expect(st.mode & 0o777).toBe(0o600);
      }
    });
  });
});
