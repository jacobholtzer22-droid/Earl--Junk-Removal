import fs from 'node:fs'
import path from 'node:path'
const OUT = path.join(process.cwd(), 'out')
function walk(d) {
  const o = []
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) o.push(...walk(p)); else if (e.name.endsWith('.html')) o.push(p)
  }
  return o.sort()
}
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
const pages = walk(OUT).filter((f) => path.basename(f) !== '404.html')
const rows = pages.map((f) => {
  const h = fs.readFileSync(f, 'utf8')
  let route = '/' + path.relative(OUT, f).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  if (route === '/') route = '/'
  return {
    route,
    t: dec((h.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? ''),
    d: dec((h.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? ''),
  }
}).sort((a, b) => a.route.localeCompare(b.route))
const w = Math.max(...rows.map((r) => r.route.length))
console.log(`\nRENDERED TITLE LENGTHS, all ${rows.length} pages\n`)
console.log('route'.padEnd(w) + '  len  50-60   title')
console.log('-'.repeat(w) + '  ---  -----   -----')
let outside = 0
for (const r of rows) {
  const ok = r.t.length >= 50 && r.t.length <= 60
  if (!ok) outside++
  console.log(r.route.padEnd(w) + '  ' + String(r.t.length).padStart(3) + '  ' + (ok ? ' ok  ' : ' OUT ') + '   ' + r.t)
}
console.log(`\ntitles within 50-60: ${rows.length - outside}/${rows.length}    all unique: ${new Set(rows.map((r) => r.t)).size === rows.length}`)
const dl = rows.map((r) => r.d.length)
console.log(`descriptions: min ${Math.min(...dl)}, max ${Math.max(...dl)}, all within 140-160: ${dl.every((n) => n >= 140 && n <= 160)}, all unique: ${new Set(rows.map((r) => r.d)).size === rows.length}`)
