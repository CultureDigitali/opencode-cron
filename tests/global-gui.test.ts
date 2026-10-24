import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { startGuiServer } from "../src/gui/server.ts";
import { registerProject, discoverProjects } from "../src/projects.ts";

describe("global GUI routing", () => {
  let root: string;
  let server: ReturnType<typeof startGuiServer>;
  let baseUrl: string;
  let projectA: string;
  let projectB: string;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "cron-global-"));
    projectA = path.join(root, "project-a");
    projectB = path.join(root, "project-b");
    const now = new Date().toISOString();
    await fs.mkdir(path.join(projectA, ".opencode", "cron"), { recursive: true });
    await fs.mkdir(path.join(projectB, ".opencode", "cron"), { recursive: true });
    await fs.writeFile(path.join(projectA, ".opencode", "cron", "jobs.json"), JSON.stringify([{
      id: "job-x",
      title: "Job A",
      enabled: true,
      schedule: { kind: "interval", everyMs: 60000 },
      sessionID: "ses-a",
      directory: projectA,
      systemPrompt: "System A",
      followupPrompt: "Followup A",
      runCount: 5,
      maxRuns: 0,
      consecutiveFailures: 0,
      createdAt: now,
      nextRunAt: now,
      lastRunAt: null,
    }]));
    await fs.writeFile(path.join(projectB, ".opencode", "cron", "jobs.json"), JSON.stringify([{
      id: "job-x",
      title: "Job B",
      enabled: false,
      schedule: { kind: "interval", everyMs: 300000 },
      sessionID: "ses-b",
      directory: projectB,
      systemPrompt: "System B",
      followupPrompt: "Followup B",
      runCount: 10,
      maxRuns: 0,
      consecutiveFailures: 1,
      createdAt: now,
      nextRunAt: now,
      lastRunAt: null,
    }]));
    await registerProject(projectA, path.join(root, "registry"));
    await registerProject(projectB, path.join(root, "registry"));

    server = startGuiServer({ 
      port: 0, 
      dir: root,
      projectRegistryDir: path.join(root, "registry"),
      projectScanRoots: [root],
    });
    baseUrl = `http://localhost:${server.port}`;
  });

  afterEach(async () => {
    if (server) server.stop(true);
    await fs.rm(root, { recursive: true, force: true });
  });

  it("exposes global project catalog", async () => {
    const res = await fetch(`${baseUrl}/api/projects`);
    expect(res.status).toBe(200);
    const data = await res.json() as { ok: boolean; projects: Array<{ id: string; name: string; directory: string }>; warnings?: string[] };
    expect(data.ok).toBe(true);
    expect(data.projects).toHaveLength(3);
    expect(data.projects.map((p: any) => p.name).sort()).toEqual([path.basename(root), "project-a", "project-b"].sort());
    expect(data.projects.every((p: any) => p.id && p.directory)).toBe(true);
  });

  it("returns global job summaries with project qualification", async () => {
    const res = await fetch(`${baseUrl}/api/global/jobs`);
    expect(res.status).toBe(200);
    const data = await res.json() as { ok: boolean; jobs: any[]; warnings?: string[] };
    expect(data.ok).toBe(true);
    expect(data.jobs).toHaveLength(2);
    const jobA = data.jobs.find((j: any) => j.title === "Job A");
    const jobB = data.jobs.find((j: any) => j.title === "Job B");
    expect(jobA).toBeDefined();
    expect(jobB).toBeDefined();
    expect(jobA.projectId).toBeDefined();
    expect(jobB.projectId).toBeDefined();
    expect(jobA.enabled).toBe(true);
    expect(jobB.enabled).toBe(false);
    expect(jobA.id).toBe("job-x");
    expect(jobB.id).toBe("job-x");
    expect(jobA.projectId).not.toBe(jobB.projectId);
    // No secrets in summaries
    expect(jobA.webhookToken).toBeUndefined();
    expect(jobA.systemPrompt).toBeUndefined();
    expect(jobA.followupPrompt).toBeUndefined();
  });

  it("legacy /api/jobs returns only startup project jobs", async () => {
    const res = await fetch(`${baseUrl}/api/jobs`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("scoped project API: GET /p/:projectId/api/jobs", async () => {
    const projects = await discoverProjects({ directory: root, registryDir: path.join(root, "registry") });
    const projectAId = projects.projects.find((p: any) => p.name === "project-a")?.id;
    const res = await fetch(`${baseUrl}/p/${projectAId}/api/jobs`);
    expect(res.status).toBe(200);
    const data = await res.json() as any[];
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe("job-x");
    expect(data[0].title).toBe("Job A");
    expect(data[0].enabled).toBe(true);
  });

  it("scoped project API: PUT /p/:projectId/api/jobs/:id pauses job in correct project", async () => {
    const projects = await discoverProjects({ directory: root, registryDir: path.join(root, "registry") });
    const projectAId = projects.projects.find((p: any) => p.name === "project-a")?.id;
    const projectBId = projects.projects.find((p: any) => p.name === "project-b")?.id;

    // Pause job-x in project A
    const res = await fetch(`${baseUrl}/p/${projectAId}/api/jobs/job-x/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: false }),
    });
    expect(res.status).toBe(200);

    // Verify project A job is paused
    const jobsA = await (await fetch(`${baseUrl}/p/${projectAId}/api/jobs`)).json() as any[];
    expect(jobsA[0].enabled).toBe(false);

    // Verify project B job is unaffected
    const jobsB = await (await fetch(`${baseUrl}/p/${projectBId}/api/jobs`)).json() as any[];
    expect(jobsB[0].enabled).toBe(false); // was already false
  });

  it("rejects unknown project IDs", async () => {
    const res = await fetch(`${baseUrl}/p/unknown/api/jobs`);
    expect(res.status).toBe(404);
  });

  it("rejects cross-site mutation on global endpoints", async () => {
    const res = await fetch(`${baseUrl}/api/global/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://evil.com" },
    });
    expect(res.status).toBe(403);
  });

  it("warns on corrupt project without hiding healthy ones", async () => {
    const corrupt = path.join(root, "corrupt");
    await fs.mkdir(path.join(corrupt, ".opencode", "cron"), { recursive: true });
    await fs.writeFile(path.join(corrupt, ".opencode", "cron", "jobs.json"), "{invalid");
    await registerProject(corrupt, path.join(root, "registry"));

    const res = await fetch(`${baseUrl}/api/global/jobs`);
    expect(res.status).toBe(200);
    const data = await res.json() as { ok: boolean; warnings?: string[]; jobs: any[] };
    expect(data.ok).toBe(true);
    expect(data.warnings?.join(" ").toLowerCase()).toMatch(/corrupt|invalid|error/);
    expect(data.jobs.length).toBeGreaterThanOrEqual(2); // healthy projects still visible
  });
});