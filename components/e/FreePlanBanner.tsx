import { guestLink } from '@/lib/guestLink'
import { LogoMark } from '@/components/brand/Logo'

/** The banner's height: the page leaves this much room for it, and moves a design's top buttons below it. */
export const FREE_BANNER_PX = 44

/**
 * The top strip of an invitation published free (lib/freeInvites.ts), with FreeBranding: shown
 * until the host buys the design. Also on legacy events from the old free tier, and custom requests.
 *
 * `pinned` (the live invitation): fixed to the top above everything, openings included, so it stays
 * in view the whole time; app/e/[slug] leaves FREE_BANNER_PX of room for it and sets --invite-top so
 * the design's music button sits below it. Without `pinned` it is an ordinary strip (the builder's
 * preview draws it over the phone itself).
 */
export default function FreePlanBanner({ pinned = false }: { pinned?: boolean }) {
  return (
    <div
      className={`flex w-full items-center justify-between gap-3 border-b border-paper/10 bg-charcoal px-4 ${pinned ? 'fixed inset-x-0 top-0' : ''}`}
      style={{ height: FREE_BANNER_PX, ...(pinned ? { zIndex: 2147482000 } : {}) }}
    >
      <p className="flex items-center gap-2 text-[0.78rem] leading-snug text-paper/70">
        <LogoMark className="h-5 w-5" />
        Made free with <span className="font-semibold text-gold-soft">ShareInvite</span>
      </p>
      <a
        href={guestLink('/create', 'free_banner')}
        className="shrink-0 whitespace-nowrap rounded-full border border-gold-soft/30 bg-gold-soft/10 px-3 py-1 text-[0.72rem] font-semibold text-gold-soft"
      >
        Make yours
      </a>
    </div>
  )
}
