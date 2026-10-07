import type { Metadata } from 'next'
import Credentials from '@/components/Credentials'
import FaqProse from '@/components/FaqProse'
import CtaBand from '@/components/CtaBand'
import LogoMark from '@/components/LogoMark'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import { config } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList, faqPage } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'about.mdx'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]

export function generateMetadata(): Metadata {
  const fm = readFrontmatter(CONTENT)
  return buildMetadata({
    kind: 'about',
    // Explicit: the derived title would name the business twice, and the
    // brand already carries "Houston", so the head does not repeat it.
    title: 'About Us: Veteran Owned Junk Removal',
    path: '/about',
    description: fm.description,
    image: fm.image ?? config.images.about,
  }).metadata
}

export default async function AboutPage() {
  const { content } = await loadContent(CONTENT)
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <JsonLd data={faqPage(config.pageFaqs.about)} />
      <PageHeader title={`About ${config.displayName}`} intro={config.tagline} crumbs={CRUMBS} />
      <div className="mx-auto grid max-w-page gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <Credentials />
          {content}
          {/* The same four pairs the FAQPage block above declares. One array, one source. */}
          <FaqProse faqs={config.pageFaqs.about} />
        </article>
        {/*
          Logo and type, never a photograph. This page is about Earl and his
          company rather than about a service, so an image here is read as his
          premises or his crew. See lib/stock-images.ts.
        */}
        <aside>
          <LogoMark />
        </aside>
      </div>
      <CtaBand />
    </>
  )
}
