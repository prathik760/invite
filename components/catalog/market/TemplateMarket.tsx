'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import { Price } from '@/components/price/Price'
import { CloseIcon } from '@/components/ui/Icons'
import { trackEvent } from '@/lib/analytics'
import { useSavedDesigns } from '@/lib/savedDesigns'
import type { CatalogItem } from '@/lib/catalogItems'
import type { FeatureKey, TierKey } from '@/lib/tiers'
import MarketCard, { LEVEL_LABEL } from './MarketCard'
import ReturningShelf from './ReturningShelf'
import { useT } from '@/components/i18n/I18nProvider'
import { rich } from '@/lib/translate'

/**
 * The Templates page's catalogue: find a design by occasion, words, level and
 * what it includes, then preview or customize it.
 *
 * Everything shown is the catalogue's own data (lib/catalogItems): occasions
 * from lib/catalog, levels by price (lib/tiers), "includes" from each design's
 * builder fields. There is no free design, no publication date and no
 * popularity figure in that data, so there is no Free filter, Newest or
 * Popular here; sorting is the curated order or by price.
 *
 * With nothing chosen, the designs are laid out as three collections by
 * level, each design exactly once, all of it in the server HTML (crawlers and
 * slow phones see every card; nothing waits on a scroll animation). Choosing
 * anything switches to one result grid. The choice is mirrored in the URL
 * (?occasion=, ?level= as before, plus ?q=, ?has=, ?sort=) after hydration,
 * so a link restores it without making the server HTML depend on it.
 */
export interface OccasionNav {
  key: string
  label: string
  count: number
  image: string
  /** The design the image comes from (for its blur placeholder). */
  cover: string
}
export interface LevelInfo {
  key: TierKey
  name: string
  promise: string
  from: number
  count: number
  /** What every design in the level includes. */
  common: string[]
}
type Sort = 'recommended' | 'price-asc' | 'price-desc'
const SORTS: { key: Sort; label: string }[] = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]
const SOURCE = 'templates_page'
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
/** The last way this visitor narrowed the catalogue, kept on this device to offer back next time. */
const VIEW_KEY = 'si-templates-view'
interface SavedView {
  occasion: string
  level: 'all' | TierKey
  has: FeatureKey[]
  sort: Sort
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export default function TemplateMarket({
  items,
  occasions,
  levels,
  features,
  hay,
  placeholders,
}: {
  items: CatalogItem[]
  occasions: OccasionNav[]
  levels: LevelInfo[]
  features: { key: FeatureKey; label: string }[]
  /** Lower-case text each design is searched by: name, occasions, style, level, what it includes. */
  hay: Record<string, string>
  placeholders: Record<string, CSSProperties>
}) {
  const tr = useT()
  const [occasion, setOccasion] = useState('all')
  const [level, setLevel] = useState<'all' | TierKey>('all')
  const [has, setHas] = useState<FeatureKey[]>([])
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('recommended')
  const [sheet, setSheet] = useState(false)
  const saved = useSavedDesigns()
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])
  const results = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const lastSearch = useRef('')
  const root = useRef<HTMLDivElement>(null)
  // Collections opened past their first rows ("View all").
  const [open, setOpen] = useState<Record<string, boolean>>({})
  // The last view, offered back to a returning visitor who arrives without one.
  const [resume, setResume] = useState<SavedView | null>(null)
  const firstSave = useRef(true)

  // A link's choice, applied as soon as the page hydrates and before it is drawn again (the server
  // HTML always holds the full catalogue). The resume offer is read here too, in time for the
  // returning shelf's first paint, so the shelf keeps the size its early script gave it.
  useIsoLayoutEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const o = p.get('occasion')
    if (o && occasions.some((x) => x.key === o)) setOccasion(o)
    const l = p.get('level')
    if (l && levels.some((x) => x.key === l)) setLevel(l as TierKey)
    const h = (p.get('has') || '').split(',').filter((k): k is FeatureKey => features.some((f) => f.key === k))
    if (h.length) setHas(h)
    const s = p.get('sort')
    if (s && SORTS.some((x) => x.key === s)) setSort(s as Sort)
    const qq = p.get('q')
    if (qq) setQ(qq.slice(0, 60))
    if (!['occasion', 'level', 'has', 'sort', 'q'].some((k) => p.has(k))) {
      try {
        const v = JSON.parse(localStorage.getItem(VIEW_KEY) || 'null') as SavedView | null
        const valid =
          v &&
          (v.occasion === 'all' || occasions.some((x) => x.key === v.occasion)) &&
          (v.level === 'all' || levels.some((x) => x.key === v.level)) &&
          Array.isArray(v.has) && v.has.every((k) => features.some((f) => f.key === k)) &&
          SORTS.some((x) => x.key === v.sort)
        if (valid && (v.occasion !== 'all' || v.level !== 'all' || v.has.length || v.sort !== 'recommended')) setResume(v)
      } catch {
        /* nothing kept, or storage blocked */
      }
    }
  }, [occasions, levels, features])

  // Keep the current way of narrowing (not the search words) for next time; a cleared view forgets it.
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    try {
      if (occasion !== 'all' || level !== 'all' || has.length || sort !== 'recommended') localStorage.setItem(VIEW_KEY, JSON.stringify({ occasion, level, has, sort }))
      else localStorage.removeItem(VIEW_KEY)
    } catch {
      /* storage blocked */
    }
  }, [occasion, level, has, sort])

  // Mirror the choice in the URL (replace, so Back still leaves the page).
  useEffect(() => {
    const url = new URL(window.location.href)
    const set = (k: string, v: string, empty: string) => (v && v !== empty ? url.searchParams.set(k, v) : url.searchParams.delete(k))
    set('occasion', occasion, 'all')
    set('level', level, 'all')
    set('has', has.join(','), '')
    set('sort', sort, 'recommended')
    set('q', q.trim(), '')
    if (url.href !== window.location.href) window.history.replaceState(null, '', url)
  }, [occasion, level, has, sort, q])

  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const base = (opts: { skipLevel?: boolean; skipFeature?: FeatureKey | 'all' } = {}) =>
    items.filter(
      (i) =>
        (occasion === 'all' || i.occasions.includes(occasion)) &&
        (opts.skipLevel || level === 'all' || i.tier === level) &&
        (opts.skipFeature === 'all' ? true : has.every((f) => f === opts.skipFeature || i.features.includes(f))) &&
        words.every((w) => (hay[i.id] ?? '').includes(w)),
    )
  const matches = useMemo(() => {
    const list = base()
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, occasion, level, has, sort, q])
  const filtered = occasion !== 'all' || level !== 'all' || has.length > 0 || words.length > 0 || sort !== 'recommended'
  const activeCount = (level !== 'all' ? 1 : 0) + has.length

  // Search is reported once the visitor stops typing, not on every key.
  useEffect(() => {
    const term = q.trim().toLowerCase()
    if (term.length < 2 || term === lastSearch.current) return
    const t = window.setTimeout(() => {
      lastSearch.current = term
      trackEvent('template_search', { search_term: term.slice(0, 60), results_count: matches.length, source: SOURCE })
    }, 900)
    return () => window.clearTimeout(t)
  }, [q, matches.length])

  // Impressions: each list (a collection, or the current results) reported once when it reaches the
  // middle of the screen, with the cards actually shown in it. Results wait until the choice settles,
  // so typing a search does not report every keystroke.
  const sent = useRef(new Set<string>())
  const viewKey = `${occasion}|${level}|${has.join(',')}|${sort}|${words.join(' ')}`
  useEffect(() => {
    const el = root.current
    if (!el) return
    const timers: number[] = []
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const list = e.target as HTMLElement
          const id = list.dataset.list ?? 'list'
          const key = id === 'results' ? `results:${viewKey}` : `${id}:${open[id] ? 'all' : 'first'}`
          if (sent.current.has(key)) continue
          timers.push(
            window.setTimeout(() => {
              if (sent.current.has(key)) return
              sent.current.add(key)
              const shown = Array.from(list.querySelectorAll<HTMLElement>('article[data-tpl]')).filter((a) => a.offsetParent !== null)
              const itemsShown = shown.slice(0, 24).flatMap((a, index) => {
                const t = byId.get(a.dataset.tpl ?? '')
                return t ? [{ item_id: t.id, item_name: t.name, price: t.price, item_category: t.occasions[0] ?? 'other', item_variant: t.tier, index }] : []
              })
              trackEvent('view_item_list', { item_list_id: id, item_list_name: list.dataset.listName ?? id, items: itemsShown, items_count: shown.length, source: SOURCE })
            }, 700),
          )
        }
      },
      { rootMargin: '-30% 0px -30% 0px' },
    )
    el.querySelectorAll('[data-list]').forEach((x) => io.observe(x))
    return () => {
      io.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [viewKey, filtered, byId, open])

  // Once the page has loaded and the browser is idle, fetch the artwork of the cards already on show
  // (the first rows of each collection) instead of waiting for each to scroll near: scrolling then
  // finds them ready, with no blurred stand-in. Cards folded away, or far along the Signature row on a
  // phone, still wait; so does everything on a data-saving or slow connection.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType ?? '')) return
    let idle = 0
    const warm = () => {
      root.current?.querySelectorAll<HTMLImageElement>('article[data-tpl] img[loading="lazy"]').forEach((img) => {
        const li = img.closest('li')
        const rowIndex = li?.parentElement ? Array.prototype.indexOf.call(li.parentElement.children, li) : 0
        const inRail = li?.parentElement?.classList.contains('hv-rail') && getComputedStyle(li.parentElement).display === 'flex'
        if (img.offsetParent !== null && !(inRail && rowIndex > 2)) img.loading = 'eager'
      })
    }
    const start = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
      idle = w.requestIdleCallback ? w.requestIdleCallback(warm, { timeout: 3000 }) : window.setTimeout(warm, 1500)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      const w = window as Window & { cancelIdleCallback?: (h: number) => void }
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [])

  // The filter sheet: Escape closes it; on a phone the page behind does not scroll.
  useEffect(() => {
    if (!sheet) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(false)
    window.addEventListener('keydown', onKey)
    const phone = window.matchMedia('(max-width: 1023px)').matches
    const prev = document.body.style.overflow
    if (phone) document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('button')?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [sheet])

  const pickOccasion = (key: string) => {
    setOccasion(key)
    trackEvent('template_filter', { occasion: key, source: SOURCE })
  }
  const pickLevel = (key: 'all' | TierKey) => {
    setLevel(key)
    trackEvent('template_level', { level: key, occasion, source: SOURCE })
  }
  const toggleHas = (key: FeatureKey) => {
    const on = !has.includes(key)
    setHas((h) => (on ? [...h, key] : h.filter((x) => x !== key)))
    trackEvent('filter_apply', { filter: 'includes', value: key, action: on ? 'add' : 'remove', occasion, source: SOURCE })
  }
  const pickSort = (key: Sort) => {
    setSort(key)
    trackEvent('sort_change', { sort: key, occasion, source: SOURCE })
  }
  const clearAll = () => {
    setOccasion('all')
    setLevel('all')
    setHas([])
    setQ('')
    setSort('recommended')
  }

  const featureLabel = (k: FeatureKey) => features.find((f) => f.key === k)?.label ?? k
  const occasionLabel = occasions.find((o) => o.key === occasion)?.label

  // `collapse`: until opened, two rows (6 cards on phones and tablets, 8 on desktop). The rest stay in
  // the page for crawlers and links, only hidden.
  const grid = (list: CatalogItem[], section: string, name: string, collapse = false) => (
    <ul id={`tpl-list-${section}`} data-list={section} data-list-name={name} className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
      {list.map((t, i) => (
        <li key={t.id} className={`min-w-0 ${collapse && !open[section] ? (i >= 8 ? 'hidden' : i >= 6 ? 'max-lg:hidden' : '') : ''}`}>
          <MarketCard item={t} section={section} saved={saved.includes(t.id)} placeholder={placeholders[t.id]} />
        </li>
      ))}
    </ul>
  )
  const toggle = (key: string, count: number, label: string, dark = false, phoneHidden = false) => (
    <div className={`mt-8 flex justify-center ${phoneHidden ? 'max-sm:hidden' : ''}`}>
      <button
        type="button"
        aria-expanded={!!open[key]}
        aria-controls={`tpl-list-${key}`}
        onClick={() => {
          const next = !open[key]
          setOpen((o) => ({ ...o, [key]: next }))
          if (next) trackEvent('collection_expand', { collection: key, items_count: count, source: SOURCE })
          else document.getElementById(`tpl-level-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        className={dark ? 'hv-btn-light' : 'hv-btn-line'}
      >
        {open[key] ? tr('Show fewer') : tr('View all {n} {level} designs', { n: count, level: label })}
      </button>
    </div>
  )

  return (
    <div ref={root}>
      <ReturningShelf
        byId={byId}
        saved={saved}
        placeholders={placeholders}
        resume={
          resume
            ? {
                label: [
                  resume.occasion !== 'all' ? tr('{occasion} designs', { occasion: occasions.find((o) => o.key === resume.occasion)?.label ?? '' }) : tr('All designs'),
                  resume.level !== 'all' ? LEVEL_LABEL[resume.level] : '',
                  ...resume.has.map(featureLabel),
                  resume.sort !== 'recommended' ? SORTS.find((x) => x.key === resume.sort)?.label ?? '' : '',
                ].filter(Boolean).join(' · '),
                go: () => {
                  setOccasion(resume.occasion)
                  setLevel(resume.level)
                  setHas(resume.has)
                  setSort(resume.sort)
                  setResume(null)
                  trackEvent('continue_browsing', { occasion: resume.occasion, level: resume.level, source: SOURCE })
                  results.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                },
              }
            : undefined
        }
      />

      <div id="designs" className="hv-shell scroll-mt-20 pt-8 lg:pt-10">
        {/* Occasions: the first way in, with a real design for each and how many there are. */}
        <section id="occasions" aria-labelledby="tpl-occasions-title" className="scroll-mt-24">
          <h2 id="tpl-occasions-title" className="sr-only">
            {tr('Browse by occasion')}
          </h2>
          <div role="group" aria-label={tr('Choose an occasion')} className="hv-rail -mx-[var(--hv-gutter)] flex gap-2.5 overflow-x-auto px-[var(--hv-gutter)] pb-2 lg:mx-0 lg:flex-wrap lg:px-0">
            {[{ key: 'all', label: tr('All designs'), count: items.length, image: '', cover: '' }, ...occasions].map((o) => {
              const on = occasion === o.key
              return (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pickOccasion(o.key)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-left transition-colors ${on ? 'bg-hv-forest text-hv-ivory' : 'bg-white text-hv-ink ring-1 ring-hv-ink/10 hover:ring-hv-forest/40'}`}
                >
                  {o.image ? (
                    <Image src={o.image} alt="" width={64} height={80} sizes="40px" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" style={placeholders[o.cover]} />
                  ) : (
                    <span aria-hidden className={`grid h-10 w-10 shrink-0 grid-cols-2 gap-0.5 rounded-full p-2 ${on ? 'bg-hv-ivory/15' : 'bg-hv-linen'}`}>
                      {[0, 1, 2, 3].map((k) => (
                        <span key={k} className={`rounded-[2px] ${on ? 'bg-hv-gold' : 'bg-hv-forest/40'}`} />
                      ))}
                    </span>
                  )}
                  <span className="leading-tight">
                    <span className="block text-[14px] font-semibold">{o.label}</span>
                    <span className={`block text-[12px] ${on ? 'text-hv-ivory/80' : 'text-hv-muted'}`}>{o.count} designs</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Search, filters and sort. */}
        <div className="relative mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block lg:w-[22rem]">
            <span className="sr-only">{tr('Search designs')}</span>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[1.15rem] w-[1.15rem] -translate-y-1/2 text-hv-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value.slice(0, 60))}
              placeholder={tr('Search: palace, floral, birthday, RSVP…')}
              className="h-12 w-full rounded-full border-0 bg-white pl-11 pr-10 text-[16px] text-hv-ink lg:text-[0.98rem] ring-1 ring-hv-ink/10 placeholder:text-hv-muted/80 focus:ring-2 focus:ring-hv-forest/40"
              enterKeyHint="search"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label={tr('Clear search')} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-hv-muted hover:text-hv-ink">
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheet((s) => !s)}
              aria-expanded={sheet}
              aria-controls="tpl-filters"
              className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-[15px] font-semibold ring-1 transition-colors ${activeCount ? 'bg-hv-forest text-hv-ivory ring-hv-forest' : 'bg-white text-hv-ink ring-hv-ink/10 hover:ring-hv-forest/40'}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                <circle cx="16" cy="7" r="2" />
                <circle cx="10" cy="17" r="2" />
              </svg>
              {tr('Filters')}
              {activeCount > 0 && <span className="rounded-full bg-hv-ivory px-1.5 text-[0.75rem] text-hv-forest">{activeCount}</span>}
            </button>
            <label className="relative">
              <span className="sr-only">{tr('Sort designs')}</span>
              <select
                value={sort}
                onChange={(e) => pickSort(e.target.value as Sort)}
                className="h-11 appearance-none rounded-full border-0 bg-white pl-4 pr-9 text-[16px] font-semibold lg:text-[0.95rem] text-hv-ink ring-1 ring-hv-ink/10 focus:ring-2 focus:ring-hv-forest/40"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {tr(s.label)}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hv-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
            {/* On phones the count is read out but not shown here (no room beside Filters and Sort): each
                collection shows its own, and a filtered list shows it in the row of choices below. */}
            <p className="ml-auto text-[14px] text-hv-muted max-sm:sr-only lg:ml-3" aria-live="polite">
              {matches.length === 1 ? tr('1 design') : tr('{n} designs', { n: matches.length })}
            </p>
          </div>

          {/* Filters: a sheet from the bottom on phones, a panel under the toolbar on wide screens. */}
          {sheet && (
            <div id="tpl-filters" className="fixed inset-0 lg:absolute lg:inset-auto lg:left-0 lg:top-[calc(100%+0.6rem)]" style={{ zIndex: 'var(--z-overlay)' as unknown as number }}>
              <button type="button" aria-label={tr('Close filters')} onClick={() => setSheet(false)} className="absolute inset-0 bg-black/40 lg:hidden" tabIndex={-1} />
              <div
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-label={tr('Filters')}
                className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[1.4rem] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.35)] lg:static lg:w-[34rem] lg:rounded-[1.1rem] lg:p-6 lg:shadow-[0_30px_70px_-30px_rgba(12,43,34,0.55)] lg:ring-1 lg:ring-hv-ink/10"
              >
                <div className="flex items-center justify-between">
                  <p className="hv-serif text-[1.4rem] font-semibold text-hv-ink">Filters</p>
                  <button type="button" onClick={() => setSheet(false)} aria-label={tr('Close filters')} className="flex h-10 w-10 items-center justify-center rounded-full text-hv-ink/70 hover:bg-hv-linen">
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>

                <fieldset className="mt-4">
                  <legend className="text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-hv-muted">{tr('Level')}</legend>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {[{ key: 'all' as const, name: tr('Every level'), from: 0 }, ...[...levels].reverse()].map((l) => {
                      const n = l.key === 'all' ? base({ skipLevel: true }).length : base({ skipLevel: true }).filter((i) => i.tier === l.key).length
                      const on = level === l.key
                      return (
                        <button
                          key={l.key}
                          type="button"
                          aria-pressed={on}
                          disabled={n === 0 && !on}
                          onClick={() => pickLevel(l.key)}
                          className={`rounded-full px-3.5 py-2 text-[0.9rem] font-semibold transition-colors disabled:opacity-40 ${on ? 'bg-hv-forest text-hv-ivory' : 'bg-hv-linen text-hv-ink hover:bg-hv-linen/70'}`}
                        >
                          {l.name}
                          {l.from > 0 && (
                            <span className={`ml-1 font-normal ${on ? 'text-hv-ivory/75' : 'text-hv-muted'}`}>
                              {rich(tr('from {price}'), { price: <Price inr={l.from} /> })}
                            </span>
                          )}
                          <span className={`ml-1.5 font-normal ${on ? 'text-hv-ivory/75' : 'text-hv-muted'}`}>({n})</span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-hv-muted">{tr('The design includes')}</legend>
                  <div className="mt-2.5 grid gap-1 sm:grid-cols-2">
                    {features.map((f) => {
                      const on = has.includes(f.key)
                      const n = base({ skipFeature: f.key }).filter((i) => i.features.includes(f.key)).length
                      return (
                        <label key={f.key} className={`flex cursor-pointer items-center gap-3 rounded-[0.7rem] px-2.5 py-2.5 text-[0.95rem] ${n === 0 && !on ? 'opacity-40' : 'hover:bg-hv-linen/60'}`}>
                          <input type="checkbox" checked={on} disabled={n === 0 && !on} onChange={() => toggleHas(f.key)} className="h-[1.1rem] w-[1.1rem] rounded border-hv-ink/30 text-hv-forest focus:ring-hv-forest/40" />
                          <span className="flex-1 text-hv-ink">{f.label}</span>
                          <span className="text-[0.85rem] text-hv-muted">{n}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={() => { setLevel('all'); setHas([]) }} className="h-12 flex-1 rounded-full text-[0.95rem] font-semibold text-hv-ink ring-1 ring-hv-ink/15">
                    {tr('Clear filters')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSheet(false)
                      results.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="h-12 flex-[1.4] rounded-full bg-hv-forest text-[0.95rem] font-semibold text-hv-ivory"
                  >
                    {matches.length === 1 ? tr('Show 1 design') : tr('Show {n} designs', { n: matches.length })}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* What is chosen, each removable. */}
        {filtered && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
            <span aria-hidden className="mr-1 font-semibold text-hv-ink sm:hidden">
              {matches.length === 1 ? tr('1 design') : tr('{n} designs', { n: matches.length })}
            </span>
            {occasion !== 'all' && <Pill onClear={() => pickOccasion('all')}>{occasionLabel}</Pill>}
            {level !== 'all' && <Pill onClear={() => pickLevel('all')}>{LEVEL_LABEL[level]}</Pill>}
            {has.map((k) => (
              <Pill key={k} onClear={() => toggleHas(k)}>
                {featureLabel(k)}
              </Pill>
            ))}
            {words.length > 0 && <Pill onClear={() => setQ('')}>“{q.trim()}”</Pill>}
            {sort !== 'recommended' && <Pill onClear={() => pickSort('recommended')}>{SORTS.find((s) => s.key === sort)?.label}</Pill>}
            <button type="button" onClick={clearAll} className="px-1 font-semibold text-hv-forest underline decoration-hv-gold/60 underline-offset-4">
              {tr('Clear all')}
            </button>
          </div>
        )}

        <div ref={results} className="scroll-mt-24 pb-4 pt-8 lg:pt-10">
          {filtered ? (
            matches.length ? (
              <>
                <h2 className="sr-only">{tr('Matching designs')}</h2>
                {grid(matches, 'results', 'Search and filter results')}
              </>
            ) : (
              <div className="mx-auto max-w-[32rem] py-12 text-center">
                <p className="hv-serif text-[1.8rem] font-semibold text-hv-ink">{tr('No design matches all of that.')}</p>
                <p className="mt-2 text-[1rem] leading-[1.65] text-hv-muted">
                  {words.length ? tr('Try fewer or different words, or remove a filter.') : tr('Remove a filter to see more designs.')}
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button type="button" onClick={clearAll} className="hv-btn">
                    {tr('Show every design')}
                  </button>
                  <TrackedLink href="/#custom-template" location="templates_empty" className="hv-textlink">
                    {tr('Or ask us to design one')}
                  </TrackedLink>
                </div>
              </div>
            )
          ) : (
            // Nothing chosen: the three levels as collections, each design once.
            <div className="space-y-12 lg:space-y-16">
              {levels.map((l) => {
                const list = items.filter((i) => i.tier === l.key)
                const signature = l.key === 'signature'
                return (
                  <section key={l.key} aria-labelledby={`tpl-level-${l.key}`} className={`scroll-mt-24 ${signature ? '-mx-[var(--hv-gutter)] rounded-none bg-hv-deep px-[var(--hv-gutter)] py-9 text-hv-ivory sm:mx-0 sm:rounded-[1.6rem] sm:px-8 lg:px-12 lg:py-12' : ''}`}>
                    <header className="grid gap-3 lg:grid-cols-[1fr_1.2fr] lg:items-end lg:gap-10">
                      <div>
                        <p className={`hv-kicker max-sm:!text-[11.5px] ${signature ? '!text-hv-gold' : ''}`}>{signature ? tr('The Signature collection') : tr('{level} designs', { level: l.name })}</p>
                        <h2 id={`tpl-level-${l.key}`} className={`hv-serif mt-3 text-[1.9rem] font-medium leading-[1.1] sm:text-[2.3rem] ${signature ? 'text-hv-ivory' : 'text-hv-ink'}`}>
                          {signature ? tr('Complete wedding suites, made to be remembered') : l.key === 'premium' ? tr('Richer artwork, more to explore') : tr('Beautiful, quick and kind to your budget')}
                        </h2>
                      </div>
                      <div className={`text-[0.98rem] leading-[1.65] ${signature ? 'text-hv-ivory/75' : 'text-hv-muted'}`}>
                        <p className="max-sm:hidden">{l.promise}</p>
                        <p className="text-[0.92rem] sm:mt-2">
                          <span className={`font-semibold ${signature ? 'text-hv-gold' : 'text-hv-forest'}`}>
                            {rich(tr('From {price}'), { price: <Price inr={l.from} /> })}
                          </span>
                          {' · '}
                          {tr('{n} designs', { n: l.count })}
                          {l.common.length > 0 && <> · {tr('every one includes {list}', { list: l.common.join(', ').toLowerCase() })}</>}
                        </p>
                      </div>
                    </header>
                    <div className="mt-6 lg:mt-8">
                      {signature ? (
                        // Phones: every suite in one row to swipe. Larger screens: two rows, then View all.
                        <ul id="tpl-list-signature" data-list="signature" data-list-name="The Signature collection" className="hv-rail -mx-[var(--hv-gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--hv-gutter)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:px-0 lg:grid-cols-3">
                          {list.map((t, i) => (
                            <li key={t.id} className={`w-[78%] shrink-0 snap-start sm:w-auto ${open.signature ? '' : i >= 6 ? 'sm:hidden' : i >= 4 ? 'sm:max-lg:hidden' : ''}`}>
                              <MarketCard item={t} section="signature" saved={saved.includes(t.id)} placeholder={placeholders[t.id]} feature dark priority={i < 2} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        grid(list, l.key, `${LEVEL_LABEL[l.key]} designs`, true)
                      )}
                    </div>
                    {list.length > (signature ? 4 : 6) && toggle(l.key, list.length, l.name, signature, signature)}
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Pill({ children, onClear }: { children: ReactNode; onClear: () => void }) {
  const tr = useT()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white py-1 pl-3 pr-1 text-hv-ink ring-1 ring-hv-ink/10">
      {children}
      <button type="button" onClick={onClear} aria-label={tr('Remove')} className="flex h-7 w-7 items-center justify-center rounded-full text-hv-muted hover:bg-hv-linen hover:text-hv-ink">
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </span>
  )
}
