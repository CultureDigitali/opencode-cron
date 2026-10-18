import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { CronJobSchema, AdaptiveScheduleSchema } from "../src/types.ts";
import { computeNextRun, applyAdaptiveTransition, saveJobs, loadJobs } from "../src/store.ts";
import { explainSchedule, explainAdaptive } from "../src/schedule.ts";
import { startGuiServer } from "../src/gui/server.ts";
import { executeTick } from "../src/executor.ts";
import { writeMemory } from "../src/memory.ts";

describe("Feature 1: Smart Adaptive Schedule (Dynamic Cadence & Burst Mode)", () => {
  it("validates AdaptiveScheduleSchema and enforces 60s minimum floors", () => {
    const valid = AdaptiveScheduleSchema.parse({
      enabled: true,
      burstEveryMs: 60_000,
      idleEveryMs: 1_800_000,
      quietThreshold: 3,
    });
    expect(valid.enabled).toBe(true);
    expect(valid.burstEveryMs).toBe(60_000);
    expect(valid.idleEveryMs).toBe(1_800_000);
    expect(valid.quietThreshold).toBe(3);
    expect(valid.currentCadence).toBe("normal");
    expect(valid.consecutiveQuietTicks).toBe(0);

    // Rejects below 60s
    expect(() => {
      AdaptiveScheduleSchema.parse({
        enabled: true,
        burstEveryMs: 30_000, // invalid < 60s
      });
    }).toThrow();
  });

  it("handles state transitions from burst to normal to idle and back", () => {
    const job = CronJobSchema.parse({
      id: "adaptive-test",
      sessionID: "ses-test",
      directory: "/tmp",
      title: "Adaptive Monitor",
      systemPrompt: "sys",
      followupPrompt: "fup",
      schedule: { kind: "interval", everyMs: 300_000 }, // 5m normal
      adaptive: {
        enabled: true,
        burstEveryMs: 60_000,   // 1m burst
        idleEveryMs: 1_800_000, // 30m idle
        quietThreshold: 3,
        consecutiveQuietTicks: 0,
        currentCadence: "normal",
      },
      createdAt: new Date().toISOString(),
    });

    const now = new Date("2026-10-13T12:00:00.000Z");

    // 1. Initial tick with activity -> enters burst mode
    applyAdaptiveTransition(job, true, now);
    expect(job.adaptive?.currentCadence).toBe("burst");
    expect(job.adaptive?.consecutiveQuietTicks).toBe(0);
    expect(computeNextRun(job, now)).toBe("2026-10-13T12:01:00.000Z"); // +1m

    // 2. Quiet tick 1 -> drops to normal, count = 1
    applyAdaptiveTransition(job, false, now);
    expect(job.adaptive?.currentCadence).toBe("normal");
    expect(job.adaptive?.consecutiveQuietTicks).toBe(1);
    expect(computeNextRun(job, now)).toBe("2026-10-13T12:05:00.000Z"); // +5m (base interval)

    // 3. Quiet tick 2 -> stays normal, count = 2
    applyAdaptiveTransition(job, false, now);
    expect(job.adaptive?.currentCadence).toBe("normal");
    expect(job.adaptive?.consecutiveQuietTicks).toBe(2);

    // 4. Quiet tick 3 -> reaches threshold (3), backs off to idle
    applyAdaptiveTransition(job, false, now);
    expect(job.adaptive?.currentCadence).toBe("idle");
    expect(job.adaptive?.consecutiveQuietTicks).toBe(3);
    expect(computeNextRun(job, now)).toBe("2026-10-13T12:30:00.000Z"); // +30m (idle interval)

    // 5. Subsequent quiet ticks stay idle
    applyAdaptiveTransition(job, false, now);
    expect(job.adaptive?.currentCadence).toBe("idle");
    expect(job.adaptive?.consecutiveQuietTicks).toBe(4);

    // 6. Sudden activity -> bursts immediately
    applyAdaptiveTransition(job, true, now);
    expect(job.adaptive?.currentCadence).toBe("burst");
    expect(job.adaptive?.consecutiveQuietTicks).toBe(0);
    expect(computeNextRun(job, now)).toBe("2026-10-13T12:01:00.000Z"); // +1m
  });

  it("forced burst mode overrides quiet ticks until expiration", () => {
    const nowMs = new Date("2026-10-13T12:00:00.000Z").getTime();
    const burstDurationMs = 15 * 60_000;
    const activeUntil = new Date(nowMs + burstDurationMs).toISOString();

    const job = CronJobSchema.parse({
      id: "forced-burst",
      sessionID: "ses-1",
      directory: "/tmp",
      title: "Forced Burst",
      systemPrompt: "sys",
      followupPrompt: "fup",
      schedule: { kind: "interval", everyMs: 300_000 },
      adaptive: {
        enabled: true,
        burstEveryMs: 60_000,
        idleEveryMs: 1_800_000,
        quietThreshold: 2,
        currentCadence: "normal",
        activeUntil,
      },
      createdAt: new Date().toISOString(),
    });

    const t1 = new Date(nowMs + 5 * 60_000); // 5 mins in (activeUntil is in future)
    applyAdaptiveTransition(job, false, t1); // quiet tick, but forced burst is active
    expect(job.adaptive?.currentCadence).toBe("burst");
    expect(job.adaptive?.consecutiveQuietTicks).toBe(0);
    expect(computeNextRun(job, t1)).toBe(new Date(t1.getTime() + 60_000).toISOString());

    // Once activeUntil expires (16 mins later)
    const t2 = new Date(nowMs + 16 * 60_000);
    applyAdaptiveTransition(job, false, t2); // quiet tick after expiry
    expect(job.adaptive?.currentCadence).toBe("normal");
    expect(job.adaptive?.consecutiveQuietTicks).toBe(1);
  });

  it("persists adaptive configuration in jobs.json without data loss", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-adaptive-store-"));
    try {
      const job = CronJobSchema.parse({
        id: "adaptive-store-job",
        sessionID: "ses-store",
        directory: dir,
        title: "Store Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 120_000 },
        adaptive: {
          enabled: true,
          burstEveryMs: 60_000,
          idleEveryMs: 3_600_000,
          quietThreshold: 5,
          consecutiveQuietTicks: 2,
          currentCadence: "normal",
          activeUntil: null,
        },
        createdAt: new Date().toISOString(),
      });

      await saveJobs(dir, [job]);
      const loaded = await loadJobs(dir);
      expect(loaded.length).toBe(1);
      expect(loaded[0].adaptive?.enabled).toBe(true);
      expect(loaded[0].adaptive?.burstEveryMs).toBe(60_000);
      expect(loaded[0].adaptive?.idleEveryMs).toBe(3_600_000);
      expect(loaded[0].adaptive?.quietThreshold).toBe(5);
      expect(loaded[0].adaptive?.consecutiveQuietTicks).toBe(2);
      expect(loaded[0].adaptive?.currentCadence).toBe("normal");
    } finally {
      await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("explains adaptive schedules bilingual in Italian and English", () => {
    const itExpl = explainAdaptive({
      enabled: true,
      burstEveryMs: 60_000,
      idleEveryMs: 1_800_000,
      quietThreshold: 3,
    }, "it");
    expect(itExpl).toContain("Cadenza Adattiva");
    expect(itExpl).toContain("1m");
    expect(itExpl).toContain("30m");
    expect(itExpl).toContain("3");

    const enExpl = explainAdaptive({
      enabled: true,
      burstEveryMs: 120_000,
      idleEveryMs: 3_600_000,
      quietThreshold: 4,
    }, "en");
    expect(enExpl).toContain("Smart Adaptive");
    expect(enExpl).toContain("2m");
    expect(enExpl).toContain("1h");
    expect(enExpl).toContain("4");
  });

  it("handles GUI API POST /api/jobs/:id/burst and preview with adaptive parameters", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-adaptive-gui-"));
    const port = 49100 + Math.floor(Math.random() * 800);
    const server = startGuiServer({ dir, port });

    try {
      // 1. Create adaptive job via POST /api/jobs
      const createRes = await fetch(`http://127.0.0.1:${port}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "API Adaptive Job",
          scheduleStr: "5m",
          sessionID: "ses-gui-1",
          systemPrompt: "sys",
          followupPrompt: "fup",
          adaptive: {
            enabled: true,
            burst: "1m",
            idle: "20m",
            quietThreshold: 3,
          },
        }),
      });
      expect(createRes.status).toBe(200);
      const createData: any = await createRes.json();
      expect(createData.ok).toBe(true);
      const jobId = createData.job.id;
      expect(createData.job.adaptive?.enabled).toBe(true);
      expect(createData.job.adaptive?.burstEveryMs).toBe(60_000);
      expect(createData.job.adaptive?.idleEveryMs).toBe(1_200_000);

      // 2. Trigger burst mode via POST /api/jobs/:id/burst
      const burstRes = await fetch(`http://127.0.0.1:${port}/api/jobs/${encodeURIComponent(jobId)}/burst`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes: 30 }),
      });
      expect(burstRes.status).toBe(200);
      const burstData: any = await burstRes.json();
      expect(burstData.ok).toBe(true);
      expect(burstData.job.adaptive?.currentCadence).toBe("burst");
      expect(burstData.activeUntil).toBeDefined();

      // 3. Test preview with adaptive parameters
      const previewRes = await fetch(`http://127.0.0.1:${port}/api/schedule/preview?q=5m&lang=it&adaptive=1&burst=1m&idle=20m`);
      expect(previewRes.status).toBe(200);
      const previewData: any = await previewRes.json();
      expect(previewData.valid).toBe(true);
      expect(previewData.adaptiveInfo).toBeDefined();
      expect(previewData.adaptiveInfo).toContain("Cadenza Adattiva");

      // 4. Update adaptive parameters via PUT /api/jobs/:id
      const putRes = await fetch(`http://127.0.0.1:${port}/api/jobs/${encodeURIComponent(jobId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adaptive: {
            enabled: true,
            burst: "2m",
            idle: "45m",
            quietThreshold: 4,
          },
        }),
      });
      expect(putRes.status).toBe(200);
      const putData: any = await putRes.json();
      expect(putData.ok).toBe(true);
      expect(putData.job.adaptive?.burstEveryMs).toBe(120_000);
      expect(putData.job.adaptive?.idleEveryMs).toBe(2_700_000);
      expect(putData.job.adaptive?.quietThreshold).toBe(4);

      // 5. Verify Host header rejection (DNS rebinding attack defense)
      const badHostRes = await fetch(`http://localhost:${port}/api/status`, {
        headers: { Host: "evil.attacker.com" },
      });
      expect(badHostRes.status).toBe(400);
    } finally {
      server.stop();
      await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("executeTick detects memory activity and transitions cadence dynamically", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-exec-adaptive-"));
    try {
      const jobId = "exec-adaptive-job";
      const initialJob = CronJobSchema.parse({
        id: jobId,
        sessionID: "ses-exec",
        directory: dir,
        title: "Exec Adaptive Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 300_000 },
        adaptive: {
          enabled: true,
          burstEveryMs: 60_000,
          idleEveryMs: 1_800_000,
          quietThreshold: 2,
          currentCadence: "normal",
        },
        createdAt: new Date().toISOString(),
      });
      await saveJobs(dir, [initialJob]);

      // Initialize empty memory
      await writeMemory(dir, jobId, "# Memory", {
        consecutiveFailures: 0,
        lastRunAt: null,
        seenHashes: ["h1"],
        counts: { news: 1 },
      });

      // Run tick 1: Mock prompt saves new memory with activity!
      const res1 = await executeTick(dir, jobId, {
        promptSession: async () => {
          await writeMemory(dir, jobId, "# Memory Updated", {
            consecutiveFailures: 0,
            lastRunAt: new Date().toISOString(),
            seenHashes: ["h1", "h2"], // hash added -> activity!
            counts: { news: 2 },
            hasActivity: true,
          });
        },
      });
      expect(res1.ok).toBe(true);

      const jobsAfter1 = await loadJobs(dir);
      const j1 = jobsAfter1.find((x) => x.id === jobId)!;
      expect(j1.adaptive?.currentCadence).toBe("burst");
      expect(j1.adaptive?.consecutiveQuietTicks).toBe(0);

      // Run tick 2: Mock prompt does NOT save activity (quiet tick)
      const res2 = await executeTick(dir, jobId, {
        promptSession: async () => {
          // No changes in hashes or counts
        },
      });
      expect(res2.ok).toBe(true);

      const jobsAfter2 = await loadJobs(dir);
      const j2 = jobsAfter2.find((x) => x.id === jobId)!;
      expect(j2.adaptive?.currentCadence).toBe("normal");
      expect(j2.adaptive?.consecutiveQuietTicks).toBe(1);

      // Run tick 3: Another quiet tick reaches threshold 2 -> drops to idle
      const res3 = await executeTick(dir, jobId, {
        promptSession: async () => {},
      });
      expect(res3.ok).toBe(true);

      const jobsAfter3 = await loadJobs(dir);
      const j3 = jobsAfter3.find((x) => x.id === jobId)!;
      expect(j3.adaptive?.currentCadence).toBe("idle");
      expect(j3.adaptive?.consecutiveQuietTicks).toBe(2);
    } finally {
      await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("preserves in-flight burst mode when triggered concurrently during tick execution", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-concurrent-burst-"));
    try {
      const jobId = "concurrent-burst-job";
      const initialJob = CronJobSchema.parse({
        id: jobId,
        sessionID: "ses-conc",
        directory: dir,
        title: "Concurrent Burst Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 300_000 },
        adaptive: {
          enabled: true,
          burstEveryMs: 60_000,
          idleEveryMs: 1_800_000,
          quietThreshold: 3,
          currentCadence: "normal",
        },
        createdAt: new Date().toISOString(),
      });
      await saveJobs(dir, [initialJob]);

      const futureBurstExpiry = new Date(Date.now() + 20 * 60_000).toISOString();

      // Tick executes; while promptSession is in flight, an out-of-band burst is saved to disk!
      await executeTick(dir, jobId, {
        promptSession: async () => {
          const diskJobs = await loadJobs(dir);
          const target = diskJobs.find((j) => j.id === jobId)!;
          target.adaptive!.activeUntil = futureBurstExpiry;
          target.adaptive!.currentCadence = "burst";
          await saveJobs(dir, diskJobs);
        },
      });

      // Post-tick save must NOT have overwritten the active burst!
      const finalJobs = await loadJobs(dir);
      const finalJob = finalJobs.find((j) => j.id === jobId)!;
      expect(finalJob.adaptive?.activeUntil).toBe(futureBurstExpiry);
      expect(finalJob.adaptive?.currentCadence).toBe("burst");
    } finally {
      await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  });
});
