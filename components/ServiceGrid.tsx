import Link from 'next/link'
import { config } from '@/lib/config'

interface Props {
  heading?: string
  /** Hide one service (used on service pages to show "other services"). */
  exclude?: string
}

/**
 * Services as a numbered list with heavy rules, not a row of floating cards.
 * Each row is one link: numeral, name, description, price when known.
 */
export default function ServiceGrid({ heading = 'Our Services', exclude }: Props) {
  const services = config.services.filter((s) => s.slug !== exclude)
  if (services.length === 0) return null
  /**
   * The price column only earns its space when at least one service has a
   * price. With every priceFrom null it rendered "Free estimate" identically on
   * all thirteen rows: a column of dead text that says nothing the page has not
   * already said twice, and reads as a field nobody filled in. When it is gone
   * the description takes the width instead.
   */
  const anyPriced = services.some((s) => s.priceFrom !== null)
  return (
    <section className="border-t-2 border-primary-dark bg-bg">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
      <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-primary-dark md:text-4xl">{heading}</h2>
      <ol className="mt-10 border-t-2 border-primary-dark">
        {services.map((s, i) => (
          <li key={s.slug} className="border-b border-line">
            <Link href={`/services/${s.slug}`} className="group grid gap-3 py-7 transition-colors duration-100 hover:bg-surface motion-reduce:transition-none md:grid-cols-12 md:items-baseline md:gap-8">
              <span className="font-heading text-sm font-semibold tabular-nums text-accent-dark md:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-2xl font-semibold uppercase tracking-tight text-primary-dark transition-colors duration-100 group-hover:text-accent-dark motion-reduce:transition-none md:col-span-4">{s.name}</h3>
              <p className={`text-base leading-relaxed text-muted ${anyPriced ? 'md:col-span-5' : 'md:col-span-7'}`}>
                {s.shortDescription}
              </p>
              {anyPriced && (
                <span className="text-sm font-semibold text-ink md:col-span-2 md:text-right">
                  {s.priceFrom !== null ? `From $${s.priceFrom}` : 'Free estimate'}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
      </div>
    </section>
  )
}
