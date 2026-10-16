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
// FULLSCREEN 3D MODEL VIEWER & THEME MESH LAB (THREE.JS)
// ==========================================================================
const viewer3D = {
    active: false,
    renderer: null,
    scene: null,
    camera: null,
    animId: null,
    deviceGroup: null,
    floorMesh: null,
    ceilingMesh: null,
    particles: null,
    radarGrid: null,
    autoRotate: true,
    isDragging: false,
    pointerStart: { x: 0, y: 0 },
    currentRotation: { x: 0.1, y: 0 },
    targetRotation: { x: 0.1, y: 0 },
    cameraDistance: 6.0,
    targetCameraDistance: 6.0,
    minDistance: 2.5,
    maxDistance: 12.0,
    clock: null,
    textureLoader: null,
    currentImgSrc: null,
    currentDeviceName: ''
};

function createPCBTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dark cyber motherboard background
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, 512, 512);

    // Grid dots / grounding vias
    ctx.fillStyle = '#00c8d7';
    for (let x = 16; x < 512; x += 32) {
        for (let y = 16; y < 512; y += 32) {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Circuit board gold traces
    ctx.strokeStyle = '#e6b800';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(40, 100); ctx.lineTo(120, 100); ctx.lineTo(180, 160); ctx.lineTo(280, 160);
    ctx.moveTo(80, 220); ctx.lineTo(160, 220); ctx.lineTo(220, 280); ctx.lineTo(380, 280);
    ctx.moveTo(320, 80); ctx.lineTo(420, 80); ctx.lineTo(460, 120); ctx.lineTo(460, 240);
    ctx.moveTo(100, 420); ctx.lineTo(240, 420); ctx.lineTo(300, 360); ctx.lineTo(440, 360);
    ctx.stroke();

    // Cyan bus traces
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(50, 300); ctx.lineTo(140, 300); ctx.lineTo(190, 350); ctx.lineTo(340, 350);
    ctx.moveTo(260, 40); ctx.lineTo(260, 120); ctx.lineTo(300, 160);
    ctx.stroke();

    // IC Chip Package in center
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#00c8d7';
    ctx.lineWidth = 2;
    ctx.fillRect(176, 176, 160, 160);
    ctx.strokeRect(176, 176, 160, 160);

    // IC Chip Pins
    ctx.fillStyle = '#d4af37';
    for (let i = 0; i < 6; i++) {
        ctx.fillRect(162, 192 + i * 22, 14, 8);
        ctx.fillRect(336, 192 + i * 22, 14, 8);
        ctx.fillRect(192 + i * 22, 162, 8, 14);
        ctx.fillRect(192 + i * 22, 336, 8, 14);
    }

    // Silkscreen text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PWNBOX // LAB', 256, 235);
    ctx.fillStyle = '#00ffcc';
    ctx.font = 'bold 11px "Space Mono", monospace';
    ctx.fillText('SECURITY CORE // RDV4', 256, 260);
    ctx.fillStyle = '#a0aec0';
    ctx.font = '9px monospace';
    ctx.fillText('FCC ID: 2A3X-HAK5 // CE-COMPLIANT', 256, 285);

    // Silkscreen border frame
    ctx.strokeStyle = 'rgba(0, 200, 215, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 472);

    return new THREE.CanvasTexture(canvas);
}

function open3DViewer(imgSrc, name, vendor) {
    if (typeof THREE === 'undefined') {
        alert('3D Graphics Engine is initializing. Please try again in a moment.');
        return;
    }

    const modal = document.getElementById('device3DViewerModal');
    if (!modal) return;

    // Reparent modal directly to document.body to ensure complete viewport breakout
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
        viewer3D.scene.fog = new THREE.FogExp2(0x050811, 0.03);

        viewer3D.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        viewer3D.camera.position.set(0, 0, 6.0);
        viewer3D.cameraDistance = 6.0;
        viewer3D.targetCameraDistance = 6.0;

        viewer3D.clock = new THREE.Clock();
        viewer3D.textureLoader = new THREE.TextureLoader();

        // Atmospheric Studio Lighting for metallic cyber hardware
        const ambLight = new THREE.AmbientLight(0xffffff, 1.15);
        viewer3D.scene.add(ambLight);

        const dirLightKey = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLightKey.position.set(4, 6, 8);
        viewer3D.scene.add(dirLightKey);

        const dirLightFill = new THREE.DirectionalLight(0x00c8d7, 0.85);
        dirLightFill.position.set(-6, -3, 6);
        viewer3D.scene.add(dirLightFill);

        const dirLightBack = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLightBack.position.set(0, 5, -8);
        viewer3D.scene.add(dirLightBack);

        const dirLightRim = new THREE.DirectionalLight(0x005A9C, 0.75);
        dirLightRim.position.set(0, -6, -6);
        viewer3D.scene.add(dirLightRim);

        const pointLight = new THREE.PointLight(0x00ffcc, 1.0, 25);
        pointLight.position.set(0, 0, 4.5);
        viewer3D.scene.add(pointLight);

        // 3D Background Meshes (Floor & Ceiling wireframes + Radar)
        setupBackgroundMeshes();

        // Mouse Drag / Touch / Scroll Controls
        setupViewer3DControls(wrap);
    } else {
        viewer3D.renderer.setSize(width, height);
        viewer3D.camera.aspect = width / height;
        viewer3D.camera.updateProjectionMatrix();
    }

    viewer3D.targetRotation = { x: 0.1, y: 0 };
    viewer3D.currentRotation = { x: 0.1, y: 0 };
    viewer3D.targetCameraDistance = 6.0;
    viewer3D.cameraDistance = 6.0;
    viewer3D.camera.position.set(0, 0, 6.0);

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
        opacity: 0.22
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

    // 4. Cyber Floating Particles
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

// ==========================================================================
// EXACT 3D HARDWARE SILHOUETTE REPLICA GENERATORS (NO FLAT PLATES)
// ==========================================================================
const DEVICE_CONTOURS = {
    "bash_bunny": [[902.0, 458.0], [895.0, 444.0], [877.0, 430.0], [790.0, 390.0], [741.0, 376.0], [682.0, 377.0], [254.0, 475.0], [244.0, 490.0], [240.0, 535.0], [115.0, 566.0], [117.0, 614.0], [184.0, 683.0], [317.0, 647.0], [334.0, 655.0], [377.0, 692.0], [398.0, 696.0], [855.0, 558.0], [889.0, 539.0], [897.0, 529.0], [903.0, 497.0]],
    "evil_portal": [[138.0, 254.0], [220.0, 676.0], [218.0, 691.0], [228.0, 708.0], [290.0, 731.0], [323.0, 729.0], [345.0, 736.0], [481.0, 811.0], [537.0, 833.0], [617.0, 808.0], [715.0, 757.0], [951.0, 664.0], [953.0, 653.0], [942.0, 647.0], [662.0, 581.0], [583.0, 253.0], [561.0, 246.0], [169.0, 242.0]],
    "flipper_zero": [[1023.0, 69.0], [929.0, 72.0], [746.0, 132.0], [386.0, 201.0], [269.0, 245.0], [158.0, 310.0], [97.0, 365.0], [71.0, 445.0], [75.0, 493.0], [115.0, 535.0], [99.0, 589.0], [109.0, 671.0], [196.0, 762.0], [241.0, 778.0], [915.0, 669.0], [942.0, 580.0], [912.0, 442.0], [819.0, 318.0], [784.0, 296.0], [208.0, 370.0], [174.0, 394.0], [116.0, 512.0], [90.0, 484.0], [100.0, 408.0], [141.0, 412.0], [232.0, 330.0], [357.0, 274.0], [549.0, 244.0], [818.0, 245.0], [839.0, 228.0], [979.0, 204.0], [1023.0, 182.0], [1023.0, 136.0], [915.0, 183.0], [677.0, 189.0], [945.0, 111.0], [1023.0, 110.0]],
    "kali_nethunter": [[922.0, 274.0], [887.0, 254.0], [623.0, 196.0], [587.0, 195.0], [560.0, 210.0], [420.0, 345.0], [340.0, 324.0], [288.0, 328.0], [89.0, 426.0], [79.0, 451.0], [94.0, 485.0], [240.0, 532.0], [104.0, 670.0], [97.0, 696.0], [105.0, 719.0], [146.0, 744.0], [467.0, 835.0], [509.0, 818.0], [667.0, 635.0], [762.0, 678.0], [813.0, 684.0], [838.0, 675.0], [985.0, 566.0], [994.0, 528.0], [985.0, 510.0], [809.0, 465.0], [925.0, 323.0], [932.0, 298.0]],
    "lan_turtle": [[927.0, 605.0], [820.0, 556.0], [790.0, 558.0], [780.0, 549.0], [793.0, 413.0], [840.0, 379.0], [846.0, 333.0], [831.0, 322.0], [712.0, 292.0], [649.0, 326.0], [549.0, 302.0], [524.0, 306.0], [336.0, 413.0], [207.0, 478.0], [196.0, 489.0], [189.0, 514.0], [188.0, 644.0], [197.0, 673.0], [210.0, 686.0], [445.0, 762.0], [501.0, 749.0], [563.0, 694.0], [615.0, 664.0], [676.0, 676.0], [713.0, 674.0], [817.0, 710.0], [884.0, 695.0], [901.0, 674.0], [920.0, 665.0]],
    "omg_cable": [[174.0, 142.0], [152.0, 188.0], [145.0, 240.0], [105.0, 276.0], [78.0, 317.0], [59.0, 417.0], [67.0, 471.0], [56.0, 487.0], [81.0, 507.0], [109.0, 574.0], [155.0, 617.0], [178.0, 615.0], [180.0, 580.0], [196.0, 569.0], [355.0, 602.0], [440.0, 664.0], [533.0, 716.0], [716.0, 861.0], [748.0, 848.0], [748.0, 835.0], [763.0, 822.0], [803.0, 855.0], [830.0, 863.0], [911.0, 774.0], [1023.0, 804.0], [1023.0, 780.0], [897.0, 748.0], [851.0, 713.0], [859.0, 653.0], [938.0, 591.0], [962.0, 558.0], [973.0, 511.0], [949.0, 354.0], [914.0, 292.0], [875.0, 250.0], [643.0, 119.0], [509.0, 83.0], [375.0, 76.0], [300.0, 84.0], [215.0, 110.0]],
    "packet_squirrel": [[896.0, 389.0], [884.0, 372.0], [860.0, 364.0], [808.0, 356.0], [760.0, 341.0], [720.0, 340.0], [652.0, 321.0], [572.0, 311.0], [540.0, 312.0], [399.0, 359.0], [157.0, 457.0], [149.0, 472.0], [153.0, 669.0], [167.0, 686.0], [507.0, 789.0], [546.0, 788.0], [878.0, 590.0], [893.0, 560.0]],
    "proxmark3": [[831.0, 268.0], [776.0, 253.0], [319.0, 279.0], [231.0, 288.0], [203.0, 303.0], [196.0, 318.0], [199.0, 518.0], [183.0, 526.0], [174.0, 547.0], [202.0, 600.0], [207.0, 747.0], [249.0, 794.0], [274.0, 794.0], [262.0, 817.0], [260.0, 844.0], [276.0, 845.0], [293.0, 833.0], [285.0, 818.0], [290.0, 810.0], [274.0, 805.0], [276.0, 797.0], [299.0, 799.0], [420.0, 776.0], [566.0, 764.0], [567.0, 778.0], [584.0, 779.0], [588.0, 767.0], [583.0, 762.0], [605.0, 751.0], [738.0, 732.0], [766.0, 736.0], [822.0, 718.0], [838.0, 683.0], [839.0, 503.0], [871.0, 501.0], [875.0, 487.0], [868.0, 462.0], [841.0, 451.0], [842.0, 290.0]],
    "usb_rubber_ducky": [[130.0, 411.0], [129.0, 527.0], [138.0, 576.0], [158.0, 603.0], [208.0, 630.0], [376.0, 638.0], [463.0, 650.0], [654.0, 664.0], [669.0, 669.0], [660.0, 684.0], [663.0, 707.0], [693.0, 694.0], [701.0, 673.0], [719.0, 667.0], [736.0, 649.0], [779.0, 652.0], [806.0, 642.0], [864.0, 641.0], [882.0, 637.0], [896.0, 625.0], [898.0, 449.0], [875.0, 442.0], [739.0, 435.0], [730.0, 406.0], [714.0, 400.0], [696.0, 383.0], [222.0, 353.0], [152.0, 380.0]],
    "wifi_pineapple": [[135.0, 120.0], [133.0, 142.0], [273.0, 460.0], [271.0, 539.0], [202.0, 556.0], [177.0, 586.0], [183.0, 704.0], [218.0, 744.0], [628.0, 812.0], [667.0, 801.0], [715.0, 756.0], [772.0, 737.0], [819.0, 752.0], [889.0, 730.0], [922.0, 747.0], [954.0, 743.0], [960.0, 696.0], [876.0, 627.0], [874.0, 560.0], [853.0, 531.0], [651.0, 500.0], [803.0, 153.0], [792.0, 120.0], [760.0, 131.0], [595.0, 496.0], [539.0, 498.0], [534.0, 104.0], [519.0, 85.0], [500.0, 88.0], [490.0, 109.0], [485.0, 475.0], [333.0, 524.0], [322.0, 515.0], [321.0, 446.0], [160.0, 111.0]]
};

function getDeviceKey(name = '', imgSrc = '') {
    const s = (name + ' ' + imgSrc).toLowerCase();
    if (s.includes('pineapple')) return 'wifi_pineapple';
    if (s.includes('nethunter')) return 'kali_nethunter';
    if (s.includes('ducky')) return 'usb_rubber_ducky';
    if (s.includes('bunny')) return 'bash_bunny';
    if (s.includes('flipper')) return 'flipper_zero';
    if (s.includes('turtle')) return 'lan_turtle';
    if (s.includes('omg') || s.includes('cable')) return 'omg_cable';
    if (s.includes('squirrel')) return 'packet_squirrel';
    if (s.includes('proxmark')) return 'proxmark3';
    if (s.includes('evil') || s.includes('portal')) return 'evil_portal';
    return 'wifi_pineapple';
}

function build3DDeviceModel(imgSrc, name = '') {
    if (viewer3D.deviceGroup) {
        viewer3D.scene.remove(viewer3D.deviceGroup);
        viewer3D.deviceGroup = null;
    }

    viewer3D.deviceGroup = new THREE.Group();

    const devKey = getDeviceKey(name, imgSrc);
    const pts = DEVICE_CONTOURS[devKey] || DEVICE_CONTOURS['wifi_pineapple'];

    // 1. Build exact 2D shape following the hardware silhouette
    const shape = new THREE.Shape();
    const scale = 5.2 / 1024;
    const cx = 512, cy = 512;

    shape.moveTo((pts[0][0] - cx) * scale, -(pts[0][1] - cy) * scale);
    for (let i = 1; i < pts.length; i++) {
        shape.lineTo((pts[i][0] - cx) * scale, -(pts[i][1] - cy) * scale);
    }
    shape.closePath();

    // 2. Extrude with smooth volumetric depth and beveled edges
    const extrudeSettings = {
        depth: 0.32,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.035,
        bevelThickness: 0.035
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // 3. Map UV coordinates directly to the 1024x1024 image coordinate system
    const pos = geom.attributes.position;
    const uvs = geom.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const u = (x / scale + cx) / 1024;
        const v = (y / scale + cy) / 1024;
        uvs.setXY(i, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
    }
    uvs.needsUpdate = true;

    // 4. Split face groups: Front face (index 0), Back face (index 1), Extrusion & Bevels (index 2)
    const half = geom.groups[0].count / 2;
    geom.groups = [
        { start: half, count: half, materialIndex: 0 },
        { start: 0, count: half, materialIndex: 1 },
        { start: geom.groups[0].count, count: geom.groups[1].count, materialIndex: 2 }
    ];

    geom.center();
    geom.computeVertexNormals();

    // 5. High-Definition Materials
    const frontTex = viewer3D.textureLoader.load(imgSrc);
    frontTex.generateMipmaps = true;
    frontTex.minFilter = THREE.LinearMipmapLinearFilter;
    if (viewer3D.renderer && viewer3D.renderer.capabilities.getMaxAnisotropy) {
        frontTex.anisotropy = viewer3D.renderer.capabilities.getMaxAnisotropy();
    }

    // Front: 100% exact replica of the photorealistic device image
    const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        roughness: 0.28,
        metalness: 0.18,
        side: THREE.FrontSide
    });

    // Back: High-tech cyber PCB silkscreen
    const pcbTex = createPCBTexture();
    const backMat = new THREE.MeshStandardMaterial({
        map: pcbTex,
        roughness: 0.4,
        metalness: 0.55,
        side: THREE.FrontSide
    });

    // Sides & Bevel: Dark titanium tactical chassis
    const sideMat = new THREE.MeshStandardMaterial({
        color: 0x141a26,
        roughness: 0.35,
        metalness: 0.82
    });

    const deviceMesh = new THREE.Mesh(geom, [frontMat, backMat, sideMat]);
    viewer3D.deviceGroup.add(deviceMesh);

    viewer3D.scene.add(viewer3D.deviceGroup);
}

function setupViewer3DControls(wrap) {
    // Mouse Dragging for 360° rotation
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

    // Touch support
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

    // Mouse Wheel Zoom In / Out
    wrap.addEventListener('wheel', (e) => {
        if (!viewer3D.active) return;
        e.preventDefault();
        const delta = e.deltaY * 0.004;
        viewer3D.targetCameraDistance = Math.max(
            viewer3D.minDistance,
            Math.min(viewer3D.maxDistance, viewer3D.targetCameraDistance + delta)
        );
    }, { passive: false });

    // Window Resize
    window.addEventListener('resize', () => {
        if (!viewer3D.active || !viewer3D.renderer) return;
        const w = wrap.clientWidth || window.innerWidth;
        const h = wrap.clientHeight || window.innerHeight;
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

    // Slow turntable rotation from left to right (when autoRotate is enabled and not manually dragging)
    if (viewer3D.autoRotate && !viewer3D.isDragging) {
        viewer3D.targetRotation.y += 0.0035;
    }

    // Smooth rotation lerp
    viewer3D.currentRotation.x += (viewer3D.targetRotation.x - viewer3D.currentRotation.x) * 0.08;
    viewer3D.currentRotation.y += (viewer3D.targetRotation.y - viewer3D.currentRotation.y) * 0.08;

    if (viewer3D.deviceGroup) {
        viewer3D.deviceGroup.rotation.x = viewer3D.currentRotation.x;
        viewer3D.deviceGroup.rotation.y = viewer3D.currentRotation.y;
    }

    // Smooth camera distance (zoom) lerp
    viewer3D.cameraDistance += (viewer3D.targetCameraDistance - viewer3D.cameraDistance) * 0.12;
    viewer3D.camera.position.z = viewer3D.cameraDistance;

    // Undulating wave animation for 3D Theme Floor Mesh
    if (viewer3D.floorMesh) {
        const posAttr = viewer3D.floorMesh.geometry.attributes.position;
        if (posAttr) {
            for (let i = 0; i < posAttr.count; i++) {
                const u = posAttr.getX(i);
                const v = posAttr.getY(i);
                const w = Math.sin(u * 0.22 + elapsed * 1.4) * Math.cos(v * 0.22 + elapsed * 1.1) * 0.38;
                posAttr.setZ(i, w);
            }
            posAttr.needsUpdate = true;
        }
    }

    if (viewer3D.radarGrid) {
        viewer3D.radarGrid.rotation.y += 0.0015;
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
}

function toggle3DAutoRotate() {
    viewer3D.autoRotate = !viewer3D.autoRotate;
    updateAutoRotateUI();
    playEngineSound('click');
}

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
    viewer3D.targetRotation = { x: 0.1, y: 0 };
    viewer3D.targetCameraDistance = 6.0;
    playEngineSound('tab');
}

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
