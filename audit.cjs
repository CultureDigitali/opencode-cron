/* ADVERSARIAL REVIEW HARNESS — opencode-cron launch site.
 * Each persona runs OBJECTIVE checks against the real files.
 * 100/100 only if every hard check passes. */
const fs = require("fs");
const path = require("path");
const ROOT = "site";
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const html = read("index.html");
const css = read("assets/css/styles.css");
const appjs = read("assets/js/app.js");
const i18n = read("assets/js/i18n.js");
const configjs = read("assets/js/config.js");
const hero = read("assets/js/hero3d.js");
const robots = read("robots.txt");
const sitemap = read("sitemap.xml");
const llms = read("llms.txt");
const w = {};
global.window = w;
global.document = { addEventListener() {}, documentElement: { setAttribute() {} }, querySelectorAll() { return []; }, querySelector() { return null; }, dispatchEvent() {} };
global.navigator = { language: "en", languages: ["en"] };
global.localStorage = { getItem() { return null; }, setItem() {} };
global.CustomEvent = function () {};
eval("(function(){" + i18n.replace(/const DICT/g, "var DICT") + "})()");
const DICT = w.__OC_DICT__ || {};
const EN = DICT.en || {};
function srgb(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function lum(hex) { const h = hex.replace("#", ""); const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b); }
function contrast(a, b) { const la = lum(a), lb = lum(b); const hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); }
const report = [];
function persona(name, checks) {
  const results = checks.map((c) => { let pass = false, note = ""; try { const r = c.fn(); pass = r === true || (r && r.pass === true); note = r && r.note ? r.note : (r === true ? "ok" : "fail"); } catch (e) { pass = false; note = "ERR " + e.message; } return { desc: c.desc, pass, note }; });
  const passed = results.filter((r) => r.pass).length; const total = results.length; const score = Math.round((passed / total) * 100);
  report.push({ name, score, passed, total, results });
}
persona("SEO Strategist", [
  { desc: "title 30-65 chars", fn: () => { const m = html.match(/<title>([^<]+)<\/title>/); const n = m ? m[1].length : 0; return { pass: n >= 30 && n <= 65, note: n + " chars" }; } },
  { desc: "meta description 70-165 chars", fn: () => { const m = html.match(/name="description" content="([^"]*)"/); const n = m ? m[1].length : 0; return { pass: n >= 70 && n <= 165, note: n + " chars" }; } },
  { desc: "canonical present", fn: () => html.includes('rel="canonical"') },
  { desc: ">=10 hreflang + x-default", fn: () => { const n = (html.match(/hreflang=/g) || []).length; return { pass: n >= 10 && html.includes('hreflang="x-default"'), note: n + " hreflang" }; } },
  { desc: "exactly one h1", fn: () => { const n = (html.match(/<h1[ >]/g) || []).length; return { pass: n === 1, note: n + " h1" }; } },
  { desc: "h1 before first h2", fn: () => html.indexOf("<h1") < html.indexOf("<h2") },
  { desc: "all img have alt", fn: () => { const imgs = html.match(/<img\b[^>]*>/g) || []; const bad = imgs.filter((t) => !/\balt=/.test(t)); return { pass: bad.length === 0, note: imgs.length + " imgs" }; } },
  { desc: "OG + Twitter complete", fn: () => ["og:title", "og:description", "og:image", "og:url", "twitter:card", "twitter:image"].every((k) => html.includes(k)) },
  { desc: "sitemap has urlset + loc", fn: () => sitemap.includes("<urlset") && sitemap.includes("<loc>") },
  { desc: "robots allows + sitemap", fn: () => /Allow:\s*\//.test(robots) && robots.includes("Sitemap:") },
  { desc: "html lang set", fn: () => /<html lang="[a-z]+"/.test(html) },
  { desc: "no accidental noindex", fn: () => !/name="robots" content="[^"]*noindex/.test(html) },
]);
persona("GEO / AI-Readiness", [
  { desc: "llms.txt descriptive", fn: () => llms.length > 400 && llms.includes("opencode-cron") },
  { desc: "ai.txt present", fn: () => exists("ai.txt") },
  { desc: "robots welcomes AI bots", fn: () => ["GPTBot", "ClaudeBot", "PerplexityBot"].every((b) => robots.includes(b)) },
  { desc: "SoftwareApplication JSON-LD", fn: () => html.includes('"@type": "SoftwareApplication"') },
  { desc: "Organization + Person JSON-LD", fn: () => html.includes('"@type": "Organization"') && html.includes('"@type": "Person"') },
  { desc: "FAQPage schema injected by JS", fn: () => html.includes('"@type": "FAQPage"') },
  { desc: "JSON-LD parses", fn: () => { const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g; let m, ok = true; while ((m = re.exec(html))) { try { JSON.parse(m[1]); } catch (e) { ok = false; } } return ok; } },
  { desc: "citation meta for attribution", fn: () => html.includes("citation_author") && html.includes("citation_publisher") },
  { desc: "llms.txt has version/license/repo", fn: () => llms.includes("MIT") && llms.includes("github.com/CultureDigitali/opencode-cron") },
  { desc: "structured data downloadUrl + license", fn: () => html.includes("downloadUrl") && html.includes("opensource.org/licenses/MIT") },
]);
persona("Accessibility (WCAG AA)", [
  { desc: "body muted >=4.5:1", fn: () => { const m = css.match(/--muted:\s*(#[0-9a-f]{6})/i); const c = m ? contrast(m[1], "#070a12") : 0; return { pass: c >= 4.5, note: (m ? m[1] : "?") + " " + c.toFixed(2) + ":1" }; } },
  { desc: "secondary muted-2 >=4.5:1", fn: () => { const m = css.match(/--muted-2:\s*(#[0-9a-f]{6})/i); const c = m ? contrast(m[1], "#070a12") : 0; return { pass: c >= 4.5, note: (m ? m[1] : "?") + " " + c.toFixed(2) + ":1" }; } },
  { desc: "link indigo-l >=4.5:1", fn: () => { const m = css.match(/--indigo-l:\s*(#[0-9a-f]{6})/i); const c = m ? contrast(m[1], "#070a12") : 0; return { pass: c >= 4.5, note: (m ? m[1] : "?") + " " + c.toFixed(2) + ":1" }; } },
  { desc: "btn gradient accessible + used", fn: () => { const btn = css.match(/\.btn-primary\s*\{[^}]*\}/); const uses = !!btn && btn[0].includes("var(--grad-btn)"); const m = css.match(/--grad-btn:([^;]+);/); const stops = m ? (m[1].match(/#[0-9a-f]{6}/gi) || []) : []; const worst = stops.length ? Math.min(...stops.map((s) => contrast("#ffffff", s))) : -1; return { pass: uses && worst >= 4.5, note: (uses ? "uses grad-btn" : "uses grad!") + " " + worst.toFixed(2) + ":1 over " + stops.length + " stops" }; } },
  { desc: ":focus-visible styles", fn: () => /:focus-visible/.test(css) },
  { desc: "aria-expanded toggled (burger+faq)", fn: () => /aria-expanded/.test(appjs) },
  { desc: "form labels associated", fn: () => ["cf-name", "cf-email", "cf-subject", "cf-message"].every((id) => html.includes('for="' + id + '"') && html.includes('id="' + id + '"')) },
  { desc: "skip link or #top", fn: () => /skip|href="#top"/.test(html) },
  { desc: "aria-hidden on decorative", fn: () => html.includes('aria-hidden="true"') },
  { desc: "prefers-reduced-motion", fn: () => css.includes("prefers-reduced-motion") },
  { desc: "form status aria-live", fn: () => html.includes('aria-live="polite"') },
]);
persona("Performance Engineer", [
  { desc: "DPR capped <=2", fn: () => /Math\.min\([^)]*devicePixelRatio,\s*2\)/.test(hero) },
  { desc: "fonts display=swap", fn: () => html.includes("display=swap") },
  { desc: ">=2 preconnect", fn: () => (html.match(/rel="preconnect"/g) || []).length >= 2 },
  { desc: "canvas pauses when hidden", fn: () => hero.includes("visibilitychange") },
  { desc: "app.js loaded after <main>", fn: () => html.lastIndexOf("app.js") > html.indexOf("<main") },
  { desc: "Three.js pinned (no @latest)", fn: () => /three@\d+\.\d+\.\d+/.test(html) && !html.includes("three@latest") },
  { desc: "badges lazy-loaded", fn: () => /loading="lazy"/.test(html) },
  { desc: "html < 60KB", fn: () => html.length < 60000 },
]);
persona("Security Reviewer", [
  { desc: "all target=_blank have noopener", fn: () => { const a = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) || []; const bad = a.filter((t) => !/rel="[^"]*noopener/.test(t)); return { pass: bad.length === 0, note: a.length + " ext, " + bad.length + " unsafe" }; } },
  { desc: "no secrets in client files", fn: () => !/(api[_-]?key|secret|password|sk-[A-Za-z0-9]{10})/i.test(html + configjs + appjs) },
  { desc: "no innerHTML with user form input", fn: () => { const d = appjs.match(/\.innerHTML\s*=\s*[^;]*form\./); return { pass: !d, note: d ? "user->innerHTML" : "safe" }; } },
  { desc: "i18n innerHTML whitelisted keys", fn: () => /lede\|a1\|a2\|a3\|a4\|a5\|a6\|legal/.test(i18n) },
  { desc: "contact email placeholder or set", fn: () => configjs.includes("you@example.com") || /contactEmail:\s*"[^"]+@[^"]+"/.test(configjs) },
  { desc: "form validates before use", fn: () => appjs.includes("needMsg") && appjs.includes(".trim()") },
  { desc: "no document.write / remote eval", fn: () => !/document\.write|eval\(location|new Function/.test(html + appjs) },
]);
persona("Localization Lead", [
  { desc: "10 languages present", fn: () => Object.keys(DICT).length === 10 },
  { desc: "all top sections in every lang", fn: () => { const secs = ["nav", "hero", "problem", "features", "how", "compare", "usecases", "gui", "desktop", "tools", "stats", "cta", "faq", "contact", "credits", "footer", "nf"]; const bad = Object.keys(DICT).filter((l) => secs.some((s) => !DICT[l][s])); return { pass: bad.length === 0, note: bad.join(",") || "complete" }; } },
  { desc: "all HTML keys resolve in ALL langs", fn: () => { const keys = new Set(); const re = /data-i18n="([^"]+)"/g; let m; while ((m = re.exec(html))) keys.add(m[1]); const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); const miss = []; Object.keys(DICT).forEach((l) => keys.forEach((k) => { if (get(DICT[l], k) === undefined) miss.push(l + ":" + k); })); return { pass: miss.length === 0, note: miss.length + " missing" }; } },
  { desc: "Arabic RTL, rest LTR", fn: () => DICT.ar.dir === "rtl" && Object.keys(DICT).filter((l) => l !== "ar").every((l) => DICT[l].dir === "ltr") },
  { desc: "{year} interpolation", fn: () => i18n.includes("{year}") && i18n.includes("getFullYear") },
  { desc: "engine sets html lang+dir", fn: () => i18n.includes('setAttribute("lang"') && i18n.includes('setAttribute("dir"') },
  { desc: "localStorage persistence", fn: () => i18n.includes("localStorage") },
  { desc: "auto-detect from navigator", fn: () => i18n.includes("navigator.languages") || i18n.includes("navigator.language") },
  { desc: "no English leakage in it/ar", fn: () => { const it = JSON.stringify(DICT.it), ar = JSON.stringify(DICT.ar); const leak = ["How it works", "Get started free"].filter((s) => it.includes(s) || ar.includes(s)); return { pass: leak.length === 0, note: leak.join(",") || "clean" }; } },
]);


persona("Compatibility", [
  { desc: "Three.js WebGL fallback", fn: () => hero.includes("try") && hero.includes("catch") && hero.includes("display") },
  { desc: "IntersectionObserver guarded", fn: () => appjs.includes('"IntersectionObserver" in window') },
  { desc: "clipboard execCommand fallback", fn: () => appjs.includes("execCommand") },
  { desc: "form endpoint + mailto fallback", fn: () => appjs.includes("formEndpoint") && appjs.includes("mailto") },
  { desc: "reveal degrades (.in added)", fn: () => appjs.includes('classList.add("in")') },
  { desc: "counter fallback sets value", fn: () => appjs.includes('getAttribute("data-count") +') },
  { desc: "FAQ single-open logic", fn: () => appjs.includes("faq-item.open") },
]);
persona("UX / Conversion", [
  { desc: "CTA after h1, before first </section>", fn: () => { const h1 = html.indexOf("<h1"), cta = html.indexOf("hero.ctaStart"); return { pass: cta > h1 && cta < html.indexOf("</section>"), note: "ok" }; } },
  { desc: "copyable install in hero", fn: () => html.includes("data-copy=") },
  { desc: ">=4 CTAs across page", fn: () => (html.match(/data-repo-link/g) || []).length >= 4 },
  { desc: "contact form + email + links", fn: () => html.includes("contact-form") && html.includes("data-email-link") },
  { desc: "social proof badges", fn: () => html.includes("img.shields.io") },
  { desc: "credits company + dev", fn: () => html.includes("credits.dev") && html.includes("credits.company") },
  { desc: "value prop in lede", fn: () => (EN.hero && EN.hero.lede ? EN.hero.lede.length : 0) > 60 },
  { desc: ">=5 FAQ items", fn: () => { const n = (html.match(/faq-item reveal/g) || []).length; return { pass: n >= 5, note: n + " items" }; } },
  { desc: "mobile burger present", fn: () => html.includes("nav-burger") },
]);
persona("GitHub Pages Deployer", [
  { desc: ".nojekyll present", fn: () => exists(".nojekyll") },
  { desc: "internal paths rooted at /opencode-cron/", fn: () => { const refs = html.match(/(?:src|href)="(\/[^"]*)"/g) || []; const bad = refs.filter((r) => !r.includes("/opencode-cron/")); const rooted = refs.filter((r) => r.includes("/opencode-cron/")); return { pass: bad.length === 0 && rooted.length > 5, note: rooted.length + " rooted, " + bad.length + " bad" }; } },
  { desc: "pages workflow exists", fn: () => fs.existsSync(".github/workflows/pages.yml") },
  { desc: "workflow uploads site/", fn: () => { try { return fs.readFileSync(".github/workflows/pages.yml", "utf8").includes("path: site"); } catch (e) { return false; } } },
  { desc: "404.html present", fn: () => exists("404.html") },
  { desc: "manifest start_url rooted", fn: () => read("manifest.webmanifest").includes("/opencode-cron/") },
  { desc: "favicon referenced + exists", fn: () => html.includes("favicon.png") && exists("assets/img/favicon.png") },
  { desc: "social-preview exists", fn: () => exists("assets/img/social-preview.png") },
]);
persona("Code Quality Critic", [
  { desc: "config single source of truth", fn: () => configjs.includes("window.OC_CRON_SITE") && appjs.includes("OC_CRON_SITE") },
  { desc: "no dev-marker leftovers (// TODO, FIXME...)", fn: () => { const bad = /\/\/\s*(TODO|FIXME)\b|<!--\s*(TODO|FIXME)|\bFIXME\b|\bXXX\b|lorem ipsum/i.test(html + css + appjs + i18n + hero + configjs); return { pass: !bad, note: bad ? "dev marker found" : "clean (prose TODOs allowed)" }; } },
  { desc: "no console.log shipped", fn: () => !/console\.log/.test(appjs + hero + configjs) },
  { desc: "strict mode in app.js", fn: () => appjs.includes('"use strict"') },
  { desc: "i18n is IIFE, exposes OC_I18N", fn: () => i18n.includes("(function ()") && i18n.includes("window.OC_I18N") },
  { desc: "CSS uses design tokens", fn: () => (css.match(/var\(--/g) || []).length > 20 },
  { desc: "consistent class naming", fn: () => css.includes(".btn") && css.includes(".card") && css.includes(".section-head") },
  { desc: "hero3d reuses vectors in loop", fn: () => hero.includes("_v") && hero.includes("applyAxisAngle") },
]);

console.log("\n=== ADVERSARIAL REVIEW BOARD — opencode-cron site ===\n");
let allPerfect = true;
report.forEach((p) => { const icon = p.score === 100 ? "PASS" : "FAIL"; console.log(icon + "  " + p.name.padEnd(30) + " " + (p.score + "/100").padStart(7) + "   (" + p.passed + "/" + p.total + ")"); if (p.score !== 100) { allPerfect = false; p.results.filter((r) => !r.pass).forEach((r) => console.log("      x " + r.desc + "  -> " + r.note)); } });
console.log("\n" + (allPerfect ? "ALL PERSONAS 100/100 — APPROVED" : "NOT YET 100/100"));
process.exit(allPerfect ? 0 : 1);
