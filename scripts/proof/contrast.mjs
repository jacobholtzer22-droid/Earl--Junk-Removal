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
  ['button label on the accent fill', 'onAccent', 'accent', 4.5],
  ['button label on accent hover (light, see globals.css)', 'onPrimary', 'accentDark', 4.5],
  ['form validation text on surface', 'accentDark', 'surface', 4.5],
  ['accent rule / mark on dark (non-text)', 'accent', 'primary', 3],
  ['form input border on surface (UI boundary)', 'line', 'surface', 3],
  ['section rule on page ground (UI boundary)', 'line', 'bg', 3],
  ['amber-family text on the page ground', 'accentDark', 'bg', 4.5],
  ['amber-family text on the interior page header', 'accentDark', 'primarySoft', 4.5],
]

/**
 * Combinations the palette can produce but the site never renders, with the
 * measurement that is the reason why. Listed rather than quietly avoided.
 */
const AVOIDED = [
  ['white on the amber accent', '#FFFFFF', null, 'accent', 'on-accent is near-black everywhere instead'],
  ['the bright accent as TEXT on the light ground', null, 'accent', 'bg', 'use accent-dark instead. This file previously asserted the combination was never rendered; it was, in four places (service numerals, step numerals, the about eyebrow and a hover state), and Lighthouse caught it, not this script. The assertion below is a note, not a guarantee: run Lighthouse too'],
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
