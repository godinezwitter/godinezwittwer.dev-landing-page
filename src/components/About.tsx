import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { Counter } from "@/components/Counter"
import { ScrollRevealText } from "@/components/ScrollRevealText"
import { CheckIcon } from "@/components/icons"

const stats = [
  { stat: 3, suf: "×", label: "Higher click-through rate", desc: "vs. standard Fiverr pages" },
  { stat: 67, suf: "%", label: "More conversions", desc: "from optimised page structure" },
  { stat: 340, suf: "+", label: "Pages live", desc: "across 15+ industries" },
  { stat: 5, suf: " days", label: "Average delivery", desc: "from brief to live" },
]

const checks = [
  "Conversion-first design rooted in buyer psychology",
  "SEO-optimized copy that ranks and resonates",
  "A/B-tested layouts for maximum ROI",
  "Mobile-perfect across every device",
]

export function About() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()

  return (
    <motion.section
      ref={ref}
      id="about"
      className="relative py-28"
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <motion.span variants={fadeUp} className="kicker mb-5">
              Why PageCraft
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-serif leading-[1.05] mb-7"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
            >
              Your Fiverr listing deserves a page as{" "}
              <em className="not-italic" style={{ color: "var(--color-wine)" }}>
                sharp as your skills
              </em>
            </motion.h2>
            <ScrollRevealText
              text="Most Fiverr buyers scroll past forgettable pages in seconds. We craft landing pages that stop the scroll — combining conversion psychology, high-end design, and persuasive copy into pages that consistently outperform."
              className="text-lg leading-relaxed mb-9 max-w-[62ch]"
              fromColor="#cabdb4"
              toColor="#3a2b30"
            />
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              {checks.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-wine)", color: "#fff" }}
                  >
                    <CheckIcon />
                  </span>
                  <span className="text-base" style={{ color: "var(--color-ink-deep)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: editorial stat block — hairline-divided, no boxes. */}
          <motion.div
            className="surface rounded-3xl overflow-hidden"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <div className="grid grid-cols-2">
              {stats.map(({ stat, suf, label, desc }, i) => (
                <div
                  key={label}
                  className="p-8"
                  style={{
                    borderTop: i > 1 ? "1px solid var(--color-line-ink)" : undefined,
                    borderLeft: i % 2 === 1 ? "1px solid var(--color-line-ink)" : undefined,
                  }}
                >
                  <div
                    className="font-serif font-semibold mb-2 tabular-nums"
                    style={{ fontSize: "clamp(2.2rem, 3.5vw, 3rem)", color: "var(--color-wine)", lineHeight: 1 }}
                  >
                    <Counter to={stat} suffix={suf} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink-deep)" }}>
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
