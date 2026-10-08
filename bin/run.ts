#!/usr/bin/env node
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { loadJobs } from "../src/store.ts";
import { runJobHeadless, checkDue } from "../src/runner.ts";
import { detectOS, launchdPlist, systemdService, systemdTimer, crontabLine, schtasksCommand } from "../src/os.ts";

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
  else if (cmd === "list") console.log(JSON.stringify(await loadJobs(dir), null, 2));
  else {
    console.error(`Commands: check | run <id> | os-install | list [--dir ...]`);
    process.exit(2);
  }
}

if (has("--help") || has("-h")) {
  console.log("opencode-cron-run check|run <id>|os-install|list [--dir ...]");
  process.exit(0);
}
await main();
