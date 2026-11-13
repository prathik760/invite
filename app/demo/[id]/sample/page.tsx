import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EmbedStage from '@/components/templates/EmbedStage'
import SampleStage from '@/components/templates/SampleStage'
import { homeSample } from '@/lib/homeSample'

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://shareinvite.in').replace(/\/$/, '')

/**
 * The invitation a visitor can play with on the homepage ("Open a real
 * invitation"): the design exactly as guests get it, with a sample song and
 * with replies kept on the page (components/templates/SampleStage). Its data,
 * fixed dates included, is the homepage's one showcase (lib/homeSample.ts),
 * so it always matches the hero. Only that design has a sample; every other
 * id is a 404.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return [{ id: homeSample().templateId }]
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return {
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/demo/${params.id}/sample` },
  }
}

export default function DemoSamplePage({ params }: { params: { id: string } }) {
  const sample = homeSample()
  if (params.id !== sample.templateId) notFound()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: 'html{scrollbar-width:none}html::-webkit-scrollbar{display:none}' }} />
      {/* clip, not hidden: hidden would make this a scroll container and break the design's sticky parts. */}
      <div className="overflow-x-hidden" style={{ overflowX: 'clip' }}>
        <EmbedStage>
          <SampleStage templateId={sample.templateId} data={sample.data} musicPath={sample.music} />
        </EmbedStage>
      </div>
    </>
  )
}
