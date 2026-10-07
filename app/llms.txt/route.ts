import { config, formatTime } from '@/lib/config'

export const dynamic = 'force-static'

/** Plain-text summary for LLM crawlers, generated from config. */
export function GET() {
  const c = config
  const url = (path: string) => new URL(path, c.domain).toString()
  const lines: string[] = [
    `# ${c.displayName}`,
    '',
    `> ${c.tagline}`,
    '',
    /*
     * The three names, stated before anything else.
     *
     * An answer engine that has seen this business under one name and a page
     * under another has no way to connect them unless something says so in
     * plain text. The same statement is on the about page, in a homepage FAQ,
     * in the footer, and as schema.org alternateName.
     */
    ...(c.alternateName
      ? [
          '## Company names',
          `${c.displayName} is the trading name. It is operated by ${c.alternateName}, whose registered legal name is ${c.legalName}. These are one business with one phone number, not three companies.`,
          '',
        ]
      : []),
    `${c.displayName} provides ${c.services.map((s) => s.name.toLowerCase()).join(', ')} in ${c.primaryCity}, ${c.primaryState} and surrounding areas.`,
    '',
    '## Contact',
    `- Phone: ${c.phoneDisplay}`,
    ...(c.email ? [`- Email: ${c.email}`] : []),
    ...(c.address ? [`- Address: ${c.address.street}, ${c.address.city}, ${c.address.state} ${c.address.zip}`] : []),
    `- Website: ${c.domain}`,
    `- Contact page: ${url('/contact')}`,
    '',
    '## Services',
    ...c.services.map((s) => `- [${s.name}](${url(`/services/${s.slug}`)}): ${s.shortDescription}`),
    '',
    '## Service areas',
    ...c.serviceAreas.map((a) => {
      // The primary city is the home page, not an /areas route.
      const href = a.name === c.primaryCity ? url('/') : url(`/areas/${a.slug}`)
      return `- [${a.name}, ${c.primaryState}](${href})${a.county ? `: ${a.county}` : ''}`
    }),
  ]
  if (c.hours) {
    lines.push('', '## Hours', ...c.hours.map((h) => `- ${h.day}: ${formatTime(h.open)} to ${formatTime(h.close)}`))
  }
  const facts: string[] = []
  if (c.yearsInBusiness !== null) facts.push(`- Years in business: ${c.yearsInBusiness}`)
  if (c.insured === true) facts.push('- Insured: yes')
  if (c.licenseNumber) facts.push(`- License: ${c.licenseNumber}`)
  if (facts.length) lines.push('', '## Credentials', ...facts)
  lines.push('', '## Pages', `- [About](${url('/about')})`, `- [Privacy Policy](${url('/privacy-policy')})`, `- [Sitemap](${url('/sitemap.xml')})`)

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
