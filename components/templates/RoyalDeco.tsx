'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'
import { PortraitRow } from './PortraitRow'

const BZ = [0.22, 1, 0.36, 1] as [number, number, number, number]

// ── Two-zone color palette: Navy (dark) + Parchment (light) ──────────────────
const R = {
  // ── DARK zones: hero, proclamation doc frame, footer ──────────────────────
  navyBg:        '#150F44',
  navyBgDeep:    '#0C0A2C',
  navyCard:      '#1C1660',
  navyCardRich:  '#231D78',
  // text on navy
  ivory:         '#EDE0BC',
  ivoryM:        'rgba(237,224,188,0.60)',
  ivoryF:        'rgba(237,224,188,0.28)',
  ivoryS:        'rgba(237,224,188,0.10)',
  // gold on navy
  goldD:         '#C89028',
  goldDm:        'rgba(200,144,40,0.62)',
  goldDf:        'rgba(200,144,40,0.08)',
  goldDborder:   'rgba(200,144,40,0.24)',
  goldDglow:     'rgba(200,144,40,0.11)',

  // ── LIGHT zones: all body sections ────────────────────────────────────────
  cream:         '#F7EDD6',
  creamAlt:      '#F1E4C4',
  creamCard:     '#FEF9EC',
  creamCardRich: '#F9F1DA',
  // text on cream
  ink:           '#1C1006',
  inkM:          'rgba(28,16,6,0.60)',
  inkF:          'rgba(28,16,6,0.30)',
  inkS:          'rgba(28,16,6,0.12)',
  // gold on cream
  goldL:         '#9A6508',
  goldLm:        'rgba(154,101,8,0.62)',
  goldLf:        'rgba(154,101,8,0.08)',
  goldLborder:   'rgba(154,101,8,0.28)',
  goldLglow:     'rgba(154,101,8,0.12)',
  // navy accent on cream
  navyA:         '#150F44',
  navyAm:        'rgba(21,15,68,0.55)',
  navyAborder:   'rgba(21,15,68,0.16)',

  // ── Parchment doc (inside proclamation) ───────────────────────────────────
  parchment:     '#F2E4C0',
  parchmentAlt:  '#EDD8A8',
  parchmentText: '#2A1A04',
  parchmentMuted:'rgba(42,26,4,0.60)',
}

// ── Pre-computed gold dust (28 particles) ────────────────────────────────────
const DUST = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: `${((i * 3.64 + 7.2) % 100).toFixed(1)}%`,
  y: `${((i * 2.18 + 4) % 28).toFixed(1)}%`,
  size: 0.85 + (i % 5) * 0.30,
  dur: `${(9.5 + (i % 6) * 2.2).toFixed(1)}s`,
  delay: `${((i * 0.97) % 12).toFixed(1)}s`,
  drift: ((i % 7) - 3) * 16,
}))

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseList(v?: string) {
  if (!v) return []
  return v.split('\n').map(s => s.trim()).filter(Boolean)
}

function useCountdown(dateStr?: string, timeStr?: string) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  if (!dateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const target = new Date(`${dateStr}T${timeStr || '00:00'}:00`).getTime()
  const diff = Math.max(0, target - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-55px' },
    transition: { duration: 0.85, delay, ease: BZ },
  } as const
}

// ── CSS keyframes ────────────────────────────────────────────────────────────
const RoyalDecoStyles = memo(function RoyalDecoStyles() {
  return (
    <style>{`
      @keyframes rd-dust {
        0%   { transform:translateY(0) translateX(0) scale(1); opacity:0; }
        8%   { opacity:0.85; }
        82%  { opacity:0.32; }
        100% { transform:translateY(-500px) translateX(var(--rd,0px)) scale(0.18); opacity:0; }
      }
      @keyframes rd-shimmer {
        0%   { background-position:210% center; }
        100% { background-position:-210% center; }
      }
      @keyframes rd-pulseD {
        0%,100% { box-shadow:0 0 0 1px rgba(200,144,40,0.16),0 0 20px rgba(200,144,40,0.07); }
        50%      { box-shadow:0 0 0 1px rgba(200,144,40,0.32),0 0 38px rgba(200,144,40,0.16); }
      }
      @keyframes rd-pulseL {
        0%,100% { box-shadow:0 2px 18px rgba(21,15,68,0.10),0 0 0 1px rgba(154,101,8,0.20); }
        50%      { box-shadow:0 4px 32px rgba(21,15,68,0.18),0 0 0 1px rgba(154,101,8,0.36); }
      }
      @keyframes rd-glow {
        0%,100% { filter:drop-shadow(0 0 10px rgba(200,144,40,0.30)); }
        50%      { filter:drop-shadow(0 0 26px rgba(200,144,40,0.58)); }
      }
    `}</style>
  )
})

// ── Gold dust particles (hero only) ──────────────────────────────────────────
const GoldDustParticles = memo(function GoldDustParticles() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {DUST.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{
          left:p.x, bottom:p.y,
          width:`${p.size}px`, height:`${p.size}px`,
          background:'radial-gradient(circle,#EFC455 0%,#C8902A 50%,rgba(200,144,42,0.22) 100%)',
          boxShadow:`0 0 ${p.size * 6}px rgba(200,144,42,0.65)`,
          '--rd':`${p.drift}px`,
          animationName:'rd-dust', animationDuration:p.dur, animationDelay:p.delay,
          animationIterationCount:'infinite', animationTimingFunction:'ease-out',
        } as React.CSSProperties} />
      ))}
    </div>
  )
})

// ── Subtle hatch texture (both zones) ────────────────────────────────────────
const ZoneTexture = memo(function ZoneTexture({ dark = false }: { dark?: boolean }) {
  const lineA = dark ? 'rgba(200,144,40,0.022)' : 'rgba(154,101,8,0.038)'
  const lineB = dark ? 'rgba(255,255,255,0.008)' : 'rgba(0,0,0,0.020)'
  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden style={{
      backgroundImage: `repeating-linear-gradient(45deg,${lineA} 0px,${lineA} 1px,transparent 1px,transparent 22px),repeating-linear-gradient(-45deg,${lineB} 0px,${lineB} 1px,transparent 1px,transparent 22px)`,
      zIndex: 1,
    }} />
  )
})

// ── Art Deco double corner brackets ──────────────────────────────────────────
function DecoCorners({ size=20, color, offset=0 }: { size?:number; color:string; offset?:number }) {
  const o=`${offset}px`, b=`1.5px solid ${color}`
  return (
    <>
      <div className="absolute pointer-events-none" style={{top:o,left:o,width:size,height:size,borderTop:b,borderLeft:b}} aria-hidden />
      <div className="absolute pointer-events-none" style={{top:o,right:o,width:size,height:size,borderTop:b,borderRight:b}} aria-hidden />
      <div className="absolute pointer-events-none" style={{bottom:o,left:o,width:size,height:size,borderBottom:b,borderLeft:b}} aria-hidden />
      <div className="absolute pointer-events-none" style={{bottom:o,right:o,width:size,height:size,borderBottom:b,borderRight:b}} aria-hidden />
    </>
  )
}

function DecoFrame({ dark = false }: { dark?: boolean }) {
  const outer = dark ? R.goldDborder : R.goldLborder
  const inner = dark ? 'rgba(200,144,40,0.08)' : 'rgba(154,101,8,0.10)'
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <DecoCorners size={22} color={outer} offset={0} />
      <DecoCorners size={13} color={inner} offset={7} />
    </div>
  )
}

// ── Ornamental divider ────────────────────────────────────────────────────────
function DecoDivider({ className='', dark=false }: { className?:string; dark?:boolean }) {
  const line = dark ? R.goldDborder : R.goldLborder
  const diamond = dark ? R.goldD : R.goldL
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden>
      <div className="flex-1 h-px" style={{background:`linear-gradient(90deg,transparent,${line})`}} />
      <span style={{color:diamond, fontSize:'9px', letterSpacing:'5px'}}>◆ ◆ ◆</span>
      <div className="flex-1 h-px" style={{background:`linear-gradient(90deg,${line},transparent)`}} />
    </div>
  )
}

// ── Palace card — light (cream) and dark (navy) variants ─────────────────────
function PalaceCard({ children, className='', glow=false, dark=false }: {
  children: React.ReactNode; className?: string; glow?: boolean; dark?: boolean
}) {
  const bg = dark
    ? `linear-gradient(150deg,${R.navyCardRich} 0%,${R.navyCard} 100%)`
    : `linear-gradient(150deg,${R.creamCardRich} 0%,${R.creamCard} 100%)`
  const border = dark ? R.goldDborder : R.goldLborder
  const inset  = dark ? 'rgba(200,144,40,0.10)' : 'rgba(154,101,8,0.12)'
  const shadow = dark
    ? `inset 0 1px 0 rgba(200,144,40,0.12),0 6px 40px rgba(0,0,0,0.55)${glow?`,0 0 48px ${R.goldDglow}`:''}`
    : `inset 0 1px 0 rgba(154,101,8,0.10),0 2px 20px rgba(21,15,68,0.10)${glow?`,0 0 30px ${R.goldLglow}`:''}`
  return (
    <div className={`relative overflow-hidden ${className}`} style={{
      background:bg, border:`1px solid ${border}`, borderRadius:'2px', boxShadow:shadow,
      animationName:glow?(dark?'rd-pulseD':'rd-pulseL'):undefined,
      animationDuration:'4s', animationIterationCount:glow?'infinite':undefined,
    } as React.CSSProperties}>
      <div className="pointer-events-none absolute inset-[5px]" aria-hidden
        style={{border:`1px solid ${inset}`, borderRadius:'1px'}} />
      {children}
    </div>
  )
}

// ── Section heading — light or dark context ───────────────────────────────────
function RoyalSectionHead({ roman, title, dark=false }: { roman:string; title:string; dark?:boolean }) {
  const lineColor = dark ? R.goldDborder : R.goldLborder
  const romanColor = dark ? R.goldDm : R.goldLm
  const titleGrad = dark
    ? `linear-gradient(135deg,#886012 0%,${R.goldD} 25%,#F0C045 52%,${R.goldD} 75%,#886012 100%)`
    : `linear-gradient(135deg,#5A3806 0%,${R.goldL} 25%,#C07810 52%,${R.goldL} 75%,#5A3806 100%)`
  return (
    <div className="text-center mb-10 sm:mb-14">
      <motion.div {...reveal(0)} className="flex items-center justify-center gap-3 mb-3.5">
        <div className="h-px flex-1 max-w-[70px] sm:max-w-[90px]"
          style={{background:`linear-gradient(90deg,transparent,${lineColor})`}} />
        <span className="text-[8px] uppercase tracking-[0.52em]" style={{color:romanColor}}>{roman}</span>
        <div className="h-px flex-1 max-w-[70px] sm:max-w-[90px]"
          style={{background:`linear-gradient(90deg,${lineColor},transparent)`}} />
      </motion.div>
      <motion.h2 {...reveal(0.08)} className="font-heading text-2xl sm:text-3xl md:text-4xl" style={{
        background:titleGrad, backgroundSize:'200% auto',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
        filter:dark?`drop-shadow(0 0 18px rgba(200,144,40,0.30))`:`drop-shadow(0 0 0px transparent)`,
      }}>{title}</motion.h2>
      <motion.div {...reveal(0.16)}>
        <DecoDivider className="mt-5 max-w-xs mx-auto" dark={dark} />
      </motion.div>
    </div>
  )
}

// ── Music button ──────────────────────────────────────────────────────────────
function MusicButton({ src, dark=false }: { src:string; dark?:boolean }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    audioRef.current = new Audio(src)
    audioRef.current.loop = true
    return () => { audioRef.current?.pause(); audioRef.current = null }
  }, [src])
  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
  }, [playing])
  const border = dark ? R.goldDborder : R.goldLborder
  const color  = dark ? R.goldDm      : R.goldLm
  return (
    <button onClick={toggle}
      className="inline-flex items-center gap-2.5 px-4 py-2 transition-opacity hover:opacity-80"
      style={{border:`1px solid ${border}`, background:`rgba(0,0,0,0.04)`, borderRadius:'2px', color}}>
      {playing
        ? <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="1.5" y="1" width="3" height="9" rx="0.8"/><rect x="6.5" y="1" width="3" height="9" rx="0.8"/></svg>
        : <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M2 1.5l8 4-8 4V1.5z"/></svg>}
      <span className="text-[9px] uppercase tracking-[0.26em]">{playing ? 'Pause' : 'Play Music'}</span>
    </button>
  )
}

// ── RSVP / Wishes ─────────────────────────────────────────────────────────────
function RoyalWishes({ eventId }: { eventId:string }) {
  const [wishes, setWishes] = useState<Array<{id:string;name:string;message:string}>>([])
  const [name, setName] = useState(''); const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const MAX = 320

  useEffect(() => {
    if (eventId === '__preview__') return
    fetch(`/api/wishes?eventId=${eventId}`).then(r=>r.json()).then(d=>setWishes(Array.isArray(d)?d:[])).catch(()=>{})
  }, [eventId])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    if (eventId === '__preview__') { setSent(true); return }
    setBusy(true); setErr('')
    try {
      const res = await fetch('/api/wishes',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({eventId,name:name.trim(),message:msg.trim()})})
      if (!res.ok) throw new Error()
      setSent(true); setName(''); setMsg('')
    } catch { setErr('Could not send. Please try again.') } finally { setBusy(false) }
  }

  return (
    <section style={{background:R.cream, borderTop:`1px solid ${R.goldLborder}`}}>
      <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-xl mx-auto">
          <RoyalSectionHead roman="Chapter VIII" title="Leave Your Blessing" />
          <motion.div {...reveal(0.1)}>
            <PalaceCard className="mb-8 p-5 sm:p-8" glow>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="ty" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="text-center py-8 sm:py-12">
                    <div className="text-3xl select-none mb-5" style={{color:R.goldL}} aria-hidden>⚜</div>
                    <p className="font-heading text-xl sm:text-2xl mb-3" style={{color:R.ink}}>Blessing Received</p>
                    <p className="text-sm leading-relaxed mb-6" style={{color:R.inkM}}>Your blessing has been received with honour.<br/>It shall appear once approved.</p>
                    <button onClick={()=>setSent(false)} className="text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70" style={{color:R.goldLm}}>
                      Send another blessing →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onSubmit={onSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.30em] mb-2.5" style={{color:R.inkM}}>Your Name</label>
                      <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Meera & Arjun" required
                        className="w-full bg-transparent border-0 border-b py-2.5 text-sm focus:outline-none transition-all"
                        style={{color:R.ink, borderBottom:`1px solid ${R.navyAborder}`}}
                        onFocus={e=>(e.currentTarget.style.borderBottomColor=R.goldLm)}
                        onBlur={e=>(e.currentTarget.style.borderBottomColor=R.navyAborder)} />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.30em] mb-2.5" style={{color:R.inkM}}>Your Blessing</label>
                      <textarea value={msg} onChange={e=>setMsg(e.target.value.slice(0,MAX))} placeholder="May your union be blessed with joy and prosperity…" required rows={4}
                        className="w-full bg-transparent border-0 border-b py-2.5 text-sm focus:outline-none resize-none transition-all"
                        style={{color:R.ink, borderBottom:`1px solid ${R.navyAborder}`}}
                        onFocus={e=>(e.currentTarget.style.borderBottomColor=R.goldLm)}
                        onBlur={e=>(e.currentTarget.style.borderBottomColor=R.navyAborder)} />
                      <div className="flex justify-end mt-1">
                        <span className="text-[9px] tabular-nums" style={{color:MAX-msg.length<=40?'#C03030':R.inkF}}>{MAX-msg.length} left</span>
                      </div>
                    </div>
                    {err && <p className="text-xs" style={{color:'#C03030'}}>{err}</p>}
                    <motion.button type="submit" disabled={busy}
                      whileHover={{scale:busy?1:1.015}} whileTap={{scale:busy?1:0.985}}
                      className="w-full py-3.5 text-[11px] tracking-[0.22em] uppercase font-medium transition-all disabled:opacity-50"
                      style={{
                        background:`linear-gradient(135deg,rgba(21,15,68,0.07),rgba(21,15,68,0.04))`,
                        border:`1px solid ${R.goldLborder}`, color:R.goldL, borderRadius:'2px',
                        boxShadow:`0 0 20px ${R.goldLglow}`,
                      }}>
                      {busy ? 'Sending…' : 'Send Blessing ◆'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </PalaceCard>
          </motion.div>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.map((w,i) => (
                <motion.div key={w.id} {...reveal(i*.07)}>
                  <PalaceCard className="px-5 sm:px-7 py-5">
                    <div className="font-heading select-none leading-none mb-2.5"
                      style={{fontSize:'2.8rem',color:`rgba(154,101,8,0.10)`,marginTop:'-0.2rem'}} aria-hidden>&ldquo;</div>
                    <p className="text-sm italic leading-relaxed mb-4" style={{color:R.inkM}}>{w.message}</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 flex items-center justify-center text-[10px] shrink-0"
                        style={{background:R.goldLf, border:`1px solid ${R.goldLborder}`, color:R.goldL, borderRadius:'2px'}}>
                        {w.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-xs tracking-wider" style={{color:R.goldLm}}>{w.name}</p>
                    </div>
                  </PalaceCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props { data: Record<string,string>; eventId?: string; isPreview?: boolean }

export default function RoyalDeco({ data, eventId = '__preview__', isPreview = false }: Props) {
  const groomName = data.groomName || 'Arjun'
  const brideName = data.brideName || 'Ananya'
  const { date, time, venue, venueAddress, mapsUrl, dressCode, schedule, galleryImages, musicUrl, message, coupleStory, groomFamilyDetails, brideFamilyDetails } = data

  const formattedDate = useMemo(() => formatDate(date), [date])
  const formattedTime = useMemo(() => formatTime(time), [time])
  const gallery = useMemo(() => parseList(galleryImages), [galleryImages])
  const sched   = useMemo(() => parseList(schedule), [schedule])
  const { days, hours, minutes, seconds } = useCountdown(date, time)
  const year = date ? new Date(date + 'T00:00:00').getFullYear() : new Date().getFullYear()

  const groomInitial = groomName.charAt(0).toUpperCase()
  const brideInitial = brideName.charAt(0).toUpperCase()

  const handleWhatsApp = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = encodeURIComponent(`You are cordially invited to the Royal Wedding of ${groomName} & ${brideName}. View invitation: ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }, [groomName, brideName])

  const details = [
    { label:'Auspicious Date', value:formattedDate },
    { label:'Ceremony Time',   value:formattedTime },
    ...(venue     ? [{ label:'Royal Venue',  value:venue, sub:venueAddress }] : []),
    ...(dressCode ? [{ label:'Royal Attire', value:dressCode              }] : []),
  ].filter(d => d.value)

  // Hero name style — metallic italic shimmer on navy bg
  const nameStyle: React.CSSProperties = {
    fontSize: isPreview ? '1.95rem' : 'clamp(2.3rem,11vw,8rem)',
    lineHeight: 0.96, fontStyle: 'italic',
    overflowWrap: 'break-word', wordBreak: 'break-word',
    background: 'linear-gradient(110deg,#6E4A08 0%,#C8902A 16%,#EDCC5C 32%,#E0B43A 44%,#F8E07A 51%,#E0B43A 58%,#EDCC5C 66%,#C8902A 82%,#6E4A08 100%)',
    backgroundSize: '240% auto',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
    filter:'drop-shadow(0 0 36px rgba(200,144,42,0.44)) drop-shadow(0 4px 18px rgba(0,0,0,0.90))',
    animationName:'rd-shimmer', animationDuration:'5.5s',
    animationTimingFunction:'linear', animationIterationCount:'infinite',
  }

  return (
    <div className="relative font-body" style={{background:R.cream, color:R.ink, overflowX:'hidden'}}>
      <RoyalDecoStyles />

      {/* ── HERO — Deep Royal Navy, Palace Gates Opening ──────────────────────*/}
      <section
        className={`relative flex ${isPreview?'min-h-[440px] py-12':'min-h-screen'} flex-col items-center justify-center overflow-hidden text-center`}
        style={{
          background:`
            radial-gradient(ellipse 60% 55% at 50% -4%,  rgba(200,144,42,0.20)  0%, transparent 60%),
            radial-gradient(ellipse 85% 60% at 50% 50%,  rgba(30,22,88,0.70)    0%, transparent 72%),
            radial-gradient(ellipse 100% 55% at 50% 110%,rgba(12,10,44,0.96)    0%, transparent 56%),
            ${R.navyBg}
          `,
        }}>
        <ZoneTexture dark />
        {!isPreview && <GoldDustParticles />}

        {/* Palace gate panels */}
        {!isPreview && (
          <>
            <motion.div className="pointer-events-none absolute inset-y-0 left-0 z-20"
              initial={{x:'0%'}} animate={{x:'-101%'}}
              transition={{duration:2.0, delay:0.4, ease:BZ}}
              style={{width:'50.5%', background:R.navyBgDeep}} aria-hidden>
              <div className="absolute inset-y-0 right-0 w-[1.5px]"
                style={{background:`linear-gradient(to bottom,transparent,${R.goldDborder},#C89028,${R.goldDborder},transparent)`}} />
              <div className="absolute inset-y-0 right-3 w-px opacity-30"
                style={{background:`linear-gradient(to bottom,transparent,${R.goldDborder},transparent)`}} />
              <div className="absolute top-1/2 right-4 -translate-y-1/2"
                style={{width:'8px',height:'8px',background:R.navyBgDeep,border:`1px solid ${R.goldDborder}`,transform:'translateY(-50%) rotate(45deg)',boxShadow:`0 0 12px rgba(200,144,40,0.4)`}} aria-hidden />
            </motion.div>
            <motion.div className="pointer-events-none absolute inset-y-0 right-0 z-20"
              initial={{x:'0%'}} animate={{x:'101%'}}
              transition={{duration:2.0, delay:0.4, ease:BZ}}
              style={{width:'50.5%', background:R.navyBgDeep}} aria-hidden>
              <div className="absolute inset-y-0 left-0 w-[1.5px]"
                style={{background:`linear-gradient(to bottom,transparent,${R.goldDborder},#C89028,${R.goldDborder},transparent)`}} />
              <div className="absolute inset-y-0 left-3 w-px opacity-30"
                style={{background:`linear-gradient(to bottom,transparent,${R.goldDborder},transparent)`}} />
              <div className="absolute top-1/2 left-4 -translate-y-1/2"
                style={{width:'8px',height:'8px',background:R.navyBgDeep,border:`1px solid ${R.goldDborder}`,transform:'translateY(-50%) rotate(45deg)',boxShadow:`0 0 12px rgba(200,144,40,0.4)`}} aria-hidden />
            </motion.div>
          </>
        )}

        {/* Preview bars */}
        {isPreview && (
          <>
            <div className="pointer-events-none absolute top-0 inset-x-0 z-20" style={{height:'14px',background:R.navyBgDeep}} aria-hidden />
            <div className="pointer-events-none absolute bottom-0 inset-x-0 z-20" style={{height:'14px',background:R.navyBgDeep}} aria-hidden />
          </>
        )}

        {/* Vignettes */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[3]"
          style={{width:'clamp(36px,9vw,110px)',background:'linear-gradient(90deg,rgba(12,10,44,0.86),transparent)'}} aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[3]"
          style={{width:'clamp(36px,9vw,110px)',background:'linear-gradient(270deg,rgba(12,10,44,0.86),transparent)'}} aria-hidden />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 z-[4]"
          style={{height:'28%',background:`linear-gradient(to top,rgba(12,10,44,0.96) 0%,transparent 100%)`}} aria-hidden />

        {/* Content — fades in after gate opens */}
        <motion.div
          initial={{opacity: isPreview ? 1 : 0}}
          animate={{opacity:1}}
          transition={{duration:1.2, delay: isPreview?0:1.25, ease:BZ}}
          className="relative z-[5] flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6">

          {/* Deco border overlay */}
          {!isPreview && (
            <motion.div initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}}
              transition={{duration:1.0,delay:1.6}}
              className="pointer-events-none absolute inset-x-6 sm:inset-x-10 inset-y-6" aria-hidden>
              <DecoFrame dark />
            </motion.div>
          )}

          {/* Badge */}
          <motion.div initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}}
            transition={{duration:0.9,delay:isPreview?0:1.45}}
            className="mb-5 sm:mb-7 inline-flex items-center gap-2.5 px-5 py-2"
            style={{border:`1px solid ${R.goldDborder}`,background:'rgba(200,144,40,0.06)',borderRadius:'2px',boxShadow:`0 0 22px ${R.goldDglow}`}}>
            <span style={{color:R.goldD,fontSize:'7px'}}>◆</span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.54em]" style={{color:R.goldDm}}>A Royal Wedding Invitation</span>
            <span style={{color:R.goldD,fontSize:'7px'}}>◆</span>
          </motion.div>

          {/* Monogram */}
          <motion.div initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}}
            transition={{duration:0.7,delay:isPreview?0:1.6,ease:[0.34,1.56,0.64,1]}}
            className="mb-5 sm:mb-7 flex items-center justify-center"
            style={{
              width:isPreview?'60px':'clamp(60px,9vw,84px)',
              height:isPreview?'60px':'clamp(60px,9vw,84px)',
              borderRadius:'50%',
              border:`1.5px solid ${R.goldDborder}`,
              background:'radial-gradient(circle,rgba(200,144,40,0.12) 0%,rgba(200,144,40,0.04) 60%,transparent 100%)',
              boxShadow:`0 0 28px rgba(200,144,40,0.20)`,
              animationName:'rd-glow',animationDuration:'3.2s',animationIterationCount:'infinite',
            } as React.CSSProperties}>
            <span className="font-heading italic select-none" style={{
              fontSize:isPreview?'1.05rem':'clamp(1.05rem,3.2vw,1.8rem)',
              background:`linear-gradient(135deg,${R.goldD} 0%,#F0C045 50%,${R.goldD} 100%)`,
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            }}>{groomInitial} &amp; {brideInitial}</span>
          </motion.div>

          {/* Music */}
          {musicUrl && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.7,delay:isPreview?0:1.7}} className="mb-6 sm:mb-8">
              <MusicButton src={musicUrl} dark />
            </motion.div>
          )}

          <PortraitRow data={data} dark={true} />

          {/* Groom name */}
          <motion.h1 initial={{opacity:0,y:36}} animate={{opacity:1,y:0}}
            transition={{duration:1.5,delay:isPreview?0:1.45,ease:BZ}}
            className="font-heading select-none" style={nameStyle}>{groomName}</motion.h1>

          {/* Ampersand */}
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
            transition={{duration:0.7,delay:isPreview?0:1.9,ease:BZ}}
            className="select-none my-2 sm:my-3">
            <span className="font-heading italic" style={{
              fontSize:isPreview?'1.3rem':'clamp(1.4rem,4vw,3rem)',
              color:R.ivory,
              filter:`drop-shadow(0 0 12px rgba(200,144,40,0.35))`,
            }}>&amp;</span>
          </motion.div>

          {/* Bride name */}
          <motion.h1 initial={{opacity:0,y:36}} animate={{opacity:1,y:0}}
            transition={{duration:1.5,delay:isPreview?0:2.05,ease:BZ}}
            className="font-heading select-none" style={nameStyle}>{brideName}</motion.h1>

          {/* Divider */}
          <motion.div initial={{opacity:0,scaleX:0}} animate={{opacity:1,scaleX:1}}
            transition={{duration:1.0,delay:isPreview?0:2.45,ease:BZ}}
            className="mt-7 sm:mt-9 mb-5 sm:mb-6 w-full max-w-xs sm:max-w-md">
            <DecoDivider dark />
          </motion.div>

          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.0,delay:isPreview?0:2.6}}
            className="mb-2.5 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.52em]" style={{color:R.goldD}}>
            Together In Eternity
          </motion.p>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.0,delay:isPreview?0:2.75}}
            className="text-xs sm:text-sm uppercase tracking-[0.28em]" style={{color:R.ivoryM}}>
            {formattedDate || String(year)}
          </motion.p>
          {venue && (
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.9,delay:isPreview?0:2.9}}
              className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-[0.22em]" style={{color:R.ivoryF}}>
              {venue}
            </motion.p>
          )}
        </motion.div>

        {/* Scroll cue */}
        {!isPreview && (
          <motion.div animate={{opacity:[0,.5,0],y:[0,8,0]}} transition={{duration:2.2,delay:3.6,repeat:Infinity,ease:'easeInOut'}}
            className="absolute bottom-20 z-[5]" aria-hidden>
            <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke={R.goldDm} strokeWidth={1.3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 2v14m0 0l-3.5-4m3.5 4l3.5-4"/>
            </svg>
          </motion.div>
        )}
      </section>

      {/* ── ROYAL PROCLAMATION — parchment doc on navy bg ────────────────────*/}
      <section style={{background:R.navyBg, borderTop:`1px solid ${R.goldDborder}`}}
        className={`relative px-4 sm:px-6 md:px-8 ${isPreview?'py-8':'py-14 sm:py-20 md:py-24'} overflow-hidden`}>
        <ZoneTexture dark />
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{
          background:'radial-gradient(ellipse 70% 55% at 50% 50%,rgba(200,144,40,0.05) 0%,transparent 65%)',
        }} />
        <div className="relative max-w-2xl mx-auto">
          <motion.div {...reveal(0)} className="flex items-center justify-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 px-5 py-2.5"
              style={{border:`1px solid rgba(200,144,40,0.18)`,background:'rgba(200,144,40,0.04)',borderRadius:'2px'}}>
              <span style={{color:R.goldD,fontSize:'7px'}}>◆</span>
              <span className="text-[8px] uppercase tracking-[0.50em]" style={{color:R.goldDm}}>Royal Proclamation</span>
              <span style={{color:R.goldD,fontSize:'7px'}}>◆</span>
            </div>
          </motion.div>

          <motion.div {...reveal(0.12)}>
            {/* Parchment document — warm cream inside the navy frame */}
            <div className="relative overflow-hidden" style={{
              background:R.parchment,
              border:`2px solid ${R.goldDborder}`,
              borderRadius:'3px',
              boxShadow:`0 0 0 1px rgba(0,0,0,0.30),0 12px 80px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.40)`,
            }}>
              {/* Parchment paper texture */}
              <div className="pointer-events-none absolute inset-0" aria-hidden style={{
                backgroundImage:`repeating-linear-gradient(0deg,rgba(0,0,0,0.012) 0px,rgba(0,0,0,0.012) 1px,transparent 1px,transparent 28px)`,
              }} />
              {/* Left binding shadow */}
              <div className="pointer-events-none absolute top-0 bottom-0 left-0" aria-hidden
                style={{width:'28px',background:'linear-gradient(90deg,rgba(0,0,0,0.10),transparent)'}} />
              {/* Inner double border */}
              <div className="pointer-events-none absolute inset-[6px]" aria-hidden
                style={{border:`1px solid rgba(154,101,8,0.22)`,borderRadius:'2px'}} />

              {/* Header band */}
              <div className="px-5 sm:px-9 pt-6 pb-3 text-center"
                style={{borderBottom:`1px solid rgba(154,101,8,0.18)`,background:`rgba(154,101,8,0.05)`}}>
                <div className="flex items-center justify-center gap-3 mb-2" aria-hidden>
                  <div className="flex-1 h-px max-w-[100px]" style={{background:`linear-gradient(90deg,transparent,rgba(154,101,8,0.30))`}} />
                  <span style={{color:R.goldL,fontSize:'10px',letterSpacing:'4px'}}>◆ ◆ ◆</span>
                  <div className="flex-1 h-px max-w-[100px]" style={{background:`linear-gradient(90deg,rgba(154,101,8,0.30),transparent)`}} />
                </div>
                <p style={{fontFamily:'"Times New Roman",Georgia,serif',fontSize:'8px',letterSpacing:'0.44em',color:R.goldLm,textTransform:'uppercase'}}>
                  Royal Gazette — House of {groomName.split(' ')[0]} &amp; House of {brideName.split(' ')[0]}
                </p>
              </div>

              {/* Body */}
              <div className="px-6 sm:px-12 py-9 sm:py-12">
                <div className="text-center mb-8 sm:mb-10">
                  <p style={{fontFamily:'"Times New Roman",Georgia,serif',fontSize:'8px',letterSpacing:'0.44em',color:R.parchmentMuted,marginBottom:'10px',textTransform:'uppercase'}}>
                    Be It Known to All
                  </p>
                  <h3 className="font-heading text-xl sm:text-2xl md:text-3xl mb-4 italic" style={{
                    background:`linear-gradient(135deg,#5A3806 0%,${R.goldL} 28%,#C07810 52%,${R.goldL} 72%,#5A3806 100%)`,
                    WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                  }}>By Royal Command, the Union is Proclaimed</h3>
                  <DecoDivider className="max-w-[200px] mx-auto" />
                </div>

                <div className="space-y-5 sm:space-y-6" style={{fontFamily:'"Times New Roman",Georgia,serif'}}>
                  <p className="text-center text-[11px] sm:text-sm tracking-[0.22em] uppercase leading-loose" style={{color:R.parchmentMuted}}>
                    The Honourable Families Hereby Announce<br/>The Auspicious Union of
                  </p>
                  <div className="text-center py-2">
                    {[groomName, brideName].map((n, i) => (
                      <span key={n}>
                        {i === 1 && <span className="block font-heading italic" style={{fontSize:'1rem',color:R.goldLm,margin:'4px 0'}}>&amp;</span>}
                        <span className="font-heading italic" style={{
                          fontSize:isPreview?'1.5rem':'clamp(1.5rem,5vw,2.6rem)',
                          background:`linear-gradient(135deg,${R.goldL} 0%,#C07810 50%,${R.goldL} 100%)`,
                          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                        }}>{n}</span>
                      </span>
                    ))}
                  </div>
                  <div className="space-y-4 sm:space-y-5 pt-2">
                    <p className="text-sm sm:text-[15px] leading-[1.95] italic" style={{color:'rgba(42,26,4,0.68)'}}>
                      &ldquo;It is hereby declared, on the authority of the Royal Houses assembled, that this union shall be solemnized with full honours and sacred ceremony. The stars have been consulted. The omens are auspicious. The heavens are in accord.
                    </p>
                    <p className="text-sm sm:text-[15px] leading-[1.95]" style={{color:'rgba(42,26,4,0.60)'}}>
                      Let it be known that on <strong style={{color:R.goldL}}>{formattedDate || `the sacred day of ${year}`}</strong>, at the grand hall of <strong style={{color:R.goldL}}>{venue || 'the Royal Palace'}</strong>, two noble souls shall be bound by the ancient and sacred covenant of matrimony.
                    </p>
                    <p className="text-sm sm:text-[15px] leading-[1.95]" style={{color:'rgba(42,26,4,0.60)'}}>
                      <strong style={{color:R.goldL}}>{groomName}</strong>, of distinguished honour and noble bearing — and <strong style={{color:R.goldL}}>{brideName}</strong>, whose grace and virtue are beyond measure — are hereby joined by the sacred rites of our forebears, witnessed by all the heavens above.
                    </p>
                    <p className="text-sm sm:text-[15px] leading-[1.95] italic" style={{color:'rgba(42,26,4,0.48)'}}>
                      All noble guests are respectfully commanded to grace this occasion with their most honoured presence. Your blessings are the crown upon this union.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mt-10 sm:mt-12 pt-6 flex items-end justify-between gap-4"
                  style={{borderTop:`1px solid rgba(154,101,8,0.16)`}}>
                  <div>
                    <p style={{fontFamily:'monospace',fontSize:'8px',color:R.parchmentMuted,letterSpacing:'0.28em'}}>
                      — BY ORDER OF THE ROYAL FAMILIES
                    </p>
                    <p style={{fontFamily:'monospace',fontSize:'7px',color:'rgba(42,26,4,0.28)',letterSpacing:'0.20em',marginTop:'3px'}}>
                      ISSUED IN THE YEAR OF OUR LORD, {year}
                    </p>
                  </div>
                  {/* Wax seal */}
                  <div className="shrink-0 flex items-center justify-center" style={{
                    width:'48px',height:'48px',
                    background:`radial-gradient(circle,rgba(154,101,8,0.18) 0%,rgba(154,101,8,0.06) 55%,transparent 100%)`,
                    border:`1px solid rgba(154,101,8,0.28)`,borderRadius:'50%',
                    boxShadow:`0 0 20px rgba(154,101,8,0.12)`,
                  }}>
                    <span aria-hidden style={{color:R.goldLm,fontSize:'18px',lineHeight:1}}>⚜</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── COUPLE STORY — warm cream ────────────────────────────────────────*/}
      {coupleStory && (
        <section style={{background:R.creamAlt, borderTop:`1px solid ${R.goldLborder}`}}
          className={`relative px-4 sm:px-6 md:px-8 ${isPreview?'py-8':'py-12 sm:py-16 md:py-20'} overflow-hidden`}>
          <ZoneTexture />
          <div className="relative max-w-2xl mx-auto">
            <RoyalSectionHead roman="Chapter II" title="Our Love Story" />
            <motion.div {...reveal(0.12)}>
              <PalaceCard className="p-6 sm:p-9" glow>
                <div className="font-heading select-none leading-none mb-2"
                  style={{fontSize:'4rem',color:`rgba(154,101,8,0.10)`,marginTop:'-0.5rem'}} aria-hidden>&ldquo;</div>
                <p className="font-heading text-base sm:text-lg md:text-xl italic leading-relaxed text-center"
                  style={{color:R.inkM}}>{coupleStory}</p>
                <DecoDivider className="mt-6 mb-4 max-w-xs mx-auto" />
                <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-center" style={{color:R.goldLm}}>
                  — {groomName} &amp; {brideName}
                </p>
              </PalaceCard>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── COUNTDOWN — cream ────────────────────────────────────────────────*/}
      {date && (
        <section style={{background:R.cream, borderTop:`1px solid ${R.goldLborder}`}}
          className={`px-4 sm:px-6 md:px-8 ${isPreview?'py-7':'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-lg mx-auto">
            <RoyalSectionHead roman="Chapter III" title="Counting the Days" />
            <div className={`grid gap-3 sm:gap-4 ${isPreview?'grid-cols-2':'grid-cols-2 sm:grid-cols-4'}`}>
              {[{v:days,l:'Days'},{v:hours,l:'Hours'},{v:minutes,l:'Mins'},{v:seconds,l:'Secs'}].map(({v,l},i) => (
                <motion.div key={l} {...reveal(i*.07)}>
                  <PalaceCard className="flex flex-col items-center justify-center py-6 sm:py-8" glow>
                    <div className="absolute inset-x-0 bottom-0 h-[2px]" aria-hidden style={{
                      background:`linear-gradient(90deg,transparent 20%,${R.goldL} 50%,transparent 80%)`,
                    }} />
                    <span className="font-heading tabular-nums" style={{
                      fontSize:isPreview?'1.9rem':'clamp(2rem,7vw,3.2rem)',lineHeight:1,
                      background:`linear-gradient(175deg,#C07810 0%,${R.goldL} 45%,#5A3806 100%)`,
                      WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                    }}>{String(v).padStart(2,'0')}</span>
                    <span className="mt-2 text-[8px] sm:text-[9px] uppercase tracking-[0.24em]" style={{color:R.inkF}}>{l}</span>
                  </PalaceCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EVENT DETAILS — cream alt ────────────────────────────────────────*/}
      {details.length > 0 && (
        <section style={{background:R.creamAlt, borderTop:`1px solid ${R.goldLborder}`}}
          className={`px-4 sm:px-6 md:px-8 ${isPreview?'py-7':'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-2xl mx-auto">
            <RoyalSectionHead roman="Chapter IV" title="The Royal Command" />
            <div className={`grid gap-3 sm:gap-4 ${isPreview?'grid-cols-1':'grid-cols-1 sm:grid-cols-2'}`}>
              {details.map((d,i) => (
                <motion.div key={d.label} {...reveal(i*.07)}>
                  <PalaceCard className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-0.5" style={{color:R.goldL,fontSize:'8px',paddingTop:'3px'}}>◆</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.32em] mb-1.5" style={{color:R.goldLm}}>{d.label}</p>
                        <p className="font-heading text-base sm:text-lg break-words" style={{color:R.ink}}>{d.value}</p>
                        {d.sub && <p className="mt-1 text-[11px] sm:text-xs leading-relaxed" style={{color:R.inkM}}>{d.sub}</p>}
                      </div>
                    </div>
                  </PalaceCard>
                </motion.div>
              ))}
            </div>
            {mapsUrl && (
              <motion.div {...reveal(0.3)} className="mt-5 sm:mt-6">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 text-xs uppercase tracking-[0.22em] transition-all hover:opacity-75"
                  style={{border:`1px solid ${R.goldLborder}`,background:R.goldLf,color:R.goldL,borderRadius:'2px'}}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" d="M10 3C7.2 3 5 5.2 5 8c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z"/>
                    <circle cx="10" cy="8" r="2"/>
                  </svg>
                  View on Map
                </a>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ── SCHEDULE — cream ─────────────────────────────────────────────────*/}
      {sched.length > 0 && (
        <section style={{background:R.cream, borderTop:`1px solid ${R.goldLborder}`}}
          className={`px-4 sm:px-6 md:px-8 ${isPreview?'py-7':'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-lg mx-auto">
            <RoyalSectionHead roman="Chapter V" title="The Day's Proceedings" />
            <div className="relative">
              <div className="absolute left-[20px] sm:left-[22px] top-3 bottom-3" aria-hidden
                style={{width:'1px',background:`linear-gradient(to bottom,transparent,${R.goldLborder},transparent)`}} />
              <div className="space-y-5">
                {sched.map((item,i) => (
                  <motion.div key={i} {...reveal(i*.08)} className="flex items-start gap-4 sm:gap-5 pl-1">
                    <div className="shrink-0 relative z-[1] flex items-center justify-center"
                      style={{width:'40px',height:'40px',minWidth:'40px'}}>
                      <div style={{
                        width:'10px',height:'10px',
                        background:R.cream,border:`1.5px solid ${R.goldL}`,
                        transform:'rotate(45deg)',boxShadow:`0 0 8px rgba(154,101,8,0.30)`,
                      }} />
                    </div>
                    <PalaceCard className="flex-1 p-4 sm:p-5">
                      <p className="text-sm leading-relaxed" style={{color:R.inkM}}>{item}</p>
                    </PalaceCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY — cream alt ──────────────────────────────────────────────*/}
      {gallery.length > 0 && (
        <section style={{background:R.creamAlt, borderTop:`1px solid ${R.goldLborder}`}}
          className={`px-4 sm:px-6 md:px-8 ${isPreview?'py-7':'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-2xl mx-auto">
            <RoyalSectionHead roman="Chapter VI" title="The Royal Portrait" />
            <div className={`grid gap-3 sm:gap-4 ${isPreview?'grid-cols-2':'grid-cols-2 sm:grid-cols-3'}`}>
              {gallery.map((url,i) => (
                <motion.div key={i} {...reveal(i*.06)}>
                  <div className="relative overflow-hidden aspect-[4/5]" style={{
                    border:`1px solid ${R.goldLborder}`,borderRadius:'2px',
                    boxShadow:'0 4px 20px rgba(21,15,68,0.12)',
                  }}>
                    <DecoFrame />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div className="pointer-events-none absolute inset-0" aria-hidden style={{
                      background:'linear-gradient(to top,rgba(21,15,68,0.30) 0%,transparent 40%)',
                    }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAMILY — cream ───────────────────────────────────────────────────*/}
      {(groomFamilyDetails || brideFamilyDetails) && (
        <section style={{background:R.cream, borderTop:`1px solid ${R.goldLborder}`}}
          className={`px-4 sm:px-6 md:px-8 ${isPreview?'py-7':'py-12 sm:py-16 md:py-20'}`}>
          <div className="max-w-2xl mx-auto">
            <RoyalSectionHead roman="Chapter VII" title="The Noble Families" />
            <div className={`grid gap-4 sm:gap-5 ${isPreview?'grid-cols-1':'grid-cols-1 sm:grid-cols-2'}`}>
              {groomFamilyDetails && (
                <motion.div {...reveal(0)}>
                  <PalaceCard className="p-5 sm:p-7">
                    <p className="text-[9px] uppercase tracking-[0.34em] mb-4" style={{color:R.goldLm}}>◆ {groomName}&rsquo;s Family</p>
                    <p className="text-sm leading-relaxed" style={{color:R.inkM}}>{groomFamilyDetails}</p>
                  </PalaceCard>
                </motion.div>
              )}
              {brideFamilyDetails && (
                <motion.div {...reveal(0.08)}>
                  <PalaceCard className="p-5 sm:p-7">
                    <p className="text-[9px] uppercase tracking-[0.34em] mb-4" style={{color:R.goldLm}}>◆ {brideName}&rsquo;s Family</p>
                    <p className="text-sm leading-relaxed" style={{color:R.inkM}}>{brideFamilyDetails}</p>
                  </PalaceCard>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── WISHES ───────────────────────────────────────────────────────────*/}
      {eventId && <RoyalWishes eventId={eventId} />}

      {/* ── FOOTER — back to deep navy ────────────────────────────────────────*/}
      <footer style={{background:R.navyBg, borderTop:`1px solid ${R.goldDborder}`}}
        className={`relative px-4 sm:px-6 md:px-8 ${isPreview?'py-8':'py-14 sm:py-20'} overflow-hidden`}>
        <ZoneTexture dark />
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{
          background:'radial-gradient(ellipse 70% 60% at 50% 100%,rgba(200,144,40,0.08) 0%,transparent 62%)',
        }} />
        <div className="relative max-w-sm mx-auto text-center">
          <motion.div {...reveal(0)}>
            <div className="inline-flex items-center justify-center mx-auto mb-6" style={{
              width:'68px',height:'68px',borderRadius:'50%',
              border:`1px solid ${R.goldDborder}`,
              background:'radial-gradient(circle,rgba(200,144,40,0.12) 0%,transparent 65%)',
              boxShadow:`0 0 32px rgba(200,144,40,0.16)`,
            }}>
              <span className="font-heading italic text-xl select-none" style={{
                background:`linear-gradient(135deg,${R.goldD} 0%,#F0C045 50%,${R.goldD} 100%)`,
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
              }}>{groomInitial}&amp;{brideInitial}</span>
            </div>
            <DecoDivider className="mb-6 max-w-[180px] mx-auto" dark />
          </motion.div>
          <motion.div {...reveal(0.08)}>
            <p className="font-heading text-xl sm:text-2xl italic mb-2" style={{color:R.ivory}}>
              {groomName} &amp; {brideName}
            </p>
            <p className="text-xs uppercase tracking-[0.28em] mb-8" style={{color:R.ivoryF}}>
              {formattedDate || String(year)}
            </p>
          </motion.div>
          {message && (
            <motion.div {...reveal(0.14)}>
              <PalaceCard className="p-5 sm:p-7 mb-8 text-center" dark>
                <p className="text-sm italic leading-relaxed" style={{color:R.ivoryM}}>{message}</p>
              </PalaceCard>
            </motion.div>
          )}
          {!isPreview && (
            <motion.button onClick={handleWhatsApp} {...reveal(0.2)}
              whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              className="w-full py-4 mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-all"
              style={{
                background:`linear-gradient(135deg,rgba(200,144,40,0.14),rgba(200,144,40,0.08))`,
                border:`1px solid ${R.goldDborder}`,color:R.goldD,borderRadius:'2px',
                boxShadow:`0 0 28px ${R.goldDglow}`,
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
            </motion.button>
          )}
          <p className="text-[9px] sm:text-[10px] tracking-[0.24em]" style={{color:R.ivoryS}}>Made with ShareInvite</p>
        </div>
      </footer>
    </div>
  )
}
