import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

workspace = Path(r"d:\CSE AI ML\CS\foot")
html_files = [p for p in workspace.rglob("*.html") if not any(x in p.parts for x in ["scratch", ".git", "node_modules", ".firebase"])]

print(f"Checking {len(html_files)} HTML files for '?? ' or '??? ' corrupted emoji patterns...")

found_count = 0
for p in html_files:
    text = p.read_text(encoding='utf-8', errors='replace')
    # search for ?? or ??? followed by space and word
    matches = re.findall(r'(\?{2,4}\s+[A-Za-z0-9]+|\?\?\s*<|<span[^>]*>\?\?<\/span>|btn[^\>]*>\?\?<\/button>)', text)
    if matches:
        found_count += 1
        rel = p.relative_to(workspace)
        print(f"\n{rel} ({len(matches)} issues):")
        for m in list(set(matches))[:8]:
            print(f"   - {m}")

print(f"\nTotal files with ?? issues: {found_count}")
