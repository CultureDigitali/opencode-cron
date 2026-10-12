import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { Database } from "bun:sqlite";
import { startGuiServer } from "../src/gui/server.ts";

describe("GUI Server API", () => {
  let tmpDir: string;
  let dbPath: string;
  let server: ReturnType<typeof startGuiServer>;
  let baseUrl: string;

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "gui-test-"));
    dbPath = path.join(tmpDir, "opencode.db");

    // Initialize mock opencode.db with v2 session_message schema and v1 message schema
    const db = new Database(dbPath);
    db.run(`CREATE TABLE session (id TEXT PRIMARY KEY, title TEXT, time_created INTEGER, time_updated INTEGER)`);
    db.run(`CREATE TABLE session_message (id TEXT PRIMARY KEY, session_id TEXT, type TEXT, seq INTEGER, time_created INTEGER, data TEXT)`);
    db.run(`CREATE TABLE message (id TEXT PRIMARY KEY, session_id TEXT, time_created INTEGER, data TEXT)`);
    db.run(`CREATE TABLE part (id TEXT PRIMARY KEY, message_id TEXT, time_created INTEGER, data TEXT)`);

    const now = Date.now();
    db.run(`INSERT INTO session (id, title, time_created, time_updated) VALUES (?, ?, ?, ?)`, ["ses_test1", "Test Session", now, now]);
    db.run(
      `INSERT INTO session_message (id, session_id, type, seq, time_created, data) VALUES (?, ?, ?, ?, ?, ?)`,
      ["msg_u1", "ses_test1", "user", 1, now, JSON.stringify({ text: "Hello cron world" })]
    );
    db.run(
      `INSERT INTO session_message (id, session_id, type, seq, time_created, data) VALUES (?, ?, ?, ?, ?, ?)`,
      ["msg_a1", "ses_test1", "assistant", 2, now + 100, JSON.stringify({ content: [{ type: "text", text: "Cron tick acknowledged." }] })]
    );
    db.close();

    // Pick ephemeral port
    const testPort = 4499 + Math.floor(Math.random() * 1000);
    server = startGuiServer({ port: testPort, dir: tmpDir, dbPath });
    baseUrl = `http://localhost:${server.port}`;
  });

  afterAll(async () => {
    if (server) server.stop(true);
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("serves status with correct directory and dbPath", async () => {
    const res = await fetch(`${baseUrl}/api/status`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.ok).toBe(true);
    expect(data.directory).toBe(tmpDir);
    expect(data.dbPath).toBe(dbPath);
  });

  it("serves HTML dashboard at root with security headers", async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const html = await res.text();
    expect(html).toContain("OpenCode Cron");
    expect(html).toContain("marked.min.js");
    expect(html).toContain("purify.min.js");
  });

  it("creates, reads, updates, pauses, and deletes cron jobs", async () => {
    // 1. Initial list empty
    const list1: any = await (await fetch(`${baseUrl}/api/jobs`)).json();
    expect(Array.isArray(list1)).toBe(true);
    expect(list1.length).toBe(0);

    // 2. Create job
    const createRes = await fetch(`${baseUrl}/api/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "News Bot",
        scheduleStr: "5m",
        sessionID: "ses_test1",
        systemPrompt: "Follow news rules",
        followupPrompt: "Scrape latest articles",
      }),
    });
    expect(createRes.status).toBe(200);
    const createData: any = await createRes.json();
    expect(createData.ok).toBe(true);
    const jobId = createData.job.id;
    expect(jobId).toBeDefined();

    // 3. Verify in list
    const list2: any = await (await fetch(`${baseUrl}/api/jobs`)).json();
    expect(list2.length).toBe(1);
    expect(list2[0].id).toBe(jobId);
    expect(list2[0].schedule.everyMs).toBe(300000);

    // 4. Update job title and schedule
    const putRes = await fetch(`${baseUrl}/api/jobs/${encodeURIComponent(jobId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "News Bot Updated",
        scheduleStr: "10m",
      }),
    });
    expect(putRes.status).toBe(200);
    const putData: any = await putRes.json();
    expect(putData.job.title).toBe("News Bot Updated");
    expect(putData.job.schedule.everyMs).toBe(600000);

    // 5. Toggle pause / resume
    const pauseRes = await fetch(`${baseUrl}/api/jobs/${encodeURIComponent(jobId)}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: false }),
    });
    expect(pauseRes.status).toBe(200);
    const pauseData: any = await pauseRes.json();
    expect(pauseData.job.enabled).toBe(false);

    // 6. Delete job
    const delRes = await fetch(`${baseUrl}/api/jobs/${encodeURIComponent(jobId)}`, {
      method: "DELETE",
    });
    expect(delRes.status).toBe(200);
    const delData: any = await delRes.json();
    expect(delData.ok).toBe(true);

    const list3: any = await (await fetch(`${baseUrl}/api/jobs`)).json();
    expect(list3.length).toBe(0);
  });

  it("reads and updates memory markdown", async () => {
    // Create a job first
    const createRes = await fetch(`${baseUrl}/api/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Memory Target",
        scheduleStr: "5m",
        sessionID: "ses_test1",
        systemPrompt: "Sys",
        followupPrompt: "Fup",
      }),
    });
    const { job }: any = await createRes.json();

    // Read memory
    const memRes = await fetch(`${baseUrl}/api/memory/${encodeURIComponent(job.id)}`);
    expect(memRes.status).toBe(200);
    const mem: any = await memRes.json();
    expect(mem.md).toContain("Memory Target");

    // Update memory
    const putRes = await fetch(`${baseUrl}/api/memory/${encodeURIComponent(job.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ md: "# Updated Memory Content" }),
    });
    expect(putRes.status).toBe(200);

    const memAfter: any = await (await fetch(`${baseUrl}/api/memory/${encodeURIComponent(job.id)}`)).json();
    expect(memAfter.md).toBe("# Updated Memory Content");
  });

  it("lists sessions and queries chat messages from SQLite", async () => {
    const sesRes = await fetch(`${baseUrl}/api/sessions`);
    expect(sesRes.status).toBe(200);
    const sessions: any = await sesRes.json();
    expect(sessions.length).toBe(1);
    expect(sessions[0].id).toBe("ses_test1");

    const msgRes = await fetch(`${baseUrl}/api/sessions/ses_test1/messages`);
    expect(msgRes.status).toBe(200);
    const msgs: any = await msgRes.json();
    expect(msgs.length).toBe(2);
    expect(msgs[0].text).toBe("Hello cron world");
    expect(msgs[1].type).toBe("assistant");
  });

  it("validates session ID and rejects path traversal", async () => {
    const badRes = await fetch(`${baseUrl}/api/sessions/..%2F..%2Fetc/messages`);
    expect(badRes.status).toBe(400);
    const data: any = await badRes.json();
    expect(data.ok).toBe(false);
    expect(data.error).toContain("Invalid session ID");
  });

  it("restricts CORS origin to local origins", async () => {
    const res = await fetch(`${baseUrl}/api/status`, {
      headers: { Origin: "http://localhost:3000" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("previews schedule expressions in Italian with next 3 runs", async () => {
    // 1. Interval preview
    const resInterval = await fetch(`${baseUrl}/api/schedule/preview?q=15m`);
    expect(resInterval.status).toBe(200);
    const dataInterval: any = await resInterval.json();
    expect(dataInterval.valid).toBe(true);
    expect(dataInterval.kind).toBe("interval");
    expect(dataInterval.description).toContain("15 minuti");
    expect(dataInterval.nextRuns.length).toBe(3);

    // 2. Cron preview
    const resCron = await fetch(`${baseUrl}/api/schedule/preview?q=0%209%20*%20*%20*`);
    expect(resCron.status).toBe(200);
    const dataCron: any = await resCron.json();
    expect(dataCron.valid).toBe(true);
    expect(dataCron.kind).toBe("cron");
    expect(dataCron.description).toContain("09:00");
    expect(dataCron.nextRuns.length).toBe(3);

    // 3. Invalid expression
    const resInvalid = await fetch(`${baseUrl}/api/schedule/preview?q=garbage_interval`);
    expect(resInvalid.status).toBe(200);
    const dataInvalid: any = await resInvalid.json();
    expect(dataInvalid.valid).toBe(false);
    expect(dataInvalid.nextRuns.length).toBe(0);

    // 4. Empty query
    const resEmpty = await fetch(`${baseUrl}/api/schedule/preview`);
    expect(resEmpty.status).toBe(200);
    const dataEmpty: any = await resEmpty.json();
    expect(dataEmpty.valid).toBe(false);
  });

  it("handles git diff requests and rejects path traversal", async () => {
    // 1. Path traversal attempt on ?file parameter must be rejected
    const badTraversal = await fetch(`${baseUrl}/api/git/diff?file=../../etc/passwd`);
    expect(badTraversal.status).toBe(400);
    const badData: any = await badTraversal.json();
    expect(badData.ok).toBe(false);
    expect(badData.error).toContain("path traversal");

    // 2. Safe execution of git diff endpoint
    const res = await fetch(`${baseUrl}/api/git/diff`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(typeof data.branch).toBe("string");
    expect(Array.isArray(data.files)).toBe(true);
  });

  it("serves dedicated /runs HTML page and /api/runs unified cron history", async () => {
    const htmlRes = await fetch(`${baseUrl}/runs`);
    expect(htmlRes.status).toBe(200);
    expect(htmlRes.headers.get("content-type")).toContain("text/html");
    const htmlText = await htmlRes.text();
    expect(htmlText).toContain("Storico Esecuzioni Cron");
    expect(htmlText).toContain("Partite con Successo");
    expect(htmlText).toContain("Runs Fallite");

    const apiRes = await fetch(`${baseUrl}/api/runs?limit=50`);
    expect(apiRes.status).toBe(200);
    const data: any = await apiRes.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.runs)).toBe(true);
    expect(typeof data.stats.total).toBe("number");
    expect(typeof data.stats.succeeded).toBe("number");
    expect(typeof data.stats.failed).toBe("number");
    expect(Array.isArray(data.byJob)).toBe(true);
  });

  it("includes 10-language i18n system, accessible tooltip engine, and interactive guide across /, /runs, and /instructions", async () => {
    const expectedLangs = ["it", "en", "es", "fr", "de", "pt", "zh", "ja", "ar", "ru"];
    for (const path of ["/", "/runs", "/instructions", "/guide"]) {
      const res = await fetch(`${baseUrl}${path}`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('id="oc-lang-select"');
      expect(html).toContain('id="oc-tooltip"');
      expect(html).toContain('role="tooltip"');
      expect(html).toContain('id="oc-tour-modal"');
      expect(html).toContain('id="oc-spotlight-backdrop"');
      expect(html).toContain('id="oc-spotlight-ring"');
      expect(html).toContain('id="oc-spotlight-card"');
      expect(html).toContain('demoFillStepData');
      expect(html).toContain("data-tooltip=");
      for (const code of expectedLangs) {
        expect(html).toContain(`<option value="${code}">`);
      }
      expect(html).toContain("langMeta && langMeta.rtl ? 'rtl' : 'ltr'");
    }
  });

  it("serves comprehensive documentation chapters on /instructions", async () => {
    const res = await fetch(`${baseUrl}/instructions`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Tutto quello che devi sapere su OpenCode Cron");
    expect(html).toContain("Imposta Cron");
    expect(html).toContain("Visual Schedule Builder");
    expect(html).toContain("Max Runs");
    expect(html).toContain("seenHashes");
    expect(html).toContain("launchd");
  });

  it("blocks cross-site mutating requests with 403 (CSRF defense)", async () => {
    const res = await fetch(`${baseUrl}/api/check`, {
      method: "POST",
      headers: {
        "Origin": "https://malicious-site.com",
      },
    });
    expect(res.status).toBe(403);
    const body: any = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain("Cross-site mutation rejected");
  });

  it("provides bilingual English schedule preview and guarantees guided tour close reliability", async () => {
    // 1. English preview for interval
    const resEnInterval = await fetch(`${baseUrl}/api/schedule/preview?q=15m&lang=en`);
    expect(resEnInterval.status).toBe(200);
    const dataEnInterval: any = await resEnInterval.json();
    expect(dataEnInterval.valid).toBe(true);
    expect(dataEnInterval.description).toContain("Every 15 minutes");

    // 2. English preview for cron
    const resEnCron = await fetch(`${baseUrl}/api/schedule/preview?q=0%209%20*%20*%20*&lang=en`);
    expect(resEnCron.status).toBe(200);
    const dataEnCron: any = await resEnCron.json();
    expect(dataEnCron.valid).toBe(true);
    expect(dataEnCron.description).toContain("Every day at 09:00");

    // 3. Verify Spotlight close handlers and CSS !important rules on Dashboard
    const dashRes = await fetch(`${baseUrl}/`);
    const dashHtml = await dashRes.text();
    expect(dashHtml).toContain('id="oc-spotlight-close-btn"');
    expect(dashHtml).toContain('stopGuidedDemo(event)');
    expect(dashHtml).toContain('#oc-spotlight-backdrop.hidden');
    expect(dashHtml).toContain('display: none !important');
    expect(dashHtml).toContain('isSpotlightActive = false');

    // 4. Verify Tour modal and bilingual support on Instructions page
    const instRes = await fetch(`${baseUrl}/instructions`);
    const instHtml = await instRes.text();
    expect(instHtml).toContain('id="instructions-tour-modal"');
    expect(instHtml).toContain('closeTourModal(event)');
    expect(instHtml).toContain('TOUR_STEPS_IT');
    expect(instHtml).toContain('TOUR_STEPS_EN');
    expect(instHtml).toContain('renderInstructionsPage');
  });
});




