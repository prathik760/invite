'use client'

import type { CSSProperties } from 'react'
import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import PreviewButton from '@/components/catalog/PreviewButton'
import { Price } from '@/components/price/Price'
import { EyeIcon, HeartIcon } from '@/components/ui/Icons'
import { trackEvent } from '@/lib/analytics'
import { toggleSaved } from '@/lib/savedDesigns'
import type { CatalogItem } from '@/lib/catalogItems'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * One design on the Templates page. The artwork leads; under it the name (to
 * the design's own page), its occasion and style, and its real price. Two
 * actions that never lead to the same place:
 *   Preview    the live invitation in the preview popup (the artwork does the same);
 *   Customize  the builder with this design selected.
 * On a phone the Preview label sits on the artwork and Customize takes the
 * full width, so neither depends on hover or gets cramped.
 */
export const LEVEL_LABEL = { classic: 'Classic', premium: 'Premium', signature: 'Signature' } as const

export function customize(item: CatalogItem, section: string) {
  trackEvent('customize_click', {
    template_id: item.id,
    template_name: item.name,
    price: item.price,
    template_type: item.tier,
    category: item.occasions[0] ?? 'other',
    source_section: section,
  })
}

export default function MarketCard({
  item,
  section,
  saved,
  placeholder,
  feature = false,
  priority = false,
  dark = false,
  source,
}: {
  item: CatalogItem
  /** Where on the page the card sits, for analytics: "signature", "results", "recent"… */
  section: string
  saved: boolean
  placeholder?: CSSProperties
  /** The larger editorial card (the Signature collection). */
  feature?: boolean
  priority?: boolean
  /** On the dark Signature band. */
  dark?: boolean
  /** Analytics placement for pages other than Templates (their own names, e.g. "wedding_gallery"). */
  source?: string
}) {
  const tr = useT()
  const src = source ?? `templates_${section}`
  const heart = () => {
    const on = toggleSaved(item.id)
    trackEvent('template_favorite', { template_id: item.id, template_name: item.name, action: on ? 'save' : 'remove', source_section: section })
  }

  return (
    <article data-tpl={item.id} className="hv-lift group flex min-w-0 flex-col" aria-labelledby={`card-${section}-${item.id}`}>
      <div className="relative">
        <PreviewButton
          templateId={item.id}
          source={src}
          ariaLabel={tr('Preview {name}', { name: item.name })}
          className="hv-zoom relative block aspect-[4/5] w-full overflow-hidden rounded-[0.9rem] bg-hv-linen shadow-[0_26px_50px_-34px_rgba(12,43,34,0.65)] ring-1 ring-hv-ink/5"
        >
          <span className="absolute inset-0 block" style={placeholder}>
            <Image
              src={item.image}
              alt={tr('{name}, {occasion} invitation design', { name: item.name, occasion: item.occasionLabel.toLowerCase() })}
              fill
              priority={priority}
              sizes={feature ? '(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 400px' : '(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 290px'}
              className="object-cover object-top"
            />
          </span>
          {/* With a mouse: a hint on hover that the artwork opens the preview. Touch screens have the eye button below. */}
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 hidden items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[0.78rem] font-semibold text-hv-deep opacity-0 shadow-sm transition-opacity group-hover:opacity-100 [@media(hover:hover)]:inline-flex">
            <EyeIcon className="h-3.5 w-3.5" /> {tr('Preview')}
          </span>
        </PreviewButton>

        {/* Every card says its level (all designs are paid: there is no free one to mark). */}
        <span className="pointer-events-none absolute left-2.5 top-2.5 flex gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${item.tier === 'signature' ? 'bg-hv-deep/95 text-hv-gold' : item.tier === 'premium' ? 'bg-white/95 text-hv-forest' : 'bg-white/85 text-hv-ink/75'}`}>
            {tr(LEVEL_LABEL[item.tier])}
          </span>
          {item.is3D && <span className="rounded-full bg-hv-forest px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-hv-ivory">3D</span>}
        </span>

        <button
          type="button"
          onClick={heart}
          aria-pressed={saved}
          aria-label={saved ? tr('Remove {name} from saved designs', { name: item.name }) : tr('Save {name} for later', { name: item.name })}
          className={`absolute right-2 top-2 flex h-[40px] w-[40px] items-center justify-center rounded-full shadow-sm backdrop-blur transition-colors ${saved ? 'bg-hv-forest text-hv-ivory' : 'bg-white/90 text-hv-ink/70 hover:text-hv-forest'}`}
        >
          <HeartIcon className={`h-[1.15rem] w-[1.15rem] ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 id={`card-${section}-${item.id}`} className={`hv-serif min-w-0 font-semibold leading-[1.1] ${dark ? 'text-hv-ivory' : 'text-hv-ink'} ${feature ? 'text-[22px] sm:text-[1.75rem]' : 'text-[18px] sm:text-[1.4rem]'}`}>
          <Link href={`/templates/${item.slug}`} prefetch={false} className={dark ? 'hover:text-hv-gold' : 'hover:text-hv-forest'}>
            {item.name}
          </Link>
        </h3>
        <Price inr={item.price} className={`shrink-0 pt-0.5 text-[15px] font-semibold ${dark ? 'text-hv-gold' : 'text-hv-forest'}`} />
      </div>
      <p className={`mt-1 truncate text-[13px] ${dark ? 'text-hv-ivory/70' : 'text-hv-muted'}`}>
        {item.occasionLabel} · {item.style}
      </p>

      {/* Preview (the live invitation) and Customize (the builder): two buttons, two places. On a
          phone the preview is a 44px eye button so Customize keeps room for its label. */}
      <div className="mt-3 flex gap-2">
        <PreviewButton
          templateId={item.id}
          source={src}
          ariaLabel={tr('Live preview of {name}', { name: item.name })}
          className={`inline-flex min-h-[44px] w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full border text-[0.9rem] font-semibold transition-colors sm:w-auto sm:flex-1 sm:px-3 sm:py-2.5 ${dark ? 'border-hv-ivory/30 text-hv-ivory hover:border-hv-gold' : 'border-hv-ink/15 text-hv-ink hover:border-hv-forest'}`}
        >
          <EyeIcon className="h-[1.05rem] w-[1.05rem]" />
          {/* Hidden (not sr-only) on phones: the button is already named by its aria-label, and an sr-only
              span, absolutely placed, escaped the Signature row's clipping and widened the page. */}
          <span className="max-sm:hidden">{tr('Preview')}</span>
        </PreviewButton>
        <Link
          href={`/create?template=${item.id}&src=${src}`}
          prefetch={false}
          onClick={() => customize(item, section)}
          className={`inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full px-3 py-2.5 text-[0.9rem] font-semibold transition-colors ${dark ? 'bg-hv-ivory text-hv-deep hover:bg-white' : 'bg-hv-forest text-hv-ivory hover:bg-hv-deep'}`}
        >
          {tr('Customize')}
        </Link>
      </div>
    </article>
  )
}
