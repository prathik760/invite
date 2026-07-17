import Link from 'next/link'

const eventPages = [
  { label: 'Wedding Invitations', href: '/wedding-invitation' },
  { label: 'Engagement Invitations', href: '/engagement-invitation' },
  { label: 'Birthday Invitations', href: '/birthday-invitation' },
  { label: 'Griha Pravesh Invitations', href: '/griha-pravesh-invitation' },
  { label: 'Namakaran Invitations', href: '/namakaran-invitation' },
  { label: 'All Digital Invitations', href: '/digital-invitation' },
]

const toolPages = [
  { label: 'WhatsApp Invitation Maker', href: '/whatsapp-invitation-maker' },
  { label: 'Online RSVP Platform', href: '/online-rsvp' },
  { label: 'Digital Invitation Templates', href: '/templates' },
  { label: 'Create Invitation', href: '/create' },
  { label: 'Partner with Us', href: '/partners' },
  { label: 'Press & Media', href: '/press' },
]

const locationPages = [
  { label: 'Wedding Invitations Bengaluru', href: '/wedding-invitation/bengaluru' },
  { label: 'Wedding Invitations Mumbai', href: '/wedding-invitation/mumbai' },
  { label: 'Wedding Invitations Delhi', href: '/wedding-invitation/delhi' },
  { label: 'Wedding Invitations Hyderabad', href: '/wedding-invitation/hyderabad' },
  { label: 'Birthday Invitations Chennai', href: '/birthday-invitation/chennai' },
  { label: 'Birthday Invitations Pune', href: '/birthday-invitation/pune' },
  { label: 'Engagement Invitations Kolkata', href: '/engagement-invitation/kolkata' },
]

const blogLinks = [
  { label: 'Wedding Invitation Blog', href: '/blog/category/wedding' },
  { label: 'Engagement Invitation Ideas', href: '/blog/category/engagement' },
  { label: 'Birthday Invitation Blog', href: '/blog/category/birthday' },
  { label: 'Housewarming Invitation Ideas', href: '/blog/category/housewarming' },
  { label: 'Digital Invitation Trends', href: '/blog/category/digital-invitations' },
  { label: 'All Blog Posts', href: '/blog' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" />
              <span className="font-display text-xl text-ink tracking-wide">ShareInvite</span>
            </Link>
            <p className="mt-3 text-sm leading-7 text-muted">
              Create beautiful digital invitation websites for Indian weddings, birthdays, and family events. Share instantly on WhatsApp with RSVP tracking.
            </p>
            <Link
              href="/create"
              className="gold-button mt-5 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Start Free →
            </Link>
          </div>

          {/* Event Types */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Event Types</p>
            <ul className="space-y-2.5">
              {eventPages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Locations */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Tools</p>
            <ul className="space-y-2.5 mb-8">
              {toolPages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Cities</p>
            <ul className="space-y-2.5">
              {locationPages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Blog</p>
            <ul className="space-y-2.5">
              {blogLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal links — present on every page that uses the site footer */}
        <div className="mt-12 border-t border-border pt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
          <Link href="/terms" className="text-xs text-muted transition-colors hover:text-foreground">Terms of Service</Link>
          <Link href="/privacy" className="text-xs text-muted transition-colors hover:text-foreground">Privacy Policy</Link>
          <Link href="/refund-policy" className="text-xs text-muted transition-colors hover:text-foreground">Refund &amp; Cancellation</Link>
          <Link href="/pricing" className="text-xs text-muted transition-colors hover:text-foreground">Pricing</Link>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} ShareInvite. Free digital invitation website builder for Indian weddings and events.
            </p>
            <p className="text-xs text-muted mt-1">
              Founded by <span className="text-foreground font-medium">Prathik Thelkar</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
            <a
              href="https://www.linkedin.com/company/share-invite"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ShareInvite on LinkedIn"
              className="hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
