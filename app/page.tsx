import type { Metadata } from 'next'
import AboutTeaser from '@/components/AboutTeaser'
import AreaList from '@/components/AreaList'
import CtaBand from '@/components/CtaBand'
import FaqAccordion from '@/components/FaqAccordion'
import Hero from '@/components/Hero'
import HoursPanel from '@/components/HoursPanel'
import HowItWorks from '@/components/HowItWorks'
import JsonLd from '@/components/JsonLd'
import OffersBand from '@/components/OffersBand'
import QuoteSection from '@/components/QuoteSection'
import ServiceArea from '@/components/ServiceArea'
import ServiceCards, { ServiceTextList } from '@/components/ServiceCards'
import WhoWeServe from '@/components/WhoWeServe'
import { config } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { faqPage, localBusiness, organization, website } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'home.mdx'

/**
 * The six services that get a photo card on the homepage, broadest first.
 * Every one has a real photograph; appliance removal is deliberately not here
 * because it has none and the homepage shows no fallback blocks.
 */
const HOME_SERVICE_SLUGS = [
  'junk-removal',
  'furniture-removal',
  'garage-cleanouts',
  'construction-debris-removal',
  'yard-waste-removal',
  'property-cleanouts',
]

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
  const bySlug = new Map(config.services.map((s) => [s.slug, s]))
  const HOME_SERVICES = HOME_SERVICE_SLUGS.map((slug) => bySlug.get(slug)!).filter(Boolean)
  return (
    <>
      <JsonLd data={localBusiness()} />
      <JsonLd data={organization()} />
      <JsonLd data={website()} />
      <JsonLd data={faqPage(config.faqs)} />

      <Hero />

      {/*
        SECTION ORDER follows the reference site's pattern with our content.
        Hero, about, services, call to action, then the three steps and the
        form together mid-page, which is where the reference puts its quote
        block rather than only at the foot.

        Two deliberate departures, both listed in the side-by-side: the offers
        band stays, and the desktop header stays sticky.
      */}
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">{content}</article>

      <AboutTeaser />

      {/*
        SIX photo cards, not thirteen. The six broadest services, every one
        with a real photograph, so a visitor never meets a fallback block
        before they have met the business. The other seven are one click away
        in the text list underneath, and all thirteen are on /services.
      */}
      <ServiceCards heading="What we haul" services={HOME_SERVICES} />
      <ServiceTextList exclude={HOME_SERVICE_SLUGS} />

      <CtaBand
        heading="Got a pile that needs to go?"
        body="Tell us what you have and roughly where it sits. The estimate is free either way."
        quoteHref="#quote"
      />

      <HowItWorks />
      <QuoteSection />

      <OffersBand />
      <WhoWeServe />
      <FaqAccordion faqs={config.faqs} />
      <AreaList heading="Where we work" exclude="houston" />
      <HoursPanel />
      <ServiceArea />
      <CtaBand quoteHref="#quote" />
    </>
  )
}
