import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { TEMPLATES } from '@/modules/templates/data'
import { withSampleDates } from '@/lib/sampleData'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
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
      {usePreview ? (
        <div className="relative h-[100svh] overflow-hidden">
          <TemplateRenderer templateId={params.id} data={data} isPreview />
        </div>
      ) : (
        <div className="overflow-x-hidden">
          <TemplateRenderer templateId={params.id} data={data} isPreview={false} />
        </div>
      )}
    </>
  )
}
