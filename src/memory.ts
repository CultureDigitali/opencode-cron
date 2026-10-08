import * as fs from "node:fs/promises";
import * as path from "node:path";
import { MemoryStateSchema, type MemoryState } from "./types.ts";
import { assertJobId } from "./store.ts";

export function memoryMdPath(directory: string, jobId: string): string {
  assertJobId(jobId);
  return path.join(directory, ".opencode", "cron", "memory", `${jobId}.md`);
}

export function memoryStatePath(directory: string, jobId: string): string {
  assertJobId(jobId);
  return path.join(directory, ".opencode", "cron", "memory", `${jobId}.state.json`);
}

export function initialMemoryMd(opts: { title: string; systemPrompt: string; followupPrompt: string }): string {
  return `# ${opts.title} — cron memory\n\n> Fonte di verità se la chat viene compattata. Il runner la legge prima di ogni tick.\n\n## SystemPrompt originale (frozen)\n${opts.systemPrompt}\n\n## Followup ricorrente\n${opts.followupPrompt}\n\n## Fatti chiave\n- (vuoto — popolato da cron_memory_save)\n\n## Visti / già salvati\n- (vuoto)\n\n## Ultimo run\n- Mai eseguito.\n\n## Domande aperte / ambiguità\n- (vuoto)\n\n## Prossimi passi\n- Eseguire il primo tick e salvare i risultati qui.\n`;
}

export async function readMemory(directory: string, jobId: string): Promise<{ md: string | null; state: MemoryState }> {
  let md: string | null = null;
  try {
    md = await fs.readFile(memoryMdPath(directory, jobId), "utf-8");
  } catch { md = null; }
  let state: MemoryState = { seenHashes: [], counts: { news: 0, tweets: 0 }, lastRunAt: null, consecutiveFailures: 0 };
  try {
    const raw = await fs.readFile(memoryStatePath(directory, jobId), "utf-8");
    const parsed = MemoryStateSchema.safeParse(JSON.parse(raw));
    if (parsed.success) state = parsed.data;
  } catch { /* keep defaults */ }
  return { md, state };
}

export async function writeMemory(directory: string, jobId: string, md: string, state: MemoryState): Promise<void> {
  const dir = path.dirname(memoryMdPath(directory, jobId));
  await fs.mkdir(dir, { recursive: true });
  // backup
  try {
    const prev = await fs.readFile(memoryMdPath(directory, jobId), "utf-8");
    await fs.writeFile(memoryMdPath(directory, jobId) + ".bak", prev, "utf-8");
  } catch { /* no previous */ }
  if (md.length > 32_000) throw new Error("Memory too large (>32k chars). Summarize instead of appending.");
  const parsed = MemoryStateSchema.safeParse(state);
  if (!parsed.success) throw new Error("Invalid memory state");
  const trimmed: MemoryState = { ...parsed.data, seenHashes: parsed.data.seenHashes.slice(-200) };
  await fs.writeFile(memoryMdPath(directory, jobId), md, "utf-8");
  await fs.writeFile(memoryStatePath(directory, jobId), JSON.stringify(trimmed, null, 2), "utf-8");
}

export function buildTickPrompt(opts: { systemPrompt: string; followupPrompt: string; memoryMd: string | null }): string {
  return [
    `[CRON SYSTEM — frozen, non modificare l'obiettivo]`,
    opts.systemPrompt,
    ``,
    `[MEMORIA PERSISTENTE — fonte di verità se la chat è stata compattata]`,
    opts.memoryMd ?? `(memoria vuota — primo run)`,
    ``,
    `[SELF-CHECK obbligatorio prima di agire]`,
    `1. Cosa so per certo dalla memoria?`,
    `2. Cosa manca / è ambiguo per questo tick?`,
    `3. Devo rileggere file/cartella prima di scrivere? Se sì, leggili ora, non indovinare.`,
    ``,
    `[FOLLOWUP di questo tick]`,
    opts.followupPrompt,
    ``,
    `Alla fine chiama cron_memory_save con fattiChiave, nuoviVisti, lastRunSummary, domandeAperte. Non duplicare URL già in memoria.`,
  ].join("\n");
}
