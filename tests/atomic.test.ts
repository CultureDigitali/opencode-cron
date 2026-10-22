import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { replaceFile, writeFileAtomic } from "../src/atomic.ts";

describe("atomic writes", () => {
  it("writeFileAtomic creates the file with the given content", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "atomic-"));
    const target = path.join(dir, "data.json");
    await writeFileAtomic(target, '{"a":1}');
    expect(await fs.readFile(target, "utf-8")).toBe('{"a":1}');
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("writeFileAtomic replaces an existing file and leaves no temp files behind", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "atomic-"));
    const target = path.join(dir, "data.json");
    await fs.writeFile(target, "old", "utf-8");
    await writeFileAtomic(target, "new");
    expect(await fs.readFile(target, "utf-8")).toBe("new");
    const left = (await fs.readdir(dir)).filter((f) => f.includes(".tmp"));
    expect(left).toHaveLength(0);
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("replaceFile overwrites the destination", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "atomic-"));
    const src = path.join(dir, "src.tmp");
    const target = path.join(dir, "dst");
    await fs.writeFile(src, "payload", "utf-8");
    await fs.writeFile(target, "previous", "utf-8");
    await replaceFile(src, target);
    expect(await fs.readFile(target, "utf-8")).toBe("payload");
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("survives concurrent writes without corrupting the destination", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "atomic-"));
    const target = path.join(dir, "jobs.json");
    await Promise.all(
      Array.from({ length: 10 }).map((_, i) => writeFileAtomic(target, JSON.stringify({ run: i })))
    );
    const parsed = JSON.parse(await fs.readFile(target, "utf-8"));
    expect(typeof parsed.run).toBe("number");
    const left = (await fs.readdir(dir)).filter((f) => f.includes(".tmp"));
    expect(left).toHaveLength(0);
    await fs.rm(dir, { recursive: true, force: true });
  });
});
