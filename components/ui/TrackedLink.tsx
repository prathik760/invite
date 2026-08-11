'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { trackCta } from '@/lib/analytics'

interface TrackedLinkProps {
  href: string
  /** Placement identifier, e.g. "hero", "sticky_bar", "blog_inline", "footer". */
  location: string
  children: ReactNode
  className?: string
  /** Extra dimensions — template_id, page_type, price, event_type. */
  meta?: Record<string, string | number | boolean | undefined>
  prefetch?: boolean
}

/**
 * A Link that reports a `cta_click` with its placement.
 *
 * Server components (every SEO landing and template page) cannot attach an
 * onClick, so before this every CTA on the site was invisible to GA4 beyond the
 * generic auto-collected `click`. Without placement data there is no way to
 * tell which button produced a create-start.
 */
export default function TrackedLink({
  href,
  location,
  children,
  className,
  meta = {},
  prefetch,
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      prefetch={prefetch}
      onClick={(e) => {
        const label = e.currentTarget.textContent?.trim().slice(0, 80) ?? ''
        trackCta(label, location, { destination: href, ...meta })
      }}
    >
      {children}
    </Link>
  )
}
