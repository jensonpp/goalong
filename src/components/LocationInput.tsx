import { Field, inputClass } from './Field'
import { Chip } from './Chip'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  suggestions: string[]
  placeholder?: string
  error?: string
}

export function LocationInput({ label, value, onChange, suggestions, placeholder, error }: Props) {
  return (
    <div>
      <Field label={label} error={error}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="next"
          className={`${inputClass} ${error ? 'border-red-400' : ''}`}
        />
      </Field>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {suggestions.map((s) => (
          <Chip key={s} label={s} selected={value === s} onClick={() => onChange(s)} />
        ))}
      </div>
    </div>
  )
}
