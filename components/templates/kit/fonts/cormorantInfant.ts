import { Cormorant_Infant } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const cormorantInfant = Cormorant_Infant({ weight: ['300', '400', '500', '600'], style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
