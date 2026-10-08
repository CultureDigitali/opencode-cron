import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { saveJobs, loadJobs } from "../src/store.ts";
import { executeTick } from "../src/executor.ts";

const job = (id: string, dir: string, sessionID: string) => ({
  id,
  sessionID,
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
});

describe("executor", () => {
  it("sends prompt and increments runCount", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-exec-"));
    await saveJobs(dir, [job("j1", dir, "ses_1")]);
    let sent = "";
    let sentTo = "";
    const r = await executeTick(dir, "j1", {
      inFlight: new Set(),
      promptSession: async (sid, text) => {
        sentTo = sid;
        sent = text;
      },
    });
    expect(r.ok).toBe(true);
    expect(sentTo).toBe("ses_1");
    expect(sent).toContain("SELF-CHECK");
    expect(sent).toContain("SYS");
    expect((await loadJobs(dir))[0].runCount).toBe(1);
  });
  it("skips when a tick is already in flight (v2 has no session.status)", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-busy-"));
    await saveJobs(dir, [job("j2", dir, "ses_9")]);
    let called = false;
    const r = await executeTick(dir, "j2", {
      inFlight: new Set([`${dir}::j2`]),
      promptSession: async () => {
        called = true;
      },
    });
    expect(r.skipped).toBe("in-flight");
    expect(called).toBe(false);
  });
  it("auto-pauses after maxConsecutiveFailures", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-fail-"));
    await saveJobs(dir, [{ ...job("j3", dir, "s"), consecutiveFailures: 4 }]);
    const r = await executeTick(dir, "j3", {
      promptSession: async () => {
        throw new Error("boom");
      },
    });
    expect(r.ok).toBe(false);
    const jobs = await loadJobs(dir);
    expect(jobs[0].enabled).toBe(false);
  });
  it("failure advances nextRunAt to a full interval (no 5s retry storm)", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-failnext-"));
    await saveJobs(dir, [job("j4", dir, "s")]);
    const before = Date.now();
    await executeTick(dir, "j4", {
      promptSession: async () => {
        throw new Error("boom");
      },
    });
    const jobs = await loadJobs(dir);
    // everyMs 300s -> next run ~5min out, not seconds
    expect(new Date(jobs[0].nextRunAt!).getTime() - before).toBeGreaterThan(60_000);
  });
});
