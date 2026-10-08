import { loadJobs, saveJobs, computeNextRun, assertJobId } from "./store.ts";
import { readMemory, buildTickPrompt } from "./memory.ts";
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

export async function executeTick(
  directory: string,
  jobId: string,
  prompt: PromptFn
): Promise<{ ok: boolean; skipped?: string }> {
  assertJobId(jobId);
  const jobs = await loadJobs(directory);
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return { ok: false, skipped: "job-not-found" };
  if (!job.enabled) return { ok: false, skipped: "disabled" };
  if (job.maxRuns > 0 && job.runCount >= job.maxRuns) return { ok: false, skipped: "max-runs" };

  const key = flightKey(directory, jobId);
  if (prompt.inFlight?.has(key)) {
    await appendRunLog(directory, jobId, `SKIP overlap at ${new Date().toISOString()}\n`);
    return { ok: false, skipped: "in-flight" };
  }

  const { md } = await readMemory(directory, jobId);
  const text = buildTickPrompt({
    systemPrompt: job.systemPrompt,
    followupPrompt: job.followupPrompt,
    memoryMd: md,
  });

  prompt.inFlight?.add(key);
  try {
    await prompt.promptSession(job.sessionID, text);
    const now = new Date().toISOString();
    job.runCount += 1;
    job.consecutiveFailures = 0;
    job.lastRunAt = now;
    job.nextRunAt = computeNextRun(job, new Date());
    await saveJobs(directory, jobs.map((j) => (j.id === job.id ? job : j)));
    await appendRunLog(directory, jobId, `OK run #${job.runCount} at ${now}\n`);
    return { ok: true };
  } catch (err: any) {
    job.consecutiveFailures += 1;
    if (job.consecutiveFailures >= job.maxConsecutiveFailures) job.enabled = false;
    // Advance to a full interval even on failure — otherwise the overdue
    // timestamp refires at the 5s scheduler min-delay until auto-pause.
    job.nextRunAt = computeNextRun(job, new Date());
    await saveJobs(directory, jobs.map((j) => (j.id === job.id ? job : j)));
    await appendRunLog(directory, jobId, `ERR at ${new Date().toISOString()}: ${err?.message ?? err}\n`);
    return { ok: false, skipped: "error" };
  } finally {
    prompt.inFlight?.delete(key);
  }
}

export async function appendRunLog(directory: string, jobId: string, line: string): Promise<void> {
  assertJobId(jobId);
  const p = path.join(directory, ".opencode", "cron", "runs", `${jobId}.log`);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.appendFile(p, line, "utf-8");
}
