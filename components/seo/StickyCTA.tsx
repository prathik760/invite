import Link from 'next/link'

export default function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(34,27,23,0.10)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">Create a WhatsApp-ready invitation</p>
          <p className="text-xs text-muted">Free to start with RSVP, wishes, maps, music, and gallery.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/digital-invitation"
            className="hidden rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-foreground sm:inline-flex"
          >
            Live Demo
          </Link>
          <Link href="/create" className="gold-button rounded-xl px-4 py-2 text-xs font-semibold sm:px-5">
            Start Free
          </Link>
        </div>
      </div>
    </div>
  )
}
