import { useId } from 'react'
import { cn } from '@/lib/cn'

// A turtle seen from above, in dots: head, four legs, a shell with one scute open in the middle, a tail.
const TURTLE = ['....#....', '...###...', '#.#####.#', '.###.###.', '.##...##.', '.###.###.', '#.#####.#', '....#....']

function Dots({ fill, x = 0, y = 0, cell = 1 }: { fill: string; x?: number; y?: number; cell?: number }) {
  return (
    <g fill={fill}>
      {TURTLE.flatMap((row, j) =>
        [...row].map((c, i) =>
          c === '#' ? <circle key={`${i}-${j}`} cx={x + (i + 0.5) * cell} cy={y + (j + 0.5) * cell} r={cell * 0.42} /> : null,
        ),
      )}
    </g>
  )
}

/** The turtle mark: the dot turtle on its own, in blue unless told otherwise. */
export function Mark({ className, color = 'var(--blue)' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 9 8" aria-hidden="true" className={cn('shrink-0', className)}>
      <Dots fill={color} />
    </svg>
  )
}

/** The approval stamp, pressed in blue ink: slightly rough at the edges, the way a real one prints. */
export function Stamp({ className, label = 'approved' }: { className?: string; label?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <defs>
        <filter id={`rough-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" />
        </filter>
      </defs>
      <g filter={`url(#rough-${id})`}>
        <rect x="4" y="4" width="92" height="92" rx="9" fill="none" stroke="var(--blue)" strokeWidth="4.5" />
        <rect x="11.5" y="11.5" width="77" height="77" rx="4" fill="none" stroke="var(--blue)" strokeWidth="1.3" />
        <text x="50" y="29" textAnchor="middle" fill="var(--blue)" fontFamily="IBM Plex Mono, monospace" fontSize="9.5" letterSpacing="2.4">
          TURTLE
        </text>
        <Dots fill="var(--blue)" x={36.5} y={36} cell={3} />
        <text x="50" y="81" textAnchor="middle" fill="var(--blue)" fontFamily="IBM Plex Mono, monospace" fontWeight="500" fontSize="10.5" letterSpacing="1.4">
          {label.toUpperCase()}
        </text>
      </g>
    </svg>
  )
}
