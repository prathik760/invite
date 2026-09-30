import { Italiana } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const italiana = Italiana({ weight: '400', subsets: ['latin'], display: 'swap', preload: false })
