// Run: npx tsx src/features/ride/whatsapp.test.ts
import assert from 'node:assert/strict'
import { generateWhatsAppMessage, whatsAppShareUrl } from './whatsapp'
import { tomorrowISO } from '../../lib/dates'

const msg = generateWhatsAppMessage({
  id: '1',
  from: 'Cherthala',
  to: 'Infopark Phase 1',
  date: tomorrowISO(),
  departureTime: '08:20',
  availableSeats: 2,
  pickupPoints: ['Cherthala', 'Mararikulam', 'Aroor'],
  notes: 'Via NH',
  createdAt: '',
})

assert.equal(
  msg,
  `🚗 2 seats available
📍 *Cherthala* → *Infopark Phase 1*

🗓 *Tomorrow*
🕗 *8:20 AM*

📍 Passing through: Cherthala › Mararikulam › Aroor

🛣 Via NH

Please DM

> _Posted using SameWay_
> _https://sameway.in/_`,
)

const bare = generateWhatsAppMessage({
  id: '2', from: 'A', to: 'B', date: '2026-12-25', departureTime: '17:05',
  availableSeats: 1, pickupPoints: [], notes: '', createdAt: '',
})
assert.ok(bare.includes('🚗 1 seat available'))
assert.ok(bare.includes('🕗 *5:05 PM*'))
assert.ok(bare.includes('🗓 *Fri, 25 Dec*'))
assert.ok(!bare.includes('Passing through'))
assert.ok(!bare.includes('🛣'))

assert.ok(whatsAppShareUrl('a b').startsWith('https://wa.me/?text=a%20b'))
console.log('whatsapp.test.ts ok')
