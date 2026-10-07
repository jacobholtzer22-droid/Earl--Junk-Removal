import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AreaList from '@/components/AreaList'
import CtaBand from '@/components/CtaBand'
import FaqAccordion from '@/components/FaqAccordion'
import HoursPanel from '@/components/HoursPanel'
import JsonLd from '@/components/JsonLd'
import OffersBand from '@/components/OffersBand'
import PageHeader from '@/components/PageHeader'
import ServiceGrid from '@/components/ServiceGrid'
import { config, outlyingAreas } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList, faqPage, service as serviceSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export function generateStaticParams() {
  // Only the outlying places. The homepage is the Houston page.
  return outlyingAreas().map((a) => ({ slug: a.slug }))
}

function crumbsFor(name: string, slug: string) {
  return [
    { name: 'Home', path: '/' },
    { name: 'Service Areas', path: '/areas' },
    { name, path: `/areas/${slug}` },
  ]
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = outlyingAreas().find((a) => a.slug === params.slug)
  if (!area) return {}
  const fm = readFrontmatter(`areas/${area.slug}.mdx`)
  return buildMetadata({ kind: 'area', area, path: `/areas/${area.slug}`, description: fm.description }).metadata
}

/**
 * A city page, with no photograph on it.
 *
 * A stock image on a page headed "Junk Removal in Katy, TX" is read as a job
 * in Katy. There have been no jobs in Katy that anyone here can point to, so
 * the page runs on type, copy and the service list. See seo/AREA-SOURCES.md
 * for what a page like this is allowed to say and what it is not.
 */
export default async function AreaPage({ params }: { params: { slug: string } }) {
  const area = outlyingAreas().find((a) => a.slug === params.slug)
  if (!area) notFound()
  const { content } = await loadContent(`areas/${area.slug}.mdx`, { area })
  const crumbs = crumbsFor(area.name, area.slug)

  return (
    <>
      {/*
        Service schema scoped to this one place, so areaServed names it with
        its real type rather than lumping it in with everywhere else.
      */}
      <JsonLd data={serviceSchema(config.primaryService, [area])} />
      <JsonLd data={faqPage(area.faqs)} />
      <JsonLd data={breadcrumbList(crumbs)} />

      <PageHeader title={`${config.primaryService.name} in ${area.name}, ${config.primaryState}`} crumbs={crumbs} />

      {/*
        data-area-prose marks the copy that must be genuinely different from
        every other area page. scripts/proof/area-similarity.mjs reads exactly
        this element plus the FAQ accordion, and nothing else, because the
        service list, offers, hours and CTA below are shared on purpose.
      */}
      <article data-area-prose className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        {content}
      </article>

      <ServiceGrid heading={`What we haul in ${area.name}`} />
      <OffersBand />
      <HoursPanel />
      <FaqAccordion faqs={area.faqs} heading={`${area.name} questions`} />
      <AreaList heading="Other areas we cover" exclude={area.slug} />
      <CtaBand heading={`Need a hand in ${area.name}?`} />
    </>
  )
}
