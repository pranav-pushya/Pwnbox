/**
 * PWNBOX CYBER COMMAND — PWA INSTALLATION & STANDALONE RUNTIME ENGINE
 * Handles beforeinstallprompt, in-app install banner, and offline cache synchronization.
 */

(function () {
    'use strict';

    let deferredPrompt = null;

    // Create and inject PWA Install Banner
    function createInstallBanner() {
        if (localStorage.getItem('pwnbox_pwa_dismissed') === 'true' || localStorage.getItem('pwnbox_pwa_installed') === 'true') {
            return;
        }

        // Avoid duplicate banners
        if (document.getElementById('pwnPwaBanner')) return;

        const banner = document.createElement('div');
        banner.id = 'pwnPwaBanner';
        banner.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 24px;
            z-index: 9998;
            background: var(--bg-panel, #111827);
            color: var(--text-main, #f9fafb);
            border: 2px solid var(--border-color, #38bdf8);
            box-shadow: 4px 4px 0 var(--border-dim, #000);
            padding: 12px 18px;
            display: flex;
            align-items: center;
            gap: 14px;
            font-family: 'Space Mono', monospace;
            font-size: 0.8rem;
            max-width: 420px;
            border-radius: 4px;
            animation: slideInUp 0.3s ease-out;
        `;

        banner.innerHTML = `
            <div style="font-size: 1.6rem;">📱</div>
            <div style="flex: 1;">
                <div style="font-weight: 800; color: #38bdf8; font-size: 0.85rem;">INSTALL PWNBOX APP</div>
                <div style="font-size: 0.72rem; color: var(--text-muted, #9ca3af); margin-top: 2px;">
                    Install standalone academy with zero-latency offline access.
                </div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button type="button" id="btnPwaInstall" style="background: #38bdf8; color: #000; border: 1px solid #000; font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 800; padding: 6px 12px; cursor: pointer; border-radius: 3px;">
                    INSTALL
                </button>
                <button type="button" id="btnPwaDismiss" style="background: transparent; border: none; color: var(--text-muted, #9ca3af); font-size: 1.1rem; cursor: pointer; padding: 2px;" title="Dismiss Banner">
                    ✕
                </button>
            </div>
        `;

        if (document.body) document.body.appendChild(banner);

        const btnInstall = document.getElementById('btnPwaInstall');
        if (btnInstall) {
            btnInstall.onclick = triggerInstall;
        }

        const btnDismiss = document.getElementById('btnPwaDismiss');
        if (btnDismiss) {
            btnDismiss.onclick = dismissBanner;
        }
    }

    // Trigger Native Browser Install Prompt
    async function triggerInstall() {
        if (!deferredPrompt) {
            // Fallback for browsers that already installed or don't support beforeinstallprompt
            alert("To install PwnBox, use your browser's menu (e.g. Chrome 'Install PwnBox' or Safari 'Add to Home Screen').");
            return;
        }

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
            localStorage.setItem('pwnbox_pwa_installed', 'true');
        }
        deferredPrompt = null;
        dismissBanner();
    }

    // Dismiss Banner
    function dismissBanner() {
        const banner = document.getElementById('pwnPwaBanner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transition = 'opacity 0.25s ease';
            setTimeout(() => banner.remove(), 250);
        }
        localStorage.setItem('pwnbox_pwa_dismissed', 'true');
    }

    // Capture beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        createInstallBanner();
    });

    // Capture appinstalled event
    window.addEventListener('appinstalled', () => {
        localStorage.setItem('pwnbox_pwa_installed', 'true');
        dismissBanner();
    });

    // Public API
    window.PwnPWA = {
        install: triggerInstall,
        dismiss: dismissBanner,
        getPrompt: () => deferredPrompt,
        showBanner: createInstallBanner
    };

    // Auto-check on load (if prompt was caught or running in standalone)
    document.addEventListener('DOMContentLoaded', () => {
        // Register Service Worker if supported
        if ('serviceWorker' in navigator) {
            const swPath = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/modules/') || window.location.pathname.includes('/games/') || window.location.pathname.includes('/masterguide/') ? '../sw.js' : 'sw.js';
            navigator.serviceWorker.register(swPath).catch(err => {
                console.warn('PwnBox SW registration: ', err);
            });
        }
    });

})();
