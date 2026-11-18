import { OCCASION_MAP } from '@/lib/catalog'
import { buildCatalogItems, type CatalogItem } from '@/lib/catalogItems'
import { TIERS, type Tier } from '@/lib/tiers'

export interface PriceBand {
  tier: Tier
  min: number
  max: number
  designs: CatalogItem[]
}

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`
const range = (min: number, max: number) => (min === max ? rupees(min) : `${rupees(min)}–${rupees(max)}`)

/**
 * An occasion's designs by level (Classic, Premium, Signature), lowest first,
 * each with its price range: "How much does a digital wedding invitation cost?"
 * answered from the catalogue, so the page and its FAQ never fall out of step
 * with the real prices.
 */
export function occasionPriceBands(occasion: string): PriceBand[] {
  const items = buildCatalogItems(OCCASION_MAP[occasion]?.templateIds ?? []).filter((i) => i.price > 0)
  return [...TIERS]
    .reverse()
    .map((tier) => {
      const designs = items.filter((i) => i.tier === tier.key).sort((a, b) => a.price - b.price)
      return designs.length ? { tier, min: designs[0].price, max: designs[designs.length - 1].price, designs } : null
    })
    .filter((b): b is PriceBand => b !== null)
}

export function bandRange(band: PriceBand): string {
  return range(band.min, band.max)
}

/** The FAQ answer to "How much does a digital {noun} cost?", in one paragraph. */
export function priceAnswer(occasion: string, noun: string): string {
  const bands = occasionPriceBands(occasion)
  if (!bands.length) return ''
  const low = bands[0].min
  const high = bands[bands.length - 1].max
  const parts = bands.map((b) => (b.designs.length === 1 ? `the ${b.tier.name} design, ${b.designs[0].name}, ${bandRange(b)}` : `${b.tier.name} designs ${bandRange(b)}`))
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0]
  return (
    `A digital ${noun} on ShareInvite costs ${range(low, high)}, paid once per design: ${list}. ` +
    'You build and preview it free and pay only when you publish. There is no subscription, every guest uses the same link, ' +
    'and the design stays yours for another invitation at no extra cost.'
  )
}
