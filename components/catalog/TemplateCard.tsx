'use client'

import MarketCard from '@/components/catalog/market/MarketCard'
import { useSavedDesigns } from '@/lib/savedDesigns'
import type { CatalogItem } from '@/lib/catalogItems'

/**
 * One design in a gallery, on any page: the Templates page card (components/catalog/market/
 * MarketCard), so every page shows designs the same way. Artwork, level badge, name (to the
 * design's own page), real price, the heart, and two actions that never lead to the same place:
 * Preview (the live invitation, public) and Customize (the builder, which asks for an account).
 *
 * Kept as its own component so the ~60 pages that render it keep their props and their analytics
 * placement names (`source`, e.g. "wedding_gallery").
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
  const saved = useSavedDesigns()
  return <MarketCard item={item} section={source} source={source} saved={saved.includes(item.id)} priority={priority} />
}
