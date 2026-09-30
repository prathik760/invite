import Link from 'next/link'
import { LOCALES, localePath } from '@/lib/i18n'
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP_URL } from '@/lib/support'
import Logo from '@/components/brand/Logo'

/**
 * Site-wide footer. Every link below is a real route, and the footer is the
 * main internal-linking surface for the occasion, city and wording pages — so
 * links are only ever added here, not dropped, without a redirect in place.
 */
const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Invitations',
    links: [
      { label: 'Wedding invitations', href: '/wedding-invitation' },
      { label: 'Engagement invitations', href: '/engagement-invitation' },
      { label: 'Birthday invitations', href: '/birthday-invitation' },
      { label: 'Anniversary invitations', href: '/anniversary-invitation' },
      { label: 'Housewarming invitations', href: '/griha-pravesh-invitation' },
      { label: 'Naming ceremony invitations', href: '/namakaran-invitation' },
      { label: 'All digital invitations', href: '/digital-invitation' },
    ],
  },
  {
    title: 'Create',
    links: [
      { label: 'Browse templates', href: '/templates' },
      { label: 'Create an invitation', href: '/create' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'WhatsApp invitation maker', href: '/whatsapp-invitation-maker' },
      { label: 'Online RSVP', href: '/online-rsvp' },
      { label: 'Request a custom design', href: '/#custom-template' },
      { label: 'My invitations', href: '/dashboard' },
    ],
  },
  {
    title: 'Wording & ideas',
    links: [
      { label: 'Wedding invitation wording', href: '/wedding-invitation-wording' },
      { label: 'Engagement invitation wording', href: '/engagement-invitation-wording' },
      { label: 'Birthday invitation wording', href: '/birthday-invitation-wording' },
      { label: 'Baby shower invitation wording', href: '/baby-shower-invitation-wording' },
      { label: 'Housewarming invitation wording', href: '/griha-pravesh-invitation-wording' },
      { label: 'Naming ceremony wording', href: '/namakaran-invitation-wording' },
      { label: 'All blog posts', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Partner with us', href: '/partners' },
      { label: 'Press & media', href: '/press' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Refund & cancellation', href: '/refund-policy' },
    ],
  },
]

const BLOG_TOPICS = [
  { label: 'Weddings', href: '/blog/category/wedding' },
  { label: 'Engagements', href: '/blog/category/engagement' },
  { label: 'Birthdays', href: '/blog/category/birthday' },
  { label: 'Housewarming', href: '/blog/category/housewarming' },
  { label: 'Digital invitation trends', href: '/blog/category/digital-invitations' },
  { label: 'Ganesh Chaturthi invitations', href: '/blog/ganesh-chaturthi-invitation-card-online-digital-ganpati-invitation-template' },
]

const CITY_PAGES = [
  { label: 'Wedding · Bengaluru', href: '/wedding-invitation/bengaluru' },
  { label: 'Wedding · Mumbai', href: '/wedding-invitation/mumbai' },
  { label: 'Wedding · Delhi', href: '/wedding-invitation/delhi' },
  { label: 'Wedding · Hyderabad', href: '/wedding-invitation/hyderabad' },
  { label: 'Birthday · Chennai', href: '/birthday-invitation/chennai' },
  { label: 'Birthday · Pune', href: '/birthday-invitation/pune' },
  { label: 'Engagement · Kolkata', href: '/engagement-invitation/kolkata' },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/shareinvite.in', path: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z' },
  { label: 'Facebook', href: 'https://www.facebook.com/shareinvite.in', path: 'M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.3l-.5 3.5h-2.8V24C19.6 23 24 18.1 24 12.1z' },
  { label: 'YouTube', href: 'https://www.youtube.com/@shareinvite', path: 'M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z' },
  { label: 'X (Twitter)', href: 'https://x.com/shareinvite', path: 'M18.2 2.3h3.3l-7.2 8.3 8.5 11.2h-6.7l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.3 2.3h6.8l4.7 6.2 5.4-6.2zm-1.1 17.5h1.8L7.1 4.1H5.1l12 15.7z' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/share-invite', path: 'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2.1 2.1 0 110-4.1 2.1 2.1 0 010 4.1zm1.8 13.1H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z' },
]

export default function SiteFooter() {
  return (
    // Pages that end in this footer often dock a CTA bar to the bottom of the
    // viewport; without this the last rows sit underneath it and are unreadable.
    <footer className="bg-charcoal text-paper" style={{ paddingBottom: 'var(--bottom-dock-h, 0px)' }}>
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Link href="/" aria-label="ShareInvite home">
              <Logo tone="light" />
            </Link>
            <p className="mt-3 font-editorial text-[1.35rem] italic text-gold-soft">Beautifully invited.</p>
            <p className="mt-4 text-[0.95rem] leading-7 text-paper/65">
              Beautiful digital invitations for every celebration — weddings, birthdays, festivals and the little
              moments in between. Built once, shared anywhere with a single link.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/create" className="btn-gold inline-flex items-center rounded-full px-5 py-2.5 text-[0.9rem] font-semibold">
                Start free
              </Link>
              <a
                href={SUPPORT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-paper/20 px-5 py-2.5 text-[0.9rem] font-semibold text-paper/85 transition-colors hover:bg-paper/10"
              >
                Chat with us
              </a>
            </div>
            <p className="mt-4 text-[0.82rem] text-paper/50">
              <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-block py-1.5 hover:text-paper">{SUPPORT_EMAIL}</a>
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ShareInvite on ${s.label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors hover:border-gold-soft hover:text-gold-soft"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-gold-soft">{col.title}</p>
                <ul className="mt-3 space-y-0.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="inline-block py-1.5 text-[0.9rem] text-paper/65 transition-colors hover:text-paper">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-paper/10 pt-8 md:grid-cols-3">
          <nav aria-label="Blog topics">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-paper/45">From the blog</p>
            <ul className="mt-2 flex flex-wrap gap-x-4">
              {BLOG_TOPICS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-[0.82rem] text-paper/60 hover:text-paper">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="City pages">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-paper/45">Popular cities</p>
            <ul className="mt-2 flex flex-wrap gap-x-4">
              {CITY_PAGES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-[0.82rem] text-paper/60 hover:text-paper">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Languages">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-paper/45">Languages</p>
            <ul className="mt-2 flex flex-wrap gap-x-4">
              {LOCALES.map((l) => (
                <li key={l.code}>
                  <Link href={localePath('/', l.code)} hrefLang={l.htmlLang} dir={l.dir} className="inline-block py-1.5 text-[0.82rem] text-paper/60 hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-paper/10 py-7 text-[0.8rem] text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ShareInvite · Digital invitations for every celebration ·{' '}
            Founded by <span className="text-paper/80">Prathik Thelkar</span>
          </p>
          <p>Secure payments by Razorpay · UPI, cards &amp; net banking</p>
        </div>
      </div>
    </footer>
  )
}
