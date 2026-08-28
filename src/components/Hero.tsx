import { useReducedMotion } from "framer-motion"
import { lazy, Suspense, useLayoutEffect, useRef } from "react"
import { Counter } from "@/components/Counter"
import { MagneticButton } from "@/components/MagneticButton"
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
  const pinRef = useRef<HTMLDivElement>(null)
  const scene1Ref = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  useLayoutEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      const lines = headlineRef.current
        ? Array.from(headlineRef.current.querySelectorAll<HTMLElement>(".hero-line"))
        : []

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.2}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
          },
        },
      })

      // One continuous, overlapping sequence rather than disjoint blocks —
      // scene 1 is still receding while scene 2 starts arriving, so the
      // handoff reads as a single fluid motion instead of a cut.
      tl.to(scene1Ref.current, { opacity: 0, scale: 0.9, ease: "power2.in", duration: 0.3 }, 0)
        .to(leftRef.current, { opacity: 1, x: 0, ease: "power2.out", duration: 0.42 }, 0.18)
        .to(lines, { opacity: 1, y: 0, rotate: 0, ease: "power3.out", duration: 0.35, stagger: 0.07 }, 0.24)
        .to(rightRef.current, { opacity: 1, x: 0, ease: "power2.out", duration: 0.5 }, 0.34)
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

      {/* Scene 2: the actual hero content — left half slides in from the left, right half from the right */}
      <div className="absolute inset-0 flex items-center">
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              ref={leftRef}
              style={{ opacity: reduce ? 1 : 0, transform: reduce ? "none" : "translateX(-48px)" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-rose)" }} />
                <span className="label-mono">Fiverr Landing Page Specialists</span>
              </div>

              <h1
                ref={headlineRef}
                className="font-display font-semibold leading-[1.08] mb-6"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)", color: "var(--color-ink)" }}
              >
                {["We Build Pages", "That Convert", "Clicks to Clients"].map((line, i) => (
                  <span
                    key={line}
                    className="hero-line block"
                    style={{
                      color: i === 1 ? "var(--color-rose)" : undefined,
                      opacity: reduce ? 1 : 0,
                      transform: reduce ? "none" : "translateY(22px) rotate(-2deg)",
                      transformOrigin: "left center",
                    }}
                  >
                    {line}
                  </span>
                ))}
              </h1>

              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "var(--color-ink-muted)" }}>
                Premium landing page design for Fiverr sellers and buyers. We craft high-converting
                pages that turn traffic into revenue — fast, strategic, and cinematic.
              </p>

              <div className="flex flex-wrap gap-4">
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
            </div>

            {/* Right: proven-results readout, floating over the flower/background */}
            <div
              ref={rightRef}
              className="hidden lg:flex justify-end"
              style={{ opacity: reduce ? 1 : 0, transform: reduce ? "none" : "translateX(48px)" }}
            >
              <div className="glass-dark lab-panel rounded-2xl p-6 w-full max-w-xs">
                <p className="label-mono mb-4">[ Proven Results ]</p>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { n: 340, suf: "+", label: "Pages Delivered" },
                    { n: 98, suf: "%", label: "Client Satisfaction" },
                    { n: 4, suf: ".9★", label: "Fiverr Rating" },
                    { n: 2, suf: "d", label: "Turnaround" },
                  ].map(({ n, suf, label }) => (
                    <div key={label}>
                      <div className="font-display text-2xl font-bold mb-1" style={{ color: "var(--color-ink)" }}>
                        <Counter to={n} suffix={suf} />
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
                        {label}
                      </div>
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
