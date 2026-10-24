'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { CatalogItem } from '@/lib/catalogItems'
import TemplateCard from '@/components/catalog/TemplateCard'
import TieredGrid from '@/components/catalog/TieredGrid'
import { TIERS, TIER_MAP, type TierKey } from '@/lib/tiers'
import { withLocalPrices } from '@/components/price/localised'
import { trackEvent } from '@/lib/analytics'
import { ArrowRightIcon } from '@/components/ui/Icons'

/**
 * Occasion-filtered template grid.
 *
 * The server renders every card under "All", so the full catalogue is in the
 * HTML for crawlers whatever filter a visitor later picks. A deep link such as
 * /templates?occasion=festival is applied after hydration — reading it with
 * useSearchParams would force a client-only render of this subtree and drop the
 * cards from the static HTML.
 *
 * With `tiered`, the designs are grouped by level (Signature, Premium,
 * Classic) and a second row of chips picks one level, each showing its
 * lowest price for the chosen occasion: a visitor can shop by budget or by
 * how grand they want it.
 */
export default function TemplateBrowser({
  items,
  chips,
  source,
  limit,
  syncUrl = false,
  showCount = true,
  tiered = false,
  phoneRail = false,
}: {
  items: CatalogItem[]
  chips: { key: string; label: string }[]
  source: string
  /** Cap the "All" view (homepage). Occasion views always show every match. */
  limit?: number
  /** Mirror the filter in ?occasion= so the view can be shared and restored. */
  syncUrl?: boolean
  /** The "N designs" line. Off on the homepage, where it reads as a catalogue count. */
  showCount?: boolean
  /** Group by level and offer a level filter (the catalogue page). */
  tiered?: boolean
  /** On a phone, the cards as one row you swipe through (the homepage). */
  phoneRail?: boolean
}) {
  const [active, setActive] = useState('all')
  const [level, setLevel] = useState<'all' | TierKey>('all')
  // Set once a filter has changed what is shown: grids added from then on show at once (see TieredGrid).
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!syncUrl) return
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('occasion')
    if (requested && chips.some((c) => c.key === requested)) {
      setActive(requested)
      setTouched(true)
    }
    const lv = params.get('level')
    if (tiered && lv && lv in TIER_MAP) {
      setLevel(lv as TierKey)
      setTouched(true)
    }
  }, [syncUrl, chips, tiered])

  const choose = (key: string) => {
    setActive(key)
    setTouched(true)
    trackEvent('template_filter', { occasion: key, source })
    if (syncUrl) {
      const url = new URL(window.location.href)
      if (key === 'all') url.searchParams.delete('occasion')
      else url.searchParams.set('occasion', key)
      window.history.replaceState(null, '', url)
    }
  }

  const chooseLevel = (key: 'all' | TierKey) => {
    setLevel(key)
    setTouched(true)
    trackEvent('template_level', { level: key, occasion: active, source })
    if (syncUrl) {
      const url = new URL(window.location.href)
      if (key === 'all') url.searchParams.delete('level')
      else url.searchParams.set('level', key)
      window.history.replaceState(null, '', url)
    }
  }

  const forOccasion = active === 'all' ? items : items.filter((i) => i.occasions.includes(active))
  // The level chips, cheapest first, for the levels this occasion has.
  const levels = tiered
    ? [...TIERS].reverse().map((t) => ({ tier: t, list: forOccasion.filter((i) => i.tier === t.key) })).filter((l) => l.list.length > 0)
    : []
  // A level this occasion doesn't have (from a link, say) shows every level instead of nothing.
  const shownLevel = level !== 'all' && levels.some((l) => l.tier.key === level) ? level : 'all'
  const matches = tiered && shownLevel !== 'all' ? forOccasion.filter((i) => i.tier === shownLevel) : forOccasion
  const visible = active === 'all' && limit ? matches.slice(0, limit) : matches
  const hidden = matches.length - visible.length

  return (
    <div>
      <div
        role="group"
        aria-label="Filter designs by occasion"
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {[{ key: 'all', label: 'All designs' }, ...chips].map((chip) => {
          const on = chip.key === active
          return (
            <button
              key={chip.key}
              type="button"
              aria-pressed={on}
              onClick={() => choose(chip.key)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-[0.85rem] font-semibold transition-colors ${
                on
                  ? 'border-emerald bg-emerald text-paper'
                  : 'border-line bg-paper text-charcoal hover:border-burnished'
              }`}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {levels.length > 1 && (
        <div role="group" aria-label="Filter designs by level" className="scrollbar-hide -mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <span className="shrink-0 pr-1 text-[0.8rem] font-semibold text-muted">Level</span>
          {[{ key: 'all' as const, name: 'Every level', from: 0 }, ...levels.map((l) => ({ key: l.tier.key, name: l.tier.name, from: Math.min(...l.list.map((i) => i.price)) }))].map((chip) => {
            const on = chip.key === shownLevel
            return (
              <button
                key={chip.key}
                type="button"
                aria-pressed={on}
                onClick={() => chooseLevel(chip.key)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.8rem] font-semibold transition-colors ${
                  on ? 'border-charcoal bg-charcoal text-paper' : 'border-line bg-champagne text-charcoal hover:border-burnished'
                }`}
              >
                {chip.name}
                {chip.from > 0 && <span className={`ml-1.5 font-normal tabular-nums ${on ? 'text-paper/75' : 'text-muted'}`}>{withLocalPrices(`from ₹${chip.from.toLocaleString('en-IN')}`)}</span>}
              </button>
            )
          })}
        </div>
      )}

      {showCount ? (
        <p className="mt-4 text-[0.85rem] text-muted" aria-live="polite">
          {matches.length} {matches.length === 1 ? 'design' : 'designs'}
          {active !== 'all' && ` for ${chips.find((c) => c.key === active)?.label.toLowerCase()}`}
          {tiered && shownLevel !== 'all' && ` at ${TIER_MAP[shownLevel].name}`}
        </p>
      ) : (
        <span className="sr-only" aria-live="polite">{matches.length} designs shown</span>
      )}

      {tiered && !limit ? (
        <div className="mt-8">
          <TieredGrid items={visible} source={source} revealed={touched} />
        </div>
      ) : (
        <div data-reveal-group className={`mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 ${phoneRail ? 'phone-rail max-sm:mt-5' : ''}`} style={phoneRail ? { ['--rail' as string]: '62%' } : undefined}>
          {visible.map((item, i) => (
            <TemplateCard key={item.id} item={item} source={source} priority={i < 2 && !limit} />
          ))}
        </div>
      )}

      {hidden > 0 && (
        <div className="mt-10 text-center">
          <Link
            href="/templates"
            className="btn-outline inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold"
          >
            See every design
            <ArrowRightIcon />
          </Link>
        </div>
      )}
    </div>
  )
}
