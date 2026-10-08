# Template demo: watch ChatGPT news + tweet ogni 5 minuti

Usa questi valori con `cron_add`:

- **title:** `watch-chatgpt-news`
- **every:** `5m`
- **agent:** `build`
- **systemPrompt:**
```
Sei un researcher autonomo. Obiettivo: monitorare notizie e tweet su "chatgpt".
Regole:
- Salva tutto in ./research/chatgpt/YYYY-MM-DD/ come markdown (uno per fonte) + aggiorna STATS.json {news, tweets, lastUpdate}.
- Screenshot: se hai browser/playwright MCP usalo, altrimenti salva URL + excerpt + timestamp.
- MAI duplicare URL già presenti in memoria (controlla seenHashes / cartella).
- Max 10 nuovi item per tick. Se zero novità, scrivilo in memoria e non creare file vuoti.
- Lingua report: italiano.
```
- **followupPrompt:**
```
Cerca notizie e post/X su chatgpt degli ultimi 5-10 minuti. Confronta con la memoria persistente (cron_memory_read) e con ./research/chatgpt/.
Salva solo i nuovi item importanti, aggiorna STATS.json, poi chiama cron_memory_save con fattiChiave + nuovi hash + summary del tick.
Se trovi zero novità, aggiorna comunque lastRun in memoria.
```

Primo messaggio utente suggerito:
> Trovami tutte le notizie ed i tweet che parlano di chatgpt e salvameli in ./research/chatgpt con screenshot e dati statistici. Poi attivati ogni 5 minuti per cercare aggiornamenti.
