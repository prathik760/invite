import { Caveat } from 'next/font/google'

/**
 * Handwriting for the homepage's margin notes. Loaded only by the homepage
 * (next/font scopes it to the routes that import this module), and used for a
 * handful of short notes — never for anything a visitor has to read to act.
 */
const caveat = Caveat({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' })

type Arrow = 'down-right' | 'down-left' | 'down' | 'up' | 'right' | 'left' | 'none'

/** A short handwritten note with a pen-drawn arrow, as if added in the margin. */
export function HandNote({
  children,
  arrow = 'down-right',
  className = '',
  arrowClassName = '',
  color = 'text-burnished-deep',
  size = 'text-[1.45rem]',
}: {
  children: React.ReactNode
  arrow?: Arrow
  className?: string
  arrowClassName?: string
  /** Text colour and size classes; separate so they never compete with `className`. */
  color?: string
  size?: string
}) {
  return (
    <span className={`${caveat.className} pointer-events-none inline-flex select-none items-start gap-1 leading-[1.05] ${size} ${color} ${className}`}>
      {(arrow === 'left' || arrow === 'up') && <PenArrow arrow={arrow} className={arrowClassName} />}
      <span className="text-balance">{children}</span>
      {arrow !== 'none' && arrow !== 'left' && arrow !== 'up' && <PenArrow arrow={arrow} className={arrowClassName} />}
    </span>
  )
}

/** The signature at the end of the founder's note. */
export function Signature({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`${caveat.className} ${className}`}>{children}</span>
}

// Arrows are drawn once as slightly uneven curves, the way a pen goes.
const ARROWS: Record<Exclude<Arrow, 'none'>, { box: string; line: string; head: string; size: string }> = {
  'down-right': { box: '0 0 64 60', line: 'M4 6 C 22 4, 40 12, 47 30 S 52 48, 54 53', head: 'M45 47 L54 54 L58 43', size: 'h-[3.4rem] w-[3.6rem]' },
  'down-left': { box: '0 0 64 60', line: 'M60 6 C 42 4, 24 12, 17 30 S 12 48, 10 53', head: 'M19 47 L10 54 L6 43', size: 'h-[3.4rem] w-[3.6rem]' },
  down: { box: '0 0 40 64', line: 'M18 4 C 26 18, 12 34, 20 56', head: 'M13 49 L20 57 L26 48', size: 'h-[3.6rem] w-[2.3rem]' },
  up: { box: '0 0 40 64', line: 'M22 60 C 12 46, 28 30, 20 8', head: 'M13 16 L20 7 L27 15', size: 'h-[3.4rem] w-[2.2rem]' },
  right: { box: '0 0 72 36', line: 'M4 24 C 20 10, 42 8, 64 17', head: 'M55 9 L65 17 L55 24', size: 'h-[2rem] w-[4rem]' },
  left: { box: '0 0 72 36', line: 'M68 24 C 52 10, 30 8, 8 17', head: 'M17 9 L7 17 L17 24', size: 'h-[2rem] w-[4rem]' },
}

function PenArrow({ arrow, className }: { arrow: Exclude<Arrow, 'none'>; className?: string }) {
  const a = ARROWS[arrow]
  return (
    <svg aria-hidden viewBox={a.box} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${a.size} ${className ?? ''}`}>
      <path d={a.line} pathLength={1} className="hand-stroke" />
      <path d={a.head} pathLength={1} className="hand-stroke hand-stroke-late" />
    </svg>
  )
}

/** A pen underline that draws itself under a word or two. */
export function PenUnderline({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 300 18" preserveAspectRatio="none" fill="none" className={`pointer-events-none absolute left-0 w-full ${className}`}>
      <path d="M3 12 C 58 5, 118 3, 176 8 S 262 14, 297 6" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" pathLength={1} className="hand-stroke" />
    </svg>
  )
}
