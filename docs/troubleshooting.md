# opencode background tasks — troubleshooting

| Symptom | Fix |
|---|---|
| Job never fires, TUI closed | run `os-install` for this project; check the ticker exists (launchctl / systemctl / schtasks) |
| Job paused by itself | 5 consecutive failures auto-pause — inspect `runs/<id>.log`, fix, `cron_resume` |
| Tick skipped | session busy (`skipIfRunning`) or lock held by overlapping run — wait one interval |
| Duplicates | check `seenHashes` in memory state; zero-news ticks must still call `cron_memory_save` |
| `jobs.json` corrupted | restore from backup / git; loader fails open to `[]` by design — keep the file in version control |

Logs: `~/.opencode-cron.log` (cron fallback), `~/Library/Logs/opencode-cron.log` (macOS). Inspect jobs with `cron_list` / `cron_get`.
