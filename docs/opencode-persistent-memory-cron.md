# opencode persistent memory cron — the anti-compact design

Each job owns `memory/<id>.md` plus `<id>.state.json` (`seenHashes`, counts, failures).

- Created by `cron_add` from the frozen system prompt; updated only via `cron_memory_save` at end of tick.
- Injected into every tick prompt as source of truth, and into the compaction summary via `experimental.session.compacting`.
- Caps: 32k chars markdown, last 200 hashes kept, `.bak` backup on each save.
- `removeJob` deletes md + state + backup + run log + lock — no orphans.

Rule for the model: if memory says a URL was seen, it was seen. Never re-save it. Never paste secrets into memory (see `SECURITY.md`).
