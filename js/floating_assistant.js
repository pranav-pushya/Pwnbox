/**
 * PWNBOX CYBER COMMAND — AMBIENT TACTICAL AI COPILOT
 * Mode 1: Quick In-Card Intelligence, Navigation & Live Telemetry
 * Mode 2: "Oracle Mode ↗" Redirect to Deep Cyber AI Oracle (ai_assistant.html)
 */

(function () {
    function getBasePath() {
        const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
        if (path.includes('/modules/') || path.includes('/masterguide/') || path.includes('/games/') || path.includes('/imp_info/') || path.includes('/imp%20info/')) {
            return '../';
        }
        return '';
    }

    function isAiAssistantPage() {
        const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
        return path.endsWith('/ai_assistant.html') || path.endsWith('/ai_assistant');
    }

    // ── 1. Telemetry & User Progress Access ──────────────────────────────
    function getUserTelemetry() {
        const isAuth = localStorage.getItem('pwnbox_is_authenticated') === 'true';
        const alias = localStorage.getItem('agentAlias') || localStorage.getItem('pwnbox_user_name') || 'Operative';
        const email = localStorage.getItem('pwnbox_user_email') || 'N/A';
        const rawXp = localStorage.getItem('pwnbox_total_xp') || localStorage.getItem('pwnbox_arcade_xp') || '0';
        const gate08 = localStorage.getItem('pwnbox_gate08_unlocked') === 'true' ? 'UNLOCKED (Module 08 Black Ops active)' : 'LOCKED (Requires skull trigger 💀 or clearance)';
        
        let notesCount = 0;
        try {
            const notes = JSON.parse(localStorage.getItem('pwnbox_tactical_notes') || '[]');
            notesCount = Array.isArray(notes) ? notes.length : 0;
        } catch(e) {}

        let roadmapChecked = 0;
        try {
            const rd = JSON.parse(localStorage.getItem('pwnbox_roadmap_progress') || '{}');
            roadmapChecked = Object.keys(rd).length;
        } catch(e) {}

        let completedModules = [];
        try {
            completedModules = JSON.parse(localStorage.getItem('pwnbox_completed_modules') || '[]');
        } catch(e) {}

        const modulesCount = completedModules.length;

        return {
            alias,
            email,
            isAuth: isAuth ? 'Signed In (Authenticated Operative)' : 'Guest (Signed Out)',
            totalXp: `${rawXp} XP`,
            rawXp: rawXp,
            modulesCount: `${modulesCount} Module${modulesCount === 1 ? '' : 's'}`,
            gate08,
            notesCount: `${notesCount} tactical notes saved`,
            roadmapChecked: `${roadmapChecked} checklist objectives completed`,
            completedModules: completedModules.length > 0 ? completedModules.join(', ') : 'None yet recorded',
            currentPage: document.title || window.location.pathname
        };
    }

    // ── 2. Website Knowledge Base (Clean Section Names, Zero .html paths) ──
    const WEBSITE_KNOWLEDGE = `
PWNBOX PLATFORM DIRECTORY & ARCHITECTURE:
- 8 Training Modules:
  1. Module 01: Footprinting & Reconnaissance — Whois, DNS enumeration, Shodan reconnaissance.
  2. Module 02: Scanning Networks — Nmap sweeps, TCP/SYN port analysis, OS fingerprinting.
  3. Module 03: Enumeration — NetBIOS, SNMP, SMB, RPC, LDAP directory extraction.
  4. Module 04: Vulnerability Analysis — CVE indexing, CVSS scoring, OpenVAS and Nessus scans.
  5. Module 05: System Hacking — Password cracking, privilege escalation, Metasploit automation.
  6. Module 06: Web App Threats — OWASP Top 10, SQL injection, XSS, CSRF, Burp Suite interceptor.
  7. Module 07: OSINT & Deep Recon — Maltego graphs, Google dorking, metadata harvesting.
  8. Module 08: Black Ops & C2 Operations — Secret module! Unlocked via secret skull trigger 💀 or clearance.
- 8 Cyber Arcade Mini-Games (Access via top navbar "GAMES" or hotkey 'G'):
  1. Packet Gatekeeper: Firewall rule filtering (Port 80 vs 443, Telnet 23, SYN flood defense).
  2. SQLi Locksmith: SQL injection payload bypass & authentication circumvention.
  3. PrivEsc Tower: Multi-floor privilege escalation on Linux and Windows.
  4. Ransomware Panic Room: Live incident response, process killing & decryptor crafting.
  5. CIDR Block: Subnetting, network addressing & IP calculation speed run.
  6. Cipher Relic: Cryptography puzzle (Caesar, Base64, Hex, Vigenère, XOR).
  7. Entropy Clash: Password entropy, rainbow table resistance & brute-force defense.
  8. Phish Detective: Email header forensics, SPF/DKIM inspection & spear-phishing triage.
- Career Roadmap (Access via top navbar "ROADMAP" or hotkey 'R'):
  4 Progression Phases: Phase 1 Novice (Foundations), Phase 2 Specialist (Red/Blue teaming), Phase 3 Operator (Advanced exploit/defense), Phase 4 Architect (CISO & Security leadership).
- Master Guide (Access via top navbar or hotkey 'M'):
  10 comprehensive chapters covering 75+ core cybersecurity concepts with analogies.
- Tactical Notes Vault (Access via top navbar "NOTES" or hotkey 'N'):
  In-browser cloud-synced Markdown notes engine with default briefings and code snippets.
- Important Info & Tools Matrix (Access via hotkey 'I'):
  Career Paths, Ports & Protocols, HTTP Codes, General Cyber Intel, Google Dorking, Hacker Engines & Physical Devices, Linux Command Center.
- Cyber AI Oracle (Access via "Oracle Mode ↗" in this copilot or hotkey 'A'):
  Full-screen deep threat intelligence oracle powered by Groq.
- Keyboard Shortcuts:
  Ctrl+/ = Tactical Command HUD, T = Theme toggle, H = Home, D = Dashboard, G = Games, N = Notes, R = Roadmap, M = Master Guide, A = Cyber Oracle, S = Settings.
- Authentication & Clearance:
  The Cyber AI Assistant, Copilot, and Cyber Oracle are 100% unlocked and freely available to all visitors and students, whether authenticated or exploring as a guest cadet. Guests have full clearance to ask questions, explore cyber topics, use navigation shortcuts, and learn without restriction.
`;

    // ── 3. Proportions Configuration (1.5x Large & 1x Compact) ─────────
    const COPILOT_SIZES = ['size-1-5x', 'size-1x'];
    const COPILOT_SIZE_LABELS = {
        'size-1-5x': '1.5x',
        'size-1x': '1x'
    };

    // ── 4. DOM Injection (Bauhaus Brutalism Ambient Copilot Card) ───────
    function initFloatingAssistant() {
        if (isAiAssistantPage()) return;
        if (document.getElementById('pwnFloatingAiDrawer')) return;

        const basePath = getBasePath();

        // Inject Stylesheet if not already present
        if (!document.getElementById('pwnFloatingAiStyles')) {
            const link = document.createElement('link');
            link.id = 'pwnFloatingAiStyles';
            link.rel = 'stylesheet';
            link.href = `${basePath}css/masterguide_chat.css?v=6.0`;
            document.head.appendChild(link);
        }

        const telemetry = getUserTelemetry();

        // 1. Floating Circular Toggle Button (Bottom-Right)
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'pwnFloatingAiToggle';
        toggleBtn.className = 'pwn-copilot-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle Tactical Copilot');
        toggleBtn.title = 'PwnBox Tactical Copilot';
        toggleBtn.innerHTML = `
            <span class="toggle-icon-closed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z"></path>
                    <circle cx="9" cy="15" r="1"></circle>
                    <circle cx="15" cy="15" r="1"></circle>
                </svg>
            </span>
            <span class="toggle-icon-open">&times;</span>
            <span class="copilot-pulse-dot"></span>
        `;
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            window.toggleFloatingAiChat();
        };
        document.body.appendChild(toggleBtn);

        // 2. Floating Popover Card (Directly above the button)
        const card = document.createElement('aside');
        card.id = 'pwnFloatingAiDrawer';
        card.className = 'pwn-copilot-card';
        card.innerHTML = `
            <!-- Tactical Header (Bauhaus Brutalism) -->
            <div class="copilot-header">
                <div class="copilot-header-left">
                    <div class="copilot-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                        </svg>
                    </div>
                    <div>
                        <div class="copilot-title-row">
                            <span class="copilot-title">PWNBOX COPILOT</span>
                            <span class="copilot-badge">TACTICAL AI</span>
                        </div>
                        <div class="copilot-subtitle">Academy Navigator & Telemetry</div>
                    </div>
                </div>
                <div class="copilot-header-right">
                    <button class="copilot-tool-btn" id="copilotSizeBtn" onclick="window.cycleFloatingSize()" title="Toggle Size (1.5x / 1x)">
                        <span>⛶</span>
                        <span id="copilotSizeLabel">1.5x</span>
                    </button>
                    <button class="copilot-tool-btn" onclick="window.clearFloatingChat()" title="Clear Chat History">
                        <span>🗑️</span>
                    </button>
                    <button class="copilot-close-btn" onclick="window.toggleFloatingAiChat()" title="Close">&times;</button>
                </div>
            </div>

            <!-- Mode Selection Tabs (Mode 1 & Mode 2) -->
            <div class="copilot-mode-tabs">
                <button class="copilot-mode-tab active" title="Active: In-Card Academy Intelligence & Telemetry">
                    <span class="mode-tab-dot"></span>
                    <span>Mode 1: Academy Intel</span>
                </button>
                <button class="copilot-mode-tab oracle-tab" onclick="window.switchFloatingAiMode('cybersec')" title="Launch Full-Page Cyber AI Oracle">
                    <span>Mode 2: Cyber Oracle ↗</span>
                </button>
            </div>

            <!-- Sub-header Telemetry Strip -->
            <div class="copilot-telemetry-strip">
                <div class="telemetry-left">
                    <span class="telemetry-dot">●</span>
                    <span id="copilotUserLabel">${escapeHtml(telemetry.alias)} &bull; ${telemetry.modulesCount} Active</span>
                </div>
                <div class="telemetry-right" id="copilotXpLabel">
                    ⚡ ${telemetry.rawXp} XP
                </div>
            </div>

            <!-- Chat Feed Body with Clean Welcome Card (No button grid) -->
            <div class="copilot-body" id="pwnFloatingChatHistory">
                <div class="copilot-welcome-card" id="copilotWelcomeCard">
                    <div class="welcome-text">
                        👋 Greetings Operative <strong id="welcomeAliasText">${escapeHtml(telemetry.alias)}</strong>! I am your PwnBox Tactical Copilot. Ask me anything about navigating modules, checking progress, tools, or shortcuts.
                    </div>
                </div>
            </div>

            <!-- Clean Single-Row Input (Zero extra buttons strip) -->
            <div class="copilot-input-area">
                <input type="text" id="pwnFloatingChatInput" class="copilot-input" placeholder="Ask tactical question or navigate..." autocomplete="off" onkeypress="window.handleFloatingEnter(event)">
                <button id="pwnFloatingSendBtn" class="copilot-send-btn" onclick="window.sendFloatingMessage()" title="Send">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(card);

        // Apply saved size (default 1.5x)
        const savedSize = localStorage.getItem('pwnbox_copilot_size') || 'size-1-5x';
        card.classList.add(savedSize);
        const sizeLabel = card.querySelector('#copilotSizeLabel');
        if (sizeLabel) sizeLabel.textContent = COPILOT_SIZE_LABELS[savedSize] || '1.5x';

        // Prevent clicks inside the card from closing it
        card.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Click outside closes the card
        document.addEventListener('click', (e) => {
            if (card.classList.contains('open') && !card.contains(e.target) && !toggleBtn.contains(e.target)) {
                window.toggleFloatingAiChat(false);
            }
        });
    }

    // ── 5. UI Controls & Size Switcher (1.5x / 1x) ───────────────────────
    window.cycleFloatingSize = function () {
        const card = document.getElementById('pwnFloatingAiDrawer');
        if (!card) return;
        const current = localStorage.getItem('pwnbox_copilot_size') || 'size-1-5x';
        const nextSize = current === 'size-1-5x' ? 'size-1x' : 'size-1-5x';

        COPILOT_SIZES.forEach(s => card.classList.remove(s));
        card.classList.add(nextSize);
        localStorage.setItem('pwnbox_copilot_size', nextSize);
        const label = document.getElementById('copilotSizeLabel');
        if (label) label.textContent = COPILOT_SIZE_LABELS[nextSize];
    };

    window.clearFloatingChat = function () {
        const history = document.getElementById('pwnFloatingChatHistory');
        const telemetry = getUserTelemetry();
        if (history) {
            history.innerHTML = `
                <div class="copilot-welcome-card" id="copilotWelcomeCard">
                    <div class="welcome-text">
                        👋 Greetings Operative <strong id="welcomeAliasText">${escapeHtml(telemetry.alias)}</strong>! I am your PwnBox Tactical Copilot. Ask me anything about navigating modules, checking progress, tools, or shortcuts.
                    </div>
                </div>
            `;
        }
    };

    // ── 6. Toggle & Mode Switch ─────────────────────────────────────────
    window.toggleFloatingAiChat = function (forceState) {
        const card = document.getElementById('pwnFloatingAiDrawer');
        const toggleBtn = document.getElementById('pwnFloatingAiToggle');
        if (!card || !toggleBtn) return;

        const isCurrentlyOpen = card.classList.contains('open');
        const nextState = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

        if (nextState) {
            const telemetry = getUserTelemetry();
            const userLabel = document.getElementById('copilotUserLabel');
            const xpLabel = document.getElementById('copilotXpLabel');
            const aliasSpan = document.getElementById('welcomeAliasText');

            if (userLabel) userLabel.innerHTML = `${escapeHtml(telemetry.alias)} &bull; ${telemetry.modulesCount} Active`;
            if (xpLabel) xpLabel.textContent = `⚡ ${telemetry.rawXp} XP`;
            if (aliasSpan) aliasSpan.textContent = telemetry.alias;

            card.classList.add('open');
            toggleBtn.classList.add('open');
            setTimeout(() => {
                const input = document.getElementById('pwnFloatingChatInput');
                if (input) input.focus();
            }, 150);
        } else {
            card.classList.remove('open');
            toggleBtn.classList.remove('open');
        }
    };

    window.toggleDoubtChat = window.toggleFloatingAiChat;

    window.switchFloatingAiMode = function (mode) {
        if (mode === 'cybersec') {
            const input = document.getElementById('pwnFloatingChatInput');
            const draft = input ? input.value.trim() : '';
            const basePath = getBasePath();
            const targetUrl = `${basePath}ai_assistant.html` + (draft ? `?q=${encodeURIComponent(draft)}` : '');
            window.location.href = targetUrl;
        }
    };

    // ── 7. Chat Interaction & Mode 1 Handling ───────────────────────────
    window.handleFloatingEnter = function (e) {
        if (e.key === 'Enter') {
            window.sendFloatingMessage();
        }
    };

    window.askFloatingPrompt = function (text) {
        const input = document.getElementById('pwnFloatingChatInput');
        if (input) {
            input.value = text;
            window.sendFloatingMessage();
        }
    };

    window.sendFloatingMessage = async function () {
        const input = document.getElementById('pwnFloatingChatInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        addFloatingBubble(text, 'user');
        input.value = '';

        const telemetry = getUserTelemetry();
        const lower = text.toLowerCase();

        // Fast instant local intelligence for common queries (ultra-crisp 1-sentence answers)
        if (lower.includes('my progress') || lower.includes('what is my progress') || lower.includes('progress in')) {
            setTimeout(() => {
                const reply = `You currently have **${telemetry.totalXp}**, **${telemetry.modulesCount} completed**, and **${telemetry.notesCount}**.`;
                addFloatingBubble(reply, 'bot');
            }, 150);
            return;
        }

        if (lower.includes('where are my notes') || lower.includes('tactical notes') || lower.includes('find notes') || lower.includes('open notes')) {
            setTimeout(() => {
                const reply = `Open the **Tactical Notes Vault** from the top navigation bar, or press <kbd>N</kbd> from any screen.`;
                addFloatingBubble(reply, 'bot');
            }, 150);
            return;
        }

        if (lower.includes('where is roadmap') || lower.includes('career roadmap') || lower.includes('access roadmap') || lower.includes('open roadmap')) {
            setTimeout(() => {
                const reply = `Access the **Career Roadmap** via the top navbar, or press <kbd>R</kbd> anywhere on the site.`;
                addFloatingBubble(reply, 'bot');
            }, 150);
            return;
        }

        if (lower.includes('unlock module 08') || lower.includes('unlock module 8') || lower.includes('how to unlock module')) {
            setTimeout(() => {
                const reply = `Module 08 (Black Ops C2) is unlocked using the secret skull trigger (💀) or by enabling God Mode.`;
                addFloatingBubble(reply, 'bot');
            }, 150);
            return;
        }

        if (lower.includes('shortcuts') || lower.includes('keyboard shortcut')) {
            setTimeout(() => {
                const reply = `Press <kbd>Ctrl</kbd> + <kbd>/</kbd> to open the Tactical Command HUD, or use <kbd>D</kbd> (Dashboard), <kbd>G</kbd> (Games), <kbd>N</kbd> (Notes), <kbd>R</kbd> (Roadmap), <kbd>T</kbd> (Theme).`;
                addFloatingBubble(reply, 'bot');
            }, 150);
            return;
        }

        const apiKey = (typeof window !== "undefined" && window.GROQ_API_KEY) || 
                     (typeof GROQ_API_KEY !== "undefined" ? GROQ_API_KEY : "") || 
                     localStorage.getItem('pwnbox_groq_api_key') || 
                     "";

        if (!apiKey) {
            setTimeout(() => {
                addFloatingBubble("⚠️ <strong>Missing Groq API Key!</strong> Please ensure <code>GROQ_API_KEY</code> is configured in <code>js/config.js</code>.", 'bot');
            }, 200);
            return;
        }

        const systemPrompt = `You are the PwnBox Academy Tactical AI Copilot. Your absolute mandate is to give ULTRA-CRISP, 1-TO-2 SENTENCE DIRECT ANSWERS.

USER STATUS:
- Callsign: ${telemetry.alias}
- Auth: ${telemetry.isAuth}
- Earned XP: ${telemetry.totalXp}
- Module 08 Status: ${telemetry.gate08}
- Saved Notes: ${telemetry.notesCount}
- Roadmap Progress: ${telemetry.roadmapChecked}
- Completed Modules: ${telemetry.completedModules}

${WEBSITE_KNOWLEDGE}

STRICT ANSWERING RULES:
1. EXTREME BREVITY: Answer ONLY what was asked in 1 or 2 crisp sentences. Do NOT give long, detailed explanations. Do NOT provide unrequested background, bulleted lists, or essays.
2. NEVER mention any ".html" file names or URL paths (DO NOT say "notes.html", "roadmap.html", "games.html", etc.).
3. To open or find sections, simply state the section name and its keyboard shortcut (e.g. "Open **Tactical Notes Vault** from the top navbar, or press 'N'.").
4. If asked about progress, state only the XP and completed items in one sentence.
5. Answer strictly what the user asked. No fluff.`;

        const loadingId = "pwn-ai-load-" + Date.now();
        showFloatingTyping(loadingId);

        try {
            let data;
            if (typeof window !== "undefined" && window.GroqService && window.GroqService.callGroqChat) {
                data = await window.GroqService.callGroqChat({
                    model: "openai/gpt-oss-120b",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: text }
                    ],
                    temperature: 0.5,
                    max_tokens: 180
                });
            } else {
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "openai/gpt-oss-120b",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: text }
                        ],
                        temperature: 0.5,
                        max_tokens: 180
                    })
                });
                data = await response.json();
            }

            removeFloatingTyping(loadingId);
            if (data.error) {
                addFloatingBubble(`⚠️ AI Error: ${data.error.message || 'Service unavailable'}`, 'bot');
            } else if (data.choices && data.choices[0] && data.choices[0].message) {
                const reply = data.choices[0].message.content || 'Response processed.';
                addFloatingBubble(formatAssistantMarkdown(reply), 'bot');
            } else {
                addFloatingBubble("Unable to parse response from intelligence core. Please retry.", 'bot');
            }
        } catch (err) {
            removeFloatingTyping(loadingId);
            addFloatingBubble("⚠️ Network Error: Could not connect to PwnBox AI service. Please check your connection.", 'bot');
        }
    };

    function addFloatingBubble(htmlContent, sender) {
        const history = document.getElementById('pwnFloatingChatHistory');
        if (!history) return;

        const bubble = document.createElement('div');
        bubble.className = `msg ${sender}`;
        bubble.innerHTML = htmlContent;
        history.appendChild(bubble);
        history.scrollTop = history.scrollHeight;
    }

    function showFloatingTyping(id) {
        const history = document.getElementById('pwnFloatingChatHistory');
        if (!history) return;

        const indicator = document.createElement('div');
        indicator.id = id;
        indicator.className = 'msg bot typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        history.appendChild(indicator);
        history.scrollTop = history.scrollHeight;
    }

    function removeFloatingTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function formatAssistantMarkdown(text) {
        if (!text) return '';

        // Intercept and sanitize any accidental .html mentions
        let sanitized = text
            .replace(/masterguide\/roadmap\.html/gi, 'Career Roadmap')
            .replace(/notes\.html/gi, 'Tactical Notes')
            .replace(/games\.html/gi, 'Cyber Mini-Games Arcade')
            .replace(/dashboard\.html/gi, 'Tactical Dashboard')
            .replace(/index\.html/gi, 'Home Portal')
            .replace(/ai_assistant\.html/gi, 'Cyber AI Oracle')
            .replace(/cybersecurity_masterguide\.html/gi, 'Master Guide')
            .replace(/modules\/([a-zA-Z0-9_-]+)\.html/gi, 'Module: $1')
            .replace(/([a-zA-Z0-9_-]+)\.html/gi, '$1');

        if (typeof window !== "undefined" && window.PwnMarkdown && window.PwnMarkdown.parseMarkdown) {
            return window.PwnMarkdown.parseMarkdown(sanitized, { style: 'oracle' });
        }

        // Stash code blocks with language badge and copy button
        const codeBlocks = [];
        let processed = sanitized.replace(/```([^\n\r]*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
            const displayLang = (lang && lang.trim()) ? lang.trim().toUpperCase() : 'CODE';
            codeBlocks.push(`
                <div class="code-block-wrapper">
                    <div class="code-block-header">
                        <span class="code-lang-tag">${displayLang}</span>
                        <button class="code-copy-btn" onclick="window.copyFloatingCode(this)">
                            <span>COPY</span>
                        </button>
                    </div>
                    <pre><code>${escapeHtml(code.trim())}</code></pre>
                </div>
            `);
            return `%%%CODE_BLOCK_${codeBlocks.length - 1}%%%`;
        });

        // Escape HTML but preserve breaks
        processed = processed
            .replace(/&/g, "&amp;")
            .replace(/<br\s*\/?>/gi, "%%%BR_TAG%%%")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/%%%BR_TAG%%%/g, "<br>");

        // Headings
        processed = processed.replace(/^### (.*$)/gim, '<div style="font-weight: 800; margin: 8px 0 4px 0;">$1</div>');
        processed = processed.replace(/^## (.*$)/gim, '<div style="font-weight: 800; margin: 10px 0 4px 0;">$1</div>');

        // Parse tables
        processed = parseAssistantTables(processed);

        // Lists
        processed = parseAssistantLists(processed);

        // Inline formatting
        processed = processed
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`\n]+)`/g, '<code>$1</code>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Line breaks
        processed = processed.replace(/\n{2,}/g, '<br><br>');
        processed = processed.replace(/\n/g, '<br>');

        processed = processed
            .replace(/<br\s*\/?>\s*(<(?:div|table|thead|tbody|tr|th|td|blockquote|hr|ul|ol|li)[^>]*>)/gi, '$1')
            .replace(/(<\/(?:div|table|thead|tbody|tr|th|td|blockquote|hr|ul|ol|li)>)\s*<br\s*\/?>/gi, '$1')
            .replace(/(<div class="oracle-table-wrapper">[\s\S]*?<\/div>)<br\s*\/?>/gi, '$1');

        // Restore code blocks
        codeBlocks.forEach((block, idx) => {
            processed = processed.replace(`%%%CODE_BLOCK_${idx}%%%`, block);
        });

        return processed;
    }

    function parseAssistantTables(text) {
        const lines = text.split('\n');
        const result = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();
            if (i + 1 < lines.length && line.includes('|')) {
                const nextLine = lines[i + 1].trim();
                if (isAssistantTableDivider(nextLine)) {
                    const headerCells = splitAssistantCells(line);
                    let tableHtml = '<div class="oracle-table-wrapper">' +
                        '<div class="oracle-table-topbar">' +
                        '  <span class="table-badge">DATA TABLE</span>' +
                        '  <button class="table-copy-btn" onclick="window.copyFloatingTable(this)">Copy Table</button>' +
                        '</div>' +
                        '<table class="oracle-table"><thead><tr>';
                    headerCells.forEach(c => {
                        tableHtml += `<th>${c}</th>`;
                    });
                    tableHtml += '</tr></thead><tbody>';
                    i += 2;

                    while (i < lines.length) {
                        const rowLine = lines[i].trim();
                        if (!rowLine || !rowLine.includes('|') || isAssistantTableDivider(rowLine) || rowLine.startsWith('#')) {
                            break;
                        }
                        const rowCells = splitAssistantCells(rowLine);
                        tableHtml += '<tr>';
                        for (let c = 0; c < headerCells.length; c++) {
                            tableHtml += `<td>${rowCells[c] !== undefined ? rowCells[c] : ''}</td>`;
                        }
                        tableHtml += '</tr>';
                        i++;
                    }
                    tableHtml += '</tbody></table></div>';
                    result.push(tableHtml);
                    continue;
                }
            }
            result.push(lines[i]);
            i++;
        }
        return result.join('\n');
    }

    window.copyFloatingCode = function (btn) {
        const wrapper = btn.closest('.code-block-wrapper') || btn.parentElement;
        const pre = wrapper ? wrapper.querySelector('pre code') : null;
        if (pre) {
            navigator.clipboard.writeText(pre.innerText).then(() => {
                const span = btn.querySelector('span') || btn;
                const original = span.innerText;
                btn.classList.add('copied');
                span.innerText = 'COPIED!';
                setTimeout(() => {
                    span.innerText = original;
                    btn.classList.remove('copied');
                }, 1800);
            });
        }
    };

    window.copyFloatingTable = function (btn) {
        const wrapper = btn.closest('.oracle-table-wrapper');
        if (!wrapper) return;
        const table = wrapper.querySelector('table');
        if (!table) return;

        let md = '';
        const ths = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
        if (ths.length > 0) {
            md += '| ' + ths.join(' | ') + ' |\n';
            md += '| ' + ths.map(() => '---').join(' | ') + ' |\n';
        }
        const trs = Array.from(table.querySelectorAll('tbody tr'));
        trs.forEach(tr => {
            const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n+/g, ' '));
            md += '| ' + tds.join(' | ') + ' |\n';
        });

        navigator.clipboard.writeText(md).then(() => {
            const original = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => {
                btn.innerText = original;
            }, 1800);
        });
    };

    function isAssistantTableDivider(line) {
        if (!line || !line.includes('-')) return false;
        let clean = line.trim();
        if (clean.startsWith('|')) clean = clean.substring(1);
        if (clean.endsWith('|')) clean = clean.substring(0, clean.length - 1);
        const cells = clean.split('|').map(c => c.trim());
        return cells.length > 0 && cells.every(c => /^:?-{1,}:?$/.test(c));
    }

    function splitAssistantCells(line) {
        let clean = line.trim();
        if (clean.startsWith('|')) clean = clean.substring(1);
        if (clean.endsWith('|')) clean = clean.substring(0, clean.length - 1);
        return clean.replace(/\\\|/g, '%%%ESCAPED_PIPE%%%')
            .split('|')
            .map(c => c.replace(/%%%ESCAPED_PIPE%%%/g, '|').trim());
    }

    function parseAssistantLists(text) {
        const lines = text.split('\n');
        const result = [];
        let currentListType = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            const isBullet = /^[-*]\s+(.*)$/.test(trimmed);
            const isNumbered = /^\d+\.\s+(.*)$/.test(trimmed);

            if (isBullet) {
                const itemText = trimmed.replace(/^[-*]\s+/, '');
                if (currentListType === 'ol') { result.push('</ol>'); currentListType = null; }
                if (!currentListType) { result.push('<ul>'); currentListType = 'ul'; }
                result.push(`<li>${itemText}</li>`);
            } else if (isNumbered) {
                const itemText = trimmed.replace(/^\d+\.\s+/, '');
                if (currentListType === 'ul') { result.push('</ul>'); currentListType = null; }
                if (!currentListType) { result.push('<ol>'); currentListType = 'ol'; }
                result.push(`<li>${itemText}</li>`);
            } else {
                if (currentListType) {
                    result.push(currentListType === 'ul' ? '</ul>' : '</ol>');
                    currentListType = null;
                }
                result.push(line);
            }
        }
        if (currentListType) result.push(currentListType === 'ul' ? '</ul>' : '</ol>');
        return result.join('\n');
    }

    // Auto initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingAssistant);
    } else {
        initFloatingAssistant();
    }
})();
