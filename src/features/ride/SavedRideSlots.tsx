import { SLOT_LABEL, SLOT_ORDER, type RideTemplate, type SlotStore } from './rideTemplates'
import { formatTime } from '../../lib/dates'

interface Props {
  slots: SlotStore
  /** Slot is highlighted when the form already matches it. */
  isActive: (t: RideTemplate) => boolean
  onApply: (t: RideTemplate) => void
}

export function SavedRideSlots({ slots, isActive, onApply }: Props) {
  const saved = SLOT_ORDER.map((s) => slots[s]).filter((t): t is RideTemplate => Boolean(t))
  if (!saved.length) return null

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-600">Your saved rides</p>
      <div className="space-y-2">
        {saved.map((t) => {
          const active = isActive(t)
          return (
            <button
              key={t.slot}
              type="button"
              onClick={() => onApply(t)}
              className={`w-full rounded-2xl px-4 py-3 text-left transition-colors ${
                active ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-900 active:bg-teal-100'
              }`}
            >
              <span className="block text-sm font-semibold">
                {SLOT_LABEL[t.slot]} · {formatTime(t.departureTime)}
              </span>
              <span className={`block text-sm ${active ? 'text-teal-50' : 'text-teal-800'}`}>
                {t.from} → {t.to}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
