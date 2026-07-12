import Script from 'next/script'
import type { Metadata } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Create Free Digital Invitation | ShareInvite' },
  description: 'Create a free digital invitation in 5 minutes — WhatsApp sharing, RSVP tracking, venue maps, photo gallery, music, and guest wishes.',
  alternates: { canonical: `${APP_URL}/create` },
  robots: { index: true, follow: true },
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </>
  )
}
