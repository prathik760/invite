import PricingPage, { pricingMetadata } from '@/components/pages/PricingPage'
import { setServerLang } from '@/lib/serverLang'

export function generateMetadata({ params }: { params: { lang: string } }) {
  return pricingMetadata(params.lang)
}

export default function Page({ params }: { params: { lang: string } }) {
  setServerLang(params.lang)
  return <PricingPage />
}
