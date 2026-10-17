import * as fs from "node:fs/promises";
import * as path from "node:path";
import { loadJobs } from "./store.ts";
import { redactSensitiveData } from "./redact.ts";

export interface RunEntry {
  id: string;
  jobId: string;
  jobTitle: string;
  sessionID: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  status: "success" | "failed" | "skipped";
  trigger?: "schedule" | "manual" | "unknown";
  exitCode: number;
  model?: string | null;
  tokens?: {
    input: number;
    output: number;
    reasoning?: number;
    cacheRead?: number;
  };
  outputPreview?: string | null;
  error?: string | null;
  runNumber?: number;
  source: "history" | "sqlite" | "daemon-log" | "recorded";
}

export interface JobRunSummary {
  jobId: string;
  jobTitle: string;
  sessionID: string;
  enabled: boolean;
  maxRuns: number;
  runCount: number;
  consecutiveFailures: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  total: number;
  totalRecorded: number;
  succeeded: number;
  failed: number;
  skipped: number;
  lastStatus: "success" | "failed" | "skipped" | "never";
}

export interface UnifiedRunsResponse {
  ok: true;
  runs: RunEntry[];
  stats: {
    total: number;
    succeeded: number;
    failed: number;
    skipped: number;
    successRate: number;
    avgDurationMs: number;
    lastRunAt: string | null;
  };
  byJob: JobRunSummary[];
}

export function historyFilePath(directory: string): string {
  return path.join(directory, ".opencode", "cron", "history.json");
}

export async function loadRunHistory(directory: string): Promise<RunEntry[]> {
  try {
    const raw = await fs.readFile(historyFilePath(directory), "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function recordRunEntry(
  directory: string,
  entry: Omit<RunEntry, "id" | "source"> & { id?: string; source?: RunEntry["source"] }
): Promise<RunEntry> {
  const existing = await loadRunHistory(directory);
  const full: RunEntry = {
    ...entry,
    id: entry.id ?? `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    source: "history",
    error: entry.error ? redactSensitiveData(entry.error) : null,
    outputPreview: entry.outputPreview ? redactSensitiveData(entry.outputPreview) : null,
  };
  const updated = [full, ...existing].slice(0, 300);
  const filePath = historyFilePath(directory);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(updated, null, 2), "utf-8");
  await fs.rename(tmpPath, filePath);
  return full;
}

export interface PruneHistoryOptions {
  maxAgeDays?: number;
  maxRunsPerJob?: number;
  maxTotalRuns?: number;
}

export async function pruneRunHistory(
  directory: string,
  options: PruneHistoryOptions = {}
): Promise<{ beforeCount: number; afterCount: number; prunedCount: number }> {
  const existing = await loadRunHistory(directory);
  const beforeCount = existing.length;
  if (beforeCount === 0) {
    return { beforeCount: 0, afterCount: 0, prunedCount: 0 };
  }

  const maxAgeDays = options.maxAgeDays ?? 30;
  const maxRunsPerJob = options.maxRunsPerJob ?? 200;
  const maxTotalRuns = options.maxTotalRuns ?? 300;

  const cutoffMs = Date.now() - maxAgeDays * 86_400_000;
  const runsByJob = new Map<string, number>();

  let filtered = existing.filter((run) => {
    const started = new Date(run.startedAt).getTime();
    if (!isNaN(started) && started < cutoffMs) {
      return false;
    }

    const currentCount = runsByJob.get(run.jobId) ?? 0;
    if (currentCount >= maxRunsPerJob) {
      return false;
    }

    runsByJob.set(run.jobId, currentCount + 1);
    return true;
  });

  if (filtered.length > maxTotalRuns) {
    filtered = filtered.slice(0, maxTotalRuns);
  }

  const afterCount = filtered.length;
  const prunedCount = beforeCount - afterCount;

  if (prunedCount > 0) {
    const filePath = historyFilePath(directory);
    const tmpPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(filtered, null, 2), "utf-8");
    await fs.rename(tmpPath, filePath);
  }

  return { beforeCount, afterCount, prunedCount };
}

function slugifyTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "cron-job";
}

function extractTitleFromPrompt(text: string): string | null {
  const m = text.match(/#\s+([^\n]+?)\s+—\s+cron memory/);
  if (m && m[1]) return m[1].trim();
  const f = text.match(/\[FOLLOWUP di questo tick\]\s*\n([^\n]+)/);
  if (f && f[1]) return f[1].trim().slice(0, 50);
  return null;
}

function extractAssistantText(data: any): string {
  if (!Array.isArray(data?.content)) return "";
  const parts: string[] = [];
  for (const c of data.content) {
    if (c?.type === "text" && typeof c.text === "string" && c.text.trim()) {
      parts.push(c.text.trim());
    }
  }
  return parts.join("\n\n");
}

function extractToolErrors(data: any): string | null {
  if (!Array.isArray(data?.content)) return null;
  for (const c of data.content) {
    if (c?.type === "tool" && c?.state?.status === "error") {
      const errMsg = c.state?.error?.message ?? c.state?.error ?? "Tool execution failed";
      return typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);
    }
  }
  return null;
}

export async function getUnifiedRuns(opts: {
  directory: string;
  dbPath: string;
  limit?: number;
}): Promise<UnifiedRunsResponse> {
  const limit = Math.min(Math.max(opts.limit ?? 150, 10), 500);
  const [jobs, storedHistory] = await Promise.all([
    loadJobs(opts.directory),
    loadRunHistory(opts.directory),
  ]);

  const jobsByTitle = new Map<string, (typeof jobs)[number]>();
  const jobsById = new Map<string, (typeof jobs)[number]>();
  for (const j of jobs) {
    jobsById.set(j.id, j);
    jobsByTitle.set(j.title.toLowerCase().trim(), j);
  }

  const sqliteRuns: RunEntry[] = [];

  // 1. Reconstruct historical cron turns from OpenCode SQLite session_message
  try {
    await fs.access(opts.dbPath);
    const { Database } = await import("bun:sqlite");
    const db = new Database(opts.dbPath, { readonly: true });
    try {
      // Find all sessions that have [CRON SYSTEM prompts
      const sessionRows = db
        .query(
          `SELECT DISTINCT session_id FROM session_message
           WHERE type = 'user' AND data LIKE '%[CRON SYSTEM%'`
        )
        .all() as Array<{ session_id: string }>;

      for (const { session_id: sid } of sessionRows) {
        const rows = db
          .query(
            `SELECT id, seq, type, time_created, data FROM session_message
             WHERE session_id = ? ORDER BY seq ASC`
          )
          .all(sid) as Array<{
          id: string;
          seq: number;
          type: string;
          time_created: number;
          data: string;
        }>;

        for (let i = 0; i < rows.length; i++) {
          const r = rows[i];
          if (r.type !== "user") continue;
          let uData: any;
          try {
            uData = JSON.parse(r.data);
          } catch {
            continue;
          }
          const rawText = typeof uData?.text === "string" ? uData.text : "";
          if (!rawText.includes("[CRON SYSTEM")) continue;

          const parsedTitle = extractTitleFromPrompt(rawText) ?? "Cron Task";
          const matchedJob =
            jobsByTitle.get(parsedTitle.toLowerCase()) ??
            jobs.find((j) => j.sessionID === sid && parsedTitle === "Cron Task");
          const jobId = matchedJob?.id ?? slugifyTitle(parsedTitle);
          const jobTitle = matchedJob?.title ?? parsedTitle;

          // Collect all consecutive non-user rows belonging to this turn
          const assistants: Array<{ id: string; seq: number; time_created: number; data: any }> = [];
          let idleOutcome: string | null = null;
          let idleTime: number | null = null;

          while (i + 1 < rows.length && rows[i + 1].type !== "user") {
            i++;
            const nextRow = rows[i];
            if (nextRow.type === "assistant") {
              try {
                assistants.push({
                  id: nextRow.id,
                  seq: nextRow.seq,
                  time_created: nextRow.time_created,
                  data: JSON.parse(nextRow.data),
                });
              } catch { /* skip malformed */ }
            } else if (nextRow.type === "idle") {
              try {
                const idata = JSON.parse(nextRow.data);
                idleOutcome = idata?.outcome ?? null;
                idleTime = idata?.time?.created ?? nextRow.time_created;
              } catch { /* ignore */ }
            }
          }

          const startMs = uData?.time?.created ?? r.time_created;
          if (assistants.length === 0) {
            // User prompt was admitted, check if it failed at session level
            if (idleOutcome === "failed" || idleOutcome === "interrupted") {
              const endMs = idleTime ?? startMs + 500;
              sqliteRuns.push({
                id: r.id,
                jobId,
                jobTitle,
                sessionID: sid,
                startedAt: new Date(startMs).toISOString(),
                finishedAt: new Date(endMs).toISOString(),
                durationMs: Math.max(0, endMs - startMs),
                status: "failed",
                trigger: "schedule",
                exitCode: 1,
                error: idleOutcome === "interrupted" ? "Esecuzione interrotta (Step interrupted)" : "SessionRunner fallito prima della risposta del modello",
                source: "sqlite",
              });
            }
            continue;
          }

          const lastA = assistants[assistants.length - 1];
          const endMs =
            lastA.data?.time?.completed ??
            idleTime ??
            lastA.data?.time?.created ??
            lastA.time_created ??
            startMs;
          const durationMs = Math.max(0, endMs - startMs);

          const fullTexts = assistants
            .map((a) => extractAssistantText(a.data))
            .filter(Boolean);
          const combinedText = fullTexts.join("\n\n");

          const lastErrObj = lastA.data?.error;
          const toolErr = assistants.map((a) => extractToolErrors(a.data)).find(Boolean);
          const modelInfo = lastA.data?.model
            ? `${lastA.data.model.providerID ?? ""}/${lastA.data.model.id ?? ""}`.replace(/^\//, "")
            : matchedJob?.model;

          const tok = lastA.data?.tokens;
          const tokens = tok
            ? {
                input: Number(tok.input ?? 0),
                output: Number(tok.output ?? 0),
                reasoning: Number(tok.reasoning ?? 0),
                cacheRead: Number(tok.cache?.read ?? 0),
              }
            : undefined;

          // Determine if this turn succeeded or failed
          let status: "success" | "failed" = "success";
          let errorMsg: string | undefined;

          if (lastErrObj) {
            status = "failed";
            errorMsg =
              lastErrObj?.data?.message ??
              lastErrObj?.message ??
              lastErrObj?.name ??
              JSON.stringify(lastErrObj);
          } else if (idleOutcome === "failed" || idleOutcome === "interrupted") {
            status = "failed";
            errorMsg =
              idleOutcome === "interrupted"
                ? "Esecuzione interrotta"
                : toolErr ?? "Il turno è terminato con stato 'failed'";
          } else if (!combinedText && toolErr) {
            status = "failed";
            errorMsg = toolErr;
          } else if (
            combinedText &&
            /non posso completare il tick|impedisce l'avanzamento|non può avanzare in questo tick/i.test(combinedText)
          ) {
            status = "failed";
            errorMsg = toolErr ?? "Blocco operativo segnalato dall'agente (es. Web search cancelled)";
          }

          sqliteRuns.push({
            id: r.id,
            jobId,
            jobTitle,
            sessionID: sid,
            startedAt: new Date(startMs).toISOString(),
            finishedAt: new Date(endMs).toISOString(),
            durationMs,
            status,
            trigger: "schedule",
            exitCode: status === "success" ? 0 : 1,
            model: modelInfo,
            tokens,
            outputPreview: combinedText ? combinedText.slice(0, 1200) : undefined,
            error: errorMsg,
            source: "sqlite",
          });
        }
      }
    } finally {
      db.close();
    }
  } catch {
    // SQLite optional fallback
  }

  // 2. Parse daemon log (~/Library/Logs/opencode-cron.log) for CLI-level errors that failed before writing to SQLite
  const logRuns: RunEntry[] = [];
  try {
    const home = process.env.HOME ?? "";
    const logPath = path.join(home, "Library", "Logs", "opencode-cron.log");
    const rawLog = await fs.readFile(logPath, "utf-8");
    const lines = rawLog.split("\n");
    let currentTickIso: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const tickMatch = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s+tick:/);
      if (tickMatch) {
        currentTickIso = tickMatch[1];
        continue;
      }
      if (!currentTickIso) continue;

      if (line.startsWith("opencode run --session ")) {
        const sesMatch = line.match(/--session\s+(ses_[A-Za-z0-9]+)/);
        const sid = sesMatch?.[1] ?? "unknown";
        const nextLine = (lines[i + 1] ?? "").trim();
        if (nextLine.startsWith("Error:")) {
          const matchedJob = jobs.find((j) => j.sessionID === sid);
          const autoPauseLine = (lines[i + 2] ?? "").trim();
          const pauseJobMatch = autoPauseLine.match(/^auto-paused\s+([a-z0-9-]+)\s+after\s+(\d+)\s+failures/);
          const jobId = pauseJobMatch?.[1] ?? matchedJob?.id ?? "cron-job";
          const jobById = jobsById.get(jobId) ?? matchedJob;
          logRuns.push({
            id: `log_${currentTickIso}_${jobId}`,
            jobId,
            jobTitle: jobById?.title ?? jobId,
            sessionID: sid,
            startedAt: currentTickIso,
            finishedAt: currentTickIso,
            durationMs: 450,
            status: "failed",
            trigger: "schedule",
            exitCode: 1,
            error: pauseJobMatch
              ? `${nextLine} (Job messo in auto-pausa dopo ${pauseJobMatch[2]} fallimenti consecutivi)`
              : nextLine,
            source: "daemon-log",
          });
        }
      }
    }
  } catch {
    // Log file optional
  }

  // 3. Merge and deduplicate (prefer storedHistory enriched with sqliteRuns details, then sqliteRuns, then logRuns)
  const merged: RunEntry[] = storedHistory.map((h) => ({ ...h }));

  for (const sr of sqliteRuns) {
    const srTime = new Date(sr.startedAt).getTime();
    const existing = merged.find(
      (m) =>
        m.sessionID === sr.sessionID &&
        Math.abs(new Date(m.startedAt).getTime() - srTime) < 20_000
    );
    if (existing) {
      if (!existing.outputPreview && sr.outputPreview) existing.outputPreview = sr.outputPreview;
      if (!existing.tokens && sr.tokens) existing.tokens = sr.tokens;
      if (!existing.model && sr.model) existing.model = sr.model;
      if (sr.status === "failed" && sr.error) {
        existing.status = "failed";
        if (!existing.error) existing.error = sr.error;
      }
    } else {
      merged.push(sr);
    }
  }

  for (const lr of logRuns) {
    const lrTime = new Date(lr.startedAt).getTime();
    const isDup = merged.some(
      (m) =>
        m.sessionID === lr.sessionID &&
        Math.abs(new Date(m.startedAt).getTime() - lrTime) < 15_000
    );
    if (!isDup) merged.push(lr);
  }

  // Sort chronological ASC first to compute sequential runNumber per job
  merged.sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
  const jobCounters = new Map<string, number>();
  for (const r of merged) {
    const c = (jobCounters.get(r.jobId) ?? 0) + 1;
    jobCounters.set(r.jobId, c);
    if (!r.runNumber) r.runNumber = c;
  }

  // Sort newest first
  merged.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  // Compute global stats across all merged runs
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;
  let durationSum = 0;
  let durationCount = 0;

  for (const r of merged) {
    if (r.status === "success") succeeded++;
    else if (r.status === "failed") failed++;
    else skipped++;

    if (r.durationMs > 0 && r.durationMs < 600_000) {
      durationSum += r.durationMs;
      durationCount++;
    }
  }

  const total = merged.length;
  const denom = succeeded + failed;
  const successRate = denom > 0 ? Math.round((succeeded / denom) * 1000) / 10 : 100;
  const avgDurationMs = durationCount > 0 ? Math.round(durationSum / durationCount) : 0;

  // Compute per-job summary
  const byJobMap = new Map<string, JobRunSummary>();
  for (const j of jobs) {
    byJobMap.set(j.id, {
      jobId: j.id,
      jobTitle: j.title,
      sessionID: j.sessionID,
      enabled: j.enabled,
      maxRuns: j.maxRuns,
      runCount: j.runCount,
      consecutiveFailures: j.consecutiveFailures,
      lastRunAt: j.lastRunAt,
      nextRunAt: j.nextRunAt,
      total: 0,
      totalRecorded: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
      lastStatus: "never",
    });
  }

  for (const r of merged) {
    let summary = byJobMap.get(r.jobId);
    if (!summary) {
      summary = {
        jobId: r.jobId,
        jobTitle: r.jobTitle,
        sessionID: r.sessionID,
        enabled: false,
        maxRuns: 0,
        runCount: 0,
        consecutiveFailures: 0,
        lastRunAt: r.startedAt,
        nextRunAt: null,
        total: 0,
        totalRecorded: 0,
        succeeded: 0,
        failed: 0,
        skipped: 0,
        lastStatus: r.status,
      };
      byJobMap.set(r.jobId, summary);
    }
    summary.total++;
    summary.totalRecorded++;
    if (r.status === "success") summary.succeeded++;
    else if (r.status === "failed") summary.failed++;
    else summary.skipped++;
    if (summary.lastStatus === "never") {
      summary.lastStatus = r.status;
    }
    if (!summary.lastRunAt || new Date(r.startedAt).getTime() > new Date(summary.lastRunAt).getTime()) {
      summary.lastRunAt = r.startedAt;
    }
  }

  return {
    ok: true,
    runs: merged.slice(0, limit),
    stats: {
      total,
      succeeded,
      failed,
      skipped,
      successRate,
      avgDurationMs,
      lastRunAt: merged[0]?.startedAt ?? null,
    },
    byJob: Array.from(byJobMap.values()),
  };
}
