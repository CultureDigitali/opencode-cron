import { loadJobs, computeNextRun, saveJobs } from "./store.ts";
import { readMemory, buildTickPrompt } from "./memory.ts";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export type OpencodeClientLike = {
  session?: {
    prompt?: (args: any) => Promise<any>;
    status?: (args?: any) => Promise<any>;
  };
  tui?: {
    showToast?: (args: any) => Promise<any>;
  };
  app?: {
    log?: (args: any) => Promise<any>;
  };
};

async function isSessionBusy(client: OpencodeClientLike, sessionID: string): Promise<boolean> {
  try {
    const status: any = await (client.session?.status as any)?.();
    if (!status) return false;
    const data = status.data ?? status;
    const s = data?.[sessionID] ?? data?.sessions?.[sessionID];
    if (!s) return false;
    const v = (s.status ?? s.state ?? "").toString().toLowerCase();
    return v === "busy" || v === "running" || v === "working";
  } catch {
    return false;
  }
}

export async function executeTick(
  directory: string,
  jobId: string,
  client: OpencodeClientLike
): Promise<{ ok: boolean; skipped?: string }> {
  const { assertJobId } = await import("./store.ts");
  assertJobId(jobId);
  const jobs = await loadJobs(directory);
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return { ok: false, skipped: "job-not-found" };
  if (!job.enabled) return { ok: false, skipped: "disabled" };
  if (job.maxRuns > 0 && job.runCount >= job.maxRuns) return { ok: false, skipped: "max-runs" };

  if (job.skipIfRunning && (await isSessionBusy(client, job.sessionID))) {
    await appendRunLog(directory, jobId, `SKIP busy at ${new Date().toISOString()}\n`);
    return { ok: false, skipped: "busy" };
  }

  const { md } = await readMemory(directory, jobId);
  const text = buildTickPrompt({
    systemPrompt: job.systemPrompt,
    followupPrompt: job.followupPrompt,
    memoryMd: md,
  });

  try {
    await client.session?.prompt?.({
      path: { id: job.sessionID },
      body: {
        agent: job.agent,
        model: job.model ? parseModel(job.model) : undefined,
        parts: [{ type: "text", text }],
      },
    });
    const now = new Date().toISOString();
    job.runCount += 1;
    job.consecutiveFailures = 0;
    job.lastRunAt = now;
    job.nextRunAt = computeNextRun(job, new Date());
    await saveJobs(directory, jobs.map((j) => (j.id === job.id ? job : j)));
    await appendRunLog(directory, jobId, `OK run #${job.runCount} at ${now}\n`);
    await client.tui?.showToast?.({ body: { message: `cron ${job.id}: tick #${job.runCount} done`, variant: "success" } }).catch(() => {});
    await client.app?.log?.({ body: { service: "opencode-cron", level: "info", message: `tick ok ${job.id}` } }).catch(() => {});
    return { ok: true };
  } catch (err: any) {
    job.consecutiveFailures += 1;
    if (job.consecutiveFailures >= job.maxConsecutiveFailures) job.enabled = false;
    await saveJobs(directory, jobs.map((j) => (j.id === job.id ? job : j)));
    await appendRunLog(directory, jobId, `ERR at ${new Date().toISOString()}: ${err?.message ?? err}\n`);
    return { ok: false, skipped: "error" };
  }
}

function parseModel(m: string): { providerID: string; modelID: string } | undefined {
  const i = m.indexOf("/");
  if (i < 0) return undefined;
  return { providerID: m.slice(0, i), modelID: m.slice(i + 1) };
}

export async function appendRunLog(directory: string, jobId: string, line: string): Promise<void> {
  const { assertJobId } = await import("./store.ts");
  assertJobId(jobId);
  const p = path.join(directory, ".opencode", "cron", "runs", `${jobId}.log`);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.appendFile(p, line, "utf-8");
}
