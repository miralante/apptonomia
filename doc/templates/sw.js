/*
 * {{DISPLAY_EN}} — sw.js (service worker)
 *
 * Cache-first strategy: every file in ARCHIVOS is served from
 * the cache; the network is only consulted when the request is
 * not in the cache.
 *
 * === Why cache-first ===
 * The app is fully client-side; once the visitor has loaded it
 * once, every subsequent visit is faster offline. The cache
 * makes the SW's `install` handler compare its `VERSION` against
 * the active cache name and only re-fetch + activate when they
 * differ. That is why **any change to a file in ARCHIVOS MUST
 * bump VERSION in the same commit** — see CLAUDE.md §B.1.
 *
 * === Bumping VERSION ===
 * Edit the `var VERSION = '{{SLUG}}-vN'` line below; increment N.
 * Add any new file to ARCHIVOS. Run `node scripts/check.js` and
 * `node scripts/check-version-bump.js`; both must pass.
 *
 * === Why no third-party runtime ===
 * The whole app is plain HTML/CSS/JS. No remote calls at runtime.
 * No analytics, no telemetry, no remote AI. The only network
 * egress this SW does is the cache-revalidation fetch for the
 * files listed below.
 */

var VERSION = '{{SLUG}}-v1';
var ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/styles.css',
  './assets/fonts/atkinson-hyperlegible-400.woff2',
  './assets/fonts/atkinson-hyperlegible-700.woff2',
  './assets/fonts/nunito-variable.woff2',
  './js/utils.js',
  './js/i18n.js',
  './js/storage.js',
  './js/feedback.js',
  './js/app.js',
  './strings.es.js',
  './strings.en.js'
  // Add every shipped file the visitor sees on first load.
  // Each tool under tools/<slug>/ also needs its six canonical
  // files (index.html, app.js, data.js, strings.es.js,
  // strings.en.js, styles.css) listed here.
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return cache.addAll(ARCHIVOS);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k !== VERSION;
      }).map(function (k) {
        return caches.delete(k);
      }));
    })
  );
});

self.addEventListener('fetch', function (event) {
  // Cache-first: serve from cache, fall back to network.
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (response) {
        // Only cache same-origin GETs.
        if (response.ok &&
            event.request.method === 'GET' &&
            new URL(event.request.url).origin === self.location.origin) {
          var clone = response.clone();
          caches.open(VERSION).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function () {
        // Offline and not in cache: serve a minimal offline fallback.
        if (event.request.mode === 'navigate') {
          return caches.match('./');
        }
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    })
  );
});
