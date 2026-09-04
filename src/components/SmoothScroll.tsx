import Lenis from "lenis"
import { useEffect } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

// The live Lenis instance, exposed so route changes and cross-page anchor links
// can drive smooth programmatic scrolling through the same engine that handles
// wheel input. Null under reduced-motion (Lenis never starts) — callers fall
// back to native scrolling.
let lenisInstance: Lenis | null = null

/* Scrolling to a pinned section lands on the first frame of its scene, which for
   the services rig is an empty stage with the quote still assembling — someone
   who clicked a service name in the footer wants the cards, not the intro. So
   that one anchor resolves to the tail of its pinned range instead, where the
   cards have folded up and the section reads as itself. The other pinned scenes
   (the hero, the portfolio slider) do want their opening frame, so this stays
   scoped to #services rather than applying to pins in general. */
const SERVICES_ANCHOR = "#services"
const PIN_TAIL = 240 // px short of the pin's end, so the scene isn't mid-handoff

function resolveAnchor(target: string): string | number {
  if (target !== SERVICES_ANCHOR) return target
  const el = document.querySelector<HTMLElement>(target)
  if (!el) return target
  // Phones and reduced motion run the same scene unpinned, with no trigger to
  // find — there the element's own position is already the right landing spot.
  const pin = ScrollTrigger.getAll().find((st) => st.trigger === el && st.pin)
  if (!pin) return target
  return Math.max(pin.start, pin.end - PIN_TAIL)
}

/** Smoothly scroll to a target: a number (pixel offset), a selector, or a hash
 * like "#contact". Routes through Lenis when it's running, otherwise falls back
 * to native scrolling so reduced-motion users still land in the right place. */
export function scrollToTarget(target: string | number) {
  const resolved = typeof target === "string" ? resolveAnchor(target) : target
  if (lenisInstance) {
    // Clear the fixed nav pill for element targets; land flush at the very top for 0.
    const offset = typeof resolved === "number" ? 0 : -88
    lenisInstance.scrollTo(resolved, { offset })
    return
  }
  if (typeof resolved === "number") {
    window.scrollTo({ top: resolved, behavior: "smooth" })
  } else {
    document.querySelector(resolved)?.scrollIntoView({ behavior: "smooth" })
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
