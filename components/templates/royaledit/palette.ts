import type { CSSProperties } from 'react'

/*
 * The Royal Edit's three issues. Every colour reaches the page as a custom
 * property (--re-*), so the CSS and the drawings never name a hex value.
 */

export interface Palette {
  /** Velvet behind the magazine; the dark pages. */
  night: string
  deep: string
  /** The accent: cover tags, buttons, the reply stamp. */
  wine: string
  /** The accent where it sits on the dark pages. */
  wineHi: string
  gold: string
  goldHi: string
  goldLo: string
  paper: string
  paper2: string
  ink: string
  soft: string
  /** Light text on the dark pages. */
  blush: string
}

export const PALETTES: Record<string, Palette> = {
  burgundy: {
    night: '#1C070E', deep: '#3D1220', wine: '#8A1E38', wineHi: '#D25A74',
    gold: '#C9A66B', goldHi: '#F0DDB0', goldLo: '#8E6E3A',
    paper: '#F8F2E8', paper2: '#EFE4D3', ink: '#1F1719', soft: '#6C5B57', blush: '#EBCFC3',
  },
  emerald: {
    night: '#05140F', deep: '#0F3A2E', wine: '#13664D', wineHi: '#5DBB97',
    gold: '#CDAE70', goldHi: '#F0DFB2', goldLo: '#8F7440',
    paper: '#F6F2E8', paper2: '#E9E3D3', ink: '#16201C', soft: '#56635D', blush: '#C9DFD2',
  },
  midnight: {
    night: '#070B1A', deep: '#18234A', wine: '#2D4590', wineHi: '#8AA2EC',
    gold: '#D1B47E', goldHi: '#F2E4BC', goldLo: '#977D4D',
    paper: '#F5F2EB', paper2: '#E8E3D8', ink: '#181B29', soft: '#5B5F72', blush: '#CDD2EA',
  },
}

export function paletteOf(value?: string): Palette {
  return PALETTES[value || ''] ?? PALETTES.burgundy
}

/** The palette as custom properties on the design's root. */
export function paletteVars(p: Palette): CSSProperties {
  const v: Record<string, string> = {}
  for (const [k, c] of Object.entries(p)) v[`--re-${k}`] = c
  return v as CSSProperties
}
