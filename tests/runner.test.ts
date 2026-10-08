import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";

// Guards the live-discovered bug: `opencode run` (v2.0.10) has no --dir flag.
// The headless runner must pass the job directory via spawn cwd, never as --dir.
describe("headless runner opencode compat", () => {
  it("never passes --dir to `opencode run`", async () => {
    const src = await fs.readFile(new URL("../bin/run.ts", import.meta.url), "utf-8");
    const spawnLine = src.split("\n").find((l) => l.includes('spawn("opencode"'));
    expect(spawnLine).toBeDefined();
    expect(src).not.toMatch(/"run",\s*"--session",\s*job\.sessionID,\s*"--dir"/);
    expect(spawnLine!).toContain("cwd");
  });
});
