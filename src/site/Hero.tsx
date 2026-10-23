import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Check, FileText, GitPullRequest, Loader } from 'lucide-react'
import { cn } from '@/lib/cn'
import { HeroArt } from './HeroArt'
import { Mark } from './Seal'
import { Blue, Band, Button, GitHubMark } from './shared'

type Mode = 'review' | 'explain' | 'summarize'

const MODES: { key: Mode; label: string; Icon: typeof GitPullRequest }[] = [
  { key: 'review', label: 'Review', Icon: GitPullRequest },
  { key: 'explain', label: 'Explain', Icon: BookOpen },
  { key: 'summarize', label: 'Summarize', Icon: FileText },
]

// What turtle does on the way, then what it says. The steps are the same for every mode; the answer isn't.
const STEPS = ['Reading the diff: 1 file, 18 lines', 'Following imports: 4 files beyond it', 'Checking what calls chargeCard()']
const ANSWERS: Record<Mode, { head: string; body: string; where?: string }> = {
  review: {
    head: '1 comment',
    body: 'A retried charge can bill the customer twice. Pass an idempotency key so a retry finds the first charge.',
    where: 'billing/charge.ts:15',
  },
  explain: {
    head: 'What this changes',
    body: 'chargeCard() now retries up to three times, waiting 200, 400 and 800 ms. Checkout, renewals and invoices all call it, so all three get the retries.',
  },
  summarize: {
    head: 'Summary',
    body: 'Retries failed card charges with backoff. 13 lines added, 5 removed, in one file that four others depend on.',
  },
}

/**
 * The product, small: paste a pull request, pick what you want, and watch turtle work. It runs once
 * by itself so the box is never empty, then waits for you.
 */
function TryIt() {
  const [mode, setMode] = useState<Mode>('review')
  const [url, setUrl] = useState('github.com/acme/billing/pull/482')
  const [phase, setPhase] = useState(-1) // -1 idle, 0..2 working through STEPS, 3 answered
  const timers = useRef<{ ids: number[] }>({ ids: [] })

  const run = () => {
    const t = timers.current
    t.ids.forEach(clearTimeout)
    setPhase(0)
    t.ids = [1, 2, 3].map((n) => window.setTimeout(() => setPhase(n), n * 850))
  }
  useEffect(() => {
    const t = timers.current
    const first = window.setTimeout(() => {
      setPhase(0)
      t.ids = [1, 2, 3].map((n) => window.setTimeout(() => setPhase(n), n * 850))
    }, 1200)
    return () => {
      clearTimeout(first)
      t.ids.forEach(clearTimeout)
    }
  }, [])

  const answer = ANSWERS[mode]
  return (
    <div className="relative rounded-[18px] bg-blue p-2 shadow-[0_24px_60px_-28px_rgb(37_99_235/0.7)]">
      <div className="dot-grid-night pointer-events-none absolute inset-0 rounded-[18px] opacity-60" />
      <div className="relative rounded-xl bg-white p-3">
        <div className="flex gap-1" role="tablist" aria-label="What turtle should do">
          {MODES.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              onClick={() => {
                setMode(key)
                if (phase >= 0) run()
              }}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                mode === key ? 'bg-blue-soft text-blue' : 'text-ink-3 hover:text-ink',
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
        <form
          className="mt-2 flex items-center gap-2 rounded-lg border border-line px-3 py-2"
          onSubmit={(e) => {
            e.preventDefault()
            run()
          }}
        >
          <GitPullRequest className="size-4 shrink-0 text-ink-3" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Pull request URL"
            className="min-w-0 flex-1 bg-transparent font-mono text-[13.5px] text-ink outline-none"
          />
          <button type="submit" aria-label="Run" className="grid size-8 shrink-0 place-items-center rounded-md bg-blue text-white transition-colors hover:bg-blue-deep">
            <ArrowRight className="size-4" />
          </button>
        </form>

        {phase >= 0 && (
          <div className="mt-3 px-1 pb-1">
            <ul className="flex flex-col gap-1.5 font-mono text-[12px]">
              {STEPS.map((s, i) =>
                phase >= i ? (
                  <li key={s} className={cn('flex animate-[note-in_0.3s_ease-out] items-center gap-2', phase > i ? 'text-ink-3' : 'text-ink')}>
                    {phase > i ? <Check className="size-3.5 text-blue" /> : <Loader className="size-3.5 animate-spin text-blue" />}
                    {s}
                  </li>
                ) : null,
              )}
            </ul>
            {phase >= 3 && (
              <div key={mode} className="mt-3 flex animate-[rise_0.4s_ease-out] gap-3 rounded-lg bg-blue-soft p-3.5">
                <Mark className="mt-1 h-3.5 w-auto" />
                <div>
                  <p className="flex flex-wrap items-baseline gap-x-2 text-[14px] font-medium text-ink">
                    {answer.head}
                    {answer.where && <span className="font-mono text-[11.5px] font-normal text-blue">{answer.where}</span>}
                  </p>
                  <p className="mt-1 text-[14px] leading-snug text-ink-2">{answer.body}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <Band id="top" className="overflow-hidden">
      <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative z-10 min-w-0 px-6 pt-14 pb-12 md:px-12 lg:pt-20 lg:pb-20">
          <p className="text-[13px] text-ink-3">
            Free for open source. <a href="#pricing" className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">See pricing →</a>
          </p>
          <h1 className="headline mt-5 text-[clamp(2.8rem,5.2vw,4.6rem)]">
            Slow and steady <Blue>merges</Blue> the race.
          </h1>
          <p className="mt-6 max-w-[30rem] text-[18px] leading-relaxed text-ink-2">
            Turtle is a code reviewer that reads your whole repository before it says a word. One comment worth fixing,
            not forty you learn to ignore.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#install">
              <GitHubMark className="size-[18px]" />
              Install on GitHub
            </Button>
            <Button href="#demo" variant="line">
              Book a demo
            </Button>
          </div>
          <div className="mt-10 max-w-[34rem]">
            <TryIt />
          </div>
        </div>

        <div className="relative min-w-0 px-6 pb-12 md:px-12 lg:flex lg:flex-col lg:justify-center lg:py-14 lg:pl-0">
          <div className="well shadow-[0_0_0_1px_#dfe7fb,0_30px_60px_-30px_rgb(37_99_235/0.35)]">
            <div className="well-in">
              <HeroArt />
            </div>
          </div>
          <p className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[11px] text-ink-3">
            <span>Hiroshige, Mannen Bridge, Fukagawa, 1858 · The Met, CC0</span>
            <span className="text-blue">Everyone else skims the pixels. Turtle reads under the loupe.</span>
          </p>
        </div>
      </div>
    </Band>
  )
}
