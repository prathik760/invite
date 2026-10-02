'use client'

import { Fragment, useSyncExternalStore } from 'react'
import { COUNTRY_COOKIE, currencyOf, localPrice, normaliseCountry, priceListFor, splitRupees, type LocalPrice } from '@/lib/pricing'

/**
 * Prices in the visitor's currency (see lib/pricing.ts).
 *
 * Pages are static, so the server always renders the INR price. After
 * hydration these read the country the middleware stored in a cookie and swap
 * in the local price. For visitors outside India an inline script in the root
 * layout marks <html data-cc>, and globals.css hides the INR figure until the
 * swap, so nobody abroad sees "₹" flash before their own currency.
 */

const COOKIE_RE = new RegExp(`(?:^|;\\s*)${COUNTRY_COOKIE}=([A-Za-z]{2})`)

function readCountry(): string | null {
  return normaliseCountry(document.cookie.match(COOKIE_RE)?.[1])
}

const subscribe = () => () => {}

/** The visitor's country, or null on the server, during hydration and when country pricing is off. */
export function useVisitorCountry(): string | null {
  return useSyncExternalStore(subscribe, readCountry, () => null)
}

/** The visitor's price for a design whose Indian price is `inr`. */
export function useLocalPrice(inr: number): LocalPrice & { ready: boolean } {
  const country = useVisitorCountry()
  return { ...localPrice(inr, country), ready: country !== null }
}

/** One price, e.g. <Price inr={299} /> → "₹299" in India, "US$9" in Japan, "£7" in the UK. */
export function Price({ inr, className }: { inr: number; className?: string }) {
  const price = useLocalPrice(inr)
  return (
    <span data-price={price.ready ? 'local' : 'inr'} className={className}>
      {price.label}
    </span>
  )
}

/** A sentence with "₹…" catalogue prices in it, with each one shown in the visitor's currency. */
export function PriceText({ children }: { children: string }) {
  const country = useVisitorCountry()
  const parts = splitRupees(children)
  return (
    <>
      {parts.map((p, i) =>
        'text' in p ? (
          <Fragment key={i}>{p.text}</Fragment>
        ) : (
          <span key={i} data-price={country ? 'local' : 'inr'}>
            {localPrice(p.inr, country).label}
          </span>
        ),
      )}
    </>
  )
}

/** "INR", "USD", "GBP"… for copy such as "Charged in INR". */
export function ChargeCurrency() {
  const country = useVisitorCountry()
  return <span data-price={country ? 'local' : 'inr'}>{currencyOf(priceListFor(country))}</span>
}

/**
 * How the visitor can pay: UPI and net banking are Indian payment rails, so
 * outside India Razorpay offers cards only.
 */
export function PayMethods({ capitalise = false }: { capitalise?: boolean }) {
  const country = useVisitorCountry()
  const text = currencyOf(priceListFor(country)) === 'INR' ? 'UPI, card or net banking' : 'credit or debit card'
  return <span data-price={country ? 'local' : 'inr'}>{capitalise ? text[0].toUpperCase() + text.slice(1) : text}</span>
}
