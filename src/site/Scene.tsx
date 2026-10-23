import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from './hooks'
import { SPRITES, type Palette } from './cast'

/*
 * The fable at night, in pixels: a moon coming up over the sea, Fuji in the distance, the hare asleep
 * under the pines, and the turtle swimming past. It crosses the whole width in about four minutes.
 */

export const SEA_FLOOR = '#1a35a0' // the last row of the sea, and the colour the footer carries on in

const SKY = ['#1a35a0', '#1d3bab', '#2041b6', '#2347c1', '#264dcc', '#2a54d6', '#2e5ae0']
const SEA = ['#2b55da', '#2850d0', '#2449c4', '#2142b8', '#1e3cac', '#1b37a3', SEA_FLOOR]
const SHORE = '#122a80'
const HILL = '#2245bd'
const SNOW = '#b9cdfa'
const MOON = '#eef3fe'
const GLOW = '#3866ea'
const GLINT = ['#3f6cec', '#6f97f2', '#b9cdfa', '#eef3fe']
const SWIMMER: Palette = { '#': '#4a74ee', '+': '#9db8f7', o: '#c3d4fb', k: SHORE }
const SLEEPER: Palette = { o: '#9db8f7', w: '#eef3fe', k: SHORE }
const ZED = ['####', '..#.', '.#..', '####']

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const dither = (x: number, y: number) => (BAYER4[(y & 3) * 4 + (x & 3)] + 0.5) / 16

// A small seeded generator, so the stars and the waves stay put between visits.
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const hex = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]

export function Scene({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const cv = canvas.current
    const box = cv?.parentElement
    if (!cv || !box) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    let hz = 0
    let still: HTMLCanvasElement | null = null
    let stars: { x: number; y: number; p: number; s: number }[] = []
    let waves: { x: number; y: number; len: number; v: number; p: number }[] = []
    let moon = { x: 0, y: 0, r: 9 }
    let island = { x: 0, w: 0 }
    let raf = 0
    let last = 0
    let visible = true
    const born = performance.now()

    const put = (img: ImageData, x: number, y: number, c: number[]) => {
      if (x < 0 || y < 0 || x >= W || y >= H) return
      const k = (y * W + x) * 4
      img.data[k] = c[0]
      img.data[k + 1] = c[1]
      img.data[k + 2] = c[2]
      img.data[k + 3] = 255
    }

    // Everything that does not move, painted once per size.
    const paint = () => {
      const P = box.clientWidth < 640 ? 3 : 4
      W = Math.ceil(box.clientWidth / P)
      H = Math.ceil(box.clientHeight / P)
      // The sea keeps a fixed depth at the bottom, so the shore never slides up under the words above it.
      hz = H - Math.round(Math.min(220, Math.max(150, box.clientHeight * 0.3)) / P)
      cv.width = W
      cv.height = H
      moon = { x: Math.round(W * 0.8), y: hz - 13, r: 9 }
      island = { x: 0, w: Math.max(40, Math.round(W * 0.2)) }

      still = document.createElement('canvas')
      still.width = W
      still.height = H
      const sx = still.getContext('2d')
      if (!sx) return
      const img = sx.createImageData(W, H)
      const sky = SKY.map(hex)
      const sea = SEA.map(hex)
      const band = (pal: number[][], t: number, x: number, y: number) => {
        const f = t * (pal.length - 1)
        const i = Math.floor(f)
        return pal[Math.min(pal.length - 1, f - i > dither(x, y) ? i + 1 : i)]
      }
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          put(img, x, y, y < hz ? band(sky, y / hz, x, y) : band(sea, (y - hz) / Math.max(1, H - hz - 1), x, y))
        }
      }

      // The moon's glow, dithered out into the sky.
      const glow = hex(GLOW)
      for (let y = moon.y - 26; y < hz; y++) {
        for (let x = moon.x - 26; x <= moon.x + 26; x++) {
          const d = Math.hypot(x - moon.x, y - moon.y)
          if (d > moon.r && d < 26 && (1 - (d - moon.r) / (26 - moon.r)) * 0.75 > dither(x, y)) put(img, x, y, glow)
        }
      }
      const disc = hex(MOON)
      const crater = hex('#c9d8fb')
      for (let y = moon.y - moon.r; y <= moon.y + moon.r; y++) {
        for (let x = moon.x - moon.r; x <= moon.x + moon.r; x++) {
          if (y >= hz || Math.hypot(x - moon.x, y - moon.y) > moon.r + 0.3) continue
          const c = (x - moon.x + 3) ** 2 + (y - moon.y + 2) ** 2 < 6 || (x - moon.x - 3) ** 2 + (y - moon.y - 3) ** 2 < 3
          put(img, x, y, c ? crater : disc)
        }
      }

      // Fuji, far off, with snow.
      const fx = Math.round(W * 0.47)
      const fh = Math.min(26, Math.round(H * 0.16))
      const hill = hex(HILL)
      const snow = hex(SNOW)
      for (let r = 0; r < fh; r++) {
        const half = Math.round(3 + r * 1.9 + (r > fh * 0.6 ? (r - fh * 0.6) * 1.2 : 0))
        const y = hz - fh + r
        for (let x = fx - half; x <= fx + half; x++) {
          const capped = r < fh * 0.32 + ((x * 7) % 3) - 1
          put(img, x, y, capped ? snow : hill)
        }
      }

      // The near shore: a low island and its pines, where the hare sleeps.
      const shore = hex(SHORE)
      for (let x = 0; x < island.w + 6; x++) {
        const t = x / (island.w + 6)
        const top = Math.round(4 + Math.sin(t * Math.PI * 0.9) * 5)
        for (let y = hz - top; y <= hz + 1; y++) put(img, x, y, shore)
      }
      const pines = [
        [Math.round(island.w * 0.18), 20],
        [Math.round(island.w * 0.32), 27],
        [Math.round(island.w * 0.44), 17],
      ]
      for (const [px, ph] of pines) {
        const base = hz - 5
        for (let r = 0; r < ph; r++) {
          // Tiers of branches: each widens, then steps back in.
          const tier = r % 6
          const half = Math.round(1 + (r / ph) * 6 + tier * 0.8)
          for (let x = px - half; x <= px + half; x++) put(img, x, base - ph + r, shore)
        }
        for (let y = base; y < hz; y++) put(img, px, y, shore)
      }
      sx.putImageData(img, 0, 0)

      const rand = rng(482)
      stars = Array.from({ length: Math.round(W * 0.16) }, () => ({
        x: Math.floor(rand() * W),
        y: Math.floor(rand() * hz * 0.8),
        p: rand() * 6.28,
        s: 0.6 + rand() * 1.6,
      })).filter((s) => Math.hypot(s.x - moon.x, s.y - moon.y) > 30)
      waves = Array.from({ length: Math.round(W * 0.5) }, () => {
        const d = rand() ** 1.6
        return { x: rand() * W, y: hz + 1 + Math.floor(d * (H - hz - 2)), len: 2 + Math.floor(rand() * (2 + d * 6)), v: 0.6 + rand() * 1.4, p: rand() * 6.28 }
      })
    }

    const sprite = (rows: readonly string[], pal: Palette, x: number, y: number, upto = rows.length) => {
      for (let j = 0; j < upto; j++) {
        const row = rows[j]
        for (let i = 0; i < row.length; i++) {
          const c = pal[row[i] as keyof Palette]
          if (!c) continue
          ctx.fillStyle = c
          ctx.fillRect(x + i, y + j, 1, 1)
        }
      }
    }

    const draw = (now: number) => {
      if (!still) return
      const t = Math.max(0, (now - born) / 1000)
      ctx.drawImage(still, 0, 0)

      for (const s of stars) {
        const b = Math.sin(t * s.s + s.p)
        if (b < -0.2) continue
        ctx.fillStyle = b > 0.8 ? GLINT[3] : GLINT[1]
        ctx.fillRect(s.x, s.y, 1, 1)
      }

      // Waves drift left to right and catch the light as they go.
      for (const w of waves) {
        if (Math.sin(t * 1.3 + w.p) < -0.3) continue
        const x = Math.floor((w.x + t * w.v) % (W + 10)) - 5
        ctx.fillStyle = w.y < hz + (H - hz) * 0.35 ? GLINT[0] : '#2c56da'
        ctx.fillRect(x, w.y, w.len, 1)
      }

      // The moon's road across the water: wider and broken further out.
      for (let y = hz + 1; y < H; y++) {
        const spread = 3 + (y - hz) * 0.32
        const seed = Math.sin(y * 12.9898 + Math.floor(t * 3) * 78.233) * 43758.5453
        const f = seed - Math.floor(seed)
        if (f < 0.25) continue
        const len = 1 + Math.floor(f * spread * 0.7)
        const off = Math.floor((f - 0.5) * spread * 1.4)
        ctx.fillStyle = f > 0.8 ? GLINT[3] : f > 0.5 ? GLINT[2] : GLINT[1]
        ctx.fillRect(moon.x + off - Math.floor(len / 2), y, len, 1)
      }

      // The hare, asleep on the shore, and the z's coming off it.
      const hare = SPRITES.sleeper[0]
      const hx = Math.round(island.w * 0.62)
      const hy = hz - 8 - hare.length + 2
      sprite(hare, SLEEPER, hx, hy)
      for (let k = 0; k < 2; k++) {
        const ph = ((t * 0.35 + k * 0.5) % 1 + 1) % 1
        sprite(ZED, { '#': ph < 0.7 ? GLINT[2] : GLINT[0] }, hx + 15 + Math.round(ph * 6), hy - 4 - Math.round(ph * 12))
      }

      // The turtle, swimming: shell above the water, legs below it, a little wake behind.
      const frames = SPRITES.turtle
      const rows = frames[Math.floor(t * 2) % 2]
      const lane = W + 60
      const tx = Math.floor((W * 0.32 + t * ((W + 60) / 240)) % lane) - 30
      const ty = hz + Math.round((H - hz) * 0.36) + (Math.sin(t * 1.6) > 0 ? 0 : 1)
      sprite(rows, SWIMMER, tx, ty, 6)
      ctx.fillStyle = GLINT[1]
      ctx.fillRect(tx - 1, ty + 6, 24, 1)
      ctx.fillStyle = GLINT[0]
      for (let k = 0; k < 3; k++) ctx.fillRect(tx - 6 - k * 7, ty + 6 + (k % 2), 4 - k, 1)
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || now - last < 80) return
      last = now
      draw(now)
    }

    paint()
    draw(performance.now())
    const ro = new ResizeObserver(() => {
      paint()
      draw(performance.now())
    })
    ro.observe(box)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(cv)
    if (!reduced) raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [reduced])

  return (
    <canvas
      ref={canvas}
      className={cn('px absolute inset-0 size-full', className)}
      role="img"
      aria-label="A pixel night scene: the moon over the sea, Fuji far off, a hare asleep under the pines, and a turtle swimming past"
    />
  )
}
