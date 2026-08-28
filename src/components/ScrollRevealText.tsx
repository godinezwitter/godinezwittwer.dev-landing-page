import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Fragment, useRef, type CSSProperties } from "react"

type WordProps = {
  word: string
  progress: MotionValue<number>
  range: [number, number]
  fromColor: string
  toColor: string
}

function Word({ word, progress, range, fromColor, toColor }: WordProps) {
  const color = useTransform(progress, range, [fromColor, toColor])
  return (
    <motion.span style={{ color }} className="inline-block">
      {word}
    </motion.span>
  )
}

type ScrollRevealTextProps = {
  text: string
  className?: string
  style?: CSSProperties
  /** Color words start as, before being "read" by the scroll position. */
  fromColor: string
  /** Color words settle into once revealed. */
  toColor: string
}

/** Words transition from fromColor to toColor as the paragraph scrolls through view, scrubbed to scroll position in both directions. */
export function ScrollRevealText({ text, className, style, fromColor, toColor }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  })
  const words = text.split(" ")

  if (reduce) {
    return (
      <p ref={ref} className={className} style={{ ...style, color: toColor }}>
        {text}
      </p>
    )
  }

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1.4 / words.length
        return (
          <Fragment key={`${word}-${i}`}>
            <Word
              word={word}
              progress={scrollYProgress}
              range={[start, Math.min(end, 1)]}
              fromColor={fromColor}
              toColor={toColor}
            />
            {i < words.length - 1 ? " " : null}
          </Fragment>
        )
      })}
    </p>
  )
}
