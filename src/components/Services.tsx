import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { MagicBentoGrid, MagicBentoCard } from "@/components/MagicBento"

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
    title: "Landing page design",
    desc: "Pixel-perfect, single-purpose pages built to turn one click into one customer. Fast, responsive, on-brand.",
    tags: ["UI/UX", "Responsive", "Figma"],
    featured: true,
  },
  {
    icon: icons.pen,
    title: "Conversion copywriting",
    desc: "Words and structure that guide people to the click — headlines, hooks, and a flow that answers objections in order.",
    tags: ["SEO", "Psychology", "A/B tested"],
  },
  {
    icon: icons.storefront,
    title: "Fiverr gig pages",
    desc: "Purpose-built for the Fiverr ecosystem — trust signals, clear offers, and structure that helps buyers say yes.",
    tags: ["Fiverr SEO", "Social proof", "Trust signals"],
  },
  {
    icon: icons.funnel,
    title: "Full website builds",
    desc: "Multi-page sites coded from scratch — home, services, about, contact — structured to scale as you grow.",
    tags: ["Multi-page", "React", "CMS"],
  },
  {
    icon: icons.audit,
    title: "Page refresh & audit",
    desc: "Already have a page? We audit it, find what's quietly costing you conversions, and rebuild it properly.",
    tags: ["Audit", "Optimisation", "CRO"],
  },
  {
    icon: icons.palette,
    title: "Brand identity add-on",
    desc: "A tidy starter kit — logo, colour system, and type — so your page looks like a business, not a hobby.",
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
      className="relative py-28"
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
    >
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="max-w-2xl mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.span variants={fadeUp} className="kicker mb-4">
            What we offer
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif leading-[1.05]"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
          >
            Everything a winning page needs
          </motion.h2>
        </motion.div>

        <MagicBentoGrid
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((s, i) => (
            <MagicBentoCard
              key={s.title}
              className="group cursor-default flex flex-col justify-between p-7"
              variants={fadeUp}
              custom={i * 0.05}
              whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25 } }}
            >
              <div>
                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: s.featured ? "var(--color-wine)" : "var(--color-paper-2)",
                    color: s.featured ? "#fff" : "var(--color-wine)",
                    border: s.featured ? "none" : "1px solid var(--color-line-ink)",
                  }}
                >
                  {s.icon}
                </span>
                <h3
                  className={`font-serif mb-3 ${s.featured ? "text-2xl" : "text-xl"}`}
                  style={{ color: "var(--color-ink-deep)" }}
                >
                  {s.title}
                </h3>
                <p className="text-base leading-relaxed mb-6" style={{ color: "var(--color-ink-soft)" }}>
                  {s.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "var(--color-paper-2)",
                      color: "var(--color-wine)",
                      border: "1px solid var(--color-line-ink)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </MagicBentoCard>
          ))}
        </MagicBentoGrid>
      </div>
    </motion.section>
  )
}
