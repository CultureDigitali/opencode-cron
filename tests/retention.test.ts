import { describe, it, expect } from "bun:test";
import { recordRunEntry, loadRunHistory, pruneRunHistory } from "../src/history";
import fs from "fs/promises";
import os from "os";
import path from "path";

describe("Feature 12: Run History Retention & Auto-Pruning Engine", () => {
  it("prunes runs older than maxAgeDays", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-retention-test-"));
    try {
      const now = Date.now();
      const oldTime = new Date(now - 40 * 86_400_000).toISOString(); // 40 days ago
      const recentTime = new Date(now - 2 * 86_400_000).toISOString(); // 2 days ago

      await recordRunEntry(tmp, {
        jobId: "job-1",
        jobTitle: "Old Run",
        sessionID: "s1",
        startedAt: oldTime,
        finishedAt: oldTime,
        durationMs: 100,
        status: "success",
        exitCode: 0,
      });

      await recordRunEntry(tmp, {
        jobId: "job-1",
        jobTitle: "Recent Run",
        sessionID: "s1",
        startedAt: recentTime,
        finishedAt: recentTime,
        durationMs: 100,
        status: "success",
        exitCode: 0,
      });

      const initial = await loadRunHistory(tmp);
      expect(initial).toHaveLength(2);

      const res = await pruneRunHistory(tmp, { maxAgeDays: 30 });
      expect(res.beforeCount).toBe(2);
      expect(res.afterCount).toBe(1);
      expect(res.prunedCount).toBe(1);

      const remaining = await loadRunHistory(tmp);
      expect(remaining).toHaveLength(1);
      expect(remaining[0].jobTitle).toBe("Recent Run");
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("prunes excess runs exceeding maxRunsPerJob threshold", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-retention-limit-"));
    try {
      const now = new Date().toISOString();
      for (let i = 0; i < 6; i++) {
        await recordRunEntry(tmp, {
          jobId: "job-frequent",
          jobTitle: `Run ${i}`,
          sessionID: "s1",
          startedAt: now,
          finishedAt: now,
          durationMs: 50,
          status: "success",
          exitCode: 0,
        });
      }

      const res = await pruneRunHistory(tmp, { maxRunsPerJob: 3 });
      expect(res.beforeCount).toBe(6);
      expect(res.afterCount).toBe(3);
      expect(res.prunedCount).toBe(3);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

