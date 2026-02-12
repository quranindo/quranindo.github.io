/* ===============================
   SERVICE WORKER – MUSHAF ONLINE (FINAL CLEAN)
   Kang Ismet Edition 🚀
   =============================== */

const CACHE_VERSION = 'v2.0.1';

const STATIC_CACHE  = `mushaf-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `mushaf-runtime-${CACHE_VERSION}`;

const MAX_RUNTIME_ITEMS = 120;


/* ===============================
   PRE-CACHE (ASSET INTI)
   =============================== */
const STATIC_FILES = [

  '/',
  '/index.html',
   '/surat/index.html',
  '/offline.html',
  '/about.html',
  '/filantropi.html',

  // CSS
  '/css/base.css',
  '/css/surat.css',
  '/css/index.css',
  '/css/banner.css',
  '/css/player.css',
  '/css/surahquran.css',
  '/css/article.css',
  '/css/jadwal-imsakiyah.css',

  // JS
  '/js/surat.js',
  '/js/theme.js',
  '/js/index.js',
  '/js/player.js',
  '/js/waqafsplitter.js',
  '/js/jadwal-imsakiyah.js',

  // FONT
  '/fonts/abufaqih.woff2',
  '/fonts/surahquran.woff2',

  // PWA
  '/manifest.json',

  // ICON
  '/assets/img/favicon.ico',
  '/assets/img/quran-logo.png'
];


/* ===============================
   INSTALL
   =============================== */
self.addEventListener('install', event => {

  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache =>
      cache.addAll(STATIC_FILES)
    )
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
        keys.map(key => {
          if (!key.includes(CACHE_VERSION)) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();

});


/* ===============================
   LIMIT CACHE SIZE
   =============================== */
async function limitCache(cacheName, maxItems) {

  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    limitCache(cacheName, maxItems);
  }

}


/* ===============================
   FETCH HANDLER
   =============================== */
self.addEventListener('fetch', event => {

  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);


  /* =================================================
     1️⃣ EQURAN API (ayat) → NETWORK FIRST + CACHE
     ================================================= */
  if (url.hostname.includes('equran.id')) {

    event.respondWith(

      caches.open(RUNTIME_CACHE).then(cache =>

        fetch(req)
          .then(res => {
            cache.put(req, res.clone());
            limitCache(RUNTIME_CACHE, MAX_RUNTIME_ITEMS);
            return res;
          })
          .catch(() => cache.match(req))

      )

    );

    return;
  }


  /* =================================================
     2️⃣ JADWAL IMSAKIYAH → NETWORK FIRST (AUTO UPDATE)
     ================================================= */
  if (url.pathname.includes('jadwal-imsakiyah.json')) {

    event.respondWith(

      fetch(req)
        .then(res => {

          const copy = res.clone();

          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(req, copy);
          });

          return res;

        })
        .catch(() => caches.match(req))

    );

    return;
  }


  /* =================================================
     3️⃣ HTML → NETWORK FIRST
     ================================================= */
  if (req.destination === 'document') {

    event.respondWith(

      fetch(req)
        .then(res => {

          const copy = res.clone();

          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(req, copy);
            limitCache(RUNTIME_CACHE, MAX_RUNTIME_ITEMS);
          });

          return res;

        })
        .catch(() =>
          caches.match(req).then(r => r || caches.match('/offline.html'))
        )

    );

    return;
  }


  /* =================================================
     4️⃣ IMAGE / AUDIO → CACHE FIRST
     ================================================= */
  if (req.destination === 'image' || req.url.includes('.mp3')) {

    event.respondWith(

      caches.match(req).then(cached =>
        cached || fetch(req).then(res => {

          const copy = res.clone();

          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(req, copy);
            limitCache(RUNTIME_CACHE, MAX_RUNTIME_ITEMS);
          });

          return res;

        })
      )

    );

    return;
  }


  /* =================================================
     5️⃣ CSS / JS / FONT → CACHE FIRST
     ================================================= */
  if (
    req.destination === 'style' ||
    req.destination === 'script' ||
    req.destination === 'font'
  ) {

    event.respondWith(
      caches.match(req).then(r => r || fetch(req))
    );

    return;
  }


  /* =================================================
     DEFAULT
     ================================================= */
  event.respondWith(
    caches.match(req).then(r => r || fetch(req))
  );

});

