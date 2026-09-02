import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

/** Brief branded overlay that wipes away once, before the Hero settles in.
 * Skipped entirely for reduced-motion users.
 *
 * Deliberately never unmounts — it animates to a fully hidden state and stays
 * mounted (display: none) forever after. An earlier version used
 * AnimatePresence to remove it from the tree on exit, which raced with GSAP's
 * ScrollTrigger DOM work (pin-spacer insertion in Hero) closely enough to
 * throw a commit-phase "removeChild" error with no error boundary above it —
 * React then unmounted the whole app, leaving whatever was last painted stuck
 * on screen (invisible on the dark hero, but a blank/black screen on the
 * light About page). Never unmounting sidesteps the race entirely. */
export function PageIntro() {
  const reduce = useReducedMotion()
  // Reduced-motion users never render the overlay at all — nothing to wipe.
  const [visible, setVisible] = useState(!reduce)
  // Hard failsafe: whatever the wipe animation does, the overlay is fully gone
  // shortly after it should have finished (1100ms trigger + 700ms wipe). Guards
  // against the clip-path transition stalling — backgrounded tab, dropped frames,
  // a motion-value glitch — and leaving a full-screen void panel stuck over the
  // page. `display: none` rather than an unmount, to keep clear of the
  // ScrollTrigger reconciliation race documented above.
  const [forceGone, setForceGone] = useState(false)

  useEffect(() => {
    if (reduce) return
    const wipe = setTimeout(() => setVisible(false), 1100)
    const kill = setTimeout(() => setForceGone(true), 2400)
    return () => {
      clearTimeout(wipe)
      clearTimeout(kill)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{ background: "var(--color-void)", display: forceGone ? "none" : undefined }}
      initial={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      animate={visible ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.span
        className="font-display text-2xl tracking-tight"
        style={{ color: "var(--color-ink)" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        Godinez <span style={{ color: "var(--color-rose)" }}>&amp; Wittwer</span>
      </motion.span>
    </motion.div>
  )
}
