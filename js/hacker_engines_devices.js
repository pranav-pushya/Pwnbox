/**
 * Hacker Search Engines & Tactical Hardware Devices Controller
 * Handles dual tab view switching, category filtering, live searching, and clipboard feedback.
 */

function playEngineSound(type = 'click') {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'copy') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'tab') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(329.63, now); // E4
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.1); // A4
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    } catch (e) {
        // AudioContext not available without user interaction
    }
}

function showEngineToast(msg) {
    const toast = document.getElementById('enginesToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._engineToastTimer);
    window._engineToastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function copyEngineText(text) {
    navigator.clipboard.writeText(text).then(() => {
        playEngineSound('copy');
        showEngineToast(`COPIED: "${text}"`);
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        playEngineSound('copy');
        showEngineToast(`COPIED: "${text}"`);
    });
}

function initViewTabs() {
    const tabBtns = document.querySelectorAll('.view-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content-panel');
    const filterPillsRow = document.getElementById('filterPillsRow');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            playEngineSound('tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanels.forEach(panel => {
                if (panel.id === `${targetTab}Panel`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });

            // Switch available filter pills based on tab
            updateFilterPills(targetTab);
            applyAllFilters();
        });
    });
}

// Dynamic Filter Pills for Devices vs Engines
const DEVICE_FILTERS = [
    { label: "⚡ All Devices (10)", cat: "all" },
    { label: "📡 Wi-Fi & RF", cat: "rf" },
    { label: "⌨️ HID & BadUSB", cat: "hid" },
    { label: "🔌 Network Implants", cat: "network" },
    { label: "💳 RFID & NFC", cat: "rfid" }
];

const ENGINE_FILTERS = [
    { label: "⚡ All Engines (32)", cat: "all" },
    { label: "🌐 IoT & Cyberspace", cat: "iot" },
    { label: "🛡️ Attack Surface & Threat", cat: "threat" },
    { label: "🔐 Leaks & Credentials", cat: "leaks" },
    { label: "🔎 DNS & Certs", cat: "dns" },
    { label: "💻 Code & API", cat: "code" },
    { label: "🧬 Malware & Exploits", cat: "malware" },
    { label: "👤 OSINT & Wireless", cat: "osint" }
];

let activeCategory = 'all';
let activeSearchQuery = '';

function updateFilterPills(tabType) {
    const container = document.getElementById('filterPillsRow');
    if (!container) return;

    container.innerHTML = '';
    const filters = (tabType === 'devices') ? DEVICE_FILTERS : ENGINE_FILTERS;
    activeCategory = 'all';

    filters.forEach((f, idx) => {
        const pill = document.createElement('button');
        pill.className = `filter-pill ${idx === 0 ? 'active' : ''}`;
        pill.textContent = f.label;
        pill.setAttribute('data-category', f.cat);
        pill.addEventListener('click', () => {
            playEngineSound('click');
            container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategory = f.cat;
            applyAllFilters();
        });
        container.appendChild(pill);
    });
}

function applyAllFilters() {
    const activeTabBtn = document.querySelector('.view-tab-btn.active');
    const isDevicesTab = activeTabBtn && activeTabBtn.getAttribute('data-tab') === 'devices';

    if (isDevicesTab) {
        let count = 0;
        const deviceCards = document.querySelectorAll('.device-card');
        deviceCards.forEach(card => {
            const cat = card.getAttribute('data-cat') || '';
            const text = card.textContent.toLowerCase();

            const matchesCat = (activeCategory === 'all' || cat.includes(activeCategory));
            const matchesSearch = !activeSearchQuery || text.includes(activeSearchQuery);

            if (matchesCat && matchesSearch) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });
        const statElem = document.getElementById('activeViewCount');
        if (statElem) statElem.textContent = `${count} Devices`;
    } else {
        let count = 0;
        const engineCards = document.querySelectorAll('.engine-card');
        engineCards.forEach(card => {
            const cat = card.getAttribute('data-cat') || '';
            const text = card.textContent.toLowerCase();

            const matchesCat = (activeCategory === 'all' || cat.includes(activeCategory));
            const matchesSearch = !activeSearchQuery || text.includes(activeSearchQuery);

            if (matchesCat && matchesSearch) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });
        const statElem = document.getElementById('activeViewCount');
        if (statElem) statElem.textContent = `${count} Engines`;
    }
}

function initSearchInput() {
    const input = document.getElementById('enginesSearchInput');
    if (!input) return;

    input.addEventListener('input', (e) => {
        activeSearchQuery = e.target.value.toLowerCase().trim();
        applyAllFilters();
    });
}

function initDeviceInteractivity() {
    // 3D Perspective Tilt on Hover for Device Frames
    document.querySelectorAll('.device-img-frame').forEach(frame => {
        const img = frame.querySelector('img');
        
        frame.addEventListener('mousemove', (e) => {
            const rect = frame.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = -(y / rect.height) * 16;
            const rotateY = (x / rect.width) * 16;
            if (img) {
                img.style.animation = 'none';
                img.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.12)`;
            }
        });

        frame.addEventListener('mouseleave', () => {
            if (img) {
                img.style.animation = 'deviceFloatAnim 4.5s ease-in-out infinite';
                img.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
            }
        });

        // Clicking specifically on the image frame opens the Fullscreen 3D Model Viewer!
        frame.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = frame.closest('.device-card');
            if (!card) return;
            const name = card.querySelector('.device-name')?.textContent || 'Device';
            const vendor = card.querySelector('.device-vendor')?.textContent || '';
            const imgSrc = img?.src || '';
            open3DViewer(imgSrc, name, vendor);
        });
    });

    // Clicking [🔬 Full Intel & Specs] button opens the Tactical Detail Modal!
    document.querySelectorAll('.btn-inspect-device').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.device-card');
            if (!card) return;
            openDeviceInspectModal(card);
        });
    });
}

function openDeviceInspectModal(card) {
    const modal = document.getElementById('deviceInspectModal');
    if (!modal) return;

    playEngineSound('tab');

    const name = card.querySelector('.device-name')?.textContent || 'Device';
    const vendor = card.querySelector('.device-vendor')?.textContent || '';
    const img = card.querySelector('.device-img-frame img')?.src || '';
    const summary = card.querySelector('.device-core-summary')?.textContent || '';
    const intel = card.querySelector('.device-tech-intel')?.textContent || '';
    const specsHtml = card.querySelector('.device-spec-box')?.innerHTML || '';
    const vectorsHtml = card.querySelector('.device-intel-grid')?.innerHTML || '';

    modal.querySelector('.modal-device-name').textContent = `${name} ${vendor}`;
    modal.querySelector('.modal-img-stage img').src = img;
    modal.querySelector('.modal-img-stage img').alt = name;
    modal.querySelector('.modal-summary-text').textContent = summary;
    modal.querySelector('.modal-tech-desc').textContent = intel;
    modal.querySelector('.modal-spec-container').innerHTML = specsHtml;
    modal.querySelector('.modal-vector-container').innerHTML = vectorsHtml;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDeviceInspectModal() {
    const modal = document.getElementById('deviceInspectModal');
    if (!modal) return;
    playEngineSound('click');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function copyCurrentModalIntel() {
    const modal = document.getElementById('deviceInspectModal');
    if (!modal) return;
    const name = modal.querySelector('.modal-device-name')?.textContent || '';
    const summary = modal.querySelector('.modal-summary-text')?.textContent || '';
    const text = `${name} - ${summary}`;
    copyEngineText(text);
}

// ==========================================================================
// FULLSCREEN 3D MODEL VIEWER & THEME MESH LAB (THREE.JS + D3.JS TELEMETRY)
// ==========================================================================
const viewer3D = {
    active: false,
    renderer: null,
    scene: null,
    camera: null,
    animId: null,
    deviceGroup: null,
    explodedParts: [],
    floorMesh: null,
    ceilingMesh: null,
    particles: null,
    radarGrid: null,
    autoRotate: true,
    isDragging: false,
    pointerStart: { x: 0, y: 0 },
    currentRotation: { x: 0.15, y: 0 },
    targetRotation: { x: 0.15, y: 0 },
    cameraDistance: 6.5,
    targetCameraDistance: 6.5,
    minDistance: 2.2,
    maxDistance: 12.0,
    clock: null,
    textureLoader: null,
    currentImgSrc: null,
    currentDeviceName: '',
    currentDevKey: 'wifi_pineapple',
    currentMode: '3d', // '3d', 'spectrum', 'topology'
    exploded: false,
    explodeProgress: 0,
    animatedUpdaters: [],
    d3SpectrumTimer: null,
    d3Simulation: null
};

// ==========================================================================
// DYNAMIC PROCEDURAL TEXTURES (ANIMATED CYBER LCDS & DETAILED PCBS)
// ==========================================================================

function getDeviceKey(name = '', imgSrc = '') {
    const s = (name + ' ' + imgSrc).toLowerCase();
    if (s.includes('pineapple')) return 'wifi_pineapple';
    if (s.includes('flipper')) return 'flipper_zero';
    if (s.includes('ducky')) return 'usb_rubber_ducky';
    if (s.includes('nethunter') || s.includes('kali')) return 'kali_nethunter';
    if (s.includes('bunny')) return 'bash_bunny';
    if (s.includes('turtle')) return 'lan_turtle';
    if (s.includes('omg') || s.includes('cable')) return 'omg_cable';
    if (s.includes('squirrel')) return 'packet_squirrel';
    if (s.includes('proxmark')) return 'proxmark3';
    if (s.includes('evil') || s.includes('portal')) return 'evil_portal';
    return 'wifi_pineapple';
}
window.getDeviceKey = getDeviceKey;

// 1. Flipper Zero Animated LCD Screen (Cyber-Dolphin Mascot & Sub-GHz Readout)
function createFlipperLcdTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    let frame = 0;
    function update(elapsed) {
        frame++;
        // Flipper signature vibrant orange backlight
        ctx.fillStyle = '#ff8400';
        ctx.fillRect(0, 0, 512, 256);

        // Pixel grid matrix effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let y = 0; y < 256; y += 4) {
            ctx.fillRect(0, y, 512, 1);
        }

        // Inner display frame border
        ctx.strokeStyle = '#1a0d00';
        ctx.lineWidth = 4;
        ctx.strokeRect(8, 8, 496, 240);

        // Cyber-Dolphin Mascot Drawing
        ctx.fillStyle = '#1a0d00';
        const dolphinY = 120 + Math.sin(elapsed * 4) * 6;
        
        // Dolphin Body
        ctx.beginPath();
        ctx.ellipse(120, dolphinY, 55, 30, -0.15, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.beginPath();
        ctx.moveTo(170, dolphinY - 5);
        ctx.lineTo(200, dolphinY + 2);
        ctx.lineTo(165, dolphinY + 14);
        ctx.fill();

        // Dorsal Fin
        ctx.beginPath();
        ctx.moveTo(110, dolphinY - 26);
        ctx.lineTo(95, dolphinY - 52);
        ctx.lineTo(135, dolphinY - 24);
        ctx.fill();

        // Tail flukes
        const tailFlap = Math.sin(elapsed * 8) * 8;
        ctx.beginPath();
        ctx.moveTo(70, dolphinY + 4);
        ctx.lineTo(35, dolphinY - 14 + tailFlap);
        ctx.lineTo(45, dolphinY + 4);
        ctx.lineTo(32, dolphinY + 24 - tailFlap);
        ctx.fill();

        // Blinking Eye
        const isBlinking = (Math.floor(elapsed * 2) % 6 === 0);
        ctx.fillStyle = '#ff8400';
        if (isBlinking) {
            ctx.fillRect(160, dolphinY - 6, 8, 2);
        } else {
            ctx.beginPath();
            ctx.arc(162, dolphinY - 6, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Cyber Dolphin expression: Tamagotchi smile
        ctx.strokeStyle = '#ff8400';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(178, dolphinY + 3, 6, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // HUD Technical Readouts
        ctx.fillStyle = '#1a0d00';
        ctx.font = 'bold 22px "Space Mono", monospace';
        ctx.fillText('SUB-GHZ RX // ACTIVE', 215, 48);

        ctx.font = 'bold 36px "Space Mono", monospace';
        ctx.fillText('433.92 MHz', 215, 96);

        ctx.font = '16px "Space Mono", monospace';
        ctx.fillText('MOD: AM650  RSSI: -44dBm', 215, 132);
        ctx.fillText('HOPPING: CH 01-14 [LOCK]', 215, 158);

        // Dynamic Frequency Spectrum Bars on Screen
        for (let i = 0; i < 18; i++) {
            const h = Math.abs(Math.sin(elapsed * 3 + i * 0.45)) * 45 + 5;
            ctx.fillRect(215 + i * 15, 225 - h, 11, h);
        }

        texture.needsUpdate = true;
    }

    return { texture, update };
}

// 2. Kali NetHunter Live Animated Linux Terminal Texture
function createKaliTerminalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const terminalLines = [
        '[+] Kali NetHunter 2026.4 Kernel 6.8.0-kali-arm64',
        '[+] Interface wlan0mon injected into promiscuous mode',
        '[*] BSSID [18:64:72:A1:BC:0F] PWR: -36dBm CH: 6 ESSID: Corp_CorpNet',
        '[!] Deauth packet broadcast sent: 128 pkts/sec',
        '[+] WPA2 4-Way Handshake Captured: [0x8f2a...e9b1]',
        '[*] Launching DuckHunter BadUSB HID payload: [revshell.ps1]',
        '[+] Keystroke rate: 1,200 WPM - UAC bypass triggered',
        '[+] Reverse TCP shell opened: 10.0.0.1:4444 -> ROOT SHELL',
        'root@kali:~# listening on [any] 4444 ...'
    ];

    function update(elapsed) {
        // Deep cyber slate background
        ctx.fillStyle = '#060a12';
        ctx.fillRect(0, 0, 512, 512);

        // Kali Dragon Crest Watermark
        ctx.fillStyle = 'rgba(0, 200, 215, 0.08)';
        ctx.beginPath();
        ctx.arc(256, 256, 160, 0, Math.PI * 2);
        ctx.fill();

        // Terminal Top Bar
        ctx.fillStyle = '#0d1527';
        ctx.fillRect(0, 0, 512, 38);
        ctx.fillStyle = '#ff3344'; ctx.beginPath(); ctx.arc(20, 19, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f2a900'; ctx.beginPath(); ctx.arc(38, 19, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00ffcc'; ctx.beginPath(); ctx.arc(56, 19, 5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 13px "Space Mono", monospace';
        ctx.fillText('root@nethunter: ~ (wlan0mon) - [KALI LINUX]', 80, 24);

        // Render Scrolling Console Logs
        ctx.font = '14px "Space Mono", monospace';
        const lineOffset = (elapsed * 1.5) % terminalLines.length;
        const startIdx = Math.floor(lineOffset);

        for (let i = 0; i < 16; i++) {
            const lIdx = (startIdx + i) % terminalLines.length;
            const text = terminalLines[lIdx];
            const y = 70 + i * 26;

            if (text.startsWith('[+]')) {
                ctx.fillStyle = '#00ffcc';
            } else if (text.startsWith('[!]')) {
                ctx.fillStyle = '#ff3344';
            } else if (text.startsWith('[*]')) {
                ctx.fillStyle = '#38bdf8';
            } else {
                ctx.fillStyle = '#f8fafc';
            }
            ctx.fillText(text, 18, y);
        }

        // Blinking cursor
        if (Math.floor(elapsed * 3) % 2 === 0) {
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(18, 485, 12, 18);
        }

        texture.needsUpdate = true;
    }

    return { texture, update };
}

// 3. High-Detail Cyber Motherboard / Multi-Layer PCB Texture
function createDetailedPCBTexture(boardColor = '#060a14', traceColor = '#e6b800') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = boardColor;
    ctx.fillRect(0, 0, 512, 512);

    // Ground plane vias
    ctx.fillStyle = '#00c8d7';
    for (let x = 16; x < 512; x += 28) {
        for (let y = 16; y < 512; y += 28) {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // High-speed gold bus traces
    ctx.strokeStyle = traceColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(30, 80); ctx.lineTo(120, 80); ctx.lineTo(180, 140); ctx.lineTo(320, 140);
    ctx.moveTo(60, 200); ctx.lineTo(160, 200); ctx.lineTo(210, 250); ctx.lineTo(390, 250);
    ctx.moveTo(340, 60); ctx.lineTo(430, 60); ctx.lineTo(470, 100); ctx.lineTo(470, 260);
    ctx.moveTo(80, 420); ctx.lineTo(220, 420); ctx.lineTo(280, 360); ctx.lineTo(450, 360);
    ctx.stroke();

    // Secondary cyan differential traces
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(40, 280); ctx.lineTo(130, 280); ctx.lineTo(180, 330); ctx.lineTo(340, 330);
    ctx.moveTo(250, 40); ctx.lineTo(250, 110); ctx.lineTo(290, 150);
    ctx.stroke();

    // Central BGA processor package
    ctx.fillStyle = '#0b0f19';
    ctx.strokeStyle = '#00c8d7';
    ctx.lineWidth = 2;
    ctx.fillRect(176, 176, 160, 160);
    ctx.strokeRect(176, 176, 160, 160);

    // Gold IC Lead Pins
    ctx.fillStyle = '#d4af37';
    for (let i = 0; i < 7; i++) {
        ctx.fillRect(160, 190 + i * 19, 14, 8);
        ctx.fillRect(338, 190 + i * 19, 14, 8);
        ctx.fillRect(190 + i * 19, 160, 8, 14);
        ctx.fillRect(190 + i * 19, 338, 8, 14);
    }

    // Laser Silkscreen labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PWNBOX // LAB CORE', 256, 235);
    ctx.fillStyle = '#00ffcc';
    ctx.font = 'bold 11px "Space Mono", monospace';
    ctx.fillText('HARDWARE EXPLOIT ENGINE', 256, 260);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('FCC-ID: 2A3X-HAK5 // MIL-STD-810G', 256, 282);

    ctx.strokeStyle = 'rgba(0, 200, 215, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, 480, 480);

    return new THREE.CanvasTexture(canvas);
}

// Helper: Common Hardware Elements
function createUSBAConnector() {
    const group = new THREE.Group();
    // Metal outer sleeve
    const sleeveGeo = new THREE.BoxGeometry(1.3, 0.52, 1.1);
    const sleeveMat = new THREE.MeshStandardMaterial({
        color: 0xd8e0e8,
        metalness: 0.95,
        roughness: 0.22
    });
    const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
    group.add(sleeve);

    // Inner white/black dielectric tongue
    const tongueGeo = new THREE.BoxGeometry(1.22, 0.14, 0.9);
    const tongueMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const tongue = new THREE.Mesh(tongueGeo, tongueMat);
    tongue.position.set(0, 0.12, 0.05);
    group.add(tongue);

    // 4 Gold pin contacts
    for (let i = 0; i < 4; i++) {
        const pinGeo = new THREE.BoxGeometry(0.12, 0.03, 0.45);
        const pinMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.98, roughness: 0.15 });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(-0.35 + i * 0.23, 0.19, 0.22);
        group.add(pin);
    }
    return group;
}

function createRJ45Port() {
    const group = new THREE.Group();
    // Metal shielded jack outer
    const portGeo = new THREE.BoxGeometry(0.9, 0.75, 0.85);
    const portMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.3 });
    const port = new THREE.Mesh(portGeo, portMat);
    group.add(port);

    // Dark cavity interior
    const cavGeo = new THREE.BoxGeometry(0.72, 0.55, 0.5);
    const cavMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const cav = new THREE.Mesh(cavGeo, cavMat);
    cav.position.z = 0.22;
    group.add(cav);

    // Internal copper wire contacts
    for (let i = 0; i < 8; i++) {
        const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35);
        const wireMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 });
        const wire = new THREE.Mesh(wireGeo, wireMat);
        wire.rotation.x = Math.PI / 4;
        wire.position.set(-0.25 + i * 0.07, 0.05, 0.25);
        group.add(wire);
    }
    return group;
}

function createStatusLED(colorHex, label = '') {
    const ledGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const domeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 1.6,
        roughness: 0.2
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    ledGroup.add(dome);

    const light = new THREE.PointLight(colorHex, 0.65, 2.5);
    light.position.set(0, 0.05, 0);
    ledGroup.add(light);

    return { ledGroup, domeMat, light };
}

function registerPart(root, mesh, normalY, explodedY) {
    mesh.position.y = normalY;
    root.add(mesh);
    viewer3D.explodedParts.push({ mesh, normalY, explodedY });
}

// ==========================================================================
// PROCEDURAL 3D HARDWARE MODEL BUILDERS (ALL 10 PHYSICAL DEVICES)
// ==========================================================================

// 1. WiFi Pineapple (Hak5) - Dual Band Tactical Wireless Audit Platform
function buildWiFiPineapple3D(root) {
    // A. Bottom Chassis (Tactical Matte Slate)
    const botGeo = new THREE.BoxGeometry(4.4, 0.45, 3.2);
    const darkChassisMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.45,
        metalness: 0.35
    });
    const botChassis = new THREE.Mesh(botGeo, darkChassisMat);
    registerPart(root, botChassis, -0.3, -1.5);

    // B. Internal PCB Motherboard with PineAP SoC & Radio Modules
    const pcbGeo = new THREE.BoxGeometry(4.1, 0.08, 2.9);
    const pcbTex = createDetailedPCBTexture('#064e3b', '#e6b800');
    const pcbMat = new THREE.MeshStandardMaterial({
        map: pcbTex,
        roughness: 0.35,
        metalness: 0.45
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    
    // Add Aluminum Heatsink on PineAP SoC
    const sinkGeo = new THREE.BoxGeometry(1.2, 0.3, 1.2);
    const sinkMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const sink = new THREE.Mesh(sinkGeo, sinkMat);
    sink.position.set(-0.6, 0.18, 0);
    pcb.add(sink);

    registerPart(root, pcb, 0, 0);

    // C. Top Chassis with Cooling Slits & Embossed Emblem
    const topGeo = new THREE.BoxGeometry(4.4, 0.45, 3.2);
    const topChassis = new THREE.Mesh(topGeo, darkChassisMat);
    
    // Hak5 Emblem Badge on Top
    const badgeGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 32);
    const badgeMat = new THREE.MeshStandardMaterial({
        color: 0x00c8d7,
        emissive: 0x00c8d7,
        emissiveIntensity: 0.45,
        metalness: 0.8,
        roughness: 0.2
    });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0, 0.24, 0);
    topChassis.add(badge);

    // Ventilation Grooves
    for (let i = 0; i < 5; i++) {
        const ventGeo = new THREE.BoxGeometry(1.4, 0.05, 0.08);
        const ventMat = new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.9 });
        const vent = new THREE.Mesh(ventGeo, ventMat);
        vent.position.set(0.9, 0.24, -0.6 + i * 0.3);
        topChassis.add(vent);
    }

    registerPart(root, topChassis, 0.3, 1.5);

    // D. Dual Articulated High-Gain RP-SMA Dipole Antennas
    const antennaGroup = new THREE.Group();
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.2 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

    // Left Antenna
    const mountLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 16), brassMat);
    mountLeft.position.set(-1.4, 0.3, -1.5);
    const elbowLeft = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), brassMat);
    elbowLeft.position.set(0, 0.25, 0);
    mountLeft.add(elbowLeft);
    const mastLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 3.6, 16), rubberMat);
    mastLeft.position.set(0, 1.8, 0);
    mastLeft.rotation.z = 0.12;
    mountLeft.add(mastLeft);
    antennaGroup.add(mountLeft);

    // Right Antenna
    const mountRight = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 16), brassMat);
    mountRight.position.set(1.4, 0.3, -1.5);
    const elbowRight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), brassMat);
    elbowRight.position.set(0, 0.25, 0);
    mountRight.add(elbowRight);
    const mastRight = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 3.6, 16), rubberMat);
    mastRight.position.set(0, 1.8, 0);
    mastRight.rotation.z = -0.12;
    mountRight.add(mastRight);
    antennaGroup.add(mountRight);

    registerPart(root, antennaGroup, 0.25, 2.2);

    // E. Front Panel Ports & LED Array
    const frontGroup = new THREE.Group();
    // RJ45 Port
    const rj45 = createRJ45Port();
    rj45.position.set(-1.1, 0, 1.6);
    frontGroup.add(rj45);

    // USB Host Port
    const usb = createUSBAConnector();
    usb.position.set(-0.1, 0, 1.6);
    usb.rotation.y = Math.PI;
    frontGroup.add(usb);

    // 4 Diagnostic Status LEDs
    const ledColors = [0x00ff66, 0x00c8d7, 0x0088ff, 0xff00aa];
    ledColors.forEach((col, idx) => {
        const { ledGroup, domeMat, light } = createStatusLED(col);
        ledGroup.position.set(0.8 + idx * 0.3, 0.05, 1.6);
        frontGroup.add(ledGroup);
        viewer3D.animatedUpdaters.push((elapsed) => {
            const pulse = (Math.sin(elapsed * 6 + idx * 1.5) + 1) * 0.5;
            domeMat.emissiveIntensity = 0.6 + pulse * 1.6;
            light.intensity = 0.4 + pulse * 0.8;
        });
    });

    registerPart(root, frontGroup, 0, 0.2);
}

// 2. Flipper Zero - Multi-Tool with Cyber-Dolphin LCD & Tamagotchi OS
function buildFlipperZero3D(root) {
    // A. Rear Ergonomic Shell in Matte Cyber-White
    const botGeo = new THREE.BoxGeometry(4.4, 1.85, 0.7);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.1 });
    const botShell = new THREE.Mesh(botGeo, whiteMat);
    
    // 1-Wire iButton Reader Contact Ring on rear
    const ringGeo = new THREE.RingGeometry(0.2, 0.45, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.15, side: THREE.DoubleSide });
    const iButtonRing = new THREE.Mesh(ringGeo, ringMat);
    iButtonRing.position.set(1.2, -0.2, -0.36);
    botShell.add(iButtonRing);

    registerPart(root, botShell, -0.35, -1.4);

    // B. Internal Motherboard with CC1101 Sub-GHz, NFC & STM32 Chips
    const pcbGeo = new THREE.BoxGeometry(4.1, 1.6, 0.08);
    const pcbTex = createDetailedPCBTexture('#022c22', '#f59e0b');
    const pcbMat = new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.3, metalness: 0.4 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    registerPart(root, pcb, 0, 0);

    // C. Front Cyber-White Shell with Orange Bumpers
    const frontGeo = new THREE.BoxGeometry(4.4, 1.85, 0.65);
    const frontShell = new THREE.Mesh(frontGeo, whiteMat);

    // Orange accent bumper trim
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.45 });
    const trimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.86, 0.68), orangeMat);
    trimLeft.position.x = -2.2;
    frontShell.add(trimLeft);

    const trimRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.86, 0.68), orangeMat);
    trimRight.position.x = 2.2;
    frontShell.add(trimRight);

    registerPart(root, frontShell, 0.35, 1.4);

    // D. Recessed Monochrome LCD Screen with Animated Cyber Dolphin
    const screenGroup = new THREE.Group();
    const screenBezel = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.35, 0.08), new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 }));
    screenBezel.position.set(-0.7, 0.08, 0.68);
    screenGroup.add(screenBezel);

    const { texture: flipperTex, update: flipperUpdate } = createFlipperLcdTexture();
    viewer3D.animatedUpdaters.push(flipperUpdate);

    const lcdGeo = new THREE.PlaneGeometry(2.15, 1.15);
    const lcdMat = new THREE.MeshBasicMaterial({ map: flipperTex });
    const lcd = new THREE.Mesh(lcdGeo, lcdMat);
    lcd.position.set(-0.7, 0.08, 0.73);
    screenGroup.add(lcd);

    // E. 5-Way Directional Navigation Pad Cluster
    const dpadBase = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.14, 32), new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 }));
    dpadBase.rotation.x = Math.PI / 2;
    dpadBase.position.set(1.25, 0.25, 0.72);
    screenGroup.add(dpadBase);

    // Center Action Button
    const dpadCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 24), orangeMat);
    dpadCenter.rotation.x = Math.PI / 2;
    dpadCenter.position.set(1.25, 0.25, 0.74);
    screenGroup.add(dpadCenter);

    // Back Button (Elliptical)
    const backBtn = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.14), new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 }));
    backBtn.position.set(1.25, -0.45, 0.72);
    screenGroup.add(backBtn);

    // F. Top 18-Pin GPIO Socket Header
    const gpioHeader = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.32, 0.36), new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 }));
    gpioHeader.position.set(0, 0.95, 0.05);
    for (let p = 0; p < 18; p++) {
        const pinHole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8), new THREE.MeshStandardMaterial({ color: 0x000000 }));
        pinHole.position.set(-1.6 + p * 0.19, 0.14, 0);
        gpioHeader.add(pinHole);
    }
    screenGroup.add(gpioHeader);

    // G. Top Dark Acrylic IR Transceiver Window
    const irWindow = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.15, 0.25), new THREE.MeshStandardMaterial({
        color: 0x2e0854,
        roughness: 0.1,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85
    }));
    irWindow.position.set(-1.45, 0.95, 0);
    screenGroup.add(irWindow);

    registerPart(root, screenGroup, 0, 1.8);
}

// 3. USB Rubber Ducky (Hak5) - Keystroke Injection BadUSB with RP2040 Chip
function buildRubberDucky3D(root) {
    // A. Translucent Smoky Polycarbonate Lower Case
    const botGeo = new THREE.BoxGeometry(3.2, 0.32, 1.35);
    const casingMat = new THREE.MeshPhysicalMaterial ? new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        roughness: 0.22,
        metalness: 0.1,
        transmission: 0.75,
        opacity: 0.88,
        transparent: true,
        ior: 1.45
    }) : new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.25,
        opacity: 0.85,
        transparent: true
    });

    const botCase = new THREE.Mesh(botGeo, casingMat);
    registerPart(root, botCase, -0.16, -1.2);

    // B. Internal Multi-Layer Green PCB with Gold Traces & RP2040
    const pcbGeo = new THREE.BoxGeometry(2.9, 0.08, 1.15);
    const pcbTex = createDetailedPCBTexture('#064e3b', '#eab308');
    const pcbMat = new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.3, metalness: 0.45 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);

    // RP2040 Microcontroller Chip
    const rp2040 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.65), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.8 }));
    rp2040.position.set(0.1, 0.08, 0);
    pcb.add(rp2040);

    // Micro-SD Card Slot & Card
    const sdSlot = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.68), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 }));
    sdSlot.position.set(-0.85, 0.08, 0);
    const sdCard = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.6), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 }));
    sdCard.position.set(-0.15, 0.04, 0);
    sdSlot.add(sdCard);
    pcb.add(sdSlot);

    // Pulsing RGB Payload Status LED
    const { ledGroup, domeMat, light } = createStatusLED(0x00ffcc);
    ledGroup.position.set(0.75, 0.08, 0.25);
    pcb.add(ledGroup);

    viewer3D.animatedUpdaters.push((elapsed) => {
        // Attack pulse cycle: Green (armed) -> Cyan/Red (injecting)
        const cycle = Math.sin(elapsed * 4);
        if (cycle > 0) {
            domeMat.color.setHex(0x00ffcc);
            domeMat.emissive.setHex(0x00ffcc);
            light.color.setHex(0x00ffcc);
        } else {
            domeMat.color.setHex(0x22c55e);
            domeMat.emissive.setHex(0x22c55e);
            light.color.setHex(0x22c55e);
        }
        domeMat.emissiveIntensity = 1.0 + Math.abs(cycle) * 1.5;
    });

    // Tactile push-button for payload trigger
    const btn = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, 0.25), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8 }));
    btn.position.set(-0.25, 0.09, -0.35);
    pcb.add(btn);

    registerPart(root, pcb, 0, 0);

    // C. Translucent Top Casing with Rubber Ducky Badge
    const topCase = new THREE.Mesh(botGeo, casingMat);
    // Yellow Duck Silkscreen Badge
    const duckBadge = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.6), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }));
    duckBadge.position.set(0.1, 0.17, 0);
    topCase.add(duckBadge);

    registerPart(root, topCase, 0.16, 1.2);

    // D. Stainless Steel USB-A Connector Head
    const usb = createUSBAConnector();
    usb.position.set(2.0, 0, 0);
    usb.rotation.y = Math.PI / 2;
    registerPart(root, usb, 0, 0);
}

// 4. Kali NetHunter - Tactical Mobile Smartphone with Live Terminal & SDR Dongle
function buildNetHunter3D(root) {
    // A. Slim Aluminum Perimeter Frame & Dark Glass Rear
    const phoneGeo = new THREE.BoxGeometry(3.2, 5.8, 0.4);
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3, metalness: 0.85 });
    const phone = new THREE.Mesh(phoneGeo, phoneMat);

    // Camera Bump with Dual Lenses & Flash
    const camBump = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 0.12), new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.9, roughness: 0.2 }));
    camBump.position.set(-0.85, 1.8, -0.25);
    const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95, roughness: 0.1 }));
    lens1.rotation.x = Math.PI / 2;
    lens1.position.set(0, 0.4, -0.06);
    camBump.add(lens1);
    const lens2 = lens1.clone();
    lens2.position.set(0, -0.4, -0.06);
    camBump.add(lens2);
    phone.add(camBump);

    registerPart(root, phone, 0, -1.2);

    // B. Edge-to-Edge Front OLED Screen with Live Animated Terminal
    const { texture: termTex, update: termUpdate } = createKaliTerminalTexture();
    viewer3D.animatedUpdaters.push(termUpdate);

    const screenGeo = new THREE.PlaneGeometry(3.05, 5.55);
    const screenMat = new THREE.MeshBasicMaterial({ map: termTex });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0, 0.21);
    registerPart(root, screen, 0, 1.2);

    // C. External High-Gain Tactical Wi-Fi Injection Antenna via USB OTG
    const otgGroup = new THREE.Group();
    // USB-C Plug inserted into bottom
    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.16, 0.25), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
    plug.position.set(0, -3.05, 0);
    otgGroup.add(plug);

    // High-gain external Alfa-style antenna mounted on side bracket
    const alfaDongle = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.45), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }));
    alfaDongle.position.set(2.2, -1.8, 0.1);
    otgGroup.add(alfaDongle);

    const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 3.8, 16), new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.6 }));
    whip.position.set(2.2, 0.7, 0.1);
    whip.rotation.z = -0.08;
    otgGroup.add(whip);

    // Pulsing Holographic RF Emission Torus Rings
    const rfRingGeo = new THREE.TorusGeometry(1.2, 0.03, 12, 48);
    const rfRingMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.7 });
    const rfRing = new THREE.Mesh(rfRingGeo, rfRingMat);
    rfRing.position.set(2.2, 2.2, 0.1);
    rfRing.rotation.x = Math.PI / 2;
    otgGroup.add(rfRing);

    viewer3D.animatedUpdaters.push((elapsed) => {
        const s = ((elapsed * 2) % 3) + 0.3;
        rfRing.scale.set(s, s, s);
        rfRingMat.opacity = Math.max(0, 1 - (s / 3.3));
    });

    registerPart(root, otgGroup, 0, 0.4);
}

// 5. Bash Bunny (Hak5) - Multi-Vector USB Pentest Implant with Slide Switch
function buildBashBunny3D(root) {
    const chassisGeo = new THREE.BoxGeometry(3.6, 0.75, 1.35);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 });
    const botChassis = new THREE.Mesh(chassisGeo, chassisMat);
    registerPart(root, botChassis, -0.25, -1.1);

    // Internal PCB
    const pcbGeo = new THREE.BoxGeometry(3.3, 0.08, 1.15);
    const pcb = new THREE.Mesh(pcbGeo, new THREE.MeshStandardMaterial({ map: createDetailedPCBTexture('#090d16', '#00ffcc'), roughness: 0.3 }));
    registerPart(root, pcb, 0, 0);

    // Top Chassis with Bunny Emblem
    const topChassis = new THREE.Mesh(chassisGeo, chassisMat);
    const bunnyEmblem = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 24), new THREE.MeshStandardMaterial({ color: 0x00c8d7, metalness: 0.8 }));
    bunnyEmblem.position.set(0, 0.38, 0);
    topChassis.add(bunnyEmblem);
    registerPart(root, topChassis, 0.25, 1.1);

    // 3-Position Mechanical Slide Switch on Side
    const switchGroup = new THREE.Group();
    const slot = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.08), new THREE.MeshStandardMaterial({ color: 0x020617 }));
    slot.position.set(0, 0, 0.69);
    switchGroup.add(slot);

    const toggle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.14), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9 }));
    toggle.position.set(0.2, 0, 0.73);
    switchGroup.add(toggle);

    // Multicolored Status LED
    const { ledGroup, domeMat, light } = createStatusLED(0x00ffcc);
    ledGroup.position.set(0.8, 0.38, 0);
    switchGroup.add(ledGroup);

    viewer3D.animatedUpdaters.push((elapsed) => {
        const pulse = Math.sin(elapsed * 5) * 0.5 + 0.5;
        domeMat.emissiveIntensity = 0.8 + pulse * 1.5;
    });

    registerPart(root, switchGroup, 0, 1.4);

    // USB-A Connector
    const usb = createUSBAConnector();
    usb.position.set(2.2, 0, 0);
    usb.rotation.y = Math.PI / 2;
    registerPart(root, usb, 0, 0);
}

// 6. LAN Turtle (Hak5) - Stealth Inline Network Tap & Remote Access
function buildLanTurtle3D(root) {
    // Cylindrical/Beveled Stealth Body
    const bodyGeo = new THREE.CylinderGeometry(0.65, 0.65, 3.4, 24);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4, metalness: 0.25 });
    const botShell = new THREE.Mesh(bodyGeo, bodyMat);
    botShell.rotation.z = Math.PI / 2;
    registerPart(root, botShell, -0.2, -1.1);

    // Internal Ethernet NIC PCB
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.95), new THREE.MeshStandardMaterial({ map: createDetailedPCBTexture('#042f2e', '#14b8a6'), roughness: 0.3 }));
    registerPart(root, pcb, 0, 0);

    // Top Shell
    const topShell = new THREE.Mesh(bodyGeo, bodyMat);
    topShell.rotation.z = Math.PI / 2;
    registerPart(root, topShell, 0.2, 1.1);

    // Front USB-A Plug
    const usb = createUSBAConnector();
    usb.position.set(2.1, 0, 0);
    usb.rotation.y = Math.PI / 2;
    registerPart(root, usb, 0, 0);

    // Rear Transparent RJ45 Modular Jack with Blinking Network LEDs
    const rj45Group = new THREE.Group();
    const rj45 = createRJ45Port();
    rj45.position.set(-2.0, 0, 0);
    rj45.rotation.y = -Math.PI / 2;
    rj45Group.add(rj45);

    // Activity LEDs (Amber & Green)
    const { ledGroup: ledGreen, domeMat: matG } = createStatusLED(0x22c55e);
    ledGreen.position.set(-2.2, 0.32, 0.25);
    rj45Group.add(ledGreen);

    const { ledGroup: ledAmber, domeMat: matA } = createStatusLED(0xf59e0b);
    ledAmber.position.set(-2.2, 0.32, -0.25);
    rj45Group.add(ledAmber);

    viewer3D.animatedUpdaters.push((elapsed) => {
        matG.emissiveIntensity = Math.random() > 0.3 ? 2.0 : 0.2;
        matA.emissiveIntensity = Math.random() > 0.6 ? 2.0 : 0.2;
    });

    registerPart(root, rj45Group, 0, 0);
}

// 7. O.MG Cable (Hak5 / MG) - Implanted Keystroke Injection & Wi-Fi Cable
function buildOmgCable3D(root) {
    const cableGroup = new THREE.Group();

    // Braided Nylon Cyber Cable Spine (Curving gracefully)
    class CableCurve extends THREE.Curve {
        getPoint(t) {
            const x = (t - 0.5) * 6;
            const y = Math.sin(t * Math.PI * 2) * 0.9;
            const z = Math.cos(t * Math.PI * 2) * 0.6;
            return new THREE.Vector3(x, y, z);
        }
    }
    const path = new CableCurve();
    const tubeGeo = new THREE.TubeGeometry(path, 64, 0.16, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.1 });
    const cable = new THREE.Mesh(tubeGeo, tubeMat);
    cableGroup.add(cable);

    // Tactical USB-A Connector Head with Cutaway Inspection Window
    const plugHead = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.65, 1.25), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.92, roughness: 0.2 }));
    plugHead.position.set(3.4, 0, 0);
    cableGroup.add(plugHead);

    const usbProngs = createUSBAConnector();
    usbProngs.position.set(4.4, 0, 0);
    usbProngs.rotation.y = Math.PI / 2;
    cableGroup.add(usbProngs);

    // Covert Micro-SoC Implant Window (Glowing blue/amber micro-LED)
    const socWindow = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.7), new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1.8,
        transparent: true,
        opacity: 0.85
    }));
    socWindow.position.set(3.4, 0.34, 0);
    cableGroup.add(socWindow);

    viewer3D.animatedUpdaters.push((elapsed) => {
        socWindow.material.emissiveIntensity = 0.8 + Math.abs(Math.sin(elapsed * 8)) * 1.8;
    });

    // Secondary Type-C Plug on other end
    const typeC = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.85), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85 }));
    typeC.position.set(-3.4, 0, 0);
    cableGroup.add(typeC);

    registerPart(root, cableGroup, 0, 0);
}

// 8. Packet Squirrel (Hak5) - Inline Ethernet Packet Sniffer & Gateway
function buildPacketSquirrel3D(root) {
    const cubeGeo = new THREE.BoxGeometry(2.8, 1.4, 2.8);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.45, metalness: 0.3 });
    const botShell = new THREE.Mesh(cubeGeo, cubeMat);
    registerPart(root, botShell, -0.4, -1.2);

    // Internal Dual-PHY Capture PCB
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 2.5), new THREE.MeshStandardMaterial({ map: createDetailedPCBTexture('#064e3b', '#22c55e'), roughness: 0.3 }));
    registerPart(root, pcb, 0, 0);

    // Top Shell with Squirrel Badge
    const topShell = new THREE.Mesh(cubeGeo, cubeMat);
    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 24), new THREE.MeshStandardMaterial({ color: 0x22c55e, metalness: 0.8 }));
    badge.position.set(0, 0.71, 0);
    topShell.add(badge);
    registerPart(root, topShell, 0.4, 1.2);

    // Dual Shielded RJ45 Jacks (ETH IN / ETH OUT)
    const portGroup = new THREE.Group();
    const rj1 = createRJ45Port();
    rj1.position.set(-0.7, 0, 1.4);
    portGroup.add(rj1);

    const rj2 = createRJ45Port();
    rj2.position.set(0.7, 0, 1.4);
    portGroup.add(rj2);

    // 4-Way Payload Selector Switch on top
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.3), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    sw.position.set(0, 0.75, -0.6);
    portGroup.add(sw);

    registerPart(root, portGroup, 0, 0.3);
}

// 9. Proxmark3 RDV4 - RFID / NFC Motherboard with Dual 3D Antennas
function buildProxmark3D(root) {
    // Matte Black Dual-Sided PCB Base
    const pcbGeo = new THREE.BoxGeometry(3.6, 0.12, 5.4);
    const pcbTex = createDetailedPCBTexture('#090d16', '#d4af37');
    const pcbMat = new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.35, metalness: 0.45 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    registerPart(root, pcb, 0, 0);

    const rfGroup = new THREE.Group();

    // 125 kHz Low-Frequency Wound Copper Antenna Coil (Concentric Wire Loops)
    for (let c = 0; c < 5; c++) {
        const lfCoilGeo = new THREE.TorusGeometry(0.85 + c * 0.08, 0.035, 12, 48);
        const copperMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.95, roughness: 0.15 });
        const lfCoil = new THREE.Mesh(lfCoilGeo, copperMat);
        lfCoil.rotation.x = Math.PI / 2;
        lfCoil.position.set(0, 0.12 + c * 0.04, -1.2);
        rfGroup.add(lfCoil);
    }

    // 13.56 MHz High-Frequency Rectangular Spiral Copper Antenna
    for (let s = 0; s < 4; s++) {
        const w = 2.4 - s * 0.35;
        const h = 2.1 - s * 0.35;
        const hfTrace = new THREE.Mesh(new THREE.BoxGeometry(w, 0.03, h), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.98, roughness: 0.15 }));
        hfTrace.position.set(0, 0.08, 1.2);
        rfGroup.add(hfTrace);
    }

    // ARM Cortex & FPGA Processor Packages
    const fpga = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 1.1), new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.3 }));
    fpga.position.set(0, 0.12, 0);
    rfGroup.add(fpga);

    // Diagnostic LED Bank (A, B, C, D)
    const ledCols = [0xff3344, 0xfacc15, 0x00ffcc, 0x38bdf8];
    ledCols.forEach((col, idx) => {
        const { ledGroup, domeMat, light } = createStatusLED(col);
        ledGroup.position.set(-1.2 + idx * 0.4, 0.12, 0.2);
        rfGroup.add(ledGroup);
        viewer3D.animatedUpdaters.push((elapsed) => {
            const step = Math.floor(elapsed * 8) % 4;
            domeMat.emissiveIntensity = step === idx ? 2.5 : 0.3;
            light.intensity = step === idx ? 0.8 : 0.1;
        });
    });

    registerPart(root, rfGroup, 0, 0.8);
}

// 10. Evil Portal (ESP32 DevKit) - Metallic RF Shield Can & Meandering PCB Antenna
function buildEvilPortal3D(root) {
    // Matte Black Dual-Layer Breadboard PCB
    const pcbGeo = new THREE.BoxGeometry(2.4, 0.12, 4.8);
    const pcbTex = createDetailedPCBTexture('#090d16', '#eab308');
    const pcbMat = new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.35, metalness: 0.4 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    registerPart(root, pcb, 0, 0);

    const compGroup = new THREE.Group();

    // Metallic ESP-WROOM-32 RF Shield Can
    const shieldGeo = new THREE.BoxGeometry(1.65, 0.24, 1.65);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.96, roughness: 0.18 });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(0, 0.16, 0.2);
    compGroup.add(shield);

    // Golden Meandering Inverted-F PCB Antenna (MIFA)
    const antGeo = new THREE.BoxGeometry(1.5, 0.04, 0.65);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.98, roughness: 0.15 });
    const ant = new THREE.Mesh(antGeo, goldMat);
    ant.position.set(0, 0.08, 1.85);
    compGroup.add(ant);

    // Dual 15-Pin Header Banks (30 individual gold square pins extending downward)
    const pinGeo = new THREE.BoxGeometry(0.08, 0.95, 0.08);
    for (let p = 0; p < 15; p++) {
        // Left Pin Row
        const pLeft = new THREE.Mesh(pinGeo, goldMat);
        pLeft.position.set(-1.05, -0.45, -2.0 + p * 0.28);
        compGroup.add(pLeft);

        // Right Pin Row
        const pRight = new THREE.Mesh(pinGeo, goldMat);
        pRight.position.set(1.05, -0.45, -2.0 + p * 0.28);
        compGroup.add(pRight);
    }

    // EN & BOOT Tactile SMD Buttons
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const btn1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, 0.25), btnMat);
    btn1.position.set(-0.75, 0.12, -1.8);
    compGroup.add(btn1);

    const btn2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, 0.25), btnMat);
    btn2.position.set(0.75, 0.12, -1.8);
    compGroup.add(btn2);

    // Micro-USB Port & UART Bridge
    const usb = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.35, 0.6), btnMat);
    usb.position.set(0, 0.18, -2.2);
    compGroup.add(usb);

    // Red Power LED & Flashing Blue Wi-Fi Probe Beacon LED
    const { ledGroup: pwrLed } = createStatusLED(0xff3344);
    pwrLed.position.set(-0.6, 0.12, -1.2);
    compGroup.add(pwrLed);

    const { ledGroup: beaconLed, domeMat: bMat, light: bLight } = createStatusLED(0x38bdf8);
    beaconLed.position.set(0.6, 0.12, -1.2);
    compGroup.add(beaconLed);

    viewer3D.animatedUpdaters.push((elapsed) => {
        const burst = Math.sin(elapsed * 12) > 0.8 ? 2.8 : 0.2;
        bMat.emissiveIntensity = burst;
        bLight.intensity = burst * 0.5;
    });

    registerPart(root, compGroup, 0, 0.6);
}

// ==========================================================================
// D3.JS REAL-TIME RF SPECTRUM & TELEMETRY ENGINE
// ==========================================================================
const DEVICE_TELEMETRY_PROFILES = {
    "wifi_pineapple": {
        bandName: "2.4 GHz & 5.8 GHz ISM",
        freqMin: 2400,
        freqMax: 2500,
        unit: "MHz",
        peaks: [
            { freq: 2412, amp: 85, label: "CH 1 (PineAP AP)" },
            { freq: 2437, amp: 94, label: "CH 6 (Target WPA2)" },
            { freq: 2462, amp: 78, label: "CH 11 (Evil Twin)" }
        ],
        stats: [
            { label: "Center Freq", val: "2437.0 MHz" },
            { label: "Peak RSSI", val: "-34 dBm" },
            { label: "Protocol", val: "802.11 b/g/n/ac" },
            { label: "PineAP Probes", val: "184 pkts/s" }
        ]
    },
    "flipper_zero": {
        bandName: "433.92 MHz Sub-GHz / 13.56 MHz NFC",
        freqMin: 430,
        freqMax: 438,
        unit: "MHz",
        peaks: [
            { freq: 433.05, amp: 40, label: "Harmonic" },
            { freq: 433.92, amp: 98, label: "433.92 MHz [CARRIER]" },
            { freq: 434.79, amp: 38, label: "Sideband" }
        ],
        stats: [
            { label: "Target Band", val: "433.92 MHz" },
            { label: "Modulation", val: "AM650 / OOK" },
            { label: "Signal SNR", val: "+28 dB" },
            { label: "Rolling Code", val: "KeeLoq 64-bit" }
        ]
    },
    "usb_rubber_ducky": {
        bandName: "USB 2.0 Full-Speed HID Bus",
        freqMin: 0,
        freqMax: 12,
        unit: "Mbps",
        peaks: [
            { freq: 1.5, amp: 45, label: "Low-Speed Enum" },
            { freq: 6.0, amp: 72, label: "HID Interrupt EP" },
            { freq: 12.0, amp: 95, label: "DuckyScript 3.0" }
        ],
        stats: [
            { label: "Keystroke Rate", val: "1,200 WPM" },
            { label: "USB Bus Clock", val: "12.0 Mbps" },
            { label: "Injection Delay", val: "8 ms/char" },
            { label: "Payload State", val: "STAGE-2 ARMED" }
        ]
    },
    "kali_nethunter": {
        bandName: "SDR & 802.11 Monitor Injection",
        freqMin: 2400,
        freqMax: 2485,
        unit: "MHz",
        peaks: [
            { freq: 2417, amp: 65, label: "wlan0 Probe" },
            { freq: 2442, amp: 92, label: "wlan0mon Deauth" },
            { freq: 2470, amp: 58, label: "BLE Beacon" }
        ],
        stats: [
            { label: "Capture Mode", val: "RFMON Promisc" },
            { label: "Frame Injection", val: "ACTIVE" },
            { label: "Channel Hopping", val: "1-14 Dynamic" },
            { label: "Handshakes", val: "Captured (4-Way)" }
        ]
    },
    "bash_bunny": {
        bandName: "Multi-Interface Ethernet/HID/Storage",
        freqMin: 0,
        freqMax: 480,
        unit: "Mbps",
        peaks: [
            { freq: 12, amp: 60, label: "HID Attack" },
            { freq: 100, amp: 88, label: "ECM Ethernet" },
            { freq: 480, amp: 94, label: "USB Mass Storage" }
        ],
        stats: [
            { label: "Switch Pos", val: "PAYLOAD 1" },
            { label: "DHCP Server", val: "172.16.64.1" },
            { label: "Exfil Mode", val: "SMB QuickCreds" },
            { label: "Execution Time", val: "4.8 seconds" }
        ]
    },
    "lan_turtle": {
        bandName: "100BASE-TX Fast Ethernet Tap",
        freqMin: 0,
        freqMax: 100,
        unit: "MHz",
        peaks: [
            { freq: 25, amp: 62, label: "Link Pulse" },
            { freq: 62.5, amp: 88, label: "MLT-3 Stream" },
            { freq: 95, amp: 96, label: "SSH Reverse Tun" }
        ],
        stats: [
            { label: "NIC Tap Mode", val: "Inline 10/100" },
            { label: "Tunnel Host", val: "C2 Over DNS" },
            { label: "Payload Module", val: "DNS Spoof / MITM" },
            { label: "Throughput", val: "94.2 Mbps" }
        ]
    },
    "omg_cable": {
        bandName: "Covert 2.4 GHz 802.11b/g/n SoC",
        freqMin: 2400,
        freqMax: 2480,
        unit: "MHz",
        peaks: [
            { freq: 2412, amp: 70, label: "Covert AP" },
            { freq: 2437, amp: 92, label: "Web UI C2" },
            { freq: 2462, amp: 68, label: "Geofence Ping" }
        ],
        stats: [
            { label: "Implant SoC", val: "ESP-Class Co-Proc" },
            { label: "Stealth Rating", val: "100% Invisible Cable" },
            { label: "Self-Destruct", val: "ARMED (Geofenced)" },
            { label: "Keypress Rate", val: "890 WPM" }
        ]
    },
    "packet_squirrel": {
        bandName: "Dual-Interface Layer 2 Bridge",
        freqMin: 0,
        freqMax: 100,
        unit: "MHz",
        peaks: [
            { freq: 30, amp: 55, label: "PCAP Stream" },
            { freq: 65, amp: 85, label: "OpenVPN Tunnel" },
            { freq: 92, amp: 94, label: "Target NIC" }
        ],
        stats: [
            { label: "Capture Mode", val: "Transparent Tap" },
            { label: "Storage", val: "MicroSD FAT32" },
            { label: "Filter Rule", val: "TCP/80,443,445" },
            { label: "Packets Logged", val: "24,810 Frames" }
        ]
    },
    "proxmark3": {
        bandName: "125 kHz LF & 13.56 MHz HF Carrier",
        freqMin: 100,
        freqMax: 150,
        unit: "kHz",
        peaks: [
            { freq: 115, amp: 48, label: "Inductive Noise" },
            { freq: 125, amp: 98, label: "125 kHz [LF EM4100]" },
            { freq: 134.2, amp: 52, label: "ISO 11784/85" }
        ],
        stats: [
            { label: "LF Resonance", val: "125.0 kHz" },
            { label: "HF Carrier", val: "13.56 MHz (NFC)" },
            { label: "Field Voltage", val: "42.8 Vpp" },
            { label: "Attack Suite", val: "DarkSide / Hardnested" }
        ]
    },
    "evil_portal": {
        bandName: "2.4 GHz SoftAP & DNS Hijack",
        freqMin: 2410,
        freqMax: 2470,
        unit: "MHz",
        peaks: [
            { freq: 2412, amp: 92, label: "Rogue Beacon (Ch 1)" },
            { freq: 2437, amp: 75, label: "DNS Hijack" },
            { freq: 2462, amp: 62, label: "Captive Portal HTTP" }
        ],
        stats: [
            { label: "SoftAP SSID", val: "Free_Airport_WiFi" },
            { label: "DNS Redir", val: "192.168.4.1 [ACTIVE]" },
            { label: "Harvested Creds", val: "Real-Time Flash" },
            { label: "Victims Online", val: "14 Devices" }
        ]
    }
};

function renderD3Spectrum(devKey) {
    const wrap = document.getElementById('d3SpectrumSvgWrap');
    if (!wrap || typeof d3 === 'undefined') return;

    wrap.innerHTML = '';
    const prof = DEVICE_TELEMETRY_PROFILES[devKey] || DEVICE_TELEMETRY_PROFILES['wifi_pineapple'];

    const bandBadge = document.getElementById('d3SpectrumBand');
    if (bandBadge) bandBadge.textContent = prof.bandName;

    // Render Telemetry Stats
    const statsContainer = document.getElementById('d3TelemetryStats');
    if (statsContainer) {
        statsContainer.innerHTML = prof.stats.map(s => `
            <div class="d3-stat-chip">
                <span class="d3-stat-label">${s.label}</span>
                <span class="d3-stat-val">${s.val}</span>
            </div>
        `).join('');
    }

    const rect = wrap.getBoundingClientRect();
    const width = rect.width || 560;
    const height = rect.height || 220;
    const margin = { top: 25, right: 20, bottom: 35, left: 45 };

    const svg = d3.select(wrap)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    // Gradient definition for spectrum area
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient')
        .attr('id', 'spectrumGradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#00ffcc').attr('stop-opacity', 0.65);
    grad.append('stop').attr('offset', '70%').attr('stop-color', '#00c8d7').attr('stop-opacity', 0.25);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#050811').attr('stop-opacity', 0.0);

    const xScale = d3.scaleLinear()
        .domain([prof.freqMin, prof.freqMax])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, 110])
        .range([height - margin.bottom, margin.top]);

    // Grid lines
    svg.append('g')
        .attr('class', 'd3-grid')
        .selectAll('line')
        .data(yScale.ticks(4))
        .enter()
        .append('line')
        .attr('class', 'd3-grid-line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d));

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d => `${d} ${prof.unit}`);
    const yAxis = d3.axisLeft(yScale).ticks(4).tickFormat(d => `${-100 + d}dB`);

    svg.append('g')
        .attr('class', 'd3-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

    svg.append('g')
        .attr('class', 'd3-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);

    // Spectrum Area & Line Paths
    const areaPath = svg.append('path').attr('class', 'd3-spectrum-area');
    const linePath = svg.append('path').attr('class', 'd3-spectrum-line');

    // Noise Floor Line (-85 dBm)
    svg.append('line')
        .attr('class', 'd3-noise-line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yScale(15))
        .attr('y2', yScale(15));

    // Peak labels group
    const peakGroup = svg.append('g').attr('class', 'd3-peaks');

    // Generator function for simulated RF spectrum curve
    const pointCount = 120;
    const step = (prof.freqMax - prof.freqMin) / pointCount;

    function generateSpectrumPoints(time) {
        const pts = [];
        for (let i = 0; i <= pointCount; i++) {
            const f = prof.freqMin + i * step;
            // Base thermal noise floor + jitter
            let amp = 12 + Math.sin(f * 0.2 + time * 3) * 3 + Math.random() * 4;

            // Add peaks from profile
            prof.peaks.forEach(p => {
                const dist = Math.abs(f - p.freq);
                const widthParam = (prof.freqMax - prof.freqMin) * 0.04;
                if (dist < widthParam * 2.5) {
                    const gauss = Math.exp(-0.5 * Math.pow(dist / widthParam, 2));
                    const jitter = (Math.sin(time * 8 + p.freq) * 0.08 + 1);
                    amp += p.amp * gauss * jitter;
                }
            });
            pts.push({ freq: f, amp: Math.min(105, amp) });
        }
        return pts;
    }

    const lineGen = d3.line()
        .x(d => xScale(d.freq))
        .y(d => yScale(d.amp))
        .curve(d3.curveMonotoneX);

    const areaGen = d3.area()
        .x(d => xScale(d.freq))
        .y0(height - margin.bottom)
        .y1(d => yScale(d.amp))
        .curve(d3.curveMonotoneX);

    // Dynamic Real-Time Animation Loop
    if (viewer3D.d3SpectrumTimer) clearInterval(viewer3D.d3SpectrumTimer);

    let t = 0;
    function tick() {
        if (!viewer3D.active || viewer3D.currentMode !== 'spectrum') return;
        t += 0.05;
        const pts = generateSpectrumPoints(t);

        areaPath.attr('d', areaGen(pts));
        linePath.attr('d', lineGen(pts));

        // Update peak callouts
        const peakData = prof.peaks.map(p => ({
            x: xScale(p.freq),
            y: yScale(p.amp),
            label: p.label
        }));

        const markers = peakGroup.selectAll('.peak-marker').data(peakData);
        markers.enter()
            .append('g')
            .attr('class', 'peak-marker')
            .each(function(d) {
                const g = d3.select(this);
                g.append('circle').attr('r', 4.5).attr('fill', '#00ffcc').attr('stroke', '#050811').attr('stroke-width', 2);
                g.append('text').attr('class', 'd3-peak-label').attr('dy', -10).text(d.label);
            })
            .merge(markers)
            .attr('transform', d => `translate(${d.x}, ${d.y})`);
        markers.exit().remove();
    }

    tick();
    viewer3D.d3SpectrumTimer = setInterval(tick, 50);
}

// ==========================================================================
// D3.JS INTERACTIVE ATTACK VECTOR TOPOLOGY FORCE GRAPH
// ==========================================================================
const DEVICE_ATTACK_TOPOLOGIES = {
    "wifi_pineapple": {
        nodes: [
            { id: "OP", name: "Operator (C2)", type: "c2", r: 24 },
            { id: "PINE", name: "WiFi Pineapple", type: "device", r: 28 },
            { id: "SSID", name: "Rogue PineAP SSID", type: "vector", r: 22 },
            { id: "DEAUTH", name: "802.11 Deauth Burst", type: "vector", r: 20 },
            { id: "CLIENT", name: "Victim Workstation", type: "target", r: 24 },
            { id: "CREDS", name: "WPA Handshake & NTLM", type: "loot", r: 26 }
        ],
        links: [
            { source: "OP", target: "PINE" },
            { source: "PINE", target: "DEAUTH" },
            { source: "DEAUTH", target: "CLIENT" },
            { source: "PINE", target: "SSID" },
            { source: "CLIENT", target: "SSID" },
            { source: "SSID", target: "CREDS" }
        ]
    },
    "flipper_zero": {
        nodes: [
            { id: "OP", name: "PenTester", type: "c2", r: 24 },
            { id: "FLIP", name: "Flipper Zero", type: "device", r: 28 },
            { id: "SUB", name: "433.92MHz Replay", type: "vector", r: 22 },
            { id: "NFC", name: "13.56MHz NFC Clone", type: "vector", r: 22 },
            { id: "GATE", name: "Automated Barrier / Gate", type: "target", r: 24 },
            { id: "BADGE", name: "HID Prox Card Reader", type: "target", r: 24 },
            { id: "ACCESS", name: "Physical Perimeter Access", type: "loot", r: 26 }
        ],
        links: [
            { source: "OP", target: "FLIP" },
            { source: "FLIP", target: "SUB" },
            { source: "FLIP", target: "NFC" },
            { source: "SUB", target: "GATE" },
            { source: "NFC", target: "BADGE" },
            { source: "GATE", target: "ACCESS" },
            { source: "BADGE", target: "ACCESS" }
        ]
    },
    "usb_rubber_ducky": {
        nodes: [
            { id: "OP", name: "Adversary", type: "c2", r: 24 },
            { id: "DUCK", name: "Rubber Ducky", type: "device", r: 28 },
            { id: "HID", name: "DuckyScript 3.0 (1200WPM)", type: "vector", r: 22 },
            { id: "OS", name: "Windows Workstation (Locked)", type: "target", r: 24 },
            { id: "REV", name: "Reverse TCP Shell", type: "loot", r: 26 },
            { id: "SAM", name: "Exfiltrated SAM Hashes", type: "loot", r: 24 }
        ],
        links: [
            { source: "OP", target: "DUCK" },
            { source: "DUCK", target: "HID" },
            { source: "HID", target: "OS" },
            { source: "OS", target: "REV" },
            { source: "OS", target: "SAM" }
        ]
    }
};

function renderD3Topology(devKey) {
    const wrap = document.getElementById('d3TopologySvgWrap');
    if (!wrap || typeof d3 === 'undefined') return;

    wrap.innerHTML = '';
    const topo = DEVICE_ATTACK_TOPOLOGIES[devKey] || DEVICE_ATTACK_TOPOLOGIES['wifi_pineapple'];

    const rect = wrap.getBoundingClientRect();
    const width = rect.width || 560;
    const height = rect.height || 240;

    const svg = d3.select(wrap)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    // Clone data to avoid mutating original
    const nodes = topo.nodes.map(d => ({ ...d }));
    const links = topo.links.map(d => ({ ...d }));

    const colorMap = {
        c2: "#38bdf8",
        device: "#00ffcc",
        vector: "#f59e0b",
        target: "#ef4444",
        loot: "#a855f7"
    };

    if (viewer3D.d3Simulation) viewer3D.d3Simulation.stop();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(75))
        .force("charge", d3.forceManyBody().strength(-240))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => d.r + 10));

    viewer3D.d3Simulation = simulation;

    // Draw Links
    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "d3-link");

    // Draw Nodes
    const node = svg.append("g")
        .selectAll(".d3-node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "d3-node")
        .call(d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }));

    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => colorMap[d.type] || "#00c8d7")
        .attr("fill-opacity", 0.22)
        .attr("stroke", d => colorMap[d.type] || "#00c8d7")
        .attr("stroke-width", 2.2);

    node.append("circle")
        .attr("r", 4.5)
        .attr("fill", d => colorMap[d.type] || "#ffffff");

    node.append("text")
        .attr("dy", d => d.r + 14)
        .attr("text-anchor", "middle")
        .text(d => d.name);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${Math.max(d.r, Math.min(width - d.r, d.x))}, ${Math.max(d.r, Math.min(height - d.r, d.y))})`);
    });
}

// ==========================================================================
// 3D SCENE CONTROLLER & ANIMATION LOOP
// ==========================================================================

function switchViewerMode(mode) {
    viewer3D.currentMode = mode;

    const btn3D = document.getElementById('btnMode3D');
    const btnSpec = document.getElementById('btnModeSpectrum');
    const btnTopo = document.getElementById('btnModeTopology');
    const overlay = document.getElementById('viewer3DD3Overlay');
    const specCard = document.getElementById('d3SpectrumCard');
    const topoCard = document.getElementById('d3TopologyCard');

    [btn3D, btnSpec, btnTopo].forEach(b => b && b.classList.remove('active'));

    if (mode === '3d') {
        if (btn3D) btn3D.classList.add('active');
        if (overlay) overlay.style.display = 'none';
        if (specCard) specCard.style.display = 'none';
        if (topoCard) topoCard.style.display = 'none';
        if (viewer3D.d3SpectrumTimer) clearInterval(viewer3D.d3SpectrumTimer);
        if (viewer3D.d3Simulation) viewer3D.d3Simulation.stop();
    } else if (mode === 'spectrum') {
        if (btnSpec) btnSpec.classList.add('active');
        if (overlay) overlay.style.display = 'flex';
        if (specCard) specCard.style.display = 'block';
        if (topoCard) topoCard.style.display = 'none';
        renderD3Spectrum(viewer3D.currentDevKey);
    } else if (mode === 'topology') {
        if (btnTopo) btnTopo.classList.add('active');
        if (overlay) overlay.style.display = 'flex';
        if (specCard) specCard.style.display = 'none';
        if (topoCard) topoCard.style.display = 'block';
        if (viewer3D.d3SpectrumTimer) clearInterval(viewer3D.d3SpectrumTimer);
        renderD3Topology(viewer3D.currentDevKey);
    }
    playEngineSound('tab');
}
window.switchViewerMode = switchViewerMode;

function toggle3DExplodedView() {
    viewer3D.exploded = !viewer3D.exploded;
    const btn = document.getElementById('btnModeExplode');
    const statusPill = document.getElementById('viewer3DExplodeStatus');

    if (btn) btn.classList.toggle('active', viewer3D.exploded);
    if (statusPill) statusPill.style.display = viewer3D.exploded ? 'inline-block' : 'none';

    playEngineSound('tab');
}
window.toggle3DExplodedView = toggle3DExplodedView;

function build3DDeviceModel(imgSrc, name = '') {
    if (viewer3D.deviceGroup) {
        viewer3D.scene.remove(viewer3D.deviceGroup);
        viewer3D.deviceGroup = null;
    }

    viewer3D.explodedParts = [];
    viewer3D.animatedUpdaters = [];
    viewer3D.exploded = false;
    viewer3D.explodeProgress = 0;

    const explodeBtn = document.getElementById('btnModeExplode');
    if (explodeBtn) explodeBtn.classList.remove('active');
    const explodePill = document.getElementById('viewer3DExplodeStatus');
    if (explodePill) explodePill.style.display = 'none';

    viewer3D.deviceGroup = new THREE.Group();
    const devKey = getDeviceKey(name, imgSrc);
    viewer3D.currentDevKey = devKey;

    switch (devKey) {
        case 'wifi_pineapple':
            buildWiFiPineapple3D(viewer3D.deviceGroup);
            break;
        case 'flipper_zero':
            buildFlipperZero3D(viewer3D.deviceGroup);
            break;
        case 'usb_rubber_ducky':
            buildRubberDucky3D(viewer3D.deviceGroup);
            break;
        case 'kali_nethunter':
            buildNetHunter3D(viewer3D.deviceGroup);
            break;
        case 'bash_bunny':
            buildBashBunny3D(viewer3D.deviceGroup);
            break;
        case 'lan_turtle':
            buildLanTurtle3D(viewer3D.deviceGroup);
            break;
        case 'omg_cable':
            buildOmgCable3D(viewer3D.deviceGroup);
            break;
        case 'packet_squirrel':
            buildPacketSquirrel3D(viewer3D.deviceGroup);
            break;
        case 'proxmark3':
            buildProxmark3D(viewer3D.deviceGroup);
            break;
        case 'evil_portal':
            buildEvilPortal3D(viewer3D.deviceGroup);
            break;
        default:
            buildWiFiPineapple3D(viewer3D.deviceGroup);
            break;
    }

    viewer3D.scene.add(viewer3D.deviceGroup);

    // Refresh D3 spectrum or topology if active
    if (viewer3D.currentMode === 'spectrum') {
        renderD3Spectrum(devKey);
    } else if (viewer3D.currentMode === 'topology') {
        renderD3Topology(devKey);
    }
}

function open3DViewer(imgSrc, name, vendor) {
    if (typeof THREE === 'undefined') {
        alert('3D Graphics Engine is initializing. Please try again in a moment.');
        return;
    }

    const modal = document.getElementById('device3DViewerModal');
    if (!modal) return;

    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    playEngineSound('tab');

    const nameEl = document.getElementById('viewer3DDeviceName');
    const vendorEl = document.getElementById('viewer3DDeviceVendor');
    if (nameEl) nameEl.textContent = name;
    if (vendorEl) vendorEl.textContent = vendor;

    document.body.classList.add('viewer-3d-open');
    modal.classList.add('active');

    viewer3D.active = true;
    viewer3D.currentImgSrc = imgSrc;
    viewer3D.currentDeviceName = name;
    viewer3D.autoRotate = true;
    viewer3D.currentMode = '3d';
    switchViewerMode('3d');
    updateAutoRotateUI();

    initOrUpdate3DScene(imgSrc, name);
}

function initOrUpdate3DScene(imgSrc, name) {
    const wrap = document.getElementById('viewer3DCanvasWrap');
    if (!wrap) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (!viewer3D.renderer) {
        viewer3D.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        viewer3D.renderer.setSize(width, height);
        viewer3D.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        wrap.appendChild(viewer3D.renderer.domElement);

        viewer3D.scene = new THREE.Scene();
        viewer3D.scene.fog = new THREE.FogExp2(0x050811, 0.025);

        viewer3D.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        viewer3D.camera.position.set(0, 0, 6.5);
        viewer3D.cameraDistance = 6.5;
        viewer3D.targetCameraDistance = 6.5;

        viewer3D.clock = new THREE.Clock();
        viewer3D.textureLoader = new THREE.TextureLoader();

        // 3D Studio Lighting
        const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
        viewer3D.scene.add(ambLight);

        const dirKey = new THREE.DirectionalLight(0xffffff, 1.35);
        dirKey.position.set(5, 7, 8);
        viewer3D.scene.add(dirKey);

        const dirFill = new THREE.DirectionalLight(0x00c8d7, 0.9);
        dirFill.position.set(-6, -3, 6);
        viewer3D.scene.add(dirFill);

        const dirRim = new THREE.DirectionalLight(0x005A9C, 0.85);
        dirRim.position.set(0, 6, -8);
        viewer3D.scene.add(dirRim);

        const pointCenter = new THREE.PointLight(0x00ffcc, 1.2, 25);
        pointCenter.position.set(0, 0, 5.0);
        viewer3D.scene.add(pointCenter);

        setupBackgroundMeshes();
        setupViewer3DControls(wrap);
    } else {
        viewer3D.renderer.setSize(width, height);
        viewer3D.camera.aspect = width / height;
        viewer3D.camera.updateProjectionMatrix();
    }

    viewer3D.targetRotation = { x: 0.15, y: 0 };
    viewer3D.currentRotation = { x: 0.15, y: 0 };
    viewer3D.targetCameraDistance = 6.5;
    viewer3D.cameraDistance = 6.5;
    viewer3D.camera.position.set(0, 0, 6.5);

    build3DDeviceModel(imgSrc, name);

    if (!viewer3D.animId) {
        animate3DViewer();
    }
}

function setupBackgroundMeshes() {
    // 1. Floor Wireframe Mesh
    const floorGeo = new THREE.PlaneGeometry(80, 80, 42, 42);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshBasicMaterial({
        color: 0x00c8d7,
        wireframe: true,
        transparent: true,
        opacity: 0.18
    });
    viewer3D.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    viewer3D.floorMesh.position.y = -3.8;
    viewer3D.scene.add(viewer3D.floorMesh);

    // 2. Ceiling Wireframe Mesh
    const ceilGeo = new THREE.PlaneGeometry(80, 80, 36, 36);
    ceilGeo.rotateX(Math.PI / 2);
    const ceilMat = new THREE.MeshBasicMaterial({
        color: 0x005A9C,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    viewer3D.ceilingMesh = new THREE.Mesh(ceilGeo, ceilMat);
    viewer3D.ceilingMesh.position.y = 4.8;
    viewer3D.scene.add(viewer3D.ceilingMesh);

    // 3. Polar Radar Floor Grid
    const radar = new THREE.PolarGridHelper(14, 18, 8, 48, 0x00c8d7, 0x005A9C);
    radar.position.y = -3.75;
    viewer3D.radarGrid = radar;
    viewer3D.scene.add(radar);

    // 4. Floating Cyber Particles
    const particleCount = 500;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 30;
        posArray[i + 1] = (Math.random() - 0.5) * 16;
        posArray[i + 2] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00c8d7,
        transparent: true,
        opacity: 0.55
    });
    viewer3D.particles = new THREE.Points(particleGeo, particleMat);
    viewer3D.scene.add(viewer3D.particles);
}

function setupViewer3DControls(wrap) {
    wrap.addEventListener('mousedown', (e) => {
        viewer3D.isDragging = true;
        viewer3D.pointerStart = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
        if (!viewer3D.active || !viewer3D.isDragging) return;
        const dx = e.clientX - viewer3D.pointerStart.x;
        const dy = e.clientY - viewer3D.pointerStart.y;
        viewer3D.targetRotation.y += dx * 0.008;
        viewer3D.targetRotation.x += dy * 0.008;
        viewer3D.targetRotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, viewer3D.targetRotation.x));
        viewer3D.pointerStart = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
        viewer3D.isDragging = false;
    });

    wrap.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            viewer3D.isDragging = true;
            viewer3D.pointerStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
        if (!viewer3D.active || !viewer3D.isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - viewer3D.pointerStart.x;
        const dy = e.touches[0].clientY - viewer3D.pointerStart.y;
        viewer3D.targetRotation.y += dx * 0.01;
        viewer3D.targetRotation.x += dy * 0.01;
        viewer3D.targetRotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, viewer3D.targetRotation.x));
        viewer3D.pointerStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    wrap.addEventListener('touchend', () => {
        viewer3D.isDragging = false;
    });

    wrap.addEventListener('wheel', (e) => {
        if (!viewer3D.active) return;
        e.preventDefault();
        const delta = e.deltaY * 0.006;
        viewer3D.targetCameraDistance = Math.max(
            viewer3D.minDistance,
            Math.min(viewer3D.maxDistance, viewer3D.targetCameraDistance + delta)
        );
    }, { passive: false });

    window.addEventListener('resize', () => {
        if (!viewer3D.active || !viewer3D.renderer) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        viewer3D.renderer.setSize(w, h);
        viewer3D.camera.aspect = w / h;
        viewer3D.camera.updateProjectionMatrix();
    });
}

function animate3DViewer() {
    if (!viewer3D.active) {
        viewer3D.animId = null;
        return;
    }

    viewer3D.animId = requestAnimationFrame(animate3DViewer);
    const elapsed = viewer3D.clock ? viewer3D.clock.getElapsedTime() : 0;

    // Turntable 360° Auto-Rotation
    if (viewer3D.autoRotate && !viewer3D.isDragging) {
        viewer3D.targetRotation.y += 0.0045;
    }

    viewer3D.currentRotation.x += (viewer3D.targetRotation.x - viewer3D.currentRotation.x) * 0.08;
    viewer3D.currentRotation.y += (viewer3D.targetRotation.y - viewer3D.currentRotation.y) * 0.08;

    if (viewer3D.deviceGroup) {
        viewer3D.deviceGroup.rotation.x = viewer3D.currentRotation.x;
        viewer3D.deviceGroup.rotation.y = viewer3D.currentRotation.y;
    }

    // Camera Zoom Lerp
    viewer3D.cameraDistance += (viewer3D.targetCameraDistance - viewer3D.cameraDistance) * 0.12;
    viewer3D.camera.position.z = viewer3D.cameraDistance;

    // Smooth Exploded View Lerping
    const targetExplode = viewer3D.exploded ? 1.0 : 0.0;
    viewer3D.explodeProgress += (targetExplode - viewer3D.explodeProgress) * 0.08;

    viewer3D.explodedParts.forEach(p => {
        p.mesh.position.y = p.normalY + (p.explodedY - p.normalY) * viewer3D.explodeProgress;
    });

    // Run dynamic procedural texture / LED updaters
    viewer3D.animatedUpdaters.forEach(fn => fn(elapsed));

    // Floor Mesh Wave Effect
    if (viewer3D.floorMesh) {
        const posAttr = viewer3D.floorMesh.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const z = posAttr.getZ(i);
            const y = Math.sin(x * 0.15 + elapsed * 1.5) * Math.cos(z * 0.15 + elapsed * 1.5) * 0.45;
            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
    }

    if (viewer3D.radarGrid) {
        viewer3D.radarGrid.rotation.y += 0.0018;
    }

    if (viewer3D.particles) {
        viewer3D.particles.rotation.y = elapsed * 0.02;
    }

    viewer3D.renderer.render(viewer3D.scene, viewer3D.camera);
}

function close3DViewer() {
    const modal = document.getElementById('device3DViewerModal');
    if (!modal) return;

    playEngineSound('click');
    modal.classList.remove('active');
    document.body.classList.remove('viewer-3d-open');
    document.body.style.overflow = '';
    viewer3D.active = false;
    viewer3D.isDragging = false;
    if (viewer3D.animId) {
        cancelAnimationFrame(viewer3D.animId);
        viewer3D.animId = null;
    }
    if (viewer3D.d3SpectrumTimer) {
        clearInterval(viewer3D.d3SpectrumTimer);
        viewer3D.d3SpectrumTimer = null;
    }
    if (viewer3D.d3Simulation) {
        viewer3D.d3Simulation.stop();
        viewer3D.d3Simulation = null;
    }
}
window.close3DViewer = close3DViewer;

function toggle3DAutoRotate() {
    viewer3D.autoRotate = !viewer3D.autoRotate;
    updateAutoRotateUI();
    playEngineSound('click');
}
window.toggle3DAutoRotate = toggle3DAutoRotate;

function updateAutoRotateUI() {
    const statusPill = document.getElementById('viewer3DAutoRotateStatus');
    const toggleBtn = document.getElementById('btnToggleAutoRotate');
    if (statusPill) {
        statusPill.textContent = viewer3D.autoRotate ? '🔄 AUTO-ROTATING' : '⏸️ ROTATION PAUSED';
        statusPill.style.color = viewer3D.autoRotate ? '#00ffcc' : '#a0aec0';
    }
    if (toggleBtn) {
        toggleBtn.textContent = viewer3D.autoRotate ? 'Pause Spin' : 'Resume Spin';
    }
}

function reset3DCamera() {
    viewer3D.targetRotation = { x: 0.15, y: 0 };
    viewer3D.targetCameraDistance = 6.5;
    playEngineSound('tab');
}
window.reset3DCamera = reset3DCamera;


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (viewer3D.active) {
            close3DViewer();
        } else {
            closeDeviceInspectModal();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initViewTabs();
    updateFilterPills('devices');
    initSearchInput();
    applyAllFilters();
    initDeviceInteractivity();
});
