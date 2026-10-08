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
  try {
    const raw = await fs.readFile(jobsFile(directory), "utf-8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    const out: CronJob[] = [];
    for (const item of arr) {
      const parsed = CronJobSchema.safeParse(item);
      if (parsed.success) out.push(parsed.data);
    }
    return out;
  } catch {
    return [];
  }
}

export async function saveJobs(directory: string, jobs: CronJob[]): Promise<void> {
  await ensureCronDir(directory);
  const tmp = jobsFile(directory) + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(jobs, null, 2), "utf-8");
  await fs.rename(tmp, jobsFile(directory));
}

export function computeNextRun(job: CronJob, from: Date = new Date()): string {
  if (job.schedule.cron) {
    try {
      return nextCronOccurrence(job.schedule.cron, from, job.schedule.timezone);
    } catch {
      // fallback to interval if cron unparseable (should not happen after validation)
    }
  }
  const ms = job.schedule.everyMs ?? (job.schedule.every ? parseEveryToMs(job.schedule.every) : 300_000);
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
