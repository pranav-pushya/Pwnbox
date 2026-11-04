import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
workspace = Path(r"d:\CSE AI ML\CS\foot")

js_files = [p for p in (workspace / "js").glob("*.js") if not any(x in p.parts for x in ["vendor", "scratch"])]

print(f"Scanning {len(js_files)} JS files for hardcoded relative links...")

for j in js_files:
    text = j.read_text(encoding='utf-8', errors='ignore')
    # search for href="...html" or href='...html'
    links = re.findall(r'href=[\'"]([a-zA-Z0-9_\-]+\.html)[\'"]', text)
    if links:
        print(f"\n{j.name} has relative html links without leading slash:")
        for l in set(links):
            print(f"   href='{l}'")
