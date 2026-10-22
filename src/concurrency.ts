import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  CronSettingsSchema,
  JobPrioritySchema,
  type CronSettings,
  type JobPriority,
  type QueueItem,
  type QueueStatus,
  type QueueSource,
} from "./types.ts";
import { cronDir, ensureCronDir, assertJobId } from "./store.ts";
import { replaceFile } from "./atomic.ts";

export const PRIORITY_WEIGHT: Record<JobPriority, number> = {
  high: 3,
  normal: 2,
  low: 1,
};

export function getJobPriorityWeight(priority?: JobPriority): number {
  return PRIORITY_WEIGHT[priority ?? "normal"] ?? 2;
}

export function compareJobPriority(
  a: { priority?: JobPriority; nextRunAt?: string | null; id: string; enqueuedAt?: string },
  b: { priority?: JobPriority; nextRunAt?: string | null; id: string; enqueuedAt?: string }
): number {
  const pA = getJobPriorityWeight(a.priority);
  const pB = getJobPriorityWeight(b.priority);
  if (pA !== pB) return pB - pA; // Higher weight first (e.g. 3 before 2)

  // If enqueuedAt is present, FIFO order within same priority
  if (a.enqueuedAt && b.enqueuedAt) {
    const timeA = new Date(a.enqueuedAt).getTime();
    const timeB = new Date(b.enqueuedAt).getTime();
    const safeTimeA = Number.isFinite(timeA) ? timeA : 0;
    const safeTimeB = Number.isFinite(timeB) ? timeB : 0;
    if (safeTimeA !== safeTimeB) return safeTimeA - safeTimeB;
  }

  // Otherwise compare nextRunAt (earliest due first)
  const dueA = a.nextRunAt ? new Date(a.nextRunAt).getTime() : 0;
  const dueB = b.nextRunAt ? new Date(b.nextRunAt).getTime() : 0;
  const safeDueA = Number.isFinite(dueA) ? dueA : 0;
  const safeDueB = Number.isFinite(dueB) ? dueB : 0;
  if (safeDueA !== safeDueB) return safeDueA - safeDueB;

  // Deterministic tie-breaker
  return a.id.localeCompare(b.id);
}

export function settingsFile(directory: string): string {
  return path.join(cronDir(directory), "settings.json");
}

export async function loadCronSettings(directory: string): Promise<CronSettings> {
  const envVal = process.env.OPENCODE_CRON_CONCURRENCY;
  let envConcurrency: number | undefined;
  if (envVal) {
    const parsed = parseInt(envVal, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 10) {
      envConcurrency = parsed;
    }
  }

  const file = settingsFile(directory);
  try {
    const raw = await fs.readFile(file, "utf-8");
    const parsed = CronSettingsSchema.safeParse(JSON.parse(raw));
    if (parsed.success) {
      if (envConcurrency !== undefined) {
        return { ...parsed.data, maxConcurrency: envConcurrency };
      }
      return parsed.data;
    }
  } catch {
    // File not found or unparseable, return defaults
  }

  return CronSettingsSchema.parse({
    maxConcurrency: envConcurrency ?? 2,
  });
}

export async function saveCronSettings(
  directory: string,
  updates: Partial<CronSettings>
): Promise<CronSettings> {
  await ensureCronDir(directory);
  const current = await loadCronSettings(directory);
  const merged = CronSettingsSchema.parse({ ...current, ...updates });
  const file = settingsFile(directory);
  const tmp = `${file}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    await fs.writeFile(tmp, JSON.stringify(merged, null, 2), { encoding: "utf-8", mode: 0o600 });
    await fs.chmod(tmp, 0o600).catch(() => {});
    await replaceFile(tmp, file);
    await fs.chmod(file, 0o600).catch(() => {});
  } catch (err) {
    await fs.unlink(tmp).catch(() => {});
    throw err;
  }
  return merged;
}

/** Inspects .opencode/cron/locks/ to count and return active live process locks */
export async function getActiveLocks(directory: string): Promise<string[]> {
  const lockDir = path.join(directory, ".opencode", "cron", "locks");
  try {
    const files = await fs.readdir(lockDir);
    const active: string[] = [];
    for (const f of files) {
      if (!f.endsWith(".lock")) continue;
      const jobId = f.slice(0, -5);
      const lockPath = path.join(lockDir, f);
      try {
        const content = await fs.readFile(lockPath, "utf-8");
        const pid = parseInt(content.split(" ")[0], 10);
        if (Number.isFinite(pid) && pid > 0) {
          try {
            process.kill(pid, 0);
            active.push(jobId);
          } catch (err: any) {
            if (err && err.code === "EPERM") {
              // Process is alive but owned by another user/process
              active.push(jobId);
            } else {
              // ESRCH: dead process, prune stale lock
              await fs.unlink(lockPath).catch(() => {});
            }
          }
        }
      } catch {
        // file reading error
      }
    }
    return active;
  } catch {
    return [];
  }
}

/** Executes an array of items using a bounded worker pool of size `limit`. */
export async function runWithConcurrencyPool<T, R>(
  items: T[],
  limit: number,
  taskFn: (item: T) => Promise<R>
): Promise<R[]> {
  const safeLimit =
    typeof limit === "number" && Number.isFinite(limit)
      ? Math.max(1, Math.min(Math.floor(limit), 10))
      : 2;

  if (items.length === 0) return [];
  if (safeLimit === 1) {
    // Fast path: sequential
    const results: R[] = [];
    for (const item of items) {
      results.push(await taskFn(item));
    }
    return results;
  }

  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  let firstError: any = null;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      if (firstError) break;
      const idx = nextIndex++;
      try {
        results[idx] = await taskFn(items[idx]);
      } catch (err: any) {
        if (!firstError) firstError = err;
        break;
      }
    }
  }

  const workerCount = Math.min(safeLimit, items.length);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);
  if (firstError) throw firstError;
  return results;
}

interface TaskListener<T> {
  resolve: (res: EnqueueResult<T>) => void;
  reject: (err: any) => void;
}

interface QueuedTask<T> {
  item: QueueItem;
  execute: () => Promise<T>;
  listeners: TaskListener<T>[];
}

export interface EnqueueOptions<T> {
  jobId: string;
  priority?: JobPriority;
  source?: QueueSource;
  skipIfRunning?: boolean;
  execute: () => Promise<T>;
}

export interface EnqueueResult<T> {
  status: "completed" | "skipped" | "failed";
  result?: T;
  error?: string;
}

export class ConcurrencyManager {
  private maxConcurrency = 2;
  private running = new Map<string, { item: QueueItem; promise: Promise<unknown> }>();
  private queue: QueuedTask<any>[] = [];
  private idCounter = 0;

  constructor(public readonly directory: string, initialConcurrency = 2) {
    this.maxConcurrency =
      typeof initialConcurrency === "number" && Number.isFinite(initialConcurrency)
        ? Math.max(1, Math.min(Math.floor(initialConcurrency), 10))
        : 2;
  }

  async init(): Promise<void> {
    const settings = await loadCronSettings(this.directory);
    this.maxConcurrency = settings.maxConcurrency;
  }

  getMaxConcurrency(): number {
    return this.maxConcurrency;
  }

  setMaxConcurrency(limit: number): void {
    this.maxConcurrency =
      typeof limit === "number" && Number.isFinite(limit)
        ? Math.max(1, Math.min(Math.floor(limit), 10))
        : 2;
    this.drain();
  }

  isJobRunning(jobId: string): boolean {
    return this.running.has(jobId);
  }

  isJobQueued(jobId: string): boolean {
    return this.queue.some((q) => q.item.jobId === jobId);
  }

  getStatus(): QueueStatus {
    const runningList: QueueItem[] = Array.from(this.running.values()).map((r) => ({ ...r.item }));
    const queuedList: QueueItem[] = this.queue.map((q) => ({ ...q.item }));
    return {
      maxConcurrency: this.maxConcurrency,
      activeCount: this.running.size,
      queuedCount: this.queue.length,
      running: runningList,
      queued: queuedList,
    };
  }

  enqueue<T = unknown>(opts: EnqueueOptions<T>): Promise<EnqueueResult<T>> {
    assertJobId(opts.jobId);
    const priority = opts.priority ? JobPrioritySchema.parse(opts.priority) : "normal";
    const source = opts.source ?? "manual";
    const skipIfRunning = opts.skipIfRunning ?? true;

    if (skipIfRunning && this.isJobRunning(opts.jobId)) {
      return Promise.resolve({
        status: "skipped",
        error: `Job '${opts.jobId}' is already running`,
      });
    }

    // Check if job is already waiting in queue
    const existingIdx = this.queue.findIndex((q) => q.item.jobId === opts.jobId);
    if (existingIdx !== -1) {
      const existing = this.queue[existingIdx];
      // If new priority is higher, promote existing queued item
      if (getJobPriorityWeight(priority) > getJobPriorityWeight(existing.item.priority)) {
        existing.item.priority = priority;
        this.sortQueue();
      }
      // Return a promise that resolves when existing finishes via listener
      return new Promise<EnqueueResult<T>>((resolve, reject) => {
        existing.listeners.push({ resolve, reject });
      });
    }

    const queueId = `q_${Date.now()}_${++this.idCounter}`;
    const queueItem: QueueItem = {
      id: queueId,
      jobId: opts.jobId,
      priority,
      source,
      enqueuedAt: new Date().toISOString(),
      status: "queued",
    };

    return new Promise((resolve, reject) => {
      this.queue.push({
        item: queueItem,
        execute: opts.execute,
        listeners: [{ resolve, reject }],
      });

      this.sortQueue();
      this.drain();
    });
  }

  cancelQueued(jobId: string): boolean {
    const idx = this.queue.findIndex((q) => q.item.jobId === jobId);
    if (idx === -1) return false;
    const [removed] = this.queue.splice(idx, 1);
    const result: EnqueueResult<any> = {
      status: "skipped",
      error: "Cancelled from queue",
    };
    for (const l of removed.listeners) {
      l.resolve(result);
    }
    return true;
  }

  clearQueue(): number {
    const count = this.queue.length;
    const cleared = this.queue.splice(0, this.queue.length);
    const result: EnqueueResult<any> = {
      status: "skipped",
      error: "Queue cleared",
    };
    for (const task of cleared) {
      for (const l of task.listeners) {
        l.resolve(result);
      }
    }
    return count;
  }

  private sortQueue(): void {
    this.queue.sort((a, b) =>
      compareJobPriority(
        {
          id: a.item.jobId,
          priority: a.item.priority,
          enqueuedAt: a.item.enqueuedAt,
        },
        {
          id: b.item.jobId,
          priority: b.item.priority,
          enqueuedAt: b.item.enqueuedAt,
        }
      )
    );
  }

  private drain(): void {
    while (this.running.size < this.maxConcurrency && this.queue.length > 0) {
      // Find the first task in queue whose jobId is NOT currently running
      const nextIdx = this.queue.findIndex((task) => !this.isJobRunning(task.item.jobId));
      if (nextIdx === -1) break;

      const [task] = this.queue.splice(nextIdx, 1);
      const { item, execute, listeners } = task;
      item.status = "running";
      item.startedAt = new Date().toISOString();

      // IMPORTANT: Register in running map BEFORE executing to prevent race conditions
      const runningEntry: { item: QueueItem; promise: Promise<unknown> } = {
        item,
        promise: Promise.resolve(),
      };
      this.running.set(item.jobId, runningEntry);

      runningEntry.promise = (async () => {
        let finalResult: EnqueueResult<any>;
        try {
          const result = await execute();
          item.status = "completed";
          item.finishedAt = new Date().toISOString();
          finalResult = { status: "completed", result };
        } catch (err: any) {
          item.status = "failed";
          item.finishedAt = new Date().toISOString();
          item.error = String(err?.message ?? err);
          finalResult = { status: "failed", error: item.error };
        } finally {
          this.running.delete(item.jobId);
          this.drain();
        }

        // Iteratively notify all listeners
        for (const listener of listeners) {
          try {
            listener.resolve(finalResult);
          } catch (err: any) {
            listener.reject(err);
          }
        }
      })();
    }
  }
}
