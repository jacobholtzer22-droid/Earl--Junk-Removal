/**
 * Draws public/og-card.png, the 1200x630 social card.
 *
 * A script rather than a one-off export so the card cannot drift from the
 * palette. Every colour is read out of theme.ts, so changing a token and
 * re-running this is the whole update; nothing here hardcodes a hex.
 *
 *   node scripts/og-card.mjs
 *
 * Fonts are fetched from the Google Fonts repository on first run and cached
 * in .cache/fonts, because the copies next/font ships are woff2 and subset,
 * which neither sharp nor a rasteriser can draw with.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = process.cwd()
const CACHE = path.join(ROOT, '.cache/fonts')
const FONTS = {
  'Archivo.ttf': 'https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf',
  'Barlow-Regular.ttf': 'https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-Regular.ttf',
}
fs.mkdirSync(CACHE, { recursive: true })
for (const [name, url] of Object.entries(FONTS)) {
  const p = path.join(CACHE, name)
  if (!fs.existsSync(p)) {
    console.log(`fetching ${name}`)
    execFileSync('curl', ['-sL', '-o', p, url, '--max-time', '60'])
  }
}

// Palette straight out of theme.ts, via tsx so there is one source.
const palette = JSON.parse(
  execFileSync('npx', ['tsx', '-e', "import t from './theme';process.stdout.write(JSON.stringify(t.palette))"], {
    cwd: ROOT, encoding: 'utf8',
  }),
)

const py = `
import json, sys
from PIL import Image, ImageDraw, ImageFont
P = json.loads(sys.argv[1])
CACHE = sys.argv[2]
W, H = 1200, 630
def rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

card = Image.new('RGB', (W, H), rgb(P['primary']))
d = ImageDraw.Draw(card)

# Lime rule across the top, the brand's own device on a dark ground.
d.rectangle([0, 0, W, 10], fill=rgb(P['accentOnDark']))

# The supplied lockup, knockout version because the ground is dark.
logo = Image.open('public/images/originals/houston-waste-removal-logo-white.png').convert('RGBA')
lh = 250
lw = int(logo.width * lh / logo.height)
card.paste(logo.resize((lw, lh), Image.LANCZOS), (72, 58), logo.resize((lw, lh), Image.LANCZOS))

def archivo(size, weight=700, width=100):
    # Axis order is [Weight, Width] in this file, NOT the [wdth,wght] the
    # filename suggests. Passing them the other way round silently renders a
    # 92-weight hairline instead of a 700-weight headline, which is what the
    # first version of this card did.
    f = ImageFont.truetype(f'{CACHE}/Archivo.ttf', size)
    f.set_variation_by_axes([weight, width])
    return f
barlow = lambda s: ImageFont.truetype(f'{CACHE}/Barlow-Regular.ttf', s)

# Right block: the operating company and the two facts, unchanged copy.
rx = W - 72
d.text((rx, 96),  'by EJC Demo Junk & Haul', font=barlow(34), fill=rgb(P['onPrimary']), anchor='ra')
d.text((rx, 146), 'Veteran owned  ·  Open 7 days', font=barlow(32), fill=rgb(P['accentOnDark']), anchor='ra')

# Headline, unchanged copy, in the display face at a narrowed width so the
# longer line clears the card edge.
d.text((72, 372), 'JUNK REMOVAL',        font=archivo(86, 800, 94), fill=rgb(P['onPrimary']), anchor='ls')
d.text((72, 470), '& LIGHT DEMOLITION',  font=archivo(86, 800, 86), fill=rgb(P['onPrimary']), anchor='ls')
d.text((72, 549), 'HOUSTON, TX',         font=archivo(46, 800, 100), fill=rgb(P['accentOnDark']), anchor='ls')

card.save('public/og-card.png')
print('wrote public/og-card.png', card.size)
`
execFileSync('python3', ['-c', py, JSON.stringify(palette), CACHE], { cwd: ROOT, stdio: 'inherit' })
