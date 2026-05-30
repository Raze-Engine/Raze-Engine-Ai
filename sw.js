const CACHE_NAME = 'addr-abbr-v2'; // Incremented version
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Service Worker and Cache Assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Force activation immediately
  );
});

// Clean up old caches when a new version is deployed
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache store:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network falling back to Cache strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
