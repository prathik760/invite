import { Josefin_Sans } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const josefin = Josefin_Sans({ style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
