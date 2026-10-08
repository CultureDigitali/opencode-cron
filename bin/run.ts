#!/usr/bin/env node
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { spawn } from "node:child_process";
import { loadJobs, saveJobs, computeNextRun, assertJobId } from "../src/store.ts";
import { readMemory, buildTickPrompt } from "../src/memory.ts";
import { detectOS, launchdPlist, systemdService, systemdTimer, crontabLine, schtasksCommand } from "../src/os.ts";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function has(flag: string): boolean {
  return process.argv.includes(flag);
}

async function acquireLock(directory: string, jobId: string): Promise<boolean> {
  assertJobId(jobId);
  const lockDir = path.join(directory, ".opencode", "cron", "locks");
  await fs.mkdir(lockDir, { recursive: true });
  const lock = path.join(lockDir, `${jobId}.lock`);
  try {
    await fs.writeFile(lock, `${process.pid} ${new Date().toISOString()}`, { flag: "wx", encoding: "utf-8" });
    return true;
  } catch (e: any) {
    if (e?.code !== "EEXIST") return false;
    // Lock exists: steal only if stale (>10min)
    try {
      const st = await fs.stat(lock);
      if (Date.now() - st.mtimeMs < 10 * 60_000) return false;
      await fs.unlink(lock);
      await fs.writeFile(lock, `${process.pid} ${new Date().toISOString()}`, { flag: "wx", encoding: "utf-8" });
      return true;
    } catch {
      return false;
    }
  }
}

async function releaseLock(directory: string, jobId: string): Promise<void> {
  try {
    await fs.unlink(path.join(directory, ".opencode", "cron", "locks", `${jobId}.lock`));
  } catch { /* ignore */ }
}

async function runJobHeadless(directory: string, jobId: string): Promise<number> {
  assertJobId(jobId);
  const jobs = await loadJobs(directory);
  const job = jobs.find((j) => j.id === jobId);
  if (!job || !job.enabled) {
    console.log(`skip ${jobId}: not found/disabled`);
    return 0;
  }
  if (job.maxRuns > 0 && job.runCount >= job.maxRuns) {
    console.log(`skip ${jobId}: max-runs reached`);
    return 0;
  }
  if (!(await acquireLock(directory, jobId))) {
    console.log(`skip ${jobId}: locked (already running)`);
    return 0;
  }
  try {
    const { md } = await readMemory(directory, jobId);
    const prompt = buildTickPrompt({ systemPrompt: job.systemPrompt, followupPrompt: job.followupPrompt, memoryMd: md });
    // NOTE: `opencode run` has no --dir flag (v2.0.10) — run with cwd set to the job directory instead.
    const cwd = job.directory || directory;
    const args = ["run", "--session", job.sessionID];
    if (job.agent) args.push("--agent", job.agent);
    if (job.model) args.push("--model", job.model);
    args.push(prompt);
    console.log(`opencode ${args.slice(0, 6).join(" ")} ... (cwd=${cwd})`);
    const code: number = await new Promise((resolve) => {
      const child = spawn("opencode", args, { stdio: "inherit", cwd });
      child.on("close", (c) => resolve(c ?? 1));
      child.on("error", (e) => {
        console.error(`spawn opencode failed: ${e.message}`);
        resolve(1);
      });
    });
    const now = new Date().toISOString();
    if (code === 0) {
      job.runCount += 1;
      job.consecutiveFailures = 0;
      job.lastRunAt = now;
    } else {
      job.consecutiveFailures += 1;
      if (job.consecutiveFailures >= job.maxConsecutiveFailures) {
        job.enabled = false;
        console.log(`auto-paused ${jobId} after ${job.consecutiveFailures} failures`);
      }
    }
    job.nextRunAt = computeNextRun(job, new Date());
    await saveJobs(directory, jobs.map((j) => (j.id === job.id ? job : j)));
    return code;
  } finally {
    await releaseLock(directory, jobId);
  }
}

async function checkDue(directory: string): Promise<void> {
  const jobs = await loadJobs(directory);
  const now = Date.now();
  for (const j of jobs) {
    if (!j.enabled) continue;
    const due = !j.nextRunAt || new Date(j.nextRunAt).getTime() <= now;
    if (due) await runJobHeadless(directory, j.id);
    else console.log(`not due ${j.id} next=${j.nextRunAt}`);
  }
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
    console.log(`Plist scritto in ${dest}\nAttiva con: launchctl load ${dest}`);
  } else if (os === "linux") {
    console.log("--- systemd service (opencode-cron.service) ---\n" + systemdService({ runnerPath: runner, directory }));
    console.log("--- systemd timer (opencode-cron.timer, 60s) ---\n" + systemdTimer({ intervalSec: 60 }));
    console.log("Installa in ~/.config/systemd/user/ poi: systemctl --user daemon-reload && systemctl --user enable --now opencode-cron.timer");
    console.log("Fallback crontab:\n" + crontabLine({ runnerPath: runner, directory }));
  } else if (os === "windows") {
    console.log("Esegui in PowerShell admin:\n" + schtasksCommand({ taskName: "opencode-cron", runnerPath: runner, directory }));
  } else {
    console.log("OS sconosciuto. Usa cron manuale:\n" + crontabLine({ runnerPath: runner, directory }));
  }
}

async function main(): Promise<void> {
  const cmd = process.argv[2] || "check";
  const dir = arg("--dir") ?? process.cwd();
  if (cmd === "check") await checkDue(dir);
  else if (cmd === "run") {
    const id = process.argv[3];
    if (!id || id.startsWith("--")) {
      console.error("Uso: opencode-cron-run run <jobId> --dir <dir>");
      process.exit(2);
    }
    process.exit(await runJobHeadless(dir, id));
  } else if (cmd === "os-install") await osInstall(dir);
  else if (cmd === "list") console.log(JSON.stringify(await loadJobs(dir), null, 2));
  else {
    console.error(`Comandi: check | run <id> | os-install | list [--dir ...]`);
    process.exit(2);
  }
}

if (has("--help") || has("-h")) {
  console.log("opencode-cron-run check|run <id>|os-install|list [--dir ...]");
  process.exit(0);
}
await main();
