import { cn } from '@/lib/cn'
import { Mark } from './Seal'
import { Band, Blue, SectionHead } from './shared'

// Six kinds of bug, each hung on a picture from The Met's open collection, reprinted as blue pixels.
const CATCHES: {
  name: string
  art: string
  fit: 'cover' | 'contain'
  pos?: string
  credit: string
  where: string
  said: string
  fix: string
}[] = [
  {
    name: 'Race conditions',
    art: '/art/px/wave.png',
    fit: 'cover',
    pos: '30% 50%',
    credit: 'Hokusai, The Great Wave, ca. 1830–32',
    where: 'counters/visits.ts:8',
    said: 'Two requests read the same count, and both write it back.',
    fix: 'Use INCR, which reads and writes in one step.',
  },
  {
    name: 'Off by one',
    art: '/art/px/stack.png',
    fit: 'contain',
    credit: 'Netsuke, Pile of Turtles, 19th century',
    where: 'ui/List.tsx:21',
    said: 'The loop walks one past the end of the list.',
    fix: 'Use < instead of <=, and the last row renders.',
  },
  {
    name: 'N+1 queries',
    art: '/art/px/jakuchu.png',
    fit: 'cover',
    pos: '50% 40%',
    credit: 'Itō Jakuchū, Turtles, 1789',
    where: 'api/posts.ts:34',
    said: 'Fifty posts make fifty-one database queries, one after another.',
    fix: 'Load the authors in one query, before the loop.',
  },
  {
    name: 'Missing null checks',
    art: '/art/px/island.png',
    fit: 'cover',
    pos: '70% 50%',
    credit: 'Ryūryūkyo Shinsai, Turtle Island and Fujiyama',
    where: 'geo/shipping.ts:12',
    said: 'One user in nine has no address, and this crashes for them.',
    fix: 'Check for the address first, or make it required.',
  },
  {
    name: 'Leaked secrets',
    art: '/art/px/caddy.png',
    fit: 'contain',
    credit: 'Shibata Zeshin, Tea Caddy with Design of Turtle',
    where: 'payments/client.ts:57',
    said: 'This writes the live API key into the logs.',
    fix: 'Log the request without its headers.',
  },
  {
    name: 'SQL injection',
    art: '/art/px/onden.png',
    fit: 'cover',
    pos: '30% 50%',
    credit: 'Hokusai, The Waterwheel at Onden, ca. 1830–32',
    where: 'auth/lookup.ts:19',
    said: 'The email goes into the query straight from the request.',
    fix: 'Pass it as a parameter, never as text.',
  },
]

export function Catches() {
  return (
    <Band id="catches" className="px-6 py-20 md:px-12 md:py-28">
      <SectionHead
        label="what it catches"
        title={
          <>
            The bugs that get past <Blue>tests and tired reviewers.</Blue>
          </>
        }
      >
        Turtle doesn't comment on style, naming or formatting; your linter has that covered. It comments when something
        will break, like these.
      </SectionHead>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATCHES.map((c, i) => (
          <article key={c.name} className="group frame flex flex-col p-3">
            <div className="well aspect-[4/3]">
              <div className="well-in">
                <img
                  src={c.art}
                  alt=""
                  loading="lazy"
                  className={cn(
                    'px transition-transform duration-700 ease-out group-hover:scale-[1.06]',
                    c.fit === 'cover' ? 'absolute inset-0 size-full object-cover' : 'absolute inset-0 m-auto h-[90%] w-auto object-contain',
                  )}
                  style={c.pos ? { objectPosition: c.pos } : undefined}
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col px-3 pt-5 pb-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[23px] tracking-[-0.02em]">{c.name}</h3>
                <span className="font-mono text-[12px] text-blue">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="mt-1 font-mono text-[11.5px] text-ink-3">{c.where}</p>
              <p className="mt-3 mb-5 text-[15.5px] leading-snug text-ink">{c.said}</p>
              <p className="mt-auto flex items-start gap-2.5 rounded-md bg-blue-soft px-3 py-2.5 text-[14px] leading-snug text-blue-deep">
                <Mark className="mt-1 h-3 w-auto" />
                {c.fix}
              </p>
              <p className="mt-3 font-mono text-[10px] text-ink-3">{c.credit}</p>
            </div>
          </article>
        ))}
      </div>
    </Band>
  )
}
