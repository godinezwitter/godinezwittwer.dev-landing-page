import { useReducedMotion } from "framer-motion"
import { lazy, Suspense, useLayoutEffect, useRef } from "react"
import { Counter } from "@/components/Counter"
import { MagneticButton } from "@/components/MagneticButton"
import { gsap } from "@/lib/gsap"
import heroBg from "@/assets/hero-bg-burgundy.webp"

// Three.js is heavy — keep it out of the main bundle and load it after first paint.
const FlowerScene = lazy(() => import("@/components/hero/FlowerScene").then((m) => ({ default: m.FlowerScene })))

/** Pinned two-scene hero: scene one is the translucent flower model over the
 * liquid-glass background, scrolling scrubs it into scene two (the actual
 * page content). The section itself doesn't scroll past — scroll input
 * drives the transition in place, then releases into the rest of the page.
 * Timing is tuned so the crossfade spans nearly the whole pin distance —
 * a big static gap at the end is what made the handoff feel like a cut. */
export function Hero() {
  const reduce = useReducedMotion()
  const pinRef = useRef<HTMLDivElement>(null)
  const scene1Ref = useRef<HTMLDivElement>(null)
  const scene2Ref = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  useLayoutEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.15}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress
          },
        },
      })

      tl.to(scene1Ref.current, { opacity: 0, scale: 0.92, duration: 0.4 }, 0.08)
        .to(scene2Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 0.42)
    }, pinRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="home" ref={pinRef} className="relative h-screen overflow-hidden" style={{ background: "var(--color-void)" }}>
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
        <span className="label-mono">Digital Pages, Made Smarter</span>
      </div>
      <div className="hidden md:flex absolute top-24 right-6 items-center gap-2 z-10 pointer-events-none">
        <span className="label-mono">Fiverr Studio</span>
        <span className="corner-stripe" style={{ transform: "scaleX(-1)" }} />
      </div>

      {/* 3D flower, scroll-driven */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <FlowerScene progressRef={progressRef} />
        </Suspense>
      </div>

      {/* Scene 1: minimal intro — just the model and a scroll cue */}
      {!reduce && (
        <div ref={scene1Ref} className="absolute inset-0 flex flex-col items-center justify-end pb-14 pointer-events-none">
          <div className="w-px h-12 rounded-full mb-2" style={{ background: "linear-gradient(to bottom, var(--color-rose), transparent)" }} />
          <span className="label-mono">[ Scroll ]</span>
        </div>
      )}

      {/* Scene 2: the actual hero content */}
      <div
        ref={scene2Ref}
        className="absolute inset-0 flex items-center"
        style={{ opacity: reduce ? 1 : 0, transform: reduce ? "none" : "translateY(24px)" }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-rose)" }} />
              <span className="label-mono">Fiverr Landing Page Specialists</span>
            </div>

            <h1 className="font-display font-semibold leading-[1.05] mb-6" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "var(--color-ink)" }}>
              We Build Pages
              <br />
              <em className="not-italic" style={{ color: "var(--color-rose)" }}>That Convert</em>
              <br />
              Clicks to Clients
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "var(--color-ink-muted)" }}>
              Premium landing page design for Fiverr sellers and buyers. We craft high-converting
              pages that turn traffic into revenue — fast, strategic, and cinematic.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <MagneticButton
                href="#contact"
                className="px-8 py-3.5 rounded-full font-semibold text-sm"
                style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
                whileHover={{ scale: 1.05 }}
              >
                Start Your Project →
              </MagneticButton>
              <MagneticButton
                href="#work"
                className="px-8 py-3.5 rounded-full font-medium text-sm glass"
                style={{ color: "var(--color-ink)" }}
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }}
              >
                See Our Work
              </MagneticButton>
            </div>

            {/* Proven-results readout, floating over the flower/background */}
            <div className="glass-dark lab-panel rounded-2xl p-6 max-w-md">
              <p className="label-mono mb-4">[ Proven Results ]</p>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { n: 340, suf: "+", label: "Pages" },
                  { n: 98, suf: "%", label: "Satisfaction" },
                  { n: 4, suf: ".9★", label: "Rating" },
                  { n: 2, suf: "d", label: "Turnaround" },
                ].map(({ n, suf, label }) => (
                  <div key={label}>
                    <div className="font-display text-xl font-bold mb-1" style={{ color: "var(--color-ink)" }}>
                      <Counter to={n} suffix={suf} />
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--color-ink-muted)" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
