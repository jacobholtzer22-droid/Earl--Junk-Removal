import type { Metadata } from 'next'
import AboutTeaser from '@/components/AboutTeaser'
import AreaList from '@/components/AreaList'
import FaqAccordion from '@/components/FaqAccordion'
import Hero from '@/components/Hero'
import HoursPanel from '@/components/HoursPanel'
import HowItWorks from '@/components/HowItWorks'
import JsonLd from '@/components/JsonLd'
import OffersBand from '@/components/OffersBand'
import QuoteSection from '@/components/QuoteSection'
import ServiceArea from '@/components/ServiceArea'
import ServiceGrid from '@/components/ServiceGrid'
import WhoWeServe from '@/components/WhoWeServe'
import { config } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { faqPage, localBusiness, organization, website } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'home.mdx'

export function generateMetadata(): Metadata {
  const fm = readFrontmatter(CONTENT)
  return buildMetadata({
    kind: 'home',
    path: '/',
    // Explicit, because the derived home title would be 49 characters and would
    // also collide with the junk removal service page's title.
    // Avoids the stutter of a head starting "Houston" in front of a brand
    // that already starts "Houston".
    title: 'Junk Removal, Cleanouts and Hauling',
    description: fm.description,
    image: fm.image,
  }).metadata
}

export default async function HomePage() {
  const { content } = await loadContent(CONTENT)
  return (
    <>
      <JsonLd data={localBusiness()} />
      <JsonLd data={organization()} />
      <JsonLd data={website()} />
      <JsonLd data={faqPage(config.faqs)} />

      <Hero />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">{content}</article>
      <HowItWorks />
      <ServiceGrid heading="What we haul" />
      <WhoWeServe />
      <OffersBand />
      <AboutTeaser />
      <HoursPanel />
      <ServiceArea />
      <AreaList heading="Where we work" exclude="houston" />
      <FaqAccordion faqs={config.faqs} />
      <QuoteSection />
    </>
  )
}
