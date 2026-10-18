// ==========================================
// API KEY — read from shared js/config.js (window.GROQ_API_KEY)
// Do NOT hardcode a key directly in this file.
// ==========================================
const apiKey = (typeof window !== "undefined" && window.GROQ_API_KEY) || 
                 (typeof GROQ_API_KEY !== "undefined" ? GROQ_API_KEY : "") || 
                 localStorage.getItem('pwnbox_groq_api_key') || 
                 "";

// localStorage keys are module-specific so progress/tools don't bleed into other modules
const MODULE_KEY = 'module_osint_completed';
const CUSTOM_TOOLS_KEY = 'osint_custom_tools';
const EDITED_TOOLS_KEY = 'osint_edited_default_tools';
const DELETED_TOOLS_KEY = 'osint_deleted_default_indices';
const CUSTOM_CATS_KEY = 'osint_custom_categories';

const defaultTools = [
    // ─── OSINT / Attack Surface Search Engines ─────────────────────
    {
        name: "1. ZoomEye", link: "https://www.zoomeye.org",
        category: "OSINT",
        brief: "A cyberspace search engine much like Shodan — it continuously scans the internet and indexes exposed devices, services, and banners so you can search them like a normal search engine.",
        use: "Search by service (e.g. 'webcam'), IP range, or CVE ID. Results show open ports, banners, and geolocation for matching devices.",
        useful: "Finding exposed devices/services tied to a target organization without touching their network directly — pure passive recon."
    },
    {
        name: "2. Onyphe", link: "https://www.onyphe.io",
        category: "OSINT",
        brief: "A cyber defense search engine that indexes internet-wide scan data, threat intelligence feeds, and vulnerability information in one place.",
        use: "Search an IP, domain, or ASN. Onyphe returns exposed ports, known vulnerabilities, and any threat-intel flags associated with it.",
        useful: "Cross-referencing a target's exposed infrastructure against known threat data in a single query instead of juggling multiple tools."
    },
    {
        name: "3. FOFA", link: "https://fofa.info",
        category: "OSINT",
        brief: "A Chinese-origin cyberspace asset mapping engine, similar to Shodan/ZoomEye, with strong coverage of Asia-Pacific infrastructure.",
        use: "Use FOFA query syntax (e.g. 'title=\"admin panel\"') to search indexed banners, titles, and certificates across the internet.",
        useful: "Getting search results and regional coverage that Western-focused engines (Shodan, Censys) sometimes miss."
    },
    {
        name: "4. LeakIX", link: "https://leakix.net",
        category: "OSINT",
        brief: "A search engine specifically built to index misconfigured or leaking services — open databases, exposed admin panels, unsecured API endpoints.",
        use: "Search by domain or IP. LeakIX flags specific leak types it found (e.g. 'open Elasticsearch', 'exposed .env file').",
        useful: "Quickly spotting a target's careless misconfigurations that are already publicly indexed — often the fastest path to a real finding."
    },
    {
        name: "5. CriminalIP", link: "https://www.criminalip.io",
        category: "OSINT",
        brief: "An asset inventory and risk-assessment search engine that scores IPs/domains for exposure risk and links them to known malicious activity.",
        use: "Enter an IP or domain to get a risk score, open ports, associated CVEs, and any history of malicious activity tied to that asset.",
        useful: "Prioritizing which discovered assets are actually worth investigating first, based on the risk score instead of guessing."
    },
    {
        name: "6. Netlas", link: "https://netlas.io",
        category: "OSINT",
        brief: "An attack surface discovery platform that maps a company's entire internet-facing footprint — domains, IPs, certificates, and exposed services.",
        use: "Search a company name or domain to get a consolidated map of every discoverable asset tied to that organization.",
        useful: "Building a complete external attack surface map for a target organization in minutes instead of manually piecing it together."
    },
    {
        name: "7. Dehashed", link: "https://www.dehashed.com",
        category: "OSINT",
        brief: "A search engine over aggregated data-breach dumps — lets you check if an email, username, or domain has appeared in a known leak.",
        use: "Search an email, username, IP, or domain. Results show which breach it appeared in and what data was exposed (password hash, etc).",
        useful: "Checking whether a target's credentials are already circulating from a past breach — a common initial-access vector for real attackers."
    },
    {
        name: "8. DorkSearch", link: "https://www.dorksearch.com",
        category: "OSINT",
        brief: "A Google-dorking assistant that builds advanced search queries for you, so you don't have to memorize dork syntax by hand.",
        use: "Pick filters (filetype, site, intitle, etc.) from the UI and it constructs the correct Google dork query and runs it for you.",
        useful: "Finding sensitive files, exposed login pages, or forgotten directories a company accidentally left indexed by Google."
    },
    {
        name: "9. GrayHatWarfare", link: "https://buckets.grayhatwarfare.com",
        category: "OSINT",
        brief: "A search engine indexing publicly-readable Amazon S3 buckets (and other cloud storage) — a huge source of accidental data exposure.",
        use: "Search by keyword, company name, or file extension to find publicly listed cloud storage buckets and their contents.",
        useful: "Finding accidentally-public cloud storage containing sensitive company files — one of the most common real-world breach causes."
    },
    {
        name: "10. Wayback Machine", link: "https://web.archive.org/web/",
        category: "OSINT",
        brief: "The internet's historical archive — snapshots of what a website looked like at different points in time, going back decades.",
        use: "Paste a URL into the search bar to see a timeline of archived snapshots, including pages that have since been deleted from the live site.",
        useful: "Recovering old/deleted pages, forgotten subdomains, or historical content a company has since taken down but forgot was ever indexed."
    },
    {
        name: "11. PublicWWW", link: "https://publicwww.com",
        category: "Code-Search",
        brief: "A search engine over the source code of publicly crawled websites — lets you search for specific code snippets, tracking IDs, or comments across the web.",
        use: "Search a specific string (e.g. an API key pattern, a tracking ID, a comment signature) to find every public site using it.",
        useful: "Finding other sites built by the same developer, or spotting accidentally-exposed keys/comments left in a site's front-end source."
    },
    {
        name: "12. IntelX", link: "https://intelx.io",
        category: "OSINT",
        brief: "A search engine spanning the surface web, dark web, and leaked data dumps — built specifically for OSINT and breach investigation.",
        use: "Search an email, domain, username, or phrase. Results span pastes, leaks, dark web mentions, and historical web archives.",
        useful: "Casting a very wide net across leaked/breached data sources in one search instead of checking each source manually."
    },
    {
        name: "13. grep.app", link: "https://grep.app",
        category: "Code-Search",
        brief: "A fast search engine specifically over public GitHub code — search literal strings or regex across millions of public repositories.",
        use: "Type a search string (function name, variable, hardcoded string) and instantly search across GitHub's public code index.",
        useful: "Finding accidentally-committed secrets, specific vulnerable code patterns, or every public repo that reuses a particular snippet."
    },
    {
        name: "14. SearchCode", link: "https://searchcode.com",
        category: "Code-Search",
        brief: "Another source-code search engine, covering GitHub, GitLab, Bitbucket and more — useful when grep.app's GitHub-only scope isn't enough.",
        use: "Search a string or regex; filter results by language or source repository host.",
        useful: "Broader source-code searching across hosting platforms grep.app doesn't cover, for the same use case — finding leaked code or secrets."
    },
    {
        name: "15. Fullhunt", link: "https://fullhunt.io",
        category: "OSINT",
        brief: "An attack surface discovery platform focused on continuous monitoring — it keeps re-scanning a company's assets over time, not just once.",
        use: "Register a domain/organization to monitor; it continuously discovers subdomains, exposed services, and flags new exposures as they appear.",
        useful: "Ongoing attack-surface monitoring rather than a one-time snapshot — useful for tracking how a target's exposure changes over time."
    },

    // ─── Threat Intelligence ────────────────────────────────────────
    {
        name: "16. GreyNoise", link: "https://www.greynoise.io",
        category: "Threat-Intel",
        brief: "Tracks internet 'background noise' — the constant scanning traffic from bots, worms, and mass-scanners — so defenders can filter it out from real targeted attacks.",
        use: "Search an IP to see if GreyNoise has classified it as internet 'noise' (benign scanner) or as tied to known malicious campaigns.",
        useful: "Quickly ruling out alerts caused by harmless mass-internet-scanning, so incident responders focus only on genuinely targeted traffic."
    },
    {
        name: "17. BinaryEdge", link: "https://www.binaryedge.io",
        category: "Threat-Intel",
        brief: "A threat-intelligence data platform combining internet-wide scan results with risk scoring and exposure analytics.",
        use: "Search an IP, domain, or ASN to get exposed services, associated risk score, and historical scan data.",
        useful: "Cross-checking a target's exposed assets against BinaryEdge's own scan history and risk model in one lookup."
    },
    {
        name: "18. Pulsedive", link: "https://pulsedive.com",
        category: "Threat-Intel",
        brief: "A free threat-intelligence search engine that aggregates indicators of compromise (IPs, domains, hashes) from many public feeds.",
        use: "Search an IP, domain, or hash to see if it's flagged in any aggregated threat feed, along with related campaign/actor context.",
        useful: "Quickly checking whether an indicator you found during an investigation is already known to be malicious elsewhere."
    },
    {
        name: "19. PolySwarm", link: "https://polyswarm.io",
        category: "Threat-Intel",
        brief: "A crowdsourced threat-detection marketplace — multiple independent malware engines each 'bid' on whether a file/URL is malicious, and results are aggregated.",
        use: "Submit a file hash or URL; multiple independent detection engines analyze it and return a consolidated verdict with confidence scores.",
        useful: "Getting a second (or twentieth) opinion on a suspicious file beyond what a single antivirus engine reports."
    },

    // ─── Network / DNS Recon ────────────────────────────────────────
    {
        name: "20. SecurityTrails", link: "https://securitytrails.com",
        category: "Network",
        brief: "A DNS and domain-data platform with a massive historical archive — current and past DNS records, WHOIS history, and subdomain data.",
        use: "Search a domain to see its current DNS records, historical DNS changes over time, and every known subdomain.",
        useful: "Seeing how a target's infrastructure has changed over time — old IPs, retired subdomains, and hosting-provider migrations."
    },
    {
        name: "21. crt.sh", link: "https://crt.sh",
        category: "Network",
        brief: "A certificate-transparency log search engine — since every publicly-trusted SSL certificate is logged publicly, this lets you search that log.",
        use: "Search a domain (e.g. '%.example.com') to see every SSL certificate ever issued for it, revealing subdomains you didn't know existed.",
        useful: "One of the fastest, most reliable ways to discover a target's subdomains — certificates get logged the moment they're issued, can't be hidden."
    },
    {
        name: "22. DNSDB", link: "https://www.dnsdb.info",
        category: "Network",
        brief: "A historical passive-DNS database — tracks DNS record changes over time across the internet, run by Farsight/DomainTools.",
        use: "Query a domain or IP to see every DNS record it has ever resolved to, with timestamps for when each mapping was seen.",
        useful: "Tracing infrastructure history — finding old IPs a domain used to point to, which can reveal shared hosting with other malicious domains."
    },

    // ─── Wireless ────────────────────────────────────────────────────
    {
        name: "23. WiGLE", link: "https://wigle.net",
        category: "Wireless",
        brief: "A crowdsourced database of WiFi networks mapped by location, built from years of 'wardriving' (driving around scanning for networks).",
        use: "Search by SSID, BSSID, or geographic area to see WiFi networks that have been publicly logged at that location.",
        useful: "Physical/wireless recon — locating a target's WiFi network, confirming its physical location, or researching nearby networks during an on-site engagement."
    },

    // ─── URL / Web Recon ─────────────────────────────────────────────
    {
        name: "24. URLScan.io", link: "https://urlscan.io",
        category: "OSINT",
        brief: "A free service that visits a URL in a sandboxed browser and records everything that happens — every request, redirect, script, and screenshot.",
        use: "Paste a URL to scan; it returns a full network log, a screenshot of the page, and flags any suspicious behavior detected.",
        useful: "Safely inspecting a suspicious link (phishing, malware delivery) without visiting it yourself in a real browser."
    }
];

function init() {
    const list = document.getElementById('toolList');
    list.innerHTML = '';

    const categories = {
        "OSINT": [],
        "Threat-Intel": [],
        "Network": [],
        "Code-Search": [],
        "Wireless": []
    };

    const catDisplayNames = {
        "OSINT": "🔍 OSINT & Attack Surface",
        "Threat-Intel": "🛰️ Threat Intelligence",
        "Network": "🌐 Network & DNS Recon",
        "Code-Search": "💻 Source Code Search",
        "Wireless": "📶 Wireless"
    };

    try {
        const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
        for (const [key, value] of Object.entries(customCats)) {
            categories[key] = [];
            catDisplayNames[key] = value;
        }
    } catch (e) { console.error("Error loading custom categories in init:", e); }

    tools.forEach((tool, index) => {
        const cat = tool.category || "OSINT";
        if (categories[cat]) {
            categories[cat].push({ tool, index });
        } else {
            categories["OSINT"].push({ tool, index });
        }
    });

    for (const [catName, catTools] of Object.entries(categories)) {
        if (catTools.length === 0) continue;

        let headerDiv = document.createElement('div');
        headerDiv.className = 'category-header';
        headerDiv.innerText = catDisplayNames[catName];
        list.appendChild(headerDiv);

        catTools.forEach(({ tool, index }) => {
            let div = document.createElement('div');
            div.className = 'tool-item';
            div.innerText = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name.trim();
            div.onclick = () => showDetails(index, div);
            list.appendChild(div);
        });
    }

    if (!apiKey) {
        document.getElementById('statusDot').classList.remove('online');
        addBotMessage("⚠️ WARNING: No Groq API key found. Configure GROQ_API_KEY in js/config.js to enable the assistant.");
    }
}

function reloadAllTools() {
    tools = defaultTools.map((t, idx) => ({ ...t, originalIndex: idx }));

    try {
        const deletedIndices = JSON.parse(localStorage.getItem(DELETED_TOOLS_KEY) || '[]');
        tools = tools.filter(t => !deletedIndices.includes(t.originalIndex));
    } catch (e) { console.error(e); }

    try {
        const edited = JSON.parse(localStorage.getItem(EDITED_TOOLS_KEY) || '{}');
        tools.forEach(t => { if (edited[t.originalIndex]) Object.assign(t, edited[t.originalIndex]); });
    } catch (e) { console.error(e); }

    loadCustomTools();
    init();
}

function switchMobileTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    document.body.className = document.body.className.replace(/\btab-\w+\b/g, '').trim();
    document.body.classList.add('tab-' + tabId);
}

function showDetails(index, element) {
    document.querySelectorAll('.tool-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    const tool = tools[index];
    const catClass = `badge-${tool.category.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const displayCatName = tool.category.replace(/_/g, ' ');

    document.getElementById('detailsPanel').innerHTML = `
        <div class="card">
            <h1 style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>${tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name}<span class="badge ${catClass}">${displayCatName}</span></span>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="btn btn-edit-tool" onclick="openEditToolModal(${index})" style="font-size: 0.8rem; padding: 6px 12px;">✏️ Edit</button>
                    <button class="btn btn-delete-tool" onclick="confirmDeleteTool(${index})" style="font-size: 0.8rem; padding: 6px 12px;">🗑️ Delete</button>
                    <a href="${tool.link}" target="_blank" style="font-size: 0.8rem; padding: 6px 12px;">Launch ↗</a>
                </div>
            </h1>
            <div class="section-label">Simply Explained (What is it?)</div>
            <div class="section-content">${tool.brief}</div>
            <div class="section-label">How to actually use it</div>
            <div class="section-content">${tool.use}</div>
            <div class="section-label">Why Hackers care about this</div>
            <div class="section-content">${tool.useful}</div>
        </div>
    `;

    if (window.innerWidth <= 768) {
        switchMobileTab('details');
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const inputEl = document.getElementById('chatInput');
    const msg = inputEl.value.trim();
    if (!msg) return;

    addUserMessage(msg);
    inputEl.value = '';

    if (!apiKey) {
        setTimeout(() => addBotMessage("❌ ERROR: Missing Groq API Key. Configure GROQ_API_KEY in js/config.js first."), 500);
        return;
    }

    const toolsContext = tools.map(t => `${t.name.includes('.') ? t.name.split('.')[1].trim() : t.name}: ${t.brief}`).join(" | ");

    const systemPrompt = `You are a brutally honest, direct cybersecurity assistant helping a complete beginner learn OSINT and threat intelligence tools. Explain things simply but logically. When writing command lines or code snippets, ALWAYS wrap them in standard markdown fenced code blocks (using \`\`\`bash or similar) or single backticks for inline code, so the parser renders them nicely. Here is the tool context: ${toolsContext}.`;

    const loadingId = "load-" + Date.now();
    try {
        showTypingIndicator(loadingId);

        let data;
        if (typeof window !== "undefined" && window.GroqService && window.GroqService.callGroqChat) {
            data = await window.GroqService.callGroqChat({
                model: "openai/gpt-oss-20b",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: msg }
                ]
            });
        } else {
            const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(typeof window !== "undefined" && window.GROQ_API_KEY) || localStorage.getItem('pwnbox_groq_api_key') || apiKey || ""}`
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: msg }
                    ]
                })
            });
            data = await response.json();
        }
        const indicator = document.getElementById(loadingId);
        if (indicator) indicator.remove();

        if (data.error) {
            addBotMessage(`Groq API Error: ${data.error.message}`);
        } else {
            const reply = data.choices[0].message.content;
            const formattedReply = formatMarkdown(reply);
            addBotMessage(formattedReply);
        }

    } catch (error) {
        const indicator = document.getElementById(loadingId);
        if (indicator) indicator.remove();
        addBotMessage(`Network Error: Failed to reach Groq API. Check your internet or CORS policy.`);
    }
}

function formatMarkdown(text) {
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    let lines = html.split('\n');
    let inList = false;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith('* ') || line.startsWith('- ')) {
            let content = line.substring(2);
            if (!inList) {
                lines[i] = '<ul><li>' + content + '</li>';
                inList = true;
            } else {
                lines[i] = '<li>' + content + '</li>';
            }
        } else {
            if (inList) {
                lines[i] = '</ul>' + lines[i];
                inList = false;
            }
        }
    }
    if (inList) {
        lines[lines.length - 1] += '</ul>';
    }
    html = lines.join('\n');

    html = html.replace(/\n/g, '<br>');
    html = html.replace(/<\/pre><br>/g, '</pre>')
                .replace(/<\/ul><br>/g, '</ul>')
                .replace(/<\/li><br>/g, '</li>')
                .replace(/<ul><br>/g, '<ul>');

    return html;
}

function showTypingIndicator(id) {
    const history = document.getElementById('chatHistory');
    history.innerHTML += `
        <div class="msg bot typing-indicator" id="${id}">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    history.scrollTop = history.scrollHeight;
}

function addUserMessage(text) {
    const history = document.getElementById('chatHistory');
    history.innerHTML += `<div class="msg user">${text}</div>`;
    history.scrollTop = history.scrollHeight;
}

function addBotMessage(text, id = "") {
    const history = document.getElementById('chatHistory');
    history.innerHTML += `<div class="msg bot" ${id ? `id="${id}"` : ""}>${text}</div>`;
    history.scrollTop = history.scrollHeight;
}

// --- Custom Tool Integration ---
let editingToolIndex = null;
let tools = [];

function openAddToolModal() {
    editingToolIndex = null;
    document.querySelector('#addToolModal h3').innerText = "Add Custom Tool";
    document.querySelector('#addToolForm button[type="submit"]').innerText = "Add Tool";
    document.getElementById('addToolForm').reset();
    cancelNewCategory();
    loadCustomCategories();
    const modal = document.getElementById('addToolModal');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    document.getElementById('toolName').focus();
}

function openEditToolModal(index) {
    editingToolIndex = index;
    const tool = tools[index];
    document.querySelector('#addToolModal h3').innerText = "Edit Tool Info";
    document.querySelector('#addToolForm button[type="submit"]').innerText = "Save Changes";
    document.getElementById('addToolForm').reset();
    cancelNewCategory();
    loadCustomCategories();

    const rawName = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name.trim();
    document.getElementById('toolName').value = rawName;
    document.getElementById('toolLink').value = tool.link;
    document.getElementById('toolCategory').value = tool.category;
    document.getElementById('toolBrief').value = tool.brief;
    document.getElementById('toolUse').value = tool.use;
    document.getElementById('toolUseful').value = tool.useful;

    const modal = document.getElementById('addToolModal');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function closeAddToolModal() {
    const modal = document.getElementById('addToolModal');
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; document.getElementById('addToolForm').reset(); }, 300);
}

function loadCustomTools() {
    try {
        const stored = localStorage.getItem(CUSTOM_TOOLS_KEY);
        if (stored) {
            const customTools = JSON.parse(stored);
            customTools.forEach((tool, idx) => {
                let rawName = tool.name;
                const match = tool.name.match(/^\d+\.\s*(.*)$/);
                if (match) rawName = match[1];
                tool.name = `${tools.length + 1}. ${rawName}`;
                tool.originalIndex = null;
                tool.customIndex = idx;
                tools.push(tool);
            });
        }
    } catch (e) { console.error(e); }
}

function submitNewTool(e) {
    e.preventDefault();
    const nameVal = document.getElementById('toolName').value.trim();
    const linkVal = document.getElementById('toolLink').value.trim();
    const categoryVal = document.getElementById('toolCategory').value;
    const briefVal = document.getElementById('toolBrief').value.trim();
    const useVal = document.getElementById('toolUse').value.trim();
    const usefulVal = document.getElementById('toolUseful').value.trim();

    if (editingToolIndex !== null) {
        const originalTool = tools[editingToolIndex];
        const updatedTool = { name: nameVal, link: linkVal, category: categoryVal, brief: briefVal, use: useVal, useful: usefulVal };

        if (originalTool.originalIndex !== null) {
            let edited = JSON.parse(localStorage.getItem(EDITED_TOOLS_KEY) || '{}');
            edited[originalTool.originalIndex] = updatedTool;
            localStorage.setItem(EDITED_TOOLS_KEY, JSON.stringify(edited));
        } else {
            let customTools = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
            customTools[originalTool.customIndex] = updatedTool;
            localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(customTools));
        }
        closeAddToolModal();
        reloadAllTools();
    } else {
        const newTool = { name: nameVal, link: linkVal, category: categoryVal, brief: briefVal, use: useVal, useful: usefulVal };
        try {
            const stored = localStorage.getItem(CUSTOM_TOOLS_KEY);
            const customTools = stored ? JSON.parse(stored) : [];
            customTools.push(newTool);
            localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(customTools));
        } catch (err) { console.error(err); }
        closeAddToolModal();
        reloadAllTools();
    }

    setTimeout(() => {
        const items = document.querySelectorAll('.tool-item');
        let newToolEl = null, foundIndex = 0;
        tools.forEach((t, idx) => { if ((t.name.includes('.') ? t.name.split('.')[1].trim() : t.name.trim()) === nameVal) foundIndex = idx; });
        items.forEach(el => { if (el.innerText === nameVal) newToolEl = el; });
        if (newToolEl) showDetails(foundIndex, newToolEl);
    }, 100);
}

function confirmDeleteTool(index) {
    const tool = tools[index];
    const rawName = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name.trim();
    if (typeof window.tacticalConfirm === 'function') {
        window.tacticalConfirm({
            title: "DELETE CUSTOM TOOL",
            message: `Are you sure you want to delete "${rawName}" from your active tool arsenal?`,
            confirmText: "🗑️ DELETE TOOL",
            cancelText: "CANCEL",
            type: "danger",
            onConfirm: () => deleteTool(index)
        });
    } else {
        deleteTool(index);
    }
}

function deleteTool(index) {
    const tool = tools[index];
    if (tool.originalIndex !== null) {
        let deleted = JSON.parse(localStorage.getItem(DELETED_TOOLS_KEY) || '[]');
        if (!deleted.includes(tool.originalIndex)) { deleted.push(tool.originalIndex); localStorage.setItem(DELETED_TOOLS_KEY, JSON.stringify(deleted)); }
    } else {
        let customTools = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
        customTools.splice(tool.customIndex, 1);
        localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(customTools));
    }
    reloadAllTools();
    document.getElementById('detailsPanel').innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 20vh;"><h3>Select a tool from the menu to view beginner-friendly intelligence data.</h3></div>`;
}

function loadCustomCategories() {
    try {
        const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
        const selectEl = document.getElementById('toolCategory');
        selectEl.innerHTML = `
            <option value="OSINT">🔍 OSINT & Attack Surface</option>
            <option value="Threat-Intel">🛰️ Threat Intelligence</option>
            <option value="Network">🌐 Network & DNS Recon</option>
            <option value="Code-Search">💻 Source Code Search</option>
            <option value="Wireless">📶 Wireless</option>
        `;
        for (const [key, value] of Object.entries(customCats)) {
            const opt = document.createElement('option');
            opt.value = key; opt.innerText = value;
            selectEl.appendChild(opt);
        }
    } catch (e) { console.error(e); }
}

function showNewCategoryForm() {
    document.getElementById('newCategoryGroup').style.display = 'block';
    document.getElementById('newCategoryName').focus();
}

function cancelNewCategory() {
    document.getElementById('newCategoryGroup').style.display = 'none';
    document.getElementById('newCategoryName').value = '';
    document.getElementById('newCategoryIcon').value = '';
}

function saveNewCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    const icon = document.getElementById('newCategoryIcon').value.trim() || "📁";
    if (!name) return;
    const key = name.replace(/\s+/g, '_');
    const displayName = `${icon} ${name}`;
    try {
        const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
        customCats[key] = displayName;
        localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(customCats));
    } catch (e) { console.error(e); }
    loadCustomCategories();
    document.getElementById('toolCategory').value = key;
    cancelNewCategory();
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('addToolModal');
    if (e.target === modal) closeAddToolModal();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAddToolModal();
});

function updateCompletionButton() {
    const isCompleted = localStorage.getItem(MODULE_KEY) === 'true';
    const btn = document.getElementById('completeModuleBtn');
    if (!btn) return;
    if (isCompleted) {
        btn.innerText = "✓ Module Completed";
        btn.classList.add('completed');
    } else {
        btn.innerText = "Mark Module Completed";
        btn.classList.remove('completed');
    }
}

function toggleModuleCompletion() {
    const isCompleted = localStorage.getItem(MODULE_KEY) === 'true';
    localStorage.setItem(MODULE_KEY, !isCompleted);
    updateCompletionButton();
}

// ─── Bootstrap ─────────────────────────────────────────────
loadCustomCategories();
reloadAllTools();
updateCompletionButton();