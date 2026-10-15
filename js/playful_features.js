/**
 * PWNBOX CYBER COMMAND - PLAYFUL FEATURES & SIGNATURE ENGINE
 * Features:
 * 1. Stamp Sound & Interaction (Pranav Pushya Signature Stamp)
 * 2. "Breach the Mainframe" 5-Second Rapid Hack Mini-Game
 * 3. Real-Time Global Cyber Threat Radar & EMP Interceptor
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

    function playStampSfx() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            // Mechanical chunk + bass thud
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

            // Paper slap click
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
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        } catch (e) {}
    }

    function playVictorySfx() {
        setTimeout(() => playTone(523.25, 'triangle', 0.15, 0.1), 0);
        setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.1), 120);
        setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.12), 240);
        setTimeout(() => playTone(1046.50, 'triangle', 0.4, 0.15), 360);
    }

    function playAlarmSfx() {
        playTone(320, 'sawtooth', 0.1, 0.12);
        setTimeout(() => playTone(240, 'sawtooth', 0.15, 0.12), 100);
    }

    // --- 1. SIGNATURE STAMP INTERACTION ---
    function initStamp() {
        const stamp = document.getElementById('pranavStamp');
        if (!stamp) return;

        stamp.addEventListener('click', () => {
            playStampSfx();
            stamp.classList.remove('stamp-slam');
            void stamp.offsetWidth; // Reflow
            stamp.classList.add('stamp-slam');

            // Quick ink particle burst
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

    // --- 2. "BREACH THE MAINFRAME" 5-SECOND MINI-GAME ---
    let gameTimer = null;
    let timeLeft = 5.0;
    let targetCipher = '';
    let isGameRunning = false;

    const hexPool = ['0x8F', '0x4A', '0x1B', '0x9E', '0x7C', '0xD3', '0x55', '0x2A', '0xE1', '0x6B', '0x3D', '0xFA'];

    function initBreachGame() {
        const btnStart = document.getElementById('btnStartBreach');
        const optionsContainer = document.getElementById('breachOptions');
        if (!btnStart || !optionsContainer) return;

        btnStart.addEventListener('click', startBreach);
    }

    function startBreach() {
        if (isGameRunning) return;
        isGameRunning = true;
        timeLeft = 5.0;

        const btnStart = document.getElementById('btnStartBreach');
        const timerText = document.getElementById('breachTimerText');
        const timerBar = document.getElementById('breachTimerBar');
        const statusText = document.getElementById('breachStatus');
        const targetDisplay = document.getElementById('breachTargetCode');
        const optionsContainer = document.getElementById('breachOptions');

        btnStart.disabled = true;
        btnStart.textContent = 'BREACHING...';
        statusText.textContent = 'BYPASSING FIREWALL... SELECT MATCHING TARGET CIPHER!';
        statusText.style.color = 'var(--text-main)';

        // Pick 1 target and 3 distractors
        const shuffled = [...hexPool].sort(() => 0.5 - Math.random());
        const choices = shuffled.slice(0, 4);
        targetCipher = choices[Math.floor(Math.random() * choices.length)];
        targetDisplay.textContent = targetCipher;
        targetDisplay.classList.add('pulse-cipher');

        playTone(440, 'square', 0.08);

        // Render 4 option buttons
        optionsContainer.innerHTML = '';
        choices.forEach(code => {
            const btn = document.createElement('button');
            btn.className = 'breach-node-btn';
            btn.textContent = code;
            btn.addEventListener('click', () => handleNodeClick(code, btn));
            optionsContainer.appendChild(btn);
        });

        // Run countdown
        const startTime = Date.now();
        const duration = 5000;

        if (gameTimer) clearInterval(gameTimer);
        gameTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            timeLeft = Math.max(0, (duration - elapsed) / 1000);
            timerText.textContent = timeLeft.toFixed(2) + 's';
            const pct = (timeLeft / 5) * 100;
            timerBar.style.width = pct + '%';

            if (timeLeft <= 1.5) {
                timerBar.style.background = 'var(--bauhaus-red)';
            } else {
                timerBar.style.background = 'var(--bauhaus-yellow)';
            }

            if (timeLeft <= 0) {
                endBreach(false);
            }
        }, 30);
    }

    function handleNodeClick(code, btn) {
        if (!isGameRunning) return;
        if (code === targetCipher) {
            btn.classList.add('node-correct');
            endBreach(true);
        } else {
            btn.classList.add('node-wrong');
            playTone(180, 'sawtooth', 0.12);
            timeLeft = Math.max(0, timeLeft - 1.2); // Penalty
        }
    }

    function endBreach(won) {
        clearInterval(gameTimer);
        isGameRunning = false;

        const btnStart = document.getElementById('btnStartBreach');
        const statusText = document.getElementById('breachStatus');
        const targetDisplay = document.getElementById('breachTargetCode');
        const timerText = document.getElementById('breachTimerText');
        const timerBar = document.getElementById('breachTimerBar');

        btnStart.disabled = false;
        btnStart.textContent = '⚡ TRY AGAIN';
        targetDisplay.classList.remove('pulse-cipher');

        if (won) {
            playVictorySfx();
            statusText.innerHTML = '<span style="color: #10b981; font-weight: 800;">✓ ACCESS GRANTED! MAINFRAME COMPROMISED. ACCREDITATION: PRANAV PUSHYA</span>';
            timerText.textContent = 'CLEAR!';
            timerBar.style.width = '100%';
            timerBar.style.background = '#10b981';

            // Confetti
            if (window.triggerHeroConfetti) {
                window.triggerHeroConfetti();
            }
        } else {
            playAlarmSfx();
            statusText.innerHTML = '<span style="color: var(--bauhaus-red); font-weight: 800;">✕ LOCKOUT DETECTED! INTRUSION DETECTED & TRACED.</span>';
            timerText.textContent = '0.00s';
            timerBar.style.width = '0%';
        }
    }

    // --- 3. REAL-TIME CYBER THREAT RADAR & EMP ---
    let radarCanvas = null;
    let radarCtx = null;
    let radarAngle = 0;
    let threats = [];
    let radarAnimationId = null;

    const simulatedThreats = [
        { type: 'PORT SCAN', ip: '185.220.101.5', port: '445 (SMB)', status: 'BLOCKED' },
        { type: 'SQL INJECTION', ip: '91.240.118.2', port: '80 (HTTP)', status: 'DEFLECTED' },
        { type: 'BRUTE FORCE', ip: '45.155.205.23', port: '22 (SSH)', status: 'THROTTLED' },
        { type: 'RANSOMWARE PROBE', ip: '194.26.29.11', port: '3389 (RDP)', status: 'CONTAINED' },
        { type: 'XSS ATTEMPT', ip: '103.145.13.9', port: '443 (HTTPS)', status: 'SANITIZED' },
        { type: 'DNS EXFILTRATION', ip: '198.51.100.4', port: '53 (DNS)', status: 'SPOOFED' }
    ];

    function initRadar() {
        radarCanvas = document.getElementById('threatRadarCanvas');
        if (!radarCanvas) return;
        radarCtx = radarCanvas.getContext('2d');
        resizeRadar();
        window.addEventListener('resize', resizeRadar);

        // Spawn initial threats
        for (let i = 0; i < 5; i++) spawnThreat();

        setInterval(() => {
            if (threats.length < 8) spawnThreat();
        }, 2200);

        renderRadar();

        const btnEmp = document.getElementById('btnFireEmp');
        if (btnEmp) {
            btnEmp.addEventListener('click', fireEmpCountermeasure);
        }
    }

    function resizeRadar() {
        if (!radarCanvas) return;
        const box = radarCanvas.parentElement.getBoundingClientRect();
        const dim = Math.min(box.width, 320);
        radarCanvas.width = dim;
        radarCanvas.height = dim;
    }

    function spawnThreat() {
        const radius = Math.random() * 0.7 + 0.15;
        const angle = Math.random() * Math.PI * 2;
        const threatMeta = simulatedThreats[Math.floor(Math.random() * simulatedThreats.length)];

        threats.push({
            r: radius,
            angle: angle,
            alpha: 1.0,
            meta: threatMeta,
            time: Date.now()
        });

        // Append to ticker log
        appendTicker(threatMeta);
    }

    function appendTicker(meta) {
        const ticker = document.getElementById('radarTickerLogs');
        if (!ticker) return;

        const row = document.createElement('div');
        row.className = 'ticker-log-item';
        row.innerHTML = `<span class="ticker-status">[${meta.status}]</span> <span class="ticker-type">${meta.type}</span> from <span class="ticker-ip">${meta.ip}</span> &rarr; Port ${meta.port}`;
        ticker.prepend(row);

        while (ticker.children.length > 5) {
            ticker.removeChild(ticker.lastChild);
        }
    }

    function renderRadar() {
        if (!radarCanvas || !radarCtx) return;
        const w = radarCanvas.width;
        const h = radarCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const maxR = w / 2 - 10;

        radarCtx.clearRect(0, 0, w, h);

        // Grid rings
        radarCtx.strokeStyle = 'rgba(0, 200, 215, 0.25)';
        radarCtx.lineWidth = 1.5;
        [0.25, 0.5, 0.75, 1.0].forEach(factor => {
            radarCtx.beginPath();
            radarCtx.arc(cx, cy, maxR * factor, 0, Math.PI * 2);
            radarCtx.stroke();
        });

        // Crosshairs
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy - maxR);
        radarCtx.lineTo(cx, cy + maxR);
        radarCtx.moveTo(cx - maxR, cy);
        radarCtx.lineTo(cx + maxR, cy);
        radarCtx.stroke();

        // Sweep cone
        radarAngle += 0.035;
        const sweepGrad = radarCtx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        sweepGrad.addColorStop(0, 'rgba(0, 255, 170, 0.25)');
        sweepGrad.addColorStop(1, 'rgba(0, 255, 170, 0.0)');

        radarCtx.save();
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy);
        radarCtx.arc(cx, cy, maxR, radarAngle - 0.5, radarAngle);
        radarCtx.closePath();
        radarCtx.fillStyle = sweepGrad;
        radarCtx.fill();
        radarCtx.restore();

        // Sweep leading line
        radarCtx.strokeStyle = '#00ffaa';
        radarCtx.lineWidth = 2;
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy);
        radarCtx.lineTo(cx + Math.cos(radarAngle) * maxR, cy + Math.sin(radarAngle) * maxR);
        radarCtx.stroke();

        // Render threat pings
        threats.forEach(t => {
            const tx = cx + Math.cos(t.angle) * (t.r * maxR);
            const ty = cy + Math.sin(t.angle) * (t.r * maxR);

            radarCtx.fillStyle = 'rgba(217, 41, 28, 0.85)';
            radarCtx.beginPath();
            radarCtx.arc(tx, ty, 4.5, 0, Math.PI * 2);
            radarCtx.fill();

            // Threat glow
            radarCtx.strokeStyle = 'rgba(217, 41, 28, 0.4)';
            radarCtx.beginPath();
            radarCtx.arc(tx, ty, 8, 0, Math.PI * 2);
            radarCtx.stroke();
        });

        radarAnimationId = requestAnimationFrame(renderRadar);
    }

    function fireEmpCountermeasure() {
        playEmpSfx();
        threats = []; // Wipe all threats
        const scoreEl = document.getElementById('threatInterceptCount');
        if (scoreEl) {
            const current = parseInt(scoreEl.textContent, 10) || 0;
            scoreEl.textContent = (current + 8).toString();
        }

        const flash = document.getElementById('radarFlashOverlay');
        if (flash) {
            flash.classList.remove('emp-active');
            void flash.offsetWidth;
            flash.classList.add('emp-active');
        }

        appendTicker({
            type: 'EMP COUNTERMEASURE',
            ip: 'PRANAV-CORE',
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
            // Check Konami Code
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

            // Check Typed Words: hack, matrix, pranav
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

        // Load existing alias if stored
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

                // Save to local storage for dashboard sync
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
