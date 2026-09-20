import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
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
import { getRecentPlaces, mergeSuggestions, recordPlaces } from './recentPlaces'
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
  const [recent, setRecent] = useState(getRecentPlaces)

  // The user's own places lead; the hardcoded lists fill the rest.
  const suggestions = useMemo(
    () => ({
      from: mergeSuggestions(recent, FROM_SUGGESTIONS),
      to: mergeSuggestions(recent, TO_SUGGESTIONS),
      pickup: mergeSuggestions(recent, FROM_SUGGESTIONS),
    }),
    [recent],
  )

  // The preview screen gets its own history entry, so the browser's Back button
  // returns to the form instead of leaving the app. keepValues tells the popstate
  // handler whether this was EDIT RIDE (keep what was typed) or a plain back.
  const keepValues = useRef(false)

  useEffect(() => {
    if (!ride) return
    window.history.pushState({ sameway: 'preview' }, '')
    const onPop = () => {
      setRide(null)
      if (!keepValues.current) setInput(initialInput())
      keepValues.current = false
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [ride])

  /** Leaves the preview via history, so our own back button and the browser's agree. */
  const leavePreview = (keep: boolean) => {
    keepValues.current = keep
    window.history.back()
  }

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
    recordPlaces(clean)
    setRecent(getRecentPlaces())
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
      <RidePreview ride={ride} onEdit={() => leavePreview(true)} onReset={() => leavePreview(false)} />
    )
  }

  const today = todayISO()
  const tomorrow = tomorrowISO()

  return (
    <form onSubmit={submit} noValidate className="space-y-5 pb-28">
      <div>
        <h2 className="text-2xl font-bold">Post a Ride</h2>
        <p className="mt-1 text-sm text-slate-500">
        Create your ride details and share them directly with your friend circles.
        </p>
      </div>

      <SavedRideSlots slots={slots} isActive={matchesInput} onApply={applySlot} />

      <LocationInput label="From" value={input.from} onChange={(v) => set('from', v)} suggestions={suggestions.from} placeholder="Starting point" error={errors.from} />
      <LocationInput label="To" value={input.to} onChange={(v) => set('to', v)} suggestions={suggestions.to} placeholder="Destination" error={errors.to} />

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
        suggestions={suggestions.pickup}
      />

      <Field label="Notes" hint="(optional)">
        <input type="text" value={input.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Via NH" className={inputClass} />
      </Field>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto max-w-md">
          <Button type="submit">POST RIDE</Button>
          <p className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
            Coming soon
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-label="Google Play"><path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/></svg>
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-label="App Store"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
          </p>
        </div>
      </div>
    </form>
  )
}
