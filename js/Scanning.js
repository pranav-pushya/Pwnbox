// ==========================================
        // API KEY — replace with your Groq key parts
        // ==========================================
        const keyP1 = "gsk_OCCHNxtXBVzq8";
        const keyP2 = "GdGCu99WGdyb3FY";
        const keyP3 = "sqdvAWM3jBcoxcwJaUrC8EGa";
        const apiKey = keyP1 + keyP2 + keyP3;
        // ==========================================

        // localStorage key is module-specific so progress doesn't bleed between modules
        const MODULE_KEY = 'module_scanning_completed';
        const CUSTOM_TOOLS_KEY = 'scanning_custom_tools';
        const EDITED_TOOLS_KEY = 'scanning_edited_default_tools';
        const DELETED_TOOLS_KEY = 'scanning_deleted_default_indices';
        const CUSTOM_CATS_KEY = 'scanning_custom_categories';

        const defaultTools = [
            // ─── Port Scanners ─────────────────────────────────────
            {
                name: "1. Nmap",
                link: "https://nmap.org",
                category: "PortScan",
                brief: "The grandfather of network scanning. Think of a building with 65,535 doors (ports) — Nmap knocks on every one to see which doors are unlocked and what service is sitting behind them. It runs on every OS and is the first tool every pentester opens.",
                use: "Basic scan: <code>nmap 192.168.1.1</code><br>Scan all ports: <code>nmap -p- 192.168.1.1</code><br>Detect OS and service versions: <code>nmap -A 192.168.1.1</code><br>Stealth SYN scan (requires root): <code>nmap -sS 192.168.1.1</code>",
                useful: "It tells you exactly what is running on a machine before you attack it. An open port 3306 means MySQL database is exposed. Open 22 means SSH login is possible. It is the map you use before entering enemy territory."
            },
            {
                name: "2. Masscan",
                link: "https://github.com/robertdavidgraham/masscan",
                category: "PortScan",
                brief: "Nmap on steroids for speed. It can scan the entire internet's 4 billion IP addresses in under 6 minutes. It only does port discovery — not service fingerprinting — but it does that job at insane speed.",
                use: "In terminal: <code>masscan -p1-65535 192.168.1.0/24 --rate=10000</code><br>The <code>--rate</code> flag controls packets per second. Use lower rates on slow networks or you'll crash your router.",
                useful: "When you need to quickly find every machine on a large network that has a specific port open. Red teamers use it to map entire corporate IP ranges in minutes before doing detailed Nmap scans on interesting hosts."
            },
            {
                name: "3. RustScan",
                link: "https://github.com/RustScan/RustScan",
                category: "PortScan",
                brief: "A modern, ultra-fast port scanner built in Rust that pipes results directly into Nmap. It scans all 65,535 ports in about 3 seconds, then automatically hands the open ports to Nmap for deep analysis. Best of both worlds.",
                use: "Install via Docker: <code>docker pull rustscan/rustscan:2.1.1</code><br>Scan and pipe to Nmap: <code>rustscan -a 192.168.1.1 -- -A -sV</code><br>Everything after <code>--</code> is passed directly to Nmap.",
                useful: "Cuts your recon time from 20 minutes to 30 seconds on a target. It finds the open ports instantly, then Nmap does the deep fingerprinting. Used heavily in CTF competitions and fast engagements."
            },
            {
                name: "4. Angry IP Scanner",
                link: "https://angryip.org",
                category: "PortScan",
                brief: "A beginner-friendly GUI-based scanner. No terminal needed. You give it an IP range and it pings every address to tell you which machines are alive, their hostnames, and open ports. Think of it as a visual version of Nmap for beginners.",
                use: "Open the app. Enter IP range like <code>192.168.1.1 - 192.168.1.254</code>. Click Start. Green = alive host. Click any host to see open ports. Export results to CSV or XML.",
                useful: "Perfect for a quick network audit when you need to see every live device on a local network without memorizing command flags. Good for identifying printers, routers, and IoT devices that shouldn't be there."
            },
            // ─── Network Mappers ───────────────────────────────────
            {
                name: "5. Zenmap",
                link: "https://nmap.org/zenmap/",
                category: "NetworkMapper",
                brief: "The official GUI front-end for Nmap. It gives you a visual, point-and-click interface where you can run scans and see the results as interactive network topology diagrams. The underlying engine is 100% Nmap.",
                use: "Open Zenmap, enter target IP, choose a scan profile (Intense scan, Quick scan, etc.) and click Scan. After completion, click 'Topology' tab to see a visual map of discovered hosts and their connections.",
                useful: "Great for learning Nmap commands — it shows the exact command it runs. Also useful for presenting network diagrams to clients after a pentest engagement."
            },
            {
                name: "6. Netdiscover",
                link: "https://github.com/netdiscover-scanner/netdiscover",
                category: "NetworkMapper",
                brief: "A passive/active ARP scanner. ARP is the protocol computers use to say 'who has this IP address?' Netdiscover listens to that traffic or actively sends ARP requests to map every live device on a local network — even ones that block ICMP pings.",
                use: "Passive mode (just listen): <code>netdiscover -p</code><br>Active scan a range: <code>netdiscover -r 192.168.1.0/24</code><br>It shows IP, MAC address, and manufacturer of every discovered device.",
                useful: "Works where ping scans fail. Firewalls block ICMP, but they can't block ARP (it's fundamental to how networks work). So you find hidden hosts that Nmap misses."
            },
            {
                name: "7. Fping",
                link: "https://fping.org",
                category: "NetworkMapper",
                brief: "A faster, scriptable version of the standard ping command. Where regular ping checks one host at a time, fping checks hundreds simultaneously and outputs results in a format easy to parse with scripts.",
                use: "Ping an entire subnet: <code>fping -a -g 192.168.1.0/24 2>/dev/null</code><br>The <code>-a</code> flag shows only alive hosts. Pipe the output into a file for use in other tools.",
                useful: "The first step of any network scan — identify which IPs are alive before wasting time scanning dead ones. Used in automation scripts to quickly generate a list of live targets."
            },
            {
                name: "8. Unicornscan",
                link: "https://github.com/dnewman/unicornscan",
                category: "NetworkMapper",
                brief: "An asynchronous port scanner designed for speed and statistical analysis. It separates the sending and receiving of packets into different processes, which makes it uniquely fast on high-speed networks and allows more accurate fingerprinting.",
                use: "TCP scan: <code>unicornscan -mT 192.168.1.1:1-65535</code><br>UDP scan: <code>unicornscan -mU 192.168.1.1:1-1024</code><br>Results include response time statistics.",
                useful: "Used when you need UDP scanning at speed — Nmap's UDP scan is painfully slow. Unicornscan handles UDP much faster, which matters for finding exposed DNS, SNMP, and NTP services."
            },
            // ─── Vulnerability Scanners ────────────────────────────
            {
                name: "9. Nessus",
                link: "https://www.tenable.com/products/nessus",
                category: "VulnScanner",
                brief: "The industry-standard vulnerability scanner used by professional pentesters and security teams worldwide. After mapping open ports, Nessus probes each service to find known CVEs, misconfigurations, default credentials, and missing patches. Think of it as a doctor doing a full checkup on a machine.",
                use: "Install Nessus on your machine, open browser to <code>https://localhost:8834</code>. Create a new scan, enter the target IP, choose a scan template (Basic Network Scan), and click Launch. Review the severity-ranked vulnerability report.",
                useful: "It saves hundreds of hours of manual checking. Instead of you looking up every CVE for every service version, Nessus does it automatically and ranks findings by CVSS severity score. Enterprise security teams run this weekly."
            },
            {
                name: "10. OpenVAS",
                link: "https://www.openvas.org",
                category: "VulnScanner",
                brief: "The free, open-source alternative to Nessus. It's part of the Greenbone Vulnerability Management platform. Constantly updated with 50,000+ vulnerability tests. Less polished than Nessus but completely free and just as powerful.",
                use: "In Kali: <code>sudo apt install openvas</code> then <code>sudo gvm-setup</code>. Access via browser at <code>https://127.0.0.1:9392</code>. Create a scan task, set target, and launch. Reports are downloadable as PDF.",
                useful: "When you can't afford Nessus. Identical concept — automated vulnerability scanning against a target. Standard tool for budget-conscious pentesters and home lab practice."
            },
            {
                name: "11. Nikto",
                link: "https://github.com/sullo/nikto",
                category: "VulnScanner",
                brief: "A web server scanner focused specifically on HTTP. It checks a website's server for 6,700+ dangerous files, outdated software versions, misconfigurations, and security headers that are missing. Not stealthy at all — it's loud — but extremely thorough.",
                use: "Basic scan: <code>nikto -h http://target.com</code><br>Scan specific port: <code>nikto -h 192.168.1.1 -p 8080</code><br>Save report: <code>nikto -h target.com -o report.html -Format htm</code>",
                useful: "Quickly finding low-hanging fruit on a web server. If a server runs Apache 2.2 (outdated) or exposes /phpmyadmin/ or /admin/, Nikto will catch it in minutes. First web recon tool to run."
            },
            // ─── Traffic Analysis ──────────────────────────────────
            {
                name: "12. Wireshark",
                link: "https://www.wireshark.org",
                category: "TrafficAnalysis",
                brief: "The world's most popular network protocol analyzer. It captures every single packet travelling through your network interface and lets you inspect them in detail. If data is transmitted unencrypted, Wireshark can read it — including passwords, cookies, and file transfers.",
                use: "Open Wireshark, select your network interface (eth0 or wlan0), click the blue shark fin to start capture. Use display filters to isolate traffic: <code>http</code> shows web traffic, <code>tcp.port == 22</code> shows SSH. Stop and analyze.",
                useful: "Catching credentials sent over unencrypted protocols like HTTP, FTP, or Telnet. In a penetration test after getting on a network, running Wireshark for 10 minutes often reveals passwords in cleartext from other devices on the same network."
            },
            {
                name: "13. tcpdump",
                link: "https://www.tcpdump.org",
                category: "TrafficAnalysis",
                brief: "The command-line version of Wireshark. Lighter, faster, and scriptable. It captures network packets and either displays them live or saves them to a .pcap file for later analysis in Wireshark. Essential for servers where you can't install a GUI.",
                use: "Capture all traffic on eth0: <code>tcpdump -i eth0</code><br>Capture and save to file: <code>tcpdump -i eth0 -w capture.pcap</code><br>Filter by host: <code>tcpdump -i eth0 host 192.168.1.50</code><br>Filter HTTP traffic: <code>tcpdump -i eth0 port 80</code>",
                useful: "Running on a compromised server to silently capture traffic. Attackers use it to harvest credentials from unencrypted services. Defenders use it to catch suspicious traffic patterns during incident response."
            },
            {
                name: "14. Netcat",
                link: "https://nmap.org/ncat/",
                category: "TrafficAnalysis",
                brief: "Called the 'Swiss Army knife' of networking. It reads and writes raw data across network connections using TCP or UDP. It can act as a client, a server, a port scanner, a file transfer tool, and most famously — a backdoor shell. It does one thing: move data across the network.",
                use: "Banner grabbing (what software is running on a port): <code>nc 192.168.1.1 80</code> then type <code>HEAD / HTTP/1.0</code><br>Listen for incoming connection: <code>nc -lvp 4444</code><br>Connect to listener: <code>nc 192.168.1.1 4444</code>",
                useful: "The go-to tool for reverse shells. After exploiting a machine, attackers use Netcat to create a persistent connection back to their machine. Also used for banner grabbing to identify exact software versions without a full scanner."
            },
            {
                name: "15. Hping3",
                link: "http://www.hping.org",
                category: "TrafficAnalysis",
                brief: "A command-line packet crafting tool. Where regular ping sends standard ICMP packets, hping3 lets you build custom packets with any protocol (TCP, UDP, ICMP), any port, any flags. You can simulate attacks, test firewall rules, or do advanced OS fingerprinting.",
                use: "TCP SYN ping (bypass ICMP blocks): <code>hping3 -S -p 80 192.168.1.1</code><br>Traceroute using TCP: <code>hping3 --traceroute -V -S -p 80 192.168.1.1</code><br>Simple DoS test (don't use on real targets): <code>hping3 -S --flood -V -p 80 192.168.1.1</code>",
                useful: "Testing if a firewall is blocking specific packet types. If ICMP ping is blocked but a TCP SYN to port 80 gets a response, the host is alive. Also used to test IDS/IPS rules by crafting packets that should trigger alerts."
            }
        ];

        let tools = [];
        let editingToolIndex = null;

        // ─── Core Init ─────────────────────────────────────────────

        function init() {
            const list = document.getElementById('toolList');
            list.innerHTML = '';

            const categories = {
                "PortScan": [],
                "NetworkMapper": [],
                "VulnScanner": [],
                "TrafficAnalysis": []
            };

            const catDisplayNames = {
                "PortScan": "🔌 Port Scanners",
                "NetworkMapper": "🗺️ Network Mappers",
                "VulnScanner": "⚠️ Vulnerability Scanners",
                "TrafficAnalysis": "📡 Traffic Analysis"
            };

            try {
                const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                for (const [key, value] of Object.entries(customCats)) {
                    categories[key] = [];
                    catDisplayNames[key] = value;
                }
            } catch (e) { console.error(e); }

            tools.forEach((tool, index) => {
                const cat = tool.category || "PortScan";
                if (categories[cat]) {
                    categories[cat].push({ tool, index });
                } else {
                    categories["PortScan"].push({ tool, index });
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
                    div.innerText = tool.name.split('.')[1]?.trim() || tool.name;
                    div.onclick = () => showDetails(index, div);
                    list.appendChild(div);
                });
            }

            if (apiKey.includes("YOUR_MIDDLE_PART")) {
                document.getElementById('statusDot').classList.remove('online');
                addBotMessage("⚠️ WARNING: API key not configured. Open the HTML file and update keyP1, keyP2, keyP3.");
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

        // ─── Details Panel ─────────────────────────────────────────

        function showDetails(index, element) {
            document.querySelectorAll('.tool-item').forEach(el => el.classList.remove('active'));
            element.classList.add('active');

            const tool = tools[index];
            const catClass = `badge-${tool.category.toLowerCase()}`;
            const displayCatName = tool.category.replace(/_/g, ' ');

            document.getElementById('detailsPanel').innerHTML = `
                <div class="card">
                    <h1 style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <span>${tool.name.split('.')[1]?.trim() || tool.name}<span class="badge ${catClass}">${displayCatName}</span></span>
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

            if (window.innerWidth <= 768) switchMobileTab('details');
        }

        // ─── Chat / AI ─────────────────────────────────────────────

        function handleEnter(e) { if (e.key === 'Enter') sendMessage(); }

        async function sendMessage() {
            const inputEl = document.getElementById('chatInput');
            const msg = inputEl.value.trim();
            if (!msg) return;

            addUserMessage(msg);
            inputEl.value = '';

            if (!apiKey || apiKey.includes("YOUR_MIDDLE_PART")) {
                setTimeout(() => addBotMessage("❌ ERROR: Missing Groq API Key. Edit the HTML file to add your split key."), 500);
                return;
            }

            const toolsContext = tools.map(t => `${t.name.split('.')[1]?.trim() || t.name}: ${t.brief}`).join(" | ");

            const systemPrompt = `You are a focused cybersecurity assistant specialising in MODULE 02: Scanning Networks. Your primary topics are: network port scanning, TCP/UDP protocols, host discovery, banner grabbing, vulnerability scanning, OS fingerprinting, traffic analysis, and the use of tools like Nmap, Masscan, Wireshark, Nessus, and Netcat.

You should answer questions about these topics in a direct, beginner-friendly way using analogies where helpful. You can also answer general cybersecurity questions outside this module's scope — but briefly redirect users back to this module's context when relevant.

When writing commands or code, ALWAYS wrap them in markdown fenced code blocks using \`\`\`bash or use inline backticks for short commands.

Here is the current tool context loaded in this module: ${toolsContext}.

Be brutally honest, avoid fluff, and never give vague answers.`;

            const loadingId = "load-" + Date.now();
            try {
                showTypingIndicator(loadingId);

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "openai/gpt-oss-20b",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: msg }
                        ]
                    })
                });

                const data = await response.json();
                const indicator = document.getElementById(loadingId);
                if (indicator) indicator.remove();

                if (data.error) {
                    addBotMessage(`Groq API Error: ${data.error.message}`);
                } else {
                    const reply = data.choices[0].message.content;
                    addBotMessage(formatMarkdown(reply));
                }

            } catch (error) {
                const indicator = document.getElementById(loadingId);
                if (indicator) indicator.remove();
                addBotMessage(`Network Error: Failed to reach Groq API. Check your internet connection.`);
            }
        }

        function formatMarkdown(text) {
            let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => `<pre><code class="language-${lang}">${code.trim()}</code></pre>`);
            html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            let lines = html.split('\n');
            let inList = false;
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    let content = line.substring(2);
                    if (!inList) { lines[i] = '<ul><li>' + content + '</li>'; inList = true; }
                    else { lines[i] = '<li>' + content + '</li>'; }
                } else {
                    if (inList) { lines[i] = '</ul>' + lines[i]; inList = false; }
                }
            }
            if (inList) lines[lines.length - 1] += '</ul>';
            html = lines.join('\n');
            html = html.replace(/\n/g, '<br>');
            html = html.replace(/<\/pre><br>/g, '</pre>').replace(/<\/ul><br>/g, '</ul>').replace(/<\/li><br>/g, '</li>').replace(/<ul><br>/g, '<ul>');
            return html;
        }

        function showTypingIndicator(id) {
            const history = document.getElementById('chatHistory');
            history.innerHTML += `<div class="msg bot typing-indicator" id="${id}"><span></span><span></span><span></span></div>`;
            history.scrollTop = history.scrollHeight;
        }

        function addUserMessage(text) {
            const history = document.getElementById('chatHistory');
            history.innerHTML += `<div class="msg user">${text}</div>`;
            history.scrollTop = history.scrollHeight;
        }

        function addBotMessage(text) {
            const history = document.getElementById('chatHistory');
            history.innerHTML += `<div class="msg bot">${text}</div>`;
            history.scrollTop = history.scrollHeight;
        }

        // ─── Mobile Nav ────────────────────────────────────────────

        function switchMobileTab(tabId) {
            document.querySelectorAll('.nav-tab').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId));
            });
            document.body.className = document.body.className.replace(/\btab-\w+\b/g, '').trim();
            document.body.classList.add('tab-' + tabId);
        }

        // ─── Module Completion ─────────────────────────────────────

        function updateCompletionButton() {
            const btn = document.getElementById('completeModuleBtn');
            if (!btn) return;
            const isCompleted = localStorage.getItem(MODULE_KEY) === 'true';
            btn.innerText = isCompleted ? "✓ Module Completed" : "Mark Module Completed";
            btn.classList.toggle('completed', isCompleted);
        }

        function toggleModuleCompletion() {
            const isCompleted = localStorage.getItem(MODULE_KEY) === 'true';
            localStorage.setItem(MODULE_KEY, !isCompleted);
            updateCompletionButton();
        }

        // ─── Custom Tools CRUD ──────────────────────────────────────

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

                setTimeout(() => {
                    const items = document.querySelectorAll('.tool-item');
                    let newToolEl = null, foundIndex = 0;
                    tools.forEach((t, idx) => { if ((t.name.includes('.') ? t.name.split('.')[1].trim() : t.name.trim()) === nameVal) foundIndex = idx; });
                    items.forEach(el => { if (el.innerText === nameVal) newToolEl = el; });
                    if (newToolEl) showDetails(foundIndex, newToolEl);
                }, 100);

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

                setTimeout(() => {
                    const items = document.querySelectorAll('.tool-item');
                    let newToolEl = null, foundIndex = 0;
                    tools.forEach((t, idx) => { if ((t.name.includes('.') ? t.name.split('.')[1].trim() : t.name.trim()) === nameVal) foundIndex = idx; });
                    items.forEach(el => { if (el.innerText === nameVal) newToolEl = el; });
                    if (newToolEl) showDetails(foundIndex, newToolEl);
                }, 100);
            }
        }

        function confirmDeleteTool(index) {
            const tool = tools[index];
            const rawName = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name.trim();
            if (confirm(`Are you sure you want to delete "${rawName}"?`)) deleteTool(index);
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

        // ─── Custom Categories ──────────────────────────────────────

        function loadCustomCategories() {
            try {
                const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                const selectEl = document.getElementById('toolCategory');
                selectEl.innerHTML = `
                    <option value="PortScan">🔌 Port Scanners</option>
                    <option value="NetworkMapper">🗺️ Network Mappers</option>
                    <option value="VulnScanner">⚠️ Vulnerability Scanners</option>
                    <option value="TrafficAnalysis">📡 Traffic Analysis</option>
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

        // ─── Modal Event Listeners ─────────────────────────────────

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('addToolModal');
            if (e.target === modal) closeAddToolModal();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAddToolModal();
        });

        function switchPanelTab(tabId) {
            document.querySelectorAll('.panel-tab').forEach(btn => {
                if (btn.innerText.toLowerCase().includes(tabId)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            if (tabId === 'chat') {
                document.getElementById('chatTabContent').style.display = 'flex';
                document.getElementById('terminalTabContent').style.display = 'none';
                document.getElementById('quizTabContent').style.display = 'none';
            } else if (tabId === 'terminal') {
                document.getElementById('chatTabContent').style.display = 'none';
                document.getElementById('terminalTabContent').style.display = 'flex';
                document.getElementById('quizTabContent').style.display = 'none';
                document.getElementById('terminalInput').focus();
            } else if (tabId === 'quiz') {
                document.getElementById('chatTabContent').style.display = 'none';
                document.getElementById('terminalTabContent').style.display = 'none';
                document.getElementById('quizTabContent').style.display = 'flex';
                loadQuizStatus();
            }
        }

        function handleTerminalEnter(e) {
            if (e.key === 'Enter') {
                const inputEl = document.getElementById('terminalInput');
                const command = inputEl.value.trim();
                inputEl.value = '';
                if (!command) return;
                
                runMockTerminalCommand(command);
            }
        }

        function runMockTerminalCommand(cmd) {
            const output = document.getElementById('terminalOutput');
            output.innerHTML += `<div style="color: #f8fafc; font-weight: bold; margin-top: 5px;">guest@cyberx:~$ ${cmd}</div>`;
            
            const lowerCmd = cmd.toLowerCase().replace(/\s+/g, ' ');
            let response = '';

            if (lowerCmd === 'clear') {
                output.innerHTML = '';
                return;
            } else if (lowerCmd === 'help') {
                response = `Available commands in this module:
  - <span style="color: #34d399">help</span>: Show this directory of commands.
  - <span style="color: #34d399">clear</span>: Clear the console window.
  - <span style="color: #34d399">nmap -sS -Pn 192.168.1.1</span>: Launch a stealthy TCP SYN port scan.
  - <span style="color: #34d399">nmap -sT 192.168.1.1</span>: Launch a TCP Connect scan (no privileges needed).
  - <span style="color: #34d399">gobuster dir -u target.com -w common.txt</span>: Brute-force discover public folders.
  - <span style="color: #34d399">curl -I https://target.com</span>: Fetch raw service banner headers.`;
            } else if (lowerCmd === 'nmap -ss -pn 192.168.1.1') {
                response = `Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-29 06:29
Nmap scan report for 192.168.1.1
Host is up (0.0012s latency).
Not shown: 997 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
  
Nmap done: 1 IP address (1 host up) scanned in 0.22 seconds`;
            } else if (lowerCmd === 'nmap -st 192.168.1.1') {
                response = `Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-29 06:30
Nmap scan report for 192.168.1.1
Host is up (0.0020s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT    STATE SERVICE
80/tcp  open  http
443/tcp open  https
  
Nmap done: 1 IP address (1 host up) scanned in 0.54 seconds`;
            } else if (lowerCmd === 'gobuster dir -u target.com -w common.txt') {
                response = `===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://target.com
[+] Method:                  GET
[+] Wordlist:                common.txt
[+] Negative Status codes:   404
===============================================================
/index.html           (Status: 200) [Size: 1042]
/images               (Status: 301) [Size: 220] --> http://target.com/images/
/admin                (Status: 401) [Size: 94]
/robots.txt           (Status: 200) [Size: 55]
/backup               (Status: 301) [Size: 220] --> http://target.com/backup/`;
            } else if (lowerCmd === 'curl -i https://target.com') {
                response = `HTTP/2 200 OK
server: nginx/1.18.0 (Ubuntu)
date: Mon, 29 Jun 2026 06:31:00 GMT
content-type: text/html; charset=UTF-8
content-length: 1042
last-modified: Sun, 28 Jun 2026 12:00:00 GMT
strict-transport-security: max-age=31536000; includeSubDomains`;
            } else {
                response = `bash: command not found: ${cmd}. Type 'help' to see valid commands for this sandbox module.`;
            }

            output.innerHTML += `<div style="margin-top: 4px; margin-bottom: 8px; white-space: pre-wrap; color: #8b949e;">${response}</div>`;
            output.scrollTop = output.scrollHeight;
        }

        const quizAnswers = { 1: 'B', 2: 'C', 3: 'A' };

        function checkQuizAnswer(questionId, correctLetter) {
            const selected = document.querySelector(`input[name="q${questionId}"]:checked`);
            if (!selected) return;
            
            localStorage.setItem(`scanning_quiz_q${questionId}`, selected.value);
            
            let allCorrect = true;
            for (let i = 1; i <= 3; i++) {
                const ans = localStorage.getItem(`scanning_quiz_q${i}`);
                if (ans !== quizAnswers[i]) {
                    allCorrect = false;
                }
            }
            
            if (allCorrect) {
                document.getElementById('quizCompletionMsg').style.display = 'block';
                localStorage.setItem('scanning_quiz_completed', 'true');
            } else {
                document.getElementById('quizCompletionMsg').style.display = 'none';
            }
        }

        function loadQuizStatus() {
            let allCorrect = true;
            for (let i = 1; i <= 3; i++) {
                const savedVal = localStorage.getItem(`scanning_quiz_q${i}`);
                if (savedVal) {
                    const radio = document.querySelector(`input[name="q${i}"][value="${savedVal}"]`);
                    if (radio) radio.checked = true;
                }
                if (savedVal !== quizAnswers[i]) {
                    allCorrect = false;
                }
            }
            if (allCorrect) {
                document.getElementById('quizCompletionMsg').style.display = 'block';
            } else {
                document.getElementById('quizCompletionMsg').style.display = 'none';
            }
        }

        // ─── Bootstrap ─────────────────────────────────────────────

        loadCustomCategories();
        reloadAllTools();
        updateCompletionButton();
        loadQuizStatus();