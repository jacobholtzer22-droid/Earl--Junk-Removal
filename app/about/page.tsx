import type { Metadata } from 'next'
import Credentials from '@/components/Credentials'
import CtaBand from '@/components/CtaBand'
import LogoMark from '@/components/LogoMark'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import { config } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList } from '@/lib/schema'
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
    // Explicit: the derived about title names the business twice.
    title: 'About EJC Demo Junk & Haul in Houston',
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
      <PageHeader title={`About ${config.displayName}`} intro={config.tagline} crumbs={CRUMBS} />
      <div className="mx-auto grid max-w-page gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <Credentials />
          {content}
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
