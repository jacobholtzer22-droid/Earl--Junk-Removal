/**
 * Exactly the groups the client listed in seo/FACTS.md, in their words. Not a
 * persona exercise: a renter, an executor and a storage facility operator all
 * arrive with different problems, and seeing yourself named is what makes
 * someone believe the call is worth making.
 */
const GROUPS = [
  'Homeowners',
  'Renters',
  'Realtors',
  'Property managers',
  'Contractors',
  'Businesses',
  'Municipalities',
  'Senior citizens',
  'Estate executors',
  'Storage facility operators',
] as const

export default function WhoWeServe() {
  return (
    <section data-reveal className="border-t-2 border-primary-dark bg-surface">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-primary-dark md:text-4xl">
          Who we work for
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {GROUPS.map((group) => (
            <li
              key={group}
              className="bg-surface px-5 py-6 font-heading text-base font-semibold uppercase leading-snug tracking-tight text-primary-dark"
            >
              {group}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
