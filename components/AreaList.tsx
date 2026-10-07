import Link from 'next/link'
import { config, outlyingAreas } from '@/lib/config'

/**
 * Links to the area pages, as a rule-separated list rather than a row of
 * chips. Houston is in the list but points at the homepage, because that is
 * the Houston page.
 *
 * Each link names the place AND its county, so the link text is descriptive
 * on its own. "Katy" tells a screen reader nothing about where it goes; "Katy,
 * TX, Harris, Fort Bend and Waller counties" does.
 */
export default function AreaList({ heading = 'Areas we cover', exclude }: { heading?: string; exclude?: string }) {
  const areas = outlyingAreas().filter((a) => a.slug !== exclude)
  if (areas.length === 0) return null
  const showHouston = exclude !== 'houston'
  return (
    <section className="border-t-2 border-primary-dark bg-surface">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-primary-dark md:text-4xl">
          {heading}
        </h2>
        <ul className="mt-10 grid gap-px border-y-2 border-primary-dark bg-line sm:grid-cols-2 lg:grid-cols-3">
          {showHouston && (
            <li className="bg-surface">
              <Link href="/" className="group flex h-full flex-col gap-1 p-6">
                <span className="font-heading text-xl font-bold uppercase tracking-tight text-primary-dark group-hover:text-accent-dark">
                  {config.primaryCity}, {config.primaryState}
                </span>
                <span className="text-sm text-muted">Harris County. Our main service area.</span>
              </Link>
            </li>
          )}
          {areas.map((a) => (
            <li key={a.slug} className="bg-surface">
              <Link href={`/areas/${a.slug}`} className="group flex h-full flex-col gap-1 p-6">
                <span className="font-heading text-xl font-bold uppercase tracking-tight text-primary-dark group-hover:text-accent-dark">
                  {a.name}, {config.primaryState}
                </span>
                <span className="text-sm text-muted">{a.county}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
