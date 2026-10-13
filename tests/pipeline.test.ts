import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { CronJobSchema, PipelineConfigSchema } from "../src/types.ts";
import {
  detectPipelineCycles,
  validatePipelineDAG,
  getPipelineGraph,
  triggerPipelineDownstream,
} from "../src/pipeline.ts";
import { saveJobs, loadJobs } from "../src/store.ts";
import { readMemory, writeMemory } from "../src/memory.ts";
import { startGuiServer } from "../src/gui/server.ts";

describe("Feature 2: Multi-Job Pipeline & DAG Workflows", () => {
  describe("1. Schema & Validation", () => {
    it("parses valid PipelineConfigSchema with defaults", () => {
      const cfg = PipelineConfigSchema.parse({
        enabled: true,
        onSuccess: ["job-b", "job-c"],
      });
      expect(cfg.enabled).toBe(true);
      expect(cfg.onSuccess).toEqual(["job-b", "job-c"]);
      expect(cfg.onFailure).toEqual([]);
      expect(cfg.passPayload).toBe(false);
      expect(cfg.maxDepth).toBe(5);
    });

    it("rejects self-loop where job.id is in onSuccess or onFailure", () => {
      expect(() => {
        CronJobSchema.parse({
          id: "job-self",
          sessionID: "ses-1",
          directory: "/tmp",
          title: "Self loop",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onSuccess: ["job-self"],
          },
          createdAt: new Date().toISOString(),
        });
      }).toThrow(/cannot trigger itself/i);

      expect(() => {
        CronJobSchema.parse({
          id: "job-fail-self",
          sessionID: "ses-1",
          directory: "/tmp",
          title: "Self fail loop",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onFailure: ["job-fail-self"],
          },
          createdAt: new Date().toISOString(),
        });
      }).toThrow(/cannot trigger itself/i);
    });
  });

  describe("2. DAG Cycle Detection (DFS 3-color)", () => {
    function makeJob(id: string, onSuccess: string[] = [], onFailure: string[] = []) {
      return CronJobSchema.parse({
        id,
        sessionID: "ses-1",
        directory: "/tmp",
        title: `Job ${id}`,
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 300_000 },
        pipeline: {
          enabled: true,
          onSuccess,
          onFailure,
        },
        createdAt: new Date().toISOString(),
      });
    }

    it("accepts linear pipeline without cycles", () => {
      const jobs = [
        makeJob("job-a", ["job-b"]),
        makeJob("job-b", ["job-c"]),
        makeJob("job-c", []),
      ];

      expect(detectPipelineCycles(jobs)).toBeNull();
      expect(() => validatePipelineDAG(jobs)).not.toThrow();

      const graph = getPipelineGraph(jobs);
      expect(graph.hasCycle).toBe(false);
      expect(graph.cyclePath).toBeNull();
      expect(graph.roots).toEqual(["job-a"]);
      expect(graph.nodes.length).toBe(3);
      expect(graph.edges.length).toBe(2);
    });

    it("detects 2-node cycle (A -> B -> A)", () => {
      const jobs = [
        makeJob("job-a", ["job-b"]),
        makeJob("job-b", ["job-a"]),
      ];

      const cycle = detectPipelineCycles(jobs);
      expect(cycle).not.toBeNull();
      expect(cycle).toContain("job-a");
      expect(cycle).toContain("job-b");

      expect(() => validatePipelineDAG(jobs)).toThrow(/Pipeline cycle detected/i);

      const graph = getPipelineGraph(jobs);
      expect(graph.hasCycle).toBe(true);
      expect(graph.cyclePath).not.toBeNull();
    });

    it("detects 3-node cycle (A -> B -> C -> A)", () => {
      const jobs = [
        makeJob("job-a", ["job-b"]),
        makeJob("job-b", ["job-c"]),
        makeJob("job-c", ["job-a"]),
      ];

      const cycle = detectPipelineCycles(jobs);
      expect(cycle).not.toBeNull();
      expect(() => validatePipelineDAG(jobs)).toThrow(/Pipeline cycle detected/i);
    });

    it("detects cycle across onFailure edges (A on-fail -> B on-success -> A)", () => {
      const jobs = [
        makeJob("job-a", [], ["job-b"]),
        makeJob("job-b", ["job-a"], []),
      ];

      expect(detectPipelineCycles(jobs)).not.toBeNull();
      expect(() => validatePipelineDAG(jobs)).toThrow(/Pipeline cycle detected/i);
    });

    it("accepts diamond DAG (A -> B, A -> C, B -> D, C -> D)", () => {
      const jobs = [
        makeJob("job-a", ["job-b", "job-c"]),
        makeJob("job-b", ["job-d"]),
        makeJob("job-c", ["job-d"]),
        makeJob("job-d", []),
      ];

      expect(detectPipelineCycles(jobs)).toBeNull();
      expect(() => validatePipelineDAG(jobs)).not.toThrow();
      const graph = getPipelineGraph(jobs);
      expect(graph.hasCycle).toBe(false);
      expect(graph.roots).toEqual(["job-a"]);
      expect(graph.edges.length).toBe(4);
    });
  });

  describe("3. Downstream Execution Cascading", () => {
    it("triggers onSuccess jobs when parent succeeds", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-pipeline-run-"));
      try {
        const executedJobs: string[] = [];
        const mockExecute = async (jobId: string) => {
          executedJobs.push(jobId);
          return "success" as const;
        };

        const jobA = CronJobSchema.parse({
          id: "parent-job",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Parent Job",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onSuccess: ["child-1", "child-2"],
            onFailure: ["alert-job"],
          },
          createdAt: new Date().toISOString(),
        });

        const child1 = CronJobSchema.parse({
          id: "child-1",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Child 1",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        const child2 = CronJobSchema.parse({
          id: "child-2",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Child 2",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        const alertJob = CronJobSchema.parse({
          id: "alert-job",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Alert Job",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        await saveJobs(tmpDir, [jobA, child1, child2, alertJob]);

        await triggerPipelineDownstream({
          parentJob: jobA,
          outcome: "success",
          directory: tmpDir,
          executeFn: mockExecute,
        });

        expect(executedJobs).toEqual(["child-1", "child-2"]);
        expect(executedJobs).not.toContain("alert-job");
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it("triggers onFailure jobs when parent fails", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-pipeline-fail-"));
      try {
        const executedJobs: string[] = [];
        const mockExecute = async (jobId: string) => {
          executedJobs.push(jobId);
          return "success" as const;
        };

        const jobA = CronJobSchema.parse({
          id: "parent-job",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Parent Job",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onSuccess: ["child-1"],
            onFailure: ["alert-job"],
          },
          createdAt: new Date().toISOString(),
        });

        const child1 = CronJobSchema.parse({
          id: "child-1",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Child 1",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        const alertJob = CronJobSchema.parse({
          id: "alert-job",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Alert Job",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        await saveJobs(tmpDir, [jobA, child1, alertJob]);

        await triggerPipelineDownstream({
          parentJob: jobA,
          outcome: "failed",
          directory: tmpDir,
          executeFn: mockExecute,
        });

        expect(executedJobs).toEqual(["alert-job"]);
        expect(executedJobs).not.toContain("child-1");
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it("propagates memory context when passPayload is true", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-pipeline-payload-"));
      try {
        const jobA = CronJobSchema.parse({
          id: "parent-payload",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Parent Payload",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onSuccess: ["target-job"],
            passPayload: true,
          },
          createdAt: new Date().toISOString(),
        });

        const targetJob = CronJobSchema.parse({
          id: "target-job",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Target Job",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        await saveJobs(tmpDir, [jobA, targetJob]);

        // Write parent memory
        await writeMemory(tmpDir, "parent-payload", "### Facts\nFound 3 critical security patches in upstream repo.", {
          seenHashes: ["hash123"],
          counts: { news: 0, tweets: 0 },
          lastRunAt: new Date().toISOString(),
          consecutiveFailures: 0,
        });

        // Trigger pipeline
        await triggerPipelineDownstream({
          parentJob: jobA,
          outcome: "success",
          directory: tmpDir,
          executeFn: async () => "success",
        });

        // Verify target memory received payload
        const targetMem = await readMemory(tmpDir, "target-job");
        expect(targetMem.md).toBeDefined();
        expect(targetMem.md!).toContain("[PIPELINE UPSTREAM]");
        expect(targetMem.md!).toContain("Found 3 critical security patches");
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it("enforces maxDepth cutoff to prevent runaway cascades", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-pipeline-depth-"));
      try {
        const executedJobs: string[] = [];
        const mockExecute = async (jobId: string) => {
          executedJobs.push(jobId);
          return "success" as const;
        };

        const jobA = CronJobSchema.parse({
          id: "deep-parent",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Deep Parent",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onSuccess: ["deep-child"],
            maxDepth: 3,
          },
          createdAt: new Date().toISOString(),
        });

        const deepChild = CronJobSchema.parse({
          id: "deep-child",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Deep Child",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        await saveJobs(tmpDir, [jobA, deepChild]);

        // When currentDepth is already 3 and maxDepth is 3, downstream trigger is halted
        await triggerPipelineDownstream({
          parentJob: jobA,
          outcome: "success",
          directory: tmpDir,
          currentDepth: 3,
          executeFn: mockExecute,
        });

        expect(executedJobs.length).toBe(0);
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });
  });

  describe("4. HTTP GUI Server Endpoints", () => {
    it("GET /api/pipeline returns topological graph", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-gui-pipeline-"));
      try {
        const jobA = CronJobSchema.parse({
          id: "pipe-a",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Job Pipe A",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onSuccess: ["pipe-b"],
          },
          createdAt: new Date().toISOString(),
        });

        const jobB = CronJobSchema.parse({
          id: "pipe-b",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Job Pipe B",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        await saveJobs(tmpDir, [jobA, jobB]);

        const server = startGuiServer({ dir: tmpDir, port: 0 });
        try {
          const res = await fetch(`http://127.0.0.1:${server.port}/api/pipeline`);
          expect(res.status).toBe(200);
          const data = (await res.json()) as any;
          expect(data.ok).toBe(true);
          expect(data.graph).toBeDefined();
          expect(data.graph.hasCycle).toBe(false);
          expect(data.graph.roots).toEqual(["pipe-a"]);
          expect(data.graph.edges).toEqual([
            { from: "pipe-a", to: "pipe-b", condition: "onSuccess", type: "onSuccess" },
          ]);
        } finally {
          server.stop();
        }
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it("POST /api/jobs/:id/pipeline updates triggers and rejects cycles with HTTP 400", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-gui-pipe-post-"));
      try {
        const jobA = CronJobSchema.parse({
          id: "cycle-a",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Cycle A",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onSuccess: ["cycle-b"],
          },
          createdAt: new Date().toISOString(),
        });

        const jobB = CronJobSchema.parse({
          id: "cycle-b",
          sessionID: "ses-1",
          directory: tmpDir,
          title: "Cycle B",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        await saveJobs(tmpDir, [jobA, jobB]);

        const server = startGuiServer({ dir: tmpDir, port: 0 });
        try {
          // Attempt to make cycle-b trigger cycle-a -> must fail with 400
          const resCycle = await fetch(
            `http://127.0.0.1:${server.port}/api/jobs/cycle-b/pipeline`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                enabled: true,
                onSuccess: ["cycle-a"],
              }),
            }
          );

          expect(resCycle.status).toBe(400);
          const cycleErr = (await resCycle.json()) as any;
          expect(cycleErr.ok).toBe(false);
          expect(cycleErr.error).toContain("Pipeline cycle detected");

          // Valid update: make cycle-b trigger an independent leaf
          const jobC = CronJobSchema.parse({
            id: "cycle-c",
            sessionID: "ses-1",
            directory: tmpDir,
            title: "Cycle C",
            systemPrompt: "sys",
            followupPrompt: "fup",
            schedule: { kind: "interval", everyMs: 300_000 },
            createdAt: new Date().toISOString(),
          });
          const currentJobs = await loadJobs(tmpDir);
          currentJobs.push(jobC);
          await saveJobs(tmpDir, currentJobs);

          const resOk = await fetch(
            `http://127.0.0.1:${server.port}/api/jobs/cycle-b/pipeline`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                enabled: true,
                onSuccess: ["cycle-c"],
                passPayload: true,
              }),
            }
          );

          expect(resOk.status).toBe(200);
          const okData = (await resOk.json()) as any;
          expect(okData.ok).toBe(true);
          expect(okData.pipeline.onSuccess).toEqual(["cycle-c"]);
          expect(okData.pipeline.passPayload).toBe(true);
        } finally {
          server.stop();
        }
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });
  });

  describe("5. Adversarial Regression & Chaos Hardening", () => {
    it("deduplicates targets and rejects invalid or traversal target IDs", () => {
      // Rejects invalid target IDs in onSuccess
      expect(() => {
        PipelineConfigSchema.parse({
          enabled: true,
          onSuccess: ["valid-target", "../evil-traversal"],
        });
      }).toThrow();

      // Deduplicates duplicate target IDs in onSuccess
      const parsed = PipelineConfigSchema.parse({
        enabled: true,
        onSuccess: ["child-a", "child-b", "child-a"],
      });
      expect(parsed.onSuccess).toEqual(["child-a", "child-b"]);
    });

    it("enforces strict DNS rebinding host protection", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-pipeline-dns-"));
      try {
        const server = await startGuiServer({ dir: tmpDir, port: 0 });
        try {
          // Rebind attack 1: localhost.evil.com
          const resEvil1 = await fetch(`http://127.0.0.1:${server.port}/api/pipeline`, {
            headers: { Host: `localhost.evil.com:${server.port}` },
          });
          expect(resEvil1.status).toBe(400);
          const data1 = (await resEvil1.json()) as any;
          expect(data1.error).toContain("Invalid Host header");

          // Rebind attack 2: completely external domain
          const resEvil2 = await fetch(`http://127.0.0.1:${server.port}/api/pipeline`, {
            headers: { Host: "attacker.com" },
          });
          expect(resEvil2.status).toBe(400);

          // Legitimate localhost request with port
          const resLegit1 = await fetch(`http://127.0.0.1:${server.port}/api/pipeline`, {
            headers: { Host: `localhost:${server.port}` },
          });
          expect(resLegit1.status).toBe(200);

          // Legitimate 127.0.0.1 request with port
          const resLegit2 = await fetch(`http://127.0.0.1:${server.port}/api/pipeline`, {
            headers: { Host: `127.0.0.1:${server.port}` },
          });
          expect(resLegit2.status).toBe(200);
        } finally {
          server.stop();
        }
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it("prevents unbounded memory growth over 40 payload passing cascades", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-pipeline-memleak-"));
      try {
        const parentJob = CronJobSchema.parse({
          id: "parent-job",
          sessionID: "ses-p",
          directory: tmpDir,
          title: "Parent Job",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: {
            enabled: true,
            onSuccess: ["child-job"],
            passPayload: true,
          },
          createdAt: new Date().toISOString(),
        });

        const childJob = CronJobSchema.parse({
          id: "child-job",
          sessionID: "ses-c",
          directory: tmpDir,
          title: "Child Job",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        await saveJobs(tmpDir, [parentJob, childJob]);

        // Seed parent memory with substantial text
        const dummyState = { seenHashes: [], counts: {}, lastRunAt: null, consecutiveFailures: 0 };
        await writeMemory(tmpDir, "parent-job", "# Parent Summary\n" + "Initial data from parent.\n".repeat(20), dummyState);
        await writeMemory(tmpDir, "child-job", "# Child Base Memory\nOriginal child content.\n", dummyState);

        // Simulate 40 repeated triggers with passPayload
        for (let i = 0; i < 40; i++) {
          await triggerPipelineDownstream({
            directory: tmpDir,
            parentJobId: "parent-job",
            status: "success",
            executeFn: async () => "success",
          });
        }

        const { md: finalMd } = await readMemory(tmpDir, "child-job");
        expect(finalMd).not.toBeNull();
        // Memory must remain cleanly bounded and well within the 32k hard limit
        expect(finalMd!.length).toBeLessThan(28_000);
        // Only one [PIPELINE UPSTREAM] block should be present after pruning
        const upstreamMatches = finalMd!.match(/### \[PIPELINE UPSTREAM\]/g);
        expect(upstreamMatches).not.toBeNull();
        expect(upstreamMatches!.length).toBe(1);
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it("handles diamond DAG cascades with single dispatch per downstream node", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-pipeline-diamond-"));
      try {
        // A -> [B, C], B -> [D], C -> [D]
        const jobA = CronJobSchema.parse({
          id: "diamond-a",
          sessionID: "ses-a",
          directory: tmpDir,
          title: "A",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: { enabled: true, onSuccess: ["diamond-b", "diamond-c"] },
          createdAt: new Date().toISOString(),
        });
        const jobB = CronJobSchema.parse({
          id: "diamond-b",
          sessionID: "ses-b",
          directory: tmpDir,
          title: "B",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: { enabled: true, onSuccess: ["diamond-d"] },
          createdAt: new Date().toISOString(),
        });
        const jobC = CronJobSchema.parse({
          id: "diamond-c",
          sessionID: "ses-c",
          directory: tmpDir,
          title: "C",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          pipeline: { enabled: true, onSuccess: ["diamond-d"] },
          createdAt: new Date().toISOString(),
        });
        const jobD = CronJobSchema.parse({
          id: "diamond-d",
          sessionID: "ses-d",
          directory: tmpDir,
          title: "D",
          systemPrompt: "sys",
          followupPrompt: "fup",
          schedule: { kind: "interval", everyMs: 300_000 },
          createdAt: new Date().toISOString(),
        });

        await saveJobs(tmpDir, [jobA, jobB, jobC, jobD]);

        const executionLog: string[] = [];

        // Custom execute function that propagates context
        async function mockExecute(id: string, ctx?: any): Promise<"success"> {
          executionLog.push(id);
          // When B or C executes, trigger their downstream
          await triggerPipelineDownstream({
            directory: tmpDir,
            parentJobId: id,
            status: "success",
            depth: ctx?.depth ?? 0,
            rootMaxDepth: ctx?.rootMaxDepth ?? 5,
            visited: ctx?.visited ?? new Set(),
            executeFn: mockExecute,
          });
          return "success";
        }

        // Trigger starting from A
        await triggerPipelineDownstream({
          directory: tmpDir,
          parentJobId: "diamond-a",
          status: "success",
          executeFn: mockExecute,
        });

        // diamond-b and diamond-c should be executed
        expect(executionLog).toContain("diamond-b");
        expect(executionLog).toContain("diamond-c");

        // In a diamond DAG with visited tracking, diamond-d should be executed once, not twice
        const dCount = executionLog.filter((x) => x === "diamond-d").length;
        expect(dCount).toBe(1);
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });
  });
});

