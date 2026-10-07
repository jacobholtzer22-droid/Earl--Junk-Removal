import type { Faq } from '@/lib/config-schema'
import { PROSE_H2, PROSE_P } from './mdx-components'

/**
 * Q&A rendered open: a heading per question, the answer underneath, nothing to
 * click. The sibling of components/FaqAccordion.tsx, taking the same array.
 *
 * Which one a page uses is a reading decision, not a data decision. A page
 * whose whole body is four questions reads better with them open, because
 * collapsing them hides the entire page behind four clicks. A long page that
 * ends in a question list reads better collapsed. Both feed the identical
 * array to lib/schema.ts faqPage(), so visible content and FAQPage markup
 * cannot disagree whichever is chosen.
 *
 * Goes INSIDE the page's <article>, so it inherits the prose column and the
 * heading styles rather than restating them, and emits h2 so the single-h1
 * rule (verify.ts check 12) is untouched.
 */
export default function FaqProse({ faqs }: { faqs: readonly Faq[] }) {
  if (faqs.length === 0) return null
  return (
    <>
      {faqs.map((f) => (
        <section key={f.q}>
          <h2 className={PROSE_H2}>{f.q}</h2>
          <p className={PROSE_P}>{f.a}</p>
        </section>
      ))}
    </>
  )
}
