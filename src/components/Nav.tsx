import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"
import { useState } from "react"
import { MagneticButton } from "@/components/MagneticButton"
import { useLang } from "@/i18n/language"
import { navigate, useRoute } from "@/router"
import type { Lang } from "@/i18n/translations"

const pillSpring = { type: "spring" as const, stiffness: 420, damping: 34 }

/** Segmented EN / DE switch. Reads on the dark glass pill and the mobile dropdown alike. */
function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang()
  const options: Lang[] = ["en", "de"]
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`flex items-center gap-0.5 rounded-lg p-0.5 ${className}`}
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      {options.map((opt) => {
        const active = lang === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setLang(opt)}
            aria-pressed={active}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors"
            style={{
              background: active ? "rgba(224, 86, 127, 0.18)" : "transparent",
              color: active ? "var(--color-rose)" : "var(--color-ink-muted)",
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const route = useRoute()
  const reduce = useReducedMotion()
  const { t } = useLang()

  const tabs = [
    { to: "/", label: t.nav.tabs.work },
    { to: "/projects", label: t.nav.tabs.projects },
    { to: "/about", label: t.nav.tabs.about },
  ]

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60))

  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 inset-x-0 z-50 flex flex-col items-center px-4 pt-4 pointer-events-none"
    >
      {/* The pill — capped at the same max-width as the page content (max-w-7xl)
          so on desktop it reads as wide as the sections it sits above, instead
          of hugging just its own content. */}
      <div className="w-full max-w-7xl md:px-6">
      <div
        className={`glass-pill${scrolled ? " glass-pill--solid" : ""} pointer-events-auto flex items-center gap-1 rounded-2xl p-1.5 pr-1.5 md:pr-2 md:w-full`}
      >
        {/* Monogram badge — the Godinez & Wittwer mark, links home */}
        <motion.a
          href="/#home"
          onClick={(e) => { e.preventDefault(); navigate("/#home") }}
          aria-label={t.nav.home}
          className="relative flex items-center justify-center w-9 h-9 rounded-lg shrink-0 before:absolute before:content-[''] before:-inset-1"
          style={{ background: "var(--color-wine)" }}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
        >
          <span
            className="font-mono font-semibold leading-none tracking-tight"
            style={{ color: "var(--color-ink)", fontSize: "0.72rem" }}
          >
            GW
          </span>
        </motion.a>

        {/* Desktop tabs with a sliding active pill — centered in the now-wider pill */}
        <div className="hidden md:flex items-center gap-0.5 px-1 ml-1">
          {tabs.map((tab) => {
            const isActive = route === tab.to
            return (
              <a
                key={tab.to}
                href={tab.to}
                onClick={(e) => { e.preventDefault(); navigate(tab.to) }}
                aria-current={isActive ? "page" : undefined}
                className="relative px-4 py-2 rounded-2xl text-sm font-medium transition-colors"
                style={{ color: isActive ? "var(--color-rose)" : "var(--color-ink-muted)" }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: "rgba(224, 86, 127, 0.16)", zIndex: 0 }}
                    transition={pillSpring}
                  />
                )}
                <span className="relative" style={{ zIndex: 1 }}>
                  {tab.label}
                </span>
              </a>
            )
          })}
        </div>

        {/* Language switch (desktop) */}
        <LangToggle className="hidden md:flex ml-auto mr-1" />

        {/* CTA — solid rose pill, magnetic (desktop) */}
        <MagneticButton
          href="/#contact"
          onClick={(e) => { e.preventDefault(); navigate("/#contact") }}
          className="hidden md:block text-sm font-semibold px-5 py-2 rounded-lg"
          style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
          whileHover={{ scale: 1.05 }}
        >
          {t.nav.cta}
        </MagneticButton>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden relative flex flex-col items-center justify-center gap-[5px] w-9 h-9 rounded-lg before:absolute before:content-[''] before:-inset-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[2px] w-4 rounded-full"
              style={{ background: "var(--color-ink)" }}
              animate={
                menuOpen
                  ? i === 1
                    ? { opacity: 0 }
                    : i === 0
                    ? { rotate: 45, y: 7 }
                    : { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.25 }}
            />
          ))}
        </button>
      </div>
      </div>

      {/* Mobile dropdown — a rounded glass panel beneath the pill */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="glass-pill glass-pill--solid pointer-events-auto md:hidden mt-2 w-[min(90vw,20rem)] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              className="p-3 flex flex-col"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: 0.04 } } }}
            >
              {tabs.map((tab) => {
                const isActive = route === tab.to
                return (
                  <motion.a
                    key={tab.to}
                    href={tab.to}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate(tab.to) }}
                    className="px-4 py-3 rounded-2xl text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? "var(--color-rose)" : "var(--color-ink)",
                      background: isActive ? "rgba(224, 86, 127, 0.14)" : "transparent",
                    }}
                    variants={{
                      hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } },
                    }}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                  >
                    {tab.label}
                  </motion.a>
                )
              })}

              {/* Language switch (mobile) */}
              <motion.div
                className="flex items-center justify-between px-4 py-3 mt-1"
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -8 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } },
                }}
              >
                <span className="text-sm font-medium" style={{ color: "var(--color-ink-muted)" }}>
                  {t.nav.language}
                </span>
                <LangToggle />
              </motion.div>

              <motion.a
                href="/#contact"
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate("/#contact") }}
                className="mt-1 px-4 py-3 rounded-lg text-sm font-semibold text-center"
                style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -8 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } },
                }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                {t.nav.cta}
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
