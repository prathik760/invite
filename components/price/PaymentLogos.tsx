'use client'

import { useVisitorCountry } from '@/components/price/Price'
import { currencyOf, priceListFor } from '@/lib/pricing'

/**
 * The ways Razorpay checkout lets this visitor pay, as logos (public/payments).
 * Like <PayMethods>: UPI, the UPI apps, RuPay and net banking are Indian rails,
 * so outside India (once country pricing is on) only the card networks show.
 *
 * Only list what the Razorpay account really accepts. Amex and Diners need a
 * separate activation from Razorpay — add them here once that is done.
 */
const LOGOS: { src: string; label: string; indiaOnly?: boolean }[] = [
  { src: '/payments/upi.svg', label: 'UPI', indiaOnly: true },
  { src: '/payments/googlepay.svg', label: 'Google Pay', indiaOnly: true },
  { src: '/payments/phonepe.svg', label: 'PhonePe', indiaOnly: true },
  { src: '/payments/paytm.svg', label: 'Paytm', indiaOnly: true },
  { src: '/payments/visa.svg', label: 'Visa' },
  { src: '/payments/mastercard.svg', label: 'Mastercard' },
  { src: '/payments/rupay.svg', label: 'RuPay', indiaOnly: true },
]

export default function PaymentLogos({ className = '' }: { className?: string }) {
  const country = useVisitorCountry()
  const india = currencyOf(priceListFor(country)) === 'INR'
  return (
    <ul aria-label="Payment methods we accept" className={`flex flex-wrap gap-2 ${className}`}>
      {LOGOS.filter((l) => india || !l.indiaOnly).map((l) => (
        <li key={l.label} title={l.label} className="flex h-8 w-14 items-center justify-center rounded-md bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.src} alt={l.label} width={40} height={18} loading="lazy" decoding="async" className="h-[18px] w-10 object-contain" />
        </li>
      ))}
      {india && (
        <li className="flex h-8 items-center gap-1.5 rounded-md bg-white px-2.5 text-[0.72rem] font-semibold text-charcoal">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3 3 8h18zM5 11v7M9.5 11v7M14.5 11v7M19 11v7M3 21h18" />
          </svg>
          Net banking
        </li>
      )}
    </ul>
  )
}
