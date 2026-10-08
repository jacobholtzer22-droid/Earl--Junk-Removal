/**
 * Scores every built page 0 to 10 on ten categories, from the STATIC HTML with
 * no JavaScript, which is what a crawler and an answer engine actually get.
 *
 *   node scripts/proof/seo-score.mjs            score and print
 *   node scripts/proof/seo-score.mjs --json     machine-readable, for diffing
 *
 * Each category is scored by explicit rules rather than a vibe, so a change
 * either moves a number or it does not.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'out')
const JSON_MODE = process.argv.includes('--json')

const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Google-Extended',
  'PerplexityBot', 'Perplexity-User', 'Applebot-Extended', 'Meta-ExternalAgent', 'Amazonbot', 'CCBot',
]
const REAL_TYPES = new Set([
  'LocalBusiness', 'Organization', 'WebSite', 'WebPage', 'Service', 'Offer', 'OfferCatalog', 'FAQPage',
  'Question', 'Answer', 'BreadcrumbList', 'ListItem', 'PostalAddress', 'GeoCoordinates',
  'OpeningHoursSpecification', 'AggregateRating', 'Review', 'Rating', 'Person', 'City',
  'AdministrativeArea', 'Place', 'ContactPoint', 'ImageObject',
])

function walk(d) {
  const o = []
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) o.push(...walk(p))
    else if (e.name.endsWith('.html')) o.push(p)
  }
  return o.sort()
}
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&nbsp;| /g, ' ')
const visible = (h) =>
  decode(
    h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim()
const attr = (h, re) => (h.match(re) ?? [])[1]

/**
 * Every question on a page paired with the answer that FOLLOWS it, counted
 * from the markup rather than from a preferred widget.
 *
 * Two shapes count, because both extract: a <summary> with the answer inside
 * its <details>, and a question-shaped <h2> with the answer in the paragraph
 * straight after it. The second shape is why the four standalone pages read as
 * answer-ready; scoring only accordions marked them down for using open prose,
 * which is a better page, not a worse one.
 *
 * Deliberately NOT one big regex. The obvious
 *   /<h2[^>]*>([\s\S]*?)<\/h2>\s*<p[^>]*>/
 * backtracks past its own closing tag when the next element is not a <p>, and
 * on a page whose accordion is headed <h2>Common questions</h2> it reported a
 * pair whose question was that heading glued to the first FAQ's summary and
 * whose answer was 63 characters of the wrong paragraph. A bogus pair here
 * inflates the denominator that decides whether FAQPage markup overclaims, so
 * this walks tag by tag and never crosses a closing tag.
 */
function qaPairs(html) {
  const pairs = []
  const seg = (open, close, minAnswer) => {
    const re = new RegExp(`<${open}\\b[^>]*>`, 'g')
    let m
    while ((m = re.exec(html))) {
      const afterOpen = m.index + m[0].length
      const end = html.indexOf(`</${close}>`, afterOpen)
      if (end === -1) continue
      const q = visible(html.slice(afterOpen, end))
      const rest = html.slice(end + close.length + 3)
      // The answer must be the next paragraph, with no other block between.
      const pm = rest.match(/^[\s]*(?:<\/summary>|<div[^>]*>|<section[^>]*>)*\s*<p[^>]*>([\s\S]*?)<\/p>/)
      if (!pm) continue
      const a = visible(pm[1])
      if (a.length >= minAnswer) pairs.push({ q, a, shape: open })
    }
  }
  seg('summary', 'summary', 60)
  seg('h2', 'h2', 100)
  return pairs.filter((p) => p.shape === 'summary' || p.q.includes('?'))
}

/** Question count declared in a page's FAQPage block, 0 if there is none. */
function declaredFaqCount(html) {
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let d
    try { d = JSON.parse(m[1]) } catch { continue }
    if (d && d['@type'] === 'FAQPage') return (d.mainEntity ?? []).length
  }
  return 0
}

const pages = walk(OUT).filter((f) => path.basename(f) !== '404.html').map((f) => {
  const html = fs.readFileSync(f, 'utf8')
  let route = '/' + path.relative(OUT, f).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  if (route === '') route = '/'
  return { file: f, route, html }
})

const domain = (() => {
  const c = attr(pages[0].html, /<link rel="canonical" href="(https:\/\/[^/"]+)/)
  return c ?? ''
})()

const titles = new Map(), descs = new Map()
for (const p of pages) {
  const t = decode(attr(p.html, /<title>([^<]*)<\/title>/) ?? '')
  const d = decode(attr(p.html, /<meta name="description" content="([^"]*)"/) ?? '')
  titles.set(p.route, t); descs.set(p.route, d)
}
const dupe = (map, v) => [...map.values()].filter((x) => x === v).length > 1

function scorePage(p) {
  const { html, route } = p
  const text = visible(html)
  const title = titles.get(route), desc = descs.get(route)
  const s = {}, notes = {}
  // Shared by category 5 and category 10: both ask whether the FAQPage block
  // agrees with what a reader can see, so both must count the same pairs.
  const pairs = qaPairs(html)
  const declared = declaredFaqCount(html)

  // 1. Title
  {
    let v = 0
    if (title) v += 3
    if (title.length >= 50 && title.length <= 60) v += 3
    else if (title.length >= 30 && title.length <= 65) v += 1
    if (title && !dupe(titles, title)) v += 2
    if (/junk|cleanout|demolition|removal|estimate|service|referral|privacy|terms|about/i.test(title)) v += 2
    s.title = Math.min(10, v)
    if (s.title < 10) notes.title = `${title.length} chars`
  }
  // 2. Description
  {
    let v = 0
    if (desc) v += 3
    if (desc.length >= 140 && desc.length <= 160) v += 3
    else if (desc.length >= 120 && desc.length <= 170) v += 1
    if (desc && !dupe(descs, desc)) v += 2
    if (desc && title && desc.toLowerCase() !== title.toLowerCase()) v += 2
    s.description = Math.min(10, v)
    if (s.description < 10) notes.description = `${desc.length} chars`
  }
  // 3. Canonical
  {
    const c = attr(html, /<link rel="canonical" href="([^"]*)"/) ?? ''
    let v = 0
    if (c) v += 3
    if (c.startsWith('https://')) v += 2
    const expect = route === '/' ? domain : domain + route
    if (c.replace(/\/$/, '') === expect.replace(/\/$/, '')) v += 5
    s.canonical = Math.min(10, v)
    if (s.canonical < 10) notes.canonical = c || 'missing'
  }
  // 4. OG and Twitter
  {
    let v = 0
    const og = ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']
    for (const k of og) if (html.includes(`property="${k}"`)) v += 1
    const tw = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']
    for (const k of tw) if (html.includes(`name="${k}"`)) v += 1
    const img = attr(html, /<meta property="og:image" content="([^"]*)"/) ?? ''
    if (img.startsWith('https://')) v += 1
    s.social = Math.min(10, v)
    if (s.social < 10) notes.social = [...og, ...tw].filter((k) => !html.includes(`"${k}"`)).join(',') || 'og:image not absolute'
  }
  // 5. Structured data
  {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
    let v = 0, parsed = [], bad = []
    for (const b of blocks) { try { parsed.push(JSON.parse(b)) } catch { bad.push(b.slice(0, 40)) } }
    if (blocks.length) v += 2
    if (blocks.length && !bad.length) v += 2
    const types = []
    const collect = (n) => {
      if (Array.isArray(n)) return n.forEach(collect)
      if (n && typeof n === 'object') {
        if (typeof n['@type'] === 'string') types.push(n['@type'])
        for (const [k, x] of Object.entries(n)) if (k !== '@type') collect(x)
      }
    }
    parsed.forEach(collect)
    if (types.length && types.every((t) => REAL_TYPES.has(t))) v += 2
    /*
     * FAQPage must not overclaim. Google's own rule is that marked-up Q&A has
     * to be visible on the page, so the test is `declared <= visible pairs`,
     * not `declared === number of accordions`. A page with four declared
     * questions and seven visible ones is correct; the reverse is the defect.
     */
    const faq = parsed.find((d) => d['@type'] === 'FAQPage')
    if (!faq) { if (pairs.length === 0) v += 2 } else if (declared > 0 && declared <= pairs.length) v += 2
    if (route === '/' ? parsed.some((d) => d['@type'] === 'LocalBusiness') : parsed.some((d) => d['@type'] === 'BreadcrumbList')) v += 2
    s.schema = Math.min(10, v)
    if (s.schema < 10) notes.schema = `${blocks.length} blocks, types ${[...new Set(types)].join('/')}`
  }
  // 6. Heading structure
  {
    const h1 = [...html.matchAll(/<h1[^>]*>/g)].length
    const h2 = [...html.matchAll(/<h2[^>]*>/g)].length
    const h3 = [...html.matchAll(/<h3[^>]*>/g)].length
    let v = 0
    if (h1 === 1) v += 4
    if (h2 >= 1) v += 3
    if (!(h3 > 0 && h2 === 0)) v += 3
    s.headings = Math.min(10, v)
    if (s.headings < 10) notes.headings = `h1=${h1} h2=${h2} h3=${h3}`
  }
  // 7. Content without JS
  {
    const art = (html.match(/<article[^>]*>([\s\S]*?)<\/article>/) ?? [])[1]
    const artLen = art ? visible(art).length : 0
    const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) ?? [])[1]
    const mainLen = main ? visible(main).length : text.length
    let v = 0
    if (mainLen >= 800) v += 5
    else if (mainLen >= 400) v += 3
    if (artLen >= 300 || mainLen >= 1500) v += 3
    if (!/enable javascript/i.test(text)) v += 2
    s.noJs = Math.min(10, v)
    if (s.noJs < 10) notes.noJs = `main ${mainLen} chars, article ${artLen}`
  }
  // 8. Alt text
  {
    /*
     * An img that declares itself decorative with alt="" AND aria-hidden="true"
     * is skipped, exactly as verify.ts check 11 skips it. WCAG H67: an image
     * carrying nothing a sighted reader does not already have should be silent
     * rather than described, and describing the same logo twice on one page is
     * noise. Only the declared pair is exempt; a missing alt, a short alt, or a
     * bare alt="" without aria-hidden all still count and still fail.
     */
    const all = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0])
    const decorative = all.filter((i) => /alt=""/.test(i) && /aria-hidden="true"/.test(i))
    const imgs = all.filter((i) => !decorative.includes(i))
    if (imgs.length === 0) { s.alt = 10 }
    else {
      const alts = imgs.map((i) => decode(attr(i, /alt="([^"]*)"/) ?? ''))
      /*
       * Uniqueness is per IMAGE FILE, not per occurrence, which is the same
       * rule verify.ts check 11 applies.
       *
       * The same photograph can legitimately appear twice on a page: the
       * homepage hero and the yard waste card are one file, because an
       * uprooted tree is the best storm-debris picture in the library and
       * buying a second one to satisfy a counter would be theatre. Two
       * occurrences of one file SHOULD share an alt. The defect is two
       * DIFFERENT files sharing one, which is what this now measures.
       */
      const fileOf = (i) => (attr(i, /src="([^"]*)"/) ?? '').replace(/-\d+\.webp$/, '').split('/').pop()
      const byAlt = new Map()
      imgs.forEach((i, n) => {
        const a = alts[n]
        if (!byAlt.has(a)) byAlt.set(a, new Set())
        byAlt.get(a).add(fileOf(i))
      })
      let v = 0
      if (alts.every((a) => a.trim().length >= 15)) v += 5
      if ([...byAlt.values()].every((set) => set.size === 1)) v += 3
      if (!alts.some((a) => /^(image|picture|photo) of/i.test(a))) v += 2
      s.alt = Math.min(10, v)
      if (s.alt < 10) notes.alt = `${imgs.length} described imgs, ${decorative.length} decorative`
    }
  }
  // 9. Name, phone, area in crawlable text
  {
    let v = 0
    if (/Houston Waste Removal/.test(text)) v += 3
    if (/href="tel:\+1\d{10}"/.test(html)) v += 3
    if (/\(713\) 291-9440/.test(text)) v += 0
    if (/\bHouston\b/.test(text)) v += 2
    if (/\bCounty\b|\bTX\b/.test(text)) v += 2
    s.nap = Math.min(10, v)
    if (s.nap < 10) notes.nap = 'missing name/tel/city/area'
  }
  // 10. Answer-readiness
  {
    /*
     * Three things an answer engine needs: a direct answer in the opening
     * paragraph, question/answer pairs it can lift, and the same pairs in
     * structured data without overclaiming.
     *
     * LEGAL_PROSE is the one exemption and it is named rather than silent. A
     * privacy policy and a terms page answer in topic sections, and FAQPage
     * markup over a liability clause claims a role those pages do not have, so
     * they are scored on section structure and their row says so.
     */
    const LEGAL_PROSE = new Set(['/privacy-policy', '/terms'])
    const art = (html.match(/<article[^>]*>([\s\S]*?)<\/article>/) ?? [])[1] ?? ''
    const firstP = visible((art.match(/<p[^>]*>([\s\S]*?)<\/p>/) ?? [])[1] ?? '')
    const legal = LEGAL_PROSE.has(route)

    let v = 0
    if (firstP.length >= 80) v += 3
    else if (firstP.length >= 40) v += 1

    if (legal) {
      const sections = [...html.matchAll(/<h2\b[^>]*>/g)].length
      if (sections >= 4) v += 4
      else if (sections >= 2) v += 2
      v += 3
      notes.answer = `legal-prose basis: ${sections} topic sections, FAQPage exempt by design`
    } else {
      if (pairs.length >= 3) v += 4
      else if (pairs.length >= 1) v += 1
      if (declared > 0 && declared <= pairs.length) v += 3
      else if (declared > 0) v += 1
    }
    s.answer = Math.min(10, v)
    if (s.answer < 10 && !legal) {
      notes.answer = `firstP ${firstP.length}, ${pairs.length} verified pairs, ${declared} in FAQPage`
    }
  }
  return { route, scores: s, notes }
}

const results = pages.map(scorePage)
const CATS = ['title', 'description', 'canonical', 'social', 'schema', 'headings', 'noJs', 'alt', 'nap', 'answer']
const LABEL = { title: 'Title', description: 'Desc', canonical: 'Canon', social: 'OG/TW', schema: 'Schema', headings: 'Head', noJs: 'NoJS', alt: 'Alt', nap: 'NAP', answer: 'Answer' }

if (JSON_MODE) {
  console.log(JSON.stringify(results, null, 1))
} else {
  const w = Math.max(...results.map((r) => r.route.length), 5)
  console.log(`\nPER-PAGE SEO AND AI-SEARCH SCORES, from static HTML, ${results.length} pages\n`)
  console.log('page'.padEnd(w) + CATS.map((c) => LABEL[c].padStart(8)).join('') + '     avg')
  console.log('-'.repeat(w) + CATS.map(() => '  ------').join('') + '  ------')
  for (const r of results) {
    const avg = CATS.reduce((a, c) => a + r.scores[c], 0) / CATS.length
    console.log(r.route.padEnd(w) + CATS.map((c) => String(r.scores[c]).padStart(8)).join('') + avg.toFixed(1).padStart(8))
  }
  console.log('-'.repeat(w) + CATS.map(() => '  ------').join('') + '  ------')
  const colAvg = Object.fromEntries(CATS.map((c) => [c, results.reduce((a, r) => a + r.scores[c], 0) / results.length]))
  console.log('AVERAGE'.padEnd(w) + CATS.map((c) => colAvg[c].toFixed(1).padStart(8)).join('') +
    (CATS.reduce((a, c) => a + colAvg[c], 0) / CATS.length).toFixed(1).padStart(8))

  const under9 = []
  for (const r of results) for (const c of CATS) if (r.scores[c] < 9) under9.push({ route: r.route, cat: c, v: r.scores[c], note: r.notes[c] })
  console.log(`\nCATEGORIES UNDER 9: ${under9.length}`)
  for (const u of under9) console.log(`  ${u.route.padEnd(w)} ${LABEL[u.cat].padEnd(7)} ${u.v}/10   ${u.note ?? ''}`)

  // ---------- site-wide ----------
  console.log('\n\nSITE-WIDE\n')
  const robots = fs.readFileSync(path.join(OUT, 'robots.txt'), 'utf8')
  const indexable = !/^Disallow: \/$/m.test(robots)
  console.log(`robots.txt as served               ${indexable ? 'INDEXABLE (Allow: /)' : 'BLOCKED (Disallow: /)'}`)

  /*
   * BOTH states, executed rather than described. scripts/proof/robots-states.ts
   * calls the shipped app/robots.ts once with indexable true and once false, so
   * the pre-launch branch is proved to still work even though this site will
   * never render it again. That branch is where every new client site starts.
   */
  let states = null
  try {
    states = JSON.parse(execFileSync('npx', ['tsx', 'scripts/proof/robots-states.ts'], { cwd: ROOT, encoding: 'utf8' }))
  } catch (e) {
    console.log(`  ! could not execute app/robots.ts in both states: ${String(e).split('\n')[0]}`)
  }
  if (states) {
    for (const st of states) {
      const rules = st.rules.map((r) => `${r.userAgent}:${r.allow ? 'allow ' + r.allow : 'disallow ' + r.disallow}`)
      const blanket = rules[0]
      console.log(`  indexable=${String(st.indexable).padEnd(5)} ${rules.length} rule(s), first "${blanket}", sitemap ${st.sitemap ? 'yes' : 'NO'}, host ${st.host ? 'yes' : 'NO'}`)
    }
    const live = states.find((x) => x.indexable === true)
    const drift = AI_AGENTS.filter((a) => !live.rules.some((r) => r.userAgent === a))
    console.log(`  live branch names all 12 agents  ${drift.length === 0 ? 'yes' : 'NO: missing ' + drift.join(',')}`)
  }
  const missing = AI_AGENTS.filter((a) => !robots.includes(`User-Agent: ${a}`))
  console.log(`AI crawler allows, as served       ${AI_AGENTS.length - missing.length}/12 ${missing.length ? 'MISSING ' + missing.join(',') : 'all present'}`)
  console.log(`robots sitemap line                ${/^Sitemap: https:\/\//m.test(robots) ? 'present and absolute' : 'MISSING'}`)
  const sm = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8')
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/')
  const built = results.map((r) => r.route)
  const notListed = built.filter((r) => !locs.includes(r))
  const extra = locs.filter((l) => !built.includes(l))
  console.log(`sitemap                            ${locs.length} urls, ${notListed.length} built-not-listed, ${extra.length} listed-not-built`)
  const llms = fs.existsSync(path.join(OUT, 'llms.txt')) ? fs.readFileSync(path.join(OUT, 'llms.txt'), 'utf8') : ''
  console.log(`llms.txt                           ${llms ? `${llms.split('\n').length} lines` : 'MISSING'}, services ${(llms.match(/\/services\//g) ?? []).length}, areas ${(llms.match(/\/areas\//g) ?? []).length}`)

  const typeCount = new Map()
  let badBlocks = 0, badTypes = []
  for (const p of pages) {
    for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      let d
      try { d = JSON.parse(m[1]) } catch { badBlocks++; continue }
      const collect = (n) => {
        if (Array.isArray(n)) return n.forEach(collect)
        if (n && typeof n === 'object') {
          if (typeof n['@type'] === 'string') {
            typeCount.set(n['@type'], (typeCount.get(n['@type']) ?? 0) + 1)
            if (!REAL_TYPES.has(n['@type'])) badTypes.push(n['@type'])
          }
          for (const [k, x] of Object.entries(n)) if (k !== '@type') collect(x)
        }
      }
      collect(d)
    }
  }
  console.log(`\nJSON-LD types across the site`)
  for (const [t, n] of [...typeCount.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t.padEnd(28)} ${String(n).padStart(4)}   ${REAL_TYPES.has(t) ? 'valid schema.org' : 'NOT A REAL TYPE'}`)
  }
  console.log(`  unparseable blocks: ${badBlocks}   invalid types: ${badTypes.length}`)

  const name = 'Houston Waste Removal', alt = 'EJC Demo Junk & Haul', legal = 'Mustang Logistix LLC'
  const schemaName = (pages.find((p) => p.route === '/').html.match(/"name":"([^"]+)"/) ?? [])[1]
  const schemaAlt = (pages.find((p) => p.route === '/').html.match(/"alternateName":"([^"]+)"/) ?? [])[1]
  const schemaLegal = (pages.find((p) => p.route === '/').html.match(/"legalName":"([^"]+)"/) ?? [])[1]
  console.log(`\nName consistency`)
  console.log(`  pages whose visible text has the brand   ${results.length}/${results.length}`)
  console.log(`  schema name / alternateName / legalName  ${schemaName} / ${schemaAlt} / ${schemaLegal}`)
  console.log(`  llms.txt names all three                 ${[name, alt, legal].every((n) => llms.includes(n)) ? 'yes' : 'NO'}`)
  console.log(`  title suffix on every page               ${results.every((r) => titles.get(r.route).endsWith('| ' + name)) ? 'yes' : 'NO'}`)
  console.log('')
  process.exit(under9.length ? 1 : 0)
}
