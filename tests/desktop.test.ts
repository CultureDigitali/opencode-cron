import { describe, it, expect } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";

describe("Desktop Application & System Tray Packaging", () => {
  it("has built dist/desktop/main.js entrypoint", async () => {
    const mainJs = path.join(process.cwd(), "dist", "desktop", "main.js");
    let exists = false;
    try {
      const stat = await fs.stat(mainJs);
      exists = stat.isFile() && stat.size > 1000;
    } catch {
      Bun.spawnSync(["bun", "run", "build:lib"]);
      const stat = await fs.stat(mainJs);
      exists = stat.isFile() && stat.size > 1000;
    }
    expect(exists).toBe(true);
  });

  it("has complete suite of system tray and app icons", async () => {
    const iconsDir = path.join(process.cwd(), "assets", "icons");
    const expectedFiles = [
      "icon.png",
      "icon-256.png",
      "icon-128.png",
      "trayTemplate.png",
      "trayTemplate@2x.png",
      "tray-activeTemplate.png",
      "tray-activeTemplate@2x.png",
      "tray-win.png",
      "tray-win@2x.png",
      "tray-win-disconnected.png",
      "tray-win-disconnected@2x.png",
    ];

    for (const file of expectedFiles) {
      const p = path.join(iconsDir, file);
      const s = await fs.stat(p);
      expect(s.isFile()).toBe(true);
      expect(s.size).toBeGreaterThan(50);
    }
  });

  it("has valid electron-builder.yml configured for mac, windows, and linux", async () => {
    const configPath = path.join(process.cwd(), "electron-builder.yml");
    const content = await fs.readFile(configPath, "utf-8");
    expect(content).toContain("productName: OpenCode Cron");
    expect(content).toContain("target: dmg");
    expect(content).toContain("target: zip");
    expect(content).toContain("target: nsis");
    expect(content).toContain("target: portable");
    expect(content).toContain("target: AppImage");
    expect(content).toContain("target: deb");
    expect(content).toContain("extraMetadata:");
    expect(content).toContain("main: dist/desktop/main.js");
  });

  it("CLI bin/run.ts supports desktop and tray commands", async () => {
    const runPath = path.join(process.cwd(), "bin", "run.ts");
    const content = await fs.readFile(runPath, "utf-8");
    expect(content).toContain('cmd === "desktop" || cmd === "tray"');
    expect(content).toContain('"desktop", "main.js"');
  });
});
