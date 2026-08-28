import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { wipeReveal } from "@/lib/motion"
import { MagneticButton } from "@/components/MagneticButton"

const steps = [
  {
    n: "01",
    title: "Discovery call",
    desc: "We start with a focused 30-minute brief: your offer, audience, competitors, and goal. No fluff, all signal.",
  },
  {
    n: "02",
    title: "Strategy & wireframe",
    desc: "We map the page architecture — above-the-fold, value stack, objection handling, CTA flow. Every section earns its place.",
  },
  {
    n: "03",
    title: "Design & copywriting",
    desc: "Simultaneous design and copy sprints. Visual hierarchy, persuasive words, and brand consistency delivered together.",
  },
  {
    n: "04",
    title: "Review & launch",
    desc: "Two revision rounds, final QA across devices, and hand-off with code or direct platform publishing.",
  },
]

export function Process() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()

  return (
    <motion.section
      ref={ref}
      id="process"
      className="relative py-28"
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16 max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="kicker mb-4">How we work</span>
          <h2
            className="font-serif leading-[1.05]"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
          >
            From idea to live page — four clean steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.12 * i }}
            >
              {/* connecting hairline between steps on wide screens */}
              {i < steps.length - 1 && (
                <span
                  className="hidden lg:block absolute top-5 left-16 right-[-2rem] h-px"
                  style={{ background: "var(--color-line-ink)" }}
                  aria-hidden="true"
                />
              )}
              <div
                className="font-serif font-semibold mb-5 tabular-nums"
                style={{ fontSize: "2.4rem", lineHeight: 1, color: "var(--color-wine)" }}
              >
                {step.n}
              </div>
              <h3 className="font-serif text-xl mb-3" style={{ color: "var(--color-ink-deep)" }}>
                {step.title}
              </h3>
              <p className="text-base leading-relaxed max-w-[34ch]" style={{ color: "var(--color-ink-soft)" }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The single intentional dark block — a deep-burgundy callback to the hero. */}
        <motion.div
          className="relative overflow-hidden mt-24 rounded-3xl px-8 py-9 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: "linear-gradient(120deg, var(--color-void-lighter) 0%, var(--color-void) 70%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div
            className="absolute -top-20 -right-16 w-72 h-72 rounded-full blur-[90px] pointer-events-none"
            style={{ background: "var(--color-wine)", opacity: 0.35 }}
            aria-hidden="true"
          />
          <div className="relative">
            <p className="font-serif text-2xl md:text-3xl mb-1" style={{ color: "var(--color-ink)" }}>
              100% satisfaction guarantee
            </p>
            <p className="text-sm md:text-base" style={{ color: "var(--color-ink-muted)" }}>
              Not happy after two revisions? You get a full refund — no questions asked.
            </p>
          </div>
          <MagneticButton
            href="#contact"
            className="relative shrink-0 px-7 py-3 rounded-full font-semibold text-sm"
            style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
            whileHover={{ scale: 1.05 }}
          >
            Claim your page →
          </MagneticButton>
        </motion.div>
      </div>
    </motion.section>
  )
}
