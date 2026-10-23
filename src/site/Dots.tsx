import { createContext, useContext, useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/*
 * Drawings made of dots, the way context.dev draws its product: dotted outlines, blocks filled with a
 * dot grid, and small mono labels. Shapes sit on a 5-unit grid so the dots of neighbouring shapes line up.
 */

const TONES = {
  blue: 'var(--blue)',
  faint: '#c9d8fb',
  ink: 'rgb(10 10 10 / 0.2)',
} as const
export type Tone = keyof typeof TONES

const Pattern = createContext('')

export function DotSvg({ viewBox, className, label, children }: { viewBox: string; className?: string; label?: string; children: ReactNode }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      viewBox={viewBox}
      className={cn('block', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        {(Object.keys(TONES) as Tone[]).map((t) => (
          <pattern key={t} id={`${id}-${t}`} width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.25" fill={TONES[t]} />
          </pattern>
        ))}
      </defs>
      <Pattern.Provider value={id}>{children}</Pattern.Provider>
    </svg>
  )
}

/** A block filled with a grid of dots: a line of text, a bar, an image placeholder. */
export function DotFill({ x, y, w, h, tone = 'blue', className }: { x: number; y: number; w: number; h: number; tone?: Tone; className?: string }) {
  const id = useContext(Pattern)
  return <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-${tone})`} className={className} />
}

/** A rectangle outlined in dots. With `solid`, it is filled white first so nothing shows through. */
export function DotRect({
  x,
  y,
  w,
  h,
  tone = 'blue',
  solid,
  className,
}: {
  x: number
  y: number
  w: number
  h: number
  tone?: Tone
  solid?: boolean
  className?: string
}) {
  return (
    <g className={className}>
      {solid && <rect x={x} y={y} width={w} height={h} fill="#fff" />}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={TONES[tone]} strokeWidth="2.5" strokeDasharray="0 5" strokeLinecap="round" />
    </g>
  )
}

/** A dotted path, for connectors and arrows. */
export function DotPath({ d, tone = 'blue', className }: { d: string; tone?: Tone; className?: string }) {
  return <path d={d} fill="none" stroke={TONES[tone]} strokeWidth="2.5" strokeDasharray="0 5" strokeLinecap="round" className={className} />
}

export function Label({
  x,
  y,
  children,
  anchor = 'start',
  tone = 'ink',
  size = 9,
  className,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  tone?: 'ink' | 'grey' | 'blue' | 'white'
  size?: number
  className?: string
}) {
  const fill = { ink: 'var(--ink)', grey: 'var(--ink-3)', blue: 'var(--blue)', white: '#fff' }[tone]
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily="IBM Plex Mono, monospace" fontSize={size} fill={fill} className={className}>
      {children}
    </text>
  )
}
