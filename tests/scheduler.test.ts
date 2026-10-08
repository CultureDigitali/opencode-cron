import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { saveJobs, loadJobs } from "../src/store.ts";
import { CronScheduler } from "../src/scheduler.ts";

const job = (id: string, dir: string, over: Record<string, any> = {}) => ({
  id,
  sessionID: "ses_1",
  directory: dir,
  title: "T",
  systemPrompt: "SYS",
  followupPrompt: "FUP",
  schedule: { kind: "interval" as const, everyMs: 300_000 },
  enabled: true,
  catchUp: false,
  skipIfRunning: true,
  maxRuns: 0,
  maxConsecutiveFailures: 5,
  runCount: 0,
  consecutiveFailures: 0,
  createdAt: new Date().toISOString(),
  lastRunAt: null,
  nextRunAt: null,
  ...over,
});

const noprompt = { promptSession: async () => {} };

describe("scheduler", () => {
  it("arms timers for enabled jobs, skips disabled", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-sched-"));
    const future = new Date(Date.now() + 3_600_000).toISOString();
    await saveJobs(dir, [job("a", dir, { nextRunAt: future }), job("b", dir, { enabled: false })]);
    const s = new CronScheduler(noprompt);
    await s.start(dir);
    expect(s.pendingCount()).toBe(1);
    s.stop();
    expect(s.pendingCount()).toBe(0);
  });
  it("past-due + catchUp=false skips backlog with fresh nextRunAt", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-nocatch-"));
    const past = new Date(Date.now() - 3_600_000).toISOString();
    await saveJobs(dir, [job("a", dir, { nextRunAt: past, catchUp: false })]);
    const s = new CronScheduler(noprompt);
    await s.start(dir);
    const jobs = await loadJobs(dir);
    expect(new Date(jobs[0].nextRunAt!).getTime()).toBeGreaterThan(Date.now());
    s.stop();
  });
  it("past-due + catchUp=true keeps overdue (fires soon)", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-catch-"));
    const past = new Date(Date.now() - 3_600_000).toISOString();
    await saveJobs(dir, [job("a", dir, { nextRunAt: past, catchUp: true })]);
    const s = new CronScheduler(noprompt);
    await s.start(dir);
    const jobs = await loadJobs(dir);
    expect(new Date(jobs[0].nextRunAt!).getTime()).toBeLessThan(Date.now());
    expect(s.pendingCount()).toBe(1);
    s.stop();
  });
});
