import { Mukta } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const mukta = Mukta({ weight: ['400', '500', '600', '700'], subsets: ['latin', 'devanagari'], display: 'swap', preload: false })
