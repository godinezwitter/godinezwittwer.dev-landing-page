import { MotionConfig } from "framer-motion"
import { SmoothScroll } from "@/components/SmoothScroll"
import { PageIntro } from "@/components/PageIntro"
import { Nav } from "@/components/Nav"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Services } from "@/components/Services"
import { Process } from "@/components/Process"
import { Portfolio } from "@/components/Portfolio"
import { Testimonials } from "@/components/Testimonials"

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <SmoothScroll />
        <PageIntro />
        <Nav />
        <Hero />

        {/* Light world — the page breathes out of the dark hero into warm paper. */}
        <div className="relative" style={{ background: "var(--color-paper)" }}>
          <div className="grain-overlay" aria-hidden="true" />
          {/* Authored seam: the burgundy hero resolves into paper instead of cutting. */}
          <div className="hero-seam h-24 md:h-36" aria-hidden="true" />
          <div className="relative" style={{ zIndex: 1 }}>
            <About />
            <Services />
            <Process />
            <Portfolio />
            <Testimonials />
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
