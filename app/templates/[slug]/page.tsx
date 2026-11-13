import DesignPage, { designMetadata, designStaticParams } from '@/components/pages/DesignPage'

// The page itself lives in components/pages so the Indian-language versions (app/l/[lang]/templates/[slug]) share it.
// Every real page is built ahead (generateStaticParams). Any other address is a
// 404 straight away, instead of a server render to find that out: bots probe
// hundreds of made-up addresses, and each render is metered.
export const dynamicParams = false

export function generateStaticParams() {
  return designStaticParams()
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return designMetadata(params.slug)
}

export default function Page({ params }: { params: { slug: string } }) {
  return <DesignPage slug={params.slug} />
}
