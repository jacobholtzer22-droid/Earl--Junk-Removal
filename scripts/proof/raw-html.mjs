import fs from 'node:fs'
import path from 'node:path'
const OUT = path.join(process.cwd(), 'out')
const PAGES = ['index.html', 'services/junk-removal.html', 'services/hoarder-cleanouts.html', 'contact.html', 'referral-program.html']
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;| /g, ' ')
const strip = (h) => dec(h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
for (const rel of PAGES) {
  const f = path.join(OUT, rel)
  const h = fs.readFileSync(f, 'utf8')
  const route = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '')
  console.log('\n' + '='.repeat(78))
  console.log(`  ${route}      (${(fs.statSync(f).size / 1024).toFixed(0)} KB of static HTML, no JS required)`)
  console.log('='.repeat(78))
  console.log(`<title>          ${dec((h.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? 'MISSING')}`)
  console.log(`meta description ${dec((h.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? 'MISSING')}`)
  console.log(`meta robots      ${(h.match(/<meta name="robots" content="([^"]*)"/) ?? [])[1] ?? '(none)'}`)
  console.log(`canonical        ${(h.match(/<link rel="canonical" href="([^"]*)"/) ?? [])[1] ?? 'MISSING'}`)
  const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => strip(m[1]))
  console.log(`<h1> (${h1s.length})        ${h1s.join(' | ')}`)
  const h2s = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => strip(m[1]))
  console.log(`<h2> (${h2s.length})        ${h2s.slice(0, 6).join(' / ')}${h2s.length > 6 ? ' / ...' : ''}`)
  const tels = [...new Set([...h.matchAll(/href="(tel:[^"]+)"/g)].map((m) => m[1]))]
  const telText = [...new Set([...h.matchAll(/<a[^>]*href="tel:[^"]*"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => strip(m[1])))]
  console.log(`phone            ${tels.join(', ')}  rendered as: ${telText.slice(0, 3).join(' / ')}`)
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])['@type'])
  console.log(`JSON-LD blocks   ${ld.length}: ${ld.join(', ')}`)
  const art = (h.match(/<article[^>]*>([\s\S]*?)<\/article>/) ?? [])[1]
  console.log(`body copy        ${art ? strip(art).slice(0, 260) + '...' : '(no <article>)'}`)
  const formEndpoint = (h.match(/data-endpoint="([^"]+)"/) ?? [])[1]
  if (formEndpoint) console.log(`contact form     posts to ${formEndpoint}; honeypot present: ${h.includes('hp_7d3a_ref')}`)
}
