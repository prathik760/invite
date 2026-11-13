import PricingPage, { pricingMetadata } from '@/components/pages/PricingPage'

// The page itself lives in components/pages so the Indian-language versions (app/l/[lang]/pricing) share it.
export const metadata = pricingMetadata('en')

export default function Page() {
  return <PricingPage />
}
