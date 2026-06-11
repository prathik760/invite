import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { className?: string }

const d = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function MapPinIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

export function ClockIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function CameraIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

export function MusicIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export function MessageIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

export function ClipboardIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
}

export function ShareIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

export function RingIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M15 3H9l-3 5 6 13 6-13z" />
      <line x1="3" y1="8" x2="21" y2="8" />
    </svg>
  )
}

export function CalendarIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function ShirtIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
    </svg>
  )
}

export function CakeIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <line x1="2" y1="21" x2="22" y2="21" />
      <line x1="7" y1="8" x2="7" y2="10" />
      <line x1="12" y1="6" x2="12" y2="10" />
      <line x1="17" y1="8" x2="17" y2="10" />
    </svg>
  )
}

export function SparklesIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z" />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
    </svg>
  )
}

export function PersonIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
    </svg>
  )
}

export function BuildingIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <rect x="2" y="7" width="20" height="14" rx="1" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  )
}

export function HomeIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export function PaletteIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01a1.5 1.5 0 011.11-2.49H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" />
      <circle cx="8" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LaptopIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}

export function PenIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <line x1="17" y1="3" x2="21" y2="7" />
      <path d="M7 21H3v-4L14 6l4 4L7 21z" />
    </svg>
  )
}

export function BanknoteIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  )
}

export function BarChartIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}

export function ZapIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

export function PhoneIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-5-5 19.79 19.79 0 01-3.07-8.67A2 2 0 015.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

export function AwardIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}

export function UsersIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

export function ParkingIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 010 6H9" />
    </svg>
  )
}

export function FlowerIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2a3.5 3.5 0 000 7 3.5 3.5 0 000-7z" />
      <path d="M12 15a3.5 3.5 0 000 7 3.5 3.5 0 000-7z" />
      <path d="M2 12a3.5 3.5 0 007 0 3.5 3.5 0 00-7 0z" />
      <path d="M15 12a3.5 3.5 0 007 0 3.5 3.5 0 00-7 0z" />
      <path d="M4.93 4.93a3.5 3.5 0 004.95 4.95 3.5 3.5 0 00-4.95-4.95z" />
      <path d="M14.12 14.12a3.5 3.5 0 004.95 4.95 3.5 3.5 0 00-4.95-4.95z" />
      <path d="M14.12 9.88a3.5 3.5 0 004.95-4.95 3.5 3.5 0 00-4.95 4.95z" />
      <path d="M4.93 19.07a3.5 3.5 0 004.95-4.95 3.5 3.5 0 00-4.95 4.95z" />
    </svg>
  )
}

export function HeartIcon({ className = 'h-7 w-7', ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...d} {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}
