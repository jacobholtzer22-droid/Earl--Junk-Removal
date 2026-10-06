import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import Phone from '@/components/Phone'
import { config } from '@/lib/config'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Terms', path: '/terms' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({
    kind: 'other',
    title: 'Terms of Service and Website Use',
    path: '/terms',
    description:
      'The terms covering use of this website, quotes and estimates, scheduling, access to your property, and text message consent for EJC Demo Junk & Haul in Houston.',
  }).metadata
}

/**
 * Generated from config, like the privacy policy, so the legal name and
 * contact details can never be stale copy from another client.
 *
 * Deliberately narrow. It covers using this website and asking for a quote,
 * and it stops there. It does not invent cancellation windows, liability
 * limits, payment terms, warranties or a governing-law clause, because none of
 * those came from the client and a made-up term is worse than no term. See
 * CLIENT-TODO.md.
 */
export default function TermsPage() {
  const host = new URL(config.domain).host
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader title="Terms of Service" crumbs={CRUMBS} />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-10 text-base leading-relaxed text-ink sm:px-6">
        <p>
          These terms cover your use of {host}, the website of {config.legalName}, trading as {config.displayName}. By using
          this site or sending a request through it, you agree to them.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold uppercase tracking-tight text-primary-dark">
          What this website is
        </h2>
        <p className="mt-4">
          This site describes the services {config.displayName} offers and gives you ways to get in touch. Service
          descriptions explain the kind of work we do. They are not an offer to perform a particular job at a particular
          price, and availability of any service can change.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold uppercase tracking-tight text-primary-dark">
          Quotes and estimates
        </h2>
        <p className="mt-4">
          No price appears anywhere on this website. Every job is quoted individually, and a free virtual estimate is
          offered before work begins. A quote covers the work described when it was given. If what is actually on site
          differs, in volume, in weight, or in how hard it is to reach, we will tell you before we carry on, not after.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold uppercase tracking-tight text-primary-dark">
          Booking and access
        </h2>
        <p className="mt-4">
          Scheduling is confirmed by phone, not by this website. You are responsible for making sure we can reach the items
          on the agreed day, and for having the authority to have them removed. Once something is removed it cannot be
          returned, so point out anything that stays before we start.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold uppercase tracking-tight text-primary-dark">
          Text messages
        </h2>
        <p className="mt-4">
          The consent box on the contact form is unchecked by default and is never required to get a quote. If you check it,
          {' '}
          {config.displayName} may text you about your request. Message and data rates may apply. Reply STOP to any message
          to opt out, or HELP for help. See the{' '}
          <a href="/privacy-policy" className="font-semibold text-primary underline underline-offset-2">
            privacy policy
          </a>{' '}
          for how your details are handled.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold uppercase tracking-tight text-primary-dark">
          Referral program
        </h2>
        <p className="mt-4">
          The{' '}
          <a href="/referral-program" className="font-semibold text-primary underline underline-offset-2">
            contractor referral program
          </a>{' '}
          pays for referred leads as described on that page. Full conditions are agreed directly with {config.displayName}{' '}
          before any referral is made. Call <Phone /> to set it up rather than assuming a referral qualifies.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold uppercase tracking-tight text-primary-dark">
          Content on this site
        </h2>
        <p className="mt-4">
          The {config.displayName} name and logo belong to {config.legalName}. Photographs on this site are stock
          images used to illustrate the kinds of work described. They do not depict particular jobs carried out by{' '}
          {config.displayName}.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold uppercase tracking-tight text-primary-dark">
          Questions about these terms
        </h2>
        <p className="mt-4">
          Call <Phone />
          {config.email ? (
            <>
              {' '}
              or email{' '}
              <a
                href={`mailto:${config.email}`}
                className="font-semibold text-primary underline underline-offset-2"
              >
                {config.email}
              </a>
            </>
          ) : null}
          . We would rather answer a question before a job than after one.
        </p>
      </article>
    </>
  )
}
