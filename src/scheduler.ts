import { loadJobs } from "./store.ts";
import { executeTick, type OpencodeClientLike } from "./executor.ts";

export class CronScheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private running = false;

  constructor(private client: OpencodeClientLike) {}

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

    // clear removed/disabled
    for (const [id, t] of this.timers) {
      if (!wanted.has(id)) {
        clearTimeout(t);
        this.timers.delete(id);
      }
    }
    for (const job of jobs) {
      if (!job.enabled) continue;
      if (this.timers.has(job.id)) continue;
      const delay = job.nextRunAt
        ? Math.max(5_000, new Date(job.nextRunAt).getTime() - now)
        : (job.schedule.everyMs ?? 300_000);
      const jitter = Math.floor(Math.random() * 0.1 * delay);
      const timer = setTimeout(async () => {
        this.timers.delete(job.id);
        await executeTick(directory, job.id, this.client);
        if (this.running) await this.resync(directory);
      }, Math.min(delay + jitter, 2_147_483_647));
      // unref in node/bun so it never blocks exit
      (timer as any)?.unref?.();
      this.timers.set(job.id, timer);
    }
  }

  pendingCount(): number {
    return this.timers.size;
  }
}
