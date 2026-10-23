import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from './hooks'
import { Scene, SEA_FLOOR } from './Scene'
import { Button, GitHubMark, Wordmark } from './shared'

const COLUMNS = [
  { title: 'Product', links: ['How it works', 'What it catches', 'Benchmarks', 'Pricing', 'Changelog'] },
  { title: 'Developers', links: ['Docs', '.turtle.yml', 'API', 'Self-hosting', 'Status'] },
  { title: 'Compare', links: ['vs the hare', 'vs the jackrabbit', 'vs reading it yourself', 'All comparisons'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Privacy', 'Terms'] },
]

// turtle is not a real product, so the install line points at the reserved .example domain: copied
// from this page, it resolves nowhere and can't run anyone's script.
const INSTALL = [
  { key: 'macOS', cmd: 'curl -fsSL https://turtle.example/install | sh' },
  { key: 'Linux', cmd: 'wget -qO- https://turtle.example/install | sh' },
  { key: 'Windows', cmd: 'irm https://turtle.example/install.ps1 | iex' },
]

/** One line to install, one per system, and a copy button that says when it has. */
function Install() {
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const cmd = INSTALL[tab].cmd
  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <div className="w-full max-w-[500px]">
      <div className="flex gap-1" role="tablist" aria-label="Install with">
        {INSTALL.map((x, i) => (
          <button
            key={x.key}
            type="button"
            role="tab"
            aria-selected={i === tab}
            onClick={() => setTab(i)}
            className={cn('px-2.5 py-1 font-mono text-[12px] transition-colors', i === tab ? 'bg-white/15 text-white' : 'text-white/55 hover:text-white')}
          >
            {x.key}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 bg-[#122a80]/80 px-4 py-3 font-mono text-[13px] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] backdrop-blur-sm">
        <span className="text-white/45">$</span>
        <span className="min-w-0 flex-1 truncate">{cmd}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(cmd).then(() => setCopied(true), () => {})
          }}
          className="flex items-center gap-1.5 text-[12px] text-white/55 transition-colors hover:text-white"
          aria-label="Copy the install command"
        >
          {copied ? <Check className="size-3.5 text-white" /> : <Copy className="size-3.5" />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button href="#install" variant="white">
          <GitHubMark className="size-[18px]" />
          Install on GitHub
        </Button>
        <Button href="#faq" variant="ghost">
          Read the docs
        </Button>
      </div>
    </div>
  )
}

/**
 * The name in dots, as on context.dev, cut off by the bottom of the page. Dots near the pointer swell
 * and brighten, so it reads like a light board you can run a hand across.
 */
function DotWordmark() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const box = wrap.current
    const cv = canvas.current
    if (!box || !cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    let cells: { x: number; y: number; r: number; t: number }[] = []
    let w = 0
    let h = 0
    let dpr = 1
    let cell = 9
    let raf = 0
    let alive = true
    const pointer = { x: -999, y: -999 }
    const heat = { v: 0 }

    const build = () => {
      w = box.clientWidth
      h = box.clientHeight
      dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      cell = w < 640 ? 6 : 9
      const cols = Math.floor(w / cell)
      const rows = Math.ceil(h / cell)
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const ox = off.getContext('2d', { willReadFrequently: true })
      if (!ox) return
      ox.font = '500 100px "Rethink Sans", sans-serif'
      const size = (100 * cols * 0.96) / ox.measureText('turtle').width
      ox.font = `500 ${size}px "Rethink Sans", sans-serif`
      ox.textAlign = 'center'
      ox.textBaseline = 'alphabetic'
      ox.fillStyle = '#000'
      // Set so the baseline falls a little below the bottom edge.
      ox.fillText('turtle', cols / 2, rows + size * 0.1)
      const a = ox.getImageData(0, 0, cols, rows).data
      cells = []
      const ox0 = (w - cols * cell) / 2
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const v = a[(j * cols + i) * 4 + 3] / 255
          if (v < 0.12) continue
          cells.push({ x: ox0 + (i + 0.5) * cell, y: (j + 0.5) * cell, r: Math.sqrt(v), t: j / rows })
        }
      }
      draw()
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const c of cells) {
        const d = Math.hypot(c.x - pointer.x, c.y - pointer.y)
        const near = Math.max(0, 1 - d / 150) ** 1.4 * heat.v
        // Brighter at the top of the letters, white under the pointer.
        const base = 0.38 + (1 - c.t) * 0.5
        const lum = base + (1 - base) * near
        const R = Math.round(58 + (255 - 58) * lum)
        const G = Math.round(99 + (255 - 99) * lum)
        ctx.fillStyle = `rgb(${R},${G},255)`
        ctx.beginPath()
        ctx.arc(c.x, c.y, cell * 0.36 * c.r * (1 + near * 0.6), 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // While the pointer is over it, the heat comes up; when it leaves, the board cools down again.
    const loop = () => {
      raf = 0
      const target = pointer.x > -999 ? 1 : 0
      heat.v += (target - heat.v) * 0.18
      draw()
      if (alive && Math.abs(target - heat.v) > 0.01) raf = requestAnimationFrame(loop)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onMove = (e: PointerEvent) => {
      if (reduced) return
      const r = cv.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      kick()
    }
    const onLeave = () => {
      pointer.x = -999
      pointer.y = -999
      kick()
    }

    const ro = new ResizeObserver(build)
    document.fonts.load('500 100px "Rethink Sans"').finally(() => {
      if (!alive) return
      build()
      ro.observe(box)
    })
    box.addEventListener('pointermove', onMove)
    box.addEventListener('pointerleave', onLeave)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      box.removeEventListener('pointermove', onMove)
      box.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <div ref={wrap} aria-hidden="true" className="relative h-[clamp(7.5rem,21vw,17rem)] select-none">
      <canvas ref={canvas} className="absolute inset-0 size-full" />
    </div>
  )
}

/** A status line along the bottom, like a terminal multiplexer's: the reviews keep ticking over. */
function StatusLine() {
  const [n, setN] = useState(12408)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date())
      setN((x) => x + (Math.random() < 0.45 ? 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  return (
    <div className="bg-[#142c88]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-5 gap-y-1 px-6 py-2.5 font-mono text-[11.5px] text-white/55 md:px-12">
        <span className="bg-white px-1.5 text-blue">[turtle]</span>
        <span>0:reviews</span>
        <span>1:docs</span>
        <span>2:status</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 bg-white" />
          all systems steady
        </span>
        <span className="tabular-nums">{n.toLocaleString('en-US')} reviews today</span>
        <span className="ml-auto tabular-nums">UTC {time}</span>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="text-white" style={{ background: SEA_FLOOR }}>
      <section className="relative overflow-hidden">
        <Scene />
        <div className="relative mx-auto grid max-w-[1240px] gap-10 px-6 pt-20 pb-[340px] lg:pt-24 lg:pb-[390px] md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:items-end">
          <div>
            <h2 className="headline text-[clamp(2.8rem,6vw,5rem)]">Ship like a turtle.</h2>
            <p className="mt-5 max-w-[30rem] text-[18px] leading-relaxed text-white/75">
              Your next pull request gets read properly. Free for open source, two minutes to install, and quiet until it
              has something worth saying.
            </p>
          </div>
          <Install />
        </div>
      </section>

      <div className="mx-auto max-w-[1240px]">
        <div className="grid grid-cols-2 gap-10 border-t border-white/15 px-6 pt-14 pb-10 md:px-12 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div className="col-span-2 lg:col-span-1">
            <a href="#top" aria-label="turtle home">
              <Wordmark night />
            </a>
            <p className="mt-4 max-w-[16rem] text-[14.5px] leading-relaxed text-white/60">
              The code reviewer that reads first. Pictures from The Met's open access collection.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className="font-mono text-[12px] text-white/50">{c.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-[14px] text-white/80">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <DotWordmark />
      </div>
      <StatusLine />
    </footer>
  )
}
