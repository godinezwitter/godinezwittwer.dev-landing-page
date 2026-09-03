import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { MagneticButton } from "@/components/MagneticButton"
import { VideoRevealBackground } from "@/components/VideoRevealBackground"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { useLang } from "@/i18n/language"
import heroFigureVideo from "@/imports/hero-figure.webm"

/** Static editorial hero in the light "paper" world — the same typographic
 * voice, kicker eyebrow, and fade-up reveals as every section below it, so the
 * page opens in one continuous vibe instead of a dark 3D prelude. The headline's
 * final word cycles through the studio's outcomes (convert / load fast / …);
 * reduced-motion holds it on the first word. No scroll-driven scenes, no WebGL. */
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
      {/* Same warm paper grain the rest of the light world carries. */}
      <div className="grain-overlay" aria-hidden="true" />
      {/* Soft blush bloom bleeding in from the top-right corner — the same warm
          accent the section cards carry, kept mostly off-canvas so it reads as a
          faint glow rather than a wash. */}
      <div
        className="absolute -top-40 -right-32 w-[20rem] h-[20rem] md:-top-48 md:-right-44 md:w-[34rem] md:h-[34rem] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "var(--color-blush)", opacity: 0.28 }}
        aria-hidden="true"
      />
      {/* Graph-paper ruling across the whole hero. Sits after the bloom so the
          lines read as printed on the paper rather than lit from behind it. */}
      <div className="grid-paper" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
        {/* The pitch, centered — the walking figure below is the hero's single
            focal point, so the copy above it reads as a centered masthead
            instead of competing for a side of the page. */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
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
                opacity, so the line height stays fixed and nothing shifts.
                Anchored to the line's center (not its left edge) so every
                candidate word — different widths — sits under the centered
                headline instead of drifting to the block's left edge. */}
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
                    className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: reduce
                        ? "translateX(-50%)"
                        : `translateX(-50%) translateY(${active ? "0" : "0.35em"})`,
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
            className="text-lg leading-relaxed mb-9 max-w-[52ch] mx-auto"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {t.hero.subhead}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
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

        {/* The studio's mark, dead center below the pitch: a halftone figure
            read as ink on the page (see VideoRevealBackground), sharpening
            under a cursor-following spotlight. */}
        <motion.div
          className="relative mx-auto mt-14 md:mt-16 w-full max-w-md aspect-[3/4]"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <VideoRevealBackground
            src={heroFigureVideo}
            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
          />
        </motion.div>
      </div>
    </section>
  )
}
