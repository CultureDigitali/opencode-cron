# Case study: Repo Health Guardian (self-contained template)

The zero-dependency proof that the engine works: a cronjob needing **no external pieces** —
no browser, no MCP, no API keys, no network. Only built-in tools
(`bash`, `grep`, `read`, `write`) plus the plugin's local memory tools.

Template: [`../templates/repo-guardian.md`](../templates/repo-guardian.md) — `every: 30m`.

## What it does per tick

1. `git status --short` — dirty files (max 20 listed, list hash compared)
2. test suite once, never watch, 120s timeout (`bun test`, else `npm test -- --watchAll=false --runInBand`, else `testsPass: null`)
3. `grep -rInE "TODO|FIXME|HACK"` over sources excluding `node_modules`/`dist`

Report (`./reports/repo-health/YYYY-MM-DD-HHMMSS.md`, max 50 lines) only when the
`(testsPass, todoCount, dirtyFiles)` triplet changed — otherwise just `lastRun` in memory.
Failing suite is reported (first 5 failures), never auto-fixed.

## Why it matters

The news/tweet template needs external pieces (browser MCP for screenshots, X/news access).
This one runs anywhere offline and still exercises the whole engine:
recurring ticks, persistent memory, dedup, compact-safety, 5-fail auto-pause.
Copy it as the starting point for any repo-local automation.
