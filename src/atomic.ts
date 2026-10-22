import * as fs from "node:fs/promises";

/** Replace `target` with the already-written `src` file.
 *
 * On POSIX `rename()` is atomic and replaces the destination. Windows refuses
 * to rename over an existing file (EPERM/EEXIST) and can transiently fail with
 * EBUSY while another writer holds the destination open, so the destination is
 * removed and the rename retried with a short backoff.
 */
export async function replaceFile(src: string, target: string, attempts = 6): Promise<void> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      await fs.rename(src, target);
      return;
    } catch (err: any) {
      const code = err?.code;
      const recoverable = code === "EPERM" || code === "EEXIST" || code === "EBUSY" || code === "ENOTEMPTY";
      if (process.platform !== "win32" || !recoverable || attempt === attempts - 1) throw err;
      await fs.rm(target, { force: true }).catch(() => {});
      await new Promise((r) => setTimeout(r, 20 * (attempt + 1)));
    }
  }
}

/** Write `contents` to `target` atomically: a unique temp file next to the
 * destination is written first and then renamed over it, so readers never see
 * a partially written file. */
export async function writeFileAtomic(
  target: string,
  contents: string,
  options?: { mode?: number }
): Promise<void> {
  const tmp = `${target}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    await fs.writeFile(tmp, contents, options?.mode !== undefined ? { encoding: "utf-8", mode: options.mode } : "utf-8");
    if (options?.mode !== undefined) await fs.chmod(tmp, options.mode).catch(() => {});
    await replaceFile(tmp, target);
  } catch (err) {
    await fs.rm(tmp, { force: true }).catch(() => {});
    throw err;
  }
}
