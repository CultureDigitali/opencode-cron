# opencode-cron vs plain cron

Use plain cron / systemd timers for pure shell work (backups, `apt update`, log rotation). Use opencode-cron when the task needs judgment every run.

| | plain cron | opencode-cron |
|---|---|---|
| Executor | shell | same opencode `sessionID` |
| Context | none | frozen prompt + persistent memory + history |
| Compact | n/a (no context) | hook re-injects memory |
| Dedup | manual | `seenHashes` + locks |
| Cost control | free | 60s min, jitter, `maxRuns`, 5-fail pause |

Don't use opencode-cron for sub-60s polling or one-shots — `cron_run_now` covers the one-shot case.
