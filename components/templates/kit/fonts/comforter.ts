import { Comforter } from 'next/font/google'

// Template-only face (Two Worlds): a formal calligraphic script with Cyrillic,
// for the ampersand and the words of love in Ukrainian and English.
// preload is off: it downloads only when an invitation that uses it renders.
export const comforter = Comforter({ weight: '400', subsets: ['latin', 'latin-ext', 'cyrillic'], display: 'swap', preload: false })
