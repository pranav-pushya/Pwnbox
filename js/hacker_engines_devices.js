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

document.addEventListener('DOMContentLoaded', () => {
    initViewTabs();
    updateFilterPills('devices');
    initSearchInput();
    applyAllFilters();
});
