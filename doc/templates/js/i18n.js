/* ==========================================================================
   {{DISPLAY_EN}} — internationalization core (window.App.i18n).

   Load order on every page:
     js/i18n.js -> strings.es.js -> strings.en.js -> the rest of the scripts.

   Each strings.<locale>.js calls App.i18n.register(table, '<locale>') with a
   nested table of English keys. Lookups use dotted keys ('home.title').

   Active locale: ?lang= in the URL (persisted), then the saved choice under
   STORAGE_KEY, then the browser language, then DEFAULT_LOCALE. Spanish is the
   source of truth and the fallback for a missing key (CLAUDE.md §B.2).

   A missing key returns '' (never the raw key, which would show up as
   "home.title" in the page) and warns in the console.

   Every key this app stores in localStorage starts with '{{SLUG}}:' so the
   config/ page can clear them without touching anything else (never
   localStorage.clear()).
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var STORAGE_KEY = '{{SLUG}}:locale';
  var SUPPORTED = ['es', 'en'];
  var DEFAULT_LOCALE = 'es';
  var BCP47 = { es: 'es-ES', en: 'en-GB' };
  var DICT = { es: {}, en: {} };

  function urlLocale() {
    try {
      var fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (fromUrl && SUPPORTED.indexOf(fromUrl) !== -1) return fromUrl;
    } catch (e) { /* old browser: ignore */ }
    return null;
  }

  function detect() {
    try {
      var first = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      var prefix = first.split(/[-_]/)[0].toLowerCase();
      if (SUPPORTED.indexOf(prefix) !== -1) return prefix;
    } catch (e) { /* ignore */ }
    return DEFAULT_LOCALE;
  }

  function locale() {
    var fromUrl = urlLocale();
    if (fromUrl) return fromUrl;
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage may be off */ }
    return detect();
  }

  function setLocale(loc) {
    if (SUPPORTED.indexOf(loc) === -1) return;
    try { localStorage.setItem(STORAGE_KEY, loc); } catch (e) { /* ignore */ }
    window.location.reload();
  }

  /* Deep merge, so several files (a page's own strings and the app's shared
     strings) can register keys under the same branch. */
  function merge(into, from) {
    for (var key in from) {
      if (!Object.prototype.hasOwnProperty.call(from, key)) continue;
      var value = from[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!into[key] || typeof into[key] !== 'object') into[key] = {};
        merge(into[key], value);
      } else {
        into[key] = value;
      }
    }
  }

  function register(table, loc) {
    if (SUPPORTED.indexOf(loc) === -1 || !table || typeof table !== 'object') return;
    merge(DICT[loc], table);
  }

  function lookup(table, key) {
    var parts = key.split('.');
    var current = table;
    for (var i = 0; i < parts.length; i++) {
      if (current == null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  function raw(key) {
    if (typeof key !== 'string') return undefined;
    var loc = locale();
    var value = lookup(DICT[loc], key);
    if (value === undefined && loc !== DEFAULT_LOCALE) value = lookup(DICT[DEFAULT_LOCALE], key);
    return value;
  }

  function t(key) {
    var value = raw(key);
    if (value === undefined || value === null) {
      if (window.console && console.warn) console.warn('[i18n] missing key:', key, '(locale=' + locale() + ')');
      return '';
    }
    return Array.isArray(value) ? value.join(', ') : String(value);
  }

  /* A random entry of an array key (e.g. feedback.success). */
  function pick(key) {
    var value = raw(key);
    if (!Array.isArray(value) || !value.length) return '';
    return value[Math.floor(Math.random() * value.length)];
  }

  function apply(root) {
    root = root || document;
    var i;
    var nodes = root.querySelectorAll('[data-i18n]');
    for (i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
    var aria = root.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < aria.length; i++) aria[i].setAttribute('aria-label', t(aria[i].getAttribute('data-i18n-aria')));
    var meta = root.querySelectorAll('[data-i18n-meta]');
    for (i = 0; i < meta.length; i++) meta[i].setAttribute('content', t(meta[i].getAttribute('data-i18n-meta')));
    var titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) document.title = t(titleKey);
  }

  function init() {
    var fromUrl = urlLocale();
    if (fromUrl) {
      try { localStorage.setItem(STORAGE_KEY, fromUrl); } catch (e) { /* ignore */ }
    }
    document.documentElement.lang = locale();
    apply(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.App.i18n = {
    SUPPORTED: SUPPORTED,
    DEFAULT_LOCALE: DEFAULT_LOCALE,
    STORAGE_KEY: STORAGE_KEY,
    locale: locale,
    setLocale: setLocale,
    lang: function () { return BCP47[locale()]; },
    register: register,
    t: t,
    pick: pick,
    apply: apply
  };
})();
