'use client'

import Image from 'next/image'
import Link from 'next/link'
import { trackCta } from '@/lib/analytics'
import type { CatalogItem } from '@/lib/catalogItems'
import PreviewButton from '@/components/catalog/PreviewButton'
import { ArrowRightIcon, EyeIcon } from '@/components/ui/Icons'
import { withLocalPrices } from '@/components/price/localised'

/**
 * One design in a gallery. Three ways in, each doing one thing:
 * the artwork (and the eye button) opens the live preview, the name goes to
 * the template's own (indexable) page, and "Use design" drops straight into
 * the builder with the template selected.
 */
export default function TemplateCard({
  item,
  source,
  priority = false,
}: {
  item: CatalogItem
  /** Placement id for analytics, e.g. "home_gallery". */
  source: string
  priority?: boolean
}) {
  return (
    <article className="lift group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden bg-peach">
        <PreviewButton
          templateId={item.id}
          source={source}
          ariaLabel={`Preview the ${item.name} template`}
          className="absolute inset-0 block h-full w-full cursor-zoom-in"
        >
          <Image
            src={item.image}
            alt={`${item.name} ${item.occasionLabel.toLowerCase()} invitation design`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/* The artwork is left clear — price and occasion sit under it, and
              the preview hint shows only on hover, never over the names. */}
          <span className="pointer-events-none absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-paper/95 px-3 py-1.5 text-xs font-semibold text-charcoal opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            <EyeIcon className="h-3.5 w-3.5" />
            Live preview
          </span>
        </PreviewButton>

        {item.is3D && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-emerald px-2 py-0.5 text-[0.7rem] font-semibold text-paper shadow-sm">
            3D
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 font-editorial text-[1.35rem] font-semibold leading-tight text-charcoal">
            <Link href={`/templates/${item.slug}`} className="hover:text-emerald-soft">
              {item.name}
            </Link>
          </h3>
          <span className="mt-1 shrink-0 text-[0.85rem] font-bold tabular-nums text-charcoal">
            {withLocalPrices(item.priceLabel)}
          </span>
        </div>
        <p className="mt-1 truncate text-[0.8rem] text-muted">{item.occasionLabel} · {item.style}</p>

        <div className="mt-auto flex gap-2 pt-3">
          <Link
            href={`/create?template=${item.id}&src=${source}`}
            onClick={() =>
              trackCta('Use design', source, {
                template_id: item.id,
                template_name: item.name,
                price: item.price,
              })
            }
            className="btn-primary inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2.5 text-[0.85rem] font-semibold sm:px-3"
          >
            Use design
            <ArrowRightIcon className="hidden h-3.5 w-3.5 sm:block" />
          </Link>
          <PreviewButton
            templateId={item.id}
            source={source}
            ariaLabel={`Live preview of the ${item.name} template`}
            className="inline-flex w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-charcoal transition-colors hover:border-burnished"
          >
            <EyeIcon className="h-4 w-4" />
          </PreviewButton>
        </div>
      </div>
    </article>
  )
}
