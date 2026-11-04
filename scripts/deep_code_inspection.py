import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

WORKSPACE = Path(r"d:\CSE AI ML\CS\foot")
HTML_FILES = [p for p in WORKSPACE.rglob("*.html") if not any(x in p.parts for x in ["scratch", ".git", "node_modules", ".firebase"])]
JS_FILES = [p for p in WORKSPACE.rglob("*.js") if not any(x in p.parts for x in ["scratch", ".git", "node_modules", ".firebase", "vendor"])]

print(f"Total HTML files: {len(HTML_FILES)}")
print(f"Total custom JS files: {len(JS_FILES)}")

# 1. Check navigation consistency: Collect all nav links across pages
print("\n=== 1. AUDITING NAVIGATION MENUS ACROSS PAGES ===")
nav_patterns = [
    r'<nav[^>]*>(.*?)</nav>',
    r'<header[^>]*>(.*?)</header>',
    r'class=[\'"][^\'"]*nav[^\'"]*[\'"][^>]*>(.*?)</div>'
]

page_nav_links = {}
for h in HTML_FILES:
    content = h.read_text(encoding='utf-8', errors='ignore')
    links = re.findall(r'<a[^>]+href=[\'"]([^\'"]+)[\'"][^>]*>(.*?)</a>', content, re.DOTALL | re.IGNORECASE)
    # filter for main header/nav links
    nav_links = []
    for href, text in links:
        clean_text = re.sub(r'<[^>]+>', '', text).strip()
        if clean_text and len(clean_text) < 40 and not href.startswith(('http', 'mailto', '#')):
            nav_links.append((href, clean_text))
    page_nav_links[h.name] = nav_links

# Check references to new pages: ctf.html, payloads.html, terminal.html
print("\n=== 2. ARE CTF, PAYLOADS, TERMINAL LINKED ANYWHERE? ===")
for target in ['ctf', 'payloads', 'terminal']:
    linked_in = []
    for h in HTML_FILES:
        content = h.read_text(encoding='utf-8', errors='ignore')
        if re.search(r'href=[\'"][^\'"]*' + target + r'[^\'"]*[\'"]', content, re.I):
            linked_in.append(h.name)
    print(f"  Target '{target}' is linked in: {linked_in if linked_in else 'NOWHERE (ORPHANED PAGE!)'}")

# 3. Check for Null Reference risks in JS files:
# e.g. document.getElementById('...').addEventListener without null check
print("\n=== 3. AUDITING POTENTIAL NULL POINTER CRASHES IN JS ===")
unsafe_calls = []
for js in JS_FILES:
    lines = js.read_text(encoding='utf-8', errors='ignore').splitlines()
    for i, line in enumerate(lines, 1):
        # Pattern: document.getElementById('...').something without preceding check
        m = re.search(r'document\.getElementById\([\'"]([a-zA-Z0-9_\-]+)[\'"]\)\.(addEventListener|onclick|innerHTML|textContent|value|style|classList|focus)', line)
        if m:
            elem_id, action = m.groups()
            unsafe_calls.append((js.name, i, elem_id, action, line.strip()))

print(f"Total direct element property accesses without null check: {len(unsafe_calls)}")
for js_name, line_no, elem_id, action, code in unsafe_calls[:20]:
    print(f"  [{js_name}:{line_no}] Unsafe call on '{elem_id}'.{action}: `{code[:75]}`")

# 4. Check auth_guard.js vs actual page requirements
print("\n=== 4. AUDITING AUTH GUARD ON ALL PAGES ===")
auth_guard_script = WORKSPACE / "js" / "auth_guard.js"
if auth_guard_script.is_file():
    guard_code = auth_guard_script.read_text(encoding='utf-8')
    print("  auth_guard.js analysis:")
    if "const isPublic = true;" in guard_code:
        print("  [CRITICAL SECURITY BUG] 'const isPublic = true;' completely bypasses auth guarding for all pages!")

# Check which pages actually import auth_guard.js
guarded_pages = []
unguarded_pages = []
for h in HTML_FILES:
    content = h.read_text(encoding='utf-8', errors='ignore')
    if "auth_guard.js" in content:
        guarded_pages.append(h.name)
    else:
        unguarded_pages.append(h.name)

print(f"  Pages importing auth_guard.js ({len(guarded_pages)}): {guarded_pages[:10]}...")
print(f"  Pages NOT importing auth_guard.js ({len(unguarded_pages)}): {unguarded_pages}")

# 5. Check theme toggling consistency:
# Check if pages have theme initialization and toggleTheme function
print("\n=== 5. AUDITING THEME TOGGLING & CONSISTENCY ===")
missing_theme_init = []
missing_theme_btn = []
missing_theme_js = []
for h in HTML_FILES:
    content = h.read_text(encoding='utf-8', errors='ignore')
    if 'data-theme' not in content and 'localStorage.getItem(\'theme\')' not in content:
        missing_theme_init.append(h.name)
    if 'toggleTheme' not in content and 'theme-nav-btn' not in content and 'themeToggle' not in content:
        missing_theme_btn.append(h.name)
    if 'theme.js' not in content and 'function toggleTheme' not in content:
        missing_theme_js.append(h.name)

print(f"  Pages missing theme init (causes white flash / FOUT) ({len(missing_theme_init)}): {missing_theme_init}")
print(f"  Pages missing theme toggle button ({len(missing_theme_btn)}): {missing_theme_btn}")
print(f"  Pages missing theme.js or toggle logic ({len(missing_theme_js)}): {missing_theme_js}")
