// src/redact.ts - Sensitive credential and secret masking engine

const SECRET_PATTERNS: Array<{ regex: RegExp; replace: string | ((substring: string, ...args: any[]) => string) }> = [
  // Private keys (PEM format)
  {
    regex: /-----BEGIN [A-Z0-9\s]+PRIVATE KEY-----[\s\S]*?-----END [A-Z0-9\s]+PRIVATE KEY-----/g,
    replace: "[REDACTED_PRIVATE_KEY]",
  },
  // Basic auth credentials in URLs: http://user:pass@host
  {
    regex: /(https?:\/\/)([^:\/\s]+):([^@\/\s]+)@/g,
    replace: "$1$2:[REDACTED_CREDENTIALS]@",
  },
  // Bearer tokens
  {
    regex: /(Bearer\s+)[A-Za-z0-9_\-\.]{16,}/gi,
    replace: "$1[REDACTED_TOKEN]",
  },
  // GitHub Personal Access Tokens and OAuth tokens
  {
    regex: /\b(gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g,
    replace: "[REDACTED_GITHUB_TOKEN]",
  },
  // OpenAI & Anthropic API keys (sk-...)
  {
    regex: /\b(sk-[A-Za-z0-9_-]{20,})\b/g,
    replace: "[REDACTED_AI_API_KEY]",
  },
  // Google / Gemini API keys (AIzaSy...)
  {
    regex: /\b(AIzaSy[A-Za-z0-9_-]{30,})\b/g,
    replace: "[REDACTED_GOOGLE_KEY]",
  },
  // AWS Access Key ID
  {
    regex: /\b(AKIA[0-9A-Z]{16})\b/g,
    replace: "[REDACTED_AWS_KEY]",
  },
  // Slack Webhook URLs
  {
    regex: /https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9_\/]+/g,
    replace: "https://hooks.slack.com/services/[REDACTED_SLACK_WEBHOOK]",
  },
  // Discord Webhook URLs
  {
    regex: /https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+/g,
    replace: "https://discord.com/api/webhooks/[REDACTED_DISCORD_WEBHOOK]",
  },
  // opencode-cron Webhook Tokens (whk_...)
  {
    regex: /\b(whk_[A-Za-z0-9_-]{16,})\b/g,
    replace: "[REDACTED_WEBHOOK_TOKEN]",
  },
  // URL query parameters containing tokens, secrets, or passwords
  {
    regex: /([?&](?:token|secret|password|api_key|access_token|apikey)=)([^&\s]+)/gi,
    replace: "$1[REDACTED]",
  },
];

/**
 * Mask sensitive credentials, tokens, keys, and authorization headers in a string.
 */
export function redactSensitiveData(input: string | null | undefined): string {
  if (!input) return "";
  let result = String(input);
  for (const { regex, replace } of SECRET_PATTERNS) {
    result = result.replace(regex, replace as any);
  }
  return result;
}

/**
 * Deep clone an object and recursively redact all string values and sensitive keys.
 */
export function redactObject<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === "string") {
    return redactSensitiveData(data) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => redactObject(item)) as unknown as T;
  }
  if (typeof data === "object") {
    const output: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("password") ||
        lowerKey.includes("secret") ||
        lowerKey.includes("token") ||
        lowerKey.includes("auth") ||
        lowerKey.includes("apikey") ||
        lowerKey.includes("api_key")
      ) {
        if (typeof value === "string" && value.length > 0) {
          output[key] = "[REDACTED]";
          continue;
        }
      }
      output[key] = redactObject(value);
    }
    return output as T;
  }
  return data;
}

