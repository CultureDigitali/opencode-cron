import {
  getUiEnhancementsHeadStyle,
  getUiEnhancementsBodyHtml,
  getUiEnhancementsScript,
  getHeaderControlsHtml,
  getOnboardingBannerHtml,
} from "./i18n.ts";

export function getHtml(title: string = "OpenCode Cron — Web GUI"): string {
  return `<!DOCTYPE html>
<html lang="it" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"></script>
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
    /* Custom scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
    .prose-dark { color: #e5e7eb; }
    .prose-dark code { background: #1f2937; padding: 2px 6px; border-radius: 4px; font-size: 0.875em; }
    .prose-dark pre { background: #0f172a; padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0; }
    .prose-dark p { margin-bottom: 0.5rem; line-height: 1.6; }
    .prose-dark ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 0.5rem; }
    .prose-dark ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 0.5rem; }
    .prose-dark h1, .prose-dark h2, .prose-dark h3 { font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; }
    .pulse-dot { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeIn { animation: fadeIn 0.15s ease-out forwards; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    ${getUiEnhancementsHeadStyle()}
  </style>
</head>
<body class="bg-darkbg text-gray-100 min-h-screen flex flex-col font-sans antialiased selection:bg-brand-500 selection:text-white">

  ${getUiEnhancementsBodyHtml()}

  <!-- Top Navbar -->
  <header class="bg-darkcard border-b border-darkborder sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
          <i class="fa-solid fa-clock-rotate-left text-sm"></i>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-base font-bold tracking-tight text-white">OpenCode Cron</h1>
            <span data-tooltip="tt.liveBadge" class="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
              <span data-i18n="app.liveBadge">Web GUI Live</span>
            </span>
          </div>
          <p class="text-xs text-gray-400 font-mono" id="current-dir" data-tooltip="tt.workspaceDir">Loading directory...</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav role="tablist" aria-label="Sezioni Principali" class="flex items-center space-x-1 sm:space-x-2 bg-gray-900/60 p-1 rounded-xl border border-darkborder">
        <button role="tab" aria-selected="true" aria-controls="view-jobs" onclick="switchTab('jobs')" id="tab-btn-jobs" data-tooltip="tt.tabJobs" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-white bg-brand-600 shadow-sm">
          <i class="fa-solid fa-calendar-check"></i> <span data-i18n="nav.jobs">Jobs & Cron</span>
        </button>
        <button role="tab" aria-selected="false" aria-controls="view-chat" onclick="switchTab('chat')" id="tab-btn-chat" data-tooltip="tt.tabChat" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-gray-400 hover:text-white">
          <i class="fa-solid fa-comments"></i> <span data-i18n="nav.chat">Live Chat</span>
          <span id="chat-live-badge" class="w-2 h-2 rounded-full bg-emerald-400 hidden animate-ping"></span>
        </button>
        <button role="tab" aria-selected="false" aria-controls="view-memory" onclick="switchTab('memory')" id="tab-btn-memory" data-tooltip="tt.tabMemory" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-gray-400 hover:text-white cursor-pointer">
          <i class="fa-solid fa-brain"></i> <span data-i18n="nav.memory">Memoria</span>
        </button>
        <button role="tab" aria-selected="false" aria-controls="view-diff" onclick="switchTab('diff')" id="tab-btn-diff" data-tooltip="tt.tabDiff" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-gray-400 hover:text-white cursor-pointer">
          <i class="fa-solid fa-code-compare"></i> <span data-i18n="nav.diff">Git Diff</span>
          <span id="diff-count-badge" class="hidden px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"></span>
        </button>
        <button role="tab" aria-selected="false" aria-controls="view-logs" onclick="switchTab('logs')" id="tab-btn-logs" data-tooltip="tt.tabLogs" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-gray-400 hover:text-white cursor-pointer">
          <i class="fa-solid fa-terminal"></i> <span data-i18n="nav.logs">Logs</span>
        </button>
        <a href="/runs" id="nav-link-runs" data-tooltip="tt.tabRuns" class="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 shadow-sm">
          <i class="fa-solid fa-chart-line"></i> <span data-i18n="nav.runs">Esiti Runs</span>
        </a>
      </nav>

      <!-- Action buttons + Language + Guide -->
      <div class="flex items-center gap-2">
        ${getHeaderControlsHtml()}
        <button id="btn-header-new-job" onclick="openNewJobModal()" data-tooltip="tt.tabJobs" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer">
          <i class="fa-solid fa-plus text-[10px]"></i> <span class="hidden sm:inline" data-i18n="nav.newJob">Nuovo Job</span>
        </button>
        <button onclick="refreshAll()" data-tooltip="tt.liveBadge" aria-label="Ricarica stato" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors border border-darkborder cursor-pointer">
          <i class="fa-solid fa-arrows-rotate text-xs" id="refresh-spinner"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Notification Toast Container -->
  <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none"></div>

  <!-- Main Content Areas -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

    ${getOnboardingBannerHtml()}

    <!-- ============================================== -->
    <!-- TAB 1: JOBS DASHBOARD                          -->
    <!-- ============================================== -->
    <section id="view-jobs" role="tabpanel" aria-labelledby="tab-btn-jobs" class="tab-view block space-y-6">
      <!-- Status Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-tooltip="tt.kpiActive" class="bg-darkcard border border-darkborder rounded-xl p-4 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 flex items-center">
              <span data-i18n="kpi.activeTasks">Task Attivi</span>
              <span class="oc-help-badge">?</span>
            </p>
            <p class="text-2xl font-bold text-white mt-1" id="stat-active">0</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <i class="fa-solid fa-circle-play text-base"></i>
          </div>
        </div>

        <a href="/runs" data-tooltip="tt.kpiTotalRuns" class="bg-darkcard hover:bg-gray-900 border border-darkborder hover:border-indigo-500/40 rounded-xl p-4 flex items-center justify-between transition-all group">
          <div>
            <p class="text-xs font-medium text-gray-400 group-hover:text-indigo-300 transition-colors flex items-center">
              <span data-i18n="kpi.totalRuns">Totale Esecuzioni (Vedi Esiti →)</span>
              <span class="oc-help-badge">?</span>
            </p>
            <p class="text-2xl font-bold text-white mt-1" id="stat-runs">0</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <i class="fa-solid fa-bolt text-base"></i>
          </div>
        </a>

        <div data-tooltip="tt.kpiLaunchd" class="bg-darkcard border border-darkborder rounded-xl p-4 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 flex items-center">
              <span data-i18n="kpi.launchd">Launchd Daemon</span>
              <span class="oc-help-badge">?</span>
            </p>
            <p class="text-sm font-semibold text-white mt-1 flex items-center gap-1.5" id="stat-daemon">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span> ai.opencode.cron (60s)
            </p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <i class="fa-solid fa-server text-base"></i>
          </div>
        </div>

        <div data-tooltip="tt.kpiNextTick" class="bg-darkcard border border-darkborder rounded-xl p-4 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400 flex items-center">
              <span data-i18n="kpi.nextTick">Prossimo Tick</span>
              <span class="oc-help-badge">?</span>
            </p>
            <p class="text-sm font-semibold text-white mt-1 font-mono" id="stat-next-tick">—</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <i class="fa-solid fa-hourglass-half text-base"></i>
          </div>
        </div>
      </div>

      <!-- Jobs Grid Header -->
      <div class="flex items-center justify-between pt-2">
        <div>
          <h2 class="text-lg font-bold text-white tracking-tight" data-i18n="jobs.heading">Cron Jobs Registrati</h2>
          <p class="text-xs text-gray-400" data-i18n="jobs.subheading">Task ricorrenti che scrivono direttamente nelle sessioni di OpenCode</p>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="runAllDue()" data-tooltip="tt.runDueBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-darkborder px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <i class="fa-solid fa-play text-[10px]"></i> <span data-i18n="jobs.runDueNow">Esegui Scaduti Ora</span>
          </button>
        </div>
      </div>

      <!-- Jobs Container -->
      <div id="jobs-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Rendered by JS -->
        <div class="col-span-full py-16 text-center text-gray-500 bg-darkcard/50 rounded-2xl border border-dashed border-darkborder">
          <i class="fa-solid fa-spinner fa-spin text-2xl mb-3 text-indigo-400"></i>
          <p class="text-sm" data-i18n="loading.jobs">Caricamento job in corso...</p>
        </div>
      </div>
    </section>

    <!-- ============================================== -->
    <!-- TAB 2: LIVE CHAT & REALTIME FEED               -->
    <!-- ============================================== -->
    <section id="view-chat" role="tabpanel" aria-labelledby="tab-btn-chat" class="tab-view hidden space-y-4">
      <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <i class="fa-solid fa-comments"></i>
          </div>
          <div>
            <h2 class="text-sm font-bold text-white" data-i18n="chat.title">Live Chat & Feed Sessione</h2>
            <p class="text-xs text-gray-400" data-i18n="chat.subtitle">Visualizza e aggiorna in tempo reale i prompt e le risposte generate dai tick automatici</p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Rich Custom Session Picker Dropdown Component -->
          <div class="relative" id="session-picker-wrapper">
            <button
              id="session-picker-trigger"
              type="button"
              onclick="toggleSessionPicker()"
              aria-haspopup="listbox"
              aria-expanded="false"
              class="flex items-center space-x-2 bg-gray-950/90 hover:bg-gray-900 border border-darkborder hover:border-indigo-500/50 rounded-xl px-3 py-1.5 text-xs transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/40 group cursor-pointer"
            >
              <span class="text-xs text-gray-400 font-medium" data-i18n="chat.sessionLabel">Sessione:</span>
              <div id="session-trigger-badge" class="flex items-center gap-1.5">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-800 text-gray-300">
                  <i class="fa-solid fa-spinner fa-spin text-[9px]"></i> <span data-i18n="loading.generic">Caricamento...</span>
                </span>
              </div>
              <span id="session-trigger-title" class="font-bold text-gray-100 max-w-[150px] sm:max-w-[220px] md:max-w-[280px] truncate block text-left" data-i18n="loading.generic">
                Caricamento...
              </span>
              <span id="session-trigger-time" class="text-[10px] text-gray-500 hidden sm:inline-block font-mono">
                —
              </span>
              <i id="session-trigger-chevron" class="fa-solid fa-chevron-down text-[10px] text-gray-400 group-hover:text-gray-200 transition-transform duration-200"></i>
            </button>

            <!-- Hidden native select for programmatic and test compatibility -->
            <select id="chat-session-select" onchange="selectSession(this.value)" class="sr-only" tabindex="-1" aria-hidden="true">
              <option value="" data-i18n="loading.sessions">Caricamento sessioni...</option>
            </select>

            <!-- Dropdown Popover Menu -->
            <div
              id="session-picker-dropdown"
              class="hidden absolute right-0 mt-2 w-[420px] sm:w-[500px] max-w-[92vw] bg-gray-950/95 backdrop-blur-xl border border-darkborder rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[580px] animate-fadeIn"
            >
              <!-- Search & Refresh Header -->
              <div class="p-3 border-b border-darkborder bg-gray-900/60 flex items-center gap-2">
                <div class="relative flex-1">
                  <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                  <input
                    type="text"
                    id="session-search-input"
                    placeholder="Cerca sessione, cron job o ID..."
                    data-i18n-placeholder="chat.searchPlaceholder"
                    oninput="filterSessionList(this.value)"
                    class="w-full bg-gray-950 border border-darkborder rounded-lg pl-8 pr-7 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onclick="clearSessionSearch()"
                    id="session-search-clear"
                    class="hidden absolute right-2.5 top-2 text-gray-400 hover:text-white text-xs"
                    title="Cancella ricerca"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <button
                  type="button"
                  onclick="reloadSessions(true)"
                  title="Ricarica da SQLite"
                  class="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors border border-darkborder shrink-0 cursor-pointer"
                >
                  <i id="session-reload-icon" class="fa-solid fa-arrows-rotate text-[11px]"></i>
                </button>
              </div>

              <!-- Filter Chips & Workspace Toggle -->
              <div class="px-3 py-2 border-b border-darkborder/60 bg-gray-900/30 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                <button
                  type="button"
                  onclick="setSessionFilter('all')"
                  class="session-filter-btn px-2.5 py-1 rounded-md font-semibold transition-all bg-indigo-600 text-white shrink-0 cursor-pointer"
                  data-filter="all"
                >
                  <span data-i18n="chat.filterAll">Tutte</span> (<span id="count-all">0</span>)
                </button>
                <button
                  type="button"
                  onclick="setSessionFilter('cron')"
                  data-tooltip="tt.sessionCron"
                  class="session-filter-btn px-2.5 py-1 rounded-md font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all shrink-0 cursor-pointer"
                  data-filter="cron"
                >
                  <span data-i18n="chat.filterCron">⚡ Con Cron</span> (<span id="count-cron">0</span>)
                </button>
                <button
                  type="button"
                  onclick="setSessionFilter('root')"
                  data-tooltip="tt.sessionRoot"
                  class="session-filter-btn px-2.5 py-1 rounded-md font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all shrink-0 cursor-pointer"
                  data-filter="root"
                >
                  <span data-i18n="chat.filterRoot">💬 Principali</span> (<span id="count-root">0</span>)
                </button>
                <button
                  type="button"
                  onclick="setSessionFilter('sub')"
                  data-tooltip="tt.sessionSub"
                  class="session-filter-btn px-2.5 py-1 rounded-md font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all shrink-0 cursor-pointer"
                  data-filter="sub"
                >
                  <span data-i18n="chat.filterSub">🤖 Subagenti</span> (<span id="count-sub">0</span>)
                </button>
                <label class="ml-auto flex items-center gap-1.5 text-[10px] text-gray-400 cursor-pointer pl-2 shrink-0 select-none">
                  <input
                    type="checkbox"
                    id="session-filter-curdir-only"
                    checked
                    onchange="applySessionFilters()"
                    class="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-0 w-3 h-3 cursor-pointer"
                  />
                  <span data-i18n="chat.onlyRepo">Solo Questo Repo</span>
                </label>
              </div>

              <!-- Session Items List (Scrollable Container) -->
              <div id="session-items-container" class="overflow-y-auto p-2 space-y-1 flex-1 max-h-[380px]">
                <!-- Dynamically populated -->
              </div>

              <!-- Footer with stats & color legend -->
              <div class="px-3 py-2 bg-gray-900/80 border-t border-darkborder flex items-center justify-between text-[10px] text-gray-400">
                <div class="flex items-center gap-2.5">
                  <span class="flex items-center gap-1" data-tooltip="tt.sessionCron"><span class="w-2 h-2 rounded-full bg-purple-400"></span> ⚡ Cron Job</span>
                  <span class="flex items-center gap-1" data-tooltip="tt.sessionRoot"><span class="w-2 h-2 rounded-full bg-sky-400"></span> 💬 Principale (Root)</span>
                  <span class="flex items-center gap-1" data-tooltip="tt.sessionSub"><span class="w-2 h-2 rounded-full bg-amber-400"></span> 🤖 Subagente</span>
                </div>
                <span id="session-picker-status" class="font-mono text-gray-500">0 sessioni</span>
              </div>
            </div>
          </div>

          <!-- Auto-refresh toggle -->
          <label class="flex items-center space-x-2 cursor-pointer bg-gray-900/60 border border-darkborder px-2.5 py-1.5 rounded-lg shrink-0">
            <input type="checkbox" id="chat-autorefresh" checked onchange="toggleAutoRefresh(this.checked)" class="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer">
            <span class="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <span id="chat-live-badge" class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span> <span data-i18n="chat.autoRefresh">Auto-Aggiorna (3s)</span>
            </span>
          </label>
        </div>
      </div>

      <!-- Chat Messages Container -->
      <div class="bg-darkcard border border-darkborder rounded-2xl flex flex-col h-[650px] shadow-2xl relative overflow-hidden">
        <!-- Active Session Context Banner -->
        <div id="chat-session-banner" class="px-4 py-2 bg-gray-950/80 border-b border-darkborder flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2 min-w-0">
            <span id="banner-session-type-badge">
              <span class="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-[10px] font-semibold">Sessione</span>
            </span>
            <span id="banner-session-title" class="font-bold text-gray-100 truncate max-w-[260px] sm:max-w-[380px]">Caricamento...</span>
            <span id="banner-session-id" class="text-[10px] text-gray-400 font-mono bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800 hidden sm:inline-block"></span>
            <button onclick="copyActiveSessionId()" title="Copia ID Sessione" class="text-gray-400 hover:text-indigo-400 text-xs p-1 transition-colors cursor-pointer">
              <i id="copy-session-icon" class="fa-regular fa-copy"></i>
            </button>
          </div>
          <div class="flex items-center gap-3 text-[11px] text-gray-400 shrink-0">
            <span id="banner-session-updated" class="flex items-center gap-1">
              <i class="fa-regular fa-clock text-[10px]"></i> <span id="banner-updated-text">—</span>
            </span>
            <span id="banner-job-link-container"></span>
            <button onclick="switchTab('diff')" data-tooltip="tt.tabDiff" class="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-darkborder px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer">
              <i class="fa-solid fa-code-compare text-[9px] text-indigo-400"></i> <span data-i18n="nav.diff">Diff File</span>
            </button>
          </div>
        </div>

        <!-- Messages Scroll Area -->
        <div id="chat-messages" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div class="text-center py-20 text-gray-500">
            <i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-400 mb-3"></i>
            <p class="text-sm" data-i18n="loading.chat">Caricamento conversazione in tempo reale...</p>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <div class="p-3 bg-gray-900/80 border-t border-darkborder flex items-end space-x-2">
          <textarea id="chat-prompt-input" rows="1" placeholder="Invia un prompt o istruzione manuale a questa sessione (Invio invia, Shift+Invio a capo)..." data-i18n-placeholder="chat.promptPlaceholder" class="flex-1 bg-gray-950 border border-darkborder rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none max-h-36 leading-relaxed" onkeydown="handleChatInputKey(event)" oninput="autoResizeTextarea(this)"></textarea>
          <button onclick="sendManualPrompt()" id="send-prompt-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all shrink-0">
            <i class="fa-solid fa-paper-plane"></i> <span data-i18n="chat.send">Invia</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ============================================== -->
    <!-- TAB 3: PERSISTENT MEMORY & ARTIFACTS           -->
    <!-- ============================================== -->
    <section id="view-memory" role="tabpanel" aria-labelledby="tab-btn-memory" class="tab-view hidden space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-white tracking-tight" data-i18n="memory.title">Memoria Persistente Cron</h2>
          <p class="text-xs text-gray-400" data-i18n="memory.subtitle">File markdown salvati in .opencode/cron/memory/</p>
        </div>
        <div class="flex items-center space-x-2">
          <select id="memory-job-select" onchange="loadJobMemory(this.value)" class="bg-gray-900 border border-darkborder text-xs rounded-lg px-3 py-1.5 text-gray-200">
            <option value="">Seleziona un job...</option>
          </select>
          <button onclick="saveCurrentMemory()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <i class="fa-solid fa-floppy-disk text-[10px]"></i> <span data-i18n="memory.save">Salva Modifiche</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Editor -->
        <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col h-[580px]">
          <div class="flex items-center justify-between pb-3 border-b border-darkborder mb-3">
            <span class="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-pen-to-square text-indigo-400"></i> <span data-i18n="memory.editor">Editor Markdown</span>
            </span>
            <span id="memory-meta" data-tooltip="tt.memoryHashes" class="text-xs font-mono text-gray-500 cursor-help"></span>
          </div>
          <textarea id="memory-editor" class="flex-1 w-full bg-gray-950 font-mono text-xs text-gray-200 p-3 rounded-xl border border-darkborder focus:outline-none focus:border-indigo-500 resize-none" placeholder="Contenuto memoria persistent..."></textarea>
        </div>

        <!-- Live Preview -->
        <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col h-[580px]">
          <div class="flex items-center justify-between pb-3 border-b border-darkborder mb-3">
            <span class="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-eye text-indigo-400"></i> <span data-i18n="memory.preview">Anteprima Renderizzata</span>
            </span>
          </div>
          <div id="memory-preview" class="flex-1 overflow-y-auto p-4 bg-gray-950/60 rounded-xl border border-darkborder text-sm prose-dark">
            <p class="text-gray-500 italic">Seleziona un job per vedere la memoria persistente renderizzata.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================== -->
    <!-- TAB 4: SYSTEM LOGS & TICKER                    -->
    <!-- ============================================== -->
    <section id="view-logs" role="tabpanel" aria-labelledby="tab-btn-logs" class="tab-view hidden space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-white tracking-tight" data-i18n="logs.title">Logs & Diagnostica Ticker</h2>
          <p class="text-xs text-gray-400" data-i18n="logs.subtitle">Output da ~/Library/Logs/opencode-cron.log e .err</p>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="loadLogs()" class="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-darkborder px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <i class="fa-solid fa-arrows-rotate text-[10px]"></i> <span data-i18n="logs.reload">Ricarica Logs</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Stdout Log -->
        <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col h-[600px]">
          <div class="flex items-center justify-between pb-2 border-b border-darkborder mb-2">
            <span class="text-xs font-bold text-emerald-400 font-mono">STDOUT (opencode-cron.log)</span>
          </div>
          <pre id="log-stdout" class="flex-1 overflow-y-auto p-3 bg-gray-950 font-mono text-[11px] text-emerald-300/90 rounded-xl whitespace-pre-wrap leading-relaxed select-text"></pre>
        </div>

        <!-- Stderr Log -->
        <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col h-[600px]">
          <div class="flex items-center justify-between pb-2 border-b border-darkborder mb-2">
            <span class="text-xs font-bold text-rose-400 font-mono">STDERR (opencode-cron.err)</span>
          </div>
          <pre id="log-stderr" class="flex-1 overflow-y-auto p-3 bg-gray-950 font-mono text-[11px] text-rose-300/90 rounded-xl whitespace-pre-wrap leading-relaxed select-text"></pre>
        </div>
      </div>
    </section>

    <!-- ============================================== -->
    <!-- TAB 5: GIT DIFF & FILE CHANGES                 -->
    <!-- ============================================== -->
    <section id="view-diff" role="tabpanel" aria-labelledby="tab-btn-diff" class="tab-view hidden space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-white tracking-tight" data-i18n="diff.title">Git Diff & File Changes</h2>
            <span id="git-branch-badge" class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <i class="fa-solid fa-code-branch text-[9px] mr-1"></i><span id="git-branch-name">main</span>
            </span>
          </div>
          <p class="text-xs text-gray-400" data-i18n="diff.subtitle">Verifica in tempo reale tutti i file creati, modificati o eliminati nel workspace locale.</p>
        </div>
        <div class="flex items-center space-x-2">
          <button type="button" onclick="loadGitDiff()" class="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-darkborder px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <i id="git-refresh-icon" class="fa-solid fa-arrows-rotate text-[11px]"></i> <span data-i18n="diff.reload">Ricarica Diff</span>
          </button>
        </div>
      </div>

      <!-- Diff Stats Bar -->
      <div id="git-stat-bar" class="p-3 bg-darkcard border border-darkborder rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-gray-300 font-mono text-[11px]">
          <i class="fa-solid fa-chart-simple text-indigo-400"></i>
          <span id="git-stat-summary" data-i18n="loading.git">Caricamento stato Git...</span>
        </div>
        <div id="git-files-summary" class="flex items-center gap-2 text-[11px]"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
        <!-- File list sidebar (4 cols) -->
        <div class="lg:col-span-4 bg-darkcard border border-darkborder rounded-2xl p-3 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between pb-2.5 border-b border-darkborder mb-2">
            <span class="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-folder-tree text-indigo-400"></i> <span data-i18n="diff.filesInvolved">File Coinvolti</span> (<span id="git-files-count">0</span>)
            </span>
            <button type="button" onclick="selectGitFile('')" class="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer" data-i18n="diff.all">
              Tutto
            </button>
          </div>
          <div id="git-file-list" class="flex-1 overflow-y-auto space-y-1 pr-1">
            <div class="text-center py-12 text-gray-500 text-xs" data-i18n="loading.generic">Caricamento file...</div>
          </div>
        </div>

        <!-- Diff Viewer pane (8 cols) -->
        <div class="lg:col-span-8 bg-darkcard border border-darkborder rounded-2xl flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-4 py-2.5 border-b border-darkborder bg-gray-900/60">
            <span id="git-diff-filename" class="text-xs font-mono font-semibold text-gray-200 truncate">
              Tutte le modifiche (Unified Diff)
            </span>
            <span id="git-diff-lines-count" class="text-[10px] font-mono text-gray-400"></span>
          </div>
          <div id="git-diff-content" class="flex-1 overflow-auto p-4 bg-gray-950 font-mono text-[11px] leading-relaxed select-text">
            <div class="text-center py-20 text-gray-500">
              <i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-400 mb-2"></i>
              <p class="text-xs" data-i18n="loading.diff">Caricamento diff...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- ============================================== -->
  <!-- MODAL: NUOVO / MODIFICA JOB                    -->
  <!-- ============================================== -->
  <div id="job-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <h3 id="modal-title" class="text-base font-bold text-white" data-i18n="modal.newTitle">Nuovo Cron Job</h3>
        <button onclick="closeModal()" aria-label="Chiudi finestra modale" class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form id="job-form" onsubmit="handleJobSubmit(event)" class="space-y-4 text-xs">
        <input type="hidden" id="form-job-id" />

        <div>
          <label for="form-title" class="block font-medium text-gray-300 mb-1" data-i18n="modal.fieldTitle">Titolo Job</label>
          <input type="text" id="form-title" required placeholder="es. AI News Monitor 5m" class="w-full bg-gray-950 border border-darkborder rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500">
        </div>

        <div class="space-y-2 bg-gray-950/60 p-3 rounded-xl border border-darkborder">
          <div class="flex items-center justify-between">
            <label for="form-schedule" class="block font-medium text-gray-300" data-i18n="modal.fieldSchedule">Pianificazione / Intervallo</label>
            <span class="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
              <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Visual Builder
            </span>
          </div>

          <!-- Preset Pills -->
          <div id="modal-presets-container" class="flex flex-wrap gap-1.5">
            <button type="button" onclick="applySchedulePreset('5m')" class="px-2 py-0.5 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">⚡ 5m</button>
            <button type="button" onclick="applySchedulePreset('15m')" class="px-2 py-0.5 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">⚡ 15m</button>
            <button type="button" onclick="applySchedulePreset('30m')" class="px-2 py-0.5 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">⚡ 30m</button>
            <button type="button" onclick="applySchedulePreset('1h')" class="px-2 py-0.5 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">⏰ 1h</button>
            <button type="button" onclick="applySchedulePreset('0 9 * * *')" class="px-2 py-0.5 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">📅 09:00</button>
            <button type="button" onclick="applySchedulePreset('0 18 * * *')" class="px-2 py-0.5 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">📅 18:00</button>
            <button type="button" onclick="applySchedulePreset('0 9 * * 1-5')" class="px-2 py-0.5 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">🏢 Lun-Ven 09:00</button>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <div data-tooltip="tt.formSchedule">
              <label for="form-schedule" class="text-[10px] text-gray-400 block mb-0.5"><span data-i18n="modal.fieldSchedule">Espressione</span> <span class="oc-help-badge">?</span></label>
              <input type="text" id="form-schedule" required placeholder="5m, 1h, */5 * * * *" oninput="debounceSchedulePreview(this.value)" class="w-full bg-gray-950 border border-darkborder rounded-lg px-3 py-1.5 text-gray-100 font-mono text-xs focus:outline-none focus:border-indigo-500">
            </div>
            <div data-tooltip="tt.formMaxRuns">
              <label for="form-max-runs" class="text-[10px] text-gray-400 block mb-0.5"><span data-i18n="modal.fieldMaxRuns">Max Runs (0 = illimitato)</span> <span class="oc-help-badge">?</span></label>
              <input type="number" id="form-max-runs" value="0" class="w-full bg-gray-950 border border-darkborder rounded-lg px-3 py-1.5 text-gray-100 focus:outline-none focus:border-indigo-500">
            </div>
          </div>

          <!-- Real-time Human Description & Next 3 Runs Card -->
          <div id="schedule-preview-box" class="p-2.5 rounded-lg bg-gray-900/70 border border-darkborder/70 text-[11px] space-y-1">
            <div class="flex items-center gap-1.5 text-gray-300 font-medium">
              <i class="fa-regular fa-clock text-indigo-400 text-xs"></i>
              <span id="schedule-desc-text">Inserisci un intervallo o clicca su un preset sopra.</span>
            </div>
            <div id="schedule-next-runs" class="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2 pt-0.5">
              <!-- Prossimi 3 tick -->
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="form-session-id" class="block font-medium text-gray-300 mb-1" data-i18n="modal.fieldSession">Sessione OpenCode</label>
            <select id="form-session-id" class="w-full bg-gray-950 border border-darkborder rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500">
              <!-- Loaded via JS -->
            </select>
          </div>
          <div>
            <label for="form-model" class="block font-medium text-gray-300 mb-1" data-i18n="modal.fieldModel">Modello LLM (opzionale)</label>
            <input type="text" id="form-model" placeholder="openai/gpt-6.1-sol" class="w-full bg-gray-950 border border-darkborder rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500">
          </div>
        </div>

        <div data-tooltip="tt.formSystem">
          <label for="form-system-prompt" class="block font-medium text-gray-300 mb-1"><span data-i18n="modal.fieldSystem">Prompt di Sistema (Frozen)</span> <span class="oc-help-badge">?</span></label>
          <textarea id="form-system-prompt" rows="3" required placeholder="Obiettivo e regole stabili dell'agente per ogni tick..." class="w-full bg-gray-950 border border-darkborder rounded-lg p-2.5 text-gray-100 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"></textarea>
        </div>

        <div data-tooltip="tt.formFollowup">
          <label for="form-followup-prompt" class="block font-medium text-gray-300 mb-1"><span data-i18n="modal.fieldFollowup">Followup Prompt (Azione per Tick)</span> <span class="oc-help-badge">?</span></label>
          <textarea id="form-followup-prompt" rows="3" required placeholder="Cosa deve fare l'agente ad ogni tick pianificato..." class="w-full bg-gray-950 border border-darkborder rounded-lg p-2.5 text-gray-100 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"></textarea>
        </div>

        <div class="flex items-center justify-end space-x-2 pt-3 border-t border-darkborder">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer" data-i18n="modal.cancel">Annulla</button>
          <button type="submit" id="modal-submit-btn" class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer" data-i18n="modal.save">Salva Job</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- MODAL: CONFERMA ELIMINAZIONE                   -->
  <!-- ============================================== -->
  <div id="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
      <div class="flex items-center space-x-3 text-rose-400 mb-3">
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <i class="fa-solid fa-triangle-exclamation text-base"></i>
        </div>
        <div>
          <h3 id="confirm-modal-title" class="text-sm font-bold text-white" data-i18n="modal.deleteTitle">Conferma Eliminazione</h3>
          <p class="text-[11px] text-gray-400" data-i18n="modal.irreversibleAction">Azione irreversibile</p>
        </div>
      </div>
      <p id="confirm-modal-message" class="text-xs text-gray-300 leading-relaxed mt-2 bg-gray-950/60 p-3 rounded-xl border border-darkborder">Sei sicuro di voler eliminare questo job?</p>
      <div class="flex items-center justify-end space-x-2 pt-4 mt-3 border-t border-darkborder">
        <button type="button" onclick="closeConfirmModal()" class="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs font-medium" data-i18n="modal.cancel">Annulla</button>
        <button type="button" id="confirm-modal-btn" class="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500 text-xs shadow-md shadow-rose-600/30" data-i18n="job.deleteTitle">Elimina Job</button>
      </div>
    </div>
  </div>

  <!-- Client JavaScript Logic -->
  <script>
    ${getUiEnhancementsScript()}

    let currentTab = 'jobs';
    let currentJobs = [];
    let currentSessions = [];
    let activeSessionId = '';
    let autoRefreshTimer = null;
    let lastRenderedMessageIds = new Set();

    // Tab switching
    function switchTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.tab-view').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-brand-600', 'text-white', 'shadow-sm');
        el.classList.add('text-gray-400');
        el.setAttribute('aria-selected', 'false');
      });

      const activeView = document.getElementById('view-' + tab);
      const activeBtn = document.getElementById('tab-btn-' + tab);
      if (activeView) activeView.classList.remove('hidden');
      if (activeBtn) {
        activeBtn.classList.add('bg-brand-600', 'text-white', 'shadow-sm');
        activeBtn.classList.remove('text-gray-400');
        activeBtn.setAttribute('aria-selected', 'true');
      }

      if (tab === 'chat') {
        if (!activeSessionId && currentSessions.length > 0) {
          selectSession(currentSessions[0].id);
        } else if (activeSessionId) {
          updateActiveSessionTrigger();
          updateActiveSessionBanner();
          loadSessionChat(activeSessionId);
        }
      } else if (tab === 'memory') {
        loadMemoryList();
      } else if (tab === 'logs') {
        loadLogs();
      } else if (tab === 'diff') {
        loadGitDiff(currentGitFile);
      }
    }

    function formatInterval(everyMs) {
      if (!everyMs || everyMs < 1000) return '1m';
      if (everyMs % 3600000 === 0) return (everyMs / 3600000) + 'h';
      if (everyMs % 60000 === 0) return (everyMs / 60000) + 'm';
      return Math.round(everyMs / 1000) + 's';
    }

    // Toast notifications with interactive selection and severity icons
    function showToast(msg, type = 'info') {
      const c = document.getElementById('toast-container');
      const t = document.createElement('div');
      const colors = {
        success: 'bg-emerald-900/95 border-emerald-500 text-emerald-100',
        error: 'bg-rose-900/95 border-rose-500 text-rose-100',
        info: 'bg-indigo-900/95 border-indigo-500 text-indigo-100'
      };
      const icons = {
        success: 'fa-circle-check text-emerald-400',
        error: 'fa-triangle-exclamation text-rose-400',
        info: 'fa-circle-info text-indigo-400'
      };
      t.className = 'pointer-events-auto select-text px-4 py-3 rounded-xl border text-xs font-medium shadow-2xl backdrop-blur-md flex items-center space-x-2 transition-all ' + (colors[type] || colors.info);
      t.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.info) + ' text-xs"></i><span>' + escapeHtml(msg) + '</span>';
      c.appendChild(t);
      setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 4000);
    }

    // Refresh All Data
    async function refreshAll() {
      const spinner = document.getElementById('refresh-spinner');
      spinner.classList.add('fa-spin');
      try {
        await Promise.all([loadStatus(), loadJobs(), loadSessions(), loadGitSummary()]);
        if (currentTab === 'chat' && activeSessionId) {
          await loadSessionChat(activeSessionId, false);
        } else if (currentTab === 'diff') {
          await loadGitDiff(currentGitFile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => spinner.classList.remove('fa-spin'), 500);
      }
    }

    // Status and Directory
    async function loadStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        document.getElementById('current-dir').textContent = data.directory || '—';
      } catch (err) {
        console.error(err);
      }
    }

    // Jobs management
    async function loadJobs() {
      try {
        const res = await fetch('/api/jobs');
        currentJobs = await res.json();
        renderJobs();
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.loadJobsError') : 'Errore nel caricamento dei job: ') + err.message, 'error');
      }
    }

    function renderJobs() {
      const container = document.getElementById('jobs-container');
      if (!currentJobs.length) {
        container.innerHTML = '<div class="col-span-full py-16 text-center text-gray-500 bg-darkcard/50 rounded-2xl border border-dashed border-darkborder">' +
          '<i class="fa-solid fa-clock text-3xl mb-3 text-gray-600"></i>' +
          '<p class="text-sm font-medium text-gray-400">' + escapeHtml(t('jobs.emptyTitle')) + '</p>' +
          '<p class="text-xs text-gray-500 mt-1">' + escapeHtml(t('jobs.emptyDesc')) + '</p>' +
        '</div>';
        return;
      }

      let activeCount = 0;
      let totalRuns = 0;
      let earliestNext = null;

      container.innerHTML = currentJobs.map(job => {
        const isMaxed = job.maxRuns > 0 && job.runCount >= job.maxRuns;
        if (job.enabled && !isMaxed) activeCount++;
        totalRuns += (job.runCount || 0);
        if (job.enabled && !isMaxed && job.nextRunAt) {
          const ts = new Date(job.nextRunAt).getTime();
          if (!earliestNext || ts < earliestNext) earliestNext = ts;
        }

        const statusBadge = isMaxed
          ? \`<span data-tooltip="tt.maxRunsBadge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">🏁 \${escapeHtml(t('job.completed'))} (\${job.runCount}/\${job.maxRuns})</span>\`
          : job.enabled
            ? \`<span data-tooltip="tt.kpiActive" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>\${escapeHtml(t('job.active'))}</span>\`
            : \`<span data-tooltip="tt.toggleBtn" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-700 text-gray-400">\${escapeHtml(t('job.paused'))}</span>\`;

        const schedDesc = job.schedule.kind === 'interval'
          ? formatInterval(job.schedule.everyMs)
          : 'Cron: ' + escapeHtml(job.schedule.cron || '');

        const safeId = escapeHtml(job.id);
        const safeTitle = escapeHtml(job.title);
        const safePrompt = escapeHtml(job.followupPrompt);
        const safeSession = escapeHtml(job.sessionID);

        return \`
          <div class="bg-darkcard border border-darkborder hover:border-gray-700 transition-all rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="text-sm font-bold text-white tracking-tight">\${safeTitle}</h3>
                    \${statusBadge}
                  </div>
                  <p class="text-[11px] font-mono text-indigo-400 mt-0.5">\${safeId}</p>
                </div>
                <div class="flex items-center space-x-1">
                  <button id="run-btn-\${safeId}" onclick="triggerRunNow('\${safeId}')" data-tooltip="tt.runNowBtn" aria-label="\${escapeHtml(t('job.runNowTitle'))}" class="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600/20 rounded-lg transition-colors border border-darkborder">
                    <i class="fa-solid fa-bolt text-xs"></i>
                  </button>
                  <button onclick="toggleJob('\${safeId}', \${!job.enabled})" data-tooltip="tt.toggleBtn" aria-label="\${escapeHtml(job.enabled ? t('job.pauseTitle') : t('job.resumeTitle'))}" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-darkborder">
                    <i class="fa-solid \${job.enabled ? 'fa-pause' : 'fa-play'} text-xs"></i>
                  </button>
                  <button onclick="editJob('\${safeId}')" data-tooltip="tt.tabJobs" aria-label="\${escapeHtml(t('job.editBtn'))}" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-darkborder">
                    <i class="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button onclick="deleteJob('\${safeId}')" data-tooltip="tt.deleteBtn" aria-label="\${escapeHtml(t('job.deleteTitle'))}" class="p-2 text-rose-400 hover:text-white hover:bg-rose-600/20 rounded-lg transition-colors border border-darkborder">
                    <i class="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-2 text-[11px] bg-gray-950/70 p-3 rounded-xl border border-darkborder">
                <div><span class="text-gray-500">\${escapeHtml(t('job.schedule'))}:</span> <span class="text-gray-200 font-medium">\${schedDesc}</span></div>
                <div><span class="text-gray-500">\${escapeHtml(t('job.executions'))}:</span> <span class="text-gray-200 font-medium font-mono">\${job.runCount}\${job.maxRuns ? '/' + job.maxRuns : ''}</span></div>
                <div><span class="text-gray-500">\${escapeHtml(t('job.lastRun'))}:</span> <span class="text-gray-200 font-mono">\${job.lastRunAt ? new Date(job.lastRunAt).toLocaleTimeString() : '—'}</span></div>
                <div><span class="text-gray-500">\${escapeHtml(t('job.nextRun'))}:</span> <span class="\${isMaxed ? 'text-amber-400' : 'text-emerald-400'} font-mono">\${(job.enabled && !isMaxed && job.nextRunAt) ? new Date(job.nextRunAt).toLocaleTimeString() : (isMaxed ? escapeHtml(t('job.completed')) : '—')}</span></div>
              </div>

              <div class="mt-3 text-[11px] text-gray-400 line-clamp-2 italic bg-gray-900/40 p-2 rounded-lg border border-darkborder/50">
                "\${safePrompt}"
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-darkborder/70 flex items-center justify-between text-[11px] text-gray-500">
              <span class="truncate max-w-[220px] text-gray-300 font-medium" data-tooltip-raw="Session ID: \${safeSession}">
                <i class="fa-solid fa-comment-dots text-indigo-400 mr-1.5"></i>\${(() => {
                  const matchedSes = currentSessions.find(s => s.id === job.sessionID);
                  return matchedSes && matchedSes.title ? escapeHtml(matchedSes.title) : safeSession;
                })()}
              </span>
              <button onclick="jumpToChat('\${safeSession}')" data-tooltip="tt.tabChat" class="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer">
                <span>\${escapeHtml(t('job.viewChat'))}</span> <i class="fa-solid fa-arrow-right rtl:rotate-180 text-[9px]"></i>
              </button>
            </div>
          </div>
        \`;
      }).join('');

      document.getElementById('stat-active').textContent = activeCount;
      document.getElementById('stat-runs').textContent = totalRuns;
      document.getElementById('stat-next-tick').textContent = earliestNext
        ? new Date(earliestNext).toLocaleTimeString()
        : '—';
    }

    // Trigger Tick Now
    async function triggerRunNow(id) {
      const btn = document.getElementById('run-btn-' + id);
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i>';
      }
      showToast((typeof t === 'function' ? t('toast.tickRunning') : 'Esecuzione tick in corso per ') + id + '...', 'info');
      try {
        const res = await fetch('/api/jobs/' + encodeURIComponent(id) + '/run', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.tickSuccess') : 'Tick completato con successo!', 'success');
          await loadJobs();
          if (currentTab === 'chat' && activeSessionId) await loadSessionChat(activeSessionId);
        } else {
          showToast((typeof t === 'function' ? t('toast.tickError') : 'Errore tick: ') + (data.error || 'fallito'), 'error');
        }
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.netError') : 'Errore di rete: ') + err.message, 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-bolt text-xs"></i>';
        }
      }
    }

    // Toggle Job Enabled/Disabled
    async function toggleJob(id, enable) {
      try {
        const res = await fetch('/api/jobs/' + encodeURIComponent(id) + '/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: enable })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Operazione fallita');
        showToast(enable ? (typeof t === 'function' ? t('toast.jobResumed') : 'Job riattivato') : (typeof t === 'function' ? t('toast.jobPaused') : 'Job messo in pausa'), 'info');
        await loadJobs();
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.genericError') : 'Errore: ') + err.message, 'error');
      }
    }

    // In-App Confirm Delete Job
    let pendingDeleteJobId = null;

    function deleteJob(id) {
      pendingDeleteJobId = id;
      const modal = document.getElementById('confirm-modal');
      const msg = document.getElementById('confirm-modal-message');
      const btn = document.getElementById('confirm-modal-btn');
      const template = (typeof t === 'function' ? t('modal.deleteConfirmMsg') : 'Sei sicuro di voler eliminare il job "{id}"? I tick programmati cesseranno immediatamente.');
      msg.textContent = template.replace('{id}', id);
      btn.onclick = () => {
        closeConfirmModal();
        if (pendingDeleteJobId) executeDeleteJob(pendingDeleteJobId);
      };
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      setTimeout(() => btn.focus(), 50);
    }

    function closeConfirmModal() {
      const modal = document.getElementById('confirm-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
      pendingDeleteJobId = null;
    }

    async function executeDeleteJob(id) {
      try {
        const res = await fetch('/api/jobs/' + encodeURIComponent(id), { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Eliminazione fallita');
        showToast(typeof t === 'function' ? t('toast.jobDeleted') : 'Job eliminato con successo', 'success');
        await loadJobs();
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.deleteError') : 'Errore eliminazione: ') + err.message, 'error');
      }
    }

    // ==============================================
    // SESSIONS MANAGEMENT & RICH PICKER
    // ==============================================
    let currentSessionFilter = 'all';
    let sessionSearchQuery = '';
    let isSessionPickerOpen = false;

    function timeAgo(ts) {
      if (!ts) return '—';
      const now = Date.now();
      const diff = Math.max(0, now - ts);
      const sec = Math.floor(diff / 1000);
      if (sec < 60) return 'poco fa';
      const min = Math.floor(sec / 60);
      if (min < 60) return min + 'm fa';
      const hours = Math.floor(min / 60);
      if (hours < 24) return hours + 'h fa';
      const days = Math.floor(hours / 24);
      if (days < 7) return days + 'g fa';
      const d = new Date(ts);
      return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    }

    function toggleSessionPicker() {
      if (isSessionPickerOpen) closeSessionPicker();
      else openSessionPicker();
    }

    function openSessionPicker() {
      isSessionPickerOpen = true;
      const popover = document.getElementById('session-picker-dropdown');
      const trigger = document.getElementById('session-picker-trigger');
      const chevron = document.getElementById('session-trigger-chevron');
      if (popover) popover.classList.remove('hidden');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.classList.add('rotate-180');
      const input = document.getElementById('session-search-input');
      if (input) {
        input.focus();
      }
      renderSessionList();
    }

    function closeSessionPicker() {
      isSessionPickerOpen = false;
      const popover = document.getElementById('session-picker-dropdown');
      const trigger = document.getElementById('session-picker-trigger');
      const chevron = document.getElementById('session-trigger-chevron');
      if (popover) popover.classList.add('hidden');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.classList.remove('rotate-180');
    }

    function filterSessionList(query) {
      sessionSearchQuery = (query || '').toLowerCase().trim();
      const clearBtn = document.getElementById('session-search-clear');
      if (clearBtn) {
        if (sessionSearchQuery) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }
      renderSessionList();
    }

    function clearSessionSearch() {
      const input = document.getElementById('session-search-input');
      if (input) input.value = '';
      sessionSearchQuery = '';
      const clearBtn = document.getElementById('session-search-clear');
      if (clearBtn) clearBtn.classList.add('hidden');
      renderSessionList();
    }

    function setSessionFilter(type) {
      currentSessionFilter = type;
      document.querySelectorAll('.session-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === type) {
          btn.classList.remove('text-gray-400', 'hover:text-gray-200', 'hover:bg-gray-800');
          btn.classList.add('bg-indigo-600', 'text-white', 'font-semibold');
        } else {
          btn.classList.add('text-gray-400', 'hover:text-gray-200', 'hover:bg-gray-800');
          btn.classList.remove('bg-indigo-600', 'text-white', 'font-semibold');
        }
      });
      renderSessionList();
    }

    function applySessionFilters() {
      renderSessionList();
    }

    async function reloadSessions(interactive = false) {
      const icon = document.getElementById('session-reload-icon');
      if (icon) icon.classList.add('fa-spin');
      try {
        await loadSessions();
        if (interactive) showToast(typeof t === 'function' ? t('toast.sessionsUpdated') : 'Lista sessioni aggiornata da SQLite', 'info');
      } finally {
        if (icon) icon.classList.remove('fa-spin');
      }
    }

    function renderSessionList() {
      const container = document.getElementById('session-items-container');
      if (!container) return;

      const onlyCurDir = Boolean(document.getElementById('session-filter-curdir-only')?.checked);

      // Base pool depending on curDir toggle
      const pool = currentSessions.filter(s => {
        if (onlyCurDir && !s.isCurrentWorkspace) return false;
        return true;
      });

      // Update counters
      const countAll = pool.length;
      const countCron = pool.filter(s => s.hasCron).length;
      const countRoot = pool.filter(s => s.isRoot).length;
      const countSub = pool.filter(s => s.isSubagent).length;

      const elAll = document.getElementById('count-all');
      const elCron = document.getElementById('count-cron');
      const elRoot = document.getElementById('count-root');
      const elSub = document.getElementById('count-sub');
      if (elAll) elAll.textContent = countAll;
      if (elCron) elCron.textContent = countCron;
      if (elRoot) elRoot.textContent = countRoot;
      if (elSub) elSub.textContent = countSub;

      // Apply type filter
      let filtered = pool.filter(s => {
        if (currentSessionFilter === 'cron') return s.hasCron;
        if (currentSessionFilter === 'root') return s.isRoot;
        if (currentSessionFilter === 'sub') return s.isSubagent;
        return true;
      });

      // Apply text search filter
      if (sessionSearchQuery) {
        filtered = filtered.filter(s => {
          const title = (s.title || '').toLowerCase();
          const id = (s.id || '').toLowerCase();
          const dir = (s.directory || '').toLowerCase();
          const cronNames = (s.cronJobs || []).map(j => (j.title || '').toLowerCase()).join(' ');
          return title.includes(sessionSearchQuery) ||
                 id.includes(sessionSearchQuery) ||
                 dir.includes(sessionSearchQuery) ||
                 cronNames.includes(sessionSearchQuery);
        });
      }

      const statusEl = document.getElementById('session-picker-status');
      if (statusEl) statusEl.textContent = \`\${filtered.length} di \${currentSessions.length} sessioni\`;

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="py-8 text-center text-gray-500">
            <i class="fa-solid fa-filter text-2xl mb-2 text-gray-600"></i>
            <p class="text-xs font-semibold text-gray-400">Nessuna sessione trovata</p>
            <p class="text-[11px] text-gray-600 mt-0.5">Prova a cambiare filtri o disattivare "Solo Questo Repo"</p>
            <button type="button" onclick="clearSessionSearch(); setSessionFilter('all'); const chk=document.getElementById('session-filter-curdir-only'); if(chk) chk.checked=false; renderSessionList();" class="mt-3 px-2.5 py-1 text-[11px] bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg cursor-pointer">
              Mostra Tutte
            </button>
          </div>
        \`;
        return;
      }

      // Group into 4 distinct visual categories
      const groupCron = filtered.filter(s => s.hasCron && s.isCurrentWorkspace);
      const groupRoot = filtered.filter(s => !s.hasCron && s.isRoot && s.isCurrentWorkspace);
      const groupSub = filtered.filter(s => !s.hasCron && s.isSubagent && s.isCurrentWorkspace);
      const groupOther = filtered.filter(s => !s.isCurrentWorkspace);

      function renderSessionRow(s) {
        const isSelected = s.id === activeSessionId;
        const safeTitle = escapeHtml(s.title || s.id);
        const safeId = escapeHtml(s.id);
        const shortId = safeId.slice(0, 14) + '...';
        const timeStr = timeAgo(s.time_updated);

        let typeBadge = '';
        let borderClass = isSelected
          ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/50'
          : 'border-darkborder/50 hover:border-gray-700 bg-gray-900/40 hover:bg-gray-900/90';

        if (s.hasCron) {
          const jobTitles = (s.cronJobs || []).map(j => escapeHtml(j.title)).join(', ');
          typeBadge = \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
              <i class="fa-solid fa-bolt text-[9px] text-purple-400"></i> Cron: \${jobTitles}
            </span>
          \`;
          if (isSelected) borderClass = 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-500/50';
        } else if (s.isRoot) {
          typeBadge = \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
              <i class="fa-solid fa-comments text-[9px] text-sky-400"></i> Principale (Root)
            </span>
          \`;
          if (isSelected) borderClass = 'border-sky-500 bg-sky-950/40 ring-1 ring-sky-500/50';
        } else if (s.isSubagent) {
          typeBadge = \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300/90 border border-amber-500/20 shrink-0">
              <i class="fa-solid fa-robot text-[9px] text-amber-400"></i> Sub-agente
            </span>
          \`;
          if (isSelected) borderClass = 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500/50';
        } else {
          typeBadge = \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700 shrink-0">
              Altro Workspace
            </span>
          \`;
        }

        const checkIcon = isSelected
          ? \`<i class="fa-solid fa-circle-check text-indigo-400 text-sm ml-2 shrink-0"></i>\`
          : '';

        let dirHint = '';
        if (!s.isCurrentWorkspace && s.directory) {
          const dirBase = s.directory.split('/').pop() || s.directory;
          dirHint = \`<span class="text-[9px] text-gray-500 font-mono truncate max-w-[130px]" title="\${escapeHtml(s.directory)}">📁 \${escapeHtml(dirBase)}</span>\`;
        }

        return \`
          <div
            role="option"
            aria-selected="\${isSelected}"
            onclick="selectSession('\${safeId}')"
            class="p-2.5 rounded-xl border \${borderClass} transition-all cursor-pointer group flex items-start justify-between gap-2"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                \${typeBadge}
                <span class="text-[10px] text-gray-400 font-mono shrink-0">\${timeStr}</span>
                \${dirHint}
              </div>
              <p class="text-xs font-semibold text-gray-100 group-hover:text-white truncate">
                \${safeTitle}
              </p>
              <p class="text-[10px] font-mono text-gray-500 mt-0.5 truncate">
                \${shortId}
              </p>
            </div>
            \${checkIcon}
          </div>
        \`;
      }

      let html = '';

      if (groupCron.length > 0) {
        html += \`
          <div class="pb-2 pt-1">
            <div class="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-bolt"></i> Sessioni Cron Job (\${groupCron.length})</span>
            </div>
            <div class="space-y-1">
              \${groupCron.map(renderSessionRow).join('')}
            </div>
          </div>
        \`;
      }

      if (groupRoot.length > 0) {
        html += \`
          <div class="pb-2 pt-1">
            <div class="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-400">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-comments"></i> Sessioni Principali / Root (\${groupRoot.length})</span>
            </div>
            <div class="space-y-1">
              \${groupRoot.map(renderSessionRow).join('')}
            </div>
          </div>
        \`;
      }

      if (groupSub.length > 0) {
        html += \`
          <div class="pb-2 pt-1">
            <div class="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-robot"></i> Sub-agenti Generati (\${groupSub.length})</span>
            </div>
            <div class="space-y-1">
              \${groupSub.map(renderSessionRow).join('')}
            </div>
          </div>
        \`;
      }

      if (groupOther.length > 0) {
        html += \`
          <div class="pb-2 pt-1">
            <div class="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-folder-tree"></i> Altri Workspace (\${groupOther.length})</span>
            </div>
            <div class="space-y-1">
              \${groupOther.map(renderSessionRow).join('')}
            </div>
          </div>
        \`;
      }

      container.innerHTML = html;
    }

    function selectSession(sessionId) {
      if (!sessionId) return;
      activeSessionId = sessionId;

      const sel = document.getElementById('chat-session-select');
      if (sel) sel.value = sessionId;

      updateActiveSessionTrigger();
      updateActiveSessionBanner();
      closeSessionPicker();
      loadSessionChat(sessionId);
    }

    function updateActiveSessionTrigger() {
      const s = currentSessions.find(x => x.id === activeSessionId);
      const badgeEl = document.getElementById('session-trigger-badge');
      const titleEl = document.getElementById('session-trigger-title');
      const timeEl = document.getElementById('session-trigger-time');

      if (!s) {
        if (titleEl) titleEl.textContent = activeSessionId || 'Seleziona sessione...';
        return;
      }

      if (titleEl) titleEl.textContent = s.title || s.id;
      if (timeEl) timeEl.textContent = timeAgo(s.time_updated);

      if (badgeEl) {
        if (s.hasCron) {
          const jobTitles = (s.cronJobs || []).map(j => escapeHtml(j.title)).join(', ');
          badgeEl.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <i class="fa-solid fa-bolt text-[9px] text-purple-400"></i> ⚡ Cron
            </span>
          \`;
        } else if (s.isRoot) {
          badgeEl.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              <i class="fa-solid fa-comments text-[9px] text-sky-400"></i> 💬 Principale
            </span>
          \`;
        } else if (s.isSubagent) {
          badgeEl.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300/90 border border-amber-500/20">
              <i class="fa-solid fa-robot text-[9px] text-amber-400"></i> 🤖 Subagente
            </span>
          \`;
        } else {
          badgeEl.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
              🌐 Altro
            </span>
          \`;
        }
      }
    }

    function updateActiveSessionBanner() {
      const s = currentSessions.find(x => x.id === activeSessionId);
      const bannerBadge = document.getElementById('banner-session-type-badge');
      const bannerTitle = document.getElementById('banner-session-title');
      const bannerId = document.getElementById('banner-session-id');
      const bannerUpdated = document.getElementById('banner-updated-text');
      const bannerJobLink = document.getElementById('banner-job-link-container');

      if (!s) {
        if (bannerTitle) bannerTitle.textContent = activeSessionId || '—';
        if (bannerId) bannerId.textContent = activeSessionId || '';
        return;
      }

      if (bannerTitle) bannerTitle.textContent = s.title || s.id;
      if (bannerId) bannerId.textContent = s.id;
      if (bannerUpdated) bannerUpdated.textContent = 'Ultimo aggiornamento: ' + timeAgo(s.time_updated);

      if (bannerBadge) {
        if (s.hasCron) {
          bannerBadge.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <i class="fa-solid fa-bolt text-purple-400"></i> CRON JOB
            </span>
          \`;
        } else if (s.isRoot) {
          bannerBadge.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              <i class="fa-solid fa-comments text-sky-400"></i> CHAT PRINCIPALE (ROOT)
            </span>
          \`;
        } else if (s.isSubagent) {
          bannerBadge.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300/90 border border-amber-500/30">
              <i class="fa-solid fa-robot text-amber-400"></i> SUB-AGENTE
            </span>
          \`;
        } else {
          bannerBadge.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
              ALTRO WORKSPACE
            </span>
          \`;
        }
      }

      if (bannerJobLink) {
        if (s.hasCron && s.cronJobs && s.cronJobs.length > 0) {
          const firstJob = s.cronJobs[0];
          bannerJobLink.innerHTML = \`
            <button onclick="switchTab('jobs')" class="bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer" data-tooltip="tt.tabJobs">
              <i class="fa-solid fa-gear text-[9px]"></i> Job: \${escapeHtml(firstJob.title)}
            </button>
            <button onclick="openNewJobModal('\${s.id}')" class="bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer" data-tooltip="tt.setCronBtn">
              <i class="fa-solid fa-plus text-[9px]"></i> <span data-i18n="chat.setCron">Imposta Cron</span>
            </button>
          \`;
        } else {
          bannerJobLink.innerHTML = \`
            <button onclick="openNewJobModal('\${s.id}')" class="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer" data-tooltip="tt.setCronBtn">
              <i class="fa-solid fa-bolt text-amber-300 text-[10px]"></i> <span data-i18n="chat.setCron">Imposta Cron</span>
            </button>
          \`;
        }
      }
    }

    function copyActiveSessionId() {
      if (!activeSessionId) return;
      navigator.clipboard.writeText(activeSessionId).then(() => {
        const icon = document.getElementById('copy-session-icon');
        if (icon) {
          icon.className = 'fa-solid fa-check text-emerald-400';
          setTimeout(() => { icon.className = 'fa-regular fa-copy'; }, 2000);
        }
        showToast((typeof t === 'function' ? t('toast.copySessionSuccess') : 'Session ID copiato: ') + activeSessionId, 'success');
      }).catch(() => {
        showToast(typeof t === 'function' ? t('toast.copySessionError') : 'Impossibile copiare negli appunti', 'error');
      });
    }

    function populateModalSessionSelect() {
      const modalSelect = document.getElementById('form-session-id');
      if (!modalSelect) return;

      const cronSessions = currentSessions.filter(s => s.hasCron && s.isCurrentWorkspace);
      const rootSessions = currentSessions.filter(s => !s.hasCron && s.isRoot && s.isCurrentWorkspace);
      const subSessions = currentSessions.filter(s => !s.hasCron && s.isSubagent && s.isCurrentWorkspace);
      const otherSessions = currentSessions.filter(s => !s.isCurrentWorkspace);

      let html = '';
      if (cronSessions.length > 0) {
        html += '<optgroup label="⚡ Sessioni con Cron Job Esistenti">';
        html += cronSessions.map(s => \`<option value="\${s.id}">⚡ \${escapeHtml(s.title || s.id)} (\${s.cronJobs.map(j => escapeHtml(j.title)).join(', ')})</option>\`).join('');
        html += '</optgroup>';
      }

      if (rootSessions.length > 0) {
        html += '<optgroup label="💬 Sessioni Principali / Root (Consigliate!)">';
        html += rootSessions.map(s => \`<option value="\${s.id}">💬 \${escapeHtml(s.title || s.id)} [Root]</option>\`).join('');
        html += '</optgroup>';
      }

      if (subSessions.length > 0) {
        html += '<optgroup label="🤖 Sub-agenti (Questo Repo)">';
        html += subSessions.map(s => \`<option value="\${s.id}">🤖 \${escapeHtml(s.title || s.id)}</option>\`).join('');
        html += '</optgroup>';
      }

      if (otherSessions.length > 0) {
        html += '<optgroup label="🌐 Altri Workspace / Progetti">';
        html += otherSessions.map(s => {
          const dirBase = s.directory ? s.directory.split('/').pop() : '';
          return \`<option value="\${s.id}">🌐 \${escapeHtml(s.title || s.id)} [\${escapeHtml(dirBase)}]</option>\`;
        }).join('');
        html += '</optgroup>';
      }

      modalSelect.innerHTML = html || '<option value="">Nessuna sessione trovata</option>';
    }

    // Sessions Loading
    async function loadSessions() {
      try {
        const res = await fetch('/api/sessions');
        currentSessions = await res.json();
        const select = document.getElementById('chat-session-select');

        // Backward compatibility for hidden select
        const opts = currentSessions.map(s => \`
          <option value="\${s.id}">\${escapeHtml(s.title || s.id)} (\${s.id.slice(0, 10)}...)</option>
        \`).join('');
        if (select) select.innerHTML = opts || '<option value="">Nessuna sessione trovata</option>';

        // Populate modal select with grouped optgroups
        populateModalSessionSelect();

        // If no active session, select the top prioritized session (which is Root/Cron!)
        if (!activeSessionId && currentSessions.length > 0) {
          activeSessionId = currentSessions[0].id;
        }

        if (activeSessionId) {
          if (select) select.value = activeSessionId;
          updateActiveSessionTrigger();
          updateActiveSessionBanner();
        }

        renderSessionList();
      } catch (err) {
        console.error('Error loading sessions:', err);
      }
    }

    function jumpToChat(sessionId) {
      selectSession(sessionId);
      switchTab('chat');
    }

    // Close session picker when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
      const wrapper = document.getElementById('session-picker-wrapper');
      if (wrapper && !wrapper.contains(e.target) && isSessionPickerOpen) {
        closeSessionPicker();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isSessionPickerOpen) {
        closeSessionPicker();
      }
    });

    // ==============================================
    // LIVE CHAT & FEED STREAMING
    // ==============================================
    function escapeHtml(str) {
      return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function autoResizeTextarea(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 140) + 'px';
    }

    function handleChatInputKey(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendManualPrompt();
      }
    }

    async function loadSessionChat(sessionId, scrollToBottom = true) {
      if (!sessionId) return;
      if (activeSessionId !== sessionId) {
        activeSessionId = sessionId;
        lastRenderedMessageIds.clear();
        const c = document.getElementById('chat-messages');
        if (c) c.innerHTML = '';
      }
      try {
        const res = await fetch('/api/sessions/' + encodeURIComponent(sessionId) + '/messages');
        const messages = await res.json();
        renderChatMessages(messages, scrollToBottom);
      } catch (err) {
        console.error('Chat error', err);
      }
    }

    function createMessageElement(msg) {
      const isUser = msg.type === 'user';
      const timeStr = msg.time?.created ? new Date(msg.time.created).toLocaleTimeString() : '';
      const wrapper = document.createElement('div');
      wrapper.id = 'msg-' + msg.id;
      wrapper.setAttribute('data-msg-id', msg.id);
      const sig = JSON.stringify({ content: msg.content, text: msg.text, data: msg.data });
      wrapper.setAttribute('data-sig', sig);

      if (isUser) {
        const isCronPrompt = msg.text && msg.text.includes('[CRON SYSTEM');
        let displayPrompt = msg.text || '';
        let collapsedSys = '';

        if (isCronPrompt) {
          const parts = msg.text.split('[FOLLOWUP di questo tick]');
          if (parts.length > 1) {
            collapsedSys = parts[0];
            displayPrompt = parts[1];
          }
        }

        wrapper.className = 'flex justify-end';
        wrapper.innerHTML = \`
          <div class="max-w-[85%] bg-indigo-950/60 border border-indigo-700/40 rounded-2xl p-4 shadow-md text-sm">
            <div class="flex items-center justify-between space-x-3 pb-1.5 mb-2 border-b border-indigo-700/20 text-[10px] text-indigo-300">
              <span class="font-bold flex items-center gap-1.5">
                <i class="fa-solid \${isCronPrompt ? 'fa-clock' : 'fa-user'}"></i> \${isCronPrompt ? 'Tick Programmato (Cron Prompt)' : 'Utente'}
              </span>
              <span class="font-mono">\${escapeHtml(timeStr)}</span>
            </div>
            \${collapsedSys ? \`
              <details class="text-[11px] text-gray-400 mb-2 cursor-pointer bg-gray-900/60 p-2 rounded-lg border border-darkborder">
                <summary class="font-semibold text-indigo-300">Istruzioni di Sistema & Memoria (Espandi)</summary>
                <div class="mt-2 font-mono whitespace-pre-wrap leading-relaxed">\${escapeHtml(collapsedSys)}</div>
              </details>
            \` : ''}
            <div class="prose-dark text-gray-100 whitespace-pre-wrap leading-relaxed">\${escapeHtml(displayPrompt.trim())}</div>
          </div>
        \`;
      } else {
        let reasoningText = '';
        let outputText = '';
        const modelId = msg.model?.id || 'Assistant';

        if (Array.isArray(msg.content)) {
          for (const item of msg.content) {
            if (item.type === 'reasoning') reasoningText += (item.text || '') + '\\n';
            else if (item.type === 'text') outputText += (item.text || '') + '\\n\\n';
          }
        } else if (typeof msg.data === 'string') {
          outputText = msg.data;
        }

        const rawMarkdown = marked.parse(outputText.trim() || '*(Nessun output di testo)*');
        const cleanMarkdown = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(rawMarkdown) : rawMarkdown;

        wrapper.className = 'flex justify-start';
        wrapper.innerHTML = \`
          <div class="max-w-[85%] bg-darkcard border border-darkborder rounded-2xl p-4 shadow-md text-sm">
            <div class="flex items-center justify-between space-x-3 pb-1.5 mb-2 border-b border-darkborder text-[10px] text-gray-400">
              <span class="font-bold text-emerald-400 flex items-center gap-1.5">
                <i class="fa-solid fa-robot"></i> \${escapeHtml(modelId)}
              </span>
              <span class="font-mono">\${escapeHtml(timeStr)}</span>
            </div>

            \${reasoningText ? \`
              <details class="text-[11px] text-gray-400 mb-3 bg-gray-950 p-2.5 rounded-xl border border-darkborder">
                <summary class="font-semibold text-amber-400 flex items-center gap-1 cursor-pointer">
                  <i class="fa-solid fa-brain text-xs"></i> Pensiero & Ragionamento (Expand)
                </summary>
                <div class="mt-2 font-mono whitespace-pre-wrap text-gray-300 leading-relaxed max-h-48 overflow-y-auto">\${escapeHtml(reasoningText)}</div>
              </details>
            \` : ''}

            <div class="prose-dark leading-relaxed">\${cleanMarkdown}</div>
          </div>
        \`;
      }
      return wrapper;
    }

    function renderChatMessages(messages, scrollToBottom = true) {
      const container = document.getElementById('chat-messages');
      if (!messages || !messages.length) {
        lastRenderedMessageIds.clear();
        container.innerHTML = '<div class="text-center py-24 text-gray-500">' +
          '<i class="fa-regular fa-comment-dots text-3xl mb-2 text-gray-600"></i>' +
          '<p class="text-sm">Nessun messaggio in questa sessione.</p>' +
          '<p class="text-xs text-gray-600 mt-1">I messaggi e i tick pianificati appariranno qui automaticamente.</p>' +
        '</div>';
        return;
      }

      const isNearBottom = (container.scrollHeight - container.scrollTop - container.clientHeight) < 80;

      // Clear empty state or spinner if present
      if (container.querySelector('.text-center.py-24') || container.querySelector('.fa-spinner')) {
        container.innerHTML = '';
        lastRenderedMessageIds.clear();
      }

      let hasAppended = false;
      for (const msg of messages) {
        const sig = JSON.stringify({ content: msg.content, text: msg.text, data: msg.data });
        const existingEl = document.getElementById('msg-' + msg.id);
        if (!existingEl) {
          const el = createMessageElement(msg);
          container.appendChild(el);
          lastRenderedMessageIds.add(msg.id);
          hasAppended = true;
        } else if (existingEl.getAttribute('data-sig') !== sig) {
          const updatedEl = createMessageElement(msg);
          container.replaceChild(updatedEl, existingEl);
          hasAppended = true;
        }
      }

      if (scrollToBottom || (hasAppended && isNearBottom)) {
        container.scrollTop = container.scrollHeight;
      }
    }

    // Auto-refresh chat logic
    function toggleAutoRefresh(enable) {
      if (autoRefreshTimer) clearInterval(autoRefreshTimer);
      const badge = document.getElementById('chat-live-badge');
      if (enable) {
        if (badge) badge.classList.remove('hidden');
        autoRefreshTimer = setInterval(() => {
          if (currentTab === 'chat' && activeSessionId && !document.hidden) {
            loadSessionChat(activeSessionId, false);
          }
        }, 3000);
      } else {
        if (badge) badge.classList.add('hidden');
      }
    }

    // Pause auto-refresh when tab is hidden
    document.addEventListener('visibilitychange', () => {
      const badge = document.getElementById('chat-live-badge');
      if (document.hidden) {
        if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
        if (badge) badge.classList.add('hidden');
      } else {
        const cb = document.getElementById('chat-autorefresh');
        if (cb && cb.checked) toggleAutoRefresh(true);
      }
    });

    // Modal Escape and Focus Trap listener (supports both job-modal and confirm-modal)
    document.addEventListener('keydown', (e) => {
      const confirmModal = document.getElementById('confirm-modal');
      const isConfirmOpen = confirmModal && !confirmModal.classList.contains('hidden');
      if (isConfirmOpen) {
        if (e.key === 'Escape') { closeConfirmModal(); return; }
        if (e.key === 'Tab') {
          const focusables = confirmModal.querySelectorAll('button:not([disabled])');
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        return;
      }

      const modal = document.getElementById('job-modal');
      const isModalOpen = modal && !modal.classList.contains('hidden');
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
        return;
      }
      if (e.key === 'Tab' && isModalOpen) {
        const focusables = modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    async function sendManualPrompt() {
      const input = document.getElementById('chat-prompt-input');
      const text = input.value.trim();
      if (!text || !activeSessionId) return;

      input.value = '';
      autoResizeTextarea(input);
      const btn = document.getElementById('send-prompt-btn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      try {
        const res = await fetch('/api/sessions/' + encodeURIComponent(activeSessionId) + '/prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text })
        });
        const data = await res.json();
        if (!data.ok) {
          showToast((typeof t === 'function' ? t('toast.sendError') : 'Errore invio: ') + (data.error || 'fallito'), 'error');
          input.value = text;
          autoResizeTextarea(input);
        } else {
          showToast(typeof t === 'function' ? t('toast.promptSent') : 'Prompt inviato alla sessione', 'info');
        }
        await loadSessionChat(activeSessionId, true);
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.netError') : 'Errore di rete: ') + err.message, 'error');
        input.value = text;
        autoResizeTextarea(input);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ' + (typeof t === 'function' ? t('chat.send') : 'Invia');
      }
    }

    // ==============================================
    // MEMORY MANAGEMENT
    // ==============================================
    function loadMemoryList() {
      const select = document.getElementById('memory-job-select');
      select.innerHTML = '<option value="">Seleziona un job...</option>' + currentJobs.map(j => \`
        <option value="\${j.id}">\${j.title} (\${j.id})</option>
      \`).join('');
      if (currentJobs.length > 0) {
        select.value = currentJobs[0].id;
        loadJobMemory(currentJobs[0].id);
      }
    }

    async function loadJobMemory(jobId) {
      if (!jobId) return;
      try {
        const res = await fetch('/api/memory/' + encodeURIComponent(jobId));
        const data = await res.json();
        const editor = document.getElementById('memory-editor');
        const preview = document.getElementById('memory-preview');
        const meta = document.getElementById('memory-meta');

        editor.value = data.md || '';
        meta.textContent = 'Hashes visti: ' + (data.state?.seenHashes?.length || 0) + ' | Runs: ' + (data.state?.counts?.news || 0);
        const rawHtml = marked.parse(data.md || '*(Memoria vuota)*');
        preview.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(rawHtml) : rawHtml;

        let debounceTimer = null;
        editor.oninput = () => {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            const raw = marked.parse(editor.value);
            preview.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(raw) : raw;
          }, 150);
        };
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.loadMemoryError') : 'Errore caricamento memoria: ') + err.message, 'error');
      }
    }

    async function saveCurrentMemory() {
      const jobId = document.getElementById('memory-job-select').value;
      const md = document.getElementById('memory-editor').value;
      if (!jobId) return;

      try {
        const res = await fetch('/api/memory/' + encodeURIComponent(jobId), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ md })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Operazione fallita');
        showToast(typeof t === 'function' ? t('toast.memorySaved') : 'Memoria salvata con successo!', 'success');
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.saveMemoryError') : 'Errore salvataggio: ') + err.message, 'error');
      }
    }

    // ==============================================
    // LOGS VIEWER
    // ==============================================
    async function loadLogs() {
      try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        const stdout = document.getElementById('log-stdout');
        const stderr = document.getElementById('log-stderr');
        stdout.textContent = data.stdout || '(Nessun output stdout)';
        stderr.textContent = data.stderr || '(Nessun errore registrato)';
        stdout.scrollTop = stdout.scrollHeight;
        stderr.scrollTop = stderr.scrollHeight;
      } catch (err) {
        console.error(err);
      }
    }

    // ==============================================
    // VISUAL SCHEDULE & CRON BUILDER
    // ==============================================
    let scheduleDebounceTimer = null;

    function applySchedulePreset(preset) {
      const input = document.getElementById('form-schedule');
      if (input) {
        input.value = preset;
        updateSchedulePreview(preset);
      }
    }

    function debounceSchedulePreview(val) {
      if (scheduleDebounceTimer) clearTimeout(scheduleDebounceTimer);
      scheduleDebounceTimer = setTimeout(() => {
        updateSchedulePreview(val);
      }, 250);
    }

    async function updateSchedulePreview(val) {
      const descEl = document.getElementById('schedule-desc-text');
      const runsEl = document.getElementById('schedule-next-runs');
      if (!descEl || !runsEl) return;

      const trimmed = (val || '').trim();
      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
      if (!trimmed) {
        descEl.textContent = isEn
          ? 'Enter an interval or click a preset above.'
          : 'Inserisci un intervallo o clicca su un preset sopra.';
        runsEl.innerHTML = '';
        return;
      }

      try {
        const langParam = typeof currentLang !== 'undefined' ? currentLang : 'it';
        const res = await fetch('/api/schedule/preview?q=' + encodeURIComponent(trimmed) + '&lang=' + encodeURIComponent(langParam));
        const data = await res.json();
        if (data && data.valid) {
          descEl.innerHTML = '<span class="text-emerald-400 font-semibold"><i class="fa-solid fa-circle-check mr-1 text-[10px]"></i>' + escapeHtml(data.description) + '</span>';
          if (Array.isArray(data.nextRuns) && data.nextRuns.length > 0) {
            const nextTicksLabel = isEn ? 'Next ticks:' : 'Prossimi tick:';
            runsEl.innerHTML = '<span class="text-gray-400 font-sans mr-1">' + nextTicksLabel + '</span>' + data.nextRuns.map((r, i) => {
              const dt = new Date(r);
              const formatted = dt.toLocaleTimeString() + ' (' + dt.toLocaleDateString() + ')';
              return '<span class="px-1.5 py-0.5 rounded bg-gray-950 border border-darkborder text-[10px] text-indigo-300">#' + (i + 1) + ' ' + formatted + '</span>';
            }).join('');
          } else {
            runsEl.innerHTML = '';
          }
        } else {
          descEl.innerHTML = '<span class="text-rose-400"><i class="fa-solid fa-circle-xmark mr-1 text-[10px]"></i>' + escapeHtml(data.description || (isEn ? 'Invalid expression' : 'Espressione non valida')) + '</span>';
          runsEl.innerHTML = '';
        }
      } catch (err) {
        descEl.textContent = (isEn ? 'Preview error: ' : 'Errore anteprima: ') + err.message;
        runsEl.innerHTML = '';
      }
    }

    // ==============================================
    // GIT DIFF & FILE CHANGES VIEWER
    // ==============================================
    let currentGitFile = '';
    let gitDiffData = null;

    async function loadGitSummary() {
      try {
        const res = await fetch('/api/git/diff');
        const data = await res.json();
        const badge = document.getElementById('diff-count-badge');
        if (badge) {
          const count = (data.files || []).length;
          badge.textContent = count;
          if (count > 0) {
            badge.classList.remove('hidden');
          } else {
            badge.classList.add('hidden');
          }
        }
      } catch (err) {
        console.error('Git summary error:', err);
      }
    }

    async function loadGitDiff(filePath = '') {
      currentGitFile = filePath;
      const refreshIcon = document.getElementById('git-refresh-icon');
      if (refreshIcon) refreshIcon.classList.add('fa-spin');

      try {
        const url = filePath ? ('/api/git/diff?file=' + encodeURIComponent(filePath)) : '/api/git/diff';
        const res = await fetch(url);
        gitDiffData = await res.json();

        // Update branch
        const branchEl = document.getElementById('git-branch-name');
        if (branchEl) branchEl.textContent = gitDiffData.branch || 'unknown';

        // Update stat summary
        const summaryEl = document.getElementById('git-stat-summary');
        if (summaryEl) {
          if (gitDiffData.clean) {
            summaryEl.innerHTML = '<span class="text-emerald-400"><i class="fa-solid fa-check-circle mr-1"></i>Working tree pulito, nessuna modifica non committata.</span>';
          } else {
            summaryEl.innerHTML = '<span class="text-amber-300 font-semibold">' + (gitDiffData.files?.length || 0) + ' file modificati</span>' +
              (gitDiffData.stats ? (' • <span class="text-gray-400">' + escapeHtml(gitDiffData.stats) + '</span>') : '');
          }
        }

        // Render file list
        renderGitFileList(gitDiffData.files || []);

        // Render diff content
        renderGitDiffPane(gitDiffData);

        // Also update the navbar badge
        const badge = document.getElementById('diff-count-badge');
        if (badge) {
          const count = (gitDiffData.files || []).length;
          badge.textContent = count;
          if (count > 0) badge.classList.remove('hidden');
          else badge.classList.add('hidden');
        }
      } catch (err) {
        console.error('Git diff error:', err);
        const diffBox = document.getElementById('git-diff-content');
        if (diffBox) {
          diffBox.innerHTML = '<div class="text-rose-400 py-10 text-center"><i class="fa-solid fa-triangle-exclamation text-xl mb-2"></i><p>Errore caricamento Git Diff: ' + escapeHtml(err.message) + '</p></div>';
        }
      } finally {
        if (refreshIcon) setTimeout(() => refreshIcon.classList.remove('fa-spin'), 400);
      }
    }

    function renderGitFileList(files) {
      const countEl = document.getElementById('git-files-count');
      if (countEl) countEl.textContent = files.length;

      const listEl = document.getElementById('git-file-list');
      if (!listEl) return;

      if (!files.length) {
        listEl.innerHTML = '<div class="text-center py-12 text-gray-500 text-xs">' +
          '<i class="fa-solid fa-check-double text-emerald-400 text-2xl mb-2"></i>' +
          '<p class="text-gray-400 font-medium">Nessuna modifica</p>' +
          '<p class="text-[11px] text-gray-600 mt-1">Il repository è allineato all\\'ultimo commit.</p>' +
        '</div>';
        return;
      }

      listEl.innerHTML = files.map(f => {
        const isSelected = currentGitFile === f.path;
        let badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        let label = 'MOD';
        if (f.status === '??') {
          badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
          label = 'NEW';
        } else if (f.status === 'D') {
          badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
          label = 'DEL';
        } else if (f.status === 'A') {
          badgeClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
          label = 'ADD';
        }

        return '<button type="button" data-path="' + escapeHtml(f.path) + '" onclick="selectGitFile(this.dataset.path)" class="w-full text-left px-2.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between group ' + (isSelected ? 'bg-indigo-600 text-white font-bold shadow-md' : 'hover:bg-gray-800 text-gray-300') + '">' +
          '<span class="truncate pr-2 flex-1">' + escapeHtml(f.path) + '</span>' +
          '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold border ' + (isSelected ? 'bg-indigo-700 text-white border-indigo-400/30' : badgeClass) + '">' + label + '</span>' +
        '</button>';
      }).join('');
    }

    function selectGitFile(filePath) {
      currentGitFile = filePath;
      loadGitDiff(filePath);
    }

    function openGitDiffForFile(filePath = '') {
      switchTab('diff');
      selectGitFile(filePath);
    }

    function renderGitDiffPane(data) {
      const filenameEl = document.getElementById('git-diff-filename');
      const linesCountEl = document.getElementById('git-diff-lines-count');
      const diffBox = document.getElementById('git-diff-content');
      if (!diffBox) return;

      if (data.file) {
        if (filenameEl) filenameEl.textContent = data.file;
      } else {
        if (filenameEl) filenameEl.textContent = 'Tutte le modifiche (Unified Diff)';
      }

      if (data.clean || !data.diff || !data.diff.trim()) {
        if (linesCountEl) linesCountEl.textContent = '0 righe';
        diffBox.innerHTML = '<div class="text-center py-24 text-gray-500">' +
          '<i class="fa-solid fa-code-commit text-3xl mb-3 text-gray-600"></i>' +
          '<p class="text-sm font-medium text-gray-300">Nessuna modifica da visualizzare</p>' +
          '<p class="text-xs text-gray-500 mt-1">Tutti i file sono sincronizzati o la selezione non ha diff.</p>' +
        '</div>';
        return;
      }

      const lines = data.diff.split('\\n');
      if (linesCountEl) linesCountEl.textContent = lines.length + ' righe';

      diffBox.innerHTML = renderDiffLines(lines);
    }

    function renderDiffLines(lines) {
      return lines.map((line, idx) => {
        let lineClass = 'text-gray-300 hover:bg-gray-900/60';
        let prefixIcon = '';
        if (line.startsWith('+++') || line.startsWith('---')) {
          lineClass = 'text-indigo-400 font-bold bg-indigo-950/20';
        } else if (line.startsWith('diff --git') || line.startsWith('index ')) {
          lineClass = 'text-indigo-300 font-semibold bg-gray-900 border-t border-b border-darkborder/50 py-0.5';
        } else if (line.startsWith('@@')) {
          lineClass = 'text-cyan-400 bg-cyan-950/20 py-0.5';
        } else if (line.startsWith('+')) {
          lineClass = 'text-emerald-300 bg-emerald-950/30';
          prefixIcon = '<span class="text-emerald-500 select-none mr-1 font-bold">+</span>';
        } else if (line.startsWith('-')) {
          lineClass = 'text-rose-300 bg-rose-950/30';
          prefixIcon = '<span class="text-rose-500 select-none mr-1 font-bold">-</span>';
        }

        return '<div class="px-2 py-0.5 rounded font-mono text-[11px] whitespace-pre flex items-start ' + lineClass + '">' +
          '<span class="w-8 select-none text-[10px] text-gray-600 text-right pr-2 shrink-0 font-sans">' + (idx + 1) + '</span>' +
          '<span class="flex-1 overflow-x-auto">' + escapeHtml(line) + '</span>' +
        '</div>';
      }).join('');
    }

    // ==============================================
    // MODAL ADD / EDIT JOB
    // ==============================================
    function openNewJobModal(presetSessionId) {
      const titleEl = document.getElementById('modal-title');
      if (titleEl) {
        titleEl.setAttribute('data-i18n', 'modal.newTitle');
        titleEl.textContent = typeof t === 'function' ? t('modal.newTitle') : 'Nuovo Cron Job';
      }
      document.getElementById('form-job-id').value = '';
      document.getElementById('form-title').value = '';
      document.getElementById('form-schedule').value = '5m';
      applySchedulePreset('5m');
      document.getElementById('form-max-runs').value = '0';
      const targetSessionId = presetSessionId || (currentTab === 'chat' ? activeSessionId : '');
      if (targetSessionId) {
        const sessionSelect = document.getElementById('form-session-id');
        if (sessionSelect) sessionSelect.value = targetSessionId;
      }
      document.getElementById('form-model').value = 'nvidia/z-ai/glm-5.3';
      const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
      document.getElementById('form-system-prompt').value = isEn
        ? 'You are an autonomous scheduled assistant. Perform the task with precision and log the findings.'
        : 'Sei un assistente autonomo programmato. Esegui il compito con precisione e registra i risultati.';
      document.getElementById('form-followup-prompt').value = isEn
        ? 'Execute the scheduled tick and provide a concise summary.'
        : 'Esegui il tick programmato e fornisci un riassunto sintetico.';
      const modal = document.getElementById('job-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
      setTimeout(() => document.getElementById('form-title').focus(), 50);
    }

    function editJob(id) {
      const job = currentJobs.find(j => j.id === id);
      if (!job) return;
      const titleEl = document.getElementById('modal-title');
      if (titleEl) {
        titleEl.setAttribute('data-i18n', 'modal.editTitle');
        titleEl.textContent = typeof t === 'function' ? t('modal.editTitle') : 'Modifica Cron Job';
      }
      document.getElementById('form-job-id').value = job.id;
      document.getElementById('form-title').value = job.title;
      const schedVal = job.schedule.cron || formatInterval(job.schedule.everyMs);
      document.getElementById('form-schedule').value = schedVal;
      updateSchedulePreview(schedVal);
      document.getElementById('form-max-runs').value = job.maxRuns || 0;
      document.getElementById('form-session-id').value = job.sessionID;
      document.getElementById('form-model').value = job.model || '';
      document.getElementById('form-system-prompt').value = job.systemPrompt || '';
      document.getElementById('form-followup-prompt').value = job.followupPrompt || '';
      const modal = document.getElementById('job-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
      setTimeout(() => document.getElementById('form-title').focus(), 50);
    }

    function closeModal() {
      const modal = document.getElementById('job-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
      if (typeof isSpotlightActive !== 'undefined' && isSpotlightActive) {
        if (typeof stopGuidedDemo === 'function') {
          stopGuidedDemo();
        }
      }
    }

    async function handleJobSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('form-job-id').value;
      const sessionID = document.getElementById('form-session-id').value;
      if (!sessionID) {
        showToast(typeof t === 'function' ? t('toast.selectSession') : 'Seleziona una sessione OpenCode prima di salvare il job.', 'error');
        return;
      }
      const schedStr = document.getElementById('form-schedule').value.trim();
      if (!schedStr) {
        showToast(typeof t === 'function' ? t('toast.invalidSchedule') : 'Inserisci un intervallo valido (es. 5m o */5 * * * *).', 'error');
        return;
      }

      const payload = {
        title: document.getElementById('form-title').value.trim(),
        scheduleStr: schedStr,
        maxRuns: parseInt(document.getElementById('form-max-runs').value) || 0,
        sessionID: sessionID,
        model: document.getElementById('form-model').value.trim() || undefined,
        systemPrompt: document.getElementById('form-system-prompt').value.trim(),
        followupPrompt: document.getElementById('form-followup-prompt').value.trim(),
      };

      try {
        const url = id ? ('/api/jobs/' + encodeURIComponent(id)) : '/api/jobs';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(id ? (typeof t === 'function' ? t('toast.jobUpdated') : 'Job aggiornato!') : (typeof t === 'function' ? t('toast.jobCreated') : 'Nuovo job creato!'), 'success');
          closeModal();
          await loadJobs();
        } else {
          showToast((typeof t === 'function' ? t('toast.genericError') : 'Errore: ') + (data.error || 'Operazione fallita'), 'error');
        }
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.netError') : 'Errore rete: ') + err.message, 'error');
      }
    }

    async function runAllDue() {
      showToast(typeof t === 'function' ? t('toast.runningDue') : 'Controllo ed esecuzione dei job scaduti in corso...', 'info');
      try {
        const res = await fetch('/api/check', { method: 'POST' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || (data && data.ok === false)) throw new Error(data.error || 'Errore durante il controllo');
        showToast(typeof t === 'function' ? t('toast.runDueFinished') : 'Controllo terminato!', 'success');
        await loadJobs();
        if (currentTab === 'chat' && activeSessionId) await loadSessionChat(activeSessionId);
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.genericError') : 'Errore: ') + err.message, 'error');
      }
    }

    // Startup
    window.addEventListener('DOMContentLoaded', async () => {
      const params = new URLSearchParams(window.location.search);
      const qSession = params.get('session');
      const qTab = params.get('tab');
      if (qSession) {
        activeSessionId = qSession;
      }
      await refreshAll();
      if (qTab && ['jobs', 'chat', 'memory', 'diff', 'logs'].includes(qTab)) {
        switchTab(qTab);
      } else if (qSession) {
        switchTab('chat');
      }
      if (qSession) {
        await loadSessionChat(qSession);
      }
      toggleAutoRefresh(true);
    });
  </script>
</body>
</html>`;
}

