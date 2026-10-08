import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CtaBand from '@/components/CtaBand'
import FaqAccordion from '@/components/FaqAccordion'
import Img from '@/components/Img'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import HowItWorks from '@/components/HowItWorks'
import PageBanner from '@/components/PageBanner'
import ServiceCards from '@/components/ServiceCards'
import { config, getService } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList, faqPage, service as serviceSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

// No `dynamicParams = false` here: with output: 'export' the static build only
// ever serves these params anyway, and the flag makes `next dev` refuse the route.
export function generateStaticParams() {
  return config.services.map((s) => ({ slug: s.slug }))
}

function crumbsFor(name: string, slug: string) {
  return [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name, path: `/services/${slug}` },
  ]
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug)
  if (!service) return {}
  const fm = readFrontmatter(`services/${service.slug}.mdx`)
  return buildMetadata({
    kind: 'service',
    service,
    path: `/services/${service.slug}`,
    description: fm.description,
    image: fm.image ?? service.image,
  }).metadata
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug)
  if (!service) notFound()
  const { content } = await loadContent(`services/${service.slug}.mdx`, { service })
  const crumbs = crumbsFor(service.name, service.slug)

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqPage(service.faqs)} />
      <JsonLd data={breadcrumbList(crumbs)} />

      <PageHeader
        title={`${service.name} in ${config.primaryCity}, ${config.primaryState}`}
        intro={service.shortDescription}
        crumbs={crumbs}
      />

      <PageBanner image={service.image} label={service.name} />

      <div className="mx-auto grid max-w-page gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-3">
        <article className="lg:col-span-2">{content}</article>
        <aside className="space-y-6">
          {service.priceFrom !== null && (
            <div className="border-l-4 border-accent bg-surface p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Pricing</p>
              <p className="mt-2 font-heading text-3xl font-bold text-primary-dark">From ${service.priceFrom}</p>
              {service.priceNote && <p className="mt-1 text-sm text-muted">{service.priceNote}</p>}
            </div>
          )}
          {service.priceFrom === null && service.priceNote && (
            <div className="border-l-4 border-accent bg-surface p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Pricing</p>
              <p className="mt-2 text-sm text-ink">Pricing is {service.priceNote}.</p>
            </div>
          )}
        </aside>
      </div>

      {/* A fixed heading: several service names are long enough that
          "<name> Questions" reads badly. */}
      <HowItWorks />
      <FaqAccordion faqs={service.faqs} heading="Common questions" />
      <ServiceCards heading="Other services" services={config.services.filter((s) => s.slug !== service.slug)} />
      <CtaBand heading={`Need ${service.name.toLowerCase()} in ${config.primaryCity}?`} />
    </>
  )
}
