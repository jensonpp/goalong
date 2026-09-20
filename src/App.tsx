import { CreateRidePage } from './features/ride/CreateRidePage'

export default function App() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="mb-6 flex items-center gap-3">
        <img src="/icon.svg" alt="" className="h-10 w-10 rounded-xl" />
        <div className="w-fit">
          <h1 className="text-xl font-bold leading-tight text-brand-800">SameWay</h1>
          {/* Sized so its natural width lands on the title's ~92px – no justification, no stretched gaps. */}
          <p className="whitespace-nowrap text-[0.675rem] italic text-slate-500">Going Same Way?</p>
        </div>
        <details className="relative ml-auto">
          <summary aria-label="Menu" className="flex cursor-pointer list-none flex-col gap-1.5 p-2 [&::-webkit-details-marker]:hidden">
            <span className="block h-0.5 w-6 rounded bg-brand-800" />
            <span className="block h-0.5 w-6 rounded bg-brand-800" />
          </summary>
          <nav className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            <a href="#about" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">About Us</a>
            <a href="#contact" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Contact Us</a>
          </nav>
        </details>
      </header>
      <main>
        <CreateRidePage />
      </main>
    </div>
  )
}
