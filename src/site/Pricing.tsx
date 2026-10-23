import { useState, type CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Band, Blue, Button, SectionHead } from './shared'

const PLANS = [
  {
    name: 'Open source',
    price: 'Free',
    per: 'for public repositories',
    blurb: 'Every feature, on every public repository, for as long as you keep shipping.',
    items: ['Unlimited reviews', 'Cross-repo reading', 'Replies and suggestions'],
    cta: 'Install on GitHub',
  },
  {
    name: 'Team',
    price: '$12',
    per: 'per developer, per month',
    blurb: 'For private code. Only people who open pull requests count as developers.',
    items: ['Everything in open source', 'Private repositories', 'Slack digest of what it caught', 'A .turtle.yml per repo'],
    cta: 'Start a 14-day trial',
    featured: true,
  },
  {
    name: 'Self-hosted',
    price: "Let's talk",
    per: 'in your own cloud',
    blurb: 'Turtle inside your network, on a model you choose, with SSO and an audit log.',
    items: ['Your cloud, your model', 'SSO and SCIM', 'Audit log', 'A person who answers'],
    cta: 'Talk to us',
  },
]

const PRS_PER_DEV = 22 // pull requests a developer opens in a month, give or take
const fmt = (n: number) => n.toLocaleString('en-US')

/** Comments as a field of squares, one square per `unit` comments, forty to a row. */
function Field({ count, unit, you }: { count: number; unit: number; you?: boolean }) {
  const n = Math.max(1, Math.round(count / unit))
  const cols = 40
  const rows = Math.ceil(n / cols)
  return (
    <svg viewBox={`0 0 ${cols * 8} ${rows * 8}`} className="block w-full" shapeRendering="crispEdges" aria-hidden="true">
      {Array.from({ length: n }, (_, k) => (
        <rect key={k} x={(k % cols) * 8} y={Math.floor(k / cols) * 8} width="6" height="6" fill={you ? 'var(--blue)' : '#c3cad6'} />
      ))}
    </svg>
  )
}

function Calculator() {
  const [devs, setDevs] = useState(25)
  const [yearly, setYearly] = useState(true)
  const rate = yearly ? 10 : 12
  const prs = devs * PRS_PER_DEV
  const rows = [
    { name: 'A fast AI reviewer', comments: Math.round(prs * 8.4), you: false },
    { name: 'turtle', comments: Math.round(prs * 1.1), you: true },
  ]
  const saved = rows[0].comments - rows[1].comments
  // Pick a unit that keeps the bigger field to ten rows or fewer.
  const unit = [5, 10, 25, 50, 100, 250].find((u) => rows[0].comments / u <= 400) ?? 250

  return (
    <div className="frame grid overflow-hidden lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="p-7 md:p-9">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="devs" className="text-[15px] text-ink-2">
            Developers who open pull requests
          </label>
          <span className="rounded-md bg-blue-soft px-2 py-0.5 font-mono text-[14px] text-blue tabular-nums">{devs}</span>
        </div>
        <input
          id="devs"
          type="range"
          min={1}
          max={200}
          value={devs}
          onChange={(e) => setDevs(Number(e.target.value))}
          className="range mt-4"
          style={{ '--fill': `${((devs - 1) / 199) * 100}%` } as CSSProperties}
        />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <p className="flex items-baseline gap-2">
            <span className="text-[clamp(3.4rem,6vw,4.6rem)] leading-none tracking-[-0.045em] tabular-nums">${fmt(devs * rate)}</span>
            <span className="text-[16px] text-ink-3">/ month</span>
          </p>
          <div className="flex rounded-full bg-bg-2 p-1 text-[13px]" role="group" aria-label="Billing">
            {(
              [
                ['yearly', true],
                ['monthly', false],
              ] as const
            ).map(([label, y]) => (
              <button
                key={label}
                type="button"
                aria-pressed={yearly === y}
                onClick={() => setYearly(y)}
                className={cn(
                  'rounded-full px-3 py-1 transition-colors',
                  yearly === y ? 'bg-white text-blue shadow-[0_0_0_1px_rgb(37_99_235/0.3)]' : 'text-ink-3 hover:text-ink',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 font-mono text-[12px] text-ink-3">
          {devs} × ${rate}
          {yearly ? ' · billed yearly, two months free' : ' · billed monthly'}
        </p>
      </div>

      <div className="border-blue-line/60 bg-[#f7f9ff] p-7 max-lg:border-t md:p-9 lg:border-l">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[15px] text-ink-2">Comments your team reads in a month</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-ink-3">
            <span className="size-[6px] bg-ink-3" /> = {unit}
          </p>
        </div>
        <ul className="mt-6 flex flex-col gap-6">
          {rows.map((r) => (
            <li key={r.name}>
              <div className="mb-2.5 flex items-baseline justify-between gap-3 text-[14px]">
                <span className={r.you ? 'text-ink' : 'text-ink-2'}>{r.name}</span>
                <span className={cn('font-mono tabular-nums', r.you ? 'text-blue' : 'text-ink-2')}>{fmt(r.comments)}</span>
              </div>
              <Field count={r.comments} unit={unit} you={r.you} />
            </li>
          ))}
        </ul>
        <p className="mt-7 text-[15px] leading-relaxed text-ink-2">
          That's <span className="text-ink">{fmt(saved)}</span> comments nobody has to read, dismiss or argue with. At a
          minute each, about <span className="text-blue">{fmt(Math.round(saved / 60))} hours</span> back every month.
        </p>
      </div>
    </div>
  )
}

export function Pricing() {
  return (
    <Band id="pricing" className="px-6 py-20 md:px-12 md:py-28">
      <SectionHead
        label="pricing"
        title={
          <>
            Priced per developer. <Blue>Not per comment.</Blue>
          </>
        }
      >
        Turtle leaves fewer comments than any other reviewer, so charging for them would be a strange business.
      </SectionHead>
      <div className="mt-12">
        <Calculator />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name} className={cn('flex flex-col p-7', p.featured ? 'rounded-xl bg-blue text-white shadow-[0_0_0_1px_var(--blue),0_0_0_6px_#dbe6fd]' : 'frame')}>
            <p className="flex items-center gap-2 text-[15px]">
              {p.name}
              {p.featured && <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[10.5px] text-blue">popular</span>}
            </p>
            <p className="mt-6 text-[44px] tracking-[-0.03em]">{p.price}</p>
            <p className={cn('font-mono text-[12px]', p.featured ? 'text-white/65' : 'text-ink-3')}>{p.per}</p>
            <p className={cn('mt-5 text-[15px] leading-relaxed', p.featured ? 'text-white/85' : 'text-ink-2')}>{p.blurb}</p>
            <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[15px]">
              {p.items.map((it) => (
                <li key={it} className="flex items-start gap-2.5">
                  <Check className={cn('mt-0.5 size-4 shrink-0', p.featured ? 'text-white' : 'text-blue')} strokeWidth={2.5} />
                  {it}
                </li>
              ))}
            </ul>
            <Button href="#install" variant={p.featured ? 'white' : 'line'} className="mt-8 w-full">
              {p.cta}
            </Button>
          </div>
        ))}
      </div>
    </Band>
  )
}
