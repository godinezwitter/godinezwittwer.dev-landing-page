import { motion, useReducedMotion } from "framer-motion"
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react"
import { MagneticButton } from "@/components/MagneticButton"
import { useLang } from "@/i18n/language"
import { gsap } from "@/lib/gsap"

// Same file the site-wide fixed background in index.css uses — referenced from
// public/ directly (not imported) so it isn't duplicated as a second bundled asset.
const heroBg = "/hero-bg-burgundy.webp"

// Three.js is heavy — keep it out of the main bundle and load it after first paint.
const FlowerScene = lazy(() => import("@/components/hero/FlowerScene").then((m) => ({ default: m.FlowerScene })))

/** Pinned two-scene hero: scene one is the translucent flower model over the
 * liquid-glass background, scrolling scrubs it into scene two (the actual
 * page content, which enters as two halves — copy from the left, the stats
 * panel from the right). The section itself doesn't scroll past — scroll
 * input drives the transition in place, then releases into the rest of the
 * page. fastScrollEnd prevents the handoff from skipping/jumping when
 * scrolled quickly; the overlapping timeline positions (scene 1 still
 * receding as scene 2 arrives) plus the site-wide Lenis smoothing
 * (SmoothScroll) keep the handoff itself feeling continuous rather than cut. */
export function Hero() {
  const reduce = useReducedMotion()
  const { t } = useLang()
  const rotatingWords = t.hero.rotating
  const [wordIndex, setWordIndex] = useState(0)
  // The pinned two-scene scrub is a desktop-pointer affordance. On touch it's
  // the exact GSAP-pinning jank the Portfolio carousel already sidesteps, and
  // below `lg` there's no second column for it to reveal — so coarse pointers
  // and narrow viewports get the static hero (same path reduced-motion takes).
  const [coarseOrNarrow, setCoarseOrNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse), (max-width: 1023px)").matches,
  )
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (max-width: 1023px)")
    const update = () => setCoarseOrNarrow(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  const runPinnedHero = !reduce && !coarseOrNarrow

  const pinRef = useRef<HTMLDivElement>(null)
  const scene1Ref = useRef<HTMLDivElement>(null)
  const transitionGlowRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  useLayoutEffect(() => {
    if (!runPinnedHero) return
    const ctx = gsap.context(() => {
      const lines = headlineRef.current
        ? Array.from(headlineRef.current.querySelectorAll<HTMLElement>(".hero-line"))
        : []

      // Scene 2 renders visible by default (so a failed/absent animation never
      // leaves the hero blank or shifted); GSAP owns the hidden "from" state.
      gsap.set(leftRef.current, { opacity: 0, x: -48 })
      gsap.set(rightRef.current, { opacity: 0, x: 48 })
      gsap.set(lines, { opacity: 0, y: 22, rotate: -2 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })

      // One continuous, overlapping sequence rather than disjoint blocks —
      // scene 1 is still receding while scene 2 starts arriving, so the
      // handoff reads as a single fluid motion instead of a cut. A soft
      // gradient wash builds up right as scene 1 fades and clears once
      // scene 2 has arrived, veiling the swap instead of letting the two
      // states read as a hard cross-cut.
      tl.to(scene1Ref.current, { opacity: 0, scale: 0.9, ease: "power2.in", duration: 0.3 }, 0)
        .to(transitionGlowRef.current, { opacity: 1, ease: "power1.inOut", duration: 0.22 }, 0.06)
        .to(transitionGlowRef.current, { opacity: 0, ease: "power1.inOut", duration: 0.3 }, 0.3)
        .to(leftRef.current, { opacity: 1, x: 0, ease: "power2.out", duration: 0.42 }, 0.18)
        .to(lines, { opacity: 1, y: 0, rotate: 0, ease: "power3.out", duration: 0.35, stagger: 0.07 }, 0.24)
        .to(rightRef.current, { opacity: 1, x: 0, ease: "power2.out", duration: 0.5 }, 0.34)
    }, pinRef)

    return () => ctx.revert()
  }, [runPinnedHero])

  // Cycle the headline's last word. Reduced-motion users get a single static word.
  // Re-keyed on word count so switching language restarts cleanly.
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2200)
    return () => clearInterval(id)
  }, [reduce, rotatingWords.length])

  return (
    <section id="home" ref={pinRef} className="relative min-h-[100dvh] overflow-hidden" style={{ background: "var(--color-void)" }}>
      {/* Liquid-glass background */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(8,2,4,0.55) 100%)" }}
      />

      {/* Corner chrome badges */}
      <div className="hidden md:flex absolute bottom-6 left-6 items-center gap-2 z-10 pointer-events-none">
        <span className="corner-stripe" />
        <span className="label-mono">{t.hero.cornerLeft}</span>
      </div>
      <div className="hidden md:flex absolute top-24 right-6 items-center gap-2 z-10 pointer-events-none">
        <span className="label-mono">{t.hero.cornerRight}</span>
        <span className="corner-stripe" style={{ transform: "scaleX(-1)" }} />
      </div>

      {/* 3D flower, scroll-driven */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <FlowerScene progressRef={progressRef} frozen={!runPinnedHero} />
        </Suspense>
      </div>

      {/* Scroll-progress hairline for the pinned transition, so the scrub never
          reads as a frozen page. */}
      {runPinnedHero && (
        <div className="absolute top-0 inset-x-0 h-[2px] z-20 pointer-events-none" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            ref={progressBarRef}
            className="h-full origin-left"
            style={{ transform: "scaleX(0)", background: "linear-gradient(to right, var(--color-wine), var(--color-rose))" }}
          />
        </div>
      )}

      {/* Scene 1: minimal intro — just the model and a scroll cue */}
      {runPinnedHero && (
        <div ref={scene1Ref} className="absolute inset-0 flex flex-col items-center justify-end pb-14 pointer-events-none">
          <motion.div
            className="w-px h-12 rounded-full mb-2"
            style={{ background: "linear-gradient(to bottom, var(--color-rose), transparent)" }}
            animate={{ transform: ["translateY(0px)", "translateY(6px)", "translateY(0px)"], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="label-mono">{t.hero.scroll}</span>
        </div>
      )}

      {/* Transition wash — builds as scene 1 recedes, clears once scene 2 has settled in, softening the handoff into a veil instead of a cut */}
      {runPinnedHero && (
        <div
          ref={transitionGlowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(184,48,92,0.3) 0%, rgba(18,6,10,0.8) 55%, var(--color-void) 100%)",
            opacity: 0,
          }}
        />
      )}

      {/* Scene 2: the actual hero content — left half slides in from the left, right half from the right */}
      <div className="absolute inset-0 flex items-center">
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div ref={leftRef}>
              <h1
                ref={headlineRef}
                className="font-display font-bold mb-6"
                style={{ fontSize: "clamp(2.6rem, 5vw, 4.6rem)", lineHeight: 1.02, letterSpacing: "-0.03em", color: "var(--color-ink)" }}
                // The headline is split into absolutely-stacked animated spans
                // with no whitespace between them; give assistive tech one clean
                // sentence instead of "engineered toconvert.".
                aria-label={`${t.hero.line1} ${t.hero.line2} ${rotatingWords[wordIndex]}`}
              >
                {[t.hero.line1, t.hero.line2].map((line) => (
                  <span
                    key={line}
                    aria-hidden="true"
                    className="hero-line block"
                    style={{ transformOrigin: "left center" }}
                  >
                    {line}
                  </span>
                ))}
                {/* The final word rotates through outcomes every couple of seconds. The words
                    are stacked absolutely and cross-fade by toggling opacity, so the line height
                    stays fixed and no layout shifts as it cycles. */}
                <span
                  aria-hidden="true"
                  className="hero-line relative block"
                  style={{
                    color: "var(--color-rose)",
                    height: "1.15em",
                    transformOrigin: "left center",
                  }}
                >
                  {rotatingWords.map((word, i) => {
                    const active = i === wordIndex
                    return (
                      <span
                        key={word}
                        aria-hidden={active ? undefined : true}
                        className="absolute left-0 top-0 whitespace-nowrap"
                        style={{
                          opacity: active ? 1 : 0,
                          transform: reduce ? "none" : `translateY(${active ? 0 : 14}px)`,
                          transition: reduce ? undefined : "opacity 0.5s ease, transform 0.5s ease",
                        }}
                      >
                        {word}
                      </span>
                    )
                  })}
                </span>
              </h1>

              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "var(--color-ink-muted)" }}>
                {t.hero.subhead}
              </p>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  href="#contact"
                  className="px-8 py-3.5 rounded-lg font-semibold text-sm"
                  style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
                  whileHover={{ scale: 1.05 }}
                >
                  {t.hero.ctaPrimary}
                </MagneticButton>
                <MagneticButton
                  href="#work"
                  className="px-8 py-3.5 rounded-lg font-medium text-sm glass"
                  // Dark scrim under the glass so the near-white label keeps
                  // contrast over the flower's light petals, not just the
                  // dark background.
                  style={{ color: "var(--color-ink)", background: "rgba(12,4,7,0.42)" }}
                  whileHover={{ scale: 1.05, background: "rgba(12,4,7,0.58)" }}
                >
                  {t.hero.ctaSecondary}
                </MagneticButton>
              </div>
            </div>

            {/* Right: proven-results readout, floating over the flower/background */}
            <div ref={rightRef} className="hidden lg:flex justify-end">
              <div className="glass-dark lab-panel rounded-2xl p-6 w-full max-w-xs">
                <p className="label-mono mb-5">{t.hero.panelTitle}</p>
                <div className="flex flex-col gap-4">
                  {t.hero.panel.map(({ title, detail }, i) => (
                    <div key={title}>
                      {i > 0 && <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.08)" }} />}
                      <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>
                        {title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
