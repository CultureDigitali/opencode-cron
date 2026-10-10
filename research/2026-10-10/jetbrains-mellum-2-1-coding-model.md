# JetBrains Mellum2.1: modello coding 12B (MoE) al 47% su SWE-bench Verified

- **Fonte**: shattered.io (Tom Vance)
- **URL**: https://shattered.io/jetbrains-mellum2-1-12b-coding-model-2026/
- **Pubblicato**: 2026-10-09T00:49:45Z

## Riassunto
Rilasciato l'8 ottobre 2026, **Mellum2.1** è il modello coding open-source di JetBrains: 12B MoE con solo **2,5B parametri attivi** per token, context window 131.072, **47,0% su SWE-bench Verified** (28,0% SWE-bench Pro, 17,4% Terminal-Bench 2.1). Addestrato con RL in ambienti reali su milioni di run sandbox. Posizionato per **coding agent e sub-agent self-hosted** su GPU proprie.

## Fatti chiave
- Altri score autodichiarati: HumanEval+ 91,5%, LiveCodeBench v6 82,0%, AIME 25/26 83,3%, BFCL v4 62,3%.
- Pattern chiaro: forte su task singoli e matematica, debole sui benchmark agentici long-horizon (Terminal-Bench, SWE-bench Pro).
- Posizionamento: opzione "middle" tra pay-per-token cloud e fine-tune proprietaria; interessante per industrie regolamentate (nessun codice verso endpoint terzi).
- Disponibile anche come microservizio containerizzato su NVIDIA AI Factories.

## Perché conta
Evidenza che il lever principale per i piccoli modelli coding è ora il reinforcement learning, non il numero di parametri; spinge il mercato self-hosted dei coding agent.
