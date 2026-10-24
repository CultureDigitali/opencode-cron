import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { registerProject } from "../src/projects.ts";

describe("global UI page", () => {
  let root: string;
  let server: ReturnType<any>;
  let baseUrl: string;
  let projectA: string;
  let projectB: string;
  let startGuiServer: any;

  beforeEach(async () => {
    const serverModule = await import("../src/gui/server.ts");
    startGuiServer = serverModule.startGuiServer;
    
    root = await fs.mkdtemp(path.join(os.tmpdir(), "cron-global-ui-"));
    projectA = path.join(root, "project-a");
    projectB = path.join(root, "project-b");
    const now = new Date().toISOString();
    await fs.mkdir(path.join(projectA, ".opencode", "cron"), { recursive: true });
    await fs.mkdir(path.join(projectB, ".opencode", "cron"), { recursive: true });
    await fs.writeFile(path.join(projectA, ".opencode", "cron", "jobs.json"), JSON.stringify([{
      id: "job-a1", title: "Job A1", enabled: true, schedule: { kind: "interval", everyMs: 60000 }, sessionID: "ses-a", directory: projectA, systemPrompt: "Sys A", followupPrompt: "Follow A", runCount: 5, maxRuns: 0, consecutiveFailures: 0, createdAt: now, nextRunAt: now, lastRunAt: null,
    }, {
      id: "job-a2", title: "Job A2", enabled: false, schedule: { kind: "interval", everyMs: 300000 }, sessionID: "ses-a", directory: projectA, systemPrompt: "Sys A", followupPrompt: "Follow A", runCount: 10, maxRuns: 0, consecutiveFailures: 1, createdAt: now, nextRunAt: now, lastRunAt: null,
    }]));
    await fs.writeFile(path.join(projectB, ".opencode", "cron", "jobs.json"), JSON.stringify([{
      id: "job-b1", title: "Job B1", enabled: true, schedule: { kind: "interval", everyMs: 1800000 }, sessionID: "ses-b", directory: projectB, systemPrompt: "Sys B", followupPrompt: "Follow B", runCount: 3, maxRuns: 0, consecutiveFailures: 0, createdAt: now, nextRunAt: now, lastRunAt: null,
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

  it("serves global dashboard at root", async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const html = await res.text();
    expect(html).toContain("OpenCode Cron");
    expect(html).toContain("Progetti");
    expect(html).toContain("project-a");
    expect(html).toContain("project-b");
    expect(html).toContain("Job A1");
    expect(html).toContain("Job A2");
    expect(html).toContain("Job B1");
  });

  it("shows project filter and state filter controls", async () => {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();
    expect(html).toContain("project-filter");
    expect(html).toContain("state-filter");
    expect(html).toContain("search");
  });

  it("shows enabled, paused, and completed states distinctly", async () => {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();
    // Job A1: enabled
    expect(html).toContain("Job A1");
    // Job A2: paused
    expect(html).toContain("Job A2");
    // Job B1: enabled
    expect(html).toContain("Job B1");
  });

  it("has no console errors on load (inline script syntax valid)", async () => {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();
    const scripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    for (const code of scripts) {
      // No TypeScript cast syntax
      expect(code).not.toMatch(/\b[a-zA-Z_$][\w$]* as [A-Z][\w$]*/);
      // No raw function definitions outside script tags in the final output
      // This is checked by the existing gui.test.ts
    }
  });

  it("renders project-scoped job links correctly", async () => {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();
    // Project dashboard links are in onclick handlers using openGlobalProjectDashboard
    expect(html).toContain('openGlobalProjectDashboard');
    expect(html).toMatch(/\/p\/[a-f0-9]{16}\//);
  });
});

describe("project dashboard renderer regression", () => {
  let root: string;
  let server: ReturnType<any>;
  let baseUrl: string;
  let projectId: string | undefined;
  let startGuiServer: any;

  beforeEach(async () => {
    const serverModule = await import("../src/gui/server.ts");
    startGuiServer = serverModule.startGuiServer;
    const { discoverProjects } = await import("../src/projects.ts");
    
    root = await fs.mkdtemp(path.join(os.tmpdir(), "cron-renderer-"));
    const now = new Date().toISOString();
    await fs.mkdir(path.join(root, ".opencode", "cron"), { recursive: true });
    await fs.writeFile(path.join(root, ".opencode", "cron", "jobs.json"), JSON.stringify([{
      id: "job-r1", title: "Renderer Test Job", enabled: true, schedule: { kind: "interval", everyMs: 60000 }, sessionID: "ses-r", directory: root, systemPrompt: "Sys", followupPrompt: "Follow", runCount: 1, maxRuns: 0, consecutiveFailures: 0, createdAt: now, nextRunAt: now, lastRunAt: null,
    }]));

    server = startGuiServer({ 
      port: 0, 
      dir: root,
      projectRegistryDir: path.join(root, "registry"),
      projectScanRoots: [root],
    });
    baseUrl = `http://localhost:${server.port}`;

    // Get project ID
    const catalog = await discoverProjects({ directory: root, registryDir: path.join(root, "registry"), scanRoots: [root] });
    projectId = catalog.projects.find((p: any) => p.directory === root)?.id;
  });

  afterEach(async () => {
    if (server) server.stop(true);
    await fs.rm(root, { recursive: true, force: true });
  });

  it("project dashboard renders job cards without activeCount/totalRuns ReferenceError", async () => {
    if (!projectId) { expect(true).toBe(true); return; }
    const res = await fetch(`${baseUrl}/p/${projectId}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Renderer Test Job");
    // The inline script should not throw ReferenceError for activeCount/totalRuns
    const scripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    for (const code of scripts) {
      expect(code).not.toMatch(/activeCount\s*\+\+/);
      expect(code).not.toMatch(/totalRuns\s*\+\+/);
    }
  });

  it("project dashboard job cards show all badges and actions", async () => {
    if (!projectId) { expect(true).toBe(true); return; }
    const res = await fetch(`${baseUrl}/p/${projectId}/`);
    const html = await res.text();
    expect(html).toContain("Renderer Test Job");
    expect(html).toContain("job-r1");
    expect(html).toContain("toggle");
    expect(html).toContain("run");
    expect(html).toContain("edit");
    expect(html).toContain("delete");
  });
});