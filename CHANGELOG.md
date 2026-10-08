# Changelog

## 0.1.0 — initial public release

- Session-bound cronjobs (`cron_add` with `every` or `cron`).
- In-process scheduler + headless runner (`opencode-cron-run check/run`).
- OS persistence: launchd (macOS), systemd + crontab (Linux), schtasks (Windows).
- Per-job persistent memory with 3-question self-check + compaction hook.
- 9 tools + 3 slash commands + news/tweet demo template.
- Guards: 60s minimum, 20 jobs max, skip-if-running, atomic locks, 5-fail auto-pause.
