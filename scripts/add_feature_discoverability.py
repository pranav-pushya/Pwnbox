import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

index_path = Path("index.html")
content = index_path.read_text(encoding='utf-8')

# 1. Hero quick pills
hero_target = """                <p class="hero-subtitle">
                    Master real-world offensive reconnaissance, automated vulnerability scanning, system exploitation,
                    and cyber defense across <span id="heroTracksCount">7</span> battle-tested training tracks, 60+ practical in-browser security tools, 8
                    tactical cyber games, and an interactive 10-chapter master guide.
                </p>"""

hero_replacement = """                <p class="hero-subtitle">
                    Master real-world offensive reconnaissance, automated vulnerability scanning, system exploitation,
                    and cyber defense across <span id="heroTracksCount">7</span> battle-tested training tracks, 60+ practical in-browser security tools, 8
                    tactical cyber games, and an interactive 10-chapter master guide.
                </p>
                <div class="hero-quick-pills" style="display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0 24px;">
                    <a href="terminal.html" class="hero-pill-btn" style="background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.4); color: #00f0ff; padding: 6px 14px; border-radius: 6px; font-family: 'Space Mono', monospace; font-size: 0.78rem; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">💻 Linux WebShell &rarr;</a>
                    <a href="ctf.html" class="hero-pill-btn" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; padding: 6px 14px; border-radius: 6px; font-family: 'Space Mono', monospace; font-size: 0.78rem; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">🚩 CTF Challenges &rarr;</a>
                    <a href="payloads.html" class="hero-pill-btn" style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4); color: #f59e0b; padding: 6px 14px; border-radius: 6px; font-family: 'Space Mono', monospace; font-size: 0.78rem; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">⚡ Payloads Arsenal &rarr;</a>
                </div>"""

# 2. CTA Banner buttons
cta_target = """                <a href="imp_info/imp_info.html" class="btn-cta-white" style="background: #e76f51; color: #ffffff;">
                    <span>💡 Field Intelligence</span>
                    <span>→</span>
                </a>"""

cta_replacement = """                <a href="imp_info/imp_info.html" class="btn-cta-white" style="background: #e76f51; color: #ffffff;">
                    <span>💡 Field Intelligence</span>
                    <span>→</span>
                </a>
                <a href="terminal.html" class="btn-cta-white" style="background: #00f0ff; color: #000000; font-weight: 800;">
                    <span>💻 Linux WebShell</span>
                    <span>→</span>
                </a>
                <a href="ctf.html" class="btn-cta-white" style="background: #ef4444; color: #ffffff;">
                    <span>🚩 CTF Range</span>
                    <span>→</span>
                </a>
                <a href="payloads.html" class="btn-cta-white" style="background: #f59e0b; color: #000000; font-weight: 800;">
                    <span>⚡ Payloads</span>
                    <span>→</span>
                </a>"""

# 3. Footer links
footer_target = """                <div style="margin-top: 0.6rem; font-family: 'Space Mono', monospace; font-size: 0.8rem;">
                    <a href="privacy.html" style="color: #00ff66; text-decoration: none; margin: 0 0.5rem;">🔒 Privacy Policy</a> |
                    <a href="contact.html" style="color: #00f0ff; text-decoration: none; margin: 0 0.5rem;">✉️ Contact & Feedback</a> |
                    <a href="dashboard.html" style="color: #94a3b8; text-decoration: none; margin: 0 0.5rem;">📊 Dashboard</a>
                </div>"""

footer_replacement = """                <div style="margin-top: 0.6rem; font-family: 'Space Mono', monospace; font-size: 0.8rem;">
                    <a href="privacy.html" style="color: #00ff66; text-decoration: none; margin: 0 0.5rem;">🔒 Privacy Policy</a> |
                    <a href="contact.html" style="color: #00f0ff; text-decoration: none; margin: 0 0.5rem;">✉️ Contact & Feedback</a> |
                    <a href="dashboard.html" style="color: #94a3b8; text-decoration: none; margin: 0 0.5rem;">📊 Dashboard</a> |
                    <a href="terminal.html" style="color: #00f0ff; text-decoration: none; margin: 0 0.5rem;">💻 WebShell</a> |
                    <a href="ctf.html" style="color: #ef4444; text-decoration: none; margin: 0 0.5rem;">🚩 CTF</a> |
                    <a href="payloads.html" style="color: #f59e0b; text-decoration: none; margin: 0 0.5rem;">⚡ Payloads</a>
                </div>"""

# Normalize CRLF / LF for robust replacement
normalized = content.replace("\r\n", "\n")
norm_hero_t = hero_target.replace("\r\n", "\n")
norm_hero_r = hero_replacement.replace("\r\n", "\n")

norm_cta_t = cta_target.replace("\r\n", "\n")
norm_cta_r = cta_replacement.replace("\r\n", "\n")

norm_footer_t = footer_target.replace("\r\n", "\n")
norm_footer_r = footer_replacement.replace("\r\n", "\n")

if norm_hero_t not in normalized:
    print("FAILED: Hero target not found")
    sys.exit(1)
if norm_cta_t not in normalized:
    print("FAILED: CTA target not found")
    sys.exit(1)
if norm_footer_t not in normalized:
    print("FAILED: Footer target not found")
    sys.exit(1)

new_content = normalized.replace(norm_hero_t, norm_hero_r, 1)
new_content = new_content.replace(norm_cta_t, norm_cta_r, 1)
new_content = new_content.replace(norm_footer_t, norm_footer_r, 1)

# Write back preserving CRLF
final_content = new_content.replace("\n", "\r\n")
index_path.write_bytes(final_content.encode('utf-8'))
print("Successfully injected CTF, Payloads, and Terminal discoverability into index.html!")
