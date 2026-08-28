import { useReducedMotion } from "framer-motion"
import { lazy, Suspense, useLayoutEffect, useRef } from "react"
import { Counter } from "@/components/Counter"
import { MagneticButton } from "@/components/MagneticButton"
import { gsap } from "@/lib/gsap"
import heroPortrait from "@/assets/hero-portrait.webp"

// Three.js is heavy — keep it out of the main bundle and load it after first paint.
const FlowerScene = lazy(() => import("@/components/hero/FlowerScene").then((m) => ({ default: m.FlowerScene })))

const gridBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M64 0H0V64' fill='none' stroke='%23ffffff' stroke-opacity='0.05'/%3E%3C/svg%3E")`

/** Pinned two-scene hero: scene one is the translucent flower model over a dark
 * lab-grid backdrop, scrolling scrubs it into scene two (the actual page
 * content). The section itself doesn't scroll past — scroll input drives the
 * transition in place, then releases into the rest of the page. */
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
          end: () => `+=${window.innerHeight * 1.4}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress
          },
        },
      })

      tl.to(scene1Ref.current, { opacity: 0, scale: 0.92, duration: 0.4 }, 0.12)
        .to(scene2Ref.current, { opacity: 1, y: 0, duration: 0.45 }, 0.35)
    }, pinRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="home" ref={pinRef} className="relative h-screen overflow-hidden" style={{ background: "var(--color-void)" }}>
      {/* Lab-grid backdrop */}
      <div className="absolute inset-0" style={{ backgroundImage: gridBg }} />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(110,231,216,0.08) 0%, transparent 55%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* 3D flower, scroll-driven */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <FlowerScene progressRef={progressRef} />
        </Suspense>
      </div>

      {/* Scene 1: minimal intro — just the model and a scroll cue */}
      {!reduce && (
        <div ref={scene1Ref} className="absolute inset-0 flex flex-col items-center justify-end pb-14 pointer-events-none">
          <div className="w-px h-12 rounded-full mb-2" style={{ background: "linear-gradient(to bottom, var(--color-glass-teal), transparent)" }} />
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: headline */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-glass-teal)" }} />
                <span className="label-mono">Fiverr Landing Page Specialists</span>
              </div>

              <h1 className="font-display font-semibold leading-[1.05] mb-6" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "var(--color-ink)" }}>
                We Build Pages
                <br />
                <em className="not-italic" style={{ color: "var(--color-glass-teal)" }}>That Convert</em>
                <br />
                Clicks to Clients
              </h1>

              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "var(--color-ink-muted)" }}>
                Premium landing page design for Fiverr sellers and buyers. We craft high-converting
                pages that turn traffic into revenue — fast, strategic, and cinematic.
              </p>

              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  href="#contact"
                  className="px-8 py-3.5 rounded-full font-semibold text-sm"
                  style={{ background: "var(--color-glass-teal)", color: "var(--color-void)" }}
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

            {/* Right: portrait with floating stats chip */}
            <div className="hidden lg:block relative">
              <div className="lab-panel relative rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img
                  src={heroPortrait}
                  alt="PageCraft designer portrait"
                  className="w-full h-full object-cover"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
                    filter: "grayscale(0.3) contrast(1.05)",
                  }}
                />
                <div
                  className="absolute top-6 right-6 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none"
                  style={{ background: "var(--color-glass-purple)" }}
                />
              </div>

              <div className="glass-dark lab-panel rounded-2xl p-6 absolute -bottom-8 -left-8 right-8">
                <p className="label-mono mb-4">[ Proven Results ]</p>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  {[
                    { n: 340, suf: "+", label: "Pages Delivered" },
                    { n: 98, suf: "%", label: "Client Satisfaction" },
                    { n: 4, suf: ".9★", label: "Fiverr Rating" },
                    { n: 2, suf: "–5 Days", label: "Turnaround" },
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
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {["var(--color-glass-teal)", "var(--color-glass-purple)", "var(--color-glass-pink)", "var(--color-ink)"].map((c, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2"
                        style={{ borderColor: "var(--color-void)", background: c }}
                      />
                    ))}
                    <div
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-medium"
                      style={{ borderColor: "var(--color-void)", background: "rgba(255,255,255,0.1)", color: "var(--color-ink)" }}
                    >
                      +40
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
                    Happy clients this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
