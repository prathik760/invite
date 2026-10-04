import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Fonts for next/og cards. Satori ships only a basic sans and can't read
 * WOFF2, so the brand serif and text face are kept as WOFF in assets/og-fonts
 * and read from disk (Node runtime — the edge `fetch(new URL(…))` pattern
 * fails when a card is prerendered at build time). Mukta covers Devanagari,
 * so hosts' names typed in Hindi render instead of as empty boxes.
 */
const dir = join(process.cwd(), 'assets/og-fonts')
const load = (file: string) => readFile(join(dir, file))

let cache: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 600; style: 'normal' | 'italic' }[]> | null = null

export function ogFonts() {
  cache ??= Promise.all([
    load('CormorantGaramond-500.woff').then((data) => ({ name: 'Cormorant', data, weight: 500 as const, style: 'normal' as const })),
    load('CormorantGaramond-600.woff').then((data) => ({ name: 'Cormorant', data, weight: 600 as const, style: 'normal' as const })),
    load('CormorantGaramond-500-italic.woff').then((data) => ({ name: 'Cormorant', data, weight: 500 as const, style: 'italic' as const })),
    load('Jost-400.woff').then((data) => ({ name: 'Jost', data, weight: 400 as const, style: 'normal' as const })),
    load('Jost-500.woff').then((data) => ({ name: 'Jost', data, weight: 500 as const, style: 'normal' as const })),
    load('Mukta-500.woff').then((data) => ({ name: 'Mukta', data, weight: 500 as const, style: 'normal' as const })),
  ])
  return cache
}

let scriptCache: Promise<{ name: string; data: Buffer; weight: 400; style: 'normal' }[]> | null = null

/**
 * Pinyon Script, a copperplate hand, for the names on an invitation's share
 * card. Loaded only by that card (lib/inviteCard.tsx); TTF, which Satori reads.
 */
export function ogScriptFonts() {
  scriptCache ??= Promise.all([load('PinyonScript-400.ttf').then((data) => ({ name: 'Pinyon', data, weight: 400 as const, style: 'normal' as const }))])
  return scriptCache
}
