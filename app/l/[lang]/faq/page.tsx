import FaqPage, { faqMetadata } from '@/components/pages/FaqPage'
import { setServerLang } from '@/lib/serverLang'

export function generateMetadata({ params }: { params: { lang: string } }) {
  return faqMetadata(params.lang)
}

export default function Page({ params }: { params: { lang: string } }) {
  setServerLang(params.lang)
  return <FaqPage />
}
