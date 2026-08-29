import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"
import { useState } from "react"
import { useActiveSection } from "@/hooks/useActiveSection"
import { MagneticButton } from "@/components/MagneticButton"

const links = ["Services", "Process", "Work", "Testimonials", "Contact"]
const sectionIds = ["services", "process", "work", "testimonials", "contact"]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(sectionIds)
  const reduce = useReducedMotion()

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60))

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="font-display text-xl tracking-tight"
          style={{ color: "var(--color-ink)" }}
          whileHover={{ scale: 1.02 }}
        >
          Page<span style={{ color: "var(--color-rose)" }}>Craft</span>
        </motion.div>

        {/* desktop links */}
        <div className="hidden md:flex gap-8">
          {links.map((l, i) => {
            const isActive = active === sectionIds[i]
            return (
              <motion.a
                key={l}
                href={`#${sectionIds[i]}`}
                className="relative text-sm font-medium tracking-wide transition-colors pb-1"
                style={{ color: isActive ? "var(--color-rose)" : "var(--color-ink-muted)" }}
                whileHover={{ color: "var(--color-rose)", y: -1 }}
              >
                {l}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute left-0 right-0 -bottom-0.5 h-px"
                    style={{ background: "var(--color-rose)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                )}
              </motion.a>
            )
          })}
        </div>

        <MagneticButton
          href="#contact"
          className="hidden md:block text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          style={{ background: "var(--color-rose)", color: "var(--color-void)" }}
          whileHover={{ scale: 1.05 }}
        >
          Get Started
        </MagneticButton>

        {/* hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[2px] w-6 rounded-full"
              style={{ background: "var(--color-ink)" }}
              animate={
                menuOpen
                  ? i === 1
                    ? { opacity: 0, x: 10 }
                    : i === 0
                    ? { rotate: 45, y: 7 }
                    : { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0, opacity: 1, x: 0 }
              }
              transition={{ duration: 0.25 }}
            />
          ))}
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-nav overflow-hidden"
          >
            <motion.div
              className="px-6 py-4 flex flex-col gap-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.04, delayChildren: 0.05 } } }}
            >
              {links.map((l, i) => (
                <motion.a
                  key={l}
                  href={`#${sectionIds[i]}`}
                  className="text-sm font-medium w-fit"
                  style={{ color: "var(--color-ink)" }}
                  onClick={() => setMenuOpen(false)}
                  variants={{
                    hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } },
                  }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                >
                  {l}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
