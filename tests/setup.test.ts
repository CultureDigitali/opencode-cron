import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import CronModule, { CronPlugin } from "../src/index.ts";
import { loadJobs } from "../src/store.ts";

function mockCtx(dir?: string) {
  const tools: any[] = [];
  const hooks: Record<string, any[]> = {};
  let ns = "";
  const ctx: any = {
    location: { directory: dir ?? "/tmp/cron-setup-test" },
    options: {},
    session: {
      get: async () => ({ location: { directory: dir ?? "/tmp/cron-setup-test" } }),
      prompt: async () => ({}),
      hook: async (name: string, fn: any) => {
        (hooks[name] ??= []).push(fn);
      },
    },
    tool: {
      transform: async (cb: any) => {
        cb({
          add: (def: any) => tools.push({ ...def, id: ns ? `${ns}_${def.name}` : def.name }),
          namespace: (n: any) => { ns = n.name; },
          update: () => {},
          remove: () => {},
          list: () => tools,
          get: (id: string) => tools.find((t) => t.name === id),
        });
      },
    },
  };
  return { ctx, tools, hooks };
}

describe("v2 plugin module", () => {
  it("default-exports { id, setup } (v2 loader shape)", () => {
    expect((CronModule as any).id).toBe("opencode-cron");
    expect(typeof (CronModule as any).setup).toBe("function");
    expect(CronPlugin).toBe(CronModule);
  });

  it("registers 9 tools with valid JSON-schema inputs", async () => {
    const { ctx, tools, hooks } = mockCtx();
    const cleanup = await (CronModule as any).setup(ctx);
    const names = tools.map((t) => t.id).sort();
    expect(names).toEqual(
      ["cron_add", "cron_get", "cron_list", "cron_memory_read", "cron_memory_save", "cron_pause", "cron_remove", "cron_resume", "cron_run_now"].sort()
    );
    for (const t of tools) {
      expect(t.description.length).toBeGreaterThan(0);
      expect(t.input?.type).toBe("object");
      expect(typeof t.execute).toBe("function");
    }
    expect(hooks["compaction"]?.length).toBe(1);
    expect(typeof cleanup).toBe("function");
    await cleanup();
  });

  it("cron_add creates job + memory, cron_list shows it (v2 execute path)", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-v2-e2e-"));
    const { ctx, tools } = mockCtx(dir);
    const cleanup = await (CronModule as any).setup(ctx);
    const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));
    const tctx = { sessionID: "ses_v2" };
    const addOut: any = await byId["cron_add"].execute(
      { title: "Probe", every: "30m", systemPrompt: "SYS", followupPrompt: "FUP" },
      tctx
    );
    expect(addOut.content).toContain("Cron created:");
    const jobs = await loadJobs(dir);
    expect(jobs).toHaveLength(1);
    expect(jobs[0].sessionID).toBe("ses_v2");
    const mem = await fs.readFile(path.join(dir, ".opencode", "cron", "memory", `${jobs[0].id}.md`), "utf-8");
    expect(mem).toContain("SYS");
    const listOut: any = await byId["cron_list"].execute({}, tctx);
    expect(listOut.content).toContain(jobs[0].id);
    await cleanup();
  });

  it("pause/resume/remove lifecycle works", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-v2-life-"));
    const { ctx, tools } = mockCtx(dir);
    const cleanup = await (CronModule as any).setup(ctx);
    const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));
    const tctx = { sessionID: "s1" };
    await byId["cron_add"].execute({ title: "L", every: "30m", systemPrompt: "S", followupPrompt: "F" }, tctx);
    const id = (await loadJobs(dir))[0].id;
    expect((await byId["cron_pause"].execute({ id }, tctx)).content).toContain("Paused");
    expect((await loadJobs(dir))[0].enabled).toBe(false);
    expect((await byId["cron_resume"].execute({ id }, tctx)).content).toContain("Resumed");
    expect((await loadJobs(dir))[0].enabled).toBe(true);
    expect((await byId["cron_remove"].execute({ id }, tctx)).content).toContain("Removed");
    expect(await loadJobs(dir)).toHaveLength(0);
    await cleanup();
  });

  it("compaction hook injects job memory into messages", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-v2-compact-"));
    const { ctx, tools, hooks } = mockCtx(dir);
    const cleanup = await (CronModule as any).setup(ctx);
    const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));
    await byId["cron_add"].execute({ title: "C", every: "30m", systemPrompt: "SECRETSYS", followupPrompt: "F" }, { sessionID: "ses_c" });
    // other session: nothing injected
    const other: any[] = [];
    await hooks["compaction"][0]({ sessionID: "ses_other", messages: other });
    expect(other).toHaveLength(0);
    // own session: memory injected
    const mine: any[] = [];
    await hooks["compaction"][0]({ sessionID: "ses_c", messages: mine });
    expect(mine).toHaveLength(1);
    expect(JSON.stringify(mine[0])).toContain("SECRETSYS");
    await cleanup();
  });

  it("compaction hook never throws", async () => {
    const { ctx, hooks } = mockCtx("/nonexistent-dir-xyz");
    const cleanup = await (CronModule as any).setup(ctx);
    await hooks["compaction"][0]({ sessionID: "s", messages: [] });
    await hooks["compaction"][0]({});
    await cleanup();
  });
});
