import type { Metadata } from 'next'
import OccasionPage, { faqPageJsonLd } from '@/components/landing/OccasionPage'
import { Section, SectionHeading } from '@/components/brand/Section'
import { CalendarIcon, CameraIcon, ClockIcon, GlobeIcon, MessageIcon, MusicIcon, PenIcon, ShareIcon } from '@/components/ui/Icons'
import { templateImageUrl } from '@/lib/templateMedia'

/*
 * Landing page for "save the date" searches — a US/UK/AU audience, so the copy
 * is written for couples there: text/email sharing, wedding websites, etiquette
 * on timing. The price is never written here: the offer card and closing band
 * show it in the visitor's own currency.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'
const TITLE = 'Digital Save the Date — Send by Text, Email or WhatsApp | ShareInvite'
const DESCRIPTION =
  'Letterpress-style digital save the date with your names, the day circled on a calendar, add-to-calendar and your wedding website. Send by text, email or WhatsApp.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'save the date',
    'digital save the date',
    'electronic save the date',
    'online save the date',
    'save the date website',
    'save the date link',
    'save the date text message',
    'email save the date',
    'save the date card',
    'wedding save the date',
  ],
  alternates: { canonical: `${APP_URL}/save-the-date` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: `${APP_URL}/save-the-date`,
    locale: 'en_US',
    alternateLocale: ['en_GB', 'en_AU'],
    images: [{ url: templateImageUrl('save-the-date'), width: 960, height: 1200, alt: 'A letterpress-style digital save the date with the wedding day circled on a calendar' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [templateImageUrl('save-the-date')] },
}

const FAQS = [
  {
    question: 'When should we send save the dates?',
    answer:
      'Six to eight months before the wedding is usual. Give guests eight to twelve months for a destination wedding or a holiday weekend, when they will need flights and time off. The formal invitation follows about six to eight weeks before the day.',
  },
  {
    question: 'Who should get a save the date?',
    answer:
      'Only people you are certain to invite to the wedding itself. A save the date is a promise that an invitation is coming, so keep the list to guests you have already settled on — it is much harder to take one back.',
  },
  {
    question: 'What goes on a save the date?',
    answer:
      'Your names, the date and the town or city. The venue is optional at this stage. Add “Formal invitation to follow” so nobody mistakes it for the invitation, and a link to your wedding website if you have one. This design has a place for each.',
  },
  {
    question: 'Is a digital save the date okay to send?',
    answer:
      'Yes — most guests now get their save the dates by text or email, and a link is easier to keep than a card on the fridge. If a grandparent would rather have paper, send them a printed card as well.',
  },
  {
    question: 'How do guests get it?',
    answer:
      'You get one link. Paste it into a text, iMessage, WhatsApp, an email or an Instagram message. It opens in the phone’s browser — guests don’t need an app or an account.',
  },
  {
    question: 'Can guests add the date to their calendar?',
    answer:
      'Yes. The page has an “Add to your calendar” button that opens Google Calendar with the day filled in as an all-day event, along with the town and your wedding website.',
  },
  {
    question: 'Does it work for every couple?',
    answer:
      'Yes. The form asks for Partner 1 and Partner 2 — two names, in whichever order you like — and the card reads “are getting married”.',
  },
  {
    question: 'Can guests RSVP on it?',
    answer:
      'Not on a save the date — replies come with the formal invitation. Guests can leave you a note on the page instead, and every guest can read them.',
  },
  {
    question: 'How long does the link stay live?',
    answer: 'Until three days after the wedding date, so it is still there for anyone checking the day in the final week.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'One payment when you publish — the price is shown on this page, and there is no subscription or charge per guest. You can fill everything in and preview it before you pay.',
  },
]

const WORDING = [
  { name: 'Classic', tag: 'Formal', desc: '“Please save the date for the wedding of Hattie Moore and Sam Okafor. Saturday, 19 June 2027 · Hudson Valley, New York. Formal invitation to follow.”' },
  { name: 'Relaxed', desc: '“We’re getting married! Hold Saturday, 19 June 2027 for us — somewhere with an orchard, a long table and good cider. Invitation to follow.”' },
  { name: 'Hosted by parents', tag: 'Traditional', desc: '“Mr and Mrs David Wells ask you to save the date for the marriage of their daughter Imogen to William Hart. Saturday, 4 September 2027, Chipping Campden.”' },
  { name: 'Destination', desc: '“Pack something warm for the evenings: we’re getting married in Sintra, Portugal, on Friday, 8 October 2027. Travel details are on our website.”' },
  { name: 'A little wry', desc: '“After eleven years and two flat-pack wardrobes, we’re making it official. Saturday, 19 June 2027 · Hudson Valley, NY.”' },
  { name: 'Short enough to text', desc: '“Save the date! Hattie & Sam, 19 June 2027, Hudson Valley. Invitation to follow — everything else is at the link.”' },
]

const FEATURES = [
  { icon: <CalendarIcon />, title: 'The day, circled', desc: 'A little month calendar with your day looped in red pencil — and the date spelled out, so nobody reads 06/07 the wrong way round.' },
  { icon: <ClockIcon />, title: 'Add to calendar', desc: 'One tap opens Google Calendar with the day filled in as an all-day event.' },
  { icon: <GlobeIcon />, title: 'Your wedding website', desc: 'Link your Zola, The Knot, Joy or your own site, for travel and stay as plans firm up.' },
  { icon: <CameraIcon />, title: 'A snapshot of you two', desc: 'Add a photo and it is taped to the corner of the card, like an old deckle-edged print.' },
  { icon: <PenIcon />, title: 'A note from you', desc: 'A few lines in your own words, signed underneath, on the letter that comes with the card.' },
  { icon: <MessageIcon />, title: 'Notes from guests', desc: 'Guests can leave congratulations on the page for everyone to read.' },
  { icon: <MusicIcon />, title: 'Background music', desc: 'An optional song, off until a guest taps play.' },
  { icon: <ShareIcon />, title: 'Send it anywhere', desc: 'One link for text, iMessage, WhatsApp, email or Instagram. No app for guests.' },
]

const ROLES = [
  {
    title: 'The save the date',
    when: 'Six to twelve months before',
    items: ['Your names', 'The date', 'The town or city', '“Formal invitation to follow”', 'Your wedding website, if you have one'],
  },
  {
    title: 'The invitation',
    when: 'Six to eight weeks before',
    items: ['Who is hosting', 'Ceremony time and venue address', 'Reception details', 'Dress code', 'How and when to reply'],
  },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS)) }} />
      <OccasionPage
        occasion="wedding"
        // The wedding designs that suit a US/UK wedding, not the Indian suites
        // that lead the full wedding list.
        templateIds={['save-the-date', 'signature-garden', 'elegant-wedding', 'cinematic-night', 'royal-deco']}
        templateId="save-the-date"
        pageKey="save_the_date_landing"
        crumb="Save the date"
        eyebrow="Digital save the dates"
        title={<>Digital save the date <em className="font-medium text-burnished">with the day circled</em></>}
        lede="A letterpress-style save the date for the phone: your names, the day looped in red pencil on a little calendar, an add-to-calendar button and a link to your wedding website. Send it by text, email or WhatsApp — and preview it before you pay."
        ctaLabel="Start my save the date"
        types={{
          eyebrow: 'Wording',
          title: 'Save the date wording couples actually use',
          sub: 'The card sets your names, the day and the town for you. These are lines couples write in the note that goes with it.',
          items: WORDING,
        }}
        features={{ title: 'What’s on your digital save the date', items: FEATURES }}
        steps={[
          { title: 'Add your names and the day', copy: 'Two names, the date and the town. A photo, a note and your website link if you like.' },
          { title: 'Preview it', copy: 'See exactly what guests will see on their phones, before you pay anything.' },
          { title: 'Publish and send', copy: 'Pay once, get your link, and send it by text, email or WhatsApp.' },
        ]}
        faqTitle="Save the date questions"
        faqs={FAQS}
        related={[
          { href: '/wedding-invitation', label: 'Wedding invitations' },
          { href: '/wedding-invitation-wording', label: 'Wedding invitation wording' },
          { href: '/digital-invitation', label: 'All digital invitations' },
          { href: '/templates', label: 'Browse every design' },
        ]}
        closing={{ title: 'Get the date in their calendars' }}
      >
        <Section tone="paper" aria-label="Save the date or invitation">
          <SectionHeading
            eyebrow="Two pieces, two jobs"
            title="A save the date isn’t the invitation"
            sub="The save the date asks guests to keep the day. The invitation, months later, tells them everything they need on it."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {ROLES.map((r) => (
              <div key={r.title} className="card-quiet p-6">
                <p className="t-h3">{r.title}</p>
                <p className="mt-1 text-[0.9rem] text-muted">{r.when}</p>
                <ul className="mt-4 space-y-2 text-[0.95rem] leading-7 text-charcoal/80">
                  {r.items.map((i) => (
                    <li key={i} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-burnished" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </OccasionPage>
    </>
  )
}
