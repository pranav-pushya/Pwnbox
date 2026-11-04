import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

master_dir = Path(r"d:\CSE AI ML\CS\foot\masterguide")
for p in sorted(master_dir.glob("*.html")):
    text = p.read_text(encoding='utf-8')
    c = text.count("ðŸ")
    if c > 0:
        print(f"{p.name}: {c} mojibake occurrences")
        # Print sample line
        for line in text.splitlines():
            if "ðŸ" in line:
                print(f"   Sample: {line.strip()[:100]}")
                break
