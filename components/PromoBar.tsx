import { config } from '@/lib/config'

/**
 * The $50 off first service offer, at the very top of every page.
 *
 * Stated exactly as the client stated it and no further: no minimum, no expiry,
 * no "cannot be combined", because none of those were supplied and inventing
 * fine print on a discount is inventing a term of business. See CLIENT-TODO
 * item 8.
 */
export default function PromoBar() {
  return (
    <div className="bg-accent text-on-accent">
      {/*
        Short on phones. The full sentence wrapped to two lines at 390px and ate
        roughly an eighth of the first screen before the visitor saw anything.
      */}
      <p className="mx-auto max-w-page px-4 py-2 text-center font-heading text-sm font-semibold uppercase tracking-[0.12em] sm:px-6">
        <span className="sm:hidden">$50 off your first service</span>
        <span className="hidden sm:inline">$50 off your first service with {config.displayName}</span>
      </p>
    </div>
  )
}
