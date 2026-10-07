/**
 * Pairwise similarity of the UNIQUE prose on the area pages.
 *
 *   node scripts/proof/area-similarity.mjs
 *
 * City pages are the easiest thing on a service site to mass-produce, and a
 * find-and-replaced template is obvious to a reader and worthless to a search
 * engine. This measures how much of the per-city writing is actually shared.
 *
 * WHAT IT READS: the <article data-area-prose> block and the FAQ accordion.
 * Nothing else. The service list, the offers band, the hours panel, the other
 * areas list and the CTA are identical on every area page ON PURPOSE, and
 * including them would drown the signal in boilerplate that is supposed to be
 * boilerplate.
 *
 * MEASURE: overlapping 5-word shingles, Jaccard-style but reported as the
 * share of the SMALLER page's shingles that also appear in the larger one,
 * which is the stricter reading. Ceiling is 60%.
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.join(process.cwd(), 'out', 'areas')
const CEILING = 0.60

const text = (h) =>
  h
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;| /g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function proseOf(html) {
  const art = html.match(/<article[^>]*data-area-prose[^>]*>([\s\S]*?)<\/article>/)
  const faqs = [...html.matchAll(/<details[\s\S]*?<\/details>/g)].map((m) => m[0]).join(' ')
  return text((art ? art[1] : '') + ' ' + faqs)
}

const shingles = (s, n = 5) => {
  const w = s.split(' ').filter(Boolean)
  const out = new Set()
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '))
  return out
}

if (!fs.existsSync(OUT)) {
  console.error('no out/areas directory; build first')
  process.exit(1)
}
const pages = fs
  .readdirSync(OUT)
  .filter((f) => f.endsWith('.html'))
  .sort()
  .map((f) => {
    const html = fs.readFileSync(path.join(OUT, f), 'utf8')
    const p = proseOf(html)
    return { slug: f.replace(/\.html$/, ''), words: p.split(' ').length, sh: shingles(p) }
  })

console.log(`\nAREA PROSE SIMILARITY, ${pages.length} pages, 5-word shingles, ceiling ${Math.round(CEILING * 100)}%`)
console.log('(measured on <article data-area-prose> plus the FAQ accordion only)\n')
console.log('page'.padEnd(15) + 'words  shingles')
for (const p of pages) console.log(p.slug.padEnd(15) + String(p.words).padStart(5) + String(p.sh.size).padStart(10))

const w = 15
console.log('\n' + ''.padEnd(w) + pages.map((p) => p.slug.slice(0, 6).padStart(8)).join(''))
let worst = { v: 0 }
let over = 0
for (const a of pages) {
  let row = a.slug.padEnd(w)
  for (const b of pages) {
    if (a.slug === b.slug) {
      row += '       -'
      continue
    }
    const inter = [...a.sh].filter((x) => b.sh.has(x)).length
    const v = inter / Math.min(a.sh.size, b.sh.size)
    if (v > worst.v) worst = { v, a: a.slug, b: b.slug }
    if (v > CEILING) over++
    row += (v === 0 ? '      0%' : `${(v * 100).toFixed(0)}%`.padStart(8))
  }
  console.log(row)
}
console.log('')
console.log(`highest pair: ${worst.a} / ${worst.b} at ${(worst.v * 100).toFixed(1)}%`)
console.log(over ? `FAIL: ${over / 2} pair(s) above the ceiling.` : `PASS: no pair above ${Math.round(CEILING * 100)}%.`)
process.exit(over ? 1 : 0)
