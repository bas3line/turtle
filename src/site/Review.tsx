import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useMedia, useReducedMotion } from './hooks'
import { DotFill, DotPath, DotRect, DotSvg, Label } from './Dots'
import { Stamp } from './Seal'
import { Sprite } from './Sprites'
import { Blue, SectionHead } from './shared'

/* One review, start to finish: six moments on a track, unrolled sideways as you scroll down. */

// The diff as strokes rather than code: indent, length, and what happened to the line.
const STROKES: [number, number, 'ctx' | 'add' | 'del' | 'bug'][] = [
  [0, 52, 'ctx'],
  [0, 44, 'add'],
  [0, 70, 'ctx'],
  [1, 62, 'del'],
  [2, 40, 'del'],
  [1, 18, 'del'],
  [1, 74, 'add'],
  [2, 22, 'add'],
  [3, 66, 'add'],
  [4, 38, 'add'],
  [3, 30, 'bug'],
  [2, 34, 'add'],
  [3, 58, 'add'],
  [2, 12, 'add'],
]

function Strokes() {
  return (
    <DotSvg viewBox="0 0 340 200" className="size-full" label="Fourteen changed lines, read one by one, stopping at line 11">
      {STROKES.map(([indent, w, k], i) => {
        const y = 12 + i * 13
        const x = 45 + indent * 10
        const len = Math.round((w * 2.6) / 5) * 5
        return (
          <g key={i}>
            <Label x={30} y={y + 5} anchor="end" size={7} tone="grey">
              {i + 1}
            </Label>
            {k === 'bug' ? (
              <>
                <rect x={x} y={y} width={len} height={5} rx="2.5" fill="var(--blue)" />
                <Label x={x + len + 10} y={y + 6} size={8.5} tone="blue">
                  ← stops here
                </Label>
              </>
            ) : (
              <DotFill x={x} y={y} w={len} h={5} tone={k === 'add' ? 'blue' : k === 'del' ? 'ink' : 'faint'} />
            )}
          </g>
        )
      })}
    </DotSvg>
  )
}

function Opened() {
  return (
    <DotSvg viewBox="0 0 340 200" className="size-full" label="Pull request 482, Retry failed card charges, opened by maya">
      <circle cx="40" cy="38" r="13" fill="#eef3fe" stroke="var(--blue)" strokeWidth="2.5" strokeDasharray="0 5" strokeLinecap="round" />
      <Label x={40} y={42} anchor="middle" size={10} tone="blue">
        m
      </Label>
      <Label x={62} y={35} size={9}>
        maya opened a pull request
      </Label>
      <Label x={62} y={48} size={8} tone="grey">
        #482 · into main
      </Label>
      <text x="20" y="92" fontSize="19" fill="var(--ink)" letterSpacing="-0.4">
        Retry failed card charges
      </text>
      <DotRect x={20} y={110} w={105} h={20} solid />
      <Label x={72.5} y={123.5} anchor="middle" size={8.5}>
        billing/charge.ts
      </Label>
      <Label x={140} y={124} size={8.5} tone="blue">
        +13
      </Label>
      <DotFill x={165} y={117} w={65} h={5} />
      <Label x={240} y={124} size={8.5} tone="grey">
        −5
      </Label>
      <DotFill x={255} y={117} w={25} h={5} tone="ink" />
      <DotPath d="M20 150 H320" tone="faint" />
      <Label x={20} y={176} size={9} tone="blue">
        turtle is reading
      </Label>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={116 + i * 7} cy={173} r="1.8" fill="var(--blue)" className="animate-[blink_1.2s_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </DotSvg>
  )
}

const FILES = [
  { name: 'lib/retry.ts', x: 15, y: 20 },
  { name: 'checkout/pay.ts', x: 225, y: 20 },
  { name: 'jobs/renewals.ts', x: 225, y: 160, breaks: true },
  { name: 'invoices/send.ts', x: 15, y: 160 },
]

function Reach() {
  return (
    <DotSvg viewBox="0 0 340 200" className="size-full" label="Four files call into the change; one of them breaks">
      {[40, 75].map((r) => (
        <ellipse key={r} cx="170" cy="100" rx={r * 1.6} ry={r} fill="none" stroke="#c9d8fb" strokeWidth="2.5" strokeDasharray="0 5" strokeLinecap="round" />
      ))}
      {FILES.map((f) => {
        const cx = f.x + 50
        const cy = f.y + 10
        return <DotPath key={f.name} d={`M170 100 Q ${(170 + cx) / 2} ${cy < 100 ? 70 : 130} ${cx} ${cy < 100 ? cy + 10 : cy - 10}`} tone={f.breaks ? 'blue' : 'faint'} />
      })}
      {FILES.map((f) =>
        f.breaks ? (
          <g key={f.name}>
            <rect x={f.x} y={f.y} width="100" height="20" rx="3" fill="var(--blue)" />
            <Label x={f.x + 50} y={f.y + 13.5} anchor="middle" size={8.5} tone="white">
              {f.name}
            </Label>
          </g>
        ) : (
          <g key={f.name}>
            <DotRect x={f.x} y={f.y} w={100} h={20} solid />
            <Label x={f.x + 50} y={f.y + 13.5} anchor="middle" size={8.5}>
              {f.name}
            </Label>
          </g>
        ),
      )}
      <rect x="158" y="88" width="24" height="24" rx="3" fill="var(--ink)" transform="rotate(45 170 100)" />
      <rect x="125" y="122" width="90" height="16" fill="#fff" />
      <Label x={170} y={133} anchor="middle" size={8.5} tone="grey">
        billing/charge.ts
      </Label>
    </DotSvg>
  )
}

function Found() {
  return (
    <DotSvg viewBox="0 0 340 200" className="size-full" label="Line 15 highlighted, with turtle's one comment beneath it">
      {[
        [13, 150, 'faint'],
        [14, 200, 'blue'],
        [15, 165, 'bug'],
        [16, 120, 'blue'],
      ].map(([n, w, k], i) => (
        <g key={n}>
          <Label x={30} y={23 + i * 15} anchor="end" size={7} tone="grey">
            {n}
          </Label>
          {k === 'bug' ? (
            <rect x={45} y={18 + i * 15} width={w as number} height={5} rx="2.5" fill="var(--blue)" />
          ) : (
            <DotFill x={45} y={18 + i * 15} w={w as number} h={5} tone={k as 'faint' | 'blue'} />
          )}
        </g>
      ))}
      <DotPath d="M60 55 V95" />
      <DotRect x={20} y={95} w={300} h={90} solid />
      <Label x={35} y={116} size={8.5} tone="blue">
        turtle · billing/charge.ts:15
      </Label>
      <text x="35" y="143" fontSize="15" fill="var(--ink)" letterSpacing="-0.2">
        A retried charge can bill the
      </text>
      <text x="35" y="163" fontSize="15" fill="var(--ink)" letterSpacing="-0.2">
        customer twice.
      </text>
    </DotSvg>
  )
}

function Fixed() {
  return (
    <DotSvg viewBox="0 0 340 200" className="size-full" label="A charge and its retry carry the same key, so the payment provider makes one charge">
      <DotRect x={15} y={30} w={130} h={45} solid />
      <Label x={28} y={49} size={9}>
        charge
      </Label>
      <Label x={28} y={64} size={8.5} tone="blue">
        key 7f3a
      </Label>
      <DotRect x={15} y={125} w={130} h={45} solid />
      <Label x={28} y={144} size={9}>
        retry
      </Label>
      <Label x={28} y={159} size={8.5} tone="blue">
        key 7f3a
      </Label>
      <DotPath d="M150 52 Q 190 52 205 85" />
      <DotPath d="M150 147 Q 190 147 205 115" />
      <rect x="205" y="70" width="120" height="60" rx="4" fill="var(--blue)" />
      <Label x={265} y={95} anchor="middle" size={9} tone="white">
        payments
      </Label>
      <Label x={265} y={112} anchor="middle" size={8.5} tone="white">
        1 charge, $49.00
      </Label>
      <Label x={225} y={155} size={8} tone="grey">
        same key,
      </Label>
      <Label x={225} y={167} size={8} tone="grey">
        same charge
      </Label>
    </DotSvg>
  )
}

function Approved() {
  return (
    <div className="grid size-full place-items-center">
      <div className="flex flex-col items-center gap-4">
        <Stamp className="size-32 -rotate-6" />
        <span className="rounded-full bg-blue-soft px-3 py-1 font-mono text-[11px] text-blue">merged · 3 minutes after it opened</span>
      </div>
    </div>
  )
}

const MOMENTS: { at: string; label: string; title: string; body: ReactNode; Art: () => ReactNode }[] = [
  {
    at: '0:00',
    label: 'opened',
    title: 'The pull request opens',
    body: 'Turtle starts reading before anyone else has looked.',
    Art: Opened,
  },
  {
    at: '0:12',
    label: 'reading',
    title: 'It reads the change',
    body: 'Fourteen lines changed. It reads every one, and stops at line 11.',
    Art: Strokes,
  },
  {
    at: '0:48',
    label: 'reaching',
    title: 'Then where it reaches',
    body: 'Four files call into the change. Renewals is where it breaks.',
    Art: Reach,
  },
  {
    at: '2:31',
    label: 'one comment',
    title: 'It finds one thing',
    body: (
      <>
        A retried charge can bill the customer <Blue>twice</Blue>. The only comment on this pull request.
      </>
    ),
    Art: Found,
  },
  {
    at: '2:40',
    label: 'the fix',
    title: 'And says how to fix it',
    body: 'Send an idempotency key, so a retry finds the first charge instead of making a new one. One click to commit.',
    Art: Fixed,
  },
  {
    at: '3:04',
    label: 'approved',
    title: 'Fixed and approved',
    body: 'Merged three minutes after it opened. Nobody had to argue with a bot.',
    Art: Approved,
  },
]

export function Review() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const walker = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLSpanElement>(null)
  const [step, setStep] = useState(0)
  const pin = useMedia('(min-width: 1024px) and (min-height: 640px)')
  const reduced = useReducedMotion()
  const pinned = pin && !reduced

  useEffect(() => {
    const t = track.current
    if (!pinned) {
      if (t) t.style.transform = ''
      return
    }
    let raf = 0
    let still = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const w = wrap.current
        const tr = track.current
        if (!w || !tr) return
        const r = w.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)))
        const max = Math.max(0, tr.scrollWidth - window.innerWidth)
        tr.style.transform = `translate3d(${-p * max}px,0,0)`
        // The turtle walks the track a little ahead of the scroll, and the line fills in behind it.
        const x = 48 + p * (tr.scrollWidth - 96)
        const wk = walker.current
        if (wk) {
          wk.style.transform = `translateX(${x}px)`
          wk.style.setProperty('--play', 'running')
          clearTimeout(still)
          still = window.setTimeout(() => wk.style.setProperty('--play', 'paused'), 160)
        }
        if (line.current) line.current.style.width = `${x}px`
        setStep(Math.min(MOMENTS.length - 1, Math.floor(p * MOMENTS.length)))
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(still)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [pinned])

  return (
    <section id="review" className="scroll-mt-16 border-t border-line bg-bg-2">
      <div className="relative mx-auto max-w-[1240px] border-x border-line px-6 pt-20 pb-4 md:px-12 md:pt-28">
        <SectionHead
          label="one review, start to finish"
          title={
            <>
              Three minutes inside <Blue>pull request #482.</Blue>
            </>
          }
        >
          What turtle does between "opened" and "approved", in the order it happens. Keep scrolling and the review plays
          out.
        </SectionHead>
      </div>

      <div ref={wrap} className={cn('relative', pinned && 'h-[320vh]')}>
        <div className={cn('overflow-x-clip', pinned && 'sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-center')}>
          <div
            className={cn(!pinned && 'snap-x snap-mandatory overflow-x-auto pb-4')}
            onScroll={(e) => {
              if (pinned) return
              const el = e.currentTarget
              const p = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)
              setStep(Math.min(MOMENTS.length - 1, Math.round(p * (MOMENTS.length - 1))))
            }}
          >
            <div ref={track} className="relative w-max px-6 pt-16 pb-8 will-change-transform md:px-12">
              {/* The track: a dotted rule, filled in blue up to wherever the turtle has got to. */}
              <div aria-hidden="true" className="absolute top-7 right-12 left-12 h-0 border-t-2 border-dotted border-blue/30" />
              {pinned && (
                <>
                  <span ref={line} aria-hidden="true" className="absolute top-[27px] left-0 h-[2px] bg-blue" />
                  <div ref={walker} aria-hidden="true" className="absolute top-[12px] left-0 -ml-[30px] [--play:paused]">
                    <Sprite name="turtle" moving scale={1.7} />
                  </div>
                </>
              )}
              <div className="flex gap-4">
                {MOMENTS.map((m, i) => (
                  <article
                    key={m.at}
                    className={cn(
                      'frame relative flex w-[min(420px,82vw)] shrink-0 snap-start flex-col p-4 transition-shadow duration-500',
                      i === step && 'shadow-[0_0_0_1.5px_var(--blue),inset_0_0_0_1px_#dfe7fb,0_24px_50px_-28px_rgb(37_99_235/0.55)]',
                    )}
                  >
                    <span aria-hidden="true" className={cn('absolute -top-[46px] left-8 size-3 rounded-full border-2 border-blue', i <= step ? 'bg-blue' : 'bg-white')} />
                    <p className="flex items-baseline justify-between px-1 pb-3 font-mono text-[12px]">
                      <span className="text-blue">{m.at}</span>
                      <span className="text-ink-3">{m.label}</span>
                    </p>
                    <div className="well h-[min(250px,30vh)] min-h-[200px]">
                      <div className="well-in">
                        <m.Art />
                      </div>
                    </div>
                    <h3 className="mt-5 px-1 text-[22px] tracking-[-0.02em]">{m.title}</h3>
                    <p className="mt-1.5 min-h-[3lh] px-1 text-[15px] leading-relaxed text-ink-2">{m.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <p className="mx-auto mt-1 w-full max-w-[1240px] px-6 font-mono text-[12px] text-ink-3 md:px-12">
            <span className="text-ink tabular-nums">{MOMENTS[step].at}</span> / 3:04 · {MOMENTS[step].title}
          </p>
        </div>
      </div>
      <div className="mx-auto h-16 max-w-[1240px] border-x border-line md:h-24" />
    </section>
  )
}
