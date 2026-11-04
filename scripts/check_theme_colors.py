import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
workspace = Path(r"d:\CSE AI ML\CS\foot")

for f in sorted((workspace / "css").glob("*.css")):
    t = f.read_text(encoding='utf-8', errors='ignore')
    if 'data-theme="dark"' in t or "data-theme='dark'" in t or '[data-theme=dark]' in t:
        print(f"\n=== {f.name} ===")
        for m in re.finditer(r'\[data-theme=[\'"]?dark[\'"]?\]\s*\{([^}]+)\}', t):
            lines = [l.strip() for l in m.group(1).splitlines() if 'border' in l or 'shadow' in l]
            for l in lines:
                print(f"   {l}")
