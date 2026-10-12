import { describe, it, expect } from "bun:test";
import { parseEveryToMs, normalizeSchedule, explainSchedule } from "../src/schedule.ts";

describe("parseEveryToMs", () => {
  it("parses 5m to 300000", () => {
    expect(parseEveryToMs("5m")).toBe(300_000);
  });
  it("rejects intervals below 60s", () => {
    expect(() => parseEveryToMs("30s")).toThrow();
  });
  it("rejects garbage", () => {
    expect(() => parseEveryToMs("banana")).toThrow();
  });
});

describe("normalizeSchedule", () => {
  it("accepts every", () => {
    expect(normalizeSchedule({ every: "5m" })).toEqual({ everyMs: 300_000, kind: "interval" });
  });
  it("accepts cron 5 fields", () => {
    const r = normalizeSchedule({ cron: "*/5 * * * *" });
    expect(r.kind).toBe("cron");
  });
  it("rejects bad cron", () => {
    expect(() => normalizeSchedule({ cron: "* * *" })).toThrow();
  });
});

describe("explainSchedule", () => {
  it("explains interval schedules and calculates next runs", () => {
    const res = explainSchedule("15m", new Date("2026-01-01T10:00:00.000Z"));
    expect(res.valid).toBe(true);
    expect(res.kind).toBe("interval");
    expect(res.description).toContain("15 minuti");
    expect(res.nextRuns.length).toBe(3);
    expect(res.nextRuns[0]).toBe("2026-01-01T10:15:00.000Z");
    expect(res.nextRuns[1]).toBe("2026-01-01T10:30:00.000Z");
    expect(res.nextRuns[2]).toBe("2026-01-01T10:45:00.000Z");
  });

  it("explains cron schedules with next 3 runs", () => {
    const res = explainSchedule("0 9 * * *", new Date("2026-01-01T08:00:00.000Z"));
    expect(res.valid).toBe(true);
    expect(res.kind).toBe("cron");
    expect(res.description).toContain("09:00");
    expect(res.nextRuns.length).toBe(3);
  });

  it("returns invalid for malformed expressions", () => {
    const res = explainSchedule("invalid-syntax-xyz");
    expect(res.valid).toBe(false);
    expect(res.description).toContain("Formato non valido");
    expect(res.nextRuns).toEqual([]);
  });
});

