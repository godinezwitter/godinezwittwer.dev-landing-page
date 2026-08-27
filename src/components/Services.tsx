import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { TiltCard } from "@/components/TiltCard"

const services = [
  {
    icon: "⬡",
    title: "Landing Page Design",
    desc: "Pixel-perfect, brand-consistent pages that load fast and look stunning on every screen.",
    tags: ["UI/UX", "Responsive", "Figma"],
  },
  {
    icon: "◈",
    title: "Conversion Copywriting",
    desc: "Words that persuade. We write headlines, hooks, and CTAs that move buyers to click.",
    tags: ["SEO", "Psychology", "A/B tested"],
  },
  {
    icon: "◎",
    title: "Fiverr Gig Pages",
    desc: "Purpose-built for the Fiverr ecosystem — structured to rank higher and convert better.",
    tags: ["Fiverr SEO", "Social proof", "Trust signals"],
  },
  {
    icon: "⊕",
    title: "Full Funnel Build",
    desc: "From hero to thank-you page — complete funnel architecture for serious sellers.",
    tags: ["Multi-page", "Analytics", "Integration"],
  },
  {
    icon: "◉",
    title: "Page Refresh & Audit",
    desc: "Already have a page? We audit, redesign, and fix what's silently killing your conversions.",
    tags: ["Audit", "Optimisation", "CRO"],
  },
  {
    icon: "◇",
    title: "Brand Identity Add-on",
    desc: "Logo, color system, and typography kit — everything you need to look like a pro.",
    tags: ["Branding", "Logo", "Style guide"],
  },
]

export function Services() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()

  return (
    <motion.section
      ref={ref}
      id="services"
      className="relative py-28 overflow-hidden"
      style={{ background: "#3b3d66" }}
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      {/* background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: "#828e73" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: "#828e73" }}
          >
            What We Offer
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#ada49a" }}
          >
            Everything a winning page needs
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((s, i) => (
            <TiltCard
              key={s.title}
              className="glass rounded-2xl p-7 group cursor-default relative overflow-hidden"
              motionProps={{
                variants: fadeUp,
                custom: i * 0.05,
                whileHover: { y: -6, transition: { duration: 0.25 } },
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(130,142,115,0.08) 0%, transparent 100%)",
                }}
              />
              <span
                className="text-3xl block mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ color: "#828e73" }}
              >
                {s.icon}
              </span>
              <h3
                className="font-display text-xl mb-3"
                style={{ color: "#ada49a" }}
              >
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(173,164,154,0.65)" }}>
                {s.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(130,142,115,0.15)",
                      color: "#828e73",
                      border: "1px solid rgba(130,142,115,0.2)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
