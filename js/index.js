function handleProtectedModuleLaunch(e, targetUrl) {
    const isAuth = localStorage.getItem('pwnbox_is_authenticated') === 'true';
    if (!isAuth) {
        // Inform user they are in Guest Mode with local progress tracking
        if (typeof window.tacticalToast === 'function') {
            window.tacticalToast("Cadet Guest Mode active. Progress saved locally; sign in anytime for cloud sync.", "info");
        }
    }
    if (targetUrl) {
        if (window.location.pathname.includes('/pages/') && !targetUrl.startsWith('../') && !targetUrl.startsWith('/') && !targetUrl.startsWith('http')) {
            targetUrl = '../' + targetUrl;
        }
        window.location.href = targetUrl;
    }
    return true;
}
window.handleProtectedModuleLaunch = handleProtectedModuleLaunch;

function updateDashboardStats() {
            const isM08Unlocked = localStorage.getItem('pwnbox_is_authenticated') === 'true' && localStorage.getItem('pwnbox_m08_unlocked') === 'true';

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
                    url: 'modules/Vulnerability.html',
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
                },
                {
                    key: 'blackops',
                    completedKey: 'module_blackops_completed',
                    cardId: 'moduleBlackOps',
                    badgeId: 'blackOpsBadge',
                    actionsId: 'blackOpsActions',
                    url: 'modules/BlackOps.html',
                    toolsText: '🕵️‍♂️ 6 Stealth Tools',
                    nodeId: 'node8'
                },
                {
                    key: 'cloudsec',
                    completedKey: 'module_cloudsec_completed',
                    cardId: 'moduleCloudSec',
                    badgeId: 'cloudSecBadge',
                    actionsId: null,
                    url: 'modules/CloudSecurity.html',
                    toolsText: '☁️ 7 Cloud Tools',
                    nodeId: 'node9'
                },
                {
                    key: 'activedirectory',
                    completedKey: 'module_activedirectory_completed',
                    cardId: 'moduleActiveDirectory',
                    badgeId: 'adBadge',
                    actionsId: null,
                    url: 'modules/ActiveDirectory.html',
                    toolsText: '🏰 7 AD Tools',
                    nodeId: 'node10'
                },
                {
                    key: 'socdefense',
                    completedKey: 'module_socdefense_completed',
                    cardId: 'moduleSocDefense',
                    badgeId: 'socBadge',
                    actionsId: null,
                    url: 'modules/SocDefense.html',
                    toolsText: '🛡️ 7 Defense Tools',
                    nodeId: 'node11'
                },
                {
                    key: 'iotsecurity',
                    completedKey: 'module_iotsecurity_completed',
                    cardId: 'moduleIoTSecurity',
                    badgeId: 'iotBadge',
                    actionsId: null,
                    url: 'modules/IoTSecurity.html',
                    toolsText: '📟 7 IoT Tools',
                    nodeId: 'node12'
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
                const actionsEl = mod.actionsId ? document.getElementById(mod.actionsId) : (cardEl ? cardEl.querySelector('.card-bottom') : null);
                const nodeEl = document.getElementById(mod.nodeId);

                if (!cardEl) return;

                if (mod.isCompleted) {
                    cardEl.className = "module-card completed";
                    if (badgeEl) {
                        badgeEl.className = "module-badge badge-completed";
                        badgeEl.innerText = "Completed ✓";
                    }
                    if (actionsEl) {
                        actionsEl.innerHTML = `<span class="module-meta">${mod.toolsText}</span><a href="${mod.url}" class="btn-launch" onclick="handleProtectedModuleLaunch(event, '${mod.url}')">Launch Module ↗</a>`;
                    }
                    if (nodeEl) {
                        nodeEl.className = "node completed";
                        nodeEl.onclick = (e) => { handleProtectedModuleLaunch(e, mod.url); };
                        nodeEl.style.cursor = 'pointer';
                    }
                } else if (mod.isUnlocked) {
                    cardEl.className = "module-card active";
                    if (badgeEl) {
                        badgeEl.className = "module-badge badge-active";
                        if (mod.key === 'blackops') {
                            badgeEl.style.background = "#9333ea";
                            badgeEl.style.color = "#fff";
                            badgeEl.innerText = "Red Team Track";
                        } else if (mod.key === 'osint') {
                            badgeEl.innerText = "Bonus";
                        } else if (mod.key === 'cloudsec') {
                            badgeEl.style.background = "#0284c7";
                            badgeEl.style.color = "#fff";
                            badgeEl.innerText = "Cloud Track";
                        } else if (mod.key === 'activedirectory') {
                            badgeEl.style.background = "#ea580c";
                            badgeEl.style.color = "#fff";
                            badgeEl.innerText = "Enterprise Track";
                        } else if (mod.key === 'socdefense') {
                            badgeEl.style.background = "#10b981";
                            badgeEl.style.color = "#000";
                            badgeEl.innerText = "Blue Team Track";
                        } else if (mod.key === 'iotsecurity') {
                            badgeEl.style.background = "#f59e0b";
                            badgeEl.style.color = "#000";
                            badgeEl.innerText = "Hardware Track";
                        } else {
                            badgeEl.innerText = "Active";
                        }
                    }
                    if (actionsEl) {
                        let btnStyle = '';
                        if (mod.key === 'blackops') btnStyle = ' style="background: #9333ea; color: #fff;"';
                        else if (mod.key === 'cloudsec') btnStyle = ' style="background: #0284c7; color: #fff;"';
                        else if (mod.key === 'activedirectory') btnStyle = ' style="background: #ea580c; color: #fff;"';
                        else if (mod.key === 'socdefense') btnStyle = ' style="background: #10b981; color: #000; font-weight: 800;"';
                        else if (mod.key === 'iotsecurity') btnStyle = ' style="background: #f59e0b; color: #000; font-weight: 800;"';
                        actionsEl.innerHTML = `<span class="module-meta">${mod.toolsText}</span><a href="${mod.url}" class="btn-launch"${btnStyle} onclick="handleProtectedModuleLaunch(event, '${mod.url}')">Launch Module ↗</a>`;
                    }
                    if (nodeEl) {
                        nodeEl.className = "node active";
                        nodeEl.onclick = (e) => { handleProtectedModuleLaunch(e, mod.url); };
                        nodeEl.style.cursor = 'pointer';
                    }
                } else {
                    cardEl.className = "module-card locked";
                    if (badgeEl) {
                        badgeEl.className = "module-badge badge-locked";
                        badgeEl.innerText = "Locked";
                    }
                    if (actionsEl) {
                        actionsEl.innerHTML = `<span class="module-meta">🔒 Pre-req: Module 0${index}</span><button class="btn-locked"><span class="lock-icon">🔒</span> Locked</button>`;
                    }
                    if (nodeEl) {
                        nodeEl.className = "node locked";
                        nodeEl.onclick = null;
                        nodeEl.style.cursor = 'not-allowed';
                    }
                }
            });

            const toolModules = [
                { defaultCount: 22, customKey: 'custom_tools', deletedKey: 'deleted_default_indices', catKey: 'custom_categories' },
                { defaultCount: 15, customKey: 'scanning_custom_tools', deletedKey: 'scanning_deleted_default_indices', catKey: 'scanning_custom_categories' },
                { defaultCount: 8, customKey: 'enumeration_custom_tools', deletedKey: 'enumeration_deleted_default_indices', catKey: 'enumeration_custom_categories' },
                { defaultCount: 5, customKey: 'vuln_custom_tools', deletedKey: 'vuln_deleted_default_indices', catKey: 'vuln_custom_categories' },
                { defaultCount: 6, customKey: 'sys_custom_tools', deletedKey: 'sys_deleted_default_indices', catKey: 'sys_custom_categories' },
                { defaultCount: 6, customKey: 'webapp_custom_tools', deletedKey: 'webapp_deleted_default_indices', catKey: 'webapp_custom_categories' },
                { defaultCount: 24, customKey: 'osint_custom_tools', deletedKey: 'osint_deleted_default_indices', catKey: 'osint_custom_categories' },
                { defaultCount: 6, customKey: 'blackops_custom_tools', deletedKey: 'blackops_deleted_default_indices', catKey: 'blackops_custom_categories' },
                { defaultCount: 7, customKey: 'cloudsec_custom_tools', deletedKey: 'cloudsec_deleted_default_indices', catKey: 'cloudsec_custom_categories' },
                { defaultCount: 7, customKey: 'ad_custom_tools', deletedKey: 'ad_deleted_default_indices', catKey: 'ad_custom_categories' },
                { defaultCount: 7, customKey: 'soc_custom_tools', deletedKey: 'soc_deleted_default_indices', catKey: 'soc_custom_categories' },
                { defaultCount: 7, customKey: 'pwnbox_custom_tools_IoTSecurity', deletedKey: 'pwnbox_deleted_tools_IoTSecurity', catKey: 'pwnbox_custom_cats_IoTSecurity' }
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

            const cloudCard = document.getElementById('moduleCloudSec');
            const cloudBadge = document.getElementById('cloudSecBadge');
            if (cloudCard && cloudBadge) {
                if (localStorage.getItem('module_cloudsec_completed') === 'true') {
                    cloudCard.classList.add('completed');
                    cloudBadge.className = "module-badge badge-completed";
                    cloudBadge.innerText = "Completed ✓";
                }
            }

            const adCard = document.getElementById('moduleActiveDirectory');
            const adBadge = document.getElementById('adBadge');
            if (adCard && adBadge) {
                if (localStorage.getItem('module_activedirectory_completed') === 'true') {
                    adCard.classList.add('completed');
                    adBadge.className = "module-badge badge-completed";
                    adBadge.innerText = "Completed ✓";
                }
            }

            const socCard = document.getElementById('moduleSocDefense');
            const socBadge = document.getElementById('socBadge');
            if (socCard && socBadge) {
                if (localStorage.getItem('module_socdefense_completed') === 'true') {
                    socCard.classList.add('completed');
                    socBadge.className = "module-badge badge-completed";
                    socBadge.innerText = "Completed ✓";
                }
            }

            const iotCard = document.getElementById('moduleIoTSecurity');
            const iotBadge = document.getElementById('iotBadge');
            if (iotCard && iotBadge) {
                if (localStorage.getItem('module_iotsecurity_completed') === 'true') {
                    iotCard.classList.add('completed');
                    iotBadge.className = "module-badge badge-completed";
                    iotBadge.innerText = "Completed ✓";
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

            const totalModulesTarget = 12;
            completedCountEl.innerText = `${completedCount} / ${totalModulesTarget}`;
            const pct = Math.round((completedCount / totalModulesTarget) * 100);
            progressText.innerText = `${pct}% Done`;
            progressFill.style.width = `${Math.min(100, pct)}%`;

            const rankNames = [
                "Apprentice",
                "Scout (Recon Master)",
                "Infiltrator (Network Specialist)",
                "Specialist (System Mapper)",
                "Assessor (Vulnerability Analyst)",
                "Operator (Privilege Escalator)",
                "Elite Agent (Full Methodologist)",
                "Threat Intelligence Scout",
                "Shadow Operator (Black Ops Master)",
                "Cloud Security Specialist",
                "Enterprise AD Dominator",
                "Apex Cyber Commander"
            ];
            
            const isGodMode = localStorage.getItem('pwnbox_is_authenticated') === 'true' && localStorage.getItem('pwnbox_godmode_badge') === 'true';
            const dropdownRank = document.getElementById('dropdownRank');

            if (isGodMode) {
                userRank.innerHTML = '<span class="godmode-rank-badge">👑 ROOT ARCHITECT</span>';
                if (dropdownRank) {
                    dropdownRank.innerHTML = '<span class="godmode-rank-badge">👑 ROOT ARCHITECT (GODMODE)</span>';
                }
                const profileCard = document.querySelector('.id-card-inner');
                if (profileCard) profileCard.classList.add('godmode-hologram-active');
            } else {
                userRank.innerText = rankNames[completedCount] || "Apex Cyber Commander";
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
                    'moduleVulnAnalysis': 'modules/Vulnerability.html',
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
                "Complete OSINT Arsenal",
                "Complete Black Ops & C2 Evasion",
                "Complete Cloud & Container Security",
                "Complete Active Directory Dominance",
                "Complete SOC & Blue Team Defense",
                "All Objectives Completed!"
            ];
            const nextMissionText = document.getElementById('nextMissionText');
            if (nextMissionText) {
                nextMissionText.innerText = isGodMode ? "👑 All Operations Cleared (GodMode)" : (nextMissionTitles[completedCount] || "All Objectives Completed!");
            }
            const nextMissionProgress = document.getElementById('nextMissionProgress');
            if (nextMissionProgress) {
                if (completedCount >= totalModulesTarget || isGodMode) nextMissionProgress.style.width = '100%';
                else nextMissionProgress.style.width = '15%'; // Just a small stub to show it's active
            }

            setTimeout(() => {
                const bgLine = document.getElementById('roadmapBgLine');
                if (bgLine) {
                    const bgWidth = bgLine.getBoundingClientRect().width;
                    const totalSegments = modules.length > 1 ? (modules.length - 1) : 6;
                    const segmentWidth = bgWidth / totalSegments;
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

        function openSettingsModalTrigger(e) {
            if (e) e.stopPropagation();
            if (typeof window.openSettingsModal === 'function') {
                window.openSettingsModal();
            }
        }
        window.openSettingsCard = openSettingsModalTrigger;

        if (window.location.search.includes('settings=1')) {
            setTimeout(() => {
                if (typeof window.openSettingsModal === 'function') {
                    window.openSettingsModal();
                }
            }, 250);
        }

        function resetAllProgress(e) {
            if (e) e.stopPropagation();
            document.getElementById('resetModalOverlay').classList.add('active');
        }

        function closeResetModal() {
            document.getElementById('resetModalOverlay').classList.remove('active');
        }

        function executeResetProgress() {
            // Module Training Progress, Quizzes & CTFs
            // Note: Custom tools and categories created via modal forms are preserved.

            // Footprinting / Recon CTF
            localStorage.removeItem('module_footprinting_completed');
            localStorage.removeItem('recon_ctf_flag_1');
            localStorage.removeItem('recon_ctf_flag_2');
            localStorage.removeItem('recon_ctf_flag_3');
            localStorage.removeItem('recon_ctf_completed');

            // Scanning
            localStorage.removeItem('module_scanning_completed');
            localStorage.removeItem('scanning_quiz_q1');
            localStorage.removeItem('scanning_quiz_q2');
            localStorage.removeItem('scanning_quiz_q3');
            localStorage.removeItem('scanning_quiz_completed');

            // Enumeration
            localStorage.removeItem('module_enumeration_completed');
            localStorage.removeItem('enumeration_quiz_q1');
            localStorage.removeItem('enumeration_quiz_q2');
            localStorage.removeItem('enumeration_quiz_q3');
            localStorage.removeItem('enumeration_quiz_completed');

            // Vulnerability Analysis
            localStorage.removeItem('module_vulnanalysis_completed');
            localStorage.removeItem('vuln_quiz_q1');
            localStorage.removeItem('vuln_quiz_q2');
            localStorage.removeItem('vuln_quiz_q3');
            localStorage.removeItem('vuln_quiz_completed');

            // System Hacking
            localStorage.removeItem('module_systemhacking_completed');
            localStorage.removeItem('sys_quiz_q1');
            localStorage.removeItem('sys_quiz_q2');
            localStorage.removeItem('sys_quiz_q3');
            localStorage.removeItem('sys_quiz_completed');

            // Web App Threats
            localStorage.removeItem('module_webapp_completed');
            localStorage.removeItem('webapp_quiz_q1');
            localStorage.removeItem('webapp_quiz_q2');
            localStorage.removeItem('webapp_quiz_q3');
            localStorage.removeItem('webapp_quiz_completed');

            // OSINT & Threat Intel
            localStorage.removeItem('module_osint_completed');

            // Module 08: Black Ops (Re-Lock & Reset)
            localStorage.removeItem('pwnbox_m08_unlocked');
            localStorage.removeItem('module_blackops_completed');

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

        // Expose toggleCheatSheetDrawer globally for C / c shortcut (Dashboard only)
        window.toggleCheatSheetDrawer = toggleCheatSheetDrawer;

        if (window.location.search.includes('cheatsheet=1')) {
            setTimeout(() => {
                toggleCheatSheetDrawer();
            }, 250);
        }

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
    window.location.href = 'masterguide/cybersecurity_masterguide.html?ch=1';
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
    updateDashboardStats();
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
    const node8 = document.getElementById('node8');
    if (!card) return;

    card.style.display = 'flex';
    const isCompleted = localStorage.getItem('module_blackops_completed') === 'true';
    card.className = "module-card active" + (isCompleted ? " completed" : "");
    const badge = document.getElementById('blackOpsBadge');
    if (badge) {
        badge.style.background = isCompleted ? "#10b981" : "#9333ea";
        badge.textContent = isCompleted ? "Completed ✓" : "Red Team Track";
    }
    if (node8) {
        node8.style.display = 'flex';
        node8.className = "node active" + (isCompleted ? " completed" : "");
        node8.onclick = (e) => { handleProtectedModuleLaunch(e, 'modules/BlackOps.html'); };
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


    // Single-key shortcut 'c' or 'C' for Cheatsheet drawer (Dashboard only)
    document.addEventListener('keydown', (e) => {
        if (e.key && e.key.toLowerCase() === 'c') {
            const activeEl = document.activeElement;
            const activeTag = activeEl ? activeEl.tagName : '';
            const isEditable = activeEl ? (activeEl.isContentEditable || activeEl.getAttribute('contenteditable') === 'true') : false;
            if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || isEditable) return;
            if (typeof toggleCheatSheetDrawer === 'function') {
                toggleCheatSheetDrawer(e);
            }
        }
    });
});

window.copyCheatCommand = copyCheatCommand;

// Notify guests of local progress tracking on module launch
document.addEventListener('click', (e) => {
    const launchTarget = e.target.closest('a[href*="modules/"], .btn-launch');
    if (launchTarget) {
        const isAuth = localStorage.getItem('pwnbox_is_authenticated') === 'true';
        if (!isAuth) {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast("Cadet Guest Mode active. Progress saved locally; sign in anytime for cloud sync.", "info");
            }
        }
    }
}, true);
