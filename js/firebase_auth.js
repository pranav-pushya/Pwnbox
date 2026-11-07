/**
 * PWNBOX CYBER COMMAND — FIREBASE AUTHENTICATION MODULE
 * Handles Google 1-Click Login, Email/Password Registration, and Auth State Persistence.
 */

// ── 1. FIREBASE CONFIGURATION ──
const defaultFirebaseConfig = {
    apiKey: atob("QUl6YVN5Q0NfZG5BYmtZZmR6ZGY0Z3M2d2VubnFHVEpHbkltN1JN"),
    authDomain: "pwnbo-x.firebaseapp.com",
    projectId: "pwnbo-x",
    storageBucket: "pwnbo-x.firebasestorage.app",
    messagingSenderId: "329054775111",
    appId: "1:329054775111:web:299368a06ebd6225bc8e62",
    measurementId: "G-TMQT0WGN2Z"
};

let firebaseConfig = defaultFirebaseConfig;

// Expose globally for cross-module compatibility (e.g. notes.js, firestore)
if (typeof window !== 'undefined') {
    window.defaultFirebaseConfig = defaultFirebaseConfig;
    window.firebaseConfig = firebaseConfig;
}

// ── 2. INITIALIZE FIREBASE ──
let auth = null;
let currentUser = null;
let fbInitRetries = 0;

function initFirebaseAuth() {
    if (typeof firebase === 'undefined') {
        // Retry dynamically on slow mobile/desktop connections
        if (fbInitRetries < 15) {
            fbInitRetries++;
            setTimeout(initFirebaseAuth, 400);
            return;
        }
        console.warn("Firebase SDK script not loaded yet.");
        return;
    }

    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();
        window.auth = auth;

        // Listen for authentication state changes across the whole session
        auth.onAuthStateChanged((user) => {
            currentUser = user;
            if (user) {
                const operativeName = user.displayName || (user.email ? user.email.split('@')[0].toUpperCase() : 'CADET_OPERATOR');
                localStorage.setItem('pwnbox_is_authenticated', 'true');
                localStorage.setItem('pwnbox_user_email', user.email || '');
                localStorage.setItem('pwnbox_user_name', operativeName);
                if (!localStorage.getItem('agentAlias') || localStorage.getItem('agentAlias') === 'UNKNOWN AGENT') {
                    localStorage.setItem('agentAlias', operativeName);
                }
                if (!localStorage.getItem('pwnbox_agent_alias')) {
                    localStorage.setItem('pwnbox_agent_alias', operativeName);
                }
                if (user.photoURL) {
                    localStorage.setItem('pwnbox_user_photo', user.photoURL);
                }
            } else {
                // If safe bypass is explicitly active, preserve session across all devices
                const isDevBypass = localStorage.getItem('pwnbox_dev_bypass') === 'true';
                if (isDevBypass && localStorage.getItem('pwnbox_is_authenticated') === 'true') {
                    const savedEmail = localStorage.getItem('pwnbox_user_email') || 'cadet.operative@pwnbox.local';
                    const savedName = localStorage.getItem('pwnbox_user_name') || savedEmail.split('@')[0].toUpperCase();
                    updateAuthUI({ displayName: savedName, email: savedEmail });
                    return;
                }

                localStorage.removeItem('pwnbox_is_authenticated');
                localStorage.removeItem('pwnbox_user_email');
                localStorage.removeItem('pwnbox_user_name');
                localStorage.removeItem('pwnbox_user_photo');
                localStorage.removeItem('pwnbox_dev_bypass');

                // Guests are freely permitted across all educational resources
            }
            updateAuthUI(user);
        });

        // Handle redirect result (from signInWithRedirect fallback on localhost or popup-blocked browsers)
        auth.getRedirectResult().then((result) => {
            if (result && result.user) {
                const name = result.user.displayName || "Operative";
                showAuthMessage(`Identity Authenticated: Welcome, ${name}! Redirecting...`, "success");
                setTimeout(() => {
                    closeAuthModal();
                    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
                    if (path.endsWith('/index.html') || path.endsWith('/') || path === '') {
                        window.location.href = 'pages/dashboard.html';
                    }
                }, 800);
            }
        }).catch((redirectErr) => {
            if (redirectErr && redirectErr.code !== 'auth/null-user') {
                console.warn("Redirect Auth Warning:", redirectErr);
                handleAuthError(redirectErr);
            }
        });

    } catch (err) {
        console.error("Firebase init error:", err);
        showAuthMessage("Firebase configuration error: " + err.message, "error");
    }
}

// Dynamic Firebase SDK loader for pages that don't include compat scripts directly
function ensureFirebaseSdk() {
    if (typeof firebase !== 'undefined') return Promise.resolve();
    return new Promise((resolve) => {
        const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
        const inSubdir = path.includes('/masterguide/') || path.includes('/imp_info/') || 
                         path.includes('/imp%20info/') || path.includes('/modules/') || path.includes('/games/');
        const base = inSubdir ? '../' : '';
        
        function loadScript(src) {
            return new Promise((res) => {
                const s = document.createElement('script');
                s.src = src;
                s.onload = res;
                s.onerror = () => {
                    const cdnSrc = src.replace(`${base}js/vendor/`, 'https://www.gstatic.com/firebasejs/10.8.0/');
                    const cdnScript = document.createElement('script');
                    cdnScript.src = cdnSrc;
                    cdnScript.onload = res;
                    cdnScript.onerror = res;
                    document.head.appendChild(cdnScript);
                };
                document.head.appendChild(s);
            });
        }

        loadScript(`${base}js/vendor/firebase-app-compat.js`).then(() => {
            return Promise.all([
                loadScript(`${base}js/vendor/firebase-auth-compat.js`),
                loadScript(`${base}js/vendor/firebase-firestore-compat.js`)
            ]);
        }).then(() => {
            initFirebaseAuth();
            resolve();
        }).catch(() => {
            resolve();
        });
    });
}

// ── 3. AUTHENTICATION ACTIONS ──

// Helper to ensure auth is ready before action, eliminating race condition on mobile
async function ensureAuthReady(timeoutMs = 4000) {
    if (auth) return auth;
    if (typeof firebase === 'undefined') {
        await ensureFirebaseSdk();
    } else {
        initFirebaseAuth();
    }
    if (auth) return auth;

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        await new Promise(r => setTimeout(r, 200));
        if (typeof firebase !== 'undefined' && !auth) {
            initFirebaseAuth();
        }
        if (auth) return auth;
    }
    return null;
}

// Google 1-Click Sign-In (with popup blocker & localhost protections)
async function loginWithGoogle() {
    if (!auth) {
        showAuthMessage("Connecting to Authentication Matrix...", "info");
        await ensureAuthReady();
    }
    if (!auth) {
        showAuthMessage("⚠️ Firebase Auth service is taking longer than expected. If you have an adblocker active (e.g. Brave Shields / uBlock), please pause it or use ⚡ Local Dev Bypass below!", "error");
        return;
    }

    const host = window.location.hostname || '';
    if (host === '127.0.0.1') {
        const port = window.location.port ? `:${window.location.port}` : '';
        const targetUrl = `http://localhost${port}${window.location.pathname}${window.location.search}`;
        showAuthMessage(
            `⚠️ Firebase Google OAuth blocks '127.0.0.1' by default.\n\n` +
            `👉 1-Click Fix: Click 'Switch from 127.0.0.1 to localhost' below, or use '1-CLICK LOCAL DEV BYPASS'!`,
            "error"
        );
        const switchBtn = document.getElementById('authSwitchToLocalhostBtn');
        if (switchBtn) {
            switchBtn.style.display = 'block';
            switchBtn.onclick = () => { window.location.href = targetUrl; };
        }
        return;
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        showAuthMessage("Connecting to Google Authentication Matrix...", "info");

        let result = null;
        try {
            result = await auth.signInWithPopup(provider);
        } catch (popupError) {
            console.warn("signInWithPopup encountered an issue:", popupError);
            if (
                popupError.code === 'auth/popup-blocked' ||
                popupError.code === 'auth/operation-not-supported-in-this-environment'
            ) {
                showAuthMessage("⚠️ Pop-up was blocked by browser. Switching to secure redirect mode...", "info");
                await auth.signInWithRedirect(provider);
                return;
            } else if (
                popupError.code === 'auth/popup-closed-by-user' ||
                popupError.code === 'auth/cancelled-popup-request'
            ) {
                showAuthMessage("ℹ️ Sign-in popup was closed. You can retry with Google or use email & passphrase.", "info");
                return;
            } else {
                throw popupError;
            }
        }

        if (result && result.user) {
            const name = result.user.displayName || "Operative";
            showAuthMessage(`Identity Authenticated: Welcome, ${name}! Redirecting...`, "success");
            
            setTimeout(() => {
                closeAuthModal();
                const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
                if (path.endsWith('/index.html') || path.endsWith('/') || path === '') {
                    window.location.href = 'pages/dashboard.html';
                }
            }, 1000);
        }
    } catch (error) {
        console.error("Google Auth Error:", error);
        handleAuthError(error);
    }
}

// Global Auth Error Handler (Enhanced with Actionable Bauhaus Fallbacks)
function handleAuthError(error, contextEmail = '') {
    if (!error) return;
    const host = window.location.hostname || '127.0.0.1';
    const port = window.location.port ? `:${window.location.port}` : '';
    const code = error.code || '';
    const rawMsg = error.message || String(error);

    let candidateEmail = contextEmail || 
                         document.getElementById('regEmailInput')?.value?.trim() || 
                         document.getElementById('authEmailInput')?.value?.trim() || 
                         '';
    if (!candidateEmail || !candidateEmail.includes('@')) {
        candidateEmail = 'cadet.operative@pwnbox.local';
    }
    const candidateAlias = candidateEmail.split('@')[0].toUpperCase();

    if (code === 'auth/unauthorized-domain') {
        if (host === '127.0.0.1') {
            const fallbackHtml = `
                <div style="font-weight:700; margin-bottom:6px;">⚠️ Domain '127.0.0.1' is not whitelisted by default in Firebase.</div>
                <div style="margin-bottom:8px; opacity:0.85;">Google Identity requires 'localhost' or an authorized domain.</div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <button type="button" onclick="window.location.href='http://localhost${port}${window.location.pathname}${window.location.search}'"
                        style="width:100%; padding:8px; background:#f59e0b; color:#000; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                        🔄 SWITCH ADDRESS TO 'localhost'
                    </button>
                    <button type="button" onclick="bypassLocalAuth('${candidateEmail}', '${candidateAlias}')"
                        style="width:100%; padding:8px; background:var(--bauhaus-yellow); color:#000; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                        ⚡ 1-CLICK INSTANT CLEARANCE (${candidateAlias})
                    </button>
                </div>
            `;
            showAuthMessage(fallbackHtml, "error", true);
        } else {
            const fallbackHtml = `
                <div style="font-weight:700; margin-bottom:6px;">⚠️ Domain '${host}' is not in Firebase Authorized Domains.</div>
                <div style="margin-bottom:8px; opacity:0.85;">For testing across Wi-Fi or local devices, activate Safe Mode clearance below:</div>
                <button type="button" onclick="bypassLocalAuth('${candidateEmail}', '${candidateAlias}')"
                    style="width:100%; padding:8px; background:var(--bauhaus-yellow); color:#000; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                    ⚡ 1-CLICK OPERATIVE CLEARANCE (${candidateAlias})
                </button>
            `;
            showAuthMessage(fallbackHtml, "error", true);
        }
    } else if (code === 'auth/popup-blocked') {
        const fallbackHtml = `
            <div style="font-weight:700; margin-bottom:6px;">⚠️ Browser Pop-up Blocker prevented Google sign-in.</div>
            <div style="margin-bottom:8px; opacity:0.85;">Allow popups for this site, or activate instant clearance directly:</div>
            <button type="button" onclick="bypassLocalAuth('${candidateEmail}', '${candidateAlias}')"
                style="width:100%; padding:8px; background:var(--bauhaus-yellow); color:#000; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                ⚡ 1-CLICK OPERATIVE CLEARANCE (${candidateAlias})
            </button>
        `;
        showAuthMessage(fallbackHtml, "error", true);
    } else if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
        showAuthMessage(
            `ℹ️ Sign-in popup closed. You can sign in using your email & passphrase, or retry Google sign-in.`,
            "info"
        );
    } else if (code === 'auth/invalid-login-credentials' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        const fallbackHtml = `
            <div style="font-weight:700; margin-bottom:6px;">❌ Operative credentials not recognized.</div>
            <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
                <button type="button" onclick="handleForgotPasswordInModal('${candidateEmail}')"
                    style="width:100%; padding:8px; background:var(--bauhaus-yellow); color:#000; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                    🔑 SEND PASSWORD RESET LINK
                </button>
                <button type="button" onclick="switchAuthTab('register', '${candidateEmail}')"
                    style="width:100%; padding:8px; background:var(--bauhaus-red); color:#fff; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                    📝 REGISTER AS NEW OPERATIVE
                </button>
            </div>
        `;
        showAuthMessage(fallbackHtml, "error", true);
    } else if (code === 'auth/email-already-in-use') {
        const fallbackHtml = `
            <div style="font-weight:700; margin-bottom:6px;">ℹ️ This email is already registered in Firebase.</div>
            <div style="margin-bottom:8px; opacity:0.85;">Switch to Sign In, or reset your passphrase if forgotten:</div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                <button type="button" onclick="switchAuthTab('login', '${candidateEmail}')"
                    style="width:100%; padding:8px; background:var(--bauhaus-blue); color:#fff; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                    ⚡ SWITCH TO SIGN IN TAB
                </button>
                <button type="button" onclick="handleForgotPasswordInModal('${candidateEmail}')"
                    style="width:100%; padding:8px; background:var(--bauhaus-yellow); color:#000; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                    🔑 SEND PASSWORD RESET LINK
                </button>
            </div>
        `;
        showAuthMessage(fallbackHtml, "info", true);
    } else if (code === 'auth/weak-password') {
        showAuthMessage(
            `⚠️ Security passphrase is too weak. Please use at least 6 characters.`,
            "error"
        );
    } else if (code === 'auth/invalid-email') {
        showAuthMessage(
            `⚠️ Please enter a valid operative email format (e.g. agent@example.com).`,
            "error"
        );
    } else if (code === 'auth/internal-error' || code === 'auth/network-request-failed') {
        const isLanIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(host) && host !== '127.0.0.1';
        let detail = '';
        if (isLanIp) {
            detail = `Google Cloud blocks external API keys on local Wi-Fi IPs (${host}).<br>To test across devices, use the live URL <b>https://pwnbo-x.web.app</b> or activate instant clearance:`;
        } else {
            detail = `Firebase Auth service communication error (${code}).<br>This commonly occurs if browser privacy shields / adblockers are active, or network restrictions are present.`;
        }

        const fallbackHtml = `
            <div style="font-weight:700; margin-bottom:6px;">⚠️ Authentication Service Interruption</div>
            <div style="margin-bottom:10px; font-size:0.75rem; line-height:1.4;">${detail}</div>
            <button type="button" onclick="bypassLocalAuth('${candidateEmail}', '${candidateAlias}')" 
                style="width:100%; padding:10px; background:var(--bauhaus-yellow); color:#000; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.8rem; cursor:pointer; text-align:center;">
                ⚡ ACTIVATE OPERATIVE PROFILE NOW (${candidateAlias})
            </button>
        `;
        showAuthMessage(fallbackHtml, "error", true);
    } else {
        const fallbackHtml = `
            <div style="font-weight:700; margin-bottom:6px;">⚠️ ${rawMsg}</div>
            <button type="button" onclick="bypassLocalAuth('${candidateEmail}', '${candidateAlias}')" 
                style="margin-top:6px; width:100%; padding:8px; background:var(--bauhaus-yellow); color:#000; border:2px solid #000; box-shadow:2px 2px 0 #000; font-family:'Space Mono',monospace; font-weight:800; font-size:0.75rem; cursor:pointer;">
                ⚡ 1-CLICK OPERATIVE CLEARANCE (${candidateAlias})
            </button>
        `;
        showAuthMessage(fallbackHtml, "error", true);
    }
}

// Email & Password Sign In
async function loginWithEmail(email, password) {
    if (!auth) {
        showAuthMessage("Connecting to Authentication Matrix...", "info");
        await ensureAuthReady();
    }
    if (!auth) {
        showAuthMessage("⚠️ Firebase Auth service is not responding. Use 1-Click Clearance or check connection.", "error");
        return;
    }
    const emailInput = document.getElementById('authEmailInput');
    const passInput = document.getElementById('authPasswordInput');
    [emailInput, passInput].forEach(inp => {
        if (inp) inp.style.borderColor = 'var(--border-color)';
    });

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
        showAuthMessage("⚠️ Please enter your operative email address.", "error");
        if (emailInput) {
            emailInput.style.borderColor = 'var(--bauhaus-red)';
            emailInput.focus();
        }
        return;
    }
    if (!password) {
        showAuthMessage("⚠️ Please enter your security passphrase.", "error");
        if (passInput) {
            passInput.style.borderColor = 'var(--bauhaus-red)';
            passInput.focus();
        }
        return;
    }
    try {
        showAuthMessage("Authenticating credentials...", "info");
        const result = await auth.signInWithEmailAndPassword(cleanEmail, password);
        const name = result.user.displayName || result.user.email.split('@')[0].toUpperCase();
        showAuthMessage(`Access Granted: Welcome Agent ${name}! Redirecting...`, "success");
        
        setTimeout(() => {
            closeAuthModal();
            const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
            if (path.endsWith('/index.html') || path.endsWith('/') || path === '') {
                window.location.href = 'pages/dashboard.html';
            }
        }, 800);
    } catch (error) {
        console.error("Email Login Error:", error);
        handleAuthError(error, cleanEmail);
    }
}

// Email & Password Registration
async function registerWithEmail(email, password, displayName) {
    if (!auth) {
        showAuthMessage("Connecting to Authentication Matrix...", "info");
        await ensureAuthReady();
    }
    if (!auth) {
        showAuthMessage("⚠️ Firebase Auth service is not responding. Use 1-Click Clearance or check connection.", "error");
        return;
    }
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
        showAuthMessage("Please provide operative email and security passphrase.", "error");
        return;
    }
    try {
        showAuthMessage("Creating new operative profile in Firebase...", "info");
        const result = await auth.createUserWithEmailAndPassword(cleanEmail, password);
        const alias = displayName || cleanEmail.split('@')[0].toUpperCase();
        try {
            await result.user.updateProfile({ displayName: alias });
        } catch (profileErr) {
            console.warn("Profile update non-fatal:", profileErr);
        }
        showAuthMessage(`Registration Complete. Welcome Cadet ${alias}! Redirecting...`, "success");
        
        setTimeout(() => {
            closeAuthModal();
            const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
            if (path.endsWith('/index.html') || path.endsWith('/') || path === '') {
                window.location.href = 'pages/dashboard.html';
            }
        }, 800);
    } catch (error) {
        console.error("Registration Error:", error);
        handleAuthError(error, cleanEmail);
    }
}

// Sign Out
async function logoutUser() {
    if (!auth) return;
    try {
        await auth.signOut();
        localStorage.removeItem('pwnbox_is_authenticated');
        localStorage.removeItem('pwnbox_user_email');
        localStorage.removeItem('pwnbox_user_name');
        localStorage.removeItem('pwnbox_user_photo');
        localStorage.removeItem('pwnbox_dev_bypass');
        showAuthMessage("Operative session terminated.", "info");

        // Always redirect back to home page after sign out
        const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
        const isPublic = path.endsWith('/index.html') || path.endsWith('/') || path === '';
        if (!isPublic) {
            const isSubfolder = path.includes('/modules/') || path.includes('/masterguide/');
            window.location.replace((isSubfolder ? '../' : '') + 'index.html');
        }
    } catch (error) {
        console.error("Sign Out Error:", error);
    }
}

// ── 4. UI STATE SYNC (DASHBOARD & HOME PORTAL & ID CARDS) ──
function updateAuthUI(user) {
    const authBtn = document.getElementById('authNavBtn');
    const idCardAuthBtn = document.getElementById('idCardAuthBtn');
    const headerName = document.getElementById('headerName');
    const headerAvatar = document.getElementById('headerAvatar');
    const profileNameDisplay = document.getElementById('profileNameDisplay');
    const dropdownName = document.getElementById('dropdownName');
    const largeAvatar = document.getElementById('largeAvatar');
    const userRank = document.getElementById('userRank');
    const dropdownRank = document.getElementById('dropdownRank');
    const authStatusBadge = document.getElementById('authStatusBadge');
    const editAliasInput = document.getElementById('editAliasInput');

    // Home Page Elements
    const homeAuthBtn = document.getElementById('homeAuthBtn');
    const homeDashBtn = document.getElementById('homeDashBtn');
    const genAgentAlias = document.getElementById('genAgentAlias');
    const previewAgentAlias = document.getElementById('previewAgentAlias');
    const previewAgentAvatar = document.getElementById('previewAgentAvatar');
    const previewBadgeRank = document.querySelector('.preview-badge-card .badge-rank-val');

    if (user) {
        // Authenticated Operative State
        const operativeName = user.displayName || (user.email ? user.email.split('@')[0].toUpperCase() : 'CADET_OPERATOR');
        
        // 1. Dashboard Header & Badges
        if (headerName) headerName.textContent = operativeName;
        if (profileNameDisplay) profileNameDisplay.textContent = operativeName;
        if (dropdownName) dropdownName.textContent = operativeName;
        if (userRank) userRank.textContent = "VERIFIED OPERATIVE";
        if (dropdownRank) dropdownRank.textContent = "VERIFIED OPERATIVE";
        if (editAliasInput && (!editAliasInput.value || editAliasInput.value === 'Pranav' || editAliasInput.value === 'UNKNOWN AGENT')) {
            editAliasInput.value = operativeName;
        }

        // Avatars
        if (user.photoURL) {
            const avatarHtml = `<img src="${user.photoURL}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="Avatar">`;
            const squareAvatarHtml = `<img src="${user.photoURL}" style="width:100%;height:100%;border-radius:4px;object-fit:cover;" alt="Avatar">`;
            if (headerAvatar) headerAvatar.innerHTML = avatarHtml;
            if (largeAvatar) largeAvatar.innerHTML = squareAvatarHtml;
            if (previewAgentAvatar) previewAgentAvatar.innerHTML = squareAvatarHtml;
        }

        // Top Nav button in Dashboard
        if (authBtn) {
            authBtn.innerHTML = `🟢 ${operativeName.slice(0, 12)}`;
            authBtn.title = "Signed in as " + user.email + " (Click to manage)";
        }

        // Dropdown ID card back button
        if (idCardAuthBtn) {
            idCardAuthBtn.innerHTML = "DISCONNECT // SIGN OUT";
            idCardAuthBtn.onclick = logoutUser;
            idCardAuthBtn.style.background = "var(--bauhaus-red)";
            idCardAuthBtn.style.color = "#ffffff";
        }

        if (authStatusBadge) {
            authStatusBadge.innerHTML = `<span style="color:#10b981;">● FIREBASE VERIFIED: ${user.email}</span>`;
        }

        // 2. Home Page Navigation & Dossier Workshop Badge
        if (homeAuthBtn) {
            homeAuthBtn.innerHTML = `🟢 ${operativeName.slice(0, 12)}`;
            homeAuthBtn.onclick = () => {
                if (typeof window.tacticalConfirm === 'function') {
                    window.tacticalConfirm({
                        title: "OPERATIVE SESSION",
                        message: `Currently authenticated as Agent ${operativeName} (${user.email}).\n\nWould you like to terminate your active session and sign out?`,
                        confirmText: "DISCONNECT // SIGN OUT",
                        cancelText: "STAY SIGNED IN",
                        type: "danger",
                        onConfirm: () => logoutUser()
                    });
                } else {
                    logoutUser();
                }
            };
        }
        if (homeDashBtn) {
            homeDashBtn.style.display = 'inline-flex';
            homeDashBtn.onclick = null;
        }
        if (genAgentAlias) {
            genAgentAlias.value = operativeName;
        }
        if (previewAgentAlias) {
            previewAgentAlias.textContent = operativeName.toUpperCase();
        }
        if (previewBadgeRank) {
            previewBadgeRank.textContent = "CLEARANCE: VERIFIED OPERATIVE";
        }

    } else {
        // Guest / Unauthenticated State
        const savedName = localStorage.getItem('agentAlias') || "CADET_OPERATOR";
        if (headerName) headerName.textContent = savedName;
        if (profileNameDisplay) profileNameDisplay.textContent = savedName;
        if (dropdownName) dropdownName.textContent = savedName;
        if (userRank) userRank.textContent = "Apprentice";
        if (dropdownRank) dropdownRank.textContent = "Apprentice";

        const savedAvatar = localStorage.getItem('agentAvatar') || "?";
        if (headerAvatar) headerAvatar.textContent = savedAvatar;
        if (largeAvatar) largeAvatar.textContent = savedAvatar;

        if (authBtn) {
            authBtn.innerHTML = `🔐 LOGIN`;
            authBtn.title = "Authenticate via Firebase";
            authBtn.onclick = openAuthModal;
        }

        if (idCardAuthBtn) {
            idCardAuthBtn.innerHTML = "🔐 FIREBASE AUTH";
            idCardAuthBtn.onclick = openAuthModal;
            idCardAuthBtn.style.background = "var(--bauhaus-yellow)";
            idCardAuthBtn.style.color = "#000000";
        }

        if (authStatusBadge) {
            authStatusBadge.innerHTML = `<span style="color:#eab308;">○ GUEST MODE (LOGIN REQUIRED)</span>`;
        }

        // Home Page Reset
        if (homeAuthBtn) {
            homeAuthBtn.innerHTML = `🔐 OPERATIVE LOGIN`;
            homeAuthBtn.onclick = openAuthModal;
        }
        if (homeDashBtn) {
            homeDashBtn.style.display = 'inline-flex';
            homeDashBtn.onclick = null; // Rule 2: Guests can freely access dashboard
        }
        if (previewBadgeRank) {
            previewBadgeRank.textContent = "CLEARANCE: LEVEL 1 APPRENTICE";
        }
    }
}

// ── 5. LOCAL DEV ENVIRONMENT & BYPASS HELPERS ──
function checkLocalhostEnvironment() {
    const banner = document.getElementById('localDevBanner');
    const switchBtn = document.getElementById('authSwitchToLocalhostBtn');
    const host = window.location.hostname || '';
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || window.location.protocol === 'file:';

    if (banner) {
        banner.style.display = isLocal ? 'block' : 'none';
    }

    if (switchBtn) {
        if (host === '127.0.0.1') {
            const port = window.location.port ? `:${window.location.port}` : '';
            const targetUrl = `http://localhost${port}${window.location.pathname}${window.location.search}`;
            switchBtn.style.display = 'block';
            switchBtn.onclick = () => { window.location.href = targetUrl; };
        } else {
            switchBtn.style.display = 'none';
        }
    }
}

// 1-Click Operative Clearance Bypass (Instant Access for testing or network fallback)
function bypassLocalAuth(customEmail = null, customAlias = null) {
    const inputEmail = customEmail || 
                       document.getElementById('regEmailInput')?.value?.trim() || 
                       document.getElementById('authEmailInput')?.value?.trim() || 
                       'cadet.operative@pwnbox.local';
    const emailToUse = (inputEmail && inputEmail.includes('@')) ? inputEmail : (inputEmail ? `${inputEmail}@pwnbox.local` : 'cadet.operative@pwnbox.local');
    const alias = customAlias || (emailToUse.split('@')[0].toUpperCase());

    localStorage.setItem('pwnbox_is_authenticated', 'true');
    localStorage.setItem('pwnbox_user_email', emailToUse);
    localStorage.setItem('pwnbox_user_name', alias);
    localStorage.setItem('agentAlias', alias);
    localStorage.setItem('pwnbox_agent_alias', alias);
    localStorage.setItem('pwnbox_dev_bypass', 'true');

    updateAuthUI({ displayName: alias, email: emailToUse });

    showAuthMessage(`⚡ Operative Clearance Granted! Welcome, Agent ${alias}! Redirecting...`, "success");
    setTimeout(() => {
        closeAuthModal();
        const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
        if (path.endsWith('/index.html') || path.endsWith('/') || path === '') {
            window.location.href = 'pages/dashboard.html';
        } else {
            window.location.reload();
        }
    }, 600);
}

// ── 6. MODAL INTERACTION HELPERS ──
function setupAuthFormEnterKeys() {
    const bindEnter = (id, action) => {
        const el = document.getElementById(id);
        if (el && !el.dataset.enterBound) {
            el.dataset.enterBound = 'true';
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    action();
                }
            });
        }
    };
    bindEnter('authEmailInput', () => {
        const pass = document.getElementById('authPasswordInput');
        if (pass && !pass.value) {
            pass.focus();
        } else {
            const email = document.getElementById('authEmailInput')?.value;
            loginWithEmail(email, pass?.value);
        }
    });
    bindEnter('authPasswordInput', () => {
        const email = document.getElementById('authEmailInput')?.value;
        const pass = document.getElementById('authPasswordInput')?.value;
        loginWithEmail(email, pass);
    });
    bindEnter('regEmailInput', () => {
        const pass = document.getElementById('regPasswordInput');
        if (pass) pass.focus();
    });
    bindEnter('regPasswordInput', () => {
        const confirm = document.getElementById('regConfirmPasswordInput');
        if (confirm) confirm.focus();
    });
    bindEnter('regConfirmPasswordInput', () => {
        handleRegisterSubmit();
    });
}

// Dynamic DOM Modal Generator ensures Auth Modal is accessible on EVERY page
function ensureAuthModalInDOM() {
    let modal = document.getElementById('firebaseAuthModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'firebaseAuthModal';
        modal.className = 'reset-modal-overlay';
        modal.style.display = 'none';
        modal.style.background = 'rgba(0, 0, 0, 0.75)';
        modal.innerHTML = `
        <div class="reset-modal-box" style="max-width: 440px; max-height: 92vh; overflow-y: auto; text-align: left; padding: 24px; background: var(--bg-panel, #ffffff); border: 3px solid var(--border-color); box-shadow: 10px 10px 0 var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 10px; margin-bottom: 16px;">
                <h3 style="margin: 0; font-family: 'Space Mono', monospace; font-size: 1.05rem;" id="authModalTitle">🔐 OPERATIVE CLEARANCE</h3>
                <button type="button" onclick="closeAuthModal()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-main); font-weight: bold;">✕</button>
            </div>

            <!-- Profile Panel for Authenticated Users -->
            <div id="authProfilePanel" style="display: none;">
                <div style="background: var(--bg-base); border: 2px solid var(--border-color); padding: 14px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                        <div id="authProfileLargeAvatar" style="width: 44px; height: 44px; border-radius: 4px; background: var(--bauhaus-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800;">👤</div>
                        <div style="flex: 1; min-width: 0;">
                            <div id="authProfileName" style="font-family: 'Space Mono', monospace; font-size: 0.95rem; font-weight: 800; color: var(--text-main); word-break: break-all;">AGENT OPERATIVE</div>
                            <div id="authProfileEmail" style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--text-muted); word-break: break-all;">operative@pwnbox.local</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #10b981; margin-top: 6px;">
                        <span>🟢</span>
                        <span>CLEARANCE: VERIFIED OPERATIVE</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #38bdf8; margin-top: 4px;">
                        <span>☁️</span>
                        <span>FIRESTORE CLOUD SYNC ACTIVE</span>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button type="button" onclick="logoutUser()" style="width: 100%; padding: 12px; background: var(--bauhaus-red); color: #fff; font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 800; border: 2px solid var(--border-color); box-shadow: 3px 3px 0 var(--border-color); cursor: pointer; text-transform: uppercase;">
                        🚪 TERMINATE SESSION // SIGN OUT
                    </button>
                    <button type="button" onclick="switchAuthToRegisterNew()" style="width: 100%; padding: 10px; background: var(--bauhaus-yellow); color: #000; font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 800; border: 2px solid var(--border-color); box-shadow: 2px 2px 0 var(--border-color); cursor: pointer; text-transform: uppercase;">
                        🔄 REGISTER / SWITCH ANOTHER ACCOUNT
                    </button>
                </div>
            </div>

            <!-- Tab Switcher: Sign In vs Register (for Guests/Sign in) -->
            <div id="authTabsContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                <button type="button" id="authTabLogin" class="auth-tab-btn active" onclick="switchAuthTab('login')" style="padding: 10px; font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 800; border: 2px solid var(--border-color); cursor: pointer; background: var(--bauhaus-blue); color: #fff; box-shadow: 2px 2px 0 var(--border-color);">
                    ⚡ SIGN IN
                </button>
                <button type="button" id="authTabRegister" class="auth-tab-btn" onclick="switchAuthTab('register')" style="padding: 10px; font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 800; border: 2px solid var(--border-color); cursor: pointer; background: var(--bg-panel); color: var(--text-muted); box-shadow: none;">
                    📝 REGISTER
                </button>
            </div>

            <!-- TAB 1: SIGN IN PANEL -->
            <div id="authLoginPanel">
                <!-- Google 1-Click Button -->
                <button type="button" onclick="loginWithGoogle()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: var(--bg-panel); color: var(--text-main); border: 2px solid var(--border-color); box-shadow: 3px 3px 0 var(--border-color); font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 800; cursor: pointer; margin-bottom: 16px; transition: transform 0.15s;">
                    <span style="font-size: 1.1rem;">🌐</span>
                    <span>SIGN IN WITH GOOGLE</span>
                </button>

                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--text-muted);">
                    <div style="flex: 1; height: 1px; background: var(--border-color); opacity: 0.3;"></div>
                    <span>// OR EMAIL CREDENTIALS //</span>
                    <div style="flex: 1; height: 1px; background: var(--border-color); opacity: 0.3;"></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; margin-bottom: 4px;">OPERATIVE EMAIL</label>
                        <input type="email" id="authEmailInput" class="bauhaus-input" placeholder="Enter your email address..." style="width: 100%; padding: 8px 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; background: var(--bg-base); border: 2px solid var(--border-color); color: var(--text-main);">
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <label style="font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700;">SECURITY PASSPHRASE</label>
                            <a href="javascript:void(0)" onclick="handleForgotPasswordInModal()" style="font-family: 'Space Mono', monospace; font-size: 0.7rem; color: var(--bauhaus-blue); text-decoration: underline;">Forgot Passphrase?</a>
                        </div>
                        <div style="position: relative;">
                            <input type="password" id="authPasswordInput" class="bauhaus-input" placeholder="••••••••••••" style="width: 100%; padding: 8px 40px 8px 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; background: var(--bg-base); border: 2px solid var(--border-color); color: var(--text-main);">
                            <button type="button" onclick="togglePasswordVisibility('authPasswordInput', this)" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.1rem; cursor: pointer; padding: 4px; color: var(--text-main); user-select: none;" title="Show/Hide Passphrase">👁️</button>
                        </div>
                    </div>
                </div>

                <button type="button" onclick="loginWithEmail(document.getElementById('authEmailInput').value, document.getElementById('authPasswordInput').value)" class="bauhaus-btn" style="width: 100%; padding: 12px; background: var(--bauhaus-blue); color: #fff; font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 800; border: 2px solid var(--border-color); box-shadow: 3px 3px 0 var(--border-color); cursor: pointer; text-transform: uppercase;">
                    ⚡ SIGN IN TO PWNBOX
                </button>

                <div style="text-align: center; margin-top: 14px; font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--text-muted);">
                    New operative? <a href="javascript:void(0)" onclick="switchAuthTab('register')" style="color: var(--bauhaus-red); font-weight: 800; text-decoration: underline;">Create account here</a>
                </div>
            </div>

            <!-- TAB 2: REGISTER PANEL -->
            <div id="authRegisterPanel" style="display: none;">
                <!-- Google 1-Click Sign Up Button -->
                <button type="button" onclick="loginWithGoogle()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: var(--bg-panel); color: var(--text-main); border: 2px solid var(--border-color); box-shadow: 3px 3px 0 var(--border-color); font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 800; cursor: pointer; margin-bottom: 16px; transition: transform 0.15s;">
                    <span style="font-size: 1.1rem;">🌐</span>
                    <span>SIGN UP WITH GOOGLE</span>
                </button>

                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--text-muted);">
                    <div style="flex: 1; height: 1px; background: var(--border-color); opacity: 0.3;"></div>
                    <span>// OR REGISTER WITH EMAIL //</span>
                    <div style="flex: 1; height: 1px; background: var(--border-color); opacity: 0.3;"></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; margin-bottom: 4px;">OPERATIVE EMAIL</label>
                        <input type="email" id="regEmailInput" class="bauhaus-input" placeholder="Enter your email address..." style="width: 100%; padding: 8px 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; background: var(--bg-base); border: 2px solid var(--border-color); color: var(--text-main);">
                    </div>
                    <div>
                        <label style="display: block; font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; margin-bottom: 4px;">SECURITY PASSPHRASE (Min 6 chars)</label>
                        <div style="position: relative;">
                            <input type="password" id="regPasswordInput" class="bauhaus-input" placeholder="••••••••••••" style="width: 100%; padding: 8px 40px 8px 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; background: var(--bg-base); border: 2px solid var(--border-color); color: var(--text-main);">
                            <button type="button" onclick="togglePasswordVisibility('regPasswordInput', this)" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.1rem; cursor: pointer; padding: 4px; color: var(--text-main); user-select: none;" title="Show/Hide Passphrase">👁️</button>
                        </div>
                    </div>
                    <div>
                        <label style="display: block; font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; margin-bottom: 4px;">CONFIRM SECURITY PASSPHRASE</label>
                        <div style="position: relative;">
                            <input type="password" id="regConfirmPasswordInput" class="bauhaus-input" placeholder="••••••••••••" style="width: 100%; padding: 8px 40px 8px 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; background: var(--bg-base); border: 2px solid var(--border-color); color: var(--text-main);">
                            <button type="button" onclick="togglePasswordVisibility('regConfirmPasswordInput', this)" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.1rem; cursor: pointer; padding: 4px; color: var(--text-main); user-select: none;" title="Show/Hide Passphrase">👁️</button>
                        </div>
                    </div>
                </div>

                <button type="button" onclick="handleRegisterSubmit()" class="bauhaus-btn" style="width: 100%; padding: 12px; background: var(--bauhaus-red); color: #fff; font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 800; border: 2px solid var(--border-color); box-shadow: 3px 3px 0 var(--border-color); cursor: pointer; text-transform: uppercase;">
                    📝 CREATE OPERATIVE ACCOUNT
                </button>

                <div style="text-align: center; margin-top: 14px; font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--text-muted);">
                    Already have an account? <a href="javascript:void(0)" onclick="switchAuthTab('login')" style="color: var(--bauhaus-blue); font-weight: 800; text-decoration: underline;">Sign In here</a>
                </div>
            </div>

            <!-- Status Console Output -->
            <div id="authStatusMessage" style="display: none; padding: 10px 12px; border: 2px solid var(--border-color); font-family: 'Space Mono', monospace; font-size: 0.74rem; margin-top: 14px; word-break: break-word;"></div>

            <!-- Localhost Dev Helper Banner -->
            <div id="localDevBanner" style="display: none; margin-top: 14px; padding: 10px; background: rgba(147, 51, 234, 0.08); border: 1px dashed #9333ea; font-family: 'Space Mono', monospace; text-align: center;">
                <div style="font-size: 0.68rem; color: #a855f7; font-weight: 700; margin-bottom: 6px;">
                    🛠️ LOCALHOST DEV MODE
                </div>
                <button type="button" onclick="bypassLocalAuth()" style="width: 100%; padding: 7px 10px; background: #9333ea; color: #fff; border: 1px solid #7e22ce; font-family: 'Space Mono', monospace; font-size: 0.74rem; font-weight: 700; cursor: pointer;">
                    ⚡ 1-CLICK DEV BYPASS (TESTING)
                </button>
                <button id="authSwitchToLocalhostBtn" style="display: none; width: 100%; margin-top: 6px; padding: 6px; background: #f59e0b; color: #000; border: 1px solid #d97706; font-family: 'Space Mono', monospace; font-size: 0.7rem; font-weight: 700; cursor: pointer;">
                    🔄 Switch from 127.0.0.1 to localhost
                </button>
            </div>
        </div>
        `;
        document.body.appendChild(modal);

        // ── ATTACH SMART LIVE FORM VALIDATION LISTENERS ──
        const regEmail = modal.querySelector('#regEmailInput');
        const regPass = modal.querySelector('#regPasswordInput');
        const regConfirm = modal.querySelector('#regConfirmPasswordInput');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (regEmail && !regEmail.dataset.hasSmartValidation) {
            regEmail.dataset.hasSmartValidation = 'true';
            regEmail.addEventListener('input', () => {
                const val = regEmail.value.trim();
                if (!val) {
                    regEmail.style.borderColor = 'var(--border-color)';
                } else if (emailRegex.test(val)) {
                    regEmail.style.borderColor = 'var(--cyber-green, #10b981)';
                } else {
                    regEmail.style.borderColor = 'var(--bauhaus-yellow, #f2a900)';
                }
            });
        }

        if (regPass && !regPass.dataset.hasSmartValidation) {
            regPass.dataset.hasSmartValidation = 'true';
            regPass.addEventListener('input', () => {
                const val = regPass.value;
                if (!val) {
                    regPass.style.borderColor = 'var(--border-color)';
                } else if (val.length >= 6) {
                    regPass.style.borderColor = 'var(--cyber-green, #10b981)';
                } else {
                    regPass.style.borderColor = 'var(--bauhaus-yellow, #f2a900)';
                }
                if (regConfirm && regConfirm.value) {
                    regConfirm.style.borderColor = (val === regConfirm.value) ? 'var(--cyber-green, #10b981)' : 'var(--bauhaus-red, #d9291c)';
                }
            });
        }

        if (regConfirm && !regConfirm.dataset.hasSmartValidation) {
            regConfirm.dataset.hasSmartValidation = 'true';
            regConfirm.addEventListener('input', () => {
                const passVal = regPass ? regPass.value : '';
                const confirmVal = regConfirm.value;
                if (!confirmVal) {
                    regConfirm.style.borderColor = 'var(--border-color)';
                } else if (confirmVal === passVal && passVal.length >= 6) {
                    regConfirm.style.borderColor = 'var(--cyber-green, #10b981)';
                } else {
                    regConfirm.style.borderColor = 'var(--bauhaus-red, #d9291c)';
                }
            });
        }
    }
    return modal;
}

function openAuthModal(defaultTab = 'login') {
    const modal = ensureAuthModalInDOM();
    if (modal) {
        modal.style.display = 'flex';
        void modal.offsetWidth; // Force layout recalculation
        modal.classList.add('active');
        checkLocalhostEnvironment();

        const isAuth = localStorage.getItem('pwnbox_is_authenticated') === 'true';
        const profilePanel = document.getElementById('authProfilePanel');
        const tabsContainer = document.getElementById('authTabsContainer');
        const loginPanel = document.getElementById('authLoginPanel');
        const regPanel = document.getElementById('authRegisterPanel');
        const modalTitle = document.getElementById('authModalTitle');

        if (isAuth && defaultTab !== 'login' && defaultTab !== 'register') {
            // User is signed in: show active profile & sign-out controls
            if (modalTitle) modalTitle.textContent = "👤 OPERATIVE PROFILE";
            if (tabsContainer) tabsContainer.style.display = 'none';
            if (loginPanel) loginPanel.style.display = 'none';
            if (regPanel) regPanel.style.display = 'none';
            if (profilePanel) {
                profilePanel.style.display = 'block';
                const nameEl = document.getElementById('authProfileName');
                const emailEl = document.getElementById('authProfileEmail');
                const avatarEl = document.getElementById('authProfileLargeAvatar');
                const savedName = localStorage.getItem('pwnbox_user_name') || localStorage.getItem('agentAlias') || 'OPERATIVE';
                const savedEmail = localStorage.getItem('pwnbox_user_email') || 'cadet.operative@pwnbox.local';
                const savedPhoto = localStorage.getItem('pwnbox_user_photo');
                
                if (nameEl) nameEl.textContent = `AGENT ${savedName.toUpperCase()}`;
                if (emailEl) emailEl.textContent = savedEmail;
                if (avatarEl) {
                    if (savedPhoto) {
                        avatarEl.innerHTML = `<img src="${savedPhoto}" style="width:100%;height:100%;border-radius:4px;object-fit:cover;">`;
                    } else {
                        avatarEl.textContent = savedName.charAt(0).toUpperCase() || '👤';
                    }
                }
            }
        } else {
            // Guest or explicit sign-in/register requested
            if (modalTitle) modalTitle.textContent = "🔐 OPERATIVE CLEARANCE";
            if (profilePanel) profilePanel.style.display = 'none';
            if (tabsContainer) tabsContainer.style.display = 'grid';
            switchAuthTab(defaultTab || 'login');
        }
        setupAuthFormEnterKeys();
    }
}

async function switchAuthToRegisterNew() {
    await logoutUser();
    openAuthModal('register');
}

async function handleForgotPasswordInModal(customEmail = '') {
    let email = customEmail || document.getElementById('authEmailInput')?.value?.trim();
    if (!email || !email.includes('@')) {
        showAuthMessage("⚠️ Please enter your operative email in the field above to receive a password reset link.", "error");
        document.getElementById('authEmailInput')?.focus();
        return;
    }
    try {
        if (!auth) await ensureAuthReady();
        if (auth) {
            showAuthMessage("Transmitting password reset link...", "info");
            await auth.sendPasswordResetEmail(email);
            showAuthMessage(`✅ Password reset link transmitted to ${email}.\nCheck your inbox and spam folders.`, "success");
        }
    } catch (err) {
        console.error("Password reset error:", err);
        showAuthMessage("❌ Failed to send reset link: " + (err.message || String(err)), "error");
    }
}

function closeAuthModal() {
    const modal = document.getElementById('firebaseAuthModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 200);
    }
}

function togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (btnEl) btnEl.innerHTML = '🙈';
    } else {
        input.type = 'password';
        if (btnEl) btnEl.innerHTML = '👁️';
    }
}

function switchAuthTab(tab, prefillEmail = '') {
    const loginTab = document.getElementById('authTabLogin');
    const regTab = document.getElementById('authTabRegister');
    const loginPanel = document.getElementById('authLoginPanel');
    const regPanel = document.getElementById('authRegisterPanel');
    const statusMsg = document.getElementById('authStatusMessage');
    if (statusMsg) statusMsg.style.display = 'none';

    if (tab === 'register') {
        if (loginTab) {
            loginTab.style.background = 'var(--bg-panel)';
            loginTab.style.color = 'var(--text-muted)';
            loginTab.style.boxShadow = 'none';
        }
        if (regTab) {
            regTab.style.background = 'var(--bauhaus-red)';
            regTab.style.color = '#ffffff';
            regTab.style.boxShadow = '2px 2px 0 var(--border-color)';
        }
        if (loginPanel) loginPanel.style.display = 'none';
        if (regPanel) regPanel.style.display = 'block';
        if (prefillEmail) {
            const regEmail = document.getElementById('regEmailInput');
            if (regEmail) regEmail.value = prefillEmail;
        }
    } else {
        if (regTab) {
            regTab.style.background = 'var(--bg-panel)';
            regTab.style.color = 'var(--text-muted)';
            regTab.style.boxShadow = 'none';
        }
        if (loginTab) {
            loginTab.style.background = 'var(--bauhaus-blue)';
            loginTab.style.color = '#ffffff';
            loginTab.style.boxShadow = '2px 2px 0 var(--border-color)';
        }
        if (regPanel) regPanel.style.display = 'none';
        if (loginPanel) loginPanel.style.display = 'block';
        if (prefillEmail) {
            const authEmail = document.getElementById('authEmailInput');
            if (authEmail) authEmail.value = prefillEmail;
        }
    }
}

async function handleRegisterSubmit() {
    const emailInput = document.getElementById('regEmailInput');
    const passInput = document.getElementById('regPasswordInput');
    const confirmInput = document.getElementById('regConfirmPasswordInput');

    const email = emailInput ? emailInput.value.trim() : '';
    const pass = passInput ? passInput.value : '';
    const confirmPass = confirmInput ? confirmInput.value : '';

    // Reset error borders
    [emailInput, passInput, confirmInput].forEach(inp => {
        if (inp) inp.style.borderColor = 'var(--border-color)';
    });

    if (!email) {
        showAuthMessage("⚠️ Please provide an operative email address.", "error");
        if (emailInput) {
            emailInput.style.borderColor = 'var(--bauhaus-red)';
            emailInput.focus();
        }
        return;
    }
    if (!pass) {
        showAuthMessage("⚠️ Please enter a security passphrase.", "error");
        if (passInput) {
            passInput.style.borderColor = 'var(--bauhaus-red)';
            passInput.focus();
        }
        return;
    }
    if (pass.length < 6) {
        showAuthMessage("⚠️ Security passphrase must be at least 6 characters long.", "error");
        if (passInput) {
            passInput.style.borderColor = 'var(--bauhaus-red)';
            passInput.focus();
        }
        return;
    }
    if (pass !== confirmPass) {
        showAuthMessage("❌ Security passphrases do not match! Please verify your confirmation passphrase.", "error");
        if (confirmInput) {
            confirmInput.style.borderColor = 'var(--bauhaus-red)';
            confirmInput.focus();
            confirmInput.select();
        }
        return;
    }

    const defaultAlias = email.split('@')[0].toUpperCase();
    await registerWithEmail(email, pass, defaultAlias);
}

function showAuthMessage(msg, type = 'info', isHtml = false) {
    ensureAuthModalInDOM();
    const msgBox = document.getElementById('authStatusMessage');
    if (!msgBox) return;

    // Ensure modal is visible if message is displayed
    const modal = document.getElementById('firebaseAuthModal');
    if (modal && (modal.style.display === 'none' || !modal.classList.contains('active'))) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }

    msgBox.style.display = 'block';
    msgBox.style.whiteSpace = isHtml ? 'normal' : 'pre-wrap';
    msgBox.style.lineHeight = '1.4';
    if (isHtml) {
        msgBox.innerHTML = msg;
    } else {
        msgBox.textContent = msg;
    }
    if (type === 'error') {
        msgBox.style.color = '#ef4444';
        msgBox.style.borderColor = '#ef4444';
        msgBox.style.background = 'rgba(239, 68, 68, 0.1)';
    } else if (type === 'success') {
        msgBox.style.color = '#10b981';
        msgBox.style.borderColor = '#10b981';
        msgBox.style.background = 'rgba(16, 185, 129, 0.1)';
    } else {
        msgBox.style.color = '#38bdf8';
        msgBox.style.borderColor = '#38bdf8';
        msgBox.style.background = 'rgba(56, 189, 248, 0.1)';
    }
    try {
        msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (_) {}
}

// Flip ID Card helper (works on touchscreens and clicks)
function flipIdCard(e) {
    if (e) e.stopPropagation();
    const inner = document.querySelector('.id-card-inner');
    if (inner) inner.classList.toggle('flipped');
}

// Check for auth_required query parameter on landing page
function checkAuthQueryParams() {
    if (window.location.search.includes('auth_required=1')) {
        setTimeout(() => {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("You cannot access restricted resources without signing in.", "warning");
            } else if (typeof window.showSystemAlert === 'function') {
                window.showSystemAlert("You cannot access restricted resources without signing in.");
            }
        }, 200);
    }
}

// Backdrop click handler to dismiss modal
document.addEventListener('click', (e) => {
    const modal = document.getElementById('firebaseAuthModal');
    if (modal && e.target === modal) {
        closeAuthModal();
    }
});

// Auto-initialize when DOM and Firebase SDK are ready
document.addEventListener("DOMContentLoaded", () => {
    checkAuthQueryParams();
    setupAuthFormEnterKeys();
    if (typeof firebase !== 'undefined') {
        initFirebaseAuth();
    } else {
        setTimeout(initFirebaseAuth, 600);
    }
});

// Explicitly bind to window for inline HTML onclick handlers
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.loginWithGoogle = loginWithGoogle;
window.loginWithEmail = loginWithEmail;
window.registerWithEmail = registerWithEmail;
window.logoutUser = logoutUser;
window.bypassLocalAuth = bypassLocalAuth;
window.checkLocalhostEnvironment = checkLocalhostEnvironment;
window.flipIdCard = flipIdCard;
window.togglePasswordVisibility = togglePasswordVisibility;
window.switchAuthTab = switchAuthTab;
window.handleRegisterSubmit = handleRegisterSubmit;
window.handleAuthError = handleAuthError;
window.showAuthMessage = showAuthMessage;
window.ensureAuthModalInDOM = ensureAuthModalInDOM;
window.handleForgotPasswordInModal = handleForgotPasswordInModal;
window.switchAuthToRegisterNew = switchAuthToRegisterNew;
