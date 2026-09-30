import { Marcellus_SC } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const marcellusSC = Marcellus_SC({ weight: '400', subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
