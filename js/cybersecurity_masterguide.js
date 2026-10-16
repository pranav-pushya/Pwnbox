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
  const chapterEl = document.getElementById(chapterId);
  if (!chapterEl) return;

  currentActiveChapterId = chapterId;

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
  const quizBtn = document.querySelector('button[onclick*="masterguide_test.html"]');
  if (quizBtn) {
    quizBtn.setAttribute('onclick', `window.location.href='masterguide_test.html?chapter=${chNum}'`);
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

    window.addEventListener('hashchange', () => {
      const target = resolveInitialTarget();
      showChapter(target.chapterId, target.termId, true);
    });
  } else {
    // Single chapter page (masterguide_chX.html)
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