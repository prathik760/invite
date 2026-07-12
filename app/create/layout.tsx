import Script from 'next/script'
import type { Metadata } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Create Digital Invitation | ShareInvite',
  description: 'Create a digital invitation with WhatsApp sharing, RSVP tracking, venue maps, gallery, music, and guest wishes.',
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
