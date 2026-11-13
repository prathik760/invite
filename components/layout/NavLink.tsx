'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from '@/components/ui/Link'

/** A navbar link that marks itself as the current page (aria-current and a tinted pill). */
export default function NavLink({ href, className = '', children }: { href: string; className?: string; children: ReactNode }) {
  const path = usePathname() || '/'
  const current = path === href || (href !== '/' && path.startsWith(`${href}/`))
  return (
    <Link href={href} aria-current={current ? 'page' : undefined} className={`${className} ${current ? 'bg-peach text-emerald' : ''}`}>
      {children}
    </Link>
  )
}
