#!/usr/bin/env python3
"""Generate favicon PNG/ICO assets from the waveform mark design."""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
BG = (8, 11, 16, 255)
BAR = (166, 233, 255, 255)
BARS = ((6, 14, 3, 12), (11, 8, 3, 18), (16, 11, 3, 15), (21, 6, 3, 20))


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    scale = size / 32
    radius = max(1, round(4 * scale))

    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=BG)

    for x, y, w, h in BARS:
        left = round(x * scale)
        top = round(y * scale)
        right = round((x + w) * scale) - 1
        bottom = round((y + h) * scale) - 1
        cap = max(1, round(1.5 * scale))
        draw.rounded_rectangle((left, top, right, bottom), radius=cap, fill=BAR)

    return img


def main() -> None:
    outputs = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
    }

    for name, size in outputs.items():
        draw_icon(size).save(ROOT / name, format="PNG")

    draw_icon(32).save(
        ROOT / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

    print("Generated favicon PNG/ICO assets in", ROOT)


if __name__ == "__main__":
    main()
