import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { CronJobSchema } from "./types.ts";
import { loadJobs, saveJobs, upsertJob, removeJob, ensureCronDir, computeNextRun, assertJobId } from "./store.ts";
import { normalizeSchedule } from "./schedule.ts";
import { initialMemoryMd, readMemory, writeMemory } from "./memory.ts";
import { CronScheduler } from "./scheduler.ts";
import { executeTick } from "./executor.ts";
import { detectOS } from "./os.ts";

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "job";
}

export const CronPlugin: Plugin = async ({ client, directory }) => {
  const scheduler = new CronScheduler(client as any);
  // fire-and-forget bootstrap; resync errors must not crash plugin load
  scheduler.start(directory).catch(() => {});

  return {
    dispose: async () => {
      scheduler.stop();
    },
    event: async ({ event }) => {
      if (event.type === "server.connected") {
        await scheduler.resync(directory).catch(() => {});
      }
    },
    "experimental.session.compacting": async (input, output) => {
      try {
        const jobs = await loadJobs(directory);
        const mine = jobs.filter((j) => j.sessionID === input.sessionID && j.enabled);
        for (const j of mine) {
          const { md } = await readMemory(directory, j.id);
          if (md) output.context.push(`## Cron Memory ${j.id} (persistente, fonte di verità)\n${md.slice(0, 4000)}`);
          else output.context.push(`## Cron ${j.id}: goal=${j.title}. Followup: ${j.followupPrompt.slice(0, 500)}`);
        }
      } catch { /* never break compaction */ }
    },
    tool: {
      cron_add: tool({
        description: "Crea un cronjob stile ChatGPT Attività Programmate legato alla chat corrente. Usa 'every' tipo 5m oppure cron '*/5 * * * *'.",
        args: {
          title: tool.schema.string().describe("Titolo breve del monitoraggio"),
          every: tool.schema.string().optional().describe("Intervallo tipo 5m, 1h (min 60s)"),
          cron: tool.schema.string().optional().describe("Espressione cron 5 campi"),
          systemPrompt: tool.schema.string().describe("Prompt di sistema frozen per questo job"),
          followupPrompt: tool.schema.string().describe("Cosa fare ad ogni tick"),
          agent: tool.schema.string().optional(),
          model: tool.schema.string().optional(),
        },
        async execute(args, ctx) {
          const dir = ctx.directory ?? directory;
          if (args.systemPrompt.length > 8000 || args.followupPrompt.length > 8000)
            throw new Error("Prompt too long (max 8000 chars each). Summarize instead.");
          const existing = await loadJobs(dir);
          if (existing.length >= 20) throw new Error("Too many jobs (max 20 per project). Remove one first.");
          const norm = normalizeSchedule({ every: args.every, cron: args.cron });
          const rand = Math.random().toString(36).slice(2, 8);
          const id = `${slug(args.title)}-${Date.now().toString(36)}-${rand}`;
          const now = new Date().toISOString();
          const job = CronJobSchema.parse({
            id,
            sessionID: ctx.sessionID,
            directory: dir,
            title: args.title,
            systemPrompt: args.systemPrompt,
            followupPrompt: args.followupPrompt,
            schedule: { kind: norm.kind, everyMs: norm.everyMs, cron: norm.cron },
            agent: args.agent,
            model: args.model,
            enabled: true,
            catchUp: false,
            skipIfRunning: true,
            maxRuns: 0,
            maxConsecutiveFailures: 5,
            runCount: 0,
            consecutiveFailures: 0,
            createdAt: now,
            lastRunAt: null,
            nextRunAt: null,
          });
          job.nextRunAt = computeNextRun(job, new Date());
          await ensureCronDir(dir);
          await upsertJob(dir, job);
          await writeMemory(dir, id, initialMemoryMd({ title: args.title, systemPrompt: args.systemPrompt, followupPrompt: args.followupPrompt }), {
            seenHashes: [], counts: { news: 0, tweets: 0 }, lastRunAt: null, consecutiveFailures: 0,
          });
          await scheduler.resync(dir).catch(() => {});
          const os = detectOS();
          return `Cron creato: ${id} ogni ${args.every ?? args.cron} legato a sessione ${ctx.sessionID}.\nOS rilevato: ${os} — per persistenza a TUI chiusa installa il runner: npx opencode-cron os-install --dir "${dir}".\nMemoria inizializzata in .opencode/cron/memory/${id}.md`;
        },
      }),
      cron_list: tool({
        description: "Lista i cronjob attivi in questo progetto",
        args: {},
        async execute(_args, ctx) {
          const dir = ctx.directory ?? directory;
          const jobs = await loadJobs(dir);
          if (!jobs.length) return "Nessun cronjob. Usa cron_add per crearne uno.";
          return jobs.map((j) => `- ${j.id} | ${j.title} | enabled=${j.enabled} | everyMs=${j.schedule.everyMs ?? "-"} cron=${j.schedule.cron ?? "-"} | runs=${j.runCount} | next=${j.nextRunAt ?? "-"}`).join("\n");
        },
      }),
      cron_get: tool({
        description: "Dettagli di un cronjob",
        args: { id: tool.schema.string() },
        async execute(args, ctx) {
          assertJobId(args.id);
          const jobs = await loadJobs(ctx.directory ?? directory);
          const j = jobs.find((x) => x.id === args.id);
          return j ? JSON.stringify(j, null, 2) : `Job ${args.id} non trovato`;
        },
      }),
      cron_pause: tool({
        description: "Pausa un cronjob",
        args: { id: tool.schema.string() },
        async execute(args, ctx) {
          assertJobId(args.id);
          const dir = ctx.directory ?? directory;
          const jobs = await loadJobs(dir);
          const j = jobs.find((x) => x.id === args.id);
          if (!j) return "Non trovato";
          j.enabled = false;
          await saveJobs(dir, jobs);
          await scheduler.resync(dir).catch(() => {});
          return `Pausato ${args.id}`;
        },
      }),
      cron_resume: tool({
        description: "Riattiva un cronjob",
        args: { id: tool.schema.string() },
        async execute(args, ctx) {
          assertJobId(args.id);
          const dir = ctx.directory ?? directory;
          const jobs = await loadJobs(dir);
          const j = jobs.find((x) => x.id === args.id);
          if (!j) return "Non trovato";
          j.enabled = true;
          j.consecutiveFailures = 0;
          j.nextRunAt = computeNextRun(j, new Date());
          await saveJobs(dir, jobs);
          await scheduler.resync(dir).catch(() => {});
          return `Riattivato ${args.id}, next=${j.nextRunAt}`;
        },
      }),
      cron_remove: tool({
        description: "Rimuove un cronjob (ferma anche i tick)",
        args: { id: tool.schema.string() },
        async execute(args, ctx) {
          assertJobId(args.id);
          const dir = ctx.directory ?? directory;
          await removeJob(dir, args.id);
          await scheduler.resync(dir).catch(() => {});
          return `Rimosso ${args.id}. Ricorda: rimuovi anche l'eventuale job OS con: npx opencode-cron os-remove`;
        },
      }),
      cron_run_now: tool({
        description: "Esegue subito un tick (per test)",
        args: { id: tool.schema.string() },
        async execute(args, ctx) {
          assertJobId(args.id);
          const dir = ctx.directory ?? directory;
          const r = await executeTick(dir, args.id, client as any);
          await scheduler.resync(dir).catch(() => {});
          return r.ok ? `Tick ${args.id} inviato alla sessione` : `Tick saltato: ${r.skipped}`;
        },
      }),
      cron_memory_read: tool({
        description: "Legge la memoria persistente di un job (usala prima di ogni tick)",
        args: { id: tool.schema.string() },
        async execute(args, ctx) {
          assertJobId(args.id);
          const dir = ctx.directory ?? directory;
          const { md, state } = await readMemory(dir, args.id);
          return `${md ?? "(memoria vuota)"}\n\n---STATE---\n${JSON.stringify(state)}`;
        },
      }),
      cron_memory_save: tool({
        description: "Aggiorna la memoria persistente a fine tick. Obbligatoria dopo ogni run.",
        args: {
          id: tool.schema.string(),
          md: tool.schema.string().describe("Intero contenuto markdown aggiornato della memoria"),
          seenHashes: tool.schema.array(tool.schema.string()).optional(),
          news: tool.schema.number().optional(),
          tweets: tool.schema.number().optional(),
        },
        async execute(args, ctx) {
          assertJobId(args.id);
          if (args.md.length > 32000) throw new Error("Memory too large (max 32000 chars).");
          const dir = ctx.directory ?? directory;
          const prev = await readMemory(dir, args.id);
          await writeMemory(dir, args.id, args.md, {
            seenHashes: args.seenHashes ?? prev.state.seenHashes,
            counts: { news: args.news ?? prev.state.counts.news, tweets: args.tweets ?? prev.state.counts.tweets },
            lastRunAt: new Date().toISOString(),
            consecutiveFailures: 0,
          });
          return `Memoria ${args.id} salvata`;
        },
      }),
    },
  };
};

export default CronPlugin;
