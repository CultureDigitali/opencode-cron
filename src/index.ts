import { Plugin } from "@opencode/plugin";
import { CronJobSchema } from "./types.ts";
import { loadJobs, saveJobs, upsertJob, removeJob, ensureCronDir, computeNextRun, assertJobId } from "./store.ts";
import { normalizeSchedule } from "./schedule.ts";
import { initialMemoryMd, readMemory, writeMemory } from "./memory.ts";
import { CronScheduler } from "./scheduler.ts";
import { executeTick } from "./executor.ts";

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "job";
}

const strProp = (description: string) => ({ type: "string", description }) as const;
const optStrProp = (description: string) => ({ type: "string", description }) as const;
const idProp = { type: "string", description: "Cron job id", pattern: "^[a-z0-9-]{1,64}$" } as const;

// NOTE: tools live under the "cron" namespace, so their effective ids are
// cron_add, cron_list, ... — the namespace is required for Code Mode routing.
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
    // Never break compaction — swallow all errors.
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
          if (Array.isArray(event?.messages)) event.messages.push({ role: "user", content: text } as never);
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
          const norm = normalizeSchedule({ every: input.every, cron: input.cron });
          const rand = Math.random().toString(36).slice(2, 8);
          const id = `${slug(String(input.title))}-${Date.now().toString(36)}-${rand}`;
          const now = new Date().toISOString();
          const job = CronJobSchema.parse({
            id, sessionID, directory: dir,
            title: input.title, systemPrompt: input.systemPrompt, followupPrompt: input.followupPrompt,
            schedule: { kind: norm.kind, everyMs: norm.everyMs, cron: norm.cron },
            agent: input.agent, model: input.model,
            enabled: true, catchUp: input.catchUp === true, skipIfRunning: true,
            maxRuns: 0, maxConsecutiveFailures: 5, runCount: 0, consecutiveFailures: 0,
            createdAt: now, lastRunAt: null, nextRunAt: null,
          });
          job.nextRunAt = computeNextRun(job, new Date());
          await ensureCronDir(dir);
          await upsertJob(dir, job);
          await writeMemory(dir, id, initialMemoryMd({ title: String(input.title), systemPrompt: String(input.systemPrompt), followupPrompt: String(input.followupPrompt) }), {
            seenHashes: [], counts: { news: 0, tweets: 0 }, lastRunAt: null, consecutiveFailures: 0,
          });
          await resync(dir);
          return { content: `Cron created: ${id} every ${input.every ?? input.cron} bound to this session.\nFor persistence with TUI closed, run: npx @culturedigitali/opencode-cron os-install --dir "${dir}".\nMemory initialized at .opencode/cron/memory/${id}.md` };
        },
      });

      add({
        name: "list",
        description: "List active cron jobs in this project",
        input: { type: "object", properties: {}, additionalProperties: false },
        execute: async (_input: any, tctx: any) => {
          const dir = await sessionDir(String(tctx.sessionID));
          const jobs = await loadJobs(dir);
          if (!jobs.length) return { content: "No cron jobs. Use cron_add to create one." };
          return { content: jobs.map((j) => `- ${j.id} | ${j.title} | enabled=${j.enabled} | everyMs=${j.schedule.everyMs ?? "-"} cron=${j.schedule.cron ?? "-"} | runs=${j.runCount} | next=${j.nextRunAt ?? "-"}`).join("\n") };
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
            news: { type: "number" },
            tweets: { type: "number" },
          },
          required: ["id", "md"],
          additionalProperties: false,
        },
        execute: async (input: any, tctx: any) => {
          assertJobId(String(input.id));
          if (String(input.md).length > 32000) throw new Error("Memory too large (max 32000 chars).");
          const dir = await sessionDir(String(tctx.sessionID));
          const prev = await readMemory(dir, String(input.id));
          await writeMemory(dir, String(input.id), String(input.md), {
            seenHashes: Array.isArray(input.seenHashes) ? input.seenHashes.map(String) : prev.state.seenHashes,
            counts: {
              news: typeof input.news === "number" ? input.news : prev.state.counts.news,
              tweets: typeof input.tweets === "number" ? input.tweets : prev.state.counts.tweets,
            },
            lastRunAt: new Date().toISOString(),
            consecutiveFailures: 0,
          });
          return { content: `Memory ${input.id} saved` };
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
