import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { MagneticButton } from "@/components/MagneticButton"
import { ImageRevealBackground } from "@/components/ImageRevealBackground"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { useLang } from "@/i18n/language"
import heroKnightBase from "@/imports/hero-knight-base.jpg"
import heroKnightReveal from "@/imports/hero-knight-reveal.jpg"

/** Editorial hero in the light "paper" world — the same typographic voice,
 * kicker eyebrow, and fade-up reveals as every section below it. A halftone
 * illustration fills the whole section as a background (see
 * ImageRevealBackground): a kneeling knight in a plain field by default, the
 * same field turned to blowing roses wherever the cursor's spotlight lands.
 * The headline's final word cycles through the studio's outcomes (convert /
 * load fast / …); reduced-motion holds it on the first word. */
export function Hero() {
  const reduce = useReducedMotion()
  const { t } = useLang()
  const rotatingWords = t.hero.rotating
  const [wordIndex, setWordIndex] = useState(0)

  // Cycle the headline's last word. Re-keyed on word count so switching
  // language restarts cleanly instead of pointing at a stale index.
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2200)
    return () => clearInterval(id)
  }, [reduce, rotatingWords.length])

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20"
      style={{ background: "var(--color-paper)" }}
    >
      {/* The knight fills the whole section as a background layer — everything
          else stacks on top of it. The art places him in the right two-thirds
          of the frame with open sky/field on the left, so "right top" keeps
          him in frame under `cover` instead of cropping him out on a narrow
          or unusually tall viewport, and leaves the left side clear for the
          pitch panel to sit on plain ground rather than over his figure. */}
      <ImageRevealBackground
        baseImage={heroKnightBase}
        revealImage={heroKnightReveal}
        backgroundPosition="right top"
        className="absolute inset-0"
      />
      {/* Same warm paper grain the rest of the light world carries. */}
      <div className="grain-overlay" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
        {/* The pitch, on its own translucent paper panel — a gradient scrim
            can't guarantee contrast against a full-bleed illustration whose
            dark linework lands wherever `cover` happens to crop it, but a
            panel with its own background always can, and reads as an
            intentional card rather than a legibility patch. */}
        <motion.div
          className="min-w-0 max-w-3xl rounded-3xl px-6 py-8 md:px-10 md:py-10"
          style={{ background: "rgba(250,246,242,0.88)", backdropFilter: "blur(6px)" }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={fadeUp} className="kicker mb-5">
            {t.hero.kicker}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="section-title mb-6"
            style={{ fontSize: "clamp(2.5rem, 5.6vw, 4.4rem)", lineHeight: 1.04 }}
            // The last line is a stack of absolutely-positioned words with no
            // whitespace between them; give assistive tech one clean sentence.
            aria-label={`${t.hero.line1} ${t.hero.line2} ${rotatingWords[wordIndex]}`}
          >
            <span aria-hidden="true" className="block">
              {t.hero.line1}
            </span>
            <span aria-hidden="true" className="block">
              {t.hero.line2}
            </span>
            {/* The final word rotates through outcomes every couple of seconds.
                The words are stacked absolutely and cross-fade by toggling
                opacity, so the line height stays fixed and nothing shifts. */}
            <span
              aria-hidden="true"
              className="relative block"
              style={{ color: "var(--color-wine)", height: "1.15em" }}
            >
              {rotatingWords.map((word, i) => {
                const active = i === wordIndex
                return (
                  <span
                    key={word}
                    aria-hidden={active ? undefined : true}
                    className="absolute left-0 top-0 whitespace-nowrap"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: reduce ? "none" : `translateY(${active ? "0" : "0.35em"})`,
                      transition: reduce ? undefined : "opacity 0.5s ease, transform 0.5s ease",
                    }}
                  >
                    {word}
                  </span>
                )
              })}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg leading-relaxed mb-9 max-w-[52ch]"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {t.hero.subhead}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <MagneticButton
              href="#contact"
              className="px-7 py-3.5 rounded-lg font-semibold text-sm"
              style={{
                background: "var(--color-wine)",
                color: "#fff",
                boxShadow: "0 12px 28px -12px rgba(184,48,92,0.55)",
              }}
              whileHover={{ scale: 1.04 }}
            >
              {t.hero.ctaPrimary}
            </MagneticButton>
            <MagneticButton
              href="#work"
              className="px-7 py-3.5 rounded-lg font-semibold text-sm"
              style={{
                background: "var(--color-paper-2)",
                color: "var(--color-ink-deep)",
                border: "1px solid var(--color-line-ink)",
              }}
              whileHover={{ scale: 1.04 }}
            >
              {t.hero.ctaSecondary}
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
