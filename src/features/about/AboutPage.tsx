import { ComingSoon } from '../../components/ComingSoon'

export function AboutPage() {
  return (
    <article className="space-y-4 text-slate-700">
      <h2 className="text-lg font-bold text-brand-800">Small Rides. Bigger Impact.</h2>
      <p>Every day, many of us travel the same roads, often with empty seats beside us. We thought — why not make those seats useful?</p>
      <p>
        Our goal is simple: help people travelling the same way connect, share rides, save on travel, reduce the number of cars on the
        road, and make everyday commuting a little more sustainable.
      </p>
      <p>It’s a small change in how we travel, but together, it can make a real difference.</p>
      <section className="border-t border-slate-200 pt-4">
        <h3 className="font-semibold text-brand-800">Contact Us</h3>
        <a href="mailto:support.sameway@gmail.com" className="text-sm underline">support.sameway@gmail.com</a>
      </section>
      <ComingSoon className="pt-10 justify-start" />
    </article>
  )
}
