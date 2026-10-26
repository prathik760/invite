import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import { displayName } from '@/lib/catalog'
import { templateImage } from '@/lib/templateMedia'
import { TEMPLATES } from '@/modules/templates/data'

/** A spread of occasions, so the fan shows the range rather than five weddings. */
const FAN = ['signature-saptapadi', 'birthday-mirrorball', 'griha-pravesh', 'diwali-party', 'signature-nikah']

/** Where each card sits in the fan: rotation, sideways offset, drop. */
const POSE = [
  'left-[0%] top-[14%] -rotate-[13deg]',
  'left-[19%] top-[5%] -rotate-[6deg]',
  'left-[38%] top-[2%] z-10 rotate-0',
  'left-[57%] top-[5%] rotate-[6deg]',
  'left-[76%] top-[14%] rotate-[13deg]',
]

/**
 * Five real designs fanned out like a hand of cards, beside the closing line.
 * Laptop only: on a phone the closing is just the line and the button.
 */
export default function ClosingFan() {
  const ids = FAN.filter((id) => TEMPLATES.some((t) => t.id === id))
  return (
    <Link
      href="/templates"
      prefetch={false}
      aria-label="Browse designs"
      className="group relative hidden h-[19rem] w-full lg:block"
    >
      {ids.map((id, i) => (
        <span
          key={id}
          className={`absolute block w-[24%] origin-bottom bg-paper p-[5px] shadow-[0_1px_2px_rgba(30,39,38,0.08),0_18px_30px_-18px_rgba(30,39,38,0.55)] transition-transform duration-500 ease-out group-hover:-translate-y-2 ${POSE[i]}`}
        >
          <span className="relative block aspect-[4/5] overflow-hidden bg-peach">
            <Image src={templateImage(id)} alt={`${displayName(TEMPLATES.find((t) => t.id === id)!.name)} invitation design`} fill sizes="180px" className="object-cover" />
          </span>
        </span>
      ))}
    </Link>
  )
}
