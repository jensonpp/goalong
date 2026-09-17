import type { Ride, RideInput } from './rideTypes'

const STORAGE_KEY = 'goalong.rides'

function read(): Ride[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Ride[]) : []
  } catch {
    return []
  }
}

function write(rides: Ride[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides))
  } catch {
    // storage unavailable (private mode / quota) – ride still works in-memory
  }
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now())
}

// ponytail: localStorage only; swap these two functions for an API client when a backend exists.
export const RideRepository = {
  createRide(input: RideInput): Ride {
    const ride: Ride = { ...input, id: newId(), createdAt: new Date().toISOString() }
    write([ride, ...read()])
    return ride
  },
  getRides(): Ride[] {
    return read()
  },
}
