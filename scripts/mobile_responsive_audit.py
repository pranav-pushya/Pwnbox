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
USER_DATA = r"D:\CSE AI ML\CS\foot\scratch\audit_mobile_profile"
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PORT = 9227

os.makedirs(USER_DATA, exist_ok=True)

class MobileTester:
    def __init__(self):
        self.proc = None
        self.ws = None
        self.msg_id = 1

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
        return None

    async def evaluate(self, expr):
        cid = await self.send_cmd('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
        res = await self.wait_for_response(cid)
        if res and 'result' in res:
            return res['result'].get('value')
        return None

    async def run(self):
        targets = [
            "/ctf.html",
            "/payloads.html",
            "/terminal.html",
            "/dashboard.html",
            "/masterguide/roadmap.html",
            "/masterguide/cybersecurity_masterguide.html",
            "/imp_info/hacker_engines_devices.html",
            "/ai_assistant.html",
            "/games/sqli_locksmith.html"
        ]

        print("=== MOBILE (375x667) RESPONSIVE & OVERFLOW AUDIT ===")
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
                await self.send_cmd('Emulation.setDeviceMetricsOverride', {
                    'width': 375, 'height': 667, 'deviceScaleFactor': 2, 'mobile': True
                })

                for path in targets:
                    url = f"{BASE_URL}{path}"
                    cid = await self.send_cmd('Page.navigate', {'url': url})
                    await self.wait_for_response(cid)
                    await asyncio.sleep(1.5)

                    overflow = await self.evaluate('document.documentElement.scrollWidth > window.innerWidth')
                    scroll_w = await self.evaluate('document.documentElement.scrollWidth')
                    inner_w = await self.evaluate('window.innerWidth')
                    
                    status = "❌ OVERFLOW DETECTED" if overflow else "✅ CLEAN FIT"
                    print(f"[{status}] {path} -> scrollWidth: {scroll_w}px (viewport: {inner_w}px)")
        finally:
            self.stop_browser()

if __name__ == '__main__':
    asyncio.run(MobileTester().run())
