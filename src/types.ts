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
  retentionDays: z.number().int().min(1).max(365).default(30),
  maxHistoryRunsPerJob: z.number().int().min(10).max(5000).default(200),
  autoBackupEnabled: z.boolean().default(true),
  maxBackups: z.number().int().min(1).max(50).default(10),
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

export const CircuitStateSchema = z.enum(["closed", "open", "half-open"]);
export type CircuitState = z.infer<typeof CircuitStateSchema>;

export const CircuitBreakerConfigSchema = z.object({
  state: CircuitStateSchema.default("closed"),
  trippedAt: z.string().nullable().optional().default(null),
  resetTimeoutMs: z.number().int().min(60_000).max(86_400_000).default(1800_000),
  halfOpenAt: z.string().nullable().optional().default(null),
  lastFailureReason: z.string().nullable().optional().default(null),
});
export type CircuitBreakerConfig = z.infer<typeof CircuitBreakerConfigSchema>;

export const DLQEntrySchema = z.object({
  id: z.string().min(1),
  jobId: z.string().min(1),
  jobTitle: z.string(),
  sessionID: z.string(),
  directory: z.string(),
  failedAt: z.string(),
  exitCode: z.number().nullable().optional().default(null),
  errorMessage: z.string(),
  consecutiveFailures: z.number().int().default(1),
  lastPayload: z.record(z.any()).optional(),
  status: z.enum(["quarantined", "resolved", "ignored"]).default("quarantined"),
  resolvedAt: z.string().nullable().optional().default(null),
  retryCount: z.number().int().default(0),
});
export type DLQEntry = z.infer<typeof DLQEntrySchema>;

export const JobGuardSchema = z.object({
  enabled: z.boolean().default(false),
  command: z.string().max(1024).optional(),
  httpUrl: z.string().url().max(1024).optional(),
  expectedStatus: z.number().int().min(100).max(599).default(200).optional(),
  timeoutMs: z.number().int().min(1000).max(60_000).default(5000).optional(),
});
export type JobGuard = z.infer<typeof JobGuardSchema>;

export const NotificationChannelTypeSchema = z.enum(["slack", "discord", "webhook"]);
export type NotificationChannelType = z.infer<typeof NotificationChannelTypeSchema>;

export const NotificationEventSchema = z.enum([
  "onFailure",
  "onCircuitTrip",
  "onDLQ",
  "onSuccess",
  "onRecovery",
]);
export type NotificationEvent = z.infer<typeof NotificationEventSchema>;

export const NotificationChannelSchema = z.object({
  id: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  type: NotificationChannelTypeSchema,
  url: z.string().url(),
  enabled: z.boolean().default(true),
  events: z.array(NotificationEventSchema).default(["onFailure", "onCircuitTrip", "onDLQ"]),
  secret: z.string().optional(),
});
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const NotificationConfigSchema = z.object({
  channels: z.array(NotificationChannelSchema).default([]),
  cooldownSeconds: z.number().int().min(10).max(3600).default(300),
});
export type NotificationConfig = z.infer<typeof NotificationConfigSchema>;

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
  circuitBreaker: CircuitBreakerConfigSchema.optional(),
  guard: JobGuardSchema.optional(),
  tags: z.array(z.string().min(1).max(30).regex(/^[a-z0-9_-]+$/)).max(10).optional(),
  category: z.string().max(50).optional(),
  timeoutMs: z.number().int().min(5000).max(3_600_000).optional(),
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

export interface JobTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  systemPrompt: string;
  followupPrompt: string;
  schedule: {
    kind: "interval" | "cron";
    every?: string;
    everyMs?: number;
    cron?: string;
    timezone?: string;
  };
  priority?: JobPriority;
  adaptive?: Partial<AdaptiveSchedule>;
  guard?: Partial<JobGuard>;
}

export interface BackupMetadata {
  id: string;
  createdAt: string;
  note?: string;
  jobCount: number;
  byteSize: number;
  checksum: string;
  files: string[];
}

export interface JobMetrics {
  totalRuns: number;
  successRuns: number;
  failedRuns: number;
  skippedRuns: number;
  timeoutRuns: number;
  lastDurationMs?: number;
  avgDurationMs: number;
  minDurationMs: number;
  maxDurationMs: number;
  p95DurationMs: number;
  lastRunAt?: string;
}

export interface SystemMetrics {
  uptimeSeconds: number;
  totalJobs: number;
  activeJobs: number;
  quarantinedJobs: number;
  activeWorkers: number;
  queuedTasks: number;
  dlqTotal: number;
  circuitOpenTotal: number;
  jobs: Record<string, JobMetrics>;
}

