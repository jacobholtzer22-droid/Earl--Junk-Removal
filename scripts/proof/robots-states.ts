/**
 * Prints what app/robots.ts returns in BOTH indexable states, by executing the
 * shipped function twice rather than describing what it would do.
 *
 * The pre-launch state is the one nobody ever sees again once a site goes
 * live, which is exactly why it is worth printing: it is the state the next
 * client site starts in, and a blanket Disallow that quietly stopped working
 * would not be noticed until a half-built site got indexed.
 *
 * config is a plain object, so flipping the flag here exercises the real
 * branch. The parse-time guard that refuses indexable with an empty slug ran
 * at import and is unaffected.
 */
import { config } from '@/lib/config'
import robots from '@/app/robots'

const out: unknown[] = []
for (const indexable of [true, false]) {
  ;(config as unknown as { indexable: boolean }).indexable = indexable
  out.push({ indexable, ...robots() })
}
console.log(JSON.stringify(out))
