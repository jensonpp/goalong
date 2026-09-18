export function Chip({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-9 shrink-0 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors ${
        selected ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-800 active:bg-brand-100'
      }`}
    >
      {label}
    </button>
  )
}
