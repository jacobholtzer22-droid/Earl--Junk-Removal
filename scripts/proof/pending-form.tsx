/**
 * PROOF THAT THE PRE-LAUNCH FORM GATE WORKS, IN BOTH DIRECTIONS.
 *
 * This renders the REAL components/PendingFormGate.tsx wrapping the REAL,
 * sealed components/ContactForm.tsx into a jsdom document, fills the required
 * fields, fires a genuine submit event, and counts calls to a mocked fetch.
 * Nothing is simulated except the network and the browser.
 *
 * Run both directions with:   npm run proof:form
 *
 *   a. businessSlug ''          -> 0 fetch calls, and the notice is rendered
 *   b. businessSlug 'test-slug' -> exactly 1 fetch call, to the frozen
 *                                  CONTACT_ENDPOINT, with the payload the
 *                                  platform expects and nothing added
 *
 * Direction (b) matters as much as (a). A gate that blocks everything forever
 * would also pass (a), and would lose every lead the day the slug goes in.
 *
 * Direction (b) is run by scripts/proof/run.mjs with
 * scripts/proof/tsconfig.slug.json, which maps `@/site.config` to a fixture
 * whose only difference is a non-empty slug. site.config.ts is never edited.
 */
import { JSDOM } from 'jsdom'

async function main() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://ejc-demo-junk-haul.vercel.app/contact',
    pretendToBeVisual: true,
  })
  const g = globalThis as Record<string, unknown>
  g.window = dom.window
  g.document = dom.window.document
  // globalThis.navigator is getter-only on Node 24, so it has to be redefined
  // rather than assigned.
  Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true, writable: true })
  g.HTMLElement = dom.window.HTMLElement
  g.HTMLFormElement = dom.window.HTMLFormElement
  g.Event = dom.window.Event
  g.FormData = dom.window.FormData
  g.Node = dom.window.Node
  g.MutationObserver = dom.window.MutationObserver
  g.requestAnimationFrame = (cb: FrameRequestCallback) => dom.window.setTimeout(() => cb(Date.now()), 0)
  g.cancelAnimationFrame = (id: number) => dom.window.clearTimeout(id)
  g.IS_REACT_ACT_ENVIRONMENT = true

  interface FetchCall {
    url: string
    method?: string
    body?: string
  }
  const calls: FetchCall[] = []
  g.fetch = async (url: unknown, init?: { method?: string; body?: string }) => {
    calls.push({ url: String(url), method: init?.method, body: init?.body })
    return { ok: true, status: 200, json: async () => ({}) }
  }

  const React = (await import('react')).default
  const { createRoot } = await import('react-dom/client')
  const { act } = await import('react')
  const PendingFormGate = (await import('../../components/PendingFormGate')).default
  const { config } = await import('../../lib/config')
  const { CONTACT_ENDPOINT, HONEYPOT_FIELD } = await import('../../lib/config-schema')

  const slug = config.businessSlug
  const expectPending = slug === ''
  const label = expectPending ? "a. businessSlug '' (pre-launch)" : `b. businessSlug '${slug}' (live)`

  const container = dom.window.document.getElementById('root') as HTMLElement
  const root = createRoot(container)
  await act(async () => {
    root.render(React.createElement(PendingFormGate))
  })

  const form = container.querySelector('form')
  if (!form) {
    console.error('FAIL: no <form> rendered at all. Checks 5 and 6 depend on it being present.')
    process.exit(1)
  }

  // Fill what the sealed form requires before it will reach fetch.
  const setValue = (selector: string, value: string) => {
    const el = container.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | null
    if (!el) throw new Error(`missing field ${selector}`)
    const proto = el instanceof dom.window.HTMLTextAreaElement ? dom.window.HTMLTextAreaElement : dom.window.HTMLInputElement
    const setter = Object.getOwnPropertyDescriptor(proto.prototype, 'value')?.set
    setter?.call(el, value)
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  }
  setValue('#contact-name', 'Test Person')
  setValue('#contact-phone', '7132919440')
  setValue('#contact-message', 'Need a garage cleared out.')

  await act(async () => {
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }))
  })
  await act(async () => {
    await new Promise((r) => setTimeout(r, 20))
  })

  const bodyText = container.textContent ?? ''
  const noticeShown = bodyText.includes('Online requests are not connected yet')

  const failures: string[] = []
  console.log(`\n--- ${label} ---`)
  console.log(`  form rendered:            yes`)
  console.log(`  fetch calls:              ${calls.length}`)

  if (expectPending) {
    if (calls.length !== 0) failures.push(`expected 0 fetch calls, got ${calls.length}`)
    if (!noticeShown) failures.push('expected the "not connected yet" notice to render, it did not')
    console.log(`  "not connected" notice:   ${noticeShown ? 'rendered' : 'MISSING'}`)
    console.log(`  verdict:                  ${failures.length ? 'FAIL' : 'no request left the page'}`)
  } else {
    if (calls.length !== 1) failures.push(`expected exactly 1 fetch call, got ${calls.length}`)
    if (noticeShown) failures.push('the pre-launch notice rendered even though the slug is set')
    const call = calls[0]
    if (call) {
      const payload = JSON.parse(call.body ?? '{}') as Record<string, unknown>
      const keys = Object.keys(payload).sort()
      // `email` is sent as `email || undefined`, and JSON.stringify drops an
      // undefined value, so a blank email means the key is legitimately absent.
      // These are the keys that must always be present, plus the only key that
      // is allowed to be missing.
      const requiredKeys = ['businessSlug', HONEYPOT_FIELD, 'message', 'name', 'phone', 'smsConsent'].sort()
      const allowedKeys = [...requiredKeys, 'email'].sort()
      console.log(`  endpoint:                 ${call.url}`)
      console.log(`  method:                   ${call.method}`)
      console.log(`  payload keys:             ${keys.join(', ')}`)
      console.log(`  (email omitted when blank: JSON.stringify drops undefined)`)
      console.log(`  businessSlug sent:        ${JSON.stringify(payload.businessSlug)}`)
      console.log(`  smsConsent sent:          ${JSON.stringify(payload.smsConsent)}`)
      if (call.url !== CONTACT_ENDPOINT) failures.push(`endpoint is "${call.url}", expected "${CONTACT_ENDPOINT}"`)
      if (call.method !== 'POST') failures.push(`method is ${call.method}, expected POST`)
      const missing = requiredKeys.filter((k) => !keys.includes(k))
      const extra = keys.filter((k) => !allowedKeys.includes(k))
      if (missing.length) failures.push(`payload is missing required key(s): ${missing.join(', ')}`)
      if (extra.length) failures.push(`payload gained key(s) the platform does not parse: ${extra.join(', ')}`)
      if (payload.businessSlug !== slug) failures.push(`businessSlug sent as ${JSON.stringify(payload.businessSlug)}`)
      if (payload.smsConsent !== false) failures.push('smsConsent was not false on an unchecked box')
      if (payload.name !== 'Test Person') failures.push(`name sent as ${JSON.stringify(payload.name)}`)
    }
    console.log(`  verdict:                  ${failures.length ? 'FAIL' : 'exactly one unchanged request, pure pass-through'}`)
  }

  if (failures.length) {
    for (const f of failures) console.error(`  FAILURE: ${f}`)
    process.exit(1)
  }

}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
