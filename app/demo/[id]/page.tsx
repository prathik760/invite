import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import ShareDesignButton from '@/components/catalog/ShareDesignButton'
import { TEMPLATES } from '@/modules/templates/data'
import { withSampleDates } from '@/lib/sampleData'
import { formatTemplatePrice } from '@/lib/plans'
import { templateSeoSlug } from '@/lib/seo'
import { displayName } from '@/lib/catalog'

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

// Sample dates are relative to today; rebuild daily so the countdown stays live.
export const revalidate = 86400

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }))
}

/**
 * Demos stay out of search (the design's /templates page is the indexed one),
 * but they are what gets sent to customers on WhatsApp — so they carry a real
 * link preview: the design's name, price and its thumbnail.
 */
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const template = TEMPLATES.find((t) => t.id === params.id)
  if (!template) return { robots: { index: false, follow: false } }
  const name = displayName(template.name)
  const title = `${name} invitation — live demo | ShareInvite`
  const description = `See the ${name} invitation exactly as your guests will. ${formatTemplatePrice(template.id)} one-time · preview with your own details before you pay.`
  const url = `${SITE_URL}/demo/${template.id}`
  const image = `${SITE_URL}/templates/${template.id}.jpg`
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/templates/${templateSeoSlug(template.id)}` },
    openGraph: { title, description, url, siteName: 'ShareInvite', type: 'website', images: [{ url: image, width: 960, height: 1200, alt: `${name} invitation design` }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

// WebGL experiences (greeting + interactive journey) are mobile-first, full-viewport
// designs whose `isPreview` mode is genuinely useful in a demo — it auto-opens the
// content and exposes stage navigation so visitors aren't stuck on a tap-to-open /
// PIN gate. Every other (2D) template has a *compact* preview layout built for the
// tiny editor frame, so those must render the real, full experience instead.
const PREVIEW_CATEGORIES = new Set(['greeting', 'interactive'])

export default function DemoPage({ params }: { params: { id: string } }) {
  const template = TEMPLATES.find(t => t.id === params.id)
  if (!template) notFound()

  const usePreview = PREVIEW_CATEGORIES.has(template.category ?? '')

  return (
    // 3D experiences fill the container (height:100%), so give them a fixed-height
    // flex column; 2D templates flow naturally under a sticky banner.
    <div className={usePreview ? 'relative flex h-[100svh] flex-col overflow-hidden' : 'relative'}>
      {/* ── Demo banner (fully responsive) ── */}
      <div
        className={`z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 ${usePreview ? 'shrink-0' : 'sticky top-0'}`}
        style={{ background: '#1E2726', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Link
          href={`/templates/${templateSeoSlug(template.id)}`}
          className="flex shrink-0 items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors hover:bg-white/10 sm:text-xs"
          style={{ color: 'rgba(255,255,255,0.75)' }}
          aria-label="Back to the design"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="hidden sm:inline">Designs</span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="hidden shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] sm:inline"
            style={{ background: 'rgba(164,121,69,0.20)', color: '#A47945', border: '1px solid rgba(164,121,69,0.35)' }}
          >
            Live Demo
          </span>
          <p className="truncate text-[11px] font-medium sm:text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {displayName(template.name)} · {formatTemplatePrice(template.id)}
          </p>
        </div>
        <ShareDesignButton
          templateId={template.id}
          name={displayName(template.name)}
          source="demo_banner"
          className="flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-colors hover:bg-white/10 sm:px-3 sm:text-xs"
          style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.18)' }}
        />
        <Link
          href={`/create?template=${params.id}`}
          className="shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-90 sm:px-4 sm:text-xs"
          style={{ background: '#052E20', color: '#fff' }}
        >
          Use this design
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Invitation rendered with sample data — the real, full experience (2D
          templates) or the auto-opened WebGL experience (greeting / journey). */}
      <div className={usePreview ? 'relative min-h-0 flex-1 overflow-hidden' : 'overflow-x-hidden'}>
        <TemplateRenderer templateId={params.id} data={withSampleDates(template.id, template.config.defaultData)} isPreview={usePreview} />
      </div>
    </div>
  )
}
