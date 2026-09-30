import { Amiri } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const amiri = Amiri({ weight: ['400', '700'], style: ['normal', 'italic'], subsets: ['arabic', 'latin'], display: 'swap', preload: false })
