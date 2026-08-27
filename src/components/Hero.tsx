import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  easeOut,
} from "framer-motion"
import { useEffect, useRef } from "react"
import { Counter } from "@/components/Counter"
import { MagneticButton } from "@/components/MagneticButton"

/** Small pointer-driven offset used to give the glow orbs a sense of depth. */
function useMouseParallax(depth: number, reduce: boolean) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  useEffect(() => {
    if (reduce) return
    const handler = (e: PointerEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mx.set(((e.clientX - cx) / cx) * depth)
      my.set(((e.clientY - cy) / cy) * depth)
    }
    window.addEventListener("pointermove", handler)
    return () => window.removeEventListener("pointermove", handler)
  }, [depth, reduce, mx, my])

  return {
    x: useSpring(mx, { stiffness: 60, damping: 20 }),
    y: useSpring(my, { stiffness: 60, damping: 20 }),
  }
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const ySpring = useSpring(useTransform(scrollY, [0, 600], [0, 160]), {
    stiffness: 100,
    damping: 30,
  })
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const orbA = useMouseParallax(18, !!reduce)
  const orbB = useMouseParallax(-12, !!reduce)

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cinematic background */}
      <motion.div className="absolute inset-0" style={{ y: reduce ? 0 : ySpring }}>
        <div
          className="absolute inset-0 w-full h-[110%]"
          style={{
            background: `
              linear-gradient(135deg, #252640 0%, #3b3d66 35%, #2d3d2e 65%, #1a1a2e 100%)
            `,
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "256px",
          }}
        />
        {/* Radial glow spots — parallax with the cursor */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "#828e73", x: orbA.x, y: orbA.y }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "#ada49a", x: orbB.x, y: orbB.y }}
        />
      </motion.div>

      {/* Floating background shapes */}
      {[
        { top: "15%", left: "8%", right: undefined, size: 240, delay: 0 },
        { top: "60%", left: undefined, right: "6%", size: 180, delay: 1.5 },
        { top: "40%", left: "50%", right: undefined, size: 120, delay: 0.8 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-2xl glass pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            width: s.size,
            height: s.size,
            rotate: i * 15 - 10,
          }}
          animate={
            reduce
              ? {}
              : { rotate: [i * 15 - 10, i * 15 + 5, i * 15 - 10], y: [0, -18, 0] }
          }
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full"
        style={{ opacity }}
        ref={containerRef}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#828e73" }}
              />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#ada49a" }}>
                Fiverr Landing Page Specialists
              </span>
            </motion.div>

            <motion.h1
              className="font-display leading-[1.05] mb-6 text-chrome"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: easeOut }}
            >
              We Build Pages
              <br />
              <em style={{ color: "#828e73" }}>That Convert</em>
              <br />
              Clicks to Clients
            </motion.h1>

            <motion.p
              className="text-base md:text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "rgba(173,164,154,0.7)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Premium landing page design for Fiverr sellers and buyers. We craft high-converting
              pages that turn traffic into revenue — fast, strategic, and cinematic.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <MagneticButton
                href="#contact"
                className="px-8 py-3.5 rounded-full font-semibold text-sm"
                style={{ background: "#828e73", color: "#fff" }}
                whileHover={{ scale: 1.05, background: "#6e7a61" }}
              >
                Start Your Project →
              </MagneticButton>
              <MagneticButton
                href="#work"
                className="px-8 py-3.5 rounded-full font-medium text-sm glass"
                style={{ color: "#ada49a" }}
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.12)" }}
              >
                See Our Work
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right: glass stats card */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            <div className="glass-dark rounded-3xl p-8 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-3xl"
                style={{ background: "#828e73" }}
              />
              <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "#828e73" }}>
                Proven Results
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { n: 340, suf: "+", label: "Pages Delivered" },
                  { n: 98, suf: "%", label: "Client Satisfaction" },
                  { n: 4, suf: ".9★", label: "Fiverr Rating" },
                  { n: 2, suf: "–5 Days", label: "Turnaround" },
                ].map(({ n, suf, label }) => (
                  <div key={label}>
                    <div
                      className="font-display text-3xl font-bold mb-1"
                      style={{ color: "#ada49a" }}
                    >
                      <Counter to={n} suffix={suf} />
                    </div>
                    <div className="text-xs" style={{ color: "rgba(173,164,154,0.55)" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex -space-x-3">
                {["bg-indigo-400", "bg-sage-400", "bg-taupe-400", "bg-indigo-300"].map((_c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 overflow-hidden"
                    style={{
                      borderColor: "rgba(255,255,255,0.15)",
                      background: ["#5557a0", "#828e73", "#ada49a", "#3b3d66"][i],
                    }}
                  />
                ))}
                <div
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-medium"
                  style={{
                    borderColor: "rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ada49a",
                  }}
                >
                  +40
                </div>
              </div>
              <p className="text-xs mt-3" style={{ color: "rgba(173,164,154,0.5)" }}>
                Happy clients this month
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-px h-12 rounded-full"
            style={{ background: "linear-gradient(to bottom, #828e73, transparent)" }}
            animate={reduce ? {} : { scaleY: [1, 0.4, 1], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(173,164,154,0.4)" }}>
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
