import HomePage, { englishHomeMetadata } from '@/components/pages/HomePage'

// The page itself lives in components/pages so the Indian-language homepages (app/l/[lang]) share it.
export const metadata = englishHomeMetadata

export default function Page() {
  return <HomePage />
}
