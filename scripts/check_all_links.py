import sys
from pathlib import Path
import re
from urllib.parse import urlparse

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

root_dir = Path(".")
html_files = [p for p in root_dir.rglob("*.html") if "scratch" not in p.parts and "node_modules" not in p.parts]

print(f"Scanning {len(html_files)} HTML files for internal dead links / broken assets...")

broken_links = []
total_links_checked = 0

for hf in sorted(html_files):
    text = hf.read_text(encoding='utf-8', errors='ignore')
    
    # Match href and src
    matches = re.findall(r'(?:href|src)=[\'"]([^\'"]+)[\'"]', text)
    for m in matches:
        m = m.strip()
        if not m or m.startswith("#") or m.startswith("data:") or m.startswith("javascript:") or m.startswith("mailto:") or m.startswith("tel:"):
            continue
        if m.startswith("http://") or m.startswith("https://") or m.startswith("//"):
            continue
        
        # Strip query and anchor
        clean_target = m.split("?")[0].split("#")[0]
        if not clean_target:
            continue
        
        total_links_checked += 1
        
        # Resolve target relative to hf.parent
        if clean_target.startswith("/"):
            resolved = root_dir / clean_target.lstrip("/")
        else:
            resolved = (hf.parent / clean_target).resolve()
            
        # Check if resolved exists or resolved.html exists
        exists = resolved.exists() or Path(str(resolved) + ".html").exists()
        
        if not exists:
            broken_links.append((str(hf), m, str(resolved)))

print(f"Checked {total_links_checked} internal references.")
if broken_links:
    print(f"Found {len(broken_links)} broken references:")
    for src, link, resolved in broken_links:
        print(f"  In {src}: link '{link}' -> resolved to non-existent '{resolved}'")
else:
    print("0 broken internal links or assets found across all HTML files!")
