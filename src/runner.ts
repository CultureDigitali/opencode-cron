import * as fs from "node:fs/promises";
import * as path from "node:path";
import { spawn } from "node:child_process";
import { loadJobs, saveJobs, computeNextRun, assertJobId } from "./store.ts";
import { readMemory, buildTickPrompt } from "./memory.ts";

export async function acquireLock(directory: string, jobId: string): Promise<boolean> {
  assertJobId(jobId);
  const lockDir = path.join(directory, ".opencode", "cron", "locks");
  await fs.mkdir(lockDir, { recursive: true });
  const lock = path.join(lockDir, `${jobId}.lock`);
  try {
    await fs.writeFile(lock, `${process.pid} ${new Date().toISOString()}`, { flag: "wx", encoding: "utf-8" });
    return true;
  } catch (e: any) {
    if (e?.code !== "EEXIST") return false;
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

export async function releaseLock(directory: string, jobId: string): Promise<void> {
  try {
    await fs.unlink(path.join(directory, ".opencode", "cron", "locks", `${jobId}.lock`));
  } catch { /* ignore */ }
}

export type SpawnFn = (cmd: string, args: string[], cwd: string) => Promise<number>;

export interface HttpPromptConfig {
  url: string;
  username: string;
  password: string;
}

/** HTTP prompt-admission transport (for sessions served by a remote opencode
 * server, e.g. the desktop app's sidecar, which `opencode run` cannot reach).
 * Enabled with OPENCODE_PROMPT_HTTP=1 plus OPENCODE_SERVER_URL/USERNAME/PASSWORD. */
export function readHttpPromptConfig(env: NodeJS.ProcessEnv = process.env): HttpPromptConfig | null {
  if (env.OPENCODE_PROMPT_HTTP !== "1") return null;
  const url = env.OPENCODE_SERVER_URL;
  const username = env.OPENCODE_SERVER_USERNAME;
  const password = env.OPENCODE_SERVER_PASSWORD;
  if (!url || !username || !password) return null;
  return { url: url.replace(/\/+$/, ""), username, password };
}

export async function promptViaHttp(cfg: HttpPromptConfig, sessionID: string, text: string, fetchFn: typeof fetch = fetch): Promise<void> {
  const auth = "Basic " + btoa(cfg.username + ":" + cfg.password);
  const res = await fetchFn(`${cfg.url}/api/session/${encodeURIComponent(sessionID)}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth },
    body: JSON.stringify({ prompt: { text } }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP prompt failed (${res.status}): ${body.slice(0, 200)}`);
  }
}

/** Resolve the opencode binary to an absolute path.
 * launchd/cron run with a minimal PATH, so a bare "opencode" dies with
 * ENOENT there even though it works in interactive shells. */
export async function resolveOpencodeBin(): Promise<string> {
  if (process.env.OPENCODE_BIN) return process.env.OPENCODE_BIN;
  const pathEnv = process.env.PATH ?? "";
  const dirs = [...pathEnv.split(":"), "/opt/homebrew/bin", "/usr/local/bin", `${process.env.HOME ?? ""}/bin`];
  for (const d of dirs) {
    if (!d) continue;
    const cand = path.join(d, "opencode");
    try {
      await fs.access(cand, fs.constants.X_OK);
      return cand;
    } catch { /* next */ }
  }
  return "opencode";
}

export const defaultSpawn: SpawnFn = (cmd, args, cwd) =>
  new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "inherit", cwd });
    child.on("close", (c) => resolve(c ?? 1));
    child.on("error", (e) => {
      console.error(`spawn ${cmd} failed: ${(e as Error).message}`);
      resolve(1);
    });
  });

export function tickArgs(job: { sessionID: string; agent?: string; model?: string }, prompt: string): string[] {
  // NOTE: `opencode run` has no --dir flag (v2) — cwd carries the directory.
  const args = ["run", "--session", job.sessionID];
  // Sessions can live in a different opencode server instance (e.g. the
  // desktop app's service, not the CLI's background service). Point the
  // runner at it when configured; credentials come from the environment.
  if (process.env.OPENCODE_SERVER_URL) args.push("--server", process.env.OPENCODE_SERVER_URL);
  if (job.agent) args.push("--agent", job.agent);
  if (job.model) args.push("--model", job.model);
  args.push(prompt);
  return args;
}

export async function runJobHeadless(
  directory: string,
  jobId: string,
  spawnFn: SpawnFn = defaultSpawn
): Promise<number> {
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
    const cwd = job.directory || directory;
    const httpCfg = readHttpPromptConfig();
    let code: number;
    if (httpCfg) {
      console.log(`http prompt -> ${httpCfg.url} session=${job.sessionID} (cwd=${cwd})`);
      try {
        await promptViaHttp(httpCfg, job.sessionID, prompt);
        code = 0;
      } catch (e: any) {
        console.error(String(e?.message ?? e));
        code = 1;
      }
    } else {
      const args = tickArgs(job, prompt);
      const bin = await resolveOpencodeBin();
      console.log(`opencode ${args.slice(0, 6).join(" ")} ... (cwd=${cwd})`);
      code = await spawnFn(bin, args, cwd);
    }
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

/** Run all due jobs. Returns the ids that were executed. */
export async function checkDue(directory: string, spawnFn: SpawnFn = defaultSpawn): Promise<string[]> {
  const jobs = await loadJobs(directory);
  const now = Date.now();
  const ran: string[] = [];
  for (const j of jobs) {
    if (!j.enabled) continue;
    // Authoritative skip checks also live in runJobHeadless; this keeps
    // the returned list to jobs actually executed.
    if (j.maxRuns > 0 && j.runCount >= j.maxRuns) continue;
    const due = !j.nextRunAt || new Date(j.nextRunAt).getTime() <= now;
    if (due) {
      await runJobHeadless(directory, j.id, spawnFn);
      ran.push(j.id);
    } else {
      console.log(`not due ${j.id} next=${j.nextRunAt}`);
    }
  }
  return ran;
}
