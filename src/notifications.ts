// src/notifications.ts - Multi-Channel Alerting & Notification Engine
import fs from "fs/promises";
import path from "path";
import { cronDir } from "./store.ts";
import { redactSensitiveData } from "./redact.ts";
import {
  type CronJob,
  type NotificationChannel,
  type NotificationConfig,
  type NotificationEvent,
  NotificationConfigSchema,
} from "./types.ts";
import { replaceFile } from "./atomic.ts";

function notificationsFile(directory: string): string {
  return path.join(cronDir(directory), "notifications.json");
}

const lastDispatchedMap = new Map<string, number>();

export async function loadNotificationConfig(directory: string): Promise<NotificationConfig> {
  try {
    const raw = await fs.readFile(notificationsFile(directory), "utf-8");
    const parsed = JSON.parse(raw);
    const valid = NotificationConfigSchema.safeParse(parsed);
    if (valid.success) return valid.data;
  } catch {
    // Return empty default config
  }
  return { channels: [], cooldownSeconds: 300 };
}

export async function saveNotificationConfig(
  directory: string,
  config: NotificationConfig
): Promise<void> {
  const file = notificationsFile(directory);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(tmp, JSON.stringify(config, null, 2), "utf-8");
  await replaceFile(tmp, file);
}

export async function sendTestNotification(
  channel: NotificationChannel
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const testPayload = {
    event: "test",
    title: "OpenCode Cron Test Notification",
    message: `Test alert from opencode-cron channel "${channel.name}"`,
    timestamp: new Date().toISOString(),
  };

  return postToChannel(channel, "onFailure", {
    id: "test-job",
    title: "Test Cron Job",
  } as any, testPayload);
}

async function postToChannel(
  channel: NotificationChannel,
  event: NotificationEvent,
  job: CronJob,
  details?: Record<string, any>
): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    let body: any;
    const sanitizedError = redactSensitiveData(details?.errorMessage || details?.reason || "");
    const title = `[OpenCode Cron] ${event.toUpperCase()}: ${job.title} (${job.id})`;

    if (channel.type === "slack") {
      body = {
        text: title,
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: title.slice(0, 150) },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Job ID:* \`${job.id}\`` },
              { type: "mrkdwn", text: `*Event:* \`${event}\`` },
              { type: "mrkdwn", text: `*Time:* ${new Date().toISOString()}` },
            ],
          },
        ],
      };
      if (sanitizedError) {
        body.blocks.push({
          type: "section",
          text: { type: "mrkdwn", text: `*Details:*\n\`\`\`${sanitizedError.slice(0, 1000)}\`\`\`` },
        });
      }
    } else if (channel.type === "discord") {
      body = {
        content: `**${title}**`,
        embeds: [
          {
            title: job.title,
            description: sanitizedError ? `\`\`\`${sanitizedError.slice(0, 1000)}\`\`\`` : undefined,
            color: event === "onSuccess" || event === "onRecovery" ? 0x10b981 : 0xef4444,
            fields: [
              { name: "Job ID", value: job.id, inline: true },
              { name: "Event", value: event, inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };
    } else {
      // Generic Webhook
      body = {
        event,
        jobId: job.id,
        jobTitle: job.title,
        timestamp: new Date().toISOString(),
        details: {
          ...details,
          errorMessage: sanitizedError || undefined,
        },
      };
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "opencode-cron-notifier/1.0",
    };
    if (channel.secret) {
      headers["X-Notification-Secret"] = channel.secret;
    }

    const resp = await fetch(channel.url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    return { ok: resp.ok, status: resp.status };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * Dispatch notification alerts to all matching configured channels for an event.
 */
export async function dispatchJobNotification(
  directory: string,
  event: NotificationEvent,
  job: CronJob,
  details?: Record<string, any>
): Promise<number> {
  const config = await loadNotificationConfig(directory);
  if (!config.channels || !config.channels.length) return 0;

  const now = Date.now();
  const cooldownMs = (config.cooldownSeconds ?? 300) * 1000;
  let dispatched = 0;

  for (const channel of config.channels) {
    if (!channel.enabled) continue;
    if (!channel.events.includes(event)) continue;

    const key = `${channel.id}:${job.id}:${event}`;
    const lastTime = lastDispatchedMap.get(key) || 0;
    if (now - lastTime < cooldownMs && event !== "onRecovery") {
      // Cooldown active, skip to prevent alert storms
      continue;
    }

    lastDispatchedMap.set(key, now);
    postToChannel(channel, event, job, details).catch(() => {});
    dispatched += 1;
  }

  return dispatched;
}
