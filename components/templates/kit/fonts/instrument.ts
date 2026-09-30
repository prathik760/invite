import { Instrument_Serif } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const instrument = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
