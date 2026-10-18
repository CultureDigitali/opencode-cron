import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import {
  loadDLQ,
  saveDLQ,
  quarantineJob,
  resolveDLQEntry,
  clearDLQ,
  getCircuitBreakerStatus,
  tripCircuitBreaker,
  resetCircuitBreaker,
  setHalfOpen,
  retryDLQJob,
} from "../src/dlq.ts";
import { CronJob } from "../src/types.ts";
import { saveJobs, loadJobs } from "../src/store.ts";

describe("Dead Letter Queue (DLQ) & Circuit Breaker Engine", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-cron-dlq-test-"));
  });

  afterEach(async () => {
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {}
  });

  function createTestJob(id: string = "job-fail-1"): CronJob {
    return {
      id,
      title: "Test Failing Job",
      sessionID: "ses-1",
      directory: tmpDir,
      schedule: { kind: "interval", everyMs: 60000 },
      enabled: true,
      createdAt: new Date().toISOString(),
      nextRunAt: new Date(Date.now() + 60000).toISOString(),
      lastRunAt: null,
      runCount: 5,
      consecutiveFailures: 5,
      maxConsecutiveFailures: 5,
      maxRuns: 0,
      catchUp: false,
      skipIfRunning: true,
      systemPrompt: "sys",
      followupPrompt: "follow",
    };
  }

  describe("Circuit Breaker state machine", () => {
    it("defaults to closed state when circuitBreaker is undefined", () => {
      const job = createTestJob();
      const status = getCircuitBreakerStatus(job);
      expect(status.state).toBe("closed");
      expect(status.canExecute).toBe(true);
      expect(status.isCanary).toBe(false);
    });

    it("trips circuit breaker to open state", () => {
      const job = createTestJob();
      tripCircuitBreaker(job, "Connection refused");
      expect(job.circuitBreaker?.state).toBe("open");
      expect(job.circuitBreaker?.lastFailureReason).toBe("Connection refused");

      const status = getCircuitBreakerStatus(job);
      expect(status.state).toBe("open");
      expect(status.canExecute).toBe(false);
      expect(status.isCanary).toBe(false);
    });

    it("auto-transitions to half-open after resetTimeoutMs expires", () => {
      const job = createTestJob();
      tripCircuitBreaker(job, "API rate limit");
      // Set trippedAt to 31 minutes ago (default resetTimeout is 30m)
      job.circuitBreaker!.trippedAt = new Date(Date.now() - 31 * 60 * 1000).toISOString();

      const status = getCircuitBreakerStatus(job);
      expect(status.state).toBe("half-open");
      expect(status.canExecute).toBe(true);
      expect(status.isCanary).toBe(true);
      expect(job.circuitBreaker!.state).toBe("half-open");
    });

    it("manual reset closes the circuit and clears failure tracking", () => {
      const job = createTestJob();
      tripCircuitBreaker(job, "Fatal error");
      resetCircuitBreaker(job);
      expect(job.circuitBreaker?.state).toBe("closed");
      expect(job.circuitBreaker?.lastFailureReason).toBeNull();
      expect(job.consecutiveFailures).toBe(0);

      const status = getCircuitBreakerStatus(job);
      expect(status.state).toBe("closed");
      expect(status.canExecute).toBe(true);
    });

    it("manual half-open allows canary probe", () => {
      const job = createTestJob();
      tripCircuitBreaker(job, "Timeout");
      setHalfOpen(job);
      expect(job.circuitBreaker?.state).toBe("half-open");
      const status = getCircuitBreakerStatus(job);
      expect(status.canExecute).toBe(true);
      expect(status.isCanary).toBe(true);
    });
  });

  describe("DLQ Persistence & Quarantine", () => {
    it("quarantines a failing job into DLQ file", async () => {
      const job = createTestJob("job-dlq-1");
      const entry = await quarantineJob(tmpDir, job, "HTTP 500 Internal Error", 5);

      expect(entry.jobId).toBe("job-dlq-1");
      expect(entry.errorMessage).toBe("HTTP 500 Internal Error");
      expect(entry.consecutiveFailures).toBe(5);
      expect(entry.status).toBe("quarantined");

      const dlq = await loadDLQ(tmpDir);
      expect(dlq.length).toBe(1);
      expect(dlq[0].id).toBe(entry.id);
      expect(dlq[0].jobId).toBe("job-dlq-1");
    });

    it("resolves a DLQ entry and removes quarantine", async () => {
      const job = createTestJob("job-dlq-resolve");
      const entry = await quarantineJob(tmpDir, job, "Fatal crash", 5);

      const resolved = await resolveDLQEntry(tmpDir, entry.id);
      expect(resolved).toBe(true);

      const dlq = await loadDLQ(tmpDir);
      expect(dlq.length).toBe(1);
      expect(dlq[0].status).toBe("resolved");
      expect(dlq[0].resolvedAt).not.toBeNull();
    });

    it("clears all DLQ entries with filter 'all'", async () => {
      const job1 = createTestJob("job-1");
      const job2 = createTestJob("job-2");
      await quarantineJob(tmpDir, job1, "Err 1");
      await quarantineJob(tmpDir, job2, "Err 2");

      let dlq = await loadDLQ(tmpDir);
      expect(dlq.length).toBe(2);

      await clearDLQ(tmpDir, "all");
      dlq = await loadDLQ(tmpDir);
      expect(dlq.length).toBe(0);
    });

    it("caps DLQ entries at MAX_DLQ_ENTRIES (100) and preserves file permissions 0600", async () => {
      const entries = Array.from({ length: 110 }, (_, i) => ({
        id: `dlq_${i}`,
        jobId: `job-${i}`,
        jobTitle: `Job ${i}`,
        sessionID: "ses-1",
        directory: tmpDir,
        failedAt: new Date(Date.now() + i * 1000).toISOString(),
        exitCode: 1,
        errorMessage: `Error ${i}`,
        consecutiveFailures: 5,
        status: "quarantined" as const,
        resolvedAt: null,
        retryCount: 0,
      }));

      await saveDLQ(tmpDir, entries);
      const dlq = await loadDLQ(tmpDir);
      expect(dlq.length).toBe(100);
      expect(dlq[dlq.length - 1].id).toBe("dlq_109");

      const dlqPath = path.join(tmpDir, ".opencode", "cron", "dlq.json");
      const stat = await fs.stat(dlqPath);
      // Mode 0600 mask:
      if (process.platform !== "win32") {
        expect((stat.mode & 0o777) === 0o600).toBe(true);
      }
    });

    it("retrying a DLQ job runs canary probe and resolves on success", async () => {
      const job = createTestJob("job-canary-test");
      tripCircuitBreaker(job, "Deadlock");
      job.enabled = false;
      await saveJobs(tmpDir, [job]);
      await quarantineJob(tmpDir, job, "Deadlock", 5);

      let runnerCalled = false;
      const res = await retryDLQJob(tmpDir, "job-canary-test", async (_dir, id) => {
        expect(id).toBe("job-canary-test");
        runnerCalled = true;
        return 0; // exit code 0 = success
      });

      expect(runnerCalled).toBe(true);
      expect(res.ok).toBe(true);
      expect(res.status).toBe("success");

      const saved = await loadJobs(tmpDir);
      const updated = saved.find((j) => j.id === "job-canary-test");
      expect(updated?.circuitBreaker?.state).toBe("closed");
      expect(updated?.consecutiveFailures).toBe(0);

      const dlq = await loadDLQ(tmpDir);
      const dlqEntry = dlq.find((e) => e.jobId === "job-canary-test");
      expect(dlqEntry?.status).toBe("resolved");
    });

    it("sanitizes sensitive tokens in lastPayload", async () => {
      const job = createTestJob("job-secret-leak");
      const sensitivePayload = {
        user: "admin",
        token: "whk_super_secret_token_12345",
        nested: {
          secret: "supersecret",
          apiKey: "my-key-value",
          data: "ok-data",
        },
      };

      const entry = await quarantineJob(tmpDir, job, "Failure with payload", 1, sensitivePayload);
      expect(entry.lastPayload?.token).toBe("[REDACTED]");
      expect(entry.lastPayload?.nested?.secret).toBe("[REDACTED]");
      expect(entry.lastPayload?.nested?.apiKey).toBe("[REDACTED]");
      expect(entry.lastPayload?.nested?.data).toBe("ok-data");
    });

    it("resolves DLQ entry by entry ID starting with dlq_", async () => {
      const job = createTestJob("job-entry-id");
      const entry = await quarantineJob(tmpDir, job, "Crash", 5);

      expect(entry.id.startsWith("dlq_")).toBe(true);
      const resolved = await resolveDLQEntry(tmpDir, entry.id);
      expect(resolved).toBe(true);

      const dlq = await loadDLQ(tmpDir);
      expect(dlq[0].status).toBe("resolved");
    });
  });
});

