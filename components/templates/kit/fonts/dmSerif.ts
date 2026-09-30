import { DM_Serif_Display } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const dmSerif = DM_Serif_Display({ weight: '400', style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
