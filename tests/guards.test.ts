import { describe, it, expect } from "bun:test";
import { evaluateJobGuard } from "../src/guards";

describe("Feature 14: Pre-Flight Guard Engine", () => {
  it("passes immediately when guard is disabled or undefined", async () => {
    const res1 = await evaluateJobGuard(undefined);
    expect(res1.passed).toBe(true);
    expect(res1.skipped).toBe(false);

    const res2 = await evaluateJobGuard({ enabled: false });
    expect(res2.passed).toBe(true);
  });

  it("evaluates successful command check (exit 0)", async () => {
    const res = await evaluateJobGuard({
      enabled: true,
      command: "echo 'ready'",
      timeoutMs: 2000,
      expectedStatus: 200,
    });
    expect(res.passed).toBe(true);
    expect(res.skipped).toBe(false);
  });

  it("handles failing command check (non-zero exit code)", async () => {
    const res = await evaluateJobGuard({
      enabled: true,
      command: "exit 1",
      timeoutMs: 2000,
      expectedStatus: 200,
    });
    expect(res.passed).toBe(false);
    expect(res.skipped).toBe(true);
    expect(res.reason).toContain("Command guard check failed");
  });

  it("handles command timeout cleanly", async () => {
    const res = await evaluateJobGuard({
      enabled: true,
      command: "sleep 2",
      timeoutMs: 50,
      expectedStatus: 200,
    });
    expect(res.passed).toBe(false);
    expect(res.skipped).toBe(true);
  });
});

