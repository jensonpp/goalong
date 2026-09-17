export function Chip({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-9 shrink-0 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors ${
        selected ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-800 active:bg-teal-100'
      }`}
    >
      {label}
    </button>
  )
}
