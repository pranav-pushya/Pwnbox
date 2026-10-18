/**
 * PWNBOX CYBER COMMAND — OPERATIVE AUTH GUARD
 * Enforces strict access restriction on all tactical modules and dashboard.
 * Unauthenticated cadets are instantly routed to the home portal.
 */
(function () {
    try {
        const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
        // Allowed guest-accessible pages: index.html, root, 404, dashboard, notes, games hub, and roadmap
        const isPublic = path.endsWith('/index.html') || path.endsWith('/') || path.endsWith('/404.html') || path === ''
            || path.endsWith('/dashboard.html')
            || path.endsWith('/notes.html')
            || path.endsWith('/games.html')
            || path.endsWith('/roadmap.html');
        
        if (!isPublic) {
            const isAuth = localStorage.getItem('pwnbox_is_authenticated') === 'true';
            if (!isAuth) {
                const isSubfolder = path.includes('/modules/') || path.includes('/masterguide/') || path.includes('/imp_info/') || path.includes('/games/');
                const redirectUrl = (isSubfolder ? '../' : '') + 'index.html?auth_required=1';
                window.location.replace(redirectUrl);
            }
        }
    } catch (e) {
        console.error("Auth Guard check failed:", e);
    }
})();
