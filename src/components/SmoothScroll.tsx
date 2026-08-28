import Lenis from "lenis"
import { useEffect } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

/** Buttery inertial scroll wired into GSAP's ticker so ScrollTrigger reads
 * smoothed values instead of raw wheel/trackpad deltas — this is what gives
 * the pinned scroll-driven scenes (Hero, Portfolio slider) their natural,
 * decelerating feel instead of a jumpy 1:1 scroll response. Skipped entirely
 * under prefers-reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on("scroll", ScrollTrigger.update)

    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return null
}
