import { EB_Garamond } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const ebGaramond = EB_Garamond({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], display: 'swap', preload: false })
