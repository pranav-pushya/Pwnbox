/**
 * PWNBOX CYBER COMMAND — UNIVERSAL MOBILE HAMBURGER NAVIGATION CONTROLLER
 * Delivers precise per-page menu options and theme-reactive dropdowns on mobile viewports (<= 768px).
 */

(function initPwnboxMobileNav() {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const inSubdir = path.includes('/masterguide/') || path.includes('/imp_info/') || 
                     path.includes('/imp%20info/') || path.includes('/modules/') || path.includes('/games/');
    const basePath = inSubdir ? '../' : '';

    // Auto-inject CSS stylesheet if not present
    if (!document.getElementById('pwnMobileNavCss')) {
        const link = document.createElement('link');
        link.id = 'pwnMobileNavCss';
        link.rel = 'stylesheet';
        link.href = `${basePath}css/mobile_nav.css?v=3.0`;
        document.head.appendChild(link);
    }

    // Determine current page context
    function detectPageKey() {
        if (path.endsWith('/index.html') || path.endsWith('/') || path.endsWith('/foot') || path.endsWith('/foot/')) {
            return 'home';
        }
        if (path.endsWith('/dashboard.html') || path.endsWith('/dashboard')) {
            return 'dashboard';
        }
        if (path.endsWith('/roadmap.html')) {
            return 'roadmap';
        }
        if (path.includes('/masterguide/') || path.includes('cybersecurity_masterguide')) {
            return 'masterguide';
        }
        if (path.includes('/imp_info/') || path.includes('/imp%20info/') || path.includes('imp_info.html')) {
            return 'imp_info';
        }
        if (path.endsWith('/games.html') || path.endsWith('/games')) {
            return 'games';
        }
        if (path.endsWith('/notes.html') || path.endsWith('/notes')) {
            return 'notes';
        }
        if (path.endsWith('/payloads.html')) {
            return 'payloads';
        }
        if (path.endsWith('/terminal.html')) {
            return 'terminal';
        }
        if (path.endsWith('/ctf.html')) {
            return 'ctf';
        }
        if (path.includes('/modules/')) {
            return 'modules';
        }
        return 'general';
    }

    function resolveHref(targetPath) {
        if (!inSubdir) return targetPath;
        // In subdirectory:
        if (targetPath.startsWith('masterguide/')) {
            return path.includes('/masterguide/') ? targetPath.replace('masterguide/', '') : `../${targetPath}`;
        }
        if (targetPath.startsWith('imp_info/')) {
            return (path.includes('/imp_info/') || path.includes('/imp%20info/')) ? targetPath.replace('imp_info/', '') : `../${targetPath}`;
        }
        return `../${targetPath}`;
    }

    // Specific menu configurations per page as requested by user
    function getPageMenuItems(pageKey) {
        const isAuth = localStorage.getItem('pwnbox_is_authenticated') === 'true';
        const userLabel = isAuth ? 'User Profile' : 'Login / User';

        switch (pageKey) {
            case 'home':
                // "home page k icon pe only dashboard , user , theme hona chahiye"
                return [
                    { type: 'link', label: 'Dashboard', icon: '🛡️', href: resolveHref('dashboard.html'), spanFull: true },
                    { type: 'action', action: 'user', label: userLabel, icon: isAuth ? '👤' : '🔐' },
                    { type: 'action', action: 'theme', label: 'Theme', icon: '🌓' }
                ];

            case 'dashboard':
                // "dashbord k icon pe setings,theme,user,home,notes,games,roadmap hona choahiye"
                return [
                    { type: 'action', action: 'settings', label: 'Settings', icon: '⚙️' },
                    { type: 'action', action: 'theme', label: 'Theme', icon: '🌓' },
                    { type: 'action', action: 'user', label: userLabel, icon: isAuth ? '👤' : '🔐' },
                    { type: 'link', label: 'Home Portal', icon: '🏠', href: resolveHref('index.html') },
                    { type: 'link', label: 'Notes Vault', icon: '📝', href: resolveHref('notes.html') },
                    { type: 'link', label: 'Cyber Games', icon: '🎮', href: resolveHref('games.html') },
                    { type: 'link', label: 'Roadmap', icon: '🗺️', href: resolveHref('masterguide/roadmap.html'), spanFull: true }
                ];

            case 'masterguide':
                return [
                    { type: 'action', action: 'chapters', label: 'Chapters Directory', icon: '📑', spanFull: true },
                    { type: 'action', action: 'theme', label: 'Theme', icon: '🌓' },
                    { type: 'action', action: 'user', label: userLabel, icon: isAuth ? '👤' : '🔐' },
                    { type: 'link', label: 'Dashboard', icon: '🛡️', href: resolveHref('dashboard.html') },
                    { type: 'link', label: 'Notes Vault', icon: '📝', href: resolveHref('notes.html') },
                    { type: 'link', label: 'Roadmap', icon: '🗺️', href: resolveHref('masterguide/roadmap.html'), spanFull: true }
                ];

            case 'roadmap':
                // "roadmap : theme,user,,dashboard, imp info"
                return [
                    { type: 'action', action: 'theme', label: 'Theme', icon: '🌓' },
                    { type: 'action', action: 'user', label: userLabel, icon: isAuth ? '👤' : '🔐' },
                    { type: 'link', label: 'Dashboard', icon: '🛡️', href: resolveHref('dashboard.html') },
                    { type: 'link', label: 'Imp Info', icon: '💡', href: resolveHref('imp_info/imp_info.html') }
                ];

            case 'imp_info':
                // "imp info : theme,user, general,google dorking ,hacker engines & devices,linux"
                return [
                    { type: 'action', action: 'theme', label: 'Theme', icon: '🌓' },
                    { type: 'action', action: 'user', label: userLabel, icon: isAuth ? '👤' : '🔐' },
                    { type: 'link', label: 'General', icon: '⚙️', href: resolveHref('imp_info/general.html') },
                    { type: 'link', label: 'Google Dorking', icon: '🔎', href: resolveHref('imp_info/google_dorking.html') },
                    { type: 'link', label: 'Engines & Devices', icon: '📡', href: resolveHref('imp_info/hacker_engines_devices.html') },
                    { type: 'link', label: 'Linux Compendium', icon: '🐧', href: resolveHref('imp_info/linux.html') }
                ];

            case 'games':
                // "games: theme,user, payload gen,ctf arena,terminal, dashbord"
                return [
                    { type: 'action', action: 'theme', label: 'Theme', icon: '🌓' },
                    { type: 'action', action: 'user', label: userLabel, icon: isAuth ? '👤' : '🔐' },
                    { type: 'link', label: 'Payload Gen', icon: '⚡', href: resolveHref('payloads.html') },
                    { type: 'link', label: 'CTF Arena', icon: '🚩', href: resolveHref('ctf.html') },
                    { type: 'link', label: 'WebShell Terminal', icon: '💻', href: resolveHref('terminal.html') },
                    { type: 'link', label: 'Dashboard', icon: '🛡️', href: resolveHref('dashboard.html') }
                ];

            case 'notes':
                return [
                    { type: 'action', action: 'theme', label: 'Theme', icon: '🌓' },
                    { type: 'action', action: 'user', label: userLabel, icon: isAuth ? '👤' : '🔐' },
                    { type: 'link', label: 'Dashboard', icon: '🛡️', href: resolveHref('dashboard.html') },
                    { type: 'link', label: 'Home Portal', icon: '🏠', href: resolveHref('index.html') },
                    { type: 'link', label: 'Payload Gen', icon: '⚡', href: resolveHref('payloads.html') },
                    { type: 'link', label: 'WebShell Terminal', icon: '💻', href: resolveHref('terminal.html') }
                ];

            case 'payloads':
            case 'terminal':
            case 'ctf':
            case 'modules':
            default:
                return [
                    { type: 'action', action: 'theme', label: 'Theme', icon: '🌓' },
                    { type: 'action', action: 'user', label: userLabel, icon: isAuth ? '👤' : '🔐' },
                    { type: 'link', label: 'Dashboard', icon: '🛡️', href: resolveHref('dashboard.html') },
                    { type: 'link', label: 'Home Portal', icon: '🏠', href: resolveHref('index.html') },
                    { type: 'link', label: 'Cyber Games', icon: '🎮', href: resolveHref('games.html') },
                    { type: 'link', label: 'Notes Vault', icon: '📝', href: resolveHref('notes.html') }
                ];
        }
    }

    function createHamburgerButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pwn-mobile-nav-toggle';
        btn.id = 'pwnMobileNavToggle';
        btn.setAttribute('aria-label', 'Toggle Navigation Menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = `
            <span class="pwn-hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
            </span>
        `;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
        return btn;
    }

    function handleActionClick(action, e) {
        if (action === 'chapters') {
            closeMobileMenu();
            if (typeof window.toggleMobileSidebar === 'function') {
                window.toggleMobileSidebar(true);
            }
            return;
        }
        if (action === 'theme') {
            if (typeof window.toggleTheme === 'function') {
                window.toggleTheme();
            } else {
                const cur = document.documentElement.getAttribute('data-theme') || 'light';
                const next = (cur === 'dark' || cur === 'matrix') ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
            }
            return;
        }

        if (action === 'user') {
            closeMobileMenu();
            if (typeof window.openAuthModal === 'function') {
                window.openAuthModal();
            } else if (typeof window.toggleProfileDropdown === 'function') {
                window.toggleProfileDropdown(e);
            } else {
                const target = resolveHref('dashboard.html');
                window.location.href = target;
            }
            return;
        }

        if (action === 'settings') {
            closeMobileMenu();
            if (typeof window.openSettingsModal === 'function') {
                window.openSettingsModal(e);
            } else {
                window.location.href = resolveHref('dashboard.html?settings=1');
            }
            return;
        }
    }

    function setupDomElements() {
        if (document.getElementById('pwnMobileDropdown')) return;

        const pageKey = detectPageKey();
        let toggleAttached = false;

        // 1. Landing Page Sticky Top Bar
        if (pageKey === 'home') {
            let mobileTopBar = document.getElementById('pwnMobileTopBar');
            if (!mobileTopBar) {
                mobileTopBar = document.createElement('div');
                mobileTopBar.id = 'pwnMobileTopBar';
                mobileTopBar.className = 'pwn-mobile-top-bar';
                mobileTopBar.innerHTML = `
                    <a href="${resolveHref('index.html')}" class="pwn-mobile-brand">
                        <span class="brand-shield">🛡️</span>
                        <span>PWNBOX CYBER</span>
                    </a>
                `;
                const btn = createHamburgerButton();
                mobileTopBar.appendChild(btn);
                document.body.insertBefore(mobileTopBar, document.body.firstChild);
                toggleAttached = true;
            }
        }

        // 2. All other page headers
        if (!toggleAttached) {
            const header = document.querySelector(
                'header.notes-top-header, header.games-top-header, header.payload-top-header, ' +
                'header.term-top-header, header.ctf-top-header, header.roadmap-nav, ' +
                'header.masterguide-nav, header.info-nav, header.test-header, header, .header'
            );

            if (header && !header.querySelector('.pwn-mobile-nav-toggle')) {
                const btn = createHamburgerButton();
                header.appendChild(btn);
                toggleAttached = true;
            }
        }

        // 3. Build Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'pwnMobileNavBackdrop';
        backdrop.className = 'pwn-mobile-dropdown-backdrop';
        backdrop.addEventListener('click', closeMobileMenu);
        document.body.appendChild(backdrop);

        // 4. Build Dropdown
        const dropdown = document.createElement('nav');
        dropdown.id = 'pwnMobileDropdown';
        dropdown.className = 'pwn-mobile-dropdown';
        dropdown.setAttribute('aria-label', 'Mobile Main Navigation');

        const savedAlias = localStorage.getItem('pwnbox_agent_alias') || 
                           localStorage.getItem('pwnbox_operative_name') || 
                           'AGENT OPERATIVE';
        const isAuth = localStorage.getItem('pwnbox_is_authenticated') === 'true';
        const rank = localStorage.getItem('pwnbox_agent_rank') || (isAuth ? 'VERIFIED' : 'GUEST');

        const items = getPageMenuItems(pageKey);
        const isSingleCol = items.length <= 4 && pageKey === 'home';

        const itemsHtml = items.map(item => {
            const spanClass = item.spanFull ? 'span-full' : '';
            if (item.type === 'link') {
                return `
                    <a href="${item.href}" class="pwn-dropdown-item ${spanClass}">
                        <span class="item-icon">${item.icon}</span>
                        <span class="item-text">${item.label}</span>
                    </a>
                `;
            } else {
                return `
                    <button type="button" class="pwn-dropdown-item ${spanClass}" data-action="${item.action}">
                        <span class="item-icon">${item.icon}</span>
                        <span class="item-text">${item.label}</span>
                    </button>
                `;
            }
        }).join('');

        dropdown.innerHTML = `
            <div class="pwn-dropdown-header">
                <div class="pwn-dropdown-status">
                    <span class="pwn-dropdown-dot"></span>
                    <span>${rank} CLEARANCE</span>
                </div>
                <div class="pwn-dropdown-alias">${savedAlias}</div>
            </div>

            <div class="pwn-dropdown-grid ${isSingleCol ? 'single-column' : ''}">
                ${itemsHtml}
            </div>

            <button type="button" class="pwn-action-btn btn-close-menu" id="pwnMobileCloseBtn">
                <span>✕</span>
                <span>CLOSE MENU</span>
            </button>
        `;

        document.body.appendChild(dropdown);

        // Event listeners for action buttons
        dropdown.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                handleActionClick(action, e);
            });
        });

        // Event listener for close button
        const closeBtn = dropdown.querySelector('#pwnMobileCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMobileMenu();
            });
        }

        // Close on link click
        dropdown.querySelectorAll('a.pwn-dropdown-item').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });

        // Close when window resized to desktop (> 768px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        const toggle = document.getElementById('pwnMobileNavToggle');
        const dropdown = document.getElementById('pwnMobileDropdown');
        const backdrop = document.getElementById('pwnMobileNavBackdrop');

        if (!dropdown || !toggle) return;

        const header = document.querySelector(
            'header.notes-top-header, header.games-top-header, header.payload-top-header, ' +
            'header.term-top-header, header.ctf-top-header, header.roadmap-nav, ' +
            'header.masterguide-nav, header.info-nav, header.test-header, .pwn-mobile-top-bar, header, .header'
        );
        if (header) {
            const rect = header.getBoundingClientRect();
            dropdown.style.top = `${Math.max(48, rect.bottom)}px`;
        }

        toggle.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('is-open');
        if (backdrop) backdrop.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function toggleMobileMenu() {
        const dropdown = document.getElementById('pwnMobileDropdown');
        if (!dropdown) return;
        const isOpen = dropdown.classList.contains('is-open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function closeMobileMenu() {
        const toggle = document.getElementById('pwnMobileNavToggle');
        const dropdown = document.getElementById('pwnMobileDropdown');
        const backdrop = document.getElementById('pwnMobileNavBackdrop');

        if (toggle) {
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
        if (dropdown) {
            dropdown.classList.remove('is-open');
        }
        if (backdrop) {
            backdrop.classList.remove('is-visible');
        }
        document.body.style.overflow = '';
    }

    window.PwnMobileNav = {
        open: openMobileMenu,
        close: closeMobileMenu,
        toggle: toggleMobileMenu,
        init: setupDomElements
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupDomElements);
    } else {
        setupDomElements();
    }
})();
