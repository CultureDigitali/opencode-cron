# opencode scheduled tasks — examples

## News + tweet watcher (every 5m)

Full copy-paste prompts in [`../templates/news-tweet-watch.md`](../templates/news-tweet-watch.md). Output: `./research/chatgpt/YYYY-MM-DD/` + `STATS.json`, max 10 new items per tick, `cron_memory_save` required after each run.

Minimal `cron_add`:

```
title: watch-chatgpt-news
every: 5m
systemPrompt: (frozen researcher rules from the template)
followupPrompt: search last 5-10 min, dedup vs memory, save new only, update STATS.json + memory
```

## Cron expression variant

```
cron: "*/30 * * * *"
```

Same job, explicit cron syntax. `computeNextRun` evaluates it with `cron-parser` (validated semantically at creation).

## Lifecycle

- `cron_pause` / `cron_resume` — pause keeps memory, resume recomputes `nextRunAt`
- `cron_remove` — deletes job plus memory, state, backup, run log and lock
- `cron_run_now` — immediate test tick before committing to a schedule
