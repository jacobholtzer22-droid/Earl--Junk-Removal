import { config } from '@/lib/config'

/**
 * The four things that are true about this business and matter to someone
 * deciding whether to call. Every one traces to seo/FACTS.md. Nothing about
 * insurance or licensing appears here, because that is not known.
 *
 * NOT a row of icon cards: four generic icons would say nothing these four
 * words do not.
 *
 * A GRID, not a flex row with divider spans. The earlier version put a divider
 * before every item except the first, so the moment it wrapped, the second line
 * began with a stray vertical rule and the items landed at random indents. A
 * grid with a rule over each item is the same visual idea and cannot go ragged
 * at any width.
 */
const CHIPS = ['Veteran Owned', 'Free Virtual Estimates', 'Same-Day Service', 'Open 7 Days'] as const

export default function TrustChips({ dark = false }: { dark?: boolean }) {
  return (
    <ul className="grid max-w-3xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
      {CHIPS.map((chip) => (
        <li key={chip} className={`border-t-2 border-accent pt-2.5 ${dark ? 'text-on-primary' : 'text-primary-dark'}`}>
          <span className="font-heading text-sm font-semibold uppercase leading-snug tracking-[0.1em]">{chip}</span>
        </li>
      ))}
    </ul>
  )
}
