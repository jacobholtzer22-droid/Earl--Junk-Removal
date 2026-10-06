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
      <p className="mx-auto max-w-page px-4 py-2 text-center font-heading text-sm font-semibold uppercase tracking-[0.12em] sm:px-6">
        $50 off your first service with {config.displayName}
      </p>
    </div>
  )
}
