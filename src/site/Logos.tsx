import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

// Made-up teams, each set the way a real wordmark would be: different type, the same quiet ink.
const TEAMS: { name: string; node: ReactNode }[] = [
  { name: 'Hollow Pine', node: <span className="text-[19px] font-bold tracking-[-0.03em] [font-stretch:120%]">hollowpine</span> },
  { name: 'Kettle', node: <span className="text-[24px] font-light italic tracking-[-0.03em]">Kettle</span> },
  { name: 'Northwind', node: <span className="font-mono text-[15px] font-medium tracking-[0.18em] uppercase">Northwind</span> },
  {
    name: 'Mossbank',
    node: (
      <span className="flex items-center gap-1.5 text-[18px] font-semibold tracking-[-0.02em]">
        <span className="size-3.5 rounded-full border-[3px] border-current" />
        mossbank
      </span>
    ),
  },
  { name: 'Lantern', node: <span className="text-[20px] font-light tracking-[0.04em] uppercase [font-stretch:80%]">Lantern</span> },
  {
    name: 'Quarry',
    node: (
      <span className="flex items-center gap-1.5 text-[19px] font-extrabold tracking-[-0.04em]">
        <span className="size-3.5 rotate-45 bg-current" />
        Quarry
      </span>
    ),
  },
  { name: 'Fieldnote', node: <span className="text-[22px] font-light tracking-[-0.02em]">fieldnote</span> },
  { name: 'Tidewater', node: <span className="text-[18px] font-medium tracking-[0.02em] [font-stretch:125%]">TIDEWATER</span> },
  { name: 'Ember & Oak', node: <span className="text-[21px] italic tracking-[-0.02em]">Ember &amp; Oak</span> },
  { name: 'Slate', node: <span className="text-[22px] font-black tracking-[-0.06em] [font-stretch:75%]">SLATE</span> },
  {
    name: 'Brightline',
    node: (
      <span className="flex items-center gap-1.5 font-mono text-[15px]">
        <span className="h-3.5 w-1 bg-current" />
        brightline
      </span>
    ),
  },
  { name: 'Paperplane', node: <span className="text-[19px] font-semibold tracking-[-0.02em] italic">paperplane</span> },
]

export function Logos() {
  return (
    <section aria-label="Teams using turtle" className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1240px] border-x border-line">
        <p className="px-6 pt-8 pb-6 text-center text-[13px] text-ink-3 md:px-12">
          Reviewing pull requests at <span className="text-blue">3,100 teams</span> who would rather ship it once
        </p>
        <ul className="grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-6">
          {TEAMS.map((t, i) => (
            <li
              key={t.name}
              aria-label={t.name}
              className={cn(
                'grid h-24 place-items-center border-line text-ink/45 transition-colors duration-300 hover:text-ink',
                'max-sm:[&:nth-child(2n)]:border-l sm:max-lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(6n+1))]:border-l',
                i >= 2 && 'max-sm:border-t',
                i >= 3 && 'sm:max-lg:border-t',
                i >= 6 && 'lg:border-t',
              )}
            >
              {t.node}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
