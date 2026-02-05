/* ===============================
   SERVICE WORKER – MUSHAF ONLINE
   =============================== */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `mushaf-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = 'mushaf-runtime';

/* ===============================
   FILE INTI (PRE-CACHE)
   =============================== */
const STATIC_FILES = [
  '/',
  '/index.html',

  // CSS
  '/css/base.css',
  '/css/surat.css',
  '/css/index.css',

  // JS
  '/js/surat.js',
  '/js/theme.js',
  '/js/index.js',
  '/js/plyr.js',

  // PWA
  '/manifest.json',

  // Icon / favicon / branding
  '/assets/img/favicon.ico',
  '/assets/img/doa.png',
  '/assets/img/kajian.png',
  '/assets/img/tafsir.png',
  '/assets/img/quran-logo.png',
  '/assets/img/quran-logo-small.png'
];

/* ===============================
   INSTALL
   =============================== */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_FILES))
  );
  self.skipWaiting();
});

/* ===============================
   ACTIVATE
   =============================== */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ===============================
   FETCH
   =============================== */
self.addEventListener('fetch', event => {
  const req = event.request;

  // hanya handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* ===============================
     1️⃣ HTML (surat & halaman)
     =============================== */
  if (req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  /* ===============================
     2️⃣ GAMBAR (ayat, OG, cover)
     =============================== */
  if (req.destination === 'image') {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;

        return fetch(req).then(res => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, copy));
          return res;
        });
      })
    );
    return;
  }

  /* ===============================
     3️⃣ CSS & JS
     =============================== */
  if (req.destination === 'style' || req.destination === 'script') {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
    return;
  }

  /* ===============================
     DEFAULT
     =============================== */
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
