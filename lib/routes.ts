import { config } from './config'

/**
 * Every public route on the site, derived from the same config arrays that
 * drive generateStaticParams. sitemap.ts and llms.txt read this, so the
 * sitemap cannot list a route that does not exist or miss one that does.
 *
 * NO AREA ROUTES. This client ships without city landing pages: the service
 * area is provisional (Houston only) and naming a suburb we cannot verify
 * would be an invented fact. config.serviceAreas still carries Houston, which
 * feeds areaServed in lib/schema.ts. Restore /areas by reverting this commit
 * once a real city list arrives.
 */
export const STATIC_ROUTES = [
  '/',
  '/services',
  '/about',
  '/referral-program',
  '/contact',
  '/privacy-policy',
  '/terms',
] as const

export function serviceRoutes(): string[] {
  return config.services.map((s) => `/services/${s.slug}`)
}

export function allRoutes(): string[] {
  return [...STATIC_ROUTES, ...serviceRoutes()]
}
