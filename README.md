# 🛡️ PWNBOX // CYBER COMMAND ACADEMY
### *Advanced Offensive & Defensive Cybersecurity Simulation Platform*

[![Platform](https://img.shields.io/badge/Platform-Web%20Simulator-00f0ff?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/)
[![Engine](https://img.shields.io/badge/3D%20Engine-Three.js%20r128-005A9C?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![AI Backend](https://img.shields.io/badge/AI%20Mentor-Groq%20Cloud%20LLM-D9291C?style=for-the-badge&logo=fastapi&logoColor=white)](https://groq.com/)
[![Design System](https://img.shields.io/badge/Design-Brutalist%20Bauhaus-F2A900?style=for-the-badge&logo=artstation&logoColor=black)](https://en.wikipedia.org/wiki/Bauhaus)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla%20ES6%2B-10b981?style=for-the-badge&logo=javascript&logoColor=white)](https://developer.mozilla.org/)

---

## ⚡ Executive Summary

**PwnBox Academy** is a high-performance, in-browser tactical cybersecurity training academy engineered to bridge theoretical knowledge and practical ethical hacking. Built upon a high-contrast **Neo-Bauhaus design system** paired with an **immersive 3D holographic command matrix**, the platform equips recruits, penetration testers, and defense analysts with interactive kill-chain laboratories, an encyclopedic 10-chapter master guide, a customizable MCQ examination engine, and an on-demand AI doubt assistant.

Designed & Developed by **Pranav Pushya**.

---

## 🏛️ System Architecture & File Structure

The project follows a clean, decoupled client-side architecture with zero external package manager overhead.

```text
├── index.html                   # Cyber Command Landing Page & 3D Matrix Gateway
├── dashboard.html               # Main Agent Training Dashboard & Progress Hub
│
├── 📂 Core Training Modules (The 7-Stage Cyber Kill Chain)
│   ├── Footprinting.html        # Module 01: Passive & Active Reconnaissance (22+ Tools)
│   ├── Scanning.html            # Module 02: Network Probing & Host Discovery (15+ Tools)
│   ├── Enumeration.html         # Module 03: Service, Protocol & User Mining (8+ Tools)
│   ├── Vulnerablity.html        # Module 04: Vulnerability Assessment & CVSS Auditing (5+ Tools)
│   ├── SystemHacking.html       # Module 05: System Exploitation & Privilege Escalation (6+ Tools)
│   ├── WebAppThreats.html       # Module 06: OWASP Top 10 & Web Attack Vectors (6+ Tools)
│   └── OSINT.html               # Module 07: Open-Source Intelligence & Threat Intel (12+ Tools)
│
├── 📂 Master Guide & Knowledge Base ("Zero to Cyber")
│   ├── cybersecurity_masterguide.html  # Master Guide Central Hub
│   ├── masterguide_ch1.html – ch10.html # 10 Deep-Dive Chapters (100+ Documented Terms)
│   └── masterguide_test.html           # Comprehensive MCQ Examination Engine
│
├── 📂 css/                      # Modular Bauhaus Design System & Themes
│   ├── landing.css              # Landing page layout & 3D HUD canvas styling
│   ├── index.css                # Dashboard styling, 3D ID cards, cheat drawer
│   ├── masterguide_test.css     # Examination engine layout & score analytics
│   ├── masterguide_chat.css     # AI doubt sidebar & chat message styling
│   ├── resizer.css              # Split-pane draggable laboratory panes
│   └── [Module].css             # Per-module dedicated cyber terminal stylesheets
│
├── 📂 js/                       # Core Logic, 3D Shaders & AI Integration
│   ├── config.js                # Centralized Groq API configuration & shared keys
│   ├── landing_3d.js            # Three.js 3D Quantum Holographic Core & OrbitControls
│   ├── matrix_rain.js           # Fullscreen Red/Blue/Green cascading digital rain
│   ├── OrbitControls.js         # Camera manipulation & 360° inertia drag controls
│   ├── three.min.js             # Bundled Three.js (r128) WebGL engine (offline-ready)
│   ├── index.js                 # Dashboard progression, stats sync, agent ID card
│   ├── masterguide_test.js      # Quiz exam controller, scoring & local history
│   ├── masterguide_chat.js      # On-demand AI doubt chat handler (Hinglish/English)
│   ├── theme.js                 # Global instant dark/light mode toggle
│   └── [Module].js              # Per-module terminal simulators & interactive labs
│
├── 📂 quiz-data/                # Examination Question Banks & Unified Bundle
│   ├── masterguide_quiz_ch1.json – ch10.json  # Chapter-specific structured MCQs
│   ├── masterguide_quiz_all.json              # Aggregated 100+ master exam dataset
│   └── quiz_data.js                           # Browser & Node isomorphic quiz bundle
│
├── 📂 scripts/                  # Automated Maintenance & Codebase Utilities
│   ├── add_back_btn.py          # Bulk navigation routing script
│   ├── add_favicons.py          # Favicon injection utility
│   └── add_resizers.py          # Multi-pane lab DOM injector
│
└── 📂 assets/
    ├── favicon-main.svg         # Tactical shield dashboard favicon
    └── favicon-guide.svg        # Encyclopedic master guide favicon
```

---

## 🚀 Key Functional Capabilities

### 1. 🌐 Holographic 3D Cyber Core & RGB Matrix Rain (`index.html`)
- **Full-Screen 3D Command Deck:** Built on Three.js (r128) featuring a polyhedral geodesic core, tri-axial orbital gyroscope defense rings, and 7 interactive satellite drones representing each attack phase.
- **Full 360° Draggability:** Manipulate the hologram with mouse or touch controls using smooth inertial damping, scroll-to-zoom, and pan.
- **Red, Blue & Green Matrix Rain:** A custom HTML5 2D canvas cascading stream of digital glyphs across the background in high-contrast primary colors.
- **Instant Execution:** Clicking any satellite or vector pill immediately executes and navigates directly to the designated training phase without intrusive confirmation dialogs.

### 2. 🛡️ The 7-Stage Cyber Kill Chain Laboratories
Hands-on interactive terminals simulating authentic CLI execution, error handling, and output parsing without requiring local virtual machines:
1. **Reconnaissance & Footprinting (22+ Tools):** WHOIS, DNS reconnaissance, Google Dorking, harvester techniques.
2. **Network Scanning (15+ Tools):** Nmap SYN/UDP/ACK scans, Hping3 packet crafting, banner grabbing.
3. **Service Enumeration (8+ Tools):** SMB, NetBIOS, SNMP, and LDAP user/share discovery.
4. **Vulnerability Analysis (5+ Tools):** CVE indexing, CVSS severity metric calculations, automated auditing.
5. **System Exploitation (6+ Tools):** Password hash cracking, MSFvenom payloads, privilege escalation.
6. **Web Application Threats (6+ Tools):** OWASP Top 10, SQLi, XSS, SSRF, CSRF, and broken authentication.
7. **OSINT Intelligence (12+ Tools):** Geolocation analysis, username scraping, metadata extraction, breach correlation.

### 3. 📖 10-Chapter Master Guide ("Zero to Cyber")
Over 100 meticulously documented concepts divided into structured operational domains:
- **Rich Term Cards:** Severity tagging, visual threat meters, block-label definitions, and defense countermeasure lists.
- **Real-World Breaches & Analogies:** Translates complex technical exploits into accessible layman analogies and historical case studies (e.g., SolarWinds, Stuxnet, Capital One).
- **Secret Master Guide Gateway:** A hidden double-click portal bound to the PwnBox logo shield (`.logo-icon`) allows instant covert navigation into the master guide.

### 4. 📝 Master Test Examination Engine (`masterguide_test.html`)
- **Customizable Exam Parameters:** Select any chapter (Ch 1–10 or Full Exam), filter by difficulty (*Easy / Medium / Hard*), and choose question limits (*10 / 25 / All*).
- **Hinglish Feedback:** Provides bilingual, easy-to-understand post-answer explanations for all questions.
- **Score Analytics:** Visual score percentage bars, breakdown by question type/difficulty, review of missed questions, and persistent local examination history.

### 5. 🤖 Unified AI Doubt Mentor
- **Context-Aware Assistance:** Integrated Groq Cloud API chat assistant available directly within the laboratories and master guide chapters.
- **Bilingual Tutor:** Delivers concise, Hinglish/English answers tailored to beginners.
- **Centralized Security:** API configuration is maintained in a single secure configuration file (`js/config.js`), eliminating scattered hardcoded credentials.

### 6. 🏆 Gamified Agent Dossier & Clearance Tracking
- **3D Flipping ID Card:** Hover or click to flip the agent identity card, reveal personal clearance levels, and edit your codename alias.
- **Clearance Progression:** Earn tactical badges and rank up from *Apprentice* to *Specialist* up to *Elite Shadow Operator*.
- **Local Storage Persistence:** Progress, unlocked modules, custom-added tools, and test results are saved locally in the browser.

### 7. 📄 Tactical CEH Command Cheat Sheet
A quick-access sliding drawer containing categorized, battle-tested terminal syntax (Nmap, Gobuster, Nikto, Hydra, SQLMap, John the Ripper) with one-click clipboard copying.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | Semantic HTML5, CSS3 Variables, Vanilla JavaScript (ES6+ Modules) |
| **3D Graphics** | [Three.js (r128)](https://threejs.org/) + `OrbitControls` |
| **Audio** | HTML5 Web Audio API (Zero-latency procedural sound synthesizer) |
| **AI LLM Engine** | [Groq Cloud](https://groq.com/) Chat Completions (`openai/gpt-oss-20b`) |
| **Design System** | Brutalist Neo-Bauhaus (Bold borders, primary color accents, Space Mono typography) |
| **Data Storage** | Client-side `localStorage` & JSON question datasets |

---

## ⚡ Quickstart & Deployment

Because PwnBox Academy is built on pure web standards without external build dependencies or database overhead, it can be run instantly on any machine or web host:

### Option A: Direct File Execution
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Brave, Safari).

### Option B: Local HTTP Server
For optimal module loading and WebGL shader support:
```bash
# Using Python 3:
python -m http.server 8080

# Using Node.js:
npx serve .
```
Navigate to `http://localhost:8080` in your browser.

---

## 🔑 AI Mentor Configuration

To enable the AI Doubt Mentor, add your Groq API key in [`js/config.js`](file:///d:/CSE%20AI%20ML/CS/foot/js/config.js):

```javascript
// Replace with your own Groq key before deploying. Do not commit a real key to a public repository.
const GROQ_CONFIG = {
    apiKey: "YOUR_GROQ_API_KEY_HERE",
    model: "openai/gpt-oss-20b",
    endpoint: "https://api.groq.com/openai/v1/chat/completions"
};

export default GROQ_CONFIG;
```

---

## ⚠️ Tactical Legal & Ethical Notice

> **IMPORTANT DISCLAIMER**  
> This platform and all included materials are strictly intended for **educational, academic research, and authorized defensive training purposes only**.  
> Unauthorized scanning, reconnaissance, penetration testing, or exploitation of computer systems, networks, or applications without prior explicit written authorization from the system owner is illegal under international cyber law (including the Computer Fraud and Abuse Act and Indian IT Act 2000).  
> The creators assume no liability for misuse of the tools, techniques, or information provided within this project. **Always hack ethically and defend responsibly.**

---

## 🔒 Copyright & Intellectual Property

**Proprietary and Confidential.**  
Designed & Developed by **Pranav Pushya**.  
© 2026 Pranav Pushya. All Rights Reserved.
