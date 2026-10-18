/* =============================================================================
 * app.js - UI behaviour for the opencode-cron launch site.
 * Nav, language picker, scroll reveal, FAQ accordion, copy button, stat
 * counters and the contact form.
 * ========================================================================== */
(function () {
  "use strict";
  const CFG = window.OC_CRON_SITE || {};

  /* --- Nav scroll state + mobile menu --- */
  const nav = document.querySelector(".nav");
  const onScroll = () => { if (nav) nav.classList.toggle("scrolled", window.scrollY > 24); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const burger = document.querySelector(".nav-burger");
  const links = document.querySelector(".nav-links");
  if (burger && links) {
    const setBurger = (open) => { links.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open)); };
    burger.setAttribute("aria-expanded", "false");
    burger.addEventListener("click", () => setBurger(!links.classList.contains("open")));
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setBurger(false)));
  }

  /* --- Language picker --- */
  const langBtn = document.querySelector(".lang-btn");
  const langMenu = document.querySelector(".lang-menu");
  if (langBtn && langMenu) {
    langMenu.innerHTML = "";
    (window.OC_LANGS || []).forEach((l) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-lang-code", l.code);
      b.innerHTML = `<span>${l.flag}</span><span>${l.name}</span>`;
      b.addEventListener("click", () => { if (window.OC_I18N) window.OC_I18N.setLang(l.code); langMenu.classList.remove("open"); });
      langMenu.appendChild(b);
    });
    langBtn.addEventListener("click", (e) => { e.stopPropagation(); langMenu.classList.toggle("open"); });
    document.addEventListener("click", (e) => { if (!langMenu.contains(e.target) && e.target !== langBtn) langMenu.classList.remove("open"); });
    document.addEventListener("oc:langchange", () => {
      const cur = window.OC_I18N && window.OC_I18N.current && window.OC_I18N.current();
      langMenu.querySelectorAll("[data-lang-code]").forEach((b) => b.classList.toggle("active", b.getAttribute("data-lang-code") === cur));
    });
  }

  /* --- Scroll reveal --- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else { revealEls.forEach((el) => el.classList.add("in")); }

  /* --- FAQ accordion --- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((o) => { o.classList.remove("open"); const oq = o.querySelector(".faq-q"); if (oq) oq.setAttribute("aria-expanded", "false"); });
      if (!open) { item.classList.add("open"); q.setAttribute("aria-expanded", "true"); }
    });
  });

  /* --- Copy install command --- */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      try { await navigator.clipboard.writeText(text); } catch (e) {
        const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (_) {} ta.remove();
      }
      const label = btn.querySelector(".copy-label") || btn;
      const prev = label.textContent; label.textContent = "✓";
      setTimeout(() => { label.textContent = prev; }, 1600);
    });
  });


  /* --- Animated stat counters --- */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1400; const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || ""); });
  }

  /* --- Footer year --- */
  const yr = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = yr; });

  /* --- Contact form --- */
  const form = document.getElementById("contact-form");
  function mailto(to, d) {
    const subject = d.subject || ("Contact from " + d.name);
    const body = `${d.message}\n\n- ${d.name} (${d.email})`;
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  if (form) {
    const status = document.getElementById("form-status");
    const T = () => {
      const cur = window.OC_I18N && window.OC_I18N.current && window.OC_I18N.current();
      return (window.OC_I18N && window.OC_I18N.dict && window.OC_I18N.dict[cur] || {}).contact || {};
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = { name: form.name.value.trim(), email: form.email.value.trim(), subject: form.subject.value.trim(), message: form.message.value.trim() };
      const t = T();
      if (!data.name || !data.email || !data.message) {
        status.textContent = t.needMsg || "Please fill in all fields."; status.className = "form-status err"; return;
      }
      status.textContent = t.sending || "Sending…"; status.className = "form-status";
      const to = CFG.contactEmail || "hello@example.com";
      if (CFG.formEndpoint) {
        try {
          const res = await fetch(CFG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          if (res.ok) { status.textContent = t.sent || "Thanks!"; status.className = "form-status ok"; form.reset(); }
          else { throw new Error("bad"); }
        } catch (err) {
          window.location.href = mailto(to, data);
          status.textContent = t.err || "Error."; status.className = "form-status err";
        }
      } else {
        window.location.href = mailto(to, data);
        status.textContent = t.sent || "Thanks!"; status.className = "form-status ok"; form.reset();
      }
    });
  }

  /* --- Wire dynamic identity from config --- */
  document.querySelectorAll("[data-email-link]").forEach((a) => { a.href = "mailto:" + (CFG.contactEmail || ""); if (CFG.contactEmail) a.textContent = CFG.contactEmail; });
  document.querySelectorAll("[data-repo-link]").forEach((a) => { if (CFG.repoUrl) a.href = CFG.repoUrl; });
  document.querySelectorAll("[data-npm-link]").forEach((a) => { if (CFG.npmUrl) a.href = CFG.npmUrl; });
})();
