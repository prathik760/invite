import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import TrackedLink from '@/components/ui/TrackedLink'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import CtaBand from '@/components/brand/CtaBand'
import TrustList from '@/components/brand/TrustList'
import { Section, SectionHeading } from '@/components/brand/Section'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/Icons'
import { buildCatalogItems } from '@/lib/catalogItems'
import { LOWEST_PAID_PRICE, HIGHEST_PAID_PRICE } from '@/lib/plans'
import { ENDS_AFTER_DAYS } from '@/lib/retention'
import { PayMethods } from '@/components/price/Price'
import { localeMeta } from '@/lib/pageMeta'
import { serverT, tFor } from '@/lib/serverLang'
import { rich, type T } from '@/lib/translate'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

export function howItWorksMetadata(lang: string) {
  const t = tFor(lang)
  return localeMeta(lang, '/how-it-works', {
    title: t('How It Works: Make a Digital Invitation | ShareInvite'),
    description: t('Choose a design, preview it live, create a free account, personalize it and pay once ({from} to {to}) when you publish. Then share one link on WhatsApp.', { from: inr(LOWEST_PAID_PRICE), to: inr(HIGHEST_PAID_PRICE) }),
  })
}

const ITEMS = buildCatalogItems()
const COUNT = ITEMS.length
const RSVP = ITEMS.filter((i) => i.features.includes('rsvp')).length

/** Each step with the real screen it shows: the Rajwada invitation as guests and hosts see it. */
function steps(t: T) {
  return [
  {
    n: '01',
    title: t('Choose a design'),
    copy: t('Browse {n} designs by occasion, level and what they include. Every one shows its real price.', { n: COUNT }),
    points: [t('Weddings, birthdays, housewarmings, festivals and more'), t('Filter by photos, music, map or RSVP')],
    image: '/landing/rj-closed.webp',
    alt: t('The Rajwada invitation opening on palace doors'),
    caption: t('Rajwada, as it opens on a guest’s phone'),
  },
  {
    n: '02',
    title: t('Preview it live'),
    copy: t('Open any design exactly as guests will see it, with its animation and music. Previewing never needs an account or a card.'),
    points: [t('Tap through the real invitation'), t('See which features the design has')],
    image: '/landing/rj-names.webp',
    alt: t('The Rajwada invitation with sample names, Aditi and Kabir'),
    caption: t('The live preview, with sample details'),
  },
  {
    n: '03',
    title: t('Create a free account'),
    copy: t('When you choose Customize, sign in or create an account with Google or your email. It keeps your invitations in one place, and you return straight to the design you picked.'),
    points: [t('Free, and no card needed'), t('Change the details until your event')],
    image: null,
    alt: '',
    caption: '',
  },
  {
    n: '04',
    title: t('Make it yours'),
    copy: t('Type your names, dates, venue and message, and add your photos and music. The invitation updates as you type.'),
    points: [t('Your own words, in any language'), t('Google Maps directions to your venue')],
    image: '/landing/edit-names.webp',
    alt: t('The same invitation after the names were changed to Meera and Arjun'),
    caption: t('The same design, with your names'),
  },
  {
    n: '05',
    title: t('Pay once and publish'),
    copy: t('Pay the design’s one price, from {from}, by UPI, card or net banking through Razorpay. There is no subscription. Your invitation goes live on its own link.', { from: inr(LOWEST_PAID_PRICE) }),
    points: [t('One payment per design'), t('A 7-day refund policy for genuine problems')],
    image: '/templates/phone/share-rajwada.jpg',
    alt: t('The link preview card guests see in WhatsApp'),
    caption: t('Your link, as it appears in a chat'),
    wide: true,
  },
  {
    n: '06',
    title: t('Share it and hear back'),
    copy: t('Send the link on WhatsApp, Instagram, email or text, to as many guests as you like. On {n} designs guests reply on WhatsApp, and on most they leave wishes on the invitation.', { n: RSVP }),
    points: [t('Online through your event and {n} days after', { n: ENDS_AFTER_DAYS }), t('Guests need no app')],
    image: '/landing/rj-reply.webp',
    alt: t('The RSVP section of the invitation with a Reply on WhatsApp button'),
    caption: t('Guests reply from the invitation'),
  },
] as const
}

export default function HowItWorksPage() {
  const t = serverT()
  const STEPS = steps(t)
  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <SiteHeader />
      <PageHero
        crumbs={[{ name: t('Home'), href: '/' }, { name: t('How it works') }]}
        eyebrow={t('How it works')}
        title={<>{t('From the first look')}<br /><em className="font-medium text-burnished">{t('to the first reply.')}</em></>}
        lede={t('Six steps, and you see the finished invitation before you pay. Browsing and previews are open to everyone; you only need a free account when you start customizing.')}
        actions={
          <>
            <TrackedLink href="/templates" location="how_it_works_hero" className="btn-primary inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-8 text-[1rem] font-semibold">
              {t('Explore invitations')}
              <ArrowRightIcon />
            </TrackedLink>
            <Link href="/pricing" className="btn-outline inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-[1rem] font-semibold">
              {t('See the prices')}
            </Link>
          </>
        }
        footnote={<TrustList />}
      />

      <Section aria-labelledby="steps-title">
        <SectionHeading id="steps-title" eyebrow={t('Step by step')} title={t('How an invitation comes together')} />
        <ol className="mt-10 space-y-6 sm:mt-14 sm:space-y-8">
          {STEPS.map((s, i) => (
            <li key={s.n} className={`grid items-center gap-6 rounded-3xl border border-line bg-paper p-5 sm:p-8 ${s.image ? 'md:grid-cols-[1.15fr_0.85fr] md:gap-12' : ''}`}>
              <div className={s.image && i % 2 === 1 ? 'md:order-2' : ''}>
                <span className="font-editorial text-[3rem] font-semibold leading-none text-burnished/40">{s.n}</span>
                <h2 className="t-h3 mt-3">{s.title}</h2>
                <p className="mt-3 max-w-xl text-[1rem] leading-8 text-charcoal/75">{s.copy}</p>
                <ul className="mt-4 space-y-2 text-[0.95rem]">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5"><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-emerald-soft" />{pt}</li>
                  ))}
                </ul>
                {s.n === '03' && (
                  <p className="mt-5 text-[0.9rem] leading-7 text-charcoal/70">
                    {rich(t('Forgot your password later? {link}.'), { link: <Link href="/auth/forgot" className="link">{t('Reset it by email')}</Link> })}
                  </p>
                )}
              </div>
              {s.image && (
                <figure className={`mx-auto w-full ${'wide' in s && s.wide ? 'max-w-[26rem]' : 'max-w-[15rem]'}`}>
                  <div className={`overflow-hidden rounded-[1.6rem] border border-line bg-peach shadow-lift ${'wide' in s && s.wide ? '' : 'aspect-[600/1000]'}`}>
                    <Image src={s.image} alt={s.alt} width={600} height={'wide' in s && s.wide ? 315 : 1298} unoptimized className={'wide' in s && s.wide ? 'block h-auto w-full' : 'h-full w-full object-cover object-top'} />
                  </div>
                  <figcaption className="mt-3 text-center text-[0.85rem] text-muted">{s.caption}</figcaption>
                </figure>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="paper" size="sm" aria-label={t('Payment')}>
        <div className="grid gap-4 text-[0.95rem] sm:grid-cols-3">
          <p><span className="block font-semibold">{t('Pay only when you publish')}</span><span className="text-charcoal/70">{t('Build and preview everything first.')}</span></p>
          <p><span className="block font-semibold">{t('One price per design')}</span><span className="text-charcoal/70">{t('Shown on the design, from {from} to {to}.', { from: inr(LOWEST_PAID_PRICE), to: inr(HIGHEST_PAID_PRICE) })}</span></p>
          <p><span className="block font-semibold">{t('Secure by Razorpay')}</span><span className="text-charcoal/70"><PayMethods capitalise /></span></p>
        </div>
        <p className="mt-6 text-[0.9rem] text-charcoal/70">
          {rich(t('More questions? Read the {faq} or {contact}.'), { faq: <Link href="/faq" className="link">{t('FAQ')}</Link>, contact: <Link href="/contact" className="link">{t('contact us')}</Link> })}
        </p>
      </Section>

      <CtaBand
        eyebrow={t('Start with a design')}
        title={t('Find the invitation that feels like yours')}
        sub={t('Preview any design free. Create an account when you start customizing, and pay once when you publish.')}
        primary={{ href: '/templates', label: t('Explore invitation designs') }}
        secondary={null}
        location="how_it_works_closing"
      />
      <SiteFooter />
    </main>
  )
}
