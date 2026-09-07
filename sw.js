/* ============================================================
   NOVIQUE — Service Worker
   Cache-first for app shell, network-first for HTML navigation.
   v1.5.0 — bump CACHE_VERSION on every deploy to invalidate old caches
   ============================================================ */

var CACHE_VERSION = 'novique-v1.5.0';
var RUNTIME_CACHE = 'novique-runtime-v1.5.0';

var APP_SHELL = [
  './',
  './index.html',
  './css/style.css',
  './css/fonts.css',
  './js/config.openrouter.js',
  './js/app.js',
  './js/doodle-cursor.js',
  './manifest.json',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './icons/favicon.ico',
  './assets/img/logo.png',
  './assets/img/hero-visual.svg',
  './assets/img/about-visual.svg',
  './assets/img/projects/orbital-finance.svg',
  './assets/img/projects/northfield-goods.svg',
  './assets/img/projects/quanta-health.svg',
  './assets/img/projects/voltiq-dashboard.svg',
  './assets/img/projects/aeroloop-travel.svg',
  './assets/img/projects/lumen-retail.svg',
  './assets/img/projects/orbital-finance-case.svg',
  './assets/img/projects/northfield-goods-case.svg',
  './assets/img/projects/voltiq-dashboard-case.svg',
  './vendor/fontawesome/css/all.min.css',
  './vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './vendor/fontawesome/webfonts/fa-brands-400.woff2',
  './vendor/fontawesome/webfonts/fa-regular-400.woff2',
  './vendor/fonts/permanent-marker/permanent-marker-latin-400-normal.woff2',
  './vendor/fonts/kalam/kalam-latin-300-normal.woff2',
  './vendor/fonts/kalam/kalam-latin-400-normal.woff2',
  './vendor/fonts/kalam/kalam-latin-700-normal.woff2'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(APP_SHELL).catch(function (err) {
        console.warn('Service worker: some app shell assets failed to cache', err);
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_VERSION && key !== RUNTIME_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;

  if (request.method !== 'GET') return;

  var url = new URL(request.url);
  var isSameOrigin = url.origin === self.location.origin;

  // Navigation requests: network-first, fall back to cached shell (works offline)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE_VERSION).then(function (cache) { cache.put('./index.html', copy); });
          return response;
        })
        .catch(function () {
          return caches.match('./index.html');
        })
    );
    return;
  }

  // Same-origin static assets: cache-first
  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (response) {
          if (response && response.status === 200) {
            var copy = response.clone();
            caches.open(RUNTIME_CACHE).then(function (cache) { cache.put(request, copy); });
          }
          return response;
        }).catch(function () {
          return cached;
        });
      })
    );
    return;
  }

  // Cross-origin (fonts, icons CDN, unsplash images): stale-while-revalidate
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(function (cache) {
      return cache.match(request).then(function (cached) {
        var fetchPromise = fetch(request).then(function (response) {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(function () {
          return cached;
        });
        return cached || fetchPromise;
      });
    })
  );
});
