import Link from 'next/link'

/**
 * Shown only on invitations published without a purchase — legacy events from
 * the old free tier, and custom requests. No newly published invitation carries
 * it, since every template is now a paid publish.
 */
export default function FreePlanBanner() {
  return (
    <div
      className="w-full flex items-center justify-between gap-3 px-4 py-2.5"
      style={{
        background: '#221B17',
        borderBottom: '1px solid rgba(217,164,65,0.15)',
      }}
    >
      <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.50)' }}>
        Made with{' '}
        <span className="font-semibold" style={{ color: '#D9A441' }}>ShareInvite</span>
      </p>
      <Link
        href="/pricing"
        className="shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap"
        style={{
          background: 'rgba(217,164,65,0.15)',
          color: '#D9A441',
          border: '1px solid rgba(217,164,65,0.25)',
        }}
      >
        Remove →
      </Link>
    </div>
  )
}
