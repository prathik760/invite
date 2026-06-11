import type { Metadata } from 'next'
import Link from 'next/link'
import { BuildingIcon, CameraIcon, LaptopIcon, PaletteIcon, PenIcon, BanknoteIcon, BarChartIcon, ZapIcon, PhoneIcon, AwardIcon } from '@/components/ui/Icons'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in'

export const metadata: Metadata = {
  title: 'Partner with ShareInvite | Wedding Planners & Event Professionals India',
  description:
    'Join the ShareInvite partner programme. Refer clients to our digital invitation platform and earn a commission on every paid subscription. Built for Indian wedding planners, photographers, and event managers.',
  keywords: [
    'ShareInvite partner programme',
    'wedding planner referral programme India',
    'event professional partner digital invitations',
    'earn commission wedding invitations India',
    'affiliate programme digital invitations India',
  ],
  alternates: { canonical: `${APP_URL}/partners` },
  openGraph: {
    title: 'Partner with ShareInvite | Wedding Professionals India',
    description: 'Refer clients to ShareInvite and earn on every subscription. Built for Indian wedding planners, photographers, and event managers.',
    type: 'website',
    locale: 'en_IN',
  },
}

const partnerTypes = [
  {
    icon: <BuildingIcon />,
    title: 'Wedding Planners',
    desc: 'Add a digital invitation to every wedding package you offer. Your clients get a beautiful invite website; you earn commission on every subscription they purchase.',
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
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" width="120" height="32" />
            <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-5 py-2.5 text-sm font-semibold">Create Free Invite</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FCF7F1] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,164,65,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9A441]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-accent-strong shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F766D]" />
            Partner Programme · Free to join
          </div>
          <h1 className="font-display font-normal text-4xl text-ink leading-tight sm:text-6xl mt-4">
            Grow your business<br />
            <span className="gradient-accent italic">with ShareInvite</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Join India's leading digital invitation platform as a partner. Recommend ShareInvite to your clients and earn 20% commission on every subscription. Built for wedding planners, photographers, venue managers, and event professionals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:shareinvite123@gmail.com?subject=Partner Programme Application`}
              className="gold-button rounded-full px-10 py-4 text-base font-semibold"
            >
              Apply to Partner →
            </a>
            <span className="text-sm text-muted">Free to join · No monthly fee</span>
          </div>
        </div>
      </section>

      {/* Commission stats */}
      <section className="border-y border-border bg-white px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {benefits.map(b => (
              <div key={b.label} className="text-center">
                <p className="font-display text-4xl text-ink">{b.value}</p>
                <p className="mt-1 text-sm text-muted">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who can partner */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-3 sm:text-4xl">
            Who can partner with ShareInvite?
          </h2>
          <p className="text-center text-muted text-sm mb-10 max-w-xl mx-auto">
            Any professional who works with Indian families planning weddings or events
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partnerTypes.map(p => (
              <div key={p.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A3E4A]/10 text-[#7A3E4A]">{p.icon}</div>
                <h3 className="font-heading text-lg text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-muted leading-6">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-border px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10">
            How the partner programme works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', title: 'Apply and get your link', desc: 'Fill in a short application form. We will send you a unique referral link and access to the partner dashboard within 48 hours.' },
              { step: '02', title: 'Share with your clients', desc: 'Recommend ShareInvite to your clients, share your link in your packages, or mention it in your blog or social channels.' },
              { step: '03', title: 'Earn on every subscription', desc: 'You earn 20% commission for every paid subscription your referral link generates. Payouts are made monthly to your bank account.' },
            ].map(s => (
              <div key={s.step} className="rounded-2xl border border-border bg-background p-7 shadow-sm">
                <p className="font-heading text-5xl text-accent/60">{s.step}</p>
                <h3 className="mt-5 font-heading text-xl text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What partners get */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display font-normal text-3xl text-ink text-center mb-10 sm:text-4xl">
            What you get as a partner
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <BanknoteIcon />, title: '20% commission', desc: 'Earn 20% on every paid ShareInvite subscription your clients purchase through your referral link.' },
              { icon: <BarChartIcon />, title: 'Partner dashboard', desc: 'Track clicks, conversions, and earnings in real time from your personalised partner dashboard.' },
              { icon: <PaletteIcon />, title: 'Marketing materials', desc: 'Get branded graphics, copy, and email templates to share ShareInvite with your clients professionally.' },
              { icon: <ZapIcon />, title: 'Early access', desc: 'Partners get early access to new features and templates before they are released to the public.' },
              { icon: <PhoneIcon />, title: 'Priority support', desc: 'A dedicated partner support channel — WhatsApp and email — with a faster response SLA.' },
              { icon: <AwardIcon />, title: 'Co-promotion', desc: 'Active partners are featured in ShareInvite\'s social channels and blog — additional exposure for your business.' },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A3E4A]/10 text-[#7A3E4A]">{f.icon}</div>
                <h3 className="font-heading text-lg text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCCD] bg-[#FFF9F2] p-10 shadow-sm">
          <h2 className="font-display font-normal text-3xl text-ink mb-4">
            Ready to become a ShareInvite partner?
          </h2>
          <p className="text-muted text-sm mb-7 max-w-md mx-auto">
            Send us a quick note at{' '}
            <a href="mailto:shareinvite123@gmail.com" className="text-accent-strong hover:underline">
              shareinvite123@gmail.com
            </a>{' '}
            with your name, business type, and how you work with Indian families planning events. We will get back to you within 48 hours.
          </p>
          <a
            href="mailto:shareinvite123@gmail.com?subject=Partner Programme Application"
            className="gold-button inline-flex rounded-full px-10 py-4 text-base font-semibold"
          >
            Apply Now →
          </a>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        <Link href="/" className="flex items-center justify-center gap-2">
          <img src="/logo1.png" alt="ShareInvite" className="h-7 w-auto" width="100" height="28" />
          <span className="font-display text-lg text-ink">ShareInvite</span>
        </Link>
        <p className="mt-2">Free digital invitation website builder for Indian weddings and events.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/press" className="hover:text-foreground transition-colors">Press</Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <Link href="/create" className="hover:text-foreground transition-colors">Create Invite</Link>
        </div>
      </footer>
    </main>
  )
}
