'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Image from '@/components/ui/Image'
import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/Icons'
import { Price } from '@/components/price/Price'
import { trackEvent } from '@/lib/analytics'
import { useT } from '@/components/i18n/I18nProvider'
import { rich } from '@/lib/translate'
import { tabKeys } from './tabKeys'
import RajwadaFrame from './RajwadaFrame'

/**
 * "From a beautiful design to an unforgettable invitation": the product,
 * walked through in three steps on one stage.
 *
 *   Choose       the real gallery; a pointer picks Rajwada and its live preview opens.
 *   Personalize  the builder's fields are retyped (names, date, venue, message)
 *                and the phone changes with them. Every phone frame is the real
 *                design rendered with those exact values (public/landing/edit-*).
 *   Share        the invitation goes live, the link goes out on WhatsApp and a
 *                guest's reply comes back.
 *
 * It plays itself while on screen and stops for good once the visitor picks a
 * step. With reduced motion nothing plays: each step shows its finished state.
 */
export interface Pick {
  id: string
  name: string
  image: string
  price: number
  /** A blur of the design, behind its picture until it loads (lib/designPlaceholders). */
  ph?: CSSProperties
}

const STEPS = [
  { key: 'choose', n: '01', title: 'Choose your design', short: 'Choose', copy: 'Browse by occasion, style or price, and open any design in a live preview.' },
  { key: 'personalize', n: '02', title: 'Make it yours', short: 'Personalize', copy: 'Type your names, dates, venue and words. The invitation changes as you type.' },
  { key: 'share', n: '03', title: 'Share it', short: 'Share', copy: 'Publish, get your own link and send it on WhatsApp. Replies come back to you.' },
] as const

export type Field = 'bride' | 'groom' | 'date' | 'time' | 'venue' | 'message'
/** Each edit, and the frame of the real design that shows it. */
const SCRIPT: { field: Field; to: string; frame?: string; before?: string }[] = [
  { field: 'bride', to: 'Meera' },
  { field: 'groom', to: 'Arjun', frame: 'edit-names' },
  { field: 'date', to: '14 Feb 2027' },
  { field: 'time', to: '7:00 PM', frame: 'edit-date' },
  { field: 'venue', to: 'Taj Falaknuma Palace, Hyderabad', frame: 'edit-venue' },
  { field: 'message', before: 'msg-before', to: 'With the blessings of our families, we invite you to Hyderabad to celebrate our wedding with us.', frame: 'msg-after' },
]
const FRAMES = ['rj-names', 'edit-names', 'edit-date', 'edit-venue', 'msg-before', 'msg-after']
const LABEL: Record<Field, string> = { bride: "Bride's name", groom: "Groom's name", date: 'Wedding date', time: 'Time', venue: 'Venue', message: 'Your message' }

// Choose moves on about a second after the design is picked (the pointer taps at ~1.7s, globals.css .hv-pointer).
const DWELL = { choose: 3200, share: 8000 }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`hv-phone !rounded-[2rem] !p-[0.4rem] after:!top-[0.8rem] after:!h-[0.9rem] ${className}`}>
      <div className="hv-screen-box !rounded-[1.65rem]">{children}</div>
    </div>
  )
}

/**
 * `start`: the fields before any edit, from the homepage's one showcase
 * (lib/homeSample.ts), so they match the first phone frame. The edits in
 * SCRIPT are fixed: each frame was rendered with exactly those values.
 */
export default function ProductDemo({ picks, pickIndex, start: START }: { picks: Pick[]; pickIndex: number; start: Record<Field, string> }) {
  const tr = useT()
  const FINAL = { ...START, ...Object.fromEntries(SCRIPT.map((s) => [s.field, s.to])) } as Record<Field, string>
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(0)
  const [held, setHeld] = useState(false)
  const [seen, setSeen] = useState(false)
  // The Personalize frames (~300 KB) load only once the section has been reached.
  const [warm, setWarm] = useState(false)
  useEffect(() => {
    if (seen) setWarm(true)
  }, [seen])
  const [run, setRun] = useState(0)
  const [calm, setCalm] = useState(false)
  // Personalize: the field values, the field being typed into, and the frame shown.
  const [values, setValues] = useState(START)
  const [active, setActive] = useState<Field | null>(null)
  const [selected, setSelected] = useState(false)
  const [frame, setFrame] = useState('rj-names')
  const token = useRef(0)

  useEffect(() => {
    setCalm(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = root.current
    if (!el) return
    // On screen = crossing the middle of the viewport, which also holds for a section taller than the screen (phones).
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { rootMargin: '-30% 0px -30% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const advance = useCallback(() => {
    setOn((i) => (i + 1) % STEPS.length)
    setRun((r) => r + 1)
  }, [])

  // Choose and Share hold for a while, then move on (unless the visitor has taken over).
  const step = STEPS[on].key
  useEffect(() => {
    if (!seen || held || calm || step === 'personalize') return
    const t = window.setTimeout(advance, DWELL[step])
    return () => window.clearTimeout(t)
  }, [seen, held, calm, step, run, advance])

  // Personalize types its edits one after another, the phone following.
  useEffect(() => {
    if (step !== 'personalize') return
    const runs = token
    const my = ++runs.current
    const live = () => runs.current === my
    if (calm) {
      setValues(FINAL)
      setFrame('edit-venue')
      setActive(null)
      return
    }
    if (!seen) return
    ;(async () => {
      setValues(START)
      setFrame('rj-names')
      await sleep(700)
      for (const s of SCRIPT) {
        if (!live()) return
        setActive(s.field)
        if (s.before) {
          setFrame(s.before)
          await sleep(700)
        }
        setSelected(true)
        await sleep(380)
        if (!live()) return
        setSelected(false)
        const per = s.field === 'message' ? 20 : 55
        for (let i = 1; i <= s.to.length; i++) {
          if (!live()) return
          setValues((v) => ({ ...v, [s.field]: s.to.slice(0, i) }))
          await sleep(per)
        }
        await sleep(260)
        if (!live()) return
        if (s.frame) {
          setFrame(s.frame)
          await sleep(1000)
        }
      }
      setActive(null)
      await sleep(2200)
      if (live() && !held) advance()
    })()
    return () => {
      runs.current++
    }
    // `held` is read live at the end; restarting the typing when it flips would be wrong.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, seen, calm, run, advance])

  const choose = (i: number) => {
    // On phones the steps sit below the preview: bring the preview into view so the change is seen.
    const el = preview.current
    if (el && window.matchMedia('(max-width: 1023px)').matches) {
      const r = el.getBoundingClientRect()
      if (r.top < 0 || r.top > window.innerHeight * 0.5) el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' })
    }
    setOn(i)
    setHeld(true)
    setRun((r) => r + 1)
    trackEvent('demo_step', { step: STEPS[i].key, location: 'home_demo' })
  }

  const pick = picks[pickIndex]

  return (
    <section ref={root} id="how-it-works" aria-labelledby="hv-demo-title" className="hv-sec scroll-mt-20 bg-hv-linen">
      <div className="hv-shell">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end" data-reveal>
          <h2 id="hv-demo-title" className="hv-h2 lg:max-w-[38rem]">{tr('From a beautiful design to an unforgettable invitation.')}</h2>
          <p className="hv-lede max-w-[30rem] lg:justify-self-end">
            {tr('Three steps. Your details are saved as you go, and there is nothing to pay until you have seen the finished invitation.')}
          </p>
        </div>

        {/* Phones: the invitation first, then what drives it (the gallery, the form or the chat),
            then the three steps. Wide screens: the steps above the stage, as before. */}
        <div className="flex flex-col">
        {/* The steps: tabs that drive the stage. */}
        <div role="tablist" aria-label={tr('How it works')} onKeyDown={tabKeys(STEPS.length, on, choose, (i) => `hv-demo-tab-${STEPS[i].key}`)} className="order-3 mt-8 grid grid-cols-3 gap-2 sm:gap-6 lg:order-1 lg:mt-16">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              id={`hv-demo-tab-${s.key}`}
              aria-selected={on === i}
              tabIndex={on === i ? 0 : -1}
              aria-controls="hv-demo-stage"
              onClick={() => choose(i)}
              className={`group relative border-t pt-4 text-left transition-colors ${on === i ? 'border-hv-forest/30' : 'border-hv-ink/10 hover:border-hv-ink/25'}`}
            >
              {on === i && (
                <span
                  key={`${on}-${run}-${held}`}
                  aria-hidden
                  className={`absolute left-0 top-[-1px] h-[2px] w-full bg-hv-gold ${!held && seen && !calm && s.key !== 'personalize' ? 'hv-bar' : ''}`}
                  style={{ ['--hv-dur' as string]: `${s.key === 'personalize' ? 0 : DWELL[s.key]}ms` }}
                />
              )}
              <span className={`hv-serif block text-[1.05rem] ${on === i ? 'text-hv-gold-ink' : 'text-hv-muted'}`}>{s.n}</span>
              <span className={`hv-serif mt-1 block text-[1.25rem] font-semibold leading-tight sm:text-[1.6rem] ${on === i ? 'text-hv-ink' : 'text-hv-ink/55 group-hover:text-hv-ink/80'}`}>
                <span className="sm:hidden">{tr(s.short)}</span>
                <span className="max-sm:hidden">{tr(s.title)}</span>
              </span>
              <span className={`mt-2 hidden max-w-[22rem] text-[0.95rem] leading-[1.6] md:block ${on === i ? 'text-hv-muted' : 'text-hv-muted/70'}`}>{tr(s.copy)}</span>
            </button>
          ))}
        </div>
        <p className="order-4 mt-3 text-[0.95rem] leading-[1.6] text-hv-muted md:hidden">{tr(STEPS[on].copy)}</p>

        {/* Phones and tablets: the invitation itself, large and first, following the step. */}
        <div ref={preview} className="order-1 mt-8 flex scroll-mt-20 flex-col items-center lg:hidden" aria-hidden>
          <Phone className="w-[15rem]">
            <RajwadaFrame name="names" />
            <div className="hv-frame absolute inset-0" data-on={step === 'choose' ? '' : undefined}>
              <RajwadaFrame name="closed" />
            </div>
            {FRAMES.filter((f) => f === 'rj-names' || warm || step === 'personalize').map((f) => (
              <div key={f} className="hv-frame absolute inset-0" data-on={step === 'personalize' && frame === f ? '' : undefined}>
                <Image src={`/landing/${f}.webp`} alt="" width={600} height={1298} unoptimized className="hv-fill" />
              </div>
            ))}
            {(warm || step === 'share') && (
              <div className="hv-frame absolute inset-0" data-on={step === 'share' ? '' : undefined}>
                <Image src="/landing/edit-venue.webp" alt="" width={600} height={1298} unoptimized className="hv-fill" />
              </div>
            )}
          </Phone>
          <p className="mt-3 text-center text-[0.9rem] text-hv-muted">
            {step === 'choose'
              ? tr('{name} · live preview', { name: pick?.name ?? 'Rajwada' })
              : step === 'personalize'
                ? tr('The real design, updating as you type')
                : tr('Finished, with its own link to send')}
          </p>
        </div>

        {/* The stage: every panel sits in the same grid cell, so its height never jumps. */}
        <div id="hv-demo-stage" role="tabpanel" aria-labelledby={`hv-demo-tab-${step}`} className="relative order-2 mt-6 grid overflow-hidden rounded-[1.5rem] bg-hv-ivory shadow-[0_40px_80px_-60px_rgba(12,43,34,0.55)] ring-1 ring-hv-ink/5 lg:order-2 lg:mt-8">
          {/* 1  Choose */}
          <div className="hv-stage-item [grid-area:1/1] p-4 sm:p-8 lg:p-10" data-on={step === 'choose' ? '' : undefined}>
            {/* Keyed on `seen` too, so the pointer and the preview play when the visitor arrives, not at page load. */}
            <div key={`c-${run}-${seen}`} className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <div className="flex flex-wrap gap-2 text-[0.85rem]" aria-hidden>
                  {['All occasions', 'Wedding', 'Birthday', 'Engagement'].map((c, i) => (
                    <span key={c} className={`rounded-full px-3.5 py-1.5 ${i === 1 ? 'bg-hv-forest text-hv-ivory' : 'border border-hv-ink/10 text-hv-ink/70'}`}>{tr(c)}</span>
                  ))}
                </div>
                <ul className="mt-4 grid grid-cols-3 gap-3 sm:gap-5 lg:mt-5" aria-label={tr('Some of the designs')}>
                  {picks.map((p, i) => (
                    <li key={p.id} className="relative">
                      <div className={`overflow-hidden rounded-[0.7rem] bg-hv-linen ${i === pickIndex && !calm ? 'hv-picked' : ''}`}>
                        <Image src={p.image} alt="" width={240} height={300} sizes="(max-width: 640px) 30vw, 220px" className="block aspect-[4/5] h-auto w-full object-cover object-top" style={p.ph} />
                      </div>
                      <p className="mt-2 flex items-baseline justify-between gap-2 text-[0.8rem] sm:text-[0.9rem]">
                        <span className="hv-serif truncate text-[0.95rem] font-semibold text-hv-ink sm:text-[1.1rem]">{p.name}</span>
                        <Price inr={p.price} className="shrink-0 text-hv-muted max-sm:hidden" />
                      </p>
                      {i === pickIndex && !calm && (
                        <svg aria-hidden viewBox="0 0 24 24" className="hv-pointer absolute left-[55%] top-[45%] h-7 w-7 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]">
                          <path d="M5 3l14 8-6 1.5L10 19z" fill="#fff" stroke="#25251F" strokeWidth="1.4" strokeLinejoin="round" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center gap-5 max-lg:hidden">
                {/* There from the start: the preview never waits on the pointer animation. */}
                <div className="w-[14.5rem] shrink-0">
                  <Phone>
                    <RajwadaFrame name="closed" alt={tr('{name} in its live preview: the palace gate, waiting to be opened', { name: 'Rajwada' })} />
                  </Phone>
                  <p className="mt-4 text-center text-[0.9rem] text-hv-muted">
                    {rich(tr('{name} · live preview'), { name: <span className="font-semibold text-hv-ink">{pick?.name}</span> })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2  Personalize */}
          <div className="hv-stage-item [grid-area:1/1] p-4 sm:p-8 lg:p-10" data-on={step === 'personalize' ? '' : undefined}>
            <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="relative rounded-[1.1rem] border border-hv-ink/10 bg-white p-4 sm:p-7" aria-hidden>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.95rem] font-semibold text-hv-ink">{tr('{name} · your details', { name: 'Rajwada' })}</p>
                  <p className="flex items-center gap-1.5 text-[0.8rem] text-hv-muted">
                    <CheckIcon className="h-3.5 w-3.5 text-hv-forest" /> {tr('Saved as you go')}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-5 sm:gap-x-4 sm:gap-y-4">
                  {(Object.keys(START) as Field[]).map((f) => (
                    <div key={f} className={f === 'venue' || f === 'message' ? 'col-span-2' : ''}>
                      <p className="text-[0.78rem] font-medium text-hv-muted">{tr(LABEL[f])}</p>
                      <div className={`mt-1 rounded-[0.6rem] border px-3 py-2 text-[0.95rem] text-hv-ink transition-colors sm:mt-1.5 sm:py-2.5 ${f === 'message' ? 'min-h-[3.9rem] leading-[1.5] sm:min-h-[4.6rem]' : 'truncate'} ${active === f ? 'border-hv-forest bg-hv-ivory ring-2 ring-hv-forest/15' : 'border-hv-ink/10'}`}>
                        <span className={active === f && selected ? 'bg-[#B4D5FE]' : ''}>{values[f]}</span>
                        {active === f && !selected && <span className="hv-caret" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex flex-col items-center max-lg:hidden">
                <Phone className="w-[13.5rem] sm:w-[14.5rem]">
                  {/* The starting screen underneath every edit, so a frame still loading never shows black. */}
                  <RajwadaFrame name="names" />
                  {FRAMES.filter((f) => f === 'rj-names' || warm || step === 'personalize').map((f) => (
                    <div key={f} className="hv-frame absolute inset-0" data-on={frame === f ? '' : undefined}>
                      <Image src={`/landing/${f}.webp`} alt="" width={600} height={1298} unoptimized className="hv-fill" />
                    </div>
                  ))}
                </Phone>
                <p className="mt-4 text-center text-[0.9rem] text-hv-muted">{tr('The real design, updating as you type')}</p>
              </div>
            </div>
          </div>

          {/* 3  Share */}
          <div className="hv-stage-item [grid-area:1/1] p-4 sm:p-8 lg:p-10" data-on={step === 'share' ? '' : undefined}>
            {(warm || step === 'share') && (
            <div key={`s-${run}-${seen}`} className="grid items-center gap-8 lg:grid-cols-[1fr_1.5fr]">
              <div className="relative flex justify-center max-lg:hidden">
                <Phone className="w-[14.5rem]">
                  <Image src="/landing/edit-venue.webp" alt="" width={600} height={1298} unoptimized className="hv-fill" />
                </Phone>
                <div className={`absolute -right-2 top-[18%] w-[15rem] rounded-[1rem] bg-white p-4 shadow-[0_30px_60px_-30px_rgba(12,43,34,0.6)] ${calm ? '' : 'hv-pop'}`} style={{ animationDelay: '.3s' }}>
                  <p className="flex items-center gap-2 text-[0.9rem] font-semibold text-hv-forest">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-hv-forest text-white"><CheckIcon className="h-3 w-3" /></span>
                    {tr('Your invitation is live')}
                  </p>
                  <p className="mt-2 truncate rounded-md bg-hv-linen px-2.5 py-1.5 text-[0.85rem] text-hv-ink">shareinvite.in/e/meera-arjun</p>
                  <p className="mt-3 flex gap-2 text-[0.8rem] font-semibold">
                    <span className="flex-1 rounded-full bg-[#25D366] py-1.5 text-center text-white">WhatsApp</span>
                    <span className="flex-1 rounded-full border border-hv-ink/15 py-1.5 text-center text-hv-ink">{tr('Copy link')}</span>
                  </p>
                </div>
              </div>

              {/* The host's chat with one guest: the link out, the RSVP back. */}
              <div className="mx-auto w-full max-w-[34rem] overflow-hidden rounded-[1.1rem] bg-[#EFE7DE] shadow-[0_30px_60px_-40px_rgba(12,43,34,0.6)]" aria-hidden>
                <div className="flex items-center gap-3 bg-[#008069] px-4 py-2.5 text-white sm:py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3D9C4] text-[0.8rem] font-semibold text-[#7A3E2B]">KI</span>
                  <span className="leading-tight">
                    <span className="block text-[0.95rem] font-semibold">Kavya Iyer</span>
                    <span className="block text-[0.75rem] opacity-80">{tr('online')}</span>
                  </span>
                </div>
                <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-5">
                  <div className={`ml-auto max-w-[78%] rounded-[0.8rem] rounded-tr-none bg-[#D9FDD3] p-1.5 shadow-sm ${calm ? '' : 'hv-pop'}`} style={{ animationDelay: '1.1s' }}>
                    <div className="overflow-hidden rounded-[0.55rem] bg-[#F0F2F5]">
                      <div className="relative aspect-[2.5/1] overflow-hidden sm:aspect-[1.9/1]">
                        <Image src="/landing/edit-venue.webp" alt="" width={600} height={1298} unoptimized className="absolute inset-x-0 top-[-9%] h-auto w-full" />
                      </div>
                      <p className="px-2.5 pt-2 text-[0.85rem] font-semibold text-[#111B21]">{tr('Wedding Invitation · {couple}', { couple: 'Meera & Arjun' })}</p>
                      <p className="px-2.5 pb-2 text-[0.75rem] text-[#667781]">shareinvite.in</p>
                    </div>
                    <p className="px-1.5 pt-1.5 text-[0.85rem] text-[#027EB5]">shareinvite.in/e/meera-arjun</p>
                    <p className="px-1.5 text-right text-[0.7rem] text-[#667781]">11:04 am ✓✓</p>
                  </div>
                  <div className={`max-w-[82%] rounded-[0.8rem] rounded-tl-none bg-white px-3 py-2 text-[0.9rem] leading-[1.45] text-[#111B21] shadow-sm ${calm ? '' : 'hv-pop'}`} style={{ animationDelay: '3s' }}>
                    {tr('Namaste! This is our reply to the invitation for {couple}’s wedding: joyfully attending, three of us.', { couple: 'Meera & Arjun' })}
                    <span className="block text-right text-[0.7rem] text-[#667781]">11:26 am</span>
                  </div>
                  <p className={`mx-auto w-fit rounded-full bg-white/85 px-3 py-1 text-[0.75rem] font-medium text-[#54656F] ${calm ? '' : 'hv-pop'}`} style={{ animationDelay: '3.6s' }}>
                    {tr('Sent from the Reply button on the invitation')}
                  </p>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>

        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:mt-10" data-reveal>
          <TrackedLink href="/create" location="home_demo" className="hv-btn w-full sm:w-auto">
            {tr('Create your invitation')}
            <ArrowRightIcon className="h-4 w-4" />
          </TrackedLink>
          <TrackedLink href="/templates" location="home_demo_browse" className="hv-textlink">
            {tr('Or browse every design')}
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
