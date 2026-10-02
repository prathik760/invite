import type { ReactNode } from 'react'
import { PriceText } from '@/components/price/Price'

/**
 * Shows any "₹…" price inside a string in the visitor's currency. Shared
 * components (heroes, CTA bands, FAQs) pass their copy props through this, so
 * pages can keep writing prices as INR strings. Kept out of Price.tsx because
 * a 'use client' module's plain functions cannot be called from server
 * components.
 */
export function withLocalPrices(node: ReactNode): ReactNode {
  return typeof node === 'string' && node.includes('₹') ? <PriceText>{node}</PriceText> : node
}
