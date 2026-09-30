import { Oswald } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const oswald = Oswald({ subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
