/**
 * WCAG contrast audit of theme.ts, for the colour pairs this site actually
 * renders. Run: node scripts/proof/contrast.mjs
 *
 * Every pair below corresponds to a real combination in the components, not a
 * theoretical matrix. AA is 4.5:1 for body text and 3:1 for large text (>=24px,
 * or >=18.66px bold) and for UI boundaries.
 */
import fs from 'node:fs'

const src = fs.readFileSync(new URL('../../theme.ts', import.meta.url), 'utf8')
const p = Object.fromEntries(
  [...src.matchAll(/^\s{4}(\w+):\s*'(#[0-9A-Fa-f]{6})'/gm)].map((m) => [m[1], m[2]]),
)

const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
function L(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [x, y] = [L(a), L(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

/** [label, foreground, background, minimum required] */
const PAIRS = [
  ['body text on page ground', 'ink', 'bg', 4.5],
  ['body text on surface', 'ink', 'surface', 4.5],
  ['muted text on page ground', 'muted', 'bg', 4.5],
  ['muted text on surface', 'muted', 'surface', 4.5],
  ['heading on interior page header', 'primaryDark', 'primarySoft', 4.5],
  ['muted text on interior page header', 'muted', 'primarySoft', 4.5],
  ['text on the dark sections', 'onPrimary', 'primary', 4.5],
  ['text on the darkest sections', 'onPrimary', 'primaryDark', 4.5],

  // LIGHT SECTIONS: deep green fill, white label. Header "Call now", CtaBand,
  // MobileCallBar, PromoBar, and the sealed ContactForm submit button, which
  // picks these two tokens up without being edited.
  ['button label on the deep green fill (light sections)', 'onAccent', 'accent', 4.5],
  ['button label on the hover state', 'onAccent', 'accentDark', 4.5],
  ['deep green fill against the page ground (UI boundary)', 'accent', 'bg', 3],

  // DARK SECTIONS: lime fill, near-black label. Hero CTA and OffersBand CTA.
  // The deep green fill reads 2.17:1 here, so the call to action would stop
  // being the loudest thing in the section if it were used.
  ['button label on the lime fill (dark sections)', 'primaryDark', 'accentOnDark', 4.5],
  ['lime fill against the dark section (UI boundary)', 'accentOnDark', 'primary', 3],

  // The green as TEXT, which is the pair that decides the whole system.
  ['deep green text on the page ground', 'accentDark', 'bg', 4.5],
  ['deep green text on surface', 'accentDark', 'surface', 4.5],
  ['deep green text on the interior page header', 'accentDark', 'primarySoft', 4.5],
  ['lime text on the dark sections', 'accentOnDark', 'primary', 4.5],
  ['lime text on the darkest sections', 'accentOnDark', 'primaryDark', 4.5],

  // Focus ring. Two-tone on purpose: no single brand colour clears 3:1 on
  // both grounds, so the inner ring carries dark surfaces and the outer ring
  // carries light ones. See the :focus-visible rule in app/globals.css.
  ['focus ring, inner lime on a dark surface', 'accentOnDark', 'primary', 3],
  ['focus ring, outer near-black on the page ground', 'primaryDark', 'bg', 3],
  ['focus ring, outer near-black on surface', 'primaryDark', 'surface', 3],

  ['form input border on surface (UI boundary)', 'line', 'surface', 3],
  ['section rule on page ground (UI boundary)', 'line', 'bg', 3],
]

/**
 * Combinations the palette can produce but the site never renders, with the
 * measurement that is the reason why. Listed rather than quietly avoided.
 */
/*
 * Combinations that must NEVER be rendered, listed with the number that says
 * why. This block is a NOTE, not a guarantee: an earlier version of it claimed
 * a pair was never rendered while four components were rendering it, and
 * Lighthouse caught that, not this script. Run Lighthouse too.
 */
const AVOIDED = [
  ['the lime as TEXT on the page ground', null, 'accentOnDark', 'bg',
   'invisible. Lime is for dark grounds only, as fill or as text. On light, use accentDark'],
  ['the lime as TEXT on surface', null, 'accentOnDark', 'surface',
   'same, and the brightest failure on the site if it ever ships'],
  ['the deep green as TEXT on a dark section', null, 'accent', 'primary',
   'this is the pair the whole dark-ground rule exists to prevent. Use accentOnDark'],
  ['the deep green button fill on a dark section', null, 'accentDark', 'primary',
   'the call to action would be darker than the panel it sits on'],
]


let fails = 0
const w = Math.max(...PAIRS.map(([l]) => l.length))
console.log(`\n${'pair'.padEnd(w)}  fg       bg       ratio   min   result`)
console.log(`${'-'.repeat(w)}  -------  -------  ------  ----  ------`)
for (const [label, fg, bg, min] of PAIRS) {
  const r = ratio(p[fg], p[bg])
  const ok = r >= min
  if (!ok) fails++
  console.log(
    `${label.padEnd(w)}  ${p[fg]}  ${p[bg]}  ${r.toFixed(2).padStart(6)}  ${String(min).padStart(4)}  ${ok ? 'PASS' : 'FAIL'}`,
  )
}
console.log('')
console.log('Deliberately never rendered:')
for (const [label, fgHex, fgTok, bgTok, why] of AVOIDED) {
  const fg = fgHex ?? p[fgTok]
  console.log(`  ${label}: ${ratio(fg, p[bgTok]).toFixed(2)}:1 -> ${why}`)
}
console.log('')
console.log(fails ? `${fails} pair(s) FAILED.` : `All ${PAIRS.length} rendered colour pairs meet WCAG AA.`)
process.exit(fails ? 1 : 0)
