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
        const ambLight = new THREE.AmbientLight(0xffffff, 0.95);
        viewer3D.scene.add(ambLight);

        const dirLightKey = new THREE.DirectionalLight(0xffffff, 1.4);
        dirLightKey.position.set(5, 7, 6);
        viewer3D.scene.add(dirLightKey);

        const dirLightFill = new THREE.DirectionalLight(0x00c8d7, 1.2);
        dirLightFill.position.set(-6, -2, -4);
        viewer3D.scene.add(dirLightFill);

        const dirLightRim = new THREE.DirectionalLight(0x005A9C, 1.0);
        dirLightRim.position.set(0, 6, -6);
        viewer3D.scene.add(dirLightRim);

        const pointLight = new THREE.PointLight(0x00ffcc, 1.1, 25);
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
// BESPOKE PROCEDURAL 3D HARDWARE MODEL GENERATORS (NO FLAT PLATES)
// ==========================================================================
function getHardwareMaterials() {
    return {
        metalChrome: new THREE.MeshStandardMaterial({
            color: 0xd8dde4,
            metalness: 0.95,
            roughness: 0.18
        }),
        metalGold: new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.9,
            roughness: 0.25
        }),
        plasticDark: new THREE.MeshStandardMaterial({
            color: 0x141822,
            roughness: 0.45,
            metalness: 0.25
        }),
        plasticDarkMatte: new THREE.MeshStandardMaterial({
            color: 0x0c0f16,
            roughness: 0.75,
            metalness: 0.15
        }),
        plasticWhite: new THREE.MeshStandardMaterial({
            color: 0xf0f3f7,
            roughness: 0.38,
            metalness: 0.08
        }),
        plasticOrange: new THREE.MeshStandardMaterial({
            color: 0xff6600,
            roughness: 0.35,
            metalness: 0.1,
            emissive: 0x441800
        })
    };
}

// 1. WiFi Pineapple Tactical Router
function buildPineapple3D(group, tex, mats) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 0.7), mats.plasticDark);
    group.add(body);

    const front = new THREE.Mesh(new THREE.PlaneGeometry(3.56, 1.96), new THREE.MeshStandardMaterial({
        map: tex, transparent: true, alphaTest: 0.05, roughness: 0.3, metalness: 0.2
    }));
    front.position.z = 0.355;
    group.add(front);

    const back = new THREE.Mesh(new THREE.PlaneGeometry(3.56, 1.96), mats.plasticDarkMatte);
    back.rotation.y = Math.PI;
    back.position.z = -0.355;
    group.add(back);

    // 4 Rear Rubber Feet
    const footGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.85 });
    [[-1.4, -0.7], [1.4, -0.7], [-1.4, 0.7], [1.4, 0.7]].forEach(([fx, fy]) => {
        const foot = new THREE.Mesh(footGeo, footMat);
        foot.rotation.x = Math.PI / 2;
        foot.position.set(fx, fy, -0.38);
        group.add(foot);
    });

    // 3 Tactical Dipole Antennas
    const antConfigs = [
        { x: -1.15, angleZ: -0.16 },
        { x: 0.0, angleZ: 0.0 },
        { x: 1.15, angleZ: 0.16 }
    ];
    antConfigs.forEach(cfg => {
        const antGroup = new THREE.Group();
        antGroup.position.set(cfg.x, 1.0, 0);

        const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 8), mats.metalGold);
        sma.position.y = 0.11;
        antGroup.add(sma);

        const joint = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), mats.plasticDark);
        joint.position.y = 0.26;
        antGroup.add(joint);

        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 2.0, 16), mats.plasticDark);
        mast.position.y = 1.25;
        mast.rotation.z = cfg.angleZ;
        antGroup.add(mast);

        group.add(antGroup);
    });

    // Ethernet RJ45 socket on left flank
    const rj45 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.48), mats.metalChrome);
    rj45.position.set(-1.81, 0, 0);
    group.add(rj45);

    // USB Host Port on right flank
    const usb = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.48), mats.metalChrome);
    usb.position.set(1.81, -0.2, 0);
    group.add(usb);

    // Status LEDs on front bottom
    const ledColors = [0x00ff66, 0x00ffcc, 0x0088ff, 0xffaa00];
    ledColors.forEach((color, i) => {
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), new THREE.MeshBasicMaterial({ color }));
        led.position.set(0.7 + i * 0.22, -0.7, 0.36);
        group.add(led);
    });
}

// 2. Kali NetHunter Pentest Smartphone
function buildNetHunter3D(group, tex, mats) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.8, 0.22), new THREE.MeshStandardMaterial({
        color: 0x161a22, metalness: 0.88, roughness: 0.2
    }));
    group.add(body);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.34, 4.74), new THREE.MeshStandardMaterial({
        map: tex, roughness: 0.15, metalness: 0.2
    }));
    screen.position.z = 0.115;
    group.add(screen);

    const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.34, 4.74), new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 0.85, opacity: 0.15, transparent: true, roughness: 0.05, reflectivity: 0.9
    }));
    glass.position.z = 0.12;
    group.add(glass);

    const camHole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    camHole.rotation.x = Math.PI / 2;
    camHole.position.set(0, 2.15, 0.125);
    group.add(camHole);

    // Rear Camera Bump
    const bump = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.3, 0.08), new THREE.MeshStandardMaterial({
        color: 0x0d1117, metalness: 0.9, roughness: 0.15
    }));
    bump.position.set(-0.65, 1.55, -0.15);
    group.add(bump);

    [-0.32, 0.32].forEach(offY => {
        const lensRim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 24), mats.metalChrome);
        lensRim.rotation.x = -Math.PI / 2;
        lensRim.position.set(-0.65, 1.55 + offY, -0.2);
        group.add(lensRim);

        const lensGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24), new THREE.MeshBasicMaterial({ color: 0x00c8d7 }));
        lensGlass.rotation.x = -Math.PI / 2;
        lensGlass.position.set(-0.65, 1.55 + offY, -0.21);
        group.add(lensGlass);
    });

    // Side Buttons & USB-C
    const pwrBtn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.08), mats.metalChrome);
    pwrBtn.position.set(1.22, 0.8, 0);
    group.add(pwrBtn);

    const volBtn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.08), mats.metalChrome);
    volBtn.position.set(1.22, 1.5, 0);
    group.add(volBtn);

    const usbc = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.1), mats.metalChrome);
    usbc.position.set(0, -2.41, 0);
    group.add(usbc);
}

// 3. USB Rubber Ducky Keystroke Injector
function buildRubberDucky3D(group, tex, mats) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.6, 0.48), mats.plasticDark);
    body.position.set(0, -0.4, 0);
    group.add(body);

    const front = new THREE.Mesh(new THREE.PlaneGeometry(1.26, 2.56), new THREE.MeshStandardMaterial({
        map: tex, transparent: true, alphaTest: 0.05, roughness: 0.35
    }));
    front.position.set(0, -0.4, 0.245);
    group.add(front);

    const back = new THREE.Mesh(new THREE.PlaneGeometry(1.26, 2.56), mats.plasticDarkMatte);
    back.rotation.y = Math.PI;
    back.position.set(0, -0.4, -0.245);
    group.add(back);

    // Protruding USB-A Plug
    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.86, 1.05, 0.38), mats.metalChrome);
    plug.position.set(0, 1.45, 0);
    group.add(plug);

    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.85, 0.12), new THREE.MeshStandardMaterial({ color: 0xf5f5f5 }));
    tongue.position.set(0, 1.52, 0.08);
    group.add(tongue);

    for (let i = 0; i < 4; i++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.03), mats.metalGold);
        pin.position.set(-0.24 + i * 0.16, 1.68, 0.14);
        group.add(pin);
    }

    [-0.2, 0.2].forEach(hx => {
        const hole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.04), new THREE.MeshBasicMaterial({ color: 0x05070c }));
        hole.position.set(hx, 1.55, 0.195);
        group.add(hole);
    });

    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 12, 24), mats.plasticDark);
    loop.position.set(0, -1.75, 0);
    group.add(loop);

    const led = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: 0x00ffcc }));
    led.position.set(0, 0.55, 0.25);
    group.add(led);

    const sdSlot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.15), mats.metalGold);
    sdSlot.position.set(0.66, -0.4, 0);
    group.add(sdSlot);
}

// 4. Bash Bunny Multi-Vector Attack Platform
function buildBashBunny3D(group, tex, mats) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.0, 0.55), mats.plasticDark);
    body.position.set(0, -0.4, 0);
    group.add(body);

    const front = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 2.96), new THREE.MeshStandardMaterial({
        map: tex, transparent: true, alphaTest: 0.05, roughness: 0.35
    }));
    front.position.set(0, -0.4, 0.28);
    group.add(front);

    const back = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 2.96), mats.plasticDarkMatte);
    back.rotation.y = Math.PI;
    back.position.set(0, -0.4, -0.28);
    group.add(back);

    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.15, 0.4), mats.metalChrome);
    plug.position.set(0, 1.65, 0);
    group.add(plug);

    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.9, 0.12), new THREE.MeshStandardMaterial({ color: 0xf5f5f5 }));
    tongue.position.set(0, 1.7, 0.08);
    group.add(tongue);

    for (let i = 0; i < 4; i++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.03), mats.metalGold);
        pin.position.set(-0.24 + i * 0.16, 1.85, 0.14);
        group.add(pin);
    }

    // 3-Position Payload Toggle Switch on Left Flank
    const switchSlot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, 0.24), new THREE.MeshBasicMaterial({ color: 0x05070c }));
    switchSlot.position.set(-0.71, -0.2, 0);
    group.add(switchSlot);

    const switchToggle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.18), mats.metalChrome);
    switchToggle.position.set(-0.77, -0.1, 0);
    group.add(switchToggle);

    const led = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 6), new THREE.MeshBasicMaterial({ color: 0x00ff66 }));
    led.rotation.x = Math.PI / 2;
    led.position.set(0, 0.65, 0.29);
    group.add(led);

    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 12, 24), mats.plasticDark);
    loop.position.set(0, -1.95, 0);
    group.add(loop);
}

// 5. Flipper Zero Multi-Tool
function buildFlipperZero3D(group, tex, mats) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.9, 0.78), mats.plasticWhite);
    group.add(body);

    // Orange Backlit Pixel LCD Screen on Left
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.35, 0.04), new THREE.MeshStandardMaterial({ color: 0x111620, roughness: 0.5 }));
    screenFrame.position.set(-0.75, 0.05, 0.4);
    group.add(screenFrame);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.2), new THREE.MeshStandardMaterial({
        color: 0xff6600, emissive: 0xff5500, emissiveIntensity: 0.85, roughness: 0.25
    }));
    screen.position.set(-0.75, 0.05, 0.425);
    group.add(screen);

    // Signature Orange 5-Way D-Pad on Right
    const dpadGroup = new THREE.Group();
    dpadGroup.position.set(0.9, 0.1, 0.41);

    const dpadRing = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 32), mats.plasticOrange);
    dpadRing.rotation.x = Math.PI / 2;
    dpadGroup.add(dpadRing);

    const notchMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [[0, 0.36], [0, -0.36], [-0.36, 0], [0.36, 0]].forEach(([nx, ny]) => {
        const notch = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), notchMat);
        notch.position.set(nx, ny, 0.05);
        dpadGroup.add(notch);
    });

    const okBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24), mats.plasticWhite);
    okBtn.rotation.x = Math.PI / 2;
    okBtn.position.z = 0.04;
    dpadGroup.add(okBtn);
    group.add(dpadGroup);

    const backBtn = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.08), mats.plasticOrange);
    backBtn.position.set(0.9, -0.55, 0.41);
    group.add(backBtn);

    // 18-Pin GPIO Header on Top Edge
    const gpioBar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 0.24), new THREE.MeshBasicMaterial({ color: 0x111111 }));
    gpioBar.position.set(0, 0.96, 0);
    group.add(gpioBar);
    for (let i = 0; i < 18; i++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.06), mats.metalGold);
        pin.position.set(-1.05 + i * 0.125, 1.03, 0);
        group.add(pin);
    }

    const irLens = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.35), new THREE.MeshPhysicalMaterial({ color: 0x1a001a, roughness: 0.1, transmission: 0.6 }));
    irLens.position.set(1.81, 0, 0);
    group.add(irLens);

    const usbc = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.45), mats.metalChrome);
    usbc.position.set(-1.81, 0, 0);
    group.add(usbc);
}

// 6. LAN Turtle Network Implant
function buildLanTurtle3D(group, tex, mats) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.9, 0.85), mats.plasticDark);
    group.add(body);

    const front = new THREE.Mesh(new THREE.PlaneGeometry(1.26, 2.86), new THREE.MeshStandardMaterial({
        map: tex, transparent: true, alphaTest: 0.05, roughness: 0.35
    }));
    front.position.z = 0.43;
    group.add(front);

    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.38), mats.metalChrome);
    plug.position.set(0, 1.95, 0);
    group.add(plug);

    // Modular RJ45 Female Ethernet Socket
    const rj45Shield = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.05, 0.8), mats.metalChrome);
    rj45Shield.position.set(0, -1.95, 0);
    group.add(rj45Shield);

    const rj45Hole = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.55), new THREE.MeshBasicMaterial({ color: 0x05070a }));
    rj45Hole.position.set(0, -2.15, 0);
    group.add(rj45Hole);

    for (let i = 0; i < 8; i++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.03), mats.metalGold);
        pin.position.set(-0.3 + i * 0.085, -2.1, 0.15);
        group.add(pin);
    }

    const ledG = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.04), new THREE.MeshBasicMaterial({ color: 0x00ff66 }));
    ledG.position.set(-0.45, -1.55, 0.41);
    group.add(ledG);
    const ledA = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.04), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    ledA.position.set(0.45, -1.55, 0.41);
    group.add(ledA);
}

// 7. O.MG Covert Attack Cable
function buildOmgCable3D(group, tex, mats) {
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.48, 2.2), mats.plasticDark);
    head.position.set(0, 0.8, 0);
    group.add(head);

    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.9), mats.metalChrome);
    tip.position.set(0, 0.8, 1.5);
    group.add(tip);

    const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 1.6), new THREE.MeshStandardMaterial({ color: 0x0b2e1b, roughness: 0.3 }));
    pcb.position.set(0, 1.05, 0);
    group.add(pcb);

    const soc = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }));
    soc.position.set(0, 1.08, 0);
    group.add(soc);

    const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color: 0x00c8d7 }));
    led.position.set(0.2, 1.1, 0.5);
    group.add(led);

    // Braided Cable Coil
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.8, -1.1),
        new THREE.Vector3(0, 0.5, -1.8),
        new THREE.Vector3(-0.9, 0.0, -2.0),
        new THREE.Vector3(-1.6, -0.6, -1.2),
        new THREE.Vector3(-1.2, -1.2, 0.0),
        new THREE.Vector3(0.0, -1.6, 1.0),
        new THREE.Vector3(1.2, -1.4, 0.2),
        new THREE.Vector3(1.4, -0.7, -1.0),
        new THREE.Vector3(0.8, -0.2, -1.8)
    ]);
    const cableGeo = new THREE.TubeGeometry(curve, 72, 0.12, 12, false);
    const cable = new THREE.Mesh(cableGeo, new THREE.MeshStandardMaterial({ color: 0x222834, roughness: 0.7 }));
    group.add(cable);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.5, 16), mats.plasticDark);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.8, -1.25);
    group.add(collar);
}

// 8. Packet Squirrel Inline Tap
function buildPacketSquirrel3D(group, tex, mats) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.9), mats.plasticDark);
    group.add(body);

    const front = new THREE.Mesh(new THREE.PlaneGeometry(2.36, 2.36), new THREE.MeshStandardMaterial({
        map: tex, transparent: true, alphaTest: 0.05, roughness: 0.35
    }));
    front.position.z = 0.455;
    group.add(front);

    // Dual Shielded RJ45 Sockets (Top & Bottom)
    [1.55, -1.55].forEach(posY => {
        const rj = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.75), mats.metalChrome);
        rj.position.set(0, posY, 0);
        group.add(rj);

        const hole = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.45, 0.6), new THREE.MeshBasicMaterial({ color: 0x05070a }));
        hole.position.set(0, posY > 0 ? posY + 0.2 : posY - 0.2, 0);
        group.add(hole);
    });

    const switchBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 0.3), new THREE.MeshBasicMaterial({ color: 0xff3344 }));
    switchBase.position.set(1.21, 0, 0);
    group.add(switchBase);
    for (let i = 0; i < 4; i++) {
        const sw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.06), mats.plasticWhite);
        sw.position.set(1.24, -0.3 + i * 0.2, 0);
        group.add(sw);
    }

    const pushBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16), mats.metalChrome);
    pushBtn.rotation.z = Math.PI / 2;
    pushBtn.position.set(-1.22, 0.4, 0);
    group.add(pushBtn);

    const led = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: 0x00ffcc }));
    led.position.set(-0.7, 0.7, 0.46);
    group.add(led);
}

// 9. Proxmark3 RDV4 RFID/NFC Analysis Platform
function buildProxmark33D(group, tex, mats) {
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.2, 0.2), mats.plasticDark);
    group.add(pcb);

    const front = new THREE.Mesh(new THREE.PlaneGeometry(2.78, 4.18), new THREE.MeshStandardMaterial({
        map: tex, transparent: true, alphaTest: 0.05, roughness: 0.3
    }));
    front.position.z = 0.105;
    group.add(front);

    // 13.56 MHz HF Concentric Gold Antenna Coils
    for (let r = 0.6; r <= 1.0; r += 0.1) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 48), mats.metalGold);
        coil.position.set(0, 1.1, 0.11);
        group.add(coil);
    }

    // Acrylic Face Plate elevated on 4 Brass Standoffs
    const acrylic = new THREE.Mesh(new THREE.BoxGeometry(2.78, 4.18, 0.05), new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.25, roughness: 0.1
    }));
    acrylic.position.z = 0.35;
    group.add(acrylic);

    [[-1.2, -1.9], [1.2, -1.9], [-1.2, 1.9], [1.2, 1.9]].forEach(([sx, sy]) => {
        const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.25, 6), mats.metalGold);
        standoff.rotation.x = Math.PI / 2;
        standoff.position.set(sx, sy, 0.23);
        group.add(standoff);

        const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 16), mats.metalChrome);
        screw.rotation.x = Math.PI / 2;
        screw.position.set(sx, sy, 0.38);
        group.add(screw);
    });

    const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 8), mats.metalGold);
    sma.position.set(0, 2.35, 0);
    group.add(sma);

    const ledColors = [0xff3344, 0x00ff66, 0x0088ff, 0xffcc00];
    ledColors.forEach((color, i) => {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), new THREE.MeshBasicMaterial({ color }));
        led.position.set(-0.6 + i * 0.4, -0.3, 0.12);
        group.add(led);
    });
}

// 10. Evil Portal Rogue AP Appliance
function buildEvilPortal3D(group, tex, mats) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.3, 0.8), mats.plasticDark);
    group.add(body);

    const front = new THREE.Mesh(new THREE.PlaneGeometry(3.48, 2.28), new THREE.MeshStandardMaterial({
        map: tex, transparent: true, alphaTest: 0.05, roughness: 0.3
    }));
    front.position.z = 0.405;
    group.add(front);

    // Dual High-Gain Omnidirectional External Antennas
    [-1.35, 1.35].forEach((ax, idx) => {
        const antGroup = new THREE.Group();
        antGroup.position.set(ax, 1.15, 0);

        const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 8), mats.metalGold);
        sma.position.y = 0.11;
        antGroup.add(sma);

        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 2.3, 16), mats.plasticDark);
        mast.position.y = 1.35;
        mast.rotation.z = idx === 0 ? -0.22 : 0.22;
        antGroup.add(mast);

        group.add(antGroup);
    });

    // Captive Portal Readout Display
    const oled = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.85), new THREE.MeshStandardMaterial({
        color: 0x050b18, emissive: 0x00c8d7, emissiveIntensity: 0.25, roughness: 0.2
    }));
    oled.position.set(0, -0.4, 0.415);
    group.add(oled);

    const rj45A = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.08), mats.metalChrome);
    rj45A.position.set(-0.8, 0, -0.42);
    group.add(rj45A);

    const rj45B = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.08), mats.metalChrome);
    rj45B.position.set(0, 0, -0.42);
    group.add(rj45B);
}

function build3DDeviceModel(imgSrc, name = '') {
    if (viewer3D.deviceGroup) {
        viewer3D.scene.remove(viewer3D.deviceGroup);
        viewer3D.deviceGroup = null;
    }

    viewer3D.deviceGroup = new THREE.Group();

    const tex = viewer3D.textureLoader.load(imgSrc);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;

    const mats = getHardwareMaterials();
    const n = (name || '').toLowerCase();

    if (n.includes('pineapple')) {
        buildPineapple3D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('nethunter')) {
        buildNetHunter3D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('ducky')) {
        buildRubberDucky3D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('bunny')) {
        buildBashBunny3D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('flipper')) {
        buildFlipperZero3D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('turtle')) {
        buildLanTurtle3D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('omg') || n.includes('cable')) {
        buildOmgCable3D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('squirrel')) {
        buildPacketSquirrel3D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('proxmark')) {
        buildProxmark33D(viewer3D.deviceGroup, tex, mats);
    } else if (n.includes('evil') || n.includes('portal')) {
        buildEvilPortal3D(viewer3D.deviceGroup, tex, mats);
    } else {
        buildPineapple3D(viewer3D.deviceGroup, tex, mats);
    }

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
