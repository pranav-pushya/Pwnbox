import os
import re

css_content = """
/* Resizer CSS */
.resizer-v {
    width: 6px;
    background-color: var(--border-dim);
    cursor: col-resize;
    z-index: 10;
    transition: background-color 0.2s;
    flex-shrink: 0;
}
.resizer-v:hover, .resizer-v.dragging {
    background-color: var(--accent-primary);
}
@media (max-width: 768px) {
    .resizer-v {
        display: none !important;
    }
}
"""

with open('css/resizer.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

modules = [
    'Footprinting.html',
    'Scanning.html',
    'Enumeration.html',
    'Vulnerablity.html',
    'SystemHacking.html',
    'WebAppThreats.html'
]

for mod in modules:
    with open(mod, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add css/resizer.css
    if 'css/resizer.css' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/resizer.css">\n</head>')

    # 2. Add js/resizer.js
    if 'js/resizer.js' not in content:
        content = content.replace('</body>', '    <script src="js/resizer.js"></script>\n</body>')

    # 3. Add sidebar resizer
    if 'id="sidebarResizer"' not in content:
        content = re.sub(
            r'(</div>\s*<div class="workspace">)',
            r'</div>\n    <div class="resizer-v" id="sidebarResizer"></div>\n    <div class="workspace">',
            content
        )

    # 4. Add panel resizer
    if 'id="panelResizer"' not in content:
        content = re.sub(
            r'(</div>\s*<div class="chat-panel">)',
            r'</div>\n            <div class="resizer-v" id="panelResizer"></div>\n            <div class="chat-panel">',
            content
        )

    with open(mod, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Successfully injected resizers into all modules!")
