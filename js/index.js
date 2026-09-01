function updateDashboardStats() {
            const modules = [
                {
                    key: 'footprinting',
                    completedKey: 'module_footprinting_completed',
                    cardId: 'moduleFootprinting',
                    badgeId: 'footprintingBadge',
                    actionsId: null,
                    url: 'Footprinting.html',
                    toolsText: '🌐 22+ Tools Loaded',
                    nodeId: 'node1'
                },
                {
                    key: 'scanning',
                    completedKey: 'module_scanning_completed',
                    cardId: 'moduleScanning',
                    badgeId: 'scanningBadge',
                    actionsId: 'scanningActions',
                    url: 'Scanning.html',
                    toolsText: '🌐 15+ Tools Loaded',
                    nodeId: 'node2'
                },
                {
                    key: 'enumeration',
                    completedKey: 'module_enumeration_completed',
                    cardId: 'moduleEnumeration',
                    badgeId: 'enumerationBadge',
                    actionsId: 'enumerationActions',
                    url: 'Enumeration.html',
                    toolsText: '🌐 8+ Tools Loaded',
                    nodeId: 'node3'
                },
                {
                    key: 'vulnanalysis',
                    completedKey: 'module_vulnanalysis_completed',
                    cardId: 'moduleVulnAnalysis',
                    badgeId: 'vulnAnalysisBadge',
                    actionsId: 'vulnAnalysisActions',
                    url: 'Vulnerablity.html',
                    toolsText: '🌐 5+ Tools Loaded',
                    nodeId: 'node4'
                },
                {
                    key: 'systemhacking',
                    completedKey: 'module_systemhacking_completed',
                    cardId: 'moduleSystemHacking',
                    badgeId: 'systemHackingBadge',
                    actionsId: 'systemHackingActions',
                    url: 'SystemHacking.html',
                    toolsText: '🌐 6+ Tools Loaded',
                    nodeId: 'node5'
                },
                {
                    key: 'webapp',
                    completedKey: 'module_webapp_completed',
                    cardId: 'moduleWebApp',
                    badgeId: 'webAppBadge',
                    actionsId: 'webAppActions',
                    url: 'WebAppThreats.html',
                    toolsText: '🌐 6+ Tools Loaded',
                    nodeId: 'node6'
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
                { defaultCount: 6, customKey: 'webapp_custom_tools', deletedKey: 'webapp_deleted_default_indices', catKey: 'webapp_custom_categories' }
            ];

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

            completedCountEl.innerText = `${completedCount} / 6`;
            const pct = Math.round((completedCount / 6) * 100);
            progressText.innerText = `${pct}% Done`;
            progressFill.style.width = `${8.33 + (completedCount / 6) * 91.67}%`;

            const rankNames = [
                "Apprentice",
                "Scout (Recon Master)",
                "Infiltrator (Network Specialist)",
                "Specialist (System Mapper)",
                "Assessor (Vulnerability Analyst)",
                "Operator (Privilege Escalator)",
                "Elite Agent (Full Methodologist)"
            ];
            userRank.innerText = rankNames[completedCount];

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
                nextMissionText.innerText = nextMissionTitles[completedCount] || "All Objectives Completed!";
            }
            const nextMissionProgress = document.getElementById('nextMissionProgress');
            if (nextMissionProgress) {
                if (completedCount >= 6) nextMissionProgress.style.width = '100%';
                else nextMissionProgress.style.width = '15%'; // Just a small stub to show it's active
            }

            setTimeout(() => {
                const bgLine = document.getElementById('roadmapBgLine');
                if (bgLine) {
                    const bgWidth = bgLine.getBoundingClientRect().width;
                    const segmentWidth = bgWidth / 5;
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

            // Sync dropdown rank badge
            const dropdownRank = document.getElementById('dropdownRank');
            if (dropdownRank) {
                dropdownRank.innerText = userRank.innerText;
            }
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

            // Hide dropdown
            document.getElementById('profileDropdown').classList.remove('active');
            
            // Hide modal
            closeResetModal();

            // Refresh dashboard stats
            updateDashboardStats();
        }

        function toggleCheatSheetDrawer(e) {
            if (e) e.stopPropagation();
            const overlay = document.getElementById('drawerOverlay');
            const drawer = document.getElementById('cheatDrawer');
            
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
        let currentAlias = localStorage.getItem('agentAlias') || '';

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
                document.getElementById('editAliasInput').value = currentAlias;

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
            window.addEventListener('resize', updateDashboardStats);
        });