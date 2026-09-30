/**
 * Formal invitation wording spells dates and times out — "the twelfth of
 * December, two thousand and twenty-six, at half past six in the evening".
 * These helpers produce that phrasing from the builder's yyyy-mm-dd / HH:mm.
 */

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

export function numberWords(n: number): string {
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '')
  if (n < 1000) {
    const rest = n % 100
    return `${ONES[Math.floor(n / 100)]} hundred${rest ? ` and ${numberWords(rest)}` : ''}`
  }
  const rest = n % 1000
  return `${numberWords(Math.floor(n / 1000))} thousand${rest ? (rest < 100 ? ' and ' : ' ') + numberWords(rest) : ''}`
}

const ORD: Record<string, string> = {
  one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth',
}

/** 12 -> "twelfth", 21 -> "twenty-first" */
export function ordinalWords(n: number): string {
  const w = numberWords(n)
  const parts = w.split('-')
  const last = parts.pop() as string
  const ord = ORD[last] ?? (last.endsWith('y') ? `${last.slice(0, -1)}ieth` : `${last}th`)
  return [...parts, ord].join('-')
}

/** 2026 -> "two thousand and twenty-six" */
export function yearWords(year: number): string {
  return numberWords(year)
}

function period(h: number): string {
  if (h < 12) return 'in the morning'
  if (h < 17) return 'in the afternoon'
  if (h < 21) return 'in the evening'
  return 'at night'
}

/** "18:30" -> "half past six in the evening"; "" when unparseable. */
export function timeWords(value?: string): string {
  if (!value) return ''
  const [h, m] = value.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return ''
  if (h === 12 && m === 0) return 'twelve noon'
  if (h === 0 && m === 0) return 'midnight'
  const h12 = (x: number) => numberWords(x % 12 || 12)
  const p = period(h)
  if (m === 0) return `${h12(h)} o'clock ${p}`
  if (m === 15) return `quarter past ${h12(h)} ${p}`
  if (m === 30) return `half past ${h12(h)} ${p}`
  if (m === 45) return `quarter to ${h12(h + 1)} ${p}`
  return `${h12(h)} ${m < 10 ? `o'${numberWords(m)}` : numberWords(m)} ${p}`
}
