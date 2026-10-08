import { Archivo, Barlow } from 'next/font/google'

/**
 * The two typefaces, loaded through next/font so they are self-hosted and
 * subset at build time.
 *
 * Archivo for display, replacing Oswald. The old pairing was chosen to echo
 * the compressed "EJC" lettering of the previous badge. The new wordmark is
 * the opposite shape: HOUSTON WASTE REMOVAL is set WIDE and heavy, and Oswald
 * next to it looked like a different company's type.
 *
 * It is loaded as the VARIABLE family with the width axis, not Archivo Black,
 * and that is the load-bearing part. Archivo's `wdth` runs 62 to 125, so a
 * long H1 can be narrowed a few percent instead of wrapping to an orphan or
 * running off a 360px screen. A wider display face changes every line break on
 * the site, and the axis is how those get fixed with type rather than by
 * rewriting headlines to fit, which would be a copy change.
 *
 * Use the `.h-narrow` helper in globals.css rather than setting
 * font-variation-settings inline, so the narrowing is in one place.
 *
 * Barlow for body, unchanged. It is a slightly squared grotesk from the same
 * industrial lineage and it already matched the body text on the client's own
 * business cards. Two weights per face, no more.
 */
export const headingFont = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-heading',
  display: 'swap',
})

export const bodyFont = Barlow({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})
