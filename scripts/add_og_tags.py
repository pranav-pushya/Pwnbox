import glob
import re
import os

html_files = [f for f in glob.glob('**/*.html', recursive=True) if not f.startswith('.git') and not f.startswith('node_modules') and not f.startswith('functions')]

count = 0
for f in html_files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    if 'og:image' in content:
        continue
    
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    title = title_match.group(1).strip() if title_match else 'PwnBox Tactical Cybersecurity'
    
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE)
    desc = desc_match.group(1).strip() if desc_match else 'Tactical cybersecurity training platform.'
    
    og_block = f'''
    <!-- Open Graph & Social Sharing -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:image" content="https://pwnbo-x.web.app/assets/pwnbox-og-preview.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{desc}">
    <meta name="twitter:image" content="https://pwnbo-x.web.app/assets/pwnbox-og-preview.png">'''
    
    if '</head>' in content:
        new_content = content.replace('</head>', og_block + '\n</head>', 1)
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        count += 1
        print(f'Added OG tags to {f}')

print(f'Successfully added OG tags to {count} files.')
