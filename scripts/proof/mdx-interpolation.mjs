/**
 * Proves MDX {expressions} still interpolate after the next-mdx-remote 6
 * upgrade. Run against ./out after a build: `node scripts/proof/mdx-interpolation.mjs`
 *
 * WHY THIS EXISTS. next-mdx-remote 6 blocks {expressions} by default. Without
 * `blockJS: false` in lib/content.ts every {config.displayName} renders as an
 * empty string, the build succeeds, and all 17 verify checks pass. The gate is
 * not a safety net here, so this script is.
 *
 * It reads the RENDERED TEXT of each page's <article>, not the raw HTML.
 * Grepping raw HTML gives false passes: React separates interpolated text
 * nodes with <!-- --> comments, so "Name<!-- --> is a company" contains the
 * literal name while still looking broken, and an empty interpolation leaves
 * no trace to grep for at all.
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.join(process.cwd(), 'out')
const [, , ...needles] = process.argv
if (needles.length === 0) {
  console.error('usage: node scripts/proof/mdx-interpolation.mjs "<string that must appear>" [...]')
  process.exit(2)
}

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name.endsWith('.html')) out.push(p)
  }
  return out.sort()
}

/** Visible text of the first <article>, with HTML comments and tags removed. */
function articleText(html) {
  const m = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  if (!m) return null
  return m[1]
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const rows = []
for (const file of walk(OUT)) {
  if (path.basename(file) === '404.html') continue
  const text = articleText(fs.readFileSync(file, 'utf8'))
  if (text === null) continue // page renders no MDX article
  const route = '/' + path.relative(OUT, file).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  rows.push({ route: route === '/' ? '/' : route, text })
}

let failed = 0
const w = Math.max(...rows.map((r) => r.route.length), 6)
console.log(`\n${'route'.padEnd(w)}  chars  ${needles.map((n) => n.slice(0, 22)).join('  ')}`)
console.log(`${'-'.repeat(w)}  -----  ${needles.map((n) => '-'.repeat(Math.min(n.length, 22))).join('  ')}`)
for (const r of rows) {
  const marks = needles.map((n, i) => {
    const ok = r.text.includes(n)
    if (!ok) failed++
    return (ok ? 'yes' : 'NO ').padEnd(Math.min(needles[i].length, 22))
  })
  console.log(`${r.route.padEnd(w)}  ${String(r.text.length).padStart(5)}  ${marks.join('  ')}`)
}

// An empty interpolation shows up as a doubled space or a dangling "in ,".
const suspicious = rows.filter((r) => /\s,|\bin \.|\(\s*\)|\s{2,}/.test(r.text))
console.log('')
if (suspicious.length) {
  console.log('SUSPECT blank-interpolation punctuation in: ' + suspicious.map((s) => s.route).join(', '))
  for (const s of suspicious) console.log(`  ${s.route}: ...${s.text.slice(0, 160)}...`)
} else {
  console.log('No blank-interpolation punctuation ("in ,", "in .", doubled spaces) on any MDX page.')
}
console.log(`${rows.length} MDX-rendering pages checked.`)
if (failed) {
  console.log(`FAILED: ${failed} missing string(s).`)
  process.exit(1)
}
console.log('All required strings present in rendered article text.')
