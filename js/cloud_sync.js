/**
 * PWNBOX CYBER COMMAND — UNIFIED CLOUD SYNCHRONIZATION ENGINE
 * Synchronizes user profile, training curriculum progress, CEH exam history,
 * roadmap milestones, and tactical notes across all devices via Firebase Firestore.
 */

(function () {
    'use strict';

    // Tracked keys across the PwnBox ecosystem
    const TRACKED_MODULE_KEYS = [
        'module_footprinting_completed',
        'module_scanning_completed',
        'module_enumeration_completed',
        'module_vuln_completed',
        'module_systemhacking_completed',
        'module_malware_completed',
        'module_evading_completed',
        'module_webapp_completed',
        'module_osint_completed',
        'module_blackops_completed',
        'pwnbox_m08_unlocked',
        'webapp_quiz_completed',
        'webapp_quiz_score'
    ];

    const PROFILE_KEYS = [
        'agentAlias',
        'pwnbox_agent_alias',
        'pwnbox_user_name',
        'agentAvatar',
        'pwnbox_agent_avatar',
        'pwnbox_godmode_badge',
        'theme'
    ];

    let firestoreInstance = null;
    let authUser = null;
    let unsubscribeSnapshot = null;
    let syncDebounceTimer = null;
    let isApplyingCloudUpdate = false;
    let lastCloudTimestamp = 0;

    // Helper: Initialize Firestore safely
    function getFirestore() {
        if (firestoreInstance) return firestoreInstance;
        if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
            try {
                if (!firebase.apps.length && window.firebaseConfig) {
                    firebase.initializeApp(window.firebaseConfig);
                }
                firestoreInstance = firebase.firestore();
                return firestoreInstance;
            } catch (err) {
                console.warn("[PwnCloudSync] Firestore init notice:", err.message);
            }
        }
        return null;
    }

    // Helper: Build current local snapshot payload
    function getLocalSnapshot() {
        const modules = {};
        TRACKED_MODULE_KEYS.forEach(k => {
            const val = localStorage.getItem(k);
            if (val !== null) modules[k] = val;
        });

        const profile = {};
        PROFILE_KEYS.forEach(k => {
            const val = localStorage.getItem(k);
            if (val !== null) profile[k] = val;
        });

        let notes = [];
        try {
            const notesRaw = localStorage.getItem('pwnbox_notes_vault');
            if (notesRaw) notes = JSON.parse(notesRaw);
        } catch (_) {}

        let exams = [];
        try {
            const examsRaw = localStorage.getItem('pwnbox_exam_history');
            if (examsRaw) exams = JSON.parse(examsRaw);
        } catch (_) {}

        let roadmap = {};
        try {
            const roadmapRaw = localStorage.getItem('pwnbox_roadmap_progress');
            if (roadmapRaw) roadmap = JSON.parse(roadmapRaw);
        } catch (_) {}

        let ctfFlags = [];
        try {
            const flagsRaw = localStorage.getItem('pwnbox_ctf_solved_flags');
            if (flagsRaw) ctfFlags = JSON.parse(flagsRaw);
        } catch (_) {}

        const arcadeXp = parseInt(localStorage.getItem('pwnbox_arcade_total_xp') || '0', 10);

        return {
            modules,
            profile,
            notes: Array.isArray(notes) ? notes : [],
            exams: Array.isArray(exams) ? exams : [],
            roadmap: typeof roadmap === 'object' && roadmap !== null ? roadmap : {},
            ctfFlags: Array.isArray(ctfFlags) ? ctfFlags : [],
            arcadeXp: isNaN(arcadeXp) ? 0 : arcadeXp,
            clientTimestamp: Date.now()
        };
    }

    // Helper: Merge notes array by unique id, keeping newest updatedAt
    function mergeNotesCollections(cloudList, localList) {
        const map = new Map();
        (cloudList || []).forEach(n => {
            if (n && n.id) map.set(n.id, n);
        });
        (localList || []).forEach(n => {
            if (n && n.id) {
                if (map.has(n.id)) {
                    const existing = map.get(n.id);
                    if ((n.updatedAt || 0) > (existing.updatedAt || 0)) {
                        map.set(n.id, n);
                    }
                } else {
                    map.set(n.id, n);
                }
            }
        });
        return Array.from(map.values());
    }

    // Helper: Merge exam history without losing attempts
    function mergeExamHistory(cloudExams, localExams) {
        const map = new Map();
        [...(cloudExams || []), ...(localExams || [])].forEach(item => {
            if (item) {
                const key = item.id || `${item.timestamp || item.date}_${item.score || 0}`;
                map.set(key, item);
            }
        });
        return Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    // Apply cloud payload to local storage and trigger UI notifications
    function applyCloudPayload(cloudData) {
        if (!cloudData) return;
        isApplyingCloudUpdate = true;
        try {
            // 1. Modules progress (Additive: true always wins)
            if (cloudData.modules && typeof cloudData.modules === 'object') {
                Object.entries(cloudData.modules).forEach(([key, val]) => {
                    const currentLocal = localStorage.getItem(key);
                    if (val === 'true' || !currentLocal) {
                        localStorage.setItem(key, String(val));
                    }
                });
            }

            // 2. Profile metadata
            if (cloudData.profile && typeof cloudData.profile === 'object') {
                Object.entries(cloudData.profile).forEach(([key, val]) => {
                    if (val && !localStorage.getItem(key)) {
                        localStorage.setItem(key, String(val));
                    } else if (val && (key === 'pwnbox_godmode_badge' || key === 'theme')) {
                        localStorage.setItem(key, String(val));
                    }
                });
            }

            // 3. Roadmap milestones
            if (cloudData.roadmap && typeof cloudData.roadmap === 'object') {
                let currentRoadmap = {};
                try {
                    currentRoadmap = JSON.parse(localStorage.getItem('pwnbox_roadmap_progress') || '{}');
                } catch (_) {}
                const mergedRoadmap = { ...currentRoadmap, ...cloudData.roadmap };
                localStorage.setItem('pwnbox_roadmap_progress', JSON.stringify(mergedRoadmap));
            }

            // 4. Tactical Notes Vault
            if (Array.isArray(cloudData.notes)) {
                let currentNotes = [];
                try {
                    currentNotes = JSON.parse(localStorage.getItem('pwnbox_notes_vault') || '[]');
                } catch (_) {}
                const mergedNotes = mergeNotesCollections(cloudData.notes, currentNotes);
                localStorage.setItem('pwnbox_notes_vault', JSON.stringify(mergedNotes));
            }

            // 5. Exam History
            if (Array.isArray(cloudData.exams)) {
                let currentExams = [];
                try {
                    currentExams = JSON.parse(localStorage.getItem('pwnbox_exam_history') || '[]');
                } catch (_) {}
                const mergedExams = mergeExamHistory(cloudData.exams, currentExams);
                localStorage.setItem('pwnbox_exam_history', JSON.stringify(mergedExams));
            }

            // 6. CTF Flags & Arcade XP
            if (Array.isArray(cloudData.ctfFlags)) {
                let currentFlags = [];
                try {
                    currentFlags = JSON.parse(localStorage.getItem('pwnbox_ctf_solved_flags') || '[]');
                } catch (_) {}
                const mergedFlags = Array.from(new Set([...currentFlags, ...cloudData.ctfFlags]));
                localStorage.setItem('pwnbox_ctf_solved_flags', JSON.stringify(mergedFlags));
            }
            if (typeof cloudData.arcadeXp === 'number') {
                const localXp = parseInt(localStorage.getItem('pwnbox_arcade_total_xp') || '0', 10);
                const highestXp = Math.max(localXp, cloudData.arcadeXp);
                localStorage.setItem('pwnbox_arcade_total_xp', String(highestXp));
            }

            lastCloudTimestamp = cloudData.clientTimestamp || Date.now();
            updateSyncIndicator('synced');

            // Dispatch global event so all open views (Dashboard, Roadmap, Notes) re-render immediately
            window.dispatchEvent(new CustomEvent('pwnbox:cloud_synced', { detail: cloudData }));

            // Notify specific page components if present
            if (typeof window.initDashboard === 'function') {
                try { window.initDashboard(); } catch (_) {}
            }
            if (typeof window.renderNotesList === 'function') {
                try { window.renderNotesList(); } catch (_) {}
            }
            if (typeof window.updateProgress === 'function') {
                try { window.updateProgress(false); } catch (_) {}
            }
        } finally {
            setTimeout(() => {
                isApplyingCloudUpdate = false;
            }, 300);
        }
    }

    // Push local state to Firestore cloud
    async function pushToCloud() {
        if (!authUser || !authUser.uid) return;
        const db = getFirestore();
        if (!db) return;

        updateSyncIndicator('syncing');
        const local = getLocalSnapshot();

        try {
            const userRef = db.collection('users').doc(authUser.uid);
            await userRef.set({
                modules: local.modules,
                profile: local.profile,
                roadmap: local.roadmap,
                notes: local.notes,
                exams: local.exams,
                email: authUser.email || '',
                displayName: authUser.displayName || local.profile.agentAlias || '',
                lastSyncedAt: firebase.firestore.FieldValue.serverTimestamp(),
                clientTimestamp: Date.now()
            }, { merge: true });

            updateSyncIndicator('synced');
        } catch (err) {
            console.warn("[PwnCloudSync] Push error:", err.message);
            updateSyncIndicator('error');
        }
    }

    // Debounced sync caller
    function requestPushToCloud(delayMs = 600) {
        if (isApplyingCloudUpdate || !authUser) return;
        if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
        syncDebounceTimer = setTimeout(() => {
            pushToCloud();
        }, delayMs);
    }

    // Connect to User Document in Firestore
    function attachUserSync(user) {
        authUser = user;
        const db = getFirestore();
        if (!db || !user || !user.uid) {
            updateSyncIndicator(user ? 'offline' : 'guest');
            return;
        }

        updateSyncIndicator('syncing');

        // Unsubscribe from previous listener if any
        if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            unsubscribeSnapshot = null;
        }

        const userRef = db.collection('users').doc(user.uid);

        // 1. Initial Fetch and Bi-directional Merge
        userRef.get().then(docSnap => {
            if (docSnap.exists) {
                const cloudData = docSnap.data();
                applyCloudPayload(cloudData);
                // Also push back any local items that cloud was missing
                requestPushToCloud(1200);
            } else {
                // First-time user: seed Firestore with current local data
                pushToCloud();
            }
        }).catch(err => {
            console.warn("[PwnCloudSync] Initial fetch notice:", err.message);
            updateSyncIndicator('error');
        });

        // 2. Real-time Snapshot Listener for live multi-device continuity
        unsubscribeSnapshot = userRef.onSnapshot(docSnap => {
            if (docSnap.exists) {
                const cloudData = docSnap.data();
                if (cloudData && !isApplyingCloudUpdate) {
                    const serverTs = cloudData.clientTimestamp || 0;
                    if (serverTs > lastCloudTimestamp) {
                        applyCloudPayload(cloudData);
                    }
                }
            }
        }, err => {
            console.warn("[PwnCloudSync] Real-time listener notice:", err.message);
        });
    }

    // Detach when signed out
    function detachUserSync() {
        authUser = null;
        if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            unsubscribeSnapshot = null;
        }
        updateSyncIndicator('guest');
    }

    // Visual Sync Status Pill in Navigation
    function updateSyncIndicator(state) {
        let pill = document.getElementById('pwnCloudSyncPill');
        if (!pill) {
            // Find appropriate header container to inject the sync badge
            const target = document.querySelector('.profile-container') ||
                           document.querySelector('.notes-header-left') ||
                           document.querySelector('.header-right') ||
                           document.querySelector('header');
            if (target) {
                pill = document.createElement('div');
                pill.id = 'pwnCloudSyncPill';
                pill.className = 'pwn-cloud-sync-pill';
                pill.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 8px;
                    border: 2px solid var(--border-color, #000);
                    font-family: 'Space Mono', monospace;
                    font-size: 0.68rem;
                    font-weight: 800;
                    cursor: pointer;
                    user-select: none;
                    background: var(--bg-panel, #ffffff);
                    box-shadow: 2px 2px 0 var(--border-color, #000);
                    transition: all 0.2s;
                `;
                pill.onclick = () => {
                    if (authUser) {
                        pushToCloud();
                        if (typeof window.tacticalToast === 'function') {
                            window.tacticalToast("Cloud sync triggered. Updating Firestore profile...", "info");
                        }
                    } else if (typeof window.openAuthModal === 'function') {
                        window.openAuthModal();
                    }
                };
                target.appendChild(pill);
            }
        }

        if (!pill) return;

        if (state === 'synced') {
            pill.style.display = 'inline-flex';
            pill.innerHTML = `<span style="color:#10b981;">●</span> <span>CLOUD SYNCED</span>`;
            pill.title = "All curriculum progress, notes, and exams are synchronized to your cloud profile.";
        } else if (state === 'syncing') {
            pill.style.display = 'inline-flex';
            pill.innerHTML = `<span style="color:#f59e0b;">🔄</span> <span>SYNCING...</span>`;
            pill.title = "Uploading latest tactical state to Firestore...";
        } else if (state === 'offline') {
            pill.style.display = 'inline-flex';
            pill.innerHTML = `<span style="color:#94a3b8;">○</span> <span>LOCAL VAULT</span>`;
            pill.title = "Running locally. Sign in to synchronize across all your devices.";
        } else {
            // Guest mode
            pill.style.display = 'inline-flex';
            pill.innerHTML = `<span style="color:#38bdf8;">⚡</span> <span>SIGN IN TO SYNC</span>`;
            pill.title = "Click to sign in with Google or Email to save progress permanently.";
        }
    }

    // Hook into global localStorage.setItem to auto-detect progress changes
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, value) {
        originalSetItem(key, value);
        if (!isApplyingCloudUpdate && authUser) {
            if (TRACKED_MODULE_KEYS.includes(key) ||
                PROFILE_KEYS.includes(key) ||
                key === 'pwnbox_notes_vault' ||
                key === 'pwnbox_exam_history' ||
                key === 'pwnbox_roadmap_progress') {
                requestPushToCloud(800);
            }
        }
    };

    // Listen to Firebase Auth state
    function initAuthListener() {
        if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
            try {
                const auth = firebase.auth();
                auth.onAuthStateChanged(user => {
                    if (user) {
                        attachUserSync(user);
                    } else {
                        detachUserSync();
                    }
                });
                return;
            } catch (err) {
                console.warn("[PwnCloudSync] Auth listen notice:", err.message);
            }
        }

        // Retry if Firebase SDK loads asynchronously
        setTimeout(initAuthListener, 500);
    }

    // Public API for other modules
    window.PwnCloudSync = {
        push: pushToCloud,
        trigger: () => requestPushToCloud(100),
        getSnapshot: getLocalSnapshot,
        getUser: () => authUser
    };

    // Boot on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAuthListener();
        });
    } else {
        initAuthListener();
    }

})();
