'use client'

import { useEffect } from 'react'

/**
 * The only JavaScript behind the motion on this site.
 *
 * It does two things and nothing else: marks sections as they scroll into
 * view, and tells the header it is no longer at the top of the page.
 *
 * WHY THE `js-motion` CLASS. The reveal's hidden initial state lives behind
 * that class in globals.css, and only this effect adds it. So with JavaScript
 * off, or before hydration, or if this component throws, the hidden state is
 * never applied and every section renders normally. Content is never hidden
 * by something that might not run. That is the whole design.
 *
 * It also bails out entirely under prefers-reduced-motion rather than running
 * an observer whose results the CSS would then ignore.
 */
export default function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement
    const header = document.querySelector<HTMLElement>('[data-site-header]')

    // The header hint is colour only and costs nothing, so it runs either way.
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        if (header) header.dataset.scrolled = window.scrollY > 60 ? 'true' : 'false'
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    let observer: IntersectionObserver | undefined
    if (!reduced.matches) {
      root.classList.add('js-motion')
      const targets = document.querySelectorAll('[data-reveal]')
      observer = new IntersectionObserver(
        (entries, obs) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            e.target.classList.add('is-in')
            // Once in, stay in. Re-animating on the way back up is the kind of
            // thing that reads as a website showing off.
            obs.unobserve(e.target)
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
      )
      for (const t of targets) observer.observe(t)
    }

    /*
     * ESCAPE CLOSES THE SERVICES DROPDOWN.
     *
     * The dropdown is CSS only, opened by :hover and :focus-within, which is
     * what puts all thirteen service links in the HTML with no JavaScript and
     * makes it work for a keyboard by plain tabbing. The one thing CSS cannot
     * do is honour Escape, and WAI-ARIA's disclosure-navigation pattern says
     * it should.
     *
     * So this is the enhancement: Escape marks the wrapper closed and returns
     * focus to the trigger, which is what the pattern asks for. The marker is
     * cleared as soon as focus leaves the wrapper, so the next Tab or hover
     * opens it again. With JavaScript off, the dropdown is exactly as it was
     * and only Escape is missing.
     */
    const onMenuKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const wrap = (document.activeElement as HTMLElement | null)?.closest<HTMLElement>('[data-services-menu]')
        if (!wrap) return
        wrap.dataset.forceClosed = 'true'
        wrap.querySelector('a')?.focus()
        return
      }
      /*
       * Tab clears the marker, because Tab is the key that moves focus out.
       *
       * This deliberately does NOT listen to focusin or focusout. The first
       * two attempts did, and both left the menu permanently shut after a
       * single Escape: relatedTarget is null too often to trust, and the
       * browser pane these were tested in does not dispatch focus events for
       * programmatic .focus() at all, so neither version could be verified
       * before shipping. A key event fires either way.
       *
       * The clear is deferred a tick so the submenu is still hidden while the
       * browser works out where Tab goes. Hidden links are not in the tab
       * order, which is what sends focus to the next top-level item rather
       * than back into the menu Escape just closed.
       */
      if (e.key === 'Tab') {
        const wrap = document.querySelector<HTMLElement>('[data-services-menu][data-force-closed]')
        if (wrap) window.setTimeout(() => delete wrap.dataset.forceClosed, 0)
      }
    }
    /*
     * ANY pointer movement over the menu clears the marker, so a mouse user
     * can never be left with a dropdown that will not open.
     *
     * This listens to pointerOVER on the document, not pointerEnter on the
     * wrapper, and the difference is the whole bug. pointerenter fires once
     * when the pointer crosses into the element and never again while it is
     * inside. So pressing Escape with the pointer ALREADY over Services, then
     * moving the mouse within that item, left the menu shut: there was no
     * re-entry to fire on. Confirmed before the fix, and the leave-and-return
     * case passed even then, which is why it was easy to miss.
     *
     * pointerover bubbles and fires again on every element the pointer moves
     * onto, including children, so any movement at all over the menu clears
     * it. Keyboard users are unaffected: Escape still closes, and Tab still
     * clears.
     */
    const clearOnPointer = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest?.('[data-services-menu]')) return
      const wrap = document.querySelector<HTMLElement>('[data-services-menu][data-force-closed]')
      if (wrap) delete wrap.dataset.forceClosed
    }
    document.addEventListener('keydown', onMenuKey)
    document.addEventListener('pointerover', clearOnPointer)

    return () => {
      document.removeEventListener('keydown', onMenuKey)
      document.removeEventListener('pointerover', clearOnPointer)
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
      observer?.disconnect()
      root.classList.remove('js-motion')
    }

  }, [])

  return null
}
