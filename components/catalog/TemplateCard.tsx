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
 * the artwork opens the live preview, the name goes to the template's own
 * (indexable) page, and "Use design" drops straight into the builder with the
 * template selected.
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
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="pointer-events-none absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-paper/95 px-3 py-1.5 text-xs font-semibold text-charcoal shadow-sm backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5">
            <EyeIcon className="h-3.5 w-3.5" />
            Live preview
          </span>
        </PreviewButton>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-paper/95 px-2.5 py-1 text-[0.72rem] font-semibold text-charcoal shadow-sm">
          {item.occasionLabel}
        </span>
        {item.is3D && (
          <span className="pointer-events-none absolute left-3 top-10 mt-1 rounded-full bg-emerald px-2.5 py-1 text-[0.72rem] font-semibold text-paper shadow-sm">
            3D
          </span>
        )}
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-charcoal/85 px-2.5 py-1 text-[0.78rem] font-bold tabular-nums text-paper shadow-sm backdrop-blur">
          {withLocalPrices(item.priceLabel)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="font-editorial text-[1.35rem] font-semibold leading-tight text-charcoal">
          <Link href={`/templates/${item.slug}`} className="hover:text-emerald-soft">
            {item.name}
          </Link>
        </h3>
        <p className="mt-1 truncate text-[0.8rem] text-muted">{item.style}</p>

        <Link
          href={`/create?template=${item.id}&src=${source}`}
          onClick={() =>
            trackCta('Use design', source, {
              template_id: item.id,
              template_name: item.name,
              price: item.price,
            })
          }
          className="btn-primary mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[0.85rem] font-semibold"
        >
          Use design
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}
