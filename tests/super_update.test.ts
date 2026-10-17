import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { startGuiServer } from "../src/gui/server.ts";
import { saveJobs } from "../src/store.ts";
import { saveCronSettings } from "../src/concurrency.ts";
import { CronJobSchema, type CronJob } from "../src/types.ts";

describe("Super Update - 10 Features End-to-End API Integration", () => {
  let tmpDir: string;
  let server: any;
  let baseUrl: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-super-test-"));
    const cronFolder = path.join(tmpDir, ".opencode", "cron");
    await fs.mkdir(cronFolder, { recursive: true });

    // Initialize sample jobs
    const sampleJobs: CronJob[] = [
      CronJobSchema.parse({
        id: "job-monitoring-1",
        title: "Database Health Guard",
        directory: tmpDir,
        enabled: true,
        sessionID: "ses-test-1",
        schedule: { kind: "interval", everyMs: 60000 },
        systemPrompt: "System monitoring prompt",
        followupPrompt: "Check latency and alert if down",
        category: "monitoring",
        tags: ["prod", "critical", "database"],
        timeoutMs: 15000,
        guard: { enabled: true, command: "true" },
        createdAt: new Date().toISOString(),
        nextRunAt: new Date(Date.now() + 60000).toISOString(),
        lastRunAt: null,
        runCount: 5,
        maxRuns: 0,
        consecutiveFailures: 0,
      }),
    ];
    await saveJobs(tmpDir, sampleJobs);
    await saveCronSettings(tmpDir, { maxConcurrency: 3 });

    // Start GUI server on random high port
    server = await startGuiServer({
      port: 0,
      dir: tmpDir,
      openBrowser: false,
    } as any);
    baseUrl = `http://127.0.0.1:${server.port}`;
  });

  afterEach(async () => {
    if (server && server.server) {
      server.server.stop();
    }
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  });

  it("serves blueprint templates and allows 1-click instantiation", async () => {
    const listRes = await fetch(`${baseUrl}/api/templates`);
    expect(listRes.status).toBe(200);
    const listData = (await listRes.json()) as any;
    expect(listData.ok).toBe(true);
    expect(Array.isArray(listData.templates)).toBe(true);
    expect(listData.templates.length).toBeGreaterThanOrEqual(4);

    // Apply template
    const applyRes = await fetch(`${baseUrl}/api/templates/git-auto-sync/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionID: "ses-applied" }),
    });
    expect(applyRes.status).toBe(200);
    const applyData = (await applyRes.json()) as any;
    expect(applyData.ok).toBe(true);
    expect(applyData.job.category).toBe("devops");
    expect(applyData.job.tags).toContain("git");
  });

  it("handles snapshots, backups, restore, and pruning", async () => {
    // 1. Create backup
    const createRes = await fetch(`${baseUrl}/api/backup`, { method: "POST" });
    expect(createRes.status).toBe(200);
    const createData = (await createRes.json()) as any;
    expect(createData.ok).toBe(true);
    expect(createData.backup.id).toMatch(/^bak-/);
    const snapId = createData.backup.id;

    // 2. List backups
    const listRes = await fetch(`${baseUrl}/api/backup`);
    const listData = (await listRes.json()) as any;
    expect(listData.ok).toBe(true);
    expect(listData.backups.length).toBeGreaterThanOrEqual(1);

    // 3. Restore backup
    const restoreRes = await fetch(`${baseUrl}/api/backup/${snapId}/restore`, { method: "POST" });
    expect(restoreRes.status).toBe(200);
    const restoreData = (await restoreRes.json()) as any;
    expect(restoreData.ok).toBe(true);

    // 4. Delete backup
    const deleteRes = await fetch(`${baseUrl}/api/backup/${snapId}`, { method: "DELETE" });
    expect(deleteRes.status).toBe(200);
    const deleteData = (await deleteRes.json()) as any;
    expect(deleteData.ok).toBe(true);
  });

  it("exposes real-time metrics and prometheus exporter format", async () => {
    // JSON metrics
    const res = await fetch(`${baseUrl}/api/metrics`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.ok).toBe(true);
    expect(data.metrics).toBeDefined();

    // Prometheus OpenMetrics
    const promRes = await fetch(`${baseUrl}/api/metrics/prometheus`);
    expect(promRes.status).toBe(200);
    const promText = await promRes.text();
    expect(promText).toContain("opencode_cron_job_runs_total");
    expect(promText).toContain("opencode_cron_jobs_total");
  });

  it("configures notification channels and dispatches test ping", async () => {
    // Save settings
    const saveRes = await fetch(`${baseUrl}/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slackWebhookUrl: "https://hooks.slack.com/services/T00/B00/test",
        notifyOnFailure: true,
        notifyOnQuarantine: true,
        notifyOnRecovery: true,
      }),
    });
    expect(saveRes.status).toBe(200);
    const saveData = (await saveRes.json()) as any;
    expect(saveData.ok).toBe(true);

    // Read back settings (with secret redaction)
    const getRes = await fetch(`${baseUrl}/api/notifications`);
    const getData = (await getRes.json()) as any;
    expect(getData.ok).toBe(true);
    expect(getData.config.notifyOnFailure).toBe(true);

    // Test ping endpoint
    const testRes = await fetch(`${baseUrl}/api/notifications/test`, { method: "POST" });
    expect(testRes.status).toBe(200);
    const testData = (await testRes.json()) as any;
    expect(typeof testData.ok).toBe("boolean");
  });

  it("handles history pruning policy", async () => {
    const pruneRes = await fetch(`${baseUrl}/api/history/prune`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maxAgeDays: 30, maxEntries: 100 }),
    });
    expect(pruneRes.status).toBe(200);
    const pruneData = (await pruneRes.json()) as any;
    expect(pruneData.ok).toBe(true);
  });
});
