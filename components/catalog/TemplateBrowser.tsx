'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { CatalogItem } from '@/lib/catalogItems'
import TemplateCard from '@/components/catalog/TemplateCard'
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
 */
export default function TemplateBrowser({
  items,
  chips,
  source,
  limit,
  syncUrl = false,
  showCount = true,
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
}) {
  const [active, setActive] = useState('all')

  useEffect(() => {
    if (!syncUrl) return
    const requested = new URLSearchParams(window.location.search).get('occasion')
    if (requested && chips.some((c) => c.key === requested)) setActive(requested)
  }, [syncUrl, chips])

  const choose = (key: string) => {
    setActive(key)
    trackEvent('template_filter', { occasion: key, source })
    if (syncUrl) {
      const url = new URL(window.location.href)
      if (key === 'all') url.searchParams.delete('occasion')
      else url.searchParams.set('occasion', key)
      window.history.replaceState(null, '', url)
    }
  }

  const matches = active === 'all' ? items : items.filter((i) => i.occasions.includes(active))
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

      {showCount ? (
        <p className="mt-4 text-[0.85rem] text-muted" aria-live="polite">
          {matches.length} {matches.length === 1 ? 'design' : 'designs'}
          {active !== 'all' && ` for ${chips.find((c) => c.key === active)?.label.toLowerCase()}`}
        </p>
      ) : (
        <span className="sr-only" aria-live="polite">{matches.length} designs shown</span>
      )}

      <div data-reveal-group className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((item, i) => (
          <TemplateCard key={item.id} item={item} source={source} priority={i < 2 && !limit} />
        ))}
      </div>

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
