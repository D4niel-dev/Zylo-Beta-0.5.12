// ─── Cache Version ──────────────────────────────────────────
// Bump this string on EVERY release to bust all old caches.
const CACHE_VERSION = 'v5-zylo';
const CORE_CACHE = `core-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

const CORE_ASSETS = [
  '/',
  '/login.html',
  '/signup.html',
  '/forgot.html',
  '/reset.html',
  '/mainapp.html',
  '/loading.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/files/sw-register.js',
  '/css/global.css',
  '/css/ai-chat.css',
  '/css/sidebar.css',
  // Local vendor assets to ensure full offline startup
  '/files/vendor/tailwindcss.js',
  '/files/vendor/feather-icons.js',
  '/files/vendor/socket.io.min.js',
  '/files/vendor/cropper.min.css',
  '/files/vendor/cropper.min.js',
  '/files/vendor/emoji-mart.css',
  '/files/vendor/emoji-mart.js',
  '/files/vendor/heroicons_data.json',
  '/files/vendor/heroicons.js',
  // Core images
  '/images/zylo/Zylo_icon.ico',
  '/images/zylo/Zylo_icon.png',
  '/images/ai/Dizel/Diszi_beta2.png',
  '/images/ai/Zylia/Zily_beta2.png',
  '/images/default_avatar.png',
  '/images/default_banner.png',
  // Social icon assets referenced in signup
  '/images/devicons/google-original.svg',
  '/images/devicons/github-original.svg',
  '/images/devicons/discordjs-original.svg',
  '/images/devicons/windows8-original.svg'
];

// ─── Install ────────────────────────────────────────────────
// Pre-cache core assets and immediately take over.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ───────────────────────────────────────────────
// Delete ALL caches that don't match the current version, then claim clients.
self.addEventListener('activate', (event) => {
  const currentCaches = new Set([CORE_CACHE, RUNTIME_CACHE, API_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !currentCaches.has(key))
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Message handler ────────────────────────────────────────
// Allow the registration script to ask "what version are you?"
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ─── Fetch strategies ───────────────────────────────────────
function wantsHTML(req) {
  return req.headers.get('accept')?.includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // HTML navigation: Network first, fall back to cache, then offline page.
  // This ensures users ALWAYS get the latest HTML when online.
  if (wantsHTML(req)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CORE_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  // Same-origin API GETs: Network first with cache fallback
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/') && req.method === 'GET') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(API_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // CSS & JS assets: Network first to ensure latest code, cache fallback for offline
  if (url.origin === self.location.origin && (url.pathname.endsWith('.css') || url.pathname.endsWith('.js'))) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CORE_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Static assets (images, uploads): Cache first (these change rarely)
  if (url.origin === self.location.origin && (url.pathname.startsWith('/images/') || url.pathname.startsWith('/uploads/') || url.pathname.startsWith('/files/'))) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached || fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
      )
    );
    return;
  }

  // Third-party scripts/styles/fonts: Stale-while-revalidate
  if (['script', 'style', 'font'].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});