import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"
import { useSection } from "@/hooks/useSection"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { ServiceVisual } from "@/components/service-visuals"
import { navigate } from "@/router"
import { useLang } from "@/i18n/language"

type Variant = "accent" | "paper" | "dark"

// Per-card background treatment, matched by index. A diagonal rhythm of
// wine-gradient / paper / dark so no two identical cards sit adjacent, with the
// lead service (Landing page design) carried on the accent card.
const variants: Variant[] = ["accent", "paper", "dark", "paper", "accent", "dark"]

type VariantStyle = {
  card: CSSProperties
  lead: string
  tail: string
  action: string
}

const styles: Record<Variant, VariantStyle> = {
  paper: {
    card: {
      background: "var(--color-paper)",
      border: "1px solid var(--color-line-ink)",
      boxShadow: "0 1px 2px rgba(120,20,50,0.05), 0 22px 44px -28px var(--color-shadow-wine)",
    },
    lead: "var(--color-ink-deep)",
    tail: "var(--color-ink-soft)",
    action: "var(--color-ink-soft)",
  },
  accent: {
    card: {
      background: "linear-gradient(135deg, var(--color-wine) 0%, var(--color-wine-deep) 100%)",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 22px 48px -24px rgba(120,20,50,0.6)",
    },
    lead: "#ffffff",
    tail: "rgba(255,255,255,0.72)",
    action: "rgba(255,255,255,0.75)",
  },
  dark: {
    card: {
      background: "linear-gradient(140deg, var(--color-void-lighter) 0%, var(--color-void) 78%)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 22px 48px -24px rgba(120,20,50,0.5)",
    },
    lead: "var(--color-ink)",
    tail: "var(--color-ink-muted)",
    action: "var(--color-ink-muted)",
  },
}

export function Services() {
  const { ref, inView } = useSection()
  const reduce = useReducedMotion()
  const { t } = useLang()

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
          className="max-w-2xl mb-14"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 variants={fadeUp} className="section-title" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}>
            {t.services.heading}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {t.services.items.map((item, i) => {
            const v = styles[variants[i]]
            // First word carries the strong tone, the rest the muted tone —
            // the reference's two-line title. Single-token titles (common in
            // German) simply render one strong line.
            const [leadWord, ...restWords] = item.title.split(" ")
            const tailText = restWords.join(" ")
            return (
              <motion.a
                key={i}
                href="/#contact"
                onClick={(e) => { e.preventDefault(); navigate("/#contact") }}
                aria-label={`${item.title} — ${t.services.cardAction}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg p-7 md:p-8 min-h-[13.5rem] md:min-h-[15rem] transition-transform duration-300"
                style={v.card}
                variants={fadeUp}
                custom={i * 0.05}
                whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25 } }}
              >
                {/* Glossy object, bleeding off the right edge (clipped by the card). */}
                <div
                  className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 translate-x-[14%] w-[9.5rem] sm:w-[11.5rem] md:w-[13rem] transition-transform duration-500 group-hover:scale-[1.06]"
                  aria-hidden="true"
                >
                  <ServiceVisual index={i} className="w-full h-auto" />
                </div>

                <div className="relative z-10 max-w-[60%]">
                  <h3 className="font-body font-semibold leading-[1.04]" style={{ fontSize: "clamp(1.45rem, 2.3vw, 2rem)", letterSpacing: "-0.02em" }}>
                    <span className="block" style={{ color: v.lead }}>{leadWord}</span>
                    {tailText && <span className="block" style={{ color: v.tail }}>{tailText}</span>}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed line-clamp-2" style={{ color: v.tail }}>
                    {item.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center gap-3">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em]" style={{ color: v.action }}>
                    {t.services.cardAction}
                  </span>
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
