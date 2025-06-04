// Basic service worker

const CACHE_NAME = 'ecommerce-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icons/favicon.svg',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                ).catch(() => {
                    // If both cache and network fail, show offline page
                    if (event.request.url.indexOf('.html') > -1) {
                        return caches.match('/index.html');
                    }
                    
                    // For images, return a placeholder
                    if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                        return caches.match('/icons/favicon.svg');
                    }
                });
            })
    );
}); 