# Gemini at Work 2026: Google presenta "Gemini agent", l'agente universale per il lavoro

- **Fonte**: Google Cloud Blog (Thomas Kurian, CEO Google Cloud — keynote)
- **URL**: https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026
- **Pubblicato**: 2026-10-08

## Riassunto
Google Cloud annuncia **Gemini agent**: un unico agente universale per il lavoro che risponde a domande, gestisce knowledge work, crea immagini/media e **scrive ed esegue codice** da una sola prompt box. Gli si delegano obiettivi, non istruzioni; pianifica il lavoro, usa skills e tool, si collega ai sistemi aziendali e restituisce lavoro finito dentro documenti, inbox e dev environment.

## Fatti chiave
- **Unified agent**: chat + lavoro autonomo + codegen in un'unica interfaccia; task schedulabili e reattivi a eventi.
- **Accesso onnipresente**: web, iOS/Android, desktop Win/Mac, CLI, Google Workspace, Microsoft 365, Slack; può operare headless (senza UI dedicata).
- **Persistent execution**: gira nel cloud con memoria/personalization graph unica; task di ore/giorni sopravvivono alla chiusura del laptop.
- **Multi-agent orchestration**: roster dinamico di sub-agent temporanei (identità propria, workflow paralleli/sequenziali) + **coworker agent** con ruolo persistente, email @agents.company.com e storage proprio.
- **Model choice flexibility**: il modello è separato dall'agente — orchestrazione su famiglia Gemini **e modelli Claude di Anthropic**, con altri modelli privati/open in futuro; Smart Routing + spend cap in tempo reale.
- **Sicurezza**: identità agent crittograficamente attestata e governata come un dipendente, least-privilege, audit trail per agent, **Agent Sandbox** e **Agent Gateway** (AI network firewall per policy tipo "gli agent non aprono documenti Need to Know").
- **4 tipi di memoria**: session, semantic, procedural (skill che si scrive da sé), episodic. Supporto **MCP** (qualsiasi MCP server dentro/fuori rete) + registries di tools e skills.
- Infra: TPU 8i con price-performance +80% vs generazione precedente; modelli **Argon** (reasoning), **Flash**, **Omni** (media), **Gemma** (edge — NASA JPL lo esegue su un satellite).
- Adozione: ~90% del Fortune 100 usa Gemini Enterprise; Orange Spain 1.000+ agent custom, SOMPO 10.000 agent su 34k dipendenti, DBS catene di 70–80 agent, CDAO USA 3M di militari/personale con 100k+ agent custom.

## Perché conta
Mossa di consolidamento: Google collassa l'AI enterprise in **un solo agente multi-modello** con governance seria (identità, policy, costi) — risposta diretta a Claude Code/Copilot/agent orchestration di Anthropic e Microsoft sul mercato del lavoro agentic.
