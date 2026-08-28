import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type TargetAndTransition,
} from "framer-motion"
import type { CSSProperties, MouseEvent, ReactNode } from "react"

type MagneticButtonProps = {
  as?: "a" | "button"
  href?: string
  type?: "button" | "submit"
  onClick?: () => void
  className?: string
  style?: CSSProperties
  whileHover?: TargetAndTransition
  children: ReactNode
}

/** Button that gently pulls toward the cursor on hover, snapping back on leave. */
export function MagneticButton({
  as = "a",
  href,
  type,
  onClick,
  className,
  style,
  whileHover,
  children,
}: MagneticButtonProps) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.25 })
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.25 })

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const motionStyle = { ...style, x: springX, y: springY }

  if (as === "button") {
    return (
      <motion.button
        type={type ?? "button"}
        onClick={onClick}
        className={className}
        style={motionStyle}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={whileHover}
        whileTap={{ scale: 0.96 }}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={className}
      style={motionStyle}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={whileHover}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  )
}
