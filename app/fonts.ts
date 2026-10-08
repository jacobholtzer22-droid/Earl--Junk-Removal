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
 * WEIGHT AXIS ONLY. It briefly carried the width axis too, so long headlines
 * could be narrowed a few percent rather than wrapping badly, and that cost
 * 87kB against 34kB for this. 53kB of font, above the fold, to shave a few
 * percent off two headlines is not a trade worth making.
 *
 * Measured, because the three options are not obvious: wdth+wght is 87kB,
 * wght-only is 34kB, and static 600+700 is BYTE-IDENTICAL to wght-only, same
 * build hash, because next/font resolves both to the same variable file. So
 * the choice between the last two is about intent, not size. Only 600 and 700
 * are used anywhere on the site.
 *
 * Long headlines are handled by text-wrap: balance and a size clamp in
 * globals.css instead. Neither touches a word of copy.
 *
 * Barlow for body, unchanged. It is a slightly squared grotesk from the same
 * industrial lineage and it already matched the body text on the client's own
 * business cards. Two weights per face, no more.
 */
export const headingFont = Archivo({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-heading',
  display: 'swap',
})

export const bodyFont = Barlow({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})
