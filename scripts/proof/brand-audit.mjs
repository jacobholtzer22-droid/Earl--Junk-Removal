/**
 * Where does "EJC Demo Junk & Haul" still appear, and is each one deliberate?
 *
 *   node scripts/proof/brand-audit.mjs
 *
 * The customer-facing brand is Houston Waste Removal. EJC Demo Junk & Haul is
 * the operating company and must stay visible, but only in the places that
 * were chosen for it. Anywhere else is a rename that was missed, and a missed
 * rename reads to a visitor as two different businesses.
 *
 * Allowed homes: the header lockup, the footer attribution, the about page and
 * the homepage about teaser, the homepage FAQ that answers the question
 * directly, the legal pages, schema.org alternateName, and the logo's own alt
 * text, since the badge genuinely is the EJC mark and describing it as
 * anything else would be wrong. Anything else fails this script.
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.join(process.cwd(), 'out')
const OLD = 'EJC Demo Junk & Haul'
const ENC = 'EJC Demo Junk &amp; Haul'

function walk(d) {
  const o = []
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) o.push(...walk(p))
    else if (e.name.endsWith('.html')) o.push(p)
  }
  return o.sort()
}
const routeOf = (f) => {
  const r = '/' + path.relative(OUT, f).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  return r === '/' ? '/' : r
}
const section = (html, tag) => {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return m ? m[1] : ''
}
const countIn = (s) => (s.split(OLD).length - 1) + (s.split(ENC).length - 1)

const rows = []
let unclassified = 0

for (const f of walk(OUT)) {
  if (path.basename(f) === '404.html') continue
  const html = fs.readFileSync(f, 'utf8')
  const route = routeOf(f)

  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(' ')
  // The logo's alt text names the badge, which IS the EJC mark. Counted on its
  // own so it cannot hide inside another bucket, and stripped before the rest
  // is classified.
  const alts = [...html.matchAll(/alt="([^"]*)"/g)].map((m) => m[1]).join(' ')
  const stripAlts = (s) => s.replace(/alt="[^"]*"/g, '')
  const head = stripAlts(section(html, 'header'))
  const foot = stripAlts(section(html, 'footer'))
  const details = [...html.matchAll(/<details[\s\S]*?<\/details>/g)].map((m) => m[0]).join(' ')
  const teaser = stripAlts(
    (html.match(/<section data-about-teaser[\s\S]*?<\/section>/) ?? [''])[0],
  )

  // Body = everything outside head/header/footer/details/script.
  let body = html
    .replace(/<head[\s\S]*?<\/head>/, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<header[\s\S]*?<\/header>/, '')
    .replace(/<footer[\s\S]*?<\/footer>/, '')
    .replace(/<details[\s\S]*?<\/details>/g, '')
    .replace(/<section data-about-teaser[\s\S]*?<\/section>/, '')
    .replace(/alt="[^"]*"/g, '')

  const buckets = {
    lockup: countIn(head),
    footer: countIn(foot),
    FAQ: countIn(details),
    schema: countIn(ld),
    'logo alt': countIn(alts),
  }
  if (countIn(teaser)) buckets.about = (buckets.about ?? 0) + countIn(teaser)
  const bodyCount = countIn(body)
  if (bodyCount) {
    if (route === '/about') buckets.about = bodyCount
    else if (route === '/privacy-policy' || route === '/terms') buckets.legal = bodyCount
    else {
      buckets.UNCLASSIFIED = bodyCount
      unclassified += bodyCount
    }
  }
  const total = Object.values(buckets).reduce((a, b) => a + b, 0)
  if (total) rows.push({ route, buckets, total })
}

const cols = ['lockup', 'footer', 'about', 'FAQ', 'legal', 'schema', 'logo alt', 'UNCLASSIFIED']
const w = Math.max(...rows.map((r) => r.route.length), 5)
console.log(`\nWHERE "${OLD}" STILL APPEARS, per page\n`)
console.log('route'.padEnd(w) + cols.map((c) => c.padStart(14)).join('') + '   total')
console.log('-'.repeat(w) + cols.map(() => '  ------------').join('') + '   -----')
for (const r of rows) {
  console.log(
    r.route.padEnd(w) + cols.map((c) => String(r.buckets[c] ?? 0).padStart(14)).join('') + String(r.total).padStart(8),
  )
}
const totals = Object.fromEntries(cols.map((c) => [c, rows.reduce((a, r) => a + (r.buckets[c] ?? 0), 0)]))
console.log('-'.repeat(w) + cols.map(() => '  ------------').join('') + '   -----')
console.log('TOTAL'.padEnd(w) + cols.map((c) => String(totals[c]).padStart(14)).join('') +
  String(rows.reduce((a, r) => a + r.total, 0)).padStart(8))

const llms = fs.existsSync(path.join(OUT, 'llms.txt')) ? countIn(fs.readFileSync(path.join(OUT, 'llms.txt'), 'utf8')) : 0
console.log(`\nllms.txt (not a page, the "Company names" block): ${llms}`)
console.log('')
if (unclassified) {
  console.error(`FAIL: ${unclassified} occurrence(s) outside the allowed homes. Each one is a missed rename.`)
  process.exit(1)
}
console.log('PASS. Every occurrence is in an allowed home: lockup, footer, about, FAQ, legal or schema.')
