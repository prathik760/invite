import { Tiro_Devanagari_Hindi } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const tiro = Tiro_Devanagari_Hindi({ weight: '400', style: ['normal', 'italic'], subsets: ['latin', 'devanagari'], display: 'swap', preload: false })
