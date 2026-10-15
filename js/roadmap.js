/**
 * PWNBOX CYBER COMMAND - INTERACTIVE ROADMAP CONTROLLER & ANIMATIONS
 * Features:
 * - LocalStorage task persistence
 * - Real-time animated progress calculation
 * - Audio SFX feedback on objective completion (Web Audio API)
 * - Cyber confetti burst particles on milestones
 * - Phase filter tabs with slide-in animations
 * - Reset checklist confirmation
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'pwnbox_roadmap_tasks';

    // --- PROCEDURAL WEB AUDIO SYNTHESIZER ---
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playBlip(checked) {
        try {
            initAudio();
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const freq = checked ? 1100 : 440;
            osc.type = checked ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            if (checked) {
                osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.08);
            }
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            // Audio policy fallback
        }
    }

    // --- CYBER CELEBRATION CONFETTI PARTICLES ---
    let confettiCanvas = null;
    let confettiCtx = null;
    let particles = [];
    let animationFrameId = null;

    function initConfetti() {
        confettiCanvas = document.getElementById('roadmap-confetti');
        if (!confettiCanvas) return;
        confettiCtx = confettiCanvas.getContext('2d');
        resizeConfetti();
        window.addEventListener('resize', resizeConfetti);
    }

    function resizeConfetti() {
        if (!confettiCanvas) return;
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    function triggerConfettiBurst(originX, originY) {
        if (!confettiCanvas || !confettiCtx) return;
        const colors = ['#D9291C', '#005A9C', '#F2A900', '#00f0ff', '#10b981', '#ffffff'];
        const count = 35;

        const x = originX || window.innerWidth / 2;
        const y = originY || window.innerHeight / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 7;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: 4 + Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1.0,
                gravity: 0.15,
                decay: 0.02 + Math.random() * 0.02
            });
        }

        if (!animationFrameId) {
            renderConfetti();
        }
    }

    function renderConfetti() {
        if (!confettiCtx) return;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            confettiCtx.save();
            confettiCtx.globalAlpha = p.alpha;
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(p.x, p.y, p.size, p.size);
            confettiCtx.restore();
        }

        if (particles.length > 0) {
            animationFrameId = requestAnimationFrame(renderConfetti);
        } else {
            animationFrameId = null;
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    // --- CHECKLIST & PROGRESS CALCULATOR ---
    function loadSavedTasks() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    function saveTasks(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {}
    }

    function updateProgress(pulse = false) {
        const checkboxes = document.querySelectorAll('.task-checkbox');
        const total = checkboxes.length;
        if (total === 0) return;

        let completed = 0;
        checkboxes.forEach(cb => {
            if (cb.checked) completed++;
        });

        const percent = Math.round((completed / total) * 100);

        const fillEl = document.getElementById('progressBarFill');
        const percentEl = document.getElementById('progressPercentText');
        const countEl = document.getElementById('progressCountText');

        if (fillEl) {
            fillEl.style.width = `${percent}%`;
            if (pulse) {
                fillEl.classList.remove('pulse-celebrate');
                void fillEl.offsetWidth; // Trigger reflow
                fillEl.classList.add('pulse-celebrate');
            }
        }

        if (percentEl) {
            percentEl.textContent = `${percent}%`;
            if (pulse) {
                percentEl.style.transform = 'scale(1.25)';
                setTimeout(() => { percentEl.style.transform = 'scale(1)'; }, 200);
            }
        }

        if (countEl) countEl.textContent = `${completed} / ${total} Objectives Completed`;
    }

    function initChecklist() {
        const savedState = loadSavedTasks();
        const checkboxes = document.querySelectorAll('.task-checkbox');

        checkboxes.forEach((cb, idx) => {
            const taskId = cb.getAttribute('data-task') || `task_${idx}`;
            cb.setAttribute('data-task', taskId);

            if (savedState[taskId]) {
                cb.checked = true;
                const parent = cb.closest('.checklist-item');
                if (parent) parent.classList.add('checked');
            }

            cb.addEventListener('change', (e) => {
                const isChecked = cb.checked;
                const parent = cb.closest('.checklist-item');
                if (parent) parent.classList.toggle('checked', isChecked);

                const currentTasks = loadSavedTasks();
                currentTasks[taskId] = isChecked;
                saveTasks(currentTasks);

                playBlip(isChecked);
                updateProgress(true);

                if (isChecked) {
                    const rect = cb.getBoundingClientRect();
                    triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            });
        });

        updateProgress(false);
    }

    // --- PHASE OVERVIEW & DETAIL VIEW CONTROLLER ---
    const phaseTitles = {
        'p1': 'Phase 1: Build the Foundation (Month 1 – 2)',
        'p2': 'Phase 2: Learn to Hack (Month 3 – 5)',
        'p3': 'Phase 3: The CEH Exam Sprint (Month 6 – 7)',
        'p4': 'Phase 4: Career Launch & Mastery (Month 8 – 9)'
    };

    window.showPhaseOverview = function () {
        const overviewEl = document.getElementById('phasesOverviewView');
        const detailEl = document.getElementById('phasesDetailView');
        if (overviewEl) overviewEl.style.display = 'block';
        if (detailEl) detailEl.style.display = 'none';

        if (window.location.hash && window.location.hash !== '#overview') {
            try {
                history.pushState(null, '', window.location.pathname + '#overview');
            } catch (e) {}
        }

        if (overviewEl) {
            overviewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.showPhaseDetail = function (phaseId = 'p1', scroll = true) {
        if (!phaseTitles[phaseId]) phaseId = 'p1';

        const overviewEl = document.getElementById('phasesOverviewView');
        const detailEl = document.getElementById('phasesDetailView');
        const phaseBlocks = document.querySelectorAll('.phase-block');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const detailTitle = document.getElementById('detailCurrentTitle');

        if (overviewEl) overviewEl.style.display = 'none';
        if (detailEl) detailEl.style.display = 'block';

        // Update active filter button
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-phase') === phaseId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show strictly the selected phase block
        phaseBlocks.forEach(block => {
            const blockPhase = block.getAttribute('data-phase');
            if (blockPhase === phaseId) {
                block.style.display = 'flex';
                block.style.animation = 'none';
                void block.offsetWidth; // Trigger reflow
                block.style.animation = 'phaseSlideIn 0.35s ease-out';
            } else {
                block.style.display = 'none';
            }
        });

        // Update current title
        if (detailTitle) {
            detailTitle.textContent = `Currently Viewing: ${phaseTitles[phaseId]}`;
        }

        // Update URL hash
        const targetHash = `#${phaseId}`;
        if (window.location.hash !== targetHash) {
            try {
                history.pushState(null, '', window.location.pathname + targetHash);
            } catch (e) {}
        }

        if (scroll && detailEl) {
            detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // --- PHASE FILTERING ---
    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPhase = btn.getAttribute('data-phase');
                window.showPhaseDetail(targetPhase, true);
            });
        });
    }

    // --- RESET TASKS ---
    function initResetButton() {
        const resetBtn = document.getElementById('btnResetTasks');
        if (!resetBtn) return;

        resetBtn.addEventListener('click', () => {
            if (window.confirm('Reset all roadmap objective checkboxes? Your progress will be cleared.')) {
                localStorage.removeItem(STORAGE_KEY);
                document.querySelectorAll('.task-checkbox').forEach(cb => {
                    cb.checked = false;
                    const parent = cb.closest('.checklist-item');
                    if (parent) parent.classList.remove('checked');
                });
                updateProgress(true);
            }
        });
    }

    function checkInitialView() {
        const hash = (window.location.hash || '').toLowerCase();
        if (hash === '#p1' || hash === '#phase1') {
            window.showPhaseDetail('p1', false);
        } else if (hash === '#p2' || hash === '#phase2') {
            window.showPhaseDetail('p2', false);
        } else if (hash === '#p3' || hash === '#phase3') {
            window.showPhaseDetail('p3', false);
        } else if (hash === '#p4' || hash === '#phase4') {
            window.showPhaseDetail('p4', false);
        } else {
            window.showPhaseOverview();
        }
    }

    // --- INITIALIZE ON DOM LOAD ---
    document.addEventListener('DOMContentLoaded', () => {
        initConfetti();
        initChecklist();
        initFilters();
        initResetButton();
        checkInitialView();
    });

    window.addEventListener('hashchange', () => {
        checkInitialView();
    });
})();

