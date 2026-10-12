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
  if (cmd === "check") await checkDue(dir);
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
  } else {
    console.error(`Commands: check | run <id> | os-install | refresh-creds | list | gui | desktop | tray [--port <port>] [--dir ...]`);
    process.exit(2);
  }
}

if (has("--help") || has("-h")) {
  console.log("opencode-cron check|run <id>|os-install|refresh-creds|list|gui|desktop|tray [--port <port>] [--dir ...]");
  process.exit(0);
}
await main();
