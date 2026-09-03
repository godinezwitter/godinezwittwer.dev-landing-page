import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { gsap } from "@/lib/gsap"

/** Brief branded overlay that wipes away once, before the Hero settles in —
 * a GSAP timeline driving two solid panels apart (top panel retracts up,
 * bottom panel retracts down) over a vector SVG wordmark, in the vein of
 * the "loader" pattern several Webflow studio sites use (neutomni.com,
 * for one) instead of this project's earlier single clip-path fade.
 * Skipped entirely for reduced-motion users.
 *
 * Deliberately never unmounts — it runs the timeline once and stays mounted
 * (display: none) forever after. An earlier version used AnimatePresence to
 * remove it from the tree on exit, which raced with GSAP's ScrollTrigger DOM
 * work (pin-spacer insertion in Hero) closely enough to throw a commit-phase
 * "removeChild" error with no error boundary above it — React then unmounted
 * the whole app, leaving whatever was last painted stuck on screen (invisible
 * on the dark hero, but a blank/black screen on the light About page).
 * Never unmounting sidesteps the race entirely. */
export function PageIntro() {
  const reduce = useReducedMotion()
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(SVGTSpanElement | null)[]>([])
  // Hard failsafe, independent of the GSAP timeline's own onComplete: whatever
  // the wipe does, the overlay is fully gone shortly after it should have
  // finished (~1.9s of timeline). Guards against a stalled tween — backgrounded
  // tab, dropped frames — leaving a full-screen void panel stuck over the page.
  const [forceGone, setForceGone] = useState(false)

  useEffect(() => {
    if (reduce) return
    const top = topRef.current
    const bottom = bottomRef.current
    const words = wordRefs.current.filter((el): el is SVGTSpanElement => el !== null)
    if (!top || !bottom) return

    const tl = gsap.timeline({ onComplete: () => setForceGone(true) })
    tl.set(words, { opacity: 0 })
    tl.to(words, { opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.12 }, 0.1)
    tl.to({}, { duration: 0.5 }) // hold so the wordmark reads before the wipe starts
    tl.to(top, { height: "0%", duration: 0.7, ease: "power4.inOut" }, ">")
    tl.to(bottom, { height: "0%", duration: 0.7, ease: "power4.inOut" }, "<")

    const kill = setTimeout(() => setForceGone(true), 2400)
    return () => {
      tl.kill()
      clearTimeout(kill)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
      style={{ display: forceGone ? "none" : undefined }}
      aria-hidden="true"
    >
      <div
        ref={topRef}
        className="absolute top-0 left-0 w-full"
        style={{ height: "50%", background: "var(--color-void)" }}
      />
      <div
        ref={bottomRef}
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "50%", background: "var(--color-void)" }}
      />
      <svg
        viewBox="0 0 400 60"
        className="absolute top-1/2 left-1/2 w-[min(78vw,360px)] h-auto"
        style={{ transform: "translate(-50%, -50%)" }}
        aria-label="Godinez & Wittwer"
      >
        <text
          x="50%"
          y="44"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "40px" }}
        >
          <tspan ref={(el) => { wordRefs.current[0] = el }} style={{ fill: "var(--color-ink)" }}>
            Godinez{" "}
          </tspan>
          <tspan ref={(el) => { wordRefs.current[1] = el }} style={{ fill: "var(--color-rose)" }}>
            &amp; Wittwer
          </tspan>
        </text>
      </svg>
    </div>
  )
}
