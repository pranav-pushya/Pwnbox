
// ==========================================
// TACTICAL AUDIO BRIEFINGS ENGINE (WEB SPEECH API)
// ==========================================
const AUDIO_BRIEFINGS = {
  1: "Chapter 1: Core Threats and Attack Types. In this tactical briefing, we examine the primary offensive vectors targeting modern digital systems: Phishing and spear-phishing campaigns, Distributed Denial of Service volumetric and application-layer floods, Man-in-the-Middle network eavesdropping, SQL Injection attacks extracting database secrets, Cross-Site Scripting weaponizing client browsers, Zero-Day exploits targeting undisclosed vulnerabilities, Ransomware encrypting enterprise storage, and Credential Stuffing brute-force pipelines. Master these foundational threat models to build effective perimeter defenses.",
  2: "Chapter 2: Malware Types and Payloads. This tactical briefing covers malicious software architectures: Polymorphic viruses, self-propagating worms, remote access trojans or RATs, stealth rootkits operating at ring zero, spyware exfiltrating confidential telemetry, ransomware encryption workflows, keyloggers capturing sensitive keystrokes, and fileless memory-resident payloads designed to evade static antivirus detection. Understanding executable analysis and living-off-the-land techniques is essential for modern triage.",
  3: "Chapter 3: Defensive Architecture and Security Tools. An operative overview of defense-in-depth principles: Next-generation firewalls, Intrusion Detection and Prevention Systems, Security Information and Event Management SIEM log correlation, Endpoint Detection and Response EDR agents, Web Application Firewalls, demilitarized zones DMZ, and automated honeypots designed to divert and profile active intruders.",
  4: "Chapter 4: Cryptography and Encryption. In this tactical session, we analyze mathematical privacy and integrity: Symmetric AES-256 ciphers, asymmetric RSA and Elliptic Curve public key cryptography, cryptographic hashing algorithms including SHA-256 and bcrypt, Digital Signatures verifying authenticity, Public Key Infrastructure PKI, Transport Layer Security TLS 1.3, and post-quantum cryptographic primitives.",
  5: "Chapter 5: Identity, Access Management and Zero Trust Architecture. This briefing breaks down access control: Principle of Least Privilege, Role-Based and Attribute-Based Access Control, Multi-Factor Authentication with FIDO2 hardware keys, Single Sign-On via SAML and OAuth 2.0, Privileged Access Management PAM, and the Zero Trust operational philosophy: Never Trust, Always Verify.",
  6: "Chapter 6: Network and Cloud Security. Exploring perimeter and distributed computing defense: Subnetting and Virtual Local Area Networks, Virtual Private Networks with IPsec and WireGuard, Domain Name System Security Extensions DNSSEC, Cloud Shared Responsibility Models across AWS, Azure, and Google Cloud, Cloud Security Posture Management CSPM, Containerization security with Docker, and Kubernetes orchestration hardening.",
  7: "Chapter 7: Advanced Threats and Social Engineering. Tactical profiling of state-sponsored actors and human vulnerability: Advanced Persistent Threats APTs executing multi-stage kill chains, Supply Chain breaches compromising third-party vendors, Business Email Compromise BEC spear-phishing, Pretexting and Vishing voice social engineering, Physical security bypasses, and insider threat behavioral detection.",
  8: "Chapter 8: Governance, Risk, Compliance and Digital Forensics. The operational framework for institutional security: NIST Cybersecurity Framework, ISO 27001 standard certification, SOC 2 compliance trust criteria, General Data Protection Regulation GDPR mandates, Threat Modeling with STRIDE, Risk Assessment formulas, and Chain of Custody protocols for forensic evidence collection.",
  9: "Chapter 9: Security Operations and Incident Response. Inside the Security Operations Center: 24/7 SIEM alert monitoring and triage, Incident Response lifecycle across Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned, Threat Hunting hypothesis generation, MITRE ATT&CK framework mapping, and automated Security Orchestration SOAR playbooks.",
  10: "Chapter 10: Emerging Frontiers and AI Security. Strategic defense against next-generation paradigms: Artificial Intelligence and Large Language Model security, prompt injection vulnerabilities, training data poisoning, Internet of Things IoT firmware security, Operational Technology OT and SCADA industrial protocols, and Post-Quantum cryptographic migration."
};

const PwnAudioBriefing = {
  currentCh: null,
  state: 'idle', // 'idle' | 'playing' | 'paused'
  speed: 1.0,
  activeUtterance: null,

  getBriefingText: function(chNum) {
    return AUDIO_BRIEFINGS[chNum] || AUDIO_BRIEFINGS[1];
  },

  getState: function() {
    return {
      currentCh: this.currentCh,
      state: this.state,
      speed: this.speed
    };
  },

  togglePlay: function(chNum) {
    chNum = parseInt(chNum, 10) || 1;
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (typeof window.showCustomAlert === 'function') {
        window.showCustomAlert("AUDIO UNAVAILABLE", "Web Speech API is not supported in this browser environment.", "error");
      } else {
        alert("Web Speech API is not supported in this browser.");
      }
      return;
    }

    const synth = window.speechSynthesis;

    // 1. If currently playing this chapter -> Pause
    if (this.currentCh === chNum && this.state === 'playing') {
      synth.pause();
      this.state = 'paused';
      this.updateUI(chNum);
      return;
    }

    // 2. If currently paused on this chapter -> Resume
    if (this.currentCh === chNum && this.state === 'paused') {
      synth.resume();
      this.state = 'playing';
      this.updateUI(chNum);
      return;
    }

    // 3. Otherwise start playback for this chapter
    synth.cancel();
    const text = this.getBriefingText(chNum);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.speed;
    utterance.pitch = 1.0;

    // Pick English voice if available
    const voices = synth.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('English')));
    if (enVoice) utterance.voice = enVoice;

    this.currentCh = chNum;
    this.state = 'playing';
    this.activeUtterance = utterance;

    utterance.onstart = () => {
      this.state = 'playing';
      this.updateUI(chNum);
    };

    utterance.onpause = () => {
      this.state = 'paused';
      this.updateUI(chNum);
    };

    utterance.onresume = () => {
      this.state = 'playing';
      this.updateUI(chNum);
    };

    utterance.onend = () => {
      this.state = 'idle';
      this.currentCh = null;
      this.activeUtterance = null;
      this.updateUI(chNum);
    };

    utterance.onerror = () => {
      this.state = 'idle';
      this.currentCh = null;
      this.activeUtterance = null;
      this.updateUI(chNum);
    };

    synth.speak(utterance);
    this.updateUI(chNum);
  },

  cycleSpeed: function(chNum) {
    chNum = parseInt(chNum, 10) || 1;
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(this.speed) + 1) % speeds.length;
    this.speed = speeds[nextIdx];

    // If currently speaking, restart with new speed
    if (this.currentCh === chNum && (this.state === 'playing' || this.state === 'paused')) {
      const wasPaused = this.state === 'paused';
      this.togglePlay(chNum); // stops
      this.togglePlay(chNum); // restarts at new rate
      if (wasPaused) {
        window.speechSynthesis.pause();
        this.state = 'paused';
      }
    }
    this.updateUI(chNum);
  },

  stop: function() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    const prevCh = this.currentCh;
    this.state = 'idle';
    this.currentCh = null;
    this.activeUtterance = null;
    if (prevCh) this.updateUI(prevCh);
  },

  updateUI: function(chNum) {
    document.querySelectorAll('.audio-briefing-bar').forEach(bar => {
      const barCh = parseInt(bar.getAttribute('data-ch-num'), 10);
      const isTarget = barCh === chNum;
      const playBtn = bar.querySelector('.btn-audio-play');
      const speedBtn = bar.querySelector('.btn-audio-speed');
      const statusPill = bar.querySelector('.audio-status-pill');

      if (speedBtn) speedBtn.textContent = `${this.speed.toFixed(1)}x`;

      if (isTarget && this.state === 'playing') {
        if (playBtn) {
          playBtn.className = 'btn-audio-play playing';
          playBtn.innerHTML = '<span>⏸️</span><span>PAUSE BRIEFING</span>';
        }
        if (statusPill) {
          statusPill.className = 'audio-status-pill playing';
          statusPill.textContent = 'PLAYING';
        }
      } else if (isTarget && this.state === 'paused') {
        if (playBtn) {
          playBtn.className = 'btn-audio-play paused';
          playBtn.innerHTML = '<span>▶️</span><span>RESUME BRIEFING</span>';
        }
        if (statusPill) {
          statusPill.className = 'audio-status-pill';
          statusPill.textContent = 'PAUSED';
        }
      } else {
        if (playBtn) {
          playBtn.className = 'btn-audio-play';
          playBtn.innerHTML = '<span>🔊</span><span>TACTICAL AUDIO BRIEFING</span>';
        }
        if (statusPill) {
          statusPill.className = 'audio-status-pill';
          statusPill.textContent = 'READY';
        }
      }
    });
  },

  injectAudioBars: function() {
    for (let i = 1; i <= 10; i++) {
      const chEl = document.getElementById(`ch${i}`);
      if (!chEl) continue;
      const titleBlock = chEl.querySelector('.chapter-title-block');
      if (!titleBlock || chEl.querySelector('.audio-briefing-bar')) continue;

      const bar = document.createElement('div');
      bar.className = 'audio-briefing-bar';
      bar.setAttribute('data-ch-num', i);
      bar.innerHTML = `
        <button type="button" class="btn-audio-play" onclick="PwnAudioBriefing.togglePlay(${i})" title="Listen to Chapter ${i} Tactical Audio Briefing">
          <span>🔊</span><span>TACTICAL AUDIO BRIEFING</span>
        </button>
        <button type="button" class="btn-audio-speed" onclick="PwnAudioBriefing.cycleSpeed(${i})" title="Playback Speed">${this.speed.toFixed(1)}x</button>
        <span class="audio-status-pill">READY</span>
      `;
      titleBlock.appendChild(bar);
    }
  }
};

if (typeof window !== 'undefined') {
  window.PwnAudioBriefing = PwnAudioBriefing;
  window.AUDIO_BRIEFINGS = AUDIO_BRIEFINGS;
}

/**
 * CYBERSECURITY MASTER GUIDE - SINGLE CHAPTER ENGINE
 * Controls single-chapter-at-a-time display, sidebar chapter accordion,
 * direct term navigation, search filtering, and chapter pagination.
 */

const CHAPTER_METADATA = [
  { id: 'ch1', num: 1, title: '01. Core Threats & Attacks', icon: '⚔️' },
  { id: 'ch2', num: 2, title: '02. Malware Types & Payloads', icon: '🦠' },
  { id: 'ch3', num: 3, title: '03. Defensive Architecture & Tools', icon: '🛡️' },
  { id: 'ch4', num: 4, title: '04. Cryptography & Encryption', icon: '🔐' },
  { id: 'ch5', num: 5, title: '05. Identity, Access & Zero Trust', icon: '🔑' },
  { id: 'ch6', num: 6, title: '06. Network & Cloud Defense', icon: '🌐' },
  { id: 'ch7', num: 7, title: '07. Advanced Persistent Threats & Social Eng', icon: '⚡' },
  { id: 'ch8', num: 8, title: '08. Governance, Risk & Forensics', icon: '⚖️' },
  { id: 'ch9', num: 9, title: '09. Security Operations (SecOps) & IR', icon: '🚨' },
  { id: 'ch10', num: 10, title: '10. Emerging Frontiers & AI Security', icon: '🤖' }
];

let currentActiveChapterId = 'ch1';

// Toggle card expansion
function toggle(header) {
  const card = header.parentElement;
  card.classList.toggle('open');
}

// Resolve initial chapter & term from query params or URL hash
function resolveInitialTarget() {
  const params = new URLSearchParams(window.location.search);
  const chParam = params.get('chapter') || params.get('ch');
  if (chParam) {
    const chNum = parseInt(chParam, 10);
    if (chNum >= 1 && chNum <= 10) return { chapterId: `ch${chNum}`, termId: null };
  }

  const hash = window.location.hash.replace('#', '').trim();
  if (hash) {
    if (/^ch([1-9]|10)$/i.test(hash)) {
      return { chapterId: hash.toLowerCase(), termId: null };
    }
    const targetCard = document.getElementById(hash);
    if (targetCard) {
      const parentChapter = targetCard.closest('.chapter');
      if (parentChapter) {
        return { chapterId: parentChapter.id, termId: hash };
      }
    }
  }

  return { chapterId: 'ch1', termId: null };
}

// Show a single chapter at a time
function showChapter(chapterId, termId = null, smoothScroll = true) {

  // Stop audio briefing when switching chapters
  if (typeof PwnAudioBriefing !== 'undefined') {
    PwnAudioBriefing.stop();
    PwnAudioBriefing.injectAudioBars();
  }

  const chapterEl = document.getElementById(chapterId);
  if (!chapterEl) return;

  currentActiveChapterId = chapterId;
  if (window.innerWidth <= 768 && typeof window.toggleMobileSidebar === 'function') {
    window.toggleMobileSidebar(false);
  }

  // 1. Hide all chapters, display only target chapter
  document.querySelectorAll('.chapter').forEach(ch => {
    if (ch.id === chapterId) {
      ch.classList.add('active-chapter');
      ch.style.display = 'block';
    } else {
      ch.classList.remove('active-chapter');
      ch.style.display = 'none';
    }
  });

  // 2. Update sidebar accordion groups
  document.querySelectorAll('.nav-chapter-group').forEach(group => {
    const isCurrent = group.getAttribute('data-ch') === chapterId;
    group.classList.toggle('expanded', isCurrent);
    const catHeader = group.querySelector('.nav-cat');
    if (catHeader) catHeader.classList.toggle('active-cat', isCurrent);
  });

  // 3. Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  if (termId) {
    const activeLink = document.querySelector(`.nav-link[href="#${termId}"]`);
    if (activeLink) activeLink.classList.add('active');
  }

  // 4. Update chapter bottom pagination bar
  updateChapterPagination(chapterId);

  // 5. Update header Master Quiz button to target current chapter
  const chNum = parseInt(chapterId.replace('ch', ''), 10) || 1;
  const quizBtn = document.querySelector('a.btn-quiz, button[onclick*="masterguide_test.html"]');
  if (quizBtn) {
    if (quizBtn.tagName.toLowerCase() === 'a') {
      quizBtn.setAttribute('href', `masterguide_test.html?chapter=${chNum}`);
    } else {
      quizBtn.setAttribute('onclick', `window.location.href='masterguide_test.html?chapter=${chNum}'`);
    }
  }

  // 6. Update URL hash cleanly
  if (window.history && window.history.replaceState) {
    const newHash = '#' + (termId || chapterId);
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }

  // 7. Scroll handling
  if (termId) {
    const termCard = document.getElementById(termId);
    if (termCard) {
      termCard.classList.add('open');
      termCard.classList.add('target-highlight');
      setTimeout(() => termCard.classList.remove('target-highlight'), 1500);

      const navOffset = 90;
      const cardRect = termCard.getBoundingClientRect();
      const scrollY = window.pageYOffset + cardRect.top - navOffset;
      window.scrollTo({ top: scrollY, behavior: smoothScroll ? 'smooth' : 'auto' });
      return;
    }
  }

  // Scroll to top of main chapter area if switching chapter directly
  if (smoothScroll) {
    const layout = document.querySelector('.layout');
    const scrollTarget = layout ? layout.offsetTop - 20 : 0;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  }
}
window.showChapter = showChapter;

// Chapter bottom pagination bar
function updateChapterPagination(chapterId) {
  let navBar = document.getElementById('chapterPaginationBar');
  if (!navBar) {
    navBar = document.createElement('div');
    navBar.id = 'chapterPaginationBar';
    navBar.className = 'chapter-nav-bar';
    const main = document.querySelector('.main');
    if (main) {
      const footer = main.querySelector('div[style*="border-top"]');
      if (footer) main.insertBefore(navBar, footer);
      else main.appendChild(navBar);
    }
  }

  const chNum = parseInt(chapterId.replace('ch', ''), 10) || 1;
  const prevChapter = CHAPTER_METADATA.find(c => c.num === chNum - 1);
  const nextChapter = CHAPTER_METADATA.find(c => c.num === chNum + 1);

  const prevBtnHtml = prevChapter
    ? `<button class="chapter-nav-btn prev" onclick="showChapter('${prevChapter.id}')" title="Go to ${prevChapter.title}">⬅️ Previous: ${prevChapter.title}</button>`
    : `<button class="chapter-nav-btn prev" disabled>⬅️ First Chapter</button>`;

  const nextBtnHtml = nextChapter
    ? `<button class="chapter-nav-btn next" onclick="showChapter('${nextChapter.id}')" title="Go to ${nextChapter.title}">Next: ${nextChapter.title} ➡️</button>`
    : `<button class="chapter-nav-btn next" onclick="window.location.href='masterguide_test.html'" style="background:var(--accent-blue,#3b82f6);color:#fff;" title="Test Your Knowledge in the Final Master Quiz">Take Master Quiz 🏆 ➡️</button>`;

  navBar.innerHTML = `
    ${prevBtnHtml}
    <div class="chapter-indicator">Chapter ${chNum} of 10</div>
    ${nextBtnHtml}
  `;
}

// Search and filter terms
function filterNav(query) {
  const q = query.toLowerCase().trim();

  if (!q) {
    // Restore normal view
    document.querySelectorAll('.nav-chapter-group').forEach(group => {
      const isCurrent = group.getAttribute('data-ch') === currentActiveChapterId;
      group.classList.toggle('expanded', isCurrent);
      group.style.display = 'block';
      group.querySelectorAll('.nav-link').forEach(link => { link.style.display = ''; });
    });
    document.querySelectorAll('.term-card').forEach(card => { card.style.display = ''; });
    return;
  }

  // Expand all groups to display matches
  document.querySelectorAll('.nav-chapter-group').forEach(group => {
    let groupMatchCount = 0;
    group.querySelectorAll('.nav-link').forEach(link => {
      const text = link.textContent.toLowerCase();
      const match = text.includes(q);
      link.style.display = match ? 'block' : 'none';
      if (match) groupMatchCount++;
    });

    group.style.display = groupMatchCount > 0 ? 'block' : 'none';
    group.classList.toggle('expanded', groupMatchCount > 0);
  });

  // Filter term cards in active chapter
  document.querySelectorAll('.term-card').forEach(card => {
    const name = card.querySelector('.term-name')?.textContent.toLowerCase() || '';
    const tagline = card.querySelector('.term-tagline')?.textContent.toLowerCase() || '';
    const match = name.includes(q) || tagline.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) card.classList.add('open');
  });
}
window.filterNav = filterNav;

// Setup sidebar click listeners
function setupSidebarListeners() {
  // Category headers (.nav-cat)
  document.querySelectorAll('.nav-cat').forEach(cat => {
    cat.addEventListener('click', (e) => {
      e.preventDefault();
      const chId = cat.getAttribute('data-ch') || cat.closest('.nav-chapter-group')?.getAttribute('data-ch');
      if (chId) {
        showChapter(chId, null, true);
      }
    });
  });

  // Term links (.nav-link)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const termId = href.substring(1);
        const targetCard = document.getElementById(termId);
        if (targetCard) {
          const parentChapter = targetCard.closest('.chapter');
          const chId = parentChapter ? parentChapter.id : currentActiveChapterId;
          showChapter(chId, termId, true);
        }
      }
    });
  });
}

// DOMContentLoaded Initialization
document.addEventListener('DOMContentLoaded', () => {
  const chapters = document.querySelectorAll('.chapter');

  if (chapters.length > 1) {
    // Multi-chapter container (cybersecurity_masterguide.html)
    setupSidebarListeners();
    const initialTarget = resolveInitialTarget();
    showChapter(initialTarget.chapterId, initialTarget.termId, false);
    if (typeof PwnAudioBriefing !== 'undefined') PwnAudioBriefing.injectAudioBars();

    window.addEventListener('hashchange', () => {
      const target = resolveInitialTarget();
      showChapter(target.chapterId, target.termId, true);
    });
  } else {
    // Single chapter page (masterguide_chX.html)
    const singleChapter = document.querySelector('.chapter');
    if (singleChapter) {
      singleChapter.classList.add('active-chapter');
      singleChapter.style.display = 'block';
    }
    document.querySelectorAll('.term-card').forEach((card, i) => {
      if (i === 0) card.classList.add('open');
    });
  }

  // Scroll tracking for back to top button
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('backTop');
    if (btn) btn.classList.toggle('show', window.scrollY > 400);
  });
});

// Mobile Sidebar Toggle
function toggleMobileSidebar(open) {
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  const shouldOpen = (typeof open === 'boolean') ? open : !sidebar.classList.contains('mobile-open');
  sidebar.classList.toggle('mobile-open', shouldOpen);
  if (backdrop) backdrop.classList.toggle('active', shouldOpen);

  if (shouldOpen) {
    document.body.style.overflow = 'hidden';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) setTimeout(() => searchInput.focus(), 250);
  } else {
    document.body.style.overflow = '';
  }
}
window.toggleMobileSidebar = toggleMobileSidebar;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    toggleMobileSidebar(false);
  }
});
