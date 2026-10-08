import Link from 'next/link'
import { config } from '@/lib/config'
import Phone from './Phone'

/**
 * quoteHref exists because of the one-form rule. A page that already has the
 * form scrolls to it (#quote); every other page sends the visitor to
 * /contact. There is never a second ContactForm on a page: it is sealed and
 * uses fixed element ids, so a duplicate would break every label binding.
 */
export default function CtaBand({
  heading,
  quoteHref = '/contact',
  body,
}: {
  heading?: string
  quoteHref?: string
  body?: string
}) {
  return (
    <section className="border-t-2 border-primary-dark bg-primary-soft">
      <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:py-24">
        <div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-primary-dark md:text-4xl">
            {heading ?? `Ready to get started in ${config.primaryCity}?`}
          </h2>
          <p className="mt-3 text-base text-muted md:text-lg">
            {body ?? (
              <>
                Call <Phone className="text-primary-dark" /> or send a message to start a free estimate.
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href={`tel:${config.phone}`}
            className="border-2 border-primary-dark px-6 py-3 font-heading text-base font-semibold uppercase tracking-wide text-primary-dark transition-colors duration-100 hover:bg-primary-dark hover:text-on-primary motion-reduce:transition-none"
          >
            Call Now
          </a>
          <Link
            href={quoteHref}
            className="bg-accent px-6 py-3.5 font-heading text-base font-semibold uppercase tracking-wide text-on-accent transition-colors duration-100 hover:bg-accent-dark active:translate-y-px motion-reduce:transition-none"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>
  )
}
