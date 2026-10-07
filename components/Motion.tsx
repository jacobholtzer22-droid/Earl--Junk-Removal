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

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
      observer?.disconnect()
      root.classList.remove('js-motion')
    }
  }, [])

  return null
}
