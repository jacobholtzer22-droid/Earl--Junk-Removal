import { config } from '@/lib/config'
import theme from '@/theme'
import Img from './Img'
import TrustChips from './TrustChips'

/**
 * Homepage hero. Owns the page's single <h1>. Every word comes from config.
 *
 * MOBILE IS CALL-FIRST. On a phone the primary action is the amber tap-to-call
 * button; the quote link is the secondary one. On desktop the order flips,
 * because somebody at a keyboard is more likely to fill a form than to dial.
 *
 * The quote button is an ANCHOR to #quote, not a second form. The sealed
 * ContactForm uses fixed element ids, so rendering it twice on the homepage
 * would duplicate every id and break every label binding. See QuoteSection.
 */
export default function Hero() {
  /**
   * "Houston, TX" is held together with a non-breaking space so the state can
   * never be orphaned onto its own line, which is exactly what happened at
   * 1440: "JUNK REMOVAL IN HOUSTON," / "TX".
   */
  const h1 = `${config.primaryService.name} in ${config.primaryCity},\u00A0${config.primaryState}`
  const hero = config.images.hero

  const actions = (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Mobile: call is first in the DOM and visually primary. */}
      <a
        href={`tel:${config.phone}`}
        className="bg-accent px-7 py-4 text-center font-heading text-lg font-bold uppercase tracking-wide text-on-accent transition-colors duration-100 hover:bg-accent-dark active:translate-y-px motion-reduce:transition-none sm:order-2 sm:px-6 sm:py-3.5 sm:text-base"
      >
        Call {config.phoneDisplay}
      </a>
      <a
        href="#quote"
        className="border-2 border-on-primary px-7 py-4 text-center font-heading text-base font-semibold uppercase tracking-wide text-on-primary transition-colors duration-100 hover:bg-on-primary hover:text-primary-dark active:translate-y-px motion-reduce:transition-none sm:order-1 sm:py-3"
      >
        Get a free estimate
      </a>
    </div>
  )

  if (theme.heroVariant === 'full-bleed' && hero) {
    return (
      <section className="relative isolate flex min-h-[82vh] items-end overflow-hidden bg-primary-dark text-on-primary">
        {/*
          object-position favours the upper third. At desktop the hero box is
          about 1.9:1 against a 3:2 photograph, so a centred cover crop throws
          away the bright sky and leaves only the dark tree mass, which is why
          the hero read as a black field at 1440 while looking fine at 390.
        */}
        <Img
          name={hero}
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 h-full w-full object-cover object-[center_28%]"
        />
        {/*
          Heavy scrim. The headline has to clear AA against the brightest part
          of the photograph, not the average, so this is darker than it looks
          like it needs to be.
        */}
        {/*
          Scrim weights: light at the top so the photograph is actually
          readable, heavy from 45% down where the headline, body copy and chips
          sit. At 0.55 across the top the picture read as a flat black field,
          which wasted the one image on the page that explains the service.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(180deg, rgb(10 11 13 / 0.30) 0%, rgb(10 11 13 / 0.52) 45%, rgb(10 11 13 / 0.90) 100%)',
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-page px-4 pb-14 pt-36 sm:px-6 md:pb-20">
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            {config.displayName}
          </p>
          <h1 className="mt-5 max-w-4xl font-heading text-hero font-bold uppercase">{h1}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-90 md:text-xl">{config.tagline}</p>
          <div className="mt-8">
            <TrustChips dark />
          </div>
          {actions}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-primary-dark text-on-primary">
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-5 md:py-28">
        <div className="md:col-span-3">
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            {config.displayName}
          </p>
          <h1 className="mt-5 font-heading text-hero font-bold uppercase">{h1}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-90 md:text-xl">{config.tagline}</p>
          <div className="mt-8">
            <TrustChips dark />
          </div>
          {actions}
        </div>
        {hero && (
          <div className="md:col-span-2">
            <Img name={hero} priority sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5] h-auto w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
