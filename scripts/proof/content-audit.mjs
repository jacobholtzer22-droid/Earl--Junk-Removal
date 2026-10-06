/**
 * CONTENT AUDIT. Run against ./out after a build:
 *   node scripts/proof/content-audit.mjs
 *
 * Checks the things the verify gate does not: claims that are not ours to make,
 * em dashes, leftover template identity, internal data, and any place name
 * other than the one city we can actually stand behind.
 *
 * Banned terms are matched against the RENDERED TEXT of every built page, not
 * the source, because the rendered text is what a customer and a crawler
 * actually read. Repo docs (FACTS.md, CLIENT-TODO.md) legitimately discuss
 * insurance and licensing in order to record that we do NOT claim them, so
 * scanning source files for those words would be noise.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'out')

/** Rule 1: no business claim that is not in seo/FACTS.md. */
const BANNED_CLAIMS = [
  'licensed', 'insured', 'bonded', 'background-checked', 'background checked',
  'family owned', 'family-owned', 'locally owned', 'locally-owned',
  'years of experience', 'years in business', 'jobs completed', 'jobs done',
  'star rating', '5-star', 'five star', 'reviews', 'testimonial',
  'we guarantee', 'guaranteed', 'satisfaction guarantee', 'money back',
  'within the hour', 'in 60 minutes', 'arrive within',
  'of landfill', 'out of landfills', '% recycled', 'percent recycled',
  'goodwill', 'habitat for humanity', 'salvation army',
  'our crew of', 'team of', 'top-rated', 'top rated', 'number one', 'the best in',
  'army', 'navy', 'marine corps', 'air force', 'coast guard',
]

/** Place names that must not appear: template leftovers and Houston suburbs. */
const FOREIGN_PLACES = [
  'Springfield', 'Chatham', 'Rochester', 'Sherman', 'Sangamon', 'Illinois',
  'Katy', 'Cypress', 'Sugar Land', 'Woodlands', 'Pasadena', 'Pearland', 'Humble',
  'Tomball', 'Conroe', 'Baytown', 'Galveston', 'Missouri City', 'Stafford',
  'Richmond', 'Rosenberg', 'Friendswood', 'League City', 'Clear Lake', 'Bellaire',
  'Willowbrook', 'Harris County', 'Fort Bend', 'Montgomery County',
]

/** Template identity and placeholder junk, scanned across the whole source. */
const SOURCE_TOKENS = [
  'Sample Lawn Care', 'sample-lawn-care', 'sample-', 'REPLACE_ME', 'EXAMPLE_',
  'lorem', 'Lorem', 'TKTK', 'your business', 'Insert ',
  'average job', 'avg job', 'ad budget', 'Add-On Revenue', 'Target Customer Segment',
]

function walk(dir, ext, skip = []) {
  if (!fs.existsSync(dir)) return []
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p, ext, skip))
    else if (e.name.endsWith(ext)) out.push(p)
  }
  return out.sort()
}

/** Visible text of a built page: scripts, styles, comments and tags removed. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;| /g, ' ')
    .replace(/\s+/g, ' ')
}

const pages = walk(OUT, '.html').filter((f) => path.basename(f) !== '404.html')
const routeOf = (f) => '/' + path.relative(OUT, f).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')

let failures = 0
const row = (label, count, detail = '') => {
  const ok = count === 0
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(count).padStart(4)}  ${label}${detail ? '  ->  ' + detail : ''}`)
}

console.log(`\nCONTENT AUDIT across ${pages.length} built pages. Every count below should be 0.\n`)
console.log('res   count  check')
console.log('----  -----  -----')

// 1. Banned claims in rendered page text.
for (const term of BANNED_CLAIMS) {
  const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  const hits = []
  for (const f of pages) {
    const t = visibleText(fs.readFileSync(f, 'utf8'))
    const n = (t.match(re) ?? []).length
    if (n) hits.push(`${routeOf(f)} x${n}`)
  }
  if (hits.length) row(`banned claim "${term}"`, hits.length, hits.slice(0, 4).join(', '))
}
const claimHits = BANNED_CLAIMS.filter((term) => {
  const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  return pages.some((f) => re.test(visibleText(fs.readFileSync(f, 'utf8'))))
})
if (claimHits.length === 0) row(`all ${BANNED_CLAIMS.length} banned claim terms, in rendered page text`, 0)

// 2. Place names other than Houston.
{
  const hits = []
  for (const term of FOREIGN_PLACES) {
    const re = new RegExp(`\\b${term}\\b`, 'g')
    for (const f of pages) {
      const n = (visibleText(fs.readFileSync(f, 'utf8')).match(re) ?? []).length
      if (n) hits.push(`${term} on ${routeOf(f)}`)
    }
  }
  row(`place names other than Houston (${FOREIGN_PLACES.length} checked)`, hits.length, hits.slice(0, 5).join(', '))
}

// 3. Em dashes, anywhere in source or output.
{
  const files = [
    ...walk(path.join(ROOT, 'app'), '.tsx'), ...walk(path.join(ROOT, 'app'), '.ts'),
    ...walk(path.join(ROOT, 'components'), '.tsx'), ...walk(path.join(ROOT, 'lib'), '.ts'),
    ...walk(path.join(ROOT, 'content'), '.mdx'), ...walk(path.join(ROOT, 'seo'), '.md'),
    ...walk(path.join(ROOT, 'scripts'), '.mjs'), ...walk(path.join(ROOT, 'scripts'), '.ts'),
    ...walk(path.join(ROOT, 'scripts'), '.tsx'),
    path.join(ROOT, 'site.config.ts'), path.join(ROOT, 'theme.ts'),
    path.join(ROOT, 'CLIENT-TODO.md'), path.join(ROOT, 'README.md'),
    ...pages,
  ].filter((f) => fs.existsSync(f))
  const hits = []
  for (const f of files) {
    // Built from char codes so this file contains no dash characters of its own.
    const DASHES = new RegExp('[' + String.fromCharCode(0x2014, 0x2013) + ']', 'g')
    const n = (fs.readFileSync(f, 'utf8').match(DASHES) ?? []).length
    if (n) hits.push(`${path.relative(ROOT, f)} x${n}`)
  }
  row(`em and en dashes in source, docs and output (${files.length} files)`, hits.length, hits.slice(0, 5).join(', '))
}

// 4. Template identity, placeholders and internal data, across the source.
{
  const files = [
    ...walk(path.join(ROOT, 'app'), '.tsx'), ...walk(path.join(ROOT, 'app'), '.ts'),
    ...walk(path.join(ROOT, 'components'), '.tsx'), ...walk(path.join(ROOT, 'lib'), '.ts'),
    ...walk(path.join(ROOT, 'content'), '.mdx'), ...walk(path.join(ROOT, 'seo'), '.md'),
    path.join(ROOT, 'site.config.ts'), path.join(ROOT, 'theme.ts'), path.join(ROOT, 'CLIENT-TODO.md'),
    ...pages,
  ].filter((f) => fs.existsSync(f))
  for (const token of SOURCE_TOKENS) {
    const hits = []
    for (const f of files) {
      const n = (fs.readFileSync(f, 'utf8').split(token).length - 1)
      if (n) hits.push(`${path.relative(ROOT, f)} x${n}`)
    }
    if (hits.length) row(`token "${token}"`, hits.length, hits.slice(0, 4).join(', '))
  }
  const any = SOURCE_TOKENS.some((t) => files.some((f) => fs.readFileSync(f, 'utf8').includes(t)))
  if (!any) row(`all ${SOURCE_TOKENS.length} template / placeholder / internal-data tokens, across source and output`, 0)
}

// 5. Stock photography only in allowed placements: never in a gallery.
{
  const bad = []
  for (const f of pages) {
    const html = fs.readFileSync(f, 'utf8')
    const t = visibleText(html)
    for (const phrase of ['Recent Work', 'Our Work', 'Before and After', 'Before &', 'Gallery', 'Our Gallery']) {
      if (t.includes(phrase)) bad.push(`${routeOf(f)}: "${phrase}"`)
    }
    for (const m of html.matchAll(/<img[^>]*alt="([^"]*)"/g)) {
      if (/\b(our|we|us)\b/i.test(m[1]) && !/logo/i.test(m[1])) bad.push(`${routeOf(f)}: alt claims ownership: "${m[1]}"`)
    }
  }
  row('gallery / "our work" sections, or alt text implying these are our jobs', bad.length, bad.slice(0, 4).join(', '))
}

console.log('')
console.log(failures ? `${failures} check(s) FAILED.` : 'All content checks clean.')
process.exit(failures ? 1 : 0)
