import { buildCatalogItems } from '@/lib/catalogItems'
import type { WordingDesign } from '@/components/wording/WordingDesigns'

/**
 * The two designs offered beside a wording section's own design once a message
 * is copied (components/wording/CopiedPanel.tsx), so the reader sees a small
 * choice and not a single take-it-or-leave-it design.
 *
 * Picked by hand to suit the same message: kids' words stay with the kids'
 * designs, a cocktail party with the party designs. Every wedding trio has one
 * design at ₹199–₹399, because most readers of a free messages page arrive
 * looking for something free (Search Console, Nov 2026).
 */
const COMPANIONS: Record<string, [string, string]> = {
  // Birthday
  'first-birthday': ['kids-jungle', 'kids-unicorn'],
  'kids-dinosaur': ['kids-superhero', 'kids-space'],
  'kids-space': ['kids-dinosaur', 'kids-cars'],
  'kids-superhero': ['kids-dinosaur', 'kids-cars'],
  'kids-unicorn': ['kids-jungle', 'first-birthday'],
  'kids-jungle': ['kids-dinosaur', 'kids-unicorn'],
  'kids-cars': ['kids-superhero', 'kids-space'],
  'indian-birthday': ['first-birthday', 'birthday-long-lunch'],
  'birthday-mirrorball': ['birthday-martini', 'surprise-journey'],
  'birthday-martini': ['birthday-mirrorball', 'surprise-journey'],
  'birthday-champagne': ['birthday-gala', 'birthday-long-lunch'],
  'birthday-gala': ['birthday-champagne', 'birthday-long-lunch'],
  'birthday-long-lunch': ['birthday-champagne', 'indian-birthday'],
  // Valentine's Day (the Valentine post's confession messages)
  'confession-for-her': ['confession-for-him', 'greeting-valentine'],
  'confession-for-him': ['confession-for-her', 'greeting-valentine'],
  // Wedding
  'elegant-wedding': ['indian-wedding', 'signature-saptapadi'],
  'indian-wedding': ['elegant-wedding', 'signature-saptapadi'],
  'cinematic-night': ['royal-deco', 'elegant-wedding'],
  'royal-deco': ['luxury-wedding', 'elegant-wedding'],
  'luxury-wedding': ['royal-deco', 'elegant-wedding'],
  'signature-rajwada': ['signature-saptapadi', 'elegant-wedding'],
  'signature-saptapadi': ['indian-wedding', 'elegant-wedding'],
  'signature-kalyanam': ['indian-wedding', 'elegant-wedding'],
  'signature-nikah': ['luxury-wedding', 'elegant-wedding'],
  'signature-garden': ['signature-aquarelle', 'elegant-wedding'],
  'haldi-mehendi': ['sangeet-night', 'indian-wedding'],
  'save-the-date': ['elegant-wedding', 'cinematic-night'],
}

/**
 * What a wording page hands to <WordingDesigns>: the designs its sections use,
 * their companions, and only the few fields a thumbnail needs, so the page
 * carries a few hundred bytes per design and never the template config.
 */
export function wordingDesignProps(sectionDesigns: string[]): {
  designs: Record<string, WordingDesign>
  companions: Record<string, string[]>
} {
  const own = Array.from(new Set(sectionDesigns))
  const companions = Object.fromEntries(own.filter((id) => COMPANIONS[id]).map((id) => [id, COMPANIONS[id]]))
  const ids = new Set([...own, ...Object.values(companions).flat()])
  const designs = Object.fromEntries(
    buildCatalogItems()
      .filter((item) => ids.has(item.id))
      .map((item) => [item.id, { id: item.id, name: item.name, price: item.price, image: item.image }]),
  )
  return { designs, companions }
}
