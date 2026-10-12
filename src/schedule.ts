import cronParser from "cron-parser";

const parseExpression: typeof cronParser.parseExpression =
  (cronParser as any).parseExpression ?? (cronParser as any).default?.parseExpression ?? (cronParser as any);

const UNIT_MS: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

export function parseEveryToMs(input: string): number {
  const m = input.trim().toLowerCase().match(/^(\d+)\s*([smhd])$/);
  if (!m) throw new Error(`Invalid interval "${input}". Use e.g. 1m, 5m, 1h, 1d.`);
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
  if (raw.everyMs !== undefined) {
    if (!Number.isFinite(raw.everyMs) || raw.everyMs < 60_000) {
      throw new Error("Interval too small or invalid. Minimum is 60000ms.");
    }
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

export interface ScheduleExplanation {
  ok: boolean;
  valid: boolean;
  error?: string;
  kind?: "interval" | "cron";
  description: string;
  humanDescription: string;
  nextRuns: string[];
}

export function explainSchedule(input: string, fromDate: Date = new Date()): ScheduleExplanation {
  const trimmed = (input || "").trim();
  if (!trimmed) {
    const err = "Specifica un intervallo (es. 5m, 1h) o cron (es. */5 * * * *)";
    return { ok: false, valid: false, error: err, description: err, humanDescription: err, nextRuns: [] };
  }

  // 1. Interval
  const m = trimmed.toLowerCase().match(/^(\d+)\s*([smhd])$/);
  if (m) {
    const val = parseInt(m[1], 10);
    const unit = m[2];
    const unitMap: Record<string, string> = { s: "secondi", m: "minuti", h: "ore", d: "giorni" };
    const unitSingular: Record<string, string> = { s: "secondo", m: "minuto", h: "ora", d: "giorno" };
    const desc = val === 1 ? `Ogni ${unitSingular[unit]}` : `Ogni ${val} ${unitMap[unit]}`;

    const mult = UNIT_MS[unit] || 60000;
    const ms = val * mult;
    if (ms < 60000) {
      const err = "Intervallo minimo consentito: 60s (per evitare loop di spesa)";
      return { ok: false, valid: false, error: err, description: err, humanDescription: err, nextRuns: [] };
    }

    const now = fromDate.getTime();
    const nextRuns = [
      new Date(now + ms).toISOString(),
      new Date(now + 2 * ms).toISOString(),
      new Date(now + 3 * ms).toISOString(),
    ];
    return { ok: true, valid: true, kind: "interval", description: desc, humanDescription: desc, nextRuns };
  }

  // 2. Cron 5 fields
  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) {
    const err = "Formato non valido. Usa un intervallo (es. 5m, 1h) o cron a 5 campi (es. */5 * * * *)";
    return { ok: false, valid: false, error: err, description: err, humanDescription: err, nextRuns: [] };
  }

  try {
    const it = parseExpression(trimmed, { currentDate: fromDate });
    const nextRuns = [
      (it.next().toDate() as Date).toISOString(),
      (it.next().toDate() as Date).toISOString(),
      (it.next().toDate() as Date).toISOString(),
    ];

    let desc = "Pianificazione cron attiva";
    const [min, hour, dom, mon, dow] = parts;

    if (min === "*/5" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Ogni 5 minuti";
    else if (min === "*/10" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Ogni 10 minuti";
    else if (min === "*/15" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Ogni 15 minuti";
    else if (min === "*/30" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Ogni 30 minuti";
    else if (min === "0" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Ogni ora al minuto 00";
    else if (min === "0" && hour === "0" && dom === "*" && mon === "*" && dow === "*") desc = "Tutti i giorni a mezzanotte (00:00)";
    else if (dom === "*" && mon === "*" && dow === "*") desc = `Tutti i giorni alle ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
    else if (dom === "*" && mon === "*" && (dow === "1-5" || dow === "1,2,3,4,5")) desc = `Dal lunedì al venerdì alle ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
    else if (dom === "*" && mon === "*" && (dow === "0" || dow === "7")) desc = `Ogni domenica alle ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
    else if (dom === "*" && mon === "*" && dow === "1") desc = `Ogni lunedì alle ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
    else desc = `Cron: ${trimmed}`;

    return { ok: true, valid: true, kind: "cron", description: desc, humanDescription: desc, nextRuns };
  } catch (err: any) {
    const errorMsg = `Sintassi cron non valida: ${err.message}`;
    return { ok: false, valid: false, error: errorMsg, description: errorMsg, humanDescription: errorMsg, nextRuns: [] };
  }
}

