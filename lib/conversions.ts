import { config } from '@/lib/config'

type Gtag = (command: 'event', name: string, params: Record<string, unknown>) => void

/**
 * Fire one Google Ads conversion. The only place in the codebase that calls
 * gtag for a conversion.
 *
 * THREE WAYS THIS DOES NOTHING, all of them silent and all of them normal:
 *
 *   no googleAdsId     the site has no Ads account
 *   no label           that event is not configured yet, which is the state
 *                      this ships in
 *   no window.gtag     the script has not loaded, or an ad blocker ate it,
 *                      which is a large minority of real traffic
 *
 * Silent matters. A console warning on every tel: click for every visitor
 * with uBlock installed is noise that trains people to ignore the console,
 * and it tells an attacker nothing useful either. The proof script asserts
 * the call count rather than reading logs.
 *
 * Returns whether it fired, which is what makes it testable.
 */
export function fireConversion(kind: 'contact' | 'call'): boolean {
  const id = config.tracking.googleAdsId
  const label = config.tracking.conversionLabels[kind]
  if (!id || !label) return false

  const gtag = (globalThis as { gtag?: Gtag }).gtag
  if (typeof gtag !== 'function') return false

  try {
    gtag('event', 'conversion', { send_to: `${id}/${label}` })
    return true
  } catch {
    // A conversion tag must never break a phone call or a form submission.
    return false
  }
}
