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
    en: {
      dir: "ltr",
      nav: {
        showcase: "Showcase",
        features: "Features",
        architecture: "Architecture",
        standards: "Standards",
        questions: "Questions",
        install: "Install via CLI"
      },
      hero: {
        title1: "Agents run",
        title2: "on time.",
        lead: "Intelligent session-bound cron scheduling for OpenCode AI agents with persistent memory, DAG pipelines, and real-time mission control.",
        install: "Install via CLI",
        inspectGithub: "Inspect GitHub Repository"
      },
      showcase: {
        chipWatchdog: "Watchdog (30m)",
        chipBurst: "Incident burst (45m)",
        chipDag: "DAG Pipeline",
        title: "Mission Control Session Server",
        status: "ACTIVE WORKER",
        statJob: "Active Job",
        statCadence: "Cadence",
        statMemory: "Memory Context",
        caption: "Astrolabe by Regiomontanus (1462), The Metropolitan Museum of Art. Precision instrumentation for calculating cyclical intervals."
      },
      features: {
        f1Title: "Dedicated sessions for every scheduled prompt.",
        f1Desc: "Memory persists across turns in .opencode/cron/memory/ with automatic token compaction.",
        f2Title: "Multi-step DAG pipelines chain dependent agent jobs.",
        f2Desc: "Downstream triggers fire automatically on success or failure with memory payload passing.",
        f3Title: "Inbound webhooks trigger jobs from external APIs.",
        f3Desc: "HMAC SHA-256 signatures and cryptographic bearer tokens prevent unauthorized dispatch.",
        f4Title: "Circuit breaker and Dead Letter Queue isolate errors.",
        f4Desc: "Quarantines recurring errors after consecutive failures and notifies via Web GUI.",
        f5Title: "Adaptive cadence and burst mode adjust to activity.",
        f5Desc: "Spins up 1-minute execution intervals during active incidents and backs off during quiet hours."
      },
      how: {
        title: "Execution sequence",
        step1: "First, install the CLI and launch daemon.",
        step2: "Then schedule your session-bound agent jobs.",
        step3: "Inspect jobs in the local Mission Control interface.",
        videoCaption: "Autonomous execution walkthrough: launchd setup, session binding, DAG chain, and live Mission Control feed."
      },
      proof: {
        title: "Operational standards",
        captionVideo: "Mechanical clockwork movement, CC0 via Wikimedia Commons. Continuous autonomous cadence.",
        captionSchematic: "De Wick escapement mechanism (1379), Public Domain via Wikimedia Commons.",
        captionBrand: "Brand Identity and Design Guidelines Spec Board. Precision astronomical geometry, neural agent core, and system tokens.",
        thDomain: "Architecture Domain",
        thSpec: "Specification",
        thVerif: "Empirical Verification",
        thStatus: "Protocol Status"
      },
      faq: {
        title: "Technical specifications",
        subtitle: "Everything answered directly without accordion toggles.",
        q1: "Does it require a cloud subscription?",
        a1: "No. Everything runs completely locally on your machine via standard operating system daemons (launchd on macOS, systemd on Linux, Task Scheduler on Windows) and local JSON persistence.",
        q2: "How does it interact with running OpenCode sessions?",
        a2: "It connects directly to OpenCode sidecar HTTP transport using rotating credentials and session tokens, preserving continuity across turns without restarting agents.",
        q3: "What happens if a prompt fails?",
        a3: "The Dead Letter Queue intercepts consecutive failures, trips the circuit breaker to prevent token waste, and quarantines the job until reviewed in the Web GUI or CLI.",
        q4: "Can jobs trigger each other?",
        a4: "Yes. DAG pipelines allow defining upstream and downstream dependencies with optional memory payload passing and cycle detection.",
        q5: "How is context memory handled?",
        a5: "Each job maintains persistent memory in .opencode/cron/memory/, summarized and pruned on each turn to preserve token limits without losing state.",
        q6: "Is there a graphical user interface?",
        a6: "Yes. A full Web GUI and cross-platform desktop application runs on localhost:4488 with live logs, priority queues, and token inspection."
      },
      cta: {
        title: "Schedule sessions on time.",
        lead: "Run intelligent, session-bound cron tasks directly in your terminal.",
        inspectGithub: "Inspect GitHub Repository",
        subtext: "Open source, zero telemetry, local-first execution."
      }
    },
    it: {
      dir: "ltr",
      nav: {
        showcase: "Demo",
        features: "Funzionalita",
        architecture: "Architettura",
        standards: "Standard",
        questions: "Domande",
        install: "Installa da CLI"
      },
      hero: {
        title1: "Gli agenti partono",
        title2: "in orario.",
        lead: "Schedulatore cron intelligente vincolato a sessioni per agenti AI OpenCode, con memoria persistente, pipeline DAG e console di controllo in tempo reale.",
        install: "Installa da CLI",
        inspectGithub: "Visualizza Repository GitHub"
      },
      showcase: {
        chipWatchdog: "Watchdog (30m)",
        chipBurst: "Burst incidente (45m)",
        chipDag: "Pipeline DAG",
        title: "Server Sessioni Mission Control",
        status: "WORKER ATTIVO",
        statJob: "Job Attivo",
        statCadence: "Cadenza",
        statMemory: "Contesto Memoria",
        caption: "Astrolabio di Regiomontanus (1462), The Metropolitan Museum of Art. Strumentazione di precisione per il calcolo di intervalli ciclici."
      },
      features: {
        f1Title: "Sessioni dedicate per ogni prompt programmato.",
        f1Desc: "La memoria persiste tra i turni in .opencode/cron/memory/ con compattazione automatica dei token.",
        f2Title: "Pipeline DAG multi-step per concatenare job agenti.",
        f2Desc: "I trigger a valle partono automaticamente su successo o errore passando il payload di memoria.",
        f3Title: "Webhook in entrata per trigger da API esterne.",
        f3Desc: "Firme crittografiche HMAC SHA-256 e token bearer prevengono esecuzioni non autorizzate.",
        f4Title: "Circuit breaker e Dead Letter Queue isolano gli errori.",
        f4Desc: "Mette in quarantena gli errori ricorrenti dopo fallimenti consecutivi e notifica via GUI web.",
        f5Title: "Cadenza adattiva e burst mode in base all'attivita.",
        f5Desc: "Attiva intervalli di esecuzione a 1 minuto durante incidenti e rallenta nelle ore tranquille."
      },
      how: {
        title: "Sequenza di esecuzione",
        step1: "Prima, installa la CLI e il demone di avvio.",
        step2: "Poi programma i job degli agenti vincolati a sessione.",
        step3: "Ispeziona i job nell'interfaccia Mission Control locale.",
        videoCaption: "Dimostrazione dell'esecuzione autonoma: setup launchd, session binding, DAG e feed live Mission Control."
      },
      proof: {
        title: "Standard operativi",
        captionVideo: "Movimento di orologeria meccanica, CC0 via Wikimedia Commons. Cadenza autonoma e continua.",
        captionSchematic: "Meccanismo di scappamento De Wick (1379), Pubblico Dominio via Wikimedia Commons.",
        captionBrand: "Tavola di Brand Identity e Linee Guida di Design. Geometria astronomica di precisione, nucleo neurale e token di sistema.",
        thDomain: "Dominio Architetturale",
        thSpec: "Specifica",
        thVerif: "Verifica Empirica",
        thStatus: "Stato Protocollo"
      },
      faq: {
        title: "Specifiche tecniche",
        subtitle: "Tutto spiegato direttamente senza menu a tendina chiusi.",
        q1: "Richiede un abbonamento cloud?",
        a1: "No. Tutto gira completamente in locale sul tuo computer tramite i demoni standard del sistema operativo (launchd su macOS, systemd su Linux, Utilità di pianificazione su Windows) e salvataggi JSON locali.",
        q2: "Come interagisce con le sessioni OpenCode attive?",
        a2: "Si connette direttamente al trasporto HTTP del sidecar di OpenCode usando credenziali e token di sessione ruotati, preservando la continuita dei turni senza riavviare gli agenti.",
        q3: "Cosa succede se un prompt fallisce?",
        a3: "La Dead Letter Queue intercetta gli errori consecutivi, scatta il circuit breaker per evitare spreco di token e isola il job fino a revisione.",
        q4: "I job possono attivarsi a vicenda?",
        a4: "Si. Le pipeline DAG consentono di definire dipendenze a monte e a valle con passaggio opzionale di memoria e rilevamento cicli.",
        q5: "Come viene gestita la memoria di contesto?",
        a5: "Ogni job mantiene una memoria persistente in .opencode/cron/memory/, riassunta e compattata ad ogni turno per rispettare i limiti di contesto.",
        q6: "Esiste un'interfaccia grafica?",
        a6: "Si. Una Web GUI completa e applicazione desktop multipiattaforma e disponibile su localhost:4488 con log live e code prioritizzate."
      },
      cta: {
        title: "Sessioni in orario.",
        lead: "Esegui compiti cron intelligenti e vincolati a sessione direttamente dal terminale.",
        inspectGithub: "Visualizza Repository GitHub",
        subtext: "Open source, zero telemetria, esecuzione completamente locale."
      }
    },
    es: {
      dir: "ltr",
      nav: {
        showcase: "Demostracion",
        features: "Funciones",
        architecture: "Arquitectura",
        standards: "Estandares",
        questions: "Preguntas",
        install: "Instalar por CLI"
      },
      hero: {
        title1: "Los agentes operan",
        title2: "a tiempo.",
        lead: "Programador cron inteligente vinculado a sesiones para agentes de IA OpenCode con memoria persistente, pipelines DAG y panel de control en tiempo real.",
        install: "Instalar por CLI",
        inspectGithub: "Ver Repositorio en GitHub"
      },
      showcase: {
        chipWatchdog: "Watchdog (30m)",
        chipBurst: "Rafaga incidente (45m)",
        chipDag: "Pipeline DAG",
        title: "Servidor de Sesiones Mission Control",
        status: "WORKER ACTIVO",
        statJob: "Tarea Activa",
        statCadence: "Cadencia",
        statMemory: "Contexto Memoria",
        caption: "Astrolabio de Regiomontanus (1462), The Metropolitan Museum of Art. Instrumento de precision para calcular intervalos ciclicos."
      },
      features: {
        f1Title: "Sesiones dedicadas para cada instruccion programada.",
        f1Desc: "La memoria persiste entre turnos en .opencode/cron/memory/ con compactacion automatica de tokens.",
        f2Title: "Pipelines DAG para encadenar tareas de agentes dependientes.",
        f2Desc: "Los disparadores aguas abajo se activan automaticamente al finalizar con exito o fallo.",
        f3Title: "Webhooks entrantes para activacion desde APIs externas.",
        f3Desc: "Firmas criptograficas HMAC SHA-256 y tokens portadores evitan ejecuciones no autorizadas.",
        f4Title: "Interruptor automatico y Dead Letter Queue aislan errores.",
        f4Desc: "Pone en cuarentena errores recurrentes tras fallos consecutivos y notifica mediante la interfaz web.",
        f5Title: "Cadencia adaptativa y modo rafaga segun la actividad.",
        f5Desc: "Acelera a intervalos de 1 minuto durante incidentes activos y reduce la frecuencia en horas calmas."
      },
      how: {
        title: "Secuencia de ejecucion",
        step1: "Primero, instala la CLI y el demonio de inicio.",
        step2: "Luego programa las tareas de agentes vinculadas a sesion.",
        step3: "Inspecciona los trabajos en la interfaz local Mission Control.",
        videoCaption: "Recorrido de ejecucion autonoma: configuracion launchd, vinculacion de sesion, DAG y panel en vivo."
      },
      proof: {
        title: "Estandares operativos",
        captionVideo: "Mecanismo de relojeria, CC0 via Wikimedia Commons. Cadencia autonoma continua.",
        captionSchematic: "Mecanismo de escape De Wick (1379), Dominio Publico via Wikimedia Commons.",
        captionBrand: "Painel de Identidade de Marca e Diretrizes de Design. Geometria astronomica de precisao, nucleo neural e tokens de sistema.",
        captionBrand: "Panel de Identidad de Marca y Guias de Diseno. Geometria astronomica de precision, nucleo neuronal y tokens de sistema.",
        thDomain: "Dominio Arquitectonico",
        thSpec: "Especificacion",
        thVerif: "Verificacion Empirica",
        thStatus: "Estado del Protocolo"
      },
      faq: {
        title: "Especificaciones tecnicas",
        subtitle: "Todo explicado directamente sin menus desplegables cerrados.",
        q1: "Requiere suscripcion en la nube?",
        a1: "No. Todo se ejecuta localmente en tu maquina mediante demonios estandar del sistema operativo y persistencia JSON local.",
        q2: "Como interactua con sesiones activas de OpenCode?",
        a2: "Se conecta directamente al transporte HTTP del sidecar de OpenCode con credenciales rotativas, preservando la continuidad de turnos.",
        q3: "Que sucede si una instruccion falla?",
        a3: "La Dead Letter Queue intercepta fallos repetidos, activa el interruptor de proteccion y pone en cuarentena la tarea.",
        q4: "Pueden las tareas activarse entre si?",
        a4: "Si. Las pipelines DAG permiten definir dependencias ascendentes y descendentes con deteccion de ciclos.",
        q5: "Como se gestiona la memoria de contexto?",
        a5: "Cada tarea mantiene memoria persistente en .opencode/cron/memory/, resumida y compactada en cada turno.",
        q6: "Hay interfaz grafica?",
        a6: "Si. Una aplicacion web y de escritorio completa corre en localhost:4488 con registros en vivo y colas de prioridad."
      },
      cta: {
        title: "Sesiones a tiempo.",
        lead: "Ejecuta tareas cron inteligentes vinculadas a sesion directamente en tu terminal.",
        inspectGithub: "Ver Repositorio en GitHub",
        subtext: "Codigo abierto, cero telemetria, ejecucion local prioritaria."
      }
    },
    fr: {
      dir: "ltr",
      nav: {
        showcase: "Apercu",
        features: "Fonctions",
        architecture: "Architecture",
        standards: "Normes",
        questions: "Questions",
        install: "Installer via CLI"
      },
      hero: {
        title1: "Les agents tournent",
        title2: "a l'heure.",
        lead: "Planificateur cron intelligent lie aux sessions pour agents IA OpenCode avec memoire persistante, pipelines DAG et tableau de bord en temps reel.",
        install: "Installer via CLI",
        inspectGithub: "Consulter sur GitHub"
      },
      showcase: {
        chipWatchdog: "Watchdog (30m)",
        chipBurst: "Rafale incident (45m)",
        chipDag: "Pipeline DAG",
        title: "Serveur de Session Mission Control",
        status: "WORKER ACTIF",
        statJob: "Tache Active",
        statCadence: "Cadence",
        statMemory: "Memoire",
        caption: "Astrolabe de Regiomontanus (1462), The Metropolitan Museum of Art. Instrument de calcul cyclique de precision."
      },
      features: {
        f1Title: "Sessions dediees pour chaque requete programmee.",
        f1Desc: "La memoire persiste d'un tour a l'autre dans .opencode/cron/memory/ avec compactage automatique.",
        f2Title: "Pipelines DAG pour enchainer les agents dependants.",
        f2Desc: "Les declencheurs avals s'executent automatiquement en cas de succes ou d'echec avec partage de contexte.",
        f3Title: "Webhooks entrants pour declenchement depuis des APIs externes.",
        f3Desc: "Signatures HMAC SHA-256 et jetons porteurs empechant toute execution non autorisee.",
        f4Title: "Disjoncteur et Dead Letter Queue pour isoler les erreurs.",
        f4Desc: "Met en quarantaine les erreurs recurrentes apres plusieurs echecs consecutifs et alerte sur l'interface.",
        f5Title: "Cadence adaptative et mode rafale selon l'activite.",
        f5Desc: "Passe a des intervalles de 1 minute lors d'incidents et ralentit en periode calme."
      },
      how: {
        title: "Sequence d'execution",
        step1: "D'abord, installez la CLI et le daemon systeme.",
        step2: "Puis programmez vos taches liees a une session.",
        step3: "Inspectez vos taches dans la console locale Mission Control.",
        videoCaption: "Demonstration de l'execution autonome: configuration launchd, liaison de session, DAG et console en direct."
      },
      proof: {
        title: "Normes operationnelles",
        captionVideo: "Mouvement d'horlogerie mecanique, CC0 via Wikimedia Commons. Cadence autonome continue.",
        captionSchematic: "Echappement mecanique De Wick (1379), Domaine Public via Wikimedia Commons.",
        captionBrand: "Planche d'identite de marque et directives de conception. Geometrie astronomique de precision, noyau neural et tokens systeme.",
        thDomain: "Domaine Architectural",
        thSpec: "Specification",
        thVerif: "Verification Empirique",
        thStatus: "Etat Protocole"
      },
      faq: {
        title: "Specifications techniques",
        subtitle: "Toutes les reponses fournies directement sans menus deroulants fermes.",
        q1: "Un abonnement cloud est-il requis?",
        a1: "Non. Tout fonctionne entierement en local grace aux daemons standards de votre systeme d'exploitation et persistance JSON locale.",
        q2: "Comment interagit-il avec les sessions OpenCode en cours?",
        a2: "Il se connecte directement au transport HTTP sidecar d'OpenCode avec rotation des identifiants et jetons de session.",
        q3: "Que se passe-t-il en cas d'echec d'une tache?",
        a3: "La Dead Letter Queue intercepte les echecs repetes, declenche le disjoncteur pour eviter le gaspillage de tokens et met la tache en quarantaine.",
        q4: "Les taches peuvent-elles se declencher mutuellement?",
        a4: "Oui. Les pipelines DAG permettent d'ordonnancer des dependances amont et aval avec detection de boucles.",
        q5: "Comment la memoire de contexte est-elle geree?",
        a5: "Chaque tache possede une memoire persistante dans .opencode/cron/memory/, resumee et compactee a chaque execution.",
        q6: "Y a-t-il une interface graphique?",
        a6: "Oui. Une application Web et Desktop complete tourne sur localhost:4488 avec journaux en direct et files d'attente prioritaires."
      },
      cta: {
        title: "Sessions a l'heure.",
        lead: "Executez des taches cron intelligentes liees a une session directement dans votre terminal.",
        inspectGithub: "Consulter sur GitHub",
        subtext: "Open source, zero telemetrie, execution locale d'abord."
      }
    },
    de: {
      dir: "ltr",
      nav: {
        showcase: "Demo",
        features: "Funktionen",
        architecture: "Architektur",
        standards: "Standards",
        questions: "Fragen",
        install: "Per CLI installieren"
      },
      hero: {
        title1: "Agenten laufen",
        title2: "punktlich.",
        lead: "Intelligenter, sitzungsgebundener Cron-Scheduler fur OpenCode-KI-Agenten mit persistentem Speicher, DAG-Pipelines und Echtzeit-Kontrollzentrum.",
        install: "Per CLI installieren",
        inspectGithub: "GitHub Repository ansehen"
      },
      showcase: {
        chipWatchdog: "Watchdog (30m)",
        chipBurst: "Vorfall-Burst (45m)",
        chipDag: "DAG-Pipeline",
        title: "Mission Control Sitzungs-Server",
        status: "AKTIVER WORKER",
        statJob: "Aktiver Job",
        statCadence: "Taktung",
        statMemory: "Speicher-Kontext",
        caption: "Astrolabium von Regiomontanus (1462), The Metropolitan Museum of Art. Prazisionsinstrument fur zyklische Berechnungen."
      },
      features: {
        f1Title: "Dedizierte Sitzungen fur jeden geplanten Prompt.",
        f1Desc: "Der Speicher bleibt uber Runden hinweg in .opencode/cron/memory/ mit automatischer Token-Kompaktierung erhalten.",
        f2Title: "Mehrstufige DAG-Pipelines fur abhangige Agenten-Jobs.",
        f2Desc: "Nachgelagerte Trigger starten automatisch bei Erfolg oder Fehler mit Speicherweitergabe.",
        f3Title: "Eingehende Webhooks fur Trigger uber externe APIs.",
        f3Desc: "Kryptografische HMAC-SHA-256-Signaturen und Bearer-Token verhindern unbefugte Ausfuhrungen.",
        f4Title: "Leitungsschutzschalter und Dead Letter Queue isolieren Fehler.",
        f4Desc: "Quarantaniert wiederkehrende Fehler nach Fehlschlagon und benachrichtigt uber die Web-Oberflache.",
        f5Title: "Adaptive Taktung und Burst-Modus je nach Aktivitat.",
        f5Desc: "Schaltet bei akuten Vorfallen auf 1-Minuten-Intervalle hoch und verlangsamt in ruhigen Phasen."
      },
      how: {
        title: "Ausfuhrungssequenz",
        step1: "Zuerst CLI und Systemdienst installieren.",
        step2: "Danach sitzungsgebundene Agenten-Jobs planen.",
        step3: "Jobs in der lokalen Mission Control Konsole uberprufen.",
        videoCaption: "Autonomer Ausfuhrungsablauf: launchd-Setup, Sitzungsbindung, DAG-Kette und Live-Konsole."
      },
      proof: {
        title: "Betriebliche Standards",
        captionVideo: "Mechanisches Pendeluhrwerk, CC0 uber Wikimedia Commons. Kontinuierlicher autonomer Takt.",
        captionSchematic: "De-Wick-Hemmung (1379), Gemeinfrei via Wikimedia Commons.",
        captionBrand: "Markenidentitat und Design-Richtlinien. Prazise astronomische Geometrie, neuronaler Kern und System-Tokens.",
        thDomain: "Architektur-Domane",
        thSpec: "Spezifikation",
        thVerif: "Empirische Verifikation",
        thStatus: "Protokoll-Status"
      },
      faq: {
        title: "Technische Spezifikationen",
        subtitle: "Alle Antworten direkt lesbar ohne versteckte Akkordeon-Boxen.",
        q1: "Wird ein Cloud-Abonnement benotigt?",
        a1: "Nein. Alles lauft vollstandig lokal auf Ihrem Rechner uber Standard-Systemdienste und lokale JSON-Speicherung.",
        q2: "Wie interagiert es mit aktiven OpenCode-Sitzungen?",
        a2: "Es verbindet sich direkt mit dem HTTP-Transport des OpenCode-Sidecars unter Verwendung rotierender Anmeldedaten.",
        q3: "Was passiert, wenn ein Prompt fehlschlagt?",
        a3: "Die Dead Letter Queue fangt Fehler ab, lost den Schutzschalter aus und isoliert den Job vor Token-Verschwendung.",
        q4: "Konnen Jobs sich gegenseitig auslosen?",
        a4: "Ja. DAG-Pipelines ermoglichen abhangige Ablaufe mit Zyklenprufung und Speicherweitergabe.",
        q5: "Wie wird der Kontextspeicher verwaltet?",
        a5: "Jeder Job verwaltet persistenten Speicher in .opencode/cron/memory/, der pro Runde kompakt gehalten wird.",
        q6: "Gibt es eine grafische Benutzeroberflache?",
        a6: "Ja. Eine vollwertige Web- und Desktop-Anwendung lauft auf localhost:4488 mit Live-Logs und Prioritatswarteschlangen."
      },
      cta: {
        title: "Sitzungen punktlich.",
        lead: "Fuhren Sie intelligente, sitzungsgebundene Cron-Aufgaben direkt in Ihrem Terminal aus.",
        inspectGithub: "GitHub Repository ansehen",
        subtext: "Open Source, null Telemetrie, lokale Ausfuhrung zuerst."
      }
    },
    pt: {
      dir: "ltr",
      nav: {
        showcase: "Demonstracao",
        features: "Recursos",
        architecture: "Arquitetura",
        standards: "Padroes",
        questions: "Duvidas",
        install: "Instalar via CLI"
      },
      hero: {
        title1: "Agentes operam",
        title2: "na hora certa.",
        lead: "Agendador cron inteligente com vinculo de sessao para agentes OpenCode AI, com memoria persistente, pipelines DAG e console em tempo real.",
        install: "Instalar via CLI",
        inspectGithub: "Ver Repositorio no GitHub"
      },
      showcase: {
        chipWatchdog: "Watchdog (30m)",
        chipBurst: "Disparo incidente (45m)",
        chipDag: "Pipeline DAG",
        title: "Servidor de Sessao Mission Control",
        status: "WORKER ATIVO",
        statJob: "Tarefa Ativa",
        statCadence: "Cadencia",
        statMemory: "Contexto Memoria",
        caption: "Astrolabio de Regiomontanus (1462), The Metropolitan Museum of Art. Instrumento de precisao para ciclos de tempo."
      },
      features: {
        f1Title: "Sessoes dedicadas para cada prompt programado.",
        f1Desc: "A memoria persiste entre turnos em .opencode/cron/memory/ com compactacao automatica de tokens.",
        f2Title: "Pipelines DAG para encadear tarefas de agentes dependentes.",
        f2Desc: "Gatilhos posteriores disparam automaticamente com repasse de carga de memoria.",
        f3Title: "Webhooks de entrada para disparo por APIs externas.",
        f3Desc: "Assinaturas criptograficas HMAC SHA-256 e tokens portadores impedem execucoes nao autorizadas.",
        f4Title: "Disjuntor e Dead Letter Queue isolam falhas.",
        f4Desc: "Coloca em quarentena tarefas com erros repetidos e notifica via painel web.",
        f5Title: "Cadencia adaptativa e modo burst conforme atividade.",
        f5Desc: "Acelera para intervalos de 1 minuto em incidentes ativos e reduz em horarios tranquilos."
      },
      how: {
        title: "Sequencia de execucao",
        step1: "Primeiro, instale a CLI e o daemon do sistema.",
        step2: "Em seguida, agende seus trabalhos vinculados a sessao.",
        step3: "Inspecione os trabalhos na interface Mission Control local.",
        videoCaption: "Demonstracao de execucao autonoma: configuracao launchd, vinculo de sessao, DAG e console ao vivo."
      },
      proof: {
        title: "Padroes operacionais",
        captionVideo: "Mecanismo de relogio a pendulo, CC0 via Wikimedia Commons. Cadencia autonoma continua.",
        captionSchematic: "Mecanismo de escape De Wick (1379), Dominio Publico via Wikimedia Commons.",
        thDomain: "Dominio de Arquitetura",
        thSpec: "Especificacao",
        thVerif: "Verificacao Empirica",
        thStatus: "Status do Protocolo"
      },
      faq: {
        title: "Especificacoes tecnicas",
        subtitle: "Respostas diretas sem sanfonas ou caixas fechadas.",
        q1: "Requer assinatura na nuvem?",
        a1: "Nao. Tudo roda inteiramente local em seu computador usando os daemons nativos do sistema operacional e persistencia JSON local.",
        q2: "Como interage com sessoes ativas do OpenCode?",
        a2: "Conecta-se diretamente ao transporte HTTP do sidecar do OpenCode com credenciais rotativas, preservando continuidade.",
        q3: "O que acontece quando um prompt falha?",
        a3: "A Dead Letter Queue intercepta falhas consecutivas, aciona o disjuntor para evitar desperdicio de tokens e isola o job.",
        q4: "Os trabalhos podem disparar uns aos outros?",
        a4: "Sim. Pipelines DAG permitem definir dependencias com deteccao de loops circulares.",
        q5: "Como a memoria de contexto e gerenciada?",
        a5: "Cada trabalho possui memoria persistente em .opencode/cron/memory/, resumida e compactada a cada turno.",
        q6: "Ha interface grafica?",
        a6: "Sim. Um aplicativo Web e Desktop completo roda em localhost:4488 com logs em tempo real e filas de prioridade."
      },
      cta: {
        title: "Sessoes no horario.",
        lead: "Execute tarefas cron inteligentes diretamente no seu terminal.",
        inspectGithub: "Ver Repositorio no GitHub",
        subtext: "Codigo aberto, zero telemetria, execucao prioritariamente local."
      }
    },
    zh: {
      dir: "ltr",
      nav: {
        showcase: "演示",
        features: "功能",
        architecture: "架构",
        standards: "标准",
        questions: "常见问题",
        install: "通过 CLI 安装"
      },
      hero: {
        title1: "让智能体准时",
        title2: "稳定运行。",
        lead: "专为 OpenCode AI 智能体打造的会话级智能 cron 调度系统，提供持久化记忆、DAG 工作流流水线和实时任务中控台。",
        install: "通过 CLI 安装",
        inspectGithub: "查看 GitHub 仓库"
      },
      showcase: {
        chipWatchdog: "测试监控 (30分钟)",
        chipBurst: "应急突发 (45分钟)",
        chipDag: "DAG 流水线",
        title: "Mission Control 任务控制台",
        status: "活跃工作进程",
        statJob: "当前任务",
        statCadence: "运行周期",
        statMemory: "上下文占用",
        caption: "雷吉奥蒙塔努斯星盘 (1462年)，大都会艺术博物馆 CC0 公共领域藏品。计算天体周期的高精度仪器。"
      },
      features: {
        f1Title: "为每个计划指令提供独立会话上下文。",
        f1Desc: "记忆持久保存在 .opencode/cron/memory/ 中，并在每次轮换时自动完成 token 上下文修剪与压缩。",
        f2Title: "多步 DAG 流水线编排链式依赖任务。",
        f2Desc: "下游任务根据上游的成功或失败状态自动触发，支持传递记忆载荷与循环依赖检测。",
        f3Title: "支持外部 HTTP Webhook 实时触发。",
        f3Desc: "采用 HMAC SHA-256 签名与加密令牌验证机制，彻底防止未经授权的外部调用与注入攻击。",
        f4Title: "熔断器与死信队列（DLQ）阻断异常故障。",
        f4Desc: "在发生连续失败后自动隔离异常任务，防止代币无谓消耗，并在 Web 控制台上发出即时警报。",
        f5Title: "自适应周期调度与突发响应模式。",
        f5Desc: "在发生系统故障或活跃交互期间自动加速至 1 分钟高频轮询，在静默期自动降频以节省资源。"
      },
      how: {
        title: "执行架构流程",
        step1: "首先，安装 CLI 命令行工具与系统守护进程。",
        step2: "接着，配置绑定会话的智能体定时任务。",
        step3: "最后，在本地 Mission Control 控制台进行可视化监控。",
        videoCaption: "端到端自动化演示：launchd 守护进程初始化、会话绑定、DAG 级联与控制台实时日志。"
      },
      proof: {
        title: "工程技术标准",
        captionVideo: "机械钟摆齿轮运动实拍，CC0 共享，源自维基共享资源。持续自主稳定运转。",
        captionSchematic: "德维克擒纵机械原理工程图 (1379年)，公有领域。",
        captionBrand: "品牌视觉识别与设计规范面板。精密天体天文几何、智能体神经核心与系统设计令牌。",
        thDomain: "架构领域",
        thSpec: "技术规格",
        thVerif: "实测验证",
        thStatus: "协议状态"
      },
      faq: {
        title: "技术规格与问答",
        subtitle: "清晰明了的平铺式解答，无需繁琐的手风琴折叠交互。",
        q1: "是否需要购买云服务订阅？",
        a1: "不需要。所有组件完全在您的本地设备上运行，依靠操作系统原生系统守护进程与本地 JSON 数据存储。",
        q2: "它如何与正在运行的 OpenCode 智能体交互？",
        a2: "通过轮转凭证和会话令牌直接对接 OpenCode 本地 sidecar HTTP 通信通道，无需重启智能体即可无缝延续任务。",
        q3: "如果提示词执行失败会发生什么？",
        a3: "死信队列（DLQ）会捕获多次连续异常，立即触发熔断保护以阻止代币浪费，并将任务安全隔离等待人工复核。",
        q4: "任务之间能否相互触发并级联执行？",
        a4: "完全支持。内置 DAG 引擎支持配置前后置依赖关系，具备严格的拓扑排序与循环依赖检测机制。",
        q5: "长周期下的上下文记忆如何处理？",
        a5: "每个任务拥有独立的持久记忆文件夹，每次轮次自动进行事实提取与压缩，确保不爆上下文窗口。",
        q6: "是否有图形用户界面？",
        a6: "有。提供运行在 localhost:4488 的现代化 Web 控制台及跨平台桌面应用，支持实时日志与队列管理。"
      },
      cta: {
        title: "准时调度智能体。",
        lead: "直接在本地终端中运行会话绑定的自动化 AI 任务。",
        inspectGithub: "查看 GitHub 仓库",
        subtext: "完全开源，零遥测隐私，本地优先。"
      }
    },
    ja: {
      dir: "ltr",
      nav: {
        showcase: "デモ",
        features: "機能",
        architecture: "設計",
        standards: "基準",
        questions: "よくある質問",
        install: "CLI でインストール"
      },
      hero: {
        title1: "エージェントを",
        title2: "時間通りに。",
        lead: "永続メモリ、DAGパイプライン、リアルタイム管理コンソールを備えた、OpenCode AI エージェント向けのセッション連動型 cron スケジューラ。",
        install: "CLI でインストール",
        inspectGithub: "GitHub リポジトリを見る"
      },
      showcase: {
        chipWatchdog: "監視タスク (30分)",
        chipBurst: "緊急バースト (45分)",
        chipDag: "DAG パイプライン",
        title: "Mission Control セッションサーバ",
        status: "稼働中",
        statJob: "実行中ジョブ",
        statCadence: "周期",
        statMemory: "メモリ使用量",
        caption: "レギオモンタヌスのアストロラーベ (1462年)、メトロポリタン美術館 CC0 パブリックドメイン。天体周期計算の高精度機器。"
      },
      features: {
        f1Title: "スケジュールされた指示ごとに専用セッションを提供。",
        f1Desc: ".opencode/cron/memory/ にコンテキストが永続化され、自動トークン圧縮が行われます。",
        f2Title: "依存関係を持つエージェントを連携する DAG パイプライン。",
        f2Desc: "先行ジョブの成功または失敗に応じて、後続トリガーがメモリデータを引き継ぎ自動起動します。",
        f3Title: "外部 API からの受信 Webhook トリガーに対応。",
        f3Desc: "HMAC SHA-256 署名と暗号化ベアラートークンにより不正な外部実行を遮断します。",
        f4Title: "サーキットブレーカーとデッドレターキューで障害を隔離。",
        f4Desc: "連続エラー発生時にタスクを自動隔離し、トークンの無駄な消費を防いで Web GUI に通知します。",
        f5Title: "アクティビティに応じた適応型ケイデンスとバーストモード。",
        f5Desc: "インシデント発生時は1分間隔に加速し、非稼働時間帯は自動で間隔を広げます。"
      },
      how: {
        title: "実行シーケンス",
        step1: "まず、CLI とデーモンをセットアップします。",
        step2: "次に、セッション連動型のエージェントジョブを登録します。",
        step3: "ローカルの Mission Control 画面でジョブを確認します。",
        videoCaption: "自律実行デモ：launchd デーモン起動、セッション連動、DAG パイプライン、リアルタイム画面。"
      },
      proof: {
        title: "運用基準と信頼性",
        captionVideo: "振り子時計の機械仕掛け、CC0 ウィキメディア・コモンズ。自律的で安定した刻時。",
        captionSchematic: "アンリ・ド・ヴィックの脱進機設計図 (1379年)、パブリックドメイン。",
        captionBrand: "ブランドアイデンティティとデザインガイドライン。天体幾何学、ニューラルコア、システムトークン。",
        thDomain: "アーキテクチャ領域",
        thSpec: "仕様",
        thVerif: "実証検証",
        thStatus: "プロトコル状態"
      },
      faq: {
        title: "技術仕様と詳細",
        subtitle: "アコーディオン不要、すべての回答を直接確認できます。",
        q1: "クラウドの有料契約は必要ですか？",
        a1: "いいえ。OS 標準のデーモンとローカル JSON 保存により、すべてローカルマシン上で完全に動作します。",
        q2: "稼働中の OpenCode セッションとどのように連携しますか？",
        a2: "定期ローテーションされる資格情報を用いて OpenCode のローカル sidecar HTTP に直接接続します。",
        q3: "プロンプトの実行に失敗した場合はどうなりますか？",
        a3: "デッドレターキュー（DLQ）が連続失敗を検知し、サーキットブレーカーを作動させてジョブを隔離します。",
        q4: "ジョブ間で連鎖起動できますか？",
        a4: "はい。DAG パイプラインにより循環依存の検知とメモリ共有を伴う連鎖実行が可能です。",
        q5: "長期的なコンテキストメモリはどう管理されますか？",
        a5: "各ジョブが .opencode/cron/memory/ を保持し、ターンごとに要約・圧縮してトークン制限を守ります。",
        q6: "グラフィカルな画面はありますか？",
        a6: "はい。localhost:4488 で動作するフル機能の Web GUI およびデスクトップアプリが付属します。"
      },
      cta: {
        title: "セッションを正確なスケジュールで。",
        lead: "インテリジェントな定期タスクを今すぐターミナルから実行。",
        inspectGithub: "GitHub リポジトリを見る",
        subtext: "完全オープンソース、テレメトリなし、ローカルファースト。"
      }
    },
    ru: {
      dir: "ltr",
      nav: {
        showcase: "Демо",
        features: "Функции",
        architecture: "Архитектура",
        standards: "Стандарты",
        questions: "Вопросы",
        install: "Установить через CLI"
      },
      hero: {
        title1: "Агенты работают",
        title2: "точно в срок.",
        lead: "Интеллектуальный планировщик cron с привязкой к сессиям для ИИ-агентов OpenCode, с постоянной памятью, пайплайнами DAG и консолью в реальном времени.",
        install: "Установить через CLI",
        inspectGithub: "Репозиторий на GitHub"
      },
      showcase: {
        chipWatchdog: "Мониторинг (30 мин)",
        chipBurst: "Инцидент-всплеск (45 мин)",
        chipDag: "DAG-пайплайн",
        title: "Сервер сессий Mission Control",
        status: "АКТИВНЫЙ ВОРКЕР",
        statJob: "Текущий процесс",
        statCadence: "Интервал",
        statMemory: "Контекст памяти",
        caption: "Астролябия Региомонтана (1462 г.), Метрополитен-музей CC0. Высокоточный инструмент для циклического расчета времени."
      },
      features: {
        f1Title: "Выделенные сессии для каждого запланированного промпта.",
        f1Desc: "Память сохраняется между шагами в .opencode/cron/memory/ с автоматическим сжатием контекста.",
        f2Title: "Многошаговые пайплайны DAG для цепочек зависимых агентов.",
        f2Desc: "Последующие задачи запускаются автоматически при успехе или ошибке с передачей состояния памяти.",
        f3Title: "Входящие вебхуки для запуска из внешних API.",
        f3Desc: "Криптографические подписи HMAC SHA-256 и токены Bearer защищают от несанкционированных вызовов.",
        f4Title: "Автоматический выключатель и очередь недоставленных сообщений (DLQ).",
        f4Desc: "Изолирует повторяющиеся сбои после серии неудач, предотвращая расход токенов.",
        f5Title: "Адаптивная частота и режим всплеска в зависимости от активности.",
        f5Desc: "Ускоряется до 1-минутных интервалов при активных инцидентах и замедляется в спокойные часы."
      },
      how: {
        title: "Последовательность выполнения",
        step1: "Сначала установите CLI и системную службу.",
        step2: "Затем настройте задачи агентов с привязкой к сессии.",
        step3: "Контролируйте задачи в локальной веб-панели Mission Control.",
        videoCaption: "Демонстрация автономного запуска: настройка launchd, привязка сессий, цепочка DAG и Mission Control."
      },
      proof: {
        title: "Эксплуатационные стандарты",
        captionVideo: "Механизм маятниковых часов, CC0 Викисклад. Непрерывный автономный ход.",
        captionSchematic: "Механический спуск Де Вика (1379 г.), Общественное достояние.",
        captionBrand: "Панель идентичности бренда и руководства по дизайну. Астрономическая геометрия, нейронное ядро и токены системы.",
        thDomain: "Область архитектуры",
        thSpec: "Спецификация",
        thVerif: "Эмпирическая проверка",
        thStatus: "Статус протокола"
      },
      faq: {
        title: "Технические характеристики",
        subtitle: "Прямые ответы без скрытых спойлеров и вкладок.",
        q1: "Требуется ли облачная подписка?",
        a1: "Нет. Все работает полностью локально на вашем компьютере через системные службы ОС и локальные файлы JSON.",
        q2: "Как планировщик связывается с сессиями OpenCode?",
        a2: "Подключается напрямую к HTTP-транспорту локального сайдкара OpenCode с автоматической ротацией учетных данных.",
        q3: "Что происходит при ошибке промпта?",
        a3: "Очередь DLQ перехватывает сбои, срабатывает защитный выключатель и изолирует задачу от дальнейшей траты токенов.",
        q4: "Могут ли задачи запускать друг друга?",
        a4: "Да. Пайплайны DAG поддерживают настройку зависимостей с валидацией циклических ссылок.",
        q5: "Как устроена долгосрочная память?",
        a5: "Каждая задача ведет файл памяти в .opencode/cron/memory/, который суммаризируется на каждом шаге.",
        q6: "Есть ли графический интерфейс?",
        a6: "Да. Полнофункциональный Web GUI и десктопное приложение работают на localhost:4488 с живыми логами."
      },
      cta: {
        title: "Запускайте задачи вовремя.",
        lead: "Интеллектуальные cron-задачи с привязкой к сессии прямо в терминале.",
        inspectGithub: "Репозиторий на GitHub",
        subtext: "Открытый исходный код, без телеметрии, локальное исполнение."
      }
    },
    ar: {
      dir: "rtl",
      nav: {
        showcase: "العرض",
        features: "المميزات",
        architecture: "الهندسة",
        standards: "المعايير",
        questions: "الاسئلة",
        install: "التثبيت عبر CLI"
      },
      hero: {
        title1: "الوكلاء يعملون",
        title2: "في الوقت المحدد.",
        lead: "مجدول cron ذكي مرتبط بالجلسات لوكلاء OpenCode للذكاء الاصطناعي مع ذاكرة دائمة وخطوط انابيب DAG ولوحة تحكم حية.",
        install: "التثبيت عبر CLI",
        inspectGithub: "مستودع GitHub"
      },
      showcase: {
        chipWatchdog: "مراقبة الاختبارات (30 دقيقة)",
        chipBurst: "استجابة الحوادث (45 دقيقة)",
        chipDag: "خط انابيب DAG",
        title: "خادم جلسات Mission Control",
        status: "عامل نشط",
        statJob: "المهمة النشطة",
        statCadence: "الدورة الزمنية",
        statMemory: "حجم الذاكرة",
        caption: "اسطرلاب ريجيومونتانوس (1462)، متحف المتروبوليتان للفنون CC0. اداة دقيقة لحساب الدورات الزمنية."
      },
      features: {
        f1Title: "جلسات مخصصة لكل مطالبة مجدولة.",
        f1Desc: "تستمر الذاكرة عبر الجولات في .opencode/cron/memory/ مع ضغط تلقائي للرموز.",
        f2Title: "خطوط انابيب DAG متعددة المراحل لربط مهام الوكلاء المترابطة.",
        f2Desc: "تنطلق المهام التالية تلقائيا عند النجاح او الفشل مع تمرير حمولة الذاكرة.",
        f3Title: "نقاط Webhook واردة للتشغيل من واجهات برمجة التطبيقات الخارجية.",
        f3Desc: "توقيعات HMAC SHA-256 المشفرة تمنع اي تشغيل غير مصرح به.",
        f4Title: "قاطع الدائرة وقائمة الرسائل الميتة لعزل الاخطاء.",
        f4Desc: "حجر صحي تلقائي للمهام المتعثرة لمنع هدر الرصيد والرموز.",
        f5Title: "تردد تكيفي ووضع التدفق السريع حسب النشاط.",
        f5Desc: "تسريع الى فترات مدتها دقيقة واحدة اثناء الطوارئ والتراجع في الفترات الهادئة."
      },
      how: {
        title: "تسلسل التنفيذ",
        step1: "اولا، قم بتثبيت واجهة الاوامر وخادم النظام.",
        step2: "ثم قم بجدولة مهام الوكلاء المرتبطة بالجلسات.",
        step3: "افحص المهام من خلال لوحة تحكم Mission Control المحلية.",
        videoCaption: "عرض توضيحي للتنفيذ الذاتي: اعداد launchd، ربط الجلسات، خط انابيب DAG ولوحة التحكم الحية."
      },
      proof: {
        title: "المعايير التشغيلية",
        captionVideo: "حركة الساعة الميكانيكية، CC0 عبر ويكيميديا كومنز. دوران مستقل ومستمر.",
        captionSchematic: "مخطط ميزان دي ويك (1379)، ملكية عامة عبر ويكيميديا كومنز.",
        captionBrand: "لوحة الهوية البصرية ودليل التصميم. هندسة فلكية دقيقة ونواة عصبية ورموز النظام.",
        thDomain: "مجال البنية",
        thSpec: "المواصفات",
        thVerif: "التحقق العملي",
        thStatus: "حالة البروتوكول"
      },
      faq: {
        title: "المواصفات التقنية",
        subtitle: "جميع الاجابات مقدمة بشكل مباشر وبدون قوائم منسدلة مغلقة.",
        q1: "هل يتطلب اشتراكا سحابيا؟",
        a1: "لا. كل شيء يعمل محليا بالكامل على جهازك عبر خدمات النظام القياسية وتخزين JSON المحلي.",
        q2: "كيف يتفاعل مع جلسات OpenCode النشطة؟",
        a2: "يتصل مباشرة عبر بروتوكول HTTP لقناة sidecar التابعة لـ OpenCode مع تدوير بيانات الاعتماد.",
        q3: "ماذا يحدث عند فشل تنفيذ مطالبة؟",
        a3: "تقوم قائمة DLQ باعتراض الفشل المتكرر وتشغيل قاطع الدائرة لمنع استنزاف الرصيد.",
        q4: "هل يمكن للمهام تشغيل بعضها البعض؟",
        a4: "نعم. تتيح خطوط انابيب DAG تحديد التبعيات مع التحقق من عدم وجود حلقات مغلقة.",
        q5: "كيف تتم ادارة ذاكرة السياق؟",
        a5: "تحتفظ كل مهمة بذاكرة دائمة في .opencode/cron/memory/ يتم تلخيصها وضغطها مع كل جولة.",
        q6: "هل توجد واجهة مستخدم رسومية؟",
        a6: "نعم. يتوفر تطبيق ويب وسطح مكتب كامل على localhost:4488 مع سجلات فورية وطوابير اولوية."
      },
      cta: {
        title: "جلسات في موعدها.",
        lead: "قم بتشغيل مهام cron ذكية مرتبطة بالجلسات مباشرة من جهازك.",
        inspectGithub: "مستودع GitHub",
        subtext: "مفتوح المصدر، بدون تتبع، تنفيذ محلي اولا."
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
