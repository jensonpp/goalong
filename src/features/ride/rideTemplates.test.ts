// Run: npx tsx src/features/ride/rideTemplates.test.ts
import assert from 'node:assert/strict'
import { latestSlot, slotForTime, templateToInput, type RideTemplate } from './rideTemplates'
import { tomorrowISO } from '../../lib/dates'

assert.equal(slotForTime('00:00'), 'morning')
assert.equal(slotForTime('08:20'), 'morning')
assert.equal(slotForTime('11:59'), 'morning')
assert.equal(slotForTime('12:00'), 'evening')
assert.equal(slotForTime('18:00'), 'evening')
assert.equal(slotForTime('23:59'), 'evening')

const morning: RideTemplate = {
  slot: 'morning',
  savedAt: '2026-09-17T03:00:00.000Z',
  from: 'Cherthala',
  to: 'Infopark Phase 1',
  departureTime: '08:20',
  availableSeats: 2,
  pickupPoints: ['Cherthala', 'Aroor'],
  notes: 'Via NH',
}
const evening: RideTemplate = {
  ...morning,
  slot: 'evening',
  savedAt: '2026-09-17T12:30:00.000Z',
  from: 'Infopark Phase 1',
  to: 'Cherthala',
  departureTime: '18:00',
}

assert.equal(latestSlot({}), null)
assert.equal(latestSlot({ morning }), morning)
assert.equal(latestSlot({ morning, evening }), evening)
assert.equal(latestSlot({ morning: evening, evening: morning }), evening)

const input = templateToInput(morning)
assert.equal(input.date, tomorrowISO())
assert.equal(input.from, 'Cherthala')
assert.equal(input.departureTime, '08:20')
assert.deepEqual(input.pickupPoints, ['Cherthala', 'Aroor'])
assert.ok(!('slot' in input) && !('savedAt' in input))

console.log('rideTemplates: ok')
