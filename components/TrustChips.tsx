import { config } from '@/lib/config'

/**
 * The four things that are true about this business and matter to someone
 * deciding whether to call. Every one traces to seo/FACTS.md.
 *
 * NOT a row of icon cards. A single rule-separated line of text, because four
 * generic icons would say nothing these four words do not. Nothing about
 * insurance or licensing appears here, because that is not known.
 */
const CHIPS = ['Veteran Owned', 'Free Virtual Estimates', 'Same-Day Service', 'Open 7 Days'] as const

export default function TrustChips({ dark = false }: { dark?: boolean }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-6 gap-y-2 ${dark ? 'text-on-primary' : 'text-primary-dark'}`}>
      {CHIPS.map((chip, i) => (
        <li key={chip} className="flex items-center gap-6">
          {i > 0 && <span aria-hidden="true" className={`h-4 w-px ${dark ? 'bg-on-primary/40' : 'bg-line'}`} />}
          <span className="font-heading text-sm font-semibold uppercase tracking-[0.14em]">{chip}</span>
        </li>
      ))}
    </ul>
  )
}
