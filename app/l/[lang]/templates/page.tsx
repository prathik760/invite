import TemplatesPage, { templatesMetadata } from '@/components/pages/TemplatesPage'
import { setServerLang } from '@/lib/serverLang'

export function generateMetadata({ params }: { params: { lang: string } }) {
  return templatesMetadata(params.lang)
}

export default function Page({ params }: { params: { lang: string } }) {
  setServerLang(params.lang)
  return <TemplatesPage />
}
