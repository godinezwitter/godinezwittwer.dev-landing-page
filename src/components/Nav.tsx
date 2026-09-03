import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { MagneticButton } from "@/components/MagneticButton"
import { gsap } from "@/lib/gsap"
import { useLang } from "@/i18n/language"
import { navigate, useRoute } from "@/router"
import type { Lang } from "@/i18n/translations"
import "./Nav.css"

/** Easing shared by every PillNav-derived tween — matches React Bits' default. */
const EASE = "power3.out"

/** Segmented EN / DE switch. `onLight` retunes it for the now-backgroundless bar
 * over the paper world; the default (dark) styling still serves the mobile dropdown. */
function LangToggle({ className = "", onLight = false }: { className?: string; onLight?: boolean }) {
  const { lang, setLang, t } = useLang()
  const options: Lang[] = ["en", "de"]
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`flex items-center gap-0.5 rounded-lg p-0.5 ${className}`}
      style={{
        background: onLight ? "rgba(30,18,22,0.04)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${onLight ? "rgba(30,18,22,0.1)" : "rgba(255,255,255,0.1)"}`,
      }}
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
              color: active ? (onLight ? "var(--color-wine)" : "var(--color-rose)") : onLight ? "var(--color-ink-soft)" : "var(--color-ink-muted)",
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
  // Auto-hide bar: slides up out of view on scroll-down, drops back in on
  // scroll-up (and is always shown near the top of the page).
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const route = useRoute()
  const reduce = useReducedMotion()
  const { t, lang } = useLang()

  const tabs = [
    { to: "/", label: t.nav.tabs.work },
    { to: "/projects", label: t.nav.tabs.projects },
    { to: "/about", label: t.nav.tabs.about },
  ]

  const lastY = useRef(0)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = lastY.current
    lastY.current = y
    if (menuOpen || y < 72) {
      setHidden(false)
      return
    }
    if (Math.abs(y - prev) < 6) return // ignore sub-pixel / momentum jitter
    setHidden(y > prev) // scrolling down hides, scrolling up reveals
  })

  // --- PillNav hover mechanics (recreated from React Bits) -------------------
  // Per-tab: a paused GSAP timeline that grows the wine circle from the pill's
  // bottom edge and swaps the label for its off-white twin. Enter/leave scrub it.
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([])
  const tlRefs = useRef<Array<ReturnType<typeof gsap.timeline> | null>>([])
  const tweenRefs = useRef<Array<ReturnType<typeof gsap.to> | null>>([])
  const navItemsRef = useRef<HTMLDivElement | null>(null)
  const logoBadgeRef = useRef<HTMLSpanElement | null>(null)
  const logoTweenRef = useRef<ReturnType<typeof gsap.to> | null>(null)

  // Build (and rebuild on resize / font load / language change) the reveal
  // timelines. Their geometry — circle diameter and transform-origin — is
  // derived from each pill's box so the growing arc lands flush with its
  // rounded rect, exactly as PillNav computes it.
  useEffect(() => {
    if (reduce) return

    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        const pill = circle?.parentElement as HTMLElement | null
        if (!circle || !pill) return

        const { width: w, height: h } = pill.getBoundingClientRect()
        if (!w || !h) return

        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

        const label = pill.querySelector<HTMLElement>(".pill-tab__label")
        const hover = pill.querySelector<HTMLElement>(".pill-tab__label--hover")
        if (label) gsap.set(label, { y: 0 })
        if (hover) gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 })

        tlRefs.current[i]?.kill()
        const tl = gsap.timeline({ paused: true })
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: EASE, overwrite: "auto" }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease: EASE, overwrite: "auto" }, 0)
        if (hover) tl.to(hover, { y: 0, opacity: 1, duration: 2, ease: EASE, overwrite: "auto" }, 0)
        tlRefs.current[i] = tl
      })
    }

    layout()
    window.addEventListener("resize", layout)
    document.fonts?.ready.then(layout).catch(() => {})

    const tweens = tweenRefs.current
    const tls = tlRefs.current
    return () => {
      window.removeEventListener("resize", layout)
      tweens.forEach((tw) => tw?.kill())
      tls.forEach((tl) => tl?.kill())
    }
  }, [reduce, lang])

  // One-time load-in: the logo badge pops from nothing and the tab group opens
  // from zero width, left to right — PillNav's `initialLoadAnimation`.
  useEffect(() => {
    if (reduce) return

    if (logoBadgeRef.current) {
      gsap.fromTo(logoBadgeRef.current, { scale: 0 }, { scale: 1, duration: 0.6, ease: EASE })
    }
    const row = navItemsRef.current
    if (row) {
      gsap.set(row, { width: 0, overflow: "hidden" })
      gsap.to(row, {
        width: "auto",
        duration: 0.6,
        ease: EASE,
        onComplete: () => {
          row.style.width = ""
          row.style.overflow = ""
        },
      })
    }
    // Intentionally mount-only: language changes must not replay the intro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    tweenRefs.current[i]?.kill()
    tweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease: EASE, overwrite: "auto" })
  }

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    tweenRefs.current[i]?.kill()
    tweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease: EASE, overwrite: "auto" })
  }

  const handleLogoEnter = () => {
    const badge = logoBadgeRef.current
    if (!badge || reduce) return
    logoTweenRef.current?.kill()
    gsap.set(badge, { rotate: 0 })
    logoTweenRef.current = gsap.to(badge, { rotate: 360, duration: 0.5, ease: EASE, overwrite: "auto" })
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={hidden ? { y: "-120%", opacity: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex flex-col items-center px-4 pt-4 pointer-events-none"
    >
      {/* No background surface any more — the controls float directly over the
          page. Capped at the page content width (max-w-7xl); pointer events are
          re-enabled per control so the empty gaps don't block the content. */}
      <div className="w-full max-w-7xl md:px-6">
      <div className="flex items-center gap-1 w-full p-1.5 pr-1.5 md:pr-2">
        {/* Monogram badge — the Godinez & Wittwer mark, links home. Spins 360°
            on hover, PillNav-style (the badge span is the tween target). */}
        <a
          href="/#home"
          onClick={(e) => { e.preventDefault(); navigate("/#home") }}
          onMouseEnter={handleLogoEnter}
          aria-label={t.nav.home}
          className="pointer-events-auto relative flex items-center justify-center w-9 h-9 rounded-lg shrink-0 before:absolute before:content-[''] before:-inset-1"
          style={{ background: "var(--color-wine)" }}
        >
          <span
            ref={logoBadgeRef}
            className="font-mono font-semibold leading-none tracking-tight"
            style={{ color: "var(--color-ink)", fontSize: "0.72rem" }}
          >
            GW
          </span>
        </a>

        {/* Desktop tabs — each a pill with the PillNav circular reveal + label swap */}
        <div ref={navItemsRef} className="pointer-events-auto hidden md:flex items-center gap-0.5 px-1 ml-1">
          {tabs.map((tab, i) => {
            const isActive = route === tab.to
            return (
              <span key={tab.to} className="relative inline-flex">
                <a
                  href={tab.to}
                  onClick={(e) => { e.preventDefault(); navigate(tab.to) }}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                  aria-current={isActive ? "page" : undefined}
                  className="pill-tab px-4 py-2 rounded-2xl text-sm font-medium"
                  style={{ color: isActive ? "var(--color-wine)" : "var(--color-ink-soft)" }}
                >
                  <span
                    className="pill-tab__circle"
                    aria-hidden="true"
                    ref={(el) => { circleRefs.current[i] = el }}
                  />
                  <span className="pill-tab__label-stack">
                    <span className="pill-tab__label">{tab.label}</span>
                    <span className="pill-tab__label--hover" aria-hidden="true">
                      {tab.label}
                    </span>
                  </span>
                </a>
                {isActive && <span className="pill-tab__dot" aria-hidden="true" />}
              </span>
            )
          })}
        </div>

        {/* Language switch (desktop) */}
        <LangToggle className="pointer-events-auto hidden md:flex ml-auto mr-1" onLight />

        {/* CTA — solid rose pill, magnetic (desktop) */}
        <MagneticButton
          href="/#contact"
          onClick={(e) => { e.preventDefault(); navigate("/#contact") }}
          className="pointer-events-auto hidden md:block text-sm font-semibold px-5 py-2 rounded-lg"
          style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
          whileHover={{ scale: 1.05 }}
        >
          {t.nav.cta}
        </MagneticButton>

        {/* Hamburger (mobile) */}
        <button
          className="pointer-events-auto md:hidden relative flex flex-col items-center justify-center gap-[5px] w-9 h-9 ml-auto rounded-lg before:absolute before:content-[''] before:-inset-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[2px] w-4 rounded-full"
              style={{ background: "var(--color-ink-deep)" }}
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

      {/* Mobile dropdown — a rounded glass panel beneath the bar. Keeps its own
          surface: it overlays page content and needs to stay readable. */}
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
