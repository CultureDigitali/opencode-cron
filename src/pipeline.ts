import { CronJob } from "./types.ts";
import { loadJobs } from "./store.ts";
import { readMemory, writeMemory } from "./memory.ts";

export interface PipelineEdge {
  from: string;
  to: string;
  condition: "onSuccess" | "onFailure";
  type: "onSuccess" | "onFailure";
}

export interface PipelineNode {
  id: string;
  title: string;
  enabled: boolean;
  cadence: string;
  isRoot: boolean;
  hasDownstream: boolean;
  passPayload?: boolean;
}

export interface PipelineGraph {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  rootJobs: string[];
  roots: string[];
  isAcyclic: boolean;
  hasCycle: boolean;
  cyclePath: string[] | null;
}

/**
 * Detect cycles in the jobs pipeline graph using DFS 3-color marking.
 * Returns the cycle path if found (e.g. ['job-a', 'job-b', 'job-a']), or null if acyclic.
 */
export function detectPipelineCycles(jobs: CronJob[]): string[] | null {
  const adj = new Map<string, Array<{ to: string; condition: "onSuccess" | "onFailure" }>>();

  for (const j of jobs) {
    const list: Array<{ to: string; condition: "onSuccess" | "onFailure" }> = [];
    if (j.pipeline && j.pipeline.enabled) {
      for (const to of j.pipeline.onSuccess ?? []) {
        list.push({ to, condition: "onSuccess" });
      }
      for (const to of j.pipeline.onFailure ?? []) {
        list.push({ to, condition: "onFailure" });
      }
    }
    adj.set(j.id, list);
  }

  // 0 = unvisited (white), 1 = visiting (gray), 2 = visited (black)
  const state = new Map<string, number>();
  const parentMap = new Map<string, string>();
  for (const j of jobs) {
    state.set(j.id, 0);
  }

  let cycleFound: string[] | null = null;

  function dfs(curr: string, path: string[]): boolean {
    state.set(curr, 1);
    path.push(curr);

    const edges = adj.get(curr) ?? [];
    for (const edge of edges) {
      const neighbor = edge.to;
      const neighborState = state.get(neighbor) ?? 0;

      if (neighborState === 1) {
        // Back edge found -> cycle detected!
        const cycleStartIndex = path.indexOf(neighbor);
        cycleFound = path.slice(cycleStartIndex).concat(neighbor);
        return true;
      }

      if (neighborState === 0) {
        parentMap.set(neighbor, curr);
        if (dfs(neighbor, path)) return true;
      }
    }

    path.pop();
    state.set(curr, 2);
    return false;
  }

  for (const j of jobs) {
    if ((state.get(j.id) ?? 0) === 0) {
      if (dfs(j.id, [])) {
        return cycleFound;
      }
    }
  }

  return null;
}

/**
 * Validate that the pipeline DAG contains no circular dependencies.
 * Throws an Error if a cycle is detected.
 */
export function validatePipelineDAG(jobs: CronJob[]): void {
  const cycle = detectPipelineCycles(jobs);
  if (cycle) {
    throw new Error(`Pipeline cycle detected: ${cycle.join(" -> ")}`);
  }
}

/**
 * Extract full topological graph representation for Web GUI and analytics.
 */
export function getPipelineGraph(jobs: CronJob[]): PipelineGraph {
  const edges: PipelineEdge[] = [];
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, number>();

  const existingJobIds = new Set(jobs.map((j) => j.id));

  for (const j of jobs) {
    incoming.set(j.id, 0);
    outgoing.set(j.id, 0);
  }

  for (const j of jobs) {
    if (j.pipeline && j.pipeline.enabled) {
      for (const to of j.pipeline.onSuccess ?? []) {
        if (!existingJobIds.has(to)) continue; // skip orphaned/deleted targets
        edges.push({ from: j.id, to, condition: "onSuccess", type: "onSuccess" });
        incoming.set(to, (incoming.get(to) ?? 0) + 1);
        outgoing.set(j.id, (outgoing.get(j.id) ?? 0) + 1);
      }
      for (const to of j.pipeline.onFailure ?? []) {
        if (!existingJobIds.has(to)) continue; // skip orphaned/deleted targets
        edges.push({ from: j.id, to, condition: "onFailure", type: "onFailure" });
        incoming.set(to, (incoming.get(to) ?? 0) + 1);
        outgoing.set(j.id, (outgoing.get(j.id) ?? 0) + 1);
      }
    }
  }

  const cyclePath = detectPipelineCycles(jobs);
  const isAcyclic = cyclePath === null;

  const nodes: PipelineNode[] = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    enabled: j.enabled,
    cadence: j.adaptive?.currentCadence ?? "normal",
    isRoot: (incoming.get(j.id) ?? 0) === 0,
    hasDownstream: (outgoing.get(j.id) ?? 0) > 0,
    passPayload: j.pipeline?.passPayload ?? false,
  }));

  const rootJobs = nodes.filter((n) => n.isRoot && n.hasDownstream).map((n) => n.id);

  return {
    nodes,
    edges,
    rootJobs,
    roots: rootJobs,
    isAcyclic,
    hasCycle: !isAcyclic,
    cyclePath,
  };
}

export interface PipelineExecutionContext {
  depth: number;
  rootMaxDepth?: number;
  visited: Set<string>;
}

export interface TriggerPipelineOptions {
  directory: string;
  parentJobId?: string;
  parentJob?: CronJob;
  status?: "success" | "failed";
  outcome?: "success" | "failed";
  depth?: number;
  currentDepth?: number;
  rootMaxDepth?: number;
  visited?: Set<string>;
  executeFn?: (jobId: string, context?: PipelineExecutionContext) => Promise<"success" | "failed">;
}

/**
 * Trigger downstream jobs according to the parent job's pipeline configuration.
 * Strictly enforces maximum recursion depth, diamond DAG deduplication, and cycle safety.
 */
export async function triggerPipelineDownstream(opts: TriggerPipelineOptions): Promise<string[]> {
  const depth = opts.depth ?? opts.currentDepth ?? 0;
  const directory = opts.directory;
  const parentJobId = opts.parentJobId ?? opts.parentJob?.id;
  const status = opts.status ?? opts.outcome ?? "success";

  if (!parentJobId) return [];

  const jobs = await loadJobs(directory);
  const parent = jobs.find((j) => j.id === parentJobId);
  if (!parent || !parent.pipeline || !parent.pipeline.enabled) {
    return [];
  }

  const rootMaxDepth = opts.rootMaxDepth ?? Math.min(10, Math.max(1, parent.pipeline.maxDepth ?? 5));
  if (depth >= rootMaxDepth) {
    console.warn(`[Pipeline] Max recursion depth (${rootMaxDepth}) reached at depth ${depth} for parent ${parentJobId}. Downstream halting.`);
    return [];
  }

  const visited = opts.visited instanceof Set ? opts.visited : new Set<string>(opts.visited ?? []);
  visited.add(parentJobId);

  const targetIds = status === "success"
    ? (parent.pipeline.onSuccess ?? [])
    : (parent.pipeline.onFailure ?? []);

  if (targetIds.length === 0) return [];

  const triggered: string[] = [];

  for (const targetId of targetIds) {
    if (targetId === parentJobId) continue; // single-node self-loop defense
    if (visited.has(targetId)) {
      console.warn(`[Pipeline] Target ${targetId} already visited in this pipeline cascade. Skipping duplicate run.`);
      continue;
    }

    const target = jobs.find((j) => j.id === targetId);
    if (!target || !target.enabled) continue;

    visited.add(targetId);

    // If passPayload is configured, inject upstream execution context into target's memory
    if (parent.pipeline.passPayload) {
      try {
        const { md: parentMd } = await readMemory(directory, parentJobId);
        const { md: targetMd, state: targetState } = await readMemory(directory, targetId);

        // Prune prior [PIPELINE UPSTREAM] sections to prevent unbounded memory growth (>32k limit)
        const cleanedMd = (targetMd || "").replace(/\n*---\n### \[PIPELINE UPSTREAM\][\s\S]*?(?=\n*---\n### \[PIPELINE UPSTREAM\]|$)/g, "").trim();

        const parentSummary = parentMd ? parentMd.slice(0, 500) : "";
        const upstreamHeader = `\n\n---\n### [PIPELINE UPSTREAM] Triggered by ${parent.title} (\`${parentJobId}\`)\n` +
          `Outcome: **${status.toUpperCase()}** | Time: ${new Date().toISOString()}\n` +
          (parentSummary ? `Upstream Summary:\n${parentSummary}\n` : "");

        const mergedMd = (cleanedMd + upstreamHeader).slice(-28_000);
        await writeMemory(directory, targetId, mergedMd, targetState);
      } catch (err: any) {
        console.warn(`[Pipeline] Failed to pass memory payload to ${targetId}: ${err.message}`);
      }
    }

    triggered.push(targetId);

    // Execute downstream job passing propagated depth and visited set
    try {
      const nextCtx: PipelineExecutionContext = {
        depth: depth + 1,
        rootMaxDepth,
        visited,
      };

      if (opts.executeFn) {
        await opts.executeFn(targetId, nextCtx);
      } else {
        const { runJobHeadless } = await import("./runner.ts");
        await runJobHeadless(directory, targetId, undefined, nextCtx);
      }
    } catch (err: any) {
      console.error(`[Pipeline] Error executing downstream job ${targetId}: ${err.message}`);
    }
  }

  return triggered;
}
