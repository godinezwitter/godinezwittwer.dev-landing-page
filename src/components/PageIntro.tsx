import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { gsap } from "@/lib/gsap"

/** Brief branded overlay that wipes away once, before the Hero settles in —
 * a GSAP timeline in the vein of the "loader" pattern several Webflow studio
 * sites use (neutomni.com, for one — its DOM/scripts were inspected, not its
 * code copied). Three beats: the vector wordmark drops in from well above its
 * resting spot, a scissors icon travels the full width of the screen along a
 * dashed line while a solid trail "cuts" in behind it, then the two solid
 * panels — which held the screen the whole time — retract apart to reveal
 * the Hero. Skipped entirely for reduced-motion users.
 *
 * The cut line lives inside the top panel, pinned to its bottom edge, rather
 * than floating independently at a fixed viewport position — that's what
 * makes the panels visually split open exactly along the line instead of at
 * some unrelated 50/50 seam. Whatever height the top panel currently has,
 * the line sits right at its (shrinking) bottom edge throughout the wipe.
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
  const solidLineRef = useRef<HTMLDivElement>(null)
  const scissorsRef = useRef<HTMLDivElement>(null)
  // Hard failsafe, independent of the GSAP timeline's own onComplete: whatever
  // the wipe does, the overlay is fully gone shortly after it should have
  // finished (~2.9s of timeline). Guards against a stalled tween — backgrounded
  // tab, dropped frames — leaving a full-screen panel stuck over the page.
  const [forceGone, setForceGone] = useState(false)

  useEffect(() => {
    if (reduce) return
    const top = topRef.current
    const bottom = bottomRef.current
    const solidLine = solidLineRef.current
    const scissors = scissorsRef.current
    const words = wordRefs.current.filter((el): el is SVGTSpanElement => el !== null)
    if (!top || !bottom || !solidLine || !scissors) return

    const tl = gsap.timeline({ onComplete: () => setForceGone(true) })
    tl.set(words, { opacity: 0, y: -120 })
    tl.set(scissors, { left: "-2%" })
    tl.set(solidLine, { width: "0%" })

    // Beat 1: the wordmark drops in from well above its resting spot, each
    // word settling with a touch of overshoot rather than just cross-fading in.
    tl.to(words, { opacity: 1, y: 0, duration: 0.75, ease: "back.out(1.6)", stagger: 0.15 }, 0.1)
    // Beat 2: the scissors travel the full width of the screen along the
    // dashed line; the solid trail's width is tweened in lockstep ("<") so
    // it reads as the line being cut/drawn by the scissors' position.
    tl.to(scissors, { left: "100%", duration: 0.85, ease: "power2.inOut" }, 1.1)
    tl.to(solidLine, { width: "100%", duration: 0.85, ease: "power2.inOut" }, "<")
    tl.to({}, { duration: 0.3 }) // hold so the cut reads before the wipe starts
    // Beat 3: the two panels retract apart along the cut line, revealing the
    // Hero underneath.
    tl.to(top, { height: "0%", duration: 0.7, ease: "power4.inOut" }, ">")
    tl.to(bottom, { height: "0%", duration: 0.7, ease: "power4.inOut" }, "<")

    const kill = setTimeout(() => setForceGone(true), 3400)
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
        className="absolute top-0 left-0 w-full flex flex-col items-center justify-end overflow-hidden"
        style={{ height: "50%", background: "var(--color-rose)" }}
      >
        <svg viewBox="0 0 640 100" className="w-[min(88vw,640px)] h-auto mb-10" aria-label="Godinez & Wittwer">
          <text
            x="50%"
            y="72"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "68px" }}
          >
            <tspan ref={(el) => { wordRefs.current[0] = el }} style={{ fill: "var(--color-ink)" }}>
              Godinez{" "}
            </tspan>
            <tspan ref={(el) => { wordRefs.current[1] = el }} style={{ fill: "var(--color-ink)" }}>
              &amp; Wittwer
            </tspan>
          </text>
        </svg>

        {/* Dashed "cut line" — full page width, pinned to the panel's bottom
            edge so the wipe always splits open exactly along it. A scissors
            icon travels along it while a solid trail fills in behind. */}
        <div className="relative w-full h-4 shrink-0">
          <svg
            className="absolute inset-x-0 top-1/2 w-full"
            style={{ transform: "translateY(-50%)" }}
            height="2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="0" y1="1" x2="100%" y2="1" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>
          <div
            ref={solidLineRef}
            className="absolute left-0 top-1/2 h-[2px]"
            style={{ width: "0%", background: "var(--color-ink)", transform: "translateY(-50%)" }}
          />
          <div
            ref={scissorsRef}
            className="absolute top-1/2"
            style={{ left: "-2%", transform: "translate(-50%, -50%)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="6" r="2.4" stroke="var(--color-ink)" strokeWidth="1.6" />
              <circle cx="6" cy="18" r="2.4" stroke="var(--color-ink)" strokeWidth="1.6" />
              <path d="M8 8L20 20M8 16L20 4" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div
        ref={bottomRef}
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "50%", background: "var(--color-rose)" }}
      />
    </div>
  )
}
