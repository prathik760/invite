import HowItWorksPage, { howItWorksMetadata } from '@/components/pages/HowItWorksPage'

// The page itself lives in components/pages so the Indian-language versions (app/l/[lang]/how-it-works) share it.
export const metadata = howItWorksMetadata('en')

export default function Page() {
  return <HowItWorksPage />
}
