# ⏰ opencode-cron — ChatGPT Scheduled Tasks for opencode

[![npm version](https://img.shields.io/npm/v/opencode-cron?style=flat-square)](https://www.npmjs.com/package/opencode-cron)
[![license](https://img.shields.io/npm/l/opencode-cron?style=flat-square)](LICENSE)
[![opencode](https://img.shields.io/badge/opencode-plugin-5e6ad2?style=flat-square)](https://opencode.ai)

**ChatGPT Scheduled Tasks for opencode — session-bound cron + persistent memory.**

Tell opencode *“watch this every 5 minutes”* and it keeps working the **same chat**, even after context compaction — and optionally even with the TUI closed.

If it saved you a tab, ⭐ it — it helps a lot.

## 30-second quickstart

```jsonc
// opencode.json
{ "$schema": "https://opencode.ai/config.json", "plugin": ["opencode-cron"] }
```

In chat:

```
/cron-add → "Watch AI news, every 5m"
```

Keep running with TUI closed:

```bash
npx opencode-cron-run os-install --dir /path/to/project
```

## Demo: news + tweet watcher every 5 min

See [`templates/news-tweet-watch.md`](templates/news-tweet-watch.md) — copy-paste `systemPrompt` + `followupPrompt` into `cron_add`:

- saves to `./research/chatgpt/YYYY-MM-DD/` + `STATS.json`
- dedups via persistent memory, max 10 new items/tick
- calls `cron_memory_save` every run so nothing is lost on compact

## Why not plain cron?

| Plain cron | opencode-cron |
|---|---|
| runs a shell command | re-prompts the **same `sessionID`** with full history |
| loses context on compact | **per-job memory** file survives compact + restarts |
| duplicates work | `seenHashes` dedup + `skipIfRunning` + locks |
| expensive loops | 60s minimum, jitter, 5-fail auto-pause, `maxRuns` |

## How it works

```
chat (/cron-add, cron_add tool)
  └─> .opencode/cron/jobs.json + memory/<id>.md
        ├─> TUI open: in-process scheduler → client.session.prompt(sessionID)
        └─> TUI closed: launchd/systemd/cron/schtasks → opencode-cron-run check → opencode run --session <id>
```

Every tick injects:

1. frozen system prompt
2. persistent memory (source of truth after compact)
3. mandatory 3-question self-check before acting
4. followup task, then `cron_memory_save`

Compaction hook (`experimental.session.compacting`) re-injects the memory into the summary.

## Tools (9)

| Tool | What |
|---|---|
| `cron_add` | create job (`every: 5m` or `cron: */5 * * * *`), bound to current session |
| `cron_list` / `cron_get` | list / inspect |
| `cron_pause` / `cron_resume` / `cron_remove` | lifecycle (remove also cleans memory + logs) |
| `cron_run_now` | immediate test tick |
| `cron_memory_read` / `cron_memory_save` | persistent memory (required after each run) |

Slash commands: `/cron-add`, `/cron-list`, `/cron-manage`.

## Runs with TUI closed

```bash
npx opencode-cron-run os-install --dir /path/proj  # macOS plist / linux systemd+crontab / windows schtasks
npx opencode-cron-run check --dir /path/proj
npx opencode-cron-run run <jobId> --dir /path/proj
```

Guards: min interval 60s, max 20 jobs/project, prompt caps, no catch-up by default, atomic locks, logs in `~/.opencode-cron.log` / `~/Library/Logs/opencode-cron.log`.

## Trust boundary

Treat `.opencode/cron/jobs.json` + `memory/*.md` like code: the model executes them on schedule. Never paste secrets into prompts or memory. See [`SECURITY.md`](SECURITY.md).

## Contribute

PRs welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md). Run `bun install && bun test && bun run typecheck && bun run build` before pushing. Changelog in [`CHANGELOG.md`](CHANGELOG.md).
