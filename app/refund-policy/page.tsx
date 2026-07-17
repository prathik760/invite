import type { Metadata } from 'next'
import LegalPage, { Para, Bullets, type LegalSection } from '@/components/legal/LegalPage'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const LAST_UPDATED = '17 July 2026'

export const metadata: Metadata = {
  title: { absolute: 'Refund & Cancellation Policy | ShareInvite' },
  description:
    'ShareInvite\'s refund and cancellation policy for one-time digital invitation purchases — when refunds apply, how to request one, and how cancellations work. Preview every template free before you pay.',
  keywords: ['ShareInvite refund policy', 'ShareInvite cancellation policy', 'digital invitation refund', 'Razorpay refund policy'],
  alternates: { canonical: `${APP_URL}/refund-policy` },
  openGraph: {
    title: 'Refund & Cancellation Policy | ShareInvite',
    description: 'When refunds apply, how to request one, and how cancellations work at ShareInvite.',
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/refund-policy`,
  },
}

const sections: LegalSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    body: (
      <>
        <Para>
          This Refund &amp; Cancellation Policy explains how payments, cancellations, and refunds work for ShareInvite. It
          applies to all one-time purchases made on shareinvite.in and forms part of our{' '}
          <a href="/terms" className="text-accent-strong hover:underline">Terms of Service</a>.
        </Para>
        <Para>
          We want you to buy with confidence. That is why <strong className="text-foreground">every template can be
          previewed for free</strong> through its live demo before you pay — so you know exactly what you are getting.
        </Para>
      </>
    ),
  },
  {
    id: 'nature',
    title: 'Nature of the Product',
    body: (
      <Para>
        ShareInvite sells digital products and services — access to premium invitation templates and features. When your
        payment is confirmed, access is delivered to your account <strong className="text-foreground">instantly and
        electronically</strong>. Because the product is digital and consumed immediately, refunds are treated differently
        from physical goods, as explained below.
      </Para>
    ),
  },
  {
    id: 'free-plan',
    title: 'Free Plan',
    body: (
      <Para>
        Our free plan carries no charge, so there is nothing to pay, cancel, or refund. You can create and share a free
        invitation without entering any payment details.
      </Para>
    ),
  },
  {
    id: 'one-time',
    title: 'One-Time Payments (No Subscription)',
    body: (
      <Para>
        Paid plans on ShareInvite are a <strong className="text-foreground">one-time purchase</strong>, not a subscription.
        We do not store your payment method for recurring billing, and you will never be charged automatically. This means
        there is no recurring plan to &ldquo;cancel&rdquo; — once you have paid once, that is the only charge for that
        purchase.
      </Para>
    ),
  },
  {
    id: 'cancellation',
    title: 'Cancellations',
    body: (
      <>
        <Para>
          You can stop using ShareInvite at any time and may request deletion of your account or any invitation you have
          created. Since paid plans are one-time and non-recurring, cancelling simply means you choose not to make further
          purchases.
        </Para>
        <Para>
          If you begin a purchase but the payment is not completed, no charge applies. If money was deducted but the order
          did not complete, see the refund section below.
        </Para>
      </>
    ),
  },
  {
    id: 'refund-eligible',
    title: 'When You Are Eligible for a Refund',
    body: (
      <>
        <Para>We will gladly issue a refund in genuine cases, including:</Para>
        <Bullets
          items={[
            <><strong className="text-foreground">Duplicate or accidental payment</strong> — you were charged more than once for the same purchase.</>,
            <><strong className="text-foreground">Payment succeeded but access was not delivered</strong> — money was deducted but the template or feature did not unlock, and we are unable to resolve it for you.</>,
            <><strong className="text-foreground">Unauthorised transaction</strong> — a charge was made without your authorisation (subject to verification).</>,
            <><strong className="text-foreground">Technical defect on our side</strong> — a persistent, reproducible technical problem prevents you from using what you paid for, and our team cannot fix it within a reasonable time.</>,
          ]}
        />
        <Para>
          Eligible refund requests should be raised within <strong className="text-foreground">7 days</strong> of the
          transaction.
        </Para>
      </>
    ),
  },
  {
    id: 'refund-not-eligible',
    title: 'When Refunds Do Not Apply',
    body: (
      <>
        <Para>Because the product is digital and delivered instantly, refunds are generally not available where:</Para>
        <Bullets
          items={[
            'you changed your mind after the paid template or feature was delivered to your account;',
            'you had already previewed the template through its free live demo before purchasing;',
            'you completed and used or published the invitation and later decided you no longer need it;',
            'the issue is caused by factors outside our control, such as your device, browser, or internet connection;',
            'access was removed because of a violation of our Terms of Service;',
            'the request is made after the 7-day window, except where required by law.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'how-to-request',
    title: 'How to Request a Refund',
    body: (
      <>
        <Para>
          To request a refund, email us at{' '}
          <a href="mailto:shareinvite123@gmail.com" className="text-accent-strong hover:underline">shareinvite123@gmail.com</a>{' '}
          within 7 days of the transaction and include:
        </Para>
        <Bullets
          items={[
            'the email address associated with your ShareInvite account;',
            'the Razorpay order or payment reference (from your payment confirmation);',
            'the date and amount of the transaction;',
            'a brief description of the issue.',
          ]}
        />
        <Para>We may ask for additional details to verify the purchase and process your request.</Para>
      </>
    ),
  },
  {
    id: 'processing',
    title: 'How Refunds Are Processed',
    body: (
      <Para>
        Approved refunds are issued to your original payment method through our payment partner, Razorpay. Once approved,
        refunds are typically initiated within <strong className="text-foreground">2&ndash;3 business days</strong>, and the
        amount usually reflects in your account within <strong className="text-foreground">5&ndash;10 business days</strong>,
        depending on your bank or card issuer. We will confirm by email once a refund has been initiated.
      </Para>
    ),
  },
  {
    id: 'chargebacks',
    title: 'Chargebacks',
    body: (
      <Para>
        If you believe a charge is incorrect, please contact us first — we can usually resolve issues faster than a bank
        dispute. Raising a chargeback without contacting us may result in temporary suspension of your account while the
        dispute is investigated.
      </Para>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: (
      <>
        <Para>For any questions about payments, cancellations, or refunds, reach out to us:</Para>
        <Bullets
          items={[
            <>Email: <a href="mailto:shareinvite123@gmail.com" className="text-accent-strong hover:underline">shareinvite123@gmail.com</a></>,
            <>We aim to respond to refund requests within 2&ndash;3 business days.</>,
          ]}
        />
      </>
    ),
  },
]

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      subtitle="ShareInvite plans are one-time digital purchases. This policy explains how cancellations work, when refunds apply, and how to request one — plus why you can always preview a template free before you pay."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  )
}
