/* Apptonomia — pre-paint translation pass.
   Loaded synchronously AFTER both strings files (which call register()
   on App.i18n) but still inline in the body, so the browser executes
   this script during the parse of the body — before the first paint
   of the page. The result: an English-speaking visitor never sees a
   flash of Spanish copy, even though the HTML source itself has the
   Spanish text in [data-i18n] fallbacks.

   Extracted from index.html into a separate file so the page can
   stay CSP-strict (script-src 'self', no inline scripts). The
   decision to put this in the body (rather than the head) is on
   purpose: it relies on [data-i18n] nodes already being parsed,
   so it needs to run after the body has been parsed — keeping it
   the last <script src="..."> in the body is the simplest way to
   guarantee ordering without an inline-script dependency. */
(function () {
  'use strict';

  var locale = window.__APPTONOMIA_LOCALE__ || 'es';
  var t = (window.App && App.i18n) ? App.i18n.t : function (k) { return k; };

  var meta = document.querySelector('meta[data-i18n-attr="meta.description"]');
  if (meta) meta.setAttribute('content', t('meta.description'));

  var nodes = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < nodes.length; i++) {
    var key = nodes[i].getAttribute('data-i18n');
    var value = t(key);
    if (value) nodes[i].textContent = value;
  }

  var btns = document.querySelectorAll('.btn-lang');
  for (var j = 0; j < btns.length; j++) {
    btns[j].setAttribute('aria-pressed',
      btns[j].getAttribute('data-locale') === locale ? 'true' : 'false');
  }
})();
