/**
 * PWNBOX CYBER COMMAND — GLOBAL THEME & TACTICAL SHORTCUTS ENGINE
 * Provides universal theme toggling, global navigation hotkeys, and the
 * centralized Ctrl+/ Tactical Command Palette & Shortcuts Modal.
 */

// ── 1. THEME TOGGLING ──
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    const newTheme = (currentTheme === 'dark' || currentTheme === 'matrix' || currentTheme === 'cyberpunk' || currentTheme === 'synthwave') ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ── 2. PATH RESOLUTION & UNIVERSAL NAVIGATION ──
function getPwnboxPath(target) {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const inModules = path.includes('/modules/');
    const inMasterguide = path.includes('/masterguide/');

    switch (target) {
        case 'dashboard':
            return (inModules || inMasterguide) ? '../dashboard.html' : 'dashboard.html';
        case 'home':
            return (inModules || inMasterguide) ? '../index.html' : 'index.html';
        case 'notes':
            return (inModules || inMasterguide) ? '../notes.html' : 'notes.html';
        case 'masterguide':
            if (inMasterguide) return 'cybersecurity_masterguide.html';
            if (inModules) return '../masterguide/cybersecurity_masterguide.html';
            return 'masterguide/cybersecurity_masterguide.html';
        case 'roadmap':
            if (inMasterguide) return 'roadmap.html';
            if (inModules) return '../masterguide/roadmap.html';
            return 'masterguide/roadmap.html';
        case 'imp':
            if (inMasterguide) return 'imp_info.html';
            if (inModules) return '../masterguide/imp_info.html';
            return 'masterguide/imp_info.html';
        default:
            return '';
    }
}

function isCurrentPage(target) {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    switch (target) {
        case 'dashboard':
            return path.endsWith('/dashboard.html') || path.endsWith('/dashboard');
        case 'home':
            return path.endsWith('/index.html') || path.endsWith('/') || path === '';
        case 'notes':
            return path.endsWith('/notes.html') || path.endsWith('/notes');
        case 'masterguide':
            return path.endsWith('/cybersecurity_masterguide.html');
        case 'roadmap':
            return path.endsWith('/roadmap.html');
        case 'imp':
            return path.endsWith('/imp_info.html');
        default:
            return false;
    }
}

function navigateTo(target) {
    if (isCurrentPage(target)) return;
    const dest = getPwnboxPath(target);
    if (dest) {
        window.location.href = dest;
    }
}

// ── 3. SHORTCUTS REGISTRY ──
const PWNBOX_SHORTCUTS = [
    {
        key: 'D',
        badge: 'D',
        title: 'Tactical Dashboard',
        desc: 'Go to Command Center & Learning Tracks',
        category: 'Navigation',
        target: 'dashboard'
    },
    {
        key: 'H',
        badge: 'H',
        title: 'Home Portal',
        desc: 'Return to Academy Landing Page & Matrix Core',
        category: 'Navigation',
        target: 'home'
    },
    {
        key: 'T',
        badge: 'T',
        title: 'Toggle Theme',
        desc: 'Switch between Dark and Light cyber themes',
        category: 'Interface',
        action: () => toggleTheme()
    },
    {
        key: 'N',
        badge: 'N',
        title: 'Operative Notes',
        desc: 'Open Notes & In-Stream Payload Vault',
        category: 'Tools',
        target: 'notes'
    },
    {
        key: 'M',
        badge: 'M',
        title: 'Master Guide',
        desc: 'Comprehensive 10-Chapter Cyber Security Compendium',
        category: 'Intel',
        target: 'masterguide'
    },
    {
        key: 'R',
        badge: 'R',
        title: 'Career Roadmap',
        desc: 'Interactive Offensive & Defensive Cyber Career Tree',
        category: 'Intel',
        target: 'roadmap'
    },
    {
        key: 'I',
        badge: 'I',
        title: 'Important Info & Tools',
        desc: 'Curated Resource Matrix, Tools & Certifications',
        category: 'Intel',
        target: 'imp'
    },
    {
        key: 'C',
        badge: 'C',
        title: 'Command Cheat Sheet',
        desc: '80+ Essential CEH & Pentesting Commands (Dashboard Only)',
        category: 'Tools',
        action: () => {
            if (isCurrentPage('dashboard')) {
                if (typeof window.toggleCheatSheetDrawer === 'function') {
                    window.toggleCheatSheetDrawer();
                }
            } else {
                const dest = getPwnboxPath('dashboard');
                if (dest) window.location.href = dest + (dest.includes('?') ? '&' : '?') + 'cheatsheet=1';
            }
        }
    },
    {
        key: 'S',
        badge: 'S',
        title: 'Mission Settings',
        desc: 'Dedicated System Options & Preference Control Panel',
        category: 'Interface',
        action: () => openSettingsModal()
    }
];

// ── 4. SHORTCUTS COMMAND PALETTE MODAL DOM & INJECTION ──
function ensureShortcutsModal() {
    let modal = document.getElementById('pwnboxShortcutsOverlay');
    if (modal) return modal;

    // Inject Embedded Bauhaus Styles
    const styleId = 'pwnbox-shortcuts-modal-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .pwn-shortcuts-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.78);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease, visibility 0.2s ease;
                box-sizing: border-box;
                overscroll-behavior: contain !important;
            }
            .pwn-shortcuts-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .pwn-shortcuts-box {
                background: var(--bg-panel, #ffffff);
                color: var(--text-main, #0a0a0a);
                border: 3px solid var(--border-color, #0a0a0a);
                box-shadow: 10px 10px 0 var(--border-color, #0a0a0a);
                width: min(620px, 94vw);
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                font-family: 'Space Mono', monospace;
                transform: scale(0.94) translateY(12px);
                transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-sizing: border-box;
                overflow: hidden;
                overscroll-behavior: contain !important;
            }
            .pwn-shortcuts-overlay.active .pwn-shortcuts-box {
                transform: scale(1) translateY(0);
            }
            .pwn-shortcuts-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--bg-base, #f4f4f0);
                border-bottom: 2px solid var(--border-color, #0a0a0a);
            }
            .pwn-shortcuts-title {
                font-size: 0.95rem;
                font-weight: 800;
                display: flex;
                align-items: center;
                gap: 8px;
                letter-spacing: 0.5px;
            }
            .pwn-shortcuts-close {
                background: none;
                border: none;
                font-size: 1.3rem;
                cursor: pointer;
                color: var(--text-main, #0a0a0a);
                font-weight: 900;
                line-height: 1;
                padding: 2px 6px;
            }
            .pwn-shortcuts-search-container {
                padding: 12px 18px;
                background: var(--bg-panel, #ffffff);
                border-bottom: 2px solid var(--border-color, #0a0a0a);
                position: relative;
            }
            .pwn-shortcuts-search-input {
                width: 100%;
                padding: 10px 36px 10px 14px;
                background: var(--bg-base, #f4f4f0);
                border: 2px solid var(--border-color, #0a0a0a);
                color: var(--text-main, #0a0a0a);
                font-family: 'Space Mono', monospace;
                font-size: 0.85rem;
                box-sizing: border-box;
                outline: none;
            }
            .pwn-shortcuts-search-input:focus {
                border-color: #9333ea;
            }
            .pwn-shortcuts-search-icon {
                position: absolute;
                right: 30px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 1rem;
                color: var(--text-muted, #666);
                pointer-events: none;
            }
            .pwn-shortcuts-list {
                flex: 1;
                overflow-y: auto;
                padding: 12px 18px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-height: 52vh;
                overscroll-behavior: contain !important;
            }
            .pwn-shortcut-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 14px;
                border: 2px solid var(--border-color, #0a0a0a);
                background: var(--bg-base, #f4f4f0);
                cursor: pointer;
                box-shadow: 2px 2px 0 var(--border-color, #0a0a0a);
                transition: transform 0.12s, box-shadow 0.12s, border-color 0.12s;
                gap: 12px;
            }
            .pwn-shortcut-item:hover,
            .pwn-shortcut-item.highlighted {
                transform: translate(-2px, -2px);
                box-shadow: 4px 4px 0 #9333ea;
                border-color: #9333ea;
            }
            .pwn-shortcut-item-left {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
                min-width: 0;
            }
            .pwn-keycap {
                background: var(--text-main, #0a0a0a);
                color: var(--bg-base, #ffffff);
                font-family: 'Space Mono', monospace;
                font-weight: 900;
                font-size: 0.82rem;
                padding: 4px 10px;
                border: 2px solid var(--border-color, #0a0a0a);
                box-shadow: 2px 2px 0 var(--border-color, #0a0a0a);
                border-radius: 3px;
                min-width: 32px;
                text-align: center;
                flex-shrink: 0;
                letter-spacing: 0.5px;
            }
            .pwn-shortcut-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
                min-width: 0;
            }
            .pwn-shortcut-name {
                font-size: 0.85rem;
                font-weight: 800;
                color: var(--text-main, #0a0a0a);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pwn-shortcut-desc {
                font-size: 0.7rem;
                color: var(--text-muted, #666);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pwn-shortcut-category {
                font-size: 0.65rem;
                font-weight: 700;
                padding: 2px 8px;
                border: 1px solid var(--border-color, #0a0a0a);
                background: var(--bg-panel, #ffffff);
                color: #9333ea;
                text-transform: uppercase;
                flex-shrink: 0;
            }
            .pwn-shortcuts-footer {
                padding: 10px 18px;
                background: var(--bg-base, #f4f4f0);
                border-top: 2px solid var(--border-color, #0a0a0a);
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.68rem;
                color: var(--text-muted, #666);
            }
        `;
        document.head.appendChild(style);
    }

    // Create Modal Element
    modal = document.createElement('div');
    modal.className = 'pwn-shortcuts-overlay';
    modal.id = 'pwnboxShortcutsOverlay';

    modal.innerHTML = `
        <div class="pwn-shortcuts-box" role="dialog" aria-modal="true">
            <div class="pwn-shortcuts-header">
                <div class="pwn-shortcuts-title">
                    <span>⚡</span>
                    <span>PWNBOX KEYBOARD COMMAND MATRIX</span>
                </div>
                <button class="pwn-shortcuts-close" onclick="window.closeShortcutsModal()" title="Close (ESC)">&times;</button>
            </div>
            <div class="pwn-shortcuts-search-container">
                <input type="text" class="pwn-shortcuts-search-input" id="pwnboxShortcutsSearchInput" placeholder="Search shortcuts or pages (e.g. Dashboard, Notes, Theme, Roadmap)..." autocomplete="off" spellcheck="false">
                <span class="pwn-shortcuts-search-icon">🔍</span>
            </div>
            <div class="pwn-shortcuts-list" id="pwnboxShortcutsListFeed"></div>
            <div class="pwn-shortcuts-footer">
                <span>[ESC] to dismiss &bull; [ENTER] to select top match</span>
                <span>GLOBAL HOTKEYS // PWNBOX v3.4</span>
            </div>
        </div>
    `;

    // Click backdrop to dismiss
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeShortcutsModal();
        }
    });

    document.body.appendChild(modal);

    // Attach search filter listener
    const searchInput = modal.querySelector('#pwnboxShortcutsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderShortcutsList(e.target.value);
        });

        // Enter key to execute first filtered match
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const firstItem = modal.querySelector('.pwn-shortcut-item');
                if (firstItem) {
                    firstItem.click();
                }
            }
        });
    }

    return modal;
}

function renderShortcutsList(query = '') {
    const listFeed = document.getElementById('pwnboxShortcutsListFeed');
    if (!listFeed) return;

    const q = (query || '').toLowerCase().trim();
    const filtered = PWNBOX_SHORTCUTS.filter(s => {
        if (!q) return true;
        const inKey = s.key.toLowerCase().includes(q) || s.badge.toLowerCase().includes(q);
        const inTitle = s.title.toLowerCase().includes(q);
        const inDesc = s.desc.toLowerCase().includes(q);
        const inCat = s.category.toLowerCase().includes(q);
        return inKey || inTitle || inDesc || inCat;
    });

    listFeed.innerHTML = '';

    if (filtered.length === 0) {
        listFeed.innerHTML = `
            <div style="text-align: center; padding: 30px 10px; color: var(--text-muted); font-size: 0.8rem;">
                <div style="font-size: 1.8rem; margin-bottom: 6px;">🔍</div>
                <div>NO MATCHING SHORTCUT FOUND</div>
                <div style="font-size: 0.7rem; color: #888; margin-top: 4px;">Try searching 'dashboard', 'notes', 'theme', or key 'D'</div>
            </div>
        `;
        return;
    }

    filtered.forEach((shortcut, index) => {
        const item = document.createElement('div');
        item.className = `pwn-shortcut-item ${index === 0 ? 'highlighted' : ''}`;
        item.title = `Activate: ${shortcut.title}`;

        item.onclick = () => {
            closeShortcutsModal();
            if (typeof shortcut.action === 'function') {
                shortcut.action();
            } else if (shortcut.target) {
                navigateTo(shortcut.target);
            }
        };

        item.innerHTML = `
            <div class="pwn-shortcut-item-left">
                <span class="pwn-keycap">${escapeShortcutHtml(shortcut.badge)}</span>
                <div class="pwn-shortcut-info">
                    <span class="pwn-shortcut-name">${escapeShortcutHtml(shortcut.title)}</span>
                    <span class="pwn-shortcut-desc">${escapeShortcutHtml(shortcut.desc)}</span>
                </div>
            </div>
            <span class="pwn-shortcut-category">${escapeShortcutHtml(shortcut.category)}</span>
        `;

        listFeed.appendChild(item);
    });
}

function openShortcutsModal() {
    const modal = ensureShortcutsModal();
    renderShortcutsList('');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const searchInput = document.getElementById('pwnboxShortcutsSearchInput');
    if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 50);
    }
}

function closeShortcutsModal() {
    const modal = document.getElementById('pwnboxShortcutsOverlay');
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function toggleShortcutsModal() {
    const modal = document.getElementById('pwnboxShortcutsOverlay');
    if (modal && modal.classList.contains('active')) {
        closeShortcutsModal();
    } else {
        openShortcutsModal();
    }
}

function escapeShortcutHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ── 5. DEDICATED MISSION SETTINGS MODAL ──
function ensureSettingsModal() {
    let modal = document.getElementById('pwnboxSettingsOverlay');
    if (modal) return modal;

    const styleId = 'pwnbox-settings-modal-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .pwn-settings-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.82);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease, visibility 0.2s ease;
                box-sizing: border-box;
                overscroll-behavior: contain !important;
            }
            .pwn-settings-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .pwn-settings-box {
                background: var(--bg-panel, #ffffff);
                color: var(--text-main, #0a0a0a);
                border: 3px solid var(--border-color, #0a0a0a);
                box-shadow: 10px 10px 0 var(--border-color, #0a0a0a);
                width: min(640px, 94vw);
                max-height: 88vh;
                display: flex;
                flex-direction: column;
                font-family: 'Space Mono', monospace;
                transform: scale(0.94) translateY(12px);
                transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-sizing: border-box;
                overflow: hidden;
                overscroll-behavior: contain !important;
            }
            .pwn-settings-overlay.active .pwn-settings-box {
                transform: scale(1) translateY(0);
            }
            .pwn-settings-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--bg-base, #f4f4f0);
                border-bottom: 2px solid var(--border-color, #0a0a0a);
            }
            .pwn-settings-title {
                font-size: 0.95rem;
                font-weight: 800;
                display: flex;
                align-items: center;
                gap: 8px;
                letter-spacing: 0.5px;
            }
            .pwn-settings-close {
                background: none;
                border: none;
                font-size: 1.3rem;
                cursor: pointer;
                color: var(--text-main, #0a0a0a);
                font-weight: 800;
                line-height: 1;
                padding: 2px 6px;
            }
            .pwn-settings-body {
                flex: 1;
                overflow-y: auto;
                padding: 16px 18px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                overscroll-behavior: contain !important;
            }
            .pwn-settings-section {
                border: 2px solid var(--border-color, #0a0a0a);
                background: var(--bg-base, #f8f8f6);
                padding: 14px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .pwn-settings-section.danger-zone {
                border-color: #d9291c;
                background: rgba(217, 41, 28, 0.04);
            }
            .pwn-settings-section-title {
                font-size: 0.8rem;
                font-weight: 900;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 6px;
                border-bottom: 1px solid rgba(120, 120, 120, 0.2);
                padding-bottom: 6px;
            }
            .pwn-settings-section-title.danger {
                color: #d9291c;
                border-bottom-color: rgba(217, 41, 28, 0.3);
            }
            .pwn-setting-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                flex-wrap: wrap;
            }
            .pwn-setting-label {
                display: flex;
                flex-direction: column;
                gap: 3px;
                flex: 1;
                min-width: 200px;
            }
            .pwn-setting-name {
                font-size: 0.82rem;
                font-weight: 800;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .pwn-setting-desc {
                font-size: 0.68rem;
                color: var(--text-muted, #666);
                line-height: 1.35;
            }
            .pwn-setting-input {
                background: var(--bg-panel, #ffffff);
                color: var(--text-main, #0a0a0a);
                border: 2px solid var(--border-color, #0a0a0a);
                padding: 7px 10px;
                font-family: 'Space Mono', monospace;
                font-size: 0.78rem;
                font-weight: 700;
                box-sizing: border-box;
                width: 100%;
            }
            .pwn-setting-input:focus {
                outline: none;
                border-color: #9333ea;
                box-shadow: 0 0 6px rgba(147, 51, 234, 0.4);
            }
            .pwn-setting-badge {
                font-size: 0.65rem;
                font-weight: 800;
                padding: 2px 7px;
                border: 1px solid var(--border-color, #0a0a0a);
                border-radius: 2px;
                text-transform: uppercase;
                display: inline-block;
            }
            .pwn-setting-badge.linked {
                background: rgba(16, 185, 129, 0.15);
                color: #10b981;
                border-color: #10b981;
            }
            .pwn-setting-badge.unlinked {
                background: rgba(156, 163, 175, 0.15);
                color: #9ca3af;
                border-color: #6b7280;
            }
            .pwn-setting-btn {
                background: var(--bg-base, #f4f4f0);
                color: var(--text-main, #0a0a0a);
                border: 2px solid var(--border-color, #0a0a0a);
                box-shadow: 2px 2px 0 var(--border-color, #0a0a0a);
                padding: 6px 12px;
                font-family: 'Space Mono', monospace;
                font-size: 0.74rem;
                font-weight: 800;
                cursor: pointer;
                text-transform: uppercase;
                transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
                white-space: nowrap;
            }
            .pwn-setting-btn:hover {
                transform: translate(-1px, -1px);
                box-shadow: 3px 3px 0 var(--border-color, #0a0a0a);
            }
            .pwn-setting-btn.primary {
                background: var(--bauhaus-yellow, #f59e0b);
                color: #000;
            }
            .pwn-setting-btn.danger {
                background: var(--bauhaus-red, #d9291c);
                color: #ffffff;
                border-color: #991b1b;
            }
            .pwn-setting-btn.danger:hover {
                background: #b91c1c;
            }
            .pwn-settings-footer {
                padding: 12px 18px;
                background: var(--bg-base, #f4f4f0);
                border-top: 2px solid var(--border-color, #0a0a0a);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }
            .pwn-settings-status {
                font-size: 0.68rem;
                color: var(--text-muted, #777);
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);
    }

    modal = document.createElement('div');
    modal.className = 'pwn-settings-overlay';
    modal.id = 'pwnboxSettingsOverlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
        <div class="pwn-settings-box">
            <div class="pwn-settings-header">
                <div class="pwn-settings-title">
                    <span>⚙️</span>
                    <span>MISSION SETTINGS // ACCOUNT & SECURITY</span>
                </div>
                <button class="pwn-settings-close" onclick="closeSettingsModal()">&times;</button>
            </div>
            <div class="pwn-settings-body">
                <!-- 1. PROFILE & DETAILS (CHANGE EMAIL & ALIAS) -->
                <div class="pwn-settings-section">
                    <div class="pwn-settings-section-title">🪪 OPERATIVE IDENTITY & PROFILE</div>
                    <div class="pwn-setting-row" style="align-items: flex-end; gap: 8px;">
                        <div class="pwn-setting-label" style="flex: 2;">
                            <span class="pwn-setting-name">AGENT ALIAS / CALLSIGN</span>
                            <span class="pwn-setting-desc">Tactical codename displayed across command dossiers & terminals</span>
                            <input type="text" id="settingsAliasInput" class="pwn-setting-input" style="margin-top: 4px;" placeholder="e.g. ShadowZero">
                        </div>
                        <button class="pwn-setting-btn primary" onclick="handleSaveProfileAlias()" style="height: 35px;">SAVE ALIAS</button>
                    </div>

                    <div class="pwn-setting-row" style="align-items: flex-end; gap: 8px; margin-top: 6px;">
                        <div class="pwn-setting-label" style="flex: 2;">
                            <span class="pwn-setting-name">OPERATIVE EMAIL</span>
                            <span class="pwn-setting-desc">Verified email address linked to cloud authentication</span>
                            <input type="email" id="settingsEmailInput" class="pwn-setting-input" style="margin-top: 4px;" placeholder="agent@pwnbox.academy">
                        </div>
                        <button class="pwn-setting-btn" onclick="handleUpdateEmail()" style="height: 35px;">UPDATE EMAIL</button>
                    </div>
                </div>

                <!-- 2. PASSWORD SECURITY -->
                <div class="pwn-settings-section">
                    <div class="pwn-settings-section-title">🔑 PASSWORD & CREDENTIAL MANAGEMENT</div>
                    <div class="pwn-setting-row">
                        <div class="pwn-setting-label">
                            <span class="pwn-setting-name">CHANGE PASSWORD / RESET LINK</span>
                            <span class="pwn-setting-desc" id="settingsPwdResetDesc">Transmit a secure password reset link to your registered operative email</span>
                        </div>
                        <button class="pwn-setting-btn" onclick="handlePasswordReset()">SEND RESET LINK</button>
                    </div>
                </div>

                <!-- 3. LINKED ACCOUNTS (GOOGLE & GITHUB) -->
                <div class="pwn-settings-section">
                    <div class="pwn-settings-section-title">🔗 LINKED OAUTH PROVIDERS</div>
                    <div class="pwn-setting-row">
                        <div class="pwn-setting-label">
                            <span class="pwn-setting-name">
                                <span>🌐 GOOGLE MATRIX</span>
                                <span class="pwn-setting-badge unlinked" id="settingsGoogleBadge">NOT LINKED</span>
                            </span>
                            <span class="pwn-setting-desc">Fast 1-click authentication & Google Workspace identity</span>
                        </div>
                        <button class="pwn-setting-btn" id="settingsGoogleBtn" onclick="handleGoogleLinkToggle()">CONNECT GOOGLE</button>
                    </div>

                    <div class="pwn-setting-row" style="margin-top: 6px;">
                        <div class="pwn-setting-label">
                            <span class="pwn-setting-name">
                                <span>🐙 GITHUB INTEL</span>
                                <span class="pwn-setting-badge unlinked" id="settingsGithubBadge">NOT LINKED</span>
                            </span>
                            <span class="pwn-setting-desc">Developer profile sync, public exploit repos & code commits</span>
                        </div>
                        <button class="pwn-setting-btn" id="settingsGithubBtn" onclick="handleGithubLinkToggle()">CONNECT GITHUB</button>
                    </div>
                </div>

                <!-- 4. LEADERBOARD & PROFILE PRIVACY -->
                <div class="pwn-settings-section">
                    <div class="pwn-settings-section-title">👁️ LEADERBOARD & PROFILE PRIVACY</div>
                    <div class="pwn-setting-row">
                        <div class="pwn-setting-label">
                            <span class="pwn-setting-name">
                                <span>PRIVACY MODE</span>
                                <span class="pwn-setting-badge linked" id="settingsPrivacyBadge">PUBLIC [VISIBLE]</span>
                            </span>
                            <span class="pwn-setting-desc" id="settingsPrivacyDesc">When Stealth Mode is enabled, your alias and identity are hidden from public rankings and global activity streams.</span>
                        </div>
                        <button class="pwn-setting-btn" id="settingsPrivacyBtn" onclick="togglePrivacyMode()">TOGGLE STEALTH</button>
                    </div>
                </div>

                <!-- 5. DANGER ZONE // DELETE ACCOUNT -->
                <div class="pwn-settings-section danger-zone">
                    <div class="pwn-settings-section-title danger">⚠️ DANGER ZONE // ACCOUNT TERMINATION</div>
                    <div class="pwn-setting-row">
                        <div class="pwn-setting-label">
                            <span class="pwn-setting-name" style="color: #d9291c;">DELETE ACCOUNT & ERASE ALL DATA</span>
                            <span class="pwn-setting-desc">Permanently destroy operative profile, cloud notes, and completed CEH learning tracks. This action cannot be reversed.</span>
                        </div>
                        <button class="pwn-setting-btn danger" onclick="handleDeleteAccount()">DELETE ACCOUNT</button>
                    </div>
                </div>
            </div>
            <div class="pwn-settings-footer">
                <span class="pwn-settings-status" id="settingsAuthStatusText">IDENTITY: LOCAL // NOT LOGGED IN</span>
                <button class="pwn-setting-btn primary" onclick="closeSettingsModal()">SAVE & CLOSE [ESC]</button>
            </div>
        </div>
    `;

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSettingsModal();
    });

    document.body.appendChild(modal);
    return modal;
}

// Helper: Save Profile Alias
async function handleSaveProfileAlias() {
    const aliasInput = document.getElementById('settingsAliasInput');
    const newAlias = aliasInput ? aliasInput.value.trim() : '';
    if (!newAlias) {
        if (window.tacticalAlert) window.tacticalAlert({ title: "INVALID ALIAS", message: "Please enter a valid callsign.", type: "danger" });
        return;
    }
    localStorage.setItem('agentAlias', newAlias);
    localStorage.setItem('pwnbox_agent_alias', newAlias);
    localStorage.setItem('pwnbox_user_name', newAlias);

    const pName = document.getElementById('profileNameDisplay');
    if (pName) pName.textContent = newAlias;
    const hName = document.getElementById('headerName');
    if (hName) hName.textContent = newAlias;

    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
        try {
            await firebase.auth().currentUser.updateProfile({ displayName: newAlias });
        } catch(e) {
            console.warn("Firebase alias sync error:", e);
        }
    }
    if (window.tacticalAlert) {
        window.tacticalAlert({ title: "ALIAS UPDATED", message: `Operative callsign set to: ${newAlias}`, type: "success" });
    } else {
        alert(`Operative callsign set to: ${newAlias}`);
    }
    updateSettingsUI();
}

// Helper: Update Email Address
async function handleUpdateEmail() {
    const emailInput = document.getElementById('settingsEmailInput');
    const newEmail = emailInput ? emailInput.value.trim() : '';
    if (!newEmail || !newEmail.includes('@')) {
        if (window.tacticalAlert) window.tacticalAlert({ title: "INVALID EMAIL", message: "Please provide a valid operative email address.", type: "danger" });
        return;
    }

    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
        try {
            await firebase.auth().currentUser.updateEmail(newEmail);
            localStorage.setItem('pwnbox_user_email', newEmail);
            if (window.tacticalAlert) {
                window.tacticalAlert({ title: "EMAIL UPDATED", message: `Operative email updated to: ${newEmail}`, type: "success" });
            } else {
                alert(`Operative email updated to: ${newEmail}`);
            }
        } catch(err) {
            if (window.tacticalAlert) {
                window.tacticalAlert({ title: "UPDATE RE-AUTH REQUIRED", message: "Firebase requires recent authentication to change email: " + err.message, type: "warning" });
            } else {
                alert("Firebase error: " + err.message);
            }
        }
    } else {
        localStorage.setItem('pwnbox_user_email', newEmail);
        if (window.tacticalAlert) {
            window.tacticalAlert({ title: "EMAIL SAVED LOCALLY", message: `Email saved: ${newEmail}`, type: "info" });
        } else {
            alert(`Email saved: ${newEmail}`);
        }
    }
    updateSettingsUI();
}

// Helper: Password Reset Email Link
async function handlePasswordReset() {
    let email = localStorage.getItem('pwnbox_user_email') || '';
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.email) {
        email = firebase.auth().currentUser.email;
    }
    if (!email) {
        email = prompt("Enter your registered operative email to receive a password reset link:");
    }
    if (!email || !email.includes('@')) {
        if (window.tacticalAlert) window.tacticalAlert({ title: "INVALID EMAIL", message: "Please specify a valid email to receive reset credentials.", type: "danger" });
        return;
    }

    try {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            await firebase.auth().sendPasswordResetEmail(email);
            if (window.tacticalAlert) {
                window.tacticalAlert({
                    title: "RESET LINK TRANSMITTED",
                    message: `A secure password reset link has been dispatched to:\n\n${email}\n\nCheck your inbox and spam folders to set a new password.`,
                    type: "success"
                });
            } else {
                alert(`Password reset link sent to: ${email}`);
            }
        } else {
            if (window.tacticalAlert) window.tacticalAlert({ title: "OFFLINE MODE", message: "Firebase Auth matrix is offline. Password reset simulated.", type: "info" });
        }
    } catch(err) {
        if (window.tacticalAlert) {
            window.tacticalAlert({ title: "PASSWORD RESET FAILED", message: err.message, type: "danger" });
        } else {
            alert(err.message);
        }
    }
}

// Helper: Link / Unlink Google
async function handleGoogleLinkToggle() {
    if (typeof firebase === 'undefined' || !firebase.auth) return;
    const user = firebase.auth().currentUser;
    if (!user) {
        if (window.openAuthModal) { closeSettingsModal(); window.openAuthModal(); }
        return;
    }
    const hasGoogle = user.providerData && user.providerData.some(p => p.providerId === 'google.com');
    if (hasGoogle) {
        const confirmed = window.tacticalConfirm ?
            await window.tacticalConfirm({ title: "UNLINK GOOGLE MATRIX", message: "Sever Google OAuth link from your operative profile?", type: "warning", confirmText: "UNLINK" }) :
            confirm("Unlink Google from your account?");
        if (!confirmed) return;
        try {
            await user.unlink('google.com');
            if (window.tacticalAlert) window.tacticalAlert({ title: "GOOGLE UNLINKED", message: "Google account successfully unlinked.", type: "info" });
            updateSettingsUI();
        } catch(e) {
            if (window.tacticalAlert) window.tacticalAlert({ title: "UNLINK FAILED", message: e.message, type: "danger" });
        }
    } else {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await user.linkWithPopup(provider);
            if (window.tacticalAlert) window.tacticalAlert({ title: "GOOGLE LINKED", message: "Google account linked successfully!", type: "success" });
            updateSettingsUI();
        } catch(e) {
            if (window.tacticalAlert) window.tacticalAlert({ title: "LINKING FAILED", message: e.message, type: "danger" });
        }
    }
}

// Helper: Link / Unlink GitHub
async function handleGithubLinkToggle() {
    if (typeof firebase === 'undefined' || !firebase.auth) return;
    const user = firebase.auth().currentUser;
    if (!user) {
        if (window.openAuthModal) { closeSettingsModal(); window.openAuthModal(); }
        return;
    }
    const hasGithub = user.providerData && user.providerData.some(p => p.providerId === 'github.com');
    if (hasGithub) {
        const confirmed = window.tacticalConfirm ?
            await window.tacticalConfirm({ title: "UNLINK GITHUB INTEL", message: "Sever GitHub OAuth link from your operative profile?", type: "warning", confirmText: "UNLINK" }) :
            confirm("Unlink GitHub from your account?");
        if (!confirmed) return;
        try {
            await user.unlink('github.com');
            if (window.tacticalAlert) window.tacticalAlert({ title: "GITHUB UNLINKED", message: "GitHub account unlinked.", type: "info" });
            updateSettingsUI();
        } catch(e) {
            if (window.tacticalAlert) window.tacticalAlert({ title: "UNLINK FAILED", message: e.message, type: "danger" });
        }
    } else {
        try {
            const provider = new firebase.auth.GithubAuthProvider();
            await user.linkWithPopup(provider);
            if (window.tacticalAlert) window.tacticalAlert({ title: "GITHUB LINKED", message: "GitHub account linked successfully!", type: "success" });
            updateSettingsUI();
        } catch(e) {
            if (window.tacticalAlert) window.tacticalAlert({ title: "LINKING FAILED", message: e.message, type: "danger" });
        }
    }
}

// Helper: Privacy Mode Toggle
function togglePrivacyMode() {
    const isStealth = localStorage.getItem('pwnbox_privacy_mode') === 'stealth';
    const nextState = !isStealth;
    localStorage.setItem('pwnbox_privacy_mode', nextState ? 'stealth' : 'public');
    updateSettingsUI();
    if (window.tacticalAlert) {
        window.tacticalAlert({
            title: nextState ? "STEALTH MODE ACTIVATED" : "PUBLIC PROFILE ENGAGED",
            message: nextState ?
                "Stealth mode active: Your identity, email, and alias are now ANONYMIZED on leaderboards and threat telemetry." :
                "Public profile active: Your verified callsign and earned rank badges are visible on academy leaderboards.",
            type: nextState ? "warning" : "info"
        });
    }
}

// Helper: Permanent Delete Account & Erase User Data
async function handleDeleteAccount() {
    const confirmed = window.tacticalConfirm ?
        await window.tacticalConfirm({
            title: "⚠️ PERMANENT ACCOUNT ERASURE",
            message: "CRITICAL HAZARD: This will irreversibly delete your Firebase account, operative clearance, saved payloads, notes, and CEH progression.\n\nAre you absolutely sure?",
            type: "danger",
            confirmText: "ERASE ALL DATA",
            cancelText: "CANCEL"
        }) :
        confirm("CRITICAL: Delete your account and all saved data permanently?");
    if (!confirmed) return;

    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
        try {
            await firebase.auth().currentUser.delete();
        } catch(err) {
            console.warn("Firebase account delete note:", err);
        }
    }

    localStorage.clear();
    sessionStorage.clear();

    if (window.tacticalAlert) {
        await window.tacticalAlert({
            title: "ACCOUNT PURGED",
            message: "All operative credentials, notes, and training records have been shredded from this terminal.",
            type: "danger"
        });
    }
    const homePath = isCurrentPage('home') ? 'index.html' : getPwnboxPath('home');
    window.location.href = homePath || 'index.html';
}

function updateSettingsUI() {
    // 1. Alias & Email
    const aliasInput = document.getElementById('settingsAliasInput');
    const emailInput = document.getElementById('settingsEmailInput');
    const currentAlias = localStorage.getItem('agentAlias') || localStorage.getItem('pwnbox_user_name') || 'Cadet';
    const currentEmail = localStorage.getItem('pwnbox_user_email') || '';

    if (aliasInput && !aliasInput.value) aliasInput.value = currentAlias;
    if (emailInput && !emailInput.value) emailInput.value = currentEmail;

    // 2. Auth State Sync
    let user = null;
    if (typeof firebase !== 'undefined' && firebase.auth) {
        user = firebase.auth().currentUser;
    }

    const authStatusText = document.getElementById('settingsAuthStatusText');
    if (authStatusText) {
        if (user) {
            authStatusText.textContent = `IDENTITY: ${user.email || user.displayName} // VERIFIED`;
            authStatusText.style.color = '#10b981';
        } else {
            authStatusText.textContent = `IDENTITY: LOCAL // NOT LOGGED IN`;
            authStatusText.style.color = '#f59e0b';
        }
    }

    // 3. Google Badge & Button
    const googleBadge = document.getElementById('settingsGoogleBadge');
    const googleBtn = document.getElementById('settingsGoogleBtn');
    if (googleBadge && googleBtn) {
        const hasGoogle = user && user.providerData && user.providerData.some(p => p.providerId === 'google.com');
        if (hasGoogle) {
            googleBadge.textContent = 'LINKED [✓]';
            googleBadge.className = 'pwn-setting-badge linked';
            googleBtn.textContent = 'UNLINK';
            googleBtn.className = 'pwn-setting-btn danger';
        } else {
            googleBadge.textContent = 'NOT LINKED';
            googleBadge.className = 'pwn-setting-badge unlinked';
            googleBtn.textContent = 'CONNECT GOOGLE';
            googleBtn.className = 'pwn-setting-btn';
        }
    }

    // 4. GitHub Badge & Button
    const githubBadge = document.getElementById('settingsGithubBadge');
    const githubBtn = document.getElementById('settingsGithubBtn');
    if (githubBadge && githubBtn) {
        const hasGithub = user && user.providerData && user.providerData.some(p => p.providerId === 'github.com');
        if (hasGithub) {
            githubBadge.textContent = 'LINKED [✓]';
            githubBadge.className = 'pwn-setting-badge linked';
            githubBtn.textContent = 'UNLINK';
            githubBtn.className = 'pwn-setting-btn danger';
        } else {
            githubBadge.textContent = 'NOT LINKED';
            githubBadge.className = 'pwn-setting-badge unlinked';
            githubBtn.textContent = 'CONNECT GITHUB';
            githubBtn.className = 'pwn-setting-btn';
        }
    }

    // 5. Privacy Badge & Button
    const privacyBadge = document.getElementById('settingsPrivacyBadge');
    const privacyBtn = document.getElementById('settingsPrivacyBtn');
    if (privacyBadge && privacyBtn) {
        const isStealth = localStorage.getItem('pwnbox_privacy_mode') === 'stealth';
        if (isStealth) {
            privacyBadge.textContent = 'STEALTH [ANONYMOUS]';
            privacyBadge.className = 'pwn-setting-badge unlinked';
            privacyBadge.style.color = '#f59e0b';
            privacyBadge.style.borderColor = '#f59e0b';
            privacyBtn.textContent = 'SWITCH TO PUBLIC';
        } else {
            privacyBadge.textContent = 'PUBLIC [VISIBLE]';
            privacyBadge.className = 'pwn-setting-badge linked';
            privacyBadge.style.color = '#10b981';
            privacyBadge.style.borderColor = '#10b981';
            privacyBtn.textContent = 'SWITCH TO STEALTH';
        }
    }
}

function openSettingsModal(e) {
    if (e) e.stopPropagation();
    const modal = ensureSettingsModal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateSettingsUI();
}

function closeSettingsModal() {
    const modal = document.getElementById('pwnboxSettingsOverlay');
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function toggleSettingsModal() {
    const modal = document.getElementById('pwnboxSettingsOverlay');
    if (modal && modal.classList.contains('active')) {
        closeSettingsModal();
    } else {
        openSettingsModal();
    }
}

// ── 6. GLOBAL KEYDOWN LISTENER ──
document.addEventListener('keydown', function (e) {
    // 1. Shortcut: Ctrl + / (or Cmd + /) opens the Command Palette
    if ((e.ctrlKey || e.metaKey) && (e.key === '/' || e.code === 'Slash' || e.keyCode === 191)) {
        e.preventDefault();
        toggleShortcutsModal();
        return;
    }

    // 2. Shortcut: Escape key closes active modals
    if (e.key === 'Escape' || e.key === 'Esc') {
        const shortcutsModal = document.getElementById('pwnboxShortcutsOverlay');
        if (shortcutsModal && shortcutsModal.classList.contains('active')) {
            e.preventDefault();
            closeShortcutsModal();
            return;
        }
        const settingsModal = document.getElementById('pwnboxSettingsOverlay');
        if (settingsModal && settingsModal.classList.contains('active')) {
            e.preventDefault();
            closeSettingsModal();
            return;
        }
        const cheatDrawer = document.getElementById('cheatDrawer');
        if (cheatDrawer && cheatDrawer.classList.contains('active')) {
            if (typeof window.toggleCheatSheetDrawer === 'function') {
                e.preventDefault();
                window.toggleCheatSheetDrawer();
                return;
            }
        }
    }

    // 3. Ignore single-key shortcuts if holding modifier keys (Ctrl, Alt, Meta/Command)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    // 4. Ignore single-key shortcuts if typing in any input, textarea, select, or contenteditable
    const activeEl = document.activeElement;
    const activeTag = activeEl ? activeEl.tagName : '';
    const isEditable = activeEl ? (activeEl.isContentEditable || activeEl.getAttribute('contenteditable') === 'true') : false;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || isEditable) return;

    // 5. If Shortcuts modal or Settings modal is open, do not trigger background single-key navigation
    const shortcutsModal = document.getElementById('pwnboxShortcutsOverlay');
    if (shortcutsModal && shortcutsModal.classList.contains('active')) return;
    const settingsModal = document.getElementById('pwnboxSettingsOverlay');
    if (settingsModal && settingsModal.classList.contains('active')) return;

    // 6. Universal Single-Letter Shortcuts:
    const k = e.key ? e.key.toLowerCase() : '';

    switch (k) {
        case 'd': // D or d for Dashboard
            navigateTo('dashboard');
            break;
        case 'h': // H or h for Home
            navigateTo('home');
            break;
        case 't': // T or t for Theme
            toggleTheme();
            break;
        case 'n': // N or n for Notes
            navigateTo('notes');
            break;
        case 'm': // M or m for Master guide
            navigateTo('masterguide');
            break;
        case 'r': // R or r for Road map
            navigateTo('roadmap');
            break;
        case 'i': // I or i for Imp page
            navigateTo('imp');
            break;
        case 'c': // C or c for Cheatsheet (Dashboard page ONLY)
            if (isCurrentPage('dashboard')) {
                if (typeof window.toggleCheatSheetDrawer === 'function') {
                    window.toggleCheatSheetDrawer();
                }
            }
            break;
        case 's': // S or s for Settings
            openSettingsModal();
            break;
    }
});

// ── 7. EXPORT TO WINDOW ──
window.openShortcutsModal = openShortcutsModal;
window.closeShortcutsModal = closeShortcutsModal;
window.toggleShortcutsModal = toggleShortcutsModal;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.toggleSettingsModal = toggleSettingsModal;
window.toggleTheme = toggleTheme;
window.navigateToSettings = openSettingsModal;

// ── 8. UNIVERSAL POPUP & MODAL SCROLL ISOLATION ──
// When cursor is on any popup/modal across the website, background website scroll is blocked,
// and ONLY the popup's own scrollable content can scroll.
(function initUniversalPopupScrollLock() {
    let hoveredPopup = null;

    const POPUP_SELECTORS = [
        '.pwn-shortcuts-overlay',
        '.pwn-shortcuts-box',
        '.pwn-shortcuts-list',
        '.pwn-settings-overlay',
        '.pwn-settings-box',
        '.pwn-settings-body',
        '.pwn-popup-overlay',
        '.pwn-popup-box',
        '.pwn-popup-body',
        '.drawer-overlay',
        '#cheatDrawer',
        '.cheat-drawer',
        '.drawer-content',
        '.auth-modal',
        '.auth-modal-card',
        '.profile-dropdown',
        '.id-card-wrapper',
        '.id-card-inner',
        '.id-card-front',
        '.id-card-back',
        '.settings-body',
        '.reset-modal-overlay',
        '.reset-modal-box',
        '.reset-modal',
        '.modal',
        '.modal-overlay',
        '.modal-card',
        '.modal-content',
        '.modal-dialog',
        '.modal-box',
        '.secret-vault-modal',
        '.secret-vault-card',
        '.declassified-body-container',
        '.secret-modal',
        '.secret-modal-box',
        '.challenge-modal',
        '.lab-modal',
        'dialog',
        '[role="dialog"]',
        '[role="alertdialog"]'
    ].join(',');

    function findPopup(target) {
        if (!target || target === document.body || target === document.documentElement) return null;

        // 1. Direct or closest match on known popup/modal classes
        const matched = target.closest(POPUP_SELECTORS);
        if (matched) return matched;

        // 2. Generic fallback: element having class containing modal, popup, or overlay with fixed/absolute position
        let curr = target;
        while (curr && curr !== document.body && curr !== document.documentElement) {
            if (curr.classList) {
                for (const cls of curr.classList) {
                    const lc = cls.toLowerCase();
                    if ((lc.includes('modal') || lc.includes('popup') || lc.includes('overlay') || lc.includes('dropdown')) && !lc.includes('btn') && !lc.includes('toggle')) {
                        const pos = window.getComputedStyle(curr).position;
                        if (pos === 'fixed' || pos === 'absolute') {
                            return curr;
                        }
                    }
                }
            }
            curr = curr.parentElement;
        }

        return null;
    }

    function findScrollable(startEl, boundaryEl) {
        let curr = startEl;
        while (curr) {
            const s = window.getComputedStyle(curr);
            const canScroll = (s.overflowY === 'auto' || s.overflowY === 'scroll') && (curr.scrollHeight > curr.clientHeight);
            if (canScroll) return curr;
            if (curr === boundaryEl) break;
            curr = curr.parentElement;
        }
        if (boundaryEl) {
            const bs = window.getComputedStyle(boundaryEl);
            if ((bs.overflowY === 'auto' || bs.overflowY === 'scroll') && (boundaryEl.scrollHeight > boundaryEl.clientHeight)) {
                return boundaryEl;
            }
        }
        return null;
    }

    document.addEventListener('mouseover', (e) => {
        hoveredPopup = findPopup(e.target);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        hoveredPopup = null;
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
        const popup = hoveredPopup || findPopup(e.target);
        if (!popup) return; // Cursor is not on any popup -> normal website scrolling

        const scrollable = findScrollable(e.target, popup);
        if (scrollable) {
            const delta = e.deltaY;
            const atTop = delta < 0 && scrollable.scrollTop <= 0;
            const atBottom = delta > 0 && Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight;

            if (atTop || atBottom) {
                // Prevent scrolling the background website when boundary is reached!
                e.preventDefault();
            } else {
                // Let the popup scroll, but prevent event from escaping to website body
                e.stopPropagation();
            }
        } else {
            // Cursor is on a popup with no scrollable inner area -> block website scroll completely
            e.preventDefault();
        }
    }, { passive: false });

    // Touch support for mobile / touch devices
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const popup = hoveredPopup || findPopup(e.target);
        if (!popup) return;

        const scrollable = findScrollable(e.target, popup);
        if (scrollable) {
            const currentY = e.touches[0].clientY;
            const delta = touchStartY - currentY;
            const atTop = delta < 0 && scrollable.scrollTop <= 0;
            const atBottom = delta > 0 && Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight;
            if (atTop || atBottom) {
                e.preventDefault();
            } else {
                e.stopPropagation();
            }
        } else {
            e.preventDefault();
        }
    }, { passive: false });
})();
