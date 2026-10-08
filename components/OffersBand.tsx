import Link from 'next/link'
import { config } from '@/lib/config'

/**
 * The offers, plus the referral teaser. This is the homepage's full-dark
 * section (AGENT.md requires at least one) and the only place the two referral
 * figures appear outside /referral-program.
 *
 * Every line is from seo/FACTS.md verbatim in substance. No terms are invented
 * around any of them.
 */
const OFFERS = [
  { headline: '$50 off', body: 'your first service with us. Mention it when you call so it is applied to the quote.' },
  { headline: 'Free virtual estimates', body: 'A price before you commit, at no charge whether you book or not.' },
  { headline: 'Same-day service', body: 'Available. Call and ask what is still open today rather than assuming it is too late.' },
] as const

export default function OffersBand() {
  return (
    <section data-reveal className="border-t-2 border-accent bg-primary text-on-primary">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-5xl">What you get</h2>

        <div className="mt-12 grid gap-px bg-on-primary/20 md:grid-cols-3">
          {OFFERS.map((offer) => (
            <div key={offer.headline} className="bg-primary pb-8 md:px-8 md:pt-8">
              <p className="font-heading text-2xl font-bold uppercase tracking-tight text-accent-on-dark md:text-3xl">
                {offer.headline}
              </p>
              <p className="mt-3 text-base leading-relaxed opacity-90">{offer.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-on-primary/25 pt-10 md:flex md:items-end md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <h3 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
              Plumbers, electricians, roofers: get paid for the junk you walk past
            </h3>
            <p className="mt-3 text-base leading-relaxed opacity-90">
              {config.displayName} pays <span className="font-semibold text-accent-on-dark">$20</span> for a verified lead that
              requests a quote and <span className="font-semibold text-accent-on-dark">$75</span> for a lead that books and has
              the job completed.
            </p>
          </div>
          <Link
            href="/referral-program"
            className="mt-6 inline-block shrink-0 bg-accent-on-dark px-6 py-3.5 font-heading text-base font-semibold uppercase tracking-wide text-primary-dark transition-colors duration-100 hover:bg-accent hover:text-on-accent active:translate-y-px motion-reduce:transition-none md:mt-0"
          >
            How the referral program works
          </Link>
        </div>
      </div>
    </section>
  )
}
