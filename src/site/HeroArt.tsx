import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from './hooks'

// Utagawa Hiroshige, Mannen Bridge, Fukagawa, 1858. The Met, CC0. Two copies of the same crop: one
// posterized to 130 pixels across, one at full resolution in the same blues.
const PIXELS = '/art/px/mannen.png'
const DETAIL = '/art/px/mannen-hi.webp'
const CROP = 0.66 // of the print's height, from the top: the turtle, the river and Fuji

// An 8×8 ordered-dither matrix, so the pixels arrive in a pattern rather than a wipe.
const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21]

/**
 * The print as 130 pixels of blue, and a loupe that shows what is really there. Everyone else skims
 * the pixels; under the loupe the print is at full resolution. It drifts over the turtle by itself and
 * follows the pointer when there is one.
 */
export function HeroArt({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const box = wrap.current
    const cv = canvas.current
    if (!box || !cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const px = new Image()
    const hi = new Image()
    px.src = PIXELS
    hi.src = DETAIL
    let raf = 0
    let visible = true
    let w = 0
    let h = 0
    let dpr = 1
    let start = 0
    let cols = 0
    let rows = 0
    let base: ImageData | null = null
    const shown = document.createElement('canvas')
    const sx = shown.getContext('2d')
    const pointer = { x: 0, y: 0, inside: false }
    const lens = { x: -500, y: -500 }

    const size = () => {
      w = box.clientWidth
      h = (w * rows) / cols
      dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      cv.style.height = `${h}px`
    }

    const prepare = () => {
      cols = px.naturalWidth
      rows = Math.round(px.naturalHeight * CROP)
      shown.width = cols
      shown.height = rows
      if (!sx) return
      sx.drawImage(px, 0, 0)
      base = sx.getImageData(0, 0, cols, rows)
      size()
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (!base || !sx || !visible || !hi.complete) return
      if (!start) start = t
      const el = (t - start) / 1000

      // The pixels develop in dither order over the first second.
      const p = reduced ? 1 : Math.min(1, el / 1.1)
      if (p < 1 || el < 1.3) {
        const out = sx.createImageData(cols, rows)
        const cut = p * 64
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const k = (j * cols + i) * 4
            if (BAYER[(j % 8) * 8 + (i % 8)] < cut) {
              out.data[k] = base.data[k]
              out.data[k + 1] = base.data[k + 1]
              out.data[k + 2] = base.data[k + 2]
              out.data[k + 3] = 255
            }
          }
        }
        sx.putImageData(out, 0, 0)
      }

      let tx: number
      let ty: number
      if (pointer.inside) {
        tx = pointer.x
        ty = pointer.y
      } else if (!reduced) {
        tx = w * (0.6 + 0.17 * Math.sin(el * 0.33 + 0.4))
        ty = h * (0.56 + 0.13 * Math.sin(el * 0.51 + 2.1))
      } else {
        tx = w * 0.62
        ty = h * 0.52
      }
      const k = lens.x < -100 ? 1 : 0.1
      lens.x += (tx - lens.x) * k
      lens.y += (ty - lens.y) * k

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(shown, 0, 0, w, h)

      // The loupe: the full-resolution print, twice the size it would be on the page.
      const R = Math.max(56, Math.min(98, w * 0.17))
      const Z = 2
      const HW = hi.naturalWidth
      const HH = hi.naturalHeight * CROP
      const scale = (w / HW) * Z
      const sw = (2 * R) / scale
      ctx.globalAlpha = reduced ? 1 : Math.min(1, Math.max(0, (el - 1.1) * 2.5))
      ctx.save()
      ctx.beginPath()
      ctx.arc(lens.x, lens.y, R, 0, Math.PI * 2)
      ctx.clip()
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(hi, (lens.x / w) * HW - sw / 2, (lens.y / h) * HH - sw / 2, sw, sw, lens.x - R, lens.y - R, 2 * R, 2 * R)
      ctx.restore()
      ctx.lineWidth = 5
      ctx.strokeStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(lens.x, lens.y, R + 1.5, 0, Math.PI * 2)
      ctx.stroke()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#2563eb'
      ctx.beginPath()
      ctx.arc(lens.x, lens.y, R + 4.5, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.inside = e.pointerType === 'mouse'
    }
    const onLeave = () => {
      pointer.inside = false
    }

    const ro = new ResizeObserver(() => {
      if (base) size()
    })
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    px.onload = () => {
      prepare()
      ro.observe(box)
    }
    io.observe(box)
    box.addEventListener('pointermove', onMove)
    box.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      box.removeEventListener('pointermove', onMove)
      box.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <div ref={wrap} className={cn('relative cursor-crosshair select-none', className)}>
      <canvas
        ref={canvas}
        className="block w-full"
        role="img"
        aria-label="Hiroshige's print of a turtle hanging from Mannen Bridge, in blue pixels, with a loupe showing the print at full resolution"
      />
    </div>
  )
}
