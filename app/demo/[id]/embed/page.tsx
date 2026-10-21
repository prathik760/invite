import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import EmbedStage from '@/components/templates/EmbedStage'
import { TEMPLATES } from '@/modules/templates/data'
import { withSampleDates } from '@/lib/sampleData'

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

// Its own canonical: without one it inherited the root layout's, so a noindex
// page declared itself a duplicate of the homepage.
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return {
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/demo/${params.id}/embed` },
  }
}

// Sample dates are relative to today; rebuild daily so the countdown stays live.
export const revalidate = 86400

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }))
}

// Same rule as the full demo: the WebGL experiences use their auto-opening
// preview mode, every 2D design renders exactly as a guest receives it.
const PREVIEW_CATEGORIES = new Set(['greeting', 'interactive'])

/**
 * The demo without its banner, for the live preview's phone screen (framed by
 * TemplatePreviewModal). A real page at a real phone width, so the opening,
 * the entrance, the countdown and the music button all behave as they do for
 * guests — which the in-page builder preview deliberately does not.
 */
export default function DemoEmbedPage({ params }: { params: { id: string } }) {
  const template = TEMPLATES.find((t) => t.id === params.id)
  if (!template) notFound()
  const usePreview = PREVIEW_CATEGORIES.has(template.category ?? '')
  const data = withSampleDates(template.id, template.config.defaultData)

  return (
    <>
      {/* A phone screen has no scrollbar; a framed page on Windows would show one. */}
      <style>{'html{scrollbar-width:none}html::-webkit-scrollbar{display:none}'}</style>
      {/* EmbedStage tells the live preview when the first screen is ready
          and restarts the design the moment the preview shows it. */}
      {usePreview ? (
        <div className="relative h-[100svh] overflow-hidden">
          <EmbedStage><TemplateRenderer templateId={params.id} data={data} isPreview /></EmbedStage>
        </div>
      ) : (
        <div className="overflow-x-hidden">
          <EmbedStage><TemplateRenderer templateId={params.id} data={data} isPreview={false} /></EmbedStage>
        </div>
      )}
    </>
  )
}
