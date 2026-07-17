import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}
import ElegantWedding from '@/components/templates/ElegantWedding'
import CinematicWedding from '@/components/templates/CinematicWedding'
import IndianWedding from '@/components/templates/IndianWedding'
import IndianEngagement from '@/components/templates/IndianEngagement'
import IndianBirthday from '@/components/templates/IndianBirthday'
import HouseWarming from '@/components/templates/HouseWarming'
import NamingCeremony from '@/components/templates/NamingCeremony'
import Anniversary from '@/components/templates/Anniversary'
import KGFWedding from '@/components/templates/KGFWedding'
import RoyalDeco from '@/components/templates/RoyalDeco'
import LuxuryWedding from '@/components/templates/LuxuryWedding'
import SurpriseJourney from '@/components/templates/SurpriseJourney'
import { GREETING_COMPONENTS } from '@/components/templates/greeting/registry'
import { TEMPLATES } from '@/modules/templates/data'

const TEMPLATE_COMPONENTS: Record<
  string,
  React.ComponentType<{ data: Record<string, string>; isPreview?: boolean }>
> = {
  ...GREETING_COMPONENTS,
  'surprise-journey': SurpriseJourney,
  'elegant-wedding': ElegantWedding,
  'cinematic-night': CinematicWedding,
  'indian-wedding': IndianWedding,
  'indian-engagement': IndianEngagement,
  'indian-birthday': IndianBirthday,
  'griha-pravesh': HouseWarming,
  'namakaran': NamingCeremony,
  'anniversary': Anniversary,
  'kgf-wedding': KGFWedding,
  'royal-deco': RoyalDeco,
  'luxury-wedding': LuxuryWedding,
}

export function generateStaticParams() {
  return Object.keys(TEMPLATE_COMPONENTS).map(id => ({ id }))
}

// WebGL experiences (greeting + interactive journey) are mobile-first, full-viewport
// designs whose `isPreview` mode is genuinely useful in a demo — it auto-opens the
// content and exposes stage navigation so visitors aren't stuck on a tap-to-open /
// PIN gate. Every other (2D) template has a *compact* preview layout built for the
// tiny editor frame, so those must render the real, full experience instead.
const PREVIEW_CATEGORIES = new Set(['greeting', 'interactive'])

export default function DemoPage({ params }: { params: { id: string } }) {
  const template = TEMPLATES.find(t => t.id === params.id)
  const Component = TEMPLATE_COMPONENTS[params.id]
  if (!template || !Component) notFound()

  const usePreview = PREVIEW_CATEGORIES.has(template.category ?? '')

  return (
    // 3D experiences fill the container (height:100%), so give them a fixed-height
    // flex column; 2D templates flow naturally under a sticky banner.
    <div className={usePreview ? 'relative flex h-[100svh] flex-col overflow-hidden' : 'relative'}>
      {/* ── Demo banner (fully responsive) ── */}
      <div
        className={`z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 ${usePreview ? 'shrink-0' : 'sticky top-0'}`}
        style={{ background: '#221B17', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ background: 'rgba(217,164,65,0.20)', color: '#D9A441', border: '1px solid rgba(217,164,65,0.35)' }}
          >
            Live Demo
          </span>
          <p className="truncate text-[11px] font-medium sm:text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {template.name} — sample data
          </p>
        </div>
        <Link
          href={`/create?template=${params.id}`}
          className="shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-90 sm:px-4 sm:text-xs"
          style={{ background: 'linear-gradient(135deg,#B87924,#D9A441)', color: '#fff' }}
        >
          Use this template
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Invitation rendered with sample data — the real, full experience (2D
          templates) or the auto-opened WebGL experience (greeting / journey). */}
      <div className={usePreview ? 'relative min-h-0 flex-1 overflow-hidden' : 'overflow-x-hidden'}>
        <Component data={template.config.defaultData} isPreview={usePreview} />
      </div>
    </div>
  )
}
