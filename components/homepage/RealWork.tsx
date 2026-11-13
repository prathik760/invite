import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { PayMethods } from '@/components/price/Price'
import { DELETE_AFTER_DAYS } from '@/lib/retention'
import { serverT } from '@/lib/serverLang'
import { rich } from '@/lib/translate'

/**
 * "Made for moments that matter": why a family can trust this with their
 * invitation. ShareInvite has no verified customer reviews yet, so there are
 * no quotes here: instead the real invitations themselves, hung like framed
 * prints, and four things a visitor can check for themselves. When customers
 * give genuine testimonials (their name, their event, their own words and
 * their invitation), they belong beside the prints.
 */
const PRINTS = [
  // 4:5 crops of real phone screens, cut at the part each print shows (480×600).
  { src: '/landing/print-royal-edit.webp', caption: 'The Royal Edit', occasion: 'Wedding', cls: '' },
  { src: '/landing/print-kalyanam.webp', caption: 'Kalyanam', occasion: 'South Indian wedding', cls: 'sm:mt-10 lg:mt-16' },
  { src: '/landing/print-two-worlds.webp', caption: 'Two Worlds', occasion: 'Wedding', cls: 'sm:-mt-6 lg:-mt-10' },
  { src: '/landing/print-countdown.webp', caption: 'Rajwada', occasion: 'The countdown', cls: 'sm:mt-4 lg:mt-6' },
]

// `d` is translated where it is shown: {methods} is the payment methods, {days} DELETE_AFTER_DAYS.
const REASONS = [
  { t: 'See it finished before you pay', d: 'Build the whole invitation and preview it exactly as your guests will. You pay only to publish.' },
  { t: 'Payment you can trust', d: 'By {methods}, through Razorpay. ShareInvite never sees or stores your card details.' },
  { t: 'A person on WhatsApp', d: 'Questions about your invitation are answered by our team, not a bot.' },
  { t: 'Yours to change, and to remove', d: 'Edit the details until your event, on the same link. The invitation and its photos are deleted {days} days after it ends.' },
]

export default function RealWork() {
  const t = serverT()
  return (
    <section id="made-for" aria-labelledby="hv-made-title" className="hv-sec scroll-mt-20">
      <div className="hv-shell grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        {/* The prints: real designs, as guests see them. */}
        {/* Phones: the prints as a row to swipe. Tablets and up: hung as a staggered pair of pairs. */}
        <ul className="hv-rail -mx-[var(--hv-gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--hv-gutter)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0" data-reveal-group>
          {PRINTS.map((p) => (
            <li key={p.src} className={`w-[46%] shrink-0 snap-start sm:w-auto ${p.cls}`}>
              <figure>
                <div className="overflow-hidden rounded-[0.4rem] bg-white p-2 shadow-[0_30px_60px_-38px_rgba(12,43,34,0.6)] ring-1 ring-hv-ink/5 sm:p-3">
                  <Image src={p.src} alt={t('{name}, a {occasion} invitation on ShareInvite', { name: p.caption, occasion: t(p.occasion).toLowerCase() })} width={480} height={600} unoptimized className="aspect-[4/5] w-full object-cover" />
                </div>
                <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 text-[0.88rem] text-hv-muted">
                  <span className="hv-serif text-[1.15rem] font-semibold text-hv-ink">{p.caption}</span>
                  {t(p.occasion)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div data-reveal>
          <h2 id="hv-made-title" className="hv-h2 lg:max-w-[28rem]">
            {t('Made for moments that matter.')}
          </h2>
          <p className="hv-lede mt-6 max-w-[30rem]">
            {t('Every invitation on this page is a real design, shown as it opens on a guest’s phone. Here is what you can count on when it is yours.')}
          </p>
          <ol className="mt-10 space-y-7">
            {REASONS.map((r, i) => (
              <li key={r.t} className="grid grid-cols-[2.25rem_1fr] gap-x-4">
                <span className="hv-serif pt-0.5 text-[1.3rem] italic text-hv-gold-ink">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="hv-serif block text-[1.45rem] font-semibold leading-tight text-hv-ink">{t(r.t)}</span>
                  <span className="mt-1.5 block text-[1rem] leading-[1.65] text-hv-muted">{rich(t(r.d, { days: DELETE_AFTER_DAYS }), { methods: <PayMethods /> })}</span>
                </span>
              </li>
            ))}
          </ol>
          <TrackedLink href="/templates" location="home_made_for" className="hv-textlink mt-10">
            {t('Browse every design')}
            <ArrowRightIcon className="h-4 w-4" />
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
