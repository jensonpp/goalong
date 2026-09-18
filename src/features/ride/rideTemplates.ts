import type { RideInput } from './rideTypes'
import { tomorrowISO } from '../../lib/dates'

const STORAGE_KEY = 'sameway.rideSlots'

export type SlotId = 'morning' | 'evening'

/** A ride the user posted, minus the date – re-usable as a form prefill. */
export type RideTemplate = Omit<RideInput, 'date'> & { slot: SlotId; savedAt: string }

export type SlotStore = Partial<Record<SlotId, RideTemplate>>

export const SLOT_ORDER: SlotId[] = ['morning', 'evening']

export const SLOT_LABEL: Record<SlotId, string> = { morning: 'Morning', evening: 'Evening' }

/** Departure before noon is the morning run, anything later is the evening return. */
export function slotForTime(hhmm: string): SlotId {
  return Number(hhmm.split(':')[0]) < 12 ? 'morning' : 'evening'
}

export function latestSlot(store: SlotStore): RideTemplate | null {
  const saved = SLOT_ORDER.map((s) => store[s]).filter((t): t is RideTemplate => Boolean(t))
  if (!saved.length) return null
  return saved.reduce((a, b) => (a.savedAt >= b.savedAt ? a : b))
}

/** The stored date is deliberately dropped – a stale date is worse than no date. */
export function templateToInput(t: RideTemplate): RideInput {
  const { slot: _slot, savedAt: _savedAt, ...rest } = t
  return { ...rest, date: tomorrowISO() }
}

// ponytail: localStorage only; swap read/write for an API client when a backend exists.
function read(): SlotStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SlotStore) : {}
  } catch {
    return {}
  }
}

function write(store: SlotStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // storage unavailable (private mode / quota) – posting still works
  }
}

export function getSlots(): SlotStore {
  return read()
}

/** Upserts the slot matching this ride's departure time. */
export function saveSlot(input: RideInput): void {
  const { date: _date, ...rest } = input
  const slot = slotForTime(input.departureTime)
  write({ ...read(), [slot]: { ...rest, slot, savedAt: new Date().toISOString() } })
}
