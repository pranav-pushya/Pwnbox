import os

files = [f for f in os.listdir('.') if f.startswith('masterguide_ch') or f == 'cybersecurity_masterguide.html']

old_btn = '<button onclick="toggleTheme()" class="theme-nav-btn" style="background: var(--text-main); color: var(--bg-base); border: 2px solid var(--text-main); font-family: \'Space Mono\', monospace; font-weight: 700; font-size: 0.75rem; padding: 6px 10px; cursor: pointer; text-transform: uppercase; margin-left: auto;">🌓 Theme</button>'

new_btns = '''<div style="display: flex; gap: 8px; margin-left: auto;">
      <button onclick="toggleTheme()" class="theme-nav-btn" style="background: var(--text-main); color: var(--bg-base); border: 2px solid var(--text-main); font-family: 'Space Mono', monospace; font-weight: 700; font-size: 0.75rem; padding: 6px 10px; cursor: pointer; text-transform: uppercase;">🌓 Theme</button>
      <button onclick="window.location.href='index.html'" class="theme-nav-btn" style="background: #D9291C; color: white; border: 2px solid var(--text-main); font-family: 'Space Mono', monospace; font-weight: 700; font-size: 0.75rem; padding: 6px 10px; cursor: pointer; text-transform: uppercase; box-shadow: 2px 2px 0 var(--text-main);">🔙 Main</button>
    </div>'''

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if old_btn in content:
        content = content.replace(old_btn, new_btns)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
    else:
        print(f"Button not found in {f}")

print("Done.")
