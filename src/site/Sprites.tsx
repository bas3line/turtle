import { cn } from '@/lib/cn'
import { DAY, SPRITES, type Palette, type SpriteName } from './cast'

function Frame({ rows, palette, className }: { rows: readonly string[]; palette: Palette; className?: string }) {
  const w = Math.max(...rows.map((r) => r.length))
  return (
    <svg viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" className={className} aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => {
          const fill = palette[c as keyof Palette]
          return fill ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={fill} /> : null
        }),
      )}
    </svg>
  )
}

/** One sprite; while `moving`, it steps between its two frames. */
export function Sprite({
  name,
  palette = DAY,
  moving,
  scale = 2,
  className,
}: {
  name: SpriteName
  palette?: Palette
  moving?: boolean
  scale?: number
  className?: string
}) {
  const frames = SPRITES[name]
  const rows = frames[0]
  const w = Math.max(...rows.map((r) => r.length)) * scale
  const h = rows.length * scale
  const two = frames.length > 1 && moving
  return (
    <span className={cn('relative block', className)} style={{ width: w, height: h }}>
      <Frame rows={rows} palette={palette} className={cn('absolute inset-0 size-full', two && 'animate-[frame-a_0.36s_infinite] [animation-play-state:var(--play,running)]')} />
      {two && <Frame rows={frames[1]} palette={palette} className="absolute inset-0 size-full animate-[frame-b_0.36s_infinite] [animation-play-state:var(--play,running)]" />}
    </span>
  )
}
