import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

found = []
for p in sorted(Path('.').rglob('*')):
    if p.is_file() and 'node_modules' not in p.parts and 'scratch' not in p.parts and '.git' not in p.parts:
        try:
            txt = p.read_text(encoding='utf-8', errors='ignore')
            if 'Vulnerablity' in txt:
                found.append((str(p), txt.count('Vulnerablity')))
        except Exception as e:
            pass

for f, count in found:
    print(f"{f}: {count} occurrences")
