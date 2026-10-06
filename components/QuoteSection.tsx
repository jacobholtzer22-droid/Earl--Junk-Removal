import { config } from '@/lib/config'
import PendingFormGate from './PendingFormGate'
import Phone from './Phone'
import TrustChips from './TrustChips'

/**
 * The homepage's quote form, and the ONLY form on the page.
 *
 * There is deliberately not a second copy in the hero. components/ContactForm.tsx
 * is sealed and uses fixed element ids (contact-name, contact-phone,
 * contact-email, contact-message, contact-validation, the honeypot input).
 * Rendering it twice on one page would duplicate every one of those ids, which
 * breaks every <label for> binding: a screen reader user tapping the second
 * form's "Phone" label would be moved to the first form's phone field. The
 * hero's button anchors here instead.
 *
 * Wrapped in PendingFormGate, so while businessSlug is empty the form renders
 * but cannot post.
 */
export default function QuoteSection() {
  return (
    <section id="quote" className="scroll-mt-24 border-t-2 border-primary-dark bg-bg">
      <div className="mx-auto grid max-w-page gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-primary-dark md:text-5xl">
            Get a free estimate
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Tell {config.displayName} what you have and where it is. You get a price before you commit to anything.
          </p>
          <div className="mt-8">
            <TrustChips />
          </div>
          <p className="mt-8 text-base text-muted">
            Would rather talk? Call <Phone className="text-primary-dark" />. Open seven days, 8:00am to 5:00pm.
          </p>
        </div>
        <div>
          <PendingFormGate />
        </div>
      </div>
    </section>
  )
}
