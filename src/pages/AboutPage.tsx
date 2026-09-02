import { useEffect } from "react"
import { scrollToTarget } from "@/components/SmoothScroll"
import { About } from "@/components/About"
import { Footer } from "@/components/Footer"

/** The "About Us" tab — the founder story on its own page, over warm paper. */
export function AboutPage() {
  // Client-side navigation doesn't reset scroll on its own; start at the top.
  useEffect(() => {
    scrollToTarget(0)
  }, [])

  return (
    <div className="relative" style={{ background: "var(--color-paper)", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Extra top room clears the fixed nav pill where the hero used to sit. */}
        <div className="pt-16 md:pt-20">
          <About />
        </div>
        <Footer />
        <div className="h-16" aria-hidden="true" />
      </div>
    </div>
  )
}
