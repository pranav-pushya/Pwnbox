/**
 * PWNBOX CYBER COMMAND - PLAYFUL FEATURES & SIGNATURE ENGINE
 * Features:
 * 1. Stamp Sound & Interaction (Pranav Pushya Signature Stamp)
 * 2. Authentic Cyberpunk 2077 Memory Buffer Breach Protocol (5x5 Hex Matrix)
 * 3. SOC Military-Grade Global Cyber Threat Radar & Interactive Laser Interceptor
 * 4. Keyboard Easter Eggs (Konami Code, 'hack', 'matrix', 'pranav')
 * 5. Interactive Agent Dossier & Classified ID Card Generator
 */

(function () {
    'use strict';

    // --- PROCEDURAL WEB AUDIO SYNTHESIZER ---
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.08) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }

    function playKeyClick() {
        playTone(1200, 'square', 0.03, 0.05);
        setTimeout(() => playTone(600, 'sine', 0.04, 0.03), 15);
    }

    function playSonarPing() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1450, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    }

    function playZapSfx() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch (e) {}
    }

    function playStampSfx() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.18);
            playTone(850, 'square', 0.04, 0.06);
        } catch (e) {}
    }

    function playEmpSfx() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(900, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.45);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.45);
        } catch (e) {}
    }

    function playVictorySfx() {
        setTimeout(() => playTone(523.25, 'triangle', 0.15, 0.1), 0);
        setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.1), 120);
        setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.12), 240);
        setTimeout(() => playTone(1046.50, 'triangle', 0.45, 0.16), 360);
    }

    function playAlarmSfx() {
        playTone(320, 'sawtooth', 0.1, 0.14);
        setTimeout(() => playTone(240, 'sawtooth', 0.18, 0.14), 100);
    }

    // --- 1. SIGNATURE STAMP INTERACTION ---
    function initStamp() {
        const stamp = document.getElementById('pranavStamp');
        if (!stamp) return;

        stamp.addEventListener('click', () => {
            playStampSfx();
            stamp.classList.remove('stamp-slam');
            void stamp.offsetWidth;
            stamp.classList.add('stamp-slam');
            triggerInkSplatter(stamp);
        });
    }

    function triggerInkSplatter(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const count = 12;
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = 'ink-drop';
            const size = Math.random() * 8 + 4;
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            dot.style.left = (rect.left + rect.width / 2) + 'px';
            dot.style.top = (rect.top + rect.height / 2) + 'px';

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 60 + 20;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            dot.style.setProperty('--tx', tx + 'px');
            dot.style.setProperty('--ty', ty + 'px');

            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 700);
        }
    }

    // --- 2. AUTHENTIC CYBERPUNK 2077 MEMORY BUFFER BREACH PROTOCOL ---
    const HEX_POOL = ['1C', 'E9', '7A', '55', 'BD', 'FF'];
    const MATRIX_SIZE = 5;
    const BUFFER_LIMIT = 4;
    const TOTAL_BREACH_TIME = 15.0;

    let matrixData = [];
    let targetSequence = [];
    let playerBuffer = [];
    let activeAxis = 'row'; // 'row' or 'col'
    let activeIndex = 0;
    let usedCells = new Set();
    let breachTimer = null;
    let breachTimeLeft = TOTAL_BREACH_TIME;
    let isBreachRunning = false;

    function initBreachGame() {
        const btnStart = document.getElementById('btnStartBreach');
        if (!btnStart) return;
        btnStart.addEventListener('click', startBreachProtocol);

        // Initial setup for showcase display
        generateMatrix();
        renderMatrixUI();
        renderTargetSequenceUI();
    }

    function generateMatrix() {
        matrixData = [];
        for (let r = 0; r < MATRIX_SIZE; r++) {
            const row = [];
            for (let c = 0; c < MATRIX_SIZE; c++) {
                const randHex = HEX_POOL[Math.floor(Math.random() * HEX_POOL.length)];
                row.push(randHex);
            }
            matrixData.push(row);
        }

        // Guaranteed solvable sequence path
        const r1 = 0;
        const c1 = Math.floor(Math.random() * MATRIX_SIZE);
        const code1 = matrixData[r1][c1];

        const r2 = Math.floor(Math.random() * MATRIX_SIZE);
        const code2 = matrixData[r2][c1];

        const c3 = Math.floor(Math.random() * MATRIX_SIZE);
        const code3 = matrixData[r2][c3];

        targetSequence = [code1, code2, code3];
    }

    function startBreachProtocol() {
        getAudioContext();
        if (breachTimer) clearInterval(breachTimer);

        generateMatrix();
        playerBuffer = [];
        usedCells.clear();
        activeAxis = 'row';
        activeIndex = 0;
        breachTimeLeft = TOTAL_BREACH_TIME;
        isBreachRunning = true;

        const btnStart = document.getElementById('btnStartBreach');
        const timerText = document.getElementById('breachTimerText');
        const timerBar = document.getElementById('breachTimerBar');
        const statusPill = document.getElementById('breachStatus');
        const axisGuide = document.getElementById('matrixAxisGuide');

        btnStart.disabled = true;
        btnStart.textContent = '⚡ INFILTRATING BUFFER...';
        statusPill.textContent = 'STATUS: DECRYPTING...';
        statusPill.style.color = '#00f0ff';
        if (axisGuide) {
            axisGuide.textContent = `AXIS: ROW 1 ACTIVE [HORIZONTAL]`;
            axisGuide.className = 'matrix-crosshair-status row-mode';
        }

        renderMatrixUI();
        renderTargetSequenceUI();
        updatePlayerBufferUI();
        logToTerminal('> BUFFER INITIALIZED. INJECTING ROW 0 OFFSET 0x0000...', 'info');

        playTone(480, 'square', 0.1);

        const startTime = Date.now();
        const duration = TOTAL_BREACH_TIME * 1000;

        breachTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            breachTimeLeft = Math.max(0, (duration - elapsed) / 1000);
            timerText.textContent = breachTimeLeft.toFixed(2) + 's';
            const pct = (breachTimeLeft / TOTAL_BREACH_TIME) * 100;
            timerBar.style.width = pct + '%';

            if (breachTimeLeft <= 4.0) {
                timerBar.style.background = 'var(--bauhaus-red)';
                timerText.style.color = 'var(--bauhaus-red)';
            } else {
                timerBar.style.background = 'var(--bauhaus-yellow)';
                timerText.style.color = '#f1f5f9';
            }

            if (breachTimeLeft <= 0) {
                endBreachProtocol(false, 'TIME EXPIRED // INTRUSION DETECTED & TRACED');
            }
        }, 30);
    }

    function renderMatrixUI() {
        const grid = document.getElementById('breachMatrixGrid');
        if (!grid) return;
        grid.innerHTML = '';

        for (let r = 0; r < MATRIX_SIZE; r++) {
            for (let c = 0; c < MATRIX_SIZE; c++) {
                const cell = document.createElement('button');
                const cellKey = `${r},${c}`;
                const isUsed = usedCells.has(cellKey);
                const isActiveAxis = isBreachRunning && ((activeAxis === 'row' && r === activeIndex) || (activeAxis === 'col' && c === activeIndex));

                cell.className = 'matrix-cell';
                if (isUsed) {
                    cell.classList.add('used');
                    cell.textContent = '[--]';
                } else {
                    cell.textContent = matrixData[r][c];
                    if (isActiveAxis) cell.classList.add('active-axis');
                }

                cell.setAttribute('data-row', r);
                cell.setAttribute('data-col', c);

                cell.addEventListener('click', () => handleCellClick(r, c));
                grid.appendChild(cell);
            }
        }
    }

    function handleCellClick(r, c) {
        if (!isBreachRunning) return;
        const cellKey = `${r},${c}`;
        if (usedCells.has(cellKey)) return;

        // Check if on active axis
        if ((activeAxis === 'row' && r !== activeIndex) || (activeAxis === 'col' && c !== activeIndex)) {
            playTone(160, 'sawtooth', 0.1);
            logToTerminal(`> INVALID AXIS: PLEASE SELECT FROM HIGHLIGHTED ${activeAxis.toUpperCase()}`, 'warn');
            return;
        }

        // Valid move!
        playKeyClick();
        const code = matrixData[r][c];
        playerBuffer.push(code);
        usedCells.add(cellKey);

        logToTerminal(`> MEMORY INJECTION: [ 0x${code} ] AT [R${r}:C${c}]`, 'success');

        // Switch axis
        if (activeAxis === 'row') {
            activeAxis = 'col';
            activeIndex = c;
        } else {
            activeAxis = 'row';
            activeIndex = r;
        }

        const axisGuide = document.getElementById('matrixAxisGuide');
        if (axisGuide) {
            axisGuide.textContent = `AXIS: ${activeAxis === 'row' ? 'ROW ' + (activeIndex + 1) + ' [HORIZONTAL]' : 'COLUMN ' + (activeIndex + 1) + ' [VERTICAL]'}`;
            axisGuide.className = `matrix-crosshair-status ${activeAxis}-mode`;
        }

        renderMatrixUI();
        updatePlayerBufferUI();

        // Check win condition
        if (checkSequenceMatch()) {
            endBreachProtocol(true, 'KERNEL COMPROMISED // ROOT SHELL ACQUIRED!');
            return;
        }

        // Check loss by buffer overflow
        if (playerBuffer.length >= BUFFER_LIMIT) {
            endBreachProtocol(false, 'BUFFER OVERFLOW // SEQUENCE INTEGRITY CORRUPTED');
        }
    }

    function checkSequenceMatch() {
        if (playerBuffer.length < targetSequence.length) return false;
        for (let i = 0; i <= playerBuffer.length - targetSequence.length; i++) {
            let match = true;
            for (let j = 0; j < targetSequence.length; j++) {
                if (playerBuffer[i + j] !== targetSequence[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return true;
        }
        return false;
    }

    function updatePlayerBufferUI() {
        const container = document.getElementById('breachUserBuffer');
        const slotsCount = document.getElementById('bufferSlotsUsed');
        if (!container) return;

        if (slotsCount) slotsCount.textContent = playerBuffer.length.toString();

        container.innerHTML = '';
        for (let i = 0; i < BUFFER_LIMIT; i++) {
            const slot = document.createElement('span');
            slot.className = 'buf-slot';
            if (i < playerBuffer.length) {
                slot.textContent = playerBuffer[i];
                slot.classList.add('filled');
            } else {
                slot.textContent = '_';
                slot.classList.add('empty');
            }
            container.appendChild(slot);
        }
    }

    function renderTargetSequenceUI() {
        const seqContainer = document.getElementById('breachTargetSequence');
        if (!seqContainer) return;
        seqContainer.innerHTML = '';
        targetSequence.forEach(code => {
            const chip = document.createElement('span');
            chip.className = 'seq-chip';
            chip.textContent = code;
            seqContainer.appendChild(chip);
        });
    }

    function logToTerminal(msg, type = 'info') {
        const logBox = document.getElementById('breachTerminalLog');
        if (!logBox) return;
        const line = document.createElement('div');
        line.className = `term-line ${type}`;
        line.textContent = msg;
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;

        while (logBox.children.length > 7) {
            logBox.removeChild(logBox.firstChild);
        }
    }

    function endBreachProtocol(won, reason) {
        clearInterval(breachTimer);
        isBreachRunning = false;

        const btnStart = document.getElementById('btnStartBreach');
        const statusPill = document.getElementById('breachStatus');
        const timerText = document.getElementById('breachTimerText');
        const timerBar = document.getElementById('breachTimerBar');

        btnStart.disabled = false;
        btnStart.textContent = won ? '⚡ RE-ENGAGE PROTOCOL' : '⚡ RETRY BREACH';

        if (won) {
            playVictorySfx();
            statusPill.textContent = 'STATUS: ACCESS GRANTED';
            statusPill.style.color = '#10b981';
            timerText.textContent = 'UNLOCKED';
            timerText.style.color = '#10b981';
            timerBar.style.width = '100%';
            timerBar.style.background = '#10b981';
            logToTerminal(`> [CRITICAL SUCCESS] ${reason}`, 'success');
            logToTerminal(`> ARCHITECT ROOT ACCREDITED: PRANAV PUSHYA`, 'success');

            if (window.triggerHeroConfetti) {
                window.triggerHeroConfetti();
            }
        } else {
            playAlarmSfx();
            statusPill.textContent = 'STATUS: LOCKOUT';
            statusPill.style.color = 'var(--bauhaus-red)';
            timerText.textContent = 'FAILED';
            timerText.style.color = 'var(--bauhaus-red)';
            timerBar.style.width = '0%';
            logToTerminal(`> [FATAL EXCEPTION] ${reason}`, 'warn');
        }
    }

    // --- 3. SOC MILITARY-GRADE GLOBAL THREAT RADAR ---
    let radarCanvas = null;
    let radarCtx = null;
    let radarAngle = 0;
    let threats = [];
    let radarSonarEnabled = true;
    let activeFilter = 'all';
    let hoveredThreat = null;
    let laserBeamEffect = null;
    let shockwaveEffect = null;

    const SOC_THREAT_CATALOG = [
        { type: 'Cobalt Strike C2 Beacon', category: 'c2', ip: '185.220.101.5', sector: 'Frankfurt (DE)', port: '443/TLS', bandwidth: '42.4 Gbps', cvss: '9.8 CRITICAL', cve: 'CVE-2023-3824' },
        { type: 'Mirai Botnet SYN Flood', category: 'c2', ip: '45.155.205.23', sector: 'Ashburn (US)', port: '80/TCP', bandwidth: '128 Kpps', cvss: '8.6 HIGH', cve: 'CVE-2023-44487' },
        { type: 'Zero-Day Remote Code Exec', category: 'cve', ip: '91.240.118.2', sector: 'Tokyo (JP)', port: '8080/HTTP', bandwidth: '8.2 Gbps', cvss: '10.0 CRITICAL', cve: 'CVE-2024-38812' },
        { type: 'Kerberoasting Ticket Injection', category: 'cve', ip: '103.145.13.9', sector: 'Singapore (SG)', port: '88/KRB', bandwidth: 'Lateral Move', cvss: '9.1 CRITICAL', cve: 'CVE-2020-1472' },
        { type: 'DNS Tunneling Data Exfil', category: 'c2', ip: '198.51.100.4', sector: 'London (UK)', port: '53/UDP', bandwidth: 'High Entropy', cvss: '8.4 HIGH', cve: 'DNS-EXFIL-A2' },
        { type: 'BlackCat Ransomware Probe', category: 'cve', ip: '194.26.29.11', sector: 'São Paulo (BR)', port: '445/SMB', bandwidth: '445 Probe', cvss: '9.8 CRITICAL', cve: 'CVE-2021-4034' },
        { type: 'ShadowBroker SMB Exploit', category: 'cve', ip: '193.106.191.7', sector: 'Zurich (CH)', port: '139/NETBIOS', bandwidth: 'EternalBlue', cvss: '9.9 CRITICAL', cve: 'MS17-010' },
        { type: 'Mozi IoT Worm Propagation', category: 'c2', ip: '210.140.10.88', sector: 'Seoul (KR)', port: '23/TELNET', bandwidth: '34.1 Kpps', cvss: '8.9 HIGH', cve: 'CVE-2021-35394' }
    ];

    function initRadar() {
        radarCanvas = document.getElementById('threatRadarCanvas');
        if (!radarCanvas) return;
        radarCtx = radarCanvas.getContext('2d');

        resizeRadar();
        window.addEventListener('resize', resizeRadar);

        // Spawn initial 5 threats
        for (let i = 0; i < 5; i++) spawnThreat();

        setInterval(() => {
            if (threats.length < 8) spawnThreat();
        }, 2400);

        renderRadar();

        // Canvas mouse interaction (Hover & Click Interception)
        radarCanvas.addEventListener('mousemove', handleRadarMouseMove);
        radarCanvas.addEventListener('mouseleave', () => { hoveredThreat = null; });
        radarCanvas.addEventListener('click', handleRadarClick);

        // Controls
        const btnEmp = document.getElementById('btnFireEmp');
        if (btnEmp) btnEmp.addEventListener('click', fireEmpCountermeasure);

        const btnSonar = document.getElementById('btnRadarSonar');
        if (btnSonar) {
            btnSonar.addEventListener('click', () => {
                radarSonarEnabled = !radarSonarEnabled;
                btnSonar.classList.toggle('active', radarSonarEnabled);
                btnSonar.textContent = radarSonarEnabled ? '🔊 SONAR: ON' : '🔇 SONAR: OFF';
                if (radarSonarEnabled) playSonarPing();
            });
        }

        // Filter buttons
        document.querySelectorAll('.radar-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.radar-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.getAttribute('data-filter') || 'all';
                playKeyClick();
            });
        });
    }

    function resizeRadar() {
        if (!radarCanvas) return;
        const box = radarCanvas.parentElement.getBoundingClientRect();
        const dim = Math.min(box.width, 360);
        radarCanvas.width = dim;
        radarCanvas.height = dim;
    }

    function spawnThreat() {
        const radius = Math.random() * 0.65 + 0.2;
        const angle = Math.random() * Math.PI * 2;
        const meta = SOC_THREAT_CATALOG[Math.floor(Math.random() * SOC_THREAT_CATALOG.length)];

        threats.push({
            id: Math.random().toString(36).substr(2, 9),
            r: radius,
            angle: angle,
            alpha: 1.0,
            meta: meta,
            pingPulse: 0,
            hasPinged: false,
            time: Date.now()
        });

        appendTicker(meta);
    }

    function appendTicker(meta) {
        const ticker = document.getElementById('radarTickerLogs');
        if (!ticker) return;

        const timeStr = new Date().toTimeString().split(' ')[0];
        const row = document.createElement('div');
        row.className = 'ticker-log-item';
        row.innerHTML = `<span class="ticker-time">[${timeStr}]</span> <span class="ticker-status">[DETECTED]</span> <span class="ticker-type">${meta.type}</span> &rarr; <span class="ticker-ip">${meta.ip}</span> (${meta.sector})`;
        ticker.prepend(row);

        while (ticker.children.length > 5) {
            ticker.removeChild(ticker.lastChild);
        }
    }

    function handleRadarMouseMove(e) {
        const rect = radarCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cx = radarCanvas.width / 2;
        const cy = radarCanvas.height / 2;
        const maxR = radarCanvas.width / 2 - 14;

        let closest = null;
        let minDist = 22;

        threats.forEach(t => {
            if (activeFilter !== 'all' && t.meta.category !== activeFilter) return;
            const tx = cx + Math.cos(t.angle) * (t.r * maxR);
            const ty = cy + Math.sin(t.angle) * (t.r * maxR);
            const d = Math.hypot(mx - tx, my - ty);
            if (d < minDist) {
                minDist = d;
                closest = t;
            }
        });

        hoveredThreat = closest;
        updateLockonCard(closest);
    }

    function updateLockonCard(threat) {
        const card = document.getElementById('radarLockonCard');
        const ipEl = document.getElementById('lockonIp');
        const detailsEl = document.getElementById('lockonDetails');
        if (!card || !ipEl || !detailsEl) return;

        if (threat) {
            card.classList.add('visible');
            ipEl.textContent = `TARGET: ${threat.meta.ip} [${threat.meta.cvss}]`;
            detailsEl.textContent = `SECTOR: ${threat.meta.sector} // PORT: ${threat.meta.port} // VECTOR: ${threat.meta.type}`;
        } else {
            card.classList.remove('visible');
        }
    }

    function handleRadarClick() {
        if (!hoveredThreat) return;
        const t = hoveredThreat;

        // Laser beam animation from center
        const cx = radarCanvas.width / 2;
        const cy = radarCanvas.height / 2;
        const maxR = radarCanvas.width / 2 - 14;
        const tx = cx + Math.cos(t.angle) * (t.r * maxR);
        const ty = cy + Math.sin(t.angle) * (t.r * maxR);

        laserBeamEffect = { x1: cx, y1: cy, x2: tx, y2: ty, alpha: 1.0 };
        playZapSfx();

        // Increment score
        const scoreEl = document.getElementById('threatInterceptCount');
        if (scoreEl) {
            scoreEl.textContent = ((parseInt(scoreEl.textContent, 10) || 0) + 1).toString();
        }

        // Remove threat
        threats = threats.filter(item => item !== t);
        hoveredThreat = null;
        updateLockonCard(null);

        // Ticker update
        const ticker = document.getElementById('radarTickerLogs');
        if (ticker) {
            const timeStr = new Date().toTimeString().split(' ')[0];
            const row = document.createElement('div');
            row.className = 'ticker-log-item';
            row.innerHTML = `<span class="ticker-time">[${timeStr}]</span> <span class="ticker-status" style="color: #00f0ff;">[DEFLECTED]</span> <span class="ticker-type">TACTICAL COUNTERMEASURE</span> &rarr; ${t.meta.ip} NEUTRALIZED`;
            ticker.prepend(row);
        }
    }

    function renderRadar() {
        if (!radarCanvas || !radarCtx) return;
        const w = radarCanvas.width;
        const h = radarCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const maxR = w / 2 - 14;

        radarCtx.clearRect(0, 0, w, h);

        // 1. Polar Scope Background
        radarCtx.fillStyle = '#060a12';
        radarCtx.beginPath();
        radarCtx.arc(cx, cy, maxR, 0, Math.PI * 2);
        radarCtx.fill();

        // 2. Tactical Concentric Distance Range Rings
        const rangeDistances = ['2,500 KM', '5,000 KM', '7,500 KM', '10,000 KM'];
        [0.25, 0.5, 0.75, 1.0].forEach((f, idx) => {
            const r = maxR * f;
            radarCtx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
            radarCtx.lineWidth = 1;
            radarCtx.beginPath();
            radarCtx.arc(cx, cy, r, 0, Math.PI * 2);
            radarCtx.stroke();

            // Distance labels
            radarCtx.fillStyle = 'rgba(0, 240, 255, 0.45)';
            radarCtx.font = '8px monospace';
            radarCtx.fillText(rangeDistances[idx], cx + 4, cy - r + 10);
        });

        // 3. Azimuth Degree Crosshairs & Compass Ticks
        radarCtx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        radarCtx.lineWidth = 1;
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy - maxR);
        radarCtx.lineTo(cx, cy + maxR);
        radarCtx.moveTo(cx - maxR, cy);
        radarCtx.lineTo(cx + maxR, cy);
        radarCtx.stroke();

        // Cardinal Ticks
        const cardinals = [
            { text: '000° N', x: cx, y: cy - maxR + 9 },
            { text: '090° E', x: cx + maxR - 22, y: cy + 3 },
            { text: '180° S', x: cx, y: cy + maxR - 3 },
            { text: '270° W', x: cx - maxR + 5, y: cy + 3 }
        ];
        radarCtx.fillStyle = '#38bdf8';
        radarCtx.font = '9px monospace';
        radarCtx.textAlign = 'center';
        cardinals.forEach(c => radarCtx.fillText(c.text, c.x, c.y));

        // 4. Rotating Tactical Phosphor Sweep Trail
        radarAngle += 0.032;
        const trailArc = 0.65;
        const sweepGrad = radarCtx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        sweepGrad.addColorStop(0, 'rgba(0, 255, 170, 0.22)');
        sweepGrad.addColorStop(1, 'rgba(0, 255, 170, 0.0)');

        radarCtx.save();
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy);
        radarCtx.arc(cx, cy, maxR, radarAngle - trailArc, radarAngle);
        radarCtx.closePath();
        radarCtx.fillStyle = sweepGrad;
        radarCtx.fill();
        radarCtx.restore();

        // Sweep Leading Line
        radarCtx.strokeStyle = '#00ffaa';
        radarCtx.lineWidth = 2;
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy);
        radarCtx.lineTo(cx + Math.cos(radarAngle) * maxR, cy + Math.sin(radarAngle) * maxR);
        radarCtx.stroke();

        // 5. Render Threat Blips & Tactical Lock Reticles
        const currentSweepNorm = ((radarAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

        threats.forEach(t => {
            if (activeFilter !== 'all' && t.meta.category !== activeFilter) return;

            const tx = cx + Math.cos(t.angle) * (t.r * maxR);
            const ty = cy + Math.sin(t.angle) * (t.r * maxR);

            // Sweep hit detection
            const threatNorm = ((t.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            const angleDiff = Math.abs(currentSweepNorm - threatNorm);
            if (angleDiff < 0.06 && !t.hasPinged) {
                t.pingPulse = 1.0;
                t.hasPinged = true;
                if (radarSonarEnabled) playSonarPing();
            } else if (angleDiff > 0.4) {
                t.hasPinged = false;
            }

            // Expanding Sonar Ping Ring
            if (t.pingPulse > 0.01) {
                radarCtx.strokeStyle = `rgba(0, 255, 170, ${t.pingPulse})`;
                radarCtx.lineWidth = 1.5;
                radarCtx.beginPath();
                radarCtx.arc(tx, ty, 6 + (1.0 - t.pingPulse) * 18, 0, Math.PI * 2);
                radarCtx.stroke();
                t.pingPulse -= 0.04;
            }

            // Blip Color by Category
            const blipColor = t.meta.category === 'c2' ? '#f97316' : '#d9291c';

            // Solid Core
            radarCtx.fillStyle = blipColor;
            radarCtx.beginPath();
            radarCtx.arc(tx, ty, 4, 0, Math.PI * 2);
            radarCtx.fill();

            // Threat Diamond / Reticle
            radarCtx.strokeStyle = blipColor;
            radarCtx.lineWidth = 1.2;
            radarCtx.strokeRect(tx - 6, ty - 6, 12, 12);

            // If hovered, draw targeting lock lines
            if (hoveredThreat === t) {
                radarCtx.strokeStyle = '#00f0ff';
                radarCtx.lineWidth = 1.5;
                radarCtx.beginPath();
                radarCtx.moveTo(cx, cy);
                radarCtx.lineTo(tx, ty);
                radarCtx.stroke();

                radarCtx.strokeStyle = '#00f0ff';
                radarCtx.strokeRect(tx - 10, ty - 10, 20, 20);
            }
        });

        // 6. Laser Countermeasure Beam Render
        if (laserBeamEffect && laserBeamEffect.alpha > 0.02) {
            radarCtx.save();
            radarCtx.strokeStyle = `rgba(0, 240, 255, ${laserBeamEffect.alpha})`;
            radarCtx.lineWidth = 3;
            radarCtx.shadowColor = '#00f0ff';
            radarCtx.shadowBlur = 10;
            radarCtx.beginPath();
            radarCtx.moveTo(laserBeamEffect.x1, laserBeamEffect.y1);
            radarCtx.lineTo(laserBeamEffect.x2, laserBeamEffect.y2);
            radarCtx.stroke();
            radarCtx.restore();
            laserBeamEffect.alpha -= 0.12;
        }

        // 7. EMP Expanding Shockwave Render
        if (shockwaveEffect && shockwaveEffect.r < maxR) {
            radarCtx.save();
            radarCtx.strokeStyle = `rgba(0, 240, 255, ${shockwaveEffect.alpha})`;
            radarCtx.lineWidth = 4;
            radarCtx.beginPath();
            radarCtx.arc(cx, cy, shockwaveEffect.r, 0, Math.PI * 2);
            radarCtx.stroke();
            radarCtx.restore();

            shockwaveEffect.r += 10;
            shockwaveEffect.alpha -= 0.03;
            if (shockwaveEffect.r >= maxR) shockwaveEffect = null;
        }

        requestAnimationFrame(renderRadar);
    }

    function fireEmpCountermeasure() {
        playEmpSfx();
        const maxR = radarCanvas ? radarCanvas.width / 2 - 14 : 150;
        shockwaveEffect = { r: 10, alpha: 1.0 };

        const deflectedCount = threats.length;
        threats = []; // Wipe all threats
        hoveredThreat = null;
        updateLockonCard(null);

        const scoreEl = document.getElementById('threatInterceptCount');
        if (scoreEl) {
            const current = parseInt(scoreEl.textContent, 10) || 0;
            scoreEl.textContent = (current + Math.max(8, deflectedCount)).toString();
        }

        const flash = document.getElementById('radarFlashOverlay');
        if (flash) {
            flash.classList.remove('emp-active');
            void flash.offsetWidth;
            flash.classList.add('emp-active');
        }

        appendTicker({
            type: 'EMP COUNTERMEASURE OVERLOAD',
            ip: 'SOC-DEFENSE-GRID',
            sector: 'GLOBAL RADAR',
            port: 'ALL CHANNELS',
            status: 'NEUTRALIZED'
        });
    }

    // --- 4. KEYBOARD EASTER EGGS ---
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let typedBuffer = '';

    function initEasterEggs() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === konamiSequence[konamiIndex] || e.key === konamiSequence[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiSequence.length) {
                    konamiIndex = 0;
                    triggerSecretArchitectModal('KONAMI CODE DETECTED: GODMODE ACTIVE');
                }
            } else {
                konamiIndex = 0;
            }

            typedBuffer += key;
            if (typedBuffer.length > 20) typedBuffer = typedBuffer.slice(-20);

            if (typedBuffer.endsWith('hack') || typedBuffer.endsWith('matrix') || typedBuffer.endsWith('pranav')) {
                typedBuffer = '';
                triggerSecretArchitectModal('AUTHENTICATED BY ARCHITECT: PRANAV PUSHYA');
            }
        });
    }

    function triggerSecretArchitectModal(message) {
        playVictorySfx();
        let modal = document.getElementById('secretArchitectModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'secretArchitectModal';
            modal.className = 'secret-modal-backdrop';
            modal.innerHTML = `
                <div class="secret-modal-card">
                    <div class="secret-modal-header">
                        <span class="secret-tag">⚠️ CLASSIFIED ARCHITECT BYPASS</span>
                        <button class="secret-close-btn" onclick="document.getElementById('secretArchitectModal').style.display='none'">&times;</button>
                    </div>
                    <div class="secret-modal-body">
                        <h2 class="secret-title">PRANAV PUSHYA // SYSTEM CREATOR</h2>
                        <p class="secret-sub" id="secretModalMsg">${message}</p>
                        <div class="secret-code-block">
                            <code>[ROOT_CLEARANCE]: GRANTED<br>[CORE_SIGNATURE]: 0xPRANAV_2026<br>[STATUS]: ALL 7 KILL-CHAIN PROTOCOLS OVERRIDDEN</code>
                        </div>
                        <div class="secret-actions">
                            <button class="btn-secret-action" onclick="document.getElementById('secretArchitectModal').style.display='none'">RETURN TO OPERATIONAL DECK</button>
                            <a href="dashboard.html" class="btn-secret-action red">PROCEED TO DASHBOARD &rarr;</a>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            const msgEl = document.getElementById('secretModalMsg');
            if (msgEl) msgEl.textContent = message;
        }

        modal.style.display = 'flex';
    }

    // --- 5. INTERACTIVE AGENT DOSSIER / ID BADGE GENERATOR ---
    function initAgentCardGenerator() {
        const inputName = document.getElementById('genAgentAlias');
        const previewName = document.getElementById('previewAgentAlias');
        const previewAvatar = document.getElementById('previewAgentAvatar');
        const btnSave = document.getElementById('btnSaveAgentDossier');
        const avatarBtns = document.querySelectorAll('.gen-avatar-opt');

        if (!inputName || !previewName || !previewAvatar) return;

        const savedAlias = localStorage.getItem('agentAlias') || localStorage.getItem('pwnbox_agent_alias') || localStorage.getItem('pwnbox_user_name');
        if (savedAlias) {
            inputName.value = savedAlias;
            previewName.textContent = savedAlias.toUpperCase();
        }

        const savedAvatar = localStorage.getItem('pwnbox_agent_avatar');
        if (savedAvatar) {
            previewAvatar.textContent = savedAvatar;
        }

        inputName.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            previewName.textContent = val ? val.toUpperCase() : 'UNKNOWN AGENT';
        });

        avatarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                avatarBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const av = btn.getAttribute('data-avatar');
                previewAvatar.textContent = av;
                playTone(660, 'sine', 0.05);
            });
        });

        if (btnSave) {
            btnSave.addEventListener('click', () => {
                playStampSfx();
                const alias = inputName.value.trim() || 'Agent';
                const avatar = previewAvatar.textContent || '👾';

                localStorage.setItem('pwnbox_agent_alias', alias);
                localStorage.setItem('pwnbox_agent_avatar', avatar);
                localStorage.setItem('userAlias', alias);
                localStorage.setItem('agentAlias', alias);

                btnSave.textContent = '✓ DOSSIER SAVED!';
                btnSave.style.background = '#10b981';
                btnSave.style.color = '#ffffff';

                setTimeout(() => {
                    btnSave.textContent = '💾 SAVE TO DASHBOARD';
                    btnSave.style.background = '';
                    btnSave.style.color = '';
                }, 2000);
            });
        }
    }

    // --- INIT ON DOM READY ---
    document.addEventListener('DOMContentLoaded', () => {
        initStamp();
        initBreachGame();
        initRadar();
        initEasterEggs();
        initAgentCardGenerator();
    });
})();
