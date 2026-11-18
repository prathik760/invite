'use client'

import { useId, useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import type { InviteProps } from './kit/core'
import { syne } from './kit/fonts/syne'
import { oswald } from './kit/fonts/oswald'
import { Confetti, GateWords, HeroWords, PartyBody, SoundButton, useOpening, useParty, useSound, type Kind, type Party } from './kids/shared'
import { paletteOf, skinOf, type Palette } from './kids/skins'
import * as S from './kids/scenes'

/*
 * Kids' party: six birthday themes, each its own card in the catalogue (Dino Roar, Blast Off,
 * Super Squad, Rainbow Dream, Wild One, Race Day). Rebuilt 17 Nov 2026 so each feels like a short
 * film, made for the child and good enough to pay for:
 *
 *   1. A scene to tap, with who it is for: an egg to hatch, a rocket to launch, a comic to open, a
 *      star full of magic, leaves to part, start lights. The tap plays it (3–4 s) with the birthday
 *      tune as a music box (or the host's own song), then confetti.
 *   2. The child, as the star: their photo in the theme (a dinosaur peeking over it, an astronaut's
 *      visor, a comic poster, a unicorn's horn and flower crown, a lion's mane, a racing licence),
 *      or the theme's picture with the age when there is no photo.
 *   3. The details in the theme's own page (kids/skins.tsx), with an RSVP that counts children and
 *      grown-ups and a wall of wishes and blessings.
 *
 * Every theme comes in three colourways (the "Colours" choice, data.ts), so a dinosaur, a rocket or
 * a race car works just as well for a girl. All artwork is original: no cartoon or film characters.
 */

const PLAY_MS: Record<Kind, number> = { dinosaur: 3900, space: 4100, superhero: 3300, unicorn: 3500, jungle: 3100, cars: 3600 }
const CALL: Record<Kind, string> = {
  dinosaur: 'Tap the egg to hatch it',
  space: 'Press to launch',
  superhero: 'Tap to open the comic',
  unicorn: 'Tap the star for some magic',
  jungle: 'Tap to enter the jungle',
  cars: 'Tap to start the race',
}
const FALLBACK: Record<Kind, string> = { dinosaur: 'Aarav', space: 'Kabir', superhero: 'Vivaan', unicorn: 'Myra', jungle: 'Advik', cars: 'Reyansh' }
const FOOT = 'M0 8 C-3 8 -4 6 -3 4 L-7 -3 L-2 0 L0 -8 L2 0 L7 -3 L3 4 C4 6 3 8 0 8Z'
const HEART = 'M0 8 C-9 1 -9 -7 -4 -8 C-1 -9 0 -6 0 -5 C0 -6 1 -9 4 -8 C9 -7 9 1 0 8Z'
const LEAFP = 'M-8 6 C-8 -4 -2 -9 8 -8 C8 2 2 8 -8 6Z'
const BOLT = 'M2 -10 L-6 2 H-1 L-3 10 L6 -2 H1 L3 -10Z'
const SQUARE = 'M-6 -6 H6 V6 H-6Z'
const CIRCLE = 'M-6 0 A6 6 0 1 0 6 0 A6 6 0 1 0 -6 0Z'
const TRI = 'M-7 6 L0 -8 L7 6Z'

const CONFETTI: Record<Kind, string[]> = {
  dinosaur: [LEAFP, FOOT, CIRCLE],
  space: [S.SPARKLE, CIRCLE],
  superhero: [BOLT, S.SPARKLE, SQUARE],
  unicorn: [HEART, S.SPARKLE, CIRCLE],
  jungle: [LEAFP, CIRCLE],
  cars: [SQUARE, TRI],
}

function frame(kind: Kind, pal: Palette): CSSProperties {
  const ink = pal.t.ink
  switch (kind) {
    case 'space': return { border: '2px solid rgba(255,255,255,0.22)', borderRadius: 30, boxShadow: `0 0 0 6px ${pal.t.b}2E, 0 18px 50px rgba(0,0,0,0.45)` }
    case 'superhero': return { border: `3.5px solid ${ink}`, borderRadius: 10, boxShadow: `7px 7px 0 ${ink}` }
    case 'unicorn': return { border: '3px solid #FFFFFF', borderRadius: 34, boxShadow: `0 0 0 3px ${pal.a.ring}, 0 16px 40px ${pal.t.b}47` }
    case 'cars': return { border: `3px solid ${ink}`, borderRadius: 18, boxShadow: `0 6px 0 ${ink}` }
    default: return { border: `3px solid ${ink}`, borderRadius: 30, boxShadow: `0 6px 0 ${ink}` }
  }
}

const CSS = `
.kx svg .kx-twinkle, .kx svg .kx-drift, .kx svg .kx-nod, .kx svg .kx-wobble, .kx svg .kx-pulse, .kx svg .kx-bob, .kx svg .kx-sway,
.kx svg .kx-rustle, .kx svg .kx-spin, .kx svg .kx-flag, .kx svg .kx-float, .kx svg .kx-glow, .kx svg .kx-mane,
.kx .dn-cap, .kx .dn-age, .kx .dn-roar, .kx .dn-print, .kx .dn-egg, .kx .sp-rocket, .kx .sp-smoke circle, .kx .sp-flame,
.kx .sh-sfx, .kx .sh-big, .kx .un-star, .kx .un-uni, .kx .jg-sign, .kx .jg-rawr, .kx .rc-car { transform-box: fill-box; }
.kx .kx-press { transition: transform 140ms ease, box-shadow 140ms ease; }
.kx .kx-press:not(:disabled):hover { transform: translateY(-1px); }
.kx .kx-press:not(:disabled):active { transform: translateY(2px); box-shadow: none !important; }
.kx .kx-twinkle { transform-origin: center; animation: kx-twinkle 2.4s ease-in-out infinite; }
.kx .kx-drift { transform-origin: center; animation: kx-drift 5s ease-in-out infinite; }
.kx .kx-nod { transform-origin: 80% 100%; animation: kx-nod 4s ease-in-out infinite; }
.kx .kx-wobble { transform-origin: 50% 100%; animation: kx-wobble 3.2s ease-in-out infinite; }
.kx .kx-pulse { transform-origin: center; animation: kx-pulse 2.4s ease-in-out infinite; }
.kx .kx-bob { transform-origin: 30% 100%; animation: kx-bob 3.6s ease-in-out infinite; }
.kx .kx-sway, .kx .kx-rustle { transform-origin: 50% 100%; animation: kx-sway 5s ease-in-out infinite; }
.kx .kx-spin { transform-origin: center; animation: kx-spin 0.7s linear infinite; }
.kx .kx-flag { transform-origin: 0% 0%; animation: kx-flag 1.6s ease-in-out infinite; }
.kx .kx-float { transform-origin: center; animation: kx-float 4.2s ease-in-out infinite; }
.kx .kx-glow { transform-origin: center; animation: kx-pulse 1.8s ease-in-out infinite; }
.kx .kx-mane { transform-origin: center; animation: kx-mane 6s ease-in-out infinite; }
.kx .kx-drive { animation: kx-drive 1.6s cubic-bezier(.2,.8,.25,1) 250ms both; }
.kx .kx-hint { animation: kx-hint 1.8s ease-in-out infinite; }
.kx .kx-pop { animation: kx-pop .9s cubic-bezier(.2,.9,.25,1.2) both; }
.kx .kx-up { animation: kx-up .8s cubic-bezier(.2,.7,.2,1) both; }
.kx .kx-confetti { animation: kx-fall linear both; }
.kx .kx-roadline { animation: kx-road 1.2s linear infinite; }
.kx .kx-lamp { animation: kx-lamp 2.2s ease-in-out infinite; }
@keyframes kx-twinkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }
@keyframes kx-drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes kx-nod { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-3deg); } }
@keyframes kx-wobble { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(-3deg); } 40% { transform: rotate(2.5deg); } 55% { transform: rotate(0); } }
@keyframes kx-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes kx-bob { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-4deg); } }
@keyframes kx-sway { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-2deg); } }
@keyframes kx-spin { to { transform: rotate(360deg); } }
@keyframes kx-flag { 0%, 100% { transform: skewY(0); } 50% { transform: skewY(-4deg); } }
@keyframes kx-float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(4px, -8px); } }
@keyframes kx-mane { 0%, 100% { transform: rotate(0) scale(1); } 50% { transform: rotate(4deg) scale(1.03); } }
@keyframes kx-drive { from { transform: translateX(-120%); } to { transform: none; } }
@keyframes kx-hint { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
@keyframes kx-pop { from { opacity: 0; transform: scale(.82) translateY(14px); } }
@keyframes kx-up { from { opacity: 0; transform: translateY(14px); } }
@keyframes kx-fall { 0% { transform: translate(0, -20px) rotate(0); opacity: 1; } 85% { opacity: 1; } 100% { transform: translate(var(--x), 100svh) rotate(var(--r)); opacity: 0; } }
@keyframes kx-road { from { background-position: 0 0; } to { background-position: 0 44px; } }
@keyframes kx-lamp { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
@keyframes kx-popin { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }

/* Dinosaur: the egg hatches. */
.kx .dn-egg { transform-origin: 50% 90%; animation: kx-wobble 2.6s ease-in-out infinite; }
.kx .dn-baby { transform: translateY(64px); }
.kx .dn-crack { stroke-dasharray: 260; stroke-dashoffset: 260; }
.kx .dn-age, .kx .dn-roar { transform-origin: center; transform: scale(0); }
.kx .dn-print { opacity: 0; transform-origin: center; }
.kx.ph-play .dn-egg { animation: dn-shake .14s linear 6, kx-wobble 2.6s ease-in-out .9s infinite; }
.kx.ph-play .dn-crack { animation: dn-crack .6s ease-out .6s forwards; }
.kx.ph-play .dn-cap { animation: dn-cap .8s cubic-bezier(.3,.6,.4,1) 1.25s forwards; transform-origin: center; }
.kx.ph-play .dn-baby { animation: dn-baby .8s cubic-bezier(.2,.9,.3,1.25) 1.5s forwards; }
.kx.ph-play .dn-roar { animation: dn-roar .7s cubic-bezier(.2,.9,.3,1.4) 2.05s forwards; }
.kx.ph-play .dn-age { animation: kx-popin .5s cubic-bezier(.2,.9,.3,1.4) 2.35s forwards; }
.kx.ph-play .dn-print { animation: dn-print .3s ease-out forwards; }
@keyframes dn-shake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-6deg); } 75% { transform: rotate(6deg); } }
@keyframes dn-crack { to { stroke-dashoffset: 0; } }
@keyframes dn-cap { to { transform: translate(-40px, -170px) rotate(-38deg); opacity: 0; } }
@keyframes dn-baby { to { transform: translateY(-46px); } }
@keyframes dn-roar { 0% { transform: scale(0) rotate(-12deg); } 60% { transform: scale(1.18) rotate(4deg); } 100% { transform: scale(1) rotate(-4deg); } }
@keyframes dn-print { from { opacity: 0; transform: scale(1.5); } to { opacity: .75; transform: scale(1); } }

/* Space: three, two, one, lift-off. */
.kx .sp-flame { opacity: 0; transform-origin: 50% 0; }
.kx .sp-smoke circle { transform-origin: center; transform: scale(0); opacity: 0; }
.kx.ph-play .sp-flame { animation: sp-flame .18s ease-in-out 1.6s infinite alternate both; }
.kx.ph-play .sp-rocket { animation: sp-shake .1s linear 1.5s 7, sp-up 1.6s cubic-bezier(.55,0,.7,.4) 2.2s forwards; }
.kx.ph-play .sp-smoke circle { animation: sp-smoke 1.8s ease-out 1.9s forwards; }
.kx .sp-n { opacity: 0; }
.kx.ph-play .sp-n { animation: sp-num .7s ease both; }
.kx.ph-play .sp-go { animation: sp-num .95s ease both; }
@keyframes sp-flame { from { opacity: 1; transform: scaleY(.8); } to { opacity: 1; transform: scaleY(1.25); } }
@keyframes sp-shake { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(2px, -1px); } }
@keyframes sp-up { to { transform: translateY(-560px); } }
@keyframes sp-smoke { 0% { transform: scale(0); opacity: 0; } 30% { opacity: .95; } 100% { transform: scale(2.4); opacity: 0; } }
@keyframes sp-num { 0% { opacity: 0; transform: scale(1.8); } 25% { opacity: 1; transform: scale(1); } 80% { opacity: 1; } 100% { opacity: 0; transform: scale(.9); } }
.kx .sp-button { animation: kx-hint 1.4s ease-in-out infinite; }

/* Superhero: the comic opens, the action bursts. */
.kx .sh-stage { perspective: 900px; }
.kx .sh-sfx, .kx .sh-big { transform-origin: center; transform: scale(0); }
.kx.ph-play .sh-cover { animation: sh-open .85s cubic-bezier(.5,0,.6,1) forwards; transform-origin: 0 50%; }
.kx.ph-play .sh-sfx1 { animation: sh-pop .45s cubic-bezier(.2,.9,.3,1.5) .8s forwards; }
.kx.ph-play .sh-sfx2 { animation: sh-pop .45s cubic-bezier(.2,.9,.3,1.5) 1.25s forwards; }
.kx.ph-play .sh-sfx3 { animation: sh-pop .45s cubic-bezier(.2,.9,.3,1.5) 1.7s forwards; }
.kx.ph-play .sh-big { animation: sh-pop .6s cubic-bezier(.2,.9,.3,1.5) 2.2s forwards; }
.kx.ph-play .sh-stage { animation: sh-jolt .3s ease 2.2s; }
@keyframes sh-open { to { transform: rotateY(-105deg); opacity: .4; } }
@keyframes sh-pop { 0% { transform: scale(0) rotate(-20deg); } 70% { transform: scale(1.2) rotate(6deg); } 100% { transform: scale(1) rotate(0); } }
@keyframes sh-jolt { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-6px, 3px); } 75% { transform: translate(5px, -3px); } }

/* Unicorn: a burst of magic, a rainbow, a unicorn. */
.kx .un-star { transform-origin: center; animation: kx-pulse 1.6s ease-in-out infinite; }
.kx .un-arc { stroke-dasharray: 1; stroke-dashoffset: 1; }
.kx .un-uni { transform: translateX(360px); }
.kx .un-ray, .kx .un-fall { opacity: 0; }
.kx.ph-play .un-star { animation: un-burst .6s ease-out forwards; }
.kx.ph-play .un-ray { animation: un-ray 1s cubic-bezier(.2,.7,.3,1) .1s forwards; }
.kx.ph-play .un-arc { animation: un-draw .9s ease-out forwards; }
.kx.ph-play .un-uni { animation: un-in 1s cubic-bezier(.2,.9,.3,1.2) 1.4s forwards; }
.kx.ph-play .un-fall { animation: un-fall 1.4s ease-in forwards; }
@keyframes un-burst { to { transform: scale(2.4); opacity: 0; } }
@keyframes un-ray { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(var(--tx), var(--ty)); } }
@keyframes un-draw { to { stroke-dashoffset: 0; } }
@keyframes un-in { to { transform: translateX(0); } }
@keyframes un-fall { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(380px) rotate(180deg); } }

/* Jungle: the leaves part, a monkey swings, a roar. */
.kx .jg-swing { opacity: 0; }
.kx .jg-rawr { transform-origin: center; transform: scale(0); }
.kx.ph-play .jg-sign { animation: jg-drop .5s ease-in forwards; transform-origin: 50% 0; }
.kx.ph-play .jg-left { animation: jg-left 1.1s cubic-bezier(.6,0,.3,1) .2s forwards; }
.kx.ph-play .jg-right { animation: jg-right 1.1s cubic-bezier(.6,0,.3,1) .2s forwards; }
.kx.ph-play .jg-swing { animation: jg-swing 1.8s cubic-bezier(.45,0,.4,1) .9s forwards; }
.kx.ph-play .jg-rawr { animation: kx-popin .5s cubic-bezier(.2,.9,.3,1.4) 2.2s forwards; }
@keyframes jg-drop { to { transform: translateY(120px) rotate(14deg); opacity: 0; } }
@keyframes jg-left { to { transform: translateX(-110%); } }
@keyframes jg-right { to { transform: translateX(110%); } }
@keyframes jg-swing { 0% { opacity: 1; transform: rotate(-70deg); } 60% { opacity: 1; transform: rotate(40deg); } 100% { opacity: 1; transform: rotate(18deg); } }

/* Race cars: five lights, lights out, go. */
.kx .rc-light { fill: #3A0D10; }
.kx .rc-lines { opacity: 0; }
.kx .rc-go { opacity: 0; }
${[0, 1, 2, 3, 4].map((k) => {
  const on = ((k * 450) / 2600) * 100
  return `.kx.ph-play .rc-l${k} { animation: rc-on${k} 2.6s linear forwards; }
@keyframes rc-on${k} { 0%, ${on.toFixed(1)}% { fill: #3A0D10; } ${(on + 0.2).toFixed(1)}%, 96% { fill: #FF2D2D; } 96.3%, 100% { fill: #3A0D10; } }`
}).join('\n')}
.kx.ph-play .rc-car { animation: rc-zoom .75s cubic-bezier(.6,0,.9,.6) 2.6s forwards; }
.kx.ph-play .rc-lines { animation: rc-lines .6s ease 2.6s forwards; }
.kx.ph-play .rc-go { animation: sp-num 1s ease 2.5s both; }
@keyframes rc-zoom { to { transform: translateX(170%); } }
@keyframes rc-lines { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .kx *, .kx *::before, .kx *::after { animation: none !important; }
}
`

/** Race Day with a photo: the child's racing licence. */
function Licence({ p, pal, photo }: { p: Party; pal: Palette; photo: string }) {
  const ink = pal.t.ink
  const chk = `repeating-conic-gradient(${ink} 0 25%, #FFFFFF 0 50%) 0 0 / 14px 14px`
  const label: CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: pal.t.soft }
  const big: CSSProperties = { fontFamily: syne.style.fontFamily, fontWeight: 800, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.05 }
  return (
    <div className="mx-auto w-full max-w-[22rem] overflow-hidden" style={{ background: '#FFFFFF', border: `3px solid ${ink}`, borderRadius: 18, boxShadow: `0 6px 0 ${ink}`, color: ink, transform: 'rotate(-1.5deg)' }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: ink, color: '#FFFFFF' }}>
        <span style={{ ...big, fontSize: 13, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Racing licence</span>
        <span style={{ ...big, fontSize: 13, color: pal.t.c, whiteSpace: 'nowrap' }}>No. {p.mark}</span>
      </div>
      <div aria-hidden className="h-3" style={{ background: chk }} />
      <div className="flex gap-4 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={p.name} className="h-[140px] w-[112px] shrink-0 rounded-xl object-cover" style={{ border: `3px solid ${ink}` }} />
        <div className="min-w-0 flex-1 space-y-2">
          <div><p style={label}>Driver</p><p style={{ ...big, fontSize: Math.max(13, Math.min(26, Math.floor(150 / (Array.from(p.first).length * 1.08)))), whiteSpace: 'nowrap' }}>{p.first}</p></div>
          {p.age !== null && <div><p style={label}>Age</p><p style={{ ...big, fontSize: 30, color: pal.t.a }}>{p.age}</p></div>}
          <div><p style={label}>Class</p><p style={{ fontSize: 15, fontWeight: 800 }}>Birthday champion</p></div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pb-3">
        <span className="rotate-[-6deg] rounded-md px-2.5 py-1" style={{ border: `2.5px solid ${pal.t.a}`, color: pal.t.a, ...big, fontSize: 13 }}>Licensed to party</span>
        <svg viewBox="0 0 230 100" className="h-9 w-auto" aria-hidden>
          <path d="M6 70 L16 50 Q24 42 40 42 L84 40 L104 18 Q110 12 122 12 L148 12 Q160 12 166 22 L176 40 L206 44 Q218 46 220 58 L220 72 Q220 78 212 78 L12 78 Q6 78 6 70 Z" fill={pal.a.car} stroke={ink} strokeWidth="5" />
          <circle cx="52" cy="80" r="16" fill={ink} /><circle cx="176" cy="80" r="16" fill={ink} />
        </svg>
      </div>
    </div>
  )
}

/** Super Squad's comic cover, which opens like a book. */
function ComicCover({ p, pal }: { p: Party; pal: Palette }) {
  const { t } = pal
  const comic: CSSProperties = { fontFamily: oswald.style.fontFamily, fontWeight: 700, fontStyle: 'italic', textTransform: 'uppercase' }
  return (
    <div className="sh-cover absolute inset-0 flex flex-col" style={{ background: t.c, backgroundImage: `radial-gradient(${t.ink}22 1.6px, transparent 1.7px)`, backgroundSize: '10px 10px', borderRight: `4px solid ${t.ink}` }}>
      <div className="flex items-stretch justify-between" style={{ background: t.a, borderBottom: `4px solid ${t.ink}` }}>
        <span className="px-3 py-1.5" style={{ ...comic, fontSize: 30, color: '#FFFFFF', letterSpacing: '0.02em', textShadow: `3px 3px 0 ${t.ink}` }}>Super Squad</span>
        <span className="flex flex-col items-center justify-center px-3" style={{ background: '#FFFFFF', borderLeft: `4px solid ${t.ink}`, ...comic, fontStyle: 'normal', color: t.ink, lineHeight: 1 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.12em' }}>ISSUE</span>
          <span style={{ fontSize: 24 }}>#{p.mark}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <svg viewBox="-80 -80 160 160" className="w-32" aria-hidden>
          <polygon points={S.burst(0, 0, 16, 74, 54)} fill={t.a} stroke={t.ink} strokeWidth="4" strokeLinejoin="round" />
          <path d="M10 -46 L-26 6 H-2 L-12 46 L26 -8 H2 L14 -46 Z" fill={t.c} stroke={t.ink} strokeWidth="4" strokeLinejoin="round" />
        </svg>
        <p className="mt-2" style={{ ...comic, fontSize: 18, color: t.ink, letterSpacing: '0.06em' }}>The amazing</p>
        <p className="max-w-full break-words" style={{ ...comic, fontSize: p.first.length > 8 ? 40 : 54, lineHeight: 0.95, color: '#FFFFFF', WebkitTextStroke: `2px ${t.ink}`, textShadow: `4px 4px 0 ${t.ink}` }}>{p.first}!</p>
      </div>
      <p className="px-3 py-2 text-center" style={{ background: '#FFFFFF', borderTop: `4px solid ${t.ink}`, ...comic, fontSize: 15, color: t.ink }}>A birthday adventure</p>
    </div>
  )
}

function KidsParty({ data, eventId, isPreview = false, kind }: InviteProps & { kind: Kind }) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, '')
  const pal = paletteOf(kind, data.palette)
  // Built once per theme and colourway: a skin's cards are components, and a new one on every
  // render (the countdown ticks each second) would rebuild the RSVP under a guest's finger.
  const skin = useMemo(() => skinOf(kind, pal), [kind, pal])
  const p = useParty(data, isPreview, FALLBACK[kind])
  const sound = useSound(data.musicUrl)
  const played = useRef(false)
  const { phase, start } = useOpening(PLAY_MS[kind], () => {
    played.current = true
    sound.start()
  })
  const t = pal.t
  const a = { ...pal.a, ink: pal.a.ink ?? t.ink }
  const display = skin.display

  const scene = (): ReactNode => {
    switch (kind) {
      case 'dinosaur': return <S.DinoScene u={u} a={a} mark={p.mark} />
      case 'space': return <S.SpaceScene u={u} a={a} mark={p.mark} />
      case 'superhero': return <S.HeroScene u={u} a={a} mark={p.mark} />
      case 'unicorn': return <S.UnicornScene u={u} a={a} mark={p.mark} />
      case 'jungle': return <S.JungleScene u={u} a={a} mark={p.mark} />
      case 'cars': return <S.RaceScene u={u} a={a} mark={p.mark} />
    }
  }
  const withPhoto = (photo: string): ReactNode => {
    switch (kind) {
      case 'dinosaur': return <div className="mx-auto w-full max-w-[19rem]"><S.DinoPhoto u={u} a={a} href={photo} mark={p.mark} /></div>
      case 'space': return <div className="mx-auto w-full max-w-[20rem]"><S.SpacePhoto u={u} a={a} href={photo} mark={p.mark} /></div>
      case 'superhero': return <div className="overflow-hidden" style={frame(kind, pal)}><S.HeroPhoto u={u} a={a} href={photo} mark={p.mark} /></div>
      case 'unicorn': return <div className="mx-auto w-full max-w-[20rem]"><S.UnicornPhoto u={u} a={a} href={photo} mark={p.mark} /></div>
      case 'jungle': return <div className="overflow-hidden" style={frame(kind, pal)}><S.JunglePhoto u={u} a={a} href={photo} mark={p.mark} /></div>
      case 'cars': return <Licence p={p} pal={pal} photo={photo} />
    }
  }
  const opening = (): ReactNode => {
    switch (kind) {
      case 'dinosaur': return <S.DinoOpening u={u} a={a} mark={p.mark} />
      case 'space': return <S.SpaceOpening u={u} a={a} />
      case 'superhero': return <div className="sh-stage relative"><S.HeroAction u={u} a={a} mark={p.mark} /><ComicCover p={p} pal={pal} /></div>
      case 'unicorn': return <S.UnicornOpening u={u} a={a} />
      case 'jungle': return <S.JungleOpening u={u} a={a} mark={p.mark} />
      case 'cars': return <S.RaceOpening u={u} a={a} mark={p.mark} />
    }
  }

  return (
    <div
      className={`kx kx-${kind} ph-${phase} relative overflow-x-hidden`}
      style={{ backgroundColor: t.page, color: t.ink, fontFamily: skin.body, containerType: 'inline-size', ['--kx-display' as string]: display } as CSSProperties}
    >
      <style>{CSS}</style>
      {sound.element}
      {phase === 'open' && <SoundButton playing={sound.playing} onToggle={sound.toggle} isPreview={isPreview} t={t} />}

      {phase !== 'open' ? (
        <section
          role="button"
          tabIndex={0}
          aria-label={`${CALL[kind]}: ${p.what}`}
          onClick={start}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() } }}
          className="relative flex flex-col items-center justify-center gap-6 overflow-hidden pb-10 pt-8 outline-none"
          style={{ minHeight: isPreview ? 560 : '100svh', background: pal.hero, color: pal.heroInk, cursor: phase === 'gate' ? 'pointer' : 'default' }}
        >
          <div className="relative w-full max-w-[25rem] px-5">
            <div className="relative overflow-hidden" style={frame(kind, pal)}>
              {opening()}
              {kind === 'space' && (
                <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ fontFamily: display, fontWeight: 800, color: '#FFFFFF', textShadow: `0 0 24px ${t.a}` }}>
                  <span className="sp-n absolute" style={{ fontSize: 120 }}>3</span>
                  <span className="sp-n absolute" style={{ fontSize: 120, animationDelay: '700ms' }}>2</span>
                  <span className="sp-n absolute" style={{ fontSize: 120, animationDelay: '1400ms' }}>1</span>
                  <span className="sp-n sp-go absolute text-center" style={{ fontSize: 40, animationDelay: '2100ms', color: t.a }}>LIFT OFF!</span>
                </div>
              )}
              {kind === 'cars' && (
                <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="rc-go" style={{ fontFamily: display, fontWeight: 800, fontStyle: 'italic', fontSize: 96, color: '#3BE36B', textShadow: '0 0 28px #3BE36B, 4px 4px 0 #14161C' }}>GO!</span>
                </div>
              )}
            </div>
          </div>
          {phase === 'gate' && (
            <>
              {kind === 'space' && (
                <span aria-hidden className="sp-button -my-1 flex h-[86px] w-[86px] items-center justify-center rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #FF7A7A, #D1141B 70%)', border: '6px solid #2A2E55', boxShadow: '0 6px 0 #11142F, 0 0 0 8px rgba(255,255,255,0.08)', fontFamily: display, fontWeight: 800, fontSize: 12, color: '#FFFFFF', letterSpacing: '0.06em' }}>LAUNCH</span>
              )}
              <GateWords p={p} call={CALL[kind]} color={pal.heroInk} soft={pal.heroSoft} display={display} displayStyle={skin.displayStyle} em={skin.em} />
            </>
          )}
        </section>
      ) : (
        <section className="relative flex flex-col justify-center" style={{ minHeight: isPreview ? 560 : '100svh', background: pal.hero, color: pal.heroInk }}>
          {played.current && <Confetti shapes={CONFETTI[kind]} colors={[t.a, t.b, t.c, '#FFFFFF']} />}
          <div className="kx-pop relative mx-auto w-full max-w-[25rem] px-5 pt-10">
            {p.photo ? withPhoto(p.photo) : <div className="overflow-hidden" style={frame(kind, pal)}>{scene()}</div>}
          </div>
          <HeroWords p={p} skin={skin} ink={pal.heroInk} soft={pal.heroSoft} accent={pal.heroAccent} />
          {kind === 'superhero' && (
            <svg viewBox="0 0 360 14" preserveAspectRatio="none" className="absolute bottom-0 left-0 block h-[14px] w-full" aria-hidden>
              <path d={`M0 14 ${Array.from({ length: 19 }, (_, i) => `L${i * 20} ${i % 2 ? 0 : 14}`).join(' ')} L360 14 Z`} fill={t.page} />
            </svg>
          )}
        </section>
      )}

      {phase === 'open' && <PartyBody skin={skin} p={p} data={data} eventId={eventId} isPreview={isPreview} />}
    </div>
  )
}

export function KidsDinosaur(props: InviteProps) {
  return <KidsParty {...props} kind="dinosaur" />
}
export function KidsSpace(props: InviteProps) {
  return <KidsParty {...props} kind="space" />
}
export function KidsSuperhero(props: InviteProps) {
  return <KidsParty {...props} kind="superhero" />
}
export function KidsUnicorn(props: InviteProps) {
  return <KidsParty {...props} kind="unicorn" />
}
export function KidsJungle(props: InviteProps) {
  return <KidsParty {...props} kind="jungle" />
}
export function KidsCars(props: InviteProps) {
  return <KidsParty {...props} kind="cars" />
}
