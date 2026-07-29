#!/usr/bin/env python3
"""
Regenerate assets/social-preview.png, the Open Graph / Twitter share image
for the CGIAR Climate Hub site.

Why this exists: the share image carries the site name baked into pixels, so it
cannot be updated by the text-level renaming passes. Run this script whenever
the site name, strapline, palette or version tag changes.

Palette is taken from assets/styles.css (:root), values marked OFFICIAL there.
The CGIAR Climate Action lockup (assets/cgiar-logo.png) is placed unaltered on
a white panel: the official lockup is dark green on light blue and must not be
recoloured to sit on the site's blue chrome.

Usage:  python3 tools/build-social-preview.py
Output: assets/social-preview.png  (1200 x 630, the OG standard)
"""

import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(HERE, "assets", "cgiar-logo.png")
OUT = os.path.join(HERE, "assets", "social-preview.png")

W, H = 1200, 630

# --- palette, from assets/styles.css :root -----------------------------------
BLUE_900 = (0x12, 0x3E, 0x7A)   # --blue-900, primary (OFFICIAL)
BLUE_800 = (0x19, 0x55, 0xA6)   # --blue-800, programme accent (OFFICIAL)
BLUE_100 = (0xE4, 0xEE, 0xFC)   # --blue-100, programme light (OFFICIAL)
HIGHLIGHT = (0x8F, 0xC4, 0xFF)  # --highlight, bright accent on dark panels
ON_DARK = (0xD7, 0xE3, 0xF5)    # --on-dark, body copy on dark blue panels
WHITE = (0xFF, 0xFF, 0xFF)

# --- copy. Must stay in step with index.html og:title / og:description / footer
TITLE = "CGIAR Climate Hub"
SUBTITLE = [
    "Curated climate and agricultural datasets,",
    "linked to the CGIAR use cases they serve.",
]
BADGE = "v0.2 PROTOTYPE  ·  SHARED FOR REVIEW"

# --- fonts. Site stack is 'Noto Sans', Arial, Helvetica, sans-serif.
# Noto Sans proportional is not installed here; Liberation Sans is the
# metric-compatible stand-in for the Arial/Helvetica fallback.
FONT_DIRS = [
    "/usr/share/fonts/truetype/noto/NotoSans-{}.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-{}.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-{}.ttf",
]


def font(weight, size):
    for pattern in FONT_DIRS:
        path = pattern.format(weight)
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    raise SystemExit("No suitable sans-serif font found for weight " + weight)


f_title = font("Bold", 84)
f_sub = font("Regular", 34)
f_badge = font("Bold", 22)

img = Image.new("RGB", (W, H), BLUE_900)
d = ImageDraw.Draw(img)

# Subtle diagonal band, bottom right, echoing the previous share image.
d.polygon([(W, 330), (W, H), (150, H)], fill=BLUE_800)
# Second, fainter sliver for depth.
d.polygon([(W, 470), (W, H), (620, H)], fill=(0x1B, 0x5E, 0xB6))

MARGIN = 80
y = 66

# --- logo on a white panel ---------------------------------------------------
logo = Image.open(LOGO).convert("RGBA")
logo_h = 62
logo_w = round(logo.width * logo_h / logo.height)
logo = logo.resize((logo_w, logo_h), Image.LANCZOS)

PAD = 14
panel = (MARGIN, y, MARGIN + logo_w + PAD * 2, y + logo_h + PAD * 2)
d.rounded_rectangle(panel, radius=10, fill=WHITE)
img.paste(logo, (MARGIN + PAD, y + PAD), logo)
y = panel[3] + 58

# --- title -------------------------------------------------------------------
d.text((MARGIN, y), TITLE, font=f_title, fill=WHITE)
y += f_title.getbbox(TITLE)[3] + 40

# --- rule --------------------------------------------------------------------
d.rounded_rectangle((MARGIN, y, MARGIN + 132, y + 6), radius=3, fill=HIGHLIGHT)
y += 44

# --- subtitle ----------------------------------------------------------------
for line in SUBTITLE:
    d.text((MARGIN, y), line, font=f_sub, fill=ON_DARK)
    y += 48
y += 20

# --- version badge -----------------------------------------------------------
bx0, by0 = MARGIN, y
tw = d.textlength(BADGE, font=f_badge)
bh = 46
d.rounded_rectangle((bx0, by0, bx0 + tw + 56, by0 + bh), radius=bh // 2,
                    fill=BLUE_100)
d.text((bx0 + 28, by0 + (bh - f_badge.getbbox("A")[3]) / 2 - 3), BADGE,
       font=f_badge, fill=BLUE_900)

img.save(OUT, "PNG", optimize=True)
print("Wrote {} ({} x {})".format(OUT, *img.size))
print("Bottom of content: y = {} of {}".format(by0 + bh, H))
