import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { DotFill, DotPath, DotRect, DotSvg, Label } from './Dots'
import { useInView, useReducedMotion } from './hooks'
import { Stamp } from './Seal'
import { Band, Blue, SectionHead } from './shared'

/* 01: the repository as a field of dots. Each dot is a file; they light up outward from the change. */
const FIELD = (() => {
  const out: { x: number; y: number; ring: number }[] = []
  for (let j = 0; j < 20; j++) {
    for (let i = 0; i < 28; i++) {
      const x = 5 + i * 10
      const y = 5 + j * 10
      const d = Math.hypot((x - 140) / 10, ((y - 100) / 10) * 1.25)
      out.push({ x, y, ring: Math.round(d / 2.4) })
    }
  }
  return out
})()
const NEIGHBOURS = [
  { name: 'lib/retry.ts', x: 25, y: 30 },
  { name: 'checkout/pay.ts', x: 170, y: 35 },
  { name: 'jobs/renewals.ts', x: 165, y: 150 },
  { name: 'invoices/send.ts', x: 20, y: 145 },
]

function IndexArt({ on }: { on: boolean }) {
  return (
    <DotSvg viewBox="0 0 280 200" className="size-full" label="The repository as a field of dots, lighting up outward from the changed file">
      {FIELD.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r="1.7"
          fill="#d3defb"
          className={cn(on && d.ring > 0 && 'dot-wave')}
          style={{ animationDelay: `${d.ring * 0.16}s` }}
        />
      ))}
      {NEIGHBOURS.map((n) => (
        <g key={n.name}>
          <DotRect x={n.x} y={n.y} w={95} h={20} solid />
          <Label x={n.x + 47.5} y={n.y + 13.5} anchor="middle" size={8.5}>
            {n.name}
          </Label>
        </g>
      ))}
      <rect x="125" y="85" width="30" height="30" rx="3" fill="var(--blue)" />
      <rect x="95" y="122" width="90" height="17" fill="#fff" />
      <Label x={140} y={134} anchor="middle" tone="blue" size={8.5}>
        billing/charge.ts
      </Label>
    </DotSvg>
  )
}

/* 02: the diff, line by line. The reader stops at the one that breaks and says so. */
const BARS = [
  { w: 120, k: 'ctx', in: 0 },
  { w: 175, k: 'del', in: 0 },
  { w: 150, k: 'add', in: 10 },
  { w: 190, k: 'add', in: 10 },
  { w: 90, k: 'ctx', in: 20 },
  { w: 135, k: 'bug', in: 20 },
  { w: 160, k: 'add', in: 10 },
  { w: 70, k: 'ctx', in: 0 },
]
const BUG = 5

function ReadArt({ on }: { on: boolean }) {
  const reduced = useReducedMotion()
  const [at, setAt] = useState(reduced ? BUG : -1)
  useEffect(() => {
    if (!on || reduced) return
    const wait = at === BUG ? 2600 : at === BARS.length - 1 ? 1400 : 380
    const id = window.setTimeout(() => setAt((a) => (a >= BARS.length - 1 ? -1 : a + 1)), wait)
    return () => clearTimeout(id)
  }, [on, at, reduced])
  const y = (i: number) => 55 + i * 17

  return (
    <DotSvg viewBox="0 0 280 200" className="size-full" label="A diff read line by line; the reader stops at the line that charges twice">
      <DotRect x={10} y={10} w={260} h={180} tone="faint" />
      <Label x={25} y={32} size={8.5}>
        billing/charge.ts
      </Label>
      <Label x={255} y={32} anchor="end" size={8.5} tone="blue">
        +13 −5
      </Label>
      <DotPath d="M15 40 H265" tone="faint" />
      {BARS.map((b, i) =>
        b.k === 'bug' && at >= BUG ? (
          <rect key={i} x={40 + b.in} y={y(i)} width={b.w} height={5} rx="2.5" fill="var(--blue)" />
        ) : (
          <DotFill key={i} x={40 + b.in} y={y(i)} w={b.w} h={5} tone={b.k === 'ctx' ? 'faint' : b.k === 'del' ? 'ink' : 'blue'} />
        ),
      )}
      {BARS.map((b, i) => (
        <Label key={i} x={30} y={y(i) + 5} anchor="end" size={7} tone="grey">
          {b.k === 'del' ? '−' : b.k === 'ctx' ? '' : '+'}
        </Label>
      ))}
      <rect
        x="16"
        y="0"
        width="3"
        height="11"
        rx="1.5"
        fill="var(--blue)"
        className="transition-[transform,opacity] duration-300 ease-out"
        style={{ transform: `translateY(${y(Math.max(0, at)) - 3}px)`, opacity: at < 0 ? 0 : 1 }}
      />
      {at === BUG && (
        <g className="animate-[comment-in_0.3s_ease-out]">
          <DotPath d={`M${40 + BARS[BUG].in + BARS[BUG].w + 5} ${y(BUG) + 2.5} H200`} />
          <rect x="200" y={y(BUG) - 8} width="62" height="21" rx="4" fill="var(--ink)" />
          <Label x={231} y={y(BUG) + 6} anchor="middle" tone="white" size={8.5}>
            charges ×2
          </Label>
        </g>
      )}
    </DotSvg>
  )
}

/* 03: the checks finish, and the stamp comes down. */
function StampArt({ on }: { on: boolean }) {
  const reduced = useReducedMotion()
  const [cycle, setCycle] = useState(0)
  const [done, setDone] = useState(reduced)
  useEffect(() => {
    if (!on || reduced) return
    const a = window.setTimeout(() => setDone(true), 2200)
    const b = window.setTimeout(() => {
      setDone(false)
      setCycle((c) => c + 1)
    }, 6000)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [on, cycle, reduced])

  const rows = [
    { label: 'tests', ok: true },
    { label: 'lint', ok: true },
    { label: done ? 'turtle approved' : 'turtle is reading', ok: done },
  ]
  return (
    <div className="relative size-full">
      <DotSvg viewBox="0 0 280 200" className="size-full" label="A pull request whose checks pass, then turtle approves it">
        <DotRect x={30} y={25} w={180} h={150} solid />
        <Label x={45} y={52} size={10.5}>
          Retry failed card charges
        </Label>
        <Label x={45} y={67} size={8} tone="grey">
          #482 · feat/retry-charges
        </Label>
        <DotPath d="M35 80 H205" tone="faint" />
        {rows.map((r, i) => (
          <g key={r.label}>
            {r.ok ? (
              <circle cx={50} cy={100 + i * 22} r="4.5" fill="var(--blue)" />
            ) : (
              <circle cx={50} cy={100 + i * 22} r="4.5" fill="none" stroke="var(--blue)" strokeWidth="2" strokeDasharray="0 3.5" strokeLinecap="round" className="origin-[50px_144px] animate-spin" />
            )}
            <Label x={63} y={103 + i * 22} size={9} tone={r.ok ? 'ink' : 'grey'}>
              {r.label}
            </Label>
          </g>
        ))}
      </DotSvg>
      {done && <Stamp key={cycle} className="absolute right-[5%] bottom-[8%] size-[92px] animate-[stamp-once_0.45s_cubic-bezier(.3,1.4,.5,1)_both]" />}
    </div>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Maps the whole repository',
    body: 'Every file, what it imports and what imports it. Re-indexed on every push, so it never reviews against a stale picture.',
    tags: ['Imports', 'Call sites', 'Git history'],
    Art: IndexArt,
  },
  {
    n: '02',
    title: 'Walks the diff, then past it',
    body: 'Line by line, then two hops out into the code each change can break. That is where the real bugs live.',
    tags: ['Every line', 'Two hops out', 'Cross-repo'],
    Art: ReadArt,
  },
  {
    n: '03',
    title: 'Speaks only when it is sure',
    body: 'One comment with a fix you can commit, or none at all. With nothing to say, it approves and gets out of the way.',
    tags: ['One comment', 'A fix to commit', 'Or approval'],
    Art: StampArt,
  },
]

export function HowItWorks() {
  const [ref, seen] = useInView<HTMLDivElement>('0px 0px -20% 0px')
  return (
    <Band id="how" className="px-6 py-20 md:px-12 md:py-28">
      <SectionHead
        label="how it works"
        title={
          <>
            Reads the repo. Walks the diff. <Blue>Then decides.</Blue>
          </>
        }
      >
        A reviewer that takes three minutes and is right beats one that takes three seconds and is noise.
      </SectionHead>
      <div ref={ref} className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map(({ n, title, body, tags, Art }) => (
          <article key={n} className="frame flex flex-col p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[23px] tracking-[-0.02em]">{title}</h3>
              <span className="font-mono text-[12px] text-blue">{n}</span>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{body}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[12px] text-ink-2">
                  {t}
                </li>
              ))}
            </ul>
            <div className="well mt-6 h-[250px]">
              <div className="well-in">
                <Art on={seen} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </Band>
  )
}
