import Link from 'next/link'
import { config } from '@/lib/config'
import { getImage, hasImage } from '@/lib/images'
import Phone from './Phone'

const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/referral-program', label: 'Referrals' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const logoName = config.images.logo
  // The supplied logo is a 225px screenshot, so it is NEVER rendered above its
  // native size. 40px tall in the bar is roughly 1/5 of what the file can carry
  // even at 2x, which is why it stays crisp. A vector file would lift this cap;
  // see CLIENT-TODO item 15.
  const logo = logoName && hasImage(logoName) ? getImage(logoName) : null

  return (
    <header className="sticky top-0 z-40 border-b-2 border-primary-dark bg-surface">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          {logo && (
            <img
              src={logo.src}
              srcSet={logo.srcSet}
              sizes="40px"
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
              className="h-10 w-auto"
              decoding="async"
            />
          )}
          <span className="font-heading text-lg font-bold uppercase leading-none tracking-tight text-primary-dark sm:text-xl">
            {config.displayName}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-heading text-sm font-semibold uppercase tracking-wide text-ink hover:text-accent-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Phone className="hidden font-heading text-base font-bold text-primary-dark lg:inline" />
          <a
            href={`tel:${config.phone}`}
            className="hidden bg-accent px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-on-accent hover:bg-accent-dark sm:inline-block"
          >
            Call now
          </a>
        </div>
      </div>

      <nav
        aria-label="Main mobile"
        className="flex justify-center gap-6 border-t border-line px-4 py-2.5 md:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-heading text-sm font-semibold uppercase tracking-wide text-ink hover:text-accent-dark"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
