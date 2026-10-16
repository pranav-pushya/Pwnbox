/**
 * Google Dorking & Search Recon Controller - PwnBox Academy
 * Implements interactive search, category filter, live dork builder, audio feedback, and clipboard copying.
 */

// Procedural Web Audio Sound Generator
function playDorkSound(type = 'click') {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'copy') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'launch') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.2);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    } catch (e) {
        // AudioContext not allowed without interaction
    }
}

// Show Toast Alert
function showDorkToast(msg) {
    const toast = document.getElementById('dorkToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._dorkToastTimer);
    window._dorkToastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Copy to Clipboard
function copyDork(text) {
    navigator.clipboard.writeText(text).then(() => {
        playDorkSound('copy');
        showDorkToast(`COPIED: "${text}"`);
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        playDorkSound('copy');
        showDorkToast(`COPIED: "${text}"`);
    });
}

// Launch Search on Google
function launchDork(dorkQuery) {
    playDorkSound('launch');
    const url = `https://www.google.com/search?q=${encodeURIComponent(dorkQuery)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

// Presets for Interactive Dork Builder
const DORK_PRESETS = [
    { label: "Confidential PDFs (site + filetype + text)", template: 'site:{TARGET} filetype:pdf intext:confidential' },
    { label: "Admin Login Portals (inurl + intitle)", template: 'site:{TARGET} inurl:admin intitle:login' },
    { label: "Budget & Financial Spreadsheets (XLS/XLSX)", template: 'site:{TARGET} (filetype:xls OR filetype:xlsx) intext:budget' },
    { label: "PHP Config Files with DB Passwords", template: 'site:{TARGET} inurl:config filetype:php intext:password' },
    { label: "Directory Listing with Backups (index of)", template: 'site:{TARGET} intitle:"index of" (backup OR old OR dump)' },
    { label: "Exposed API Keys in Text Files", template: 'site:{TARGET} intext:"api key" filetype:txt' },
    { label: "Hardcoded Passwords in TXT Files", template: 'site:{TARGET} intext:"password" filetype:txt' },
    { label: "Subdomains Recon (Excluding WWW)", template: 'site:{TARGET} -www' },
    { label: "SQL Injection Suspect Parameters (?id=)", template: 'site:{TARGET} inurl:php?id=' },
    { label: "LFI/RFI Suspect Parameters (?page=)", template: 'site:{TARGET} inurl:"?page="' },
    { label: "WordPress Admin Dashboard (No Logout)", template: 'site:{TARGET} -inurl:logout inurl:wp-admin' },
    { label: "WordPress Login Page (wp-login.php)", template: 'site:{TARGET} inurl:wp-login.php' },
    { label: "phpMyAdmin Database Management Panels", template: 'site:{TARGET} inurl:phpmyadmin' },
    { label: "Exposed Log Files (filetype:log)", template: 'site:{TARGET} filetype:log' },
    { label: "SQL Database Dumps (filetype:sql)", template: 'site:{TARGET} filetype:sql' },
    { label: "Document Audit (PDF or DOCX)", template: 'site:{TARGET} (filetype:pdf OR filetype:docx)' },
    { label: "Cached Webpage Version", template: 'cache:{TARGET}' },
    { label: "Related Corporate Infrastructure", template: 'related:{TARGET}' }
];

// Initialize Dork Builder
function initDorkBuilder() {
    const targetInput = document.getElementById('targetDomainInput');
    const presetSelect = document.getElementById('dorkPresetSelect');
    const outputCode = document.getElementById('builderOutputCode');
    const copyBtn = document.getElementById('builderCopyBtn');
    const launchBtn = document.getElementById('builderLaunchBtn');

    if (!targetInput || !presetSelect || !outputCode) return;

    // Populate Presets
    presetSelect.innerHTML = '';
    DORK_PRESETS.forEach((preset, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = preset.label;
        presetSelect.appendChild(opt);
    });

    function updateBuilderQuery() {
        const rawTarget = targetInput.value.trim() || 'example.com';
        const cleanTarget = rawTarget.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
        const selectedPreset = DORK_PRESETS[parseInt(presetSelect.value, 10)] || DORK_PRESETS[0];
        const query = selectedPreset.template.replace(/\{TARGET\}/g, cleanTarget);
        outputCode.textContent = query;
        return query;
    }

    targetInput.addEventListener('input', updateBuilderQuery);
    presetSelect.addEventListener('change', () => {
        playDorkSound('click');
        updateBuilderQuery();
    });

    copyBtn.addEventListener('click', () => {
        const q = updateBuilderQuery();
        copyDork(q);
    });

    launchBtn.addEventListener('click', () => {
        const q = updateBuilderQuery();
        launchDork(q);
    });

    // Initial run
    updateBuilderQuery();
}

// Load Dork into Builder
function loadIntoBuilder(syntax) {
    const targetInput = document.getElementById('targetDomainInput');
    const outputCode = document.getElementById('builderOutputCode');
    const cockpit = document.querySelector('.dork-builder-cockpit');

    if (cockpit) {
        cockpit.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (targetInput && outputCode) {
        let domain = targetInput.value.trim() || 'example.com';
        let populated = syntax.replace(/example\.com/g, domain);
        outputCode.textContent = populated;
        playDorkSound('click');
        showDorkToast(`LOADED INTO BUILDER: "${populated}"`);
    }
}

// Filter and Search Engine
function initFilterAndSearch() {
    const searchInput = document.getElementById('dorkSearchInput');
    const catPills = document.querySelectorAll('.cat-pill');
    const dorkCards = document.querySelectorAll('.dork-card');
    const sectionGroups = document.querySelectorAll('.dork-section-group');
    const countBadge = document.getElementById('visibleDorkCount');

    let currentCategory = 'all';
    let currentSearch = '';

    function applyFilters() {
        let visibleCount = 0;

        dorkCards.forEach(card => {
            const cardCat = card.getAttribute('data-cat') || '';
            const syntax = (card.querySelector('.dork-syntax-text')?.textContent || '').toLowerCase();
            const finds = (card.querySelector('.dork-what-finds')?.textContent || '').toLowerCase();
            const triage = (card.querySelector('.dork-hinglish-triage')?.textContent || '').toLowerCase();
            const tag = (card.querySelector('.dork-tag')?.textContent || '').toLowerCase();

            const matchesCategory = (currentCategory === 'all' || cardCat === currentCategory);
            const matchesSearch = !currentSearch || 
                syntax.includes(currentSearch) || 
                finds.includes(currentSearch) || 
                triage.includes(currentSearch) || 
                tag.includes(currentSearch);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Hide empty section groups
        sectionGroups.forEach(sec => {
            const secCat = sec.getAttribute('data-sec-cat') || '';
            if (currentCategory === 'best_practices') {
                if (secCat === 'best_practices') {
                    sec.style.display = 'block';
                } else {
                    sec.style.display = 'none';
                }
                return;
            }

            if (secCat === 'best_practices') {
                sec.style.display = (currentCategory === 'all') ? 'block' : 'none';
                return;
            }

            const visibleInSec = sec.querySelectorAll('.dork-card[style*="display: flex"]').length;
            if (visibleInSec > 0) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
        });

        if (countBadge) {
            countBadge.textContent = visibleCount;
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    catPills.forEach(pill => {
        pill.addEventListener('click', () => {
            playDorkSound('click');
            catPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.getAttribute('data-category');
            applyFilters();
        });
    });

    applyFilters();
}

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
    initDorkBuilder();
    initFilterAndSearch();
});
