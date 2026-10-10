# Claude Managed Agents: dynamic workflows fino a 1.000 agent paralleli — 66/70 bug trovati

- **Fonte**: explainx.ai (Yash Thakker; launch riportata da The Decoder)
- **URL**: https://explainx.ai/blog/claude-managed-agents-dynamic-workflows-1000-subagents-2026
- **Pubblicato**: 2026-10-09

## Riassunto
Anthropic ha aggiunto le **dynamic workflows** a Claude Managed Agents (beta): un lead agent scrive un "programma di workflow" che il server esegue in background fan-out fino a **1.000 agent in parallelo**, combinando i risultati a fasi. Ogni agent lavora in una propria session thread (listabile/leggibile/streammabile).

## Fatti chiave
- Abilitazione: `multiagent.type = "multiagent_20261001"` (workflow + subagents attivi di default per quel tipo).
- Test Anthropic: 70 bug nascosti in un codebase da 116k righe → singolo agent ne trova 14–27 per run; il workflow dinamico ne trova **66 in modo consistente**.
- Criticità aperta: costo in token scala col numero di agent (un senior OpenAI engineer ha criticato gli agent swarm come spreco di token); il test misura detection, non cost-per-bug.
- Contemporaneamente: memory store attachabili a sessioni sandbox self-hosted; web_search/web_fetch con allowed/blocked domains (controllo exfiltration); Console session viewer ridisegnato (timeline minimap + cost inspector).

## Perché conta
L'orchestrazione multi-agent diventa qualcosa che il modello genera da sé, con evidenza quantitativa forte su task ampi e parallelizzabili.
