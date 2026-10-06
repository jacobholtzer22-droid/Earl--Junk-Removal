import Link from 'next/link'
import { config } from '@/lib/config'
import Img from './Img'

/**
 * The veteran-owned teaser. Names Earl as the owner and spells out that the
 * "Demo" in the name is demolition.
 *
 * There is no bio, no backstory and no military branch, because none was
 * supplied (CLIENT-TODO item 13). There is no tenure claim either: the business
 * is under a year old and saying so would cost more than it gains.
 */
export default function AboutTeaser() {
  const image = config.images.about
  return (
    <section className="border-t-2 border-primary-dark bg-bg">
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-5 md:py-24">
        <div className="md:col-span-3">
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-accent">Veteran owned</p>
          <h2 className="mt-4 font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-primary-dark md:text-5xl">
            Run by Earl, out of Houston
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {config.displayName} is a veteran owned business. The &quot;Demo&quot; is short for demolition, which is why
            sheds, decks and fences come down here as well as getting hauled off.
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            You deal with Earl. Not a call centre, not a franchise script.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block border-2 border-primary-dark px-6 py-3 font-heading text-base font-semibold uppercase tracking-wide text-primary-dark hover:bg-primary-dark hover:text-on-primary"
          >
            More about EJC
          </Link>
        </div>
        {image && (
          <div className="md:col-span-2">
            <Img name={image} sizes="(min-width: 768px) 40vw, 100vw" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
