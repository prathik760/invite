/**
 * Prices by the visitor's country.
 *
 * lib/plans.ts stays the source of truth for what each design costs in India
 * (INR). This module turns an INR price into the price shown — and charged — in
 * every other country. India pays the INR prices; the US, UK, eurozone, Canada,
 * Australia, the UAE and Singapore pay set prices in their own currency; other
 * high-income countries pay the USD list; everywhere else pays a lower USD list
 * close to the Indian price, so a design costs roughly the same share of a
 * day's pay wherever the customer lives.
 *
 * ── Who decides the country ─────────────────────────────────────────────────
 * The checkout (app/api/payments/create-order) reads Vercel's
 * `x-vercel-ip-country` header and charges that country's price. The browser
 * never chooses it. Pages are static, so they cannot read the header; the
 * middleware copies the country into the `si_cc` cookie and the <Price>
 * component (components/price/Price.tsx) reads it after hydration. Both use the
 * same header, so the price on the page is the price at checkout.
 *
 * ── Switched off until Razorpay can take foreign currency ───────────────────
 * Non-INR orders fail until International Payments is activated in the
 * Razorpay dashboard. Until `INTL_PRICING=on` is set, the middleware sets no
 * cookie and the checkout charges INR, so the site behaves exactly as before.
 *
 * ── Changing a price ────────────────────────────────────────────────────────
 * Edit LADDER. Each row is one INR price point used in lib/plans.ts; designs
 * that share an INR price share every local price, so "₹199" always means the
 * same thing in any country. A new INR price point needs a new row — the
 * check at the bottom of lib/plans.ts fails the build without one.
 */

export const COUNTRY_COOKIE = 'si_cc'

export type PriceListId = 'inr' | 'usd' | 'usd-world' | 'gbp' | 'eur' | 'cad' | 'aud' | 'aed' | 'sgd'

type ForeignList = Exclude<PriceListId, 'inr'>

/**
 * INR price point → whole-number price in each foreign list.
 * `usd-world` is the lower USD price for countries outside the high-income
 * lists — about the Indian price at market rates.
 */
const LADDER: Record<number, Record<ForeignList, number>> = {
  99:   { usd: 4,  'usd-world': 2,  gbp: 3,  eur: 4,  cad: 5,  aud: 6,  aed: 15,  sgd: 5 },
  199:  { usd: 7,  'usd-world': 3,  gbp: 5,  eur: 6,  cad: 9,  aud: 10, aed: 25,  sgd: 9 },
  299:  { usd: 9,  'usd-world': 4,  gbp: 7,  eur: 8,  cad: 12, aud: 14, aed: 35,  sgd: 12 },
  399:  { usd: 12, 'usd-world': 5,  gbp: 9,  eur: 11, cad: 16, aud: 18, aed: 45,  sgd: 16 },
  499:  { usd: 15, 'usd-world': 6,  gbp: 12, eur: 14, cad: 19, aud: 22, aed: 55,  sgd: 19 },
  1299: { usd: 35, 'usd-world': 15, gbp: 27, eur: 32, cad: 45, aud: 52, aed: 129, sgd: 45 },
  1499: { usd: 39, 'usd-world': 17, gbp: 29, eur: 35, cad: 49, aud: 59, aed: 145, sgd: 49 },
  1999: { usd: 49, 'usd-world': 22, gbp: 39, eur: 45, cad: 65, aud: 75, aed: 185, sgd: 65 },
}

/** ISO 4217 code charged through Razorpay. Every one has two decimal places. */
const CURRENCY: Record<PriceListId, string> = {
  inr: 'INR', usd: 'USD', 'usd-world': 'USD', gbp: 'GBP', eur: 'EUR', cad: 'CAD', aud: 'AUD', aed: 'AED', sgd: 'SGD',
}

const SYMBOL: Record<PriceListId, string> = {
  inr: '₹', usd: 'US$', 'usd-world': 'US$', gbp: '£', eur: '€', cad: 'CA$', aud: 'A$', aed: 'AED ', sgd: 'S$',
}

const EUROPE = [
  // Euro area, plus the microstates and Balkan countries that use the euro.
  'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
  'AD', 'MC', 'SM', 'VA', 'ME', 'XK',
  // Rest of the EU/EEA and Switzerland, where shoppers routinely see euro prices.
  'BG', 'CZ', 'DK', 'HU', 'PL', 'RO', 'SE', 'IS', 'LI', 'NO', 'CH',
]

/** High-income countries without their own list: the full USD price. */
const HIGH_INCOME_USD = [
  'US', 'PR', 'GU', 'VI', 'AS', 'MP', 'NZ', 'JP', 'KR', 'TW', 'HK', 'MO', 'IL',
  'SA', 'QA', 'KW', 'BH', 'OM', 'BN', 'BM', 'KY',
]

const LIST_BY_COUNTRY: Record<string, PriceListId> = {
  IN: 'inr',
  GB: 'gbp', IM: 'gbp', JE: 'gbp', GG: 'gbp',
  CA: 'cad',
  AU: 'aud',
  AE: 'aed',
  SG: 'sgd',
  ...Object.fromEntries(EUROPE.map((c) => [c, 'eur' as const])),
  ...Object.fromEntries(HIGH_INCOME_USD.map((c) => [c, 'usd' as const])),
}

/** A two-letter country code, or null for anything else (missing, "XX", Tor's "T1"). */
export function normaliseCountry(value: string | null | undefined): string | null {
  const cc = (value ?? '').trim().toUpperCase()
  return /^[A-Z]{2}$/.test(cc) && cc !== 'XX' ? cc : null
}

/**
 * Which list a country pays. An unknown country pays INR — the price every
 * page renders before the cookie is read, and what the site charged before
 * country pricing existed.
 */
export function priceListFor(country: string | null | undefined): PriceListId {
  const cc = normaliseCountry(country)
  if (!cc) return 'inr'
  return LIST_BY_COUNTRY[cc] ?? 'usd-world'
}

export function hasLocalPrice(inr: number): boolean {
  return inr in LADDER
}

export interface LocalPrice {
  /** Whole units of `currency` (dollars, not cents). */
  amount: number
  currency: string
  list: PriceListId
  /** "₹1,499", "US$39", "£29", "AED 145". */
  label: string
}

export function formatMoney(amount: number, list: PriceListId): string {
  const n = amount.toLocaleString(list === 'inr' ? 'en-IN' : 'en-US')
  // The US sees "$9"; everyone else on a USD list sees "US$9", because Mexico,
  // Canada, Australia, Singapore and others also write their own money as "$".
  return `${SYMBOL[list]}${n}`
}

/** Price of a design whose Indian price is `inr`, for the given list. */
export function priceInList(inr: number, list: PriceListId): LocalPrice {
  if (list === 'inr' || !hasLocalPrice(inr)) {
    return { amount: inr, currency: 'INR', list: 'inr', label: formatMoney(inr, 'inr') }
  }
  const amount = LADDER[inr][list]
  return { amount, currency: CURRENCY[list], list, label: formatMoney(amount, list) }
}

/**
 * `price` with `percentOff` taken off (a discount code, lib/coupons.ts),
 * rounded to whole units like every list price: ₹1,999 → ₹1,599, US$49 → US$39.
 */
export function discountedPrice<T extends LocalPrice>(price: T, percentOff: number): T {
  const amount = Math.round((price.amount * (100 - percentOff)) / 100)
  const fmt = (n: number) => n.toLocaleString(price.list === 'inr' ? 'en-IN' : 'en-US')
  return { ...price, amount, label: price.label.replace(fmt(price.amount), fmt(amount)) }
}

export function localPrice(inr: number, country: string | null | undefined): LocalPrice {
  const list = priceListFor(country)
  const price = priceInList(inr, list)
  if (price.list === 'usd' && normaliseCountry(country) === 'US') {
    return { ...price, label: `$${price.amount.toLocaleString('en-US')}` }
  }
  return price
}

const RUPEES = /₹\s?(\d[\d,]*)/g

/**
 * Rewrites every catalogue price written as "₹1,499" inside a sentence into
 * the visitor's price. Amounts that are not catalogue prices (a partner payout,
 * a printing cost in an article) are left alone.
 */
export function localiseRupees(text: string, country: string | null | undefined): string {
  return text.replace(RUPEES, (match, digits: string) => {
    const inr = Number(digits.replace(/,/g, ''))
    return hasLocalPrice(inr) ? localPrice(inr, country).label : match
  })
}

/** Splits a sentence into plain text and the catalogue prices inside it. */
export function splitRupees(text: string): ({ text: string } | { inr: number; raw: string })[] {
  const parts: ({ text: string } | { inr: number; raw: string })[] = []
  const re = new RegExp(RUPEES.source, 'g')
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const inr = Number(m[1].replace(/,/g, ''))
    if (!hasLocalPrice(inr)) continue
    if (m.index > last) parts.push({ text: text.slice(last, m.index) })
    parts.push({ inr, raw: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
}

/** Server-side switch: set INTL_PRICING=on once Razorpay International Payments is active. */
export function intlPricingEnabled(): boolean {
  return process.env.INTL_PRICING === 'on'
}

/** Amount in the currency's smallest unit, as Razorpay expects. All supported currencies use two decimals. */
export function minorUnits(price: LocalPrice): number {
  return Math.round(price.amount * 100)
}

/** Every list a Razorpay order may have been created in, for verifying it. */
export function isPriceList(value: unknown): value is PriceListId {
  return typeof value === 'string' && value in CURRENCY
}

export function currencyOf(list: PriceListId): string {
  return CURRENCY[list]
}

/** Payment methods Razorpay offers in a currency: UPI and net banking are Indian rails only. */
export function paymentMethods(currency: string): string {
  return currency === 'INR' ? 'UPI · Cards · Net banking' : 'Debit & credit cards'
}
