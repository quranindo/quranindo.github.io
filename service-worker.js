/* ===============================
   SERVICE WORKER – MUSHAF ONLINE (OPTIMIZED)
   =============================== */

const CACHE_VERSION = 'v1.1.0';

const STATIC_CACHE = `mushaf-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `mushaf-runtime-${CACHE_VERSION}`;

const MAX_RUNTIME_ITEMS = 120; // batas cache runtime

/* ===============================
   FILE INTI (PRE-CACHE)
   =============================== */
const STATIC_FILES = [

  '/',
  '/index.html',
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
  '/fonts/surahquran.woff',
  '/fonts/surahquran.ttf',
  '/fonts/surahquran.svg',
  '/fonts/surahquran.eot',

  // PWA
  '/manifest.json',

  // ICON
  '/assets/img/favicon.ico',
  '/assets/img/quran-logo.png',
  '/assets/img/quran-logo-small3.png',
  '/assets/img/phone.png',
  '/assets/img/smart-media.jpg'

];


/* ===============================
   INSTALL
   =============================== */
self.addEventListener('install', event => {

  event.waitUntil(

    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES))

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
   HELPER: LIMIT CACHE SIZE
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
   FETCH
   =============================== */
self.addEventListener('fetch', event => {

  const req = event.request;

  if (req.method !== 'GET') return;


  const url = new URL(req.url);


  /* ===============================
     0️⃣ API JSON → ALWAYS NETWORK
     =============================== */
  if (url.pathname.startsWith('/api/')) {

    event.respondWith(

      fetch(req, { cache: "no-store" })
        .catch(() => caches.match(req))

    );

    return;

  }


  /* ===============================
     1️⃣ HTML → NETWORK FIRST
     =============================== */
  if (req.destination === 'document') {

    event.respondWith(

      fetch(req)

        .then(res => {

          const copy = res.clone();

          caches.open(RUNTIME_CACHE)
            .then(cache => {

              cache.put(req, copy);

              limitCache(RUNTIME_CACHE, MAX_RUNTIME_ITEMS);

            });

          return res;

        })

        .catch(() =>

          caches.match(req)
            .then(r => r || caches.match('/offline.html'))

        )

    );

    return;

  }


  /* ===============================
     2️⃣ IMAGE → CACHE FIRST
     =============================== */
  if (req.destination === 'image') {

    event.respondWith(

      caches.match(req)

        .then(cached => {

          if (cached) return cached;

          return fetch(req)

            .then(res => {

              const copy = res.clone();

              caches.open(RUNTIME_CACHE)
                .then(cache => {

                  cache.put(req, copy);

                  limitCache(RUNTIME_CACHE, MAX_RUNTIME_ITEMS);

                });

              return res;

            });

        })

    );

    return;

  }


  /* ===============================
     3️⃣ CSS / JS / FONT → CACHE FIRST
     =============================== */
  if (

    req.destination === 'style' ||
    req.destination === 'script' ||
    req.destination === 'font'

  ) {

    event.respondWith(

      caches.match(req)
        .then(cached => cached || fetch(req))

    );

    return;

  }


  /* ===============================
     DEFAULT
     =============================== */
  event.respondWith(

    caches.match(req)
      .then(cached => cached || fetch(req))

  );

});
