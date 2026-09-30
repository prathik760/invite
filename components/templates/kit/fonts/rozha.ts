import { Rozha_One } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const rozha = Rozha_One({ weight: '400', subsets: ['latin', 'devanagari'], display: 'swap', preload: false })
