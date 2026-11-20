/* Registers the service worker from any page. A file, not an inline snippet:
   the CSP (`script-src 'self'`) blocks inline scripts.

   sw.js is resolved against this file's own URL (js/sw-register.js ->
   ../sw.js), so the registration works from pages at any depth.

   When a NEW worker takes control of a page that already had one, the page
   reloads once so the reader sees the new version. The first install does
   not reload. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  var here = document.currentScript && document.currentScript.src;
  var swUrl = here ? new URL('../sw.js', here).href : '/sw.js';

  var hadController = !!navigator.serviceWorker.controller;
  var reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController || reloaded) return;
    reloaded = true;
    window.location.reload();
  });

  window.addEventListener('load', function () {
    /* updateViaCache: 'none' — the update check always asks the network for
       sw.js, never the HTTP cache. */
    navigator.serviceWorker.register(swUrl, { updateViaCache: 'none' })
      .then(function (registration) {
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'visible') registration.update().catch(function () {});
        });
      })
      .catch(function (err) {
        if (window.console) console.warn('[{{SLUG}}] service worker registration failed:', err);
      });
  });
})();
