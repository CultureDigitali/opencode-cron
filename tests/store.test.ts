import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { loadJobs, saveJobs, upsertJob, removeJob } from "../src/store.ts";

async function tmpDir(): Promise<string> {
  return await fs.mkdtemp(path.join(os.tmpdir(), "cron-test-"));
}

const job = (id: string) => ({
  id,
  sessionID: "ses_1",
  directory: "/tmp/x",
  title: "Test",
  systemPrompt: "sys",
  followupPrompt: "follow",
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

describe("store", () => {
  it("roundtrips jobs", async () => {
    const dir = await tmpDir();
    await saveJobs(dir, [job("a")]);
    expect(await loadJobs(dir)).toHaveLength(1);
    await upsertJob(dir, { ...job("a"), title: "Updated" });
    const jobs = await loadJobs(dir);
    expect(jobs[0].title).toBe("Updated");
    await removeJob(dir, "a");
    expect(await loadJobs(dir)).toHaveLength(0);
  });
  it("skips invalid entries", async () => {
    const dir = await tmpDir();
    await fs.mkdir(path.join(dir, ".opencode", "cron"), { recursive: true });
    await fs.writeFile(path.join(dir, ".opencode", "cron", "jobs.json"), JSON.stringify([{ garbage: true }]));
    expect(await loadJobs(dir)).toHaveLength(0);
  });
});
