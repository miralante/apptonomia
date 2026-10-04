/* ==========================================================================
   Apptonomia — language selector for the standalone subpages.
   External file for the same CSP reason as the rest of the suite: the
   production CSP is `script-src 'self'`, so the identical inline block each
   page used to carry was blocked in production. Both buttons were dead and
   aria-pressed stayed on "false", so nothing showed which language was
   active. One shared file replaces the repeated copies.
   Load AFTER the app's i18n helper, which defines window.App.i18n.
   ========================================================================== */
(function () {
  'use strict';
  var es = document.getElementById('btnLangEs');
  var en = document.getElementById('btnLangEn');
  if (!es || !en) return;

  function paint() {
    var active = App.i18n.locale();
    es.setAttribute('aria-pressed', String(active === 'es'));
    en.setAttribute('aria-pressed', String(active === 'en'));
  }

  es.addEventListener('click', function () { App.i18n.setLocale('es'); });
  en.addEventListener('click', function () { App.i18n.setLocale('en'); });
  paint();
})();
