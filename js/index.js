function updateDashboardStats() {
            const modules = [
                {
                    key: 'footprinting',
                    completedKey: 'module_footprinting_completed',
                    cardId: 'moduleFootprinting',
                    badgeId: 'footprintingBadge',
                    actionsId: null,
                    url: 'modules/Footprinting.html',
                    toolsText: '🌐 22+ Tools Loaded',
                    nodeId: 'node1'
                },
                {
                    key: 'scanning',
                    completedKey: 'module_scanning_completed',
                    cardId: 'moduleScanning',
                    badgeId: 'scanningBadge',
                    actionsId: 'scanningActions',
                    url: 'modules/Scanning.html',
                    toolsText: '🌐 15+ Tools Loaded',
                    nodeId: 'node2'
                },
                {
                    key: 'enumeration',
                    completedKey: 'module_enumeration_completed',
                    cardId: 'moduleEnumeration',
                    badgeId: 'enumerationBadge',
                    actionsId: 'enumerationActions',
                    url: 'modules/Enumeration.html',
                    toolsText: '🌐 8+ Tools Loaded',
                    nodeId: 'node3'
                },
                {
                    key: 'vulnanalysis',
                    completedKey: 'module_vulnanalysis_completed',
                    cardId: 'moduleVulnAnalysis',
                    badgeId: 'vulnAnalysisBadge',
                    actionsId: 'vulnAnalysisActions',
                    url: 'modules/Vulnerablity.html',
                    toolsText: '🌐 5+ Tools Loaded',
                    nodeId: 'node4'
                },
                {
                    key: 'systemhacking',
                    completedKey: 'module_systemhacking_completed',
                    cardId: 'moduleSystemHacking',
                    badgeId: 'systemHackingBadge',
                    actionsId: 'systemHackingActions',
                    url: 'modules/SystemHacking.html',
                    toolsText: '🌐 6+ Tools Loaded',
                    nodeId: 'node5'
                },
                {
                    key: 'webapp',
                    completedKey: 'module_webapp_completed',
                    cardId: 'moduleWebApp',
                    badgeId: 'webAppBadge',
                    actionsId: 'webAppActions',
                    url: 'modules/WebAppThreats.html',
                    toolsText: '🌐 6+ Tools Loaded',
                    nodeId: 'node6'
                },
                {
                    key: 'osint',
                    completedKey: 'module_osint_completed',
                    cardId: 'moduleOsint',
                    badgeId: 'osintBadge',
                    actionsId: null,
                    url: 'modules/OSINT.html',
                    toolsText: '🛰️ 24 Tools Loaded',
                    nodeId: 'node7'
                }
            ];

            let completedCount = 0;
            modules.forEach(mod => {
                const isCompleted = localStorage.getItem(mod.completedKey) === 'true';
                mod.isCompleted = isCompleted;
                if (isCompleted) {
                    completedCount++;
                }
            });

            modules.forEach((mod, index) => {
                mod.isUnlocked = true;
            });

            // Set active/completed/locked cards and nodes
            modules.forEach((mod, index) => {
                const cardEl = document.getElementById(mod.cardId);
                const badgeEl = document.getElementById(mod.badgeId);
                const actionsEl = mod.actionsId ? document.getElementById(mod.actionsId) : cardEl.querySelector('.card-bottom');
                const nodeEl = document.getElementById(mod.nodeId);

                if (mod.isCompleted) {
                    cardEl.className = "module-card completed";
                    badgeEl.className = "module-badge badge-completed";
                    badgeEl.innerText = "Completed ✓";
                    if (actionsEl) {
                        actionsEl.innerHTML = `<span class="module-meta">${mod.toolsText}</span><a href="${mod.url}" class="btn-launch">Launch Module ↗</a>`;
                    }
                    nodeEl.className = "node completed";
                    nodeEl.onclick = () => { window.location.href = mod.url; };
                    nodeEl.style.cursor = 'pointer';
                } else if (mod.isUnlocked) {
                    cardEl.className = "module-card active";
                    badgeEl.className = "module-badge badge-active";
                    badgeEl.innerText = "Active";
                    if (actionsEl) {
                        actionsEl.innerHTML = `<span class="module-meta">${mod.toolsText}</span><a href="${mod.url}" class="btn-launch">Launch Module ↗</a>`;
                    }
                    nodeEl.className = "node active";
                    nodeEl.onclick = () => { window.location.href = mod.url; };
                    nodeEl.style.cursor = 'pointer';
                } else {
                    cardEl.className = "module-card locked";
                    badgeEl.className = "module-badge badge-locked";
                    badgeEl.innerText = "Locked";
                    if (actionsEl) {
                        actionsEl.innerHTML = `<span class="module-meta">🔒 Pre-req: Module 0${index}</span><button class="btn-locked"><span class="lock-icon">🔒</span> Locked</button>`;
                    }
                    nodeEl.className = "node locked";
                    nodeEl.onclick = null;
                    nodeEl.style.cursor = 'not-allowed';
                }
            });

            const toolModules = [
                { defaultCount: 22, customKey: 'custom_tools', deletedKey: 'deleted_default_indices', catKey: 'custom_categories' },
                { defaultCount: 15, customKey: 'scanning_custom_tools', deletedKey: 'scanning_deleted_default_indices', catKey: 'scanning_custom_categories' },
                { defaultCount: 8, customKey: 'enumeration_custom_tools', deletedKey: 'enumeration_deleted_default_indices', catKey: 'enumeration_custom_categories' },
                { defaultCount: 5, customKey: 'vuln_custom_tools', deletedKey: 'vuln_deleted_default_indices', catKey: 'vuln_custom_categories' },
                { defaultCount: 6, customKey: 'sys_custom_tools', deletedKey: 'sys_deleted_default_indices', catKey: 'sys_custom_categories' },
                { defaultCount: 6, customKey: 'webapp_custom_tools', deletedKey: 'webapp_deleted_default_indices', catKey: 'webapp_custom_categories' },
                { defaultCount: 24, customKey: 'osint_custom_tools', deletedKey: 'osint_deleted_default_indices', catKey: 'osint_custom_categories' }
            ];

            const osintCard = document.getElementById('moduleOsint');
            const osintBadge = document.getElementById('osintBadge');
            if (osintCard && osintBadge) {
                const isOsintCompleted = localStorage.getItem('module_osint_completed') === 'true';
                if (isOsintCompleted) {
                    osintCard.className = "module-card active completed";
                    osintBadge.className = "module-badge badge-completed";
                    osintBadge.innerText = "Completed ✓";
                } else {
                    osintCard.className = "module-card active";
                    osintBadge.className = "module-badge badge-active";
                    osintBadge.innerText = "Bonus";
                }
            }

            let totalTools = 0;
            let totalCustomTools = 0;
            let totalCategories = 4; // Base categories is 4

            toolModules.forEach(tm => {
                let customCount = 0;
                try {
                    const stored = localStorage.getItem(tm.customKey);
                    if (stored) customCount = JSON.parse(stored).length;
                } catch(e){}
                totalCustomTools += customCount;

                let deletedCount = 0;
                try {
                    const stored = localStorage.getItem(tm.deletedKey);
                    if (stored) deletedCount = JSON.parse(stored).length;
                } catch(e){}

                totalTools += (tm.defaultCount - deletedCount + customCount);

                let catCount = 0;
                try {
                    const stored = localStorage.getItem(tm.catKey);
                    if (stored) catCount = Object.keys(JSON.parse(stored)).length;
                } catch(e){}
                totalCategories += catCount;
            });

            document.getElementById('toolsMasteredCount').innerText = totalTools;
            document.getElementById('customToolsCount').innerText = totalCustomTools;
            document.getElementById('categoriesCount').innerText = totalCategories;

            const progressFill = document.getElementById('overallProgressBar');
            const progressText = document.getElementById('overallProgressText');
            const completedCountEl = document.getElementById('completedModulesCount');
            const userRank = document.getElementById('userRank');
            const roadmapLine = document.getElementById('roadmapProgressLine');

            completedCountEl.innerText = `${completedCount} / 7`;
            const pct = Math.round((completedCount / 7) * 100);
            progressText.innerText = `${pct}% Done`;
            progressFill.style.width = `${Math.min(100, Math.round((completedCount / 7) * 100))}%`;

            const rankNames = [
                "Apprentice",
                "Scout (Recon Master)",
                "Infiltrator (Network Specialist)",
                "Specialist (System Mapper)",
                "Assessor (Vulnerability Analyst)",
                "Operator (Privilege Escalator)",
                "Elite Agent (Full Methodologist)"
            ];
            
            const isGodMode = localStorage.getItem('pwnbox_godmode_badge') === 'true';
            const dropdownRank = document.getElementById('dropdownRank');

            if (isGodMode) {
                userRank.innerHTML = '<span class="godmode-rank-badge">👑 ROOT ARCHITECT</span>';
                if (dropdownRank) {
                    dropdownRank.innerHTML = '<span class="godmode-rank-badge">👑 ROOT ARCHITECT (GODMODE)</span>';
                }
                const profileCard = document.querySelector('.id-card-inner');
                if (profileCard) profileCard.classList.add('godmode-hologram-active');
            } else {
                userRank.innerText = rankNames[completedCount];
                if (dropdownRank) {
                    dropdownRank.innerText = userRank.innerText;
                }
                const profileCard = document.querySelector('.id-card-inner');
                if (profileCard) profileCard.classList.remove('godmode-hologram-active');
            }

            // GodMode Perk: Grant Bypass Launch on locked curriculum modules
            if (isGodMode) {
                const moduleUrlMap = {
                    'moduleScanning': 'modules/Scanning.html',
                    'moduleEnumeration': 'modules/Enumeration.html',
                    'moduleVulnAnalysis': 'modules/Vulnerablity.html',
                    'moduleSystemHacking': 'modules/SystemHacking.html',
                    'moduleWebApp': 'modules/WebAppThreats.html'
                };
                modules.forEach(m => {
                    if (!m.isCompleted) {
                        const card = document.getElementById(m.cardId);
                        const actions = document.getElementById(m.actionsId);
                        const url = moduleUrlMap[m.cardId];
                        if (card && actions && url && !card.classList.contains('active')) {
                            actions.innerHTML = `<span class="module-meta" style="color: #facc15;">👑 GodMode Bypass</span><a href="${url}" class="btn-launch" style="background: linear-gradient(135deg, #facc15, #f59e0b); color: #000; font-weight: 800; border: 2px solid #000; box-shadow: 2px 2px 0 #000;">⚡ Bypass Launch ↗</a>`;
                        }
                    }
                });
            }

            // Update Agent ID Card Details
            const nextMissionTitles = [
                "Complete Recon & Footprinting",
                "Complete Network Scanning",
                "Complete System Enumeration",
                "Complete Vulnerability Analysis",
                "Complete System Hacking",
                "Complete Web App Threats",
                "All Objectives Completed!"
            ];
            const nextMissionText = document.getElementById('nextMissionText');
            if (nextMissionText) {
                nextMissionText.innerText = isGodMode ? "👑 All Operations Cleared (GodMode)" : (nextMissionTitles[completedCount] || "All Objectives Completed!");
            }
            const nextMissionProgress = document.getElementById('nextMissionProgress');
            if (nextMissionProgress) {
                if (completedCount >= 7 || isGodMode) nextMissionProgress.style.width = '100%';
                else nextMissionProgress.style.width = '15%'; // Just a small stub to show it's active
            }

            setTimeout(() => {
                const bgLine = document.getElementById('roadmapBgLine');
                if (bgLine) {
                    const bgWidth = bgLine.getBoundingClientRect().width;
                    const segmentWidth = bgWidth / 6;
                    let completedSequence = 0;
                    for (let i = 0; i < modules.length; i++) {
                        if (modules[i].isCompleted) {
                            completedSequence++;
                        } else {
                            break;
                        }
                    }
                    roadmapLine.setAttribute('d', `M 50,60 L ${50 + completedSequence * segmentWidth},60`);
                }
            }, 100);
        }

        function toggleProfileDropdown(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('profileDropdown');
            dropdown.classList.toggle('active');
        }

        function resetAllProgress(e) {
            if (e) e.stopPropagation();
            document.getElementById('resetModalOverlay').classList.add('active');
        }

        function closeResetModal() {
            document.getElementById('resetModalOverlay').classList.remove('active');
        }

        function executeResetProgress() {
            // Footprinting / General
            localStorage.removeItem('module_footprinting_completed');
            localStorage.removeItem('custom_tools');
            localStorage.removeItem('edited_default_tools');
            localStorage.removeItem('deleted_default_indices');
            localStorage.removeItem('custom_categories');
            localStorage.removeItem('recon_ctf_flag_1');
            localStorage.removeItem('recon_ctf_flag_2');
            localStorage.removeItem('recon_ctf_flag_3');
            localStorage.removeItem('recon_ctf_completed');

            // Scanning
            localStorage.removeItem('module_scanning_completed');
            localStorage.removeItem('scanning_custom_tools');
            localStorage.removeItem('scanning_edited_default_tools');
            localStorage.removeItem('scanning_deleted_default_indices');
            localStorage.removeItem('scanning_custom_categories');
            localStorage.removeItem('scanning_quiz_q1');
            localStorage.removeItem('scanning_quiz_q2');
            localStorage.removeItem('scanning_quiz_q3');
            localStorage.removeItem('scanning_quiz_completed');

            // Enumeration
            localStorage.removeItem('module_enumeration_completed');
            localStorage.removeItem('enumeration_custom_tools');
            localStorage.removeItem('enumeration_edited_default_tools');
            localStorage.removeItem('enumeration_deleted_default_indices');
            localStorage.removeItem('enumeration_custom_categories');
            localStorage.removeItem('enumeration_quiz_q1');
            localStorage.removeItem('enumeration_quiz_q2');
            localStorage.removeItem('enumeration_quiz_q3');
            localStorage.removeItem('enumeration_quiz_completed');

            // Vulnerability Analysis
            localStorage.removeItem('module_vulnanalysis_completed');
            localStorage.removeItem('vuln_custom_tools');
            localStorage.removeItem('vuln_edited_default_tools');
            localStorage.removeItem('vuln_deleted_default_indices');
            localStorage.removeItem('vuln_custom_categories');
            localStorage.removeItem('vuln_quiz_q1');
            localStorage.removeItem('vuln_quiz_q2');
            localStorage.removeItem('vuln_quiz_q3');
            localStorage.removeItem('vuln_quiz_completed');

            // System Hacking
            localStorage.removeItem('module_systemhacking_completed');
            localStorage.removeItem('sys_custom_tools');
            localStorage.removeItem('sys_edited_default_tools');
            localStorage.removeItem('sys_deleted_default_indices');
            localStorage.removeItem('sys_custom_categories');
            localStorage.removeItem('sys_quiz_q1');
            localStorage.removeItem('sys_quiz_q2');
            localStorage.removeItem('sys_quiz_q3');
            localStorage.removeItem('sys_quiz_completed');

            // Web App Threats
            localStorage.removeItem('module_webapp_completed');
            localStorage.removeItem('webapp_custom_tools');
            localStorage.removeItem('webapp_edited_default_tools');
            localStorage.removeItem('webapp_deleted_default_indices');
            localStorage.removeItem('webapp_custom_categories');
            localStorage.removeItem('webapp_quiz_q1');
            localStorage.removeItem('webapp_quiz_q2');
            localStorage.removeItem('webapp_quiz_q3');
            localStorage.removeItem('webapp_quiz_completed');

            // OSINT & Threat Intel
            localStorage.removeItem('module_osint_completed');
            localStorage.removeItem('osint_custom_tools');
            localStorage.removeItem('osint_edited_default_tools');
            localStorage.removeItem('osint_deleted_default_indices');
            localStorage.removeItem('osint_custom_categories');

            // Module 08: Black Ops (Re-Lock & Reset)
            localStorage.removeItem('pwnbox_m08_unlocked');
            localStorage.removeItem('module_blackops_completed');
            localStorage.removeItem('blackops_custom_tools');

            // Hide dropdown
            document.getElementById('profileDropdown').classList.remove('active');
            
            // Hide modal
            closeResetModal();

            // Refresh dashboard stats & lock Module 08
            updateDashboardStats();
            updateModule08State();
        }

        function toggleCheatSheetDrawer(e) {
            if (e) e.stopPropagation();
            const overlay = document.getElementById('drawerOverlay');
            const drawer = document.getElementById('cheatDrawer');
            if (!drawer || !overlay) return;
            
            if (drawer.classList.contains('active')) {
                drawer.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                drawer.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        // --- SECRET GATEWAY: CHEAT SHEET VIA CTRL + C KEYSTROKE ---
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
                const activeTag = document.activeElement ? document.activeElement.tagName : '';
                const hasSelection = window.getSelection() && window.getSelection().toString().trim().length > 0;
                // If user is inside an input/textarea or actively highlighting text to copy, don't hijack
                if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || hasSelection) {
                    return;
                }
                e.preventDefault();
                toggleCheatSheetDrawer();
            }
        });

        function copyCheatCommand(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const origText = btn.innerText;
                btn.innerText = "✓";
                btn.style.color = "#34d399";
                setTimeout(() => {
                    btn.innerText = origText;
                    btn.style.color = "";
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }

        let currentAvatar = localStorage.getItem('agentAvatar') || 'INITIAL';
        let currentAlias = localStorage.getItem('agentAlias') || localStorage.getItem('pwnbox_user_name') || localStorage.getItem('pwnbox_agent_alias') || '';

        function getDisplayAvatar() {
            if (currentAvatar === 'INITIAL') {
                return currentAlias ? currentAlias.charAt(0).toUpperCase() : '?';
            }
            return currentAvatar;
        }

        function loadProfile() {
            const avatarEl = document.getElementById('headerAvatar');
            if (avatarEl) {
                const displayAlias = currentAlias || 'UNKNOWN AGENT';
                const displayAvatar = getDisplayAvatar();
                
                avatarEl.innerText = displayAvatar;
                document.getElementById('largeAvatar').innerText = displayAvatar;
                document.getElementById('headerName').innerText = displayAlias;
                document.getElementById('profileNameDisplay').innerText = displayAlias;
                const dropdownNameEl = document.getElementById('dropdownName');
                if (dropdownNameEl) dropdownNameEl.innerText = displayAlias;
                document.getElementById('editAliasInput').value = currentAlias || displayAlias;

                const photo = localStorage.getItem('pwnbox_user_photo');
                if (photo && currentAvatar === 'INITIAL') {
                    avatarEl.innerHTML = `<img src="${photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="Avatar">`;
                    document.getElementById('largeAvatar').innerHTML = `<img src="${photo}" style="width:100%;height:100%;border-radius:4px;object-fit:cover;" alt="Avatar">`;
                }

                const initialChoice = document.getElementById('initialAvatarChoice');
                if (initialChoice) {
                    initialChoice.innerText = currentAlias ? currentAlias.charAt(0).toUpperCase() : '?';
                }

                const spans = document.querySelectorAll('#avatarSelector span');
                spans.forEach(span => {
                    if (currentAvatar === 'INITIAL' && span.id === 'initialAvatarChoice') {
                        span.classList.add('selected');
                    } else if (span.innerText === currentAvatar && span.id !== 'initialAvatarChoice') {
                        span.classList.add('selected');
                    } else {
                        span.classList.remove('selected');
                    }
                });
            }
        }

        function selectAvatar(icon, el) {
            currentAvatar = icon;
            const spans = document.querySelectorAll('#avatarSelector span');
            spans.forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');
        }

        function saveProfile(e) {
            e.stopPropagation();
            currentAlias = document.getElementById('editAliasInput').value.trim();
            localStorage.setItem('agentAlias', currentAlias);
            localStorage.setItem('pwnbox_agent_alias', currentAlias);
            localStorage.setItem('userAlias', currentAlias);
            localStorage.setItem('agentAvatar', currentAvatar);
            loadProfile();
            document.getElementById('profileDropdown').classList.remove('active');
        }

        // Close dropdown & drawer when clicking outside
        window.addEventListener('click', (e) => {
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.user-profile')) {
                dropdown.classList.remove('active');
            }

            const drawer = document.getElementById('cheatDrawer');
            const drawerButton = e.target.closest('button');
            if (drawer && drawer.classList.contains('active') && !drawer.contains(e.target) && (!drawerButton || !drawerButton.innerText.includes('Cheat Sheet'))) {
                drawer.classList.remove('active');
                document.getElementById('drawerOverlay').classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        window.addEventListener('load', () => {
            loadProfile();
            updateDashboardStats();
            updateModule08State();
            window.addEventListener('resize', updateDashboardStats);
        });

// Master Guide Secret Door (Double-click / Double-tap handler)
let logoDoorClicks = 0;
let logoDoorTimer = null;

function navigateToMasterGuide() {
    window.location.href = 'masterguide/masterguide_ch1.html';
}

function handleLogoDoorClick() {
    logoDoorClicks++;
    if (logoDoorClicks === 1) {
        logoDoorTimer = setTimeout(() => {
            logoDoorClicks = 0;
        }, 400);
    } else if (logoDoorClicks >= 2) {
        clearTimeout(logoDoorTimer);
        logoDoorClicks = 0;
        navigateToMasterGuide();
    }
}

// --- SECRET GATEWAY 1: MODULE 08 BLACK OPS UNLOCK (STRICTLY SKULL 3X CLICK) ---
let skullTriggerClicks = 0;
let skullTriggerTimer = null;

function unlockModule08(shouldScroll = true) {
    localStorage.setItem('pwnbox_m08_unlocked', 'true');
    updateModule08State();
    const card = document.getElementById('moduleBlackOps');
    if (card && shouldScroll) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.transition = 'all 0.4s ease';
        card.style.boxShadow = '0 0 35px #9333ea, 6px 6px 0 #9333ea';
        card.style.borderColor = '#c084fc';
        setTimeout(() => {
            card.style.boxShadow = '';
            card.style.borderColor = '';
        }, 2500);
    }
}

function updateModule08State() {
    const card = document.getElementById('moduleBlackOps');
    if (!card) return;

    const isUnlocked = localStorage.getItem('pwnbox_m08_unlocked') === 'true';
    const isCompleted = localStorage.getItem('module_blackops_completed') === 'true';

    if (isUnlocked) {
        card.style.display = 'flex';
        card.className = "module-card active" + (isCompleted ? " completed" : "");
        const badge = document.getElementById('blackOpsBadge');
        const title = document.getElementById('blackOpsTitle');
        const desc = document.getElementById('blackOpsDesc');
        const actions = document.getElementById('blackOpsActions');

        if (badge) {
            badge.style.background = isCompleted ? "#10b981" : "#9333ea";
            badge.textContent = isCompleted ? "COMPLETED ✓" : "SECRET UNLOCKED";
        }
        if (title) title.textContent = "Black Ops & C2 Evasion";
        if (desc) desc.textContent = "Classified Red Team adversary simulation: Cobalt Strike & Havoc C2 beaconing, memory AMSI bypasses, LOLBins, and Kerberos lateral movement.";
        if (actions) {
            actions.innerHTML = `<span class="module-meta" style="color: #9333ea;">🕵️‍♂️ 6 Stealth Tools</span><a href="modules/BlackOps.html" class="btn-launch" style="background: #9333ea; color: #fff;">Launch Module ↗</a>`;
        }
    } else {
        // Must NOT be visible at all until skull is pressed 3 times
        card.style.display = 'none';
    }
}

function checkDashboardGodModeHUD() {
    if (localStorage.getItem('pwnbox_godmode_badge') === 'true') {
        let hud = document.getElementById('godmodeFloatingHud');
        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'godmodeFloatingHud';
            hud.className = 'godmode-hud-indicator';
            hud.innerHTML = `
                <span class="godmode-pulse-dot"></span>
                <span>👑 ROOT ARCHITECT // GODMODE ACTIVE</span>
            `;
            hud.title = "Security Clearance: OMEGA-0 (Unrestricted Bypass Active)";
            hud.addEventListener('click', () => {
                if (window.showCustomAlert) {
                    window.showCustomAlert(
                        "👑 ROOT ARCHITECT CLEARANCE",
                        "Architect GodMode is active across the academy. All curriculum tracks have bypass authorization, and your operative rank is elevated to Root Architect.",
                        "success"
                    );
                }
            });
            document.body.appendChild(hud);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateModule08State();
    checkDashboardGodModeHUD();
    const skullTrigger = document.getElementById('secretM08Trigger');
    if (skullTrigger) {
        skullTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            skullTriggerClicks++;
            skullTrigger.style.transform = 'scale(1.35)';
            skullTrigger.style.color = '#ef4444';
            skullTrigger.style.opacity = '1';
            setTimeout(() => {
                skullTrigger.style.transform = 'scale(1)';
                skullTrigger.style.color = '';
                skullTrigger.style.opacity = '0.4';
            }, 250);

            if (skullTriggerClicks === 1) {
                skullTriggerTimer = setTimeout(() => { skullTriggerClicks = 0; }, 1000);
            } else if (skullTriggerClicks >= 3) {
                clearTimeout(skullTriggerTimer);
                skullTriggerClicks = 0;
                unlockModule08(true);
            }
        });
    }
});
