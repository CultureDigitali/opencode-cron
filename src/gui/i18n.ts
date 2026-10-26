/**
 * Shared UI/UX Enhancement Suite for OpenCode Cron GUI (/ and /runs):
 * 1. 10-Language i18n Dictionary (it, en, es, fr, de, pt, zh, ja, ar [RTL], ru)
 * 2. Universal Accessible Tooltip Engine (WCAG 2.1 AA, role="tooltip", keyboard + pointer)
 * 3. Interactive In-App Guide & Documentation Drawer (5 sections + keyboard shortcut '?')
 * 4. Dismissible Quick-Start Onboarding Banner
 */

export function escapeHtml(str: string): string {
 if (!str) return "";
 return String(str)
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;")
 .replace(/'/g, "&#039;");
}

export function getUiEnhancementsHeadStyle(): string {
 return `
 /* ---- Signal-room atmosphere (shared / /runs /instructions) ---- */
 body {
 background-color: #070B12;
 }
 /* ---- Shared Mandate chrome ---- */
 .oc-brand-mark {
 width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
 background: #101828; color: #fff; display: flex; align-items: center; justify-content: center;
 }
 /* ---- Responsive foundation (mobile-first, shared / /runs /instructions) ---- */
 html { -webkit-text-size-adjust: 100%; overflow-x: clip; }
 body { overflow-x: hidden; text-rendering: optimizeLegibility; }
 img, video, canvas, pre, table { max-width: 100%; }
 pre { overflow-x: auto; -webkit-overflow-scrolling: touch; }
 .tabular { font-variant-numeric: tabular-nums; }
 ::selection { background: #0d9488; color: #fff; }
 :focus-visible { outline: 2px solid #2dd4bf; outline-offset: 2px; border-radius: 6px; }
 /* Safe-area for notch / home indicator */
 body {
 padding-top: env(safe-area-inset-top, 0px);
 padding-bottom: env(safe-area-inset-bottom, 0px);
 padding-left: env(safe-area-inset-left, 0px);
 padding-right: env(safe-area-inset-right, 0px);
 }
 /* Scrollable tab / pill bars: never wrap-push the header */
 .oc-scrollrow { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
 .oc-scrollrow::-webkit-scrollbar { display: none; }
 .oc-scrollrow > * { flex-shrink: 0; }
 /* Touch targets: 44px minimum on touch input */
 @media (pointer: coarse) {
 button, a, select, input[type="checkbox"], input[type="radio"] { min-height: 40px; }
 nav[role="tablist"] .tab-btn, nav[role="tablist"] a { min-height: 44px; display: inline-flex; align-items: center; }
 .tab-btn, button.tab-btn { padding-top: 0.65rem; padding-bottom: 0.65rem; }
 }
 @media (hover: none) {
 .group:hover .group-hover\\:translate-x-0\\.5 { transform: none; }
 }
 /* Small screens: fluid type + tighter cards */
 @media (max-width: 640px) {
 main { padding-left: max(1rem, env(safe-area-inset-left)); padding-right: max(1rem, env(safe-area-inset-right)); }
 h1 { line-height: 1.2; overflow-wrap: break-word; }
 p, h2, h3 { overflow-wrap: break-word; }
 #toast-container { left: 1rem; right: 1rem; bottom: max(1rem, env(safe-area-inset-bottom)); }
 #toast-container > div { width: 100%; }
 }
 /* Landscape phones: keep sticky filter bars usable */
 @media (max-height: 500px) and (orientation: landscape) {
 #chat-messages, #memory-editor, #memory-preview { max-height: 60vh; }
 }
 /* Universal Accessible Tooltip (#oc-tooltip) */
 #oc-tooltip {
 position: fixed;
 z-index: 9999;
 max-width: 21rem;
 padding: 0.65rem 0.85rem;
 border-radius: 0.75rem;
 background: rgba(15, 23, 42, 0.98);
 color: #f8fafc;
 border: 1px solid rgba(13, 148, 136, 0.45);
 box-shadow: 0 14px 30px -5px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.06); /* taste-skill-ignore */
 font-size: 0.75rem;
 line-height: 1.45;
 pointer-events: none;
 opacity: 0;
 transform: translateY(4px);
 transition: opacity 0.14s ease, transform 0.14s ease;
 backdrop-filter: blur(8px);
 }
 #oc-tooltip[data-visible="true"] {
 opacity: 1;
 transform: translateY(0);
 }
 #oc-tooltip .oc-tt-title {
 font-weight: 700;
 color: #5eead4;
 margin-bottom: 0.2rem;
 display: flex;
 align-items: center;
 gap: 0.35rem;
 }
 [data-tooltip], [data-tooltip-raw] {
 position: relative;
 }
 .oc-help-badge {
 display: inline-flex;
 align-items: center;
 justify-content: center;
 width: 1rem;
 height: 1rem;
 border-radius: 9999px;
 font-size: 0.65rem;
 font-weight: 700;
 background: rgba(13, 148, 136, 0.16);
 color: #5eead4;
 border: 1px solid rgba(13, 148, 136, 0.35);
 cursor: help;
 margin-inline-start: 0.35rem;
 vertical-align: middle;
 transition: background-color 0.15s ease, color 0.15s ease;
 }
 .oc-help-badge:hover, .oc-help-badge:focus-visible {
 background: rgba(13, 148, 136, 0.35);
 color: #ffffff;
 outline: 2px solid #2dd4bf;
 outline-offset: 1px;
 }
 /* RTL support adjustments */
 html[dir="rtl"] .space-x-1 > :not([hidden]) ~ :not([hidden]),
 html[dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]),
 html[dir="rtl"] .space-x-2\\.5 > :not([hidden]) ~ :not([hidden]),
 html[dir="rtl"] .space-x-3 > :not([hidden]) ~ :not([hidden]) {
 --tw-space-x-reverse: 1;
 }
 @media (forced-colors: active) {
 #oc-tooltip {
 border: 2px solid CanvasText !important;
 background: Canvas !important;
 color: CanvasText !important;
 }
 }
 `;
}

export function getUiEnhancementsBodyHtml(): string {
 return `
 <!-- Universal Accessible Floating Tooltip -->
 <div id="oc-tooltip" role="tooltip" aria-hidden="true"></div>

 <!-- Interactive In-App Guide & Instructions Drawer -->
 <div id="oc-guide-backdrop" onclick="closeGuideDrawer()" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 hidden transition-opacity"></div>
 <aside
 id="oc-guide-drawer"
 role="dialog"
 aria-modal="true"
 aria-labelledby="oc-guide-title"
 aria-hidden="true"
 tabindex="-1"
 class="fixed top-0 right-0 rtl:right-auto rtl:left-0 h-dvh w-full max-w-[min(36rem,100vw)] bg-darkcard z-50 shadow-2xl transform translate-x-full rtl:-translate-x-full transition-transform duration-200 flex flex-col" /* taste-skill-ignore */
 >
 <!-- Drawer Header -->
 <div class="px-6 py-4 flex items-center justify-between bg-slate-100">
 <div class="flex items-center gap-3">
 <div class="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-700 flex items-center justify-center">
 <i class="fa-solid fa-book-open text-sm"></i>
 </div>
 <div>
 <h2 id="oc-guide-title" class="text-base font-bold text-slate-900" data-i18n="guide.title">Guida & Istruzioni OpenCode Cron</h2>
 <p class="text-[13px] text-slate-700" data-i18n="guide.subtitle">Manuale interattivo, architettura e risoluzione problemi</p>
 </div>
 </div>
 <button
 type="button"
 onclick="closeGuideDrawer()"
 aria-label="Chiudi guida"
 class="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-300/70 transition-colors"
 >
 <i class="fa-solid fa-xmark"></i>
 </button>
 </div>

 <!-- Drawer Content -->
 <div class="flex-1 overflow-y-auto p-6 space-y-5 text-base leading-relaxed text-slate-700" id="oc-guide-body">
 <!-- Populated dynamically by renderGuideDrawerContent() in active language -->
 </div>

 <!-- Drawer Footer -->
 <div class="px-6 py-3.5 bg-slate-100 flex items-center justify-between text-[13px]">
 <span class="text-slate-700">
 <kbd class="px-1.5 py-0.5 bg-slate-200 border border-slate-300 rounded text-[13px] text-slate-700">?</kbd>
 <span class="ml-1" data-i18n="guide.shortcutHint">Premi ? in qualsiasi momento per aprire la guida</span>
 </span>
 <button
 type="button"
 onclick="closeGuideDrawer()"
 class="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-colors"
 data-i18n="guide.closeBtn"
 >Ho capito</button>
 </div>
 </aside>

 <!-- Spotlight Guided Walkthrough Backdrop & Highlight Ring -->
 <style>
 #oc-spotlight-ring {
 animation: oc-spotlight-pulse 2s infinite ease-in-out;
 }
 @keyframes oc-spotlight-pulse {
 0%, 100% {
 box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.4), 0 0 25px rgba(13, 148, 136, 0.65); /* taste-skill-ignore */
 border-color: #2dd4bf;
 }
 50% {
 box-shadow: 0 0 0 8px rgba(13, 148, 136, 0.2), 0 0 45px rgba(45, 212, 191, 0.9); /* taste-skill-ignore */
 border-color: #5eead4;
 }
 }
 .oc-tour-highlight-el {
 position: relative !important;
 z-index: 9993 !important;
 outline: 2px solid #2dd4bf !important;
 outline-offset: 4px !important;
 border-radius: 8px !important;
 }
 #oc-spotlight-backdrop.hidden,
 #oc-spotlight-ring.hidden,
 #oc-spotlight-card.hidden,
 #oc-tour-modal.hidden,
 #job-modal.hidden {
 display: none !important;
 visibility: hidden !important;
 opacity: 0 !important;
 pointer-events: none !important;
 }
 </style>

 <div id="oc-spotlight-backdrop" onclick="stopGuidedDemo(event)" class="fixed inset-0 bg-black/75 backdrop-blur-[2px] transition-all duration-300 hidden" style="z-index: 9990;"></div>
 <div id="oc-spotlight-ring" class="fixed rounded-xl border-2 border-teal-400 pointer-events-none transition-all duration-300 hidden" style="z-index: 9992;"></div>

 <!-- Interactive Guided Spotlight Tour Popover Card -->
 <div
 id="oc-spotlight-card"
 role="dialog"
 aria-modal="true"
 aria-labelledby="oc-spotlight-title"
 class="fixed bg-slate-100/95 border-2 border-teal-500/50 rounded-2xl shadow-2xl p-4 sm:p-5 text-slate-700 max-w-[92vw] sm:max-w-md backdrop-blur-xl hidden flex flex-col space-y-3.5 transition-all duration-300" /* taste-skill-ignore */
 style="z-index: 9995;"
 >
 <!-- Card Header -->
 <div class="flex items-center justify-between pb-2.5">
 <div class="flex items-center gap-2">
 <span class="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-600 flex items-center justify-center text-xs">
 <i class="fa-solid fa-wand-magic-sparkles"></i>
 </span>
 <span id="oc-spotlight-badge" class="text-[13px] font-bold tracking-wider uppercase text-teal-700">GUIDA CRONJOB</span>
 <span class="text-gray-600">•</span>
 <span id="oc-spotlight-step-text" class="text-[13px] text-slate-700">Passo 1 di 7</span>
 </div>
 <button
 type="button"
 id="oc-spotlight-close-btn"
 onclick="stopGuidedDemo(event)"
 class="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200 text-sm transition-colors cursor-pointer"
 aria-label="Esci dal tour guidato"
 title="Chiudi demo (Esc)"
 >
 <i class="fa-solid fa-xmark"></i>
 </button>
 </div>

 <!-- Card Content -->
 <div class="space-y-1.5">
 <h4 id="oc-spotlight-title" class="text-sm sm:text-base font-bold text-slate-900 tracking-tight"></h4>
 <p id="oc-spotlight-desc" class="text-xs text-slate-700 leading-relaxed"></p>
 </div>

 <!-- Action Helper (Demo Fill) -->
 <div id="oc-spotlight-helper-container" class="pt-1">
 <button
 type="button"
 id="oc-spotlight-demo-fill-btn"
 onclick="demoFillStepData()"
 class="w-full py-1.5 px-3 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-700 hover:text-slate-900 border border-teal-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
 >
 <i class="fa-solid fa-wand-magic-sparkles text-amber-600 text-xs"></i>
 <span id="oc-spotlight-demo-fill-label">Compila Dati Esempio</span>
 </button>
 </div>

 <!-- Card Footer -->
 <div class="flex items-center justify-between pt-2.5  text-xs gap-2">
 <div class="flex items-center gap-2">
 <button
 type="button"
 id="oc-spotlight-prev-btn"
 onclick="prevSpotlightStep()"
 class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-darkborder transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
 >
 <i class="fa-solid fa-arrow-left mr-1"></i> <span id="oc-spotlight-prev-label">Indietro</span>
 </button>
 <button
 type="button"
 id="oc-spotlight-skip-btn"
 onclick="stopGuidedDemo(event)"
 class="text-slate-600 hover:text-slate-700 text-xs transition-colors cursor-pointer px-1.5 py-1"
 >
 <span id="oc-spotlight-skip-label">Salta</span>
 </button>
 </div>

 <div class="flex items-center gap-1.5" id="oc-spotlight-dots">
 <!-- 7 dots -->
 </div>

 <button
 type="button"
 id="oc-spotlight-next-btn"
 onclick="nextSpotlightStep()"
 class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-teal-700 font-bold border border-teal-700 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
 >
 <span id="oc-spotlight-next-label" class="text-slate-900">Avanti</span> <i class="fa-solid fa-arrow-right text-[13px]"></i>
 </button>
 </div>
 </div>

 <!-- Backward-compatibility stub for tour modal -->
 <div id="oc-tour-modal" class="hidden"></div>
 `;
}

export function getUiEnhancementsScript(): string {
 return `
 // ============================================================================
 // 10-LANGUAGE INTERNATIONALIZATION (i18n) + ACCESSIBLE TOOLTIPS + GUIDE DRAWER
 // Languages: it, en, es, fr, de, pt, zh, ja, ar (RTL), ru
 // ============================================================================
 const OC_SUPPORTED_LANGS = [
 { code: 'it', flag: '🇮🇹', label: 'Italiano' },
 { code: 'en', flag: '🇬🇧', label: 'English' },
 { code: 'es', flag: '🇪🇸', label: 'Español' },
 { code: 'fr', flag: '🇫🇷', label: 'Français' },
 { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
 { code: 'pt', flag: '🇵🇹', label: 'Português' },
 { code: 'zh', flag: '🇨🇳', label: '简体中文' },
 { code: 'ja', flag: '🇯🇵', label: '日本語' },
 { code: 'ar', flag: '🇸🇦', label: 'العربية', rtl: true },
 { code: 'ru', flag: '🇷🇺', label: 'Русский' }
 ];

 const OC_I18N = {
 it: {
 "app.liveBadge": "Web GUI Live",
 "nav.jobs": "Jobs & Cron",
 "nav.chat": "Live Chat",
 "nav.memory": "Memoria",
 "nav.diff": "Git Diff",
 "nav.logs": "Logs",
 "nav.runs": "Esiti Runs",
 "nav.historyRuns": "Storico Runs",
 "nav.newJob": "Nuovo Job",
 "nav.guide": "Guida",
 "nav.dashboard": "Dashboard",
 "kpi.activeTasks": "Task Attivi",
 "kpi.totalRuns": "Totale Esecuzioni (Vedi Esiti →)",
 "kpi.launchd": "Launchd Daemon",
 "kpi.nextTick": "Prossimo Tick",
 "jobs.heading": "Cron Jobs Registrati",
 "jobs.subheading": "Task ricorrenti che scrivono direttamente nelle sessioni di OpenCode",
 "jobs.runDueNow": "Esegui Scaduti Ora",
 "jobs.emptyTitle": "Nessun Cron Job Configurato",
 "jobs.emptyDesc": "Crea il tuo primo task programmato per automatizzare ricerche, monitoraggio o report direttamente dentro una sessione di OpenCode.",
 "jobs.createFirst": "Crea il Primo Cron Job",
 "job.active": "ATTIVO",
 "job.paused": "IN PAUSA",
 "job.completed": "COMPLETATO",
 "job.schedule": "Pianificazione",
 "job.executions": "Esecuzioni",
 "job.lastRun": "Ultimo Run",
 "job.nextRun": "Prossimo",
 "job.viewChat": "Vedi Chat Live",
 "job.memoryBtn": "Memoria",
 "job.editBtn": "Modifica",
 "job.runNowTitle": "Esegui Tick Subito",
 "job.pauseTitle": "Metti in Pausa",
 "job.resumeTitle": "Riattiva",
 "job.deleteTitle": "Elimina Job",
 "chat.sessionsTitle": "Sessioni OpenCode",
 "chat.title": "Live Chat & Feed Sessione",
 "chat.subtitle": "Visualizza e aggiorna in tempo reale i prompt e le risposte generate dai tick automatici",
 "chat.sessionLabel": "Sessione:",
 "chat.searchPlaceholder": "Cerca sessione, cron job o ID...",
 "chat.filterAll": "Tutte",
 "chat.filterCron": " Con Cron",
 "chat.filterMain": " Principali",
 "chat.filterRoot": " Principali",
 "chat.filterSub": " Subagenti",
 "chat.onlyRepo": "Solo Questo Repo",
 "chat.autoRefresh": "Auto-Aggiorna (3s)",
 "chat.promptPlaceholder": "Invia un prompt o istruzione manuale a questa sessione (Invio invia, Shift+Invio a capo)...",
 "chat.send": "Invia",
 "chat.sendBtn": "Invia",
 "memory.title": "Memoria Persistente Cron",
 "memory.subtitle": "File markdown salvati in .opencode/cron/memory/",
 "memory.save": "Salva Modifiche",
 "memory.saveBtn": "Salva Modifiche",
 "memory.editor": "Editor Markdown",
 "memory.preview": "Anteprima Renderizzata",
 "diff.title": "Git Diff & File Changes",
 "diff.subtitle": "Verifica in tempo reale tutti i file creati, modificati o eliminati nel workspace locale.",
 "diff.reload": "Ricarica Diff",
 "diff.refreshBtn": "Aggiorna Diff",
 "diff.filesInvolved": "File Coinvolti",
 "diff.all": "Tutto",
 "logs.title": "Logs & Diagnostica Ticker",
 "logs.subtitle": "Output da ~/Library/Logs/opencode-cron.log e .err",
 "logs.reload": "Ricarica Logs",
 "modal.newTitle": "Nuovo Cron Job",
 "modal.editTitle": "Modifica Cron Job",
 "modal.fieldTitle": "Titolo del Job",
 "modal.fieldSchedule": "Intervallo o Espressione Cron",
 "modal.fieldMaxRuns": "Max Esecuzioni (0 = infinito)",
 "modal.fieldSession": "Sessione Target OpenCode",
 "modal.fieldModel": "Modello LLM (Opzionale)",
 "modal.fieldSystem": "System Prompt (Obiettivo Fisso / Frozen)",
 "modal.fieldFollowup": "Followup Prompt (Istruzione per singolo Tick)",
 "modal.adaptiveTitle": "Cadenza Adattiva (Burst & Idle)",
 "modal.adaptiveHelp": "Accelera la frequenza durante l'attività e rallenta gradualmente quando non ci sono novità per risparmiare risorse e token.",
 "modal.adaptiveBurst": "Burst Interval (min 60s)",
 "modal.adaptiveIdle": "Idle Interval",
 "modal.adaptiveQuiet": "Soglia Quiet (tick)",
 "modal.cancel": "Annulla",
 "modal.save": "Salva Cron Job",
 "job.burstTitle": "Attiva Burst Mode (15m)",
 "job.cadence": "Cadenza",
 "job.burstActive": "BURST",
 "job.idleActive": "IDLE",
 "job.adaptiveBadge": "ADATTIVO",
 "toast.burstActivated": "Burst Mode attivato per 15 minuti!",
 "tt.burstBtn": "Attiva Burst Mode ad alta frequenza per 15m su questo job",
 "modal.pipelineTitle": "Pipeline & Trigger Multi-Job (Workflow DAG)",
 "modal.pipelineHelp": "Collega questo job ad altri job: esegui automaticamente i successivi al termine con successo o su errore.",
 "modal.pipelineOnSuccess": "Esegui su Successo (Job IDs)",
 "modal.pipelineOnFailure": "Esegui su Errore / Fallimento (Job IDs)",
 "modal.pipelinePassPayload": "Inietta contesto/memoria del job padre nei job a valle",
 "job.pipelineBadge": "PIPELINE",
 "job.pipelineOk": "on OK:",
 "job.pipelineErr": "on ERR:",
 "pipeline.headerBtn": "Workflow & DAG",
 "tt.pipelineBtn": "Visualizza il grafo DAG e le dipendenze tra i cron job",
 "pipeline.modalTitle": "Grafo Workflow Pipeline (DAG)",
 "pipeline.emptyGraph": "Nessuna pipeline configurata. Configura 'Esegui su Successo' in un job per creare un workflow.",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Webhook",
 "tt.webhookBtn": "Gestisci l'endpoint webhook e i token di trigger per questo job",
 "webhook.modalTitle": "Endpoint Webhook Inbound & Token",
 "webhook.modalDesc": "Permette a servizi esterni (GitHub, GitLab, Stripe, Sentry, CI/CD, curl) di avviare immediatamente questo job via HTTP.",
 "webhook.urlLabel": "URL Webhook (con Token)",
 "webhook.tokenLabel": "Token Segreto di Autorizzazione",
 "webhook.secretLabel": "Segreto Condiviso HMAC (opzionale per GitHub X-Hub-Signature-256)",
 "webhook.passPayload": "Inietta il payload dell'evento nella memoria persistente del job",
 "webhook.rateLimit": "Cooldown anti-spam (secondi tra trigger consecutivi)",
 "webhook.copyUrl": "Copia URL",
 "webhook.copyCurl": "Copia Comando cURL",
 "webhook.testBtn": "Test Trigger Immediato",
 "webhook.rotateToken": "Rigenera Nuovo Token",
 "webhook.saveBtn": "Salva Configurazione Webhook",
 "webhook.disableBtn": "Disattiva Webhook",
 "toast.webhookCopied": "URL Webhook copiato negli appunti!",
 "toast.webhookCurlCopied": "Comando cURL copiato negli appunti!",
 "toast.webhookSaved": "Configurazione Webhook salvata con successo!",
 "toast.webhookTriggered": "Trigger Webhook inviato con successo!",
 "toast.webhookDisabled": "Webhook disattivato per questo job.",
 "priority.label": "Priorità Job",
 "priority.high": "Alta",
 "priority.normal": "Normale",
 "priority.low": "Bassa",
 "tt.priorityHigh": "Priorità Alta: ha la precedenza sui worker disponibili",
 "tt.priorityNormal": "Priorità Normale: esecuzione ordinaria",
 "tt.priorityLow": "Priorità Bassa: eseguita solo dopo i job ad alta priorità",
 "nav.queue": "Coda & Worker",
 "tt.queueBtn": "Visualizza la coda di priorità e imposta il limite di concorrenza",
 "queue.modalTitle": "Concorrenza & Coda di Priorità",
 "queue.concurrencyTitle": "Limite Concorrenza (Max Workers)",
 "queue.concurrencyHelp": "Numero massimo di job eseguiti contemporaneamente (1-10)",
 "queue.activeTitle": "Job Attivi in Esecuzione",
 "queue.queuedTitle": "Job in Coda d'Attesa",
 "queue.emptyRunning": "Nessun job attualmente in esecuzione.",
 "queue.emptyQueued": "Nessun job in attesa nella coda.",
 "queue.clearBtn": "Svuota Coda",
 "queue.saveSettings": "Salva Limite",
 "toast.queueSaved": "Limite di concorrenza salvato con successo!",
 "toast.queueCancelled": "Job rimosso dalla coda di esecuzione.",
 "toast.queueCleared": "Tutti i job in coda sono stati rimossi.",
 "nav.dlq": "DLQ & Circuit",
 "tt.dlqBtn": "Visualizza i job in quarantena (Dead Letter Queue) e ripristina il circuit breaker",
 "tt.circuitOpen": "Circuit Breaker APERTO: Job in quarantena per fallimenti ripetuti",
 "tt.circuitHalfOpen": "Circuit Breaker HALF-OPEN: Canary run di prova in corso",
 "circuit.open": "Quarantena",
 "circuit.halfOpen": "Canary Test",
 "circuit.resetBtn": "Reset Circuit",
 "dlq.modalTitle": "Dead Letter Queue & Quarantena",
 "dlq.subtitle": "Job bloccati per troppi fallimenti consecutivi. Esegui canary run o rimuovi la quarantena.",
 "dlq.empty": "Nessun job in quarantena. Tutti i cron job funzionano regolarmente!",
 "dlq.retryBtn": "Riprova (Canary)",
 "dlq.resolveBtn": "Risolvi & Riattiva",
 "dlq.deleteBtn": "Elimina Entry",
 "dlq.clearAllBtn": "Svuota DLQ",
 "toast.dlqRetried": "Canary run completata con successo! Job ripristinato.",
 "toast.dlqResolved": "Job rimosso dalla quarantena e circuit breaker ripristinato.",
 "toast.dlqCleared": "Dead Letter Queue svuotata con successo.",
 "toast.dlqDeleted": "Entry DLQ rimossa.",
 "nav.templates": "Modelli",
 "nav.tools": "Strumenti",
 "nav.backup": "Snapshot",
 "nav.metrics": "Metriche",
 "nav.notifications": "Notifiche",
 "tt.templatesBtn": "Sfoglia e installa blueprint e template di cron job preconfigurati",
 "tt.backupBtn": "Crea e ripristina snapshot atomici di job e memoria con verifica SHA-256",
 "tt.metricsBtn": "Visualizza metriche di latenza real-time, percentili p95 ed esportatore Prometheus",
 "tt.notifyBtn": "Configura canali di notifica e webhook per Slack, Discord o endpoint HTTP",
 "templates.modalTitle": "Modelli & Blueprint Job",
 "templates.subtitle": "Seleziona e installa con 1 click workflow di monitoraggio, sicurezza e manutenzione pronti all'uso.",
 "templates.applyBtn": "Installa Blueprint",
 "templates.appliedSuccess": "Blueprint installato con successo!",
 "templates.empty": "Nessun template disponibile.",
 "backup.modalTitle": "Snapshot & Backup Point-in-Time",
 "backup.subtitle": "Crea snapshot atomici di jobs e memoria con verifica checksum SHA-256 e ripristino con 1 click.",
 "backup.createBtn": "Crea Nuovo Snapshot",
 "backup.restoreBtn": "Ripristina",
 "backup.deleteBtn": "Elimina",
 "backup.createdSuccess": "Snapshot creato con successo!",
 "backup.restoredSuccess": "Ripristino completato con successo!",
 "backup.deletedSuccess": "Snapshot eliminato.",
 "backup.confirmRestore": "Sei sicuro di voler ripristinare questo snapshot? Lo stato attuale dei job verrà sovrascritto.",
 "backup.empty": "Nessun backup salvato finora.",
 "metrics.modalTitle": "Metriche & Telemetria Real-Time",
 "metrics.subtitle": "Latenza esecuzioni, percentili p95, tassi di successo ed esportatore Prometheus.",
 "metrics.avgLatency": "Latenza Media",
 "metrics.p95Latency": "Latenza p95",
 "metrics.successRate": "Tasso Successo",
 "metrics.totalRuns": "Esecuzioni Totali",
 "metrics.promEndpoint": "Endpoint Prometheus",
 "metrics.copyEndpoint": "Copia URL Scrape",
 "metrics.copied": "URL Scrape Copiato!",
 "notify.modalTitle": "Notifiche & Alerting Multi-Canale",
 "notify.subtitle": "Invia notifiche automatiche su Slack, Discord o Webhook HTTP in caso di fallimenti o trigger.",
 "notify.slackWebhook": "Webhook Slack URL",
 "notify.discordWebhook": "Webhook Discord URL",
 "notify.genericWebhook": "Webhook HTTP Generico URL",
 "notify.testBtn": "Invia Notifica di Test",
 "notify.savedSuccess": "Impostazioni notifiche salvate!",
 "notify.testSuccess": "Notifica di test inviata con successo!",
 "filter.searchPlaceholder": "Cerca per titolo, tag o ID...",
 "filter.allCategories": "Tutte le Categorie",
 "filter.allStatuses": "Tutti gli Stati",
 "filter.statusEnabled": "Abilitati",
 "filter.statusDisabled": "In Pausa",
 "filter.statusQuarantined": "In Quarantena",
 "filter.tagAll": "Tutti i Tag",
 "filter.empty": "Nessun job corrisponde ai filtri selezionati.",
 "modal.fieldCategory": "Categoria (es. ops, ci, security)",
 "modal.fieldTags": "Tag (separati da virgola)",
 "modal.fieldTimezone": "Fuso Orario (Timezone IANA)",
 "modal.fieldTimeout": "Watchdog Timeout (secondi, min 5)",
 "modal.guardTitle": "Guard Pre-Flight & Health-Check",
 "modal.guardHelp": "Verifica un comando di shell o un endpoint HTTP prima di avviare il tick: se fallisce, il tick viene saltato in sicurezza.",
 "modal.guardCommand": "Comando Shell (exit 0)",
 "modal.guardHttpUrl": "HTTP Health Check URL (status 200)",
 "runs.pageTitle": "Storico Esecuzioni Cron (Runs)",
 "runs.pageSubtitle": "Verifica immediata di quali cron job sono partiti con successo e quali sono falliti",
 "runs.autoRefresh": "Auto-aggiorna (5s)",
 "runs.refreshNow": "Aggiorna Ora",
 "runs.kpiTotal": "Totale Esecuzioni",
 "runs.kpiTotalSub": "runs registrate",
 "runs.kpiClickAll": "Clicca per mostrare tutte",
 "runs.kpiSuccess": "Partite con Successo",
 "runs.kpiSuccessSub": "completate OK",
 "runs.kpiFailed": "Runs Fallite / Errori",
 "runs.kpiFailedSub": "errori rilevati",
 "runs.kpiFilterFailed": "Filtra solo le runs fallite",
 "runs.kpiLastRun": "Ultima Esecuzione",
 "runs.kpiAvgDuration": "Durata media risposta:",
 "runs.timelineTitle": "Sequenza Temporale Ultime Esecuzioni (Cronologia Recente)",
 "runs.timelineSub": "Ogni barra rappresenta una run (da sinistra = meno recente, a destra = più recente). Clicca su una barra per saltare al dettaglio.",
 "runs.legendSuccess": " Successo",
 "runs.legendFailed": " Fallita",
 "runs.byJobTitle": "Esiti per Singolo Cron Job",
 "runs.byJobSub": "Clicca su una card per filtrare le esecuzioni di quello specifico job",
 "runs.showAllJobs": "Mostra tutti i Job",
 "runs.filterAll": "Tutte",
 "runs.filterSuccess": "Partite con Successo",
 "runs.filterFailed": "Fallite",
 "runs.allJobsOption": "Tutti i Cron Job",
 "runs.searchPlaceholder": "Cerca per nome job, testo output, errore o ID sessione...",
 "runs.listHeading": "Elenco Esecuzioni Recenti",
 "runs.statusSuccess": " PARTITA CON SUCCESSO",
 "runs.statusFailed": " ESECUZIONE FALLITA",
 "runs.statusSkipped": "⏭ SALTATA",
 "runs.openInChat": "Apri in Chat",
 "runs.outputLabel": "Risposta del Cron Job:",
 "runs.errorLabel": "Dettaglio Errore / Fallimento:",
 "runs.expandMore": "Espandi tutto ▼",
 "runs.expandLess": "Mostra meno ▲",
 "onboard.title": "Benvenuto in OpenCode Cron - Guida Rapida",
 "onboard.subtitle": "Automatizza task ricorrenti, monitoraggio notizie e controlli codice direttamente nelle sessioni OpenCode.",
 "onboard.step1Title": "1. Pianifica un Job",
 "onboard.step1Desc": "Scegli una sessione principale, imposta l'intervallo (es. 5m o 0 9 * * *) e definisci System + Followup Prompt.",
 "onboard.step2Title": "2. Esecuzione Autonoma 60s",
 "onboard.step2Desc": "Il demone macOS launchd esegue i job scaduti in background anche a browser chiuso e sincronizza il DB SQLite.",
 "onboard.step3Title": "3. Controlla Esiti & Chat",
 "onboard.step3Desc": "Segui le risposte in tempo reale in Live Chat oppure apri la pagina Esiti Runs per vedere successi ed errori.",
 "onboard.dismiss": "Nascondi suggerimenti",
 "guide.title": "Guida & Istruzioni OpenCode Cron",
 "guide.subtitle": "Manuale interattivo, architettura e risoluzione problemi",
 "guide.shortcutHint": "Premi ? in qualsiasi momento per aprire la guida",
 "guide.closeBtn": "Ho capito",
 "guide.sec1Title": " 1. Come Funziona OpenCode Cron (Architettura)",
 "guide.sec1Body": "OpenCode Cron esegue task programmati stile ChatGPT direttamente dentro le tue sessioni OpenCode. Un demone di sistema (macOS launchd 'ai.opencode.cron') controlla ogni 60 secondi il file .opencode/cron/jobs.json. Quando un job è in scadenza, avvia il turno nella sessione scelta, aggiorna la memoria persistente Markdown e sincronizza le tabelle SQLite (v2 -> v1 mirror) affinché i messaggi appaiano sia nella Web GUI sia nell'app desktop.",
 "guide.sec2Title": " 2. Creare o Modificare un Cron Job",
 "guide.sec2Body": "• Titolo & Pianificazione: usa intervalli semplici (es. 1m, 5m, 1h) oppure espressioni Cron a 5 campi (es. '0 9 * * *' per ogni mattina alle 09:00).\\n• Sessione Target: scegli una sessione ' Principale' (consigliato) per mantenere tutto lo storico nella stessa chat.\\n• System Prompt (Frozen): definisce l'identità e le regole fisse dell'agente.\\n• Followup Prompt: è l'istruzione operativa eseguita ad ogni singolo tick.\\n• Max Esecuzioni: imposta 0 per esecuzione continua, oppure un limite (es. 50) per fermare automaticamente il job dopo N cicli.",
 "guide.sec3Title": " 3. Memoria Persistente & Deduplicazione (seenHashes)",
 "guide.sec3Body": "Anche se la chat OpenCode viene compattata dopo centinaia di messaggi, il file .opencode/cron/memory/<jobId>.md preserva fatti chiave, stato e lista degli URL/elementi già visti (seenHashes). Viene iniettato automaticamente prima di ogni tick.",
 "guide.sec4Title": " 4. Pagina Dedicata 'Esiti Runs' (/runs)",
 "guide.sec4Body": "Nella pagina /runs puoi verificare a colpo d'occhio quali esecuzioni sono partite con successo (badge verde ) e quali sono fallite (badge rosso ). Clicca sulle card KPI o sulla barra temporale per filtrare gli errori, leggere lo stack d'errore o aprire il messaggio esatto in Live Chat.",
 "guide.sec5Title": " 5. Sicurezza & Risoluzione Problemi",
 "guide.sec5Body": "• Auto-Pausa dopo 5 errori: se un job fallisce 5 volte consecutive viene messo in pausa automaticamente. Clicca Play per azzerare gli errori e riattivarlo.\\n• Stato COMPLETATO (Max Runs): se un job raggiunge il tetto Max Esecuzioni (es. 50/50), non partirà più finché non aumenti Max Runs o imposti 0.",
 "tt.liveBadge": "Connesso al server locale OpenCode Cron. Il polling si adatta automaticamente se la scheda è in background.",
 "tt.workspaceDir": "Cartella radice del progetto (.opencode/cron/jobs.json e memoria risiedono qui).",
 "tt.tabJobs": "Gestisci, crea, metti in pausa o avvia manualmente i tuoi Cron Job.",
 "tt.tabChat": "Visualizza in tempo reale i messaggi delle sessioni OpenCode e invia prompt manuali.",
 "tt.tabMemory": "Ispeziona e modifica il file Markdown di memoria persistente di ciascun job.",
 "tt.tabDiff": "Controlla i file creati o modificati nel repository Git dai tuoi agenti.",
 "tt.tabLogs": "Visualizza gli ultimi 150 record di stdout/stderr del demone launchd.",
 "tt.tabRuns": "Apri la pagina dedicata con statistiche, timeline e filtro immediato di runs riuscite vs fallite.",
 "tt.kpiActive": "Numero di Cron Job abilitati pronti a partire alla prossima scadenza.",
 "tt.kpiTotalRuns": "Somma totale dei tick eseguiti. Clicca per aprire l'analisi dettagliata su /runs.",
 "tt.kpiLaunchd": "Demone macOS (ai.opencode.cron) attivo in background ogni 60 secondi anche a browser chiuso.",
 "tt.kpiNextTick": "Conto alla rovescia e orario del prossimo Cron Job in scadenza.",
 "tt.runDueBtn": "Forza un controllo immediato ed esegue subito tutti i job la cui scadenza è passata.",
 "tt.runNowBtn": "Esegui immediatamente un singolo tick di questo job fuori programmazione.",
 "tt.toggleBtn": "Metti in pausa il job oppure riattivalo azzerando il contatore errori consecutivi.",
 "tt.deleteBtn": "Elimina definitivamente il job e i suoi file di memoria/log associati.",
 "tt.maxRunsBadge": "Il job ha raggiunto il limite massimo di esecuzioni configurato (Max Runs). Modifica il job per continuare.",
 "tt.runsKpiTotal": "Numero complessivo di esecuzioni ricostruite da history.json, SQLite e log di sistema. Clicca per mostrare tutte.",
 "tt.runsKpiSuccess": "Esecuzioni terminate con codice 0 e risposta valida dell'agente. Clicca per filtrare solo i successi.",
 "tt.runsKpiFailed": "Esecuzioni interrotte per errore, timeout o eccezione. Clicca per isolare subito i fallimenti.",
 "tt.runsKpiAvg": "Durata media di completamento di un turno cron e timestamp dell'ultima esecuzione.",
 "tt.runsTimeline": "Sequenza cronologica delle ultime 48 esecuzioni (verde = successo, rosso = fallita). Clicca su una barra per saltare alla scheda.",
 "tt.runsByJob": "Riepilogo salute per singolo job. Clicca su una card per filtrare l'elenco sottostante.",
 "tt.formSchedule": "Accetta intervalli rapidi (es. 1m, 5m, 2h, 1d) oppure espressioni Cron standard a 5 campi (min ora giorno mese giorno_sett).",
 "tt.formMaxRuns": "Imposta 0 per esecuzione illimitata, oppure un numero (es. 20) per fermare automaticamente il job dopo N tick.",
 "tt.formSystem": "Istruzioni permanenti (frozen) che definiscono ruolo, vincoli e formato di risposta dell'agente.",
 "tt.formFollowup": "Prompt operativo inviato ad ogni tick insieme alla memoria persistente.",
 "tt.sessionCron": "Sessioni collegate a uno o più Cron Job attivi o programmati.",
 "tt.sessionRoot": "Sessioni principali (Root) create dall'utente senza parentID.",
 "tt.sessionSub": "Sessioni figlie generate automaticamente da subagenti o task delegati.",
 "tt.memoryHashes": "Numero di hash/URL già visti (seenHashes) per evitare duplicazioni tra i tick.",
 "chat.setCron": "Imposta Cron",
 "tt.setCronBtn": "Imposta un nuovo Cron Job su questa conversazione",
 "nav.instructions": "Istruzioni",
 "tt.navInstructions": "Manuale completo, architettura e istruzioni dettagliate",
 "tt.navDashboard": "Torna alla dashboard principale e ai job registrati",
 "tour.startBtn": "Demo",
 "tt.tourBtn": "Avvia il tour interattivo guidato di benvenuto",
 "instructions.pageSubtitle": "Manuale interattivo, architettura e istruzioni complete",
 "instructions.heroTitle": "Tutto quello che devi sapere su OpenCode Cron",
 "instructions.heroDesc": "Esegui task autonomi stile ChatGPT direttamente dentro le sessioni OpenCode. Questa guida ti accompagna passo dopo passo nella configurazione, nelle pianificazioni temporali, nella memoria persistente e nella gestione degli esiti.",
 "instructions.searchPlaceholder": "Cerca argomento (es. imposta cron, max runs, launchd, prompt, seenHashes)...",
 "instructions.badge": "Documentazione Ufficiale OpenCode Cron",
 "instructions.sec1Title": "1. Architettura in 60 Secondi: Non un banale timer bash, ma un vero agente programmato",
 "instructions.sec1Sub": "Come OpenCode Cron si differenzia radicalmente da cron di sistema o da semplici script",
 "instructions.sec2Title": "2. Impostare un Cron su una Conversazione (Modalità 1-Click)",
 "instructions.sec2Sub": "Due modalità intuitive per legare un'automazione ricorrente a qualsiasi chat",
 "instructions.sec3Title": "3. Visual Schedule Builder: Orari, Intervalli & Cron a 5 Campi",
 "instructions.sec3Sub": "Tutti i formati supportati e l'anteprima predittiva in tempo reale",
 "instructions.sec4Title": "4. Durata & Fine Programmata: Esecuzione Infinita vs Limite Max Runs",
 "instructions.sec4Sub": "Come stabilire se un compito deve durare per sempre o arrestarsi dopo N cicli",
 "instructions.sec5Title": "5. Memoria Persistente Markdown & Deduplicazione (seenHashes)",
 "instructions.sec5Sub": "Come evitare duplicazioni e preservare lo stato tra un ciclo e l'altro",
 "instructions.sec6Title": "6. Pagina Dedicata 'Esiti Runs' (/runs)",
 "instructions.sec6Sub": "Controllo istantaneo di quali job sono partiti con successo e quali sono falliti",
 "instructions.sec7Title": "7. Demone di Sfondo macOS launchd: Esecuzione Autonoma 24/7",
 "instructions.sec7Sub": "I tuoi compiti girano in background anche con il browser e l'interfaccia chiusi",
 "instructions.sec8Title": "8. FAQ, Sicurezza & Risoluzione Problemi Rapida",
 "instructions.sec8Sub": "Cosa fare in caso di errori consecutivi o riavvio dell'applicazione desktop",
 "modal.deleteTitle": "Conferma Eliminazione",
 "modal.irreversibleAction": "Azione irreversibile",
 "modal.deleteConfirmMsg": "Sei sicuro di voler eliminare il job '{id}'? I tick programmati cesseranno immediatamente.",
 "modal.deleteBtn": "Elimina Definitivamente",
 "chat.noSessions": "Nessuna sessione trovata",
 "chat.noMessages": "Nessun messaggio in questa sessione.",
 "chat.lastUpdated": "Ultimo aggiornamento:",
 "chat.noTextOutput": "*(Nessun output di testo)*",
 "loading.jobs": "Caricamento job in corso...",
 "loading.generic": "Caricamento...",
 "loading.sessions": "Caricamento sessioni...",
 "loading.chat": "Caricamento conversazione in tempo reale...",
 "loading.git": "Caricamento stato Git...",
 "loading.diff": "Caricamento diff...",
 "logs.noStdout": "(Nessun output stdout)",
 "logs.noStderr": "(Nessun errore registrato)",
 "diff.clean": "Working tree pulito, nessuna modifica non committata",
 "diff.changes": "{count} file modificati nel workspace",
 "diff.noChanges": "Nessuna modifica da visualizzare",
 "toast.loadJobsError": "Errore nel caricamento dei job: ",
 "toast.tickRunning": "Esecuzione tick in corso per ",
 "toast.tickSuccess": "Tick completato con successo!",
 "toast.tickError": "Errore tick: ",
 "toast.netError": "Errore di rete: ",
 "toast.jobResumed": "Job riattivato",
 "toast.jobPaused": "Job messo in pausa",
 "toast.genericError": "Errore: ",
 "toast.jobDeleted": "Job eliminato con successo",
 "toast.deleteError": "Errore eliminazione: ",
 "toast.sessionsUpdated": "Lista sessioni aggiornata da SQLite",
 "toast.copySessionSuccess": "Session ID copiato: ",
 "toast.copySessionError": "Impossibile copiare negli appunti",
 "toast.sendError": "Errore invio: ",
 "toast.promptSent": "Prompt inviato alla sessione",
 "toast.loadMemoryError": "Errore caricamento memoria: ",
 "toast.memorySaved": "Memoria salvata con successo!",
 "toast.saveMemoryError": "Errore salvataggio memoria: ",
 "toast.selectSession": "Seleziona una sessione OpenCode prima di salvare il job.",
 "toast.invalidSchedule": "Inserisci un intervallo valido (es. 5m o */5 * * * *).",
 "toast.jobCreated": "Nuovo job creato!",
 "toast.jobUpdated": "Job aggiornato!",
 "toast.runningDue": "Controllo ed esecuzione dei job scaduti in corso...",
 "toast.runDueFinished": "Controllo terminato!"
 },
 en: {
 "app.liveBadge": "Web GUI Live",
 "nav.jobs": "Jobs & Cron",
 "nav.chat": "Live Chat",
 "nav.memory": "Memory",
 "nav.diff": "Git Diff",
 "nav.logs": "Logs",
 "nav.runs": "Run Outcomes",
 "nav.historyRuns": "Runs History",
 "nav.newJob": "New Job",
 "nav.guide": "Guide",
 "nav.dashboard": "Dashboard",
 "kpi.activeTasks": "Active Tasks",
 "kpi.totalRuns": "Total Executions (View Outcomes →)",
 "kpi.launchd": "Launchd Daemon",
 "kpi.nextTick": "Next Tick",
 "jobs.heading": "Registered Cron Jobs",
 "jobs.subheading": "Recurring tasks writing directly into OpenCode sessions",
 "jobs.runDueNow": "Run Due Jobs Now",
 "jobs.emptyTitle": "No Cron Jobs Configured",
 "jobs.emptyDesc": "Create your first scheduled task to automate research, monitoring, or reports directly inside an OpenCode session.",
 "jobs.createFirst": "Create First Cron Job",
 "job.active": "ACTIVE",
 "job.paused": "PAUSED",
 "job.completed": "COMPLETED",
 "job.schedule": "Schedule",
 "job.executions": "Executions",
 "job.lastRun": "Last Run",
 "job.nextRun": "Next",
 "job.viewChat": "View Live Chat",
 "job.memoryBtn": "Memory",
 "job.editBtn": "Edit",
 "job.runNowTitle": "Run Tick Immediately",
 "job.pauseTitle": "Pause Job",
 "job.resumeTitle": "Resume Job",
 "job.deleteTitle": "Delete Job",
 "chat.sessionsTitle": "OpenCode Sessions",
 "chat.title": "Live Chat & Session Feed",
 "chat.subtitle": "View and update in real time the prompts and responses generated by automated ticks",
 "chat.sessionLabel": "Session:",
 "chat.searchPlaceholder": "Search session, cron job, or ID...",
 "chat.filterAll": "All",
 "chat.filterCron": " With Cron",
 "chat.filterMain": " Main",
 "chat.filterRoot": " Main",
 "chat.filterSub": " Subagents",
 "chat.onlyRepo": "This Repo Only",
 "chat.autoRefresh": "Auto-refresh (3s)",
 "chat.promptPlaceholder": "Send a manual prompt or instruction to this session (Enter sends, Shift+Enter newline)...",
 "chat.send": "Send",
 "chat.sendBtn": "Send",
 "memory.title": "Persistent Job Memory",
 "memory.subtitle": "Markdown files saved in .opencode/cron/memory/",
 "memory.save": "Save Changes",
 "memory.saveBtn": "Save Changes",
 "memory.editor": "Markdown Editor",
 "memory.preview": "Rendered Preview",
 "diff.title": "Git Diff & File Changes",
 "diff.subtitle": "Real-time inspection of created, modified, or deleted files in the local workspace.",
 "diff.reload": "Refresh Diff",
 "diff.refreshBtn": "Refresh Diff",
 "diff.filesInvolved": "Files Changed",
 "diff.all": "All",
 "logs.title": "Launchd Daemon Logs (opencode-cron.log)",
 "logs.subtitle": "Output from ~/Library/Logs/opencode-cron.log and .err",
 "logs.reload": "Reload Logs",
 "modal.newTitle": "New Cron Job",
 "modal.editTitle": "Edit Cron Job",
 "modal.fieldTitle": "Job Title",
 "modal.fieldSchedule": "Interval or Cron Expression",
 "modal.fieldMaxRuns": "Max Runs (0 = unlimited)",
 "modal.fieldSession": "Target OpenCode Session",
 "modal.fieldModel": "LLM Model (Optional)",
 "modal.fieldSystem": "System Prompt (Frozen Goal & Rules)",
 "modal.fieldFollowup": "Followup Prompt (Per-Tick Action)",
 "modal.adaptiveTitle": "Adaptive Cadence (Burst & Idle)",
 "modal.adaptiveHelp": "Speed up checks during active periods and back off when quiet to conserve resources and tokens.",
 "modal.adaptiveBurst": "Burst Interval (min 60s)",
 "modal.adaptiveIdle": "Idle Interval",
 "modal.adaptiveQuiet": "Quiet Threshold (ticks)",
 "modal.cancel": "Cancel",
 "modal.save": "Save Cron Job",
 "job.burstTitle": "Activate Burst Mode (15m)",
 "job.cadence": "Cadence",
 "job.burstActive": "BURST",
 "job.idleActive": "IDLE",
 "job.adaptiveBadge": "ADAPTIVE",
 "toast.burstActivated": "Burst Mode activated for 15 minutes!",
 "tt.burstBtn": "Trigger high-frequency Burst Mode for 15m on this job",
 "modal.pipelineTitle": "Multi-Job Pipeline & Triggers (Workflow DAG)",
 "modal.pipelineHelp": "Chain this job to others: automatically trigger downstream jobs on success or failure.",
 "modal.pipelineOnSuccess": "Run on Success (Job IDs)",
 "modal.pipelineOnFailure": "Run on Error / Failure (Job IDs)",
 "modal.pipelinePassPayload": "Inject upstream memory execution context into downstream jobs",
 "job.pipelineBadge": "PIPELINE",
 "job.pipelineOk": "on OK:",
 "job.pipelineErr": "on ERR:",
 "pipeline.headerBtn": "Workflows & DAG",
 "tt.pipelineBtn": "View DAG workflow graph and job execution dependencies",
 "pipeline.modalTitle": "Pipeline Workflow Graph (DAG)",
 "pipeline.emptyGraph": "No pipelines configured yet. Set 'Run on Success' on a job to create a multi-step workflow.",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Webhook",
 "tt.webhookBtn": "Manage webhook trigger endpoint and secret token for this job",
 "webhook.modalTitle": "Inbound Webhook Trigger & Secret Token",
 "webhook.modalDesc": "Allows external services (GitHub, GitLab, Stripe, Sentry, CI/CD, curl) to trigger this job immediately over HTTP.",
 "webhook.urlLabel": "Webhook Trigger URL (with Token)",
 "webhook.tokenLabel": "Authorization Secret Token",
 "webhook.secretLabel": "HMAC Shared Secret (optional for GitHub X-Hub-Signature-256)",
 "webhook.passPayload": "Inject inbound event payload into persistent agent memory",
 "webhook.rateLimit": "Anti-spam cooldown (seconds between triggers)",
 "webhook.copyUrl": "Copy URL",
 "webhook.copyCurl": "Copy cURL Command",
 "webhook.testBtn": "Test Trigger Now",
 "webhook.rotateToken": "Regenerate Token",
 "webhook.saveBtn": "Save Webhook Settings",
 "webhook.disableBtn": "Disable Webhook",
 "toast.webhookCopied": "Webhook URL copied to clipboard!",
 "toast.webhookCurlCopied": "cURL command copied to clipboard!",
 "toast.webhookSaved": "Webhook settings saved successfully!",
 "toast.webhookTriggered": "Webhook triggered successfully!",
 "toast.webhookDisabled": "Webhook disabled for this job.",
 "priority.label": "Job Priority",
 "priority.high": "High",
 "priority.normal": "Normal",
 "priority.low": "Low",
 "tt.priorityHigh": "High Priority: runs first when worker slots open",
 "tt.priorityNormal": "Normal Priority: standard execution",
 "tt.priorityLow": "Low Priority: yields to higher priority jobs",
 "nav.queue": "Queue & Workers",
 "tt.queueBtn": "View priority queue and configure concurrency limit",
 "queue.modalTitle": "Concurrency & Priority Queue",
 "queue.concurrencyTitle": "Concurrency Limit (Max Workers)",
 "queue.concurrencyHelp": "Maximum number of simultaneous running jobs (1-10)",
 "queue.activeTitle": "Actively Running Jobs",
 "queue.queuedTitle": "Queued Jobs Waiting",
 "queue.emptyRunning": "No jobs currently running.",
 "queue.emptyQueued": "No jobs waiting in queue.",
 "queue.clearBtn": "Clear Queue",
 "queue.saveSettings": "Save Limit",
 "toast.queueSaved": "Concurrency limit updated successfully!",
 "toast.queueCancelled": "Job removed from queue.",
 "toast.queueCleared": "Queue cleared successfully.",
 "nav.dlq": "DLQ & Circuit",
 "tt.dlqBtn": "View quarantined jobs (Dead Letter Queue) and manage circuit breakers",
 "tt.circuitOpen": "Circuit Breaker OPEN: Job quarantined due to consecutive failures",
 "tt.circuitHalfOpen": "Circuit Breaker HALF-OPEN: Canary probe run in progress",
 "circuit.open": "Quarantine",
 "circuit.halfOpen": "Canary Test",
 "circuit.resetBtn": "Reset Circuit",
 "dlq.modalTitle": "Dead Letter Queue & Quarantine",
 "dlq.subtitle": "Jobs halted due to consecutive failures. Run a canary probe or clear quarantine.",
 "dlq.empty": "No quarantined jobs. All cron jobs are operating normally!",
 "dlq.retryBtn": "Retry (Canary)",
 "dlq.resolveBtn": "Resolve & Resume",
 "dlq.deleteBtn": "Delete Entry",
 "dlq.clearAllBtn": "Clear DLQ",
 "toast.dlqRetried": "Canary run succeeded! Job restored to normal operation.",
 "toast.dlqResolved": "Job removed from quarantine and circuit breaker reset.",
 "toast.dlqCleared": "Dead Letter Queue cleared successfully.",
 "toast.dlqDeleted": "DLQ entry removed.",
 "nav.templates": "Templates",
 "nav.tools": "Tools",
 "nav.backup": "Snapshots",
 "nav.metrics": "Metrics",
 "nav.notifications": "Alerts",
 "tt.templatesBtn": "Browse and install pre-configured job blueprints and templates",
 "tt.backupBtn": "Create and restore atomic point-in-time snapshots with SHA-256 verification",
 "tt.metricsBtn": "View real-time execution latencies, p95 percentiles, and Prometheus exporter",
 "tt.notifyBtn": "Configure multi-channel alerting for Slack, Discord, and HTTP webhooks",
 "templates.modalTitle": "Job Templates & Blueprints",
 "templates.subtitle": "Select and apply production-ready monitoring, security, and maintenance blueprints with 1 click.",
 "templates.applyBtn": "Apply Blueprint",
 "templates.appliedSuccess": "Blueprint applied successfully!",
 "templates.empty": "No templates available.",
 "backup.modalTitle": "Point-in-Time Snapshots & Backups",
 "backup.subtitle": "Create atomic snapshots of jobs and memory with SHA-256 checksums and 1-click restore.",
 "backup.createBtn": "Create New Snapshot",
 "backup.restoreBtn": "Restore",
 "backup.deleteBtn": "Delete",
 "backup.createdSuccess": "Snapshot created successfully!",
 "backup.restoredSuccess": "Restore completed successfully!",
 "backup.deletedSuccess": "Snapshot deleted.",
 "backup.confirmRestore": "Are you sure you want to restore this snapshot? Current jobs state will be overwritten.",
 "backup.empty": "No backups recorded yet.",
 "metrics.modalTitle": "Real-Time Metrics & Telemetry",
 "metrics.subtitle": "Execution latencies, p95 percentiles, success rates, and Prometheus exporter.",
 "metrics.avgLatency": "Avg Latency",
 "metrics.p95Latency": "p95 Latency",
 "metrics.successRate": "Success Rate",
 "metrics.totalRuns": "Total Runs",
 "metrics.promEndpoint": "Prometheus Endpoint",
 "metrics.copyEndpoint": "Copy Scrape URL",
 "metrics.copied": "Scrape URL Copied!",
 "notify.modalTitle": "Multi-Channel Alerting & Notifications",
 "notify.subtitle": "Send automated alerts to Slack, Discord, or generic HTTP Webhooks on failure or execution.",
 "notify.slackWebhook": "Slack Webhook URL",
 "notify.discordWebhook": "Discord Webhook URL",
 "notify.genericWebhook": "Generic HTTP Webhook URL",
 "notify.testBtn": "Send Test Alert",
 "notify.savedSuccess": "Notification settings saved!",
 "notify.testSuccess": "Test alert sent successfully!",
 "filter.searchPlaceholder": "Search by title, tag, or ID...",
 "filter.allCategories": "All Categories",
 "filter.allStatuses": "All Statuses",
 "filter.statusEnabled": "Enabled",
 "filter.statusDisabled": "Paused",
 "filter.statusQuarantined": "Quarantined",
 "filter.tagAll": "All Tags",
 "filter.empty": "No jobs match the selected filters.",
 "modal.fieldCategory": "Category (e.g. ops, ci, security)",
 "modal.fieldTags": "Tags (comma-separated)",
 "modal.fieldTimezone": "Timezone (IANA)",
 "modal.fieldTimeout": "Watchdog Timeout (seconds, min 5)",
 "modal.guardTitle": "Pre-Flight Guard & Health-Check",
 "modal.guardHelp": "Runs a shell command or HTTP check before tick execution: if it fails, the tick is skipped safely.",
 "modal.guardCommand": "Shell Command (exit 0)",
 "modal.guardHttpUrl": "HTTP Health Check URL (status 200)",
 "runs.pageTitle": "Cron Execution History (Runs)",
 "runs.pageSubtitle": "Instantly see which scheduled cron runs succeeded and which failed",
 "runs.autoRefresh": "Auto-refresh (5s)",
 "runs.refreshNow": "Refresh Now",
 "runs.kpiTotal": "Total Runs",
 "runs.kpiTotalSub": "recorded runs",
 "runs.kpiClickAll": "Click to show all",
 "runs.kpiSuccess": "Succeeded Runs",
 "runs.kpiSuccessSub": "completed OK",
 "runs.kpiFailed": "Failed Runs / Errors",
 "runs.kpiFailedSub": "errors detected",
 "runs.kpiFilterFailed": "Filter failed runs only",
 "runs.kpiLastRun": "Latest Execution",
 "runs.kpiAvgDuration": "Avg response time:",
 "runs.timelineTitle": "Recent Executions Timeline Strip",
 "runs.timelineSub": "Each bar is a run (left = older, right = newer). Click any bar to jump to its details.",
 "runs.legendSuccess": " Succeeded",
 "runs.legendFailed": " Failed",
 "runs.byJobTitle": "Health Breakdown by Cron Job",
 "runs.byJobSub": "Click any card to filter runs for that specific job",
 "runs.showAllJobs": "Show All Jobs",
 "runs.filterAll": "All",
 "runs.filterSuccess": "Succeeded Only",
 "runs.filterFailed": "Failed Only",
 "runs.allJobsOption": "All Cron Jobs",
 "runs.searchPlaceholder": "Search by job title, output text, error, or session ID...",
 "runs.listHeading": "Recent Executions Feed",
 "runs.statusSuccess": " SUCCEEDED",
 "runs.statusFailed": " EXECUTION FAILED",
 "runs.statusSkipped": "⏭ SKIPPED",
 "runs.openInChat": "Open in Chat",
 "runs.outputLabel": "Cron Job Output:",
 "runs.errorLabel": "Error / Failure Details:",
 "runs.expandMore": "Expand full text ▼",
 "runs.expandLess": "Show less ▲",
 "onboard.title": "Welcome to OpenCode Cron - Quick Start Guide",
 "onboard.subtitle": "Automate recurring tasks, news monitoring, and code checks directly inside OpenCode sessions.",
 "onboard.step1Title": "1. Schedule a Job",
 "onboard.step1Desc": "Pick a main session, set an interval (e.g. 5m or 0 9 * * *), and define System + Followup prompts.",
 "onboard.step2Title": "2. Autonomous 60s Ticker",
 "onboard.step2Desc": "The macOS launchd daemon runs due jobs in the background even when the browser is closed.",
 "onboard.step3Title": "3. Monitor Outcomes & Chat",
 "onboard.step3Desc": "Watch live responses in Live Chat or open Run Outcomes (/runs) to inspect successes and failures.",
 "onboard.dismiss": "Hide tips",
 "guide.title": "OpenCode Cron Guide & Instructions",
 "guide.subtitle": "Interactive manual, architecture overview, and troubleshooting",
 "guide.shortcutHint": "Press ? anytime to open this guide",
 "guide.closeBtn": "Got it",
 "guide.sec1Title": " 1. How OpenCode Cron Works (Architecture)",
 "guide.sec1Body": "OpenCode Cron runs ChatGPT-style scheduled tasks directly inside your OpenCode sessions. A system daemon (macOS launchd 'ai.opencode.cron') checks .opencode/cron/jobs.json every 60 seconds. When a job is due, it triggers a turn in the target session, updates persistent Markdown memory, and mirrors SQLite tables (v2 -> v1) so messages appear in both the Web GUI and desktop app.",
 "guide.sec2Title": " 2. Creating or Editing a Cron Job",
 "guide.sec2Body": "• Title & Schedule: use simple intervals (1m, 5m, 1h) or 5-field Cron expressions ('0 9 * * *').\\n• Target Session: pick a ' Main' root session to keep all history in one thread.\\n• System Prompt (Frozen): defines fixed rules and agent persona.\\n• Followup Prompt: per-tick instruction executed on each cycle.\\n• Max Runs: set 0 for unlimited runs, or a cap (e.g. 50) to stop automatically after N ticks.",
 "guide.sec3Title": " 3. Persistent Memory & Deduplication (seenHashes)",
 "guide.sec3Body": "Even if OpenCode compacts a long session, .opencode/cron/memory/<jobId>.md preserves key facts and seen URLs/hashes (seenHashes). It is injected before every tick.",
 "guide.sec4Title": " 4. Dedicated 'Run Outcomes' Page (/runs)",
 "guide.sec4Body": "On /runs you can immediately see which runs succeeded (green badge) and which failed (red badge). Click KPI cards or timeline bars to filter errors, read error details, or jump straight to Live Chat.",
 "guide.sec5Title": " 5. Safety Guardrails & Troubleshooting",
 "guide.sec5Body": "• Auto-Pause after 5 failures: jobs pause automatically after 5 consecutive errors. Click Play to reset failures and resume.\\n• COMPLETED (Max Runs): when a job hits Max Runs (e.g. 50/50), increase Max Runs or set it to 0 to continue.",
 "tt.liveBadge": "Connected to local OpenCode Cron server. Polling pauses automatically when tab is hidden.",
 "tt.workspaceDir": "Active project root directory (.opencode/cron/jobs.json and memory live here).",
 "tt.tabJobs": "Manage, create, pause, or manually trigger your Cron Jobs.",
 "tt.tabChat": "Watch OpenCode session messages in real time and send manual prompts.",
 "tt.tabMemory": "Inspect and edit persistent Markdown memory for each job.",
 "tt.tabDiff": "Review uncommitted Git changes made by your agents.",
 "tt.tabLogs": "View the latest 150 stdout/stderr lines from the launchd daemon.",
 "tt.tabRuns": "Open the dedicated page with KPI stats, timeline strip, and succeeded vs failed run filters.",
 "tt.kpiActive": "Number of enabled Cron Jobs ready to run when due.",
 "tt.kpiTotalRuns": "Total executed ticks across jobs. Click to open detailed breakdown on /runs.",
 "tt.kpiLaunchd": "Background macOS daemon (ai.opencode.cron) checking due jobs every 60s.",
 "tt.kpiNextTick": "Countdown and timestamp of the next scheduled execution.",
 "tt.runDueBtn": "Force an immediate check and execute all currently due jobs.",
 "tt.runNowBtn": "Trigger an immediate single execution of this job right now.",
 "tt.toggleBtn": "Pause future ticks or resume and reset consecutive failure counters.",
 "tt.deleteBtn": "Permanently delete this job and its memory/log files.",
 "tt.maxRunsBadge": "This job reached its configured Max Runs limit. Edit Max Runs to continue.",
 "tt.runsKpiTotal": "Total runs reconstructed from history.json, SQLite, and daemon logs. Click to show all.",
 "tt.runsKpiSuccess": "Runs completed with exit code 0 and valid response. Click to filter succeeded runs.",
 "tt.runsKpiFailed": "Runs that failed with an error or timeout. Click to isolate failed runs.",
 "tt.runsKpiAvg": "Average turn duration and timestamp of the most recent run.",
 "tt.runsTimeline": "Chronological strip of the last 48 runs (green = success, red = failed). Click any bar to jump to it.",
 "tt.runsByJob": "Per-job reliability summary. Click any card to filter the run list below.",
 "tt.formSchedule": "Accepts intervals (1m, 5m, 2h, 1d) or standard 5-field Cron expressions.",
 "tt.formMaxRuns": "Set 0 for unlimited runs, or a positive integer to auto-stop after N runs.",
 "tt.formSystem": "Frozen instructions defining the agent's role, constraints, and output format.",
 "tt.formFollowup": "Per-tick instruction sent on every scheduled cycle along with persistent memory.",
 "tt.sessionCron": "Sessions linked to one or more active or scheduled Cron Jobs.",
 "tt.sessionRoot": "Primary (Root) sessions created by the user without a parentID.",
 "tt.sessionSub": "Child sessions spawned automatically by subagents or delegated tasks.",
 "tt.memoryHashes": "Count of seen hashes/URLs (seenHashes) used to prevent duplicate items across ticks.",
 "chat.setCron": "Set Cron",
 "tt.setCronBtn": "Schedule a new Cron Job directly on this conversation",
 "nav.instructions": "Instructions",
 "tt.navInstructions": "Complete manual, architecture, and step-by-step instructions",
 "tt.navDashboard": "Return to main dashboard and registered jobs",
 "tour.startBtn": "Demo",
 "tt.tourBtn": "Launch interactive guided onboarding demo tour",
 "instructions.pageSubtitle": "Interactive manual, architecture, and complete instructions",
 "instructions.heroTitle": "Everything You Need to Know About OpenCode Cron",
 "instructions.heroDesc": "Run ChatGPT-style autonomous tasks directly inside your OpenCode sessions. This guide walks you through configuration, schedules, persistent memory, and run outcomes.",
 "instructions.searchPlaceholder": "Search topics (e.g. set cron, max runs, launchd, prompts, seenHashes)...",
 "instructions.badge": "Official OpenCode Cron Documentation",
 "instructions.sec1Title": "1. 60-Second Architecture: An AI Agent Scheduler, Not a Dumb Bash Timer",
 "instructions.sec1Sub": "How OpenCode Cron radically differs from basic system crons or shell scripts",
 "instructions.sec2Title": "2. Binding Cron to a Conversation (1-Click Mode)",
 "instructions.sec2Sub": "Two in un unico flusso workflows to attach recurring tasks to any OpenCode session",
 "instructions.sec3Title": "3. Visual Schedule Builder: Times, Intervals & 5-Field Cron",
 "instructions.sec3Sub": "Supported formats with real-time predictive next-runs preview",
 "instructions.sec4Title": "4. Duration & End Condition: Infinite Execution vs Max Runs Limit",
 "instructions.sec4Sub": "Configure indefinite runs or auto-stop after N cycles",
 "instructions.sec5Title": "5. Persistent Markdown Memory & Deduplication (seenHashes)",
 "instructions.sec5Sub": "Preserve context across compactions and prevent duplicated work",
 "instructions.sec6Title": "6. Dedicated 'Run Outcomes' Page (/runs)",
 "instructions.sec6Sub": "Instant verification of succeeded vs failed executions",
 "instructions.sec7Title": "7. Background macOS launchd Daemon: 24/7 Autonomous Execution",
 "instructions.sec7Sub": "Your scheduled tasks run in background even when browser and UI are closed",
 "instructions.sec8Title": "8. FAQs, Security Guardrails & Quick Troubleshooting",
 "instructions.sec8Sub": "What to do on consecutive errors or desktop app restarts",
 "modal.deleteTitle": "Confirm Deletion",
 "modal.irreversibleAction": "Irreversible action",
 "modal.deleteConfirmMsg": "Are you sure you want to delete job '{id}'? Scheduled ticks will stop immediately.",
 "modal.deleteBtn": "Delete Permanently",
 "chat.noSessions": "No sessions found",
 "chat.noMessages": "No messages in this session.",
 "chat.lastUpdated": "Last updated:",
 "chat.noTextOutput": "*(No text output)*",
 "loading.jobs": "Loading jobs...",
 "loading.generic": "Loading...",
 "loading.sessions": "Loading sessions...",
 "loading.chat": "Loading real-time chat...",
 "loading.git": "Loading Git status...",
 "loading.diff": "Loading diff...",
 "logs.noStdout": "(No stdout output)",
 "logs.noStderr": "(No errors recorded)",
 "diff.clean": "Working tree clean, no uncommitted changes",
 "diff.changes": "{count} modified files in workspace",
 "diff.noChanges": "No changes to display",
 "toast.loadJobsError": "Error loading jobs: ",
 "toast.tickRunning": "Running tick for ",
 "toast.tickSuccess": "Tick completed successfully!",
 "toast.tickError": "Tick error: ",
 "toast.netError": "Network error: ",
 "toast.jobResumed": "Job resumed",
 "toast.jobPaused": "Job paused",
 "toast.genericError": "Error: ",
 "toast.jobDeleted": "Job deleted successfully",
 "toast.deleteError": "Deletion error: ",
 "toast.sessionsUpdated": "Session list updated from SQLite",
 "toast.copySessionSuccess": "Session ID copied: ",
 "toast.copySessionError": "Unable to copy to clipboard",
 "toast.sendError": "Send error: ",
 "toast.promptSent": "Prompt sent to session",
 "toast.loadMemoryError": "Error loading memory: ",
 "toast.memorySaved": "Memory saved successfully!",
 "toast.saveMemoryError": "Error saving memory: ",
 "toast.selectSession": "Please select an OpenCode session before saving the job.",
 "toast.invalidSchedule": "Please enter a valid schedule (e.g. 5m or */5 * * * *).",
 "toast.jobCreated": "New job created!",
 "toast.jobUpdated": "Job updated!",
 "toast.runningDue": "Checking and running due jobs in progress...",
 "toast.runDueFinished": "Check finished!"
 },
 es: {
 "app.liveBadge": "Web GUI en Vivo",
 "nav.jobs": "Jobs y Cron",
 "nav.chat": "Chat en Vivo",
 "nav.memory": "Memoria",
 "nav.diff": "Git Diff",
 "nav.logs": "Logs",
 "nav.runs": "Resultados Runs",
 "nav.historyRuns": "Historial Runs",
 "nav.newJob": "Nuevo Job",
 "nav.guide": "Guía",
 "nav.dashboard": "Panel",
 "kpi.activeTasks": "Tareas Activas",
 "kpi.totalRuns": "Ejecuciones Totales (Ver →)",
 "kpi.launchd": "Demonio Launchd",
 "kpi.nextTick": "Próximo Tick",
 "jobs.heading": "Cron Jobs Registrados",
 "jobs.subheading": "Tareas recurrentes que escriben directamente en sesiones de OpenCode",
 "jobs.runDueNow": "Ejecutar Vencidos Ahora",
 "jobs.emptyTitle": "Sin Cron Jobs Configurados",
 "jobs.emptyDesc": "Crea tu primera tarea programada para automatizar búsquedas, monitoreo o informes dentro de OpenCode.",
 "jobs.createFirst": "Crear Primer Cron Job",
 "job.active": "ACTIVO",
 "job.paused": "EN PAUSA",
 "job.completed": "COMPLETADO",
 "job.schedule": "Programación",
 "job.executions": "Ejecuciones",
 "job.lastRun": "Última Ejecución",
 "job.nextRun": "Siguiente",
 "job.viewChat": "Ver Chat en Vivo",
 "job.memoryBtn": "Memoria",
 "job.editBtn": "Editar",
 "modal.newTitle": "Nuevo Cron Job",
 "modal.editTitle": "Editar Cron Job",
 "modal.fieldTitle": "Título del Job",
 "modal.fieldSchedule": "Intervalo o Expresión Cron",
 "modal.fieldMaxRuns": "Máx. Ejecuciones (0 = infinito)",
 "modal.fieldSession": "Sesión OpenCode Destino",
 "modal.fieldModel": "Modelo LLM (Opcional)",
 "modal.fieldSystem": "System Prompt (Objetivo Fijo)",
 "modal.fieldFollowup": "Followup Prompt (Instrucción por Tick)",
 "modal.adaptiveTitle": "Cadencia Adaptativa (Burst e Idle)",
 "modal.adaptiveHelp": "Acelera las comprobaciones durante periodos activos y se ralentiza cuando no hay novedades para ahorrar recursos y tokens.",
 "modal.adaptiveBurst": "Intervalo Burst (mín. 60s)",
 "modal.adaptiveIdle": "Intervalo Idle",
 "modal.adaptiveQuiet": "Umbral de Quietud (ticks)",
 "modal.cancel": "Cancelar",
 "modal.save": "Guardar Cron Job",
 "job.burstTitle": "Activar Modo Burst (15m)",
 "job.cadence": "Cadencia",
 "job.burstActive": "BURST",
 "job.idleActive": "IDLE",
 "job.adaptiveBadge": "ADAPTATIVO",
 "toast.burstActivated": "¡Modo Burst activado durante 15 minutos!",
 "tt.burstBtn": "Activa el modo Burst de alta frecuencia por 15m en este job",
 "modal.pipelineTitle": "Pipeline y Triggers Multi-Job (Workflow DAG)",
 "modal.pipelineHelp": "Encadena este job con otros: ejecuta automáticamente tareas posteriores al completarse con éxito o tras fallos.",
 "modal.pipelineOnSuccess": "Ejecutar al Éxito (Job IDs)",
 "modal.pipelineOnFailure": "Ejecutar al Fallar (Job IDs)",
 "modal.pipelinePassPayload": "Inyectar contexto y memoria del job padre en los jobs dependientes",
 "job.pipelineBadge": "PIPELINE",
 "job.pipelineOk": "en OK:",
 "job.pipelineErr": "en ERR:",
 "pipeline.headerBtn": "Flujos y DAG",
 "tt.pipelineBtn": "Ver grafo DAG y dependencias de ejecución entre jobs",
 "pipeline.modalTitle": "Grafo de Flujos de Pipeline (DAG)",
 "pipeline.emptyGraph": "No hay pipelines configurados. Configura 'Ejecutar al Éxito' en un job para crear un flujo.",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Webhook",
 "tt.webhookBtn": "Gestionar el endpoint webhook y token de activación para esta tarea",
 "webhook.modalTitle": "Endpoint Webhook Inbound & Token Secreto",
 "webhook.modalDesc": "Permite que servicios externos (GitHub, GitLab, Stripe, CI/CD, curl) activen esta tarea inmediatamente por HTTP.",
 "webhook.urlLabel": "URL del Webhook (con Token)",
 "webhook.tokenLabel": "Token Secreto de Autorización",
 "webhook.secretLabel": "Secreto Compartido HMAC (opcional para GitHub X-Hub-Signature-256)",
 "webhook.passPayload": "Inyectar payload en la memoria persistente del agente",
 "webhook.rateLimit": "Enfriamiento anti-spam (segundos entre disparos)",
 "webhook.copyUrl": "Copiar URL",
 "webhook.copyCurl": "Copiar Comando cURL",
 "webhook.testBtn": "Probar Disparo Ahora",
 "webhook.rotateToken": "Regenerar Token",
 "webhook.saveBtn": "Guardar Configuración Webhook",
 "webhook.disableBtn": "Desactivar Webhook",
 "toast.webhookCopied": "¡URL del Webhook copiada!",
 "toast.webhookCurlCopied": "¡Comando cURL copiado!",
 "toast.webhookSaved": "¡Configuración Webhook guardada!",
 "toast.webhookTriggered": "¡Webhook activado con éxito!",
 "toast.webhookDisabled": "Webhook desactivado para esta tarea.",
 "priority.label": "Prioridad de Tarea",
 "priority.high": "Alta",
 "priority.normal": "Normal",
 "priority.low": "Baja",
 "tt.priorityHigh": "Prioridad Alta: se ejecuta primero cuando hay trabajadores libres",
 "tt.priorityNormal": "Prioridad Normal: ejecución estándar",
 "tt.priorityLow": "Prioridad Baja: cede el paso a tareas prioritarias",
 "nav.queue": "Cola & Workers",
 "tt.queueBtn": "Ver cola de prioridad y configurar límite de concurrencia",
 "queue.modalTitle": "Concurrencia & Cola de Prioridad",
 "queue.concurrencyTitle": "Límite de Concurrencia (Max Workers)",
 "queue.concurrencyHelp": "Número máximo de tareas simultáneas (1-10)",
 "queue.activeTitle": "Tareas en Ejecución Activa",
 "queue.queuedTitle": "Tareas en Espera",
 "queue.emptyRunning": "No hay tareas en ejecución actualmente.",
 "queue.emptyQueued": "No hay tareas en espera en la cola.",
 "queue.clearBtn": "Vaciar Cola",
 "queue.saveSettings": "Guardar Límite",
 "toast.queueSaved": "¡Límite de concurrencia guardado con éxito!",
 "toast.queueCancelled": "Tarea eliminada de la cola.",
 "toast.queueCleared": "Cola vaciada con éxito.",
 "nav.dlq": "DLQ & Circuit",
 "nav.templates": "Plantillas",
 "nav.tools": "Herramientas",
 "nav.instructions": "Instrucciones",
 "tour.startBtn": "Demo",
 "tt.dlqBtn": "Ver tareas en cuarentena (Dead Letter Queue) y gestionar disyuntores",
 "tt.circuitOpen": "Circuit Breaker ABIERTO: Tarea en cuarentena por fallos repetidos",
 "tt.circuitHalfOpen": "Circuit Breaker HALF-OPEN: Prueba canary en curso",
 "circuit.open": "Cuarentena",
 "circuit.halfOpen": "Prueba Canary",
 "circuit.resetBtn": "Reiniciar Circuit",
 "dlq.modalTitle": "Dead Letter Queue & Cuarentena",
 "dlq.subtitle": "Tareas detenidas por fallos consecutivos. Ejecute una prueba canary o elimine la cuarentena.",
 "dlq.empty": "No hay tareas en cuarentena. ¡Todos los cron jobs funcionan con normalidad!",
 "dlq.retryBtn": "Reintentar (Canary)",
 "dlq.resolveBtn": "Resolver & Reanudar",
 "dlq.deleteBtn": "Eliminar Registro",
 "dlq.clearAllBtn": "Vaciar DLQ",
 "toast.dlqRetried": "¡Prueba canary exitosa! Tarea restaurada a operación normal.",
 "toast.dlqResolved": "Tarea eliminada de cuarentena y disyuntor reiniciado.",
 "toast.dlqCleared": "Dead Letter Queue vaciada con éxito.",
 "toast.dlqDeleted": "Registro DLQ eliminado.",
 "runs.pageTitle": "Historial de Ejecuciones Cron (Runs)",
 "runs.pageSubtitle": "Comprueba fácilmente qué ejecuciones tuvieron éxito y cuáles fallaron",
 "runs.autoRefresh": "Auto-actualizar (5s)",
 "runs.refreshNow": "Actualizar Ahora",
 "runs.kpiTotal": "Total Ejecuciones",
 "runs.kpiTotalSub": "runs registradas",
 "runs.kpiClickAll": "Clic para mostrar todas",
 "runs.kpiSuccess": "Ejecutadas con Éxito",
 "runs.kpiSuccessSub": "completadas OK",
 "runs.kpiFailed": "Runs Fallidas / Errores",
 "runs.kpiFailedSub": "errores detectados",
 "runs.kpiFilterFailed": "Filtrar solo fallidas",
 "runs.kpiLastRun": "Última Ejecución",
 "runs.kpiAvgDuration": "Duración media:",
 "runs.timelineTitle": "Línea Temporal de Últimas Ejecuciones",
 "runs.timelineSub": "Cada barra es una ejecución (izquierda = anterior, derecha = reciente). Haz clic en una barra para ir al detalle.",
 "runs.legendSuccess": " Éxito",
 "runs.legendFailed": " Fallida",
 "runs.byJobTitle": "Estado por Cron Job",
 "runs.byJobSub": "Haz clic en una tarjeta para filtrar por ese job",
 "runs.showAllJobs": "Mostrar todos los Jobs",
 "runs.filterAll": "Todas",
 "runs.filterSuccess": "Solo Éxitos",
 "runs.filterFailed": "Solo Fallidas",
 "runs.allJobsOption": "Todos los Cron Jobs",
 "runs.searchPlaceholder": "Buscar por nombre de job, respuesta, error o sesión...",
 "runs.listHeading": "Lista de Ejecuciones Recientes",
 "runs.statusSuccess": " EJECUCIÓN EXITOSA",
 "runs.statusFailed": " EJECUCIÓN FALLIDA",
 "runs.statusSkipped": "⏭ OMITIDA",
 "runs.openInChat": "Abrir en Chat",
 "runs.outputLabel": "Respuesta del Cron Job:",
 "runs.errorLabel": "Detalle del Error:",
 "runs.expandMore": "Expandir todo ▼",
 "runs.expandLess": "Mostrar menos ▲",
 "onboard.title": "Bienvenido a OpenCode Cron - Guía Rápida",
 "onboard.subtitle": "Automatiza tareas recurrentes y monitoreo directamente en tus sesiones OpenCode.",
 "onboard.step1Title": "1. Programa un Job",
 "onboard.step1Desc": "Elige una sesión principal, define el intervalo (ej. 5m) y escribe System + Followup Prompt.",
 "onboard.step2Title": "2. Ejecución Autónoma 60s",
 "onboard.step2Desc": "El demonio launchd ejecuta las tareas vencidas en segundo plano incluso con el navegador cerrado.",
 "onboard.step3Title": "3. Revisa Resultados y Chat",
 "onboard.step3Desc": "Sigue las respuestas en Chat en Vivo o abre Resultados Runs (/runs) para ver éxitos y fallos.",
 "onboard.dismiss": "Ocultar consejos",
 "guide.title": "Guía e Instrucciones de OpenCode Cron",
 "guide.subtitle": "Manual interactivo, arquitectura y solución de problemas",
 "guide.shortcutHint": "Pulsa ? en cualquier momento para abrir la guía",
 "guide.closeBtn": "Entendido",
 "guide.sec1Title": " 1. Cómo Funciona OpenCode Cron",
 "guide.sec1Body": "OpenCode Cron ejecuta tareas programadas dentro de tus sesiones OpenCode. El demonio launchd comprueba jobs.json cada 60 segundos, lanza el turno, guarda la memoria Markdown y sincroniza SQLite.",
 "guide.sec2Title": " 2. Crear o Editar un Cron Job",
 "guide.sec2Body": "Usa intervalos (1m, 5m, 1h) o expresiones Cron de 5 campos. Elige una sesión Principal, define el System Prompt fijo y el Followup Prompt de cada ciclo.",
 "guide.sec3Title": " 3. Memoria Persistente (seenHashes)",
 "guide.sec3Body": "El archivo Markdown de memoria conserva hechos clave y hashes vistos para no duplicar noticias ni enlaces aunque la sesión se compacte.",
 "guide.sec4Title": " 4. Página 'Resultados Runs' (/runs)",
 "guide.sec4Body": "Consulta de un vistazo qué runs tuvieron éxito ( verde) y cuáles fallaron ( rojo), con duración, modelo y enlace directo al chat.",
 "guide.sec5Title": " 5. Seguridad y Solución de Problemas",
 "guide.sec5Body": "Tras 5 fallos consecutivos el job se pausa automáticamente. Si alcanza Max Runs (COMPLETADO), aumenta el límite o pon 0 para continuar."
 },
 fr: {
 "app.liveBadge": "Web GUI Live",
 "nav.jobs": "Jobs & Cron",
 "nav.chat": "Chat en Direct",
 "nav.memory": "Mémoire",
 "nav.diff": "Git Diff",
 "nav.logs": "Journaux",
 "nav.runs": "Résultats Runs",
 "nav.historyRuns": "Historique Runs",
 "nav.newJob": "Nouveau Job",
 "nav.guide": "Guide",
 "nav.dashboard": "Tableau de bord",
 "kpi.activeTasks": "Tâches Actives",
 "kpi.totalRuns": "Total Exécutions (Voir →)",
 "kpi.launchd": "Démon Launchd",
 "kpi.nextTick": "Prochain Tick",
 "jobs.heading": "Cron Jobs Enregistrés",
 "jobs.subheading": "Tâches récurrentes écrivant directement dans les sessions OpenCode",
 "jobs.runDueNow": "Exécuter les Échus",
 "jobs.emptyTitle": "Aucun Cron Job Configuré",
 "jobs.emptyDesc": "Créez votre première tâche planifiée pour automatiser vos recherches ou rapports dans OpenCode.",
 "jobs.createFirst": "Créer le Premier Job",
 "job.active": "ACTIF",
 "job.paused": "EN PAUSE",
 "job.completed": "TERMINÉ",
 "job.schedule": "Planification",
 "job.executions": "Exécutions",
 "job.lastRun": "Dernier Run",
 "job.nextRun": "Prochain",
 "job.viewChat": "Voir le Chat",
 "job.memoryBtn": "Mémoire",
 "job.editBtn": "Modifier",
 "modal.newTitle": "Nouveau Cron Job",
 "modal.editTitle": "Modifier le Cron Job",
 "modal.fieldTitle": "Titre du Job",
 "modal.fieldSchedule": "Intervalle ou Expression Cron",
 "modal.fieldMaxRuns": "Exécutions Max (0 = illimité)",
 "modal.fieldSession": "Session OpenCode Cible",
 "modal.fieldModel": "Modèle LLM (Optionnel)",
 "modal.fieldSystem": "System Prompt (Objectif Fixe)",
 "modal.fieldFollowup": "Followup Prompt (Instruction par Tick)",
 "modal.adaptiveTitle": "Cadence Adaptative (Burst & Idle)",
 "modal.adaptiveHelp": "Accélère les vérifications en période d'activité et ralentit en absence de nouveautés pour économiser ressources et jetons.",
 "modal.adaptiveBurst": "Intervalle Burst (min 60s)",
 "modal.adaptiveIdle": "Intervalle Idle",
 "modal.adaptiveQuiet": "Seuil de Calme (ticks)",
 "modal.cancel": "Annuler",
 "modal.save": "Enregistrer",
 "job.burstTitle": "Activer le Mode Burst (15m)",
 "job.cadence": "Cadence",
 "job.burstActive": "BURST",
 "job.idleActive": "IDLE",
 "job.adaptiveBadge": "ADAPTATIF",
 "toast.burstActivated": "Mode Burst activé pendant 15 minutes !",
 "tt.burstBtn": "Activer le Mode Burst haute fréquence pendant 15m sur cette tâche",
 "modal.pipelineTitle": "Pipeline et Déclencheurs Multi-Job (Workflow DAG)",
 "modal.pipelineHelp": "Enchaînez ce job avec d'autres : déclenchez automatiquement les tâches suivantes en cas de succès ou d'échec.",
 "modal.pipelineOnSuccess": "Exécuter en cas de Succès (IDs des jobs)",
 "modal.pipelineOnFailure": "Exécuter en cas d'Échec (IDs des jobs)",
 "modal.pipelinePassPayload": "Injecter le contexte et la mémoire du parent dans les jobs en aval",
 "job.pipelineBadge": "PIPELINE",
 "job.pipelineOk": "si OK :",
 "job.pipelineErr": "si ERR :",
 "pipeline.headerBtn": "Workflows & DAG",
 "tt.pipelineBtn": "Afficher le graphe de flux DAG et les dépendances d'exécution",
 "pipeline.modalTitle": "Graphe de Workflow Pipeline (DAG)",
 "pipeline.emptyGraph": "Aucun pipeline configuré. Définissez 'Exécuter en cas de Succès' sur un job pour créer un flux.",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Webhook",
 "tt.webhookBtn": "Gérer le point de terminaison webhook et le jeton secret pour cette tâche",
 "webhook.modalTitle": "Point de Terminaison Webhook Entrant & Jeton Secret",
 "webhook.modalDesc": "Permet aux services externes (GitHub, GitLab, Stripe, CI/CD, curl) de déclencher cette tâche immédiatement via HTTP.",
 "webhook.urlLabel": "URL du Webhook (avec Jeton)",
 "webhook.tokenLabel": "Jeton Secret d'Autorisation",
 "webhook.secretLabel": "Secret Partagé HMAC (optionnel pour GitHub X-Hub-Signature-256)",
 "webhook.passPayload": "Injecter la charge utile dans la mémoire persistante",
 "webhook.rateLimit": "Délai anti-spam (secondes entre déclenchements)",
 "webhook.copyUrl": "Copier l'URL",
 "webhook.copyCurl": "Copier la Commande cURL",
 "webhook.testBtn": "Tester le Déclenchement",
 "webhook.rotateToken": "Régénérer le Jeton",
 "webhook.saveBtn": "Enregistrer le Webhook",
 "webhook.disableBtn": "Désactiver le Webhook",
 "toast.webhookCopied": "URL du Webhook copiée !",
 "toast.webhookCurlCopied": "Commande cURL copiée !",
 "toast.webhookSaved": "Paramètres Webhook enregistrés !",
 "toast.webhookTriggered": "Webhook déclenché avec succès !",
 "toast.webhookDisabled": "Webhook désactivé pour cette tâche.",
 "priority.label": "Priorité de la Tâche",
 "priority.high": "Haute",
 "priority.normal": "Normale",
 "priority.low": "Basse",
 "tt.priorityHigh": "Priorité Haute : exécutée en premier dès qu'un worker se libère",
 "tt.priorityNormal": "Priorité Normale : exécution standard",
 "tt.priorityLow": "Priorité Basse : cède le pas aux tâches prioritaires",
 "nav.queue": "File & Workers",
 "tt.queueBtn": "Voir la file de priorité et configurer la limite de concurrence",
 "queue.modalTitle": "Concurrence & File de Priorité",
 "queue.concurrencyTitle": "Limite de Concurrence (Max Workers)",
 "queue.concurrencyHelp": "Nombre maximal de tâches simultanées (1-10)",
 "queue.activeTitle": "Tâches en Cours d'Exécution",
 "queue.queuedTitle": "Tâches en File d'Attente",
 "queue.emptyRunning": "Aucune tâche en cours d'exécution.",
 "queue.emptyQueued": "Aucune tâche en attente dans la file.",
 "queue.clearBtn": "Vider la File",
 "queue.saveSettings": "Enregistrer la Limite",
 "toast.queueSaved": "Limite de concurrence mise à jour avec succès !",
 "toast.queueCancelled": "Tâche retirée de la file d'attente.",
 "toast.queueCleared": "File d'attente vidée avec succès.",
 "nav.dlq": "DLQ & Circuit",
 "nav.templates": "Modèles",
 "nav.tools": "Outils",
 "nav.instructions": "Instructions",
 "tour.startBtn": "Démo",
 "tt.dlqBtn": "Voir les tâches en quarantaine (Dead Letter Queue) et gérer les coupe-circuits",
 "tt.circuitOpen": "Circuit Breaker OUVERT : Tâche en quarantaine suite à des échecs répétés",
 "tt.circuitHalfOpen": "Circuit Breaker HALF-OPEN : Test canary en cours",
 "circuit.open": "Quarantaine",
 "circuit.halfOpen": "Test Canary",
 "circuit.resetBtn": "Réinitialiser Circuit",
 "dlq.modalTitle": "Dead Letter Queue & Quarantaine",
 "dlq.subtitle": "Tâches suspendues pour échecs consécutifs. Lancez un test canary ou levez la quarantaine.",
 "dlq.empty": "Aucune tâche en quarantaine. Tous les cron jobs fonctionnent normalement !",
 "dlq.retryBtn": "Réessayer (Canary)",
 "dlq.resolveBtn": "Résoudre & Réactiver",
 "dlq.deleteBtn": "Supprimer Entrée",
 "dlq.clearAllBtn": "Vider DLQ",
 "toast.dlqRetried": "Test canary réussi ! Tâche restaurée en fonctionnement normal.",
 "toast.dlqResolved": "Tâche sortie de quarantaine et coupe-circuit réinitialisé.",
 "toast.dlqCleared": "Dead Letter Queue vidée avec succès.",
 "toast.dlqDeleted": "Entrée DLQ supprimée.",
 "runs.pageTitle": "Historique des Exécutions Cron (Runs)",
 "runs.pageSubtitle": "Visualisez immédiatement quelles exécutions ont réussi et lesquelles ont échoué",
 "runs.autoRefresh": "Auto-actualiser (5s)",
 "runs.refreshNow": "Actualiser",
 "runs.kpiTotal": "Total Exécutions",
 "runs.kpiTotalSub": "runs enregistrées",
 "runs.kpiClickAll": "Cliquer pour tout voir",
 "runs.kpiSuccess": "Exécutions Réussies",
 "runs.kpiSuccessSub": "terminées OK",
 "runs.kpiFailed": "Runs Échouées / Erreurs",
 "runs.kpiFailedSub": "erreurs détectées",
 "runs.kpiFilterFailed": "Filtrer les échecs",
 "runs.kpiLastRun": "Dernière Exécution",
 "runs.kpiAvgDuration": "Durée moyenne :",
 "runs.timelineTitle": "Chronologie Visuelle des Exécutions Récentes",
 "runs.timelineSub": "Chaque barre représente un run (gauche = ancien, droite = récent). Cliquez pour voir le détail.",
 "runs.legendSuccess": " Réussie",
 "runs.legendFailed": " Échouée",
 "runs.byJobTitle": "Santé par Cron Job",
 "runs.byJobSub": "Cliquez sur une carte pour filtrer ce job",
 "runs.showAllJobs": "Afficher tous les Jobs",
 "runs.filterAll": "Toutes",
 "runs.filterSuccess": "Réussies",
 "runs.filterFailed": "Échouées",
 "runs.allJobsOption": "Tous les Cron Jobs",
 "runs.searchPlaceholder": "Rechercher par titre, réponse, erreur ou session...",
 "runs.listHeading": "Liste des Exécutions Récentes",
 "runs.statusSuccess": " EXÉCUTION RÉUSSIE",
 "runs.statusFailed": " EXÉCUTION ÉCHOUÉE",
 "runs.statusSkipped": "⏭ IGNORÉE",
 "runs.openInChat": "Ouvrir dans le Chat",
 "runs.outputLabel": "Réponse du Cron Job :",
 "runs.errorLabel": "Détail de l'Erreur :",
 "runs.expandMore": "Tout afficher ▼",
 "runs.expandLess": "Réduire ▲",
 "onboard.title": "Bienvenue sur OpenCode Cron - Guide Rapide",
 "onboard.subtitle": "Automatisez vos tâches récurrentes et veilles directement dans vos sessions OpenCode.",
 "onboard.step1Title": "1. Planifier un Job",
 "onboard.step1Desc": "Choisissez une session principale, définissez l'intervalle (ex. 5m) et les prompts.",
 "onboard.step2Title": "2. Démon Autonome 60s",
 "onboard.step2Desc": "Le démon launchd exécute les tâches échues en arrière-plan même navigateur fermé.",
 "onboard.step3Title": "3. Suivre Résultats & Chat",
 "onboard.step3Desc": "Consultez le Chat en Direct ou la page Résultats Runs (/runs) pour voir succès et erreurs.",
 "onboard.dismiss": "Masquer les conseils",
 "guide.title": "Guide & Instructions OpenCode Cron",
 "guide.subtitle": "Manuel interactif, architecture et dépannage",
 "guide.shortcutHint": "Appuyez sur ? à tout moment pour ouvrir ce guide",
 "guide.closeBtn": "Compris",
 "guide.sec1Title": " 1. Fonctionnement d'OpenCode Cron",
 "guide.sec1Body": "Le démon launchd vérifie jobs.json toutes les 60 secondes, lance le tour dans la session cible, met à jour la mémoire Markdown et synchronise SQLite.",
 "guide.sec2Title": " 2. Créer ou Modifier un Cron Job",
 "guide.sec2Body": "Utilisez des intervalles (1m, 5m, 1h) ou expressions Cron. Définissez le System Prompt fixe et le Followup Prompt exécuté à chaque cycle.",
 "guide.sec3Title": " 3. Mémoire Persistante (seenHashes)",
 "guide.sec3Body": "La mémoire Markdown conserve les faits clés et les hash déjà vus pour éviter les doublons même après compactage de la session.",
 "guide.sec4Title": " 4. Page 'Résultats Runs' (/runs)",
 "guide.sec4Body": "Identifiez immédiatement les runs réussies ( vert) et échouées ( rouge), leur durée et accédez au chat en un clic.",
 "guide.sec5Title": " 5. Sécurité & Dépannage",
 "guide.sec5Body": "Après 5 échecs consécutifs, le job se met en pause automatiquement. Si Max Runs est atteint (TERMINÉ), augmentez la limite ou mettez 0."
 },
 de: {
 "app.liveBadge": "Web GUI Live",
 "nav.jobs": "Jobs & Cron",
 "nav.chat": "Live-Chat",
 "nav.memory": "Speicher",
 "nav.diff": "Git Diff",
 "nav.logs": "Logs",
 "nav.runs": "Run-Ergebnisse",
 "nav.historyRuns": "Run-Verlauf",
 "nav.newJob": "Neuer Job",
 "nav.guide": "Anleitung",
 "nav.dashboard": "Dashboard",
 "kpi.activeTasks": "Aktive Aufgaben",
 "kpi.totalRuns": "Ausführungen Gesamt (Ansehen →)",
 "kpi.launchd": "Launchd-Daemon",
 "kpi.nextTick": "Nächster Tick",
 "jobs.heading": "Registrierte Cron-Jobs",
 "jobs.subheading": "Wiederkehrende Aufgaben, die direkt in OpenCode-Sitzungen schreiben",
 "jobs.runDueNow": "Fällige Jetzt Ausführen",
 "jobs.emptyTitle": "Keine Cron-Jobs Konfiguriert",
 "jobs.emptyDesc": "Erstellen Sie Ihre erste geplante Aufgabe zur Automatisierung von Recherchen oder Berichten in OpenCode.",
 "jobs.createFirst": "Ersten Cron-Job Erstellen",
 "job.active": "AKTIV",
 "job.paused": "PAUSIERT",
 "job.completed": "ABGESCHLOSSEN",
 "job.schedule": "Zeitplan",
 "job.executions": "Ausführungen",
 "job.lastRun": "Letzter Lauf",
 "job.nextRun": "Nächster",
 "job.viewChat": "Live-Chat Öffnen",
 "job.memoryBtn": "Speicher",
 "job.editBtn": "Bearbeiten",
 "modal.newTitle": "Neuer Cron-Job",
 "modal.editTitle": "Cron-Job Bearbeiten",
 "modal.fieldTitle": "Job-Titel",
 "modal.fieldSchedule": "Intervall oder Cron-Ausdruck",
 "modal.fieldMaxRuns": "Max. Ausführungen (0 = unbegrenzt)",
 "modal.fieldSession": "Ziel-OpenCode-Sitzung",
 "modal.fieldModel": "LLM-Modell (Optional)",
 "modal.fieldSystem": "System-Prompt (Festes Ziel)",
 "modal.fieldFollowup": "Followup-Prompt (Aktion pro Tick)",
 "modal.adaptiveTitle": "Adaptive Kadenz (Burst & Idle)",
 "modal.adaptiveHelp": "Beschleunigt Intervalle bei Aktivität und verlangsamt bei Ruhezyklen, um Ressourcen und Tokens zu sparen.",
 "modal.adaptiveBurst": "Burst-Intervall (min. 60s)",
 "modal.adaptiveIdle": "Idle-Intervall",
 "modal.adaptiveQuiet": "Ruhe-Schwellenwert (Ticks)",
 "modal.cancel": "Abbrechen",
 "modal.save": "Speichern",
 "job.burstTitle": "Burst-Modus aktivieren (15m)",
 "job.cadence": "Kadenz",
 "job.burstActive": "BURST",
 "job.idleActive": "IDLE",
 "job.adaptiveBadge": "ADAPTIV",
 "toast.burstActivated": "Burst-Modus für 15 Minuten aktiviert!",
 "tt.burstBtn": "Hochfrequenten Burst-Modus für 15m auf diesem Job auslösen",
 "modal.pipelineTitle": "Multi-Job Pipeline & Trigger (Workflow-DAG)",
 "modal.pipelineHelp": "Verketten Sie diesen Job mit anderen: Nachfolgende Aufgaben bei Erfolg oder Fehler automatisch auslösen.",
 "modal.pipelineOnSuccess": "Bei Erfolg ausführen (Job-IDs)",
 "modal.pipelineOnFailure": "Bei Fehler ausführen (Job-IDs)",
 "modal.pipelinePassPayload": "Upstream-Speicherkontext an nachgelagerte Jobs übergeben",
 "job.pipelineBadge": "PIPELINE",
 "job.pipelineOk": "bei OK:",
 "job.pipelineErr": "bei ERR:",
 "pipeline.headerBtn": "Workflows & DAG",
 "tt.pipelineBtn": "DAG-Workflow-Diagramm und Ausführungsabhängigkeiten anzeigen",
 "pipeline.modalTitle": "Pipeline-Workflow-Graph (DAG)",
 "pipeline.emptyGraph": "Noch keine Pipelines konfiguriert. Setzen Sie 'Bei Erfolg ausführen', um einen Workflow zu erstellen.",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Webhook",
 "tt.webhookBtn": "Webhook-Endpunkt und Geheimtoken für diesen Job verwalten",
 "webhook.modalTitle": "Eingehender Webhook-Trigger & Geheimtoken",
 "webhook.modalDesc": "Ermöglicht externen Diensten (GitHub, GitLab, Stripe, CI/CD, curl), diesen Job sofort über HTTP auszulösen.",
 "webhook.urlLabel": "Webhook-Trigger-URL (mit Token)",
 "webhook.tokenLabel": "Autorisierungs-Geheimtoken",
 "webhook.secretLabel": "HMAC Shared Secret (optional für GitHub X-Hub-Signature-256)",
 "webhook.passPayload": "Event-Payload in den persistenten Speicher einfügen",
 "webhook.rateLimit": "Anti-Spam-Abklingzeit (Sekunden zwischen Triggern)",
 "webhook.copyUrl": "URL Kopieren",
 "webhook.copyCurl": "cURL-Befehl Kopieren",
 "webhook.testBtn": "Jetzt Trigger Testen",
 "webhook.rotateToken": "Token Neu Generieren",
 "webhook.saveBtn": "Webhook Speichern",
 "webhook.disableBtn": "Webhook Deaktivieren",
 "toast.webhookCopied": "Webhook-URL in die Zwischenablage kopiert!",
 "toast.webhookCurlCopied": "cURL-Befehl in die Zwischenablage kopiert!",
 "toast.webhookSaved": "Webhook-Einstellungen gespeichert!",
 "toast.webhookTriggered": "Webhook erfolgreich ausgelöst!",
 "toast.webhookDisabled": "Webhook für diesen Job deaktiviert.",
 "priority.label": "Job-Priorität",
 "priority.high": "Hoch",
 "priority.normal": "Normal",
 "priority.low": "Niedrig",
 "tt.priorityHigh": "Hohe Priorität: startet zuerst, wenn Worker-Slots frei werden",
 "tt.priorityNormal": "Normale Priorität: standardmäßige Ausführung",
 "tt.priorityLow": "Niedrige Priorität: weicht Jobs mit höherer Priorität",
 "nav.queue": "Warteschlange & Worker",
 "tt.queueBtn": "Prioritätswarteschlange anzeigen und Parallelitätslimit festlegen",
 "queue.modalTitle": "Parallelität & Prioritätswarteschlange",
 "queue.concurrencyTitle": "Parallelitätslimit (Max Workers)",
 "queue.concurrencyHelp": "Maximale Anzahl gleichzeitiger Jobs (1-10)",
 "queue.activeTitle": "Aktive laufende Jobs",
 "queue.queuedTitle": "Wartende Jobs in der Warteschlange",
 "queue.emptyRunning": "Derzeit laufen keine Jobs.",
 "queue.emptyQueued": "Keine Jobs in der Warteschlange.",
 "queue.clearBtn": "Warteschlange leeren",
 "queue.saveSettings": "Limit speichern",
 "toast.queueSaved": "Parallelitätslimit erfolgreich gespeichert!",
 "toast.queueCancelled": "Job aus der Warteschlange entfernt.",
 "toast.queueCleared": "Warteschlange erfolgreich geleert.",
 "nav.dlq": "DLQ & Circuit",
 "nav.templates": "Vorlagen",
 "nav.tools": "Werkzeuge",
 "nav.instructions": "Anleitungen",
 "tour.startBtn": "Demo",
 "tt.dlqBtn": "Quarantäne-Jobs (Dead Letter Queue) ansehen und Schutzschalter verwalten",
 "tt.circuitOpen": "Circuit Breaker OFFEN: Job wegen wiederholter Fehler in Quarantäne",
 "tt.circuitHalfOpen": "Circuit Breaker HALF-OPEN: Canary-Testlauf wird ausgeführt",
 "circuit.open": "Quarantäne",
 "circuit.halfOpen": "Canary-Test",
 "circuit.resetBtn": "Circuit zurücksetzen",
 "dlq.modalTitle": "Dead Letter Queue & Quarantäne",
 "dlq.subtitle": "Aufgrund wiederholter Fehler gestoppte Jobs. Canary-Test starten oder Quarantäne aufheben.",
 "dlq.empty": "Keine Jobs in Quarantäne. Alle Cron-Jobs laufen fehlerfrei!",
 "dlq.retryBtn": "Wiederholen (Canary)",
 "dlq.resolveBtn": "Lösen & Fortsetzen",
 "dlq.deleteBtn": "Eintrag löschen",
 "dlq.clearAllBtn": "DLQ leeren",
 "toast.dlqRetried": "Canary-Lauf erfolgreich! Job wieder im Normalbetrieb.",
 "toast.dlqResolved": "Job aus Quarantäne entfernt und Schutzschalter zurückgesetzt.",
 "toast.dlqCleared": "Dead Letter Queue erfolgreich geleert.",
 "toast.dlqDeleted": "DLQ-Eintrag entfernt.",
 "runs.pageTitle": "Cron-Ausführungsverlauf (Runs)",
 "runs.pageSubtitle": "Sofort erkennen, welche Cron-Läufe erfolgreich waren und welche fehlgeschlagen sind",
 "runs.autoRefresh": "Auto-Aktualisierung (5s)",
 "runs.refreshNow": "Jetzt Aktualisieren",
 "runs.kpiTotal": "Ausführungen Gesamt",
 "runs.kpiTotalSub": "erfasste Läufe",
 "runs.kpiClickAll": "Klicken, um alle anzuzeigen",
 "runs.kpiSuccess": "Erfolgreiche Läufe",
 "runs.kpiSuccessSub": "erfolgreich beendet",
 "runs.kpiFailed": "Fehlgeschlagene Läufe",
 "runs.kpiFailedSub": "Fehler erkannt",
 "runs.kpiFilterFailed": "Nur Fehler filtern",
 "runs.kpiLastRun": "Letzte Ausführung",
 "runs.kpiAvgDuration": "Durchschn. Dauer:",
 "runs.timelineTitle": "Zeitstrahl der Letzten Ausführungen",
 "runs.timelineSub": "Jeder Balken steht für einen Lauf (links = älter, rechts = neuer). Klicken zum Springen.",
 "runs.legendSuccess": " Erfolg",
 "runs.legendFailed": " Fehlgeschlagen",
 "runs.byJobTitle": "Status pro Cron-Job",
 "runs.byJobSub": "Klicken Sie auf eine Karte, um nach diesem Job zu filtern",
 "runs.showAllJobs": "Alle Jobs anzeigen",
 "runs.filterAll": "Alle",
 "runs.filterSuccess": "Nur Erfolge",
 "runs.filterFailed": "Nur Fehler",
 "runs.allJobsOption": "Alle Cron-Jobs",
 "runs.searchPlaceholder": "Suche nach Jobname, Antwort, Fehler oder Sitzung...",
 "runs.listHeading": "Letzte Ausführungen",
 "runs.statusSuccess": " ERFOLGREICH GESTARTET",
 "runs.statusFailed": " AUSFÜHRUNG FEHLGESCHLAGEN",
 "runs.statusSkipped": "⏭ ÜBERSPRUNGEN",
 "runs.openInChat": "Im Chat Öffnen",
 "runs.outputLabel": "Antwort des Cron-Jobs:",
 "runs.errorLabel": "Fehlerdetails:",
 "runs.expandMore": "Alles anzeigen ▼",
 "runs.expandLess": "Weniger anzeigen ▲",
 "onboard.title": "Willkommen bei OpenCode Cron - Kurzanleitung",
 "onboard.subtitle": "Automatisieren Sie wiederkehrende Aufgaben direkt in Ihren OpenCode-Sitzungen.",
 "onboard.step1Title": "1. Job Planen",
 "onboard.step1Desc": "Hauptsitzung wählen, Intervall (z.B. 5m) sowie System- und Followup-Prompt festlegen.",
 "onboard.step2Title": "2. Autonomer 60s-Daemon",
 "onboard.step2Desc": "Der macOS launchd-Daemon führt fällige Jobs im Hintergrund aus, auch bei geschlossenem Browser.",
 "onboard.step3Title": "3. Ergebnisse & Chat Prüfen",
 "onboard.step3Desc": "Antworten im Live-Chat verfolgen oder auf /runs Erfolge und Fehler analysieren.",
 "onboard.dismiss": "Tipps ausblenden",
 "guide.title": "OpenCode Cron Handbuch & Anleitung",
 "guide.subtitle": "Interaktives Handbuch, Architektur und Fehlerbehebung",
 "guide.shortcutHint": "Drücken Sie jederzeit ?, um diese Anleitung zu öffnen",
 "guide.closeBtn": "Verstanden",
 "guide.sec1Title": " 1. Wie OpenCode Cron Funktioniert",
 "guide.sec1Body": "Der launchd-Daemon prüft alle 60s jobs.json, startet fällige Läufe in der gewählten Sitzung, speichert Markdown-Memory und spiegelt SQLite.",
 "guide.sec2Title": " 2. Cron-Job Erstellen oder Bearbeiten",
 "guide.sec2Body": "Nutzen Sie Intervalle (1m, 5m, 1h) oder Cron-Ausdrücke. Definieren Sie den festen System-Prompt und den Followup-Prompt pro Tick.",
 "guide.sec3Title": " 3. Persistenter Speicher (seenHashes)",
 "guide.sec3Body": "Die Markdown-Speicherdatei bewahrt wichtige Fakten und gesehene Hashes, um Duplikate zu vermeiden.",
 "guide.sec4Title": " 4. Seite 'Run-Ergebnisse' (/runs)",
 "guide.sec4Body": "Sehen Sie sofort erfolgreiche ( grün) und fehlgeschlagene ( rot) Läufe inklusive Antwortzeit und Chat-Link.",
 "guide.sec5Title": " 5. Sicherheit & Fehlerbehebung",
 "guide.sec5Body": "Nach 5 Fehlern in Folge pausiert der Job automatisch. Bei ABGESCHLOSSEN (Max Runs) erhöhen Sie das Limit oder setzen es auf 0."
 },
 pt: {
 "app.liveBadge": "Web GUI ao Vivo",
 "nav.jobs": "Jobs e Cron",
 "nav.chat": "Chat ao Vivo",
 "nav.memory": "Memória",
 "nav.diff": "Git Diff",
 "nav.logs": "Logs",
 "nav.runs": "Resultados Runs",
 "nav.historyRuns": "Histórico Runs",
 "nav.newJob": "Novo Job",
 "nav.guide": "Guia",
 "nav.dashboard": "Painel",
 "kpi.activeTasks": "Tarefas Ativas",
 "kpi.totalRuns": "Total de Execuções (Ver →)",
 "kpi.launchd": "Daemon Launchd",
 "kpi.nextTick": "Próximo Tick",
 "jobs.heading": "Cron Jobs Registrados",
 "jobs.subheading": "Tarefas recorrentes que escrevem diretamente nas sessões do OpenCode",
 "jobs.runDueNow": "Executar Vencidos Agora",
 "jobs.emptyTitle": "Nenhum Cron Job Configurado",
 "jobs.emptyDesc": "Crie sua primeira tarefa agendada para automatizar pesquisas, monitoramento ou relatórios no OpenCode.",
 "jobs.createFirst": "Criar Primeiro Cron Job",
 "job.active": "ATIVO",
 "job.paused": "PAUSADO",
 "job.completed": "CONCLUÍDO",
 "job.schedule": "Agendamento",
 "job.executions": "Execuções",
 "job.lastRun": "Última Execução",
 "job.nextRun": "Próxima",
 "job.viewChat": "Ver Chat ao Vivo",
 "job.memoryBtn": "Memória",
 "job.editBtn": "Editar",
 "modal.newTitle": "Novo Cron Job",
 "modal.editTitle": "Editar Cron Job",
 "modal.fieldTitle": "Título do Job",
 "modal.fieldSchedule": "Intervalo ou Expressão Cron",
 "modal.fieldMaxRuns": "Máx. Execuções (0 = ilimitado)",
 "modal.fieldSession": "Sessão OpenCode Alvo",
 "modal.fieldModel": "Modelo LLM (Opcional)",
 "modal.fieldSystem": "System Prompt (Objetivo Fixo)",
 "modal.fieldFollowup": "Followup Prompt (Instrução por Tick)",
 "modal.adaptiveTitle": "Cadência Adaptativa (Burst & Idle)",
 "modal.adaptiveHelp": "Acelera as verificações durante períodos ativos e desacelera quando quieto para economizar recursos e tokens.",
 "modal.adaptiveBurst": "Intervalo Burst (mín. 60s)",
 "modal.adaptiveIdle": "Intervalo Idle",
 "modal.adaptiveQuiet": "Limite de Quietude (ticks)",
 "modal.cancel": "Cancelar",
 "modal.save": "Salvar Cron Job",
 "job.burstTitle": "Ativar Modo Burst (15m)",
 "job.cadence": "Cadência",
 "job.burstActive": "BURST",
 "job.idleActive": "IDLE",
 "job.adaptiveBadge": "ADAPTATIVO",
 "toast.burstActivated": "Modo Burst ativado por 15 minutos!",
 "tt.burstBtn": "Disparar modo Burst de alta frequência por 15m neste job",
 "modal.pipelineTitle": "Pipeline e Gatilhos Multi-Job (Workflow DAG)",
 "modal.pipelineHelp": "Encadeie este job com outros: acione tarefas seguintes automaticamente após sucesso ou falha.",
 "modal.pipelineOnSuccess": "Executar em Caso de Sucesso (IDs dos Jobs)",
 "modal.pipelineOnFailure": "Executar em Caso de Falha (IDs dos Jobs)",
 "modal.pipelinePassPayload": "Injetar contexto de memória upstream nos jobs a jusante",
 "job.pipelineBadge": "PIPELINE",
 "job.pipelineOk": "em OK:",
 "job.pipelineErr": "em ERR:",
 "pipeline.headerBtn": "Workflows & DAG",
 "tt.pipelineBtn": "Ver grafo DAG e dependências de execução entre jobs",
 "pipeline.modalTitle": "Grafo de Fluxos de Pipeline (DAG)",
 "pipeline.emptyGraph": "Nenhuma pipeline configurada. Defina 'Executar em Caso de Sucesso' em um job para criar um fluxo.",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Webhook",
 "tt.webhookBtn": "Gerenciar endpoint de webhook e token secreto para esta tarefa",
 "webhook.modalTitle": "Endpoint de Webhook Inbound & Token Secreto",
 "webhook.modalDesc": "Permite que serviços externos (GitHub, GitLab, Stripe, CI/CD, curl) disparem este job imediatamente via HTTP.",
 "webhook.urlLabel": "URL do Webhook (com Token)",
 "webhook.tokenLabel": "Token Secreto de Autorização",
 "webhook.secretLabel": "Segredo Compartilhado HMAC (opcional para GitHub X-Hub-Signature-256)",
 "webhook.passPayload": "Injetar payload na memória persistente do agente",
 "webhook.rateLimit": "Intervalo anti-spam (segundos entre disparos)",
 "webhook.copyUrl": "Copiar URL",
 "webhook.copyCurl": "Copiar Comando cURL",
 "webhook.testBtn": "Testar Disparo Agora",
 "webhook.rotateToken": "Regenerar Token",
 "webhook.saveBtn": "Salvar Configuração Webhook",
 "webhook.disableBtn": "Desativar Webhook",
 "toast.webhookCopied": "URL do Webhook copiada!",
 "toast.webhookCurlCopied": "Comando cURL copiado!",
 "toast.webhookSaved": "Configurações de Webhook salvas!",
 "toast.webhookTriggered": "Webhook disparado com sucesso!",
 "toast.webhookDisabled": "Webhook desativado para esta tarefa.",
 "priority.label": "Prioridade do Job",
 "priority.high": "Alta",
 "priority.normal": "Normal",
 "priority.low": "Baixa",
 "tt.priorityHigh": "Prioridade Alta: executa primeiro quando houver worker livre",
 "tt.priorityNormal": "Prioridade Normal: execução padrão",
 "tt.priorityLow": "Prioridade Baixa: cede lugar a jobs prioritários",
 "nav.queue": "Fila & Workers",
 "tt.queueBtn": "Ver fila de prioridade e configurar limite de concorrência",
 "queue.modalTitle": "Concorrência & Fila de Prioridade",
 "queue.concurrencyTitle": "Limite de Concorrência (Max Workers)",
 "queue.concurrencyHelp": "Número máximo de jobs simultâneos (1-10)",
 "queue.activeTitle": "Jobs em Execução Ativa",
 "queue.queuedTitle": "Jobs em Fila de Espera",
 "queue.emptyRunning": "Nenhum job em execução no momento.",
 "queue.emptyQueued": "Nenhum job na fila de espera.",
 "queue.clearBtn": "Limpar Fila",
 "queue.saveSettings": "Salvar Limite",
 "toast.queueSaved": "Limite de concorrência salvo com sucesso!",
 "toast.queueCancelled": "Job removido da fila.",
 "toast.queueCleared": "Fila limpa com sucesso.",
 "nav.dlq": "DLQ & Circuit",
 "nav.templates": "Modelos",
 "nav.tools": "Ferramentas",
 "nav.instructions": "Instruções",
 "tour.startBtn": "Demo",
 "tt.dlqBtn": "Ver jobs em quarentena (Dead Letter Queue) e gerenciar disjuntores",
 "tt.circuitOpen": "Circuit Breaker ABERTO: Job em quarentena por falhas repetidas",
 "tt.circuitHalfOpen": "Circuit Breaker HALF-OPEN: Teste canary em andamento",
 "circuit.open": "Quarentena",
 "circuit.halfOpen": "Teste Canary",
 "circuit.resetBtn": "Reiniciar Circuit",
 "dlq.modalTitle": "Dead Letter Queue & Quarentena",
 "dlq.subtitle": "Jobs interrompidos por falhas consecutivas. Execute um teste canary ou limpe a quarentena.",
 "dlq.empty": "Nenhum job em quarentena. Todos os cron jobs estão funcionando normalmente!",
 "dlq.retryBtn": "Repetir (Canary)",
 "dlq.resolveBtn": "Resolver & Retomar",
 "dlq.deleteBtn": "Excluir Registro",
 "dlq.clearAllBtn": "Limpar DLQ",
 "toast.dlqRetried": "Teste canary bem-sucedido! Job restaurado à operação normal.",
 "toast.dlqResolved": "Job removido da quarentena e disjuntor reiniciado.",
 "toast.dlqCleared": "Dead Letter Queue limpa com sucesso.",
 "toast.dlqDeleted": "Registro DLQ removido.",
 "runs.pageTitle": "Histórico de Execuções Cron (Runs)",
 "runs.pageSubtitle": "Veja facilmente quais execuções tiveram sucesso e quais falharam",
 "runs.autoRefresh": "Auto-atualizar (5s)",
 "runs.refreshNow": "Atualizar Agora",
 "runs.kpiTotal": "Total de Execuções",
 "runs.kpiTotalSub": "runs registradas",
 "runs.kpiClickAll": "Clique para mostrar todas",
 "runs.kpiSuccess": "Iniciadas com Sucesso",
 "runs.kpiSuccessSub": "concluídas OK",
 "runs.kpiFailed": "Runs Falhadas / Erros",
 "runs.kpiFailedSub": "erros detectados",
 "runs.kpiFilterFailed": "Filtrar apenas falhas",
 "runs.kpiLastRun": "Última Execução",
 "runs.kpiAvgDuration": "Duração média:",
 "runs.timelineTitle": "Linha do Tempo das Últimas Execuções",
 "runs.timelineSub": "Cada barra representa uma execução (esquerda = antiga, direita = recente). Clique para ir ao detalhe.",
 "runs.legendSuccess": " Sucesso",
 "runs.legendFailed": " Falha",
 "runs.byJobTitle": "Saúde por Cron Job",
 "runs.byJobSub": "Clique em um cartão para filtrar esse job",
 "runs.showAllJobs": "Mostrar todos os Jobs",
 "runs.filterAll": "Todas",
 "runs.filterSuccess": "Apenas Sucessos",
 "runs.filterFailed": "Apenas Falhas",
 "runs.allJobsOption": "Todos os Cron Jobs",
 "runs.searchPlaceholder": "Buscar por nome do job, resposta, erro ou sessão...",
 "runs.listHeading": "Lista de Execuções Recentes",
 "runs.statusSuccess": " INICIADA COM SUCESSO",
 "runs.statusFailed": " EXECUÇÃO FALHOU",
 "runs.statusSkipped": "⏭ IGNORADA",
 "runs.openInChat": "Abrir no Chat",
 "runs.outputLabel": "Resposta do Cron Job:",
 "runs.errorLabel": "Detalhe do Erro / Falha:",
 "runs.expandMore": "Expandir tudo ▼",
 "runs.expandLess": "Mostrar menos ▲",
 "onboard.title": "Bem-vindo ao OpenCode Cron - Guia Rápido",
 "onboard.subtitle": "Automatize tarefas recorrentes e monitoramento diretamente nas sessões OpenCode.",
 "onboard.step1Title": "1. Agende um Job",
 "onboard.step1Desc": "Escolha uma sessão principal, defina o intervalo (ex. 5m) e configure System + Followup Prompt.",
 "onboard.step2Title": "2. Execução Autônoma 60s",
 "onboard.step2Desc": "O daemon launchd executa tarefas vencidas em segundo plano mesmo com o navegador fechado.",
 "onboard.step3Title": "3. Monitore Resultados e Chat",
 "onboard.step3Desc": "Acompanhe no Chat ao Vivo ou abra Resultados Runs (/runs) para ver sucessos e falhas.",
 "onboard.dismiss": "Ocultar dicas",
 "guide.title": "Guia e Instruções do OpenCode Cron",
 "guide.subtitle": "Manual interativo, arquitetura e solução de problemas",
 "guide.shortcutHint": "Pressione ? a qualquer momento para abrir o guia",
 "guide.closeBtn": "Entendi",
 "guide.sec1Title": " 1. Como Funciona o OpenCode Cron",
 "guide.sec1Body": "O daemon launchd verifica jobs.json a cada 60s, executa o turno na sessão escolhida, salva a memória Markdown e sincroniza o SQLite.",
 "guide.sec2Title": " 2. Criar ou Editar um Cron Job",
 "guide.sec2Body": "Use intervalos (1m, 5m, 1h) ou expressões Cron de 5 campos. Defina o System Prompt fixo e o Followup Prompt de cada ciclo.",
 "guide.sec3Title": " 3. Memória Persistente (seenHashes)",
 "guide.sec3Body": "O arquivo Markdown preserva fatos importantes e hashes já vistos para evitar duplicatas.",
 "guide.sec4Title": " 4. Página 'Resultados Runs' (/runs)",
 "guide.sec4Body": "Veja rapidamente quais execuções tiveram sucesso ( verde) e quais falharam ( vermelho), com duração e link para o chat.",
 "guide.sec5Title": " 5. Segurança e Solução de Problemas",
 "guide.sec5Body": "Após 5 falhas consecutivas o job entra em pausa automaticamente. Se atingir Max Runs (CONCLUÍDO), aumente o limite ou defina 0."
 },
 zh: {
 "app.liveBadge": "Web GUI 实时在线",
 "nav.jobs": "定时任务",
 "nav.chat": "实时对话",
 "nav.memory": "持久记忆",
 "nav.diff": "Git 变更",
 "nav.logs": "系统日志",
 "nav.runs": "运行结果",
 "nav.historyRuns": "运行历史",
 "nav.newJob": "新建任务",
 "nav.guide": "使用指南",
 "nav.dashboard": "主面板",
 "kpi.activeTasks": "活动任务",
 "kpi.totalRuns": "总运行次数 (查看结果 →)",
 "kpi.launchd": "Launchd 守护进程",
 "kpi.nextTick": "下次执行",
 "jobs.heading": "已注册的定时任务 (Cron Jobs)",
 "jobs.subheading": "直接向 OpenCode 会话写入结果的周期性自动化任务",
 "jobs.runDueNow": "立即执行到期任务",
 "jobs.emptyTitle": "尚未配置定时任务",
 "jobs.emptyDesc": "创建您的第一个计划任务，在 OpenCode 会话中自动执行资讯监控、代码检查或定期报告。",
 "jobs.createFirst": "创建第一个任务",
 "job.active": "运行中",
 "job.paused": "已暂停",
 "job.completed": "已完成",
 "job.schedule": "调度计划",
 "job.executions": "执行次数",
 "job.lastRun": "上次运行",
 "job.nextRun": "下次运行",
 "job.viewChat": "查看实时对话",
 "job.memoryBtn": "记忆",
 "job.editBtn": "编辑",
 "modal.newTitle": "新建定时任务",
 "modal.editTitle": "编辑定时任务",
 "modal.fieldTitle": "任务名称",
 "modal.fieldSchedule": "时间间隔或 Cron 表达式",
 "modal.fieldMaxRuns": "最大运行次数 (0 = 无限)",
 "modal.fieldSession": "目标 OpenCode 会话",
 "modal.fieldModel": "LLM 模型 (可选)",
 "modal.fieldSystem": "系统提示词 System Prompt (固定目标)",
 "modal.fieldFollowup": "周期提示词 Followup Prompt (每次触发指令)",
 "modal.adaptiveTitle": "自适应节奏 (Burst & Idle 突发与空闲)",
 "modal.adaptiveHelp": "活跃时自动提高执行频率，平静时逐步降低频次以节省算力与Token消耗。",
 "modal.adaptiveBurst": "突发模式间隔 (最短60秒)",
 "modal.adaptiveIdle": "空闲模式间隔",
 "modal.adaptiveQuiet": "静默判定阈值 (周期数)",
 "modal.cancel": "取消",
 "modal.save": "保存任务",
 "job.burstTitle": "启动突发加速 (15分钟)",
 "job.cadence": "执行节奏",
 "job.burstActive": "突发加速",
 "job.idleActive": "空闲休眠",
 "job.adaptiveBadge": "自适应调度",
 "toast.burstActivated": "突发加速模式已启动（持续15分钟）！",
 "tt.burstBtn": "对此任务触发15分钟高频突发加速模式",
 "modal.pipelineTitle": "多任务流水线与触发器 (工作流 DAG)",
 "modal.pipelineHelp": "将此任务与其他任务链接：成功或失败时自动触发下游任务。",
 "modal.pipelineOnSuccess": "成功时运行 (任务 ID 列表)",
 "modal.pipelineOnFailure": "失败时运行 (任务 ID 列表)",
 "modal.pipelinePassPayload": "将上游执行记忆/上下文注入到下游任务",
 "job.pipelineBadge": "流水线",
 "job.pipelineOk": "成功触发:",
 "job.pipelineErr": "失败触发:",
 "pipeline.headerBtn": "工作流与 DAG",
 "tt.pipelineBtn": "查看 DAG 工作流图与任务执行依赖关系",
 "pipeline.modalTitle": "流水线工作流图 (DAG)",
 "pipeline.emptyGraph": "尚未配置流水线。在任务中设置“成功时运行”即可创建多步工作流。",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Webhook",
 "tt.webhookBtn": "管理此任务的 Webhook 触发端点和安全令牌",
 "webhook.modalTitle": "入站 Webhook 触发端点与安全令牌",
 "webhook.modalDesc": "允许外部服务 (GitHub, GitLab, Stripe, CI/CD, curl) 通过 HTTP 即时触发此任务。",
 "webhook.urlLabel": "Webhook 触发 URL (含 Token)",
 "webhook.tokenLabel": "授权安全令牌 (Secret Token)",
 "webhook.secretLabel": "HMAC 共享密钥 (用于 GitHub X-Hub-Signature-256 签名验证)",
 "webhook.passPayload": "将事件有效载荷注入持久记忆",
 "webhook.rateLimit": "防刷防抖冷却时间 (秒)",
 "webhook.copyUrl": "复制 URL",
 "webhook.copyCurl": "复制 cURL 命令",
 "webhook.testBtn": "立即测试触发",
 "webhook.rotateToken": "重新生成令牌",
 "webhook.saveBtn": "保存 Webhook 配置",
 "webhook.disableBtn": "停用 Webhook",
 "toast.webhookCopied": "Webhook URL 已复制到剪贴板！",
 "toast.webhookCurlCopied": "cURL 命令已复制到剪贴板！",
 "toast.webhookSaved": "Webhook 设置已保存！",
 "toast.webhookTriggered": "Webhook 成功触发！",
 "toast.webhookDisabled": "此任务的 Webhook 已停用。",
 "priority.label": "任务优先级",
 "priority.high": "高",
 "priority.normal": "普通",
 "priority.low": "低",
 "tt.priorityHigh": "高优先级：当有空闲工作槽时优先执行",
 "tt.priorityNormal": "普通优先级：标准顺序执行",
 "tt.priorityLow": "低优先级：在更高优先级任务之后执行",
 "nav.queue": "队列与并发",
 "tt.queueBtn": "查看优先级队列并配置并发工作数上限",
 "queue.modalTitle": "并发管理与优先级队列",
 "queue.concurrencyTitle": "最大并发数 (Max Workers)",
 "queue.concurrencyHelp": "同时允许运行的最大任务数量 (1-10)",
 "queue.activeTitle": "正在运行的任务",
 "queue.queuedTitle": "等待排队的任务",
 "queue.emptyRunning": "当前没有运行中的任务。",
 "queue.emptyQueued": "等待队列为空。",
 "queue.clearBtn": "清空队列",
 "queue.saveSettings": "保存上限",
 "toast.queueSaved": "并发上限已成功保存！",
 "toast.queueCancelled": "任务已从队列中移除。",
 "toast.queueCleared": "等待队列已成功清空。",
 "nav.dlq": "死信队列与熔断",
 "nav.templates": "模板",
 "nav.tools": "工具",
 "nav.instructions": "使用说明",
 "tour.startBtn": "演示",
 "tt.dlqBtn": "查看隔离任务 (Dead Letter Queue) 并管理熔断器状态",
 "tt.circuitOpen": "熔断器已开启 (OPEN)：因连续多次失败任务已被隔离保护",
 "tt.circuitHalfOpen": "熔断器半开 (HALF-OPEN)：正在执行金丝雀试探探测",
 "circuit.open": "已隔离保护",
 "circuit.halfOpen": "金丝雀探测",
 "circuit.resetBtn": "重置熔断器",
 "dlq.modalTitle": "死信队列 (DLQ) 与任务隔离保护",
 "dlq.subtitle": "因连续失败次数超限而被保护性隔离的任务。可手动执行金丝雀探测或解除隔离。",
 "dlq.empty": "当前没有被隔离的任务。所有定时任务均在正常运行中！",
 "dlq.retryBtn": "重试 (金丝雀探测)",
 "dlq.resolveBtn": "解除隔离并恢复",
 "dlq.deleteBtn": "删除此记录",
 "dlq.clearAllBtn": "清空死信队列",
 "toast.dlqRetried": "金丝雀探测运行成功！任务已恢复正常调度。",
 "toast.dlqResolved": "已解除隔离保护，熔断器成功重置恢复。",
 "toast.dlqCleared": "死信队列已成功清空。",
 "toast.dlqDeleted": "死信记录已移除。",
 "runs.pageTitle": "Cron 运行历史与结果监控",
 "runs.pageSubtitle": "清晰直观地查看哪些定时任务成功启动、哪些执行失败",
 "runs.autoRefresh": "自动刷新 (5秒)",
 "runs.refreshNow": "立即刷新",
 "runs.kpiTotal": "总执行次数",
 "runs.kpiTotalSub": "条历史记录",
 "runs.kpiClickAll": "点击显示全部",
 "runs.kpiSuccess": "成功启动并完成",
 "runs.kpiSuccessSub": "次执行成功",
 "runs.kpiFailed": "执行失败 / 错误",
 "runs.kpiFailedSub": "个错误记录",
 "runs.kpiFilterFailed": "仅筛选失败记录",
 "runs.kpiLastRun": "最近一次运行",
 "runs.kpiAvgDuration": "平均响应耗时：",
 "runs.timelineTitle": "最近运行状态时间轴",
 "runs.timelineSub": "每根柱条代表一次运行（左=较早，右=最新）。点击任意柱条可跳转至对应详情。",
 "runs.legendSuccess": " 成功",
 "runs.legendFailed": " 失败",
 "runs.byJobTitle": "各任务健康度汇总",
 "runs.byJobSub": "点击任务卡片可单独筛选该任务的运行记录",
 "runs.showAllJobs": "显示全部任务",
 "runs.filterAll": "全部",
 "runs.filterSuccess": "仅看成功",
 "runs.filterFailed": "仅看失败",
 "runs.allJobsOption": "所有定时任务",
 "runs.searchPlaceholder": "搜索任务名称、输出内容、错误信息或会话 ID...",
 "runs.listHeading": "最近运行明细列表",
 "runs.statusSuccess": " 成功启动并完成",
 "runs.statusFailed": " 执行失败",
 "runs.statusSkipped": "⏭ 已跳过",
 "runs.openInChat": "在对话中打开",
 "runs.outputLabel": "Cron 任务输出内容：",
 "runs.errorLabel": "错误 / 失败原因详情：",
 "runs.expandMore": "展开全部 ▼",
 "runs.expandLess": "收起 ▲",
 "onboard.title": "欢迎使用 OpenCode Cron - 快速入门",
 "onboard.subtitle": "在 OpenCode 会话中自动运行周期性搜索、监控与代码检查任务。",
 "onboard.step1Title": "1. 创建计划任务",
 "onboard.step1Desc": "选择主会话，设置运行间隔（如 5m 或 0 9 * * *），并填写系统与周期提示词。",
 "onboard.step2Title": "2. 60秒后台守护进程",
 "onboard.step2Desc": "macOS launchd 守护进程每 60 秒自动检查并运行到期任务，关闭浏览器也不受影响。",
 "onboard.step3Title": "3. 查看运行结果与对话",
 "onboard.step3Desc": "在“实时对话”中查看回复，或打开“运行结果”(/runs) 页面清晰排查成功与失败记录。",
 "onboard.dismiss": "隐藏入门提示",
 "guide.title": "OpenCode Cron 使用指南与说明",
 "guide.subtitle": "交互式手册、系统架构与常见问题排查",
 "guide.shortcutHint": "随时按 ? 键打开本指南",
 "guide.closeBtn": "明白了",
 "guide.sec1Title": " 1. 工作原理 (系统架构)",
 "guide.sec1Body": "macOS launchd 守护进程 (ai.opencode.cron) 每 60 秒检查一次 jobs.json。到期后在目标会话中启动代理回合，更新 Markdown 持久记忆，并将 SQLite v2 消息同步镜像到 v1 表。",
 "guide.sec2Title": " 2. 创建与配置任务",
 "guide.sec2Body": "支持简写间隔（1m、5m、1h）或 5 字段 Cron 表达式。建议绑定“ 主会话”，System Prompt 设定固定规则，Followup Prompt 设定每次触发的具体指令。",
 "guide.sec3Title": " 3. 持久记忆与去重 (seenHashes)",
 "guide.sec3Body": "即使会话被压缩，.opencode/cron/memory/<jobId>.md 仍会保留关键事实和已处理的 URL 哈希，防止重复汇报。",
 "guide.sec4Title": " 4. 专用的“运行结果”页面 (/runs)",
 "guide.sec4Body": "在 /runs 页面可一目了然地查看成功（绿色 ）与失败（红色 ）的运行记录、耗时、Token 消耗及错误详情。",
 "guide.sec5Title": " 5. 安全防护与故障排查",
 "guide.sec5Body": "连续失败 5 次将自动暂停任务；达到最大运行次数（已完成）时，调高 Max Runs 或设为 0 即可继续运行。"
 },
 ja: {
 "app.liveBadge": "Web GUI 稼働中",
 "nav.jobs": "ジョブ & Cron",
 "nav.chat": "ライブチャット",
 "nav.memory": "メモリ",
 "nav.diff": "Git Diff",
 "nav.logs": "ログ",
 "nav.runs": "実行結果 (Runs)",
 "nav.historyRuns": "実行履歴",
 "nav.newJob": "新規ジョブ",
 "nav.guide": "ガイド",
 "nav.dashboard": "ダッシュボード",
 "kpi.activeTasks": "有効なタスク",
 "kpi.totalRuns": "総実行回数 (結果を見る →)",
 "kpi.launchd": "Launchd デーモン",
 "kpi.nextTick": "次回ティック",
 "jobs.heading": "登録済み Cron ジョブ",
 "jobs.subheading": "OpenCode セッションに直接書き込む定期実行タスク",
 "jobs.runDueNow": "期限到来ジョブを今すぐ実行",
 "jobs.emptyTitle": "Cron ジョブが設定されていません",
 "jobs.emptyDesc": "最初のスケジュールタスクを作成して、リサーチや監視、レポート作成を OpenCode 内で自動化しましょう。",
 "jobs.createFirst": "最初のジョブを作成",
 "job.active": "有効",
 "job.paused": "一時停止",
 "job.completed": "完了",
 "job.schedule": "スケジュール",
 "job.executions": "実行回数",
 "job.lastRun": "最終実行",
 "job.nextRun": "次回",
 "job.viewChat": "チャットを見る",
 "job.memoryBtn": "メモリ",
 "job.editBtn": "編集",
 "modal.newTitle": "新規 Cron ジョブ",
 "modal.editTitle": "Cron ジョブを編集",
 "modal.fieldTitle": "ジョブ名",
 "modal.fieldSchedule": "間隔または Cron 式",
 "modal.fieldMaxRuns": "最大実行回数 (0 = 無制限)",
 "modal.fieldSession": "対象 OpenCode セッション",
 "modal.fieldModel": "LLM モデル (任意)",
 "modal.fieldSystem": "System Prompt (固定目標・ルール)",
 "modal.fieldFollowup": "Followup Prompt (毎回の実行指示)",
 "modal.adaptiveTitle": "適応型ケイデンス (バースト＆アイドル)",
 "modal.adaptiveHelp": "アクティビティ検知時は高頻度に加速し、変化がない時は自動で間隔を広げてトークンとリソースを節約します。",
 "modal.adaptiveBurst": "バースト間隔 (最小60秒)",
 "modal.adaptiveIdle": "アイドル間隔",
 "modal.adaptiveQuiet": "静寂判定しきい値 (回)",
 "modal.cancel": "キャンセル",
 "modal.save": "保存する",
 "job.burstTitle": "バーストモード開始 (15分)",
 "job.cadence": "ケイデンス",
 "job.burstActive": "バースト",
 "job.idleActive": "アイドル",
 "job.adaptiveBadge": "適応型",
 "toast.burstActivated": "バーストモードが15分間有効化されました！",
 "tt.burstBtn": "このジョブで15分間の高頻度バーストモードを起動",
 "modal.pipelineTitle": "マルチジョブ・パイプライン＆トリガー (ワークフロー DAG)",
 "modal.pipelineHelp": "このジョブを他のジョブと連携：成功時または失敗時に後続ジョブを自動実行します。",
 "modal.pipelineOnSuccess": "成功時に実行 (ジョブID)",
 "modal.pipelineOnFailure": "失敗時に実行 (ジョブID)",
 "modal.pipelinePassPayload": "親ジョブのコンテキスト・メモリを下流ジョブに注入",
 "job.pipelineBadge": "パイプライン",
 "job.pipelineOk": "成功時:",
 "job.pipelineErr": "失敗時:",
 "pipeline.headerBtn": "ワークフロー & DAG",
 "tt.pipelineBtn": "DAGワークフローグラフとジョブ依存関係を表示",
 "pipeline.modalTitle": "パイプライン・ワークフローグラフ (DAG)",
 "pipeline.emptyGraph": "パイプラインはまだ設定されていません。「成功時に実行」を設定してワークフローを作成してください。",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Webhook",
 "tt.webhookBtn": "このジョブの Webhook トリガーエンドポイントとシークレットトークンを管理",
 "webhook.modalTitle": "インバウンド Webhook トリガー＆シークレットトークン",
 "webhook.modalDesc": "外部サービス（GitHub、GitLab、Stripe、CI/CD、curl）から HTTP 経由でこのジョブを即座にトリガーします。",
 "webhook.urlLabel": "Webhook トリガー URL（Token 付き）",
 "webhook.tokenLabel": "認証シークレットトークン",
 "webhook.secretLabel": "HMAC 共有シークレット（GitHub X-Hub-Signature-256 検証用）",
 "webhook.passPayload": "イベントペイロードを持続メモリに挿入",
 "webhook.rateLimit": "クールダウン時間（トリガー間隔・秒）",
 "webhook.copyUrl": "URL をコピー",
 "webhook.copyCurl": "cURL コマンドをコピー",
 "webhook.testBtn": "今すぐトリガーをテスト",
 "webhook.rotateToken": "トークンを再生成",
 "webhook.saveBtn": "Webhook 設定を保存",
 "webhook.disableBtn": "Webhook を無効化",
 "toast.webhookCopied": "Webhook URL をクリップボードにコピーしました！",
 "toast.webhookCurlCopied": "cURL コマンドをクリップボードにコピーしました！",
 "toast.webhookSaved": "Webhook 設定を保存しました！",
 "toast.webhookTriggered": "Webhook が正常にトリガーされました！",
 "toast.webhookDisabled": "Webhook を無効化しました。",
 "priority.label": "ジョブ優先度",
 "priority.high": "高",
 "priority.normal": "通常",
 "priority.low": "低",
 "tt.priorityHigh": "高優先度：ワーカーが空き次第最優先で実行",
 "tt.priorityNormal": "通常優先度：標準の実行順序",
 "tt.priorityLow": "低優先度：優先度の高いジョブの後に実行",
 "nav.queue": "キュー＆並行数",
 "tt.queueBtn": "優先度キューを確認し並行ワーカー数を設定",
 "queue.modalTitle": "並行制御＆優先度キュー",
 "queue.concurrencyTitle": "並行実行数制限 (Max Workers)",
 "queue.concurrencyHelp": "同時に実行可能な最大ジョブ数 (1-10)",
 "queue.activeTitle": "実行中のジョブ",
 "queue.queuedTitle": "待機中のジョブ",
 "queue.emptyRunning": "現在実行中のジョブはありません。",
 "queue.emptyQueued": "待機中のキューはありません。",
 "queue.clearBtn": "キューをクリア",
 "queue.saveSettings": "上限を保存",
 "toast.queueSaved": "並行数制限が正常に保存されました！",
 "toast.queueCancelled": "ジョブがキューから削除されました。",
 "toast.queueCleared": "キューが正常にクリアされました。",
 "nav.dlq": "DLQ＆サーキット",
 "nav.templates": "テンプレート",
 "nav.tools": "ツール",
 "nav.instructions": "使い方",
 "tour.startBtn": "デモ",
 "tt.dlqBtn": "隔離ジョブ（Dead Letter Queue）を確認しサーキットブレーカーを管理",
 "tt.circuitOpen": "サーキットブレーカー OPEN: 連続失敗のためジョブが隔離保護されています",
 "tt.circuitHalfOpen": "サーキットブレーカー HALF-OPEN: カナリア試行テスト実行中",
 "circuit.open": "隔離保護中",
 "circuit.halfOpen": "カナリア試行",
 "circuit.resetBtn": "サーキットリセット",
 "dlq.modalTitle": "デッドレターキュー (DLQ) ＆ 隔離管理",
 "dlq.subtitle": "連続失敗が上限に達し停止したジョブです。カナリア試行または隔離解除を実行できます。",
 "dlq.empty": "現在、隔離中のジョブはありません。すべての Cron ジョブが正常に動作しています！",
 "dlq.retryBtn": "再試行 (カナリア)",
 "dlq.resolveBtn": "解決して再開",
 "dlq.deleteBtn": "エントリ削除",
 "dlq.clearAllBtn": "DLQを全クリア",
 "toast.dlqRetried": "カナリア試行が成功しました！ジョブが通常運用に復旧しました。",
 "toast.dlqResolved": "隔離が解除され、サーキットブレーカーがリセットされました。",
 "toast.dlqCleared": "デッドレターキューが正常にクリアされました。",
 "toast.dlqDeleted": "DLQエントリが削除されました。",
 "runs.pageTitle": "Cron 実行履歴・結果一覧 (Runs)",
 "runs.pageSubtitle": "成功したジョブと失敗したジョブを一目で確認できます",
 "runs.autoRefresh": "自動更新 (5秒)",
 "runs.refreshNow": "今すぐ更新",
 "runs.kpiTotal": "総実行回数",
 "runs.kpiTotalSub": "件の記録",
 "runs.kpiClickAll": "クリックですべて表示",
 "runs.kpiSuccess": "成功した実行",
 "runs.kpiSuccessSub": "件が正常完了",
 "runs.kpiFailed": "失敗 / エラー",
 "runs.kpiFailedSub": "件のエラー",
 "runs.kpiFilterFailed": "失敗のみを絞り込む",
 "runs.kpiLastRun": "最終実行日時",
 "runs.kpiAvgDuration": "平均応答時間:",
 "runs.timelineTitle": "直近の実行タイムライン",
 "runs.timelineSub": "各バーは1回の実行を表します（左＝過去、右＝最新）。クリックすると詳細へ移動します。",
 "runs.legendSuccess": " 成功",
 "runs.legendFailed": " 失敗",
 "runs.byJobTitle": "Cron ジョブ別の稼働状況",
 "runs.byJobSub": "カードをクリックするとそのジョブの履歴だけを絞り込みます",
 "runs.showAllJobs": "すべてのジョブを表示",
 "runs.filterAll": "すべて",
 "runs.filterSuccess": "成功のみ",
 "runs.filterFailed": "失敗のみ",
 "runs.allJobsOption": "すべての Cron ジョブ",
 "runs.searchPlaceholder": "ジョブ名、出力テキスト、エラー、セッションIDで検索...",
 "runs.listHeading": "最新の実行リスト",
 "runs.statusSuccess": " 正常に実行完了",
 "runs.statusFailed": " 実行失敗",
 "runs.statusSkipped": "⏭ スキップ",
 "runs.openInChat": "チャットで開く",
 "runs.outputLabel": "Cron ジョブの出力:",
 "runs.errorLabel": "エラー / 失敗の詳細:",
 "runs.expandMore": "全文を表示 ▼",
 "runs.expandLess": "折りたたむ ▲",
 "onboard.title": "OpenCode Cron へようこそ - クイックスタート",
 "onboard.subtitle": "定期的な調査やモニタリングを OpenCode セッション内で自動化します。",
 "onboard.step1Title": "1. ジョブをスケジュール",
 "onboard.step1Desc": "メインセッションを選び、間隔（例: 5m）と System / Followup プロンプトを設定します。",
 "onboard.step2Title": "2. 60秒周期の自律デーモン",
 "onboard.step2Desc": "macOS launchd デーモンがブラウザを閉じていてもバックグラウンドで自動実行します。",
 "onboard.step3Title": "3. 実行結果とチャットを確認",
 "onboard.step3Desc": "ライブチャットや「実行結果 (/runs)」ページで成功・失敗をすぐに確認できます。",
 "onboard.dismiss": "ヒントを隠す",
 "guide.title": "OpenCode Cron ガイド & 説明書",
 "guide.subtitle": "インタラクティブマニュアル・仕組み・トラブルシューティング",
 "guide.shortcutHint": "いつでも ? キーでこのガイドを開けます",
 "guide.closeBtn": "閉じる",
 "guide.sec1Title": " 1. OpenCode Cron の仕組み",
 "guide.sec1Body": "launchd デーモンが60秒ごとに jobs.json を確認し、対象セッションでターンを実行、Markdownメモリを更新し SQLite を同期します。",
 "guide.sec2Title": " 2. ジョブの作成と編集",
 "guide.sec2Body": "間隔（1m, 5m, 1h）または5フィールドの Cron 式を指定します。System Prompt に固定ルール、Followup Prompt に毎回の指示を記述します。",
 "guide.sec3Title": " 3. 永続メモリと重複排除 (seenHashes)",
 "guide.sec3Body": "チャットが圧縮されても Markdown メモリが重要事項と既読ハッシュを保持し、重複を防ぎます。",
 "guide.sec4Title": " 4. 実行結果ページ (/runs)",
 "guide.sec4Body": "成功（緑 ）と失敗（赤 ）を一目で判別でき、所要時間やエラー内容、チャットへの直接リンクを提供します。",
 "guide.sec5Title": " 5. 安全機能とトラブルシューティング",
 "guide.sec5Body": "5回連続で失敗すると自動停止します。上限到達（完了）時は Max Runs を増やすか 0 に設定してください。"
 },
 ar: {
 "app.liveBadge": "واجهة الويب متصلة",
 "nav.jobs": "المهام المجدولة",
 "nav.chat": "المحادثة المباشرة",
 "nav.memory": "الذاكرة",
 "nav.diff": "تغييرات Git",
 "nav.logs": "السجلات",
 "nav.runs": "نتائج التشغيل",
 "nav.historyRuns": "سجل التشغيل",
 "nav.newJob": "مهمة جديدة",
 "nav.guide": "الدليل",
 "nav.dashboard": "لوحة التحكم",
 "kpi.activeTasks": "المهام النشطة",
 "kpi.totalRuns": "إجمالي مرات التشغيل (عرض ←)",
 "kpi.launchd": "خدمة Launchd",
 "kpi.nextTick": "التشغيل القادم",
 "jobs.heading": "مهام Cron المسجلة",
 "jobs.subheading": "مهام متكررة تكتب نتائجها مباشرة داخل جلسات OpenCode",
 "jobs.runDueNow": "تشغيل المهام المستحقة الآن",
 "jobs.emptyTitle": "لا توجد مهام مجدولة",
 "jobs.emptyDesc": "أنشئ مهمتك المجدولة الأولى لأتمتة البحث أو المراقبة أو التقارير داخل جلسة OpenCode.",
 "jobs.createFirst": "إنشاء أول مهمة Cron",
 "job.active": "نشط",
 "job.paused": "متوقف مؤقتاً",
 "job.completed": "مكتمل",
 "job.schedule": "الجدولة",
 "job.executions": "مرات التشغيل",
 "job.lastRun": "آخر تشغيل",
 "job.nextRun": "القادم",
 "job.viewChat": "فتح المحادثة",
 "job.memoryBtn": "الذاكرة",
 "job.editBtn": "تعديل",
 "modal.newTitle": "مهمة Cron جديدة",
 "modal.editTitle": "تعديل مهمة Cron",
 "modal.fieldTitle": "عنوان المهمة",
 "modal.fieldSchedule": "الفاصل الزمني أو تعبير Cron",
 "modal.fieldMaxRuns": "الحد الأقصى للتشغيل (0 = غير محدود)",
 "modal.fieldSession": "جلسة OpenCode المستهدفة",
 "modal.fieldModel": "نموذج LLM (اختياري)",
 "modal.fieldSystem": "System Prompt (الهدف والقواعد الثابتة)",
 "modal.fieldFollowup": "Followup Prompt (تعليمات كل دورة)",
 "modal.adaptiveTitle": "الإيقاع التكيفي (Burst & Idle)",
 "modal.adaptiveHelp": "تسريع وتيرة الفحص أثناء النشاط وتخفيف التكرار عند الهدوء لتوفير الموارد واستهلاك التوكنز.",
 "modal.adaptiveBurst": "فاصل وضع الاندفاع (حد أدنى 60 ثانية)",
 "modal.adaptiveIdle": "فاصل وضع الخمول",
 "modal.adaptiveQuiet": "عتبة الهدوء (عدد الدورات)",
 "modal.cancel": "إلغاء",
 "modal.save": "حفظ المهمة",
 "job.burstTitle": "تفعيل وضع الاندفاع (15 دقيقة)",
 "job.cadence": "الإيقاع",
 "job.burstActive": "اندفاع",
 "job.idleActive": "خمول",
 "job.adaptiveBadge": "تكيفي",
 "toast.burstActivated": "تم تفعيل وضع الاندفاع لمدة 15 دقيقة!",
 "tt.burstBtn": "تفعيل وضع الاندفاع عالي التردد لمدة 15 دقيقة لهذه المهمة",
 "modal.pipelineTitle": "مسار المهام المتعددة والمحفزات (DAG سير العمل)",
 "modal.pipelineHelp": "اربط هذه المهمة بمهام أخرى: شغّل المهام التابعة تلقائياً عند النجاح أو الفشل.",
 "modal.pipelineOnSuccess": "تشغيل عند النجاح (معرفات المهام)",
 "modal.pipelineOnFailure": "تشغيل عند الفشل (معرفات المهام)",
 "modal.pipelinePassPayload": "تمرير سياق الذاكرة للمهمة السابقة إلى المهام اللاحقة",
 "job.pipelineBadge": "المسار",
 "job.pipelineOk": "عند النجاح:",
 "job.pipelineErr": "عند الفشل:",
 "pipeline.headerBtn": "سير العمل و DAG",
 "tt.pipelineBtn": "عرض رسم بياني DAG وعلاقات تبعية المهام",
 "pipeline.modalTitle": "رسم بياني لمسار العمل (DAG)",
 "pipeline.emptyGraph": "لم يتم إعداد أي مسار بعد. حدد 'تشغيل عند النجاح' لإنشاء سير عمل.",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "الويب هوك",
 "tt.webhookBtn": "إدارة نقطة نهاية الويب هوك والرمز السري لهذه المهمة",
 "webhook.modalTitle": "نقطة نهاية الويب هوك الوارد والرمز السري",
 "webhook.modalDesc": "يتيح للخدمات الخارجية (GitHub وGitLab وStripe وCI/CD وcurl) تشغيل هذه المهمة فورياً عبر HTTP.",
 "webhook.urlLabel": "رابط تشغيل الويب هوك (مع الرمز)",
 "webhook.tokenLabel": "الرمز السري للتفويض",
 "webhook.secretLabel": "السر المشترك لـ HMAC (اختياري لـ GitHub X-Hub-Signature-256)",
 "webhook.passPayload": "تمرير بيانات الحدث إلى الذاكرة الدائمة",
 "webhook.rateLimit": "فترة التهدئة لمنع التكرار (ثوانٍ)",
 "webhook.copyUrl": "نسخ الرابط",
 "webhook.copyCurl": "نسخ أمر cURL",
 "webhook.testBtn": "اختبار التشغيل الآن",
 "webhook.rotateToken": "إعادة إنشاء الرمز",
 "webhook.saveBtn": "حفظ إعدادات الويب هوك",
 "webhook.disableBtn": "تعطيل الويب هوك",
 "toast.webhookCopied": "تم نسخ رابط الويب هوك إلى الحافظة!",
 "toast.webhookCurlCopied": "تم نسخ أمر cURL إلى الحافظة!",
 "toast.webhookSaved": "تم حفظ إعدادات الويب هوك بنجاح!",
 "toast.webhookTriggered": "تم تشغيل الويب هوك بنجاح!",
 "toast.webhookDisabled": "تم تعطيل الويب هوك لهذه المهمة.",
 "priority.label": "أولوية المهمة",
 "priority.high": "عالية",
 "priority.normal": "عادية",
 "priority.low": "منخفضة",
 "tt.priorityHigh": "أولوية عالية: تُنفذ أولاً عند توفر عمال شاغرين",
 "tt.priorityNormal": "أولوية عادية: تنفيذ قياسي",
 "tt.priorityLow": "أولوية منخفضة: تتنازل للمهام ذات الأولوية الأعلى",
 "nav.queue": "قائمة الانتظار والتوازي",
 "tt.queueBtn": "عرض قائمة الانتظار وتعيين حد التزامن للعمال",
 "queue.modalTitle": "إدارة التزامن وقائمة الأولويات",
 "queue.concurrencyTitle": "حد التزامن (الحد الأقصى للعمال)",
 "queue.concurrencyHelp": "أقصى عدد للمهام التي تعمل بالتزامن (1-10)",
 "queue.activeTitle": "المهام الجاري تنفيذها حالياً",
 "queue.queuedTitle": "المهام في قائمة الانتظار",
 "queue.emptyRunning": "لا توجد مهام قيد التشغيل حالياً.",
 "queue.emptyQueued": "قائمة الانتظار فارغة.",
 "queue.clearBtn": "إفراغ القائمة",
 "queue.saveSettings": "حفظ الحد",
 "toast.queueSaved": "تم حفظ حد التزامن بنجاح!",
 "toast.queueCancelled": "تمت إزالة المهمة من قائمة الانتظار.",
 "toast.queueCleared": "تم إفراغ قائمة الانتظار بنجاح.",
 "nav.dlq": "قائمة المهام المعطلة والحماية",
 "nav.templates": "القوالب",
 "nav.tools": "الأدوات",
 "nav.instructions": "التعليمات",
 "tour.startBtn": "عرض توضيحي",
 "tt.dlqBtn": "عرض المهام المحجوزة في الحجر الصحي (Dead Letter Queue) وإدارة قواطع الدائرة",
 "tt.circuitOpen": "قاطع الدائرة مفتوح (OPEN): تم حجر المهمة بسبب الإخفاقات المتكررة",
 "tt.circuitHalfOpen": "قاطع الدائرة شبه مفتوح (HALF-OPEN): جاري تشغيل فحص الاختبار التجريبي (Canary)",
 "circuit.open": "في الحجر الصحي",
 "circuit.halfOpen": "اختبار تجريبي",
 "circuit.resetBtn": "إعادة ضبط القاطع",
 "dlq.modalTitle": "قائمة المهام المعطلة والحجر الصحي (DLQ)",
 "dlq.subtitle": "المهام المتوقفة بسبب الإخفاقات المتتالية. قم بتشغيل فحص تجريبي أو إلغاء الحجر.",
 "dlq.empty": "لا توجد مهام محجوزة. جميع مهام Cron تعمل بشكل طبيعي!",
 "dlq.retryBtn": "إعادة المحاولة (تجريبي)",
 "dlq.resolveBtn": "حل المشكلة واستئناف العمل",
 "dlq.deleteBtn": "حذف القيد",
 "dlq.clearAllBtn": "تفريغ قائمة الحجر",
 "toast.dlqRetried": "نجح الفحص التجريبي! تم استئناف تشغيل المهمة بشكل طبيعي.",
 "toast.dlqResolved": "تمت إزالة المهمة من الحجر الصحي وإعادة ضبط قاطع الدائرة.",
 "toast.dlqCleared": "تم تفريغ قائمة المهام المعطلة بنجاح.",
 "toast.dlqDeleted": "تم حذف قيد الحجر بنجاح.",
 "runs.pageTitle": "سجل ونتائج تشغيل مهام Cron",
 "runs.pageSubtitle": "تحقق بوضوح من المهام التي عملت بنجاح وتلك التي فشلت",
 "runs.autoRefresh": "تحديث تلقائي (5 ث)",
 "runs.refreshNow": "تحديث الآن",
 "runs.kpiTotal": "إجمالي عمليات التشغيل",
 "runs.kpiTotalSub": "عملية مسجلة",
 "runs.kpiClickAll": "اضغط لعرض الكل",
 "runs.kpiSuccess": "عمليات ناجحة",
 "runs.kpiSuccessSub": "اكتملت بنجاح",
 "runs.kpiFailed": "عمليات فاشلة / أخطاء",
 "runs.kpiFailedSub": "أخطاء مكتشفة",
 "runs.kpiFilterFailed": "تصفية العمليات الفاشلة فقط",
 "runs.kpiLastRun": "آخر عملية تشغيل",
 "runs.kpiAvgDuration": "متوسط وقت الاستجابة:",
 "runs.timelineTitle": "الشريط الزمني لآخر عمليات التشغيل",
 "runs.timelineSub": "يمثل كل عمود عملية تشغيل. اضغط على أي عمود للانتقال إلى تفاصيله.",
 "runs.legendSuccess": " ناجحة",
 "runs.legendFailed": " فاشلة",
 "runs.byJobTitle": "حالة الأداء لكل مهمة Cron",
 "runs.byJobSub": "اضغط على أي بطاقة لتصفية السجل حسب تلك المهمة",
 "runs.showAllJobs": "عرض كل المهام",
 "runs.filterAll": "الكل",
 "runs.filterSuccess": "الناجحة فقط",
 "runs.filterFailed": "الفاشلة فقط",
 "runs.allJobsOption": "جميع مهام Cron",
 "runs.searchPlaceholder": "ابحث باسم المهمة أو المخرجات أو الخطأ أو معرف الجلسة...",
 "runs.listHeading": "قائمة عمليات التشغيل الأخيرة",
 "runs.statusSuccess": " تمت العملية بنجاح",
 "runs.statusFailed": " فشل التشغيل",
 "runs.statusSkipped": "⏭ تم التخطي",
 "runs.openInChat": "فتح في المحادثة",
 "runs.outputLabel": "مخرجات مهمة Cron:",
 "runs.errorLabel": "تفاصيل الخطأ / الفشل:",
 "runs.expandMore": "عرض الكل ▼",
 "runs.expandLess": "عرض أقل ▲",
 "onboard.title": "مرحباً بك في OpenCode Cron - دليل البدء السريع",
 "onboard.subtitle": "أتمتة المهام المتكررة ومراقبة الأخبار مباشرة داخل جلسات OpenCode.",
 "onboard.step1Title": "1. جدولة مهمة",
 "onboard.step1Desc": "اختر جلسة رئيسية وحدد الفاصل الزمني (مثل 5m) واكتب تعليمات النظام والمتابعة.",
 "onboard.step2Title": "2. تشغيل تلقائي كل 60 ثانية",
 "onboard.step2Desc": "تعمل خدمة launchd في الخلفية حتى عند إغلاق المتصفح وتقوم بمزامنة قاعدة البيانات.",
 "onboard.step3Title": "3. متابعة النتائج والمحادثة",
 "onboard.step3Desc": "تابع الردود في المحادثة المباشرة أو افتح صفحة نتائج التشغيل (/runs) لمعرفة النجاح والفشل.",
 "onboard.dismiss": "إخفاء النصائح",
 "guide.title": "دليل وتعليمات OpenCode Cron",
 "guide.subtitle": "الدليل التفاعلي، بنية النظام وحل المشكلات",
 "guide.shortcutHint": "اضغط ? في أي وقت لفتح الدليل",
 "guide.closeBtn": "حسناً، فهمت",
 "guide.sec1Title": " 1. كيف يعمل OpenCode Cron",
 "guide.sec1Body": "تقوم خدمة launchd بفحص ملف jobs.json كل 60 ثانية، وتشغيل المهمة في الجلسة المحددة، وتحديث ذاكرة Markdown ومزامنة SQLite.",
 "guide.sec2Title": " 2. إنشاء أو تعديل مهمة Cron",
 "guide.sec2Body": "استخدم فواصل بسيطة (1m, 5m, 1h) أو تعبيرات Cron. اختر جلسة رئيسية وحدد System Prompt الثابت وFollowup Prompt لكل دورة.",
 "guide.sec3Title": " 3. الذاكرة الدائمة ومنع التكرار (seenHashes)",
 "guide.sec3Body": "تحفظ ذاكرة Markdown الحقائق الأساسية والروابط التي تمت معالجتها لمنع التكرار حتى بعد ضغط المحادثة.",
 "guide.sec4Title": " 4. صفحة نتائج التشغيل (/runs)",
 "guide.sec4Body": "تعرض بوضوح العمليات الناجحة ( بالأخضر) والفاشلة ( بالأحمر) مع المدة والتفاصيل ورابط المحادثة.",
 "guide.sec5Title": " 5. الأمان وحل المشكلات",
 "guide.sec5Body": "تتوقف المهمة تلقائياً بعد 5 إخفاقات متتالية. وإذا وصلت للحد الأقصى (مكتمل)، قم بزيادة Max Runs أو اضبطه على 0."
 },
 ru: {
 "app.liveBadge": "Web GUI Онлайн",
 "nav.jobs": "Задачи и Cron",
 "nav.chat": "Живой Чат",
 "nav.memory": "Память",
 "nav.diff": "Git Diff",
 "nav.logs": "Логи",
 "nav.runs": "Итоги Запусков",
 "nav.historyRuns": "История Запусков",
 "nav.newJob": "Новая Задача",
 "nav.guide": "Инструкция",
 "nav.dashboard": "Панель",
 "kpi.activeTasks": "Активные Задачи",
 "kpi.totalRuns": "Всего Запусков (Итоги →)",
 "kpi.launchd": "Демон Launchd",
 "kpi.nextTick": "Следующий Тик",
 "jobs.heading": "Зарегистрированные Cron-задачи",
 "jobs.subheading": "Регулярные задачи, пишущие напрямую в сессии OpenCode",
 "jobs.runDueNow": "Запустить Просроченные",
 "jobs.emptyTitle": "Нет Настроенных Cron-задач",
 "jobs.emptyDesc": "Создайте первую задачу по расписанию для автоматизации поиска, мониторинга или отчетов в OpenCode.",
 "jobs.createFirst": "Создать Первую Задачу",
 "job.active": "АКТИВНА",
 "job.paused": "ПАУЗА",
 "job.completed": "ЗАВЕРШЕНА",
 "job.schedule": "Расписание",
 "job.executions": "Выполнений",
 "job.lastRun": "Последний",
 "job.nextRun": "Следующий",
 "job.viewChat": "Открыть Чат",
 "job.memoryBtn": "Память",
 "job.editBtn": "Изменить",
 "modal.newTitle": "Новая Cron-задача",
 "modal.editTitle": "Изменить Cron-задачу",
 "modal.fieldTitle": "Название Задачи",
 "modal.fieldSchedule": "Интервал или Cron-выражение",
 "modal.fieldMaxRuns": "Макс. Запусков (0 = бесконечно)",
 "modal.fieldSession": "Целевая Сессия OpenCode",
 "modal.fieldModel": "Модель LLM (Опционально)",
 "modal.fieldSystem": "System Prompt (Фиксированная Цель)",
 "modal.fieldFollowup": "Followup Prompt (Команда на каждый тик)",
 "modal.adaptiveTitle": "Адаптивный ритм (Burst & Idle)",
 "modal.adaptiveHelp": "Ускоряет частоту при обнаружении активности и замедляет при затишье для экономии токенов и ресурсов.",
 "modal.adaptiveBurst": "Интервал Burst (мин. 60с)",
 "modal.adaptiveIdle": "Интервал Idle",
 "modal.adaptiveQuiet": "Порог затишья (тики)",
 "modal.cancel": "Отмена",
 "modal.save": "Сохранить",
 "job.burstTitle": "Включить режим Burst (15м)",
 "job.cadence": "Ритм",
 "job.burstActive": "BURST",
 "job.idleActive": "IDLE",
 "job.adaptiveBadge": "АДАПТИВНЫЙ",
 "toast.burstActivated": "Режим Burst активирован на 15 минут!",
 "tt.burstBtn": "Включить высокочастотный режим Burst на 15 минут для этой задачи",
 "modal.pipelineTitle": "Конвейер и триггеры задач (DAG-воркфлоу)",
 "modal.pipelineHelp": "Связывайте задачи в цепочки: запускайте зависимые задачи автоматически при успехе или ошибке.",
 "modal.pipelineOnSuccess": "Запуск при успехе (ID задач)",
 "modal.pipelineOnFailure": "Запуск при ошибке (ID задач)",
 "modal.pipelinePassPayload": "Передавать контекст памяти родительской задачи зависимым задачам",
 "job.pipelineBadge": "КОНВЕЙЕР",
 "job.pipelineOk": "при OK:",
 "job.pipelineErr": "при ERR:",
 "pipeline.headerBtn": "Воркфлоу и DAG",
 "tt.pipelineBtn": "Просмотр DAG-графа и зависимостей выполнения задач",
 "pipeline.modalTitle": "Граф конвейера задач (DAG)",
 "pipeline.emptyGraph": "Конвейеры пока не настроены. Укажите 'Запуск при успехе' в задаче для создания цепочки.",
 "job.webhookBadge": "WEBHOOK",
 "job.webhookBtn": "Вебхук",
 "tt.webhookBtn": "Управление эндпоинтом вебхука и секретным токеном для этой задачи",
 "webhook.modalTitle": "Входящий эндпоинт вебхука и секретный токен",
 "webhook.modalDesc": "Позволяет внешним сервисам (GitHub, GitLab, Stripe, CI/CD, curl) мгновенно запускать задачу по HTTP.",
 "webhook.urlLabel": "URL вызова вебхука (с токеном)",
 "webhook.tokenLabel": "Секретный токен авторизации",
 "webhook.secretLabel": "Общий секрет HMAC (для подписи GitHub X-Hub-Signature-256)",
 "webhook.passPayload": "Передавать полезную нагрузку в постоянную память",
 "webhook.rateLimit": "Кулдаун анти-спама (секунды между вызовами)",
 "webhook.copyUrl": "Копировать URL",
 "webhook.copyCurl": "Копировать команду cURL",
 "webhook.testBtn": "Тестировать запуск",
 "webhook.rotateToken": "Сгенерировать новый токен",
 "webhook.saveBtn": "Сохранить настройки вебхука",
 "webhook.disableBtn": "Отключить вебхук",
 "toast.webhookCopied": "URL вебхука скопирован в буфер!",
 "toast.webhookCurlCopied": "Команда cURL скопирована в буфер!",
 "toast.webhookSaved": "Настройки вебхука сохранены!",
 "toast.webhookTriggered": "Вебхук успешно вызван!",
 "toast.webhookDisabled": "Вебхук отключен для этой задачи.",
 "priority.label": "Приоритет задачи",
 "priority.high": "Высокий",
 "priority.normal": "Обычный",
 "priority.low": "Низкий",
 "tt.priorityHigh": "Высокий приоритет: выполняется первым при освобождении воркера",
 "tt.priorityNormal": "Обычный приоритет: стандартный порядок выполнения",
 "tt.priorityLow": "Низкий приоритет: уступает задачам с более высоким приоритетом",
 "nav.queue": "Очередь и воркеры",
 "tt.queueBtn": "Просмотр очереди приоритетов и настройка лимита параллелизма",
 "queue.modalTitle": "Параллелизм и очередь приоритетов",
 "queue.concurrencyTitle": "Лимит параллелизма (Max Workers)",
 "queue.concurrencyHelp": "Максимальное число одновременно выполняемых задач (1-10)",
 "queue.activeTitle": "Активно выполняемые задачи",
 "queue.queuedTitle": "Задачи в очереди ожидания",
 "queue.emptyRunning": "В данный момент нет выполняемых задач.",
 "queue.emptyQueued": "Очередь ожидания пуста.",
 "queue.clearBtn": "Очистить очередь",
 "queue.saveSettings": "Сохранить лимит",
 "toast.queueSaved": "Лимит параллелизма успешно сохранен!",
 "toast.queueCancelled": "Задача удалена из очереди.",
 "toast.queueCleared": "Очередь успешно очищена.",
 "nav.dlq": "DLQ и Защита",
 "nav.templates": "Шаблоны",
 "nav.tools": "Инструменты",
 "nav.instructions": "Инструкции",
 "tour.startBtn": "Демо",
 "tt.dlqBtn": "Просмотр изолированных задач (Dead Letter Queue) и управление прерывателями цепи",
 "tt.circuitOpen": "Прерыватель цепи РАЗОМКНУТ (OPEN): Задача изолирована из-за частых сбоев",
 "tt.circuitHalfOpen": "Прерыватель цепи HALF-OPEN: Выполняется пробный запуск (Canary)",
 "circuit.open": "В карантине",
 "circuit.halfOpen": "Пробный тест",
 "circuit.resetBtn": "Сбросить прерыватель",
 "dlq.modalTitle": "Очередь недоставленных задач (DLQ) и Карантин",
 "dlq.subtitle": "Задачи, остановленные из-за повторных сбоев. Запустите пробный тест или снимите карантин.",
 "dlq.empty": "В карантине нет задач. Все cron-задачи работают в штатном режиме!",
 "dlq.retryBtn": "Повторить (Canary)",
 "dlq.resolveBtn": "Решить и возобновить",
 "dlq.deleteBtn": "Удалить запись",
 "dlq.clearAllBtn": "Очистить DLQ",
 "toast.dlqRetried": "Пробный тест успешно завершен! Задача возвращена к обычному расписанию.",
 "toast.dlqResolved": "Задача удалена из карантина, прерыватель цепи сброшен.",
 "toast.dlqCleared": "Очередь DLQ успешно очищена.",
 "toast.dlqDeleted": "Запись DLQ удалена.",
 "runs.pageTitle": "История и Итоги Запусков Cron (Runs)",
 "runs.pageSubtitle": "Наглядный контроль успешных и завершившихся с ошибкой запусков cron",
 "runs.autoRefresh": "Автообновление (5с)",
 "runs.refreshNow": "Обновить Сейчас",
 "runs.kpiTotal": "Всего Запусков",
 "runs.kpiTotalSub": "записей в истории",
 "runs.kpiClickAll": "Нажмите, чтобы показать все",
 "runs.kpiSuccess": "Успешные Запуски",
 "runs.kpiSuccessSub": "выполнены без ошибок",
 "runs.kpiFailed": "Ошибки / Сбои",
 "runs.kpiFailedSub": "обнаружено сбоев",
 "runs.kpiFilterFailed": "Показать только ошибки",
 "runs.kpiLastRun": "Последний Запуск",
 "runs.kpiAvgDuration": "Среднее время ответа:",
 "runs.timelineTitle": "Хронологическая Шкала Последних Запусков",
 "runs.timelineSub": "Каждый столбец: отдельный запуск (слева старые, справа новые). Нажмите для перехода к деталям.",
 "runs.legendSuccess": " Успешно",
 "runs.legendFailed": " Ошибка",
 "runs.byJobTitle": "Статистика по Каждой Cron-задаче",
 "runs.byJobSub": "Нажмите на карточку, чтобы отфильтровать список по этой задаче",
 "runs.showAllJobs": "Показать все задачи",
 "runs.filterAll": "Все",
 "runs.filterSuccess": "Только Успешные",
 "runs.filterFailed": "Только Ошибки",
 "runs.allJobsOption": "Все Cron-задачи",
 "runs.searchPlaceholder": "Поиск по названию задачи, тексту ответа, ошибке или ID сессии...",
 "runs.listHeading": "Список Последних Запусков",
 "runs.statusSuccess": " УСПЕШНЫЙ ЗАПУСК",
 "runs.statusFailed": " ОШИБКА ВЫПОЛНЕНИЯ",
 "runs.statusSkipped": "⏭ ПРОПУЩЕНО",
 "runs.openInChat": "Открыть в Чате",
 "runs.outputLabel": "Ответ Cron-задачи:",
 "runs.errorLabel": "Подробности Ошибки / Сбоя:",
 "runs.expandMore": "Развернуть полностью ▼",
 "runs.expandLess": "Свернуть ▲",
 "onboard.title": "Добро пожаловать в OpenCode Cron - Быстрый Старт",
 "onboard.subtitle": "Автоматизируйте регулярные задачи, мониторинг и проверки прямо в сессиях OpenCode.",
 "onboard.step1Title": "1. Запланируйте Задачу",
 "onboard.step1Desc": "Выберите основную сессию, задайте интервал (напр. 5m) и укажите System + Followup Prompt.",
 "onboard.step2Title": "2. Автономный Демон (60с)",
 "onboard.step2Desc": "Системный демон launchd выполняет задачи в фоне даже при закрытом браузере.",
 "onboard.step3Title": "3. Контролируйте Итоги и Чат",
 "onboard.step3Desc": "Следите за ответами в Живом Чате или откройте страницу Итоги Запусков (/runs).",
 "onboard.dismiss": "Скрыть подсказки",
 "guide.title": "Руководство и Инструкции OpenCode Cron",
 "guide.subtitle": "Интерактивный справочник, архитектура и решение проблем",
 "guide.shortcutHint": "Нажмите ? в любой момент для открытия инструкции",
 "guide.closeBtn": "Понятно",
 "guide.sec1Title": " 1. Как Работает OpenCode Cron",
 "guide.sec1Body": "Демон launchd каждые 60 секунд проверяет jobs.json, запускает ход в выбранной сессии, обновляет Markdown-память и синхронизирует SQLite.",
 "guide.sec2Title": " 2. Создание и Настройка Задачи",
 "guide.sec2Body": "Используйте интервалы (1m, 5m, 1h) или Cron-выражения из 5 полей. System Prompt задает неизменные правила, а Followup Prompt: задачу каждого тика.",
 "guide.sec3Title": " 3. Постоянная Память (seenHashes)",
 "guide.sec3Body": "Файл памяти сохраняет ключевые факты и хеши просмотренных ссылок, предотвращая дублирование.",
 "guide.sec4Title": " 4. Страница «Итоги Запусков» (/runs)",
 "guide.sec4Body": "Позволяет мгновенно увидеть успешные ( зеленые) и неудачные ( красные) запуски, время ответа и перейти в чат.",
 "guide.sec5Title": " 5. Защита и Устранение Неполадок",
 "guide.sec5Body": "После 5 ошибок подряд задача ставится на паузу. Если достигнут лимит Max Runs (ЗАВЕРШЕНА), увеличьте лимит или укажите 0."
 }
 };

 let currentLang = localStorage.getItem('oc_cron_lang') || 'it';
 if (!OC_I18N[currentLang]) currentLang = 'it';

 function t(key, fallback) {
 const dict = OC_I18N[currentLang] || OC_I18N.it;
 return dict[key] || OC_I18N.it[key] || OC_I18N.en[key] || fallback || key;
 }

 function setLanguage(langCode) {
 if (!OC_I18N[langCode]) return;
 currentLang = langCode;
 localStorage.setItem('oc_cron_lang', langCode);
 const langMeta = OC_SUPPORTED_LANGS.find(l => l.code === langCode);
 document.documentElement.setAttribute('lang', langCode);
 document.documentElement.setAttribute('dir', langMeta && langMeta.rtl ? 'rtl' : 'ltr');

 document.querySelectorAll('select[id^="oc-lang-select"]').forEach((el) => {
 const s = /** @type {HTMLSelectElement} */ (el);
 if (s.value !== langCode) s.value = langCode;
 });

 applyStaticTranslations();
 renderGuideDrawerContent();

 // Re-render dynamic views if present on current page
 if (typeof renderJobs === 'function' && typeof currentJobs !== 'undefined') {
 try { renderJobs(currentJobs); } catch {}
 }
 if (typeof renderKpis === 'function') {
 try { renderKpis(); } catch {}
 }
 if (typeof renderTimelineStrip === 'function') {
 try { renderTimelineStrip(); } catch {}
 }
 if (typeof renderByJobCards === 'function') {
 try { renderByJobCards(); } catch {}
 }
 if (typeof populateJobDropdown === 'function') {
 try { populateJobDropdown(); } catch {}
 }
 if (typeof renderRunsList === 'function') {
 try { renderRunsList(); } catch {}
 }
 if (typeof renderInstructionsPage === 'function') {
 try { renderInstructionsPage(); } catch {}
 }
 }

 function applyStaticTranslations() {
 document.querySelectorAll('[data-i18n]').forEach((el) => {
 const key = el.getAttribute('data-i18n');
 if (key) el.textContent = t(key, el.textContent);
 });
 document.querySelectorAll('[data-i18n-html]').forEach((el) => {
 const key = el.getAttribute('data-i18n-html');
 if (key) el.innerHTML = t(key, el.innerHTML);
 });
 document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
 const key = el.getAttribute('data-i18n-placeholder');
 if (key) el.setAttribute('placeholder', t(key, el.getAttribute('placeholder')));
 });
 document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
 const key = el.getAttribute('data-i18n-aria');
 if (key) el.setAttribute('aria-label', t(key, el.getAttribute('aria-label')));
 });
 }

 function renderGuideDrawerContent() {
 const body = document.getElementById('oc-guide-body');
 if (!body) return;
 const sections = [
 { title: t('guide.sec1Title'), body: t('guide.sec1Body') },
 { title: t('guide.sec2Title'), body: t('guide.sec2Body') },
 { title: t('guide.sec3Title'), body: t('guide.sec3Body') },
 { title: t('guide.sec4Title'), body: t('guide.sec4Body') },
 { title: t('guide.sec5Title'), body: t('guide.sec5Body') }
 ];
 body.innerHTML = sections.map(s => \`
 <section class="space-y-1.5">
 <h3 class="text-base font-bold text-slate-900">\${s.title}</h3>
 <p class="text-slate-700 whitespace-pre-line leading-relaxed">\${s.body}</p>
 </section>
 \`).join('');
 }

 function openGuideDrawer() {
 const drawer = document.getElementById('oc-guide-drawer');
 const backdrop = document.getElementById('oc-guide-backdrop');
 if (!drawer || !backdrop) return;
 renderGuideDrawerContent();
 backdrop.classList.remove('hidden');
 drawer.classList.remove('translate-x-full', 'rtl:-translate-x-full');
 drawer.removeAttribute('aria-hidden');
 setTimeout(() => drawer.focus(), 50);
 }

 function closeGuideDrawer() {
 const drawer = document.getElementById('oc-guide-drawer');
 const backdrop = document.getElementById('oc-guide-backdrop');
 if (!drawer || !backdrop) return;
 drawer.classList.add('translate-x-full', 'rtl:-translate-x-full');
 drawer.setAttribute('aria-hidden', 'true');
 backdrop.classList.add('hidden');
 }

 function dismissOnboardingBanner() {
 localStorage.setItem('oc_cron_onboard_dismissed', '1');
 const banner = document.getElementById('oc-onboarding-banner');
 if (banner) banner.classList.add('hidden');
 }

 function initOnboardingBanner() {
 const banner = document.getElementById('oc-onboarding-banner');
 if (!banner) return;
 if (localStorage.getItem('oc_cron_onboard_dismissed') === '1') {
 banner.classList.add('hidden');
 } else {
 banner.classList.remove('hidden');
 }
 }

 // Universal Accessible Tooltip Engine
 function initAccessibleTooltips() {
 const tooltipEl = document.getElementById('oc-tooltip');
 if (!tooltipEl) return;
 let activeTarget = null;

 function showTooltipFor(target) {
 if (!target) return;
 const key = target.getAttribute('data-tooltip');
 const raw = target.getAttribute('data-tooltip-raw');
 const text = key ? t(key, raw || '') : raw;
 if (!text) return;

 activeTarget = target;
 tooltipEl.textContent = text;
 tooltipEl.setAttribute('aria-hidden', 'false');
 tooltipEl.setAttribute('data-visible', 'true');
 target.setAttribute('aria-describedby', 'oc-tooltip');

 const rect = target.getBoundingClientRect();
 const ttRect = tooltipEl.getBoundingClientRect();
 let top = rect.bottom + 8;
 if (top + ttRect.height > window.innerHeight - 12) {
 top = Math.max(12, rect.top - ttRect.height - 8);
 }
 let left = rect.left + (rect.width / 2) - (ttRect.width / 2);
 left = Math.max(12, Math.min(left, window.innerWidth - ttRect.width - 12));

 tooltipEl.style.top = Math.round(top) + 'px';
 tooltipEl.style.left = Math.round(left) + 'px';
 }

 function hideTooltip() {
 if (activeTarget) {
 activeTarget.removeAttribute('aria-describedby');
 activeTarget = null;
 }
 tooltipEl.setAttribute('data-visible', 'false');
 tooltipEl.setAttribute('aria-hidden', 'true');
 }

 document.addEventListener('mouseover', (e) => {
 const el = e.target && e.target.closest ? e.target.closest('[data-tooltip], [data-tooltip-raw]') : null;
 if (el) showTooltipFor(el);
 else if (activeTarget) hideTooltip();
 });

 document.addEventListener('focusin', (e) => {
 const el = e.target && e.target.closest ? e.target.closest('[data-tooltip], [data-tooltip-raw]') : null;
 if (el) showTooltipFor(el);
 });

 document.addEventListener('focusout', () => hideTooltip());
 window.addEventListener('scroll', () => { if (activeTarget) hideTooltip(); }, true);

 document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape') {
 hideTooltip();
 closeGuideDrawer();
 } else if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement && document.activeElement.tagName) || '')) {
 e.preventDefault();
 if (typeof closeToolsMenu === 'function') closeToolsMenu();
 openGuideDrawer();
 }
 });
 }

 // ============================================================================
 // INTERACTIVE SPOTLIGHT GUIDED DEMO TOUR ENGINE (CREAZIONE CRONJOB STEP-BY-STEP)
 // ============================================================================
 const TOUR_I18N = {
 it: {
 badge: "GUIDA CREAZIONE CRONJOB",
 stepOf: "Passo {cur} di {tot}",
 btnNext: "Avanti",
 btnPrev: "Indietro",
 btnSkip: "Salta",
 btnFinish: "Ho Capito! Inizia Ora",
 btnFillDemo: " Compila Dati Esempio",
 filledToast: "Dati Esempio Inseriti!",
 finishToast: " Perfetto! Ora sai come creare le tue automazioni.",
 steps: [
 {
 title: "1. Avvia la Creazione del Cronjob",
 desc: "Clicca su '+ Nuovo Job' qui in alto (oppure su ' Imposta Cron' all'interno di una sessione in Live Chat) per aprire il costruttore guidato."
 },
 {
 title: "2. Dai un Titolo al tuo Job",
 desc: "Inserisci un nome descrittivo per identificare l'attività automatica (es. 'Monitor Novità AI' o 'Guardiano Repo'). Clicca su 'Compila Dati Esempio' per vedere un caso reale!"
 },
 {
 title: "3. Scegli la Frequenza (Intervallo o Cron)",
 desc: "Usa i preset veloci (' 5m', '⏰ 1h') oppure scrivi un'espressione cron a 5 campi. Il Visual Builder mostrerà la spiegazione in linguaggio naturale e le prossime 3 esecuzioni previste!"
 },
 {
 title: "4. Collega la Sessione OpenCode",
 desc: "Seleziona la conversazione di chat a cui legare l'automazione. L'agente lavorerà dentro quella specifica chat mantenendo tutta la cronologia e i file aperti."
 },
 {
 title: "5. Istruisci l'Agente con i Prompt",
 desc: "Il Prompt di Sistema fissa l'obiettivo immutabile. Il Followup Prompt è l'azione che l'agente compie ad ogni tick. La memoria Markdown salverà lo stato e preverrà duplicati con seenHashes."
 },
 {
 title: "6. Durata & Attivazione",
 desc: "Imposta Max Runs: lascia 0 per farlo durare all'infinito, oppure specifica un numero per arrestarsi da solo. Clicca su 'Salva Job' per attivare l'automazione in background!"
 },
 {
 title: "7. Traccia gli Esiti su 'Timeline Runs'",
 desc: "Tutte le esecuzioni, durate ed eventuali errori sono tracciati in tempo reale nella pagina 'Timeline Runs': verifichi a colpo d'occhio successi (verdi) ed errori (rossi) con i log completi!"
 }
 ]
 },
 en: {
 badge: "CRONJOB CREATION GUIDE",
 stepOf: "Step {cur} of {tot}",
 btnNext: "Next",
 btnPrev: "Previous",
 btnSkip: "Skip",
 btnFinish: "Got It! Start Now",
 btnFillDemo: " Fill Sample Data",
 filledToast: "Sample Data Inserted!",
 finishToast: " Great! You are ready to automate with OpenCode Cron.",
 steps: [
 {
 title: "1. Start Cron Job Creation",
 desc: "Click '+ New Job' in the top bar (or ' Set Cron' inside any chat session in Live Chat) to launch the guided builder."
 },
 {
 title: "2. Name Your Cron Job",
 desc: "Enter a clear title to identify your automated background task (e.g. 'AI News Monitor' or 'Repo Guardian'). Click 'Fill Sample Data' to test quickly!"
 },
 {
 title: "3. Choose Schedule (Interval or Cron)",
 desc: "Use quick presets (' 5m', '⏰ 1h') or standard 5-field cron. The Visual Builder shows instant human explanations and the next 3 scheduled run timestamps!"
 },
 {
 title: "4. Link OpenCode Chat Session",
 desc: "Select the chat conversation to attach. Unlike isolated shell cron, opencode-cron prompts the exact session selected, keeping conversational context intact."
 },
 {
 title: "5. Instruct the AI Agent via Prompts",
 desc: "System Prompt locks the objective. Followup Prompt specifies the task for each tick. Persistent memory preserves facts and dedupes via seenHashes."
 },
 {
 title: "6. Duration & Launch",
 desc: "Set Max Runs: leave 0 to run indefinitely, or enter a number to auto-complete. Click 'Save Job' to register and activate background automation!"
 },
 {
 title: "7. Track Telemetry on 'Timeline Runs'",
 desc: "Every background tick is logged in real time: inspect successes (green), failures (red), run latency, and full execution traces on the Runs page!"
 }
 ]
 },
 es: {
 badge: "GUÍA CREACIÓN CRONJOB",
 stepOf: "Paso {cur} de {tot}",
 btnNext: "Siguiente",
 btnPrev: "Anterior",
 btnSkip: "Saltar",
 btnFinish: "¡Entendido! Empezar",
 btnFillDemo: " Rellenar Datos Ejemplo",
 filledToast: "¡Datos de ejemplo insertados!",
 finishToast: " ¡Genial! Ya puedes crear tus tareas automatizadas.",
 steps: [
 {
 title: "1. Iniciar Creación de Cron Job",
 desc: "Haz clic en '+ Nuevo Job' arriba (o en ' Imposta Cron' en una sesión de Live Chat) para abrir el configurador."
 },
 {
 title: "2. Asigna un Título al Job",
 desc: "Introduce un título descriptivo para la tarea (ej. 'Monitor Noticias IA'). ¡Usa 'Rellenar Datos Ejemplo' para probar!"
 },
 {
 title: "3. Elige la Frecuencia (Intervalo o Cron)",
 desc: "Usa presets rápidos (' 5m', '⏰ 1h') o cron de 5 campos. ¡El Visual Builder traduce el horario y muestra las 3 próximas ejecuciones!"
 },
 {
 title: "4. Conectar Sesión de OpenCode",
 desc: "Selecciona la conversación de chat. A diferencia del cron tradicional, opencode-cron actúa en la misma sesión manteniendo todo el contexto."
 },
 {
 title: "5. Instruye al Agente con Prompts",
 desc: "El System Prompt fija el objetivo. El Followup Prompt es la acción recurrente. La memoria evita duplicados con seenHashes."
 },
 {
 title: "6. Duración y Activación",
 desc: "Deja Max Runs en 0 para infinito, o define un límite numérico. ¡Haz clic en 'Guardar' para activar la automatización!"
 },
 {
 title: "7. Monitorea los Resultados en 'Timeline Runs'",
 desc: "Cada tick se registra en tiempo real: revisa éxitos (verde), errores (rojo), latencias y logs completos."
 }
 ]
 },
 fr: {
 badge: "GUIDE CRÉATION CRONJOB",
 stepOf: "Étape {cur} sur {tot}",
 btnNext: "Suivant",
 btnPrev: "Précédent",
 btnSkip: "Passer",
 btnFinish: "Compris ! Démarrer",
 btnFillDemo: " Remplir Exemple",
 filledToast: "Données d'exemple insérées !",
 finishToast: " Parfait ! Vous êtes prêt à automatiser avec OpenCode Cron.",
 steps: [
 {
 title: "1. Démarrer la Création du Job",
 desc: "Cliquez sur '+ Nouveau Job' en haut (ou ' Configurer Cron' dans un chat) pour ouvrir l'assistant."
 },
 {
 title: "2. Nommez votre Job",
 desc: "Indiquez un titre clair pour identifier la tâche (ex. 'Veille Actualités IA')."
 },
 {
 title: "3. Choisissez la Fréquence",
 desc: "Utilisez les raccourcis (' 5m', '⏰ 1h') ou du cron standard. Le générateur visuel affiche les 3 prochaines exécutions !"
 },
 {
 title: "4. Associer la Session OpenCode",
 desc: "Sélectionnez le chat cible : opencode-cron réinjecte ses ticks dans cette session avec tout son historique."
 },
 {
 title: "5. Définissez les Prompts de l'Agent",
 desc: "Le System Prompt fige l'objectif. Le Followup Prompt définit l'action récurrente. La mémoire déduplique via seenHashes."
 },
 {
 title: "6. Durée et Activation",
 desc: "Laissez Max Runs à 0 pour l'infini ou fixez une limite. Cliquez sur 'Sauvegarder' pour activer le job en arrière-plan !"
 },
 {
 title: "7. Suivez les Résultats dans 'Runs'",
 desc: "Chaque exécution est enregistrée en direct : succès (vert), erreurs (rouge), temps de réponse et logs complets !"
 }
 ]
 },
 de: {
 badge: "CRONJOB ERSTELLUNGSGUIDE",
 stepOf: "Schritt {cur} von {tot}",
 btnNext: "Weiter",
 btnPrev: "Zurück",
 btnSkip: "Überspringen",
 btnFinish: "Verstanden! Starten",
 btnFillDemo: " Beispieldaten Ausfüllen",
 filledToast: "Beispieldaten eingefügt!",
 finishToast: " Perfekt! Sie sind bereit für automatisierte Aufgaben.",
 steps: [
 {
 title: "1. Cronjob-Erstellung Starten",
 desc: "Klicken Sie oben auf '+ Neuer Job' (oder ' Cron Einrichten' in einem Chat), um den Assistenten zu öffnen."
 },
 {
 title: "2. Job-Titel Festlegen",
 desc: "Geben Sie einen klaren Titel ein (z. B. 'KI-News Monitor' oder 'Repo Guardian')."
 },
 {
 title: "3. Intervall oder Cron Wählen",
 desc: "Wählen Sie Schnell-Presets (' 5m', '⏰ 1h') oder 5-Feld-Cron. Der Visual Builder zeigt die nächsten 3 Ausführungen an!"
 },
 {
 title: "4. OpenCode-Chatsitzung Verknüpfen",
 desc: "Wählen Sie die Sitzung aus: opencode-cron führt Ticks in dieser Sitzung mit vollem Kontextverlauf aus."
 },
 {
 title: "5. Agenten-Prompts Definieren",
 desc: "Der System-Prompt legt das Ziel fest. Der Followup-Prompt bestimmt die Aktion pro Tick. Der Speicher dedupliziert via seenHashes."
 },
 {
 title: "6. Laufzeit & Aktivierung",
 desc: "Setzen Sie Max Runs auf 0 (unbegrenzt) oder ein Limit. Klicken Sie auf 'Job Speichern' zur Aktivierung!"
 },
 {
 title: "7. Ausführungen auf 'Timeline Runs' Verfolgen",
 desc: "Jeder Tick wird live protokolliert: Erfolge (grün), Fehler (rot), Ausführungszeiten und Traces auf einen Blick!"
 }
 ]
 },
 pt: {
 badge: "GUIA CRIAÇÃO CRONJOB",
 stepOf: "Passo {cur} de {tot}",
 btnNext: "Avançar",
 btnPrev: "Voltar",
 btnSkip: "Pular",
 btnFinish: "Entendi! Começar",
 btnFillDemo: " Preencher Exemplo",
 filledToast: "Dados de exemplo inseridos!",
 finishToast: " Pronto! Você já sabe como criar automações.",
 steps: [
 {
 title: "1. Iniciar Criação do Cron Job",
 desc: "Clique em '+ Novo Job' no topo (ou ' Configurar Cron' no chat) para abrir o configurador."
 },
 {
 title: "2. Dê um Título ao Job",
 desc: "Insira um título descritivo para identificar a tarefa (ex. 'Monitor Notícias IA')."
 },
 {
 title: "3. Escolha a Frequência (Intervalo ou Cron)",
 desc: "Use atalhos rápidos (' 5m', '⏰ 1h') ou cron padrão. O Visual Builder mostra as próximas 3 execuções em tempo real!"
 },
 {
 title: "4. Conectar Sessão do OpenCode",
 desc: "Selecione a conversa: o opencode-cron atua na sessão escolhida preservando todo o histórico."
 },
 {
 title: "5. Instrua o Agente com Prompts",
 desc: "O System Prompt define o objetivo. O Followup Prompt é a ação do tick. A memória evita duplicatas com seenHashes."
 },
 {
 title: "6. Duração e Ativação",
 desc: "Deixe Max Runs em 0 para infinito ou defina um limite. Clique em 'Salvar' para ativar a automação em segundo plano!"
 },
 {
 title: "7. Acompanhe os Resultados em 'Timeline Runs'",
 desc: "Cada tick é registrado em tempo real: sucessos (verde), falhas (vermelho), tempo de resposta e logs detalhados!"
 }
 ]
 },
 zh: {
 badge: "CRON 任务创建指南",
 stepOf: "第 {cur} 步，共 {tot} 步",
 btnNext: "下一步",
 btnPrev: "上一步",
 btnSkip: "跳过",
 btnFinish: "明白了！立即开始",
 btnFillDemo: " 填入示例数据",
 filledToast: "示例数据已填入！",
 finishToast: " 太棒了！您已准备好使用 OpenCode Cron 进行自动化。",
 steps: [
 {
 title: "1. 开始创建 Cron 任务",
 desc: "点击顶部的“+ 新建任务”（或在实时会话中点击“ 设置 Cron”）打开向导。"
 },
 {
 title: "2. 为任务命名",
 desc: "输入一个清晰的标题来标识后台任务（例如“AI 新闻监控”或“代码库守卫”）。"
 },
 {
 title: "3. 选择周期（简单间隔或 Cron）",
 desc: "使用快捷按钮（“ 5m”，“⏰ 1h”）或标准 5 字段 Cron。可视化构建器实时显示自然语言解释和未来 3 次执行时间！"
 },
 {
 title: "4. 绑定 OpenCode 会话",
 desc: "选择目标对话会话：每次运行都会继承完整的对话历史和上下文。"
 },
 {
 title: "5. 设置提示词指导 AI 智能体",
 desc: "系统提示词固定目标，后续提示词是每次执行的动作。持久化内存通过 seenHashes 自动去重。"
 },
 {
 title: "6. 运行次数与保存激活",
 desc: "Max Runs 设为 0 表示无限循环，或设定次数自动停止。点击“保存任务”即刻在后台激活自动化！"
 },
 {
 title: "7. 在“运行记录”中追踪执行结果",
 desc: "后台执行实时记录：绿色成功、红色失败、耗时毫秒数与完整日志一目了然！"
 }
 ]
 },
 ja: {
 badge: "CRONジョブ作成ガイド",
 stepOf: "ステップ {cur} / {tot}",
 btnNext: "次へ",
 btnPrev: "前へ",
 btnSkip: "スキップ",
 btnFinish: "理解しました！今すぐ開始",
 btnFillDemo: " サンプルデータを入力",
 filledToast: "サンプルデータを入力しました！",
 finishToast: " 準備完了！OpenCode Cronで自動化を開始できます。",
 steps: [
 {
 title: "1. Cronジョブ作成を開始",
 desc: "上部の「+ 新規ジョブ」（またはチャット内の「 Cron設定」）をクリックしてビルダーを開きます。"
 },
 {
 title: "2. ジョブに名前を付ける",
 desc: "自動化タスクを識別する名前を入力します（例：「AIニュース監視」や「リポジトリ監視」）。"
 },
 {
 title: "3. スケジュールを選択（間隔またはCron）",
 desc: "クイックプリセット（「 5m」「⏰ 1h」）または5フィールドCronを使用。次回の実行時刻3件が即座にプレビューされます！"
 },
 {
 title: "4. OpenCodeチャットセッションを紐付け",
 desc: "対象セッションを選択：会話の文脈と履歴がすべて引き継がれます。"
 },
 {
 title: "5. プロンプトでエージェントに指示",
 desc: "システムプロンプトで目的を固定し、フォローアップで各実行のアクションを指定。seenHashesで重複を防ぎます。"
 },
 {
 title: "6. 実行回数と有効化",
 desc: "Max Runsを0（無期限）または指定回数に設定。「ジョブを保存」をクリックしてバックグラウンドで開始します！"
 },
 {
 title: "7. 「Runs（実行履歴）」で結果を追跡",
 desc: "バックグラウンドの実行がリアルタイムで記録されます：成功（緑）、エラー（赤）、所要時間、ログを一覧確認！"
 }
 ]
 },
 ar: {
 badge: "دليل إنشاء مهمة CRON",
 stepOf: "خطوة {cur} من {tot}",
 btnNext: "التالي",
 btnPrev: "السابق",
 btnSkip: "تخطي",
 btnFinish: "فهمت! ابدأ الآن",
 btnFillDemo: " ملء بيانات تجريبية",
 filledToast: "تم إدراج بيانات تجريبية بنجاح!",
 finishToast: " رائع! أنت جاهز الآن للتشغيل التلقائي عبر OpenCode Cron.",
 steps: [
 {
 title: "1. بدء إنشاء مهمة Cron",
 desc: "انقر على '+ مهمة جديدة' في الأعلى (أو ' ضبط Cron' داخل أي محادثة) لفتح المعالج."
 },
 {
 title: "2. تسمية المهمة",
 desc: "أدخل عنواناً واضحاً لوصف المهمة التلقائية (مثل 'مراقب أخبار الذكاء الاصطناعي')."
 },
 {
 title: "3. اختيار جدول التشغيل (فترة زمنية أو Cron)",
 desc: "استخدم الإعدادات السريعة (' 5m'، '⏰ 1h') أو تعبير cron. يعرض منشئ الجداول معاينة لمرات التشغيل القادمة!"
 },
 {
 title: "4. ربط جلسة محادثة OpenCode",
 desc: "اختر جلسة المحادثة: يعمل opencode-cron داخلها محتفظاً بكامل السياق والتاريخ."
 },
 {
 title: "5. توجيه العميل الذكي بالتعليمات",
 desc: "الهدف الثابت يُحدد عبر System Prompt، بينما يحدد Followup Prompt مهمة كل تشغيل مع منع التكرار عبر seenHashes."
 },
 {
 title: "6. المدة والتفعيل",
 desc: "اجعل Max Runs صفراً للتشغيل الدائم أو حدد رقماً. انقر على 'حفظ المهمة' لتفعيل التشغيل في الخلفية!"
 },
 {
 title: "7. متابعة النتائج في 'جدول التشغيل Runs'",
 desc: "يتم تسجيل كل تشغيل تلقائي في الوقت الفعلي: النجاحات (أخضر)، والأخطاء (أحمر)، وسرعة الاستجابة والسجلات!"
 }
 ]
 },
 ru: {
 badge: "РУКОВОДСТВО ПО CRON",
 stepOf: "Шаг {cur} из {tot}",
 btnNext: "Далее",
 btnPrev: "Назад",
 btnSkip: "Пропустить",
 btnFinish: "Понятно! Начать",
 btnFillDemo: " Заполнить Пример",
 filledToast: "Пример данных успешно вставлен!",
 finishToast: " Отлично! Теперь вы готовы запускать фоновые задачи.",
 steps: [
 {
 title: "1. Начать Создание Cron-задачи",
 desc: "Нажмите «+ Новая Задача» вверху (или « Настроить Cron» в живом чате) для открытия конструктора."
 },
 {
 title: "2. Задайте Название Задачи",
 desc: "Введите понятное название задачи (напр., «Мониторинг AI новостей» или «Страж Репозитория»)."
 },
 {
 title: "3. Выберите Расписание (Интервал или Cron)",
 desc: "Используйте быстрые кнопки (' 5m', '⏰ 1h') или 5 полей cron. Конструктор сразу покажет 3 следующих запуска!"
 },
 {
 title: "4. Привяжите Сессию OpenCode",
 desc: "Выберите сессию диалога: в отличие от обычного cron, opencode-cron работает прямо в ней, сохраняя контекст."
 },
 {
 title: "5. Задайте Промпты для Агента",
 desc: "System Prompt задает цель. Followup Prompt: действие каждого тика. Память сохраняет факты и дедуплицирует через seenHashes."
 },
 {
 title: "6. Лимит Запусков и Активация",
 desc: "Оставьте Max Runs равным 0 для бесконечного режима или укажите число. Нажмите «Сохранить» для активации!"
 },
 {
 title: "7. Отслеживайте Итоги на 'Timeline Runs'",
 desc: "Каждый фоновый тик логируется в реальном времени: успехи (зеленый), сбои (красный), задержка и полные логи!"
 }
 ]
 }
 };

 const SPOTLIGHT_STEPS = [
 { selector: "#btn-header-new-job", showHelper: false, modalState: "close" },
 { selector: "#form-title", showHelper: true, modalState: "open" },
 { selector: "#modal-presets-container", showHelper: true, modalState: "open" },
 { selector: "#form-session-id", showHelper: false, modalState: "open" },
 { selector: "#form-followup-prompt", showHelper: true, modalState: "open" },
 { selector: "#modal-submit-btn", showHelper: true, modalState: "open" },
 { selector: "#nav-link-runs", showHelper: false, modalState: "close" }
 ];

 let currentSpotlightStep = 0;
 let isSpotlightActive = false;
 let currentHighlightEl = null;
 let spotlightStepTimeout = null;

 function getTourDict() {
 return TOUR_I18N[currentLang] || TOUR_I18N.it;
 }

 function positionCardAndRing(targetEl) {
 if (!isSpotlightActive) return;
 const ring = document.getElementById('oc-spotlight-ring');
 const card = document.getElementById('oc-spotlight-card');
 if (!targetEl || !ring || !card) return;

 const rect = targetEl.getBoundingClientRect();
 const pad = 8;

 ring.style.top = Math.max(0, rect.top - pad) + 'px';
 ring.style.left = Math.max(0, rect.left - pad) + 'px';
 ring.style.width = (rect.width + pad * 2) + 'px';
 ring.style.height = (rect.height + pad * 2) + 'px';
 ring.style.display = 'block';

 card.style.display = 'flex';
 const cardRect = card.getBoundingClientRect();
 const margin = 14;
 const vw = window.innerWidth;
 const vh = window.innerHeight;

 let top = 0;
 let left = 0;

 if (rect.bottom + cardRect.height + margin <= vh) {
 top = rect.bottom + margin;
 left = Math.max(margin, Math.min(rect.left + (rect.width / 2) - (cardRect.width / 2), vw - cardRect.width - margin));
 } else if (rect.top - cardRect.height - margin >= 0) {
 top = rect.top - cardRect.height - margin;
 left = Math.max(margin, Math.min(rect.left + (rect.width / 2) - (cardRect.width / 2), vw - cardRect.width - margin));
 } else if (rect.right + cardRect.width + margin <= vw) {
 top = Math.max(margin, Math.min(rect.top, vh - cardRect.height - margin));
 left = rect.right + margin;
 } else if (rect.left - cardRect.width - margin >= 0) {
 top = Math.max(margin, Math.min(rect.top, vh - cardRect.height - margin));
 left = rect.left - cardRect.width - margin;
 } else {
 top = Math.max(margin, (vh - cardRect.height) / 2);
 left = Math.max(margin, (vw - cardRect.width) / 2);
 }

 card.style.top = Math.round(top) + 'px';
 card.style.left = Math.round(left) + 'px';
 }

 function repositionCurrentStep() {
 if (!isSpotlightActive) return;
 const stepDef = SPOTLIGHT_STEPS[currentSpotlightStep];
 if (!stepDef) return;
 const targetEl = document.querySelector(stepDef.selector);
 if (targetEl) positionCardAndRing(targetEl);
 }

 function demoFillStepData() {
 const title = document.getElementById('form-title');
 const sched = document.getElementById('form-schedule');
 const sys = document.getElementById('form-system-prompt');
 const fup = document.getElementById('form-followup-prompt');
 const maxr = document.getElementById('form-max-runs');
 const dict = getTourDict();

 const isEn = (currentLang === 'en');
 if (title && !title.value) title.value = isEn ? "AI News Watchdog (5m)" : "Monitor Novità AI (5m)";
 if (sched) {
 sched.value = "5m";
 if (typeof debounceSchedulePreview === 'function') debounceSchedulePreview('5m');
 }
 if (sys && !sys.value) {
 sys.value = isEn
 ? "You are an autonomous monitoring agent. Objective: scan recent updates and maintain persistent memory."
 : "Sei un assistente di monitoraggio autonomo. Obiettivo: scansiona novità e aggiorna la memoria.";
 }
 if (fup && !fup.value) {
 fup.value = isEn
 ? "Check recent AI news, verify seenHashes to avoid duplicates, and save new facts via cron_memory_save."
 : "Cerca aggiornamenti recenti, verifica seenHashes per evitare duplicati e salva i nuovi fatti con cron_memory_save.";
 }
 if (maxr) maxr.value = "0";

 const btn = document.getElementById('oc-spotlight-demo-fill-btn');
 if (btn) {
 btn.innerHTML = '<i class="fa-solid fa-check text-emerald-700"></i> ' + dict.filledToast;
 setTimeout(() => {
 btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles text-amber-600 text-xs"></i> <span id="oc-spotlight-demo-fill-label">' + dict.btnFillDemo + '</span>';
 }, 1500);
 }
 }

 function renderSpotlightStep(index) {
 if (!isSpotlightActive) return;
 if (index < 0 || index >= SPOTLIGHT_STEPS.length) return;
 currentSpotlightStep = index;
 const stepDef = SPOTLIGHT_STEPS[index];
 const dict = getTourDict();
 const stepText = dict.steps[index] || dict.steps[0];

 // Handle Modal visibility according to step
 if (stepDef.modalState === "open") {
 const modal = document.getElementById('job-modal');
 if (modal && modal.classList.contains('hidden')) {
 if (typeof openNewJobModal === 'function') openNewJobModal();
 }
 } else if (stepDef.modalState === "close") {
 const modal = document.getElementById('job-modal');
 if (modal && !modal.classList.contains('hidden')) {
 if (typeof closeModal === 'function') closeModal();
 }
 }

 if (spotlightStepTimeout) clearTimeout(spotlightStepTimeout);
 spotlightStepTimeout = setTimeout(() => {
 if (!isSpotlightActive) return;
 const targetEl = document.querySelector(stepDef.selector);
 if (currentHighlightEl) {
 currentHighlightEl.classList.remove('oc-tour-highlight-el');
 }

 if (targetEl) {
 currentHighlightEl = targetEl;
 targetEl.classList.add('oc-tour-highlight-el');
 targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
 positionCardAndRing(targetEl);
 }

 // Update Card UI
 const badgeEl = document.getElementById('oc-spotlight-badge');
 const stepIndEl = document.getElementById('oc-spotlight-step-text');
 const titleEl = document.getElementById('oc-spotlight-title');
 const descEl = document.getElementById('oc-spotlight-desc');
 const helperContainer = document.getElementById('oc-spotlight-helper-container');
 const fillLabel = document.getElementById('oc-spotlight-demo-fill-label');
 const prevBtn = document.getElementById('oc-spotlight-prev-btn');
 const prevLabel = document.getElementById('oc-spotlight-prev-label');
 const nextBtn = document.getElementById('oc-spotlight-next-btn');
 const nextLabel = document.getElementById('oc-spotlight-next-label');
 const skipLabel = document.getElementById('oc-spotlight-skip-label');
 const dotsContainer = document.getElementById('oc-spotlight-dots');

 if (badgeEl) badgeEl.textContent = dict.badge;
 if (stepIndEl) stepIndEl.textContent = dict.stepOf.replace('{cur}', index + 1).replace('{tot}', SPOTLIGHT_STEPS.length);
 if (titleEl) titleEl.textContent = stepText.title;
 if (descEl) descEl.textContent = stepText.desc;

 if (helperContainer) {
 helperContainer.style.display = stepDef.showHelper ? 'block' : 'none';
 }
 if (fillLabel) fillLabel.textContent = dict.btnFillDemo;
 if (skipLabel) skipLabel.textContent = dict.btnSkip || (currentLang === 'en' ? 'Skip' : 'Salta');

 if (prevBtn) {
 prevBtn.disabled = (index === 0);
 }
 if (prevLabel) prevLabel.textContent = dict.btnPrev;

 if (nextLabel) {
 nextLabel.textContent = (index === SPOTLIGHT_STEPS.length - 1) ? dict.btnFinish : dict.btnNext;
 }

 if (dotsContainer) {
 dotsContainer.innerHTML = SPOTLIGHT_STEPS.map((_, i) => \`
 <button
 type="button"
 onclick="renderSpotlightStep(\${i})"
 class="w-2.5 h-2.5 rounded-full transition-all cursor-pointer \${i === index ? 'bg-teal-400 w-5' : 'bg-slate-200 hover:bg-gray-500'}"
 aria-label="Passo \${i + 1}"
 ></button>
 \`).join('');
 }
 }, 50);
 }

 function startGuidedDemo() {
 if (window.location.pathname !== '/' && !window.location.pathname.endsWith('/index.html')) {
 window.location.href = '/?startDemo=1';
 return;
 }

 isSpotlightActive = true;
 const backdrop = document.getElementById('oc-spotlight-backdrop');
 const ring = document.getElementById('oc-spotlight-ring');
 const card = document.getElementById('oc-spotlight-card');

 if (backdrop) {
 backdrop.classList.remove('hidden');
 backdrop.style.display = 'block';
 }
 if (ring) {
 ring.classList.remove('hidden');
 ring.style.display = 'block';
 }
 if (card) {
 card.classList.remove('hidden');
 card.style.display = 'flex';
 }

 renderSpotlightStep(0);
 }

 function stopGuidedDemo(e) {
 if (e) {
 if (typeof e.stopPropagation === 'function') e.stopPropagation();
 if (typeof e.preventDefault === 'function') e.preventDefault();
 }
 isSpotlightActive = false;
 if (spotlightStepTimeout) {
 clearTimeout(spotlightStepTimeout);
 spotlightStepTimeout = null;
 }

 const backdrop = document.getElementById('oc-spotlight-backdrop');
 const ring = document.getElementById('oc-spotlight-ring');
 const card = document.getElementById('oc-spotlight-card');

 if (backdrop) {
 backdrop.classList.add('hidden');
 backdrop.style.display = 'none';
 }
 if (ring) {
 ring.classList.add('hidden');
 ring.style.display = 'none';
 }
 if (card) {
 card.classList.add('hidden');
 card.style.display = 'none';
 }

 if (currentHighlightEl) {
 currentHighlightEl.classList.remove('oc-tour-highlight-el');
 currentHighlightEl = null;
 }

 // Automatically close the Job Modal if it was opened by the tour
 const modal = document.getElementById('job-modal');
 if (modal) {
 modal.classList.add('hidden');
 modal.style.display = 'none';
 }
 if (typeof closeModal === 'function') {
 try { closeModal(); } catch (_) {}
 }
 localStorage.setItem('oc_cron_tour_seen', '1');
 }

 function nextSpotlightStep() {
 if (currentSpotlightStep < SPOTLIGHT_STEPS.length - 1) {
 renderSpotlightStep(currentSpotlightStep + 1);
 } else {
 const dict = getTourDict();
 if (typeof showToast === 'function') {
 showToast(dict.finishToast, 'success');
 }
 stopGuidedDemo();
 }
 }

 function prevSpotlightStep() {
 if (currentSpotlightStep > 0) {
 renderSpotlightStep(currentSpotlightStep - 1);
 }
 }

 // Backward-compatible alias functions
 function closeTourModal() { stopGuidedDemo(); }
 function nextTourStep() { nextSpotlightStep(); }
 function prevTourStep() { prevSpotlightStep(); }

 function initOcUiEnhancements() {
 initAccessibleTooltips();
 initOnboardingBanner();
 setLanguage(currentLang);

 window.addEventListener('resize', repositionCurrentStep);
 window.addEventListener('scroll', repositionCurrentStep, true);

 document.addEventListener('keydown', (e) => {
 if (!isSpotlightActive) return;
 if (e.key === 'Escape') {
 stopGuidedDemo();
 } else if (e.key === 'ArrowRight' && !['INPUT', 'TEXTAREA'].includes((document.activeElement && document.activeElement.tagName) || '')) {
 nextSpotlightStep();
 } else if (e.key === 'ArrowLeft' && !['INPUT', 'TEXTAREA'].includes((document.activeElement && document.activeElement.tagName) || '')) {
 prevSpotlightStep();
 }
 });

 // Auto-trigger demo on very first visit or when redirected with ?startDemo=1
 const urlParams = new URLSearchParams(window.location.search);
 if (urlParams.get('startDemo') === '1') {
 window.history.replaceState({}, '', window.location.pathname);
 setTimeout(() => startGuidedDemo(), 400);
 }

 initEntranceMotion();
 initRunsSparkline();
 }

 function initEntranceMotion() {
 const targets = document.querySelectorAll('.oc-band-cell, .oc-band-spark, .oc-sec-title, .oc-job-card, .oc-project-section, #oc-onboarding-banner, .instruction-card, .run-card, .tab-btn');
 if (!targets.length) return;
 const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (reduce || !('IntersectionObserver' in window)) return;
 targets.forEach((el, i) => {
 el.classList.add('oc-enter');
 el.style.transitionDelay = Math.min(i % 8, 7) * 70 + 'ms';
 });
 const io = new IntersectionObserver((entries) => {
 entries.forEach(en => {
 if (en.isIntersecting) { en.target.classList.add('oc-entered'); io.unobserve(en.target); }
 });
 }, { threshold: 0.08 });
 targets.forEach(el => io.observe(el));
 }

 async function initRunsSparkline() {
 const canvas = document.getElementById('oc-runs-spark');
 if (!canvas || !canvas.getContext) return;
 let runs = [];
 try {
 const res = await fetch('/api/runs?limit=500');
 const data = await res.json();
 runs = (data && data.runs) || [];
 } catch (e) { runs = []; }
 const ctx = canvas.getContext('2d');
 const W = canvas.width, H = canvas.height;
 ctx.clearRect(0, 0, W, H);
 const days = [];
 const now = new Date();
 for (let i = 6; i >= 0; i--) {
 const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
 days.push({ key: d.toISOString().slice(0, 10), label: d.toLocaleDateString(undefined, { weekday: 'short' }), ok: 0, fail: 0 });
 }
 const byKey = new Map(days.map(d => [d.key, d]));
 runs.forEach(r => {
 const k = (r.startedAt || '').slice(0, 10);
 const day = byKey.get(k);
 if (!day) return;
 if (r.status === 'failed') day.fail++; else day.ok++;
 });
 const max = Math.max(1, ...days.map(d => d.ok + d.fail));
 const pad = 6, gap = 26;
 const bw = (W - pad * 2 - gap * 6) / 7;
 ctx.font = '600 20px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
 days.forEach((d, i) => {
 const x = pad + i * (bw + gap);
 const total = d.ok + d.fail;
 const hOk = (d.ok / max) * (H - 46);
 const hFail = (d.fail / max) * (H - 46);
 if (total === 0) {
 ctx.fillStyle = 'rgba(255,255,255,0.14)';
 ctx.fillRect(x, H - 26 - 8, bw, 8);
 } else {
 if (d.ok > 0) { ctx.fillStyle = '#2DD4BF'; ctx.fillRect(x, H - 26 - hOk, bw, hOk); }
 if (d.fail > 0) { ctx.fillStyle = '#FB7185'; ctx.fillRect(x, H - 26 - hOk - hFail, bw, hFail); }
 }
 ctx.fillStyle = 'rgba(255,255,255,0.55)';
 ctx.textAlign = 'center';
 ctx.fillText(d.label, x + bw / 2, H - 2);
 if (total > 0) {
 ctx.fillStyle = 'rgba(255,255,255,0.92)';
 ctx.fillText(String(total), x + bw / 2, H - 34 - hOk - hFail);
 }
 });
 }

 window.addEventListener('DOMContentLoaded', () => {
 initOcUiEnhancements();
 });
 `;
}

export function getHeaderControlsHtml(suffix: string = ''): string {
 const langId = `oc-lang-select${suffix}`;
 const guideId = `oc-guide-btn${suffix}`;
 return `
 <!-- Language Selector (10 Languages) -->
 <label for="${langId}" class="sr-only">Lingua / Language</label>
 <select
 id="${langId}"
 onchange="setLanguage(this.value)"
 aria-label="Seleziona lingua interfaccia"
 class="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl px-2.5 py-2 min-h-[36px] border border-darkborder focus:outline-none focus:border-brand-500 cursor-pointer transition-colors shrink-0"
 >
 <option value="it">Italiano</option>
 <option value="en">English</option>
 <option value="es">Español</option>
 <option value="fr">Français</option>
 <option value="de">Deutsch</option>
 <option value="pt">Português</option>
 <option value="zh">中文</option>
 <option value="ja">日本語</option>
 <option value="ar">العربية</option>
 <option value="ru">Русский</option>
 </select>

 <!-- Interactive Guide Drawer Button -->
 <button
 type="button"
 id="${guideId}"
 onclick="openGuideDrawer()"
 data-tooltip="guide.shortcutHint"
 class="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-2.5 py-2 min-h-[36px] min-w-[36px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
 >
 <i class="fa-solid fa-circle-question text-slate-500 text-xs"></i>
 <span class="hidden sm:inline" data-i18n="nav.guide">Guida</span>
 </button>
 `;
}

export function getOnboardingBannerHtml(): string {
 return `
 <section id="oc-onboarding-banner" aria-label="Guida Rapida Primi Passi" class="bg-white rounded-2xl p-4 sm:p-5">
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
 <div class="min-w-0">
 <h2 class="text-base font-bold text-slate-900" data-i18n="onboard.title">Benvenuto in OpenCode Cron - Guida Rapida</h2>
 <p class="text-base text-slate-700" data-i18n="onboard.subtitle">Automatizza task ricorrenti, monitoraggio notizie e controlli codice direttamente nelle sessioni OpenCode.</p>
 </div>
 <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
 <button type="button" onclick="openGuideDrawer()" class="px-3 py-1.5 rounded-lg bg-[#101828] hover:bg-[#1D2939] text-white text-[13px] font-semibold">
 <i class="fa-solid fa-book-open mr-1"></i> <span data-i18n="nav.guide">Guida</span>
 </button>
 <button type="button" onclick="dismissOnboardingBanner()" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[13px]" data-i18n="onboard.dismiss">
 Nascondi suggerimenti
 </button>
 </div>
 </div>
 <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 pt-1 text-base text-slate-700">
 <p class="leading-relaxed" data-i18n="onboard.step1Desc">Scegli una sessione principale, imposta l'intervallo (es. 5m o 0 9 * * *) e definisci System + Followup Prompt.</p>
 <p class="leading-relaxed" data-i18n="onboard.step2Desc">Il demone macOS launchd esegue i job scaduti in background anche a browser chiuso e sincronizza il DB SQLite.</p>
 <p class="leading-relaxed" data-i18n="onboard.step3Desc">Segui le risposte in tempo reale in Live Chat oppure apri la pagina Esiti Runs per vedere successi ed errori.</p>
 </div>
 </section>
 `;
}
