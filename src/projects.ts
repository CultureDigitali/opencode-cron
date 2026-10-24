import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export interface ProjectEntry {
  id: string;
  name: string;
  directory: string;
}

export interface ProjectCatalog {
  projects: ProjectEntry[];
  warnings: string[];
}

export interface ProjectDiscoveryOptions {
  directory: string;
  registryDir?: string;
  scanRoots?: string[];
  sessionDirectories?: string[];
  maxDirectories?: number;
  maxDepth?: number;
}

export { canonicalProjectId };

function canonicalProjectId(dir: string): string {
  return createHash("sha256").update(dir).digest("hex").slice(0, 16);
}

async function readRegistryEntry(registryDir: string, dir: string): Promise<ProjectEntry | null> {
  try {
    const file = path.join(registryDir, `${canonicalProjectId(dir)}.json`);
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as ProjectEntry;
  } catch {
    return null;
  }
}

async function writeRegistryEntry(registryDir: string, entry: ProjectEntry): Promise<void> {
  await fs.mkdir(registryDir, { recursive: true });
  const file = path.join(registryDir, `${canonicalProjectId(entry.directory)}.json`);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(entry, null, 2), "utf-8");
  await fs.rename(tmp, file);
}

export async function registerProject(directory: string, registryDir?: string): Promise<void> {
  const canonical = await fs.realpath(directory);
  const entry: ProjectEntry = {
    id: canonicalProjectId(canonical),
    name: path.basename(canonical),
    directory: canonical,
  };
  if (registryDir) {
    await writeRegistryEntry(registryDir, entry);
  }
}

function isDependencyDir(name: string): boolean {
  return name === "node_modules" || name === "vendor" || name === ".git" || name === ".venv" || name === "venv" || name === "dist" || name === "build" || name === "target" || name === ".next" || name === ".cache";
}

async function collectFromRoot(root: string, options: ProjectDiscoveryOptions, seen: Set<string>, warnings: string[]): Promise<ProjectEntry[]> {
  const entries: ProjectEntry[] = [];
  const maxDirs = options.maxDirectories ?? 500;
  const maxDepth = options.maxDepth ?? 3;
  let count = 0;

  async function walk(dir: string, depth: number) {
    if (count >= maxDirs || depth > maxDepth) {
      if (count >= maxDirs && !warnings.some(w => w.includes("limit"))) {
        warnings.push(`Project discovery limit reached (${maxDirs} directories)`);
      }
      if (depth > maxDepth && !warnings.some(w => w.includes("depth limit"))) {
        warnings.push(`Project discovery depth limit reached (${maxDepth})`);
      }
      return;
    }
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const item of items) {
        if (count >= maxDirs) break;
        if (!item.isDirectory()) continue;
        if (isDependencyDir(item.name)) continue;
        if (item.name === ".opencode") continue;
        const full = path.join(dir, item.name);
        try {
          const stat = await fs.lstat(full);
          if (stat.isSymbolicLink()) continue;
        } catch {
          continue;
        }
        const cronDir = path.join(full, ".opencode", "cron");
        try {
          await fs.access(cronDir);
          const canonical = await fs.realpath(full);
          if (!seen.has(canonical)) {
            seen.add(canonical);
            count++;
            entries.push({
              id: canonicalProjectId(canonical),
              name: path.basename(canonical),
              directory: canonical,
            });
          }
        } catch {
          // Not a cron project
        }
        await walk(full, depth + 1);
      }
    } catch (e: any) {
      if (e?.code !== "ENOENT" && e?.code !== "EACCES") {
        warnings.push(`Failed to scan ${dir}: ${e?.message}`);
      }
    }
  }

  await walk(root, 0);
  return entries;
}

export async function discoverProjects(options: ProjectDiscoveryOptions): Promise<ProjectCatalog> {
  const { directory, registryDir, scanRoots = [], sessionDirectories = [] } = options;
  const warnings: string[] = [];
  const seen = new Set<string>();
  const projects: ProjectEntry[] = [];

  // Startup project
  try {
    const canonical = await fs.realpath(directory);
    if (!seen.has(canonical)) {
      seen.add(canonical);
      projects.push({
        id: canonicalProjectId(canonical),
        name: path.basename(canonical),
        directory: canonical,
      });
    }
  } catch (e: any) {
    warnings.push(`Startup directory not accessible: ${e?.message}`);
  }

  // Registry projects
  if (registryDir) {
    try {
      await fs.mkdir(registryDir, { recursive: true });
      const files = await fs.readdir(registryDir);
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        try {
          const raw = await fs.readFile(path.join(registryDir, file), "utf-8");
          const entry = JSON.parse(raw) as ProjectEntry;
          const canonical = await fs.realpath(entry.directory).catch(() => entry.directory);
          if (!seen.has(canonical)) {
            seen.add(canonical);
            projects.push({ ...entry, directory: canonical });
          }
        } catch {
          warnings.push(`Skipping malformed registry entry: ${file}`);
        }
      }
    } catch {
      // Registry not readable
    }
  }

  // Session directories
  for (const sd of sessionDirectories) {
    try {
      const canonical = await fs.realpath(sd);
      if (!seen.has(canonical)) {
        seen.add(canonical);
        projects.push({
          id: canonicalProjectId(canonical),
          name: path.basename(canonical),
          directory: canonical,
        });
      }
    } catch {
      // Ignore
    }
  }

  // Scan roots
  for (const root of scanRoots) {
    const found = await collectFromRoot(root, options, seen, warnings);
    projects.push(...found);
  }

  return { projects, warnings };
}