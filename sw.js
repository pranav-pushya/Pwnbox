/**
 * PwnBox Academy Service Worker
 * 
 * Provides offline caching for core application shell, stylesheets,
 * icons, and Three.js 3D engine libraries.
 */

const CACHE_NAME = 'pwnbox-shell-v3';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/games.html',
    '/notes.html',
    '/ai_assistant.html',
    '/masterguide/cybersecurity_masterguide.html',
    '/css/style.css',
    '/css/index.css',
    '/css/cybersecurity_masterguide.css',
    '/js/config.js',
    '/js/theme.js',
    '/js/markdown_parser.js',
    '/js/groq_service.js',
    '/js/ui_popups.js',
    '/js/vendor/firebase-app-compat.js',
    '/js/vendor/firebase-auth-compat.js',
    '/js/vendor/firebase-firestore-compat.js',
    '/assets/favicon-main.svg',
    '/assets/favicon-guide.svg',
    '/assets/tux_logo.png',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// Install event: Precache core shell and Three.js 3D engine
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                // Log non-fatal asset fetch errors during install
                console.warn('[PwnBox SW] Pre-cache non-blocking warning:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate event: Purge legacy caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event: Network-first for dynamic AI/API calls; Cache-first with stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Bypass caching for AI/Groq proxy endpoints and Firebase Auth
    if (url.pathname.startsWith('/api/') || 
        url.hostname.includes('identitytoolkit.googleapis.com') ||
        url.hostname.includes('api.groq.com')) {
        return;
    }

    // Only cache GET requests
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            // Serve cached response immediately if available
            const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Network failed; return cached response if present
                return cachedResponse;
            });

            return cachedResponse || fetchPromise;
        })
    );
});
