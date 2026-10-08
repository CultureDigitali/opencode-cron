import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { saveJobs } from "../src/store.ts";
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
    const client: any = {
      session: {
        status: async () => ({ data: {} }),
        prompt: async (a: any) => {
          sent = a.body.parts[0].text;
          return {};
        },
      },
      tui: { showToast: async () => true },
      app: { log: async () => true },
    };
    const r = await executeTick(dir, "j1", client);
    expect(r.ok).toBe(true);
    expect(sent).toContain("SELF-CHECK");
    expect(sent).toContain("SYS");
  });
  it("skips when busy", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-busy-"));
    await saveJobs(dir, [job("j2", dir, "ses_9")]);
    let called = false;
    const client: any = {
      session: {
        status: async () => ({ data: { ses_9: { status: "busy" } } }),
        prompt: async () => {
          called = true;
          return {};
        },
      },
    };
    const r = await executeTick(dir, "j2", client);
    expect(r.skipped).toBe("busy");
    expect(called).toBe(false);
  });
});
