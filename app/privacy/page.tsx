import type { Metadata } from 'next'
import LegalPage, { Para, Bullets, type LegalSection } from '@/components/legal/LegalPage'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const LAST_UPDATED = '17 July 2026'

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy | ShareInvite' },
  description:
    'How ShareInvite collects, uses, shares, and protects your personal data — including account details, invitation content, and guest RSVPs. Learn your rights under India\'s DPDP Act, 2023.',
  keywords: ['ShareInvite privacy policy', 'digital invitation privacy', 'DPDP Act privacy policy', 'invitation data protection'],
  alternates: { canonical: `${APP_URL}/privacy` },
  openGraph: {
    title: 'Privacy Policy | ShareInvite',
    description: 'How ShareInvite collects, uses, and protects your personal data.',
    type: 'website',
    locale: 'en_IN',
    url: `${APP_URL}/privacy`,
  },
}

const sections: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    body: (
      <>
        <Para>
          This Privacy Policy explains how ShareInvite (&ldquo;ShareInvite&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;,
          &ldquo;our&rdquo;) collects, uses, shares, and protects your personal data when you use shareinvite.in and our
          related services (the &ldquo;Service&rdquo;). It applies to hosts who create invitations, and to guests who view
          invitations and leave RSVPs or wishes.
        </Para>
        <Para>
          We are committed to handling your data responsibly and in line with applicable Indian law, including the Digital
          Personal Data Protection Act, 2023 (the &ldquo;DPDP Act&rdquo;) and the Information Technology Act, 2000 and its
          rules. By using the Service, you agree to this Policy.
        </Para>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    body: (
      <>
        <Para>We collect the following categories of information:</Para>
        <Bullets
          items={[
            <><strong className="text-foreground">Account information</strong> — such as your name and email address when you sign up or sign in.</>,
            <><strong className="text-foreground">Invitation content</strong> — the details you add to your invitations, such as names, event dates and times, venue and address, a maps link, photos, background music links, and personal messages.</>,
            <><strong className="text-foreground">Guest information</strong> — RSVPs, wishes, or blessings that your guests choose to submit on an invitation you publish.</>,
            <><strong className="text-foreground">Payment information</strong> — when you buy a paid plan, payment is processed by Razorpay. We receive confirmation of the transaction and limited details (such as an order/payment reference), but we do not collect or store your full card or bank account numbers.</>,
            <><strong className="text-foreground">Usage &amp; device data</strong> — technical information collected automatically, such as your IP address, browser and device type, pages viewed, and interactions, gathered through cookies and similar technologies.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    body: (
      <Bullets
        items={[
          'To create, host, publish, and render your invitations and their shareable links;',
          'To process payments and unlock the templates and features in your plan;',
          'To provide customer support and respond to your requests;',
          'To operate, maintain, secure, and improve the Service and develop new features;',
          'To detect, prevent, and address fraud, abuse, security incidents, and violations of our Terms;',
          'To send you important service, transactional, and account-related communications;',
          'To comply with legal obligations and enforce our Terms.',
        ]}
      />
    ),
  },
  {
    id: 'legal-basis',
    title: 'Our Basis for Processing',
    body: (
      <Para>
        We process your personal data where you have given consent (for example, when you submit content or a wish), where
        processing is necessary to provide the Service you have requested or to perform our contract with you, where we have
        a legitimate interest in operating and improving the Service, and where we are required to do so by law. You can
        withdraw consent at any time as described in &ldquo;Your Rights&rdquo; below.
      </Para>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies & Similar Technologies',
    body: (
      <>
        <Para>We use a small number of cookies and browser storage technologies, including:</Para>
        <Bullets
          items={[
            <><strong className="text-foreground">Essential cookies</strong> — required to keep you signed in and to operate core features such as saving your invitation draft.</>,
            <><strong className="text-foreground">Analytics</strong> — to understand how the Service is used so we can improve it. This data is used in aggregate.</>,
          ]}
        />
        <Para>
          You can control cookies through your browser settings. Disabling essential cookies may affect your ability to sign
          in or use certain features.
        </Para>
      </>
    ),
  },
  {
    id: 'how-we-share',
    title: 'How We Share Information',
    body: (
      <>
        <Para>
          <strong className="text-foreground">We do not sell your personal data.</strong> We share information only in the
          following limited situations:
        </Para>
        <Bullets
          items={[
            <><strong className="text-foreground">Service providers</strong> — trusted partners who help us run the Service, such as Razorpay (payment processing), cloud hosting and image storage providers, and email delivery services. They may process data only on our instructions.</>,
            <><strong className="text-foreground">Legal reasons</strong> — where required to comply with the law, a court order, or a lawful government request, or to protect the rights, safety, and property of ShareInvite, our users, or the public.</>,
            <><strong className="text-foreground">Business transfers</strong> — if ShareInvite is involved in a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction, subject to this Policy.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'public-invitations',
    title: 'The Public Nature of Invitations',
    body: (
      <Para>
        A published invitation is accessible to anyone who has its link, and any wishes or messages left by guests may be
        visible to other people who view that invitation. Please treat your invitation link accordingly and avoid including
        highly sensitive personal information. You are responsible for deciding what content to publish and with whom to
        share the link.
      </Para>
    ),
  },
  {
    id: 'retention',
    title: 'Data Retention',
    body: (
      <Para>
        We keep your personal data for as long as your account or invitation is active, and for as long as needed to provide
        the Service, comply with our legal obligations (such as tax and accounting requirements for payments), resolve
        disputes, and enforce our agreements. When data is no longer required, we delete or anonymise it. You may request
        deletion of your account or invitations at any time.
      </Para>
    ),
  },
  {
    id: 'security',
    title: 'Data Security',
    body: (
      <Para>
        We use reasonable technical and organisational measures — such as encryption in transit, access controls, and use of
        reputable infrastructure providers — to protect your data. However, no method of transmission or storage is
        completely secure, and we cannot guarantee absolute security. Please keep your account credentials confidential.
      </Para>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    body: (
      <Para>
        The Service is intended for adults. You must be at least 18 to create an account. Some invitations (such as a
        Namakaran or birthday) may include information about a child — in those cases, the adult host is responsible for
        obtaining any necessary consent and for the content they publish about a minor. We do not knowingly collect personal
        data directly from children. If you believe a child has provided us data, please contact us so we can remove it.
      </Para>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    body: (
      <>
        <Para>Subject to applicable law, you have the right to:</Para>
        <Bullets
          items={[
            'access the personal data we hold about you and request a copy;',
            'correct or update inaccurate or incomplete data;',
            'request deletion of your data or account;',
            'withdraw consent where processing is based on consent;',
            'nominate another individual to exercise your rights in the event of death or incapacity, as provided under the DPDP Act;',
            'raise a grievance about how we handle your data.',
          ]}
        />
        <Para>
          To exercise any of these rights, email us at{' '}
          <a href="mailto:shareinvite123@gmail.com" className="text-accent-strong hover:underline">shareinvite123@gmail.com</a>.
          We may need to verify your identity before acting on your request.
        </Para>
      </>
    ),
  },
  {
    id: 'transfers',
    title: 'International Data Transfers',
    body: (
      <Para>
        ShareInvite is operated from India. Some of our service providers may process or store data on servers located
        outside India. Where that happens, we take steps to ensure your data continues to be protected in accordance with
        this Policy and applicable law.
      </Para>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this Policy',
    body: (
      <Para>
        We may update this Privacy Policy from time to time. When we make material changes, we will revise the &ldquo;Last
        updated&rdquo; date at the top of this page and, where appropriate, provide additional notice. Please review this
        page periodically.
      </Para>
    ),
  },
  {
    id: 'grievance',
    title: 'Grievance Officer & Contact',
    body: (
      <>
        <Para>
          If you have any questions, concerns, or complaints about your privacy or how we handle your data, you can reach
          our Grievance Officer, appointed in accordance with India&rsquo;s applicable data protection and IT laws:
        </Para>
        <Bullets
          items={[
            <>Grievance Officer, ShareInvite</>,
            <>Email: <a href="mailto:shareinvite123@gmail.com" className="text-accent-strong hover:underline">shareinvite123@gmail.com</a></>,
            <>General support: <a href="mailto:shareinvite123@gmail.com" className="text-accent-strong hover:underline">shareinvite123@gmail.com</a></>,
          ]}
        />
        <Para>We aim to acknowledge and address grievances within the timelines required by applicable law.</Para>
      </>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="Your trust matters to us. This policy explains what personal data we collect, how we use and protect it, who we share it with, and the rights you have over your information."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  )
}
