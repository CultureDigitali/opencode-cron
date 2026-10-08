import { parseExpression } from "cron-parser";

const UNIT_MS: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

export function parseEveryToMs(input: string): number {
  const m = input.trim().toLowerCase().match(/^(\d+)\s*([smhd])$/);
  if (!m) throw new Error(`Invalid interval "${input}". Use e.g. 5m, 1h, 30s, 1d.`);
  const ms = parseInt(m[1], 10) * UNIT_MS[m[2]];
  if (ms < 60_000) throw new Error(`Interval too small (${ms}ms). Minimum is 60s to avoid cost loops.`);
  return ms;
}

export function normalizeSchedule(raw: { every?: string; cron?: string; everyMs?: number }): { everyMs?: number; cron?: string; kind: "interval" | "cron" } {
  if (raw.cron) {
    const cron = raw.cron.trim();
    if (cron.length > 100) throw new Error("Cron expression too long (max 100 chars).");
    const parts = cron.split(/\s+/);
    if (parts.length !== 5) throw new Error(`Invalid cron "${raw.cron}". Expected 5 fields (e.g. */5 * * * *).`);
    // Semantic validation via cron-parser (throws on invalid like 99 99 * * *)
    validateCron(cron);
    return { cron, everyMs: raw.everyMs, kind: "cron" };
  }
  if (raw.everyMs) {
    if (raw.everyMs < 60_000) throw new Error("Interval too small. Minimum is 60000ms.");
    return { everyMs: raw.everyMs, kind: "interval" };
  }
  if (raw.every) return { everyMs: parseEveryToMs(raw.every), kind: "interval" };
  throw new Error("Provide either every (e.g. 5m) or cron (e.g. */5 * * * *).");
}

export function validateCron(cron: string): void {
  parseExpression(cron);
}

export function nextCronOccurrence(cron: string, from: Date = new Date(), timezone?: string): string {
  const it = parseExpression(cron, { currentDate: from, tz: timezone });
  return (it.next().toDate() as Date).toISOString();
}
