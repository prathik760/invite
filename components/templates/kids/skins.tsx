'use client'

import type { CSSProperties, ReactNode } from 'react'
import { baloo } from '../kit/fonts/baloo'
import { fraunces } from '../kit/fonts/fraunces'
import { kalam } from '../kit/fonts/kalam'
import { oswald } from '../kit/fonts/oswald'
import { shrikhand } from '../kit/fonts/shrikhand'
import { syne } from '../kit/fonts/syne'
import { unbounded } from '../kit/fonts/unbounded'
import { burst, SPARKLE, type Art } from './scenes'
import type { Kind, Skin, Tokens } from './shared'

/*
 * Each kids' theme in its colours and its own page: palettes (the builder's "Colours" choice,
 * data.ts KIDS_PALETTES, so every theme works for a girl or a boy), and a skin for the sections
 * below the opening (shared.tsx PartyBody).
 *
 *   Dinosaur   an explorer's field notes along a trail of footprints
 *   Space      mission-control panels along an orbit
 *   Superhero  comic-book panels with caption boxes
 *   Unicorn    soft clouds and rainbow ribbons
 *   Jungle     parchment notes under wooden signs
 *   Race cars  road signs beside a track running down the page
 */

const round = baloo.style.fontFamily
const hand = kalam.style.fontFamily

export interface Palette {
  t: Tokens
  a: Art
  /** The opening's and hero's background (CSS). */
  hero: string
  heroInk: string
  heroSoft: string
  heroAccent: string
}

const light = (ink: string): Pick<Tokens, 'soft' | 'faint' | 'line' | 'dark'> => {
  const rgb = ink.replace('#', '').match(/../g)!.map((h) => parseInt(h, 16)).join(',')
  return { soft: `rgba(${rgb},0.76)`, faint: `rgba(${rgb},0.5)`, line: `rgba(${rgb},0.15)`, dark: false }
}
const darkT = { soft: 'rgba(255,255,255,0.78)', faint: 'rgba(255,255,255,0.52)', line: 'rgba(255,255,255,0.18)', dark: true }

export const PALETTES: Record<Kind, Record<string, Palette>> = {
  dinosaur: {
    '': {
      t: { page: '#FFF7E8', card: '#FFFFFF', ink: '#2B3A1F', ...light('#2B3A1F'), a: '#F2762E', onA: '#FFFFFF', b: '#4E9D3A', onB: '#FFFFFF', c: '#FFC93C', accentText: '#B9501A' },
      a: { ink: '#2B3A1F', sky1: '#FFD9A6', sky2: '#FFF3DC', sun: '#FFC93C', volcano: '#B5653A', lava: '#F2762E', smoke: '#F3E4D0', hill: '#9ACF6C', ground: '#6DB33F', fern: '#3E8E3A', dino: '#47B39D', dinoDark: '#3C9C88', spots: '#2F8F7B', belly: '#BFE8C9', egg: '#FFF6E6', eggSpot: '#F9C77E', hat: '#FFC93C', hatStripe: '#F2762E' },
      hero: 'linear-gradient(180deg, #FFE3B5 0%, #FFF7E8 100%)', heroInk: '#2B3A1F', heroSoft: 'rgba(43,58,31,0.76)', heroAccent: '#B9501A',
    },
    pink: {
      t: { page: '#FFF4F8', card: '#FFFFFF', ink: '#4A2C5E', ...light('#4A2C5E'), a: '#E0518F', onA: '#FFFFFF', b: '#8E6BE8', onB: '#FFFFFF', c: '#FFD166', accentText: '#C23C7A' },
      a: { ink: '#4A2C5E', sky1: '#FFD3E6', sky2: '#FFF0F6', sun: '#FFD166', volcano: '#B98AD9', lava: '#FF8FB1', smoke: '#FBE6F1', hill: '#B9E4C9', ground: '#8FD3AE', fern: '#5DBB8A', dino: '#B79CFF', dinoDark: '#9C7CF0', spots: '#8E6BE8', belly: '#FFE3F1', egg: '#FFF8FB', eggSpot: '#FFB3CF', hat: '#FFD166', hatStripe: '#E0518F' },
      hero: 'linear-gradient(180deg, #FFDCEB 0%, #FFF4F8 100%)', heroInk: '#4A2C5E', heroSoft: 'rgba(74,44,94,0.76)', heroAccent: '#C23C7A',
    },
    blue: {
      t: { page: '#F0F7FF', card: '#FFFFFF', ink: '#17324D', ...light('#17324D'), a: '#FF8A3C', onA: '#FFFFFF', b: '#2F80C9', onB: '#FFFFFF', c: '#FFD23F', accentText: '#C25A12' },
      a: { ink: '#17324D', sky1: '#CDE8FF', sky2: '#EEF7FF', sun: '#FFD23F', volcano: '#8A6A55', lava: '#FF8A3C', smoke: '#EAF2F8', hill: '#A8D88A', ground: '#74BF59', fern: '#3E8E3A', dino: '#4FA3E0', dinoDark: '#3B88C4', spots: '#2F6FA8', belly: '#D9F0FF', egg: '#FFFDF6', eggSpot: '#9FD3FF', hat: '#FFD23F', hatStripe: '#FF8A3C' },
      hero: 'linear-gradient(180deg, #D6ECFF 0%, #F0F7FF 100%)', heroInk: '#17324D', heroSoft: 'rgba(23,50,77,0.76)', heroAccent: '#C25A12',
    },
  },
  space: {
    '': {
      t: { page: '#0E1238', card: 'rgba(255,255,255,0.06)', ink: '#F3F1FF', ...darkT, a: '#FFC93C', onA: '#0E1238', b: '#7C5CFF', onB: '#FFFFFF', c: '#38D3E8', accentText: '#FFC93C' },
      a: { sky1: '#2B3190', sky2: '#0B0F31', planet1: '#BCA6FF', planet2: '#7C5CFF', planet3: '#4329B0', ring: '#FFC93C', small: '#38D3E8', rocket: '#F3F1FF', fin: '#E8322E', window: '#38D3E8', flame1: '#FFC93C', flame2: '#FF7A3C', moon: '#E9E6FF', tower: '#5A5F8C', ground: '#1A1E45' },
      hero: 'radial-gradient(120% 70% at 50% 18%, #262C7A 0%, #0E1238 70%)', heroInk: '#FFFFFF', heroSoft: 'rgba(243,241,255,0.8)', heroAccent: '#38D3E8',
    },
    pink: {
      t: { page: '#22093A', card: 'rgba(255,255,255,0.07)', ink: '#FFF0FA', ...darkT, a: '#FF6FB5', onA: '#22093A', b: '#B79CFF', onB: '#22093A', c: '#FFD166', accentText: '#FF8DC7' },
      a: { sky1: '#5A1E7A', sky2: '#1A0630', planet1: '#FFD3EA', planet2: '#FF6FB5', planet3: '#C13584', ring: '#FFD166', small: '#B79CFF', rocket: '#FFF0FA', fin: '#FF6FB5', window: '#B79CFF', flame1: '#FFD166', flame2: '#FF8A5C', moon: '#FBE3F3', tower: '#7A4F98', ground: '#2E0F4A' },
      hero: 'radial-gradient(120% 70% at 50% 18%, #5A1E7A 0%, #22093A 70%)', heroInk: '#FFFFFF', heroSoft: 'rgba(255,240,250,0.82)', heroAccent: '#FF8DC7',
    },
    teal: {
      t: { page: '#03263A', card: 'rgba(255,255,255,0.06)', ink: '#E8FBFF', ...darkT, a: '#2EE6C5', onA: '#03263A', b: '#FF9F43', onB: '#03263A', c: '#7FD8FF', accentText: '#2EE6C5' },
      a: { sky1: '#0C4A6E', sky2: '#021A2A', planet1: '#C8FBF0', planet2: '#2EE6C5', planet3: '#0E8C7A', ring: '#FF9F43', small: '#FF9F43', rocket: '#E8FBFF', fin: '#FF9F43', window: '#7FD8FF', flame1: '#FFD166', flame2: '#FF7A3C', moon: '#DDF7FF', tower: '#3D6E86', ground: '#062F45' },
      hero: 'radial-gradient(120% 70% at 50% 18%, #0C4A6E 0%, #03263A 70%)', heroInk: '#FFFFFF', heroSoft: 'rgba(232,251,255,0.82)', heroAccent: '#2EE6C5',
    },
  },
  superhero: {
    '': {
      t: { page: '#F2F6FF', card: '#FFFFFF', ink: '#141B3C', ...light('#141B3C'), a: '#E8322E', onA: '#FFFFFF', b: '#1F5BD8', onB: '#FFFFFF', c: '#FFD23F', accentText: '#C42320' },
      a: { ink: '#141B3C', sky: '#1F5BD8', rays: '#3A74F2', city: '#13245E', windows: '#FFD23F', burst: '#FFD23F', burstIn: '#FFE57F', num: '#E8322E', b2: '#1F5BD8', bolt: '#FFD23F' },
      hero: '#1F5BD8', heroInk: '#FFFFFF', heroSoft: 'rgba(255,255,255,0.86)', heroAccent: '#FFD23F',
    },
    pink: {
      t: { page: '#FFF2FA', card: '#FFFFFF', ink: '#2A1240', ...light('#2A1240'), a: '#FF3E9A', onA: '#FFFFFF', b: '#7B3FE4', onB: '#FFFFFF', c: '#FFD23F', accentText: '#D61F7F' },
      a: { ink: '#2A1240', sky: '#7B3FE4', rays: '#9361F0', city: '#3B1A6E', windows: '#FFD23F', burst: '#FFD23F', burstIn: '#FFE57F', num: '#FF3E9A', b2: '#FF3E9A', bolt: '#FFD23F' },
      hero: '#7B3FE4', heroInk: '#FFFFFF', heroSoft: 'rgba(255,255,255,0.88)', heroAccent: '#FFD23F',
    },
    green: {
      t: { page: '#EEFBF2', card: '#FFFFFF', ink: '#0F2A1C', ...light('#0F2A1C'), a: '#1FA463', onA: '#FFFFFF', b: '#0F2A1C', onB: '#FFFFFF', c: '#FFD23F', accentText: '#127A47' },
      a: { ink: '#0F2A1C', sky: '#0F7A4A', rays: '#1F9A60', city: '#0A3D25', windows: '#FFD23F', burst: '#FFD23F', burstIn: '#FFE57F', num: '#1FA463', b2: '#E8322E', bolt: '#FFD23F' },
      hero: '#0F7A4A', heroInk: '#FFFFFF', heroSoft: 'rgba(255,255,255,0.88)', heroAccent: '#FFD23F',
    },
  },
  unicorn: {
    '': {
      t: { page: '#FFF5FB', card: '#FFFFFF', ink: '#4A2C5E', ...light('#4A2C5E'), a: '#E0518F', onA: '#FFFFFF', b: '#9B7BF0', onB: '#FFFFFF', c: '#FFE27A', accentText: '#C23C7A' },
      a: { ink: '#4A2C5E', sky1: '#E4D8FF', sky2: '#FFE3F1', rainbow: '#FF8FB1,#FFB86B,#FFE27A,#8EE0B5,#8FC3FF,#B79CFF', horn: '#FFE27A', hornStripe: '#FFB86B', num: '#E0518F', ring: '#F7C6E0' },
      hero: 'linear-gradient(180deg, #EDE3FF 0%, #FFE6F3 60%, #FFF5FB 100%)', heroInk: '#4A2C5E', heroSoft: 'rgba(74,44,94,0.76)', heroAccent: '#C23C7A',
    },
    lavender: {
      t: { page: '#F7F3FF', card: '#FFFFFF', ink: '#3C2A6B', ...light('#3C2A6B'), a: '#8E6BE8', onA: '#FFFFFF', b: '#E07BB5', onB: '#FFFFFF', c: '#BFE9F5', accentText: '#6A47D1' },
      a: { ink: '#3C2A6B', sky1: '#DCD3FF', sky2: '#F3E8FF', rainbow: '#E8A6D9,#C6B3FF,#A9C8FF,#A6E3E9,#C2F0D2,#FFE6A8', horn: '#F5D77A', hornStripe: '#E8A6D9', num: '#8E6BE8', ring: '#D9CCFF' },
      hero: 'linear-gradient(180deg, #E4DBFF 0%, #F3E8FF 60%, #F7F3FF 100%)', heroInk: '#3C2A6B', heroSoft: 'rgba(60,42,107,0.76)', heroAccent: '#6A47D1',
    },
    mint: {
      t: { page: '#F2FBF8', card: '#FFFFFF', ink: '#24443F', ...light('#24443F'), a: '#2BA88C', onA: '#FFFFFF', b: '#E6A84A', onB: '#24443F', c: '#F7C9DD', accentText: '#1E8A72' },
      a: { ink: '#24443F', sky1: '#CFF3EA', sky2: '#FFF6E3', rainbow: '#F49AC1,#F7C59F,#F9E79F,#A8E6CF,#9AD8E8,#C9B6F2', horn: '#E6B84A', hornStripe: '#F49AC1', num: '#2BA88C', ring: '#BDEBDD' },
      hero: 'linear-gradient(180deg, #D4F5EC 0%, #FFF6E3 60%, #F2FBF8 100%)', heroInk: '#24443F', heroSoft: 'rgba(36,68,63,0.76)', heroAccent: '#1E8A72',
    },
  },
  jungle: {
    '': {
      t: { page: '#FBF4E2', card: '#FFFDF6', ink: '#1F3A2A', ...light('#1F3A2A'), a: '#2F7A45', onA: '#FFFFFF', b: '#E8902A', onB: '#1F3A2A', c: '#F6C445', accentText: '#A85A12' },
      a: { ink: '#1F3A2A', a: '#E8902A', sky1: '#FFE29A', sky2: '#FFF3D0', sun: '#FFB547', sunIn: '#FFC86A', savanna: '#E7B55B', grass: '#7DB04A', leaf1: '#2F7A45', leaf2: '#4E9D4A', leaf3: '#3F8A44', tree: '#3B6B35', trunk: '#5A3D22', wood: '#B9773B', giraffe: '#F2B84B', patch: '#C9782E', dark: '#8A4F22', muzzle: '#F7D08A', mane1: '#E8902A', mane2: '#C9631E', monkey: '#8A5A34', monkeyFace: '#E8C39A' },
      hero: 'linear-gradient(180deg, #FFEBB5 0%, #FBF4E2 100%)', heroInk: '#1F3A2A', heroSoft: 'rgba(31,58,42,0.78)', heroAccent: '#A85A12',
    },
    pastel: {
      t: { page: '#FBF5EF', card: '#FFFDFB', ink: '#4A3B33', ...light('#4A3B33'), a: '#C77D6B', onA: '#FFFFFF', b: '#8FA98A', onB: '#FFFFFF', c: '#EDD3B8', accentText: '#A35D4C' },
      a: { ink: '#4A3B33', a: '#C77D6B', sky1: '#F8E3D3', sky2: '#FBF5EF', sun: '#F1B9A0', sunIn: '#F6CDB6', savanna: '#E8D2B5', grass: '#B9C9A7', leaf1: '#8FA98A', leaf2: '#AFC2A5', leaf3: '#9DB396', tree: '#7E9578', trunk: '#8C6A55', wood: '#C9A07E', giraffe: '#E9C08D', patch: '#C9946A', dark: '#9A6A4A', muzzle: '#F3DCC2', mane1: '#D9A27E', mane2: '#B97E5E', monkey: '#A57A5C', monkeyFace: '#F0D6BC' },
      hero: 'linear-gradient(180deg, #F8E3D3 0%, #FBF5EF 100%)', heroInk: '#4A3B33', heroSoft: 'rgba(74,59,51,0.78)', heroAccent: '#A35D4C',
    },
    sunset: {
      t: { page: '#FFF4E8', card: '#FFFDF8', ink: '#2D1E3B', ...light('#2D1E3B'), a: '#E85D3A', onA: '#FFFFFF', b: '#1E8C8C', onB: '#FFFFFF', c: '#FFC145', accentText: '#C2411F' },
      a: { ink: '#2D1E3B', a: '#E85D3A', sky1: '#FFB37A', sky2: '#FFE3C2', sun: '#FF7A45', sunIn: '#FF9A5C', savanna: '#E7A15B', grass: '#5E9E5A', leaf1: '#1E6B5C', leaf2: '#2E8C6E', leaf3: '#247A65', tree: '#2D4A3B', trunk: '#4A2E22', wood: '#A8602F', giraffe: '#F2B84B', patch: '#B9682A', dark: '#6E3A1A', muzzle: '#F7D08A', mane1: '#E8902A', mane2: '#B9481E', monkey: '#7A4A2A', monkeyFace: '#E8B98A' },
      hero: 'linear-gradient(180deg, #FFC79A 0%, #FFF4E8 100%)', heroInk: '#2D1E3B', heroSoft: 'rgba(45,30,59,0.78)', heroAccent: '#C2411F',
    },
  },
  cars: {
    '': {
      t: { page: '#F4F6F9', card: '#FFFFFF', ink: '#1A1D24', ...light('#1A1D24'), a: '#E3262F', onA: '#FFFFFF', b: '#1A1D24', onB: '#FFFFFF', c: '#FFC21A', accentText: '#C21A22' },
      a: { sky1: '#BDE8FF', sky2: '#EAF8FF', car: '#E3262F', helmet: '#FFC21A', hills: '#BFE3A6', grass: '#6CC04A', road: '#3A3F4B', kerb: '#E3262F', bunting: '#E3262F,#FFC21A,#FFFFFF,#1A1D24' },
      hero: 'linear-gradient(180deg, #DDF3FF 0%, #F4F6F9 100%)', heroInk: '#1A1D24', heroSoft: 'rgba(26,29,36,0.76)', heroAccent: '#C21A22',
    },
    pink: {
      t: { page: '#FFF3F9', card: '#FFFFFF', ink: '#2A1838', ...light('#2A1838'), a: '#F0479B', onA: '#FFFFFF', b: '#6C3FD1', onB: '#FFFFFF', c: '#FFD23F', accentText: '#C9257A' },
      a: { sky1: '#FFD6EC', sky2: '#FFF3F9', car: '#F0479B', helmet: '#FFD23F', hills: '#D9C8F5', grass: '#9FDCB5', road: '#4A3D5C', kerb: '#F0479B', bunting: '#F0479B,#FFD23F,#FFFFFF,#6C3FD1' },
      hero: 'linear-gradient(180deg, #FFDDEF 0%, #FFF3F9 100%)', heroInk: '#2A1838', heroSoft: 'rgba(42,24,56,0.76)', heroAccent: '#C9257A',
    },
    blue: {
      t: { page: '#F1F7FF', card: '#FFFFFF', ink: '#0F2240', ...light('#0F2240'), a: '#1F6FE5', onA: '#FFFFFF', b: '#0F2240', onB: '#FFFFFF', c: '#FF8A1F', accentText: '#1556B8' },
      a: { sky1: '#CFE6FF', sky2: '#F1F7FF', car: '#1F6FE5', helmet: '#FF8A1F', hills: '#BFE3A6', grass: '#6CC04A', road: '#3A3F4B', kerb: '#1F6FE5', bunting: '#1F6FE5,#FF8A1F,#FFFFFF,#0F2240' },
      hero: 'linear-gradient(180deg, #D6E9FF 0%, #F1F7FF 100%)', heroInk: '#0F2240', heroSoft: 'rgba(15,34,64,0.76)', heroAccent: '#1556B8',
    },
  },
}

export function paletteOf(kind: Kind, choice?: string): Palette {
  const set = PALETTES[kind]
  return set[choice ?? ''] ?? set['']
}

// ─── Little marks ───────────────────────────────────────────────────────────

const FOOT = 'M12 22.5 C8.6 22.5 7 20 8 17.2 L2.5 8.5 L9.2 13.2 L12 1.8 L14.8 13.2 L21.5 8.5 L16 17.2 C17 20 15.4 22.5 12 22.5 Z'
const PAW = 'M12 21c-3.5 0-6-2.2-6-4.6 0-2.3 2.6-4.4 6-4.4s6 2.1 6 4.4c0 2.4-2.5 4.6-6 4.6ZM5 11.5a2.4 3 0 1 0 0 .1ZM9.5 8a2.4 3 0 1 0 0 .1ZM14.5 8a2.4 3 0 1 0 0 .1ZM19 11.5a2.4 3 0 1 0 0 .1Z'
const HEART = 'M12 21C3 14 2 8.5 6 6c2.6-1.6 5 0 6 2 1-2 3.4-3.6 6-2 4 2.5 3 8-6 15Z'

const ringed = (fill: string, ring: string, child: ReactNode) => (
  <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: fill, border: `2.5px solid ${ring}` }}>{child}</span>
)

// ─── The skins ──────────────────────────────────────────────────────────────

const tile = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

export function skinOf(kind: Kind, pal: Palette): Skin {
  const { t } = pal
  const three = [t.a, t.b, t.c]
  const base = { kind, t, body: round, hand }

  if (kind === 'dinosaur') {
    const ink = t.ink
    return {
      ...base,
      display: shrikhand.style.fontFamily, displayStyle: { fontWeight: 400, letterSpacing: '0.005em' }, em: 0.72,
      bodyStyle: { background: t.page, backgroundImage: tile(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><g fill='${ink}' opacity='0.05'><path transform='translate(20 20)' d='${FOOT}'/><path transform='translate(78 70) rotate(30)' d='${FOOT}'/></g></svg>`) },
      bodyClass: 'kx-trail',
      Card: ({ children, i, label }) => (
        <div className="relative pb-7 pl-11">
          <span aria-hidden className="absolute bottom-0 left-[19px] top-0 border-l-[3px] border-dashed" style={{ borderColor: t.faint }} />
          <span aria-hidden className="absolute left-0 top-4">{ringed(t.card, ink, <svg viewBox="0 0 24 24" className="h-5 w-5"><path d={FOOT} fill={three[i % 3]} /></svg>)}</span>
          <div className="relative px-5 pb-6 pt-6" style={{ background: t.card, border: `2.5px solid ${ink}`, borderRadius: 18, boxShadow: `0 5px 0 ${ink}`, transform: `rotate(${i % 2 ? 0.7 : -0.7}deg)` }}>
            <span aria-hidden className="absolute -top-3 left-6 h-6 w-16 -rotate-6" style={{ background: t.c, opacity: 0.75 }} />
            <span aria-hidden className="absolute -top-3 right-6 h-6 w-12 rotate-6" style={{ background: t.c, opacity: 0.75 }} />
            {label && <p className="mb-3 text-center" style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.accentText }}>{label}</p>}
            {children}
          </div>
        </div>
      ),
      Title: ({ children }) => (
        <h2 className="flex items-center justify-center gap-2 text-center" style={{ fontFamily: shrikhand.style.fontFamily, fontSize: 'clamp(26px, 8.6cqi, 36px)', lineHeight: 1.1 }}>
          <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden><path d={FOOT} fill={t.a} /></svg>{children}
        </h2>
      ),
      marker: (k) => ringed(t.page, ink, <svg viewBox="0 0 24 24" className="h-5 w-5"><path d={FOOT} fill={three[k % 3]} /></svg>),
      photo: (src, k) => (
        <div className="relative bg-white p-2 pb-7" style={{ border: `2px solid ${ink}`, boxShadow: `0 4px 0 ${ink}`, transform: `rotate(${k % 2 ? 2 : -1.6}deg)` }}>
          <span aria-hidden className="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 rotate-3" style={{ background: t.c, opacity: 0.8 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" className="block aspect-square w-full object-cover" />
        </div>
      ),
      countdown: (days, rest, label) => (
        <div className="relative pb-7 pl-11">
          <span aria-hidden className="absolute bottom-0 left-[19px] top-0 border-l-[3px] border-dashed" style={{ borderColor: t.faint }} />
          <div className="flex items-center gap-4">
            <div className="relative flex h-[118px] w-[118px] shrink-0 items-center justify-center" style={{ background: '#CFC8BA', borderRadius: '46% 54% 50% 50% / 55% 48% 52% 45%', border: `3px solid ${ink}`, boxShadow: `0 5px 0 ${ink}` }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden><path d="M20 30 L34 40 L30 52 M74 22 L66 36 L78 44 M60 80 L52 70" stroke={ink} strokeOpacity="0.3" strokeWidth="2.5" fill="none" /></svg>
              <span className="relative tabular-nums" style={{ fontFamily: shrikhand.style.fontFamily, fontSize: days > 99 ? 34 : 46, color: ink }}>{days}</span>
            </div>
            <div className="min-w-0"><p className="leading-[1.15]" style={{ fontSize: 'clamp(21px, 6.6cqi, 26px)', fontWeight: 800 }}>{label}</p><p className="mt-1.5 tabular-nums" style={{ fontSize: 15, color: t.soft }}>{rest}</p></div>
          </div>
        </div>
      ),
      button: (k) => ({ background: k === 'a' ? t.a : k === 'b' ? t.c : 'transparent', color: k === 'a' ? t.onA : ink, border: `2px solid ${ink}`, borderRadius: 999, boxShadow: k === 'ghost' ? 'none' : `0 3px 0 ${ink}`, fontFamily: round, fontWeight: 800 }),
      words: { when: 'When', where: 'Where', plan: 'The dino plan', dress: 'Explorer dress-up', notes: 'For grown-ups', photos: 'Fossil finds', rsvp: 'Joining the expedition?', yes: 'We’ll be there!', no: 'Can’t make it', kids: 'Little explorers', grownups: 'Grown-ups', days: ['sleep until the big roar', 'sleeps until the big roar'], wishes: 'Roars & blessings for {first}', wishIntro: 'Leave a birthday wish for {first}. The family will keep every one.' },
    }
  }

  if (kind === 'space') {
    const corner = (pos: CSSProperties) => <span aria-hidden className="absolute h-4 w-4" style={{ ...pos, borderColor: t.a }} />
    return {
      ...base,
      display: unbounded.style.fontFamily, displayStyle: { fontWeight: 800, letterSpacing: '-0.01em' }, em: 0.92,
      bodyStyle: { background: `${tile(`<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><g fill='#fff'><circle cx='12' cy='20' r='1' opacity='.6'/><circle cx='70' cy='44' r='.8' opacity='.4'/><circle cx='118' cy='16' r='1.2' opacity='.7'/><circle cx='34' cy='96' r='.8' opacity='.5'/><circle cx='100' cy='110' r='1' opacity='.45'/><circle cx='56' cy='130' r='.7' opacity='.4'/></g></svg>`)}, ${t.page}` },
      bodyClass: 'kx-console',
      Card: ({ children, i, label }) => (
        <div className="relative pb-7 pl-11">
          <span aria-hidden className="absolute bottom-0 left-[19px] top-0 w-[2px]" style={{ background: `linear-gradient(${t.c}, ${t.b})`, opacity: 0.5 }} />
          <span aria-hidden className="absolute left-[7px] top-6 h-[26px] w-[26px] rounded-full" style={{ background: three[i % 3], boxShadow: `0 0 0 4px rgba(255,255,255,0.08), 0 0 18px ${three[i % 3]}` }} />
          <div className="relative px-5 pb-6 pt-5" style={{ background: t.card, border: `1px solid rgba(255,255,255,0.14)`, borderRadius: 16, backdropFilter: 'blur(6px)' }}>
            {corner({ left: -1, top: -1, borderLeft: '3px solid', borderTop: '3px solid', borderTopLeftRadius: 10 })}
            {corner({ right: -1, top: -1, borderRight: '3px solid', borderTop: '3px solid', borderTopRightRadius: 10 })}
            {corner({ left: -1, bottom: -1, borderLeft: '3px solid', borderBottom: '3px solid', borderBottomLeftRadius: 10 })}
            {corner({ right: -1, bottom: -1, borderRight: '3px solid', borderBottom: '3px solid', borderBottomRightRadius: 10 })}
            {label && <p className="mb-3" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.a }}>▸ {label}</p>}
            {children}
          </div>
        </div>
      ),
      Title: ({ children }) => (
        <h2 className="text-center" style={{ fontFamily: unbounded.style.fontFamily, fontWeight: 800, fontSize: 'clamp(20px, 6.4cqi, 28px)', letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1.15 }}>
          <span style={{ color: t.c }}>✦</span> {children} <span style={{ color: t.c }}>✦</span>
        </h2>
      ),
      marker: (k) => (
        <span className="relative flex h-10 w-10 items-center justify-center">
          <span className="h-7 w-7 rounded-full" style={{ background: three[k % 3], boxShadow: `0 0 14px ${three[k % 3]}` }} />
          <span aria-hidden className="absolute h-3 w-11 -rotate-12 rounded-[50%] border-2" style={{ borderColor: 'rgba(255,255,255,0.6)' }} />
        </span>
      ),
      photo: (src, k) => (
        <div className="relative aspect-square">
          <span aria-hidden className="absolute -inset-2 rounded-full border-2 border-dashed" style={{ borderColor: three[k % 3], opacity: 0.6 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" className="h-full w-full rounded-full object-cover" style={{ boxShadow: `0 0 0 4px ${t.page}, 0 0 26px ${three[k % 3]}` }} />
        </div>
      ),
      countdown: (days, rest, label) => (
        <div className="relative pb-7 pl-11">
          <span aria-hidden className="absolute bottom-0 left-[19px] top-0 w-[2px]" style={{ background: t.c, opacity: 0.4 }} />
          <div className="px-5 py-5 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${t.a}`, borderRadius: 16, boxShadow: `inset 0 0 24px rgba(0,0,0,0.4), 0 0 24px rgba(255,255,255,0.05)` }}>
            <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12.5, letterSpacing: '0.24em', color: t.c }}>T–MINUS</p>
            <p className="tabular-nums" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontWeight: 800, fontSize: days > 99 ? 46 : 58, color: t.a, textShadow: `0 0 18px ${t.a}`, lineHeight: 1.1 }}>{days}</p>
            <p style={{ fontSize: 19, fontWeight: 800 }}>{label}</p>
            <p className="mt-1 tabular-nums" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 14, color: t.soft }}>{rest}</p>
          </div>
        </div>
      ),
      button: (k) => ({ background: k === 'a' ? t.a : 'transparent', color: k === 'a' ? t.onA : t.ink, border: `2px solid ${k === 'a' ? t.a : 'rgba(255,255,255,0.4)'}`, borderRadius: 999, boxShadow: k === 'a' ? `0 0 18px ${t.a}66` : 'none', fontFamily: round, fontWeight: 800 }),
      words: { when: 'Launch date', where: 'Launch pad', plan: 'Mission timeline', dress: 'Crew uniform', notes: 'Ground control notes', photos: '{first}’s galaxy', rsvp: 'Joining the crew?', yes: 'Count us in!', no: 'Can’t make it', kids: 'Astronauts', grownups: 'Ground crew', days: ['day to lift-off', 'days to lift-off'], wishes: 'Messages for {first} from Earth', wishIntro: 'Send {first} a birthday message. The family will keep them all.' },
    }
  }

  if (kind === 'superhero') {
    const ink = t.ink
    const cap = (text: string) => (
      <span className="absolute -top-4 left-4 px-2.5 py-0.5" style={{ background: t.c, border: `2.5px solid ${ink}`, fontFamily: oswald.style.fontFamily, fontWeight: 700, fontStyle: 'italic', textTransform: 'uppercase', fontSize: 14, letterSpacing: '0.04em', color: ink }}>{text}</span>
    )
    return {
      ...base,
      display: oswald.style.fontFamily, displayStyle: { fontWeight: 700, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '0.01em' }, em: 0.56,
      bodyStyle: { background: t.page, backgroundImage: `radial-gradient(${ink}14 1.6px, transparent 1.7px)`, backgroundSize: '12px 12px' },
      bodyClass: 'kx-comic',
      Card: ({ children, i, label }) => (
        <div className="relative mb-9" style={{ transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
          <div className="relative px-5 pb-6 pt-7" style={{ background: t.card, border: `3.5px solid ${ink}`, borderRadius: 6, boxShadow: `7px 7px 0 ${ink}` }}>
            {label && cap(label)}
            {children}
          </div>
        </div>
      ),
      Title: ({ children }) => (
        <h2 className="text-center">
          <span className="inline-block -skew-x-6 px-3 py-0.5" style={{ background: t.a, color: '#FFFFFF', border: `3px solid ${ink}`, boxShadow: `4px 4px 0 ${ink}`, fontFamily: oswald.style.fontFamily, fontWeight: 700, fontStyle: 'italic', textTransform: 'uppercase', fontSize: 'clamp(24px, 7.6cqi, 32px)', letterSpacing: '0.02em' }}>{children}</span>
        </h2>
      ),
      marker: (k) => (
        <svg viewBox="-24 -24 48 48" className="h-11 w-11" aria-hidden>
          <polygon points={burst(0, 0, 10, 22, 15)} fill={three[k % 3]} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <text x="0" y="1" textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="700" fill={k % 3 === 2 ? ink : '#FFFFFF'} style={{ fontFamily: oswald.style.fontFamily }}>{k + 1}</text>
        </svg>
      ),
      photo: (src, k) => (
        <div className="relative" style={{ border: `3.5px solid ${ink}`, boxShadow: `5px 5px 0 ${ink}`, background: '#FFFFFF', transform: `rotate(${k % 2 ? 1.4 : -1.2}deg)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" className="block aspect-square w-full object-cover" />
          <span className="absolute bottom-0 left-0 px-2 py-0.5" style={{ background: t.c, borderTop: `2.5px solid ${ink}`, borderRight: `2.5px solid ${ink}`, fontFamily: oswald.style.fontFamily, fontWeight: 700, fontStyle: 'italic', fontSize: 12, textTransform: 'uppercase' }}>Panel {k + 1}</span>
        </div>
      ),
      countdown: (days, rest, label) => (
        <div className="mb-9 flex items-center justify-center gap-3">
          <svg viewBox="-70 -70 140 140" className="h-[132px] w-[132px] shrink-0" aria-hidden={false} role="img" aria-label={`${days} ${label}`}>
            <polygon points={burst(5, 5, 14, 64, 46)} fill={ink} />
            <polygon points={burst(0, 0, 14, 64, 46)} fill={t.c} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
            <text x="0" y="3" textAnchor="middle" dominantBaseline="central" fontSize={days > 99 ? 40 : 54} fontWeight="700" fontStyle="italic" fill={t.a} stroke={ink} strokeWidth="2.5" paintOrder="stroke" style={{ fontFamily: oswald.style.fontFamily }}>{days}</text>
          </svg>
          <div className="relative max-w-[12rem] px-4 py-3" style={{ background: '#FFFFFF', border: `3px solid ${ink}`, borderRadius: 18 }}>
            <p style={{ fontFamily: oswald.style.fontFamily, fontWeight: 700, fontStyle: 'italic', textTransform: 'uppercase', fontSize: 20, lineHeight: 1.1 }}>{label}!</p>
            <p className="mt-1 tabular-nums" style={{ fontSize: 13.5, color: t.soft }}>{rest}</p>
          </div>
        </div>
      ),
      button: (k) => ({ background: k === 'a' ? t.a : k === 'b' ? t.c : '#FFFFFF', color: k === 'a' ? '#FFFFFF' : ink, border: `3px solid ${ink}`, borderRadius: 8, boxShadow: k === 'ghost' ? 'none' : `4px 4px 0 ${ink}`, fontFamily: oswald.style.fontFamily, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }),
      words: { when: 'When!', where: 'Where!', plan: 'Hero training', dress: 'Hero costume', notes: 'For grown-ups', photos: 'The origin story', rsvp: 'Joining the squad?', yes: 'We’re in!', no: 'Can’t make it', kids: 'Heroes', grownups: 'Sidekicks', days: ['day until hero hour', 'days until hero hour'], wishes: 'Shout-outs for our hero, {first}', wishIntro: 'Write {first} a birthday shout-out. The family will keep every one.' },
    }
  }

  if (kind === 'unicorn') {
    const rainbow = pal.a.rainbow
    return {
      ...base,
      display: round, displayStyle: { fontWeight: 800, letterSpacing: '-0.01em' }, em: 0.62,
      bodyStyle: { background: `${tile(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><g fill='${t.b}' opacity='0.16'><path transform='translate(30 30) scale(.7)' d='${SPARKLE}'/><path transform='translate(120 90) scale(.5)' d='${SPARKLE}'/><path transform='translate(60 130) scale(.4)' d='${SPARKLE}'/></g></svg>`)}, linear-gradient(180deg, ${t.page}, #FFFFFF 60%, ${t.page})` },
      bodyClass: 'kx-clouds',
      Card: ({ children, label }) => (
        <div className="relative mb-9">
          <span aria-hidden className="absolute -top-3 left-6 h-8 w-8 rounded-full bg-white" />
          <span aria-hidden className="absolute -top-5 left-11 h-10 w-10 rounded-full bg-white" />
          <span aria-hidden className="absolute -top-3 right-8 h-7 w-7 rounded-full bg-white" />
          <div className="relative px-5 pb-6 pt-6" style={{ background: '#FFFFFF', borderRadius: 30, boxShadow: `0 0 0 3px ${pal.a.ring}, 0 16px 34px ${t.a}22` }}>
            {label && <p className="mx-auto mb-3 w-fit rounded-full px-4 py-1" style={{ background: `linear-gradient(90deg, ${rainbow})`, color: t.ink, fontSize: 13.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>✦ {label} ✦</p>}
            {children}
          </div>
        </div>
      ),
      Title: ({ children }) => (
        <h2 className="text-center" style={{ fontFamily: round, fontWeight: 800, fontSize: 'clamp(26px, 8.4cqi, 34px)', lineHeight: 1.1 }}>
          {children}
          <span aria-hidden className="mx-auto mt-2 block h-[6px] w-28 rounded-full" style={{ background: `linear-gradient(90deg, ${rainbow})` }} />
        </h2>
      ),
      marker: (k) => (
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${three[k % 3]}22`, border: `2px solid ${three[k % 3]}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path d={HEART} fill={three[k % 3]} /></svg>
        </span>
      ),
      photo: (src) => (
        <div className="rounded-full p-[5px]" style={{ background: `conic-gradient(${rainbow}, ${rainbow.split(',')[0]})` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" className="block aspect-square w-full rounded-full border-4 border-white object-cover" />
        </div>
      ),
      countdown: (days, rest, label) => (
        <div className="mb-9 flex items-center justify-center gap-4">
          <div className="flex h-[118px] w-[118px] shrink-0 items-center justify-center rounded-full p-[6px]" style={{ background: `conic-gradient(${rainbow}, ${rainbow.split(',')[0]})` }}>
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
              <span className="tabular-nums" style={{ fontFamily: round, fontWeight: 800, fontSize: days > 99 ? 36 : 48, color: t.a }}>{days}</span>
            </div>
          </div>
          <div className="min-w-0"><p className="leading-[1.15]" style={{ fontSize: 'clamp(21px, 6.6cqi, 26px)', fontWeight: 800 }}>{label}</p><p className="mt-1.5 tabular-nums" style={{ fontSize: 15, color: t.soft }}>{rest}</p></div>
        </div>
      ),
      button: (k) => ({ background: k === 'a' ? `linear-gradient(90deg, ${t.a}, ${t.b})` : '#FFFFFF', color: k === 'a' ? '#FFFFFF' : k === 'b' ? t.a : t.ink, border: `2px solid ${k === 'a' ? 'transparent' : k === 'b' ? t.a : t.line}`, borderRadius: 999, boxShadow: k === 'a' ? `0 8px 18px ${t.a}44` : 'none', fontFamily: round, fontWeight: 800 }),
      words: { when: 'When', where: 'Where', plan: 'The magic plan', dress: 'Sparkle dress-up', notes: 'For grown-ups', photos: 'Magical moments', rsvp: 'Will you come?', yes: 'We’ll be there!', no: 'Can’t make it', kids: 'Little ones', grownups: 'Grown-ups', days: ['sleep until the magic', 'sleeps until the magic'], wishes: 'Wishes & blessings for {first}', wishIntro: 'Leave a sprinkle of love for {first}. The family will keep every wish.' },
    }
  }

  if (kind === 'jungle') {
    const wood = pal.a.wood
    const trunk = pal.a.trunk
    const plank: CSSProperties = { background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 22px), linear-gradient(180deg, ${wood}, ${trunk})`, border: `2.5px solid ${trunk}`, borderRadius: 10, color: '#FFF8E7', boxShadow: `0 4px 0 ${trunk}` }
    return {
      ...base,
      display: fraunces.style.fontFamily, displayStyle: { fontWeight: 900, fontVariationSettings: '"SOFT" 100, "WONK" 1', letterSpacing: '-0.01em' }, em: 0.66,
      bodyStyle: { background: t.page },
      bodyClass: 'kx-signs',
      decor: (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[8, 30, 52, 74].map((top, i) => (
            <svg key={top} viewBox="0 0 120 60" className="kx-rustle absolute w-28" style={{ top: `${top}%`, [i % 2 ? 'right' : 'left']: -36, transform: i % 2 ? 'scaleX(-1)' : undefined, opacity: 0.55 }}>
              <path d="M0 30 C26 -4 84 -8 116 26 C84 52 28 56 0 30 Z" fill={i % 2 ? pal.a.leaf2 : pal.a.leaf1} />
            </svg>
          ))}
        </div>
      ),
      Card: ({ children, i, label }) => (
        <div className="relative mb-9" style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>
          {label && (
            <div className="relative z-10 mx-auto -mb-4 w-fit px-5 py-1.5 text-center" style={{ ...plank, fontFamily: fraunces.style.fontFamily, fontWeight: 900, fontSize: 18 }}>
              <span aria-hidden className="absolute -top-6 left-3 h-6 border-l-[3px]" style={{ borderColor: trunk }} />
              <span aria-hidden className="absolute -top-6 right-3 h-6 border-l-[3px]" style={{ borderColor: trunk }} />
              {label}
            </div>
          )}
          <div className="relative px-5 pb-6 pt-8" style={{ background: t.card, border: `2.5px solid ${trunk}`, borderRadius: 16, boxShadow: `0 5px 0 ${trunk}` }}>{children}</div>
        </div>
      ),
      Title: ({ children }) => (
        <h2 className="text-center">
          <span className="inline-block -rotate-1 px-5 py-1.5" style={{ ...plank, fontFamily: fraunces.style.fontFamily, fontWeight: 900, fontSize: 'clamp(24px, 7.6cqi, 32px)' }}>{children}</span>
        </h2>
      ),
      marker: (k) => ringed(t.page, trunk, <svg viewBox="0 0 24 24" className="h-5 w-5"><path d={PAW} fill={three[k % 3]} /></svg>),
      photo: (src, k) => (
        <div className="p-[7px]" style={{ background: `repeating-linear-gradient(${k % 2 ? 0 : 90}deg, #C9B458 0 26px, #8F7D2E 26px 29px)`, borderRadius: 8, boxShadow: `0 4px 0 ${trunk}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" className="block aspect-square w-full rounded-[3px] object-cover" />
        </div>
      ),
      countdown: (days, rest, label) => (
        <div className="mb-9 flex items-center justify-center gap-4">
          <div className="flex h-[112px] w-[112px] shrink-0 items-center justify-center rounded-full" style={{ ...plank, borderRadius: 999 }}>
            <span className="tabular-nums" style={{ fontFamily: fraunces.style.fontFamily, fontWeight: 900, fontSize: days > 99 ? 36 : 48 }}>{days}</span>
          </div>
          <div className="min-w-0"><p className="leading-[1.15]" style={{ fontSize: 'clamp(21px, 6.6cqi, 26px)', fontWeight: 800 }}>{label}</p><p className="mt-1.5 tabular-nums" style={{ fontSize: 15, color: t.soft }}>{rest}</p></div>
        </div>
      ),
      button: (k) => ({ background: k === 'a' ? t.a : k === 'b' ? t.c : 'transparent', color: k === 'a' ? t.onA : t.ink, border: `2px solid ${trunk}`, borderRadius: 12, boxShadow: k === 'ghost' ? 'none' : `0 3px 0 ${trunk}`, fontFamily: round, fontWeight: 800 }),
      words: { when: 'When', where: 'Where', plan: 'Safari plan', dress: 'Safari dress-up', notes: 'For grown-ups', photos: 'Wild moments', rsvp: 'Coming on safari?', yes: 'We’ll be there!', no: 'Can’t make it', kids: 'Little explorers', grownups: 'Grown-ups', days: ['day until the safari', 'days until the safari'], wishes: 'Wild wishes & blessings for {first}', wishIntro: 'Leave a birthday wish for {first}. The family will keep every one.' },
    }
  }

  // Race cars
  const ink = t.ink
  const chk = `repeating-conic-gradient(${ink} 0 25%, #FFFFFF 0 50%) 0 0 / 14px 14px`
  return {
    ...base,
    display: syne.style.fontFamily, displayStyle: { fontWeight: 800, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.01em' }, em: 1.1,
    bodyStyle: { background: t.page },
    bodyClass: 'kx-road',
    decor: (
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 w-[92px] -translate-x-1/2" style={{ bottom: 220, background: pal.a.road, boxShadow: `inset 6px 0 0 #FFFFFF, inset -6px 0 0 #FFFFFF` }}>
        <span className="kx-roadline absolute inset-y-0 left-1/2 w-[5px] -translate-x-1/2" style={{ backgroundImage: 'linear-gradient(#FFFFFF 0 50%, transparent 50% 100%)', backgroundSize: '5px 44px' }} />
      </div>
    ),
    Card: ({ children, i, label }) => (
      <div className={`relative mb-9 ${i % 2 ? 'ml-5' : 'mr-5'}`}>
        <div className="relative overflow-hidden" style={{ background: t.card, border: `3px solid ${ink}`, borderRadius: 16, boxShadow: `0 5px 0 ${ink}` }}>
          <div aria-hidden className="h-3" style={{ background: chk }} />
          <div className="px-5 pb-6 pt-4">
            {label && <p className="mx-auto mb-3 w-fit px-3 py-1" style={{ background: ink, color: '#FFFFFF', borderRadius: 6, fontFamily: syne.style.fontFamily, fontWeight: 800, fontStyle: 'italic', fontSize: 13.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>}
            {children}
          </div>
        </div>
      </div>
    ),
    Title: ({ children }) => (
      <h2 className="text-center" style={{ fontFamily: syne.style.fontFamily, fontWeight: 800, fontStyle: 'italic', textTransform: 'uppercase', fontSize: 'clamp(20px, 6.4cqi, 26px)', letterSpacing: '-0.01em' }}>
        {children}
        <span aria-hidden className="mx-auto mt-2 block h-3 w-32" style={{ background: chk }} />
      </h2>
    ),
    marker: (k) => (
      <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: three[k % 2], color: '#FFFFFF', border: `2.5px solid ${ink}`, fontFamily: syne.style.fontFamily, fontWeight: 800, fontStyle: 'italic', fontSize: 13 }}>L{k + 1}</span>
    ),
    photo: (src) => (
      <div className="p-[6px]" style={{ background: chk, borderRadius: 10, boxShadow: `0 4px 0 ${ink}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" className="block aspect-square w-full rounded-[5px] object-cover" />
      </div>
    ),
    countdown: (days, rest, label) => (
      <div className="mb-9 mr-5 overflow-hidden px-5 py-5 text-center" style={{ background: '#14161C', color: '#FFFFFF', border: `3px solid ${ink}`, borderRadius: 16, boxShadow: `0 5px 0 ${ink}` }}>
        <div className="mx-auto flex w-fit gap-2" aria-hidden>
          {[0, 1, 2, 3, 4].map((k) => <span key={k} className="kx-lamp h-6 w-6 rounded-full" style={{ background: '#E3262F', animationDelay: `${k * 220}ms` }} />)}
        </div>
        <p className="mt-3 tabular-nums" style={{ fontFamily: syne.style.fontFamily, fontWeight: 800, fontStyle: 'italic', fontSize: days > 99 ? 44 : 56, lineHeight: 1 }}>{days}</p>
        <p className="mt-1" style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        <p className="mt-1 tabular-nums" style={{ fontSize: 14, opacity: 0.75 }}>{rest}</p>
      </div>
    ),
    button: (k) => ({ background: k === 'a' ? t.a : k === 'b' ? ink : '#FFFFFF', color: k === 'ghost' ? ink : '#FFFFFF', border: `2.5px solid ${ink}`, borderRadius: 10, boxShadow: k === 'ghost' ? 'none' : `0 3px 0 ${ink}`, fontFamily: syne.style.fontFamily, fontWeight: 800, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '0.02em' }),
    words: { when: 'Race day', where: 'The track', plan: 'Race schedule', dress: 'Pit-crew dress-up', notes: 'Pit-lane notes', photos: 'Hall of fame', rsvp: 'On the grid?', yes: 'Count us in!', no: 'Can’t make it', kids: 'Racers', grownups: 'Pit crew', days: ['day to lights out', 'days to lights out'], wishes: 'Cheers for {first}', wishIntro: 'Send {first} a birthday cheer. The family will keep every one.' },
  }
}
