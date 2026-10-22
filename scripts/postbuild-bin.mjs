#!/usr/bin/env node
/**
 * Post-process the bundled CLI entrypoint (dist/bin/run.js).
 *
 * The shebang injection used to be done with a `head | grep | printf | cat | chmod`
 * shell pipeline, which only works on Unix shells: `bun run` uses cmd.exe on
 * Windows, where those builtins do not exist, so the whole `build:bin` script
 * failed and no Windows desktop artifact was ever produced.
 *
 * This script does the same job portably: it guarantees the shebang line and
 * marks the file executable on POSIX systems.
 */
import { chmodSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SHEBANG = "#!/usr/bin/env node\n";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : join(root, "dist", "bin", "run.js");

if (!existsSync(target)) {
  console.error(`postbuild-bin: ${target} not found`);
  process.exit(1);
}

const current = readFileSync(target, "utf8");
if (!current.startsWith("#!")) {
  writeFileSync(target, SHEBANG + current, "utf8");
  console.log("postbuild-bin: shebang added");
}

if (process.platform !== "win32") {
  chmodSync(target, 0o755);
}
