import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { Price } from '@/components/price/Price'
import { OCCASION_MAP } from '@/lib/catalog'
import { templatePrice } from '@/lib/plans'
import { templateImage } from '@/lib/templateMedia'
import { designPlaceholder } from '@/lib/designPlaceholders'
import { serverT } from '@/lib/serverLang'
import { rich } from '@/lib/translate'

/**
 * "Find the perfect invitation for your moment": six occasions as a magazine
 * spread, each shown by one of its own designs (not a stock photo), with how
 * many designs it has and where its prices start, read from the catalogue.
 * Tiles differ in shape on every screen (a large lead, tall and wide ones), so
 * the grid never reads as a row of identical cards.
 *
 * Every cover is a 4:5 portrait (960x1200). On phones and tablets (13 Nov 2026)
 * the picture keeps that shape and the label sits under it, or beside it on the
 * two full-width tiles, so the whole design shows. The tiles used to have a
 * fixed shape with the label inside it, which left the picture whatever height
 * was over: the anniversary design was cut to a 115px slice, names were cut in
 * half. On a computer the spread is as it was.
 */
type Phone = 'half' | 'side'
type Desk = 'stack' | 'side'
const TILES: { key: string; label: string; href: string; cover: string; li: string; phone: Phone; desk: Desk }[] = [
  { key: 'wedding', label: 'Wedding', href: '/wedding-invitation', cover: 'signature-rajwada', li: 'col-span-2 lg:row-span-2', phone: 'side', desk: 'stack' },
  { key: 'engagement', label: 'Engagement', href: '/engagement-invitation', cover: 'indian-engagement', li: '', phone: 'half', desk: 'stack' },
  { key: 'birthday', label: 'Birthday', href: '/birthday-invitation', cover: 'birthday-gala', li: 'lg:row-span-2', phone: 'half', desk: 'stack' },
  { key: 'anniversary', label: 'Anniversary', href: '/anniversary-invitation', cover: 'anniversary', li: '', phone: 'half', desk: 'stack' },
  { key: 'baby', label: 'Baby shower & naming', href: '/templates?occasion=baby', cover: 'baby-shower', li: 'lg:col-span-2', phone: 'half', desk: 'side' },
  { key: 'home', label: 'Housewarming', href: '/griha-pravesh-invitation', cover: 'griha-pravesh', li: 'col-span-2', phone: 'side', desk: 'side' },
]

/** The classes of each part of a tile, phone first, then the computer's spread (lg:). */
function tileClasses(phone: Phone, desk: Desk) {
  return {
    link: [
      'hv-lift group flex h-full overflow-hidden rounded-[0.9rem] bg-hv-deep',
      phone === 'side' ? 'flex-row' : 'flex-col',
      desk === 'side' ? 'lg:flex-row-reverse' : 'lg:flex-col',
    ].join(' '),
    picture: [
      'hv-zoom relative block min-h-0 aspect-[4/5]',
      phone === 'side' ? 'w-[46%] shrink-0' : 'w-full',
      // A wide, one-row tile on a computer (Baby shower, Housewarming) is too short to crop a tall
      // design from the top, so there the whole invitation stands beside its label instead.
      desk === 'side' ? 'lg:h-full lg:w-auto lg:flex-none' : 'lg:aspect-auto lg:w-full lg:flex-1',
    ].join(' '),
    label: [
      'flex gap-3',
      phone === 'side' ? 'min-w-0 flex-1 flex-col items-start justify-end p-4 sm:p-6' : 'items-end justify-between px-4 py-3.5 sm:px-5 sm:py-4',
      desk === 'side'
        ? 'lg:min-w-0 lg:flex-1 lg:flex-col lg:items-start lg:justify-end lg:p-6'
        : 'lg:flex-none lg:flex-row lg:items-end lg:justify-between lg:px-5 lg:py-4',
    ].join(' '),
  }
}

export default function OccasionGrid() {
  const tr = serverT()
  return (
    <section id="occasions" aria-labelledby="hv-occasions-title" className="hv-sec">
      <div className="hv-shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <h2 id="hv-occasions-title" className="hv-h2 lg:max-w-[34rem]">
            {tr('Find the perfect invitation for your moment.')}
          </h2>
          <TrackedLink href="/templates" location="home_occasions_all" className="hv-btn-line shrink-0 self-start sm:self-auto">
            {tr('Explore all designs')}
            <ArrowRightIcon className="h-4 w-4" />
          </TrackedLink>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:auto-rows-[17.5rem] lg:grid-cols-4 lg:gap-5" data-reveal-group>
          {TILES.map((t, i) => {
            const ids = OCCASION_MAP[t.key]?.templateIds ?? []
            const prices = ids.map((id) => templatePrice(id)).filter((p) => p > 0)
            const from = prices.length ? Math.min(...prices) : 0
            const lead = i === 0
            const c = tileClasses(t.phone, t.desk)
            // "View designs": on phones beside the label of the full-width tiles; on a computer, on
            // hover, on the wide tiles.
            const deskWide = t.li.includes('col-span-2')
            const view = t.phone === 'side' || deskWide
            const viewCls = `${t.phone === 'side' ? 'inline-flex' : 'hidden'} ${deskWide ? 'lg:hidden lg:[@media(hover:hover)]:inline-flex' : 'lg:hidden'}`
            return (
              <li key={t.key} className={t.li}>
                <TrackedLink href={t.href} location="home_occasions" meta={{ occasion: t.key }} className={c.link}>
                  {/* Behind the picture, a blur of the same design: never an empty tile while it loads. */}
                  <span className={c.picture} style={designPlaceholder(t.cover)}>
                    <Image src={templateImage(t.cover)} alt="" fill sizes={lead ? '(max-width: 1024px) 46vw, 620px' : '(max-width: 1024px) 46vw, 320px'} className="object-cover object-top" />
                  </span>
                  {/* The label on a band of its own, never over the design's own lettering. */}
                  <span className={c.label}>
                    <span className="min-w-0">
                      <span className={`hv-serif block font-medium leading-[1.05] text-hv-ivory ${lead ? 'text-[1.9rem] sm:text-[2.5rem]' : 'text-[1.3rem] sm:text-[1.7rem]'}`}>{tr(t.label)}</span>
                      <span className="mt-1 block text-[0.82rem] text-hv-ivory/75 sm:text-[0.9rem]">
                        {from > 0
                          ? rich(ids.length === 1 ? tr('{n} design · from {price}', { n: ids.length }) : tr('{n} designs · from {price}', { n: ids.length }), { price: <Price inr={from} /> })
                          : ids.length === 1
                            ? tr('{n} design', { n: ids.length })
                            : tr('{n} designs', { n: ids.length })}
                      </span>
                    </span>
                    {view && (
                      <span className={`hv-reveal-line shrink-0 items-center gap-1.5 text-[0.9rem] font-semibold text-hv-gold ${viewCls}`} aria-hidden>
                        {tr('View designs')} <ArrowRightIcon className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </span>
                </TrackedLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
