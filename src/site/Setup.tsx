import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Band, Blue, Button, Giant, GitHubMark, SectionHead } from './shared'

const STEPS = [
  { title: 'Install the app', body: 'Pick the repositories it may read. It asks for code and comments, and nothing else.' },
  { title: 'Open a pull request', body: 'Turtle starts reading the moment one opens or changes. Drafts wait until they are ready.' },
  { title: 'Talk back', body: 'Reply and it answers. "@turtle why" for the long version, "@turtle skip" to wave it off.' },
]

type Pace = 'hare' | 'steady' | 'careful'

// How far turtle reads decides everything else: files, time, and how many comments it takes to say something true.
const PACES: Record<Pace, { hops: number; files: string; time: string; comments: string; note: string }> = {
  hare: { hops: 0, files: '1', time: '0:09', comments: '~40', note: 'Reads the diff and nothing else. Not a setting, a cautionary tale.' },
  steady: { hops: 2, files: '18', time: '3:04', comments: '~1', note: 'Two hops out from every change. The default, and what most teams keep.' },
  careful: { hops: 3, files: '41', time: '5:10', comments: '~1', note: 'Three hops, plus git history. For payments, auth, anything with a pager.' },
}

// Files around the change, by how many imports away they sit. Placed once, by hand-ish arithmetic.
const RINGS = [56, 96, 136]
const FILES = RINGS.flatMap((r, ring) =>
  Array.from({ length: 5 + ring * 4 }, (_, k) => {
    const a = (k / (5 + ring * 4)) * Math.PI * 2 + ring * 0.7
    return { ring: ring + 1, x: 180 + Math.cos(a) * r * 1.15, y: 140 + Math.sin(a) * r * 0.78 }
  }),
)

function Reach({ hops }: { hops: number }) {
  return (
    <svg viewBox="0 0 360 280" className="w-full">
      {RINGS.map((r, i) => (
        <ellipse
          key={r}
          cx="180"
          cy="140"
          rx={r * 1.15}
          ry={r * 0.78}
          fill="none"
          stroke="var(--blue)"
          strokeDasharray="1.5 4"
          className="transition-opacity duration-500"
          opacity={i < hops ? 0.55 : 0.15}
        />
      ))}
      {FILES.map((f, i) => {
        const read = f.ring <= hops
        return (
          <g key={i}>
            <line x1="180" y1="140" x2={f.x} y2={f.y} stroke="var(--blue)" strokeWidth="1" className="transition-opacity duration-500" opacity={read ? 0.25 : 0} />
            <rect
              x={f.x - 5}
              y={f.y - 6}
              width="10"
              height="12"
              rx="2"
              className="transition-[fill,stroke] duration-500"
              fill={read ? 'var(--blue)' : '#fff'}
              stroke={read ? 'var(--blue)' : 'rgb(10 10 10 / 0.2)'}
              style={{ transitionDelay: `${read ? f.ring * 90 : 0}ms` }}
            />
          </g>
        )
      })}
      <rect x="168" y="126" width="24" height="28" rx="3" fill="var(--ink)" />
      <text x="180" y="174" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="var(--ink)" fillOpacity="0.55">
        the change
      </text>
    </svg>
  )
}

export function Setup() {
  const [pace, setPace] = useState<Pace>('steady')
  const p = PACES[pace]

  return (
    <Band id="install" tone="grey" className="px-6 py-20 md:px-12 md:py-28">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div>
          <SectionHead
            label="setup"
            title={
              <>
                Two minutes to install. Then pick a <Blue>pace.</Blue>
              </>
            }
          >
            No pipeline to change and nothing to host. Turtle runs as a GitHub or GitLab app, and pace is the one setting
            worth thinking about.
          </SectionHead>
          <ol className="mt-10 flex flex-col">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-6 border-t border-line py-5">
                <Giant className="w-[72px] shrink-0 text-[52px] text-blue">0{i + 1}</Giant>
                <div>
                  <p className="text-[18px] tracking-[-0.01em]">{s.title}</p>
                  <p className="mt-1 max-w-md text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Button href="#install" className="mt-4">
            <GitHubMark className="size-[18px]" />
            Install on GitHub
          </Button>
        </div>

        <div className="frame p-3">
          <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-3">
            <p className="font-mono text-[12px] text-ink-3">pace</p>
            <div className="flex rounded-full bg-bg-2 p-1" role="radiogroup" aria-label="Pace">
              {(Object.keys(PACES) as Pace[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={pace === k}
                  onClick={() => setPace(k)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-[14px] capitalize transition-colors',
                    pace === k ? 'bg-white text-blue shadow-[0_0_0_1px_rgb(37_99_235/0.3)]' : 'text-ink-3 hover:text-ink',
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div className="well">
            <div className="well-in px-3 pt-2">
              <Reach hops={p.hops} />
            </div>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-line px-1 pt-5">
            {[
              ['files read', p.files],
              ['time', p.time],
              ['comments', p.comments],
            ].map(([k, v]) => (
              <div key={k} className="px-3">
                <dt className="font-mono text-[11px] text-ink-3">{k}</dt>
                <dd className={cn('mt-1 text-[30px] tracking-[-0.03em] tabular-nums', pace === 'hare' && k === 'comments' ? 'text-ink-3 line-through' : 'text-ink')}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <p className={cn('px-4 pt-4 pb-3 text-[15px] leading-snug', pace === 'hare' ? 'text-ink-3' : 'text-ink-2')}>{p.note}</p>
        </div>
      </div>
    </Band>
  )
}
