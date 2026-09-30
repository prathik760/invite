/**
 * The ShareInvite mark: an emerald seal with an invitation card, stamped with a
 * spark, rising out of an open envelope — an invitation on its way.
 *
 * Inline SVG rather than an image so it is sharp at every size, costs no
 * request, and can switch tone on dark bands. The same geometry is exported as
 * /public/brand/mark-*.png for favicons and structured data.
 */
export function LogoMark({ className = 'h-9 w-9', title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <circle cx="24" cy="24" r="23" fill="#052E20" />
      <circle cx="24" cy="24" r="19.6" fill="none" stroke="#E8C866" strokeOpacity="0.35" strokeWidth="0.9" />
      {/* The invitation card, rising out of the envelope. */}
      <rect x="16.4" y="11.4" width="15.2" height="20.5" rx="1.6" fill="#E8C866" />
      <path d="M24 14.6l1 2.45 2.45 1-2.45 1L24 21.5l-1-2.45-2.45-1 2.45-1z" fill="#052E20" />
      {/* Envelope pocket, drawn last so it hides the lower half of the card. */}
      <path
        d="M12.4 22.4 24 30.4 35.6 22.4V32.9a2.5 2.5 0 0 1-2.5 2.5H14.9a2.5 2.5 0 0 1-2.5-2.5Z"
        fill="#052E20"
        stroke="#E8C866"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Logo({
  tone = 'dark',
  className = '',
  markClassName = 'h-9 w-9',
}: {
  /** `dark` text for light backgrounds, `light` text for emerald/charcoal. */
  tone?: 'dark' | 'light'
  className?: string
  markClassName?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      <span
        className={`font-editorial text-[1.65rem] font-semibold leading-none tracking-tight ${
          tone === 'dark' ? 'text-charcoal' : 'text-paper'
        }`}
      >
        Share<em className={`font-medium ${tone === 'dark' ? 'text-burnished' : 'text-gold-soft'}`}>Invite</em>
      </span>
    </span>
  )
}
