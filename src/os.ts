export type OSType = "macos" | "linux" | "windows" | "unknown";

export function detectOS(platform: string = process.platform): OSType {
  if (platform === "darwin") return "macos";
  if (platform === "linux") return "linux";
  if (platform === "win32") return "windows";
  return "unknown";
}

export function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function shQuote(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

export function assertLabel(label: string): void {
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(label)) throw new Error(`Invalid label "${label}"`);
}

export function launchdPlist(opts: { label: string; runnerPath: string; directory: string; intervalSec: number }): string {
  assertLabel(opts.label);
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "/tmp";
  const logBase = `${home}/Library/Logs/opencode-cron`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>\n  <key>Label</key><string>${xmlEscape(opts.label)}</string>\n  <key>ProgramArguments</key><array><string>${xmlEscape(opts.runnerPath)}</string><string>check</string><string>--dir</string><string>${xmlEscape(opts.directory)}</string></array>\n  <key>StartInterval</key><integer>${opts.intervalSec}</integer>\n  <key>RunAtLoad</key><false/>\n  <key>StandardOutPath</key><string>${xmlEscape(logBase)}.log</string>\n  <key>StandardErrorPath</key><string>${xmlEscape(logBase)}.err</string>\n</dict></plist>\n`;
}

export function systemdService(opts: { runnerPath: string; directory: string }): string {
  return `[Unit]\nDescription=opencode-cron tick\n[Service]\nType=oneshot\nExecStart=${opts.runnerPath} check --dir ${shQuote(opts.directory)}\n`;
}

export function systemdTimer(opts: { intervalSec: number }): string {
  return `[Unit]\nDescription=opencode-cron timer\n[Timer]\nOnBootSec=1min\nOnUnitActiveSec=${opts.intervalSec}\n[Install]\nWantedBy=timers.target\n`;
}

export function crontabLine(opts: { runnerPath: string; directory: string }): string {
  return `* * * * * ${shQuote(opts.runnerPath)} check --dir ${shQuote(opts.directory)} >> ${shQuote(`${process.env.HOME ?? "/tmp"}/.opencode-cron.log`)} 2>&1`;
}

export function schtasksCommand(opts: { taskName: string; runnerPath: string; directory: string }): string {
  return `schtasks /Create /TN "${opts.taskName}" /TR "\\"${opts.runnerPath}\\" check --dir \\"${opts.directory}\\"" /SC MINUTE /MO 1 /F`;
}
