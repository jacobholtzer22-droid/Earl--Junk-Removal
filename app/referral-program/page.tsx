import type { Metadata } from 'next'
import CtaBand from '@/components/CtaBand'
import FaqProse from '@/components/FaqProse'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import Phone from '@/components/Phone'
import { config } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList, faqPage } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'referral-program.mdx'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Referral Program', path: '/referral-program' },
]

export function generateMetadata(): Metadata {
  const fm = readFrontmatter(CONTENT)
  return buildMetadata({
    kind: 'other',
    title: 'Contractor Referral Program',
    path: '/referral-program',
    description: fm.description,
  }).metadata
}

/**
 * The two payout figures are the only numbers published anywhere on this site,
 * and they come straight from FACTS.md. Everything around them is deliberately
 * unspecified: what counts as "verified", when payment lands, and whether a
 * referrer has to sign up first are all unknown (CLIENT-TODO items 9 and 19),
 * so the page says to call and agree the terms rather than inventing them.
 */
export default async function ReferralProgramPage() {
  const { content } = await loadContent(CONTENT)
  const tiers = [
    {
      amount: '$20',
      when: 'for a verified lead that requests a quote',
      detail: 'They reach out and ask for a quote. That is the whole trigger. It does not have to turn into a job.',
    },
    {
      amount: '$75',
      when: 'for a lead that books and has the job completed',
      detail: 'They go ahead, the work gets done, and you are paid on the completed job rather than on the booking.',
    },
  ]

  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <JsonLd data={faqPage(config.pageFaqs.referral)} />
      <PageHeader
        title="Contractor Referral Program"
        intro="You are already in the houses where this work turns up. Send it our way and get paid for it."
        crumbs={CRUMBS}
      />

      <div className="mx-auto max-w-page px-4 pt-12 sm:px-6">
        <div className="grid gap-px border border-line bg-line md:grid-cols-2">
          {tiers.map((tier) => (
            <div key={tier.amount} className="bg-surface p-8">
              <p className="font-heading text-5xl font-bold tabular-nums text-primary-dark">{tier.amount}</p>
              <p className="mt-2 font-heading text-lg font-bold uppercase tracking-tight text-primary-dark">{tier.when}</p>
              <p className="mt-3 text-base text-muted">{tier.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        {content}
        <FaqProse faqs={config.pageFaqs.referral} />
      </article>

      <section className="mt-16 bg-primary py-16 text-on-primary">
        <div className="mx-auto max-w-page px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">Start referring</h2>
          <p className="mt-4 max-w-2xl text-lg opacity-90">
            Call <Phone className="text-accent-on-dark" /> and tell {config.displayName} you want in. Agree how you will send work
            over and how you want to be paid before you refer anyone, so there is nothing to argue about later.
          </p>
        </div>
      </section>

      <CtaBand heading="Got a customer with a pile nobody wants to touch?" />
    </>
  )
}
