# AI agent cron jobs with opencode

Recurring agent work fits jobs, not one-shots: watchers, monitors, digests, triage.

| Case | Schedule | Result |
|---|---|---|
| AI news + X watcher | `every: 5m` | new items only, `STATS.json` updated |
| Competitor / price monitor | `every: 15m` | diff alert in same session |
| CI flaky re-check | `every: 10m` | re-runs, auto-pause after 5 fails |
| Changelog digest | `every: 1h` | daily markdown, compact-safe |
| Lead triage | `cron: */30 * * * *` | top 10 new, `seenHashes` tracked |

Pattern per tick: read memory (`cron_memory_read`) → self-check (what do I know / what's missing / must I re-read files?) → act → `cron_memory_save`. Zero-news ticks only update `lastRun`.
