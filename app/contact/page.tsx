import type { Metadata } from 'next'
import ContactDetails from '@/components/ContactDetails'
import FaqAccordion from '@/components/FaqAccordion'
import PendingFormGate from '@/components/PendingFormGate'
import JsonLd from '@/components/JsonLd'
import PageBanner from '@/components/PageBanner'
import PageHeader from '@/components/PageHeader'
import { config } from '@/lib/config'
import { STOCK } from '@/lib/stock-images'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList, faqPage } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'contact.mdx'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

export function generateMetadata(): Metadata {
  const fm = readFrontmatter(CONTENT)
  return buildMetadata({
    kind: 'contact',
    // Explicit: the derived contact title would run to 62 characters and name
    // the business twice.
    title: 'Free Estimate for Junk Removal',
    path: '/contact',
    description: fm.description,
    image: fm.image,
  }).metadata
}

export default async function ContactPage() {
  const { content } = await loadContent(CONTENT)
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <JsonLd data={faqPage(config.pageFaqs.contact)} />
      <PageHeader
        title={`Contact ${config.displayName}`}
        intro="Free virtual estimates, same-day service, open seven days a week."
        crumbs={CRUMBS}
      />

      <PageBanner image={STOCK.ctaBand} label="Free Estimates" />
      <div className="mx-auto grid max-w-page gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <article className="mb-8">{content}</article>
          <PendingFormGate />
        </div>
        <aside>
          <ContactDetails />
        </aside>
      </div>
      {/*
        Collapsed, not open, and below the form on purpose. The job of this
        page is the form and the phone number; three open answers above them
        would push both down the page. FaqAccordion needs no JavaScript, so
        every answer is still in the HTML a crawler reads.
      */}
      <FaqAccordion faqs={config.pageFaqs.contact} heading="Before you call" />
    </>
  )
}
