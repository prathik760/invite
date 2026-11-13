'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Image from '@/components/ui/Image'
import PreviewButton from '@/components/catalog/PreviewButton'
import { Price } from '@/components/price/Price'
import { ArrowRightIcon, CloseIcon, EyeIcon } from '@/components/ui/Icons'
import { trackEvent } from '@/lib/analytics'
import { useT } from '@/components/i18n/I18nProvider'
import { rich } from '@/lib/translate'

/**
 * Every design with its price, grouped by occasion (the Pricing page's price list).
 *
 * Built from the same catalogue items as the Templates page (lib/catalogItems, so
 * lib/plans templatePrice): no price is written here. Each entry is a real link to the
 * design's own page, so the list stays crawlable and works without JavaScript; a plain
 * click opens the live preview instead, whose "Customize this invitation" goes on to the
 * builder.
 *
 * A long occasion shows its first six (cheapest first) and a "Show all" button; every
 * entry is still in the page. A search shows every match, in any occasion.
 */
export interface PriceEntry {
  id: string
  name: string
  price: number
  slug: string
  image: string
  level: string
  /** Short names of what the design holds, most telling first. */
  holds: string[]
  /** Lower-case words it is found by: name, occasions, style, level. */
  hay: string
}

export interface PriceGroup {
  key: string
  label: string
  /** One of them, in lower case: "wedding", "festival". */
  one: string
  entries: PriceEntry[]
}

/** Shown before 'Show all': four on a phone, six (three rows of two) from a laptop up. */
const FIRST_PHONE = 4
const FIRST = 6
const SOURCE = 'pricing_catalogue'

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export default function PriceCatalogue({ groups, placeholders }: { groups: PriceGroup[]; placeholders: Record<string, CSSProperties> }) {
  const tr = useT()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const lastSearch = useRef('')
  const total = useMemo(() => groups.reduce((n, g) => n + g.entries.length, 0), [groups])

  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const shown = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, entries: words.length ? g.entries.filter((e) => words.every((w) => e.hay.includes(w))) : g.entries }))
        .filter((g) => g.entries.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, words.join(' ')],
  )
  const matches = shown.reduce((n, g) => n + g.entries.length, 0)

  // A search is reported once the visitor stops typing, not per keystroke.
  useEffect(() => {
    const term = q.trim().toLowerCase()
    if (!term || term === lastSearch.current) return
    const t = setTimeout(() => {
      lastSearch.current = term
      trackEvent('template_search', { search_term: term.slice(0, 60), results_count: matches, source: SOURCE })
    }, 900)
    return () => clearTimeout(t)
  }, [q, matches])

  const select = (e: PriceEntry, group: PriceGroup, index: number) =>
    trackEvent('select_item', {
      item_list_id: SOURCE,
      item_list_name: 'Pricing: every design with its price',
      template_id: e.id,
      template_name: e.name,
      price: e.price,
      category: group.key,
      source_section: SOURCE,
      items: [{ item_id: e.id, item_name: e.name, price: e.price, item_category: group.key, item_variant: e.level, index }],
    })

  return (
    <div>
      {/* Find a design: by name or occasion, or jump to an occasion. */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block shrink-0 lg:w-[22rem]">
          <span className="sr-only">{tr('Search designs by name or occasion')}</span>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value.slice(0, 60))}
            onKeyDown={(e) => e.key === 'Escape' && setQ('')}
            placeholder={tr('Search: Rajwada, birthday, Diwali…')}
            enterKeyHint="search"
            className="h-12 w-full rounded-full border border-line bg-paper pl-11 pr-11 text-[16px] text-charcoal placeholder:text-muted/80 focus:border-emerald-soft focus:outline-none focus:ring-2 focus:ring-emerald-soft/25 sm:text-[0.95rem]"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label={tr('Clear search')} className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-charcoal/60 hover:bg-peach">
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
        <nav aria-label={tr('Jump to an occasion')} className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 lg:justify-end">
          {groups.map((g) => (
            <a
              key={g.key}
              href={`#price-${g.key}`}
              onClick={() => setQ('')}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 text-[0.9rem] font-medium text-charcoal transition-colors hover:border-burnished/60"
            >
              {g.label}
              <span className="text-[0.8rem] text-muted">{g.entries.length}</span>
            </a>
          ))}
        </nav>
      </div>

      <p className="mt-4 text-[0.88rem] text-muted" aria-live="polite">
        {words.length ? (matches ? tr('{n} of {total} designs match “{q}”', { n: matches, total, q: q.trim() }) : '') : tr('{total} designs, each with one price, paid once', { total })}
      </p>

      {words.length > 0 && matches === 0 && (
        <div className="mt-6 rounded-2xl border border-line bg-paper p-6 text-center">
          <p className="font-editorial text-[1.4rem] font-semibold">{tr('No design matches “{q}”', { q: q.trim() })}</p>
          <p className="mt-1 text-[0.95rem] text-muted">{tr('Try an occasion, like wedding, birthday or Diwali, or a design’s name.')}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setQ('')} className="btn-outline inline-flex min-h-[44px] items-center rounded-full px-5 text-[0.95rem] font-semibold">
              {tr('Clear search')}
            </button>
            <a href="/templates" className="inline-flex min-h-[44px] items-center gap-1.5 px-2 text-[0.95rem] font-semibold text-emerald-soft hover:underline">
              {tr('Browse all designs')} <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-4 sm:space-y-5">
        {shown.map((g) => {
          const full = groups.find((x) => x.key === g.key) ?? g
          const n = full.entries.length
          const long = !words.length && n > FIRST_PHONE
          const expanded = !!open[g.key] || words.length > 0
          const lo = Math.min(...g.entries.map((e) => e.price))
          const hi = Math.max(...g.entries.map((e) => e.price))
          return (
            <section key={g.key} id={`price-${g.key}`} aria-labelledby={`price-${g.key}-title`} className="scroll-mt-28 rounded-[1.4rem] border border-line bg-paper px-4 pb-2 pt-4 sm:px-6 sm:pt-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 id={`price-${g.key}-title`} className="eyebrow">
                  {g.label}
                </h3>
                <span className="text-[0.85rem] text-muted">
                  {g.entries.length === 1 ? tr('1 design') : tr('{n} designs', { n: g.entries.length })}
                  {' · '}
                  {lo === hi ? (
                    g.entries.length > 1 ? rich(tr('{price} each'), { price: <Price inr={lo} /> }) : <Price inr={lo} />
                  ) : (
                    rich(tr('{from} to {to}'), { from: <Price inr={lo} />, to: <Price inr={hi} /> })
                  )}
                </span>
              </div>
              {/* Two columns from a laptop up, so a long occasion never leaves an empty box beside it. */}
              <ul id={`price-${g.key}-list`} className="mt-2 grid grid-cols-1 sm:gap-x-8 lg:grid-cols-2">
                {g.entries.map((e, i) => (
                  <li key={e.id} data-tpl={e.id} className={`min-w-0 border-t border-line first:border-t-0 lg:[&:nth-child(2)]:border-t-0 ${long && !expanded ? (i >= FIRST ? 'hidden' : i >= FIRST_PHONE ? 'max-lg:hidden' : '') : ''}`}>
                    <PreviewButton
                      templateId={e.id}
                      source={SOURCE}
                      href={`/templates/${e.slug}`}
                      onOpen={() => select(e, g, i)}
                      className="group flex min-h-[68px] items-center gap-3.5 py-2.5"
                    >
                      <span className="relative h-[55px] w-[44px] shrink-0 overflow-hidden rounded-md border border-line bg-peach" style={placeholders[e.id]}>
                        <Image src={e.image} alt="" fill sizes="44px" className="object-cover object-top" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-editorial text-[1.2rem] font-semibold leading-tight text-charcoal group-hover:text-emerald-soft">{e.name}</span>
                        <span className="mt-0.5 block truncate text-[0.8rem] text-muted">
                          {e.level}
                          {e.holds.length > 0 && ` · ${e.holds.join(', ')}`}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-editorial text-[1.35rem] font-semibold tabular-nums leading-tight text-charcoal">
                          <Price inr={e.price} />
                        </span>
                        <span className="mt-0.5 flex items-center justify-end gap-1 text-[0.78rem] font-semibold text-emerald-soft">
                          <EyeIcon className="h-3.5 w-3.5" /> {tr('Preview')}
                        </span>
                      </span>
                    </PreviewButton>
                  </li>
                ))}
              </ul>
              {long && (
                <div className={`border-t border-line py-2 ${n <= FIRST && !expanded ? 'lg:hidden' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`price-${g.key}-list`}
                    onClick={() => {
                      const next = !open[g.key]
                      setOpen((o) => ({ ...o, [g.key]: next }))
                      if (next) trackEvent('collection_expand', { collection: g.key, items_count: n, source: SOURCE })
                      else document.getElementById(`price-${g.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-[0.95rem] font-semibold text-emerald-soft hover:underline"
                  >
                    {expanded ? tr('Show fewer') : tr('Show all {n} {kind} designs', { n, kind: g.one })}
                    <ArrowRightIcon className={`h-3.5 w-3.5 transition-transform ${expanded ? '-rotate-90' : 'rotate-90'}`} />
                  </button>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
