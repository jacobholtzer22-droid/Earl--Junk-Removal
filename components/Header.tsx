import Link from 'next/link'
import { config } from '@/lib/config'
import { getImage, hasImage } from '@/lib/images'
import Phone from './Phone'

/**
 * `short` is the label a phone gets; `label` is the full one. `mobile: false`
 * keeps an item out of the phone nav entirely.
 *
 * The phone row has to FIT at 360px with nothing to scroll sideways. Six full
 * labels came to 508px at 390px wide, so the row scrolled and the items past
 * the fold were a guess away. Referrals is the one that leaves: it is the only
 * link aimed at contractors rather than customers, and it is already in the
 * footer on every page, so nothing becomes unreachable. Home stays first.
 */
const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/areas', label: 'Service Areas', short: 'Areas' },
  { href: '/about', label: 'About' },
  { href: '/referral-program', label: 'Referrals', mobile: false },
  { href: '/contact', label: 'Contact' },
]
const MOBILE_NAV = NAV.filter((i) => i.mobile !== false)

export default function Header() {
  const logoName = config.images.logo
  /*
   * The supplied lockup, whole and unaltered.
   *
   * It already contains the words HOUSTON WASTE REMOVAL, so the separate
   * wordmark text that used to sit beside it is gone, and so is the "by EJC
   * Demo Junk & Haul" line. EJC has not left the site: it is in the footer
   * attribution, on the about page, in the "same company" FAQ, in llms.txt and
   * as schema.org alternateName.
   *
   * HEIGHT IS SET BY LEGIBILITY, and it was measured rather than guessed.
   *
   * The lockup is all but square, 1222x1237, and stacks a skyline and a truck
   * above the name, so "WASTE REMOVAL" is only about 5% of the artwork's
   * height. Rendering the logo at 60px put that line at roughly 3px and it was
   * not readable at all. The same file was rendered at 60, 80, 100, 120 and
   * 140px and looked at: 100px is the first size where both words resolve.
   *
   * So 100px it is, and the header is taller than it was. That is the trade
   * the brief allows, and it is the honest one: a logo nobody can read is not
   * a logo. The tagline inside the artwork stays illegible at every size and
   * is not meant to be read.
   *
   * Even at 112px on a 3x screen this draws from 336px of a 1222px source.
   */
  const logo = logoName && hasImage(logoName) ? getImage(logoName) : null

  return (
    /*
     * The scroll behaviour lives in app/globals.css and changes the BORDER and
     * BACKGROUND only. Nothing here changes height, padding or font size on
     * scroll, because any of those would reflow the page under the reader and
     * put CLS above zero. See the `header-scrolled` rules in globals.css.
     */
    <header
      data-site-header
      /*
        STICKY ON DESKTOP ONLY.
        
        The lockup has to be 100px tall before its wordmark reads, which makes
        the mobile header 161px. Sticky, with the 61px call bar at the bottom,
        that is 30% of a 740px phone permanently occupied by chrome before a
        word of content. The old 118px header was 24% and already generous.
        
        Nothing is lost by releasing it: MobileCallBar is fixed to the bottom
        of every page except /contact and already carries both the phone
        number and the quote link, which is the whole reason a header is kept
        on screen. The nav scrolls away like the rest of the page, which is
        ordinary behaviour on a phone.
      */
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
              className="h-[100px] w-auto lg:h-[112px]"
              decoding="async"
            />
          ) : (
            <span className="whitespace-nowrap font-heading text-lg font-bold uppercase tracking-tight text-primary-dark">
              {config.displayName}
            </span>
          )}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap font-heading text-sm font-semibold uppercase tracking-wide text-ink transition-colors duration-100 hover:text-accent-dark motion-reduce:transition-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Phone className="hidden font-heading text-base font-bold text-primary-dark xl:inline" />
          <a
            href={`tel:${config.phone}`}
            className="hidden whitespace-nowrap bg-accent px-4 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-on-accent transition-colors duration-100 hover:bg-accent-dark active:translate-y-px motion-reduce:transition-none sm:inline-block sm:px-5"
          >
            Call now
          </a>
        </div>
      </div>

      {/*
        data-safe-center, NOT justify-center.
        
        Plain centring on a scroller that overflows pushes the first item into
        negative space: at 390px this row was 449px wide, scrollLeft was 0, and
        the left edge of "Home" sat at -42px, which is unreachable by scrolling
        in either direction. The item was on the page and no user could ever
        get to it. It appeared the moment Home and Service Areas were added.
        
        The fix is `justify-content: safe center`, where the `safe` keyword
        means "centre only while that loses nothing, and align to the start
        when it would": the whole bug in one word. A browser too old to know it
        drops the declaration and falls back to flex-start, which is also
        reachable, so there is no bad outcome either way.
        
        It is a data attribute and a rule in globals.css rather than a utility
        because Tailwind silently emits NOTHING for justify-[safe_center]: the
        class lands in the HTML, no CSS is generated for it, and the row goes
        on quietly losing its first item. Verified by grepping the built CSS.
      */}
      <nav
        aria-label="Main mobile"
        data-safe-center
        className="flex gap-x-1.5 overflow-x-auto border-t border-line px-2.5 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MOBILE_NAV.map((item) => (
          /*
            py-3 on the LINK, not on the row.
            
            The row carried the padding and the links were 21px tall: under
            WCAG 2.2 target-size minimum of 24px, and less than half a thumb.
            Moving the same padding inside the anchor makes each one 45px and
            costs the sticky header 4px of height, because the row was already
            41px tall and was simply mostly not clickable.
            
            13px with no letter-spacing, where the desktop row is 14px and
            tracked: five labels have to fit 360px minus the gutters, and
            tracking is the cheapest width to give back. overflow-x-auto stays
            as a safety net for a future label, not because anything scrolls
            today; data-safe-center keeps the first item reachable if it ever
            does.
          */
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap px-1 py-3 font-heading text-[13px] font-semibold uppercase text-ink transition-colors duration-100 hover:text-accent-dark motion-reduce:transition-none"
          >
            {item.short ?? item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
