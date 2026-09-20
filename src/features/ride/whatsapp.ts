import type { Ride } from './rideTypes'
import { formatDate, formatTime } from '../../lib/dates'

export function generateWhatsAppMessage(ride: Ride): string {
  const seats = `${ride.availableSeats} seat${ride.availableSeats === 1 ? '' : 's'} available`
  const lines = [
    `🚗 ${seats}`,
    `📍 *${ride.from}* → *${ride.to}*`,
    '',
    `*${formatDate(ride.date)} 🕗 ${formatTime(ride.departureTime)}*`,
  ]
  if (ride.pickupPoints.length) {
    // One line – WhatsApp wraps it itself when the row is too long.
    lines.push('', `📍 Passing through: ${ride.pickupPoints.join(' › ')}`)
  }
  if (ride.notes.trim()) {
    lines.push('', `🛣 ${ride.notes.trim()}`)
  }
  lines.push(
    '',
    'Please DM',
    '',
    '> _Posted using SameWay_',
    '> _https://sameway.in/_'
  )
  return lines.join('\n')
}

/** Opens WhatsApp (app on mobile, web on desktop) with the message pre-filled. User picks the chat. */
export function whatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
