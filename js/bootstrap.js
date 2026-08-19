/* Apptonomia — pre-paint language bootstrap.
   Detects the browser language (or restores the user's saved choice)
   and applies it before the first paint, so an English-speaking
   visitor never sees a flash of Spanish copy.

   Must run synchronously, in the <head>, before the body is parsed.
   Same pattern as Teclatlon / Calculia: the bootstrap here just
   resolves the locale and stores it on window; the actual translation
   pass runs at DOMContentLoaded (script.js), by which time strings.*.js
   have already registered their tables on App.i18n.

   Extracted from index.html into a separate file so the page can
   stay CSP-strict (script-src 'self', no inline scripts). The
   JSON-LD <script type="application/ld+json"> block in index.html
   is still inline because JSON-LD is parsed as data, not as an
   executable script — browsers do not apply script-src to it. */
(function () {
  'use strict';

  var SUPPORTED = ['es', 'en'];
  var DEFAULT_LOCALE = 'es';

  function detect() {
    try {
      var saved = localStorage.getItem('apptonomia:locale');
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
      var langs = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || ''];
      for (var i = 0; i < langs.length; i++) {
        var prefix = (langs[i] || '').slice(0, 2).toLowerCase();
        if (SUPPORTED.indexOf(prefix) !== -1) return prefix;
      }
    } catch (e) { /* ignore */ }
    return DEFAULT_LOCALE;
  }

  var locale = detect();
  document.documentElement.lang = locale;
  /* Expose the chosen locale so the IIFE in script.js that
     defines App.i18n can read it without re-detecting. */
  window.__APPTONOMIA_LOCALE__ = locale;
})();
