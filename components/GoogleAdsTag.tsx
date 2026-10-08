import Script from 'next/script'
import { config } from '@/lib/config'

/**
 * The Google Ads base tag, loaded once site-wide from the root layout.
 *
 * Google Ads only. No Tag Manager, no GA4, no third tag: each one is another
 * request, another cookie banner argument, and another thing that can break
 * a page nobody is watching.
 *
 * afterInteractive, because a conversion tag has no business competing with
 * the page for the main thread. The visitor sees the site first.
 *
 * Renders NOTHING when config.tracking.googleAdsId is empty, so a client site
 * that has no Ads account ships no script, no dataLayer and no cookie.
 */
export default function GoogleAdsTag() {
  const id = config.tracking.googleAdsId
  if (!id) return null
  return (
    <>
      <Script id="gtag-src" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  )
}
