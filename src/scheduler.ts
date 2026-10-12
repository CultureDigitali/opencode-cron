import { loadJobs, saveJobs, computeNextRun } from "./store.ts";
import { executeTick, type PromptFn } from "./executor.ts";

export class CronScheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private timerSignatures = new Map<string, string>();
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
    this.timerSignatures.clear();
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
        this.timerSignatures.delete(id);
      }
    }

    for (const job of jobs) {
      if (!job.enabled) continue;

      const sig = `${job.nextRunAt ?? ""}_${job.schedule.cron ?? ""}_${job.schedule.everyMs ?? ""}`;
      const existingSig = this.timerSignatures.get(job.id);
      if (this.timers.has(job.id) && existingSig === sig) {
        continue;
      }

      // If timer already exists but schedule/nextRunAt changed, cancel it
      const oldTimer = this.timers.get(job.id);
      if (oldTimer) {
        clearTimeout(oldTimer);
        this.timers.delete(job.id);
      }

      let delay: number;
      if (!job.nextRunAt) {
        delay = job.schedule.everyMs ?? 300_000;
      } else if (new Date(job.nextRunAt).getTime() <= now) {
        if (job.catchUp) {
          delay = 5_000;
        } else {
          job.nextRunAt = computeNextRun(job, new Date());
          await saveJobs(directory, jobs.map((j) => (j.id === job.id ? job : j)));
          delay = Math.max(5_000, new Date(job.nextRunAt!).getTime() - Date.now());
        }
      } else {
        delay = Math.max(5_000, new Date(job.nextRunAt).getTime() - now);
      }

      if (!Number.isFinite(delay) || delay < 5_000) delay = 5_000;
      const jitter = Math.floor(Math.random() * 0.1 * delay);
      const safeDelay = Math.min(delay + jitter, 2_147_483_647);

      const timer = setTimeout(async () => {
        this.timers.delete(job.id);
        this.timerSignatures.delete(job.id);
        try {
          await executeTick(directory, job.id, this.prompt);
        } catch (err) {
          console.error(`Scheduler tick error for ${job.id}:`, err);
        }
        if (this.running) {
          await this.resync(directory).catch(() => {});
        }
      }, safeDelay);

      (timer as any)?.unref?.();
      this.timers.set(job.id, timer);
      this.timerSignatures.set(job.id, sig);
    }
  }

  pendingCount(): number {
    return this.timers.size;
  }
}
