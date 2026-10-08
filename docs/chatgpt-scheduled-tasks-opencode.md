# ChatGPT scheduled tasks in opencode — parity notes

ChatGPT Scheduled Tasks = recurring prompt, executed by the model, with memory of past runs.

opencode-cron = same concept, local and session-bound:

| ChatGPT | opencode-cron |
|---|---|
| recurring prompt | `followupPrompt` on `every` / `cron` |
| same thread continues | same `sessionID` re-prompted |
| remembers past runs | `memory/<id>.md` + `seenHashes`, survives compact |
| runs while away | OS runner (launchd/systemd/schtasks) with TUI closed |

Difference: everything is a file in your project (`.opencode/cron/`), inspectable and versionable. Trade-off: the host must run the 60s ticker for TUI-closed execution.
