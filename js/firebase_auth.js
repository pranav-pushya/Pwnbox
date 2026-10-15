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

// ── 2. INITIALIZE FIREBASE ──
let auth = null;
let currentUser = null;

function initFirebaseAuth() {
    if (typeof firebase === 'undefined') {
        console.warn("Firebase SDK script not loaded yet.");
        return;
    }

    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();

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
                localStorage.removeItem('pwnbox_is_authenticated');
                localStorage.removeItem('pwnbox_user_email');
                localStorage.removeItem('pwnbox_user_name');
                localStorage.removeItem('pwnbox_user_photo');

                // If on a protected page, redirect immediately to index
                const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
                const isPublic = path.endsWith('/index.html') || path.endsWith('/') || path.endsWith('/404.html') || path === '';
                if (!isPublic) {
                    const isSubfolder = path.includes('/modules/') || path.includes('/masterguide/');
                    window.location.replace((isSubfolder ? '../' : '') + 'index.html?auth_required=1');
                    return;
                }
            }
            updateAuthUI(user);
        });
    } catch (err) {
        console.error("Firebase init error:", err);
        showAuthMessage("Firebase configuration error: " + err.message, "error");
    }
}

// ── 3. AUTHENTICATION ACTIONS ──

// Google 1-Click Sign-In
async function loginWithGoogle() {
    if (!auth) return;
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        showAuthMessage("Connecting to Google Authentication Matrix...", "info");
        const result = await auth.signInWithPopup(provider);
        const name = result.user.displayName || "Operative";
        showAuthMessage(`Identity Authenticated: Welcome, ${name}! Redirecting...`, "success");
        
        setTimeout(() => {
            closeAuthModal();
            const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
            if (path.endsWith('/index.html') || path.endsWith('/') || path === '') {
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    } catch (error) {
        console.error("Google Auth Error:", error);
        if (error.code === 'auth/unauthorized-domain') {
            const host = window.location.hostname || '127.0.0.1';
            const port = window.location.port ? `:${window.location.port}` : '';
            if (host === '127.0.0.1') {
                showAuthMessage(
                    `⚠️ Domain '127.0.0.1' is not whitelisted by default in Firebase.\n\n` +
                    `👉 1-SECOND FIX:\nChange "127.0.0.1" to "localhost" in your browser address bar:\n` +
                    `http://localhost${port}${window.location.pathname}\n\n` +
                    `Or sign in with Email & Password below (works on all local IPs)!`,
                    "error"
                );
            } else {
                showAuthMessage(
                    `⚠️ Domain '${host}' is not in your Firebase Authorized Domains.\n\n` +
                    `👉 FIX: Add '${host}' to Firebase Console -> Authentication -> Settings -> Authorized Domains,\n` +
                    `or use Email & Password below!`,
                    "error"
                );
            }
        } else {
            showAuthMessage(error.message, "error");
        }
    }
}

// Email & Password Sign In
async function loginWithEmail(email, password) {
    if (!auth) return;
    if (!email || !password) {
        showAuthMessage("Please provide both email and passphrase.", "error");
        return;
    }
    try {
        showAuthMessage("Authenticating credentials...", "info");
        const result = await auth.signInWithEmailAndPassword(email, password);
        const name = result.user.displayName || result.user.email;
        showAuthMessage(`Access Granted: Welcome Agent ${name}!`, "success");
        
        setTimeout(() => {
            closeAuthModal();
            const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
            if (path.endsWith('/index.html') || path.endsWith('/') || path === '') {
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    } catch (error) {
        console.error("Email Login Error:", error);
        showAuthMessage(error.message, "error");
    }
}

// Email & Password Registration
async function registerWithEmail(email, password, displayName) {
    if (!auth) return;
    if (!email || !password) {
        showAuthMessage("Please provide operative email and security passphrase.", "error");
        return;
    }
    try {
        showAuthMessage("Creating new operative profile in Firebase...", "info");
        const result = await auth.createUserWithEmailAndPassword(email, password);
        const alias = displayName || 'CADET_' + Math.floor(Math.random() * 9000 + 1000);
        await result.user.updateProfile({ displayName: alias });
        showAuthMessage(`Registration Complete. Welcome Cadet ${alias}! Redirecting...`, "success");
        
        setTimeout(() => {
            closeAuthModal();
            const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
            if (path.endsWith('/index.html') || path.endsWith('/') || path === '') {
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    } catch (error) {
        console.error("Registration Error:", error);
        showAuthMessage(error.message, "error");
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
            homeDashBtn.onclick = (e) => {
                e.preventDefault();
                openAuthModal();
                showAuthMessage("🔒 Operative Authentication Required to Access Tactical Dashboard.", "error");
            };
        }
        if (previewBadgeRank) {
            previewBadgeRank.textContent = "CLEARANCE: LEVEL 1 APPRENTICE";
        }
    }
}

// ── 5. MODAL INTERACTION HELPERS ──
function openAuthModal() {
    const modal = document.getElementById('firebaseAuthModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closeAuthModal() {
    const modal = document.getElementById('firebaseAuthModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 200);
    }
}

function showAuthMessage(msg, type = 'info') {
    const msgBox = document.getElementById('authStatusMessage');
    if (!msgBox) return;
    msgBox.style.display = 'block';
    msgBox.style.whiteSpace = 'pre-wrap';
    msgBox.style.lineHeight = '1.4';
    msgBox.textContent = msg;
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
            openAuthModal();
            showAuthMessage("🔒 ACCESS RESTRICTED: Please authenticate your operative clearance to enter PwnBox tactical modules & dashboard.", "error");
        }, 200);
    }
}

// Auto-initialize when DOM and Firebase SDK are ready
document.addEventListener("DOMContentLoaded", () => {
    checkAuthQueryParams();
    if (typeof firebase !== 'undefined') {
        initFirebaseAuth();
    } else {
        setTimeout(initFirebaseAuth, 600);
    }
});
