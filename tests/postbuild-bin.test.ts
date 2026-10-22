import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

const SCRIPT = path.join(import.meta.dir, "..", "scripts", "postbuild-bin.mjs");

describe("postbuild-bin", () => {
  it("adds the node shebang to the bundled CLI and keeps the code intact", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "postbuild-bin-"));
    const file = path.join(dir, "run.js");
    await fs.writeFile(file, "console.log('hi');\n", "utf-8");

    const proc = Bun.spawn(["bun", SCRIPT, file], { stdout: "pipe", stderr: "pipe" });
    const code = await proc.exited;

    expect(code).toBe(0);
    const content = await fs.readFile(file, "utf-8");
    expect(content.startsWith("#!/usr/bin/env node\n")).toBe(true);
    expect(content).toContain("console.log('hi');");

    await fs.rm(dir, { recursive: true, force: true });
  });

  it("does not duplicate an existing shebang", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "postbuild-bin-"));
    const file = path.join(dir, "run.js");
    await fs.writeFile(file, "#!/usr/bin/env node\nconsole.log('hi');\n", "utf-8");

    const proc = Bun.spawn(["bun", SCRIPT, file], { stdout: "pipe", stderr: "pipe" });
    await proc.exited;

    expect(await proc.exited).toBe(0);
    const content = await fs.readFile(file, "utf-8");
    expect(content.match(/#!\/usr\/bin\/env node/g)?.length).toBe(1);

    await fs.rm(dir, { recursive: true, force: true });
  });
});
