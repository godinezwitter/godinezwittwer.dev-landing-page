import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { wipeReveal } from "@/lib/motion"
import { MagneticButton } from "@/components/MagneticButton"

const steps = [
  {
    n: "01",
    title: "Discovery Call",
    desc: "We start with a focused 30-minute brief: your offer, audience, competitors, and goal. No fluff, all signal.",
  },
  {
    n: "02",
    title: "Strategy & Wireframe",
    desc: "We map the page architecture — above-the-fold, value stack, objection handling, CTA flow. Every section earns its place.",
  },
  {
    n: "03",
    title: "Design & Copywriting",
    desc: "Simultaneous design and copy sprints. Visual hierarchy, persuasive words, and brand consistency delivered together.",
  },
  {
    n: "04",
    title: "Review & Launch",
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
      className="relative py-28 overflow-hidden"
      style={{ background: "#c5bdb5" }}
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#252640" }}>
            How We Work
          </p>
          <h2
            className="font-display leading-tight max-w-lg"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "#3b3d66" }}
          >
            From idea to live page — four clean steps
          </h2>
        </motion.div>

        <div className="relative">
          {/* connecting line (desktop) — draws in from left as steps reveal */}
          <motion.div
            className="hidden lg:block absolute top-[2.75rem] left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px origin-left"
            style={{ background: "linear-gradient(to right, transparent, #828e73, transparent)" }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-lg font-bold mb-5 relative z-10"
                  style={{ background: "#3b3d66", color: "#c8c0b8" }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  {step.n}
                </motion.div>
                <h3 className="font-display text-xl mb-3" style={{ color: "#3b3d66" }}>
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "#252640" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Guarantee strip */}
        <motion.div
          className="mt-20 rounded-3xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "#252640" }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <div>
            <p className="font-display text-2xl mb-1" style={{ color: "#ada49a" }}>
              100% Satisfaction Guarantee
            </p>
            <p className="text-sm" style={{ color: "#c8c0b8" }}>
              Not happy after two revisions? You get a full refund — no questions asked.
            </p>
          </div>
          <MagneticButton
            href="#contact"
            className="shrink-0 px-7 py-3 rounded-full font-semibold text-sm"
            style={{ background: "#5e6853", color: "#fff" }}
            whileHover={{ scale: 1.05 }}
          >
            Claim Your Page →
          </MagneticButton>
        </motion.div>
      </div>
    </motion.section>
  )
}
