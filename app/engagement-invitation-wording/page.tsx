import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import Link from 'next/link'
import WordingCopyCard from '@/components/wording/WordingCopyCard'
import MidPageCTA from '@/components/wording/MidPageCTA'
import StickyCTA from '@/components/wording/StickyCTA'
import SiteFooter from '@/components/landing/SiteFooter'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: '100+ Engagement & Roka Invitation Messages for WhatsApp' },
  description:
    '100+ engagement, Roka, Sagai, Mangni & ring ceremony invitation messages for WhatsApp — copy & paste free, in English & Hindi. Ready-to-send wording samples.',
  keywords: [
    'engagement invitation message',
    'roka invitation wording',
    'sagai invitation message',
    'ring ceremony invitation wording',
    'engagement invitation wording',
    'mangni invitation message',
    'engagement card wording India',
    'ring ceremony invitation text',
  ],
  alternates: { canonical: `${APP_URL}/engagement-invitation-wording` },
  openGraph: {
    title: '100+ Engagement & Roka Invitation Messages for WhatsApp',
    description: 'Copy & paste engagement, Roka, Sagai, Mangni & ring ceremony invitation messages for WhatsApp — in English & Hindi. Free ready-to-send wording samples.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Engagement Invitation Wording India' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between Roka and engagement invitation wording?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Roka is an intimate family-only ceremony that marks the formal acceptance of the relationship — before the engagement. The wording for a Roka invitation is short, warm, and informal since it is typically for close relatives only. Engagement / Mangni / Ring Ceremony invitations are broader, often include family names, a ceremony schedule, and may be sent to extended family, friends, and colleagues.',
      },
    },
    {
      '@type': 'Question',
      name: "Who hosts the engagement invitation — bride's or groom's family?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In most North Indian traditions, the engagement is jointly hosted by both families. In South Indian families, the boy's family (for Nishchayam) or the girl's family traditionally sends the invitation. For modern couples hosting their own ring ceremony, the couple's names lead the invitation. There is no fixed rule — follow your family's tradition and make it clear in the wording.",
      },
    },
    {
      '@type': 'Question',
      name: 'Should I send the engagement invitation 1 week or 2 weeks before?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send digital engagement invitations at least 10 to 14 days in advance. For outstation family members who need to book travel, 3 weeks is ideal. Roka invitations are often more spontaneous — a week in advance is fine since the guest list is typically close family only.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Hindi wording for an engagement invitation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Hindi wording works beautifully for Roka and Mangni invitations, especially for close family groups. A common opening is: "बड़े हर्ष के साथ आपको सूचित करते हैं कि हमारे [पुत्र/पुत्री] [Name] की रोका/मंगनी की रस्म..." You can also use bilingual wording — Hindi for the ceremonial parts and English for the venue and schedule details.',
      },
    },
  ],
}

export default function EngagementInvitationWordingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader createHref="/create?template=indian-engagement" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            100+ copy-ready samples · Roka · Sagai · Mangni
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Engagement Invitation Messages &amp;<br />
            <span className="gradient-accent italic">Wording — Roka, Ring Ceremony</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            100+ ready-to-copy engagement invitation messages for WhatsApp — Roka, Mangni, Sagai,
            Ring Ceremony and Nishchayam, plus simple &amp; short samples for son and daughter, and quotes &amp; captions in English.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create?template=indian-engagement" className="gold-button rounded-full px-10 py-4 text-base font-semibold">
              Start My Engagement Invite →
            </Link>
            <span className="text-sm text-muted">Free to start · No credit card</span>
          </div>
        </div>
      </section>

      {/* Section 1: Ring Ceremony / Mangni Formal */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Ring Ceremony / Mangni Invitation Message (Formal)</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            These formal samples are suitable for the main invitation — shared with all family, extended family, and guests at the ceremony.
          </p>
          <div className="space-y-6">

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">1. North Indian Mangni — Both Families Hosting</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">North India</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>॥ श्री गणेशाय नमः ॥</p>
                <p>With immense joy and God&apos;s blessings,</p>
                <p>[Bride&apos;s Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                <p>along with</p>
                <p>[Groom&apos;s Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                <p>cordially invite you to the</p>
                <p className="font-semibold not-italic text-ink">Mangni / Ring Ceremony</p>
                <p>of their children</p>
                <p className="font-semibold not-italic text-ink">[Bride&apos;s Name] &amp; [Groom&apos;s Name]</p>
                <p>[Day], [Date] · [Time]</p>
                <p>[Venue Name], [Address]</p>
                <p>Lunch / Dinner will be served. Kindly grace us with your presence.</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">2. South Indian Nishchayam (Tamil/Telugu Families)</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">South India</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>With the blessings of Sri [Family Deity],</p>
                <p>[Bride&apos;s Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                <p>joyfully announce the</p>
                <p className="font-semibold not-italic text-ink">Nishchayathartham (Engagement Ceremony)</p>
                <p>of their daughter</p>
                <p className="font-semibold not-italic text-ink">[Bride&apos;s Name]</p>
                <p>with</p>
                <p className="font-semibold not-italic text-ink">[Groom&apos;s Name]</p>
                <p>Son of [Groom&apos;s Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                <p>Date: [Date] · Time: [Time]</p>
                <p>[Kalyana Mandapam / Venue], [Address]</p>
                <p>Kindly bless the couple with your presence.</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">3. Modern Couple-Hosted Ring Ceremony</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">Modern</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>We&apos;re officially saying yes to forever.</p>
                <p className="font-semibold not-italic text-ink">[Name] &amp; [Name]</p>
                <p>invite you to our Ring Ceremony</p>
                <p>[Date] · [Time]</p>
                <p>[Venue], [Address]</p>
                <p>Followed by dinner. We would love to celebrate with you.</p>
                <p>RSVP: [WhatsApp Number]</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">4. Religious Blessing Opening (Formal)</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">Traditional</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>By the grace of God and with the blessings of our elders,</p>
                <p>we joyfully announce the engagement ceremony of</p>
                <p className="font-semibold not-italic text-ink">[Bride&apos;s Name] &amp; [Groom&apos;s Name]</p>
                <p>[Day], [Date] at [Time]</p>
                <p>[Venue Name], [City]</p>
                <p>Your blessings will make this occasion truly special.</p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* Mid-page CTA 1 */}
      <section className="px-5 py-2 border-b border-border bg-white">
        <div className="mx-auto max-w-4xl">
          <MidPageCTA
            headline="Make your engagement announcement as beautiful as the moment"
            body="A WhatsApp text disappears in the chat. A digital invite link can be reopened any time — guests check the venue map, confirm the ring ceremony time, and RSVP without calling you."
            features={[
              'Ring ceremony schedule & timeline',
              'Couple photos & gallery',
              'Tap-to-open Google Maps',
              'RSVP — track who confirmed',
            ]}
            ctaHref="/engagement-invitation"
            ctaText="Start My Engagement Invite →"
          />
        </div>
      </section>

      {/* Section 2: Roka */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Roka Ceremony Invitation Wording</h2>
          <div className="rounded-2xl border border-[#D9A441]/20 bg-[#FFF9F2] p-5 mb-8">
            <p className="text-sm text-muted leading-7">
              <strong className="text-ink">What is Roka?</strong> Roka is an intimate family-only ceremony that formally marks the beginning of the wedding alliance. It typically happens before the engagement and involves only the immediate families of both sides. A Roka invitation is therefore short, warm, and meant for a very close circle — not the full guest list.
            </p>
          </div>
          <div className="space-y-6">

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">1. Short Roka WhatsApp Message (Close Family Only)</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">Family only</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>With God&apos;s blessings, we are happy to share that [Name]&apos;s Roka is on [Date] at [Time].</p>
                <p>Venue: [Home / Hall Name, Address]</p>
                <p>We request your presence and blessings on this auspicious occasion.</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">2. Formal Roka with Family Names</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">Formal</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>[Father&apos;s Name] &amp; [Mother&apos;s Name]</p>
                <p>request your presence at the Roka ceremony of their son / daughter</p>
                <p className="font-semibold not-italic text-ink">[Name]</p>
                <p>[Day], [Date] at [Time]</p>
                <p>[Venue / Home Address]</p>
                <p>A small family lunch will follow. Your blessings mean everything.</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">3. Simple English Roka</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">Casual</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>It&apos;s official! We&apos;re celebrating [Name]&apos;s Roka with a small family gathering.</p>
                <p>[Date] · [Time] · [Venue]</p>
                <p>Please join us for this special moment. See you there!</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">4. Hindi/English Bilingual Roka</h3>
                <span className="rounded-full bg-[#2F766D]/10 px-3 py-0.5 text-xs font-semibold text-[#2F766D]">Bilingual</span>
              </div>
              <blockquote className="border-l-2 border-[#2F766D] pl-5 text-sm text-muted leading-8 italic">
                <p>ईश्वर की कृपा से हमारे पुत्र/पुत्री [Name] की रोका की रस्म</p>
                <p>[दिन], [तारीख] को [समय] बजे</p>
                <p>[स्थान का नाम एवं पता] पर होगी।</p>
                <p>We warmly request your presence and blessings on this happy occasion.</p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Sagai */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Sagai Invitation Message</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            Sagai is the term commonly used in Rajasthan and Gujarat for the formal engagement ceremony. These samples reflect the regional warmth and tradition of Sagai invitations.
          </p>
          <div className="space-y-6">

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">1. Traditional Joint-Family Sagai</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">Rajasthan / Gujarat</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>॥ श्री गणेशाय नमः ॥</p>
                <p>[Father&apos;s Name] परिवार एवं [Other Family&apos;s Name] परिवार</p>
                <p>सहर्ष सूचित करते हैं कि</p>
                <p className="font-semibold not-italic text-ink">[Name] एवं [Name]</p>
                <p>की सगाई की रस्म</p>
                <p>[दिन], [तारीख] को [समय] बजे</p>
                <p>[स्थान], [पता]</p>
                <p>पर आयोजित होगी।</p>
                <p>आपकी उपस्थिति एवं आशीर्वाद की प्रार्थना है।</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">2. Simple WhatsApp Sagai Message</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">WhatsApp</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>With great joy, we announce the Sagai of [Bride&apos;s Name] and [Groom&apos;s Name].</p>
                <p>[Date] · [Time] · [Venue, City]</p>
                <p>We humbly request your presence and blessings.</p>
                <p>Full invitation: [Link]</p>
              </blockquote>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base text-ink">3. Formal Sagai with Ceremony Schedule</h3>
                <span className="rounded-full bg-[#D9A441]/10 px-3 py-0.5 text-xs font-semibold text-accent-strong">Full schedule</span>
              </div>
              <blockquote className="border-l-2 border-[#D9A441] pl-5 text-sm text-muted leading-8 italic">
                <p>[Father&apos;s Name] &amp; [Mother&apos;s Name] cordially invite you to the</p>
                <p className="font-semibold not-italic text-ink">Sagai Ceremony of [Bride&apos;s Name] &amp; [Groom&apos;s Name]</p>
                <p>[Day], [Date] at [Venue Name], [City]</p>
                <p className="mt-2 not-italic">Ceremony Schedule:</p>
                <p>11:00 AM — Tilak / Sagan Ritual</p>
                <p>12:00 PM — Ring Exchange</p>
                <p>1:00 PM — Family Lunch</p>
                <p className="mt-1">Kindly confirm your attendance at [WhatsApp Number].</p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* Section: Simple & Short Engagement Messages */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Simple &amp; Short Engagement Invitation Messages for WhatsApp</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short, ready-to-send engagement messages for WhatsApp groups — clear date, time and venue, warm tone. Copy, add your details and share.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Simplest one-liner</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            We&apos;re engaged! 💍 Join us to celebrate [Name] &amp; [Name]&apos;s engagement.{'\n'}
            📅 [Date] · 🕖 [Time] · 📍 [Venue, City]{'\n'}
            Your presence and blessings mean the world to us.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple &amp; warm</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            With joy in our hearts, we invite you to the engagement of{'\n'}
            [Bride&apos;s Name] &amp; [Groom&apos;s Name]. 💍{'\n\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Come bless the couple as they begin their journey together.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Short WhatsApp group message</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            [Name] &amp; [Name] are getting engaged! 🎉{'\n'}
            [Date] · [Time] · [Venue]{'\n'}
            Full details 👉 [Digital Invite Link]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Casual &amp; modern</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            He asked, she said yes! 💍 (or she asked — either way, it&apos;s happening!){'\n\n'}
            Join us for [Name] &amp; [Name]&apos;s ring ceremony{'\n'}
            [Date] at [Time], [Venue].{'\n\n'}
            Come celebrate love, laughter and lots of food!
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">5. With RSVP</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            You&apos;re invited to the engagement of [Name] &amp; [Name]! 💍{'\n\n'}
            📅 [Date] · 🕖 [Time]{'\n'}
            📍 [Venue, Address]{'\n\n'}
            Kindly confirm your presence: [Phone / WhatsApp]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">6. Bilingual simple (Hindi + English)</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            [Name] एवं [Name] की सगाई की रस्म पर आप सादर आमंत्रित हैं! 💍{'\n'}
            दिनांक: [Date] · समय: [Time] · स्थान: [Venue]{'\n\n'}
            Join us to celebrate [Name] &amp; [Name]&apos;s engagement!
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Daughter Engagement */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Engagement Invitation Message for Daughter</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            For parents announcing their daughter&apos;s engagement — warm, proud and ready to share with family and friends.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Proud parents — warm</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            With hearts full of joy, we invite you to the engagement of our beloved daughter{'\n\n'}
            [Daughter&apos;s Name] with [Groom&apos;s Name]{'\n\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Your blessings will make this milestone truly special.{'\n'}
            — [Parents&apos; Names]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple in English</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            Our daughter [Name] is getting engaged to [Name]! 💍{'\n'}
            Join us on [Date] at [Time], [Venue].{'\n'}
            Come shower the couple with your love and blessings.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Traditional with family names</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            [Father&apos;s Name] &amp; [Mother&apos;s Name]{'\n'}
            joyfully invite you to the engagement ceremony of their daughter{'\n\n'}
            [Daughter&apos;s Full Name]{'\n'}
            with [Groom&apos;s Name], son of [Groom&apos;s Parents&apos; Names]{'\n\n'}
            [Day, Date] · [Time] · [Venue, City]{'\n'}
            Kindly grace the occasion with your blessings.
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Son Engagement */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Engagement Invitation Message for Son</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            For parents announcing their son&apos;s engagement — dignified and warm wording for every family group.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Proud parents — warm</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            With great happiness, we invite you to the engagement of our beloved son{'\n\n'}
            [Son&apos;s Name] with [Bride&apos;s Name]{'\n\n'}
            Date: [Date] · Time: [Time]{'\n'}
            Venue: [Venue &amp; Address]{'\n\n'}
            Please join us to bless the couple.{'\n'}
            — [Parents&apos; Names]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Simple in English</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            Our son [Name] is getting engaged to [Name]! 💍{'\n'}
            Join us on [Date] at [Time], [Venue].{'\n'}
            Your presence will make the day complete.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Traditional with family names</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            [Father&apos;s Name] &amp; [Mother&apos;s Name]{'\n'}
            cordially invite you to the engagement ceremony of their son{'\n\n'}
            [Son&apos;s Full Name]{'\n'}
            with [Bride&apos;s Name], daughter of [Bride&apos;s Parents&apos; Names]{'\n\n'}
            [Day, Date] · [Time] · [Venue, City]{'\n'}
            Your blessings are eagerly awaited.
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Modern & Unique */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Modern &amp; Unique Engagement Invitation Wording</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            For couples who want something a little different — playful, heartfelt and unmistakably yours.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Playful &amp; unique</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            Plot twist: we&apos;re getting engaged! 💍{'\n\n'}
            After [X] years of [inside joke], [Name] &amp; [Name] are making it official.{'\n\n'}
            📅 [Date] · 🕖 [Time] · 📍 [Venue]{'\n\n'}
            Come for the rings, stay for the food. RSVP: [Number]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Heartfelt &amp; modern</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            Two families, one beautiful beginning.{'\n\n'}
            [Name] &amp; [Name] are getting engaged, and we&apos;d love you there{'\n'}
            as we say &ldquo;yes&rdquo; to forever.{'\n\n'}
            [Date] · [Time] · [Venue, City]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Save-the-date style</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            She said yes! 💍 (Finally, some good news to share.){'\n\n'}
            Save the date for [Name] &amp; [Name]&apos;s ring ceremony{'\n'}
            [Date] · [Venue, City]{'\n\n'}
            Formal invite &amp; details to follow 👉 [Digital Invite Link]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">4. Elegant &amp; minimal</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            [Name] &amp; [Name]{'\n'}
            are engaged.{'\n\n'}
            Please join us to celebrate.{'\n'}
            [Date] · [Time]{'\n'}
            [Venue, City]
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Formal "We Cordially Invite You" */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">&ldquo;We Cordially Invite You&rdquo; — Formal Engagement Wording</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Classic formal phrasing for the engagement ceremony invitation — ideal for printed cards and formal digital invites alike.
          </p>

          <h3 className="font-heading text-base text-ink mb-1">1. Classic formal</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            We cordially invite you to the engagement ceremony of{'\n\n'}
            [Bride&apos;s Name] &amp; [Groom&apos;s Name]{'\n\n'}
            [Day], the [Date] · at [Time]{'\n'}
            [Venue Name], [Address], [City]{'\n\n'}
            Your gracious presence is requested. RSVP: [Phone]
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">2. Formal — hosted by both families</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            [Bride&apos;s Family Name] &amp; [Groom&apos;s Family Name]{'\n'}
            request the honour of your presence{'\n'}
            at the engagement ceremony of{'\n\n'}
            [Bride&apos;s Name] &amp; [Groom&apos;s Name]{'\n\n'}
            [Day, Date] · [Time] onwards{'\n'}
            [Venue Name, Full Address]{'\n\n'}
            Dinner to follow. Kindly confirm your attendance.
          </WordingCopyCard>

          <h3 className="font-heading text-base text-ink mb-1 mt-6">3. Formal with religious blessing</h3>
          <WordingCopyCard ctaHref="/engagement-invitation">
            By the grace of God and the blessings of our elders,{'\n'}
            we cordially invite you to the engagement ceremony of{'\n\n'}
            [Bride&apos;s Name] &amp; [Groom&apos;s Name]{'\n\n'}
            [Day, Date] · [Time]{'\n'}
            [Venue, City]{'\n\n'}
            Your blessings will make this occasion truly memorable.
          </WordingCopyCard>
        </div>
      </section>

      {/* Section: Quotes, Lines & Captions */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Engagement Quotes, Lines &amp; Instagram Captions</h2>
          <p className="text-sm text-muted leading-7 mb-8">
            Short one-liners for your invitation opener, WhatsApp status, or Instagram — including Roka and &ldquo;rokafied&rdquo; captions to announce the big news.
          </p>

          <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Engagement quotes</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>&ldquo;Two hearts, one promise — the beginning of forever.&rdquo;</li>
                <li>&ldquo;And so the adventure begins — we&apos;re engaged!&rdquo;</li>
                <li>&ldquo;Every love story is beautiful, but ours is my favourite.&rdquo;</li>
                <li>&ldquo;He stole my heart, so I&apos;m taking his last name.&rdquo;</li>
                <li>&ldquo;A ring, a promise, and a lifetime to keep it.&rdquo;</li>
                <li>&ldquo;From this day, a new journey of togetherness begins.&rdquo;</li>
                <li>&ldquo;Found my forever — come celebrate with us.&rdquo;</li>
                <li>&ldquo;Sealed with a ring, blessed by our families.&rdquo;</li>
                <li>&ldquo;The best kind of &lsquo;yes&rsquo; — join our celebration.&rdquo;</li>
                <li>&ldquo;One ring to bind two hearts and two families.&rdquo;</li>
                <li>&ldquo;Our happily-ever-after has an official start date.&rdquo;</li>
                <li>&ldquo;Love brought us here; blessings will keep us going.&rdquo;</li>
                <li>&ldquo;Better together — and now it&apos;s official.&rdquo;</li>
                <li>&ldquo;A promise made, a lifetime to keep it.&rdquo;</li>
                <li>&ldquo;Where there is love, there is a new beginning.&rdquo;</li>
                <li>&ldquo;Two souls, one journey — the ring says it all.&rdquo;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Short invitation lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Join us as [Name] &amp; [Name] say &ldquo;yes&rdquo; to forever! 💍</li>
                <li>You&apos;re invited to our engagement — [Date] at [Venue]!</li>
                <li>Come bless the newly engaged couple on [Date].</li>
                <li>Love is in the air — and there&apos;s a ring involved! [Date]</li>
                <li>Save the date: our ring ceremony, [Date] · [Time].</li>
                <li>Two families, one celebration — please join us!</li>
                <li>The countdown to forever begins — be there! [Date]</li>
                <li>It wouldn&apos;t be complete without you. [Date], [Venue].</li>
                <li>Rings, blessings and lots of love — please join us!</li>
                <li>We&apos;re tying the (pre-wedding) knot — come celebrate!</li>
                <li>Our engagement, your blessings — [Date] · [Venue].</li>
                <li>A little ring, a big celebration — see you there!</li>
                <li>Be part of our first &ldquo;forever&rdquo; step. [Date]</li>
                <li>Mark the date — the rings come out on [Date]!</li>
                <li>Come witness the &ldquo;yes&rdquo; that changes everything.</li>
                <li>From engaged to inseparable — join the celebration!</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-3">WhatsApp status captions</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>Engaged! 💍 [Date] — you&apos;re invited!</li>
                <li>She said yes 💍 Come celebrate on [Date]!</li>
                <li>Officially off the market! Ring ceremony on [Date] 🎉</li>
                <li>Two hearts, one ring, endless love. Join us [Date]!</li>
                <li>Our forever starts here — [Date] · [Venue] 💛</li>
                <li>Ring secured 💍 Details 👉 [Digital Invite Link]</li>
                <li>Better together, now official. See you [Date]!</li>
                <li>Said yes to the ring and the man 💍 [Date]</li>
                <li>Loading… forever. 💛 Ring ceremony [Date]!</li>
                <li>From today, it&apos;s &ldquo;we&rdquo; forever. Join us [Date]!</li>
                <li>Best decision, sealed with a ring 💍 [Venue] · [Date]</li>
                <li>Save the date — our forever begins [Date]! ✨</li>
                <li>Engaged to my favourite person 💍 You&apos;re invited!</li>
                <li>Two families, one big yes — [Date] · [Venue].</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Roka &amp; engagement captions for Instagram</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>#Rokafied ✨ The beginning of forever.</li>
                <li>Rokafied and overjoyed 💍 [Names] · [Date]</li>
                <li>From &ldquo;just talking&rdquo; to &ldquo;forever&rdquo; — Roka done! 💛</li>
                <li>Two families became one today. #Roka #Engaged</li>
                <li>He put a ring on it 💍 #Rokafied</li>
                <li>Sealed with sindoor of blessings — Roka complete ✨</li>
                <li>Ring ceremony vibes 💍 Swipe for the moment we said yes.</li>
                <li>Officially fianc(é/ée)! 💍 #EngagedAF #Rokafied</li>
                <li>Our favourite &ldquo;yes&rdquo; yet. #Engaged [Date]</li>
                <li>Blessed, engaged, and a little bit obsessed 💛</li>
                <li>Rokafied &amp; ready for forever 💍 #Roka #Engaged</li>
                <li>She said yes, the families said yes — it&apos;s a wrap! #Rokafied</li>
                <li>Level: engaged 💍 Loading our happily ever after ✨</li>
                <li>Partners in crime, now partners for life. #Engaged</li>
                <li>Two hearts, one hashtag: #Rokafied 💛</li>
                <li>The ring finally has a home 💍 #Engaged [Date]</li>
                <li>Roka done, hearts full, forever loading… ✨</li>
                <li>From crush to forever — Rokafied! 💍</li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-base text-ink mb-3">Hindi &amp; bilingual lines</h3>
              <ul className="space-y-2 text-sm text-muted leading-7 list-disc pl-5">
                <li>बड़े हर्ष के साथ सूचित करते हैं कि [Name] एवं [Name] की सगाई तय हुई है।</li>
                <li>आपकी उपस्थिति एवं आशीर्वाद प्रार्थनीय है। 🙏</li>
                <li>दो दिल, एक वादा — सगाई की शुभकामनाएँ! 💍</li>
                <li>हमारे साथ इस खुशी के पल का हिस्सा बनें — [Date]।</li>
                <li>सगाई की रस्म · [Date] · [Venue] — सादर आमंत्रण।</li>
                <li>Two hearts, one promise — सगाई मुबारक! 💛</li>
                <li>हमारी खुशियों में शामिल होकर हमें आशीर्वाद दें। 🙏</li>
                <li>प्रेम और परिवार के इस बंधन का उत्सव — [Date]।</li>
                <li>[Name] एवं [Name] की अंगूठी की रस्म पर सादर आमंत्रित। 💍</li>
                <li>आपका आना ही हमारे लिए सबसे बड़ा आशीर्वाद है।</li>
              </ul>
            </div>
            <p className="text-xs text-muted leading-6 pt-1">
              Tip: use any line as your opener, then paste your{' '}
              <Link href="/engagement-invitation" className="text-accent-strong underline-offset-2 hover:underline">digital engagement invite link</Link>{' '}
              below it — guests get the venue map, schedule and RSVP in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* Mid-page CTA 2 */}
      <section className="px-5 py-2 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <MidPageCTA
            headline="One link. Every guest. All the details — without the phone calls."
            body="Create a digital engagement invite once. Share the same link across family groups, friend circles, and office colleagues. Everyone sees the updated details; you answer zero repeated questions."
            features={[
              'One link works for all groups',
              'Update details without resharing',
              'No app install for guests',
              'Free to create and share',
            ]}
            ctaHref="/engagement-invitation"
            ctaText="Get Your Engagement Invite Link →"
          />
        </div>
      </section>

      {/* Section 4: What to Include */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">What to Include in an Engagement Invitation</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            A complete engagement invitation removes every reason a guest might need to call and ask. Here is what each element does.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                item: "Both Families' Names",
                detail: "Traditional invitations list both the bride's and groom's family names. This establishes the alliance formally and is expected by elders.",
              },
              {
                item: "Couple's Names",
                detail: "State both names clearly. In formal invitations, the bride or groom's name follows the parents' names. In modern invites, the couple's names can lead.",
              },
              {
                item: "Ceremony Name",
                detail: "Specify whether it is a Roka, Mangni, Ring Ceremony, Sagai, or Nishchayam. Different families use different terms — clarity avoids confusion.",
              },
              {
                item: "Date, Time, Venue",
                detail: "The exact time and full venue address with a Google Maps link. For home ceremonies, include the house number and landmark.",
              },
              {
                item: "Schedule (Ritual → Ring Exchange → Meal)",
                detail: "List each event with approximate times so guests know when they need to arrive and how long to stay.",
              },
              {
                item: "Dress Code Guidance",
                detail: "Optional but appreciated. 'Ethnic / Indian wear preferred' or 'festive formals' helps guests dress appropriately.",
              },
              {
                item: "Google Maps Link",
                detail: "Embed a Google Maps link in your digital invitation. Venues in residential areas or community halls are often hard to find without GPS.",
              },
            ].map((c) => (
              <div key={c.item} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h3 className="font-heading text-base text-ink mb-2">✓ {c.item}</h3>
                <p className="text-sm text-muted leading-7">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Mistakes to Avoid */}
      <section className="px-5 py-16 border-b border-border bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-normal text-3xl text-ink mb-3 sm:text-4xl">Engagement Invitation Mistakes to Avoid</h2>
          <p className="text-sm text-muted leading-7 mb-10">
            These are real, common mistakes — easy to fix before you hit send.
          </p>
          <div className="space-y-4">
            {[
              {
                n: '1',
                mistake: 'Using "Engagement" when the family calls it "Roka"',
                fix: "Close relatives may be confused or even mildly offended if the ceremony name doesn't match what they know it as. Ask both families what term they use and reflect that in your invitation.",
              },
              {
                n: '2',
                mistake: 'Omitting the ceremony schedule when multiple rituals are planned',
                fix: 'If you have a Tilak, ring exchange, and lunch all in one event, list each with an approximate time. Guests with small children or return flights plan around this.',
              },
              {
                n: '3',
                mistake: "Not clarifying whether it's women-only or mixed company",
                fix: 'Some communities hold a separate ladies-only Sagai ritual. If the ceremony is women-only or if one segment is, state it clearly. Guests should not arrive to find out on the day.',
              },
              {
                n: '4',
                mistake: 'Sending only a text message without a digital invite link',
                fix: 'A WhatsApp message disappears into the chat history. A digital invitation link can be reopened any time — guests check the venue address and schedule the morning of the event.',
              },
              {
                n: '5',
                mistake: 'Too formal a tone for an intimate family Roka',
                fix: 'A Roka is a small family gathering. A five-paragraph formal invitation feels out of place. Keep Roka invitations warm, short, and personal.',
              },
            ].map((m) => (
              <div key={m.n} className="rounded-2xl border border-border bg-background p-6 shadow-sm flex gap-5">
                <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#7A3E4A]/10 text-accent-strong font-heading text-sm font-bold">{m.n}</div>
                <div>
                  <h3 className="font-heading text-base text-ink mb-1">{m.mistake}</h3>
                  <p className="text-sm text-muted leading-7">{m.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">Engagement Invitation Wording — FAQ</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-heading text-base text-ink mb-2">{faq.name}</h3>
                <p className="text-sm text-muted leading-7">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-white border-b border-border px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted mb-6 text-center">Related guides &amp; tools</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/engagement-invitation', label: 'Create free digital engagement invitation' },
              { href: '/templates', label: 'Browse engagement invitation templates' },
              { href: '/blog/roka-ceremony-invitation-ideas-and-wording', label: 'Roka invitation ideas and wording' },
              { href: '/blog/engagement-invitation-wording-for-ring-ceremony', label: 'Ring ceremony invitation wording' },
              { href: '/create', label: 'Create your engagement invitation free' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-[#D9A441]/50 transition-colors"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">Ready to Create Your Digital Engagement Invitation?</h2>
          <p className="text-muted text-sm mb-7">Use any wording sample above. Add photos, venue map, and schedule — share in 5 minutes.</p>
          <Link href="/create?template=indian-engagement" className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold">
            Start My Engagement Invite →
          </Link>
        </div>
      </section>

      <StickyCTA href="/engagement-invitation" text="Start My Engagement Invite →" />

      <SiteFooter />
    </main>
  )
}
