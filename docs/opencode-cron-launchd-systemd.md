# opencode session cron — background tasks with launchd / systemd

The OS ticker runs every 60s and executes due jobs. Install once per project:

```bash
npx @culturedigitali/opencode-cron os-install --dir /path/to/project
```

| OS | What gets installed |
|---|---|
| macOS | `~/Library/LaunchAgents/ai.opencode.cron.plist`, `StartInterval 60`, logs in `~/Library/Logs/opencode-cron.log` |
| Linux | systemd user service + timer (60s), crontab fallback line |
| Windows | `schtasks` minute task |

Verify:

```bash
npx @culturedigitali/opencode-cron check --dir /path/to/project
npx @culturedigitali/opencode-cron run <jobId> --dir /path/to/project
```

Labels are validated (`[A-Za-z0-9._-]`), paths XML/shell-escaped, lock files make overlapping wakes safe (stale steal after 10 min).
