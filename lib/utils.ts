export function generateSlug(prefix?: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const random = Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join('')
  const base = prefix
    ? prefix
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 24)
    : ''
  return base ? `${base}-${random}` : random
}

export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const parts = dateString.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return ''
  const [year, month, day] = parts
  const date = new Date(year, month - 1, day)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(timeString: string): string {
  if (!timeString) return ''
  const parts = timeString.split(':').map(Number)
  if (parts.length < 2 || parts.some(isNaN)) return ''
  const [hours, minutes] = parts
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return ''
  const period = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
