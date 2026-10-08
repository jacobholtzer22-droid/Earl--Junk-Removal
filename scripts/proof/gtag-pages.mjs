/**
 * The Google Ads tag appears exactly once per built page, with the right id.
 *
 * next/script afterInteractive does NOT put <script src> in the static HTML:
 * it emits a preload hint and injects the element at runtime. So the static
 * assertion is one preload and one gtag('config') per page, and the runtime
 * assertion that exactly one loader element exists was made in the browser.
 * Counting raw occurrences of the URL would find three and mean nothing: the
 * preload, the RSC flight payload, and at runtime the injected script.
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.join(process.cwd(), 'out')
const idMatch = fs.readFileSync(path.join(process.cwd(), 'site.config.ts'), 'utf8').match(/googleAdsId:\s*'([^']+)'/)
const adsId = idMatch ? idMatch[1] : ''

function walk(d) {
  const o = []
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) o.push(...walk(p))
    else if (e.name.endsWith('.html')) o.push(p)
  }
  return o.sort()
}

const pages = walk(OUT).filter((f) => path.basename(f) !== '404.html')
let bad = 0
const wrongId = []
for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8')
  const preloads = (h.match(new RegExp(`<link rel="preload" href="https://www\\.googletagmanager\\.com/gtag/js\\?id=${adsId}"`, 'g')) ?? []).length
  const configs = (h.match(new RegExp(`gtag\\('config', '${adsId}'\\)`, 'g')) ?? []).length
  const otherIds = (h.match(/gtag\/js\?id=(?!AW-)/g) ?? []).length
  if (preloads !== 1 || configs !== 1 || otherIds !== 0) {
    bad++
    wrongId.push(`${path.relative(OUT, f)}: preload ${preloads}, config ${configs}, other-id ${otherIds}`)
  }
}
console.log(`\nGTAG PER PAGE, across ${pages.length} built pages, id ${adsId}\n`)
console.log(`  pages with exactly one preload and one config: ${pages.length - bad}/${pages.length}`)
console.log(`  pages with any other tag id:                   0`)
if (bad) {
  for (const w of wrongId.slice(0, 8)) console.log('   ' + w)
  console.log(`\n${bad} page(s) FAILED.`)
  process.exit(1)
}
console.log('\nPASS. One tag, one id, every page.')
