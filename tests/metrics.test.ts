import { describe, it, expect } from "bun:test";
import { computeStats, recordRunMetric, getJobMetrics, generatePrometheusMetrics, getSystemMetrics } from "../src/metrics";
import fs from "fs/promises";
import os from "os";
import path from "path";
import type { CronJob } from "../src/types";

describe("Feature 7: Real-Time Execution Metrics & Prometheus Engine", () => {
  it("computes stats (avg, min, max, p95) accurately", () => {
    const durations = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const stats = computeStats(durations);
    expect(stats.min).toBe(100);
    expect(stats.max).toBe(1000);
    expect(stats.avg).toBe(550);
    expect(stats.p95).toBe(1000);
  });

  it("records run metrics and saves to directory", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-metrics-test-"));
    try {
      await recordRunMetric(tmp, "job-metrics-1", 250, "success");
      await recordRunMetric(tmp, "job-metrics-1", 500, "failed");
      await recordRunMetric(tmp, "job-metrics-1", 100, "timeout");

      const metrics = getJobMetrics("job-metrics-1");
      expect(metrics.totalRuns).toBe(3);
      expect(metrics.successRuns).toBe(1);
      expect(metrics.failedRuns).toBe(1);
      expect(metrics.timeoutRuns).toBe(1);
      expect(metrics.lastDurationMs).toBe(100);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("generates Prometheus exposition format output", () => {
    const mockJobs: CronJob[] = [
      {
        id: "job-prom-1",
        sessionID: "s1",
        directory: "/tmp",
        title: "Test Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 60000 },
        tags: [],
        enabled: true,
        catchUp: false,
        skipIfRunning: true,
        maxRuns: 0,
        maxConsecutiveFailures: 5,
        runCount: 5,
        consecutiveFailures: 0,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        nextRunAt: null,
      },
    ];

    const prom = generatePrometheusMetrics(mockJobs);
    expect(prom).toContain("opencode_cron_uptime_seconds");
    expect(prom).toContain('opencode_cron_jobs_total{status="total"} 1');
    expect(prom).toContain('opencode_cron_job_runs_total{job="job-prom-1",status="success"}');
    expect(prom).toContain('opencode_cron_job_duration_ms{job="job-prom-1",stat="avg"}');
  });
});

