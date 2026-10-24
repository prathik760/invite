import { TEMPLATES } from '@/modules/templates/data'
import { formatTemplatePrice, templatePrice } from '@/lib/plans'
import { templateSeoSlug } from '@/lib/seo'
import { templateImage } from '@/lib/templateMedia'
import { OCCASIONS, catalogueOrder, displayName, is3D, primaryOccasion, styleTag } from '@/lib/catalog'
import { tierOf, type FeatureKey, type TierKey } from '@/lib/tiers'

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
  /** Classic, Premium or Signature, by price (lib/tiers.ts). */
  tier: TierKey
  /** What the design can hold, read from its own fields. */
  features: FeatureKey[]
}

/** The things a design can hold, from the fields its builder asks for. Every one is used by its design. */
function featuresOf(t: (typeof TEMPLATES)[number]): FeatureKey[] {
  const keys = new Set(t.config.fields.map((f) => f.key))
  const types = new Set(t.config.fields.map((f) => f.type))
  const has: Record<FeatureKey, boolean> = {
    functions: keys.has('events'),
    guide: keys.has('travel') || keys.has('faq'),
    rsvp: keys.has('whatsappNumber'),
    film: keys.has('videoUrl') || types.has('video'),
    photos: keys.has('galleryImages') || types.has('gallery'),
    music: keys.has('musicUrl'),
    programme: keys.has('schedule'),
    map: keys.has('mapsUrl'),
    // Every event design has the wishes wall; the 3D greetings and Surprise Journey are messages, not events.
    wishes: !t.id.startsWith('greeting-') && t.id !== 'surprise-journey',
  }
  return (Object.keys(has) as FeatureKey[]).filter((k) => has[k])
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
      tier: tierOf(templatePrice(t.id)),
      features: featuresOf(t),
    }))
}

/** Filter chips for a gallery: only occasions that have at least one item. */
export function occasionChips(items: CatalogItem[]) {
  return OCCASIONS
    .filter((o) => items.some((i) => i.occasions.includes(o.key)))
    .map((o) => ({ key: o.key, label: o.short }))
}
