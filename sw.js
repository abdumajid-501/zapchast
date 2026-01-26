const CACHE_NAME = 'zapchast-cache-v1';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './main.css',
  './main.js',
  './manifest.json'
];

// install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
