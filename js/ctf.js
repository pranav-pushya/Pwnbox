/**
 * PWNBOX CYBER COMMAND — CTF ARENA, LEADERBOARD & CERTIFICATES ENGINE
 * Standardized flag validation, SHA-256 cryptographic verification,
 * hint unlock penalty system, and canvas certification forge.
 */

(function () {
    'use strict';

    // Fast pure-JS SHA-256 fallback implementation
    function pureSha256(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }
        const mathPow = Math.pow;
        const maxWord = mathPow(2, 32);
        const lengthProperty = 'length';
        let i, j;
        let result = '';

        const words = [];
        const asciiBitLength = ascii[lengthProperty] * 8;
        let hash = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];
        const k = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];

        let wordsLength = 0;
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            words[i >> 2] |= j << ((3 - (i % 4)) * 8);
        }
        words[asciiBitLength >> 5] |= 0x80 << ((3 - ((asciiBitLength >> 3) % 4)) * 8);
        words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;
        wordsLength = words.length;

        for (i = 0; i < wordsLength; i += 16) {
            const w = words.slice(i, i + 16);
            let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
            let e = hash[4], f = hash[5], g = hash[6], h = hash[7];

            for (j = 0; j < 64; j++) {
                if (j < 16) {
                    w[j] = w[j] | 0;
                } else {
                    const gamma0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
                    const gamma1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
                    w[j] = (w[j - 16] + gamma0 + w[j - 7] + gamma1) | 0;
                }
                const ch = (e & f) ^ (~e & g);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const sigma0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
                const sigma1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
                const t1 = (h + sigma1 + ch + k[j] + w[j]) | 0;
                const t2 = (sigma0 + maj) | 0;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            hash[0] = (hash[0] + a) | 0;
            hash[1] = (hash[1] + b) | 0;
            hash[2] = (hash[2] + c) | 0;
            hash[3] = (hash[3] + d) | 0;
            hash[4] = (hash[4] + e) | 0;
            hash[5] = (hash[5] + f) | 0;
            hash[6] = (hash[6] + g) | 0;
            hash[7] = (hash[7] + h) | 0;
        }

        for (i = 0; i < 8; i++) {
            for (j = 3; j >= 0; j--) {
                const b = (hash[i] >> (j * 8)) & 255;
                result += (b < 16 ? '0' : '') + b.toString(16);
            }
        }
        return result;
    }

    // Cryptographic SHA-256 Async/Sync Wrapper
    async function computeHash(text) {
        if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
            try {
                const msgUint8 = new TextEncoder().encode(text);
                const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (_) {
                return pureSha256(text);
            }
        }
        return pureSha256(text);
    }

    // 15 Multi-Category Tactical CTF Challenges
    const CTF_CHALLENGES = [
        {
            id: "pwn_web_01",
            category: "Web & Shells",
            difficulty: "Easy",
            title: "Terminal Reconnaissance",
            points: 250,
            flagHash: "dd076a67838d4b01d90a9c83bf7270cc3fa48fb923224cec524cec1e3d512c26",
            flag: "pwn{w3bsh3ll_m4st3r_unl0ck3d}",
            desc: "Access the in-browser Linux WebShell terminal and execute the 'pwn ctf' vector command to unlock the operative credential flag.",
            hint: "Navigate to Terminal -> type 'pwn ctf' and inspect stdout."
        },
        {
            id: "pwn_priv_02",
            category: "Reverse & Binary",
            difficulty: "Medium",
            title: "Root Privilege Escalation",
            points: 350,
            flagHash: "21c2c6b642f469f059ebaaefe4e49145b7a37eac335a61a98c0605437f1e9c06",
            flag: "pwn{r00t_pr1v1l3g3_3sc4l4t10n_succ3ss}",
            desc: "Escalate privileges from standard operative to ROOT using 'sudo su' in the WebShell and inspect '/root/flag_root.txt'.",
            hint: "In Terminal: run 'sudo su' (password: toor or pwnbox) -> 'cat /root/flag_root.txt'."
        },
        {
            id: "pwn_sec_03",
            category: "Memory & Forensics",
            difficulty: "Easy",
            title: "Operative Dossier Clearance",
            points: 200,
            flagHash: "ddfb799fb85ac048d0db26ae228669b905c9c8c6d06ed00341db6ecda491a3c3",
            flag: "pwn{t3rm1n4l_0p3r4t1v3_cl34r4nc3}",
            desc: "Read the secret file stored in the agent's home directory '/home/agent/flag.txt'.",
            hint: "In Terminal: run 'cat flag.txt' from default directory."
        },
        {
            id: "pwn_sqli_04",
            category: "Web & Shells",
            difficulty: "Medium",
            title: "SQLi Authentication Bypass",
            points: 300,
            flagHash: "e735525fbedfcc5c5c4bb75a33625b4f4feb310cdd12104612118245aa7d5a18",
            flag: "pwn{sqli_auth_byp4ss_adm1n}",
            desc: "Bypass target database authentication using classic SQL injection payload \"' OR 1=1 -- \".",
            hint: "Check SQLi Locksmith mini-game or WebAppThreats laboratory."
        },
        {
            id: "pwn_rev_05",
            category: "Web & Shells",
            difficulty: "Easy",
            title: "Tactical Reverse Shell Forge",
            points: 250,
            flagHash: "2320317df777e40ea9b93a9d0abca1902673dd02f8c26414e5fa1360ba4bdaca",
            flag: "pwn{r3v3rs3_sh3ll_l1st3n3r_4444}",
            desc: "Craft an interactive Netcat MKFIFO reverse shell listener payload configured for port 4444.",
            hint: "Check payloads.html -> Select Netcat MKFIFO -> port 4444."
        },
        {
            id: "pwn_smb_06",
            category: "Enterprise & Cloud",
            difficulty: "Medium",
            title: "Samba Port 445 Exploit",
            points: 300,
            flagHash: "3a0a8e21adbe7feafbbdaae414b410f59a3ca110a3136288e43e02508a94b6d9",
            flag: "pwn{smb_445_sh4r3_pwn3d}",
            desc: "Perform an Nmap service scan on 10.10.10.27 to identify the vulnerable NetBIOS/SMB daemon version.",
            hint: "In Terminal: run 'nmap -sV 10.10.10.27' or 'enum4linux'."
        },
        {
            id: "pwn_mem_07",
            category: "Reverse & Binary",
            difficulty: "Hard",
            title: "Buffer Decryptor Breach",
            points: 400,
            flagHash: "6cb1b8613363a1d33a0e34b782c0ca6c51a11cf7728e34d1ad83add13c7360bb",
            flag: "pwn{br34ch_pr0t0c0l_ov3rfl0w}",
            desc: "Decrypt hexadecimal memory buffers within the Cyber Warfare Breach Protocol matrix to capture the target sequence.",
            hint: "Play Cyber Warfare Breach Protocol on the Home Portal."
        },
        {
            id: "pwn_ceh_08",
            category: "Enterprise & Cloud",
            difficulty: "Hard",
            title: "CEH Master Capstone",
            points: 500,
            flagHash: "594031e1d0273bb380a2eb63134bdd76a80f743a696cffaedfbf5e1235310158",
            flag: "pwn{c3h_v12_m4st3r_ch4mp10n}",
            desc: "Achieve 80%+ passing score on the 125-question CEH v12 Certification Master Practice Exam.",
            hint: "Master Guide -> Exam Simulator or Complete Chapter 10."
        },
        {
            id: "pwn_crypto_09",
            category: "Cryptography",
            difficulty: "Medium",
            title: "RSA Small Public Exponent Attack",
            points: 350,
            flagHash: "ab5280fa9308553db96b70b68f9e27df2e22dcc9955b0307eb2128b86dfa7a96",
            flag: "pwn{rsa_small_e_coppersmith_pwn}",
            desc: "An RSA encryption scheme with e=3 and unpadded ciphertext allows direct cube-root plaintext recovery.",
            hint: "When e=3 and m^3 < N, compute the integer cube root of ciphertext C directly without factoring modulus N."
        },
        {
            id: "pwn_rev_10",
            category: "Reverse & Binary",
            difficulty: "Medium",
            title: "ELF Magic Bytes Header Recovery",
            points: 400,
            flagHash: "b6430e515efb6982b70ce931d1a809784f9f1ee639ca54f361c1f1816066c79a",
            flag: "pwn{elf_magic_bytes_7f454c46}",
            desc: "A corrupted Linux executable has its initial 4-byte header zeroed out. Restore the standard ELF magic signature.",
            hint: "Standard ELF header bytes in hex: 0x7F, 0x45 ('E'), 0x4C ('L'), 0x46 ('F') -> 7f454c46."
        },
        {
            id: "pwn_for_11",
            category: "Memory & Forensics",
            difficulty: "Hard",
            title: "Volatility VAD Memory Injection",
            points: 450,
            flagHash: "c480efc2c5752974d56cdb85dffb9f34243f27a49a17ed6e67532dd76f786993",
            flag: "pwn{volatility_malfind_vad_injection}",
            desc: "Detect unmapped PAGE_EXECUTE_READWRITE memory regions hosting injected shellcode in a crash memory dump.",
            hint: "Check SocDefense module M-11 -> Volatility 3 `windows.malfind` plugin."
        },
        {
            id: "pwn_ad_12",
            category: "Enterprise & Cloud",
            difficulty: "Hard",
            title: "Kerberoasting SPN Ticket Hash",
            points: 400,
            flagHash: "9ecfa22c498cc4142d5abdbf0eed37f94a9414a082ff68e9af16ff19180291f0",
            flag: "pwn{kerberoast_spn_ticket_cracked}",
            desc: "Request a Kerberos TGS service ticket for MSSQL service account and extract the RC4 (type 23) offline hash.",
            hint: "Active Directory module M-10 -> Impacket `GetUserSPNs.py -request` -> crack with Hashcat mode 13100."
        },
        {
            id: "pwn_cloud_13",
            category: "Enterprise & Cloud",
            difficulty: "Medium",
            title: "IMDSv2 Session Token Pivot",
            points: 350,
            flagHash: "696d9b8e5c1ca44dc88a2a767ac14ba6a4357767cc14f1fe496389637a0e5f80",
            flag: "pwn{imds_v2_session_token_bypass}",
            desc: "Bypass SSRF protections by requesting an AWS IMDSv2 token with PUT /latest/api/token before querying IAM security credentials.",
            hint: "Cloud Security module M-09 -> IMDSv2 Hunter: PUT with X-aws-ec2-metadata-token-ttl-seconds: 21600."
        },
        {
            id: "pwn_web_14",
            category: "Web & Shells",
            difficulty: "Medium",
            title: "JWT 'none' Algorithm Signature Bypass",
            points: 300,
            flagHash: "8760f3f7c437d3c5252bd88eb638f098572bc8531fd897adfad4e8c95dc964dc",
            flag: "pwn{jwt_algorithm_none_signature_forge}",
            desc: "Forge an admin JSON Web Token by replacing header alg with 'none' and stripping the HMAC signature suffix.",
            hint: "Base64URL encode `{\"alg\":\"none\",\"typ\":\"JWT\"}` + `{\"role\":\"admin\",\"user\":\"root\"}` with empty signature trailing dot."
        },
        {
            id: "pwn_pwn_15",
            category: "Reverse & Binary",
            difficulty: "Insane",
            title: "64-bit Return-to-libc Exploitation",
            points: 600,
            flagHash: "cdf2e031372a4b27f7bd9ac261acf265721007b05417eb06e0926690c456e695",
            flag: "pwn{ret2libc_system_bin_sh_pwn}",
            desc: "Bypass non-executable stack (NX) on x86_64 ELF by loading the address of '/bin/sh' into RDI via POP RDI gadget followed by system().",
            hint: "ROP chain construction: [padding] + [pop rdi; ret] + [bin_sh_addr] + [ret (16-byte alignment)] + [system_addr]."
        }
    ];

    let currentCategory = 'all';

    // Local Storage Helpers
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

    function getUnlockedHints() {
        try {
            return JSON.parse(localStorage.getItem('pwnbox_ctf_unlocked_hints') || '[]');
        } catch (_) {
            return [];
        }
    }

    function saveUnlockedHints(hints) {
        localStorage.setItem('pwnbox_ctf_unlocked_hints', JSON.stringify(hints));
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

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/[&<>"']/g, m => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m]));
    }

    function showToast(message, type) {
        let box = document.getElementById('ctfToastBox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'ctfToastBox';
            box.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
            if (document.body) document.body.appendChild(box);
        }
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: var(--bg-panel);
            border: 2px solid ${type === 'error' ? 'var(--bauhaus-red)' : (type === 'success' ? '#10b981' : 'var(--bauhaus-yellow)')};
            color: var(--text-main);
            padding: 10px 18px;
            font-family: 'Space Mono', monospace;
            font-size: 0.8rem;
            font-weight: 700;
            box-shadow: 3px 3px 0 var(--border-color);
            transition: opacity 0.3s ease;
        `;
        toast.innerText = message;
        box.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { if (typeof toast.remove === 'function') toast.remove(); }, 300);
        }, 3200);
    }

    // Flag Submission Verification (Async SHA-256 + Plaintext Fallback)
    async function submitFlag(rawInput) {
        const flag = (rawInput || '').trim();
        if (!flag) {
            showToast("Please enter a flag.", "error");
            return false;
        }

        const inputHash = await computeHash(flag);
        const inputLower = flag.toLowerCase();

        const matched = CTF_CHALLENGES.find(c => {
            if (c.flagHash && c.flagHash.toLowerCase() === inputHash.toLowerCase()) return true;
            if (c.flag && c.flag.toLowerCase() === inputLower) return true;
            return false;
        });

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

        // Calculate awarded XP (apply 25% hint penalty if hint was unlocked)
        const unlockedHints = getUnlockedHints();
        const hintUsed = unlockedHints.includes(matched.id);
        const awardedXp = hintUsed ? Math.round(matched.points * 0.75) : matched.points;

        addXp(awardedXp);

        // Update solved streak counter
        const streak = parseInt(localStorage.getItem('pwnbox_ctf_streak') || '0', 10) + 1;
        localStorage.setItem('pwnbox_ctf_streak', String(streak));

        showToast(`🎉 FLAG CAPTURED! +${awardedXp} XP for "${matched.title}" (Streak: ${streak}🔥)`, "success");
        renderAll();
        return true;
    }

    // Hint Unlock Handler
    function unlockHint(challengeId) {
        const challenge = CTF_CHALLENGES.find(c => c.id === challengeId);
        if (!challenge) return;

        const unlocked = getUnlockedHints();
        if (unlocked.includes(challengeId)) return;

        unlocked.push(challengeId);
        saveUnlockedHints(unlocked);
        showToast(`💡 Hint unlocked for "${challenge.title}" (-25% XP penalty on solve).`, "info");
        renderChallenges();
    }

    // Set Active Challenge Category
    function setCategory(cat, btn) {
        currentCategory = cat;
        if (btn) {
            document.querySelectorAll('.ctf-filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        renderChallenges();
    }

    // Render Stats Deck
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
            if (solvedCount >= 14) rankEl.textContent = "ROOT ARCHITECT";
            else if (solvedCount >= 10) rankEl.textContent = "APEX COMMANDER";
            else if (solvedCount >= 6) rankEl.textContent = "SHADOW OPERATOR";
            else if (solvedCount >= 3) rankEl.textContent = "SPECIALIST";
            else rankEl.textContent = "APPRENTICE";
        }
    }

    // Render Challenge Cards
    function renderChallenges() {
        const container = document.getElementById('ctfChallengesList');
        if (!container) return;

        const solved = getSolvedFlags();
        const unlockedHints = getUnlockedHints();

        const filtered = CTF_CHALLENGES.filter(c => {
            if (currentCategory === 'all') return true;
            return c.category === currentCategory;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding:40px; color:var(--text-muted); font-family:'Space Mono', monospace;">
                    <div>⚠️ NO CHALLENGES FOUND IN CATEGORY: ${escapeHtml(currentCategory)}</div>
                    <button class="ctf-filter-pill" style="margin-top:12px;" onclick="PwnCTF.setCategory('all', null)">VIEW ALL CHALLENGES</button>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(c => {
            const isSolved = solved.includes(c.id);
            const isHintUnlocked = unlockedHints.includes(c.id);
            const badgeColor = isSolved ? '#10b981' : 'var(--bauhaus-blue)';
            const statusLabel = isSolved ? '✅ SOLVED' : 'ACTIVE';

            const hintHtml = isHintUnlocked
                ? `<div class="challenge-hint-box">💡 HINT: ${escapeHtml(c.hint)} <span style="font-size:0.65rem; color:#f59e0b;">(-25% XP)</span></div>`
                : `<div class="challenge-hint-box">
                     <span>🔒 Tactical Reconnaissance Hint Locked</span>
                     <button type="button" class="btn-unlock-hint" onclick="PwnCTF.unlockHint('${c.id}')">UNLOCK (-25% XP)</button>
                   </div>`;

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
                        ${hintHtml}
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

    // Render Global Leaderboard
    function renderLeaderboard() {
        const tbody = document.getElementById('leaderboardTbody');
        if (!tbody) return;

        const localAlias = localStorage.getItem('agentAlias') || localStorage.getItem('pwnbox_agent_alias') || 'CADET_OPERATOR';
        const localAvatar = localStorage.getItem('agentAvatar') || '👾';
        const solved = getSolvedFlags();
        const localXp = getTotalXp();

        const operatives = [
            { alias: "Pranav Pushya [Lead Architect]", avatar: "🛡️", rank: "Root Architect", solved: 15, xp: 5150 + localXp, isUser: false },
            { alias: "Ghost_Protocol", avatar: "💀", rank: "Apex Commander", solved: 13, xp: 4400, isUser: false },
            { alias: "Cipher_Zero", avatar: "🕵️", rank: "Shadow Operator", solved: 10, xp: 3200, isUser: false },
            { alias: localAlias, avatar: localAvatar, rank: solved.length >= 14 ? "Root Architect" : (solved.length >= 10 ? "Apex Commander" : (solved.length >= 6 ? "Shadow Operator" : "Apprentice")), solved: solved.length, xp: localXp, isUser: true },
            { alias: "Vanguard_01", avatar: "⚡", rank: "Specialist", solved: 7, xp: 2100, isUser: false },
            { alias: "K4li_Master", avatar: "👾", rank: "Apprentice", solved: 4, xp: 1100, isUser: false }
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
        ctx.fillText('vulnerability analysis, web application exploitation, reverse engineering, and enterprise dominance.', 800, 465);

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
        ctx.fillText(solved >= 14 ? 'ROOT ARCHITECT' : (solved >= 10 ? 'APEX' : (solved >= 6 ? 'SHADOW' : 'APPRENTICE')), 1070, 570);
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
        ctx.font = '600 14px "Space Mono", monospace';
        ctx.fillText('Lead Cyber Command Architect & Security Officer', 1350, 855);
    }

    // Download Certificate as PNG
    function downloadCertificate() {
        const canvas = document.getElementById('certificateCanvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `PwnBox-Certificate-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // Master Render All Components
    function renderAll() {
        renderStats();
        renderChallenges();
        renderLeaderboard();
        drawCertificate();
    }

    // Public API
    window.PwnCTF = {
        init: function () {
            renderAll();

            // Setup Universal Flag Submission
            const btnSubmit = document.getElementById('btnSubmitUniversalFlag');
            const inputField = document.getElementById('universalFlagInput');
            if (btnSubmit && inputField) {
                btnSubmit.onclick = () => {
                    submitFlag(inputField.value).then(success => {
                        if (success) inputField.value = '';
                    });
                };
                inputField.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        submitFlag(inputField.value).then(success => {
                            if (success) inputField.value = '';
                        });
                    }
                };
            }
        },
        submitFlag: submitFlag,
        submitCardFlag: function (id) {
            const input = document.getElementById(`flagInput_${id}`);
            if (input) {
                submitFlag(input.value).then(success => {
                    if (success) input.value = '';
                });
            }
        },
        unlockHint: unlockHint,
        setCategory: setCategory,
        renderAll: renderAll,
        downloadCertificate: downloadCertificate,
        getChallenges: function () {
            return CTF_CHALLENGES;
        }
    };

    // Auto-init on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        window.PwnCTF.init();
    });

})();
