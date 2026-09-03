import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

interface ImageRevealBackgroundProps {
  /** Always visible everywhere in the frame. */
  baseImage: string
  /** Only visible inside the spotlight that follows the cursor / scroll. */
  revealImage: string
  /** Classes for the outer frame — size, position, rounding, overflow. Both
   * image layers fill it via absolute inset-0. */
  className?: string
}

const MIN_RADIUS = 160
const MAX_RADIUS = 420
const EASE = 0.1
// White where the reveal image should show through, fading to transparent —
// used as the mask, so alpha here maps directly to reveal opacity.
const GRADIENT_STOPS: [number, string][] = [
  [0, "rgba(255,255,255,1)"],
  [0.4, "rgba(255,255,255,1)"],
  [0.6, "rgba(255,255,255,0.75)"],
  [0.75, "rgba(255,255,255,0.4)"],
  [0.88, "rgba(255,255,255,0.12)"],
  [1, "rgba(255,255,255,0)"],
]

const DESKTOP_QUERY = "(min-width: 1024px)"

/** A soft circular spotlight over `revealImage`, cut with a canvas-drawn
 * radial-gradient mask so the edge fades instead of hard-cutting. The
 * spotlight follows two inputs, whichever moved most recently wins each
 * frame: the cursor (classic hover-reveal), and — since a resting cursor
 * or a trackpad scroll gesture never fires mousemove — the scroll position,
 * mapped onto a slow Lissajous sweep so the card "reveals itself" as the
 * page moves even if nobody's hand is on the mouse.
 *
 * Desktop only: the mask math assumes a moving pointer, so screens under
 * the `lg` breakpoint (and prefers-reduced-motion) get a plain static crop
 * of the reveal image instead of the interactive rig. */
export function ImageRevealBackground({ baseImage, revealImage, className }: ImageRevealBackgroundProps) {
  const reduce = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)
  const containerRef = useRef<HTMLDivElement>(null)
  const revealLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const interactive = isDesktop && !reduce

  useEffect(() => {
    if (!interactive) return
    const container = containerRef.current
    const revealLayer = revealLayerRef.current
    if (!container || !revealLayer) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let lastMouseTime = 0
    let lastScrollTime = performance.now()
    const smooth = { ...mouse }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      lastMouseTime = performance.now()
    }
    window.addEventListener("mousemove", onMouseMove)

    const onScroll = () => {
      lastScrollTime = performance.now()
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    let raf = 0
    const tick = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        const w = Math.round(rect.width)
        const h = Math.round(rect.height)
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w
          canvas.height = h
        }

        let target = mouse
        if (lastScrollTime > lastMouseTime) {
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const t = window.scrollY * 0.004
          target = {
            x: cx + Math.sin(t) * rect.width * 0.3,
            y: cy + Math.cos(t * 1.3) * rect.height * 0.28,
          }
        }

        smooth.x += (target.x - smooth.x) * EASE
        smooth.y += (target.y - smooth.y) * EASE

        const cx = smooth.x - rect.left
        const cy = smooth.y - rect.top
        const radius = Math.round(Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, window.innerWidth * 0.16)))

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        for (const [stop, color] of GRADIENT_STOPS) gradient.addColorStop(stop, color)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL()
        revealLayer.style.maskImage = `url(${dataUrl})`
        revealLayer.style.webkitMaskImage = `url(${dataUrl})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [interactive])

  const layerStyle = (image: string): React.CSSProperties => ({
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  })

  if (!interactive) {
    return (
      <div className={className} aria-hidden="true">
        <div className="absolute inset-0" style={layerStyle(revealImage)} />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <div className="absolute inset-0" style={layerStyle(baseImage)} />
      <div
        ref={revealLayerRef}
        className="absolute inset-0"
        style={{ ...layerStyle(revealImage), maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } as React.CSSProperties}
      />
    </div>
  )
}
