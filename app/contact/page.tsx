import type { Metadata } from 'next'
import ContactDetails from '@/components/ContactDetails'
import PendingFormGate from '@/components/PendingFormGate'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import { config } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList } from '@/lib/schema'
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
    title: 'Free Estimate in Houston, TX',
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
      <PageHeader
        title={`Contact ${config.displayName}`}
        intro="Free virtual estimates, same-day service, open seven days a week."
        crumbs={CRUMBS}
      />
      <div className="mx-auto grid max-w-page gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <article className="mb-8">{content}</article>
          <PendingFormGate />
        </div>
        <aside>
          <ContactDetails />
        </aside>
      </div>
    </>
  )
}
