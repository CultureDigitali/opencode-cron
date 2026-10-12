import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import CronModule, { CronPlugin } from "../src/index.ts";
import { loadJobs, saveJobs } from "../src/store.ts";

function createMockCtx(dir: string, promptsSent: { sessionID: string; text: string }[] = []) {
  const tools: any[] = [];
  const hooks: Record<string, any[]> = {};
  let ns = "";

  const ctx: any = {
    location: { directory: dir },
    options: {},
    session: {
      get: async (req: { sessionID: string }) => ({
        location: { directory: dir },
        data: { location: { directory: dir } },
      }),
      prompt: async (req: { sessionID: string; text: string }) => {
        promptsSent.push(req);
        return { ok: true };
      },
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

  return { ctx, tools, hooks, promptsSent };
}

async function setupPlugin(ctx: any): Promise<() => Promise<void> | void> {
  const fn = (await CronPlugin.setup(ctx)) as any;
  return typeof fn === "function" ? fn : () => {};
}

describe("CronPlugin & CodeMode Tools Full Coverage", () => {
  it("verifies full lifecycle and teardown", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-lifecycle-"));
    const { ctx, tools } = createMockCtx(dir);
    const teardown = await setupPlugin(ctx);
    expect(typeof teardown).toBe("function");

    const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));
    const tctx = { sessionID: "ses_lifecycle" };

    // Trigger getScheduler by adding a job
    await byId["cron_add"].execute(
      { title: "Lifecycle Test", every: "5m", systemPrompt: "Sys", followupPrompt: "Followup" },
      tctx
    );

    // Call teardown
    await teardown();
    // Subsequent calls or double teardown should not throw
    expect(async () => await teardown()).not.toThrow();
  });

  describe("cron_add validation & error handling", () => {
    it("rejects systemPrompt longer than 8000 characters", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-add-sys-"));
      const { ctx, tools } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      const hugeSys = "A".repeat(8001);
      expect(
        byId["cron_add"].execute(
          { title: "Big Sys", every: "5m", systemPrompt: hugeSys, followupPrompt: "Short" },
          { sessionID: "s1" }
        )
      ).rejects.toThrow("Prompt too long");

      await teardown();
    });

    it("rejects followupPrompt longer than 8000 characters", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-add-fup-"));
      const { ctx, tools } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      const hugeFup = "B".repeat(8001);
      expect(
        byId["cron_add"].execute(
          { title: "Big Fup", every: "5m", systemPrompt: "Short", followupPrompt: hugeFup },
          { sessionID: "s1" }
        )
      ).rejects.toThrow("Prompt too long");

      await teardown();
    });

    it("rejects adding more than 20 jobs", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-add-limit-"));
      const { ctx, tools } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      // Create 20 mock jobs in store
      const mockJobs = Array.from({ length: 20 }, (_, i) => ({
        id: `job-${i}`,
        sessionID: "s1",
        directory: dir,
        title: `Job ${i}`,
        systemPrompt: "Sys",
        followupPrompt: "Fup",
        schedule: { kind: "interval" as const, everyMs: 300000 },
        enabled: true,
        catchUp: false,
        skipIfRunning: true,
        maxRuns: 0,
        maxConsecutiveFailures: 5,
        runCount: 0,
        consecutiveFailures: 0,
        createdAt: new Date().toISOString(),
        lastRunAt: null,
        nextRunAt: new Date().toISOString(),
      }));
      await saveJobs(dir, mockJobs as any);

      expect(
        byId["cron_add"].execute(
          { title: "21st Job", every: "5m", systemPrompt: "Sys", followupPrompt: "Fup" },
          { sessionID: "s1" }
        )
      ).rejects.toThrow("Too many jobs (max 20 per project)");

      await teardown();
    });

    it("creates job with cron expression and catchUp=true", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-add-cron-"));
      const { ctx, tools } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      const res = await byId["cron_add"].execute(
        { title: "Cron CatchUp", cron: "*/10 * * * *", systemPrompt: "S", followupPrompt: "F", catchUp: true },
        { sessionID: "s1" }
      );
      expect(res.content).toContain("Cron created:");

      const jobs = await loadJobs(dir);
      expect(jobs).toHaveLength(1);
      expect(jobs[0].schedule.cron).toBe("*/10 * * * *");
      expect(jobs[0].catchUp).toBe(true);

      await teardown();
    });
  });

  describe("cron_get and cron_list", () => {
    it("cron_list shows empty state and formatted list", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-list-"));
      const { ctx, tools } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      const emptyRes = await byId["cron_list"].execute({}, { sessionID: "s1" });
      expect(emptyRes.content).toBe("No cron jobs. Use cron_add to create one.");

      await byId["cron_add"].execute(
        { title: "List Item", every: "10m", systemPrompt: "Sys", followupPrompt: "Fup" },
        { sessionID: "s1" }
      );

      const listRes = await byId["cron_list"].execute({}, { sessionID: "s1" });
      expect(listRes.content).toContain("List Item");
      expect(listRes.content).toContain("everyMs=600000");

      await teardown();
    });

    it("cron_get returns formatted JSON or not found error", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-get-"));
      const { ctx, tools } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      await byId["cron_add"].execute(
        { title: "Target Job", every: "5m", systemPrompt: "Sys", followupPrompt: "Fup" },
        { sessionID: "s1" }
      );
      const jobs = await loadJobs(dir);
      const id = jobs[0].id;

      const found = await byId["cron_get"].execute({ id }, { sessionID: "s1" });
      const parsed = JSON.parse(found.content);
      expect(parsed.id).toBe(id);
      expect(parsed.title).toBe("Target Job");

      const notFound = await byId["cron_get"].execute({ id: "missing-job-123" }, { sessionID: "s1" });
      expect(notFound.content).toBe("Job missing-job-123 not found");

      // Invalid ID with path traversal characters throws assertJobId
      expect(
        byId["cron_get"].execute({ id: "../evil" }, { sessionID: "s1" })
      ).rejects.toThrow("Invalid job id");

      await teardown();
    });
  });

  describe("cron_pause, cron_resume, cron_remove", () => {
    it("handles non-existent job in pause and resume gracefully", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-notfound-"));
      const { ctx, tools } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      const pauseRes = await byId["cron_pause"].execute({ id: "ghost-job" }, { sessionID: "s1" });
      expect(pauseRes.content).toBe("Not found");

      const resumeRes = await byId["cron_resume"].execute({ id: "ghost-job" }, { sessionID: "s1" });
      expect(resumeRes.content).toBe("Not found");

      await teardown();
    });
  });

  describe("cron_memory_read & cron_memory_save", () => {
    it("reads and updates memory markdown and state counters", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-memory-"));
      const { ctx, tools } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      await byId["cron_add"].execute(
        { title: "Memory Job", every: "5m", systemPrompt: "Sys", followupPrompt: "Fup" },
        { sessionID: "s1" }
      );
      const jobs = await loadJobs(dir);
      const id = jobs[0].id;

      const memRead = await byId["cron_memory_read"].execute({ id }, { sessionID: "s1" });
      expect(memRead.content).toContain("# Memory Job");
      expect(memRead.content).toContain("---STATE---");

      const saveRes = await byId["cron_memory_save"].execute(
        {
          id,
          md: "# Updated Memory\nKey facts learned.",
          seenHashes: ["hash-abc", "hash-def"],
          news: 5,
          tweets: 12,
          counts: { customCounter: 42 },
        },
        { sessionID: "s1" }
      );
      expect(saveRes.content).toBe(`Memory ${id} saved`);

      const updatedRead = await byId["cron_memory_read"].execute({ id }, { sessionID: "s1" });
      expect(updatedRead.content).toContain("# Updated Memory");
      expect(updatedRead.content).toContain('"news":5');
      expect(updatedRead.content).toContain('"tweets":12');
      expect(updatedRead.content).toContain('"customCounter":42');

      // Rejects memory markdown exceeding 32000 characters
      const hugeMd = "M".repeat(32001);
      expect(
        byId["cron_memory_save"].execute({ id, md: hugeMd }, { sessionID: "s1" })
      ).rejects.toThrow("Memory too large");

      await teardown();
    });
  });

  describe("cron_run_now", () => {
    it("triggers promptSession immediately for active job", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-runnow-"));
      const promptsSent: { sessionID: string; text: string }[] = [];
      const { ctx, tools } = createMockCtx(dir, promptsSent);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      await byId["cron_add"].execute(
        { title: "Run Now Job", every: "5m", systemPrompt: "Sys Prompt", followupPrompt: "Run Now Followup" },
        { sessionID: "ses_runnow" }
      );
      const jobs = await loadJobs(dir);
      const id = jobs[0].id;

      const runRes = await byId["cron_run_now"].execute({ id }, { sessionID: "ses_runnow" });
      expect(runRes.content).toContain(`Tick ${id} sent to the session`);

      expect(promptsSent).toHaveLength(1);
      expect(promptsSent[0].sessionID).toBe("ses_runnow");
      expect(promptsSent[0].text).toContain("Run Now Followup");

      const updatedJobs = await loadJobs(dir);
      expect(updatedJobs[0].runCount).toBe(1);

      await teardown();
    });
  });

  describe("Compaction Hook robustness", () => {
    it("handles multiple jobs and truncates memory to 4000 characters", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-compact-multi-"));
      const { ctx, tools, hooks } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);
      const byId = Object.fromEntries(tools.map((t: any) => [t.id, t]));

      // Add two jobs for ses_multi
      await byId["cron_add"].execute(
        { title: "Job 1", every: "5m", systemPrompt: "S1", followupPrompt: "F1" },
        { sessionID: "ses_multi" }
      );
      await byId["cron_add"].execute(
        { title: "Job 2", every: "5m", systemPrompt: "S2", followupPrompt: "F2" },
        { sessionID: "ses_multi" }
      );

      const jobs = await loadJobs(dir);
      // Give job 1 a large memory (>4000 chars)
      const bigMd = "Content: " + "X".repeat(5000);
      await byId["cron_memory_save"].execute({ id: jobs[0].id, md: bigMd }, { sessionID: "ses_multi" });

      const messages: any[] = [];
      await hooks["compaction"][0]({ sessionID: "ses_multi", messages });

      expect(messages).toHaveLength(2);
      // Job 1 should be truncated to max 4000 chars of md plus header
      const job1Msg = messages[0].content[0].text;
      expect(job1Msg).toContain(`## Cron Memory ${jobs[0].id}`);
      expect(job1Msg.length).toBeLessThan(4200);

      // Job 2 should have its initial memory
      const job2Msg = messages[1].content[0].text;
      expect(job2Msg).toContain(`## Cron Memory ${jobs[1].id}`);

      await teardown();
    });

    it("never throws on malformed or null events", async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-plugin-compact-safe-"));
      const { ctx, hooks } = createMockCtx(dir);
      const teardown = await setupPlugin(ctx);

      const hookFn = hooks["compaction"][0];
      await expect(hookFn(null)).resolves.toBeUndefined();
      await expect(hookFn({})).resolves.toBeUndefined();
      await expect(hookFn({ sessionID: null })).resolves.toBeUndefined();
      await expect(hookFn({ sessionID: "missing", messages: null })).resolves.toBeUndefined();

      await teardown();
    });
  });
});
