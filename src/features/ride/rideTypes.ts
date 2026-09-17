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

export const FROM_SUGGESTIONS = ['Alappuzha', 'Mararikulam', 'Cherthala','Vayalar', 'Thuravoor', 'Aroor' ]
export const TO_SUGGESTIONS = ['Infopark', 'Infopark Phase 1', 'Infopark Phase 2', 'SmartCity']
