// src/metrics.ts - Telemetry, Execution Metrics & Prometheus Engine
import fs from "fs/promises";
import path from "path";
import { cronDir } from "./store.ts";
import type { CronJob, JobMetrics, SystemMetrics } from "./types.ts";
import { replaceFile } from "./atomic.ts";

interface MetricHistoryEntry {
  durationMs: number;
  status: "success" | "failed" | "timeout" | "skipped";
  timestamp: string;
}

interface StoredMetrics {
  jobs: Record<
    string,
    {
      totalRuns: number;
      successRuns: number;
      failedRuns: number;
      skippedRuns: number;
      timeoutRuns: number;
      durations: number[]; // circular buffer of last 50 durations
      lastDurationMs?: number;
      lastRunAt?: string;
    }
  >;
}

const memoryMetrics: StoredMetrics = { jobs: {} };
let isLoaded = false;
const startTime = Date.now();

function metricsFile(directory: string): string {
  return path.join(cronDir(directory), "metrics.json");
}

export async function loadMetrics(directory: string): Promise<StoredMetrics> {
  if (isLoaded) return memoryMetrics;
  try {
    const raw = await fs.readFile(metricsFile(directory), "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.jobs) {
      memoryMetrics.jobs = parsed.jobs;
    }
    isLoaded = true;
  } catch {
    // initialize empty
    isLoaded = true;
  }
  return memoryMetrics;
}

export async function saveMetrics(directory: string): Promise<void> {
  const file = metricsFile(directory);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  try {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(tmp, JSON.stringify(memoryMetrics, null, 2), "utf-8");
    await replaceFile(tmp, file);
  } catch {
    await fs.unlink(tmp).catch(() => {});
  }
}

export async function recordRunMetric(
  directory: string,
  jobId: string,
  durationMs: number,
  status: "success" | "failed" | "timeout" | "skipped"
): Promise<void> {
  await loadMetrics(directory);

  if (!memoryMetrics.jobs[jobId]) {
    memoryMetrics.jobs[jobId] = {
      totalRuns: 0,
      successRuns: 0,
      failedRuns: 0,
      skippedRuns: 0,
      timeoutRuns: 0,
      durations: [],
    };
  }

  const jm = memoryMetrics.jobs[jobId];
  jm.totalRuns += 1;
  if (status === "success") jm.successRuns += 1;
  else if (status === "failed") jm.failedRuns += 1;
  else if (status === "timeout") jm.timeoutRuns += 1;
  else if (status === "skipped") jm.skippedRuns += 1;

  jm.lastDurationMs = durationMs;
  jm.lastRunAt = new Date().toISOString();

  if (status === "success" || status === "failed" || status === "timeout") {
    jm.durations.push(durationMs);
    if (jm.durations.length > 50) {
      jm.durations.shift();
    }
  }

  await saveMetrics(directory).catch(() => {});
}

export function computeStats(durations: number[]): {
  avg: number;
  min: number;
  max: number;
  p95: number;
} {
  if (!durations.length) return { avg: 0, min: 0, max: 0, p95: 0 };
  const sorted = [...durations].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const avg = Math.round(sum / sorted.length);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  const p95Idx = Math.min(
    sorted.length - 1,
    Math.floor(sorted.length * 0.95)
  );
  const p95 = sorted[p95Idx];

  return { avg, min, max, p95 };
}

export function getJobMetrics(jobId: string): JobMetrics {
  const jm = memoryMetrics.jobs[jobId] || {
    totalRuns: 0,
    successRuns: 0,
    failedRuns: 0,
    skippedRuns: 0,
    timeoutRuns: 0,
    durations: [],
  };

  const { avg, min, max, p95 } = computeStats(jm.durations || []);

  return {
    totalRuns: jm.totalRuns,
    successRuns: jm.successRuns,
    failedRuns: jm.failedRuns,
    skippedRuns: jm.skippedRuns,
    timeoutRuns: jm.timeoutRuns,
    lastDurationMs: jm.lastDurationMs,
    avgDurationMs: avg,
    minDurationMs: min,
    maxDurationMs: max,
    p95DurationMs: p95,
    lastRunAt: jm.lastRunAt,
  };
}

export function getSystemMetrics(jobs: CronJob[]): SystemMetrics {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.enabled && j.circuitBreaker?.state !== "open").length;
  const quarantinedJobs = jobs.filter((j) => j.circuitBreaker?.state === "open").length;

  const jobMetricsMap: Record<string, JobMetrics> = {};
  for (const j of jobs) {
    jobMetricsMap[j.id] = getJobMetrics(j.id);
  }

  return {
    uptimeSeconds,
    totalJobs,
    activeJobs,
    quarantinedJobs,
    activeWorkers: 0,
    queuedTasks: 0,
    dlqTotal: quarantinedJobs,
    circuitOpenTotal: quarantinedJobs,
    jobs: jobMetricsMap,
  };
}

/**
 * Format system and job metrics in standard Prometheus exposition format.
 */
export function generatePrometheusMetrics(jobs: CronJob[]): string {
  const sys = getSystemMetrics(jobs);
  const lines: string[] = [
    "# HELP opencode_cron_uptime_seconds Process uptime in seconds",
    "# TYPE opencode_cron_uptime_seconds gauge",
    `opencode_cron_uptime_seconds ${sys.uptimeSeconds}`,
    "",
    "# HELP opencode_cron_jobs_total Total configured jobs",
    "# TYPE opencode_cron_jobs_total gauge",
    `opencode_cron_jobs_total{status="active"} ${sys.activeJobs}`,
    `opencode_cron_jobs_total{status="quarantined"} ${sys.quarantinedJobs}`,
    `opencode_cron_jobs_total{status="total"} ${sys.totalJobs}`,
    "",
    "# HELP opencode_cron_job_runs_total Total runs per job and outcome",
    "# TYPE opencode_cron_job_runs_total counter",
  ];

  for (const job of jobs) {
    const m = sys.jobs[job.id];
    lines.push(`opencode_cron_job_runs_total{job="${job.id}",status="success"} ${m.successRuns}`);
    lines.push(`opencode_cron_job_runs_total{job="${job.id}",status="failed"} ${m.failedRuns}`);
    lines.push(`opencode_cron_job_runs_total{job="${job.id}",status="timeout"} ${m.timeoutRuns}`);
    lines.push(`opencode_cron_job_runs_total{job="${job.id}",status="skipped"} ${m.skippedRuns}`);
  }

  lines.push("");
  lines.push("# HELP opencode_cron_job_duration_ms Job execution duration in milliseconds");
  lines.push("# TYPE opencode_cron_job_duration_ms gauge");
  for (const job of jobs) {
    const m = sys.jobs[job.id];
    lines.push(`opencode_cron_job_duration_ms{job="${job.id}",stat="avg"} ${m.avgDurationMs}`);
    lines.push(`opencode_cron_job_duration_ms{job="${job.id}",stat="p95"} ${m.p95DurationMs}`);
    lines.push(`opencode_cron_job_duration_ms{job="${job.id}",stat="min"} ${m.minDurationMs}`);
    lines.push(`opencode_cron_job_duration_ms{job="${job.id}",stat="max"} ${m.maxDurationMs}`);
  }

  lines.push("");
  return lines.join("\n");
}
