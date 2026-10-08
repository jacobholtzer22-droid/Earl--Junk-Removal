import type { Metadata } from 'next'
import CtaBand from '@/components/CtaBand'
import FaqProse from '@/components/FaqProse'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import ServiceCards from '@/components/ServiceCards'
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
      {/*
        The intro must not restate the paragraph directly under it. These three
        pages each said the same thing twice in a row: the header announced the
        structure or the noun list and the opening paragraph repeated it almost
        word for word, a line apart, which reads as padding. The opening
        paragraph is the one that stays as written, because it is what an
        answer engine lifts as the page's direct answer; the intro changed.
      */}
      <PageHeader
        title={`Services in ${config.primaryCity}, ${config.primaryState}`}
        intro="Thirteen of them, every one quoted by a free virtual estimate, seven days a week."
        crumbs={CRUMBS}
      />
      <article className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        {content}
        <FaqProse faqs={config.pageFaqs.services} />
      </article>
      <ServiceCards heading="Everything we offer" />
      <CtaBand />
    </>
  )
}
