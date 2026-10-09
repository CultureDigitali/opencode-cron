# Changelog

## Unreleased — desktop GUI support

- **HTTP prompt transport** for sessions served by a remote opencode server (e.g. the
  desktop app's sidecar): `OPENCODE_PROMPT_HTTP=1` + `OPENCODE_SERVER_URL/USERNAME/PASSWORD`.
  `opencode run --session` cannot reach desktop-app sessions (separate storage), so
  ticks are admitted via `POST /api/session/:id/prompt` instead.
- **`refresh-creds` command**: the desktop app rotates sidecar credentials on every
  restart; `opencode-cron-run refresh-creds` (run from inside an agent session, where
  fresh credentials are injected) rewrites `~/.config/opencode-cron/credentials` (0600).
- `/cron-refresh` slash command + AGENTS.md note documenting the rotation flow.
- Windows/Linux unaffected: plain spawn transport remains the default.

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
