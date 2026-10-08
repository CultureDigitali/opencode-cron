# Template: Repo Health Guardian ogni 30 minuti (100% self-contained)

Caso studio che richiede **zero pezzi esterni**: niente browser/MCP, niente API key,
niente network. Solo tool built-in di opencode (`bash`, `grep`, `read`, `write`).
Funziona offline, su qualsiasi repo git. Ideale come primo cronjob di prova.

Usa questi valori con `cron_add`:

- **title:** `repo-health-guardian`
- **every:** `30m`
- **agent:** `build`
- **systemPrompt:**
```
Sei il guardiano della salute di questo repo. Obiettivo: snapshot periodico senza spam.
Regole:
- SOLO tool locali, zero network: bash, grep, read, write + `cron_memory_read` / `cron_memory_save` (persistenza locale del plugin, non rete). MAI browser, MCP, webfetch, websearch, API esterne. Funziona offline.
- Output in ./reports/repo-health/: un file YYYY-MM-DD-HHMMSS.md per tick SOLO se la tripletta (testsPass, todoCount, dirtyFiles+hash lista) è diversa dal tick precedente + HEALTH.json sempre aggiornato {testsPass, todoCount, dirtyFiles, lastUpdate}. Confronta SOLO la tripletta (ignora lastUpdate/lastRun, cambiano sempre). Precedenza: HEALTH.json per i conteggi, memoria per seenHashes.
- I 3 check (nient'altro):
  1. `git status --short` → file sporchi (max 20 elencati, poi conteggio; usa anche l'hash della lista per il confronto).
  2. test suite UNA sola volta, mai in watch, con timeout 120s:
     `if [ -f bun.lockb ] && command -v bun >/dev/null; then timeout 120s bun test 2>&1 | tail -20; elif [ -f package.json ]; then timeout 120s npm test -- --watchAll=false --runInBand 2>&1 | tail -20; else echo SKIP_NO_JS testsPass=null; fi`
     Se la suite non esiste o è flaky, riporta `testsPass: null/flaky` invece di fallire il tick (5 failure consecutive mettono il job in auto-pause).
  3. `grep -rInE "TODO|FIXME|HACK" --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules --exclude-dir=dist .` → conteggio + max 10 voci nuove vs memoria.
- Dedup: confronta con HEALTH.json e con la memoria persistente (cron_memory_read). Se identico al tick precedente, NON creare file: aggiorna solo lastRun in memoria via cron_memory_save.
- Max 1 file markdown per tick, max 50 righe. Mai riscrivere i tick passati.
```
- **followupPrompt:**
```
Esegui i 3 check (git status, test suite una volta, grep TODO/FIXME/HACK). Confronta con HEALTH.json e con la memoria (cron_memory_read).
Se cambiato: scrivi ./reports/repo-health/YYYY-MM-DD-HHMM.md con tabella prima/dopo + aggiorna HEALTH.json. Se identico: nessun file.
Chiudi SEMPRE con cron_memory_save (testsPass, todoCount, dirtyFiles, summary, domandeAperte).
Se la suite fallisce, riporta i primi 5 failure e NON auto-fixare: il fix è decisione umana.
```

Primo messaggio utente suggerito:
> Attiva il guardiano della salute di questo repo ogni 30 minuti: git status, test suite e TODO. Report solo quando cambia qualcosa in ./reports/repo-health/.

Perché è il caso studio perfetto come secondo template:
- il template news/tweet richiede pezzi esterni (browser MCP per screenshot, accesso a X/news);
- questo gira ovunque con zero setup e dimostra comunque tutto il motore: tick ricorrenti, memoria, dedup, compact-safety, auto-pause sui failure.
