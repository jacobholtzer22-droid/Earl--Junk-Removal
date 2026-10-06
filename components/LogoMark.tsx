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
  const name = config.images.logo
  const logo = name && hasImage(name) ? getImage(name) : null
  if (!logo) return null
  return (
    <div className={`flex items-center justify-center bg-primary p-10 ${className}`}>
      <img
        src={logo.src}
        srcSet={logo.srcSet}
        sizes="224px"
        width={logo.width}
        height={logo.height}
        alt={logo.alt}
        className="h-auto w-full max-w-[224px]"
        decoding="async"
      />
    </div>
  )
}
