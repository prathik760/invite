import Link from 'next/link'

const eventPages = [
  { label: 'Wedding Invitations', href: '/wedding-invitations' },
  { label: 'Engagement Invitations', href: '/engagement-invitations' },
  { label: 'Birthday Invitations', href: '/birthday-invitations' },
  { label: 'Anniversary Invitations', href: '/anniversary-invitations' },
  { label: 'Griha Pravesh Invitations', href: '/griha-pravesh-invitations' },
  { label: 'Baby Shower Invitations', href: '/baby-shower-invitations' },
  { label: 'Naming Ceremony Invitations', href: '/naming-ceremony-invitations' },
  { label: 'Corporate Event Invitations', href: '/corporate-event-invitations' },
]

const toolPages = [
  { label: 'WhatsApp Invitation Maker', href: '/whatsapp-invitation-maker' },
  { label: 'Online RSVP Platform', href: '/online-rsvp' },
  { label: 'Digital Invitation Templates', href: '/templates' },
  { label: 'Create Invitation', href: '/create' },
]

const locationPages = [
  { label: 'Digital Invitations Bangalore', href: '/digital-invitations-bangalore' },
  { label: 'Digital Invitations Mumbai', href: '/digital-invitations-mumbai' },
  { label: 'Digital Invitations Delhi', href: '/digital-invitations-delhi' },
  { label: 'Digital Invitations Hyderabad', href: '/digital-invitations-hyderabad' },
  { label: 'Digital Invitations Chennai', href: '/digital-invitations-chennai' },
  { label: 'Digital Invitations Pune', href: '/digital-invitations-pune' },
  { label: 'Digital Invitations Kolkata', href: '/digital-invitations-kolkata' },
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
            <Link href="/"><img src="/logo1.png" alt="ShareInvite" className="h-8 w-auto" /></Link>
            <p className="mt-3 text-sm leading-7 text-muted">
              Create beautiful digital invitation websites for Indian weddings, birthdays, and family events. Share instantly on WhatsApp with RSVP tracking.
            </p>
            <Link
              href="/create"
              className="mt-5 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #B87924, #D9A441)' }}
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

        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} ShareInvite. Free digital invitation website builder for Indian weddings and events.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
