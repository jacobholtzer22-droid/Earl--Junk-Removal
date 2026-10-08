'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { config } from '@/lib/config'

export interface NavItem {
  href: string
  label: string
}

/**
 * The phone menu: one button in the header, a full-screen panel when open.
 *
 * It replaced a row of five links that only fitted 360px by dropping Referrals
 * and shortening "Service Areas" to "Areas". A button costs one tap and buys
 * back the whole row, which is what lets the header be a single line.
 *
 * ACCESSIBILITY, all of it deliberate:
 *   - aria-expanded and aria-controls on the button, so a screen reader is
 *     told the state rather than left to infer it from a glyph
 *   - focus moves into the panel on open and back to the button on close
 *   - Tab and Shift+Tab are trapped inside the panel while it is open, so
 *     focus cannot wander into the page behind it
 *   - Escape closes from anywhere inside
 *   - the body is scroll-locked while open, with the scrollbar's width added
 *     back as padding so the page does not jump sideways
 *   - route changes close it, because a client-side navigation leaves the
 *     panel open over the new page otherwise
 *   - the panel is PORTALLED to <body>. Rendered in place it sits inside the
 *     header's stacking context, and the fixed call bar, which is a sibling of
 *     the header rather than a descendant, painted over the bottom of the open
 *     menu and hid two items. Raising z-index inside the header cannot beat a
 *     sibling outside it; moving the node out can
 *
 * Services is a nested disclosure rather than a link, because the index is
 * reachable from "All services" at the end of the list and a parent that both
 * navigates and expands is ambiguous on a touch screen.
 */
export default function MobileMenu({ items, services }: { items: readonly NavItem[]; services: readonly NavItem[] }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [servicesOpen, setServicesOpen] = useState(false)
  const panelId = useId()
  const submenuId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // A client-side navigation does not unmount this, so close on route change.
  useEffect(() => {
    setOpen(false)
    setServicesOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const body = document.body
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    const panel = panelRef.current
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((el) => el.offsetParent !== null)

    focusables()[0]?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        buttonRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (!first || !last) return
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && (active === first || !panel?.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[44px] items-center gap-2 border-2 border-primary-dark px-3 py-2 font-heading text-sm font-bold uppercase tracking-wide text-primary-dark"
      >
        <span>{open ? 'Close' : 'Menu'}</span>
        <span aria-hidden="true" className="flex w-5 flex-col gap-[3px]">
          <span className="block h-[2px] w-full bg-primary-dark" />
          <span className="block h-[2px] w-full bg-primary-dark" />
          <span className="block h-[2px] w-full bg-primary-dark" />
        </span>
      </button>

      {open &&
        mounted &&
        createPortal(
        <div
          id={panelId}
          ref={panelRef}
          className="fixed inset-0 z-[60] overflow-y-auto bg-surface"
        >
          <div className="flex items-center justify-between border-b-2 border-primary-dark px-4 py-3">
            <span className="font-heading text-base font-bold uppercase tracking-tight text-primary-dark">Menu</span>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
              className="min-h-[44px] px-3 font-heading text-sm font-bold uppercase tracking-wide text-primary-dark"
            >
              Close
            </button>
          </div>

          <nav aria-label="Menu" className="px-4 py-2">
            <ul className="divide-y divide-line">
              {items.map((item) =>
                item.label === 'Services' ? (
                  <li key="services">
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls={submenuId}
                      onClick={() => setServicesOpen((v) => !v)}
                      className="flex min-h-[52px] w-full items-center justify-between py-3 text-left font-heading text-lg font-bold uppercase tracking-tight text-primary-dark"
                    >
                      Services
                      <span aria-hidden="true" className="text-2xl leading-none text-accent-dark">
                        {servicesOpen ? '−' : '+'}
                      </span>
                    </button>
                    {servicesOpen && (
                      <ul id={submenuId} className="pb-3 pl-3">
                        {services.map((s) => (
                          <li key={s.href}>
                            <Link href={s.href} className="flex min-h-[44px] items-center py-1 text-base text-ink">
                              {s.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href="/services" className="flex min-h-[44px] items-center py-1 text-base font-semibold text-accent-dark">
                            All services
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-[52px] items-center py-3 font-heading text-lg font-bold uppercase tracking-tight text-primary-dark"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-6 grid gap-3 pb-10">
              <a
                href={`tel:${config.phone}`}
                className="flex min-h-[52px] items-center justify-center border-2 border-primary-dark font-heading text-base font-bold uppercase tracking-wide text-primary-dark"
              >
                Call {config.phoneDisplay}
              </a>
              <Link
                href="/contact"
                className="flex min-h-[52px] items-center justify-center bg-accent font-heading text-base font-bold uppercase tracking-wide text-on-accent"
              >
                Get a Free Quote
              </Link>
            </div>
          </nav>
        </div>,
          document.body,
        )}
    </div>
  )
}
