import ContactPage, { contactMetadata } from '@/components/pages/ContactPage'
import { setServerLang } from '@/lib/serverLang'

export function generateMetadata({ params }: { params: { lang: string } }) {
  return contactMetadata(params.lang)
}

export default function Page({ params }: { params: { lang: string } }) {
  setServerLang(params.lang)
  return <ContactPage />
}
