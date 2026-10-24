import { EB_Garamond } from 'next/font/google'

// Template-only face (Two Worlds): EB Garamond with its Cyrillic, for text in
// English and Ukrainian. A separate instance from ./ebGaramond, so Aquarelle's
// font is left exactly as it is.
export const ebGaramondCyrillic = EB_Garamond({ subsets: ['latin', 'latin-ext', 'cyrillic'], style: ['normal', 'italic'], display: 'swap', preload: false })
