---
description: Avvia o controlla la Dashboard Web Mission Control di opencode-cron (http://localhost:4488)
agent: build
---
Informa l'utente su come visualizzare e avviare la Dashboard Web:
- Se il server è già attivo, è accessibile su: `http://localhost:4488`
- Se deve essere avviato: `bun run gui` oppure `npx @culturedigitali/opencode-cron gui`
- Pagine disponibili:
  - `/` - Mission Control, sessioni SQLite, editor memoria e 1-Click "Imposta Cron"
  - `/runs` - Cron Execution Timeline con log dettagliati di successi/fallimenti
  - `/instructions` - Guida interattiva multilingua completa con tour guidato

