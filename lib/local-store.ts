import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { generateSlug } from './utils'

export interface LocalWish {
  id: string
  eventId: string
  name: string
  message: string
  isApproved: boolean
  createdAt: string
}

export interface LocalEvent {
  id: string
  slug: string
  templateId: string
  data: Record<string, string>
  isPaid: boolean
  createdAt: string
  wishes: LocalWish[]
}

interface LocalDb {
  events: LocalEvent[]
}

const STORE_DIR = path.join(process.cwd(), '.local')
const STORE_FILE = path.join(STORE_DIR, 'events.json')

async function readStore(): Promise<LocalDb> {
  try {
    const raw = await readFile(STORE_FILE, 'utf8')
    const parsed = JSON.parse(raw) as LocalDb
    return { events: Array.isArray(parsed.events) ? parsed.events : [] }
  } catch {
    return { events: [] }
  }
}

async function writeStore(store: LocalDb) {
  await mkdir(STORE_DIR, { recursive: true })
  await writeFile(STORE_FILE, JSON.stringify(store, null, 2))
}

export function shouldUseLocalStore(error: unknown) {
  return (
    process.env.NODE_ENV !== 'production' &&
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P1001'
  )
}

export async function createLocalEvent(templateId: string, data: Record<string, string>) {
  const store = await readStore()
  const prefix =
    data.brideName && data.groomName
      ? `${data.brideName}-${data.groomName}`
      : undefined
  let slug = generateSlug(prefix)
  while (store.events.some((event) => event.slug === slug)) {
    slug = generateSlug(prefix)
  }

  const event: LocalEvent = {
    id: randomUUID(),
    slug,
    templateId,
    data,
    isPaid: false,
    createdAt: new Date().toISOString(),
    wishes: [],
  }

  store.events.unshift(event)
  await writeStore(store)
  return event
}

export async function getLocalEventBySlug(slug: string) {
  const store = await readStore()
  return store.events.find((event) => event.slug === slug) ?? null
}

export async function getLocalEventById(id: string) {
  const store = await readStore()
  return store.events.find((event) => event.id === id) ?? null
}

export async function getLocalDashboardEvents() {
  const store = await readStore()
  return store.events
}

export async function getApprovedLocalWishes(eventId: string) {
  const event = await getLocalEventById(eventId)
  return event?.wishes.filter((wish) => wish.isApproved).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) ?? []
}

export async function createLocalWish(eventId: string, name: string, message: string) {
  const store = await readStore()
  const event = store.events.find((item) => item.id === eventId)
  if (!event) return null

  const wish: LocalWish = {
    id: randomUUID(),
    eventId,
    name,
    message,
    isApproved: false,
    createdAt: new Date().toISOString(),
  }

  event.wishes.unshift(wish)
  await writeStore(store)
  return wish
}

export async function approveLocalWish(id: string) {
  const store = await readStore()
  for (const event of store.events) {
    const wish = event.wishes.find((item) => item.id === id)
    if (wish) {
      wish.isApproved = true
      await writeStore(store)
      return wish
    }
  }
  return null
}

export async function deleteLocalWish(id: string) {
  const store = await readStore()
  let deleted = false
  for (const event of store.events) {
    const before = event.wishes.length
    event.wishes = event.wishes.filter((wish) => wish.id !== id)
    deleted = deleted || event.wishes.length !== before
  }
  if (deleted) await writeStore(store)
  return deleted
}
