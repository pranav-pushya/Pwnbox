# 🛡️ PWNBOX // CYBER COMMAND ACADEMY

### *Advanced Offensive & Defensive Cybersecurity Simulation Platform*

[![Platform](<https://img.shields.io/badge/Platform-Web%20Simulator-00f0ff?style=for-the-badge&logo=googlechrome&logoColor=white>)](https://github.com/)
[![Engine](<https://img.shields.io/badge/3D%20Engine-Three.js%20r128-005A9C?style=for-the-badge&logo=three.js&logoColor=white>)](https://threejs.org/)
[![AI Backend](<https://img.shields.io/badge/AI%20Mentor-Groq%20Cloud%20LLM-D9291C?style=for-the-badge&logo=fastapi&logoColor=white>)](https://groq.com/)
[![Design System](<https://img.shields.io/badge/Design-Brutalist%20Bauhaus-F2A900?style=for-the-badge&logo=artstation&logoColor=black>)](https://en.wikipedia.org/wiki/Bauhaus)
[![Architecture](<https://img.shields.io/badge/Architecture-Vanilla%20ES6%2B-10b981?style=for-the-badge&logo=javascript&logoColor=white>)](https://developer.mozilla.org/)

---

## ⚡ Executive Summary

**PwnBox Academy** is a high-performance, in-browser tactical cybersecurity training academy engineered to bridge theoretical knowledge and practical ethical hacking. Built upon a high-contrast **Neo-Bauhaus design system** paired with an **immersive 3D holographic command matrix**, the platform equips recruits, penetration testers, and defense analysts with 8 interactive kill-chain and black ops laboratories, an encyclopedic 10-chapter master guide with single-chapter accordion navigation, 8 standalone tactical cyber mini-games, 10 physical hardware hacking engines with 3D rotatable models, an edge-to-edge interactive Linux mind map, a customizable MCQ examination engine, universal theme-aware scrollbars, and an on-demand AI doubt assistant.

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
├── 404.html                     # Tactical Sector 404 Bauhaus Error & Recovery Router
├── README.md                    # Project Documentation & Architecture
│
├── 📂 imp_info/                 # Field Intelligence & Important Info Suite
│   ├── imp_info.html            # Important Info: 20-Domain Blueprint, Lab Sandboxing & Arsenal
│   ├── career_paths.html        # 6 Core Cybersecurity Career Specializations
│   ├── ports.html               # 37 Critical Ports & Protocols Vault with Hinglish Explanations
│   ├── http_codes.html          # Complete HTTP Status Codes Compendium across 5 Classes
│   ├── general.html             # General Cyber Intel: Windows Shortcuts, Domain TLDs & 1969-2026 OS Chronicles
│   ├── google_dorking.html      # Google Dorking Intelligence, GHDB Operators & Interactive Builder
│   ├── hacker_engines_devices.html # Top 10 Physical Hacking Devices (3D Models) & 32 Specialized Search Engines
│   └── linux.html               # Linux Terminal Mastery, Core Commands & Slide 13 Interactive Mind Map
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
├── 📂 assets/                   # Vector Brand Icons, Favicons & Hardware Renders
│   ├── favicon-main.svg         # Tactical shield dashboard favicon
│   ├── favicon-guide.svg        # Encyclopedic master guide favicon
│   └── devices/                 # Photorealistic hardware device renders for 3D inspection
│
├── 📂 modules/                  # The 8-Stage Cyber Kill Chain & Black Ops Laboratories
│   ├── Footprinting.html        # Module 01: Passive & Active Reconnaissance (22+ Tools)
│   ├── Scanning.html            # Module 02: Network Probing & Host Discovery (15+ Tools)
│   ├── Enumeration.html         # Module 03: Service, Protocol & User Mining (8+ Tools)
│   ├── Vulnerablity.html        # Module 04: Vulnerability Assessment & CVSS Auditing (5+ Tools)
│   ├── SystemHacking.html       # Module 05: System Exploitation & Privilege Escalation (6+ Tools)
│   ├── WebAppThreats.html       # Module 06: OWASP Top 10 & Web Attack Vectors (6+ Tools)
│   ├── OSINT.html               # Module 07: Open-Source Intelligence & Threat Intel (12+ Tools)
│   └── BlackOps.html            # Module 08: Black Ops, C2 Beacons & EDR Evasion (8+ Tools)
│
├── 📂 masterguide/              # Master Guide Knowledge Base & Certification Engine
│   ├── cybersecurity_masterguide.html  # Master Guide Central Hub (Single-Chapter Accordion & Pagination)
│   ├── masterguide_ch1.html – ch10.html # 10 Deep-Dive Chapters (100+ Documented Terms)
│   ├── masterguide_test.html           # Comprehensive MCQ Examination Engine
│   └── roadmap.html                    # 9-Month Interactive CEH & Ethical Hacking Career Roadmap
│
├── 📂 css/                      # Modular Bauhaus Design System & Themes
│   ├── style.css                # Global Theme-Aware Scrollbar Engine & Universal Utilities
│   ├── landing.css              # Landing page layout & 3D HUD canvas styling
│   ├── 404.css                  # Custom Bauhaus Cyber Command 404 cockpit styling
│   ├── index.css                # Dashboard styling, 3D ID cards, cheat drawer
│   ├── roadmap.css              # Career roadmap layout, progress cockpit & animations
│   ├── imp_info.css             # Field compendium styling, tabbed views & arsenal cards
│   ├── career_paths.css         # Career paths visual matrix & specialization deck
│   ├── ports.css                # Ports matrix styling, transport badges & copy controls
│   ├── http_codes.css           # HTTP status code taxonomy & triage card styles
│   ├── general.css              # General compendium, timeline, and GPU draggable dialog modals
│   ├── linux_mindmap.css        # Slide 13 Linux Mind Map & Edge-to-Edge Fullscreen HUD Styles
│   ├── cybersecurity_masterguide.css # Single-Chapter Accordion Navigation & Pagination Layout
│   ├── masterguide_test.css     # Examination engine layout & score analytics
│   ├── masterguide_chat.css     # AI doubt sidebar & chat message styling
│   ├── resizer.css              # Split-pane draggable laboratory panes
│   └── [Module].css             # Per-module dedicated cyber terminal stylesheets
│
├── 📂 js/                       # Core Logic, 3D Shaders & AI Integration
│   ├── config.js                # Centralized Groq API configuration & shared keys
│   ├── landing_3d.js            # Three.js 3D Quantum Holographic Core & OrbitControls (8 Active Vectors)
│   ├── matrix_rain.js           # Fullscreen Red/Blue/Green cascading digital rain
│   ├── OrbitControls.js         # Camera manipulation & 360° inertia drag controls
│   ├── three.min.js             # Bundled Three.js (r128) WebGL engine (offline-ready)
│   ├── index.js                 # Dashboard progression, stats sync, agent ID card
│   ├── roadmap.js               # Interactive roadmap controller, local storage & Web Audio SFX
│   ├── linux_mindmap.js         # Slide 13 Interactive Mind Map Engine & Fullscreen Sync Controller
│   ├── cybersecurity_masterguide.js # Single-Chapter Navigation, Search & Dynamic Pagination Engine
│   ├── masterguide_test.js      # Quiz exam controller, scoring & local history
│   ├── masterguide_chat.js      # On-demand AI doubt chat handler (Hinglish/English)
│   ├── theme.js                 # Global instant 5-theme controller (Light/Dark/Matrix/Cyberpunk/Synthwave)
│   └── [Module].js              # Per-module terminal simulators & interactive labs
│
├── 📂 quiz-data/                # Examination Question Banks & Unified Bundle
│   ├── masterguide_quiz_ch1.json – ch10.json  # Chapter-specific structured MCQs
│   ├── masterguide_quiz_all.json              # Aggregated 100+ master exam dataset
│   └── quiz_data.js                           # Browser & Node isomorphic quiz bundle
```

---

## 🚀 Key Functional Capabilities

### 1. 🌐 Holographic 3D Cyber Core & Interactive Operations Deck (`index.html`)

- **Full-Screen 3D Command Deck:** Built on Three.js (r128) featuring a polyhedral geodesic core, tri-axial orbital gyroscope defense rings, and 8 interactive satellite drones representing each attack and defense vector (M-01 to M-08).
- **Full 360° Draggability:** Manipulate the hologram with mouse or touch controls using smooth inertial damping, scroll-to-zoom, and pan.
- **Red, Blue & Green Matrix Rain:** A custom HTML5 2D canvas cascading stream of digital glyphs across the background in high-contrast primary colors.
- **Pranav Pushya Official Signature Stamp:** A tactile military-classified red ink rubber stamp featuring mechanical chunk/thud Web Audio synthesis and ink splatter physics.
- **"Breach the Mainframe" Mini-Game:** A reflex-based 5-second rapid decryption trial challenging operators to decode target memory ciphers against a live ticking clock.
- **Real-Time Global Threat Radar:** A continuous 360° sweeping radar array with real-time simulated attack telemetry and an interactive EMP countermeasure blast.
- **Agent Dossier & ID Badge Workshop:** In-browser tactical badge customizer enabling recruits to set callsigns and avatars, authenticated with the architect's seal and synced to the dashboard.
- **Interactive Terminal Feedback:** Advanced keyboard listeners and tactile Web Audio feedback embedded across interactive command consoles.

### 2. 🛡️ The 8-Stage Cyber Kill Chain & Black Ops Laboratories

Hands-on interactive terminals simulating authentic CLI execution, error handling, and output parsing without requiring local virtual machines:

1. **Reconnaissance & Footprinting (22+ Tools):** WHOIS, DNS reconnaissance, Google Dorking, harvester techniques.
2. **Network Scanning (15+ Tools):** Nmap SYN/UDP/ACK scans, Hping3 packet crafting, banner grabbing.
3. **Service Enumeration (8+ Tools):** SMB, NetBIOS, SNMP, and LDAP user/share discovery.
4. **Vulnerability Analysis (5+ Tools):** CVE indexing, CVSS severity metric calculations, automated auditing.
5. **System Exploitation (6+ Tools):** Password hash cracking, MSFvenom payloads, privilege escalation.
6. **Web Application Threats (6+ Tools):** OWASP Top 10, SQLi, XSS, SSRF, CSRF, and broken authentication.
7. **OSINT Intelligence (12+ Tools):** Geolocation analysis, username scraping, metadata extraction, breach correlation.
8. **Black Ops & C2 Evasion (8+ Tools):** Command & Control (C2) beaconing, Cobalt Strike / Sliver simulation, EDR evasion, API unhooking, AMSI bypasses, process hollowing, and in-memory execution.

### 3. 📖 10-Chapter Master Guide ("Zero to Cyber") (`masterguide/cybersecurity_masterguide.html`)

An encyclopedic knowledge base covering 100+ meticulously documented concepts, delivered through an intuitive **Single-Chapter-at-a-Time Architecture**:

- **Single Chapter Viewport:** Rather than overwhelming operatives with all 10 chapters simultaneously, PwnBox isolates the active chapter in the viewport, ensuring fast render times, distraction-free reading, and focused mastery.
- **Dynamic Accordion Sidebar Navigation:** Collapsible operational clusters (Foundations, Defensive Security, Offensive Kill Chain, Modern Operations) allow instant switching between chapters with live active state indicators.
- **Responsive Chapter Pagination:** Dedicated `← Previous Chapter` and `Next Chapter →` bottom navigation docks with automatic end-of-guide routing to the Examination Engine.
- **Live Reading Progress Engine:** Pin-point progress indicator tracking operative reading depth through the active chapter in real time.
- **Instant Search & Topic Filter:** High-speed fuzzy search bar in the sidebar that instantly locates terms, attacks, and protocols across all 10 chapters.
- **Rich Term Cards & Threat Meters:** Block-label definitions, severity metrics (Low to Critical), visual CVSS meters, and defense countermeasures.
- **Real-World Breaches & Analogies:** Translates complex technical exploits into accessible layman analogies and historical case studies (e.g., SolarWinds, Stuxnet, Capital One, WannaCry).

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

### 17. 📡 Hacker Search Engines & 10 Physical Hardware Devices (`imp_info/hacker_engines_devices.html`)

- **32 Specialized Reconnaissance Engines:** Categorized index across IoT scanners (Shodan, Censys, ZoomEye, FOFA), attack surface monitors, threat intelligence platforms, and dark web indexes.
- **Top 10 Physical Hardware Hacking Devices with Interactive 3D Model Inspection:**
  1. **Hak5 WiFi Pineapple:** Dual-band wireless pentesting platform with automated rogue AP, evil twin attacks, PineAP suite, and real-time deauthentication tracking.
  2. **Flipper Zero:** Portable multi-tool for Sub-GHz transceiver analysis, RFID/NFC sniffing and emulation, infrared remote control, BadUSB keystroke injection, and iButton keys.
  3. **Hak5 USB Rubber Ducky:** Keystroke injection HID device powered by DuckyScript 3.0, featuring flow control, payload triggers, and fast keystroke delivery.
  4. **Hak5 Bash Bunny:** Multi-vector USB attack platform emulating Gigabit Ethernet, serial console, and mass storage with an intuitive 3-position attack payload switch.
  5. **Hak5 LAN Turtle:** Covert network implant disguised as a USB Ethernet adapter, executing automated man-in-the-middle (MITM) attacks and covert remote SSH tunneling.
  6. **O.MG Cable:** Covert implant stealthily integrated inside a standard braided USB cable, equipped with embedded Wi-Fi C2, live payload execution, and self-destruct security wiping.
  7. **Hak5 Packet Squirrel:** Pocket-sized Ethernet packet tap providing stealthy inline packet capture, remote OpenVPN tunneling, and automated network payload execution.
  8. **Proxmark3 RDV4:** The premier RFID/NFC research instrument capable of sniffing, reading, cloning, and emulating both low-frequency (125 kHz) and high-frequency (13.56 MHz) transponders.
  9. **Kali NetHunter:** Mobile penetration testing platform running on Android, enabling 802.11 wireless frame injection, BadUSB, and HID keyboard attack delivery on the move.
  10. **Evil Portal:** Modular captive portal credential harvesting framework operating in tandem with rogue wireless access points to harvest user credentials and tokens.
- **Interactive 3D Hardware Model Viewport:** Operatives can inspect each physical device inside an interactive 3D model modal, featuring smooth 360° mouse/touch rotation, zoom, tilt, and tactical HUD wireframe telemetry.

### 18. 🐧 Linux Terminal Mastery & Slide 13 Interactive Mind Map (`imp_info/linux.html`)

- **Core Administrative Hardening:** Essential CLI workflows, Linux filesystem hierarchy, permissions/ACLs, process management, and firewall hardening.
- **Slide 13 Linux Interactive Mind Map Architecture:**
  - A comprehensive interactive visual knowledge graph organized around the central Tux Linux core, structuring command-line mastery across 6 operational branches:
    1. **Basic Operations:** File and directory navigation (`pwd`, `ls`, `cd`, `cat`, `touch`, `cp`, `mv`, `rm`, `echo`).
    2. **System Management:** Hardware and process monitoring (`top`, `htop`, `ps`, `kill`, `systemctl`, `journalctl`, `df`, `free`, `uname`).
    3. **Networking:** Socket and interface triage (`ip`, `ifconfig`, `ping`, `traceroute`, `netstat`, `ss`, `curl`, `wget`, `ssh`).
    4. **Security & Permissions:** Access control and firewalls (`chmod`, `chown`, `chgrp`, `sudo`, `passwd`, `ufw`, `iptables`, `fail2ban`).
    5. **Storage & Filesystem:** Partitioning and archive management (`mount`, `umount`, `fdisk`, `mkfs`, `lsblk`, `tar`, `gzip`, `rsync`).
    6. **Advanced Administration & Automation:** Text stream processing and scheduling (`cron`, `crontab`, `find`, `grep`, `awk`, `sed`, `xargs`, `bash scripts`).
- **Edge-to-Edge Fullscreen Inspection Mode:** Clickable fullscreen mode expanding the mind map to cover the entire screen with an unobstructed viewport, floating HUD controls, centered Tux emblem, top-right red cross close button (`✕`), and instantaneous `Escape` key synchronization.

### 19. 🎮 Tactical Cyber Mini-Games & Arcade Operations Hub (`games.html` & `games/`)

An interactive gamified cyber warfare suite comprising 8 standalone operational simulators:

1. **Packet Gatekeeper (`games/packet_gatekeeper.html`):** Real-time firewall rule-setting, port filtering, and Deep Packet Inspection (DPI) arcade defending subnets against incoming malicious packet floods.
2. **Phish Detective (`games/phish_detective.html`):** SOC inbox triage simulator training analysts to detect spoofed headers, SPF/DKIM verification failures, credential-harvesting links, and macro droppers.
3. **SQLi Locksmith (`games/sqli_locksmith.html`):** Interactive SQL query injection puzzle demonstrating `OR 1=1` auth bypasses, `UNION SELECT` column matching, and parameterized query remediation.
4. **CIDR Block (`games/cidr_block.html`):** Visual VLSM network subnetting game testing calculations of prefix lengths (`/24` to `/30`), network IDs, broadcast addresses, and usable host ranges.
5. **PrivEsc Tower (`games/privesc_tower.html`):** Linux host privilege escalation challenge navigating misconfigured SUID binaries, root cron tasks, sudo privileges, and GTFOBins exploits.
6. **Ransom Panic (`games/ransom_panic.html`):** High-tempo incident response simulation requiring operatives to isolate infected hosts, sever lateral movement conduits, and deploy sinkholes against C2 domains.
7. **Entropy Clash (`games/entropy_clash.html`):** Dynamic tug-of-war password security simulator pitting character set entropy against simulated 100 GH/s GPU hashcat cracking rigs.
8. **Cipher Relic (`games/cipher_relic.html`):** Cryptographic decryption trial requiring operatives to break Caesar rotation ciphers, Vigenère keyword matrices, and symmetric XOR stream ciphers.

### 20. 🎨 Universal Theme-Aware Scrollbar & Responsive Layout Engine

- **Universal Dynamic Scrollbars:** A dedicated scrollbar engine implemented in `css/style.css` using theme variables (`--scrollbar-track`, `--scrollbar-thumb`, `--scrollbar-thumb-hover`, `--scrollbar-border`).
- **5-Theme Adaptability:** Automatically synchronizes scrollbar coloration with the active theme (Light Neo-Bauhaus, Dark Cyber Command, Phosphor Matrix 1999, Night City Cyberpunk, and Synthwave '84).
- **Zero-Glitch Viewport Geometry:** Fully resolves empty white strips and padding overflow issues across scaled and high-DPI displays.

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
