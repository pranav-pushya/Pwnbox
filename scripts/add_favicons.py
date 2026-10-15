import os

main_favicon_tag = '    <link rel="icon" type="image/svg+xml" href="favicon-main.svg">\n'
guide_favicon_tag = '    <link rel="icon" type="image/svg+xml" href="favicon-guide.svg">\n'

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Check if favicon already exists
        if any('rel="icon"' in line for line in lines):
            print(f"Favicon already in {filename}")
            continue
            
        is_guide = 'masterguide' in filename.lower()
        tag_to_insert = guide_favicon_tag if is_guide else main_favicon_tag
        
        new_lines = []
        for line in lines:
            new_lines.append(line)
            # Insert right after <title> or <head>
            if '<title>' in line or '<title ' in line:
                new_lines.append(tag_to_insert)
                
        with open(filename, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
        print(f"Added favicon to {filename}")

print("Done.")
