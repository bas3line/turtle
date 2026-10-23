import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Mark } from './Seal'

export function Wordmark({ className, night }: { className?: string; night?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2', night ? 'text-white' : 'text-ink', className)}>
      <Mark className="h-[22px] w-auto" color={night ? '#fff' : 'var(--blue)'} />
      <span className="text-[20px] font-medium tracking-[-0.03em]">turtle</span>
    </span>
  )
}

export function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  )
}

type Variant = 'ink' | 'line' | 'white' | 'ghost'

export function Button({
  href,
  variant = 'ink',
  children,
  className,
}: {
  href: string
  variant?: Variant
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] whitespace-nowrap transition-colors',
        variant === 'ink' && 'bg-ink text-white hover:bg-[#262626]',
        variant === 'line' && 'border border-blue bg-white text-blue hover:bg-blue-soft',
        variant === 'white' && 'bg-white text-ink hover:bg-blue-soft',
        variant === 'ghost' && 'border border-white/25 text-white hover:border-white/60',
        className,
      )}
    >
      {children}
    </a>
  )
}

/** A section's heading: regular weight, with the words that matter in blue. */
export function SectionHead({ label, title, children }: { label?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div>
      {label && <p className="eyebrow text-ink-3">{label}</p>}
      <h2 className="headline mt-4 max-w-[19ch] text-[clamp(2.2rem,4.2vw,3.4rem)] text-balance">{title}</h2>
      {children && <div className="mt-5 max-w-[36rem] text-[17px] leading-relaxed text-ink-2">{children}</div>}
    </div>
  )
}

/** The blue words in a headline. */
export function Blue({ children }: { children: ReactNode }) {
  return <span className="text-blue">{children}</span>
}

/** Type set in dots, for the big step numbers. */
export function Giant({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('block font-dot leading-none font-extrabold select-none', className)}>
      {children}
    </span>
  )
}

function Dot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('absolute z-10 size-[7px] rounded-full border border-blue-line bg-white', className)} />
}

/**
 * One horizontal band of the page. Every band shares the same framed column, so the side rules run
 * unbroken top to bottom, and a small ring marks each place a band meets them, as on context.dev.
 */
export function Band({
  id,
  tone = 'white',
  className,
  children,
}: {
  id?: string
  tone?: 'white' | 'grey' | 'tint'
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-16 border-t', tone === 'grey' ? 'bg-bg-2' : tone === 'tint' ? 'border-blue-line/60 bg-[#f3f6fe]' : 'bg-white')}
    >
      <div className={cn('relative mx-auto max-w-[1240px] border-x', tone === 'tint' ? 'border-blue-line/60' : 'border-line', className)}>
        <Dot className="-top-[4px] -left-[4px]" />
        <Dot className="-top-[4px] -right-[4px]" />
        {children}
      </div>
    </section>
  )
}
