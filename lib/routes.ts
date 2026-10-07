import { config, outlyingAreas } from './config'

/**
 * Every public route on the site, derived from the same config arrays that
 * drive generateStaticParams. sitemap.ts and llms.txt read this, so the
 * sitemap cannot list a route that does not exist or miss one that does.
 */
export const STATIC_ROUTES = [
  '/',
  '/services',
  '/areas',
  '/about',
  '/referral-program',
  '/contact',
  '/privacy-policy',
  '/terms',
] as const

export function serviceRoutes(): string[] {
  return config.services.map((s) => `/services/${s.slug}`)
}

/**
 * One route per place EXCEPT the primary city. Houston does not get an
 * /areas/houston page: the homepage already targets Houston, and two pages
 * chasing the same query compete with each other rather than with anyone else.
 */
export function areaRoutes(): string[] {
  return outlyingAreas().map((a) => `/areas/${a.slug}`)
}

export function allRoutes(): string[] {
  return [...STATIC_ROUTES, ...serviceRoutes(), ...areaRoutes()]
}
