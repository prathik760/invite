import TemplatesPage, { templatesMetadata } from '@/components/pages/TemplatesPage'

// The page itself lives in components/pages so the Indian-language versions (app/l/[lang]/templates) share it.
export const metadata = templatesMetadata('en')

export default function Page() {
  return <TemplatesPage />
}
