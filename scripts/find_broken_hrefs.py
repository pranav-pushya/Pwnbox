import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
workspace = Path(r"d:\CSE AI ML\CS\foot")

html_files = [p for p in workspace.rglob("*.html") if not any(x in p.parts for x in ["scratch", ".git", "node_modules", ".firebase"])]

print(f"Checking link resolution across {len(html_files)} HTML files...")

broken = []

for h in html_files:
    content = h.read_text(encoding='utf-8', errors='ignore')
    # Find all hrefs
    matches = re.findall(r'href=[\'"]([^\'"]+)[\'"]', content)
    for m in matches:
        if m.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', '#', 'data:')):
            continue
        clean = m.split('?')[0].split('#')[0]
        if not clean:
            continue
        
        # Check from h.parent or workspace
        if clean.startswith('/'):
            target = workspace / clean.lstrip('/')
        else:
            target = h.parent / clean

        # Does target exist directly, as .html, or as cleanUrl in firebase?
        exists = (target.is_file() or 
                  target.with_suffix('.html').is_file() or 
                  (target / 'index.html').is_file())
        
        if not exists:
            broken.append((h.relative_to(workspace), m, clean))

print(f"\nTotal broken internal hrefs: {len(broken)}")
for src, m, clean in broken:
    print(f"  {src} -> href='{m}' (target '{clean}' not found on disk)")
