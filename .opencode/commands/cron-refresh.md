---
description: Refresh desktop-sidecar credentials for the opencode-cron ticker (after an app restart)
---
The desktop app rotates its server credentials on every restart; the cron ticker keeps a copy in `~/.config/opencode-cron/credentials` and stops working with HTTP 401 after rotation.

Run the refresh now:

```bash
node "/Users/luigimacmini/Desktop/no code mac/opencode-crondev/dist/bin/run.js" refresh-creds
```

Then verify the file was updated (mtime today, mode 600):

```bash
ls -la ~/.config/opencode-cron/credentials
```

Report to the user: refreshed or the exact error. Do not print the file contents.
