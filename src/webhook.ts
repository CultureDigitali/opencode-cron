import * as crypto from "node:crypto";
import { CronJob } from "./types.ts";
import { loadJobs, saveJobs, assertJobId } from "./store.ts";
import { readMemory, writeMemory } from "./memory.ts";
import { runJobHeadless } from "./runner.ts";

/**
 * Generate a cryptographically secure URL-safe webhook authorization token.
 */
export function generateWebhookToken(): string {
  return "whk_" + crypto.randomBytes(20).toString("hex");
}

/**
 * Perform a constant-time string comparison to prevent timing attacks.
 * Pre-hashes both inputs with SHA-256 so buffers are always identical length (32 bytes),
 * eliminating any length-dependent timing side-channel leaks.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    if (typeof a !== "string" || typeof b !== "string") return false;
    const hashA = crypto.createHash("sha256").update(a).digest();
    const hashB = crypto.createHash("sha256").update(b).digest();
    return crypto.timingSafeEqual(hashA, hashB) && a.length === b.length;
  } catch {
    return false;
  }
}

/**
 * Verify GitHub HMAC SHA-256 signature from X-Hub-Signature-256 header.
 */
export function verifyGitHubSignature(payload: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const signature = signatureHeader.slice(7);
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    return timingSafeCompare(digest, signature);
  } catch {
    return false;
  }
}

export interface WebhookAuthResult {
  ok: boolean;
  status?: number;
  error?: string;
}

/**
 * Verify inbound webhook authentication and rate limits against a target job.
 * Note: Authentication MUST be verified BEFORE checking rate-limit cooldown
 * to prevent pre-authentication timing/state oracles (CWE-209 / CWE-200).
 */
export function verifyWebhookAuth(opts: {
  job: CronJob;
  token?: string | null;
  signature?: string | null;
  rawBody?: string;
  nowMs?: number;
}): WebhookAuthResult {
  const { job, token, signature, rawBody, nowMs } = opts;

  if (!job.webhook || !job.webhook.enabled) {
    return { ok: false, status: 403, error: "Webhooks are disabled for this job" };
  }

  // 1. Authenticate first (HMAC signature or Token)
  let isAuthenticated = false;

  // Check HMAC signature if secret and signature header are provided
  if (job.webhook.secret && signature) {
    const validSig = verifyGitHubSignature(rawBody || "", signature, job.webhook.secret);
    if (!validSig) {
      return { ok: false, status: 403, error: "Invalid HMAC SHA-256 signature" };
    }
    isAuthenticated = true;
  }

  // Check token if not authenticated via HMAC
  if (!isAuthenticated && job.webhook.token) {
    if (!token) {
      return { ok: false, status: 401, error: "Missing authorization token" };
    }
    if (!timingSafeCompare(job.webhook.token, token)) {
      return { ok: false, status: 403, error: "Invalid webhook token" };
    }
    isAuthenticated = true;
  }

  if (!isAuthenticated) {
    return { ok: false, status: 401, error: "Missing webhook authorization credentials" };
  }

  // 2. Evaluate rate limiting / debounce cooldown ONLY after authentication succeeds
  const currentNow = typeof nowMs === "number" ? nowMs : Date.now();
  if (job.webhook.lastTriggeredAt && job.webhook.rateLimitSeconds > 0) {
    const elapsedMs = currentNow - new Date(job.webhook.lastTriggeredAt).getTime();
    const limitMs = job.webhook.rateLimitSeconds * 1000;
    if (elapsedMs < limitMs) {
      const waitSeconds = Math.ceil((limitMs - elapsedMs) / 1000);
      return {
        ok: false,
        status: 429,
        error: `Rate limit cooldown active. Please wait ${waitSeconds}s before triggering again.`,
      };
    }
  }

  return { ok: true };
}

/**
 * Sanitize external strings to prevent markdown delimiter injection in agent memory.
 */
function sanitizePayloadString(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/---/g, " - ")
    .replace(/\[WEBHOOK TRIGGER\]/gi, "(WEBHOOK TRIGGER)")
    .replace(/<!--/g, "<! - -")
    .replace(/-->/g, "- - >");
}

/**
 * Format incoming webhook payload and headers into a concise markdown summary for agent memory.
 */
export function formatWebhookSummary(opts: {
  event?: string | null;
  source?: string;
  body?: any;
}): string {
  const { event, source, body } = opts;
  const time = new Date().toISOString();
  const safeEvent = sanitizePayloadString(String(event ?? "generic").replace(/[\r\n`]/g, "").trim().slice(0, 64)) || "generic";
  const safeSource = sanitizePayloadString(String(source ?? "external").replace(/[\r\n`*]/g, "").trim().slice(0, 64)) || "external";
  let details = "";

  if (body && typeof body === "object") {
    // GitHub push event
    if (body.commits && Array.isArray(body.commits)) {
      const commits = body.commits.slice(0, 3).map((c: any) => {
        const sha = sanitizePayloadString(c.id?.slice(0, 7) ?? "sha");
        const msg = sanitizePayloadString(c.message?.split("\n")[0] ?? "");
        return `- \`${sha}\`: ${msg}`;
      }).join("\n");
      const sender = sanitizePayloadString(body.sender?.login ?? body.pusher?.name ?? "");
      const repo = sanitizePayloadString(body.repository?.full_name ?? "unknown");
      const branch = sanitizePayloadString(body.ref?.replace("refs/heads/", "") ?? "HEAD");
      details = `Repository: **${repo}**\nBranch: \`${branch}\`\n${sender ? `Sender: **${sender}**\n` : ""}Commits:\n${commits}\n`;
    }
    // GitHub issue or PR event
    else if (body.issue || body.pull_request) {
      const item = body.issue ?? body.pull_request;
      const action = sanitizePayloadString(body.action ?? "event");
      const title = sanitizePayloadString(item.title ?? "");
      const num = sanitizePayloadString(String(item.number ?? ""));
      const url = sanitizePayloadString(item.html_url ?? "");
      details = `Action: **${action}**\nTitle: "${title}"\nNumber: #${num}\nURL: ${url}\n`;
    }
    // Generic JSON body
    else {
      const jsonStr = sanitizePayloadString(JSON.stringify(body, null, 2));
      details = jsonStr.length > 800 ? jsonStr.slice(0, 800) + "\n... (truncated)" : jsonStr;
      details = `\`\`\`json\n${details}\n\`\`\`\n`;
    }
  } else if (typeof body === "string" && body.trim().length > 0) {
    details = sanitizePayloadString(body.slice(0, 600) + (body.length > 600 ? "..." : ""));
  }

  return (
    `\n\n---\n### [WEBHOOK TRIGGER] Inbound Event: \`${safeEvent}\`\n` +
    `Source: **${safeSource}** | Timestamp: ${time}\n` +
    (details ? `Payload:\n${details}\n` : "")
  );
}

/**
 * Process inbound webhook trigger:
 * 1. Validates job exists and is enabled
 * 2. Writes bounded payload summary into job's persistent memory
 * 3. Updates lastTriggeredAt timestamp
 * 4. Dispatches the tick execution
 */
export async function triggerWebhookJob(opts: {
  directory: string;
  jobId: string;
  summary?: string;
  executeFn?: (jobId: string) => Promise<unknown>;
  asyncDispatch?: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  const { directory, jobId, summary, executeFn, asyncDispatch } = opts;
  assertJobId(jobId);

  const jobs = await loadJobs(directory);
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return { ok: false, error: "Job not found" };
  if (!job.enabled) return { ok: false, error: "Job is currently disabled or paused" };

  // Update lastTriggeredAt
  if (job.webhook) {
    job.webhook.lastTriggeredAt = new Date().toISOString();
    await saveJobs(directory, jobs);
  }

  // Inject summary into persistent memory if passPayload is enabled
  if (summary && job.webhook?.passPayload !== false) {
    try {
      const { md, state } = await readMemory(directory, jobId);
      // Prune prior webhook trigger blocks
      const cleanedMd = (md || "")
        .replace(/\n*<!-- WEBHOOK_START -->[\s\S]*?<!-- WEBHOOK_END -->\n*/g, "")
        .replace(/\n*---\n### \[WEBHOOK TRIGGER\][\s\S]*?(?=\n*---\n### \[WEBHOOK TRIGGER\]|$)/g, "")
        .trim();
      const wrappedSummary = `\n\n<!-- WEBHOOK_START -->\n${summary.trim()}\n<!-- WEBHOOK_END -->`;
      const mergedMd = (cleanedMd + wrappedSummary).slice(-28_000);
      await writeMemory(directory, jobId, mergedMd, state);
    } catch (err: any) {
      console.warn(`[Webhook] Failed to pass memory payload to ${jobId}: ${err.message}`);
    }
  }

  const runTask = async () => {
    try {
      if (executeFn) {
        await executeFn(jobId);
      } else {
        await runJobHeadless(directory, jobId);
      }
    } catch (err: any) {
      console.error(`[Webhook] Async execution error for ${jobId}: ${err.message}`);
    }
  };

  // If async dispatch requested (default for external webhooks to avoid HTTP provider timeouts)
  if (asyncDispatch) {
    Promise.resolve().then(runTask);
    return { ok: true };
  }

  // Synchronous execution fallback (e.g. for deterministic unit tests)
  try {
    if (executeFn) {
      await executeFn(jobId);
    } else {
      await runJobHeadless(directory, jobId);
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: `Execution error: ${err.message}` };
  }
}
