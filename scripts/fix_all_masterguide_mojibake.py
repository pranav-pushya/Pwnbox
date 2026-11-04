import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

master_dir = Path(r"d:\CSE AI ML\CS\foot\masterguide")
files = sorted(master_dir.glob("masterguide_ch*.html"))

def decode_cp1252_match(m):
    s = m.group(0)
    # Try chunk lengths from len(s) down to 3
    for l in range(len(s), 2, -1):
        candidate = s[:l]
        try:
            raw = candidate.encode('cp1252')
            decoded = raw.decode('utf-8')
            return decoded + s[l:]
        except Exception:
            pass
    return s

for f in files:
    content = f.read_text(encoding='utf-8')
    orig = content
    
    # 1. Match any sequence starting with ðŸ
    content = re.sub(r'ðŸ[^\s<"]{1,4}', decode_cp1252_match, content)
    content = re.sub(r'\xf0[\u0178\x9f][^\s<"]{1,4}', decode_cp1252_match, content)

    # 2. Specific remaining mappings
    extra_fixes = {
        'ðŸ–±️': '🖱️',
        'ðŸ–±': '🖱️',
        'ðŸ–¥️': '🖥️',
        'ðŸ–¥': '🖥️',
        'ðŸ’°': '💰',
        'ðŸŽ¯': '🎯',
        'ðŸ’»': '💻',
        'ðŸ˜ˆ': '😈',
        'ðŸ‘¤': '👤',
        'ðŸ§\xa0': '🧠',
        'ðŸŽ£': '🎣',
        'ðŸ’¥': '💥',
        'ðŸ’‰': '💉',
        'ðŸ\x8f¦': '🏦',
        'ðŸ’¼': '💼',
        'ðŸ\x93\x9d': '📝',
        'ðŸ‘©\u200d💻': '👩‍💻',
        'ðŸ‘¨\u200d💻': '👨‍💻',
        'ðŸš¨': '🚨',
        'ðŸ”\x90': '🔒',
        'ðŸ”\x91': '🔑',
        'ðŸ”\x92': '🔓',
        'ðŸ”\x8d': '🔍',
        'ðŸ“\x8a': '📊',
        'ðŸ“\x8b': '📋',
        'ðŸ“\x81': '📁',
        'ðŸ“\x82': '📂',
        'ðŸ“\x84': '📄',
        'ðŸ§\xac': '🧬',
        'ðŸ§\xaf': '🧱',
        'ðŸ§\xbc': '🧼',
        'ðŸª\xaa': '🪪',
        'ðŸª\xb1': '🪱',
        'ðŸª\x9f': '🪟',
        'ðŸŒ\x90': '🌐',
        'ðŸ—ºï¸\x8f': '🗺️',
        'ðŸ—º': '🗺️',
    }
    for k, v in extra_fixes.items():
        content = content.replace(k, v)

    if content != orig:
        f.write_text(content, encoding='utf-8')
        print(f"Repaired all mojibake in {f.name}")
