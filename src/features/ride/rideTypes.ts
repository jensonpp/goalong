export interface Ride {
  id: string
  from: string
  to: string
  /** ISO date, YYYY-MM-DD */
  date: string
  /** 24h time, HH:MM */
  departureTime: string
  availableSeats: number
  pickupPoints: string[]
  notes: string
  createdAt: string
}

export type RideInput = Omit<Ride, 'id' | 'createdAt'>

export const MIN_SEATS = 1
export const MAX_SEATS = 8

export const PLACE_SUGGESTIONS = ['Ghaziabad', 'Faridabad', 'Gurugram', 'Greater Noida', 'New Delhi', 'Okhla Bird Sanctuary', 'Surajkund', 'Indirapuram', 'Hapur', 'Dadri']
