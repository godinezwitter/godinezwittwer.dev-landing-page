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

    // Pinned sections (Hero, Portfolio) insert/resize pin-spacers, which
    // changes document height — without telling Lenis to re-measure its
    // scroll bounds on every ScrollTrigger refresh, Lenis's cached limit
    // can drift out of sync with the real layout. That desync is what let
    // the scrubbed animations "stick" after a full scroll-down/scroll-up
    // cycle: Lenis's stale bounds clamped its reported scroll position, so
    // ScrollTrigger never saw it re-enter a trigger's range on the next
    // scroll-down.
    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener("refresh", onRefresh)
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return null
}
