import type { Metadata } from 'next'
import AreaList from '@/components/AreaList'
import CtaBand from '@/components/CtaBand'
import FaqProse from '@/components/FaqProse'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import { config } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList, faqPage } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'areas.mdx'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Service Areas', path: '/areas' },
]

export function generateMetadata(): Metadata {
  const fm = readFrontmatter(CONTENT)
  return buildMetadata({
    kind: 'other',
    title: 'Service Areas Across Greater Houston',
    path: '/areas',
    description: fm.description,
  }).metadata
}

export default async function AreasIndexPage() {
  const { content } = await loadContent(CONTENT)
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <JsonLd data={faqPage(config.pageFaqs.areas)} />
      {/*
        The intro must not restate the paragraph directly under it. These three
        pages each said the same thing twice in a row: the header announced the
        structure or the noun list and the opening paragraph repeated it almost
        word for word, a line apart, which reads as padding. The opening
        paragraph is the one that stays as written, because it is what an
        answer engine lifts as the page's direct answer; the intro changed.
      */}
      <PageHeader
        title={`Service Areas Around ${config.primaryCity}, ${config.primaryState}`}
        intro="Nine places, one phone number, free virtual estimates seven days a week."
        crumbs={CRUMBS}
      />
      <article className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        {content}
        <FaqProse faqs={config.pageFaqs.areas} />
      </article>
      <AreaList heading="Where we work" />
      <CtaBand heading="Not sure whether your address is covered?" />
    </>
  )
}
