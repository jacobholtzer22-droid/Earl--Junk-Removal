import { config } from '@/lib/config'
import { getImage, hasImage } from '@/lib/images'

/**
 * The logo on a dark panel, used where a photograph would be read as a claim.
 *
 * The About page and the homepage's "Run by Earl" teaser are about Earl and his
 * company rather than about a service, so any image in those slots reads as his
 * premises, his truck or his crew. Stock cannot go there. This is what goes
 * instead: his own mark, at a size the supplied artwork can actually carry.
 *
 * THE SIZE CAP IS LOAD-BEARING. The logo came from a 225px screenshot. The
 * panel is capped at 224px wide so the mark is never rendered larger than its
 * source, which is why it stays crisp instead of going soft. A vector file
 * would lift the cap; see CLIENT-TODO item 15.
 */
export default function LogoMark({ className = '' }: { className?: string }) {
  /*
   * THE KNOCKOUT VERSION, because this panel is dark.
   *
   * It used the default logo and the default logo has black HOUSTON
   * lettering, so on the bg-primary panel the name disappeared completely and
   * only the truck and the green arc survived. A lockup is artwork: it cannot
   * be inverted with CSS, which is why the brand ships two files and why
   * picking the wrong one fails silently rather than looking wrong in code.
   */
  const name = config.images.logoOnDark ?? config.images.logo
  const logo = name && hasImage(name) ? getImage(name) : null
  if (!logo) return null
  return (
    <div className={`flex items-center justify-center bg-primary p-10 ${className}`}>
      {/*
        DECORATIVE, and declared as such.

        The header already renders this same badge with a full description, and
        on both pages that use this panel the surrounding prose names the brand,
        the operating company and the legal name in text. A second described
        copy means a screen reader reads "a dump truck above the letters EJC on
        a black circular badge" twice on one page, which is noise, not access.
        alt="" plus aria-hidden is WCAG H67 and is what verify.ts check 11
        exempts; it will not accept either half on its own.
      */}
      <img
        src={logo.src}
        srcSet={logo.srcSet}
        sizes="224px"
        width={logo.width}
        height={logo.height}
        alt=""
        aria-hidden="true"
        className="h-auto w-full max-w-[224px]"
        decoding="async"
        /*
          Lazy, because this panel is below the fold on both pages that use
          it: the about page's aside and the homepage teaser. Eager, the white
          lockup put 42kB on the critical path of the homepage to paint
          something nobody has scrolled to yet.
        */
        loading="lazy"
      />
    </div>
  )
}
