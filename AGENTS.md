# AGENTS.md — opencode-cron

This repo IS the opencode-cron plugin (scheduled tasks for opencode, ChatGPT-style).
Dev commands: `bun install && bun test && bun run typecheck && bun run build`.

## Dogfooding: this repo runs its own cron

- Jobs live in `.opencode/cron/jobs.json` (gitignored), memory in `.opencode/cron/memory/`.
- A launchd ticker (`ai.opencode.cron`, 60s) checks due jobs and admits tick prompts
  over HTTP into the desktop app's session server (`OPENCODE_PROMPT_HTTP` transport).

## Desktop credentials rotation (important)

The desktop app rotates its sidecar credentials on every restart. The ticker reads
them from `~/.config/opencode-cron/credentials` (0600), falling back to the live
password in `~/.config/opencode/service.json` (opencode 2.1 desktop stores it
there and no longer injects `OPENCODE_SERVER_*` into agent turns). After an app
restart ticks fail with HTTP 401 until the credentials are refreshed. So: if the
user mentions the cron stopped working, or jobs show `consecutiveFailures` climbing
with 401 errors, run:

```bash
node ./dist/bin/run.js refresh-creds
```

(and reset `consecutiveFailures` to 0 / re-enable the job if it auto-paused).
The `/cron-refresh` slash command wraps the same flow.

Note: the sidecar exposes the API at `http://127.0.0.1:<port>/api/...` (the
port is logged by the desktop app as `v2 CLI background service ready { url: ... }`).
`POST /api/session/:id/prompt` requires the text at the root of the payload.
