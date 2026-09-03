import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

interface VideoRevealBackgroundProps {
  src: string
  /** Classes for the outer frame — size, position, rounding, overflow. */
  className?: string
}

const MIN_RADIUS = 140
const MAX_RADIUS = 360
const EASE = 0.1
const GRADIENT_STOPS: [number, string][] = [
  [0, "rgba(255,255,255,1)"],
  [0.4, "rgba(255,255,255,1)"],
  [0.6, "rgba(255,255,255,0.75)"],
  [0.75, "rgba(255,255,255,0.4)"],
  [0.88, "rgba(255,255,255,0.12)"],
  [1, "rgba(255,255,255,0)"],
]

const DESKTOP_QUERY = "(min-width: 1024px)"
// The source clip is a light halftone figure on solid black. Inverting flips
// that to a dark figure on white, so multiplying onto the paper behind it
// makes the (now white) former-background disappear into the paper and
// leaves only the figure as ink — no green-screen keying required.
const INK_FILTER = "invert(1)"

/** The halftone walking figure, read as ink on the studio's paper rather than
 * footage in a box: inverted + multiply-blended so its black backing
 * disappears into --color-paper and only the figure marks the page. Two
 * copies stack — a faint one always playing, a fully-inked one visible only
 * inside a spotlight — so the figure sharpens where the spotlight lands
 * instead of just sitting there uniformly, the same trick ImageRevealBackground
 * used with two still images. The spotlight itself is copied verbatim from
 * that component: cursor-follow, with a scroll-driven Lissajous sweep taking
 * over when scrolling is the more recent input (a resting cursor or trackpad
 * scroll never fires mousemove).
 *
 * Desktop only: below the `lg` breakpoint, or under prefers-reduced-motion,
 * there's no pointer to drive the mask, so it falls back to one plain video
 * layer at full ink strength (paused on a still frame under reduced motion). */
export function VideoRevealBackground({ src, className }: VideoRevealBackgroundProps) {
  const reduce = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)
  const containerRef = useRef<HTMLDivElement>(null)
  const revealVideoRef = useRef<HTMLVideoElement>(null)
  const staticVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const interactive = isDesktop && !reduce

  // Reduced motion: freeze the single fallback video on one representative
  // frame instead of looping it — a moving background is exactly what that
  // preference asks to remove.
  useEffect(() => {
    if (!reduce) return
    const video = staticVideoRef.current
    if (!video) return
    const onLoaded = () => {
      video.currentTime = Math.min(2.5, video.duration / 2)
      video.pause()
    }
    video.addEventListener("loadedmetadata", onLoaded)
    return () => video.removeEventListener("loadedmetadata", onLoaded)
  }, [reduce])

  useEffect(() => {
    if (!interactive) return
    const container = containerRef.current
    const revealVideo = revealVideoRef.current
    if (!container || !revealVideo) return

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
        const radius = Math.round(Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, window.innerWidth * 0.14)))

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        for (const [stop, color] of GRADIENT_STOPS) gradient.addColorStop(stop, color)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL()
        revealVideo.style.maskImage = `url(${dataUrl})`
        revealVideo.style.webkitMaskImage = `url(${dataUrl})`
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

  const videoProps = {
    src,
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
    className: "absolute inset-0 w-full h-full object-cover",
  }

  if (!interactive) {
    return (
      <div className={className} style={{ background: "var(--color-paper)" }} aria-hidden="true">
        <video
          ref={staticVideoRef}
          {...videoProps}
          autoPlay={!reduce}
          style={{ filter: INK_FILTER, mixBlendMode: "multiply" }}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className} style={{ background: "var(--color-paper)" }} aria-hidden="true">
      <video {...videoProps} style={{ filter: INK_FILTER, mixBlendMode: "multiply", opacity: 0.24 }} />
      <video
        ref={revealVideoRef}
        {...videoProps}
        style={{ filter: INK_FILTER, mixBlendMode: "multiply" } as React.CSSProperties}
      />
    </div>
  )
}
