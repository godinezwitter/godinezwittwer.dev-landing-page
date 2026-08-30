import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

/** Brief branded overlay that wipes away once, before the Hero settles in. Skipped entirely for reduced-motion users. */
export function PageIntro() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(!reduce)

  useEffect(() => {
    if (reduce) return
    const timer = setTimeout(() => setShow(false), 1100)
    return () => clearTimeout(timer)
  }, [reduce])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{ background: "var(--color-void)" }}
          initial={{ opacity: 1 }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="font-display text-2xl tracking-tight"
            style={{ color: "var(--color-ink)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Godinez <span style={{ color: "var(--color-rose)" }}>&amp; Witter</span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
