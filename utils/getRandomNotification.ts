import {
  NAMES,
  CITIES,
  INVITATION_TYPES,
  MESSAGE_TEMPLATES,
  TIMES,
  AVATAR_COLORS,
} from '@/data/socialProof'

export interface SocialProofNotification {
  id: string
  name: string
  city: string
  invitationType: string
  message: string
  initials: string
  avatarColor: string
  time: string
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

let seq = 0

/**
 * Returns a random notification, avoiding the previous name so the same
 * person doesn't appear twice in a row.
 *
 * Designed so the data source can be swapped to an API response later —
 * just replace the local arrays with the fetched payload before calling.
 */
export function getRandomNotification(
  lastShownName?: string,
): SocialProofNotification {
  let name = pick(NAMES)
  // Avoid repeating the last name shown
  let attempts = 0
  while (name === lastShownName && NAMES.length > 1 && attempts < 10) {
    name = pick(NAMES)
    attempts++
  }

  const city           = pick(CITIES)
  const invitationType = pick(INVITATION_TYPES)
  const template       = pick(MESSAGE_TEMPLATES)
  const message        = template(name, city, invitationType)
  const initials       = name.slice(0, 2).toUpperCase()
  const avatarColor    = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  const time           = pick(TIMES)

  return {
    id: `sp-${++seq}`,
    name,
    city,
    invitationType,
    message,
    initials,
    avatarColor,
    time,
  }
}
