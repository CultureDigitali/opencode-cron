import { upsertJob, computeNextRun, assertJobId } from "./store.ts";
import { initialMemoryMd, writeMemory } from "./memory.ts";
import { normalizeSchedule } from "./schedule.ts";
import { CronJobSchema, type CronJob, type JobTemplate } from "./types.ts";

export const BUILTIN_TEMPLATES: JobTemplate[] = [
  {
    id: "git-auto-sync",
    name: "Git Auto-Sync & Branch Health",
    category: "devops",
    description: "Periodically fetches upstream git commits, checks for uncommitted changes or diverged branches, and logs repository health.",
    tags: ["git", "sync", "devops"],
    systemPrompt: `You are an automated Git repository guardian. Your task is to verify repository status, pull clean changes if safe, and identify merge conflicts or uncommitted changes. Always report clear, structured markdown status.`,
    followupPrompt: `Run git fetch and inspect branch tracking status. Check git status for uncommitted files. If everything is clean, summarize git log -n 3. Record all key findings into persistent memory.`,
    schedule: { kind: "interval", every: "30m" },
    priority: "normal",
    adaptive: { enabled: true, burstEveryMs: 60_000, idleEveryMs: 1_800_000, quietThreshold: 3 },
  },
  {
    id: "system-health",
    name: "Host System Health & Disk Monitor",
    category: "monitoring",
    description: "Monitors disk usage, available memory, and process health. Flags thresholds above 85% disk usage.",
    tags: ["system", "health", "metrics"],
    systemPrompt: `You are a system reliability engineer. Monitor host resources (disk space, memory, node processes), detect resource exhaustion risks, and notify when thresholds are exceeded.`,
    followupPrompt: `Check current disk usage (df -h) and memory stats. If disk usage exceeds 85%, report a high-priority warning. Save status and resource percentages in persistent memory.`,
    schedule: { kind: "interval", every: "15m" },
    priority: "high",
  },
  {
    id: "security-audit",
    name: "NPM Vulnerability & Security Scanner",
    category: "security",
    description: "Runs npm/bun security audits to discover known CVEs and outdated critical dependencies.",
    tags: ["security", "audit", "npm"],
    systemPrompt: `You are an automated application security auditor. Scan project dependencies for known vulnerabilities, classify severity levels (Critical, High, Moderate), and suggest fix commands.`,
    followupPrompt: `Run package audit or dependency vulnerability check. If vulnerabilities exist, detail affected packages, advisory IDs, and remediation steps. Save advisory summaries to persistent memory.`,
    schedule: { kind: "cron", cron: "0 8 * * 1" }, // Every Monday at 8:00 AM
    priority: "normal",
  },
  {
    id: "changelog-generator",
    name: "Daily Git Commit & Changelog Digest",
    category: "documentation",
    description: "Inspects git commit history from the last 24 hours, categorizes features, fixes, and chores, and appends to CHANGELOG.md.",
    tags: ["git", "changelog", "docs"],
    systemPrompt: `You are a release management assistant. Generate clean, user-facing changelog summaries from conventional commits, highlighting user-visible features and bug fixes.`,
    followupPrompt: `Review git commits over the last 24 hours. Group changes by Features, Fixes, and Maintenance. Formulate a markdown changelog entry and update memory with the latest commit hash processed.`,
    schedule: { kind: "cron", cron: "0 18 * * 1-5" }, // Weekdays at 6:00 PM
    priority: "normal",
  },
  {
    id: "db-backup-prune",
    name: "Database Snapshot & Automated Pruning",
    category: "maintenance",
    description: "Triggers a database backup script and safely removes backup snapshots older than 14 days.",
    tags: ["database", "backup", "prune"],
    systemPrompt: `You are a database operations manager. Execute backup routines, verify file integrity and non-zero byte size, and prune obsolete historical snapshots safely.`,
    followupPrompt: `Verify backup directory integrity. Prune snapshots older than 14 days. Ensure the most recent snapshot is intact and record snapshot metadata into persistent memory.`,
    schedule: { kind: "cron", cron: "0 2 * * *" }, // Daily at 2:00 AM
    priority: "high",
  },
  {
    id: "ai-standup-digest",
    name: "Team Standup Digest from Repositories",
    category: "productivity",
    description: "Summarizes active branch progress, recent PRs, and blockers across workspaces to prepare morning standups.",
    tags: ["standup", "team", "ai"],
    systemPrompt: `You are a technical project manager. Gather progress summaries from recent commits, closed issues, and open branches to formulate concise daily standup bullet points.`,
    followupPrompt: `Analyze repository activity from yesterday. Produce a 3-part bullet summary: 1. Completed yesterday, 2. Planned today, 3. Potential blockers. Store summary in persistent memory.`,
    schedule: { kind: "cron", cron: "0 9 * * 1-5" }, // Weekdays at 9:00 AM
    priority: "normal",
  },
];

export function listJobTemplates(): JobTemplate[] {
  return BUILTIN_TEMPLATES;
}

export function getJobTemplate(templateId: string): JobTemplate | undefined {
  return BUILTIN_TEMPLATES.find((t) => t.id === templateId);
}

/**
 * Instantiate a job from a template into the specified directory.
 */
export async function applyJobTemplate(
  directory: string,
  templateId: string,
  overrides?: {
    id?: string;
    title?: string;
    schedule?: string;
    priority?: "high" | "normal" | "low";
  }
): Promise<CronJob> {
  const tpl = getJobTemplate(templateId);
  if (!tpl) {
    throw new Error(`Job template "${templateId}" not found. Available: ${BUILTIN_TEMPLATES.map((t) => t.id).join(", ")}`);
  }

  const id = overrides?.id || `${tpl.id}-${Date.now().toString(36).slice(-4)}`;
  assertJobId(id);
  const title = overrides?.title || tpl.name;

  let schedule = tpl.schedule;
  if (overrides?.schedule) {
    const norm = normalizeSchedule({ cron: overrides.schedule, every: overrides.schedule });
    schedule = {
      kind: norm.kind,
      cron: norm.cron,
      everyMs: norm.everyMs,
    };
  }

  const job: CronJob = {
    id,
    sessionID: `ses-${id}`,
    directory,
    title,
    systemPrompt: tpl.systemPrompt,
    followupPrompt: tpl.followupPrompt,
    schedule: {
      kind: schedule.kind,
      cron: schedule.cron,
      everyMs: schedule.everyMs,
      every: schedule.every,
    },
    tags: [...tpl.tags],
    category: tpl.category,
    priority: overrides?.priority || tpl.priority || "normal",
    adaptive: tpl.adaptive ? { ...tpl.adaptive } as any : undefined,
    guard: tpl.guard ? { ...tpl.guard } as any : undefined,
    enabled: true,
    catchUp: false,
    skipIfRunning: true,
    maxRuns: 0,
    maxConsecutiveFailures: 5,
    runCount: 0,
    consecutiveFailures: 0,
    createdAt: new Date().toISOString(),
    lastRunAt: null,
    nextRunAt: null,
  };

  job.nextRunAt = computeNextRun(job);
  CronJobSchema.parse(job);

  await upsertJob(directory, job);
  const initialMd = initialMemoryMd({
    title: job.title,
    systemPrompt: job.systemPrompt,
    followupPrompt: job.followupPrompt,
  });
  await writeMemory(directory, job.id, initialMd, {
    seenHashes: [],
    counts: { news: 0, tweets: 0 },
    lastRunAt: null,
    consecutiveFailures: 0,
  });

  return job;
}
