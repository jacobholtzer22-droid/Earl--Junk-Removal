import { config } from '@/lib/config'

/**
 * The service area.
 *
 * The client has not supplied a city list, so NO suburb, neighborhood or county
 * is named anywhere on this site. config.serviceAreas holds the single primary
 * city, and the list only renders once there is more than that. Until then this
 * says "the Houston, TX area" and invites a phone call, which is honest and
 * costs nothing. Naming towns we cannot confirm would be an invented fact and
 * would send Earl on wasted drives. See CLIENT-TODO item 3.
 */
export default function ServiceArea() {
  const areas = config.serviceAreas
  const hasList = areas.length > 1

  return (
    <section className="border-t-2 border-primary-dark bg-surface">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-primary-dark md:text-4xl">
          Where we work
        </h2>
        {hasList ? (
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {areas.map((area) => (
              <li key={area.slug} className="font-heading text-lg font-semibold uppercase tracking-tight text-primary-dark">
                {area.name}, {config.primaryState}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Serving the {config.primaryCity}, {config.primaryState} area. If you are not sure whether your address is
            covered, call and ask rather than guessing. It is a short conversation and it saves a wasted trip for both
            of us.
          </p>
        )}
      </div>
    </section>
  )
}
