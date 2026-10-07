import Link from 'next/link'
import { config } from '@/lib/config'
import LogoMark from './LogoMark'

/**
 * The veteran-owned teaser. Names Earl as the owner and spells out that the
 * "Demo" in the name is demolition.
 *
 * There is no bio, no backstory and no military branch, because none was
 * supplied (CLIENT-TODO item 13). There is no tenure claim either: the business
 * is under a year old and saying so would cost more than it gains.
 *
 * NO PHOTOGRAPH HERE, deliberately. This section is about Earl rather than
 * about a service, so a stock image in it is read as his premises or his crew.
 * The logo goes in that slot instead. See lib/stock-images.ts.
 */
export default function AboutTeaser() {
  return (
    <section data-about-teaser data-reveal className="border-t-2 border-primary-dark bg-bg">
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-5 md:py-24">
        <div className="md:col-span-3">
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-accent-dark">Veteran owned</p>
          <h2 className="mt-4 font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-primary-dark md:text-5xl">
            Run by Earl
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {config.displayName} is a veteran owned business, operated by {config.alternateName}. The &quot;Demo&quot; in
            that name is short for demolition, which is why sheds, decks and fences are on the service list alongside
            hauling.
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Houston, seven days a week, 8:00am to 5:00pm. Free virtual estimates, and $50 off a first service.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block border-2 border-primary-dark px-6 py-3 font-heading text-base font-semibold uppercase tracking-wide text-primary-dark hover:bg-primary-dark hover:text-on-primary"
          >
            More about EJC
          </Link>
        </div>
        <div className="md:col-span-2">
          <LogoMark className="h-full" />
        </div>
      </div>
    </section>
  )
}
