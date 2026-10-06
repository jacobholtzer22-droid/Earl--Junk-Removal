import Phone from './Phone'

/**
 * Three steps, built ONLY from what seo/FACTS.md supports: free virtual
 * estimates exist, same-day service is available, hours are 8 to 5 seven days.
 *
 * It does not say how the virtual estimate works, because that is unknown
 * (CLIENT-TODO item 5). It does not promise an arrival window, a cleanup, or a
 * disposal destination, because none of those came from the client.
 */
const STEPS = [
  {
    title: 'Call and describe it',
    body: 'Tell us what you have and where it is sitting. Upstairs, out back, behind a shed: say so now and the quote will match the real job.',
  },
  {
    title: 'Get a free virtual estimate',
    body: 'You get a price before anyone comes out and before you have agreed to anything. The estimate costs nothing either way.',
  },
  {
    title: 'We haul it off',
    body: 'Same-day service is available, and we work seven days a week from 8:00am to 5:00pm. You point, we load, it goes.',
  },
] as const

export default function HowItWorks() {
  return (
    <section className="border-t-2 border-primary-dark bg-bg">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <h2 className="max-w-2xl font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-primary-dark md:text-5xl">
          Three steps, no surprises
        </h2>
        <ol className="mt-12 grid gap-px bg-line md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="bg-bg pb-8 md:px-8 md:pt-8">
              <span className="font-heading text-6xl font-bold tabular-nums leading-none text-accent-dark">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold uppercase tracking-tight text-primary-dark">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-base text-muted">
          Start at step one: <Phone className="text-primary-dark" />.
        </p>
      </div>
    </section>
  )
}
