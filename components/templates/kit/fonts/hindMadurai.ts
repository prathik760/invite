import { Hind_Madurai } from 'next/font/google'

// Template-only face. preload is off: it downloads only when an invitation
// that uses it renders text in it.
export const hindMadurai = Hind_Madurai({ weight: ['400', '500', '600'], subsets: ['latin', 'tamil'], display: 'swap', preload: false })
