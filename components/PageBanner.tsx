import { config } from '@/lib/config'
import { getImage, hasImage } from '@/lib/images'

/**
 * The photo band under an interior page's header, giving service pages the
 * same rhythm as the homepage: banner, opening answer, content, three steps,
 * questions, call to action.
 *
 * It takes the image NAME rather than a service, because the contact and
 * referral pages want one too and neither is a service.
 *
 * AREA PAGES DELIBERATELY DO NOT USE THIS. A photograph under a heading that
 * reads "Junk Removal in Katy, TX" is read as a job in Katy, and there have
 * been no jobs in Katy that anyone can point to. See seo/AREA-SOURCES.md.
 *
 * A missing image falls back to the brand-green block carrying the page's
 * name, which is a finished state rather than a gap. Only appliance removal
 * needs it today.
 */
export default function PageBanner({ image, label }: { image: string | null; label: string }) {
  const img = image && hasImage(image) ? getImage(image) : null
  if (!img) {
    return (
      <div className="flex h-40 items-end border-y-2 border-primary-dark bg-accent px-4 py-5 sm:h-52 sm:px-6">
        <span className="mx-auto w-full max-w-page font-heading text-2xl font-bold uppercase tracking-tight text-on-accent md:text-3xl">
          {label}
        </span>
      </div>
    )
  }
  return (
    <div className="border-y-2 border-primary-dark">
      <img
        src={img.src}
        srcSet={img.srcSet}
        sizes="100vw"
        width={img.width}
        height={img.height}
        alt={img.alt}
        decoding="async"
        className="h-48 w-full object-cover sm:h-64 lg:h-80"
      />
    </div>
  )
}

/** The service whose banner this is, resolved from config by slug. */
export function serviceBannerImage(slug: string): string | null {
  return config.services.find((s) => s.slug === slug)?.image ?? null
}
