import { z } from "zod";

export const ScheduleSchema = z.object({
  kind: z.enum(["interval", "cron"]).default("interval"),
  everyMs: z.number().int().min(60_000).optional(),
  every: z.string().optional(),
  cron: z.string().optional(),
  timezone: z.string().optional(),
});

export const CronJobSchema = z.object({
  id: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  sessionID: z.string().min(1),
  directory: z.string().min(1),
  title: z.string().min(1).max(200),
  systemPrompt: z.string().min(1),
  followupPrompt: z.string().min(1),
  schedule: ScheduleSchema,
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
});

export type Schedule = z.infer<typeof ScheduleSchema>;
export type CronJob = z.infer<typeof CronJobSchema>;

export const MemoryStateSchema = z.object({
  seenHashes: z.array(z.string()).default([]),
  counts: z.object({ news: z.number().default(0), tweets: z.number().default(0) }).default({ news: 0, tweets: 0 }),
  lastRunAt: z.string().nullable().default(null),
  consecutiveFailures: z.number().default(0),
});

export type MemoryState = z.infer<typeof MemoryStateSchema>;
