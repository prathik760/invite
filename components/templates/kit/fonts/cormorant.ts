import { Cormorant_Garamond } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const cormorant = Cormorant_Garamond({ weight: ['300', '400', '500', '600'], style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
