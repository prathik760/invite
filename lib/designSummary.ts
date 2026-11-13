import { TEMPLATES } from '@/modules/templates/data'
import { templatePrice } from '@/lib/plans'
import { templateImage } from '@/lib/templateMedia'
import { displayName, primaryOccasion } from '@/lib/catalog'
import { TIER_MAP, tierOf } from '@/lib/tiers'

/** What a sign-in page needs to say which design is waiting: name, real price, picture. Server only. */
export interface DesignSummary {
  id: string
  name: string
  price: number
  image: string
  occasion: string
  level: string
}

export function designSummary(id: string | null | undefined): DesignSummary | null {
  if (!id) return null
  const t = TEMPLATES.find((x) => x.id === id)
  if (!t) return null
  const price = templatePrice(t.id)
  return {
    id: t.id,
    name: displayName(t.name),
    price,
    image: templateImage(t.id),
    occasion: primaryOccasion(t.id)?.short ?? 'Celebration',
    level: TIER_MAP[tierOf(price)].name,
  }
}
