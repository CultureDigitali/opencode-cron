import { describe, it, expect } from "bun:test";
import { executeTick } from "../src/executor";
import { upsertJob } from "../src/store";
import { writeMemory, initialMemoryMd } from "../src/memory";
import fs from "fs/promises";
import os from "os";
import path from "path";
import type { CronJob } from "../src/types";

describe("Feature 11 & 14: Execution Watchdog Timeout and Guard Check", () => {
  it("skips execution cleanly when guard check fails", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-guard-exec-"));
    try {
      const job: CronJob = {
        id: "guarded-job",
        sessionID: "s1",
        directory: tmp,
        title: "Guarded Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 60000 },
        tags: [],
        guard: {
          enabled: true,
          command: "exit 1", // Fails immediately
        },
        enabled: true,
        catchUp: false,
        skipIfRunning: true,
        maxRuns: 0,
        maxConsecutiveFailures: 5,
        runCount: 0,
        consecutiveFailures: 0,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        nextRunAt: null,
      };

      await upsertJob(tmp, job);
      await writeMemory(
        tmp,
        job.id,
        initialMemoryMd({ title: job.title, systemPrompt: job.systemPrompt, followupPrompt: job.followupPrompt }),
        { seenHashes: [], counts: {}, lastRunAt: null, consecutiveFailures: 0 }
      );

      let sessionCalled = false;
      const res = await executeTick(tmp, job.id, {
        promptSession: async () => {
          sessionCalled = true;
        },
      });

      expect(res.ok).toBe(false);
      expect(res.skipped).toBe("guard-failed");
      expect(sessionCalled).toBe(false);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("aborts execution when session times out", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-timeout-exec-"));
    try {
      const job: CronJob = {
        id: "timeout-job",
        sessionID: "s2",
        directory: tmp,
        title: "Timeout Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 60000 },
        tags: [],
        timeoutMs: 5000, // 5s timeout
        enabled: true,
        catchUp: false,
        skipIfRunning: true,
        maxRuns: 0,
        maxConsecutiveFailures: 5,
        runCount: 0,
        consecutiveFailures: 0,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        nextRunAt: null,
      };

      await upsertJob(tmp, job);
      await writeMemory(
        tmp,
        job.id,
        initialMemoryMd({ title: job.title, systemPrompt: job.systemPrompt, followupPrompt: job.followupPrompt }),
        { seenHashes: [], counts: {}, lastRunAt: null, consecutiveFailures: 0 }
      );

      const res = await executeTick(tmp, job.id, {
        promptSession: async () => {
          // Hangs for longer than timeoutMs
          await new Promise((resolve) => setTimeout(resolve, 7000));
        },
      });

      expect(res.ok).toBe(false);
      expect(res.skipped).toBe("error");

      const log = await fs.readFile(path.join(tmp, ".opencode", "cron", "runs", `${job.id}.log`), "utf-8");
      expect(log).toContain("Execution timed out after 5000ms");
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  }, 15000);
});
