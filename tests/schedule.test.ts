import { describe, it, expect } from "bun:test";
import { parseEveryToMs, normalizeSchedule } from "../src/schedule.ts";

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
