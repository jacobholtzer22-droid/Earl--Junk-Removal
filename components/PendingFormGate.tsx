'use client'

import { useState, type FormEvent } from 'react'
import { config } from '@/lib/config'
import ContactForm from './ContactForm'
import Phone from './Phone'

/**
 * Holds the contact form shut while the platform Business row does not exist.
 *
 * THE PROBLEM. `businessSlug` is sent with every submission and is how the
 * platform decides whose lead this is. Before the Business row exists there is
 * no slug, and a submission carrying an empty one is accepted with a 200 and
 * then dropped. The visitor sees "thanks, we received your message" and nobody
 * ever calls them back. That is the exact failure this repo is built to make
 * impossible, so the form must not post at all until the slug is real.
 *
 * WHY A WRAPPER AND NOT AN EDIT. components/ContactForm.tsx is sealed and
 * checksum-verified (verify.ts check 4), and for good reason: it is the one
 * file where a careless change silently loses leads for every client. So it is
 * not touched. Equally, it is not SWAPPED OUT for a lookalike, because checks 5
 * and 6 require a page to render the real form with the real endpoint and the
 * real honeypot, and a lookalike would quietly drift from the platform
 * contract.
 *
 * HOW IT WORKS. The real form renders, untouched. When the slug is empty this
 * wrapper catches the submit event in React's CAPTURE phase, which runs before
 * the form's own bubble-phase handler, and calls preventDefault (no native
 * submit) and stopPropagation (React never dispatches to the form's handler,
 * so `fetch` is never reached).
 *
 * ONCE THE SLUG EXISTS THIS IS A PURE PASS-THROUGH. Not a wrapper that happens
 * to do nothing: the early return below emits `<ContactForm />` and nothing
 * else, no extra element, no extra listener, so the rendered DOM is identical
 * to calling ContactForm directly. Proven both directions by
 * scripts/proof/pending-form.mjs, which mocks fetch and asserts zero calls with
 * an empty slug and exactly one call, with an unchanged payload, with a real one.
 *
 * TO GO LIVE: set `businessSlug` in site.config.ts. Nothing here changes.
 */
export default function PendingFormGate() {
  const isPending = config.businessSlug === ''
  const [attempted, setAttempted] = useState(false)

  // Pure pass-through. Identical output to <ContactForm /> itself.
  if (!isPending) return <ContactForm />

  function blockSubmit(event: FormEvent<HTMLDivElement>) {
    // preventDefault stops the browser submitting; stopPropagation stops React
    // dispatching to ContactForm's own onSubmit, so fetch is never called.
    event.preventDefault()
    event.stopPropagation()
    setAttempted(true)
  }

  return (
    <div onSubmitCapture={blockSubmit}>
      {/*
        Shown before the form, not only after a failed submit. Letting someone
        type out a message that cannot be sent and only then telling them is
        worse than telling them up front.
      */}
      <div className="mb-6 border-l-4 border-accent bg-primary-soft p-5" role="note">
        <p className="font-heading text-lg font-bold uppercase tracking-wide text-primary-dark">
          Online requests are not connected yet
        </p>
        <p className="mt-2 text-base text-ink">
          Call <Phone className="text-primary-dark" /> and {config.displayName} will take your details over the phone. The
          form below is not live.
        </p>
      </div>

      <ContactForm />

      {attempted && (
        <p className="mt-4 border-l-4 border-accent bg-primary-soft p-4 text-base font-semibold text-ink" role="alert">
          Online requests are not connected yet. Please call <Phone className="text-primary-dark" />.
        </p>
      )}
    </div>
  )
}
