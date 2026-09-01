// ==========================================
        // 🛑 API KEY CONFIGURATION (LOCAL USE ONLY)
        // Put your 3 parts here. Do NOT push to GitHub.
        // ==========================================
        const keyP1 = "gsk_OCCHNxtXBVzq8";
        const keyP2 = "GdGCu99WGdyb3FY";
        const keyP3 = "sqdvAWM3jBcoxcwJaUrC8EGa";

        const apiKey = keyP1 + keyP2 + keyP3;
        // ==========================================

        const defaultTools = [
            {
                name: "1. Exifinfo", link: "https://www.exifinfo.org",
                category: "Forensics",
                brief: "Think of this as a magnifying glass for photos. When you take a picture with a phone, the phone secretly hides data inside the image file (like GPS location, time, camera model). This tool reveals that hidden data.",
                use: "Just open the website and upload any raw photo. It will automatically show you a list of all hidden information attached to it.",
                useful: "Finding out EXACTLY where a photo was taken, what phone was used, and if someone is lying about when they took the picture."
            },
            {
                name: "2. FotoForensics", link: "https://fotoforensics.com",
                category: "Forensics",
                brief: "A lie detector for images. It highlights parts of a picture that have been edited, photoshopped, or copy-pasted in.",
                use: "Upload an image. It will output a weird, dark, grainy version of the photo. If someone edited a face or object, that specific part will glow brighter than the rest of the image.",
                useful: "Proving if a screenshot, document, or photograph is fake or has been tampered with."
            },
            {
                name: "3. Mattw.io", link: "https://mattw.io",
                category: "OSINT",
                brief: "An X-ray machine for YouTube channels. It pulls out hidden details about a channel that YouTube usually hides from normal viewers.",
                use: "Paste a YouTube channel link into the website. It extracts the exact date it was created, hidden channel IDs, and technical tags.",
                useful: "Investigating fake or scam YouTube channels to see when they were actually created behind the scenes."
            },
            {
                name: "4. BehindTheEmail", link: "https://www.behindtheemail.com",
                category: "Forensics",
                brief: "A postman tracker. It looks at the hidden 'envelope' of an email to see which computer servers handled the email before it reached you.",
                use: "Paste the raw header of an email (found in Gmail settings under 'Show Original'). It traces the path of the email.",
                useful: "Figuring out if a scam email actually came from who they claim to be, or if they are faking the sender address."
            },
            {
                name: "5. Hunter.io", link: "https://hunter.io/verify",
                category: "OSINT",
                brief: "A directory checker for corporate emails. It guesses and verifies if an employee's email address is real without actually sending them an email.",
                use: "Type in a company name or a specific email. It pings the company's email server and asks 'Does this person exist?' and reports back.",
                useful: "Finding the real contact details of CEOs, managers, or employees of a target company during the initial hacking phase."
            },
            {
                name: "6. Who.is", link: "https://who.is",
                category: "Network",
                brief: "The phonebook of the internet. Every website has to be registered to a person or company. This tool shows you who bought the website.",
                use: "Type in any website (like google.com). It tells you the date it was bought, when it expires, and sometimes the name and phone number of the owner.",
                useful: "Finding out who is really running a scam website or when a new company domain was secretly set up."
            },
            {
                name: "7. DNSChecker", link: "https://dnschecker.org",
                category: "Network",
                brief: "A tool that checks how the world sees a website. It asks servers from different countries where a specific website is located.",
                use: "Type in a website name. It will show you the IP address (the actual number location) that different countries are connecting to.",
                useful: "Seeing if a website is hiding behind a firewall (like Cloudflare) or checking if a company recently moved their servers."
            },
            {
                name: "8. IPinfo.io", link: "https://ipinfo.io",
                category: "Network",
                brief: "A GPS for IP addresses. If you have someone's IP address (their internet connection number), this tells you what city they are in and what Wi-Fi provider they use.",
                use: "Paste an IP address (like 8.8.8.8) into the site. It spits out the Internet Service Provider (ISP), city, and region.",
                useful: "Tracing where a hacker or user is located physically based on their internet connection."
            },
            {
                name: "9. MXToolbox", link: "https://www.mxtoolbox.com",
                category: "Network",
                brief: "A health-check doctor for networks and emails. It checks if a company's email setup is secure or if they are listed on hacker blacklists.",
                use: "Type a domain name in. You can check 'MX' to see who hosts their email (like Google or Microsoft), or 'Blacklists' to see if they send spam.",
                useful: "Finding misconfigurations in a company's email system that could allow you to send fake emails pretending to be them."
            },
            {
                name: "10. VirusTotal", link: "https://www.virustotal.com",
                category: "Scanning",
                brief: "The ultimate antivirus checking station. Instead of using 1 antivirus, this website scans a file or website using 70+ different antiviruses at the same time.",
                use: "Upload a suspicious file or paste a weird link. It will tell you instantly if companies like Kaspersky, McAfee, or Microsoft think it is malware.",
                useful: "Checking if a tool you downloaded or a link you received is a virus before you click on it."
            },
            {
                name: "11. Nmap", link: "https://nmap.org",
                category: "Scanning",
                brief: "Think of a server as a house with 65,000 doors (ports). Nmap is a tool that knocks on every single door to see which ones are unlocked and what is inside.",
                use: "Open your Kali Linux terminal. Type <code>nmap 192.168.1.1</code>. It will list the open ports and tell you if they are running web servers, databases, etc.",
                useful: "This is the core tool of hacking. You use it to find the weak, open entry points in a target's computer system."
            },
            {
                name: "12. Shodan", link: "https://www.shodan.io",
                category: "OSINT",
                brief: "Google, but for hackers. Instead of searching for websites, Shodan searches for unprotected hardware plugged into the internet (like security cameras, smart TVs, or traffic lights).",
                use: "Type <code>webcamxp</code> in the search bar. It will show you a list of unprotected security cameras across the globe.",
                useful: "Finding massive vulnerabilities without even scanning a target yourself. It shows you what is already exposed to the public."
            },
            {
                name: "13. Censys", link: "https://censys.com",
                category: "OSINT",
                brief: "Similar to Shodan, but heavily focused on corporate cloud servers and digital certificates.",
                use: "Search a company's name. It looks through public security certificates to find secret servers the company forgot to hide.",
                useful: "Finding hidden 'development' or 'testing' websites belonging to a company that usually have weaker security."
            },
            {
                name: "14. theHarvester", link: "https://github.com/laramies/theHarvester",
                category: "OSINT",
                brief: "An automated scraper. Instead of you Googling manually, it scrapes Google, LinkedIn, and Bing to gather every email address and sub-website belonging to a company.",
                use: "In terminal, type <code>theHarvester -d targetcompany.com -b google</code>. It spits out a neat list of everything it found.",
                useful: "Gathering a massive list of employee emails to use for phishing attacks or finding hidden company login portals."
            },
            {
                name: "15. Recon-ng", link: "https://github.com/lanmaster53/recon-ng",
                category: "Scanning",
                brief: "A complete command-line hacking framework. It is a structured environment where you can load different 'modules' to gather info, like an organized toolbox.",
                use: "Type <code>recon-ng</code> in Kali. You create a workspace, tell it the target name, and run modules that automatically search databases for info.",
                useful: "Keeping your hacking notes and collected data organized in a database while running automated intelligence gathering."
            },
            {
                name: "16. SpiderFoot", link: "https://github.com/smicallef/spiderfoot",
                category: "Scanning",
                brief: "The ultimate automatic spy. You give it one piece of info (like an IP or a username), and it automatically searches 200 different websites to build a massive profile.",
                use: "Open it in your browser through Kali. Type the target name, click 'Start Scan', and watch it build a giant web of connections.",
                useful: "Doing a full background check on an IP address or username with zero manual effort."
            },
            {
                name: "17. Maltego", link: "https://www.maltego.com",
                category: "Scanning",
                brief: "A visual mapping tool. It takes boring text data (like IP addresses and emails) and draws a massive, interactive web chart showing how everything is connected.",
                use: "Drag an 'Email' icon onto the screen, type the email, right-click, and select 'Find related'. It will draw lines connecting that email to social media accounts.",
                useful: "Visualizing complicated networks to see how a hacker is connected to a specific server or fake identity."
            },
            {
                name: "18. Google Dorks", link: "https://www.google.com",
                category: "OSINT",
                brief: "Using secret Google search commands to find stuff people didn't mean to upload to the internet.",
                use: "Go to Google. Type <code>site:example.com filetype:pdf password</code>. It forces Google to only show PDF files containing the word 'password' from that website.",
                useful: "Finding exposed employee salaries, database backups, or secret admin panels that are accidentally public."
            },
            {
                name: "19. OWASP Amass", link: "https://github.com/owasp-amass/amass",
                category: "Network",
                brief: "The king of finding subdomains (like 'admin.website.com' instead of just 'website.com'). It digs deeper than any other tool.",
                use: "In terminal, type <code>amass enum -d website.com</code>. It checks dozens of APIs and databases to map out the entire company network.",
                useful: "Finding forgotten, old parts of a company's website. Old websites are usually the easiest to hack."
            },
            {
                name: "20. Sherlock", link: "https://github.com/sherlock-project/sherlock",
                category: "OSINT",
                brief: "A username tracker. It takes a single username and instantly checks over 400 social media sites to see if an account exists with that name.",
                use: "In terminal, type <code>sherlock targetname</code>. It will give you direct links to their Reddit, Twitter, GitHub, etc.",
                useful: "Stalking a target's digital footprint to learn their hobbies, habits, or find where else they reuse their username."
            },
            {
                name: "21. PhoneInfoga", link: "https://github.com/sundowndev/PhoneInfoga",
                category: "OSINT",
                brief: "A scanner specifically for phone numbers. It doesn't hack the phone, but it finds out who the carrier is and if the number is tied to any public internet accounts.",
                use: "Type <code>phoneinfoga scan -n +1234567890</code>. It runs OSINT checks to gather location and telecom provider info.",
                useful: "Verifying if a phone number belongs to a real person, a VOIP service (like Skype), or a scammer."
            },
            {
                name: "22. DNSDumpster", link: "https://dnsdumpster.com",
                category: "Network",
                brief: "A very fast, easy-to-read website that draws a map of a company's servers based on their DNS records.",
                use: "Type a website name into the search bar. It instantly shows you the IP addresses of their web servers, mail servers, and draws a visual map.",
                useful: "Getting a quick, 10-second overview of how big a company's network is before you start doing deeper scans."
            }
        ];

        function init() {
            const list = document.getElementById('toolList');
            list.innerHTML = '';

            const categories = {
                "Forensics": [],
                "Network": [],
                "OSINT": [],
                "Scanning": []
            };

            const catDisplayNames = {
                "Forensics": "🖼️ Forensics & Metadata",
                "Network": "🌐 Network & Domain",
                "OSINT": "🔍 OSINT & Scrapers",
                "Scanning": "⚙️ Scanning & Frameworks"
            };

            // Load custom categories
            try {
                const customCats = JSON.parse(localStorage.getItem('custom_categories') || '{}');
                for (const [key, value] of Object.entries(customCats)) {
                    categories[key] = [];
                    catDisplayNames[key] = value;
                }
            } catch (e) {
                console.error("Error loading custom categories in init:", e);
            }

            tools.forEach((tool, index) => {
                const cat = tool.category || "OSINT";
                if (categories[cat]) {
                    categories[cat].push({ tool, index });
                } else {
                    categories["OSINT"].push({ tool, index });
                }
            });

            for (const [catName, catTools] of Object.entries(categories)) {
                if (catTools.length === 0) continue;

                let headerDiv = document.createElement('div');
                headerDiv.className = 'category-header';
                headerDiv.innerText = catDisplayNames[catName];
                list.appendChild(headerDiv);

                catTools.forEach(({ tool, index }) => {
                    let div = document.createElement('div');
                    div.className = 'tool-item';
                    div.innerText = tool.name.split('.')[1].trim();
                    div.onclick = () => showDetails(index, div);
                    list.appendChild(div);
                });
            }

            if (apiKey.includes("YOUR_MIDDLE_PART")) {
                document.getElementById('statusDot').classList.remove('online');
                addBotMessage("⚠️ WARNING: You haven't configured the API key parts in the HTML code yet. Open the file in an editor and update keyP1, keyP2, and keyP3.");
            }
        }

        function switchMobileTab(tabId) {
            document.querySelectorAll('.nav-tab').forEach(btn => {
                if (btn.getAttribute('onclick').includes(tabId)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            document.body.className = document.body.className.replace(/\btab-\w+\b/g, '').trim();
            document.body.classList.add('tab-' + tabId);
        }

        function showDetails(index, element) {
            document.querySelectorAll('.tool-item').forEach(el => el.classList.remove('active'));
            element.classList.add('active');

            const tool = tools[index];
            const catClass = `badge-${tool.category.toLowerCase()}`;
            const displayCatName = tool.category.replace(/_/g, ' ');

            document.getElementById('detailsPanel').innerHTML = `
                <div class="card">
                    <h1 style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <span>${tool.name.split('.')[1].trim()}<span class="badge ${catClass}">${displayCatName}</span></span>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button class="btn btn-edit-tool" onclick="openEditToolModal(${index})" style="font-size: 0.8rem; padding: 6px 12px;">✏️ Edit</button>
                            <button class="btn btn-delete-tool" onclick="confirmDeleteTool(${index})" style="font-size: 0.8rem; padding: 6px 12px;">🗑️ Delete</button>
                            <a href="${tool.link}" target="_blank" style="font-size: 0.8rem; padding: 6px 12px;">Launch ↗</a>
                        </div>
                    </h1>
                    <div class="section-label">Simply Explained (What is it?)</div>
                    <div class="section-content">${tool.brief}</div>
                    <div class="section-label">How to actually use it</div>
                    <div class="section-content">${tool.use}</div>
                    <div class="section-label">Why Hackers care about this</div>
                    <div class="section-content">${tool.useful}</div>
                </div>
            `;

            if (window.innerWidth <= 768) {
                switchMobileTab('details');
            }
        }

        function handleEnter(e) {
            if (e.key === 'Enter') sendMessage();
        }

        async function sendMessage() {
            const inputEl = document.getElementById('chatInput');
            const msg = inputEl.value.trim();
            if (!msg) return;

            addUserMessage(msg);
            inputEl.value = '';

            // Check if key is empty or still the default text
            if (!apiKey || apiKey.includes("YOUR_MIDDLE_PART")) {
                setTimeout(() => addBotMessage("❌ ERROR: Missing Groq API Key. Edit the HTML file to add your split key."), 500);
                return;
            }

            const toolsContext = tools.map(t => `${t.name.split('.')[1].trim()}: ${t.brief}`).join(" | ");

            // Groq uses OpenAI format. System prompt goes here.
            const systemPrompt = `You are a brutally honest, direct cybersecurity assistant helping a complete beginner. Explain things simply but logically. When writing command lines or code snippets, ALWAYS wrap them in standard markdown fenced code blocks (using \`\`\`bash or similar) or single backticks for inline code, so the parser renders them nicely. Here is the tool context: ${toolsContext}.`;

            const loadingId = "load-" + Date.now();
            try {
                showTypingIndicator(loadingId);

                // Updated Fetch for Groq API
                const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}` // Groq requires Bearer token
                    },
                    body: JSON.stringify({
                        model: "openai/gpt-oss-20b", // You can change this to "openai/gpt-oss-20b" if you want
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: msg }
                        ]
                    })
                });

                const data = await response.json();
                const indicator = document.getElementById(loadingId);
                if (indicator) indicator.remove();

                if (data.error) {
                    addBotMessage(`Groq API Error: ${data.error.message}`);
                } else {
                    // Extracting text from Groq's JSON structure
                    const reply = data.choices[0].message.content;
                    const formattedReply = formatMarkdown(reply);
                    addBotMessage(formattedReply);
                }

            } catch (error) {
                const indicator = document.getElementById(loadingId);
                if (indicator) indicator.remove();
                addBotMessage(`Network Error: Failed to reach Groq API. Check your internet or CORS policy.`);
            }
        }

        function formatMarkdown(text) {
            // Escape HTML to prevent XSS
            let html = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            // Fenced code blocks with optional language
            html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
            });

            // Inline code
            html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

            // Bold
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Bullet points (convert lines starting with * or - into lists)
            let lines = html.split('\n');
            let inList = false;
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    let content = line.substring(2);
                    if (!inList) {
                        lines[i] = '<ul><li>' + content + '</li>';
                        inList = true;
                    } else {
                        lines[i] = '<li>' + content + '</li>';
                    }
                } else {
                    if (inList) {
                        lines[i] = '</ul>' + lines[i];
                        inList = false;
                    }
                }
            }
            if (inList) {
                lines[lines.length - 1] += '</ul>';
            }
            html = lines.join('\n');

            // Convert newlines to <br> if not in pre/code/ul tags
            html = html.replace(/\n/g, '<br>');
            html = html.replace(/<\/pre><br>/g, '</pre>')
                        .replace(/<\/ul><br>/g, '</ul>')
                        .replace(/<\/li><br>/g, '</li>')
                        .replace(/<ul><br>/g, '<ul>');

            return html;
        }

        function showTypingIndicator(id) {
            const history = document.getElementById('chatHistory');
            history.innerHTML += `
                <div class="msg bot typing-indicator" id="${id}">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            history.scrollTop = history.scrollHeight;
        }

        function addUserMessage(text) {
            const history = document.getElementById('chatHistory');
            history.innerHTML += `<div class="msg user">${text}</div>`;
            history.scrollTop = history.scrollHeight;
        }

        function addBotMessage(text, id = "") {
            const history = document.getElementById('chatHistory');
            history.innerHTML += `<div class="msg bot" ${id ? `id="${id}"` : ""}>${text}</div>`;
            history.scrollTop = history.scrollHeight;
        }

        // --- Custom Tool Integration ---
        let editingToolIndex = null;
        let tools = [];

        function openAddToolModal() {
            editingToolIndex = null;
            
            document.querySelector('#addToolModal h3').innerText = "Add Custom Tool";
            document.querySelector('#addToolForm button[type="submit"]').innerText = "Add Tool";
            
            // Reset form fields
            document.getElementById('addToolForm').reset();
            cancelNewCategory();
            loadCustomCategories();
            
            const modal = document.getElementById('addToolModal');
            modal.style.display = 'flex';
            // Force browser reflow to enable transition
            modal.offsetHeight;
            modal.classList.add('active');
            document.getElementById('toolName').focus();
        }

        function openEditToolModal(index) {
            editingToolIndex = index;
            const tool = tools[index];
            
            document.querySelector('#addToolModal h3').innerText = "Edit Tool Info";
            document.querySelector('#addToolForm button[type="submit"]').innerText = "Save Changes";
            
            // Reset form and reload custom categories
            document.getElementById('addToolForm').reset();
            cancelNewCategory();
            loadCustomCategories();
            
            // Populate fields
            const rawName = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name.trim();
            document.getElementById('toolName').value = rawName;
            document.getElementById('toolLink').value = tool.link;
            document.getElementById('toolCategory').value = tool.category;
            document.getElementById('toolBrief').value = tool.brief;
            document.getElementById('toolUse').value = tool.use;
            document.getElementById('toolUseful').value = tool.useful;

            // Open modal
            const modal = document.getElementById('addToolModal');
            modal.style.display = 'flex';
            modal.offsetHeight;
            modal.classList.add('active');
        }

        function closeAddToolModal() {
            const modal = document.getElementById('addToolModal');
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.getElementById('addToolForm').reset();
            }, 300);
        }

        function loadCustomTools() {
            try {
                const stored = localStorage.getItem('custom_tools');
                if (stored) {
                    const customTools = JSON.parse(stored);
                    customTools.forEach((tool, idx) => {
                        let rawName = tool.name;
                        const match = tool.name.match(/^\d+\.\s*(.*)$/);
                        if (match) {
                            rawName = match[1];
                        }
                        tool.name = `${tools.length + 1}. ${rawName}`;
                        tool.originalIndex = null;
                        tool.customIndex = idx;
                        tools.push(tool);
                    });
                }
            } catch (e) {
                console.error("Error loading custom tools:", e);
            }
        }

        function submitNewTool(e) {
            e.preventDefault();
            
            const nameVal = document.getElementById('toolName').value.trim();
            const linkVal = document.getElementById('toolLink').value.trim();
            const categoryVal = document.getElementById('toolCategory').value;
            const briefVal = document.getElementById('toolBrief').value.trim();
            const useVal = document.getElementById('toolUse').value.trim();
            const usefulVal = document.getElementById('toolUseful').value.trim();

            if (editingToolIndex !== null) {
                const originalTool = tools[editingToolIndex];
                
                const updatedTool = {
                    name: nameVal, // will be prefixed on reload
                    link: linkVal,
                    category: categoryVal,
                    brief: briefVal,
                    use: useVal,
                    useful: usefulVal
                };

                if (originalTool.originalIndex !== null) {
                    // Edit default tool
                    let edited = JSON.parse(localStorage.getItem('edited_default_tools') || '{}');
                    edited[originalTool.originalIndex] = updatedTool;
                    localStorage.setItem('edited_default_tools', JSON.stringify(edited));
                } else {
                    // Edit custom tool
                    let customTools = JSON.parse(localStorage.getItem('custom_tools') || '[]');
                    customTools[originalTool.customIndex] = updatedTool;
                    localStorage.setItem('custom_tools', JSON.stringify(customTools));
                }

                closeAddToolModal();
                reloadAllTools();

                // Select the edited tool
                setTimeout(() => {
                    const items = document.querySelectorAll('.tool-item');
                    let newToolEl = null;
                    let foundIndex = 0;
                    tools.forEach((t, idx) => {
                        const rName = t.name.includes('.') ? t.name.split('.')[1].trim() : t.name.trim();
                        if (rName === nameVal) {
                            foundIndex = idx;
                        }
                    });
                    items.forEach(el => {
                        if (el.innerText === nameVal) {
                            newToolEl = el;
                        }
                    });
                    if (newToolEl) {
                        showDetails(foundIndex, newToolEl);
                    }
                }, 100);

            } else {
                // Adding a new tool
                const newTool = {
                    name: nameVal,
                    link: linkVal,
                    category: categoryVal,
                    brief: briefVal,
                    use: useVal,
                    useful: usefulVal
                };

                try {
                    const stored = localStorage.getItem('custom_tools');
                    const customTools = stored ? JSON.parse(stored) : [];
                    customTools.push(newTool);
                    localStorage.setItem('custom_tools', JSON.stringify(customTools));
                } catch (err) {
                    console.error("Error saving custom tool:", err);
                }

                closeAddToolModal();
                reloadAllTools();

                setTimeout(() => {
                    const items = document.querySelectorAll('.tool-item');
                    let newToolEl = null;
                    let foundIndex = 0;
                    tools.forEach((t, idx) => {
                        const rName = t.name.includes('.') ? t.name.split('.')[1].trim() : t.name.trim();
                        if (rName === nameVal) {
                            foundIndex = idx;
                        }
                    });
                    items.forEach(el => {
                        if (el.innerText === nameVal) {
                            newToolEl = el;
                        }
                    });
                    if (newToolEl) {
                        showDetails(foundIndex, newToolEl);
                    }
                }, 100);
            }
        }

        function confirmDeleteTool(index) {
            const tool = tools[index];
            const rawName = tool.name.includes('.') ? tool.name.split('.')[1].trim() : tool.name.trim();
            if (confirm(`Are you sure you want to delete "${rawName}"?`)) {
                deleteTool(index);
            }
        }

        function deleteTool(index) {
            const tool = tools[index];
            if (tool.originalIndex !== null) {
                // Delete default tool
                let deleted = JSON.parse(localStorage.getItem('deleted_default_indices') || '[]');
                if (!deleted.includes(tool.originalIndex)) {
                    deleted.push(tool.originalIndex);
                    localStorage.setItem('deleted_default_indices', JSON.stringify(deleted));
                }
            } else {
                // Delete custom tool
                let customTools = JSON.parse(localStorage.getItem('custom_tools') || '[]');
                customTools.splice(tool.customIndex, 1);
                localStorage.setItem('custom_tools', JSON.stringify(customTools));
            }

            reloadAllTools();
            
            // Clear details panel
            document.getElementById('detailsPanel').innerHTML = `
                <div style="text-align: center; color: var(--text-muted); margin-top: 20vh;">
                    <h3>Select a tool from the menu to view beginner-friendly intelligence data.</h3>
                </div>
            `;
        }

        // --- Custom Category Logic ---
        function loadCustomCategories() {
            try {
                const customCats = JSON.parse(localStorage.getItem('custom_categories') || '{}');
                const selectEl = document.getElementById('toolCategory');
                
                // Clear and rebuild default options
                selectEl.innerHTML = `
                    <option value="OSINT">🔍 OSINT & Scrapers</option>
                    <option value="Network">🌐 Network & Domain</option>
                    <option value="Scanning">⚙️ Scanning & Frameworks</option>
                    <option value="Forensics">🖼️ Forensics & Metadata</option>
                `;

                for (const [key, value] of Object.entries(customCats)) {
                    const opt = document.createElement('option');
                    opt.value = key;
                    opt.innerText = value;
                    selectEl.appendChild(opt);
                }
            } catch (e) {
                console.error("Error loading custom categories:", e);
            }
        }

        function showNewCategoryForm() {
            document.getElementById('newCategoryGroup').style.display = 'block';
            document.getElementById('newCategoryName').focus();
        }

        function cancelNewCategory() {
            document.getElementById('newCategoryGroup').style.display = 'none';
            document.getElementById('newCategoryName').value = '';
            document.getElementById('newCategoryIcon').value = '';
        }

        function saveNewCategory() {
            const name = document.getElementById('newCategoryName').value.trim();
            const icon = document.getElementById('newCategoryIcon').value.trim() || "📁";
            
            if (!name) return;

            const key = name.replace(/\s+/g, '_');
            const displayName = `${icon} ${name}`;

            try {
                const customCats = JSON.parse(localStorage.getItem('custom_categories') || '{}');
                customCats[key] = displayName;
                localStorage.setItem('custom_categories', JSON.stringify(customCats));
            } catch (e) {
                console.error("Error saving custom category:", e);
            }

            loadCustomCategories();
            document.getElementById('toolCategory').value = key;
            cancelNewCategory();
        }

        function reloadAllTools() {
            tools = defaultTools.map((t, idx) => ({ ...t, originalIndex: idx }));
            
            try {
                const deletedIndices = JSON.parse(localStorage.getItem('deleted_default_indices') || '[]');
                tools = tools.filter(t => !deletedIndices.includes(t.originalIndex));
            } catch (e) {
                console.error("Error loading deleted tools:", e);
            }

            try {
                const edited = JSON.parse(localStorage.getItem('edited_default_tools') || '{}');
                tools.forEach(t => {
                    if (edited[t.originalIndex]) {
                        Object.assign(t, edited[t.originalIndex]);
                    }
                });
            } catch (e) {
                console.error("Error loading edited tools:", e);
            }

            loadCustomTools();
            init();
        }

        // Close modal when clicking outside of the modal-card
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('addToolModal');
            if (e.target === modal) {
                closeAddToolModal();
            }
        });

        // Close modal when pressing Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAddToolModal();
            }
        });

        function switchPanelTab(tabId) {
            document.querySelectorAll('.panel-tab').forEach(btn => {
                if (btn.innerText.toLowerCase().includes(tabId)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            if (tabId === 'chat') {
                document.getElementById('chatTabContent').style.display = 'flex';
                document.getElementById('terminalTabContent').style.display = 'none';
                document.getElementById('ctfTabContent').style.display = 'none';
            } else if (tabId === 'terminal') {
                document.getElementById('chatTabContent').style.display = 'none';
                document.getElementById('terminalTabContent').style.display = 'flex';
                document.getElementById('ctfTabContent').style.display = 'none';
                document.getElementById('terminalInput').focus();
            } else if (tabId === 'ctf') {
                document.getElementById('chatTabContent').style.display = 'none';
                document.getElementById('terminalTabContent').style.display = 'none';
                document.getElementById('ctfTabContent').style.display = 'flex';
                loadCtfStatus();
            }
        }

        function handleTerminalEnter(e) {
            if (e.key === 'Enter') {
                const inputEl = document.getElementById('terminalInput');
                const cmdLine = inputEl.value.trim();
                inputEl.value = '';
                
                if (!cmdLine) return;

                executeTerminalCommand(cmdLine);
            }
        }

        function executeTerminalCommand(cmdLine) {
            const outputEl = document.getElementById('terminalOutput');
            
            // Append input prompt line
            outputEl.innerHTML += `<div><span style="color: #34d399;">guest@cyberx:~$</span> <span style="color: #f8fafc;">${escapeHtml(cmdLine)}</span></div>`;
            
            const parts = cmdLine.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);
            
            let response = "";
            
            switch(cmd) {
                case 'help':
                    response = `
<span style="color: #fbbf24;">Available commands:</span>
  help                 - Display this usage directory
  clear                - Clear the terminal screen
  whois &lt;domain&gt;       - Retrieve domain registration records
  nslookup &lt;domain&gt;    - Query name servers for DNS records
  nmap &lt;ip/domain&gt;     - Run a port and service scan
  gobuster &lt;url&gt;       - Scan website directories and files
  exiftool &lt;file&gt;      - Extract metadata from target image files
  curl -i &lt;url&gt;        - Grab HTTP header banners from servers
`;
                    break;
                case 'clear':
                    outputEl.innerHTML = '';
                    return;
                case 'whois':
                    if (args.length === 0) {
                        response = `<span style="color: var(--danger);">Error: Missing target domain. Usage: whois &lt;domain&gt;</span>`;
                    } else {
                        const target = args[0];
                        response = `
Domain Name: ${escapeHtml(target.toUpperCase())}
Registry Domain ID: ${Math.floor(Math.random() * 9000000) + 1000000}_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.markmonitor.com
Registrar URL: http://www.markmonitor.com
Updated Date: 2025-05-12T09:12:44Z
Creation Date: 1999-03-15T04:00:00Z
Registrar: MarkMonitor Inc.
Registrant State/Province: CA
Registrant Country: US
Name Server: NS1.${escapeHtml(target.toUpperCase())}
Name Server: NS2.${escapeHtml(target.toUpperCase())}
`;
                    }
                    break;
                case 'nslookup':
                    if (args.length === 0) {
                        response = `<span style="color: var(--danger);">Error: Missing target domain. Usage: nslookup &lt;domain&gt;</span>`;
                    } else {
                        const target = args[args.length - 1];
                        response = `
Server:         192.168.1.1
Address:        192.168.1.1#53

Non-authoritative answer:
Name:   ${escapeHtml(target)}
Address: 142.250.190.46
Name:   ${escapeHtml(target)}
Address: 2607:f8b0:4005:809::200e

Mail Exchangers (MX):
${escapeHtml(target)} mail exchanger = 10 smtp.securesrv.${escapeHtml(target)}.
`;
                    }
                    break;
                case 'nmap':
                    if (args.length === 0) {
                        response = `<span style="color: var(--danger);">Error: Missing target host. Usage: nmap &lt;ip/domain&gt;</span>`;
                    } else {
                        const target = args[args.length - 1];
                        response = `
Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-29 06:20
Nmap scan report for ${escapeHtml(target)}
Host is up (0.038s latency).
Not shown: 997 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
22/tcp   open  ssh           OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
80/tcp   open  http          nginx 1.14.2
443/tcp  open  ssl/http      nginx 1.14.2

Service detection completed in 3.12 seconds.
Nmap done: 1 IP address (1 host up) scanned in 4.56 seconds
`;
                    }
                    break;
                case 'gobuster':
                    if (args.length === 0) {
                        response = `<span style="color: var(--danger);">Error: Missing URL. Usage: gobuster &lt;url&gt;</span>`;
                    } else {
                        const target = args[args.length - 1];
                        response = `
===============================================================
Gobuster v3.1.0
===============================================================
[+] Url:                     ${escapeHtml(target)}
[+] Wordlist:                common.txt
===============================================================
/index.html           (Status: 200) [Size: 1045]
/admin                (Status: 403) [Size: 220] (Forbidden)
/robots.txt           (Status: 200) [Size: 84]
/backup.zip           (Status: 200) [Size: 452031] (Found Backup Archive!)
/config.php           (Status: 200) [Size: 0]
===============================================================
`;
                    }
                    break;
                case 'exiftool':
                    if (args.length === 0) {
                        response = `<span style="color: var(--danger);">Error: Missing file target. Usage: exiftool &lt;file&gt;</span>`;
                    } else {
                        const target = args[0];
                        response = `
ExifTool Version Number         : 12.30
File Name                       : ${escapeHtml(target)}
File Size                       : 86 KiB
File Type                       : JPEG
MIME Type                       : image/jpeg
Camera Model Name               : iPhone 13 Pro
Modify Date                     : 2026:05:22 14:15:30
GPS Latitude                    : 37 deg 46' 30.00" N
GPS Longitude                   : 122 deg 25' 5.00" W
GPS Position                    : 37 deg 46' 30.00" N, 122 deg 25' 5.00" W
Warning                         : Contains embedded location markers!
`;
                    }
                    break;
                case 'curl':
                    if (args.length === 0) {
                        response = `<span style="color: var(--danger);">Error: Missing URL. Usage: curl -i &lt;url&gt;</span>`;
                    } else {
                        const target = args[args.length - 1];
                        response = `
HTTP/2 200 OK
server: Cloudflare
date: Mon, 29 Jun 2026 00:20:00 GMT
content-type: text/html; charset=UTF-8
strict-transport-security: max-age=31536000; includeSubDomains
x-powered-by: PHP/7.4.29
`;
                    }
                    break;
                default:
                    response = `<span style="color: var(--danger);">bash: ${escapeHtml(cmd)}: command not found. Type 'help' for directions.</span>`;
            }

            outputEl.innerHTML += `<div style="white-space: pre-wrap; margin-bottom: 12px; color: #c9d1d9;">${response}</div>`;
            outputEl.scrollTop = outputEl.scrollHeight;
        }

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        function updateCompletionButton() {
            const btn = document.getElementById('completeModuleBtn');
            if (!btn) return;
            const isCompleted = localStorage.getItem('module_footprinting_completed') === 'true';
            if (isCompleted) {
                btn.innerText = "✓ Module Completed";
                btn.classList.add('completed');
            } else {
                btn.innerText = "Mark Module Completed";
                btn.classList.remove('completed');
            }
        }

        function toggleModuleCompletion() {
            const isCompleted = localStorage.getItem('module_footprinting_completed') === 'true';
            localStorage.setItem('module_footprinting_completed', !isCompleted);
            updateCompletionButton();
        }

        const ctfAnswers = {
            1: "smtp.securesrv.flagcompany.org",
            2: "iphone 13 pro",
            3: "/backup.zip"
        };

        function submitCtfFlag(id) {
            const inputVal = document.getElementById(`ctfInput${id}`).value.trim().toLowerCase();
            const statusEl = document.getElementById(`ctfStatus${id}`);
            const cardEl = document.getElementById(`ctfCard${id}`);
            
            if (inputVal === ctfAnswers[id]) {
                statusEl.innerText = "✓ Correct Flag!";
                statusEl.style.color = "var(--accent-primary)";
                cardEl.style.borderColor = "var(--accent-primary)";
                localStorage.setItem(`recon_ctf_flag_${id}`, "true");
                checkCtfCompletion();
            } else {
                statusEl.innerText = "❌ Incorrect flag. Try again!";
                statusEl.style.color = "var(--danger)";
                cardEl.style.borderColor = "var(--danger)";
            }
        }

        function checkCtfCompletion() {
            const f1 = localStorage.getItem("recon_ctf_flag_1") === "true";
            const f2 = localStorage.getItem("recon_ctf_flag_2") === "true";
            const f3 = localStorage.getItem("recon_ctf_flag_3") === "true";
            
            if (f1 && f2 && f3) {
                document.getElementById('ctfCompletionMsg').style.display = 'block';
                localStorage.setItem('recon_ctf_completed', 'true');
            } else {
                document.getElementById('ctfCompletionMsg').style.display = 'none';
            }
        }

        function loadCtfStatus() {
            for (let id = 1; id <= 3; id++) {
                const isSolved = localStorage.getItem(`recon_ctf_flag_${id}`) === "true";
                if (isSolved) {
                    document.getElementById(`ctfInput${id}`).value = ctfAnswers[id];
                    document.getElementById(`ctfInput${id}`).disabled = true;
                    document.getElementById(`ctfStatus${id}`).innerText = "✓ Correct Flag!";
                    document.getElementById(`ctfStatus${id}`).style.color = "var(--accent-primary)";
                    document.getElementById(`ctfCard${id}`).style.borderColor = "var(--accent-primary)";
                }
            }
            checkCtfCompletion();
        }

        // Initialize Everything
        loadCustomCategories();
        reloadAllTools();
        updateCompletionButton();
        loadCtfStatus();