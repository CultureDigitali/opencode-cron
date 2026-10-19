/* =============================================================================
 * app.js - UI behaviour for the opencode-cron launch site.
 * Design Taste Frontend v2 & WCAG AA compliant.
 * Zero emojis, robust clipboard, free-form live typing, focus management.
 * ========================================================================== */
(function () {
  "use strict";

  /* --- Navigation menu mobile toggle & Esc handling --- */
  const navToggleBtn = document.querySelector(".nav-toggle-btn");
  const navMenu = document.querySelector(".nav-menu");
  if (navToggleBtn && navMenu) {
    function setNavOpen(open) {
      navMenu.classList.toggle("open", open);
      navToggleBtn.setAttribute("aria-expanded", String(open));
    }

    navToggleBtn.addEventListener("click", function () {
      const isOpen = navMenu.classList.contains("open");
      setNavOpen(!isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("open")) {
        setNavOpen(false);
        navToggleBtn.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && e.target !== navToggleBtn) {
        setNavOpen(false);
      }
    });
  }

  /* --- Language dropdown listbox --- */
  const langToggleBtn = document.querySelector(".lang-toggle-btn");
  const langDropdown = document.querySelector(".lang-dropdown");
  if (langToggleBtn && langDropdown) {
    langDropdown.innerHTML = "";
    langDropdown.setAttribute("role", "listbox");
    langToggleBtn.setAttribute("aria-haspopup", "listbox");
    langToggleBtn.setAttribute("aria-expanded", "false");

    const languages = (window.OC_LANGS || [
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
    ]);

    function setDropdownOpen(open) {
      langDropdown.classList.toggle("open", open);
      langToggleBtn.setAttribute("aria-expanded", String(open));
    }

    languages.forEach(function (lang) {
      const item = document.createElement("li");
      item.setAttribute("role", "none");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-option";
      btn.setAttribute("role", "option");
      btn.setAttribute("data-lang-code", lang.code);
      btn.textContent = lang.code.toUpperCase() + " " + lang.name;
      btn.addEventListener("click", function () {
        if (window.OC_I18N && typeof window.OC_I18N.setLang === "function") {
          window.OC_I18N.setLang(lang.code);
        }
        langToggleBtn.textContent = lang.code.toUpperCase();
        setDropdownOpen(false);
        langToggleBtn.focus();
      });
      item.appendChild(btn);
      langDropdown.appendChild(item);
    });

    langToggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = langDropdown.classList.contains("open");
      setDropdownOpen(!isOpen);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && langDropdown.classList.contains("open")) {
        setDropdownOpen(false);
        langToggleBtn.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!langDropdown.contains(e.target) && e.target !== langToggleBtn) {
        setDropdownOpen(false);
      }
    });

    document.addEventListener("oc:langchange", function (e) {
      const cur = (e.detail && e.detail.lang) || (window.OC_I18N && window.OC_I18N.current && window.OC_I18N.current()) || "en";
      langToggleBtn.textContent = cur.toUpperCase();
      langDropdown.querySelectorAll("[data-lang-code]").forEach(function (btn) {
        const isSelected = btn.getAttribute("data-lang-code") === cur;
        btn.classList.toggle("active", isSelected);
        btn.setAttribute("aria-selected", String(isSelected));
      });
    });
  }

  /* --- Robust Copy buttons with race-condition guard --- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    let timer = null;
    const label = btn.querySelector(".copy-label") || btn;
    const originalText = label.textContent.trim();

    btn.addEventListener("click", async function () {
      const text = btn.getAttribute("data-copy");
      if (!text) return;

      let ok = false;
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (_) {}
      }

      if (!ok) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand("copy");
        } catch (_) {}
        ta.remove();
      }

      label.textContent = ok ? "Copied" : "Select to copy";
      clearTimeout(timer);
      timer = setTimeout(function () {
        label.textContent = originalText;
      }, 1800);
    });
  });

  /* --- Interactive Showcase: Live free-form typing & Presets --- */
  const showcaseInput = document.getElementById("showcase-input");
  const terminalLogs = document.getElementById("terminal-logs-code");
  const statJobName = document.getElementById("stat-job-name");
  const statCadence = document.getElementById("stat-cadence");
  const statMemory = document.getElementById("stat-memory");

  const showcaseScenarios = {
    "cron_add every 30m Test suite watchdog": {
      name: "watchdog_suite",
      cadence: "30m interval",
      memory: "4.2 KB",
      logs: "[tick:09:30:00] Session session_wd_8a resumed\n[runner] OpenCode sidecar HTTP 200 OK\n[tool:bun_test] 111 tests passed in 16 files\n[memory] Turn 4 state recorded (4.2 KB compacted)\n[status] Circuit breaker CLOSED (0 failures)"
    },
    "cron_burst 45m Incident response": {
      name: "incident_burst",
      cadence: "1m burst (45m)",
      memory: "18.6 KB",
      logs: "[burst:active] Active interval clamped to 60s\n[event] Inbound webhook verified from GitHub alerts\n[tool:git_checkout] Branched hotfix/sess-418\n[pipeline] Downstream job deploy-staging triggered\n[status] 3 worker threads operating concurrently"
    },
    "cron_pipeline deploy-dag On-merge pipeline": {
      name: "deploy_pipeline",
      cadence: "DAG trigger",
      memory: "9.1 KB",
      logs: "[pipeline:dag] Node 1 (test_suite) completed successfully\n[pipeline:dag] Passing memory payload (1.8 KB) to node 2\n[pipeline:dag] Node 2 (typecheck) started\n[runner] No circular dependency detected (DFS verified)\n[status] Pipeline finished in 1840ms"
    }
  };

  function renderScenario(query) {
    const cleanQuery = (query || "").trim();
    const match = showcaseScenarios[cleanQuery] || {
      name: cleanQuery ? cleanQuery.slice(0, 18).replace(/[^a-zA-Z0-9_]/g, "_") : "active_job",
      cadence: "custom schedule",
      memory: "5.0 KB",
      logs: "[tick] Session session_" + Math.random().toString(36).slice(2, 8) + " resumed\n[runner] OpenCode sidecar HTTP connection active\n[prompt] Executing: " + (cleanQuery.slice(0, 48) || "scheduled instruction") + "\n[memory] Turn state recorded (<28k chars safety ceiling)\n[status] Ready for next tick"
    };

    if (statJobName) statJobName.textContent = match.name;
    if (statCadence) statCadence.textContent = match.cadence;
    if (statMemory) statMemory.textContent = match.memory;
    if (terminalLogs) terminalLogs.textContent = match.logs;
  }

  function setPreset(query) {
    if (!showcaseInput) return;
    showcaseInput.value = query || "";
    renderScenario(query);
  }

  document.querySelectorAll("[data-preset]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      const preset = chip.getAttribute("data-preset");
      if (preset) setPreset(preset);
    });
  });

  if (showcaseInput) {
    showcaseInput.addEventListener("input", function () {
      renderScenario(showcaseInput.value);
    });
  }

  /* --- Features: Working Accessible Switches --- */
  const featureBands = document.querySelectorAll(".feature-band");
  featureBands.forEach(function (band) {
    const toggle = band.querySelector(".switch-control");
    if (!toggle) return;

    function flip() {
      const isOn = toggle.getAttribute("aria-checked") === "true";
      toggle.setAttribute("aria-checked", String(!isOn));
      band.classList.toggle("is-on", !isOn);
      const activeClass = band.getAttribute("data-active-class");
      if (activeClass) {
        band.classList.toggle(activeClass, !isOn);
      }
    }

    toggle.addEventListener("click", flip);
    toggle.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      }
    });
  });

  /* Initialize default active bands */
  const initialOnBands = document.querySelectorAll(".feature-band[data-default-on='true']");
  initialOnBands.forEach(function (band) {
    const toggle = band.querySelector(".switch-control");
    if (toggle) {
      toggle.setAttribute("aria-checked", "true");
      band.classList.add("is-on");
      const activeClass = band.getAttribute("data-active-class");
      if (activeClass) band.classList.add(activeClass);
    }
  });

  /* --- Current Year --- */
  const yr = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = yr;
  });

  /* --- Video Autoplay Ensure --- */
  document.querySelectorAll("video").forEach(function (v) {
    v.play().catch(function () {});
  });

})();
