import {
  escapeHtml,
  getUiEnhancementsHeadStyle,
  getUiEnhancementsBodyHtml,
  getUiEnhancementsScript,
  getHeaderControlsHtml,
  getOnboardingBannerHtml,
} from "./i18n.ts";

export function getHtml(title: string = "OpenCode Cron - Web GUI"): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23101828'/%3E%3Ccircle cx='16' cy='16' r='6' fill='white'/%3E%3C/svg%3E" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            mono: ['SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
          },
          colors: {
            brand: { 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' },
            ink: '#070B12',
            signal: '#34d399',
            darkbg: '#E8E9ED',
            darkcard: '#FFFFFF',
            darkborder: '#E2E5EA',
            darkhover: '#F1F3F6'
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
    .prose-dark { color: #1e293b; }
    .prose-dark code { background: #F1F5F9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.875em; }
    .prose-dark pre { background: #0F1626; color: #E2E8F0; padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0; }
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

    /* ===== Mandate chrome: light ops console ===== */
    body { background-color: #E8E9ED; background-image: none !important; }
    .tabular, .oc-num { font-variant-numeric: tabular-nums; font-feature-settings: 'tnum'; }
    :focus-visible { outline: 2px solid #4f46e5; outline-offset: 2px; border-radius: 6px; }
    .safe-area-pad { padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
    @media (pointer: coarse) {
      button, select, input[type="checkbox"], a { min-height: 40px; }
      .tab-btn { min-height: 44px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .pulse-dot, .animate-fadeIn { animation: none !important; }
      * { scroll-behavior: auto !important; }
    }
    .oc-brand-mark {
      width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
      background: #101828; color: #fff; display: flex; align-items: center; justify-content: center;
    }
    .oc-pillnav {
      background: #101828; border-radius: 9999px;
      box-shadow: 0 10px 24px -12px rgba(16, 24, 40, 0.5);
    }
    .oc-pillnav .tab-btn { color: #B6BECB; }
    .oc-pillnav .tab-btn:hover { color: #fff; }
    .oc-pillnav .tab-btn[aria-selected="true"] { background: #fff; color: #101828; font-weight: 600; }
    .oc-band {
      background: #0F1626; border-radius: 20px;
      display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
      box-shadow: 0 18px 40px -22px rgba(15, 22, 38, 0.55);
    }
    @media (min-width: 768px) { .oc-band { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
    .oc-band-cell { padding: 20px 24px; min-width: 0; }
    .oc-band-label { font-size: 11px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: #8A94A6; }
    .oc-band-value { font-size: 34px; line-height: 1.1; font-weight: 500; letter-spacing: -0.02em; color: #fff; margin-top: 4px; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .oc-band-sub { font-size: 12px; color: #8A94A6; margin-top: 2px; }
    .oc-job {
      background: #fff; border: 1px solid #E2E5EA; border-radius: 16px;
      padding: 20px 24px;
      box-shadow: 0 2px 8px -2px rgba(16, 24, 40, 0.06);
      transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
      position: relative;
    }
    .oc-job:hover {
      border-color: #B9C4D3;
      box-shadow: 0 12px 28px -12px rgba(16, 24, 40, 0.18);
    }
    .oc-job-dot {
      display: inline-block; width: 8px; height: 8px; border-radius: 9999px; flex-shrink: 0;
    }
    .oc-sec-title { font-size: 30px; line-height: 1.15; font-weight: 600; letter-spacing: -0.025em; color: #101828; text-wrap: balance; }
    @media (min-width: 640px) { .oc-sec-title { font-size: 36px; } }
    .oc-btn-dark {
      background: #101828; color: #fff; border-radius: 12px;
      box-shadow: 0 8px 18px -10px rgba(16, 24, 40, 0.6);
    }
    .oc-btn-dark:hover { background: #1D2939; }
    .oc-btn-light {
      background: #fff; color: #344054; border: 1px solid #E2E5EA; border-radius: 12px;
    }
    .oc-btn-light:hover { border-color: #C9D2DE; color: #101828; }
    .oc-table-head { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: #667085; }
  </style>
</head>
<body class="bg-darkbg text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-brand-500 selection:text-white">

  ${getUiEnhancementsBodyHtml()}

  <!-- Command bar: identity + live signal / operations -->

  <header class="sticky top-0 z-40 border-b border-[#DDE1E7] bg-[#E8E9ED]/90 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2.5 flex flex-col gap-2.5">
      <div class="flex items-center justify-between gap-3 min-w-0">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="oc-brand-mark" aria-hidden="true"><i class="fa-solid fa-tower-broadcast text-sm"></i></div>
          <div class="min-w-0">
            <p class="text-[15px] font-semibold tracking-tight text-slate-900 leading-tight">OpenCode Cron</p>
            <p class="text-[11px] text-slate-500 font-mono truncate max-w-[52vw] sm:max-w-[340px]" id="current-dir" data-tooltip="tt.workspaceDir">Loading directory...</p>
          </div>
          <span data-tooltip="tt.liveBadge" class="hidden md:inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"></span>
            <span data-i18n="app.liveBadge">Web GUI Live</span>
          </span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <div class="hidden xl:flex items-center gap-1.5">
            ${getHeaderControlsHtml()}
          </div>
          <button id="btn-header-templates" onclick="openTemplatesModal()" data-tooltip="tt.templatesBtn" aria-label="Modelli e Blueprint" class="oc-btn-light px-2.5 sm:px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]">
            <i class="fa-solid fa-shapes text-indigo-600"></i>
            <span class="hidden md:inline" data-i18n="nav.templates">Modelli</span>
          </button>
          <button id="btn-header-backup" onclick="openBackupModal()" data-tooltip="tt.backupBtn" aria-label="Snapshot e Backup" class="oc-btn-light px-2.5 sm:px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]">
            <i class="fa-solid fa-box-archive text-cyan-600"></i>
            <span class="hidden md:inline" data-i18n="nav.backup">Snapshot</span>
          </button>
          <button id="btn-header-metrics" onclick="openMetricsModal()" data-tooltip="tt.metricsBtn" aria-label="Metriche e Telemetria" class="oc-btn-light px-2.5 sm:px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]">
            <i class="fa-solid fa-chart-pie text-emerald-600"></i>
            <span class="hidden md:inline" data-i18n="nav.metrics">Metriche</span>
          </button>
          <button id="btn-header-notify" onclick="openNotificationsModal()" data-tooltip="tt.notifyBtn" aria-label="Notifiche e Alert" class="oc-btn-light px-2.5 sm:px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]">
            <i class="fa-solid fa-bell text-violet-600"></i>
            <span class="hidden md:inline" data-i18n="nav.notifications">Notifiche</span>
          </button>
          <button id="btn-header-queue" onclick="openQueueModal()" data-tooltip="tt.queueBtn" aria-label="Coda e Worker" class="oc-btn-light px-2.5 sm:px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]">
            <i class="fa-solid fa-layer-group text-amber-600"></i>
            <span class="hidden md:inline" data-i18n="nav.queue">Coda & Worker</span>
            <span id="header-queue-badge" class="tabular px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">0/2</span>
          </button>
          <button id="btn-header-dlq" onclick="openDlqModal()" data-tooltip="tt.dlqBtn" aria-label="DLQ e Circuit" class="oc-btn-light px-2.5 sm:px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]">
            <i class="fa-solid fa-triangle-exclamation text-rose-600"></i>
            <span class="hidden md:inline" data-i18n="nav.dlq">DLQ & Circuit</span>
            <span id="header-dlq-badge" class="tabular px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30">0</span>
          </button>
          <button onclick="refreshAll()" data-tooltip="tt.liveBadge" aria-label="Ricarica stato" class="oc-btn-light p-2 min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors cursor-pointer">
            <i class="fa-solid fa-arrows-rotate text-xs" id="refresh-spinner"></i>
          </button>
          <button id="btn-header-new-job" onclick="openNewJobModal()" data-tooltip="tt.tabJobs" class="oc-btn-dark px-3 sm:px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]">
            <i class="fa-solid fa-plus text-[10px]"></i> <span class="hidden sm:inline" data-i18n="nav.newJob">Nuovo Job</span>
          </button>
          <button type="button" onclick="const m=document.getElementById('oc-mobile-menu');m.classList.toggle('hidden');this.setAttribute('aria-expanded',String(!m.classList.contains('hidden')))" aria-label="Apri menu" aria-expanded="false" class="xl:hidden oc-btn-light p-2 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer">
            <i class="fa-solid fa-bars text-sm"></i>
          </button>
        </div>
      </div>
      <nav role="tablist" aria-label="Sezioni Principali" class="oc-pillnav oc-scrollrow no-scrollbar flex items-center gap-0.5 p-1 w-full">
        <button role="tab" aria-selected="true" aria-controls="view-jobs" onclick="switchTab('jobs')" id="tab-btn-jobs" data-tooltip="tt.tabJobs" class="tab-btn px-3.5 py-2 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5 transition-all whitespace-nowrap">
          <i class="fa-solid fa-calendar-check"></i> <span data-i18n="nav.jobs">Jobs & Cron</span>
        </button>
        <button role="tab" aria-selected="false" aria-controls="view-chat" onclick="switchTab('chat')" id="tab-btn-chat" data-tooltip="tt.tabChat" class="tab-btn px-3.5 py-2 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5 transition-all whitespace-nowrap">
          <i class="fa-solid fa-comments"></i> <span data-i18n="nav.chat">Live Chat</span>
          <span id="chat-live-badge" class="w-2 h-2 rounded-full bg-emerald-400 hidden animate-ping"></span>
        </button>
        <button role="tab" aria-selected="false" aria-controls="view-memory" onclick="switchTab('memory')" id="tab-btn-memory" data-tooltip="tt.tabMemory" class="tab-btn px-3.5 py-2 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer">
          <i class="fa-solid fa-brain"></i> <span data-i18n="nav.memory">Memoria</span>
        </button>
        <button role="tab" aria-selected="false" aria-controls="view-diff" onclick="switchTab('diff')" id="tab-btn-diff" data-tooltip="tt.tabDiff" class="tab-btn px-3.5 py-2 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer">
          <i class="fa-solid fa-code-compare"></i> <span data-i18n="nav.diff">Git Diff</span>
          <span id="diff-count-badge" class="hidden px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/15 text-amber-200 border border-white/20"></span>
        </button>
        <button role="tab" aria-selected="false" aria-controls="view-logs" onclick="switchTab('logs')" id="tab-btn-logs" data-tooltip="tt.tabLogs" class="tab-btn px-3.5 py-2 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer">
          <i class="fa-solid fa-terminal"></i> <span data-i18n="nav.logs">Logs</span>
        </button>
        <a href="/runs" id="nav-link-runs" data-tooltip="tt.tabRuns" class="px-3.5 py-2 rounded-full text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all text-slate-300 hover:text-white whitespace-nowrap">
          <i class="fa-solid fa-chart-line"></i> <span data-i18n="nav.runs">Esiti Runs</span>
        </a>
      </nav>
      <div id="oc-mobile-menu" class="hidden xl:hidden flex flex-wrap items-center gap-2">
        ${getHeaderControlsHtml('-mob')}
      </div>
    </div>
  </header>

  <!-- Notification Toast Container -->
  <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none"></div>

  <!-- Main Content Areas -->
  <main class="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

    ${getOnboardingBannerHtml()}

    <!-- ============================================== -->
    <!-- TAB 1: JOBS DASHBOARD                          -->
    <!-- ============================================== -->
    <section id="view-jobs" role="tabpanel" aria-labelledby="tab-btn-jobs" class="tab-view block space-y-6">
      <!-- Status signal strip: live readouts, scan left to right -->
      <div class="oc-band" role="status" aria-live="polite">
        <div data-tooltip="tt.kpiActive" class="oc-band-cell">
          <div>
            <p class="oc-band-label flex items-center">
              <span data-i18n="kpi.activeTasks">Task Attivi</span>
              <span class="oc-help-badge">?</span>
            </p>
            <p class="oc-band-value tabular" id="stat-active">0</p>
            <p class="oc-band-sub">abilitati & in cadenza</p>
          </div>
        </div>

        <a href="/runs" data-tooltip="tt.kpiTotalRuns" class="oc-band-cell hover:bg-white/5 transition-colors group">
          <div>
            <p class="oc-band-label group-hover:text-white transition-colors flex items-center">
              <span data-i18n="kpi.totalRuns">Totale Esecuzioni (Vedi Esiti →)</span>
              <span class="oc-help-badge">?</span>
            </p>
            <p class="oc-band-value tabular group-hover:text-indigo-300 transition-colors" id="stat-runs">0</p>
            <p class="oc-band-sub group-hover:text-slate-300 transition-colors flex items-center gap-1">
              <span>storico runs</span> <i class="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-0.5 transition-transform"></i>
            </p>
          </div>
        </a>

        <div data-tooltip="tt.kpiLaunchd" class="oc-band-cell">
          <div>
            <p class="oc-band-label flex items-center">
              <span data-i18n="kpi.launchd">Launchd Daemon</span>
              <span class="oc-help-badge">?</span>
            </p>
            <p class="text-sm font-semibold text-slate-100 mt-2 flex items-center gap-2" id="stat-daemon">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-dot shrink-0"></span>
              <span class="font-mono text-emerald-400">ai.opencode.cron</span>
              <span class="text-xs text-slate-400 font-mono">(60s)</span>
            </p>
            <p class="oc-band-sub">ticker OS in background</p>
          </div>
        </div>

        <div data-tooltip="tt.kpiNextTick" class="oc-band-cell">
          <div>
            <p class="oc-band-label flex items-center">
              <span data-i18n="kpi.nextTick">Prossimo Tick</span>
              <span class="oc-help-badge">?</span>
            </p>
            <p class="text-sm font-semibold text-slate-200 mt-2 font-mono tabular tracking-tight" id="stat-next-tick">-</p>
            <p class="oc-band-sub">orario prossimo trigger</p>
          </div>
        </div>
      </div>

      <!-- Jobs Grid Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 class="oc-sec-title" data-i18n="jobs.heading">Cron Jobs Registrati</h2>
          <p class="text-[13px] text-slate-500 mt-1" data-i18n="jobs.subheading">Task ricorrenti che scrivono direttamente nelle sessioni di OpenCode</p>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="openPipelineModal()" data-tooltip="tt.pipelineBtn" class="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <i class="fa-solid fa-diagram-project text-[10px]"></i> <span data-i18n="pipeline.headerBtn">Workflow & DAG</span>
          </button>
          <button onclick="runAllDue()" data-tooltip="tt.runDueBtn" class="bg-slate-200 hover:bg-slate-200 text-slate-700 border border-darkborder px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <i class="fa-solid fa-play text-[10px]"></i> <span data-i18n="jobs.runDueNow">Esegui Scaduti Ora</span>
          </button>
        </div>
      </div>

      <!-- Search, Tag & Filter Toolbar (Anti-Slop Utility Bar) -->
      <div class="bg-darkcard border border-darkborder rounded-xl p-3 flex flex-col gap-2.5 shadow-sm">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <!-- Text Search input -->
          <div class="relative flex-1">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
            <input
              type="text"
              id="job-filter-search"
              placeholder="Filtra per titolo, tag o ID..."
              data-i18n-placeholder="filter.searchPlaceholder"
              oninput="applyJobFilters()"
              class="w-full bg-slate-100 border border-darkborder rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            />
            <button
              type="button"
              onclick="clearJobSearch()"
              id="job-filter-search-clear"
              class="hidden absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Category dropdown -->
          <div class="shrink-0">
            <select
              id="job-filter-category"
              onchange="applyJobFilters()"
              class="w-full sm:w-auto bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all" data-i18n="filter.allCategories">Tutte le Categorie</option>
              <option value="ops">ops</option>
              <option value="ci">ci</option>
              <option value="security">security</option>
              <option value="ai">ai</option>
              <option value="general">general</option>
            </select>
          </div>

          <!-- Status dropdown -->
          <div class="shrink-0">
            <select
              id="job-filter-status"
              onchange="applyJobFilters()"
              class="w-full sm:w-auto bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all" data-i18n="filter.allStatuses">Tutti gli Stati</option>
              <option value="enabled" data-i18n="filter.statusEnabled">Abilitati</option>
              <option value="disabled" data-i18n="filter.statusDisabled">In Pausa</option>
              <option value="quarantined" data-i18n="filter.statusQuarantined">In Quarantena</option>
            </select>
          </div>

          <!-- Match count readout -->
          <div class="text-[11px] text-slate-500 font-mono text-right sm:text-left shrink-0 whitespace-nowrap self-center px-1">
            <span id="job-filtered-count">0</span> / <span id="job-total-count">0</span>
          </div>
        </div>

        <!-- Tag pills strip -->
        <div id="job-tags-strip" class="flex flex-wrap items-center gap-1.5 pt-1 border-t border-darkborder/50 text-[10px]">
          <!-- Populated by JS -->
        </div>
      </div>

      <!-- Jobs Container -->
      <div id="jobs-container" class="flex flex-col gap-2.5">
        <!-- Rendered by JS -->
        <div class="col-span-full py-16 text-center text-gray-500 bg-darkcard/50 rounded-2xl border border-dashed border-darkborder">
          <i class="fa-solid fa-spinner fa-spin text-2xl mb-3 text-indigo-600"></i>
          <p class="text-sm" data-i18n="loading.jobs">Caricamento job in corso...</p>
        </div>
      </div>
    </section>

    <!-- ============================================== -->
    <!-- TAB 2: LIVE CHAT & REALTIME FEED               -->
    <!-- ============================================== -->
    <section id="view-chat" role="tabpanel" aria-labelledby="tab-btn-chat" class="tab-view hidden space-y-4">
      <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center space-x-3 min-w-0">
          <div class="w-9 h-9 shrink-0 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20">
            <i class="fa-solid fa-comments"></i>
          </div>
          <div class="min-w-0">
            <h2 class="text-sm font-bold text-slate-900 truncate" data-i18n="chat.title">Live Chat & Feed Sessione</h2>
            <p class="text-xs text-slate-500 line-clamp-2 sm:line-clamp-1" data-i18n="chat.subtitle">Visualizza e aggiorna in tempo reale i prompt e le risposte generate dai tick automatici</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Rich Custom Session Picker Dropdown Component -->
          <div class="relative min-w-0" id="session-picker-wrapper">
            <button
              id="session-picker-trigger"
              type="button"
              onclick="toggleSessionPicker()"
              aria-haspopup="listbox"
              aria-expanded="false"
              class="flex items-center gap-2 max-w-[92vw] sm:max-w-none bg-slate-100/90 hover:bg-slate-100 border border-darkborder hover:border-indigo-500/50 rounded-xl px-3 py-2 text-xs transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/40 group cursor-pointer min-h-[44px]"
            >
              <span class="text-xs text-slate-500 font-medium" data-i18n="chat.sessionLabel">Sessione:</span>
              <div id="session-trigger-badge" class="flex items-center gap-1.5">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600">
                  <i class="fa-solid fa-spinner fa-spin text-[9px]"></i> <span data-i18n="loading.generic">Caricamento...</span>
                </span>
              </div>
              <span id="session-trigger-title" class="font-bold text-slate-900 max-w-[110px] sm:max-w-[220px] md:max-w-[280px] truncate block text-left" data-i18n="loading.generic">
                Caricamento...
              </span>
              <span id="session-trigger-time" class="text-[10px] text-gray-500 hidden sm:inline-block font-mono">
                -
              </span>
              <i id="session-trigger-chevron" class="fa-solid fa-chevron-down text-[10px] text-slate-500 group-hover:text-slate-700 transition-transform duration-200"></i>
            </button>

            <!-- Hidden native select for programmatic and test compatibility -->
            <select id="chat-session-select" onchange="selectSession(this.value)" class="sr-only" tabindex="-1" aria-hidden="true">
              <option value="" data-i18n="loading.sessions">Caricamento sessioni...</option>
            </select>

            <!-- Dropdown Popover Menu -->
            <div
              id="session-picker-dropdown"
              class="hidden absolute left-0 sm:left-auto sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[500px] max-w-[92vw] bg-slate-100/95 backdrop-blur-xl border border-darkborder rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[70vh] sm:max-h-[580px] animate-fadeIn"
            >
              <!-- Search & Refresh Header -->
              <div class="p-3 border-b border-darkborder bg-slate-100/60 flex items-center gap-2">
                <div class="relative flex-1">
                  <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
                  <input
                    type="text"
                    id="session-search-input"
                    placeholder="Cerca sessione, cron job o ID..."
                    data-i18n-placeholder="chat.searchPlaceholder"
                    oninput="filterSessionList(this.value)"
                    class="w-full bg-slate-100 border border-darkborder rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onclick="clearSessionSearch()"
                    id="session-search-clear"
                    class="hidden absolute right-2.5 top-2 text-slate-500 hover:text-slate-900 text-xs"
                    title="Cancella ricerca"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <button
                  type="button"
                  onclick="reloadSessions(true)"
                  title="Ricarica da SQLite"
                  class="bg-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors border border-darkborder shrink-0 cursor-pointer"
                >
                  <i id="session-reload-icon" class="fa-solid fa-arrows-rotate text-[11px]"></i>
                </button>
              </div>

              <!-- Filter Chips & Workspace Toggle -->
              <div class="px-3 py-2 border-b border-darkborder/60 bg-slate-100/30 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                <button
                  type="button"
                  onclick="setSessionFilter('all')"
                  class="session-filter-btn px-2.5 py-1 rounded-md font-semibold transition-all bg-[#101828] text-white shrink-0 cursor-pointer"
                  data-filter="all"
                >
                  <span data-i18n="chat.filterAll">Tutte</span> (<span id="count-all">0</span>)
                </button>
                <button
                  type="button"
                  onclick="setSessionFilter('cron')"
                  data-tooltip="tt.sessionCron"
                  class="session-filter-btn px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all shrink-0 cursor-pointer"
                  data-filter="cron"
                >
                  <span data-i18n="chat.filterCron">⚡ Con Cron</span> (<span id="count-cron">0</span>)
                </button>
                <button
                  type="button"
                  onclick="setSessionFilter('root')"
                  data-tooltip="tt.sessionRoot"
                  class="session-filter-btn px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all shrink-0 cursor-pointer"
                  data-filter="root"
                >
                  <span data-i18n="chat.filterRoot">💬 Principali</span> (<span id="count-root">0</span>)
                </button>
                <button
                  type="button"
                  onclick="setSessionFilter('sub')"
                  data-tooltip="tt.sessionSub"
                  class="session-filter-btn px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all shrink-0 cursor-pointer"
                  data-filter="sub"
                >
                  <span data-i18n="chat.filterSub">🤖 Subagenti</span> (<span id="count-sub">0</span>)
                </button>
                <label class="ml-auto flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer pl-2 shrink-0 select-none">
                  <input
                    type="checkbox"
                    id="session-filter-curdir-only"
                    checked
                    onchange="applySessionFilters()"
                    class="rounded bg-slate-200 border-slate-300 text-indigo-600 focus:ring-0 w-3 h-3 cursor-pointer"
                  />
                  <span data-i18n="chat.onlyRepo">Solo Questo Repo</span>
                </label>
              </div>

              <!-- Session Items List (Scrollable Container) -->
              <div id="session-items-container" class="overflow-y-auto p-2 space-y-1 flex-1 max-h-[380px]">
                <!-- Dynamically populated -->
              </div>

              <!-- Footer with stats & color legend -->
              <div class="px-3 py-2 bg-slate-100/80 border-t border-darkborder flex items-center justify-between text-[10px] text-slate-500">
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
          <label class="flex items-center space-x-2 cursor-pointer bg-slate-100/60 border border-darkborder px-2.5 py-1.5 rounded-lg shrink-0">
            <input type="checkbox" id="chat-autorefresh" checked onchange="toggleAutoRefresh(this.checked)" class="rounded bg-slate-200 border-slate-300 text-indigo-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer">
            <span class="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
              <span id="chat-autorefresh-dot" class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span> <span data-i18n="chat.autoRefresh">Auto-Aggiorna (3s)</span>
            </span>
          </label>
        </div>
      </div>

      <!-- Chat Messages Container -->
      <div class="bg-darkcard border border-darkborder rounded-2xl flex flex-col h-[70vh] min-h-[420px] sm:h-[650px] shadow-2xl relative overflow-hidden">
        <!-- Active Session Context Banner -->
        <div id="chat-session-banner" class="px-3 sm:px-4 py-2 bg-slate-100/80 border-b border-darkborder flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2 min-w-0">
            <span id="banner-session-type-badge">
              <span class="bg-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-semibold">Sessione</span>
            </span>
            <span id="banner-session-title" class="font-bold text-slate-900 truncate max-w-[260px] sm:max-w-[380px]">Caricamento...</span>
            <span id="banner-session-id" class="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 hidden sm:inline-block"></span>
            <button onclick="copyActiveSessionId()" title="Copia ID Sessione" class="text-slate-500 hover:text-indigo-600 text-xs p-1 transition-colors cursor-pointer">
              <i id="copy-session-icon" class="fa-regular fa-copy"></i>
            </button>
          </div>
          <div class="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
            <span id="banner-session-updated" class="flex items-center gap-1">
              <i class="fa-regular fa-clock text-[10px]"></i> <span id="banner-updated-text">-</span>
            </span>
            <span id="banner-job-link-container"></span>
            <button onclick="switchTab('diff')" data-tooltip="tt.tabDiff" class="bg-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-darkborder px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer">
              <i class="fa-solid fa-code-compare text-[9px] text-indigo-600"></i> <span data-i18n="nav.diff">Diff File</span>
            </button>
          </div>
        </div>

        <!-- Messages Scroll Area -->
        <div id="chat-messages" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div class="text-center py-20 text-gray-500">
            <i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-600 mb-3"></i>
            <p class="text-sm" data-i18n="loading.chat">Caricamento conversazione in tempo reale...</p>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <div class="p-3 bg-slate-100/80 border-t border-darkborder flex items-end gap-2 safe-area-pad">
          <textarea id="chat-prompt-input" rows="1" placeholder="Invia un prompt o istruzione manuale a questa sessione (Invio invia, Shift+Invio a capo)..." data-i18n-placeholder="chat.promptPlaceholder" class="flex-1 bg-slate-100 border border-darkborder rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none max-h-36 leading-relaxed" onkeydown="handleChatInputKey(event)" oninput="autoResizeTextarea(this)"></textarea>
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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight" data-i18n="memory.title">Memoria Persistente Cron</h2>
          <p class="text-xs text-slate-500" data-i18n="memory.subtitle">File markdown salvati in .opencode/cron/memory/</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <select id="memory-job-select" onchange="loadJobMemory(this.value)" class="bg-slate-100 border border-darkborder text-xs rounded-lg px-3 py-1.5 text-slate-700">
            <option value="">Seleziona un job...</option>
          </select>
          <button onclick="saveCurrentMemory()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <i class="fa-solid fa-floppy-disk text-[10px]"></i> <span data-i18n="memory.save">Salva Modifiche</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Editor -->
        <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col h-[420px] sm:h-[580px]">
          <div class="flex items-center justify-between pb-3 border-b border-darkborder mb-3">
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-pen-to-square text-indigo-600"></i> <span data-i18n="memory.editor">Editor Markdown</span>
            </span>
            <span id="memory-meta" data-tooltip="tt.memoryHashes" class="text-xs font-mono text-gray-500 cursor-help"></span>
          </div>
          <textarea id="memory-editor" class="flex-1 w-full bg-slate-100 font-mono text-xs text-slate-700 p-3 rounded-xl border border-darkborder focus:outline-none focus:border-indigo-500 resize-none" placeholder="Contenuto memoria persistent..."></textarea>
        </div>

        <!-- Live Preview -->
        <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col h-[420px] sm:h-[580px]">
          <div class="flex items-center justify-between pb-3 border-b border-darkborder mb-3">
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-eye text-indigo-600"></i> <span data-i18n="memory.preview">Anteprima Renderizzata</span>
            </span>
          </div>
          <div id="memory-preview" class="flex-1 overflow-y-auto p-4 bg-slate-100/60 rounded-xl border border-darkborder text-sm prose-dark">
            <p class="text-gray-500 italic">Seleziona un job per vedere la memoria persistente renderizzata.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================== -->
    <!-- TAB 4: SYSTEM LOGS & TICKER                    -->
    <!-- ============================================== -->
    <section id="view-logs" role="tabpanel" aria-labelledby="tab-btn-logs" class="tab-view hidden space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight" data-i18n="logs.title">Logs & Diagnostica Ticker</h2>
          <p class="text-xs text-slate-500" data-i18n="logs.subtitle">Output da ~/Library/Logs/opencode-cron.log e .err</p>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="loadLogs()" class="bg-slate-200 hover:bg-slate-200 text-slate-700 border border-darkborder px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <i class="fa-solid fa-arrows-rotate text-[10px]"></i> <span data-i18n="logs.reload">Ricarica Logs</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Stdout Log -->
        <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col h-[420px] sm:h-[600px]">
          <div class="flex items-center justify-between pb-2 border-b border-darkborder mb-2">
            <span class="text-xs font-bold text-emerald-700 font-mono">STDOUT (opencode-cron.log)</span>
          </div>
          <pre id="log-stdout" class="flex-1 overflow-y-auto p-3 bg-slate-100 font-mono text-[11px] text-emerald-700/90 rounded-xl whitespace-pre-wrap leading-relaxed select-text"></pre>
        </div>

        <!-- Stderr Log -->
        <div class="bg-darkcard border border-darkborder rounded-2xl p-4 flex flex-col h-[420px] sm:h-[600px]">
          <div class="flex items-center justify-between pb-2 border-b border-darkborder mb-2">
            <span class="text-xs font-bold text-rose-600 font-mono">STDERR (opencode-cron.err)</span>
          </div>
          <pre id="log-stderr" class="flex-1 overflow-y-auto p-3 bg-slate-100 font-mono text-[11px] text-rose-700/90 rounded-xl whitespace-pre-wrap leading-relaxed select-text"></pre>
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
            <h2 class="text-lg font-bold text-slate-900 tracking-tight" data-i18n="diff.title">Git Diff & File Changes</h2>
            <span id="git-branch-badge" class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              <i class="fa-solid fa-code-branch text-[9px] mr-1"></i><span id="git-branch-name">main</span>
            </span>
          </div>
          <p class="text-xs text-slate-500" data-i18n="diff.subtitle">Verifica in tempo reale tutti i file creati, modificati o eliminati nel workspace locale.</p>
        </div>
        <div class="flex items-center space-x-2">
          <button type="button" onclick="loadGitDiff()" class="bg-slate-200 hover:bg-slate-200 text-slate-700 border border-darkborder px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <i id="git-refresh-icon" class="fa-solid fa-arrows-rotate text-[11px]"></i> <span data-i18n="diff.reload">Ricarica Diff</span>
          </button>
        </div>
      </div>

      <!-- Diff Stats Bar -->
      <div id="git-stat-bar" class="p-3 bg-darkcard border border-darkborder rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
          <i class="fa-solid fa-chart-simple text-indigo-600"></i>
          <span id="git-stat-summary" data-i18n="loading.git">Caricamento stato Git...</span>
        </div>
        <div id="git-files-summary" class="flex items-center gap-2 text-[11px]"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[650px]">
        <!-- File list sidebar (4 cols) -->
        <div class="lg:col-span-4 bg-darkcard border border-darkborder rounded-2xl p-3 flex flex-col overflow-hidden min-h-[280px] max-h-[420px] lg:max-h-none lg:h-full">
          <div class="flex items-center justify-between pb-2.5 border-b border-darkborder mb-2">
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-folder-tree text-indigo-600"></i> <span data-i18n="diff.filesInvolved">File Coinvolti</span> (<span id="git-files-count">0</span>)
            </span>
            <button type="button" onclick="selectGitFile('')" class="text-[10px] text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer" data-i18n="diff.all">
              Tutto
            </button>
          </div>
          <div id="git-file-list" class="flex-1 overflow-y-auto space-y-1 pr-1">
            <div class="text-center py-12 text-gray-500 text-xs" data-i18n="loading.generic">Caricamento file...</div>
          </div>
        </div>

        <!-- Diff Viewer pane (8 cols) -->
        <div class="lg:col-span-8 bg-darkcard border border-darkborder rounded-2xl flex flex-col overflow-hidden min-h-[380px] max-h-[70vh] lg:max-h-none lg:h-full">
          <div class="flex items-center justify-between px-4 py-2.5 border-b border-darkborder bg-slate-100/60">
            <span id="git-diff-filename" class="text-xs font-mono font-semibold text-slate-700 truncate">
              Tutte le modifiche (Unified Diff)
            </span>
            <span id="git-diff-lines-count" class="text-[10px] font-mono text-slate-500"></span>
          </div>
          <div id="git-diff-content" class="flex-1 overflow-auto p-4 bg-slate-100 font-mono text-[11px] leading-relaxed select-text">
            <div class="text-center py-20 text-gray-500">
              <i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-600 mb-2"></i>
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
  <div id="job-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-xl w-full my-4 sm:my-8 p-4 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <h3 id="modal-title" class="text-base font-bold text-slate-900" data-i18n="modal.newTitle">Nuovo Cron Job</h3>
        <button onclick="closeModal()" aria-label="Chiudi finestra modale" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form id="job-form" onsubmit="handleJobSubmit(event)" class="space-y-4 text-xs">
        <input type="hidden" id="form-job-id" />

        <div>
          <label for="form-title" class="block font-medium text-slate-600 mb-1" data-i18n="modal.fieldTitle">Titolo Job</label>
          <input type="text" id="form-title" required placeholder="es. AI News Monitor 5m" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500">
        </div>

        <div class="space-y-2 bg-slate-100/60 p-3 rounded-xl border border-darkborder">
          <div class="flex items-center justify-between">
            <label for="form-schedule" class="block font-medium text-slate-600" data-i18n="modal.fieldSchedule">Pianificazione / Intervallo</label>
            <span class="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
              <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i> Visual Builder
            </span>
          </div>

          <!-- Preset Pills -->
          <div id="modal-presets-container" class="flex flex-wrap gap-1.5">
            <button type="button" onclick="applySchedulePreset('5m')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">⚡ 5m</button>
            <button type="button" onclick="applySchedulePreset('15m')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">⚡ 15m</button>
            <button type="button" onclick="applySchedulePreset('30m')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">⚡ 30m</button>
            <button type="button" onclick="applySchedulePreset('1h')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">⏰ 1h</button>
            <button type="button" onclick="applySchedulePreset('0 9 * * *')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">📅 09:00</button>
            <button type="button" onclick="applySchedulePreset('0 18 * * *')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">📅 18:00</button>
            <button type="button" onclick="applySchedulePreset('0 9 * * 1-5')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-darkborder text-[10px] font-medium transition-colors cursor-pointer">🏢 Lun-Ven 09:00</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div data-tooltip="tt.formSchedule">
              <label for="form-schedule" class="text-[10px] text-slate-500 block mb-0.5"><span data-i18n="modal.fieldSchedule">Espressione</span> <span class="oc-help-badge">?</span></label>
              <input type="text" id="form-schedule" required placeholder="5m, 1h, */5 * * * *" oninput="debounceSchedulePreview(this.value)" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500">
            </div>
            <div data-tooltip="tt.formMaxRuns">
              <label for="form-max-runs" class="text-[10px] text-slate-500 block mb-0.5"><span data-i18n="modal.fieldMaxRuns">Max Runs (0 = illimitato)</span> <span class="oc-help-badge">?</span></label>
              <input type="number" id="form-max-runs" value="0" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:outline-none focus:border-indigo-500">
            </div>
            <div data-tooltip="tt.priorityNormal">
              <label for="form-priority" class="text-[10px] text-slate-500 block mb-0.5"><span data-i18n="priority.label">Priorità Job</span> <span class="oc-help-badge">?</span></label>
              <select id="form-priority" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:outline-none focus:border-indigo-500">
                <option value="high">🔥 Alta (High)</option>
                <option value="normal" selected>⚡ Normale (Normal)</option>
                <option value="low">💤 Bassa (Low)</option>
              </select>
            </div>
          </div>

          <!-- Real-time Human Description & Next 3 Runs Card -->
          <div id="schedule-preview-box" class="p-2.5 rounded-lg bg-slate-100/70 border border-darkborder/70 text-[11px] space-y-1">
            <div class="flex items-center gap-1.5 text-slate-600 font-medium">
              <i class="fa-regular fa-clock text-indigo-600 text-xs"></i>
              <span id="schedule-desc-text">Inserisci un intervallo o clicca su un preset sopra.</span>
            </div>
            <div id="schedule-next-runs" class="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2 pt-0.5">
              <!-- Prossimi 3 tick -->
            </div>
          </div>

          <!-- Adaptive Cadence (Burst & Idle Mode) Section -->
          <div class="p-3 rounded-xl bg-slate-100/70 border border-darkborder space-y-2 mt-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i class="fa-solid fa-gauge-high text-amber-600 text-xs"></i>
                <label for="form-adaptive-enabled" class="text-xs font-bold text-slate-700 cursor-pointer" data-i18n="modal.adaptiveTitle">Cadenza Adattiva (Burst & Idle)</label>
              </div>
              <input type="checkbox" id="form-adaptive-enabled" onchange="toggleAdaptiveFields()" class="w-4 h-4 rounded text-indigo-600 bg-slate-100 border-slate-300 cursor-pointer">
            </div>
            <p class="text-[11px] text-slate-500 leading-relaxed" data-i18n="modal.adaptiveHelp">Accelera la frequenza durante l'attività e rallenta quando non ci sono novità per risparmiare risorse e token.</p>
            <div id="adaptive-fields" class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 hidden">
              <div>
                <label for="form-adaptive-burst" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="modal.adaptiveBurst">Burst Interval</label>
                <input type="text" id="form-adaptive-burst" placeholder="1m" value="1m" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label for="form-adaptive-idle" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="modal.adaptiveIdle">Idle Interval</label>
                <input type="text" id="form-adaptive-idle" placeholder="30m" value="30m" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label for="form-adaptive-threshold" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="modal.adaptiveQuiet">Soglia Quiet (tick)</label>
                <input type="number" id="form-adaptive-threshold" min="1" max="20" value="3" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500">
              </div>
            </div>
          </div>

          <!-- Pipeline & Multi-Job Workflows (DAG) Section -->
          <div class="p-3 rounded-xl bg-slate-100/70 border border-darkborder space-y-2 mt-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i class="fa-solid fa-diagram-project text-cyan-700 text-xs"></i>
                <label for="form-pipeline-enabled" class="text-xs font-bold text-slate-700 cursor-pointer" data-i18n="modal.pipelineTitle">Pipeline & Trigger Multi-Job (Workflow DAG)</label>
              </div>
              <input type="checkbox" id="form-pipeline-enabled" onchange="togglePipelineFields()" class="w-4 h-4 rounded text-cyan-600 bg-slate-100 border-slate-300 cursor-pointer">
            </div>
            <p class="text-[11px] text-slate-500 leading-relaxed" data-i18n="modal.pipelineHelp">Collega questo job ad altri job: esegui automaticamente i successivi al termine con successo o su errore.</p>
            <div id="pipeline-fields" class="space-y-2 pt-1 hidden">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label for="form-pipeline-success" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="modal.pipelineOnSuccess">Esegui su Successo (Job IDs)</label>
                  <input type="text" id="form-pipeline-success" placeholder="job_id_1, job_id_2" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-cyan-500">
                </div>
                <div>
                  <label for="form-pipeline-failure" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="modal.pipelineOnFailure">Esegui su Errore (Job IDs)</label>
                  <input type="text" id="form-pipeline-failure" placeholder="job_alert, job_fallback" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-cyan-500">
                </div>
              </div>
              <div class="flex items-center space-x-2 pt-1">
                <input type="checkbox" id="form-pipeline-payload" checked class="w-3.5 h-3.5 rounded text-cyan-600 bg-slate-100 border-slate-300 cursor-pointer">
                <label for="form-pipeline-payload" class="text-[11px] text-slate-600 cursor-pointer" data-i18n="modal.pipelinePassPayload">Inietta contesto/memoria del job padre nei job a valle</label>
              </div>
            </div>
          </div>

          <!-- Webhook Inbound HTTP Trigger Section -->
          <div class="p-3 rounded-xl bg-slate-100/70 border border-darkborder space-y-2 mt-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i class="fa-solid fa-satellite-dish text-violet-600 text-xs"></i>
                <label for="form-webhook-enabled" class="text-xs font-bold text-slate-700 cursor-pointer" data-i18n="webhook.modalTitle">Endpoint Webhook Inbound & Token</label>
              </div>
              <input type="checkbox" id="form-webhook-enabled" onchange="toggleWebhookFields()" class="w-4 h-4 rounded text-violet-600 bg-slate-100 border-slate-300 cursor-pointer">
            </div>
            <p class="text-[11px] text-slate-500 leading-relaxed" data-i18n="webhook.modalDesc">Permette a servizi esterni (GitHub, GitLab, Stripe, Sentry, CI/CD, curl) di avviare immediatamente questo job via HTTP.</p>
            <div id="webhook-fields" class="space-y-2 pt-1 hidden">
              <div>
                <label for="form-webhook-secret" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="webhook.secretLabel">Segreto Condiviso HMAC (opzionale per GitHub X-Hub-Signature-256)</label>
                <input type="text" id="form-webhook-secret" placeholder="opzionale (es. gh_sec_12345)" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-violet-500">
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label for="form-webhook-ratelimit" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="webhook.rateLimit">Cooldown anti-spam (secondi)</label>
                  <input type="number" id="form-webhook-ratelimit" min="1" max="86400" value="5" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-violet-500">
                </div>
                <div class="flex items-center space-x-2 pt-3">
                  <input type="checkbox" id="form-webhook-payload" checked class="w-3.5 h-3.5 rounded text-violet-600 bg-slate-100 border-slate-300 cursor-pointer">
                  <label for="form-webhook-payload" class="text-[11px] text-slate-600 cursor-pointer" data-i18n="webhook.passPayload">Inietta payload JSON in memoria</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category & Tags Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="form-category" class="block font-medium text-slate-600 mb-1" data-i18n="modal.fieldCategory">Categoria</label>
            <input type="text" id="form-category" placeholder="es. ops, sync, ci, devops" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs">
          </div>
          <div>
            <label for="form-tags" class="block font-medium text-slate-600 mb-1" data-i18n="modal.fieldTags">Tag (separati da virgola)</label>
            <input type="text" id="form-tags" placeholder="es. prod, critical, backup" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs">
          </div>
        </div>

        <!-- Timezone & Timeout Watchdog Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="form-timezone" class="block font-medium text-slate-600 mb-1" data-i18n="modal.fieldTimezone">Fuso Orario (IANA Timezone)</label>
            <input type="text" id="form-timezone" placeholder="es. Europe/Rome, UTC, America/New_York" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-xs">
          </div>
          <div>
            <label for="form-timeout" class="block font-medium text-slate-600 mb-1" data-i18n="modal.fieldTimeout">Watchdog Timeout (secondi)</label>
            <input type="number" id="form-timeout" placeholder="es. 120 (0 = default)" min="5" max="3600" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-xs">
          </div>
        </div>

        <!-- Pre-flight Guard Check Section -->
        <div class="p-3 rounded-xl bg-slate-100/70 border border-darkborder space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <i class="fa-solid fa-shield-halved text-emerald-600 text-xs"></i>
              <label for="form-guard-enabled" class="text-xs font-bold text-slate-700 cursor-pointer" data-i18n="modal.guardTitle">Pre-Flight Guard & Condizioni</label>
            </div>
            <input type="checkbox" id="form-guard-enabled" onchange="toggleGuardFields()" class="w-4 h-4 rounded text-emerald-600 bg-slate-100 border-slate-300 cursor-pointer">
          </div>
          <p class="text-[11px] text-slate-500 leading-relaxed" data-i18n="modal.guardHelp">Verifica condizioni preliminari prima di ogni esecuzione: se il controllo fallisce, il tick viene saltato in sicurezza.</p>
          <div id="guard-fields" class="space-y-2 pt-1 hidden">
            <div>
              <label for="form-guard-command" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="modal.guardCommand">Comando Shell (exit code 0)</label>
              <input type="text" id="form-guard-command" placeholder="es. test -f /tmp/ready || git diff --quiet" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-500">
            </div>
            <div>
              <label for="form-guard-http" class="text-[10px] text-slate-500 block mb-0.5" data-i18n="modal.guardHttpUrl">Controllo Salute HTTP (status 200)</label>
              <input type="url" id="form-guard-http" placeholder="es. http://127.0.0.1:3000/health" class="w-full bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-500">
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="form-session-id" class="block font-medium text-slate-600 mb-1" data-i18n="modal.fieldSession">Sessione OpenCode</label>
            <select id="form-session-id" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500">
              <!-- Loaded via JS -->
            </select>
          </div>
          <div>
            <label for="form-model" class="block font-medium text-slate-600 mb-1" data-i18n="modal.fieldModel">Modello LLM (opzionale)</label>
            <input type="text" id="form-model" placeholder="openai/gpt-6.1-sol" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500">
          </div>
        </div>

        <div data-tooltip="tt.formSystem">
          <label for="form-system-prompt" class="block font-medium text-slate-600 mb-1"><span data-i18n="modal.fieldSystem">Prompt di Sistema (Frozen)</span> <span class="oc-help-badge">?</span></label>
          <textarea id="form-system-prompt" rows="3" required placeholder="Obiettivo e regole stabili dell'agente per ogni tick..." class="w-full bg-slate-100 border border-darkborder rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"></textarea>
        </div>

        <div data-tooltip="tt.formFollowup">
          <label for="form-followup-prompt" class="block font-medium text-slate-600 mb-1"><span data-i18n="modal.fieldFollowup">Followup Prompt (Azione per Tick)</span> <span class="oc-help-badge">?</span></label>
          <textarea id="form-followup-prompt" rows="3" required placeholder="Cosa deve fare l'agente ad ogni tick pianificato..." class="w-full bg-slate-100 border border-darkborder rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"></textarea>
        </div>

        <div class="flex items-center justify-end space-x-2 pt-3 border-t border-darkborder">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 cursor-pointer" data-i18n="modal.cancel">Annulla</button>
          <button type="submit" id="modal-submit-btn" class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer" data-i18n="modal.save">Salva Job</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- MODAL: CONFERMA ELIMINAZIONE                   -->
  <!-- ============================================== -->
  <div id="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-sm w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative">
      <div class="flex items-center space-x-3 text-rose-600 mb-3">
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <i class="fa-solid fa-triangle-exclamation text-base"></i>
        </div>
        <div>
          <h3 id="confirm-modal-title" class="text-sm font-bold text-slate-900" data-i18n="modal.deleteTitle">Conferma Eliminazione</h3>
          <p class="text-[11px] text-slate-500" data-i18n="modal.irreversibleAction">Azione irreversibile</p>
        </div>
      </div>
      <p id="confirm-modal-message" class="text-xs text-slate-600 leading-relaxed mt-2 bg-slate-100/60 p-3 rounded-xl border border-darkborder">Sei sicuro di voler eliminare questo job?</p>
      <div class="flex items-center justify-end space-x-2 pt-4 mt-3 border-t border-darkborder">
        <button type="button" onclick="closeConfirmModal()" class="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-medium" data-i18n="modal.cancel">Annulla</button>
        <button type="button" id="confirm-modal-btn" class="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500 text-xs shadow-md shadow-rose-600/30" data-i18n="job.deleteTitle">Elimina Job</button>
      </div>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- MODAL: WORKFLOW & DAG PIPELINE GRAPH           -->
  <!-- ============================================== -->
  <div id="pipeline-modal" role="dialog" aria-modal="true" aria-labelledby="pipeline-modal-title" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-3xl w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col max-h-[85vh]">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-700">
            <i class="fa-solid fa-diagram-project text-sm"></i>
          </div>
          <div>
            <h3 id="pipeline-modal-title" class="text-base font-bold text-slate-900" data-i18n="pipeline.modalTitle">Grafo Workflow Pipeline (DAG)</h3>
            <p class="text-[11px] text-slate-500">Dipendenze di trigger success/failure e propagazione memoria</p>
          </div>
        </div>
        <button onclick="closePipelineModal()" aria-label="Chiudi finestra" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div id="pipeline-graph-content" class="flex-1 overflow-y-auto space-y-4 pr-1">
        <!-- Rendered dynamically via openPipelineModal() -->
      </div>

      <div class="flex items-center justify-between pt-4 mt-2 border-t border-darkborder text-xs text-slate-500">
        <span id="pipeline-cycle-status" class="flex items-center gap-1.5 font-mono text-[11px]"></span>
        <button type="button" onclick="closePipelineModal()" class="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-200 font-medium">Chiudi</button>
      </div>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- MODAL: INBOUND WEBHOOK & TOKEN MANAGER         -->
  <!-- ============================================== -->
  <div id="webhook-modal" role="dialog" aria-modal="true" aria-labelledby="webhook-modal-title" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-xl w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600">
            <i class="fa-solid fa-satellite-dish text-sm"></i>
          </div>
          <div>
            <h3 id="webhook-modal-title" class="text-base font-bold text-slate-900" data-i18n="webhook.modalTitle">Endpoint Webhook Inbound & Token</h3>
            <p id="webhook-modal-subtitle" class="text-[11px] font-mono text-violet-700">Job ID: -</p>
          </div>
        </div>
        <button onclick="closeWebhookModal()" aria-label="Chiudi finestra" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1" data-i18n="webhook.urlLabel">URL Webhook (con Token)</label>
          <div class="flex flex-col sm:flex-row gap-2">
            <input type="text" id="webhook-modal-url" readonly class="flex-1 bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-xs text-violet-700 font-mono select-all focus:outline-none">
            <button onclick="copyWebhookUrl()" class="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white border border-transparent rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <i class="fa-solid fa-copy"></i> <span data-i18n="webhook.copyUrl">Copia URL</span>
            </button>
          </div>
        </div>

        <div>
          <label class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1" data-i18n="webhook.tokenLabel">Token Segreto di Autorizzazione</label>
          <div class="flex flex-col sm:flex-row gap-2">
            <input type="text" id="webhook-modal-token" readonly class="flex-1 bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-xs text-slate-700 font-mono select-all focus:outline-none">
            <button onclick="rotateWebhookToken()" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-200 text-slate-600 border border-darkborder rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <i class="fa-solid fa-arrows-rotate"></i> <span data-i18n="webhook.rotateToken">Rigenera</span>
            </button>
          </div>
        </div>

        <div>
          <label for="webhook-modal-secret" class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1" data-i18n="webhook.secretLabel">Segreto Condiviso HMAC (opzionale per GitHub)</label>
          <input type="text" id="webhook-modal-secret" placeholder="opzionale (es. my_shared_secret)" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-xs text-slate-700 font-mono focus:outline-none focus:border-violet-500">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="webhook-modal-ratelimit" class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1" data-i18n="webhook.rateLimit">Cooldown anti-spam (s)</label>
            <input type="number" id="webhook-modal-ratelimit" min="1" max="86400" value="5" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-xs text-slate-700 font-mono focus:outline-none focus:border-violet-500">
          </div>
          <div class="flex items-center space-x-2 pt-4">
            <input type="checkbox" id="webhook-modal-payload" checked class="w-4 h-4 rounded text-violet-600 bg-slate-100 border-slate-300 cursor-pointer">
            <label for="webhook-modal-payload" class="text-[11px] text-slate-600 cursor-pointer" data-i18n="webhook.passPayload">Inietta payload in memoria</label>
          </div>
        </div>

        <div>
          <label class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">Snippet cURL di Test</label>
          <div class="relative">
            <pre id="webhook-modal-curl" class="bg-slate-100 border border-darkborder rounded-lg p-2.5 text-[10px] text-emerald-700 font-mono overflow-x-auto whitespace-pre-wrap select-all"></pre>
            <button onclick="copyWebhookCurl()" aria-label="Copia comando cURL" data-tooltip="tt.webhookBtn" title="Copia comando cURL" class="absolute top-2 right-2 px-2 py-1 bg-slate-200 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-mono border border-darkborder cursor-pointer">
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-darkborder">
        <div class="flex flex-wrap gap-2">
          <button type="button" id="webhook-test-btn" onclick="testWebhookTrigger()" class="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <i class="fa-solid fa-paper-plane"></i> <span data-i18n="webhook.testBtn">Test Trigger</span>
          </button>
          <button type="button" onclick="disableWebhook()" class="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <i class="fa-solid fa-ban"></i> <span data-i18n="webhook.disableBtn">Disattiva</span>
          </button>
        </div>
        <div class="flex gap-2">
          <button type="button" onclick="closeWebhookModal()" class="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-medium">Annulla</button>
          <button type="button" onclick="saveWebhookSettings()" class="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 cursor-pointer" data-i18n="webhook.saveBtn">Salva</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal: Concurrency Manager & Priority Queue -->
  <div id="queue-modal" role="dialog" aria-modal="true" aria-labelledby="queue-modal-title" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-2xl w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <div>
          <h3 id="queue-modal-title" class="text-base font-bold text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-layer-group text-amber-600"></i>
            <span data-i18n="queue.modalTitle">Concorrenza & Coda di Priorità</span>
          </h3>
          <p class="text-xs text-slate-500" data-i18n="queue.concurrencyHelp">Numero massimo di job eseguiti contemporaneamente (1-10)</p>
        </div>
        <button onclick="closeQueueModal()" aria-label="Chiudi finestra modale" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Settings Controls: Max Concurrency -->
      <div class="bg-slate-100/70 border border-darkborder rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div>
            <h4 class="text-xs font-bold text-slate-900" data-i18n="queue.concurrencyTitle">Limite Concorrenza (Max Workers)</h4>
            <p class="text-[11px] text-slate-500" id="queue-concurrency-status-sub">2 worker paralleli attivi</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <input type="number" id="queue-max-workers" min="1" max="10" value="2" class="w-16 bg-slate-100 border border-darkborder rounded-lg px-2.5 py-1.5 text-xs text-center text-slate-900 font-bold focus:outline-none focus:border-amber-500">
          <button onclick="saveConcurrencySettings()" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer" data-i18n="queue.saveSettings">Salva</button>
        </div>
      </div>

      <!-- Scrollable lists: Running and Queued -->
      <div class="overflow-y-auto flex-1 space-y-4 pr-1 text-xs">
        <!-- Active running jobs -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
              <span data-i18n="queue.activeTitle">Job Attivi in Esecuzione</span>
              <span id="queue-running-count" class="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-700 font-mono">0</span>
            </h4>
          </div>
          <div id="queue-running-list" class="space-y-2">
            <!-- populated by JS -->
          </div>
        </div>

        <!-- Waiting Queue -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span data-i18n="queue.queuedTitle">Job in Coda d'Attesa</span>
              <span id="queue-waiting-count" class="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-800 font-mono">0</span>
            </h4>
            <button onclick="clearQueue()" id="queue-clear-btn" class="text-[11px] text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer">
              <i class="fa-solid fa-trash-can text-[10px]"></i> <span data-i18n="queue.clearBtn">Svuota Coda</span>
            </button>
          </div>
          <div id="queue-waiting-list" class="space-y-2">
            <!-- populated by JS -->
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 mt-4 border-t border-darkborder">
        <button onclick="refreshQueueModal()" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
          <i class="fa-solid fa-arrows-rotate text-[10px]"></i> Aggiorna
        </button>
        <button onclick="closeQueueModal()" class="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer">Chiudi</button>
      </div>
    </div>
  </div>

  <!-- Modal: Dead Letter Queue (DLQ) & Quarantine -->
  <div id="dlq-modal" role="dialog" aria-modal="true" aria-labelledby="dlq-modal-title" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-3xl w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <div>
          <h3 id="dlq-modal-title" class="text-base font-bold text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-rose-600"></i>
            <span data-i18n="dlq.modalTitle">Dead Letter Queue & Quarantena</span>
          </h3>
          <p class="text-xs text-slate-500" data-i18n="dlq.subtitle">Job bloccati per troppi fallimenti consecutivi. Esegui canary run o rimuovi la quarantena.</p>
        </div>
        <button onclick="closeDlqModal()" aria-label="Chiudi finestra modale" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Action bar -->
      <div class="flex items-center justify-between mb-3 text-xs">
        <span id="dlq-count-label" class="text-slate-500">0 job in quarantena</span>
        <button onclick="clearAllDlq()" id="dlq-clear-all-btn" class="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer">
          <i class="fa-solid fa-trash-can text-[10px]"></i> <span data-i18n="dlq.clearAllBtn">Svuota DLQ</span>
        </button>
      </div>

      <!-- Scrollable list of quarantined entries -->
      <div class="overflow-y-auto flex-1 space-y-3 pr-1 text-xs" id="dlq-entries-list">
        <!-- Populated by JS -->
      </div>

      <div class="flex items-center justify-between pt-4 mt-4 border-t border-darkborder">
        <button onclick="refreshDlqModal()" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
          <i class="fa-solid fa-arrows-rotate text-[10px]"></i> Aggiorna
        </button>
        <button onclick="closeDlqModal()" class="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer">Chiudi</button>
      </div>
    </div>
  <!-- ============================================== -->
  <!-- MODAL: TEMPLATES & BLUEPRINT ENGINE            -->
  <!-- ============================================== -->
  <div id="templates-modal" role="dialog" aria-modal="true" aria-labelledby="templates-modal-title" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-3xl w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
            <i class="fa-solid fa-layer-group text-sm"></i>
          </div>
          <div>
            <h3 id="templates-modal-title" class="text-base font-bold text-slate-900" data-i18n="templates.modalTitle">Libreria Blueprint & Template</h3>
            <p class="text-[11px] text-slate-500" data-i18n="templates.subtitle">Job preconfigurati e pronti all'attivazione con un clic</p>
          </div>
        </div>
        <button onclick="closeTemplatesModal()" aria-label="Chiudi finestra" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="space-y-3 flex-1 overflow-y-auto pr-1">
        <div class="relative">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
          <input type="text" id="template-search-input" oninput="filterTemplates(this.value)" placeholder="Cerca template per titolo, categoria o tag..." class="w-full bg-slate-100 border border-darkborder rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500">
        </div>
        <div id="templates-list-container" class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <!-- Populated by JS -->
        </div>
      </div>

      <div class="flex items-center justify-end pt-4 mt-3 border-t border-darkborder">
        <button type="button" onclick="closeTemplatesModal()" class="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-semibold">Chiudi</button>
      </div>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- MODAL: SNAPSHOT & BACKUP / RESTORE             -->
  <!-- ============================================== -->
  <div id="backup-modal" role="dialog" aria-modal="true" aria-labelledby="backup-modal-title" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-2xl w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <i class="fa-solid fa-box-archive text-sm"></i>
          </div>
          <div>
            <h3 id="backup-modal-title" class="text-base font-bold text-slate-900" data-i18n="backup.modalTitle">Snapshot & Backup / Ripristino</h3>
            <p class="text-[11px] text-slate-500" data-i18n="backup.subtitle">Punti di ripristino per job e memorie persistenti</p>
          </div>
        </div>
        <button onclick="closeBackupModal()" aria-label="Chiudi finestra" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-slate-500" data-i18n="backup.snapshotList">Snapshot archiviati</span>
        <button type="button" onclick="createBackupSnapshot()" id="btn-create-snapshot" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer">
          <i class="fa-solid fa-camera text-[10px]"></i> <span data-i18n="backup.createBtn">Crea Snapshot Ora</span>
        </button>
      </div>

      <div id="backup-list-container" class="space-y-2 flex-1 overflow-y-auto pr-1 text-xs">
        <!-- Populated by JS -->
      </div>

      <div class="flex items-center justify-between pt-4 mt-3 border-t border-darkborder">
        <button type="button" onclick="refreshBackupModal()" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors">
          <i class="fa-solid fa-arrows-rotate text-[10px]"></i> Aggiorna
        </button>
        <button type="button" onclick="closeBackupModal()" class="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-semibold">Chiudi</button>
      </div>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- MODAL: EXECUTION METRICS & PROMETHEUS          -->
  <!-- ============================================== -->
  <div id="metrics-modal" role="dialog" aria-modal="true" aria-labelledby="metrics-modal-title" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-2xl w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600">
            <i class="fa-solid fa-chart-line text-sm"></i>
          </div>
          <div>
            <h3 id="metrics-modal-title" class="text-base font-bold text-slate-900" data-i18n="metrics.modalTitle">Metriche & Prometheus Exporter</h3>
            <p class="text-[11px] text-slate-500" data-i18n="metrics.subtitle">Statistiche aggregate di esecuzione, latenza e scrape endpoint</p>
          </div>
        </div>
        <button onclick="closeMetricsModal()" aria-label="Chiudi finestra" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Metrics KPI Band -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div class="bg-slate-100 p-3 rounded-xl border border-darkborder text-center">
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Esecuzioni Totali</span>
          <span id="metric-total-runs" class="text-lg font-bold font-mono text-slate-900 mt-0.5 block">0</span>
        </div>
        <div class="bg-slate-100 p-3 rounded-xl border border-darkborder text-center">
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Success Rate</span>
          <span id="metric-success-rate" class="text-lg font-bold font-mono text-emerald-600 mt-0.5 block">100%</span>
        </div>
        <div class="bg-slate-100 p-3 rounded-xl border border-darkborder text-center">
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Latenza Media</span>
          <span id="metric-avg-latency" class="text-lg font-bold font-mono text-cyan-600 mt-0.5 block">0ms</span>
        </div>
        <div class="bg-slate-100 p-3 rounded-xl border border-darkborder text-center">
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Latenza P95</span>
          <span id="metric-p95-latency" class="text-lg font-bold font-mono text-indigo-600 mt-0.5 block">0ms</span>
        </div>
      </div>

      <!-- Prometheus Scrape Endpoint -->
      <div class="bg-slate-100 p-3.5 rounded-xl border border-darkborder mb-3">
        <label class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">Scrape Endpoint Prometheus (OpenMetrics)</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <input type="text" id="metrics-prometheus-url" readonly value="/api/metrics/prometheus" class="flex-1 bg-white border border-darkborder rounded-lg px-3 py-1.5 text-xs text-cyan-700 font-mono select-all focus:outline-none">
          <button type="button" onclick="copyPrometheusScrapeUrl()" class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer">
            <i class="fa-solid fa-copy"></i> Copia URL
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end pt-3 border-t border-darkborder">
        <button type="button" onclick="closeMetricsModal()" class="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-semibold">Chiudi</button>
      </div>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- MODAL: NOTIFICATIONS & ALERTING                -->
  <!-- ============================================== -->
  <div id="notifications-modal" role="dialog" aria-modal="true" aria-labelledby="notifications-modal-title" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-darkcard border border-darkborder rounded-2xl max-w-xl w-full my-4 p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-darkborder mb-4">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <i class="fa-solid fa-bell text-sm"></i>
          </div>
          <div>
            <h3 id="notifications-modal-title" class="text-base font-bold text-slate-900" data-i18n="notify.modalTitle">Notifiche & Alerting Multi-Canale</h3>
            <p class="text-[11px] text-slate-500" data-i18n="notify.subtitle">Avvisi automatici su errore verso Slack, Discord o Webhook</p>
          </div>
        </div>
        <button onclick="closeNotificationsModal()" aria-label="Chiudi finestra" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form id="notifications-form" onsubmit="handleNotificationSettingsSubmit(event)" class="space-y-3 text-xs">
        <div>
          <label for="form-notify-slack" class="block font-medium text-slate-600 mb-1" data-i18n="notify.slackWebhook">Slack Incoming Webhook URL</label>
          <input type="url" id="form-notify-slack" placeholder="https://hooks.slack.com/services/..." class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500">
        </div>

        <div>
          <label for="form-notify-discord" class="block font-medium text-slate-600 mb-1" data-i18n="notify.discordWebhook">Discord Webhook URL</label>
          <input type="url" id="form-notify-discord" placeholder="https://discord.com/api/webhooks/..." class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500">
        </div>

        <div>
          <label for="form-notify-custom" class="block font-medium text-slate-600 mb-1" data-i18n="notify.genericWebhook">Webhook HTTP Personalizzato</label>
          <input type="url" id="form-notify-custom" placeholder="https://my-service.com/api/cron-alerts" class="w-full bg-slate-100 border border-darkborder rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500">
        </div>

        <div class="p-3 bg-slate-100 rounded-xl border border-darkborder space-y-2">
          <span class="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Regole di Invio Notifiche</span>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="form-notify-on-failure" checked class="w-4 h-4 rounded text-amber-600 bg-white border-slate-300 cursor-pointer">
            <label for="form-notify-on-failure" class="text-xs text-slate-700 cursor-pointer" data-i18n="notify.onFailure">Invia notifica su fallimento esecuzione</label>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="form-notify-on-quarantine" checked class="w-4 h-4 rounded text-amber-600 bg-white border-slate-300 cursor-pointer">
            <label for="form-notify-on-quarantine" class="text-xs text-slate-700 cursor-pointer" data-i18n="notify.onQuarantine">Invia notifica su quarantena DLQ e circuit breaker aperto</label>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="form-notify-on-recovery" checked class="w-4 h-4 rounded text-amber-600 bg-white border-slate-300 cursor-pointer">
            <label for="form-notify-on-recovery" class="text-xs text-slate-700 cursor-pointer" data-i18n="notify.onRecovery">Invia notifica su ripristino automatico job</label>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 mt-3 border-t border-darkborder">
          <button type="button" onclick="sendTestNotificationPing()" id="btn-test-notification" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-darkborder rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <i class="fa-solid fa-paper-plane text-[10px]"></i> <span data-i18n="notify.testBtn">Invia Test Ping</span>
          </button>
          <div class="flex gap-2">
            <button type="button" onclick="closeNotificationsModal()" class="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-medium">Annulla</button>
            <button type="submit" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer">Salva Notifiche</button>
          </div>
        </div>
      </form>
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
        el.setAttribute('aria-selected', 'false');
      });

      const activeView = document.getElementById('view-' + tab);
      const activeBtn = document.getElementById('tab-btn-' + tab);
      if (activeView) activeView.classList.remove('hidden');
      if (activeBtn) {
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
        document.getElementById('current-dir').textContent = data.directory || '-';
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
        refreshQueueBadge().catch(() => {});
        refreshDlqBadge().catch(() => {});
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.loadJobsError') : 'Errore nel caricamento dei job: ') + err.message, 'error');
      }
    }

    let activeFilterTag = '';

    function filterByTag(tag) {
      if (activeFilterTag === tag) {
        activeFilterTag = '';
      } else {
        activeFilterTag = tag;
      }
      renderJobs();
    }

    function clearJobSearch() {
      const searchInput = document.getElementById('job-filter-search');
      if (searchInput) searchInput.value = '';
      const clearBtn = document.getElementById('job-filter-search-clear');
      if (clearBtn) clearBtn.classList.add('hidden');
      activeFilterTag = '';
      renderJobs();
    }

    function applyJobFilters() {
      renderJobs();
    }

    function renderJobs() {
      const container = document.getElementById('jobs-container');
      const totalCountEl = document.getElementById('job-total-count');
      const filteredCountEl = document.getElementById('job-filtered-count');
      const searchInput = document.getElementById('job-filter-search');
      const searchClearBtn = document.getElementById('job-filter-search-clear');
      const categorySelect = document.getElementById('job-filter-category');
      const statusSelect = document.getElementById('job-filter-status');
      const tagsStrip = document.getElementById('job-tags-strip');

      // Update global KPI stats against ALL currentJobs (independent of active filters)
      let globalActiveCount = 0;
      let globalTotalRuns = 0;
      let earliestNext = null;
      currentJobs.forEach(job => {
        const isMaxed = job.maxRuns > 0 && job.runCount >= job.maxRuns;
        if (job.enabled && !isMaxed) globalActiveCount++;
        globalTotalRuns += (job.runCount || 0);
        if (job.enabled && !isMaxed && job.nextRunAt) {
          const ts = new Date(job.nextRunAt).getTime();
          if (!earliestNext || ts < earliestNext) earliestNext = ts;
        }
      });
      const statActiveEl = document.getElementById('stat-active');
      if (statActiveEl) statActiveEl.textContent = String(globalActiveCount);
      const statRunsEl = document.getElementById('stat-runs');
      if (statRunsEl) statRunsEl.textContent = String(globalTotalRuns);
      const statNextEl = document.getElementById('stat-next-tick');
      if (statNextEl) {
        statNextEl.textContent = earliestNext ? new Date(earliestNext).toLocaleTimeString() : '-';
      }

      // Dynamically populate category dropdown options from currentJobs
      if (categorySelect) {
        const selectedCat = categorySelect.value || 'all';
        const uniqueCategories = new Set(['all']);
        currentJobs.forEach(j => {
          if (j.category && j.category.trim()) uniqueCategories.add(j.category.trim().toLowerCase());
        });
        const currentOptions = Array.from(categorySelect.options).map(o => o.value);
        const needsUpdate = Array.from(uniqueCategories).some(c => !currentOptions.includes(c));
        if (needsUpdate) {
          categorySelect.innerHTML = '<option value="all">Tutte le categorie</option>' +
            Array.from(uniqueCategories).filter(c => c !== 'all').map(c => \`<option value="\${escapeHtml(c)}">\${escapeHtml(c.charAt(0).toUpperCase() + c.slice(1))}</option>\`).join('');
          categorySelect.value = selectedCat;
        }
      }

      const searchQuery = (searchInput?.value || '').toLowerCase().trim();
      if (searchClearBtn) {
        if (searchQuery) searchClearBtn.classList.remove('hidden');
        else searchClearBtn.classList.add('hidden');
      }
      const categoryFilter = categorySelect?.value || 'all';
      const statusFilter = statusSelect?.value || 'all';

      if (totalCountEl) totalCountEl.textContent = String(currentJobs.length);

      // Collect all unique tags for tags strip
      const allTags = new Set();
      currentJobs.forEach(j => {
        if (Array.isArray(j.tags)) j.tags.forEach(t => allTags.add(t));
      });
      if (tagsStrip) {
        if (allTags.size === 0) {
          tagsStrip.innerHTML = '<span class="text-slate-600 font-medium italic text-[11px]">Nessun tag configurato</span>';
        } else {
          tagsStrip.innerHTML = Array.from(allTags).map(tag => {
            const isSelected = activeFilterTag === tag;
            const safeTag = escapeHtml(tag);
            return \`<button type="button" onclick="filterByTag('\${safeTag}')" class="px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors cursor-pointer \${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-darkborder'}">#\${safeTag}</button>\`;
          }).join(' ');
        }
      }

      // Filter jobs
      const filteredJobs = currentJobs.filter(job => {
        if (categoryFilter !== 'all' && (job.category || 'general').toLowerCase() !== categoryFilter.toLowerCase()) return false;
        if (statusFilter === 'enabled' && !job.enabled) return false;
        if (statusFilter === 'disabled' && job.enabled) return false;
        if (statusFilter === 'quarantined' && (!job.circuitBreaker || job.circuitBreaker.state === 'closed')) return false;
        if (activeFilterTag && (!Array.isArray(job.tags) || !job.tags.includes(activeFilterTag))) return false;
        if (searchQuery) {
          const matchTitle = (job.title || '').toLowerCase().includes(searchQuery);
          const matchId = (job.id || '').toLowerCase().includes(searchQuery);
          const matchCategory = (job.category || '').toLowerCase().includes(searchQuery);
          const matchTags = Array.isArray(job.tags) && job.tags.some(t => t.toLowerCase().includes(searchQuery));
          if (!matchTitle && !matchId && !matchCategory && !matchTags) return false;
        }
        return true;
      });

      if (filteredCountEl) filteredCountEl.textContent = String(filteredJobs.length);

      if (!filteredJobs.length) {
        const isFiltered = currentJobs.length > 0;
        container.innerHTML = '<div class="col-span-full py-16 text-center text-gray-500 bg-darkcard/50 rounded-2xl border border-dashed border-darkborder">' +
          '<i class="fa-solid fa-filter-circle-xmark text-3xl mb-3 text-slate-400"></i>' +
          '<p class="text-sm font-semibold text-slate-700">' + (isFiltered ? 'Nessun job corrisponde ai filtri attivi' : escapeHtml(t('jobs.emptyTitle'))) + '</p>' +
          '<p class="text-xs text-slate-500 mt-1">' + (isFiltered ? 'Prova a modificare i termini di ricerca o la categoria selezionata.' : escapeHtml(t('jobs.emptyDesc'))) + '</p>' +
          (isFiltered ? '<button type="button" onclick="clearJobSearch()" class="mt-3 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"><i class="fa-solid fa-rotate-left mr-1"></i> Resetta Filtri</button>' : '') +
        '</div>';
        return;
      }

      container.innerHTML = filteredJobs.map(job => {
        const isMaxed = job.maxRuns > 0 && job.runCount >= job.maxRuns;
        if (job.enabled && !isMaxed) activeCount++;
        totalRuns += (job.runCount || 0);
        if (job.enabled && !isMaxed && job.nextRunAt) {
          const ts = new Date(job.nextRunAt).getTime();
          if (!earliestNext || ts < earliestNext) earliestNext = ts;
        }

        const statusBadge = isMaxed
          ? \`<span data-tooltip="tt.maxRunsBadge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">🏁 \${escapeHtml(t('job.completed'))} (\${job.runCount}/\${job.maxRuns})</span>\`
          : job.enabled
            ? \`<span data-tooltip="tt.kpiActive" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>\${escapeHtml(t('job.active'))}</span>\`
            : \`<span data-tooltip="tt.toggleBtn" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-500">\${escapeHtml(t('job.paused'))}</span>\`;

        let adaptiveBadge = '';
        if (job.adaptive && job.adaptive.enabled) {
          const isForcedBurst = job.adaptive.activeUntil && new Date(job.adaptive.activeUntil).getTime() > Date.now();
          const isBurst = job.adaptive.currentCadence === 'burst' || isForcedBurst;
          const isIdle = job.adaptive.currentCadence === 'idle' && !isBurst;
          if (isBurst) {
            adaptiveBadge = \`<span data-tooltip="tt.burstBtn" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/30 flex items-center gap-1 animate-pulse"><i class="fa-solid fa-bolt text-amber-600"></i> \${escapeHtml(t('job.burstActive'))} (\${formatInterval(job.adaptive.burstEveryMs)})</span>\`;
          } else if (isIdle) {
            adaptiveBadge = \`<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"><i class="fa-solid fa-moon text-indigo-600"></i> \${escapeHtml(t('job.idleActive'))} (\${formatInterval(job.adaptive.idleEveryMs)})</span>\`;
          } else {
            adaptiveBadge = \`<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-700 border border-indigo-500/20 flex items-center gap-1"><i class="fa-solid fa-gauge text-indigo-600"></i> \${escapeHtml(t('job.adaptiveBadge'))}</span>\`;
          }
        }

        let pipelineBadge = '';
        if (job.pipeline && job.pipeline.enabled) {
          const okCount = job.pipeline.onSuccess ? job.pipeline.onSuccess.length : 0;
          pipelineBadge = \`<span data-tooltip="tt.pipelineBtn" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-700 border border-cyan-500/20 flex items-center gap-1"><i class="fa-solid fa-diagram-project text-cyan-700"></i> \${escapeHtml(t('job.pipelineBadge'))}\${okCount > 0 ? ' [' + okCount + '→]' : ''}</span>\`;
        }

        let webhookBadge = '';
        if (job.webhook && job.webhook.enabled) {
          webhookBadge = \`<button onclick="openWebhookModal(this.dataset.jobId)" data-job-id="\${escapeHtml(job.id)}" data-tooltip="tt.webhookBtn" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 border border-violet-500/20 flex items-center gap-1 cursor-pointer"><i class="fa-solid fa-satellite-dish text-violet-600"></i> \${escapeHtml(t('job.webhookBadge'))}</button>\`;
        }

        let circuitBadge = '';
        if (job.circuitBreaker) {
          if (job.circuitBreaker.state === 'open') {
            circuitBadge = \`<button onclick="openDlqModal()" data-tooltip="tt.circuitOpen" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-700 border border-rose-500/40 flex items-center gap-1 animate-pulse cursor-pointer"><i class="fa-solid fa-triangle-exclamation text-rose-600"></i> \${escapeHtml(t('circuit.open'))}</button>\`;
          } else if (job.circuitBreaker.state === 'half-open') {
            circuitBadge = \`<button onclick="openDlqModal()" data-tooltip="tt.circuitHalfOpen" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/40 flex items-center gap-1 cursor-pointer"><i class="fa-solid fa-flask text-amber-600"></i> \${escapeHtml(t('circuit.halfOpen'))}</button>\`;
          }
        }

        const prio = job.priority || 'normal';
        const priorityBadge = prio === 'high'
          ? \`<span data-tooltip="tt.priorityHigh" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30 flex items-center gap-1"><i class="fa-solid fa-fire text-rose-600"></i> \${escapeHtml(t('priority.high'))}</span>\`
          : prio === 'low'
            ? \`<span data-tooltip="tt.priorityLow" class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-500 border border-slate-300 flex items-center gap-1"><i class="fa-solid fa-bed text-slate-500"></i> \${escapeHtml(t('priority.low'))}</span>\`
            : \`<span data-tooltip="tt.priorityNormal" class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center gap-1"><i class="fa-solid fa-bolt text-blue-600"></i> \${escapeHtml(t('priority.normal'))}</span>\`;

        const categoryBadge = job.category
          ? \`<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1"><i class="fa-solid fa-folder text-[9px] text-slate-500"></i> \${escapeHtml(job.category)}</span>\`
          : '';

        const guardBadge = (job.guard && (job.guard.command || job.guard.httpUrl))
          ? \`<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center gap-1"><i class="fa-solid fa-shield-halved text-[9px] text-emerald-600"></i> Guard</span>\`
          : '';

        const timeoutBadge = job.timeoutMs
          ? \`<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-darkborder flex items-center gap-1"><i class="fa-solid fa-stopwatch text-[9px] text-slate-500"></i> \${Math.round(job.timeoutMs / 1000)}s</span>\`
          : '';

        const tagsPills = (Array.isArray(job.tags) && job.tags.length > 0)
          ? job.tags.map(tag => \`<span onclick="filterByTag('\${escapeHtml(tag)}')" class="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600 hover:text-slate-900 border border-darkborder cursor-pointer transition-colors">#\${escapeHtml(tag)}</span>\`).join(' ')
          : '';

        const tzBadge = job.schedule?.timezone
          ? \`<span class="text-slate-500 font-mono text-[9px]">(\${escapeHtml(job.schedule.timezone)})</span>\`
          : '';

        const schedDesc = job.schedule.kind === 'interval'
          ? formatInterval(job.schedule.everyMs)
          : 'Cron: ' + escapeHtml(job.schedule.cron || '');

        const safeId = escapeHtml(job.id);
        const safeTitle = escapeHtml(job.title);
        const safePrompt = escapeHtml(job.followupPrompt);
        const safeSession = escapeHtml(job.sessionID);

        return \`
          <div class="oc-job min-w-0 flex flex-col justify-between">
            <div class="min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="oc-job-dot \${job.enabled ? 'bg-emerald-500 pulse-dot' : 'bg-slate-300'}" aria-hidden="true"></span>
                    <h3 class="text-sm font-bold text-slate-900 tracking-tight">\${safeTitle}</h3>
                    \${statusBadge}
                    \${circuitBadge}
                    \${priorityBadge}
                    \${categoryBadge}
                    \${guardBadge}
                    \${timeoutBadge}
                    \${adaptiveBadge}
                    \${pipelineBadge}
                    \${webhookBadge}
                  </div>
                  <p class="text-[11px] font-mono text-indigo-600 mt-1">\${safeId}</p>
                  \${tagsPills ? \`<div class="flex flex-wrap gap-1 mt-1.5">\${tagsPills}</div>\` : ''}
                </div>
                <div class="oc-scrollrow no-scrollbar flex items-center gap-1.5 pb-0.5 shrink-0">
                  <button id="webhook-btn-\${safeId}" data-job-id="\${safeId}" onclick="openWebhookModal(this.dataset.jobId)" data-tooltip="tt.webhookBtn" aria-label="\${escapeHtml(t('job.webhookBtn'))}" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded-lg transition-colors border border-violet-200/60 cursor-pointer">
                    <i class="fa-solid fa-satellite-dish text-xs"></i>
                  </button>
                  \${job.adaptive && job.adaptive.enabled ? \`
                  <button id="burst-btn-\${safeId}" data-job-id="\${safeId}" onclick="triggerBurstNow(this.dataset.jobId)" data-tooltip="tt.burstBtn" aria-label="\${escapeHtml(t('job.burstTitle'))}" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200/60 cursor-pointer">
                    <i class="fa-solid fa-bolt-lightning text-xs"></i>
                  </button>
                  \` : ''}
                  <button id="run-btn-\${safeId}" data-job-id="\${safeId}" onclick="triggerRunNow(this.dataset.jobId)" data-tooltip="tt.runNowBtn" aria-label="\${escapeHtml(t('job.runNowTitle'))}" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200/60 cursor-pointer">
                    <i class="fa-solid fa-bolt text-xs"></i>
                  </button>
                  <button data-job-id="\${safeId}" data-enabled="\${!job.enabled}" onclick="toggleJob(this.dataset.jobId, this.dataset.enabled === 'true')" data-tooltip="tt.toggleBtn" aria-label="\${escapeHtml(job.enabled ? t('job.pauseTitle') : t('job.resumeTitle'))}" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer">
                    <i class="fa-solid \${job.enabled ? 'fa-pause' : 'fa-play'} text-xs"></i>
                  </button>
                  <button data-job-id="\${safeId}" onclick="editJob(this.dataset.jobId)" aria-label="\${escapeHtml(t('job.editBtn'))}" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer">
                    <i class="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button data-job-id="\${safeId}" onclick="deleteJob(this.dataset.jobId)" data-tooltip="tt.deleteBtn" aria-label="\${escapeHtml(t('job.deleteTitle'))}" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/60 cursor-pointer">
                    <i class="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-2 text-[11px] bg-slate-100/70 p-3 rounded-xl border border-darkborder">
                <div><span class="text-gray-500">\${escapeHtml(t('job.schedule'))}:</span> <span class="text-slate-700 font-medium">\${schedDesc} \${tzBadge}</span></div>
                <div><span class="text-gray-500">\${escapeHtml(t('job.executions'))}:</span> <span class="text-slate-700 font-medium font-mono">\${job.runCount}\${job.maxRuns ? '/' + job.maxRuns : ''}</span></div>
                <div><span class="text-gray-500">\${escapeHtml(t('job.lastRun'))}:</span> <span class="text-slate-700 font-mono">\${job.lastRunAt ? new Date(job.lastRunAt).toLocaleTimeString() : '-'}</span></div>
                <div><span class="text-gray-500">\${escapeHtml(t('job.nextRun'))}:</span> <span class="\${isMaxed ? 'text-amber-600' : 'text-emerald-700'} font-mono">\${(job.enabled && !isMaxed && job.nextRunAt) ? new Date(job.nextRunAt).toLocaleTimeString() : (isMaxed ? escapeHtml(t('job.completed')) : '-')}</span></div>
                \${job.adaptive && job.adaptive.enabled ? \`
                <div class="col-span-2 pt-1 border-t border-darkborder/50 text-[10px] text-slate-500 flex items-center justify-between">
                  <span><i class="fa-solid fa-gauge-high text-indigo-600 mr-1"></i>\${escapeHtml(t('job.cadence'))}: <strong class="text-slate-700">\${job.adaptive.currentCadence}</strong> (quiet: \${job.adaptive.consecutiveQuietTicks ?? 0}/\${job.adaptive.quietThreshold ?? 3})</span>
                  <span>burst: <strong class="text-amber-700">\${formatInterval(job.adaptive.burstEveryMs)}</strong> | idle: <strong class="text-indigo-700">\${formatInterval(job.adaptive.idleEveryMs)}</strong></span>
                </div>
                \` : ''}
                \${job.pipeline && job.pipeline.enabled ? \`
                <div class="col-span-2 pt-1 border-t border-darkborder/50 text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <i class="fa-solid fa-diagram-project text-cyan-700"></i>
                    <span class="text-cyan-800 font-medium">\${escapeHtml(t('job.pipelineBadge'))}:</span>
                    \${(job.pipeline.onSuccess && job.pipeline.onSuccess.length > 0) ? \`
                      <span class="text-emerald-700 font-mono"><strong class="text-slate-500">\${escapeHtml(t('job.pipelineOk'))}</strong> \${escapeHtml(job.pipeline.onSuccess.join(', '))}</span>
                    \` : ''}
                    \${(job.pipeline.onFailure && job.pipeline.onFailure.length > 0) ? \`
                      <span class="text-rose-600 font-mono"><strong class="text-slate-500">\${escapeHtml(t('job.pipelineErr'))}</strong> \${escapeHtml(job.pipeline.onFailure.join(', '))}</span>
                    \` : ''}
                  </div>
                  \${job.pipeline.passPayload ? \`<span class="text-indigo-700 font-mono text-[9px] bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">📦 payload</span>\` : ''}
                </div>
                \` : ''}
                \${job.webhook && job.webhook.enabled ? \`
                <div class="col-span-2 pt-1 border-t border-darkborder/50 text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <i class="fa-solid fa-satellite-dish text-violet-600"></i>
                    <span class="text-violet-700 font-medium">\${escapeHtml(t('job.webhookBadge'))}:</span>
                    <span class="text-violet-600 font-mono">/api/webhook/\${safeId}</span>
                    <span class="text-violet-700 font-mono text-[9px] bg-violet-100/70 px-1.5 py-0.5 rounded border border-violet-200">cooldown: \${job.webhook.rateLimitSeconds ?? 5}s</span>
                  </div>
                  \${job.webhook.lastTriggeredAt ? \`<span class="text-slate-500 font-mono text-[9px]">last: \${new Date(job.webhook.lastTriggeredAt).toLocaleTimeString()}</span>\` : '<span class="text-slate-500 italic text-[9px]">in attesa</span>'}
                </div>
                \` : ''}
              </div>

              <div class="mt-3 text-[11px] text-slate-500 line-clamp-2 italic bg-slate-100/40 p-2 rounded-lg border border-darkborder/50">
                "\${safePrompt}"
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-darkborder/70 flex items-center justify-between text-[11px] text-gray-500">
              <span class="truncate max-w-[220px] text-slate-600 font-medium" data-tooltip-raw="Session ID: \${safeSession}">
                <i class="fa-solid fa-comment-dots text-indigo-600 mr-1.5"></i>\${(() => {
                  const matchedSes = currentSessions.find(s => s.id === job.sessionID);
                  return matchedSes && matchedSes.title ? escapeHtml(matchedSes.title) : safeSession;
                })()}
              </span>
              <button data-session-id="\${safeSession}" onclick="jumpToChat(this.dataset.sessionId)" data-tooltip="tt.tabChat" class="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer">
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
        : '-';
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
        const id = pendingDeleteJobId;
        closeConfirmModal();
        if (id) executeDeleteJob(id);
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
      if (!ts) return '-';
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
          btn.classList.add('bg-[#101828]', 'text-white', 'font-semibold');
        } else {
          btn.classList.remove('bg-[#101828]', 'text-white', 'font-semibold');
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
            <p class="text-xs font-semibold text-slate-500">Nessuna sessione trovata</p>
            <p class="text-[11px] text-gray-600 mt-0.5">Prova a cambiare filtri o disattivare "Solo Questo Repo"</p>
            <button type="button" onclick="clearSessionSearch(); setSessionFilter('all'); const chk=document.getElementById('session-filter-curdir-only'); if(chk) chk.checked=false; renderSessionList();" class="mt-3 px-2.5 py-1 text-[11px] bg-slate-200 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer">
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
          ? 'border-indigo-500 bg-indigo-100/70 ring-1 ring-indigo-500/50'
          : 'border-darkborder/50 hover:border-slate-300 bg-slate-100/40 hover:bg-slate-100/90';

        if (s.hasCron) {
          const jobTitles = (s.cronJobs || []).map(j => escapeHtml(j.title)).join(', ');
          typeBadge = \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-700 border border-purple-500/30 shrink-0">
              <i class="fa-solid fa-bolt text-[9px] text-purple-600"></i> Cron: \${jobTitles}
            </span>
          \`;
          if (isSelected) borderClass = 'border-purple-500 bg-purple-100/70 ring-1 ring-purple-500/50';
        } else if (s.isRoot) {
          typeBadge = \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-700 border border-sky-500/30 shrink-0">
              <i class="fa-solid fa-comments text-[9px] text-sky-600"></i> Principale (Root)
            </span>
          \`;
          if (isSelected) borderClass = 'border-sky-500 bg-sky-100/70 ring-1 ring-sky-500/50';
        } else if (s.isSubagent) {
          typeBadge = \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-700/90 border border-amber-500/20 shrink-0">
              <i class="fa-solid fa-robot text-[9px] text-amber-600"></i> Sub-agente
            </span>
          \`;
          if (isSelected) borderClass = 'border-amber-500 bg-amber-100/70 ring-1 ring-amber-500/50';
        } else {
          typeBadge = \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-500 border border-slate-300 shrink-0">
              Altro Workspace
            </span>
          \`;
        }

        const checkIcon = isSelected
          ? \`<i class="fa-solid fa-circle-check text-indigo-600 text-sm ml-2 shrink-0"></i>\`
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
            data-session-id="\${safeId}"
            onclick="selectSession(this.dataset.sessionId)"
            class="p-2.5 rounded-xl border \${borderClass} transition-all cursor-pointer group flex items-start justify-between gap-2"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                \${typeBadge}
                <span class="text-[10px] text-slate-500 font-mono shrink-0">\${timeStr}</span>
                \${dirHint}
              </div>
              <p class="text-xs font-semibold text-slate-900 group-hover:text-slate-900 truncate">
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
            <div class="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600/90">
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
            <div class="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-700 border border-purple-500/30">
              <i class="fa-solid fa-bolt text-[9px] text-purple-600"></i> ⚡ Cron
            </span>
          \`;
        } else if (s.isRoot) {
          badgeEl.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-700 border border-sky-500/30">
              <i class="fa-solid fa-comments text-[9px] text-sky-600"></i> 💬 Principale
            </span>
          \`;
        } else if (s.isSubagent) {
          badgeEl.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-700/90 border border-amber-500/20">
              <i class="fa-solid fa-robot text-[9px] text-amber-600"></i> 🤖 Subagente
            </span>
          \`;
        } else {
          badgeEl.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-600 border border-slate-300">
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
        if (bannerTitle) bannerTitle.textContent = activeSessionId || '-';
        if (bannerId) bannerId.textContent = activeSessionId || '';
        return;
      }

      if (bannerTitle) bannerTitle.textContent = s.title || s.id;
      if (bannerId) bannerId.textContent = s.id;
      if (bannerUpdated) bannerUpdated.textContent = 'Ultimo aggiornamento: ' + timeAgo(s.time_updated);

      if (bannerBadge) {
        if (s.hasCron) {
          bannerBadge.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-700 border border-purple-500/40">
              <i class="fa-solid fa-bolt text-purple-400"></i> CRON JOB
            </span>
          \`;
        } else if (s.isRoot) {
          bannerBadge.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-700 border border-sky-500/40">
              <i class="fa-solid fa-comments text-sky-400"></i> CHAT PRINCIPALE (ROOT)
            </span>
          \`;
        } else if (s.isSubagent) {
          bannerBadge.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-700/90 border border-amber-500/30">
              <i class="fa-solid fa-robot text-amber-600"></i> SUB-AGENTE
            </span>
          \`;
        } else {
          bannerBadge.innerHTML = \`
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-600 border border-slate-300">
              ALTRO WORKSPACE
            </span>
          \`;
        }
      }

      if (bannerJobLink) {
        if (s.hasCron && s.cronJobs && s.cronJobs.length > 0) {
          const firstJob = s.cronJobs[0];
          bannerJobLink.innerHTML = \`
            <button onclick="switchTab('jobs')" class="bg-purple-100/70 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer" data-tooltip="tt.tabJobs">
              <i class="fa-solid fa-gear text-[9px]"></i> Job: \${escapeHtml(firstJob.title)}
            </button>
            <button data-session-id="\${escapeHtml(s.id)}" onclick="openNewJobModal(this.dataset.sessionId)" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer" data-tooltip="tt.setCronBtn">
              <i class="fa-solid fa-plus text-[9px]"></i> <span data-i18n="chat.setCron">Imposta Cron</span>
            </button>
          \`;
        } else {
          bannerJobLink.innerHTML = \`
            <button data-session-id="\${escapeHtml(s.id)}" onclick="openNewJobModal(this.dataset.sessionId)" class="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer" data-tooltip="tt.setCronBtn">
              <i class="fa-solid fa-bolt text-amber-700 text-[10px]"></i> <span data-i18n="chat.setCron">Imposta Cron</span>
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
          <div class="max-w-[85%] bg-indigo-50 border border-indigo-200 rounded-2xl p-4 shadow-md text-sm">
            <div class="flex items-center justify-between space-x-3 pb-1.5 mb-2 border-b border-indigo-200 text-[10px] text-indigo-700">
              <span class="font-bold flex items-center gap-1.5">
                <i class="fa-solid \${isCronPrompt ? 'fa-clock' : 'fa-user'}"></i> \${isCronPrompt ? 'Tick Programmato (Cron Prompt)' : 'Utente'}
              </span>
              <span class="font-mono">\${escapeHtml(timeStr)}</span>
            </div>
            \${collapsedSys ? \`
              <details class="text-[11px] text-slate-500 mb-2 cursor-pointer bg-slate-100/60 p-2 rounded-lg border border-darkborder">
                <summary class="font-semibold text-indigo-700">Istruzioni di Sistema & Memoria (Espandi)</summary>
                <div class="mt-2 font-mono whitespace-pre-wrap leading-relaxed">\${escapeHtml(collapsedSys)}</div>
              </details>
            \` : ''}
            <div class="prose-dark text-slate-900 whitespace-pre-wrap leading-relaxed">\${escapeHtml(displayPrompt.trim())}</div>
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

        const cleanMarkdown = (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined')
          ? DOMPurify.sanitize(marked.parse(outputText.trim() || '*(Nessun output di testo)*'))
          : ('<pre class="whitespace-pre-wrap font-sans text-slate-700">' + escapeHtml(outputText.trim() || '*(Nessun output di testo)*') + '</pre>');

        wrapper.className = 'flex justify-start';
        wrapper.innerHTML = \`
          <div class="max-w-[85%] bg-darkcard border border-darkborder rounded-2xl p-4 shadow-md text-sm">
            <div class="flex items-center justify-between space-x-3 pb-1.5 mb-2 border-b border-darkborder text-[10px] text-slate-500">
              <span class="font-bold text-emerald-700 flex items-center gap-1.5">
                <i class="fa-solid fa-robot"></i> \${escapeHtml(modelId)}
              </span>
              <span class="font-mono">\${escapeHtml(timeStr)}</span>
            </div>

            \${reasoningText ? \`
              <details class="text-[11px] text-slate-500 mb-3 bg-slate-100 p-2.5 rounded-xl border border-darkborder">
                <summary class="font-semibold text-amber-600 flex items-center gap-1 cursor-pointer">
                  <i class="fa-solid fa-brain text-xs"></i> Pensiero & Ragionamento (Expand)
                </summary>
                <div class="mt-2 font-mono whitespace-pre-wrap text-slate-600 leading-relaxed max-h-48 overflow-y-auto">\${escapeHtml(reasoningText)}</div>
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
      const badgeTab = document.getElementById('chat-live-badge');
      const badge = document.getElementById('chat-autorefresh-dot') || badgeTab;
      if (enable) {
        if (badge) badge.classList.remove('hidden');
        if (badgeTab) badgeTab.classList.remove('hidden');
        autoRefreshTimer = setInterval(() => {
          if (currentTab === 'chat' && activeSessionId && !document.hidden) {
            loadSessionChat(activeSessionId, false);
          }
        }, 3000);
      } else {
        if (badge) badge.classList.add('hidden');
        if (badgeTab) badgeTab.classList.add('hidden');
      }
    }

    // Pause auto-refresh when tab is hidden
    document.addEventListener('visibilitychange', () => {
      const badgeTab = document.getElementById('chat-live-badge');
      const badge = document.getElementById('chat-autorefresh-dot') || badgeTab;
      if (document.hidden) {
        if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
        if (badge) badge.classList.add('hidden');
        if (badgeTab) badgeTab.classList.add('hidden');
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

      const ACTIVE_MODALS = [
        { id: 'templates-modal', close: closeTemplatesModal },
        { id: 'backup-modal', close: closeBackupModal },
        { id: 'metrics-modal', close: closeMetricsModal },
        { id: 'notifications-modal', close: closeNotificationsModal },
        { id: 'pipeline-modal', close: closePipelineModal },
        { id: 'job-modal', close: closeModal },
        { id: 'queue-modal', close: closeQueueModal },
        { id: 'dlq-modal', close: closeDlqModal },
        { id: 'confirm-modal', close: closeConfirmModal },
      ];

      if (e.key === 'Escape') {
        for (const m of ACTIVE_MODALS) {
          const el = document.getElementById(m.id);
          if (el && !el.classList.contains('hidden') && el.style.display !== 'none') {
            m.close();
            return;
          }
        }
      }

      const modal = document.getElementById('job-modal');
      const isModalOpen = modal && !modal.classList.contains('hidden');
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

    // Unified backdrop click dismiss for all modals
    ['templates-modal', 'backup-modal', 'metrics-modal', 'notifications-modal', 'pipeline-modal', 'job-modal', 'queue-modal', 'dlq-modal', 'confirm-modal'].forEach((modalId) => {
      const el = document.getElementById(modalId);
      if (el) {
        el.addEventListener('click', (e) => {
          if (e.target === el) {
            el.classList.add('hidden');
            el.style.display = 'none';
          }
        });
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
        preview.innerHTML = (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined')
          ? DOMPurify.sanitize(marked.parse(data.md || '*(Memoria vuota)*'))
          : ('<pre class="whitespace-pre-wrap font-sans text-slate-700">' + escapeHtml(data.md || '*(Memoria vuota)*') + '</pre>');

        let debounceTimer = null;
        editor.oninput = () => {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            preview.innerHTML = (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined')
              ? DOMPurify.sanitize(marked.parse(editor.value))
              : ('<pre class="whitespace-pre-wrap font-sans text-slate-700">' + escapeHtml(editor.value) + '</pre>');
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
          descEl.innerHTML = '<span class="text-emerald-700 font-semibold"><i class="fa-solid fa-circle-check mr-1 text-[10px]"></i>' + escapeHtml(data.description) + '</span>';
          if (Array.isArray(data.nextRuns) && data.nextRuns.length > 0) {
            const nextTicksLabel = isEn ? 'Next ticks:' : 'Prossimi tick:';
            runsEl.innerHTML = '<span class="text-slate-500 font-sans mr-1">' + nextTicksLabel + '</span>' + data.nextRuns.map((r, i) => {
              const dt = new Date(r);
              const formatted = dt.toLocaleTimeString() + ' (' + dt.toLocaleDateString() + ')';
              return '<span class="px-1.5 py-0.5 rounded bg-slate-100 border border-darkborder text-[10px] text-indigo-700">#' + (i + 1) + ' ' + formatted + '</span>';
            }).join('');
          } else {
            runsEl.innerHTML = '';
          }
        } else {
          descEl.innerHTML = '<span class="text-rose-600"><i class="fa-solid fa-circle-xmark mr-1 text-[10px]"></i>' + escapeHtml(data.description || (isEn ? 'Invalid expression' : 'Espressione non valida')) + '</span>';
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
            summaryEl.innerHTML = '<span class="text-emerald-700"><i class="fa-solid fa-check-circle mr-1"></i>Working tree pulito, nessuna modifica non committata.</span>';
          } else {
            summaryEl.innerHTML = '<span class="text-amber-700 font-semibold">' + (gitDiffData.files?.length || 0) + ' file modificati</span>' +
              (gitDiffData.stats ? (' • <span class="text-slate-500">' + escapeHtml(gitDiffData.stats) + '</span>') : '');
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
          diffBox.innerHTML = '<div class="text-rose-600 py-10 text-center"><i class="fa-solid fa-triangle-exclamation text-xl mb-2"></i><p>Errore caricamento Git Diff: ' + escapeHtml(err.message) + '</p></div>';
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
          '<i class="fa-solid fa-check-double text-emerald-700 text-2xl mb-2"></i>' +
          '<p class="text-slate-500 font-medium">Nessuna modifica</p>' +
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

        return '<button type="button" data-path="' + escapeHtml(f.path) + '" onclick="selectGitFile(this.dataset.path)" class="w-full text-left px-2.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between group ' + (isSelected ? 'bg-indigo-600 text-white font-bold shadow-md' : 'hover:bg-slate-200 text-slate-600') + '">' +
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
          '<p class="text-sm font-medium text-slate-600">Nessuna modifica da visualizzare</p>' +
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
        let lineClass = 'text-slate-600 hover:bg-slate-100/60';
        let prefixIcon = '';
        if (line.startsWith('+++') || line.startsWith('---')) {
          lineClass = 'text-indigo-800 font-bold bg-indigo-100/70';
        } else if (line.startsWith('diff --git') || line.startsWith('index ')) {
          lineClass = 'text-indigo-700 font-semibold bg-slate-100 border-t border-b border-darkborder/50 py-0.5';
        } else if (line.startsWith('@@')) {
          lineClass = 'text-cyan-800 bg-cyan-100/70 py-0.5';
        } else if (line.startsWith('+')) {
          lineClass = 'text-emerald-800 bg-emerald-100/70';
          prefixIcon = '<span class="text-emerald-500 select-none mr-1 font-bold">+</span>';
        } else if (line.startsWith('-')) {
          lineClass = 'text-rose-800 bg-rose-100/70';
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
    function toggleAdaptiveFields() {
      const enabled = Boolean(document.getElementById('form-adaptive-enabled')?.checked);
      const fields = document.getElementById('adaptive-fields');
      if (fields) {
        if (enabled) fields.classList.remove('hidden');
        else fields.classList.add('hidden');
      }
    }

    async function triggerBurstNow(id) {
      const btn = document.getElementById('burst-btn-' + id);
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i>';
      }
      try {
        const res = await fetch('/api/jobs/' + encodeURIComponent(id) + '/burst', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minutes: 15 }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.burstActivated') : 'Burst Mode attivato per 15 minuti!', 'success');
          await loadJobs();
        } else {
          showToast((typeof t === 'function' ? t('toast.genericError') : 'Errore: ') + (data.error || 'Operazione fallita'), 'error');
        }
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.netError') : 'Errore rete: ') + err.message, 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-bolt-lightning text-xs"></i>';
        }
      }
    }

    function togglePipelineFields() {
      const enabled = document.getElementById('form-pipeline-enabled')?.checked;
      const fields = document.getElementById('pipeline-fields');
      if (fields) {
        if (enabled) fields.classList.remove('hidden');
        else fields.classList.add('hidden');
      }
    }

    function toggleWebhookFields() {
      const enabled = document.getElementById('form-webhook-enabled')?.checked;
      const fields = document.getElementById('webhook-fields');
      if (fields) {
        if (enabled) fields.classList.remove('hidden');
        else fields.classList.add('hidden');
      }
    }

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

      const adaptiveCheck = document.getElementById('form-adaptive-enabled');
      if (adaptiveCheck) {
        adaptiveCheck.checked = false;
        toggleAdaptiveFields();
      }
      const burstInput = document.getElementById('form-adaptive-burst');
      if (burstInput) burstInput.value = '1m';
      const idleInput = document.getElementById('form-adaptive-idle');
      if (idleInput) idleInput.value = '30m';
      const threshInput = document.getElementById('form-adaptive-threshold');
      if (threshInput) threshInput.value = '3';

      const pipelineCheck = document.getElementById('form-pipeline-enabled');
      if (pipelineCheck) {
        pipelineCheck.checked = false;
        togglePipelineFields();
      }
      const successInput = document.getElementById('form-pipeline-success');
      if (successInput) successInput.value = '';
      const failureInput = document.getElementById('form-pipeline-failure');
      if (failureInput) failureInput.value = '';
      const payloadCheck = document.getElementById('form-pipeline-payload');
      if (payloadCheck) payloadCheck.checked = true;

      const webhookCheck = document.getElementById('form-webhook-enabled');
      if (webhookCheck) {
        webhookCheck.checked = false;
        toggleWebhookFields();
      }
      const webhookSecret = document.getElementById('form-webhook-secret');
      if (webhookSecret) webhookSecret.value = '';
      const webhookRate = document.getElementById('form-webhook-ratelimit');
      if (webhookRate) webhookRate.value = '5';
      const webhookPayload = document.getElementById('form-webhook-payload');
      if (webhookPayload) webhookPayload.checked = true;

      const catInput = document.getElementById('form-category');
      if (catInput) catInput.value = '';
      const tagsInput = document.getElementById('form-tags');
      if (tagsInput) tagsInput.value = '';
      const tzInput = document.getElementById('form-timezone');
      if (tzInput) tzInput.value = '';
      const timeoutInput = document.getElementById('form-timeout');
      if (timeoutInput) timeoutInput.value = '';
      const guardCheck = document.getElementById('form-guard-enabled');
      if (guardCheck) {
        guardCheck.checked = false;
        toggleGuardFields();
      }
      const guardCmd = document.getElementById('form-guard-command');
      if (guardCmd) guardCmd.value = '';
      const guardHttp = document.getElementById('form-guard-http');
      if (guardHttp) guardHttp.value = '';

      const targetSessionId = presetSessionId || (currentTab === 'chat' ? activeSessionId : '');
      if (targetSessionId) {
        const sessionSelect = document.getElementById('form-session-id');
        if (sessionSelect) sessionSelect.value = targetSessionId;
      }
      document.getElementById('form-model').value = 'nvidia/z-ai/glm-5.3';
      const prioInput = document.getElementById('form-priority');
      if (prioInput) prioInput.value = 'normal';
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
      const editPrioInput = document.getElementById('form-priority');
      if (editPrioInput) editPrioInput.value = job.priority || 'normal';
      document.getElementById('form-session-id').value = job.sessionID;
      document.getElementById('form-model').value = job.model || '';
      document.getElementById('form-system-prompt').value = job.systemPrompt || '';
      document.getElementById('form-followup-prompt').value = job.followupPrompt || '';

      const catInput = document.getElementById('form-category');
      if (catInput) catInput.value = job.category || '';
      const tagsInput = document.getElementById('form-tags');
      if (tagsInput) tagsInput.value = Array.isArray(job.tags) ? job.tags.join(', ') : '';
      const tzInput = document.getElementById('form-timezone');
      if (tzInput) tzInput.value = job.schedule?.timezone || '';
      const timeoutInput = document.getElementById('form-timeout');
      if (timeoutInput) timeoutInput.value = job.timeoutMs ? String(Math.round(job.timeoutMs / 1000)) : '';

      const hasGuard = Boolean(job.guard && (job.guard.command || job.guard.httpUrl));
      const guardCheck = document.getElementById('form-guard-enabled');
      if (guardCheck) {
        guardCheck.checked = hasGuard;
        toggleGuardFields();
      }
      const guardCmd = document.getElementById('form-guard-command');
      if (guardCmd) guardCmd.value = job.guard?.command || '';
      const guardHttp = document.getElementById('form-guard-http');
      if (guardHttp) guardHttp.value = job.guard?.httpUrl || '';

      const adaptiveCheck = document.getElementById('form-adaptive-enabled');
      if (adaptiveCheck) {
        adaptiveCheck.checked = Boolean(job.adaptive && job.adaptive.enabled);
        toggleAdaptiveFields();
      }
      const burstInput = document.getElementById('form-adaptive-burst');
      if (burstInput) burstInput.value = job.adaptive?.burstEveryMs ? formatInterval(job.adaptive.burstEveryMs) : '1m';
      const idleInput = document.getElementById('form-adaptive-idle');
      if (idleInput) idleInput.value = job.adaptive?.idleEveryMs ? formatInterval(job.adaptive.idleEveryMs) : '30m';
      const threshInput = document.getElementById('form-adaptive-threshold');
      if (threshInput) threshInput.value = String(job.adaptive?.quietThreshold || 3);

      const pipelineCheck = document.getElementById('form-pipeline-enabled');
      if (pipelineCheck) {
        pipelineCheck.checked = Boolean(job.pipeline && job.pipeline.enabled);
        togglePipelineFields();
      }
      const successInput = document.getElementById('form-pipeline-success');
      if (successInput) successInput.value = job.pipeline?.onSuccess ? job.pipeline.onSuccess.join(', ') : '';
      const failureInput = document.getElementById('form-pipeline-failure');
      if (failureInput) failureInput.value = job.pipeline?.onFailure ? job.pipeline.onFailure.join(', ') : '';
      const payloadCheck = document.getElementById('form-pipeline-payload');
      if (payloadCheck) payloadCheck.checked = job.pipeline?.passPayload !== false;

      const webhookCheck = document.getElementById('form-webhook-enabled');
      if (webhookCheck) {
        webhookCheck.checked = Boolean(job.webhook && job.webhook.enabled);
        toggleWebhookFields();
      }
      const webhookSecret = document.getElementById('form-webhook-secret');
      if (webhookSecret) webhookSecret.value = job.webhook?.secret || '';
      const webhookRate = document.getElementById('form-webhook-ratelimit');
      if (webhookRate) webhookRate.value = String(job.webhook?.rateLimitSeconds ?? 5);
      const webhookPayloadCheck = document.getElementById('form-webhook-payload');
      if (webhookPayloadCheck) webhookPayloadCheck.checked = job.webhook?.passPayload !== false;

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

      const isAdaptive = Boolean(document.getElementById('form-adaptive-enabled')?.checked);
      const adaptivePayload = isAdaptive ? {
        enabled: true,
        burst: document.getElementById('form-adaptive-burst')?.value.trim() || '1m',
        idle: document.getElementById('form-adaptive-idle')?.value.trim() || '30m',
        quietThreshold: parseInt(document.getElementById('form-adaptive-threshold')?.value, 10) || 3,
      } : (id ? { enabled: false } : undefined);

      const isPipeline = Boolean(document.getElementById('form-pipeline-enabled')?.checked);
      const pipelinePayload = isPipeline ? {
        enabled: true,
        onSuccess: (document.getElementById('form-pipeline-success')?.value || '')
          .split(',').map(s => s.trim()).filter(Boolean),
        onFailure: (document.getElementById('form-pipeline-failure')?.value || '')
          .split(',').map(s => s.trim()).filter(Boolean),
        passPayload: Boolean(document.getElementById('form-pipeline-payload')?.checked),
      } : (id ? { enabled: false } : undefined);

      const isWebhook = Boolean(document.getElementById('form-webhook-enabled')?.checked);
      const webhookPayload = isWebhook ? {
        enabled: true,
        secret: document.getElementById('form-webhook-secret')?.value.trim() || undefined,
        rateLimitSeconds: parseInt(document.getElementById('form-webhook-ratelimit')?.value, 10) || 5,
        passPayload: Boolean(document.getElementById('form-webhook-payload')?.checked),
      } : (id ? { enabled: false } : undefined);

      const category = document.getElementById('form-category')?.value.trim() || undefined;
      const tagsStr = document.getElementById('form-tags')?.value.trim() || '';
      const tags = tagsStr ? tagsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined;
      const timezone = document.getElementById('form-timezone')?.value.trim() || undefined;
      const timeoutSec = parseInt(document.getElementById('form-timeout')?.value, 10);
      const timeoutMs = (!isNaN(timeoutSec) && timeoutSec > 0) ? timeoutSec * 1000 : undefined;

      const isGuard = Boolean(document.getElementById('form-guard-enabled')?.checked);
      let guard = undefined;
      if (isGuard) {
        const cmd = document.getElementById('form-guard-command')?.value.trim();
        const http = document.getElementById('form-guard-http')?.value.trim();
        if (cmd || http) {
          guard = {
            command: cmd || undefined,
            httpUrl: http || undefined,
          };
        }
      }

      const payload = {
        title: document.getElementById('form-title').value.trim(),
        scheduleStr: schedStr,
        maxRuns: parseInt(document.getElementById('form-max-runs').value) || 0,
        sessionID: sessionID,
        model: document.getElementById('form-model').value.trim() || undefined,
        priority: document.getElementById('form-priority')?.value || 'normal',
        category,
        tags,
        timezone,
        timeoutMs,
        guard: isGuard ? guard : (id ? null : undefined),
        systemPrompt: document.getElementById('form-system-prompt').value.trim(),
        followupPrompt: document.getElementById('form-followup-prompt').value.trim(),
        adaptive: adaptivePayload,
        pipeline: pipelinePayload,
        webhook: webhookPayload,
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

    async function openPipelineModal() {
      const modal = document.getElementById('pipeline-modal');
      const content = document.getElementById('pipeline-graph-content');
      const statusEl = document.getElementById('pipeline-cycle-status');
      if (!modal || !content) return;

      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      content.innerHTML = '<div class="py-12 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin text-xl text-cyan-700 mb-2"></i><p>' + (typeof t === 'function' ? t('loading.jobs') : 'Caricamento...') + '</p></div>';

      try {
        const res = await fetch('/api/pipeline');
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Errore pipeline');
        const graph = data.graph;

        if (statusEl) {
          if (graph.hasCycle) {
            statusEl.innerHTML = '<span class="text-rose-600 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Ciclo rilevato nel grafo!</span>';
          } else {
            statusEl.innerHTML = '<span class="text-emerald-700 font-medium"><i class="fa-solid fa-check"></i> Grafo DAG valido (senza cicli)</span>';
          }
        }

        if (!graph.nodes || graph.nodes.length === 0) {
          content.innerHTML = '<div class="py-12 text-center text-gray-500 bg-slate-100/60 rounded-xl border border-darkborder"><i class="fa-solid fa-diagram-project text-2xl mb-2 text-gray-600"></i><p>' + escapeHtml(t('pipeline.emptyGraph')) + '</p></div>';
          return;
        }

        content.innerHTML = '<div class="space-y-3">' + graph.nodes.map(node => {
          const outEdges = (graph.edges || []).filter(e => e.from === node.id);
          const inEdges = (graph.edges || []).filter(e => e.to === node.id);
          const isRoot = (graph.roots || []).includes(node.id);

          return '<div class="bg-slate-100/80 border border-darkborder rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">' +
            '<div class="flex items-center justify-between">' +
              '<div class="flex items-center space-x-2">' +
                '<span class="font-bold text-slate-900 text-sm">' + escapeHtml(node.title) + '</span>' +
                '<span class="text-[10px] font-mono text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded border border-cyan-200">' + escapeHtml(node.id) + '</span>' +
                (isRoot ? '<span class="text-[9px] font-bold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded border border-indigo-200">ROOT</span>' : '') +
              '</div>' +
              (node.passPayload ? '<span class="text-[10px] font-mono text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200">📦 passPayload</span>' : '') +
            '</div>' +
            '<div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">' +
              '<div class="bg-slate-100/50 p-2.5 rounded-lg border border-darkborder/60">' +
                '<div class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><i class="fa-solid fa-arrow-right-to-bracket text-slate-500"></i> Trigger a Monte (Inbound)</div>' +
                (inEdges.length ? inEdges.map(e => '<div class="font-mono text-[11px] text-slate-600 flex items-center gap-1.5"><span class="' + (e.type === 'onSuccess' ? 'text-emerald-700' : 'text-rose-600') + '">' + (e.type === 'onSuccess' ? '✓' : '✕') + '</span> ' + escapeHtml(e.from) + ' <span class="text-[10px] text-gray-500">(' + e.type + ')</span></div>').join('') : '<span class="text-[11px] text-gray-600 italic">Nessun trigger in entrata (Root Job)</span>') +
              '</div>' +
              '<div class="bg-slate-100/50 p-2.5 rounded-lg border border-darkborder/60">' +
                '<div class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><i class="fa-solid fa-arrow-right-from-bracket text-cyan-700"></i> Trigger a Valle (Downstream)</div>' +
                (outEdges.length ? outEdges.map(e => '<div class="font-mono text-[11px] text-slate-600 flex items-center gap-1.5"><span class="' + (e.type === 'onSuccess' ? 'text-emerald-700' : 'text-rose-600') + '">' + (e.type === 'onSuccess' ? '✓' : '✕') + '</span> ➔ ' + escapeHtml(e.to) + ' <span class="text-[10px] text-gray-500">(' + e.type + ')</span></div>').join('') : '<span class="text-[11px] text-gray-600 italic">Nessun job a valle (Foglia terminale)</span>') +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('') + '</div>';

      } catch (err) {
        content.innerHTML = '<div class="py-8 text-center text-rose-600"><i class="fa-solid fa-triangle-exclamation mb-2"></i><p>' + escapeHtml(err.message) + '</p></div>';
      }
    }

    function closePipelineModal() {
      const modal = document.getElementById('pipeline-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    }

    let currentWebhookJobId = '';
    let currentWebhookData = null;

    async function openWebhookModal(id) {
      currentWebhookJobId = id;
      const modal = document.getElementById('webhook-modal');
      const subtitle = document.getElementById('webhook-modal-subtitle');
      if (!modal) return;
      if (subtitle) subtitle.textContent = 'Job ID: ' + id;

      modal.classList.remove('hidden');
      modal.style.display = 'flex';

      try {
        const res = await fetch('/api/jobs/' + encodeURIComponent(id) + '/webhook');
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Errore caricamento webhook');
        currentWebhookData = data;

        const urlInput = document.getElementById('webhook-modal-url');
        if (urlInput) urlInput.value = data.webhookUrl || '';
        const tokenInput = document.getElementById('webhook-modal-token');
        if (tokenInput) tokenInput.value = data.webhook?.token || '';
        const secretInput = document.getElementById('webhook-modal-secret');
        if (secretInput) secretInput.value = data.webhook?.secret || '';
        const rateInput = document.getElementById('webhook-modal-ratelimit');
        if (rateInput) rateInput.value = String(data.webhook?.rateLimitSeconds ?? 5);
        const passCheck = document.getElementById('webhook-modal-payload');
        if (passCheck) passCheck.checked = data.webhook?.passPayload !== false;

        updateWebhookCurlSnippet();
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.genericError') : 'Errore: ') + err.message, 'error');
      }
    }

    function closeWebhookModal() {
      const modal = document.getElementById('webhook-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    }

    function updateWebhookCurlSnippet() {
      const urlInput = document.getElementById('webhook-modal-url');
      const curlPre = document.getElementById('webhook-modal-curl');
      if (!urlInput || !curlPre) return;
      const url = urlInput.value || '';
      const payloadStr = JSON.stringify({ event: "trigger", timestamp: Date.now() });
      curlPre.textContent = "curl -X POST " + JSON.stringify(url) + " -H " + JSON.stringify("Content-Type: application/json") + " -d " + JSON.stringify(payloadStr);
    }

    function copyWebhookUrl() {
      const urlInput = document.getElementById('webhook-modal-url');
      if (!urlInput || !urlInput.value) return;
      navigator.clipboard.writeText(urlInput.value).then(() => {
        showToast(typeof t === 'function' ? t('toast.webhookCopied') : 'URL Webhook copiato!', 'success');
      }).catch(() => {
        urlInput.select();
        document.execCommand('copy');
        showToast(typeof t === 'function' ? t('toast.webhookCopied') : 'URL Webhook copiato!', 'success');
      });
    }

    function copyWebhookCurl() {
      const curlPre = document.getElementById('webhook-modal-curl');
      if (!curlPre || !curlPre.textContent) return;
      navigator.clipboard.writeText(curlPre.textContent).then(() => {
        showToast(typeof t === 'function' ? t('toast.webhookCurlCopied') : 'cURL copiato!', 'success');
      }).catch(() => {
        showToast(typeof t === 'function' ? t('toast.webhookCurlCopied') : 'cURL copiato!', 'success');
      });
    }

    async function rotateWebhookToken() {
      if (!currentWebhookJobId) return;
      try {
        const res = await fetch('/api/jobs/' + encodeURIComponent(currentWebhookJobId) + '/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rotateToken: true, enabled: true })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Errore rigenerazione token');
        showToast('Nuovo token generato con successo!', 'success');
        const urlInput = document.getElementById('webhook-modal-url');
        if (urlInput) urlInput.value = data.webhookUrl || '';
        const tokenInput = document.getElementById('webhook-modal-token');
        if (tokenInput) tokenInput.value = data.webhook?.token || '';
        updateWebhookCurlSnippet();
        await loadJobs();
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.genericError') : 'Errore: ') + err.message, 'error');
      }
    }

    async function saveWebhookSettings() {
      if (!currentWebhookJobId) return;
      const secret = document.getElementById('webhook-modal-secret')?.value.trim() || undefined;
      const rateLimit = parseInt(document.getElementById('webhook-modal-ratelimit')?.value, 10) || 5;
      const passPayload = Boolean(document.getElementById('webhook-modal-payload')?.checked);
      try {
        const res = await fetch('/api/jobs/' + encodeURIComponent(currentWebhookJobId) + '/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: true, secret, rateLimitSeconds: rateLimit, passPayload })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Errore salvataggio webhook');
        showToast(typeof t === 'function' ? t('toast.webhookSaved') : 'Configurazione salvata!', 'success');
        closeWebhookModal();
        await loadJobs();
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.genericError') : 'Errore: ') + err.message, 'error');
      }
    }

    async function disableWebhook() {
      if (!currentWebhookJobId) return;
      try {
        const res = await fetch('/api/jobs/' + encodeURIComponent(currentWebhookJobId) + '/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: false })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Errore disattivazione webhook');
        showToast(typeof t === 'function' ? t('toast.webhookDisabled') : 'Webhook disattivato', 'info');
        closeWebhookModal();
        await loadJobs();
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.genericError') : 'Errore: ') + err.message, 'error');
      }
    }

    async function testWebhookTrigger() {
      if (!currentWebhookJobId) return;
      const token = document.getElementById('webhook-modal-token')?.value || '';
      const testBtn = document.getElementById('webhook-test-btn');
      if (testBtn) {
        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Test...';
      }
      try {
        const url = '/api/webhook/' + encodeURIComponent(currentWebhookJobId) + (token ? ('?token=' + encodeURIComponent(token)) : '');
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'test_ping',
            sender: 'gui_modal',
            timestamp: new Date().toISOString()
          })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.webhookTriggered') : 'Trigger Webhook inviato!', 'success');
          await loadJobs();
          if (currentTab === 'chat' && activeSessionId) await loadSessionChat(activeSessionId);
        } else {
          showToast((typeof t === 'function' ? t('toast.tickError') : 'Errore: ') + (data.error || 'Trigger fallito'), 'error');
        }
      } catch (err) {
        showToast((typeof t === 'function' ? t('toast.netError') : 'Errore rete: ') + err.message, 'error');
      } finally {
        if (testBtn) {
          testBtn.disabled = false;
          testBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ' + (typeof t === 'function' ? t('webhook.testBtn') : 'Test Trigger');
        }
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

    // Concurrency Manager & Priority Queue logic
    async function refreshQueueBadge() {
      try {
        const res = await fetch('/api/queue');
        const data = await res.json();
        if (res.ok && data.ok) {
          const badge = document.getElementById('header-queue-badge');
          if (badge) {
            badge.textContent = (data.activeCount || 0) + '/' + (data.maxConcurrency || 2);
            if (data.queuedCount > 0) {
              badge.textContent += ' (+' + data.queuedCount + ')';
              badge.className = 'px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/25 text-amber-800 border border-amber-500/40 animate-pulse';
            } else {
              badge.className = 'px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30';
            }
          }
        }
      } catch {}
    }

    async function openQueueModal() {
      const modal = document.getElementById('queue-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
      await refreshQueueModal();
    }

    function closeQueueModal() {
      const modal = document.getElementById('queue-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    }

    async function refreshQueueModal() {
      try {
        const [qRes, setRes] = await Promise.all([
          fetch('/api/queue').then(r => r.json()),
          fetch('/api/settings').then(r => r.json())
        ]);

        if (setRes && setRes.ok && setRes.settings) {
          const maxIn = document.getElementById('queue-max-workers');
          if (maxIn) maxIn.value = setRes.settings.maxConcurrency || 2;
        }

        if (qRes && qRes.ok) {
          await refreshQueueBadge();

          const statusSub = document.getElementById('queue-concurrency-status-sub');
          if (statusSub) {
            statusSub.textContent = (qRes.activeCount || 0) + ' worker attivi su ' + (qRes.maxConcurrency || 2) + ' max';
          }

          // Render running jobs
          const runList = document.getElementById('queue-running-list');
          const runCount = document.getElementById('queue-running-count');
          if (runCount) runCount.textContent = String(qRes.running ? qRes.running.length : 0);
          if (runList) {
            if (!qRes.running || !qRes.running.length) {
              runList.innerHTML = '<div class="p-3 rounded-lg bg-slate-100/50 border border-darkborder/50 text-gray-500 text-center text-xs">' + (typeof t === 'function' ? t('queue.emptyRunning') : 'Nessun job in esecuzione') + '</div>';
            } else {
              runList.innerHTML = qRes.running.map(item => {
                const job = currentJobs.find(j => j.id === item.jobId);
                const title = job ? job.title : item.jobId;
                const prio = item.priority || 'normal';
                const prioBadge = prio === 'high' ? '🔥 Alta' : (prio === 'low' ? '💤 Bassa' : '⚡ Normale');
                return '<div class="p-2.5 rounded-lg bg-slate-100 border border-emerald-500/30 flex items-center justify-between">' +
                  '<div>' +
                    '<div class="flex items-center gap-2">' +
                      '<span class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>' +
                      '<span class="font-bold text-slate-900 text-xs">' + escapeHtml(title) + '</span>' +
                      '<span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">' + escapeHtml(item.jobId) + '</span>' +
                      '<span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-700 font-bold">' + prioBadge + '</span>' +
                    '</div>' +
                    '<p class="text-[10px] text-slate-500 mt-0.5">Avviato: ' + new Date(item.startedAt).toLocaleTimeString() + ' | Sorgente: ' + escapeHtml(item.source) + '</p>' +
                  '</div>' +
                  '<span class="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">IN ESECUZIONE</span>' +
                '</div>';
              }).join('');
            }
          }

          // Render queued jobs
          const waitList = document.getElementById('queue-waiting-list');
          const waitCount = document.getElementById('queue-waiting-count');
          if (waitCount) waitCount.textContent = String(qRes.queued ? qRes.queued.length : 0);
          if (waitList) {
            if (!qRes.queued || !qRes.queued.length) {
              waitList.innerHTML = '<div class="p-3 rounded-lg bg-slate-100/50 border border-darkborder/50 text-gray-500 text-center text-xs">' + (typeof t === 'function' ? t('queue.emptyQueued') : 'Nessun job in attesa') + '</div>';
            } else {
              waitList.innerHTML = qRes.queued.map(item => {
                const job = currentJobs.find(j => j.id === item.jobId);
                const title = job ? job.title : item.jobId;
                const prio = item.priority || 'normal';
                const prioColor = prio === 'high' ? 'bg-rose-500/15 text-rose-700 border-rose-500/30' : (prio === 'low' ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-blue-500/15 text-blue-700 border-blue-500/30');
                const prioLabel = prio === 'high' ? '🔥 Alta' : (prio === 'low' ? '💤 Bassa' : '⚡ Normale');
                return '<div class="p-2.5 rounded-lg bg-slate-100 border border-darkborder flex items-center justify-between">' +
                  '<div>' +
                    '<div class="flex items-center gap-2">' +
                      '<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>' +
                      '<span class="font-bold text-slate-700 text-xs">' + escapeHtml(title) + '</span>' +
                      '<span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-mono">' + escapeHtml(item.jobId) + '</span>' +
                      '<span class="text-[10px] px-1.5 py-0.5 rounded border font-bold ' + prioColor + '">' + prioLabel + '</span>' +
                    '</div>' +
                    '<p class="text-[10px] text-gray-500 mt-0.5">In coda da: ' + new Date(item.enqueuedAt).toLocaleTimeString() + ' | Sorgente: ' + escapeHtml(item.source) + '</p>' +
                  '</div>' +
                  '<button onclick="cancelQueuedJob(&quot;' + escapeHtml(item.jobId) + '&quot;)" class="px-2 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1">' +
                    '<i class="fa-solid fa-xmark text-[9px]"></i> Rimuovi' +
                  '</button>' +
                '</div>';
              }).join('');
            }
          }
        }
      } catch (err) {
        console.error('Error refreshing queue modal:', err);
      }
    }

    async function saveConcurrencySettings() {
      const input = document.getElementById('queue-max-workers');
      const val = parseInt(input?.value, 10);
      if (!val || val < 1 || val > 10) {
        showToast('Inserisci un valore compreso tra 1 e 10', 'error');
        return;
      }
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ maxConcurrency: val })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.queueSaved') : 'Limite di concorrenza salvato!', 'success');
          await refreshQueueModal();
        } else {
          showToast('Errore: ' + (data.error || 'Impossibile salvare'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    async function cancelQueuedJob(jobId) {
      try {
        const res = await fetch('/api/queue/' + encodeURIComponent(jobId), { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.queueCancelled') : 'Job rimosso dalla coda', 'info');
          await refreshQueueModal();
        } else {
          showToast('Errore: ' + (data.error || 'Impossibile rimuovere'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    async function clearQueue() {
      try {
        const res = await fetch('/api/queue/clear', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.queueCleared') : 'Coda svuotata con successo', 'info');
          await refreshQueueModal();
        } else {
          showToast('Errore: ' + (data.error || 'Impossibile svuotare'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    // Dead Letter Queue (DLQ) & Circuit Breaker Logic
    async function refreshDlqBadge() {
      try {
        const res = await fetch('/api/dlq');
        const data = await res.json();
        if (res.ok && data.ok) {
          const badge = document.getElementById('header-dlq-badge');
          if (badge) {
            const count = data.unresolvedCount || 0;
            badge.textContent = String(count);
            if (count > 0) {
              badge.className = 'px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/25 text-rose-700 border border-rose-500/40 animate-pulse';
            } else {
              badge.className = 'px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30';
            }
          }
        }
      } catch {}
    }

    async function openDlqModal() {
      const modal = document.getElementById('dlq-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
      await refreshDlqModal();
    }

    function closeDlqModal() {
      const modal = document.getElementById('dlq-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    }

    async function refreshDlqModal() {
      try {
        const res = await fetch('/api/dlq');
        const data = await res.json();
        if (!res.ok || !data.ok) return;

        await refreshDlqBadge();

        const countLabel = document.getElementById('dlq-count-label');
        if (countLabel) {
          countLabel.textContent = (data.unresolvedCount || 0) + ' job in quarantena (' + (data.totalEntries || 0) + ' totali)';
        }

        const list = document.getElementById('dlq-entries-list');
        if (list) {
          const entries = data.entries || [];
          if (!entries.length) {
            list.innerHTML = '<div class="p-6 rounded-xl bg-slate-100/50 border border-dashed border-darkborder text-gray-500 text-center text-xs">' +
              '<i class="fa-solid fa-circle-check text-2xl text-emerald-500 mb-2 block"></i>' +
              (typeof t === 'function' ? t('dlq.empty') : 'Nessun job in quarantena. Tutti i cron job funzionano regolarmente!') +
            '</div>';
          } else {
            list.innerHTML = entries.map(item => {
              const safeJobId = escapeHtml(item.jobId);
              const safeErr = escapeHtml(item.errorMessage || item.error || 'Errore sconosciuto');
              const safeDate = new Date(item.failedAt || item.quarantinedAt || Date.now()).toLocaleString();
              const isResolved = item.status === 'resolved' || item.resolved === true;
              const borderCls = isResolved ? 'border-slate-200 bg-slate-100/40 opacity-70' : 'border-rose-500/40 bg-slate-100';

              return '<div class="p-3 rounded-xl border ' + borderCls + ' space-y-2">' +
                '<div class="flex items-start justify-between gap-2">' +
                  '<div>' +
                    '<div class="flex items-center gap-2">' +
                      '<span class="font-bold text-slate-900 text-xs">' + escapeHtml(item.jobTitle || item.title || item.jobId) + '</span>' +
                      '<span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-indigo-700 font-mono">' + safeJobId + '</span>' +
                      (isResolved
                        ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 font-bold border border-emerald-500/30">RISOLTO</span>'
                        : '<span class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-700 font-bold border border-rose-500/30 animate-pulse">IN QUARANTENA</span>') +
                    '</div>' +
                    '<p class="text-[10px] text-gray-500 mt-0.5">Quarantena: ' + safeDate + ' | Fallimenti consecutivi: ' + item.consecutiveFailures + '</p>' +
                  '</div>' +
                  '<div class="flex items-center gap-1.5">' +
                    (!isResolved ? '<button onclick="retryDlqJob(&quot;' + safeJobId + '&quot;)" class="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/40 text-amber-700 border border-amber-500/30 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1">' +
                      '<i class="fa-solid fa-flask text-[9px]"></i> ' + (typeof t === 'function' ? t('dlq.retryBtn') : 'Riprova (Canary)') +
                    '</button>' : '') +
                    (!isResolved ? '<button onclick="resolveDlqJob(&quot;' + escapeHtml(item.id) + '&quot;)" class="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1">' +
                      '<i class="fa-solid fa-check text-[9px]"></i> ' + (typeof t === 'function' ? t('dlq.resolveBtn') : 'Risolvi') +
                    '</button>' : '') +
                    '<button onclick="deleteDlqEntry(&quot;' + escapeHtml(item.id) + '&quot;)" class="px-2 py-1 bg-slate-200 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded text-[10px] transition-colors cursor-pointer" title="' + (typeof t === 'function' ? t('dlq.deleteBtn') : 'Elimina') + '">' +
                      '<i class="fa-solid fa-trash text-[9px]"></i>' +
                    '</button>' +
                  '</div>' +
                '</div>' +
                '<div class="p-2 rounded bg-slate-100 border border-darkborder/80 text-[11px] font-mono text-rose-700/90 break-words">' +
                  safeErr +
                '</div>' +
              '</div>';
            }).join('');
          }
        }
      } catch (err) {
        showToast('Errore DLQ: ' + err.message, 'error');
      }
    }

    async function retryDlqJob(jobId) {
      try {
        const res = await fetch('/api/dlq/' + encodeURIComponent(jobId) + '/retry', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.dlqRetried') : 'Canary run completata con successo!', 'success');
          await refreshDlqModal();
          await loadJobs();
        } else {
          showToast('Canary fallita: ' + (data.error || 'Errore sconosciuto'), 'error');
          await refreshDlqModal();
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    async function resolveDlqJob(entryId) {
      try {
        const res = await fetch('/api/dlq/' + encodeURIComponent(entryId) + '/resolve', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.dlqResolved') : 'Job rimosso dalla quarantena!', 'success');
          await refreshDlqModal();
          await loadJobs();
        } else {
          showToast('Errore: ' + (data.error || 'Impossibile risolvere'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    async function deleteDlqEntry(entryId) {
      try {
        const res = await fetch('/api/dlq/' + encodeURIComponent(entryId), { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.dlqDeleted') : 'Entry rimossa', 'info');
          await refreshDlqModal();
        } else {
          showToast('Errore: ' + (data.error || 'Impossibile eliminare'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    async function clearAllDlq() {
      if (!confirm('Sei sicuro di voler svuotare tutta la Dead Letter Queue?')) return;
      try {
        const res = await fetch('/api/dlq/clear', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(typeof t === 'function' ? t('toast.dlqCleared') : 'DLQ svuotata con successo', 'success');
          await refreshDlqModal();
          await loadJobs();
        } else {
          showToast('Errore: ' + (data.error || 'Impossibile svuotare'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    // Guard fields toggle
    function toggleGuardFields() {
      const check = document.getElementById('form-guard-enabled');
      const fields = document.getElementById('guard-fields');
      if (fields) {
        if (check && check.checked) fields.classList.remove('hidden');
        else fields.classList.add('hidden');
      }
    }

    // Templates Modal Logic
    let allTemplates = [];
    async function openTemplatesModal() {
      const modal = document.getElementById('templates-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
      await loadTemplates();
    }

    function closeTemplatesModal() {
      const modal = document.getElementById('templates-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    }

    async function loadTemplates() {
      const container = document.getElementById('templates-list-container');
      if (container) {
        container.innerHTML = '<div class="col-span-2 py-8 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin text-lg text-indigo-600 mb-2"></i><p>Caricamento template...</p></div>';
      }
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        if (res.ok && data.ok) {
          allTemplates = data.templates || [];
          renderTemplatesList(allTemplates);
        }
      } catch (err) {
        if (container) container.innerHTML = '<div class="col-span-2 text-rose-500 text-xs text-center py-4">Errore: ' + escapeHtml(err.message) + '</div>';
      }
    }

    function filterTemplates(query) {
      const q = (query || '').toLowerCase().trim();
      if (!q) {
        renderTemplatesList(allTemplates);
        return;
      }
      const filtered = allTemplates.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
      renderTemplatesList(filtered);
    }

    function renderTemplatesList(list) {
      const container = document.getElementById('templates-list-container');
      if (!container) return;
      if (!list.length) {
        container.innerHTML = '<div class="col-span-2 py-8 text-center text-slate-500 text-xs">Nessun template corrispondente</div>';
        return;
      }
      container.innerHTML = list.map(item => {
        const tags = (item.tags || []).map(tag => '<span class="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[9px]">#' + escapeHtml(tag) + '</span>').join(' ');
        const cat = item.category ? '<span class="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 font-bold text-[9px]">' + escapeHtml(item.category) + '</span>' : '';
        return '<div class="p-3 bg-slate-100 rounded-xl border border-darkborder flex flex-col justify-between gap-2.5 hover:border-indigo-500/40 transition-colors">' +
          '<div>' +
            '<div class="flex items-center justify-between gap-1.5">' +
              '<h4 class="font-bold text-slate-900 text-xs tracking-tight">' + escapeHtml(item.title) + '</h4>' +
              cat +
            '</div>' +
            '<p class="text-[11px] text-slate-600 mt-1 leading-relaxed">' + escapeHtml(item.description) + '</p>' +
            '<div class="flex items-center gap-2 mt-2 font-mono text-[10px] text-slate-500">' +
              '<span><i class="fa-regular fa-clock mr-1 text-indigo-600"></i>' + escapeHtml(item.every || item.cron || '-') + '</span>' +
              (item.timeoutMs ? ('<span><i class="fa-solid fa-stopwatch mr-1 text-slate-400"></i>' + Math.round(item.timeoutMs/1000) + 's</span>') : '') +
            '</div>' +
            (tags ? ('<div class="flex flex-wrap gap-1 mt-2">' + tags + '</div>') : '') +
          '</div>' +
          '<div class="pt-2 border-t border-darkborder/50 flex justify-end">' +
            '<button type="button" onclick="applyTemplateBlueprint(&quot;' + escapeHtml(item.id) + '&quot;)" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer">' +
              '<i class="fa-solid fa-plus text-[10px]"></i> Applica Template' +
            '</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    async function applyTemplateBlueprint(templateId) {
      const sessionID = activeSessionId || (currentSessions[0] ? currentSessions[0].id : '');
      if (!sessionID) {
        showToast('Nessuna sessione OpenCode disponibile. Seleziona prima una sessione.', 'error');
        return;
      }
      try {
        const res = await fetch('/api/templates/' + encodeURIComponent(templateId) + '/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionID })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast('Template applicato con successo!', 'success');
          closeTemplatesModal();
          await loadJobs();
        } else {
          showToast('Errore applicazione template: ' + (data.error || 'Operazione fallita'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    // Backup & Restore Logic
    async function openBackupModal() {
      const modal = document.getElementById('backup-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
      await refreshBackupModal();
    }

    function closeBackupModal() {
      const modal = document.getElementById('backup-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    }

    async function refreshBackupModal() {
      const container = document.getElementById('backup-list-container');
      if (container) {
        container.innerHTML = '<div class="py-6 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin text-base text-emerald-600 mb-2"></i><p>Caricamento snapshot...</p></div>';
      }
      try {
        const res = await fetch('/api/backup');
        const data = await res.json();
        if (res.ok && data.ok) {
          const list = data.backups || [];
          if (!list.length) {
            container.innerHTML = '<div class="py-8 text-center text-slate-500 bg-slate-100/50 rounded-xl border border-dashed border-darkborder">Nessuno snapshot archiviato. Clicca su "Crea Snapshot Ora" per salvare una copia di sicurezza.</div>';
            return;
          }
          container.innerHTML = list.map(b => {
            const dateStr = new Date(b.createdAt).toLocaleString();
            return '<div class="p-3 bg-slate-100 rounded-xl border border-darkborder flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">' +
              '<div>' +
                '<div class="flex items-center gap-2">' +
                  '<span class="font-bold text-slate-900 font-mono text-xs">' + escapeHtml(b.id) + '</span>' +
                  '<span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-500/20">' + b.jobCount + ' job</span>' +
                  '<span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">' + b.memoryCount + ' memorie</span>' +
                '</div>' +
                '<p class="text-[10px] text-slate-500 mt-1">' + dateStr + ' • SHA: <span class="font-mono text-slate-700">' + escapeHtml(b.checksum?.slice(0, 12) || '-') + '</span></p>' +
              '</div>' +
              '<div class="flex items-center gap-1.5 shrink-0">' +
                '<button type="button" onclick="restoreBackupSnapshot(&quot;' + escapeHtml(b.id) + '&quot;)" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer">' +
                  '<i class="fa-solid fa-rotate-left text-[9px]"></i> Ripristina' +
                '</button>' +
                '<button type="button" onclick="deleteBackupSnapshot(&quot;' + escapeHtml(b.id) + '&quot;)" class="px-2 py-1 bg-rose-600/10 hover:bg-rose-600/20 text-rose-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer">' +
                  '<i class="fa-solid fa-trash text-[9px]"></i>' +
                '</button>' +
              '</div>' +
            '</div>';
          }).join('');
        }
      } catch (err) {
        if (container) container.innerHTML = '<div class="text-rose-500 text-xs text-center py-4">Errore: ' + escapeHtml(err.message) + '</div>';
      }
    }

    async function createBackupSnapshot() {
      const btn = document.getElementById('btn-create-snapshot');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-[10px]"></i> Salvataggio...';
      }
      try {
        const res = await fetch('/api/backup', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast('Snapshot creato con successo!', 'success');
          await refreshBackupModal();
        } else {
          showToast('Errore creazione snapshot: ' + (data.error || 'fallito'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-camera text-[10px]"></i> Crea Snapshot Ora';
        }
      }
    }

    async function restoreBackupSnapshot(id) {
      if (!confirm('Sei sicuro di voler ripristinare questo snapshot? Tutti i job e file di memoria verranno sovrascritti dallo snapshot ' + id)) return;
      try {
        const res = await fetch('/api/backup/' + encodeURIComponent(id) + '/restore', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast('Snapshot ripristinato con successo!', 'success');
          closeBackupModal();
          await loadJobs();
        } else {
          showToast('Errore ripristino snapshot: ' + (data.error || 'fallito'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    async function deleteBackupSnapshot(id) {
      if (!confirm('Eliminare lo snapshot ' + id + '?')) return;
      try {
        const res = await fetch('/api/backup/' + encodeURIComponent(id), { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast('Snapshot eliminato', 'info');
          await refreshBackupModal();
        } else {
          showToast('Errore eliminazione: ' + (data.error || 'fallito'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    // Metrics Modal Logic
    async function openMetricsModal() {
      const modal = document.getElementById('metrics-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
      await refreshMetricsModal();
    }

    function closeMetricsModal() {
      const modal = document.getElementById('metrics-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    }

    async function refreshMetricsModal() {
      try {
        const res = await fetch('/api/metrics');
        const data = await res.json();
        if (res.ok && data.ok) {
          const m = data.metrics || {};
          const total = m.totalRuns || 0;
          const succ = m.successfulRuns || 0;
          const rate = total > 0 ? Math.round((succ / total) * 100) : 100;
          document.getElementById('metric-total-runs').textContent = String(total);
          document.getElementById('metric-success-rate').textContent = rate + '%';
          document.getElementById('metric-avg-latency').textContent = (m.latencyAvgMs || 0) + 'ms';
          document.getElementById('metric-p95-latency').textContent = (m.latencyP95Ms || 0) + 'ms';
        }
      } catch (err) {
        console.error('Error loading metrics:', err);
      }
    }

    function copyPrometheusScrapeUrl() {
      const url = window.location.origin + '/api/metrics/prometheus';
      navigator.clipboard.writeText(url).then(() => {
        showToast('URL Prometheus copiato negli appunti!', 'success');
      }).catch(() => {
        showToast('URL: ' + url, 'info');
      });
    }

    // Notifications Modal Logic
    async function openNotificationsModal() {
      const modal = document.getElementById('notifications-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
      }
      await refreshNotificationsModal();
    }

    function closeNotificationsModal() {
      const modal = document.getElementById('notifications-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    }

    async function refreshNotificationsModal() {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (res.ok && data.ok && data.config) {
          const c = data.config;
          const slackInput = document.getElementById('form-notify-slack');
          if (slackInput) slackInput.value = c.slackWebhookUrl || '';
          const discordInput = document.getElementById('form-notify-discord');
          if (discordInput) discordInput.value = c.discordWebhookUrl || '';
          const customInput = document.getElementById('form-notify-custom');
          if (customInput) customInput.value = c.customWebhookUrl || '';
          const failCheck = document.getElementById('form-notify-on-failure');
          if (failCheck) failCheck.checked = c.notifyOnFailure !== false;
          const quarCheck = document.getElementById('form-notify-on-quarantine');
          if (quarCheck) quarCheck.checked = c.notifyOnQuarantine !== false;
          const recCheck = document.getElementById('form-notify-on-recovery');
          if (recCheck) recCheck.checked = c.notifyOnRecovery !== false;
        }
      } catch (err) {
        console.error('Error refreshing notifications:', err);
      }
    }

    async function handleNotificationSettingsSubmit(e) {
      e.preventDefault();
      const payload = {
        slackWebhookUrl: document.getElementById('form-notify-slack')?.value.trim() || undefined,
        discordWebhookUrl: document.getElementById('form-notify-discord')?.value.trim() || undefined,
        customWebhookUrl: document.getElementById('form-notify-custom')?.value.trim() || undefined,
        notifyOnFailure: Boolean(document.getElementById('form-notify-on-failure')?.checked),
        notifyOnQuarantine: Boolean(document.getElementById('form-notify-on-quarantine')?.checked),
        notifyOnRecovery: Boolean(document.getElementById('form-notify-on-recovery')?.checked),
      };
      try {
        const res = await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast('Configurazione notifiche salvata!', 'success');
          closeNotificationsModal();
        } else {
          showToast('Errore salvataggio notifiche: ' + (data.error || 'fallito'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    async function sendTestNotificationPing() {
      const btn = document.getElementById('btn-test-notification');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-[10px]"></i> Invio...';
      }
      try {
        const res = await fetch('/api/notifications/test', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast('Notifica di test inviata con successo!', 'success');
        } else {
          showToast('Test notifica: ' + (data.error || data.message || 'Nessun canale configurato'), 'info');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane text-[10px]"></i> Invia Test Ping';
        }
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

