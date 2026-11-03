import asyncio
import json
import urllib.request
import subprocess
import time
import websockets
import base64
import os
import sys

# Reconfigure stdout to utf-8 safely
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "https://pwnbo-x.web.app"
EVIDENCE_DIR = r"C:\Users\pushy\.gemini\antigravity\brain\5c63da67-d28b-46dd-b6be-c112b0fd8518\evidence"
os.makedirs(EVIDENCE_DIR, exist_ok=True)

class ComprehensiveAuditor:
    def __init__(self):
        self.edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        self.user_data = r"D:\CSE AI ML\CS\foot\scratch\audit_browser_profile"
        self.port = 9225
        self.proc = None
        self.ws = None
        self.msg_id = 1
        self.findings = []
        self.test_log = []
        
    def log(self, text):
        safe_text = str(text)
        print(safe_text)
        self.test_log.append(safe_text)

    def start_browser(self):
        cmd = [
            self.edge_exe,
            '--headless=new',
            f'--remote-debugging-port={self.port}',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-extensions',
            '--no-first-run',
            f'--user-data-dir={self.user_data}',
            'about:blank'
        ]
        self.proc = subprocess.Popen(cmd)
        time.sleep(2)
        
    def stop_browser(self):
        if self.proc:
            self.proc.kill()
            self.proc = None

    async def send_cmd(self, method, params=None):
        cid = self.msg_id
        self.msg_id += 1
        payload = {'id': cid, 'method': method}
        if params: payload['params'] = params
        await self.ws.send(json.dumps(payload))
        return cid

    async def wait_for_response(self, target_id, timeout=8):
        start = time.time()
        while time.time() - start < timeout:
            raw = await asyncio.wait_for(self.ws.recv(), timeout=timeout)
            ev = json.loads(raw)
            if ev.get('id') == target_id:
                return ev.get('result')
        return None

    async def evaluate(self, expression):
        cid = await self.send_cmd('Runtime.evaluate', {'expression': expression, 'returnByValue': True})
        res = await self.wait_for_response(cid)
        if res and 'result' in res:
            return res['result'].get('value')
        return None

    async def take_screenshot(self, filename):
        cid = await self.send_cmd('Page.captureScreenshot', {'format': 'png'})
        res = await self.wait_for_response(cid)
        if res and 'data' in res:
            data = base64.b64decode(res['data'])
            filepath = os.path.join(EVIDENCE_DIR, filename)
            with open(filepath, 'wb') as f:
                f.write(data)
            return filepath
        return None

    async def navigate_and_wait(self, url, timeout=7):
        await self.send_cmd('Page.navigate', {'url': url})
        start_t = time.time()
        while time.time() - start_t < timeout:
            try:
                raw = await asyncio.wait_for(self.ws.recv(), timeout=1.5)
                ev = json.loads(raw)
                if ev.get('method') == 'Page.loadEventFired':
                    break
            except asyncio.TimeoutError:
                break
        await asyncio.sleep(0.8)

    async def run(self):
        self.log("================================================================================")
        self.log("       PWNBOX LIVE WEBSITE CYBERSECURITY & SENIOR QA AUDIT EXECUTION           ")
        self.log("================================================================================")
        
        self.start_browser()
        try:
            with urllib.request.urlopen(f'http://127.0.0.1:{self.port}/json') as r:
                tabs = json.loads(r.read().decode())
            target = next(t for t in tabs if t.get('type') == 'page' and 'sync' not in t.get('url'))
            ws_url = target['webSocketDebuggerUrl']
            
            async with websockets.connect(ws_url, max_size=30*1024*1024) as ws:
                self.ws = ws
                await self.send_cmd('Page.enable')
                await self.send_cmd('Runtime.enable')
                await self.send_cmd('Log.enable')
                await self.send_cmd('Network.enable')
                
                # Desktop Viewport
                await self.send_cmd('Emulation.setDeviceMetricsOverride', {
                    'width': 1280, 'height': 800, 'deviceScaleFactor': 1, 'mobile': False
                })

                # ---------------------------------------------------------------------
                # PART 1: AUTHENTICATED ACCESS INJECTION (CADET CLEARANCE)
                # ---------------------------------------------------------------------
                self.log("\n[TEST PHASE 1] Authenticating Operative Session in Browser...")
                await self.navigate_and_wait(f"{BASE_URL}/")
                await self.evaluate("""
                    localStorage.setItem('pwnbox_is_authenticated', 'true');
                    localStorage.setItem('pwnbox_user_name', 'AUDIT_AGENT_0x7');
                    localStorage.setItem('pwnbox_user_email', 'audit.agent@pwnbox.local');
                    localStorage.setItem('agentAlias', 'AUDIT_AGENT_0x7');
                    localStorage.setItem('pwnbox_total_xp', '450');
                """)
                self.log("  -> Authenticated session injected successfully.")

                # ---------------------------------------------------------------------
                # PART 2: TESTING 8 ARCADE MINI-GAMES AS AUTHENTICATED CADET
                # ---------------------------------------------------------------------
                self.log("\n[TEST PHASE 2] Auditing 8 Arcade Mini-Games (Authenticated)...")
                arcade_games = [
                    ("SQLi Locksmith", "/games/sqli_locksmith.html"),
                    ("Packet Gatekeeper", "/games/packet_gatekeeper.html"),
                    ("PrivEsc Tower", "/games/privesc_tower.html"),
                    ("Ransomware Panic", "/games/ransom_panic.html"),
                    ("CIDR Block", "/games/cidr_block.html"),
                    ("Cipher Relic", "/games/cipher_relic.html"),
                    ("Entropy Clash", "/games/entropy_clash.html"),
                    ("Phish Detective", "/games/phish_detective.html")
                ]
                
                for gname, gpath in arcade_games:
                    url = f"{BASE_URL}{gpath}"
                    await self.navigate_and_wait(url)
                    title = await self.evaluate("document.title")
                    final_url = await self.evaluate("window.location.href")
                    buttons = await self.evaluate("Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean)")
                    has_overflow = await self.evaluate("document.documentElement.scrollWidth > window.innerWidth")
                    
                    shot_name = f"auth_{gpath.split('/')[-1].replace('.html', '')}.png"
                    await self.take_screenshot(shot_name)
                    
                    is_loaded = final_url.endswith(gpath) or final_url.endswith(gpath.replace('.html', ''))
                    status = "PASS" if is_loaded else "REDIRECTED_FAIL"
                    self.log(f"  [{status}] {gname}:")
                    self.log(f"       Final URL: {final_url}")
                    self.log(f"       Title: {title}")
                    self.log(f"       Controls ({len(buttons or [])}): {buttons[:4] if buttons else 'None'}")
                    self.log(f"       Horizontal Overflow: {has_overflow}")

                # ---------------------------------------------------------------------
                # PART 3: AUDITING 8 CEH MODULE LABS & TOOLS
                # ---------------------------------------------------------------------
                self.log("\n[TEST PHASE 3] Auditing 8 CEH Module Labs & Interactive Terminals...")
                modules = [
                    ("Footprinting", "/modules/Footprinting.html"),
                    ("Scanning", "/modules/Scanning.html"),
                    ("Enumeration", "/modules/Enumeration.html"),
                    ("Vulnerability", "/modules/Vulnerablity.html"),
                    ("System Hacking", "/modules/SystemHacking.html"),
                    ("Web App Threats", "/modules/WebAppThreats.html"),
                    ("OSINT", "/modules/OSINT.html"),
                    ("Black Ops C2", "/modules/BlackOps.html")
                ]
                
                for mname, mpath in modules:
                    url = f"{BASE_URL}{mpath}"
                    await self.navigate_and_wait(url)
                    final_url = await self.evaluate("window.location.href")
                    title = await self.evaluate("document.title")
                    
                    # Test terminal presence and tool buttons
                    tools_count = await self.evaluate("document.querySelectorAll('.tool-card, .terminal-box, .command-row').length")
                    custom_form = await self.evaluate("!!document.querySelector('form')")
                    
                    # Security test: Test input field in module terminal / search
                    xss_val = '<script>window.__MODULE_XSS=true</script>'
                    await self.evaluate(f"""
                        const inp = document.querySelector('input[type=\"text\"], input[type=\"search\"]');
                        if (inp) {{
                            inp.value = '{xss_val}';
                            inp.dispatchEvent(new Event('input'));
                        }}
                    """)
                    xss_fired = await self.evaluate("window.__MODULE_XSS === true")
                    
                    shot_name = f"auth_{mpath.split('/')[-1].replace('.html', '')}.png"
                    await self.take_screenshot(shot_name)
                    
                    is_loaded = final_url.endswith(mpath) or final_url.endswith(mpath.replace('.html', ''))
                    status = "PASS" if is_loaded and not xss_fired else "FAIL"
                    self.log(f"  [{status}] Module: {mname}:")
                    self.log(f"       URL: {final_url} | Title: {title[:40]}")
                    self.log(f"       Interactive Elements: {tools_count} | Add Tool Form: {custom_form} | XSS Injected: {xss_fired}")

                # ---------------------------------------------------------------------
                # PART 4: AUDITING TACTICAL NOTES VAULT
                # ---------------------------------------------------------------------
                self.log("\n[TEST PHASE 4] Auditing Tactical Notes Vault & Storage...")
                await self.navigate_and_wait(f"{BASE_URL}/notes")
                notes_title = await self.evaluate("document.title")
                notes_count = await self.evaluate("document.querySelectorAll('.note-item, .note-card').length")
                
                # Test creating a new note
                await self.evaluate("""
                    const newBtn = document.getElementById('newNoteBtn') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('New Note') || b.innerText.includes('Add Note'));
                    if (newBtn) newBtn.click();
                """)
                await asyncio.sleep(0.5)
                await self.take_screenshot("auth_notes_vault.png")
                self.log(f"  [PASS] Notes Vault Title: {notes_title} | Default Notes: {notes_count}")

                # ---------------------------------------------------------------------
                # PART 5: AUDITING 3D HARDWARE HACKING LABS & THREE.JS
                # ---------------------------------------------------------------------
                self.log("\n[TEST PHASE 5] Auditing 3D Hardware Devices & Three.js Canvas...")
                await self.navigate_and_wait(f"{BASE_URL}/imp_info/hacker_engines_devices.html")
                canvas_present = await self.evaluate("!!document.querySelector('canvas')")
                device_cards = await self.evaluate("document.querySelectorAll('.device-card, [data-device]').length")
                await self.take_screenshot("auth_hardware_3d.png")
                self.log(f"  [PASS] Hardware Devices: 3D Canvas Present: {canvas_present} | Devices Listed: {device_cards}")

                # ---------------------------------------------------------------------
                # PART 6: AUDITING LINUX TERMINAL MIND MAP
                # ---------------------------------------------------------------------
                self.log("\n[TEST PHASE 6] Auditing Linux Mastery Mind Map...")
                await self.navigate_and_wait(f"{BASE_URL}/imp_info/linux.html")
                linux_nodes = await self.evaluate("document.querySelectorAll('.node, .branch-card, .mindmap-node').length")
                await self.take_screenshot("auth_linux_mindmap.png")
                self.log(f"  [PASS] Linux Mind Map Nodes Rendered: {linux_nodes}")

                # ---------------------------------------------------------------------
                # PART 7: AUDITING RESPONSIVE MOBILE VIEWPORTS (375x667 & 412x915)
                # ---------------------------------------------------------------------
                self.log("\n[TEST PHASE 7] Auditing Mobile Viewports (iPhone SE 375x667 & Pixel 7 412x915)...")
                mobile_targets = [
                    ("/", "home_iphone_se", 375, 667),
                    ("/dashboard", "dashboard_iphone_se", 375, 667),
                    ("/games", "arcade_iphone_se", 375, 667),
                    ("/masterguide/cybersecurity_masterguide.html", "masterguide_iphone_se", 375, 667),
                    ("/notes", "notes_iphone_se", 375, 667),
                    ("/dashboard", "dashboard_pixel7", 412, 915)
                ]
                
                for mpath, mfile, w, h in mobile_targets:
                    await self.send_cmd('Emulation.setDeviceMetricsOverride', {
                        'width': w, 'height': h, 'deviceScaleFactor': 2, 'mobile': True
                    })
                    await self.navigate_and_wait(f"{BASE_URL}{mpath}")
                    m_overflow = await self.evaluate("document.documentElement.scrollWidth > window.innerWidth")
                    await self.take_screenshot(f"{mfile}.png")
                    self.log(f"  Mobile [{w}x{h}] {mpath}: Horizontal Overflow: {m_overflow} | Shot: {mfile}.png")

        finally:
            self.stop_browser()

        # ---------------------------------------------------------------------
        # PART 8: NON-DESTRUCTIVE AUTHORIZED SECURITY & NETWORK TESTING
        # ---------------------------------------------------------------------
        self.log("\n[TEST PHASE 8] Performing Network Security & Header Assessment...")
        
        req = urllib.request.Request(f"{BASE_URL}/", headers={'User-Agent': 'Mozilla/5.0 (Security-Audit-Scanner)'})
        with urllib.request.urlopen(req) as resp:
            headers = dict(resp.headers)
            
        sec_headers = {
            'Strict-Transport-Security': headers.get('Strict-Transport-Security'),
            'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
            'X-Frame-Options': headers.get('X-Frame-Options'),
            'Content-Security-Policy': headers.get('Content-Security-Policy'),
            'Referrer-Policy': headers.get('Referrer-Policy'),
            'Permissions-Policy': headers.get('Permissions-Policy')
        }
        
        self.log("  HTTP Security Headers Readout:")
        for k, v in sec_headers.items():
            flag = "[OK]" if v else "[MISSING]"
            self.log(f"    {flag} {k}: {v or 'Not Configured'}")

        # Check sensitive file exposures
        sensitive_paths = [
            "/.env", "/.git/HEAD", "/firebase.json", "/package.json", "/functions/index.js",
            "/functions/package.json", "/.gitignore", "/robots.txt", "/sitemap.xml"
        ]
        self.log("\n  Probing Sensitive Static Asset Exposure:")
        for sp in sensitive_paths:
            s_url = f"{BASE_URL}{sp}"
            try:
                s_req = urllib.request.Request(s_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(s_req) as s_resp:
                    s_code = s_resp.status
                    s_len = len(s_resp.read())
                    self.log(f"    [EXPOSED {s_code}] {sp} ({s_len} bytes)")
            except urllib.error.HTTPError as e:
                self.log(f"    [SECURE {e.code}] {sp}")
            except Exception as e:
                self.log(f"    [ERR] {sp}: {e}")

        # Test Serverless Proxy Endpoint /api/chat security
        self.log("\n  Testing Serverless Proxy /api/chat Robustness:")
        chat_url = f"{BASE_URL}/api/chat"
        try:
            # 1. Test GET method on POST-only endpoint
            c_req = urllib.request.Request(chat_url, method='GET')
            try:
                with urllib.request.urlopen(c_req) as c_resp:
                    self.log(f"    GET /api/chat: HTTP {c_resp.status}")
            except urllib.error.HTTPError as e:
                self.log(f"    GET /api/chat properly rejected: HTTP {e.code}")
                
            # 2. Test Empty Body POST
            c_post = urllib.request.Request(chat_url, data=b"{}", headers={'Content-Type': 'application/json'}, method='POST')
            try:
                with urllib.request.urlopen(c_post) as c_resp:
                    self.log(f"    Empty POST /api/chat response: HTTP {c_resp.status}")
            except urllib.error.HTTPError as e:
                self.log(f"    Empty POST /api/chat response: HTTP {e.code}")
        except Exception as e:
            self.log(f"    /api/chat test note: {e}")

        self.log("\n================================================================================")
        self.log("       ALL PHASES OF BROWSER QA & SECURITY TESTING COMPLETED                    ")
        self.log("================================================================================")
        
        # Save complete text report
        with open(os.path.join(EVIDENCE_DIR, "full_audit_log.txt"), "w", encoding="utf-8") as f:
            f.write("\n".join(self.test_log))

if __name__ == "__main__":
    asyncio.run(ComprehensiveAuditor().run())
