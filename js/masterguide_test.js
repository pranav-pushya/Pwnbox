/**
 * CyberSec Master Guide — Interactive Test Engine
 * Client-side MCQ test runner with analytics, filtering, and localStorage history.
 */

(function () {
    // ── Global State ──
    let allLoadedQuestions = [];
    let currentQuizPool = [];
    let currentExamQuestions = [];
    let currentIndex = 0;
    let currentScore = 0;
    let userExamRecords = [];
    let optionLocked = false;
    let currentChapter = 'all';

    const CHAPTER_NAMES = {
        1: "Core Threats & Attacks",
        2: "Malware Types",
        3: "Defensive Tools",
        4: "Encryption",
        5: "Identity & Access",
        6: "Network & Cloud",
        7: "Advanced Threats",
        8: "Governance",
        9: "Operations",
        10: "Emerging Tech"
    };

    // ── Cache for JSON data ──
    const jsonCache = {};

    // ── Initialization ──
    document.addEventListener('DOMContentLoaded', () => {
        initFilters();
        loadRecentHistory();

        // Check URL parameters (e.g. ?chapter=3)
        const params = new URLSearchParams(window.location.search);
        const chapterParam = params.get('chapter');
        if (chapterParam) {
            const chSelect = document.getElementById('chapterSelect');
            if (chSelect && [...chSelect.options].some(o => o.value === chapterParam)) {
                chSelect.value = chapterParam;
            }
        }

        handleChapterChange();
    });

    // ── Filter Management ──
    function initFilters() {
        const chapterSelect = document.getElementById('chapterSelect');
        const diffSelect = document.getElementById('diffSelect');
        const typeSelect = document.getElementById('typeSelect');
        const countSelect = document.getElementById('countSelect');

        if (chapterSelect) chapterSelect.addEventListener('change', handleChapterChange);
        if (diffSelect) diffSelect.addEventListener('change', updateMatchingCount);
        if (typeSelect) typeSelect.addEventListener('change', updateMatchingCount);
        if (countSelect) countSelect.addEventListener('change', updateMatchingCount);

        const startBtn = document.getElementById('startExamBtn');
        if (startBtn) startBtn.addEventListener('click', startExam);

        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn) nextBtn.addEventListener('click', handleNextQuestion);

        const retakeBtn = document.getElementById('retakeExamBtn');
        if (retakeBtn) retakeBtn.addEventListener('click', retakeExam);

        const reconfigBtn = document.getElementById('reconfigExamBtn');
        if (reconfigBtn) reconfigBtn.addEventListener('click', showSetupView);
    }

    async function handleChapterChange() {
        const chapterSelect = document.getElementById('chapterSelect');
        currentChapter = chapterSelect ? chapterSelect.value : 'all';

        const infoEl = document.getElementById('matchCountText');
        if (infoEl) infoEl.innerHTML = "Loading quiz dataset...";

        try {
            allLoadedQuestions = await fetchChapterQuestions(currentChapter);
            updateMatchingCount();
        } catch (err) {
            console.error("Failed to load quiz data:", err);
            if (infoEl) infoEl.innerHTML = "⚠️ Error loading quiz dataset. Please try again.";
        }
    }

    async function fetchChapterQuestions(chapter) {
        if (jsonCache[chapter]) {
            return jsonCache[chapter];
        }

        // 1. Direct offline bundle support (works seamlessly on file:/// and http://)
        if (typeof window !== 'undefined' && window.MASTERGUIDE_QUIZ_DATA) {
            const bundle = window.MASTERGUIDE_QUIZ_DATA;
            let bundleQuestions = [];
            if (chapter === 'all') {
                const allData = bundle['all'];
                if (allData && allData.chapters) {
                    allData.chapters.forEach(ch => {
                        const chNum = ch.chapter;
                        ch.questions.forEach(q => {
                            bundleQuestions.push({ ...q, chapter: chNum });
                        });
                    });
                }
            } else if (bundle[chapter]) {
                const chData = bundle[chapter];
                const chNum = parseInt(chapter, 10);
                bundleQuestions = (chData.questions || []).map(q => ({
                    ...q,
                    chapter: chNum
                }));
            }
            if (bundleQuestions.length > 0) {
                jsonCache[chapter] = bundleQuestions;
                return bundleQuestions;
            }
        }

        // 2. Fetch over HTTP
        let url = '';
        if (chapter === 'all') {
            url = (window.location.pathname.includes('/masterguide/') ? '../quiz-data/' : 'quiz-data/') + 'masterguide_quiz_all.json';
        } else {
            url = `${window.location.pathname.includes('/masterguide/') ? '../quiz-data/' : 'quiz-data/'}masterguide_quiz_ch${chapter}.json`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        let questions = [];
        if (chapter === 'all' && data.chapters) {
            // Flatten all chapters
            data.chapters.forEach(ch => {
                const chNum = ch.chapter;
                ch.questions.forEach(q => {
                    q.chapter = chNum;
                    questions.push(q);
                });
            });
        } else if (data.questions) {
            const chNum = parseInt(chapter, 10);
            questions = data.questions.map(q => ({
                ...q,
                chapter: chNum
            }));
        }

        jsonCache[chapter] = questions;
        return questions;
    }

    function getFilteredQuestions() {
        const diff = document.getElementById('diffSelect')?.value || 'all';
        const type = document.getElementById('typeSelect')?.value || 'all';

        return allLoadedQuestions.filter(q => {
            const diffMatch = (diff === 'all') || (q.difficulty === diff);
            const typeMatch = (type === 'all') || (q.type === type);
            return diffMatch && typeMatch;
        });
    }

    function updateMatchingCount() {
        const filtered = getFilteredQuestions();
        const countSelect = document.getElementById('countSelect');
        const countVal = countSelect ? countSelect.value : '10';

        let effectiveCount = filtered.length;
        if (countVal !== 'all') {
            const requested = parseInt(countVal, 10);
            effectiveCount = Math.min(requested, filtered.length);
        }

        const infoEl = document.getElementById('matchCountText');
        if (infoEl) {
            if (filtered.length === 0) {
                infoEl.innerHTML = `⚠️ <strong>0 questions</strong> match your selected criteria. Please loosen filters.`;
                const startBtn = document.getElementById('startExamBtn');
                if (startBtn) startBtn.disabled = true;
            } else {
                infoEl.innerHTML = `Ready! <strong>${effectiveCount} questions</strong> will be presented out of <strong>${filtered.length}</strong> matching pool.`;
                const startBtn = document.getElementById('startExamBtn');
                if (startBtn) startBtn.disabled = false;
            }
        }
    }

    // ── Exam Start ──
    function startExam() {
        const pool = getFilteredQuestions();
        if (!pool || pool.length === 0) {
            if (typeof window.tacticalAlert === 'function') {
                window.tacticalAlert({
                    title: "FILTER CRITERIA EMPTY",
                    message: "No questions match your current domain filter settings. Please adjust your filters to include questions.",
                    type: "warning"
                });
            } else {
                alert("No questions match your filter settings. Please adjust filters.");
            }
            return;
        }

        // Shuffle pool
        const shuffled = [...pool].sort(() => Math.random() - 0.5);

        const countVal = document.getElementById('countSelect')?.value || '10';
        let limit = shuffled.length;
        if (countVal !== 'all') {
            limit = Math.min(parseInt(countVal, 10), shuffled.length);
        }

        currentExamQuestions = shuffled.slice(0, limit);
        currentIndex = 0;
        currentScore = 0;
        userExamRecords = [];

        // Switch to Exam View
        document.body.classList.remove('results-active');
        document.body.classList.add('exam-active');
        document.getElementById('setupView').style.display = 'none';
        document.getElementById('resultsView').style.display = 'none';
        document.getElementById('examView').style.display = 'block';

        renderQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function retakeExam() {
        startExam();
    }

    function showSetupView() {
        document.body.classList.remove('exam-active');
        document.body.classList.remove('results-active');
        document.getElementById('examView').style.display = 'none';
        document.getElementById('resultsView').style.display = 'none';
        document.getElementById('setupView').style.display = 'block';
        loadRecentHistory();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── Question Rendering ──
    function renderQuestion() {
        optionLocked = false;
        const q = currentExamQuestions[currentIndex];
        const total = currentExamQuestions.length;

        // Expose to window for the "Ask a Doubt" chatbot context
        window.__CURRENT_TEST_QUESTION = q;

        // Update progress counter
        const counterEl = document.getElementById('examCounter');
        if (counterEl) {
            counterEl.textContent = `QUESTION ${currentIndex + 1} OF ${total}`;
        }

        // Update progress bar
        const barFill = document.getElementById('examProgressFill');
        if (barFill) {
            const pct = Math.round(((currentIndex) / total) * 100);
            barFill.style.width = `${pct}%`;
        }

        // Badges
        const badgesWrap = document.getElementById('examBadges');
        if (badgesWrap) {
            const chTitle = CHAPTER_NAMES[q.chapter] ? `CH ${q.chapter}` : 'General';
            badgesWrap.innerHTML = `
                <span class="exam-badge badge-term">📚 ${chTitle}</span>
                <span class="exam-badge badge-term">🎯 #${q.termRef || 'term'}</span>
                <span class="exam-badge badge-diff-${q.difficulty}">${q.difficulty}</span>
                <span class="exam-badge badge-type">${formatTypeLabel(q.type)}</span>
            `;
        }

        // Question text
        const qTextEl = document.getElementById('questionText');
        if (qTextEl) {
            qTextEl.textContent = q.question;
        }

        // Options Grid
        const optionsGrid = document.getElementById('optionsGrid');
        if (optionsGrid) {
            const letters = ['A', 'B', 'C', 'D'];
            optionsGrid.innerHTML = '';

            q.options.forEach((optText, optIdx) => {
                const optItem = document.createElement('div');
                optItem.className = 'option-item';
                optItem.dataset.index = optIdx;
                optItem.innerHTML = `
                    <div class="option-letter">${letters[optIdx]}</div>
                    <div class="option-text">${escapeHtml(optText)}</div>
                `;
                optItem.onclick = () => selectOption(optIdx, optItem);
                optionsGrid.appendChild(optItem);
            });
        }

        // Hide explanation panel & next button
        const expPanel = document.getElementById('explanationPanel');
        if (expPanel) expPanel.style.display = 'none';

        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn) {
            nextBtn.style.display = 'none';
            if (currentIndex === total - 1) {
                nextBtn.innerHTML = 'Finish Exam 🏆';
            } else {
                nextBtn.innerHTML = 'Next Question →';
            }
        }
    }

    // ── Option Selection ──
    function selectOption(selectedIdx, optionEl) {
        if (optionLocked) return;
        optionLocked = true;

        const q = currentExamQuestions[currentIndex];
        const isCorrect = (selectedIdx === q.correctIndex);

        // Lock all options
        const allOptions = document.querySelectorAll('.option-item');
        allOptions.forEach(opt => opt.classList.add('locked'));

        // Highlight user selection
        if (isCorrect) {
            optionEl.classList.add('selected', 'correct');
            currentScore++;
        } else {
            optionEl.classList.add('selected', 'incorrect');
            // Reveal the correct option
            const correctEl = document.querySelector(`.option-item[data-index="${q.correctIndex}"]`);
            if (correctEl) correctEl.classList.add('correct-reveal');
        }

        // Record user answer
        userExamRecords.push({
            question: q,
            selectedIdx: selectedIdx,
            correctIdx: q.correctIndex,
            isCorrect: isCorrect
        });

        // Show Explanation Panel
        const expPanel = document.getElementById('explanationPanel');
        const expText = document.getElementById('explanationText');
        if (expPanel && expText) {
            expText.innerHTML = escapeHtml(q.explanation);
            expPanel.style.display = 'block';
        }

        // Show Next / Finish button
        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn) nextBtn.style.display = 'inline-flex';
    }

    function handleNextQuestion() {
        if (currentIndex + 1 < currentExamQuestions.length) {
            currentIndex++;
            renderQuestion();
            window.scrollTo({ top: 120, behavior: 'smooth' });
        } else {
            finishExam();
        }
    }

    // ── Exam Completion & Analytics ──
    function finishExam() {
        // Complete progress bar
        const barFill = document.getElementById('examProgressFill');
        if (barFill) barFill.style.width = '100%';

        window.__CURRENT_TEST_QUESTION = null;

        const total = currentExamQuestions.length;
        const pct = Math.round((currentScore / total) * 100);

        // Save result in localStorage history
        saveExamHistory(currentScore, total, pct);

        // Render Results View
        document.body.classList.remove('exam-active');
        document.body.classList.add('results-active');
        document.getElementById('examView').style.display = 'none';
        document.getElementById('resultsView').style.display = 'block';

        const scoreBig = document.getElementById('resultsScoreBig');
        if (scoreBig) scoreBig.textContent = `${currentScore} / ${total}`;

        const scoreSub = document.getElementById('resultsScoreSubtitle');
        if (scoreSub) scoreSub.textContent = `Overall Accuracy: ${pct}%`;

        // Rank Badge
        const rankEl = document.getElementById('resultsRankBadge');
        if (rankEl) {
            let rank = "🔰 Cyber Cadet";
            let color = "var(--text-muted)";
            if (pct >= 90) {
                rank = "🏆 Master Cyber Operative (CEH Ready)";
                color = "var(--bauhaus-red)";
            } else if (pct >= 75) {
                rank = "⚔️ Senior Security Analyst";
                color = "var(--bauhaus-blue)";
            } else if (pct >= 50) {
                rank = "🛡️ Tactical Field Agent";
                color = "var(--accent-green)";
            }
            rankEl.textContent = rank;
            rankEl.style.borderColor = color;
        }

        // Breakdown Analytics
        renderBreakdowns();

        // Missed Questions Review
        renderMissedQuestions();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderBreakdowns() {
        // 1. Difficulty Breakdown
        const diffStats = {
            easy: { total: 0, correct: 0 },
            medium: { total: 0, correct: 0 },
            hard: { total: 0, correct: 0 }
        };

        // 2. Type Breakdown
        const typeStats = {};

        userExamRecords.forEach(rec => {
            const diff = rec.question.difficulty || 'medium';
            if (!diffStats[diff]) diffStats[diff] = { total: 0, correct: 0 };
            diffStats[diff].total++;
            if (rec.isCorrect) diffStats[diff].correct++;

            const type = rec.question.type || 'definition';
            if (!typeStats[type]) typeStats[type] = { total: 0, correct: 0 };
            typeStats[type].total++;
            if (rec.isCorrect) typeStats[type].correct++;
        });

        const diffContainer = document.getElementById('difficultyBreakdown');
        if (diffContainer) {
            diffContainer.innerHTML = '';
            ['easy', 'medium', 'hard'].forEach(d => {
                const s = diffStats[d];
                if (s && s.total > 0) {
                    const pct = Math.round((s.correct / s.total) * 100);
                    diffContainer.innerHTML += `
                        <div class="breakdown-row">
                            <span>${d.toUpperCase()} (${s.correct}/${s.total})</span>
                            <div class="breakdown-mini-bar">
                                <div class="breakdown-mini-fill" style="width:${pct}%"></div>
                            </div>
                            <span>${pct}%</span>
                        </div>
                    `;
                }
            });
        }

        const typeContainer = document.getElementById('typeBreakdown');
        if (typeContainer) {
            typeContainer.innerHTML = '';
            Object.keys(typeStats).forEach(t => {
                const s = typeStats[t];
                const pct = Math.round((s.correct / s.total) * 100);
                typeContainer.innerHTML += `
                    <div class="breakdown-row">
                        <span>${formatTypeLabel(t)} (${s.correct}/${s.total})</span>
                        <div class="breakdown-mini-bar">
                            <div class="breakdown-mini-fill" style="width:${pct}%"></div>
                        </div>
                        <span>${pct}%</span>
                    </div>
                `;
            });
        }
    }

    function renderMissedQuestions() {
        const missedList = document.getElementById('missedQuestionsList');
        const missedSection = document.getElementById('missedQuestionsSection');
        if (!missedList || !missedSection) return;

        const missed = userExamRecords.filter(r => !r.isCorrect);

        if (missed.length === 0) {
            missedSection.style.display = 'none';
            return;
        }

        missedSection.style.display = 'block';
        missedList.innerHTML = '';

        missed.forEach((m, idx) => {
            const q = m.question;
            const letters = ['A', 'B', 'C', 'D'];
            const userLetter = letters[m.selectedIdx] || '?';
            const correctLetter = letters[m.correctIdx] || '?';
            const userChoice = q.options[m.selectedIdx] || 'None';
            const correctChoice = q.options[m.correctIdx] || '';
            const chNum = q.chapter || 1;
            const targetGuideUrl = `masterguide_ch${chNum}.html#${q.termRef || ''}`;

            const card = document.createElement('div');
            card.className = 'missed-card';
            card.innerHTML = `
                <div class="missed-card-header">
                    <span class="exam-badge badge-diff-${q.difficulty}">${q.difficulty}</span>
                    <span class="exam-badge badge-type">${formatTypeLabel(q.type)}</span>
                    <span class="exam-badge badge-term">CH ${chNum}: #${q.termRef}</span>
                </div>
                <div class="missed-card-q">${escapeHtml(q.question)}</div>
                <div class="missed-answer-comparison">
                    <div class="missed-user-ans">❌ Your Answer: (${userLetter}) ${escapeHtml(userChoice)}</div>
                    <div class="missed-correct-ans">✅ Correct Answer: (${correctLetter}) ${escapeHtml(correctChoice)}</div>
                </div>
                <div class="missed-explanation">
                    <strong>💡 Explanation:</strong> ${escapeHtml(q.explanation)}
                </div>
                <div class="missed-card-footer">
                    <a href="${targetGuideUrl}" target="_blank" class="btn-review-term">📖 Review Term in Master Guide ↗</a>
                </div>
            `;
            missedList.appendChild(card);
        });
    }

    // ── LocalStorage History ──
    function saveExamHistory(score, total, pct) {
        try {
            const history = JSON.parse(localStorage.getItem('pwnbox_exam_history') || '[]');
            const record = {
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
                chapter: currentChapter === 'all' ? 'All Chapters' : `Ch ${currentChapter}`,
                score: score,
                total: total,
                pct: pct
            };
            history.unshift(record);
            if (history.length > 8) history.pop();
            localStorage.setItem('pwnbox_exam_history', JSON.stringify(history));
        } catch (e) {
            console.error("Failed to save history:", e);
        }
    }

    function loadRecentHistory() {
        const chipsList = document.getElementById('historyChipsList');
        if (!chipsList) return;

        try {
            const history = JSON.parse(localStorage.getItem('pwnbox_exam_history') || '[]');
            if (history.length === 0) {
                chipsList.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem;">No recent tests recorded yet. Complete an exam above to track progress!</span>';
                return;
            }

            chipsList.innerHTML = history.slice(0, 4).map(h => `
                <div class="history-chip">
                    <span>${h.chapter}</span>
                    <span class="score-pill">${h.score}/${h.total} (${h.pct}%)</span>
                    <span style="color:var(--text-muted);font-size:0.7rem;">${h.date}</span>
                </div>
            `).join('');
        } catch (e) {
            console.error(e);
        }
    }

    // ── Helper Utilities ──
    function formatTypeLabel(type) {
        if (!type) return 'Concept';
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
