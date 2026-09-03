import { useEffect } from "react"
import { scrollToTarget } from "@/components/SmoothScroll"
import { Projects } from "@/components/Projects"
import { Footer } from "@/components/Footer"

/** The "Our Projects" tab — each concept build's own detail section, linked
 * to from the portfolio cards on the main page. */
export function OurProjectsPage() {
  // Client-side navigation doesn't reset scroll on its own. Land on the
  // requested project's anchor (e.g. arriving via a card click) once it's
  // actually mounted, otherwise start at the top like any other page.
  useEffect(() => {
    const hash = window.location.hash
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (hash) scrollToTarget(hash)
        else scrollToTarget(0)
      }),
    )
  }, [])

  return (
    <div className="relative" style={{ background: "var(--color-paper)", minHeight: "100vh" }}>
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Extra top room clears the fixed nav pill where the hero used to sit. */}
        <div className="pt-16 md:pt-20">
          <Projects />
        </div>
        <Footer />
        <div className="h-16" aria-hidden="true" />
      </div>
    </div>
  )
}
