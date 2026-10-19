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

export const CRON_ALIASES: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

export function resolveCronAlias(input: string): string {
  const lower = input.trim().toLowerCase();
  return CRON_ALIASES[lower] ?? input.trim();
}

export function isValidTimezone(tz: string): boolean {
  if (!tz || typeof tz !== "string") return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function normalizeSchedule(raw: { every?: string; cron?: string; everyMs?: number; timezone?: string }): { everyMs?: number; cron?: string; kind: "interval" | "cron"; timezone?: string } {
  if (raw.timezone && !isValidTimezone(raw.timezone)) {
    throw new Error(`Invalid IANA timezone: "${raw.timezone}". Example: Europe/Rome, America/New_York, UTC.`);
  }

  if (raw.cron) {
    const cron = resolveCronAlias(raw.cron);
    if (cron.length > 100) throw new Error("Cron expression too long (max 100 chars).");
    const parts = cron.split(/\s+/);
    if (parts.length !== 5) throw new Error(`Invalid cron "${raw.cron}". Expected 5 fields (e.g. */5 * * * *) or alias like @daily.`);
    // Semantic validation via cron-parser (throws on invalid like 99 99 * * *)
    validateCron(cron, raw.timezone);
    return { cron, everyMs: raw.everyMs, kind: "cron", timezone: raw.timezone };
  }
  if (raw.everyMs !== undefined) {
    if (!Number.isFinite(raw.everyMs) || raw.everyMs < 60_000) {
      throw new Error("Interval too small or invalid. Minimum is 60000ms.");
    }
    return { everyMs: raw.everyMs, kind: "interval", timezone: raw.timezone };
  }
  if (raw.every) return { everyMs: parseEveryToMs(raw.every), kind: "interval", timezone: raw.timezone };
  throw new Error("Provide either every (e.g. 5m) or cron (e.g. */5 * * * *, @daily).");
}

export function validateCron(cron: string, timezone?: string): void {
  const resolved = resolveCronAlias(cron);
  parseExpression(resolved, timezone ? { tz: timezone } : undefined);
}

export function nextCronOccurrence(cron: string, from: Date = new Date(), timezone?: string): string {
  const resolved = resolveCronAlias(cron);
  const it = parseExpression(resolved, { currentDate: from, tz: timezone });
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
  adaptiveInfo?: string;
}

export function formatMsDuration(ms: number): string {
  if (ms % 3_600_000 === 0) return `${ms / 3_600_000}h`;
  if (ms % 60_000 === 0) return `${ms / 60_000}m`;
  return `${Math.round(ms / 1000)}s`;
}

export function explainAdaptive(
  adaptive?: {
    enabled?: boolean;
    burstEveryMs?: number;
    idleEveryMs?: number;
    quietThreshold?: number;
    currentCadence?: string;
    activeUntil?: string | null;
  },
  lang: string = "it"
): string | undefined {
  if (!adaptive || !adaptive.enabled) return undefined;
  const isEn = lang === "en";
  const burstStr = formatMsDuration(adaptive.burstEveryMs ?? 60_000);
  const idleStr = formatMsDuration(adaptive.idleEveryMs ?? 1_800_000);
  const thresh = adaptive.quietThreshold ?? 3;

  if (isEn) {
    return `Smart Adaptive: bursts every ${burstStr} during activity, backs off to ${idleStr} after ${thresh} quiet checks.`;
  }
  return `Cadenza Adattiva: burst ogni ${burstStr} se attivo, rallenta a ${idleStr} dopo ${thresh} verifiche senza novità.`;
}

export function explainSchedule(input: string, fromDate: Date = new Date(), lang: string = "it"): ScheduleExplanation {
  const isEn = lang === "en";
  const trimmed = (input || "").trim();
  if (!trimmed) {
    const err = isEn
      ? "Specify an interval (e.g. 5m, 1h) or cron (e.g. */5 * * * *)"
      : "Specifica un intervallo (es. 5m, 1h) o cron (es. */5 * * * *)";
    return { ok: false, valid: false, error: err, description: err, humanDescription: err, nextRuns: [] };
  }

  // 1. Interval
  const m = trimmed.toLowerCase().match(/^(\d+)\s*([smhd])$/);
  if (m) {
    const val = parseInt(m[1], 10);
    const unit = m[2];
    const unitMapIt: Record<string, string> = { s: "secondi", m: "minuti", h: "ore", d: "giorni" };
    const unitSingularIt: Record<string, string> = { s: "secondo", m: "minuto", h: "ora", d: "giorno" };
    const unitMapEn: Record<string, string> = { s: "seconds", m: "minutes", h: "hours", d: "days" };
    const unitSingularEn: Record<string, string> = { s: "second", m: "minute", h: "hour", d: "day" };

    const desc = isEn
      ? (val === 1 ? `Every ${unitSingularEn[unit]}` : `Every ${val} ${unitMapEn[unit]}`)
      : (val === 1 ? `Ogni ${unitSingularIt[unit]}` : `Ogni ${val} ${unitMapIt[unit]}`);

    const mult = UNIT_MS[unit] || 60000;
    const ms = val * mult;
    if (ms < 60000) {
      const err = isEn
        ? "Minimum allowed interval: 60s (to prevent spend loops)"
        : "Intervallo minimo consentito: 60s (per evitare loop di spesa)";
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

  // 2. Cron 5 fields or alias
  const resolved = resolveCronAlias(trimmed);
  const parts = resolved.split(/\s+/);
  if (parts.length !== 5) {
    const err = isEn
      ? "Invalid format. Use an interval (e.g. 5m, 1h), 5-field cron (e.g. */5 * * * *), or alias (@daily, @hourly)"
      : "Formato non valido. Usa un intervallo (es. 5m, 1h), cron a 5 campi (es. */5 * * * *), o alias (@daily, @hourly)";
    return { ok: false, valid: false, error: err, description: err, humanDescription: err, nextRuns: [] };
  }

  try {
    const it = parseExpression(resolved, { currentDate: fromDate });
    const nextRuns = [
      (it.next().toDate() as Date).toISOString(),
      (it.next().toDate() as Date).toISOString(),
      (it.next().toDate() as Date).toISOString(),
    ];

    let desc = isEn ? "Active cron schedule" : "Pianificazione cron attiva";
    const [min, hour, dom, mon, dow] = parts;

    if (isEn) {
      if (min === "*/5" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Every 5 minutes";
      else if (min === "*/10" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Every 10 minutes";
      else if (min === "*/15" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Every 15 minutes";
      else if (min === "*/30" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Every 30 minutes";
      else if (min === "0" && hour === "*" && dom === "*" && mon === "*" && dow === "*") desc = "Every hour at minute :00";
      else if (min === "0" && hour === "0" && dom === "*" && mon === "*" && dow === "*") desc = "Every day at midnight (00:00)";
      else if (dom === "*" && mon === "*" && dow === "*") desc = `Every day at ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
      else if (dom === "*" && mon === "*" && (dow === "1-5" || dow === "1,2,3,4,5")) desc = `Monday through Friday at ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
      else if (dom === "*" && mon === "*" && (dow === "0" || dow === "7")) desc = `Every Sunday at ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
      else if (dom === "*" && mon === "*" && dow === "1") desc = `Every Monday at ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
      else desc = `Cron: ${trimmed}`;
    } else {
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
    }

    return { ok: true, valid: true, kind: "cron", description: desc, humanDescription: desc, nextRuns };
  } catch (err: any) {
    const errorMsg = isEn ? `Invalid cron syntax: ${err.message}` : `Sintassi cron non valida: ${err.message}`;
    return { ok: false, valid: false, error: errorMsg, description: errorMsg, humanDescription: errorMsg, nextRuns: [] };
  }
}

export interface HeatmapCell {
  day: number;
  hour: number;
  count: number;
}

export interface NextRunItem {
  iso: string;
  local: string;
  relativeMs: number;
}

export interface SchedulePreview {
  ok: boolean;
  valid: boolean;
  error?: string;
  expression: string;
  resolvedExpression: string;
  kind?: "interval" | "cron";
  humanDescription: string;
  nextRuns: NextRunItem[];
  heatmap: HeatmapCell[];
  totalIn7Days: number;
}

function formatLocalTimestamp(d: Date, timezone?: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      ...(timezone ? { timeZone: timezone } : {}),
    };
    return new Intl.DateTimeFormat("en-US", options).format(d);
  } catch {
    return d.toISOString();
  }
}

function getHourForDate(d: Date, timezone?: string): number {
  if (!timezone) return d.getHours();
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    }).formatToParts(d);
    const h = parts.find((p) => p.type === "hour")?.value;
    const num = h ? parseInt(h, 10) : d.getHours();
    return num === 24 ? 0 : num;
  } catch {
    return d.getHours();
  }
}

export function previewSchedule(
  input: string,
  opts: { n?: number; timezone?: string; from?: Date; lang?: string } = {}
): SchedulePreview {
  const from = opts.from ?? new Date();
  const lang = opts.lang ?? "en";
  const rawN = opts.n ?? 10;
  const n = Math.min(Math.max(1, Number.isFinite(rawN) ? rawN : 10), 50);
  const trimmed = (input || "").trim();

  const emptyBase: SchedulePreview = {
    ok: false,
    valid: false,
    expression: trimmed,
    resolvedExpression: trimmed,
    humanDescription: "",
    nextRuns: [],
    heatmap: [],
    totalIn7Days: 0,
  };

  if (!trimmed) {
    const err = lang === "it" ? "Specifica un intervallo o cron" : "Specify an interval or cron";
    return { ...emptyBase, error: err, humanDescription: err };
  }

  if (opts.timezone && !isValidTimezone(opts.timezone)) {
    const err = `Invalid IANA timezone: "${opts.timezone}"`;
    return { ...emptyBase, error: err, humanDescription: err };
  }

  const explained = explainSchedule(trimmed, from, lang);
  if (!explained.ok || !explained.valid) {
    return {
      ...emptyBase,
      error: explained.error,
      humanDescription: explained.humanDescription || explained.error || "Invalid schedule",
    };
  }

  const kind = explained.kind ?? "interval";
  const resolved = resolveCronAlias(trimmed);
  const nextRuns: NextRunItem[] = [];
  const heatmapCounts = new Map<string, number>();
  const sevenDaysMs = 7 * 24 * 3600 * 1000;
  const cutoff = from.getTime() + sevenDaysMs;
  let totalIn7Days = 0;

  if (kind === "interval") {
    try {
      const ms = parseEveryToMs(trimmed);
      let t = from.getTime() + ms;
      let count = 0;
      while (count < n) {
        const d = new Date(t);
        nextRuns.push({
          iso: d.toISOString(),
          local: formatLocalTimestamp(d, opts.timezone),
          relativeMs: d.getTime() - from.getTime(),
        });
        count++;
        t += ms;
      }

      // Heatmap calculation for interval
      let heatT = from.getTime() + ms;
      let safety = 0;
      while (heatT <= cutoff && safety < 10000) {
        totalIn7Days++;
        const d = new Date(heatT);
        const dayIdx = Math.min(6, Math.max(0, Math.floor((heatT - from.getTime()) / (24 * 3600 * 1000))));
        const hour = getHourForDate(d, opts.timezone);
        const key = `${dayIdx}:${hour}`;
        heatmapCounts.set(key, (heatmapCounts.get(key) || 0) + 1);
        heatT += ms;
        safety++;
      }
    } catch (e: any) {
      return { ...emptyBase, error: e.message, humanDescription: e.message };
    }
  } else {
    try {
      const it = parseExpression(resolved, {
        currentDate: from,
        tz: opts.timezone,
      });

      // Collect first N runs
      for (let i = 0; i < n; i++) {
        if (!it.hasNext()) break;
        const d = it.next().toDate() as Date;
        nextRuns.push({
          iso: d.toISOString(),
          local: formatLocalTimestamp(d, opts.timezone),
          relativeMs: d.getTime() - from.getTime(),
        });
      }

      // Re-run for full 7-day heatmap
      const heatIt = parseExpression(resolved, {
        currentDate: from,
        tz: opts.timezone,
      });

      let safety = 0;
      while (heatIt.hasNext() && safety < 10000) {
        const d = heatIt.next().toDate() as Date;
        const t = d.getTime();
        if (t > cutoff) break;
        totalIn7Days++;
        const dayIdx = Math.min(6, Math.max(0, Math.floor((t - from.getTime()) / (24 * 3600 * 1000))));
        const hour = getHourForDate(d, opts.timezone);
        const key = `${dayIdx}:${hour}`;
        heatmapCounts.set(key, (heatmapCounts.get(key) || 0) + 1);
        safety++;
      }
    } catch (e: any) {
      return { ...emptyBase, error: e.message, humanDescription: e.message };
    }
  }

  // Build heatmap cells for 7 days x 24 hours
  const heatmap: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const count = heatmapCounts.get(`${day}:${hour}`) || 0;
      heatmap.push({ day, hour, count });
    }
  }

  return {
    ok: true,
    valid: true,
    expression: trimmed,
    resolvedExpression: resolved,
    kind,
    humanDescription: explained.humanDescription,
    nextRuns,
    heatmap,
    totalIn7Days,
  };
}


