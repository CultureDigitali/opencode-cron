import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import * as cp from "node:child_process";
import * as util from "node:util";
import { fileURLToPath } from "node:url";
import { getHtml } from "./html.ts";
import { getRunsHtml } from "./runs-html.ts";
import { getInstructionsHtml } from "./instructions-html.ts";
import { loadJobs, saveJobs, upsertJob, removeJob, ensureCronDir, computeNextRun, assertJobId } from "../store.ts";
import { normalizeSchedule, explainSchedule } from "../schedule.ts";
import { readMemory, writeMemory, initialMemoryMd } from "../memory.ts";
import { runJobHeadless, checkDue } from "../runner.ts";
import { getUnifiedRuns } from "../history.ts";
import { CronJobSchema } from "../types.ts";

let DatabaseClass: any = null;
async function getSqliteDatabase() {
  if (DatabaseClass) return DatabaseClass;
  try {
    if (typeof (globalThis as any).Bun !== "undefined") {
      const mod = await import("bun:sqlite");
      DatabaseClass = mod.Database;
      return DatabaseClass;
    }
  } catch { /* not bun */ }

  try {
    const mod = await import("node:sqlite" as string);
    DatabaseClass = (mod as any).DatabaseSync;
    return DatabaseClass;
  } catch { /* node:sqlite not available */ }

  return null;
}

export interface ServerOpts {
  port?: number;
  dir?: string;
  dbPath?: string;
}

export function assertSessionId(id: string): void {
  if (!id || typeof id !== "string" || !/^[a-zA-Z0-9_.-]{1,128}$/.test(id)) {
    throw new Error(`Invalid session ID "${id}"`);
  }
}

export function parseScheduleStr(schedStr?: string): { every?: string; cron?: string } {
  if (!schedStr || typeof schedStr !== "string") return {};
  const trimmed = schedStr.trim();
  if (/^\d+\s*[smhd]$/i.test(trimmed)) {
    return { every: trimmed.replace(/\s+/g, "") };
  }
  return { cron: trimmed };
}

export function startGuiServer(opts: ServerOpts = {}) {
  const port = opts.port ?? parseInt(process.env.OPENCODE_CRON_PORT ?? "4488", 10);
  const directory = opts.dir ?? process.cwd();
  const dbPath = opts.dbPath ?? path.join(process.env.HOME ?? "", ".local", "share", "opencode", "opencode.db");

  const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

      // Restrict CORS to local origins
      const origin = req.headers.get("origin") || "";
      const isLoopback = origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
      const allowOrigin = isLoopback ? origin : `http://localhost:${port}`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      };

      if (method === "OPTIONS") {
        return new Response(null, { headers });
      }

      // 1. Root: Web Dashboard HTML
      if (pathname === "/" && (method === "GET" || method === "HEAD")) {
        return new Response(method === "HEAD" ? null : getHtml(`OpenCode Cron — ${path.basename(directory)}`), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      // 1b. Dedicated Runs History Page HTML
      if (pathname === "/runs" && (method === "GET" || method === "HEAD")) {
        return new Response(method === "HEAD" ? null : getRunsHtml(`Storico Runs & Esiti — ${path.basename(directory)}`), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      // 1c. Dedicated Instructions Page HTML
      if ((pathname === "/instructions" || pathname === "/guide") && (method === "GET" || method === "HEAD")) {
        return new Response(method === "HEAD" ? null : getInstructionsHtml(`Istruzioni & Guida Completa — ${path.basename(directory)}`), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      // 2. GET /api/status
      if (pathname === "/api/status" && method === "GET") {
        return new Response(JSON.stringify({
          ok: true,
          directory,
          dbPath,
          timestamp: new Date().toISOString(),
        }), { headers });
      }

      // 3. GET /api/jobs
      if (pathname === "/api/jobs" && method === "GET") {
        const jobs = await loadJobs(directory);
        return new Response(JSON.stringify(jobs), { headers });
      }

      // 4. POST /api/jobs (Create new job)
      if (pathname === "/api/jobs" && method === "POST") {
        try {
          const body: any = await req.json();
          const norm = normalizeSchedule(parseScheduleStr(body.scheduleStr));

          const rand = Math.random().toString(36).slice(2, 8);
          const slug = (body.title || "job").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
          const id = `${slug}-${Date.now().toString(36)}-${rand}`;
          const now = new Date().toISOString();

          const job = CronJobSchema.parse({
            id,
            sessionID: body.sessionID,
            directory,
            title: body.title,
            systemPrompt: body.systemPrompt,
            followupPrompt: body.followupPrompt,
            schedule: { kind: norm.kind, everyMs: norm.everyMs, cron: norm.cron },
            agent: body.agent || "build",
            model: body.model || undefined,
            enabled: true,
            catchUp: false,
            skipIfRunning: true,
            maxRuns: parseInt(body.maxRuns) || 0,
            maxConsecutiveFailures: 5,
            runCount: 0,
            consecutiveFailures: 0,
            createdAt: now,
            lastRunAt: null,
            nextRunAt: null,
          });
          job.nextRunAt = computeNextRun(job, new Date());

          await ensureCronDir(directory);
          await upsertJob(directory, job);
          await writeMemory(directory, id, initialMemoryMd({
            title: job.title,
            systemPrompt: job.systemPrompt,
            followupPrompt: job.followupPrompt,
          }), {
            seenHashes: [],
            counts: { news: 0, tweets: 0 },
            lastRunAt: null,
            consecutiveFailures: 0,
          });

          return new Response(JSON.stringify({ ok: true, job }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers });
        }
      }

      // 5. PUT /api/jobs/:id (Update job)
      if (pathname.startsWith("/api/jobs/") && method === "PUT") {
        const id = decodeURIComponent(pathname.replace("/api/jobs/", ""));
        try {
          assertJobId(id);
          const body: any = await req.json();
          const jobs = await loadJobs(directory);
          const j = jobs.find((x) => x.id === id);
          if (!j) return new Response(JSON.stringify({ ok: false, error: "Job not found" }), { status: 404, headers });

          if (body.title) j.title = body.title;
          if (body.systemPrompt) j.systemPrompt = body.systemPrompt;
          if (body.followupPrompt) j.followupPrompt = body.followupPrompt;
          if (body.sessionID) j.sessionID = body.sessionID;
          if (body.model !== undefined) j.model = body.model || undefined;
          if (typeof body.maxRuns === "number") j.maxRuns = body.maxRuns;

          if (body.scheduleStr) {
            const norm = normalizeSchedule(parseScheduleStr(body.scheduleStr));
            j.schedule = { kind: norm.kind, everyMs: norm.everyMs, cron: norm.cron };
            j.nextRunAt = computeNextRun(j, new Date());
          } else if (j.enabled && (!j.nextRunAt || new Date(j.nextRunAt).getTime() <= Date.now())) {
            j.nextRunAt = computeNextRun(j, new Date());
          }

          CronJobSchema.parse(j);
          await saveJobs(directory, jobs);
          return new Response(JSON.stringify({ ok: true, job: j }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers });
        }
      }

      // 6. DELETE /api/jobs/:id
      if (pathname.startsWith("/api/jobs/") && method === "DELETE") {
        const id = decodeURIComponent(pathname.replace("/api/jobs/", ""));
        try {
          assertJobId(id);
          await removeJob(directory, id);
          return new Response(JSON.stringify({ ok: true }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers });
        }
      }

      // 7. POST /api/jobs/:id/run (Run tick now)
      if (pathname.startsWith("/api/jobs/") && pathname.endsWith("/run") && method === "POST") {
        const id = decodeURIComponent(pathname.slice("/api/jobs/".length, -"/run".length));
        try {
          assertJobId(id);
          const jobs = await loadJobs(directory);
          const j = jobs.find((x) => x.id === id);
          if (!j) return new Response(JSON.stringify({ ok: false, error: "Job non trovato" }), { status: 404, headers });
          if (!j.enabled) return new Response(JSON.stringify({ ok: false, error: "Il job è in pausa. Riattivalo prima di eseguire un tick." }), { status: 400, headers });
          if (j.maxRuns > 0 && j.runCount >= j.maxRuns) {
            return new Response(JSON.stringify({ ok: false, error: `Limite Max Runs raggiunto (${j.runCount}/${j.maxRuns}). Aumenta Max Runs o imposta 0.` }), { status: 400, headers });
          }
          const code = await runJobHeadless(directory, id);
          return new Response(JSON.stringify({ ok: code === 0, code }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
        }
      }

      // 8. POST /api/jobs/:id/toggle (Pause / Resume)
      if (pathname.startsWith("/api/jobs/") && pathname.endsWith("/toggle") && method === "POST") {
        const id = decodeURIComponent(pathname.slice("/api/jobs/".length, -"/toggle".length));
        try {
          assertJobId(id);
          const body: any = await req.json();
          const jobs = await loadJobs(directory);
          const j = jobs.find((x) => x.id === id);
          if (!j) return new Response(JSON.stringify({ ok: false, error: "Not found" }), { status: 404, headers });

          j.enabled = Boolean(body.enabled);
          if (j.enabled) {
            j.consecutiveFailures = 0;
            j.nextRunAt = computeNextRun(j, new Date());
          }
          await saveJobs(directory, jobs);
          return new Response(JSON.stringify({ ok: true, job: j }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers });
        }
      }

      // 9. POST /api/check (Run all due jobs)
      if (pathname === "/api/check" && method === "POST") {
        try {
          await checkDue(directory);
          return new Response(JSON.stringify({ ok: true }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
        }
      }

      // 10. GET /api/sessions (List sessions from opencode.db with metadata)
      if (pathname === "/api/sessions" && method === "GET") {
        let db: any = null;
        try {
          const DbClass = await getSqliteDatabase();
          if (!DbClass) return new Response(JSON.stringify([]), { headers });
          const dbOpts = typeof (globalThis as any).Bun !== "undefined" ? { readonly: true } : { readOnly: true };
          db = new DbClass(dbPath, dbOpts);

          // Check available columns defensively to support test mocks & various schema versions
          const tableInfo = db.prepare(`PRAGMA table_info(session)`).all();
          const hasCol = (col: string) => Array.isArray(tableInfo) && tableInfo.some((c: any) => c.name === col);
          const hasParent = hasCol("parent_id");
          const hasDir = hasCol("directory");
          const hasAgent = hasCol("agent");

          const selectCols = [
            "id",
            "title",
            "time_created",
            "time_updated",
            hasParent ? "parent_id" : "NULL AS parent_id",
            hasDir ? "directory" : "NULL AS directory",
            hasAgent ? "agent" : "NULL AS agent",
          ].join(", ");

          const rows = db.prepare(`SELECT ${selectCols} FROM session ORDER BY time_updated DESC LIMIT 200`).all();
          const jobs = await loadJobs(directory);

          const sessions = rows.map((r: any) => {
            const dir = r.directory || "";
            const isCurrentWorkspace = Boolean(dir && dir === directory);
            const parentId = r.parent_id && String(r.parent_id).trim() !== "" ? String(r.parent_id) : null;
            const isRoot = !parentId;
            const matchedJobs = jobs
              .filter((j) => j.sessionID === r.id)
              .map((j) => ({ id: j.id, title: j.title, enabled: j.enabled, schedule: j.schedule }));
            const hasCron = matchedJobs.length > 0;

            let score = 0;
            if (hasCron && isCurrentWorkspace) score = 6;
            else if (isRoot && isCurrentWorkspace) score = 5;
            else if (!isRoot && isCurrentWorkspace) score = 4;
            else if (hasCron && !isCurrentWorkspace) score = 3;
            else if (isRoot && !isCurrentWorkspace) score = 2;
            else score = 1;

            return {
              id: r.id,
              title: r.title || r.id,
              directory: dir,
              parentId,
              agent: r.agent || null,
              time_created: r.time_created || 0,
              time_updated: r.time_updated || 0,
              isCurrentWorkspace,
              isRoot,
              isSubagent: !isRoot,
              hasCron,
              cronJobs: matchedJobs,
              score,
            };
          });

          // Sort by score DESC, then time_updated DESC
          sessions.sort((a: any, b: any) => (b.score - a.score) || ((b.time_updated || 0) - (a.time_updated || 0)));

          return new Response(JSON.stringify(sessions), { headers });
        } catch {
          // Fall back gracefully if database doesn't exist yet
          return new Response(JSON.stringify([]), { headers });
        } finally {
          if (db) {
            try { db.close(); } catch { /* ignore */ }
          }
        }
      }

      // 11. GET /api/sessions/:id/messages (Live chat message history)
      if (pathname.startsWith("/api/sessions/") && pathname.endsWith("/messages") && method === "GET") {
        const sessionId = decodeURIComponent(pathname.slice("/api/sessions/".length, -"/messages".length));
        let db: any = null;
        try {
          assertSessionId(sessionId);
          const DbClass = await getSqliteDatabase();
          if (!DbClass) return new Response(JSON.stringify([]), { headers });
          const dbOpts = typeof (globalThis as any).Bun !== "undefined" ? { readonly: true } : { readOnly: true };
          db = new DbClass(dbPath, dbOpts);
          const v2Rows = db.prepare(
            `SELECT id, type, seq, time_created, data FROM session_message WHERE session_id = ? ORDER BY seq ASC`
          ).all(sessionId) as Array<{ id: string; type: string; seq: number; time_created: number; data: string }>;

          const messages: any[] = [];

          if (v2Rows.length > 0) {
            for (const r of v2Rows) {
              let parsed: any = null;
              try { parsed = JSON.parse(r.data); } catch { /* ignore */ }
              if (!parsed) continue;

              if (r.type === "user") {
                messages.push({
                  id: r.id,
                  type: "user",
                  time: { created: r.time_created },
                  text: parsed.text || "",
                });
              } else if (r.type === "assistant") {
                messages.push({
                  id: r.id,
                  type: "assistant",
                  time: { created: parsed?.time?.created ?? r.time_created },
                  model: parsed.model,
                  tokens: parsed.tokens,
                  content: parsed.content || [],
                  data: typeof parsed.content === "string" ? parsed.content : undefined,
                });
              }
            }
          } else {
            // Fallback to v1 messages if v2 has no rows
            const v1Msgs = db.prepare(
              `SELECT id, time_created, data FROM message WHERE session_id = ? ORDER BY time_created ASC`
            ).all(sessionId) as Array<{ id: string; time_created: number; data: string }>;

            const partStmt = db.prepare(
              `SELECT data FROM part WHERE message_id = ? ORDER BY time_created ASC`
            );

            for (const m of v1Msgs) {
              let parsed: any = null;
              try { parsed = JSON.parse(m.data); } catch { /* ignore */ }
              const parts = partStmt.all(m.id) as Array<{ data: string }>;

              let text = "";
              for (const p of parts) {
                try {
                  const pd = JSON.parse(p.data);
                  if (pd.type === "text" && pd.text) text += pd.text + "\n\n";
                } catch { /* ignore */ }
              }

              messages.push({
                id: m.id,
                type: parsed?.role || "user",
                time: { created: m.time_created },
                model: parsed?.model,
                text: text.trim(),
                content: [{ type: "text", text: text.trim() }],
              });
            }
          }

          return new Response(JSON.stringify(messages), { headers });
        } catch (e: any) {
          const status = e.message?.includes("Invalid") ? 400 : 500;
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status, headers });
        } finally {
          if (db) {
            try { db.close(); } catch { /* ignore */ }
          }
        }
      }

      // 12. POST /api/sessions/:id/prompt (Manual prompt into session)
      if (pathname.startsWith("/api/sessions/") && pathname.endsWith("/prompt") && method === "POST") {
        const sessionId = decodeURIComponent(pathname.slice("/api/sessions/".length, -"/prompt".length));
        try {
          assertSessionId(sessionId);
          const body: any = await req.json();
          const prompt = body.prompt;
          if (typeof prompt !== "string" || !prompt.trim()) {
            return new Response(JSON.stringify({ ok: false, error: "Empty prompt" }), { status: 400, headers });
          }
          if (prompt.length > 32000) {
            return new Response(JSON.stringify({ ok: false, error: "Prompt too long (max 32000 chars)" }), { status: 400, headers });
          }

          const opencodeBin = process.env.OPENCODE_BIN || "opencode";

          const proc = Bun.spawn([opencodeBin, "run", "--session", sessionId, prompt], {
            cwd: directory,
            stdout: "pipe",
            stderr: "pipe",
          });

          let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
          try {
            const timeoutPromise = new Promise<never>((_, reject) => {
              timeoutHandle = setTimeout(() => {
                try { proc.kill(); } catch { /* ignore */ }
                reject(new Error("Prompt execution timed out after 60s"));
              }, 60000);
            });

            const exitCode = await Promise.race([proc.exited, timeoutPromise]);
            const stdout = await new Response(proc.stdout).text();
            const stderr = await new Response(proc.stderr).text();

            return new Response(JSON.stringify({ ok: exitCode === 0, exitCode, stdout, stderr }), { headers });
          } finally {
            if (timeoutHandle) clearTimeout(timeoutHandle);
          }
        } catch (e: any) {
          const status = e.message?.includes("timed out") ? 504 : e.message?.includes("Invalid") ? 400 : 500;
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status, headers });
        }
      }

      // 13. GET /api/memory/:id
      if (pathname.startsWith("/api/memory/") && method === "GET") {
        const id = decodeURIComponent(pathname.replace("/api/memory/", ""));
        try {
          assertJobId(id);
          const mem = await readMemory(directory, id);
          return new Response(JSON.stringify(mem), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers });
        }
      }

      // 14. PUT /api/memory/:id
      if (pathname.startsWith("/api/memory/") && method === "PUT") {
        const id = decodeURIComponent(pathname.replace("/api/memory/", ""));
        try {
          assertJobId(id);
          const body: any = await req.json();
          const prev = await readMemory(directory, id);
          await writeMemory(directory, id, String(body.md ?? ""), {
            seenHashes: prev.state.seenHashes,
            counts: prev.state.counts,
            lastRunAt: prev.state.lastRunAt,
            consecutiveFailures: prev.state.consecutiveFailures,
          });
          return new Response(JSON.stringify({ ok: true }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers });
        }
      }

      // 15. GET /api/logs
      if (pathname === "/api/logs" && method === "GET") {
        try {
          const home = process.env.HOME ?? "";
          const outCandidates = [
            path.join(home, "Library", "Logs", "opencode-cron.log"),
            path.join(home, ".opencode-cron.log"),
          ];
          const errCandidates = [
            path.join(home, "Library", "Logs", "opencode-cron.err"),
            path.join(home, ".opencode-cron.err"),
          ];

          let stdout = "";
          let stderr = "";
          for (const outPath of outCandidates) {
            try {
              const rawOut = await fs.readFile(outPath, "utf-8");
              stdout = rawOut.split("\n").slice(-150).join("\n");
              break;
            } catch { /* try next */ }
          }
          if (!stdout) stdout = "Log file not found.";

          for (const errPath of errCandidates) {
            try {
              const rawErr = await fs.readFile(errPath, "utf-8");
              stderr = rawErr.split("\n").slice(-150).join("\n");
              break;
            } catch { /* try next */ }
          }
          if (!stderr) stderr = "Err file not found.";

          return new Response(JSON.stringify({ ok: true, stdout, stderr }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
        }
      }

      // 16. GET /api/schedule/preview (Explain schedule & compute next runs)
      if (pathname === "/api/schedule/preview" && method === "GET") {
        const q = (url.searchParams.get("q") ?? "").slice(0, 100);
        const res = explainSchedule(q);
        return new Response(JSON.stringify(res), { headers });
      }

      // 17. GET /api/git/diff (Git status & unified diff viewer)
      if (pathname === "/api/git/diff" && method === "GET") {
        try {
          const fileFilter = url.searchParams.get("file");
          if (fileFilter && (fileFilter.includes("..") || path.isAbsolute(fileFilter))) {
            return new Response(JSON.stringify({ ok: false, error: "Invalid file path: path traversal detected" }), { status: 400, headers });
          }

          const execFile = util.promisify(cp.execFile);

          // Check if repo has git
          let branch = "HEAD";
          try {
            const bRes = await execFile("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: directory });
            branch = bRes.stdout.trim();
          } catch {
            return new Response(JSON.stringify({ ok: true, isGit: false, branch: "non-git", clean: true, files: [], message: "Non è un repository git" }), { headers });
          }

          const statusRes = await execFile("git", ["status", "--porcelain"], { cwd: directory });
          const statusLines = statusRes.stdout.split("\n").filter((l) => l.trim().length > 0);

          const files = statusLines.map((line) => {
            const code = line.slice(0, 2).trim();
            const filePath = line.slice(2).trim();
            return { code, status: code, path: filePath };
          });

          let diffText = "";
          let statText = "";

          if (fileFilter) {
            const sanitized = fileFilter.replace(/\\/g, "/");
            const matched = files.find((f) => f.path === sanitized);
            if (matched && matched.code === "??") {
              // Untracked file: show diff against /dev/null
              const untrackedDiff = cp.spawnSync("git", ["diff", "--no-index", "--", "/dev/null", sanitized], { cwd: directory, encoding: "utf8" });
              diffText = untrackedDiff.stdout || "";
            } else {
              try {
                const fDiff = await execFile("git", ["diff", "HEAD", "--", sanitized], { cwd: directory, maxBuffer: 10 * 1024 * 1024 });
                diffText = fDiff.stdout || "";
              } catch {
                diffText = "";
              }
            }
          } else {
            try {
              const sRes = await execFile("git", ["diff", "HEAD", "--stat"], { cwd: directory });
              statText = sRes.stdout.trim();
            } catch { /* ignore */ }

            try {
              const dRes = await execFile("git", ["diff", "HEAD"], { cwd: directory, maxBuffer: 10 * 1024 * 1024 });
              diffText = dRes.stdout;
            } catch { /* ignore */ }
          }

          return new Response(JSON.stringify({
            ok: true,
            isGit: true,
            branch,
            clean: files.length === 0,
            file: fileFilter || null,
            files,
            stat: statText,
            stats: statText,
            diff: diffText,
          }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
        }
      }

      // 18. GET /api/runs (Unified cron runs history: SQLite + history.json + daemon log)
      if (pathname === "/api/runs" && method === "GET") {
        try {
          const limitParam = parseInt(url.searchParams.get("limit") ?? "200", 10);
          const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 500) : 200;
          const result = await getUnifiedRuns({ directory, dbPath, limit });
          return new Response(JSON.stringify(result), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
        }
      }

      return new Response("Not found", { status: 404 });
  };

  if (typeof (globalThis as any).Bun !== "undefined") {
    const server = (globalThis as any).Bun.serve({
      port,
      idleTimeout: 255,
      fetch: handler,
    });
    console.log(`OpenCode Cron GUI server running at: http://localhost:${server.port}`);
    return server;
  }

  // Node.js fallback using built-in node:http
  let nodeServerInstance: any = null;
  const serverObj = {
    port,
    stop: (_closeActive?: boolean) => {
      if (nodeServerInstance) nodeServerInstance.close();
    },
  };

  import("node:http").then((http) => {
    nodeServerInstance = http.createServer(async (nodeReq: any, nodeRes: any) => {
      try {
        const url = `http://${nodeReq.headers.host || "localhost:" + port}${nodeReq.url}`;
        const chunks: Buffer[] = [];
        for await (const chunk of nodeReq) chunks.push(Buffer.from(chunk));
        const body = ["GET", "HEAD"].includes(nodeReq.method || "") ? undefined : Buffer.concat(chunks);
        const headers = new Headers();
        for (const [k, v] of Object.entries(nodeReq.headers)) {
          if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : (v as string));
        }
        const webReq = new Request(url, {
          method: nodeReq.method,
          headers,
          body,
        });
        const webRes = await handler(webReq);
        nodeRes.statusCode = webRes.status;
        webRes.headers.forEach((v: string, k: string) => nodeRes.setHeader(k, v));
        const arrayBuffer = await webRes.arrayBuffer();
        nodeRes.end(Buffer.from(arrayBuffer));
      } catch (err: any) {
        nodeRes.statusCode = 500;
        nodeRes.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    nodeServerInstance.listen(port, () => {
      console.log(`OpenCode Cron GUI server running at: http://localhost:${port}`);
    });
  });

  return serverObj as any;
}

const isMain = Boolean(
  (import.meta as any).main ||
  (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]))
);

if (isMain) {
  const arg = (name: string): string | undefined => {
    const i = process.argv.indexOf(name);
    return i >= 0 ? process.argv[i + 1] : undefined;
  };
  const port = parseInt(arg("--port") ?? process.env.OPENCODE_CRON_PORT ?? "4488", 10);
  const dir = arg("--dir") ?? process.cwd();
  startGuiServer({ port, dir });
}

