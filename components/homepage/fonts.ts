import { Inter } from 'next/font/google'

// The homepage's interface face. Loaded here, not in the root layout, so only
// the homepage downloads it; every other page keeps its current type.
export const homeSans = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-hv-sans' })
