import Link from 'next/link'
import { LogoMark } from '@/components/brand/Logo'

/**
 * Shown only on invitations published without a purchase — legacy events from
 * the old free tier, and custom requests. No newly published invitation carries
 * it, since every design is now a paid publish.
 */
export default function FreePlanBanner() {
  return (
    <div className="flex w-full items-center justify-between gap-3 border-b border-paper/10 bg-charcoal px-4 py-2.5">
      <p className="flex items-center gap-2 text-[0.78rem] leading-snug text-paper/60">
        <LogoMark className="h-5 w-5" />
        Made with <span className="font-semibold text-gold-soft">ShareInvite</span>
      </p>
      <Link
        href="/create"
        className="shrink-0 whitespace-nowrap rounded-full border border-gold-soft/30 bg-gold-soft/10 px-3 py-1 text-[0.72rem] font-semibold text-gold-soft"
      >
        Create your own
      </Link>
    </div>
  )
}
