from PIL import Image, ImageDraw, ImageFont
import os

width = 1200
height = 630

# Create base canvas with dark tactical background
img = Image.new("RGBA", (width, height), (10, 10, 15, 255))
draw = ImageDraw.Draw(img)

# 1. Subtle tactical grid pattern
grid_color = (25, 30, 45, 255)
for x in range(0, width, 40):
    draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
for y in range(0, height, 40):
    draw.line([(0, y), (width, y)], fill=grid_color, width=1)

# 2. Glowing outer border
draw.rectangle([(10, 10), (width - 10, height - 10)], outline=(0, 255, 102, 180), width=3)
draw.rectangle([(16, 16), (width - 16, height - 16)], outline=(0, 90, 156, 120), width=1)

# Corner accents
corner_len = 35
for (cx, cy) in [(10, 10), (width - 10, 10), (10, height - 10), (width - 10, height - 10)]:
    dx = corner_len if cx == 10 else -corner_len
    dy = corner_len if cy == 10 else -corner_len
    draw.line([(cx, cy), (cx + dx, cy)], fill=(0, 255, 102, 255), width=6)
    draw.line([(cx, cy), (cx, cy + dy)], fill=(0, 255, 102, 255), width=6)

# 3. Paste tux logo if available
tux_path = "assets/tux_logo.png"
if os.path.exists(tux_path):
    tux_img = Image.open(tux_path).convert("RGBA")
    tux_img = tux_img.resize((140, 140), Image.Resampling.LANCZOS)
    img.paste(tux_img, (70, 70), tux_img)

# 4. Draw Brand Title & Text
# Try to load system fonts, fallback to default
try:
    font_badge = ImageFont.truetype("arialbd.ttf", 20)
    font_title = ImageFont.truetype("arialbd.ttf", 64)
    font_sub = ImageFont.truetype("arial.ttf", 26)
    font_pill = ImageFont.truetype("arialbd.ttf", 18)
except:
    font_badge = font_title = font_sub = font_pill = ImageFont.load_default()

# Header badge
draw.text((230, 75), "// TACTICAL CYBER COMMAND ACADEMY", fill=(0, 255, 102, 255), font=font_badge)

# Main Title
draw.text((230, 110), "PWNBOX", fill=(255, 255, 255, 255), font=font_title)
draw.text((540, 125), "v4.0 PRO", fill=(217, 41, 28, 255), font=font_badge)

# Subtitle
draw.text((70, 240), "Next-Generation Offensive & Defensive Security Platform", fill=(226, 232, 240, 255), font=font_sub)
draw.text((70, 280), "Hands-on kill chain simulation labs, 3D command matrix & cyber arcade.", fill=(148, 163, 184, 255), font=font_sub)

# 5. Feature Badges / Pills
pills = [
    ("8 KILL-CHAIN LABS", (217, 41, 28, 255)),
    ("10-CHAPTER MASTER GUIDE", (0, 90, 156, 255)),
    ("8 CYBER MINI-GAMES", (42, 157, 143, 255)),
    ("DEEP AI ORACLE", (147, 51, 234, 255)),
    ("PWA OFFLINE READY", (234, 179, 8, 255))
]

px = 70
py = 370
for text, border_col in pills:
    bbox = draw.textbbox((px, py), text, font=font_pill)
    pw = bbox[2] - bbox[0] + 30
    ph = bbox[3] - bbox[1] + 20
    draw.rectangle([(px, py), (px + pw, py + ph)], fill=(18, 24, 38, 220), outline=border_col, width=2)
    draw.text((px + 15, py + 10), text, fill=(255, 255, 255, 255), font=font_pill)
    px += pw + 20
    if px > 1050:
        px = 70
        py += 55

# 6. Bottom Status Bar
draw.line([(70, 560), (width - 70, 560)], fill=(40, 50, 70, 255), width=1)
draw.text((70, 575), "TARGET ENVIRONMENT: https://pwnbo-x.web.app", fill=(0, 255, 102, 255), font=font_badge)
draw.text((width - 320, 575), "SECURED VIA CLOUD SHIELD", fill=(148, 163, 184, 255), font=font_badge)

# Save image
out_path = "assets/pwnbox-og-preview.png"
img.save(out_path, format="PNG")
print(f"Generated Social Share Preview Image at: {out_path} ({width}x{height} px)")
