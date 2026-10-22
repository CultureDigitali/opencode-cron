// src/backup.ts - Point-in-time Snapshot & Backup/Restore Engine
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cronDir, loadJobs, saveJobs } from "./store.ts";
import type { BackupMetadata } from "./types.ts";
import { replaceFile } from "./atomic.ts";

interface SnapshotBundle {
  metadata: BackupMetadata;
  jobsJson: string;
  settingsJson?: string;
  dlqJson?: string;
  notificationsJson?: string;
  memoryFiles: Record<string, string>;
}

function backupsDir(directory: string): string {
  return path.join(cronDir(directory), "backups");
}

function backupFilePath(directory: string, backupId: string): string {
  const cleanId = backupId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(backupsDir(directory), `${cleanId}.json`);
}

function computeChecksum(content: string): string {
  return crypto.createHash("sha256").update(content, "utf-8").digest("hex");
}

export async function createBackup(
  directory: string,
  note?: string
): Promise<BackupMetadata> {
  const base = cronDir(directory);
  const dir = backupsDir(directory);
  await fs.mkdir(dir, { recursive: true });

  const backupId = `bak-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
  const now = new Date().toISOString();

  // 1. Read jobs.json
  let jobsJson = "[]";
  let jobCount = 0;
  try {
    jobsJson = await fs.readFile(path.join(base, "jobs.json"), "utf-8");
    const parsed = JSON.parse(jobsJson);
    if (Array.isArray(parsed)) jobCount = parsed.length;
  } catch {
    // empty jobs
  }

  // 2. Read optional files
  let settingsJson: string | undefined;
  try {
    settingsJson = await fs.readFile(path.join(base, "settings.json"), "utf-8");
  } catch {}

  let dlqJson: string | undefined;
  try {
    dlqJson = await fs.readFile(path.join(base, "dlq.json"), "utf-8");
  } catch {}

  let notificationsJson: string | undefined;
  try {
    notificationsJson = await fs.readFile(path.join(base, "notifications.json"), "utf-8");
  } catch {}

  // 3. Read memory files
  const memoryFiles: Record<string, string> = {};
  const memDir = path.join(base, "memory");
  try {
    const list = await fs.readdir(memDir);
    for (const f of list) {
      if (f.endsWith(".md") || f.endsWith(".state.json")) {
        const content = await fs.readFile(path.join(memDir, f), "utf-8");
        memoryFiles[f] = content;
      }
    }
  } catch {}

  const checksum = computeChecksum(jobsJson + (settingsJson || ""));
  const filesList = ["jobs.json", ...Object.keys(memoryFiles)];
  if (settingsJson) filesList.push("settings.json");
  if (dlqJson) filesList.push("dlq.json");
  if (notificationsJson) filesList.push("notifications.json");

  const metadata: BackupMetadata = {
    id: backupId,
    createdAt: now,
    note: note || undefined,
    jobCount,
    byteSize: Buffer.byteLength(jobsJson, "utf-8"),
    checksum,
    files: filesList,
  };

  const bundle: SnapshotBundle = {
    metadata,
    jobsJson,
    settingsJson,
    dlqJson,
    notificationsJson,
    memoryFiles,
  };

  const targetPath = backupFilePath(directory, backupId);
  const tmp = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(bundle, null, 2), "utf-8");
  await replaceFile(tmp, targetPath);

  // Auto-prune old backups (keep last 10 by default)
  await pruneBackups(directory, 10).catch(() => {});

  return metadata;
}

export async function listBackups(directory: string): Promise<BackupMetadata[]> {
  const dir = backupsDir(directory);
  try {
    const files = await fs.readdir(dir);
    const results: BackupMetadata[] = [];
    for (const f of files) {
      if (!f.endsWith(".json")) continue;
      try {
        const raw = await fs.readFile(path.join(dir, f), "utf-8");
        const bundle: SnapshotBundle = JSON.parse(raw);
        if (bundle && bundle.metadata && bundle.metadata.id) {
          results.push(bundle.metadata);
        }
      } catch {}
    }
    // Sort descending by creation date
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function restoreBackup(
  directory: string,
  backupId: string
): Promise<{ restoredJobs: number; restoredMemoryFiles: number }> {
  const targetPath = backupFilePath(directory, backupId);
  const raw = await fs.readFile(targetPath, "utf-8");
  const bundle: SnapshotBundle = JSON.parse(raw);

  if (!bundle || !bundle.metadata || !bundle.jobsJson) {
    throw new Error(`Corrupted backup archive: ${backupId}`);
  }

  // Verify checksum
  const currentCheck = computeChecksum(bundle.jobsJson + (bundle.settingsJson || ""));
  if (bundle.metadata.checksum && bundle.metadata.checksum !== currentCheck) {
    throw new Error(`Backup checksum mismatch for ${backupId}. File may be tampered or corrupted.`);
  }

  const base = cronDir(directory);
  await fs.mkdir(base, { recursive: true });

  // 1. Restore jobs.json safely via loadJobs validation
  const parsedJobs = JSON.parse(bundle.jobsJson);
  await saveJobs(directory, parsedJobs);

  // 2. Restore optional settings & notifications
  if (bundle.settingsJson) {
    await fs.writeFile(path.join(base, "settings.json"), bundle.settingsJson, "utf-8");
  }
  if (bundle.dlqJson) {
    await fs.writeFile(path.join(base, "dlq.json"), bundle.dlqJson, "utf-8");
  }
  if (bundle.notificationsJson) {
    await fs.writeFile(path.join(base, "notifications.json"), bundle.notificationsJson, "utf-8");
  }

  // 3. Restore memory files
  let restoredMemoryFiles = 0;
  if (bundle.memoryFiles) {
    const memDir = path.join(base, "memory");
    await fs.mkdir(memDir, { recursive: true });
    for (const [filename, content] of Object.entries(bundle.memoryFiles)) {
      if (
        filename.includes("..") ||
        filename.includes("/") ||
        filename.includes("\\") ||
        path.basename(filename) !== filename ||
        !/^[a-zA-Z0-9_.-]+$/.test(filename)
      ) {
        continue; // Path traversal & invalid filename guard
      }
      await fs.writeFile(path.join(memDir, filename), content, "utf-8");
      restoredMemoryFiles += 1;
    }
  }

  return {
    restoredJobs: Array.isArray(parsedJobs) ? parsedJobs.length : 0,
    restoredMemoryFiles,
  };
}

export async function deleteBackup(directory: string, backupId: string): Promise<boolean> {
  const targetPath = backupFilePath(directory, backupId);
  try {
    await fs.unlink(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function pruneBackups(directory: string, maxToKeep: number = 10): Promise<number> {
  const list = await listBackups(directory);
  if (list.length <= maxToKeep) return 0;

  const toRemove = list.slice(maxToKeep);
  let removed = 0;
  for (const b of toRemove) {
    const ok = await deleteBackup(directory, b.id);
    if (ok) removed += 1;
  }
  return removed;
}
