/**
 * Master Guide Bilingual Localization Engine (English & Hinglish)
 * 
 * Provides localized English translations for terms originally explained in
 * Hinglish, allowing users to toggle between colloquial Hinglish and 
 * formal technical English with persistent localStorage preferences.
 */

const MASTERGUIDE_TRANSLATIONS_EN = {
    // ── CHAPTER 1: CORE THREATS ──────────────────────────────────────────
    "malware": {
        tagline: "Malicious Software — Digital Toxin",
        what: "Malware = Malicious + Software. Any executable code or script deliberately designed to compromise, damage, exfiltrate data from, or hijack control of an operating system.",
        types: "Virus, Worm, Trojan, Ransomware, Spyware, Adware, Rootkit, and Keylogger are all specialized classifications of malware explored in Chapter 2.",
        analogy: "Malware functions like biological pathology: common viruses (flu), slow-decay spyware (jaundice), or self-spreading network worms (cholera). Each presents distinct vectors, yet all inflict systemic damage.",
        real: "<strong>WannaCry (2017):</strong> Propagated across 150 countries via an unpatched Windows SMBv1 vulnerability (EternalBlue), paralyzing UK NHS hospitals, FedEx, and global telecom networks with over $4 billion in damages.",
        defense: [
            "Maintain continuously updated endpoint antivirus definitions",
            "Apply security patches and OS kernel updates immediately upon release",
            "Enforce strict email hygiene and disable macro executions on unknown files",
            "Maintain immutable, air-gapped offline backups (3-2-1 backup rule)"
        ]
    },
    "phishing": {
        tagline: "Social Engineering Lure — Harvesting User Credentials",
        what: "An adversary fabricates a deceptive email, website, or message impersonating trusted entities (banks, corporate IT, Google, AWS) to deceive victims into submitting confidential credentials.",
        types: "<strong>Spear Phishing:</strong> Highly targeted attacks addressing the victim by name.<br/><strong>Whaling:</strong> Targeting C-suite executives.<br/><strong>Smishing:</strong> SMS-delivered vectors.<br/><strong>Vishing:</strong> Voice/phone social engineering.",
        real: "<strong>Google & Facebook Vendor Scam (2013-2015):</strong> Attacker Evaldas Rimasauskas forged corporate invoices impersonating hardware manufacturer Quanta Computer, tricking tech giants into wiring over $100M+.",
        defense: [
            "Meticulously inspect sender email headers and SPF/DKIM/DMARC alignment",
            "Hover over links to verify destination domains before clicking",
            "Treat artificial urgency or financial panic as a primary indicator of compromise",
            "Enforce hardware security keys (FIDO2 / WebAuthn) for Multi-Factor Authentication"
        ]
    },
    "ransomware": {
        tagline: "Extortion Cryptography — Holding Data Hostage",
        what: "Malicious payload that traverses local drives and network shares, encrypting high-value documents with military-grade asymmetric ciphers and demanding cryptocurrency ransoms for the decryption keys.",
        types: "<strong>Crypto-Ransomware:</strong> Silently encrypts files.<br/><strong>Locker-Ransomware:</strong> Locks the entire operating system GUI.<br/><strong>Double Extortion:</strong> Exfiltrates sensitive databases to extortion leak sites before encryption.",
        analogy: "An intruder breaks into your archives, places every ledger into an unbreakable titanium safe, changes the combination, and demands a ransom note for the passcode.",
        real: "<strong>Colonial Pipeline (2021):</strong> DarkSide ransomware infiltrated a single legacy VPN account lacking MFA, shutting down the primary US East Coast fuel corridor for 5 days.",
        defense: [
            "Maintain automated, immutable 3-2-1 offline cloud backups",
            "Segment operational technology (OT) from corporate IT networks",
            "Deploy endpoint detection and response (EDR) to intercept mass file-rename hooks",
            "Never pay ransom demands; payment finances criminal infrastructure without recovery guarantee"
        ]
    },
    "botnet": {
        tagline: "Zombie Army — Distributed Computing Under C2 Control",
        what: "A network of compromised IoT devices, servers, and endpoints secretly infected by malware and orchestrated concurrently via a centralized Command and Control (C2) server.",
        types: "<strong>Centralized C2:</strong> Single IRC or HTTP server directing bots.<br/><strong>P2P Botnet:</strong> Decentralized peer-to-peer command routing resilience against takedowns.",
        analogy: "Hypnotizing hundreds of thousands of people across the globe without their knowledge, and suddenly commanding them in unison to charge through a single building's doorway.",
        real: "<strong>Mirai Botnet (2016):</strong> Scanned the IPv4 internet for IoT webcams and routers running default factory credentials (admin:admin), enslaving 600,000+ devices to take down DNS provider Dyn.",
        defense: [
            "Change all factory default administrative passwords on network devices immediately",
            "Disable remote UPnP and Telnet/SSH management interfaces exposed to WAN",
            "Isolate smart IoT appliances onto an independent guest VLAN"
        ]
    },
    "ddos": {
        tagline: "Distributed Denial of Service — Saturating Target Capacity",
        what: "Coordinated flood of synthetic network traffic, volumetric UDP floods, or Layer 7 HTTP requests overwhelming server bandwidth and CPU resources until legitimate users are denied access.",
        types: "<strong>Volumetric Attacks:</strong> UDP/ICMP amplification floods.<br/><strong>Protocol Attacks:</strong> SYN floods and fragmented packet storms.<br/><strong>Application Layer (L7):</strong> HTTP GET/POST floods targeting complex DB queries.",
        analogy: "Ordering 10,000 prank pizzas to a single shop counter simultaneously, preventing paying customers from reaching the register.",
        real: "<strong>GitHub DDoS Attack (2018):</strong> GitHub was targeted with a 1.35 Tbps Memcached amplification attack, reflecting UDP requests with an amplification factor of 51,000x.",
        defense: [
            "Deploy reverse-proxy scrubbing networks (Cloudflare, AWS Shield, Akamai)",
            "Enforce IP rate limiting and CAPTCHA challenges during sudden traffic spikes",
            "Configure upstream BGP Anycast routing and SYN cookie kernel mitigations"
        ]
    },
    "mitm": {
        tagline: "Man-In-The-Middle — Eavesdropping & Tampering in Transit",
        what: "An attacker intercepts and alters communications between two trusting parties (e.g. client and bank) without either party suspecting the intermediary eavesdropper.",
        types: "<strong>ARP Spoofing:</strong> Poisoning local switch MAC tables.<br/><strong>DNS Spoofing:</strong> Redirecting legitimate domain queries to malicious web servers.<br/><strong>Evil Twin AP:</strong> Rogues Wi-Fi access points broadcasting identical SSIDs.",
        analogy: "A rogue postal courier unsealing letters in secret, photocopying bank drafts, editing account numbers, and resealing the envelopes unnoticed.",
        real: "<strong>DigiNotar Breach (2011):</strong> Iranian state actors compromised the Dutch Certificate Authority DigiNotar, issuing rogue SSL certificates for *.google.com to conduct mass MitM surveillance.",
        defense: [
            "Enforce strict end-to-end encryption with modern TLS 1.3",
            "Enable HTTP Strict Transport Security (HSTS) with preloading",
            "Verify SSL certificate fingerprints and never dismiss untrusted certificate browser alerts",
            "Use encrypted DNS protocols (DoH / DoT) and Dynamic ARP Inspection (DAI)"
        ]
    },
    "sqli": {
        tagline: "SQL Injection — Manipulating Backend Databases",
        what: "Vulnerability occurring when untrusted user input is directly concatenated into dynamic database queries, permitting attackers to bypass authentication or extract entire databases.",
        types: "<strong>In-band SQLi:</strong> Error-based and UNION-based extraction.<br/><strong>Blind SQLi:</strong> Boolean and time-delayed inference when errors are suppressed.<br/><strong>Out-of-band:</strong> Exfiltrating records via DNS/HTTP outbound requests.",
        analogy: "Asking a bank teller to transfer money to user 'John OR 1=1', causing the automated ledger to execute an unintended clause that discharges every customer balance.",
        real: "<strong>Heartland Payment Systems (2008):</strong> Albert Gonzalez exploited SQL injection to breach card processing infrastructure, exfiltrating 130 million credit card numbers.",
        defense: [
            "Always utilize Parameterized Queries (Prepared Statements) with bound variables",
            "Enforce Object-Relational Mapping (ORM) frameworks with input validation",
            "Apply the principle of least privilege to database service accounts",
            "Deploy Web Application Firewalls (WAF) to detect common SQL injection signatures"
        ]
    },
    "xss": {
        tagline: "Cross-Site Scripting — Injecting Client-Side Payloads",
        what: "Security flaw allowing malicious actors to inject arbitrary client-side JavaScript into web applications visited by unsuspecting victims, hijacking active session cookies and tokens.",
        types: "<strong>Stored XSS:</strong> Persistent script saved directly into database comments/posts.<br/><strong>Reflected XSS:</strong> Non-persistent payload reflected back in search queries/URLs.<br/><strong>DOM-based:</strong> Client-side JS code dynamically sinks untrusted inputs without sanitization.",
        real: "<strong>Samy Worm (2005):</strong> Exploited stored XSS on MySpace to force visiting users to add Samy as a friend, infecting over 1 million users in under 20 hours.",
        defense: [
            "Contextually encode and escape all untrusted user output before rendering to HTML",
            "Configure strict Content Security Policy (CSP) directives eliminating 'unsafe-inline'",
            "Designate session cookies with the HttpOnly and Secure flags to block JavaScript access"
        ]
    },
    "csrf": {
        tagline: "Cross-Site Request Forgery — Tricking Authenticated Sessions",
        what: "Attacker tricks a victim's authenticated browser into executing unwanted actions on an application where the user is already logged in (e.g., transferring funds or resetting passwords).",
        types: "<strong>GET-based CSRF:</strong> Forged embedded image tags (`<img src='/api/transfer?amount=1000'>`).<br/><strong>POST-based CSRF:</strong> Auto-submitting hidden HTML forms hosted on malicious external sites.",
        analogy: "An imposter handing your stamped and signed corporate bank authorization form to a bank teller while you are sitting in the lobby.",
        real: "<strong>Netflix CSRF Vulnerability:</strong> Attackers crafted malicious pages that automatically triggered Netflix account profile modifications when visiting subscribers viewed the page.",
        defense: [
            "Enforce unique, cryptographically random Anti-CSRF tokens for all state-changing requests",
            "Configure cookie attributes with `SameSite=Strict` or `SameSite=Lax`",
            "Re-authenticate users or require password confirmation prior to critical actions"
        ]
    },
    "zeroday": {
        tagline: "Zero-Day Vulnerability — Undisclosed Flaws with Zero Days to Patch",
        what: "A security vulnerability known to attackers or researchers before the software vendor has discovered it or released a remediation patch, giving defenders 'zero days' of protection.",
        types: "<strong>0-Day Vulnerability:</strong> Unpatched security flaw.<br/><strong>0-Day Exploit:</strong> Functional exploit code actively weaponizing the unpatched flaw.<br/><strong>0-Day Attack:</strong> Real-world malicious exploitation campaigns.",
        analogy: "A secret tunnel into a bank vault unknown even to the architects who drew the blueprints, exploited by thieves before security guards realize it exists.",
        real: "<strong>Log4Shell (CVE-2021-44228):</strong> A critical zero-day in Apache Log4j's JNDI lookup functionality enabled unauthenticated remote code execution across millions of enterprise servers.",
        defense: [
            "Deploy Web Application Firewalls (WAF) with behavioral anomaly detection",
            "Implement Defense-in-Depth and zero-trust microsegmentation",
            "Monitor Threat Intelligence feeds and CISA Known Exploited Vulnerabilities (KEV)",
            "Employ memory-safe programming languages and kernel-level endpoint detection (EDR)"
        ]
    }
};

let currentMgLang = localStorage.getItem('pwnbox_mg_lang') || 'hinglish';

/**
 * Switch Master Guide explanation language between Hinglish and English.
 */
function toggleMasterguideLang() {
    const nextLang = currentMgLang === 'hinglish' ? 'en' : 'hinglish';
    setMasterguideLang(nextLang);
}

/**
 * Apply the selected language to the DOM.
 * @param {'hinglish'|'en'} lang
 */
function setMasterguideLang(lang) {
    currentMgLang = lang;
    localStorage.setItem('pwnbox_mg_lang', lang);

    // Update toggle button text
    const labelEl = document.getElementById('mgLangLabel');
    if (labelEl) {
        labelEl.textContent = lang === 'en' ? 'HINGLISH' : 'EN';
    }

    // Apply translations across all rendered term cards
    Object.keys(MASTERGUIDE_TRANSLATIONS_EN).forEach(termId => {
        const card = document.getElementById(termId);
        if (!card) return;

        const trans = MASTERGUIDE_TRANSLATIONS_EN[termId];

        // 1. Tagline
        const taglineEl = card.querySelector('.term-tagline');
        if (taglineEl) {
            if (!taglineEl.hasAttribute('data-orig-hinglish')) {
                taglineEl.setAttribute('data-orig-hinglish', taglineEl.innerHTML);
            }
            taglineEl.innerHTML = (lang === 'en' && trans.tagline) ? trans.tagline : taglineEl.getAttribute('data-orig-hinglish');
        }

        // 2. Definition & Types (Content grid blocks)
        const blocks = card.querySelectorAll('.content-grid .block');
        if (blocks.length >= 1 && trans.what) {
            const p = blocks[0].querySelector('p');
            if (p) {
                if (!p.hasAttribute('data-orig-hinglish')) p.setAttribute('data-orig-hinglish', p.innerHTML);
                p.innerHTML = (lang === 'en') ? trans.what : p.getAttribute('data-orig-hinglish');
            }
        }
        if (blocks.length >= 2 && trans.types) {
            const p = blocks[1].querySelector('p');
            if (p) {
                if (!p.hasAttribute('data-orig-hinglish')) p.setAttribute('data-orig-hinglish', p.innerHTML);
                p.innerHTML = (lang === 'en') ? trans.types : p.getAttribute('data-orig-hinglish');
            }
        }

        // 3. Analogy
        const analogyP = card.querySelector('.analogy-box p');
        if (analogyP && trans.analogy) {
            if (!analogyP.hasAttribute('data-orig-hinglish')) analogyP.setAttribute('data-orig-hinglish', analogyP.innerHTML);
            analogyP.innerHTML = (lang === 'en') ? trans.analogy : analogyP.getAttribute('data-orig-hinglish');
        }

        // 4. Real World
        const realP = card.querySelector('.real-example p');
        if (realP && trans.real) {
            if (!realP.hasAttribute('data-orig-hinglish')) realP.setAttribute('data-orig-hinglish', realP.innerHTML);
            realP.innerHTML = (lang === 'en') ? trans.real : realP.getAttribute('data-orig-hinglish');
        }

        // 5. Defense list
        const defenseUl = card.querySelector('.defense-box ul');
        if (defenseUl && trans.defense && Array.isArray(trans.defense)) {
            if (!defenseUl.hasAttribute('data-orig-hinglish')) defenseUl.setAttribute('data-orig-hinglish', defenseUl.innerHTML);
            if (lang === 'en') {
                defenseUl.innerHTML = trans.defense.map(item => `<li>${item}</li>`).join('');
            } else {
                defenseUl.innerHTML = defenseUl.getAttribute('data-orig-hinglish');
            }
        }
    });

    if (window.showCyberToast) {
        window.showCyberToast(`Language switched to ${lang === 'en' ? 'Standard English' : 'Colloquial Hinglish'}!`, 2000);
    }
}

// Global browser exposures
if (typeof window !== 'undefined') {
    window.toggleMasterguideLang = toggleMasterguideLang;
    window.setMasterguideLang = setMasterguideLang;

    document.addEventListener('DOMContentLoaded', () => {
        if (currentMgLang === 'en') {
            setMasterguideLang('en');
        }
    });
}
