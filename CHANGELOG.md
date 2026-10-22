# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.4] - 2026-10-22

### Fixed
- **Windows desktop build**: `build:bin` injected the CLI shebang with a `head | grep | printf | cat | chmod` shell pipeline, which does not exist in cmd.exe — `bun run` uses cmd.exe on Windows, so the build always aborted and no Windows artifact was ever published. The logic moved to `scripts/postbuild-bin.mjs` (portable, covered by tests).

## [1.2.3] - 2026-10-22

### Fixed
- **Linux .deb artifact path**: with a scoped package name the default deb artifact name resolved to `release/@culturedigitali/opencode-cron_<version>_<arch>.deb`, and fpm aborted because the scoped parent directory is never created. `electron-builder.yml` now pins a flat `deb.artifactName`.

## [1.2.2] - 2026-10-22

### Fixed
- **Linux .deb packaging**: `electron-builder` aborted the Linux job with *"Please specify author 'email' in the application package.json"*, so the `.deb` artifact was never produced for any release. `package.json` now declares an author object with an email and `electron-builder.yml` sets `linux.maintainer`.

## [1.2.1] - 2026-10-22

### Fixed
- **opencode 2.1 compatibility for the HTTP prompt transport**: `POST /api/session/:id/prompt` now accepts the prompt text at the root of the payload. The previous nested `prompt.text` shape was rejected with `400 InvalidRequestError ("Missing key at [text]")`, so every headless tick admitted over HTTP failed. Both shapes are now sent, so the same build works against opencode 2.0.x and 2.1+.
- **Desktop credential rotation**: opencode 2.1 desktop no longer injects `OPENCODE_SERVER_USERNAME`/`OPENCODE_SERVER_PASSWORD` into agent turns and persists the live sidecar password in `~/.config/opencode/service.json` instead. `refresh-creds` and the launchd ticker now read that file as a fallback, so the documented recovery path keeps working after an app restart.

## [1.2.0] - 2026-10-19

### Added
- **Schedule Preview & Heatmap Engine**: New `cron_preview` tool (#19), CLI subcommand `opencode-cron preview <expr>`, and `/api/preview` endpoint returning upcoming runs, local timezone calculation, and 7-day execution density heatmap.
- **Mission Control Dual-Video Demonstration**: Dual-tab video switcher on the landing page highlighting both the Real-Time Mission Control Web GUI and the Autonomous Terminal Daemon walkthrough.
- **Brand Identity Overhaul**: Integration of the official OpenCode Cron brand system with custom SVG vector logo, favicons, and social assets.
- **Anti-Slop Redesign**: Full audit and verification via design-taste-frontend v2, strictly eliminating artificial AI styling, em-dashes, and emojis across all 10 language translations.

### Changed
- **Tool Suite Expansion**: Now registering 19 native Code Mode agent tools.
- **Test Suite**: Expanded to 194 automated tests across 30 files with zero failures.

## [1.1.0] - 2026-10-18

### Added
- **Job Tags & Multi-Criteria Live Filtering**: Live search by text, category dropdown, status filter, tag pills strip, and real-time match counter.
- **Real-Time Execution Metrics & Prometheus Exporter**: Latency KPIs (`avg`, `min`, `max`, `p95`), success rates, and OpenMetrics endpoint at `/api/metrics/prometheus`.
- **Multi-Channel Alerting & Webhooks**: Instant notification dispatch on failure, recovery, or completion to Slack, Discord, or generic webhooks with anti-spam cooldown throttling.
- **Job Template & Blueprint Engine**: 6 production blueprints (Repository Janitor, Daily Standup, CI Watchdog, Docs Sync, Security Scanner, Health Probe) with 1-click instantiation and ID validation.
- **Point-in-Time Snapshot & Backup/Restore Engine**: Full backup bundles with SHA-256 cryptographic verification, auto-pruning, and cross-platform path traversal defenses.
- **Execution Timeout & Watchdog Guard**: Automatic termination of hung ticks (minimum 5,000ms safety floor) across headless OS daemons and in-process plugins.
- **Run History Retention Policy & Auto-Pruning**: Configurable retention limits by maximum age in days, maximum runs per job, and total history size in MB.
- **Timezone-Aware Scheduling & Crontab Aliases**: Full IANA timezone support and standard macros (`@hourly`, `@daily`, `@midnight`, `@weekly`, `@monthly`, `@yearly`).
- **Pre-Flight Guards & Condition Checks**: Pre-tick verification of HTTP endpoint status or local shell command exit codes before executing prompts.
- **Secret & Credential Redaction Engine**: Automatic sanitization of AI API keys (`sk-*`, `AIzaSy*`), Bearer headers, AWS keys, private keys, and webhook URLs in history, logs, and alerts.
- **3 New Agent Tools**: Registered `cron_metrics`, `cron_template`, and `cron_backup` (bringing the total to 18 native tools).
- **GitHub Sponsorship**: Added `.github/FUNDING.yml` and repository sponsor badge.

### Changed
- **Web GUI Polish**: Compliant with `/design-taste-frontend-v2-experimental` anti-slop guidelines (zero em-dashes and en-dashes, WCAG AA contrast, decoupled global KPIs from filter subsets).
- **Modal UX**: Unified `Escape` key and backdrop click dismiss across all 9 modals (`templates`, `backup`, `metrics`, `notifications`, `pipeline`, `queue`, `dlq`, `job`, `confirm`).
- **Test Suite**: Expanded to 187 automated tests passing across 29 test files with 1,015 assertions.

## [1.0.0] - 2026-10-12

### Added
- **Mission Control Web GUI**: Sleek dark-mode dashboard on `http://localhost:4488` with live SQLite chat streaming, active job monitors, and instant controls.
- **Cross-Platform Desktop App & System Tray**: Native installable packages for macOS (.dmg), Windows (.exe), and Linux (.AppImage, .deb) with live system tray status and countdowns.
- **1-Click "Imposta Cron" Session Modal**: Visual schedule binding on any conversation session with natural language previews and run counters.
- **Multi-Job Pipeline & DAG Workflows**: Chain tasks with `onSuccess` and `onFailure` triggers, memory propagation, and formal DFS 3-color cycle detection.
- **Inbound HTTP Webhooks**: On-demand triggers via `/api/webhook/:id` with token auth and GitHub/GitLab HMAC SHA-256 signatures.
- **Concurrency Manager & Priority Worker Pool**: Parallel worker slots (1 to 10) with priority queue sorting (`high`, `normal`, `low`) and POSIX lock validation.
- **Dead Letter Queue (DLQ) & Failure Circuit Breaker**: Auto-quarantine after 5 consecutive failures with automated canary probe recovery.
- **Universal 10-Language i18n Suite**: Localized experience across English, Italian, Spanish, French, German, Portuguese, Chinese, Japanese, Russian, and Arabic (RTL).
- **Interactive Onboarding Tour**: Spotlight guided walkthrough for first-time dashboard operators.
- **Execution Timeline (`/runs`)**: Real-time tick diagnostics, exit codes, latencies, and collapsible error traces.
- **8-Chapter Instruction Guide (`/instructions`)**: Visual documentation and reference.

## [0.1.0] - 2026-10-08

### Added
- Session-bound cronjobs (`cron_add` with `every` or `cron`).
- In-process scheduler and headless runner (`opencode-cron-run check/run`).
- OS persistence: launchd (macOS), systemd + crontab (Linux), schtasks (Windows).
- Per-job persistent memory with 3-question self-check and compaction hook.
- 9 initial agent tools and 3 chat slash commands.
- Safety guards: 60s minimum interval, 20 jobs max, skip-if-running atomic locks, 5-fail auto-pause.
