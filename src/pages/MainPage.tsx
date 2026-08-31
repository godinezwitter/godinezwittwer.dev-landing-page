import { useEffect } from "react"
import { ScrollTrigger } from "@/lib/gsap"
import { scrollToTarget } from "@/components/SmoothScroll"
import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { Process } from "@/components/Process"
import { Portfolio } from "@/components/Portfolio"
import { Testimonials } from "@/components/Testimonials"

/** The main "Work" tab: the pinned hero and everything that flows out of it. */
export function MainPage() {
  // Arriving from another page (or a deep link like /#contact), land on the
  // right anchor once the pinned hero's spacers have settled the layout.
  useEffect(() => {
    const hash = window.location.hash
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        if (hash) scrollToTarget(hash)
      }),
    )
  }, [])

  return (
    <>
      <Hero />

      {/* Light world — the page breathes out of the dark hero into warm paper. */}
      <div className="relative" style={{ background: "var(--color-paper)" }}>
        <div className="grain-overlay" aria-hidden="true" />
        {/* Authored seam: the burgundy hero resolves into paper instead of cutting. */}
        <div className="hero-seam h-24 md:h-36" aria-hidden="true" />
        <div className="relative" style={{ zIndex: 1 }}>
          <Services />
          <Process />
          <Portfolio />
          <Testimonials />
        </div>
      </div>
    </>
  )
}
