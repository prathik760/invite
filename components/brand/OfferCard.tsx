import TrackedLink from '@/components/ui/TrackedLink'
import { LogoMark } from '@/components/brand/Logo'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/Icons'
import { OFFER, OFFER_INCLUDES } from '@/lib/offer'

/**
 * The offer, as a single card: one price, everything it includes, one action.
 *
 * With `price` it describes one design (template pages); without it, the
 * range across the catalogue ("from ₹99"). There are deliberately no tiers,
 * bundles or plan names here — a customer buys one design.
 */
export default function OfferCard({
  price,
  designName,
  href = '/create',
  cta = 'Start with this design',
  location = 'offer_card',
  className = '',
}: {
  price?: number
  designName?: string
  href?: string
  cta?: string
  location?: string
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-emerald p-7 text-paper shadow-lift sm:p-9 ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-soft/10 blur-2xl"
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-gold-soft">
            {designName ? designName : 'One design · one price'}
          </p>
          <LogoMark className="h-10 w-10" />
        </div>

        <div className="mt-6 flex items-end gap-3">
          {!price && <span className="pb-2 text-[0.95rem] text-paper/70">from</span>}
          <span className="font-editorial text-[4.2rem] font-semibold leading-none">₹{price ?? OFFER.from}</span>
          <span className="pb-2 text-[0.95rem] text-paper/70">one-time</span>
        </div>
        <p className="mt-3 text-[0.98rem] leading-7 text-paper/75">
          {price ? 'Pay once when you publish. Every feature in this design is yours.' : OFFER.short}
        </p>

        <ul className="mt-6 space-y-2.5 border-t border-paper/15 pt-6">
          {OFFER_INCLUDES.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-[0.93rem] text-paper/85">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              {line}
            </li>
          ))}
        </ul>

        <TrackedLink
          href={href}
          location={location}
          className="btn-gold mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[1rem] font-semibold"
        >
          {cta}
          <ArrowRightIcon />
        </TrackedLink>
        <p className="mt-3 text-center text-[0.8rem] text-paper/55">Free to build and preview · Secure checkout by Razorpay</p>
      </div>
    </div>
  )
}
