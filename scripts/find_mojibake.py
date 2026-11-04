import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

WORKSPACE = Path(r"d:\CSE AI ML\CS\foot")
FILES = [p for p in WORKSPACE.rglob("*.*") if p.suffix in ['.html', '.js', '.css', '.json', '.xml', '.txt'] 
         and not any(x in p.parts for x in ["scratch", ".git", "node_modules", ".firebase"])]

print(f"Scanning {len(FILES)} files for Mojibake / Corrupted UTF-8...")

mojibake_patterns = [
    (r'dY["\'][A-Za-z0-9]?', "Corrupted Emoji (dY\"...)"),
    (r'â€[“’”™—–]', "Corrupted UTF-8 Punctuation (â€...)"),
    (r'Ã[©¨§ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿]', "Corrupted Latin-1 UTF-8 (Ã...)"),
    (r'\ufffd', "Replacement Character (U+FFFD)"),
    (r'\?\?\s+[A-Z]', "Double Question Mark (?  Word)"),
    (r'sT', "Corrupted symbol (sT...)"),
    (r'ðŸ', "Raw UTF-8 4-byte mojibake (ðŸ...)")
]

results = {}

for f in FILES:
    rel = str(f.relative_to(WORKSPACE)).replace('\\', '/')
    try:
        content = f.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        continue

    for pattern, desc in mojibake_patterns:
        matches = list(re.finditer(pattern, content))
        if matches:
            for m in matches[:5]:
                # get context
                start = max(0, m.start() - 25)
                end = min(len(content), m.end() + 25)
                snippet = content[start:end].replace('\n', ' ')
                results.setdefault(rel, []).append((desc, snippet))

print(f"\nTotal files with Mojibake: {len(results)}")
for f, items in results.items():
    print(f"\n=== {f} ({len(items)} issues) ===")
    for desc, snip in items[:4]:
        print(f"  [{desc}] ...{snip}...")
