import { OCCASIONS } from '@/lib/catalog'

/**
 * A slow ribbon of the occasions ShareInvite covers. The list is rendered twice
 * so the track can loop seamlessly by sliding exactly half its width; the copy
 * is aria-hidden so screen readers hear the list once.
 */
export default function Marquee({
  items = [...OCCASIONS.map((o) => o.label), 'Diwali', 'Ganesh Chaturthi', 'Raksha Bandhan', 'Proposals', 'Valentines'],
  tone = 'paper',
}: {
  items?: string[]
  tone?: 'paper' | 'emerald'
}) {
  const dark = tone === 'emerald'
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className={`whitespace-nowrap px-6 font-editorial text-[1.7rem] italic ${dark ? 'text-paper/85' : 'text-charcoal/80'}`}>
            {item}
          </span>
          <span className={`spark-twinkle text-[0.9rem] ${dark ? 'text-gold-soft' : 'text-burnished'}`} aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div
      className={`marquee relative overflow-hidden border-y py-4 ${dark ? 'border-paper/10 bg-emerald' : 'border-line bg-paper'}`}
      aria-label="Occasions"
    >
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
      <div aria-hidden className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r ${dark ? 'from-emerald' : 'from-paper'} to-transparent`} />
      <div aria-hidden className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l ${dark ? 'from-emerald' : 'from-paper'} to-transparent`} />
    </div>
  )
}
