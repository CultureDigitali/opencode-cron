import { describe, it, expect } from "bun:test";
import { normalizeSchedule, nextCronOccurrence, isValidTimezone, resolveCronAlias } from "../src/schedule";
import { filterJobs } from "../src/store";
import type { CronJob } from "../src/types";

describe("Feature 6 & 13: Crontab Aliases, Timezones and Job Filters", () => {
  it("resolves crontab aliases like @daily and @hourly", () => {
    expect(resolveCronAlias("@daily")).toBe("0 0 * * *");
    expect(resolveCronAlias("@midnight")).toBe("0 0 * * *");
    expect(resolveCronAlias("@hourly")).toBe("0 * * * *");
    expect(resolveCronAlias("@weekly")).toBe("0 0 * * 0");
    expect(resolveCronAlias("@monthly")).toBe("0 0 1 * *");
    expect(resolveCronAlias("@yearly")).toBe("0 0 1 1 *");
  });

  it("normalizes and validates schedules with aliases", () => {
    const res = normalizeSchedule({ cron: "@daily" });
    expect(res.kind).toBe("cron");
    expect(res.cron).toBe("0 0 * * *");
  });

  it("validates IANA timezones and computes next occurrence in timezone", () => {
    expect(isValidTimezone("Europe/Rome")).toBe(true);
    expect(isValidTimezone("America/New_York")).toBe(true);
    expect(isValidTimezone("UTC")).toBe(true);
    expect(isValidTimezone("Invalid/Zone")).toBe(false);

    expect(() => normalizeSchedule({ cron: "0 9 * * *", timezone: "Invalid/Zone" }))
      .toThrow("Invalid IANA timezone");

    const norm = normalizeSchedule({ cron: "0 9 * * *", timezone: "Europe/Rome" });
    expect(norm.timezone).toBe("Europe/Rome");

    const nextRun = nextCronOccurrence("0 9 * * *", new Date("2026-10-17T06:00:00Z"), "Europe/Rome");
    expect(nextRun).toBeDefined();
    expect(new Date(nextRun).getTime()).toBeGreaterThan(new Date("2026-10-17T06:00:00Z").getTime());
  });

  it("filters jobs by tag, category, status, and search query", () => {
    const mockJobs: CronJob[] = [
      {
        id: "job-prod-1",
        sessionID: "s1",
        directory: "/tmp",
        title: "Production Sync Service",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 60000 },
        tags: ["prod", "sync"],
        category: "infrastructure",
        enabled: true,
        catchUp: false,
        skipIfRunning: true,
        maxRuns: 0,
        maxConsecutiveFailures: 5,
        runCount: 10,
        consecutiveFailures: 0,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        nextRunAt: null,
      },
      {
        id: "job-dev-1",
        sessionID: "s2",
        directory: "/tmp",
        title: "Dev Backup Service",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 120000 },
        tags: ["dev", "backup"],
        category: "maintenance",
        enabled: false,
        catchUp: false,
        skipIfRunning: true,
        maxRuns: 0,
        maxConsecutiveFailures: 5,
        runCount: 2,
        consecutiveFailures: 0,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        nextRunAt: null,
      },
    ];

    // Filter by tag
    expect(filterJobs(mockJobs, { tag: "prod" })).toHaveLength(1);
    expect(filterJobs(mockJobs, { tag: "backup" })).toHaveLength(1);
    expect(filterJobs(mockJobs, { tag: "nonexistent" })).toHaveLength(0);

    // Filter by category
    expect(filterJobs(mockJobs, { category: "infrastructure" })).toHaveLength(1);
    expect(filterJobs(mockJobs, { category: "maintenance" })).toHaveLength(1);

    // Filter by status
    expect(filterJobs(mockJobs, { status: "enabled" })).toHaveLength(1);
    expect(filterJobs(mockJobs, { status: "disabled" })).toHaveLength(1);

    // Filter by text search
    expect(filterJobs(mockJobs, { search: "Sync" })).toHaveLength(1);
    expect(filterJobs(mockJobs, { search: "job-dev" })).toHaveLength(1);
    expect(filterJobs(mockJobs, { search: "prod" })).toHaveLength(1);
  });
});

