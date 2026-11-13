'use client'

import { useState, type CSSProperties } from 'react'
import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import TrackedLink from '@/components/ui/TrackedLink'
import PreviewButton from '@/components/catalog/PreviewButton'
import { Price } from '@/components/price/Price'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * "For celebrations that deserve something extraordinary": the Signature
 * wedding suites on deep forest green, laid out like a stationer's portfolio.
 * On a wide screen the suite in focus is shown large, the next tucked behind
 * it, with the list as the index (point, focus or tap to bring one forward).
 * On a phone the covers themselves are the list, one large card at a time.
 */
export interface Suite {
  id: string
  name: string
  note: string
  price: number
  image: string
  slug: string
  /** A blur of the cover, painted behind it until it loads (lib/designPlaceholders). */
  ph?: CSSProperties
}

/**
 * The suite's strongest promises, each shown only if every Signature suite in
 * the list has it (the feature labels come from the catalogue, see `includes`).
 * The opening is the Signature level's own promise (lib/tiers.ts).
 */
const BENEFITS: { t: string; needs?: string }[] = [
  { t: 'A grand opening your guests tap to reveal' },
  { t: 'Every function of the week on its own card', needs: 'Each function on its own card' },
  { t: 'Travel and FAQs for your guests', needs: 'Travel & FAQs for guests' },
  { t: 'Replies that come to you on WhatsApp', needs: 'WhatsApp RSVP' },
]

export default function PremiumSpread({ suites, includes }: { suites: Suite[]; includes: string[] }) {
  const tr = useT()
  const [on, setOn] = useState(0)
  const next = (on + 1) % suites.length
  const s = suites[on]
  // `includes` may arrive in English or already translated: match the feature label either way.
  const benefits = BENEFITS.filter((b) => !b.needs || includes.includes(b.needs) || includes.includes(tr(b.needs)))

  return (
    <section id="signature" aria-labelledby="hv-premium-title" className="hv-on-dark relative overflow-hidden bg-hv-deep text-hv-ivory">
      <div className="hv-shell hv-sec relative">
        {/* minmax(0,1fr): the phone rail must scroll inside its column, not widen it. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-20">
          {/* Wide screens: the suite in focus, large, with the others as a strip to bring forward. */}
          <div className="relative max-lg:hidden" data-reveal="scale">
            <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[36rem]">
              <div className="absolute right-0 top-[4%] w-[46%] overflow-hidden rounded-[0.6rem] opacity-60 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]" style={{ transform: 'rotate(4deg)' }} aria-hidden>
                <Image key={suites[next].id} src={suites[next].image} alt="" width={480} height={600} sizes="280px" className="block h-auto w-full" style={suites[next].ph} />
              </div>
              <div className="absolute bottom-0 left-0 w-[76%] overflow-hidden rounded-[0.7rem] shadow-[0_60px_110px_-40px_rgba(0,0,0,0.9)] ring-1 ring-hv-gold/35" style={s.ph}>
                {suites.map((x, i) => (
                  <Image
                    key={x.id}
                    src={x.image}
                    alt={i === on ? tr('{name} wedding invitation', { name: x.name }) : ''}
                    width={480}
                    height={600}
                    sizes="(max-width: 1280px) 40vw, 440px"
                    className={`block h-auto w-full transition-opacity duration-700 ${i === on ? 'relative opacity-100' : 'absolute inset-0 opacity-0'}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <Link href={`/templates/${s.slug}`} prefetch={false} className="hv-serif text-[1.9rem] italic leading-none text-hv-gold hover:underline">
                {s.name}
              </Link>
              <p className="text-[1rem] text-hv-ivory/70">{tr(s.note)}</p>
              <Price inr={s.price} className="text-[1.05rem] font-semibold text-hv-ivory" />
              <span className="flex gap-4 text-[0.95rem] font-semibold">
                <PreviewButton templateId={s.id} source="home_premium" ariaLabel={tr('Preview {name}', { name: s.name })} className="text-hv-ivory underline decoration-hv-gold/60 underline-offset-4 hover:decoration-hv-gold">
                  {tr('Preview')}
                </PreviewButton>
                <TrackedLink href={`/create?template=${s.id}`} location="home_premium" meta={{ template_id: s.id }} className="text-hv-ivory underline decoration-hv-gold/60 underline-offset-4 hover:decoration-hv-gold">
                  {tr('Customize')}
                </TrackedLink>
              </span>
            </div>
            <ul className="mt-6 flex gap-2.5" aria-label={tr('Signature suites')}>
              {suites.map((x, i) => (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => setOn(i)}
                    onMouseEnter={() => setOn(i)}
                    onFocus={() => setOn(i)}
                    aria-label={tr('Show {name}, {note}', { name: x.name, note: tr(x.note) })}
                    aria-pressed={on === i}
                    className={`block w-12 overflow-hidden rounded-[0.35rem] ring-1 transition ${on === i ? 'ring-2 ring-hv-gold' : 'opacity-60 ring-hv-ivory/20 hover:opacity-100'}`}
                  >
                    <Image src={x.image} alt="" width={128} height={160} sizes="48px" className="block aspect-[4/5] h-auto w-full object-cover object-top" style={x.ph} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Phones: heading, the covers, a line, three benefits, the button. Wide screens: the text column. */}
          <div className="flex min-w-0 flex-col">
            <div className="order-1" data-reveal>
              <p className="hv-kicker">{tr('The Signature collection')}</p>
              <h2 id="hv-premium-title" className="hv-h2 mt-5 text-hv-ivory lg:max-w-[30rem]">
                {tr('For celebrations that deserve something extraordinary.')}
              </h2>
            </div>

            {/* Phones and tablets: the covers themselves, one large card at a time. */}
            <ul className="hv-rail order-2 -mx-[var(--hv-gutter)] mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--hv-gutter)] pb-2 lg:hidden">
              {suites.map((x) => (
                <li key={x.id} className="w-[74%] shrink-0 snap-start sm:w-[44%]">
                  <Link href={`/templates/${x.slug}`} prefetch={false} className="block">
                    <Image src={x.image} alt={tr('{name} wedding invitation', { name: x.name })} width={480} height={600} sizes="(max-width: 640px) 74vw, 44vw" className="block aspect-[4/5] h-auto w-full rounded-[0.7rem] object-cover object-top ring-1 ring-hv-gold/25" style={x.ph} />
                    <span className="mt-3 flex items-baseline justify-between gap-3">
                      <span className="hv-serif text-[1.5rem] leading-tight text-hv-ivory">{x.name}</span>
                      <Price inr={x.price} className="shrink-0 text-[1rem] text-hv-gold" />
                    </span>
                    <span className="mt-0.5 block text-[0.92rem] text-hv-ivory/65">{tr(x.note)}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="order-3 mt-6 max-w-[30rem] text-[1.08rem] leading-[1.7] text-hv-ivory/70 max-lg:mt-7" data-reveal>
              {tr('Complete wedding suites, made for the whole week of your celebrations.')}
            </p>
            <ul className="order-4 mt-6 space-y-3 text-[1.02rem] text-hv-ivory/85" data-reveal>
              {benefits.map((b, i) => (
                <li key={b.t} className={`flex items-baseline gap-3 ${i === 3 ? 'max-lg:hidden' : ''}`}>
                  <span className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rotate-45 bg-hv-gold" aria-hidden />
                  {tr(b.t)}
                </li>
              ))}
            </ul>
            <TrackedLink href="/templates/category/signature" location="home_premium" className="hv-btn-light order-5 mt-9 max-lg:w-full lg:self-start">
              {tr('Explore the Signature collection')}
              <ArrowRightIcon className="h-4 w-4" />
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  )
}
