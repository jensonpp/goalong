import { useState } from 'react'
import { inputClass } from './Field'
import { Chip } from './Chip'

interface Props {
  value: string[]
  onChange: (update: (prev: string[]) => string[]) => void
  suggestions: string[]
}

export function PickupPointInput({ value, onChange, suggestions }: Props) {
  const [draft, setDraft] = useState('')

  const add = (raw: string) => {
    const name = raw.trim()
    if (!name) return
    onChange((prev) => (prev.includes(name) ? prev : [...prev, name]))
    setDraft('')
  }
  const remove = (i: number) => onChange((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        Passing through <span className="font-normal text-slate-400">(optional)</span>
      </span>

      {value.length > 0 && (
        <ol className="mb-2 space-y-1">
          {value.map((p, i) => (
            <li key={p} className="flex items-center gap-2">
              <span className="flex w-5 flex-col items-center text-brand-700">
                <span className="text-xs">●</span>
                {i < value.length - 1 && <span className="text-xs leading-none text-slate-300">↓</span>}
              </span>
              <span className="flex-1 truncate">{p}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${p}`}
                className="h-9 w-9 rounded-full text-slate-400 active:bg-slate-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add(draft)
            }
          }}
          placeholder="Add pickup point"
          enterKeyHint="done"
          autoComplete="off"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => add(draft)}
          disabled={!draft.trim()}
          className="min-h-12 shrink-0 rounded-xl bg-brand-50 px-4 font-semibold text-brand-800 active:bg-brand-100 disabled:opacity-40"
        >
          Add
        </button>
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {suggestions
          .filter((s) => !value.includes(s))
          .map((s) => (
            <Chip key={s} label={`+ ${s}`} onClick={() => add(s)} />
          ))}
      </div>
    </div>
  )
}
