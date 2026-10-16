# 🛡️ PWNBOX // CYBER COMMAND ACADEMY

### *Advanced Offensive & Defensive Cybersecurity Simulation Platform*

[![Platform](<https://img.shields.io/badge/Platform-Web%20Simulator-00f0ff?style=for-the-badge&logo=googlechrome&logoColor=white>)](https://github.com/)
[![Engine](<https://img.shields.io/badge/3D%20Engine-Three.js%20r128-005A9C?style=for-the-badge&logo=three.js&logoColor=white>)](https://threejs.org/)
[![AI Backend](<https://img.shields.io/badge/AI%20Mentor-Groq%20Cloud%20LLM-D9291C?style=for-the-badge&logo=fastapi&logoColor=white>)](https://groq.com/)
[![Design System](<https://img.shields.io/badge/Design-Brutalist%20Bauhaus-F2A900?style=for-the-badge&logo=artstation&logoColor=black>)](https://en.wikipedia.org/wiki/Bauhaus)
[![Architecture](<https://img.shields.io/badge/Architecture-Vanilla%20ES6%2B-10b981?style=for-the-badge&logo=javascript&logoColor=white>)](https://developer.mozilla.org/)

---

## ⚡ Executive Summary

**PwnBox Academy** is a high-performance, in-browser tactical cybersecurity training academy engineered to bridge theoretical knowledge and practical ethical hacking. Built upon a high-contrast **Neo-Bauhaus design system** paired with an **immersive 3D holographic command matrix**, the platform equips recruits, penetration testers, and defense analysts with interactive kill-chain laboratories, an encyclopedic 10-chapter master guide, a customizable MCQ examination engine, and an on-demand AI doubt assistant.

Designed & Developed by **Pranav Pushya**.

---

## 🏛️ System Architecture & File Structure

The project follows a clean, decoupled client-side architecture with zero external package manager overhead.

```text
foot/
├── dashboard.html               # Main Agent Training Dashboard & Progress Hub
├── index.html                   # Cyber Command Landing Page & 3D Matrix Gateway
├── games.html                   # Tactical Cyber Mini-Games & Arcade Operations Hub
├── notes.html                   # Operative Notes & Tactical Payload Vault
├── imp_info.html                # Important Info Direct Gateway Router (Redirects to imp_info/)
├── career_paths.html            # Career Paths Direct Gateway Router (Redirects to imp_info/)
├── ports.html                   # Critical Ports Direct Gateway Router (Redirects to imp_info/)
├── http_codes.html              # HTTP Status Codes Direct Gateway Router (Redirects to imp_info/)
├── general.html                 # General Cyber Intel Direct Gateway Router (Redirects to imp_info/)
├── 404.html                     # Tactical Sector 404 Bauhaus Error & Recovery Router
├── README.md                    # Project Documentation & Architecture
│
├── 📂 imp_info/                 # Field Intelligence & Important Info Suite (Unified 8-Button Nav)
│   ├── imp_info.html            # Important Info: 20-Domain Blueprint, Lab Sandboxing & Arsenal
│   ├── career_paths.html        # 6 Core Cybersecurity Career Specializations (Slide 1 Extended)
│   ├── ports.html               # 37 Critical Ports & Protocols Vault with Hinglish Explanations (Slide 2 Extended)
│   ├── http_codes.html          # Complete HTTP Status Codes Compendium across 5 Classes (Slide 3 Extended)
│   ├── general.html             # General Cyber Intel: Windows Shortcuts, Domain TLDs & 1969-2026 OS Chronicles
│   ├── google_dorking.html      # Google Dorking Intelligence & Search Operator Arsenal (Placeholder)
│   ├── hacker_engines_devices.html # Hacker Search Engines & Physical Hardware Devices (Placeholder)
│   └── linux.html               # Linux Terminal Mastery, Core Commands & Hardening (Placeholder)
│
├── 📂 games/                    # Standalone Interactive Cyber Mini-Game Simulations
│   ├── packet_gatekeeper.html   # Game 01: Firewall, Protocol & DPI Defense Arcade
│   ├── phish_detective.html     # Game 02: SOC Inbox Triage, SPF/DKIM & Malware Droppers
│   ├── sqli_locksmith.html      # Game 03: SQL Injection Vault Breaker & Parameterization
│   ├── cidr_block.html          # Game 04: VLSM Subnetting & Network Partitioning Puzzle
│   ├── privesc_tower.html       # Game 05: Linux Host Privilege Escalation & GTFOBins
│   ├── ransom_panic.html        # Game 06: DFIR CSIRT Outbreak & Kill Switch Sinkhole
│   ├── entropy_clash.html       # Game 07: Password Entropy & 100 GH/s Hashcat Tug-of-War
│   └── cipher_relic.html        # Game 08: Caesar, Vigenère & Symmetric XOR Stream Gates
│
├── 📂 assets/                   # Vector Brand Icons & Favicons
│   ├── favicon-main.svg         # Tactical shield dashboard favicon
│   └── favicon-guide.svg        # Encyclopedic master guide favicon
│
├── 📂 modules/                  # The 7-Stage Cyber Kill Chain Interactive Laboratories
│   ├── Footprinting.html        # Module 01: Passive & Active Reconnaissance (22+ Tools)
│   ├── Scanning.html            # Module 02: Network Probing & Host Discovery (15+ Tools)
│   ├── Enumeration.html         # Module 03: Service, Protocol & User Mining (8+ Tools)
│   ├── Vulnerablity.html        # Module 04: Vulnerability Assessment & CVSS Auditing (5+ Tools)
│   ├── SystemHacking.html       # Module 05: System Exploitation & Privilege Escalation (6+ Tools)
│   ├── WebAppThreats.html       # Module 06: OWASP Top 10 & Web Attack Vectors (6+ Tools)
│   └── OSINT.html               # Module 07: Open-Source Intelligence & Threat Intel (12+ Tools)
│
├── 📂 masterguide/              # Master Guide Knowledge Base & Certification Engine
│   ├── cybersecurity_masterguide.html  # Master Guide Central Hub
│   ├── masterguide_ch1.html – ch10.html # 10 Deep-Dive Chapters (100+ Documented Terms)
│   ├── masterguide_test.html           # Comprehensive MCQ Examination Engine
│   ├── roadmap.html                    # 9-Month Interactive CEH & Ethical Hacking Career Roadmap
│   ├── imp_info.html                   # Compatibility Shim (Redirects to ../imp_info/imp_info.html)
│   ├── career_paths.html               # Compatibility Shim (Redirects to ../imp_info/career_paths.html)
│   ├── ports.html                      # Compatibility Shim (Redirects to ../imp_info/ports.html)
│   ├── http_codes.html                 # Compatibility Shim (Redirects to ../imp_info/http_codes.html)
│   └── general.html                    # Compatibility Shim (Redirects to ../imp_info/general.html)
│
├── 📂 css/                      # Modular Bauhaus Design System & Themes
│   ├── landing.css              # Landing page layout & 3D HUD canvas styling
│   ├── 404.css                  # Custom Bauhaus Cyber Command 404 cockpit styling
│   ├── index.css                # Dashboard styling, 3D ID cards, cheat drawer
│   ├── roadmap.css              # Career roadmap layout, progress cockpit & animations
│   ├── imp_info.css             # Field compendium styling, tabbed views & arsenal cards
│   ├── career_paths.css         # Career paths visual matrix & specialization deck
│   ├── ports.css                # Ports matrix styling, transport badges & copy controls
│   ├── http_codes.css           # HTTP status code taxonomy & triage card styles
│   ├── general.css              # General compendium, timeline, and GPU draggable dialog modals
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
│   ├── roadmap.js               # Interactive roadmap controller, local storage & Web Audio SFX
│   ├── masterguide_test.js      # Quiz exam controller, scoring & local history
│   ├── masterguide_chat.js      # On-demand AI doubt chat handler (Hinglish/English)
│   ├── theme.js                 # Global instant dark/light mode toggle
│   └── [Module].js              # Per-module terminal simulators & interactive labs
│
├── 📂 quiz-data/                # Examination Question Banks & Unified Bundle
    ├── masterguide_quiz_ch1.json – ch10.json  # Chapter-specific structured MCQs
    ├── masterguide_quiz_all.json              # Aggregated 100+ master exam dataset
    └── quiz_data.js                           # Browser & Node isomorphic quiz bundle
```

---

## 🚀 Key Functional Capabilities

### 1. 🌐 Holographic 3D Cyber Core & Interactive Operations Deck (`index.html`)

- **Full-Screen 3D Command Deck:** Built on Three.js (r128) featuring a polyhedral geodesic core, tri-axial orbital gyroscope defense rings, and 7 interactive satellite drones representing each attack phase.
- **Full 360° Draggability:** Manipulate the hologram with mouse or touch controls using smooth inertial damping, scroll-to-zoom, and pan.
- **Red, Blue & Green Matrix Rain:** A custom HTML5 2D canvas cascading stream of digital glyphs across the background in high-contrast primary colors.
- **Pranav Pushya Official Signature Stamp:** A tactile military-classified red ink rubber stamp featuring mechanical chunk/thud Web Audio synthesis and ink splatter physics.
- **"Breach the Mainframe" Mini-Game:** A reflex-based 5-second rapid decryption trial challenging operators to decode target memory ciphers against a live ticking clock.
- **Real-Time Global Threat Radar:** A continuous 360° sweeping radar array with real-time simulated attack telemetry and an interactive EMP countermeasure blast.
- **Agent Dossier & ID Badge Workshop:** In-browser tactical badge customizer enabling recruits to set callsigns and avatars, authenticated with the architect's seal and synced to the dashboard.
- **Interactive Terminal Feedback:** Advanced keyboard listeners and tactile Web Audio feedback embedded across interactive command consoles.

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

### 4. 📝 Master Test Examination Engine (`masterguide_test.html`)

- **Customizable Exam Parameters:** Select any chapter (Ch 1–10 or Full Exam), filter by difficulty (*Easy / Medium / Hard*), and choose question limits (*10 / 25 / All*).
- **Hinglish Feedback:** Provides bilingual, easy-to-understand post-answer explanations for all questions.
- **Score Analytics:** Visual score percentage bars, breakdown by question type/difficulty, review of missed questions, and persistent local examination history.

### 5. 🤖 Unified AI Doubt Mentor

- **Context-Aware Assistance:** Integrated Groq Cloud API chat assistant available directly within the laboratories and master guide chapters.
- **Bilingual Tutor:** Delivers concise, Hinglish/English answers tailored to beginners.
- **Centralized Security:** API configuration is maintained in a single secure configuration file (`js/config.js`), eliminating scattered hardcoded credentials.

### 6. ⌨️ Universal Keyboard Command Palette & Quick Navigation

- **Universal Shortcuts Modal (`Ctrl + /`):** Instant-access command palette featuring fuzzy search across all academy hotkeys and modules.
- **Single-Letter Shortcuts:** Navigate anywhere with zero latency:
  - `D` &rarr; Tactical Dashboard
  - `H` &rarr; Home Portal
  - `T` &rarr; Instant Dark / Light Theme Toggle
  - `N` &rarr; Operative Notes & Payloads
  - `M` &rarr; Master Guide
  - `R` &rarr; Career Roadmap
  - `I` &rarr; Important Info & Tool Matrix
  - `C` &rarr; CEH Command Cheat Sheet Drawer *(Dashboard Only)*
  - `S` &rarr; Mission Settings & Security Modal
- **Universal Popup Scroll Isolation:** Background website scroll is automatically locked whenever cursor is hovering over any popup or modal dialog, completely eliminating scroll-chaining leaks.

### 7. ⚙️ Dedicated Mission Settings & Account Security Modal

A standalone cyberpunk control deck accessible from the `⚙️` navbar icon or pressing `S` / `s`:

- **Password Management:** 1-click dispatch of secure password reset links to registered operative emails.
- **Linked OAuth Providers:** Connect and disconnect Google Matrix and GitHub Developer accounts.
- **Profile Customization:** Modify agent alias/callsign and update primary email credentials.
- **Leaderboard Privacy:** Toggle between **Public Operative Profile** and **Stealth / Anonymous Mode** to mask telemetry from public leaderboards.
- **Permanent Account Termination:** Irreversible danger zone to purge Firebase accounts, credentials, and curriculum progress.

### 8. 📝 Operative Notes Vault (`notes.html`)

- **In-Stream Code Blocks:** Seamlessly embed syntax-highlighted code blocks directly into operative study notes.
- **Firebase Cloud Synchronization:** Synchronize notes across devices when logged into Google or email credentials.
- **Instant Search & Categorization:** Filter notes by tag, search by payload keyword, and export records locally.

### 9. 📄 Tactical CEH Command Cheat Sheet

A quick-access sliding drawer containing categorized, battle-tested terminal syntax (Nmap, Gobuster, Nikto, Hydra, SQLMap, John the Ripper) with one-click clipboard copying, summoned with `C` or `c` on the dashboard.

### 10. 🗺️ 9-Month Ethical Hacking & CEH Career Roadmap (`masterguide/roadmap.html`)

- **4-Phase Interactive Overview Grid:** Clean Bauhaus cards summarizing Phase 1 (Foundation), Phase 2 (Learn to Hack), Phase 3 (CEH Exam Sprint), and Phase 4 (Career Launch & Mastery).
- **Deep-Dive Milestone Drilldown:** Clicking any phase opens granular weekly milestones, practical labs, and resource hubs.
- **Interactive Checklist with Audio & Confetti:** Progress tracking saved to `localStorage`, live percentage cockpit, procedural Web Audio blip feedback, and celebratory confetti bursts.
- **Instant Phase Switcher:** Filter tabs to switch between phases without clutter.

### 11. 💡 Field Intelligence & CEH Blueprint Compendium (`imp_info/imp_info.html`)

- **Uncluttered Tabbed Navigation:** 6 segmented modules (*Disciplines & Skills, 5 Phases & Arsenal, Virtual Attack Lab, CEH Exam Blueprint, Careers & Myths, AI Multiplier*).
- **Tactical Arsenal Cards:** Interactive tool cards replacing cluttered tables with category filters and 1-click syntax clipboard copying.
- **Live Search CEH Exam Blueprint:** 20 exam domains organized into 4 weightage clusters with instant keyword filtering.
- **Virtual Lab Sandbox Architecture:** Isolated multi-VM topology (Kali, Metasploitable, OWASP Juice Shop, Windows Eval) with Host-Only and NAT network rules.

### 12. 🧭 Cybersecurity Career Specializations (`imp_info/career_paths.html`)

- **6 Professional Tracks:** In-depth profiles for Security Operations Center (SOC) / Blue Team, Offensive Penetration Testing / Red Team, Cloud Security Architecture, Governance, Risk & Compliance (GRC), Application Security (AppSec), and Digital Forensics & Incident Response (DFIR).
- **Competency Matrix & Certifications:** Outlines required skill trees, prerequisite tooling, and industry-standard credential roadmaps (CompTIA Security+, CEH, OSCP, CISSP, AWS Security Specialty).
- **Tactical Salary & Operational Day-in-the-Life:** Provides realistic compensation ranges, daily workflow walkthroughs, and high-impact interview preparation criteria.

### 13. 🔌 Critical Ports & Protocols Vault (`imp_info/ports.html`)

- **37 Essential Network Ports (TCP/UDP):** Spans fundamental internet infrastructure (DNS 53, DHCP 67/68, NTP 123), cleartext legacy protocols (FTP 21, Telnet 23, HTTP 80), secure encrypted alternatives (SSH 22, HTTPS 443, FTPS 989/990), enterprise directory services (Kerberos 88, LDAP 389, Active Directory SMB 445), and administrative remoting (RDP 3389, VNC 5900).
- **Hinglish Operational Triage:** Every port features concise 2-3 line Hinglish explanations breaking down security triage, packet headers, and common attack vectors in simple intuitive language.
- **1-Click Copy & Transport Protocol Badges:** Instant syntax copying and transport classification (TCP, UDP, TCP/UDP) for streamlined terminal workflows.

### 14. 🌐 HTTP Status Codes Compendium (`imp_info/http_codes.html`)

- **Complete 5-Class Taxonomy:** Thorough breakdown of 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, and 5xx Server Error responses.
- **Hinglish Web Security Analysis:** Practical explanations of how web servers respond during penetration tests and automated directory fuzzing (e.g., distinguishing 401 Unauthorized vs 403 Forbidden, 301 Permanent vs 302 Temporary redirects, and 500 Internal Error SQL injection leaks).
- **Bug Bounty & Exploitation Notes:** Highlights actionable attacker methodologies, header inspection tactics, and developer remediation countermeasures.

### 15. 🪟 General Cyber Intelligence Compendium (`imp_info/general.html`)

- **Windows Security Shortcuts & Administrative Run Commands:** 25 essential hotkeys, Control Panel applets (`.cpl`), and Microsoft Management Consoles (`.msc`) for incident triage and hardening, featuring a **Custom Shortcut Creator** with `localStorage` persistence.
- **Global Top-Level Domains (TLDs) & DNS Reconnaissance:** 25 TLD categories (gTLD, ccTLD, sTLD, New gTLD, and Restricted/High-Risk TLDs like `.onion`, `.internal`, `.zip`, `.mov`), featuring a **Custom TLD Creator** with `localStorage` persistence.
- **Chronological Operating Systems Timeline (1969 UNIX to 2026 AI-Native Zero-Trust):** 22 milestones documenting OS security architecture from Unix permissions and BSD sockets to 2026 Hardware Memory Tagging Extensions (MTE), kernel Rust integration, and Post-Quantum Cryptography (PQC).
- **Ultra-Smooth Hardware-Accelerated Draggable Modals:** Form dialogs feature GPU-accelerated `translate3d(x, y, 0)` movement, `requestAnimationFrame` 60fps/120fps synchronization, non-blocking transparent backgrounds, and unrestricted full-screen draggability.

### 16. 🔎 Google Dorking Intelligence (`imp_info/google_dorking.html`)

- Advanced Google hacking database (GHDB) operators, passive footprinting syntax, and targeted filetype/index query matrices.

### 17. 📡 Hacker Search Engines & Physical Hardware Devices (`imp_info/hacker_engines_devices.html`)

- Specialized reconnaissance engines (Shodan, Censys, ZoomEye, FOFA) and tactical hardware devices (Flipper Zero, Hak5 WiFi Pineapple, Rubber Ducky, Proxmark3).

### 18. 🐧 Linux Terminal Mastery & Hardening (`imp_info/linux.html`)

- Essential command-line workflows, file system hierarchy, permissions/ACLs, process management, and core administrative hardening.



**Clandestine Gateways Hint:** Classified Easter egg gateways are concealed throughout the academy command structure. In particular, recruits whisper of an elite secret gateway that unlocks exclusive **VIP Cyber Themes**, accessible only via a mysterious **triple-click**...(triple click also works to unlock other secret gateways!!)

---

## 🛠️ Technology Stack

| Layer                   | Technologies                                                                       |
| :---------------------- | :--------------------------------------------------------------------------------- |
| **Frontend Core** | Semantic HTML5, CSS3 Variables, Vanilla JavaScript (ES6+ Modules)                  |
| **3D Graphics**   | [Three.js (r128)](https://threejs.org/) + `OrbitControls`                         |
| **Audio**         | HTML5 Web Audio API (Zero-latency procedural sound synthesizer)                    |
| **AI LLM Engine** | [Groq Cloud](https://groq.com/) Chat Completions (`openai/gpt-oss-20b`)           |
| **Design System** | Brutalist Neo-Bauhaus (Bold borders, primary color accents, Space Mono typography) |
| **Data Storage**  | Client-side `localStorage` & JSON question datasets                              |

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

To enable the AI Doubt Mentor, add your Groq API key in [`js/config.js`](<file:///d:/CSE%20AI%20ML/CS/foot/js/config.js>):

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
