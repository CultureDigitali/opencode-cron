# opencode scheduled tasks — how it works

`cron_add` stores a job in `.opencode/cron/jobs.json` plus a memory file `memory/<id>.md`.

## TUI open

The in-process `CronScheduler` arms one timer per enabled job (10% jitter). On fire, `executeTick`:

1. skips if disabled / `maxRuns` reached / session busy (`skipIfRunning`)
2. reads `memory/<id>.md` and builds the tick prompt: frozen system prompt + memory + mandatory 3-question self-check + followup
3. calls `ctx.session.prompt({ sessionID, text })` — the same chat continues
4. bumps `runCount`, recomputes `nextRunAt` (cron expression via `cron-parser` or interval), writes `runs/<id>.log`

## TUI closed

The OS adapter (`os-install`) installs a 60s ticker: launchd plist on macOS, systemd timer (crontab fallback) on Linux, schtasks on Windows. Each wake runs `opencode-cron-run check --dir <proj>`, which executes due jobs via `opencode run --session <id>` under an atomic lock file.

## Compact safety

The `compaction` session hook (`ctx.session.hook("compaction")`) injects `memory/<id>.md` into the compaction summary. Memory is the source of truth — chat history may compact, the file does not.

Guards: 60s minimum interval, 20 jobs max per project, 8k prompt caps, 32k memory cap with 200-hash dedup window, no catch-up by default, 5 consecutive failures auto-pause.
