/**
 * PROOF THAT CONVERSION TRACKING FIRES EXACTLY WHEN IT SHOULD, AND NEVER ELSE.
 *
 * Renders the REAL components/ConversionTracking.tsx alongside the REAL,
 * sealed components/ContactForm.tsx into a jsdom document, fills the form,
 * fires genuine events, and counts calls to a mocked fetch and a gtag spy.
 * Nothing is simulated except the network and gtag itself.
 *
 * Run both label states with:  npm run proof:conversions
 *
 * The LABELS-EMPTY direction matters as much as the labels-set one. Tracking
 * that fired on an empty label would send conversions to "AW-123/" the moment
 * this shipped, which is the state the site is live in right now.
 */
import { JSDOM } from 'jsdom'

type Call = { name: string; params: Record<string, unknown> }

async function main() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://www.houstonwasteremoval.com/contact',
    pretendToBeVisual: true,
  })
  const g = globalThis as Record<string, unknown>
  g.window = dom.window
  g.document = dom.window.document
  // navigator is getter-only on Node 24; defineProperty is the only way in.
  Object.defineProperty(g, 'navigator', { value: dom.window.navigator, configurable: true })
  g.HTMLElement = dom.window.HTMLElement
  g.HTMLFormElement = dom.window.HTMLFormElement
  g.Event = dom.window.Event
  g.MouseEvent = dom.window.MouseEvent
  // jsdom's FormData, not Node's. Node's undici FormData refuses a jsdom
  // <form> and the sealed form builds one from its own element.
  g.FormData = dom.window.FormData
  g.Node = dom.window.Node
  g.MutationObserver = dom.window.MutationObserver
  g.requestAnimationFrame = (cb: FrameRequestCallback) => dom.window.setTimeout(() => cb(0), 0)
  g.cancelAnimationFrame = (id: number) => dom.window.clearTimeout(id)

  const React = (await import('react')).default
  const { act } = await import('react')
  const { createRoot } = await import('react-dom/client')
  g.IS_REACT_ACT_ENVIRONMENT = true

  const { config } = await import('@/lib/config')
  const ContactForm = (await import('@/components/ContactForm')).default
  const ConversionTracking = (await import('@/components/ConversionTracking')).default

  const labels = config.tracking.conversionLabels
  const mode = labels.contact || labels.call ? 'LABELS SET' : 'LABELS EMPTY'
  console.log(`\n=== ${mode}  (contact "${labels.contact}", call "${labels.call}")`)

  /* ---------------- spies ---------------- */
  let gtagCalls: Call[] = []
  const installGtag = () => {
    gtagCalls = []
    g.gtag = (_cmd: string, name: string, params: Record<string, unknown>) => {
      gtagCalls.push({ name, params })
    }
  }
  let fetchCalls: { url: string; body: Record<string, unknown> }[] = []
  const installFetch = (impl: 'ok' | 'reject' | 'status500') => {
    fetchCalls = []
    g.fetch = (url: string, init: { body: string }) => {
      fetchCalls.push({ url, body: JSON.parse(init.body) })
      if (impl === 'reject') return Promise.reject(new Error('network down'))
      if (impl === 'status500') return Promise.resolve({ ok: false, status: 500, json: async () => ({}) })
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ ok: true }) })
    }
  }

  const failures: string[] = []
  const check = (label: string, actual: unknown, expected: unknown) => {
    const pass = JSON.stringify(actual) === JSON.stringify(expected)
    if (!pass) failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
    console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${label}  ->  ${JSON.stringify(actual)}`)
  }

  /* ---------------- mount ---------------- */
  async function mount(withGtag: boolean, fetchImpl: 'ok' | 'reject' | 'status500' = 'ok') {
    const host = dom.window.document.getElementById('root')!
    host.innerHTML = ''
    if (withGtag) installGtag()
    else {
      gtagCalls = []
      delete g.gtag
    }
    installFetch(fetchImpl)
    const root = createRoot(host)
    await act(async () => {
      root.render(
        React.createElement(React.Fragment, null, [
          React.createElement(ConversionTracking, { key: 'ct' }),
          React.createElement('div', { key: 'wrap' }, React.createElement(ContactForm)),
          React.createElement('a', { key: 'tel', href: `tel:${config.phone}` }, 'Call us'),
        ]),
      )
    })
    return { host, root }
  }

  const fillAndSubmit = async (host: HTMLElement) => {
    const doc = dom.window.document
    const set = (id: string, v: string) => {
      const el = doc.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null
      if (!el) return
      const proto = el.tagName === 'TEXTAREA' ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, v)
      el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
    }
    set('contact-name', 'Test Person')
    set('contact-phone', '7135550123')
    set('contact-message', 'Please quote a garage clearout.')
    const consent = doc.querySelector<HTMLInputElement>('input[type="checkbox"]:not([tabindex])')
    if (consent && !consent.checked) {
      Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'checked')!.set!.call(consent, true)
      consent.dispatchEvent(new dom.window.Event('click', { bubbles: true }))
      consent.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
    }
    const form = host.querySelector('form')!
    await act(async () => {
      form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }))
    })
    await act(async () => {
      await new Promise((r) => dom.window.setTimeout(r, 40))
    })
  }

  const conversionsOnly = () => gtagCalls.filter((c) => c.name === 'conversion')
  const expectedCall = labels.call ? [{ name: 'conversion', params: { send_to: `${config.tracking.googleAdsId}/${labels.call}` } }] : []
  const expectedContact = labels.contact ? [{ name: 'conversion', params: { send_to: `${config.tracking.googleAdsId}/${labels.contact}` } }] : []

  /* ---- a/b: tel click ---- */
  {
    const { host, root } = await mount(true)
    const tel = host.querySelector<HTMLAnchorElement>('a[href^="tel:"]')!
    await act(async () => {
      tel.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    check('tel click fires the call conversion', conversionsOnly(), expectedCall)
    await act(async () => root.unmount())
  }

  /* ---- a/b: successful submit ---- */
  {
    const { host, root } = await mount(true, 'ok')
    await fillAndSubmit(host)
    check('successful submit posts exactly once', fetchCalls.length, 1)
    check('posts to the www contact endpoint', fetchCalls[0]?.url, 'https://www.alignandacquire.com/api/contact')
    check('payload keys unchanged', Object.keys(fetchCalls[0]?.body ?? {}).sort(), ['businessSlug', 'hp_7d3a_ref', 'message', 'name', 'phone', 'smsConsent'])
    check('successful submit fires the contact conversion', conversionsOnly(), expectedContact)
    await act(async () => root.unmount())
  }

  /* ---- b: failed submit, fetch rejects ---- */
  {
    const { host, root } = await mount(true, 'reject')
    await fillAndSubmit(host)
    check('rejected fetch fires NO conversion', conversionsOnly(), [])
    await act(async () => root.unmount())
  }

  /* ---- b: failed submit, non-2xx ---- */
  {
    const { host, root } = await mount(true, 'status500')
    await fillAndSubmit(host)
    check('500 response fires NO conversion', conversionsOnly(), [])
    await act(async () => root.unmount())
  }

  /* ---- d: gtag undefined ---- */
  {
    const { host, root } = await mount(false, 'ok')
    const tel = host.querySelector<HTMLAnchorElement>('a[href^="tel:"]')!
    let threw = ''
    try {
      await act(async () => {
        tel.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }))
      })
      await fillAndSubmit(host)
    } catch (err) {
      threw = String(err)
    }
    check('with gtag undefined, nothing throws', threw, '')
    check('with gtag undefined, the form still posts once', fetchCalls.length, 1)
    await act(async () => root.unmount())
  }

  console.log('')
  if (failures.length) {
    for (const f of failures) console.error('  ' + f)
    console.error(`${failures.length} check(s) FAILED in ${mode}.`)
    process.exit(1)
  }
  console.log(`  All checks pass in ${mode}.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
