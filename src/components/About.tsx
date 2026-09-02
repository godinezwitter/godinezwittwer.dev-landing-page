import { motion, useReducedMotion } from "framer-motion"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { ScrollRevealText } from "@/components/ScrollRevealText"
import { useLang } from "@/i18n/language"

// Non-translatable per-founder data. The role, bio, and off-the-clock lines are
// pulled from the language dictionary by index.
const founders = [
  {
    initials: "JG",
    name: "Joel Godinez",
    tags: ["TypeScript", "React", "Angular", ".NET", "Java"],
    linkedin: "https://www.linkedin.com/in/joel-godinez-868085362",
  },
  {
    initials: "DW",
    name: "Dee Wittwer",
    tags: ["JavaScript", "C#", "Spring Boot", "React", "Angular"],
    linkedin: "https://www.linkedin.com/in/dee-wittwer-30719a323/",
  },
]

export function About() {
  const reduce = useReducedMotion()
  const { t } = useLang()

  // About is its own page now, always sitting at the very top of the viewport —
  // there's nothing to scroll it into view, so it reveals on mount rather than
  // being gated behind a scroll-triggered IntersectionObserver (which would
  // never fire, leaving the whole page blank).
  return (
    <motion.section
      id="about"
      className="relative py-28"
      variants={reduce ? undefined : wipeReveal}
      initial={reduce ? false : "hidden"}
      animate="visible"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Intro */}
        <motion.div
          className="max-w-3xl mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeUp}
            className="section-title mb-7"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            {t.about.headingPre}
            <em className="not-italic" style={{ color: "var(--color-wine)" }}>
              {t.about.headingEm}
            </em>
          </motion.h1>
          <ScrollRevealText
            key={t.about.intro}
            text={t.about.intro}
            className="text-lg leading-relaxed max-w-[64ch]"
            fromColor="#cabdb4"
            toColor="#3a2b30"
            immediate
          />
        </motion.div>

        {/* Founder cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              variants={fadeUp}
              className="surface rounded-3xl p-8"
              whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-5 mb-6">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 font-mono font-semibold"
                  style={{
                    background: "var(--color-paper-2)",
                    border: "1px solid var(--color-line-ink)",
                    color: "var(--color-wine)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {f.initials}
                </div>
                <div>
                  <h2 className="font-body text-2xl mb-1" style={{ color: "var(--color-ink-deep)" }}>
                    {f.name}
                  </h2>
                  <p
                    className="font-mono text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-wine)" }}
                  >
                    {t.about.role}
                  </p>
                </div>
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${f.name} ${t.about.linkedin}`}
                  className="ml-auto self-start w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{ background: "var(--color-paper-2)", border: "1px solid var(--color-line-ink)", color: "var(--color-wine)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-wine)"
                    e.currentTarget.style.color = "#fff"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--color-paper-2)"
                    e.currentTarget.style.color = "var(--color-wine)"
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.25 8.25h4.5V24h-4.5V8.25ZM8.5 8.25H12.8v2.15h.06c.6-1.08 2.06-2.22 4.24-2.22 4.54 0 5.38 2.99 5.38 6.87V24h-4.5v-6.98c0-1.66-.03-3.8-2.32-3.8-2.32 0-2.68 1.81-2.68 3.68V24H8.5V8.25Z" />
                  </svg>
                </a>
              </div>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--color-ink-soft)" }}>
                {t.about.bios[i]}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: "var(--color-paper-2)",
                      color: "var(--color-wine-deep)",
                      border: "1px solid var(--color-line-ink)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm" style={{ color: "var(--color-ink-soft)", opacity: 0.8 }}>
                {t.about.offs[i]}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
