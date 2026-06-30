import { notFound } from 'next/navigation'
import Link from 'next/link'
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
import { TEMPLATES } from '@/modules/templates/data'

const TEMPLATE_COMPONENTS: Record<
  string,
  React.ComponentType<{ data: Record<string, string>; isPreview?: boolean }>
> = {
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

export default function DemoPage({ params }: { params: { id: string } }) {
  const template = TEMPLATES.find(t => t.id === params.id)
  const Component = TEMPLATE_COMPONENTS[params.id]
  if (!template || !Component) notFound()

  return (
    <div className="relative">
      {/* Demo banner */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-2.5"
        style={{ background: '#221B17', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="shrink-0 text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(217,164,65,0.20)', color: '#D9A441', border: '1px solid rgba(217,164,65,0.35)' }}
          >
            Live Demo
          </span>
          <p className="text-[11px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {template.name} — sample data
          </p>
        </div>
        <Link
          href={`/create?template=${params.id}`}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#B87924,#D9A441)', color: '#fff' }}
        >
          Use this template
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Full invitation rendered with sample data */}
      <Component data={template.config.defaultData} isPreview />
    </div>
  )
}
