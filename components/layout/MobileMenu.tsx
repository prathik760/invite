'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { OCCASIONS } from '@/lib/catalog'
import { LOCALES, localeHref, localePath, stripLocale } from '@/lib/i18n'
import { t } from '@/content/translations'
import { ArrowRightIcon, CloseIcon, MenuIcon } from '@/components/ui/Icons'
import Logo from '@/components/brand/Logo'
import { useBackToClose } from '@/lib/useBackToClose'

/**
 * Full-screen menu below `lg`. The same destinations are in the desktop nav's
 * server HTML, so nothing here needs to be crawlable — this only has to be easy
 * to use with a thumb.
 *
 * The overlay is portalled to <body>: the header uses backdrop-filter, which
 * makes it the containing block for `position: fixed` descendants, so rendered
 * in place the "full-screen" menu was clipped to the header's 4.6rem strip.
 */
export default function MobileMenu({
  createHref,
  createLabel,
  locale,
}: {
  createHref: string
  createLabel: string
  locale: string
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const pathname = usePathname() || '/'
  const { path } = stripLocale(pathname)

  // Close on navigation. Links inside also close it directly, but a route
  // change triggered any other way (back button) must not leave it covering
  // the new page.
  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Back closes the menu instead of leaving the page. Links inside navigate
  // with `replace`, swapping the menu's history entry for the new page.
  const releaseBack = useBackToClose(open, () => setOpen(false))
  const close = () => setOpen(false)
  const leave = () => {
    releaseBack()
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-peach lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <MenuIcon />
      </button>

      {open && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 flex flex-col bg-champagne lg:hidden"
          style={{ zIndex: 'var(--z-overlay)' as unknown as number }}
        >
          <div className="flex h-[4.6rem] shrink-0 items-center justify-between border-b border-line px-4">
            <Link href={localePath('/', locale)} onClick={leave} replace className="flex items-center gap-2">
              <Logo />
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-peach"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
            <ul className="divide-y divide-line border-b border-line">
              {[
                { href: '/templates', label: t('nav.templates', locale) },
                { href: '/pricing', label: t('nav.pricing', locale) },
                { href: '/blog', label: t('nav.blog', locale) },
                { href: '/dashboard', label: 'My invitations' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={leave}
                    replace
                    className="flex items-center justify-between py-4 font-editorial text-[1.6rem] font-semibold text-charcoal"
                  >
                    {item.label}
                    <ArrowRightIcon className="h-4 w-4 text-burnished" />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-7">Occasions</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {OCCASIONS.map((o) => (
                <li key={o.key}>
                  <Link
                    href={o.href}
                    onClick={leave}
                    replace
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-paper p-2"
                  >
                    <Image src={o.image} alt="" width={40} height={36} className="h-9 w-10 shrink-0 rounded-lg object-cover" />
                    <span className="text-[0.9rem] font-semibold leading-tight text-charcoal">{o.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-7">Language</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {LOCALES.map((l) => (
                <li key={l.code}>
                  <Link
                    href={localeHref(path, l.code)}
                    hrefLang={l.htmlLang}
                    onClick={leave}
                    replace
                    dir={l.dir}
                    className={`inline-flex rounded-full border px-3.5 py-1.5 text-[0.85rem] ${
                      l.code === locale ? 'border-emerald bg-emerald text-paper' : 'border-line bg-paper text-charcoal'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className="shrink-0 border-t border-line bg-paper px-4 pt-3"
            style={{ paddingBottom: 'max(0.9rem, env(safe-area-inset-bottom, 0px))' }}
          >
            <Link
              href={createHref}
              onClick={leave}
              replace
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[1rem] font-semibold"
            >
              {createLabel}
              <ArrowRightIcon />
            </Link>
            <p className="mt-2 text-center text-[0.78rem] text-muted">Preview before you pay · Pay once to publish</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
