#!/usr/bin/env node
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { loadJobs } from "../src/store.ts";
import { runJobHeadless, checkDue, writeCredentialsFile } from "../src/runner.ts";
import { detectOS, launchdPlist, systemdService, systemdTimer, crontabLine, schtasksCommand } from "../src/os.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CREDS_FILE = path.join(process.env.HOME ?? "~", ".config", "opencode-cron", "credentials");

/** refresh-creds: persist the current process's OPENCODE_SERVER_USERNAME/PASSWORD
 * (injected by the desktop app into every agent turn) so the launchd ticker can
 * authenticate after an app restart rotated the credentials. */
async function refreshCreds(): Promise<void> {
  try {
    const target = await writeCredentialsFile();
    console.log(`refresh-creds: written ${target} (0600)`);
  } catch (e: any) {
    console.error(`refresh-creds: ${e?.message ?? e}`);
    process.exit(2);
  }
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function has(flag: string): boolean {
  return process.argv.includes(flag);
}

async function osInstall(directory: string): Promise<void> {
  const os = detectOS();
  const runner = process.argv[1]; // path to this script
  console.log(`OS: ${os}`);
  if (os === "macos") {
    const label = "ai.opencode.cron";
    const plist = launchdPlist({ label, runnerPath: runner, directory, intervalSec: 60 });
    const dest = `${process.env.HOME}/Library/LaunchAgents/${label}.plist`;
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, plist, "utf-8");
    console.log(`Plist written to ${dest}\nActivate with: launchctl load ${dest}`);
  } else if (os === "linux") {
    console.log("--- systemd service (opencode-cron.service) ---\n" + systemdService({ runnerPath: runner, directory }));
    console.log("--- systemd timer (opencode-cron.timer, 60s) ---\n" + systemdTimer({ intervalSec: 60 }));
    console.log("Install to ~/.config/systemd/user/ then: systemctl --user daemon-reload && systemctl --user enable --now opencode-cron.timer");
    console.log("Crontab fallback:\n" + crontabLine({ runnerPath: runner, directory }));
  } else if (os === "windows") {
    console.log("Run in admin PowerShell:\n" + schtasksCommand({ taskName: "opencode-cron", runnerPath: runner, directory }));
  } else {
    console.log("Unknown OS. Manual cron:\n" + crontabLine({ runnerPath: runner, directory }));
  }
}

async function main(): Promise<void> {
  const cmd = process.argv[2] || "check";
  const dir = arg("--dir") ?? process.cwd();
  if (cmd === "check") {
    const conc = arg("--concurrency");
    const limit = conc ? parseInt(conc, 10) : undefined;
    await checkDue(dir, undefined, limit);
  }
  else if (cmd === "run") {
    const id = process.argv[3];
    if (!id || id.startsWith("--")) {
      console.error("Usage: opencode-cron-run run <jobId> --dir <dir>");
      process.exit(2);
    }
    process.exit(await runJobHeadless(dir, id));
  } else if (cmd === "os-install") await osInstall(dir);
  else if (cmd === "refresh-creds") await refreshCreds();
  else if (cmd === "list") console.log(JSON.stringify(await loadJobs(dir), null, 2));
  else if (cmd === "gui") {
    const { spawn, execSync } = await import("node:child_process");
    let bunPath = process.env.BUN_BIN;
    if (!bunPath) {
      try {
        const which = execSync("which bun", { encoding: "utf-8" }).trim();
        if (which) bunPath = which;
      } catch { /* ignore */ }
    }
    let bunFound = false;
    if (bunPath) {
      try {
        await fs.access(bunPath);
        bunFound = true;
      } catch { /* not at bunPath */ }
    }

    const candidates = [
      path.join(__dirname, "..", "gui", "server.js"),
      path.join(__dirname, "..", "src", "gui", "server.ts"),
      path.join(__dirname, "..", "gui", "server.ts"),
    ];
    let guiScript = candidates[0];
    for (const c of candidates) {
      try {
        await fs.access(c);
        guiScript = c;
        break;
      } catch { /* continue */ }
    }

    let runnerExe = bunFound ? bunPath! : process.execPath;
    if (!bunFound && guiScript.endsWith(".ts")) {
      const jsCandidate = path.join(__dirname, "..", "gui", "server.js");
      try {
        await fs.access(jsCandidate);
        guiScript = jsCandidate;
      } catch { /* ignore */ }
    }

    const child = spawn(runnerExe, [guiScript, ...process.argv.slice(3)], { stdio: "inherit" });
    child.on("close", (c) => process.exit(c ?? 0));
    child.on("error", (err) => {
      console.error(`Failed to launch GUI: ${err.message}.`);
      process.exit(1);
    });
  } else if (cmd === "desktop" || cmd === "tray") {
    const { spawn } = await import("node:child_process");
    const desktopEntry = path.join(__dirname, "..", "desktop", "main.js");
    const electronBinary = path.join(__dirname, "..", "..", "node_modules", ".bin", process.platform === "win32" ? "electron.cmd" : "electron");

    let exe = electronBinary;
    try {
      await fs.access(exe);
    } catch {
      exe = "electron";
    }

    const child = spawn(exe, [desktopEntry, ...process.argv.slice(3)], { stdio: "inherit" });
    child.on("close", (c) => process.exit(c ?? 0));
    child.on("error", (err) => {
      console.error(`Failed to launch Desktop Tray app: ${err.message}. Ensure electron is installed.`);
      process.exit(1);
    });
  } else if (cmd === "webhook-token") {
    const id = process.argv[3];
    if (!id || id.startsWith("--")) {
      console.error("Usage: opencode-cron webhook-token <jobId> [--dir <dir>]");
      process.exit(2);
    }
    const { loadJobs: loadStoreJobs, saveJobs: saveStoreJobs } = await import("../src/store.ts");
    const { generateWebhookToken } = await import("../src/webhook.ts");
    const jobs = await loadStoreJobs(dir);
    const j = jobs.find((x) => x.id === id);
    if (!j) {
      console.error(`Job ${id} not found`);
      process.exit(1);
    }
    if (!j.webhook || !j.webhook.token) {
      j.webhook = {
        enabled: true,
        token: generateWebhookToken(),
        passPayload: true,
        rateLimitSeconds: 5,
        lastTriggeredAt: null,
      };
      await saveStoreJobs(dir, jobs);
      console.log(`Generated new webhook token for job ${id}`);
    }
    const port = parseInt(process.env.OPENCODE_CRON_PORT ?? "4488", 10);
    const url = `http://127.0.0.1:${port}/api/webhook/${id}?token=${j.webhook.token}`;
    console.log(`Webhook URL: ${url}`);
    console.log(`Token: ${j.webhook.token}`);
    console.log(`curl snippet:\ncurl -X POST "${url}" -H "Content-Type: application/json" -d '{"event":"cli-trigger"}'`);
  } else if (cmd === "concurrency") {
    const { loadCronSettings, saveCronSettings } = await import("../src/concurrency.ts");
    const limitStr = process.argv[3];
    if (!limitStr || limitStr.startsWith("--")) {
      const settings = await loadCronSettings(dir);
      console.log(`Current max concurrency: ${settings.maxConcurrency}`);
    } else {
      const n = parseInt(limitStr, 10);
      if (Number.isNaN(n) || n < 1 || n > 10) {
        console.error("Concurrency must be an integer between 1 and 10");
        process.exit(2);
      }
      const saved = await saveCronSettings(dir, { maxConcurrency: n });
      console.log(`Max concurrency updated to: ${saved.maxConcurrency}`);
    }
  } else if (cmd === "priority") {
    const { JobPrioritySchema } = await import("../src/types.ts");
    const { saveJobs: saveStoreJobs } = await import("../src/store.ts");
    const id = process.argv[3];
    const prio = process.argv[4];
    if (!id || id.startsWith("--")) {
      console.error("Usage: opencode-cron priority <jobId> [high|normal|low] [--dir <dir>]");
      process.exit(2);
    }
    const jobs = await loadJobs(dir);
    const j = jobs.find((x) => x.id === id);
    if (!j) {
      console.error(`Job ${id} not found`);
      process.exit(1);
    }
    if (!prio || prio.startsWith("--")) {
      console.log(`Job '${id}' priority: ${j.priority ?? "normal"}`);
    } else {
      j.priority = JobPrioritySchema.parse(prio);
      await saveStoreJobs(dir, jobs);
      console.log(`Job '${id}' priority updated to: ${j.priority}`);
    }
  } else if (cmd === "queue") {
    const { loadCronSettings, getActiveLocks } = await import("../src/concurrency.ts");
    const settings = await loadCronSettings(dir);
    const activeLocks = await getActiveLocks(dir);
    const jobs = await loadJobs(dir);
    console.log(`=== Concurrency & Queue Status ===`);
    console.log(`Max Concurrency: ${settings.maxConcurrency}`);
    console.log(`Active Running Jobs (${activeLocks.length}): ${activeLocks.join(", ") || "(none)"}`);
    console.log(`Total Configured Jobs: ${jobs.length}`);
    for (const j of jobs) {
      const state = activeLocks.includes(j.id) ? "RUNNING" : (j.enabled ? "IDLE" : "PAUSED");
      console.log(`- [${state}] ${j.id} (${j.title}) | Priority: ${j.priority ?? "normal"} | Next: ${j.nextRunAt ?? "not scheduled"}`);
    }
  } else if (cmd === "dlq") {
    const { loadDLQ, clearDLQ, retryDLQJob, resolveDLQEntry } = await import("../src/dlq.ts");
    const sub = process.argv[3];
    if (sub === "clear") {
      const count = await clearDLQ(dir, "all");
      console.log(`Cleared ${count} entries from DLQ.`);
    } else if (sub === "retry") {
      const id = process.argv[4];
      if (!id) {
        console.error("Usage: opencode-cron dlq retry <jobId>");
        process.exit(2);
      }
      console.log(`Retrying quarantined job '${id}' (canary probe)...`);
      const res = await retryDLQJob(dir, id, async (d, jId) => runJobHeadless(d, jId));
      if (res.ok) {
        console.log(`Canary retry succeeded! Job '${id}' recovered and marked resolved in DLQ.`);
      } else {
        console.error(`Canary retry failed: ${res.error}`);
        process.exit(1);
      }
    } else if (sub === "resolve") {
      const id = process.argv[4];
      if (!id) {
        console.error("Usage: opencode-cron dlq resolve <jobId>");
        process.exit(2);
      }
      const { resetCircuitBreaker } = await import("../src/dlq.ts");
      const { saveJobs: saveStoreJobs } = await import("../src/store.ts");
      const ok = await resolveDLQEntry(dir, id);
      const jobs = await loadJobs(dir);
      const dlq = await loadDLQ(dir);
      const matched = dlq.find((e) => e.id === id || e.jobId === id);
      const targetJobId = matched ? matched.jobId : id;
      const j = jobs.find((x) => x.id === targetJobId);
      if (j) {
        resetCircuitBreaker(j);
        j.enabled = true;
        await saveStoreJobs(dir, jobs);
      }
      console.log(ok ? `Marked DLQ entries for '${id}' as resolved and reset circuit breaker.` : `No quarantined entries found for '${id}'.`);
    } else {
      const dlq = await loadDLQ(dir);
      const jobs = await loadJobs(dir);
      console.log(`=== Dead Letter Queue (DLQ) ===`);
      console.log(`Total Entries: ${dlq.length} | Quarantined: ${dlq.filter((e) => e.status === "quarantined").length}`);
      if (dlq.length === 0) {
        console.log("(DLQ is empty - all jobs healthy)");
      } else {
        for (const e of dlq) {
          console.log(`- [${e.status.toUpperCase()}] Job: ${e.jobId} (${e.jobTitle}) | Failures: ${e.consecutiveFailures} | FailedAt: ${e.failedAt}`);
          console.log(`  Error: ${e.errorMessage}`);
        }
      }
    }
  } else if (cmd === "circuit") {
    const { resetCircuitBreaker, tripCircuitBreaker, setHalfOpen } = await import("../src/dlq.ts");
    const { saveJobs: saveStoreJobs } = await import("../src/store.ts");
    const id = process.argv[3];
    const action = process.argv[4];
    if (!id || id.startsWith("--")) {
      console.error("Usage: opencode-cron circuit <jobId> [reset|trip|half-open] [--dir <dir>]");
      process.exit(2);
    }
    const jobs = await loadJobs(dir);
    const j = jobs.find((x) => x.id === id);
    if (!j) {
      console.error(`Job '${id}' not found`);
      process.exit(1);
    }
    if (!action || action.startsWith("--")) {
      const state = j.circuitBreaker?.state ?? "closed";
      console.log(`Circuit Breaker for '${id}': ${state.toUpperCase()}`);
      if (j.circuitBreaker?.lastFailureReason) console.log(`Last Failure Reason: ${j.circuitBreaker.lastFailureReason}`);
      if (j.circuitBreaker?.trippedAt) console.log(`Tripped At: ${j.circuitBreaker.trippedAt}`);
    } else if (action === "reset") {
      resetCircuitBreaker(j);
      j.enabled = true;
      await saveStoreJobs(dir, jobs);
      console.log(`Circuit breaker for '${id}' reset to CLOSED and job re-enabled.`);
    } else if (action === "trip") {
      tripCircuitBreaker(j, "Manually tripped via CLI");
      await saveStoreJobs(dir, jobs);
      console.log(`Circuit breaker for '${id}' manually set to OPEN.`);
    } else if (action === "half-open") {
      setHalfOpen(j);
      await saveStoreJobs(dir, jobs);
      console.log(`Circuit breaker for '${id}' set to HALF-OPEN (canary probe ready).`);
    } else {
      console.error(`Unknown circuit action: ${action}. Use reset, trip, or half-open.`);
      process.exit(2);
    }
  } else if (cmd === "template") {
    const { listJobTemplates, applyJobTemplate, getJobTemplate } = await import("../src/templates.ts");
    const sub = process.argv[3];
    if (!sub || sub === "list") {
      const list = listJobTemplates();
      console.log(`=== Available Job Templates (${list.length}) ===`);
      for (const t of list) {
        console.log(`- [${t.id}] ${t.name} (Category: ${t.category})`);
        console.log(`  Tags: ${t.tags.join(", ")}`);
        console.log(`  Description: ${t.description}`);
      }
    } else if (sub === "apply") {
      const tplId = process.argv[4];
      if (!tplId) {
        console.error("Usage: opencode-cron template apply <templateId> [--id customId] [--title customTitle] [--dir <dir>]");
        process.exit(2);
      }
      const customId = arg("--id");
      const customTitle = arg("--title");
      const job = await applyJobTemplate(dir, tplId, { id: customId, title: customTitle });
      console.log(`Job '${job.id}' created successfully from template '${tplId}'!`);
      console.log(`Next run scheduled at: ${job.nextRunAt}`);
    } else {
      console.error(`Unknown template command: ${sub}. Use 'list' or 'apply <templateId>'`);
      process.exit(2);
    }
  } else if (cmd === "backup") {
    const { createBackup, listBackups, restoreBackup, deleteBackup } = await import("../src/backup.ts");
    const sub = process.argv[3];
    if (!sub || sub === "list") {
      const list = await listBackups(dir);
      console.log(`=== Snapshots & Backups (${list.length}) ===`);
      if (list.length === 0) console.log("(No backups found)");
      else {
        for (const b of list) {
          console.log(`- [${b.id}] Date: ${b.createdAt} | Jobs: ${b.jobCount} | Size: ${b.byteSize} bytes`);
          if (b.note) console.log(`  Note: ${b.note}`);
        }
      }
    } else if (sub === "create") {
      const note = arg("--note");
      const res = await createBackup(dir, note);
      console.log(`Snapshot created: ${res.id} (Jobs: ${res.jobCount}, Size: ${res.byteSize} bytes)`);
    } else if (sub === "restore") {
      const id = process.argv[4];
      if (!id) {
        console.error("Usage: opencode-cron backup restore <backupId> [--dir <dir>]");
        process.exit(2);
      }
      const res = await restoreBackup(dir, id);
      console.log(`Successfully restored backup '${id}': ${res.restoredJobs} jobs, ${res.restoredMemoryFiles} memory files.`);
    } else if (sub === "delete") {
      const id = process.argv[4];
      if (!id) {
        console.error("Usage: opencode-cron backup delete <backupId> [--dir <dir>]");
        process.exit(2);
      }
      const ok = await deleteBackup(dir, id);
      console.log(ok ? `Deleted backup '${id}'.` : `Backup '${id}' not found.`);
    } else {
      console.error(`Unknown backup command: ${sub}. Use list, create, restore <id>, delete <id>.`);
      process.exit(2);
    }
  } else if (cmd === "history") {
    const { pruneRunHistory, loadRunHistory } = await import("../src/history.ts");
    const sub = process.argv[3];
    if (sub === "prune") {
      const daysArg = arg("--days");
      const maxPerJobArg = arg("--max-per-job");
      const days = daysArg ? parseInt(daysArg, 10) : 30;
      const maxPerJob = maxPerJobArg ? parseInt(maxPerJobArg, 10) : 200;
      const res = await pruneRunHistory(dir, { maxAgeDays: days, maxRunsPerJob: maxPerJob });
      console.log(`History pruned: before=${res.beforeCount}, after=${res.afterCount}, removed=${res.prunedCount} runs.`);
    } else {
      const runs = await loadRunHistory(dir);
      console.log(`=== History (${runs.length} runs recorded) ===`);
      for (const r of runs.slice(0, 20)) {
        console.log(`- [${r.status.toUpperCase()}] ${r.jobId} (${r.jobTitle}) at ${r.startedAt} (${r.durationMs}ms)`);
      }
    }
  } else if (cmd === "metrics") {
    const { getSystemMetrics, generatePrometheusMetrics } = await import("../src/metrics.ts");
    const jobs = await loadJobs(dir);
    if (has("--prom")) {
      console.log(generatePrometheusMetrics(jobs));
    } else {
      console.log(JSON.stringify(getSystemMetrics(jobs), null, 2));
    }
  } else if (cmd === "notify") {
    const { loadNotificationConfig, sendTestNotification } = await import("../src/notifications.ts");
    const sub = process.argv[3];
    if (sub === "test") {
      const channelId = process.argv[4];
      const cfg = await loadNotificationConfig(dir);
      const target = cfg.channels.find((c) => c.id === channelId) || cfg.channels[0];
      if (!target) {
        console.error("No notification channels configured.");
        process.exit(1);
      }
      console.log(`Sending test notification to channel '${target.name}' (${target.url})...`);
      const res = await sendTestNotification(target);
      console.log(res.ok ? "Test notification delivered successfully!" : `Failed: ${res.error || res.status}`);
    } else {
      const cfg = await loadNotificationConfig(dir);
      console.log(JSON.stringify(cfg, null, 2));
    }
  } else if (cmd === "preview") {
    const { previewSchedule } = await import("../src/schedule.ts");
    const expr = process.argv[3];
    if (!expr) {
      console.error("Usage: opencode-cron preview <expression> [--n N] [--tz timezone]");
      process.exit(1);
    }
    const nArg = arg("--n");
    const tzArg = arg("--tz");
    const res = previewSchedule(expr, {
      n: nArg ? parseInt(nArg, 10) : 10,
      timezone: tzArg,
    });
    if (!res.ok) {
      console.error(`Preview error: ${res.error}`);
      process.exit(1);
    }
    console.log(`Expression: ${res.expression} (${res.kind})`);
    console.log(`Description: ${res.humanDescription}`);
    console.log(`Total runs in next 7 days: ${res.totalIn7Days}`);
    console.log(`\nUpcoming ${res.nextRuns.length} runs:`);
    for (let i = 0; i < res.nextRuns.length; i++) {
      const r = res.nextRuns[i];
      console.log(`  [${i + 1}] ${r.iso} | Local: ${r.local}`);
    }
  } else {
    console.error(`Commands: check [--concurrency N] | run <id> | os-install | refresh-creds | list | gui | desktop | tray | preview <expr> [--n N] [--tz TZ] | webhook-token <id> | concurrency [N] | priority <id> [level] | queue | dlq [retry|clear|resolve] | circuit <id> [reset|trip|half-open] | template [list|apply] | backup [list|create|restore] | history [prune] | metrics [--prom] | notify [test] [--dir ...]`);
    process.exit(2);
  }
}

if (has("--help") || has("-h")) {
  console.log("opencode-cron check [--concurrency N] | run <id> | os-install | refresh-creds | list | gui | desktop | tray | preview <expr> [--n N] [--tz TZ] | webhook-token <id> | concurrency [N] | priority <id> [level] | queue | dlq [retry|clear|resolve] | circuit <id> [reset|trip|half-open] | template [list|apply] | backup [list|create|restore] | history [prune] | metrics [--prom] | notify [test] [--dir ...]");
  process.exit(0);
}
await main();
