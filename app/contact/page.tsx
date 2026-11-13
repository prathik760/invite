import ContactPage, { contactMetadata } from '@/components/pages/ContactPage'

// The page itself lives in components/pages so the Indian-language versions (app/l/[lang]/contact) share it.
export const metadata = contactMetadata('en')

export default function Page() {
  return <ContactPage />
}
