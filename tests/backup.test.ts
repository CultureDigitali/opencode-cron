import { describe, it, expect } from "bun:test";
import { createBackup, listBackups, restoreBackup, deleteBackup, pruneBackups } from "../src/backup";
import { upsertJob, loadJobs } from "../src/store";
import { writeMemory, initialMemoryMd } from "../src/memory";
import fs from "fs/promises";
import os from "os";
import path from "path";
import type { CronJob } from "../src/types";

describe("Feature 10: Snapshot & Backup/Restore Engine", () => {
  it("creates a snapshot of jobs and memory files", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-backup-test-"));
    try {
      const mockJob: CronJob = {
        id: "bak-job-1",
        sessionID: "ses-1",
        directory: tmp,
        title: "Backup Target Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 60000 },
        tags: ["test"],
        enabled: true,
        catchUp: false,
        skipIfRunning: true,
        maxRuns: 0,
        maxConsecutiveFailures: 5,
        runCount: 1,
        consecutiveFailures: 0,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        nextRunAt: null,
      };

      await upsertJob(tmp, mockJob);
      await writeMemory(
        tmp,
        mockJob.id,
        initialMemoryMd({ title: mockJob.title, systemPrompt: mockJob.systemPrompt, followupPrompt: mockJob.followupPrompt }),
        { seenHashes: ["h1"], counts: {}, lastRunAt: null, consecutiveFailures: 0 }
      );

      const metadata = await createBackup(tmp, "Pre-deployment snapshot");
      expect(metadata.id).toMatch(/^bak-/);
      expect(metadata.jobCount).toBe(1);
      expect(metadata.note).toBe("Pre-deployment snapshot");
      expect(metadata.checksum).toBeDefined();

      const list = await listBackups(tmp);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(metadata.id);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("restores jobs and memory files accurately from a snapshot", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-restore-test-"));
    try {
      const mockJob: CronJob = {
        id: "restore-target",
        sessionID: "ses-r",
        directory: tmp,
        title: "Restorable Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 60000 },
        tags: ["restore"],
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

      await upsertJob(tmp, mockJob);
      const bak = await createBackup(tmp, "Snapshot before clear");

      // Corrupt/empty jobs.json to simulate disaster
      await fs.writeFile(path.join(tmp, ".opencode", "cron", "jobs.json"), "[]");
      const emptyJobs = await loadJobs(tmp);
      expect(emptyJobs).toHaveLength(0);

      // Restore
      const res = await restoreBackup(tmp, bak.id);
      expect(res.restoredJobs).toBe(1);

      const restoredJobs = await loadJobs(tmp);
      expect(restoredJobs).toHaveLength(1);
      expect(restoredJobs[0].id).toBe("restore-target");
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("prunes old backups keeping maxToKeep threshold", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-prune-bak-"));
    try {
      for (let i = 0; i < 5; i++) {
        await createBackup(tmp, `Snapshot ${i}`);
      }
      const initialList = await listBackups(tmp);
      expect(initialList.length).toBe(5);

      const prunedCount = await pruneBackups(tmp, 2);
      expect(prunedCount).toBe(3);

      const remaining = await listBackups(tmp);
      expect(remaining.length).toBe(2);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

