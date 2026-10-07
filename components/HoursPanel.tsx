import { config, formatTime } from '@/lib/config'
import Phone from './Phone'

/**
 * Hours, and the honest version of the emergency offer.
 *
 * The client mentioned a $220 trip charge "after midnight". Neither the amount
 * nor the hours it applies to are confirmed, so this says that emergency
 * after-hours service exists and that a trip charge applies, and stops. The
 * number lives in CLIENT-TODO item 7, not on the website, because publishing an
 * unconfirmed price is how a customer ends up arguing on a doorstep.
 */
export default function HoursPanel() {
  const hours = config.hours
  if (!hours) return null
  const open = hours[0]
  const everyDaySame =
    hours.length === 7 && hours.every((h) => h.open === open?.open && h.close === open?.close)

  return (
    <section data-reveal className="border-t-2 border-primary-dark bg-bg">
      <div className="mx-auto grid max-w-page gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-primary-dark md:text-4xl">
            Open seven days
          </h2>
          {everyDaySame && open ? (
            <p className="mt-6 font-heading text-5xl font-bold leading-none text-primary-dark md:text-6xl">
              {formatTime(open.open)} to {formatTime(open.close)}
            </p>
          ) : null}
          <p className="mt-4 text-base text-muted">
            Monday through Sunday, Central time. Same-day service is available, so call and ask what is still open.
          </p>
        </div>

        <div className="border-l-4 border-accent bg-surface p-8">
          <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-primary-dark">After hours</h3>
          <p className="mt-4 text-base leading-relaxed text-ink">
            After-hours calls are answered. Emergency after-hours service is available and a trip charge applies.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Call <Phone className="text-primary-dark" /> and ask what the charge is before you book.
          </p>
        </div>
      </div>
    </section>
  )
}
