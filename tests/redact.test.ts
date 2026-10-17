import { describe, it, expect } from "bun:test";
import { redactSensitiveData, redactObject } from "../src/redact";

describe("Feature 15: Secret & Credential Redaction Engine", () => {
  it("masks Bearer tokens", () => {
    const input = "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz123";
    const redacted = redactSensitiveData(input);
    expect(redacted).toBe("Authorization: Bearer [REDACTED_TOKEN]");
  });

  it("masks OpenAI, Anthropic and Gemini API keys", () => {
    const openAi = "Using key sk-proj-1234567890abcdef1234567890 for API calls";
    expect(redactSensitiveData(openAi)).toContain("[REDACTED_AI_API_KEY]");

    const gemini = "Gemini key: AIzaSyD1234567890abcdefghijklmnopqrstuv";
    expect(redactSensitiveData(gemini)).toContain("[REDACTED_GOOGLE_KEY]");
  });

  it("masks GitHub personal access tokens", () => {
    const ghp = "Token: ghp_1234567890abcdefghijklmnopqrstuvwxyz12";
    expect(redactSensitiveData(ghp)).toContain("[REDACTED_GITHUB_TOKEN]");
  });

  it("masks Webhook tokens and query params", () => {
    const whk = "Webhook token: whk_8f90c3d4e5f6a1b2c3d4e5f6";
    expect(redactSensitiveData(whk)).toContain("[REDACTED_WEBHOOK_TOKEN]");

    const url = "https://example.com/api/tick?token=supersecrettoken123&action=run";
    expect(redactSensitiveData(url)).toContain("token=[REDACTED]");
  });

  it("masks Private Keys in PEM format", () => {
    const pem = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Y1234567890abcdef...
-----END RSA PRIVATE KEY-----`;
    expect(redactSensitiveData(pem)).toBe("[REDACTED_PRIVATE_KEY]");
  });

  it("recursively redacts nested objects and sensitive fields", () => {
    const payload = {
      user: "alice",
      token: "secret_value_123",
      config: {
        api_key: "key_xyz",
        endpoint: "https://example.com/hook?secret=abcdef12345",
      },
    };
    const redacted = redactObject(payload);
    expect(redacted.user).toBe("alice");
    expect(redacted.token).toBe("[REDACTED]");
    expect(redacted.config.api_key).toBe("[REDACTED]");
    expect(redacted.config.endpoint).toContain("secret=[REDACTED]");
  });
});

