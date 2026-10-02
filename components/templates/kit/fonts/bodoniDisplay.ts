import { Bodoni_Moda } from 'next/font/google'

// Bodoni Moda with its optical-size axis, so large settings get the
// high-contrast display cut and small ones the sturdier text cut
// (font-optical-sizing is automatic). Template-only face; preload is off.
export const bodoniDisplay = Bodoni_Moda({ style: ['normal', 'italic'], axes: ['opsz'], subsets: ['latin', 'latin-ext'], display: 'swap', preload: false })
