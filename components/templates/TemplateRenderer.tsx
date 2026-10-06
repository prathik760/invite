'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

export type TemplateProps = {
  data: Record<string, string>
  eventId?: string
  isPreview?: boolean
}

type TemplateComponent = ComponentType<TemplateProps>

/**
 * Renders one invitation template, loading only that template's code.
 *
 * Every page that could show a template — the published invitation at
 * /e/[slug], the demo pages, and the live preview in the builder — used to
 * import all 23 designs statically and pick one at runtime. Measured, that was
 * 948 KB of JavaScript delivered identically whether the visitor opened an
 * Elegant Wedding invite or a Friendship greeting.
 *
 * The split has to happen in a Client Component. `next/dynamic` inside a Server
 * Component does not defer the chunk: Next builds a client-reference manifest
 * for the whole route and preloads every client component the tree can reach,
 * so the bytes ship regardless. Moving the map behind a client boundary lets
 * webpack emit one chunk per design and fetch only the matched one.
 *
 * `ssr: false` is NOT set, so the chosen template is still server-rendered —
 * LCP and the initial HTML are unaffected.
 */
const greeting = (name: string) =>
  dynamic(() =>
    import('./AnimatedGreeting').then((m) => ({
      default: (m as unknown as Record<string, TemplateComponent>)[name],
    })),
  )

const TEMPLATE_COMPONENTS: Record<string, TemplateComponent> = {
  'elegant-wedding': dynamic(() => import('./ElegantWedding')),
  'cinematic-night': dynamic(() => import('./CinematicWedding')),
  'indian-wedding': dynamic(() => import('./IndianWedding')),
  'indian-engagement': dynamic(() => import('./IndianEngagement')),
  'indian-birthday': dynamic(() => import('./IndianBirthday')),
  'griha-pravesh': dynamic(() => import('./HouseWarming')),
  'namakaran': dynamic(() => import('./NamingCeremony')),
  'anniversary': dynamic(() => import('./Anniversary')),
  'kgf-wedding': dynamic(() => import('./KGFWedding')),
  'royal-deco': dynamic(() => import('./RoyalDeco')),
  'luxury-wedding': dynamic(() => import('./LuxuryWedding')),
  'surprise-journey': dynamic(() => import('./SurpriseJourney')),
  'rakshabandhan': dynamic(() => import('./RakshaBandhanPremium')),
  'ganesh-chaturthi': dynamic(() => import('./GaneshChaturthi')),
  'signature-rajwada': dynamic(() => import('./SignatureRajwada')),
  'signature-kalyanam': dynamic(() => import('./SignatureKalyanam')),
  'signature-nikah': dynamic(() => import('./SignatureNikah')),
  'signature-garden': dynamic(() => import('./SignatureGarden')),
  'signature-aquarelle': dynamic(() => import('./SignatureAquarelle')),
  'baby-shower': dynamic(() => import('./BabyShower')),
  'first-birthday': dynamic(() => import('./FirstBirthday')),
  'haldi-mehendi': dynamic(() => import('./HaldiMehendi')),
  'sangeet-night': dynamic(() => import('./SangeetNight')),
  'pooja-invite': dynamic(() => import('./PoojaInvite')),
  'diwali-party': dynamic(() => import('./DiwaliParty')),
  'eid-milan': dynamic(() => import('./EidMilan')),
  'retirement': dynamic(() => import('./Retirement')),
  'save-the-date': dynamic(() => import('./SaveTheDate')),
  'birthday-mirrorball': dynamic(() => import('./BirthdayMirrorball')),
  'birthday-martini': dynamic(() => import('./BirthdayMartini')),
  'birthday-champagne': dynamic(() => import('./BirthdayChampagne')),
  'birthday-long-lunch': dynamic(() => import('./BirthdayLongLunch')),
  'birthday-gala': dynamic(() => import('./BirthdayGala')),
  'dasara-ambari': dynamic(() => import('./DasaraAmbari')),
  'christmas-evergreen': dynamic(() => import('./ChristmasEvergreen')),
  'newyear-midnight': dynamic(() => import('./NewYearMidnight')),
  'greeting-love': greeting('GreetingLove'),
  'greeting-valentine': greeting('GreetingValentine'),
  'greeting-anniversary': greeting('GreetingAnniversary'),
  'greeting-propose': greeting('GreetingPropose'),
  'greeting-promise': greeting('GreetingPromise'),
  'greeting-sorry': greeting('GreetingSorry'),
  'greeting-congratulations': greeting('GreetingCongratulations'),
  'greeting-festival': greeting('GreetingFestival'),
  'greeting-family': greeting('GreetingFamily'),
  'greeting-friendship': greeting('GreetingFriendship'),
}

export default function TemplateRenderer({
  templateId,
  ...props
}: TemplateProps & { templateId: string }) {
  const Component = TEMPLATE_COMPONENTS[templateId]
  if (!Component) return null
  return <Component {...props} />
}
