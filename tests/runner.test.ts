import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { saveJobs } from "../src/store.ts";
import { writeMemory } from "../src/memory.ts";
import { acquireLock, releaseLock, checkDue, tickArgs } from "../src/runner.ts";

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

describe("runner locks", () => {
  it("acquire is exclusive, release frees, stale is stolen", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-lock-"));
    expect(await acquireLock(dir, "j1")).toBe(true);
    expect(await acquireLock(dir, "j1")).toBe(false);
    await releaseLock(dir, "j1");
    expect(await acquireLock(dir, "j1")).toBe(true);
    await releaseLock(dir, "j1");
    // stale lock (>10min) gets stolen
    const lockFile = path.join(dir, ".opencode", "cron", "locks", "j2.lock");
    await fs.mkdir(path.dirname(lockFile), { recursive: true });
    await fs.writeFile(lockFile, "old", "utf-8");
    const ancient = new Date(Date.now() - 20 * 60_000);
    await fs.utimes(lockFile, ancient, ancient);
    expect(await acquireLock(dir, "j2")).toBe(true);
    await releaseLock(dir, "j2");
  });
  it("rejects traversal ids", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-locksec-"));
    await expect(acquireLock(dir, "../evil" as any)).rejects.toThrow();
  });
});

describe("runner tick args", () => {
  it("never uses --dir (v2 removed the flag), cwd carries the directory", async () => {
    const args = tickArgs({ sessionID: "s", agent: "build", model: "a/b" }, "hello");
    expect(args).toEqual(["run", "--session", "s", "--agent", "build", "--model", "a/b", "hello"]);
    expect(args).not.toContain("--dir");
  });
});

describe("checkDue", () => {
  it("runs due jobs with stub spawn, skips future/disabled/maxed", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-check-"));
    const past = new Date(Date.now() - 60_000).toISOString();
    const future = new Date(Date.now() + 3_600_000).toISOString();
    await saveJobs(dir, [
      job("due", dir, { nextRunAt: past }),
      job("future", dir, { nextRunAt: future }),
      job("off", dir, { enabled: false }),
      job("maxed", dir, { maxRuns: 1, runCount: 1 }),
    ]);
    await writeMemory(dir, "due", "# mem", { seenHashes: [], counts: { news: 0, tweets: 0 }, lastRunAt: null, consecutiveFailures: 0 });
    const calls: any[] = [];
    const ran = await checkDue(dir, async (cmd, args, cwd) => {
      calls.push({ cmd, args, cwd });
      return 0;
    });
    expect(ran).toEqual(["due"]);
    expect(calls).toHaveLength(1);
    expect(calls[0].cmd).toBe("opencode");
    expect(calls[0].args).not.toContain("--dir");
    expect(calls[0].cwd).toBe(dir);
  });
});
