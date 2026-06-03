# subrythm.com

Static marketing site and in-browser audio player for **Subrythm** — Adam King & Rob Fines, an electronic music duo and Live PA from Toronto.

Live site: [https://subrythm.com/](https://subrythm.com/)

## Features

- Single-page layout with hero, embedded HTML5 player, and Discogs link
- Two albums with full tracklists: *Preliminary Muse* and *Tekkyes*
- Shuffle, seek, mute, and album-art display
- Dark theme, responsive layout, Orbitron / Space Grotesk typography
- Content Security Policy and Open Graph / Twitter meta tags

## Project structure

```
.
├── index.html          # Page shell and player markup
├── styles.css          # Stylesheet (cache-busted in HTML)
├── player.js           # Album catalog, playback, and UI logic
├── assets/
│   ├── audio/          # MP3 releases and album art
│   └── images/         # Site background image
├── Makefile            # Deploy via rsync to mounted web root
├── favicon.svg         # Master favicon (waveform mark)
├── site.webmanifest    # PWA icon manifest
├── scripts/
│   └── generate-icons.py  # Regenerate PNG/ICO from favicon.svg design
└── deploy-marker.txt   # UTC timestamp written on last deploy
```

## Local preview

From the repo root, serve the directory over HTTP (required for audio paths and CSP):

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/).

## Deploy

The site is deployed by rsync to a mounted web volume (default: `/Volumes/data/websites/subrythm.com/`).

```bash
make deploy
```

Override paths when needed:

```bash
make deploy TARGET=/path/to/web/root/
```

Ensure the target volume is mounted before deploying. `deploy-marker.txt` records the last deploy time in the project root.

## Favicons

The site uses a cyan waveform mark on `#080b10`, matching the player accent and `theme-color`.

- **Source:** `favicon.svg` (vector master) and `safari-pinned-tab.svg` (Safari pinned tab)
- **Generated:** `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`

Regenerate raster icons after editing the SVG design:

```bash
make icons
```

Requires Python 3 with [Pillow](https://pypi.org/project/pillow/) installed.

## Releases in the player

| Album | Tracks |
|-------|--------|
| Subrythm - Preliminary Muse | 10 |
| Subrythm - Tekkyes | 11 |

Track metadata and filenames are defined in `player.js`.

## License

© Subrythm. Site content and audio are all rights reserved unless otherwise noted.
