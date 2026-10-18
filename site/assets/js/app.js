/* =============================================================================
 * app.js - UI behaviour for the opencode-cron launch site.
 * Design Taste Frontend v2 compliant.
 * Zero emojis, zero banned patterns.
 * ========================================================================== */
(function () {
  "use strict";

  /* --- Navigation menu mobile toggle --- */
  const navToggleBtn = document.querySelector(".nav-toggle-btn");
  const navMenu = document.querySelector(".nav-menu");
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener("click", function () {
      const isOpen = navMenu.classList.contains("open");
      navMenu.classList.toggle("open", !isOpen);
      navToggleBtn.setAttribute("aria-expanded", String(!isOpen));
    });
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        navToggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Language dropdown --- */
  const langToggleBtn = document.querySelector(".lang-toggle-btn");
  const langDropdown = document.querySelector(".lang-dropdown");
  if (langToggleBtn && langDropdown) {
    langDropdown.innerHTML = "";
    const languages = [
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

    languages.forEach(function (lang) {
      const item = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-option";
      btn.setAttribute("data-lang-code", lang.code);
      btn.textContent = lang.code.toUpperCase() + " " + lang.name;
      btn.addEventListener("click", function () {
        if (window.OC_I18N && typeof window.OC_I18N.setLang === "function") {
          window.OC_I18N.setLang(lang.code);
        }
        langToggleBtn.textContent = lang.code.toUpperCase();
        langDropdown.classList.remove("open");
      });
      item.appendChild(btn);
      langDropdown.appendChild(item);
    });

    langToggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      langDropdown.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
      if (!langDropdown.contains(e.target) && e.target !== langToggleBtn) {
        langDropdown.classList.remove("open");
      }
    });

    document.addEventListener("oc:langchange", function () {
      const cur = window.OC_I18N && window.OC_I18N.current && window.OC_I18N.current();
      if (cur) {
        langToggleBtn.textContent = cur.toUpperCase();
        langDropdown.querySelectorAll("[data-lang-code]").forEach(function (btn) {
          btn.classList.toggle("active", btn.getAttribute("data-lang-code") === cur);
        });
      }
    });
  }

  /* --- Copy command buttons --- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      const text = btn.getAttribute("data-copy");
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (_) {}
        ta.remove();
      }
      const label = btn.querySelector(".copy-label") || btn;
      const prev = label.textContent;
      label.textContent = "Copied";
      setTimeout(function () {
        label.textContent = prev;
      }, 1800);
    });
  });

  /* --- Interactive Showcase: Type input & Presets --- */
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

  function updateShowcase(query) {
    if (!showcaseInput) return;
    showcaseInput.value = query;
    const match = showcaseScenarios[query] || {
      name: query.slice(0, 16).replace(/\s+/g, "_"),
      cadence: "custom schedule",
      memory: "5.0 KB",
      logs: "[tick] Session session_custom resumed\n[runner] OpenCode sidecar connection active\n[prompt] Executing scheduled instruction\n[memory] Context compaction verified (<28k chars)\n[status] Ready for next tick"
    };

    if (statJobName) statJobName.textContent = match.name;
    if (statCadence) statCadence.textContent = match.cadence;
    if (statMemory) statMemory.textContent = match.memory;
    if (terminalLogs) terminalLogs.textContent = match.logs;
  }

  document.querySelectorAll("[data-preset]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      const preset = chip.getAttribute("data-preset");
      if (preset) updateShowcase(preset);
    });
  });

  if (showcaseInput) {
    showcaseInput.addEventListener("input", function () {
      const val = showcaseInput.value.trim();
      if (showcaseScenarios[val]) {
        updateShowcase(val);
      }
    });
  }

  /* --- Features: Working Switches --- */
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

  /* Initialize two feature bands to ON by default as required by blueprint */
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
