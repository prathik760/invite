import { Kalam } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const kalam = Kalam({ weight: ['300', '400', '700'], subsets: ['latin', 'devanagari'], display: 'swap', preload: false })
