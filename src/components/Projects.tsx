import { motion, useReducedMotion } from "framer-motion"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { useLang } from "@/i18n/language"
import { navigate } from "@/router"
import { portfolioItems } from "@/components/Portfolio"

/** The "Our Projects" tab — one detail block per concept build, the page the
 * portfolio cards on the main page link through to. Lives on its own route
 * (not a modal) so each project gets a real, linkable, properly-described
 * home instead of a cramped preview. */
export function Projects() {
  const reduce = useReducedMotion()
  const { t } = useLang()

  return (
    <motion.section
      className="relative py-28"
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate="visible"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Intro */}
        <motion.div className="max-w-3xl mb-16" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} className="kicker mb-4">
            {t.projects.kicker}
          </motion.p>
          <motion.h1 variants={fadeUp} className="section-title mb-6" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}>
            {t.projects.heading}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg leading-relaxed max-w-[64ch]" style={{ color: "var(--color-ink-soft)" }}>
            {t.projects.intro}
          </motion.p>
        </motion.div>

        {/* One detail block per project, alternating image side for rhythm. */}
        <div className="flex flex-col gap-16 md:gap-24">
          {portfolioItems.map((item, i) => {
            const reversed = i % 2 === 1
            return (
              <motion.div
                key={item.slug}
                id={item.slug}
                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center scroll-mt-28"
                variants={fadeUp}
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "-15% 0px" }}
              >
                <div
                  className={`relative rounded-3xl overflow-hidden ${reversed ? "md:order-2" : ""}`}
                  style={{ aspectRatio: "4/3", boxShadow: "0 22px 48px -24px rgba(120,20,50,0.5)" }}
                >
                  <img
                    src={item.img}
                    alt={`${item.title} — ${t.work.categories[i]}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                <div className={reversed ? "md:order-1" : ""}>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.1em] px-3 py-1 rounded-lg"
                      style={{ background: "var(--color-paper-2)", border: "1px solid var(--color-line-ink)", color: "var(--color-wine)" }}
                    >
                      {t.work.tag}
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                      {t.work.categories[i]}
                    </span>
                  </div>
                  <h2 className="font-body text-2xl md:text-3xl mb-4" style={{ color: "var(--color-ink-deep)" }}>
                    {item.title}
                  </h2>
                  <p className="text-base leading-relaxed mb-4" style={{ color: "var(--color-ink-soft)" }}>
                    {t.projects.items[i].description}
                  </p>
                  {!item.url && (
                    <p className="text-sm font-medium" style={{ color: "var(--color-wine)" }}>
                      {t.work.comingSoon}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Back to the work section on the main page. */}
        <motion.div className="mt-20" variants={fadeUp} initial={reduce ? false : "hidden"} whileInView="visible" viewport={{ once: true }}>
          <a
            href="/#work"
            onClick={(e) => {
              e.preventDefault()
              navigate("/#work")
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--color-wine)" }}
          >
            <span aria-hidden="true">←</span>
            {t.projects.backCta}
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}
