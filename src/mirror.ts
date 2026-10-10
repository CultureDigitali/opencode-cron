import { Database } from "bun:sqlite";
import * as fsSync from "node:fs";
import * as path from "node:path";

export interface MirrorOpts {
  dbPath: string;
  sessionId: string;
  cwd: string;
  statePath: string;
  /** Only mirror pairs completed after this v2 seq when state is missing (safety). */
  limit?: number;
}

export interface MirrorResult {
  mirrored: number;
  skipped: number;
  lastSeq: number;
}

function genId(prefix: "msg_" | "prt_"): string {
  const hex = (Date.now() + Math.floor(Math.random() * 1e6)).toString(16).padStart(10, "0");
  const rnd = Math.random().toString(36).slice(2, 19).padEnd(17, "x");
  return `${prefix}${hex}1001${rnd}`;
}

interface V2Row {
  id: string;
  type: string;
  seq: number;
  time_created: number;
  data: string;
}

/**
 * Mirror completed drain Q&A pairs (session_message, v2 storage) into the
 * v1 `message`/`part` tables the desktop GUI renders. Local workaround for
 * the desktop app's split runtimes: cron ticks execute in v2 storage while
 * the transcript UI reads v1. Idempotent via a state file (last v2 seq).
 */
export function mirrorPairs(db: Database, opts: MirrorOpts): MirrorResult {
  const state = readState(opts.statePath);
  const rows = db
    .prepare(
      `SELECT id, type, seq, time_created, data FROM session_message
       WHERE session_id = ? AND seq > ? ORDER BY seq ASC`
    )
    .all(opts.sessionId, state.lastSeq) as unknown as V2Row[];

  // latest real snapshot hash for step-start/step-finish parts
  let snapshot = "";
  try {
    const snapRow = db
      .prepare(
        `SELECT json_extract(data, '$.snapshot') AS s FROM part
         WHERE json_extract(data, '$.snapshot') IS NOT NULL ORDER BY time_created DESC LIMIT 1`
      )
      .get() as { s: string } | undefined;
    snapshot = snapRow?.s ?? "";
  } catch { /* optional */ }

  // Group into turns: a user row followed by all consecutive non-user rows
  // (assistant steps have content:[] on the first row; real text spans
  // multiple assistant rows — one per step — until the next user row).
  const turns: Array<{ user: V2Row; assistants: V2Row[] }> = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].type !== "user") continue;
    const turn = { user: rows[i], assistants: [] as V2Row[] };
    while (i + 1 < rows.length && rows[i + 1].type !== "user") {
      i++;
      if (rows[i].type === "assistant") turn.assistants.push(rows[i]);
    }
    if (turn.assistants.length) turns.push(turn);
  }

  let mirrored = 0;
  let skipped = 0;
  let lastSeq = state.lastSeq;

  const tx = db.transaction(() => {
    for (const { user, assistants } of turns) {
      const uData = safeJson(user.data);
      const uText = uData?.text;
      const aText = extractTurnText(assistants);
      const aData = safeJson(assistants[assistants.length - 1].data);
      const lastTime = assistants[assistants.length - 1].time_created;
      if (typeof uText !== "string" || aText === null) {
        skipped++;
        lastSeq = Math.max(lastSeq, lastTime ? safeJson(assistants[assistants.length - 1].data)?.time?.created ?? lastTime : user.seq);
        continue;
      }
      // dedup: steered pairs are also written to v1 by the app itself —
      // skip when an equivalent user text already exists in v1 near this time.
      const dup = db
        .prepare(
          `SELECT count(*) c FROM part WHERE json_extract(data, '$.type') = 'text'
           AND json_extract(data, '$.text') = ?
           AND time_created BETWEEN ? AND ? LIMIT 1`
        )
        .get(uText, user.time_created - 30_000, user.time_created + 30_000) as { c: number };
      if (dup.c > 0) {
        skipped++;
        lastSeq = Math.max(lastSeq, user.seq);
        continue;
      }
      const userMsgId = genId("msg_");
      const assistantMsgId = genId("msg_");
      const firstA = safeJson(assistants[0].data);
      const lastA = aData;
      const createdA = firstA?.time?.created ?? assistants[0].time_created;
      const completedA = lastA?.time?.completed ?? lastA?.time?.created ?? lastTime;
      const uDataOut = JSON.stringify({
        role: "user",
        time: { created: user.time_created },
        agent: "build",
        model: { providerID: lastA?.model?.providerID ?? "nvidia", modelID: lastA?.model?.id ?? "z-ai/glm-5.3" },
        summary: { diffs: [] },
      });
      const tokens = lastA?.tokens ?? { total: 0, input: 0, output: 0, reasoning: 0, cache: { write: 0, read: 0 } };
      const aDataOut = JSON.stringify({
        parentID: userMsgId,
        role: "assistant",
        mode: "build",
        agent: "build",
        path: { cwd: opts.cwd, root: opts.cwd },
        cost: lastA?.cost ?? 0,
        tokens,
        modelID: lastA?.model?.id ?? "z-ai/glm-5.3",
        providerID: lastA?.model?.providerID ?? "nvidia",
        time: { created: createdA, completed: completedA },
        finish: "stop",
      });
      insertMessage(db, userMsgId, opts.sessionId, user.time_created, user.time_created, uDataOut);
      insertMessage(db, assistantMsgId, opts.sessionId, completedA, completedA, aDataOut);
      insertPart(db, genId("prt_"), userMsgId, opts.sessionId, user.time_created, JSON.stringify({ type: "text", text: uText }));
      insertPart(db, genId("prt_"), assistantMsgId, opts.sessionId, createdA, JSON.stringify({ snapshot, type: "step-start" }));
      insertPart(db, genId("prt_"), assistantMsgId, opts.sessionId, completedA, JSON.stringify({ type: "text", text: aText }));
      insertPart(db, genId("prt_"), assistantMsgId, opts.sessionId, completedA, JSON.stringify({ reason: "stop", snapshot, type: "step-finish", tokens, cost: lastA?.cost ?? 0 }));
      mirrored++;
      lastSeq = Math.max(lastSeq, assistants[assistants.length - 1].seq);
    }
  });
  tx();

  writeState(opts.statePath, { lastSeq });
  return { mirrored, skipped, lastSeq };
}

function extractTurnText(assistants: V2Row[]): string | null {
  const texts: string[] = [];
  for (const row of assistants) {
    const data = safeJson(row.data);
    const content = data?.content;
    if (!Array.isArray(content)) continue;
    for (const c of content) {
      if (c?.type === "text" && typeof c.text === "string" && c.text.length > 0) texts.push(c.text);
    }
  }
  return texts.length ? texts.join("\n\n") : null;
}

function safeJson(s: string): any {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function insertMessage(db: Database, id: string, sessionId: string, tc: number, tu: number, data: string): void {
  db.prepare(`INSERT INTO message (id, session_id, time_created, time_updated, data) VALUES (?, ?, ?, ?, ?)`).run(id, sessionId, tc, tu, data);
}

function insertPart(db: Database, id: string, messageId: string, sessionId: string, tc: number, data: string): void {
  db.prepare(`INSERT INTO part (id, message_id, session_id, time_created, time_updated, data) VALUES (?, ?, ?, ?, ?, ?)`).run(id, messageId, sessionId, tc, tc, data);
}

interface MirrorState { lastSeq: number }

function readState(p: string): MirrorState {
  try {
    const raw = JSON.parse(fsSync.readFileSync(p, "utf-8"));
    if (typeof raw?.lastSeq === "number") return { lastSeq: raw.lastSeq };
  } catch { /* fresh */ }
  return { lastSeq: 0 };
}

function writeState(p: string, s: MirrorState): void {
  fsSync.mkdirSync(path.dirname(p), { recursive: true });
  fsSync.writeFileSync(p, JSON.stringify(s, null, 2));
}

export async function runMirrorCli(): Promise<void> {
  const arg = (name: string): string | undefined => {
    const i = process.argv.indexOf(name);
    return i >= 0 ? process.argv[i + 1] : undefined;
  };
  const sessionId = arg("--session");
  const dir = arg("--dir") ?? process.cwd();
  const dbPath = arg("--db") ?? path.join(process.env.HOME ?? "", ".local", "share", "opencode", "opencode.db");
  if (!sessionId) {
    console.error("Usage: bun src/mirror.ts --session <ses_id> [--dir <dir>] [--db <path>]");
    process.exit(2);
  }
  const statePath = path.join(dir, ".opencode", "cron", "mirror-state.json");
  // bootstrap: on first run, start from the current v2 tail (no backlog flood)
  let bootstrapped = false;
  try {
    fsSync.accessSync(statePath);
  } catch {
    bootstrapped = true;
  }
  const db = new Database(dbPath);
  if (bootstrapped) {
    const tail = db
      .prepare(`SELECT COALESCE(MAX(seq), 0) AS m FROM session_message WHERE session_id = ?`)
      .get(sessionId) as { m: number };
    writeState(statePath, { lastSeq: tail.m });
    console.log(`mirror: state bootstrapped at seq ${tail.m} (backlog skipped)`);
  }
  const r = mirrorPairs(db, { dbPath, sessionId, cwd: dir, statePath });
  console.log(`mirror: ${r.mirrored} pair(s) mirrored, ${r.skipped} skipped, lastSeq=${r.lastSeq}`);
  db.close();
}

if (import.meta.main) {
  await runMirrorCli();
}
