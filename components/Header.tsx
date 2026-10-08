import Link from 'next/link'
import { config } from '@/lib/config'
import { getImage, hasImage } from '@/lib/images'
import MobileMenu from './MobileMenu'
import Phone from './Phone'

/**
 * One nav list, used by the desktop bar and by the phone menu.
 *
 * The phone used to get a shortened version of this with Referrals dropped,
 * because five full labels were the most that fitted 360px without scrolling
 * sideways. A menu button removes that constraint entirely: the panel is a
 * vertical list with as much room as it needs, so the phone now gets the same
 * six items with their full labels.
 */
const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/areas', label: 'Service Areas' },
  { href: '/about', label: 'About' },
  { href: '/referral-program', label: 'Referral Program' },
  { href: '/contact', label: 'Contact' },
]
const SERVICE_LINKS = config.services.map((s) => ({ href: `/services/${s.slug}`, label: s.name }))

export default function Header() {
  const logoName = config.images.logo
  /*
   * The supplied lockup, whole and unaltered.
   *
   * It already contains the words HOUSTON WASTE REMOVAL, so there is no
   * separate wordmark beside it. EJC has not left the site: it is in the
   * footer attribution, on the about page, in the "same company" FAQ, in
   * llms.txt and as schema.org alternateName.
   *
   * HEIGHT IS SET BY LEGIBILITY, and it was measured. The lockup is all but
   * square and stacks a skyline and a truck above the name, so "WASTE REMOVAL"
   * is about 5% of the artwork's height. Rendered at 60, 80, 100, 120 and
   * 140px and looked at: 100px is the first size where both words resolve.
   */
  const logo = logoName && hasImage(logoName) ? getImage(logoName) : null

  return (
    /*
     * STICKY ON DESKTOP ONLY. On a phone the header is one row and the fixed
     * call bar already carries the phone number and the quote link, so there
     * is nothing a sticky header would add that is not already on screen.
     */
    <header
      data-site-header
      className="z-40 border-b-2 border-primary-dark bg-surface transition-[background-color,border-color] duration-150 motion-reduce:transition-none lg:sticky lg:top-0"
    >
      <div className="mx-auto flex max-w-page items-center justify-between gap-3 px-4 py-1.5 sm:gap-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${config.displayName} home`}>
          {logo ? (
            <img
              src={logo.src}
              srcSet={logo.srcSet}
              sizes="(min-width: 1024px) 112px, 100px"
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
              className="h-[72px] w-auto sm:h-[88px] lg:h-[112px]"
              decoding="async"
            />
          ) : (
            <span className="whitespace-nowrap font-heading text-lg font-bold uppercase tracking-tight text-primary-dark">
              {config.displayName}
            </span>
          )}
        </Link>

        {/*
          DESKTOP NAV. The Services submenu is CSS only: a <ul> inside the
          wrapper, revealed by :hover and, critically, by :focus-within.

          No JavaScript is involved, which means all thirteen service links are
          in the HTML of every page whether or not a script runs, and a
          keyboard user reaches them by tabbing: focus landing on the first
          submenu link opens the panel because focus is now within the parent.
          A scripted menu would have to re-implement that and would be one
          hydration failure away from a nav nobody can open.
        */}
        <nav aria-label="Main" className="hidden items-center gap-5 lg:flex xl:gap-6">
          {NAV.map((item) =>
            item.label === 'Services' ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 whitespace-nowrap py-2 font-heading text-sm font-semibold uppercase tracking-wide text-ink transition-colors duration-100 hover:text-accent-dark motion-reduce:transition-none"
                >
                  {item.label}
                  <span aria-hidden="true" className="text-[9px] leading-none">&#9660;</span>
                </Link>
                <ul className="invisible absolute left-0 top-full z-50 w-72 border-2 border-primary-dark bg-surface py-2 opacity-0 transition-opacity duration-100 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none">
                  {SERVICE_LINKS.map((sl) => (
                    <li key={sl.href}>
                      <Link href={sl.href} className="block px-4 py-2 text-sm text-ink hover:bg-bg hover:text-accent-dark">
                        {sl.label}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-1 border-t border-line pt-1">
                    <Link href="/services" className="block px-4 py-2 text-sm font-semibold text-accent-dark hover:bg-bg">
                      All services
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap py-2 font-heading text-sm font-semibold uppercase tracking-wide text-ink transition-colors duration-100 hover:text-accent-dark motion-reduce:transition-none"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Phone className="hidden font-heading text-base font-bold text-primary-dark xl:inline" />
          {/*
            TWO BUTTONS on desktop, which is the reference's pattern: the call
            and the quote side by side, the quote carrying the fill so it is
            the loudest thing in the bar. The reference's second button is
            "Send us a text"; ours is a Text Us button only when
            config.acceptsTexts is true, which is the client's decision and has
            not been made yet.
          */}
          {config.acceptsTexts && (
            <a
              href={`sms:${config.phone}`}
              className="hidden whitespace-nowrap border-2 border-primary-dark px-4 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-primary-dark transition-colors duration-100 hover:bg-primary-dark hover:text-on-primary motion-reduce:transition-none lg:inline-block"
            >
              Text Us
            </a>
          )}
          <a
            href={`tel:${config.phone}`}
            className="hidden whitespace-nowrap border-2 border-primary-dark px-4 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-primary-dark transition-colors duration-100 hover:bg-primary-dark hover:text-on-primary motion-reduce:transition-none lg:inline-block"
          >
            Call Now
          </a>
          <Link
            href="/contact"
            className="hidden whitespace-nowrap bg-accent px-4 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-on-accent transition-colors duration-100 hover:bg-accent-dark active:translate-y-px motion-reduce:transition-none lg:inline-block"
          >
            Get a Free Quote
          </Link>
          <MobileMenu items={NAV} services={SERVICE_LINKS} />
        </div>
      </div>
    </header>
  )
}
