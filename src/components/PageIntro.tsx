import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { gsap } from "@/lib/gsap"

/** Brief branded overlay that wipes away once, before the Hero settles in —
 * a GSAP timeline in the vein of the "loader" pattern several Webflow studio
 * sites use (neutomni.com, for one — its DOM/scripts were inspected, not its
 * code copied). Three beats: the vector wordmark drops into place letter-
 * group by letter-group, a scissors icon travels along a dashed line while a
 * solid trail "cuts" in behind it, then two solid panels — which held the
 * screen the whole time — retract apart (top up, bottom down) to reveal the
 * Hero. Skipped entirely for reduced-motion users.
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
  // finished (~2.7s of timeline). Guards against a stalled tween — backgrounded
  // tab, dropped frames — leaving a full-screen void panel stuck over the page.
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
    tl.set(words, { opacity: 0, y: -28 })
    tl.set(scissors, { left: "-4%" })
    tl.set(solidLine, { width: "0%" })

    // Beat 1: the wordmark drops into place, each word settling with a touch
    // of overshoot rather than just cross-fading in.
    tl.to(words, { opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.8)", stagger: 0.13 }, 0.1)
    // Beat 2: the scissors travel left to right along the dashed line; the
    // solid trail's width is tweened in lockstep ("<") so it reads as the
    // line being cut/drawn by the scissors' position, not a separate effect.
    tl.to(scissors, { left: "100%", duration: 0.75, ease: "power2.inOut" }, 0.95)
    tl.to(solidLine, { width: "100%", duration: 0.75, ease: "power2.inOut" }, "<")
    tl.to({}, { duration: 0.3 }) // hold so the cut reads before the wipe starts
    // Beat 3: the two panels that have held the screen since mount retract
    // apart, revealing the Hero underneath.
    tl.to(top, { height: "0%", duration: 0.7, ease: "power4.inOut" }, ">")
    tl.to(bottom, { height: "0%", duration: 0.7, ease: "power4.inOut" }, "<")

    const kill = setTimeout(() => setForceGone(true), 3200)
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

      <div
        className="absolute top-1/2 left-1/2 flex flex-col items-center gap-6 w-[min(78vw,380px)]"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <svg viewBox="0 0 400 60" className="w-full h-auto" aria-label="Godinez & Wittwer">
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

        {/* Dashed "cut line" — a scissors icon travels along it while a
            solid trail fills in behind, echoing a perforated-ticket cut. */}
        <div className="relative w-full h-4">
          <svg
            className="absolute inset-x-0 top-1/2 w-full"
            style={{ transform: "translateY(-50%)" }}
            height="2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--color-ink-muted)" strokeWidth="1.5" strokeDasharray="5 5" />
          </svg>
          <div
            ref={solidLineRef}
            className="absolute left-0 top-1/2 h-[2px]"
            style={{ width: "0%", background: "var(--color-ink)", transform: "translateY(-50%)" }}
          />
          <div
            ref={scissorsRef}
            className="absolute top-1/2"
            style={{ left: "-4%", transform: "translate(-50%, -50%)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="6" r="2.4" stroke="var(--color-ink)" strokeWidth="1.6" />
              <circle cx="6" cy="18" r="2.4" stroke="var(--color-ink)" strokeWidth="1.6" />
              <path d="M8 8L20 20M8 16L20 4" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
