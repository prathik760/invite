import FaqPage, { faqMetadata } from '@/components/pages/FaqPage'

// The page itself lives in components/pages so the Indian-language versions (app/l/[lang]/faq) share it.
export const metadata = faqMetadata('en')

export default function Page() {
  return <FaqPage />
}
