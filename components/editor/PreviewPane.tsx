'use client'

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

const COMPONENTS: Record<string, React.ComponentType<{ data: Record<string, string>; isPreview?: boolean; eventId?: string }>> = {
  ...GREETING_COMPONENTS,
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
  'surprise-journey': SurpriseJourney,
}


interface PreviewPaneProps {
  templateId: string
  data: Record<string, string>
}

// The 3D experiences (greeting + interactive journey) are full-viewport, stage-based
// designs. In a bounded preview they must fill the container height (h-full) rather
// than flow at their natural 100svh height, which would blow out the phone shell.
function is3DExperience(templateId: string): boolean {
  return templateId === 'surprise-journey' || templateId.startsWith('greeting-')
}

export default function PreviewPane({ templateId, data }: PreviewPaneProps) {
  const Component = COMPONENTS[templateId]

  return (
    // No padding wrapper — template renders edge-to-edge inside the phone screen.
    // 3D experiences fill the container; 2D templates keep natural (scrolling) flow.
    <div className={is3DExperience(templateId) ? 'h-full' : undefined}>
      {Component ? (
        <Component data={data} isPreview eventId="__preview__" />
      ) : (
        <div className="flex min-h-40 items-center justify-center text-sm text-muted">
          Template not found
        </div>
      )}
    </div>
  )
}
