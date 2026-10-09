import { describe, it, expect } from "bun:test";
import { Database } from "bun:sqlite";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { mirrorPairs } from "../src/mirror.ts";

function makeDb(p: string): Database {
  const db = new Database(p);
  db.exec(`CREATE TABLE message (id text PRIMARY KEY, session_id text NOT NULL, time_created integer NOT NULL, time_updated integer NOT NULL, data text NOT NULL);`);
  db.exec(`CREATE TABLE part (id text PRIMARY KEY, message_id text NOT NULL, session_id text NOT NULL, time_created integer NOT NULL, time_updated integer NOT NULL, data text NOT NULL);`);
  db.exec(`CREATE TABLE session_message (seq integer PRIMARY KEY AUTOINCREMENT, id text NOT NULL UNIQUE, session_id text NOT NULL, type text NOT NULL, data text NOT NULL, time_created integer NOT NULL);`);
  return db;
}

function insertV2(db: Database, sessionId: string, type: string, data: object, t: number): void {
  db.prepare(`INSERT INTO session_message (id, session_id, type, data, time_created) VALUES (?, ?, ?, ?, ?)`)
    .run(`v2_${t}_${type}`, sessionId, type, JSON.stringify(data), t);
}

describe("mirror v2->v1", () => {
  it("mirrors a complete pair in GUI format and is idempotent", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-mirror-"));
    const db = makeDb(path.join(dir, "test.db"));
    const sid = "ses_test";
    const t0 = 1791567000000;
    insertV2(db, sid, "user", { time: { created: t0 }, text: "[CRON SYSTEM...] Sono vivo?" }, t0);
    insertV2(db, sid, "assistant", {
      time: { created: t0 + 100, completed: t0 + 2000 },
      agent: "build",
      model: { id: "z-ai/glm-5.3", providerID: "nvidia" },
      content: [{ type: "text", text: "\"Sono vivo, test, tutto ok ?\"" }],
      tokens: { total: 100, input: 10, output: 20, reasoning: 0, cache: { write: 0, read: 70 } },
      cost: 0.001,
    }, t0 + 100);

    const statePath = path.join(dir, "state.json");
    const r1 = mirrorPairs(db, { dbPath: "", sessionId: sid, cwd: "/proj", statePath });
    expect(r1.mirrored).toBe(1);

    const msgs = db.prepare(`SELECT id, data FROM message ORDER BY time_created`).all() as any[];
    expect(msgs).toHaveLength(2);
    const [u, a] = msgs.map((m) => JSON.parse(m.data));
    expect(u.role).toBe("user");
    expect(u.summary).toEqual({ diffs: [] });
    expect(a.parentID).toBe(msgs[0].id);
    expect(a.role).toBe("assistant");
    expect(a.finish).toBe("stop");

    const uParts = db.prepare(`SELECT data FROM part WHERE message_id = ?`).all(msgs[0].id) as any[];
    expect(JSON.parse(uParts[0].data)).toEqual({ type: "text", text: "[CRON SYSTEM...] Sono vivo?" });
    const aParts = db.prepare(`SELECT data FROM part WHERE message_id = ? ORDER BY time_created`).all(msgs[1].id) as any[];
    const shapes = aParts.map((p) => JSON.parse(p.data).type);
    expect(shapes).toEqual(["step-start", "text", "step-finish"]);
    expect(JSON.parse(aParts[1].data).text).toContain("Sono vivo");

    // idempotent: second run mirrors nothing
    const r2 = mirrorPairs(db, { dbPath: "", sessionId: sid, cwd: "/proj", statePath });
    expect(r2.mirrored).toBe(0);
    expect((db.prepare(`SELECT count(*) c FROM message`).get() as any).c).toBe(2);
  });

  it("leaves incomplete trailing user rows for the next run", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-mirror2-"));
    const db = makeDb(path.join(dir, "test.db"));
    const sid = "ses_test";
    const t0 = 1791568000000;
    insertV2(db, sid, "user", { time: { created: t0 }, text: "tick" }, t0); // no assistant yet
    const statePath = path.join(dir, "state.json");
    const r = mirrorPairs(db, { dbPath: "", sessionId: sid, cwd: "/p", statePath });
    expect(r.mirrored).toBe(0);
    expect((db.prepare(`SELECT count(*) c FROM message`).get() as any).c).toBe(0);
  });

  it("skips pairs the app already mirrored to v1 (steered dedup)", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-mirror3-"));
    const db = makeDb(path.join(dir, "test.db"));
    const sid = "ses_test";
    const t0 = 1791569000000;
    // the app wrote the user text to v1 already (steer path)
    db.prepare(`INSERT INTO message (id, session_id, time_created, time_updated, data) VALUES (?, ?, ?, ?, ?)`)
      .run("msg_real", sid, t0, t0, JSON.stringify({ role: "user" }));
    db.prepare(`INSERT INTO part (id, message_id, session_id, time_created, time_updated, data) VALUES (?, ?, ?, ?, ?, ?)`)
      .run("prt_real", "msg_real", sid, t0, t0, JSON.stringify({ type: "text", text: "già presente" }));
    // v2 has the same pair
    insertV2(db, sid, "user", { time: { created: t0 }, text: "già presente" }, t0);
    insertV2(db, sid, "assistant", { time: { created: t0 + 100 }, content: [{ type: "text", text: "risposta" }] }, t0 + 100);
    const statePath = path.join(dir, "state.json");
    const r = mirrorPairs(db, { dbPath: "", sessionId: sid, cwd: "/p", statePath });
    expect(r.mirrored).toBe(0);
    expect(r.skipped).toBe(1);
    expect((db.prepare(`SELECT count(*) c FROM message`).get() as any).c).toBe(1); // only the app row
  });
});
