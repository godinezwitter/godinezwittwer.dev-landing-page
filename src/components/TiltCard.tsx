import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion"
import type { CSSProperties, MouseEvent, ReactNode } from "react"

type TiltCardProps = {
  className?: string
  style?: CSSProperties
  maxTilt?: number
  children: ReactNode
  motionProps?: Omit<
    HTMLMotionProps<"div">,
    "style" | "className" | "children" | "onMouseMove" | "onMouseLeave"
  >
}

/** Card that tilts in 3D toward the cursor position, on top of any entrance/hover motion passed via motionProps. */
export function TiltCard({ className, style, maxTilt = 8, children, motionProps }: TiltCardProps) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 250,
    damping: 25,
  })
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 250,
    damping: 25,
  })

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      {...motionProps}
      className={className}
      style={{
        ...style,
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 800,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
