# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 1.1.x | Yes |
| 1.0.x | Yes |
| 0.1.x | Security fixes only |

## Reporting a vulnerability

Open a GitHub issue with `[security]` in the title, or contact the maintainers privately at `security@culturedigitali.com`. Do not include secrets or personal data in reports.

## Trust boundary

Treat `.opencode/cron/jobs.json` and `.opencode/cron/memory/*.md` like code: the scheduler executes them automatically via `session.prompt` / `opencode run`.

- Never paste API keys, tokens, or passwords into job prompts or memory.
- Job files live inside the project (`.opencode/cron/`): keep secrets out. The builtin Secret Redaction Engine sanitizes logs and history, but credentials should never be saved in raw prompt text.
- OS adapters (launchd/systemd/cron/schtasks) run `opencode-cron-run check` every 60s. Review installed jobs with `cron_list` before enabling unattended runs.
