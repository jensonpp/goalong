import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { Field, inputClass } from '../../components/Field'
import { Chip } from '../../components/Chip'
import { LocationInput } from '../../components/LocationInput'
import { SeatStepper } from '../../components/SeatStepper'
import { PickupPointInput } from '../../components/PickupPointInput'
import { RidePreview } from './RidePreview'
import { SavedRideSlots } from './SavedRideSlots'
import { RideRepository } from './rideRepository'
import { getSlots, latestSlot, saveSlot, slotForTime, templateToInput, type RideTemplate } from './rideTemplates'
import { FROM_SUGGESTIONS, MAX_SEATS, MIN_SEATS, TO_SUGGESTIONS, type Ride, type RideInput } from './rideTypes'
import { todayISO, tomorrowISO } from '../../lib/dates'
import { track } from '../../lib/analytics'

type Errors = Partial<Record<keyof RideInput, string>>

const defaultInput = (): RideInput => ({
  from: 'Cherthala',
  to: 'Infopark Phase 1',
  date: tomorrowISO(),
  departureTime: '08:20',
  availableSeats: 2,
  pickupPoints: [],
  notes: '',
})

/** Last posted ride wins; hardcoded defaults are the first-run fallback. */
const initialInput = (): RideInput => {
  const latest = latestSlot(getSlots())
  return latest ? templateToInput(latest) : defaultInput()
}

function validate(v: RideInput): Errors {
  const e: Errors = {}
  if (!v.from.trim()) e.from = 'Where are you starting from?'
  if (!v.to.trim()) e.to = 'Where are you going?'
  if (!v.date) e.date = 'Pick a date'
  if (!v.departureTime) e.departureTime = 'Pick a departure time'
  if (!Number.isInteger(v.availableSeats) || v.availableSeats < MIN_SEATS || v.availableSeats > MAX_SEATS)
    e.availableSeats = `Seats must be between ${MIN_SEATS} and ${MAX_SEATS}`
  return e
}

export function CreateRidePage() {
  const [input, setInput] = useState<RideInput>(initialInput)
  const [errors, setErrors] = useState<Errors>({})
  const [ride, setRide] = useState<Ride | null>(null)
  const [slots, setSlots] = useState(getSlots)

  const applySlot = (t: RideTemplate) => {
    setInput(templateToInput(t))
    setErrors({})
    track('slot_applied', { slot: t.slot })
  }

  const matchesInput = (t: RideTemplate) =>
    t.from === input.from && t.to === input.to && t.departureTime === input.departureTime

  const set = <K extends keyof RideInput>(key: K, value: RideInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(input)
    setErrors(errs)
    if (Object.keys(errs).length) return
    const clean: RideInput = { ...input, from: input.from.trim(), to: input.to.trim(), notes: input.notes.trim() }
    setRide(RideRepository.createRide(clean))
    saveSlot(clean)
    setSlots(getSlots())
    track('ride_created', {
      from: clean.from,
      to: clean.to,
      seats: clean.availableSeats,
      pickup_points: clean.pickupPoints.length,
      slot: slotForTime(clean.departureTime),
    })
    window.scrollTo(0, 0)
  }

  if (ride) {
    return (
      <RidePreview
        ride={ride}
        onEdit={() => setRide(null)}
        onReset={() => {
          setInput(initialInput())
          setRide(null)
          window.scrollTo(0, 0)
        }}
      />
    )
  }

  const today = todayISO()
  const tomorrow = tomorrowISO()

  return (
    <form onSubmit={submit} noValidate className="space-y-5 pb-28">
      <div>
        <h2 className="text-2xl font-bold">Post a Ride</h2>
        <p className="mt-1 text-sm text-slate-500">
          Create your ride details and share them directly to your WhatsApp carpool group.
        </p>
      </div>

      <SavedRideSlots slots={slots} isActive={matchesInput} onApply={applySlot} />

      <LocationInput label="From" value={input.from} onChange={(v) => set('from', v)} suggestions={FROM_SUGGESTIONS} placeholder="Starting point" error={errors.from} />
      <LocationInput label="To" value={input.to} onChange={(v) => set('to', v)} suggestions={TO_SUGGESTIONS} placeholder="Destination" error={errors.to} />

      <div>
        <Field label="Date" error={errors.date}>
          <input type="date" value={input.date} min={today} onChange={(e) => set('date', e.target.value)} className={inputClass} />
        </Field>
        <div className="mt-2 flex gap-2">
          <Chip label="Today" selected={input.date === today} onClick={() => set('date', today)} />
          <Chip label="Tomorrow" selected={input.date === tomorrow} onClick={() => set('date', tomorrow)} />
        </div>
      </div>

      <Field label="Departure" error={errors.departureTime}>
        <input type="time" value={input.departureTime} onChange={(e) => set('departureTime', e.target.value)} className={inputClass} />
      </Field>

      <SeatStepper value={input.availableSeats} onChange={(v) => set('availableSeats', v)} error={errors.availableSeats} />

      <PickupPointInput
        value={input.pickupPoints}
        onChange={(update) => setInput((prev) => ({ ...prev, pickupPoints: update(prev.pickupPoints) }))}
        suggestions={FROM_SUGGESTIONS}
      />

      <Field label="Notes" hint="(optional)">
        <input type="text" value={input.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Via NH" className={inputClass} />
      </Field>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto max-w-md">
          <Button type="submit">POST RIDE</Button>
        </div>
      </div>
    </form>
  )
}
