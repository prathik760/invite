import { Prata } from 'next/font/google'

// Template-only face (Two Worlds). A Didone with Cyrillic, so Ukrainian names
// set as cleanly as English ones. preload is off: it downloads only when an
// invitation that uses it renders text in it.
export const prata = Prata({ weight: '400', subsets: ['latin', 'cyrillic'], display: 'swap', preload: false })
