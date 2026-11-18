import { Inter } from 'next/font/google'

// The homepage's interface face. Loaded here, not in the root layout, so only
// the homepage downloads it; every other page keeps its current type.
// Only Latin is preloaded (`subsets`); latin-ext (85 KB, for ₹ and accented letters) loads when the
// page first uses it, instead of competing with the hero picture for the first second.
export const homeSans = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-hv-sans' })
