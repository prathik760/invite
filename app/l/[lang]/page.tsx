import HomePage, { homeMetadata } from '@/components/pages/HomePage'
import { setServerLang } from '@/lib/serverLang'

export function generateMetadata({ params }: { params: { lang: string } }) {
  return homeMetadata(params.lang)
}

export default function Page({ params }: { params: { lang: string } }) {
  setServerLang(params.lang)
  return <HomePage />
}
