import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { saveJobs } from "../src/store.ts";
import { writeMemory } from "../src/memory.ts";
import { acquireLock, releaseLock, checkDue, tickArgs, resolveOpencodeBin, readHttpPromptConfig, promptViaHttp, writeCredentialsFile, switchModelViaHttp, repinSessionModel } from "../src/runner.ts";

const job = (id: string, dir: string, over: Record<string, any> = {}) => ({
  id,
  sessionID: "ses_1",
  directory: dir,
  title: "T",
  systemPrompt: "SYS",
  followupPrompt: "FUP",
  schedule: { kind: "interval" as const, everyMs: 300_000 },
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
  ...over,
});

describe("runner locks", () => {
  it("acquire is exclusive, release frees, stale is stolen", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-lock-"));
    expect(await acquireLock(dir, "j1")).toBe(true);
    expect(await acquireLock(dir, "j1")).toBe(false);
    await releaseLock(dir, "j1");
    expect(await acquireLock(dir, "j1")).toBe(true);
    await releaseLock(dir, "j1");
    // stale lock (>10min) gets stolen
    const lockFile = path.join(dir, ".opencode", "cron", "locks", "j2.lock");
    await fs.mkdir(path.dirname(lockFile), { recursive: true });
    await fs.writeFile(lockFile, "old", "utf-8");
    const ancient = new Date(Date.now() - 20 * 60_000);
    await fs.utimes(lockFile, ancient, ancient);
    expect(await acquireLock(dir, "j2")).toBe(true);
    await releaseLock(dir, "j2");
  });
  it("rejects traversal ids", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-locksec-"));
    await expect(acquireLock(dir, "../evil" as any)).rejects.toThrow();
  });
});

describe("runner tick args", () => {
  it("never uses --dir (v2 removed the flag), cwd carries the directory", async () => {
    const args = tickArgs({ sessionID: "s", agent: "build", model: "a/b" }, "hello");
    expect(args).toEqual(["run", "--session", "s", "--agent", "build", "--model", "a/b", "hello"]);
    expect(args).not.toContain("--dir");
  });
  it("adds --server when OPENCODE_SERVER_URL is set (desktop-app sessions)", async () => {
    const prev = process.env.OPENCODE_SERVER_URL;
    process.env.OPENCODE_SERVER_URL = "http://127.0.0.1:49374";
    const args = tickArgs({ sessionID: "s" }, "hello");
    expect(args).toContain("--server");
    expect(args[args.indexOf("--server") + 1]).toBe("http://127.0.0.1:49374");
    if (prev === undefined) delete process.env.OPENCODE_SERVER_URL;
    else process.env.OPENCODE_SERVER_URL = prev;
    expect(tickArgs({ sessionID: "s" }, "hello")).not.toContain("--server");
  });
  it("resolves opencode to an absolute executable (launchd-safe)", async () => {
    // controlled PATH with a fake executable — deterministic on any machine
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-bin-"));
    const fake = path.join(dir, "opencode");
    await fs.writeFile(fake, "#!/bin/sh\nexit 0\n", "utf-8");
    await fs.chmod(fake, 0o755);
    const prevPath = process.env.PATH;
    const prevBin = process.env.OPENCODE_BIN;
    delete process.env.OPENCODE_BIN;
    process.env.PATH = dir;
    expect(await resolveOpencodeBin()).toBe(fake);
    process.env.PATH = prevPath;
    if (prevBin === undefined) delete process.env.OPENCODE_BIN;
    else process.env.OPENCODE_BIN = prevBin;
  });
  it("OPENCODE_BIN override wins", async () => {
    const prev = process.env.OPENCODE_BIN;
    process.env.OPENCODE_BIN = "/bin/echo";
    expect(await resolveOpencodeBin()).toBe("/bin/echo");
    if (prev === undefined) delete process.env.OPENCODE_BIN;
    else process.env.OPENCODE_BIN = prev;
  });
});

describe("http prompt transport", () => {
  it("config requires the flag plus url/username/password", () => {
    expect(readHttpPromptConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(readHttpPromptConfig({ OPENCODE_PROMPT_HTTP: "1" } as NodeJS.ProcessEnv)).toBeNull();
    expect(readHttpPromptConfig({ OPENCODE_PROMPT_HTTP: "0", OPENCODE_SERVER_URL: "http://x", OPENCODE_SERVER_USERNAME: "u", OPENCODE_SERVER_PASSWORD: "p" } as NodeJS.ProcessEnv)).toBeNull();
    const cfg = readHttpPromptConfig({ OPENCODE_PROMPT_HTTP: "1", OPENCODE_SERVER_URL: "http://127.0.0.1:1234/", OPENCODE_SERVER_USERNAME: "u", OPENCODE_SERVER_PASSWORD: "p" } as NodeJS.ProcessEnv);
    expect(cfg).toEqual({ url: "http://127.0.0.1:1234", username: "u", password: "p" });
  });
  it("posts basic-auth prompt and succeeds on 2xx, throws on 500", async () => {
    const calls: any[] = [];
    const ok: any = async (url: string, init: any) => {
      calls.push({ url, init });
      return { ok: true, status: 200, text: async () => "{}" };
    };
    await promptViaHttp({ url: "http://127.0.0.1:1", username: "u", password: "p" }, "ses_1", "hello", ok);
    expect(calls[0].url).toContain("/api/session/ses_1/prompt");
    expect(calls[0].init.headers.Authorization).toContain("Basic ");
    expect(JSON.parse(calls[0].init.body).prompt.text).toBe("hello");
    const bad: any = async () => ({ ok: false, status: 500, text: async () => "boom" });
    expect(promptViaHttp({ url: "http://127.0.0.1:1", username: "u", password: "p" }, "ses_1", "x", bad)).rejects.toThrow("500");
  });
  it("switchModelViaHttp posts provider/id split, tolerant of failure", async () => {
    const calls: any[] = [];
    const ok: any = async (url: string, init: any) => {
      calls.push({ url, init });
      return { ok: true, status: 204 };
    };
    const done = await switchModelViaHttp({ url: "http://x", username: "u", password: "p" }, "ses_1", "nvidia/z-ai/glm-5.3", ok);
    expect(done).toBe(true);
    expect(calls[0].url).toContain("/api/session/ses_1/model");
    expect(JSON.parse(calls[0].init.body)).toEqual({ model: { id: "z-ai/glm-5.3", providerID: "nvidia" } });
    expect(await switchModelViaHttp({ url: "http://x", username: "u", password: "p" }, "s", "no-slash", ok)).toBe(false);
    const failing: any = async () => { throw new Error("net"); };
    expect(await switchModelViaHttp({ url: "http://x", username: "u", password: "p" }, "s", "a/b", failing)).toBe(false);
  });
  it("repinSessionModel strips the variant from the session model", async () => {
    const posts: any[] = [];
    const fake: any = async (url: string, init?: any) => {
      if (!init?.method) return { ok: true, status: 200, json: async () => ({ data: { model: { id: "z-ai/glm-5.3", providerID: "nvidia", variant: "max" } } }) };
      posts.push({ url, body: JSON.parse(init.body) });
      return { ok: true, status: 204 };
    };
    const ok = await repinSessionModel({ url: "http://x", username: "u", password: "p" }, "ses_1", fake);
    expect(ok).toBe(true);
    expect(posts).toHaveLength(1);
    expect(posts[0].body).toEqual({ model: { id: "z-ai/glm-5.3", providerID: "nvidia" } }); // variant stripped
    const badFetch: any = async () => ({ ok: false, status: 500, json: async () => ({}) });
    expect(await repinSessionModel({ url: "http://x", username: "u", password: "p" }, "s", badFetch)).toBe(false);
  });
});

describe("credentials refresh", () => {
  it("writes 0600 credentials file from env", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-creds-"));
    const target = path.join(dir, "credentials");
    const file = await writeCredentialsFile(
      { OPENCODE_SERVER_USERNAME: "opencode", OPENCODE_SERVER_PASSWORD: "secret", HOME: dir } as NodeJS.ProcessEnv,
      target
    );
    expect(file).toBe(target);
    const content = await fs.readFile(target, "utf-8");
    expect(content).toContain("CRON_UN=opencode");
    expect(content).toContain("CRON_PW=secret");
    const st = await fs.stat(target);
    expect(st.mode & 0o777).toBe(0o600);
  });
  it("throws without env credentials", async () => {
    expect(writeCredentialsFile({ HOME: "/tmp" } as NodeJS.ProcessEnv, "/tmp/x-creds-test")).rejects.toThrow("missing OPENCODE_SERVER");
  });
});

describe("checkDue", () => {
  it("runs due jobs with stub spawn, skips future/disabled/maxed", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cron-check-"));
    const past = new Date(Date.now() - 60_000).toISOString();
    const future = new Date(Date.now() + 3_600_000).toISOString();
    await saveJobs(dir, [
      job("due", dir, { nextRunAt: past }),
      job("future", dir, { nextRunAt: future }),
      job("off", dir, { enabled: false }),
      job("maxed", dir, { maxRuns: 1, runCount: 1 }),
    ]);
    await writeMemory(dir, "due", "# mem", { seenHashes: [], counts: { news: 0, tweets: 0 }, lastRunAt: null, consecutiveFailures: 0 });
    const calls: any[] = [];
    const prevBin = process.env.OPENCODE_BIN;
    process.env.OPENCODE_BIN = "/opt/test/opencode";
    const ran = await checkDue(dir, async (cmd, args, cwd) => {
      calls.push({ cmd, args, cwd });
      return 0;
    });
    if (prevBin === undefined) delete process.env.OPENCODE_BIN;
    else process.env.OPENCODE_BIN = prevBin;
    expect(ran).toEqual(["due"]);
    expect(calls).toHaveLength(1);
    expect(calls[0].cmd).toBe("/opt/test/opencode");
    expect(calls[0].args).not.toContain("--dir");
    expect(calls[0].cwd).toBe(dir);
  });
});
