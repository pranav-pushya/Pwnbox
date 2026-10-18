/**
 * PWNBOX CYBER COMMAND — UNIVERSAL TACTICAL UI POPUP SYSTEM
 * Replaces all native browser alert() and confirm() dialogs with high-tech,
 * accessible Bauhaus cyberpunk modal dialogs and notification toasts.
 */
(function () {
    'use strict';

    // ── 1. EMBEDDED TACTICAL STYLES ──
    const popupStyleId = 'pwnbox-tactical-popup-styles';
    if (!document.getElementById(popupStyleId)) {
        const style = document.createElement('style');
        style.id = popupStyleId;
        style.textContent = `
            .pwn-popup-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease, visibility 0.2s ease;
                padding: 16px;
            }
            .pwn-popup-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .pwn-popup-box {
                background: var(--bg-panel, #ffffff);
                color: var(--text-main, #0a0a0a);
                border: 3px solid var(--border-color, #0a0a0a);
                box-shadow: 8px 8px 0 var(--border-color, #0a0a0a);
                max-width: 440px;
                width: min(440px, 92vw);
                padding: 22px;
                font-family: 'Space Mono', monospace;
                transform: scale(0.92) translateY(10px);
                transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-sizing: border-box;
                position: relative;
            }
            .pwn-popup-overlay.active .pwn-popup-box {
                transform: scale(1) translateY(0);
            }
            .pwn-popup-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 2px solid var(--border-color, #0a0a0a);
                padding-bottom: 10px;
                margin-bottom: 14px;
            }
            .pwn-popup-title {
                font-size: 0.95rem;
                font-weight: 800;
                letter-spacing: -0.3px;
                display: flex;
                align-items: center;
                gap: 8px;
                text-transform: uppercase;
                margin: 0;
            }
            .pwn-popup-title.danger { color: var(--bauhaus-red, #d9291c); }
            .pwn-popup-title.warning { color: var(--bauhaus-yellow, #f2a900); }
            .pwn-popup-title.success { color: var(--cyber-green, #10b981); }
            .pwn-popup-title.info { color: var(--bauhaus-blue, #005a9c); }
            .pwn-popup-close-x {
                background: none;
                border: none;
                font-size: 1.2rem;
                font-weight: 800;
                cursor: pointer;
                color: var(--text-main, #0a0a0a);
                line-height: 1;
                padding: 2px 6px;
            }
            .pwn-popup-body {
                font-size: 0.84rem;
                line-height: 1.5;
                margin-bottom: 20px;
                white-space: pre-wrap;
                word-break: break-word;
                font-weight: 600;
                max-height: 60vh;
                overflow-y: auto;
            }
            .pwn-popup-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            .pwn-popup-btn {
                font-family: 'Space Mono', monospace;
                font-size: 0.78rem;
                font-weight: 800;
                padding: 9px 16px;
                border: 2px solid var(--border-color, #0a0a0a);
                cursor: pointer;
                text-transform: uppercase;
                transition: transform 0.1s, box-shadow 0.1s;
                box-shadow: 3px 3px 0 var(--border-color, #0a0a0a);
            }
            .pwn-popup-btn:hover {
                transform: translate(-1px, -1px);
                box-shadow: 4px 4px 0 var(--border-color, #0a0a0a);
            }
            .pwn-popup-btn:active {
                transform: translate(2px, 2px);
                box-shadow: 1px 1px 0 var(--border-color, #0a0a0a);
            }
            .pwn-popup-btn.primary {
                background: var(--bauhaus-blue, #005a9c);
                color: #ffffff;
            }
            .pwn-popup-btn.danger {
                background: var(--bauhaus-red, #d9291c);
                color: #ffffff;
            }
            .pwn-popup-btn.cancel {
                background: var(--bg-panel, #ffffff);
                color: var(--text-main, #0a0a0a);
            }

            /* Tactical Toast Notification */
            .pwn-toast-container {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 1000000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            }
            .pwn-toast {
                pointer-events: auto;
                background: var(--bg-panel, #ffffff);
                color: var(--text-main, #0a0a0a);
                border: 2px solid var(--border-color, #0a0a0a);
                box-shadow: 4px 4px 0 var(--border-color, #0a0a0a);
                padding: 12px 18px;
                font-family: 'Space Mono', monospace;
                font-size: 0.82rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 12px;
                transform: translateX(120%);
                transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                max-width: min(420px, 92vw);
                line-height: 1.4;
            }
            .pwn-toast.active { transform: translateX(0); }
            .pwn-toast.warning {
                border-left: 6px solid var(--bauhaus-yellow, #f2a900);
            }
            .pwn-toast.danger {
                border-left: 6px solid var(--bauhaus-red, #d9291c);
            }
            .pwn-toast.success {
                border-left: 6px solid var(--cyber-green, #10b981);
            }
            .pwn-toast.info {
                border-left: 6px solid var(--bauhaus-blue, #005a9c);
            }
        `;
        document.head.appendChild(style);
    }

    // ── 2. AUDIO FEEDBACK (OPTIONAL BEEP) ──
    function playBeep(freq = 780) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch (e) {
            // Audio policy safety
        }
    }

    // ── 3. TACTICAL MODAL BUILDER ──
    let activeOverlay = null;

    function createModalDom() {
        if (activeOverlay && document.body.contains(activeOverlay)) {
            activeOverlay.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'pwn-popup-overlay';
        overlay.innerHTML = `
            <div class="pwn-popup-box">
                <div class="pwn-popup-header">
                    <h4 class="pwn-popup-title" id="pwnPopupTitle">
                        <span id="pwnPopupIcon">ℹ️</span>
                        <span id="pwnPopupTitleText">SYSTEM NOTICE</span>
                    </h4>
                    <button class="pwn-popup-close-x" id="pwnPopupCloseX" title="Close">&times;</button>
                </div>
                <div class="pwn-popup-body" id="pwnPopupBody"></div>
                <div class="pwn-popup-actions" id="pwnPopupActions"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        activeOverlay = overlay;
        return overlay;
    }

    // ── 4. TACTICAL ALERT ──
    window.tacticalAlert = function (options) {
        return new Promise((resolve) => {
            const opts = typeof options === 'string' ? { message: options } : (options || {});
            const title = opts.title || 'SYSTEM NOTIFICATION';
            const message = opts.message || '';
            const type = opts.type || 'info';
            const buttonText = opts.buttonText || 'ACKNOWLEDGE // OK';

            const overlay = createModalDom();
            const titleEl = overlay.querySelector('#pwnPopupTitle');
            const iconEl = overlay.querySelector('#pwnPopupIcon');
            const titleTextEl = overlay.querySelector('#pwnPopupTitleText');
            const bodyEl = overlay.querySelector('#pwnPopupBody');
            const actionsEl = overlay.querySelector('#pwnPopupActions');
            const closeX = overlay.querySelector('#pwnPopupCloseX');

            titleEl.className = 'pwn-popup-title ' + type;
            iconEl.textContent = type === 'danger' ? '⚠️' : (type === 'warning' ? '⚡' : (type === 'success' ? '✓' : 'ℹ️'));
            titleTextEl.textContent = title;
            bodyEl.textContent = message;

            const btn = document.createElement('button');
            btn.className = `pwn-popup-btn ${type === 'danger' ? 'danger' : 'primary'}`;
            btn.textContent = buttonText;

            function close() {
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.remove();
                    if (opts.onOk) opts.onOk();
                    resolve(true);
                }, 200);
            }

            btn.onclick = close;
            closeX.onclick = close;

            overlay.onclick = (e) => {
                if (e.target === overlay) close();
            };

            actionsEl.appendChild(btn);
            playBeep(type === 'danger' ? 440 : 880);

            setTimeout(() => {
                overlay.classList.add('active');
                btn.focus();
            }, 10);
        });
    };

    // ── 5. TACTICAL CONFIRM ──
    window.tacticalConfirm = function (options) {
        return new Promise((resolve) => {
            const opts = typeof options === 'string' ? { message: options } : (options || {});
            const title = opts.title || 'CONFIRM OPERATIVE ACTION';
            const message = opts.message || '';
            const type = opts.type || 'warning';
            const confirmText = opts.confirmText || 'CONFIRM';
            const cancelText = opts.cancelText || 'ABORT';

            const overlay = createModalDom();
            const titleEl = overlay.querySelector('#pwnPopupTitle');
            const iconEl = overlay.querySelector('#pwnPopupIcon');
            const titleTextEl = overlay.querySelector('#pwnPopupTitleText');
            const bodyEl = overlay.querySelector('#pwnPopupBody');
            const actionsEl = overlay.querySelector('#pwnPopupActions');
            const closeX = overlay.querySelector('#pwnPopupCloseX');

            titleEl.className = 'pwn-popup-title ' + type;
            iconEl.textContent = type === 'danger' ? '⚠️' : '❓';
            titleTextEl.textContent = title;
            bodyEl.textContent = message;

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'pwn-popup-btn cancel';
            cancelBtn.textContent = cancelText;

            const confirmBtn = document.createElement('button');
            confirmBtn.className = `pwn-popup-btn ${type === 'danger' ? 'danger' : 'primary'}`;
            confirmBtn.textContent = confirmText;

            function finish(result) {
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.remove();
                    if (result && opts.onConfirm) opts.onConfirm();
                    if (!result && opts.onCancel) opts.onCancel();
                    resolve(result);
                }, 200);
            }

            cancelBtn.onclick = () => finish(false);
            confirmBtn.onclick = () => finish(true);
            closeX.onclick = () => finish(false);

            overlay.onclick = (e) => {
                if (e.target === overlay) finish(false);
            };

            actionsEl.appendChild(cancelBtn);
            actionsEl.appendChild(confirmBtn);

            playBeep(type === 'danger' ? 520 : 740);

            setTimeout(() => {
                overlay.classList.add('active');
                confirmBtn.focus();
            }, 10);
        });
    };

    // ── 6. TACTICAL TOAST NOTIFICATIONS ──
    let toastContainer = null;
    window.tacticalToast = function (message, type = 'info', duration = 3500) {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'pwn-toast-container';
            document.body.appendChild(toastContainer);
        }

        const icon = type === 'success' ? '🟢' : (type === 'danger' ? '🔴' : (type === 'warning' || type === 'auth' ? '⚡' : 'ℹ️'));
        const toast = document.createElement('div');
        toast.className = `pwn-toast ${type}`;
        toast.innerHTML = `<span style="font-size: 1.15rem; flex-shrink: 0;">${icon}</span><span style="flex: 1;">${message}</span>`;
        toastContainer.appendChild(toast);

        playBeep(type === 'danger' ? 440 : (type === 'warning' ? 680 : 880));
        setTimeout(() => toast.classList.add('active'), 10);

        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 250);
        }, duration);
    };

    window.showAuthToast = function (msg) {
        return window.tacticalToast(msg, 'warning', 3500);
    };

    // ── 7. OVERRIDE NATIVE WINDOW.ALERT ──
    const _origAlert = window.alert;
    window.alert = function (msg) {
        return window.tacticalAlert({
            title: "SYSTEM ALERT",
            message: String(msg),
            type: "warning"
        });
    };

    window.showCustomAlert = function (title, msg, type) {
        return window.tacticalAlert({
            title: title || "SYSTEM ALERT",
            message: String(msg || title || ''),
            type: type || "warning"
        });
    };

    // showSystemAlert now dispatches a bottom-right toast notification
    window.showSystemAlert = function (msg) {
        if (typeof window.tacticalToast === 'function') {
            return window.tacticalToast(msg, 'warning', 3500);
        }
        return window.alert(msg);
    };

})();
