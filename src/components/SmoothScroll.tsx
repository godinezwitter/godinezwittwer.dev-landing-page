import Lenis from "lenis"
import { useEffect } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

// The live Lenis instance, exposed so route changes and cross-page anchor links
// can drive smooth programmatic scrolling through the same engine that handles
// wheel input. Null under reduced-motion (Lenis never starts) — callers fall
// back to native scrolling.
let lenisInstance: Lenis | null = null

/** Smoothly scroll to a target: a number (pixel offset), a selector, or a hash
 * like "#contact". Routes through Lenis when it's running, otherwise falls back
 * to native scrolling so reduced-motion users still land in the right place. */
export function scrollToTarget(target: string | number) {
  if (lenisInstance) {
    // Clear the fixed nav pill for element targets; land flush at the very top for 0.
    const offset = typeof target === "number" ? 0 : -88
    lenisInstance.scrollTo(target, { offset })
    return
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
  }
}

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
    lenisInstance = lenis

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
      lenisInstance = null
    }
  }, [])

  return null
}
