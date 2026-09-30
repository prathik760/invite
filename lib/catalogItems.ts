import { TEMPLATES } from '@/modules/templates/data'
import { formatTemplatePrice, templatePrice } from '@/lib/plans'
import { templateSeoSlug } from '@/lib/seo'
import { templateImage } from '@/lib/templateMedia'
import { OCCASIONS, catalogueOrder, displayName, is3D, primaryOccasion, styleTag } from '@/lib/catalog'

/**
 * Everything a template card needs, flattened to plain values.
 *
 * Built on the server and handed to client galleries as props, so the browser
 * never downloads the full TEMPLATES config (field definitions and sample data
 * for all 24 designs) just to draw a grid of cards.
 */
export interface CatalogItem {
  id: string
  name: string
  description: string
  price: number
  priceLabel: string
  slug: string
  image: string
  occasions: string[]
  occasionLabel: string
  style: string
  is3D: boolean
}

/**
 * `ids` defaults to the whole catalogue. With `keepOrder`, the given ids lead in
 * the order given and every other template follows in catalogue order — for a
 * curated "featured first" view that still contains every design.
 */
export function buildCatalogItems(ids?: string[], { keepOrder = false } = {}): CatalogItem[] {
  const all = TEMPLATES.map((t) => t.id)
  const order = keepOrder && ids
    ? [...ids.filter((id) => all.includes(id)), ...catalogueOrder(all.filter((id) => !ids.includes(id)))]
    : catalogueOrder(ids ?? all)
  return order
    .map((id) => TEMPLATES.find((t) => t.id === id))
    .filter((t): t is (typeof TEMPLATES)[number] => Boolean(t))
    .map((t) => ({
      id: t.id,
      name: displayName(t.name),
      description: t.description ?? '',
      price: templatePrice(t.id),
      priceLabel: formatTemplatePrice(t.id),
      slug: templateSeoSlug(t.id),
      image: templateImage(t.id),
      occasions: OCCASIONS.filter((o) => o.templateIds.includes(t.id)).map((o) => o.key),
      occasionLabel: primaryOccasion(t.id)?.short ?? 'Celebration',
      style: styleTag(t.id),
      is3D: is3D(t.id),
    }))
}

/** Filter chips for a gallery: only occasions that have at least one item. */
export function occasionChips(items: CatalogItem[]) {
  return OCCASIONS
    .filter((o) => items.some((i) => i.occasions.includes(o.key)))
    .map((o) => ({ key: o.key, label: o.short }))
}
