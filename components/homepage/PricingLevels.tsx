'use client'

import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/Icons'
import { Price, PayMethods } from '@/components/price/Price'
import PricingView from './PricingView'
import { useT } from '@/components/i18n/I18nProvider'
import { rich } from '@/lib/translate'

/** The words before and after the price in "from {price}", in the reader's language. */
const fromParts = (tr: (s: string) => string) => tr('from {price}').split('{price}').map((x) => x.trim())

/**
 * "Beautiful invitations. Simple, transparent pricing." What a customer buys
 * is one design at its own price; the three levels are how those prices fall
 * (lib/tiers.ts). Ranges, counts and how many designs in each level hold each
 * feature are worked out from the catalogue in app/page.tsx, so nothing here
 * can drift from what the checkout charges or what the designs contain.
 *
 * Wide screens: the levels side by side over one comparison table, Signature
 * marked as the choice for weddings (a recommendation by use, not a claim
 * about sales). Phones: a switch between the levels, one at a time. Then what
 * happens once you pay, which is the same at every level.
 */
export interface Level {
  key: string
  name: string
  promise: string
  from: number
  to: number
  count: number
  /** Each feature, and how many of the level's designs hold it. */
  matrix: { key: string; label: string; n: number }[]
  recommended?: string
}

function Coverage({ n, count, dark }: { n: number; count: number; dark?: boolean }) {
  const tr = useT()
  if (n === 0) return <span className={dark ? 'text-hv-ivory/60' : 'text-hv-ink/65'}>{tr('None')}</span>
  if (n === count)
    return (
      <span className={`inline-flex items-center gap-2 font-medium ${dark ? 'text-hv-ivory' : 'text-hv-ink'}`}>
        <CheckIcon className={`h-4 w-4 ${dark ? 'text-hv-gold' : 'text-hv-forest'}`} /> {tr('Every design')}
      </span>
    )
  return (
    <span className={`inline-flex items-center gap-2.5 ${dark ? 'text-hv-ivory/75' : 'text-hv-ink/75'}`}>
      <span aria-hidden className={`relative h-1 w-10 overflow-hidden rounded-full ${dark ? 'bg-hv-ivory/15' : 'bg-hv-ink/10'}`}>
        <span className={`absolute inset-y-0 left-0 rounded-full ${dark ? 'bg-hv-gold' : 'bg-hv-forest/70'}`} style={{ width: `${Math.round((n / count) * 100)}%` }} />
      </span>
      {tr('{n} of {count}', { n, count })}
    </span>
  )
}

// `d` is translated where it is shown, {methods} being the payment methods.
const AFTER = [
  { t: 'Pay once', d: 'By {methods}, through Razorpay. No subscription.' },
  { t: 'It goes live', d: 'Your invitation gets its own link straight away, and your receipt comes by email.' },
  { t: 'Share it', d: 'Send the link on WhatsApp, Instagram, email or text. Guests need no app.' },
  { t: 'Change it any time', d: 'Edit the details until your event. The link stays the same.' },
]

/**
 * The three features that best describe a level on a phone card: those in all or most of its
 * designs, and first those the cheaper levels do not have, so the real differences stay visible.
 */
function keyFeatures(levels: Level[], i: number) {
  const l = levels[i]
  const lower = levels.slice(0, i)
  return l.matrix
    .filter((r) => r.n > 0)
    .map((r, idx) => ({ r, idx, share: r.n / l.count, own: lower.every((x) => (x.matrix.find((m) => m.key === r.key)?.n ?? 0) === 0) ? 1 : 0 }))
    .sort((a, b) => b.share - a.share || b.own - a.own || a.idx - b.idx)
    .slice(0, 3)
    .map(({ r }) => r)
}

export default function PricingLevels({ levels }: { levels: Level[] }) {
  const tr = useT()
  const rec = levels.findIndex((l) => l.recommended)
  const rows = levels[0]?.matrix ?? []

  const head = (l: Level, dark: boolean) => (
    <>
      {l.recommended && <p className="mb-4 w-fit rounded-full bg-hv-gold/15 px-3 py-1 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-hv-gold lg:absolute lg:left-7 lg:top-4 lg:mb-0">{tr(l.recommended)}</p>}
      <h3 className={`hv-serif text-[2.3rem] font-medium leading-none ${dark ? 'text-hv-ivory' : 'text-hv-ink'}`}>{tr(l.name)}</h3>
      {/* Room for four lines on wide screens, so Classic and Premium prices sit level. */}
      <p className={`mt-3 text-[0.98rem] leading-[1.6] lg:min-h-[6.4em] ${dark ? 'text-hv-ivory/70' : 'text-hv-muted'}`}>{tr(l.promise)}</p>
      <p className="mt-6 flex items-baseline gap-2">
        {/* "from {price}": each language puts "from" before or after the price (Hindi: "₹299 से"). */}
        {fromParts(tr)[0] && <span className={`text-[0.9rem] ${dark ? 'text-hv-ivory/60' : 'text-hv-muted'}`}>{fromParts(tr)[0]}</span>}
        <Price inr={l.from} className={`hv-serif text-[2.8rem] leading-none ${dark ? 'text-hv-gold' : 'text-hv-forest'}`} />
        {fromParts(tr)[1] && <span className={`text-[0.9rem] ${dark ? 'text-hv-ivory/60' : 'text-hv-muted'}`}>{fromParts(tr)[1]}</span>}
      </p>
      <p className={`mt-1.5 text-[0.9rem] ${dark ? 'text-hv-ivory/60' : 'text-hv-muted'}`}>
        {l.to > l.from
          ? rich(tr('up to {price} · {n} designs · paid once', { n: l.count }), { price: <Price inr={l.to} /> })
          : tr('{n} designs · paid once', { n: l.count })}
      </p>
      <span aria-hidden className="hidden lg:block lg:flex-1" />
      <TrackedLink href={`/templates?level=${l.key}`} location="home_pricing" meta={{ level: l.key }} className={`${dark ? 'hv-btn-light border border-transparent' : 'hv-btn-line'} mt-7 w-full whitespace-nowrap !px-4`}>
        {tr('{level} designs', { level: tr(l.name) })}
        <ArrowRightIcon className="h-4 w-4" />
      </TrackedLink>
    </>
  )

  return (
    <section id="pricing" aria-labelledby="hv-pricing-title" className="hv-sec scroll-mt-20 bg-hv-linen">
      <PricingView />
      <div className="hv-shell">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end" data-reveal>
          <h2 id="hv-pricing-title" className="hv-h2 lg:max-w-[34rem]">
            {tr('Beautiful invitations. Simple, transparent pricing.')}
          </h2>
          <p className="hv-lede max-w-[30rem] lg:justify-self-end">
            {tr('You pay once for the design you publish, and every feature in it is yours. No plans, no subscription, and nothing to pay until you have seen the finished invitation.')}
          </p>
        </div>

        {/* Wide screens: the levels over one table. */}
        <div className="mt-12 max-lg:hidden" role="table" aria-label={tr('What each level holds')}>
          <div role="rowgroup">
            <div role="row" className="grid grid-cols-[0.85fr_1fr_1fr_1fr]">
              <div role="columnheader" className="flex items-end pb-8 pr-6">
                <p className="hv-serif max-w-[14rem] text-[1.35rem] italic leading-snug text-hv-ink/70">{tr('Every design is priced on its own. These are the ranges.')}</p>
              </div>
              {levels.map((l, i) => (
                <div key={l.key} role="columnheader" className={`relative flex flex-col px-7 pb-8 pt-14 ${i === rec ? 'rounded-t-[1.4rem] bg-hv-deep' : ''}`}>
                  {head(l, i === rec)}
                </div>
              ))}
            </div>
          </div>
          <div role="rowgroup">
            {rows.map((r, ri) => (
              <div key={r.key} role="row" className="grid grid-cols-[0.85fr_1fr_1fr_1fr] text-[0.98rem]">
                <div role="rowheader" className="border-t border-hv-ink/10 py-3 pr-6 font-medium text-hv-ink">{tr(r.label)}</div>
                {levels.map((l, i) => (
                  <div key={l.key} role="cell" className={`py-3 px-7 ${i === rec ? `bg-hv-deep ${ri === rows.length - 1 ? 'rounded-b-[1.4rem] pb-7' : ''} border-t border-hv-ivory/10` : 'border-t border-hv-ink/10'}`}>
                    <Coverage n={l.matrix[ri]?.n ?? 0} count={l.count} dark={i === rec} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Phones and tablets: every level at once, compact. Name, price and the features that set it
            apart stay in view; the description and the full comparison fold out. */}
        <div className="mt-8 space-y-3 lg:hidden">
          {levels.map((l, i) => {
            const dark = i === rec
            return (
              <article key={l.key} aria-labelledby={`hv-plan-${l.key}`} className={`rounded-[1.2rem] p-5 ${dark ? 'bg-hv-deep text-hv-ivory' : 'border border-hv-ink/10 bg-hv-ivory'}`}>
                {l.recommended && <p className="mb-3 w-fit rounded-full bg-hv-gold/15 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-hv-gold">{tr(l.recommended)}</p>}
                <div className="flex items-baseline justify-between gap-3">
                  <h3 id={`hv-plan-${l.key}`} className={`hv-serif text-[1.75rem] font-medium leading-none ${dark ? 'text-hv-ivory' : 'text-hv-ink'}`}>{tr(l.name)}</h3>
                  <p className="flex items-baseline gap-1.5">
                    {fromParts(tr)[0] && <span className={`text-[0.85rem] ${dark ? 'text-hv-ivory/60' : 'text-hv-muted'}`}>{fromParts(tr)[0]}</span>}
                    <Price inr={l.from} className={`hv-serif text-[2rem] leading-none ${dark ? 'text-hv-gold' : 'text-hv-forest'}`} />
                    {fromParts(tr)[1] && <span className={`text-[0.85rem] ${dark ? 'text-hv-ivory/60' : 'text-hv-muted'}`}>{fromParts(tr)[1]}</span>}
                  </p>
                </div>
                <p className={`mt-1.5 text-[0.85rem] ${dark ? 'text-hv-ivory/60' : 'text-hv-muted'}`}>
                  {l.to > l.from
                    ? rich(tr('up to {price} · {n} designs · paid once', { n: l.count }), { price: <Price inr={l.to} /> })
                    : tr('{n} designs · paid once', { n: l.count })}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {keyFeatures(levels, i).map((r) => (
                    <li key={r.key} className={`rounded-full px-2.5 py-1 text-[0.8rem] ${dark ? 'bg-hv-ivory/10 text-hv-ivory/90' : 'bg-hv-linen text-hv-ink/85'}`}>
                      {tr(r.label)}
                      {r.n < l.count && <span className={dark ? 'text-hv-ivory/60' : 'text-hv-ink/60'}> · {tr('{n} of {count}', { n: r.n, count: l.count })}</span>}
                    </li>
                  ))}
                </ul>
                <TrackedLink href={`/templates?level=${l.key}`} location="home_pricing" meta={{ level: l.key }} className={`${dark ? 'hv-btn-light' : 'hv-btn-line'} mt-4 !min-h-[2.9rem] w-full !py-2.5`}>
                  {tr('{level} designs', { level: tr(l.name) })}
                  <ArrowRightIcon className="h-4 w-4" />
                </TrackedLink>
                <details className="hv-faq group mt-3">
                  <summary className={`flex items-center justify-between py-1 text-[0.9rem] font-semibold ${dark ? 'text-hv-ivory/85' : 'text-hv-forest'}`}>
                    {tr('Everything in {level}', { level: tr(l.name) })}
                    <span aria-hidden className="hv-faq-icon text-[1.1rem] leading-none">+</span>
                  </summary>
                  <div className="hv-faq-a">
                    <p className={`mt-2 text-[0.9rem] leading-[1.6] ${dark ? 'text-hv-ivory/70' : 'text-hv-muted'}`}>{tr(l.promise)}</p>
                    <ul className={`mt-3 border-t ${dark ? 'border-hv-ivory/15' : 'border-hv-ink/10'}`}>
                      {l.matrix.map((r) => (
                        <li key={r.key} className={`flex items-center justify-between gap-4 border-b py-2.5 text-[0.9rem] ${dark ? 'border-hv-ivory/10' : 'border-hv-ink/10'}`}>
                          <span className={dark ? 'text-hv-ivory/85' : 'text-hv-ink'}>{tr(r.label)}</span>
                          <span className="shrink-0 text-[0.85rem]">
                            <Coverage n={r.n} count={l.count} dark={dark} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </article>
            )
          })}
        </div>

        {/* After you pay: the same at every level. */}
        <div className="mt-12 lg:mt-24" data-reveal>
          <h3 className="hv-h3">{tr('What happens after you pay')}</h3>
          <ol className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 lg:mt-8 lg:grid-cols-4 lg:gap-10">
            {AFTER.map((a, i) => (
              <li key={a.t} className="border-t border-hv-gold/50 pt-4 lg:pt-5">
                <span className="hv-serif text-[1.05rem] text-hv-gold-ink">{String(i + 1).padStart(2, '0')}</span>
                <p className="hv-serif mt-1 text-[1.25rem] font-semibold leading-tight text-hv-ink lg:text-[1.5rem]">{tr(a.t)}</p>
                <p className="mt-1.5 text-[0.9rem] leading-[1.6] text-hv-muted lg:mt-2 lg:text-[0.98rem] lg:leading-[1.65]">{rich(tr(a.d), { methods: <PayMethods /> })}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[0.9rem] leading-[1.7] text-hv-muted lg:mt-10 lg:text-[0.95rem]">
            {rich(
              tr('Your invitation stays live through your event and three days after. There are no banners or ads on it, and nothing in your design is locked. Refund requests are considered within seven days, as the {link} sets out.'),
              {
                link: (
                  <TrackedLink href="/refund-policy" location="home_pricing_refund" className="font-semibold text-hv-forest underline decoration-hv-gold/60 underline-offset-4">
                    {tr('refund policy')}
                  </TrackedLink>
                ),
              },
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
