import type { RideInput } from './rideTypes'

const STORAGE_KEY = 'goalong.places'
const MAX_STORED = 12

export const MAX_SUGGESTIONS = 6

/** MRU insert, newest first. Case-insensitive dedupe – the newest spelling wins. */
export function addPlace(list: string[], place: string): string[] {
  const name = place.trim()
  if (!name) return list
  const key = name.toLowerCase()
  return [name, ...list.filter((p) => p.toLowerCase() !== key)].slice(0, MAX_STORED)
}

/** The user's own places first, hardcoded ones filling whatever room is left. */
export function mergeSuggestions(recent: string[], fallback: string[], limit = MAX_SUGGESTIONS): string[] {
  const out = [...recent]
  const seen = new Set(recent.map((p) => p.toLowerCase()))
  for (const p of fallback) {
    if (out.length >= limit) break
    if (seen.has(p.toLowerCase())) continue
    seen.add(p.toLowerCase())
    out.push(p)
  }
  return out.slice(0, limit)
}

// ponytail: localStorage only; swap read/write for an API client when a backend exists.
function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === 'string') : []
  } catch {
    return []
  }
}

function write(places: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places))
  } catch {
    // storage unavailable (private mode / quota) – chips fall back to the hardcoded lists
  }
}

export function getRecentPlaces(): string[] {
  return read()
}

/** Called on POST RIDE only, so abandoned drafts and typos are never learned. */
export function recordPlaces(input: RideInput): void {
  const places = [input.from, input.to, ...input.pickupPoints]
  write(places.reduce(addPlace, read()))
}
