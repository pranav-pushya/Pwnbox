from pathlib import Path

master_dir = Path(r"d:\CSE AI ML\CS\foot\masterguide")

fixes = {
    '\xf0\u0178\x8f\u2014\ufe0f': '🏗️',
    '\xf0\u0178\x90\xb4': '🐴',
    '\xf0\u0178\u2018\x81\ufe0f': '👁️',
    '\xf0\u0178\x8d\xaf': '🍯',
    '\xf0\u0178\x8f\u203a\ufe0f': '🏛️',
    '\xf0\u0178\u2014\x9d\ufe0f': '🗝️',
    '\xf0\u0178\x8f\xa0': '🏠',
    '\xf0\u0178\x8f\xa2': '🏢',
    '\xf0\u0178\x8f\xa5': '🛡️',
    '\U0001f4dd\xb1': '📱',
    '\U0001f4dd\x8d': '📍'
}

for f in sorted(master_dir.glob("masterguide_ch*.html")):
    text = f.read_text(encoding='utf-8')
    orig = text
    for bad, good in fixes.items():
        text = text.replace(bad, good)
    if text != orig:
        f.write_text(text, encoding='utf-8')
        print(f"Cleaned remaining 12 mojibake in {f.name}")
