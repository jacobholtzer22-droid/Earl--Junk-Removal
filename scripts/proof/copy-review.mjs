/**
 * Writes seo/COPY-REVIEW.md from the BUILT HTML in ./out.
 *
 *   node scripts/proof/copy-review.mjs
 *
 * Read from the build, never from content/*.mdx or site.config.ts, because the
 * point of this document is to show the client what is actually on the page.
 * Source files go through MDX compilation, config interpolation and component
 * composition before a visitor sees them, and a review of the source is a
 * review of something nobody reads.
 *
 * It also cross-checks its own FAQ count against the FAQPage JSON-LD on the
 * same pages. The visible accordion and the structured data are rendered from
 * the same objects in lib/schema.ts, so if those two numbers ever disagree,
 * the page and the markup have drifted and the file says so loudly.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'out')
const TARGET = path.join(ROOT, 'seo', 'COPY-REVIEW.md')

function walk(d) {
  const o = []
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) o.push(...walk(p))
    else if (e.name.endsWith('.html')) o.push(p)
  }
  return o.sort()
}

const dec = (s) =>
  s
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;| /g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const pages = walk(OUT).filter((f) => path.basename(f) !== '404.html')
const routeOf = (f) => {
  const r = '/' + path.relative(OUT, f).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  return r === '/' ? '/' : r
}

const home = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8')

// ---------- hero ----------
const heroSection = (home.match(/<section class="relative isolate[\s\S]*?<\/section>/) ?? [])[0] ?? ''
const heroEyebrow = dec((heroSection.match(/<p class="font-heading text-sm[^"]*">([\s\S]*?)<\/p>/) ?? [])[1] ?? '')
const heroH1 = dec((home.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [])[1] ?? '')
const heroSub = dec((heroSection.match(/<p class="mt-6 max-w-2xl[^"]*">([\s\S]*?)<\/p>/) ?? [])[1] ?? '')
const heroChips = [...heroSection.matchAll(/<li class="border-t-2[^"]*"><span[^>]*>([\s\S]*?)<\/span><\/li>/g)].map((m) => dec(m[1]))
const heroNoComments = heroSection.replace(/<!--[\s\S]*?-->/g, '')
const heroButtons = [...heroNoComments.matchAll(/<a[^>]*>([^<]{3,60})<\/a>/g)].map((m) => dec(m[1]))

// ---------- how it works ----------
const steps = [...home.matchAll(/<li class="bg-bg pb-8[^"]*">([\s\S]*?)<\/li>/g)].map((m) => ({
  n: dec((m[1].match(/<span[^>]*>([\s\S]*?)<\/span>/) ?? [])[1] ?? ''),
  title: dec((m[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/) ?? [])[1] ?? ''),
  body: dec((m[1].match(/<p[^>]*>([\s\S]*?)<\/p>/) ?? [])[1] ?? ''),
}))
const stepsHeading = dec((home.match(/<h2 class="max-w-2xl[^"]*">([\s\S]*?)<\/h2>/) ?? [])[1] ?? '')

/**
 * Every question a visitor can see on a page, in the order it appears.
 *
 * TWO shapes count. An accordion is the obvious one. The other is an open
 * question heading with the answer in the paragraph underneath, which is how
 * the about, services, areas and referral pages present theirs: nothing to
 * click, the whole answer on screen. Counting only accordions reported those
 * thirteen questions as schema with no visible copy behind it, which is the
 * exact failure this file exists to catch, pointed at the wrong thing.
 */
function visibleQuestions(html, dec) {
  const out = []
  for (const m of html.matchAll(/<details[^>]*>([\s\S]*?)<\/details>/g)) {
    const q = dec((m[1].match(/<summary[^>]*>([\s\S]*?)<\/summary>/) ?? [])[1] ?? '').replace(/\s*\+$/, '').trim()
    const a = dec((m[1].match(/<p[^>]*>([\s\S]*?)<\/p>/) ?? [])[1] ?? '')
    if (q) out.push({ q, a, shape: 'accordion' })
  }
  // Open prose: <h2>Question?</h2> followed immediately by its answer.
  const re = /<h2\b[^>]*>/g
  let m
  while ((m = re.exec(html))) {
    const afterOpen = m.index + m[0].length
    const end = html.indexOf('</h2>', afterOpen)
    if (end === -1) continue
    const q = dec(html.slice(afterOpen, end)).trim()
    if (!q.includes('?')) continue
    const pm = html.slice(end + 5).match(/^\s*(?:<section[^>]*>|<div[^>]*>)*\s*<p[^>]*>([\s\S]*?)<\/p>/)
    if (!pm) continue
    const a = dec(pm[1])
    if (a.length >= 100) out.push({ q, a, shape: 'prose' })
  }
  return out
}

// ---------- FAQs, from the visible page ----------
const faqPages = []
const overclaims = []
let visibleQs = 0
let schemaQs = 0
let faqPageBlocks = 0
for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8')
  const items = visibleQuestions(html, dec)
  // structured-data cross-check on the same page
  let declaredHere = 0
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(m[1])
    if (data['@type'] === 'FAQPage') {
      faqPageBlocks++
      declaredHere += (data.mainEntity ?? []).length
      schemaQs += (data.mainEntity ?? []).length
    }
  }
  /*
   * The invariant is "schema never claims more than the page shows", NOT
   * "the two numbers are equal".
   *
   * Equality was right while every question lived in an accordion that fed
   * the markup. It is wrong now: the service and area pages carry question
   * headings in their prose that are deliberately NOT in the FAQPage block,
   * and marking those up would mean maintaining the same sentence twice.
   * Visible-without-schema is a missed opportunity; schema-without-visible is
   * what Google penalises, so that is the direction worth failing on.
   */
  if (declaredHere > items.length) {
    overclaims.push(`${routeOf(f)}: FAQPage declares ${declaredHere} question(s), ${items.length} visible`)
  }
  if (items.length) {
    // The heading that actually belongs to this accordion: the last <h2>
    // before the first <details>, not the first <h2> on the page.
    /*
     * The accordion's own heading is the last <h2> before the first <details>.
     * A page with no accordion has no such heading, and indexOf returns -1,
     * which slices the WHOLE page and hands back the last h2 on it: the four
     * prose pages were each labelled with their closing call-to-action band
     * ("Ready to get started in Houston?") as if that were the FAQ heading.
     */
    const at = html.indexOf('<details')
    const h2s = at === -1 ? [] : [...html.slice(0, at).matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => dec(m[1]))
    const h2 = h2s.length ? h2s[h2s.length - 1] : 'Questions answered in the page copy'
    faqPages.push({ route: routeOf(f), heading: h2, items })
    visibleQs += items.length
  }
}

// ---------- JSON-LD, verbatim ----------
const ldOn = (file, type) => {
  const html = fs.readFileSync(path.join(OUT, file), 'utf8')
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(m[1])
    if (data['@type'] === type) return JSON.stringify(data, null, 2)
  }
  return null
}
const localBusiness = ldOn('index.html', 'LocalBusiness')
const serviceLd = ldOn('services/junk-removal.html', 'Service')

// ---------- write ----------
const L = []
const w = (s = '') => L.push(s)
w('# COPY REVIEW: everything on the site, as the page actually renders it')
w('')
w('Generated by `scripts/proof/copy-review.mjs` from the built HTML in `out/`,')
w('not from `content/*.mdx` or `site.config.ts`. Source files go through MDX')
w('compilation, config interpolation and component composition before anyone')
w('sees them, so a review of the source is a review of something nobody reads.')
w('')
w('Every business claim below traces to `seo/FACTS.md`. The reasoning for each')
w('sentence that was changed or removed is in `seo/COPY-CLAIMS-REVIEW.md`.')
w('')
w(`Pages read: **${pages.length}**`)
w('')
w('---')
w('')
w('## 1. Hero, homepage')
w('')
w(`**Eyebrow:** ${heroEyebrow}`)
w('')
w(`**H1:** ${heroH1}`)
w('')
w(`**Subhead:** ${heroSub}`)
w('')
w(`**Trust line:** ${heroChips.join('  ·  ')}`)
w('')
w(`**Buttons:** ${heroButtons.join('  ·  ')}`)
w('')
w('---')
w('')
w(`## 2. How it works: "${stepsHeading}"`)
w('')
for (const s of steps) {
  w(`**${s.n}. ${s.title}**`)
  w('')
  w(s.body)
  w('')
}
w('---')
w('')
w('## 3. Questions and answers, by page')
w('')
w(`Visible questions: **${visibleQs}** across **${faqPages.length}** pages.`)
w('')
for (const p of faqPages) {
  w(`### \`${p.route}\`: ${p.heading} (${p.items.length})`)
  w('')
  for (const it of p.items) {
    w(`**Q. ${it.q}**`)
    w('')
    w(`A. ${it.a}`)
    w('')
  }
}
w('---')
w('')
w('## 4. LocalBusiness structured data, verbatim from `/`')
w('')
w('This is the machine-readable description of the business that Google and the')
w('AI answer engines read. Every value in it comes from `site.config.ts`.')
w('')
w('```json')
w(localBusiness ?? '(no LocalBusiness block found)')
w('```')
w('')
w('Worth noticing what is **absent** and why:')
w('')
w('- no `address` or `geo`: service-area business, no published street address')
w('- no `aggregateRating` or `review`: there are no reviews yet')
w('- no `foundingDate`: the business is under a year old and tenure is not displayed')
w('- no `priceRange`: no price appears anywhere on this site')
w('')
w('---')
w('')
w('## 5. One Service block, verbatim from `/services/junk-removal`')
w('')
w('Each of the 13 service pages emits one of these.')
w('')
w('```json')
w(serviceLd ?? '(no Service block found)')
w('```')
w('')
L.push('')
fs.writeFileSync(TARGET, L.join('\n'))

console.log('')
console.log(`wrote ${path.relative(ROOT, TARGET)}`)
console.log('')
console.log(`  pages read:                 ${pages.length}`)
console.log(`  pages with a visible FAQ:   ${faqPages.length}`)
console.log(`  visible questions:          ${visibleQs}`)
console.log(`  FAQPage JSON-LD blocks:     ${faqPageBlocks}`)
console.log(`  questions in that JSON-LD:  ${schemaQs}`)
console.log(`  hero chips: ${heroChips.length}   how-it-works steps: ${steps.length}`)
console.log(`  LocalBusiness block: ${localBusiness ? 'found' : 'MISSING'}   Service block: ${serviceLd ? 'found' : 'MISSING'}`)
console.log('')
if (overclaims.length) {
  console.error('OVERCLAIM: FAQPage markup promises questions the page does not show.')
  for (const o of overclaims) console.error(`  ${o}`)
  process.exit(1)
}
console.log(`  every FAQPage block is backed by visible copy on its own page: yes`)
console.log(`  (${visibleQs - schemaQs} visible questions are deliberately not marked up)`)
console.log('No page claims a question it does not show.')
