import DesignPage, { designMetadata, designStaticParams } from '@/components/pages/DesignPage'
import { setServerLang } from '@/lib/serverLang'

export const dynamicParams = false

export function generateStaticParams() {
  return designStaticParams()
}

export function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  return designMetadata(params.slug, params.lang)
}

export default function Page({ params }: { params: { lang: string; slug: string } }) {
  setServerLang(params.lang)
  return <DesignPage slug={params.slug} />
}
