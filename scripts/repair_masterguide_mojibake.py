import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

master_dir = Path(r"d:\CSE AI ML\CS\foot\masterguide")
files = sorted(master_dir.glob("masterguide_ch*.html"))

mojibake_replacements = [
    ('\xf0\u0178\u0152\x90', '🌐'),
    ('\xf0\u0178\u2014\xba\xef\xb8\x8f', '🗺️'),
    ('\xf0\u0178\u2014\xba', '🗺️'),
    ('\xf0\u0178\u201c\x9d', '📝'),
    ('\xf0\u0178\u201c', '📝'),
    ('\xf0\u0178\u201d ', '🔍 '),
    ('\xf0\u0178\u201d', '🔍'),
    ('\xf0\u0178\xa7\xac', '🧬'),
    ('\xf0\u0178\u203a\xa1\xef\xb8\x8f', '🛡️'),
    ('\xf0\u0178\u203a\xa1', '🛡️'),
    ('\xf0\u0178\u2020\u201d', '🆔'),
    ('\xf0\u0178\u0152 ', '🌐 '),
    ('\xf0\u0178\u2022\xb5\xef\xb8\x8f', '🕵️'),
    ('\xf0\u0178\u2022\xb5', '🕵️'),
    ('\xf0\u0178\u201c\u2039', '📋'),
    ('\xf0\u0178\u0161\xa8', '🚨'),
    ('ðŸŒ\x90', '🌐'),
    ('ðŸ—ºï¸\x8f', '🗺️'),
    ('ðŸ—º', '🗺️'),
    ('ðŸ“\x9d', '📝'),
    ('ðŸ“ ', '📝'),
    ('ðŸ” ', '🔍'),
    ('ðŸ”', '🔍'),
    ('ðŸ§¬', '🧬'),
    ('ðŸ›¡ï¸ ', '🛡️'),
    ('ðŸ›¡ï¸\x8f', '🛡️'),
    ('ðŸ›¡', '🛡️'),
    ('ðŸ†”', '🆔'),
    ('ðŸŒ ', '🌐'),
    ('ðŸ•µï¸ ', '🕵️'),
    ('ðŸ•µï¸\x8f', '🕵️'),
    ('ðŸ•µ', '🕵️'),
    ('ðŸ“‹', '📋'),
    ('ðŸš¨', '🚨'),
    ('🖥\x8f', '🖥️'),
    ('🖱\x8f', '🖱️'),
    ('\x9d\x8f', '📝'),
    ('🗺\x8f', '🗺️'),
    ('🗃\x8f', '🗃️'),
    ('\x81\x8f', '🛡️'),
    ('🕵\x8f', '🕵️'),
    ('🕸\x8f', '🕸️'),
    ('🛡\x8f', '🛡️'),
    ('ï¸\x8f', '️'),
    ('ï¸', '️')
]

total_repaired = 0
for f in files:
    content = f.read_text(encoding='utf-8')
    orig = content
    for bad, good in mojibake_replacements:
        content = content.replace(bad, good)
    
    if content != orig:
        f.write_text(content, encoding='utf-8')
        total_repaired += 1
        print(f"Repaired: {f.name}")

print(f"\nCompleted repairs across {total_repaired} Masterguide files.")
