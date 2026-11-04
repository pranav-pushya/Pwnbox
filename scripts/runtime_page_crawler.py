import asyncio
import json
import subprocess
import time
import urllib.request
import websockets
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "https://pwnbo-x.web.app"
USER_DATA = r"D:\CSE AI ML\CS\foot\scratch\audit_runtime_profile"
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PORT = 9226

os.makedirs(USER_DATA, exist_ok=True)

class RuntimeCrawler:
    def __init__(self):
        self.proc = None
        self.ws = None
        self.msg_id = 1
        self.console_logs = []
        self.network_errors = []

    def start_browser(self):
        cmd = [
            EDGE_EXE,
            '--headless=new',
            f'--remote-debugging-port={PORT}',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-extensions',
            '--no-first-run',
            f'--user-data-dir={USER_DATA}',
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
            self.handle_event(ev)
        return None

    def handle_event(self, ev):
        method = ev.get('method')
        params = ev.get('params', {})
        if method == 'Runtime.consoleAPICalled':
            t = params.get('type')
            args = params.get('args', [])
            val = ' '.join(str(a.get('value', '')) for a in args)
            if t in ['error', 'warning']:
                self.console_logs.append((t, val))
        elif method == 'Runtime.exceptionThrown':
            det = params.get('exceptionDetails', {})
            exc = det.get('text', '') + ' ' + str(det.get('exception', {}).get('description', ''))
            self.console_logs.append(('exception', exc))
        elif method == 'Network.responseReceived':
            resp = params.get('response', {})
            status = resp.get('status')
            url = resp.get('url', '')
            if status >= 400 and not url.endswith('favicon.ico'):
                self.network_errors.append((status, url))

    async def evaluate(self, expr):
        cid = await self.send_cmd('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
        res = await self.wait_for_response(cid)
        if res and 'result' in res:
            return res['result'].get('value')
        return None

    async def navigate_page(self, path):
        url = f"{BASE_URL}{path}"
        self.console_logs.clear()
        self.network_errors.clear()
        
        cid = await self.send_cmd('Page.navigate', {'url': url})
        await self.wait_for_response(cid)
        
        # listen for events for 3.5 seconds
        start = time.time()
        while time.time() - start < 3.5:
            try:
                raw = await asyncio.wait_for(self.ws.recv(), timeout=0.5)
                ev = json.loads(raw)
                self.handle_event(ev)
            except asyncio.TimeoutError:
                pass
                
        # run in-page checks
        title = await self.evaluate('document.title')
        final_url = await self.evaluate('window.location.href')
        overflow = await self.evaluate('document.documentElement.scrollWidth > window.innerWidth')
        
        return {
            'path': path,
            'title': title,
            'final_url': final_url,
            'overflow': overflow,
            'errors': list(self.console_logs),
            'network_failures': list(self.network_errors)
        }

    async def run(self):
        pages_to_test = [
            '/', '/dashboard', '/games', '/notes', '/roadmap', '/privacy', '/contact', 
            '/ctf', '/payloads', '/terminal', '/ai_assistant',
            '/modules/Footprinting', '/modules/Scanning', '/modules/Enumeration', 
            '/modules/Vulnerability', '/modules/SystemHacking', '/modules/WebAppThreats', 
            '/modules/OSINT', '/modules/BlackOps',
            '/games/sqli_locksmith', '/games/packet_gatekeeper', '/games/privesc_tower',
            '/games/ransom_panic', '/games/cidr_block', '/games/cipher_relic',
            '/games/entropy_clash', '/games/phish_detective',
            '/imp_info/general', '/imp_info/google_dorking', '/imp_info/hacker_engines_devices',
            '/imp_info/linux', '/imp_info/ports', '/imp_info/http_codes', '/imp_info/career_paths',
            '/masterguide/cybersecurity_masterguide', '/masterguide/masterguide_ch1',
            '/masterguide/masterguide_ch10', '/masterguide/masterguide_test'
        ]

        print(f"Starting browser crawl across {len(pages_to_test)} routes...")
        self.start_browser()
        
        try:
            with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json') as r:
                tabs = json.loads(r.read().decode())
            target = next(t for t in tabs if t.get('type') == 'page')
            ws_url = target['webSocketDebuggerUrl']
            
            async with websockets.connect(ws_url, max_size=30*1024*1024) as ws:
                self.ws = ws
                await self.send_cmd('Page.enable')
                await self.send_cmd('Runtime.enable')
                await self.send_cmd('Network.enable')
                await self.send_cmd('Emulation.setDeviceMetricsOverride', {
                    'width': 1280, 'height': 800, 'deviceScaleFactor': 1, 'mobile': False
                })

                results = []
                for p in pages_to_test:
                    res = await self.navigate_page(p)
                    results.append(res)
                    err_flag = "⚠️ HAS ISSUES" if (res['errors'] or res['network_failures'] or res['overflow']) else "✅ OK"
                    print(f"[{err_flag}] {p} -> Title: {str(res['title'])[:35]} | Overflow: {res['overflow']}")
                    if res['errors']:
                        for t, err in res['errors'][:3]:
                            print(f"    Console {t}: {err[:90]}")
                    if res['network_failures']:
                        for status, u in res['network_failures']:
                            print(f"    HTTP {status}: {u}")

            # Save full report
            with open(r"d:\CSE AI ML\CS\foot\scratch\runtime_crawl_results.json", "w", encoding="utf-8") as f:
                json.dump(results, f, indent=2)

        finally:
            self.stop_browser()

if __name__ == '__main__':
    asyncio.run(RuntimeCrawler().run())
