import { Baloo_2 } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const baloo = Baloo_2({ subsets: ['latin', 'devanagari'], display: 'swap', preload: false })
