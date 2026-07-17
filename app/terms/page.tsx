import type { Metadata } from 'next'
import LegalPage, { Para, Bullets, type LegalSection } from '@/components/legal/LegalPage'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const LAST_UPDATED = '17 July 2026'

export const metadata: Metadata = {
  title: { absolute: 'Terms of Service | ShareInvite' },
  description:
    'The Terms of Service governing your use of ShareInvite — India\'s digital invitation website builder. Read our terms on accounts, plans, payments, content, and acceptable use.',
  keywords: ['ShareInvite terms of service', 'ShareInvite terms and conditions', 'digital invitation terms of use'],
  alternates: { canonical: `${APP_URL}/terms` },
  openGraph: {
    title: 'Terms of Service | ShareInvite',
    description: 'The terms and conditions for using ShareInvite\'s digital invitation platform.',
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/terms`,
  },
}

const sections: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of these Terms',
    body: (
      <>
        <Para>
          These Terms of Service (&ldquo;Terms&rdquo;) form a legally binding agreement between you and ShareInvite
          (&ldquo;ShareInvite&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), the digital invitation
          platform available at shareinvite.in and its related pages and services (together, the &ldquo;Service&rdquo;).
        </Para>
        <Para>
          By creating an account, purchasing a plan, publishing an invitation, or otherwise using the Service, you confirm
          that you have read, understood, and agree to be bound by these Terms and by our{' '}
          <a href="/privacy" className="text-accent-strong hover:underline">Privacy Policy</a> and{' '}
          <a href="/refund-policy" className="text-accent-strong hover:underline">Refund &amp; Cancellation Policy</a>,
          which are incorporated here by reference. If you do not agree, please do not use the Service.
        </Para>
      </>
    ),
  },
  {
    id: 'definitions',
    title: 'Definitions',
    body: (
      <Bullets
        items={[
          <><strong className="text-foreground">&ldquo;User&rdquo;, &ldquo;you&rdquo;</strong> — any person who accesses or uses the Service, including hosts who create invitations and guests who view them.</>,
          <><strong className="text-foreground">&ldquo;Invitation&rdquo;</strong> — the digital invitation website you create, personalise, and publish using our templates.</>,
          <><strong className="text-foreground">&ldquo;Content&rdquo;</strong> — text, names, dates, venue details, photos, music links, messages, guest wishes/RSVPs, and any other material added to an Invitation.</>,
          <><strong className="text-foreground">&ldquo;Plan&rdquo;</strong> — the free tier or a one-time paid tier that unlocks specific templates and features.</>,
        ]}
      />
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Accounts',
    body: (
      <>
        <Para>
          You must be at least 18 years old, or the age of majority in your jurisdiction, and capable of entering into a
          binding contract to use the Service. If you use the Service on behalf of a family, household, or organisation,
          you represent that you are authorised to accept these Terms on their behalf.
        </Para>
        <Para>
          You are responsible for maintaining the confidentiality of your account credentials and for all activity that
          occurs under your account. Please provide accurate information and keep it up to date, and notify us promptly of
          any unauthorised use.
        </Para>
      </>
    ),
  },
  {
    id: 'service',
    title: 'The Service',
    body: (
      <>
        <Para>
          ShareInvite lets you create beautiful digital invitation websites for weddings, engagements, birthdays, Griha
          Pravesh, Namakaran, anniversaries, greetings, and other life events; personalise them with your details and
          photos; and share them instantly through a link (including on WhatsApp). Depending on your Plan, Invitations may
          include a venue map, ceremony schedule, photo gallery, background music, a countdown, and a section where guests
          can leave RSVPs or wishes.
        </Para>
        <Para>
          We may add, change, suspend, or remove features at any time to improve the Service or for operational, legal, or
          security reasons. Some designs and features are only available on certain Plans.
        </Para>
      </>
    ),
  },
  {
    id: 'plans-payments',
    title: 'Plans, Pricing & Payments',
    body: (
      <>
        <Para>
          ShareInvite offers a free plan and one-time paid plans that unlock additional templates and features. Paid plans
          are a <strong className="text-foreground">one-time purchase</strong> — they are not a subscription and do not
          renew automatically, so you will not be charged on a recurring basis.
        </Para>
        <Bullets
          items={[
            'All prices are listed in Indian Rupees (INR) and, unless stated otherwise, are inclusive of applicable taxes.',
            'Payments are processed securely by our third-party payment partner, Razorpay. We do not store your full card or banking details.',
            'Access to a paid template or feature is granted immediately after your payment is successfully confirmed.',
            'We may change our prices or plan structure at any time; changes do not affect purchases you have already completed.',
          ]}
        />
        <Para>
          Refunds and cancellations are governed by our{' '}
          <a href="/refund-policy" className="text-accent-strong hover:underline">Refund &amp; Cancellation Policy</a>.
        </Para>
      </>
    ),
  },
  {
    id: 'your-content',
    title: 'Your Content & Guest Data',
    body: (
      <>
        <Para>
          You retain all ownership of the Content you add to your Invitations. To operate the Service, you grant ShareInvite
          a limited, non-exclusive, worldwide, royalty-free licence to host, store, reproduce, and display your Content
          solely for the purpose of providing and improving the Service — for example, rendering and publishing your
          Invitation at its shareable link.
        </Para>
        <Para>
          You are solely responsible for your Content and confirm that you have the rights to use it, including any photos,
          music, or names of other people. When you collect RSVPs, wishes, or other information from your guests, you are
          the controller of that guest data and are responsible for handling it lawfully and respecting your guests&rsquo;
          privacy. We process guest data on your behalf as described in our{' '}
          <a href="/privacy" className="text-accent-strong hover:underline">Privacy Policy</a>.
        </Para>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    body: (
      <>
        <Para>You agree not to use the Service to create, upload, publish, or share any Content or conduct that:</Para>
        <Bullets
          items={[
            'is unlawful, fraudulent, defamatory, obscene, hateful, harassing, or otherwise objectionable;',
            'infringes the intellectual property, privacy, or other rights of any person;',
            'impersonates any person or misrepresents your affiliation with any person or organisation;',
            'contains malware, or attempts to hack, overload, disrupt, or reverse-engineer the Service;',
            'is used to send spam or unsolicited messages, or to collect data from people without a lawful basis;',
            'violates any applicable law or the terms of a third-party service (such as WhatsApp or Razorpay).',
          ]}
        />
        <Para>
          We may remove Content, and suspend or terminate accounts, that we reasonably believe violate these Terms or the
          law.
        </Para>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    body: (
      <Para>
        The Service, including our templates, designs, layouts, graphics, software, and the ShareInvite name and logo, is
        owned by ShareInvite and protected by intellectual property laws. We grant you a limited, non-exclusive,
        non-transferable licence to use the templates and features included in your Plan solely to create and share your own
        Invitations. You may not copy, resell, redistribute, or create derivative works from our templates or software, or
        use our branding without our written permission.
      </Para>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-Party Services',
    body: (
      <Para>
        The Service integrates with third-party services such as Razorpay (payments), WhatsApp (sharing), map providers,
        and image or music hosts. Your use of those services is subject to their own terms and privacy policies. We are not
        responsible for third-party services and do not control their availability or content.
      </Para>
    ),
  },
  {
    id: 'availability',
    title: 'Availability & "As Is" Service',
    body: (
      <>
        <Para>
          We work hard to keep the Service reliable, but it is provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis without warranties of any kind, whether express or implied. We do not guarantee that the
          Service will be uninterrupted, error-free, or that any Invitation link will remain available indefinitely.
        </Para>
        <Para>
          You are responsible for keeping your own copy of important Content (such as original photos). We recommend
          verifying every detail of your Invitation before you share it with guests.
        </Para>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    body: (
      <Para>
        To the maximum extent permitted by law, ShareInvite and its founder will not be liable for any indirect, incidental,
        special, or consequential losses, or for any loss of data, goodwill, or opportunity, arising from your use of (or
        inability to use) the Service. To the extent liability cannot be excluded, our total aggregate liability to you for
        any claim relating to the Service will not exceed the total amount you paid to ShareInvite in the twelve (12) months
        before the event giving rise to the claim.
      </Para>
    ),
  },
  {
    id: 'indemnity',
    title: 'Indemnity',
    body: (
      <Para>
        You agree to indemnify and hold harmless ShareInvite and its founder from any claims, damages, liabilities, and
        expenses (including reasonable legal fees) arising out of your Content, your use of the Service, your handling of
        guest data, or your breach of these Terms or of any law or third-party right.
      </Para>
    ),
  },
  {
    id: 'termination',
    title: 'Suspension & Termination',
    body: (
      <>
        <Para>
          You may stop using the Service at any time and may request deletion of your account or Invitations. We may
          suspend or terminate your access if you breach these Terms, if required by law, or to protect the Service or other
          users.
        </Para>
        <Para>
          On termination, your right to use the Service ends and published Invitations may be taken offline. Sections of
          these Terms that by their nature should survive termination — including intellectual property, disclaimers,
          limitation of liability, and indemnity — will continue to apply.
        </Para>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law & Disputes',
    body: (
      <Para>
        These Terms are governed by the laws of India. Subject to any right you may have under applicable consumer
        protection law, you agree that the courts of India will have exclusive jurisdiction over any dispute arising out of
        or relating to these Terms or the Service. We encourage you to contact us first so we can try to resolve any
        concern amicably.
      </Para>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these Terms',
    body: (
      <Para>
        We may update these Terms from time to time. When we make material changes, we will update the &ldquo;Last
        updated&rdquo; date at the top of this page and, where appropriate, provide additional notice. Your continued use of
        the Service after changes take effect means you accept the updated Terms.
      </Para>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: (
      <>
        <Para>If you have questions about these Terms, please contact us:</Para>
        <Bullets
          items={[
            <>General &amp; support: <a href="mailto:shareinvite123@gmail.com" className="text-accent-strong hover:underline">shareinvite123@gmail.com</a></>,
            <>Legal notices: <a href="mailto:shareinvite123@gmail.com" className="text-accent-strong hover:underline">shareinvite123@gmail.com</a></>,
            <>ShareInvite is operated from India by its founder, Prathik Thelkar.</>,
          ]}
        />
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="These terms explain the rules for using ShareInvite — how accounts, plans, payments, and content work, and the responsibilities we each have. Please read them carefully."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  )
}
