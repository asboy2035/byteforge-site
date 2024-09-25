const CACHE_NAME = 'vault-cache-v1';
const FILES_TO_CACHE = [
  '/check-pwa.js',
  'index.html',
  'script.js',
  'styles.css',
  '/default-styles.css'
  'service-worker.js'
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
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        // Check if the response is a redirect
        if (networkResponse && networkResponse.type === 'opaque') {
          return networkResponse; // Don't cache opaque responses (e.g., redirects)
        }

        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }

        return networkResponse;
      }).catch(() => {
        console.log('Network request failed, and no cache found.');
      });
    })
  );
});
