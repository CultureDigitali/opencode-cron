# Changelog

## Unreleased — reliability fixes

- Failure path advances `nextRunAt` to a full interval (was: overdue timestamp refired
  every 5s until auto-pause).
- `catchUp` flag now honored: past-due + `catchUp: false` skips the backlog with a fresh
  `nextRunAt`; `catchUp: true` fires soon. Exposed as `cron_add(catchUp)`.
- `checkDue` no longer reports maxed-out jobs as executed.
- Headless runner extracted to testable `src/runner.ts` (atomic locks, `cwd` spawn, no `--dir`).
- npm `files` now ships `docs/`, `llms.txt`, `SECURITY.md`, `CHANGELOG.md` so README links
  resolve on the npm page too.

## Unreleased — opencode v2 migration (breaking)

- Rewritten for the opencode **v2 plugin API** (`@opencode/plugin`, `Plugin.define({ id, setup })`).
  The v1 function-style entrypoint does not load on opencode v2 (`PluginModule.LoadError`).
- Tools registered via `ctx.tool.transform` under the `cron` namespace (effective ids unchanged:
  `cron_add`, `cron_list`, …) with `codemode: true` for Code Mode routing.
- Compaction memory injection moved to `ctx.session.hook("compaction")`.
- Overlap guard moved in-process (v2 has no `session.status` API); cross-process stays on atomic lock files.
- Headless runner no longer passes `--dir` to `opencode run` (flag removed in v2) — spawns with `cwd` instead.
- Config key is now `plugins` (v2), not `plugin`.
- Live-verified on opencode v2.0.10: plugin `active`, all 9 tools callable as `tools.cron.*`.

## 0.1.0 — initial public release

- Session-bound cronjobs (`cron_add` with `every` or `cron`).
- In-process scheduler + headless runner (`opencode-cron-run check/run`).
- OS persistence: launchd (macOS), systemd + crontab (Linux), schtasks (Windows).
- Per-job persistent memory with 3-question self-check + compaction hook.
- 9 tools + 3 slash commands + news/tweet demo template.
- Guards: 60s minimum, 20 jobs max, skip-if-running, atomic locks, 5-fail auto-pause.
