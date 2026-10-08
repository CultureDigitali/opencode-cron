---
description: Crea un cronjob stile Attività Programmate legato a questa chat
agent: build
---
Crea un monitoraggio ricorrente con il tool `cron_add`.

Chiedi all'utente se manca qualcosa: titolo, ogni quanto (es. `5m`, usa `every`), cosa monitorare (systemPrompt + followupPrompt).

Esempio: titolo `watch-chatgpt-news`, every `5m`, systemPrompt con cartella dedicata e regole dedup, followup `cerca nuove notizie/tweet ultimi 5 min e aggiorna memoria con cron_memory_save`.

Dopo la creazione ricorda: `npx @culturedigitali/opencode-cron os-install` per persistenza a TUI chiusa.
