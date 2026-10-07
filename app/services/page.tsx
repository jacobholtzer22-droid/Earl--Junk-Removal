import type { Metadata } from 'next'
import CtaBand from '@/components/CtaBand'
import FaqProse from '@/components/FaqProse'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import ServiceGrid from '@/components/ServiceGrid'
import { config } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList, faqPage } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'services.mdx'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
]

export function generateMetadata(): Metadata {
  const fm = readFrontmatter(CONTENT)
  return buildMetadata({
    kind: 'services',
    title: 'Junk Removal and Cleanout Services',
    path: '/services',
    description: fm.description,
    image: fm.image,
  }).metadata
}

export default async function ServicesIndexPage() {
  const { content } = await loadContent(CONTENT)
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <JsonLd data={faqPage(config.pageFaqs.services)} />
      <PageHeader
        title={`Services in ${config.primaryCity}, ${config.primaryState}`}
        intro="Thirteen services, one phone number. Residential, commercial, construction and storm work."
        crumbs={CRUMBS}
      />
      <article className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        {content}
        <FaqProse faqs={config.pageFaqs.services} />
      </article>
      <ServiceGrid heading="Everything we offer" />
      <CtaBand />
    </>
  )
}
