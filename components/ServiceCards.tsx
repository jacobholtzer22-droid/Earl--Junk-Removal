import Link from 'next/link'
import { config } from '@/lib/config'
import { getImage, hasImage } from '@/lib/images'
import type { Service } from '@/lib/config-schema'

/**
 * Services as photo cards: image, name, one line, linking to the page.
 *
 * THE FALLBACK IS NOT A PLACEHOLDER. A service with no honest photograph gets
 * a brand-green block carrying its name, and that is a finished state, not a
 * gap waiting to be filled. Appliance removal is the only one: three searches
 * produced nothing without a manufacturer's badge on the subject itself. See
 * lib/stock-images.ts and CLIENT-TODO item 24.
 *
 * The fallback appears on the services index and on page banners only. The
 * homepage shows six cards and every one of them has a real photograph, so a
 * visitor never meets a green block before they have met the business.
 */
function CardMedia({ service }: { service: Service }) {
  const name = service.image
  const img = name && hasImage(name) ? getImage(name) : null
  if (!img) {
    return (
      <div className="flex aspect-[4/3] items-end bg-accent p-5">
        <span className="font-heading text-xl font-bold uppercase leading-tight tracking-tight text-on-accent">
          {service.name}
        </span>
      </div>
    )
  }
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
      width={img.width}
      height={img.height}
      alt={img.alt}
      loading="lazy"
      decoding="async"
      className="aspect-[4/3] w-full object-cover"
    />
  )
}

export default function ServiceCards({
  heading = 'Our Services',
  services = config.services,
  intro,
}: {
  heading?: string
  services?: readonly Service[]
  intro?: string
}) {
  if (services.length === 0) return null
  return (
    <section className="border-t-2 border-primary-dark bg-bg">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-primary-dark md:text-4xl">
          {heading}
        </h2>
        {intro && <p className="mt-3 max-w-2xl text-base text-muted md:text-lg">{intro}</p>}
        <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug} className="bg-surface">
              <Link href={`/services/${s.slug}`} className="group flex h-full flex-col">
                <div className="overflow-hidden">
                  <CardMedia service={s} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-xl font-bold uppercase leading-tight tracking-tight text-primary-dark transition-colors duration-100 group-hover:text-accent-dark motion-reduce:transition-none">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{s.shortDescription}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * The compact list under the homepage's six cards. It links the services that
 * did not make the grid plus the index, so every one of the thirteen is one
 * click from the homepage even though only six get a picture.
 */
export function ServiceTextList({ exclude }: { exclude: readonly string[] }) {
  const rest = config.services.filter((s) => !exclude.includes(s.slug))
  if (rest.length === 0) return null
  return (
    <div className="mx-auto max-w-page px-4 pb-16 sm:px-6 md:pb-24">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">Also on the list</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {rest.map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.slug}`} className="text-base text-ink underline-offset-4 hover:text-accent-dark hover:underline">
              {s.name}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/services" className="text-base font-semibold text-accent-dark underline underline-offset-4">
            All services
          </Link>
        </li>
      </ul>
    </div>
  )
}
