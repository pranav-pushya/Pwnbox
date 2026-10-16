/**
 * LINUX COMMANDS MIND MAP & FLOWCHART ENGINE
 * Exact Reproduction of Slide 13 "Most Used Linux Commands" (ByteByteGo)
 * Fully Interactive: Pan/Zoom, Live Search, Click-to-Copy, Terminal Simulator
 */

// Synthesize tactical cyber audio feedback using Web Audio API
function playCyberSound(type = 'click') {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!window._audioContext) window._audioContext = new AudioCtx();
        const ctx = window._audioContext;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'copy') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.setValueAtTime(1040, now + 0.05);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (type === 'open') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    } catch (e) {
        // AudioContext disabled or restricted by policy
    }
}

// Complete Data Dictionary matching Slide 13 (Exact text, commands, and flags)
const LINUX_CATEGORIES = [
    {
        id: 'file_viewing',
        name: 'File Viewing',
        icon: '👁️',
        color: '#10b981',
        cssClass: 'cat-file-viewing',
        side: 'left',
        boxPos: { x: 530, y: 140 },
        items: [
            { cmd: 'cat file', desc: 'Print file contents', flags: 'Concatenate and display full file contents to stdout. -n line numbers, -b non-empty line numbers.', sample: 'cat /etc/os-release', output: 'NAME="Ubuntu"\nVERSION="24.04 LTS (Noble Numbat)"\nID=ubuntu\nPRETTY_NAME="Ubuntu 24.04 LTS"' },
            { cmd: 'less file', desc: 'Scroll through file', flags: 'Interactive terminal pager. Navigate with [Up/Down], /pattern to search, [q] to quit without cluttering screen.', sample: 'less /var/log/syslog', output: 'Oct 16 16:00:01 pwnbox systemd[1]: Starting Daily apt upgrade and clean activities...\nOct 16 16:00:15 pwnbox systemd[1]: apt-daily-upgrade.service: Deactivated successfully.\n(press q to quit)' },
            { cmd: 'head -n 10 file', desc: 'Show first lines', flags: '-n [N] outputs the first N lines of specified file (default is 10 lines).', sample: 'head -n 5 /etc/passwd', output: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nsync:x:4:65534:sync:/bin:/bin/sync' },
            { cmd: 'tail -n 10 file', desc: 'Show last lines', flags: '-n [N] outputs the last N lines. Use -f to dynamically follow active log stream updates in real-time.', sample: 'tail -n 3 /var/log/auth.log', output: 'Oct 16 15:42:10 pwnbox sshd[18420]: Accepted publickey for analyst from 192.168.1.100 port 52310 ssh2\nOct 16 15:42:10 pwnbox sshd[18420]: pam_unix(sshd:session): session opened for user analyst by (uid=0)\nOct 16 15:45:00 pwnbox sudo: analyst : TTY=pts/0 ; PWD=/home/analyst ; USER=root ; COMMAND=/usr/bin/apt update' },
            { cmd: 'echo "text"', desc: 'Print text', flags: 'Prints string arguments to standard output. Use > to redirect/overwrite file, or >> to append.', sample: 'echo "Antigravity PwnBox" > /tmp/flag.txt && cat /tmp/flag.txt', output: 'Antigravity PwnBox' },
            { cmd: 'nano file', desc: 'Simple terminal editor', flags: 'Lightweight modeless terminal text editor. Common shortcuts: Ctrl+O to save, Ctrl+X to exit, Ctrl+W to search.', sample: 'nano /etc/hosts', output: '[ GNU nano 7.2              /etc/hosts                         ]\n127.0.0.1   localhost\n127.0.1.1   pwnbox\n::1         localhost ip6-localhost ip6-loopback\n\n^G Help     ^O WriteOut ^W Where Is ^K Cut Text ^C Cur Pos\n^X Exit     ^R Read File ^\ Replace  ^U Paste    ^T To Spell' },
            { cmd: 'vim file', desc: 'Advanced text editor', flags: 'Powerful modal editor. Modes: Normal (:wq to save/quit, dd delete line), Insert (i), Visual (v), Command (:).', sample: 'vim script.py', output: '~ VIM - Vi IMproved 9.1\n~ by Bram Moolenaar et al.\n~ type  :q<Enter>               to exit\n~ type  :help<Enter> or <F1>    for on-line help\n~ type  :help version9<Enter>   for version info' }
        ]
    },
    {
        id: 'text_processing',
        name: 'Text Processing',
        icon: '💻',
        color: '#3b82f6',
        cssClass: 'cat-text-proc',
        side: 'left',
        boxPos: { x: 530, y: 340 },
        items: [
            { cmd: 'grep "pat" file | grep -R "pat"', desc: 'Search text patterns', flags: 'Search regular expressions. -R recursive directory search, -i case-insensitive, -n line numbers, -v invert match.', sample: 'grep -Rin "password" /var/www/html/config/', output: '/var/www/html/config/db.php:14:    $db_password = "supersecret_cyber_pass";\n/var/www/html/config/api.json:8:     "admin_password_hash": "$2y$10$abcdef..."' },
            { cmd: "awk '{print $1}' file", desc: 'Extract columns/fields', flags: 'Programmable text processor. $1 refers to field 1 (delimited by spaces/tabs). Use -F: to specify custom delimiter.', sample: "awk -F: '$3 >= 1000 {print $1, $3, $7}' /etc/passwd", output: 'analyst 1000 /bin/bash\noperator 1001 /bin/bash\npentester 1002 /bin/zsh' },
            { cmd: 'sort file', desc: 'Sort text lines', flags: 'Sort lines in alphabetical order. -n numerical sort, -r reverse sort, -u unique lines only, -k sort by column.', sample: 'sort -u ip_list.txt', output: '10.10.10.1\n10.10.10.5\n192.168.1.1\n192.168.1.50' },
            { cmd: 'find . -name "*.log"', desc: 'Find files by name', flags: 'Recursively search directory hierarchy. -type f (files), -type d (dirs), -size +100M, -mtime -7, -perm -4000 (SUID).', sample: 'find /var/log -type f -name "*.log" | head -n 4', output: '/var/log/auth.log\n/var/log/syslog.log\n/var/log/dpkg.log\n/var/log/nginx/access.log' },
            { cmd: 'diff file1 file2', desc: 'Compare text files', flags: 'Compare two files line by line. -u unified diff format (ideal for git patches), -y side-by-side columns.', sample: 'diff -u file_v1.conf file_v2.conf', output: '--- file_v1.conf\n+++ file_v2.conf\n@@ -3,4 +3,4 @@\n port = 8080\n-debug = true\n+debug = false' }
        ]
    },
    {
        id: 'permissions',
        name: 'Permissions',
        icon: '🛡️',
        color: '#a855f7',
        cssClass: 'cat-permissions',
        side: 'left',
        boxPos: { x: 530, y: 495 },
        items: [
            { cmd: 'chmod 755 file', desc: 'Change file permissions', flags: 'Numeric octal mode: 7 (rwx) owner, 5 (r-x) group, 5 (r-x) others. Or symbolic mode: chmod +x script.sh, chmod u=rw,go=r file.', sample: 'chmod 755 /opt/scanner.sh && ls -l /opt/scanner.sh', output: '-rwxr-xr-x 1 root root 4096 Oct 16 15:30 /opt/scanner.sh' },
            { cmd: 'chown user:group file', desc: 'Change ownership', flags: 'Change owner and/or group of file or directory. Use -R for recursive ownership changes across entire folder trees.', sample: 'chown -R www-data:www-data /var/www/html', output: 'Changed ownership of /var/www/html to user "www-data" and group "www-data"' }
        ]
    },
    {
        id: 'networking',
        name: 'Networking',
        icon: '🌐',
        color: '#f97316',
        cssClass: 'cat-networking',
        side: 'left',
        boxPos: { x: 530, y: 740 },
        items: [
            { cmd: 'ssh user@host', desc: 'Remote secure login', flags: 'OpenSSH encrypted remote shell client. -p [port], -i [identity_file.pem], -D [port] dynamic SOCKS proxy, -L local port forward.', sample: 'ssh -i id_ed25519 root@10.10.10.50', output: 'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-45-generic x86_64)\nLast login: Fri Oct 16 15:10:00 2026 from 10.10.10.1\nroot@pwnbox-target:~# ' },
            { cmd: 'scp file user@host:/path', desc: 'Secure file copy', flags: 'Copy files securely over SSH tunnel. -r recursive directory copy, -P custom port, -C compression enabled.', sample: 'scp /opt/payload.bin analyst@192.168.1.200:/tmp/', output: 'payload.bin                 100% 1024KB   8.2MB/s   00:00' },
            { cmd: 'curl URL', desc: 'Fetch headers quickly', flags: 'Command line data transfer tool. -I fetch HTTP headers only, -s silent, -L follow redirects, -X POST, -d "data".', sample: 'curl -I https://pwnbox.web.app', output: 'HTTP/2 200 \ncontent-type: text/html; charset=utf-8\nserver: Google Frontend\nstrict-transport-security: max-age=31536000; includeSubDomains\nx-frame-options: SAMEORIGIN\nx-xss-protection: 1; mode=block' },
            { cmd: 'wget URL', desc: 'Download from web', flags: 'Non-interactive network downloader. -O output_filename, -c resume broken downloads, -q quiet, -b background.', sample: 'wget -c https://files.cyber.org/tools.tar.gz', output: '2026-10-16 16:05:00 (12.4 MB/s) - ‘tools.tar.gz’ saved [15420180/15420180]' },
            { cmd: 'ping host', desc: 'Test reachability', flags: 'Send ICMP ECHO_REQUEST packets. -c [count] stop after N packets, -i [interval] seconds between sends.', sample: 'ping -c 4 1.1.1.1', output: 'PING 1.1.1.1 (1.1.1.1) 56(84) bytes of data.\n64 bytes from 1.1.1.1: icmp_seq=1 ttl=58 time=12.4 ms\n64 bytes from 1.1.1.1: icmp_seq=2 ttl=58 time=11.9 ms\n--- 1.1.1.1 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss' },
            { cmd: 'traceroute host', desc: 'Trace route hops', flags: 'Print route network packets take to reach network host with hop latencies. -n numeric IP addresses.', sample: 'traceroute -n 8.8.8.8', output: 'traceroute to 8.8.8.8 (8.8.8.8), 30 hops max\n 1  192.168.1.1  1.120 ms\n 2  10.240.0.1   8.450 ms\n 3  8.8.8.8       12.110 ms' },
            { cmd: 'ip a', desc: 'Show IP addresses', flags: 'Modern iproute2 suite utility to inspect and manipulate routing, network devices, and tunnel interfaces.', sample: 'ip a show eth0', output: '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000\n    inet 192.168.1.150/24 brd 192.168.1.255 scope global dynamic eth0' },
            { cmd: 'ss -tulpn', desc: 'List listening ports', flags: '-t TCP, -u UDP, -l listening sockets, -p showing process using socket, -n numeric port numbers.', sample: 'ss -tulpn', output: 'Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process\ntcp    LISTEN  0       128      0.0.0.0:22           0.0.0.0:*          users:(("sshd",pid=840,fd=3))\ntcp    LISTEN  0       511      0.0.0.0:80           0.0.0.0:*          users:(("nginx",pid=1210,fd=6))' },
            { cmd: 'netstat -tulpn', desc: 'Network ports (legacy)', flags: 'Legacy net-tools utility to print active network connections, routing tables, and interface statistics.', sample: 'netstat -tulpn', output: 'Active Internet connections (only servers)\nProto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name\ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      840/sshd\ntcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      950/mysqld' },
            { cmd: 'ifconfig', desc: 'Interface info (legacy)', flags: 'Legacy interface configuration tool to view IP address, broadcast, netmask, RX/TX packet counts, errors.', sample: 'ifconfig eth0', output: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.150  netmask 255.255.255.0  broadcast 192.168.1.255\n        rx packets 894520  bytes 782410291 (746.1 MB)' },
            { cmd: 'ufw status/ufw allow 22', desc: 'Simple firewall rules', flags: 'Uncomplicated Firewall (UFW) CLI interface to manage iptables rules. ufw enable, ufw status numbered.', sample: 'sudo ufw status verbose', output: 'Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing), disabled (routed)\nNew profiles: skip\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW IN    Anywhere\n80/tcp                     ALLOW IN    Anywhere' },
            { cmd: 'iptables -L', desc: 'List firewall rules', flags: 'Inspect netfilter packet filter chains (INPUT, FORWARD, OUTPUT). -n numeric, -v verbose, -t nat (NAT table).', sample: 'sudo iptables -L -n -v', output: 'Chain INPUT (policy ACCEPT 1024 packets, 84KB)\n pkts bytes target     prot opt in     out     source               destination\n  840 52800 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22' }
        ]
    },
    {
        id: 'archiving',
        name: 'Archiving',
        icon: '🗜️',
        color: '#ec4899',
        cssClass: 'cat-archiving',
        side: 'left',
        boxPos: { x: 560, y: 940 },
        items: [
            { cmd: 'tar -czf/-xzf a.tgz [dir]', desc: 'Create/extract archives', flags: 'Tape Archive utility. -c create, -x extract, -z gzip compression, -f filename, -v verbose progress output.', sample: 'tar -czvf backup.tar.gz /etc/nginx/', output: 'tar: Removing leading `/` from member names\n/etc/nginx/\n/etc/nginx/nginx.conf\n/etc/nginx/sites-available/default\nbackup.tar.gz created successfully.' },
            { cmd: 'zip -r a.zip dir', desc: 'Create zip archive', flags: 'Package and compress files into standard PKZIP format. -r recurse into directories, -e encrypt with password.', sample: 'zip -r pentest_reports.zip ./reports/', output: '  adding: reports/ (stored 0%)\n  adding: reports/recon_nmap.txt (deflated 72%)\n  adding: reports/vuln_audit.pdf (deflated 14%)' },
            { cmd: 'unzip a.zip', desc: 'Extract zip archive', flags: 'Extract compressed ZIP files. -l list contents without extracting, -d [dest] specify target extraction directory.', sample: 'unzip pentest_reports.zip -d /tmp/audit/', output: 'Archive:  pentest_reports.zip\n   creating: /tmp/audit/reports/\n  inflating: /tmp/audit/reports/recon_nmap.txt\n  inflating: /tmp/audit/reports/vuln_audit.pdf' }
        ]
    },
    {
        id: 'package_management',
        name: 'Package Management',
        icon: '📦',
        color: '#06b6d4',
        cssClass: 'cat-pkg-mgmt',
        side: 'left',
        boxPos: { x: 530, y: 1100 },
        items: [
            { cmd: 'apt', desc: 'Debian/Ubuntu', flags: 'Advanced Package Tool. apt update (sync repos), apt install -y [pkg], apt remove [pkg], apt upgrade (update all installed).', sample: 'sudo apt update && sudo apt install -y nmap', output: 'Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed: nmap\nSetting up nmap (7.94+git20230807.3be01b1-1build1) ...' },
            { cmd: 'dnf', desc: 'Fedora/RHEL', flags: 'Dandified YUM package manager for modern Fedora, CentOS Stream, Rocky Linux, RHEL 8/9. dnf install, dnf check-update.', sample: 'sudo dnf install -y wireshark', output: 'Installed:\n  wireshark-cli-4.2.4-1.fc40.x86_64\nComplete!' },
            { cmd: 'yum', desc: 'Legacy RHEL', flags: 'Yellowdog Updater Modified package manager for legacy RHEL 6/7, CentOS 7 systems. yum install, yum clean all.', sample: 'sudo yum install -y epel-release', output: 'Loaded plugins: fastestmirror\nRunning transaction\nInstalled: epel-release.noarch 0:7-14\nComplete!' },
            { cmd: 'zypper', desc: 'openSUSE', flags: 'Command-line package manager for openSUSE and SUSE Linux Enterprise. zypper in [pkg], zypper up, zypper se [term].', sample: 'sudo zypper install -y git', output: 'Retrieving package git-2.43.0-1.1.x86_64\nInstalling: git-2.43.0-1.1.x86_64 ... [done]' },
            { cmd: 'snap', desc: 'Universal app packages', flags: 'Canonical sandboxed universal package system with all dependencies bundled together. snap install [app], snap list.', sample: 'sudo snap install micro --classic', output: 'micro 2.0.14 from Zachary Yedidia (zyedidia) installed' }
        ]
    },

    // RIGHT SIDE CATEGORIES (Exact from Slide 13)
    {
        id: 'file_management',
        name: 'File Management',
        icon: '📁',
        color: '#c084fc',
        cssClass: 'cat-file-mgmt',
        side: 'right',
        boxPos: { x: 1180, y: 190 },
        items: [
            { cmd: 'ls', desc: 'List directory contents', flags: 'List directory contents. -l long details (permissions, owner, size, date), -a all including hidden files, -h human sizes.', sample: 'ls -lah', output: 'total 32K\ndrwxr-xr-x 4 analyst analyst 4.0K Oct 16 16:00 .\ndrwxr-xr-x 3 root    root    4.0K Oct 16 12:00 ..\n-rw-r--r-- 1 analyst analyst  220 Oct 16 12:00 .bash_logout\n-rw-r--r-- 1 analyst analyst 3.7K Oct 16 12:00 .bashrc\n-rwxr-xr-x 1 analyst analyst 4.0K Oct 16 15:45 exploit.py' },
            { cmd: 'pwd', desc: 'Print current directory', flags: 'Print full absolute path of current working directory. -P resolve physical directory avoiding symlinks.', sample: 'pwd', output: '/home/analyst/cyber_labs' },
            { cmd: 'cd', desc: 'Change directory', flags: 'Change working directory. cd ~ home, cd .. parent directory, cd - toggle previous directory, cd / root.', sample: 'cd /var/log && pwd', output: '/var/log' },
            { cmd: 'touch file', desc: 'Create empty file', flags: 'Create zero-byte file if it does not exist, or update access and modification timestamps of existing file.', sample: 'touch intel_log.txt && ls -l intel_log.txt', output: '-rw-r--r-- 1 analyst analyst 0 Oct 16 16:10 intel_log.txt' },
            { cmd: 'mkdir dir', desc: 'Create directory', flags: 'Create directory. -p creates entire parent path hierarchy without error if intermediate directories already exist.', sample: 'mkdir -p /opt/tools/recon/scripts', output: 'Directories created: /opt/tools/recon/scripts' },
            { cmd: 'rmdir dir', desc: 'Remove empty directory', flags: 'Safely removes empty directories. Fails if directory contains any files or child directories.', sample: 'rmdir old_empty_folder', output: 'Directory old_empty_folder removed.' },
            { cmd: 'cp src dest', desc: 'Copy files/directories', flags: 'Copy files or directories. -r recursive directory copy, -p preserve file timestamps/permissions, -v verbose.', sample: 'cp -rp /etc/nginx /etc/nginx.bak', output: 'Backup created: /etc/nginx.bak' },
            { cmd: 'mv src dest', desc: 'Move/rename files', flags: 'Move file to a new path or rename in place. -i interactive prompt before overwrite, -u update only if newer.', sample: 'mv script.sh run.sh && ls run.sh', output: 'run.sh' },
            { cmd: 'rm', desc: 'Remove files/directories', flags: 'Remove files. -r recursive directory deletion, -f force deletion without prompt. (Exercise caution with rm -rf).', sample: 'rm -rf /tmp/temp_scan_dir', output: 'Removed directory /tmp/temp_scan_dir' },
            { cmd: 'ln -s target link', desc: 'Create symbolic link', flags: 'Create link between files. -s creates symbolic (soft) shortcut link pointing to target path.', sample: 'ln -s /usr/bin/python3 /usr/local/bin/py && ls -l /usr/local/bin/py', output: 'lrwxrwxrwx 1 root root 16 Oct 16 16:12 /usr/local/bin/py -> /usr/bin/python3' },
            { cmd: 'clear', desc: 'Clear terminal screen', flags: 'Clears the terminal screen viewport and scrollback buffer. Equivalent keyboard shortcut: Ctrl+L.', sample: 'clear', output: '[Terminal viewport cleared]' }
        ]
    },
    {
        id: 'user_management',
        name: 'User Management',
        icon: '👥',
        color: '#2dd4bf',
        cssClass: 'cat-user-mgmt',
        side: 'right',
        boxPos: { x: 1180, y: 440 },
        items: [
            { cmd: 'whoami', desc: 'Show current user', flags: 'Print the effective username associated with the current running process or login shell.', sample: 'whoami', output: 'analyst' },
            { cmd: 'sudo cmd', desc: 'Run as root', flags: 'Execute command with superuser security privileges based on /etc/sudoers rules. -i interactive root shell.', sample: 'sudo whoami', output: 'root' },
            { cmd: 'su - user', desc: 'Switch user account', flags: 'Substitute user identity. The dash (-) simulates a full login, resetting environment variables and PATH.', sample: 'su - root', output: 'Password: \nroot@pwnbox:~# whoami\nroot' },
            { cmd: 'passwd', desc: 'Change user password', flags: 'Update user authentication tokens in /etc/shadow. Regular users can change their own password; root can change any.', sample: 'passwd analyst', output: 'Changing password for analyst.\nCurrent password: \nNew password: \nRetype new password: \npasswd: password updated successfully' },
            { cmd: 'useradd user', desc: 'Create user account', flags: 'Low-level Linux utility to add user. -m create home dir (/home/user), -s set shell (/bin/bash), -G secondary groups.', sample: 'sudo useradd -m -s /bin/bash secops', output: 'User secops created with home directory /home/secops' },
            { cmd: 'adduser user', desc: 'Guided user creation', flags: 'Interactive, user-friendly Perl script wrapper around useradd on Debian/Ubuntu that prompts for password and details.', sample: 'sudo adduser devops', output: 'Adding user `devops` ...\nAdding new group `devops` (1003) ...\nAdding new user `devops` (1003) with group `devops` ...\nCreating home directory `/home/devops` ...' },
            { cmd: 'exit', desc: 'Exit shell/session', flags: 'Terminate current shell session, logout from SSH server, or exit active terminal session.', sample: 'exit', output: 'logout\nConnection to 10.10.10.50 closed.' }
        ]
    },
    {
        id: 'disk_system_info',
        name: 'Disk & System Info',
        icon: '🖥️',
        color: '#3b82f6',
        cssClass: 'cat-disk-sys',
        side: 'right',
        boxPos: { x: 1180, y: 660 },
        items: [
            { cmd: 'df -h', desc: 'Disk space usage', flags: 'Report file system disk space usage. -h human-readable (GB, MB), -T display filesystem type (ext4, xfs, btrfs).', sample: 'df -h /', output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        80G   24G   53G  32% /' },
            { cmd: 'du -sh dir', desc: 'Directory size summary', flags: 'Estimate file and folder space usage. -s summarize total only, -h human-readable units, -c show grand total.', sample: 'du -sh /var/log', output: '1.2G    /var/log' },
            { cmd: 'free -h', desc: 'Memory usage summary', flags: 'Display total amount of free and used physical memory (RAM) and swap space. -h human-readable format.', sample: 'free -h', output: '               total        used        free      shared  buff/cache   available\nMem:            15Gi       3.8Gi       7.2Gi       240Mi       4.5Gi        11Gi\nSwap:          4.0Gi          0B       4.0Gi' },
            { cmd: 'uname -a', desc: 'Kernel/system details', flags: 'Print system information. -a kernel name, network node hostname, kernel release, version, machine architecture.', sample: 'uname -a', output: 'Linux pwnbox 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux' },
            { cmd: 'cal', desc: 'Show calendar', flags: 'Display a clean, formatted terminal calendar for the current month. cal [year] shows the entire 12-month calendar.', sample: 'cal 10 2026', output: '    October 2026      \nSu Mo Tu We Th Fr Sa  \n             1  2  3  \n 4  5  6  7  8  9 10  \n11 12 13 14 15 16 17  \n18 19 20 21 22 23 24  \n25 26 27 28 29 30 31  ' },
            { cmd: 'neofetch', desc: 'System info summary', flags: 'Fast, highly customizable CLI system information tool displaying stylized OS ASCII logo, uptime, CPU, GPU, memory.', sample: 'neofetch', output: '       _,met$$$$$gg.          analyst@pwnbox\n    ,g$$$$$$$$$$$$$$$P.       --------------\n  ,g$$P"     """Y$$.".        OS: Ubuntu 24.04 LTS x86_64\n ,$$P               `$$$.     Host: PwnBox Security Workstation\n,$$$$P     ,     $$$$$     Kernel: 6.8.0-45-generic\n$$$$$b.  ,     $$$$$"     Uptime: 4 days, 12 hours\n$$$$$$b     ,d$$$$P       Packages: 1420 (dpkg)\n`$$$$$$$b_ad$$$$P         Shell: bash 5.2.21\n  `"Y$$$$$$$$P"           Memory: 3820MiB / 15820MiB' }
        ]
    },
    {
        id: 'process_management',
        name: 'Process Management',
        icon: '⚙️',
        color: '#22c55e',
        cssClass: 'cat-proc-mgmt',
        side: 'right',
        boxPos: { x: 1180, y: 840 },
        items: [
            { cmd: 'ps aux', desc: 'List running processes', flags: 'a show processes for all users, u display user-oriented format (%CPU, %MEM), x show processes without a controlling TTY.', sample: 'ps aux | head -n 4', output: 'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot           1  0.0  0.1 168420 12840 ?        Ss   Oct12   0:04 /sbin/init\nroot           2  0.0  0.0      0     0 ?        S    Oct12   0:00 [kthreadd]\nsyslog       720  0.1  0.0 224100  4120 ?        Ssl  Oct12   1:12 /usr/sbin/rsyslogd' },
            { cmd: 'top', desc: 'Live process view', flags: 'Dynamic real-time monitor of active system processes, CPU consumption, memory allocation, load averages. Press [q] to exit.', sample: 'top', output: 'top - 16:15:02 up 4 days, 12:15,  1 user,  load average: 0.12, 0.08, 0.05\nTasks: 245 total,   1 running, 244 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  1.2 us,  0.4 sy,  0.0 ni, 98.2 id,  0.1 wa,  0.0 hi,  0.1 si\nMiB Mem :  15820.0 total,   7240.2 free,   3820.5 used,   4759.3 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1210 www-data  20   0  145200  28400  12400 S   1.8   0.2   2:14.20 nginx\n  840 root      20   0   18420   6120   4200 S   0.3   0.0   0:15.10 sshd' },
            { cmd: 'htop', desc: 'Better live process view', flags: 'Interactive text-mode process viewer. Features color-coded resource meters, mouse scrolling, tree view (F5), kill signal (F9).', sample: 'htop', output: '  [|||||||||||             24.2%]   Tasks: 120, 245 thr; 1 running\n  Mem[||||||||||||   3.82G/15.5G]   Load average: 0.12 0.08 0.05\n  Swp[                     0K/4G]   Uptime: 4 days, 12:15:00\n\n  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command\n 1210 www-data   20   0  145M 28.4M 12.4M S  1.8  0.2  2:14.20 /usr/sbin/nginx -g daemon on;' },
            { cmd: 'kill PID', desc: 'Terminate by PID', flags: 'Send termination signal to process ID. Default is SIGTERM (15, graceful). Use kill -9 [PID] for SIGKILL (unconditional force kill).', sample: 'kill -9 1337', output: 'Process 1337 terminated by SIGKILL' },
            { cmd: 'pkill name', desc: 'Kill by process name', flags: 'Signal processes based on full or partial program name. -f matches against full command line arguments, -u by specific username.', sample: 'pkill -f rogue_miner', output: 'Matched and terminated 2 process(es)' }
        ]
    },
    {
        id: 'system_control',
        name: 'System Control',
        icon: '⚡',
        color: '#64748b',
        cssClass: 'cat-sys-ctrl',
        side: 'right',
        boxPos: { x: 1140, y: 980 },
        items: [
            { cmd: 'systemctl status/start/stop svc', desc: 'Manage system services', flags: 'Control systemd system and service manager. start, stop, restart, reload, status, enable (start on boot), disable.', sample: 'sudo systemctl status sshd', output: '● ssh.service - OpenBSD Secure Shell server\n     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)\n     Active: active (running) since Sun 2026-10-12 04:00:00 UTC; 4 days ago\n   Main PID: 840 (sshd)\n      Tasks: 1 (limit: 18840)\n     Memory: 6.1M\n        CPU: 15.120s' },
            { cmd: 'reboot', desc: 'Restart system', flags: 'Instructs the operating system to safely reboot the local host machine immediately, closing active processes cleanly.', sample: 'sudo reboot', output: 'Broadcast message from root@pwnbox (pts/0):\n\nThe system is going down for reboot NOW!' },
            { cmd: 'shutdown -h now', desc: 'Power off now', flags: 'Bring system down safely. -h halts and powers off hardware. Or schedule: shutdown -h +15 "Maintenance shutdown".', sample: 'sudo shutdown -h now', output: 'Broadcast message from root@pwnbox (pts/0):\n\nThe system is going down for power-off NOW!' }
        ]
    },
    {
        id: 'help_reference',
        name: 'Help & Reference',
        icon: '📖',
        color: '#ef4444',
        cssClass: 'cat-help-ref',
        side: 'right',
        boxPos: { x: 1180, y: 1120 },
        items: [
            { cmd: 'man cmd', desc: 'Open manual page', flags: 'Interface to the on-line system reference manuals. Section 1 (User commands), Section 5 (File formats), Section 8 (Sys admin).', sample: 'man ls', output: 'LS(1)                            User Commands                           LS(1)\n\nNAME\n       ls - list directory contents\n\nSYNOPSIS\n       ls [OPTION]... [FILE]...\n\nDESCRIPTION\n       List information about the FILEs (the current directory by default).' },
            { cmd: 'whatis cmd', desc: 'One-line description', flags: 'Display single-line manual page descriptions from the pre-indexed whatis database for instant quick lookup.', sample: 'whatis grep', output: 'grep (1)             - print lines that match patterns' },
            { cmd: 'which cmd', desc: 'Show command path', flags: 'Locate executable binary path that would be executed in the current environment by searching user $PATH directories.', sample: 'which python3', output: '/usr/bin/python3' },
            { cmd: 'whereis cmd', desc: 'Find binary/source', flags: 'Locate binary executable, source files, and man page documentation for the specified command.', sample: 'whereis nmap', output: 'nmap: /usr/bin/nmap /usr/share/nmap /usr/share/man/man1/nmap.1.gz' },
            { cmd: 'history', desc: 'Show command history', flags: 'Display GNU readline command history with chronological line numbers. !N re-executes command line N, !! re-executes last.', sample: 'history | tail -n 5', output: '  498  sudo systemctl restart nginx\n  499  cat /var/log/nginx/error.log\n  500  git status\n  501  git commit -m "update config"\n  502  history | tail -n 5' }
        ]
    }
];

// Interactive Mind Map State
const mindMapState = {
    zoom: 0.85,
    panX: 0,
    panY: 0,
    isPanning: false,
    startX: 0,
    startY: 0,
    activeFilter: 'all',
    searchQuery: '',
    selectedNode: null
};

// ==========================================================================
// RENDER MIND MAP NODES & SVG CONNECTORS
// ==========================================================================
function renderMindMap() {
    const surface = document.getElementById('mindmapSurface');
    const svgLayer = document.getElementById('mindmapSvgLayer');
    if (!surface || !svgLayer) return;

    // Clear existing nodes except center hub
    surface.querySelectorAll('.mindmap-category-card, .mindmap-node-pair').forEach(el => el.remove());
    svgLayer.innerHTML = '';

    const centerHubPos = { x: 860, y: 690 };

    LINUX_CATEGORIES.forEach(cat => {
        // 1. Draw dashed connecting ray from Center Hub to Category Box
        const ray = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startX = centerHubPos.x;
        const startY = centerHubPos.y;
        const endX = cat.boxPos.x;
        const endY = cat.boxPos.y;

        // Smooth cubic bezier or direct dashed line
        const midX = (startX + endX) / 2;
        const d = `M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`;
        ray.setAttribute('d', d);
        ray.setAttribute('class', 'mindmap-center-ray');
        ray.setAttribute('data-category', cat.id);
        svgLayer.appendChild(ray);

        // 2. Create Category Card Box
        const card = document.createElement('div');
        card.className = `mindmap-category-card ${cat.cssClass}`;
        card.setAttribute('data-category', cat.id);
        card.style.left = `${cat.boxPos.x - 85}px`;
        card.style.top = `${cat.boxPos.y - 41}px`;
        card.innerHTML = `
            <span class="category-icon">${cat.icon}</span>
            <span class="category-title">${cat.name}</span>
        `;
        card.addEventListener('click', () => {
            playCyberSound('click');
            focusCategory(cat.id);
        });
        surface.appendChild(card);

        // 3. Render individual command nodes branching outward
        const totalItems = cat.items.length;
        const isLeft = cat.side === 'left';
        
        // Calculate vertical spacing spread for this category
        let stepY = 28;
        if (totalItems <= 3) stepY = 34;
        else if (totalItems >= 10) stepY = 25;

        const startItemY = cat.boxPos.y - ((totalItems - 1) * stepY) / 2;

        cat.items.forEach((item, idx) => {
            const itemY = startItemY + (idx * stepY);
            
            // X positioning matching slide mirror symmetry:
            // Left categories: [Description Capsule] <-- [Command Pill] <--- Category Box
            // Right categories: Category Box ---> [Command Pill] ---> [Description Capsule]
            let pairX;
            if (isLeft) {
                pairX = cat.boxPos.x - 120;
            } else {
                pairX = cat.boxPos.x + 120;
            }

            const pair = document.createElement('div');
            pair.className = 'mindmap-node-pair';
            pair.setAttribute('data-category', cat.id);
            pair.setAttribute('data-cmd', item.cmd.toLowerCase());
            pair.setAttribute('data-desc', item.desc.toLowerCase());

            if (isLeft) {
                // Description on left, Command pill on right connecting toward category
                pair.innerHTML = `
                    <div class="desc-capsule" title="${item.flags}">${item.desc}</div>
                    <span class="branch-arrow">←</span>
                    <div class="cmd-pill" title="Click to copy: ${item.cmd}">
                        <code>${escapeHtml(item.cmd)}</code>
                        <span class="cmd-copy-icon">📋</span>
                    </div>
                `;
                // Position so right edge aligns toward pairX
                pair.style.right = `${1720 - pairX}px`;
                pair.style.top = `${itemY - 14}px`;
            } else {
                // Command pill on left connecting to category, Description on right
                pair.innerHTML = `
                    <div class="cmd-pill" title="Click to copy: ${item.cmd}">
                        <code>${escapeHtml(item.cmd)}</code>
                        <span class="cmd-copy-icon">📋</span>
                    </div>
                    <span class="branch-arrow">→</span>
                    <div class="desc-capsule" title="${item.flags}">${item.desc}</div>
                `;
                pair.style.left = `${pairX}px`;
                pair.style.top = `${itemY - 14}px`;
            }

            // Click command pill to copy and inspect
            const cmdPill = pair.querySelector('.cmd-pill');
            cmdPill.addEventListener('click', (e) => {
                e.stopPropagation();
                copyLinuxCommand(item.cmd, cmdPill);
                openTerminalSimulator(item, cat);
            });

            const descCap = pair.querySelector('.desc-capsule');
            descCap.addEventListener('click', (e) => {
                e.stopPropagation();
                openTerminalSimulator(item, cat);
            });

            surface.appendChild(pair);

            // 4. Draw branch SVG connector curve between Category Box and Command Pill
            const branch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const boxAttachX = isLeft ? (cat.boxPos.x - 85) : (cat.boxPos.x + 85);
            const boxAttachY = cat.boxPos.y;
            const nodeAttachX = pairX;
            const nodeAttachY = itemY;

            const midBranchX = (boxAttachX + nodeAttachX) / 2;
            const branchD = `M ${boxAttachX} ${boxAttachY} C ${midBranchX} ${boxAttachY}, ${midBranchX} ${nodeAttachY}, ${nodeAttachX} ${nodeAttachY}`;
            branch.setAttribute('d', branchD);
            branch.setAttribute('class', 'branch-connector');
            branch.setAttribute('data-category', cat.id);
            branch.setAttribute('data-cmd', item.cmd.toLowerCase());
            svgLayer.appendChild(branch);
        });
    });

    applyFiltersAndSearch();
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ==========================================================================
// PAN & ZOOM CONTROLLER FOR MIND MAP CANVAS
// ==========================================================================
function setupPanZoom() {
    const wrap = document.getElementById('mindmapWrap');
    const surface = document.getElementById('mindmapSurface');
    if (!wrap || !surface) return;

    function updateTransform() {
        surface.style.transform = `translate(${mindMapState.panX}px, ${mindMapState.panY}px) scale(${mindMapState.zoom})`;
    }

    // Center the view on load
    centerView();

    // Mouse Dragging to Pan
    wrap.addEventListener('mousedown', (e) => {
        if (e.target.closest('.cmd-pill') || e.target.closest('.desc-capsule') || e.target.closest('.hud-btn')) return;
        mindMapState.isPanning = true;
        mindMapState.startX = e.clientX - mindMapState.panX;
        mindMapState.startY = e.clientY - mindMapState.panY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!mindMapState.isPanning) return;
        mindMapState.panX = e.clientX - mindMapState.startX;
        mindMapState.panY = e.clientY - mindMapState.startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        mindMapState.isPanning = false;
    });

    // Mouse Wheel Zoom
    wrap.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
        const newZoom = Math.max(0.4, Math.min(1.8, mindMapState.zoom + zoomDelta));
        
        // Zoom towards mouse pointer
        const rect = wrap.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        mindMapState.panX = mouseX - (mouseX - mindMapState.panX) * (newZoom / mindMapState.zoom);
        mindMapState.panY = mouseY - (mouseY - mindMapState.panY) * (newZoom / mindMapState.zoom);
        mindMapState.zoom = newZoom;
        updateTransform();
    }, { passive: false });

    // Touch Support for Mobile / Tablets
    let touchStartDist = 0;
    wrap.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            mindMapState.isPanning = true;
            mindMapState.startX = e.touches[0].clientX - mindMapState.panX;
            mindMapState.startY = e.touches[0].clientY - mindMapState.panY;
        } else if (e.touches.length === 2) {
            touchStartDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && mindMapState.isPanning) {
            mindMapState.panX = e.touches[0].clientX - mindMapState.startX;
            mindMapState.panY = e.touches[0].clientY - mindMapState.startY;
            updateTransform();
        } else if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = dist / touchStartDist;
            mindMapState.zoom = Math.max(0.4, Math.min(1.8, mindMapState.zoom * factor));
            touchStartDist = dist;
            updateTransform();
        }
    }, { passive: true });

    wrap.addEventListener('touchend', () => {
        mindMapState.isPanning = false;
    });

    // Expose helpers
    window.centerView = centerView;
    window.zoomMindMap = (factor) => {
        mindMapState.zoom = Math.max(0.4, Math.min(1.8, mindMapState.zoom + factor));
        updateTransform();
    };
    window.fitToScreen = () => {
        const wrapRect = wrap.getBoundingClientRect();
        const scaleX = wrapRect.width / 1720;
        const scaleY = wrapRect.height / 1380;
        mindMapState.zoom = Math.min(scaleX, scaleY) * 0.95;
        mindMapState.panX = (wrapRect.width - 1720 * mindMapState.zoom) / 2;
        mindMapState.panY = (wrapRect.height - 1380 * mindMapState.zoom) / 2;
        updateTransform();
    };

    function centerView() {
        const wrapRect = wrap.getBoundingClientRect();
        mindMapState.zoom = wrapRect.width > 1200 ? 0.68 : 0.48;
        mindMapState.panX = (wrapRect.width - 1720 * mindMapState.zoom) / 2;
        mindMapState.panY = (wrapRect.height - 1380 * mindMapState.zoom) / 2;
        updateTransform();
    }
}

// ==========================================================================
// SEARCH & FILTER ENGINE
// ==========================================================================
function setupSearchAndFilters() {
    const input = document.getElementById('linuxSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    const filterContainer = document.getElementById('categoryFilterChips');

    // Build filter chips
    if (filterContainer) {
        filterContainer.innerHTML = '';
        
        const allChip = document.createElement('button');
        allChip.className = 'filter-chip active';
        allChip.setAttribute('data-filter', 'all');
        allChip.innerHTML = '<span class="chip-dot" style="background:#00c8d7"></span> All Commands (70)';
        allChip.addEventListener('click', () => {
            setActiveFilter('all');
        });
        filterContainer.appendChild(allChip);

        LINUX_CATEGORIES.forEach(cat => {
            const chip = document.createElement('button');
            chip.className = 'filter-chip';
            chip.setAttribute('data-filter', cat.id);
            chip.innerHTML = `<span class="chip-dot" style="background:${cat.color}"></span> ${cat.name} (${cat.items.length})`;
            chip.addEventListener('click', () => {
                setActiveFilter(cat.id);
            });
            filterContainer.appendChild(chip);
        });
    }

    if (input) {
        input.addEventListener('input', (e) => {
            mindMapState.searchQuery = e.target.value.trim().toLowerCase();
            if (clearBtn) clearBtn.classList.toggle('active', mindMapState.searchQuery.length > 0);
            applyFiltersAndSearch();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (input) input.value = '';
            mindMapState.searchQuery = '';
            clearBtn.classList.remove('active');
            applyFiltersAndSearch();
        });
    }
}

function setActiveFilter(filterId) {
    mindMapState.activeFilter = filterId;
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-filter') === filterId);
    });
    playCyberSound('click');
    applyFiltersAndSearch();

    if (filterId !== 'all') {
        focusCategory(filterId);
    }
}

function focusCategory(catId) {
    const cat = LINUX_CATEGORIES.find(c => c.id === catId);
    if (!cat) return;

    const wrap = document.getElementById('mindmapWrap');
    if (!wrap) return;

    const wrapRect = wrap.getBoundingClientRect();
    mindMapState.zoom = 1.05;
    mindMapState.panX = (wrapRect.width / 2) - (cat.boxPos.x * mindMapState.zoom);
    mindMapState.panY = (wrapRect.height / 2) - (cat.boxPos.y * mindMapState.zoom);

    const surface = document.getElementById('mindmapSurface');
    if (surface) {
        surface.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        surface.style.transform = `translate(${mindMapState.panX}px, ${mindMapState.panY}px) scale(${mindMapState.zoom})`;
        setTimeout(() => {
            surface.style.transition = '';
        }, 400);
    }
}

function applyFiltersAndSearch() {
    const q = mindMapState.searchQuery;
    const filter = mindMapState.activeFilter;

    let matchCount = 0;

    // Filter Mind Map Nodes
    document.querySelectorAll('.mindmap-node-pair').forEach(pair => {
        const catId = pair.getAttribute('data-category');
        const cmd = pair.getAttribute('data-cmd');
        const desc = pair.getAttribute('data-desc');

        const matchesCat = (filter === 'all' || filter === catId);
        const matchesQuery = (!q || cmd.includes(q) || desc.includes(q));

        if (matchesCat && matchesQuery) {
            pair.classList.remove('dimmed');
            pair.classList.toggle('highlighted', Boolean(q));
            matchCount++;
        } else {
            pair.classList.add('dimmed');
            pair.classList.remove('highlighted');
        }
    });

    // Update connector branches
    document.querySelectorAll('.branch-connector').forEach(branch => {
        const catId = branch.getAttribute('data-category');
        const cmd = branch.getAttribute('data-cmd');

        const matchesCat = (filter === 'all' || filter === catId);
        const matchesQuery = (!q || cmd.includes(q));

        if (matchesCat && matchesQuery) {
            branch.style.opacity = '1';
            branch.classList.toggle('highlighted', Boolean(q));
        } else {
            branch.style.opacity = '0.12';
            branch.classList.remove('highlighted');
        }
    });

    // Update Center Hub Rays
    document.querySelectorAll('.mindmap-center-ray').forEach(ray => {
        const catId = ray.getAttribute('data-category');
        const matches = (filter === 'all' || filter === catId);
        ray.classList.toggle('highlighted', matches && filter !== 'all');
        ray.style.opacity = matches ? '0.85' : '0.15';
    });

    // Update Category Cards
    document.querySelectorAll('.mindmap-category-card').forEach(card => {
        const catId = card.getAttribute('data-category');
        const matches = (filter === 'all' || filter === catId);
        card.style.opacity = matches ? '1' : '0.35';
    });

    // Update Grid View items
    document.querySelectorAll('.grid-cmd-item').forEach(item => {
        const catId = item.getAttribute('data-category');
        const text = item.textContent.toLowerCase();

        const matchesCat = (filter === 'all' || filter === catId);
        const matchesQuery = (!q || text.includes(q));

        item.style.display = (matchesCat && matchesQuery) ? 'flex' : 'none';
    });

    document.querySelectorAll('.grid-category-box').forEach(box => {
        const visibleItems = box.querySelectorAll('.grid-cmd-item[style*="display: flex"]');
        box.style.display = visibleItems.length > 0 ? 'block' : 'none';
    });

    // Update match count badge in UI
    const counter = document.getElementById('searchMatchCount');
    if (counter) {
        counter.textContent = q ? `${matchCount} MATCHES` : '70 COMMANDS';
    }
}

// ==========================================================================
// GRID VIEW GENERATOR
// ==========================================================================
function renderGridView() {
    const grid = document.getElementById('linuxGridView');
    if (!grid) return;

    grid.innerHTML = '';
    LINUX_CATEGORIES.forEach(cat => {
        const box = document.createElement('div');
        box.className = 'grid-category-box';
        box.setAttribute('data-category', cat.id);
        box.style.borderTop = `3px solid ${cat.color}`;

        let itemsHtml = '';
        cat.items.forEach(item => {
            itemsHtml += `
                <div class="grid-cmd-item" data-category="${cat.id}">
                    <span class="grid-cmd-code">${escapeHtml(item.cmd)}</span>
                    <span class="grid-cmd-desc">${escapeHtml(item.desc)}</span>
                </div>
            `;
        });

        box.innerHTML = `
            <div class="grid-category-header">
                <span class="grid-cat-title">${cat.icon} ${cat.name}</span>
                <span class="grid-cat-badge">${cat.items.length} cmds</span>
            </div>
            <div class="grid-cmd-list">
                ${itemsHtml}
            </div>
        `;

        // Click handlers in grid view
        box.querySelectorAll('.grid-cmd-item').forEach((row, idx) => {
            row.addEventListener('click', () => {
                const item = cat.items[idx];
                copyLinuxCommand(item.cmd, row);
                openTerminalSimulator(item, cat);
            });
        });

        grid.appendChild(box);
    });
}

// ==========================================================================
// VIEW SWITCHER: MIND MAP VS GRID
// ==========================================================================
function setupViewSwitcher() {
    const btnMindMap = document.getElementById('btnViewMindMap');
    const btnGrid = document.getElementById('btnViewGrid');
    const mindmapWrap = document.getElementById('mindmapWrap');
    const gridView = document.getElementById('linuxGridView');

    if (btnMindMap && btnGrid && mindmapWrap && gridView) {
        btnMindMap.addEventListener('click', () => {
            btnMindMap.classList.add('active');
            btnGrid.classList.remove('active');
            mindmapWrap.style.display = 'block';
            gridView.classList.remove('active');
            playCyberSound('click');
        });

        btnGrid.addEventListener('click', () => {
            btnGrid.classList.add('active');
            btnMindMap.classList.remove('active');
            mindmapWrap.style.display = 'none';
            gridView.classList.add('active');
            playCyberSound('click');
        });
    }

    const btnFullscreen = document.getElementById('btnToggleFullscreen');
    if (btnFullscreen && mindmapWrap) {
        btnFullscreen.addEventListener('click', () => {
            mindmapWrap.classList.toggle('is-fullscreen');
            btnFullscreen.textContent = mindmapWrap.classList.contains('is-fullscreen') ? '✕ Exit' : '⛶ Fullscreen';
            playCyberSound('open');
            setTimeout(() => {
                if (window.fitToScreen) window.fitToScreen();
            }, 100);
        });
    }
}

// ==========================================================================
// COPY COMMAND TO CLIPBOARD & TOAST NOTIFICATION
// ==========================================================================
function copyLinuxCommand(cmdText, triggerEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmdText);
    } else {
        const ta = document.createElement('textarea');
        ta.value = cmdText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }

    playCyberSound('copy');

    if (triggerEl) {
        triggerEl.classList.add('copied');
        setTimeout(() => triggerEl.classList.remove('copied'), 600);
    }

    showToast(`COPIED TO CLIPBOARD: ${cmdText}`);
}

function showToast(msg) {
    let toast = document.getElementById('linuxToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'linuxToast';
        toast.className = 'linux-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 2200);
}

// ==========================================================================
// INTERACTIVE LIVE TERMINAL SANDBOX MODAL
// ==========================================================================
function setupTerminalSimulator() {
    const modal = document.getElementById('terminalModal');
    const closeBtn = document.getElementById('terminalCloseBtn');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeTerminalSimulator);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeTerminalSimulator();
        }
    });

    const copyBtn = document.getElementById('btnTerminalCopyCmd');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (mindMapState.selectedNode) {
                copyLinuxCommand(mindMapState.selectedNode.cmd);
            }
        });
    }

    // Terminal Input execution simulation
    const termInput = document.getElementById('terminalCliInput');
    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const typed = termInput.value.trim();
                if (!typed) return;
                termInput.value = '';
                simulateCliExecution(typed);
            }
        });
    }
}

function openTerminalSimulator(item, cat) {
    mindMapState.selectedNode = item;
    const modal = document.getElementById('terminalModal');
    if (!modal) return;

    playCyberSound('open');

    // Populate Intel details
    document.getElementById('terminalCatBadge').textContent = `// ${cat.name.toUpperCase()} COMMAND`;
    document.getElementById('terminalCatBadge').style.color = cat.color;
    document.getElementById('terminalCmdName').textContent = item.cmd;
    document.getElementById('terminalCmdDesc').textContent = item.desc;
    document.getElementById('terminalCmdFlags').textContent = `Flags & Usage: ${item.flags}`;

    // Populate Terminal Screen with simulated live execution
    const screen = document.getElementById('terminalOutputScreen');
    if (screen) {
        screen.innerHTML = `
            <div style="color:#64748b; margin-bottom: 8px;">Linux pwnbox 6.8.0-45-generic x86_64 GNU/Linux - PwnBox Terminal Sandbox</div>
            <div style="color:#00ff66;">analyst@pwnbox:~$ <span style="color:#ffffff; font-weight: bold;">${escapeHtml(item.sample || item.cmd)}</span></div>
            <pre style="color:#e2e8f0; margin-top: 6px;">${escapeHtml(item.output || 'Execution complete.')}</pre>
        `;
    }

    modal.classList.add('active');
    const termInput = document.getElementById('terminalCliInput');
    if (termInput) {
        setTimeout(() => termInput.focus(), 150);
    }
}

function simulateCliExecution(cmd) {
    const screen = document.getElementById('terminalOutputScreen');
    if (!screen) return;

    playCyberSound('click');

    const clean = cmd.toLowerCase();
    let response = '';

    if (clean === 'clear') {
        screen.innerHTML = '';
        return;
    } else if (clean === 'whoami') {
        response = 'analyst';
    } else if (clean === 'pwd') {
        response = '/home/analyst/cyber_labs';
    } else if (clean === 'help') {
        response = 'PwnBox Sandbox Shell: type any command from Slide 13 (ls, df -h, free -h, cat, whoami, uname -a, clear)';
    } else if (clean.startsWith('ls')) {
        response = 'total 24K\ndrwxr-xr-x 4 analyst analyst 4.0K Oct 16 16:15 .\n-rw-r--r-- 1 analyst analyst 1.2K Oct 16 16:15 exploit.sh\n-rw-r--r-- 1 analyst analyst 4.5K Oct 16 16:15 targets.txt';
    } else if (clean.startsWith('uname')) {
        response = 'Linux pwnbox 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    } else if (clean.startsWith('free')) {
        response = '               total        used        free      shared  buff/cache   available\nMem:            15Gi       3.8Gi       7.2Gi       240Mi       4.5Gi        11Gi';
    } else if (clean.startsWith('df')) {
        response = 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        80G   24G   53G  32% /';
    } else {
        response = `pwnbox-sandbox: executed "${escapeHtml(cmd)}" successfully. (Exit code: 0)`;
    }

    const entry = document.createElement('div');
    entry.style.marginTop = '10px';
    entry.innerHTML = `
        <div style="color:#00ff66;">analyst@pwnbox:~$ <span style="color:#ffffff;">${escapeHtml(cmd)}</span></div>
        <pre style="color:#e2e8f0; margin-top: 4px;">${escapeHtml(response)}</pre>
    `;
    screen.appendChild(entry);
    screen.scrollTop = screen.scrollHeight;
}

function closeTerminalSimulator() {
    const modal = document.getElementById('terminalModal');
    if (modal) {
        modal.classList.remove('active');
        playCyberSound('click');
    }
}

// Copy full cheat sheet
function copyAllCheatSheet() {
    let sheet = '# LINUX COMMANDS CHEAT SHEET (PwnBox Academy // Slide 13)\n\n';
    LINUX_CATEGORIES.forEach(cat => {
        sheet += `## ${cat.name}\n`;
        cat.items.forEach(it => {
            sheet += `- \`${it.cmd}\`: ${it.desc} (${it.flags})\n`;
        });
        sheet += '\n';
    });

    navigator.clipboard.writeText(sheet).then(() => {
        playCyberSound('copy');
        showToast('COPIED ALL 70 COMMANDS TO CLIPBOARD (MARKDOWN)!');
    });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    renderMindMap();
    renderGridView();
    setupPanZoom();
    setupSearchAndFilters();
    setupViewSwitcher();
    setupTerminalSimulator();

    // Export button
    const btnExport = document.getElementById('btnExportCheatSheet');
    if (btnExport) {
        btnExport.addEventListener('click', copyAllCheatSheet);
    }
});
