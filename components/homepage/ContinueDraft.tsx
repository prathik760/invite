'use client'

import { useEffect, useState } from 'react'
import TrackedLink from '@/components/ui/TrackedLink'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * A quiet line back for a returning visitor, read from this device only:
 *  - an invitation half-made here: the builder saves its draft to
 *    localStorage (app/create, DRAFT_KEY) and restores it on /create;
 *  - otherwise, a signed-in host with published invitations: the dashboard
 *    leaves their count ('si-host') when it loads them and clears it on sign
 *    out, and every invitation there can be edited until its event.
 * Nothing shows for anyone else, and nothing is fetched or sent.
 */
export default function ContinueDraft({ names }: { names?: Record<string, string> }) {
  const tr = useT()
  const [line, setLine] = useState<{ text: string; href: string; cta: string; location: string } | null>(null)
  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem('invitely-draft') || 'null') as { templateId?: string; data?: Record<string, unknown> } | null
      const typed = draft?.data && Object.values(draft.data).some((v) => typeof v === 'string' && v.trim())
      if (draft?.templateId && typed) {
        const name = names?.[draft.templateId]
        setLine({
          text: name != null ? tr('Welcome back. Your {name} invitation is waiting.', { name }) : tr('Welcome back. Your design invitation is waiting.'),
          href: '/create',
          cta: tr('Continue editing'),
          location: 'home_continue_draft',
        })
        return
      }
      const host = JSON.parse(localStorage.getItem('si-host') || 'null') as { n?: number } | null
      if (host?.n && host.n > 0) {
        setLine({
          text: host.n === 1 ? tr('Welcome back. You have an invitation with us.') : tr('Welcome back. You have {n} invitations with us.', { n: host.n }),
          href: '/dashboard',
          cta: tr('Open your invitations'),
          location: 'home_continue_host',
        })
      }
    } catch {
      /* private mode, or nothing saved */
    }
  }, [names, tr])
  if (!line) return null
  return (
    <p className="enter-0 mt-5 text-[0.95rem] text-hv-ink max-lg:mx-auto">
      <span className="text-hv-muted">{line.text} </span>
      <TrackedLink href={line.href} location={line.location} className="hv-textlink">
        {line.cta}
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </TrackedLink>
    </p>
  )
}
