import Script from 'next/script'
import type { Metadata } from 'next'
import SessionProvider from '@/components/providers/SessionProvider'
import { BuilderReviews } from '@/components/create/BuilderReviews'
import { approvedReviews } from '@/lib/reviews'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Create a Digital Invitation | ShareInvite' },
  description: 'Build your digital invitation in minutes and preview it before you pay. Venue maps, photo gallery, music and guest wishes, shared as one WhatsApp link. Pay once when you publish.',
  alternates: { canonical: `${APP_URL}/create` },
  // The builder is a tool, not a page to rank (15 Nov 2026). The wording pages link to it with the
  // copied message in the address, and Google was indexing hundreds of those (Search Console:
  // /create?template=…&message=… listed at positions 120–170). noindex drops them; follow keeps links.
  robots: { index: false, follow: true },
}

/** Reviews shown at the price step: those with words, newest first, a handful at most. */
const BUILDER_REVIEWS = 12

export default async function CreateLayout({ children }: { children: React.ReactNode }) {
  // Cached with every other page that shows reviews, and refreshed when one is approved (REVIEWS_TAG).
  const reviews = (await approvedReviews())
    .filter((r) => r.text.trim())
    .slice(0, BUILDER_REVIEWS)
    .map(({ id, templateId, name, city, rating, text }) => ({ id, templateId, name, city, rating, text }))
  return (
    <>
      <SessionProvider>
        <BuilderReviews reviews={reviews}>{children}</BuilderReviews>
      </SessionProvider>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </>
  )
}
