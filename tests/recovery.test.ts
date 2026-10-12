import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { loadJobs, saveJobs } from "../src/store.ts";
import { CronScheduler } from "../src/scheduler.ts";
import { CronJob } from "../src/types.ts";

describe("Disaster Recovery & Store Hardening", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "store-recovery-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("creates a corrupt backup and throws instead of wiping jobs on malformed JSON", async () => {
    const cronDir = path.join(tmpDir, ".opencode", "cron");
    await fs.mkdir(cronDir, { recursive: true });
    const jobsFile = path.join(cronDir, "jobs.json");

    // Write truncated/malformed JSON
    await fs.writeFile(jobsFile, '{"id": "job-1", "unclosed": [', "utf-8");

    // Attempting loadJobs must throw, NOT silently return []
    expect(loadJobs(tmpDir)).rejects.toThrow(/Corrupted jobs.json/);

    // Verify a .corrupt.<timestamp> backup file was created
    const files = await fs.readdir(cronDir);
    const backupFile = files.find((f) => f.startsWith("jobs.json.corrupt."));
    expect(backupFile).toBeDefined();

    const backupContent = await fs.readFile(path.join(cronDir, backupFile!), "utf-8");
    expect(backupContent).toBe('{"id": "job-1", "unclosed": [');
  });

  it("atomic saveJobs handles concurrent writes without collision", async () => {
    const sampleJob: CronJob = {
      id: "concurrent-job",
      sessionID: "ses-1",
      directory: tmpDir,
      title: "Concurrent Test",
      systemPrompt: "Sys",
      followupPrompt: "Fup",
      schedule: { kind: "interval", everyMs: 60000 },
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

    // Run 10 parallel saves
    await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        saveJobs(tmpDir, [{ ...sampleJob, runCount: i }])
      )
    );

    // Reading jobs back should succeed and not be corrupted
    const loaded = await loadJobs(tmpDir);
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe("concurrent-job");
  });
});

describe("Scheduler Dynamic Resync", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "scheduler-resync-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("clears old timers and arms new ones when nextRunAt changes", async () => {
    let tickCount = 0;
    const promptSession = async () => { tickCount++; };
    const inFlight = new Set<string>();
    const scheduler = new CronScheduler({ promptSession, inFlight });

    const job: CronJob = {
      id: "resync-job",
      sessionID: "ses-1",
      directory: tmpDir,
      title: "Resync Job",
      systemPrompt: "Sys",
      followupPrompt: "Fup",
      schedule: { kind: "interval", everyMs: 60000 },
      enabled: true,
      catchUp: false,
      skipIfRunning: true,
      maxRuns: 0,
      maxConsecutiveFailures: 5,
      runCount: 0,
      consecutiveFailures: 0,
      createdAt: new Date().toISOString(),
      lastRunAt: null,
      nextRunAt: new Date(Date.now() + 50000).toISOString(),
    };

    await saveJobs(tmpDir, [job]);
    await scheduler.start(tmpDir);

    // Update job to a new schedule (e.g. 10m) and resync
    job.schedule.everyMs = 600000;
    job.nextRunAt = new Date(Date.now() + 600000).toISOString();
    await saveJobs(tmpDir, [job]);

    // Resyncing must not crash or leak timers
    await scheduler.resync(tmpDir);

    scheduler.stop();
  });
});

