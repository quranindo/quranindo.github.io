/* ===============================
   SERVICE WORKER – MUSHAF ONLINE
   =============================== */

const CACHE_VERSION = 'v1.0.1';
const STATIC_CACHE = `mushaf-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = 'mushaf-runtime';

/* ===============================
   FILE INTI (PRE-CACHE)
   =============================== */
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',

  // CSS
  '/css/base.css',
  '/css/surat.css',
  '/css/index.css',
  '/css/plyr.css',

  // JS
  '/js/surat.js',
  '/js/theme.js',
  '/js/index.js',
  '/js/plyr.js',
  '/js/plyr.polyfilled.js',

  // FONT
  '/fonts/abufaqih.woff2',

  // PWA
  '/manifest.json',

  // ICON / ASSET
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

  /* ===============================
     1️⃣ HTML / PAGE (SURAT, DOA, DLL)
     Network → Cache → Offline page
     =============================== */
  if (req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then(r => r || caches.match('/offline.html'))
        )
    );
    return;
  }

  /* ===============================
     2️⃣ IMAGE
     Cache → Network
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
     Cache → Network
     =============================== */
  if (req.destination === 'style' || req.destination === 'script') {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
    return;
  }

  /* ===============================
     4️⃣ FONT
     =============================== */
  if (req.destination === 'font') {
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
