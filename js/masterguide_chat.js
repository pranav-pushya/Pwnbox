/**
 * CyberSec Master Guide — "Ask a Doubt" AI Tutor
 * Context-aware Hinglish chatbot powered by Groq (openai/gpt-oss-20b)
 */

(function () {
    // ── DOM Injection & Setup ───────────────────────────────────────────
    function initDoubtChat() {
        if (document.getElementById('doubtChatDrawer')) return;

        // Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'doubtChatToggle';
        toggleBtn.className = 'doubt-chat-toggle';
        toggleBtn.setAttribute('aria-label', 'Open AI Doubt Assistant');
        toggleBtn.innerHTML = `
            <span class="chat-icon">💬</span>
            <span class="chat-text">Ask a Doubt</span>
            <span class="chat-pulse"></span>
        `;
        toggleBtn.onclick = toggleDoubtChat;
        document.body.appendChild(toggleBtn);

        // Backdrop Overlay
        const overlay = document.createElement('div');
        overlay.id = 'doubtChatOverlay';
        overlay.className = 'doubt-chat-overlay';
        overlay.onclick = toggleDoubtChat;
        document.body.appendChild(overlay);

        // Sidebar Drawer
        const drawer = document.createElement('aside');
        drawer.id = 'doubtChatDrawer';
        drawer.className = 'doubt-chat-drawer';
        drawer.innerHTML = `
            <div class="doubt-chat-header">
                <div class="doubt-chat-title">
                    <div class="doubt-avatar">🛡️</div>
                    <div>
                        <h3>Sawt AI Tutor</h3>
                        <div class="doubt-subtitle">Target: <span id="doubtContextName">General CyberSec</span></div>
                    </div>
                </div>
                <button class="doubt-chat-close" onclick="toggleDoubtChat()" title="Close chat">&times;</button>
            </div>
            <div class="doubt-chat-body">
                <div class="chat-history" id="doubtChatHistory">
                    <div class="msg bot">
                        Hey Agent! 👋 Koi term samajh nahi aaya, confusing laga, ya real-world example chahiye? Mujhse pucho — main <strong>Hinglish</strong> mein simplified explanation dunga!
                    </div>
                </div>
                <div class="doubt-quick-prompts">
                    <button onclick="window.askDoubtPrompt('Explain this term in simple Hinglish')">💡 Simple Hinglish</button>
                    <button onclick="window.askDoubtPrompt('Give a simple real-world analogy')">🧠 Analogy</button>
                    <button onclick="window.askDoubtPrompt('Why should a hacker or defender care?')">🛡️ Why it matters</button>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="doubtChatInput" placeholder="Pucho apna doubt..." onkeypress="window.handleDoubtEnter(event)">
                    <button id="doubtSendBtn" onclick="window.sendDoubtMessage()">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(drawer);

        updateContextBadge();
    }

    // ── Toggle Open/Close ──────────────────────────────────────────────
    window.toggleDoubtChat = function () {
        const drawer = document.getElementById('doubtChatDrawer');
        const overlay = document.getElementById('doubtChatOverlay');
        if (!drawer || !overlay) return;

        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
        } else {
            drawer.classList.add('open');
            overlay.classList.add('open');
            updateContextBadge();
            setTimeout(() => {
                const input = document.getElementById('doubtChatInput');
                if (input) input.focus();
            }, 300);
        }
    };

    // ── Context Gathering ──────────────────────────────────────────────
    function getActiveContext() {
        // 1. If inside test page and a question is currently loaded
        if (window.__CURRENT_TEST_QUESTION) {
            const q = window.__CURRENT_TEST_QUESTION;
            return {
                label: `Q: ${q.termRef || 'Exam'}`,
                fullContext: `TEST QUESTION IN VIEW:
Question: "${q.question}"
Term Reference: "${q.termRef}"
Type: "${q.type}"
Difficulty: "${q.difficulty}"
Options:
A) ${q.options[0]}
B) ${q.options[1]}
C) ${q.options[2]}
D) ${q.options[3]}
Correct Option: Option index ${q.correctIndex} ("${q.options[q.correctIndex]}")
Explanation: "${q.explanation}"`
            };
        }

        // 2. If on a Master Guide chapter page
        const openCard = document.querySelector('.term-card.open') || document.querySelector('.term-card:target');
        if (openCard) {
            const termName = openCard.querySelector('.term-name')?.textContent.trim() || 'Active Term';
            const tagline = openCard.querySelector('.term-tagline')?.textContent.trim() || '';
            const bodyText = openCard.querySelector('.term-body')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 700) || '';
            return {
                label: termName,
                fullContext: `MASTER GUIDE TERM IN VIEW:
Term: "${termName}"
Tagline: "${tagline}"
Guide Summary & Notes: "${bodyText}"`
            };
        }

        // 3. Check page title / heading
        const pageHeading = document.querySelector('.chapter-title-block h2')?.textContent.trim() || document.title;
        return {
            label: pageHeading.slice(0, 22),
            fullContext: `Current Page Context: ${pageHeading}`
        };
    }

    function updateContextBadge() {
        const badge = document.getElementById('doubtContextName');
        if (!badge) return;
        const ctx = getActiveContext();
        badge.textContent = ctx.label || 'General';
    }

    // ── Message Handling ───────────────────────────────────────────────
    window.handleDoubtEnter = function (e) {
        if (e.key === 'Enter') {
            window.sendDoubtMessage();
        }
    };

    window.askDoubtPrompt = function (promptText) {
        const input = document.getElementById('doubtChatInput');
        if (input) {
            input.value = promptText;
            window.sendDoubtMessage();
        }
    };

    window.sendDoubtMessage = async function () {
        const input = document.getElementById('doubtChatInput');
        const text = input.value.trim();
        if (!text) return;

        addChatBubble(text, 'user');
        input.value = '';

        const apiKey = (typeof window !== "undefined" && window.GROQ_API_KEY) || (typeof GROQ_API_KEY !== "undefined" ? GROQ_API_KEY : "");

        if (!apiKey) {
            setTimeout(() => {
                addChatBubble("⚠️ <strong>Missing Groq API Key!</strong> Please configure <code>GROQ_API_KEY</code> in <code>js/config.js</code>.", 'bot');
            }, 300);
            return;
        }

        const context = getActiveContext();
        updateContextBadge();

        const systemPrompt = `You are a cybersecurity tutor helping a beginner understand master guide terms. Answer in Hinglish. Be concise. If the user's question relates to a specific term in view, use that term's context.

CURRENT ACTIVE CONTEXT:
${context.fullContext}

Format requirements:
- Use clear, friendly Hinglish (conversational Hindi written in Latin script with common technical English words like server, packets, payload, defense).
- Keep explanations crisp, direct, and under 3-4 paragraphs.
- Use analogies when clarifying difficult concepts.
- Wrap any commands, codes, or terms in markdown backticks.`;

        const loadingId = "doubt-load-" + Date.now();
        showTyping(loadingId);

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: text }
                    ],
                    temperature: 0.7,
                    max_tokens: 600
                })
            });

            removeTyping(loadingId);

            const data = await response.json();
            if (data.error) {
                addChatBubble(`Groq API Error: ${data.error.message || 'Unknown error'}`, 'bot');
            } else if (data.choices && data.choices[0] && data.choices[0].message) {
                const reply = data.choices[0].message.content;
                addChatBubble(formatChatMarkdown(reply), 'bot');
            } else {
                addChatBubble("Maaf karna, response format samajh nahi aaya. Dobara try karo.", 'bot');
            }
        } catch (err) {
            removeTyping(loadingId);
            addChatBubble("Network Error: Could not connect to Groq API. Please check your internet connection.", 'bot');
        }
    };

    function addChatBubble(htmlContent, sender) {
        const history = document.getElementById('doubtChatHistory');
        if (!history) return;

        const bubble = document.createElement('div');
        bubble.className = `msg ${sender}`;
        bubble.innerHTML = htmlContent;
        history.appendChild(bubble);
        history.scrollTop = history.scrollHeight;
    }

    function showTyping(id) {
        const history = document.getElementById('doubtChatHistory');
        if (!history) return;

        const indicator = document.createElement('div');
        indicator.id = id;
        indicator.className = 'msg bot typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        history.appendChild(indicator);
        history.scrollTop = history.scrollHeight;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // ── Markdown Parser ────────────────────────────────────────────────
    function formatChatMarkdown(text) {
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Code blocks
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code>${code.trim()}</code></pre>`;
        });

        // Inline code
        html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Bullet lists
        let lines = html.split('\n');
        let inList = false;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line.startsWith('* ') || line.startsWith('- ')) {
                let item = line.substring(2);
                if (!inList) {
                    lines[i] = '<ul><li>' + item + '</li>';
                    inList = true;
                } else {
                    lines[i] = '<li>' + item + '</li>';
                }
            } else {
                if (inList) {
                    lines[i] = '</ul>' + lines[i];
                    inList = false;
                }
            }
        }
        if (inList) lines[lines.length - 1] += '</ul>';
        html = lines.join('\n');

        html = html.replace(/\n/g, '<br>')
            .replace(/<\/pre><br>/g, '</pre>')
            .replace(/<\/ul><br>/g, '</ul>')
            .replace(/<\/li><br>/g, '</li>')
            .replace(/<ul><br>/g, '<ul>');

        return html;
    }

    // Auto initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDoubtChat);
    } else {
        initDoubtChat();
    }
})();
