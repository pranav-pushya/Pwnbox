import os
import re
import json
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

WORKSPACE = Path(r"d:\CSE AI ML\CS\foot")
HTML_FILES = [p for p in WORKSPACE.rglob("*.html") if not any(x in p.parts for x in ["scratch", ".git", "node_modules", ".firebase"])]

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.scripts = []
        self.stylesheets = []
        self.images = []
        self.title = None
        self.in_title = False
        self.meta_desc = None
        self.has_viewport = False
        self.favicon = None
        self.inline_handlers = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        
        if 'id' in attr_dict:
            self.ids.add(attr_dict['id'])
            
        for k, v in attr_dict.items():
            if k.startswith('on'):
                self.inline_handlers.append((k, v))

        if tag == 'title':
            self.in_title = True
        elif tag == 'a' and 'href' in attr_dict:
            self.links.append(attr_dict['href'])
        elif tag == 'script' and 'src' in attr_dict:
            self.scripts.append(attr_dict['src'])
        elif tag == 'link':
            rel = attr_dict.get('rel', '').lower()
            href = attr_dict.get('href', '')
            if 'stylesheet' in rel:
                self.stylesheets.append(href)
            if 'icon' in rel:
                self.favicon = href
        elif tag == 'img' and 'src' in attr_dict:
            self.images.append(attr_dict['src'])
        elif tag == 'meta':
            name = attr_dict.get('name', '').lower()
            if name == 'description':
                self.meta_desc = attr_dict.get('content', '')
            elif name == 'viewport':
                self.has_viewport = True

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title and self.title is None:
            self.title = data.strip()

def resolve_target(base_file, target_path):
    if not target_path or target_path.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', '#', 'data:')):
        return True, 'external_or_special'
    
    clean_target = target_path.split('?')[0].split('#')[0]
    if not clean_target:
        return True, 'anchor'
        
    if clean_target.startswith('/'):
        resolved = WORKSPACE / clean_target.lstrip('/')
    else:
        resolved = base_file.parent / clean_target
        
    # Check exact file
    if resolved.is_file():
        return True, str(resolved)
    # Check if .html appended exists
    if resolved.with_suffix('.html').is_file():
        return True, str(resolved.with_suffix('.html'))
    # Check if directory with index.html
    if (resolved / 'index.html').is_file():
        return True, str(resolved / 'index.html')
        
    return False, str(resolved)

def run_audit():
    print(f"=== PWNBOX COMPREHENSIVE STATIC & LINK AUDIT ===")
    print(f"Total HTML files found: {len(HTML_FILES)}\n")

    broken_links = []
    broken_scripts = []
    broken_styles = []
    broken_images = []
    meta_issues = []
    encoding_issues = []
    
    all_titles = {}
    
    for html_file in HTML_FILES:
        rel_path = html_file.relative_to(WORKSPACE)
        
        # 1. Encoding & Corrupted Character Check
        try:
            raw_bytes = html_file.read_bytes()
            content = raw_bytes.decode('utf-8')
        except UnicodeDecodeError as e:
            encoding_issues.append((str(rel_path), f"UTF-8 Decode Error: {e}"))
            continue
            
        if '\ufffd' in content:
            encoding_issues.append((str(rel_path), f"Contains Unicode Replacement Character (\\ufffd) {content.count(chr(0xfffd))} times"))
            
        # Check for literal '?? ' in UI buttons or text
        bad_emojis = re.findall(r'(\?\?\s+[A-Za-z0-9]+)', content)
        if bad_emojis:
            encoding_issues.append((str(rel_path), f"Suspected corrupted emojis: {set(bad_emojis[:5])}"))
            
        # 2. HTML parsing
        parser = LinkExtractor()
        try:
            parser.feed(content)
        except Exception as e:
            print(f"HTML Parse Error in {rel_path}: {e}")
            continue

        # Meta checks
        if not parser.title:
            meta_issues.append((str(rel_path), "Missing <title> tag"))
        else:
            if parser.title in all_titles:
                meta_issues.append((str(rel_path), f"Duplicate title '{parser.title}' (same as {all_titles[parser.title]})"))
            else:
                all_titles[parser.title] = str(rel_path)
                
        if not parser.meta_desc:
            meta_issues.append((str(rel_path), "Missing <meta name='description'>"))
        if not parser.has_viewport:
            meta_issues.append((str(rel_path), "Missing <meta name='viewport'>"))
        if not parser.favicon:
            meta_issues.append((str(rel_path), "Missing favicon <link rel='icon'>"))

        # Link resolution checks
        for link in parser.links:
            ok, target = resolve_target(html_file, link)
            if not ok:
                broken_links.append((str(rel_path), link, target))

        for script in parser.scripts:
            ok, target = resolve_target(html_file, script)
            if not ok:
                broken_scripts.append((str(rel_path), script, target))

        for style in parser.stylesheets:
            ok, target = resolve_target(html_file, style)
            if not ok:
                broken_styles.append((str(rel_path), style, target))

        for img in parser.images:
            ok, target = resolve_target(html_file, img)
            if not ok:
                broken_images.append((str(rel_path), img, target))

    print(f"--- 1. Broken Internal Links ({len(broken_links)}) ---")
    for src, link, target in broken_links:
        print(f"  [404 LINK] In {src} -> '{link}' (resolved to non-existent: {target})")

    print(f"\n--- 2. Broken Scripts ({len(broken_scripts)}) ---")
    for src, link, target in broken_scripts:
        print(f"  [404 SCRIPT] In {src} -> '{link}'")

    print(f"\n--- 3. Broken Stylesheets ({len(broken_styles)}) ---")
    for src, link, target in broken_styles:
        print(f"  [404 STYLE] In {src} -> '{link}'")

    print(f"\n--- 4. Broken Images ({len(broken_images)}) ---")
    for src, link, target in broken_images:
        print(f"  [404 IMAGE] In {src} -> '{link}'")

    print(f"\n--- 5. Meta / SEO / Head Issues ({len(meta_issues)}) ---")
    for src, msg in meta_issues:
        print(f"  [META] {src}: {msg}")

    print(f"\n--- 6. Encoding / Corrupted Emojis ({len(encoding_issues)}) ---")
    for src, msg in encoding_issues:
        print(f"  [ENCODING] {src}: {msg}")

    # 7. Sitemap & Robots validation
    print(f"\n--- 7. Sitemap vs Actual Files Validation ---")
    sitemap_xml = WORKSPACE / "sitemap.xml"
    if sitemap_xml.is_file():
        try:
            tree = ET.parse(sitemap_xml)
            root = tree.getroot()
            ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            sitemap_urls = [elem.text.strip() for elem in root.findall('.//ns:loc', ns)]
            print(f"  sitemap.xml has {len(sitemap_urls)} URLs.")
            for url in sitemap_urls:
                path_part = url.replace("https://pwnbo-x.web.app/", "")
                file_candidate = WORKSPACE / path_part
                if not file_candidate.is_file() and not (WORKSPACE / f"{path_part}.html").is_file():
                    print(f"  [SITEMAP 404] sitemap.xml references non-existent URL: {url}")
        except Exception as e:
            print(f"  sitemap.xml parse error: {e}")

    sitemap_txt = WORKSPACE / "sitemap.txt"
    if sitemap_txt.is_file():
        txt_urls = [line.strip() for line in sitemap_txt.read_text(encoding='utf-8').splitlines() if line.strip()]
        print(f"  sitemap.txt has {len(txt_urls)} URLs.")
        for url in txt_urls:
            path_part = url.replace("https://pwnbo-x.web.app/", "")
            file_candidate = WORKSPACE / path_part
            if not file_candidate.is_file() and not (WORKSPACE / f"{path_part}.html").is_file():
                print(f"  [SITEMAP.TXT 404] sitemap.txt references non-existent URL: {url}")

    # Check for HTML files not in sitemap
    sitemap_set = set(url.replace("https://pwnbo-x.web.app/", "").split('?')[0] for url in (sitemap_urls if 'sitemap_urls' in locals() else []))
    print(f"\n--- 8. Pages Missing From Sitemap ---")
    for h in HTML_FILES:
        rel = str(h.relative_to(WORKSPACE)).replace('\\', '/')
        if rel in ['404.html', 'googlefc958a03c36a76e7.html', 'modules/Vulnerablity.html']:
            continue
        clean_rel = rel.replace('.html', '')
        if rel not in sitemap_set and clean_rel not in sitemap_set:
            print(f"  [UNINDEXED PAGE] {rel} is not listed in sitemap.xml")

if __name__ == "__main__":
    run_audit()
