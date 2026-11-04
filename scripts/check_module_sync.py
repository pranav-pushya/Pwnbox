import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
WORKSPACE = Path(r"d:\CSE AI ML\CS\foot")

print("=== CHECKING JS MODULES & TOOLS COMPLETION SYNC ===")
modules = [
    'Footprinting.js', 'Scanning.js', 'Enumeration.js', 'Vulnerablity.js', 
    'SystemHacking.js', 'WebAppThreats.js', 'OSINT.js', 'BlackOps.js'
]

for m in modules:
    p = WORKSPACE / 'js' / m
    if not p.is_file():
        print(f"  [MISSING] {m} does not exist!")
        continue
    text = p.read_text(encoding='utf-8', errors='ignore')
    
    # Check completion key used
    keys = re.findall(r'localStorage\.(?:getItem|setItem)\([\'"]([a-zA-Z0-9_\-]+)[\'"]', text)
    comp_keys = [k for k in set(keys) if 'completed' in k or 'module' in k]
    print(f"  {m}: completion keys -> {comp_keys}")

print("\n=== CHECKING DASHBOARD KEYS FOR MODULE COMPLETION ===")
index_js = (WORKSPACE / 'js' / 'index.js').read_text(encoding='utf-8', errors='ignore')
dash_keys = re.findall(r'completedKey:\s*[\'"]([a-zA-Z0-9_\-]+)[\'"]', index_js)
print(f"  Dashboard expects: {dash_keys}")

print("\n=== CHECKING CTF, PAYLOADS & TERMINAL JS FILES ===")
for extra in ['ctf.js', 'payloads.js', 'terminal.js', 'cloud_sync.js']:
    p = WORKSPACE / 'js' / extra
    print(f"  {extra} exists?: {p.is_file()}")
    if p.is_file():
        t = p.read_text(encoding='utf-8', errors='ignore')
        print(f"     size: {len(t)} chars, lines: {len(t.splitlines())}")
        # check syntax errors or unresolved promises
        if 'catch' not in t and 'try' not in t:
            print(f"     [WARNING] No try/catch in {extra}")
