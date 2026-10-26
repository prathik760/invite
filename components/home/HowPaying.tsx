import Link from '@/components/ui/Link'
import TrackedLink from '@/components/ui/TrackedLink'
import { Price, PayMethods } from '@/components/price/Price'
import { HIGHEST_PAID_PRICE, LOWEST_PAID_PRICE } from '@/lib/plans'
import { ENDS_AFTER_DAYS } from '@/lib/retention'

const STEPS = [
  {
    title: 'Pick a design',
    copy: 'Open any of them in a live preview first. It’s exactly what your guests will see.',
  },
  {
    title: 'Type in your details',
    copy: 'Names, date, venue, photos, a song. The preview changes as you type, and if you switch designs, what you’ve typed comes with you.',
  },
  {
    title: 'Pay once and send the link',
    copy: 'On WhatsApp, Instagram, email or a text message. Guests just tap it.',
  },
]

/**
 * How it works, beside how paying works. The terms are set out as a paper
 * receipt: every line is a real term of sale, nothing promotional.
 */
export default function HowPaying() {
  const rows: [string, React.ReactNode][] = [
    ['You pay', 'once, for the design you choose'],
    ['When', 'when you publish, after you’ve seen it'],
    ['Price', <>shown on every design, <Price inr={LOWEST_PAID_PRICE} /> to <Price inr={HIGHEST_PAID_PRICE} /></>],
    ['Subscription', 'none'],
    ['Guests', 'as many as you like'],
    ['Ads on it', 'none'],
    ['Paid by', <><PayMethods />, through Razorpay</>],
    ['Refunds', <>within 7 days, <Link href="/refund-policy" prefetch={false} className="underline decoration-charcoal/30 underline-offset-2 hover:decoration-burnished">see the policy</Link></>],
  ]

  return (
    <section id="pricing" aria-labelledby="how-heading" className="border-b border-charcoal/10 bg-peach/60">
      <div className="shell grid gap-10 py-10 sm:py-12 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-14">
        <div id="how-it-works" className="lg:col-span-6">
          <h2 id="how-heading" className="font-editorial text-balance text-[2.2rem] font-medium leading-[1.04] sm:text-[2.8rem]">
            How to make a digital invitation
          </h2>
          <ol className="mt-7 space-y-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-3 sm:grid-cols-[3.75rem_1fr]">
                <span className="font-editorial text-[3rem] font-medium leading-[0.8] text-burnished sm:text-[3.6rem]">{i + 1}</span>
                <span>
                  <span className="block font-editorial text-[1.55rem] font-medium leading-tight">{s.title}</span>
                  <span className="mt-2 block max-w-lg text-[1rem] leading-7 text-charcoal/70">{s.copy}</span>
                </span>
              </li>
            ))}
          </ol>
          <TrackedLink
            href="/create"
            location="home_steps"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald px-7 py-4 text-[1rem] font-semibold text-paper transition-colors hover:bg-emerald-soft"
          >
            Start with a design <span aria-hidden>→</span>
          </TrackedLink>
        </div>

        {/* The receipt. drop-shadow (not box-shadow) so the torn edges cast one too. */}
        <div className="mx-auto w-full max-w-[26rem] lg:col-span-6 lg:col-start-7 lg:max-w-[29rem]">
          <div className="rotate-[1.2deg] [filter:drop-shadow(0_14px_22px_rgba(30,39,38,0.16))]">
            <div aria-hidden className="receipt-edge" />
            <div className="bg-paper px-6 pb-6 pt-5 sm:px-8">
              <p className="text-center text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-charcoal/60">How paying works</p>
              <dl className="mt-5 border-t border-dashed border-charcoal/25 pt-2 text-[0.92rem]">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex gap-3 border-b border-dashed border-charcoal/15 py-2.5 last:border-0 lg:py-2">
                    <dt className="w-[6.5rem] shrink-0 text-charcoal/55">{k}</dt>
                    <dd className="min-w-0 text-charcoal">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 border-t border-dashed border-charcoal/25 pt-4 text-[0.85rem] leading-6 text-charcoal/60">
                Your invitation stays up through the event and for {ENDS_AFTER_DAYS} days after it.
              </p>
              <TrackedLink
                href="/create"
                location="home_offer"
                className="mt-5 flex items-center justify-center gap-2 rounded-md border border-charcoal/80 px-5 py-3 text-[0.95rem] font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-paper"
              >
                Create your invitation <span aria-hidden>→</span>
              </TrackedLink>
            </div>
            <div aria-hidden className="receipt-edge receipt-edge--bottom" />
          </div>
          <Link href="/pricing" className="mt-5 inline-block text-[0.95rem] font-semibold text-charcoal underline decoration-charcoal/30 underline-offset-[6px] hover:decoration-burnished">
            More about pricing
          </Link>
        </div>
      </div>
    </section>
  )
}
