// ============================================================
// WORLD CUP 2026 — SERVICE WORKER
// ============================================================

const CACHE_NAME = 'wc2026-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/thirdPlaceMatrix.js',
  './js/storage.js',
  './js/tournament.js',
  './js/app.js',
  './manifest.json',
  './icons/icon.svg',
];

// ── Install: cache static assets ────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clear old caches ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for static, network-first for others ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // External resources: fonts, CDN libs, Wikipedia logo → network first
  if (!url.origin.includes(self.location.origin)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Local static: cache first, then network fallback
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          // Cache new responses
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return response;
        })
      )
      .catch(() => {
        // Offline fallback: return index for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
