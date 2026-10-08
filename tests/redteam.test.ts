import { describe, it, expect } from "bun:test";
import { normalizeSchedule, nextCronOccurrence } from "../src/schedule.ts";
import { computeNextRun } from "../src/store.ts";
import { writeMemory, memoryMdPath } from "../src/memory.ts";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

const baseJob = (cron: string) => ({
  id: "cron-d1",
  sessionID: "s",
  directory: "/tmp",
  title: "t",
  systemPrompt: "sys",
  followupPrompt: "f",
  schedule: { kind: "cron" as const, cron },
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

describe("D1 cron evaluation", () => {
  it("differentiates */5 vs daily 9am", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    const a = computeNextRun(baseJob("*/5 * * * *"), from);
    const b = computeNextRun(baseJob("0 9 * * *"), from);
    expect(a).not.toBe(b);
    expect(new Date(a).getTime()).toBeLessThan(new Date(b).getTime());
  });
  it("rejects semantically invalid cron", () => {
    expect(() => normalizeSchedule({ cron: "99 99 * * *" })).toThrow();
  });
  it("nextCronOccurrence moves forward", () => {
    const n = nextCronOccurrence("*/5 * * * *", new Date("2026-01-01T00:00:00Z"));
    expect(new Date(n).getTime()).toBeGreaterThan(new Date("2026-01-01T00:00:00Z").getTime());
  });
});

describe("D2 path traversal", () => {
  it("rejects ../evil ids", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-sec-"));
    let threw = false;
    try {
      await writeMemory(dir, "../evil" as any, "x", { seenHashes: [], counts: { news: 0, tweets: 0 }, lastRunAt: null, consecutiveFailures: 0 });
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
    expect(await fs.stat(memoryMdPath(dir, "ok-id")).catch(() => null)).toBeNull();
  });
});
