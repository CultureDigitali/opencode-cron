import { loadJobs, saveJobs, computeNextRun, assertJobId, applyAdaptiveTransition } from "./store.ts";
import { readMemory, writeMemory, buildTickPrompt } from "./memory.ts";
import { acquireLock, releaseLock } from "./runner.ts";
import { recordRunEntry } from "./history.ts";
import { triggerPipelineDownstream } from "./pipeline.ts";
import {
  getCircuitBreakerStatus,
  tripCircuitBreaker,
  resetCircuitBreaker,
  quarantineJob,
  resolveDLQEntry,
} from "./dlq.ts";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export type PromptFn = {
  promptSession: (sessionID: string, text: string) => Promise<unknown>;
  /** Guard against overlapping ticks of the same job (in-process).
   * NOTE: opencode v2 has no session.status API — cross-process overlap is
   * handled by the headless runner's atomic lock files instead. */
  inFlight?: Set<string>;
};

function flightKey(directory: string, jobId: string): string {
  return `${directory}::${jobId}`;
}

export interface ExecuteTickPipelineContext {
  depth?: number;
  rootMaxDepth?: number;
  visited?: Set<string>;
}

export async function executeTick(
  directory: string,
  jobId: string,
  prompt: PromptFn,
  pipelineContext?: ExecuteTickPipelineContext
): Promise<{ ok: boolean; skipped?: string }> {
  assertJobId(jobId);
  const jobs = await loadJobs(directory);
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return { ok: false, skipped: "job-not-found" };

  const cbStatus = getCircuitBreakerStatus(job);
  if (!job.enabled && !cbStatus.isCanary) return { ok: false, skipped: "disabled" };
  if (job.maxRuns > 0 && job.runCount >= job.maxRuns) return { ok: false, skipped: "max-runs" };

  if (!cbStatus.canExecute) {
    await appendRunLog(directory, jobId, `SKIP circuit breaker OPEN (${cbStatus.reason}) at ${new Date().toISOString()}\n`);
    return { ok: false, skipped: "circuit-breaker-open" };
  }

  const key = flightKey(directory, jobId);
  if (prompt.inFlight?.has(key)) {
    await appendRunLog(directory, jobId, `SKIP in-flight overlap at ${new Date().toISOString()}\n`);
    return { ok: false, skipped: "in-flight" };
  }

  // Cross-process filesystem lock guard
  if (!(await acquireLock(directory, jobId))) {
    await appendRunLog(directory, jobId, `SKIP cross-process locked at ${new Date().toISOString()}\n`);
    return { ok: false, skipped: "locked" };
  }

  const { md, state: prevState } = await readMemory(directory, jobId);
  const text = buildTickPrompt({
    systemPrompt: job.systemPrompt,
    followupPrompt: job.followupPrompt,
    memoryMd: md,
  });

  const startedAtMs = Date.now();
  const startedAt = new Date(startedAtMs).toISOString();
  prompt.inFlight?.add(key);
  try {
    await prompt.promptSession(job.sessionID, text);
    const finishedAtMs = Date.now();
    const now = new Date(finishedAtMs).toISOString();
    job.runCount += 1;
    job.consecutiveFailures = 0;
    job.lastRunAt = now;
    resetCircuitBreaker(job);
    await resolveDLQEntry(directory, job.id).catch(() => {});

    const { md: postMd, state: postState } = await readMemory(directory, jobId).catch(() => ({ md: "", state: prevState }));
    const prevCounts = (prevState.counts ?? {}) as Record<string, number>;
    const postCounts = (postState.counts ?? {}) as Record<string, number>;
    const hasActivity =
      postState.hasActivity === true ||
      (postState.seenHashes?.length ?? 0) > (prevState.seenHashes?.length ?? 0) ||
      (postCounts["news"] ?? 0) > (prevCounts["news"] ?? 0) ||
      (postCounts["tweets"] ?? 0) > (prevCounts["tweets"] ?? 0);

    if (postState.hasActivity) {
      await writeMemory(directory, jobId, postMd ?? "", { ...postState, hasActivity: false }).catch(() => {});
    }

    applyAdaptiveTransition(job, hasActivity, new Date(finishedAtMs));
    job.nextRunAt = computeNextRun(job, new Date(finishedAtMs));
    const latest = await loadJobs(directory);
    const diskJob = latest.find((j) => j.id === job.id);
    if (diskJob) {
      job.priority = diskJob.priority;
      job.webhook = diskJob.webhook;
      job.pipeline = diskJob.pipeline;
      if (diskJob.circuitBreaker && diskJob.circuitBreaker.state === "closed" && job.circuitBreaker?.state === "open") {
        job.circuitBreaker = diskJob.circuitBreaker;
      }
      if (diskJob.adaptive?.activeUntil && (!job.adaptive?.activeUntil || new Date(diskJob.adaptive.activeUntil).getTime() > new Date(job.adaptive.activeUntil).getTime())) {
        if (!job.adaptive) job.adaptive = diskJob.adaptive;
        else job.adaptive.activeUntil = diskJob.adaptive.activeUntil;
        job.adaptive.currentCadence = "burst";
        job.nextRunAt = computeNextRun(job, new Date(finishedAtMs));
      }
    }
    const updated = latest.some((j) => j.id === job.id)
      ? latest.map((j) => (j.id === job.id ? job : j))
      : [...latest, job];
    await saveJobs(directory, updated);
    await appendRunLog(directory, jobId, `OK run #${job.runCount} at ${now}\n`);
    await recordRunEntry(directory, {
      id: `exec_${job.id}_${startedAtMs}`,
      jobId: job.id,
      jobTitle: job.title,
      sessionID: job.sessionID,
      status: "success",
      startedAt,
      finishedAt: now,
      durationMs: Math.max(0, finishedAtMs - startedAtMs),
      exitCode: 0,
      runNumber: job.runCount,
      model: job.model ?? null,
      outputPreview: null,
      error: null,
      source: "recorded",
    }).catch(() => {});
    const currentDepth = pipelineContext?.depth ?? 0;
    const rootMaxDepth = pipelineContext?.rootMaxDepth;
    const visited = pipelineContext?.visited ?? new Set<string>();

    await triggerPipelineDownstream({
      directory,
      parentJobId: job.id,
      status: "success",
      depth: currentDepth,
      rootMaxDepth,
      visited,
      executeFn: (id, nextCtx) => executeTick(directory, id, prompt, nextCtx).then((r) => (r.ok ? "success" : "failed")),
    }).catch((e) => console.error(`[Pipeline] downstream error: ${e.message}`));
    return { ok: true };
  } catch (err: any) {
    const finishedAtMs = Date.now();
    const now = new Date(finishedAtMs).toISOString();
    const errMsg = String(err?.message ?? err);
    job.consecutiveFailures += 1;
    if (job.consecutiveFailures >= job.maxConsecutiveFailures || cbStatus.isCanary) {
      tripCircuitBreaker(job, errMsg);
      await quarantineJob(directory, job, errMsg, 1).catch(() => {});
      job.enabled = false;
    }
    applyAdaptiveTransition(job, false, new Date(finishedAtMs));
    job.nextRunAt = computeNextRun(job, new Date(finishedAtMs));
    const latest = await loadJobs(directory);
    const diskJob = latest.find((j) => j.id === job.id);
    if (diskJob) {
      job.priority = diskJob.priority;
      job.webhook = diskJob.webhook;
      job.pipeline = diskJob.pipeline;
      if (diskJob.circuitBreaker && diskJob.circuitBreaker.state === "closed" && job.circuitBreaker?.state === "open") {
        job.circuitBreaker = diskJob.circuitBreaker;
      }
      if (diskJob.adaptive?.activeUntil && (!job.adaptive?.activeUntil || new Date(diskJob.adaptive.activeUntil).getTime() > new Date(job.adaptive.activeUntil).getTime())) {
        if (!job.adaptive) job.adaptive = diskJob.adaptive;
        else job.adaptive.activeUntil = diskJob.adaptive.activeUntil;
        job.adaptive.currentCadence = "burst";
        job.nextRunAt = computeNextRun(job, new Date(finishedAtMs));
      }
    }
    const updated = latest.some((j) => j.id === job.id)
      ? latest.map((j) => (j.id === job.id ? job : j))
      : [...latest, job];
    await saveJobs(directory, updated);
    await appendRunLog(directory, jobId, `ERR at ${now}: ${errMsg}\n`);
    await recordRunEntry(directory, {
      id: `exec_${job.id}_${startedAtMs}`,
      jobId: job.id,
      jobTitle: job.title,
      sessionID: job.sessionID,
      status: "failed",
      startedAt,
      finishedAt: now,
      durationMs: Math.max(0, finishedAtMs - startedAtMs),
      exitCode: 1,
      runNumber: job.runCount,
      model: job.model ?? null,
      outputPreview: null,
      error: errMsg,
      source: "recorded",
    }).catch(() => {});

    const currentDepth = pipelineContext?.depth ?? 0;
    const rootMaxDepth = pipelineContext?.rootMaxDepth;
    const visited = pipelineContext?.visited ?? new Set<string>();

    await triggerPipelineDownstream({
      directory,
      parentJobId: job.id,
      status: "failed",
      depth: currentDepth,
      rootMaxDepth,
      visited,
      executeFn: (id, nextCtx) => executeTick(directory, id, prompt, nextCtx).then((r) => (r.ok ? "success" : "failed")),
    }).catch((e) => console.error(`[Pipeline] downstream error: ${e.message}`));
    return { ok: false, skipped: "error" };
  } finally {
    prompt.inFlight?.delete(key);
    await releaseLock(directory, jobId).catch(() => {});
  }
}

export async function appendRunLog(directory: string, jobId: string, line: string): Promise<void> {
  assertJobId(jobId);
  const p = path.join(directory, ".opencode", "cron", "runs", `${jobId}.log`);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.appendFile(p, line, "utf-8");
}
