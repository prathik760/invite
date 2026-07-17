import type { ComponentType } from 'react'
import {
  GreetingLove, GreetingValentine, GreetingAnniversary, GreetingPropose, GreetingPromise,
  GreetingSorry, GreetingCongratulations, GreetingFestival, GreetingFamily, GreetingFriendship,
} from '../AnimatedGreeting'

type GreetingComponent = ComponentType<{ data: Record<string, string>; eventId?: string; isPreview?: boolean }>

// Built in a plain (non-'use client') module so it stays a real object on the
// server — each value is a client-component reference that renders correctly.
export const GREETING_COMPONENTS: Record<string, GreetingComponent> = {
  'greeting-love': GreetingLove,
  'greeting-valentine': GreetingValentine,
  'greeting-anniversary': GreetingAnniversary,
  'greeting-propose': GreetingPropose,
  'greeting-promise': GreetingPromise,
  'greeting-sorry': GreetingSorry,
  'greeting-congratulations': GreetingCongratulations,
  'greeting-festival': GreetingFestival,
  'greeting-family': GreetingFamily,
  'greeting-friendship': GreetingFriendship,
}
