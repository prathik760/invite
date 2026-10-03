import type { ReactNode } from 'react'
import BottomDock from '@/components/ui/BottomDock'
import TrackedLink from '@/components/ui/TrackedLink'
import { LogoMark } from '@/components/brand/Logo'
import { LOWEST_PAID_PRICE } from '@/lib/plans'
import { withLocalPrices } from '@/components/price/localised'

/**
 * Site-wide sticky bar shown on SEO landing, template and blog pages.
 *
 * This is the most-rendered CTA on the site, so it is tracked separately from
 * in-page CTAs — otherwise a create_start cannot be attributed to the bar
 * versus the hero button on the same page.
 *
 * Template pages pass their own title/href so the bar sells that one design
 * ("Luxury Wedding · ₹499 — Use this design") instead of a generic line.
 */
export default function StickyCTA({
  pageType = 'seo_page',
  title = 'Create your invitation',
  sub = `Preview before you pay · Pay once, from ₹${LOWEST_PAID_PRICE.toLocaleString('en-IN')}`,
  href = '/create?src=sticky_bar',
  label = 'Start creating',
}: {
  pageType?: string
  title?: ReactNode
  sub?: string
  href?: string
  label?: string
}) {
  return (
    <BottomDock
      className="border-t border-line bg-paper/95 px-4 pt-3 shadow-[0_-12px_30px_-12px_rgba(3,25,15,0.18)] backdrop-blur-xl"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
    >
      {/* pr-20 on desktop keeps the primary button clear of the floating
          support bubble, which sits in the same bottom-right corner. */}
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 sm:pr-20">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark className="hidden h-9 w-9 shrink-0 sm:block" />
          <div className="min-w-0">
            <p className="truncate font-editorial text-[1.15rem] font-semibold leading-tight text-charcoal">{withLocalPrices(title)}</p>
            <p className="truncate text-[0.78rem] text-muted">{withLocalPrices(sub)}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {/* Relabelled: this links to the product overview page, not a live
              demo, and the old "Live Demo" label set the wrong expectation. */}
          <TrackedLink
            href="/digital-invitation"
            location="sticky_bar_secondary"
            meta={{ page_type: pageType }}
            className="btn-outline hidden rounded-full px-4 py-2 text-[0.8rem] font-semibold sm:inline-flex"
          >
            How it works
          </TrackedLink>
          <TrackedLink
            href={href}
            location="sticky_bar_primary"
            meta={{ page_type: pageType }}
            className="btn-primary rounded-full px-5 py-2.5 text-[0.85rem] font-semibold"
          >
            {label}
          </TrackedLink>
        </div>
      </div>
    </BottomDock>
  )
}
