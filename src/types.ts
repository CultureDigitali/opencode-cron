import { z } from "zod";

export const ScheduleSchema = z.object({
  kind: z.enum(["interval", "cron"]).default("interval"),
  everyMs: z.number().int().min(60_000).optional(),
  every: z.string().optional(),
  cron: z.string().optional(),
  timezone: z.string().optional(),
}).refine(
  (data) => data.everyMs !== undefined || data.every !== undefined || data.cron !== undefined,
  { message: "Schedule must specify everyMs, every, or cron" }
);

export const AdaptiveCadenceSchema = z.enum(["burst", "normal", "idle"]);
export type AdaptiveCadence = z.infer<typeof AdaptiveCadenceSchema>;

export const JobPrioritySchema = z.enum(["high", "normal", "low"]).default("normal");
export type JobPriority = z.infer<typeof JobPrioritySchema>;

export const CronSettingsSchema = z.object({
  maxConcurrency: z.number().int().min(1).max(10).default(2),
});
export type CronSettings = z.infer<typeof CronSettingsSchema>;

export type QueueSource = "schedule" | "manual" | "webhook" | "pipeline";
export type QueueItemStatus = "queued" | "running" | "completed" | "failed" | "skipped";

export interface QueueItem {
  id: string;
  jobId: string;
  priority: JobPriority;
  source: QueueSource;
  enqueuedAt: string;
  startedAt?: string;
  finishedAt?: string;
  status: QueueItemStatus;
  error?: string;
}

export interface QueueStatus {
  maxConcurrency: number;
  activeCount: number;
  queuedCount: number;
  running: QueueItem[];
  queued: QueueItem[];
}

export const AdaptiveScheduleSchema = z.object({
  enabled: z.boolean().default(false),
  burstEveryMs: z.number().int().min(60_000).default(60_000),
  idleEveryMs: z.number().int().min(60_000).default(1_800_000),
  quietThreshold: z.number().int().min(1).default(3),
  consecutiveQuietTicks: z.number().int().min(0).default(0),
  currentCadence: AdaptiveCadenceSchema.default("normal"),
  activeUntil: z.string().nullable().optional().default(null),
}).refine(
  (d) => !d.enabled || d.burstEveryMs <= d.idleEveryMs,
  { message: "burstEveryMs must be less than or equal to idleEveryMs" }
);

export type AdaptiveSchedule = z.infer<typeof AdaptiveScheduleSchema>;

export const PipelineTargetJobIdSchema = z.string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Target Job ID must contain only lowercase alphanumeric characters and hyphens [a-z0-9-]");

export const PipelineConfigSchema = z.object({
  enabled: z.boolean().default(false),
  onSuccess: z.array(PipelineTargetJobIdSchema)
    .max(20)
    .default([])
    .transform((arr) => Array.from(new Set(arr))),
  onFailure: z.array(PipelineTargetJobIdSchema)
    .max(20)
    .default([])
    .transform((arr) => Array.from(new Set(arr))),
  passPayload: z.boolean().default(false),
  maxDepth: z.number().int().min(1).max(10).default(5),
}).refine(
  (d) => !d.onSuccess.some((id) => d.onFailure.includes(id)),
  { message: "A job cannot be both in onSuccess and onFailure for the same step" }
);

export type PipelineConfig = z.infer<typeof PipelineConfigSchema>;

export const WebhookConfigSchema = z.object({
  enabled: z.boolean().default(false),
  token: z.string().min(16).max(128).regex(/^[A-Za-z0-9_-]+$/).optional(),
  secret: z.string().min(8).max(128).optional(),
  passPayload: z.boolean().default(true),
  rateLimitSeconds: z.number().int().min(1).max(3600).default(5),
  lastTriggeredAt: z.string().nullable().optional().default(null),
});

export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;

export const CronJobSchema = z.object({
  id: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  sessionID: z.string().min(1),
  directory: z.string().min(1),
  title: z.string().min(1).max(200),
  systemPrompt: z.string().min(1),
  followupPrompt: z.string().min(1),
  schedule: ScheduleSchema,
  adaptive: AdaptiveScheduleSchema.optional(),
  pipeline: PipelineConfigSchema.optional(),
  webhook: WebhookConfigSchema.optional(),
  priority: JobPrioritySchema.optional(),
  agent: z.string().optional(),
  model: z.string().optional(),
  enabled: z.boolean().default(true),
  catchUp: z.boolean().default(false),
  skipIfRunning: z.boolean().default(true),
  maxRuns: z.number().int().min(0).default(0),
  maxConsecutiveFailures: z.number().int().min(1).default(5),
  runCount: z.number().int().min(0).default(0),
  consecutiveFailures: z.number().int().min(0).default(0),
  createdAt: z.string(),
  lastRunAt: z.string().nullable().default(null),
  nextRunAt: z.string().nullable().default(null),
}).refine(
  (job) => !job.pipeline || (!job.pipeline.onSuccess.includes(job.id) && !job.pipeline.onFailure.includes(job.id)),
  { message: "A job cannot trigger itself in its pipeline (self-loop detected)" }
);

export type Schedule = z.infer<typeof ScheduleSchema>;
export type CronJob = z.infer<typeof CronJobSchema>;

export const MemoryStateSchema = z.object({
  seenHashes: z.array(z.string()).default([]),
  counts: z.record(z.string(), z.number()).default({ news: 0, tweets: 0 }),
  lastRunAt: z.string().nullable().default(null),
  consecutiveFailures: z.number().default(0),
  hasActivity: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type MemoryState = z.infer<typeof MemoryStateSchema>;
