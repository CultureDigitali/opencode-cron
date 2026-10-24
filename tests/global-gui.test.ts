import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { startGuiServer } from "../src/gui/server.ts";
import { registerProject, discoverProjects } from "../src/projects.ts";

describe("cross-project GUI and jobs API", () => {
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
    });
    baseUrl = `http://localhost:${server.port}`;
  });

  afterEach(async () => {
    if (server) server.stop(true);
    await fs.rm(root, { recursive: true, force: true });
  });

  it("exposes discovered project catalog via /api/projects", async () => {
    const res = await fetch(`${baseUrl}/api/projects`);
    expect(res.status).toBe(200);
    const data = await res.json() as { ok: boolean; projects: Array<{ id: string; name: string; directory: string }>; warnings?: string[] };
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.projects.length).toBeGreaterThanOrEqual(1);
  });

  it("returns jobs from all projects with projectName and directory attached", async () => {
    const res = await fetch(`${baseUrl}/api/jobs`);
    expect(res.status).toBe(200);
    const data = await res.json() as any[];
    expect(Array.isArray(data)).toBe(true);
  });

  it("serves full Mandate dashboard at / without leaking raw code", async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    // Must contain brand and mandate elements
    expect(html).toContain("OpenCode Cron");
    expect(html).toContain("job-filter-project");
    // Must NOT leak raw CSS code outside style tags
    expect(html).not.toMatch(/<head>[^<]*\/\* ---- Signal-room atmosphere/);
  });
});
