import { describe, it, expect } from "bun:test";
import { detectOS, launchdPlist, crontabLine, schtasksCommand, systemdTimer } from "../src/os.ts";

describe("os adapters", () => {
  it("detects platforms", () => {
    expect(detectOS("darwin")).toBe("macos");
    expect(detectOS("linux")).toBe("linux");
    expect(detectOS("win32")).toBe("windows");
  });
  it("generates launchd plist with 60s interval", () => {
    const p = launchdPlist({ label: "ai.opencode.cron", runnerPath: "/x/run", directory: "/proj", intervalSec: 60 });
    expect(p).toContain("StartInterval");
    expect(p).toContain("/proj");
  });
  it("generates crontab + schtasks + systemd", () => {
    expect(crontabLine({ runnerPath: "/x", directory: "/p" })).toContain("opencode-cron");
    expect(schtasksCommand({ taskName: "opencode-cron", runnerPath: "C:\\x", directory: "C:\\p" })).toContain("schtasks");
    expect(systemdTimer({ intervalSec: 60 })).toContain("OnUnitActiveSec=60");
  });
});
