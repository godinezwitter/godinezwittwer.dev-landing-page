import { motion, useReducedMotion } from "framer-motion"
import { MagneticButton } from "@/components/MagneticButton"
import { navigate } from "@/router"
import { useLang } from "@/i18n/language"

/** Branded not-found view for any unknown path (rendered by App's router). */
export function NotFound() {
  const { t } = useLang()
  const reduce = useReducedMotion()

  return (
    <div className="relative flex flex-col" style={{ background: "var(--color-paper)", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-20" style={{ zIndex: 1 }}>
        {/* Ambient wine wash so the empty page still has depth. */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] max-w-full rounded-full blur-[120px] pointer-events-none"
          style={{ background: "var(--color-blush)", opacity: 0.3 }}
          aria-hidden="true"
        />
        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <span
            className="font-serif font-semibold tabular-nums block mb-4"
            style={{ fontSize: "clamp(4.5rem, 16vw, 9rem)", lineHeight: 0.9, letterSpacing: "-0.03em", color: "var(--color-wine)" }}
          >
            {t.notFound.code}
          </span>
          <h1 className="section-title mb-4" style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}>
            {t.notFound.title}
          </h1>
          <p className="text-base md:text-lg leading-relaxed mx-auto max-w-[46ch] mb-9" style={{ color: "var(--color-ink-soft)" }}>
            {t.notFound.body}
          </p>
          <MagneticButton
            href="/"
            onClick={(e) => { e.preventDefault(); navigate("/") }}
            className="inline-block px-7 py-3.5 rounded-lg font-semibold text-sm"
            style={{ background: "var(--color-wine)", color: "#fff", boxShadow: "0 12px 28px -12px rgba(184,48,92,0.55)" }}
            whileHover={{ scale: 1.03 }}
          >
            {t.notFound.cta}
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  )
}
