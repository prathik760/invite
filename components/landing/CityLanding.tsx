import Link from 'next/link'
import type { ReactNode } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/landing/SiteFooter'
import FAQAccordion from '@/components/landing/FAQAccordion'
import TemplateCard from '@/components/catalog/TemplateCard'
import PageHero, { type Crumb } from '@/components/brand/PageHero'
import OfferCard from '@/components/brand/OfferCard'
import HowItWorks from '@/components/brand/HowItWorks'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'
import { Section, SectionHeading } from '@/components/brand/Section'
import TrackedLink from '@/components/ui/TrackedLink'
import {
  ArrowRightIcon, CalendarIcon, CameraIcon, ClipboardIcon, ClockIcon, HomeIcon, MapPinIcon, MessageIcon, MusicIcon, RingIcon,
} from '@/components/ui/Icons'
import type { CityFaq } from '@/lib/cityContent'
import { OCCASION_MAP } from '@/lib/catalog'
import { buildCatalogItems } from '@/lib/catalogItems'
import { templatePrice } from '@/lib/plans'

type Occasion = 'wedding' | 'birthday' | 'engagement' | 'home'

/**
 * Features per occasion, written for the city. Honest by construction: every
 * item is something the occasion's designs actually render. The old pages
 * listed a plan ladder, "stays live for 1 year" (invitations expire three days
 * after the event) and RSVP on every design (only one has it).
 */
function featuresFor(occasion: Occasion, city: string) {
  const common = [
    { icon: <ClockIcon />, title: 'Live countdown', desc: 'A ticking countdown to the moment keeps guests looking forward to it.' },
    { icon: <CameraIcon />, title: 'Photo gallery', desc: 'Your photos, beautifully laid out for guests to scroll through.' },
    { icon: <MessageIcon />, title: 'Guest wishes', desc: 'Blessings and messages from guests appear live on the invitation.' },
  ]
  switch (occasion) {
    case 'wedding':
      return [
        { icon: <MapPinIcon />, title: `${city} venue map`, desc: `Your ${city} venue with a one-tap Google Maps link — no confused calls on the day.` },
        { icon: <ClipboardIcon />, title: 'Every ceremony', desc: 'Mehendi, Haldi, Sangeet, wedding and reception — with dates, times and venues.' },
        { icon: <MusicIcon />, title: 'Background music', desc: 'Your wedding song plays softly as guests open the invite.' },
        ...common,
      ]
    case 'engagement':
      return [
        { icon: <RingIcon />, title: 'Both families', desc: 'Both families’ names in the traditional format, beautifully set.' },
        { icon: <MapPinIcon />, title: `${city} venue map`, desc: `One-tap Google Maps directions to your ${city} venue.` },
        { icon: <CalendarIcon />, title: 'Ceremony schedule', desc: 'Ring exchange, blessings and dinner in one clear timeline.' },
        ...common,
      ]
    case 'birthday':
      return [
        { icon: <MapPinIcon />, title: `${city} party venue`, desc: `The address and a one-tap map for your ${city} venue.` },
        { icon: <CalendarIcon />, title: 'Party schedule', desc: 'Arrival, cake cutting, dinner and games — a clear timeline.' },
        { icon: <MusicIcon />, title: 'Favourite song', desc: 'Their favourite track plays when guests open the invite.' },
        ...common,
      ]
    case 'home':
      return [
        { icon: <ClockIcon />, title: 'Muhurat time', desc: 'The auspicious time shown prominently — the detail guests need most.' },
        { icon: <HomeIcon />, title: 'Your new address', desc: `Your new ${city} home with a one-tap Google Maps link.` },
        { icon: <ClipboardIcon />, title: 'Pooja schedule', desc: 'Ganesh pooja, vastu pooja, griha pravesh and lunch, in order.' },
        common[1],
        common[2],
      ]
  }
}

export default function CityLanding({
  occasion,
  templateId,
  pageKey,
  crumbs,
  city,
  eyebrow,
  title,
  lede,
  local,
  faqTitle,
  faqs,
  links,
  closing,
}: {
  occasion: Occasion
  templateId: string
  pageKey: string
  crumbs: Crumb[]
  city: string
  eyebrow: string
  title: ReactNode
  lede: string
  local: { title: string; paras: string[]; chips?: { label: string; items: string[] }[] }
  faqTitle: string
  faqs: CityFaq[]
  links: { href: string; label: string }[]
  closing: { title: string; sub?: string }
}) {
  const createHref = `/create?template=${templateId}&src=${pageKey}`
  const items = buildCatalogItems(OCCASION_MAP[occasion]?.templateIds)
  const price = templatePrice(templateId)
  const features = featuresFor(occasion, city)

  return (
    <main className="min-h-screen bg-champagne text-charcoal">
      <SiteHeader createHref={`/create?template=${templateId}`} />

      <PageHero
        crumbs={crumbs}
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        actions={
          <>
            <TrackedLink
              href={createHref}
              location={`${pageKey}_hero`}
              meta={{ template_id: templateId, price, page_type: 'city_landing', city }}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold"
            >
              Create your {city} invitation
              <ArrowRightIcon />
            </TrackedLink>
            <a href="#designs" className="btn-outline inline-flex items-center justify-center rounded-full px-8 py-4 text-[1rem] font-semibold">
              See the designs
            </a>
          </>
        }
        footnote={<TrustList />}
        aside={<OfferCard cta={`Create your ${city} invitation`} href={createHref} location={`${pageKey}_offer`} />}
      />

      <Section tone="paper" aria-label={local.title}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div data-reveal>
            <p className="eyebrow">Made for {city}</p>
            <h2 className="t-h2 mt-3">{local.title}</h2>
            <div className="prose-brand mt-6">
              {local.paras.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
            </div>
          </div>
          {local.chips && local.chips.length > 0 && (
            <div className="space-y-6" data-reveal="right">
              {local.chips.map((group) => (
                <div key={group.label} className="card-quiet p-6">
                  <p className="eyebrow">{group.label}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="pill px-3.5 py-1.5 text-[0.85rem]">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {items.length > 0 && (
        <Section id="designs" aria-label="Designs">
          <SectionHeading
            eyebrow="The designs"
            title="Choose a design you love"
            sub="Tap any design for a live preview. Each has one price, paid once when you publish."
            action={{ href: '/templates', label: 'Every design' }}
          />
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" data-reveal-group>
            {items.map((item) => <TemplateCard key={item.id} item={item} source={`${pageKey}_gallery`} />)}
          </div>
        </Section>
      )}

      <Section tone="paper" aria-label="What's included">
        <SectionHeading eyebrow="What's included" title={`Everything your ${city} invitation needs`} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
          {features.map((f) => (
            <li key={f.title} className="flex items-start gap-4 rounded-3xl border border-line bg-champagne p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald text-gold-soft [&>svg]:h-5 [&>svg]:w-5">{f.icon}</span>
              <span>
                <span className="block font-editorial text-[1.3rem] font-semibold leading-tight">{f.title}</span>
                <span className="mt-1 block text-[0.9rem] leading-6 text-charcoal/70">{f.desc}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.85rem] text-muted">Features vary by design — the live preview shows exactly what each one includes.</p>
      </Section>

      <Section tone="peach" aria-label="How it works">
        <SectionHeading align="center" eyebrow="How it works" title="Three steps to your invitation" />
        <div className="mt-12"><HowItWorks /></div>
      </Section>

      <Section tone="paper" id="faq" aria-label={faqTitle}>
        <SectionHeading align="center" eyebrow="Questions" title={faqTitle} />
        <div className="mt-10">
          <FAQAccordion faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
        </div>
      </Section>

      <Section size="sm" aria-label="More guides">
        <p className="eyebrow">More invitation guides</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="pill px-4 py-2 text-[0.88rem] hover:border-burnished">{l.label}</Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title={closing.title}
        sub={closing.sub ?? `Free to build & preview · ₹${price.toLocaleString('en-IN')} one-time to publish`}
        primary={{ href: `/create?template=${templateId}&src=${pageKey}_footer`, label: `Create your ${city} invitation` }}
        secondary={{ href: '/templates', label: 'Browse every design' }}
        location={`${pageKey}_footer`}
      />
      <SiteFooter />
    </main>
  )
}
