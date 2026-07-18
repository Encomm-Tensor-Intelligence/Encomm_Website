#!/usr/bin/env python3
"""Generate favicon, app icons, and OG image from the ENCOMM mark.

Reads public/brand/ENCOMM_mark_clean.png and writes to public/icons/ and public/.
The mark is a faceted violet/lilac/cyan crystal on transparent background.
We compose it onto brand-appropriate backgrounds.
"""
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, "public", "brand")
ICONS = os.path.join(ROOT, "public", "icons")
PUBLIC = os.path.join(ROOT, "public")
os.makedirs(ICONS, exist_ok=True)


def load_mark():
    m = Image.open(os.path.join(BRAND, "ENCOMM_mark_clean.png")).convert("RGBA")
    return m


def fit_mark(mark, box):
    w, h = mark.size
    scale = min(box / w, box / h)
    nw, nh = int(w * scale), int(h * scale)
    return mark.resize((nw, nh), Image.LANCZOS)


def paste_centered(canvas, layer):
    cw, ch = canvas.size
    lw, lh = layer.size
    canvas.alpha_composite(layer, ((cw - lw) // 2, (ch - lh) // 2))


def light_bg(size, soft=False):
    """White -> paper gradient background, very subtle violet tint."""
    bg = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    # subtle radial violet->white from center
    for r in range(size // 2, 0, -2):
        t = r / (size / 2)
        # violet 114,92,255 fading to white at edge
        a = int(40 * (1 - t))
        gd.ellipse(
            [size // 2 - r, size // 2 - r, size // 2 + r, size // 2 + r],
            fill=(114, 92, 255, a),
        )
    grad = grad.filter(ImageFilter.GaussianBlur(size // 6))
    bg.alpha_composite(grad)
    if soft:
        bg = bg.filter(ImageFilter.GaussianBlur(0.6))
    return bg


def dark_navy_bg(size):
    """Deep navy for the SVG/favicon contrast variant."""
    bg = Image.new("RGBA", (size, size), (16, 20, 38, 255))
    return bg


def square_mark_on(bg_func, size, pad_ratio=0.18, out=None):
    mark = load_mark()
    bg = bg_func(size)
    # Add a soft contact shadow under mark
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse(
        [
            int(size * 0.22),
            int(size * 0.74),
            int(size * 0.78),
            int(size * 0.90),
        ],
        fill=(16, 20, 38, 60),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(size * 0.05))
    bg.alpha_composite(shadow)
    fm = fit_mark(mark, int(size * (1 - 2 * pad_ratio)))
    paste_centered(bg, fm)
    if out:
        bg.save(out)
    return bg


def main():
    # Standard favicon sizes
    for s in (16, 32, 48):
        square_mark_on(light_bg, s, out=os.path.join(ICONS, f"favicon-{s}.png"))
    # Composite 32 -> favicon.ico
    im32 = Image.open(os.path.join(ICONS, "favicon-32.png"))
    im16 = Image.open(os.path.join(ICONS, "favicon-16.png"))
    im48 = Image.open(os.path.join(ICONS, "favicon-48.png"))
    im32.save(os.path.join(PUBLIC, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
    # Apple touch icon (180) on solid paper (no transparency)
    square_mark_on(light_bg, 180, out=os.path.join(ICONS, "apple-touch-icon.png"))
    # Android chrome icons
    for s in (192, 512):
        square_mark_on(light_bg, s, out=os.path.join(ICONS, f"android-chrome-{s}x{s}.png"))
    # OG / social share image 1200x630
    og = Image.new("RGBA", (1200, 630), (247, 248, 252, 255))
    # subtle radial violet wash
    wash = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wash)
    cx, cy = 860, 315
    for r in range(520, 0, -3):
        t = r / 520
        a = int(60 * (1 - t))
        wd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(114, 92, 255, a))
    wash = wash.filter(ImageFilter.GaussianBlur(120))
    og.alpha_composite(wash)
    # cyan accent on left
    wash2 = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
    wd2 = ImageDraw.Draw(wash2)
    for r in range(380, 0, -3):
        t = r / 380
        a = int(40 * (1 - t))
        wd2.ellipse([220 - r, 120 - r, 220 + r, 120 + r], fill=(102, 215, 245, a))
    wash2 = wash2.filter(ImageFilter.GaussianBlur(90))
    og.alpha_composite(wash2)
    # mark large on right
    mark = load_mark()
    fm = fit_mark(mark, 360)
    og.alpha_composite(fm, (860 - fm.size[0] // 2, 315 - fm.size[1] // 2))
    # wordmark text on left (simple, since we don't ship a custom font reliably here)
    og_rgb = Image.new("RGB", (1200, 630), (247, 248, 252))
    og_rgb.paste(og, (0, 0), og)
    # Draw "ENCOMM" wordmark using default - replaced by SVG mask in nav. Keep minimal.
    og_rgb.save(os.path.join(PUBLIC, "og-image.png"), optimize=True)
    print("Generated icons + og-image.png")


if __name__ == "__main__":
    main()
