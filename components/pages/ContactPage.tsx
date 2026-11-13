import Link from '@/components/ui/Link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import { Section } from '@/components/brand/Section'
import CustomRequestForm from '@/components/landing/CustomRequestForm'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_URL } from '@/lib/support'
import { localeMeta } from '@/lib/pageMeta'
import { serverT, tFor } from '@/lib/serverLang'
import { rich } from '@/lib/translate'


export function contactMetadata(lang: string) {
  const t = tFor(lang)
  return localeMeta(lang, '/contact', {
    title: t('Contact ShareInvite'),
    description: t('Message ShareInvite on WhatsApp or by email, or request a custom invitation design for an occasion we do not have yet.'),
  })
}

/**
 * Contact: the two ways to reach the team that really exist (WhatsApp and email, lib/support), and
 * the custom-design request form, which posts to /api/custom-request as it does on the homepage.
 * No office address or opening hours: none are published.
 */
export default function ContactPage() {
  const t = serverT()
  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <SiteHeader />
      <PageHero
        crumbs={[{ name: t('Home'), href: '/' }, { name: t('Contact') }]}
        eyebrow={t('Contact')}
        title={<>{t('Talk to a person')}<br /><em className="font-medium text-burnished">{t('about your invitation.')}</em></>}
        lede={t('Questions before you buy, help with a design you are making, or a design we do not have yet. Message us and a member of the team replies.')}
      />

      <Section aria-label={t('Ways to reach us')} innerClassName="!pt-12 sm:!pt-16">
        <div className="grid gap-4 md:grid-cols-2">
          <a href={SUPPORT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-3xl border border-line bg-paper p-6 transition-colors hover:border-burnished/60 sm:p-8">
            <span className="eyebrow">{t('Fastest')}</span>
            <span className="t-h3 mt-2">{t('WhatsApp')}</span>
            <span className="mt-2 text-[1.05rem] font-semibold tabular-nums text-charcoal">{SUPPORT_WHATSAPP_DISPLAY}</span>
            <span className="mt-1 text-[0.92rem] leading-7 text-charcoal/70">{t('Send a message with your question, or the design you are working on.')}</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-emerald-soft">{t('Open WhatsApp')} <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
          </a>
          <div className="flex flex-col rounded-3xl border border-line bg-paper p-6 sm:p-8">
            <span className="eyebrow">{t('By email')}</span>
            <span className="t-h3 mt-2">{t('Email')}</span>
            <span className="mt-2 select-all break-all text-[1.05rem] font-semibold text-charcoal">{SUPPORT_EMAIL}</span>
            <span className="mt-1 text-[0.92rem] leading-7 text-charcoal/70">{t('For receipts, refunds and anything you would like in writing.')}</span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-4 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-emerald-soft hover:underline">{t('Write an email')} <ArrowRightIcon /></a>
          </div>
        </div>
        <p className="mt-6 text-[0.92rem] leading-7 text-charcoal/70">
          {rich(t('Many answers are already in the {faq}: pricing, payment, sharing, RSVP and refunds. Your invitations are in {mine}.'), { faq: <Link href="/faq" className="link">{t('FAQ')}</Link>, mine: <Link href="/dashboard" className="link">{t('My invitations')}</Link> })}
        </p>
      </Section>

      <Section tone="paper" id="custom-design" aria-labelledby="custom-design-title" innerClassName="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow">{t('Custom designs')}</p>
            <h2 id="custom-design-title" className="t-h2 mt-3">{t('Celebrating something we do not have a design for?')}</h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-charcoal/75">
              {t('Tell us the occasion, the style and the language, and our design team will make an invitation for it, delivered as the same shareable link as every design.')}
            </p>
            <ul className="mt-6 space-y-3 text-[0.95rem] text-charcoal/80">
              <li>{t('Custom colours, fonts and motifs for your theme')}</li>
              <li>{t('Ready in 2 to 5 working days')}</li>
              <li>{t('No upfront payment')}</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-9">
            <CustomRequestForm idPrefix="contact-request" />
          </div>
        </div>
      </Section>

      <SiteFooter />
    </main>
  )
}
