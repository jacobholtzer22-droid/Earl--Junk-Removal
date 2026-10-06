import { Barlow, Oswald } from 'next/font/google'

/**
 * The two typefaces for this site, loaded through next/font so they are
 * self-hosted and subset at build time.
 *
 * Oswald for display: condensed, heavy, and compressed in the same way the
 * "EJC" lettering in the logo is compressed, so the headline and the badge look
 * like they come from the same shop. It is the highway-sign / shop-sign voice
 * this trade actually speaks.
 *
 * Barlow for body: a slightly squared grotesk from the same industrial
 * lineage, so it sits under Oswald without competing with it. Two weights per
 * face, no more.
 */
export const headingFont = Oswald({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export const bodyFont = Barlow({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})
