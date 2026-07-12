'use client'

import { usePathname } from 'next/navigation'

const WA_HREF =
  'https://wa.me/916361770366?text=Hi%2C%20I%20want%20to%20enquire%20about%20ShareInvite'

export default function WhatsAppButton() {
  const pathname = usePathname()

  if (pathname?.startsWith('/e/')) return null

  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[88px] right-4 z-50 sm:bottom-6 sm:right-5 group"
    >
      {/* Slow pulse ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: '#25D366', opacity: 0.28, animationDuration: '2s' }}
      />
      {/* Button circle */}
      <span
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
        style={{ background: '#25D366' }}
      >
        {/* WhatsApp icon */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path
            d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.682-1.807A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z"
            fill="white"
          />
          <path
            d="M16 5.2c5.406 0 9.8 4.394 9.8 9.8s-4.394 9.8-9.8 9.8a9.757 9.757 0 01-4.933-1.33l-.355-.21-3.686.865.9-3.576-.23-.37A9.756 9.756 0 016.2 15c0-5.406 4.394-9.8 9.8-9.8z"
            fill="#25D366"
          />
          <path
            d="M12.07 11.2c-.198-.44-.406-.449-.594-.457-.154-.007-.33-.007-.506-.007a.97.97 0 00-.704.33c-.242.264-.924.903-.924 2.2s.946 2.552 1.078 2.728c.132.176 1.847 2.948 4.554 4.015 2.25.888 2.708.711 3.196.667.489-.044 1.573-.644 1.795-1.265.22-.621.22-1.154.154-1.265-.066-.11-.242-.176-.506-.308-.264-.132-1.573-.776-1.815-.865-.242-.088-.418-.132-.594.132-.176.264-.682.865-.836 1.042-.154.176-.308.198-.572.066-.264-.132-1.115-.41-2.124-1.31-.785-.7-1.315-1.564-1.469-1.828-.154-.264-.016-.407.116-.538.118-.118.264-.308.396-.462.132-.154.176-.264.264-.44.088-.176.044-.33-.022-.462-.066-.132-.58-1.437-.815-1.97z"
            fill="white"
          />
        </svg>
        {/* Tooltip — desktop hover only */}
        <span
          className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 hidden sm:block"
          style={{
            background: '#1C1C1E',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.22)',
          }}
        >
          Chat on WhatsApp
          {/* Arrow */}
          <span
            className="absolute right-[-5px] top-1/2 -translate-y-1/2 border-y-4 border-l-[5px] border-y-transparent"
            style={{ borderLeftColor: '#1C1C1E' }}
          />
        </span>
      </span>
    </a>
  )
}
