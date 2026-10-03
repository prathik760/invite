import { Baloo_Tamma_2 } from 'next/font/google'

// Kannada and Latin in one rounded face, for greetings written in Kannada.
// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const balooTamma = Baloo_Tamma_2({ weight: ['500', '700'], subsets: ['kannada', 'latin'], display: 'swap', preload: false })
