/**
 * PWNBOX CYBER COMMAND — OPERATIVE AUTH GUARD
 * Enforces access restriction on restricted tactical laboratory modules.
 * Whitelisted public pages (dashboard, notes, games, roadmap, privacy, contact, thank-you, index) are fully accessible to guests.
 */
(function () {
    try {
        const path = window.location.pathname.replace(/\\/g, '/').toLowerCase().split('?')[0].split('#')[0];
        const normalized = (path.length > 1 && path.endsWith('/')) ? path.slice(0, -1) : path;

        // Whitelisted guest-accessible routes (both clean URLs and .html extensions)
        const publicPages = [
            '',
            '/',
            '/index',
            '/index.html',
            '/dashboard',
            '/dashboard.html',
            '/notes',
            '/notes.html',
            '/games',
            '/games.html',
            '/roadmap',
            '/roadmap.html',
            '/masterguide/roadmap',
            '/masterguide/roadmap.html',
            '/privacy',
            '/privacy.html',
            '/contact',
            '/contact.html',
            '/thank-you',
            '/thank-you.html',
            '/404',
            '/404.html'
        ];

        const isPublic = publicPages.includes(normalized)
            || normalized.endsWith('/index.html')
            || normalized.endsWith('/dashboard.html')
            || normalized.endsWith('/notes.html')
            || normalized.endsWith('/games.html')
            || normalized.endsWith('/roadmap.html')
            || normalized.endsWith('/privacy.html')
            || normalized.endsWith('/contact.html')
            || normalized.endsWith('/thank-you.html')
            || normalized.endsWith('/404.html');

        if (!isPublic) {
            const isAuth = localStorage.getItem('pwnbox_is_authenticated') === 'true';
            if (!isAuth) {
                const isSubfolder = path.includes('/modules/') || path.includes('/masterguide/') || path.includes('/imp_info/') || path.includes('/games/');
                const redirectUrl = (isSubfolder ? '../' : './') + 'index.html?auth_required=1';
                window.location.replace(redirectUrl);
            }
        }
    } catch (e) {
        console.error("Auth Guard check failed:", e);
    }
})();
