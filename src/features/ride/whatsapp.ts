import type { Ride } from './rideTypes'
import { formatDate, formatTime } from '../../lib/dates'

export function generateWhatsAppMessage(ride: Ride): string {
  const seats = `${ride.availableSeats} seat${ride.availableSeats === 1 ? '' : 's'} available`
  const lines = [
    '🚗 Ride Available',
    '',
    `📍 ${ride.from} → ${ride.to}`,
    '',
    `🗓 ${formatDate(ride.date)}`,
    `🕗 ${formatTime(ride.departureTime)}`,
    '',
    `💺 ${seats}`,
  ]
  if (ride.pickupPoints.length) {
    lines.push('', '📍 Passing through:', ...ride.pickupPoints)
  }
  if (ride.notes.trim()) {
    lines.push('', `🛣 ${ride.notes.trim()}`)
  }
  lines.push('', 'Interested? Please DM me privately.', '', '— GoAlong')
  return lines.join('\n')
}

/** Opens WhatsApp (app on mobile, web on desktop) with the message pre-filled. User picks the chat. */
export function whatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
