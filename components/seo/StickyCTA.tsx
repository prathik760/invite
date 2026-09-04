import BottomDock from '@/components/ui/BottomDock'
import TrackedLink from '@/components/ui/TrackedLink'

/**
 * Site-wide sticky bar shown on SEO landing, template and blog pages.
 *
 * This is the most-rendered CTA on the site, so it is tracked separately from
 * in-page CTAs — otherwise a create_start cannot be attributed to the bar
 * versus the hero button on the same page.
 */
export default function StickyCTA({ pageType = 'seo_page' }: { pageType?: string }) {
  return (
    <BottomDock
      className="border-t border-border bg-white/95 px-4 pt-3 shadow-[0_-10px_30px_rgba(34,27,23,0.10)] backdrop-blur-xl"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
    >
      {/* pr-20 on desktop keeps the primary button clear of the floating
          support bubble, which sits in the same bottom-right corner. */}
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 sm:pr-20">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">Create a WhatsApp-ready invitation</p>
          <p className="text-xs text-muted">Free to build &amp; preview · Paid templates from ₹99 one-time.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {/* Relabelled: this links to the product overview page, not a live
              demo, and the old "Live Demo" label set the wrong expectation. */}
          <TrackedLink
            href="/digital-invitation"
            location="sticky_bar_secondary"
            meta={{ page_type: pageType }}
            className="hidden rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-foreground sm:inline-flex"
          >
            How it works
          </TrackedLink>
          <TrackedLink
            href="/create?src=sticky_bar"
            location="sticky_bar_primary"
            meta={{ page_type: pageType }}
            className="gold-button rounded-xl px-4 py-2 text-xs font-semibold sm:px-5"
          >
            Start Free →
          </TrackedLink>
        </div>
      </div>
    </BottomDock>
  )
}
