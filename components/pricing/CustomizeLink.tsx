'use client'

import type { ReactNode } from 'react'
import Link from '@/components/ui/Link'
import { trackEvent } from '@/lib/analytics'

/**
 * "Customize": the builder with this design chosen, for server-rendered sections. Fires the
 * same `customize_click` as the Templates page cards (components/catalog/market/MarketCard),
 * and passes the section on as `src`, which the builder reports with create_start.
 */
export default function CustomizeLink({
  templateId,
  name,
  price,
  level,
  category,
  section,
  className,
  children,
}: {
  templateId: string
  name: string
  price: number
  level: string
  category: string
  section: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={`/create?template=${templateId}&src=${section}`}
      prefetch={false}
      onClick={() =>
        trackEvent('customize_click', { template_id: templateId, template_name: name, price, template_type: level, category, source_section: section })
      }
      className={className}
    >
      {children}
    </Link>
  )
}
