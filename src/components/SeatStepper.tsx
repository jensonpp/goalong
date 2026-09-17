import { Field } from './Field'
import { MAX_SEATS, MIN_SEATS } from '../features/ride/rideTypes'

const btn =
  'h-12 w-14 rounded-xl border border-slate-300 bg-white text-2xl font-semibold text-slate-700 active:bg-slate-100 disabled:opacity-40'

export function SeatStepper({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) {
  return (
    <Field label="Available seats" error={error}>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} aria-label="Fewer seats" disabled={value <= MIN_SEATS} onClick={() => onChange(value - 1)}>
          −
        </button>
        <span className="min-w-12 text-center text-2xl font-bold tabular-nums">{value}</span>
        <button type="button" className={btn} aria-label="More seats" disabled={value >= MAX_SEATS} onClick={() => onChange(value + 1)}>
          +
        </button>
      </div>
    </Field>
  )
}
