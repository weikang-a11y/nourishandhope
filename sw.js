const CACHE = 'nourish-hope-v1';
const PAGES = [
  '/nourishandhope/',
  '/nourishandhope/index.html',
  '/nourishandhope/parents.html',
  '/nourishandhope/kids.html',
  '/nourishandhope/understand.html',
  '/nourishandhope/gethelp.html',
  '/nourishandhope/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PAGES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      });
    }).catch(() => caches.match('/nourishandhope/index.html'))
  );
});
