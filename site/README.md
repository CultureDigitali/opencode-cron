# opencode-cron - Launch Site

A single-page marketing / launch site for **opencode-cron**, built to be hosted
for free on **GitHub Pages**. No build step, no framework - just HTML, CSS,
vanilla JS and [Three.js](https://threejs.org) (via CDN import map).

## What's inside

| Path | Purpose |
|---|---|
| `index.html` | The whole landing page (semantic, SEO + GEO optimized) |
| `assets/css/styles.css` | Design system (dark, glassy - matches the product GUI) |
| `assets/js/i18n.js` | 10-language dictionary (en, it, es, fr, de, pt, zh, ja, ru, ar-RTL) + engine |
| `assets/js/config.js` | **Single source of truth** for contact email, links, identity |
| `assets/js/hero3d.js` | Three.js hero animation (glowing agent core + orbiting task nodes) |
| `assets/js/app.js` | Nav, language picker, scroll reveal, FAQ, counters, contact form |
| `assets/img/` | favicon + social preview (OG image) |
| `robots.txt`, `sitemap.xml`, `llms.txt`, `ai.txt` | SEO + GEO / AI-crawler files |
| `manifest.webmanifest` | PWA manifest |
| `404.html` | Themed not-found page |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (no Jekyll processing) |

## Deploy to GitHub Pages

1. Push this `site/` folder to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow `.github/workflows/pages.yml` publishes `site/` automatically.
4. The site will be live at `https://culturedigitali.github.io/opencode-cron/`.

> Because this is a **project** Pages site, all internal links are rooted at
> `/opencode-cron/`. Keep that prefix when adding new assets.

## Configure your contact email

Open `assets/js/config.js` and set:

```js
contactEmail: "you@yourdomain.com"   // used by the contact form + footer
```

By default the contact form opens the visitor's mail client (`mailto:`).
To use a form backend instead (Formspree, Basin, Netlify…), set `formEndpoint`
in the same file - the form will then POST there.

## Local preview

Any static server works, e.g.:

```bash
python3 -m http.server 8080 --directory site
# then open http://localhost:8080/
```

Note: opening `index.html` via `file://` won't load the ES-module Three.js hero
(module CORS). Use a local server as above.
