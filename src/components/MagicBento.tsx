import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { useRef, type PointerEvent, type ReactNode } from "react"
import "./MagicBento.css"

/** How far beyond a card's own radius the cursor can be before its border ring fades out. */
const PROXIMITY = 220

type GridProps = { children: ReactNode } & HTMLMotionProps<"div">

/**
 * Grid wrapper that drives the Magic Bento effect: a single pointer handler
 * updates a grid-level spotlight and each card's proximity-based border glow via
 * CSS custom properties, batched into one rAF. Accepts Framer motion props so it
 * can act as the stagger parent for its cards.
 */
export function MagicBentoGrid({ children, className = "", ...motionProps }: GridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const frame = useRef(0)

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return
    const grid = ref.current
    if (!grid) return
    const { clientX, clientY } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const gridRect = grid.getBoundingClientRect()
      grid.style.setProperty("--spot-x", `${clientX - gridRect.left}px`)
      grid.style.setProperty("--spot-y", `${clientY - gridRect.top}px`)
      grid.style.setProperty("--spot-o", "1")

      grid.querySelectorAll<HTMLElement>("[data-bento-card]").forEach((card) => {
        const r = card.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dist = Math.hypot(clientX - cx, clientY - cy)
        const reach = Math.max(r.width, r.height) / 2 + PROXIMITY
        const intensity = Math.max(0, 1 - dist / reach)
        card.style.setProperty("--glow-intensity", intensity.toFixed(3))
        card.style.setProperty("--glow-x", `${clientX - r.left}px`)
        card.style.setProperty("--glow-y", `${clientY - r.top}px`)
      })
    })
  }

  const handleLeave = () => {
    const grid = ref.current
    if (!grid) return
    cancelAnimationFrame(frame.current)
    grid.style.setProperty("--spot-o", "0")
    grid
      .querySelectorAll<HTMLElement>("[data-bento-card]")
      .forEach((card) => card.style.setProperty("--glow-intensity", "0"))
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`magic-bento ${className}`}
      {...motionProps}
    >
      <span className="magic-bento__spotlight" aria-hidden="true" />
      {children}
    </motion.div>
  )
}

type CardProps = { children: ReactNode } & HTMLMotionProps<"article">

/** A single bento card. The border-ring glow is handled in CSS via ::after. */
export function MagicBentoCard({ children, className = "", ...motionProps }: CardProps) {
  return (
    <motion.article data-bento-card className={`magic-card ${className}`} {...motionProps}>
      {children}
    </motion.article>
  )
}
