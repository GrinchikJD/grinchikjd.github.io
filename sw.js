const PWA_CACHE_NAME = 'jd-pwa-app-cache-v1';
const PWA_urlsToCache = [
    '/',
    '/favicon.ico',
    '/index.html',
    '/src/styles/styles.css',
    '/src/fonts/Montserrat-Regular.ttf',
    '/src/lib/tv.js',
    '/src/lib/alpine.js',
    '/app.js',
    '/src/components/other/FormSpree.js',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PWA_CACHE_NAME).then(cache => cache.addAll(PWA_urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});