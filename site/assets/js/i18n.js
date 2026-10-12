/* =============================================================================
 * i18n.js — 10-language dictionary for the opencode-cron launch site.
 * Languages: en, it, es, fr, de, pt, zh, ja, ru, ar (RTL).
 * Usage: <h1 data-i18n="hero.titleA"></h1>  (dots walk nested objects).
 * Engine lives at the bottom: window.OC_I18N = { apply, setLang, current }.
 * ========================================================================== */

window.OC_LANGS = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "it", flag: "🇮🇹", name: "Italiano" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "pt", flag: "🇵🇹", name: "Português" },
  { code: "zh", flag: "🇨🇳", name: "中文" },
  { code: "ja", flag: "🇯🇵", name: "日本語" },
  { code: "ru", flag: "🇷🇺", name: "Русский" },
  { code: "ar", flag: "🇸🇦", name: "العربية" }
];


const DICT = {};

/* ===================== ENGLISH (reference) ===================== */
DICT.en = {
  dir: "ltr",
  nav: { features: "Features", how: "How it works", usecases: "Use cases", gui: "Mission Control", tools: "Tools", faq: "FAQ", contact: "Contact", cta: "Get started", lang: "Language" },
  hero: {
    pill: "Now live on opencode v2 · v1.0.0",
    titleA: "ChatGPT Scheduled Tasks,",
    titleGrad: "for opencode.",
    lede: "Tell opencode “watch competitor releases every 15 minutes” and it keeps going in the <b>same session</b> — with persistent memory, even after context compact, even with your terminal closed.",
    ctaStart: "Get started free", ctaGit: "★ Star on GitHub", copy: "Copy", copied: "Copied!", scroll: "Scroll to explore"
  },
  problem: {
    badge: "The problem", title: "Plain cron is blind.", sub: "Classic schedulers fire a shell script and forget. opencode-cron re-runs an intelligent agent with full memory and judgment.",
    badTitle: "😵 Plain cron / bash loops",
    bad1: "Spawns blind one-off shell scripts — zero context",
    bad2: "Conversation state wiped on context compact",
    bad3: "Repeats the same alert every single tick",
    bad4: "Can loop forever and burn your API tokens",
    bad5: "Terminal only, grepping obscure syslog files",
    goodTitle: "⚡ opencode-cron",
    good1: "Re-prompts the same session ID with full history",
    good2: "Compaction hook re-injects the memory file",
    good3: "seenHashes dedup prevents repeat alerts",
    good4: "60s min, jitter, maxRuns and 5-fail circuit breaker",
    good5: "Mission Control Web GUI + execution timeline"
  },
  features: {
    badge: "Strengths", title: "Why opencode-cron?", sub: "An intelligent AI agent scheduler — not another crontab.",
    f1t: "Same conversation, every tick", f1d: "It re-prompts the same sessionID with full conversation history — not a detached CLI call.",
    f2t: "Persistent markdown memory", f2d: "Survives compaction, restarts and reboots. Tracks seenHashes to stop repetitive notifications.",
    f3t: "Mission Control Web GUI", f3d: "A sleek dark dashboard at localhost:4488 with live chat streaming, job monitors and instant controls.",
    f4t: "Cross-platform desktop app", f4d: "Native installers for macOS, Windows and Linux with a live system tray showing real-time cron status.",
    f5t: "1-click schedule binding", f5d: "Bind a recurring schedule to any conversation with visual previews — never hand-write cron strings again.",
    f6t: "Execution timeline", f6d: "Full visibility into every tick: duration, status, exit codes, trigger source and error logs.",
    f7t: "Global 10-language suite", f7d: "English, Italiano, Español, Français, Deutsch, Português, 中文, 日本語, Русский and العربية with RTL.",
    f8t: "Autonomous daemon", f8d: "Keeps running overnight with your TUI closed via native launchd, systemd or schtasks."
  },
  how: {
    badge: "Architecture", title: "How it works", sub: "Four steps from a scheduled job to an intelligent, memory-aware tick.",
    s1t: "Schedule", s1d: "cron_add stores a job in jobs.json plus a memory file — bound to your session ID.",
    s2t: "Fire", s2d: "An in-process timer (or a 60s OS daemon when the TUI is closed) wakes the due job.",
    s3t: "Remember", s3d: "The tick prompt injects a frozen objective + memory + a 3-question self-check + your follow-up.",
    s4t: "Act", s4d: "The same session continues; findings persist to markdown and dedupe against seenHashes."
  },
  compare: {
    badge: "Comparison", title: "Plain cron vs. opencode-cron", sub: "Use plain cron for pure shell work. Use opencode-cron when the task needs judgment every run.",
    colFeat: "Feature", colCron: "Plain cron / bash", colOC: "opencode-cron",
    r1f: "Session awareness", r1c: "Blind one-off shells", r1o: "Re-prompts same session ID",
    r2f: "Context compact safe", r2c: "Wiped on compact", r2o: "Hook re-injects memory",
    r3f: "Deduplication", r3c: "Repeats every tick", r3o: "seenHashes dedup",
    r4f: "Loop / token protection", r4c: "Loops, burns tokens", r4o: "60s min + 5-fail pause",
    r5f: "User interface", r5c: "Terminal / crontab file", r5o: "Web GUI Mission Control",
    r6f: "Observability", r6c: "Grepping syslog", r6o: "Dedicated /runs timeline",
    r7f: "Multi-language", r7c: "English only / none", r7o: "10 languages + tour"
  },
  usecases: {
    badge: "Templates", title: "Real-world use cases", sub: "Ship-ready templates that keep working while you sleep.",
    u1t: "Repo Guardian", u1f: "every 30m", u1d: "Runs tests, checks git status, flags new TODOs and reports only on diffs.",
    u2t: "AI news & X watcher", u2f: "every 5–15m", u2d: "Monitors AI releases, saves structured digests, dedupes with seenHashes.",
    u3t: "CI flaky-test watchdog", u3f: "every 10m", u3d: "Retries failing CI, compiles error matrices and alerts when resolved.",
    u4t: "Competitor price monitor", u4f: "every 1h", u4d: "Scrapes pricing pages, calculates diffs and reports anomalies.",
    u5t: "Lead & inbox triage", u5f: "every 30m", u5d: "Filters priority emails and summarizes key action items in markdown."
  },
  gui: {
    badge: "Mission Control", title: "A real dashboard for your agents", sub: "Manage your entire automation fleet from a sleek dark-mode Web GUI.",
    m1: "Active cron matrix", m1d: "Live counters, last tick results, next-run countdowns and pause/resume toggles.",
    m2: "Live session stream", m2d: "Read active and archived chats in real time with auto-refresh and diff highlight.",
    m3: "Memory studio", m3d: "View and edit per-job markdown memory to steer the agent without touching files.",
    m4: "Execution history", m4d: "A live timeline of successes, failures, skips and latencies with error traces.",
    sidebar: { mission: "Mission Control", runs: "Execution timeline", memory: "Memory studio", guide: "Interactive guide", sessions: "Sessions" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "next"
  },
  desktop: {
    badge: "Everywhere", title: "Desktop app + system tray", sub: "A native installable app that stays out of your way and keeps your jobs alive.",
    mac: "macOS", macd: "Universal .dmg — Apple Silicon & Intel", win: "Windows", wind: "NSIS installer & portable .exe", linux: "Linux", linuxd: ".AppImage & .deb packages"
  },

  tools: {
    badge: "For agents", title: "9 native tools + 5 slash commands", sub: "Agents equipped with opencode-cron get first-class scheduling primitives.",
    t1: "Create a recurring task bound to the current session", t2: "List all active and paused jobs", t3: "Inspect detailed job state and metadata",
    t4: "Temporarily pause a job", t5: "Resume a paused job", t6: "Delete a job and its persistent memory",
    t7: "Trigger an immediate test tick", t8: "Read the persistent markdown memory", t9: "Persist findings and update seenHashes",
    s1: "/cron-add — interactive scheduling wizard", s2: "/cron-list — inspect jobs and next runs", s3: "/cron-manage — pause, resume or delete",
    s4: "/cron-gui — launch the Web GUI", s5: "/cron-refresh — re-sync rotated credentials"
  },
  stats: { s1: "10", s1l: "Languages", s2: "9", s2l: "Native tools", s3: "3", s3l: "Desktop platforms", s4: "60s", s4l: "Minimum interval" },
  cta: { title: "Give your agent a schedule.", sub: "Install the plugin, say the word, and let opencode-cron keep working in the background — safely.", btn1: "Get started free", btn2: "Read the docs" },
  faq: {
    badge: "FAQ", title: "Frequently asked questions", sub: "Everything you need to know before scheduling your first job.",
    q1: "What exactly is opencode-cron?", a1: "It is an open-source plugin that brings ChatGPT-style Scheduled Tasks to opencode. Unlike plain cron, it re-prompts the same AI session on every tick with persistent markdown memory, so the agent keeps full context, dedupes alerts and avoids burning tokens.",
    q2: "How is it different from a normal crontab?", a2: "A crontab runs a blind shell script with no context. opencode-cron runs an intelligent agent inside your existing session, injects a frozen objective plus memory plus a self-check, and persists what it learns — guarded by a 60s minimum, atomic locks and a 5-failure circuit breaker.",
    q3: "Does it keep running when I close the terminal?", a3: "Yes. The TUI-closed path installs a native 60-second ticker via launchd (macOS), systemd (Linux) or schtasks (Windows) that executes due jobs headlessly under an atomic lock.",
    q4: "What happens to memory when the chat compacts?", a4: "opencode-cron hooks into the compaction event and re-injects the job's memory file into the compaction summary. Chat history may compact, but the markdown memory is the source of truth and never compacts.",
    q5: "How are costs and runaway loops protected?", a5: "Every job has a minimum 60s interval, up to 10% jitter, an optional maxRuns cap, a skip-if-running lock and an auto-pause after 5 consecutive failures — so a broken job can never loop forever.",
    q6: "Is it free and open source?", a6: "Yes — MIT licensed, published on npm as @culturedigitali/opencode-cron and maintained by Culture Digitali Srl."
  },
  contact: {
    badge: "Contact", title: "Get in touch", sub: "Questions, enterprise needs or just want to say hi? We usually reply within a day.",
    name: "Your name", email: "Your email", subject: "Subject", message: "Message", send: "Send message", sending: "Sending…",
    sent: "Thanks! Your message is on its way.", err: "Something went wrong. Please email us directly.", needMsg: "Please fill in all fields.",
    direct: "Or email directly", repo: "Repository", issues: "Report a bug", consent: "Your data is only used to reply to you."
  },
  credits: { title: "Built by", company: "Culture Digitali Srl", companyDesc: "Italian studio crafting AI-native developer tools and automation.", dev: "Luigi Strazzullo", devRole: "Creator & lead developer of opencode-cron" },
  footer: {
    tagline: "ChatGPT Scheduled Tasks for opencode — session-bound cron + persistent memory for AI agents.",
    product: "Product", resources: "Resources", community: "Community",
    docs: "Documentation", quickstart: "30-second quickstart", examples: "Examples", how: "How it works", troubleshoot: "Troubleshooting", comparison: "vs plain cron",
    github: "GitHub", npm: "npm", license: "MIT License", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron is open source under the MIT license."
  },
  nf: { text: "This scheduled job never fired — the page you were looking for doesn’t exist.", back: "← Back to the launch page" }

};


/* ===================== ITALIANO ===================== */
DICT.it = {
  dir: "ltr",
  nav: { features: "Funzionalità", how: "Come funziona", usecases: "Casi d'uso", gui: "Mission Control", tools: "Strumenti", faq: "FAQ", contact: "Contatti", cta: "Inizia ora", lang: "Lingua" },
  hero: {
    pill: "Disponibile su opencode v2 · v1.0.0",
    titleA: "Attività pianificate stile ChatGPT,",
    titleGrad: "per opencode.",
    lede: "Dì a opencode “controlla le uscite dei competitor ogni 15 minuti” e continuerà nella <b>stessa sessione</b> — con memoria persistente, anche dopo il compact del contesto, anche a terminale chiuso.",
    ctaStart: "Inizia gratis", ctaGit: "★ Metti una stella su GitHub", copy: "Copia", copied: "Copiato!", scroll: "Scorri per esplorare"
  },
  problem: {
    badge: "Il problema", title: "Il cron classico è cieco.", sub: "Gli scheduler classici lanciano uno script e dimenticano. opencode-cron riesegue un agente intelligente con memoria e giudizio.",
    badTitle: "😵 Cron classico / cicli bash",
    bad1: "Lancia script shell isolati — zero contesto",
    bad2: "Stato della conversazione perso nel compact",
    bad3: "Ripete lo stesso avviso a ogni tick",
    bad4: "Può ciclare all'infinito e bruciare token",
    bad5: "Solo terminale, a leggere syslog oscuri",
    goodTitle: "⚡ opencode-cron",
    good1: "Ri-prompta la stessa sessione con tutta la cronologia",
    good2: "L'hook di compaction re-inietta la memoria",
    good3: "Il dedup seenHashes evita avvisi ripetuti",
    good4: "Min 60s, jitter, maxRuns e circuito 5-fail",
    good5: "Web GUI Mission Control + timeline esecuzioni"
  },
  features: {
    badge: "Punti di forza", title: "Perché opencode-cron?", sub: "U scheduler di agenti AI intelligente — non l'ennesimo crontab.",
    f1t: "Stessa conversazione, ogni tick", f1d: "Ri-prompta lo stesso sessionID con tutta la cronologia — non una chiamata CLI staccata.",
    f2t: "Memoria markdown persistente", f2d: "Sopravvive a compact, riavvii e reboot. Traccia seenHashes per fermare le notifiche ripetute.",
    f3t: "Web GUI Mission Control", f3d: "Una dashboard dark su localhost:4488 con streaming chat live, monitor job e controlli istantanei.",
    f4t: "App desktop multipiattaforma", f4d: "Installer nativi per macOS, Windows e Linux con system tray che mostra lo stato cron in tempo reale.",
    f5t: "Binding schedulazione 1-click", f5d: "Collega una schedulazione ricorrente a qualsiasi conversazione con anteprime visuali.",
    f6t: "Timeline esecuzioni", f6d: "Visibilità totale su ogni tick: durata, stato, exit code, sorgente e log errori.",
    f7t: "Suite 10 lingue", f7d: "English, Italiano, Español, Français, Deutsch, Português, 中文, 日本語, Русский e العربية con RTL.",
    f8t: "Demone autonomo", f8d: "Gira tutta la notte a TUI chiuso tramite launchd, systemd o schtasks nativi."
  },
  how: {
    badge: "Architettura", title: "Come funziona", sub: "Quattro passi da un job pianificato a un tick intelligente e consapevole della memoria.",
    s1t: "Pianifica", s1d: "cron_add salva un job in jobs.json più un file di memoria — legato alla tua sessione.",
    s2t: "Attiva", s2d: "Un timer in-process (o un demone OS da 60s a TUI chiuso) sveglia il job dovuto.",
    s3t: "Ricorda", s3d: "Il tick inietta obiettivo congelato + memoria + self-check a 3 domande + il tuo follow-up.",
    s4t: "Agisci", s4d: "La stessa sessione continua; i risultati persistono in markdown e dedupano su seenHashes."
  },
};
Object.assign(DICT.it, {
  compare: {
    badge: "Confronto", title: "Cron classico vs opencode-cron", sub: "Usa il cron classico per lavoro shell puro. Usa opencode-cron quando il compito richiede giudizio a ogni esecuzione.",
    colFeat: "Funzionalità", colCron: "Cron classico / bash", colOC: "opencode-cron",
    r1f: "Consapevolezza della sessione", r1c: "Script isolati e ciechi", r1o: "Ri-prompta la stessa sessione",
    r2f: "Safe al compact", r2c: "Perso nel compact", r2o: "Hook re-inietta la memoria",
    r3f: "Deduplicazione", r3c: "Ripete a ogni tick", r3o: "Dedup seenHashes",
    r4f: "Protezione loop/token", r4c: "Cicla, brucia token", r4o: "Min 60s + pausa 5-fail",
    r5f: "Interfaccia", r5c: "Terminale / file crontab", r5o: "Web GUI Mission Control",
    r6f: "Osservabilità", r6c: "Grepping syslog", r6o: "Timeline /runs dedicata",
    r7f: "Multilingua", r7c: "Solo inglese / nulla", r7o: "10 lingue + tour"
  },
  usecases: {
    badge: "Template", title: "Casi d'uso reali", sub: "Template pronti che continuano a lavorare mentre dormi.",
    u1t: "Repo Guardian", u1f: "ogni 30m", u1d: "Esegue i test, controlla git status, segnala nuovi TODO e riporta solo le differenze.",
    u2t: "Osservatore news AI & X", u2f: "ogni 5–15m", u2d: "Monitora le uscite AI, salva digest strutturati, dedupa con seenHashes.",
    u3t: "Watchdog CI flaky", u3f: "ogni 10m", u3d: "Ritenta la CI che fallisce, compila matrici di errore e avvisa quando si risolve.",
    u4t: "Monitor prezzi competitor", u4f: "ogni 1h", u4d: "Estrae le pagine prezzi, calcola le differenze e riporta le anomalie.",
    u5t: "Triage lead & inbox", u5f: "ogni 30m", u5d: "Filtra le email prioritarie e riassume le azioni chiave in markdown."
  },
  gui: {
    badge: "Mission Control", title: "Una vera dashboard per i tuoi agenti", sub: "Gestisci tutta la tua flotta di automazioni da una Web GUI dark ed elegante.",
    m1: "Matrice cron attiva", m1d: "Contatori live, esiti ultimo tick, countdown prossima esecuzione e toggle pausa/riprendi.",
    m2: "Stream sessioni live", m2d: "Leggi chat attive e archiviate in tempo reale con auto-refresh ed evidenziazione diff.",
    m3: "Studio memoria", m3d: "Visualizza e modifica la memoria markdown per job senza toccare i file.",
    m4: "Storico esecuzioni", m4d: "Una timeline live di successi, fallimenti, skip e latenze con trace di errore.",
    sidebar: { mission: "Mission Control", runs: "Timeline esecuzioni", memory: "Studio memoria", guide: "Guida interattiva", sessions: "Sessioni" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "prossima"
  },
  desktop: {
    badge: "Ovunque", title: "App desktop + system tray", sub: "Un'app nativa installabile che resta in disparte e tiene vivi i tuoi job.",
    mac: "macOS", macd: ".dmg universale — Apple Silicon & Intel", win: "Windows", wind: "Installer NSIS & .exe portatile", linux: "Linux", linuxd: "Pacchetti .AppImage e .deb"
  },


  tools: {
    badge: "Per gli agenti", title: "9 strumenti nativi + 5 slash command", sub: "Gli agenti con opencode-cron ottengono primitive di schedulazione di prima classe.",
    t1: "Crea un task ricorrente legato alla sessione corrente", t2: "Elenca tutti i job attivi e in pausa", t3: "Ispeziona stato e metadati del job",
    t4: "Metti in pausa un job", t5: "Riprendi un job in pausa", t6: "Elimina un job e la sua memoria persistente",
    t7: "Attiva subito un tick di test", t8: "Leggi la memoria markdown persistente", t9: "Persisti i risultati e aggiorna seenHashes",
    s1: "/cron-add — wizard di schedulazione interattivo", s2: "/cron-list — ispeziona job e prossime esecuzioni", s3: "/cron-manage — pausa, riprendi o elimina",
    s4: "/cron-gui — avvia la Web GUI", s5: "/cron-refresh — ri-sincronizza le credenziali ruotate"
  },
  stats: { s1: "10", s1l: "Lingue", s2: "9", s2l: "Strumenti nativi", s3: "3", s3l: "Piattaforme desktop", s4: "60s", s4l: "Intervallo minimo" },
  cta: { title: "Dai una schedulazione al tuo agente.", sub: "Installa il plugin, dì la parola e lascia che opencode-cron lavori in background — in sicurezza.", btn1: "Inizia gratis", btn2: "Leggi la docs" },
  faq: {
    badge: "FAQ", title: "Domande frequenti", sub: "Tutto quello che devi sapere prima di pianificare il tuo primo job.",
    q1: "Cos'è esattamente opencode-cron?", a1: "È un plugin open-source che porta le Attività Pianificate in stile ChatGPT su opencode. A differenza del cron classico, ri-prompta la stessa sessione AI a ogni tick con memoria markdown persistente, così l'agente mantiene il contesto, dedupa gli avvisi e non brucia token.",
    q2: "In cosa differisce da un crontab?", a2: "Un crontab esegue uno script shell cieco senza contesto. opencode-cron esegue un agente intelligente dentro la sessione esistente, inietta un obiettivo congelato più memoria più self-check e persiste ciò che impara — protetto da un minimo di 60s, lock atomici e un circuito a 5 failure.",
    q3: "Continua a girare se chiudo il terminale?", a3: "Sì. Il percorso a TUI chiuso installa un ticker nativo da 60 secondi tramite launchd (macOS), systemd (Linux) o schtasks (Windows) che esegue i job dovuti in headless sotto un lock atomico.",
    q4: "Cosa succede alla memoria quando la chat compatta?", a4: "opencode-cron aggancia l'evento di compaction e re-inietta il file di memoria del job nel sommario di compaction. La cronologia può compattare, ma la memoria markdown è la fonte di verità e non compatta mai.",
    q5: "Come si proteggono costi e loop incontrollati?", a5: "Ogni job ha un intervallo minimo di 60s, fino al 10% di jitter, un limite maxRuns opzionale, un lock skip-if-running e un'auto-pausa dopo 5 failure consecutivi — così un job rotto non può ciclare all'infinito.",
    q6: "È gratis e open source?", a6: "Sì — licenza MIT, pubblicato su npm come @culturedigitali/opencode-cron e mantenuto da Culture Digitali Srl."
  },
  contact: {
    badge: "Contatti", title: "Mettiti in contatto", sub: "Domande, esigenze enterprise o solo un saluto? Rispondiamo di solito entro un giorno.",
    name: "Il tuo nome", email: "La tua email", subject: "Oggetto", message: "Messaggio", send: "Invia messaggio", sending: "Invio…",
    sent: "Grazie! Il tuo messaggio è in viaggio.", err: "Qualcosa è andato storto. Scrivici direttamente.", needMsg: "Compila tutti i campi.",
    direct: "Oppure scrivi direttamente", repo: "Repository", issues: "Segnala un bug", consent: "I tuoi dati servono solo per risponderti."
  },
  credits: { title: "Creato da", company: "Culture Digitali Srl", companyDesc: "Studio italiano di strumenti per sviluppatori AI-native e automazione.", dev: "Luigi Strazzullo", devRole: "Ideatore e sviluppatore principale di opencode-cron" },
  footer: {
    tagline: "Attività Pianificate stile ChatGPT per opencode — cron legato alla sessione + memoria persistente per agenti AI.",
    product: "Prodotto", resources: "Risorse", community: "Community",
    docs: "Documentazione", quickstart: "Quickstart 30 secondi", examples: "Esempi", how: "Come funziona", troubleshoot: "Risoluzione problemi", comparison: "vs cron classico",
    github: "GitHub", npm: "npm", license: "Licenza MIT", issues: "Issue",
    legal: "© {year} Culture Digitali Srl · opencode-cron è open source con licenza MIT."
  },
  nf: { text: "Questo job pianificato non è mai partito — la pagina che cercavi non esiste.", back: "← Torna alla pagina di lancio" }
});


/* ENGINE is appended at the very end of this file. */
window.__OC_DICT__ = DICT;


/* ===================== ESPAÑOL ===================== */
DICT.es = {
  dir: "ltr",
  nav: { features: "Funciones", how: "Cómo funciona", usecases: "Casos de uso", gui: "Mission Control", tools: "Herramientas", faq: "FAQ", contact: "Contacto", cta: "Empezar", lang: "Idioma" },
  hero: {
    pill: "Disponible en opencode v2 · v1.0.0",
    titleA: "Tareas programadas estilo ChatGPT,",
    titleGrad: "para opencode.",
    lede: "Dile a opencode “vigila los lanzamientos de la competencia cada 15 minutos” y seguirá en la <b>misma sesión</b> — con memoria persistente, incluso tras compactar el contexto, incluso con el terminal cerrado.",
    ctaStart: "Empieza gratis", ctaGit: "★ Estrella en GitHub", copy: "Copiar", copied: "¡Copiado!", scroll: "Desplázate para explorar"
  },
  problem: {
    badge: "El problema", title: "El cron común es ciego.", sub: "Los planificadores clásicos ejecutan un script y olvidan. opencode-cron vuelve a ejecutar un agente inteligente con memoria y criterio.",
    badTitle: "😵 Cron común / bucles bash",
    bad1: "Lanza scripts aislados — cero contexto",
    bad2: "Estado de la conversación borrado al compactar",
    bad3: "Repite la misma alerta en cada tick",
    bad4: "Puede loopear infinito y quemar tokens",
    bad5: "Solo terminal, leyendo syslog oscuros",
    goodTitle: "⚡ opencode-cron",
    good1: "Re-promptea la misma sesión con todo el historial",
    good2: "El hook de compactación reinyecta la memoria",
    good3: "El dedup seenHashes evita alertas repetidas",
    good4: "Mín 60s, jitter, maxRuns y cortacircuitos 5-fallos",
    good5: "Web GUI Mission Control + línea de tiempo"
  },
  features: {
    badge: "Fortalezas", title: "¿Por qué opencode-cron?", sub: "Un planificador de agentes IA inteligente — no otro crontab.",
    f1t: "La misma conversación, cada tick", f1d: "Re-promptea el mismo sessionID con todo el historial — no una llamada CLI aislada.",
    f2t: "Memoria markdown persistente", f2d: "Sobrevive a compactaciones, reinicios y rebooteos. Rastrea seenHashes para frenar notificaciones repetidas.",
    f3t: "Web GUI Mission Control", f3d: "Un panel oscuro elegante en localhost:4488 con chat en vivo, monitores de jobs y controles instantáneos.",
    f4t: "App de escritorio multiplataforma", f4d: "Instaladores nativos para macOS, Windows y Linux con bandeja del sistema que muestra el estado en vivo.",
    f5t: "Vinculación de horario en 1 clic", f5d: "Asocia una programación recurrente a cualquier conversación con vistas previas visuales.",
    f6t: "Línea de tiempo de ejecución", f6d: "Visibilidad total de cada tick: duración, estado, códigos de salida, origen y logs de error.",
    f7t: "Suite de 10 idiomas", f7d: "English, Italiano, Español, Français, Deutsch, Português, 中文, 日本語, Русский y العربية con RTL.",
    f8t: "Demonio autónomo", f8d: "Sigue funcionando de noche con el TUI cerrado mediante launchd, systemd o schtasks nativos."
  },
  how: {
    badge: "Arquitectura", title: "Cómo funciona", sub: "Cuatro pasos de un job programado a un tick inteligente y consciente de la memoria.",
    s1t: "Programar", s1d: "cron_add guarda un job en jobs.json más un archivo de memoria — ligado a tu sesión.",
    s2t: "Disparar", s2d: "Un temporizador en proceso (o un demonio OS de 60s con el TUI cerrado) despierta el job.",
    s3t: "Recordar", s3d: "El tick inyecta objetivo congelado + memoria + autochequeo de 3 preguntas + tu seguimiento.",
    s4t: "Actuar", s4d: "La misma sesión continúa; los hallazgos persisten en markdown y deduplican con seenHashes."
  },
};
Object.assign(DICT.es, {
  compare: {
    badge: "Comparación", title: "Cron común vs opencode-cron", sub: "Usa cron común para trabajo shell puro. Usa opencode-cron cuando la tarea necesita criterio en cada ejecución.",
    colFeat: "Función", colCron: "Cron común / bash", colOC: "opencode-cron",
    r1f: "Conciencia de sesión", r1c: "Scripts aislados y ciegos", r1o: "Re-promptea la misma sesión",
    r2f: "Seguro ante compactación", r2c: "Borrado al compactar", r2o: "Hook reinyecta memoria",
    r3f: "Deduplicación", r3c: "Repite cada tick", r3o: "Dedup seenHashes",
    r4f: "Protección loop/tokens", r4c: "Looopea, quema tokens", r4o: "Mín 60s + pausa 5-fallos",
    r5f: "Interfaz", r5c: "Terminal / archivo crontab", r5o: "Web GUI Mission Control",
    r6f: "Observabilidad", r6c: "Leyendo syslog", r6o: "Línea de tiempo /runs",
    r7f: "Multiidioma", r7c: "Solo inglés / nada", r7o: "10 idiomas + tour"
  },
  usecases: {
    badge: "Plantillas", title: "Casos de uso reales", sub: "Plantillas listas que siguen trabajando mientras duermes.",
    u1t: "Guardián de repo", u1f: "cada 30m", u1d: "Corre tests, revisa git status, marca nuevos TODOs y reporta solo diferencias.",
    u2t: "Vigilante de noticias IA & X", u2f: "cada 5–15m", u2d: "Monitoriza lanzamientos IA, guarda digests estructurados, deduplica con seenHashes.",
    u3t: "Vigilante de CI flaky", u3f: "cada 10m", u3d: "Reintenta la CI que falla, compila matrices de error y avisa al resolverse.",
    u4t: "Monitor de precios", u4f: "cada 1h", u4d: "Extrae páginas de precios, calcula diferencias y reporta anomalías.",
    u5t: "Triage de leads e inbox", u5f: "cada 30m", u5d: "Filtra correos prioritarios y resume acciones clave en markdown."
  },
  gui: {
    badge: "Mission Control", title: "Un panel real para tus agentes", sub: "Gestiona toda tu flota de automatización desde una Web GUI oscura y elegante.",
    m1: "Matriz cron activa", m1d: "Contadores en vivo, resultados del último tick, cuentas atrás y toggles pausa/reanudar.",
    m2: "Stream de sesiones", m2d: "Lee chats activas y archivadas en tiempo real con auto-refresco y resaltado de diff.",
    m3: "Estudio de memoria", m3d: "Ve y edita la memoria markdown por job sin tocar archivos.",
    m4: "Historial de ejecución", m4d: "Una línea de tiempo en vivo de éxitos, fallos, saltos y latencias con trazas de error.",
    sidebar: { mission: "Mission Control", runs: "Línea de tiempo", memory: "Estudio de memoria", guide: "Guía interactiva", sessions: "Sesiones" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "próx"
  },
  desktop: {
    badge: "En todas partes", title: "App de escritorio + bandeja", sub: "Una app nativa instalable que se aparta y mantiene vivos tus jobs.",
    mac: "macOS", macd: ".dmg universal — Apple Silicon e Intel", win: "Windows", wind: "Instalador NSIS y .exe portable", linux: "Linux", linuxd: "Paquetes .AppImage y .deb"
  },
  tools: {
    badge: "Para agentes", title: "9 herramientas nativas + 5 comandos slash", sub: "Los agentes con opencode-cron obtienen primitivas de programación de primera clase.",
    t1: "Crea una tarea recurrente ligada a la sesión actual", t2: "Lista todos los jobs activos y pausados", t3: "Inspecciona estado y metadatos del job",
    t4: "Pausa temporalmente un job", t5: "Reanuda un job pausado", t6: "Elimina un job y su memoria persistente",
    t7: "Dispara un tick de prueba inmediato", t8: "Lee la memoria markdown persistente", t9: "Persiste hallazgos y actualiza seenHashes",
    s1: "/cron-add — asistente de programación interactivo", s2: "/cron-list — inspecciona jobs y próximas ejecuciones", s3: "/cron-manage — pausa, reanuda o elimina",
    s4: "/cron-gui — lanza la Web GUI", s5: "/cron-refresh — re-sincroniza credenciales rotadas"
  },
  stats: { s1: "10", s1l: "Idiomas", s2: "9", s2l: "Herramientas nativas", s3: "3", s3l: "Plataformas de escritorio", s4: "60s", s4l: "Intervalo mínimo" },
  cta: { title: "Dale un horario a tu agente.", sub: "Instala el plugin, dilo, y deja que opencode-cron siga trabajando en segundo plano — con seguridad.", btn1: "Empieza gratis", btn2: "Lee la documentación" },
});

Object.assign(DICT.es, {
  faq: {
    badge: "FAQ", title: "Preguntas frecuentes", sub: "Todo lo que necesitas saber antes de programar tu primer job.",
    q1: "¿Qué es exactamente opencode-cron?", a1: "Es un plugin de código abierto que lleva las Tareas Programadas estilo ChatGPT a opencode. A diferencia del cron común, re-promptea la misma sesión IA en cada tick con memoria markdown persistente, así el agente mantiene contexto, deduplica alertas y evita quemar tokens.",
    q2: "¿En qué se diferencia de un crontab?", a2: "Un crontab ejecuta un script shell ciego sin contexto. opencode-cron ejecuta un agente inteligente dentro de tu sesión existente, inyecta un objetivo congelado más memoria más un autochequeo, y persiste lo aprendido — protegido por un mínimo de 60s, locks atómicos y un cortacircuitos de 5 fallos.",
    q3: "¿Sigue funcionando si cierro la terminal?", a3: "Sí. La ruta con el TUI cerrado instala un ticker nativo de 60 segundos vía launchd (macOS), systemd (Linux) o schtasks (Windows) que ejecuta los jobs debidos headless bajo un lock atómico.",
    q4: "¿Qué pasa con la memoria cuando el chat compacta?", a4: "opencode-cron se engancha al evento de compactación y reinyecta el archivo de memoria del job en el resumen. El historial puede compactar, pero la memoria markdown es la fuente de verdad y nunca compacta.",
    q5: "¿Cómo se protegen los costos y los loops?", a5: "Cada job tiene un intervalo mínimo de 60s, hasta 10% de jitter, un tope maxRuns opcional, un lock skip-if-running y una auto-pausa tras 5 fallos consecutivos — así un job roto nunca puede loopear infinito.",
    q6: "¿Es gratis y de código abierto?", a6: "Sí — licencia MIT, publicado en npm como @culturedigitali/opencode-cron y mantenido por Culture Digitali Srl."
  },
  contact: {
    badge: "Contacto", title: "Ponte en contacto", sub: "¿Dudas, necesidades enterprise o solo saludar? Solemos responder en un día.",
    name: "Tu nombre", email: "Tu email", subject: "Asunto", message: "Mensaje", send: "Enviar mensaje", sending: "Enviando…",
    sent: "¡Gracias! Tu mensaje va en camino.", err: "Algo salió mal. Escríbenos directamente.", needMsg: "Rellena todos los campos.",
    direct: "O escribe directamente", repo: "Repositorio", issues: "Reporta un error", consent: "Tus datos solo se usan para responderte."
  },
  credits: { title: "Creado por", company: "Culture Digitali Srl", companyDesc: "Estudio italiano que crea herramientas de desarrollo AI-native y automatización.", dev: "Luigi Strazzullo", devRole: "Creador y desarrollador principal de opencode-cron" },
  footer: {
    tagline: "Tareas Programadas estilo ChatGPT para opencode — cron ligado a sesión + memoria persistente para agentes IA.",
    product: "Producto", resources: "Recursos", community: "Comunidad",
    docs: "Documentación", quickstart: "Inicio rápido 30 segundos", examples: "Ejemplos", how: "Cómo funciona", troubleshoot: "Solución de problemas", comparison: "vs cron común",
    github: "GitHub", npm: "npm", license: "Licencia MIT", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron es de código abierto bajo licencia MIT."
  },
  nf: { text: "Este job programado nunca se disparó — la página que buscas no existe.", back: "← Volver a la página de lanzamiento" }
});

/* ===================== FRANÇAIS ===================== */
DICT.fr = {
  dir: "ltr",
  nav: { features: "Fonctions", how: "Comment ça marche", usecases: "Cas d'usage", gui: "Mission Control", tools: "Outils", faq: "FAQ", contact: "Contact", cta: "Commencer", lang: "Langue" },
  hero: {
    pill: "Disponible sur opencode v2 · v1.0.0",
    titleA: "Tâches planifiées façon ChatGPT,",
    titleGrad: "pour opencode.",
    lede: "Dites à opencode “surveille les sorties concurrentes toutes les 15 minutes” et il continue dans la <b>même session</b> — avec mémoire persistante, même après compaction, même terminal fermé.",
    ctaStart: "Commencer gratuitement", ctaGit: "★ Étoile sur GitHub", copy: "Copier", copied: "Copié !", scroll: "Faites défiler"
  },
  problem: {
    badge: "Le problème", title: "Le cron classique est aveugle.", sub: "Les planificateurs classiques lancent un script et oublient. opencode-cron relance un agent intelligent avec mémoire et jugement.",
    badTitle: "😵 Cron classique / boucles bash",
    bad1: "Lance des scripts isolés — zéro contexte",
    bad2: "État de la conversation effacé à la compaction",
    bad3: "Répète la même alerte à chaque tick",
    bad4: "Peut boucler à l'infini et brûler vos tokens",
    bad5: "Terminal seul, à éplucher des syslog obscurs",
    goodTitle: "⚡ opencode-cron",
    good1: "Re-prompt la même session avec tout l'historique",
    good2: "Le hook de compaction réinjecte la mémoire",
    good3: "Le dedup seenHashes évite les alertes répétées",
    good4: "Min 60s, jitter, maxRuns et disjoncteur 5 échecs",
    good5: "Web GUI Mission Control + frise d'exécution"
  },
  features: {
    badge: "Atouts", title: "Pourquoi opencode-cron ?", sub: "Un planificateur d'agents IA intelligent — pas un crontab de plus.",
    f1t: "La même conversation, à chaque tick", f1d: "Il re-prompt le même sessionID avec tout l'historique — pas un appel CLI détaché.",
    f2t: "Mémoire markdown persistente", f2d: "Survit aux compactions, redémarrages et reboots. Suit seenHashes pour stopper les notifications répétitives.",
    f3t: "Web GUI Mission Control", f3d: "Un tableau de bord sombre élégant sur localhost:4488 avec chat en direct, moniteurs de jobs et contrôles instantanés.",
    f4t: "App bureau multiplateforme", f4d: "Installeurs natifs macOS, Windows et Linux avec barre système affichant l'état cron en temps réel.",
    f5t: "Liaison de planning en 1 clic", f5d: "Liez une planification récurrente à n'importe quelle conversation avec aperçus visuels.",
    f6t: "Frise d'exécution", f6d: "Visibilité totale sur chaque tick : durée, statut, codes de sortie, source et logs d'erreur.",
    f7t: "Suite 10 langues", f7d: "English, Italiano, Español, Français, Deutsch, Português, 中文, 日本語, Русский et العربية avec RTL.",
    f8t: "Daemon autonome", f8d: "Tourne toute la nuit TUI fermé via launchd, systemd ou schtasks natifs."
  },
  how: {
    badge: "Architecture", title: "Comment ça marche", sub: "Quatre étapes d'un job planifié à un tick intelligent et conscient de la mémoire.",
    s1t: "Planifier", s1d: "cron_add stocke un job dans jobs.json plus un fichier mémoire — lié à votre session.",
    s2t: "Déclencher", s2d: "Un timer en processus (ou un daemon OS de 60s TUI fermé) réveille le job dû.",
    s3t: "Mémoriser", s3d: "Le tick injecte objectif figé + mémoire + auto-contrôle à 3 questions + votre suivi.",
    s4t: "Agir", s4d: "La même session continue ; les trouvailles persistent en markdown et se dédupliquent via seenHashes."
  },
  compare: {
    badge: "Comparaison", title: "Cron classique vs opencode-cron", sub: "Utilisez le cron classique pour du shell pur. Utilisez opencode-cron quand la tâche demande du jugement à chaque run.",
    colFeat: "Fonction", colCron: "Cron classique / bash", colOC: "opencode-cron",
    r1f: "Conscience de session", r1c: "Scripts isolés et aveugles", r1o: "Re-prompt la même session",
    r2f: "Sûr à la compaction", r2c: "Effacé à la compaction", r2o: "Hook réinjecte la mémoire",
    r3f: "Déduplication", r3c: "Répète à chaque tick", r3o: "Dedup seenHashes",
    r4f: "Protection boucle/tokens", r4c: "Boucle, brûle les tokens", r4o: "Min 60s + pause 5 échecs",
    r5f: "Interface", r5c: "Terminal / fichier crontab", r5o: "Web GUI Mission Control",
    r6f: "Observabilité", r6c: "Éplucher syslog", r6o: "Frise /runs dédiée",
    r7f: "Multilingue", r7c: "Anglais seul / rien", r7o: "10 langues + visite"
  },
};

Object.assign(DICT.fr, {
  usecases: {
    badge: "Modèles", title: "Cas d'usage réels", sub: "Des modèles prêts qui continuent de travailler pendant votre sommeil.",
    u1t: "Gardien de dépôt", u1f: "toutes les 30m", u1d: "Lance les tests, vérifie git status, signale les nouveaux TODO et ne rapporte que les diffs.",
    u2t: "Veille news IA & X", u2f: "toutes les 5–15m", u2d: "Surveille les sorties IA, enregistre des digests structurés, déduplique via seenHashes.",
    u3t: "Chien de garde CI flaky", u3f: "toutes les 10m", u3d: "Relance la CI en échec, compile des matrices d'erreur et alerte à la résolution.",
    u4t: "Moniteur de prix", u4f: "toutes les 1h", u4d: "Scrape les pages de prix, calcule les diffs et signale les anomalies.",
    u5t: "Triage leads & inbox", u5f: "toutes les 30m", u5d: "Filtre les emails prioritaires et résume les actions clés en markdown."
  },
  gui: {
    badge: "Mission Control", title: "Un vrai tableau de bord pour vos agents", sub: "Gérez toute votre flotte d'automatisation depuis une Web GUI sombre et élégante.",
    m1: "Matrice cron active", m1d: "Compteurs en direct, résultats du dernier tick, compte à rebours et toggles pause/reprise.",
    m2: "Flux de sessions", m2d: "Lisez les chats actifs et archivés en temps réel avec auto-rafraîchissement et surlignage de diff.",
    m3: "Studio mémoire", m3d: "Visualisez et éditez la mémoire markdown par job sans toucher aux fichiers.",
    m4: "Historique d'exécution", m4d: "Une frise en direct des succès, échecs, sauts et latences avec traces d'erreur.",
    sidebar: { mission: "Mission Control", runs: "Frise d'exécution", memory: "Studio mémoire", guide: "Guide interactif", sessions: "Sessions" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "suivant"
  },
  desktop: {
    badge: "Partout", title: "App bureau + barre système", sub: "Une app native installable qui reste discrète et garde vos jobs en vie.",
    mac: "macOS", macd: ".dmg universel — Apple Silicon & Intel", win: "Windows", wind: "Installeur NSIS & .exe portable", linux: "Linux", linuxd: "Paquets .AppImage et .deb"
  },
  tools: {
    badge: "Pour les agents", title: "9 outils natifs + 5 commandes slash", sub: "Les agents équipés d'opencode-cron obtiennent des primitives de planification de premier ordre.",
    t1: "Crée une tâche récurrente liée à la session courante", t2: "Liste tous les jobs actifs et en pause", t3: "Inspecte l'état et les métadonnées du job",
    t4: "Met un job en pause", t5: "Reprend un job en pause", t6: "Supprime un job et sa mémoire persistante",
    t7: "Déclenche un tick de test immédiat", t8: "Lit la mémoire markdown persistante", t9: "Persiste les trouvailles et met à jour seenHashes",
    s1: "/cron-add — assistant de planification interactif", s2: "/cron-list — inspecte jobs et prochaines exécutions", s3: "/cron-manage — pause, reprise ou suppression",
    s4: "/cron-gui — lance la Web GUI", s5: "/cron-refresh — resynchronise les identifiants pivotés"
  },
  stats: { s1: "10", s1l: "Langues", s2: "9", s2l: "Outils natifs", s3: "3", s3l: "Plateformes bureau", s4: "60s", s4l: "Intervalle minimum" },
  cta: { title: "Donnez un planning à votre agent.", sub: "Installez le plugin, dites-le, et laissez opencode-cron travailler en arrière-plan — en sécurité.", btn1: "Commencer gratuitement", btn2: "Lire la doc" },
});

Object.assign(DICT.fr, {
  faq: {
    badge: "FAQ", title: "Questions fréquentes", sub: "Tout ce qu'il faut savoir avant de planifier votre premier job.",
    q1: "Qu'est-ce qu'opencode-cron exactement ?", a1: "C'est un plugin open-source qui apporte les Tâches Planifiées façon ChatGPT à opencode. Contrairement au cron classique, il re-prompt la même session IA à chaque tick avec une mémoire markdown persistante : l'agent garde le contexte, déduplique les alertes et évite de brûler des tokens.",
    q2: "En quoi diffère-t-il d'un crontab ?", a2: "Un crontab exécute un script shell aveugle sans contexte. opencode-cron exécute un agent intelligent dans votre session existente, injecte un objectif figé + mémoire + auto-contrôle, et persiste ce qu'il apprend — protégé par un minimum de 60s, des verrous atomiques et un disjoncteur à 5 échecs.",
    q3: "Continue-t-il de tourner si je ferme le terminal ?", a3: "Oui. Le mode TUI fermé installe un ticker natif de 60 secondes via launchd (macOS), systemd (Linux) ou schtasks (Windows) qui exécute les jobs dus en headless sous un verrou atomique.",
    q4: "Que devient la mémoire quand le chat compacte ?", a4: "opencode-cron s'accroche à l'événement de compaction et réinjecte le fichier mémoire du job dans le résumé. L'historique peut compacter, mais la mémoire markdown est la source de vérité et ne compacte jamais.",
    q5: "Comment les coûts et boucles folles sont-ils protégés ?", a5: "Chaque job a un intervalle minimum de 60s, jusqu'à 10% de jitter, un plafond maxRuns optionnel, un verrou skip-if-running et une auto-pause après 5 échecs consécutifs — un job cassé ne peut jamais boucler à l'infini.",
    q6: "Est-ce gratuit et open source ?", a6: "Oui — licence MIT, publié sur npm sous @culturedigitali/opencode-cron et maintenu par Culture Digitali Srl."
  },
  contact: {
    badge: "Contact", title: "Nous contacter", sub: "Questions, besoins entreprise ou juste un bonjour ? Nous répondons en général en un jour.",
    name: "Votre nom", email: "Votre email", subject: "Sujet", message: "Message", send: "Envoyer", sending: "Envoi…",
    sent: "Merci ! Votre message est en route.", err: "Une erreur est survenue. Écrivez-nous directement.", needMsg: "Remplissez tous les champs.",
    direct: "Ou écrivez directement", repo: "Dépôt", issues: "Signaler un bug", consent: "Vos données ne servent qu'à vous répondre."
  },
  credits: { title: "Créé par", company: "Culture Digitali Srl", companyDesc: "Studio italien créant des outils développeur AI-native et de l'automatisation.", dev: "Luigi Strazzullo", devRole: "Créateur & développateur principal d'opencode-cron" },
  footer: {
    tagline: "Tâches Planifiées façon ChatGPT pour opencode — cron lié à la session + mémoire persistente pour agents IA.",
    product: "Produit", resources: "Ressources", community: "Communauté",
    docs: "Documentation", quickstart: "Démarrage 30 secondes", examples: "Exemples", how: "Comment ça marche", troubleshoot: "Dépannage", comparison: "vs cron classique",
    github: "GitHub", npm: "npm", license: "Licence MIT", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron est open source sous licence MIT."
  },
  nf: { text: "Ce job planifié ne s'est jamais déclenché — la page recherchée n'existe pas.", back: "← Retour à la page de lancement" }
});


/* ===================== DEUTSCH ===================== */
DICT.de = {
  dir: "ltr",
  nav: { features: "Funktionen", how: "So funktioniert's", usecases: "Anwendungsfälle", gui: "Mission Control", tools: "Werkzeuge", faq: "FAQ", contact: "Kontakt", cta: "Loslegen", lang: "Sprache" },
  hero: {
    pill: "Jetzt live auf opencode v2 · v1.0.0",
    titleA: "Geplante Aufgaben im ChatGPT-Stil,",
    titleGrad: "für opencode.",
    lede: "Sag opencode „beobachte alle 15 Minuten die Releases der Konkurrenz“ und es läuft in der <b>gleichen Sitzung</b> weiter — mit persistentem Speicher, sogar nach Kontext-Kompaktierung, sogar bei geschlossenem Terminal.",
    ctaStart: "Kostenlos loslegen", ctaGit: "★ Stern auf GitHub", copy: "Kopieren", copied: "Kopiert!", scroll: "Zum Entdecken scrollen"
  },
  problem: {
    badge: "Das Problem", title: "Klassisches Cron ist blind.", sub: "Klassische Scheduler starten ein Skript und vergessen. opencode-cron führt einen intelligenten Agenten mit Gedächtnis und Urteilsvermögen erneut aus.",
    badTitle: "😵 Klassisches Cron / Bash-Schleifen",
    bad1: "Startet blinde Einweg-Skripte — null Kontext",
    bad2: "Gesprächszustand bei Kompaktierung gelöscht",
    bad3: "Wiederholt bei jedem Tick dieselbe Warnung",
    bad4: "Kann unendlich loopen und Tokens verbrennen",
    bad5: "Nur Terminal, kryptische Syslogs durchsuchen",
    goodTitle: "⚡ opencode-cron",
    good1: "Promptet dieselbe Sitzung mit kompletter Historie erneut",
    good2: "Der Kompaktierungs-Hook injiziert den Speicher neu",
    good3: "seenHashes-Dedup verhindert wiederholte Warnungen",
    good4: "Min 60s, Jitter, maxRuns und 5-Fehler-Schutzschalter",
    good5: "Mission-Control-Web-GUI + Ausführungs-Timeline"
  },
  features: {
    badge: "Stärken", title: "Warum opencode-cron?", sub: "Ein intelligenter KI-Agenten-Scheduler — nicht noch ein Crontab.",
    f1t: "Dasselbe Gespräch, bei jedem Tick", f1d: "Es promptet dieselbe sessionID mit voller Historie erneut — kein abgetrennter CLI-Aufruf.",
    f2t: "Persistenter Markdown-Speicher", f2d: "Überlebt Kompaktierung, Neustarts und Reboots. Verfolgt seenHashes gegen wiederholte Meldungen.",
    f3t: "Mission-Control-Web-GUI", f3d: "Ein elegantes Dark-Dashboard auf localhost:4488 mit Live-Chat, Job-Monitoren und Sofort-Steuerung.",
    f4t: "Plattformübergreifende Desktop-App", f4d: "Native Installer für macOS, Windows und Linux mit System-Tray, das den Cron-Status live zeigt.",
    f5t: "1-Klick-Plan-Bindung", f5d: "Binde einen wiederkehrenden Plan an jedes Gespräch — mit visuellen Vorschauen.",
    f6t: "Ausführungs-Timeline", f6d: "Volle Transparenz pro Tick: Dauer, Status, Exit-Codes, Auslöser und Fehler-Logs.",
    f7t: "10-Sprachen-Suite", f7d: "English, Italiano, Español, Français, Deutsch, Português, 中文, 日本語, Русский und العربية mit RTL.",
    f8t: "Autonomer Daemon", f8d: "Läuft über Nacht bei geschlossenem TUI via nativem launchd, systemd oder schtasks."
  },
  how: {
    badge: "Architektur", title: "So funktioniert's", sub: "Vier Schritte von einem geplanten Job zu einem intelligenten, speicherbewussten Tick.",
    s1t: "Planen", s1d: "cron_add speichert einen Job in jobs.json plus eine Speicherdatei — an deine Sitzung gebunden.",
    s2t: "Auslösen", s2d: "Ein In-Prozess-Timer (oder ein 60s-OS-Daemon bei geschlossenem TUI) weckt den fälligen Job.",
    s3t: "Erinnern", s3d: "Der Tick injiziert fixiertes Ziel + Speicher + 3-Fragen-Selbstcheck + deinen Folge-Prompt.",
    s4t: "Handeln", s4d: "Dieselbe Sitzung läuft weiter; Erkenntnisse persistieren in Markdown und dedupen via seenHashes."
  },
  compare: {
    badge: "Vergleich", title: "Klassisches Cron vs opencode-cron", sub: "Nutze klassisches Cron für reine Shell-Arbeit. Nutze opencode-cron, wenn die Aufgabe bei jedem Lauf Urteil erfordert.",
    colFeat: "Funktion", colCron: "Klassisches Cron / Bash", colOC: "opencode-cron",
    r1f: "Sitzungs-Bewusstsein", r1c: "Blinde Einweg-Skripte", r1o: "Promptet dieselbe Sitzung erneut",
    r2f: "Kompaktierungs-sicher", r2c: "Bei Kompaktierung gelöscht", r2o: "Hook injiziert Speicher neu",
    r3f: "Deduplizierung", r3c: "Wiederholt jeden Tick", r3o: "seenHashes-Dedup",
    r4f: "Loop-/Token-Schutz", r4c: "Loopt, verbrennt Tokens", r4o: "Min 60s + 5-Fehler-Pause",
    r5f: "Oberfläche", r5c: "Terminal / Crontab-Datei", r5o: "Web-GUI Mission Control",
    r6f: "Beobachtbarkeit", r6c: "Syslogs durchsuchen", r6o: "Eigene /runs-Timeline",
    r7f: "Mehrsprachig", r7c: "Nur Englisch / keine", r7o: "10 Sprachen + Tour"
  },
};

Object.assign(DICT.de, {
  usecases: {
    badge: "Vorlagen", title: "Praxis-Anwendungsfälle", sub: "Fertige Vorlagen, die weiterarbeiten, während du schläfst.",
    u1t: "Repo-Wächter", u1f: "alle 30m", u1d: "Führt Tests aus, prüft git status, markiert neue TODOs und meldet nur Diffs.",
    u2t: "KI-News- & X-Beobachter", u2f: "alle 5–15m", u2d: "Überwacht KI-Releases, speichert strukturierte Digests, deduped via seenHashes.",
    u3t: "CI-Flaky-Wachhund", u3f: "alle 10m", u3d: "Wiederholt fehlgeschlagene CI, erstellt Fehler-Matrizen und meldet bei Lösung.",
    u4t: "Preis-Monitor", u4f: "alle 1h", u4d: "Scrapt Preisseiten, berechnet Diffs und meldet Anomalien.",
    u5t: "Lead- & Inbox-Triage", u5f: "alle 30m", u5d: "Filtert priorisierte E-Mails und fasst Kernaktionen in Markdown zusammen."
  },
  gui: {
    badge: "Mission Control", title: "Ein echtes Dashboard für deine Agenten", sub: "Verwalte deine gesamte Automatisierungs-Flotte aus einem eleganten Dark-Web-GUI.",
    m1: "Aktive Cron-Matrix", m1d: "Live-Zähler, letzte Tick-Ergebnisse, Countdown zum nächsten Lauf und Pause/Fortsetzen.",
    m2: "Live-Sitzungs-Stream", m2d: "Lies aktive und archivierte Chats in Echtzeit mit Auto-Refresh und Diff-Hervorhebung.",
    m3: "Speicher-Studio", m3d: "Sieh und bearbeite Markdown-Speicher pro Job, ohne Dateien anzufassen.",
    m4: "Ausführungs-Verlauf", m4d: "Eine Live-Timeline von Erfolgen, Fehlern, Skips und Latenzen mit Fehler-Traces.",
    sidebar: { mission: "Mission Control", runs: "Ausführungs-Timeline", memory: "Speicher-Studio", guide: "Interaktive Anleitung", sessions: "Sitzungen" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "nächster"
  },
  desktop: {
    badge: "Überall", title: "Desktop-App + System-Tray", sub: "Eine native installierbare App, die dich nicht stört und deine Jobs am Leben hält.",
    mac: "macOS", macd: "Universelle .dmg — Apple Silicon & Intel", win: "Windows", wind: "NSIS-Installer & portable .exe", linux: "Linux", linuxd: ".AppImage- & .deb-Pakete"
  },
  tools: {
    badge: "Für Agenten", title: "9 native Werkzeuge + 5 Slash-Befehle", sub: "Agenten mit opencode-cron erhalten erstklassige Planungs-Primitive.",
    t1: "Erstellt eine wiederkehrende Aufgabe an die aktuelle Sitzung gebunden", t2: "Listet alle aktiven und pausierten Jobs",
    t3: "Prüft detaillierten Job-Status und Metadaten", t4: "Pausiert einen Job vorübergehend", t5: "Setzt einen pausierten Job fort",
    t6: "Löscht einen Job und seinen persistenten Speicher", t7: "Löst sofort einen Test-Tick aus", t8: "Liest den persistenten Markdown-Speicher",
    t9: "Persistiert Erkenntnisse und aktualisiert seenHashes",
    s1: "/cron-add — interaktiver Planungs-Assistent", s2: "/cron-list — Jobs und nächste Läufe prüfen", s3: "/cron-manage — pausieren, fortsetzen, löschen",
    s4: "/cron-gui — startet das Web-GUI", s5: "/cron-refresh — rotierte Zugangsdaten neu syncen"
  },
  stats: { s1: "10", s1l: "Sprachen", s2: "9", s2l: "Native Werkzeuge", s3: "3", s3l: "Desktop-Plattformen", s4: "60s", s4l: "Mindestintervall" },
  cta: { title: "Gib deinem Agenten einen Zeitplan.", sub: "Installiere das Plugin, sag es, und lass opencode-cron im Hintergrund weiterarbeiten — sicher.", btn1: "Kostenlos loslegen", btn2: "Doku lesen" },
});

Object.assign(DICT.de, {
  faq: {
    badge: "FAQ", title: "Häufige Fragen", sub: "Alles, was du vor deinem ersten geplanten Job wissen musst.",
    q1: "Was genau ist opencode-cron?", a1: "Es ist ein Open-Source-Plugin, das geplante Aufgaben im ChatGPT-Stil zu opencode bringt. Anders als klassisches Cron promptet es bei jedem Tick dieselbe KI-Sitzung mit persistentem Markdown-Speicher erneut — der Agent behält Kontext, deduped Warnungen und vermeidet Token-Verbrennung.",
    q2: "Wie unterscheidet es sich von einem Crontab?", a2: "Ein Crontab führt ein blindes Shell-Skript ohne Kontext aus. opencode-cron führt einen intelligenten Agenten in deiner bestehenden Sitzung aus, injiziert fixiertes Ziel + Speicher + Selbstcheck und persistiert Gelerntes — geschützt durch 60s-Minimum, atomare Locks und einen 5-Fehler-Schutzschalter.",
    q3: "Läuft es weiter, wenn ich das Terminal schließe?", a3: "Ja. Der TUI-geschlossen-Pfad installiert einen nativen 60-Sekunden-Ticker via launchd (macOS), systemd (Linux) oder schtasks (Windows), der fällige Jobs headless unter einem atomaren Lock ausführt.",
    q4: "Was passiert mit dem Speicher bei Chat-Kompaktierung?", a4: "opencode-cron hängt sich an das Kompaktierungs-Ereignis und injiziert die Speicherdatei des Jobs in die Zusammenfassung. Der Chat-Verlauf kann kompaktieren, aber der Markdown-Speicher ist die Quelle der Wahrheit und kompaktiert nie.",
    q5: "Wie werden Kosten und Runaway-Loops geschützt?", a5: "Jeder Job hat ein 60s-Mindestintervall, bis zu 10% Jitter, ein optionales maxRuns-Limit, ein Skip-if-Running-Lock und eine Auto-Pause nach 5 aufeinanderfolgenden Fehlern — ein kaputter Job kann nie unendlich loopen.",
    q6: "Ist es kostenlos und Open Source?", a6: "Ja — MIT-lizenziert, auf npm als @culturedigitali/opencode-cron veröffentlicht und von Culture Digitali Srl gepflegt."
  },
  contact: {
    badge: "Kontakt", title: "Kontakt aufnehmen", sub: "Fragen, Enterprise-Bedarf oder einfach Hallo? Wir antworten meist innerhalb eines Tages.",
    name: "Dein Name", email: "Deine E-Mail", subject: "Betreff", message: "Nachricht", send: "Nachricht senden", sending: "Senden…",
    sent: "Danke! Deine Nachricht ist unterwegs.", err: "Etwas ging schief. Schreib uns direkt.", needMsg: "Bitte alle Felder ausfüllen.",
    direct: "Oder direkt mailen", repo: "Repository", issues: "Fehler melden", consent: "Deine Daten werden nur zur Antwort verwendet."
  },
  credits: { title: "Gebaut von", company: "Culture Digitali Srl", companyDesc: "Italienisches Studio für KI-native Entwickler-Tools und Automatisierung.", dev: "Luigi Strazzullo", devRole: "Schöpfer & Lead-Entwickler von opencode-cron" },
  footer: {
    tagline: "Geplante Aufgaben im ChatGPT-Stil für opencode — sitzungsgebundenes Cron + persistenter Speicher für KI-Agenten.",
    product: "Produkt", resources: "Ressourcen", community: "Community",
    docs: "Dokumentation", quickstart: "30-Sekunden-Quickstart", examples: "Beispiele", how: "So funktioniert's", troubleshoot: "Fehlerbehebung", comparison: "vs klassisches Cron",
    github: "GitHub", npm: "npm", license: "MIT-Lizenz", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron ist Open Source unter der MIT-Lizenz."
  },
  nf: { text: "Dieser geplante Job wurde nie ausgelöst — die gesuchte Seite existiert nicht.", back: "← Zurück zur Startseite" }
});


/* ===================== PORTUGUÊS ===================== */
DICT.pt = {
  dir: "ltr",
  nav: { features: "Recursos", how: "Como funciona", usecases: "Casos de uso", gui: "Mission Control", tools: "Ferramentas", faq: "FAQ", contact: "Contato", cta: "Começar", lang: "Idioma" },
  hero: {
    pill: "Disponível no opencode v2 · v1.0.0",
    titleA: "Tarefas agendadas estilo ChatGPT,",
    titleGrad: "para opencode.",
    lede: "Diga ao opencode “fique de olho nos lançamentos dos concorrentes a cada 15 minutos” e ele continua na <b>mesma sessão</b> — com memória persistente, mesmo após compactação de contexto, mesmo com o terminal fechado.",
    ctaStart: "Comece grátis", ctaGit: "★ Estrela no GitHub", copy: "Copiar", copied: "Copiado!", scroll: "Role para explorar"
  },
  problem: {
    badge: "O problema", title: "O cron comum é cego.", sub: "Agendadores clássicos rodam um script e esquecem. opencode-cron reexecuta um agente inteligente com memória e julgamento.",
    badTitle: "😵 Cron comum / loops bash",
    bad1: "Roda scripts isolados — zero contexto",
    bad2: "Estado da conversação apagado na compactação",
    bad3: "Repete o mesmo alerta a cada tick",
    bad4: "Pode loopar infinito e queimar seus tokens",
    bad5: "Só terminal, garimpando syslogs obscuros",
    goodTitle: "⚡ opencode-cron",
    good1: "Re-prompt a mesma sessão com todo o histórico",
    good2: "O hook de compactação reinjeta a memória",
    good3: "O dedup seenHashes evita alertas repetidos",
    good4: "Mín 60s, jitter, maxRuns e disjuntor 5-falhas",
    good5: "Web GUI Mission Control + linha do tempo"
  },
  features: {
    badge: "Pontos fortes", title: "Por que opencode-cron?", sub: "Um agendador de agentes de IA inteligente — não mais um crontab.",
    f1t: "A mesma conversa, a cada tick", f1d: "Ele re-prompt o mesmo sessionID com todo o histórico — não uma chamada CLI destacada.",
    f2t: "Memória markdown persistente", f2d: "Sobrevive a compactações, reinícios e reboots. Rastreia seenHashes para parar notificações repetitivas.",
    f3t: "Web GUI Mission Control", f3d: "Um painel dark elegante em localhost:4488 com chat ao vivo, monitores de jobs e controles instantâneos.",
    f4t: "App de desktop multiplataforma", f4d: "Instaladores nativos para macOS, Windows e Linux com bandeja do sistema mostrando o status em tempo real.",
    f5t: "Vínculo de agendamento em 1 clique", f5d: "Ligue um agendamento recorrente a qualquer conversa com prévias visuais.",
    f6t: "Linha do tempo de execução", f6d: "Visibilidade total de cada tick: duração, status, códigos de saída, origem e logs de erro.",
    f7t: "Suíte de 10 idiomas", f7d: "English, Italiano, Español, Français, Deutsch, Português, 中文, 日本語, Русский e العربية com RTL.",
    f8t: "Daemon autônomo", f8d: "Roda a noite toda com o TUI fechado via launchd, systemd ou schtasks nativos."
  },
  how: {
    badge: "Arquitetura", title: "Como funciona", sub: "Quatro passos de um job agendado a um tick inteligente e consciente da memória.",
    s1t: "Agendar", s1d: "cron_add guarda um job em jobs.json mais um arquivo de memória — ligado à sua sessão.",
    s2t: "Disparar", s2d: "Um timer em processo (ou um daemon OS de 60s com o TUI fechado) acorda o job devido.",
    s3t: "Lembrar", s3d: "O tick injeta objetivo congelado + memória + autochecagem de 3 perguntas + seu follow-up.",
    s4t: "Agir", s4d: "A mesma sessão continua; achados persistem em markdown e deduplicam via seenHashes."
  },
  compare: {
    badge: "Comparação", title: "Cron comum vs opencode-cron", sub: "Use cron comum para trabalho shell puro. Use opencode-cron quando a tarefa precisa de julgamento a cada execução.",
    colFeat: "Recurso", colCron: "Cron comum / bash", colOC: "opencode-cron",
    r1f: "Consciência de sessão", r1c: "Scripts isolados e cegos", r1o: "Re-prompt a mesma sessão",
    r2f: "Seguro na compactação", r2c: "Apagado na compactação", r2o: "Hook reinjeta memória",
    r3f: "Deduplicação", r3c: "Repete a cada tick", r3o: "Dedup seenHashes",
    r4f: "Proteção loop/tokens", r4c: "Looopea, queima tokens", r4o: "Mín 60s + pausa 5-falhas",
    r5f: "Interface", r5c: "Terminal / arquivo crontab", r5o: "Web GUI Mission Control",
    r6f: "Observabilidade", r6c: "Garimpando syslog", r6o: "Linha do tempo /runs",
    r7f: "Multi-idioma", r7c: "Só inglês / nenhum", r7o: "10 idiomas + tour"
  },
};

Object.assign(DICT.pt, {
  usecases: {
    badge: "Modelos", title: "Casos de uso reais", sub: "Modelos prontos que seguem trabalhando enquanto você dorme.",
    u1t: "Guardião de repo", u1f: "a cada 30m", u1d: "Roda testes, verifica git status, marca novos TODOs e reporta só diferenças.",
    u2t: "Vigia de notícias IA & X", u2f: "a cada 5–15m", u2d: "Monitora lançamentos de IA, salva digests estruturados, deduplica com seenHashes.",
    u3t: "Vigia de CI flaky", u3f: "a cada 10m", u3d: "Roda de novo a CI que falha, compila matrizes de erro e avisa ao resolver.",
    u4t: "Monitor de preços", u4f: "a cada 1h", u4d: "Extrai páginas de preços, calcula diferenças e reporta anomalias.",
    u5t: "Triagem de leads e inbox", u5f: "a cada 30m", u5d: "Filtra e-mails prioritários e resume ações-chave em markdown."
  },
  gui: {
    badge: "Mission Control", title: "Um painel de verdade para seus agentes", sub: "Gerencie toda sua frota de automação por uma Web GUI dark e elegante.",
    m1: "Matriz cron ativa", m1d: "Contadores ao vivo, resultados do último tick, contagem regressiva e toggles pausar/retomar.",
    m2: "Stream de sessões", m2d: "Leia chats ativas e arquivadas em tempo real com auto-refresh e destaque de diff.",
    m3: "Estúdio de memória", m3d: "Veja e edite a memória markdown por job sem tocar em arquivos.",
    m4: "Histórico de execução", m4d: "Uma linha do tempo ao vivo de sucessos, falhas, pulos e latências com rastros de erro.",
    sidebar: { mission: "Mission Control", runs: "Linha do tempo", memory: "Estúdio de memória", guide: "Guia interativo", sessions: "Sessões" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "próx"
  },
  desktop: {
    badge: "Em todo lugar", title: "App de desktop + bandeja", sub: "Um app nativo instalável que fica fora do caminho e mantém seus jobs vivos.",
    mac: "macOS", macd: ".dmg universal — Apple Silicon & Intel", win: "Windows", wind: "Instalador NSIS & .exe portátil", linux: "Linux", linuxd: "Pacotes .AppImage e .deb"
  },
  tools: {
    badge: "Para agentes", title: "9 ferramentas nativas + 5 comandos slash", sub: "Agentes com opencode-cron ganham primitivas de agendamento de primeira classe.",
    t1: "Cria uma tarefa recorrente ligada à sessão atual", t2: "Lista todos os jobs ativos e pausados", t3: "Inspeciona estado e metadados do job",
    t4: "Pausa temporariamente um job", t5: "Retoma um job pausado", t6: "Deleta um job e sua memória persistente",
    t7: "Dispara um tick de teste imediato", t8: "Lê a memória markdown persistente", t9: "Persiste achados e atualiza seenHashes",
    s1: "/cron-add — assistente de agendamento interativo", s2: "/cron-list — inspeciona jobs e próximas execuções", s3: "/cron-manage — pausar, retomar ou deletar",
    s4: "/cron-gui — inicia a Web GUI", s5: "/cron-refresh — resincroniza credenciais rotacionadas"
  },
  stats: { s1: "10", s1l: "Idiomas", s2: "9", s2l: "Ferramentas nativas", s3: "3", s3l: "Plataformas desktop", s4: "60s", s4l: "Intervalo mínimo" },
  cta: { title: "Dê um agendamento ao seu agente.", sub: "Instale o plugin, diga a frase, e deixe o opencode-cron trabalhar em segundo plano — com segurança.", btn1: "Comece grátis", btn2: "Leia a documentação" },
});

Object.assign(DICT.pt, {
  faq: {
    badge: "FAQ", title: "Perguntas frequentes", sub: "Tudo que você precisa saber antes de agendar seu primeiro job.",
    q1: "O que é exatamente opencode-cron?", a1: "É um plugin de código aberto que traz Tarefas Agendadas estilo ChatGPT para o opencode. Diferente do cron comum, ele re-prompt a mesma sessão de IA a cada tick com memória markdown persistente, então o agente mantém contexto, deduplica alertas e evita queimar tokens.",
    q2: "Como difere de um crontab?", a2: "Um crontab roda um script shell cego sem contexto. opencode-cron roda um agente inteligente dentro da sua sessão existente, injeta objetivo congelado + memória + autochecagem, e persiste o que aprende — protegido por mínimo de 60s, locks atômicos e um disjuntor de 5 falhas.",
    q3: "Continua rodando se eu fechar o terminal?", a3: "Sim. O caminho com TUI fechado instala um ticker nativo de 60 segundos via launchd (macOS), systemd (Linux) ou schtasks (Windows) que executa os jobs devidos headless sob um lock atômico.",
    q4: "O que acontece com a memória quando o chat compacta?", a4: "opencode-cron se acopla ao evento de compactação e reinjeta o arquivo de memória do job no resumo. O histórico pode compactar, mas a memória markdown é a fonte da verdade e nunca compacta.",
    q5: "Como custos e loops são protegidos?", a5: "Cada job tem intervalo mínimo de 60s, até 10% de jitter, um teto maxRuns opcional, um lock skip-if-running e auto-pausa após 5 falhas consecutivas — um job quebrado nunca pode loopar infinito.",
    q6: "É grátis e de código aberto?", a6: "Sim — licença MIT, publicado no npm como @culturedigitali/opencode-cron e mantido pela Culture Digitali Srl."
  },
  contact: {
    badge: "Contato", title: "Entre em contato", sub: "Dúvidas, necessidades enterprise ou só um oi? Costumamos responder em um dia.",
    name: "Seu nome", email: "Seu email", subject: "Assunto", message: "Mensagem", send: "Enviar mensagem", sending: "Enviando…",
    sent: "Obrigado! Sua mensagem está a caminho.", err: "Algo deu errado. Escreva para nós diretamente.", needMsg: "Preencha todos os campos.",
    direct: "Ou escreva direto", repo: "Repositório", issues: "Reporte um bug", consent: "Seus dados só servem para te responder."
  },
  credits: { title: "Feito por", company: "Culture Digitali Srl", companyDesc: "Estúdio italiano que cria ferramentas de desenvolvimento AI-native e automação.", dev: "Luigi Strazzullo", devRole: "Criador e desenvolvedor líder do opencode-cron" },
  footer: {
    tagline: "Tarefas Agendadas estilo ChatGPT para opencode — cron ligado à sessão + memória persistente para agentes de IA.",
    product: "Produto", resources: "Recursos", community: "Comunidade",
    docs: "Documentação", quickstart: "Início rápido 30 segundos", examples: "Exemplos", how: "Como funciona", troubleshoot: "Solução de problemas", comparison: "vs cron comum",
    github: "GitHub", npm: "npm", license: "Licença MIT", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron é de código aberto sob licença MIT."
  },
  nf: { text: "Este job agendado nunca disparou — a página que você procura não existe.", back: "← Voltar à página de lançamento" }
});


/* ===================== 中文 (Chinese) ===================== */
DICT.zh = {
  dir: "ltr",
  nav: { features: "功能", how: "工作原理", usecases: "应用场景", gui: "任务控制台", tools: "工具", faq: "常见问题", contact: "联系", cta: "开始使用", lang: "语言" },
  hero: {
    pill: "已支持 opencode v2 · v1.0.0",
    titleA: "ChatGPT 式定时任务，",
    titleGrad: "为 opencode 而生。",
    lede: "对 opencode 说“每 15 分钟关注一次竞品发布”，它就会在<b>同一个会话</b>中持续运行——拥有持久记忆，即使上下文压缩、即使关闭终端也不间断。",
    ctaStart: "免费开始", ctaGit: "★ 在 GitHub 标星", copy: "复制", copied: "已复制！", scroll: "向下滚动探索"
  },
  problem: {
    badge: "问题所在", title: "传统 cron 是盲目的。", sub: "传统调度器运行脚本后就遗忘。opencode-cron 会以完整记忆和判断力重新运行一个智能智能体。",
    badTitle: "😵 传统 cron / bash 循环",
    bad1: "运行孤立的一次性脚本——零上下文",
    bad2: "上下文压缩时对话状态被清空",
    bad3: "每次触发都重复相同的告警",
    bad4: "可能无限循环并烧掉你的 token",
    bad5: "仅终端，翻找晦涩的 syslog",
    goodTitle: "⚡ opencode-cron",
    good1: "用完整历史重新提示同一会话",
    good2: "压缩钩子会重新注入记忆文件",
    good3: "seenHashes 去重防止重复告警",
    good4: "最短 60 秒、抖动、maxRuns 和 5 次失败熔断",
    good5: "任务控制台 Web GUI + 执行时间线"
  },
  features: {
    badge: "核心优势", title: "为什么选择 opencode-cron?", sub: "一个智能的 AI 智能体调度器——而不是又一个 crontab。",
    f1t: "每次触发都是同一对话", f1d: "它用完整对话历史重新提示同一 sessionID——而非脱离的 CLI 调用。",
    f2t: "持久化 Markdown 记忆", f2d: "在压缩、重启和重启系统后依然存活。追踪 seenHashes 以阻止重复通知。",
    f3t: "任务控制台 Web GUI", f3d: "位于 localhost:4488 的精致深色仪表盘，含实时聊天、任务监控与即时控制。",
    f4t: "跨平台桌面应用", f4d: "macOS、Windows 和 Linux 原生安装包，带系统托盘实时显示 cron 状态。",
    f5t: "一键绑定定时", f5d: "将循环计划绑定到任何对话，带可视化预览——再也不用手写 cron 表达式。",
    f6t: "执行时间线", f6d: "完整可见每次触发：时长、状态、退出码、来源和错误日志。",
    f7t: "全球 10 语言套件", f7d: "English、Italiano、Español、Français、Deutsch、Português、中文、日本語、Русский 和 العربية（含 RTL）。",
    f8t: "自主守护进程", f8d: "关闭 TUI 后仍通过原生 launchd、systemd 或 schtasks 彻夜运行。"
  },
  how: {
    badge: "架构", title: "工作原理", sub: "从一个定时任务到一个智能、有记忆的触发，共四步。",
    s1t: "定时", s1d: "cron_add 将任务存入 jobs.json 并附带记忆文件——绑定到你的会话。",
    s2t: "触发", s2d: "一个进程内计时器（或 TUI 关闭时的 60 秒 OS 守护进程）唤醒到期的任务。",
    s3t: "记忆", s3d: "触发提示注入冻结目标 + 记忆 + 3 问自检 + 你的后续提示。",
    s4t: "行动", s4d: "同一会话继续；发现持久化到 Markdown 并与 seenHashes 去重。"
  },
  compare: {
    badge: "对比", title: "传统 cron vs opencode-cron", sub: "纯 shell 工作用传统 cron。需要每次判断力的任务用 opencode-cron。",
    colFeat: "特性", colCron: "传统 cron / bash", colOC: "opencode-cron",
    r1f: "会话感知", r1c: "孤立盲目脚本", r1o: "重新提示同一会话",
    r2f: "压缩安全", r2c: "压缩时被清空", r2o: "钩子重新注入记忆",
    r3f: "去重", r3c: "每次触发都重复", r3o: "seenHashes 去重",
    r4f: "循环/token 保护", r4c: "循环、烧 token", r4o: "最短 60 秒 + 5 次失败暂停",
    r5f: "用户界面", r5c: "终端 / crontab 文件", r5o: "Web GUI 任务控制台",
    r6f: "可观测性", r6c: "翻找 syslog", r6o: "专用 /runs 时间线",
    r7f: "多语言", r7c: "仅英语 / 无", r7o: "10 种语言 + 导览"
  },
};

Object.assign(DICT.zh, {
  usecases: {
    badge: "模板", title: "真实应用场景", sub: "开箱即用的模板，在你睡觉时持续工作。",
    u1t: "仓库守护者", u1f: "每 30m", u1d: "运行测试、检查 git status、标记新 TODO，只在有变化时报告。",
    u2t: "AI 新闻与 X 监测", u2f: "每 5–15m", u2d: "监测 AI 发布、保存结构化摘要，用 seenHashes 去重。",
    u3t: "CI 抖动测试看门狗", u3f: "每 10m", u3d: "重试失败的 CI、编译错误矩阵，解决时告警。",
    u4t: "竞品价格监控", u4f: "每 1h", u4d: "抓取定价页、计算差异并报告异常。",
    u5t: "线索与收件箱分类", u5f: "每 30m", u5d: "筛选优先邮件，将关键行动总结为 Markdown。"
  },
  gui: {
    badge: "任务控制台", title: "为你的智能体打造真正的仪表盘", sub: "从精致的深色 Web GUI 管理你的整个自动化机队。",
    m1: "活跃 cron 矩阵", m1d: "实时计数、上次触发结果、下次运行倒计时和暂停/恢复开关。",
    m2: "实时会话流", m2d: "实时读取活跃和归档的聊天，带自动刷新和差异高亮。",
    m3: "记忆工作室", m3d: "直接查看和编辑每个任务的 Markdown 记忆，无需碰文件。",
    m4: "执行历史", m4d: "成功、失败、跳过和延迟的实时时间线，含错误轨迹。",
    sidebar: { mission: "任务控制台", runs: "执行时间线", memory: "记忆工作室", guide: "交互式指南", sessions: "会话" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "下次"
  },
  desktop: {
    badge: "无处不在", title: "桌面应用 + 系统托盘", sub: "一个不碍事的原生可安装应用，让你的任务保持存活。",
    mac: "macOS", macd: "通用 .dmg——Apple Silicon 与 Intel", win: "Windows", wind: "NSIS 安装程序与便携 .exe", linux: "Linux", linuxd: ".AppImage 与 .deb 包"
  },
  tools: {
    badge: "面向智能体", title: "9 个原生工具 + 5 个斜杠命令", sub: "装备了 opencode-cron 的智能体获得一流的调度原语。",
    t1: "创建绑定到当前会话的循环任务", t2: "列出所有活跃和暂停的任务", t3: "检查任务详细状态与元数据",
    t4: "临时暂停任务", t5: "恢复暂停的任务", t6: "删除任务及其持久记忆",
    t7: "立即触发一次测试", t8: "读取持久化 Markdown 记忆", t9: "持久化发现并更新 seenHashes",
    s1: "/cron-add——交互式调度向导", s2: "/cron-list——检查任务与下次运行", s3: "/cron-manage——暂停、恢复或删除",
    s4: "/cron-gui——启动 Web GUI", s5: "/cron-refresh——重新同步轮换的凭据"
  },
  stats: { s1: "10", s1l: "语言", s2: "9", s2l: "原生工具", s3: "3", s3l: "桌面平台", s4: "60s", s4l: "最短间隔" },
  cta: { title: "给你的智能体一个时间表。", sub: "安装插件、说出指令，让 opencode-cron 在后台安全地持续工作。", btn1: "免费开始", btn2: "阅读文档" },
  faq: {
    badge: "常见问题", title: "常见问题", sub: "在调度第一个任务前你需要了解的一切。",
    q1: "opencode-cron 究竟是什么？", a1: "它是一个把 ChatGPT 式定时任务带到 opencode 的开源插件。与传统 cron 不同，它每次触发都用持久化 Markdown 记忆重新提示同一个 AI 会话，因此智能体能保持完整上下文、去重告警并避免烧掉 token。",
    q2: "它与普通 crontab 有何不同？", a2: "crontab 运行没有上下文的盲目 shell 脚本。opencode-cron 在你现有会话内运行一个智能智能体，注入冻结目标 + 记忆 + 自检，并持久化所学——受最短 60 秒、原子锁和 5 次失败熔断保护。",
    q3: "关闭终端后它还会继续运行吗？", a3: "会。TUI 关闭路径会通过 launchd（macOS）、systemd（Linux）或 schtasks（Windows）安装一个原生 60 秒滴答器，在原子锁下以无头方式执行到期任务。",
    q4: "聊天压缩时记忆会怎样？", a4: "opencode-cron 挂接压缩事件，并将任务的记忆文件重新注入压缩摘要。聊天历史可能被压缩，但 Markdown 记忆是唯一事实来源，永不压缩。",
    q5: "如何保护成本和失控循环？", a5: "每个任务有最短 60 秒间隔、最多 10% 抖动、可选的 maxRuns 上限、skip-if-running 锁，以及连续 5 次失败后自动暂停——损坏的任务永远不会无限循环。",
    q6: "它免费且开源吗？", a6: "是的——MIT 许可，在 npm 发布为 @culturedigitali/opencode-cron，由 Culture Digitali Srl 维护。"
  },
  contact: {
    badge: "联系", title: "联系我们", sub: "有疑问、企业需求或只是想打个招呼？我们通常在一天内回复。",
    name: "你的姓名", email: "你的邮箱", subject: "主题", message: "消息", send: "发送消息", sending: "发送中…",
    sent: "谢谢！你的消息已发出。", err: "出了点问题。请直接给我们发邮件。", needMsg: "请填写所有字段。",
    direct: "或直接发邮件", repo: "代码仓库", issues: "报告问题", consent: "你的数据仅用于回复你。"
  },
  credits: { title: "由以下团队打造", company: "Culture Digitali Srl", companyDesc: "打造 AI 原生开发者工具与自动化的意大利工作室。", dev: "Luigi Strazzullo", devRole: "opencode-cron 的创作者与首席开发者" },
  footer: {
    tagline: "为 opencode 打造的 ChatGPT 式定时任务——会话绑定 cron + 面向 AI 智能体的持久记忆。",
    product: "产品", resources: "资源", community: "社区",
    docs: "文档", quickstart: "30 秒快速上手", examples: "示例", how: "工作原理", troubleshoot: "故障排除", comparison: "对比传统 cron",
    github: "GitHub", npm: "npm", license: "MIT 许可", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron 依据 MIT 许可开源。"
  },
  nf: { text: "这个定时任务从未触发——你要找的页面不存在。", back: "← 返回发布页" }
});

/* ===================== 日本語 (Japanese) ===================== */
DICT.ja = {
  dir: "ltr",
  nav: { features: "機能", how: "仕組み", usecases: "ユースケース", gui: "ミッションコントロール", tools: "ツール", faq: "FAQ", contact: "お問い合わせ", cta: "はじめる", lang: "言語" },
  hero: {
    pill: "opencode v2 対応 · v1.0.0",
    titleA: "ChatGPT 風のスケジュールタスク、",
    titleGrad: "opencode のために。",
    lede: "opencode に「15分ごとに競合のリリースを監視して」と言えば、<b>同じセッション</b>で動き続けます——永続メモリ付き。コンテキスト圧縮後も、ターミナルを閉じていても。",
    ctaStart: "無料ではじめる", ctaGit: "★ GitHub でスター", copy: "コピー", copied: "コピーしました！", scroll: "スクロールして探索"
  },
  problem: {
    badge: "課題", title: "普通の cron は盲目です。", sub: "古典的なスケジューラはスクリプトを走らせて忘れます。opencode-cron はメモリと判断力を備えたインテリジェントなエージェントを再実行します。",
    badTitle: "😵 普通の cron / bash ループ",
    bad1: "孤立した使い捨てスクリプトを実行——文脈ゼロ",
    bad2: "コンテキスト圧縮で会話の状態が消える",
    bad3: "毎ティック同じアラートを繰り返す",
    bad4: "無限ループしてトークンを消費しうる",
    bad5: "端末のみ、わかりにくい syslog を漁る",
    goodTitle: "⚡ opencode-cron",
    good1: "全文脈で同じセッションを再プロンプト",
    good2: "圧縮フックがメモリファイルを再注入",
    good3: "seenHashes 重複排除で繰り返しアラートを防止",
    good4: "最短60秒・ジッター・maxRuns・5連続失敗サーキットブレーカー",
    good5: "ミッションコントロール Web GUI + 実行タイムライン"
  },
  features: {
    badge: "強み", title: "なぜ opencode-cron ？", sub: "インテリジェントな AI エージェントスケジューラ——ただの crontab ではありません。",
    f1t: "毎ティック同じ会話", f1d: "完全な会話履歴で同じ sessionID を再プロンプト——切り離された CLI 呼び出しではありません。",
    f2t: "永続 Markdown メモリ", f2d: "圧縮・再起動・再起動後も生き残ります。seenHashes を追跡して繰り返し通知を止めます。",
    f3t: "ミッションコントロール Web GUI", f3d: "localhost:4488 の洗練されたダークダッシュボード。ライブチャット・ジョブ監視・即時操作。",
    f4t: "クロスプラットフォーム Desktop アプリ", f4d: "macOS・Windows・Linux 向けネイティブインストーラ。cron 状態をライブ表示するシステムトレイ付き。",
    f5t: "1クリックでスケジュール紐付け", f5d: "任意の会話に繰り返しスケジュールを紐付け。ビジュアルプレビューで cron 文字列を手書き不要に。",
    f6t: "実行タイムライン", f6d: "各ティックを完全可視化：所要時間・ステータス・終了コード・トリガー元・エラーログ。",
    f7t: "グローバル10言語", f7d: "English・Italiano・Español・Français・Deutsch・Português・中文・日本語・Русский・العربية（RTL対応）。",
    f8t: "自律デーモン", f8d: "TUI を閉じてもネイティブの launchd・systemd・schtasks で一晩中動き続けます。"
  },
  how: {
    badge: "アーキテクチャ", title: "仕組み", sub: "スケジュールされたジョブから、メモリを伴うインテリジェントなティックまでの4ステップ。",
    s1t: "スケジュール", s1d: "cron_add が jobs.json とメモリファイルにジョブを保存——セッションに紐付け。",
    s2t: "発火", s2d: "プロセス内タイマー（TUI クローズ時は60秒 OS デーモン）が期限ジョブを起こします。",
    s3t: "記憶", s3d: "ティックプロンプトが凍結目標＋メモリ＋3問自己チェック＋フォローアップを注入。",
    s4t: "行動", s4d: "同じセッションが継続。知見は Markdown に永続化され seenHashes で重複排除。"
  },
  compare: {
    badge: "比較", title: "普通の cron vs opencode-cron", sub: "純粋なシェル作業には普通の cron。毎回判断が必要なタスクには opencode-cron。",
    colFeat: "機能", colCron: "普通の cron / bash", colOC: "opencode-cron",
    r1f: "セッション認識", r1c: "盲目な使い捨てスクリプト", r1o: "同じセッションを再プロンプト",
    r2f: "圧縮に堅牢", r2c: "圧縮で消える", r2o: "フックがメモリを再注入",
    r3f: "重複排除", r3c: "毎ティック繰り返す", r3o: "seenHashes 重複排除",
    r4f: "ループ/トークン保護", r4c: "ループしトークンを消費", r4o: "最短60秒＋5連続失敗停止",
    r5f: "UI", r5c: "端末 / crontab ファイル", r5o: "Web GUI ミッションコントロール",
    r6f: "可観測性", r6c: "syslog を漁る", r6o: "専用 /runs タイムライン",
    r7f: "多言語", r7c: "英語のみ / なし", r7o: "10言語＋ツアー"
  },
};

Object.assign(DICT.ja, {
  usecases: {
    badge: "テンプレート", title: "実世界のユースケース", sub: "寝ている間も動き続ける、すぐ使えるテンプレート。",
    u1t: "リポジトリガーディアン", u1f: "30分ごと", u1d: "テスト実行・git status 確認・新規 TODO 検出。変化があったときだけ報告。",
    u2t: "AI ニュース＆X ウォッチャー", u2f: "5〜15分ごと", u2d: "AI リリースを監視し、構造化ダイジェストを保存。seenHashes で重複排除。",
    u3t: "CI フレーキー監視", u3f: "10分ごと", u3d: "失敗した CI を再試行し、エラーマトリクスをまとめ、解決時にアラート。",
    u4t: "競合価格モニター", u4f: "1時間ごと", u4d: "価格ページを取得し、差分を計算して異常を報告。",
    u5t: "リード＆受信トレイ仕分け", u5f: "30分ごと", u5d: "優先メールを絞り込み、重要アクションを Markdown に要約。"
  },
  gui: {
    badge: "ミッションコントロール", title: "エージェントのための本物のダッシュボード", sub: "洗練されたダーク Web GUI から自動化艦隊を丸ごと管理。",
    m1: "アクティブ cron マトリクス", m1d: "ライブカウンター・直前ティック結果・次回実行までのカウントダウン・一時停止/再開トグル。",
    m2: "ライブセッションストリーム", m2d: "アクティブ・アーカイブ済みチャットを自動更新と差分ハイライトでリアルタイム表示。",
    m3: "メモリスタジオ", m3d: "ファイルに触れず、ジョブごとの Markdown メモリを表示・編集。",
    m4: "実行履歴", m4d: "成功・失敗・スキップ・遅延をエラートレース付きでライブ表示するタイムライン。",
    sidebar: { mission: "ミッションコントロール", runs: "実行タイムライン", memory: "メモリスタジオ", guide: "対話ガイド", sessions: "セッション" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "次回"
  },
  desktop: {
    badge: "どこでも", title: "デスクトップアプリ＋システムトレイ", sub: "邪魔にならず、ジョブを生かし続けるネイティブのインストール可能アプリ。",
    mac: "macOS", macd: "ユニバーサル .dmg — Apple Silicon & Intel", win: "Windows", wind: "NSIS インストーラ＆ポータブル .exe", linux: "Linux", linuxd: ".AppImage と .deb パッケージ"
  },
  tools: {
    badge: "エージェント向け", title: "9つのネイティブツール＋5つのスラッシュコマンド", sub: "opencode-cron を装備したエージェントは一流のスケジューリングプリミティブを獲得。",
    t1: "現在のセッションに紐づく繰り返しタスクを作成", t2: "アクティブと一時停止中のジョブを一覧",
    t3: "ジョブの状態とメタデータを詳査", t4: "ジョブを一時停止", t5: "一時停止したジョブを再開",
    t6: "ジョブと永続メモリを削除", t7: "即座にテストティックを実行", t8: "永続 Markdown メモリを読み取り",
    t9: "知見を永続化し seenHashes を更新",
    s1: "/cron-add — 対話的なスケジュールウィザード", s2: "/cron-list — ジョブと次回実行を確認", s3: "/cron-manage — 一時停止・再開・削除",
    s4: "/cron-gui — Web GUI を起動", s5: "/cron-refresh — ローテーションされた資格情報を再同期"
  },
  stats: { s1: "10", s1l: "言語", s2: "9", s2l: "ネイティブツール", s3: "3", s3l: "デスクトップ基盤", s4: "60秒", s4l: "最短間隔" },
  cta: { title: "エージェントにスケジュールを。", sub: "プラグインをインストールして言うだけ。opencode-cron が安全にバックグラウンドで動き続けます。", btn1: "無料ではじめる", btn2: "ドキュメントを読む" },
  faq: {
    badge: "FAQ", title: "よくある質問", sub: "最初のジョブをスケジュールする前に知っておくべきこと。",
    q1: "opencode-cron とは何ですか？", a1: "ChatGPT 風のスケジュールタスクを opencode に持ち込むオープンソースプラグインです。普通の cron と違い、毎ティック永続 Markdown メモリで同じ AI セッションを再プロンプトするため、エージェントは文脈を保ち、アラートを重複排除し、トークンを浪費しません。",
    q2: "通常の crontab とどう違いますか？", a2: "crontab は文脈のない盲目のシェルスクリプトを実行します。opencode-cron は既存セッション内でインテリジェントなエージェントを実行し、凍結目標＋メモリ＋自己チェックを注入し、学びを永続化します——最短60秒・原子ロック・5連続失敗サーキットブレーカーで保護。",
    q3: "ターミナルを閉じても動き続けますか？", a3: "はい。TUI クローズ時は launchd（macOS）・systemd（Linux）・schtasks（Windows）でネイティブの60秒ティッカーをインストールし、原子ロックの下で期限ジョブをヘッドレス実行します。",
    q4: "チャットが圧縮されたときメモリは？", a4: "opencode-cron は圧縮イベントにフックし、ジョブのメモリファイルを圧縮サマリーに再注入します。会話履歴は圧縮されても、Markdown メモリは唯一の真実の源であり、圧縮されません。",
    q5: "コストと暴走ループはどう守られますか？", a5: "各ジョブは最短60秒間隔・最大10%ジッター・任意の maxRuns 上限・skip-if-running ロック・5連続失敗後の自動停止を持ちます——壊れたジョブが無限ループすることはありません。",
    q6: "無料でオープンソースですか？", a6: "はい——MIT ライセンス、npm で @culturedigitali/opencode-cron として公開、Culture Digitali Srl が保守。"
  },
  contact: {
    badge: "お問い合わせ", title: "お問い合わせ", sub: "ご質問、エンタープライズ要件、またはひとこと挨拶も。通常1日以内に返信します。",
    name: "お名前", email: "メールアドレス", subject: "件名", message: "メッセージ", send: "送信", sending: "送信中…",
    sent: "ありがとうございます！メッセージを送信しました。", err: "問題が発生しました。直接メールしてください。", needMsg: "すべての項目を入力してください。",
    direct: "または直接メール", repo: "リポジトリ", issues: "バグ報告", consent: "データは返信のみに使用します。"
  },
  credits: { title: "開発", company: "Culture Digitali Srl", companyDesc: "AI ネイティブな開発者ツールと自動化を手がけるイタリアのスタジオ。", dev: "Luigi Strazzullo", devRole: "opencode-cron の作者・リード開発者" },
  footer: {
    tagline: "opencode のための ChatGPT 風スケジュールタスク——セッション紐付け cron ＋ AI エージェント向け永続メモリ。",
    product: "製品", resources: "リソース", community: "コミュニティ",
    docs: "ドキュメント", quickstart: "30秒クイックスタート", examples: "例", how: "仕組み", troubleshoot: "トラブルシューティング", comparison: "普通の cron と比較",
    github: "GitHub", npm: "npm", license: "MIT ライセンス", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron は MIT ライセンスのオープンソースです。"
  },
  nf: { text: "このスケジュールジョブは発火しませんでした——お探しのページは存在しません。", back: "← ランディングページに戻る" }
});

/* ===================== РУССКИЙ (Russian) ===================== */
DICT.ru = {
  dir: "ltr",
  nav: { features: "Возможности", how: "Как это работает", usecases: "Сценарии", gui: "Центр управления", tools: "Инструменты", faq: "Вопросы", contact: "Контакты", cta: "Начать", lang: "Язык" },
  hero: {
    pill: "Уже на opencode v2 · v1.0.0",
    titleA: "Плановые задачи в стиле ChatGPT,",
    titleGrad: "для opencode.",
    lede: "Скажите opencode «следи за релизами конкурентов каждые 15 минут» — и он продолжит в <b>той же сессии</b>, с постоянной памятью, даже после сжатия контекста и даже при закрытом терминале.",
    ctaStart: "Начать бесплатно", ctaGit: "★ Звезда на GitHub", copy: "Копировать", copied: "Скопировано!", scroll: "Прокрутите, чтобы изучить"
  },
  problem: {
    badge: "Проблема", title: "Обычный cron слепой.", sub: "Классические планировщики запускают скрипт и забывают. opencode-cron заново запускает интеллектуального агента с памятью и суждением.",
    badTitle: "😵 Обычный cron / bash-циклы",
    bad1: "Запускает слепые одноразовые скрипты — ноль контекста",
    bad2: "Состояние диалога стирается при сжатии",
    bad3: "Повторяет одно и то же оповещение каждый тик",
    bad4: "Может зацикливаться и жечь ваши токены",
    bad5: "Только терминал, рытьё в непонятных syslog",
    goodTitle: "⚡ opencode-cron",
    good1: "Заново промптит ту же сессию со всей историей",
    good2: "Хук сжатия переинжектирует файл памяти",
    good3: "Дедуп seenHashes предотвращает повторы оповещений",
    good4: "Мин. 60с, джиттер, maxRuns и автовыключатель на 5 сбоев",
    good5: "Web GUI «Центр управления» + таймлайн выполнений"
  },
  features: {
    badge: "Сильные стороны", title: "Почему opencode-cron?", sub: "Интеллектуальный планировщик ИИ-агентов — не очередной crontab.",
    f1t: "Тот же диалог, каждый тик", f1d: "Заново промптит тот же sessionID со всей историей — не оторванный CLI-вызов.",
    f2t: "Постоянная markdown-память", f2d: "Выживает при сжатии, перезапусках и ребутах. Ведёт seenHashes против повторных уведомлений.",
    f3t: "Web GUI «Центр управления»", f3d: "Элегантная тёмная панель на localhost:4488 с живым чатом, мониторами задач и мгновенным управлением.",
    f4t: "Кроссплатформенное desktop-приложение", f4d: "Нативные установщики для macOS, Windows и Linux с треем, показывающим статус cron в реальном времени.",
    f5t: "Привязка расписания в 1 клик", f5d: "Привяжите повторяющееся расписание к любому диалогу с визуальными превью.",
    f6t: "Таймлайн выполнений", f6d: "Полная прозрачность каждого тика: длительность, статус, коды выхода, источник и логи ошибок.",
    f7t: "Глобальный набор из 10 языков", f7d: "English, Italiano, Español, Français, Deutsch, Português, 中文, 日本語, Русский и العربية с RTL.",
    f8t: "Автономный демон", f8d: "Работает всю ночь при закрытом TUI через нативные launchd, systemd или schtasks."
  },
  how: {
    badge: "Архитектура", title: "Как это работает", sub: "Четыре шага от запланированной задачи до умного, помнящего тика.",
    s1t: "Запланировать", s1d: "cron_add сохраняет задачу в jobs.json плюс файл памяти — привязанный к вашей сессии.",
    s2t: "Запустить", s2d: "Внутрипроцессный таймер (или 60-секундный ОС-демон при закрытом TUI) будит подошедшую задачу.",
    s3t: "Запомнить", s3d: "Промпт тика инжектит замороженную цель + память + самопроверку из 3 вопросов + ваш follow-up.",
    s4t: "Действовать", s4d: "Та же сессия продолжается; находки сохраняются в markdown и дедуплицируются через seenHashes."
  },
  compare: {
    badge: "Сравнение", title: "Обычный cron vs opencode-cron", sub: "Обычный cron — для чистой shell-работы. opencode-cron — когда задаче нужно суждение каждый запуск.",
    colFeat: "Свойство", colCron: "Обычный cron / bash", colOC: "opencode-cron",
    r1f: "Осведомлённость о сессии", r1c: "Слепые одноразовые скрипты", r1o: "Промптит ту же сессию",
    r2f: "Устойчивость к сжатию", r2c: "Стирается при сжатии", r2o: "Хук переинжектирует память",
    r3f: "Дедупликация", r3c: "Повторяет каждый тик", r3o: "Дедуп seenHashes",
    r4f: "Защита от циклов/токенов", r4c: "Циклится, жжёт токены", r4o: "Мин. 60с + пауза на 5 сбоях",
    r5f: "Интерфейс", r5c: "Терминал / файл crontab", r5o: "Web GUI «Центр управления»",
    r6f: "Наблюдаемость", r6c: "Рытьё в syslog", r6o: "Выделенный таймлайн /runs",
    r7f: "Многоязычность", r7c: "Только английский / нет", r7o: "10 языков + тур"
  },
};

Object.assign(DICT.ru, {
  usecases: {
    badge: "Шаблоны", title: "Реальные сценарии", sub: "Готовые шаблоны, которые работают, пока вы спите.",
    u1t: "Страж репозитория", u1f: "каждые 30м", u1d: "Гоняет тесты, проверяет git status, отмечает новые TODO и сообщает только об изменениях.",
    u2t: "Наблюдатель новостей ИИ и X", u2f: "каждые 5–15м", u2d: "Следит за релизами ИИ, сохраняет структурированные дайджесты, дедуплицирует через seenHashes.",
    u3t: "Сторож флаки-CI", u3f: "каждые 10м", u3d: "Перезапускает падающий CI, собирает матрицы ошибок и оповещает при исправлении.",
    u4t: "Монитор цен конкурентов", u4f: "каждый 1ч", u4d: "Собирает страницы цен, считает разницы и сообщает об аномалиях.",
    u5t: "Триаж лидов и входящих", u5f: "каждые 30м", u5d: "Фильтрует приоритетные письма и резюмирует ключевые действия в markdown."
  },
  gui: {
    badge: "Центр управления", title: "Настоящая панель для ваших агентов", sub: "Управляйте всем парком автоматизации из элегантной тёмной Web GUI.",
    m1: "Активная cron-матрица", m1d: "Живые счётчики, результаты последнего тика, обратный отсчёт до следующего запуска и тумблеры паузы.",
    m2: "Живой поток сессий", m2d: "Читайте активные и архивные чаты в реальном времени с автообновлением и подсветкой изменений.",
    m3: "Студия памяти", m3d: "Просматривайте и правьте markdown-память каждой задачи, не трогая файлы.",
    m4: "История выполнений", m4d: "Живой таймлайн успехов, сбоев, пропусков и задержек со следами ошибок.",
    sidebar: { mission: "Центр управления", runs: "Таймлайн выполнений", memory: "Студия памяти", guide: "Интерактивный гид", sessions: "Сессии" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "след."
  },
  desktop: {
    badge: "Везде", title: "Desktop-приложение + системный трей", sub: "Нативное устанавливаемое приложение, которое не мешает и держит задачи живыми.",
    mac: "macOS", macd: "Универсальный .dmg — Apple Silicon и Intel", win: "Windows", wind: "NSIS-установщик и портативный .exe", linux: "Linux", linuxd: "Пакеты .AppImage и .deb"
  },
  tools: {
    badge: "Для агентов", title: "9 нативных инструментов + 5 слэш-команд", sub: "Агенты с opencode-cron получают первоклассные примитивы планирования.",
    t1: "Создать повторяющуюся задачу, привязанную к текущей сессии", t2: "Список всех активных и приостановленных задач",
    t3: "Подробно изучить состояние и метаданные задачи", t4: "Временно приостановить задачу", t5: "Возобновить приостановленную задачу",
    t6: "Удалить задачу и её постоянную память", t7: "Запустить немедленный тестовый тик", t8: "Прочитать постоянную markdown-память",
    t9: "Сохранить находки и обновить seenHashes",
    s1: "/cron-add — интерактивный мастер планирования", s2: "/cron-list — задачи и ближайшие запуски", s3: "/cron-manage — пауза, возобновление, удаление",
    s4: "/cron-gui — запуск Web GUI", s5: "/cron-refresh — пересинхронизация ротированных кред"
  },
  stats: { s1: "10", s1l: "Языков", s2: "9", s2l: "Нативных инструментов", s3: "3", s3l: "Desktop-платформы", s4: "60с", s4l: "Минимальный интервал" },
  cta: { title: "Дайте агенту расписание.", sub: "Установите плагин, скажите слово — и opencode-cron продолжит работу в фоне, безопасно.", btn1: "Начать бесплатно", btn2: "Читать доку" },
});

Object.assign(DICT.ru, {
  faq: {
    badge: "Вопросы", title: "Частые вопросы", sub: "Всё, что нужно знать перед планированием первой задачи.",
    q1: "Что такое opencode-cron?", a1: "Это плагин с открытым кодом, приносящий плановые задачи в стиле ChatGPT в opencode. В отличие от обычного cron, он каждый тик заново промптит ту же ИИ-сессию с постоянной markdown-памятью — агент сохраняет контекст, дедуплицирует оповещения и не жжёт токены.",
    q2: "Чем отличается от обычного crontab?", a2: "crontab запускает слепой shell-скрипт без контекста. opencode-cron запускает интеллектуального агента внутри вашей сессии, инжектит замороженную цель + память + самопроверку и сохраняет выученное — под защитой минимума 60с, атомарных локов и автовыключателя на 5 сбоев.",
    q3: "Продолжает ли работать при закрытом терминале?", a3: "Да. Путь с закрытым TUI ставит нативный 60-секундный тикер через launchd (macOS), systemd (Linux) или schtasks (Windows), выполняющий подошедшие задачи в headless под атомарным локом.",
    q4: "Что с памятью при сжатии чата?", a4: "opencode-cron цепляется за событие сжатия и переинжектирует файл памяти задачи в сводку сжатия. История чата может сжаться, но markdown-память — источник истины и не сжимается никогда.",
    q5: "Как защищены расходы и бесконечные циклы?", a5: "У каждой задачи минимальный интервал 60с, до 10% джиттера, необязательный лимит maxRuns, лок skip-if-running и автопауза после 5 сбоев подряд — сломанная задача не сможет зацикливаться вечно.",
    q6: "Это бесплатно и с открытым кодом?", a6: "Да — лицензия MIT, опубликован на npm как @culturedigitali/opencode-cron, поддерживается Culture Digitali Srl."
  },
  contact: {
    badge: "Контакты", title: "Связаться", sub: "Вопросы, корпоративные потребности или просто поздороваться? Обычно отвечаем в течение дня.",
    name: "Ваше имя", email: "Ваш email", subject: "Тема", message: "Сообщение", send: "Отправить", sending: "Отправка…",
    sent: "Спасибо! Ваше сообщение отправлено.", err: "Что-то пошло не так. Напишите нам напрямую.", needMsg: "Заполните все поля.",
    direct: "Или напишите напрямую", repo: "Репозиторий", issues: "Сообщить об ошибке", consent: "Ваши данные используются только для ответа."
  },
  credits: { title: "Создано", company: "Culture Digitali Srl", companyDesc: "Итальянская студия, создающая AI-нативные инструменты для разработчиков и автоматизацию.", dev: "Luigi Strazzullo", devRole: "Создатель и ведущий разработчик opencode-cron" },
  footer: {
    tagline: "Плановые задачи в стиле ChatGPT для opencode — привязанный к сессии cron + постоянная память для ИИ-агентов.",
    product: "Продукт", resources: "Ресурсы", community: "Сообщество",
    docs: "Документация", quickstart: "Быстрый старт за 30 секунд", examples: "Примеры", how: "Как это работает", troubleshoot: "Устранение неполадок", comparison: "против обычного cron",
    github: "GitHub", npm: "npm", license: "Лицензия MIT", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron — открытый код под лицензией MIT."
  },
  nf: { text: "Эта плановая задача никогда не запускалась — страница не найдена.", back: "← На лендинг" }
});
/* ===================== العربية (Arabic, RTL) ===================== */
DICT.ar = {
  dir: "rtl",
  nav: { features: "المزايا", how: "كيف يعمل", usecases: "حالات الاستخدام", gui: "مركز التحكم", tools: "الأدوات", faq: "الأسئلة", contact: "تواصل", cta: "ابدأ الآن", lang: "اللغة" },
  hero: {
    pill: "متاح على opencode v2 · v1.0.0",
    titleA: "مهام مجدولة بنمط ChatGPT،",
    titleGrad: "من أجل opencode.",
    lede: "قل لـ opencode «راقب إصدارات المنافسين كل 15 دقيقة» وسيواصل العمل في <b>نفس الجلسة</b> — مع ذاكرة دائمة، حتى بعد ضغط السياق، حتى مع إغلاق الطرفية.",
    ctaStart: "ابدأ مجانًا", ctaGit: "★ نجمة على GitHub", copy: "نسخ", copied: "تم النسخ!", scroll: "مرّر للاستكشاف"
  },
  problem: {
    badge: "المشكلة", title: "الـ cron التقليدي أعمى.", sub: "المجدولات الكلاسيكية تشغّل سكربت وتنسى. يعيد opencode-cron تشغيل وكيل ذكي بذاكرة وحكم.",
    badTitle: "😵 cron تقليدي / حلقات bash",
    bad1: "يشغّل سكربتات معزولة — بلا سياق",
    bad2: "تُمسح حالة المحادثة عند الضغط",
    bad3: "يكرّر نفس التنبيه في كل نبضة",
    bad4: "قد يدور بلا نهاية ويحرق رصيدك",
    bad5: "طرفية فقط، وتمرّير في سجلات غامضة",
    goodTitle: "⚡ opencode-cron",
    good1: "يعيد استدعاء نفس الجلسة بكامل السجل",
    good2: "خطّاف الضغط يعيد حقن ملف الذاكرة",
    good3: "إزالة التكرار seenHashes تمنع التنبيهات المتكررة",
    good4: "60 ثانية كحد أدنى، تذبذب، maxRuns وقاطع 5 إخفاقات",
    good5: "واجهة مركز التحكم + خط زمني للتنفيذ"
  },
  features: {
    badge: "نقاط القوة", title: "لماذا opencode-cron؟", sub: "مجدول وكلاء ذكاء اصطناعي ذكي — ليس مجرد crontab آخر.",
    f1t: "نفس المحادثة، كل نبضة", f1d: "يعيد استدعاء نفس sessionID بكامل سجل المحادثة — ليس نداء CLI منفصلًا.",
    f2t: "ذاكرة Markdown دائمة", f2d: "تنجو من الضغط وإعادة التشغيل والإقلاع. تتبّع seenHashes لإيقاف الإشعارات المتكررة.",
    f3t: "واجهة مركز التحكم", f3d: "لوحة داكنة أنيقة على localhost:4488 مع بث محادثة مباشر ومراقبة للمهام وتحكم فوري.",
    f4t: "تطبيق سطح مكتب متعدد المنصات", f4d: "مثبّتات أصلية لـ macOS وWindows وLinux مع شريط نظام يعرض حالة cron لحظيًا.",
    f5t: "ربط الجدولة بنقرة واحدة", f5d: "اربط جدولة متكررة بأي محادثة مع معاينات مرئية — لا مزيد من كتابة تعبيرات cron يدويًا.",
    f6t: "الخط الزمني للتنفيذ", f6d: "رؤية كاملة لكل نبضة: المدة، الحالة، رموز الخروج، المصدر وسجلات الأخطاء.",
    f7t: "حزمة 10 لغات عالمية", f7d: "English وItaliano وEspañol وFrançais وDeutsch وPortuguês و中文 و日本語 وРусский و العربية مع دعم RTL.",
    f8t: "خدمة خلفية مستقلة", f8d: "تعمل طوال الليل مع إغلاق الواجهة عبر launchd أو systemd أو schtasks الأصلية."
  },
  how: {
    badge: "البنية", title: "كيف يعمل", sub: "أربع خطوات من مهمة مجدولة إلى نبضة ذكية واعية بالذاكرة.",
    s1t: "جدولة", s1d: "يحفظ cron_add مهمة في jobs.json مع ملف ذاكرة — مرتبط بجلستك.",
    s2t: "إطلاق", s2d: "يوقظ مؤقت داخلي (أو خدمة نظام 60 ثانية عند إغلاق الواجهة) المهمة المستحقة.",
    s3t: "تذكّر", s3d: "يحقن توجيه النبضة هدفًا مجمّدًا + الذاكرة + تدقيقًا ذاتيًا من 3 أسئلة + متابعتك.",
    s4t: "تصرّف", s4d: "تتواصل الجلسة نفسها؛ تُحفظ النتائج في Markdown وتُفلتر عبر seenHashes."
  },
  compare: {
    badge: "المقارنة", title: "cron التقليدي مقابل opencode-cron", sub: "استخدم cron التقليدي لعمل shell الخالص. استخدم opencode-cron عندما تحتاج المهمة إلى حكم في كل تشغيل.",
    colFeat: "الميزة", colCron: "cron التقليدي / bash", colOC: "opencode-cron",
    r1f: "الوعي بالجلسة", r1c: "سكربتات معزولة عمياء", r1o: "يعيد استدعاء نفس الجلسة",
    r2f: "آمن ضد الضغط", r2c: "يُمسح عند الضغط", r2o: "الخطّاف يعيد حقن الذاكرة",
    r3f: "إزالة التكرار", r3c: "يكرّر كل نبضة", r3o: "إزالة تكرار seenHashes",
    r4f: "حماية الحلقات/الرصيد", r4c: "يدور ويحرق", r4o: "60 ثانية + إيقاف بعد 5 إخفاقات",
    r5f: "الواجهة", r5c: "طرفية / ملف crontab", r5o: "واجهة مركز التحكم",
    r6f: "القابلية للمراقبة", r6c: "تمرير في syslog", r6o: "خط زمني /runs مخصص",
    r7f: "متعدد اللغات", r7c: "الإنجليزية فقط / لا شيء", r7o: "10 لغات + جولة"
  },
};

Object.assign(DICT.ar, {
  usecases: {
    badge: "قوالب", title: "حالات استخدام واقعية", sub: "قوالب جاهزة تواصل العمل أثناء نومك.",
    u1t: "حارس المستودع", u1f: "كل 30 د", u1d: "يشغّل الاختبارات ويفحص git status ويحدّد TODO الجديدة ويبلّغ فقط عند التغيير.",
    u2t: "مراقب أخبار الذكاء الاصطناعي وX", u2f: "كل 5–15 د", u2d: "يراقب إصدارات الذكاء الاصطناعي ويحفظ ملخصات منظمة ويزيل التكرار عبر seenHashes.",
    u3t: "مراقب CI المتقلب", u3f: "كل 10 د", u3d: "يعيد محاولة CI الفاشل ويجمع مصفوفات الأخطاء وينبّه عند الحل.",
    u4t: "مراقب أسعار المنافسين", u4f: "كل ساعة", u4d: "يجمع صفحات الأسعار ويحسب الفروق ويبلّغ عن الشواذ.",
    u5t: "فرز العملاء المحتملين والبريد", u5f: "كل 30 د", u5d: "يفلتر رسائل البريد ذات الأولوية ويلخّص الإجراءات الرئيسية في Markdown."
  },
  gui: {
    badge: "مركز التحكم", title: "لوحة حقيقية لوكلائك", sub: "أدر أسطول الأتمتة بالكامل من واجهة ويب داكنة أنيقة.",
    m1: "مصفوفة cron النشطة", m1d: "عدّادات لحظية ونتائج النبضة الأخيرة وعدّ تنازلي للتشغيل القادم ومفاتيح إيقاف/استئناف.",
    m2: "بث الجلسات المباشر", m2d: "اقرأ المحادثات النشطة والمؤرشفة لحظيًا مع تحديث تلقائي وإبراز الفروق.",
    m3: "استوديو الذاكرة", m3d: "اعرض وحرّر ذاكرة Markdown لكل مهمة دون لمس الملفات.",
    m4: "سجل التنفيذ", m4d: "خط زمني لحظي للنجاحات والإخفاقات والتخطيات وزمن الاستجابة مع آثار الأخطاء.",
    sidebar: { mission: "مركز التحكم", runs: "الخط الزمني للتنفيذ", memory: "استوديو الذاكرة", guide: "الدليل التفاعلي", sessions: "الجلسات" },
    job1: "repo-health-guardian", job2: "ai-news-watcher", job3: "ci-flaky-watchdog", next: "التالي"
  },
  desktop: {
    badge: "في كل مكان", title: "تطبيق سطح مكتب + شريط النظام", sub: "تطبيق أصلي قابل للتثبيت يبقى بعيدًا عن طريقك ويحفظ مهامك حيّة.",
    mac: "macOS", macd: ".dmg عالمي — Apple Silicon وIntel", win: "Windows", wind: "مثبّت NSIS و .exe محمول", linux: "Linux", linuxd: "حزم .AppImage و .deb"
  },
  tools: {
    badge: "للإدارة", title: "9 أدوات أصلية + 5 أوامر شرطة مائلة", sub: "يحصل الوكلاء المزوّدون بـ opencode-cron على أولويات جدولة من الدرجة الأولى.",
    t1: "إنشاء مهمة متكررة مرتبطة بالجلسة الحالية", t2: "سرد كل المهام النشطة والموقوفة", t3: "فحص حالة المهمة وبياناتها الوصفية",
    t4: "إيقاف مهمة مؤقتًا", t5: "استئناف مهمة موقوفة", t6: "حذف مهمة وذاكرتها الدائمة",
    t7: "إطلاق نبضة اختبار فورية", t8: "قراءة ذاكرة Markdown الدائمة", t9: "حفظ النتائج وتحديث seenHashes",
    s1: "/cron-add — معالج جدولة تفاعلي", s2: "/cron-list — فحص المهام والتشغيلات القادمة", s3: "/cron-manage — إيقاف أو استئناف أو حذف",
    s4: "/cron-gui — تشغيل واجهة الويب", s5: "/cron-refresh — إعادة مزامنة بيانات الاعتماد المبدّلة"
  },
  stats: { s1: "10", s1l: "لغات", s2: "9", s2l: "أدوات أصلية", s3: "3", s3l: "منصات سطح المكتب", s4: "60 ث", s4l: "أقصر فترة" },
  cta: { title: "امنح وكيلك جدولًا زمنيًا.", sub: "ثبّت الإضافة وقل الكلمة، ودع opencode-cron يعمل في الخلفية — بأمان.", btn1: "ابدأ مجانًا", btn2: "اقرأ المستندات" },
  faq: {
    badge: "الأسئلة", title: "الأسئلة الشائعة", sub: "كل ما تحتاج معرفته قبل جدولة أول مهمة لك.",
    q1: "ما هو opencode-cron بالضبط؟", a1: "إنه إضافة مفتوحة المصدر تجلب المهام المجدولة بنمط ChatGPT إلى opencode. بخلاف cron التقليدي، يعيد استدعاء نفس جلسة الذكاء الاصطناعي في كل نبضة مع ذاكرة Markdown دائمة، فيحتفظ الوكيل بالسياق ويزيل تكرار التنبيهات ويتجنب حرق الرصيد.",
    q2: "كيف يختلف عن crontab العادي؟", a2: "يشغّل crontab سكربت shell أعمى بلا سياق. يشغّل opencode-cron وكيلًا ذكيًا داخل جلستك الحالية، يحقن هدفًا مجمّدًا + الذاكرة + تدقيقًا ذاتيًا، ويحفظ ما يتعلمه — محميًا بحد أدنى 60 ثانية وأقفال ذرية وقاطع على 5 إخفاقات.",
    q3: "هل يستمر العمل عند إغلاق الطرفية؟", a3: "نعم. مسار إغلاق الواجهة يثبّت مؤقتًا أصليًا كل 60 ثانية عبر launchd (macOS) أو systemd (Linux) أو schtasks (Windows) ينفّذ المهام المستحقة بلا واجهة تحت قفل ذري.",
    q4: "ماذا يحدث للذاكرة عند ضغط المحادثة؟", a4: "يعلّق opencode-cron نفسه على حدث الضغط ويعيد حقن ملف ذاكرة المهمة في ملخص الضغط. قد يُضغط سجل المحادثة، لكن ذاكرة Markdown هي مصدر الحقيقة ولا تُضغط أبدًا.",
    q5: "كيف تُحمى التكاليف والحلقات الجامحة؟", a5: "لكل مهمة فترة 60 ثانية كحد أدنى، وتذبذب حتى 10%، وسقف maxRuns اختياري، وقفل skip-if-running، وإيقاف تلقائي بعد 5 إخفاقات متتالية — فلا يمكن لمهمة معطّلة أن تدور بلا نهاية.",
    q6: "هل هو مجاني ومفتوح المصدر؟", a6: "نعم — برخصة MIT، منشور على npm باسم @culturedigitali/opencode-cron وتصونه Culture Digitali Srl."
  },
  contact: {
    badge: "تواصل", title: "تواصل معنا", sub: "أسئلة أو احتياجات مؤسسية أو مجرد سلام؟ نرد عادة في غضون يوم.",
    name: "اسمك", email: "بريدك الإلكتروني", subject: "الموضوع", message: "الرسالة", send: "إرسال", sending: "جارٍ الإرسال…",
    sent: "شكرًا! رسالتك في الطريق.", err: "حدث خطأ ما. راسلنا مباشرة.", needMsg: "يرجى ملء جميع الحقول.",
    direct: "أو راسلنا مباشرة", repo: "المستودع", issues: "الإبلاغ عن خطأ", consent: "تُستخدم بياناتك للرد عليك فقط."
  },
  credits: { title: "من إعداد", company: "Culture Digitali Srl", companyDesc: "استوديو إيطالي يصنع أدوات تطوير أصلية للذكاء الاصطناعي والأتمتة.", dev: "Luigi Strazzullo", devRole: "مؤلف ومطوّر opencode-cron الرئيسي" },
  footer: {
    tagline: "مهام مجدولة بنمط ChatGPT لـ opencode — cron مرتبط بالجلسة + ذاكرة دائمة لوكلاء الذكاء الاصطناعي.",
    product: "المنتج", resources: "الموارد", community: "المجتمع",
    docs: "المستندات", quickstart: "بدء سريع في 30 ثانية", examples: "أمثلة", how: "كيف يعمل", troubleshoot: "استكشاف الأخطاء", comparison: "مقابل cron التقليدي",
    github: "GitHub", npm: "npm", license: "رخصة MIT", issues: "Issues",
    legal: "© {year} Culture Digitali Srl · opencode-cron مفتوح المصدر برخصة MIT."
  },
  nf: { text: "هذه المهمة المجدولة لم تُطلق أبدًا — الصفحة التي تبحث عنها غير موجودة.", back: "← العودة إلى صفحة الإطلاق" }
});

/* =============================================================================
 * ENGINE — apply(lang), setLang(lang) with localStorage + <html lang/dir>.
 * ========================================================================== */
(function () {
  const LANGS = window.OC_LANGS || [];
  const dict = window.__OC_DICT__ || {};
  const STORE_KEY = "oc_cron_lang";

  function resolve(lang) {
    if (dict[lang]) return lang;
    // try base (e.g. zh-CN -> zh)
    const base = (lang || "").toLowerCase().split("-")[0];
    if (dict[base]) return base;
    return "en";
  }

  function get(path, lang) {
    const obj = dict[lang];
    if (!obj) return undefined;
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }

  function interpolate(str, lang) {
    if (typeof str !== "string") return str;
    const year = new Date().getFullYear();
    return str
      .replace(/\{year\}/g, String(year))
      .replace(/\{company\}/g, (window.OC_CRON_SITE || {}).company || "")
      .replace(/\{developer\}/g, (window.OC_CRON_SITE || {}).developer || "")
      .replace(/\{email\}/g, (window.OC_CRON_SITE || {}).contactEmail || "");
  }

  function apply(lang) {
    const code = resolve(lang);
    const d = dict[code] || {};
    const html = document.documentElement;
    html.setAttribute("lang", code);
    html.setAttribute("dir", d.dir === "rtl" ? "rtl" : "ltr");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const val = get(el.getAttribute("data-i18n"), code);
      if (val == null) return;
      // Allow limited HTML in a few rich fields
      if (/lede|a1|a2|a3|a4|a5|a6|legal/.test(el.getAttribute("data-i18n"))) {
        el.innerHTML = interpolate(val, code);
      } else {
        el.textContent = interpolate(val, code);
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const val = get(el.getAttribute("data-i18n-placeholder"), code);
      if (val != null) el.setAttribute("placeholder", val);
    });

    // highlight active language in the picker
    document.querySelectorAll("[data-lang-code]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-lang-code") === code);
    });
    const cur = document.querySelector("[data-current-lang]");
    if (cur) {
      const meta = LANGS.find((l) => l.code === code) || LANGS[0];
      cur.textContent = (meta ? meta.flag + " " : "") + (meta ? meta.name : code);
    }

    try { localStorage.setItem(STORE_KEY, code); } catch (e) {}
    document.dispatchEvent(new CustomEvent("oc:langchange", { detail: { lang: code } }));
  }

  function detect() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved && dict[saved]) return saved;
    } catch (e) {}
    const nav = (navigator.languages || [navigator.language || "en"]).map((x) => resolve(x));
    return nav[0] || "en";
  }

  window.OC_I18N = { apply, setLang: apply, detect, current: () => resolve(detect()), dict };

  document.addEventListener("DOMContentLoaded", () => apply(detect()));
})();

