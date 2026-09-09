/* Apptonomia — App.i18n core (registry + t()).
   Loaded synchronously after the head bootstrap (which already picked
   the active locale from the browser) and before strings.es.js /
   strings.en.js, which call register() on us. After both strings files
   have registered, the DOMContentLoaded handler walks [data-i18n]
   nodes and applies the translations — the head bootstrap already did
   a first pass with whatever strings it could inline, so this is the
   second, complete pass.
   No routing, no shared core (utils / tts / storage are not needed
   here): this is a static landing, the whole i18n system fits in
   ~20 lines. */
(function () {
  'use strict';

  var DEFAULT_LOCALE = 'es';

  window.App = window.App || {};
  var tables = {};
  App.i18n = {
    register: function (table, locale) {
      tables[locale] = table;
    },
    t: function (key) {
      var locales = [App.i18n.locale(), DEFAULT_LOCALE];
      for (var i = 0; i < locales.length; i++) {
        var table = tables[locales[i]];
        if (!table) continue;
        var value = table;
        var parts = key.split('.');
        for (var j = 0; j < parts.length; j++) {
          if (value == null) break;
          value = value[parts[j]];
        }
        if (typeof value === 'string') return value;
      }
      return key;
    },
    /* Active locale is decided by the head bootstrap and stored on
       App.i18n so register() / t() can find it. The bootstrap picks
       it before any string file loads. */
    locale: function () { return activeLocale; }
  };
  var activeLocale = (typeof window.__APPTONOMIA_LOCALE__ === 'string')
    ? window.__APPTONOMIA_LOCALE__
    : DEFAULT_LOCALE;

  /* ---------------------------------------------------------------
    * Shared footer injector (apptonomia is a static landing; the
    * core is intentionally minimal — no assets/js/utils.js — so
    * inyectarPie lives next to App.i18n rather than in a separate
    * utils module. Fills any <footer data-pie-app>...</footer>
    * marker with the canonical one-link "back to portal" footer
    * used by about/ and legal/. Idempotent: a footer that already
    * has children is skipped.
    * --------------------------------------------------------------- */
  function inyectarPie() {
    var pies = document.querySelectorAll('footer[data-pie-app]');
    for (var i = 0; i < pies.length; i++) {
      var pie = pies[i];
      if (pie.childNodes && pie.childNodes.length > 0) continue;
      var i18nKey = pie.getAttribute('data-pie-key') || 'about.footerPortal';
      var extraClass = pie.getAttribute('data-pie-class');
      if (extraClass) pie.className = (pie.className ? pie.className + ' ' : '') + extraClass;
      pie.innerHTML = '<a class="btn btn-secundario" href="../index.html" data-i18n="' + i18nKey + '"></a>';
      /* Re-apply the active locale's text to the freshly inserted node. */
      var t = App.i18n.t;
      var a = pie.querySelector('[data-i18n]');
      if (a) {
        var value = t(i18nKey);
        if (value) a.textContent = value;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* The head bootstrap already did a pre-paint pass that translated
       every [data-i18n] node and painted the lang switch. By the
       time DOMContentLoaded fires, the visible text is already in
       the active locale; this handler only needs to wire the
       click-to-switch behaviour. */
    inyectarPie();
    var buttons = document.querySelectorAll('.btn-lang');
    function setLocale(locale) {
      activeLocale = locale;
      document.documentElement.lang = locale;
      var t = App.i18n.t;
      var meta = document.querySelector('meta[data-i18n-attr="meta.description"]');
      if (meta) meta.setAttribute('content', t('meta.description'));
      var nodes = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var key = nodes[i].getAttribute('data-i18n');
        var value = t(key);
        if (value) nodes[i].textContent = value;
      }
      /* Re-translate the freshly injected footer too. */
      var injected = document.querySelectorAll('footer[data-pie-app] [data-i18n]');
      for (var n = 0; n < injected.length; n++) {
        var k = injected[n].getAttribute('data-i18n');
        var v = t(k);
        if (v) injected[n].textContent = v;
      }
      for (var j = 0; j < buttons.length; j++) {
        var isActive = buttons[j].getAttribute('data-locale') === locale;
        buttons[j].setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
      try { localStorage.setItem('apptonomia:locale', locale); } catch (e) { /* ignore */ }
    }
    for (var k = 0; k < buttons.length; k++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          setLocale(btn.getAttribute('data-locale'));
        });
      })(buttons[k]);
    }
  });
})();