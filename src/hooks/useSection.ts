import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

/** Reveal trigger for a scroll-in section, with a failsafe.
 *
 * `useInView({ once: true })` rides an IntersectionObserver. A fast flick-scroll
 * can carry the viewport past a section before the observer fires its crossing;
 * in `once` mode the section then stays stuck in its hidden variant (clipped +
 * opacity 0 — i.e. a blank band) until the user scrolls back up through it. The
 * fallback watches for "we've already scrolled past this and it never revealed"
 * and forces it visible, so a section can never stay blank. */
export function useSection() {
  const ref = useRef<HTMLElement>(null)
  const io = useInView(ref, { once: true, margin: "-15% 0px" })
  const [passedWhileHidden, setPassedWhileHidden] = useState(false)

  useEffect(() => {
    if (io || passedWhileHidden) return
    let raf = 0
    const check = () => {
      const el = ref.current
      if (!el) return
      // Bottom of the section is above the middle of the viewport => scrolled
      // past without ever revealing. (Normal-speed scrolling reveals it via the
      // observer long before this is true.)
      if (el.getBoundingClientRect().bottom < window.innerHeight * 0.5) {
        setPassedWhileHidden(true)
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    const settle = window.setTimeout(check, 1200) // catch load-scrolled-past (deep link / refresh)
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
    }
  }, [io, passedWhileHidden])

  return { ref, inView: io || passedWhileHidden }
}
