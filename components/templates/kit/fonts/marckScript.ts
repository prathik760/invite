import { Marck_Script } from 'next/font/google'

// Template-only face (Two Worlds): a handwriting with Cyrillic, for the little
// notes written beside photos. preload is off, as for every template face.
export const marckScript = Marck_Script({ weight: '400', subsets: ['latin', 'latin-ext', 'cyrillic'], display: 'swap', preload: false })
