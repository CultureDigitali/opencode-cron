#!/usr/bin/env python3
"""
Process opencode-cron brand assets with high-fidelity color mapping:
- logo-transparent.png (original deep teal-charcoal on transparent)
- logo-dark.png (two-tone: crisp bone white astrolabe + electric teal core on transparent)
- icon.png (512x512 app icon with #191919 canvas, inner subtle glow and padding)
- favicons & tray icon
"""
import os
import math
from PIL import Image
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_PATH = os.path.join(BASE_DIR, "assets", "logo.png")

img = Image.open(LOGO_PATH).convert("RGBA")
arr = np.array(img, dtype=np.float32)

r_chan = arr[:, :, 0]
g_chan = arr[:, :, 1]
b_chan = arr[:, :, 2]

# Compute luminance
lum = 0.299 * r_chan + 0.587 * g_chan + 0.114 * b_chan

# Alpha from white background: lum > 250 is fully transparent, lum < 100 is fully opaque
alpha = np.clip((250.0 - lum) / (250.0 - 100.0) * 255.0, 0, 255).astype(np.uint8)

# 1. Transparent original
orig_trans = np.zeros_like(arr, dtype=np.uint8)
orig_trans[:, :, 0] = arr[:, :, 0].astype(np.uint8)
orig_trans[:, :, 1] = arr[:, :, 1].astype(np.uint8)
orig_trans[:, :, 2] = arr[:, :, 2].astype(np.uint8)
orig_trans[:, :, 3] = alpha

Image.fromarray(orig_trans, "RGBA").save(os.path.join(BASE_DIR, "assets", "logo-transparent.png"), "PNG")
Image.fromarray(orig_trans, "RGBA").save(os.path.join(BASE_DIR, "site", "assets", "img", "logo-transparent.png"), "PNG")

# 2. Dark-mode variant:
# Center coordinates
h, w = arr.shape[:2]
cy, cx = h / 2.0, w / 2.0
y_idx, x_idx = np.ogrid[:h, :w]
dist_from_center = np.sqrt((x_idx - cx)**2 + (y_idx - cy)**2)

# Central nucleus (< 165px radius) gets vibrant Electric Teal #14b8a6 (20, 184, 166)
# Outer astrolabe clockwork (>= 165px) gets Warm Bone White #f4f4f0 (244, 244, 240)
dark_variant = np.zeros_like(arr, dtype=np.uint8)

is_core = dist_from_center < 165.0

# Core: electric teal
dark_variant[is_core, 0] = 20   # R
dark_variant[is_core, 1] = 184  # G
dark_variant[is_core, 2] = 166  # B

# Outer clockwork: crisp bone white
dark_variant[~is_core, 0] = 244 # R
dark_variant[~is_core, 1] = 244 # G
dark_variant[~is_core, 2] = 240 # B

# Preserve smooth alpha
dark_variant[:, :, 3] = alpha

dark_img = Image.fromarray(dark_variant, "RGBA")
dark_img.save(os.path.join(BASE_DIR, "assets", "logo-dark.png"), "PNG")
dark_img.save(os.path.join(BASE_DIR, "site", "assets", "img", "logo-dark.png"), "PNG")

# 3. macOS & Desktop App Icon (512x512 with squircle / dark background #191919)
icon_canvas = Image.new("RGBA", (512, 512), (25, 25, 25, 255))
scaled_logo = dark_img.resize((410, 410), Image.Resampling.LANCZOS)
icon_canvas.paste(scaled_logo, (51, 51), scaled_logo)
icon_canvas.save(os.path.join(BASE_DIR, "assets", "icon.png"), "PNG")

# 4. Favicon suite
fav32 = icon_canvas.resize((32, 32), Image.Resampling.LANCZOS)
fav32.save(os.path.join(BASE_DIR, "site", "favicon.png"), "PNG")
fav32.save(os.path.join(BASE_DIR, "site", "assets", "img", "favicon.png"), "PNG")
fav32.save(os.path.join(BASE_DIR, "site", "favicon.ico"), format="ICO")

fav192 = icon_canvas.resize((192, 192), Image.Resampling.LANCZOS)
fav192.save(os.path.join(BASE_DIR, "site", "assets", "img", "icon-192.png"), "PNG")

# 5. Tray icon (22x22 template icon)
tray = dark_img.resize((22, 22), Image.Resampling.LANCZOS)
tray.save(os.path.join(BASE_DIR, "assets", "tray-icon.png"), "PNG")

print("Generated complete two-tone brand asset suite successfully!")

