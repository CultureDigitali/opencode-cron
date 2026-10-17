import { describe, it, expect } from "bun:test";
import { listJobTemplates, getJobTemplate, applyJobTemplate } from "../src/templates";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { loadJobs } from "../src/store";

describe("Feature 9: Job Template & Blueprint Engine", () => {
  it("lists all available builtin templates", () => {
    const list = listJobTemplates();
    expect(list.length).toBeGreaterThanOrEqual(6);
    expect(list.some((t) => t.id === "git-auto-sync")).toBe(true);
    expect(list.some((t) => t.id === "system-health")).toBe(true);
    expect(list.some((t) => t.id === "security-audit")).toBe(true);
  });

  it("retrieves template details by id", () => {
    const tpl = getJobTemplate("system-health");
    expect(tpl).toBeDefined();
    expect(tpl?.category).toBe("monitoring");
    expect(tpl?.tags).toContain("metrics");
  });

  it("applies a template, creating the job and memory store", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-tpl-"));
    try {
      const job = await applyJobTemplate(tmp, "git-auto-sync", {
        id: "my-custom-sync",
        title: "Team Repo Sync",
      });

      expect(job.id).toBe("my-custom-sync");
      expect(job.title).toBe("Team Repo Sync");
      expect(job.tags).toContain("git");
      expect(job.nextRunAt).toBeDefined();

      const jobs = await loadJobs(tmp);
      expect(jobs.some((j) => j.id === "my-custom-sync")).toBe(true);

      const memPath = path.join(tmp, ".opencode", "cron", "memory", "my-custom-sync.md");
      const memExists = await fs.stat(memPath).then(() => true).catch(() => false);
      expect(memExists).toBe(true);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("throws for unknown template ID", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-tpl-"));
    try {
      expect(applyJobTemplate(tmp, "non-existent-template")).rejects.toThrow("not found");
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

