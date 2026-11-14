'use client'

import { useEffect } from 'react'
import Image from '@/components/ui/Image'
import { Price } from '@/components/price/Price'
import { CheckIcon } from '@/components/ui/Icons'
import { trackEvent } from '@/lib/analytics'
import type { DesignSummary } from '@/lib/designSummary'
import { rich } from '@/lib/translate'
import { useT } from '@/components/i18n/I18nProvider'

/**
 * Above the login and signup forms when someone arrives from Customize (or any way into the
 * builder): which design is waiting, and what an account is for. Only benefits the product has.
 *
 * Analytics, each once:
 *  - customize_auth_required: a signed-out visitor tried to customize (once per design per visit,
 *    so switching between login and signup or refreshing does not count it again);
 *  - auth_view: the login or signup page was shown for that reason.
 */
export type AuthFrom = 'customize' | 'create' | 'publish' | null

export default function AuthGate({
  page,
  from,
  callbackUrl,
  design,
}: {
  page: 'login' | 'signup'
  from: AuthFrom
  callbackUrl: string
  design: DesignSummary | null
}) {
  const tr = useT()
  useEffect(() => {
    if (!from) return
    const src = (() => {
      try {
        return new URL(callbackUrl, location.origin).searchParams.get('src') ?? undefined
      } catch {
        return undefined
      }
    })()
    const key = `si-gate:${design?.id ?? from}`
    let first = true
    try {
      first = !sessionStorage.getItem(key)
      sessionStorage.setItem(key, '1')
    } catch {
      /* storage blocked: count it */
    }
    if (first && from === 'customize') {
      trackEvent('customize_auth_required', { template_id: design?.id ?? 'unknown', template_name: design?.name ?? '', price: design?.price ?? 0, source: src ?? 'unknown', auth_page: page })
    }
    trackEvent('auth_view', { auth_page: page, context: from, template_id: design?.id ?? 'none' })
  }, [from, page, callbackUrl, design])

  if (!from) return null
  return (
    <div className="mb-7 space-y-4">
      {design && (
        <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-champagne p-3">
          <Image src={design.image} alt="" width={96} height={120} sizes="48px" className="h-[60px] w-12 shrink-0 rounded-md object-cover object-top shadow-sm" />
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-burnished-deep">{from === 'publish' ? tr('Ready to publish') : tr('You’re customizing')}</p>
            <p className="truncate font-editorial text-[1.3rem] font-semibold leading-tight text-charcoal">{design.name}</p>
            <p className="text-[0.85rem] text-muted">
              {tr(design.occasion)} · {tr(design.level)} · {rich(tr('{price} once, when you publish'), { price: <Price inr={design.price} /> })}
            </p>
          </div>
        </div>
      )}
      <ul className="grid gap-1.5 text-[0.9rem] text-charcoal/80">
        {['All your invitations in one place', 'Change the details until your event, on the same link', 'Read the wishes your guests leave'].map((b) => (
          <li key={b} className="flex items-start gap-2">
            <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-soft" />
            {tr(b)}
          </li>
        ))}
      </ul>
    </div>
  )
}
