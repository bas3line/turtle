import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useInView, useReducedMotion } from './hooks'
import { Band, Blue, SectionHead } from './shared'
import { Sprite } from './Sprites'
import { DAY, GREY } from './cast'

const RUNNERS = ['turtle', 'Hare', 'Jackrabbit', 'Cottontail', 'Snowshoe'] as const

const METRICS = [
  {
    key: 'time',
    tab: 'Time to review',
    note: 'Seconds from "opened" to the review. Lower is faster.',
    values: [184, 9, 14, 22, 31],
    format: (v: number) => (v >= 60 ? `${Math.floor(v / 60)}m ${String(v % 60).padStart(2, '0')}s` : `${v}s`),
    better: 'lower',
    words: ['slower', 'faster'],
    verdict: 'Turtle came last. By a lot.',
  },
  {
    key: 'comments',
    tab: 'Comments per PR',
    note: 'Comments left on each pull request. Lower is quieter.',
    values: [1.1, 8.4, 6.1, 11.2, 5.3],
    format: (v: number) => v.toFixed(1),
    better: 'lower',
    words: ['more', 'fewer'],
    verdict: 'One comment, where the others leave a page of them.',
  },
  {
    key: 'acted',
    tab: 'Acted on',
    note: 'Share of comments that led to a change in the code.',
    values: [87, 19, 24, 12, 31],
    format: (v: number) => `${v}%`,
    better: 'higher',
    words: ['more', 'less'],
    verdict: 'People fix what turtle says. They scroll past the rest.',
  },
  {
    key: 'bugs',
    tab: 'Bugs caught',
    note: 'Real bugs found per 100 pull requests.',
    values: [11, 6, 7, 4, 8],
    format: (v: number) => String(v),
    better: 'higher',
    words: ['more', 'fewer'],
    verdict: 'Slower, and it finds nearly twice as many.',
  },
] as const

/** How a runner compares with turtle: "20× faster", "7.6× more". */
function versus(v: number, turtle: number, words: readonly [string, string]) {
  const x = Math.max(v, turtle) / Math.min(v, turtle)
  return `${x >= 10 ? Math.round(x) : x.toFixed(1)}× ${v > turtle ? words[0] : words[1]}`
}

/**
 * The race, run on whichever metric you pick. Further right is better: on time that means faster,
 * so the hares are long gone before turtle has left the line. On everything else it is turtle's race.
 */
export function Race() {
  const [m, setM] = useState(0)
  const [run, setRun] = useState(0)
  const [ref, seen] = useInView<HTMLDivElement>('0px 0px -25% 0px')
  const reduced = useReducedMotion()
  const metric = METRICS[m]
  const score = metric.values.map((v) => (metric.better === 'lower' ? 1 / v : v))
  const top = Math.max(...score)
  const best = metric.better === 'lower' ? Math.min(...metric.values) : Math.max(...metric.values)

  // Everyone goes back to the line, then sets off; each runner stops walking when it arrives.
  const [go, setGo] = useState(false)
  const [arrived, setArrived] = useState<number[]>([])
  useEffect(() => {
    if (!seen) return
    const id = window.setTimeout(() => setGo(true), 80)
    return () => {
      clearTimeout(id)
      setGo(false)
      setArrived([])
    }
  }, [seen, m, run])

  return (
    <Band id="race" tone="tint" className="px-6 py-20 md:px-12 md:py-28">
      <SectionHead
        label="benchmarks"
        title={
          <>
            We raced five reviewers on 400 pull requests. <Blue>Turtle came last.</Blue>
          </>
        }
      >
        Then we counted what mattered. Pick a metric.
      </SectionHead>
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="flex flex-col gap-1.5" role="tablist" aria-label="Metric">
            {METRICS.map((x, i) => (
              <button
                key={x.key}
                type="button"
                role="tab"
                aria-selected={i === m}
                onClick={() => setM(i)}
                className={cn(
                  'flex items-center justify-between rounded-md px-4 py-2.5 text-left text-[15px] transition-colors',
                  i === m ? 'bg-blue text-white' : 'bg-white text-ink-2 shadow-[0_0_0_1px_#dfe7fb] hover:text-ink',
                )}
              >
                {x.tab}
                <span className={cn('font-mono text-[12px]', i === m ? 'text-white/70' : 'text-ink-3')}>{x.better === 'lower' ? 'lower wins' : 'higher wins'}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-[14px] text-blue shadow-[0_0_0_1px_var(--blue)] transition-colors hover:bg-blue hover:text-white"
          >
            <RotateCcw className="size-3.5" />
            Run it again
          </button>
        </div>

        <div ref={ref} className="min-w-0">
          <ol className="flex flex-col">
            {RUNNERS.map((name, i) => {
              const v = metric.values[i]
              const pct = Math.max(3, (score[i] / top) * 100)
              const turtle = i === 0
              const there = arrived.includes(i)
              const dur = 0.5 + (pct / 100) * 2.6
              return (
                <li
                  key={name}
                  className={cn(
                    'grid grid-cols-[84px_minmax(0,1fr)_56px] items-center gap-3 px-3 py-3 sm:grid-cols-[104px_minmax(0,1fr)_150px] sm:gap-5',
                    turtle && 'rounded-md bg-white shadow-[0_0_0_1px_#dfe7fb]',
                  )}
                >
                  <span className={cn('font-mono text-[13px]', turtle ? 'font-medium text-ink' : 'text-ink-3')}>{name}</span>
                  <span className="relative h-12">
                    <span className="absolute inset-x-0 top-[70%] border-t-2 border-dotted border-blue/25" />
                    <span className="absolute top-0 right-0 bottom-0 w-[3px] rounded-full bg-blue/30" />
                    <span
                      className="absolute bottom-[20%]"
                      style={{
                        // Keep the whole sprite inside the lane: at 100% its nose touches the finish.
                        left: go || reduced ? `calc(${pct}% - ${(pct / 100) * (turtle ? 55 : 40)}px)` : '0px',
                        transition: reduced || !go ? 'none' : `left ${dur}s cubic-bezier(.35,.1,.3,1)`,
                      }}
                      onTransitionEnd={(e) => {
                        if (e.propertyName === 'left') setArrived((a) => (a.includes(i) ? a : [...a, i]))
                      }}
                    >
                      <Sprite
                        name={turtle ? 'turtle' : 'hare'}
                        palette={turtle ? DAY : GREY}
                        moving={go && !there && !reduced}
                        scale={turtle ? 2.5 : 2}
                      />
                    </span>
                  </span>
                  <span className="flex items-baseline justify-end gap-2 text-right font-mono text-[13px] tabular-nums">
                    <span className={cn(v === best ? 'text-blue' : turtle ? 'text-ink' : 'text-ink-2')}>{metric.format(v)}</span>
                    {!turtle && <span className="text-ink-3 max-sm:hidden">{versus(v, metric.values[0], metric.words)}</span>}
                  </span>
                </li>
              )
            })}
          </ol>
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-blue-line px-3 pt-5">
            <p className="text-[20px] tracking-[-0.01em] text-ink">{metric.verdict}</p>
            <p className="font-mono text-[12px] text-ink-3">{metric.note}</p>
          </div>
          <p className="mt-8 max-w-[64ch] px-3 font-mono text-[11.5px] leading-relaxed text-ink-3">
            The other four are composites of the fast AI reviewers we tested, named for what they have in common. Numbers
            are from our own run of 400 merged pull requests across 12 open-source repositories. The × column is each
            runner against turtle.
          </p>
        </div>
      </div>
    </Band>
  )
}
