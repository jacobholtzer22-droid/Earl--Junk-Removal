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
/**
 * The nine places this site is allowed to name, and the counties they sit in.
 *
 * This list used to be empty, because the site named only Houston, and every
 * other place in Texas was banned outright. Eight of them are now legitimate
 * subjects with a page each, so they moved here. The counties come with them:
 * seo/AREA-SOURCES.md allows a county to be stated as geography and nothing
 * else, and three of these places straddle county lines, which is half the
 * reason the pages exist.
 *
 * APPROVED is checked against the built sitemap further down, so it cannot
 * quietly disagree with site.config.ts serviceAreas.
 */
const APPROVED_PLACES = [
  'Houston', 'Katy', 'Sugar Land', 'Pearland', 'Cypress', 'Spring', 'The Woodlands', 'Pasadena', 'Humble',
]
const APPROVED_COUNTIES = ['Harris', 'Fort Bend', 'Waller', 'Brazoria', 'Montgomery']

/**
 * Places that must never appear. Two kinds, and both matter.
 *
 * The first six are the template's sample business, which was in Springfield,
 * Illinois. A hit there means sample copy survived into a client's pages.
 *
 * The rest are real Houston-area cities that are NOT on the approved list. The
 * cap is eight area pages and no other city gets so much as a mention, because
 * a place named on the site is a place the phone will ring about, and Earl has
 * not agreed to drive to any of these.
 */
const FOREIGN_PLACES = [
  'Springfield', 'Chatham', 'Rochester', 'Sherman', 'Sangamon', 'Illinois',
  'Tomball', 'Conroe', 'Baytown', 'Galveston', 'Missouri City', 'Stafford',
  'Richmond', 'Rosenberg', 'Friendswood', 'League City', 'Clear Lake', 'Bellaire',
  'Willowbrook', 'Kingwood', 'Atascocita', 'Channelview', 'Deer Park', 'La Porte',
  'Alvin', 'Manvel', 'Fresno', 'Jersey Village', 'Spring Branch',
]

/**
 * Company-behaviour claims: a sentence that asserts how this business
 * habitually acts, how often, or what it typically sees.
 *
 * These are the hardest claims to notice, because they read like description
 * rather than assertion. "What comes out of Katy is renovation waste" sounds
 * like geography and is actually a statement about jobs this business has done
 * in a place it has no record of working in. All eight area pages carried one.
 *
 * Patterns, not terms, because the claim is a shape of sentence rather than a
 * word. Each of the eight sentences removed on 2026-10-07 is matched by at
 * least one of these; the spring one is why the last two exist, since it was
 * the only one the first draft of this list missed.
 */
const BEHAVIOUR_CLAIMS = [
  /\bwe (always|never|routinely|typically|usually|often)\b/i,
  /\bis (routine|standard|normal) (work|practice) here\b/i,
  /\b(most|many|a lot) of (our|the) (jobs|calls|work|customers)\b/i,
  /\bwhat comes out of\b/i,
  /\bthe usual .{0,20}\bcall\b/i,
  /\bcomes? out of \w+ more than\b/i,
  /\bthe mix here\b/i,
  /\bskews towards?\b/i,
  /\ba fair share of\b/i,
  /\bwe (have|had) (done|cleared|hauled)\b/i,
  /\bour (customers|clients|crews?|trucks?)\b/i,
  /\b(every|each) (job|week|day) we\b/i,
  /\btreated that way\b/i,
  /\bthe calls? (that )?comes? in\b/i,
  /\bis often (about|a)\b/i,
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

// 1b. Company-behaviour claims in rendered page text.
{
  const hits = []
  for (const re of BEHAVIOUR_CLAIMS) {
    for (const f of pages) {
      const m = visibleText(fs.readFileSync(f, 'utf8')).match(new RegExp(re.source, 'gi'))
      if (m) hits.push(`${routeOf(f)}: ${m[0]}`)
    }
  }
  row(`company-behaviour claims (${BEHAVIOUR_CLAIMS.length} patterns)`, hits.length, hits.slice(0, 5).join(', '))
}

// 2. Place names that are not on the approved list.
{
  const hits = []
  for (const term of FOREIGN_PLACES) {
    const re = new RegExp(`\\b${term}\\b`, 'g')
    for (const f of pages) {
      const n = (visibleText(fs.readFileSync(f, 'utf8')).match(re) ?? []).length
      if (n) hits.push(`${term} on ${routeOf(f)}`)
    }
  }
  row(`unapproved place names (${FOREIGN_PLACES.length} checked, ${APPROVED_PLACES.length} allowed)`, hits.length, hits.slice(0, 5).join(', '))

  // 2b. The approved list must match the pages that were actually built, or
  // this check is policing a list nobody maintains.
  const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const sitemap = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8')
  const builtAreas = [...sitemap.matchAll(/<loc>[^<]*\/areas\/([^<\/]+)<\/loc>/g)].map((m) => m[1]).sort()
  const expected = APPROVED_PLACES.filter((p) => p !== 'Houston').map(slugify).sort()
  const drift = [
    ...builtAreas.filter((b) => !expected.includes(b)).map((b) => `built but not approved: ${b}`),
    ...expected.filter((e) => !builtAreas.includes(e)).map((e) => `approved but not built: ${e}`),
  ]
  row(`approved places match built area pages (${builtAreas.length} pages)`, drift.length, drift.join(', '))
  const countyMiss = APPROVED_COUNTIES.filter((c) => !pages.some((f) => visibleText(fs.readFileSync(f, 'utf8')).includes(c)))
  if (countyMiss.length) row('approved counties never rendered (dead entries)', countyMiss.length, countyMiss.join(', '))
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
