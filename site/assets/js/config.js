/* =============================================================================
 * config.js - SINGLE SOURCE OF TRUTH for site-wide identity & contact details.
 * -----------------------------------------------------------------------------
 * IMPORTANT: set CONTACT_EMAIL to the real address you want visitors to reach
 * (it is used by the contact form's mailto: fallback, the footer, JSON-LD and
 * FAQ). Everything else can stay as-is.
 * ========================================================================== */
window.OC_CRON_SITE = {
  /* --- Identity --- */
  company: "Culture Digitali Srl",
  developer: "Luigi Strazzullo",
  developerUrl: "https://github.com/CultureDigitali",
  repoUrl: "https://github.com/CultureDigitali/opencode-cron",
  npmUrl: "https://www.npmjs.com/package/@culturedigitali/opencode-cron",
  issuesUrl: "https://github.com/CultureDigitali/opencode-cron/issues",
  siteUrl: "https://culturedigitali.github.io/opencode-cron/",
  license: "MIT",
  version: "1.0.0",

  /* --- Contact ----------------------------------------------------------------
   * 1) mailto: works out-of-the-box (no backend needed on GitHub Pages).
   * 2) If you use Formspree/Netlify/Basin, set formEndpoint to your endpoint and
   *    the form will POST there instead of opening the mail client.
   * --------------------------------------------------------------------------- */
  contactEmail: "you@example.com", // <-- REPLACE with your real email
  formEndpoint: ""                  // e.g. "https://formspree.io/f/xxxxxxx" (leave empty for mailto)
};
