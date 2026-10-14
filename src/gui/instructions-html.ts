import {
  escapeHtml,
  getUiEnhancementsHeadStyle,
  getUiEnhancementsBodyHtml,
  getUiEnhancementsScript,
  getHeaderControlsHtml,
} from "./i18n.ts";

export function getInstructionsHtml(title: string = "Istruzioni & Guida Completa — OpenCode Cron"): string {
  return `<!DOCTYPE html>
<html lang="it" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' },
            darkbg: '#0B0F19',
            darkcard: '#111827',
            darkborder: '#1F2937',
            darkhover: '#1e293b'
          }
        }
      }
    }
  </script>
  <style>
    html { font-size: 100%; scroll-behavior: smooth; }
    body { line-height: 1.5; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
    .pulse-dot { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    ${getUiEnhancementsHeadStyle()}
  </style>
</head>
<body class="bg-darkbg text-gray-100 min-h-screen flex flex-col font-sans antialiased selection:bg-brand-500 selection:text-white">

  ${getUiEnhancementsBodyHtml()}

  <!-- Top Navbar: wraps on mobile -->
  <header class="bg-darkcard border-b border-darkborder sticky top-0 z-30 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <!-- Brand & Page Title -->
      <div class="flex items-center space-x-3 min-w-0">
        <a href="/" class="flex items-center gap-2.5 sm:space-x-3 group text-left cursor-pointer min-w-0" data-tooltip="tt.navDashboard">
          <div class="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <i class="fa-solid fa-book-open text-white text-lg"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">OpenCode Cron</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">GUIDA</span>
            </div>
            <p class="text-xs text-gray-400 truncate max-w-[60vw] md:max-w-none" data-i18n="instructions.pageSubtitle">Manuale interattivo, architettura e istruzioni complete</p>
          </div>
        </a>
      </div>

      <!-- Navigation & Multi-Language Controls: scrollable on mobile -->
      <div class="oc-scrollrow no-scrollbar flex items-center gap-1.5 sm:gap-2 sm:space-x-1 shrink-0 pb-0.5">
        <!-- Link to Dashboard -->
        <a
          href="/"
          class="shrink-0 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
          data-tooltip="tt.tabJobs"
        >
          <i class="fa-solid fa-gauge text-indigo-400 text-xs"></i>
          <span class="hidden md:inline" data-i18n="nav.dashboard">Dashboard</span>
        </a>

        <!-- Link to Runs History -->
        <a
          href="/runs"
          class="shrink-0 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
          data-tooltip="tt.tabRuns"
        >
          <i class="fa-solid fa-clock-rotate-left text-emerald-400 text-xs"></i>
          <span class="hidden md:inline" data-i18n="nav.historyRuns">Esiti Runs</span>
        </a>

        <!-- Interactive Tour Button -->
        <button
          type="button"
          onclick="startGuidedDemo()"
          class="shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer min-h-[40px]"
          data-tooltip="tt.tourBtn"
        >
          <i class="fa-solid fa-wand-magic-sparkles text-amber-300 text-xs"></i>
          <span class="hidden sm:inline" data-i18n="tour.startBtn">Avvia Demo</span>
        </button>

        ${getHeaderControlsHtml()}
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

    <!-- Hero Banner -->
    <section class="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-gray-950 border border-indigo-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div class="relative z-10 max-w-3xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
          <i class="fa-solid fa-graduation-cap text-amber-400"></i>
          <span data-i18n="instructions.badge">Documentazione Ufficiale OpenCode Cron</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight" data-i18n="instructions.heroTitle">
          Tutto quello che devi sapere su OpenCode Cron
        </h1>
        <p class="text-sm sm:text-base text-gray-300 leading-relaxed" data-i18n="instructions.heroDesc">
          Esegui task autonomi stile ChatGPT direttamente dentro le sessioni OpenCode. Questa guida ti accompagna passo dopo passo nella configurazione, nelle pianificazioni temporali, nella memoria persistente e nella gestione degli esiti.
        </p>

        <!-- Search Bar -->
        <div class="pt-2">
          <div class="relative max-w-lg">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-gray-400 text-sm"></i>
            <input
              type="text"
              id="instruction-search"
              oninput="filterInstructions(this.value)"
              placeholder="Cerca argomento (es. imposta cron, max runs, launchd, prompt, seenHashes)..."
              data-i18n-placeholder="instructions.searchPlaceholder"
              class="w-full bg-gray-950/90 border border-darkborder rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
            <button
              type="button"
              id="instruction-search-clear"
              onclick="clearInstructionSearch()"
              class="hidden absolute right-3.5 top-2.5 text-gray-400 hover:text-white text-xs cursor-pointer"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Nav Pills -->
      <div id="quick-nav-pills" class="mt-6 pt-6 border-t border-indigo-700/20 flex flex-wrap gap-2 text-xs">
        <a href="#sec-overview" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⚡ Cos'è</a>
        <a href="#sec-setup" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">🎯 Imposta Cron su Sessione</a>
        <a href="#sec-schedule" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⏰ Orari & Visual Builder</a>
        <a href="#sec-duration" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">♾️ Max Runs (Infinito vs Finito)</a>
        <a href="#sec-memory" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">🧠 Memoria & seenHashes</a>
        <a href="#sec-runs" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">📊 Esiti delle Runs (/runs)</a>
        <a href="#sec-daemon" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⚙️ Demone launchd 60s</a>
        <a href="#sec-faq" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">❓ FAQ & Risoluzione</a>
      </div>
    </section>

    <!-- Structured Instructions Grid -->
    <div id="instructions-container" class="space-y-8">

      <!-- SECTION 1: ARCHITETTURA E OVERVIEW -->
      <section id="sec-overview" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
            <i class="fa-solid fa-bolt text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight" data-i18n="instructions.sec1Title">1. Architettura in 60 Secondi: Non un banale timer bash, ma un vero agente programmato</h2>
            <p class="text-xs text-gray-400" data-i18n="instructions.sec1Sub">Come OpenCode Cron si differenzia radicalmente da cron di sistema o da semplici script</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <div class="bg-gray-950/60 p-4 rounded-2xl border border-darkborder space-y-2">
            <h3 class="font-bold text-indigo-300 flex items-center gap-1.5">
              <i class="fa-solid fa-comments"></i> Continuità di Sessione (Stesso ID Chat)
            </h3>
            <p>
              I normali cron eseguono un comando isolato e dimenticano tutto. OpenCode Cron riattiva **la medesima conversazione OpenCode** (stesso <code class="text-indigo-300">sessionID</code>). L'agente mantiene l'intero storico contestuale dei turni precedenti.
            </p>
          </div>
          <div class="bg-gray-950/60 p-4 rounded-2xl border border-darkborder space-y-2">
            <h3 class="font-bold text-purple-300 flex items-center gap-1.5">
              <i class="fa-solid fa-shield-halved"></i> Resistente alla Compattazione (Compaction Safe)
            </h3>
            <p>
              Quando una conversazione supera centinaia di messaggi e OpenCode compatta il contesto, OpenCode Cron inietta automaticamente il file di memoria persistente <code class="text-purple-300">.opencode/cron/memory/&lt;id&gt;.md</code> nel riassunto, garantendo zero amnesie.
            </p>
          </div>
        </div>
      </section>

      <!-- SECTION 2: COME IMPOSTARE UN CRON SU UNA CONVERSAZIONE -->
      <section id="sec-setup" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
          <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <i class="fa-solid fa-calendar-plus text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight" data-i18n="instructions.sec2Title">2. Impostare un Cron su una Conversazione (Modalità 1-Click)</h2>
            <p class="text-xs text-gray-400" data-i18n="instructions.sec2Sub">Due modalità intuitive per legare un'automazione ricorrente a qualsiasi chat</p>
          </div>
        </div>

        <div class="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Modalità 1: 1-Click dalla Live Chat -->
            <div class="bg-gray-950/70 p-5 rounded-2xl border border-indigo-500/30 space-y-2">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white">
                <i class="fa-solid fa-bolt text-amber-300"></i> Metodo 1: 1-Click da Live Chat
              </div>
              <p class="pt-1">
                1. Apri la scheda **Live Chat** e seleziona la conversazione desiderata.<br>
                2. Nel banner in alto clicca sul pulsante viola <span class="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[11px]">⚡ Imposta Cron</span>.<br>
                3. Il configuratore si apre con **quella specifica conversazione già pre-selezionata**, pronta all'uso!
              </p>
            </div>

            <!-- Modalità 2: Dal pulsante Nuovo Job -->
            <div class="bg-gray-950/70 p-5 rounded-2xl border border-darkborder space-y-2">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-800 text-gray-300">
                <i class="fa-solid fa-plus text-indigo-400"></i> Metodo 2: Dal Pulsante + Nuovo Job
              </div>
              <p class="pt-1">
                1. Clicca in qualsiasi momento su <span class="font-bold text-white">&quot;+ Nuovo Job&quot;</span> in alto a destra nella navbar.<br>
                2. Nel campo <em>Sessione OpenCode</em>, scegli dal menu a tendina organizzato:<br>
                &nbsp;&nbsp;• 💬 <strong>Sessioni Principali / Root</strong> (consigliate)<br>
                &nbsp;&nbsp;• 🤖 <strong>Subagenti</strong> generati automaticamente<br>
                &nbsp;&nbsp;• ⚡ <strong>Sessioni con Cron già collegati</strong>
              </p>
            </div>
          </div>

          <!-- Anatomia del Form -->
          <div class="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-2xl space-y-2">
            <h3 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-sliders text-indigo-400"></i> Cosa inserisci nel form di configurazione
            </h3>
            <ul class="list-disc list-inside space-y-1 text-xs text-gray-300">
              <li><strong class="text-white">Titolo del Job:</strong> Un nome descrittivo (es. <em>Monitor AI News 5m</em> o <em>Backup Giornaliero</em>).</li>
              <li><strong class="text-white">Intervallo / Schedule:</strong> Frequenza di esecuzione (es. <code class="text-indigo-300 font-mono">5m</code>, <code class="text-indigo-300 font-mono">1h</code>, <code class="text-indigo-300 font-mono">0 9 * * *</code>).</li>
              <li><strong class="text-white">Max Runs:</strong> Numero massimo di cicli prima di fermarsi (<code class="text-indigo-300 font-mono">0 = illimitato / infinito</code>).</li>
              <li><strong class="text-white">System Prompt (Frozen):</strong> L'identità, il ruolo e i vincoli permanenti dell'agente.</li>
              <li><strong class="text-white">Followup Prompt:</strong> L'azione operativa che l'agente deve compiere ad ogni singolo tick.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- SECTION 3: VISUAL SCHEDULE BUILDER -->
      <section id="sec-schedule" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
          <div class="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
            <i class="fa-solid fa-clock text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight" data-i18n="instructions.sec3Title">3. Visual Schedule Builder: Orari, Intervalli & Cron a 5 Campi</h2>
            <p class="text-xs text-gray-400" data-i18n="instructions.sec3Sub">Tutti i formati supportati e l'anteprima predittiva in tempo reale</p>
          </div>
        </div>

        <div class="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <p>
            OpenCode Cron supporta sia la notazione naturale con intervalli, sia lo standard Unix Cron a 5 campi. Ad ogni digitazione nel form, il motore predittivo calcola all'istante la descrizione in lingua e la data esatta dei <strong>prossimi 3 tick</strong>.
          </p>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-darkborder bg-gray-950 text-gray-400">
                  <th class="py-2.5 px-3 font-semibold">Tipo</th>
                  <th class="py-2.5 px-3 font-semibold">Espressione</th>
                  <th class="py-2.5 px-3 font-semibold">Descrizione & Esempio di Utilizzo</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-darkborder/50 text-gray-300">
                <tr class="hover:bg-gray-900/40">
                  <td class="py-2.5 px-3 font-mono text-indigo-400 font-bold">Intervallo Rapido</td>
                  <td class="py-2.5 px-3 font-mono text-amber-300">5m, 15m, 30m, 1h, 1d</td>
                  <td class="py-2.5 px-3">Esegue il job ogni N minuti o ore continuativamente. Minimo consentito di sicurezza: 60s.</td>
                </tr>
                <tr class="hover:bg-gray-900/40">
                  <td class="py-2.5 px-3 font-mono text-purple-400 font-bold">Orario Mattutino</td>
                  <td class="py-2.5 px-3 font-mono text-amber-300">0 9 * * *</td>
                  <td class="py-2.5 px-3">Ogni mattina puntuale alle ore 09:00 (tutti i giorni del mese e della settimana).</td>
                </tr>
                <tr class="hover:bg-gray-900/40">
                  <td class="py-2.5 px-3 font-mono text-purple-400 font-bold">Giorni Feriali</td>
                  <td class="py-2.5 px-3 font-mono text-amber-300">0 9 * * 1-5</td>
                  <td class="py-2.5 px-3">Dal Lunedì al Venerdì alle ore 09:00 (ideale per standup o scraping lavorativo).</td>
                </tr>
                <tr class="hover:bg-gray-900/40">
                  <td class="py-2.5 px-3 font-mono text-purple-400 font-bold">Serale / Chiusura</td>
                  <td class="py-2.5 px-3 font-mono text-amber-300">0 18 * * *</td>
                  <td class="py-2.5 px-3">Tutti i giorni alle 18:00 (ideale per report giornalieri o riassunti commit).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- SMART ADAPTIVE CADENCE & BURST MODE -->
          <div class="mt-4 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-gray-950 p-5 rounded-2xl border border-amber-500/30 space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/40">
                <i class="fa-solid fa-gauge-high"></i>
              </span>
              <h3 class="text-sm font-bold text-white">Cadenza Adattiva Intelligente & Burst Mode (Smart Schedule)</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">NOVITÀ</span>
            </div>
            <p class="text-xs text-gray-300 leading-relaxed">
              I cron convenzionali sprecano token ed energia eseguendo verifiche fisse anche quando non succede nulla per ore. La **Cadenza Adattiva** regola dinamicamente la frequenza:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder space-y-1">
                <span class="text-amber-400 font-bold flex items-center gap-1"><i class="fa-solid fa-bolt"></i> Burst Mode (Attività)</span>
                <p class="text-[11px] text-gray-400">Quando l'agente trova nuovi elementi, hash o modifiche, la cadenza accelera all'intervallo rapido (es. ogni <strong class="text-white">1m</strong> o <strong class="text-white">2m</strong>).</p>
              </div>
              <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder space-y-1">
                <span class="text-indigo-400 font-bold flex items-center gap-1"><i class="fa-solid fa-arrows-split-up-and-left"></i> Decadimento Graduale</span>
                <p class="text-[11px] text-gray-400">Se per $N$ tick consecutivi (es. 3) non si registrano novità, il cron rallenta verso la cadenza normale e poi verso la modalità Idle.</p>
              </div>
              <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder space-y-1">
                <span class="text-slate-400 font-bold flex items-center gap-1"><i class="fa-solid fa-moon"></i> Modalità Idle (Silenziosa)</span>
                <p class="text-[11px] text-gray-400">Durante i periodi di inattività il cron si mette in pausa profonda (es. ogni <strong class="text-white">30m</strong> o <strong class="text-white">1h</strong>), pronto a riesplodere in Burst appena rileva attività.</p>
              </div>
            </div>
            <div class="text-[11px] text-gray-400 bg-gray-900/60 p-2.5 rounded-xl border border-darkborder flex items-center justify-between">
              <span>⚡ <strong>Pulsante Burst 1-Click:</strong> Puoi forzare la modalità Burst per 15 minuti su qualsiasi job cliccando sull'icona fulmine nella scheda del job.</span>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 4: DURATA E FINE PROGRAMMATA (MAX RUNS) -->
      <section id="sec-duration" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <i class="fa-solid fa-infinity text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight" data-i18n="instructions.sec4Title">4. Durata & Fine Programmata: Esecuzione Infinita vs Limite Max Runs</h2>
            <p class="text-xs text-gray-400" data-i18n="instructions.sec4Sub">Come stabilire se un compito deve durare per sempre o arrestarsi dopo N cicli</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <div class="bg-gray-950/70 p-5 rounded-2xl border border-emerald-500/30 space-y-2">
            <h3 class="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
              <i class="fa-solid fa-infinity"></i> Durata Infinita (Max Runs = 0)
            </h3>
            <p>
              Impostando <code class="text-emerald-300 font-mono font-bold">0</code> nel campo Max Runs (valore di default), il Cron Job <strong>non si fermerà mai</strong>. Continuerà a scattare alla cadenza impostata giorno dopo giorno, finché non decidi tu di metterlo in pausa o eliminarlo.
            </p>
          </div>

          <div class="bg-gray-950/70 p-5 rounded-2xl border border-amber-500/30 space-y-2">
            <h3 class="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <i class="fa-solid fa-flag-checkered"></i> Fine Programmata (Max Runs = N)
            </h3>
            <p>
              Impostando un numero positivo (es. <code class="text-amber-300 font-mono font-bold">10</code> o <code class="text-amber-300 font-mono font-bold">50</code>), il motore tiene il conteggio esatto delle esecuzioni completate. Al raggiungimento del tetto, il job passa nello stato <span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 text-[10px]">COMPLETATO</span> e smette di scattare, azzerando il consumo di risorse.
            </p>
          </div>
        </div>
      </section>

      <!-- SECTION 5: MEMORIA PERSISTENTE E SEENHASHES -->
      <section id="sec-memory" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
          <div class="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
            <i class="fa-solid fa-brain text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight" data-i18n="instructions.sec5Title">5. Memoria Persistente Markdown & Deduplicazione (seenHashes)</h2>
            <p class="text-xs text-gray-400" data-i18n="instructions.sec5Sub">Come evitare duplicazioni e preservare lo stato tra un ciclo e l'altro</p>
          </div>
        </div>

        <div class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <p>
            Ogni cron job possiede un file Markdown dedicato in <code class="text-purple-300 font-mono">.opencode/cron/memory/&lt;jobId&gt;.md</code>. In questo file vengono salvati:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="bg-gray-950/60 p-3.5 rounded-xl border border-darkborder">
              <strong class="text-indigo-400 block mb-1">1. Fatti Chiave</strong>
              <p class="text-xs text-gray-400">Le informazioni scoperte o confermate nei tick precedenti, sempre a portata di mano per l'agente.</p>
            </div>
            <div class="bg-gray-950/60 p-3.5 rounded-xl border border-darkborder">
              <strong class="text-purple-400 block mb-1">2. seenHashes (Deduplicazione)</strong>
              <p class="text-xs text-gray-400">Elenco degli hash o URL già visitati. L'agente non segnala due volte la stessa notizia o evento.</p>
            </div>
            <div class="bg-gray-950/60 p-3.5 rounded-xl border border-darkborder">
              <strong class="text-emerald-400 block mb-1">3. Auto-Check Obbligatorio</strong>
              <p class="text-xs text-gray-400">Prima di ogni azione l'agente risponde a 3 domande di verifica per eliminare allucinazioni.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 6: PAGINA DEDICATA ESITI RUNS -->
      <section id="sec-runs" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
          <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 shrink-0">
            <i class="fa-solid fa-chart-line text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight" data-i18n="instructions.sec6Title">6. Pagina Dedicata "Esiti Runs" (/runs)</h2>
            <p class="text-xs text-gray-400" data-i18n="instructions.sec6Sub">Controllo istantaneo di quali job sono partiti con successo e quali sono falliti</p>
          </div>
        </div>

        <div class="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <p>
            Navigando su <a href="/runs" class="text-indigo-400 hover:underline font-bold">/runs</a> accedi alla vista diagnostica unificata:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder">
              <span class="text-gray-400 block">✓ Successi vs ✕ Errori</span>
              <span class="text-emerald-400 font-bold">Badge cromatici immediati</span>
            </div>
            <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder">
              <span class="text-gray-400 block">Línea Temporale (Strip)</span>
              <span class="text-indigo-300 font-bold">Ultime 48 run cliccabili</span>
            </div>
            <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder">
              <span class="text-gray-400 block">Esiti per Singolo Job</span>
              <span class="text-purple-300 font-bold">Tasso di successo %</span>
            </div>
            <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder">
              <span class="text-gray-400 block">Deep Link Live Chat</span>
              <span class="text-sky-300 font-bold">Salta al turno esatto</span>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 7: DEMONE LAUNCHD -->
      <section id="sec-daemon" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
          <div class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
            <i class="fa-solid fa-server text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight" data-i18n="instructions.sec7Title">7. Demone di Sfondo macOS launchd: Esecuzione Autonoma 24/7</h2>
            <p class="text-xs text-gray-400" data-i18n="instructions.sec7Sub">I tuoi compiti girano in background anche con il browser e l'interfaccia chiusi</p>
          </div>
        </div>

        <div class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <p>
            Il servizio nativo di macOS (<code class="text-blue-300 font-mono">ai.opencode.cron</code>) risiede in <code class="text-gray-400 font-mono">~/Library/LaunchAgents/ai.opencode.cron.plist</code> e scatta automaticamente ogni 60 secondi:
          </p>
          <div class="bg-gray-950 p-4 rounded-xl border border-darkborder font-mono text-xs text-gray-300 space-y-1 overflow-x-auto">
            <div><span class="text-gray-500"># Verifica dello stato del demone macOS</span></div>
            <div>launchctl list | grep opencode.cron</div>
            <div class="pt-2"><span class="text-gray-500"># Log in tempo reale dello stdout</span></div>
            <div>tail -f ~/Library/Logs/opencode-cron.log</div>
          </div>
        </div>
      </section>

      <!-- SECTION 8: FAQ & TROUBLESHOOTING -->
      <section id="sec-faq" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
          <div class="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 shrink-0">
            <i class="fa-solid fa-circle-question text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight" data-i18n="instructions.sec8Title">8. FAQ, Sicurezza & Risoluzione Problemi Rapida</h2>
            <p class="text-xs text-gray-400" data-i18n="instructions.sec8Sub">Cosa fare in caso di errori consecutivi o riavvio dell'applicazione desktop</p>
          </div>
        </div>

        <div class="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <div class="border-b border-darkborder/60 pb-3">
            <h3 class="font-bold text-white mb-1">Cosa succede se un job fallisce ripetutamente?</h3>
            <p class="text-gray-400">
              Per evitare loop infiniti o sprechi di token, se un job accumula **5 errori consecutivi** viene messo in auto-pausa automaticamente. Per riattivarlo basta cliccare sull'icona Play nella Dashboard.
            </p>
          </div>
          <div class="border-b border-darkborder/60 pb-3">
            <h3 class="font-bold text-white mb-1">Cosa fare se le run falliscono con errore HTTP 401 dopo aver riavviato l'app desktop?</h3>
            <p class="text-gray-400">
              L'app desktop ruota le credenziali della sidecar ad ogni riavvio. Basta eseguire da terminale:
              <code class="block mt-1 p-2 bg-gray-950 rounded font-mono text-indigo-300">node ./dist/bin/run.js refresh-creds</code>
              oppure digitare <code class="text-indigo-300">/cron-refresh</code> all'interno della chat OpenCode.
            </p>
          </div>
          <div>
            <h3 class="font-bold text-white mb-1">Come cambio lingua o attivo la modalità RTL?</h3>
            <p class="text-gray-400">
              In alto a destra è presente il menu a tendina con le 10 lingue supportate (Italiano, Inglese, Spagnolo, Francese, Tedesco, Portoghese, Cinese, Giapponese, Arabo e Russo). Selezionando l'Arabo il layout si adatta automaticamente da destra a sinistra (**RTL**).
            </p>
          </div>
        </div>
      </section>

    </div>
  </main>

  <!-- Interactive Guided Demo Tour Modal -->
  <div
    id="instructions-tour-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="tour-modal-title"
    onclick="if(event.target === this) closeTourModal(event)"
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4 transition-all"
    style="display: none;"
  >
    <div class="bg-darkcard border border-indigo-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
      
      <!-- Tour Header -->
      <div class="flex items-center justify-between pb-3 border-b border-darkborder">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </span>
          <div>
            <h3 id="tour-modal-title" class="text-base font-bold text-white">Demo & Tour Guidato</h3>
            <span id="tour-step-indicator" class="text-[11px] font-mono text-indigo-400">Passo 1 di 5</span>
          </div>
        </div>
        <button
          type="button"
          onclick="closeTourModal(event)"
          class="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 text-sm transition-colors cursor-pointer"
          aria-label="Chiudi demo"
          title="Chiudi demo (Esc)"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Tour Content Slides -->
      <div id="tour-slide-container" class="min-h-[200px] flex flex-col justify-center">
        <!-- Rendered dynamically by JS -->
      </div>

      <!-- Tour Navigation Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-darkborder text-xs gap-2">
        <div class="flex items-center gap-2">
          <button
            type="button"
            id="tour-prev-btn"
            onclick="prevTourStep()"
            class="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold border border-darkborder transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <i class="fa-solid fa-arrow-left mr-1"></i> <span id="tour-prev-label">Indietro</span>
          </button>
          <button
            type="button"
            id="tour-skip-btn"
            onclick="closeTourModal(event)"
            class="text-gray-400 hover:text-gray-200 text-xs transition-colors cursor-pointer px-2 py-1"
          >
            <span id="tour-skip-label">Salta</span>
          </button>
        </div>

        <div class="flex items-center gap-1.5" id="tour-dots">
          <!-- Dots rendered by JS -->
        </div>

        <button
          type="button"
          id="tour-next-btn"
          onclick="nextTourStep()"
          class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span id="tour-next-label">Avanti</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>
  </div>

  ${getUiEnhancementsScript()}

  <script>
    // Search filter for instructions
    function filterInstructions(query) {
      const q = (query || '').toLowerCase().trim();
      const clearBtn = document.getElementById('instruction-search-clear');
      if (clearBtn) clearBtn.classList.toggle('hidden', !q);

      const cards = document.querySelectorAll('.instruction-card');
      cards.forEach(card => {
        if (!q) {
          card.classList.remove('hidden');
          return;
        }
        const text = card.textContent.toLowerCase();
        card.classList.toggle('hidden', !text.includes(q));
      });
    }

    function clearInstructionSearch() {
      const input = document.getElementById('instruction-search');
      if (input) {
        input.value = '';
        filterInstructions('');
        input.focus();
      }
    }

    // Interactive Demo Tour Engine (Bilingual Italian / English)
    const TOUR_STEPS_IT = [
      {
        title: "1. Benvenuto nella Console di Controllo OpenCode Cron",
        desc: "OpenCode Cron consente di eseguire compiti ricorrenti stile ChatGPT preservando l'intera sessione di chat e senza mai perdere il contesto.",
        icon: "fa-rocket",
        color: "text-indigo-400",
        highlight: "Tutte le tue sessioni OpenCode sono monitorate in tempo reale dalla Web GUI."
      },
      {
        title: "2. Imposta Cron con 1 Clic su Qualsiasi Chat",
        desc: "Entra nella scheda Live Chat e clicca sul pulsante '⚡ Imposta Cron' nel banner. La conversazione corrente viene immediatamente pre-selezionata nel form.",
        icon: "fa-bolt",
        color: "text-amber-400",
        highlight: "Zero errori di configurazione: il binding sessionID avviene istantaneamente."
      },
      {
        title: "3. Builder Visuale di Pianificazione & Durata",
        desc: "Scegli un intervallo semplice (es. 5m) o un orario preciso con Cron a 5 campi (es. 0 9 * * *). Imposta Max Runs a 0 per esecuzione infinita oppure definisci un limite (es. 10).",
        icon: "fa-clock",
        color: "text-purple-400",
        highlight: "Il builder visuale ti calcola in tempo reale i prossimi 3 scatti previsti."
      },
      {
        title: "4. Memoria Persistente Markdown & seenHashes",
        desc: "Anche se la conversazione viene compattata dopo centinaia di turni, il file .opencode/cron/memory/<id>.md preserva i fatti chiave e la lista degli URL già visti.",
        icon: "fa-brain",
        color: "text-emerald-400",
        highlight: "Zero lavoro duplicato e massima efficienza di token."
      },
      {
        title: "5. Verifica Esiti delle Runs & Demone launchd 60s",
        desc: "Il demone macOS esegue i compiti in background ogni 60 secondi anche a browser chiuso. Nella pagina /runs verifichi a colpo d'occhio successi ed errori.",
        icon: "fa-chart-line",
        color: "text-cyan-400",
        highlight: "Trasparenza totale con deep link istantaneo alla Live Chat per ogni singolo turno."
      }
    ];

    const TOUR_STEPS_EN = [
      {
        title: "1. Welcome to OpenCode Cron Mission Control",
        desc: "OpenCode Cron runs recurring ChatGPT-style tasks directly inside your OpenCode sessions without losing context or chat history.",
        icon: "fa-rocket",
        color: "text-indigo-400",
        highlight: "All your OpenCode sessions are monitored in real time from this Web GUI."
      },
      {
        title: "2. 1-Click Cron Binding on Any Conversation",
        desc: "Open the Live Chat tab and click '⚡ Set Cron' in the top banner. The active conversation is immediately pre-selected in the setup form.",
        icon: "fa-bolt",
        color: "text-amber-400",
        highlight: "Zero configuration errors: session binding happens instantly."
      },
      {
        title: "3. Visual Schedule Builder & Duration (Max Runs)",
        desc: "Choose an intuitive interval (e.g. 5m) or a precise 5-field Cron schedule (e.g. 0 9 * * *). Set Max Runs to 0 for infinite runs, or set a finite cap (e.g. 10).",
        icon: "fa-clock",
        color: "text-purple-400",
        highlight: "The visual builder calculates and previews your next 3 upcoming ticks in real time."
      },
      {
        title: "4. Persistent Markdown Memory & seenHashes",
        desc: "Even when a chat is compacted after hundreds of messages, .opencode/cron/memory/<id>.md retains key facts and seen URLs.",
        icon: "fa-brain",
        color: "text-emerald-400",
        highlight: "Zero duplicated work, zero hallucinations, and maximum token efficiency."
      },
      {
        title: "5. Run Outcomes Diagnostics (/runs) & 60s Daemon",
        desc: "The background macOS launchd daemon checks jobs every 60s even with the browser closed. Review real-time successes and errors on /runs.",
        icon: "fa-chart-line",
        color: "text-cyan-400",
        highlight: "Complete transparency with direct deep links to the exact chat turn."
      }
    ];

    let currentTourStep = 0;

    function getTourSteps() {
      const lang = (typeof currentLang !== 'undefined' ? currentLang : localStorage.getItem('oc_cron_lang') || 'it');
      return lang === 'en' ? TOUR_STEPS_EN : TOUR_STEPS_IT;
    }

    function renderTourStep(index) {
      const steps = getTourSteps();
      const isEn = (typeof currentLang !== 'undefined' ? currentLang : localStorage.getItem('oc_cron_lang') || 'it') === 'en';
      if (index < 0 || index >= steps.length) return;
      currentTourStep = index;
      const step = steps[index];

      const container = document.getElementById('tour-slide-container');
      const ind = document.getElementById('tour-step-indicator');
      const titleEl = document.getElementById('tour-modal-title');
      const prevBtn = document.getElementById('tour-prev-btn');
      const prevLabel = document.getElementById('tour-prev-label');
      const skipLabel = document.getElementById('tour-skip-label');
      const nextBtn = document.getElementById('tour-next-btn');
      const nextLabel = document.getElementById('tour-next-label');
      const dots = document.getElementById('tour-dots');

      if (!step || !container) return;

      if (titleEl) titleEl.textContent = isEn ? 'Demo & Guided Tour' : 'Demo & Tour Guidato';
      if (ind) ind.textContent = (isEn ? 'Step ' : 'Passo ') + (index + 1) + (isEn ? ' of ' : ' di ') + steps.length;
      if (prevBtn) prevBtn.disabled = (index === 0);
      if (prevLabel) prevLabel.textContent = isEn ? 'Back' : 'Indietro';
      if (skipLabel) skipLabel.textContent = isEn ? 'Skip' : 'Salta';

      if (nextLabel) {
        if (index === steps.length - 1) {
          nextLabel.textContent = isEn ? 'Finish Tour' : 'Concludi Demo';
          if (nextBtn) nextBtn.className = 'px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5';
        } else {
          nextLabel.textContent = isEn ? 'Next' : 'Avanti';
          if (nextBtn) nextBtn.className = 'px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5';
        }
      }

      if (dots) {
        dots.innerHTML = steps.map((_, i) => \`
          <button
            type="button"
            onclick="renderTourStep(\${i})"
            class="w-2.5 h-2.5 rounded-full transition-all cursor-pointer \${i === index ? 'bg-indigo-500 w-5' : 'bg-gray-700 hover:bg-gray-500'}"
            aria-label="\${isEn ? 'Step' : 'Passo'} \${i + 1}"
          ></button>
        \`).join('');
      }

      container.innerHTML = \`
        <div class="space-y-4 animate-fadeIn">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gray-900 border border-darkborder flex items-center justify-center shrink-0">
              <i class="fa-solid \${step.icon} text-xl \${step.color}"></i>
            </div>
            <h4 class="text-base sm:text-lg font-bold text-white tracking-tight">\${step.title}</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">\${step.desc}</p>
          <div class="p-3 bg-gray-950/80 rounded-xl border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <i class="fa-solid fa-lightbulb text-amber-400 shrink-0"></i>
            <span>\${step.highlight}</span>
          </div>
        </div>
      \`;
    }

    function startGuidedDemo() {
      currentTourStep = 0;
      renderTourStep(0);
      const modal = document.getElementById('instructions-tour-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
    }

    function closeTourModal(e) {
      if (e) {
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        if (typeof e.preventDefault === 'function') e.preventDefault();
      }
      const modal = document.getElementById('instructions-tour-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
      const ocModal = document.getElementById('oc-tour-modal');
      if (ocModal) {
        ocModal.classList.add('hidden');
        ocModal.style.display = 'none';
      }
      localStorage.setItem('oc_cron_tour_seen', '1');
    }

    function nextTourStep() {
      const steps = getTourSteps();
      if (currentTourStep < steps.length - 1) {
        currentTourStep++;
        renderTourStep(currentTourStep);
      } else {
        closeTourModal();
      }
    }

    function prevTourStep() {
      if (currentTourStep > 0) {
        currentTourStep--;
        renderTourStep(currentTourStep);
      }
    }

    // Keyboard ESC listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTourModal(e);
    });

    // Bilingual Instructions Page Renderer
    function renderInstructionsPage() {
      const lang = (typeof currentLang !== 'undefined' ? currentLang : localStorage.getItem('oc_cron_lang') || 'it');
      const isEn = (lang === 'en');

      // Update Quick Nav Pills
      const pillsContainer = document.getElementById('quick-nav-pills');
      if (pillsContainer) {
        if (isEn) {
          pillsContainer.innerHTML = \`
            <a href="#sec-overview" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⚡ Overview</a>
            <a href="#sec-setup" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">🎯 Set Cron on Session</a>
            <a href="#sec-schedule" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⏰ Schedules & Visual Builder</a>
            <a href="#sec-duration" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">♾️ Max Runs (Infinite vs Finite)</a>
            <a href="#sec-memory" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">🧠 Memory & seenHashes</a>
            <a href="#sec-runs" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">📊 Run Outcomes (/runs)</a>
            <a href="#sec-daemon" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⚙️ 60s launchd Daemon</a>
            <a href="#sec-faq" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">❓ FAQs & Troubleshooting</a>
          \`;
        } else {
          pillsContainer.innerHTML = \`
            <a href="#sec-overview" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⚡ Cos'è</a>
            <a href="#sec-setup" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">🎯 Imposta Cron su Sessione</a>
            <a href="#sec-schedule" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⏰ Orari & Visual Builder</a>
            <a href="#sec-duration" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">♾️ Max Runs (Infinito vs Finito)</a>
            <a href="#sec-memory" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">🧠 Memoria & seenHashes</a>
            <a href="#sec-runs" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">📊 Esiti delle Runs (/runs)</a>
            <a href="#sec-daemon" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">⚙️ Demone launchd 60s</a>
            <a href="#sec-faq" class="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder transition-colors">❓ FAQ & Risoluzione</a>
          \`;
        }
      }

      // Update Documentation Sections
      const container = document.getElementById('instructions-container');
      if (container) {
        if (isEn) {
          container.innerHTML = \`
            <!-- SECTION 1: ARCHITECTURE OVERVIEW -->
            <section id="sec-overview" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
                <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <i class="fa-solid fa-bolt text-lg"></i>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">1. 60-Second Architecture: An AI Agent Scheduler, Not a Dumb Bash Timer</h2>
                  <p class="text-xs text-gray-400">How OpenCode Cron radically differs from basic system crons or shell scripts</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <div class="bg-gray-950/60 p-4 rounded-2xl border border-darkborder space-y-2">
                  <h3 class="font-bold text-indigo-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-comments"></i> Session Continuity (Same Chat ID)
                  </h3>
                  <p>
                    Standard crons run an isolated command and forget everything. OpenCode Cron wakes up <strong>the exact same OpenCode conversation</strong> (same <code class="text-indigo-300 font-mono">sessionID</code>). The agent keeps full contextual history from previous turns.
                  </p>
                </div>
                <div class="bg-gray-950/60 p-4 rounded-2xl border border-darkborder space-y-2">
                  <h3 class="font-bold text-purple-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-shield-halved"></i> Compaction Resilient (Zero Amnesia)
                  </h3>
                  <p>
                    When a conversation spans hundreds of messages and OpenCode compacts context, OpenCode Cron automatically injects the persistent Markdown memory file (<code class="text-purple-300 font-mono">.opencode/cron/memory/&lt;id&gt;.md</code>) into the summary, guaranteeing zero amnesia.
                  </p>
                </div>
              </div>
            </section>

            <!-- SECTION 2: BINDING CRON TO CONVERSATION -->
            <section id="sec-setup" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
                <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                  <i class="fa-solid fa-calendar-plus text-lg"></i>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">2. Setting a Cron on a Conversation (1-Click Workflow)</h2>
                  <p class="text-xs text-gray-400">Two intuitive workflows to attach recurring tasks to any OpenCode session</p>
                </div>
              </div>
              <div class="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-950/70 p-5 rounded-2xl border border-indigo-500/30 space-y-2">
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white">
                      <i class="fa-solid fa-bolt text-amber-300"></i> Method 1: 1-Click from Live Chat
                    </div>
                    <p class="pt-1">
                      1. Open the <strong>Live Chat</strong> tab and select the conversation.<br>
                      2. In the top banner, click the purple button <span class="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[11px]">⚡ Set Cron</span>.<br>
                      3. The configurator opens with <strong>that specific session pre-selected</strong>, ready to configure!
                    </p>
                  </div>
                  <div class="bg-gray-950/70 p-5 rounded-2xl border border-darkborder space-y-2">
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-800 text-gray-300">
                      <i class="fa-solid fa-plus text-indigo-400"></i> Method 2: From + New Job Button
                    </div>
                    <p class="pt-1">
                      1. Click <strong class="text-white">&quot;+ New Job&quot;</strong> anytime in the top navbar.<br>
                      2. Under <em>Target Session</em>, choose from the organized dropdown:<br>
                      &nbsp;&nbsp;• 💬 <strong>Main Sessions (Root)</strong> (recommended)<br>
                      &nbsp;&nbsp;• 🤖 <strong>Subagents</strong> generated automatically<br>
                      &nbsp;&nbsp;• ⚡ <strong>Sessions with active Crons</strong>
                    </p>
                  </div>
                </div>
                <div class="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-2xl space-y-2">
                  <h3 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <i class="fa-solid fa-sliders text-indigo-400"></i> Configuration Form Fields
                  </h3>
                  <ul class="list-disc list-inside space-y-1 text-xs text-gray-300">
                    <li><strong class="text-white">Job Title:</strong> Descriptive name (e.g. <em>AI News Monitor 5m</em> or <em>Daily Standup Report</em>).</li>
                    <li><strong class="text-white">Schedule / Interval:</strong> Execution cadence (e.g. <code class="text-indigo-300 font-mono">5m</code>, <code class="text-indigo-300 font-mono">1h</code>, <code class="text-indigo-300 font-mono">0 9 * * *</code>).</li>
                    <li><strong class="text-white">Max Runs:</strong> Max completed cycles before stopping (<code class="text-indigo-300 font-mono">0 = infinite / indefinite</code>).</li>
                    <li><strong class="text-white">System Prompt (Frozen):</strong> Permanent identity, constraints, and instructions for the agent.</li>
                    <li><strong class="text-white">Followup Prompt:</strong> Actionable task executed on every single automated tick.</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- SECTION 3: VISUAL SCHEDULE BUILDER -->
            <section id="sec-schedule" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
                <div class="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
                  <i class="fa-solid fa-clock text-lg"></i>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">3. Visual Schedule Builder: Times, Intervals & 5-Field Cron</h2>
                  <p class="text-xs text-gray-400">Supported formats with real-time predictive next-runs preview</p>
                </div>
              </div>
              <div class="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p>
                  OpenCode Cron supports both natural intervals and standard Unix 5-field Cron expressions. As you type, the engine instantly computes the human-readable description and exact timestamps for the <strong>next 3 runs</strong>.
                </p>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="border-b border-darkborder bg-gray-950 text-gray-400">
                        <th class="py-2.5 px-3 font-semibold">Type</th>
                        <th class="py-2.5 px-3 font-semibold">Expression</th>
                        <th class="py-2.5 px-3 font-semibold">Description & Use Case</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-darkborder/50 text-gray-300">
                      <tr class="hover:bg-gray-900/40">
                        <td class="py-2.5 px-3 font-mono text-indigo-400 font-bold">Quick Interval</td>
                        <td class="py-2.5 px-3 font-mono text-amber-300">5m, 15m, 30m, 1h, 1d</td>
                        <td class="py-2.5 px-3">Runs every N minutes or hours continuously. Safety minimum allowed: 60s.</td>
                      </tr>
                      <tr class="hover:bg-gray-900/40">
                        <td class="py-2.5 px-3 font-mono text-purple-400 font-bold">Daily Morning</td>
                        <td class="py-2.5 px-3 font-mono text-amber-300">0 9 * * *</td>
                        <td class="py-2.5 px-3">Every day at 09:00 AM sharp (standup prep, news digesting).</td>
                      </tr>
                      <tr class="hover:bg-gray-900/40">
                        <td class="py-2.5 px-3 font-mono text-purple-400 font-bold">Weekdays Only</td>
                        <td class="py-2.5 px-3 font-mono text-amber-300">0 9 * * 1-5</td>
                        <td class="py-2.5 px-3">Monday through Friday at 09:00 AM (workday automations).</td>
                      </tr>
                      <tr class="hover:bg-gray-900/40">
                        <td class="py-2.5 px-3 font-mono text-purple-400 font-bold">Evening Summary</td>
                        <td class="py-2.5 px-3 font-mono text-amber-300">0 18 * * *</td>
                        <td class="py-2.5 px-3">Every day at 06:00 PM (end-of-day reports, commit summaries).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- SECTION 4: DURATION & MAX RUNS -->
            <section id="sec-duration" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
                <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <i class="fa-solid fa-infinity text-lg"></i>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">4. Duration & End Condition: Infinite Execution vs Max Runs Limit</h2>
                  <p class="text-xs text-gray-400">Configure indefinite runs or auto-stop after N cycles</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <div class="bg-gray-950/70 p-5 rounded-2xl border border-emerald-500/30 space-y-2">
                  <h3 class="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                    <i class="fa-solid fa-infinity"></i> Infinite Execution (Max Runs = 0)
                  </h3>
                  <p>
                    Setting <code class="text-emerald-300 font-mono font-bold">0</code> in Max Runs (default), the Cron Job <strong>never stops</strong>. It continues running on schedule day after day until you pause or delete it.
                  </p>
                </div>
                <div class="bg-gray-950/70 p-5 rounded-2xl border border-amber-500/30 space-y-2">
                  <h3 class="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                    <i class="fa-solid fa-flag-checkered"></i> Programmed End (Max Runs = N)
                  </h3>
                  <p>
                    Setting a positive number (e.g. <code class="text-amber-300 font-mono font-bold">10</code> or <code class="text-amber-300 font-mono font-bold">50</code>), the engine accurately tracks completed ticks. Upon reaching the cap, it marks the job as <span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 text-[10px]">COMPLETED</span> and stops, saving tokens.
                  </p>
                </div>
              </div>
            </section>

            <!-- SECTION 5: PERSISTENT MEMORY -->
            <section id="sec-memory" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
                <div class="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
                  <i class="fa-solid fa-brain text-lg"></i>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">5. Persistent Markdown Memory & Deduplication (seenHashes)</h2>
                  <p class="text-xs text-gray-400">Preserve context across compactions and prevent duplicated work</p>
                </div>
              </div>
              <div class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p>
                  Every cron job has a dedicated Markdown file in <code class="text-purple-300 font-mono">.opencode/cron/memory/&lt;jobId&gt;.md</code> storing:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="bg-gray-950/60 p-3.5 rounded-xl border border-darkborder">
                    <strong class="text-indigo-400 block mb-1">1. Key Facts</strong>
                    <p class="text-xs text-gray-400">Information verified in previous ticks, readily available to the agent.</p>
                  </div>
                  <div class="bg-gray-950/60 p-3.5 rounded-xl border border-darkborder">
                    <strong class="text-purple-400 block mb-1">2. seenHashes (Dedup)</strong>
                    <p class="text-xs text-gray-400">List of visited URLs or hashes to ensure no duplicated reports.</p>
                  </div>
                  <div class="bg-gray-950/60 p-3.5 rounded-xl border border-darkborder">
                    <strong class="text-emerald-400 block mb-1">3. Mandatory Self-Check</strong>
                    <p class="text-xs text-gray-400">3 pre-flight verification questions to prevent LLM hallucinations.</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- SECTION 6: RUN OUTCOMES -->
            <section id="sec-runs" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
                <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 shrink-0">
                  <i class="fa-solid fa-chart-line text-lg"></i>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">6. Dedicated 'Run Outcomes' Page (/runs)</h2>
                  <p class="text-xs text-gray-400">Instant verification of succeeded vs failed executions</p>
                </div>
              </div>
              <div class="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p>
                  Navigate to <a href="/runs" class="text-indigo-400 hover:underline font-bold">/runs</a> to access full diagnostics:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder">
                    <span class="text-gray-400 block">✓ Success vs ✕ Failed</span>
                    <span class="text-emerald-400 font-bold">Immediate color badges</span>
                  </div>
                  <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder">
                    <span class="text-gray-400 block">Timeline Strip</span>
                    <span class="text-indigo-300 font-bold">Last 48 clickable runs</span>
                  </div>
                  <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder">
                    <span class="text-gray-400 block">Outcomes per Job</span>
                    <span class="text-purple-300 font-bold">Health & success rate %</span>
                  </div>
                  <div class="bg-gray-950/80 p-3 rounded-xl border border-darkborder">
                    <span class="text-gray-400 block">Live Chat Deep Link</span>
                    <span class="text-sky-300 font-bold">Jump to exact turn</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- SECTION 7: LAUNCHD DAEMON -->
            <section id="sec-daemon" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
                <div class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                  <i class="fa-solid fa-server text-lg"></i>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">7. Background macOS launchd Daemon: 24/7 Autonomous Execution</h2>
                  <p class="text-xs text-gray-400">Your scheduled tasks run in background even when browser and UI are closed</p>
                </div>
              </div>
              <div class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p>
                  The native macOS daemon (<code class="text-blue-300 font-mono">ai.opencode.cron</code>) lives in <code class="text-gray-400 font-mono">~/Library/LaunchAgents/ai.opencode.cron.plist</code> and fires automatically every 60 seconds:
                </p>
                <div class="bg-gray-950 p-4 rounded-xl border border-darkborder font-mono text-xs text-gray-300 space-y-1 overflow-x-auto">
                  <div><span class="text-gray-500"># Verify macOS launchd daemon status</span></div>
                  <div>launchctl list | grep opencode.cron</div>
                  <div class="pt-2"><span class="text-gray-500"># Real-time stdout tailing</span></div>
                  <div>tail -f ~/Library/Logs/opencode-cron.log</div>
                </div>
              </div>
            </section>

            <!-- SECTION 8: FAQ & TROUBLESHOOTING -->
            <section id="sec-faq" class="instruction-card bg-darkcard border border-darkborder rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 pb-3 border-b border-darkborder">
                <div class="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 shrink-0">
                  <i class="fa-solid fa-circle-question text-lg"></i>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">8. FAQs, Security Guardrails & Quick Troubleshooting</h2>
                  <p class="text-xs text-gray-400">What to do on consecutive errors or desktop app restarts</p>
                </div>
              </div>
              <div class="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <div class="border-b border-darkborder/60 pb-3">
                  <h3 class="font-bold text-white mb-1">What happens if a job fails repeatedly?</h3>
                  <p class="text-gray-400">
                    To prevent infinite error loops and token burn, if a job accumulates <strong>5 consecutive failures</strong> it is automatically paused. Click Play on the Dashboard to reset failures and resume.
                  </p>
                </div>
                <div class="border-b border-darkborder/60 pb-3">
                  <h3 class="font-bold text-white mb-1">What to do if ticks fail with HTTP 401 after restarting the desktop app?</h3>
                  <p class="text-gray-400">
                    The desktop app rotates sidecar credentials on every restart. Run this command in terminal:
                    <code class="block mt-1 p-2 bg-gray-950 rounded font-mono text-indigo-300">node ./dist/bin/run.js refresh-creds</code>
                    or type <code class="text-indigo-300">/cron-refresh</code> directly in OpenCode chat.
                  </p>
                </div>
                <div>
                  <h3 class="font-bold text-white mb-1">How do I change languages or toggle RTL mode?</h3>
                  <p class="text-gray-400">
                    Use the language dropdown at the top right to switch between 10 supported languages (English, Italian, Spanish, French, German, Portuguese, Chinese, Japanese, Arabic, Russian). Selecting Arabic activates native Right-to-Left (<strong>RTL</strong>) styling automatically.
                  </p>
                </div>
              </div>
            </section>
          \`;
        }
      }
    }

    // Auto-launch demo on first visit and render page on load
    window.addEventListener('DOMContentLoaded', () => {
      renderInstructionsPage();
      if (!localStorage.getItem('oc_cron_tour_seen')) {
        setTimeout(() => startGuidedDemo(), 600);
      }
    });
  </script>
</body>
</html>`;
}
