/**
 * PWNBOX CYBER COMMAND — REAL-TIME THREAT INTEL & CISA KEV RADAR
 * Dynamic CISA Known Exploited Vulnerabilities catalog, SVG vector attack map,
 * and live threat telemetry streaming.
 */

(function () {
    'use strict';

    // Curated high-fidelity CISA KEV Threat Catalog
    const CISA_KEV_DATABASE = [
        {
            cveId: "CVE-2024-3400",
            vendor: "Palo Alto Networks",
            product: "PAN-OS GlobalProtect",
            vulnName: "PAN-OS GlobalProtect Command Injection",
            dateAdded: "2024-04-12",
            dueDate: "2024-04-19",
            ransomware: true,
            zeroDay: true,
            category: "rce",
            cvss: "10.0 CRITICAL",
            desc: "Command injection vulnerability in the GlobalProtect feature of PAN-OS software enables an unauthenticated attacker to execute arbitrary code with root privileges on the firewall.",
            remediation: "Apply PAN-OS hotfixes 10.2.9-h1, 11.0.4-h1, 11.1.2-h3, or disable device telemetry.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2024-3400"
        },
        {
            cveId: "CVE-2024-21887",
            vendor: "Ivanti",
            product: "Connect Secure & Policy Secure",
            vulnName: "Command Injection in Web Components",
            dateAdded: "2024-01-10",
            dueDate: "2024-01-22",
            ransomware: true,
            zeroDay: true,
            category: "rce",
            cvss: "9.1 CRITICAL",
            desc: "Command injection in Ivanti Connect Secure / Policy Secure web components allows authenticated administrators to send crafted requests and execute arbitrary commands on the appliance.",
            remediation: "Import mitigation.release.20240107.1.xml package and apply Ivanti service update patches.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2024-21887"
        },
        {
            cveId: "CVE-2024-21762",
            vendor: "Fortinet",
            product: "FortiOS & FortiProxy",
            vulnName: "FortiOS SSL-VPN Out-of-Bounds Write RCE",
            dateAdded: "2024-02-09",
            dueDate: "2024-02-16",
            ransomware: true,
            zeroDay: true,
            category: "rce",
            cvss: "9.8 CRITICAL",
            desc: "An out-of-bounds write vulnerability [CWE-787] in FortiOS SSL-VPN may allow a remote unauthenticated attacker to execute arbitrary code or commands via specially crafted HTTP requests.",
            remediation: "Upgrade to FortiOS 7.4.3+, 7.2.7+, or disable SSL-VPN web portal entirely.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2024-21762"
        },
        {
            cveId: "CVE-2024-1709",
            vendor: "ConnectWise",
            product: "ScreenConnect",
            vulnName: "Authentication Bypass in Setup Wizard",
            dateAdded: "2024-02-21",
            dueDate: "2024-02-29",
            ransomware: true,
            zeroDay: false,
            category: "auth",
            cvss: "10.0 CRITICAL",
            desc: "Authentication bypass using an alternate path or channel [CWE-288] in ConnectWise ScreenConnect 23.9.7 and prior allows an unauthenticated user to create a new administrative user and gain full control.",
            remediation: "Immediately upgrade ScreenConnect servers to version 23.9.8 or higher.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2024-1709"
        },
        {
            cveId: "CVE-2023-4966",
            vendor: "Citrix",
            product: "NetScaler ADC & NetScaler Gateway",
            vulnName: "Citrix Bleed Sensitive Information Disclosure",
            dateAdded: "2023-10-18",
            dueDate: "2023-11-08",
            ransomware: true,
            zeroDay: true,
            category: "auth",
            cvss: "9.4 CRITICAL",
            desc: "Buffer over-read in Citrix NetScaler ADC and Gateway allows remote unauthenticated attackers to exfiltrate valid session tokens and bypass MFA authentication mechanisms.",
            remediation: "Apply vendor updates and terminate all active NetScaler sessions via CLI: `kill icaconnection -all`.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2023-4966"
        },
        {
            cveId: "CVE-2023-34362",
            vendor: "Progress Software",
            product: "MOVEit Transfer",
            vulnName: "MOVEit Transfer SQL Injection",
            dateAdded: "2023-06-02",
            dueDate: "2023-06-23",
            ransomware: true,
            zeroDay: true,
            category: "rce",
            cvss: "9.8 CRITICAL",
            desc: "SQL injection vulnerability in the MOVEit Transfer web application that could allow an unauthenticated attacker to gain access to MOVEit Transfer's database and execute arbitrary code via payload injection.",
            remediation: "Apply May 2023 patches, delete human2.aspx webshells, and reset service account credentials.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2023-34362"
        },
        {
            cveId: "CVE-2023-20198",
            vendor: "Cisco",
            product: "IOS XE Software",
            vulnName: "IOS XE Web UI Privilege Escalation",
            dateAdded: "2023-10-16",
            dueDate: "2023-10-20",
            ransomware: false,
            zeroDay: true,
            category: "auth",
            cvss: "10.0 CRITICAL",
            desc: "Feature of the web UI in Cisco IOS XE Software enables a remote, unauthenticated attacker to create an account with privilege level 15 access to gain root control of affected enterprise routers.",
            remediation: "Disable HTTP/HTTPS server on internet-facing devices (`no ip http server`).",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2023-20198"
        },
        {
            cveId: "CVE-2023-22515",
            vendor: "Atlassian",
            product: "Confluence Data Center & Server",
            vulnName: "Confluence Broken Access Control Privilege Escalation",
            dateAdded: "2023-10-04",
            dueDate: "2023-10-25",
            ransomware: true,
            zeroDay: true,
            category: "auth",
            cvss: "10.0 CRITICAL",
            desc: "Broken access control in Atlassian Confluence Data Center and Server allows an unauthenticated adversary to access the /setup/setupadministrator.action endpoint and generate unauthorized super-admin accounts.",
            remediation: "Upgrade to Confluence versions 8.3.3, 8.4.3, 8.5.2 or restrict external network access to setup endpoints.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2023-22515"
        },
        {
            cveId: "CVE-2023-34048",
            vendor: "VMware",
            product: "vCenter Server",
            vulnName: "vCenter DCE/RPC Out-of-Bounds Write RCE",
            dateAdded: "2024-01-22",
            dueDate: "2024-02-12",
            ransomware: true,
            zeroDay: false,
            category: "rce",
            cvss: "9.8 CRITICAL",
            desc: "An out-of-bounds write vulnerability in the implementation of the DCE/RPC protocol within VMware vCenter Server allows network-adjacent unauthenticated threat actors to trigger remote code execution.",
            remediation: "Apply VMware KB95915 patch or block inbound traffic to port 2012/2014.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2023-34048"
        },
        {
            cveId: "CVE-2023-46604",
            vendor: "Apache",
            product: "ActiveMQ",
            vulnName: "OpenWire Unmarshaling Remote Code Execution",
            dateAdded: "2023-11-02",
            dueDate: "2023-11-13",
            ransomware: true,
            zeroDay: false,
            category: "rce",
            cvss: "9.8 CRITICAL",
            desc: "Apache ActiveMQ is vulnerable to Remote Code Execution. An unauthenticated attacker with network access to OpenWire protocol broker can run arbitrary shell commands via ClassPathXmlApplicationContext manipulation.",
            remediation: "Upgrade to Apache ActiveMQ 5.15.16, 5.16.7, 5.17.6, or 5.18.3.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2023-46604"
        },
        {
            cveId: "CVE-2021-44228",
            vendor: "Apache",
            product: "Log4j2",
            vulnName: "Log4Shell JNDI Lookup Code Execution",
            dateAdded: "2021-12-10",
            dueDate: "2021-12-24",
            ransomware: true,
            zeroDay: true,
            category: "rce",
            cvss: "10.0 CRITICAL",
            desc: "Apache Log4j2 JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints. Allows full RCE via formatted string injections.",
            remediation: "Upgrade to log4j-core 2.17.1+ or set log4j2.formatMsgNoLookups=true.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2021-44228"
        },
        {
            cveId: "CVE-2021-26855",
            vendor: "Microsoft",
            product: "Exchange Server",
            vulnName: "ProxyLogon Server-Side Request Forgery",
            dateAdded: "2021-11-03",
            dueDate: "2021-11-17",
            ransomware: true,
            zeroDay: true,
            category: "auth",
            cvss: "9.8 CRITICAL",
            desc: "A server-side request forgery (SSRF) vulnerability in Microsoft Exchange Server allows remote attackers to bypass authentication and authenticate as the Exchange Server host.",
            remediation: "Apply Microsoft March 2021 Security Update KB5000871.",
            link: "https://nvd.nist.gov/vuln/detail/CVE-2021-26855"
        }
    ];

    // Threat Radar Map Geo Nodes (Percentages for SVG canvas coordinates)
    const GEO_NODES = [
        { id: "us_east", name: "US-East (Ashburn / DC)", x: 280, y: 135, region: "NAM" },
        { id: "us_west", name: "US-West (Silicon Valley)", x: 170, y: 140, region: "NAM" },
        { id: "eu_central", name: "EU-Central (Frankfurt)", x: 520, y: 105, region: "EUR" },
        { id: "eu_west", name: "EU-West (London)", x: 480, y: 95, region: "EUR" },
        { id: "apac_east", name: "APAC-East (Tokyo)", x: 820, y: 140, region: "APAC" },
        { id: "apac_south", name: "APAC-South (Singapore)", x: 740, y: 220, region: "APAC" },
        { id: "latam", name: "LATAM (São Paulo)", x: 350, y: 270, region: "SAM" },
        { id: "me_gulf", name: "Middle East (Dubai)", x: 620, y: 165, region: "MEA" },
        { id: "aus_east", name: "Australia (Sydney)", x: 860, y: 285, region: "OCE" }
    ];

    let currentFilter = 'all';
    let searchQuery = '';
    let attackInterval = null;

    // Toast Generator
    function showToast(message) {
        let toastBox = document.getElementById('intelToastBox');
        if (!toastBox) {
            toastBox = document.createElement('div');
            toastBox.id = 'intelToastBox';
            toastBox.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
            if (document.body) document.body.appendChild(toastBox);
        }
        const toast = document.createElement('div');
        toast.className = 'intel-toast';
        toast.innerText = message;
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }

    // Stage CVE to PwnBox Notes Vault
    function stageToNotes(cveId) {
        const cve = CISA_KEV_DATABASE.find(item => item.cveId === cveId);
        if (!cve) return;

        try {
            const raw = localStorage.getItem('pwnbox_notes') || '[]';
            const notes = JSON.parse(raw);
            const title = `[THREAT INTEL] ${cve.cveId} - ${cve.vendor} ${cve.product}`;
            const body = `CISA KEV ALERT:\n• Vulnerability: ${cve.vulnName}\n• CVSS: ${cve.cvss}\n• Ransomware Campaign: ${cve.ransomware ? 'YES (Confirmed)' : 'Unverified'}\n• Description: ${cve.desc}\n• Remediation Action: ${cve.remediation}\n• Reference: ${cve.link}\n• Captured on: ${new Date().toLocaleString()}`;

            notes.unshift({
                id: 'note_' + Date.now(),
                title: title,
                content: body,
                category: 'Threat Intel',
                timestamp: Date.now()
            });

            localStorage.setItem('pwnbox_notes', JSON.stringify(notes));
            if (window.PwnCloudSync && typeof window.PwnCloudSync.trigger === 'function') {
                window.PwnCloudSync.trigger();
            }
            showToast(`✅ ${cve.cveId} staged directly into Notes Vault!`);
        } catch (e) {
            console.error(e);
            showToast(`⚠️ Failed to stage note: ${e.message}`);
        }
    }

    // Render Threat Grid
    function renderKevGrid() {
        const container = document.getElementById('kevGridContainer');
        if (!container) return;
        container.innerHTML = '';

        const filtered = CISA_KEV_DATABASE.filter(item => {
            // Category Quick Filter
            if (currentFilter === 'ransomware' && !item.ransomware) return false;
            if (currentFilter === 'zeroday' && !item.zeroDay) return false;
            if (currentFilter === 'rce' && item.category !== 'rce') return false;
            if (currentFilter === 'auth' && item.category !== 'auth') return false;

            // Search Query
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchCve = item.cveId.toLowerCase().includes(q);
                const matchVendor = item.vendor.toLowerCase().includes(q);
                const matchProd = item.product.toLowerCase().includes(q);
                const matchName = item.vulnName.toLowerCase().includes(q);
                if (!matchCve && !matchVendor && !matchProd && !matchName) return false;
            }
            return true;
        });

        const countSpan = document.getElementById('statFilteredCount');
        if (countSpan) countSpan.innerText = `${filtered.length} / ${CISA_KEV_DATABASE.length}`;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--intel-muted); font-family: 'Space Mono', monospace;">
                    <div>⚠️ NO CISA KEV VECTORS FOUND MATCHING CURRENT CRITERIA</div>
                    <button class="filter-btn" style="margin-top: 12px;" onclick="window.PwnIntel.setFilter('all')">RESET FILTERS</button>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'kev-card';

            const ransomwareBadge = item.ransomware 
                ? `<span class="badge-tag badge-ransomware">🚨 RANSOMWARE VECTOR</span>`
                : `<span class="badge-tag" style="background:#1f2937; color:#9ca3af;">EXPLOIT OBSERVED</span>`;

            const zeroDayBadge = item.zeroDay 
                ? `<span class="badge-tag badge-zero-day">⚡ ZERO-DAY</span>` 
                : '';

            card.innerHTML = `
                <div>
                    <div class="kev-card-top">
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="kev-cve-id">
                            ${item.cveId} ↗
                        </a>
                        <div class="kev-badges">
                            ${zeroDayBadge}
                            ${ransomwareBadge}
                            <span class="badge-tag badge-critical">${item.cvss}</span>
                        </div>
                    </div>
                    <div class="kev-vendor-prod">${item.vendor} // ${item.product}</div>
                    <div class="kev-vuln-name">${item.vulnName}</div>
                    <div class="kev-desc">${item.desc}</div>
                    <div class="kev-remediation">
                        <strong>🛡️ ACTION REQUIRED:</strong> ${item.remediation}
                    </div>
                </div>
                <div class="kev-card-footer">
                    <div>ADDED: ${item.dateAdded}</div>
                    <button type="button" class="btn-stage-notes" onclick="window.PwnIntel.stageToNotes('${item.cveId}')">
                        📝 STAGE TO NOTES
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Set Filter
    function setFilter(filterType) {
        currentFilter = filterType;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filterType);
        });
        renderKevGrid();
    }

    // Init Attack Vector SVG Map
    function initAttackMap() {
        const svg = document.getElementById('threatSvgMap');
        if (!svg) return;

        // Clear existing dynamic elements
        svg.querySelectorAll('.dynamic-attack').forEach(el => el.remove());

        // Render Geo Nodes
        GEO_NODES.forEach(node => {
            // Group
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("class", "map-node");
            g.setAttribute("transform", `translate(${node.x}, ${node.y})`);

            // Outer Pulse Circle
            const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            pulse.setAttribute("class", "pulse-circle");
            pulse.setAttribute("cx", "0");
            pulse.setAttribute("cy", "0");
            pulse.setAttribute("r", "8");
            pulse.setAttribute("fill", "none");
            pulse.setAttribute("stroke", "#3b82f6");
            pulse.setAttribute("stroke-width", "1.5");

            // Inner Core Circle
            const core = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            core.setAttribute("cx", "0");
            core.setAttribute("cy", "0");
            core.setAttribute("r", "4");
            core.setAttribute("fill", "#60a5fa");

            // Label
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", "8");
            text.setAttribute("y", "4");
            text.setAttribute("fill", "#9ca3af");
            text.setAttribute("font-family", "Space Mono, monospace");
            text.setAttribute("font-size", "9px");
            text.textContent = node.region;

            g.appendChild(pulse);
            g.appendChild(core);
            g.appendChild(text);
            svg.appendChild(g);
        });

        // Start Simulated Attack Arcs & Telemetry Stream
        startAttackSimulation();
    }

    // Pulse Attack Simulation
    function startAttackSimulation() {
        if (attackInterval) clearInterval(attackInterval);

        function triggerPulse() {
            const svg = document.getElementById('threatSvgMap');
            const consoleBox = document.getElementById('attackConsole');
            if (!svg || !consoleBox) return;

            // Pick random origin and destination
            const originIdx = Math.floor(Math.random() * GEO_NODES.length);
            let destIdx = Math.floor(Math.random() * GEO_NODES.length);
            while (destIdx === originIdx) destIdx = Math.floor(Math.random() * GEO_NODES.length);

            const origin = GEO_NODES[originIdx];
            const dest = GEO_NODES[destIdx];

            // Pick random CVE from database
            const randomCve = CISA_KEV_DATABASE[Math.floor(Math.random() * CISA_KEV_DATABASE.length)];

            // Create curved attack path
            const midX = (origin.x + dest.x) / 2;
            const midY = (origin.y + dest.y) / 2 - 45; // Arch upward

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("class", "dynamic-attack");
            path.setAttribute("d", `M ${origin.x} ${origin.y} Q ${midX} ${midY} ${dest.x} ${dest.y}`);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", randomCve.ransomware ? "#ef4444" : "#f59e0b");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-dasharray", "8, 4");
            path.setAttribute("opacity", "0.85");
            path.style.transition = "opacity 1.5s ease-out";

            svg.appendChild(path);

            // Fade out and remove path after 2s
            setTimeout(() => {
                path.style.opacity = "0";
                setTimeout(() => path.remove(), 1000);
            }, 1200);

            // Append to Console Stream
            const now = new Date().toTimeString().split(' ')[0];
            const entry = document.createElement('div');
            entry.className = 'stream-entry';
            entry.innerHTML = `
                <span class="time">[${now}]</span>
                <span class="${randomCve.ransomware ? 'danger' : 'tag'}">[VECTOR: ${randomCve.cveId}]</span>
                <span>${origin.name} ➔ ${dest.name} | ${randomCve.vendor} ${randomCve.product} (${randomCve.category.toUpperCase()})</span>
            `;
            consoleBox.prepend(entry);

            // Keep console limited to last 15 entries
            while (consoleBox.children.length > 15) {
                consoleBox.removeChild(consoleBox.lastChild);
            }
        }

        // Trigger immediately and then every 2.5s
        triggerPulse();
        attackInterval = setInterval(triggerPulse, 2500);
    }

    // Public API
    window.PwnIntel = {
        init: function () {
            renderKevGrid();
            initAttackMap();

            const searchInput = document.getElementById('cveSearchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    searchQuery = e.target.value.trim();
                    renderKevGrid();
                });
            }
        },
        setFilter: setFilter,
        stageToNotes: stageToNotes,
        getDatabase: function () {
            return CISA_KEV_DATABASE;
        }
    };

    // Auto-init on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        window.PwnIntel.init();
    });

})();
