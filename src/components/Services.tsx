import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { TiltCard } from "@/components/TiltCard"

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const icons = {
  browser: (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="9" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  pen: (
    <svg {...iconProps}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  storefront: (
    <svg {...iconProps}>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5 9v10h14V9" />
      <path d="M9.5 19v-5h5v5" />
    </svg>
  ),
  funnel: (
    <svg {...iconProps}>
      <path d="M4 4h16l-6 8v6l-4 2v-8z" />
    </svg>
  ),
  audit: (
    <svg {...iconProps}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.35-4.35" />
      <path d="m8 10.5 1.8 1.8L13.5 8" />
    </svg>
  ),
  palette: (
    <svg {...iconProps}>
      <path d="M12 21a9 9 0 1 1 0-18c4.5 0 8.5 3 8.5 6.5 0 2-1.5 3.5-3.5 3.5h-2a1.5 1.5 0 0 0-1 2.6c.4.4.6.9.6 1.4 0 1.1-1 2-2.6 2Z" />
      <circle cx="7.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
}

const services = [
  {
    icon: icons.browser,
    title: "Landing Page Design",
    desc: "Pixel-perfect, brand-consistent pages that load fast and look stunning on every screen.",
    tags: ["UI/UX", "Responsive", "Figma"],
    featured: true,
  },
  {
    icon: icons.pen,
    title: "Conversion Copywriting",
    desc: "Words that persuade. We write headlines, hooks, and CTAs that move buyers to click.",
    tags: ["SEO", "Psychology", "A/B tested"],
  },
  {
    icon: icons.storefront,
    title: "Fiverr Gig Pages",
    desc: "Purpose-built for the Fiverr ecosystem — structured to rank higher and convert better.",
    tags: ["Fiverr SEO", "Social proof", "Trust signals"],
  },
  {
    icon: icons.funnel,
    title: "Full Funnel Build",
    desc: "From hero to thank-you page — complete funnel architecture for serious sellers.",
    tags: ["Multi-page", "Analytics", "Integration"],
  },
  {
    icon: icons.audit,
    title: "Page Refresh & Audit",
    desc: "Already have a page? We audit, redesign, and fix what's silently killing your conversions.",
    tags: ["Audit", "Optimisation", "CRO"],
  },
  {
    icon: icons.palette,
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
            style={{ color: "#b4c2a3" }}
          >
            What We Offer
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "#ada49a" }}
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
              className={`glass rounded-2xl p-7 group cursor-default relative overflow-hidden ${
                s.featured ? "md:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-between" : ""
              }`}
              style={s.featured ? { background: "rgba(130,142,115,0.12)", borderColor: "rgba(163,176,144,0.35)" } : undefined}
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
              <div>
                <span
                  className="block mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: "#b4c2a3" }}
                >
                  {s.icon}
                </span>
                <h3
                  className={`font-display mb-3 ${s.featured ? "text-2xl" : "text-xl"}`}
                  style={{ color: "#ada49a" }}
                >
                  {s.title}
                </h3>
                <p className="text-base leading-relaxed mb-5" style={{ color: "#c8c0b8" }}>
                  {s.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(163,176,144,0.18)",
                      color: "#c3d0b3",
                      border: "1px solid rgba(163,176,144,0.3)",
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
