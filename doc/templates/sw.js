/*
 * {{DISPLAY_EN}} — sw.js (service worker)
 *
 * Strategy: network-first for page navigations (a deploy reaches readers on the
 * next visit), cache-first for every other file in FILES (fast, works offline).
 *
 * === Updating ===
 * The browser installs a new worker when this file's bytes change. That is why
 * **any change to a file in FILES must bump VERSION in the same commit** (see
 * CLAUDE.md §B.1): the new VERSION is a new cache, and `activate` deletes the old
 * ones. `scripts/check-version-bump.js` fails CI when the bump is missing.
 *
 * Precache requests use `cache: 'reload'`, so the install never copies a stale
 * file from the browser's HTTP cache into the new cache.
 *
 * === Bumping VERSION ===
 * Increment N in `var VERSION = '{{SLUG}}-vN'`. Add any new shipped file to FILES.
 * Run `node scripts/check.js` and `node scripts/smoke-sw.js`; both must pass.
 *
 * === No third-party runtime ===
 * Plain HTML/CSS/JS. No analytics, no telemetry, no remote AI. The only network
 * traffic is the app's own files.
 */

var VERSION = '{{SLUG}}-v1';
var FILES = [
  './',
  './index.html',
  './404.html',
  './manifest.json',
  './strings.es.js',
  './strings.en.js',
  './assets/css/suite-base.css',
  './assets/css/brand.css',
  './assets/css/styles.css',
  './assets/css/locale-picker.css',
  './assets/fonts/atkinson-hyperlegible-400.woff2',
  './assets/fonts/atkinson-hyperlegible-700.woff2',
  './assets/fonts/nunito-variable.woff2',
  './assets/icons/icon.svg',
  './js/i18n.js',
  './js/suite-chrome.js',
  './js/stars-engine.js',
  './js/achievements-engine.js',
  './js/feedback.js',
  './js/locale-picker-config.js',
  './js/locale-picker.js',
  './js/sw-register.js',
  './js/app.js',
  './about/',
  './about/index.html',
  './about/styles.css',
  './legal/',
  './legal/index.html',
  './legal/styles.css',
  // Add every shipped file here. scripts/check.js fails when a shipped file is
  // missing from this list or a listed file is missing on disk.
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return cache.addAll(FILES.map(function (url) {
        return new Request(url, { cache: 'reload' });
      }));
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key.indexOf('{{SLUG}}-') === 0 && key !== VERSION;
      }).map(function (key) {
        return caches.delete(key);
      }));
    })
  );
});

function sameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

/* Stores a fresh same-origin response for later offline use. */
function remember(request, response) {
  if (!response || !response.ok || response.type !== 'basic') return;
  var copy = response.clone();
  caches.open(VERSION).then(function (cache) { cache.put(request, copy); });
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET' || !sameOrigin(request)) return; // the browser handles it

  if (request.mode === 'navigate') {
    // Network-first: the reader gets the deployed page when online.
    event.respondWith(
      fetch(request).then(function (response) {
        remember(request, response);
        return response;
      }).catch(function () {
        return caches.match(request, { ignoreSearch: true }).then(function (cached) {
          return cached || caches.match('./index.html');
        }).then(function (fallback) {
          return fallback || new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
    );
    return;
  }

  // Cache-first for the app's files.
  event.respondWith(
    caches.match(request).then(function (cached) {
      return cached || fetch(request).then(function (response) {
        remember(request, response);
        return response;
      });
    })
  );
});
