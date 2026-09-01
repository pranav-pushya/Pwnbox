// ==========================================
        // API KEY — replace with your Groq key parts
        // ==========================================
        const keyP1 = "gsk_OCCHNxtXBVzq8";
        const keyP2 = "GdGCu99WGdyb3FY";
        const keyP3 = "sqdvAWM3jBcoxcwJaUrC8EGa";
        const apiKey = keyP1 + keyP2 + keyP3;
        // ==========================================

        // localStorage key is module-specific so progress doesn't bleed between modules
        const MODULE_KEY = 'module_enumeration_completed';
        const CUSTOM_TOOLS_KEY = 'enumeration_custom_tools';
        const EDITED_TOOLS_KEY = 'enumeration_edited_default_tools';
        const DELETED_TOOLS_KEY = 'enumeration_deleted_default_indices';
        const CUSTOM_CATS_KEY = 'enumeration_custom_categories';

        const defaultTools = [
            {
                name: "1. Enum4linux",
                link: "https://github.com/CiscoCXSecurity/enum4linux",
                category: "NetBIOS",
                brief: "A tool for enumerating information from Windows and Samba (SMB) hosts. It queries SMB shares, active system users, machine workgroups, and password policies.",
                use: "Scan target completely: <code>enum4linux -a 192.168.1.5</code><br>Get user list only: <code>enum4linux -U 192.168.1.5</code><br>Get list of file shares: <code>enum4linux -S 192.168.1.5</code>",
                useful: "Helps you discover hidden file shares that might contain plain text credentials or source code. If anonymous login is allowed, you can fetch the list of target domain users without authentication."
            },
            {
                name: "2. Nbtstat",
                link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/nbtstat",
                category: "NetBIOS",
                brief: "A classic NetBIOS over TCP/IP utility. It lists NetBIOS name tables, resolved IP mappings, and the local cache. Crucial for mapping legacy Windows names to IPs on local segments.",
                use: "Show target NetBIOS name table: <code>nbtstat -A 192.168.1.5</code><br>Show NetBIOS cache: <code>nbtstat -c</code><br>Show NetBIOS session table: <code>nbtstat -s</code>",
                useful: "Allows you to quickly identify domain controllers, SQL servers, and local workgroups by reading the NetBIOS suffix codes (e.g. <00> is workstation, <20> is file service)."
            },
            {
                name: "3. SNMPwalk",
                link: "https://net-snmp.sourceforge.io/docs/man/snmpwalk.html",
                category: "SNMP",
                brief: "A tool that sends multiple SNMP GETNEXT requests to query an SNMP-enabled network device's information base (MIB). It gathers device names, system uptimes, routing paths, and system statistics.",
                use: "Walk target with community 'public': <code>snmpwalk -v 2c -c public 192.168.1.10</code><br>Query system details only: <code>snmpwalk -v 2c -c public 192.168.1.10 system</code>",
                useful: "SNMP is often left open with default credentials ('public'). Walking the target reveals active system processes, installed software versions, network routing tables, and interface configurations."
            },
            {
                name: "4. Ldapsearch",
                link: "https://linux.die.net/man/1/ldapsearch",
                category: "LDAP",
                brief: "A utility to query LDAP-based directories like Active Directory. It searches organizational units, active security groups, user attributes (like phone numbers, emails, descriptions), and access control lists.",
                use: "Anonymous search: <code>ldapsearch -x -H ldap://192.168.1.20 -b 'dc=target,dc=local'</code><br>Search using credentials: <code>ldapsearch -x -D 'user@target.local' -w 'password' -b 'dc=target,dc=local'</code>",
                useful: "Active Directory is the crown jewel of Windows enterprise networks. Querying it lets you map out the entire organization's structure, list high-privilege administrators, and search description fields for accidentally saved passwords."
            },
            {
                name: "5. Finger",
                link: "https://linux.die.net/man/1/finger",
                category: "SystemInfo",
                brief: "A simple user information lookup program. It queries a host to return details about logged-in users, active login shells, mail status, and full names.",
                use: "Finger user 'jsmith': <code>finger jsmith@target.com</code><br>Query target for all active sessions: <code>finger @target.com</code>",
                useful: "Used for user enumeration. If the finger daemon is running and misconfigured, you can dump a complete list of valid system usernames to target for password spraying."
            },
            {
                name: "6. Rpcinfo",
                link: "https://linux.die.net/man/8/rpcinfo",
                category: "NetBIOS",
                brief: "A utility to report RPC (Remote Procedure Call) service information. It queries the local or remote portmapper daemon to list registered RPC programs and active listeners.",
                use: "List remote RPC registrations: <code>rpcinfo -p 192.168.1.12</code><br>Query specific program: <code>rpcinfo -u 192.168.1.12 nfs</code>",
                useful: "Tells you which RPC services are exposed (like NFS, mountd, or lockd). Essential for identifying old Unix RPC services containing remote code execution vulnerabilities."
            },
            {
                name: "7. Showmount",
                link: "https://linux.die.net/man/8/showmount",
                category: "SystemInfo",
                brief: "A command-line tool to query a remote mount daemon for NFS (Network File System) export information. It lists exported directory paths and client access permissions.",
                use: "List NFS exports: <code>showmount -e 192.168.1.12</code><br>List active NFS clients: <code>showmount -a 192.168.1.12</code>",
                useful: "If an NFS share is misconfigured with 'no_root_squash' or is readable by anyone, you can mount the filesystem locally and read/write raw system files or execute privilege escalation payloads."
            },
            {
                name: "8. Wmic",
                link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wmic",
                category: "SystemInfo",
                brief: "A command-line interface that allows administrators to query Windows systems for hardware, OS details, running services, startup programs, and active user accounts.",
                use: "List running processes: <code>wmic process list brief</code><br>Get service configuration: <code>wmic service where \"state='running'\" get name, displayname</code><br>List hotfixes/patches: <code>wmic qfe list</code>",
                useful: "Once on a Windows machine, WMIC is the ultimate enumeration tool. It runs natively, avoiding antivirus detections, and extracts all configuration details needed to escalate privileges."
            }
        ];

        let tools = [];
        let editingToolIndex = null;

        // ─── Core Init ─────────────────────────────────────────────

        function init() {
            const list = document.getElementById('toolList');
            list.innerHTML = '';

            const categories = {
                "NetBIOS": [],
                "SNMP": [],
                "LDAP": [],
                "SystemInfo": []
            };

            const catDisplayNames = {
                "NetBIOS": "🔌 NetBIOS & Samba",
                "SNMP": "📡 SNMP Enumeration",
                "LDAP": "🔑 LDAP Directory Services",
                "SystemInfo": "🖥️ System & Users Info"
            };

            try {
                const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
                for (const [key, value] of Object.entries(customCats)) {
                    categories[key] = [];
                    catDisplayNames[key] = value;
                }
            } catch (e) { console.error(e); }

            tools.forEach((tool, index) => {
                const cat = tool.category || "NetBIOS";
                if (categories[cat]) {
                    categories[cat].push({ tool, index });
                } else {
                    categories["NetBIOS"].push({ tool, index });
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

            const systemPrompt = `You are a focused cybersecurity assistant specialising in MODULE 03: Enumeration & Mapping. Your primary topics are: NetBIOS, Samba/SMB, SNMP, LDAP, Active Directory configuration, remote service queries, and mapping user indices.
            
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
                    <option value="NetBIOS">🔌 NetBIOS & Samba</option>
                    <option value="SNMP">📡 SNMP Enumeration</option>
                    <option value="LDAP">🔑 LDAP Directory Services</option>
                    <option value="SystemInfo">🖥️ System & Users Info</option>
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

        // ─── Switch Panel Tabs ─────────────────────────────────────

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

        // ─── CLI Sandbox Input ─────────────────────────────────────

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
  - <span style="color: #34d399">enum4linux -a 192.168.1.5</span>: Inspect SMB shares, domain details, and users.
  - <span style="color: #34d399">nbtstat -A 192.168.1.5</span>: Display the NetBIOS name table for the target.
  - <span style="color: #34d399">snmpwalk -v 2c -c public 192.168.1.10</span>: Query active SNMP daemon indices.
  - <span style="color: #34d399">ldapsearch -x -H ldap://192.168.1.20</span>: Run anonymous LDAP query for directories.`;
            } else if (lowerCmd === 'enum4linux -a 192.168.1.5') {
                response = `Starting enum4linux v0.8.9 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on local session
  
========================== 
|    Target Information  |
========================== 
Target Name: 192.168.1.5
  
========================================= 
|    Enumerating Workgroup/Domain/Name  |
========================================= 
[+] Got domain/workgroup name: WORKGROUP
  
===================================== 
|    Session Check on 192.168.1.5    |
===================================== 
[+] Server 192.168.1.5 allows Session Establishment
  
===================================== 
|    Users on 192.168.1.5            |
===================================== 
[+] Share Enumeration:
    ADMIN$          (Type: Disk, Comment: Remote Admin)
    C$              (Type: Disk, Comment: Default share)
    IPC$            (Type: IPC, Comment: Remote IPC)
    backup_share    (Type: Disk, Comment: Public Backup Share - UNLOCKED!)
      
[+] User accounts found:
    guest, Administrator, jsmith, ddoe`;
            } else if (lowerCmd === 'nbtstat -a 192.168.1.5') {
                response = `NetBIOS Remote Machine Name Table
  
   Name               Type         Status
  ---------------------------------------------
   CORP-DESKTOP   <00>  UNIQUE      Registered
   WORKGROUP      <00>  GROUP       Registered
   CORP-DESKTOP   <20>  UNIQUE      Registered
   WORKGROUP      <1E>  GROUP       Registered
  
   MAC Address = 00-15-5D-03-08-11`;
            } else if (lowerCmd === 'snmpwalk -v 2c -c public 192.168.1.10') {
                response = `iso.3.6.1.2.1.1.1.0 = STRING: "Linux server1.target-corp.local 5.4.0-77-generic #86-Ubuntu SMP"
iso.3.6.1.2.1.1.2.0 = OID: iso.3.6.1.4.1.8072.3.2.10
iso.3.6.1.2.1.1.3.0 = Timeticks: (12403948) 1 day, 10:27:19.48
iso.3.6.1.2.1.1.4.0 = STRING: "sysadmin@target-corp.local"
iso.3.6.1.2.1.1.5.0 = STRING: "server1"
iso.3.6.1.2.1.1.6.0 = STRING: "Rack 3, Data Center A"
iso.3.6.1.2.1.2.2.1.2.1 = STRING: "lo"
iso.3.6.1.2.1.2.2.1.2.2 = STRING: "eth0"
iso.3.6.1.2.1.25.6.3.1.2.1 = STRING: "cron"
iso.3.6.1.2.1.25.6.3.1.2.2 = STRING: "apache2"
iso.3.6.1.2.1.25.6.3.1.2.3 = STRING: "ssh"`;
            } else if (lowerCmd === 'ldapsearch -x -h ldap://192.168.1.20') {
                response = `# extended LDIF
#
# LDAPv3
# base <dc=target,dc=local> with scope subtree
# filter: (objectclass=*)
# requesting: ALL
#
  
# target.local
dn: dc=target,dc=local
objectClass: top
objectClass: dcObject
objectClass: organization
o: Target Corp
dc: target
  
# Administrators, Groups, target.local
dn: cn=Administrators,ou=Groups,dc=target,dc=local
cn: Administrators
objectClass: top
objectClass: groupOfNames
member: cn=Domain Admin,cn=Users,dc=target,dc=local`;
            } else {
                response = `bash: command not found: ${cmd}. Type 'help' to see valid commands for this sandbox module.`;
            }

            output.innerHTML += `<div style="margin-top: 4px; margin-bottom: 8px; white-space: pre-wrap; color: #8b949e;">${response}</div>`;
            output.scrollTop = output.scrollHeight;
        }

        // ─── Quiz Logic ────────────────────────────────────────────

        const quizAnswers = { 1: 'A', 2: 'B', 3: 'A' };

        function checkQuizAnswer(questionId, correctLetter) {
            const selected = document.querySelector(`input[name="q${questionId}"]:checked`);
            if (!selected) return;
            
            localStorage.setItem(`enumeration_quiz_q${questionId}`, selected.value);
            
            let allCorrect = true;
            for (let i = 1; i <= 3; i++) {
                const ans = localStorage.getItem(`enumeration_quiz_q${i}`);
                if (ans !== quizAnswers[i]) {
                    allCorrect = false;
                }
            }
            
            if (allCorrect) {
                document.getElementById('quizCompletionMsg').style.display = 'block';
                localStorage.setItem('enumeration_quiz_completed', 'true');
            } else {
                document.getElementById('quizCompletionMsg').style.display = 'none';
            }
        }

        function loadQuizStatus() {
            let allCorrect = true;
            for (let i = 1; i <= 3; i++) {
                const savedVal = localStorage.getItem(`enumeration_quiz_q${i}`);
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