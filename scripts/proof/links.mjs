import fs from 'node:fs'
import path from 'node:path'
const OUT = path.join(process.cwd(), 'out')
function walk(d) { const o = []; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) o.push(...walk(p)); else if (e.name.endsWith('.html')) o.push(p) } return o.sort() }
const pages = walk(OUT).filter((f) => path.basename(f) !== '404.html')
const routeOf = (f) => { const r = '/' + path.relative(OUT, f).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, ''); return r === '/' ? '/' : r }
const exists = (href) => {
  const clean = href.split('#')[0].split('?')[0]
  if (clean === '' || clean === '/') return fs.existsSync(path.join(OUT, 'index.html'))
  const rel = clean.replace(/^\//, '')
  return fs.existsSync(path.join(OUT, `${rel}.html`)) || fs.existsSync(path.join(OUT, rel, 'index.html')) || fs.existsSync(path.join(OUT, rel))
}
const internal = new Map(), external = new Map(), tel = new Set(), broken = []
for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8')
  for (const m of html.matchAll(/<a[^>]*href="([^"]+)"/g)) {
    const h = m[1]
    if (h.startsWith('tel:')) { tel.add(h); continue }
    if (h.startsWith('mailto:')) continue
    if (h.startsWith('http')) { external.set(h, (external.get(h) ?? 0) + 1); continue }
    if (h.startsWith('#')) continue
    internal.set(h, (internal.get(h) ?? 0) + 1)
    if (!exists(h)) broken.push(`${routeOf(f)} -> ${h}`)
  }
}
console.log(`\nINTERNAL LINK CHECK across ${pages.length} pages\n`)
console.log(`distinct internal link targets: ${internal.size}`)
console.log(`total internal links:           ${[...internal.values()].reduce((a, b) => a + b, 0)}`)
console.log(`broken internal links:          ${broken.length}`)
if (broken.length) for (const b of broken) console.log('  BROKEN ' + b)
const orphans = pages.map(routeOf).filter((r) => r !== '/' && ![...internal.keys()].some((h) => h.split('#')[0].replace(/\/$/, '') === r))
console.log(`built routes with no inbound internal link: ${orphans.length ? orphans.join(', ') : 'none'}`)
console.log(`\ntel: targets (should be exactly one): ${[...tel].join(', ')}`)
console.log(`external link targets: ${[...external.entries()].map(([u, n]) => `${u} x${n}`).join('\n                      ')}`)
process.exit(broken.length ? 1 : 0)
