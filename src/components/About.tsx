import { motion, useReducedMotion } from "framer-motion"
import { useSection } from "@/hooks/useSection"
import { fadeUp, staggerContainer, wipeReveal } from "@/lib/motion"
import { ScrollRevealText } from "@/components/ScrollRevealText"

const founders = [
  {
    initials: "JG",
    name: "Joel Godinez",
    role: "Full-stack engineer",
    bio: "Front-end and motion lead. Comfortable across the stack — from React interfaces down to Spring Boot and .NET services.",
    tags: ["TypeScript", "React", "Angular", ".NET", "Java"],
    off: "Off the clock — skiing, gym, music, food.",
    linkedin: "https://www.linkedin.com/in/joel-godinez-868085362",
  },
  {
    initials: "DW",
    name: "Dee Witter",
    role: "Full-stack engineer",
    bio: "Design and back-end lead. Sweats the details on layout and copy, then makes the whole thing run on solid, tested code.",
    tags: ["JavaScript", "C#", "Spring Boot", "React", "Angular"],
    off: "Off the clock — football, cooking, music, fashion.",
    linkedin: "https://www.linkedin.com/in/dee-wittwer-30719a323/",
  },
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
        {/* Intro */}
        <motion.div
          className="max-w-3xl mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.span variants={fadeUp} className="kicker mb-5">
            Who we are
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif leading-[1.05] mb-7"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "var(--color-ink-deep)", textWrap: "balance" }}
          >
            Two engineers who'd rather{" "}
            <em className="not-italic" style={{ color: "var(--color-wine)" }}>
              build than talk
            </em>
          </motion.h2>
          <ScrollRevealText
            text="We're Joel Godinez and Dee Witter — third-year full-stack apprentices at Swiss Post by day, a two-person web studio the rest of the time. We build client sites the same way we ship production software: clean code, real testing, no shortcuts."
            className="text-lg leading-relaxed max-w-[64ch]"
            fromColor="#cabdb4"
            toColor="#3a2b30"
          />
        </motion.div>

        {/* Founder cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {founders.map((f) => (
            <motion.div
              key={f.name}
              variants={fadeUp}
              className="surface rounded-3xl p-8"
              whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-5 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-mono font-semibold"
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
                  <h3 className="font-serif text-2xl mb-1" style={{ color: "var(--color-ink-deep)" }}>
                    {f.name}
                  </h3>
                  <p
                    className="font-mono text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-wine)" }}
                  >
                    {f.role}
                  </p>
                </div>
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${f.name} on LinkedIn`}
                  className="ml-auto self-start w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
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
                {f.bio}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {f.tags.map((t) => (
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
              <p className="text-sm" style={{ color: "var(--color-ink-soft)", opacity: 0.8 }}>
                {f.off}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
