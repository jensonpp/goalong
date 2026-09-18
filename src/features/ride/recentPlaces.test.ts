// Run: npx tsx src/features/ride/recentPlaces.test.ts
import assert from 'node:assert/strict'
import { addPlace, mergeSuggestions, MAX_SUGGESTIONS } from './recentPlaces'

// addPlace
assert.deepEqual(addPlace([], '  Vayalar  '), ['Vayalar'])
assert.deepEqual(addPlace(['Aroor'], ''), ['Aroor'])
assert.deepEqual(addPlace(['Aroor'], '   '), ['Aroor'])
assert.deepEqual(addPlace(['Aroor', 'Vayalar'], 'Vayalar'), ['Vayalar', 'Aroor'])
assert.deepEqual(addPlace(['Cherthala', 'Aroor'], 'cherthala'), ['cherthala', 'Aroor'])

const long = Array.from({ length: 12 }, (_, i) => `P${i}`)
const capped = addPlace(long, 'New')
assert.equal(capped.length, 12)
assert.equal(capped[0], 'New')
assert.equal(capped.at(-1), 'P10') // oldest dropped

// mergeSuggestions
const fallback = ['Alappuzha', 'Mararikulam', 'Cherthala', 'Vayalar', 'Thuravoor', 'Aroor']
assert.deepEqual(mergeSuggestions([], fallback), fallback)
assert.deepEqual(mergeSuggestions(['Pattanakkad', 'SmartCity'], fallback), [
  'Pattanakkad',
  'SmartCity',
  'Alappuzha',
  'Mararikulam',
  'Cherthala',
  'Vayalar',
])
assert.deepEqual(mergeSuggestions(['cherthala'], fallback), [
  'cherthala',
  'Alappuzha',
  'Mararikulam',
  'Vayalar',
  'Thuravoor',
  'Aroor',
])
assert.equal(mergeSuggestions(long, fallback).length, MAX_SUGGESTIONS)
assert.deepEqual(mergeSuggestions(['A'], ['B'], 3), ['A', 'B'])

console.log('recentPlaces: ok')
