import xml.etree.ElementTree as ET
from xml.dom import minidom
from pathlib import Path
from datetime import date

today_str = date.today().isoformat()

# Dead URLs to remove
dead_urls = {
    "https://pwnbo-x.web.app/modules/MalwareThreats.html",
    "https://pwnbo-x.web.app/modules/EvadingIDS.html",
    "https://pwnbo-x.web.app/modules/SocialEngineering.html",
}

# New URLs to add: (url, priority, changefreq)
new_entries = [
    ("https://pwnbo-x.web.app/ctf", "0.8", "weekly"),
    ("https://pwnbo-x.web.app/payloads", "0.8", "weekly"),
    ("https://pwnbo-x.web.app/terminal", "0.8", "weekly"),
    ("https://pwnbo-x.web.app/modules/OSINT.html", "0.7", "monthly"),
    ("https://pwnbo-x.web.app/imp_info/google_dorking", "0.7", "monthly"),
    ("https://pwnbo-x.web.app/imp_info/hacker_engines_devices", "0.7", "monthly"),
    ("https://pwnbo-x.web.app/imp_info/linux", "0.7", "monthly"),
]

# 1. Update sitemap.txt
txt_path = Path("sitemap.txt")
lines = [l.strip() for l in txt_path.read_text(encoding='utf-8').splitlines() if l.strip()]
filtered_txt = [l for l in lines if l not in dead_urls]

for url, _, _ in new_entries:
    if url not in filtered_txt:
        filtered_txt.append(url)

txt_path.write_text("\n".join(filtered_txt) + "\n", encoding='utf-8')
print(f"Updated sitemap.txt: now has {len(filtered_txt)} URLs (was {len(lines)})")

# 2. Update sitemap.xml
xml_path = Path("sitemap.xml")
ET.register_namespace('', "http://www.sitemaps.org/schemas/sitemap/0.9")
tree = ET.parse(xml_path)
root = tree.getroot()

ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"

# Remove dead
to_remove = []
existing_locs = set()
for url_el in root.findall(f"{ns}url"):
    loc = url_el.find(f"{ns}loc")
    if loc is not None:
        if loc.text in dead_urls:
            to_remove.append(url_el)
        else:
            existing_locs.add(loc.text)

for r in to_remove:
    root.remove(r)
print(f"Removed {len(to_remove)} dead entries from sitemap.xml")

# Add new entries
added_count = 0
for url, prio, freq in new_entries:
    if url not in existing_locs:
        url_el = ET.SubElement(root, f"{ns}url")
        loc_el = ET.SubElement(url_el, f"{ns}loc")
        loc_el.text = url
        lastmod_el = ET.SubElement(url_el, f"{ns}lastmod")
        lastmod_el.text = today_str
        freq_el = ET.SubElement(url_el, f"{ns}changefreq")
        freq_el.text = freq
        prio_el = ET.SubElement(url_el, f"{ns}priority")
        prio_el.text = prio
        added_count += 1

print(f"Added {added_count} new entries to sitemap.xml")

# Write out clean formatted XML
raw_str = ET.tostring(root, encoding='utf-8')
dom = minidom.parseString(raw_str)
# Format nicely
pretty_xml = "\n".join([line for line in dom.toprettyxml(indent="  ", encoding="UTF-8").decode('utf-8').splitlines() if line.strip()]) + "\n"
xml_path.write_text(pretty_xml, encoding='utf-8')
print("Successfully regenerated sitemap.xml")
