import SiteHeader from '@/components/layout/SiteHeader'
import type { Metadata } from 'next'
import { BuildingIcon, CameraIcon, LaptopIcon, PaletteIcon, PenIcon, BanknoteIcon, BarChartIcon, ZapIcon, PhoneIcon, AwardIcon } from '@/components/ui/Icons'
import SiteFooter from '@/components/landing/SiteFooter'
import PageHero from '@/components/brand/PageHero'
import TrustList from '@/components/brand/TrustList'
import CtaBand from '@/components/brand/CtaBand'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: { absolute: 'ShareInvite Partner Programme | Earn 20% Per Referral' },
  description:
    'Earn 20% per referral on ShareInvite — India\'s digital invitation platform. Built for Indian wedding planners, photographers, venue managers, and event professionals.',
  keywords: [
    'ShareInvite partner programme',
    'wedding planner referral programme India',
    'event professional partner digital invitations',
    'earn commission wedding invitations India',
    'affiliate programme digital invitations India',
  ],
  alternates: { canonical: `${APP_URL}/partners` },
  openGraph: {
    title: 'ShareInvite Partner Programme | Earn 20% Per Referral',
    description: 'Earn 20% per referral on ShareInvite. Built for Indian wedding planners, photographers, venue managers, and event professionals.',
    type: 'website',
    locale: 'en_IN',
  },
}

const partnerTypes = [
  {
    icon: <BuildingIcon />,
    title: 'Wedding Planners',
    desc: 'Add a digital invitation to every wedding package you offer. Your clients get a beautiful invite website; you earn commission on every design they buy.',
  },
  {
    icon: <CameraIcon />,
    title: 'Photographers & Videographers',
    desc: 'Recommend ShareInvite as part of your pre-wedding service. Couples who book pre-wedding shoots are the exact audience who want a premium digital invitation.',
  },
  {
    icon: <BuildingIcon />,
    title: 'Venues & Hotels',
    desc: 'Banquet venues and hotels in India can partner to offer ShareInvite invitations to their event clients. A complete package from booking to guest invitation.',
  },
  {
    icon: <PaletteIcon />,
    title: 'Graphic Designers',
    desc: 'If you design wedding stationery, add a digital invitation to your offering. ShareInvite makes it easy to deliver a live invite page without building anything from scratch.',
  },
  {
    icon: <LaptopIcon />,
    title: 'Web & Tech Freelancers',
    desc: 'Recommend ShareInvite to clients who ask for a wedding or event website. It is faster to set up than a custom build and earns you a recurring referral income.',
  },
  {
    icon: <PenIcon />,
    title: 'Wedding Bloggers & Influencers',
    desc: 'Share your unique affiliate link with your audience. Every Indian wedding content creator can earn from recommending a product their audience actively needs.',
  },
]

const benefits = [
  { label: 'Commission per sale', value: '20%' },
  { label: 'Cookie duration', value: '60 days' },
  { label: 'Payout cycle', value: 'Monthly' },
  { label: 'Min payout', value: '₹500' },
]

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-champagne text-foreground">
      <SiteHeader />

      {/* Hero */}
      <PageHero
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Partners' }]} eyebrow="Partner Programme · Free to join"
        title={<>Grow your business<br />
            <span className="text-burnished italic">with ShareInvite</span></>}
        lede={<>Join ShareInvite as a partner. Recommend us to your clients and earn 20% commission on every design they buy. Built for wedding planners, photographers, venue managers, and event professionals.</>}
        footnote={<TrustList />}
      />

      {/* Commission stats */}
      <section className="border-y border-line bg-paper px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {benefits.map(b => (
              <div key={b.label} className="text-center">
                <p className="font-editorial font-semibold text-4xl text-charcoal">{b.value}</p>
                <p className="mt-1 text-sm text-muted">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who can partner */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="t-h2 text-center mb-3">
            Who can partner with ShareInvite?
          </h2>
          <p className="text-center text-muted text-sm mb-10 max-w-xl mx-auto">
            Any professional who works with Indian families planning weddings or events
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partnerTypes.map(p => (
              <div key={p.title} className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B4A34]/10 text-[#0B4A34]">{p.icon}</div>
                <h3 className="font-editorial font-semibold text-lg text-charcoal mb-2">{p.title}</h3>
                <p className="text-sm text-muted leading-6">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-paper border-y border-line px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="t-h2 text-center mb-10">
            How the partner programme works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', title: 'Apply and get your link', desc: 'Fill in a short application form. We will send you a unique referral link and access to the partner dashboard within 48 hours.' },
              { step: '02', title: 'Share with your clients', desc: 'Recommend ShareInvite to your clients, share your link in your packages, or mention it in your blog or social channels.' },
              { step: '03', title: 'Earn on every purchase', desc: 'You earn 20% commission on every design bought through your referral link. Payouts are made monthly to your bank account.' },
            ].map(s => (
              <div key={s.step} className="rounded-2xl border border-line bg-champagne p-7 shadow-sm">
                <p className="font-editorial font-semibold text-5xl text-accent/60">{s.step}</p>
                <h3 className="mt-5 font-editorial font-semibold text-xl text-charcoal">{s.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What partners get */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="t-h2 text-center mb-10">
            What you get as a partner
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <BanknoteIcon />, title: '20% commission', desc: 'Earn 20% on every ShareInvite design your clients buy through your referral link.' },
              { icon: <BarChartIcon />, title: 'Partner dashboard', desc: 'Track clicks, conversions, and earnings in real time from your personalised partner dashboard.' },
              { icon: <PaletteIcon />, title: 'Marketing materials', desc: 'Get branded graphics, copy, and email templates to share ShareInvite with your clients professionally.' },
              { icon: <ZapIcon />, title: 'Early access', desc: 'Partners get early access to new features and templates before they are released to the public.' },
              { icon: <PhoneIcon />, title: 'Priority support', desc: 'A dedicated partner support channel — WhatsApp and email — with a faster response SLA.' },
              { icon: <AwardIcon />, title: 'Co-promotion', desc: 'Active partners are featured in ShareInvite\'s social channels and blog — additional exposure for your business.' },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B4A34]/10 text-[#0B4A34]">{f.icon}</div>
                <h3 className="font-editorial font-semibold text-lg text-charcoal mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBand
        eyebrow="Partner with us"
        title="Ready to become a ShareInvite partner?"
        sub="Email shareinvite123@gmail.com with your name, business type and how you work with families planning events. We will get back to you within 48 hours."
        primary={{ href: 'mailto:shareinvite123@gmail.com', label: 'Email us to partner' }}
        secondary={{ href: '/templates', label: 'See the designs' }}
        location="partners_footer"
      />

      <SiteFooter />
    </main>
  )
}
