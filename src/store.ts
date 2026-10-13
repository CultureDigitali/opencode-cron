import { CronJobSchema, type CronJob } from "./types.ts";
import { parseEveryToMs, nextCronOccurrence } from "./schedule.ts";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export const JOB_ID_RE = /^[a-z0-9-]{1,64}$/;

export function assertJobId(id: string): void {
  if (!JOB_ID_RE.test(id)) throw new Error(`Invalid job id "${id}". Use [a-z0-9-], max 64 chars.`);
}

export function cronDir(directory: string): string {
  return path.join(directory, ".opencode", "cron");
}

export function jobsFile(directory: string): string {
  return path.join(cronDir(directory), "jobs.json");
}

export async function ensureCronDir(directory: string): Promise<void> {
  await fs.mkdir(cronDir(directory), { recursive: true });
  await fs.mkdir(path.join(cronDir(directory), "memory"), { recursive: true });
  await fs.mkdir(path.join(cronDir(directory), "runs"), { recursive: true });
}

export async function loadJobs(directory: string): Promise<CronJob[]> {
  const file = jobsFile(directory);
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf-8");
  } catch (err: any) {
    if (err?.code === "ENOENT") return [];
    throw err;
  }

  let arr: unknown;
  try {
    arr = JSON.parse(raw);
  } catch (parseErr: any) {
    // Preserve corrupted file before throwing to prevent permanent data loss
    const corruptBackup = `${file}.corrupt.${Date.now()}`;
    await fs.writeFile(corruptBackup, raw, "utf-8").catch(() => {});
    throw new Error(`Corrupted jobs.json in "${directory}": ${parseErr.message}. Backed up to ${corruptBackup}`);
  }

  if (!Array.isArray(arr)) return [];
  const out: CronJob[] = [];
  for (const item of arr) {
    const parsed = CronJobSchema.safeParse(item);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}

export async function saveJobs(directory: string, jobs: CronJob[]): Promise<void> {
  await ensureCronDir(directory);
  const tmp = `${jobsFile(directory)}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    await fs.writeFile(tmp, JSON.stringify(jobs, null, 2), "utf-8");
    await fs.rename(tmp, jobsFile(directory));
  } catch (err) {
    await fs.unlink(tmp).catch(() => {});
    throw err;
  }
}

export function applyAdaptiveTransition(
  job: CronJob,
  hasActivity: boolean,
  from: Date = new Date()
): void {
  if (!job.adaptive || !job.adaptive.enabled) return;

  const nowMs = from.getTime();
  const isForcedBurst =
    !!job.adaptive.activeUntil &&
    new Date(job.adaptive.activeUntil).getTime() > nowMs;

  if (job.adaptive.activeUntil && !isForcedBurst) {
    job.adaptive.activeUntil = null;
  }

  if (hasActivity || isForcedBurst) {
    job.adaptive.consecutiveQuietTicks = 0;
    job.adaptive.currentCadence = "burst";
  } else {
    job.adaptive.consecutiveQuietTicks = (job.adaptive.consecutiveQuietTicks ?? 0) + 1;
    const threshold = job.adaptive.quietThreshold ?? 3;
    if (job.adaptive.consecutiveQuietTicks >= threshold) {
      job.adaptive.currentCadence = "idle";
    } else {
      job.adaptive.currentCadence = "normal";
    }
  }
}

export function computeNextRun(job: CronJob, from: Date = new Date()): string {
  // Check adaptive cadence if enabled
  if (job.adaptive && job.adaptive.enabled) {
    const nowMs = from.getTime();
    const isForcedBurst =
      !!job.adaptive.activeUntil &&
      new Date(job.adaptive.activeUntil).getTime() > nowMs;

    const cadence = isForcedBurst ? "burst" : job.adaptive.currentCadence;

    if (cadence === "burst") {
      const raw = job.adaptive.burstEveryMs ?? 60_000;
      const burstMs = Number.isFinite(raw) && raw >= 60_000 ? raw : 60_000;
      return new Date(from.getTime() + burstMs).toISOString();
    } else if (cadence === "idle") {
      const raw = job.adaptive.idleEveryMs ?? 1_800_000;
      const idleMs = Number.isFinite(raw) && raw >= 60_000 ? raw : 1_800_000;
      return new Date(from.getTime() + idleMs).toISOString();
    }
    // If "normal", continue below to standard schedule (cron or everyMs)
  }

  if (job.schedule.cron) {
    try {
      return nextCronOccurrence(job.schedule.cron, from, job.schedule.timezone);
    } catch {
      // fallback to interval if cron unparseable
    }
  }
  let ms = job.schedule.everyMs ?? (job.schedule.every ? parseEveryToMs(job.schedule.every) : 300_000);
  if (!Number.isFinite(ms) || ms < 60_000) {
    ms = 300_000;
  }
  return new Date(from.getTime() + ms).toISOString();
}

export async function upsertJob(directory: string, job: CronJob): Promise<CronJob[]> {
  const jobs = await loadJobs(directory);
  const idx = jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) jobs[idx] = job;
  else jobs.push(job);
  await saveJobs(directory, jobs);
  return jobs;
}

export async function removeJob(directory: string, id: string): Promise<CronJob[]> {
  assertJobId(id);
  const jobs = await loadJobs(directory);
  const next = jobs.filter((j) => j.id !== id);
  await saveJobs(directory, next);
  // cleanup orphans: memory md/state/bak, run log, lock
  const base = cronDir(directory);
  for (const f of [
    path.join(base, "memory", `${id}.md`),
    path.join(base, "memory", `${id}.md.bak`),
    path.join(base, "memory", `${id}.state.json`),
    path.join(base, "runs", `${id}.log`),
    path.join(base, "locks", `${id}.lock`),
  ]) {
    try {
      await fs.unlink(f);
    } catch { /* ignore */ }
  }
  return next;
}
