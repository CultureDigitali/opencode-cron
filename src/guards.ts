// src/guards.ts - Pre-Flight Guard & Condition Health-Check Engine
import { exec } from "child_process";
import { promisify } from "util";
import type { JobGuard } from "./types.ts";

const execAsync = promisify(exec);

export interface GuardCheckResult {
  passed: boolean;
  skipped: boolean;
  reason?: string;
  durationMs: number;
}

/**
 * Evaluates whether a job's pre-flight conditions are satisfied before running.
 * If the guard is disabled or undefined, it passes immediately.
 */
export async function evaluateJobGuard(
  guard?: JobGuard,
  directory?: string
): Promise<GuardCheckResult> {
  if (!guard || !guard.enabled) {
    return { passed: true, skipped: false, durationMs: 0 };
  }

  const start = Date.now();
  const timeoutMs = Math.min(Math.max(guard.timeoutMs ?? 5000, 1000), 60_000);

  // 1. HTTP URL Health-check
  if (guard.httpUrl) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const resp = await fetch(guard.httpUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "opencode-cron-guard/1.0",
        },
      });
      clearTimeout(timer);

      const expected = guard.expectedStatus ?? 200;
      if (resp.status !== expected) {
        return {
          passed: false,
          skipped: true,
          reason: `HTTP guard check failed: expected status ${expected}, got ${resp.status}`,
          durationMs: Date.now() - start,
        };
      }
    } catch (err: any) {
      return {
        passed: false,
        skipped: true,
        reason: `HTTP guard check error: ${err.message}`,
        durationMs: Date.now() - start,
      };
    }
  }

  // 2. Command Check
  if (guard.command) {
    try {
      await execAsync(guard.command, {
        cwd: directory || process.cwd(),
        timeout: timeoutMs,
      });
    } catch (err: any) {
      const exitCode = err.code ?? (err.killed ? "TIMED_OUT" : "ERROR");
      return {
        passed: false,
        skipped: true,
        reason: `Command guard check failed (code: ${exitCode}): ${err.stderr || err.message}`,
        durationMs: Date.now() - start,
      };
    }
  }

  return {
    passed: true,
    skipped: false,
    durationMs: Date.now() - start,
  };
}
