const keyP1 = "gsk_OCCHNxtXBVzq8";
        const keyP2 = "GdGCu99WGdyb3FY";
        const keyP3 = "sqdvAWM3jBcoxcwJaUrC8EGa";
        const apiKey = keyP1 + keyP2 + keyP3;

        const MODULE_KEY = 'module_vulnanalysis_completed';
        const CUSTOM_TOOLS_KEY = 'vuln_custom_tools';
        const EDITED_TOOLS_KEY = 'vuln_edited_default_tools';
        const DELETED_TOOLS_KEY = 'vuln_deleted_default_indices';
        const CUSTOM_CATS_KEY = 'vuln_custom_categories';

        const defaultTools = [
            // ── General Vulnerability Scanners ─────────────────────
            {
                name: "1. Nessus",
                link: "https://www.tenable.com/products/nessus",
                category: "VulnScanner",
                brief: "The industry-standard vulnerability scanner. After you know what services are running (from Module 03), Nessus checks each one against a database of 180,000+ known vulnerability checks. It tells you not just THAT something might be vulnerable, but exactly which CVE applies, how severe it is, and how to fix it.",
                use: "Run locally at <code>https://localhost:8834</code> after install. Create new scan &rarr; Basic Network Scan &rarr; enter target IP &rarr; Launch. Review results sorted by severity: Critical, High, Medium, Low, Info.",
                useful: "This is the single most important tool in this module. A consultant doing a real pentest runs Nessus first to get an instant prioritized list of exploitable issues, instead of manually researching every software version found during enumeration."
            },
            {
                name: "2. OpenVAS",
                link: "https://www.openvas.org",
                category: "VulnScanner",
                brief: "The free, open-source equivalent of Nessus, maintained by Greenbone. Same core concept — automated scanning against a constantly updated feed of vulnerability tests (NVTs) — but completely free, making it the standard choice for students and budget-limited teams.",
                use: "Install: <code>sudo apt install openvas</code> then <code>sudo gvm-setup</code>. Access at <code>https://127.0.0.1:9392</code>. Create a Task, attach a Target, and Start Scan. Reports export as PDF or CSV.",
                useful: "When Nessus's paid license isn't an option. Same workflow, same value — automated, comprehensive vulnerability scanning that would take days to do manually by hand-checking CVE databases."
            },
            {
                name: "3. Nuclei",
                link: "https://github.com/projectdiscovery/nuclei",
                category: "VulnScanner",
                brief: "A modern, extremely fast vulnerability scanner built around YAML-based templates. Each template describes how to detect ONE specific vulnerability (a CVE, misconfiguration, or exposed panel). The community maintains 9,000+ templates, updated daily — often within hours of a new CVE being published.",
                use: "Scan with all templates: <code>nuclei -u https://target.com</code><br>Scan for specific CVE: <code>nuclei -u https://target.com -t cves/2024/</code><br>Scan a list of URLs: <code>nuclei -list urls.txt -t exposures/</code>",
                useful: "Speed and freshness. Nuclei templates for a brand-new CVE often exist within a day of disclosure — faster than Nessus or OpenVAS plugin updates. Widely used in bug bounty hunting for rapid mass scanning across many targets."
            },
            {
                name: "4. Qualys",
                link: "https://www.qualys.com",
                category: "VulnScanner",
                brief: "An enterprise cloud-based vulnerability management platform. Unlike Nessus or OpenVAS which you install locally, Qualys runs scans from the cloud and gives you a continuous, always-updated risk dashboard across your entire organisation's assets — servers, cloud instances, containers, and endpoints.",
                use: "Accessed through the Qualys web console (subscription-based). Add assets via IP range or agent install. Configure a scan policy, schedule recurring scans, and review the dashboard which auto-prioritizes by exploitability and asset criticality.",
                useful: "Large enterprises with thousands of assets can't manually run Nessus scans one by one. Qualys automates continuous vulnerability management at scale — the kind of tool a SOC (Security Operations Center) relies on daily."
            },
            // ── Web App Vuln Scanners ───────────────────────────────
            {
                name: "5. Nikto",
                link: "https://github.com/sullo/nikto",
                category: "WebVuln",
                brief: "A web server vulnerability scanner focused purely on HTTP/HTTPS. It checks against 6,700+ known dangerous files, outdated server software, and common misconfigurations. It's loud and unstealthy, but extremely fast at catching the obvious mistakes on a web server.",
                use: "Basic scan: <code>nikto -h http://target.com</code><br>Scan with SSL: <code>nikto -h https://target.com -ssl</code><br>Save as HTML report: <code>nikto -h target.com -o report.html -Format htm</code>",
                useful: "The fastest way to catch low-hanging fruit on a web server: an exposed /admin/ panel, an outdated Apache version with known CVEs, or missing security headers. First tool to run against any new web target."
            },
            {
                name: "6. Burp Suite",
                link: "https://portswigger.net/burp",
                category: "WebVuln",
                brief: "The industry-standard web application testing platform. It acts as a proxy between your browser and the target website, letting you intercept, inspect, and modify every request. Its built-in scanner (Pro version) automatically tests for SQL injection, XSS, and dozens of other OWASP Top 10 vulnerabilities.",
                use: "Set browser proxy to Burp (127.0.0.1:8080). Browse the target site normally — Burp logs every request in 'Proxy &rarr; HTTP History'. Right-click any request &rarr; 'Send to Repeater' to manually test modified payloads. Pro users can run 'Scanner' for automated testing.",
                useful: "This is THE tool web app pentesters live in. Manual testing via Repeater lets you craft precise attack payloads for a specific input field, something automated scanners often miss. Essential for serious web application security work."
            },
            {
                name: "7. OWASP ZAP",
                link: "https://www.zaproxy.org",
                category: "WebVuln",
                brief: "The free, open-source alternative to Burp Suite, maintained by OWASP itself. It offers the same core proxy-and-intercept workflow plus a free automated active scanner — Burp's scanner requires the paid Pro license, ZAP's doesn't.",
                use: "Launch ZAP, set browser proxy to 127.0.0.1:8080 (same as Burp). Use 'Quick Start' tab and enter target URL for automated spider + active scan. Or manually browse and inspect requests in the History tab.",
                useful: "Free full-featured alternative when Burp Pro isn't affordable. Many companies use ZAP in CI/CD pipelines for automated security testing on every code deployment since it's scriptable and has a REST API."
            },
            {
                name: "8. SQLmap",
                link: "https://sqlmap.org",
                category: "WebVuln",
                brief: "A fully automated SQL injection detection and exploitation tool. SQL injection happens when user input gets directly inserted into a database query without sanitization. SQLmap finds these flaws and can automatically extract the entire database — table names, columns, even full data dumps including password hashes.",
                use: "Test a URL parameter: <code>sqlmap -u \"http://target.com/page?id=1\"</code><br>Dump database names: <code>sqlmap -u \"http://target.com/page?id=1\" --dbs</code><br>Dump a specific table: <code>sqlmap -u \"http://target.com/page?id=1\" -D dbname -T users --dump</code>",
                useful: "SQL injection remains one of the most damaging web vulnerabilities — a single flaw can expose an entire customer database. SQLmap turns a multi-hour manual exploitation process into a single command."
            },
            // ── CVE & Vulnerability Databases ───────────────────────
            {
                name: "9. NVD (National Vulnerability Database)",
                link: "https://nvd.nist.gov",
                category: "CVEDB",
                brief: "The U.S. government's official, authoritative database of every published CVE (Common Vulnerabilities and Exposures). Every CVE here includes a description, CVSS severity score, affected software versions, and references to patches. This is the ground-truth source that tools like Nessus and Nuclei pull their detection data from.",
                use: "Search by software name: go to nvd.nist.gov, use the search bar with the product name and version, e.g. 'Apache 2.4.49'. Each CVE page shows the CVSS score breakdown and a list of references including patches and exploit writeups.",
                useful: "When a scanner tells you 'CVE-2021-41773 found', NVD is where you go to understand the actual severity, the exact affected versions, and whether a patch exists. You can't responsibly report a finding without reading the NVD entry first."
            },
            {
                name: "10. CVE Details",
                link: "https://www.cvedetails.com",
                category: "CVEDB",
                brief: "A more searchable, browsable front-end built on top of NVD data. It lets you browse vulnerabilities by vendor, product, or year, see vulnerability trend graphs for specific software, and quickly filter by vulnerability type (SQLi, XSS, buffer overflow, etc.) — easier to navigate than the official NVD site.",
                use: "Search a vendor (e.g. 'Microsoft') then a specific product (e.g. 'Windows Server 2019') to see every CVE affecting it, sorted by year and severity. Use the 'Vulnerability Trends' graph to see if a vendor's products are getting more or less secure over time.",
                useful: "Quickly checking the overall security history of a piece of software before deploying it, or seeing exactly how many critical CVEs a specific server version has had — useful for risk assessment reports."
            },
            {
                name: "11. Vulners",
                link: "https://vulners.com",
                category: "CVEDB",
                brief: "An aggregated vulnerability intelligence database that combines CVE data, exploit availability, and even Nmap-compatible scripts in one place. It tells you not just whether a vulnerability exists, but whether a working public exploit is available for it — a critical detail NVD alone doesn't emphasize.",
                use: "Search by CVE ID or product/version directly on vulners.com. Use the Nmap NSE script integration: <code>nmap -sV --script vulners 192.168.1.10</code> automatically cross-references detected service versions against the Vulners database.",
                useful: "The Nmap integration is the killer feature — one scan tells you both what's running AND whether known public exploits exist for it, collapsing two research steps (enumeration + CVE lookup) into one command."
            },
            // ── Exploit Frameworks ──────────────────────────────────
            {
                name: "12. ExploitDB / searchsploit",
                link: "https://www.exploit-db.com",
                category: "ExploitFramework",
                brief: "The largest public archive of proof-of-concept exploit code, maintained by Offensive Security. Searchsploit is the offline command-line tool (pre-installed in Kali) that searches a local mirror of this entire database instantly, without needing internet access.",
                use: "Search by software name: <code>searchsploit apache 2.4.49</code><br>Copy an exploit to current directory: <code>searchsploit -m 41773</code><br>Update local database: <code>searchsploit -u</code>",
                useful: "Once a vulnerability scanner identifies a CVE, searchsploit instantly tells you if a working, ready-to-use exploit already exists for it — turning theoretical risk into a practical, demonstrable attack in seconds."
            },
            {
                name: "13. Metasploit Framework",
                link: "https://www.metasploit.com",
                category: "ExploitFramework",
                brief: "The world's most widely used exploitation framework. It packages thousands of working exploits, payloads, and post-exploitation modules into a single interface. Instead of manually configuring raw exploit code from ExploitDB, Metasploit lets you select a module, set a few parameters, and launch.",
                use: "Launch: <code>msfconsole</code><br>Search for a module: <code>search type:exploit cve:2021-41773</code><br>Select and configure: <code>use exploit/multi/http/apache_normalize_path_rce</code> then <code>set RHOSTS 192.168.1.10</code> then <code>run</code>",
                useful: "Turns a vulnerability finding into proof — actually demonstrating that a CVE is exploitable, not just theoretically present. This is what separates a vulnerability scan from a real penetration test: showing the client real impact, not just a list of CVE numbers."
            },
            {
                name: "14. CVSS Calculator",
                link: "https://www.first.org/cvss/calculator/3.1",
                category: "ExploitFramework",
                brief: "The official Common Vulnerability Scoring System calculator from FIRST.org. CVSS scores (0-10) rank vulnerability severity based on metrics like Attack Vector, Complexity, Privileges Required, and Impact on confidentiality/integrity/availability. This calculator lets you manually compute or verify a score, including environmental adjustments specific to your organisation.",
                use: "Select base metrics: Attack Vector (Network/Adjacent/Local/Physical), Attack Complexity (Low/High), Privileges Required, User Interaction, Scope, and Impact metrics. The calculator outputs the numerical score and severity rating (None/Low/Medium/High/Critical) instantly.",
                useful: "Scanner-reported CVSS scores are generic — they don't account for YOUR specific environment. A critical CVE on an isolated, air-gapped server is genuinely lower risk than the same CVE on an internet-facing server. The Environmental Score lets you re-calculate real-world risk for accurate prioritization."
            },
            {
                name: "15. Vulnerability Management Reporting (DefectDojo)",
                link: "https://github.com/DefectDojo/django-DefectDojo",
                category: "ExploitFramework",
                brief: "An open-source vulnerability management and tracking platform. It ingests scan results from Nessus, OpenVAS, Nuclei, Burp, and dozens of other tools into one unified dashboard, tracks remediation status over time, and helps deduplicate the same finding reported by multiple scanners.",
                use: "Self-host via Docker: <code>git clone https://github.com/DefectDojo/django-DefectDojo && ./dc-build.sh && ./dc-up.sh</code><br>Import scan results (e.g. Nessus XML, Nuclei JSON) into a 'Product' and 'Engagement'. Track findings through the remediation workflow: Open &rarr; Verified &rarr; Fixed.",
                useful: "Real organisations run multiple scanners producing thousands of findings with duplicates and false positives. A centralized platform tracks which vulnerabilities are actually being fixed over time — the operational reality of vulnerability management beyond just running a single scan."
            }
        ];

        let tools = [];
        let editingToolIndex = null;

        function init() {
            const list = document.getElementById('toolList');
            list.innerHTML = '';

            const categories = { "VulnScanner": [], "WebVuln": [], "CVEDB": [], "ExploitFramework": [] };
            const catDisplayNames = {
                "VulnScanner": "🛡️ General Vuln Scanners",
                "WebVuln": "🌐 Web App Vuln Scanners",
                "CVEDB": "📋 CVE & Vuln Databases",
                "ExploitFramework": "💥 Exploit Frameworks"
            };

            try {
                const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                for (const [k, v] of Object.entries(customCats)) { categories[k] = []; catDisplayNames[k] = v; }
            } catch (e) { console.error(e); }

            tools.forEach((tool, index) => {
                const cat = tool.category || "VulnScanner";
                if (categories[cat]) categories[cat].push({ tool, index });
                else categories["VulnScanner"].push({ tool, index });
            });

            for (const [catName, catTools] of Object.entries(categories)) {
                if (catTools.length === 0) continue;
                const h = document.createElement('div');
                h.className = 'category-header';
                h.innerText = catDisplayNames[catName];
                list.appendChild(h);
                catTools.forEach(({ tool, index }) => {
                    const div = document.createElement('div');
                    div.className = 'tool-item';
                    div.innerText = tool.name.split('.')[1]?.trim() || tool.name;
                    div.onclick = () => showDetails(index, div);
                    list.appendChild(div);
                });
            }

            if (apiKey.includes("YOUR_MIDDLE_PART")) {
                document.getElementById('statusDot').classList.remove('online');
                addBotMessage("⚠️ API key not configured. Update keyP1/keyP2/keyP3 in the HTML.");
            }
        }

        function reloadAllTools() {
            tools = defaultTools.map((t, idx) => ({ ...t, originalIndex: idx }));
            try {
                const del = JSON.parse(localStorage.getItem(DELETED_TOOLS_KEY) || '[]');
                tools = tools.filter(t => !del.includes(t.originalIndex));
            } catch (e) { }
            try {
                const edited = JSON.parse(localStorage.getItem(EDITED_TOOLS_KEY) || '{}');
                tools.forEach(t => { if (edited[t.originalIndex]) Object.assign(t, edited[t.originalIndex]); });
            } catch (e) { }
            loadCustomTools();
            init();
        }

        function showDetails(index, element) {
            document.querySelectorAll('.tool-item').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
            const tool = tools[index];
            const catClass = `badge-${tool.category.toLowerCase()}`;
            const displayCatName = tool.category.replace(/_/g, ' ');
            document.getElementById('detailsPanel').innerHTML = `
                <div class="card">
                    <h1 style="display:flex;justify-content:space-between;align-items:center;width:100%;">
                        <span>${tool.name.split('.')[1]?.trim() || tool.name}<span class="badge ${catClass}">${displayCatName}</span></span>
                        <div style="display:flex;gap:8px;align-items:center;">
                            <button class="btn btn-edit-tool" onclick="openEditToolModal(${index})" style="font-size:0.8rem;padding:6px 12px;">✏️ Edit</button>
                            <button class="btn btn-delete-tool" onclick="confirmDeleteTool(${index})" style="font-size:0.8rem;padding:6px 12px;">🗑️ Delete</button>
                            <a href="${tool.link}" target="_blank" style="font-size:0.8rem;padding:6px 12px;">Launch ↗</a>
                        </div>
                    </h1>
                    <div class="section-label">Simply Explained (What is it?)</div>
                    <div class="section-content">${tool.brief}</div>
                    <div class="section-label">How to actually use it</div>
                    <div class="section-content">${tool.use}</div>
                    <div class="section-label">Why Hackers care about this</div>
                    <div class="section-content">${tool.useful}</div>
                </div>`;
            if (window.innerWidth <= 768) switchMobileTab('details');
        }

        function handleEnter(e) { if (e.key === 'Enter') sendMessage(); }

        async function sendMessage() {
            const inputEl = document.getElementById('chatInput');
            const msg = inputEl.value.trim();
            if (!msg) return;
            addUserMessage(msg);
            inputEl.value = '';

            if (!apiKey || apiKey.includes("YOUR_MIDDLE_PART")) {
                setTimeout(() => addBotMessage("❌ Missing Groq API Key. Edit keyP1/keyP2/keyP3."), 500);
                return;
            }

            const toolsContext = tools.map(t => `${t.name.split('.')[1]?.trim() || t.name}: ${t.brief}`).join(" | ");
            const systemPrompt = `You are a focused cybersecurity assistant specialising in MODULE 04: Vulnerability Analysis. Your primary topics are: CVE identification, CVSS scoring (base, temporal, environmental metrics), vulnerability scanning methodology, exploit-vulnerability matching, risk prioritization, patch management, and tools like Nessus, OpenVAS, Nuclei, Nikto, ExploitDB, and the National Vulnerability Database (NVD).

Answer questions on these topics directly and in beginner-friendly language using analogies where helpful. You can answer general cybersecurity questions outside this scope too — but briefly connect them back to vulnerability analysis concepts where relevant.

Key distinction to always explain when relevant: Enumeration (Module 03) finds WHO and WHAT is running on a target. Vulnerability Analysis (Module 04) determines WHICH of those things are actually exploitable — by matching software versions against known CVEs and scoring the real-world risk.

When writing commands, ALWAYS use markdown fenced code blocks (\`\`\`bash) or inline backticks.

Tool context for this module: ${toolsContext}.

Be direct, no fluff, never vague.`;

            const loadingId = "load-" + Date.now();
            try {
                showTypingIndicator(loadingId);
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: "llama-3.1-8b-instant",
                        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msg }]
                    })
                });
                const data = await response.json();
                document.getElementById(loadingId)?.remove();
                if (data.error) addBotMessage(`Groq API Error: ${data.error.message}`);
                else addBotMessage(formatMarkdown(data.choices[0].message.content));
            } catch (error) {
                document.getElementById(loadingId)?.remove();
                addBotMessage(`Network Error: Failed to reach Groq API.`);
            }
        }

        function formatMarkdown(text) {
            let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => `<pre><code class="language-${lang}">${code.trim()}</code></pre>`);
            html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            let lines = html.split('\n'); let inList = false;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    const content = line.substring(2);
                    lines[i] = inList ? `<li>${content}</li>` : `<ul><li>${content}</li>`;
                    inList = true;
                } else { if (inList) { lines[i] = '</ul>' + lines[i]; inList = false; } }
            }
            if (inList) lines[lines.length - 1] += '</ul>';
            html = lines.join('\n').replace(/\n/g, '<br>');
            html = html.replace(/<\/pre><br>/g, '</pre>').replace(/<\/ul><br>/g, '</ul>').replace(/<\/li><br>/g, '</li>').replace(/<ul><br>/g, '<ul>');
            return html;
        }

        function showTypingIndicator(id) {
            const h = document.getElementById('chatHistory');
            h.innerHTML += `<div class="msg bot typing-indicator" id="${id}"><span></span><span></span><span></span></div>`;
            h.scrollTop = h.scrollHeight;
        }
        function addUserMessage(text) { const h = document.getElementById('chatHistory'); h.innerHTML += `<div class="msg user">${text}</div>`; h.scrollTop = h.scrollHeight; }
        function addBotMessage(text) { const h = document.getElementById('chatHistory'); h.innerHTML += `<div class="msg bot">${text}</div>`; h.scrollTop = h.scrollHeight; }

        function switchMobileTab(tabId) {
            document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId)));
            document.body.className = document.body.className.replace(/\btab-\w+\b/g, '').trim();
            document.body.classList.add('tab-' + tabId);
        }

        function updateCompletionButton() {
            const btn = document.getElementById('completeModuleBtn');
            if (!btn) return;
            const done = localStorage.getItem(MODULE_KEY) === 'true';
            btn.innerText = done ? "✓ Module Completed" : "Mark Module Completed";
            btn.classList.toggle('completed', done);
        }
        function toggleModuleCompletion() {
            localStorage.setItem(MODULE_KEY, !(localStorage.getItem(MODULE_KEY) === 'true'));
            updateCompletionButton();
        }

        function openAddToolModal() {
            editingToolIndex = null;
            document.querySelector('#addToolModal h3').innerText = "Add Custom Tool";
            document.querySelector('#addToolForm button[type="submit"]').innerText = "Add Tool";
            document.getElementById('addToolForm').reset();
            cancelNewCategory(); loadCustomCategories();
            const modal = document.getElementById('addToolModal');
            modal.style.display = 'flex'; modal.offsetHeight; modal.classList.add('active');
            document.getElementById('toolName').focus();
        }

        function openEditToolModal(index) {
            editingToolIndex = index;
            const tool = tools[index];
            document.querySelector('#addToolModal h3').innerText = "Edit Tool Info";
            document.querySelector('#addToolForm button[type="submit"]').innerText = "Save Changes";
            document.getElementById('addToolForm').reset();
            cancelNewCategory(); loadCustomCategories();
            document.getElementById('toolName').value = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name.trim();
            document.getElementById('toolLink').value = tool.link;
            document.getElementById('toolCategory').value = tool.category;
            document.getElementById('toolBrief').value = tool.brief;
            document.getElementById('toolUse').value = tool.use;
            document.getElementById('toolUseful').value = tool.useful;
            const modal = document.getElementById('addToolModal');
            modal.style.display = 'flex'; modal.offsetHeight; modal.classList.add('active');
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
                    JSON.parse(stored).forEach((tool, idx) => {
                        const match = tool.name.match(/^\d+\.\s*(.*)$/);
                        tool.name = `${tools.length + 1}. ${match ? match[1] : tool.name}`;
                        tool.originalIndex = null; tool.customIndex = idx;
                        tools.push(tool);
                    });
                }
            } catch (e) { console.error(e); }
        }

        function submitNewTool(e) {
            e.preventDefault();
            const vals = { name: document.getElementById('toolName').value.trim(), link: document.getElementById('toolLink').value.trim(), category: document.getElementById('toolCategory').value, brief: document.getElementById('toolBrief').value.trim(), use: document.getElementById('toolUse').value.trim(), useful: document.getElementById('toolUseful').value.trim() };

            if (editingToolIndex !== null) {
                const orig = tools[editingToolIndex];
                if (orig.originalIndex !== null) {
                    const edited = JSON.parse(localStorage.getItem(EDITED_TOOLS_KEY) || '{}');
                    edited[orig.originalIndex] = vals;
                    localStorage.setItem(EDITED_TOOLS_KEY, JSON.stringify(edited));
                } else {
                    const ct = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
                    ct[orig.customIndex] = vals;
                    localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(ct));
                }
            } else {
                const ct = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
                ct.push(vals);
                localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(ct));
            }

            closeAddToolModal(); reloadAllTools();
            setTimeout(() => {
                let foundIndex = 0, newToolEl = null;
                tools.forEach((t, idx) => { if ((t.name.includes('.') ? t.name.split('.')[1].trim() : t.name.trim()) === vals.name) foundIndex = idx; });
                document.querySelectorAll('.tool-item').forEach(el => { if (el.innerText === vals.name) newToolEl = el; });
                if (newToolEl) showDetails(foundIndex, newToolEl);
            }, 100);
        }

        function confirmDeleteTool(index) {
            const rawName = tools[index].name.includes('.') ? tools[index].name.split('.')[1].trim() : tools[index].name.trim();
            if (confirm(`Delete "${rawName}"?`)) deleteTool(index);
        }

        function deleteTool(index) {
            const tool = tools[index];
            if (tool.originalIndex !== null) {
                const del = JSON.parse(localStorage.getItem(DELETED_TOOLS_KEY) || '[]');
                if (!del.includes(tool.originalIndex)) { del.push(tool.originalIndex); localStorage.setItem(DELETED_TOOLS_KEY, JSON.stringify(del)); }
            } else {
                const ct = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
                ct.splice(tool.customIndex, 1);
                localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(ct));
            }
            reloadAllTools();
            document.getElementById('detailsPanel').innerHTML = `<div style="text-align:center;color:var(--text-muted);margin-top:20vh;"><h3>Select a tool from the menu to view beginner-friendly intelligence data.</h3></div>`;
        }

        function loadCustomCategories() {
            try {
                const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                const sel = document.getElementById('toolCategory');
                sel.innerHTML = `
                    <option value="VulnScanner">🛡️ General Vuln Scanners</option>
                    <option value="WebVuln">🌐 Web App Vuln Scanners</option>
                    <option value="CVEDB">📋 CVE & Vuln Databases</option>
                    <option value="ExploitFramework">💥 Exploit Frameworks</option>`;
                for (const [k, v] of Object.entries(customCats)) {
                    const opt = document.createElement('option');
                    opt.value = k; opt.innerText = v; sel.appendChild(opt);
                }
            } catch (e) { }
        }

        function showNewCategoryForm() { document.getElementById('newCategoryGroup').style.display = 'block'; document.getElementById('newCategoryName').focus(); }
        function cancelNewCategory() { document.getElementById('newCategoryGroup').style.display = 'none'; document.getElementById('newCategoryName').value = ''; document.getElementById('newCategoryIcon').value = ''; }
        function saveNewCategory() {
            const name = document.getElementById('newCategoryName').value.trim();
            const icon = document.getElementById('newCategoryIcon').value.trim() || "📁";
            if (!name) return;
            const key = name.replace(/\s+/g, '_');
            try {
                const cc = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                cc[key] = `${icon} ${name}`; localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(cc));
            } catch (e) { }
            loadCustomCategories(); document.getElementById('toolCategory').value = key; cancelNewCategory();
        }

        window.addEventListener('click', e => { if (e.target === document.getElementById('addToolModal')) closeAddToolModal(); });
        window.addEventListener('keydown', e => { if (e.key === 'Escape') closeAddToolModal(); });

        // Tab switching
        function switchPanelTab(tabId) {
            document.querySelectorAll('.chat-panel .tab-content').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.chat-panel .panel-tab').forEach(btn => btn.classList.remove('active'));
            
            if (tabId === 'chat') {
                document.getElementById('chatTabContent').style.display = 'flex';
            } else if (tabId === 'terminal') {
                document.getElementById('terminalTabContent').style.display = 'flex';
                document.getElementById('terminalInput').focus();
            } else if (tabId === 'quiz') {
                document.getElementById('quizTabContent').style.display = 'flex';
            }
            
            // Set active button style
            const tabBtn = Array.from(document.querySelectorAll('.chat-panel .panel-tab')).find(btn => btn.innerText.toLowerCase().includes(tabId));
            if (tabBtn) tabBtn.classList.add('active');
        }

        // Terminal logic
        function handleTerminalEnter(event) {
            if (event.key === 'Enter') {
                const inputEl = document.getElementById('terminalInput');
                const cmd = inputEl.value.trim();
                if (!cmd) return;
                
                // Add to terminal output
                const outEl = document.getElementById('terminalOutput');
                outEl.innerHTML += `<div><span style="color: #34d399;">guest@cyberx:~$</span> ${cmd}</div>`;
                
                // Run mock command
                runMockTerminalCommand(cmd);
                
                inputEl.value = '';
                outEl.scrollTop = outEl.scrollHeight;
            }
        }

        function runMockTerminalCommand(cmd) {
            const outEl = document.getElementById('terminalOutput');
            const cleanCmd = cmd.toLowerCase().trim();
            const parts = cleanCmd.split(/\s+/);
            const baseCmd = parts[0];

            if (baseCmd === 'clear') {
                outEl.innerHTML = '';
                return;
            }

            if (baseCmd === 'help') {
                outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                    Available commands:<br>
                    - <span style="color: #fbbf24;">nessus</span>: Run mock Nessus network scan<br>
                    - <span style="color: #fbbf24;">nikto -h [host]</span>: Scan web server for vulnerabilities<br>
                    - <span style="color: #fbbf24;">nmap --script vuln [ip]</span>: Test for CVE vulnerabilities<br>
                    - <span style="color: #fbbf24;">nuclei -u [url]</span>: Run rapid YAML template vulnerability scan<br>
                    - <span style="color: #fbbf24;">clear</span>: Clear screen<br>
                    - <span style="color: #fbbf24;">help</span>: Show this menu
                </div>`;
                return;
            }

            if (baseCmd === 'nessus') {
                outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                    [*] Initializing Nessus v8.15.2 Agent...<br>
                    [*] Target: 10.0.0.5 (Windows Server 2012 R2)<br>
                    [*] Loading plugin database (20260630)...<br>
                    [*] Executing basic network scan templates...<br>
                    ---------------------------------------------------<br>
                    [+] Scan Complete! Results:<br>
                    - <span style="color: #ef4444; font-weight: bold;">[CRITICAL] MS17-010: Remote SMB Code Execution</span> (EternalBlue)<br>
                    - <span style="color: #f59e0b;">[HIGH] SSL/TLS Outdated Version Enabled</span> (TLS 1.0)<br>
                    - <span style="color: #3b82f6;">[MEDIUM] SMB Signing Not Required</span><br>
                    - <span style="color: #3b82f6;">[MEDIUM] Remote Remote Desktop Protocol Warning</span>
                </div>`;
                return;
            }

            if (baseCmd === 'nikto' || cleanCmd.startsWith('nikto ')) {
                if (cleanCmd.includes('-h')) {
                    outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                        - Nikto v2.1.6<br>
                        ---------------------------------------------------<br>
                        + Target IP: 10.0.0.5<br>
                        + Target Hostname: target.com<br>
                        + Target Port: 80<br>
                        ---------------------------------------------------<br>
                        + Server: Apache/2.4.41 (Ubuntu)<br>
                        + The anti-clickjacking X-Frame-Options header is not present.<br>
                        + The X-XSS-Protection header is not defined.<br>
                        + The X-Content-Type-Options header is not set.<br>
                        + Allowed HTTP Methods: GET, HEAD, POST, OPTIONS<br>
                        + OSVDB-3092: /admin/: Admin page folder discovered.
                    </div>`;
                } else {
                    outEl.innerHTML += `<div style="color: #ef4444;">Usage: nikto -h http://target.com</div>`;
                }
                return;
            }

            if (baseCmd === 'nmap' || cleanCmd.startsWith('nmap ')) {
                if (cleanCmd.includes('--script vuln')) {
                    outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                        Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-30 08:24<br>
                        Nmap scan report for 10.0.0.5<br>
                        Host is up (0.045s latency).<br>
                        PORT    STATE SERVICE<br>
                        445/tcp open  microsoft-ds<br>
                        |_smb-vuln-ms17-010: <span style="color: #ef4444; font-weight: bold;">VULNERABLE (EternalBlue)</span><br>
                        |   State: VULNERABLE<br>
                        |   IDs:  CVE:CVE-2017-0144<br>
                        |   Risk factor: High<br>
                        |_  Description: Remote code execution in Microsoft SMBv1 servers.<br>
                        3389/tcp open ms-wbt-server<br>
                        |_rdp-vuln-ms12-020: Not Vulnerable
                    </div>`;
                } else {
                    outEl.innerHTML += `<div style="color: #ef4444;">Usage: nmap --script vuln [ip]</div>`;
                }
                return;
            }

            if (baseCmd === 'nuclei' || cleanCmd.startsWith('nuclei ')) {
                if (cleanCmd.includes('-u')) {
                    outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                        [2026-06-30 08:24:59] [INFO] Loaded 1547 templates<br>
                        [2026-06-30 08:25:01] [git-config] [http] [info] http://target.com/.git/config<br>
                        [2026-06-30 08:25:02] [path-traversal] [http] [high] http://target.com/index.php?file=../../../../etc/passwd<br>
                        [2026-06-30 08:25:03] [admin-panel] [http] [info] http://target.com/admin/login.php
                    </div>`;
                } else {
                    outEl.innerHTML += `<div style="color: #ef4444;">Usage: nuclei -u [url]</div>`;
                }
                return;
            }

            outEl.innerHTML += `<div style="color: #ef4444;">Command not found: ${baseCmd}. Type 'help' for options.</div>`;
        }

        // Quiz State Management
        function checkQuizAnswer(questionId, correctLetter) {
            const selected = document.querySelector(`input[name="q${questionId}"]:checked`);
            if (!selected) return;
            
            // Save selection to localStorage
            localStorage.setItem(`vuln_quiz_q${questionId}`, selected.value);
            
            // Check overall status
            verifyQuizCompletion();
        }

        function verifyQuizCompletion() {
            const answers = {
                q1: localStorage.getItem('vuln_quiz_q1'),
                q2: localStorage.getItem('vuln_quiz_q2'),
                q3: localStorage.getItem('vuln_quiz_q3')
            };

            const isCorrect = answers.q1 === 'A' && answers.q2 === 'C' && answers.q3 === 'B';
            const msgEl = document.getElementById('quizCompletionMsg');
            if (isCorrect) {
                if (msgEl) msgEl.style.display = 'block';
                localStorage.setItem('vuln_quiz_completed', 'true');
            } else {
                if (msgEl) msgEl.style.display = 'none';
                localStorage.setItem('vuln_quiz_completed', 'false');
            }
        }

        function loadQuizStatus() {
            const q1 = localStorage.getItem('vuln_quiz_q1');
            const q2 = localStorage.getItem('vuln_quiz_q2');
            const q3 = localStorage.getItem('vuln_quiz_q3');

            if (q1) {
                const el = document.querySelector(`input[name="q1"][value="${q1}"]`);
                if (el) el.checked = true;
            }
            if (q2) {
                const el = document.querySelector(`input[name="q2"][value="${q2}"]`);
                if (el) el.checked = true;
            }
            if (q3) {
                const el = document.querySelector(`input[name="q3"][value="${q3}"]`);
                if (el) el.checked = true;
            }

            verifyQuizCompletion();
        }

        loadCustomCategories();
        reloadAllTools();
        updateCompletionButton();
        loadQuizStatus();