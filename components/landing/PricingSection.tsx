import Link from 'next/link'

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

const PRICE_GROUPS = [
  {
    id: 'free',
    price: '₹0',
    priceSub: 'Free forever',
    highlighted: false,
    badge: null as string | null,
    templates: [
      { id: 'elegant-wedding', name: 'Elegant Wedding' },
    ],
    cta: 'Start Free',
    ctaHref: '/create?template=elegant-wedding',
  },
  {
    id: 'standard',
    price: '₹299',
    priceSub: 'One-time payment',
    highlighted: true,
    badge: 'Most popular',
    templates: [
      { id: 'cinematic-night', name: 'Cinematic Night' },
      { id: 'indian-birthday', name: 'Janamdin' },
      { id: 'namakaran', name: 'Namakaran' },
    ],
    cta: 'Choose a Template →',
    ctaHref: '/create',
  },
  {
    id: 'premium',
    price: '₹599',
    priceSub: 'One-time payment',
    highlighted: false,
    badge: null as string | null,
    templates: [
      { id: 'indian-wedding', name: 'Shaadi' },
      { id: 'indian-engagement', name: 'Mangni' },
      { id: 'griha-pravesh', name: 'Griha Pravesh' },
    ],
    cta: 'Choose a Template →',
    ctaHref: '/create',
  },
  {
    id: 'gold',
    price: '₹999',
    priceSub: 'One-time payment',
    highlighted: false,
    badge: null as string | null,
    templates: [
      { id: 'anniversary', name: 'Saalgirah' },
      { id: 'kgf-wedding', name: 'KGF Royal Empire' },
      { id: 'royal-deco', name: 'Royal Deco' },
      { id: 'luxury-wedding', name: 'Luxury Wedding' },
    ],
    cta: 'Choose a Template →',
    ctaHref: '/create',
  },
]

const TRUST_BADGES = [
  {
    icon: (
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    text: 'No subscription',
  },
  {
    icon: (
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    text: 'Razorpay secured',
  },
  {
    icon: (
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    text: 'UPI · Card · Net banking',
  },
  {
    icon: (
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: 'Free plan always available',
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">

        <div className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong">
            Transparent pricing
          </p>
          <h2 className="font-heading text-4xl text-ink sm:text-5xl">
            One-time pricing for a one-time celebration.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted">
            Choose the template you love and pay only for that design. Every template includes all premium features — no subscriptions, no hidden charges.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PRICE_GROUPS.map((group) => {
            const isFeatured = group.highlighted
            const isFree = group.id === 'free'

            return (
              <article
                key={group.id}
                className={`relative flex flex-col rounded-3xl border p-7 ${
                  isFeatured
                    ? 'border-[#B87924] bg-[#221B17] text-white shadow-card-md'
                    : 'border-border bg-white text-foreground shadow-card'
                }`}
              >
                {isFeatured && group.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="whitespace-nowrap rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ background: 'linear-gradient(135deg,#B87924,#D9A441)', color: '#fff' }}
                    >
                      {group.badge}
                    </span>
                  </div>
                )}

                <p className={`font-heading text-4xl ${isFeatured ? 'text-white' : 'text-ink'}`}>
                  {group.price}
                </p>
                <p className={`mt-1 text-xs ${isFeatured ? 'text-white/55' : 'text-muted'}`}>
                  {group.priceSub}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {group.templates.map((tpl) => (
                    <li key={tpl.id} className="flex items-center gap-2.5">
                      <span className={isFeatured ? 'text-[#D9A441]' : 'text-accent-strong'}>
                        <CheckIcon />
                      </span>
                      <span className={`text-sm ${isFeatured ? 'text-white/80' : 'text-foreground'}`}>
                        {tpl.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={group.ctaHref}
                  className={`mt-8 flex items-center justify-center rounded-xl py-3.5 text-sm font-semibold transition-all ${
                    isFeatured
                      ? 'bg-white text-ink hover:bg-white/90'
                      : isFree
                      ? 'gold-button'
                      : 'gold-button'
                  }`}
                >
                  {group.cta}
                </Link>
              </article>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          All templates include the same premium features · Pay once · No recurring charges
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {TRUST_BADGES.map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-[12px] text-muted shadow-sm"
            >
              {icon}
              <span>{text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
