import { Pinyon_Script } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const pinyon = Pinyon_Script({ weight: '400', subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
