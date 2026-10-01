import Script from 'next/script'
import type { Metadata } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'Create a Digital Invitation | ShareInvite' },
  description: 'Build your digital invitation in minutes and preview it before you pay — venue maps, photo gallery, music and guest wishes, shared as one WhatsApp link. Pay once when you publish.',
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
