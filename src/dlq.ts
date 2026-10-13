import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  DLQEntrySchema,
  type DLQEntry,
  type CronJob,
  type CircuitState,
} from "./types.ts";
import { cronDir, ensureCronDir, assertJobId, loadJobs, saveJobs } from "./store.ts";

export const MAX_DLQ_ENTRIES = 100;

export function dlqFile(directory: string): string {
  return path.join(cronDir(directory), "dlq.json");
}

export async function loadDLQ(directory: string): Promise<DLQEntry[]> {
  const file = dlqFile(directory);
  try {
    const raw = await fs.readFile(file, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid: DLQEntry[] = [];
    for (const item of parsed) {
      const res = DLQEntrySchema.safeParse(item);
      if (res.success) valid.push(res.data);
    }
    return valid;
  } catch {
    return [];
  }
}

export async function saveDLQ(directory: string, entries: DLQEntry[]): Promise<void> {
  await ensureCronDir(directory);
  // Cap at MAX_DLQ_ENTRIES to prevent unbounded disk growth (keep most recent)
  const capped = entries.slice(-MAX_DLQ_ENTRIES);
  const file = dlqFile(directory);
  const tmp = `${file}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    await fs.writeFile(tmp, JSON.stringify(capped, null, 2), { encoding: "utf-8", mode: 0o600 });
    await fs.chmod(tmp, 0o600).catch(() => {});
    await fs.rename(tmp, file);
    await fs.chmod(file, 0o600).catch(() => {});
  } catch (err) {
    await fs.unlink(tmp).catch(() => {});
    throw err;
  }
}

/** Evaluates the job's circuit breaker state and returns whether execution can proceed. */
export function getCircuitBreakerStatus(job: CronJob): {
  state: CircuitState;
  canExecute: boolean;
  reason?: string;
  isCanary?: boolean;
} {
  const cb = job.circuitBreaker;
  if (!cb || cb.state === "closed") {
    return { state: "closed", canExecute: true, isCanary: false };
  }

  const now = Date.now();

  if (cb.state === "open") {
    // Check if auto-reset timeout has expired to allow canary probe
    const trippedTime = cb.trippedAt ? new Date(cb.trippedAt).getTime() : 0;
    const timeout = cb.resetTimeoutMs ?? 1800_000;
    if (trippedTime > 0 && now - trippedTime >= timeout) {
      // Auto-transition to half-open
      cb.state = "half-open";
      cb.halfOpenAt = new Date().toISOString();
      return {
        state: "half-open",
        canExecute: true,
        isCanary: true,
        reason: "Reset timeout elapsed; executing canary probe",
      };
    }

    return {
      state: "open",
      canExecute: false,
      isCanary: false,
      reason: cb.lastFailureReason ?? "Circuit breaker tripped due to consecutive failures",
    };
  }

  if (cb.state === "half-open") {
    return {
      state: "half-open",
      canExecute: true,
      isCanary: true,
      reason: "Executing single canary probe",
    };
  }

  return { state: "closed", canExecute: true, isCanary: false };
}

/** Trips the circuit breaker, quarantines execution, and records the failure reason. */
export function tripCircuitBreaker(job: CronJob, reason: string): void {
  const now = new Date().toISOString();
  if (!job.circuitBreaker) {
    job.circuitBreaker = {
      state: "open",
      trippedAt: now,
      resetTimeoutMs: 1800_000,
      halfOpenAt: null,
      lastFailureReason: reason,
    };
  } else {
    job.circuitBreaker.state = "open";
    job.circuitBreaker.trippedAt = now;
    job.circuitBreaker.halfOpenAt = null;
    job.circuitBreaker.lastFailureReason = reason;
  }
}

/** Resets the circuit breaker to closed state after a successful run. */
export function resetCircuitBreaker(job: CronJob): void {
  if (job.circuitBreaker) {
    job.circuitBreaker.state = "closed";
    job.circuitBreaker.trippedAt = null;
    job.circuitBreaker.halfOpenAt = null;
    job.circuitBreaker.lastFailureReason = null;
  }
  job.consecutiveFailures = 0;
}

/** Sets the circuit breaker into half-open canary probe mode. */
export function setHalfOpen(job: CronJob): void {
  const now = new Date().toISOString();
  if (!job.circuitBreaker) {
    job.circuitBreaker = {
      state: "half-open",
      trippedAt: null,
      resetTimeoutMs: 1800_000,
      halfOpenAt: now,
      lastFailureReason: null,
    };
  } else {
    job.circuitBreaker.state = "half-open";
    job.circuitBreaker.halfOpenAt = now;
  }
}

/** Recursively masks sensitive fields (token, secret, authorization, password, key, credential). */
export function sanitizeDLQPayload(payload: any): any {
  if (!payload || typeof payload !== "object") return payload;
  if (Array.isArray(payload)) {
    return payload.map(sanitizeDLQPayload);
  }
  const clean: Record<string, any> = {};
  const sensitiveRegex = /token|secret|authorization|password|key|credential|bearer/i;
  for (const [k, v] of Object.entries(payload)) {
    if (sensitiveRegex.test(k)) {
      clean[k] = "[REDACTED]";
    } else if (v && typeof v === "object") {
      clean[k] = sanitizeDLQPayload(v);
    } else {
      clean[k] = v;
    }
  }
  return clean;
}

/** Adds or updates a job entry in the Dead Letter Queue. */
export async function quarantineJob(
  directory: string,
  job: CronJob,
  errorMessage: string,
  exitCode?: number | null,
  lastPayload?: any
): Promise<DLQEntry> {
  assertJobId(job.id);
  const dlq = await loadDLQ(directory);
  const now = new Date().toISOString();
  const safePayload = lastPayload ? sanitizeDLQPayload(lastPayload) : undefined;

  // Check if an existing quarantined entry already exists for this job
  const existingIdx = dlq.findIndex((e) => e.jobId === job.id && e.status === "quarantined");

  let entry: DLQEntry;
  if (existingIdx !== -1) {
    entry = {
      ...dlq[existingIdx],
      failedAt: now,
      errorMessage,
      exitCode: exitCode ?? null,
      consecutiveFailures: job.consecutiveFailures,
      lastPayload: safePayload ?? dlq[existingIdx].lastPayload,
      retryCount: dlq[existingIdx].retryCount + 1,
    };
    dlq[existingIdx] = entry;
  } else {
    entry = {
      id: `dlq_${job.id}_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      sessionID: job.sessionID,
      directory,
      failedAt: now,
      exitCode: exitCode ?? null,
      errorMessage,
      consecutiveFailures: job.consecutiveFailures,
      lastPayload: safePayload,
      status: "quarantined",
      resolvedAt: null,
      retryCount: 0,
    };
    dlq.push(entry);
  }

  await saveDLQ(directory, dlq);
  return entry;
}

/** Marks quarantined DLQ entries for a job or entry ID as resolved. */
export async function resolveDLQEntry(directory: string, idOrJobId: string): Promise<boolean> {
  if (!idOrJobId || typeof idOrJobId !== "string" || idOrJobId.length > 128) {
    throw new Error(`Invalid identifier "${idOrJobId}"`);
  }
  const dlq = await loadDLQ(directory);
  let modified = false;
  const now = new Date().toISOString();

  for (const entry of dlq) {
    if ((entry.jobId === idOrJobId || entry.id === idOrJobId) && entry.status === "quarantined") {
      entry.status = "resolved";
      entry.resolvedAt = now;
      modified = true;
    }
  }

  if (modified) {
    await saveDLQ(directory, dlq);
  }
  return modified;
}

/** Retries a quarantined job by resetting its circuit breaker to half-open and executing it. */
export async function retryDLQJob(
  directory: string,
  jobId: string,
  runJobFn: (dir: string, id: string) => Promise<number>
): Promise<{ ok: boolean; status: "success" | "failed"; error?: string }> {
  assertJobId(jobId);
  const jobs = await loadJobs(directory);
  const job = jobs.find((j) => j.id === jobId);
  if (!job) {
    throw new Error(`Job '${jobId}' not found`);
  }

  // Set circuit breaker to half-open canary mode and re-enable if paused
  setHalfOpen(job);
  job.enabled = true;
  await saveJobs(directory, jobs);

  try {
    const exitCode = await runJobFn(directory, jobId);
    if (exitCode === 0) {
      // Canary succeeded: mark DLQ resolved and close circuit
      await resolveDLQEntry(directory, jobId);
      const reloaded = await loadJobs(directory);
      const j = reloaded.find((x) => x.id === jobId);
      if (j) {
        resetCircuitBreaker(j);
        await saveJobs(directory, reloaded);
      }
      return { ok: true, status: "success" };
    } else {
      return { ok: false, status: "failed", error: `Execution exited with code ${exitCode}` };
    }
  } catch (err: any) {
    return { ok: false, status: "failed", error: err.message || String(err) };
  }
}

/** Clears DLQ entries based on filter ("all" or "resolved"). Returns number of removed entries. */
export async function clearDLQ(directory: string, filter: "all" | "resolved" = "resolved"): Promise<number> {
  const dlq = await loadDLQ(directory);
  let kept: DLQEntry[];
  if (filter === "all") {
    kept = [];
  } else {
    kept = dlq.filter((e) => e.status !== "resolved");
  }
  const removed = dlq.length - kept.length;
  if (removed > 0 || filter === "all") {
    await saveDLQ(directory, kept);
  }
  return removed;
}

