import { Aref_Ruqaa } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const arefRuqaa = Aref_Ruqaa({ weight: ['400', '700'], subsets: ['arabic', 'latin'], display: 'swap', preload: false })
