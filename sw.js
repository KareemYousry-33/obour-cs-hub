const CACHE_NAME = 'obourcs-hub-v14';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './index.css',
    './app.js',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=Outfit:wght@400;700;900&display=swap'
];

self.addEventListener('install', (event) => {
    // Force the new service worker to take over immediately
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Network First strategy: Always try to fetch from network first so users get the latest update
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If the request is successful, update the cache
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseToCache));
                }
                return response;
            })
            .catch(() => {
                // If network fails (offline), fallback to cache
                return caches.match(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    // Take control of the page immediately without requiring a refresh
    event.waitUntil(self.clients.claim());
    
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
