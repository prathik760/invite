'use client'

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import PreviewButton from '@/components/catalog/PreviewButton'
import { Price } from '@/components/price/Price'
import { ArrowRightIcon, EyeIcon } from '@/components/ui/Icons'
import { trackEvent } from '@/lib/analytics'
import { recentDesigns } from '@/lib/recentDesigns'
import type { CatalogItem } from '@/lib/catalogItems'
import { customize } from './MarketCard'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * "Pick up where you left off", for a returning visitor only, from what this
 * device really holds (nothing is fetched and nothing is invented):
 *  - an invitation started in the builder and not yet published (its draft,
 *    app/create DRAFT_KEY), with when it was last saved if the draft says;
 *  - the designs looked at lately (lib/recentDesigns);
 *  - the designs saved with the heart (lib/savedDesigns);
 *  - how they last narrowed the catalogue, offered back when they arrive
 *    without one (TemplateMarket passes it in as `resume`).
 *
 * No jump: the server cannot know any of this, so the shelf used to appear
 * after the page had drawn and push the whole catalogue down. Now a tiny
 * script, the shelf's first child, reads the same storage while the page is
 * still loading and marks which parts to show (data-d draft, data-l lists,
 * data-r resume). Every part has a fixed height (app/globals.css .tpl-return),
 * so the shelf has its final size before anything below it is drawn, and
 * React only fills it in. With nothing on this device it stays hidden.
 */
interface Draft {
  id: string
  at?: number
}

// Runs before paint on the client; useEffect on the server (where it never runs).
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

// Must decide what the component decides below, from the same keys.
const PREPAINT = `(function(){try{var s=document.currentScript.parentNode,g=function(k,f){try{return JSON.parse(localStorage.getItem(k)||f)}catch(e){return JSON.parse(f)}},d=g('invitely-draft','null'),v=g('si-templates-view','null'),r=g('si-recent-designs','[]'),sv=g('si-saved-designs','[]'),p=new URLSearchParams(location.search);var dd=!!(d&&d.templateId&&d.data&&Object.keys(d.data).some(function(k){var x=d.data[k];return typeof x==='string'&&x.trim()}));var l=(Array.isArray(r)&&r.length>0)||(Array.isArray(sv)&&sv.length>0);var rv=!!(v&&!['occasion','level','has','sort','q'].some(function(k){return p.has(k)})&&(v.occasion!=='all'||v.level!=='all'||(v.has&&v.has.length)||v.sort!=='recommended'));if(dd)s.setAttribute('data-d','1');if(l)s.setAttribute('data-l','1');if(rv)s.setAttribute('data-r','1')}catch(e){}})()`

function ago(at: number, tr: (s: string, v?: Record<string, number>) => string): string {
  const m = Math.round((Date.now() - at) / 60000)
  if (m < 2) return tr('just now')
  if (m < 60) return tr('{n} minutes ago', { n: m })
  const h = Math.round(m / 60)
  if (h < 24) return h === 1 ? tr('an hour ago') : tr('{n} hours ago', { n: h })
  const d = Math.round(h / 24)
  return d === 1 ? tr('yesterday') : tr('{n} days ago', { n: d })
}

export default function ReturningShelf({
  byId,
  saved,
  placeholders,
  resume,
}: {
  byId: Map<string, CatalogItem>
  saved: string[]
  placeholders: Record<string, CSSProperties>
  /** The visitor's last view of the catalogue, to pick up again. */
  resume?: { label: string; go: () => void }
}) {
  const tr = useT()
  const [ready, setReady] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [recent, setRecent] = useState<string[]>([])
  const [tab, setTab] = useState<'recent' | 'saved'>('recent')
  const rail = useRef<HTMLUListElement>(null)
  // Which ends of the row are out of view: a soft fade there, and the arrows.
  const [edges, setEdges] = useState({ start: false, end: false })

  useIsoLayoutEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem('invitely-draft') || 'null') as { templateId?: string; data?: Record<string, unknown>; at?: number } | null
      const typed = d?.data && Object.values(d.data).some((v) => typeof v === 'string' && v.trim())
      if (d?.templateId && typed && byId.has(d.templateId)) setDraft({ id: d.templateId, at: typeof d.at === 'number' ? d.at : undefined })
    } catch {
      /* private mode, or nothing saved */
    }
    setRecent(recentDesigns().filter((id) => byId.has(id)))
    setReady(true)
  }, [byId])

  const savedItems = saved.map((id) => byId.get(id)).filter((x): x is CatalogItem => Boolean(x))
  const recentItems = recent.map((id) => byId.get(id)).filter((x): x is CatalogItem => Boolean(x)).slice(0, 8)
  // Show the saved list once the visitor has saved something and has no recent views.
  const showTab = tab === 'saved' && savedItems.length ? 'saved' : recentItems.length ? 'recent' : 'saved'
  const list = showTab === 'saved' ? savedItems : recentItems
  const d = draft ? byId.get(draft.id) : null
  const hasList = recentItems.length > 0 || savedItems.length > 0

  useEffect(() => {
    const el = rail.current
    if (!el) return
    const measure = () => setEdges({ start: el.scrollLeft > 4, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 })
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ready, showTab, list.length, d])

  const nudge = (dir: 1 | -1) => {
    const el = rail.current
    if (el) el.scrollBy({ left: dir * Math.max(260, el.clientWidth * 0.8), behavior: 'smooth' })
  }

  // Once mounted, React owns the flags the early script set (they normally agree).
  const flag = (on: boolean) => (ready ? (on ? '1' : '0') : undefined)

  return (
    <section
      aria-labelledby="tpl-return-title"
      className="tpl-return hv-shell pb-2"
      data-d={flag(!!d)}
      data-l={flag(hasList)}
      data-r={flag(!!resume)}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: PREPAINT }} />
      <div className="sm:rounded-[1.2rem] sm:bg-white/70 sm:p-5 sm:ring-1 sm:ring-hv-ink/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h2 id="tpl-return-title" className="hv-serif truncate text-[22px] font-semibold leading-[40px] text-hv-ink sm:shrink-0">
            {tr('Pick up where you left off')}
          </h2>
          <div className="tpl-return-resume h-[40px] min-w-0">
            {resume && (
              <button
                type="button"
                onClick={resume.go}
                className="inline-flex h-[40px] max-w-full items-center gap-1.5 text-left text-[15px] font-semibold text-hv-forest underline decoration-hv-gold/60 underline-offset-4"
              >
                <span className="truncate">
                  <span className="max-sm:hidden">{tr('Continue browsing: {view}', { view: resume.label })}</span>
                  <span className="sm:hidden">{tr('Back to {view}', { view: resume.label })}</span>
                </span>
                <ArrowRightIcon className="h-3.5 w-3.5 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Which list the row shows, and arrows for a mouse once it runs past the edge. */}
        <div className="tpl-return-tabs mt-1 flex h-[40px] items-center justify-between gap-3">
          <div role="group" aria-label={tr('Your designs')} className="flex h-full gap-5 text-[15px]">
            {recentItems.length > 0 && (
              <button type="button" aria-pressed={showTab === 'recent'} onClick={() => setTab('recent')} className={`border-b-2 ${showTab === 'recent' ? 'border-hv-gold font-semibold text-hv-ink' : 'border-transparent text-hv-ink/65 hover:text-hv-ink'}`}>
                {tr('Recently viewed')} <span className="text-hv-muted">{recentItems.length}</span>
              </button>
            )}
            {savedItems.length > 0 && (
              <button type="button" aria-pressed={showTab === 'saved'} onClick={() => setTab('saved')} className={`border-b-2 ${showTab === 'saved' ? 'border-hv-gold font-semibold text-hv-ink' : 'border-transparent text-hv-ink/65 hover:text-hv-ink'}`}>
                {tr('Saved')} <span className="text-hv-muted">{savedItems.length}</span>
              </button>
            )}
          </div>
          {(edges.start || edges.end) && (
            <div className="hidden gap-2 sm:flex">
              <button type="button" aria-label={tr('Scroll back')} disabled={!edges.start} onClick={() => nudge(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-hv-ink ring-1 ring-hv-ink/15 transition-colors hover:ring-hv-forest/50 disabled:opacity-35">
                <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
              </button>
              <button type="button" aria-label={tr('Scroll on')} disabled={!edges.end} onClick={() => nudge(1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-hv-ink ring-1 ring-hv-ink/15 transition-colors hover:ring-hv-forest/50 disabled:opacity-35">
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* One row of fixed-height cards: the draft first, then the chosen list. On a phone it runs to
            the screen edge; on wider screens to the panel's edge, fading where more is out of view. */}
        <ul
          ref={rail}
          aria-label={showTab === 'saved' ? tr('Saved designs') : tr('Recently viewed designs')}
          className="tpl-return-rail hv-rail mt-1.5 flex h-[118px] snap-x gap-3 overflow-x-auto overflow-y-hidden py-[3px] max-sm:-mx-[var(--hv-gutter)] max-sm:px-[var(--hv-gutter)] sm:-mx-5 sm:px-5 sm:[scroll-padding-inline:20px]"
          style={
            edges.start || edges.end
              ? {
                  maskImage: `linear-gradient(to right, ${edges.start ? 'transparent, #000 40px' : '#000'}, ${edges.end ? '#000 calc(100% - 48px), transparent' : '#000'})`,
                  WebkitMaskImage: `linear-gradient(to right, ${edges.start ? 'transparent, #000 40px' : '#000'}, ${edges.end ? '#000 calc(100% - 48px), transparent' : '#000'})`,
                }
              : undefined
          }
        >
          {!ready &&
            // Until the device's lists are read: quiet placeholders of the same size.
            [0, 1, 2].map((i) => <li key={i} aria-hidden className="h-[112px] w-[264px] shrink-0 rounded-[0.9rem] bg-hv-ink/[0.04]" />)}

          {d && (
            <li className="flex h-[112px] w-[290px] shrink-0 snap-start gap-3 rounded-[0.9rem] bg-hv-linen p-2.5 ring-1 ring-hv-gold/25">
              <Image src={d.image} alt="" width={144} height={180} sizes="72px" className="h-[90px] w-[72px] shrink-0 rounded-md object-cover object-top shadow-sm" style={placeholders[d.id]} />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[11.5px] font-semibold uppercase leading-[15px] tracking-[0.1em] text-hv-gold-ink">{tr('Your draft')}</p>
                <p className="truncate text-[16px] font-semibold leading-[21px] text-hv-ink">{tr('{name} invitation', { name: d.name })}</p>
                {/* When it was last saved, only if the draft says. */}
                <p className="truncate text-[13px] leading-[18px] text-hv-muted">{draft?.at ? tr('Edited {when}', { when: ago(draft.at, tr) }) : tr('Saved on this device')}</p>
                <Link
                  href="/create"
                  prefetch={false}
                  onClick={() => trackEvent('continue_editing', { template_id: d.id, template_name: d.name, source_section: 'templates_return' })}
                  className="mt-auto inline-flex h-[36px] items-center justify-center gap-1.5 rounded-full bg-hv-forest px-3.5 text-[13.5px] font-semibold text-hv-ivory transition-colors hover:bg-hv-deep"
                >
                  {tr('Continue editing')} <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </li>
          )}

          {list.map((t) => (
            <li key={t.id} className="flex h-[112px] w-[264px] shrink-0 snap-start gap-3 rounded-[0.9rem] bg-white p-2.5 ring-1 ring-hv-ink/[0.07]">
              <PreviewButton templateId={t.id} source={`templates_${showTab}`} ariaLabel={`Preview ${t.name}`} className="shrink-0 overflow-hidden rounded-md">
                <Image src={t.image} alt="" width={144} height={180} sizes="72px" className="h-[90px] w-[72px] object-cover object-top" style={placeholders[t.id]} />
              </PreviewButton>
              <div className="flex min-w-0 flex-1 flex-col">
                {/* The name opens the design's own page. */}
                <Link href={`/templates/${t.slug}`} prefetch={false} className="hv-serif truncate text-[19px] font-semibold leading-[23px] text-hv-ink hover:text-hv-forest hover:underline hover:decoration-hv-gold/60 hover:underline-offset-4">
                  {t.name}
                </Link>
                <p className="truncate text-[13px] leading-[18px] text-hv-muted">
                  <Price inr={t.price} className="font-semibold text-hv-forest" /> · {t.occasionLabel}
                </p>
                {/* The same pair as a card on a phone: the live preview, and the builder with this design. */}
                <div className="mt-auto flex gap-1.5">
                  <PreviewButton
                    templateId={t.id}
                    source={`templates_${showTab}`}
                    ariaLabel={tr('Live preview of {name}', { name: t.name })}
                    className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full text-hv-ink ring-1 ring-hv-ink/15 transition-colors hover:ring-hv-forest/50"
                  >
                    <EyeIcon className="h-[1.05rem] w-[1.05rem]" />
                  </PreviewButton>
                  <Link
                    href={`/create?template=${t.id}&src=templates_${showTab}`}
                    prefetch={false}
                    onClick={() => customize(t, showTab)}
                    className="inline-flex h-[36px] flex-1 items-center justify-center rounded-full bg-hv-forest px-3 text-[13.5px] font-semibold text-hv-ivory transition-colors hover:bg-hv-deep"
                  >
                    {tr('Customize')}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
