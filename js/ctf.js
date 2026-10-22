/**
 * PWNBOX CYBER COMMAND — CTF ARENA, LEADERBOARD & CERTIFICATES ENGINE
 * Standardized flag validation, competitive ranking, and canvas certification.
 */

(function () {
    'use strict';

    const CTF_CHALLENGES = [
        {
            id: "pwn_web_01",
            category: "Web & Shells",
            title: "Terminal Reconnaissance",
            points: 250,
            flag: "pwn{w3bsh3ll_m4st3r_unl0ck3d}",
            desc: "Access the in-browser Linux WebShell terminal and execute the 'pwn ctf' vector command to unlock the operative credential flag.",
            hint: "Run 'terminal.html' -> type 'pwn ctf'"
        },
        {
            id: "pwn_priv_02",
            category: "System Hacking",
            title: "Root Privilege Escalation",
            points: 350,
            flag: "pwn{r00t_pr1v1l3g3_3sc4l4t10n_succ3ss}",
            desc: "Escalate privileges from standard operative to ROOT using 'sudo su' in the WebShell and inspect '/root/flag_root.txt'.",
            hint: "Terminal -> 'sudo su' -> 'cat /root/flag_root.txt'"
        },
        {
            id: "pwn_sec_03",
            category: "Intelligence",
            title: "Operative Dossier Clearance",
            points: 200,
            flag: "pwn{t3rm1n4l_0p3r4t1v3_cl34r4nc3}",
            desc: "Read the secret file stored in the agent's home directory '/home/agent/flag.txt'.",
            hint: "Terminal -> 'cat flag.txt'"
        },
        {
            id: "pwn_sqli_04",
            category: "Web Security",
            title: "SQLi Authentication Bypass",
            points: 300,
            flag: "pwn{sqli_auth_byp4ss_adm1n}",
            desc: "Bypass target database authentication using the classic SQL injection payload \"' OR 1=1 -- \".",
            hint: "Module 06 Web App & Games arcade SQLi Locksmith"
        },
        {
            id: "pwn_rev_05",
            category: "Exploitation",
            title: "Tactical Reverse Shell Forge",
            points: 250,
            flag: "pwn{r3v3rs3_sh3ll_l1st3n3r_4444}",
            desc: "Craft an interactive Netcat MKFIFO reverse shell listener payload configured for port 4444.",
            hint: "Check payloads.html -> Netcat MKFIFO universal payload"
        },
        {
            id: "pwn_smb_06",
            category: "Network Scan",
            title: "Samba Port 445 Exploit",
            points: 300,
            flag: "pwn{smb_445_sh4r3_pwn3d}",
            desc: "Perform an Nmap service scan on 10.10.10.27 to identify the vulnerable NetBIOS/SMB daemon version.",
            hint: "Terminal -> 'nmap -sV 10.10.10.27'"
        },
        {
            id: "pwn_mem_07",
            category: "Binary & Memory",
            title: "Buffer Decryptor Breach",
            points: 400,
            flag: "pwn{br34ch_pr0t0c0l_ov3rfl0w}",
            desc: "Decrypt hexadecimal memory buffers within the Cyber Warfare Breach Protocol matrix to capture the target sequence.",
            hint: "Portal home page -> Breach Protocol Matrix game"
        },
        {
            id: "pwn_ceh_08",
            category: "CEH Capstone",
            title: "CEH Master Capstone",
            points: 500,
            flag: "pwn{c3h_v12_m4st3r_ch4mp10n}",
            desc: "Achieve 80%+ passing score on the 125-question CEH v12 Certification Master Practice Exam.",
            hint: "Master Guide -> Exam Simulator"
        }
    ];

    // Local Storage State
    function getSolvedFlags() {
        try {
            return JSON.parse(localStorage.getItem('pwnbox_ctf_solved_flags') || '[]');
        } catch (_) {
            return [];
        }
    }

    function saveSolvedFlags(flags) {
        localStorage.setItem('pwnbox_ctf_solved_flags', JSON.stringify(flags));
        if (window.PwnCloudSync && typeof window.PwnCloudSync.trigger === 'function') {
            window.PwnCloudSync.trigger();
        }
    }

    function getTotalXp() {
        return parseInt(localStorage.getItem('pwnbox_arcade_total_xp') || '0', 10);
    }

    function addXp(amount) {
        const cur = getTotalXp();
        const next = cur + amount;
        localStorage.setItem('pwnbox_arcade_total_xp', String(next));
        if (window.PwnCloudSync && typeof window.PwnCloudSync.trigger === 'function') {
            window.PwnCloudSync.trigger();
        }
        return next;
    }

    // Flag Submission Verification
    function submitFlag(rawInput) {
        const flag = (rawInput || '').trim();
        if (!flag) {
            showToast("Please enter a flag.", "error");
            return false;
        }

        const matched = CTF_CHALLENGES.find(c => c.flag.toLowerCase() === flag.toLowerCase());
        if (!matched) {
            showToast("❌ Invalid Flag. Verify syntax (format: pwn{...}).", "error");
            return false;
        }

        const solved = getSolvedFlags();
        if (solved.includes(matched.id)) {
            showToast(`ℹ️ Flag for "${matched.title}" already captured!`, "info");
            return false;
        }

        solved.push(matched.id);
        saveSolvedFlags(solved);
        addXp(matched.points);

        showToast(`🎉 FLAG CAPTURED! +${matched.points} XP for "${matched.title}"`, "success");
        renderAll();
        return true;
    }

    // Render Stats
    function renderStats() {
        const solved = getSolvedFlags();
        const solvedCount = solved.length;
        const totalChallenges = CTF_CHALLENGES.length;
        const totalXp = getTotalXp();

        const countEl = document.getElementById('statSolvedCount');
        const xpEl = document.getElementById('statTotalXp');
        const rankEl = document.getElementById('statClearanceRank');

        if (countEl) countEl.textContent = `${solvedCount} / ${totalChallenges}`;
        if (xpEl) xpEl.textContent = `${totalXp} XP`;
        if (rankEl) {
            if (solvedCount >= 7) rankEl.textContent = "ROOT ARCHITECT";
            else if (solvedCount >= 4) rankEl.textContent = "SHADOW OPERATOR";
            else if (solvedCount >= 2) rankEl.textContent = "SPECIALIST";
            else rankEl.textContent = "APPRENTICE";
        }
    }

    // Render Challenge Cards
    function renderChallenges() {
        const container = document.getElementById('ctfChallengesList');
        if (!container) return;

        const solved = getSolvedFlags();
        let html = '';

        CTF_CHALLENGES.forEach(c => {
            const isSolved = solved.includes(c.id);
            const badgeColor = isSolved ? '#10b981' : 'var(--bauhaus-blue)';
            const statusLabel = isSolved ? '✅ SOLVED' : 'ACTIVE';

            html += `
                <div class="challenge-card ${isSolved ? 'solved' : ''}" data-id="${c.id}">
                    <div>
                        <div class="challenge-top">
                            <span class="challenge-badge" style="color:${badgeColor}; border-color:${badgeColor};">${c.category.toUpperCase()} &bull; ${statusLabel}</span>
                            <span class="challenge-points">+${c.points} XP</span>
                        </div>
                        <h3 class="challenge-title" style="margin-top:10px;">${escapeHtml(c.title)}</h3>
                        <p class="challenge-desc" style="margin-top:8px;">${escapeHtml(c.desc)}</p>
                    </div>
                    <div>
                        <div class="challenge-hint">💡 HINT: ${escapeHtml(c.hint)}</div>
                        <div style="margin-top:12px; display:flex; gap:8px;">
                            <input type="text" id="flagInput_${c.id}" class="flag-input" placeholder="pwn{...}" ${isSolved ? 'value="[FLAG SECURED]" disabled' : ''} style="font-size:0.8rem; padding:8px 12px;">
                            <button type="button" class="btn-flag-submit" onclick="PwnCTF.submitCardFlag('${c.id}')" ${isSolved ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} style="font-size:0.75rem; padding:8px 16px;">
                                ${isSolved ? 'SOLVED' : 'SUBMIT'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Render Leaderboard
    function renderLeaderboard() {
        const tbody = document.getElementById('leaderboardTbody');
        if (!tbody) return;

        const localAlias = localStorage.getItem('agentAlias') || localStorage.getItem('pwnbox_agent_alias') || 'CADET_OPERATOR';
        const localAvatar = localStorage.getItem('agentAvatar') || '👾';
        const solved = getSolvedFlags();
        const localXp = getTotalXp();

        const operatives = [
            { alias: "Pranav Pushya [Lead Architect]", avatar: "🛡️", rank: "Root Architect", solved: 8, xp: 2550 + localXp, isUser: false },
            { alias: "Ghost_Protocol", avatar: "💀", rank: "Shadow Operator", solved: 7, xp: 2100, isUser: false },
            { alias: "Cipher_Zero", avatar: "🕵️", rank: "Shadow Operator", solved: 6, xp: 1800, isUser: false },
            { alias: localAlias, avatar: localAvatar, rank: solved.length >= 7 ? "Root Architect" : (solved.length >= 4 ? "Shadow Operator" : "Apprentice"), solved: solved.length, xp: localXp, isUser: true },
            { alias: "Vanguard_01", avatar: "⚡", rank: "Specialist", solved: 4, xp: 1200, isUser: false },
            { alias: "K4li_Master", avatar: "👾", rank: "Apprentice", solved: 2, xp: 600, isUser: false }
        ];

        // Sort descending by XP
        operatives.sort((a, b) => b.xp - a.xp);

        let html = '';
        operatives.forEach((op, index) => {
            const rankNum = index + 1;
            let rankBadgeClass = '';
            if (rankNum === 1) rankBadgeClass = 'rank-gold';
            else if (rankNum === 2) rankBadgeClass = 'rank-silver';
            else if (rankNum === 3) rankBadgeClass = 'rank-bronze';

            html += `
                <tr class="${op.isUser ? 'current-user-row' : ''}">
                    <td><span class="rank-badge ${rankBadgeClass}">${rankNum}</span></td>
                    <td>
                        <span style="font-size:1.1rem; margin-right:6px;">${op.avatar}</span>
                        <strong>${escapeHtml(op.alias)}</strong> ${op.isUser ? '<span style="background:var(--bauhaus-yellow); color:#000; padding:1px 6px; font-size:0.65rem; font-weight:800; border-radius:3px;">YOU</span>' : ''}
                    </td>
                    <td>${op.rank}</td>
                    <td>${op.solved} / ${CTF_CHALLENGES.length}</td>
                    <td style="color:var(--bauhaus-blue); font-weight:800;">${op.xp} XP</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    // High-Resolution Certificate Generator (Canvas)
    function drawCertificate() {
        const canvas = document.getElementById('certificateCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 1600;
        canvas.height = 1000;

        const alias = localStorage.getItem('agentAlias') || localStorage.getItem('pwnbox_agent_alias') || 'CYBER_OPERATIVE';
        const solved = getSolvedFlags().length;
        const totalXp = getTotalXp();
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const certId = 'PWN-CERT-2026-' + Math.abs((alias + totalXp).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).toString(16).toUpperCase();

        // Background
        ctx.fillStyle = '#080d18';
        ctx.fillRect(0, 0, 1600, 1000);

        // Grid lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 1600; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 1000);
            ctx.stroke();
        }
        for (let y = 0; y < 1000; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(1600, y);
            ctx.stroke();
        }

        // Bauhaus Decorative Borders
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 6;
        ctx.strokeRect(30, 30, 1540, 940);

        ctx.strokeStyle = '#005A9C';
        ctx.lineWidth = 2;
        ctx.strokeRect(42, 42, 1516, 916);

        // Corner Accents
        ctx.fillStyle = '#D9291C';
        ctx.fillRect(30, 30, 40, 8);
        ctx.fillRect(30, 30, 8, 40);
        ctx.fillRect(1530, 30, 40, 8);
        ctx.fillRect(1562, 30, 8, 40);
        ctx.fillRect(30, 962, 40, 8);
        ctx.fillRect(30, 930, 8, 40);
        ctx.fillRect(1530, 962, 40, 8);
        ctx.fillRect(1562, 930, 8, 40);

        // Top Header
        ctx.textAlign = 'center';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 24px "Space Mono", monospace';
        ctx.fillText('PWNBOX CYBER COMMAND ACADEMY // CERTIFICATE OF EXCELLENCE', 800, 120);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '900 48px "Work Sans", sans-serif';
        ctx.fillText('OFFENSIVE CYBER WARFARE MASTERY', 800, 190);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 20px "Space Mono", monospace';
        ctx.fillText('THIS IS OFFICIALLY CONFERRED UPON TACTICAL OPERATIVE', 800, 260);

        // Operative Name Highlight
        ctx.fillStyle = '#facc15';
        ctx.font = '900 58px "Space Mono", monospace';
        ctx.fillText(alias.toUpperCase(), 800, 340);

        // Underline
        ctx.fillStyle = '#005A9C';
        ctx.fillRect(550, 365, 500, 4);

        // Citation Body
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '400 22px "Work Sans", sans-serif';
        ctx.fillText('For successfully demonstrating technical competence in reconnaissance, automated port scanning,', 800, 430);
        ctx.fillText('vulnerability analysis, web application exploitation, and privilege escalation vectors.', 800, 465);

        // Achievement Stats Banner
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.fillRect(400, 520, 800, 110);
        ctx.strokeRect(400, 520, 800, 110);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 28px "Space Mono", monospace';
        ctx.fillText(`${solved} / ${CTF_CHALLENGES.length}`, 530, 570);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 14px "Space Mono", monospace';
        ctx.fillText('FLAGS SECURED', 530, 600);

        ctx.fillStyle = '#4ade80';
        ctx.font = '700 28px "Space Mono", monospace';
        ctx.fillText(`${totalXp} XP`, 800, 570);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 14px "Space Mono", monospace';
        ctx.fillText('TACTICAL SCORE', 800, 600);

        ctx.fillStyle = '#facc15';
        ctx.font = '700 28px "Space Mono", monospace';
        ctx.fillText(solved >= 7 ? 'ROOT ARCHITECT' : (solved >= 4 ? 'SHADOW' : 'APPRENTICE'), 1070, 570);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 14px "Space Mono", monospace';
        ctx.fillText('CLEARANCE LEVEL', 1070, 600);

        // Footer Metadata & Signatures
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.font = '700 16px "Space Mono", monospace';
        ctx.fillText(`DATE OF ISSUANCE: ${dateStr}`, 120, 800);
        ctx.fillText(`VERIFICATION ID: ${certId}`, 120, 830);
        ctx.fillText(`AUTHENTICATION HASH: VALID // SIGNED BY PWNBOX SEC-NET`, 120, 860);

        // Signature on right
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'italic 700 32px "Space Mono", cursive';
        ctx.fillText('Pranav Pushya', 1350, 810);

        ctx.fillStyle = '#475569';
        ctx.fillRect(1200, 830, 300, 2);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 15px "Space Mono", monospace';
        ctx.fillText('PRANAV PUSHYA', 1350, 855);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '600 13px "Space Mono", monospace';
        ctx.fillText('LEAD ARCHITECT & SECURITY RESEARCHER', 1350, 878);
    }

    function downloadCertificate() {
        const canvas = document.getElementById('certificateCanvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'PwnBox_Certified_Cyber_Operative.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast("Certificate downloaded successfully!", "success");
    }

    function showToast(msg, type = 'info') {
        const box = document.getElementById('ctfToastBox');
        if (!box) return;
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: #0f172a;
            color: ${type === 'success' ? '#4ade80' : (type === 'error' ? '#ef4444' : '#38bdf8')};
            border: 2px solid ${type === 'success' ? '#4ade80' : (type === 'error' ? '#ef4444' : '#facc15')};
            box-shadow: 4px 4px 0 rgba(0,0,0,0.5);
            padding: 12px 18px;
            font-family: 'Space Mono', monospace;
            font-size: 0.85rem;
            font-weight: 700;
        `;
        toast.textContent = msg;
        box.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderAll() {
        renderStats();
        renderChallenges();
        renderLeaderboard();
        drawCertificate();
    }

    function init() {
        renderAll();

        const submitBtn = document.getElementById('btnSubmitUniversalFlag');
        const inputEl = document.getElementById('universalFlagInput');
        if (submitBtn && inputEl) {
            submitBtn.addEventListener('click', () => {
                const val = inputEl.value;
                if (submitFlag(val)) {
                    inputEl.value = '';
                }
            });
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const val = inputEl.value;
                    if (submitFlag(val)) {
                        inputEl.value = '';
                    }
                }
            });
        }
    }

    window.PwnCTF = {
        init,
        submitFlag,
        submitCardFlag: (challengeId) => {
            const input = document.getElementById(`flagInput_${challengeId}`);
            if (input) {
                submitFlag(input.value);
            }
        },
        downloadCertificate,
        renderAll
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
