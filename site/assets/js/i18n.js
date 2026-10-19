/* =============================================================================
 * i18n.js - Localization engine for opencode-cron launch site.
 * 10 languages: en, it, es, fr, de, pt, zh, ja, ru, ar.
 * Design Taste Frontend v2 compliant.
 * Zero emojis, zero em-dashes, sanitized interpolation (XSS safe).
 * ========================================================================== */
(function () {
  "use strict";

  const STORE_KEY = "oc_cron_lang";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const dict = {
  "en": {
    "dir": "ltr",
    "nav": {
      "showcase": "Showcase",
      "features": "Features",
      "architecture": "Architecture",
      "standards": "Standards",
      "questions": "Questions",
      "install": "Install via CLI",
      "menu": "Menu"
    },
    "hero": {
      "title1": "Agents run",
      "title2": "on time.",
      "lead": "Intelligent session-bound cron scheduling for OpenCode AI agents with persistent memory, DAG pipelines, and real-time mission control.",
      "install": "Install via CLI",
      "inspectGithub": "Inspect GitHub Repository"
    },
    "showcase": {
      "chipWatchdog": "Watchdog (30m)",
      "chipBurst": "Incident burst (45m)",
      "chipDag": "DAG Pipeline",
      "title": "Mission Control Session Server",
      "status": "ACTIVE WORKER",
      "statJob": "Active Job",
      "statCadence": "Cadence",
      "statMemory": "Memory Context",
      "caption": "Astrolabe by Regiomontanus (1462), The Metropolitan Museum of Art. Precision instrumentation for calculating cyclical intervals."
    },
    "features": {
      "f1Title": "Dedicated sessions for every scheduled prompt.",
      "f1Desc": "Memory persists across turns in .opencode/cron/memory/ with automatic token compaction.",
      "f2Title": "Multi-step DAG pipelines chain dependent agent jobs.",
      "f2Desc": "Downstream triggers fire automatically on success or failure with memory payload passing.",
      "f3Title": "Inbound webhooks trigger jobs from external APIs.",
      "f3Desc": "HMAC SHA-256 signatures and cryptographic bearer tokens prevent unauthorized dispatch.",
      "f4Title": "Circuit breaker and Dead Letter Queue isolate errors.",
      "f4Desc": "Quarantines recurring errors after consecutive failures, stops token waste, and notifies via Web GUI.",
      "f5Title": "Adaptive cadence and burst mode adjust to activity.",
      "f5Desc": "Spins up 1-minute execution intervals during active incidents and backs off during quiet hours."
    },
    "how": {
      "title": "Execution sequence",
      "step1": "First, install the CLI and launch daemon.",
      "step2": "Then schedule your session-bound agent jobs.",
      "step3": "Inspect jobs in the local Mission Control interface.",
      "tabGui": "Mission Control Web GUI",
      "tabCli": "Terminal Daemon CLI",
      "guiVideoCaption": "Mission Control interface: active job metrics, one-click burst mode, interactive DAG pipeline modal, and live log stream.",
      "cliVideoCaption": "Autonomous terminal walkthrough: launchd setup, session binding, DAG chain, and live daemon execution."
    },
    "proof": {
      "title": "Operational standards",
      "captionVideo": "Mechanical clockwork movement, CC0 via Wikimedia Commons. Continuous autonomous cadence.",
      "captionSchematic": "De Wick escapement mechanism (1379), Public Domain via Wikimedia Commons.",
      "thDomain": "Architecture Domain",
      "thSpec": "Specification",
      "thVerif": "Empirical Verification",
      "thStatus": "Protocol Status"
    },
    "faq": {
      "title": "Technical specifications",
      "subtitle": "Everything answered directly without accordion toggles.",
      "q1": "Does it require a cloud subscription?",
      "a1": "No. Everything runs completely locally on your machine via standard operating system daemons (launchd on macOS, systemd on Linux, Task Scheduler on Windows) and local JSON persistence.",
      "q2": "How does it interact with running OpenCode sessions?",
      "a2": "It connects directly to OpenCode sidecar HTTP transport using rotating credentials and session tokens, preserving continuity across turns without restarting agents.",
      "q3": "What happens if a prompt fails?",
      "a3": "The Dead Letter Queue intercepts consecutive failures, trips the circuit breaker to prevent token waste, and quarantines the job until reviewed in the Web GUI or CLI.",
      "q4": "Can jobs trigger each other?",
      "a4": "Yes. DAG pipelines allow defining upstream and downstream dependencies with optional memory payload passing and cycle detection.",
      "q5": "How is context memory handled?",
      "a5": "Each job maintains persistent memory in .opencode/cron/memory/, summarized and pruned on each turn to preserve token limits without losing state.",
      "q6": "Is there a graphical user interface?",
      "a6": "Yes. A full Web GUI and cross-platform desktop application runs on localhost:4488 with live logs, priority queues, and token inspection."
    },
    "cta": {
      "title": "Schedule sessions on time.",
      "lead": "Run intelligent, session-bound cron tasks directly in your terminal.",
      "inspectGithub": "Inspect GitHub Repository",
      "subtext": "Open source, zero telemetry, local-first execution."
    }
  },
  "it": {
    "dir": "ltr",
    "nav": {
      "showcase": "Demo",
      "features": "Funzionalità",
      "architecture": "Architettura",
      "standards": "Standard",
      "questions": "FAQ",
      "install": "Installa via CLI",
      "menu": "Menu"
    },
    "hero": {
      "title1": "Agenti sempre",
      "title2": "in orario.",
      "lead": "Scheduler cron intelligente con session binding per agenti OpenCode AI: memoria persistente, pipeline DAG e console Mission Control in tempo reale.",
      "install": "Installa via CLI",
      "inspectGithub": "Esplora il repository GitHub"
    },
    "showcase": {
      "chipWatchdog": "Watchdog test (30m)",
      "chipBurst": "Burst incidenti (45m)",
      "chipDag": "Pipeline DAG",
      "title": "Mission Control Session Server",
      "status": "WORKER ATTIVO",
      "statJob": "Job attivo",
      "statCadence": "Cadenza",
      "statMemory": "Contesto memoria",
      "caption": "Astrolabio di Regiomontano (1462), The Metropolitan Museum of Art. Strumentazione di precisione per il calcolo di intervalli ciclici."
    },
    "features": {
      "f1Title": "Sessioni dedicate per ogni prompt programmato.",
      "f1Desc": "La memoria persiste tra i turni in .opencode/cron/memory/ con compattazione automatica del contesto.",
      "f2Title": "Pipeline DAG multi-step per concatenare job dipendenti.",
      "f2Desc": "I trigger a valle scattano automaticamente su successo o errore, inoltrando il payload di memoria.",
      "f3Title": "Webhook in entrata per trigger da API esterne.",
      "f3Desc": "Firme crittografiche HMAC SHA-256 e bearer token impediscono qualsiasi dispatch non autorizzato.",
      "f4Title": "Circuit breaker e Dead Letter Queue isolano i guasti.",
      "f4Desc": "Mette in quarantena i job dopo errori consecutivi, azzerando lo spreco di token e notificando via Web GUI.",
      "f5Title": "Cadenza adattiva e burst mode in base al carico.",
      "f5Desc": "Scala a intervalli di 1 minuto durante gli incidenti attivi e riduce la frequenza nelle ore di quiete."
    },
    "how": {
      "title": "Sequenza di esecuzione",
      "step1": "Installa la CLI e avvia il demone di sistema.",
      "step2": "Programma i job degli agenti vincolati a sessione.",
      "step3": "Monitora i job nell'interfaccia Mission Control locale.",
      "tabGui": "Web GUI Mission Control",
      "tabCli": "CLI Daemon da terminale",
      "guiVideoCaption": "Interfaccia Mission Control: metriche job attivi, burst mode con un clic, modale pipeline DAG interattiva e flusso log in tempo reale.",
      "cliVideoCaption": "Walkthrough da terminale autonomo: configurazione launchd, session binding, catena DAG ed esecuzione daemon in tempo reale."
    },
    "proof": {
      "title": "Standard operativi",
      "captionVideo": "Movimento di orologeria meccanica a pendolo, CC0 via Wikimedia Commons. Cadenza autonoma e continua.",
      "captionSchematic": "Meccanismo di scappamento De Wick (1379), Pubblico Dominio via Wikimedia Commons.",
      "thDomain": "Dominio architetturale",
      "thSpec": "Specifica tecnica",
      "thVerif": "Verifica empirica",
      "thStatus": "Stato del protocollo"
    },
    "faq": {
      "title": "Specifiche tecniche",
      "subtitle": "Tutte le risposte direttamente visibili, senza menu a tendina chiusi.",
      "q1": "Richiede un abbonamento cloud?",
      "a1": "No. Tutto gira interamente in locale sul tuo computer tramite i demoni nativi del sistema operativo (launchd su macOS, systemd su Linux, Utilità di pianificazione su Windows) e salvataggi JSON locali.",
      "q2": "Come interagisce con le sessioni OpenCode attive?",
      "a2": "Si connette direttamente al trasporto HTTP del sidecar di OpenCode con credenziali rotanti e token di sessione, preservando la continuità dei turni senza riavviare gli agenti.",
      "q3": "Cosa succede se un prompt fallisce?",
      "a3": "La Dead Letter Queue intercetta gli errori consecutivi, fa scattare il circuit breaker per fermare lo spreco di token e isola il job fino a revisione manuale o via Web GUI.",
      "q4": "I job possono attivarsi a vicenda?",
      "a4": "Sì. Le pipeline DAG consentono di definire dipendenze a monte e a valle, con passaggio facoltativo del payload di memoria e rilevamento integrato dei cicli.",
      "q5": "Come viene gestita la memoria di contesto?",
      "a5": "Ogni job mantiene una memoria persistente in .opencode/cron/memory/, riassunta e compattata a ogni turno per rispettare i limiti di token senza perdere lo stato.",
      "q6": "Esiste un'interfaccia grafica?",
      "a6": "Sì. Una Web GUI completa e un'applicazione desktop multipiattaforma sono disponibili su localhost:4488 con log in streaming, code di priorità e ispezione dei token."
    },
    "cta": {
      "title": "Sessioni puntuali, sempre.",
      "lead": "Esegui task cron intelligenti e legati a sessione direttamente dal tuo terminale.",
      "inspectGithub": "Esplora il repository GitHub",
      "subtext": "Open source, zero telemetria, esecuzione completamente locale."
    }
  },
  "es": {
    "dir": "ltr",
    "nav": {
      "showcase": "Demostración",
      "features": "Funcionalidades",
      "architecture": "Arquitectura",
      "standards": "Estándares",
      "questions": "Preguntas",
      "install": "Instalar vía CLI",
      "menu": "Menú"
    },
    "hero": {
      "title1": "Agentes siempre",
      "title2": "a tiempo.",
      "lead": "Programador cron inteligente vinculado a sesiones para agentes OpenCode AI: memoria persistente, pipelines DAG y Mission Control en tiempo real.",
      "install": "Instalar vía CLI",
      "inspectGithub": "Inspeccionar repositorio en GitHub"
    },
    "showcase": {
      "chipWatchdog": "Watchdog de tests (30m)",
      "chipBurst": "Ráfaga de incidentes (45m)",
      "chipDag": "Pipeline DAG",
      "title": "Servidor de sesiones Mission Control",
      "status": "WORKER ACTIVO",
      "statJob": "Trabajo activo",
      "statCadence": "Cadencia",
      "statMemory": "Contexto de memoria",
      "caption": "Astrolabio de Regiomontanus (1462), The Metropolitan Museum of Art. Instrumentación de precisión para calcular intervalos cíclicos."
    },
    "features": {
      "f1Title": "Sesiones dedicadas para cada prompt programado.",
      "f1Desc": "La memoria persiste entre turnos en .opencode/cron/memory/ con compactación automática de tokens.",
      "f2Title": "Pipelines DAG multietapa para encadenar agentes dependientes.",
      "f2Desc": "Los disparadores dependientes se activan automáticamente tras éxito o fallo con transferencia de estado.",
      "f3Title": "Webhooks entrantes para activación desde APIs externas.",
      "f3Desc": "Firmas criptográficas HMAC SHA-256 y tokens portadores impiden cualquier ejecución no autorizada.",
      "f4Title": "Circuit breaker y Dead Letter Queue para aislar fallos.",
      "f4Desc": "Pone en cuarentena errores recurrentes tras fallos consecutivos, frena el gasto de tokens y notifica vía Web GUI.",
      "f5Title": "Cadencia adaptativa y modo ráfaga según la actividad.",
      "f5Desc": "Acelera a intervalos de 1 minuto durante incidentes activos y reduce la frecuencia en periodos de inactividad."
    },
    "how": {
      "title": "Secuencia de ejecución",
      "step1": "Primero, instala la CLI y el demonio del sistema.",
      "step2": "Luego programa los trabajos de agentes vinculados a sesión.",
      "step3": "Inspecciona los trabajos en la consola local Mission Control.",
      "tabGui": "Web GUI Mission Control",
      "tabCli": "CLI Demonio de terminal",
      "guiVideoCaption": "Interfaz Mission Control: métricas de tareas activas, modo ráfaga con un clic, modal de pipeline DAG interactivo y flujo de registros en vivo.",
      "cliVideoCaption": "Demostración en terminal autónomo: configuración de launchd, vinculación de sesión, cadena DAG y ejecución del demonio en vivo."
    },
    "proof": {
      "title": "Estándares operativos",
      "captionVideo": "Mecanismo de relojería de péndulo, CC0 vía Wikimedia Commons. Cadencia autónoma continua.",
      "captionSchematic": "Mecanismo de escape De Wick (1379), Dominio Público vía Wikimedia Commons.",
      "thDomain": "Dominio arquitectónico",
      "thSpec": "Especificación técnica",
      "thVerif": "Verificación empírica",
      "thStatus": "Estado del protocolo"
    },
    "faq": {
      "title": "Especificaciones técnicas",
      "subtitle": "Todas las respuestas directamente visibles, sin menús de acordeón cerrados.",
      "q1": "¿Requiere suscripción en la nube?",
      "a1": "No. Todo se ejecuta de forma completamente local en tu máquina mediante los demonios nativos del sistema operativo (launchd en macOS, systemd en Linux, Programador de tareas en Windows) y persistencia JSON local.",
      "q2": "¿Cómo interactúa con las sesiones activas de OpenCode?",
      "a2": "Se conecta directamente al transporte HTTP del sidecar de OpenCode mediante credenciales rotativas y tokens de sesión, preservando la continuidad sin reiniciar agentes.",
      "q3": "¿Qué sucede si falla un prompt?",
      "a3": "La Dead Letter Queue intercepta fallos consecutivos, dispara el circuit breaker para evitar el desperdicio de tokens y aísla el trabajo hasta su revisión en la Web GUI o CLI.",
      "q4": "¿Pueden los trabajos activarse mutuamente?",
      "a4": "Sí. Las pipelines DAG permiten definir dependencias ascendentes y descendentes con transferencia opcional de memoria y detección estricta de ciclos.",
      "q5": "¿Cómo se gestiona la memoria de contexto?",
      "a5": "Cada trabajo mantiene memoria persistente en .opencode/cron/memory/, resumida y compactada en cada turno para respetar los límites de tokens sin perder el estado.",
      "q6": "¿Existe una interfaz gráfica?",
      "a6": "Sí. Una Web GUI completa y una aplicación de escritorio multiplataforma se ejecutan en localhost:4488 con registros en vivo, colas de prioridad e inspección de tokens."
    },
    "cta": {
      "title": "Sesiones puntuales, sin demoras.",
      "lead": "Ejecuta tareas cron inteligentes y vinculadas a sesión directamente en tu terminal.",
      "inspectGithub": "Inspeccionar repositorio en GitHub",
      "subtext": "Código abierto, cero telemetría, ejecución local prioritaria."
    }
  },
  "fr": {
    "dir": "ltr",
    "nav": {
      "showcase": "Démo",
      "features": "Fonctionnalités",
      "architecture": "Architecture",
      "standards": "Standards",
      "questions": "Questions",
      "install": "Installer via CLI",
      "menu": "Menu"
    },
    "hero": {
      "title1": "Des agents toujours",
      "title2": "à l'heure.",
      "lead": "Planificateur cron intelligent lié aux sessions pour les agents OpenCode AI: mémoire persistante, pipelines DAG et console Mission Control en temps réel.",
      "install": "Installer via CLI",
      "inspectGithub": "Examiner le dépôt GitHub"
    },
    "showcase": {
      "chipWatchdog": "Watchdog de tests (30m)",
      "chipBurst": "Burst d'incident (45m)",
      "chipDag": "Pipeline DAG",
      "title": "Serveur de session Mission Control",
      "status": "WORKER ACTIF",
      "statJob": "Tâche active",
      "statCadence": "Cadence",
      "statMemory": "Contexte mémoire",
      "caption": "Astrolabe de Regiomontanus (1462), The Metropolitan Museum of Art. Instrumentation de haute précision pour le calcul des cycles."
    },
    "features": {
      "f1Title": "Sessions dédiées pour chaque prompt planifié.",
      "f1Desc": "La mémoire persiste entre les tours dans .opencode/cron/memory/ avec compactage automatique des tokens.",
      "f2Title": "Pipelines DAG multi-étapes pour chaîner les agents dépendants.",
      "f2Desc": "Les déclencheurs en aval s'activent automatiquement en cas de succès ou d'échec avec transmission du contexte.",
      "f3Title": "Webhooks entrants pour déclenchement depuis des API externes.",
      "f3Desc": "Signatures cryptographiques HMAC SHA-256 et jetons porteurs empêchant toute exécution non autorisée.",
      "f4Title": "Circuit breaker et Dead Letter Queue pour isoler les défaillances.",
      "f4Desc": "Met en quarantaine les erreurs récurrentes après des échecs consécutifs, stoppe le gaspillage de tokens et alerte via la Web GUI.",
      "f5Title": "Cadence adaptative et mode burst selon l'activité.",
      "f5Desc": "Passe à des intervalles de 1 minute lors d'incidents actifs et ralentit pendant les heures creuses."
    },
    "how": {
      "title": "Séquence d'exécution",
      "step1": "D'abord, installez la CLI et le démon système.",
      "step2": "Ensuite, programmez vos tâches d'agents liées à une session.",
      "step3": "Inspectez les tâches dans l'interface locale Mission Control.",
      "tabGui": "Web GUI Mission Control",
      "tabCli": "CLI Démon de terminal",
      "guiVideoCaption": "Interface Mission Control: métriques des tâches actives, mode burst en un clic, modale de pipeline DAG interactive et flux de logs en temps réel.",
      "cliVideoCaption": "Démonstration sur terminal autonome: configuration launchd, liaison de session, chaîne DAG et exécution du démon en direct."
    },
    "proof": {
      "title": "Standards opérationnels",
      "captionVideo": "Mouvement d'horlogerie mécanique à pendule, CC0 via Wikimedia Commons. Cadence autonome continue.",
      "captionSchematic": "Mécanisme d'échappement de De Wick (1379), Domaine Public via Wikimedia Commons.",
      "thDomain": "Domaine architectural",
      "thSpec": "Spécification technique",
      "thVerif": "Vérification empirique",
      "thStatus": "État du protocole"
    },
    "faq": {
      "title": "Spécifications techniques",
      "subtitle": "Toutes les réponses techniques directement accessibles, sans volets en accordéon.",
      "q1": "Un abonnement cloud est-il requis ?",
      "a1": "Non. Tout fonctionne entièrement en local sur votre machine grâce aux démons natifs du système d'exploitation (launchd sur macOS, systemd sur Linux, Planificateur de tâches sur Windows) et au stockage JSON local.",
      "q2": "Comment interagit-il avec les sessions OpenCode en cours ?",
      "a2": "Il se connecte directement au transport HTTP du sidecar d'OpenCode avec des identifiants tournants et des jetons de session, préservant la continuité sans redémarrer les agents.",
      "q3": "Que se passe-t-il si un prompt échoue ?",
      "a3": "La Dead Letter Queue intercepte les échecs consécutifs, déclenche le circuit breaker pour éviter tout gaspillage de tokens et met le travail en quarantaine jusqu'à révision dans la Web GUI ou CLI.",
      "q4": "Les tâches peuvent-elles se déclencher mutuellement ?",
      "a4": "Oui. Les pipelines DAG permettent de définir des dépendances en amont et en aval, avec transmission optionnelle du contexte de mémoire et détection stricte des cycles.",
      "q5": "Comment la mémoire de contexte est-elle gérée ?",
      "a5": "Chaque tâche conserve une mémoire persistante dans .opencode/cron/memory/, résumée et compactée à chaque tour pour respecter la fenêtre de tokens sans perdre l'état.",
      "q6": "Existe-t-il une interface graphique ?",
      "a6": "Oui. Une Web GUI complète et une application de bureau multiplateforme tournent sur localhost:4488 avec journaux en direct, files d'attente prioritaires et inspection des tokens."
    },
    "cta": {
      "title": "Planifiez des sessions ponctuelles.",
      "lead": "Exécutez des tâches cron intelligentes et liées à une session directement dans votre terminal.",
      "inspectGithub": "Examiner le dépôt GitHub",
      "subtext": "Open source, zéro télémétrie, exécution locale d'abord."
    }
  },
  "de": {
    "dir": "ltr",
    "nav": {
      "showcase": "Showcase",
      "features": "Funktionen",
      "architecture": "Architektur",
      "standards": "Standards",
      "questions": "Fragen",
      "install": "Per CLI installieren",
      "menu": "Menü"
    },
    "hero": {
      "title1": "Agenten laufen",
      "title2": "pünktlich.",
      "lead": "Intelligente, sitzungsgebundene Cron-Planung für OpenCode-KI-Agenten mit persistentem Speicher, DAG-Pipelines und Echtzeit-Leitstand.",
      "install": "Per CLI installieren",
      "inspectGithub": "GitHub-Repository ansehen"
    },
    "showcase": {
      "chipWatchdog": "Watchdog (30m)",
      "chipBurst": "Incident-Burst (45m)",
      "chipDag": "DAG-Pipeline",
      "title": "Mission Control Sitzungs-Server",
      "status": "AKTIVER WORKER",
      "statJob": "Aktiver Job",
      "statCadence": "Taktung",
      "statMemory": "Speicher-Kontext",
      "caption": "Astrolabium von Regiomontanus (1462), The Metropolitan Museum of Art. Präzisionsinstrument für zyklische Berechnungen."
    },
    "features": {
      "f1Title": "Dedizierte Sitzungen für jeden geplanten Prompt.",
      "f1Desc": "Der Speicher bleibt über Runden hinweg in .opencode/cron/memory/ mit automatischer Token-Kompaktierung erhalten.",
      "f2Title": "Mehrstufige DAG-Pipelines verketten abhängige Agenten-Jobs.",
      "f2Desc": "Nachgelagerte Trigger starten automatisch bei Erfolg oder Fehler mit Übergabe des Speicher-Payloads.",
      "f3Title": "Eingehende Webhooks für Trigger über externe APIs.",
      "f3Desc": "Kryptografische HMAC-SHA-256-Signaturen und Bearer-Token verhindern unbefugte Ausführungen.",
      "f4Title": "Circuit Breaker und Dead Letter Queue isolieren Fehler.",
      "f4Desc": "Isoliert wiederkehrende Fehler nach aufeinanderfolgenden Fehlschlägen, stoppt Token-Verschwendung und benachrichtigt über die Web-GUI.",
      "f5Title": "Adaptive Taktung und Burst-Modus je nach Aktivität.",
      "f5Desc": "Schaltet bei akuten Vorfällen auf 1-Minuten-Intervalle hoch und drosselt in Ruhephasen."
    },
    "how": {
      "title": "Ausführungssequenz",
      "step1": "Zuerst CLI und Systemdienst installieren.",
      "step2": "Danach sitzungsgebundene Agenten-Jobs planen.",
      "step3": "Jobs in der lokalen Mission-Control-Konsole prüfen.",
      "tabGui": "Mission Control Web-GUI",
      "tabCli": "Terminal-Daemon-CLI",
      "guiVideoCaption": "Mission-Control-Oberfläche: Metriken aktiver Jobs, 1-Klick-Burst-Modus, interaktives DAG-Pipeline-Modal und Live-Log-Stream.",
      "cliVideoCaption": "Autonomer Terminal-Ablauf: launchd-Setup, Sitzungsbindung, DAG-Kette und Live-Daemon-Ausführung."
    },
    "proof": {
      "title": "Betriebliche Standards",
      "captionVideo": "Mechanisches Pendeluhrwerk, CC0 über Wikimedia Commons. Kontinuierlicher autonomer Takt.",
      "captionSchematic": "De-Wick-Hemmung (1379), Gemeinfrei via Wikimedia Commons.",
      "thDomain": "Architektur-Domäne",
      "thSpec": "Spezifikation",
      "thVerif": "Empirische Verifikation",
      "thStatus": "Protokoll-Status"
    },
    "faq": {
      "title": "Technische Spezifikationen",
      "subtitle": "Alle Antworten direkt lesbar ohne versteckte Akkordeon-Menüs.",
      "q1": "Wird ein Cloud-Abonnement benötigt?",
      "a1": "Nein. Alles läuft vollständig lokal auf Ihrem Rechner über Standard-Systemdienste (launchd unter macOS, systemd unter Linux, Aufgabenplanung unter Windows) und lokale JSON-Persistenz.",
      "q2": "Wie interagiert es mit aktiven OpenCode-Sitzungen?",
      "a2": "Es verbindet sich direkt mit dem HTTP-Transport des OpenCode-Sidecars unter Verwendung rotierender Anmeldedaten und Sitzungs-Tokens ohne Agenten-Neustart.",
      "q3": "Was passiert, wenn ein Prompt fehlschlägt?",
      "a3": "Die Dead Letter Queue fängt wiederholte Fehler ab, löst den Circuit Breaker gegen Token-Verschwendung aus und isoliert den Job bis zur manuellen Prüfung in Web-GUI oder CLI.",
      "q4": "Können Jobs sich gegenseitig auslösen?",
      "a4": "Ja. DAG-Pipelines ermöglichen die Verkettung von Abhängigkeiten mit zyklischer Validierung und Übergabe des Speicherzustands.",
      "q5": "Wie wird der Kontextspeicher verwaltet?",
      "a5": "Jeder Job verwaltet persistenten Speicher in .opencode/cron/memory/, der pro Runde zusammengefasst und kompakt gehalten wird.",
      "q6": "Gibt es eine grafische Benutzeroberfläche?",
      "a6": "Ja. Eine vollwertige Web-GUI und Desktop-Anwendung läuft auf localhost:4488 mit Live-Logs, Prioritätswarteschlangen und Token-Inspektion."
    },
    "cta": {
      "title": "Sitzungen pünktlich planen.",
      "lead": "Führen Sie intelligente, sitzungsgebundene Cron-Aufgaben direkt in Ihrem Terminal aus.",
      "inspectGithub": "GitHub-Repository ansehen",
      "subtext": "Open Source, null Telemetrie, lokale Ausführung zuerst."
    }
  },
  "pt": {
    "dir": "ltr",
    "nav": {
      "showcase": "Demonstração",
      "features": "Recursos",
      "architecture": "Arquitetura",
      "standards": "Padrões",
      "questions": "Perguntas",
      "install": "Instalar via CLI",
      "menu": "Menu"
    },
    "hero": {
      "title1": "Agentes operam",
      "title2": "no horário.",
      "lead": "Agendador cron inteligente vinculado a sessões para agentes OpenCode AI, com memória persistente, pipelines DAG e Mission Control em tempo real.",
      "install": "Instalar via CLI",
      "inspectGithub": "Inspecionar repositório no GitHub"
    },
    "showcase": {
      "chipWatchdog": "Watchdog de testes (30m)",
      "chipBurst": "Disparo de incidentes (45m)",
      "chipDag": "Pipeline DAG",
      "title": "Servidor de Sessão Mission Control",
      "status": "WORKER ATIVO",
      "statJob": "Trabalho ativo",
      "statCadence": "Cadência",
      "statMemory": "Contexto de memória",
      "caption": "Astrolábio de Regiomontanus (1462), The Metropolitan Museum of Art. Instrumento de precisão para calcular intervalos cíclicos."
    },
    "features": {
      "f1Title": "Sessões dedicadas para cada prompt programado.",
      "f1Desc": "A memória persiste entre turnos em .opencode/cron/memory/ com compactação automática de tokens.",
      "f2Title": "Pipelines DAG para encadear agentes dependentes.",
      "f2Desc": "Gatilhos dependentes disparam automaticamente em caso de sucesso ou falha com transferência de memória.",
      "f3Title": "Webhooks de entrada para disparo via APIs externas.",
      "f3Desc": "Assinaturas criptográficas HMAC SHA-256 e tokens de portador impedem execuções não autorizadas.",
      "f4Title": "Circuit breaker e Dead Letter Queue para isolar falhas.",
      "f4Desc": "Coloca em quarentena erros recorrentes após falhas consecutivas, freia o desperdício de tokens e notifica via Web GUI.",
      "f5Title": "Cadência adaptativa e modo burst conforme a atividade.",
      "f5Desc": "Acelera para intervalos de 1 minuto em incidentes ativos e reduz a frequência em períodos de baixa atividade."
    },
    "how": {
      "title": "Sequência de execução",
      "step1": "Primeiro, instale a CLI e o daemon de sistema.",
      "step2": "Em seguida, agende seus trabalhos vinculados a sessão.",
      "step3": "Inspecione os trabalhos na interface Mission Control local.",
      "tabGui": "Web GUI Mission Control",
      "tabCli": "CLI Daemon de terminal",
      "guiVideoCaption": "Interface Mission Control: métricas de trabalhos ativos, modo burst com um clique, modal interativo de pipeline DAG e fluxo de logs em tempo real.",
      "cliVideoCaption": "Demonstração em terminal autônomo: configuração do launchd, vínculo de sessão, cadeia DAG e execução do daemon em tempo real."
    },
    "proof": {
      "title": "Padrões operacionais",
      "captionVideo": "Mecanismo de relógio de pêndulo, CC0 via Wikimedia Commons. Cadência autônoma contínua.",
      "captionSchematic": "Mecanismo de escape De Wick (1379), Domínio Público via Wikimedia Commons.",
      "thDomain": "Domínio de arquitetura",
      "thSpec": "Especificação",
      "thVerif": "Verificação empírica",
      "thStatus": "Status do protocolo"
    },
    "faq": {
      "title": "Especificações técnicas",
      "subtitle": "Respostas técnicas diretas sem sanfonas ou abas recolhidas.",
      "q1": "Requer assinatura na nuvem?",
      "a1": "Não. Tudo roda inteiramente em seu host local por meio dos daemons nativos do sistema operacional (launchd no macOS, systemd no Linux, Agendador de Tarefas no Windows) e persistência JSON local.",
      "q2": "Como interage com sessões ativas do OpenCode?",
      "a2": "Conecta-se diretamente ao transporte HTTP do sidecar do OpenCode com credenciais rotativas e tokens de sessão, preservando a continuidade dos turnos sem reiniciar agentes.",
      "q3": "O que acontece quando um prompt falha?",
      "a3": "A Dead Letter Queue intercepta falhas consecutivas, aciona o circuit breaker para evitar desperdício de tokens e isola o trabalho até revisão na Web GUI ou CLI.",
      "q4": "Os trabalhos podem disparar uns aos outros?",
      "a4": "Sim. Pipelines DAG permitem definir dependências ascendentes e descendentes com transferência opcional de carga de memória e detecção de ciclos.",
      "q5": "Como a memória de contexto é gerenciada?",
      "a5": "Cada trabalho mantém memória persistente em .opencode/cron/memory/, resumida e compactada a cada turno para respeitar os limites de contexto sem perder estado.",
      "q6": "Há uma interface gráfica?",
      "a6": "Sim. Uma Web GUI completa e um aplicativo desktop multiplataforma rodam em localhost:4488 com logs em tempo real, filas de prioridade e inspeção de tokens."
    },
    "cta": {
      "title": "Sessões no horário certo.",
      "lead": "Execute tarefas cron inteligentes e vinculadas a sessão diretamente no seu terminal.",
      "inspectGithub": "Inspecionar repositório no GitHub",
      "subtext": "Código aberto, zero telemetria, execução estritamente local."
    }
  },
  "zh": {
    "dir": "ltr",
    "nav": {
      "showcase": "功能演示",
      "features": "核心特性",
      "architecture": "架构设计",
      "standards": "工程标准",
      "questions": "常见问题",
      "install": "通过 CLI 安装",
      "menu": "菜单"
    },
    "hero": {
      "title1": "智能体运行",
      "title2": "准时无误。",
      "lead": "专为 OpenCode AI 智能体打造的会话绑定型 cron 调度器，集成跨轮次持久记忆、DAG 级联流水线与实时控制台。",
      "install": "通过 CLI 安装",
      "inspectGithub": "查看 GitHub 仓库"
    },
    "showcase": {
      "chipWatchdog": "测试巡检 (30m)",
      "chipBurst": "应急加速 (45m)",
      "chipDag": "DAG 流水线",
      "title": "Mission Control 会话服务",
      "status": "运行中",
      "statJob": "当前任务",
      "statCadence": "调度周期",
      "statMemory": "记忆上下文",
      "caption": "Regiomontanus 星盘 (1462年)，大都会艺术博物馆 CC0 公共领域藏品。计算天体周期性规律的精密仪器。"
    },
    "features": {
      "f1Title": "为每次定时 Prompt 分配专属独立会话。",
      "f1Desc": "会话记忆跨轮次持久化保存在 .opencode/cron/memory/ 中，并在每轮执行时自动压缩 Token。",
      "f2Title": "多阶段 DAG 流水线链接具备依赖关系的智能体任务。",
      "f2Desc": "下游触发器根据前序成功或失败条件自动响应，并安全传递记忆负载。",
      "f3Title": "入站 Webhook 支持第三方外部 API 随时触发。",
      "f3Desc": "HMAC SHA-256 签名校验与加密 Bearer Token 机制，从底层杜绝未授权调用。",
      "f4Title": "熔断保护器与死信队列（DLQ）隔绝异常扩散。",
      "f4Desc": "连续异常发生后自动隔离故障任务，杜绝 Token 额度浪费，并在 Web 控制台即时告警。",
      "f5Title": "自适应周期调度与突发响应模式。",
      "f5Desc": "在发生系统故障或活跃交互期间自动加速至 1 分钟高频轮询，在静默期自动降频以节省资源。"
    },
    "how": {
      "title": "执行架构流程",
      "step1": "首先，安装 CLI 命令行工具与系统守护进程。",
      "step2": "接着，配置绑定会话的智能体定时任务。",
      "step3": "最后，在本地 Mission Control 控制台进行可视化监控。",
      "tabGui": "Mission Control Web 控制台",
      "tabCli": "终端守护进程 CLI",
      "guiVideoCaption": "Mission Control 控制台界面：活跃任务监控指标、一键突发加速模式、交互式 DAG 流水线弹窗与实时日志流。",
      "cliVideoCaption": "终端自主执行全流程演示：launchd 守护进程初始化、会话绑定、DAG 级联与守护进程实时运行。"
    },
    "proof": {
      "title": "工程技术标准",
      "captionVideo": "机械摆钟机芯实拍，CC0 共享协议，源自维基共享资源。持续自主稳定运转。",
      "captionSchematic": "德维克（Henri de Wick）擒纵机械原理工程图 (1379年)，公有领域。",
      "thDomain": "架构领域",
      "thSpec": "技术规格",
      "thVerif": "实测验证",
      "thStatus": "协议状态"
    },
    "faq": {
      "title": "技术规格与问答",
      "subtitle": "清晰明了的平铺式解答，无需繁琐的手风琴折叠交互。",
      "q1": "是否需要购买云服务订阅？",
      "a1": "不需要。所有组件完全在您的本地设备上运行，依靠操作系统原生系统守护进程（macOS 的 launchd、Linux 的 systemd、Windows 的任务计划程序）与本地 JSON 数据存储。",
      "q2": "它如何与正在运行的 OpenCode 智能体会话交互？",
      "a2": "通过轮转凭证和会话令牌直接对接 OpenCode 本地 sidecar HTTP 通信通道，无需重启智能体即可无缝延续任务。",
      "q3": "如果提示词执行失败会发生什么？",
      "a3": "死信队列（DLQ）会捕获多次连续异常，立即触发熔断保护以阻止 Token 浪费，并将任务安全隔离等待人工复核。",
      "q4": "任务之间能否相互触发并级联执行？",
      "a4": "完全支持。内置 DAG 引擎支持配置前后置依赖关系，具备严格的拓扑排序与循环依赖检测机制。",
      "q5": "长周期下的上下文记忆如何处理？",
      "a5": "每个任务拥有独立的持久记忆文件夹 .opencode/cron/memory/，每次轮次自动进行事实提取与压缩，确保不超出上下文窗口。",
      "q6": "是否有图形用户界面？",
      "a6": "有。提供运行在 localhost:4488 的现代化 Web 控制台及跨平台桌面应用，支持实时日志流、优先级队列与 Token 消耗审计。"
    },
    "cta": {
      "title": "准时调度智能体。",
      "lead": "直接在本地终端中运行会话绑定的自动化 AI 任务。",
      "inspectGithub": "查看 GitHub 仓库",
      "subtext": "完全开源，零遥测，本地优先。"
    }
  },
  "ja": {
    "dir": "ltr",
    "nav": {
      "showcase": "デモ",
      "features": "機能",
      "architecture": "設計",
      "standards": "基準",
      "questions": "よくある質問",
      "install": "CLI でインストール",
      "menu": "メニュー"
    },
    "hero": {
      "title1": "エージェントを",
      "title2": "時間通りに。",
      "lead": "永続メモリ、DAG パイプライン、リアルタイム管理コンソールを備えた、OpenCode AI エージェント向けのセッション連動型 cron スケジューラ。",
      "install": "CLI でインストール",
      "inspectGithub": "GitHub リポジトリを見る"
    },
    "showcase": {
      "chipWatchdog": "テスト監視 (30分)",
      "chipBurst": "インシデント急増対応 (45分)",
      "chipDag": "DAG パイプライン",
      "title": "Mission Control セッションサーバ",
      "status": "ワーカー稼働中",
      "statJob": "実行ジョブ",
      "statCadence": "実行間隔",
      "statMemory": "メモリコンテキスト",
      "caption": "レギオモンタヌスのアストロラーベ (1462年)、メトロポリタン美術館 CC0 パブリックドメイン。天体周期計算の高精度計器。"
    },
    "features": {
      "f1Title": "スケジュールされた指示ごとに専用セッションを提供。",
      "f1Desc": ".opencode/cron/memory/ にコンテキストが永続化され、自動トークン圧縮が行われます。",
      "f2Title": "依存関係を持つエージェントを連携する DAG パイプライン。",
      "f2Desc": "先行ジョブの成功または失敗に応じて、後続トリガーがメモリデータを引き継ぎ自動起動します。",
      "f3Title": "外部 API からの受信 Webhook トリガーに対応。",
      "f3Desc": "HMAC SHA-256 署名と暗号化ベアラートークンにより不正な外部実行を遮断します。",
      "f4Title": "サーキットブレーカーとデッドレターキューで障害を隔離。",
      "f4Desc": "連続エラー発生時にタスクを自動隔離し、トークンの無駄な消費を防いで Web GUI に通知します。",
      "f5Title": "アクティビティに応じた適応型ケイデンスとバーストモード。",
      "f5Desc": "インシデント発生時は1分間隔に加速し、非稼働時間帯は自動で間隔を広げます。"
    },
    "how": {
      "title": "実行シーケンス",
      "step1": "まず CLI とデーモンをセットアップします。",
      "step2": "次にセッション連動型のエージェントジョブを登録します。",
      "step3": "ローカルの Mission Control 画面でジョブを確認します。",
      "tabGui": "Mission Control Web GUI",
      "tabCli": "ターミナルデーモン CLI",
      "guiVideoCaption": "Mission Control 管理画面：アクティブジョブ指標、ワンクリックバーストモード、対話型 DAG パイプラインモーダル、リアルタイムログ配信。",
      "cliVideoCaption": "ターミナル自律実行ウォークスルー：launchd 初期設定、セッションバインド、DAG 連鎖、デーモンリアルタイム実行。"
    },
    "proof": {
      "title": "運用基準と信頼性",
      "captionVideo": "機械仕掛けの振り子時計、CC0 ウィキメディア・コモンズ。自律的で安定した刻時。",
      "captionSchematic": "アンリ・ド・ヴィックの脱進機設計図 (1379年)、パブリックドメイン。",
      "thDomain": "アーキテクチャ領域",
      "thSpec": "仕様",
      "thVerif": "実証検証",
      "thStatus": "プロトコル状態"
    },
    "faq": {
      "title": "技術仕様と詳細",
      "subtitle": "アコーディオン不要、すべての回答を直接確認できます。",
      "q1": "クラウドの有料契約は必要ですか？",
      "a1": "いいえ。OS 標準のデーモン（macOS の launchd、Linux の systemd、Windows のタスクスケジューラ）とローカル JSON 保存により、すべてローカルマシン上で完全に動作します。",
      "q2": "稼働中の OpenCode セッションとどのように連携しますか？",
      "a2": "定期ローテーションされる資格情報を用いて OpenCode のローカル sidecar HTTP に直接接続します。",
      "q3": "プロンプトの実行に失敗した場合はどうなりますか？",
      "a3": "デッドレターキュー（DLQ）が連続失敗を検知し、サーキットブレーカーを作動させてジョブを隔離します。",
      "q4": "ジョブ間で連鎖起動できますか？",
      "a4": "はい。DAG パイプラインにより循環依存の検知とメモリ共有を伴う連鎖実行が可能です。",
      "q5": "長期的なコンテキストメモリはどう管理されますか？",
      "a5": "各ジョブが .opencode/cron/memory/ を保持し、ターンごとに要約・圧縮してトークン制限を守ります。",
      "q6": "グラフィカルな画面はありますか？",
      "a6": "はい。localhost:4488 で動作するフル機能の Web GUI およびデスクトップアプリが付属します。"
    },
    "cta": {
      "title": "セッションを正確なスケジュールで。",
      "lead": "インテリジェントな定期タスクを今すぐターミナルから実行。",
      "inspectGithub": "GitHub リポジトリを見る",
      "subtext": "完全オープンソース、テレメトリなし、ローカルファースト。"
    }
  },
  "ru": {
    "dir": "ltr",
    "nav": {
      "showcase": "Демо",
      "features": "Функции",
      "architecture": "Архитектура",
      "standards": "Стандарты",
      "questions": "Вопросы",
      "install": "Установить через CLI",
      "menu": "Меню"
    },
    "hero": {
      "title1": "Агенты работают",
      "title2": "точно в срок.",
      "lead": "Интеллектуальный планировщик cron с привязкой к сессиям для ИИ-агентов OpenCode: постоянная память, пайплайны DAG и консоль Mission Control в реальном времени.",
      "install": "Установить через CLI",
      "inspectGithub": "Репозиторий на GitHub"
    },
    "showcase": {
      "chipWatchdog": "Мониторинг тестов (30 мин)",
      "chipBurst": "Всплеск инцидентов (45 мин)",
      "chipDag": "DAG-пайплайн",
      "title": "Сервер сессий Mission Control",
      "status": "АКТИВНЫЙ ВОРКЕР",
      "statJob": "Активный процесс",
      "statCadence": "Интервал",
      "statMemory": "Контекст памяти",
      "caption": "Астролябия Региомонтана (1462 г.), Метрополитен-музей CC0. Высокоточный инструмент для расчета циклических интервалов."
    },
    "features": {
      "f1Title": "Выделенные сессии для каждого запланированного промпта.",
      "f1Desc": "Память сохраняется между шагами в .opencode/cron/memory/ с автоматическим сжатием контекста токенов.",
      "f2Title": "Многошаговые пайплайны DAG для цепочек зависимых агентов.",
      "f2Desc": "Последующие триггеры запускаются автоматически при успехе или ошибке с передачей состояния памяти.",
      "f3Title": "Входящие вебхуки для запуска из внешних API.",
      "f3Desc": "Криптографические подписи HMAC SHA-256 и токены Bearer защищают от несанкционированных вызовов.",
      "f4Title": "Circuit breaker и Dead Letter Queue для изоляции сбоев.",
      "f4Desc": "Изолирует повторяющиеся ошибки после серии неудач, предотвращая расход токенов, и отправляет уведомление в Web GUI.",
      "f5Title": "Адаптивная частота и режим всплеска по уровню активности.",
      "f5Desc": "Ускоряется до 1-минутных интервалов при активных инцидентах и снижает частоту в спокойные часы."
    },
    "how": {
      "title": "Последовательность выполнения",
      "step1": "Сначала установите CLI и системную службу.",
      "step2": "Затем настройте задачи агентов с привязкой к сессии.",
      "step3": "Контролируйте задачи в локальном интерфейсе Mission Control.",
      "tabGui": "Web GUI Mission Control",
      "tabCli": "Терминальный демон CLI",
      "guiVideoCaption": "Интерфейс Mission Control: метрики активных задач, режим всплеска в один клик, интерактивное модальное окно пайплайна DAG и поток логов в реальном времени.",
      "cliVideoCaption": "Автономный запуск в терминале: настройка launchd, привязка сессий, цепочка DAG и выполнение демона в реальном времени."
    },
    "proof": {
      "title": "Эксплуатационные стандарты",
      "captionVideo": "Механизм маятниковых часов, CC0 через Викисклад. Непрерывный автономный ход.",
      "captionSchematic": "Механический спуск Де Вика (1379 г.), Общественное достояние via Викисклад.",
      "thDomain": "Область архитектуры",
      "thSpec": "Спецификация",
      "thVerif": "Эмпирическая проверка",
      "thStatus": "Статус протокола"
    },
    "faq": {
      "title": "Технические характеристики",
      "subtitle": "Прямые ответы без скрытых спойлеров и вкладок.",
      "q1": "Требуется ли облачная подписка?",
      "a1": "Нет. Все работает полностью локально на вашем компьютере через системные службы ОС (launchd в macOS, systemd в Linux, Планировщик заданий в Windows) и локальные файлы JSON.",
      "q2": "Как планировщик связывается с сессиями OpenCode?",
      "a2": "Подключается напрямую к HTTP-транспорту локального сайдкара OpenCode с ротацией учетных данных и токенов сессий без перезапуска агентов.",
      "q3": "Что происходит при ошибке промпта?",
      "a3": "Очередь Dead Letter Queue перехватывает сбои, срабатывает circuit breaker для защиты от перерасхода токенов, изолируя задачу до проверки в Web GUI или CLI.",
      "q4": "Могут ли задачи запускать друг друга?",
      "a4": "Да. Пайплайны DAG поддерживают настройку зависимостей с передачей контекста памяти и проверкой циклических связей.",
      "q5": "Как устроена долгосрочная память?",
      "a5": "Каждая задача ведет файл памяти в .opencode/cron/memory/, который суммаризируется и сжимается на каждом шаге для соблюдения лимитов токенов.",
      "q6": "Есть ли графический интерфейс?",
      "a6": "Да. Полнофункциональный Web GUI и десктопное приложение работают на localhost:4488 с живыми логами, очередями приоритетов и аудитом токенов."
    },
    "cta": {
      "title": "Запускайте сессии вовремя.",
      "lead": "Интеллектуальные cron-задачи с привязкой к сессии прямо в вашем терминале.",
      "inspectGithub": "Репозиторий на GitHub",
      "subtext": "Открытый исходный код, без телеметрии, локальное исполнение."
    }
  },
  "ar": {
    "dir": "rtl",
    "nav": {
      "showcase": "المعرض",
      "features": "المميزات",
      "architecture": "البنية",
      "standards": "المعايير",
      "questions": "الأسئلة",
      "install": "التثبيت عبر CLI",
      "menu": "القائمة"
    },
    "hero": {
      "title1": "الوكلاء يعملون",
      "title2": "في الوقت المحدد.",
      "lead": "مجدول cron ذكي مرتبط بالجلسات لوكلاء OpenCode للذكاء الاصطناعي: ذاكرة دائمة وخطوط أنابيب DAG ولوحة تحكم حية.",
      "install": "التثبيت عبر CLI",
      "inspectGithub": "مستودع GitHub"
    },
    "showcase": {
      "chipWatchdog": "مراقبة الاختبارات (30 دقيقة)",
      "chipBurst": "استجابة الطوارئ (45 دقيقة)",
      "chipDag": "خط أنابيب DAG",
      "title": "خادم جلسات Mission Control",
      "status": "عامل نشط",
      "statJob": "المهمة النشطة",
      "statCadence": "الدورة الزمنية",
      "statMemory": "سياق الذاكرة",
      "caption": "أسطرلاب ريجيومونتانوس (1462)، متحف المتروبوليتان للفنون CC0. أداة دقيقة لحساب الدورات الزمنية."
    },
    "features": {
      "f1Title": "جلسات مخصصة لكل مطالبة مجدولة.",
      "f1Desc": "تستمر الذاكرة عبر الجولات في .opencode/cron/memory/ مع ضغط تلقائي للرموز.",
      "f2Title": "خطوط أنابيب DAG متعددة المراحل لربط مهام الوكلاء المترابطة.",
      "f2Desc": "تنطلق المهام اللاحقة تلقائياً عند النجاح أو الفشل مع تمرير حمولة الذاكرة.",
      "f3Title": "نقاط Webhook واردة للتشغيل من واجهات برمجة التطبيقات الخارجية.",
      "f3Desc": "توقيعات HMAC SHA-256 المشفرة ورموز Bearer تمنع أي تشغيل غير مصرح به.",
      "f4Title": "قاطع الدائرة وقائمة الرسائل الميتة لعزل الأخطاء.",
      "f4Desc": "حجر صحي تلقائي للمهام المتعثرة بعد إخفاقات متتالية لمنع هدر الرصيد والإخطار عبر الواجهة.",
      "f5Title": "تردد تكيفي ووضع التدفق السريع حسب النشاط.",
      "f5Desc": "تسريع إلى فترات مدتها دقيقة واحدة أثناء الطوارئ والتراجع في الفترات الهادئة."
    },
    "how": {
      "title": "تسلسل التنفيذ",
      "step1": "أولاً، قم بتثبيت واجهة الأوامر وخادم النظام.",
      "step2": "ثم قم بجدولة مهام الوكلاء المرتبطة بالجلسات.",
      "step3": "افحص المهام من خلال لوحة تحكم Mission Control المحلية.",
      "tabGui": "واجهة Mission Control عبر الويب",
      "tabCli": "واجهة أوامر خادم الطرفية",
      "guiVideoCaption": "واجهة Mission Control: مقاييس المهام النشطة، وضع التدفق السريع بنقرة واحدة، نافذة خط أنابيب DAG التفاعلية، وبث السجلات المباشر.",
      "cliVideoCaption": "جولة التنفيذ الذاتي عبر الطرفية: إعداد launchd، ربط الجلسات، سلسلة DAG، والتنفيذ المباشر لخادم النظام."
    },
    "proof": {
      "title": "المعايير التشغيلية",
      "captionVideo": "حركة الساعة الميكانيكية، CC0 عبر ويكيميديا كومنز. دوران مستقل ومستمر.",
      "captionSchematic": "مخطط ميزان دي ويك (1379)، ملكية عامة عبر ويكيميديا كومنز.",
      "thDomain": "مجال البنية",
      "thSpec": "المواصفات",
      "thVerif": "التحقق العملي",
      "thStatus": "حالة البروتوكول"
    },
    "faq": {
      "title": "المواصفات التقنية",
      "subtitle": "جميع الإجابات مقدمة بشكل مباشر وبدون قوائم منسدلة مغلقة.",
      "q1": "هل يتطلب اشتراكاً سحابياً؟",
      "a1": "لا. كل شيء يعمل محلياً بالكامل على جهازك عبر خدمات النظام القياسية وتخزين JSON المحلي.",
      "q2": "كيف يتفاعل مع جلسات OpenCode النشطة؟",
      "a2": "يتصل مباشرة عبر بروتوكول HTTP لقناة sidecar التابعة لـ OpenCode مع تدوير بيانات الاعتماد بدون إعادة تشغيل الوكلاء.",
      "q3": "ماذا يحدث عند فشل تنفيذ مطالبة؟",
      "a3": "تقوم قائمة DLQ باعتراض الفشل المتكرر وتشغيل قاطع الدائرة لمنع استنزاف الرموز وعزل المهمة حتى مراجعتها.",
      "q4": "هل يمكن للمهام تشغيل بعضها البعض؟",
      "a4": "نعم. تتيح خطوط أنابيب DAG تحديد التبعيات مع التحقق من عدم وجود حلقات مغلقة وتمرير الذاكرة.",
      "q5": "كيف تتم إدارة ذاكرة السياق؟",
      "a5": "تحتفظ كل مهمة بذاكرة دائمة في .opencode/cron/memory/ يتم تلخيصها وضغطها مع كل جولة للحفاظ على حدود السياق.",
      "q6": "هل توجد واجهة مستخدم رسومية؟",
      "a6": "نعم. يتوفر تطبيق ويب وسطح مكتب كامل على localhost:4488 مع سجلات فورية وطوابير أولوية وتدقيق الرموز."
    },
    "cta": {
      "title": "جلسات في موعدها.",
      "lead": "قم بتشغيل مهام cron ذكية مرتبطة بالجلسات مباشرة من جهازك.",
      "inspectGithub": "مستودع GitHub",
      "subtext": "مفتوح المصدر، بدون تتبع، تنفيذ محلي أولاً."
    }
  }
};

  const LANGS = [
    { code: "en", name: "English" },
    { code: "it", name: "Italiano" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "pt", name: "Português" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ru", name: "Русский" },
    { code: "ar", name: "العربية" }
  ];

  function resolve(lang) {
    if (!lang) return "en";
    const lower = String(lang).toLowerCase();
    if (dict[lower]) return lower;
    const base = lower.split("-")[0];
    if (dict[base]) return base;
    return "en";
  }

  function get(path, lang) {
    const obj = dict[lang] || dict.en;
    if (!obj) return undefined;
    const res = path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
    if (res !== undefined) return res;
    // Fallback to English if key missing in target language
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, dict.en);
  }

  function apply(lang) {
    const code = resolve(lang);
    const d = dict[code] || dict.en;
    const html = document.documentElement;
    html.setAttribute("lang", code);
    html.setAttribute("dir", d.dir === "rtl" ? "rtl" : "ltr");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      const val = get(key, code);
      if (val != null) {
        el.textContent = String(val);
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = get(key, code);
      if (val != null) {
        el.setAttribute("placeholder", String(val));
      }
    });

    // Update active state in language options
    document.querySelectorAll("[data-lang-code]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang-code") === code);
      btn.setAttribute("aria-selected", String(btn.getAttribute("data-lang-code") === code));
    });

    const langToggleBtn = document.querySelector(".lang-toggle-btn");
    if (langToggleBtn) {
      langToggleBtn.textContent = code.toUpperCase();
    }

    try {
      localStorage.setItem(STORE_KEY, code);
    } catch (_) {}

    document.dispatchEvent(new CustomEvent("oc:langchange", { detail: { lang: code } }));
  }

  function detect() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved && dict[saved]) return saved;
    } catch (_) {}
    const nav = (navigator.languages || [navigator.language || "en"]).map(resolve);
    return nav[0] || "en";
  }

  window.OC_LANGS = LANGS;
  window.OC_I18N = {
    apply: apply,
    setLang: apply,
    detect: detect,
    current: function () {
      try {
        const saved = localStorage.getItem(STORE_KEY);
        if (saved && dict[saved]) return saved;
      } catch (_) {}
      return resolve(document.documentElement.getAttribute("lang") || "en");
    },
    dict: dict
  };

  document.addEventListener("DOMContentLoaded", function () {
    apply(detect());
  });

})();
