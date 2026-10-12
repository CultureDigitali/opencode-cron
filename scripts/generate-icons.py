#!/usr/bin/env python3
"""
Generate crisp, elegant desktop and system tray icons for OpenCode Cron.
Supports:
- App Icon: 512x512 PNG, 256x256, 128x128
- macOS Menu Bar: Template icons (monochrome black on transparent, 18x18 and 36x36 @2x)
- Windows / Linux System Tray: Colored icons with emerald connected status dot (16x16 and 32x32 @2x)
"""

import os
import math
from PIL import Image, ImageDraw

ICONS_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

def draw_app_icon(size=512):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded rectangle background with deep dark slate gradient
    pad = int(size * 0.05)
    r = int(size * 0.22)
    # Background squircle
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, fill=(15, 23, 42, 255), outline=(99, 102, 241, 180), width=int(size * 0.015))

    # Inner circular clock track
    cx, cy = size // 2, size // 2
    radius = int(size * 0.32)
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline=(79, 70, 229, 220), width=int(size * 0.035))

    # Center dot
    center_r = int(size * 0.04)
    draw.ellipse([cx - center_r, cy - center_r, cx + center_r, cy + center_r], fill=(129, 140, 248, 255))

    # Clock hands (pointing to ~10:10 with AI dynamic angles)
    # Hour hand (pointing to 10 o'clock: -120 deg)
    h_len = int(radius * 0.55)
    h_angle = math.radians(-120)
    hx = cx + h_len * math.sin(h_angle)
    hy = cy - h_len * math.cos(h_angle)
    draw.line([cx, cy, hx, hy], fill=(224, 231, 255, 255), width=int(size * 0.035))

    # Minute hand (pointing to 2 o'clock: 60 deg)
    m_len = int(radius * 0.78)
    m_angle = math.radians(60)
    mx = cx + m_len * math.sin(m_angle)
    my = cy - m_len * math.cos(m_angle)
    draw.line([cx, cy, mx, my], fill=(165, 180, 252, 255), width=int(size * 0.025))

    # Spark / lightning indicator near 12 o'clock
    spark_y = cy - radius - int(size * 0.03)
    draw.ellipse([cx - int(size*0.02), spark_y - int(size*0.02), cx + int(size*0.02), spark_y + int(size*0.02)], fill=(245, 158, 11, 255))

    # Status connected pill on bottom right
    dot_r = int(size * 0.065)
    dot_x = cx + int(radius * 0.75)
    dot_y = cy + int(radius * 0.75)
    draw.ellipse([dot_x - dot_r - 2, dot_y - dot_r - 2, dot_x + dot_r + 2, dot_y + dot_r + 2], fill=(15, 23, 42, 255))
    draw.ellipse([dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r], fill=(16, 185, 129, 255))

    return img

def draw_tray_template(size=18, active=False):
    # macOS Template icons: black pixels with alpha, transparent background
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2
    r = int(size * 0.40)
    w = max(1, int(size * 0.09))

    # Outer clock circle
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 0, 0, 255), width=w)

    # Hands
    # Hour hand (up-left)
    draw.line([cx, cy, cx - int(r * 0.45), cy - int(r * 0.45)], fill=(0, 0, 0, 255), width=w)
    # Minute hand (up-right)
    draw.line([cx, cy, cx + int(r * 0.65), cy - int(r * 0.25)], fill=(0, 0, 0, 255), width=w)

    # Top indicator tab (cron bell / alarm notch)
    notch_h = max(1, int(size * 0.12))
    draw.line([cx, cy - r - notch_h, cx, cy - r], fill=(0, 0, 0, 255), width=w)

    if active:
        # Indicator badge dot at bottom right
        badge_r = max(2, int(size * 0.18))
        bx = size - badge_r - 1
        by = size - badge_r - 1
        draw.ellipse([bx - badge_r, by - badge_r, bx + badge_r, by + badge_r], fill=(0, 0, 0, 255))

    return img

def draw_colored_tray(size=16, connected=True):
    # Windows/Linux colored tray icon
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2
    r = int(size * 0.42)
    w = max(1, int(size * 0.10))

    # Indigo circular clock
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(30, 27, 75, 230), outline=(99, 102, 241, 255), width=w)

    # Hands
    draw.line([cx, cy, cx - int(r * 0.45), cy - int(r * 0.45)], fill=(255, 255, 255, 255), width=w)
    draw.line([cx, cy, cx + int(r * 0.60), cy - int(r * 0.20)], fill=(165, 180, 252, 255), width=w)

    # Status dot (green if connected, amber if disconnected)
    dot_color = (16, 185, 129, 255) if connected else (245, 158, 11, 255)
    dot_r = max(2, int(size * 0.20))
    dx = size - dot_r - 1
    dy = size - dot_r - 1
    draw.ellipse([dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r], fill=dot_color, outline=(15, 23, 42, 255), width=1)

    return img

def main():
    # 1. Main App Icon
    app512 = draw_app_icon(512)
    app512.save(os.path.join(ICONS_DIR, "icon.png"), "PNG")
    app256 = app512.resize((256, 256), Image.Resampling.LANCZOS)
    app256.save(os.path.join(ICONS_DIR, "icon-256.png"), "PNG")
    app128 = app512.resize((128, 128), Image.Resampling.LANCZOS)
    app128.save(os.path.join(ICONS_DIR, "icon-128.png"), "PNG")
    print("Created app icons: icon.png, icon-256.png, icon-128.png")

    # 2. macOS Menu Bar Template Icons
    tray18 = draw_tray_template(18, active=False)
    tray18.save(os.path.join(ICONS_DIR, "trayTemplate.png"), "PNG")

    tray36 = draw_tray_template(36, active=False)
    tray36.save(os.path.join(ICONS_DIR, "trayTemplate@2x.png"), "PNG")

    tray_act18 = draw_tray_template(18, active=True)
    tray_act18.save(os.path.join(ICONS_DIR, "tray-activeTemplate.png"), "PNG")

    tray_act36 = draw_tray_template(36, active=True)
    tray_act36.save(os.path.join(ICONS_DIR, "tray-activeTemplate@2x.png"), "PNG")
    print("Created macOS tray template icons.")

    # 3. Windows & Linux Colored Tray Icons
    win16 = draw_colored_tray(16, connected=True)
    win16.save(os.path.join(ICONS_DIR, "tray-win.png"), "PNG")

    win32 = draw_colored_tray(32, connected=True)
    win32.save(os.path.join(ICONS_DIR, "tray-win@2x.png"), "PNG")

    win16_disc = draw_colored_tray(16, connected=False)
    win16_disc.save(os.path.join(ICONS_DIR, "tray-win-disconnected.png"), "PNG")

    win32_disc = draw_colored_tray(32, connected=False)
    win32_disc.save(os.path.join(ICONS_DIR, "tray-win-disconnected@2x.png"), "PNG")
    print("Created Windows/Linux tray icons.")

if __name__ == "__main__":
    main()

