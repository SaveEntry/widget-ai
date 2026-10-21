import { FormEvent, useCallback, useEffect, useState } from 'react'

type PollOption = { id: string; label: string; votes: number; percent: number }
type Poll = { id: string; question: string; rewardDisclosure: string; active: boolean; options: PollOption[]; totalVotes: number; selectedOptionId: string | null }
type Summary = { id: string; question: string; rewardDisclosure: string }

function voterId() {
  const key = 'widget-ai-voter-id'
  let id = localStorage.getItem(key)
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id) }
  return id
}

async function readError(response: Response) {
  try { const body = await response.json(); return body.detail || body.message || 'Something went wrong.' } catch { return 'Something went wrong.' }
}

function App() {
  const [polls, setPolls] = useState<Summary[]>([])
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [question, setQuestion] = useState('')
  const [choices, setChoices] = useState(['', ''])
  const [disclosure, setDisclosure] = useState('No rewards are offered for this poll.')

  const refresh = useCallback(async (id?: string) => {
    setError('')
    try {
      const listResponse = await fetch('/api/polls')
      if (!listResponse.ok) throw new Error(await readError(listResponse))
      const list: Summary[] = await listResponse.json()
      setPolls(list)
      const targetId = id || poll?.id || list[0]?.id
      if (targetId) {
        const response = await fetch(`/api/polls/${targetId}?voterId=${encodeURIComponent(voterId())}`)
        if (!response.ok) throw new Error(await readError(response))
        const data: Poll = await response.json()
        setPoll(data)
        setSelected(data.selectedOptionId)
      } else { setPoll(null); setSelected(null) }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not connect to Widget.ai.'); }
    finally { setLoading(false) }
  }, [poll?.id])

  useEffect(() => { void refresh() }, [refresh])

  async function openPoll(id: string) { setLoading(true); await refresh(id) }

  async function createPoll(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const response = await fetch('/api/polls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, options: choices, rewardDisclosure: disclosure }) })
      if (!response.ok) throw new Error(await readError(response))
      const created: Poll = await response.json()
      setQuestion(''); setChoices(['', '']); setCreating(false)
      await refresh(created.id)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create poll.'); }
    finally { setBusy(false) }
  }

  async function castVote() {
    if (!poll || !selected) return
    setBusy(true); setError('')
    try {
      const response = await fetch(`/api/polls/${poll.id}/votes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voterId: voterId(), optionId: selected }) })
      if (!response.ok) throw new Error(await readError(response))
      const updated: Poll = await response.json(); setPoll(updated); setSelected(updated.selectedOptionId)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not submit your vote.'); }
    finally { setBusy(false) }
  }

  const voted = Boolean(poll?.selectedOptionId)

  return <main className="min-h-screen bg-[#f7f6f3] text-[#1d2026]">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
      <a className="flex items-center gap-2.5 font-semibold tracking-tight" href="#top"><span className="grid size-9 place-items-center rounded-xl bg-[#6655d9] text-sm font-bold text-white">W</span><span>widget<span className="text-[#6655d9]">.ai</span></span></a>
      <a className="text-sm text-[#626670] hover:text-[#6655d9]" href="#how-it-works">How it works</a>
    </header>

    <section id="top" className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-10 sm:px-10 md:grid-cols-[1.05fr_.95fr] md:items-center md:pb-24 md:pt-16">
      <div>
        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#ece9ff] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[.13em] text-[#5d4bc4]"><span className="size-1.5 rounded-full bg-[#6655d9]" /> Your voice, by choice</p>
        <h1 className="max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-6xl md:text-7xl">Good questions.<br /><span className="text-[#6655d9]">Real perspectives.</span></h1>
        <p className="mt-7 max-w-lg text-lg leading-8 text-[#626670]">Take part in optional polls and see what people think. Create a question of your own, or add your vote.</p>
        <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#polls" className="rounded-full bg-[#6655d9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6655d9]/15 transition hover:bg-[#5543c6]">Explore polls <span aria-hidden="true">↗</span></a><span className="text-sm text-[#777b84]">Always optional. Skip anytime.</span></div>
        <div className="mt-10 flex items-center gap-3 text-sm text-[#686c75]"><span className="grid size-8 place-items-center rounded-full border border-black/10 bg-white">✳</span> Clear reward rules. Your choice comes first.</div>
      </div>

      <section id="polls" className="rounded-[2rem] border border-black/[.06] bg-white p-6 shadow-[0_30px_90px_-35px_rgba(50,42,102,.22)] sm:p-8" aria-label="Polls">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2.5 text-sm font-semibold"><span className="grid size-8 place-items-center rounded-xl bg-[#eeeaff] text-[#6655d9]">W</span> Widget.ai</div><span className="rounded-full bg-[#f0eefc] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#6655d9]">Live polls</span></div>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error} <button className="ml-2 underline" onClick={() => { setLoading(true); void refresh() }}>Retry</button></p>}
        <div className="mt-6 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#9a9ca4]">Community questions</p><p className="mt-1 text-sm text-[#777b84]">{polls.length} active {polls.length === 1 ? 'poll' : 'polls'}</p></div><button onClick={() => setCreating(!creating)} className="rounded-full border border-[#6655d9]/25 px-4 py-2 text-sm font-semibold text-[#5d4bc4] hover:bg-[#f5f3ff]">{creating ? 'Close' : '＋ Create poll'}</button></div>

        {creating && <form className="mt-5 space-y-3 rounded-2xl bg-[#f8f7ff] p-4" onSubmit={createPoll}>
          <label className="block text-xs font-semibold text-[#535660]">Your question<input required maxLength={240} value={question} onChange={e => setQuestion(e.target.value)} placeholder="What would you like to ask?" className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6655d9]" /></label>
          <div className="space-y-2"><span className="text-xs font-semibold text-[#535660]">Choices (2–8)</span>{choices.map((choice, i) => <div className="flex gap-2" key={i}><input required maxLength={120} aria-label={`Choice ${i + 1}`} value={choice} onChange={e => setChoices(choices.map((v, n) => n === i ? e.target.value : v))} placeholder={`Choice ${i + 1}`} className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6655d9]" />{choices.length > 2 && <button type="button" aria-label="Remove choice" onClick={() => setChoices(choices.filter((_, n) => n !== i))} className="px-2 text-[#888b94]">×</button>}</div>)}{choices.length < 8 && <button type="button" onClick={() => setChoices([...choices, ''])} className="text-xs font-semibold text-[#6655d9]">＋ Add choice</button>}</div>
          <label className="block text-xs font-semibold text-[#535660]">Reward disclosure<input maxLength={500} value={disclosure} onChange={e => setDisclosure(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6655d9]" /><span className="mt-1 block font-normal text-[#777b84]">This demo does not issue rewards. Avoid promising rewards that are not available.</span></label>
          <button disabled={busy} className="w-full rounded-xl bg-[#6655d9] py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Creating…' : 'Publish poll'}</button>
        </form>}

        {loading ? <p className="py-10 text-center text-sm text-[#777b84]">Loading polls…</p> : poll ? <div className="mt-6 border-t border-black/[.06] pt-5">
          <div className="mb-4 flex flex-wrap gap-2">{polls.map(item => <button key={item.id} onClick={() => void openPoll(item.id)} className={`max-w-full truncate rounded-full px-3 py-1.5 text-xs ${item.id === poll.id ? 'bg-[#eeeaff] font-semibold text-[#5d4bc4]' : 'bg-[#f5f5f3] text-[#656872] hover:bg-[#eeeaff]'}`}>{item.question}</button>)}</div>
          <h2 className="text-xl font-semibold leading-snug tracking-tight">{poll.question}</h2>
          <div className="mt-4 space-y-2.5">{poll.options.map(option => <button key={option.id} disabled={voted || !poll.active} onClick={() => setSelected(option.id)} className={`relative flex w-full items-center justify-between overflow-hidden rounded-xl border px-4 py-3.5 text-left text-sm transition ${selected === option.id ? 'border-[#7667dc] bg-[#f5f3ff] text-[#5142b4]' : 'border-[#ebe9e6] text-[#5e626b] hover:border-[#b5adeb]'}`}>
            {voted && <span className="absolute inset-y-0 left-0 bg-[#eeeaff]" style={{ width: `${option.percent}%` }} />}
            <span className="relative z-10">{option.label}</span><span className="relative z-10 flex items-center gap-2">{voted && <span className="text-xs text-[#777b84]">{option.percent}% · {option.votes}</span>}<span className="grid size-4 place-items-center rounded-full border border-current text-[9px]">{selected === option.id ? '✓' : ''}</span></span>
          </button>)}</div>
          <p className="mt-4 text-xs leading-5 text-[#8b8e96]">{poll.rewardDisclosure} This demo stores votes but does not issue points or rewards.</p>
          {!voted && poll.active ? <button disabled={!selected || busy} onClick={() => void castVote()} className="mt-4 w-full rounded-xl bg-[#6655d9] py-3.5 text-sm font-semibold text-white transition hover:bg-[#5543c6] disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Submitting…' : 'Submit vote'}</button> : <p className="mt-4 rounded-xl bg-[#f5f3ff] py-3 text-center text-sm font-semibold text-[#5142b4]">{poll.active ? `Thanks for voting · ${poll.totalVotes} ${poll.totalVotes === 1 ? 'vote' : 'votes'}` : 'This poll is closed.'}</p>}
          {!voted && <button onClick={() => { setSelected(null); setPoll(null) }} className="mt-3 w-full py-1 text-sm text-[#777b84]">Skip this poll</button>}
        </div> : !error && <div className="py-10 text-center"><p className="text-sm text-[#777b84]">No polls yet. Start the conversation.</p></div>}
      </section>
    </section>

    <section id="how-it-works" className="border-y border-black/[.06] bg-white/70"><div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 md:py-16"><div className="grid gap-8 md:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#6655d9]">The Widget promise</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Participation<br />stays yours.</h2></div><div className="grid gap-5 sm:grid-cols-3">{[{ n: '01', t: 'You choose', d: 'Activities are optional. Skip or close whenever you like.' }, { n: '02', t: 'We explain', d: 'Questions and any reward rules are clear up front.' }, { n: '03', t: 'You stay in control', d: 'Your answers are for research insights, never ad targeting.' }].map(item => <div key={item.n} className="border-t border-black/10 pt-4"><span className="text-xs font-semibold text-[#6655d9]">{item.n}</span><h3 className="mt-4 font-semibold">{item.t}</h3><p className="mt-2 text-sm leading-6 text-[#777b84]">{item.d}</p></div>)}</div></div></div></section>
    <footer className="bg-white/50"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 text-xs text-[#858891] sm:flex-row sm:items-center sm:justify-between sm:px-10"><span>© 2026 Widget.ai · An independent research experience</span><span>Optional participation · No advertising · No location tracking</span></div></footer>
  </main>
}

export default App
