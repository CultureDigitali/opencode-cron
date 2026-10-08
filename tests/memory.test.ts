import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { readMemory, writeMemory, buildTickPrompt, initialMemoryMd } from "../src/memory.ts";

describe("memory", () => {
  it("writes and reads back with 200-hash cap", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-mem-"));
    await writeMemory(dir, "j1", initialMemoryMd({ title: "T", systemPrompt: "S", followupPrompt: "F" }), {
      seenHashes: Array.from({ length: 250 }, (_, i) => `h${i}`),
      counts: { news: 1, tweets: 2 },
      lastRunAt: null,
      consecutiveFailures: 0,
    });
    const { md, state } = await readMemory(dir, "j1");
    expect(md).toContain("cron memory");
    expect(state.seenHashes).toHaveLength(200);
  });
  it("tick prompt contains self-check", () => {
    const p = buildTickPrompt({ systemPrompt: "SYS", followupPrompt: "FUP", memoryMd: null });
    expect(p).toContain("SELF-CHECK");
    expect(p).toContain("cron_memory_save");
  });
});
