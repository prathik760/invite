import Link from '@/components/ui/Link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import CtaBand from '@/components/brand/CtaBand'
import { Section } from '@/components/brand/Section'
import PricingFaq, { answerText, type PricingQuestion } from '@/components/pricing/PricingFaq'
import { buildCatalogItems } from '@/lib/catalogItems'
import { TIERS } from '@/lib/tiers'
import { DELETE_AFTER_DAYS, ENDS_AFTER_DAYS, UNDATED_DELETE_AFTER_DAYS } from '@/lib/retention'
import { RESET_TTL_MS } from '@/lib/passwordReset'
import { localeMeta } from '@/lib/pageMeta'
import { serverT, tFor } from '@/lib/serverLang'
import { rich, type T } from '@/lib/translate'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

export function faqMetadata(lang: string) {
  const t = tFor(lang)
  return localeMeta(lang, '/faq', {
    title: t('FAQ: Digital Invitations, Pricing & Sharing | ShareInvite'),
    description: t('Answers about choosing and previewing designs, accounts, customizing, pricing and payment, sharing on WhatsApp, RSVP, music and photos, and refunds.'),
  })
}

// Every number here comes from the catalogue or the code that enforces it, never from copy.
const ITEMS = buildCatalogItems()
const COUNT = ITEMS.length
const has = (k: string) => ITEMS.filter((i) => i.features.includes(k as never)).length
const ladder = (t: T) => [...TIERS].reverse().map((tier) => {
  const p = ITEMS.filter((i) => i.tier === tier.key).map((i) => i.price)
  return t('{level} designs {from} to {to}', { level: t(tier.name), from: inr(Math.min(...p)), to: inr(Math.max(...p)) })
}).join(', ')

function faqGroups(t: T): { id: string; title: string; items: PricingQuestion[] }[] {
  return [
  {
    id: 'choosing',
    title: t('Choosing and previewing'),
    items: [
      { question: t('What is a digital invitation?'), answer: t('A designed page your guests open from a link, with no app to download. Depending on the design it holds your event details, a live countdown, photos, music, Google Maps directions and a wall where guests leave wishes.') },
      { question: t('How do I choose a design?'), answer: t('Browse all {total} designs on the Templates page by occasion, by level (Classic, Premium or Signature) or by what they include, such as photos, music, a map or RSVP. Every design shows its real price.', { total: COUNT }), link: { href: '/templates', label: t('Browse the designs') } },
      { question: t('Can I preview a design before I pay?'), answer: t('Yes. Open any design live, exactly as your guests will see it, without an account or a card. You pay only when you publish your own invitation.') },
    ],
  },
  {
    id: 'account',
    title: t('Your account'),
    items: [
      { question: t('Do I need an account?'), answer: t('Only to customize. Browsing, searching and previewing are open to everyone. When you choose Customize, sign in or create a free account with Google or your email, and you return straight to the design you picked.') },
      { question: t('What does an account give me?'), answer: t('Your invitations in one place, the wishes your guests leave, and the ability to change the details of a published invitation until your event, on the same link.') },
      { question: t('I forgot my password. What do I do?'), answer: t('Choose "Forgot password?" on the sign-in page and enter your email. If it has an account, we send a link to choose a new password. The link works once and for {minutes} minutes.', { minutes: RESET_TTL_MS / 60000 }), link: { href: '/auth/forgot', label: t('Reset your password') } },
    ],
  },
  {
    id: 'customizing',
    title: t('Customizing'),
    items: [
      { question: t('How do I create an invitation?'), answer: t('Choose a design and sign in or create a free account. Then type your names, date, venue and message, and add your photos. The preview updates as you type. When you are happy, pay once to publish and you get your own link to send.') },
      { question: t('Can I customize every detail?'), answer: t('Every word, name, date and photo is yours, in any language you write in. Wedding suites take every function of the week, each with its own time, venue and dress code.') },
      { question: t('Can I add music and photos?'), answer: t('Yes, on the designs that have them: {music} of {total} play background music you add, and {photos} have a photo gallery. Every design\'s preview shows exactly what it includes.', { music: has('music'), total: COUNT, photos: has('photos') }) },
      { question: t('Can I add a Google Maps location?'), answer: t('Yes, on {map} of {total} designs. Paste your venue\'s Google Maps link, or type the venue and address, and guests get a Directions button.', { map: has('map'), total: COUNT }) },
    ],
  },
  {
    id: 'pricing',
    title: t('Pricing and payment'),
    items: [
      { question: t('How much does an invitation cost?'), answer: t('Each design has one fixed price, shown on the design: {ladder}.', { ladder: ladder(t) }), link: { href: '/pricing', label: t('See every price') } },
      { question: t('Is it a one-time payment or a subscription?'), answer: t('A one-time payment. You pay once for the design you publish. There is no subscription, no renewal and nothing charged again later.') },
      { question: t('Is the payment secure?'), answer: t('Yes. All payments are processed by Razorpay, and ShareInvite never sees or stores your card details. In India you can pay by UPI, credit or debit card, or net banking.') },
      { question: t('What is the refund policy?'), answer: t('Refunds are for genuine problems: a double charge, a payment taken without your invitation being delivered, or a fault on our side we cannot fix. Ask within 7 days of paying, and approved refunds go back to your original payment method through Razorpay. A change of mind after publishing is not covered, since you can see the whole invitation before you pay. The full terms are in our'), link: { href: '/refund-policy', label: t('Refund & Cancellation Policy') } },
    ],
  },
  {
    id: 'sharing',
    title: t('Sharing, RSVP and guests'),
    items: [
      { question: t('How does sharing on WhatsApp work?'), answer: t('When you publish, you get your invitation’s own link and a WhatsApp share button. In the chat it shows a preview card, and guests open the invitation in their phone’s browser with no app to install.') },
      { question: t('Can guests RSVP?'), answer: t('On {rsvp} of {total} designs, yes. Guests tap Reply on the invitation and their answer opens in WhatsApp, ready to send to the number you choose. Each design\'s page says whether it has RSVP.', { rsvp: has('rsvp'), total: COUNT }) },
      { question: t('Is there a limit on guests?'), answer: t('No. Share the link with as many guests as you like. There is no guest count, no view limit and no charge per guest.') },
    ],
  },
  {
    id: 'after',
    title: t('After you publish'),
    items: [
      { question: t('Can I edit my invitation after paying?'), answer: t('Yes, until your celebration ends. Change a time, the venue, names or photos and the same link shows the new details to every guest. The design stays the one you paid for.') },
      { question: t('How long does my invitation stay online?'), answer: t('Through your celebration and for {ends} days after its last day. After that it shows that the celebration has taken place, and it is deleted, with its wishes and uploaded photos, {deleted} days after the last day. Greetings without a date stay online for {undated} days from publishing.', { ends: ENDS_AFTER_DAYS, deleted: DELETE_AFTER_DAYS, undated: UNDATED_DELETE_AFTER_DAYS }) },
    ],
  },
]
}

function faqJsonLd(GROUPS: ReturnType<typeof faqGroups>) {
  return {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: GROUPS.flatMap((g) => g.items).map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: answerText(q) } })),
  }
}

export default function FaqPage() {
  const t = serverT()
  const GROUPS = faqGroups(t)
  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(GROUPS)) }} />
      <SiteHeader />
      <PageHero
        crumbs={[{ name: t('Home'), href: '/' }, { name: t('FAQ') }]}
        eyebrow={t('FAQ')}
        title={<>{t('Questions,')}<br /><em className="font-medium text-burnished">{t('answered.')}</em></>}
        lede={t('Choosing a design, your account, customizing, paying, sharing and what happens after. Something not here? Contact us and a person replies.')}
        footnote={
          <nav aria-label={t('Topics')} className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="inline-flex min-h-[40px] items-center rounded-full border border-line bg-paper px-3.5 text-[0.9rem] font-medium text-charcoal transition-colors hover:border-burnished/60">
                {g.title}
              </a>
            ))}
          </nav>
        }
      />
      {GROUPS.map((g, i) => (
        <Section key={g.id} id={g.id} tone={i % 2 ? 'paper' : 'champagne'} aria-labelledby={`${g.id}-title`} innerClassName="scroll-mt-24 !py-12 sm:!py-16">
          <h2 id={`${g.id}-title`} className="t-h2 mx-auto max-w-3xl">{g.title}</h2>
          <div className="mt-6">
            <PricingFaq items={g.items} />
          </div>
        </Section>
      ))}
      <Section size="sm" aria-label={t('More help')}>
        <p className="mx-auto max-w-3xl text-[1rem] leading-8 text-charcoal/75">
          {rich(t('Still have a question? {contact} on WhatsApp or by email, or see {how} step by step.'), { contact: <Link href="/contact" className="link">{t('Contact us')}</Link>, how: <Link href="/how-it-works" className="link">{t('how it works')}</Link> })}
        </p>
      </Section>
      <CtaBand
        eyebrow={t('Ready when you are')}
        title={t('Find your invitation')}
        sub={t('Preview any design free. Create an account when you start customizing, and pay once when you publish.')}
        primary={{ href: '/templates', label: t('Explore invitation designs') }}
        secondary={null}
        location="faq_closing"
      />
      <SiteFooter />
    </main>
  )
}
