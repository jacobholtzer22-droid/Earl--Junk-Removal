import type { Metadata } from 'next'
import { config } from './config'
import type { Service, ServiceArea } from './config-schema'
import { getImage, hasImage } from './images'

/**
 * Title template applied by the root layout. Every builder below already
 * includes the display name, so no suffix is appended, but the template is
 * still applied here so `renderedTitleLength` is the number a browser shows.
 */
export const TITLE_TEMPLATE = '%s'

export function renderTitle(raw: string): string {
  return TITLE_TEMPLATE.replace('%s', raw)
}

export { DESCRIPTION_MAX, DESCRIPTION_MIN, TITLE_MAX, TITLE_MIN } from '@/scripts/verify-limits'

export type PageKind = 'home' | 'service' | 'area' | 'services' | 'about' | 'contact' | 'privacy' | 'other'

export interface BuildMetadataArgs {
  kind: PageKind
  path: string
  service?: Service
  area?: ServiceArea
  /** Overrides the derived title for kind 'other'. Ignored for home/service/area. */
  title?: string
  /** Page description, 140 to 160 characters. Falls back to a config-derived default. */
  description?: string
  /** Manifest filename for the og:image. Falls back to the hero. */
  image?: string | null
}

/**
 * The branded social card. A real file in public/, not a manifest entry; see
 * buildMetadata. Dimensions are declared here because they are what the file
 * actually is, and a wrong og:image:width is worse than none.
 */
const OG_CARD = { path: '/og-card.png', width: 1200, height: 630 } as const

export function canonicalUrl(path: string): string {
  return new URL(path, config.domain).toString()
}

export function buildTitle(args: Pick<BuildMetadataArgs, 'kind' | 'service' | 'area' | 'title'>): string {
  const { displayName, primaryCity, primaryState, primaryService } = config

  /**
   * An explicit `title` now wins for EVERY kind, not just 'other'. The derived
   * forms below are a sane default, not a cage: several of them land outside
   * the 50 to 60 character band for a given client's name length, and the page
   * that knows it is the page that should say so.
   */
  if (args.title) return `${args.title} | ${displayName}`

  switch (args.kind) {
    case 'home':
      return `${displayName} | ${primaryService.name} in ${primaryCity}, ${primaryState}`
    case 'service': {
      if (!args.service) throw new Error('buildTitle: kind "service" needs a service')
      // The state is included so the title answers "where" without the reader
      // having to know which Houston. titleOverride replaces the whole head
      // when the service's real name is too long to fit under 60 characters;
      // the name itself is never truncated, because the H1 and nav use it.
      const head = args.service.titleOverride ?? `${args.service.name} in ${primaryCity}, ${primaryState}`
      return `${head} | ${displayName}`
    }
    case 'area': {
      if (!args.area) throw new Error('buildTitle: kind "area" needs an area')
      // Same reason as services[].titleOverride: a short place name lands the
      // derived title under 50 characters and wastes displayed width.
      const head = args.area.titleOverride ?? `${primaryService.name} in ${args.area.name}, ${primaryState}`
      return `${head} | ${displayName}`
    }
    case 'services':
      return `All Services in ${primaryCity} | ${displayName}`
    case 'about':
      return `About ${displayName} in ${primaryCity} | ${displayName}`
    case 'contact':
      return `Contact ${displayName} in ${primaryCity} | ${displayName}`
    case 'privacy':
      return `Privacy Policy and Data Use | ${displayName}`
    case 'other':
      // Unreachable in practice: the early return above handles any args.title.
      throw new Error('buildTitle: kind "other" needs a title')
  }
}

/**
 * Default descriptions built from config. Content files can override these in
 * frontmatter; verify.ts checks the rendered length either way.
 */
export function defaultDescription(args: Pick<BuildMetadataArgs, 'kind' | 'service' | 'area'>): string {
  const { displayName, primaryCity, primaryState, primaryService, phoneDisplay } = config
  const services = config.services.map((s) => s.name.toLowerCase())
  const list = services.length > 1 ? `${services.slice(0, -1).join(', ')} and ${services.at(-1)}` : services[0]
  switch (args.kind) {
    case 'home':
      return `${displayName} provides ${list} for homes in ${primaryCity}, ${primaryState} and nearby towns. Call ${phoneDisplay} or request a free quote online.`
    case 'service':
      return `${args.service?.shortDescription ?? ''} Serving ${primaryCity}, ${primaryState}. Call ${displayName} at ${phoneDisplay} for a free quote.`
    case 'area':
      return `${displayName} offers ${list} in ${args.area?.name ?? primaryCity}, ${primaryState}. Local crew, clear quotes, and reliable scheduling. Call ${phoneDisplay} to get started.`
    case 'services':
      return `See every service ${displayName} offers in ${primaryCity}, ${primaryState}: ${list}. Each page explains what is included and answers common questions.`
    case 'about':
      return `Meet ${displayName}, the local crew behind ${primaryService.name.toLowerCase()} in ${primaryCity}, ${primaryState}. Learn how we work and why neighbors keep calling us back.`
    case 'contact':
      return `Contact ${displayName} for ${primaryService.name.toLowerCase()} and more in ${primaryCity}, ${primaryState}. Call ${phoneDisplay} or send a message to request a free quote.`
    case 'privacy':
      return `How ${displayName} handles the information you share through this website, including contact form details, text message consent, and how to reach us about it.`
    case 'other':
      return `${displayName} serves ${primaryCity}, ${primaryState} and the surrounding area. Call ${phoneDisplay} or send a message through the contact form to request a free quote.`
  }
}

export interface BuiltMetadata {
  metadata: Metadata
  renderedTitle: string
  /** Length of the title exactly as the browser will render it, template included. */
  renderedTitleLength: number
  description: string
}

export function buildMetadata(args: BuildMetadataArgs): BuiltMetadata {
  const rawTitle = buildTitle(args)
  const renderedTitle = renderTitle(rawTitle)
  const description = args.description ?? defaultDescription(args)
  const url = canonicalUrl(args.path)

  /**
   * The social card is the branded 1200x630 PNG at public/og-card.png, built
   * from the logo and type. It is NOT a stock photograph and not the hero.
   *
   * Two reasons it bypasses the image manifest. The manifest only emits WebP,
   * and several social scrapers still render WebP og:images poorly or not at
   * all. And the manifest's widths cap at 1024, so a card published through it
   * would declare 1200x630 while serving 1024 wide.
   *
   * A page may still override with `args.image` (a manifest filename) when a
   * specific photograph genuinely suits it better.
   */
  const override = args.image && hasImage(args.image) ? getImage(args.image) : null
  const ogImage = override ?? {
    src: OG_CARD.path,
    width: OG_CARD.width,
    height: OG_CARD.height,
    alt: `${config.displayName}, ${config.primaryService.name.toLowerCase()} in ${config.primaryCity}, ${config.primaryState}`,
  }

  const metadata: Metadata = {
    title: { absolute: renderedTitle },
    description,
    // Per-page meta robots as well as robots.txt. robots.txt alone is not
    // enough: a disallowed URL can still be indexed from inbound links, and a
    // crawler that is blocked from fetching the page never reads a noindex it
    // cannot see. Belt and braces until the real domain is live.
    robots: config.indexable ? undefined : { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: config.displayName,
      title: renderedTitle,
      description,
      url,
      ...(ogImage
        ? { images: [{ url: canonicalUrl(ogImage.src), width: ogImage.width, height: ogImage.height, alt: ogImage.alt }] }
        : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: renderedTitle,
      description,
      ...(ogImage ? { images: [canonicalUrl(ogImage.src)] } : {}),
    },
  }

  return { metadata, renderedTitle, renderedTitleLength: renderedTitle.length, description }
}
