# Microsoft Research: come fidarsi del codice scritto dagli AI (verification engineering)

- **Fonte**: The Neuron (Grant Harvey)
- **URL**: https://www.theneuron.ai/explainer-articles/ai-coding-agents-verification-engineering-alex-lavaee/
- **Pubblicato**: 2026-10-09T05:49:04Z

## Riassunto
Alex Lavaee (Microsoft Research, ex coding agents per il team Windows) illustra la **verification engineering**: l'AI produce codice più velocemente di quanto gli umani possano ispezionarlo, quindi la parte difficile sta nel *dimostrare che quel codice merita di andare in produzione*. Demo: apre un progetto vuoto, chiede a un agente di costruire un gioco 3D stile Subway Surfers e prosegue la presentazione mentre l'agente lavora.

## Fatti chiave
- Strumento centrale: **Atomic** — trasforma istruzioni in linguaggio naturale in processi con check, gate di approvazione ed evidenze riproducibili.
- Pratiche dimostrate: reviewer indipendenti, test nel mondo reale, evidenza riproducibile (deck e prompt adattabili pubblicati).
- Inquadramento: evoluzione della linea "pstack" di Lauren Tan (agent utili a scala quando sanno raccogliere contesto, testare la realtà e provare il proprio lavoro).

## Perché conta
Risposta diretta al bottleneck del code review emerso dallo studio Harvard/Jellyfish: la disciplina si sposta da "scrivere codice con l'AI" a "verificare il codice dell'AI".
