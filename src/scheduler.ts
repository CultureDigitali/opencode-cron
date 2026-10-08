import { loadJobs, saveJobs, computeNextRun } from "./store.ts";
import { executeTick, type PromptFn } from "./executor.ts";

export class CronScheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private running = false;

  constructor(private prompt: PromptFn) {}

  async start(directory: string): Promise<void> {
    if (this.running) return;
    this.running = true;
    await this.resync(directory);
  }

  stop(): void {
    this.running = false;
    for (const t of this.timers.values()) clearTimeout(t);
    this.timers.clear();
  }

  async resync(directory: string): Promise<void> {
    if (!this.running) return;
    const jobs = await loadJobs(directory);
    const now = Date.now();
    const wanted = new Set(jobs.filter((j) => j.enabled).map((j) => j.id));

    for (const [id, t] of this.timers) {
      if (!wanted.has(id)) {
        clearTimeout(t);
        this.timers.delete(id);
      }
    }
    for (const job of jobs) {
      if (!job.enabled) continue;
      if (this.timers.has(job.id)) continue;
      let delay: number;
      if (!job.nextRunAt) {
        delay = job.schedule.everyMs ?? 300_000;
      } else if (new Date(job.nextRunAt).getTime() <= now) {
        if (job.catchUp) {
          // Missed tick and catchUp requested: fire soon.
          delay = 5_000;
        } else {
          // Missed tick and no catchUp: skip the backlog, schedule fresh.
          job.nextRunAt = computeNextRun(job, new Date());
          await saveJobs(directory, jobs.map((j) => (j.id === job.id ? job : j)));
          delay = Math.max(5_000, new Date(job.nextRunAt!).getTime() - Date.now());
        }
      } else {
        delay = Math.max(5_000, new Date(job.nextRunAt).getTime() - now);
      }
      const jitter = Math.floor(Math.random() * 0.1 * delay);
      const timer = setTimeout(async () => {
        this.timers.delete(job.id);
        await executeTick(directory, job.id, this.prompt);
        if (this.running) await this.resync(directory);
      }, Math.min(delay + jitter, 2_147_483_647));
      (timer as any)?.unref?.();
      this.timers.set(job.id, timer);
    }
  }

  pendingCount(): number {
    return this.timers.size;
  }
}
