import { app, BrowserWindow, Tray, Menu, nativeImage, shell, Notification, ipcMain } from "electron";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;
let serverPort = 4488;
let ownServerInstance: any = null;
let statusPollInterval: ReturnType<typeof setInterval> | null = null;

const ASSETS_DIR = path.resolve(__dirname, "..", "..", "assets");
const ICONS_DIR = path.join(ASSETS_DIR, "icons");

/** Resolves best tray icon according to current platform */
function getTrayIconPath(connected: boolean): string {
  if (process.platform === "darwin") {
    return connected
      ? path.join(ICONS_DIR, "tray-activeTemplate.png")
      : path.join(ICONS_DIR, "trayTemplate.png");
  }
  return connected
    ? path.join(ICONS_DIR, "tray-win.png")
    : path.join(ICONS_DIR, "tray-win-disconnected.png");
}

function getAppIconPath(): string {
  return path.join(ICONS_DIR, "icon.png");
}

/** Check if GUI server is already running */
async function checkServerAlive(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:${port}/api/status`, {
      signal: AbortSignal.timeout(1200),
    });
    if (res.ok) {
      const data: any = await res.json();
      return Boolean(data.ok);
    }
  } catch {
    // Not reachable
  }
  return false;
}

/** Starts built-in GUI server if not already alive */
async function ensureServer(): Promise<number> {
  const isAlive = await checkServerAlive(serverPort);
  if (isAlive) {
    console.log(`[Desktop] Attached to existing OpenCode Cron server on port ${serverPort}`);
    return serverPort;
  }

  try {
    const serverModule = await import("../gui/server.js").catch(() => import("../gui/server.ts"));
    if (serverModule && typeof serverModule.startGuiServer === "function") {
      ownServerInstance = serverModule.startGuiServer({
        port: serverPort,
        dir: process.cwd(),
      });
      console.log(`[Desktop] Embedded GUI server started on port ${serverPort}`);
    }
  } catch (err: any) {
    console.error(`[Desktop] Could not start embedded server: ${err.message}`);
  }
  return serverPort;
}

/** Formats ISO string into human readable time */
function formatNextRun(iso: string | null): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    if (diffMs < 0) return "in esecuzione / scaduto";
    const mins = Math.round(diffMs / 60000);
    if (mins < 60) return `tra ${mins}m (${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

/** Shows a system notification */
function notify(title: string, body: string, onClickUrl?: string) {
  if (Notification.isSupported()) {
    const n = new Notification({
      title,
      body,
      icon: getAppIconPath(),
    });
    if (onClickUrl) {
      n.on("click", () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.loadURL(`http://localhost:${serverPort}${onClickUrl}`);
        }
      });
    }
    n.show();
  }
}

/** Build or refresh the System Tray Context Menu */
async function updateTrayMenu() {
  if (!tray) return;

  let isConnected = false;
  let jobs: any[] = [];
  let statusData: any = null;

  try {
    const [statusRes, jobsRes] = await Promise.all([
      fetch(`http://localhost:${serverPort}/api/status`, { signal: AbortSignal.timeout(1200) }),
      fetch(`http://localhost:${serverPort}/api/jobs`, { signal: AbortSignal.timeout(1200) }),
    ]);
    if (statusRes.ok && jobsRes.ok) {
      statusData = await statusRes.json();
      jobs = (await jobsRes.json()) as any[];
      isConnected = true;
    }
  } catch {
    isConnected = false;
  }

  // Update tray icon according to connection state
  try {
    const iconPath = getTrayIconPath(isConnected);
    const nImage = nativeImage.createFromPath(iconPath);
    if (process.platform === "darwin") {
      nImage.setTemplateImage(true);
    }
    tray.setImage(nImage);
  } catch (e) {
    // ignore
  }

  const activeJobs = jobs.filter((j) => j.enabled);
  const pausedJobs = jobs.filter((j) => !j.enabled);

  tray.setToolTip(
    isConnected
      ? `OpenCode Cron - Connesso (${activeJobs.length} attivi, ${pausedJobs.length} in pausa)`
      : `OpenCode Cron - Disconnesso da OpenCode`
  );

  const jobSubmenu: Electron.MenuItemConstructorOptions[] = jobs.length === 0
    ? [{ label: "Nessun cronjob registrato", enabled: false }]
    : jobs.map((j) => ({
        label: `${j.enabled ? "⚡" : "⏸"} ${j.title.slice(0, 26)} (${j.schedule.everyMs ? Math.round(j.schedule.everyMs / 60000) + "m" : j.schedule.cron})`,
        sublabel: `Prossimo: ${formatNextRun(j.nextRunAt)}`,
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.loadURL(`http://localhost:${serverPort}/`);
          }
        },
      }));

  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    // 1. Connection Status Banner
    {
      label: isConnected
        ? `🟢 OpenCode Cron: Connesso`
        : `🔴 OpenCode Cron: Disconnesso`,
      enabled: false,
    },
    {
      label: statusData?.directory
        ? `📁 Repo: ${path.basename(statusData.directory)}`
        : `⚙️ Porta: ${serverPort}`,
      enabled: false,
    },
    { type: "separator" },

    // 2. Jobs Overview
    {
      label: `⏰ Cron Jobs (${activeJobs.length} attivi / ${jobs.length} tot)`,
      submenu: jobSubmenu,
    },
    { type: "separator" },

    // 3. Navigation Shortcuts
    {
      label: "🖥️ Apri Mission Control (Dashboard)",
      accelerator: "CmdOrCtrl+O",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.loadURL(`http://localhost:${serverPort}/`);
        }
      },
    },
    {
      label: "📊 Timeline Esiti Runs (/runs)",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.loadURL(`http://localhost:${serverPort}/runs`);
        }
      },
    },
    {
      label: "📖 Istruzioni & Guida (/instructions)",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.loadURL(`http://localhost:${serverPort}/instructions`);
        }
      },
    },
    { type: "separator" },

    // 4. Quick Actions
    {
      label: "⚡ Esegui Job Scaduti Ora",
      click: async () => {
        try {
          const res = await fetch(`http://localhost:${serverPort}/api/check`, { method: "POST" });
          if (res.ok) {
            notify("OpenCode Cron", "Verifica ed esecuzione job scaduti avviata!");
          }
        } catch (err: any) {
          notify("Errore Esecuzione", err.message);
        }
      },
    },
    {
      label: "🔑 Ricarica Credenziali Desktop",
      click: async () => {
        try {
          const { writeCredentialsFile } = await import("../runner.js");
          await writeCredentialsFile();
          notify("Credenziali Desktop", "Credenziali OpenCode aggiornate con successo (0600)!");
        } catch (err: any) {
          notify("Credenziali Desktop", `Errore: ${err.message}`);
        }
      },
    },
    {
      label: "🌐 Apri nel Browser Esterno",
      click: () => shell.openExternal(`http://localhost:${serverPort}`),
    },
    { type: "separator" },

    // 5. App Settings
    {
      label: "Avvia all'avvio del computer",
      type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => {
        app.setLoginItemSettings({
          openAtLogin: item.checked,
          openAsHidden: true,
        });
      },
    },
    { type: "separator" },

    // 6. Quit
    {
      label: "Esci da OpenCode Cron",
      accelerator: "CmdOrCtrl+Q",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  tray.setContextMenu(menu);
}

/** Create and show the main window */
function createMainWindow() {
  const iconPath = getAppIconPath();

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 620,
    backgroundColor: "#030712",
    title: "OpenCode Cron - Mission Control",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    trafficLightPosition: { x: 18, y: 18 },
    icon: iconPath,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  mainWindow.loadURL(`http://localhost:${serverPort}`);

  mainWindow.once("ready-to-show", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Intercept close: hide to system tray instead of terminating
  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open external docs or github links in user's default browser
    if (!url.startsWith(`http://localhost:${serverPort}`)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

/** Initialize the System Tray */
function createTray() {
  const iconPath = getTrayIconPath(true);
  const nImage = nativeImage.createFromPath(iconPath);
  if (process.platform === "darwin") {
    nImage.setTemplateImage(true);
  }

  tray = new Tray(nImage);
  tray.setToolTip("OpenCode Cron - Connesso");

  // Single-click toggles main window
  tray.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        if (mainWindow.isFocused()) mainWindow.hide();
        else mainWindow.focus();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    } else {
      createMainWindow();
    }
  });

  updateTrayMenu();

  // Poll status every 3.5s to keep tray menu and icon live
  statusPollInterval = setInterval(updateTrayMenu, 3500);
}

// App lifecycle
app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.whenReady().then(async () => {
  await ensureServer();
  createTray();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

app.on("before-quit", () => {
  isQuitting = true;
  if (statusPollInterval) clearInterval(statusPollInterval);
});

app.on("window-all-closed", () => {
  // On macOS and tray apps, keep running in background tray unless explicitly quit
  if (process.platform !== "darwin" && !tray) {
    app.quit();
  }
});
