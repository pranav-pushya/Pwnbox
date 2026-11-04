import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

p = Path(r"d:\CSE AI ML\CS\foot\masterguide\masterguide_ch1.html")
lines = p.read_text(encoding='utf-8').splitlines()

for i in [71, 72, 73, 74]:
    line = lines[i]
    print(f"Original: {repr(line)}")
    try:
        fixed = line.encode('latin-1').decode('utf-8')
        print(f"Fixed with latin-1 -> utf-8: {fixed}")
    except Exception as e:
        print(f"Error latin-1: {e}")
        try:
            fixed = line.encode('cp1252').decode('utf-8')
            print(f"Fixed with cp1252 -> utf-8: {fixed}")
        except Exception as e2:
            print(f"Error cp1252: {e2}")
