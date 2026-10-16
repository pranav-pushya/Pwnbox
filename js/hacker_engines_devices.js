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
    orbitRing1: null,
    orbitRing2: null,
    autoRotate: true,
    isDragging: false,
    pointerStart: { x: 0, y: 0 },
    currentRotation: { x: 0.1, y: 0 },
    targetRotation: { x: 0.1, y: 0 },
    cameraDistance: 6.0,
    targetCameraDistance: 6.0,
    minDistance: 2.8,
    maxDistance: 12.0,
    clock: null,
    textureLoader: null,
    currentImgSrc: null
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

    playEngineSound('tab');

    const nameEl = document.getElementById('viewer3DDeviceName');
    const vendorEl = document.getElementById('viewer3DDeviceVendor');
    if (nameEl) nameEl.textContent = name;
    if (vendorEl) vendorEl.textContent = vendor;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    viewer3D.active = true;
    viewer3D.currentImgSrc = imgSrc;
    viewer3D.autoRotate = true;
    updateAutoRotateUI();

    initOrUpdate3DScene(imgSrc);
}

function initOrUpdate3DScene(imgSrc) {
    const wrap = document.getElementById('viewer3DCanvasWrap');
    if (!wrap) return;

    const width = wrap.clientWidth || window.innerWidth;
    const height = wrap.clientHeight || window.innerHeight;

    if (!viewer3D.renderer) {
        viewer3D.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        viewer3D.renderer.setSize(width, height);
        viewer3D.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        wrap.appendChild(viewer3D.renderer.domElement);

        viewer3D.scene = new THREE.Scene();
        viewer3D.scene.fog = new THREE.FogExp2(0x050811, 0.035);

        viewer3D.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        viewer3D.camera.position.set(0, 0, 6.0);
        viewer3D.cameraDistance = 6.0;
        viewer3D.targetCameraDistance = 6.0;

        viewer3D.clock = new THREE.Clock();
        viewer3D.textureLoader = new THREE.TextureLoader();

        // Atmospheric Lights
        const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
        viewer3D.scene.add(ambLight);

        const dirLightCyan = new THREE.DirectionalLight(0x00c8d7, 1.8);
        dirLightCyan.position.set(5, 6, 6);
        viewer3D.scene.add(dirLightCyan);

        const dirLightRed = new THREE.DirectionalLight(0xff3344, 1.4);
        dirLightRed.position.set(-6, -4, -6);
        viewer3D.scene.add(dirLightRed);

        const dirLightBlue = new THREE.DirectionalLight(0x005A9C, 1.0);
        dirLightBlue.position.set(0, 5, -5);
        viewer3D.scene.add(dirLightBlue);

        const pointLight = new THREE.PointLight(0x00ffcc, 1.5, 25);
        pointLight.position.set(0, 0, 4);
        viewer3D.scene.add(pointLight);

        // 3D Background Meshes
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

    build3DDeviceModel(imgSrc);

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

function build3DDeviceModel(imgSrc) {
    if (viewer3D.deviceGroup) {
        viewer3D.scene.remove(viewer3D.deviceGroup);
        viewer3D.deviceGroup = null;
    }

    viewer3D.deviceGroup = new THREE.Group();

    // 1. Front Texture Plane (Isolated Device Photograph)
    const frontTex = viewer3D.textureLoader.load(imgSrc);
    frontTex.generateMipmaps = true;
    frontTex.minFilter = THREE.LinearMipmapLinearFilter;
    const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        transparent: true,
        alphaTest: 0.03,
        roughness: 0.25,
        metalness: 0.2,
        side: THREE.FrontSide
    });
    const frontPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), frontMat);
    frontPlane.position.z = 0.085;
    viewer3D.deviceGroup.add(frontPlane);

    // 2. Back Texture Plane (Procedural Cyber PCB Silkscreen)
    const pcbTex = createPCBTexture();
    const backMat = new THREE.MeshStandardMaterial({
        map: pcbTex,
        roughness: 0.35,
        metalness: 0.5,
        side: THREE.FrontSide
    });
    const backPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), backMat);
    backPlane.rotation.y = Math.PI;
    backPlane.position.z = -0.085;
    viewer3D.deviceGroup.add(backPlane);

    // 3. Volumetric Metallic Core Body Slab
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x0c1220,
        roughness: 0.4,
        metalness: 0.85
    });
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(3.55, 3.55, 0.16), bodyMat);
    viewer3D.deviceGroup.add(bodyMesh);

    // 4. Glowing Neon Cyan Edge Bevels
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.56, 3.56, 0.17));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00c8d7, transparent: true, opacity: 0.45 });
    const wireframeBox = new THREE.LineSegments(edges, lineMat);
    viewer3D.deviceGroup.add(wireframeBox);

    // 5. Holographic Gimbal Orbit Rings
    // Ring 1 (Cyan Orbit)
    const ring1Geo = new THREE.TorusGeometry(2.65, 0.016, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00c8d7, transparent: true, opacity: 0.65 });
    viewer3D.orbitRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    viewer3D.orbitRing1.rotation.x = Math.PI / 2;
    viewer3D.deviceGroup.add(viewer3D.orbitRing1);

    // Ring 2 (Neon Red Orbit)
    const ring2Geo = new THREE.TorusGeometry(2.9, 0.014, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xff3344, transparent: true, opacity: 0.5 });
    viewer3D.orbitRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    viewer3D.orbitRing2.rotation.x = Math.PI / 3.5;
    viewer3D.orbitRing2.rotation.y = Math.PI / 4;
    viewer3D.deviceGroup.add(viewer3D.orbitRing2);

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

    // Rotate gimbal rings
    if (viewer3D.orbitRing1) {
        viewer3D.orbitRing1.rotation.z += 0.006;
    }
    if (viewer3D.orbitRing2) {
        viewer3D.orbitRing2.rotation.z -= 0.004;
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
