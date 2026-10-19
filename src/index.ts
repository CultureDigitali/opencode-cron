import { Plugin } from "@opencode/plugin";
import { CronJobSchema, JobPrioritySchema } from "./types.ts";
import { loadJobs, saveJobs, upsertJob, removeJob, ensureCronDir, computeNextRun, assertJobId, filterJobs } from "./store.ts";
import { normalizeSchedule, parseEveryToMs, previewSchedule } from "./schedule.ts";
import { initialMemoryMd, readMemory, writeMemory } from "./memory.ts";
import { CronScheduler } from "./scheduler.ts";
import { executeTick } from "./executor.ts";
import { validatePipelineDAG, getPipelineGraph } from "./pipeline.ts";
import { generateWebhookToken } from "./webhook.ts";
import { loadCronSettings, getActiveLocks } from "./concurrency.ts";
import { loadDLQ, resolveDLQEntry, clearDLQ, resetCircuitBreaker, setHalfOpen } from "./dlq.ts";
import { listJobTemplates, applyJobTemplate } from "./templates.ts";
import { createBackup, listBackups, restoreBackup } from "./backup.ts";
import { getSystemMetrics } from "./metrics.ts";

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "job";
}

const strProp = (description: string) => ({ type: "string", description }) as const;
const optStrProp = (description: string) => ({ type: "string", description }) as const;
const idProp = { type: "string", description: "Cron job id", pattern: "^[a-z0-9-]{1,64}$" } as const;

// NOTE: tools live under the "cron" namespace, so their effective ids are
// cron_add, cron_list, ... - the namespace is required for Code Mode routing.
const NS = "cron";

export const CronPlugin = Plugin.define({
  id: "opencode-cron",
  async setup(ctx) {
    const schedulers = new Map<string, CronScheduler>();
    const inFlight = new Set<string>();

    const promptSession = async (sessionID: string, text: string): Promise<void> => {
      await ctx.session.prompt({ sessionID: sessionID as never, text } as never);
    };

    const getScheduler = (dir: string): CronScheduler => {
      let s = schedulers.get(dir);
      if (!s) {
        s = new CronScheduler({ promptSession, inFlight });
        s.start(dir).catch(() => {});
        schedulers.set(dir, s);
      }
      return s;
    };

    const sessionDir = async (sessionID: string): Promise<string> => {
      try {
        const s: any = await (ctx.session as any).get({ sessionID });
        const dir = s?.location?.directory ?? s?.data?.location?.directory;
        if (typeof dir === "string" && dir.length > 0) return dir;
      } catch { /* fall through */ }
      return ctx.location.directory;
    };

    const resync = async (dir: string): Promise<void> => {
      await getScheduler(dir).resync(dir).catch(() => {});
    };

    // Compact-safety: re-inject per-job memory into the compaction transcript.
    // Never break compaction - swallow all errors.
    await ctx.session.hook("compaction", async (event: any) => {
      try {
        const sessionID: string | undefined = event?.sessionID;
        if (!sessionID) return;
        const dir = await sessionDir(String(sessionID));
        const jobs = await loadJobs(dir);
        const mine = jobs.filter((j) => j.sessionID === String(sessionID) && j.enabled);
        for (const j of mine) {
          const { md } = await readMemory(dir, j.id);
          const text = md
            ? `## Cron Memory ${j.id} (persistent source of truth)\n${md.slice(0, 4000)}`
            : `## Cron ${j.id}: goal=${j.title}. Followup: ${j.followupPrompt.slice(0, 500)}`;
          if (Array.isArray(event?.messages)) {
            event.messages.push({
              role: "user",
              content: [{ type: "text", text }],
            } as never);
          }
        }
      } catch { /* never break compaction */ }
    });

    await ctx.tool.transform((editor: any) => {
      editor.namespace({ name: NS, description: "Scheduled tasks bound to the current session" });
      const add = (def: any) => editor.add({ ...def, options: { ...(def.options ?? {}), namespace: NS, codemode: true } });

      add({
        name: "add",
        description: "Create a ChatGPT-style scheduled task bound to the current chat. Use every like 5m or cron like */5 * * * *.",
        input: {
          type: "object",
          properties: {
            title: strProp("Short monitor title"),
            every: optStrProp("Interval like 5m, 1h (min 60s)"),
            cron: optStrProp("5-field cron expression"),
            systemPrompt: strProp("Frozen system prompt for this job"),
            followupPrompt: strProp("What to do on each tick"),
            agent: optStrProp("Agent id (used by headless runner)"),
            model: optStrProp("provider/model (used by headless runner)"),
            catchUp: { type: "boolean", description: "Fire missed ticks after downtime (default false: skip backlog)" } as const,
            burst: optStrProp("Adaptive burst interval (e.g. 1m, 2m, min 60s)"),
            idle: optStrProp("Adaptive idle interval when quiet (e.g. 30m, 1h)"),
            quietThreshold: { type: "number", description: "Quiet checks before backing off to idle (default 3)" },
            onSuccess: { type: "array", items: { type: "string" }, description: "Downstream job IDs to trigger when this job succeeds" },
            onFailure: { type: "array", items: { type: "string" }, description: "Downstream job IDs to trigger when this job fails" },
            passPayload: { type: "boolean", description: "Inject upstream memory execution context into downstream jobs" },
            priority: { type: "string", enum: ["high", "normal", "low"], description: "Execution priority (default normal)" },
            timezone: optStrProp("IANA timezone (e.g. Europe/Rome, America/New_York, UTC)"),
            tags: { type: "array", items: { type: "string" }, description: "Tags for categorization (e.g. ['prod', 'sync'])" },
            category: optStrProp("Category name (e.g. monitoring, sync, devops)"),
            timeoutMs: { type: "number", description: "Execution timeout in ms (min 5000)" },
            guardCommand: optStrProp("Pre-flight shell command check (exit 0 to proceed)"),
            guardHttpUrl: optStrProp("Pre-flight HTTP health check URL (status 200 to proceed)"),
          },
          required: ["title", "systemPrompt", "followupPrompt"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          const sessionID = String(tctx.sessionID);
          const dir = await sessionDir(sessionID);
          if (String(input.systemPrompt ?? "").length > 8000 || String(input.followupPrompt ?? "").length > 8000)
            throw new Error("Prompt too long (max 8000 chars each). Summarize instead.");
          const existing = await loadJobs(dir);
          if (existing.length >= 20) throw new Error("Too many jobs (max 20 per project). Remove one first.");
          const norm = normalizeSchedule({ every: input.every, cron: input.cron, timezone: input.timezone });
          const rand = Math.random().toString(36).slice(2, 8);
          const id = `${slug(String(input.title))}-${Date.now().toString(36)}-${rand}`;
          const now = new Date().toISOString();

          let adaptive: any = undefined;
          if (input.burst || input.idle || typeof input.quietThreshold === "number") {
            const burstMs = input.burst ? parseEveryToMs(String(input.burst)) : 60_000;
            const idleMs = input.idle ? parseEveryToMs(String(input.idle)) : 1_800_000;
            const quietThreshold = typeof input.quietThreshold === "number" && input.quietThreshold > 0
              ? Math.floor(input.quietThreshold)
              : 3;
            adaptive = {
              enabled: true,
              burstEveryMs: Math.max(60_000, burstMs),
              idleEveryMs: Math.max(60_000, idleMs),
              quietThreshold,
              consecutiveQuietTicks: 0,
              currentCadence: "normal",
              activeUntil: null,
            };
          }

          let pipeline: any = undefined;
          if (Array.isArray(input.onSuccess) || Array.isArray(input.onFailure) || input.passPayload === true) {
            pipeline = {
              enabled: true,
              onSuccess: Array.isArray(input.onSuccess) ? input.onSuccess.map(String) : [],
              onFailure: Array.isArray(input.onFailure) ? input.onFailure.map(String) : [],
              passPayload: input.passPayload === true,
              maxDepth: 5,
            };
          }

          let guard: any = undefined;
          if (input.guardCommand || input.guardHttpUrl) {
            guard = {
              enabled: true,
              command: input.guardCommand ? String(input.guardCommand) : undefined,
              httpUrl: input.guardHttpUrl ? String(input.guardHttpUrl) : undefined,
              expectedStatus: 200,
              timeoutMs: 5000,
            };
          }

          const tags = Array.isArray(input.tags)
            ? input.tags.map((t: any) => String(t).toLowerCase().trim()).slice(0, 10)
            : [];

          const job = CronJobSchema.parse({
            id, sessionID, directory: dir,
            title: input.title, systemPrompt: input.systemPrompt, followupPrompt: input.followupPrompt,
            schedule: { kind: norm.kind, everyMs: norm.everyMs, cron: norm.cron, timezone: norm.timezone },
            adaptive,
            pipeline,
            priority: input.priority ? JobPrioritySchema.parse(input.priority) : "normal",
            guard,
            tags,
            category: input.category ? String(input.category).trim() : undefined,
            timeoutMs: typeof input.timeoutMs === "number" && input.timeoutMs >= 5000 ? Math.floor(input.timeoutMs) : undefined,
            agent: input.agent, model: input.model,
            enabled: true, catchUp: input.catchUp === true, skipIfRunning: true,
            maxRuns: 0, maxConsecutiveFailures: 5, runCount: 0, consecutiveFailures: 0,
            createdAt: now, lastRunAt: null, nextRunAt: null,
          });

          // Validate pipeline DAG acyclic integrity across all jobs in project
          const allJobs = [...existing.filter((x) => x.id !== job.id), job];
          validatePipelineDAG(allJobs);

          job.nextRunAt = computeNextRun(job, new Date());
          await ensureCronDir(dir);
          await upsertJob(dir, job);
          await writeMemory(dir, id, initialMemoryMd({ title: String(input.title), systemPrompt: String(input.systemPrompt), followupPrompt: String(input.followupPrompt) }), {
            seenHashes: [], counts: { news: 0, tweets: 0 }, lastRunAt: null, consecutiveFailures: 0, hasActivity: false,
          });
          await resync(dir);
          const adaptiveMsg = adaptive ? ` [adaptive: burst ${Math.round(adaptive.burstEveryMs/1000)}s, idle ${Math.round(adaptive.idleEveryMs/1000)}s]` : "";
          const pipelineMsg = pipeline ? ` [pipeline: onSuccess=[${pipeline.onSuccess.join(",")}], onFailure=[${pipeline.onFailure.join(",")}]]` : "";
          const tzMsg = norm.timezone ? ` (tz: ${norm.timezone})` : "";
          return { content: `Cron created: ${id} every ${input.every ?? input.cron}${tzMsg}${adaptiveMsg}${pipelineMsg} bound to this session.\nFor persistence with TUI closed, run: npx @culturedigitali/opencode-cron os-install --dir "${dir}".\nMemory initialized at .opencode/cron/memory/${id}.md` };
        },
      });

      add({
        name: "list",
        description: "List active cron jobs in this project with optional tag, category, status, and text search filters",
        input: {
          type: "object",
          properties: {
            tag: optStrProp("Filter by tag"),
            category: optStrProp("Filter by category"),
            status: { type: "string", enum: ["enabled", "disabled", "quarantined"], description: "Filter by status" },
            search: optStrProp("Search text in title, id, category, or tags"),
          },
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          const dir = await sessionDir(String(tctx.sessionID));
          const allJobs = await loadJobs(dir);
          if (!allJobs.length) return { content: "No cron jobs. Use cron_add to create one." };
          const jobs = filterJobs(allJobs, input ?? {});
          if (!jobs.length) return { content: "No cron jobs match your criteria." };
          return {
            content: jobs.map((j) => {
              const tagStr = j.tags && j.tags.length ? ` [${j.tags.join(",")}]` : "";
              const catStr = j.category ? ` <${j.category}>` : "";
              return `- ${j.id}${catStr}${tagStr} | ${j.title} | enabled=${j.enabled} | everyMs=${j.schedule.everyMs ?? "-"} cron=${j.schedule.cron ?? "-"} | runs=${j.runCount} | next=${j.nextRunAt ?? "-"}`;
            }).join("\n"),
          };
        },
      });

      add({
        name: "get",
        description: "Show details of a cron job",
        input: { type: "object", properties: { id: idProp }, required: ["id"], additionalProperties: false },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          const jobs = await loadJobs(await sessionDir(String(tctx.sessionID)));
          const j = jobs.find((x) => x.id === String(input.id));
          return { content: j ? JSON.stringify(j, null, 2) : `Job ${input.id} not found` };
        },
      });

      const lifecycle = (
        name: string, description: string,
        fn: (dir: string, id: string) => Promise<string>,
      ) => add({
        name, description,
        input: { type: "object", properties: { id: idProp }, required: ["id"], additionalProperties: false },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          const dir = await sessionDir(String(tctx.sessionID));
          const out = await fn(dir, String(input.id));
          await resync(dir);
          return { content: out };
        },
      });

      lifecycle("pause", "Pause a cron job", async (dir, id) => {
        const jobs = await loadJobs(dir);
        const j = jobs.find((x) => x.id === id);
        if (!j) return "Not found";
        j.enabled = false;
        await saveJobs(dir, jobs);
        return `Paused ${id}`;
      });

      lifecycle("resume", "Resume a paused cron job", async (dir, id) => {
        const jobs = await loadJobs(dir);
        const j = jobs.find((x) => x.id === id);
        if (!j) return "Not found";
        j.enabled = true;
        j.consecutiveFailures = 0;
        j.nextRunAt = computeNextRun(j, new Date());
        await saveJobs(dir, jobs);
        return `Resumed ${id}, next=${j.nextRunAt}`;
      });

      lifecycle("remove", "Remove a cron job (stops ticks, cleans memory and logs)", async (dir, id) => {
        await removeJob(dir, id);
        return `Removed ${id}. Also remove the OS job if installed.`;
      });

      add({
        name: "run_now",
        description: "Fire a tick immediately (for testing)",
        input: { type: "object", properties: { id: idProp }, required: ["id"], additionalProperties: false },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          const dir = await sessionDir(String(tctx.sessionID));
          const r = await executeTick(dir, String(input.id), { promptSession, inFlight });
          await resync(dir);
          return { content: r.ok ? `Tick ${input.id} sent to the session` : `Tick skipped: ${r.skipped}` };
        },
      });

      add({
        name: "burst",
        description: "Force high-frequency burst mode on an adaptive cron job for a given duration in minutes (default 15m).",
        input: {
          type: "object",
          properties: {
            id: idProp,
            minutes: { type: "number", description: "Duration in minutes to maintain burst cadence (default 15, max 1440)" },
          },
          required: ["id"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          const dir = await sessionDir(String(tctx.sessionID));
          const jobs = await loadJobs(dir);
          const j = jobs.find((x) => x.id === String(input.id));
          if (!j) return { content: `Job ${input.id} not found` };
          const mins = Math.max(1, Math.min(1440, Number(input.minutes) || 15));
          const until = new Date(Date.now() + mins * 60_000).toISOString();
          j.adaptive = {
            enabled: true,
            burstEveryMs: j.adaptive?.burstEveryMs ?? 60_000,
            idleEveryMs: j.adaptive?.idleEveryMs ?? 1_800_000,
            quietThreshold: j.adaptive?.quietThreshold ?? 3,
            consecutiveQuietTicks: 0,
            currentCadence: "burst",
            activeUntil: until,
          };
          j.nextRunAt = computeNextRun(j, new Date());
          await saveJobs(dir, jobs);
          await resync(dir);
          return { content: `Burst mode activated for job ${input.id} until ${until} (cadence: ${Math.round(j.adaptive.burstEveryMs / 1000)}s, next run: ${j.nextRunAt})` };
        },
      });

      add({
        name: "pipeline",
        description: "Inspect the Multi-Job Pipeline DAG workflows, dependencies, and execution triggers",
        input: {
          type: "object",
          properties: {
            id: optStrProp("Optional job id to filter upstream triggers and downstream targets"),
          },
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          const dir = await sessionDir(String(tctx.sessionID));
          const jobs = await loadJobs(dir);
          const graph = getPipelineGraph(jobs);
          if (input.id) {
            assertJobId(String(input.id));
            const node = graph.nodes.find((n) => n.id === String(input.id));
            if (!node) return { content: `Job ${input.id} not found in pipeline` };
            const incoming = graph.edges.filter((e) => e.to === String(input.id));
            const outgoing = graph.edges.filter((e) => e.from === String(input.id));
            return {
              content: JSON.stringify({
                job: node,
                upstreamTriggers: incoming,
                downstreamTriggers: outgoing,
              }, null, 2),
            };
          }
          return { content: JSON.stringify(graph, null, 2) };
        },
      });

      add({
        name: "webhook",
        description: "Configure, inspect, or generate a secret token for an inbound HTTP webhook trigger",
        input: {
          type: "object",
          properties: {
            id: idProp,
            action: { type: "string", enum: ["get", "enable", "disable", "rotate_token"], description: "Action to perform (default: get)" },
            secret: optStrProp("Optional HMAC shared secret (e.g. for GitHub X-Hub-Signature-256)"),
            rateLimitSeconds: { type: "number", description: "Minimum cooldown seconds between triggers (default 5)" },
          },
          required: ["id"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          const dir = await sessionDir(String(tctx.sessionID));
          const jobs = await loadJobs(dir);
          const j = jobs.find((x) => x.id === String(input.id));
          if (!j) return { content: `Job ${input.id} not found` };

          const action = input.action || "get";
          if (action === "disable") {
            j.webhook = undefined;
            await saveJobs(dir, jobs);
            return { content: `Webhook trigger disabled for job ${input.id}` };
          }

          if (action === "enable" || action === "rotate_token") {
            const token = action === "rotate_token" || !j.webhook?.token ? generateWebhookToken() : j.webhook.token;
            j.webhook = {
              enabled: true,
              token,
              secret: input.secret !== undefined ? (input.secret || undefined) : j.webhook?.secret,
              passPayload: j.webhook?.passPayload !== false,
              rateLimitSeconds: typeof input.rateLimitSeconds === "number" ? Math.max(1, input.rateLimitSeconds) : (j.webhook?.rateLimitSeconds ?? 5),
              lastTriggeredAt: j.webhook?.lastTriggeredAt ?? null,
            };
            CronJobSchema.parse(j);
            await saveJobs(dir, jobs);
          }

          const port = parseInt(process.env.OPENCODE_CRON_PORT ?? "4488", 10);
          const webhookUrl = `http://127.0.0.1:${port}/api/webhook/${j.id}`;
          const tokenStr = j.webhook?.token ? `?token=${j.webhook.token}` : "";

          return {
            content: JSON.stringify({
              id: j.id,
              webhook: j.webhook ?? { enabled: false },
              webhookUrl: `${webhookUrl}${tokenStr}`,
              curlExample: `curl -X POST "${webhookUrl}" -H "Authorization: Bearer ${j.webhook?.token ?? ""}" -H "Content-Type: application/json" -d '{"event":"trigger"}'`,
            }, null, 2),
          };
        },
      });

      add({
        name: "memory_read",
        description: "Read a job's persistent memory (use before every tick)",
        input: { type: "object", properties: { id: idProp }, required: ["id"], additionalProperties: false },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          const dir = await sessionDir(String(tctx.sessionID));
          const { md, state } = await readMemory(dir, String(input.id));
          return { content: `${md ?? "(empty memory)"}\n\n---STATE---\n${JSON.stringify(state)}` };
        },
      });

      add({
        name: "memory_save",
        description: "Update persistent memory at end of tick. Required after every run.",
        input: {
          type: "object",
          properties: {
            id: idProp,
            md: { type: "string", description: "Full updated memory markdown" },
            seenHashes: { type: "array", items: { type: "string" } },
            counts: { type: "object", additionalProperties: { type: "number" } },
            news: { type: "number" },
            tweets: { type: "number" },
            hasActivity: { type: "boolean", description: "Set true if new meaningful activity or updates were detected" },
          },
          required: ["id", "md"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          if (String(input.md).length > 32000) throw new Error("Memory too large (max 32000 chars).");
          const dir = await sessionDir(String(tctx.sessionID));
          const prev = await readMemory(dir, String(input.id));
          const mergedCounts: Record<string, number> = {
            ...(prev.state.counts ?? {}),
            ...(input.counts && typeof input.counts === "object" ? input.counts : {}),
          };
          if (typeof input.news === "number") mergedCounts.news = input.news;
          if (typeof input.tweets === "number") mergedCounts.tweets = input.tweets;

          await writeMemory(dir, String(input.id), String(input.md), {
            seenHashes: Array.isArray(input.seenHashes) ? input.seenHashes.map(String) : prev.state.seenHashes,
            counts: mergedCounts,
            lastRunAt: new Date().toISOString(),
            consecutiveFailures: 0,
            hasActivity: input.hasActivity === true,
          });
          return { content: `Memory ${input.id} saved` };
        },
      });

      add({
        name: "priority",
        description: "Set job execution priority (high, normal, low)",
        input: {
          type: "object",
          properties: {
            id: idProp,
            priority: { type: "string", enum: ["high", "normal", "low"], description: "New priority" },
          },
          required: ["id", "priority"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          const priority = JobPrioritySchema.parse(input.priority);
          const dir = await sessionDir(String(tctx.sessionID));
          const jobs = await loadJobs(dir);
          const j = jobs.find((x) => x.id === input.id);
          if (!j) throw new Error(`Job not found: ${input.id}`);
          j.priority = priority;
          await saveJobs(dir, jobs);
          return { content: `Priority for ${j.id} set to '${priority}'` };
        },
      });

      add({
        name: "queue",
        description: "View active running jobs, worker pool status, and system concurrency limit",
        input: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        execute: async (_input: any, tctx: any) => {
          const dir = await sessionDir(String(tctx.sessionID));
          const settings = await loadCronSettings(dir);
          const activeLocks = await getActiveLocks(dir);
          const jobs = await loadJobs(dir);
          const dueList = jobs.filter((j) => j.enabled && (!j.nextRunAt || new Date(j.nextRunAt).getTime() <= Date.now()));
          return {
            content: JSON.stringify({
              maxConcurrency: settings.maxConcurrency,
              activeRunningJobs: activeLocks,
              activeCount: activeLocks.length,
              dueJobsCount: dueList.length,
              jobs: jobs.map((j) => ({
                id: j.id,
                title: j.title,
                priority: j.priority ?? "normal",
                enabled: j.enabled,
                nextRunAt: j.nextRunAt,
              })),
            }, null, 2),
          };
        },
      });

      add({
        name: "dlq",
        description: "Inspect Dead Letter Queue (quarantined jobs), retry failed jobs, or reset circuit breakers",
        input: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["list", "get", "retry", "resolve", "clear"],
              description: "DLQ operation: 'list' (all entries), 'get' (single entry), 'retry' (run canary probe), 'resolve' (mark resolved), 'clear' (empty DLQ)",
            },
            id: optStrProp("Job ID or DLQ entry ID"),
          },
          required: ["action"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          const dir = await sessionDir(String(tctx.sessionID));
          const dlq = await loadDLQ(dir);
          const jobs = await loadJobs(dir);

          if (input.action === "list") {
            const quarantined = dlq.filter((e) => e.status === "quarantined");
            return {
              content: JSON.stringify({
                quarantinedCount: quarantined.length,
                totalEntries: dlq.length,
                entries: dlq,
                circuitBreakers: jobs.map((j) => ({
                  id: j.id,
                  title: j.title,
                  state: j.circuitBreaker?.state ?? "closed",
                  consecutiveFailures: j.consecutiveFailures,
                  lastFailureReason: j.circuitBreaker?.lastFailureReason ?? null,
                })),
              }, null, 2),
            };
          }

          if (input.action === "get") {
            if (!input.id) throw new Error("Missing required 'id'");
            const idStr = String(input.id);
            const entry = dlq.find((e) => e.id === idStr || e.jobId === idStr);
            const targetJobId = entry ? entry.jobId : idStr;
            const job = jobs.find((j) => j.id === targetJobId);
            return {
              content: JSON.stringify({
                dlqEntry: entry ?? null,
                job: job ? {
                  id: job.id,
                  title: job.title,
                  circuitBreaker: job.circuitBreaker ?? { state: "closed" },
                  consecutiveFailures: job.consecutiveFailures,
                } : null,
              }, null, 2),
            };
          }

          if (input.action === "retry") {
            if (!input.id) throw new Error("Missing required 'id'");
            const idStr = String(input.id);
            const entry = dlq.find((e) => e.id === idStr || e.jobId === idStr);
            const targetJobId = entry ? entry.jobId : idStr;
            assertJobId(targetJobId);
            const j = jobs.find((x) => x.id === targetJobId);
            if (!j) throw new Error(`Job '${targetJobId}' not found`);
            setHalfOpen(j);
            j.enabled = true;
            await saveJobs(dir, jobs);
            const r = await executeTick(dir, j.id, { promptSession, inFlight });
            await resync(dir);
            return {
              content: r.ok
                ? `Canary retry for '${j.id}' succeeded! Circuit breaker reset to closed.`
                : `Canary retry for '${j.id}' failed or skipped: ${r.skipped}`,
            };
          }

          if (input.action === "resolve") {
            if (!input.id) throw new Error("Missing required 'id'");
            const idStr = String(input.id);
            const entry = dlq.find((e) => e.id === idStr || e.jobId === idStr);
            const targetJobId = entry ? entry.jobId : idStr;
            assertJobId(targetJobId);
            await resolveDLQEntry(dir, idStr);
            const j = jobs.find((x) => x.id === targetJobId);
            if (j) {
              resetCircuitBreaker(j);
              j.enabled = true;
              await saveJobs(dir, jobs);
            }
            await resync(dir);
            return { content: `DLQ entry and circuit breaker for '${input.id}' resolved` };
          }

          if (input.action === "clear") {
            const count = await clearDLQ(dir, "all");
            return { content: `Cleared ${count} entries from DLQ` };
          }

          throw new Error(`Unsupported action: ${input.action}`);
        },
      });

      add({
        name: "template",
        description: "List production-grade job templates or apply a template to create a pre-configured cron job",
        input: {
          type: "object",
          properties: {
            action: { type: "string", enum: ["list", "apply"], description: "'list' (available blueprints) or 'apply' (instantiate a job)" },
            templateId: optStrProp("Template ID to apply (e.g. git-auto-sync, system-health, security-audit)"),
            id: optStrProp("Custom job ID override"),
            title: optStrProp("Custom title override"),
          },
          required: ["action"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          const dir = await sessionDir(String(tctx.sessionID));
          if (input.action === "list") {
            const list = listJobTemplates();
            return {
              content: JSON.stringify(list, null, 2),
            };
          }
          if (input.action === "apply") {
            if (!input.templateId) throw new Error("Missing required 'templateId'");
            const job = await applyJobTemplate(dir, String(input.templateId), {
              id: input.id ? String(input.id) : undefined,
              title: input.title ? String(input.title) : undefined,
            });
            await resync(dir);
            return {
              content: `Job '${job.id}' created from template '${input.templateId}' with schedule ${job.schedule.cron ?? job.schedule.every ?? job.schedule.everyMs + "ms"}. Next run: ${job.nextRunAt}`,
            };
          }
          throw new Error(`Unsupported action: ${input.action}`);
        },
      });

      add({
        name: "backup",
        description: "Create, list, or restore point-in-time snapshots of cron configuration and persistent memory",
        input: {
          type: "object",
          properties: {
            action: { type: "string", enum: ["list", "create", "restore"], description: "'list' snapshots, 'create' new snapshot, or 'restore' an existing snapshot" },
            id: optStrProp("Backup snapshot ID to restore"),
            note: optStrProp("Optional note/description for the backup snapshot"),
          },
          required: ["action"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          const dir = await sessionDir(String(tctx.sessionID));
          if (input.action === "list") {
            const list = await listBackups(dir);
            return { content: JSON.stringify(list, null, 2) };
          }
          if (input.action === "create") {
            const meta = await createBackup(dir, input.note ? String(input.note) : undefined);
            return { content: `Backup created: ${meta.id} (${meta.jobCount} jobs, ${meta.byteSize} bytes)` };
          }
          if (input.action === "restore") {
            if (!input.id) throw new Error("Missing required 'id'");
            const res = await restoreBackup(dir, String(input.id));
            await resync(dir);
            return { content: `Backup '${input.id}' restored successfully (${res.restoredJobs} jobs, ${res.restoredMemoryFiles} memory files restored)` };
          }
          throw new Error(`Unsupported action: ${input.action}`);
        },
      });

      add({
        name: "metrics",
        description: "View real-time telemetry, execution latencies, and Prometheus metrics for cron tasks",
        input: {
          type: "object",
          properties: {
            prometheus: { type: "boolean", description: "Return standard Prometheus exposition text format (default false)" },
          },
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          const dir = await sessionDir(String(tctx.sessionID));
          const jobs = await loadJobs(dir);
          if (input.prometheus === true) {
            const { generatePrometheusMetrics } = await import("./metrics.ts");
            return { content: generatePrometheusMetrics(jobs) };
          }
          const sys = getSystemMetrics(jobs);
          return { content: JSON.stringify(sys, null, 2) };
        },
      });

      add({
        name: "preview",
        description: "Preview upcoming execution dates, cadence decomposition, and 7-day run heatmap for any schedule or cron expression",
        input: {
          type: "object",
          properties: {
            expression: { type: "string", description: "Interval (e.g. 5m, 1h) or 5-field cron (e.g. */15 * * * *, @daily)" },
            n: { type: "number", description: "Number of upcoming executions to preview (1-50, default 10)" },
            timezone: { type: "string", description: "Optional IANA timezone (e.g. UTC, Europe/Rome, America/New_York)" },
          },
          required: ["expression"],
          additionalProperties: false,
        },
        execute: async (input: any) => {
          const res = previewSchedule(String(input.expression), {
            n: input.n !== undefined ? Number(input.n) : 10,
            timezone: input.timezone ? String(input.timezone) : undefined,
          });
          if (!res.ok) {
            return { content: `Error: ${res.error}` };
          }
          const runsStr = res.nextRuns.map((r, i) => `${i + 1}. ${r.iso} (${r.local})`).join("\n");
          return {
            content: `Schedule Preview: ${res.expression}\nKind: ${res.kind}\nDescription: ${res.humanDescription}\nTotal runs in next 7 days: ${res.totalIn7Days}\n\nUpcoming Runs:\n${runsStr}`,
          };
        },
      });
    });

    return () => {
      for (const s of schedulers.values()) s.stop();
      schedulers.clear();
    };
  },
});

export default CronPlugin;
