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
  // The supplied logo is a 225px screenshot, so it is NEVER rendered above its
  // native size. 40px tall in the bar is roughly a fifth of what the file can
  // carry even at 2x, which is why it stays crisp. A vector file would lift
  // this cap; see CLIENT-TODO item 15.
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
      className="sticky top-0 z-40 border-b-2 border-primary-dark bg-surface transition-[background-color,border-color] duration-150 motion-reduce:transition-none"
    >
      <div className="mx-auto flex max-w-page items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        {/*
          The lockup: the EJC badge exactly as supplied, the brand wordmark, and
          the operating company underneath.

          THE WORDMARK NEVER TRUNCATES, at any width. `min-w-0` and `truncate`
          are deliberately absent from it. If something has to give on a narrow
          screen it is the "by EJC Demo Junk & Haul" line, which is hidden under
          380px, because the badge already says EJC and the attribution is
          repeated in the footer, on the about page, in a homepage FAQ and in
          the schema.
        */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {logo && (
            <img
              src={logo.src}
              srcSet={logo.srcSet}
              sizes="40px"
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
              className="h-9 w-auto shrink-0 sm:h-10"
              decoding="async"
            />
          )}
          <span className="flex flex-col leading-none">
            <span className="whitespace-nowrap font-heading text-[15px] font-bold uppercase tracking-tight text-primary-dark min-[380px]:text-lg sm:text-xl">
              {config.displayName}
            </span>
            {config.alternateName && (
              <span className="mt-1 hidden whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.08em] text-muted min-[380px]:block sm:text-[11px]">
                by {config.alternateName}
              </span>
            )}
          </span>
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
        className="flex gap-x-2 overflow-x-auto border-t border-line px-3 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
