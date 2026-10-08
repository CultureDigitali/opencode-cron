# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 0.1.x | Yes |

## Reporting a vulnerability

Open a GitHub issue with `[security]` in the title, or contact the maintainers privately. Do not include secrets or personal data in reports.

## Trust boundary

Treat `.opencode/cron/jobs.json` and `.opencode/cron/memory/*.md` like code: the scheduler executes them automatically via `session.prompt` / `opencode run`.

- Never paste API keys, tokens, or passwords into job prompts or memory.
- Job files live inside the project (`.opencode/cron/`) — they will be committed if you commit that directory. Keep secrets out.
- OS adapters (launchd/systemd/cron/schtasks) run `opencode-cron-run check` every 60s. Review installed jobs with `cron_list` before enabling unattended runs.
