import { TEMPLATES } from '@/modules/templates/data'
import { templatePrice } from '@/lib/plans'
import { displayName } from '@/lib/catalog'

/**
 * Price copy generated from the catalogue, for server-rendered pages and FAQ
 * JSON-LD. Hand-written price lists went stale every time a design was added;
 * these can't.
 */

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

function list(names: string[]): string {
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

/** "₹99 for Ganesh Chaturthi Premium; ₹199 for Elegant Wedding and Pooja; …" */
export function priceByDesignSentence(): string {
  const byPrice = new Map<number, string[]>()
  for (const t of TEMPLATES) {
    const price = templatePrice(t.id)
    const name = t.id.startsWith('greeting-') ? 'the animated 3D greetings' : displayName(t.name)
    const names = byPrice.get(price) ?? []
    if (!names.includes(name)) names.push(name)
    byPrice.set(price, names)
  }
  return Array.from(byPrice.entries())
    .sort(([a], [b]) => a - b)
    .map(([price, names]) => `${inr(price)} for ${list(names)}`)
    .join('; ')
}

/** Price range of the everyday designs and of the Signature suites. */
export function priceRanges() {
  const prices = TEMPLATES.map((t) => ({ id: t.id, price: templatePrice(t.id) }))
  const signature = prices.filter((p) => p.id.startsWith('signature-')).map((p) => p.price)
  // The Gala birthday weekend is priced with the suites, not the everyday designs.
  const everyday = prices.filter((p) => !p.id.startsWith('signature-') && p.id !== 'birthday-gala').map((p) => p.price)
  return {
    everydayMin: Math.min(...everyday),
    everydayMax: Math.max(...everyday),
    signatureMin: signature.length ? Math.min(...signature) : null,
    signatureMax: signature.length ? Math.max(...signature) : null,
  }
}

/** "Most designs are ₹99–₹499; the Gala birthday weekend is ₹1,299; the Signature wedding suites are ₹1,499–₹1,999." */
export function priceRangeSentence(): string {
  const r = priceRanges()
  const everyday = `Most designs are ${inr(r.everydayMin)}–${inr(r.everydayMax)}`
  const gala = TEMPLATES.some((t) => t.id === 'birthday-gala') ? `; the Gala birthday weekend is ${inr(templatePrice('birthday-gala'))}` : ''
  if (r.signatureMin === null || r.signatureMax === null) return `${everyday}${gala}.`
  const sig = r.signatureMin === r.signatureMax ? inr(r.signatureMin) : `${inr(r.signatureMin)}–${inr(r.signatureMax)}`
  return `${everyday}${gala}; the Signature wedding suites are ${sig}.`
}
