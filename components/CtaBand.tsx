import Link from 'next/link'
import { config } from '@/lib/config'
import Phone from './Phone'

export default function CtaBand({ heading }: { heading?: string }) {
  return (
    <section className="border-t-2 border-primary-dark bg-primary-soft">
      <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:py-24">
        <div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-primary-dark md:text-4xl">
            {heading ?? `Ready to get started in ${config.primaryCity}?`}
          </h2>
          <p className="mt-3 text-base text-muted md:text-lg">
            Call <Phone className="text-primary-dark" /> or send a message to start a free estimate.
          </p>
        </div>
        <Link href="/contact" className="shrink-0 bg-accent px-6 py-3.5 font-heading text-base font-semibold uppercase tracking-wide text-on-accent transition-colors duration-100 hover:bg-accent-dark active:translate-y-px motion-reduce:transition-none">
          Request a Free Quote
        </Link>
      </div>
    </section>
  )
}
