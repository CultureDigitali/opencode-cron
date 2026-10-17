import { describe, it, expect } from "bun:test";
import {
  loadNotificationConfig,
  saveNotificationConfig,
  dispatchJobNotification,
} from "../src/notifications";
import fs from "fs/promises";
import os from "os";
import path from "path";
import type { CronJob, NotificationConfig } from "../src/types";

describe("Feature 8: Multi-Channel Alerting & Notification Engine", () => {
  it("loads default config when file does not exist", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-notif-"));
    try {
      const cfg = await loadNotificationConfig(tmp);
      expect(cfg.channels).toEqual([]);
      expect(cfg.cooldownSeconds).toBe(300);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("saves and reloads notification channels cleanly", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-notif-"));
    try {
      const config: NotificationConfig = {
        channels: [
          {
            id: "slack-alerts",
            name: "DevOps Slack Channel",
            type: "slack",
            url: "https://example.com/slack/webhook",
            enabled: true,
            events: ["onFailure", "onCircuitTrip"],
          },
          {
            id: "discord-ops",
            name: "Engineering Discord",
            type: "discord",
            url: "https://example.com/discord/webhook",
            enabled: false,
            events: ["onDLQ"],
          },
        ],
        cooldownSeconds: 60,
      };

      await saveNotificationConfig(tmp, config);
      const reloaded = await loadNotificationConfig(tmp);
      expect(reloaded.channels).toHaveLength(2);
      expect(reloaded.channels[0].name).toBe("DevOps Slack Channel");
      expect(reloaded.cooldownSeconds).toBe(60);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("filters channels by matching event and enabled status", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "cron-notif-"));
    try {
      const config: NotificationConfig = {
        channels: [
          {
            id: "webhook-logger",
            name: "Logger Webhook",
            type: "webhook",
            url: "https://example.com/log",
            enabled: true,
            events: ["onFailure"],
          },
        ],
        cooldownSeconds: 10,
      };
      await saveNotificationConfig(tmp, config);

      const job: CronJob = {
        id: "alert-job",
        sessionID: "ses-1",
        directory: tmp,
        title: "Alert Job",
        systemPrompt: "sys",
        followupPrompt: "fup",
        schedule: { kind: "interval", everyMs: 60000 },
        tags: [],
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

      // Dispatches on matching event 'onFailure'
      const count1 = await dispatchJobNotification(tmp, "onFailure", job, {
        errorMessage: "Test failure with secret token Bearer abc1234567890123456",
      });
      expect(count1).toBe(1);

      // Skips on non-matching event 'onSuccess'
      const count2 = await dispatchJobNotification(tmp, "onSuccess", job);
      expect(count2).toBe(0);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

