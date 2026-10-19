import { describe, it, expect } from "bun:test";
import { previewSchedule } from "../src/schedule.ts";

describe("Schedule Preview & Heatmap Engine", () => {
  it("generates preview for 5m interval", () => {
    const from = new Date("2026-01-01T00:00:00.000Z");
    const res = previewSchedule("5m", { n: 5, from, lang: "en" });

    expect(res.ok).toBe(true);
    expect(res.valid).toBe(true);
    expect(res.kind).toBe("interval");
    expect(res.nextRuns.length).toBe(5);
    expect(res.nextRuns[0].iso).toBe("2026-01-01T00:05:00.000Z");
    expect(res.nextRuns[1].iso).toBe("2026-01-01T00:10:00.000Z");
    expect(res.totalIn7Days).toBeGreaterThan(100);
    expect(res.heatmap.length).toBe(7 * 24);
  });

  it("generates preview for cron expression with timezone", () => {
    const from = new Date("2026-01-01T00:00:00.000Z");
    const res = previewSchedule("0 12 * * *", { n: 7, timezone: "UTC", from, lang: "en" });

    expect(res.ok).toBe(true);
    expect(res.valid).toBe(true);
    expect(res.kind).toBe("cron");
    expect(res.nextRuns.length).toBe(7);
    expect(res.nextRuns[0].iso).toBe("2026-01-01T12:00:00.000Z");
    expect(res.nextRuns[1].iso).toBe("2026-01-02T12:00:00.000Z");
    expect(res.totalIn7Days).toBe(7);

    // Heatmap should show 1 count for hour 12 on each day
    const hour12Cells = res.heatmap.filter((c) => c.hour === 12);
    expect(hour12Cells.length).toBe(7);
    for (const cell of hour12Cells) {
      expect(cell.count).toBe(1);
    }
  });

  it("handles cron aliases like @daily", () => {
    const from = new Date("2026-01-01T00:00:00.000Z");
    const res = previewSchedule("@daily", { n: 3, timezone: "UTC", from, lang: "en" });

    expect(res.ok).toBe(true);
    expect(res.kind).toBe("cron");
    expect(res.nextRuns.length).toBe(3);
    expect(res.nextRuns[0].iso).toBe("2026-01-02T00:00:00.000Z");
  });

  it("rejects invalid cron expressions", () => {
    const res = previewSchedule("99 99 * * *", { lang: "en" });
    expect(res.ok).toBe(false);
    expect(res.valid).toBe(false);
    expect(res.error).toBeDefined();
    expect(res.nextRuns.length).toBe(0);
  });

  it("rejects invalid timezone", () => {
    const res = previewSchedule("5m", { timezone: "Invalid/Not_A_Timezone" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("Invalid IANA timezone");
  });

  it("clamps n between 1 and 50", () => {
    const from = new Date("2026-01-01T00:00:00.000Z");
    const resLarge = previewSchedule("1h", { n: 100, from });
    expect(resLarge.nextRuns.length).toBe(50);

    const resSmall = previewSchedule("1h", { n: -5, from });
    expect(resSmall.nextRuns.length).toBe(1);
  });

  it("returns Italian localization when lang=it", () => {
    const from = new Date("2026-01-01T00:00:00.000Z");
    const res = previewSchedule("5m", { from, lang: "it" });
    expect(res.ok).toBe(true);
    expect(res.humanDescription).toBe("Ogni 5 minuti");
  });
});

