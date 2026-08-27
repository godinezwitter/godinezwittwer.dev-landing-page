import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { Counter } from "@/components/Counter"

export function About() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()

  return (
    <motion.section
      ref={ref}
      id="about"
      className="relative py-28 overflow-hidden"
      style={{ background: "#ada49a" }}
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      {/* decorative depth orb */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: "#3b3d66" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: "#252640" }}
            >
              Why PageCraft
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display leading-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", color: "#3b3d66" }}
            >
              Your Fiverr listing deserves a page as sharp as your skills
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: "#252640" }}
            >
              Most Fiverr buyers scroll past forgettable pages in seconds. We craft landing pages
              that stop the scroll — combining conversion psychology, high-end design, and
              persuasive copy into pages that consistently outperform.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              {[
                "Conversion-first design rooted in buyer psychology",
                "SEO-optimized copy that ranks and resonates",
                "A/B-tested layouts for maximum ROI",
                "Mobile-perfect across every device",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: "#5e6853", color: "#fff" }}
                  >
                    ✓
                  </span>
                  <span className="text-base" style={{ color: "#252640" }}>
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: glassmorphism metric cards */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { stat: 3, suf: "×", label: "Higher Click-Through Rate", desc: "vs. standard Fiverr pages" },
              { stat: 67, suf: "%", label: "More Conversions", desc: "from optimised page structure" },
              { stat: 340, suf: "+", label: "Pages Live", desc: "across 15+ industries" },
              { stat: 5, suf: " Days", label: "Avg. Delivery Time", desc: "from brief to live" },
            ].map(({ stat, suf, label, desc }, i) => (
              <motion.div
                key={label}
                className="glass-taupe rounded-2xl p-6"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              >
                <div
                  className="font-display text-4xl font-bold mb-2"
                  style={{ color: "#3b3d66" }}
                >
                  <Counter to={stat} suffix={suf} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#252640" }}>
                  {label}
                </p>
                <p className="text-xs" style={{ color: "#252640" }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
