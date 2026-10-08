'use client'

import { useEffect } from 'react'
import { CONTACT_ENDPOINT } from '@/lib/config'
import { fireConversion } from '@/lib/conversions'

/**
 * Fires the two conversions, without editing a single component.
 *
 * CLICK TO CALL is one delegated listener on the document, so every tel: link
 * on the site is covered by construction: the header button, the fixed mobile
 * call bar, the mobile menu, the footer, the hours panel, the ones inside MDX
 * copy, and any added later. Attaching per component would mean touching a
 * dozen files and forgetting the thirteenth.
 *
 * THE CONTACT FORM is harder, and worth explaining because the obvious
 * approaches are all wrong here.
 *
 * components/ContactForm.tsx is SEALED and byte-identical: verify.ts check 4
 * compares its checksum. It was read first, looking for a hook. There is
 * none: it takes no props, dispatches no event, pushes nothing to dataLayer,
 * and sets no attribute on success.
 *
 * What it does do is REPLACE ITSELF. On success the component returns a
 * different tree: the <form data-endpoint> is unmounted and a
 * <div role="status"> takes its place in the same parent. On failure the form
 * stays mounted and an error paragraph appears inside it. So "the form
 * element left the DOM" is a success-only signal, and that is what this
 * watches.
 *
 * It is structural, not textual. Matching the thank-you wording would break
 * the first time anyone edits the copy, and copy is exactly the thing most
 * likely to be edited.
 *
 * Firing on submit instead would count failures, double-count retries, and
 * report a conversion for a network error. Firing on the button click would
 * count people who never filled the form in.
 *
 * THE FORM'S SUCCESS STATE IS NOT ENOUGH ON ITS OWN, which the proof caught.
 * ContactForm awaits fetch and then sets status 'done' WITHOUT checking
 * res.ok, so a 500 shows the visitor "Thanks, we received your message" and
 * would have counted as a conversion. Only a thrown error reaches its catch.
 *
 * That is a defect in a sealed file this round cannot edit, so the tracking
 * compensates: fetch is wrapped to record whether the last POST to the
 * contact endpoint actually returned 2xx, and the conversion needs BOTH that
 * and the form's success state. The wrapper passes everything through
 * untouched, rethrows, and is removed on unmount. It is the smallest thing
 * that can see a status code from outside the sealed component.
 *
 * The underlying defect is logged for the client: a 500 currently tells the
 * visitor their message arrived when it did not.
 */
export default function ConversionTracking() {
  useEffect(() => {
    /* ---- did the contact POST actually succeed? ---- */
    let lastContactOk = false
    // globalThis, not window. They are the same object in a browser, but the
    // sealed form calls bare `fetch(...)`, which resolves against globalThis.
    // Patching window only would miss it anywhere the two differ, which the
    // proof harness does and caught.
    const originalFetch = globalThis.fetch
    const isContactUrl = (u: unknown) => {
      const url = typeof u === 'string' ? u : u instanceof Request ? u.url : String(u ?? '')
      return url.startsWith(CONTACT_ENDPOINT)
    }
    globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
      const watching = isContactUrl(args[0])
      try {
        const res = await originalFetch(...args)
        if (watching) lastContactOk = res.ok
        return res
      } catch (err) {
        if (watching) lastContactOk = false
        throw err
      }
    }

    /* ---- click to call ---- */
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest) return
      if (target.closest('a[href^="tel:"]')) fireConversion('call')
    }
    document.addEventListener('click', onClick)

    /* ---- contact form success ---- */
    const form = document.querySelector<HTMLFormElement>('form[data-endpoint]')
    const parent = form?.parentElement
    let observer: MutationObserver | undefined

    if (form && parent) {
      let fired = false
      observer = new MutationObserver(() => {
        if (fired) return
        // Success is: the form is gone AND a status region replaced it.
        // Both halves matter. The form alone leaving could be a route change;
        // a status region alone could be the inline error, which renders
        // while the form is still mounted.
        const formGone = !parent.contains(form)
        const status = parent.querySelector('[role="status"]')
        if (!formGone || !status) return
        fired = true
        observer?.disconnect()
        // Both halves: the form says success AND the server actually said 2xx.
        if (lastContactOk) fireConversion('contact')
      })
      observer.observe(parent, { childList: true, subtree: true })
    }

    return () => {
      document.removeEventListener('click', onClick)
      observer?.disconnect()
      globalThis.fetch = originalFetch
    }
  }, [])

  return null
}
