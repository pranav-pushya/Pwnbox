/**
 * PwnBox Academy Service Worker (v4)
 * 
 * Provides robust offline caching for the complete academy:
 * application shell, 8 tactical cyber laboratories, 8 mini-games,
 * 10-chapter master guide, field intelligence compendiums, stylesheets,
 * and offline WebGL/Three.js engines.
 */

const CACHE_NAME = 'pwnbox-shell-v11';

const STATIC_ASSETS = [
    // Core Application Shell & Portals
    '/',
    '/index.html',
    '/pages/dashboard.html',
    '/pages/games.html',
    '/pages/notes.html',
    '/pages/terminal.html',
    '/pages/ctf.html',
    '/pages/intel.html',
    '/pages/payloads.html',
    '/pages/ai_assistant.html',
    '/pages/contact.html',
    '/pages/privacy.html',
    '/pages/thank-you.html',
    '/404.html',

    // Master Guide & Career Roadmap
    '/masterguide/cybersecurity_masterguide.html',
    '/masterguide/roadmap.html',
    '/masterguide/masterguide_test.html',

    // All 8 Tactical Cyber Kill Chain Laboratories
    '/modules/Footprinting.html',
    '/modules/Scanning.html',
    '/modules/Enumeration.html',
    '/modules/Vulnerability.html',
    '/modules/SystemHacking.html',
    '/modules/WebAppThreats.html',
    '/modules/OSINT.html',
    '/modules/BlackOps.html',
    '/modules/CloudSecurity.html',
    '/modules/ActiveDirectory.html',
    '/modules/SocDefense.html',
    '/modules/IoTSecurity.html',

    // All 8 Interactive Cyber Warfare Mini-Games
    '/games/cidr_block.html',
    '/games/cipher_relic.html',
    '/games/entropy_clash.html',
    '/games/packet_gatekeeper.html',
    '/games/phish_detective.html',
    '/games/privesc_tower.html',
    '/games/ransom_panic.html',
    '/games/sqli_locksmith.html',

    // Field Intelligence & Important Info Suite
    '/imp_info/imp_info.html',
    '/imp_info/career_paths.html',
    '/imp_info/ports.html',
    '/imp_info/http_codes.html',
    '/imp_info/general.html',
    '/imp_info/google_dorking.html',
    '/imp_info/hacker_engines_devices.html',
    '/imp_info/linux.html',
    '/imp_info/ecosystem.html',

    // Modular Design System Stylesheets
    '/css/style.css',
    '/css/index.css',
    '/css/landing.css',
    '/css/cybersecurity_masterguide.css',
    '/css/games.css',
    '/css/terminal.css',
    '/css/ctf.css',
    '/css/payloads.css',
    '/css/imp_info.css',
    '/css/mobile_nav.css',
    '/css/masterguide_chat.css',
    '/css/masterguide_test.css',
    '/css/notes.css',
    '/css/intel.css',
    '/css/tactical_policy.css',
    '/css/404.css',
    '/css/roadmap.css',

    // Core JavaScript Engines & Offline Libraries
    '/js/three.min.js',
    '/js/OrbitControls.js',
    '/js/d3.min.js',
    '/js/config.js',
    '/js/theme.js',
    '/js/index.js',
    '/js/games.js',
    '/js/terminal.js',
    '/js/ctf.js',
    '/js/intel.js',
    '/js/payload_generator.js',
    '/js/cybersecurity_masterguide.js',
    '/js/roadmap.js',
    '/js/notes.js',
    '/js/auth_guard.js',
    '/js/ui_popups.js',
    '/js/markdown_parser.js',
    '/js/groq_service.js',
    '/js/firebase_auth.js',
    '/js/cloud_sync.js',
    '/js/pwa_install.js',
    '/js/mobile_nav.js',
    '/js/vendor/firebase-app-compat.js',
    '/js/vendor/firebase-auth-compat.js',
    '/js/vendor/firebase-firestore-compat.js',

    // Module Terminal Logic
    '/js/Footprinting.js',
    '/js/Scanning.js',
    '/js/Enumeration.js',
    '/js/Vulnerablity.js',
    '/js/SystemHacking.js',
    '/js/WebAppThreats.js',
    '/js/OSINT.js',
    '/js/BlackOps.js',
    '/js/CloudSecurity.js',
    '/js/ActiveDirectory.js',
    '/js/SocDefense.js',
    '/js/IoTSecurity.js',

    // Branding & Graphic Assets
    '/assets/favicon-main.svg',
    '/assets/favicon-guide.svg',
    '/assets/tux_logo.png',
    '/assets/pwnbox-og-preview.png'
];

// Install event: Precache full tactical academy
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('[PwnBox SW v4] Non-fatal precache asset notice:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate event: Purge legacy cache versions
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

// Fetch event: Network-first for dynamic AI/API calls; Cache-first with stale-while-revalidate for local assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Bypass caching for dynamic serverless API calls, Groq AI, and Firebase Auth endpoints
    if (url.pathname.startsWith('/api/') || 
        url.hostname.includes('identitytoolkit.googleapis.com') ||
        url.hostname.includes('securetoken.googleapis.com') ||
        url.hostname.includes('api.groq.com')) {
        return;
    }

    // Only cache GET requests
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            // Serve cached response immediately if available, while refreshing in background
            const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                return cachedResponse;
            });

            return cachedResponse || fetchPromise;
        })
    );
});
