import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { discoverProjects, registerProject } from "../src/projects.ts";

describe("project catalog", () => {
  let root: string;
  beforeEach(async () => { root = await fs.mkdtemp(path.join(os.tmpdir(), "cron-catalog-")); });
  afterEach(async () => { await fs.rm(root, { recursive: true, force: true }); });

  async function project(relative: string) {
    const dir = path.join(root, relative);
    await fs.mkdir(path.join(dir, ".opencode", "cron"), { recursive: true });
    await fs.writeFile(path.join(dir, ".opencode", "cron", "jobs.json"), "[]");
    return dir;
  }
  const options = () => ({ directory: root, registryDir: path.join(root, "registry"), scanRoots: [path.join(root, "workspaces")] });

  it("discovers projects with spaces and Unicode, preserving canonical ownership", async () => {
    const first = await project("workspaces/CONTI V2");
    const second = await project("workspaces/équipe/secondo");
    const result = await discoverProjects(options());
    expect(result.projects.map(p => p.directory).sort()).toEqual([await fs.realpath(root), await fs.realpath(first), await fs.realpath(second)].sort());
    expect(new Set(result.projects.map(p => p.id)).size).toBe(3);
    expect(result.warnings).toEqual([]);
    expect(await fs.stat(path.join(root, ".opencode")).catch(() => null)).toBeNull();
  });

  it("registers independent projects concurrently and deduplicates aliases", async () => {
    const first = await project("elsewhere/a");
    const second = await project("elsewhere/b");
    await Promise.all([registerProject(first, options().registryDir), registerProject(second, options().registryDir)]);
    const result = await discoverProjects({ ...options(), scanRoots: [], sessionDirectories: [first, path.join(first, ".")] });
    expect(result.projects).toHaveLength(3);
    const firstCanonical = await fs.realpath(first);
    expect(result.projects.filter(p => p.directory === firstCanonical)).toHaveLength(1);
  });

  it("does not scan dependencies or follow workspace symlinks", async () => {
    await project("workspaces/node_modules/hidden");
    await project("outside/hidden");
    await fs.mkdir(path.join(root, "workspaces"), { recursive: true });
    if (process.platform !== "win32") await fs.symlink(root, path.join(root, "workspaces", "loop"), "dir");
    const result = await discoverProjects(options());
    expect(result.projects).toHaveLength(1);
  });

  it("reports truncated discovery rather than pretending all projects were found", async () => {
    await project("workspaces/nested/deeper");
    const limited = await discoverProjects({ ...options(), maxDirectories: 1 });
    expect(limited.warnings.join(" ")).toMatch(/limit/i);
    const depth = await discoverProjects({ ...options(), maxDepth: 0 });
    expect(depth.warnings.join(" ")).toMatch(/limit/i);
  });

  it("warns about malformed registry entries while keeping healthy projects", async () => {
    const dir = await project("elsewhere/a");
    await registerProject(dir, options().registryDir);
    await fs.writeFile(path.join(options().registryDir, "broken.json"), "{invalid");
    const result = await discoverProjects({ ...options(), scanRoots: [path.join(root, "missing")] });
    expect(result.projects).toHaveLength(2);
    expect(result.warnings.join(" ")).toMatch(/registr/i);
  });
});
