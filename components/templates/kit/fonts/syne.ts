import { Syne } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const syne = Syne({ subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
