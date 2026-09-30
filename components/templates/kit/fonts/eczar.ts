import { Eczar } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const eczar = Eczar({ subsets: ['latin', 'devanagari'], display: 'swap', preload: false })
