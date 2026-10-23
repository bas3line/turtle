import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button, Wordmark } from './shared'

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#review', label: 'A review' },
  { href: '#catches', label: 'What it catches' },
  { href: '#race', label: 'Benchmarks' },
  { href: '#pricing', label: 'Pricing' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 36)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      <a
        href="#changelog"
        className="block bg-bg-2 py-2 text-center text-[12.5px] text-ink-2 transition-colors hover:text-ink"
      >
        Introducing turtle 2: it now reads across repositories <span className="text-blue">→</span>
      </a>
      {/* Flat across the top at first; once the page moves, it lifts into a pill with a pale blue rim. */}
      <header className={cn('sticky top-0 z-40 transition-[padding,background-color] duration-300', scrolled ? 'px-3 pt-2' : 'bg-white')}>
        <nav
          className={cn(
            'mx-auto flex items-center gap-10 px-6 transition-[max-width,height,border-radius,box-shadow,background-color] duration-300 md:px-12',
            scrolled
              ? 'h-14 max-w-[1180px] rounded-full bg-white/90 shadow-[0_0_0_1px_#dfe7fb,0_0_0_5px_rgb(238_243_254/0.85),0_14px_30px_-14px_rgb(37_99_235/0.3)] backdrop-blur-xl md:px-5'
              : 'h-16 max-w-[1240px]',
          )}
        >
          <a href="#top" aria-label="turtle home">
            <Wordmark />
          </a>
          <ul className="hidden items-center gap-7 text-[14px] text-ink-2 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2">
            <a href="#github" className="hidden h-9 items-center gap-1.5 px-3 font-mono text-[12.5px] text-ink-2 transition-colors hover:text-ink md:flex">
              <Star className="size-3.5" />
              4.2k
            </a>
            <Button href="#demo" variant="line" className="h-9 px-4 text-[14px] max-sm:hidden">
              Book demo
            </Button>
            <Button href="#install" className="h-9 px-4 text-[14px]">
              Start for free
            </Button>
          </div>
        </nav>
      </header>
    </>
  )
}
