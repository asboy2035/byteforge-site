const CACHE_NAME = 'vault-cache-v1';
const FILES_TO_CACHE = [
  '/vault',
  'index.html',
  'script.js',
  'styles.css'
];

// Install event - Cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files during install');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - Serve from cache or fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Clone the request
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            // Clone the response
            const responseClone = networkResponse.clone();

            // Open the cache and store the new response
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fallback logic if there's no network
          console.log('Network request failed, and no cache found.');
        });
      })
  );
});
