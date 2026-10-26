import {
 escapeHtml,
 getUiEnhancementsHeadStyle,
 getUiEnhancementsBodyHtml,
 getUiEnhancementsScript,
 getHeaderControlsHtml,
 getOnboardingBannerHtml,
} from"./i18n.ts";

export function getRunsHtml(title: string ="Storico Runs & Esiti Cron - OpenCode Cron"): string {
 return `<!DOCTYPE html>
<html lang="it">
<head>
 <meta charset="utf-8" />
 <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23101828'/%3E%3Ccircle cx='16' cy='16' r='6' fill='white'/%3E%3C/svg%3E" />
 <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
 <title>${escapeHtml(title)}</title>
  function initEntranceMotion() {
  const targets = document.querySelectorAll('.oc-sec-title, .run-card, [data-ui]');
  if (!targets.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  targets.forEach((el, i) => { el.classList.add('oc-enter'); el.style.transitionDelay = Math.min(i % 8, 7) * 70 + 'ms'; });
  const io = new IntersectionObserver((entries) => { entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('oc-entered'); io.unobserve(en.target); } }); }, { threshold: 0.08 });
  targets.forEach(el => io.observe(el));
  }
 <script src="https://cdn.tailwindcss.com"></script>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
 <script>
 tailwind.config = {
 darkMode: 'class',
 theme: {
 extend: {
 colors: {
 brand: { 500: '#0d9488', 600: '#0f766e', 700: '#115e59' },
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
 html { font-size: 100%; }
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
 @media (forced-colors: active) {
 .status-pill-success, .status-pill-failed, .status-pill-skipped {
 border: 2px solid currentColor !important;
 }
 }
 ${getUiEnhancementsHeadStyle()}
 </style>
 <style>
 .oc-enter { opacity: 0; transform: translateY(18px); transition: opacity .5s ease, transform .5s ease; }
 .oc-enter.oc-entered { opacity: 1; transform: translateY(0); }
 @media (prefers-reduced-motion: reduce) { .oc-enter { opacity: 1; transform: none; transition: none; } }
 </style>
</head>
<body class="bg-darkbg text-slate-900 min-h-dvh flex flex-col font-sans antialiased selection:bg-brand-500 selection:text-white">

 ${getUiEnhancementsBodyHtml()}

 <!-- Top Header: wraps on mobile -->
 <header class="bg-darkcard/95 sticky top-0 z-40 sm:backdrop-blur-md">
 <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
 <div class="flex items-center gap-2.5 min-w-0">
 <a href="/" data-tooltip="tt.tabJobs" aria-label="Dashboard" class="shrink-0 min-w-[40px] min-h-[40px] px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[13px] font-semibold flex items-center gap-2 transition-colors">
 <i class="fa-solid fa-arrow-left rtl:rotate-180"></i>
 <span data-i18n="nav.dashboard" class="hidden sm:inline">Dashboard</span>
 </a>
 
 <div class="flex items-center gap-2.5 min-w-0">
 <div class="oc-brand-mark" aria-hidden="true">
 <i class="fa-solid fa-chart-line text-base"></i>
 </div>
 <div class="min-w-0">
 <div class="flex items-center gap-2 flex-wrap">
 <h1 class="text-base sm:text-base font-bold tracking-tight text-slate-900" data-i18n="runs.pageTitle">Storico Esecuzioni Cron (Runs)</h1>
 <span data-tooltip="tt.liveBadge" class="hidden sm:inline-flex text-[13px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-700 items-center gap-1.5">
 <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
 <span data-i18n="app.liveBadge">Live Monitor</span>
 </span>
 </div>
 <p class="text-[13px] sm:text-[13px] text-slate-700 line-clamp-2 lg:line-clamp-1" data-i18n="runs.pageSubtitle">Verifica immediata di quali cron job sono partiti con successo e quali sono falliti</p>
 </div>
 </div>
 </div>

 <!-- Right Actions: scrollable row on mobile -->
 <div class="oc-scrollrow no-scrollbar flex items-center gap-1.5 sm:gap-2 pb-0.5">
 ${getHeaderControlsHtml()}
 <label class="hidden md:flex items-center gap-2 text-[13px] text-slate-700 bg-slate-100/80 px-3 py-2 rounded-xl border border-darkborder cursor-pointer select-none whitespace-nowrap" data-tooltip="tt.liveBadge">
 <input type="checkbox" id="auto-refresh-toggle" checked onchange="toggleAutoRefresh(this.checked)" class="rounded bg-slate-200 border-slate-300 text-brand-500 focus:ring-brand-500" />
 <span data-i18n="runs.autoRefresh">Auto-aggiorna (5s)</span>
 </label>
 <button onclick="loadRunsData(true)" data-tooltip="tt.runsKpiTotal" class="shrink-0 bg-brand-600 hover:bg-brand-500 text-white px-3.5 py-2 rounded-xl text-[13px] font-semibold shadow-brand-600/25 flex items-center gap-1.5 transition-colors min-h-[40px]">
 <i class="fa-solid fa-arrows-rotate" id="refresh-icon"></i>
 <span class="hidden sm:inline" data-i18n="runs.refreshNow">Aggiorna Ora</span>
 </button>
 </div>
 </div>
 </header>

 <!-- Main Content -->
 <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

 ${getOnboardingBannerHtml()}

 <!-- 1. HERO KPI SUMMARY CARDS -->
 <section aria-label="Riepilogo Globale Esecuzioni" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[220px]" data-ui>
 <!-- Total Runs -->
 <button type="button" onclick="setStatusFilter('all')" data-tooltip="tt.runsKpiTotal" class="text-left rtl:text-right bg-darkcard hover:bg-slate-100/90 rounded-2xl p-4 sm:p-5 transition-colors group" data-ui>
 <div class="flex items-center justify-between">
 <span class="text-[13px] font-semibold text-slate-700 flex items-center">
 <span data-i18n="runs.kpiTotal">Totale Esecuzioni</span>
 <span class="oc-help-badge">?</span>
 </span>
 <span class="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
 <i class="fa-solid fa-bolt text-base"></i>
 </span>
 </div>
 <div class="mt-3 flex items-baseline gap-2">
 <span class="text-[clamp(44px,5.4vw,68px)] font-extrabold text-slate-900 tracking-tight leading-none" id="kpi-total">-</span>
 <span class="text-[13px] text-slate-700" data-i18n="runs.kpiTotalSub">runs registrate</span>
 </div>
 <p class="mt-2 text-[13px] text-teal-700/90 flex items-center gap-1">
 <span data-i18n="runs.kpiClickAll">Clicca per mostrare tutte</span>
 <i class="fa-solid fa-arrow-right rtl:rotate-180 text-[13px] group-hover:translate-x-0.5 transition-transform"></i>
 </p>
 </button>

 <!-- Succeeded Runs -->
 <button type="button" onclick="setStatusFilter('success')" data-tooltip="tt.runsKpiSuccess" class="text-left rtl:text-right bg-emerald-50 hover:bg-emerald-100 rounded-2xl p-4 sm:p-5 transition-colors group" data-ui>
 <div class="flex items-center justify-between">
 <span class="text-[13px] font-bold text-emerald-700 flex items-center gap-1.5">
 <i class="fa-solid fa-circle-check"></i>
 <span data-i18n="runs.kpiSuccess">Partite con Successo</span>
 <span class="oc-help-badge">?</span>
 </span>
 <span class="px-2.5 py-1 rounded-full text-[13px] font-extrabold bg-emerald-500/20 text-emerald-700 " id="kpi-rate">-%</span>
 </div>
 <div class="mt-3 flex items-baseline gap-2">
 <span class="text-[clamp(44px,5.4vw,68px)] font-extrabold text-emerald-700 tracking-tight leading-none" id="kpi-succeeded">-</span>
 <span class="text-[13px] text-emerald-700/80" data-i18n="runs.kpiSuccessSub">completate OK</span>
 </div>
 <div class="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
 <div id="kpi-rate-bar" class="bg-emerald-400 h-full rounded-full transition-colors duration-300" style="width: 0%"></div>
 </div>
 </button>

 <!-- Failed Runs -->
 <button type="button" onclick="setStatusFilter('failed')" data-tooltip="tt.runsKpiFailed" class="text-left rtl:text-right bg-rose-50 hover:bg-rose-100 rounded-2xl p-4 sm:p-5 transition-colors group" data-ui>
 <div class="flex items-center justify-between">
 <span class="text-[13px] font-bold text-rose-800 flex items-center gap-1.5">
 <i class="fa-solid fa-circle-xmark"></i>
 <span data-i18n="runs.kpiFailed">Runs Fallite / Errori</span>
 <span class="oc-help-badge">?</span>
 </span>
 <span class="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-800 flex items-center justify-center">
 <i class="fa-solid fa-triangle-exclamation text-base"></i>
 </span>
 </div>
 <div class="mt-3 flex items-baseline gap-2">
 <span class="text-[clamp(44px,5.4vw,68px)] font-extrabold text-rose-800 tracking-tight leading-none" id="kpi-failed">-</span>
 <span class="text-[13px] text-rose-800/80" id="kpi-failed-sub" data-i18n="runs.kpiFailedSub">errori rilevati</span>
 </div>
 <p class="mt-2 text-[13px] text-rose-800/90 flex items-center gap-1">
 <span data-i18n="runs.kpiFilterFailed">Filtra solo le runs fallite</span>
 <i class="fa-solid fa-filter text-[13px]"></i>
 </p>
 </button>

 <!-- Avg Duration & Last Run -->
 <div data-tooltip="tt.runsKpiAvg" class="bg-darkcard rounded-2xl p-4 sm:p-5 flex flex-col justify-between" data-ui>
 <div class="flex items-center justify-between">
 <span class="text-[13px] font-semibold text-slate-700 flex items-center">
 <span data-i18n="runs.kpiLastRun">Ultima Esecuzione</span>
 <span class="oc-help-badge">?</span>
 </span>
 <span class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
 <i class="fa-solid fa-stopwatch text-base"></i>
 </span>
 </div>
 <div class="mt-3">
 <p class="text-lg font-bold text-slate-900 truncate" id="kpi-last-run">-</p>
 <p class="text-[13px] text-slate-700 mt-1">
 <span data-i18n="runs.kpiAvgDuration">Durata media risposta:</span>
 <strong class="text-slate-700 tabular-nums" id="kpi-avg-duration">-</strong>
 </p>
 </div>
 </div>
 </section>

 <!-- 2. VISUAL TIMELINE BAR STRIP -->
 <section aria-label="Timeline Visiva Ultime Esecuzioni" data-tooltip="tt.runsTimeline" class="bg-darkcard rounded-2xl p-4 sm:p-5 min-h-[220px]" data-ui>
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
 <div>
 <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
 <i class="fa-solid fa-wave-square text-brand-500"></i>
 <span data-i18n="runs.timelineTitle">Sequenza Temporale Ultime Esecuzioni (Cronologia Recente)</span>
 <span class="oc-help-badge">?</span>
 </h2>
 <p class="text-[13px] text-slate-700" data-i18n="runs.timelineSub">Ogni barra rappresenta una run (da sinistra = meno recente, a destra = più recente). Clicca su una barra per saltare al dettaglio.</p>
 </div>
 <div class="flex items-center gap-4 text-[13px] font-semibold">
 <span class="flex items-center gap-1.5 text-emerald-700">
 <span class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
 <span data-i18n="runs.legendSuccess"> Successo</span>
 </span>
 <span class="flex items-center gap-1.5 text-rose-800">
 <span class="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
 <span data-i18n="runs.legendFailed"> Fallita</span>
 </span>
 </div>
 </div>
 <div id="timeline-strip" class="flex items-end gap-1.5 h-14 pt-2 px-2 bg-slate-100/70 rounded-xl 80 overflow-x-auto">
 <div class="text-[13px] text-slate-700 py-3 px-2">...</div>
 </div>
 </section>

 <!-- 3. PER-JOB HEALTH BREAKDOWN CARDS -->
 <section aria-label="Stato di Salute per Singolo Cron Job" class="space-y-3">
 <div class="flex items-center justify-between">
 <div data-tooltip="tt.runsByJob">
 <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
 <i class="fa-solid fa-layer-group text-teal-600"></i>
 <span data-i18n="runs.byJobTitle">Esiti per Singolo Cron Job</span>
 <span class="oc-help-badge">?</span>
 </h2>
 <p class="text-[13px] text-slate-700" data-i18n="runs.byJobSub">Clicca su una card per filtrare le esecuzioni di quello specifico job</p>
 </div>
 <button id="clear-job-filter-btn" onclick="setJobFilter('all')" class="hidden text-[13px] font-semibold text-teal-600 hover:text-teal-700 bg-teal-500/10 px-3 py-1 rounded-lg ">
 <i class="fa-solid fa-xmark mr-1"></i> <span data-i18n="runs.showAllJobs">Mostra tutti i Job</span>
 </button>
 </div>
 <div id="by-job-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
 <!-- Populated by JS -->
 </div>
 </section>

 <!-- 4. FILTER BAR & SEARCH -->
 <section aria-label="Filtri Lista Esecuzioni" class="bg-darkcard rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:sticky lg:top-16 z-30 bg-darkcard">
 <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filtra per esito">
 <button type="button" id="filter-btn-all" onclick="setStatusFilter('all')" data-tooltip="tt.runsKpiTotal" class="px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 bg-brand-600 text-white">
 <span data-i18n="runs.filterAll">Tutte</span>
 <span id="badge-count-all" class="px-1.5 py-0.5 rounded-md bg-slate-500/20 text-[13px]">0</span>
 </button>
 <button type="button" id="filter-btn-success" onclick="setStatusFilter('success')" data-tooltip="tt.runsKpiSuccess" class="px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 bg-slate-100 text-emerald-700 hover:bg-emerald-950/50">
 <i class="fa-solid fa-check"></i>
 <span data-i18n="runs.filterSuccess">Partite con Successo</span>
 <span id="badge-count-success" class="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 text-[13px]">0</span>
 </button>
 <button type="button" id="filter-btn-failed" onclick="setStatusFilter('failed')" data-tooltip="tt.runsKpiFailed" class="px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 bg-slate-100 text-rose-800 hover:bg-rose-950/50">
 <i class="fa-solid fa-xmark"></i>
 <span data-i18n="runs.filterFailed">Fallite</span>
 <span id="badge-count-failed" class="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-800 text-[13px]">0</span>
 </button>
 </div>

 <!-- Job Dropdown + Search Input -->
 <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
 <select id="job-filter-select" onchange="setJobFilter(this.value)" aria-label="Filtra per Cron Job" class="bg-slate-100 text-slate-700 text-[13px] font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500">
 <option value="all" data-i18n="runs.allJobsOption">Tutti i Cron Job</option>
 </select>

 <div class="relative flex-1">
 <i class="fa-solid fa-magnifying-glass absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-700 text-[13px]"></i>
 <input
 type="search"
 id="runs-search-input"
 oninput="onSearchInput(this.value)"
 data-i18n-placeholder="runs.searchPlaceholder"
 placeholder="Cerca per nome job, testo output, errore o ID sessione..."
 aria-label="Cerca nelle esecuzioni"
 class="w-full bg-slate-100 text-slate-900 placeholder-gray-500 text-[13px] rounded-xl pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 focus:outline-none focus:border-brand-500"
 />
 </div>
 </div>
 </section>

 <!-- 5. RUNS FEED LIST -->
 <section aria-label="Elenco Dettagliato Esecuzioni" class="space-y-3">
 <div class="flex items-center justify-between px-1">
 <h2 class="text-base font-bold text-slate-700" id="list-heading" data-i18n="runs.listHeading">Elenco Esecuzioni Recenti</h2>
 <span class="text-[13px] text-slate-700" id="showing-counter">...</span>
 </div>

 <div id="runs-list-container" class="space-y-3">
 <div class="bg-darkcard rounded-2xl p-8 text-center text-slate-700 text-base">
 <i class="fa-solid fa-circle-notch fa-spin text-brand-500 text-xl mb-2"></i>
 </div>
 </div>
 </section>

 </main>

 <script>
 ${getUiEnhancementsScript()}

 let allRuns = [];
 let statsData = { total: 0, succeeded: 0, failed: 0, skipped: 0, successRate: 100, avgDurationMs: 0, lastRunAt: null };
 let byJobData = [];
 let currentStatusFilter = 'all';
 let currentJobFilter = 'all';
 let currentSearchQuery = '';
 let autoRefreshTimer = null;
 const expandedRunIds = new Set();

 function escapeHtml(str) {
 if (str === null || str === undefined) return '';
 return String(str)
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#039;');
 }

 function formatDateTime(iso) {
 if (!iso) return '-';
 try {
 const d = new Date(iso);
 if (isNaN(d.getTime())) return String(iso);
 const loc = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'it-IT';
 return d.toLocaleString(loc, {
 day: '2-digit',
 month: 'short',
 year: 'numeric',
 hour: '2-digit',
 minute: '2-digit',
 second: '2-digit'
 });
 } catch {
 return String(iso);
 }
 }

 function formatRelativeTime(iso) {
 if (!iso) return '-';
 const ms = Date.now() - new Date(iso).getTime();
 if (isNaN(ms)) return '';
 if (ms < 0) return '0s';
 const sec = Math.floor(ms / 1000);
 if (sec < 60) return sec + 's';
 const min = Math.floor(sec / 60);
 if (min < 60) return min + 'm';
 const hr = Math.floor(min / 60);
 if (hr < 24) return hr + 'h ' + (min % 60) + 'm';
 const days = Math.floor(hr / 24);
 return days + 'd';
 }

 function formatDuration(ms) {
 if (ms === null || ms === undefined || isNaN(ms)) return '-';
 if (ms < 1000) return ms + ' ms';
 const s = (ms / 1000).toFixed(1);
 return s + ' s';
 }

 async function loadRunsData(manual = false) {
 const icon = document.getElementById('refresh-icon');
 if (manual && icon) icon.classList.add('fa-spin');
 try {
 const res = await fetch('/api/runs?limit=250');
 const data = await res.json();
 if (data && data.ok) {
 allRuns = Array.isArray(data.runs) ? data.runs : [];
 statsData = data.stats || statsData;
 byJobData = Array.isArray(data.byJob) ? data.byJob : [];
 renderKpis();
 renderTimelineStrip();
 renderByJobCards();
 populateJobDropdown();
 renderRunsList();
 }
 } catch (err) {
 console.error('Errore caricamento runs:', err);
 } finally {
 if (manual && icon) setTimeout(() => icon.classList.remove('fa-spin'), 250);
 }
 }

 function renderKpis() {
 document.getElementById('kpi-total').textContent = statsData.total;
 document.getElementById('kpi-succeeded').textContent = statsData.succeeded;
 document.getElementById('kpi-failed').textContent = statsData.failed;
 document.getElementById('kpi-rate').textContent = statsData.successRate + '% OK';
 document.getElementById('kpi-rate-bar').style.width = Math.min(100, Math.max(0, statsData.successRate)) + '%';

 document.getElementById('kpi-last-run').textContent = statsData.lastRunAt
 ? formatRelativeTime(statsData.lastRunAt) + ' (' + formatDateTime(statsData.lastRunAt) + ')'
 : '-';
 document.getElementById('kpi-avg-duration').textContent = statsData.avgDurationMs
 ? formatDuration(statsData.avgDurationMs)
 : '-';

 document.getElementById('badge-count-all').textContent = allRuns.length;
 document.getElementById('badge-count-success').textContent = allRuns.filter(r => r.status === 'success').length;
 document.getElementById('badge-count-failed').textContent = allRuns.filter(r => r.status === 'failed').length;
 }

 function renderTimelineStrip() {
 const container = document.getElementById('timeline-strip');
 const recent = allRuns.slice(0, 48).reverse();
 if (recent.length === 0) {
 container.innerHTML = '<div class="text-[13px] text-slate-700 py-2">-</div>';
 return;
 }

 container.innerHTML = recent.map((r) => {
 const isOk = r.status === 'success';
 const isFail = r.status === 'failed';
 const colorClass = isOk
 ? 'bg-emerald-500 hover:bg-emerald-400 h-9'
 : isFail
 ? 'bg-rose-500 hover:bg-rose-400 h-10 ring-2 ring-rose-400/50'
 : 'bg-amber-500 hover:bg-amber-400 h-6';
 const symbol = isOk ? '' : isFail ? '' : '⏭';
 const label = escapeHtml(
 symbol + ' ' + r.jobTitle + ' - ' + (isOk ? t('runs.statusSuccess') : t('runs.statusFailed')) + ' (' + formatDateTime(r.startedAt) + ')'
 );
 return \`
 <button
 type="button"
 data-run-id="\${escapeHtml(r.id)}"
 onclick="scrollToRun(this.dataset.runId)"
 data-tooltip-raw="\${label}"
 aria-label="\${label}"
 class="flex-1 min-w-[10px] max-w-[22px] rounded-t-md transition-colors \${colorClass} flex items-start justify-center pt-0.5 text-[13px] font-black text-black/80"
 >\${isFail ? '!' : ''}</button>
 \`;
 }).join('');
 }

 function renderByJobCards() {
 const grid = document.getElementById('by-job-grid');
 const clearBtn = document.getElementById('clear-job-filter-btn');
 if (currentJobFilter !== 'all') {
 clearBtn.classList.remove('hidden');
 } else {
 clearBtn.classList.add('hidden');
 }

 if (byJobData.length === 0) {
 grid.innerHTML = '<div class="col-span-full text-[13px] text-slate-700 bg-darkcard rounded-xl p-4">-</div>';
 return;
 }

 grid.innerHTML = byJobData.map((j) => {
 const total = j.total || 0;
 const okPct = total > 0 ? Math.round((j.succeeded / total) * 100) : 100;
 const isSelected = currentJobFilter === j.jobTitle || currentJobFilter === j.jobId;
 const hasFailures = j.failed > 0;
 const borderClass = isSelected
 ? 'border-brand-500 ring-2 ring-brand-500/40 bg-slate-100'
 : hasFailures && j.lastStatus === 'failed'
 ? 'border-rose-500/40 bg-darkcard hover:border-rose-500/70'
 : 'border-darkborder bg-darkcard hover:border-slate-300';

 const isMaxReached = j.enabled && j.maxRuns > 0 && j.runCount >= j.maxRuns;
 const statusBadge = isMaxReached
 ? \`<span data-tooltip="tt.maxRunsBadge" class="px-2 py-0.5 rounded-full text-[13px] font-bold bg-amber-500/15 text-amber-700 ">\${escapeHtml(t('job.completed'))} (\${j.runCount}/\${j.maxRuns})</span>\`
 : j.enabled
 ? \`<span data-tooltip="tt.kpiActive" class="px-2 py-0.5 rounded-full text-[13px] font-bold bg-emerald-500/15 text-emerald-700 ">● \${escapeHtml(t('job.active'))}</span>\`
 : \`<span data-tooltip="tt.toggleBtn" class="px-2 py-0.5 rounded-full text-[13px] font-bold bg-slate-200 text-slate-700">⏸ \${escapeHtml(t('job.paused'))}</span>\`;

 const lastOutcomeBadge = j.lastStatus === 'success'
 ? \`<span class="text-emerald-700 font-bold">\${escapeHtml(t('runs.legendSuccess'))}</span>\`
 : j.lastStatus === 'failed'
 ? \`<span class="text-rose-800 font-bold">\${escapeHtml(t('runs.legendFailed'))}</span>\`
 : '<span class="text-slate-700">-</span>';

 return \`
 <div
 data-job-title="\${escapeHtml(j.jobTitle)}"
 onclick="setJobFilter(this.dataset.jobTitle)"
 role="button"
 tabindex="0"
 data-tooltip="tt.runsByJob"
 onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();setJobFilter(this.dataset.jobTitle);}"
 class="rounded-2xl border p-4 transition-colors cursor-pointer \${borderClass}"
 >
 <div class="flex items-start justify-between gap-2">
 <div class="min-w-0">
 <h3 class="text-base font-bold text-slate-900 truncate">\${escapeHtml(j.jobTitle)}</h3>
 <p class="text-[13px] text-slate-700 mt-0.5">\${lastOutcomeBadge} · \${j.lastRunAt ? formatRelativeTime(j.lastRunAt) : '-'}</p>
 </div>
 \${statusBadge}
 </div>

 <div class="mt-3 flex items-center justify-between text-[13px] font-semibold">
 <span class="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 25">
 \${j.succeeded}
 </span>
 <span class="px-2.5 py-1 rounded-lg \${j.failed > 0 ? 'bg-rose-500/20 text-rose-800 ' : 'bg-slate-200/70 text-slate-700 '}">
 \${j.failed}
 </span>
 <span class="text-slate-700 tabular-nums text-[13px]">\${okPct}%</span>
 </div>

 <div class="mt-2.5 w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
 <div class="bg-emerald-500 h-full" style="width: \${okPct}%"></div>
 <div class="bg-rose-500 h-full" style="width: \${100 - okPct}%"></div>
 </div>
 </div>
 \`;
 }).join('');
 }

 function populateJobDropdown() {
 const sel = document.getElementById('job-filter-select');
 const titles = Array.from(new Set(allRuns.map(r => r.jobTitle))).filter(Boolean);
 const current = currentJobFilter;
 sel.innerHTML = \`<option value="all">\${escapeHtml(t('runs.allJobsOption'))} (\${titles.length})</option>\` +
 titles.map(title => \`<option value="\${escapeHtml(title)}" \${title === current ? 'selected' : ''}>\${escapeHtml(title)}</option>\`).join('');
 }

 function setStatusFilter(status) {
 currentStatusFilter = status;
 const btns = {
 all: document.getElementById('filter-btn-all'),
 success: document.getElementById('filter-btn-success'),
 failed: document.getElementById('filter-btn-failed')
 };
 btns.all.className = 'px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 ' +
 (status === 'all' ? 'bg-brand-600 text-white ' : 'bg-slate-100 text-slate-700  hover:bg-slate-200');
 btns.success.className = 'px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 ' +
 (status === 'success' ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50' : 'bg-slate-100 text-emerald-700  hover:bg-emerald-100');
 btns.failed.className = 'px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2 ' +
 (status === 'failed' ? 'bg-rose-600 text-white ring-2 ring-rose-400/50' : 'bg-slate-100 text-rose-800  hover:bg-rose-100');

 renderRunsList();
 }

 function setJobFilter(jobTitleOrAll) {
 currentJobFilter = (currentJobFilter === jobTitleOrAll && jobTitleOrAll !== 'all') ? 'all' : jobTitleOrAll;
 const sel = document.getElementById('job-filter-select');
 if (sel) sel.value = currentJobFilter;
 renderByJobCards();
 renderRunsList();
 }

 function onSearchInput(val) {
 currentSearchQuery = (val || '').trim().toLowerCase();
 renderRunsList();
 }

 function toggleExpandRun(runId) {
 if (expandedRunIds.has(runId)) expandedRunIds.delete(runId);
 else expandedRunIds.add(runId);
 renderRunsList();
 }

 function scrollToRun(runId) {
 currentStatusFilter = 'all';
 currentJobFilter = 'all';
 renderRunsList();
 setTimeout(() => {
 const el = document.getElementById('run-card-' + runId);
 if (el) {
 el.scrollIntoView({ behavior: 'smooth', block: 'center' });
 el.classList.add('ring-2', 'ring-brand-500');
 setTimeout(() => el.classList.remove('ring-2', 'ring-brand-500'), 2200);
 }
 }, 50);
 }

 function renderRunsList() {
 const container = document.getElementById('runs-list-container');
 const counter = document.getElementById('showing-counter');

 const filtered = allRuns.filter((r) => {
 if (currentStatusFilter !== 'all' && r.status !== currentStatusFilter) return false;
 if (currentJobFilter !== 'all' && r.jobTitle !== currentJobFilter && r.jobId !== currentJobFilter) return false;
 if (currentSearchQuery) {
 const hay = [r.jobTitle, r.jobId, r.sessionID, r.outputPreview, r.error, r.model].filter(Boolean).join(' ').toLowerCase();
 if (!hay.includes(currentSearchQuery)) return false;
 }
 return true;
 });

 counter.textContent = \`\${filtered.length} / \${allRuns.length}\`;

 if (filtered.length === 0) {
 container.innerHTML = \`
 <div class="bg-darkcard rounded-2xl p-10 text-center space-y-3">
 <div class="w-12 h-12 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center mx-auto">
 <i class="fa-solid fa-filter-circle-xmark text-xl"></i>
 </div>
 <button onclick="currentStatusFilter='all';currentJobFilter='all';currentSearchQuery='';document.getElementById('runs-search-input').value='';setStatusFilter('all');setJobFilter('all');" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[13px] font-bold">
 \${escapeHtml(t('runs.filterAll'))}
 </button>
 </div>
 \`;
 return;
 }

 container.innerHTML = filtered.map((r) => {
 const isOk = r.status === 'success';
 const isFail = r.status === 'failed';

 const cardBorder = isOk
 ? 'border-darkborder hover:border-slate-300'
 : isFail
 ? 'border-rose-500/30 bg-rose-100/60 hover:border-rose-500/50'
 : 'border-darkborder';

 const statusBadge = isOk
 ? \`<span data-tooltip="tt.runsKpiSuccess" class="status-pill-success inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-extrabold bg-emerald-500/20 text-emerald-700 ">
 <i class="fa-solid fa-circle-check text-emerald-700"></i> \${escapeHtml(t('runs.statusSuccess'))}
 </span>\`
 : isFail
 ? \`<span data-tooltip="tt.runsKpiFailed" class="status-pill-failed inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-extrabold bg-rose-500/15 text-rose-800 50">
 <i class="fa-solid fa-circle-xmark text-rose-800"></i> \${escapeHtml(t('runs.statusFailed'))}
 </span>\`
 : \`<span class="status-pill-skipped inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-extrabold bg-amber-500/20 text-amber-700 ">
 \${escapeHtml(t('runs.statusSkipped'))}
 </span>\`;

 const runNumBadge = r.runNumber
 ? \`<span class="px-2 py-0.5 rounded-md text-[13px] tabular-nums font-bold bg-slate-200 text-teal-700">Run #\${r.runNumber}</span>\`
 : '';

 const durationBadge = r.durationMs !== null && r.durationMs !== undefined
 ? \`<span data-tooltip="tt.runsKpiAvg" class="inline-flex items-center gap-1 text-[13px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
 <i class="fa-regular fa-clock text-slate-700"></i> \${formatDuration(r.durationMs)}
 </span>\`
 : '';

 const modelBadge = r.model
 ? \`<span class="inline-flex items-center gap-1 text-[13px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg tabular-nums">
 <i class="fa-solid fa-microchip text-teal-600"></i> \${escapeHtml(r.model)}
 </span>\`
 : '';

 const tokensBadge = r.tokens && (r.tokens.input || r.tokens.output)
 ? \`<span class="inline-flex items-center gap-1 text-[13px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg tabular-nums">
 \${((r.tokens.input + r.tokens.output) / 1000).toFixed(1)}k tok
 </span>\`
 : '';

 const chatLink = r.sessionID
 ? \`<a href="/?session=\${encodeURIComponent(r.sessionID)}&tab=chat" data-tooltip="tt.tabChat" class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-700 hover:text-white bg-teal-500/15 hover:bg-teal-600/40 px-3 py-1 rounded-lg transition-colors">
 <i class="fa-solid fa-comments"></i> \${escapeHtml(t('runs.openInChat'))}
 </a>\`
 : '';

 const isExpanded = expandedRunIds.has(r.id);
 const rawPreview = r.outputPreview || '';
 const isLong = rawPreview.length > 260;
 const displayedPreview = (!isExpanded && isLong) ? rawPreview.slice(0, 260) + '…' : rawPreview;

 const errorBlock = r.error
 ? \`<div class="mt-3 p-3.5 rounded-xl bg-rose-50 text-rose-800 text-[13px] tabular-nums whitespace-pre-wrap break-words">
 <div class="font-sans font-bold text-rose-800 mb-1 flex items-center gap-1.5">
 <i class="fa-solid fa-triangle-exclamation"></i> \${escapeHtml(t('runs.errorLabel'))}
 </div>\${escapeHtml(r.error)}
 </div>\`
 : '';

 const outputBlock = displayedPreview
 ? \`<div class="mt-3 p-3.5 rounded-xl bg-slate-100/80 90 text-slate-700 text-[13px] leading-relaxed whitespace-pre-wrap break-words">
 <div class="flex items-center justify-between mb-1">
 <span class="text-[13px] font-semibold text-slate-700">\${escapeHtml(t('runs.outputLabel'))}</span>
 \${isLong ? \`<button type="button" data-run-id="\${escapeHtml(r.id)}" onclick="toggleExpandRun(this.dataset.runId)" class="text-[13px] font-bold text-teal-600 hover:text-teal-700">\${escapeHtml(isExpanded ? t('runs.expandLess') : t('runs.expandMore'))}</button>\` : ''}
 </div>\${escapeHtml(displayedPreview)}
 </div>\`
 : '';

 return \`
 <article id="run-card-\${escapeHtml(r.id)}" class="bg-darkcard border \${cardBorder} rounded-2xl p-4 sm:p-5 transition-colors">
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div class="flex flex-wrap items-center gap-2.5">
 \${statusBadge}
 <h3 class="text-base font-bold text-slate-900">\${escapeHtml(r.jobTitle)}</h3>
 \${runNumBadge}
 </div>

 <div class="flex flex-wrap items-center gap-2">
 <span class="text-[13px] font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
 <i class="fa-regular fa-calendar text-teal-600 mr-1"></i>
 \${formatDateTime(r.startedAt)}
 <span class="text-teal-700 font-bold ml-1">(\${formatRelativeTime(r.startedAt)})</span>
 </span>
 \${chatLink}
 </div>
 </div>

 <div class="mt-2.5 flex flex-wrap items-center gap-2">
 \${durationBadge}
 \${modelBadge}
 \${tokensBadge}
 \${r.sessionID ? \`<span class="text-[13px] text-gray-500 tabular-nums">Session: \${escapeHtml(r.sessionID)}</span>\` : ''}
 </div>

 \${errorBlock}
 \${outputBlock}
 </article>
 \`;
 }).join('');
 }

 function toggleAutoRefresh(enabled) {
 if (autoRefreshTimer) {
 clearInterval(autoRefreshTimer);
 autoRefreshTimer = null;
 }
 if (enabled) {
 autoRefreshTimer = setInterval(() => loadRunsData(false), 5000);
 }
 }

 window.addEventListener('DOMContentLoaded', () => {
 loadRunsData(true).then(() => { initEntranceMotion(); }).catch(() => {});
 initEntranceMotion();
 toggleAutoRefresh(true);
 });
  </script>
</body>
</html>`;
}
