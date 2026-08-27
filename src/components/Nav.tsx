import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useActiveSection } from "@/hooks/useActiveSection"
import { MagneticButton } from "@/components/MagneticButton"

const links = ["Services", "Process", "Work", "Testimonials", "Contact"]
const sectionIds = ["services", "process", "work", "testimonials", "contact"]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="font-display text-xl tracking-tight"
          style={{ color: "#ada49a" }}
          whileHover={{ scale: 1.02 }}
        >
          Page<span style={{ color: "#828e73" }}>Craft</span>
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
                style={{ color: isActive ? "#828e73" : "rgba(173,164,154,0.85)" }}
                whileHover={{ color: "#828e73", y: -1 }}
              >
                {l}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute left-0 right-0 -bottom-0.5 h-px"
                    style={{ background: "#828e73" }}
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
          style={{ background: "#828e73", color: "#fff" }}
          whileHover={{ scale: 1.05, background: "#6e7a61" }}
        >
          Get Started
        </MagneticButton>

        {/* hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[2px] w-6 rounded-full"
              style={{ background: "#ada49a" }}
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
            className="md:hidden glass-dark overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l, i) => (
                <a
                  key={l}
                  href={`#${sectionIds[i]}`}
                  className="text-sm font-medium"
                  style={{ color: "#ada49a" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {l}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
