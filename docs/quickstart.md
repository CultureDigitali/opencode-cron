# opencode scheduled tasks — 30-second quickstart

Install the plugin, create your first job, verify the tick, persist it past TUI close.

## 1. Install

```jsonc
// opencode.json
{ "$schema": "https://opencode.ai/config.json", "plugins": ["@culturedigitali/opencode-cron"] }
```

## 2. First job (in chat)

```
/cron-add → "Watch AI news, every 5m"
```

The model calls `cron_add` with your `sessionID` bound automatically. Check with `cron_list`.

## 3. Test immediately

Use `cron_run_now` with the new id — verify the tick lands in the same session before waiting 5 minutes.

## 4. Survive TUI close

```bash
npx @culturedigitali/opencode-cron os-install --dir /path/to/project
npx @culturedigitali/opencode-cron check --dir /path/to/project
```

Next: [`examples.md`](examples.md) for the news/tweet template, [`how-it-works.md`](how-it-works.md) for internals.
