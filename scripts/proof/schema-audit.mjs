/**
 * JSON-LD AUDIT. Run against ./out after a build:
 *   node scripts/proof/schema-audit.mjs
 *
 * Three questions, because structured data is a set of machine-readable claims
 * about a business and a false one is as bad as a false sentence on the page:
 *
 *   1. Does every block parse, and does it carry @context and @type?
 *   2. Is every @type a REAL schema.org type? (Invented subtypes like
 *      "JunkRemovalBusiness" or "LandscapingBusiness" do not exist. They are
 *      silently ignored by consumers, so nothing warns you.)
 *   3. Does every string value trace back to a fact we actually hold?
 *
 * Question 3 is the one that matters here and it is checked by exhaustion: every
 * leaf string in every block is collected and matched against values derived
 * from site.config.ts. Anything unaccounted for is printed and fails the run, so
 * a claim cannot reach the schema without a human seeing it.
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const OUT = path.join(process.cwd(), 'out')

/** Real schema.org types this site is allowed to emit. */
const REAL_TYPES = new Set([
  'LocalBusiness', 'Organization', 'WebSite', 'WebPage', 'Service', 'Offer', 'OfferCatalog',
  'FAQPage', 'Question', 'Answer', 'BreadcrumbList', 'ListItem', 'PostalAddress',
  'GeoCoordinates', 'OpeningHoursSpecification', 'AggregateRating', 'Review', 'Rating',
  'Person', 'City', 'AdministrativeArea', 'Place', 'ContactPoint', 'ImageObject',
])

/**
 * Claims that must never appear in structured data for this client, because no
 * fact in seo/FACTS.md supports them.
 */
const BANNED = [
  'licensed', 'insured', 'bonded', 'background-checked', 'family owned', 'family-owned',
  'locally owned', 'locally-owned', 'years of experience', 'award', 'top-rated', 'top rated',
  'best in', '#1', 'number one', 'guarantee', 'guaranteed', 'certified', 'accredited',
  'founded in', 'since 19', 'since 20', 'aggregateRating', 'ratingValue', 'reviewCount',
]

// Pull the real values out of the config, through tsx so the file is parsed and
// not regex-scraped.
const cfgJson = spawnSync('npx', ['tsx', '-e', `
  import { config } from './lib/config'
  process.stdout.write(JSON.stringify(config))
`], { cwd: process.cwd(), encoding: 'utf8' })
if (cfgJson.status !== 0) {
  console.error('could not load site config:', cfgJson.stderr)
  process.exit(1)
}
const cfg = JSON.parse(cfgJson.stdout)

/** Every string that is legitimately ours to publish. */
const allowed = new Set()
const allow = (v) => { if (typeof v === 'string' && v.trim()) allowed.add(v.trim()) }

allow(cfg.displayName); allow(cfg.legalName); allow(cfg.tagline); allow(cfg.phone)
allow(cfg.email); allow(cfg.domain); allow(cfg.primaryCity); allow(cfg.primaryState)
allow(cfg.schemaType); allow('en-US'); allow('US')
// The operating company, published as schema.org alternateName.
allow(cfg.alternateName)
for (const a of cfg.serviceAreas) {
  allow(a.name); allow(a.slug); allow(a.county); allow(a.titleOverride)
  // Per-place Q&A, which is FAQPage markup on that place's page.
  for (const f of a.faqs ?? []) { allow(f.q); allow(f.a) }
}
for (const s of cfg.services) {
  allow(s.name); allow(s.shortDescription); allow(s.slug)
  for (const f of s.faqs) { allow(f.q); allow(f.a) }
}
for (const f of cfg.faqs) { allow(f.q); allow(f.a) }
// Q&A for the five standalone pages. Same FAQPage markup, different home in
// the config; see lib/config-schema.ts pageFaqs.
for (const list of Object.values(cfg.pageFaqs ?? {})) {
  for (const f of list) { allow(f.q); allow(f.a) }
}
for (const h of cfg.hours ?? []) { allow(h.day); allow(h.open); allow(h.close) }
for (const u of Object.values(cfg.profiles ?? {})) allow(u)
// Breadcrumb labels and the page titles they come from.
for (const label of ['Home', 'Services', 'Service Areas', 'About', 'Contact', 'Privacy Policy', 'Terms', 'Referral Program']) allow(label)
allow(`${cfg.displayName} services`)

const isUrl = (s) => s.startsWith(cfg.domain) || s === 'https://schema.org' || s.startsWith('https://www.facebook.com/') || s.startsWith('https://www.instagram.com/')
const isTypeOrKey = (s) => REAL_TYPES.has(s)

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name.endsWith('.html')) out.push(p)
  }
  return out.sort()
}

function leafStrings(node, acc) {
  if (typeof node === 'string') { acc.push(node); return }
  if (Array.isArray(node)) { for (const n of node) leafStrings(n, acc); return }
  if (node && typeof node === 'object') { for (const v of Object.values(node)) leafStrings(v, acc) }
}
function types(node, acc) {
  if (Array.isArray(node)) { for (const n of node) types(n, acc); return }
  if (node && typeof node === 'object') {
    const t = node['@type']
    if (typeof t === 'string') acc.push(t)
    for (const [k, v] of Object.entries(node)) if (k !== '@type') types(v, acc)
  }
}

const files = walk(OUT).filter((f) => path.basename(f) !== '404.html')
let blocks = 0
const problems = []
const typeCounts = new Map()
const unaccounted = new Map()

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8')
  const route = '/' + path.relative(OUT, file).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    blocks++
    let data
    try { data = JSON.parse(m[1]) } catch (e) { problems.push(`${route}: JSON-LD does not parse (${e.message})`); continue }
    if (!data['@context']) problems.push(`${route}: missing @context`)
    if (!data['@type']) problems.push(`${route}: missing @type`)

    const ts = []; types(data, ts)
    for (const t of ts) {
      typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1)
      if (!REAL_TYPES.has(t)) problems.push(`${route}: "${t}" is not a real schema.org type`)
    }

    const raw = JSON.stringify(data).toLowerCase()
    for (const b of BANNED) if (raw.includes(b.toLowerCase())) problems.push(`${route}: schema contains the unsupported claim "${b}"`)

    const leaves = []; leafStrings(data, leaves)
    for (const s of leaves) {
      const v = s.trim()
      if (!v) continue
      if (allowed.has(v) || isUrl(v) || isTypeOrKey(v)) continue
      if (/^\d{2}:\d{2}$/.test(v)) continue
      if (!unaccounted.has(v)) unaccounted.set(v, route)
    }
  }
}

console.log(`\nJSON-LD AUDIT across ${files.length} built pages\n`)
console.log(`blocks parsed: ${blocks}`)
console.log(`types emitted: ${[...typeCounts.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} x${n}`).join(', ')}`)
console.log(`all types real schema.org: ${[...typeCounts.keys()].every((t) => REAL_TYPES.has(t)) ? 'yes' : 'NO'}`)

console.log(`\nunsupported claims (licensed / insured / ratings / founding dates / guarantees): ${
  problems.some((p) => p.includes('unsupported claim')) ? 'FOUND' : 'none'
}`)

if (unaccounted.size) {
  console.log(`\nSTRINGS NOT TRACEABLE TO site.config.ts (${unaccounted.size}):`)
  for (const [v, route] of unaccounted) console.log(`  ${route}: ${JSON.stringify(v.slice(0, 110))}`)
  problems.push(`${unaccounted.size} schema string(s) not traceable to config`)
} else {
  console.log(`\nevery string value in every block traces back to site.config.ts: yes`)
}

console.log('')
if (problems.length) {
  for (const p of problems) console.error(`FAIL  ${p}`)
  process.exit(1)
}
console.log('PASS. Every block parses, every type is real, every claim is sourced.')
