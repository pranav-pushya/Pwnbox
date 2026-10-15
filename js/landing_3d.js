/**
 * PWNBOX CYBER COMMAND - 3D HOLOGRAPHIC QUANTUM MATRIX SIMULATOR
 * Built with Three.js (r128) & OrbitControls
 * 
 * Features:
 * - Full Screen Zoomed 3D Matrix View
 * - Interactive Drone Inspection & Smooth Camera Navigation
 * - Surge Power Overdrive Mode (Energy acceleration & light bursts)
 * - Tactical X-Ray CAD Wireframe Mode
 * - Architecture Disassembly / Radial Expand View
 * - Real-Time Photon Data Packets flowing along laser conduits
 * - Full 360-degree Draggable OrbitControls (Drag, Zoom, Pan)
 * - Real-Time HUD Telemetry + Web Audio API Sound Synthesizer
 */

(function () {
    'use strict';

    const container = document.getElementById('cyber-3d-viewport');
    if (!container || typeof THREE === 'undefined') {
        console.warn('Three.js or cyber-3d-viewport not available.');
        return;
    }

    // --- MODULES METADATA FOR 3D NODES ---
    const ATTACK_VECTORS = [
        { id: 1, code: 'M-01', name: 'Footprinting & Recon', icon: '🌐', tools: '22+ Tools', url: 'modules/Footprinting.html', color: 0x00f0ff, desc: 'Passive & active domain intelligence, DNS footprinting, whois reconnaissance.', cve: 'CVE-2023-3824', port: 'PORT 53/UDP, 443/TCP' },
        { id: 2, code: 'M-02', name: 'Network Scanning', icon: '📡', tools: '15+ Tools', url: 'modules/Scanning.html', color: 0x22c55e, desc: 'Host discovery, stealth SYN scans, OS fingerprinting with Nmap & Hping3.', cve: 'CVE-2023-44487', port: 'ALL PORTS (1-65535)' },
        { id: 3, code: 'M-03', name: 'Service Enumeration', icon: '🔍', tools: '8+ Tools', url: 'modules/Enumeration.html', color: 0xeab308, desc: 'SMB, SNMP, LDAP, NetBIOS user & share extraction.', cve: 'CVE-2020-1472', port: 'PORT 445/139 (SMB)' },
        { id: 4, code: 'M-04', name: 'Vulnerability Analysis', icon: '🛡️', tools: '5+ Tools', url: 'modules/Vulnerablity.html', color: 0xf97316, desc: 'CVE vulnerability assessment, CVSS scoring, Nikto & Nessus logic.', cve: 'CVSS 9.8 CRITICAL', port: 'VULN SCAN ENGINE' },
        { id: 5, code: 'M-05', name: 'System Exploitation', icon: '💻', tools: '6+ Tools', url: 'modules/SystemHacking.html', color: 0xd9291c, desc: 'Password cracking, payload generation, privilege escalation vectors.', cve: 'CVE-2021-4034 (PwnKit)', port: 'ROOT PRIVILEGE / UID 0' },
        { id: 6, code: 'M-06', name: 'Web App Threats', icon: '🕸️', tools: '6+ Tools', url: 'modules/WebAppThreats.html', color: 0xa855f7, desc: 'OWASP Top 10, SQL Injection, XSS, SSRF & authentication bypasses.', cve: 'CVE-2024-38812 (RCE)', port: 'PORT 80/443 (HTTP/S)' },
        { id: 7, code: 'M-07', name: 'OSINT Reconnaissance', icon: '🕵️', tools: '12+ Tools', url: 'modules/OSINT.html', color: 0x38bdf8, desc: 'Open-source threat intelligence, geolocation, dark web data mining.', cve: 'IDENTITY LEAK INTEL', port: 'DEEP & DARK WEB' }
    ];

    // --- SOUND SYNTHESIZER (ZERO-LATENCY WEB AUDIO API) ---
    let audioCtx = null;
    let sfxEnabled = true;

    function initAudio() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.08) {
        if (!sfxEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio policy fallback
        }
    }

    function playHoverSound() {
        playTone(920, 'sine', 0.04, 0.03);
    }

    function playClickSound() {
        playTone(1320, 'triangle', 0.09, 0.07);
        setTimeout(() => playTone(1840, 'sine', 0.1, 0.05), 30);
    }

    function playSurgeSound() {
        if (!sfxEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.35);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        } catch (e) {}
    }

    function playExpandSound() {
        if (!sfxEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } catch (e) {}
    }

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.012);

    const isMobileInitial = window.innerWidth <= 768;
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const defaultCamPos = new THREE.Vector3(0, isMobileInitial ? 1.0 : 1.6, isMobileInitial ? 24.0 : 14.5);
    camera.position.copy(defaultCamPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // OrbitControls
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.rotateSpeed = 0.85;
        controls.enableZoom = !isMobileInitial;
        controls.minDistance = 4;
        controls.maxDistance = 45;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.9;
        controls.enablePan = false;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 3.2, 80);
    pointLightCyan.position.set(16, 14, 14);
    scene.add(pointLightCyan);

    const pointLightRed = new THREE.PointLight(0xd9291c, 2.8, 80);
    pointLightRed.position.set(-16, -12, 12);
    scene.add(pointLightRed);

    // --- MAIN 3D HOLOGRAPHIC QUANTUM CORE GROUP ---
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Quantum Inner Glowing Sphere
    const coreGeo = new THREE.SphereGeometry(2.6, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.42
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(innerCore);

    // 2. Geodesic Polyhedral Tactical Shield (Icosahedron)
    const shieldGeo = new THREE.IcosahedronGeometry(3.6, 1);
    const shieldMat = new THREE.MeshLambertMaterial({
        color: 0x005a9c,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    masterGroup.add(shieldMesh);

    // 3. Dense Inner Energy Core
    const plasmaGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const plasmaMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: false
    });
    const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
    masterGroup.add(plasmaMesh);

    // 4. Tri-Axial Orbital Gyroscope Defense Rings
    const ringsGroup = new THREE.Group();
    masterGroup.add(ringsGroup);

    function createGyroRing(radius, tube, color, opacity) {
        const ringGeo = new THREE.TorusGeometry(radius, tube, 8, 80);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: opacity
        });
        return new THREE.Mesh(ringGeo, ringMat);
    }

    const ring1 = createGyroRing(5.4, 0.05, 0x00f0ff, 0.75);
    const ring2 = createGyroRing(6.3, 0.05, 0xd9291c, 0.75);
    const ring3 = createGyroRing(7.2, 0.06, 0xf2a900, 0.8);

    ring1.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    ring3.rotation.z = Math.PI / 6;

    ringsGroup.add(ring1);
    ringsGroup.add(ring2);
    ringsGroup.add(ring3);

    // 5. 7 Interactive Orbital Attack Vector Drones + Traveling Packets
    const nodeMeshes = [];
    const beamsGroup = new THREE.Group();
    masterGroup.add(beamsGroup);

    const packetMeshes = [];
    const baseOrbitRadius = 9.4;
    let currentOrbitRadius = baseOrbitRadius;
    const nodeCount = ATTACK_VECTORS.length;

    ATTACK_VECTORS.forEach((vector, i) => {
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = Math.cos(angle) * baseOrbitRadius;
        const z = Math.sin(angle) * baseOrbitRadius;
        const y = Math.sin(angle * 2) * 2.0;

        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(x, y, z);

        // Drone beacon (Octahedron)
        const beaconGeo = new THREE.OctahedronGeometry(0.8, 0);
        const beaconMat = new THREE.MeshBasicMaterial({
            color: vector.color,
            wireframe: true
        });
        const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
        nodeGroup.add(beaconMesh);

        // Solid luminous core
        const solidGeo = new THREE.SphereGeometry(0.35, 14, 14);
        const solidMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const solidMesh = new THREE.Mesh(solidGeo, solidMat);
        nodeGroup.add(solidMesh);

        // Orbital radar halo
        const haloGeo = new THREE.RingGeometry(1.0, 1.15, 28);
        const haloMat = new THREE.MeshBasicMaterial({
            color: vector.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.rotation.x = Math.PI / 2;
        nodeGroup.add(haloMesh);

        // Connecting Laser Beam
        const lineMat = new THREE.LineBasicMaterial({
            color: vector.color,
            transparent: true,
            opacity: 0.45
        });
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(x, y, z)
        ]);
        const beamLine = new THREE.Line(lineGeo, lineMat);
        beamsGroup.add(beamLine);

        // Traveling Photon Energy Packet
        const packetGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const packetMat = new THREE.MeshBasicMaterial({ color: vector.color });
        const packetMesh = new THREE.Mesh(packetGeo, packetMat);
        beamsGroup.add(packetMesh);
        packetMeshes.push({
            mesh: packetMesh,
            vectorIndex: i,
            angle: angle,
            baseY: y
        });

        // Metadata
        nodeGroup.userData = {
            ...vector,
            baseAngle: angle,
            baseY: y,
            targetScale: 1.0,
            beamLine: beamLine,
            haloMesh: haloMesh,
            beaconMesh: beaconMesh,
            solidMesh: solidMesh
        };

        masterGroup.add(nodeGroup);
        nodeMeshes.push(nodeGroup);
    });

    // 6. Cyberspace Floating Data Particles (1,800 Points)
    const particleCount = 1800;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        particlePos[i] = (Math.random() - 0.5) * 75;
        particlePos[i + 1] = (Math.random() - 0.5) * 55;
        particlePos[i + 2] = (Math.random() - 0.5) * 75;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.18,
        transparent: true,
        opacity: 0.65
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // 7. Tactical Cyber Ground Grid
    const gridHelper = new THREE.GridHelper(90, 50, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -9.0;
    scene.add(gridHelper);

    // --- STATE VARIABLES ---
    let isSurge = false;
    let isWireframe = false;
    let isExploded = false;
    let focusedNode = null;
    let targetCameraPos = defaultCamPos.clone();
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    // Raycasting & pointer detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let isPointerDown = false;
    let pointerDownPos = { x: 0, y: 0 };
    let hoveredNode = null;

    // HUD Elements
    const hudNodeName = document.getElementById('hudNodeName');
    const hudNodeMeta = document.getElementById('hudNodeMeta');
    const hudStatus = document.getElementById('hudStatus');

    function updateTelemetryHUD(vectorData) {
        if (!hudNodeName) return;
        if (vectorData) {
            hudNodeName.textContent = `${vectorData.code}: ${vectorData.name}`;
            hudNodeMeta.innerHTML = `<span style="color: #22c55e; font-weight: 700;">${vectorData.port}</span> // <span style="color: #eab308;">${vectorData.tools}</span> // ${vectorData.cve} <br/><button id="btnHudLaunch" class="btn-hud-launch">⚡ LAUNCH MODULE LAB &rarr;</button>`;
            hudNodeName.style.color = '#' + vectorData.color.toString(16).padStart(6, '0');
            if (hudStatus) hudStatus.textContent = `TARGET LOCKED: ${vectorData.code}`;

            const launchBtn = document.getElementById('btnHudLaunch');
            if (launchBtn) {
                launchBtn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    playClickSound();
                    window.location.href = vectorData.url;
                });
            }
        } else {
            hudNodeName.textContent = 'SYSTEM: QUANTUM DEFENSE MATRIX';
            hudNodeMeta.textContent = 'DRAG ANYWHERE TO ROTATE 360° // SCROLL TO ZOOM // CLICK NODES TO INSPECT';
            hudNodeName.style.color = '#38bdf8';
            if (hudStatus) {
                hudStatus.textContent = isSurge ? 'QUANTUM OVERDRIVE: SURGE ACTIVE' : 'QUANTUM CORE: ARMED';
            }
        }
    }

    function getPointerPos(e) {
        const rect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: ((clientX - rect.left) / rect.width) * 2 - 1,
            y: -((clientY - rect.top) / rect.height) * 2 + 1,
            rawX: clientX,
            rawY: clientY
        };
    }

    container.addEventListener('pointerdown', (e) => {
        isPointerDown = true;
        pointerDownPos = { x: e.clientX, y: e.clientY };
        initAudio();
    });

    container.addEventListener('pointermove', (e) => {
        const p = getPointerPos(e);
        mouse.x = p.x;
        mouse.y = p.y;
    });

    container.addEventListener('pointerup', (e) => {
        const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
        if (dist < 6 && hoveredNode) {
            playClickSound();
            selectNode(hoveredNode);
        }
        isPointerDown = false;
    });

    // Node Selection & Camera Focus
    function selectNode(nodeGroup) {
        const data = nodeGroup.userData;

        // If clicking same node twice, direct launch!
        if (focusedNode === nodeGroup) {
            window.location.href = data.url;
            return;
        }

        focusedNode = nodeGroup;
        updateTelemetryHUD(data);

        // Highlight vector buttons
        document.querySelectorAll('.btn-vector-pill').forEach(btn => {
            if (parseInt(btn.getAttribute('data-id'), 10) === data.id) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Tactile scale punch
        nodeGroup.scale.set(1.8, 1.8, 1.8);

        // Focus camera towards target drone
        if (controls) {
            controls.autoRotate = false;
            const btnAutoRotate = document.getElementById('btnAutoRotate');
            if (btnAutoRotate) {
                btnAutoRotate.classList.remove('active');
                btnAutoRotate.textContent = '⏸️ SPIN: OFF';
            }
        }

        const nodeWorldPos = new THREE.Vector3();
        nodeGroup.getWorldPosition(nodeWorldPos);
        targetLookAt.copy(nodeWorldPos);

        // Position camera slightly offset from the drone for a dramatic cinematic view
        const offsetDir = nodeWorldPos.clone().normalize();
        targetCameraPos.copy(nodeWorldPos).add(offsetDir.multiplyScalar(6.0)).add(new THREE.Vector3(0, 1.5, 0));
    }

    // --- HUD BUTTON ACTIONS ---
    // 1. Reset View
    const btnReset = document.getElementById('btnResetView');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            playClickSound();
            focusedNode = null;
            targetLookAt.set(0, 0, 0);
            targetCameraPos.copy(defaultCamPos);
            if (controls) {
                controls.reset();
                controls.autoRotate = true;
            }
            updateTelemetryHUD(null);
            document.querySelectorAll('.btn-vector-pill').forEach(b => b.classList.remove('active'));
            const btnAutoRotate = document.getElementById('btnAutoRotate');
            if (btnAutoRotate) {
                btnAutoRotate.classList.add('active');
                btnAutoRotate.textContent = '🌀 SPIN: ON';
            }
        });
    }

    // 2. Auto-Rotate Spin
    const btnAutoRotate = document.getElementById('btnAutoRotate');
    if (btnAutoRotate) {
        btnAutoRotate.addEventListener('click', () => {
            playClickSound();
            if (controls) {
                controls.autoRotate = !controls.autoRotate;
                btnAutoRotate.classList.toggle('active', controls.autoRotate);
                btnAutoRotate.textContent = controls.autoRotate ? '🌀 SPIN: ON' : '⏸️ SPIN: OFF';
            }
        });
    }

    // 3. Quantum Surge Overdrive Mode
    const btnSurge = document.getElementById('btnSurge');
    if (btnSurge) {
        btnSurge.addEventListener('click', () => {
            isSurge = !isSurge;
            playSurgeSound();
            btnSurge.classList.toggle('active', isSurge);
            btnSurge.textContent = isSurge ? '⚡ SURGE: ACTIVE' : '⚡ SURGE';

            if (isSurge) {
                pointLightCyan.intensity = 6.0;
                pointLightRed.intensity = 5.5;
                if (hudStatus) hudStatus.textContent = 'QUANTUM OVERDRIVE: SURGE ACTIVE';
            } else {
                pointLightCyan.intensity = 3.2;
                pointLightRed.intensity = 2.8;
                if (hudStatus) hudStatus.textContent = 'QUANTUM CORE: ARMED';
            }
        });
    }

    // 4. Tactical Wireframe X-Ray Mode
    const btnWireframe = document.getElementById('btnWireframe');
    if (btnWireframe) {
        btnWireframe.addEventListener('click', () => {
            isWireframe = !isWireframe;
            playClickSound();
            btnWireframe.classList.toggle('active', isWireframe);
            btnWireframe.textContent = isWireframe ? '📐 X-RAY: ON' : '📐 X-RAY';

            // Apply wireframe styling to core objects
            plasmaMesh.material.wireframe = isWireframe;
            plasmaMesh.material.color.setHex(isWireframe ? 0x00ffaa : 0xffffff);
            shieldMesh.material.color.setHex(isWireframe ? 0x00ffaa : 0x005a9c);
            shieldMesh.material.opacity = isWireframe ? 0.95 : 0.8;
        });
    }

    // 5. Expand / Disassemble Architecture View
    const btnExplode = document.getElementById('btnExplode');
    if (btnExplode) {
        btnExplode.addEventListener('click', () => {
            isExploded = !isExploded;
            playExpandSound();
            btnExplode.classList.toggle('active', isExploded);
            btnExplode.textContent = isExploded ? '💥 COMPACT' : '💥 EXPAND';
        });
    }

    // 6. Sound Effects Toggle
    const btnSfx = document.getElementById('btnSfx');
    if (btnSfx) {
        btnSfx.addEventListener('click', () => {
            sfxEnabled = !sfxEnabled;
            btnSfx.classList.toggle('active', sfxEnabled);
            btnSfx.textContent = sfxEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
            if (sfxEnabled) playClickSound();
        });
    }

    // Vector Pills Selection
    document.querySelectorAll('.btn-vector-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            const targetNode = nodeMeshes.find(n => n.userData.id === id);
            if (targetNode) {
                playClickSound();
                selectNode(targetNode);
            }
        });
    });

    // Window Resize Handling
    function onResize() {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        const isMobile = window.innerWidth <= 768;
        defaultCamPos.set(0, isMobile ? 1.0 : 1.6, isMobile ? 24.0 : 14.5);
        if (!focusedNode) {
            targetCameraPos.copy(defaultCamPos);
        }
        if (controls) {
            controls.enableZoom = !isMobile;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // Theme Switch Sync
    function syncThemeColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        if (theme === 'dark') {
            scene.fog.color.setHex(0x060913);
            ambientLight.intensity = 0.9;
            gridHelper.material.opacity = 0.35;
        } else {
            scene.fog.color.setHex(0x0a1220);
            ambientLight.intensity = 1.0;
            gridHelper.material.opacity = 0.25;
        }
    }
    syncThemeColors();

    const themeObserver = new MutationObserver(() => syncThemeColors());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // --- ANIMATION & RENDER LOOP (60 FPS) ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        const speedMult = isSurge ? 3.5 : 1.0;

        // Smooth Camera & Target Lerp if focused
        if (focusedNode) {
            camera.position.lerp(targetCameraPos, 0.05);
            if (controls) {
                controls.target.lerp(targetLookAt, 0.08);
            }
        }

        // Update OrbitControls
        if (controls) {
            controls.update();
        }

        // Animate Rings
        ring1.rotation.x = elapsedTime * 0.35 * speedMult;
        ring1.rotation.y = elapsedTime * 0.25 * speedMult;
        ring2.rotation.y = -elapsedTime * 0.45 * speedMult;
        ring2.rotation.z = elapsedTime * 0.2 * speedMult;
        ring3.rotation.z = elapsedTime * 0.3 * speedMult;
        ring3.rotation.x = -elapsedTime * 0.35 * speedMult;

        // Disassemble / Explode Lerp
        const targetRadius = isExploded ? baseOrbitRadius * 1.55 : baseOrbitRadius;
        currentOrbitRadius += (targetRadius - currentOrbitRadius) * 0.08;

        const targetShieldScale = isExploded ? 1.6 : 1.0;
        shieldMesh.scale.lerp(new THREE.Vector3(targetShieldScale, targetShieldScale, targetShieldScale), 0.08);

        const targetRingScale = isExploded ? 1.35 : 1.0;
        ringsGroup.scale.lerp(new THREE.Vector3(targetRingScale, targetRingScale, targetRingScale), 0.08);

        // Pulse Core
        const pulseAmp = isSurge ? 0.16 : 0.06;
        const pulseSpeed = isSurge ? 6.0 : 2.5;
        const coreScale = 1.0 + Math.sin(elapsedTime * pulseSpeed) * pulseAmp;
        innerCore.scale.set(coreScale, coreScale, coreScale);

        plasmaMesh.rotation.y = elapsedTime * 1.2 * speedMult;
        plasmaMesh.rotation.x = elapsedTime * 0.8 * speedMult;

        // Particle floating drift
        particleField.rotation.y = -elapsedTime * (isSurge ? 0.08 : 0.02);

        // Raycasting for Nodes Hover
        raycaster.setFromCamera(mouse, camera);

        let currentHover = null;
        for (const node of nodeMeshes) {
            const intersects = raycaster.intersectObjects(node.children);
            if (intersects.length > 0) {
                currentHover = node;
                break;
            }
        }

        if (currentHover !== hoveredNode) {
            if (currentHover) {
                container.style.cursor = 'pointer';
                currentHover.userData.targetScale = 1.45;
                currentHover.userData.haloMesh.material.opacity = 1.0;
                currentHover.userData.beamLine.material.opacity = 0.9;
                if (!focusedNode) {
                    updateTelemetryHUD(currentHover.userData);
                }
                playHoverSound();
            } else {
                container.style.cursor = 'grab';
                if (hoveredNode) {
                    hoveredNode.userData.targetScale = 1.0;
                    hoveredNode.userData.haloMesh.material.opacity = 0.6;
                    hoveredNode.userData.beamLine.material.opacity = 0.45;
                }
                if (!focusedNode) updateTelemetryHUD(null);
            }
            hoveredNode = currentHover;
        }

        // Smoothly animate node positions, scales & satellite spinning
        nodeMeshes.forEach((node, i) => {
            const angle = node.userData.baseAngle;
            const x = Math.cos(angle) * currentOrbitRadius;
            const z = Math.sin(angle) * currentOrbitRadius;
            const y = node.userData.baseY;

            node.position.set(x, y, z);

            // Update Laser Line
            const positions = node.userData.beamLine.geometry.attributes.position.array;
            positions[3] = x;
            positions[4] = y;
            positions[5] = z;
            node.userData.beamLine.geometry.attributes.position.needsUpdate = true;

            // Animated Traveling Photon Packets along Laser
            const pkt = packetMeshes[i];
            if (pkt) {
                const packetProgress = (elapsedTime * (isSurge ? 1.8 : 0.7) + i * 0.14) % 1.0;
                pkt.mesh.position.set(
                    x * packetProgress,
                    y * packetProgress,
                    z * packetProgress
                );
            }

            // Scale Lerp
            const curScale = node.scale.x;
            const target = node.userData.targetScale;
            const newScale = curScale + (target - curScale) * 0.15;
            node.scale.set(newScale, newScale, newScale);

            node.userData.beaconMesh.rotation.x += 0.02 * speedMult;
            node.userData.beaconMesh.rotation.y += 0.03 * speedMult;
            node.userData.haloMesh.rotation.z = elapsedTime * 0.8 * speedMult;
        });

        renderer.render(scene, camera);
    }

    animate();
})();
