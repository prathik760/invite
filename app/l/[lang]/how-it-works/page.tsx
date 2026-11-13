import HowItWorksPage, { howItWorksMetadata } from '@/components/pages/HowItWorksPage'
import { setServerLang } from '@/lib/serverLang'

export function generateMetadata({ params }: { params: { lang: string } }) {
  return howItWorksMetadata(params.lang)
}

export default function Page({ params }: { params: { lang: string } }) {
  setServerLang(params.lang)
  return <HowItWorksPage />
}
