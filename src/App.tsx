import { CreateRidePage } from './features/ride/CreateRidePage'

export default function App() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md px-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="mb-6 flex items-center gap-3">
        <img src="/icon.svg" alt="" className="h-10 w-10 rounded-xl" />
        <div className="w-fit">
          <h1 className="text-xl font-bold leading-tight text-brand-800">SameWay</h1>
          {/* Justified so the tagline stretches to exactly the title's width. */}
          <p className="text-justify text-[0.625rem] italic text-slate-500 [text-align-last:justify]">Going Same Way?</p>
        </div>
      </header>
      <main>
        <CreateRidePage />
      </main>
    </div>
  )
}
