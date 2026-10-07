import Link from 'next/link'
import { config } from '@/lib/config'
import { getImage, hasImage } from '@/lib/images'
import Phone from './Phone'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/areas', label: 'Service Areas' },
  { href: '/about', label: 'About' },
  { href: '/referral-program', label: 'Referrals' },
  { href: '/contact', label: 'Contact' },
]

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

      <nav
        aria-label="Main mobile"
        className="flex justify-center gap-x-5 gap-y-1 overflow-x-auto border-t border-line px-4 py-2.5 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 whitespace-nowrap font-heading text-sm font-semibold uppercase tracking-wide text-ink transition-colors duration-100 hover:text-accent-dark motion-reduce:transition-none"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
