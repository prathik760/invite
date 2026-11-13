'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import TrackedLink from '@/components/ui/TrackedLink'
import PreviewButton from '@/components/catalog/PreviewButton'
import { Price } from '@/components/price/Price'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { trackEvent } from '@/lib/analytics'
import { recentDesigns } from '@/lib/recentDesigns'
import type { CatalogItem } from '@/lib/catalogItems'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * "Designed to make every first impression unforgettable": the catalogue as
 * a design shop. Large previews, three across, each with its real price and
 * level; on a mouse, Preview and Customize rise over the design on hover, on
 * a touch screen they sit under it. Filters work on the real data (occasion,
 * and level by price). A returning visitor sees the designs they last looked
 * at first (lib/recentDesigns, on this device only).
 *
 * Cards stay mounted across filter taps and never wait on a scroll reveal: a
 * grid that client state swaps must not depend on data-reveal-group.
 */
const SHOWN = 9

export interface LevelChip {
  key: string
  label: string
  from: number
}

const LEVEL_NAME: Record<string, string> = { classic: 'Classic', premium: 'Premium', signature: 'Signature' }

function Actions({ t, className }: { t: CatalogItem; className: string }) {
  const tr = useT()
  return (
    <div className={className}>
      <PreviewButton templateId={t.id} source="home_featured" ariaLabel={tr('Preview {name}', { name: t.name })} className="flex-1 rounded-full bg-hv-ivory px-3 py-3 text-[0.92rem] font-semibold text-hv-deep shadow-sm ring-1 ring-hv-ink/10 transition-colors hover:bg-white">
        {tr('Preview design')}
      </PreviewButton>
      <TrackedLink href={`/create?template=${t.id}`} location="home_featured" meta={{ template_id: t.id }} className="flex-1 rounded-full bg-hv-forest px-3 py-3 text-center text-[0.92rem] font-semibold text-hv-ivory transition-colors hover:bg-hv-deep">
        {tr('Customize')}
      </TrackedLink>
    </div>
  )
}

export default function DesignShowcase({ items, occasions, levels, total, placeholders = {} }: { items: CatalogItem[]; occasions: { key: string; label: string }[]; levels: LevelChip[]; total: number; placeholders?: Record<string, CSSProperties> }) {
  const tr = useT()
  const [occasion, setOccasion] = useState('all')
  const [level, setLevel] = useState('all')
  const [recent, setRecent] = useState<CatalogItem[]>([])

  useEffect(() => {
    const ids = recentDesigns()
    setRecent(ids.flatMap((id) => items.filter((i) => i.id === id)).slice(0, 4))
  }, [items])

  const matches = useMemo(
    () => items.filter((i) => (occasion === 'all' || i.occasions.includes(occasion)) && (level === 'all' || i.tier === level)),
    [items, occasion, level],
  )
  const shown = matches.slice(0, SHOWN)
  const query = new URLSearchParams({ ...(occasion !== 'all' ? { occasion } : {}), ...(level !== 'all' ? { level } : {}) }).toString()

  const pick = (kind: 'occasion' | 'level', value: string) => {
    if (kind === 'occasion') setOccasion(value)
    else setLevel(value)
    trackEvent('template_filter', { filter: kind, value, location: 'home_featured' })
  }

  const tab = (on: boolean) =>
    `shrink-0 border-b-2 pb-2 pt-1 text-[0.98rem] transition-colors ${on ? 'border-hv-gold font-semibold text-hv-ink' : 'border-transparent text-hv-ink/60 hover:text-hv-ink'}`
  const seg = (on: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors ${on ? 'bg-hv-forest text-hv-ivory' : 'text-hv-ink/70 hover:text-hv-ink'}`

  return (
    <section id="designs" aria-labelledby="hv-designs-title" className="hv-sec scroll-mt-20 bg-hv-linen">
      <div className="hv-shell">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end" data-reveal>
          <h2 id="hv-designs-title" className="hv-h2 lg:max-w-[38rem]">
            {tr('Designed to make every first impression unforgettable.')}
          </h2>
          <p className="hv-lede max-w-[29rem] lg:justify-self-end">
            {tr('Open any design in a live preview, exactly as your guests will see it. The price on each is the price you pay, once, when you publish.')}
          </p>
        </div>

        {recent.length > 0 && (
          <div className="mt-12 rounded-[1.1rem] bg-hv-ivory p-4 sm:p-5">
            <p className="text-[0.95rem] font-semibold text-hv-ink">{tr('Recently viewed')}</p>
            <ul className="hv-rail -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
              {recent.map((t) => (
                <li key={t.id} className="flex w-[17rem] shrink-0 items-center gap-3 sm:w-auto">
                  <Image src={t.image} alt="" width={64} height={80} sizes="64px" className="h-20 w-16 shrink-0 rounded-md object-cover object-top" />
                  <span className="min-w-0">
                    <Link href={`/templates/${t.slug}`} prefetch={false} className="hv-serif block truncate text-[1.15rem] font-semibold text-hv-ink">{t.name}</Link>
                    <span className="mt-1 flex gap-3 text-[0.88rem] font-semibold">
                      <PreviewButton templateId={t.id} source="home_recent" ariaLabel={tr('Preview {name} again', { name: t.name })} className="text-hv-forest underline decoration-hv-gold/60 underline-offset-4">{tr('Preview')}</PreviewButton>
                      <TrackedLink href={`/create?template=${t.id}`} location="home_recent" meta={{ template_id: t.id }} className="text-hv-forest underline decoration-hv-gold/60 underline-offset-4">{tr('Customize')}</TrackedLink>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Filters: occasions as tabs, the level as a small switch beside them. */}
        <div className="mt-12 flex flex-col gap-4 border-b border-hv-ink/10 lg:flex-row lg:items-end lg:justify-between">
          <div role="group" aria-label={tr('Filter by occasion')} className="hv-rail -mx-[var(--hv-gutter)] flex gap-6 overflow-x-auto px-[var(--hv-gutter)] lg:mx-0 lg:flex-wrap lg:gap-x-7 lg:gap-y-1 lg:px-0">
            <button type="button" aria-pressed={occasion === 'all'} className={tab(occasion === 'all')} onClick={() => pick('occasion', 'all')}>
              {tr('All occasions')}
            </button>
            {occasions.map((o) => (
              <button key={o.key} type="button" aria-pressed={occasion === o.key} className={tab(occasion === o.key)} onClick={() => pick('occasion', o.key)}>
                {tr(o.label)}
              </button>
            ))}
          </div>
          <div role="group" aria-label={tr('Filter by level')} className="hv-rail -mx-[var(--hv-gutter)] flex gap-1 overflow-x-auto px-[var(--hv-gutter)] pb-3 lg:mx-0 lg:shrink-0 lg:px-0">
            <button type="button" aria-pressed={level === 'all'} className={seg(level === 'all')} onClick={() => pick('level', 'all')}>
              {tr('Every level')}
            </button>
            {levels.map((l) => (
              <button key={l.key} type="button" aria-pressed={level === l.key} className={seg(level === l.key)} onClick={() => pick('level', l.key)}>
                {tr(l.label)}
              </button>
            ))}
          </div>
        </div>

        <ul className="hv-rail -mx-[var(--hv-gutter)] mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--hv-gutter)] pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-x-9" aria-live="polite">
          {shown.map((t) => (
            <li key={t.id} className="hv-lift w-[80%] shrink-0 snap-start sm:w-auto">
              <div className="relative">
                <div className="hv-zoom relative aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-hv-ivory shadow-[0_30px_60px_-45px_rgba(12,43,34,0.7)]">
                  <Image src={t.image} alt={tr('{name} {occasion} invitation design', { name: t.name, occasion: tr(t.occasionLabel).toLowerCase() })} fill sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 380px" className="object-cover object-top" style={placeholders[t.id]} />
                  <span aria-hidden className="hv-actions absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent [@media(hover:none)]:hidden" />
                </div>
                {t.tier !== 'classic' && (
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${t.tier === 'signature' ? 'bg-hv-deep text-hv-gold' : 'bg-hv-ivory text-hv-forest'}`}>
                    {tr(LEVEL_NAME[t.tier])}
                  </span>
                )}
                <Actions t={t} className="hv-actions absolute inset-x-4 bottom-4 hidden gap-2 [@media(hover:hover)]:flex" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <Link href={`/templates/${t.slug}`} prefetch={false} className="min-w-0">
                  <span className="hv-serif block text-[1.6rem] font-semibold leading-[1.1] text-hv-ink">{t.name}</span>
                  <span className="mt-1.5 block text-[0.92rem] text-hv-muted">
                    {tr(t.occasionLabel)} · {tr(LEVEL_NAME[t.tier])}
                  </span>
                </Link>
                <Price inr={t.price} className="shrink-0 pt-1 text-[1.1rem] font-semibold text-hv-forest" />
              </div>
              <Actions t={t} className="mt-4 flex gap-2 [@media(hover:hover)]:hidden" />
            </li>
          ))}
        </ul>
        {matches.length === 0 && <p className="mt-10 text-hv-muted">{tr('No design matches both filters yet. Try another level.')}</p>}

        <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* More matches than fit: see them all, filtered. All of them shown already: the whole catalogue. */}
          <TrackedLink href={`/templates${query && matches.length > SHOWN ? `?${query}` : ''}`} location="home_featured_all" className="hv-btn">
            {matches.length > SHOWN ? tr('See all {n} designs', { n: matches.length }) : tr('Browse all {n} designs', { n: total })}
            <ArrowRightIcon className="h-4 w-4" />
          </TrackedLink>
          <p className="text-[0.95rem] text-hv-muted">{tr('Previews open the real invitation. Nothing is sent to anyone.')}</p>
        </div>
      </div>
    </section>
  )
}
