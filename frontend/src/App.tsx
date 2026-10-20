const activities = [
  { number: '01', title: 'Quick polls', detail: 'Share a clear preference in a few taps.', icon: '↗' },
  { number: '02', title: 'Thoughtful surveys', detail: 'Answer optional questions at your own pace.', icon: '▤' },
  { number: '03', title: 'Product feedback', detail: 'Help teams understand what works for people.', icon: '◌' },
]

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f3] text-[#1d2026]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
        <a className="flex items-center gap-2.5 font-semibold tracking-tight" href="#top" aria-label="Widget.ai home">
          <span className="grid size-9 place-items-center rounded-xl bg-[#6655d9] text-sm font-bold text-white">W</span>
          <span>widget<span className="text-[#6655d9]">.ai</span></span>
        </a>
        <a className="rounded-full border border-black/10 px-4 py-2 text-sm text-[#545861] transition hover:border-[#6655d9]/40 hover:text-[#6655d9]" href="#how-it-works">How it works</a>
      </header>

      <section id="top" className="mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-12 sm:px-10 md:grid-cols-[1.1fr_.9fr] md:items-center md:pb-28 md:pt-20">
        <div className="relative z-10">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#ece9ff] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[.13em] text-[#5d4bc4]"><span className="size-1.5 rounded-full bg-[#6655d9]" /> Your voice, by choice</p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-6xl md:text-7xl">Good questions.<br /><span className="text-[#6655d9]">Real perspectives.</span></h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#626670]">Take part in optional polls, surveys, and product feedback. See how participation works before you decide.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#activities" className="rounded-full bg-[#6655d9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6655d9]/15 transition hover:-translate-y-0.5 hover:bg-[#5543c6]">Explore activities <span aria-hidden="true">↗</span></a>
            <span className="text-sm text-[#777b84]">Always optional. Skip anytime.</span>
          </div>
          <div className="mt-12 flex items-center gap-3 text-sm text-[#686c75]"><span className="grid size-8 place-items-center rounded-full border border-black/10 bg-white">✳</span> Clear reward rules. Your choice comes first.</div>
        </div>

        <div className="relative mx-auto w-full max-w-[430px]">
          <div className="absolute -inset-8 rounded-[3rem] bg-[#e8e4ff] blur-3xl" />
          <div className="relative rotate-[1.5deg] rounded-[2rem] border border-black/[.06] bg-white p-6 shadow-[0_30px_90px_-35px_rgba(50,42,102,.28)] sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm font-semibold"><span className="grid size-8 place-items-center rounded-xl bg-[#eeeaff] text-[#6655d9]">W</span> Widget.ai</div>
              <span className="rounded-full bg-[#f0eefc] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#6655d9]">Poll</span>
            </div>
            <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-[.14em] text-[#9a9ca4]">A quick question</p>
            <h2 className="text-2xl font-semibold leading-snug tracking-tight">Which laptop feature matters most to you?</h2>
            <div className="mt-6 space-y-2.5">
              {['Battery life', 'Performance', 'Repairability'].map((item, index) => <div key={item} className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm ${index === 0 ? 'border-[#7667dc] bg-[#f5f3ff] text-[#5142b4]' : 'border-[#ebe9e6] text-[#5e626b]'}`}><span>{item}</span><span className="grid size-4 place-items-center rounded-full border border-current text-[9px]">{index === 0 ? '✓' : ''}</span></div>)}
            </div>
            <p className="mt-5 text-xs leading-5 text-[#8b8e96]">Preview only — no response is stored. Activities always explain their reward rules.</p>
            <button type="button" disabled className="mt-5 w-full rounded-xl bg-[#6655d9] py-3.5 text-sm font-semibold text-white opacity-80">Preview activity</button>
            <button type="button" disabled className="mt-3 w-full py-1 text-sm text-[#777b84]">Skip for now</button>
          </div>
          <div className="absolute -bottom-5 -left-7 rounded-2xl border border-black/[.05] bg-white px-4 py-3 shadow-xl shadow-black/5"><div className="text-[10px] uppercase tracking-wider text-[#92959d]">Your choice</div><div className="mt-0.5 text-sm font-semibold">Always in your hands</div></div>
        </div>
      </section>

      <section id="activities" className="border-y border-black/[.06] bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 md:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#6655d9]">A simple start</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Three ways to take part.</h2></div><p className="max-w-sm text-sm leading-6 text-[#777b84]">Choose what feels right. You can leave an activity at any time.</p></div>
          <div className="grid gap-3 md:grid-cols-3">{activities.map((activity) => <article key={activity.number} className="rounded-2xl border border-black/[.07] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[.04]"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-[#aaaab1]">{activity.number}</span><span className="grid size-9 place-items-center rounded-xl bg-[#f2f0ff] text-lg text-[#6655d9]">{activity.icon}</span></div><h3 className="mt-7 text-lg font-semibold">{activity.title}</h3><p className="mt-2 text-sm leading-6 text-[#777b84]">{activity.detail}</p></article>)}</div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16 sm:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-[.75fr_1.25fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#6655d9]">The Widget promise</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Participation<br />stays yours.</h2></div>
          <div className="grid gap-5 sm:grid-cols-3">{[{ n: '01', t: 'You choose', d: 'Activities are optional. Skip or close whenever you like.' }, { n: '02', t: 'We explain', d: 'Questions and any WidgetPoints rules are clear up front.' }, { n: '03', t: 'You stay in control', d: 'Your answers are for research insights, never ad targeting.' }].map((item) => <div key={item.n} className="border-t border-black/10 pt-4"><span className="text-xs font-semibold text-[#6655d9]">{item.n}</span><h3 className="mt-4 font-semibold">{item.t}</h3><p className="mt-2 text-sm leading-6 text-[#777b84]">{item.d}</p></div>)}</div>
        </div>
      </section>

      <footer className="border-t border-black/[.06] bg-white/50"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 text-xs text-[#858891] sm:flex-row sm:items-center sm:justify-between sm:px-10"><span>© 2026 Widget.ai · An independent research experience</span><span>Optional participation · No advertising · No location tracking</span></div></footer>
    </main>
  )
}

export default App

