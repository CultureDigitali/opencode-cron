import { getUiEnhancementsHeadStyle, getUiEnhancementsBodyHtml, getUiEnhancementsScript } from "./i18n.ts";

export function getGlobalHtml(): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23101828'/%3E%3Ccircle cx='16' cy='16' r='6' fill='white'/%3E%3C/svg%3E" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#E8E9ED" />
  <title>OpenCode Cron — Tutti i Progetti</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  ${getUiEnhancementsHeadStyle()}
  <style>
    :root {
      --oc-canvas: #E8E9ED;
      --oc-card: #ffffff;
      --oc-border: #D1D5DB;
      --oc-border-strong: #9CA3AF;
      --oc-navy: #101828;
      --oc-navy-soft: #10182815;
      --oc-slate-900: #0F172A;
      --oc-slate-700: #334155;
      --oc-slate-500: #64748B;
      --oc-slate-300: #CBD5E1;
      --oc-slate-100: #F1F5F9;
      --oc-emerald-500: #10B981;
      --oc-emerald-600: #059669;
      --oc-rose-500: #F43F5E;
      --oc-rose-600: #E11D48;
      --oc-amber-500: #F59E0B;
      --oc-indigo-500: #6366F1;
      --oc-indigo-600: #4F46E5;
      --oc-cyan-500: #06B6D4;
      --oc-violet-500: #8B5CF6;
      --oc-blue-500: #3B82F6;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: var(--oc-canvas);
      color: var(--oc-slate-900);
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .oc-btn-primary { @apply px-3 py-1.5 bg-[var(--oc-navy)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--oc-slate-900)] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center gap-1.5; }
    .oc-btn-secondary { @apply px-3 py-1.5 bg-white border border-[var(--oc-border)] text-[var(--oc-slate-700)] text-xs font-semibold rounded-lg hover:bg-[var(--oc-slate-100)] hover:border-[var(--oc-border-strong)] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center gap-1.5; }
    .oc-btn-ghost { @apply px-2.5 py-1.5 text-[var(--oc-slate-500)] hover:text-[var(--oc-slate-900)] hover:bg-[var(--oc-slate-100)] text-xs font-medium rounded-lg transition-colors cursor-pointer min-h-[36px] flex items-center justify-center gap-1; }
    .oc-btn-danger { @apply px-3 py-1.5 bg-[var(--oc-rose-500)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--oc-rose-600)] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center gap-1.5; }
    .oc-input { @apply w-full px-3 py-2 bg-white border border-[var(--oc-border)] rounded-xl text-sm text-[var(--oc-slate-900)] placeholder-[var(--oc-slate-500)] focus:outline-none focus:ring-2 focus:ring-[var(--oc-indigo-500)] focus:border-transparent transition-all; }
    .oc-select { @apply w-full px-3 py-2 bg-white border border-[var(--oc-border)] rounded-xl text-sm text-[var(--oc-slate-900)] focus:outline-none focus:ring-2 focus:ring-[var(--oc-indigo-500)] focus:border-transparent transition-all appearance-none bg-no-repeat bg-right; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-position: right 0.75rem center; padding-right: 2.5rem; }
    .oc-card { @apply bg-white rounded-2xl border border-[var(--oc-border)] shadow-sm; }
    .oc-band { @apply bg-[var(--oc-navy)] text-white; }
    .pulse-dot { animation: pulse-dot 2s infinite; }
    @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .oc-scrollrow { @apply flex items-center gap-1.5 pb-0.5 shrink-0 overflow-x-auto no-scrollbar; }
    .oc-job { @apply min-w-[320px] max-w-[420px] flex-shrink-0; }
    .oc-job-dot { @apply w-2.5 h-2.5 rounded-full flex-shrink-0; }
    .oc-tag { @apply px-1.5 py-0.5 rounded text-[9px] font-medium bg-[var(--oc-slate-100)] text-[var(--oc-slate-600)] hover:text-[var(--oc-slate-900)] border border-[var(--oc-border)] cursor-pointer transition-colors; }
    .fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .modal-overlay { @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4; }
    .modal-content { @apply bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up; }
    @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .stat-card { @apply bg-white rounded-xl border border-[var(--oc-border)] p-4; }
    .stat-value { @apply text-3xl font-extrabold text-[var(--oc-navy)] tracking-tight; }
    .stat-label { @apply text-xs font-medium text-[var(--oc-slate-500)] uppercase tracking-wider mt-0.5; }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  ${getUiEnhancementsBodyHtml()}

  <!-- Toast Container -->
  <div id="toast-container" class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none"></div>

  <!-- Global Header -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[var(--oc-border)]">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
        <div class="flex items-center gap-3">
          <a href="/" class="flex items-center gap-2" aria-label="OpenCode Cron Home">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#101828"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
            <span class="text-lg font-extrabold text-[var(--oc-navy)] tracking-tight hidden sm:block">OpenCode Cron</span>
          </a>
          <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--oc-slate-100)] text-[var(--oc-slate-600)] text-[11px] font-medium border border-[var(--oc-border)]" id="current-project-badge">Tutti i progetti</span>
        </div>

        <nav class="flex flex-wrap items-center gap-1.5" role="navigation" aria-label="Navigazione principale">
          <a href="/runs" class="px-3 py-1.5 rounded-full text-[13px] font-semibold text-[var(--oc-slate-300)] hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap" data-tooltip="Esiti Runs">
            <i class="fa-solid fa-chart-bar text-[12px]"></i> Esiti Runs
          </a>
          <a href="/instructions" class="px-3 py-1.5 rounded-full text-[13px] font-semibold text-[var(--oc-slate-300)] hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap" data-tooltip="Istruzioni">
            <i class="fa-solid fa-book-open text-[12px]"></i> Guida
          </a>
          <button onclick="refreshAll()" class="px-3 py-1.5 rounded-full text-[13px] font-semibold text-[var(--oc-slate-300)] hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap min-w-[36px] flex items-center justify-center gap-1.5 cursor-pointer" aria-label="Aggiorna" id="refresh-btn">
            <i class="fa-solid fa-rotate-right text-[12px]" id="refresh-spinner"></i>
          </button>
        </nav>
      </div>
    </div>

    <!-- Global Stats Band -->
    <div class="oc-band px-4 sm:px-6 py-3">
      <div class="mx-auto max-w-[1400px]">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div class="stat-card text-center">
            <div class="stat-value" id="stat-total-projects">0</div>
            <div class="stat-label">Progetti</div>
          </div>
          <div class="stat-card text-center">
            <div class="stat-value" id="stat-total-jobs">0</div>
            <div class="stat-label">Job totali</div>
          </div>
          <div class="stat-card text-center">
            <div class="stat-value" id="stat-active-jobs">0</div>
            <div class="stat-label">Attivi</div>
          </div>
          <div class="stat-card text-center">
            <div class="stat-value" id="stat-next-tick">-</div>
            <div class="stat-label">Prossimo tick</div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="flex-1 mx-auto max-w-[1400px] w-full px-4 sm:px-6 py-6">
    <!-- Filters Bar -->
    <section class="mb-6 fade-in" aria-label="Filtri globali">
      <div class="oc-card p-4 sm:p-5">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 min-w-[200px]">
            <label for="global-search" class="sr-only">Cerca job</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[var(--oc-slate-400)] text-sm"></i>
              <input type="search" id="global-search" placeholder="Cerca per titolo, ID, progetto, tag..." class="oc-input pl-10" aria-label="Cerca job globali" />
              <button type="button" id="global-search-clear" class="absolute right-3 top-1/2 -translate-y-1/2 hidden p-1 text-[var(--oc-slate-400)] hover:text-[var(--oc-slate-600)]" aria-label="Pulisci ricerca">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3 min-w-[300px]">
            <select id="project-filter" class="oc-select w-auto min-w-[180px]" aria-label="Filtra per progetto">
              <option value="all">Tutti i progetti</option>
            </select>
            <select id="state-filter" class="oc-select w-auto min-w-[160px]" aria-label="Filtra per stato">
              <option value="all">Tutti gli stati</option>
              <option value="enabled">Abilitati</option>
              <option value="disabled">In pausa</option>
              <option value="completed">Completati</option>
              <option value="quarantined">In quarantena</option>
            </select>
            <button type="button" onclick="clearGlobalFilters()" class="oc-btn-ghost hidden" id="clear-filters-btn">
              <i class="fa-solid fa-rotate-left text-[10px]"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Warnings Banner -->
    <div id="global-warnings" class="mb-4 hidden"></div>

    <!-- Jobs Grid -->
    <section aria-label="Job globali">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-[var(--oc-navy)]">Cron Jobs Globali</h2>
        <div class="flex items-center gap-2 text-sm text-[var(--oc-slate-500)]">
          <span id="global-filtered-count">0</span> / <span id="global-total-count">0</span> job
        </div>
      </div>
      <div id="global-jobs-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list"></div>
    </section>

    <!-- Empty State -->
    <div id="global-empty-state" class="hidden col-span-full py-16 text-center">
      <div class="bg-white/50 rounded-2xl border border-dashed border-[var(--oc-border)] p-8">
        <i class="fa-solid fa-filter-circle-xmark text-4xl mb-4 text-[var(--oc-slate-300)]"></i>
        <p class="text-sm font-semibold text-[var(--oc-slate-700)]" id="empty-title">Nessun Cron Job Configurato</p>
        <p class="text-xs text-[var(--oc-slate-500)] mt-1" id="empty-desc">Crea il tuo primo task programmato per automatizzare ricerche, monitoraggio o report direttamente dentro una sessione di OpenCode.</p>
        <button type="button" onclick="openNewJobModal()" class="mt-4 oc-btn-primary"><i class="fa-solid fa-plus text-[10px]"></i> Nuovo Job</button>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-[var(--oc-border)] bg-white/50 backdrop-blur-sm">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 py-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--oc-slate-500)]">
        <span>OpenCode Cron v1.2.6 — Gestione globale progetti</span>
        <div class="flex items-center gap-3">
          <a href="/runs" class="hover:text-[var(--oc-indigo-600)] transition-colors">Esiti Runs</a>
          <a href="/instructions" class="hover:text-[var(--oc-indigo-600)] transition-colors">Guida</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Global Job Modals (Edit, Confirm Delete, etc.) -->
  <div id="global-job-modal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-content">
      <div class="p-5 sm:p-6 border-b border-[var(--oc-border)] flex items-center justify-between">
        <h3 id="modal-title" class="text-lg font-bold text-[var(--oc-navy)]">Nuovo Job</h3>
        <button type="button" onclick="closeGlobalJobModal()" class="p-1.5 text-[var(--oc-slate-400)] hover:text-[var(--oc-slate-600)] hover:bg-[var(--oc-slate-100)] rounded-lg transition-colors" aria-label="Chiudi">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
      <form id="global-job-form" class="p-5 sm:p-6 space-y-4" onsubmit="saveGlobalJob(event)">
        <input type="hidden" id="global-job-id" name="id" />
        <input type="hidden" id="global-job-project-id" name="projectId" />
        
        <div>
          <label for="global-job-title" class="block text-xs font-semibold text-[var(--oc-slate-700)] mb-1">Titolo</label>
          <input type="text" id="global-job-title" name="title" required class="oc-input" placeholder="Es. Monitoraggio notizie AI" />
        </div>
        <div>
          <label for="global-job-system-prompt" class="block text-xs font-semibold text-[var(--oc-slate-700)] mb-1">System Prompt (Frozen)</label>
          <textarea id="global-job-system-prompt" name="systemPrompt" required rows="3" class="oc-input resize-none" placeholder="Definisci l'identità e le regole fisse dell'agente..."></textarea>
        </div>
        <div>
          <label for="global-job-followup-prompt" class="block text-xs font-semibold text-[var(--oc-slate-700)] mb-1">Followup Prompt</label>
          <textarea id="global-job-followup-prompt" name="followupPrompt" required rows="3" class="oc-input resize-none" placeholder="Istruzione operativa eseguita ad ogni tick..."></textarea>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="global-job-schedule" class="block text-xs font-semibold text-[var(--oc-slate-700)] mb-1">Pianificazione</label>
            <input type="text" id="global-job-schedule" name="scheduleStr" required class="oc-input" placeholder="Es. 5m, 1h, 0 9 * * *" />
            <p class="text-[10px] text-[var(--oc-slate-500)] mt-1">Intervalli (1m, 5m, 1h) o Cron 5 campi</p>
          </div>
          <div>
            <label for="global-job-timezone" class="block text-xs font-semibold text-[var(--oc-slate-700)] mb-1">Timezone</label>
            <input type="text" id="global-job-timezone" name="timezone" class="oc-input" placeholder="Europe/Rome" value="Europe/Rome" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label for="global-job-session" class="block text-xs font-semibold text-[var(--oc-slate-700)] mb-1">Sessione Target</label>
            <select id="global-job-session" name="sessionID" class="oc-select" required>
              <option value="">Caricamento sessioni...</option>
            </select>
          </div>
          <div>
            <label for="global-job-max-runs" class="block text-xs font-semibold text-[var(--oc-slate-700)] mb-1">Max Esecuzioni</label>
            <input type="number" id="global-job-max-runs" name="maxRuns" min="0" value="0" class="oc-input" />
            <p class="text-[10px] text-[var(--oc-slate-500)] mt-1">0 = continuo</p>
          </div>
          <div>
            <label for="global-job-category" class="block text-xs font-semibold text-[var(--oc-slate-700)] mb-1">Categoria</label>
            <input type="text" id="global-job-category" name="category" class="oc-input" placeholder="Es. monitoring" />
          </div>
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-[var(--oc-border)]">
          <button type="button" onclick="closeGlobalJobModal()" class="oc-btn-secondary flex-1">Annulla</button>
          <button type="submit" class="oc-btn-primary flex-1" id="global-job-submit">
            <i class="fa-solid fa-save text-[10px]"></i> <span id="global-job-submit-text">Salva</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Confirm Delete Modal -->
  <div id="confirm-modal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
    <div class="modal-content max-w-md">
      <div class="p-5 sm:p-6 border-b border-[var(--oc-border)]">
        <h3 id="confirm-title" class="text-lg font-bold text-[var(--oc-navy)]">Conferma Eliminazione</h3>
      </div>
      <div class="p-5 sm:p-6 space-y-4">
        <p id="confirm-message" class="text-sm text-[var(--oc-slate-700)]"></p>
        <div class="flex gap-3 pt-2">
          <button type="button" onclick="closeConfirmModal()" class="oc-btn-secondary flex-1">Annulla</button>
          <button type="button" id="confirm-modal-btn" class="oc-btn-danger flex-1"><i class="fa-solid fa-trash text-[10px]"></i> Elimina Job</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${getUiEnhancementsScript()}

    // Global state
    let allJobs = [];
    let allProjects = [];
    let allSessions = [];
    let pendingDeleteJobId = null;
    let pendingDeleteProjectId = null;
    let currentEditingJobId = null;
    let currentEditingProjectId = null;
    let autoRefreshTimer = null;

    // DOM refs
    const jobsContainer = document.getElementById('global-jobs-container');
    const emptyState = document.getElementById('global-empty-state');
    const totalCountEl = document.getElementById('global-total-count');
    const filteredCountEl = document.getElementById('global-filtered-count');
    const warningsEl = document.getElementById('global-warnings');
    const projectFilter = document.getElementById('project-filter');
    const stateFilter = document.getElementById('state-filter');
    const searchInput = document.getElementById('global-search');
    const searchClearBtn = document.getElementById('global-search-clear');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const statProjects = document.getElementById('stat-total-projects');
    const statJobs = document.getElementById('stat-total-jobs');
    const statActive = document.getElementById('stat-active-jobs');
    const statNext = document.getElementById('stat-next-tick');
    const projectBadge = document.getElementById('current-project-badge');

    let activeFilterProject = 'all';
    let activeFilterState = 'all';
    let activeSearch = '';

    // Init
    window.addEventListener('DOMContentLoaded', async () => {
      await refreshAll();
      toggleAutoRefresh(true);
    });

    async function refreshAll() {
      const spinner = document.getElementById('refresh-spinner');
      if (spinner) spinner.classList.add('fa-spin');
      try {
        await Promise.all([loadProjects(), loadGlobalJobs(), loadSessions()]);
        renderJobs();
        updateStats();
      } catch (err) {
        console.error('Refresh error:', err);
        showToast('Errore aggiornamento: ' + err.message, 'error');
      } finally {
        setTimeout(() => { if (spinner) spinner.classList.remove('fa-spin'); }, 500);
      }
    }

    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.ok) {
          allProjects = data.projects || [];
          renderProjectFilter();
          if (projectBadge) projectBadge.textContent = allProjects.length + ' progetti';
        }
        if (data.warnings && data.warnings.length) {
          showWarnings(data.warnings);
        }
      } catch (err) {
        console.error('Load projects error:', err);
      }
    }

    async function loadGlobalJobs() {
      try {
        const res = await fetch('/api/global/jobs');
        const data = await res.json();
        if (data.ok) {
          allJobs = data.jobs || [];
        }
        if (data.warnings && data.warnings.length) {
          showWarnings(data.warnings);
        }
      } catch (err) {
        console.error('Load global jobs error:', err);
        showToast('Errore caricamento job: ' + err.message, 'error');
      }
    }

    async function loadSessions() {
      try {
        const res = await fetch('/api/sessions');
        const data = await res.json();
        if (data.ok) {
          allSessions = data.sessions || [];
        }
      } catch (err) {
        console.error('Load sessions error:', err);
      }
    }

    function renderProjectFilter() {
      if (!projectFilter) return;
      const current = projectFilter.value;
      const options = ['<option value="all">Tutti i progetti</option>'];
      for (const p of allProjects) {
        options.push('<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.name) + '</option>');
      }
      projectFilter.innerHTML = options.join('');
      projectFilter.value = current;
    }

    function showWarnings(warnings) {
      if (!warningsEl || !warnings.length) return;
      warningsEl.innerHTML = warnings.map(w => 
        '<div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2"><i class="fa-solid fa-triangle-exclamation mt-0.5"></i><span>' + escapeHtml(w) + '</span></div>'
      ).join('');
      warningsEl.classList.remove('hidden');
    }

    function updateStats() {
      if (statProjects) statProjects.textContent = String(allProjects.length);
      if (statJobs) statJobs.textContent = String(allJobs.length);
      
      let activeCount = 0;
      let earliestNext = null;
      for (const job of allJobs) {
        const isMaxed = job.maxRuns > 0 && job.runCount >= job.maxRuns;
        if (job.enabled && !isMaxed) activeCount++;
        if (job.enabled && !isMaxed && job.nextRunAt) {
          const ts = new Date(job.nextRunAt).getTime();
          if (!earliestNext || ts < earliestNext) earliestNext = ts;
        }
      }
      if (statActive) statActive.textContent = String(activeCount);
      if (statNext) statNext.textContent = earliestNext ? new Date(earliestNext).toLocaleTimeString() : '-';
    }

    function formatInterval(everyMs) {
      if (!everyMs || everyMs < 1000) return '1m';
      if (everyMs % 3600000 === 0) return (everyMs / 3600000) + 'h';
      if (everyMs % 60000 === 0) return (everyMs / 60000) + 'm';
      return Math.round(everyMs / 1000) + 's';
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, '&#039;');
    }

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
      t.className = 'pointer-events-auto select-text px-4 py-3 rounded-xl border text-xs font-medium shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all ' + (colors[type] || colors.info);
      t.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.info) + ' text-xs"></i><span>' + escapeHtml(msg) + '</span>';
      c.appendChild(t);
      setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 4000);
    }

    // Filter handlers
    function applyGlobalFilters() {
      activeFilterProject = projectFilter?.value || 'all';
      activeFilterState = stateFilter?.value || 'all';
      activeSearch = (searchInput?.value || '').toLowerCase().trim();
      
      if (searchClearBtn) {
        if (activeSearch) searchClearBtn.classList.remove('hidden');
        else searchClearBtn.classList.add('hidden');
      }
      if (clearFiltersBtn) {
        if (activeFilterProject !== 'all' || activeFilterState !== 'all' || activeSearch) {
          clearFiltersBtn.classList.remove('hidden');
        } else {
          clearFiltersBtn.classList.add('hidden');
        }
      }
      renderJobs();
    }

    function clearGlobalFilters() {
      activeFilterProject = 'all';
      activeFilterState = 'all';
      activeSearch = '';
      if (projectFilter) projectFilter.value = 'all';
      if (stateFilter) stateFilter.value = 'all';
      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.classList.add('hidden');
      if (clearFiltersBtn) clearFiltersBtn.classList.add('hidden');
      renderJobs();
    }

    searchInput?.addEventListener('input', applyGlobalFilters);
    projectFilter?.addEventListener('change', applyGlobalFilters);
    stateFilter?.addEventListener('change', applyGlobalFilters);
    searchClearBtn?.addEventListener('click', () => { searchInput.value = ''; applyGlobalFilters(); });

    function renderJobs() {
      // Filter jobs
      const filteredJobs = allJobs.filter(job => {
        if (activeFilterProject !== 'all' && job.projectId !== activeFilterProject) return false;
        if (activeFilterState === 'enabled' && !job.enabled) return false;
        if (activeFilterState === 'disabled' && job.enabled) return false;
        if (activeFilterState === 'completed') {
          const isMaxed = job.maxRuns > 0 && job.runCount >= job.maxRuns;
          if (!isMaxed) return false;
        }
        if (activeFilterState === 'quarantined') {
          // Would need circuit breaker info - skip for now
          return false;
        }
        if (activeSearch) {
          const matchTitle = (job.title || '').toLowerCase().includes(activeSearch);
          const matchId = (job.id || '').toLowerCase().includes(activeSearch);
          const matchProject = (job.projectName || '').toLowerCase().includes(activeSearch);
          if (!matchTitle && !matchId && !matchProject) return false;
        }
        return true;
      });

      if (totalCountEl) totalCountEl.textContent = String(allJobs.length);
      if (filteredCountEl) filteredCountEl.textContent = String(filteredJobs.length);

      if (!filteredJobs.length) {
        if (jobsContainer) jobsContainer.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }
      if (emptyState) emptyState.classList.add('hidden');

      if (jobsContainer) {
        jobsContainer.innerHTML = filteredJobs.map(job => renderGlobalJobCard(job)).join('');
      }
    }

    function renderGlobalJobCard(job) {
      const isMaxed = job.maxRuns > 0 && job.runCount >= job.maxRuns;
      
      const statusBadge = isMaxed
        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">🏁 Completato (' + job.runCount + '/' + job.maxRuns + ')</span>'
        : job.enabled
          ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>Attivo</span>'
          : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-500">In Pausa</span>';

      const priority = job.priority || 'normal';
      const priorityBadge = priority === 'high'
        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30 flex items-center gap-1"><i class="fa-solid fa-fire text-rose-600"></i> Alta</span>'
        : priority === 'low'
          ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-500 border border-slate-300 flex items-center gap-1"><i class="fa-solid fa-bed text-slate-500"></i> Bassa</span>'
          : '<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center gap-1"><i class="fa-solid fa-bolt text-blue-600"></i> Normale</span>';

      const categoryBadge = job.category
        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1"><i class="fa-solid fa-folder text-[9px] text-slate-500"></i> ' + escapeHtml(job.category) + '</span>'
        : '';

      const tagsPills = (Array.isArray(job.tags) && job.tags.length > 0)
        ? job.tags.map(tag => '<span class="oc-tag">#' + escapeHtml(tag) + '</span>').join(' ')
        : '';

      const schedDesc = job.schedule?.kind === 'interval'
        ? formatInterval(job.schedule.everyMs)
        : 'Cron: ' + escapeHtml(job.schedule?.cron || '');

      const nextRun = job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : 'Mai';
      const lastRun = job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : 'Mai';

      const projectName = escapeHtml(job.projectName || 'Sconosciuto');
      const safeId = escapeHtml(job.id);
      const safeTitle = escapeHtml(job.title);

      return \`
        <article class="oc-card oc-job p-4 fade-in" role="listitem" data-job-id="\${safeId}" data-project-id="\${escapeHtml(job.projectId)}">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="oc-job-dot \${job.enabled ? 'bg-emerald-500 pulse-dot' : 'bg-slate-300'}" aria-hidden="true"></span>
                <h3 class="text-sm font-bold text-[var(--oc-slate-900)] tracking-tight">\${safeTitle}</h3>
                \${statusBadge}
                \${priorityBadge}
                \${categoryBadge}
              </div>
              <p class="text-[11px] font-mono text-indigo-600 mt-1">\${safeId}</p>
              \${tagsPills ? '<div class="flex flex-wrap gap-1 mt-1.5">' + tagsPills + '</div>' : ''}
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button onclick="openGlobalJobEditModal('\${safeId}', '\${escapeHtml(job.projectId)}')" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-[var(--oc-border)] cursor-pointer" aria-label="Modifica" data-tooltip="Modifica">
                <i class="fa-solid fa-pen text-xs"></i>
              </button>
              <button onclick="toggleGlobalJob('\${safeId}', '\${escapeHtml(job.projectId)}', \${job.enabled})" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-[var(--oc-border)] cursor-pointer" aria-label="\${job.enabled ? 'Pausa' : 'Riattiva'}" data-tooltip="\${job.enabled ? 'Pausa' : 'Riattiva'}">
                <i class="fa-solid \${job.enabled ? 'fa-pause' : 'fa-play'} text-xs"></i>
              </button>
              <button onclick="runGlobalJobNow('\${safeId}', '\${escapeHtml(job.projectId)}')" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200/60 cursor-pointer" aria-label="Esegui ora" data-tooltip="Esegui ora">
                <i class="fa-solid fa-bolt text-xs"></i>
              </button>
              <button onclick="openGlobalProjectDashboard('\${escapeHtml(job.projectId)}')" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 rounded-lg transition-colors border border-cyan-200/60 cursor-pointer" aria-label="Apri dashboard progetto" data-tooltip="Apri progetto">
                <i class="fa-solid fa-external-link-alt text-xs"></i>
              </button>
              <button onclick="confirmGlobalDeleteJob('\${safeId}', '\${escapeHtml(job.projectId)}')" class="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/60 cursor-pointer" aria-label="Elimina" data-tooltip="Elimina">
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </div>
          
          <div class="space-y-2 text-xs border-t border-[var(--oc-border)] pt-3">
            <div class="flex items-center gap-2 flex-wrap text-[var(--oc-slate-600)]">
              <span class="font-medium text-[var(--oc-slate-700)]">Progetto:</span>
              <span class="px-2 py-0.5 bg-[var(--oc-slate-100)] rounded text-[10px] font-mono">\${projectName}</span>
            </div>
            <div class="flex items-center gap-2 flex-wrap text-[var(--oc-slate-600)]">
              <span class="font-medium text-[var(--oc-slate-700)]">Pianificazione:</span>
              <span class="px-2 py-0.5 bg-[var(--oc-slate-100)] rounded text-[10px] font-mono">\${schedDesc}</span>
            </div>
            <div class="flex items-center gap-2 flex-wrap text-[var(--oc-slate-600)]">
              <span class="font-medium text-[var(--oc-slate-700)]">Prossimo:</span>
              <span class="px-2 py-0.5 bg-[var(--oc-slate-100)] rounded text-[10px] font-mono">\${nextRun}</span>
            </div>
            <div class="flex items-center gap-2 flex-wrap text-[var(--oc-slate-600)]">
              <span class="font-medium text-[var(--oc-slate-700)]">Ultimo:</span>
              <span class="px-2 py-0.5 bg-[var(--oc-slate-100)] rounded text-[10px] font-mono">\${lastRun}</span>
            </div>
            <div class="flex items-center gap-2 flex-wrap text-[var(--oc-slate-600)]">
              <span class="font-medium text-[var(--oc-slate-700)]">Esecuzioni:</span>
              <span class="px-2 py-0.5 bg-[var(--oc-slate-100)] rounded text-[10px] font-mono">\${job.runCount || 0}\${job.maxRuns > 0 ? ' / ' + job.maxRuns : ''}</span>
            </div>
            \${job.consecutiveFailures > 0 ? '<div class="flex items-center gap-2 flex-wrap text-[var(--oc-slate-600)]"><span class="font-medium text-[var(--oc-slate-700)]">Errori consecutivi:</span><span class="px-2 py-0.5 bg-rose-500/15 text-rose-700 rounded text-[10px] font-bold border border-rose-500/30">' + job.consecutiveFailures + '</span></div>' : ''}
          </div>
        </article>
      \`;
    }

    // Modal handlers
    function openGlobalJobEditModal(jobId, projectId) {
      const job = allJobs.find(j => j.id === jobId && j.projectId === projectId);
      if (!job) { showToast('Job non trovato', 'error'); return; }
      currentEditingJobId = jobId;
      currentEditingProjectId = projectId;

      document.getElementById('global-job-id').value = job.id;
      document.getElementById('global-job-project-id').value = projectId;
      document.getElementById('global-job-title').value = job.title || '';
      document.getElementById('global-job-system-prompt').value = job.systemPrompt || '';
      document.getElementById('global-job-followup-prompt').value = job.followupPrompt || '';
      document.getElementById('global-job-schedule').value = job.schedule?.cron || (job.schedule?.everyMs ? formatInterval(job.schedule.everyMs) : '');
      document.getElementById('global-job-timezone').value = job.schedule?.timezone || 'Europe/Rome';
      document.getElementById('global-job-max-runs').value = job.maxRuns || 0;
      document.getElementById('global-job-category').value = job.category || '';

      // Populate sessions
      const sessionSelect = document.getElementById('global-job-session');
      sessionSelect.innerHTML = '<option value="">Seleziona una sessione...</option>' + 
        allSessions.map(s => '<option value="' + escapeHtml(s.id) + '"' + (s.id === job.sessionID ? ' selected' : '') + '>' + escapeHtml(s.title || s.id) + '</option>').join('');
      if (job.sessionID) sessionSelect.value = job.sessionID;

      document.getElementById('modal-title').textContent = 'Modifica Job';
      document.getElementById('global-job-submit-text').textContent = 'Salva modifiche';
      document.getElementById('global-job-modal').classList.remove('hidden');
      document.getElementById('global-job-modal').style.display = 'flex';
      document.getElementById('global-job-title').focus();
    }

    function closeGlobalJobModal() {
      document.getElementById('global-job-modal').classList.add('hidden');
      document.getElementById('global-job-modal').style.display = 'none';
      document.getElementById('global-job-form').reset();
      currentEditingJobId = null;
      currentEditingProjectId = null;
    }

    async function saveGlobalJob(event) {
      event.preventDefault();
      const btn = document.getElementById('global-job-submit');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-[10px]"></i> Salvataggio...';

      const projectId = document.getElementById('global-job-project-id').value;
      const jobId = document.getElementById('global-job-id').value;
      const isNew = !jobId;

      const scheduleStr = document.getElementById('global-job-schedule').value.trim();
      const timezone = document.getElementById('global-job-timezone').value.trim() || undefined;

      const payload = {
        title: document.getElementById('global-job-title').value.trim(),
        systemPrompt: document.getElementById('global-job-system-prompt').value.trim(),
        followupPrompt: document.getElementById('global-job-followup-prompt').value.trim(),
        scheduleStr,
        timezone,
        sessionID: document.getElementById('global-job-session').value,
        maxRuns: parseInt(document.getElementById('global-job-max-runs').value) || 0,
        category: document.getElementById('global-job-category').value.trim() || undefined,
      };

      const url = isNew ? '/api/jobs' : ('/p/' + encodeURIComponent(projectId) + '/api/jobs/' + encodeURIComponent(jobId));
      const method = isNew ? 'POST' : 'PUT';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(isNew ? 'Nuovo job creato!' : 'Job aggiornato!', 'success');
          closeGlobalJobModal();
          await refreshAll();
        } else {
          showToast('Errore: ' + (data.error || 'Operazione fallita'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-save text-[10px]"></i> <span id="global-job-submit-text">' + (isNew ? 'Salva' : 'Salva modifiche') + '</span>';
      }
    }

    function confirmGlobalDeleteJob(jobId, projectId) {
      const job = allJobs.find(j => j.id === jobId && j.projectId === projectId);
      if (!job) { showToast('Job non trovato', 'error'); return; }
      pendingDeleteJobId = jobId;
      pendingDeleteProjectId = projectId;
      document.getElementById('confirm-message').textContent = 'Sei sicuro di voler eliminare il job "' + escapeHtml(job.title) + '" (' + jobId + ')? Questa azione non può essere annullata.';
      document.getElementById('confirm-modal').classList.remove('hidden');
      document.getElementById('confirm-modal').style.display = 'flex';
    }

    function closeConfirmModal() {
      document.getElementById('confirm-modal').classList.add('hidden');
      document.getElementById('confirm-modal').style.display = 'none';
      const id = pendingDeleteJobId;
      pendingDeleteJobId = null;
      pendingDeleteProjectId = null;
      return id;
    }

    document.getElementById('confirm-modal-btn').onclick = async () => {
      const id = closeConfirmModal();
      const projectId = pendingDeleteProjectId;
      if (!id || !projectId) return;

      try {
        const res = await fetch('/p/' + encodeURIComponent(projectId) + '/api/jobs/' + encodeURIComponent(id), { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast('Job eliminato', 'success');
          await refreshAll();
        } else {
          showToast('Errore eliminazione: ' + (data.error || 'Fallito'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    };

    async function toggleGlobalJob(jobId, projectId, currentlyEnabled) {
      try {
        const res = await fetch('/p/' + encodeURIComponent(projectId) + '/api/jobs/' + encodeURIComponent(jobId) + '/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !currentlyEnabled })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast(currentlyEnabled ? 'Job messo in pausa' : 'Job riattivato', 'success');
          await refreshAll();
        } else {
          showToast('Errore: ' + (data.error || 'Fallito'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    async function runGlobalJobNow(jobId, projectId) {
      try {
        const res = await fetch('/p/' + encodeURIComponent(projectId) + '/api/jobs/' + encodeURIComponent(jobId) + '/run', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.ok) {
          showToast('Tick eseguito con successo', 'success');
          await refreshAll();
        } else {
          showToast('Errore esecuzione: ' + (data.error || 'Fallito'), 'error');
        }
      } catch (err) {
        showToast('Errore rete: ' + err.message, 'error');
      }
    }

    function openGlobalProjectDashboard(projectId) {
      window.location.href = '/p/' + encodeURIComponent(projectId) + '/';
    }

    function toggleAutoRefresh(enabled) {
      if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
      if (enabled) {
        autoRefreshTimer = setInterval(refreshAll, 30000);
      }
    }

    // Keyboard: Escape closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const jobModal = document.getElementById('global-job-modal');
        const confirmModal = document.getElementById('confirm-modal');
        if (jobModal && !jobModal.classList.contains('hidden')) { closeGlobalJobModal(); return; }
        if (confirmModal && !confirmModal.classList.contains('hidden')) { closeConfirmModal(); return; }
      }
    });

    // Expose for inline onclick
    window.refreshAll = refreshAll;
    window.clearGlobalFilters = clearGlobalFilters;
    window.openGlobalJobEditModal = openGlobalJobEditModal;
    window.closeGlobalJobModal = closeGlobalJobModal;
    window.saveGlobalJob = saveGlobalJob;
    window.confirmGlobalDeleteJob = confirmGlobalDeleteJob;
    window.closeConfirmModal = closeConfirmModal;
    window.toggleGlobalJob = toggleGlobalJob;
    window.runGlobalJobNow = runGlobalJobNow;
    window.openGlobalProjectDashboard = openGlobalProjectDashboard;
    window.formatInterval = formatInterval;
    window.escapeHtml = escapeHtml;
  </script>
</body>
</html>`;
}